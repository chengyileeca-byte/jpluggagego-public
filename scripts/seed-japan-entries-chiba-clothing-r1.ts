// Seed 千葉県 衣 R1(18 筆 / Sprint 1.2 / 第十二卷)
// 房州うちわ 3 / 房総漁師着 2 / 海女 1 / 大原はだか祭 1 / 上総木綿 1 /
// 流山白みりん街道 1 / 佐倉武家+ 香取神宮 2 / 神楽装束 1 /
// 成田山参詣 1 / disney 1 / チーバくん 1 / 海リゾート 1 / 工業作業着 1 / 漁協ブランド 1 = 18
import { seedMain, type SeedRow } from "./seed-helpers/upsert-entries";

const rows: SeedRow[] = [
  // 房州うちわ (3) — 国指定伝統工芸品 1992
  {
    slug: "boshu-uchiwa-1992",
    category: "fashion", sub_type: "chiba_uchiwa",
    title_zh: "房州うちわ(南房総市富山+館山市・国指定伝統工芸品 1992・京うちわ+丸亀うちわ並ぶ全国 3 大うちわ・江戸期 1700 年代発祥 300+ 年・女竹+細工竹を 64-72 本割いた円形竹骨+紙貼り・1 本 ¥2,500-12,000+ R1 育 房州里見氏館山城観光連動)",
    title_ja: "房州うちわ", romaji: "Bōshū Uchiwa",
    summary_zh: "**房州うちわは国指定伝統工芸品 1992・京+丸亀並ぶ全国 3 大うちわ・江戸期 1700 年代発祥 300+ 年**(南房総富山+館山・**女竹細工竹 64-72 本割円形竹骨+紙貼**)。¥2,500-12,000、R1 育 館山城連動。",
    content_md: "- 立地:**南房総市富山地区(旧富山町) + 館山市**\n- 起源:**江戸期 1700 年代発祥 300+ 年**\n- 認定:**国指定伝統工芸品 1992 + 京 + 丸亀並ぶ全国 3 大うちわ**\n- 構成:**女竹 + 細工竹 64-72 本割円形竹骨 + 紙貼り**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "南房総市", lg_code: "12234",
    area_types: ["industrial_heritage", "shopping_district"], lat: 35.0633, lon: 139.8358,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 3, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["boshu_uchiwa", "1992_national_designation", "edo_origin"], source: "manual",
  },
  {
    slug: "boshu-uchiwa-makers",
    category: "fashion", sub_type: "chiba_uchiwa",
    title_zh: "房州うちわ職人工房+実演(南房総市富山+館山・房州うちわ協同組合 + 房州うちわ振興協議会・現役職人 12+ 軒+ 製作実演 + 体験教室+ 道の駅 富楽里とみやま+ 房州うちわ製作工程展示・1 本 ¥3,500-12,000+ R1 食 房総ビワ観光連動)",
    title_ja: "房州うちわ工房", romaji: "Bōshū Uchiwa Kobō",
    summary_zh: "**房州うちわ職人工房+実演は協同組合+振興協議会・現役職人 12+ 軒**(南房総富山+館山)。製作実演+体験教室+道の駅富楽里、¥3,500-12,000。",
    content_md: "- 立地:**南房総市富山 + 館山市**\n- 規模:**現役職人 12+ 軒**\n- 関連:**R1 衣 房州うちわ 1992 派生**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "南房総市", lg_code: "12234",
    area_types: ["industrial_heritage", "shopping_district"], lat: 35.0633, lon: 139.8358,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 3, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["boshu_uchiwa_kobō"], source: "manual",
  },
  {
    slug: "boshu-uchiwa-museum",
    category: "fashion", sub_type: "chiba_uchiwa",
    title_zh: "房州うちわ展示+富山地区文化祭(南房総市富山地区・1700 年代から地区文化祭+ R1 衣 房州うちわ製作工程展示館 + 道の駅 富楽里とみやま+ 房州うちわ製作実演会・8-10 月旬 富山うちわ祭り・国際観光客向け解説あり・観覧無料-¥500)",
    title_ja: "房州うちわ展示", romaji: "Bōshū Uchiwa Tenji",
    summary_zh: "**房州うちわ展示+富山地区文化祭は 1700 年代から地区文化祭・うちわ製作工程展示館+富楽里**(南房総富山・**8-10 月富山うちわ祭り**)。観覧無料-¥500。",
    content_md: "- 立地:**南房総市富山地区(旧富山町)**\n- 関連:**R1 衣 房州うちわ展示館 + 富楽里道の駅**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "南房総市", lg_code: "12234",
    area_types: ["museum_art", "industrial_heritage"], lat: 35.0633, lon: 139.8358,
    season_start: "2026-08-01", season_end: "2026-10-31", event_start: null, event_end: null,
    price_tier: 1, booking_window_days: null, closed_days: ["wednesday"],
    external_urls: {}, tags: ["boshu_uchiwa_tenji"], source: "manual",
  },

  // 房総漁師着 (2)
  {
    slug: "boso-gyoshi-hanten",
    category: "fashion", sub_type: "chiba_gyoshi",
    title_zh: "房総漁師袢纏+腹掛け(銚子市+館山+鴨川+勝浦・房総漁師伝統作業着 200+ 年+ 紺地白染抜+ 漁協屋号入袢纏+ 腹掛け+ 帆前掛け・道の駅+漁協販売・1 着 ¥4,500-15,000+ R1 食 銚子港+ 房総なめろう観光連動)",
    title_ja: "房総漁師袢纏", romaji: "Bōsō Gyoshi Hanten",
    summary_zh: "**房総漁師袢纏+腹掛けは房総漁師伝統作業着 200+ 年・紺地白染抜+漁協屋号入**(銚子+館山+鴨川+勝浦)。道の駅+漁協販売、¥4,500-15,000、R1 食 銚子港+なめろう連動。",
    content_md: "- 立地:**銚子市 + 館山市 + 鴨川市 + 勝浦市**\n- 起源:**房総漁師伝統作業着 200+ 年**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "銚子市", lg_code: "12202",
    area_types: ["industrial_heritage", "shopping_district"], lat: 35.7344, lon: 140.8264,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 3, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["boso_gyoshi_hanten"], source: "manual",
  },
  {
    slug: "choshi-marine-aparel",
    category: "fashion", sub_type: "chiba_gyoshi",
    title_zh: "銚子マリン土産+海洋アパレル(銚子市・銚子港 全国水揚げ首位 R1 食 派生・銚子電鉄ぬれせんべい巾着+犬吠埼灯台 T シャツ+漁師アロハ・JR 銚子駅+銚子電鉄全駅売店+ウオッセ 21・¥1,200-4,500+ R1 育 犬吠埼+ 観光客土産代表)",
    title_ja: "銚子マリンアパレル", romaji: "Chōshi Marine Aparel",
    summary_zh: "**銚子マリン土産+海洋アパレルは銚子港全国首位 R1 食派生・銚子電鉄+犬吠埼+漁師アロハ**(銚子)。JR 銚子駅+銚子電鉄全駅+ウオッセ 21、¥1,200-4,500、R1 育 犬吠埼+土産代表。",
    content_md: "- 立地:**銚子市**\n- 関連:**R1 食 銚子港 + R1 行 銚子電鉄派生**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "銚子市", lg_code: "12202",
    area_types: ["shopping_district"], lat: 35.7344, lon: 140.8264,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 1, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["choshi_marine_aparel"], source: "manual",
  },

  // 海女 (1)
  {
    slug: "boso-ama-isono",
    category: "fashion", sub_type: "chiba_ama",
    title_zh: "房総海女着+磯ノミ装束(鴨川市+南房総市和田+館山・房総海女漁業伝統 江戸期から 300+ 年・白衣 + 磯桶 + 磯ノミ + 磯メガネ・房総海女文化展(鴨川市郷土資料館)+ 房総海女祭り 7 月+ R1 食 房総なめろう+鴨川くじら観光連動)",
    title_ja: "房総海女", romaji: "Bōsō Ama",
    summary_zh: "**房総海女着+磯ノミ装束は房総海女漁業伝統江戸期から 300+ 年・白衣+磯桶+磯ノミ+磯メガネ**(鴨川+南房総和田+館山)。房総海女文化展+海女祭り 7 月、R1 食 なめろう+くじら連動。",
    content_md: "- 立地:**鴨川市 + 南房総市和田 + 館山市**\n- 起源:**房総海女漁業伝統江戸期から 300+ 年**\n- 構成:**白衣 + 磯桶 + 磯ノミ + 磯メガネ**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "鴨川市", lg_code: "12223",
    area_types: ["industrial_heritage", "history_site_castle"], lat: 35.1131, lon: 140.1003,
    season_start: "2026-07-01", season_end: "2026-07-31", event_start: null, event_end: null,
    price_tier: 1, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["boso_ama"], source: "manual",
  },

  // 大原はだか祭 (1) — いすみ
  {
    slug: "ohara-hadaka-matsuri-clothing",
    category: "fashion", sub_type: "chiba_matsuri",
    title_zh: "大原はだか祭装束(いすみ市大原・千葉県指定無形民俗文化財 1968+ 江戸期 1700 年代発祥 320+ 年・神輿担ぎ褌+鉢巻+足袋装束・10 月第 4 土日 18 神輿の海中渡御+ 大原漁港集結+ R1 楽 大原はだか祭観光連動・国際観光客向け装束体験あり)",
    title_ja: "大原はだか祭装束", romaji: "Ōhara Hadaka Matsuri",
    summary_zh: "**大原はだか祭装束は千葉県指定無形民俗文化財 1968・江戸期 1700 年代発祥 320+ 年・神輿担ぎ褌+鉢巻+足袋**(いすみ大原・**10 月第 4 土日 18 神輿海中渡御**)。R1 楽 連動、国際向け体験。",
    content_md: "- 立地:**いすみ市大原**\n- 認定:**千葉県指定無形民俗文化財 1968 + 江戸期 1700 年代発祥 320+ 年**\n- 規模:**18 神輿の海中渡御**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "いすみ市", lg_code: "12238",
    area_types: ["history_site_castle", "industrial_heritage"], lat: 35.2519, lon: 140.3886,
    season_start: null, season_end: null, event_start: "2026-10-24T09:00:00+09:00", event_end: "2026-10-25T20:00:00+09:00",
    price_tier: 0, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["ohara_hadaka", "1968_designation"], source: "manual",
  },

  // 上総木綿 (1)
  {
    slug: "kazusa-momen-shima",
    category: "fashion", sub_type: "chiba_kazusa_momen",
    title_zh: "上総木綿+房総縞紬(茂原市+一宮+長生+市原・古代から木綿生産・江戸期から房総縞紬伝統 200+ 年+ 房総縞文化保存会+ 復興運動 1990 年代以降+ 道の駅+市内工房+ 1 反 ¥45,000-150,000+ R1 育 上総一宮玉前神社観光連動)",
    title_ja: "上総木綿", romaji: "Kazusa Momen",
    summary_zh: "**上総木綿+房総縞紬は古代から木綿生産・江戸期から房総縞紬伝統 200+ 年・1990 年代以降復興運動**(茂原+一宮+長生+市原・**保存会+市内工房**)。¥45,000-150,000/反、R1 育 玉前神社連動。",
    content_md: "- 立地:**茂原市 + 一宮町 + 長生村 + 市原市**\n- 起源:**江戸期から房総縞紬伝統 200+ 年 + 1990 年代以降復興運動**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "茂原市", lg_code: "12210",
    area_types: ["industrial_heritage"], lat: 35.4286, lon: 140.2917,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 5, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["kazusa_momen", "boso_shima"], source: "manual",
  },

  // 流山白みりん街道 (1)
  {
    slug: "nagareyama-mirin-shokunin",
    category: "fashion", sub_type: "chiba_nagareyama",
    title_zh: "流山白みりん街道職人着(流山市・1814 文化 11 年 流山白みりん発祥 211+ 年+ キノエネ醤油・流山みりん街道+ みりん酒蔵職人前掛+ 醸造蔵作業着・R1 行 流鉄流山線+ R1 育 流山本町文化財観光連動・¥3,500-12,000)",
    title_ja: "流山みりん職人着", romaji: "Nagareyama Mirin Shokunin",
    summary_zh: "**流山白みりん街道職人着は 1814 文化 11 年 流山白みりん発祥 211+ 年・キノエネ醤油+みりん街道**(流山・**みりん酒蔵職人前掛+醸造蔵作業着**)。R1 行 流鉄+R1 育 本町連動、¥3,500-12,000。",
    content_md: "- 立地:**流山市本町**\n- 起源:**1814 文化 11 年 流山白みりん発祥 211+ 年**\n- 関連:**キノエネ醤油 + 流山みりん街道**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "流山市", lg_code: "12220",
    area_types: ["industrial_heritage"], lat: 35.8567, lon: 139.9028,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 3, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["nagareyama_mirin", "1814", "211_years"], source: "manual",
  },

  // 佐倉武家屋敷+香取神宮 (2)
  {
    slug: "sakura-bukeyashiki-samurai-clothing",
    category: "fashion", sub_type: "chiba_samurai",
    title_zh: "佐倉武家屋敷武士装束(佐倉市・佐倉藩 11 万石 1590-1871・国指定史跡 1959 旧河原家住宅+但馬家+武居家 3 棟・武士装束着付体験+ 佐倉藩士衣裳展示+ R1 育 佐倉城+ 国立歴史民俗博物館観光連動・観覧 ¥250-650)",
    title_ja: "佐倉武家屋敷", romaji: "Sakura Bukeyashiki",
    summary_zh: "**佐倉武家屋敷武士装束は佐倉藩 11 万石 1590-1871・国指定史跡 1959 旧河原家+但馬家+武居家 3 棟**(佐倉・**着付体験+衣裳展示**)。R1 育 佐倉城+歴博連動、¥250-650。",
    content_md: "- 立地:**佐倉市**\n- 認定:**国指定史跡 1959 旧河原家 + 但馬家 + 武居家 3 棟**\n- 起源:**佐倉藩 11 万石 1590-1871**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "佐倉市", lg_code: "12212",
    area_types: ["history_site_castle", "museum_art"], lat: 35.7236, lon: 140.2233,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 1, booking_window_days: null, closed_days: ["monday"],
    external_urls: {}, tags: ["sakura_bukeyashiki", "1959_designation"], source: "manual",
  },
  {
    slug: "katori-jingu-kannushi",
    category: "fashion", sub_type: "chiba_kannushi",
    title_zh: "香取神宮神官装束(香取市・下総国一宮+ 全国 400+ 香取神社総本社+ 古代神武東征伝承・経津主大神祀る・神官装束狩衣+浄衣+ 御朱印帳販売・本殿国指定重要文化財 1977+ R1 育 佐原観光連動・参拝無料)",
    title_ja: "香取神宮神官装束", romaji: "Katori Jingū Kannushi",
    summary_zh: "**香取神宮神官装束は下総国一宮・全国 400+ 香取神社総本社・古代神武東征伝承**(香取・**神官狩衣+浄衣+御朱印帳販売**)。本殿国重文 1977、R1 育 佐原連動、参拝無料。",
    content_md: "- 立地:**香取市**\n- 認定:**下総国一宮 + 全国 400+ 香取神社総本社 + 本殿国指定重要文化財 1977**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "香取市", lg_code: "12236",
    area_types: ["history_site_castle"], lat: 35.8861, lon: 140.5283,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 0, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["katori_jingū", "ichinomiya_shimōsa"], source: "manual",
  },

  // 神楽装束 (1)
  {
    slug: "awa-jinja-kagura-clothing",
    category: "fashion", sub_type: "chiba_kagura",
    title_zh: "安房神社神楽装束(館山市・安房国一宮+ 古代天太玉命祀る神武東征伝承・安房神楽 千葉県指定無形民俗 1965+ 神楽舞装束+ 御幣+ 鈴+ 面・8 月安房神社例大祭神楽奉納+ R1 育 館山城観光連動・参拝無料)",
    title_ja: "安房神社神楽", romaji: "Awa Jinja Kagura",
    summary_zh: "**安房神社神楽装束は安房国一宮・千葉県指定無形民俗 1965・神楽舞装束+御幣+鈴+面**(館山・**8 月例大祭神楽奉納**)。R1 育 館山城連動、参拝無料。",
    content_md: "- 立地:**館山市**\n- 認定:**安房国一宮 + 千葉県指定無形民俗 1965**\n- 構成:**神楽舞装束 + 御幣 + 鈴 + 面**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "館山市", lg_code: "12205",
    area_types: ["history_site_castle"], lat: 34.9961, lon: 139.8694,
    season_start: null, season_end: null, event_start: "2026-08-09T09:00:00+09:00", event_end: "2026-08-10T20:00:00+09:00",
    price_tier: 0, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["awa_jinja", "kagura_1965"], source: "manual",
  },

  // 成田山参詣 (1)
  {
    slug: "naritasan-omamori-aparel",
    category: "fashion", sub_type: "chiba_naritasan",
    title_zh: "成田山新勝寺御朱印帳+お守り+巾着(成田市・940 朱雀天皇代開基 1085+ 年+ 全国第 2 位年間参拝者 1000 万人・R1 育 成田山派生・御朱印帳+ 厄除お守り+ 護摩供巾着+ 参道老舗ハンドメイド土産・¥800-3,500+ R1 食 成田うなぎ並ぶ参詣土産)",
    title_ja: "成田山御朱印帳", romaji: "Naritasan Omamori",
    summary_zh: "**成田山新勝寺御朱印帳+お守り+巾着は 940 開基 1085+ 年・全国第 2 位年間参拝者 1000 万人 R1 育派生**(成田・**厄除+護摩供+参道老舗**)。¥800-3,500、R1 食 うなぎ並ぶ。",
    content_md: "- 立地:**成田市 成田山新勝寺参道**\n- 関連:**R1 育 成田山新勝寺 940 派生**\n- 起源:**940 朱雀天皇代開基 1085+ 年**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "成田市", lg_code: "12211",
    area_types: ["history_site_castle", "shopping_district"], lat: 35.7864, lon: 140.3192,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 1, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["naritasan_omamori", "940_origin"], source: "manual",
  },

  // disney resort (1)
  {
    slug: "urayasu-disney-aparel",
    category: "fashion", sub_type: "chiba_disney",
    title_zh: "東京ディズニーリゾートマーチャンダイズ(浦安市舞浜・1983 オープン 42+ 年+ 全国国際観光地代表+ 公式キャラクターアパレル+ T シャツ+ 帽子+ ぬいぐるみ+ コラボブランド・年間 3000 万人来場・¥1,200-15,000+ 海外輸出代表・R1 楽 ディズニーリゾート観光連動)",
    title_ja: "東京ディズニーアパレル", romaji: "Tōkyō Disney Aparel",
    summary_zh: "**東京ディズニーリゾートマーチャンダイズは 1983 オープン 42+ 年・全国国際観光地代表・年間 3000 万人来場**(浦安舞浜・**公式キャラクターアパレル+ぬいぐるみ+コラボ**)。¥1,200-15,000、海外輸出代表。",
    content_md: "- 立地:**浦安市舞浜**\n- 起源:**1983 オープン 42+ 年**\n- 認定:**全国国際観光地代表 + 年間 3000 万人来場**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "浦安市", lg_code: "12227",
    area_types: ["shopping_district"], lat: 35.6329, lon: 139.8804,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 3, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["disney_aparel", "1983", "42_years"], source: "manual",
  },

  // チーバくん (1)
  {
    slug: "chiba-chiibakun-aparel",
    category: "fashion", sub_type: "chiba_chiibakun",
    title_zh: "チーバくん県マスコットアパレル(全県・2007 ゆめ半島千葉国体マスコット由来 18+ 年+ 県公認キャラクター・チーバくん T シャツ+ 帽子+ タオル+ ぬいぐるみ・JR 駅売店+ 成田空港+ 全国百貨店・¥1,200-4,500+ 国際観光客土産代表)",
    title_ja: "チーバくんアパレル", romaji: "Chiibakun Aparel",
    summary_zh: "**チーバくん県マスコットアパレルは 2007 ゆめ半島千葉国体由来 18+ 年・県公認キャラクター**(全県・**T シャツ+帽子+タオル+ぬいぐるみ**)。JR 駅+成田空港+百貨店、¥1,200-4,500、国際観光客代表。",
    content_md: "- 全域:**千葉県全域**\n- 起源:**2007 ゆめ半島千葉国体マスコット由来 18+ 年**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "千葉市", lg_code: "12100",
    area_types: ["shopping_district"], lat: 35.6047, lon: 140.1233,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 2, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["chiibakun_aparel", "2007"], source: "manual",
  },

  // 海リゾート (1)
  {
    slug: "boso-resort-surf-aloha",
    category: "fashion", sub_type: "chiba_resort",
    title_zh: "館山+南房総+鴨川海リゾートサーフ+アロハ(館山市+南房総+鴨川+一宮・房総半島サーフィン文化 1960 年代以降 65+ 年+ 一宮町 2020 五輪サーフィン会場+ サーフブランド+アロハシャツ+ ボードショーツ・道の駅+海岸観光土産店・¥3,500-12,000)",
    title_ja: "房総サーフ", romaji: "Bōsō Surf",
    summary_zh: "**館山+南房総+鴨川海リゾートサーフ+アロハは房総サーフィン文化 1960 年代以降 65+ 年・一宮 2020 五輪サーフィン会場**(館山+南房総+鴨川+一宮)。道の駅+海岸土産、¥3,500-12,000。",
    content_md: "- 立地:**館山市 + 南房総市 + 鴨川市 + 一宮町**\n- 起源:**房総半島サーフィン文化 1960 年代以降 65+ 年**\n- 認定:**一宮町 2020 五輪サーフィン会場**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "館山市", lg_code: "12205",
    area_types: ["beach_coast", "shopping_district"], lat: 34.9961, lon: 139.8694,
    season_start: "2026-06-01", season_end: "2026-09-30", event_start: null, event_end: null,
    price_tier: 3, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["boso_surf", "ichinomiya_olympic"], source: "manual",
  },

  // 工業作業着 (1)
  {
    slug: "kisarazu-kimitsu-industrial",
    category: "fashion", sub_type: "chiba_industrial",
    title_zh: "京葉工業地帯作業着(市原市+君津+木更津+富津・1960 年代以降京葉工業地帯 60+ 年+ 国内最大級重化学工業集積・新日鉄住金君津製鉄所・出光昭和シェル+JX 千葉製油所・産業観光作業着+ヘルメット+作業靴・産業観光ツアー連動・¥3,500-15,000)",
    title_ja: "京葉工業作業着", romaji: "Keiyō Industrial",
    summary_zh: "**京葉工業地帯作業着は 1960 年代以降 60+ 年・国内最大級重化学工業集積**(市原+君津+木更津+富津・**新日鉄住金君津 + 出光 JX 千葉**)。産業観光ツアー連動、¥3,500-15,000。",
    content_md: "- 立地:**市原市 + 君津市 + 木更津市 + 富津市**\n- 起源:**1960 年代以降京葉工業地帯 60+ 年**\n- 認定:**国内最大級重化学工業集積**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "君津市", lg_code: "12225",
    area_types: ["industrial_heritage"], lat: 35.3306, lon: 139.9019,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 3, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["keiyo_industrial"], source: "manual",
  },

  // 漁協ブランド (1)
  {
    slug: "chiba-marine-brand-aparel",
    category: "fashion", sub_type: "chiba_marine_brand",
    title_zh: "千葉県漁業協同組合公認ブランドアパレル(全県沿岸・千葉県漁連 1949 設立 76+ 年+ 銚子+富津+館山+鴨川+勝浦+いすみ 6 大漁港・公認ブランド漁師印 T シャツ+ 帽子+ 海産土産+ 道の駅+ 漁協販売所+ ¥1,500-4,500+ R1 食 銚子港+ 房総漁師連動)",
    title_ja: "千葉漁協ブランド", romaji: "Chiba Gyokyō Brand",
    summary_zh: "**千葉県漁協公認ブランドアパレルは 1949 設立 76+ 年・銚子+富津+館山+鴨川+勝浦+いすみ 6 大漁港**(全県沿岸)。漁師印 T+帽子+海産土産、道の駅+漁協、¥1,500-4,500。",
    content_md: "- 全域:**千葉県全域沿岸**\n- 起源:**千葉県漁連 1949 設立 76+ 年**",
    region: "kanto", prefecture_ja: "千葉県", gun_ja: null, municipality_ja: "千葉市", lg_code: "12100",
    area_types: ["shopping_district"], lat: 35.6047, lon: 140.1233,
    season_start: null, season_end: null, event_start: null, event_end: null,
    price_tier: 2, booking_window_days: null, closed_days: [],
    external_urls: {}, tags: ["chiba_gyokyo_brand", "1949"], source: "manual",
  },
];

seedMain(rows, "chiba-clothing-r1");
