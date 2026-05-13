// Export Supabase tables → public/data/*.json for static site build
//
// 使い方:
//   npx tsx scripts/export-static-data.ts             # 全表 single-file
//   npx tsx scripts/export-static-data.ts --per-pref  # 県別分割(4 表のみ・推奨)
//   npx tsx scripts/export-static-data.ts --core      # core 表のみ(地誌 + 寄送)
//   npx tsx scripts/export-static-data.ts --report    # サイズだけ確認(書き出さない)
//
// 出力先:
//   single mode  : public/data/{table}.json
//   per-pref mode: 大表は public/data/by-pref/{pref}/{table}.json
//                  小表は public/data/{table}.json(変わらず)
//   _index.json  : 目録(両 mode 共通)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";
import { mkdir, writeFile, stat } from "fs/promises";
import { gzipSync } from "zlib";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "public", "data");
const REPORT_ONLY = process.argv.includes("--report");
const CORE_ONLY = process.argv.includes("--core");
const PER_PREF = process.argv.includes("--per-pref");

interface TableSpec {
  name: string;
  /** core = 地誌 + 寄送 必須。--core で抜き出すフラグ */
  core: boolean;
  /** order by column(distance ranking 等で必要なら) */
  orderBy?: string;
  /** 巨大テーブルは select で列を絞る場合のオプション */
  select?: string;
  /** 既知 row count(進捗表示用) */
  hint?: number;
  /** --per-pref で分割するときの prefecture 列名(指定なし=分割しない) */
  splitBy?: string;
}

// 47 卷地誌(必須)
const TABLES_CHIRYI: TableSpec[] = [
  {
    name: "japan_entries",
    core: true,
    orderBy: "id",
    splitBy: "prefecture_ja", // --per-pref で分割
    hint: 3182,
  },
  { name: "japan_municipalities", core: true, orderBy: "lg_code", hint: 1794 },
  { name: "japan_sakura_forecast", core: false, orderBy: "spot_id", hint: 68 },
];

// 行李寄送(初衷)— core utility
// 注:hotels.geog / yuu_post_offices.geog / hotels.raw は PostGIS / JSONB で巨大 → 列除外
const TABLES_LUGGAGE: TableSpec[] = [
  {
    name: "yamato_branches",
    core: true,
    orderBy: "branch_code",
    splitBy: "prefecture",
    hint: 6015,
  },
  { name: "yamato_airport_counters", core: true, orderBy: "id", hint: 33 },
  { name: "yamato_fares", core: true, orderBy: "from_pref", hint: 17672 },
  { name: "yamato_intl_fares", core: true, orderBy: "id", hint: 7 },
  {
    name: "yuu_post_offices",
    core: true,
    orderBy: "osm_id",
    splitBy: "prefecture",
    select:
      "osm_id, name_jp, name_en, address_jp, prefecture, postal_code, phone, opening_hours, website, lat, lon",
    hint: 21415,
  },
  { name: "yuu_pack_fares", core: true, orderBy: "from_pref", hint: 15463 },
  { name: "yuu_intl_fares", core: true, orderBy: "id", hint: 396 },
  { name: "intl_country_conditions", core: true, orderBy: "country_iso2", hint: 1 },
  {
    name: "hotels",
    core: true,
    orderBy: "rakuten_hotel_no",
    splitBy: "prefecture",
    select:
      "rakuten_hotel_no, name_jp, name_kana, prefecture, address1, address2, postal_code, phone, lat, lon, brand, brand_can_send, rakuten_url, min_charge_jpy, review_count, review_average",
    hint: 42345,
  },
];

// 補助・参考(static でも価値あり、サイズ次第で含める)
const TABLES_AUX: TableSpec[] = [
  { name: "fare_history", core: false, orderBy: "captured_at", hint: 99405 },
  { name: "postal_codes", core: false, orderBy: "postal_code", hint: 120677 },
];

// 全合計
const ALL_TABLES = [...TABLES_CHIRYI, ...TABLES_LUGGAGE, ...TABLES_AUX];

interface ExportResult {
  table: string;
  rows: number;
  bytesRaw: number;
  bytesGzip: number;
  durationMs: number;
  skipped: boolean;
  reason?: string;
  /** per-pref mode の場合・分割した県数 */
  splitInto?: number;
  /** 各県の最大ファイル size(per-pref のみ) */
  maxPrefBytes?: number;
}

/** prefecture 名(日本語含む)を URL/path 安全な slug に変換 */
function prefSlug(pref: string): string {
  return encodeURIComponent(pref);
}

