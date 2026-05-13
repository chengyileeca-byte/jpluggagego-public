// Import 全国地方公共団体コード (LG Code) from 総務省 Excel into
// public.japan_municipalities.
//
// Source: https://www.soumu.go.jp/denshijiti/code.html
//   総務省 each year publishes an updated Excel; the download URL changes
//   every year. Default URL below is the 令和5年5月1日 edition. Override
//   with --url <new> or download manually and pass --file <path>.
//
// Excel columns (standard 6 cols, sheet 0):
//   A: 団体コード(6位,5位 lg_code + 1位 checksum)
//   B: 都道府県名(漢字)
//   C: 市区町村名(漢字)         — prefecture-only rows leave this empty
//   D: 都道府県名(カナ)
//   E: 市区町村名(カナ)
//
// Usage:
//   npm run import:municipalities:dry             # parse only, show samples
//   npm run import:municipalities                 # full upsert (~1900 rows)
//   npm run import:municipalities -- --file ./foo.xlsx
//   npm run import:municipalities -- --url https://...new.xlsx
//   npm run import:municipalities -- --limit 50

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as XLSX from "xlsx";
import { createAdminClient } from "../src/lib/supabase/admin";
import { HOKKAIDO_SUBPREFECTURE_BY_LG_CODE } from "./lib/hokkaido-subprefectures";

const DEFAULT_URL = "https://www.soumu.go.jp/main_content/000925835.xlsx";
const DRY = process.argv.includes("--dry-run");
const LIMIT_ARG = process.argv.indexOf("--limit");
const LIMIT =
  LIMIT_ARG >= 0 ? Number(process.argv[LIMIT_ARG + 1]) : Infinity;
const URL_ARG = process.argv.indexOf("--url");
const URL = URL_ARG >= 0 ? process.argv[URL_ARG + 1] : DEFAULT_URL;
const FILE_ARG = process.argv.indexOf("--file");
const LOCAL_FILE = FILE_ARG >= 0 ? process.argv[FILE_ARG + 1] : undefined;

type Region =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";

// 47 都道府縣 → 9 大區域。三重県歸 kansai(文部科學省標準分類)。
const REGION_OF_PREF: Record<string, Region> = {
  北海道: "hokkaido",
  青森県: "tohoku",
  岩手県: "tohoku",
  宮城県: "tohoku",
  秋田県: "tohoku",
  山形県: "tohoku",
  福島県: "tohoku",
  茨城県: "kanto",
  栃木県: "kanto",
  群馬県: "kanto",
  埼玉県: "kanto",
  千葉県: "kanto",
  東京都: "kanto",
  神奈川県: "kanto",
  新潟県: "chubu",
  富山県: "chubu",
  石川県: "chubu",
  福井県: "chubu",
  山梨県: "chubu",
  長野県: "chubu",
  岐阜県: "chubu",
  静岡県: "chubu",
  愛知県: "chubu",
  三重県: "kansai",
  滋賀県: "kansai",
  京都府: "kansai",
  大阪府: "kansai",
  兵庫県: "kansai",
  奈良県: "kansai",
  和歌山県: "kansai",
  鳥取県: "chugoku",
  島根県: "chugoku",
  岡山県: "chugoku",
  広島県: "chugoku",
  山口県: "chugoku",
  徳島県: "shikoku",
  香川県: "shikoku",
  愛媛県: "shikoku",
  高知県: "shikoku",
  福岡県: "kyushu",
  佐賀県: "kyushu",
  長崎県: "kyushu",
  熊本県: "kyushu",
  大分県: "kyushu",
  宮崎県: "kyushu",
  鹿児島県: "kyushu",
  沖縄県: "okinawa",
};

// 20 政令指定都市(2025 年現在)。子 ward 以此集合識別 parent_city。
const DESIGNATED_CITIES = new Set<string>([
  "札幌市",
  "仙台市",
  "さいたま市",
  "千葉市",
  "横浜市",
  "川崎市",
  "相模原市",
  "新潟市",
  "静岡市",
  "浜松市",
  "名古屋市",
  "京都市",
  "大阪市",
  "堺市",
  "神戸市",
  "岡山市",
  "広島市",
  "北九州市",
  "福岡市",
  "熊本市",
]);

