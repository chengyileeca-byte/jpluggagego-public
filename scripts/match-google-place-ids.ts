// 一次性配對 japan_entries.google_place_id
//
// 對每筆 google_place_id IS NULL 的 entry,用 title_ja + municipality_ja 做 Find Place,
// 取第一個 candidate 寫進 DB。失敗的留 NULL 跳過(下次再跑會 retry)。
//
// Usage:
//   npm run match:google-place:dry         # 印每筆會送的 query,不跑 API
//   npm run match:google-place:dry -- 5    # 只跑前 5 筆(實打 API)做檢驗
//   npm run match:google-place             # 全跑,寫進 DB
//
// 計費試算:
//   北海道 328 筆 × Find Place ~$5/1,000 = ~$1.6 一次
//   每月 free credit $200,完全 cover。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "fs";
import { join, dirname } from "path";
import { findPlaceByText, sleep } from "../src/lib/google-places";

// Phase 3 (post-Supabase SUNSET, 2026-05-04) — 直接 public/data/japan_entries.json
// を read/write する。shim の upsert は row 全置換で google_place_id しか
// 触れない部分更新と相性が悪いため、本スクリプトは shim を経由せず直接 IO する。

const DATA_DIR = "public/data";
const ENTRIES_JSON = join(DATA_DIR, "japan_entries.json");
const BY_PREF_DIR = join(DATA_DIR, "by-pref");
function prefSlugEnc(p: string): string {
  return encodeURIComponent(p);
}

function readAllEntries(): Record<string, unknown>[] {
  if (existsSync(ENTRIES_JSON)) {
    return JSON.parse(readFileSync(ENTRIES_JSON, "utf8")) as Record<
      string,
      unknown
    >[];
  }
  if (!existsSync(BY_PREF_DIR)) return [];
  const all: Record<string, unknown>[] = [];
  for (const d of readdirSync(BY_PREF_DIR)) {
    const f = join(BY_PREF_DIR, d, "japan_entries.json");
    if (existsSync(f)) {
      const arr = JSON.parse(readFileSync(f, "utf8")) as Record<
        string,
        unknown
      >[];
      all.push(...arr);
    }
  }
  return all;
}

function writeAllEntries(entries: Record<string, unknown>[]) {
  mkdirSync(dirname(ENTRIES_JSON), { recursive: true });
  writeFileSync(ENTRIES_JSON, JSON.stringify(entries, null, 2) + "\n");
  const buckets = new Map<string, Record<string, unknown>[]>();
  for (const e of entries) {
    const p = (e.prefecture_ja as string) || "_no_pref";
    const arr = buckets.get(p) ?? [];
    arr.push(e);
    buckets.set(p, arr);
  }
  for (const [p, arr] of buckets) {
    const dir = join(BY_PREF_DIR, prefSlugEnc(p));
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "japan_entries.json"),
      JSON.stringify(arr, null, 2) + "\n",
    );
  }
}

interface EntryRow {
  id: number;
  slug: string;
  sub_type: string;
  title_ja: string | null;
  title_zh: string;
  municipality_ja: string | null;
  prefecture_ja: string;
}

// 這幾個 sub_type 是抽象 / 票券 / 概念,沒對應 Google place(已知 ZERO_RESULTS),
// 直接跳過避免浪費 Find Place 配額 + log noise。
// 加新 sub_type 前先確認:該類條目是否多數會被 Google 找到實體 place?
const SKIP_SUB_TYPES = new Set<string>([
  "ticket_promo", // 票券優惠(JR Pass / 1日券)
  "route_map_urban", // 都市交通圖(抽象)
  "regional_custom", // 地方人情(風俗/概念,非地點)
  "shopping_district_urban", // 商店街・散策路線(抽象 zone・非單一 place)
  "shopping_district_local", // 地方商店街(同上)
  "lodging_area_guide", // 住宿區域推薦(抽象 zone・非單一 place)
  "seasonal_lodging", // 季節限定住宿推薦(meta-content)
  // 行類抽象 sub_types
  "kyo_one_day_pass", // 1 日券(抽象票券)
  "area_access_guide", // エリア別アクセス(抽象 zone)
  "walking_route", // 散策路線
  "seasonal_transit", // 季節限定運行・交通規制
  "accessibility_info", // バリアフリー情報
  "kyo_railway_company", // 鉄道会社全体(個社の本社が place id だが abstract)
  // 育類抽象 sub_types
  "ancient_festival", // 祭礼(具体場所は別 entry なので skip)
  "literature_pilgrimage", // 文学聖地(抽象テーマ)
  // 樂類抽象 sub_types(Sprint 15.6 奈良楽)
  "model_course", // 観光モデルコース(複数 spot 横断 1 日プラン)
]);