async function fetchAllRows(
  sb: ReturnType<typeof createAdminClient>,
  spec: TableSpec,
): Promise<Record<string, unknown>[]> {
  const PAGE = 1000;
  const all: Record<string, unknown>[] = [];
  for (let off = 0; ; off += PAGE) {
    let q = sb
      .from(spec.name)
      .select(spec.select ?? "*")
      .range(off, off + PAGE - 1);
    if (spec.orderBy) q = q.order(spec.orderBy);
    const { data, error } = await q;
    if (error) throw new Error(`${spec.name}: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...(data as unknown as Record<string, unknown>[]));
    if (data.length < PAGE) break;
    // cheap progress for big tables
    if (spec.hint && spec.hint > 5000) {
      process.stdout.write(
        `\r  [${spec.name}] ${all.length}/${spec.hint}`,
      );
    }
  }
  if (spec.hint && spec.hint > 5000) process.stdout.write("\n");
  return all;
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
  return `${(n / 1024 / 1024).toFixed(2)}MB`;
}

async function exportTable(
  sb: ReturnType<typeof createAdminClient>,
  spec: TableSpec,
): Promise<ExportResult> {
  const t0 = Date.now();
  if (CORE_ONLY && !spec.core) {
    return {
      table: spec.name,
      rows: 0,
      bytesRaw: 0,
      bytesGzip: 0,
      durationMs: 0,
      skipped: true,
      reason: "non-core (--core mode)",
    };
  }

  const rows = await fetchAllRows(sb, spec);
  if (rows.length === 0) {
    return {
      table: spec.name,
      rows: 0,
      bytesRaw: 0,
      bytesGzip: 0,
      durationMs: Date.now() - t0,
      skipped: true,
      reason: "empty table",
    };
  }

  // --per-pref + splitBy 指定の場合は県別に分割書き出し
  if (PER_PREF && spec.splitBy) {
    const grouped = new Map<string, Record<string, unknown>[]>();
    let nullPref = 0;
    for (const r of rows) {
      const pref = (r[spec.splitBy] as string | null | undefined) ?? null;
      const bucket = pref || "_no_pref"; // null/empty は _no_pref へ(失わない)
      if (!pref) nullPref++;
      const arr = grouped.get(bucket) ?? [];
      arr.push(r);
      grouped.set(bucket, arr);
    }

    let totalRaw = 0;
    let totalGz = 0;
    let maxPrefBytes = 0;
    if (!REPORT_ONLY) {
      await mkdir(path.join(OUT_DIR, "by-pref"), { recursive: true });
    }
    for (const [pref, prefRows] of grouped.entries()) {
      const json = JSON.stringify(prefRows);
      const buf = Buffer.from(json, "utf-8");
      totalRaw += buf.byteLength;
      totalGz += gzipSync(buf).byteLength;
      maxPrefBytes = Math.max(maxPrefBytes, buf.byteLength);
      if (!REPORT_ONLY) {
        const dir = path.join(OUT_DIR, "by-pref", prefSlug(pref));
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, `${spec.name}.json`), buf);
      }
    }

    return {
      table: spec.name,
      rows: rows.length,
      bytesRaw: totalRaw,
      bytesGzip: totalGz,
      durationMs: Date.now() - t0,
      skipped: false,
      splitInto: grouped.size,
      maxPrefBytes,
      reason: nullPref > 0 ? `${nullPref} rows had null ${spec.splitBy}` : undefined,
    };
  }

  // 通常 single-file モード
  const json = JSON.stringify(rows);
  const buf = Buffer.from(json, "utf-8");
  const bytesRaw = buf.byteLength;
  const bytesGzip = gzipSync(buf).byteLength;

  if (!REPORT_ONLY) {
    const outPath = path.join(OUT_DIR, `${spec.name}.json`);
    await writeFile(outPath, buf);
  }

  return {
    table: spec.name,
    rows: rows.length,
    bytesRaw,
    bytesGzip,
    durationMs: Date.now() - t0,
    skipped: false,
  };
}

async function main() {
  const sb = createAdminClient();

  if (!REPORT_ONLY) {
    await mkdir(OUT_DIR, { recursive: true });
  }

  const modeFlags = [
    REPORT_ONLY ? "report-only" : "write",
    CORE_ONLY ? "core-only" : "all",
    PER_PREF ? "per-pref" : "single-file",
  ];
  console.log(`[export] mode: ${modeFlags.join(" / ")}`);
  console.log(`[export] target: ${OUT_DIR}\n`);

  const results: ExportResult[] = [];
  for (const spec of ALL_TABLES) {
    try {
      const r = await exportTable(sb, spec);
      results.push(r);
      if (r.skipped) {
        console.log(`  ⊘ ${spec.name.padEnd(28)} ${r.reason}`);
      } else {
        const splitInfo = r.splitInto
          ? ` · split×${r.splitInto} (max ${fmtBytes(r.maxPrefBytes ?? 0)})`
          : "";
        const note = r.reason ? ` · ${r.reason}` : "";
        console.log(
          `  ✓ ${spec.name.padEnd(28)} ${String(r.rows).padStart(6)} rows · ` +
            `${fmtBytes(r.bytesRaw).padStart(8)} raw · ${fmtBytes(r.bytesGzip).padStart(7)} gz · ` +
            `${r.durationMs}ms${splitInfo}${note}`,
        );
      }
    } catch (e) {
      console.error(`  ✗ ${spec.name}: ${(e as Error).message}`);
      results.push({
        table: spec.name,
        rows: 0,
        bytesRaw: 0,
        bytesGzip: 0,
        durationMs: 0,
        skipped: true,
        reason: `error: ${(e as Error).message.slice(0, 60)}`,
      });
    }
  }

  // Summary
  const totalRaw = results.reduce((s, r) => s + r.bytesRaw, 0);
  const totalGz = results.reduce((s, r) => s + r.bytesGzip, 0);
  const totalRows = results.reduce((s, r) => s + r.rows, 0);
  console.log("\n" + "=".repeat(70));
  console.log(
    `[total] ${totalRows} rows · ${fmtBytes(totalRaw)} raw · ${fmtBytes(totalGz)} gzipped`,
  );

  // Write index
  if (!REPORT_ONLY) {
    const index = {
      generatedAt: new Date().toISOString(),
      mode: {
        core: CORE_ONLY,
        perPref: PER_PREF,
      },
      tables: results
        .filter((r) => !r.skipped)
        .map((r) => ({
          name: r.table,
          rows: r.rows,
          bytes: r.bytesRaw,
          splitInto: r.splitInto,
          maxPrefBytes: r.maxPrefBytes,
        })),
      totals: {
        rows: totalRows,
        bytesRaw: totalRaw,
        bytesGzip: totalGz,
      },
    };
    await writeFile(
      path.join(OUT_DIR, "_index.json"),
      JSON.stringify(index, null, 2),
    );
    console.log(`\n[done] wrote ${OUT_DIR}/{*.json,by-pref/*,_index.json}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
