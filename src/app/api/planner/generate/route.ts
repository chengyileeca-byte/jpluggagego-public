import { NextResponse } from "next/server";
import {
  generatePlan,
  type PlannerInput,
  type PlannerLevel,
  type PlannerTheme,
} from "@/lib/itinerary-generator";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { JapanEntry } from "@/lib/japan-entries";

let _cache: { mtimeMs: number; data: JapanEntry[] } | null = null;

async function loadAll(): Promise<JapanEntry[]> {
  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "japan_entries.json",
  );
  const stat = await fs.stat(file);
  if (_cache && _cache.mtimeMs === stat.mtimeMs) return _cache.data;
  const raw = await fs.readFile(file, "utf-8");
  const data = JSON.parse(raw) as JapanEntry[];
  _cache = { mtimeMs: stat.mtimeMs, data };
  return data;
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<PlannerInput>;

  const level = (Number(body.level) || 0) as PlannerLevel;
  if (level < 0 || level > 4) {
    return NextResponse.json({ error: "invalid level" }, { status: 400 });
  }
  const days = Math.max(1, Math.min(14, Number(body.days) || 5));
  const region = body.region ?? "all";
  const themes = Array.isArray(body.themes)
    ? (body.themes.slice(0, 3) as PlannerTheme[])
    : [];
  const excludedSlugs = Array.isArray(body.excludedSlugs)
    ? body.excludedSlugs
    : [];
  const seed = typeof body.seed === "number" ? body.seed : undefined;

  const entries = await loadAll();
  const result = generatePlan(entries, {
    level,
    days,
    region,
    themes,
    excludedSlugs,
    seed,
  });

  return NextResponse.json({
    plan: result.days,
    pool_total: result.pool_total,
    pool_filtered: result.pool_filtered,
    pool_usable: result.pool_usable,
  });
}
