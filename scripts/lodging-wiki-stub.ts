// Stage 1 of #118 wiki-content cleanup:
//   603 件 lodging entry に Wikipedia copy 残留 — stub 化して
//   production から wiki 文字列を撤去 + title aggregate marker を剝離。
//   Stage 2 (L1-L5 sprint round) で各 entry を deep research 重写。
//
// 処理:
//   1. title_zh の末尾括弧 (...) を削除 + 「+ X 軒」「R1 育」「派生」等の aggregate marker 除去
//   2. title_ja があれば title_zh に転用(乾淨日本語 hotel 名はそのまま繁中で OK)
//   3. summary_zh を metadata-based safe placeholder に置換
//   4. content_md を null
//   5. pending_rewrite フラグ追加(L1-L5 batch で消化)

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FILE = join(process.cwd(), "public", "data", "japan_entries.json");
const WIKI_PATTERN = /登録有形文化財一覧|Wikipedia 出典|出典:Wikipedia/;

// title 末尾括弧 (...) を剝離。aggregate marker (+ X 軒 / R1 育 等) を含む場合のみ削除。
// 普通の説明括弧 (例「(JR 奈良駅近)」) は保持したいので marker 検出時のみ。
const AGG_IN_PAREN = /[+＋]\s*\d+\s*軒|全\s*\d+\s*軒|\d+\s*軒以上|R\d+\s+(食|衣|住|行|育|樂)|派生|エリア住宿|一覧|周辺の宿|宿泊先\s*まとめ/;

function cleanTitle(titleZh: string, titleJa: string | null): string {
  // 1) title_ja が乾淨ならそれを優先(日文 hotel 名は繁中圈でもそのまま流通)
  if (titleJa && !AGG_IN_PAREN.test(titleJa) && titleJa.length >= 2) {
    return titleJa.trim();
  }
  // 2) title_zh の括弧前を取る
  const parenStart = titleZh.search(/[(（]/);
  let base = parenStart > 0 ? titleZh.slice(0, parenStart) : titleZh;
  // 3) aggregate marker (例「砥部焼旅館+ 砥部温泉」) を 「+」で分割し先頭のみ
  if (/[+＋]/.test(base) && AGG_IN_PAREN.test(titleZh)) {
    base = base.split(/[+＋]/)[0];
  }
  return base.trim();
}

// sub_type ベースの繁中 placeholder summary を生成。
// (深度内容は L1-L5 で書き直す — ここは「該物件は X 県 Y 市の Z 施設」レベル)
const SUB_TYPE_LABEL_ZH: Record<string, string> = {
  luxury_hotel: "高級飯店",
  international_luxury: "國際高級飯店",
  business_hotel: "商務旅館",
  budget_hotel_chain: "經濟連鎖飯店",
  hotel: "飯店",
  ryokan: "傳統旅館",
  onsen_ryokan: "溫泉旅館",
  onsen: "溫泉",
  shukubo_temple: "宿坊(寺院住宿)",
  shukubo: "宿坊",
  kyo_machiya_stay: "京都町家住宿",
  rural_minshuku: "鄉村民宿",
  rural_ryokan_kyoto: "京都鄉村旅館",
  island_minshuku: "離島民宿",
  capsule_hostel: "膠囊旅館 / 青年旅舍",
  glamping_camp: "Glamping 露營",
  pension: "Pension(歐式民宿)",
  resort: "度假村",
  okinawa_resort_hotel: "沖繩度假飯店",
  hiroshima_setouchi_classical: "瀬戸内經典旅館",
  hiroshima_miyajima_lodging: "宮島住宿",
  lodging_area_guide: "區域住宿綜覽",
  itinerary: "行程",
  seasonal_lodging: "季節限定住宿",
  history: "歷史住宿",
  checklist: "住宿備忘",
  american_house_stay: "美式洋館住宿",
};

function placeholderSummary(
  cleanTitle: string,
  prefectureJa: string,
  municipalityJa: string | null,
  subType: string | null,
  priceTier: number | null,
): string {
  const subLabel =
    (subType && SUB_TYPE_LABEL_ZH[subType]) ??
    (subType?.includes("ryokan") ? "傳統旅館" : null) ??
    (subType?.includes("onsen") ? "溫泉旅館" : null) ??
    (subType?.includes("business") ? "商務旅館" : null) ??
    (subType?.includes("machiya") ? "町家住宿" : null) ??
    (subType?.includes("pension") ? "Pension" : null) ??
    (subType?.includes("traditional") ? "傳統旅館" : null) ??
    (subType?.includes("classical") ? "經典旅館" : null) ??
    (subType?.includes("lodging") ? "住宿" : null) ??
    (subType?.includes("hotel") ? "飯店" : null) ??
    "住宿";
  const loc = municipalityJa
    ? `${prefectureJa}${municipalityJa}`
    : prefectureJa;
  const priceHint =
    priceTier && priceTier >= 4
      ? "高價位"
      : priceTier === 3
        ? "中價位"
        : priceTier && priceTier <= 2
          ? "經濟價位"
          : null;
  const priceClause = priceHint ? `(${priceHint})` : "";
  return `${cleanTitle} 是位於${loc}的${subLabel}${priceClause}。詳細介紹整備中,實際房型 / 價位 / 預約請參考下方予約サイト檢索。`;
}

function main() {
  const raw = readFileSync(FILE, "utf-8");
  const all = JSON.parse(raw) as Array<Record<string, unknown>>;

  let processed = 0;
  let titlesChanged = 0;

  for (const e of all) {
    if (e.category !== "lodging") continue;
    const summaryHit =
      typeof e.summary_zh === "string" && WIKI_PATTERN.test(e.summary_zh);
    const contentHit =
      typeof e.content_md === "string" && WIKI_PATTERN.test(e.content_md as string);
    if (!summaryHit && !contentHit) continue;

    const titleZh = String(e.title_zh ?? "");
    const titleJa = (e.title_ja as string | null) ?? null;
    const newTitle = cleanTitle(titleZh, titleJa);
    if (newTitle !== titleZh) {
      e.title_zh = newTitle;
      titlesChanged++;
    }

    e.summary_zh = placeholderSummary(
      newTitle,
      String(e.prefecture_ja ?? ""),
      (e.municipality_ja as string | null) ?? null,
      (e.sub_type as string | null) ?? null,
      (e.price_tier as number | null) ?? null,
    );
    e.content_md = null;
    (e as Record<string, unknown>).pending_rewrite = true;

    processed++;
  }

  writeFileSync(FILE, JSON.stringify(all, null, 2) + "\n", "utf-8");
  console.log(`stub processed: ${processed}`);
  console.log(`titles changed: ${titlesChanged}`);
}

main();
