// Post-SUNSET seed I/O — Supabase 雲端は撤退済(2026-05-04)、
// seed script は public/data/japan_entries.json + by-pref/<pref>/japan_entries.json
// に直接 upsert する。
//
// 使い方(seed-japan-entries-<pref>-<category>-r<N>.ts から):
//
//   import { upsertEntries, type SeedRow } from "./seed-helpers/upsert-entries";
//   const rows: SeedRow[] = [...];
//   await upsertEntries(rows, { dry: process.argv.includes("--dry-run") });

import { promises as fs } from "node:fs";
import path from "node:path";

export interface SeedRow {
  slug: string;
  category: string;
  sub_type: string;
  title_zh: string;
  title_ja: string | null;
  romaji: string | null;
  summary_zh: string;
  content_md: string | null;
  region: string;
  prefecture_ja: string;
  gun_ja: string | null;
  municipality_ja: string | null;
  lg_code: string | null;
  area_types: string[];
  lat: number | null;
  lon: number | null;
  season_start: string | null;
  season_end: string | null;
  event_start: string | null;
  event_end: string | null;
  price_tier: number | null;
  booking_window_days: number | null;
  closed_days: string[];
  external_urls: Record<string, string>;
  tags: string[];
  source: "manual" | "api" | "ugc";
}

interface StoredEntry extends SeedRow {
  id: number;
  feature_rank: number;
  google_place_id: string | null;
  business_status: string | null;
  business_status_checked_at: string | null;
  last_verified_at: string;
  created_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "public", "data");
const ENTRIES_FILE = path.join(DATA_DIR, "japan_entries.json");

function byPrefDir(pref: string): string {
  return path.join(DATA_DIR, "by-pref", encodeURIComponent(pref));
}

function nowIso(): string {
  return new Date().toISOString();
}

// 既存 entries の最大 id を取って次 id を払い出す(seed が 50 筆なら 50 連番)
function nextIdSeq(existing: StoredEntry[], n: number): number[] {
  const maxId = existing.reduce((m, e) => Math.max(m, e.id ?? 0), 0);
  return Array.from({ length: n }, (_, i) => maxId + i + 1);
}

function rowToStored(row: SeedRow, id: number): StoredEntry {
  return {
    id,
    slug: row.slug,
    category: row.category,
    sub_type: row.sub_type,
    title_zh: row.title_zh,
    title_ja: row.title_ja,
    romaji: row.romaji,
    summary_zh: row.summary_zh,
    content_md: row.content_md,
    region: row.region,
    prefecture_ja: row.prefecture_ja,
    gun_ja: row.gun_ja,
    municipality_ja: row.municipality_ja,
    lg_code: row.lg_code,
    area_types: row.area_types,
    lat: row.lat,
    lon: row.lon,
    season_start: row.season_start,
    season_end: row.season_end,
    event_start: row.event_start,
    event_end: row.event_end,
    price_tier: row.price_tier,
    booking_window_days: row.booking_window_days,
    closed_days: row.closed_days,
    external_urls: row.external_urls,
    tags: row.tags,
    source: row.source,
    feature_rank: 0,
    google_place_id: null,
    business_status: null,
    business_status_checked_at: null,
    last_verified_at: nowIso(),
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "ENOENT"
    ) {
      return fallback;
    }
    throw err;
  }
}

async function writeJsonAtomic(file: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
  await fs.rename(tmp, file);
}

export async function upsertEntries(
  rows: SeedRow[],
  opts: { dry?: boolean } = {},
): Promise<void> {
  const { dry = false } = opts;
  if (rows.length === 0) {
    console.log("[upsert] 0 rows, nothing to do");
    return;
  }

  const prefs = new Set(rows.map((r) => r.prefecture_ja));
  console.log(`[upsert] ${rows.length} rows / ${prefs.size} prefecture(s)`);

  if (dry) {
    const bySub = new Map<string, number>();
    for (const r of rows) bySub.set(r.sub_type, (bySub.get(r.sub_type) ?? 0) + 1);
    for (const [k, v] of [...bySub.entries()].sort()) {
      console.log(`  ${k.padEnd(28)} ${v}`);
    }
    console.log("[upsert] --dry-run, no files written");
    return;
  }

  // 1. Top-level public/data/japan_entries.json
  const all = await readJson<StoredEntry[]>(ENTRIES_FILE, []);
  const bySlug = new Map(all.map((e) => [e.slug, e]));

  // 既存重複は upsert(updated_at + sub_type + summary 等更新、id 維持)
  // 新規は連番 id 払出
  const newRows = rows.filter((r) => !bySlug.has(r.slug));
  const ids = nextIdSeq(all, newRows.length);

  let inserted = 0;
  let updated = 0;
  for (const r of rows) {
    const existing = bySlug.get(r.slug);
    if (existing) {
      // upsert: keep id + created_at + feature_rank、update everything else
      const merged: StoredEntry = {
        ...existing,
        ...rowToStored(r, existing.id),
        id: existing.id,
        feature_rank: existing.feature_rank,
        google_place_id: existing.google_place_id,
        business_status: existing.business_status,
        business_status_checked_at: existing.business_status_checked_at,
        created_at: existing.created_at,
        updated_at: nowIso(),
      };
      bySlug.set(r.slug, merged);
      updated++;
    } else {
      const id = ids.shift()!;
      const stored = rowToStored(r, id);
      bySlug.set(r.slug, stored);
      inserted++;
    }
  }

  const merged = [...bySlug.values()].sort((a, b) => a.id - b.id);
  await writeJsonAtomic(ENTRIES_FILE, merged);
  console.log(
    `[upsert] ${ENTRIES_FILE}: +${inserted} new, ${updated} updated, total ${merged.length}`,
  );

  // 2. Per-prefecture shard
  for (const pref of prefs) {
    const file = path.join(byPrefDir(pref), "japan_entries.json");
    const prefRows = merged.filter((e) => e.prefecture_ja === pref);
    await writeJsonAtomic(file, prefRows);
    console.log(`[upsert]   ${file}: ${prefRows.length} rows`);
  }
}

export function seedMain(rows: SeedRow[], label: string): void {
  const dry = process.argv.includes("--dry-run");
  upsertEntries(rows, { dry })
    .then(() => {
      console.log(`[${label}] done`);
    })
    .catch((err) => {
      console.error(`[${label}] failed:`, err);
      process.exit(1);
    });
}
