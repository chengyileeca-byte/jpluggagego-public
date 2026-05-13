// ⚠️ DEPRECATED 2026-05-08
//
// Google Places API は付費サービスで、user が GCP $200 課金イベント
// 後に「他の有料サービスも一切使わない」方針に切替。本 wrapper は
// hard-disabled 状態 — 呼出した瞬間に throw。
//
// 影響を受けたエントリポイント(全て即時失敗):
//   - scripts/refresh-google-business-status.ts
//   - scripts/match-google-place-ids.ts
//   - scripts/verify-place-fields.ts
//   - scripts/match-kumamoto-{r2,r3,r4,r5,r6,rakugu}.ts
//
// 該当 npm script は package.json から除去済み(`npm run` 不可)。
// それでも `npx tsx scripts/...` で直接呼ばれた場合は本ファイルの
// throw でガード。
//
// 代替策(無料):
//   - 歇業偵測:Wikipedia API (verify-wikipedia.ts に既存) + 手動抽查
//   - POI 情報:OpenStreetMap Overpass API
//
// 環境變數 GOOGLE_PLACES_API_KEY が再設定されても本ガードを通すには
// 当該 throw を意図的に外す改修が必要 — つまり「うっかり再課金」を
// code review レベルでブロックする設計。

const DISABLED_MSG =
  "Google Places API has been disabled (paid service deprecated 2026-05). " +
  "See src/lib/google-places.ts header for context and free alternatives.";

// URL 定数は型互換性のため残置(throw で到達しない)。
const FIND_PLACE_URL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const PLACE_DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

function getApiKey(): never {
  throw new Error(DISABLED_MSG);
}

export interface FindPlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
}

export interface FindPlaceResponse {
  candidates: FindPlaceResult[];
  status: string;
  error_message?: string;
}

// Find Place from Text:文字 query → place_id。日文比中文準。
// language=ja 讓 candidates 返回日文名,方便人工核對是否配錯店。
// region=jp 偏向日本結果,降低跨國干擾。
export async function findPlaceByText(
  query: string,
): Promise<FindPlaceResult | null> {
  const url = new URL(FIND_PLACE_URL);
  url.searchParams.set("input", query);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("fields", "place_id,name,formatted_address");
  url.searchParams.set("language", "ja");
  url.searchParams.set("region", "jp");
  url.searchParams.set("key", getApiKey());

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Find Place HTTP ${res.status}`);
  }
  const data = (await res.json()) as FindPlaceResponse;
  if (data.status === "ZERO_RESULTS") return null;
  if (data.status !== "OK") {
    throw new Error(
      `Find Place ${data.status}: ${data.error_message ?? "unknown"}`,
    );
  }
  return data.candidates[0] ?? null;
}

export interface PlaceDetailsResult {
  place_id: string;
  name: string;
  business_status?: "OPERATIONAL" | "CLOSED_TEMPORARILY" | "CLOSED_PERMANENTLY";
}

export interface PlaceDetailsResponse {
  result: PlaceDetailsResult | null;
  status: string;
  error_message?: string;
}

// 取 business_status — Atomic field tier。一筆 ~$5-17/1000。
// 注意:place_id 失效時 status='NOT_FOUND',需要重新 find。
export async function getPlaceBusinessStatus(
  placeId: string,
): Promise<PlaceDetailsResult["business_status"] | "NOT_FOUND" | null> {
  const url = new URL(PLACE_DETAILS_URL);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "business_status,name");
  url.searchParams.set("language", "ja");
  url.searchParams.set("key", getApiKey());

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Place Details HTTP ${res.status}`);
  }
  const data = (await res.json()) as PlaceDetailsResponse;
  if (data.status === "NOT_FOUND") return "NOT_FOUND";
  if (data.status !== "OK") {
    throw new Error(
      `Place Details ${data.status}: ${data.error_message ?? "unknown"}`,
    );
  }
  return data.result?.business_status ?? null;
}

// 簡單 sleep — script 之間隔一下,避免一秒內打爆 QPS quota。
export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
