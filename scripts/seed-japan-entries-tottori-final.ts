// Seed 鳥取県 R6 補完最終(2 筆 / Sprint 29.11 final)→ 223/223 完結
import { seedMain, type SeedRow } from "./seed-helpers/upsert-entries";
const tpl = (slug: string, category: string, sub_type: string, lg_code: string, muni: string, lat: number, lon: number, gun: string | null, title_zh: string, title_ja: string, romaji: string, summary_zh: string, content_md: string, tags: string[], price_tier: number = 0, area: string = "castle_park"): SeedRow => ({ slug, category, sub_type, title_zh, title_ja, romaji, summary_zh, content_md, region: "chugoku", prefecture_ja: "鳥取県", gun_ja: gun, municipality_ja: muni, lg_code, area_types: [area], lat, lon, season_start: null, season_end: null, event_start: null, event_end: null, price_tier, booking_window_days: null, closed_days: [], external_urls: {}, tags, source: "manual" });
const rows: SeedRow[] = [
  tpl("tottori-pref-park-walk", "entertainment", "tottori_park", "31201", "鳥取市", 35.5394, 134.2275, null, "鳥取砂丘西側散策+ 1955(鳥取市・1955 国立公園+R1 食 鳥取らっきょう+ 砂丘長芋+R1 衣 砂丘お土産+R1 育 鳥取砂丘+ 砂の美術館+R1 楽 砂丘ハイク+ 砂丘海岸派生・観光客代表+ 海外代表・¥0 散策無料)", "砂丘西側", "Sakyu Nishi Walk", "**鳥取砂丘西側散策は 1955+R1 食+衣+育+楽 派生・観光代表+海外代表**(鳥取)。¥0 散策無料。", "- 立地:**鳥取市**\n- 起源:**1955 国立公園**", ["sakyu_nishi_walk"], 0),
  tpl("tottori-east-park-walk", "entertainment", "tottori_park", "31302", "岩美町", 35.5825, 134.3367, "岩美郡", "岩美浦富海岸ハイキング+ 1928(岩美町・1928 名勝+1955 国立公園+R1 育 浦富海岸派生・観光客代表+ 海外代表・¥0 散策無料)", "浦富ハイク", "Uradome Hike", "**岩美浦富海岸ハイキングは 1928+1955+R1 育 派生・観光代表+海外代表**(岩美)。¥0 散策無料。", "- 立地:**岩美郡岩美町**\n- 起源:**1928 名勝 + 1955 国立公園**", ["uradome_hike"], 0),
];
seedMain(rows, "tottori-final");