type Kind =
  | "prefecture"
  | "designated_city"
  | "city"
  | "ward"
  | "special_ward"
  | "town"
  | "village";

interface Row {
  lg_code: string;
  region: Region;
  prefecture_ja: string;
  subprefecture_ja: string | null;
  gun_ja: string | null;
  parent_city_ja: string | null;
  name_ja: string;
  name_kana: string | null;
  kind: Kind;
}

async function fetchXlsx(): Promise<Buffer> {
  if (LOCAL_FILE) {
    console.log(`[lg] using local file: ${LOCAL_FILE}`);
    return readFileSync(LOCAL_FILE);
  }
  const cache = join(tmpdir(), "jpluggagego-lg-codes");
  mkdirSync(cache, { recursive: true });
  const name = URL.split("/").pop() ?? "lg-codes.xlsx";
  const xlsxPath = join(cache, name);
  if (!existsSync(xlsxPath)) {
    console.log(`[lg] download ${URL}`);
    execSync(`curl -fsSL -o "${xlsxPath}" "${URL}"`, { stdio: "inherit" });
  } else {
    console.log(`[lg] using cached ${xlsxPath}`);
  }
  return readFileSync(xlsxPath);
}

// Split 市区町村名 into (gun_ja, parent_city_ja, name_ja).
// Examples:
//   "札幌市中央区"       → parent="札幌市",  name="中央区"
//   "石狩郡当別町"       → gun="石狩",       name="当別町"
//   "上磯郡知内町"       → gun="上磯",       name="知内町"
//   "函館市"             →                    name="函館市"
//   "千代田区"           →                    name="千代田区"  (東京都 特別区)
function splitCityName(cityField: string): {
  gun_ja: string | null;
  parent_city_ja: string | null;
  name_ja: string;
} {
  const s = cityField.trim();

  // Ward under designated city: "<親市>市<区名>区".
  const wardMatch = s.match(/^(.+?市)(.+区)$/);
  if (wardMatch && DESIGNATED_CITIES.has(wardMatch[1])) {
    return {
      gun_ja: null,
      parent_city_ja: wardMatch[1],
      name_ja: wardMatch[2],
    };
  }

  // 郡部 (町/村): "<郡名>郡<町村名>".
  const gunMatch = s.match(/^(.+?)郡(.+?[町村])$/);
  if (gunMatch) {
    return { gun_ja: gunMatch[1], parent_city_ja: null, name_ja: gunMatch[2] };
  }

  return { gun_ja: null, parent_city_ja: null, name_ja: s };
}

function detectKind(
  prefecture: string,
  name: string,
  parentCity: string | null,
  isPrefectureRow: boolean,
): Kind {
  if (isPrefectureRow) return "prefecture";
  if (parentCity) return "ward";
  if (prefecture === "東京都" && name.endsWith("区")) return "special_ward";
  if (name.endsWith("町")) return "town";
  if (name.endsWith("村")) return "village";
  if (name.endsWith("市")) {
    return DESIGNATED_CITIES.has(name) ? "designated_city" : "city";
  }
  // Fallback (shouldn't hit for standard 総務省 data).
  return "city";
}

