// 旅程プランナー — popularity_tier + region + themes に基づくランダム+クラスタリング生成。
// /japan/planner で使用。クライアント側でも実行可能。

import type { JapanEntry, JapanEntryCard, Region } from "./japan-entries";

export type PlannerLevel = 0 | 1 | 2 | 3 | 4; // slider 段階 0-4(新手/初中/中級/上級/マニア)

export type PlannerTheme =
  | "food"
  | "onsen"
  | "kotos" // 古都(temple + shrine + history)
  | "season" // 桜 + 紅葉 + 雪見
  | "nature"
  | "city" // 街歩き
  | "art" // 美術館 + museum
  | "rail"; // 観光列車

export type PlannerInput = {
  level: PlannerLevel;
  days: number; // 3-14
  region: Region | "all";
  themes: PlannerTheme[]; // 0-3
  excludedSlugs: string[];
  seed?: number; // 再現性のため
};

export type PlannedSpot = {
  slug: string;
  title_zh: string;
  title_ja: string | null;
  summary_zh: string;
  category: string;
  sub_type: string | null;
  prefecture_ja: string;
  municipality_ja: string | null;
  lat: number | null;
  lon: number | null;
  popularity_tier: number;
  tags: string[] | null;
  region: Region;
  // 選定理由を 3 つに分解(UI 側で chip 化/tooltip 化しやすい):
  category_glyph: string; // "食"/"育"/"樂"/"住"/"衣"/"行"
  tier_label: string; // "必訪"/"有名"/"主要"/"穴場"/"通好"
  why: string; // "Day 1 拠点"/"食事"/"観光 2"/"宿"
  reason: string; // 旧形式の連結文字列(後方互換)
  // timeline 区切り。UI 側で 朝/昼/午後/夕/夜 にグルーピング表示。
  timeslot: Timeslot;
};

export type Timeslot = "morning" | "noon" | "afternoon" | "evening" | "night";

export const TIMESLOT_ORDER: Timeslot[] = [
  "morning",
  "noon",
  "afternoon",
  "evening",
  "night",
];

export const TIMESLOT_LABEL_JA: Record<Timeslot, string> = {
  morning: "上午",
  noon: "中午",
  afternoon: "下午",
  evening: "傍晚",
  night: "夜",
};

export const TIMESLOT_HOUR: Record<Timeslot, string> = {
  morning: "08-11",
  noon: "11-13",
  afternoon: "13-17",
  evening: "17-19",
  night: "19-",
};

// why string + category → どの時間帯に配置するか。
// generatePlan() の追加順を踏まえる:
//   1. 拠点 → morning
//   2. 食事(1st)→ noon / もう 1 食 → evening
//   3. 観光 1 → morning(拠点と同帯)
//   4. 観光 2-3 → afternoon
//   5. 宿 → night
//   6. 交通 or 買物 → afternoon
function whyToTimeslot(why: string, category: string): Timeslot {
  if (/起點/.test(why)) return "morning";
  if (category === "lodging") return "night";
  if (category === "food") {
    if (/再來一餐/.test(why)) return "evening";
    return "noon";
  }
  if (/觀光\s*1\b/.test(why)) return "morning";
  if (/觀光/.test(why)) return "afternoon";
  return "afternoon";
}

export type PlannedDay = {
  day: number;
  region_label: string; // 「関西 - 京都 + 大阪」等
  spots: PlannedSpot[];
};

// 熟練度別 tier 重み(level 0=新手 → 4=マニア)
const TIER_WEIGHTS: Record<PlannerLevel, Record<number, number>> = {
  0: { 1: 80, 2: 20, 3: 0, 4: 0, 5: 0 }, // 新手:tier 1 圧倒
  1: { 1: 40, 2: 40, 3: 20, 4: 0, 5: 0 }, // 初中級:1+2 mix
  2: { 1: 10, 2: 40, 3: 40, 4: 10, 5: 0 }, // 中級:2-3 中心
  3: { 1: 0, 2: 10, 3: 40, 4: 40, 5: 10 }, // 上級:3-4 + 少し niche
  4: { 1: 0, 2: 0, 3: 20, 4: 50, 5: 30 }, // マニア:4-5 中心
};

