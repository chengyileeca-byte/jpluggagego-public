// Sprint 1.4 育 補完 — 1 筆(R1 育 = 21 件 標準達成)。
// 漏れ:秩父系 6 軸の 1 つ「龍勢祭」を追加。
import { seedMain, type SeedRow } from "./seed-helpers/upsert-entries";

const rows: SeedRow[] = [
  {
    slug: "chichibu-ryusei-matsuri",
    category: "culture",
    sub_type: "saitama_chichibu_culture",
    title_zh: "龍勢祭(秩父市吉田・椋神社例祭・10 月第 2 日曜+ 江戸期から伝統+ 1979 国指定重要無形民俗文化財・農民手作り龍勢花火 27 流派 30 本打上+ アニメ「あの花」聖地巡礼 2011 派生・観客 5 万人/1 日)",
    title_ja: "龍勢祭",
    romaji: "Ryūsei Matsuri",
    summary_zh: "**龍勢祭は椋神社例祭・10 月第 2 日曜・江戸期から伝統・1979 国指定重要無形民俗文化財**(秩父市吉田・**農民手作り龍勢花火 27 流派 30 本打上**)。アニメ「あの花」聖地巡礼 2011 派生、観客 5 万人/1 日。",
    content_md:
      "- 立地:**秩父市吉田(椋神社例祭)**\n- 開催:**10 月第 2 日曜**\n- 起源:**江戸期から伝統**\n- 認定:**1979 国指定重要無形民俗文化財**\n- 規模:**27 流派 30 本打上 + 観客 5 万人/1 日**\n- 文化:**アニメ「あの花」聖地巡礼 2011 派生**",
    region: "kanto",
    prefecture_ja: "埼玉県",
    gun_ja: null,
    municipality_ja: "秩父市",
    lg_code: "11207",
    area_types: ["festival_grounds", "temple_shrine"],
    lat: 36.0489,
    lon: 138.9817,
    season_start: "2026-10-01",
    season_end: "2026-10-15",
    event_start: "2026-10-11T13:00:00+09:00",
    event_end: "2026-10-11T18:00:00+09:00",
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {
      wikipedia_ja: "https://ja.wikipedia.org/wiki/龍勢祭",
    },
    tags: ["ryusei_matsuri", "1979_national", "27_school", "ano_hana_2011"],
    source: "manual",
  },
];

seedMain(rows, "saitama-culture-r1-suppl");
