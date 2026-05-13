import { NextResponse } from "next/server";
import {
  swapSpot,
  type SwapInput,
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
  const body = (await req.json()) as Partial<SwapInput>;

  const level = (Number(body.level) || 0) as PlannerLevel;
  if (level < 0 || level > 4) {
    return NextResponse.json({ error: "invalid level" }, { status: 400 });
  }
  const region = body.region ?? "all";
  const themes = Array.isArray(body.themes)
    ? (body.themes.slice(0, 3) as PlannerTheme[])
    : [];
  const excludedSlugs = Array.isArray(body.excludedSlugs)
    ? body.excludedSlugs
    : [];
  if (!body.anchor || typeof body.anchor.lat !== "number" || typeof body.anchor.lon !== "number") {
    return NextResponse.json({ error: "anchor required" }, { status: 400 });
  }
  if (!body.category) {
    return NextResponse.json({ error: "category required" }, { status: 400 });
  }
  const why = body.why ?? "差し替え";
  const seed = typeof body.seed === "number" ? body.seed : undefined;

  const entries = await loadAll();
  const spot = swapSpot(entries, {
    level,
    themes,
    region,
    excludedSlugs,
    anchor: body.anchor,
    category: body.category,
    why,
    seed,
  });

  return NextResponse.json({ spot });
}