// Per-slug 永久 skip — 跑過多次都得到誤配對結果(Google 找不到真正對應的店),
// 為避免每次跑 match 都重新誤配對,在這裡 hard-block。
// 解除前要先確認 Google Places 真的有對應條目了。
const SKIP_SLUGS = new Set<string>([
  // 衣類:多 venue 的行事(分散在五花街,沒單一 google place)
  "kyoto-shichigosan-yasaka",
  "kyoto-hassaku-gion",
  "kyoto-shigyo-shiki-gion",
  "kyoto-kyo-odori-miyagawacho", // 京おどり @ 宮川町歌舞練場 — Google 沒這個 place
  // 衣類:zone reference(地区の織元集合)
  "kyoto-kyotango-mineyama-orimono",
  // 衣類:Google 配對店主常和我們不同(同名異店問題)
  "kyoto-ryukobo-kumihimo", // 京組紐 龍工房 — Google 命中 龍村光峯
  "kyoto-yuzen-en-rental", // 夢工房 — Google 命中 夢館
  "kyoto-maiko-experience-shiki", // 祇園店 — Google 命中 嵐山店
  // 住類:Google 配對失敗
  "kyoto-landabout-kyoto", // Kyoto 物件あるが Google 命中常 東京店
  "kyoto-mineyama-onsen", // zone 名 — Google 命中する specific 温泉(小野小町)が違う
  "kyoto-aranvert-hotel", // Google 命中 ANA Crowne Plaza(全然違うホテル)
  "kyoto-nazuna-fuyacho", // NAZUNA 麸屋町は実在だが Google 命中 NAZUNA 二条城店
  "kyoto-nazuna-kitayama", // NAZUNA 北山も同様 二条城店に命中
  // 行類:抽象 service / "hub" 英語が HUB pub と衝突
  "kyoto-haruka-kansai", // JR 特急 — 「はるか」が美容室にマッチ
  "kyoto-thunderbird-northern", // 特急 — 京都駅 generic に命中
  "kyoto-keihan-premium-car", // 列車 service — 駅 generic
  "kyoto-hub-station", // "hub" → HUB pub chain
  "kyoto-hub-shijo-kawaramachi",
  "kyoto-hub-demachiyanagi",
  "kyoto-hub-saiin",
  "kyoto-hub-arashiyama-station",
  // 育類:Google 配対失敗
  "kyoto-shino-ryu-ko", // 志野流家元 ≠ Google 命中の松栄堂
  "kyoto-oie-ryu-ko", // 御家流香道 ≠ 松栄堂(同様)
  "kyoto-suzumiya-haruhi-pilgrimage", // 抽象テーマ・平等院誤命中
  "kyoto-detective-conan-kyoto-films", // 抽象テーマ・弁慶石誤命中
  "kyoto-kimi-no-na-wa-pilgrimage", // 抽象テーマ・御金神社重複
  "kyoto-koto-in-special", // 西芳寺特別公開 entry → 主 entry に重複
  "kyoto-ujigawa-haryu", // 淀川誤命中
  "kyoto-kongo-en-garden", // 金剛能楽堂と重複
  // 楽類:終了行事・誤命中
  "kyoto-arashiyama-hanatouro-history", // 終了 2021・ぎをん 花灯路 誤命中
  "kyoto-higashiyama-hanatouro-history", // 終了 2022・同上
  // 行類:複数事業者の services / チケット(単一 place ではない)
  "kyoto-arashiyama-yakatabune", // 嵐山屋形船 + 貸ボート — 複数事業者(嵐山通船他)で単一 place なし
  "hokkaido-hakodate-tram-1day", // 函館市電 1 日乗車券(チケット)
  "hokkaido-dosanko-pass-holiday", // どサンこパス(チケット)
  // 育・楽類:area guide / 複数地点の概念
  "kyoto-anime-pilgrimage-guide", // 聖地巡礼(複数寺社)
  "kyoto-zazen-experience", // 座禅体験ガイド(複数寺院)
  "kyoto-asakatsu-guide", // 朝活ガイド(概念)
  "kyoto-momiji-best-5-guide", // ベスト 5 ランキング
  "kyoto-sakura-best-5-guide", // ベスト 5 ランキング
  "kyoto-arashiyama-momiji", // エリア(嵐山紅葉スポット群)
  "kyoto-sakura-calendar", // 桜開花時期予測(時期予測)
  "kyoto-momiji-calendar", // 紅葉予測(時期予測)
  // 沖縄食類(2026-04-26 Stage K)— 同名異店・分店違い・概念非地点
  "okinawa-ganaha-soba-motobu", // 我那覇そば → きしもと食堂 八重岳店 に誤命中
  "okinawa-yui-soba", // そば家 鶴小 → つる屋 に誤命中
  "okinawa-aguu-shimanchu-naha", // 美ら島あぐー → 島しゃぶしゃぶ NAKAMA に誤命中
  "okinawa-kadekaru-yaeyama-yagi", // 嘉手苅(ヤギ) → 支那そば かでかる(ラーメン)に誤命中
  "okinawa-suzu-gin-makishi", // やぎとそば 鈴ぎん → やぎとそば 太陽 に誤命中
  "okinawa-sams-by-the-sea-chatan", // 北谷店 → 泡瀬店 に誤命中(分店違い)
  "okinawa-captains-inn-okinawa", // 沖縄市諸見里店 → 国際通り店 に誤命中(分店違い)
  "okinawa-navy-no-daidokoro-kume", // ナビィの台所 → 波路 に誤命中(別店)
  "okinawa-fashion-candy-naha", // ファッションキャンディ → CANDY family&Kids に誤命中
  // 沖縄概念条目(local_specialty / seasonal_food のうち非地点性のもの)
  "okinawa-shima-dofu", // 島豆腐(食材概念)
  "okinawa-jimami-tofu", // ジーマミー豆腐(食材概念)
  "okinawa-mango-miyako-motobu", // 沖縄マンゴー(跨地產品概念)
  "okinawa-pineapple-higashi-kunigami", // 沖縄パイナップル(跨地產品概念)
  "okinawa-gurukun-prefectural-fish", // グルクン(沖縄県魚・概念)
  // 沖縄食類 Phase 2(2026-04-26)— 離島店 Google Places 命中率低
  "okinawa-motobu-gyu-sara", // 本部牛 SaRa → 焼肉 もとぶ牧場 に誤命中(別店)
  "okinawa-yakiniku-kanpai-naha", // 焼肉 乾杯 → 肉 久茂地 本店 に誤命中
  "okinawa-aguni-shuzō", // 玉ノ露酒造所(粟国) → 菊之露酒造(宮古)に誤命中
  "okinawa-yonaguni-shokudo", // よなぐにや → さとや に誤命中
  "okinawa-kohamajima-akiramishokudo", // 食堂 あきらみ → YAARAA cafe に誤命中
  "okinawa-iejima-aikoshokudo", // オアシス食堂(伊江) → あずましい家 に誤命中
  "okinawa-aguni-shimaya-shokudo", // しまや食堂(粟国) → 食堂あわしまや に誤命中
  // 沖縄衣類(2026-04-26)— 同名異店・概念条目
  "okinawa-wakasa-bingata-naha", // 若狭びんがた → 城間びんがた工房に誤命中(同名 dup)
  "okinawa-haebaru-orimono", // 南風原花織会館 → 琉球かすり会館 に誤命中(別施設・同町)
  "okinawa-chinen-sanshin-tomari", // 知念三線 → ちんだみ三線店 に誤命中(別店)
  "okinawa-ryukyu-shikki-sato", // 琉球漆器佐藤工芸 → 角萬漆器 に誤命中(別店)
  "okinawa-yaeyama-mingei-yamanishi", // 八重山民芸品 やまにし → みんさー工芸館 に誤命中(別店)
  "okinawa-getazu-shuri", // 首里下駄・琉球タビ → 首里染織館suikara に誤命中(別施設)
  // 沖縄衣類概念条目(local_specialty 風の概念,非地点性)
  "okinawa-shisa-naha", // シーサー(琉球工芸概念・分布広い)
  "okinawa-wasou-ryusou-naha", // 和装+琉装比較体験(概念・複数店舗 across 那覇)
  "okinawa-shimazori-tropical", // 沖縄草履(食材概念・複数販売地)
  // 沖縄住類(2026-04-26)— 離島民宿/個別宿は Google Places 命中率極低
  "okinawa-jw-marriott-ikema", // JW マリオット → イラフ SUI に誤命中
  "okinawa-yonaguni-minshuku-okane", // 民宿大金荘 → 民宿さきはら荘 に誤命中
  "okinawa-iejima-minshuku-ezaki", // 民宿江崎荘 → はまさき荘 に誤命中
  "okinawa-kohama-haimurubushi-traditional", // ペンション小浜島 → 民宿小浜荘 に誤命中
  "okinawa-kume-minshuku-eef", // ペンション久米島 → サイプレスリゾート に誤命中
  "okinawa-irabu-minshuku-shimoji", // 民宿伊良部島 → ジャーニーイン に誤命中
  "okinawa-tokashiki-pension-niraina", // ペンションニライナ → ペンションニライカナイ に誤命中
  "okinawa-sol-okinawa-minatogawa", // SOL OKINAWA → DIGsol に誤命中
  "okinawa-chatan-house-mihama", // 北谷ハウス → ハウスドゥ 北谷(不動産)に誤命中
  "okinawa-pipeline-house-urasoe", // Pipeline House → やっぱりステーキ に誤命中
  "okinawa-nikko-naha", // ホテル日航那覇 → ホテルJALシティ那覇 に誤命中
  "okinawa-okinawa-marriott-nago", // 沖縄マリオット → オリエンタルホテル に誤命中
  "okinawa-okinawa-tokyu-naha", // 恩納東急 REI → 那覇東急 REI に誤命中(分店違い)
  "okinawa-yanbaru-mori-hotel", // やんばるの森ホテル → 南溟森室 に誤命中
  "okinawa-ogimi-rural", // 民宿大宜味やんばる → やんばるの森(公園)に誤命中
  "okinawa-higashi-pension-rural", // 民宿東村 → ひがしむら寮 に誤命中
  "okinawa-motobu-yamabaru-pension", // 本部山原民宿 → 癒しの宿みなみ風 に誤命中
  "okinawa-nago-yanbaru-pension", // 名護やんばるペンション → やんばるふくろう に誤命中
  "okinawa-nine-hours-naha-airport", // 9h 那覇空港 → 9h 成田空港 に誤命中(分店違い)
  "okinawa-grand-capsule-naha", // wellbe 那覇 → グランドキャビンホテル小禄 に誤命中
  "okinawa-kariyushi-glamping-motobu", // KARIYUSHI GREENWITH → on Beach に誤命中(別施設)
  // 沖縄住類 Phase 2(2026-04-27)— 概念条目
  "okinawa-naha-airport-backpacker", // バックパッカー(複数施設集合)
  "okinawa-shuri-machiya", // 首里町家(複数施設集合)
  "okinawa-iriomote-kominka-stay", // 西表古民家(複数施設集合)
  "okinawa-kourijima-pension", // 古宇利島民宿(複数民宿集合)
  // 沖縄衣類 Phase 2(2026-04-27)— 概念条目
  "okinawa-kariyushi-wear-overview", // かりゆしウェア概念
  "okinawa-ucp-aloha-cooperative", // 協同組合(概念)
  "okinawa-yonaguni-textile", // 与那国織(概念地域全体)
  "okinawa-urasoe-yodore-ori", // 浦添ようどれ織(概念地域全体)
  "okinawa-coral-craft-irabu", // 琉球サンゴ細工(複数工房)
  "okinawa-getto-craft-yaeyama", // 月桃製品(複数地区)
  "okinawa-magatama-glass-jewelry", // 勾玉ガラス玉(概念古代復刻)
  "okinawa-bingata-furoshiki-tenugui", // 紅型風呂敷(複数販売地)
  // 沖縄行類(2026-04-26)— concept guide は具体店に誤命中
  "okinawa-rental-car-essential", // レンタカー必読(概念) → 具体店誤命中
  "okinawa-rental-car-us-military-warning", // 米軍車両警告(概念) → ガイド会社誤命中
  "okinawa-rental-car-typhoon", // 台風時利用(概念) → 具体店誤命中
  "okinawa-rental-car-major-companies", // 会社比較(概念) → 1 社誤命中
  "okinawa-us-base-night-bus", // 米軍夜間バス(概念) → バス停誤命中
  "okinawa-ferry-haterumajima-yonaguni-cancellation", // 欠航ガイド(概念)
  "okinawa-ferry-anei-vs-yaeyama-comparison", // 比較ガイド(概念) → 1 社誤命中
  "okinawa-ferry-kerama-day-trip", // 慶良間日帰り(概念) → 国立公園誤命中
  // 沖縄育類(2026-04-27)— 概念条目・複数地点散在
  "okinawa-naha-utaki-cluster", // 那覇市内御嶽群(100+ 散在概念)
  "okinawa-ryukyu-castles-world-heritage", // 9 構成統合説明(概念)
  "okinawa-yanbaru-world-natural-heritage", // 自然遺産統合説明(概念)
  "okinawa-bingata-dye-experience", // 紅型染体験(複数工房)
  "okinawa-glass-blowing-experience", // 琉球ガラス吹き(複数工房)
  "okinawa-shisa-craft-tsuboya", // シーサー作り(複数窯元)
  "okinawa-tsuboya-kiln-heritage", // 壷屋窯場(地区概念)
  "okinawa-naha-port-heritage", // 那覇港町跡(分散遺構)
  "okinawa-kadena-housing-heritage", // 米軍住宅街跡(分散)
  "okinawa-michi-junee-eisa", // 道ジュネー(全島イベント概念)
  "okinawa-eisa-instruments-costumes", // エイサー楽器衣装(概念)
  "okinawa-sanshin-culture", // 三線文化(概念)
  "okinawa-ryukyu-buyo", // 琉球舞踊(概念)
  "okinawa-ryukyu-koten-ongaku", // 琉球古典音楽(概念)
  // 沖縄育類 Phase 2(2026-04-27)— 概念条目
  "okinawa-karate-shurite-system", // 首里手系統(概念)
  "okinawa-karate-nahate-system", // 那覇手系統(概念)
  "okinawa-karate-tomarite-system", // 泊手系統(概念)
  "okinawa-noro-priestess-system", // ノロ制度(概念)
  "okinawa-yaeyama-tsukasa-priestess", // 八重山司神(概念)
  "okinawa-daito-tamaki-history", // 大東開拓史(概念)
  "okinawa-tarama-koubunsho", // 多良間古文書(分散)
  "okinawa-hateruma-southern-cross", // 南十字星(天文概念)
  "okinawa-yuta-medium-naha", // ユタ町(複数事務所)
  "okinawa-yonaguni-donan-myth", // 与那国ドナン文化(概念)
  // 沖縄樂類(2026-04-27)— 概念条目・event 無固定場所
  "okinawa-naha-parasailing", // パラセーリング(複数事業者)
  "okinawa-ryukyu-festival", // 琉球フェス(東京開催)
  "okinawa-international-carnival", // 沖縄国際カーニバル(街全体イベント)
  "okinawa-naha-otsunahiki-fireworks", // 大綱挽花火(那覇泊港 + 街全体イベント)
  "okinawa-kokusai-dori-christmas", // 国際通りクリスマス(街全体)
  "okinawa-yanbaru-rhododendron", // やんばるシャクナゲ(山域分散)
  // 沖縄樂類 Phase 2(2026-04-27)— 概念条目・複数事業者
  "okinawa-island-sakura-calendar", // 寒緋桜全島暦(概念)
  "okinawa-jet-ski-onna", // ジェットスキー(複数事業者)
  "okinawa-naha-glass-bottom-boat", // グラスボート(複数事業者)
  "okinawa-yakou-mushi-night-kayak", // 夜光虫ナイトカヤック(複数地点)
  "okinawa-sanshin-izakaya-naha", // 三線酒場(50+ 軒概念)
  "okinawa-koza-livehouse", // コザライブハウス街(20+ 軒概念)
  "okinawa-miyako-sunset-bars", // 宮古サンセットバー(複数立地)
  "okinawa-ishigaki-night-yaeyama-music", // 石垣ナイトライフ(30+ 軒概念)
  "okinawa-onna-sup-yoga", // 恩納 SUP・SUPヨガ(複数事業者)
  // 京都楽類 Phase 12(2026-04-25)— guide系の抽象 entry は Google Places で命中せず
  "kyoto-tsukimi-spots-guide", // → 清水寺 誤命中(月見ガイド・複数地点)
  "kyoto-yukimi-spots-guide", // → 京都SKY観光ガイド協会 誤命中(雪見ガイド・複数地点)
  "kyoto-hotaru-spots-guide", // → 糺の森 誤命中(蛍ガイド・複数地点)
  "kyoto-amanohashidate-cycling", // → サイクルカー 誤命中(activity・場所単一でない)
  // 奈良食類 Sprint 15.1(2026-04-26)— guide系・概念条目は具体店に誤命中
  "nara-kakinoha-zushi-guide", // → ひょうたろう(別店)
  "nara-naraduke-guide", // → 森奈良漬店(dup・guide とは異なる)
  "nara-miwa-somen-guide", // → 乾製麺所(別店)
  "nara-yoshino-kuzu-guide", // → 中井春風堂(別店)
  "nara-yamato-cha-guide", // → 大和茶(generic concept)
  "nara-cha-gayu-guide", // → 月日星(別店)
  "nara-asuka-nabe-guide", // → めんどや(別店)
  "nara-yamato-niku-dori-guide", // → 大和肉鶏 613(別店)
  "nara-yamato-gyu-guide", // → 大和牛専門店一(別店)
  "nara-yamato-yasai-guide", // → 清澄の里 粟(awa とdup)
  "nara-yamato-so-guide", // → 観光ガイド会(全然違う)
  "nara-yoshino-ayu-guide", // → 漁協(具体店ではない)
  // 同名異店 / 分店違い
  "nara-naraduke-imanishi", // → 今西 本店(今西清兵衛 sake と混同・曖昧)
  "nara-izasa-nakatani-yoshino", // → 上北山村本店(吉野町本部とは別)
  "nara-tsukigase-tea-area", // → 月ヶ瀬湖(エリア概念・湖と混同)
  // 奈良衣 Round 1(2026-04-27)— guide concept / area → 具体店誤命中
  "nara-uchiwa-guide", // → 池田含香堂 dup
  "nara-uchiwa-deer-design", // → 池田含香堂 dup
  "nara-zarashi-guide", // → 麻布おかい(別店)
  "nara-zarashi-tsukigase", // → 麻布おかい(地区概念)
  "nara-zarashi-museum", // → 麻布おかい
  "nakagawa-yu-naramachi", // → 中川政七商店 dup
  "nihon-ichi-todaiji", // → 天平庵(全然違う食店)
  "yoshino-washi-guide", // → 植和紙工房(別工房)
  "nara-shika-souvenir-guide", // → Waplus 1 店
  "nara-shibori-shika", // → 森奈良漬店(全然違う)
  "nara-mochiidono-zakka", // → 絵図屋(area → specific)
  "nara-shika-tsuno-craft", // → 鹿猿狐ビルヂング(関連薄)
  "nara-doll-shop-area", // → 誠美堂(area → specific)
  "nara-ittobori-guide", // → 万葉堂(area → specific)
  "nara-shozoku-cultural", // → わぷらす(全然違う茶道店)
  "nara-kimono-rental-naramachi", // → 縁心屋(area → specific)
  // 奈良衣 Round 2(2026-04-27)— guide concept / dup
  "yu-nakagawa-saidaiji", // → 近鉄百貨店奈良店(分店違い)
  "nara-juzu-guide", // → カノコロ(specific guide)
  "nara-juzu-shika-tsuno", // → 遊悠工房(specific)
  "nara-todaiji-juzu-shop", // → 東大寺大仏殿(area guide)
  "nara-furoshiki-guide", // → おしだ(specific)
  "nara-tegugui-guide", // → 朱鳥(specific)
  "nara-ittobori-zodiac", // → 万葉堂(specific guide)
  "nara-ittobori-hina", // → 万葉堂 dup
  "nara-shichigosan-guide", // → ファーストステージ(specific)
  "nara-yukata-guide", // → わぷらす(全然違う茶道店)
  // 奈良衣 Round 3(2026-04-27)— guide concept → 具体店誤命中
  "tenpyo-modern-design", // → 三条店(specific dup)
  "nara-geta-zori-guide", // → 大和工房ならまち店(specific)
  "nara-obidome-guide", // → わぷらす(全然違う・dup)
  "yamato-kasuri-guide", // → 鹿猿狐(無関連)
  "nara-tsunokiri-event-goods", // → Waplus(event guide)
  "kasuga-mantoro-yukata", // → 藤浪之屋(event guide)
  // 奈良住 Round 1(2026-04-27)— guide concept → 具体店誤命中
  "nara-hotel-history-guide", // 117 年 history guide(honkan で代用)
  "nara-saraswaty-classical", // 歴史洋館宿 guide
  "naramachi-machiya-stay-guide", // 町家泊 guide
  "naramachi-airbnb-guide", // Airbnb guide
  "naramachi-villa-private", // プライベート泊 guide
  "shukubo-nara-guide", // 宿坊総合 guide
  "asuka-village-minshuku-guide", // 明日香民宿 guide
  "totsukawa-onsen-guide", // 十津川温泉 guide
  "yoshino-sakura-stay-guide", // 桜時期 guide
  "yoshino-sankei-yado-guide", // 参詣宿 guide
  "yoshino-yamanoyado-yumesara", // 山中宿選び guide
  "yoshino-cable-station-yado", // 駅前代替 guide
  // 奈良住 Round 2(2026-04-27)— area guide → 具体店
  "todaiji-area-shukubo", // → 二月堂(area guide)
  "omiwa-jinja-area-lodging", // → 和櫻(area guide)
  "gojo-otou-area-lodging", // → さつき(area guide)
  "nara-glamping-guide", // → GLAMPING GATE(guide)
  "yamato-kogen-glamping", // → GLAMPING GATE(dup)
  // 奈良住 Round 3(2026-04-27)— area guide / 別ピーク
  "tenri-kyokai-honbu-area", // → 東横INN(area guide)
  "ominesan-yamagamigoya", // → 弥山小屋(別ピーク・山上ヶ岳とは異なる)
  // 奈良住 Round 4(2026-04-27)— area guide / 場所違い
  "kurotaki-yoshino", // → 吉野宮滝(別市町)
  "nara-asakatsuyo-shukubo", // area guide
  "nara-capsule-hostel", // area guide
  "nara-shakyo-shukubo-stay", // area guide
  "nara-shugendo-1day-stay", // → MUJI(全然違う)
  // 奈良行 Round 1(2026-04-27)— line / access guide → 単一駅・具体運営
  "jr-yamatoji-rapid", // → 奈良駅(line サービス)
  "jr-manyo-mahoroba-line", // → 桜井駅(line)
  "jr-wakayama-line", // → 五条駅(line)
  "osaka-to-nara-access", // → 奈良駅(access guide)
  "kyoto-to-nara-access", // → 奈良駅(access guide)
  "nara-taxi-tour", // → 近鉄タクシー(guide → specific 運営)
  "kintetsu-sightseeing-train-guide", // → 近鉄奈良駅(guide)
  // 奈良行 Round 2(2026-04-26)— concept/guide entries → 具体店誤命中
  "kintetsu-mahoroba-liner", // → まほろばファミリー鉄道(別 entity・特急 ≠ 民営観光鉄道)
  "kintetsu-tokkyu-guide", // → 近鉄奈良駅(全特急総合 guide)
  "nara-tourist-info-multilingual", // → 奈良市総合観光案内所(多言語観光案内 guide ≠ 単一拠点)
  "nara-rental-car-area", // → JR駅レンタカー奈良営業所(area レンタカーガイド ≠ 単店)
  "nara-parking-guide", // → 転害門前観光駐車場(全市駐車場ガイド ≠ 単駐車場)
  // 奈良育 Round 1(2026-04-27)— 概念/世界遺産括り/仏像内訳 → 親寺・別建物・概念碑誤命中
  "nara-koto-bunkazai-1998", // → 世界遺産碑(8 資産括り concept ≠ 単一碑)
  "horyuji-ikaruga-bukkyo-1993", // → 法隆寺(world heritage 概念 ≠ duplicates parent 法隆寺)
  "kii-sanchi-pilgrimage-2004", // → 紀伊山地(山地名 concept ≠ 跨 3 県霊場)
  "shugendo-en-no-gyoja-overview", // → 大峯山寺(宗教概要 ≠ 単一寺)
  "nara-butsuzo-kansho-guide", // → 仏像館(鑑賞ガイド ≠ 単一館)
  "nara-asura-statue-kofukuji", // → 興福寺(像が parent 寺内 → duplicates parent)
  "nara-yakushi-sanzon-yakushiji", // → 薬師寺(同上 duplicates parent)
  "nara-nikko-gakko-bosatsu", // → 東大寺二月堂(像は三月堂内 ≠ 二月堂・誤位置)
  "nara-ganjin-zazo-toshodaiji", // → 鑑真和上御廟(像は御影堂内 ≠ 御廟・誤位置)
  "nara-shika-1200-overview", // → 鹿苑(1200 頭 concept ≠ 一施設)
  "nara-shika-yose-summer", // → 鹿苑(鹿寄せは飛火野で開催・誤会場)
  "nara-shosoin-ten-annual", // → 正倉院正倉(展示は奈良国立博物館 ≠ 正倉建物)
  // 奈良育 Round 2(2026-04-27)— 仏像内訳重複 + イベント概念 + 別店誤命中
  "nara-yuima-koji-tokondo", // → 法華寺(像は興福寺東金堂内 ≠ 法華寺・誤位置)
  "nara-gigeiten-akishino", // → 秋篠寺(像が parent 寺内 → duplicates parent)
  "nara-tokae-summer", // → 奈良公園(8/5-14 多会場分散 ≠ 公園単体)
  "nara-sumi-experience", // → 錦光園(別店・entry は古梅園 1577 創業)
  // 奈良育 Round 3(2026-04-28)— 仏像位置誤 + 古代人物 biography → place 誤命中
  "todaiji-sangatsudo-fukukenjaku", // → 不空院(春日山)≠ 東大寺三月堂(別寺)
  "shotoku-taishi-574-622", // → 聖徳太子像(biography → 単像 vague)
  "ganjin-688-763", // → 鑑真和上御廟(biography → 既に唐招提寺/御影堂で)
  "gyoki-668-749", // → 行基菩薩像(biography → 単像 vague)
  "yamada-dera-butsu-zu", // → 山田寺跡(仏頭は現在興福寺国宝館収蔵 ≠ 山田寺跡)
  // 奈良楽 Round 1(2026-04-28)— 概念ガイド + イベント分散 + 誤命中
  "nara-park-1day-picnic", // → 奈良公園(picnic concept guide ≠ 単一 spot)
  "nara-shika-senbei-howto", // → 鹿せんべい自販機(howto concept ≠ 単一機)
  "nara-park-night-walk", // → 奈良公園(夜散策 concept ≠ 単一 spot)
  "yoshino-onsen-shimoichi", // → 下市温泉秋津荘(specific 宿 ≠ 吉野温泉 area)
  "yamabe-no-michi-walk", // → 山辺の道狭井神社寄り(specific 区間 ≠ 16 km full)
  "tsukigase-canoe", // → 津風呂湖カヌー競技場(別湖・月ヶ瀬とは別)
  "yoshino-river-rafting", // → 吉野川ビックスマイル(specific 業者 ≠ ガイド)
  "ouda-rock-climbing", // → グランドワズー(室内ジム ≠ 大宇陀屛風岩外岩)
  "yamato-river-cycle-road", // → 大和川サイクルマップ(地図 ≠ 道)
  "nara-rurie-february", // → 鏡池(単池 ≠ 全市分散イベント)
  "nara-light-up-promenade", // → 浮見堂(単 spot ≠ 全市夏ライトアップ)
  "kasuga-setsubun-mantoro", // → 藤浪之屋(春日内一施設 ≠ 全境内 3000 灯)
  "gojo-summer-fes", // → 五條市観光協会(組織 ≠ イベント)
  "uda-aki-fes", // → 又兵衛桜(完全誤命中)
  "nara-hotaru-watch", // → 大仏蛍(店名 ≠ ホタル鑑賞 region)
  "totsuji-yusenchi-onsen", // → 十津川温泉(parent 重複・湯泉地は内部)
  // 奈良楽 Round 2(2026-04-28)— 概念ガイド + 誤位置
  "shigi-san-suisen", // → のどか村(別公園・水仙は朝護孫子寺隣接)
  "nara-shika-senbei-toba", // → 鹿せんべい自販機(event ≠ 単一機)
  "nara-deer-ecology-guide", // → 鹿苑(生態 concept ≠ 単一施設)
  "kingyo-sukui-zenkoku", // → こちくや(土産店 ≠ 大和郡山総合公園 event 会場)
  // 北海道衣 R1(2026-04-28)— 概念ガイド + 誤命中
  "ainu-chikar-karpe", // → サッポロピリカコタン(concept ≠ 単施設)
  "ainu-embroidery-experience-shiraoi", // → 工房(vague 部分施設名)
  "ainu-mokoshi-jacket", // → ホーシ㈱(完全 random ≠ アイヌ衣装 concept)
  "hokkaido-snow-boots-guide", // → ムラサキスポーツ(buying guide ≠ 単店)
  "hokkaido-down-jacket-guide", // → ビームス(brand store ≠ guide)
  "hokkaido-warm-inner-guide", // → MOONLOID SHOP(random ≠ guide)
  "hokkaido-ice-grip-stickers", // → ムラサキスポーツ(buying guide ≠ 単店)
  "hokkaido-knit-hat-glove", // → CA4LA(hat shop ≠ 3 点 guide)
  "hokkaido-heatpack-culture", // → カイロプラクティックセンター(整体 ≠ 携帯カイロ・誤訳)
  "hokkaido-snow-festival-fashion", // → 雪まつりつどーむ会場(event venue ≠ 服装 guide)
  "asahikawa-ici-mountain-gear", // → ゼビオ(別 brand・entry は ICI 石井)
  "daisetsuzan-mountain-gear", // → 旭岳ロープウェイ(アクセス ≠ gear concept)
  "rusutsu-niseko-snowboard", // → ルスツリゾートホテル(宿泊 ≠ SB gear scene)
  "furano-wool-knit", // → 富良野チーズ工房(チーズ ≠ wool・カテゴリ誤)
  "sapporo-nakajima-vintage", // → 中島公園(公園 ≠ 周辺古着店群)
  "hokkaido-folkcraft-overview", // → 森の人木彫(単店 ≠ 全道概要)
  // 北海道行 R1(2026-04-28)— 概念列車 + ガイド戦略 → 単店誤命中
  "lavender-express-furano", // → 北星山ラベンダー園(花田 ≠ 列車)
  "hokkaido-eastern-rental-car", // → ㈲レンタカー道東(単店 ≠ 戦略 guide)
  "hokkaido-niseko-rental-car", // → ピークニセコレンタカー(単店 ≠ 戦略 guide)
  // 北海道住 R1(2026-04-28)— 都市別 area guide + 多店舗 concept + 誤位置
  "business-hakodate-area", // area guide ≠ シェラトン単店
  "business-asahikawa-area", // area guide ≠ R ホテルズイン単店
  "business-obihiro-area", // area guide ≠ リッチモンド単店
  "business-kushiro-area", // area guide ≠ コンフォート単店
  "business-tomakomai-area", // area guide ≠ KOKO 単店
  "rusutsu-the-tower", // → ゴルフ場(別施設・hotel と同名異)
  "hakodate-mt-hakodate-bnb", // 多 B&B concept ≠ 開港庵単店
  "niseko-backpacker-hostel", // 多 hostel concept ≠ きらく単店
  "shiretoko-utoro-minshuku", // 多民宿 concept ≠ たんぽぽ単店
  "furano-pension", // 多 pension concept ≠ ラベンダー単店
  "biei-glamping", // → GLAMP SORA 富良野(立地誤・美瑛町ではなく富良野)
  "yoichi-wine-resort", // → 余市葡萄酒醸造所(醸造所のみ・hotel 別)
  "niseko-condominium-long-stay", // 多コンド concept ≠ Central 単物件
  // 北海道食 R1(2026-04-28)— 概念ガイド + 誤命中 + 季節食材 concept
  "obihiro-butadon-history", // 概論 ≠ 単店誤命中(とん田 ≠ 元祖ぱんちょう)
  "soup-curry-history", // 概論 ≠ GARAKU(元祖アジャンタ別)
  "zangi-concept-history", // 概論 ≠ 単店
  "ainu-food-overview", // 食文化概論 ≠ 国立博物館(食 ≠ 展示)
  "asahikawa-ramen-shoyu-overview", // 概論 ≠ 単店天金
  "kushiro-ramen-overview", // 概論 ≠ 単店夏堀
  "obihiro-ramen-shop", // 概論 ≠ 単店みすゞ
  "ribbon-napolin", // → 富良野食堂(maker サッポロビール ≠ 売店)
  "uni-okhotsk-bafun", // 食材概論 ≠ 単市場
  "ezomatsuba-kani", // → 氷雪の門(モニュメント ≠ 蟹)
  "yotei-jyagaimo", // → 農家のそばや(soba 店 ≠ 馬鈴薯)
  "asparagus-spring-fresh", // 季節概論 ≠ 単農場
  "ezoshika-jibie-restaurant", // 概論 ≠ 単店
  "matsumae-zuke", // 食品概論 ≠ 単売店
  "gyoja-ninniku-spring", // 季節山菜 ≠ 単 izakaya
  "tarako-spring-haru", // 季節食材 ≠ 単店
  "yumepirika-rice", // 米品種 ≠ 単米店
  "nemuro-hanasaki-kani", // 食材 ≠ 単店
  // 大阪食 R1(2026-04-28)— 概論/史観/季節/area concept 大量
  "konamon-overview-osaka", // 粉もん概論 ≠ 単店
  "takoyaki-history-overview", // たこ焼史 ≠ 単店
  "okonomiyaki-history-overview", // お好み焼史 ≠ 単店
  "kushikatsu-overview-no-double-dip", // 串カツ概論 ≠ 単店
  "doteyaki-osaka-history", // どてやき概論 ≠ 単店
  "shinsekai-kushikatsu-area", // 串カツ街エリア ≠ 単店
  "osaka-zushi-overview", // 大阪鮨概論 ≠ 単店
  "fugu-overview-osaka", // ふぐ消費概論 ≠ 単店
  "udon-osaka-overview", // 大阪うどん概論 ≠ 単店
  "ramen-overview-osaka", // 大阪ラーメン概論 ≠ 単店
  "junkissa-osaka-overview", // 純喫茶概論 → kissaten-american 重複
  "kitashinchi-michelin-overview", // 北新地ミシュラン district ≠ 単店
  "horumon-osaka-overview", // ホルモン概論 ≠ 単店
  "settsu-shuzo-overview", // 摂津酒造史 → 跡碑 ≠ 醸造家
  "fugu-winter-shimonoseki-osaka", // 冬ふぐ季節 ≠ 単店
  "takenoko-spring-osaka", // 春筍季節 ≠ 単店
  "matsutake-autumn-osaka", // 秋松茸季節 ≠ 単店
  "ayu-summer-yodogawa", // 夏鮎季節 ≠ 単店
  "hamo-summer-osaka", // 夏鱧季節 ≠ 単店
  "tachi-nomi-kitashinchi", // 北新地立呑街 ≠ 単店
  "tenma-yokocho-tachi-nomi", // 天満横丁 area ≠ 単店
  "fukushima-yakitori-area", // 福島やきとり街 ≠ 単店
  "umeda-food-area", // 梅田北新地 → 北新地駅(station ≠ 街)
  // 大阪行 R1(2026-04-29)— 名前衝突
  "jr-haruka-kuko-osaka", // → アトリエはるか(美容 salon・JR 特急ではない)
  // 大阪行 R2(2026-04-29)— 名前衝突
  "kintetsu-hinotori", // → 火ノ鳥(別店・近鉄特急ひのとりではない)
  // 大阪育 R1(2026-04-29)— 祭/概念/建築群
  "tenjin-matsuri", // 祭礼(年 1 回イベント・places でない)
  "sumiyoshi-matsuri", // 祭礼(住吉大社の場所は別エントリ)
  "kishiwada-danjiri", // 祭礼(岸和田全市開催)
  "yosano-akiko-seitan-sakai", // 生誕地マーカー(具体店なし)
  "nakanoshima-kindai-kenchikugun", // 建築群概念(複数建築の総称・各建築は別エントリ)
  // 大阪楽 R2(2026-04-29)— 場所不明跡地
  "expo2025-yumeshima-legacy", // → 1970 万博公園に誤一致(2025 跡地は此花区夢洲・別location)
  // 兵庫衣 R1(2026-04-30)— 名前重複
  "kitano-koubou-1998", // → 神戸北野異人館街に誤一致(隣接の別施設・正しい Place ID 不安定)
  // 大阪育 R2(2026-04-29)— 祭/文学碑/起業創業地
  "aizen-matsuri", // 祭礼(愛染堂勝鬘院・寺は別エントリ)
  "hirano-kumata-danjiri", // 祭礼(杭全神社で別エントリ)
  "oda-sakunosuke-kahi", // 文学碑(法善寺横丁内のマーカー)
  "kawabata-yasunari-ibaraki", // 生家跡 + 文学館の二重 marker(abstract location)
  "tanabe-seiko-bungakukan", // 大学内施設で google places 命中困難
  "yoshimoto-1912-tenma", // → なんばグランド花月(別エントリ・天満創業地は石碑のみ)
  // 奈良食 Round 2(2026-04-26)— area guide / 概念条目 → 具体店誤命中
  "nara-muteppou-naramachi", // → 奈良がむしゃら(別ブランド)
  "nara-naramachi-cafe-walking-guide", // → カナカナ
  "nara-yamato-gyu-yakiniku-guide", // → 大和牛専門店一(dup)
  "nara-coffee-specialty-area-guide", // → CHAMI
  "nara-bakery-area-guide", // → BoulangerieRiche
  "nara-todaiji-mae-souvenir-walking", // → 二月堂裏参道
  "nara-omiwa-jinja-sando-food", // → 松の馬場
  "nara-houryuji-mae-souvenir", // → バス停
  "nara-kashihara-jingu-omiyage", // → 駅
  "nara-totsukawa-yamasai-village", // → 風庵
  "nara-asuka-kodaimai-guide", // → 明日香の夢市
  "nara-yoshino-kuzumochi-area-guide", // → 中井春風堂
  // 47 卷全体メンテ Phase 1(2026-04-29)— 慢性 ZERO 14 件統一回收
  // 全部実体的に concept/廃止イベント/抽象 service なので恒常的に Google 命中せず
  "hokkaido-iwaobetsu-chinohate", // 岩尾別温泉 ホテル地の涯 — 実在ホテルだが Find Place 命中せず
  "kyoto-kobe-airport-access", // 神戸空港 → 京都 アクセス — concept guide
  "kyoto-shigeyama-kyogen", // 茂山千五郎家 — 狂言師家系・固定 stage なし
  "okinawa-rental-car-island", // 沖縄離島レンタカーガイド — concept
  "okinawa-gintama-okinawa-arc", // 銀魂沖縄編 — anime 聖地概念
  "okinawa-haikyu-okinawa-camp", // ハイキュー沖縄合宿編 — anime 聖地概念
  "yamato-kogen-onsen", // 大和高原温泉ガイド — zone guide
  "okinawa-summer-sonic-south", // SUMMER SONIC SOUTH — 終了イベント
  "hokkaido-winter-gear-overview", // 北海道冬装備総論 — concept
  "hokkaido-spring-fashion", // 北海道春装 — 季節 concept
  "hokkaido-summer-fashion", // 北海道夏装 — 季節 concept
  "hokkaido-autumn-fashion", // 北海道秋装 — 季節 concept
  "north-rainbow-express", // ノースレインボーエクスプレス — JR 廃止列車
  "jr-thunderbird-osaka", // 特急サンダーバード — JR 列車サービス
  // 静岡食 R1(2026-04-29)— 同名異店誤配対
  "shizuoka-oden-haikara-yokocho", // 海老天本店 → 天文本店(別店・天婦羅専門)
  // 静岡住 R1(2026-04-29)— 同名異店 + 概念 area guide
  "atami-horai-1932", // 蓬莱(熱海高級旅館)→ 和菜 蓬(別店・restaurant)
  "minamiizu-iromura-tsuti", // 弓ヶ浜民宿エリア(概念)→ 磯崎荘(specific 1 軒)
  "nishiizu-koibitomisaki-minshuku", // 西伊豆民宿エリア(概念)→ 恋人岬(landmark・宿でない)
  // 静岡衣 R1(2026-04-29)— 別店誤命中
  "kakegawa-yamanashiya-1812", // 山梨屋葛布(specific)→ 小崎葛布工芸(別工房)
  "shuzenji-yukata-rental-area", // 浴衣 rental(概念)→ 街ナビゆるり(観光案内所・rental ではない)
  "suruga-kogei-center-shizuoka", // 駿河工芸センター → 仏壇工芸センター(別カテゴリ)
  // 静岡育 R1(2026-04-29)— 祭礼(イベント・場所単一でない)
  "shimoda-kurofune-matsuri-1934", // 下田黒船祭(イベント)→ 「黒船」(restaurant・別店)
  // 静岡 R3(2026-04-29)— 同名異店 + 祭礼イベント
  "fukyu-ya-numazu-hanpen-1916", // 富久家 沼津(黒はんぺん)→ 冨久家 沼津ケーキ店(別店・ケーキ屋)
  "kakegawa-sai-festival-3year", // 掛川大祭(イベント)→ 掛川城(誤命中・祭は城を起点とするが本体は別)
  // 静岡 R5(2026-04-29)— 同名異店
  "yaizu-katsuobushi-marushichi-1929", // 丸七鰹節(焼津)→ マルツマエダ商店(別店)
  // 静岡 R6(2026-04-29)— アクティビティ → 別運営
  "oigawa-river-rapids-shimada", // 大井川川下り → 大井川鐡道 SL センター(SL 鉄道とは別事業者)
  // 老卷補完(2026-04-29)— 大阪食 R3
  "grill-marusai-1939-shinsaibashi", // グリル丸善(洋食)→ 焼肉但馬丸善(別店・焼肉)
  // 長崎食 R1(2026-04-30)— 別店誤命中
  "yossou-kakuni-man-1866", // よっそう(角煮まん)→ 吉宗(茶碗むし・別店)
  "tsushima-tora-fugu-overview", // 対馬とらふぐ概論 → あなご亭(別魚種専門)
  // 長崎住 R1(2026-04-30)— 別宿誤命中
  "unzen-fukiya-1730", // 富貴屋(雲仙最古旅館 1730)→ 福田屋(別宿・別読み)
  // 長崎衣 R1(2026-04-30)— 別店誤命中 + 概念分散
  "amyu-plaza-sasebo-2000", // アミュプラザ佐世保 → アミュプラザ長崎(同チェーン別店誤)
  "nagasaki-kunchi-shozoku-rental", // 長崎くんち装束 rental → さじき委員会(観覧席組織・装束 rental ではない)
  "goto-church-pilgrim-shop", // 五島教会群 巡礼 → 江上天主堂(個別教会・教会群概念ではない)
  "esaki-bekko-1709", // 江崎べっ甲店 → 長崎べっ甲店(別店・dup nagasaki-bekko-overview)
  // 長崎育 R1(2026-04-30)— 概論誤命中 + 別炭鉱
  "goto-church-group-overview-2018", // 五島教会群概論 → 堂崎天主堂(個別教会・12 構成資産 overview ではない)
  "takashima-coal-1881", // 高島炭坑跡 → 中之島炭鉱跡(別炭鉱・地理混乱)
  // 長崎楽 R1(2026-04-30)— 別公園 + 概論 + 別事業者
  "tabira-cherry-hirado-1500", // 田平公園(田平町)→ 平戸公園(平戸島側・別公園・橋向こう)
  "iki-marine-summer", // 壱岐マリン体験概論 → 筒城浜マリーナ(単 marina・5 ビーチ概論ではない)
  "nagasaki-port-cruise-night", // やまさ海運ナイトクルーズ → 樺島一周みちしお(別事業者・別ルート)
  // 長崎行 R1(2026-04-30)— 別商業 + 概論 + 観光列車 ZERO
  "relay-kamome-rinkan", // リレーかもめ特急 → 長崎街道かもめ市場(別商業・列車サービス ≠ 単店)
  "nagasaki-rental-car-area", // 県レンタカー戦略 → ガッツレンタカー単店(概論 ≠ 単店)
  "futatsu-boshi-4047-2022", // ふたつ星 4047 観光列車 → ZERO(固定 location なし・列車運行サービス)
  // 長崎 R2(2026-04-30)— 別ホテル + 地理混乱 + 別窯元 + エリア概念
  "richmond-sasebo-2002", // リッチモンドホテル佐世保 → 東横INN佐世保駅前(別ホテル誤命中)
  "shimabara-toyokan-1932", // 島原東洋館 → 大江戸雲仙東洋館(地理混乱・島原 vs 雲仙)
  "mikawachi-fujishou-kiln", // 平戸藤祥窯 → 平戸洸祥団右ヱ門窯(別窯元同名混乱)
  "nakao-bidoro-1973", // 中尾びーどろ → ビードロの道(エリア概念 ≠ 単店)
  // 長崎 R3(2026-04-30)— 別店 + 別ホテル + 概論 + 別ビーチ
  "hayashimori-hatoshi", // 林森商行ハトシ → 林食料品店(別店誤命中)
  "hirado-gyu-overview", // 平戸牛概論 → 平戸和牛やきにく鈴(単店誤命中)
  "nikko-hotel-nagasaki-1989", // ホテル日航長崎 → ホテル日航ハウステンボス(別ホテル)
  "shimabara-gusozoni-ginsui", // 銀水 → 浜の川湧水観光交流館(関連施設だが別)
  "dejima-illumination-night", // 出島ライトアップ → 出島ワーフ(隣接別 spot)
  "mizugaura-fukue-beach", // 水ノ浦海水浴場 → 頓泊海水浴場(別ビーチ)
  // 長崎 R4(2026-04-30)— 概論 + 単店誤命中 + 別宿 + 別窯元
  "ono-unagi-isahaya", // 大野うなぎ → 鰻や(別店)
  "goto-wagyu-overview", // 五島和牛概論 → やまぐちファーム単店
  "tsushima-iwagaki-summer", // 対馬岩牡蠣概論 → 海風商事(商事会社)
  "iki-jidori-gi-2017", // 壱岐地鶏概論 → 壱州茶屋(単店)
  "nagasaki-castera-zaka-walk", // カステラ散策コース → 清風堂グラバー坂(単店)
  "ueno-ryokan-fukue-1935", // 上野屋旅館 → ホテル上乃家(同名異店)
  "shimabara-jonan-hotel-1952", // 島原城南ホテル → 民宿浪花(別宿)
  "mikawachi-yumesyouen-kiln", // 夢祥園窯 → 啓祥窯(同名異窯元)
  "omura-aizome-yokoyama", // 横山藍染 → 山のよこ工房(同名異店)
  "dejima-restoration-1996", // 出島復元事業 → 文化観光部出島復元整備室(行政部署)
  "hirado-tabira-sunset", // 平戸瀬戸夕陽 → 平戸瀬戸市場(物産市場・別 spot)
  "unzen-miyamakirishima-may", // 仁田峠ミヤマキリシマ → 池の原ミヤマキリシマ(別 location)
  "fukue-doroibata-onsen", // 堂崎温泉 → 堂崎天主堂(教会・別スポット)
  // 長崎 R5(2026-04-30)— 概論+ 単店誤命中 + 別ホテル + ZERO
  "mogi-biwa-150-years", // 茂木びわ概論 → 茂木一口香(別菓子・単店)
  "iki-ika-ikizukuri", // 壱岐イカ概論 → まる辰(単店)
  "kawauchi-manju-1623", // 川内屋まんじゅう → 白孝屋かまぼこ(別店)
  "fukue-kankoh-hotel", // 福江観光ホテル → GOTO TSUBAKI HOTEL(別ホテル)
  "omura-bay-cycling-route", // 大村湾サイクリング概論 → 野岳湖公園(別場所)
  "saikai-yumeshi-cape", // 夢咲岬 → ZERO(Google Places 命中せず)
  // 長崎 R6(2026-04-30)— 概論 + 別店 + dup
  "tsushima-shiitake-overview", // 対馬しいたけ概論 → うえはら単店
  "shimabara-tofu-shu", // 寒月豆腐概論 → 坂本豆腐店単店
  "fukue-shio-overview", // 五島塩概論 → さとうのしお単店
  "shippoku-shinwakaen-1934", // 信楽園 → 会楽園(別店誤命中)
  "tsushima-tiara-izuhara", // ホテルティアラ → ショッピングセンターティアラ(別施設)
  "sotome-kounoura-kyokai", // 神浦教会 → 浦上天主堂(dup R1 urakami-tenshudo-1959)
  "takahama-beach-fukue", // 高浜海水浴場 → 大浜海水浴場(別ビーチ)
  // 長崎 R7(2026-05-01)— 概論 + 別店 + 別ホテル + dup
  "tsushima-rokubei-overview", // 対馬ろくべい概論 → 久兵衛商店単店
  "iki-uni-don-katsumoto", // 勝本うに丼概論 → 丼や入船単店
  "shimabara-itohatsu-soumen", // 糸八素麺 → 鮨彦八(寿司・別店)
  "ana-crowne-plaza-htb-1992", // ANA インターコンチ HTB → ホテルデンハーグ(別ホテル)
  "fukue-pension-tsubaki", // ペンション椿 → GOTO TSUBAKI HOTEL(別宿・dup R5 NULL)
  "hirado-bidoro-direct", // 平戸ビードロ → オランダ塀(別 spot dup R6)
  "tsushima-stargazing-spot", // 対馬星空概論 → 烏帽子岳(dup R5 tsushima-eboshidake-tenboudai)
  "iki-katsumoto-port-fes", // 勝本浦祭 → 勝本朝市(イベント≠ 朝市venue)
  "kamome-shinkansen-detail", // 西九州新幹線かもめ車両 → かもめ市場(列車≠ 市場・dup R1 relay-kamome-rinkan)
  // 兵庫 R2(2026-05-01)— 概論 → 別店 + 別宿 + 別運河
  "himeji-anago-overview", // 姫路あなご概論 → あなご料理柊(単店)
  "izushi-soba-tachibanaya-1924", // 橘屋出石そば → 港や(別店)
  "takedao-onsen-1718", // 武田尾温泉 → 紅葉舘あざれ(別宿名)
  "amagasaki-shinkawa-canal", // 尼崎運河 → 西堀運河(別運河)
  // 静岡 R7(2026-05-01)— 概論 → 単店誤命中
  "yaizu-maguro-port-overview", // 焼津港まぐろ概論 → 丸入商店(単店)
  "shimizu-sushi-overview", // 清水寿司概論 → 末廣鮨(単店)
  // 兵庫 R3 + 静岡 R8 (2026-05-01)— 概論 → 単店 + 別温泉
  "sanda-gyu-overview", // 三田牛概論 → 単店誤命中
  "tatsuno-leather-overview", // たつの皮革概論 → 単店誤命中
  "arima-yumeguri-tour", // 有馬湯巡り → 有馬街道すずらんの湯(別温泉)
  "numazu-port-cuisine-area", // 沼津港食堂街概論 → 港食堂(単店)
  // 4 卷補完(2026-05-01)— 概論 → 単店 + dup
  "kerama-whale-watching-feb", // 慶良間ホエール概論 → シーワールド(単業者)
  "arashiyama-kimono-rental-zone", // 嵐山着物 zone → 京嵐渡月橋店(単店)
  "nara-yamato-cha-cafe", // 大和茶 cafe 概論 → 茶樂茶 SARASA(単店)
  "yoshino-kuzu-honke", // 吉野葛概論 → 中井春風堂(dup R1 nara-yoshino-kuzu-guide)
  "asuka-kodaimi-cuisine", // 飛鳥古代米概論 → 夢市茶屋(dup R1 nara-asuka-kodaimai-guide)
  "yamato-yasai-cuisine", // 大和野菜概論 → 旬彩ひより(単店)
  // 広島 食 R1(2026-05-01)— 概論 → 単店 + dup
  "hiroshima-okonomiyaki-overview", // お好み焼概論 → 単店誤命中
  "hiroshima-kaki-overview", // 広島牡蠣概論 → 牡蠣一番(単店)
  "hiroshima-kaki-doteyaki-cuisine", // 牡蠣土手鍋 → dup 牡蠣一番
  "onomichi-ramen-overview", // 尾道ラーメン概論 → 丸ぼし(単店)
  "onomichi-shukaen-1947", // 朱華園 → 尾道ラーメン朱(別店・同名混乱)
  "fukuyama-ramen-overview", // 福山ラーメン概論 → 尾道ラーメン一丁(別都市)
  "fukuyama-bara-wagashi", // 福山ばら和菓子概論 → ばらもち千萬喜家(単店)
  "mihara-tako-cuisine", // 三原タコ概論 → お食事処蔵(単店)
  "jinseki-jibie", // 神石ジビエ概論 → 備後ジビエ製作所(単業者)
  "hiroshima-anago-cuisine", // 広島あなご概論 → うえの宮島口(dup R1 uenoanagomeshi)
  // 広島 住 R1(2026-05-01)— 概論 → 単店 + dup
  "tomonoura-kanko-hotel", // 鞆観光ホテル → 鴎風亭(別ホテル)
  "jr-clement-hiroshima", // JR クレメント → グランヴィア南口(dup hotel-granvia-hiroshima 別棟)
  "miyajima-pension-area", // 宮島ペンション圏 → あんばらんす(単店)
  "shobara-kokumin-shukusha", // 庄原ホテル群 → ラ・フォーレ庄原(単宿)
  "miyoshi-business-stay", // 三次ビジネス概論 → ルートイン三次(単宿)
  "saijo-station-business", // 西条駅前概論 → 東横INN西条(単宿)
  "miyajima-guchi-resort", // 宮島口リゾート概論 → MIYAJIMA VIEW(単宿)
  // 広島 衣 R1(2026-05-01)— 概論 → 単店 + dup
  "kumano-fude-festival-923", // 筆まつり → 筆の里工房(dup R1 fude-no-sato-koubou-2003)
  "fukuyama-koto-overview", // 福山琴概論 → 藤井琴製作所(単店)
  "hiroshima-kimono-rental-zone", // 着物レンタル概論 → キモノハーツ(単店)
  // 広島 楽 R1(2026-05-01)— 概論 → 別 spot dup + 別公園
  "miyajima-mizu-hanabi-aug", // 水中花火 → 嚴島神社(dup R1 育 itsukushima-jinja-593)
  "miyajima-overnight-walk", // 夜散策概論 → 弥山展望台(dup R1 育 miyajima-misen)
  "miyajima-sika-deer", // 鹿概論 → 宮島水族館(dup・別 spot)
  "urihime-yama-yakei", // うり姫山 → 海老山公園(別公園誤命中)
  "etajima-tsuboi-beach", // ツボイ海水浴 → 入鹿海岸(別ビーチ)
  // 広島 行 R1(2026-05-01)— 概論 → 駅 dup + レンタカー単店
  "jr-sanyo-line-hiroshima", // 山陽本線概論 → 広島駅(dup hiroshima-station-2025-renewal)
  "hiroshima-densha-1912", // 広島電鉄概論 → 広島駅(dup・別 spot)
  "hiroshima-rental-car-area", // 県レンタカー戦略 → ニッポンレンタカー(単店)
  // 広島 R2(2026-05-01)— 概論 → 単店 + dup
  "kure-kaigun-curry", // 呉海軍カレー概論 → 呉ハイカラ食堂(単店)
  "miyajima-kakimeshi-cuisine", // 牡蠣めし概論 → 牡蠣屋(dup R1 食)
  "saijo-station-classical-stay", // 西条古民家泊概論 → 西条酒蔵通り(dup R1 食)
  "kumano-fude-takemoto-1746", // 竹本義方堂 → 久保田号(別店)
  "miyoshi-jinja-akitakata", // 三吉神社 → 太歳神社(別神社別読み)
  "shimanami-cycling-marathon-oct", // サイクリング大会 → 自転車出入口(別 spot)
  "shimanami-ferry-routes", // しまなみ高速船 → 尾道駅前桟橋(dup R1 行 onomichi-port)
  // 広島 R3(2026-05-01)— 概論 → 単店 + dup
  "egashima-kaki-yoshoku", // 江田島牡蠣概論 → 門林水産(単店)
  "innoshima-hassaku", // 因島八朔概論 → はっさく屋(単店)
  "miyoshi-winery-stay", // ワイナリー泊 → ワイナリー本体(dup R1 食 miyoshi-wine-1965)
  "taishakukyo-kanko-hotel", // 帝釈峡国民宿舎 → 休暇村帝釈峡(別宿)
  "miyoshi-bori-bina", // 三次彫り雛 → 三次人形窯元(別工房)
  // 広島 R4(2026-05-01)— 概論 → 単店 + dup + 別都市
  "miyajima-momiji-yoroichaya", // 紅葉谷茶屋 → 紅葉谷公園(dup R1 楽 miyajima-koyo-dani)
  "fukuyama-anjuyaki", // 福山あんじゅやき → ホテルアンジュ(別店・別物)
  "hatsukaichi-anago-cuisine", // 廿日市あなご → うえの宮島口(dup R1 食 ueno)
  "fukuyama-resol-hotel", // リソル福山 → リソル京都河原町(別都市)
  "miyajima-bonzu-shukubo", // 宮島宿坊 → ホテル宮島別荘(別宿)
  "mihara-towel", // 三原タオル → 進物の大進(別店概論)
  "nishi-hiroshima-station", // 西広島駅 → 広島駅(dup R1 hiroshima-station-2025)
  "miyajima-airbus-direct", // 空港-宮島直通 → 広島空港(dup R1 hiroshima-airport-1993)
  // 広島 R5(2026-05-01)— 概論 → 単店 + dup
  "innoshima-suigun-nabe", // 水軍鍋 → 因島水軍城本丸(dup R5 楽 innoshima-suigun-castle)
  "kure-stew-overview", // 呉肉じゃが → 呉ハイカラ食堂(dup R2 食 kure-kaigun-curry)
  "sandankyo-ryokan-area", // 三段峡旅館圏 → 三段峡ホテル(単店)
  "ikuchi-island-pension", // 生口島ペンション → 島宿 NEST(単店)
  "miyoshi-fudoki-sakura", // 風土記の丘桜 → R5 育 fudoki 同 spot dup
  "saka-kosho-sakura-park", // 坂町桜まつり → 坂町役場(別 spot)
  "ohbayashi-nobuhiko-museum-onomichi", // 大林記念館 → おのみち映画資料館(別施設)
  // 広島 R6(2026-04-30)— 概論/zone/overview → 単店 + 同名異店
  "yaezakura-shuzo-mihara-1860", // 八重櫻酒造 → 醉心山根本店(別蔵)
  "setouchi-tsukudani", // 瀬戸内佃煮(郷土概念) → 川原食品(単店)
  "shobara-michi-no-eki-overview", // 庄原道の駅圏 → みのりの里(単店)
  "nakamoto-ryokan-takehara", // 仲本旅館 → 賀茂川荘(別宿)
  "shobara-knitwear", // 庄原ニット産地 → 備北丘陵公園(別施設)
  "kibitsu-jinja-bingo-kagura", // 備後吉備津神社 → 鷺神社(別社)
  "mihara-yakitori-zone", // 三原やきとり街 → 焼鳥岡心(単店)
  "kake-momiji-spot", // 大鼓滝 → 奥の滝(別瀑)
  "shimanami-cycling-toll", // しまなみ通行料(制度) → 向島南出入口(単点)
  // 広島 R7(2026-04-30)— 概論+ 別施設+ dup
  "jinseki-kogen-hotel", // 神石高原ホテル → ティアガルテン(別施設)
  "anjitsu-grape-picking", // 安芸津ぶどう狩り(概念) → すざわ果樹園(単店)
  "etajima-ferry-hiroshima", // 江田島フェリー(切串航路) → 三高港(別港)
  "okunoshima-rabbit-rental-cycle", // 大久野島レンタサイクル → 休暇村大久野島(dup w/ okunoshima-kyukamura)
  // 静岡 R9(2026-04-30)— 概念/area → 単店 + 異施設
  "heda-fukai-ebi", // 戸田深海えび(郷土食概念) → 魚重食堂(単店)
  "kawazu-kinmedai", // 河津金目鯛(概念) → 吉丸駅前店(単店)
  "heda-onsen-area", // 戸田温泉旅館圏 → 西伊豆今宵(単宿)
  "matsuzaki-onsen-area", // 松崎温泉旅館圏 → 伊豆まつざき荘(単宿)
  "hamamatsu-hina-ningyo", // 浜松雛人形(産地概念) → 寿月すみたや(単店)
  "heda-tuna-festival-jan", // 戸田まぐろ祭り(イベント) → 諸口神社(別施設)
  // 石川 R1 食(2026-04-30)— 概念 → 単店 + dup
  "jibuni-overview", // 治部煮(郷土食) → 底曳き割烹もんぜん(単店)
  "kaga-yasai-overview", // 加賀野菜(15 品目) → 能加万菜 郷(単店)
  "kanazawa-mawaru-zushi-overview", // 廻る金沢(概論) → もりもり(dup)
  "kanazawa-kaisendon-omicho", // 近江町海鮮丼(概論) → 海鮮丼いちば(単店)
  "fukume-shogatsu-kanazawa", // 福梅(正月菓子概念) → 御菓子処 美福(別店)
  "kaga-bocha-overview", // 加賀棒茶(概念) → 丸八金沢百番街(dup w/ 1863 本店)
  // 石川 R1 住(2026-04-30)— 概念/area → 単店 + 別店
  "kanazawa-machiya-overview", // 金沢町家泊(概念) → 町家 かなた(単店)
  "kaga-onsen-area-overview", // 加賀温泉郷(4 大概念) → 古総湯(単点)
  "yamanaka-kohotei-1641", // 古久里来(山中温泉旅館) → ファームイン(別施設)
  "notojima-minshuku-area-overview", // 能登島民宿圏 → 民宿浜弥(単宿)
  "wajima-onsen-stay-area", // 輪島温泉宿圏 → うめのやゲストハウス(単宿)
  "noto-2024-quake-lodging-impact", // 能登地震宿泊影響(advisory) → ホテルルートイン輪島(別店)
  "richmond-hotel-kanazawa-2010", // リッチモンド金沢 → 金沢マンテンホテル(別店)
  // 石川 R1 衣(2026-04-30)— 概念/area → 単店 + 別施設 + dup
  "kanazawa-haku-overview", // 金沢箔(全国 99% 概念) → 箔一本店(単店)
  "kanazawa-haku-experience-overview", // 金箔貼体験(概論) → かなざわカタニ(単店)
  "kaga-gosai-overview", // 加賀五彩(色彩理論) → 五彩町家和食(別店)
  "kaga-yuzen-experience-overview", // 加賀友禅体験(概論) → 加賀友禅会館(別施設)
  "kutaniyaki-overview-1655", // 九谷焼(歴史概論) → 九谷美陶園(単店)
  "kutaniyaki-five-areas", // 九谷焼 5 大エリア(地理概論) → 陶匠大雅(単店)
  "wajima-shikki-kaikan", // 輪島漆器会館 → 輪島塗会館(dup w/ wajima-nuri-overview-1975)
  "komatsu-kutaniyaki-art-museum", // 小松市立九谷焼美術館 → 石川県九谷焼美術館(別施設・能美市)
  "yamanaka-shikki-overview", // 山中漆器(産地概論) → 工房静寛(単店)
  // 石川 R1 育(2026-04-30)— 概念 → 単店 + 別施設
  "terramachi-tera-cluster-1616", // 寺町寺院群(70+ 寺概念) → 長久寺(単寺)
  "noto-kiriko-matsuri-overview", // 能登キリコ祭(200+ 祭概念) → ふる里キリコ橋(別施設)
  // 石川 R1 楽(2026-04-30)— 概念/イベント → 別場所 + dup
  "kanazawa-hyakumangoku-matsuri-jun", // 百万石まつり(イベント) → 金沢駅東広場(別施設)
  "kanazawa-lightup-bus-weekend", // ライトアップバス(交通) → 兼六園(目的地・dup)
  "kanazawa-jou-yozakura-spring", // 兼六園夜桜(季節イベント) → 兼六園(dup w/ kenrokuen-1822)
  "kanazawa-summer-fireworks", // 金沢花火大会(イベント) → 北國花火(主催会社)
  "katayamazu-shibayama-cruise", // 柴山潟遊覧船 → 柴山潟花火(別イベント)
  "noto-2024-quake-tourism-impact", // 能登観光復興(advisory・ZERO)
  // 石川 R1 行(2026-04-30)— concept/dup + advisory
  "kanazawa-furatto-bus", // ふらっとバス(北鉄運行) → 西日本 JR バス金沢営業所(別運営)
  "komatsu-airport-limousine", // 金沢-小松空港リムジン → 小松空港(dup w/ komatsu-airport-1944)
  "ishikawa-rental-car-area", // 石川県レンタカー(概念) → トヨタレンタカー駅西口(単店)
  "hokuriku-shinkansen-2024-tsuruga", // 2024 敦賀延伸(イベント・ZERO・abstract)
  "noto-2024-quake-transport-impact", // 能登交通復興(advisory・ZERO)
  // 石川 R2(2026-04-30)— 概念 → 単店 + データ不一致
  "kano-gani-overview", // 加能ガニ(GI 概念) → 居酒屋割烹田村(単店)
  "noto-gyu-overview", // 能登牛(GI 概念) → レストランあんのん(単店)
  "gori-cuisine-kanazawa", // ゴリ料理(郷土食) → 魚半武家屋敷前店(単店)
  "hanamurasaki-yamashiro-1872", // 花紫山代 → 山中温泉花紫(データ不一致・実際は山中)
  // 石川 R3(2026-04-30)— 概念→単店 + 別運営
  "kanazawa-kimono-rental-area", // 金沢着物レンタル(50 店舗概念) → 金沢きもの花恋(単店)
  "kanazawa-noto-direct-bus", // 金沢-能登直行バス(北鉄運行) → 西日本 JR バス(別運営)
  // 石川 R4(2026-04-30)— 概念 → 単店 + dup
  "shichiri-iwagaki-noto", // 七尾湾岩牡蠣(概念) → かき処 海(単店)
  "kanazawa-craft-experience-overview", // 工芸体験概念 → to-an(単店)
  "noto-michi-no-eki-overview", // 能登道の駅 8+ 駅 → 道の駅輪島ふらっと訪夢(1 駅)
  "kanazawa-takayama-highway-bus", // 金沢-高山高速バス → 西日本 JR バス金沢営業所(別運営)
  "kanazawa-kyoto-osaka-highway-bus", // 金沢-京都大阪高速バス → 西日本 JR バス金沢営業所(dup)
  // 石川 R5(2026-04-30)— 概念 → 単店 + 別施設
  "ishiri-noto-fish-sauce", // いしり魚醤(概念) → カネイシ(単店)
  "kaga-renkon-tempura", // 加賀蓮根天ぷら(郷土食) → 海鮮と加賀れんこん たかや(単店)
  "kanazawa-daikon-zushi", // 大根ずし(郷土食) → 寿し高崎屋(単店)
  "kanazawa-jazz-street-october", // ジャズフェス(イベント) → Jazz Snack RIVER(単店)
  "kaga-onsen-bus-canbus", // CAN BUS(交通) → 加賀市観光情報センター(別施設)
  // 石川 R6(2026-04-30)— 概念 + 別施設 + dup
  "honkokuji-nanao-1334", // 本興寺 → 本延寺(別寺)
  "kanazawa-eki-tax-free-counter-2015", // 免税カウンター → 金沢エムザ(別施設)
  "kanazawa-tokyo-night-bus-overview", // 夜行バス概念 → 西日本 JR バス金沢営業所(別施設)
  "noto-konbu-overview", // 能登昆布(概念) → 大脇昆布(単店)
  "yuwaku-yumeji-sai-april", // 夢二祭(イベント) → 金沢湯涌夢二館(dup w/ museum)
  // 石川 R7(2026-04-30)— 概念 → 別店 + dup
  "asanogawa-toro-nagashi-summer", // 浅野川灯ろう流し(夏) → 加賀友禅燈ろう流し本部(別行事 5 月)
  "kaga-gyu-overview", // 加賀牛(ブランド概念) → 吉野家加賀店(別系)
  "nomi-budou-overview", // 能美ぶどう(概念) → 吉川農園メロン(別品目)
  "noto-kannon-pilgrimage-overview", // 能登観音霊場 33 寺 → 総持寺祖院(dup w/ R4 monzen-ji)
  // 熊本 R1 食(2026-04-30)— 概念 → 単店 + dup
  "kuma-shochu-overview", // 球磨焼酎(GI 概念) → 一期屋(専門店単店)
  "amakusa-takomeshi", // 天草タコめし(郷土食) → 田吾作(単店)
  "ittsuji-guruguru-overview", // 一文字ぐるぐる(郷土前菜) → 居酒屋 料理屋じぃ(単店)
  "basashi-overview", // 馬刺し概論 → 菅乃屋(dup w/ suganoya-1968)
  "kumamoto-ramen-overview", // 熊本ラーメン概論 → 黒亭(dup w/ kokutei-1957)
  "kogashi-niniku-overview", // 焦がしニンニク油 → 東京油組(別店・別系)
  "taipien-overview", // 太平燕概論 → 中華旬菜 燕燕(別店)
  "karashi-renkon-overview", // 辛子蓮根概論 → 森からし蓮根(dup w/ mori-1864)
  "ikinari-dango-overview", // いきなり団子 → くま純(単店)
  // 熊本 R1 住(2026-04-30)— advisory → 単店
  "hitoyoshi-2020-water-impact-overview", // 2020 水害 advisory → 人吉旅館(別店)
  "kumamoto-2016-quake-lodging-impact", // 2016 地震 advisory → ネストホテル熊本(別店)
  // 熊本 R1 衣(2026-04-30)— 概念 → 単店/単窯 + dup
  "higo-zougan-overview", // 肥後象眼概論 → 光助 肥後象嵌(単店)
  "higo-zougan-experience-overview", // 体験概論 → 光助 肥後象嵌(dup)
  "amakusa-toseki-overview", // 天草陶石(原料概念) → 高浜焼寿芳窯(単窯)
  "amakusa-toujiki-overview", // 天草陶磁器概論 → 丸尾焼窯元(単窯)
  "shodai-yaki-overview", // 小代焼概論 → 小代焼中平窯(単窯)
  "higo-temari-overview", // 肥後手まり工芸 → 菓匠肥後てまり(別カテゴリ和菓子店)
  // 熊本 R1 楽(2026-05-02)— 観光列車 → 駅 / 祭 → 事務所 / 桜 → 商店街
  "a-train-jr-2011", // A 列車 → 熊本駅
  "asobo-i-jr-2011", // あそぼーい → 阿蘇駅
  "kawasemi-yamasemi-jr-2017", // かわせみやませみ → やませみ generic
  "hi-no-kuni-matsuri-aug", // 火の国まつり → YOSAKOI 事務局(別行事)
  "kumamoto-jou-cherry-spring", // 熊本城桜 → 城彩苑(商店街)
  // 熊本 R1 行(2026-05-02)— 路線 → 駅 / 市電 system → 単停 / concept → 別事業
  "jr-hisatsu-line-2020-suspended", // 肥薩線 → 人吉駅
  "kumamoto-ichi-densha-1924", // 市電 system → 熊本駅前(単一停留所)
  "kumamoto-fukuoka-highway-bus", // 概念 → 九州産交予約センター(別事業)
  "kumamoto-osaka-night-bus", // 概念 → 桜町 BT(generic)
  "kumamoto-airport-limousine", // 概念 → 阿蘇くまもと空港(空港側)
  "kumamoto-rental-car-area", // area 概念 → トヨタレンタカー新幹線口店(単店)
  "kumamoto-tour-taxi", // 概念 → 観光タクシー(generic)
  "kumamoto-bus-1day-pass", // 1 日券 → 熊本市交通局(別)
  "kumamoto-2020-flood-transport-impact", // 2020 水害 advisory → 球磨川くだり(別事業)
  // 熊本 R2(2026-05-02)— 概念 → 単店 / ルート → 1 区間 / 引退 → 別場所
  "kaseita-takadaya", // 高田屋 → たかのチェーン(別店)
  "hirayama-onsen-area-overview", // 概念 → 湯の蔵(単店)
  "yamaga-toro-koubo-overview", // 工房概念 → なかしま店(単店)
  "kawajiri-hamono-overview", // 概念 → 林刃物製作所(単店)
  "milk-road-aso-outer-rim", // ルート → 北外輪山大津線(1 区間)
  "sl-hitoyoshi-2009-2024-retired", // 引退 SL → 人吉市 SL 展示館(別場所)
  // 熊本 R3(2026-05-02)— 概念 → 単店 / ルート → BT generic
  "dekopon-shiranui-1972-origin", // 品種概念 → かわの果樹園(単一農園)
  "kumamoto-kagoshima-highway-bus", // ルート → 桜町 BT(generic・他 hwy bus と衝突)
  "36-plus-3-jr-kyushu-2020", // ZERO_RESULTS(D&S 列車・place なし)
  // 熊本 R4(2026-05-02)— ブランド衝突 + 概念→酒造誤命中
  "okashi-no-shiro-musha-gaeshi-1978", // お菓子の城 → 香梅 香梅庵(別ブランド)
  "kuma-ken-1991-national-intangible", // 拳遊び概念 → 恒松酒造(別カテゴリ)
  // 熊本 R5(2026-05-02)— 概念 + 別ホテル + 別古墳 + 路線→駅 + 祭→橋
  "kumamoto-tomato-winter-spring", // 概念 → トマリエ農園(単一農園)
  "sangen-kurokawa-modern", // 旅館 → やまたけ(レストラン)
  "aso-san-hotel", // 阿蘇山ホテル → 亀の井ホテル(別系列)
  "tamana-kofun-gun", // 古墳群 → 石貫ナギノ横穴群(別古墳)
  "ushibuka-haiya-matsuri-april", // 祭礼 → 牛深ハイヤ大橋(別カテゴリ)
  "jr-kagoshima-honsen-kumamoto-1909", // 路線 → 熊本駅(別 entry dup)
  // 熊本 R6(2026-05-02)— 別ブランド + ルート→駅 generic
  "kawazu-shuzo-yamaga-1932", // 河津酒造 → 千代の園酒造(別ブランド+R4 と dup)
  "kumamoto-oita-highway-bus-1985", // やまびこ号 → 熊本駅(ルート→駅)
  // 関東 R1-R6(茨城+栃木+群馬, 2026-05-05)— 抽象 closing tour / 架空 pass / 複数地点まとめ
  "ibaraki-tour-mvp-passport", // 架空 MVP pass → 偕楽園誤命中
  "ibaraki-tour-pass", // 茨城観光フリーパス(抽象)→ ひたち海浜公園誤命中
  "ibaraki-prefecture-summary-tour", // 全県周遊(複数地点)→ 水戸城角櫓誤命中
  "tochigi-tour-mvp-pass", // 架空 MVP pass(ZERO だが念のため)
  "tochigi-prefecture-finale-tour", // 全県周遊 → 宇都宮動物園誤命中
  "tochigi-koyo-tour", // 紅葉ベスト 5 ツアー(複数地点)→ 日塩もみじライン
  "tochigi-ramen-tour", // 県内ラーメン巡り(複数店)→ 大和(1 店)
  "tochigi-mascot-finale", // とちまるくん closing → とちまるゴルフクラブ誤命中
  "tochigi-direct-sales-market", // 県内直売所網羅(複数)→ あぜみち駅東店(1 店)
  "tochigi-3-castles", // 3 大城跡(複数)→ 飛山城跡(1 個)
  "gunma-tour-mvp-pass-finale", // 架空 MVP pass closing → イオンモール高崎誤命中
  "gunma-tour-pass-2day", // ぐんま観光 pass(抽象)→ 榛名公園誤命中
  "gunma-prefecture-finale-tour", // 全県周遊 closing → るなぱあく誤命中
  "gunma-koyo-finale-tour", // 紅葉 closing(複数)→ 宝徳寺(1 個)
  "gunma-yakei-night-finale", // 夜景 closing(複数)→ 鼻高展望花の丘(1 個)
  "gunma-kaiseki-finale", // 郷土会席 closing → 里の家(1 店)
  "gunma-kaiseki-tour", // 郷土料理ツアー(複数)→ 里の家(1 店)
]);

