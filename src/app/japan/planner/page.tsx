"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type {
  PlannedDay,
  PlannedSpot,
  PlannerLevel,
  PlannerTheme,
  Timeslot,
} from "@/lib/itinerary-generator";
import {
  TIMESLOT_ORDER,
  TIMESLOT_LABEL_JA,
  TIMESLOT_HOUR,
} from "@/lib/itinerary-generator";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const REGION_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全国漂流" },
  { value: "hokkaido", label: "北海道" },
  { value: "tohoku", label: "東北" },
  { value: "kanto", label: "関東" },
  { value: "chubu", label: "中部" },
  { value: "kansai", label: "近畿" },
  { value: "chugoku", label: "中国" },
  { value: "shikoku", label: "四国" },
  { value: "kyushu", label: "九州" },
  { value: "okinawa", label: "沖縄" },
];

const THEME_OPTIONS: { value: PlannerTheme; label: string }[] = [
  { value: "food", label: "食" },
  { value: "onsen", label: "温泉" },
  { value: "kotos", label: "古都" },
  { value: "season", label: "桜紅葉" },
  { value: "nature", label: "自然" },
  { value: "city", label: "街道散步" },
  { value: "art", label: "藝術" },
  { value: "rail", label: "鉄道" },
];

const LEVEL_LABELS = ["新手", "初中級", "中級", "上級", "達人"];
const LEVEL_HINTS = [
  "1-2 趟・必訪大物中心",
  "3-5 趟・1+2 級混搭",
  "6-10 趟・主要 spot 深度走訪",
  "11-15 趟・私房 spot 行家",
  "16+ 趟・秘境 + 行家專屬",
];

const VISITED_KEY = "japan-planner:visited"; // 去過 + 排除(従来)
const LOVED_KEY = "japan-planner:loved"; // 去過 + 喜歡(類似推奨用 bookmark)
const WISHLIST_KEY = "japan-planner:wishlist"; // 想去(必入選 bookmark)
const INPUT_KEY = "japan-planner:input";
const SAVED_PLANS_KEY = "japan-planner:plans"; // #133 保存済 plan 集
const SAVED_PLANS_MAX = 10;

type SavedPlan = {
  id: string;
  name: string;
  savedAt: string; // ISO date
  input: {
    level: PlannerLevel;
    days: number;
    region: string;
    themes: PlannerTheme[];
    month: number | null;
    seed: number;
  };
  plan: PlannedDay[];
};

// 月份氣候提示(#131)— 選擇旅行月份時顯示。
// 按月提供防寒、雨具、活動、擁擠程度資訊。
const MONTH_HINTS: Record<number, { tip: string; tone: "warn" | "info" | "good" }> = {
  1: { tip: "❄️ 北海道 / 東北 / 北陸 / 山陰正式進入雪季,防寒裝備必備。1/2 傳統正月行事多,觀光地大擁擠 + 住宿價格高峰", tone: "warn" },
  2: { tip: "❄️ 雪祭 peak(札幌 2 月上旬、湯西川 kamakura 祭、白川郷點燈),最嚴寒 + 空氣透明度極佳", tone: "info" },
  3: { tip: "🌸 河津櫻(伊豆 2 月下-3 月上)→ 西日本櫻花開花(3 月下),女兒節、東大寺修二會(3/1-14)", tone: "info" },
  4: { tip: "🌸 全國櫻花 peak(4 月上中、地區差異),黃金週前半最擁擠。吉野山櫻 + 芝櫻開花", tone: "warn" },
  5: { tip: "🍃 新綠 + 黃金週(4/29-5/5)peak、住宿價 1.5-2 倍。富士芝櫻祭(4 月中-5 月上)、粉蝶花(常陸海濱公園)", tone: "warn" },
  6: { tip: "🌧 梅雨(沖繩除外)— 雨具必備、室內觀光地推薦。繡球花 peak(鎌倉、箱根、伊勢)、賞螢季節", tone: "info" },
  7: { tip: "☀️ 梅雨明(7 月中-下)→ 酷暑 peak。山岳避暑(立山、上高地、蒜山)+ 海水浴開始。祇園祭(京都)", tone: "warn" },
  8: { tip: "☀️ 酷暑 + 暑假 peak。盆祭、花火大會集中(8/2-3 長岡、8/12-15 阿波舞、8/15 仙台七夕),全國 + 海外觀光客集中", tone: "warn" },
  9: { tip: "🍃 殘暑 + 颱風季。仙石原芒草、伊豆稻取細野高原芒草、9/1-3 越中八尾 owara 風盆", tone: "info" },
  10: { tip: "🍂 紅葉北上中(北海道 + 大雪 10 月初 → 關西 11 月中),正倉院展(奈良 10 月下-11 月中)、神嘗祭", tone: "good" },
  11: { tip: "🍂 本州紅葉 peak(京都 + 日光 + 嵐山 11 月中-下),住宿價格高峰。越前蟹開放(11/6)、寒鰤魚初出", tone: "warn" },
  12: { tip: "❄️ 富士山積雪 + 雪國正式入冬。聖誕燈飾、年末年始神社初詣大擁擠,住宿價格最高", tone: "warn" },
};

