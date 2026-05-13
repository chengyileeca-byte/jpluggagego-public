// 月度 refresh japan_entries.business_status
//
// 對每筆有 google_place_id 的 entry call Place Details(field=business_status),
// 寫回 public/data/japan_entries.json。
// CLOSED_PERMANENTLY → 自動把 feature_rank 降到 0(從公開頁、全域 when/calendar 消失)。
// 不刪 entry,留給 admin 反悔(rebrand → 重新 match → 復活)。
//
// Usage:
//   npm run refresh:business-status:dry    # 只印,不寫
//   npm run refresh:business-status        # 寫 JSON
//
// Phase 3(post-Supabase SUNSET, 2026-05-04)— shim を経由せず JSON 直接 read/write。
//
// GitHub Actions 每月 1 號 JST 04:00 自動跑。
//
// 計費:Place Details(business_status only)~$5-17/1,000。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "fs";
import { join, dirname } from "path";
import {
  findPlaceByText,
  getPlaceBusinessStatus,
  sleep,
} from "../src/lib/google-places";

const DATA_DIR = "public/data";
const ENTRIES_JSON = join(DATA_DIR, "japan_entries.json");
const BY_PREF_DIR = join(DATA_DIR, "by-pref");
function prefSlugEnc(p: string): string {
  return encodeURIComponent(p);
}

function readAllEntries(): Record<string, unknown>[] {
  if (existsSync(ENTRIES_JSON)) {
    return JSON.parse(readFileSync(ENTRIES_JSON, "utf8")) as Record<
      string,
      unknown
    >[];
  }
  if (!existsSync(BY_PREF_DIR)) return [];
  const all: Record<string, unknown>[] = [];
  for (const d of readdirSync(BY_PREF_DIR)) {
    const f = join(BY_PREF_DIR, d, "japan_entries.json");
    if (existsSync(f)) {
      const arr = JSON.parse(readFileSync(f, "utf8")) as Record<
        string,
        unknown
      >[];
      all.push(...arr);
    }
  }
  return all;
}

function writeAllEntries(entries: Record<string, unknown>[]) {
  mkdirSync(dirname(ENTRIES_JSON), { recursive: true });
  writeFileSync(ENTRIES_JSON, JSON.stringify(entries, null, 2) + "\n");
  const buckets = new Map<string, Record<string, unknown>[]>();
  for (const e of entries) {
    const p = (e.prefecture_ja as string) || "_no_pref";
    const arr = buckets.get(p) ?? [];
    arr.push(e);
    buckets.set(p, arr);
  }
  for (const [p, arr] of buckets) {
    const dir = join(BY_PREF_DIR, prefSlugEnc(p));
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "japan_entries.json"),
      JSON.stringify(arr, null, 2) + "\n",
    );
  }
}

interface EntryShape {
  slug: string;
  title_zh: string;
  title_ja: string | null;
  municipality_ja: string | null;
  prefecture_ja: string;
  google_place_id: string;
  business_status: string | null;
  feature_rank: number;
}

function buildQuery(e: EntryShape): string {
  const name = e.title_ja?.trim() || e.title_zh;
  const where = e.municipality_ja || e.prefecture_ja;
  return where ? `${name} ${where}` : name;
}

