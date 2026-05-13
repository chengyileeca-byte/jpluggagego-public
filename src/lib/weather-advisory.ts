import "server-only";
import { PREFECTURES } from "@/lib/japan";

// JMA (気象庁) 警報 JSON feed。跟 /bosai/warning/data/warning/{areaCode}.json
// 要當 prefecture-level 代理,看目的地 + 出發地 兩側是否有配送級別的警報。
//
// 我們刻意只看「警報」以上(含特別警報),不碰「注意報」— 注意報太頻,
// 延 0-1 天的假陽性會把 banner 當狼來了用。

export type Severity = "severe" | "high";

export interface ActiveWarning {
  code: string;
  /** 中文簡稱用於 UI */
  label: string;
  severity: Severity;
}

export interface PrefAdvisory {
  prefecture: string;
  warnings: ActiveWarning[];
  /** 最高嚴重度(沒警報就是 null) */
  top: Severity | null;
  /** JMA 的 report datetime,用於 UI 顯示「最新於...」 */
  reportDatetime: string | null;
}

export interface RouteAdvisory {
  origin: PrefAdvisory | null;
  destination: PrefAdvisory | null;
  /** 兩側合併的最高嚴重度。null = 都沒警報 */
  worst: Severity | null;
  /** 根據 worst 的建議延遲天數文案 key */
  delayKey: "weather.delay.severe" | "weather.delay.high" | null;
}

// JMA 地區碼:多數縣用 XX0000(例:東京都→130000)。
// 北海道 / 鹿児島 / 沖縄 的 XX0000 會 404,需要用子區代表。
function prefToAreaCode(prefName: string): string | null {
  const p = PREFECTURES.find((x) => x.name === prefName);
  if (!p) return null;
  if (p.code === "01") return "016000"; // 北海道 → 石狩・空知・後志(札幌代表)
  if (p.code === "46") return "460100"; // 鹿児島 → 薩摩地方(本土代表)
  if (p.code === "47") return "471000"; // 沖縄 → 沖縄本島
  return `${p.code}0000`;
}

// 警報碼對照 — 只列我們關心(宅配會延)的項目,其他未列一律忽略(含所有注意報 10-29)。
// Code 對應以 JMA 官網 bosai/warning/ 前端 WARNING_INFOS 為準(比 jmaxml PDF 可靠,
// PDF 上「05 暴風雪/06 大雪」已被 JMA 前端對調成「05 暴風/06 大雪」)。
// 警報 02-08、特別警報 32-38(洪水無特別警報;34、39 不存在)。
const WARNING_TABLE: Record<string, { label: string; severity: Severity }> = {
  "02": { label: "暴風雪警報", severity: "severe" },
  "03": { label: "大雨警報", severity: "high" },
  "04": { label: "洪水警報", severity: "high" },
  "05": { label: "暴風警報", severity: "high" },
  "06": { label: "大雪警報", severity: "severe" },
  "07": { label: "波浪警報", severity: "high" },
  "08": { label: "高潮警報", severity: "high" },
  "32": { label: "暴風雪特別警報", severity: "severe" },
  "33": { label: "大雨特別警報", severity: "severe" },
  "35": { label: "暴風特別警報", severity: "severe" },
  "36": { label: "大雪特別警報", severity: "severe" },
  "37": { label: "波浪特別警報", severity: "severe" },
  "38": { label: "高潮特別警報", severity: "severe" },
};

interface JmaArea {
  code: string;
  warnings: Array<{ code?: string; status: string }>;
}
interface JmaResponse {
  reportDatetime?: string;
  areaTypes?: Array<{ areas?: JmaArea[] }>;
}

// In-process TTL cache。30 分鐘 — JMA 大約 5-15 分鐘會更新,30 分鐘是
// 可接受的延遲與流量折衷。多實例部署時各自 cache 是 OK 的,因為
// endpoint 負擔極小(每縣 <20KB)且 JMA 公開無 rate limit 政策。
const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { at: number; data: PrefAdvisory }>();

async function fetchPrefAdvisory(prefName: string): Promise<PrefAdvisory | null> {
  const code = prefToAreaCode(prefName);
  if (!code) return null;

  const now = Date.now();
  const cached = cache.get(code);
  if (cached && now - cached.at < CACHE_TTL_MS) {
    // 快取的 prefecture 標籤固定,不用再 clone
    return cached.data;
  }

  let json: JmaResponse;
  try {
    const res = await fetch(
      `https://www.jma.go.jp/bosai/warning/data/warning/${code}.json`,
      {
        headers: { "User-Agent": process.env.SCRAPER_USER_AGENT ?? "JPLuggageGoBot/0.1" },
        signal: AbortSignal.timeout(6000),
      },
    );
    if (!res.ok) {
      console.warn("[weather] JMA status", res.status, code);
      return null;
    }
    json = (await res.json()) as JmaResponse;
  } catch (e) {
    console.warn("[weather] JMA fetch failed", code, e);
    return null;
  }

  // 縣內任一子區有 active(status=継続/発表)且在 WARNING_TABLE 的,
  // 計入一次。跨子區去重:同樣 code 只回一筆(縣內有多區重複無意義)。
  const active = new Map<string, ActiveWarning>();
  for (const at of json.areaTypes ?? []) {
    for (const area of at.areas ?? []) {
      for (const w of area.warnings ?? []) {
        if (!w.code) continue;
        if (w.status !== "継続" && w.status !== "発表") continue;
        const def = WARNING_TABLE[w.code];
        if (!def) continue;
        if (!active.has(w.code)) {
          active.set(w.code, { code: w.code, label: def.label, severity: def.severity });
        }
      }
    }
  }
  const warnings = [...active.values()];
  const top: Severity | null = warnings.some((w) => w.severity === "severe")
    ? "severe"
    : warnings.length > 0
      ? "high"
      : null;

  const result: PrefAdvisory = {
    prefecture: prefName,
    warnings,
    top,
    reportDatetime: json.reportDatetime ?? null,
  };
  cache.set(code, { at: now, data: result });
  return result;
}

// 出發 + 目的地兩側警報合併。任一側有警報就回傳,UI 讓使用者自己
// 判斷是哪端影響。JMA fetch 失敗 / 同縣 都當 null 處理。
export async function checkRouteWeather(
  originPref: string | null | undefined,
  destinationPref: string | null | undefined,
): Promise<RouteAdvisory> {
  const o = originPref?.trim() || null;
  const d = destinationPref?.trim() || null;
  const sameSide = o && d && o === d;

  const [origin, destination] = await Promise.all([
    o ? fetchPrefAdvisory(o) : Promise.resolve(null),
    sameSide ? Promise.resolve(null) : d ? fetchPrefAdvisory(d) : Promise.resolve(null),
  ]);

  // 若兩端同縣,複用 origin 當 destination 不會多打一次 JMA
  const dest = sameSide ? origin : destination;

  const tops: Severity[] = [];
  if (origin?.top) tops.push(origin.top);
  if (dest?.top && dest !== origin) tops.push(dest.top);
  const worst: Severity | null = tops.includes("severe")
    ? "severe"
    : tops.includes("high")
      ? "high"
      : null;

  return {
    origin: origin ?? null,
    destination: dest ?? null,
    worst,
    delayKey:
      worst === "severe"
        ? "weather.delay.severe"
        : worst === "high"
          ? "weather.delay.high"
          : null,
  };
}
