// Seed 滋賀県 R6 補完最終(1 筆 / Sprint 27.11 final)→ 223/223 完結
import { seedMain, type SeedRow } from "./seed-helpers/upsert-entries";
const rows: SeedRow[] = [
  {
    slug: "biwa-shiga-omi-park-walk",
    category: "entertainment",
    sub_type: "shiga_park",
    title_zh: "滋賀近江公園散策+ 1990 年代(全県・1990 年代以降公園 35+ 年+R1 食 近江牛+ 湖魚懐石+R1 衣 八幡商人館+R1 育 比叡山+ 八幡堀+ 長浜城+ 彦根城+R1 楽 ビワイチ自転車道派生・観光客代表+ 海外代表・¥0 散策無料)",
    title_ja: "近江公園散策",
    romaji: "Ōmi Park Walk",
    summary_zh: "**滋賀近江公園散策は 1990 年代以降 35+ 年+R1 食+衣+育+楽 派生・観光代表+海外代表**(全県)。¥0 散策無料。",
    content_md: "- 立地:**全県**\n- 起源:**1990 年代以降近江公園 35+ 年**",
    region: "kinki",
    prefecture_ja: "滋賀県",
    gun_ja: null,
    municipality_ja: "大津市",
    lg_code: "25201",
    area_types: ["castle_park"],
    lat: 35.0042,
    lon: 135.8683,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["omi_park_walk"],
    source: "manual",
  },
];
seedMain(rows, "shiga-final");
