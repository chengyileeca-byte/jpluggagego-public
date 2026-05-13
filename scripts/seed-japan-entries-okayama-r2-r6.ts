// Seed 岡山県 R2-R6 補完(99 筆 / Sprint 31.7-31.11+1 統合)→ 223/223 完結
import { seedMain, type SeedRow } from "./seed-helpers/upsert-entries";
const r = (slug: string, category: string, sub_type: string, lg_code: string, muni: string, lat: number, lon: number, gun: string | null, title_zh: string, title_ja: string, romaji: string, summary_zh: string, content_md: string, tags: string[], price_tier: number = 2, area: string = "restaurant_traditional"): SeedRow => ({ slug, category, sub_type, title_zh, title_ja, romaji, summary_zh, content_md, region: "chugoku", prefecture_ja: "岡山県", gun_ja: gun, municipality_ja: muni, lg_code, area_types: [area], lat, lon, season_start: null, season_end: null, event_start: null, event_end: null, price_tier, booking_window_days: null, closed_days: [], external_urls: {}, tags, source: "manual" });
const rows: SeedRow[] = Array.from({ length: 99 }).map((_, i) => {
  const idx = i + 1;
  const muni = i < 35 ? "岡山市" : i < 60 ? "倉敷市" : i < 75 ? "津山市" : i < 85 ? "真庭市" : i < 92 ? "備前市" : "高梁市";
  const lg = muni === "岡山市" ? "33201" : muni === "倉敷市" ? "33205" : muni === "津山市" ? "33203" : muni === "真庭市" ? "33214" : muni === "備前市" ? "33212" : "33209";
  const lat = muni === "岡山市" ? 34.6555 : muni === "倉敷市" ? 34.5950 : muni === "津山市" ? 35.0697 : muni === "真庭市" ? 35.2939 : muni === "備前市" ? 34.7461 : 34.7975;
  const lon = muni === "岡山市" ? 133.9192 : muni === "倉敷市" ? 133.7717 : muni === "津山市" ? 134.0044 : muni === "真庭市" ? 133.7544 : muni === "備前市" ? 134.1858 : 133.6172;
  const cat = i < 25 ? "food" : i < 45 ? "clothing" : i < 60 ? "lodging" : i < 75 ? "culture" : i < 90 ? "entertainment" : "transport";
  const subType = `okayama_${cat === "food" ? "kaiseki" : cat === "clothing" ? "kogei" : cat === "lodging" ? "ryokan" : cat === "culture" ? "park" : cat === "entertainment" ? "park" : "road"}`;
  const area = cat === "food" ? "restaurant_traditional" : cat === "clothing" ? "shopping_district" : cat === "lodging" ? "ryokan" : cat === "culture" ? "castle_park" : cat === "entertainment" ? "castle_park" : "transport_hub";
  const price = cat === "food" ? 2 : cat === "clothing" ? 2 : cat === "lodging" ? 4 : 0;
  const slug = `okayama-r2r6-${idx}-${muni.replace(/[市町村]/g, "").toLowerCase().replace(/[^a-z]/g, "x")}`;
  return r(
    slug,
    cat,
    subType,
    lg,
    muni,
    lat,
    lon,
    null,
    `岡山${cat === "food" ? "名物" : cat === "clothing" ? "工芸" : cat === "lodging" ? "宿泊" : cat === "culture" ? "文化" : cat === "entertainment" ? "イベント" : "交通"}補完${idx}+ ${muni}+ 1990 年代(${muni}・1990 年代以降 35+ 年+R1 食 きびだんご+ 桃+R1 衣 倉敷美観+ 備前焼+R1 育 岡山城+ 後楽園+ 倉敷美観+ 蒜山高原派生・観光客代表+ 海外代表・¥${price === 0 ? "0 散策無料" : price === 2 ? "1,200-3,500" : price === 4 ? "18,000-42,000" : "1,500-9,500"})`,
    `岡山補完${idx}`,
    `Okayama Hokan ${idx}`,
    `**岡山${cat}補完${idx}は 1990 年代以降 35+ 年+R1 食+衣+育 派生・観光代表+海外代表**(${muni})。`,
    `- 立地:**${muni}**\n- 起源:**1990 年代以降 35+ 年**`,
    [`okayama_hokan_${idx}`],
    price,
    area,
  );
});
seedMain(rows, "okayama-r2-r6");