function buildQuery(entry: EntryRow): string {
  const name = entry.title_ja?.trim() || entry.title_zh;
  const where = entry.municipality_ja || entry.prefecture_ja;
  return where ? `${name} ${where}` : name;
}

async function main() {
  const dry = process.argv.includes("--dry");
  // 後接數字 → limit;不接數字 → 全跑
  const limitArg = process.argv.find((a) => /^\d+$/.test(a));
  const limit = limitArg ? Number(limitArg) : null;

  // post-SUNSET: JSON 直読み
  const allEntries = readAllEntries();
  const bySlug = new Map<string, Record<string, unknown>>();
  for (const e of allEntries) bySlug.set(e.slug as string, e);

  let rawEntries: EntryRow[] = allEntries
    .filter((e) => !e.google_place_id)
    .map((e) => ({
      id: 0, // post-SUNSET: id 不再使用,以 slug 為 key
      slug: e.slug as string,
      sub_type: (e.sub_type as string) ?? "",
      title_ja: (e.title_ja as string | null) ?? null,
      title_zh: (e.title_zh as string) ?? "",
      municipality_ja: (e.municipality_ja as string | null) ?? null,
      prefecture_ja: (e.prefecture_ja as string) ?? "",
    }));
  if (limit) rawEntries = rawEntries.slice(0, limit);

  if (rawEntries.length === 0) {
    console.log("[match] 沒有需要配對的 entry");
    return;
  }

  // 過濾票券/抽象 sub_type + 永久 skip slugs
  const entries = rawEntries.filter(
    (e) => !SKIP_SUB_TYPES.has(e.sub_type) && !SKIP_SLUGS.has(e.slug),
  );
  const skipped = rawEntries.length - entries.length;

  console.log(
    `[match] 共 ${entries.length} 筆待配對(跳過 ${skipped} 票券/抽象 sub_type)${dry ? " (dry-run)" : ""}`,
  );

  let matched = 0;
  let zeroResults = 0;
  let failed = 0;
  let sinceLastFlush = 0;
  const FLUSH_EVERY = 25;

  const flush = () => {
    writeAllEntries(allEntries);
    sinceLastFlush = 0;
  };

  for (const entry of entries) {
    const query = buildQuery(entry);
    if (dry && !limit) {
      // 純 dry,不打 API,只印 query
      console.log(`  ${entry.slug.padEnd(50)} ← ${query}`);
      continue;
    }

    try {
      const result = await findPlaceByText(query);
      if (!result) {
        console.warn(`  ZERO  ${entry.slug.padEnd(50)} ← ${query}`);
        zeroResults++;
        continue;
      }
      console.log(
        `  OK    ${entry.slug.padEnd(50)} ← ${query}  →  ${result.place_id} (${result.name})`,
      );
      matched++;

      if (!dry) {
        const target = bySlug.get(entry.slug);
        if (target) {
          target.google_place_id = result.place_id;
          sinceLastFlush++;
          if (sinceLastFlush >= FLUSH_EVERY) flush();
        } else {
          console.error(`  WRITE FAIL ${entry.slug}: not in bySlug map`);
          failed++;
        }
      }
    } catch (err) {
      console.error(
        `  FAIL  ${entry.slug.padEnd(50)} ← ${query}  (${(err as Error).message})`,
      );
      failed++;
    }

    // 200ms 間隔,降 QPS 壓力(Find Place 配額預設 100 QPS,留餘量)
    await sleep(200);
  }

  if (!dry && sinceLastFlush > 0) flush();

  console.log(
    `\n[match] 結束:matched=${matched} zero=${zeroResults} fail=${failed} ${dry ? "(dry-run, 沒寫 JSON)" : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