async function main() {
  const dry = process.argv.includes("--dry");

  const allEntries = readAllEntries();
  const bySlug = new Map<string, Record<string, unknown>>();
  for (const e of allEntries) bySlug.set(e.slug as string, e);

  const targets: EntryShape[] = allEntries
    .filter((e) => e.google_place_id)
    .map((e) => ({
      slug: e.slug as string,
      title_zh: (e.title_zh as string) ?? "",
      title_ja: (e.title_ja as string | null) ?? null,
      municipality_ja: (e.municipality_ja as string | null) ?? null,
      prefecture_ja: (e.prefecture_ja as string) ?? "",
      google_place_id: e.google_place_id as string,
      business_status: (e.business_status as string | null) ?? null,
      feature_rank: (e.feature_rank as number) ?? 0,
    }));

  if (targets.length === 0) {
    console.log("[refresh] 沒有有 place_id 的 entry,先跑 match-google-place-ids");
    return;
  }

  console.log(`[refresh] ${targets.length} 筆待更新 ${dry ? "(dry-run)" : ""}`);

  const checkedAt = new Date().toISOString();
  let unchanged = 0;
  let changed = 0;
  let closed = 0;
  let notFound = 0;
  let rematched = 0;
  let failed = 0;
  let sinceLastFlush = 0;
  const FLUSH_EVERY = 25;

  const flush = () => {
    if (!dry) {
      writeAllEntries(allEntries);
      sinceLastFlush = 0;
    }
  };

  const applyUpdate = (slug: string, patch: Record<string, unknown>) => {
    const target = bySlug.get(slug);
    if (target) {
      Object.assign(target, patch);
      sinceLastFlush++;
      if (sinceLastFlush >= FLUSH_EVERY) flush();
    }
  };

  for (const entry of targets) {
    try {
      const status = await getPlaceBusinessStatus(entry.google_place_id);

      // NOT_FOUND → place_id 失效(rebrand 等)。re-match を試みる。
      if (status === "NOT_FOUND") {
        const reQuery = buildQuery(entry);
        const reMatched = await findPlaceByText(reQuery);
        if (reMatched && reMatched.place_id !== entry.google_place_id) {
          console.log(
            `  REMATCH ${entry.slug.padEnd(48)} → ${reMatched.place_id} (${reMatched.name})`,
          );
          rematched++;
          const newStatus2 = await getPlaceBusinessStatus(reMatched.place_id);
          await sleep(200);
          const nextStatus =
            newStatus2 === "NOT_FOUND" ? null : (newStatus2 ?? "OPERATIONAL");
          const patch: Record<string, unknown> = {
            google_place_id: reMatched.place_id,
            business_status: nextStatus,
            business_status_checked_at: checkedAt,
          };
          if (nextStatus === "CLOSED_PERMANENTLY" && entry.feature_rank > 0) {
            patch.feature_rank = 0;
          }
          applyUpdate(entry.slug, patch);
          await sleep(200);
          continue;
        }
        // re-match も見つからず → place_id 清空(次回 match script で再抓)
        console.log(`  NF    ${entry.slug.padEnd(50)} → place_id 失効、清空`);
        notFound++;
        applyUpdate(entry.slug, {
          google_place_id: null,
          business_status: null,
          business_status_checked_at: checkedAt,
        });
        await sleep(200);
        continue;
      }

      const newStatus = status ?? "OPERATIONAL";
      const closedPerm = newStatus === "CLOSED_PERMANENTLY";

      if (closedPerm) {
        console.log(
          `  ⚠️  CLOSED ${entry.slug.padEnd(48)} → ${entry.title_zh}`,
        );
        closed++;
      } else if (newStatus !== entry.business_status) {
        console.log(
          `  Δ     ${entry.slug.padEnd(50)} ${entry.business_status ?? "null"} → ${newStatus}`,
        );
        changed++;
      } else {
        unchanged++;
      }

      const patch: Record<string, unknown> = {
        business_status: newStatus,
        business_status_checked_at: checkedAt,
      };
      if (closedPerm && entry.feature_rank > 0) {
        patch.feature_rank = 0;
      }
      applyUpdate(entry.slug, patch);
    } catch (err) {
      console.error(
        `  FAIL  ${entry.slug.padEnd(50)} (${(err as Error).message})`,
      );
      failed++;
    }

    await sleep(200);
  }

  if (sinceLastFlush > 0) flush();

  console.log(
    `\n[refresh] 結束:unchanged=${unchanged} changed=${changed} closed=${closed} notFound=${notFound} rematched=${rematched} fail=${failed} ${dry ? "(dry-run)" : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
