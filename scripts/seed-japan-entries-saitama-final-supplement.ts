// 第十一卷 埼玉県 final supplement — 222 → 223 完結。
// 原因:R4 育 で iwatsuki-doll-museum-2020 を再使用し R1 衣 の同 slug を
// 上書きしたため total -1。R1 衣 + R4 育 で同博物館の異観点だが、slug 重複
// は schema 的に 1 件にしかならない。R1 衣 を補完するため別 slug で
// 「岩槻人形博物館 衣装専門展示」を新規追加。
import { seedMain, type SeedRow } from "./seed-helpers/upsert-entries";

const rows: SeedRow[] = [
  {
    slug: "iwatsuki-doll-museum-shozoku",
    category: "fashion",
    sub_type: "saitama_doll_costume",
    title_zh: "岩槻人形博物館 装束特化展(さいたま市岩槻区本町・R1 衣 岩槻人形装束派生・人形装束製作実演 + 雛人形 + 武者人形 + 御所人形・国際観光客向け衣装専門解説・春雛シーズン 1-3 月集中・入館 ¥300-450)",
    title_ja: "岩槻人形博物館装束特化",
    romaji: "Iwatsuki Doll Museum Shōzoku",
    summary_zh: "**岩槻人形博物館 装束特化展は R1 衣 岩槻人形装束派生・人形装束製作実演 + 雛+武者+御所人形**(さいたま岩槻区・**春雛 1-3 月集中**)。¥300-450。",
    content_md:
      "- 立地:**さいたま市岩槻区本町**\n- 関連:**R1 衣 岩槻人形装束派生**\n- 看板:**人形装束製作実演 + 雛人形 + 武者人形 + 御所人形**\n- 季節:**春雛シーズン 1-3 月集中**",
    region: "kanto",
    prefecture_ja: "埼玉県",
    gun_ja: null,
    municipality_ja: "さいたま市岩槻区",
    lg_code: "11100",
    area_types: ["museum_art", "industrial_heritage"],
    lat: 35.9505,
    lon: 139.6975,
    season_start: "2026-01-15",
    season_end: "2026-03-15",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["tuesday"],
    external_urls: {},
    tags: ["iwatsuki_doll_shozoku", "haru_hina"],
    source: "manual",
  },
];

seedMain(rows, "saitama-final-supplement");