export default function PlannerPage() {
  const [level, setLevel] = useState<PlannerLevel>(0);
  const [days, setDays] = useState(5);
  const [region, setRegion] = useState("all");
  const [themes, setThemes] = useState<PlannerTheme[]>([]);
  const [month, setMonth] = useState<number | null>(null); // #131 旅行予定月 (1-12)
  const [visited, setVisited] = useState<string[]>([]); // 排除
  const [loved, setLoved] = useState<string[]>([]); // 喜歡 bookmark
  const [wishlist, setWishlist] = useState<string[]>([]); // 想去 bookmark
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]); // #133 保存済 plan 集
  const [lockedDays, setLockedDays] = useState<Set<number>>(new Set());
  const [plan, setPlan] = useState<PlannedDay[] | null>(null);
  const [poolStats, setPoolStats] = useState<{
    total: number;
    filtered: number;
    usable: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));

  // Mount: visited + input(URL query 優先 > localStorage)を復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem(VISITED_KEY);
      if (raw) setVisited(JSON.parse(raw));
      const lovedRaw = localStorage.getItem(LOVED_KEY);
      if (lovedRaw) setLoved(JSON.parse(lovedRaw));
      const wishRaw = localStorage.getItem(WISHLIST_KEY);
      if (wishRaw) setWishlist(JSON.parse(wishRaw));
      const plansRaw = localStorage.getItem(SAVED_PLANS_KEY);
      if (plansRaw) {
        const arr = JSON.parse(plansRaw);
        if (Array.isArray(arr)) setSavedPlans(arr);
      }
    } catch {
      /* ignore */
    }
    try {
      const u = new URLSearchParams(window.location.search);
      const hasUrlInput =
        u.has("lv") || u.has("d") || u.has("r") || u.has("t");
      if (hasUrlInput) {
        const lv = u.get("lv");
        if (lv !== null) {
          const n = Math.max(0, Math.min(4, Number(lv)));
          setLevel(n as PlannerLevel);
        }
        const d = u.get("d");
        if (d !== null) setDays(Math.max(1, Math.min(14, Number(d))));
        const r = u.get("r");
        if (r !== null) setRegion(r);
        const t = u.get("t");
        if (t !== null)
          setThemes(t.split(",").filter(Boolean).slice(0, 3) as PlannerTheme[]);
        const m = u.get("m");
        if (m !== null) {
          const n = Number(m);
          if (n >= 1 && n <= 12) setMonth(n);
        }
        // #129 seed from URL — 共有用
        const s = u.get("s");
        if (s !== null) {
          const n = parseInt(s, 36);
          if (Number.isFinite(n) && n > 0) setSeed(n);
        }
      } else {
        const raw = localStorage.getItem(INPUT_KEY);
        if (raw) {
          const j = JSON.parse(raw);
          if (typeof j.level === "number") setLevel(j.level as PlannerLevel);
          if (typeof j.days === "number") setDays(j.days);
          if (typeof j.region === "string") setRegion(j.region);
          if (Array.isArray(j.themes))
            setThemes(j.themes.slice(0, 3) as PlannerTheme[]);
          if (typeof j.month === "number" && j.month >= 1 && j.month <= 12)
            setMonth(j.month);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // input 変更時 localStorage に即書(URL は generate 時のみ — 不要 churn)
  useEffect(() => {
    try {
      localStorage.setItem(
        INPUT_KEY,
        JSON.stringify({ level, days, region, themes, month }),
      );
    } catch {
      /* ignore */
    }
  }, [level, days, region, themes, month]);

  const persistList = (key: string, next: string[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  // #134 Visited 3 類 cycle:なし → ✓ excluded → ♥ loved → ★ wishlist → なし
  // 各 list は互斥(同一 slug 一度に 1 つの状態のみ)。
  const cycleSpotMark = (slug: string) => {
    const inVisited = visited.includes(slug);
    const inLoved = loved.includes(slug);
    const inWishlist = wishlist.includes(slug);
    const removeFromAll = (arr: string[]) => arr.filter((s) => s !== slug);
    if (!inVisited && !inLoved && !inWishlist) {
      const next = [...visited, slug];
      setVisited(next);
      persistList(VISITED_KEY, next);
    } else if (inVisited) {
      const v = removeFromAll(visited);
      const l = [...loved, slug];
      setVisited(v); setLoved(l);
      persistList(VISITED_KEY, v); persistList(LOVED_KEY, l);
    } else if (inLoved) {
      const l = removeFromAll(loved);
      const w = [...wishlist, slug];
      setLoved(l); setWishlist(w);
      persistList(LOVED_KEY, l); persistList(WISHLIST_KEY, w);
    } else if (inWishlist) {
      const w = removeFromAll(wishlist);
      setWishlist(w);
      persistList(WISHLIST_KEY, w);
    }
  };

  // 後方互換用 (旧 toggleVisited 名)
  const toggleVisited = cycleSpotMark;

  // #133 Save current plan
  const saveCurrentPlan = () => {
    if (!plan || plan.length === 0) {
      alert("沒有可儲存的行程,請先生成一個。");
      return;
    }
    const name = prompt(
      "為這個行程取個名字(例:京都櫻花之旅 2026/4)",
      `${LEVEL_LABELS[level]} · ${days}日 · ${REGION_OPTIONS.find((r) => r.value === region)?.label ?? region}`,
    );
    if (!name) return;
    const newPlan: SavedPlan = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      savedAt: new Date().toISOString(),
      input: { level, days, region, themes, month, seed },
      plan,
    };
    const next = [newPlan, ...savedPlans].slice(0, SAVED_PLANS_MAX);
    setSavedPlans(next);
    persistList(SAVED_PLANS_KEY, next as unknown as string[]);
    // ↑ 型は string[] 想定だが JSON.stringify は同じく動く
  };

  const loadSavedPlan = (p: SavedPlan) => {
    setLevel(p.input.level);
    setDays(p.input.days);
    setRegion(p.input.region);
    setThemes(p.input.themes);
    setMonth(p.input.month);
    setSeed(p.input.seed);
    setPlan(p.plan);
    setLockedDays(new Set()); // ロック state はクリア
  };

  const deleteSavedPlan = (id: string) => {
    if (!confirm("確定要刪除這個儲存的行程?")) return;
    const next = savedPlans.filter((p) => p.id !== id);
    setSavedPlans(next);
    persistList(SAVED_PLANS_KEY, next as unknown as string[]);
  };

  const generate = (newSeed?: number) => {
    const useSeed = newSeed ?? seed;
    setSeed(useSeed);
    // URL 同期(分享できる + back button 効く)
    try {
      const params = new URLSearchParams();
      params.set("lv", String(level));
      params.set("d", String(days));
      params.set("r", region);
      if (themes.length > 0) params.set("t", themes.join(","));
      if (month !== null) params.set("m", String(month));
      params.set("s", useSeed.toString(36)); // #129 seed も URL に
      window.history.replaceState({}, "", `?${params.toString()}`);
    } catch {
      /* ignore */
    }
    startTransition(async () => {
      const res = await fetch("/api/planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          days,
          region,
          themes,
          excludedSlugs: visited,
          seed: useSeed,
        }),
      });
      const json = await res.json();
      const newPlan = (json.plan ?? []) as PlannedDay[];
      // ロックされた日は旧 plan の内容を保持(新生成された該当日の spot を上書き)
      setPlan((oldPlan) => {
        if (!oldPlan || lockedDays.size === 0) return newPlan;
        return newPlan.map((d) => {
          if (!lockedDays.has(d.day)) return d;
          const old = oldPlan.find((o) => o.day === d.day);
          return old ?? d;
        });
      });
      setPoolStats({
        total: json.pool_total ?? 0,
        filtered: json.pool_filtered ?? 0,
        usable: json.pool_usable ?? 0,
      });
    });
  };

  const swapSpot = async (dayNum: number, slug: string) => {
    if (!plan) return;
    const day = plan.find((d) => d.day === dayNum);
    if (!day) return;
    const target = day.spots.find((s) => s.slug === slug);
    if (!target) return;
    // Anchor = 該日 1 番目の lat/lon あるspot(地理拠点)
    const anchor = day.spots.find((s) => s.lat !== null && s.lon !== null);
    if (!anchor || anchor.lat === null || anchor.lon === null) return;
    // Exclude: 既 plan 全 slug + visited(重複防止)
    const allSlugs = plan.flatMap((d) => d.spots.map((s) => s.slug));
    const excluded = [...new Set([...allSlugs, ...visited])];

    const res = await fetch("/api/planner/swap-spot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        themes,
        region,
        excludedSlugs: excluded,
        anchor: { lat: anchor.lat, lon: anchor.lon },
        category: target.category,
        why: target.why ?? "替換",
        seed: Math.floor(Math.random() * 1e9),
      }),
    });
    const json = await res.json();
    const newSpot = json.spot;
    if (!newSpot) return; // 候補 0 → 何もしない

    setPlan((old) => {
      if (!old) return old;
      return old.map((d) => {
        if (d.day !== dayNum) return d;
        return {
          ...d,
          spots: d.spots.map((s) => (s.slug === slug ? newSpot : s)),
        };
      });
    });
  };

  const toggleDayLock = (dayNum: number) => {
    setLockedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNum)) next.delete(dayNum);
      else next.add(dayNum);
      return next;
    });
  };

  // 「再生成」は常に新 seed(以前の「洗牌」と統合)。
  // 同 seed 再現は URL 共有で(将来の #129)。
  const regenerate = () => generate(Math.floor(Math.random() * 1e9));

  const toggleTheme = (t: PlannerTheme) => {
    if (themes.includes(t)) {
      setThemes(themes.filter((x) => x !== t));
    } else if (themes.length < 3) {
      setThemes([...themes, t]);
    }
  };

  const resetVisited = () => {
    const total = visited.length + loved.length + wishlist.length;
    if (
      confirm(`確定要清空全部 ${total} 個記錄?(✓${visited.length} ♥${loved.length} ★${wishlist.length})`)
    ) {
      setVisited([]); setLoved([]); setWishlist([]);
      persistList(VISITED_KEY, []);
      persistList(LOVED_KEY, []);
      persistList(WISHLIST_KEY, []);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <Link
          href="/japan"
          className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
        >
          ← 日本大小事備忘錄
        </Link>

        <header className="mt-6">
          <div className="flex items-baseline gap-3">
            <p className="font-mincho text-[10px] tracking-[0.4em] uppercase text-amber-800 dark:text-amber-600/80">
              Planner
            </p>
            <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
              旅&thinsp;程&thinsp;規&thinsp;劃&thinsp;器
            </span>
          </div>
          <h1 className="mt-3 font-mincho text-4xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
            為你自己生成行程
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            從 13,000+ spot DB 依熟練度 + 主題 + 地區自動生成。
            標記「去過」後重新生成 = 永遠都是新路線。資料只存於本機 localStorage。
          </p>
        </header>

        {/* Input form */}
        <section className="mt-10 space-y-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          {/* Level slider */}
          <div>
            <div className="flex items-baseline justify-between">
              <label className="font-mincho text-sm font-medium text-zinc-900 dark:text-zinc-50">
                熟練度
              </label>
              <span className="text-xs text-amber-800 dark:text-amber-400">
                {LEVEL_LABELS[level]} · {LEVEL_HINTS[level]}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value) as PlannerLevel)}
              className="mt-2 w-full accent-amber-700"
            />
            <div className="mt-1 flex justify-between text-[10px] text-zinc-500 font-mincho">
              {LEVEL_LABELS.map((l, i) => (
                <span key={l} className={i === level ? "text-amber-700 font-medium" : ""}>
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="font-mincho text-sm font-medium text-zinc-900 dark:text-zinc-50">
              天數
              <span className="ml-2 text-xs text-zinc-500">{days} 天</span>
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[3, 5, 7, 10, 14].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 rounded-md text-xs font-mincho border transition-colors ${
                    days === d
                      ? "bg-amber-100 border-amber-700 text-amber-900 dark:bg-amber-950/40 dark:border-amber-600 dark:text-amber-300"
                      : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500"
                  }`}
                >
                  {d} 天
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="font-mincho text-sm font-medium text-zinc-900 dark:text-zinc-50">
              地域
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {REGION_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRegion(r.value)}
                  className={`px-3 py-1 rounded-md text-xs font-mincho border transition-colors ${
                    region === r.value
                      ? "bg-amber-100 border-amber-700 text-amber-900 dark:bg-amber-950/40 dark:border-amber-600 dark:text-amber-300"
                      : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div>
            <label className="font-mincho text-sm font-medium text-zinc-900 dark:text-zinc-50">
              主題
              <span className="ml-2 text-xs text-zinc-500">
                最多 3 個 · 已選 {themes.length} / 3
              </span>
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {THEME_OPTIONS.map((t) => {
                const active = themes.includes(t.value);
                const disabled = !active && themes.length >= 3;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => toggleTheme(t.value)}
                    disabled={disabled}
                    className={`px-3 py-1 rounded-md text-xs font-mincho border transition-colors ${
                      active
                        ? "bg-amber-100 border-amber-700 text-amber-900 dark:bg-amber-950/40 dark:border-amber-600 dark:text-amber-300"
                        : disabled
                          ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400 cursor-not-allowed"
                          : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* #131 Month selector — 旅行予定月(任意)*/}
          <div>
            <label className="font-mincho text-sm font-medium text-zinc-900 dark:text-zinc-50">
              預計月份 <span className="ml-2 text-xs text-zinc-500">選填 · 顯示氣候 / 活動資訊</span>
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setMonth(null)}
                className={`px-2.5 py-1 rounded-md text-xs font-mincho border transition-colors ${
                  month === null
                    ? "bg-amber-100 border-amber-700 text-amber-900 dark:bg-amber-950/40 dark:border-amber-600 dark:text-amber-300"
                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500"
                }`}
              >
                不指定
              </button>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonth(m)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mincho border transition-colors ${
                    month === m
                      ? "bg-amber-100 border-amber-700 text-amber-900 dark:bg-amber-950/40 dark:border-amber-600 dark:text-amber-300"
                      : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500"
                  }`}
                >
                  {m}月
                </button>
              ))}
            </div>
            {month !== null && MONTH_HINTS[month] && (
              <div
                className={`mt-3 rounded-md px-3 py-2 text-[11px] leading-relaxed ${
                  MONTH_HINTS[month].tone === "warn"
                    ? "bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300"
                    : MONTH_HINTS[month].tone === "good"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300"
                      : "bg-sky-50 border border-sky-200 text-sky-900 dark:bg-sky-950/30 dark:border-sky-800 dark:text-sky-300"
                }`}
              >
                {MONTH_HINTS[month].tip}
              </div>
            )}
          </div>

          {/* #134 Marked spots stats — 3 類(✓去過 / ♥喜歡 / ★想去)*/}
          <div className="flex items-baseline justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4 flex-wrap gap-2">
            <div className="flex items-baseline gap-3 text-xs text-zinc-500">
              <span title="去過 + 排除(再生成時排除)">
                ✓ <span className="tabular-nums">{visited.length}</span>
              </span>
              <span title="去過 + 喜歡(類似 spot 推薦書籤)">
                ♥ <span className="tabular-nums">{loved.length}</span>
              </span>
              <span title="想去(將來會優先選入)">
                ★ <span className="tabular-nums">{wishlist.length}</span>
              </span>
              <span className="text-[10px] text-zinc-400">點擊循環切換 →</span>
            </div>
            {(visited.length + loved.length + wishlist.length) > 0 && (
              <button
                type="button"
                onClick={resetVisited}
                className="text-[10px] text-zinc-500 hover:text-amber-700 underline"
              >
                全清空
              </button>
            )}
          </div>

          {/* 単一の生成 button(以前は「再生成」+「洗牌」分離だが UX 混乱なので統合)*/}
          <div>
            <button
              type="button"
              onClick={regenerate}
              disabled={isPending}
              className="w-full px-4 py-2.5 rounded-md bg-amber-700 hover:bg-amber-800 disabled:bg-zinc-400 text-white font-mincho text-sm font-medium transition-colors"
            >
              {isPending
                ? "生成中..."
                : plan
                  ? "🎲 重新生成(新 seed)"
                  : "🎲 生成"}
            </button>
            {plan && (
              <div className="mt-2 flex items-baseline justify-between gap-2 flex-wrap">
                <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">
                  seed: {seed.toString(36)}
                </p>
                <div className="flex items-baseline gap-3">
                  {/* #133 Save plan button */}
                  <button
                    type="button"
                    onClick={saveCurrentPlan}
                    className="text-[10px] text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 underline transition-colors"
                    title={`儲存這個行程(最多 ${SAVED_PLANS_MAX} 件・只存於本機 localStorage)`}
                  >
                    💾 儲存 ({savedPlans.length}/{SAVED_PLANS_MAX})
                  </button>
                  {/* #129 分享按鈕 — 複製當前 URL(含 input + seed)*/}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert("URL 已複製,可以貼上分享給朋友。");
                      } catch {
                        alert("URL 複製失敗,請手動複製。");
                      }
                    }}
                    className="text-[10px] text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 underline transition-colors"
                    title="複製此行程 URL(同 seed + 條件可重現相同 plan)"
                  >
                    🔗 分享 URL
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* #133 Saved plans list */}
        {savedPlans.length > 0 && (
          <section className="mt-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-mincho text-sm font-medium text-zinc-900 dark:text-zinc-50">
                已儲存的行程 ({savedPlans.length})
              </h3>
              <span className="text-[10px] text-zinc-400">只存於本機 localStorage,不會跨裝置同步</span>
            </div>
            <ul className="space-y-2">
              {savedPlans.map((p) => (
                <li
                  key={p.id}
                  className="flex items-baseline justify-between gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs"
                >
                  <div className="flex-1 min-w-0 truncate">
                    <span className="font-mincho text-zinc-900 dark:text-zinc-50 font-medium">
                      {p.name}
                    </span>
                    <span className="ml-2 text-[10px] text-zinc-400 font-mono">
                      {p.savedAt.slice(0, 10)} · {p.plan.length}天 · {p.plan.reduce((a, d) => a + d.spots.length, 0)} spot
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => loadSavedPlan(p)}
                      className="text-[10px] text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 underline"
                    >
                      載入
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSavedPlan(p.id)}
                      className="text-[10px] text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 underline"
                    >
                      刪除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Generated plan */}
        {plan && plan.length > 0 && (
          <section className="mt-10 space-y-6">
            <div className="flex items-baseline justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <div className="flex items-baseline gap-3">
                <span className="font-mincho text-base font-medium text-zinc-900 dark:text-zinc-50">
                  生成的行程
                </span>
                <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-amber-800 dark:text-amber-600/80">
                  Plan
                </span>
              </div>
              {poolStats !== null && (
                <div className="flex items-baseline gap-2 text-[11px] tabular-nums">
                  <span className="text-zinc-500">
                    候選池 {poolStats.usable.toLocaleString()} / {poolStats.total.toLocaleString()} 件 → 抽出 {plan.reduce((a, d) => a + d.spots.length, 0)}
                  </span>
                  {poolStats.usable < 50 && poolStats.usable > 0 && (
                    <span className="rounded-md bg-amber-100 dark:bg-amber-950/40 px-1.5 py-0.5 text-amber-800 dark:text-amber-300 font-medium">
                      ⚠ 條件嚴 · 重複機率高
                    </span>
                  )}
                </div>
              )}
            </div>

            {plan.map((day) => (
              <DayCard
                key={day.day}
                day={day}
                visited={visited}
                loved={loved}
                wishlist={wishlist}
                onToggle={toggleVisited}
                locked={lockedDays.has(day.day)}
                onToggleLock={() => toggleDayLock(day.day)}
                onSwap={(slug) => swapSpot(day.day, slug)}
                onReorderTimeslot={(slot, newSlugOrder) =>
                  setPlan((old) => {
                    if (!old) return old;
                    return old.map((d) => {
                      if (d.day !== day.day) return d;
                      const slotSlugs = new Set(newSlugOrder);
                      const otherSpots = d.spots.filter(
                        (s) => !slotSlugs.has(s.slug),
                      );
                      const newSlotSpots = newSlugOrder
                        .map((slug) => d.spots.find((s) => s.slug === slug))
                        .filter(Boolean) as PlannedSpot[];
                      return {
                        ...d,
                        spots: [...otherSpots, ...newSlotSpots],
                      };
                    });
                  })
                }
              />
            ))}
          </section>
        )}

        {plan && plan.length === 0 && (
          <section className="mt-10 p-6 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700">
            <p className="text-sm text-amber-900 dark:text-amber-300">
              找不到符合條件的 spot。請減少「去過」標記,或調整主題 / 地區看看。
            </p>
          </section>
        )}

        {/* #132 Onboarding 空状態 — まだ plan 未生成のとき、example で導入 */}
        {plan === null && <OnboardingExample />}

        <footer className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 leading-relaxed">
          <p>
            popularity_tier 1-5 + 地理 clustering + 加權隨機生成。
            「去過」資料只存於本機 localStorage(不會跨裝置同步)。
            制式行程套餐請看 <Link href="/japan/itineraries" className="text-amber-700 hover:underline">/japan/itineraries</Link>。
          </p>
        </footer>
      </div>
    </main>
  );
}

// Strip 末尾括弧 + spot を Google Maps 検索クエリ化(GoogleMapsLink と同パターン)
const stripParen = (s: string | null | undefined) =>
  (s ?? "").replace(/\s*[(（].*$/u, "").trim();

function spotToQuery(spot: {
  title_ja: string | null;
  title_zh: string;
  municipality_ja: string | null;
}): string {
  const name = stripParen(spot.title_ja) || stripParen(spot.title_zh) || spot.title_zh;
  return spot.municipality_ja ? `${name} ${spot.municipality_ja}` : name;
}

// Google Maps Directions URL — origin + destination + waypoints(最多 9 個 stop)
// Doc: https://developers.google.com/maps/documentation/urls/get-started
function buildGmapsDirUrl(spots: { title_ja: string | null; title_zh: string; municipality_ja: string | null }[]): string {
  if (spots.length === 0) return "";
  if (spots.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotToQuery(spots[0]))}`;
  }
  const queries = spots.slice(0, 10).map(spotToQuery);
  const origin = queries[0];
  const destination = queries[queries.length - 1];
  const waypoints = queries.slice(1, -1).join("|");
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: "transit",
  });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function DayCard({
  day,
  visited,
  loved,
  wishlist,
  onToggle,
  locked,
  onToggleLock,
  onSwap,
  onReorderTimeslot,
}: {
  day: PlannedDay;
  visited: string[];
  loved: string[];
  wishlist: string[];
  onToggle: (slug: string) => void;
  locked: boolean;
  onToggleLock: () => void;
  onSwap: (slug: string) => void;
  onReorderTimeslot: (slot: Timeslot, newSlugOrder: string[]) => void;
}) {
  // #128 dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  // 「去過」除外 + timeslot 順 sort で Maps URL 構築(time-ordered route)
  const TIMESLOT_RANK: Record<string, number> = {
    morning: 0, noon: 1, afternoon: 2, evening: 3, night: 4,
  };
  const activeSpots = day.spots
    .filter((s) => !visited.includes(s.slug))
    .slice()
    .sort(
      (a, b) =>
        (TIMESLOT_RANK[a.timeslot ?? "afternoon"] ?? 2) -
        (TIMESLOT_RANK[b.timeslot ?? "afternoon"] ?? 2),
    );
  const gmapsUrl = activeSpots.length > 0 ? buildGmapsDirUrl(activeSpots) : "";

  // #130 Density feedback — 概算活動時間 = spot 数 × 1.5h + (spot 数 - 1) × 0.5h(移動)
  // 12h+ 詰め過ぎ / 6-12h 適切 / <6h 余裕
  const spotCount = activeSpots.length;
  const estimatedHours =
    spotCount > 0 ? spotCount * 1.5 + Math.max(0, spotCount - 1) * 0.5 : 0;
  const densityTone =
    estimatedHours > 12 ? "warn" : estimatedHours < 6 ? "loose" : "good";
  const densityMsg =
    densityTone === "warn"
      ? `⚠ 行程偏緊湊 (約 ${estimatedHours.toFixed(1)} 小時)`
      : densityTone === "loose"
        ? `🌿 行程寬鬆 (約 ${estimatedHours.toFixed(1)} 小時,可再加 1-2 處)`
        : `✓ 行程剛剛好 (約 ${estimatedHours.toFixed(1)} 小時)`;

  return (
    <article
      className={`rounded-lg border bg-white dark:bg-zinc-900 p-5 transition-colors ${
        locked
          ? "border-amber-400 dark:border-amber-700 ring-1 ring-amber-200 dark:ring-amber-900/40"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2 flex-wrap">
        <div className="flex items-baseline gap-3">
          <span className="font-mincho text-2xl font-medium tabular-nums text-amber-800 dark:text-amber-400">
            Day {day.day}
          </span>
          <span className="font-mincho text-sm text-zinc-700 dark:text-zinc-300">
            {day.region_label}
          </span>
          <button
            type="button"
            onClick={onToggleLock}
            aria-pressed={locked}
            className={`text-[11px] px-1.5 py-0.5 rounded-md border transition-colors ${
              locked
                ? "bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300"
                : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:border-amber-500"
            }`}
            title={locked ? "解鎖(重新生成時會更換)" : "鎖定這一天(重新生成時保留)"}
          >
            {locked ? "🔒 鎖定" : "🔓"}
          </button>
        </div>
        {gmapsUrl && (
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-[11px] text-sky-700 dark:text-sky-400 hover:underline"
            title={`用 Google Maps 路線開啟 ${activeSpots.length} 個 spot`}
          >
            🗺 全程 Maps 路線
          </a>
        )}
      </header>

      {/* #130 Density indicator — 1 日の活動時間 estimation */}
      {spotCount > 0 && (
        <p
          className={`mt-2 text-[10px] font-mincho ${
            densityTone === "warn"
              ? "text-amber-700 dark:text-amber-400"
              : densityTone === "loose"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-zinc-500 dark:text-zinc-500"
          }`}
        >
          {densityMsg}
        </p>
      )}
      <div className="mt-4 space-y-4">
        {groupByTimeslot(day.spots).map(({ slot, spots }) => {
          const slugIds = spots.map((s) => s.slug);
          const handleDragEnd = (e: DragEndEvent) => {
            const { active, over } = e;
            if (!over || active.id === over.id) return;
            const oldIndex = slugIds.indexOf(active.id as string);
            const newIndex = slugIds.indexOf(over.id as string);
            if (oldIndex < 0 || newIndex < 0) return;
            const newOrder = arrayMove(slugIds, oldIndex, newIndex);
            onReorderTimeslot(slot, newOrder);
          };
          return (
            <div key={slot}>
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="font-mincho text-[11px] tracking-[0.2em] text-amber-800 dark:text-amber-400 font-medium">
                  {TIMESLOT_LABEL_JA[slot]}
                </span>
                <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-600">
                  {TIMESLOT_HOUR[slot]}
                </span>
                <div className="flex-1 border-b border-zinc-200/70 dark:border-zinc-800/70 mb-0.5" />
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={slugIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {spots.map((spot, i) => {
                      const prev = i > 0 ? spots[i - 1] : null;
                      const markState: SpotMarkState = visited.includes(spot.slug)
                        ? "visited"
                        : loved.includes(spot.slug)
                          ? "loved"
                          : wishlist.includes(spot.slug)
                            ? "wishlist"
                            : "none";
                      return (
                        <div key={spot.slug}>
                          {prev && <TransitHint from={prev} to={spot} />}
                          <SortableSpotCard
                            spot={spot}
                            markState={markState}
                            onToggle={() => onToggle(spot.slug)}
                            onSwap={locked ? undefined : () => onSwap(spot.slug)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          );
        })}
      </div>
    </article>
  );
}

// #128 Sortable wrapper around SpotCard — gives it drag handle + dnd-kit hooks
function SortableSpotCard(props: {
  spot: {
    slug: string;
    title_zh: string;
    summary_zh: string;
    reason: string;
    category_glyph?: string;
    tier_label?: string;
    why?: string;
    popularity_tier?: number;
  };
  markState: SpotMarkState;
  onToggle: () => void;
  onSwap?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.spot.slug });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };
  return (
    <div ref={setNodeRef} style={style} className="relative">
      <SpotCard {...props} dragHandle={
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="shrink-0 mt-0.5 h-5 w-3 text-zinc-300 dark:text-zinc-700 hover:text-amber-600 dark:hover:text-amber-400 cursor-grab active:cursor-grabbing text-[14px] leading-none transition-colors"
          title="拖拉以調整時段內順序"
          aria-label="drag handle"
        >
          ⠿
        </button>
      } />
    </div>
  );
}

// spot を timeslot で分組(generator 側で timeslot 振り済)。
// 空 timeslot は出さない(例:1 食しかない日は evening セクション無)。
function groupByTimeslot(
  spots: PlannedSpot[],
): { slot: Timeslot; spots: PlannedSpot[] }[] {
  const map = new Map<Timeslot, PlannedSpot[]>();
  for (const s of spots) {
    const slot = (s.timeslot ?? "afternoon") as Timeslot;
    if (!map.has(slot)) map.set(slot, []);
    map.get(slot)!.push(s);
  }
  return TIMESLOT_ORDER.filter((slot) => map.has(slot)).map((slot) => ({
    slot,
    spots: map.get(slot)!,
  }));
}

// 2 spot 間の概算移動。lat/lon → 直線距離 km → 手段別所要時間 rule of thumb。
// 実際は Google Maps Directions を見るべき(その用の link が DayCard header にある)。
function approxDistKm(
  a: { lat: number | null; lon: number | null },
  b: { lat: number | null; lon: number | null },
): number | null {
  if (a.lat === null || a.lon === null || b.lat === null || b.lon === null)
    return null;
  const dLat = (a.lat - b.lat) * 111;
  const dLon = (a.lon - b.lon) * 91;
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

function travelEstimate(km: number): { mode: string; min: number } {
  // < 1km: 徒歩 (12 min/km), 1-15km: 電車/巴士 (30 km/h 含等車), >15km: 鉄道 (60 km/h)
  if (km < 1) return { mode: "徒歩", min: Math.max(2, Math.round(km * 12)) };
  if (km < 15) return { mode: "電車", min: Math.round((km / 30) * 60) + 5 };
  return { mode: "鉄道", min: Math.round((km / 60) * 60) + 10 };
}

function TransitHint({
  from,
  to,
}: {
  from: { lat: number | null; lon: number | null };
  to: { lat: number | null; lon: number | null };
}) {
  const km = approxDistKm(from, to);
  if (km === null) return null;
  const { mode, min } = travelEstimate(km);
  return (
    <div
      className="flex items-center gap-2 pl-8 py-0.5 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono"
      title="直線距離 + 經驗法則概算。實際請以 Maps 為準"
    >
      <span className="text-zinc-300 dark:text-zinc-700">↓</span>
      <span className="tabular-nums">{km.toFixed(1)} km</span>
      <span className="text-zinc-300 dark:text-zinc-700">·</span>
      <span>
        {mode} ~{min} 分
      </span>
    </div>
  );
}

// #132 Onboarding example — 初訪 user 向け、空白頁回避 + 入門 example.
// "中級 + 5 日 + 関西 + 古都 + 食" の typical sample を mock 表示。
function OnboardingExample() {
  return (
    <section className="mt-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-amber-800 dark:text-amber-600/80">
          Example
        </span>
        <h2 className="font-mincho text-base font-medium text-zinc-900 dark:text-zinc-50">
          範例行程
        </h2>
        <span className="font-mincho text-[10px] text-zinc-400">
          中級 · 5 天 · 關西 · 古都 + 食
        </span>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
        為了讓你掌握 Planner 生成行程的感覺,以下是 <span className="font-medium">中級者 · 5 天 · 關西地區 · 「古都 + 食」</span> 主題下會生成的典型範例。實際生成從 13,000+ spot DB 用加權隨機 + 地理 clustering,每次都是不同組合。
      </p>
      <div className="space-y-2 mb-5">
        <ExampleDay
          day={1}
          area="京都府 · 京都市"
          spots={[
            { time: "上午", name: "清水寺", reason: "Day 1 起點 · 必訪" },
            { time: "中午", name: "二年坂家常菜", reason: "用餐" },
            { time: "下午", name: "八坂神社 → 祇園白川", reason: "觀光" },
            { time: "傍晚", name: "先斗町居酒屋", reason: "用餐" },
            { time: "夜", name: "京町家旅館", reason: "住宿" },
          ]}
        />
        <ExampleDay
          day={3}
          area="奈良縣 · 奈良市"
          spots={[
            { time: "上午", name: "東大寺(清晨參拜)", reason: "Day 3 起點 · 必訪" },
            { time: "中午", name: "春日大社參道", reason: "觀光" },
            { time: "下午", name: "奈良町散策", reason: "觀光" },
            { time: "夜", name: "古都奈良 飛鳥莊", reason: "住宿" },
          ]}
        />
        <ExampleDay
          day={5}
          area="大阪府 · 大阪市"
          spots={[
            { time: "上午", name: "大阪城公園", reason: "Day 5 起點" },
            { time: "中午", name: "新世界串炸", reason: "用餐" },
            { time: "下午", name: "通天閣 + 道頓堀", reason: "觀光" },
            { time: "傍晚", name: "黑門市場邊走邊吃", reason: "再來一餐" },
          ]}
        />
      </div>
      <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
        💡 上面是固定的範例行程。要生成自己的行程,請在上方表單選擇條件,然後按 <span className="font-medium">「🎲 生成」</span>。標記「去過」後再重新生成,就會永遠出新的路線。
      </div>
    </section>
  );
}

function ExampleDay({
  day,
  area,
  spots,
}: {
  day: number;
  area: string;
  spots: { time: string; name: string; reason: string }[];
}) {
  return (
    <details className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
      <summary className="cursor-pointer px-3 py-2 flex items-baseline gap-2 text-xs">
        <span className="font-mincho font-medium tabular-nums text-amber-800 dark:text-amber-400">
          Day {day}
        </span>
        <span className="text-zinc-700 dark:text-zinc-300">{area}</span>
        <span className="text-zinc-400 dark:text-zinc-600">({spots.length} spot)</span>
      </summary>
      <ul className="px-3 pb-2 space-y-1">
        {spots.map((s, i) => (
          <li
            key={i}
            className="flex items-baseline gap-2 text-[11px] text-zinc-700 dark:text-zinc-300"
          >
            <span className="font-mincho text-[10px] text-amber-700 dark:text-amber-500 w-8">
              {s.time}
            </span>
            <span>{s.name}</span>
            <span className="text-zinc-400 dark:text-zinc-600 text-[10px]">
              · {s.reason}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}

// tier 1-5 を色階で表現:tier 1(必訪)= 濃いめ amber、tier 5(通好)= 淡め zinc
const TIER_CHIP_CLASS: Record<number, string> = {
  1: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/60",
  2: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/60",
  3: "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  4: "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700",
  5: "bg-white text-zinc-500 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-500 dark:border-zinc-800",
};

type SpotMarkState = "none" | "visited" | "loved" | "wishlist";

const MARK_BUTTON_CONFIG: Record<
  SpotMarkState,
  { icon: string; bg: string; title: string }
> = {
  none: {
    icon: "○",
    bg: "bg-white dark:bg-zinc-900 border-zinc-400 dark:border-zinc-600 text-transparent hover:border-amber-700 hover:text-zinc-400",
    title: "點擊 → ✓ 去過",
  },
  visited: {
    icon: "✓",
    bg: "bg-amber-700 border-amber-700 text-white",
    title: "✓ 去過(排除)→ 點擊 → ♥ 喜歡",
  },
  loved: {
    icon: "♥",
    bg: "bg-rose-500 border-rose-500 text-white",
    title: "♥ 去過 + 喜歡(推薦相似)→ 點擊 → ★ 想去",
  },
  wishlist: {
    icon: "★",
    bg: "bg-yellow-500 border-yellow-500 text-white",
    title: "★ 想去(優先選入)→ 點擊 → 取消",
  },
};

function SpotCard({
  spot,
  markState,
  onToggle,
  onSwap,
  dragHandle,
}: {
  spot: {
    slug: string;
    title_zh: string;
    summary_zh: string;
    reason: string;
    category_glyph?: string;
    tier_label?: string;
    why?: string;
    popularity_tier?: number;
  };
  markState: SpotMarkState;
  onToggle: () => void;
  onSwap?: () => void;
  dragHandle?: React.ReactNode;
}) {
  const tier = spot.popularity_tier ?? 3;
  const tierClass = TIER_CHIP_CLASS[tier] ?? TIER_CHIP_CLASS[3];
  const glyph = spot.category_glyph ?? spot.reason.split(" · ")[0] ?? "";
  const tierLabel = spot.tier_label ?? "";
  const why = spot.why ?? "";
  const isExcluded = markState === "visited";
  const markConfig = MARK_BUTTON_CONFIG[markState];

  return (
    <div
      className={`flex gap-3 rounded-md border p-3 transition-colors ${
        isExcluded
          ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 opacity-60"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
      }`}
    >
      {dragHandle}
      <button
        type="button"
        onClick={onToggle}
        aria-label={markConfig.title}
        className={`shrink-0 mt-0.5 h-5 w-5 rounded-sm border flex items-center justify-center text-xs transition-colors ${markConfig.bg}`}
        title={markConfig.title}
      >
        {markConfig.icon}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <Link
            href={`/japan/entry/${spot.slug}`}
            className={`font-mincho text-[14px] font-medium leading-snug hover:text-amber-900 dark:hover:text-amber-300 transition-colors ${
              isExcluded
                ? "text-zinc-400 line-through"
                : "text-zinc-900 dark:text-zinc-50"
            }`}
          >
            {spot.title_zh}
          </Link>
          {/* 単一 chip:[glyph + tier] tier 色階で重要度を視覚化、tooltip でフル reason */}
          <span
            className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-mincho tracking-wider ${tierClass}`}
            title={spot.reason}
          >
            <span className="font-medium">{glyph}</span>
            {tierLabel && <span className="opacity-70">·{tierLabel}</span>}
          </span>
        </div>
        <p className="mt-1 text-[11.5px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {spot.summary_zh}
        </p>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          {/* why のみ表示(tier/category は chip 側で重複)、淡灰の小字 */}
          {why && (
            <p className="text-[9px] text-zinc-400 dark:text-zinc-600 font-mincho italic">
              {why}
            </p>
          )}
          {/* 単一 spot 差し替え。lock 時 + excluded 時は disabled */}
          {onSwap && !isExcluded && (
            <button
              type="button"
              onClick={onSwap}
              className="text-[10px] text-zinc-400 dark:text-zinc-600 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              title="把這個 spot 換成同類別的另一個"
            >
              🔄 換
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