function parse(buf: Buffer): Row[] {
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<(string | number | undefined)[]>(ws, {
    header: 1,
    raw: false,
    defval: "",
  });

  const out: Row[] = [];
  for (const r of raw) {
    if (!Array.isArray(r)) continue;
    const code = String(r[0] ?? "").trim();
    const pref = String(r[1] ?? "").trim();
    const cityField = String(r[2] ?? "").trim();
    const cityKana = String(r[4] ?? "").trim() || null;

    // Header / blank / metadata rows — skip.
    if (!/^\d{6}$/.test(code)) continue;
    if (!pref || !REGION_OF_PREF[pref]) continue;

    const lg_code = code.slice(0, 5);
    const region = REGION_OF_PREF[pref];
    const isPref = lg_code.endsWith("000");

    let gun_ja: string | null = null;
    let parent_city_ja: string | null = null;
    let name_ja: string;
    if (isPref) {
      name_ja = pref;
    } else {
      if (!cityField) continue; // non-prefecture row must have city field
      const parts = splitCityName(cityField);
      gun_ja = parts.gun_ja;
      parent_city_ja = parts.parent_city_ja;
      name_ja = parts.name_ja;
    }

    const kind = detectKind(pref, name_ja, parent_city_ja, isPref);

    const subprefecture_ja =
      region === "hokkaido" && !isPref
        ? (HOKKAIDO_SUBPREFECTURE_BY_LG_CODE[lg_code] ?? null)
        : null;

    out.push({
      lg_code,
      region,
      prefecture_ja: pref,
      subprefecture_ja,
      gun_ja,
      parent_city_ja,
      name_ja,
      name_kana: cityKana,
      kind,
    });
  }

  return out;
}

async function main() {
  const buf = await fetchXlsx();
  const rows = parse(buf);
  console.log(`[lg] parsed ${rows.length} rows`);

  const prefCount = rows.filter((r) => r.kind === "prefecture").length;
  console.log(`[lg] prefecture rows: ${prefCount} (expect 47)`);

  const byKind: Record<string, number> = {};
  for (const r of rows) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;
  console.log(`[lg] by kind: ${JSON.stringify(byKind)}`);

  const hokkaidoMuni = rows.filter(
    (r) => r.region === "hokkaido" && r.kind !== "prefecture",
  );
  const missingSubpref = hokkaidoMuni.filter((r) => !r.subprefecture_ja);
  console.log(
    `[lg] Hokkaido municipalities: ${hokkaidoMuni.length}, missing subprefecture: ${missingSubpref.length}`,
  );
  if (missingSubpref.length > 0) {
    console.warn("[lg] missing subprefecture samples:");
    for (const r of missingSubpref.slice(0, 20)) {
      console.warn(`  ${r.lg_code}  ${r.name_ja}`);
    }
  }

  if (DRY) {
    console.log("[lg] --dry-run, 20 samples (first):");
    for (const r of rows.slice(0, 20)) {
      console.log(fmt(r));
    }
    console.log("[lg] Hokkaido 非札幌 samples:");
    const hokSamples = rows
      .filter(
        (r) =>
          r.region === "hokkaido" &&
          r.subprefecture_ja &&
          r.subprefecture_ja !== "石狩振興局",
      )
      .slice(0, 10);
    for (const r of hokSamples) console.log(fmt(r));
    console.log("[lg] designated city wards samples:");
    const wardSamples = rows.filter((r) => r.kind === "ward").slice(0, 5);
    for (const r of wardSamples) console.log(fmt(r));
    return;
  }

  const supabase = createAdminClient();
  const BATCH = 500;
  const take = Math.min(rows.length, LIMIT);
  let done = 0;
  for (let i = 0; i < take; i += BATCH) {
    const slice = rows.slice(i, Math.min(i + BATCH, take));
    const { error } = await supabase
      .from("japan_municipalities")
      .upsert(slice, { onConflict: "lg_code" });
    if (error) {
      console.error("[lg] upsert error", error);
      process.exit(1);
    }
    done += slice.length;
    console.log(`[lg] upsert ${done}/${take}`);
  }
  console.log(`[lg] Done — ${done} rows upserted`);
}

function fmt(r: Row): string {
  const tag = `[${r.region}/${r.kind}]`;
  const parts = [r.prefecture_ja];
  if (r.subprefecture_ja) parts.push(r.subprefecture_ja);
  if (r.gun_ja) parts.push(`${r.gun_ja}郡`);
  if (r.parent_city_ja) parts.push(r.parent_city_ja);
  parts.push(r.name_ja);
  return `  ${r.lg_code} ${tag.padEnd(22)} ${parts.join(" · ")}`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