// テーマ → sub_type / category マッピング
const THEME_FILTERS: Record<PlannerTheme, (e: JapanEntry) => number> = {
  food: (e) => (e.category === "food" ? 3 : 1),
  onsen: (e) => (e.sub_type === "onsen" || e.category === "lodging" ? 3 : 1),
  kotos: (e) =>
    e.sub_type === "temple" || e.sub_type === "shrine" || e.sub_type === "history"
      ? 3
      : 1,
  season: (e) =>
    (e.tags ?? []).some((t) => /桜|紅葉|雪見|樹氷|花|蛍/.test(t)) ? 3 : 1,
  nature: (e) =>
    e.sub_type === "nature" || e.sub_type === "scenic_spot" ? 3 : 1,
  city: (e) =>
    e.category === "entertainment" || e.category === "fashion" || e.category === "food"
      ? 3
      : 1,
  art: (e) => (e.sub_type === "museum" ? 3 : 1),
  rail: (e) =>
    e.sub_type === "sightseeing_train" ||
    e.sub_type === "train_station" ||
    e.sub_type === "tram"
      ? 3
      : 1,
};

// 簡易 PRNG (seed 対応)
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 重み付ランダム選択(復元なし)
function weightedPick<T>(
  items: T[],
  weights: number[],
  rng: () => number,
): T | null {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return null;
  let pick = rng() * sum;
  for (let i = 0; i < items.length; i++) {
    pick -= weights[i];
    if (pick <= 0) return items[i];
  }
  return items[items.length - 1] ?? null;
}

// 2 点間概算距離 (km, 緯度 1° ≈ 111km / 経度 1° ≈ 91km @ 緯度 35°)
function approxDistanceKm(
  a: { lat: number | null; lon: number | null },
  b: { lat: number | null; lon: number | null },
): number {
  if (a.lat === null || a.lon === null || b.lat === null || b.lon === null)
    return Infinity;
  const dLat = (a.lat - b.lat) * 111;
  const dLon = (a.lon - b.lon) * 91;
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

function levelLabel(level: PlannerLevel): string {
  return ["新手", "初中級", "中級", "上級", "マニア"][level];
}

function categoryLabel(c: string): string {
  return (
    {
      food: "食",
      culture: "育",
      entertainment: "樂",
      lodging: "住",
      fashion: "衣",
      transport: "行",
      clothing: "衣",
    } as Record<string, string>
  )[c] ?? c;
}

export type PlanResult = {
  days: PlannedDay[];
  pool_total: number; // DB 全体
  pool_filtered: number; // region + excluded フィルタ後
  pool_usable: number; // tier weight × theme bonus > 0 の最終 pool
};

export function generatePlan(
  entries: JapanEntry[],
  input: PlannerInput,
): PlanResult {
  const rng = mulberry32(input.seed ?? Date.now());
  const excluded = new Set(input.excludedSlugs);
  const poolTotal = entries.length;

  // 1. プールフィルタ
  let pool = entries.filter(
    (e) =>
      e.source === "manual" &&
      (e.popularity_tier ?? 0) > 0 && // exclude meta(tier 0)
      !e.pending_rewrite && // exclude #118 stub(深度内容整備中)
      !excluded.has(e.slug) &&
      e.lat !== null &&
      e.lon !== null,
  );
  if (input.region !== "all") {
    pool = pool.filter((e) => e.region === input.region);
  }
  const poolFiltered = pool.length;

  if (pool.length === 0) {
    return { days: [], pool_total: poolTotal, pool_filtered: 0, pool_usable: 0 };
  }

  // 2. 各 entry に重み付け(tier weight × theme bonus)
  const weights = TIER_WEIGHTS[input.level];
  const themeFns = input.themes.map((t) => THEME_FILTERS[t]);
  const scored = pool.map((e) => {
    const tw = weights[e.popularity_tier ?? 3] ?? 0;
    let themeBonus = 1;
    if (themeFns.length > 0) {
      themeBonus = themeFns.reduce((acc, fn) => acc * fn(e), 1);
    }
    return { entry: e, weight: tw * themeBonus };
  });

  // 3. 重み 0 の entry を除外
  const usable = scored.filter((s) => s.weight > 0);
  const poolUsable = usable.length;
  if (usable.length === 0) {
    return { days: [], pool_total: poolTotal, pool_filtered: poolFiltered, pool_usable: 0 };
  }

  // 4. 1 日目の起点を重み付選択
  const days: PlannedDay[] = [];
  const used = new Set<string>();

  const pickWeighted = (
    candidates: { entry: JapanEntry; weight: number }[],
  ): JapanEntry | null => {
    const filtered = candidates.filter((c) => !used.has(c.entry.slug));
    if (filtered.length === 0) return null;
    const result = weightedPick(
      filtered.map((c) => c.entry),
      filtered.map((c) => c.weight),
      rng,
    );
    if (result) used.add(result.slug);
    return result;
  };

  const TIER_LABELS = ["", "必訪", "有名", "主要", "私房", "行家"];

  const toSpot = (e: JapanEntry, why: string): PlannedSpot => {
    const tier = e.popularity_tier ?? 3;
    const tierLabel = TIER_LABELS[tier] ?? "";
    const glyph = categoryLabel(e.category);
    return {
      slug: e.slug,
      title_zh: e.title_zh,
      title_ja: e.title_ja,
      summary_zh: e.summary_zh,
      category: e.category,
      sub_type: e.sub_type,
      prefecture_ja: e.prefecture_ja,
      municipality_ja: e.municipality_ja,
      lat: e.lat,
      lon: e.lon,
      popularity_tier: tier,
      tags: e.tags,
      region: e.region,
      category_glyph: glyph,
      tier_label: tierLabel,
      why,
      reason: `${glyph} · tier ${tier} ${tierLabel} · ${why}`,
      timeslot: whyToTimeslot(why, e.category),
    };
  };

  let prevAnchor: { lat: number | null; lon: number | null } | null = null;

  for (let d = 1; d <= input.days; d++) {
    // 起点:残った usable から重み付選択
    // region='all' の時、前日 anchor との近接ボーナスを掛けて連続日ジャンプ抑制
    // 「Day1 京都 → Day2 北海道」を避ける。200km 内 = 満点、遠いほど penalty。
    let anchorPool = usable;
    if (input.region === "all" && prevAnchor !== null) {
      const prev = prevAnchor;
      anchorPool = usable.map((s) => {
        const dist = approxDistanceKm(
          { lat: prev.lat, lon: prev.lon },
          { lat: s.entry.lat, lon: s.entry.lon },
        );
        // 200km 内 = ×1 / 200-500km = ×0.5 / 500-1000km = ×0.1 / 1000km+ = ×0.02
        let proximityFactor = 1;
        if (dist > 1000) proximityFactor = 0.02;
        else if (dist > 500) proximityFactor = 0.1;
        else if (dist > 200) proximityFactor = 0.5;
        return { entry: s.entry, weight: s.weight * proximityFactor };
      });
    }
    const anchor = pickWeighted(anchorPool);
    if (!anchor) break;
    prevAnchor = { lat: anchor.lat, lon: anchor.lon };

    // 同日付近の spot を 4-5 件選ぶ(80km 内優先)
    const nearby = usable
      .filter((s) => !used.has(s.entry.slug))
      .map((s) => ({
        ...s,
        dist: approxDistanceKm(
          { lat: anchor.lat, lon: anchor.lon },
          { lat: s.entry.lat, lon: s.entry.lon },
        ),
      }))
      .filter((s) => s.dist <= 80) // 同日範囲
      .sort((a, b) => a.dist - b.dist);

    const daySpots: PlannedSpot[] = [
      toSpot(anchor, `Day ${d} 起點`),
    ];

    // 食事 1-2 件
    const foods = nearby.filter((s) => s.entry.category === "food");
    const f1 = pickWeighted(foods);
    if (f1) daySpots.push(toSpot(f1, "用餐"));
    if (d >= 5 || input.themes.includes("food")) {
      const f2 = pickWeighted(foods);
      if (f2) daySpots.push(toSpot(f2, "再來一餐"));
    }

    // 観光 2-3 件(culture + entertainment)
    const sights = nearby.filter(
      (s) => s.entry.category === "culture" || s.entry.category === "entertainment",
    );
    for (let i = 0; i < (input.themes.length > 0 ? 3 : 2); i++) {
      const s = pickWeighted(sights);
      if (s) daySpots.push(toSpot(s, `觀光 ${i + 1}`));
    }

    // 宿(初日 + 中泊日)
    if (d === 1 || d % 3 === 1) {
      const lodgings = nearby.filter((s) => s.entry.category === "lodging");
      const lg = pickWeighted(lodgings);
      if (lg) daySpots.push(toSpot(lg, "住宿"));
    }

    // 交通 / 衣 (任意 1 件)
    const others = nearby.filter(
      (s) =>
        s.entry.category === "transport" || s.entry.category === "fashion",
    );
    if (rng() < 0.5) {
      const o = pickWeighted(others);
      if (o) daySpots.push(toSpot(o, "交通 / 購物"));
    }

    days.push({
      day: d,
      region_label: `${anchor.prefecture_ja}${anchor.municipality_ja ? " · " + anchor.municipality_ja : ""}`,
      spots: daySpots,
    });
  }

  return { days, pool_total: poolTotal, pool_filtered: poolFiltered, pool_usable: poolUsable };
}

// 単一 spot 差し替え — anchor 周辺で同 category の別 spot を再抽出。
// 全体 regenerate せず一箇所だけ変えたい時用。
export type SwapInput = {
  level: PlannerLevel;
  themes: PlannerTheme[];
  region: Region | "all";
  excludedSlugs: string[]; // 既 plan 全 slug + visited(重複防止)
  anchor: { lat: number; lon: number }; // 該当日の拠点 spot 位置
  category: string; // 差し替え元の category(同種にマッチ)
  why: string; // 差し替え後の reason.why(例「観光 2」のまま)
  seed?: number;
};

export function swapSpot(
  entries: JapanEntry[],
  input: SwapInput,
): PlannedSpot | null {
  const rng = mulberry32(input.seed ?? Date.now());
  const excluded = new Set(input.excludedSlugs);

  // generatePlan と同じ pool filter
  let pool = entries.filter(
    (e) =>
      e.source === "manual" &&
      (e.popularity_tier ?? 0) > 0 &&
      !e.pending_rewrite &&
      !excluded.has(e.slug) &&
      e.lat !== null &&
      e.lon !== null,
  );
  if (input.region !== "all") {
    pool = pool.filter((e) => e.region === input.region);
  }
  // category 一致 + anchor 80km 内
  pool = pool.filter((e) => {
    if (e.category !== input.category) return false;
    const d = approxDistanceKm(
      { lat: input.anchor.lat, lon: input.anchor.lon },
      { lat: e.lat, lon: e.lon },
    );
    return d <= 80;
  });

  if (pool.length === 0) return null;

  const weights = TIER_WEIGHTS[input.level];
  const themeFns = input.themes.map((t) => THEME_FILTERS[t]);
  const scored = pool
    .map((e) => {
      const tw = weights[e.popularity_tier ?? 3] ?? 0;
      let themeBonus = 1;
      if (themeFns.length > 0) {
        themeBonus = themeFns.reduce((acc, fn) => acc * fn(e), 1);
      }
      return { entry: e, weight: tw * themeBonus };
    })
    .filter((s) => s.weight > 0);

  if (scored.length === 0) return null;

  const picked = weightedPick(
    scored.map((s) => s.entry),
    scored.map((s) => s.weight),
    rng,
  );
  if (!picked) return null;

  const tier = picked.popularity_tier ?? 3;
  const tierLabel = ["", "必訪", "有名", "主要", "穴場", "通好"][tier] ?? "";
  const glyph = categoryLabel(picked.category);
  return {
    slug: picked.slug,
    title_zh: picked.title_zh,
    title_ja: picked.title_ja,
    summary_zh: picked.summary_zh,
    category: picked.category,
    sub_type: picked.sub_type,
    prefecture_ja: picked.prefecture_ja,
    municipality_ja: picked.municipality_ja,
    lat: picked.lat,
    lon: picked.lon,
    popularity_tier: tier,
    tags: picked.tags,
    region: picked.region,
    category_glyph: glyph,
    tier_label: tierLabel,
    why: input.why,
    reason: `${glyph} · tier ${tier} ${tierLabel} · ${input.why}`,
    timeslot: whyToTimeslot(input.why, picked.category),
  };
}

export function levelDescription(level: PlannerLevel): string {
  return [
    "新手 — 初次訪日 / 1-2 趟。必訪大物中心(世遺 + 国宝 + 名所)。",
    "初中級 — 3-5 趟。1+2 級混搭,2 番手有名 spot 入。",
    "中級 — 6-10 趟。跳過最有名 spot,主要観光地深堀。",
    "上級 — 11-15 趟。穴場中心,通好 spot 多。",
    "マニア — 16+ 趟。秘境 + 工芸 + 山村 + 通だけ知る spot。",
  ][level];
}
