// rank-japan-entries — 回填 japan_entries.feature_rank
//
// 設計見 docs/japan-prep-plan.md 補充 + migration 0018 header。
//
// Rank 定義:
//   3 = 全國級(外國觀光客也識別的北海道代表)
//   2 = 地區代表(北海道內數一數二、跨縣值得專程)
//   1 = 縣代表(北海道內知名、但不一定跨縣)— Phase 1 暫不列
//   0 = 一般(default,地區頁才顯示)
//
// 白名單以 slug 為鍵。不在白名單的條目 rank 保持 DB default 0,故 idempotent
// 且不會洗掉其他資料。未來加新 rank 直接擴充 RANK_MAP。
//
// Usage:
//   npm run rank:japan:dry
//   npm run rank:japan

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

type Rank = 0 | 1 | 2 | 3;

const RANK_MAP: Record<string, Rank> = {
  // ── Rank 3:全國級 ──────────────────────────────
  "hokkaido-sapporo-snow-festival": 3, // 札幌雪祭(國際品牌)
  "hokkaido-hakodate-goryokaku": 3, // 五稜郭(國指定特別史跡)
  "hokkaido-asahiyama-zoo": 3, // 旭山動物園(行動展示創始)
  "hokkaido-niseko-ski": 3, // ニセコ(國際滑雪品牌)
  "hokkaido-farm-tomita-lavender": 3, // 富田ファーム薰衣草(景觀代表)
  "hokkaido-yoichi-nikka-distillery": 3, // ニッカ余市(NHK『マッサン』)

  // ── Rank 2:北海道代表 ──────────────────────────────

  // 樂 entertainment
  "hokkaido-goryokaku-sakura": 2,
  "hokkaido-shizunai-nijukken-sakura": 2,
  "hokkaido-daisetsuzan-kurodake-momiji": 2,
  "hokkaido-furano-ski": 2,
  "hokkaido-rusutsu-ski": 2,
  "hokkaido-tomamu-ski": 2,
  "hokkaido-kiroro-ski": 2,
  "hokkaido-shikotsu-hyoto": 2,
  "hokkaido-otaru-yukiakari": 2,
  "hokkaido-biei-blue-pond": 2,
  "hokkaido-shikisai-no-oka-biei": 2,
  "hokkaido-hokuryu-sunflower": 2,
  "hokkaido-maruyama-zoo": 2,
  "hokkaido-noboribetsu-bear-park": 2,
  "hokkaido-escon-field": 2,
  "hokkaido-noboribetsu-date-jidaimura": 2,
  "hokkaido-abashiri-aurora-ryuhyo": 2,
  "hokkaido-furano-biei-norokko": 2,
  "hokkaido-toyako-longrun-hanabi": 2,
  "hokkaido-monbetsu-ryuhyo-matsuri": 2,
  "hokkaido-otaru-ushio-hanabi": 2,
  "hokkaido-sapporo-white-illumi": 2,
  "hokkaido-hakodate-christmas-fantasy": 2,
  "hokkaido-rising-sun-rock-festival": 2,

  // 食 food
  "hokkaido-nijo-market-sapporo": 2,
  "hokkaido-hakodate-asaichi": 2,
  "hokkaido-daruma-jingisukan-honten": 2,
  "hokkaido-sapporo-beer-garden": 2,
  "hokkaido-shiroi-koibito-park": 2,
  "hokkaido-rokkatei-obihiro-honten": 2,
  "hokkaido-letao-otaru-honten": 2,
  "hokkaido-sumire-nakajima": 2,
  "hokkaido-daimon-yokocho-hakodate": 2,
  "hokkaido-butadon-ichibantei-obihiro": 2,
  "hokkaido-asahikawa-ramen-village": 2,

  // 住 lodging
  "hokkaido-noboribetsu-daiichi-takimotokan": 2,
  "hokkaido-hoshino-resort-tomamu": 2,
  "hokkaido-hilton-niseko-village": 2,
  "hokkaido-rusutsu-resort": 2,
  "hokkaido-windsor-toya-resort": 2,
  "hokkaido-jozankei-shogetsu-grand": 2,

  // 行 transport
  "hokkaido-jr-hokkaido-rail-pass-7day": 2,
  "hokkaido-sl-kushiro-winter": 2,
  "hokkaido-ryuhyo-monogatari": 2,
  "hokkaido-kushiro-shitsugen-norokko": 2,
  "hokkaido-mt-hakodate-ropeway": 2,
  "hokkaido-asahidake-ropeway": 2,

  // 衣 fashion
  "hokkaido-otaru-sakaimachi-dori": 2,
  "hokkaido-otaru-kitaichi-glass": 2,
  "hokkaido-hakodate-kanemori-redbrick": 2,
  "hokkaido-sapporo-tanuki-koji": 2,
  "hokkaido-shiraoi-upopoy-textile": 2,

  // 育 culture
  "hokkaido-sapporo-matsuri": 2,
  "hokkaido-esashi-ubagami-togyosai": 2,
  "hokkaido-shiraoi-ainu-traditional-life": 2, // ウポポイ
  "hokkaido-obihiro-banei": 2,
  "hokkaido-sapporo-beer-museum": 2,
  "hokkaido-sapporo-moerenuma": 2,
  "hokkaido-abashiri-kangoku-hakubutsukan": 2,
  "hokkaido-sapporo-tokeidai": 2,
  "hokkaido-kyu-hokkaido-chocho-akarenga": 2,
  "hokkaido-matsumae-castle": 2,
  "hokkaido-otaru-asahikawa-golden-kamuy": 2,

  // ── 京都府 食類 (Sprint 14.1) ──────────────────
  // Rank 3:京都食文化的國際 / 千年級代表
  "kyoto-ichimonjiya-wasuke": 3, // 一文字屋和輔(1000 年・日本最古飲食店候補)
  "kyoto-toraya-ichijo": 3, // とらや(1520・皇室御用達 500 年)
  "kyoto-kawabata-doki": 3, // 川端道喜(室町幕府御用達 600 年)
  "kyoto-nikenchaya-nakamuraro": 3, // 二軒茶屋中村楼(1502・八坂神社最古料亭)
  "kyoto-yamabana-heihachi-chaya": 3, // 山ばな平八茶屋(1576)
  "kyoto-hyotei-honten": 3, // 瓢亭(三星・川端康成『古都』)
  "kyoto-kikunoi-honten": 3, // 菊乃井本店(三星・村田吉弘・和食 UNESCO)
  "kyoto-kichicho-arashiyama": 3, // 京都吉兆嵐山本店(三星・湯木貞一)
  "kyoto-michelin-three-star-mizai": 3, // 未在(三星・吉武)
  "kyoto-gekkeikan-okura-museum": 3, // 月桂冠大倉記念館(1637・日本最古酒造)
  "kyoto-nishiki-ichiba": 3, // 錦市場(京の台所 410 年)
  "kyoto-kamogawa-noryouyuka": 3, // 鴨川納涼床(京都夏の象徴)
  "kyoto-honke-owariya-honten": 0, // 1465 京都最古蕎麦,2026-01-11 長期休業 → 暫降 0,復活時改回 3
  "kyoto-kameya-kiyonaga": 3, // 亀屋清永(1617 清浄歓喜団・密教菓子継承唯一)
  // Phase 2 加入(2026-04-25)
  "kyoto-kameya-mutsu": 3, // 亀屋陸奥(1421・604 年・京都最古和菓子司候補・西本願寺御用達)
  "kyoto-miyamasou": 3, // 美山荘(1895 摘草料理発祥・二星・日本料理アカデミー三巨頭)
  "kyoto-shibakyu-ohara": 3, // 志ば久大原(平安期 1180 建礼門院しば漬発祥地)
  "kyoto-gion-sasaki": 3, // ぎおんさゝ木(三星・現代京懐石若手代表)

  // Rank 2:京都食文化的地區代表
  // 京菓子・茶寮
  "kyoto-sasaya-iori-honten": 2, // 笹屋伊織(1716 弘法どら焼)
  "kyoto-tsuruya-yoshinobu-honten": 2, // 鶴屋吉信(1803 菓遊茶屋)
  "kyoto-demachi-futaba": 2, // 出町ふたば(1899 名代豆餅)
  "kyoto-ippodo-honten": 2, // 一保堂茶舗(1717 嘉木茶寮)
  "kyoto-mangetsu-ajari": 2, // 満月阿闍梨餅(1856)
  "kyoto-shogoin-yatsuhashi-honten": 2, // 聖護院八ツ橋(1689)
  // 茶寮・抹茶
  "kyoto-nakamura-tokichi-uji": 2, // 中村藤吉宇治本店(1854 国重文)
  "kyoto-tsujiri-honten-gion": 2, // 茶寮都路里祇園本店
  // 湯豆腐・湯葉
  "kyoto-junsei-nanzenji": 2, // 順正南禅寺
  "kyoto-okutan-kiyomizu": 2, // 奥丹清水(1645)
  "kyoto-saga-tofu-morika": 2, // 嵯峨豆腐森嘉(1781・川端康成『古都』)
  // 京寿司・京懐石
  "kyoto-izuu": 2, // いづう(1781 鯖姿寿司元祖)
  // ラーメン
  "kyoto-daiichi-asahi-honten": 2, // 第一旭たかばし
  "kyoto-shinpukusaikan-honten": 2, // 新福菜館(1938)
  // 老舗洋食・京すきやき
  "kyoto-mishima-tei-honten": 2, // 三嶋亭(1873 京すきやき発祥)
  "kyoto-toyotei-kitayama": 2, // 東洋亭(1897 京都洋食最古)
  // 老舗喫茶
  "kyoto-inoda-coffee-sanjo": 2, // イノダコーヒ三条(1940)
  "kyoto-shinshindo-kyoto-univ": 2, // 進々堂京大北門前(1913)
  "kyoto-francois-kissashitsu": 2, // フランソア(1934 国登録文化財)
  // 嵐山 + うなぎ
  "kyoto-hirokawa-arashiyama": 2, // 廣川嵐山(一星 うなぎ)
  // 七味
  "kyoto-shichimiya-honpo": 2, // 七味家本舗(1655 清水寺参道)
  // 縁日
  "kyoto-koboichi-toji": 2, // 弘法市(月 21 日東寺 1000 店)
  "kyoto-tenjin-ichi-kitano": 2, // 天神市(月 25 日北野天満宮)
  // 飾屋(あぶり餅もう一軒・一文字屋向かい)
  "kyoto-kazariya-aburi-mochi": 2,
  // Phase 2 加入 — 京菓子老舗
  "kyoto-kagizen-yoshifusa": 2, // 鍵善良房(1726 八坂葛切)
  "kyoto-oimatsu-kitano": 2, // 老松北野(1908 表千家裏千家御用達)
  "kyoto-sentaro-honten": 2, // 仙太郎本店(1886 ご存じ最中)
  "kyoto-kogetsu-honten": 2, // 鼓月(1945 千寿せんべい)
  // Phase 2 加入 — 京漬物
  "kyoto-nishiri-honten": 2, // 西利(1940 京漬物代表ブランド)
  "kyoto-murakamiju-honten": 2, // 村上重本店(1832 千枚漬発祥)
  // Phase 2 加入 — 京風中華
  "kyoto-houmai-kawaramachi": 2, // 鳳舞河原町本店(1944 京風中華元祖)
  // Phase 3 加入(2026-04-25)— Tier S 文化財級
  "kyoto-ryokujuan-shimizu": 3, // 緑寿庵清水(1847 唯一手作金平糖専門 178 年)
  "kyoto-shimabara-sumiya": 3, // 嶋原角屋(1641 国重文 京揚屋・遊郭文化博物館)
  "kyoto-kinobu-ogata": 3, // 緒方(2003 三星 京懐石若手代表)
  // Phase 3 — 山岳料理
  "kyoto-kibune-hirobun": 2, // 貴船ひろ文(1872 流しそうめん発祥)
  "kyoto-ohara-sanso": 2, // 大原山荘(自然薯料理 + 寂光院散策)
  "kyoto-kurama-yousyufu": 2, // 鞍馬雍洲府(精進料理 鞍馬寺門前)
  // Phase 3 — 京菓子・京懐石・京湯葉
  "kyoto-il-ghiottone": 2, // イル・ギオットーネ(1996 京都イタリアン代表 一星)
  "kyoto-tousuiro-kiyamachi": 2, // 豆水楼木屋町(1975 湯豆腐懐石 中間価格帯)
  // Phase 4 — 京都府全境覆蓋
  "kyoto-tango-taiza-kani-yoshino": 3, // 間人蟹(京懐石冬の頂点・京丹後)
  "kyoto-amanohashidate-tomitaya": 3, // 富田屋天橋立(1707 鯖寿司祖・京鯖寿司起源)
  "kyoto-nagaokakyo-kinsuitei": 3, // 錦水亭(1881 京たけのこ筍懐石発祥)
  "kyoto-miyama-tanba-soba": 2, // 美山かやぶきの里(1993 国重伝建)
  "kyoto-tsurukyo-soba-hieizan": 2, // 鶴喜そば比叡山(1864 世界遺産延暦寺門前)
  "kyoto-omen-ginkakuji": 2, // 銀閣寺おめん(1967 慈照寺世界遺産)
  "kyoto-fushimiinari-nishimura": 2, // 伏見稲荷にしむら亭(1864 きつね 711ad 神社)
  "kyoto-bunnosuke-chaya-ninenzaka": 2, // 文の助茶屋(1909 二寧坂・落語家創業)
  "kyoto-yawata-hashiri-mochi": 2, // 走井餅(1749 石清水八幡宮 859 / 国宝)
  "kyoto-asty-kyoto-station": 2, // ASTY 京都(京都駅 100 店総合)
  "kyoto-maizuru-naval-curry": 2, // 舞鶴海軍カレー(1908 発祥地)
  "kyoto-kameoka-yasai-restaurant": 1, // 亀岡牛(京都唯一和牛・京野菜供給源)— rank 1 縣代表
  // Phase 5 — 完整性 mode RANK_MAP 補
  "kyoto-kamomitarashi-chaya": 3, // 加茂みたらし茶屋(1922 みたらし団子発祥)
  "kyoto-kyotanabe-ikkyu-natto": 3, // 一休寺納豆(1455 一休宗純晩年・酬恩庵)
  "kyoto-kizugawa-wazuka-tea": 2, // 和束茶(京都茶生産量 No.1)
  "kyoto-kissa-shizuka": 2, // 喫茶静香(1937 戦前モダニズム三大)
  "kyoto-madrague-kawaramachi": 2, // マドラグ(コロナ玉子サンド)
  "kyoto-kinshi-masamune": 2, // キンシ正宗(1781 + 堀野記念館)
  "kyoto-tsuki-no-katsura": 2, // 月の桂(1675 にごり酒発祥)
  "kyoto-tsuruya-hachiman": 2, // 鶴屋八幡(1597 京菓子第 2 古舗)
  "kyoto-hayashi-manshodo": 2, // 林万昌堂(1874 京都栗 150 年)
  "kyoto-arashiyama-fukudaya": 2, // 嵐山福田家(1661 渡月橋畔老舗)
  "kyoto-zuihoin-daitokuji": 2, // 大徳寺瑞峯院(1546 国指定庭園)
  "kyoto-tofukuji-soba": 2, // 東福寺前蕎麦(通天橋紅葉)
  "kyoto-demachi-masugata-shotengai": 2, // 出町枡形商店街
  "kyoto-kamigamo-handmade-market": 2, // 上賀茂手づくり市(月 26 日)
  // Phase 6 — 京都府最深部 + 京都隠れ家
  "kyoto-suntory-yamazaki": 3, // サントリー山崎(1923 日本ウイスキー発祥)
  "kyoto-ine-funaya-restaurant": 3, // 伊根の舟屋(国重伝建 230 軒)
  "kyoto-akao-tsukemono": 3, // 赤尾屋(1716 京漬物最古)
  "kyoto-koto-in-daitokuji": 2, // 大徳寺高桐院(細川ガラシャ・楓の参道)
  "kyoto-daisen-in-daitokuji": 2, // 大徳寺大仙院(1509 国指定庭園)
  "kyoto-suppon-daiichi": 2, // 京都すっぽん大市(1688 元禄)
  "kyoto-tempura-yoshikawa": 2, // 天ぷら吉川(一星 1959)
  "kyoto-jyoyo-aotani-bairin": 2, // 城陽青谷梅林(京都府最大梅林)
  "kyoto-oyamazaki-sanso-museum-cafe": 2, // 大山崎山荘美術館(モネ + 待庵近)
  "kyoto-kissa-soiree": 2, // 喫茶ソワレ(1948 ゼリーポンチ)
  "kyoto-kinkakuji-saryo": 2, // 金閣寺前茶寮(世界遺産)
  "kyoto-kyoto-brewing-mukade": 2, // 京都醸造クラフトビール
  "kyoto-tori-shige-shijo": 2, // 鳥重(1897 焼鳥老舗)
  "kyoto-takimoto-mochi": 2, // 瀧本(京都餅三大老舗)

  // ── 京都府 衣類 (Sprint 14.2 Phase 1) ──────────────────
  // Rank 3:京都衣文化的國際 / 千年級代表
  "kyoto-chiso-kimono": 3, // 千總(1555・京友禅最古・無料 gallery)
  "kyoto-eirakuya-hosotsuji-ihee": 3, // 永楽屋(1615・日本最古綿布商・美術館併設)
  "kyoto-karacho-karakami": 3, // 唐長(1624・日本唯一唐紙師・650 版木継承)
  "kyoto-hosoo-nishijin": 3, // 細尾(1688・Dior/Chanel/MET・現代 luxury 化)
  "kyoto-kawashima-selkon-bunka-kan": 3, // 川島織物(1843・明治宮殿・歌舞伎座緞帳)
  "kyoto-tatsumura-bijutsu": 3, // 龍村美術織物(1894・正倉院裂復元・国宝級)
  // Rank 2:京都衣文化的代表
  "kyoto-erizen-kimono": 2, // ゑり善(1584・登録有形文化財・440 年)
  "kyoto-yashironi-kimono": 2, // 矢代仁(1720・室町問屋・能装束)
  "kyoto-tanaka-nao-dye": 2, // 田中直染料店(1733・染料老舗唯一)
  "kyoto-chigiriya-jihei-kimono": 2, // 千切屋治兵衛(1738・室町問屋本家)
  "kyoto-konda-ya-genbei": 2, // 誉田屋源兵衛(1738・山口源兵衛・帯司革命家)
  "kyoto-okaju-komon": 2, // 岡重(1830・京小紋・美術館併設)
  "kyoto-obiya-sutematsu": 2, // 帯屋捨松(1854・西陣最高峰帯司)
  "kyoto-kazurasei-kanzashi": 2, // かづら清老舗(1865・舞妓御用達・祇園)
  "kyoto-tondaya-machiya": 2, // 富田屋(1885・登録有形文化財町家・体験施設)

  // ── 京都府 衣類 (Sprint 14.2 Phase 2-8) ──────────────────
  // Rank 3:京都衣文化的全國級代表
  "kyoto-nishijin-textile-center": 3, // 西陣織会館(西陣 #1 入口)
  "kyoto-traditional-industry-museum": 3, // 伝統産業ミュージアム(73 工芸 hub)
  "kyoto-national-museum-textile": 3, // 京都国立博物館(国立染織)
  "kyoto-yoshioka-natural-dye": 3, // 染司よしおか(法隆寺・正倉院 御用達)
  "kyoto-tango-chirimen-history-museum": 3, // 丹後ちりめん歴史館(発祥地)
  "kyoto-aoi-matsuri": 3, // 葵祭(京都三大祭・最古参)
  "kyoto-jidai-matsuri": 3, // 時代祭(京都三大祭・1000 年装束)
  "kyoto-gion-matsuri-yamaboko": 3, // 祇園祭山鉾(UNESCO 無形文化遺産)
  "kyoto-kaomise-minamiza": 3, // 顔見世興行(1696・京歌舞伎)
  "kyoto-miyako-odori-gion": 3, // 都をどり(1872 春の象徴)
  // Rank 2:京都衣文化的代表
  "kyoto-orinasukan-watabun": 2, // 織成舘 渡文(1936 西陣帯問屋)
  "kyoto-shiori-an-machiya": 2, // 紫織庵(大正町家・長襦袢専門)
  "kyoto-senseiryukan-dye-gallery": 2, // 染清流館(現代名匠展示)
  "kyoto-shibori-museum": 2, // 京都絞り工芸館(京鹿の子絞)
  "kyoto-ryukobo-kumihimo": 2, // 龍工房(京組紐)
  "kyoto-kyo-yuzen-cultural-center": 2, // 丸益西村屋(1905 京友禅染屋)
  "kyoto-baba-senko-kuro": 2, // 馬場染工業(1870 京黒紋付染)
  "kyoto-fujii-shibori": 2, // 藤井絞(1930 京鹿の子絞)
  "kyoto-shozan-resort-yuzen": 2, // しょうざんリゾート(1948 京友禅 + 庭園)
  "kyoto-yumeyakata-kimono-rental": 2, // 夢館(京町家 + 大手 kimono rental)
  "kyoto-kitamura-senshou-rental": 2, // 染匠きたむら(1968 高品質 rental)
  "kyoto-yasuda-nenju-honten": 2, // 安田念珠店(1683 念珠最古参)
  "kyoto-onishitsune-kyo-sensu": 2, // 大西常商店(1818 京扇子)
  "kyoto-miyawaki-baisen-an": 2, // 宮脇賣扇庵(1823 天井絵扇子)
  "kyoto-shoyeido-incense": 2, // 松栄堂(1705 香 老舗・薫習館)
  "kyoto-yamadamatsu-koboku": 2, // 山田松香木店(1772 香木)
  "kyoto-itochu-hakimono": 2, // 伊と忠(1929 京履物総合)
  "kyoto-tayuh-kigyo-tango": 2, // 田勇機業(1923 丹後ちりめん 100 年)
  "kyoto-tamiya-raden": 2, // 民谷螺鈿(Aman/Dior 採用)
  "kyoto-chirimen-kaido-yosano": 2, // ちりめん街道(国伝建)
  "kyoto-cultural-museum": 2, // 京都府京都文化博物館
  "kyoto-nomura-museum": 2, // 野村美術館(能装束)
  "kyoto-hosomi-museum": 2, // 細見美術館(琳派・小袖)
  "kyoto-kamogawa-odori-pontocho": 2, // 鴨川をどり(先斗町)
  "kyoto-kyo-odori-miyagawacho": 2, // 京おどり(宮川町)
  "kyoto-kitano-odori-kamishichiken": 2, // 北野をどり(上七軒・五花街最古参)
  "kyoto-gion-odori-east": 2, // 祇園をどり(祇園東・秋唯一)
  "kyoto-hassaku-gion": 2, // 八朔(8/1 五花街黒紋付挨拶)
  "kyoto-okamoto-kimono-rental": 2, // 岡本(清水寺・1972 京履物店ルーツ)

  // ── 京都府 衣類 (Sprint 14.2 Phase 9 補遺) ──────────────────
  // Rank 2:京都衣文化的代表(散策路線・行事・装束専門)
  "kyoto-muromachi-dori-kimono-district": 2, // 室町通呉服問屋街(老舗 6+ 集中)
  "kyoto-nishijin-walking-guide": 2, // 西陣エリア散策(550 年テキスタイル聖地)
  "kyoto-gion-hanami-koji": 2, // 祇園花見小路(花街中心)
  "kyoto-toshiya-sanjusangendo": 2, // 三十三間堂通し矢(振袖 弓道大会)
  "kyoto-kamigamo-kurabe-uma": 2, // 上賀茂競馬(寛治 7・900+ 年)
  "kyoto-gosho-special-opening": 2, // 京都御所春秋特別公開(公家装束)
  "kyoto-daitokuji-tea-ceremony": 2, // 大徳寺塔頭茶会(千利休発祥)
  "kyoto-kuroda-shozoku": 2, // 黒田装束店(神社・能装束専門)

  // ── 京都府 住類 (Sprint 14.3 Phase 1-8) ──────────────────
  // Rank 3:京都住文化的全國/世界級
  "kyoto-tawaraya-ryokan": 3, // 俵屋(1709 京都最古・Steve Jobs)
  "kyoto-aman-kyoto": 3, // Aman Kyoto(2019・世界最高峰リゾート)
  "kyoto-ritz-carlton-kyoto": 3, // Ritz-Carlton Kyoto(2014・鴨川沿)
  "kyoto-four-seasons-kyoto": 3, // Four Seasons(2016・積翠園)
  "kyoto-westin-miyako-kyoto": 3, // ウェスティン都ホテル(1890・京都最古洋式)
  "kyoto-hotel-okura": 3, // 京都ホテルオークラ(1888・常盤ホテル)
  // Rank 2:京都住文化的代表
  "kyoto-hiiragiya-ryokan": 2, // 柊家(1818・川端康成)
  "kyoto-sumiya-ryokan": 2, // 炭屋(1804・京旅館御三家)
  "kyoto-kanamean-nishitomiya": 2, // 要庵西富家(1849)
  "kyoto-seikoro-ryokan": 2, // 晴鴨楼(1831)
  "kyoto-tsuruseiryokan": 2, // 鶴清(1923 鴨川納涼床)
  "kyoto-park-hyatt-kyoto": 2, // Park Hyatt(2019・八坂の塔)
  "kyoto-mitsui-kyoto": 2, // The Mitsui(2020・温泉付)
  "kyoto-hyatt-regency-kyoto": 2, // Hyatt Regency(2006・東山七条)
  "kyoto-suiran-arashiyama": 2, // 翠嵐(2015 嵐山)
  "kyoto-thousand-kyoto": 2, // The Thousand Kyoto(2019 京都駅 2 分)
  "kyoto-hotel-celestine-gion": 2, // Hotel Celestine(2017 祇園)
  "kyoto-good-nature-hotel": 2, // GOOD NATURE HOTEL(2020 WELL Gold)
  "kyoto-iori-machiya-stays": 2, // 庵 Iori(1990s Alex Kerr)
  "kyoto-no-ondokoro-wacoal": 2, // 京の温所(2018 Wacoal)
  "kyoto-sowaka-gion": 2, // SOWAKA(2019 祇園 boutique)
  "kyoto-myoshinji-torin-in": 2, // 妙心寺東林院(沙羅双樹)
  "kyoto-enryakuji-kaikan": 2, // 延暦寺会館(世界遺産)
  "kyoto-chionin-wajun-kaikan": 2, // 知恩院和順会館(国宝山門)
  "kyoto-miyamasou-hanase": 2, // 美山荘(1895 摘草料理 ミシュラン二星)
  "kyoto-kyotango-yuhigaura-onsen": 2, // 夕日浦温泉(松葉ガニ)
  "kyoto-tango-taiza-matsuba": 2, // 間人温泉(間人ガニブランド)
  "kyoto-amanohashidate-monjuso": 2, // 天橋立 文珠荘(1959・日本三景)
  "kyoto-kibune-fujiya": 2, // 貴船 ふじや(川床)
  "kyoto-yunohana-onsen-sumiya": 2, // 湯の花温泉 すみや亀峰菴(明智光秀古湯)
  "kyoto-spring-cherry-blossom-stays": 2, // 春花見宿ガイド
  "kyoto-autumn-momiji-stays": 2, // 秋紅葉宿ガイド
  "kyoto-hosoo-house": 2, // HOSOO HOUSE(西陣テキスタイル 100%)
  "kyoto-lodging-area-station": 2, // 京都駅周辺ガイド
  "kyoto-lodging-area-gion": 2, // 祇園・東山ガイド
  "kyoto-lodging-area-arashiyama": 2, // 嵐山・嵯峨野ガイド

  // ── 京都府 住類 (Sprint 14.3 Phase 9-14 拡充) ──────────────────
  // Rank 2:京都住の代表
  "kyoto-yoshida-sanso": 2, // 吉田山荘(1932 旧東伏見宮家)
  "kyoto-yamabana-heihachi-ryokan": 2, // 山ばな平八茶屋(1576 食類連動)
  "kyoto-arashiyama-togetsu-tei": 2, // 渡月亭(1924 嵐山温泉)
  "kyoto-arashiyama-benkei": 2, // 嵐山辨慶
  "kyoto-tokyu-hotel": 2, // 京都東急ホテル(1986)
  "kyoto-ana-crowne-plaza": 2, // ANAクラウンプラザ(1986 二条城)
  "kyoto-rihga-royal": 2, // リーガロイヤル(1969 京都駅近 大規模)
  "kyoto-arashiyama-sagasawa": 2, // 嵯峨沢館(1934 大覚寺)
  "kyoto-ninnaji-omuro-kaikan": 2, // 仁和寺御室会館(世界遺産)
  "kyoto-tofukuji-tatchu": 2, // 東福寺塔頭(紅葉聖地)
  "kyoto-rakuro-share-hotels": 2, // RAKURO 京都(2016 SHARE HOTELS)
  "kyoto-blossom-hotel": 2, // THE BLOSSOM(2020 清水寺)
  "kyoto-yachiyo-nanzen-ji": 2, // 八千代南禅寺(文政期・湯豆腐文化圏)
  "kyoto-kibune-hyoue": 2, // 貴船 兵衛(川床)
  "kyoto-couple-lodging": 2, // カップル旅推奨ガイド
  "kyoto-family-lodging": 2, // 家族旅推奨ガイド
  "kyoto-breakfast-stay": 2, // 京都の朝食宿

  // ── 京都府 住類 (Sprint 14.3 Phase 15-17 拡充 → 120) ──────────────────
  "kyoto-cross-hotel": 2, // クロスホテル京都(2019 河原町三条)
  "kyoto-royal-park-umekoji": 2, // ザ・ロイヤルパーク京都梅小路(2022)
  "kyoto-gate-hotel-takasegawa": 2, // ザ・ゲートホテル京都高瀬川(2020 ヒューリック)
  "kyoto-takao-momijiya-honkan": 2, // 高雄もみじ家本館(紅葉名所)
  "kyoto-takao-momijiya-bekkan": 2, // 高雄もみじ家別館川の庵
  "kyoto-takao-area-lodging": 2, // 高雄area guide
  "kyoto-arashiyama-rankyokan": 2, // 嵐峡館(嵐山山中隠れ家)

  // ── 京都府 行類 (Sprint 14.4 Phase 1-9) ──────────────────
  // Rank 3:京都行文化的全國/世界級
  "kyoto-jr-kyoto-station": 3, // JR京都駅(全京都交通中枢)
  "kyoto-randen-arashiyama": 3, // 嵐電(1910・京都路面電車)
  "kyoto-eizan-railway": 3, // 叡山電鉄(きらら + もみじトンネル)
  "kyoto-sagano-romantic-train": 3, // 嵯峨野トロッコ(京都西部観光列車代表)
  "kyoto-bus-one-day-pass": 3, // 市バス1日券(京都観光必携)
  "kyoto-mk-taxi-service": 3, // MK タクシー(京都発祥1960・国際的)
  "kyoto-haruka-kansai": 3, // JRはるか(関空→京都直結)
  // Rank 2:京都行文化的代表
  "kyoto-keihan-line": 2, // 京阪本線(鴨川沿)
  "kyoto-hankyu-kyoto-line": 2, // 阪急京都線(大阪直結)
  "kyoto-subway-karasuma": 2, // 地下鉄烏丸線
  "kyoto-subway-tozai": 2, // 地下鉄東西線
  "kyoto-tango-railway": 2, // 京都丹後鉄道(北部観光)
  "kyoto-subway-bus-pass": 2, // 地下鉄+バス1日券
  "kyoto-randen-one-day": 2, // 嵐電1日券
  "kyoto-eizan-one-day": 2, // 叡電1日券
  "kyoto-keihan-one-day": 2, // 京阪1日券
  "kyoto-kansai-thru-pass": 2, // 関西スルーパス
  "kyoto-kansai-airport-limousine": 2, // 関空リムジン
  "kyoto-itami-airport-limousine": 2, // 伊丹リムジン
  "kyoto-mk-taxi-airport": 2, // MK定額空港
  "kyoto-tango-no-umi-aomatsu": 2, // 丹後の海あおまつ(水戸岡鋭治設計)
  "kyoto-tango-no-umi-akamatsu": 2, // 丹後の海あかまつ
  "kyoto-tango-no-umi-kuromatsu": 2, // 丹後の海くろまつ(走るレストラン)
  "kyoto-sky-hop-bus": 2, // SKY HOP BUS(初訪日観光客向)
  "kyoto-access-arashiyama": 2, // 嵐山アクセスガイド
  "kyoto-access-kurama-kibune": 2, // 鞍馬貴船アクセス
  "kyoto-access-fushimi-inari": 2, // 伏見稲荷アクセス
  "kyoto-access-amanohashidate": 2, // 天橋立アクセス
  "kyoto-hub-station": 2, // 京都駅 hub
  "kyoto-hub-shijo-kawaramachi": 2, // 四条河原町 hub
  "kyoto-hub-demachiyanagi": 2, // 出町柳 hub
  "kyoto-yasaka-taxi": 2, // ヤサカ(四つ葉伝説)
  "kyoto-walking-philosophy-path": 2, // 哲学の道(西田幾多郎)
  "kyoto-walking-bamboo-grove": 2, // 嵯峨野竹林(京都鉄板撮影)
  "kyoto-walking-kamogawa": 2, // 鴨川河岸散策
  "kyoto-seasonal-aoi-matsuri-traffic": 2, // 葵祭交通規制
  "kyoto-seasonal-gion-matsuri-traffic": 2, // 祇園祭交通規制
  "kyoto-seasonal-kurama-fire-festival": 2, // 鞍馬火祭夜行
  "kyoto-early-morning-fushimi": 2, // 伏見稲荷早朝(独占撮影)
  "kyoto-early-morning-temples": 2, // 京都早朝寺社アクセス

  // ── 京都府 行類 (Sprint 14.4 Phase 10-15 拡充) ──────────────────
  "kyoto-bus-100-tourist-loop": 2, // 観光急行 100 系統
  "kyoto-bus-101-kinkakuji": 2, // 観光急行 101 系統
  "kyoto-bus-206-higashiyama": 2, // 観光急行 206 系統(東山ループ)
  "kyoto-hieizan-cable": 2, // 比叡山ケーブル(1925)
  "kyoto-hozugawa-kudari": 3, // 保津川下り(嵯峨野トロッコ連動)
  "kyoto-arashiyama-rickshaw": 2, // 嵐山人力車
  "kyoto-icoca-card": 3, // ICOCA(関西 IC 必携)
  "kyoto-jr-pass": 2, // JR Pass(訪日客)
  "kyoto-kansai-wide-pass": 2, // JR 関西 Wide Pass
  "kyoto-spring-arashiyama-traffic": 2, // 桜時期混雑回避
  "kyoto-autumn-higashiyama-traffic": 2, // 紅葉時期対策
  "kyoto-station-info-center": 2, // 京なび観光案内所
  "kyoto-coin-locker-strategy": 2, // コインロッカー戦略
  "kyoto-keihan-keishin-line": 2, // 京阪京津線
  "kyoto-kintetsu-kyoto-line": 2, // 近鉄京都線(奈良アクセス)
  "kyoto-jr-biwako-line": 2, // JR 琵琶湖線

  // ── 京都府 育類 (Sprint 14.5 Phase 1-11) ──────────────────
  // Rank 3:京都育文化的世界級
  "kyoto-kiyomizu-dera": 3, // 清水寺(世界遺産・年 530 万人)
  "kyoto-kinkaku-ji": 3, // 金閣寺(世界遺産・京都象徴)
  "kyoto-ginkaku-ji": 3, // 銀閣寺(世界遺産・東山文化)
  "kyoto-ryoan-ji": 3, // 龍安寺(世界遺産・石庭)
  "kyoto-toji": 3, // 東寺(世界遺産・京都最古五重塔)
  "kyoto-nishi-honganji": 3, // 西本願寺(世界遺産・国宝群)
  "kyoto-tenryu-ji": 3, // 天龍寺(世界遺産・嵐山借景)
  "kyoto-byodo-in": 3, // 平等院(世界遺産・10 円玉)
  "kyoto-saiho-ji": 3, // 西芳寺(世界遺産・苔寺)
  "kyoto-shimogamo-jinja": 3, // 下鴨神社(世界遺産・葵祭)
  "kyoto-kamigamo-jinja": 3, // 上賀茂神社(世界遺産)
  "kyoto-enryaku-ji": 3, // 延暦寺(世界遺産・天台総本山)
  "kyoto-nijo-jo": 3, // 二条城(世界遺産・大政奉還)
  "kyoto-fushimi-inari-taisha": 3, // 伏見稲荷(千本鳥居・全国総本宮)
  "kyoto-yasaka-jinja": 3, // 八坂神社(祇園祭)
  "kyoto-aoi-matsuri-culture": 3, // 葵祭(三大祭最古)
  "kyoto-gion-matsuri-culture": 3, // 祇園祭(UNESCO)
  "kyoto-jidai-matsuri-culture": 3, // 時代祭(三大祭)
  "kyoto-gozan-okuribi": 3, // 五山送り火(京都夏終焉)
  "kyoto-kyoto-national-museum": 3, // 京都国立博物館
  "kyoto-kyoto-gosho": 3, // 京都御所
  "kyoto-katsura-rikyu": 3, // 桂離宮
  "kyoto-shugaku-in-rikyu": 3, // 修学院離宮
  "kyoto-genji-monogatari-uji": 3, // 源氏物語宇治十帖
  "kyoto-kyoto-animation": 3, // 京アニ
  "kyoto-amanohashidate-culture": 3, // 天橋立(日本三景)
  "kyoto-uji-tea-culture": 3, // 宇治茶文化
  // Rank 2:京都育文化的代表
  "kyoto-ninna-ji": 2, "kyoto-uji-kami-jinja": 2, "kyoto-daigo-ji": 2, "kyoto-kozan-ji": 2,
  "kyoto-kitano-tenmangu": 2, "kyoto-heian-jingu": 2, "kyoto-chion-in": 2, "kyoto-nanzen-ji": 2,
  "kyoto-kennin-ji": 2, "kyoto-tofuku-ji": 2, "kyoto-sanjusangen-do": 2, "kyoto-eikan-do": 2,
  "kyoto-daitoku-ji": 2, "kyoto-myoshin-ji": 2, "kyoto-sanzen-in": 2, "kyoto-jakko-in": 2,
  "kyoto-kurama-dera": 2, "kyoto-kifune-jinja": 2, "kyoto-matsuo-taisha": 2,
  "kyoto-jingo-ji": 2, "kyoto-honno-ji": 2, "kyoto-higashi-honganji": 2, "kyoto-yoshimine-dera": 2,
  "kyoto-koetsu-ji": 2, "kyoto-genko-an": 2, "kyoto-kodai-ji": 2,
  "kyoto-kurama-fire-festival-culture": 2, "kyoto-mibu-kyogen": 2, "kyoto-daigo-hanae-shiki": 2,
  "kyoto-kyocera-museum": 2, "kyoto-mokoma": 2, "kyoto-cultural-museum-culture": 2,
  "kyoto-manga-museum": 2, "kyoto-railway-museum": 2,
  "kyoto-sento-gosho": 2, "kyoto-fushimi-momoyama-ato": 2, "kyoto-fukuchiyama-jo": 2,
  "kyoto-kawabata-koto": 2, "kyoto-mishima-kinkaku": 2, "kyoto-tanizaki-saikaku": 2,
  "kyoto-daikaku-ji": 2, "kyoto-jojakkoji": 2, "kyoto-rakushisha": 2, "kyoto-nison-in": 2,
  "kyoto-seiryo-ji": 2, "kyoto-adashino-nenbutsu-ji": 2, "kyoto-gio-ji": 2,
  "kyoto-ine-funaya": 2, "kyoto-fushimi-sake": 2, "kyoto-maizuru-redbrick": 2,
  "kyoto-kiyomizu-yaki": 2, "kyoto-omote-senke": 2, "kyoto-ura-senke": 2, "kyoto-ikenobo": 2,
  "kyoto-kanze-ryu": 2, "kyoto-shigeyama-kyogen": 2, "kyoto-kongo-ryu": 2, "kyoto-saga-goryu": 2,
  "kyoto-hibike-euphonium-uji": 2,

  // ── 京都府 育類 (Sprint 14.5 Phase 12-22 拡充) ──────────────────
  "kyoto-mannpukuji-uji": 2, // 萬福寺(黄檗・隠元由来)
  "kyoto-chishaku-in-culture": 3, // 智積院(国宝長谷川等伯障壁画)
  "kyoto-ryozen-gokoku": 2, // 京都霊山護国神社(坂本龍馬墓)
  "kyoto-shoren-in": 2, // 青蓮院門跡(夜間ライトアップ)
  "kyoto-yasaka-pagoda": 3, // 八坂の塔(京都景観象徴)
  "kyoto-yasui-konpira": 2, // 安井金比羅宮(縁切)
  "kyoto-jonangu": 2, // 城南宮(春の山梅)
  "kyoto-shinsen-en": 2, // 神泉苑(京都最古庭園)
  "kyoto-rozan-ji": 2, // 廬山寺(紫式部邸跡)
  "kyoto-senbon-shaka-do": 2, // 千本釈迦堂(京都最古現存仏堂)
  "kyoto-kogen-ji": 2, // 圓光寺(十牛之庭)
  "kyoto-shisen-do": 2, // 詩仙堂(石川丈山)
  "kyoto-manshu-in": 2, // 曼殊院門跡
  "kyoto-hosen-in": 2, // 宝泉院(額縁庭園)
  "kyoto-koto-in": 2, // 高桐院(細川ガラシャ)
  "kyoto-daisen-in": 3, // 大仙院(三大名園)
  "kyoto-ryogen-in": 2, // 龍源院(5 庭園)
  "kyoto-zuiho-in": 2, // 瑞峯院(重森三玲)
  "kyoto-taizo-in": 2, // 退蔵院(瓢鮎図国宝)
  "kyoto-toshi-in": 2, // 東林院(沙羅双樹)
  "kyoto-sanpo-in": 3, // 三宝院(国宝書院 + 名勝)
  "kyoto-kodaiji-entoku-in": 2, // 圓徳院
  "kyoto-fukuda-museum": 2, // 福田美術館
  "kyoto-saga-arashiyama-bunka-kan": 2, "kyoto-raku-museum": 2, "kyoto-hihakkan": 2,
  "kyoto-toban-meiga-no-niwa": 2, "kyoto-fuzoku-museum": 2, "kyoto-sumiya-shimabara": 2,
  "kyoto-gion-corner": 2, "kyoto-murin-an": 2,
  "kyoto-maruyama-park": 2, "kyoto-botanical-garden": 2,
  "kyoto-mushakoji-senke": 2, "kyoto-yosa-buson": 2, "kyoto-kitaoji-rosanjin": 2,
  "kyoto-mori-ogai-takase": 2, "kyoto-shiba-ryoma-teradaya": 3, // 寺田屋(龍馬・SNS)
  "kyoto-jonangu-ume": 2, "kyoto-mifune-matsuri": 2, "kyoto-takigi-noh": 2,
  "kyoto-shichi-fukujin-meguri": 2, "kyoto-kitano-baikasai": 2,
  "kyoto-yasaka-okera": 2, "kyoto-chion-in-joya-no-kane": 3, // 知恩院除夜の鐘(NHK)
  "kyoto-yasaka-hatsumode": 2, "kyoto-fushimi-hatsumode": 2,
  "kyoto-shiramine-jingu": 2, "kyoto-imamiya-jinja": 2, "kyoto-nonomiya-jinja": 2,
  "kyoto-yasaka-koshindo": 2, "kyoto-keage-incline": 2, "kyoto-tetsugaku-koen": 2,
  "kyoto-eikando-momiji-night": 3, // 永観堂紅葉夜間(京都鉄板)
  "kyoto-kodaiji-night-momiji": 2, "kyoto-keihin-bunko": 2,
  "kyoto-suntory-yamazaki-culture": 3, // サントリー山崎(日本ウイスキー発祥)
  "kyoto-asahi-oyamazaki": 2, "kyoto-kawai-kanjiro-house": 2,

  // ── 京都府 育類 (Sprint 14.5 Phase 23-26 補) ──────────────────
  "kyoto-sannei-zaka": 3, // 産寧坂(伝建・観光地代表)
  "kyoto-gion-shimbashi": 2, "kyoto-saga-toriimoto": 2, "kyoto-kamigamo-shake-machi": 2,
  "kyoto-kanji-in": 2, "kyoto-rishou-in": 2,
  "kyoto-ikedaya-jiken-ato": 2, "kyoto-nijo-jin-ya": 2, "kyoto-keage-power-station": 2,
  "kyoto-shoshidai-ato": 2, "kyoto-oharano-jinja": 2, "kyoto-kasagi-dera": 2,
  "kyoto-ao-komyo-ji": 2, "kyoto-yokoku-ji": 2, "kyoto-tango-kofungun": 2,
  "kyoto-motoise-geku": 2, "kyoto-ujigawa-haryu": 2,
  "kyoto-kyotographie": 2, "kyoto-experiment-festival": 2, "kyoto-international-film-festival": 2,
  "kyoto-uzumasa-eigamura": 3, // 東映太秦映画村(時代劇映画聖地)
  "kyoto-koryu-ji": 3, // 広隆寺(京都最古候補・国宝弥勒)
  "kyoto-shimogamo-tadasu": 2,
  "kyoto-natsume-soseki-grass": 2, "kyoto-tanizaki-inei-raisan": 2, "kyoto-nagai-kafu-kyoto": 2,
  "kyoto-machiya-machizukuri-fund": 2,
  "kyoto-central-market": 2, "kyoto-sosui-museum": 2,
  "kyoto-ranen-walking": 2, "kyoto-nishijin-walking-culture": 2,
  "kyoto-jingo-ji-mushaen": 2, "kyoto-fukuchiyama-sato-taisei": 2,
  "kyoto-kongo-en-garden": 0, // generic 庭園 entry
  "kyoto-shomei-fukuhara": 0, // 写真家集合 — 抽象
  "kyoto-kyoshi-kaikan": 0, // 別館 — generic

  // ── 京都府 楽類 (Sprint 14.7 Phase 1-8) ──────────────────
  // Rank 3:京都楽の代表
  "kyoto-sakura-best-5-guide": 3, // 京都桜ベスト 5
  "kyoto-momiji-best-5-guide": 3, // 京都紅葉ベスト 5
  "kyoto-kamogawa-yuka-summer": 3, // 鴨川納涼床(夏京都鉄板)
  "kyoto-aquarium": 3, // 京都水族館
  "kyoto-shi-zoo": 3, // 京都市動物園(日本第二古)
  "kyoto-eigamura-entertainment": 3, // 太秦映画村
  "kyoto-tower-night-view": 3, // 京都タワー
  "kyoto-rohm-theatre": 3, // ロームシアター京都
  "kyoto-minamiza-kabuki": 3, // 南座(歌舞伎)
  // Rank 2:京都楽の代表
  "kyoto-gosho-sakura": 2, "kyoto-yawata-sewaridutsumi": 2, "kyoto-kiyamachi-yozakura": 2,
  "kyoto-kamogawa-sakura": 2, "kyoto-daigo-yozakura": 2, "kyoto-nijo-jo-sakura": 2,
  "kyoto-keage-sakura": 2, "kyoto-omuro-zakura": 2, "kyoto-sakura-calendar": 2,
  "kyoto-momiji-calendar": 2, "kyoto-arashiyama-momiji": 2, "kyoto-ohara-momiji": 2,
  "kyoto-takao-momiji": 2, "kyoto-tofukuji-tsutenkyo-momiji": 2,
  "kyoto-uji-kawa-fireworks": 2, "kyoto-maizuru-fireworks": 2,
  "kyoto-amanohashidate-fireworks": 2, "kyoto-kameoka-heiwa-hanabi": 2, "kyoto-yawata-hanabi": 2,
  "kyoto-arashiyama-hanatouro-history": 2, "kyoto-higashiyama-hanatouro-history": 2,
  "kyoto-nijo-jo-aki-lightup": 2, "kyoto-kiyomizu-night-lightup": 2, "kyoto-station-illumination": 2,
  "kyoto-orgeru-museum": 2, "kyoto-kagaku-center": 2,
  "kyoto-sanga-fc": 2, "kyoto-hannariis": 2, "kyoto-keibajo": 2, "kyoto-marathon": 2,
  "kyoto-concert-hall": 2,
  "kyoto-firefly-watching": 2, "kyoto-ajisai-spots": 2, "kyoto-ume-spots": 2,
  "kyoto-zazen-experience": 2, "kyoto-asakatsu-guide": 2,

  // ── 京都府 楽類 (Sprint 14.7 Phase 9-12) ──────────────────
  // Rank 3:世界遺産・日本三景・最大手の代表
  "kyoto-tenryuji-sakura": 3, // 世界遺産・嵐山
  "kyoto-osawa-pond-sakura": 3, // 世界遺産大覚寺・平安最古林泉
  "kyoto-heian-jingu-shin-en-sakura": 3, // 紅しだれ・『細雪』
  "kyoto-ginkakuji-momiji": 3, // 世界遺産
  "kyoto-ebisuya-jinrikisha-arashiyama": 3, // 日本人力車最大手
  "kyoto-eizan-kirara-koyo-tunnel": 3, // 京都紅葉名物
  "kyoto-amanohashidate-cycling": 3, // 日本三景体験
  // Rank 2:regional/local 名所
  "kyoto-nakaragi-no-michi-sakura": 2, "kyoto-botanical-garden-sakura": 2,
  "kyoto-keage-incline-sakura": 2, "kyoto-haradanien-sakura": 2, "kyoto-uji-park-sakura": 2,
  "kyoto-gyoen-momiji": 2, "kyoto-botanical-garden-momiji": 2,
  "kyoto-kitano-tenmangu-momiji-en": 2, "kyoto-chion-in-momiji": 2,
  "kyoto-shogun-zuka-seiryuden-momiji": 2,
  "kyoto-samurai-ninja-museum": 2, "kyoto-arashiyama-monkey-park-iwatayama": 2,
  "kyoto-tsukimi-spots-guide": 2, "kyoto-yukimi-spots-guide": 2,
  "kyoto-hotaru-spots-guide": 2, "kyoto-arashiyama-takao-parkway": 2,
  "kyoto-tango-matsushima": 2, "kyoto-yuhigaura-sunset": 2,

  // ── 奈良県 食類 (Sprint 15.1) ──────────────────
  // Rank 3:奈良食の最大代表(発祥・古都名物・最古老舗)
  "nara-kakinoha-zushi-guide": 3, // 柿の葉寿司の代表ガイド
  "nara-naraduke-guide": 3, // 奈良漬発祥(1492 文献初出)
  "nara-miwa-somen-guide": 3, // 三輪 = 素麺発祥地(1200 年前)
  "nara-yoshino-kuzu-guide": 3, // 吉野葛 = 本葛の最高級
  "nara-yamato-cha-guide": 3, // 大和茶 = 茶北限の名産
  "nara-cha-gayu-guide": 3, // 茶粥 = 大和の伝統朝食(1000 年)
  "nara-shoryakuji-sake-origin": 3, // 正暦寺 = 日本清酒発祥地
  "nara-hotel-dining-mikasa": 3, // 1909 奈良ホテル本館・関西の迎賓館
  "nara-hiraso-yoshino-honten": 3, // 平宗 1861 柿の葉寿司の founder brand
  "nara-miwa-yamamoto": 3, // 1717 三輪素麺最古老舗
  "nara-kurokawa-honke": 3, // 1615 吉野本葛の最古老舗
  "nara-imanishi-seibei-haruka": 3, // 1884 春鹿・奈良酒の代表
  // Rank 2:regional/local 名所・有名老舗
  "nara-asuka-nabe-guide": 2, "nara-hiraso-houryuji": 2, "nara-hiraso-naraten": 2,
  "nara-tanaka-gojo-honten": 2, "nara-izasa-nakatani-yoshino": 2,
  "nara-yamasakiya-naraduke": 2, "nara-mori-naraduke-honten": 2, "nara-naraduke-imanishi": 2,
  "nara-ikeri-miwa": 2, "nara-marukatsu-takada-miwa": 2, "nara-morisho-omiwa": 2,
  "nara-tengyokudo-nara-honten": 2, "nara-yasokichi-yoshino": 2, "nara-tengyokudo-yoshino": 2,
  "nara-tsukigase-tea-area": 2, "nara-yamato-niku-dori-guide": 2, "nara-yamato-gyu-guide": 2,
  "nara-yamato-yasai-guide": 2, "nara-edosan-kasugayama": 2, "nara-tsukihitei": 2,
  "nara-shizuka-kamameshi": 2, "nara-awa-naramachi": 2, "nara-yokemise-cha-gayu": 2,
  "nara-umenoyado-shuzo-katsuragi": 2, "nara-yucho-shuzo-kazenomori": 2,
  "nara-miyoshino-jozo-hanatomoe": 2, "nara-mannyo-bunkakan-cafe": 2,
  "nara-yamato-so-guide": 2, "nara-chujo-mochi-taima": 2,
  "nara-yoshino-ayu-guide": 2, "nara-asuka-strawberry-guide": 2, "nara-gojo-kaki-guide": 2,

  // ── 奈良県 食類 Round 2 (Sprint 15.1 Phase 11-17) ──────────────────
  // Rank 3:奈良食の最大代表(全国級・古都象徴・最古老舗)
  "nara-saika-ramen-tenri-honten": 3, // 1968 屋台発・天理スタミナ起源
  "nara-manmando-michinori": 3, // 1689 ぶと饅頭(春日御供菓子)
  "nara-kashiya-ueshokugashi": 3, // 1781 上生菓子の名店
  "nara-nakatani-do-mochiidono": 3, // 高速餅つき・観光名物
  "nara-himuro-jinja-kakigori": 3, // 古代氷文化・夏の象徴
  "nara-todaiji-mae-souvenir-walking": 3, // 東大寺参道食街
  "nara-hotel-the-bar": 3, // 1909 関西最古級バー
  // Rank 2:regional/local 老舗・area guide
  "nara-tenri-stamina-honten": 2, "nara-muteppou-naramachi": 2,
  "nara-dango-sho-yamatotakada": 2, "nara-kasuga-an-satsumayaki": 2,
  "nara-tsuruya-tokuman-todaiji": 2, "nara-nakanishi-yosaburo": 2,
  "nara-mahoroba-daibutsu-pudding": 2,
  "nara-michinoeki-yamatoji-heguri": 2, "nara-michinoeki-uda-ohuda": 2,
  "nara-michinoeki-asuka": 2, "nara-michinoeki-yoshinoji-otou": 2,
  "nara-michinoeki-suginoyu-kawakami": 2, "nara-michinoeki-futakami-taima": 2,
  "nara-naramachi-cafe-walking-guide": 2, "nara-yamato-gyu-yakiniku-guide": 2,
  "nara-mochiidono-shopping-street": 2,
  "nara-omiwa-jinja-sando-food": 2, "nara-houryuji-mae-souvenir": 2,
  "nara-kashihara-jingu-omiyage": 2,
  "nara-kinpusenji-shojin-ryori": 2, "nara-totsukawa-yamasai-village": 2,
  "nara-asuka-kodaimai-guide": 2, "nara-yoshino-kuzumochi-area-guide": 2,
  "nara-coffee-specialty-area-guide": 2, "nara-bakery-area-guide": 2,
  "nara-modern-yamato-creative-area": 2,

  // ── 奈良県 衣類 (Sprint 15.2) ──────────────────
  // Rank 3:奈良衣の最大代表(発祥・最古老舗・世界遺産連携)
  "nara-uchiwa-guide": 3, // 奈良団扇 1300 年伝統
  "nara-ikeda-gankodo": 3, // 池田含香堂 1818 — 唯一の現存老舗
  "nara-zarashi-guide": 3, // 奈良晒 1300 年麻織物
  "nakagawa-masashichi-honten": 3, // 1716 中川政七商店 本店
  "yoshino-washi-guide": 3, // 国栖紙 1300 年伝統
  "kasuga-taisha-juyosho": 3, // 春日大社授与所(世界遺産)
  "todaiji-juyosho": 3, // 東大寺授与所(世界遺産・大仏)
  "horyuji-juyosho": 3, // 法隆寺授与所(現存最古木造)
  "nara-ittobori-guide": 3, // 一刀彫 1000 年伝統
  // Rank 2:regional/local 老舗・guide
  "nara-uchiwa-deer-design": 2, "nara-zarashi-tsukigase": 2, "nara-zarashi-museum": 2,
  "nakagawa-yu-naramachi": 2, "nihon-ichi-todaiji": 2,
  "fukunishi-washi-honpo": 2, "yoshino-washi-museum": 2,
  "nara-shika-souvenir-guide": 2, "nara-shibori-shika": 2, "nara-mochiidono-zakka": 2,
  "nara-todaiji-souvenir-area": 2, "nara-deer-park-uniform": 2,
  "kofukuji-juyosho": 2,
  "nara-shika-tsuno-craft": 2, "nara-doll-shop-area": 2,
  "asuka-mannyo-costume-experience": 2, "nara-kimono-rental-naramachi": 2,
  "nara-shozoku-cultural": 2,

  // ── 奈良県 衣類 Round 2 (Sprint 15.2 Phase 9-15) ──────────────────
  // Rank 3:世界遺産・最古/最大手・1000+ 年伝統
  "omiwa-jinja-juyosho": 3, // 大神神社(三輪・最古級)
  "toshodaiji-juyosho": 3, // 唐招提寺(鑑真・世界遺産)
  "yakushiji-juyosho": 3, // 薬師寺(白鳳・世界遺産)
  "shika-saru-kitsune-building": 3, // 鹿猿狐ビルヂング 2021 中川政七系複合
  "nara-ittobori-onmatsuri": 3, // 1135 春日若宮おん祭由来
  // Rank 2:regional/local 老舗・guide
  "saidaiji-juyosho": 2, "taimadera-juyosho": 2,
  "yu-nakagawa-saidaiji": 2, "saron-cha-naramachi": 2,
  "nara-juzu-guide": 2, "nara-juzu-shika-tsuno": 2, "nara-todaiji-juzu-shop": 2,
  "nara-furoshiki-guide": 2, "nara-tegugui-guide": 2,
  "nara-shotengai-clothes-guide": 2, "nara-jr-station-souvenir": 2,
  "nara-ittobori-zodiac": 2, "nara-ittobori-hina": 2,
  "kitora-mural-museum-goods": 2, "takamatsuzuka-mural-museum-goods": 2,
  "asuka-shiryo-kan-goods": 2,
  "nara-shichigosan-guide": 2, "nara-yukata-guide": 2,

  // ── 奈良県 衣類 Round 3 (Sprint 15.2 Phase 16-20) ──────────────────
  // Rank 3:奈良独自最大級 + 年 1 回限定大型行事
  "nara-kokuritsu-museum-shop": 3, // 奈良国立博物館(正倉院展期間限定)
  "shosoin-ten-guide": 3, // 正倉院展(年 1 回・天平宝物)
  "todaiji-museum-shop": 3, // 東大寺ミュージアム(2011 開館・大仏殿系)
  "horyuji-daihozoin-shop": 3, // 法隆寺大宝蔵院(百済観音・玉虫厨子)
  "nara-tsunokiri-event-goods": 3, // 角きり 1671 — 神鹿管理伝統行事
  "kasuga-mantoro-yukata": 3, // 春日万灯籠 8/14-15(3,000 灯籠点灯)
  // Rank 2:regional/local 老舗・guide
  "kofukuji-kokuhokan-shop": 2, "kasuga-kokuhoden-shop": 2,
  "yakushiji-touin-shop": 2,
  "shosoin-pattern-guide": 2, "tenpyo-modern-design": 2,
  "nara-geta-zori-guide": 2, "nara-obidome-guide": 2,
  "yamato-kasuri-guide": 2, "nara-aizome-craft": 2,

  // ── 奈良県 住類 (Sprint 15.3) ──────────────────
  // Rank 3:奈良住の最大代表(関西迎賓館・最古秘湯・修験道発祥)
  "nara-hotel-honkan": 3, // 1909 関西迎賓館・辰野金吾
  "nara-hotel-history-guide": 3, // 117 年の hospitality 文化
  "kinpusenji-shukubo": 3, // 修験道総本山宿坊 1300 年
  "yoshino-onsen-motoyu": 3, // 大海人皇子由緒・吉野唯一温泉
  "totsukawa-onsen-guide": 3, // 日本最大村・全国唯一源泉かけ流し宣言
  // Rank 2:regional/local 代表
  "nara-hotel-shinkan": 2, "nara-saraswaty-classical": 2,
  "ana-crowne-plaza-nara": 2, "hotel-nikko-nara": 2, "courtyard-marriott-nara": 2,
  "super-hotel-jr-nara": 2, "nara-business-hotel-guide": 2,
  "naramachi-machiya-stay-guide": 2, "nipponia-nara-naramachi": 2,
  "naramachi-airbnb-guide": 2, "kintetsu-nara-area-lodging": 2,
  "naramachi-villa-private": 2,
  "shukubo-nara-guide": 2, "muroji-shukubo": 2, "hasedera-shukubo": 2,
  "yoshino-sakura-stay-guide": 2, "yoshino-sankei-yado-guide": 2,
  "yoshino-sakura-house": 2, "yoshino-yamanoyado-yumesara": 2, "yoshino-cable-station-yado": 2,
  "asuka-village-minshuku-guide": 2, "asuka-kominka-stay": 2, "kashihara-area-lodging-guide": 2,
  "totsukawa-tsubomeyu-onsen": 2, "totsukawa-yusenji-onsen": 2,
  "uda-matsuyama-stay-guide": 2, "yamato-kogen-onsen": 2, "akinonoyu-uda": 2,
  "nara-shosoin-ten-lodging": 2, "nara-sakura-lodging-guide": 2,
  "nara-mantoro-lodging": 2, "nara-momiji-lodging-guide": 2,

  // ── 奈良県 住類 Round 2 (Sprint 15.3 Phase 10-14) ──────────────────
  // Rank 3:1300 年級修験道湯治 + 世界遺産斑鳩泊
  "dorogawa-onsen-tenkawa": 3, // 大峯山修験道 1300 年湯治場
  "ikaruga-area-lodging": 3, // 法隆寺周辺(現存最古木造)— 朝独占体験
  // Rank 2:area guide / regional 老舗
  "nishinokyo-area-lodging": 2, "heijo-kyu-area-lodging": 2,
  "nara-jr-west-business-area": 2,
  "yamanobe-no-michi-lodging": 2, "omiwa-jinja-area-lodging": 2,
  "saidaiji-shukubo": 2, "todaiji-area-shukubo": 2,
  "kawakami-onsen": 2, "gojo-otou-area-lodging": 2,
  "nara-glamping-guide": 2, "yamato-kogen-glamping": 2,

  // ── 奈良県 住類 Round 3 (Sprint 15.3 Phase 15-19) ──────────────────
  // Rank 3:1400 年級寺・1300 年級女人結界・日本秘境
  "shigisan-chogosonshiji-shukubo": 3, // 信貴山 1400 年聖徳太子由緒
  "ominesan-yamagamigoya": 3, // 大峯山 1300 年女人結界
  "odaigahara-yamagoya": 3, // 大台ヶ原 日本秘境 100 選
  // Rank 2:area guide / regional 老舗
  "shigisan-area-lodging-guide": 2, "ikoma-area-lodging": 2,
  "tenri-station-lodging": 2, "tenri-kyokai-honbu-area": 2,
  "takabatake-area-lodging": 2, "kasugayama-area-lodging": 2,
  "yamato-yagi-area-lodging": 2, "kashihara-jingu-area-lodging": 2,
  "sakurai-station-lodging": 2,

  // ── 奈良県 住類 Round 4 (Sprint 15.3 Phase 20-25) ──────────────────
  // Rank 3:1270+ 年連続行事 + 体験 stay 代表
  "todaiji-shunie-lodging": 3, // 修二会 1270 年連続不退転行事
  "nara-shugendo-1day-stay": 3, // 修験道 1 泊体験(吉野金峯山)
  // Rank 2:area guide / 体験 / regional
  "nara-guesthouse-area": 2, "nara-capsule-hostel": 2,
  "taima-area-lodging": 2, "horyuji-walking-stay": 2,
  "nara-yukimi-lodging": 2, "nara-tsunokiri-lodging": 2,
  "gojo-shinmachi-area": 2, "katsuragi-area-lodging": 2,
  "nara-asakatsuyo-shukubo": 2, "nara-cha-kaiseki-stay": 2, "nara-shakyo-shukubo-stay": 2,
  "kurotaki-yoshino": 2,

  // ── 奈良県 行類 (Sprint 15.4) ──────────────────
  // Rank 3:奈良の動脈 + 1929 現存最古 + 観光列車代表 + 日本最長路線バス
  "kintetsu-nara-line": 3, // 大阪 ↔ 奈良 動脈
  "kintetsu-yoshino-line": 3, // 桜時期の必須線
  "yoshino-ropeway": 3, // 1929 現存日本最古ロープウェイ
  "ao-no-kokyokyoku": 3, // 2016 観光列車代表
  "daibutsu-tetsudo-haisen": 3, // 明治期廃線・歴史遺産
  "kintetsu-rail-pass": 3, // 外国人観光客向け代表
  "totsukawa-long-bus": 3, // R2:日本最長路線バス(167km・八木 ↔ 新宮)
  // Rank 2:regional 路線・ハブ・ガイド
  "kintetsu-kyoto-line": 2, "kintetsu-kashihara-line": 2, "kintetsu-minami-osaka-line": 2,
  "jr-yamatoji-rapid": 2, "jr-manyo-mahoroba-line": 2, "jr-wakayama-line": 2,
  "kintetsu-sightseeing-train-guide": 2,
  "shigisan-ropeway": 2,
  "nara-kotsu-bus": 2, "nara-park-loop-bus": 2, "yoshino-mountain-bus": 2,
  "nara-kotsu-1day-pass": 2, "nara-ikaruga-1day-pass": 2,
  "kansai-airport-to-nara": 2, "kyoto-to-nara-access": 2, "osaka-to-nara-access": 2,
  "asuka-rental-cycle": 2, "nara-taxi-tour": 2,
  "jr-nara-station": 2, "kintetsu-nara-station": 2, "yamato-saidaiji-station": 2,
  "yamato-yagi-station": 2,
  // R2 追加(2026-04-26):駅 hub + 近鉄特急 + IC + バス + 自家用車
  "sakurai-station": 2, "horyuji-station": 2, "tenri-station": 2, "gojo-station": 2,
  "kintetsu-mahoroba-liner": 2, "kintetsu-tokkyu-guide": 2,
  "icoca-suica-nara-guide": 2, "nara-tourist-info-multilingual": 2,
  "kasuga-todaiji-bus": 2, "horyuji-bus-route": 2,
  "nara-rental-car-area": 2, "nara-parking-guide": 2,
  // R3 補完(老卷・2026-04-28):生駒ケーブル系 + 駅 hub + 近鉄細部 + 高速バス
  "ikoma-cable-1918": 3, // 1918 現存日本最古営業ケーブル
  "yoshino-station-hub": 3, // 千本桜玄関 + 世界遺産登山口
  "oji-station-hub": 2, // 奈良県乗降客 1 位
  "ikoma-station-hub": 2, // 4 線交差 hub
  "gakuenmae-station-hub": 2, // 近鉄特急停車・西郊 hub
  "yamato-kamiichi-station-hub": 2, // 奥吉野バス hub
  "yoshinoguchi-station-hub": 2, // JR/近鉄連絡駅
  "kintetsu-keihanna-line": 2, // 大阪メトロ中央線直通
  "kintetsu-tawaramoto-line": 2, // 細部地域連絡線
  "nara-tokyo-highway-bus": 2, // 首都圏アクセス代替

  // ── 奈良県 育類 (Sprint 15.5) ──────────────────
  // Rank 3: 奈良の核心 — 南都七大寺主軸 + 春日 + 正倉院 + 古墳発見 + 世界遺産括り + 修験道
  "nara-todaiji-overview": 3, // 752 大仏・華厳宗本山・最重要
  "nara-kofukuji-overview": 3, // 五重塔 + 阿修羅・藤原氏氏寺
  "nara-horyuji-overview": 3, // 世界最古木造・聖徳太子
  "nara-toshodaiji-overview": 3, // 鑑真渡来・律宗
  "nara-yakushiji-overview": 3, // 凍れる音楽東塔
  "nara-kasuga-taisha-overview": 3, // 神鹿 + 藤原氏氏神
  "nara-shosoin-treasure": 3, // シルクロード終点
  "nara-shosoin-ten-annual": 3, // 年次国民的イベント
  "nara-daibutsu-rushana": 3, // 奈良の象徴
  "asuka-takamatsuzuka-kofun": 3, // 1972 発見・極彩色壁画
  "asuka-kitora-kofun": 3, // 東アジア最古天文図
  "nara-heijokyo-ato-park": 3, // 世界遺産核心 + 国営
  "nara-koto-bunkazai-1998": 3, // 古都奈良 8 資産括り
  "horyuji-ikaruga-bukkyo-1993": 3, // 日本初世遺
  "todaiji-omizutori-shuni-e": 3, // 1273 年継続代表祭
  "nara-shika-1200-overview": 3, // 神鹿 = 奈良の象徴
  "omine-san-tenkawa": 3, // 女人禁制 1300 年・修験道根本
  "yoshino-zaodo-kinpusenji": 3, // 木造日本第二・修験本山
  // Rank 2:其他 34 件
  "nara-gangoji-overview": 2, "nara-daianji-overview": 2, "nara-saidaiji-overview": 2,
  "nara-omiwa-jinja": 2, "nara-isonokami-jingu": 2, "nara-tanzan-jinja": 2,
  "nara-shigisan-chogosonshiji": 2,
  "nara-asura-statue-kofukuji": 2, "nara-shaka-sanzon-horyuji": 2, "nara-yakushi-sanzon-yakushiji": 2,
  "nara-nikko-gakko-bosatsu": 2, "nara-ganjin-zazo-toshodaiji": 2,
  "asuka-kyoseki-overview": 2, "asuka-dera-temple": 2, "asuka-ishibutai-kofun": 2,
  "nara-suzakumon-restoration": 2, "nara-daikokuden-restoration": 2,
  "nara-fujiwara-kyo-ato": 2,
  "kii-sanchi-pilgrimage-2004": 2,
  "manyoshu-overview": 2, "manyo-bunkakan-asuka": 2,
  "manyo-shokubutsuen-kasuga": 2, "kakinomoto-hitomaro-yukari": 2,
  "shugendo-en-no-gyoja-overview": 2,
  "kasuga-wakamiya-onmatsuri": 2, "toshodaiji-uchiwa-maki": 2, "asuka-kuhase-festival": 2,
  "nara-shika-no-tsunokiri": 2, "nara-shika-yose-summer": 2,
  "nara-kokuritsu-hakubutsukan": 2, "nara-kenritsu-bijutsukan": 2,
  "nara-bunkazai-kenkyusho": 2,
  "nara-shakyo-yakushiji": 2, "nara-butsuzo-kansho-guide": 2,

  // R2 追加(2026-04-27):寺院 expansion + 仏像 + 古墳 + 修験 + 祭事 + 文学 + 体験
  // Rank 3:中宮寺半跏思惟像 + 法起寺世界遺産 + 二月堂国宝 + 百済観音 + 救世観音 +
  //         箸墓卑弥呼説 + 大峯奥駆道 + 若草山焼 + 山辺の道
  "nara-chuguji-bika-shiyui": 3,
  "nara-hokiji-temple": 3,
  "nara-todaiji-nigatsu-do": 3,
  "nara-kudara-kannon": 3,
  "nara-kuse-kannon-yumeden": 3,
  "nara-hashihaka-kofun": 3,
  "omine-okugake-michi": 3,
  "wakakusayama-yamayaki": 3,
  "nara-yamabe-no-michi": 3,
  // Rank 2:R2 補完 19 件
  "nara-horinji-temple": 2, "nara-akishino-dera": 2, "nara-kairyuoji-temple": 2,
  "nara-kofukuji-nan-en-do": 2, "nara-saidaiji-aizen-do": 2,
  "nara-yuima-koji-tokondo": 2, "nara-gigeiten-akishino": 2,
  "nara-marayama-kofun-gojono": 2, "asuka-monmu-tomb": 2, "asuka-tenmu-jito-tomb": 2,
  "tamaki-jinja-totsukawa": 2, "yamato-katsuragi-yama": 2,
  "nara-tokae-summer": 2, "yoshino-kaeru-tobi": 2,
  "kojiki-712-yukari": 2, "nihonshoki-720-yukari": 2, "yamato-fudoki-fragments": 2,
  "nara-shakyo-saidaiji": 2, "nara-sumi-experience": 2,

  // R3 追加(2026-04-28・古代皇都の深度 80 → 110):
  // Rank 3:コスモス寺 + 西国札所 + 女人高野 + 唯一双塔 + 運慶快慶 + 白鳳最高傑作 +
  //         聖徳太子 + 鑑真 + 修験道根本道場 + 万葉三山
  "nara-hannyaji-temple": 3,
  "nara-hasedera-temple": 3,
  "nara-murouji-temple": 3,
  "nara-taimadera-temple": 3,
  "todaiji-nandaimon-kongorikishi": 3,
  "yamada-dera-butsu-zu": 3,
  "shotoku-taishi-574-622": 3,
  "ganjin-688-763": 3,
  "omine-sanji-temple": 3,
  "yamato-sanzan": 3,
  // Rank 2:R3 補完 20 件
  "nara-futaiji-temple": 2, "nara-hokkeji-temple": 2, "nara-abe-monjuin": 2,
  "nara-okadera-temple": 2,
  "todaiji-kaidando-shitenno": 2, "todaiji-sangatsudo-fukukenjaku": 2,
  "asuka-sakafuneishi-iseki": 2, "asuka-kameishi-zou": 2,
  "asuka-kawaharadera-ato": 2, "asuka-mizuochi-iseki": 2,
  "gyoki-668-749": 2, "ono-yasumaro-723": 2, "otsu-no-miko-663-686": 2,
  "odaigahara": 2, "nijousan-otsu-tomb": 2,
  "kasuga-chuugen-mantoro": 2, "yakushiji-hanaeshi": 2,
  "takayama-chasen": 2, "nara-shoryakuji-sake": 2,
  "asuka-kokyo-michi": 2,

  // ── 奈良県 樂類 (Sprint 15.6) ──────────────────
  // Rank 3:吉野山桜 + 60 万本 + 関西最早紅葉 + 三大秘湯 + 鹿せんべい唯一 +
  //         冬瑠璃絵 + 奈良 1 日定番 + 吉野 1 日 + 又兵衛桜
  "yoshino-yama-sakura": 3, // 関西 No.1 桜・3 万本
  "matabei-zakura-uda": 3, // 1 本桜代表・樹齢 300 年
  "umami-kyuryo-park": 3, // チューリップ 60 万本
  "odaigahara-east-course": 3, // 関西最早紅葉 + 日本一多雨
  "totsukawa-onsen-go": 3, // 関西三大秘湯
  "nara-shika-senbei-howto": 3, // 鹿せんべい全国唯一
  "nara-rurie-february": 3, // 冬奈良名物
  "nara-1day-classic": 3, // 定番モデル
  "yoshino-sakura-1day": 3, // 桜時期定番
  // Rank 2:R1 補完 41 件
  "takada-senbon-sakura": 2, "takamino-sato-senbon": 2, "byobu-iwa-sakura": 2,
  "kasuga-taisha-sakura": 2, "nara-park-sakura": 2, "murouji-shakunage": 2,
  "hasedera-momiji": 2, "ryuoga-fuchi-uda": 2, "ono-dera-uda-sakura-momiji": 2,
  "anyu-bairin-nishi-yoshino": 2, "tsukigase-baikei": 2, "yatadera-ajisai": 2,
  "katsuragi-tsutsuji": 2,
  "nara-park-1day-picnic": 2, "kasuga-rokuen-baby-deer": 2,
  "tobihino-spring-picnic": 2, "nara-park-night-walk": 2,
  "dorogawa-onsen-play": 2, "totsuji-yusenchi-onsen": 2,
  "kamiyu-onsen-totsukawa": 2, "yoshino-onsen-shimoichi": 2,
  "katsuragi-yama-hiking": 2, "nijousan-hiking-tomb": 2, "yamabe-no-michi-walk": 2,
  "tsukigase-canoe": 2, "yoshino-river-rafting": 2, "ouda-rock-climbing": 2,
  "yamato-river-cycle-road": 2,
  "uda-animal-park": 2, "nara-kenko-land-tenri": 2, "yamato-minzoku-park": 2,
  "nara-kodomo-center": 2,
  "nara-light-up-promenade": 2, "kasuga-setsubun-mantoro": 2,
  "gojo-summer-fes": 2, "uda-aki-fes": 2,
  "nara-horyuji-1day": 2, "asuka-1day-cycle": 2, "nara-kids-1day": 2,
  "nara-hotaru-watch": 2,

  // R2 追加(2026-04-28・楽 50 → 79):
  // Rank 3:吉野奥パノラマ + 奈良公園紅葉 + 飛鳥彼岸花 + 霧氷 +
  //         金魚すくい全国 + 関西定番 1 泊 + 早朝攻略
  "yoshino-takagi-yamasakura": 3,
  "nara-park-momiji": 3,
  "asuka-inabuchi-higanbana": 3,
  "mitsumineyama-hyoukou": 3,
  "kingyo-sukui-zenkoku": 3,
  "nara-1nights-kyoto-add": 3,
  "nara-early-morning-tactic": 3,
  // Rank 2:R2 補完 22 件
  "asuka-inabuchi-sakura": 2, "shigi-san-sakura": 2,
  "kasuga-park-momiji": 2, "murouji-momiji": 2,
  "shigi-san-suisen": 2,
  "nara-shika-senbei-toba": 2, "nara-deer-ecology-guide": 2,
  "shigi-san-onsen": 2, "kamikitayama-onsen": 2,
  "takamiyama-hyoukou": 2, "shaka-ga-take": 2,
  "tsuburu-lake-canoe": 2, "ikehara-lake-activity": 2, "shigi-paragliding": 2,
  "naramachi-rainy-walk": 2, "heijo-iza-museum": 2, "nara-rainy-museum-route": 2,
  "nara-marathon": 2, "naramachi-tanabata": 2,
  "nara-1nights-osaka-add": 2, "nara-rainy-1day": 2, "nara-winter-1day": 2,

  // ── 北海道衣 R1 expansion (Sprint 16.1・22 → 60) ──────────────────
  // Rank 3:アイヌ最高級礼装 + オヒョウ繊維体験 + 観光客冬装備総論 +
  //         国際リゾートスキーウェア + 札幌 hub
  "nibutani-ruunpe-embroidery": 3,
  "attushi-experience-biratori": 3,
  "hokkaido-winter-gear-overview": 3,
  "niseko-ski-wear-shops": 3,
  "sapporo-jr-tower-shopping": 3,
  // Rank 2:R1 補完 33 件
  "ainu-chikar-karpe": 2, "ainu-embroidery-experience-shiraoi": 2, "ainu-mokoshi-jacket": 2,
  "hokkaido-snow-boots-guide": 2, "hokkaido-down-jacket-guide": 2,
  "hokkaido-warm-inner-guide": 2, "hokkaido-ice-grip-stickers": 2,
  "hokkaido-knit-hat-glove": 2, "hokkaido-heatpack-culture": 2,
  "hokkaido-snow-festival-fashion": 2,
  "asahikawa-ici-mountain-gear": 2, "daisetsuzan-mountain-gear": 2,
  "hokkaido-touring-leather": 2, "rusutsu-niseko-snowboard": 2,
  "furano-wool-knit": 2, "hakodate-canvas-bag": 2, "hokkaido-sheep-leather": 2,
  "asahikawa-felt-craft": 2, "otaru-glass-jewelry": 2,
  "sapporo-akarenga-terrace": 2, "susukino-night-fashion": 2,
  "hakodate-bay-area-shops": 2, "asahikawa-station-shopping": 2,
  "sapporo-nakajima-vintage": 2, "sapporo-army-surplus": 2, "hakodate-motomachi-antique": 2,
  "hokudai-souvenir": 2, "sapporo-clock-tower-souvenir": 2, "furano-lavender-goods": 2,
  "hokkaido-folkcraft-overview": 2,
  "hokkaido-spring-fashion": 2, "hokkaido-summer-fashion": 2, "hokkaido-autumn-fashion": 2,

  // ── 北海道行 R1 expansion (Sprint 16.2・33 → 60) ──────────────────
  // Rank 3:道央動脈 + 空港アクセス + タウシュベツ + 最大フェリー + 雪まつり tactic
  "jr-hakodate-honsen": 3,
  "jr-chitose-line": 3,
  "shihoro-line-haisen": 3,
  "tomakomai-oarai-ferry": 3,
  "yuki-festival-transit": 3,
  // Rank 2:R1 補完 22 件
  "jr-muroran-honsen": 2, "jr-soya-honsen": 2, "jr-nemuro-honsen": 2, "jr-sekihoku-honsen": 2,
  "yubari-line-haisen": 2, "tenpoku-line-haisen": 2,
  "hokkaido-chuo-bus": 2, "jotetsu-bus": 2, "donan-bus": 2,
  "asahikawa-airport": 2, "obihiro-airport": 2, "kushiro-airport": 2, "memanbetsu-airport": 2,
  "otaru-maizuru-ferry": 2, "tomakomai-pacific-ferry": 2,
  "lavender-express-furano": 2, "north-rainbow-express": 2,
  "ryuhyo-tour-bus": 2,
  "hokkaido-eastern-rental-car": 2, "hokkaido-niseko-rental-car": 2,
  "sapporo-donichika-pass": 2, "jr-hokkaido-pass-zone-overview": 2,

  // ── 北海道住 R1 expansion (Sprint 16.3・50 → 80) ──────────────────
  // Rank 3:摩周湖近 + 1 軒秘湯 + 国際リゾート + 世界遺産前線基地 + Club Med
  "kawayu-onsen-mashu": 3, // 摩周湖屈斜路湖中間道東 hub
  "yorōushi-onsen": 3, // 1 軒宿シマフクロウ秘湯
  "niseko-village-resort": 3, // ヒルトン国際リゾート
  "shiretoko-utoro-grand": 3, // 知床第一・世界遺産前線
  "tomamu-club-med": 3, // 唯一のオールインクルーシブ
  // Rank 2:R1 補完 25 件
  "kussharo-konsen-lakeside": 2, "shiretoko-utoro-onsen": 2, "biei-shirogane-onsen": 2,
  "business-hakodate-area": 2, "business-asahikawa-area": 2, "business-obihiro-area": 2,
  "business-kushiro-area": 2, "business-tomakomai-area": 2,
  "rusutsu-the-tower": 2, "akan-tsuruga-hougou": 2,
  "sapporo-prime-hostel": 2, "hakodate-mt-hakodate-bnb": 2, "niseko-backpacker-hostel": 2,
  "shiretoko-utoro-minshuku": 2, "daisetsuzan-tozan-lodge": 2, "furano-pension": 2,
  "kussharo-glamping": 2, "biei-glamping": 2,
  "sapporo-station-area-lodging": 2, "susukino-area-lodging": 2,
  "abashiri-area-lodging": 2, "wakkanai-area-lodging": 2, "rishiri-rebun-lodging": 2,
  "yoichi-wine-resort": 2, "niseko-condominium-long-stay": 2,

  // ── 北海道食 R1 expansion (Sprint 16.4・90 → 130) ──────────────────
  // Rank 3:十勝豚丼発祥 + 札幌スープカレー概論 + 六花亭 + 白い恋人 + 函館朝市 + アイヌ食
  "obihiro-butadon-history": 3,
  "soup-curry-history": 3,
  "rokkatei-marusei-butter-sand": 3,
  "ishiya-shiroi-koibito": 3,
  "hakodate-asaichi-detail": 3,
  "ainu-food-overview": 3,
  // Rank 2:R1 補完 33 件
  "zangi-concept-history": 2, "ishikari-nabe-overview": 2,
  "sapporo-nijo-ichiba": 2, "kushiro-washo-ichiba": 2,
  "asahikawa-ramen-shoyu-overview": 2, "kushiro-ramen-overview": 2,
  "muroran-curry-ramen": 2, "obihiro-ramen-shop": 2,
  "royce-nama-chocolate": 2, "sapporo-snow-brand-museum": 2,
  "garana-drink": 2, "soft-katsugen": 2, "ribbon-napolin": 2,
  "uni-okhotsk-bafun": 2, "ikura-akkeshi": 2, "ezomatsuba-kani": 2,
  "hotate-mutsu-bay": 2, "shake-aki-rusen": 2,
  "niseko-cheese-craft": 2, "yotei-jyagaimo": 2, "furano-onion": 2,
  "asparagus-spring-fresh": 2,
  "ezoshika-jibie-restaurant": 2, "matsumae-zuke": 2, "muroran-yakitori-pork": 2,
  "ryuhyo-kani-okhotsk-feb": 2, "gyoja-ninniku-spring": 2,
  "tarako-spring-haru": 2, "summer-tokibi-corn": 2,
  "tomakomai-hokki": 2, "wakkanai-tako-shabu": 2, "nemuro-hanasaki-kani": 2,
  "yumepirika-rice": 2,

  // ── 大阪食 R1 (Sprint 17.1・第二七卷開卷食) ──────────────────
  // Rank 3:粉もん発祥 + 串カツ元祖 + 食い倒れ街中核 + バッテラ + 黒門 + 鶴橋焼肉 + うどん発祥
  "takoyaki-aizuya-1933": 3, // たこ焼元祖
  "kushikatsu-daruma-1929": 3, // 串カツ元祖
  "551-horai-butaman-1945": 3, // 大阪人ソウルフード
  "okonomiyaki-mizuno-1945": 3, // お好み焼老舗
  "okonomiyaki-bote-jiyu-1946": 3, // モダン焼+マヨ世界初
  "dotonbori-history-overview": 3, // 食い倒れ街概論
  "dotonbori-glico-sign": 3, // グリコ看板大阪象徴
  "shinsekai-history": 3, // 新世界開発
  "tsutenkaku-tower": 3, // 通天閣
  "kuromon-ichiba-1804": 3, // 大阪の台所
  "tsuruhashi-yakiniku-overview": 3, // 焼肉発祥
  "battera-zushi-1894": 3, // バッテラ発祥
  "udon-mizuno-1893": 3, // きつねうどん発祥
  "fugu-overview-osaka": 3, // ふぐ消費全国一
  "kitashinchi-michelin-overview": 3, // 北新地高級
  "konamon-overview-osaka": 3, // 粉もん概論
  "marubo-coffee-1934": 3, // 大阪コーヒー文化
  // Rank 2:R1 補完 62 件
  "takoyaki-wanaka-sennichimae": 2, "takoyaki-akaoni-dotonbori": 2,
  "takoyaki-creo-ru-shinsaibashi": 2, "takoyaki-kukuru-dotonbori": 2,
  "takoyaki-yamachan": 2, "takoyaki-history-overview": 2,
  "okonomiyaki-fukutaro-hosenji": 2, "okonomiyaki-chibo-1973": 2,
  "okonomiyaki-history-overview": 2, "negiyaki-yamamoto-1965": 2,
  "kushikatsu-yaekatsu": 2, "kushikatsu-overview-no-double-dip": 2,
  "shinsekai-kushikatsu-area": 2, "kushikatsu-tengu": 2, "doteyaki-osaka-history": 2,
  "dotonbori-kani-doraku-1962": 2, "kuidaore-taro-mascot": 2,
  "hosenji-yokocho-history": 2, "sennichimae-doguya-suji": 2,
  "amerikamura-food": 2, "umeda-food-area": 2,
  "tsuruhashi-ichiba-korean-market": 2, "kizu-ichiba": 2, "tenma-ichiba": 2,
  "shitennoji-yamamuro-area": 2,
  "osaka-zushi-overview": 2, "yoshino-zushi-1841": 2, "zuboraya-fugu-1920": 2,
  "fugu-genpin-osaka": 2, "unagi-fukutei-osaka": 2, "hamo-summer-osaka": 2,
  "tsuruhashi-tsuruichi": 2, "tsuruhashi-shokudoen": 2,
  "tsuruhashi-kimchi-shopping": 2, "korean-town-dotonbori": 2,
  "udon-osaka-overview": 2, "udon-imai-dotonbori": 2,
  "ramen-kinryu-dotonbori": 2, "ramen-jinroku-osaka": 2, "ramen-isshin-osaka": 2,
  "ramen-overview-osaka": 2,
  "mixed-juice-1949-senba": 2, "junkissa-osaka-overview": 2,
  "kissaten-american-shinsaibashi": 2, "ouji-cake-1948-senba": 2,
  "ryotei-tsuruhachi-osaka": 2, "ryotei-cha-kaiseki-yamato": 2,
  "ryotei-sushi-koji-osaka": 2, "ryotei-fu-osaka": 2,
  "tachi-nomi-kitashinchi": 2, "tachi-nomi-shinsekai": 2,
  "tenma-yokocho-tachi-nomi": 2, "horumon-osaka-overview": 2,
  "fukushima-yakitori-area": 2,
  "fugu-winter-shimonoseki-osaka": 2, "takenoko-spring-osaka": 2,
  "matsutake-autumn-osaka": 2, "ayu-summer-yodogawa": 2, "rojanki-butaman-1915": 2,
  "ikeda-shuzo-1602": 2, "kawachi-wine-1934": 2, "settsu-shuzo-overview": 2,

  // ── 大阪行 R1 (Sprint 17.4・35 筆) ──────────────────
  // Rank 3:関空 + 伊丹 + 御堂筋線 + JR 環状 + 大阪駅 + 新大阪 + 周遊パス
  "kansai-airport-osaka": 3,
  "itami-airport-osaka": 3,
  "osaka-metro-midosuji-line": 3,
  "jr-osaka-kanjo-line": 3,
  "osaka-station-umeda-hub": 3,
  "namba-station-hub": 3,
  "shin-osaka-shinkansen-hub": 3,
  "osaka-amazing-pass": 3,
  // Rank 2:R1 補完 27 件
  "kansai-airport-limousine-bus": 2,
  "nankai-rapid-kuko-osaka": 2, "jr-haruka-kuko-osaka": 2,
  "osaka-metro-tanimachi-line": 2, "osaka-metro-yotsubashi-line": 2,
  "osaka-metro-chuo-line": 2, "osaka-metro-sennichimae-line": 2,
  "osaka-metro-sakaisuji-line": 2, "osaka-metro-nagahori-line": 2,
  "osaka-metro-imazatosuji-line": 2, "osaka-metro-portliner": 2,
  "jr-kyoto-line-osaka": 2, "jr-kobe-line-osaka": 2,
  "jr-hanwa-line": 2, "jr-takarazuka-line": 2,
  "hankyu-kobe-line": 2, "hankyu-kyoto-line": 2, "hankyu-takarazuka-line": 2,
  "hanshin-honsen": 2, "hanshin-namba-line": 2,
  "keihan-honsen": 2, "nankai-honsen": 2, "nankai-koya-line": 2,
  "tennoji-station-hub": 2, "kyobashi-station-hub": 2,
  "osaka-suijo-bus-aqualiner": 2, "osaka-city-bus": 2,

  // ── 大阪行 R2 (Sprint 17.4 R2・35 → 60) ──────────────────
  // Rank 3:USJ アクセス + 心斎橋 + 千里 + 関空快速 + ひのとり + 道頓堀リバー
  "shinsaibashi-station": 3,
  "nishi-kujo-station": 3, // USJ アクセス
  "jr-yumesaki-line-usj": 3, // USJ 専線
  "hankyu-senri-line": 3, // 万博公園
  "kintetsu-hinotori": 3, // 2020 フラグシップ
  "jr-kanku-rapid": 3, // 関空経済
  "dotonbori-river-cruise": 3, // 観光定番
  // Rank 2:R2 補完 18 件
  "nishi-umeda-station": 2, "dobutsuen-mae-station": 2,
  "sakuranomiya-station": 2, "tsuruhashi-jr-station": 2,
  "kita-osaka-kyuko": 2,
  "nankai-airport-line": 2, "kintetsu-osaka-line-osaka": 2,
  "jr-osaka-higashi-line": 2, "jr-katamachi-line": 2,
  "hankai-uemachi-line": 2, "hankai-line-main": 2,
  "jr-thunderbird-osaka": 2, "jr-hida-osaka": 2, "jr-super-hakuto-osaka": 2,
  "kintetsu-urban-liner": 2,
  "enjoy-eco-card": 2, "osaka-ducktour": 2,

  // ── 大阪育 R1 (Sprint 17.5 育・33 → 85) ──────────────────
  // Rank 3:必看の核 — 大阪城 + 世界遺産古墳 + 四天王寺 + 住吉大社 + 通天閣 + 太陽の塔 + 天神祭
  "osaka-castle": 3,
  "shitennoji": 3,
  "sumiyoshi-taisha": 3,
  "osaka-tenmangu": 3,
  "mozu-furuichi-kofungun": 3, // 世界遺産
  "nintoku-tenno-ryo": 3, // 世界最大級
  "tsutenkaku": 3,
  "taiyo-no-to": 3,
  "banpaku-kinen-koen": 3,
  "tenjin-matsuri": 3, // 日本三大祭
  "kishiwada-danjiri": 3,
  "minpaku-kokuritsu-minzokugaku": 3, // 世界最大級民博
  "kokuritsu-bunraku-gekijo": 3, // ユネスコ無形
  "cup-noodles-museum-ikeda": 3, // 体験型人気
  // Rank 2:R1 補完 38 件
  "naniwa-no-miya-iseki": 2, "tekijuku-ogata-koan": 2,
  "osaka-chuo-kokaido": 2, "nakanoshima-furitsu-toshokan": 2,
  "sanada-maru-ato": 2, "kishiwada-jo": 2,
  "ikeda-jo-ato": 2, "takatsuki-jo-koen": 2, "ibaraki-jo-ato": 2,
  "richu-tenno-ryo": 2, "ojin-tenno-ryo": 2, "hanzei-tenno-ryo": 2,
  "tamatsukuri-inari": 2, "tsuyu-tenjinja": 2,
  "namba-yasaka": 2, "kozu-no-miya": 2,
  "taiyu-ji-osaka": 2, "isshin-ji": 2, "fujii-dera": 2,
  "kokuritsu-kokusai-bijutsukan": 2, "osaka-shiritsu-bijutsukan": 2,
  "osaka-rekishi-hakubutsukan": 2, "osaka-konjaku-kan": 2,
  "osaka-shizenshi-hakubutsukan": 2, "yayoi-bunka-hakubutsukan": 2,
  "kamigata-ukiyoe-kan": 2, "shiba-ryotaro-kinenkan": 2,
  "sakai-uchihamono": 2, "naniwa-honzome": 2, "naniwa-suzuki": 2,
  "osaka-ranma": 2, "senshu-towel": 2, "senshu-kiri-tansu": 2,
  "kawachi-momen": 2, "nakanoshima-kindai-kenchikugun": 2,
  "sumiyoshi-matsuri": 2, "tenma-tenjin-hanjotei": 2,
  "yosano-akiko-seitan-sakai": 2,

  // ── 大阪育 R2 (Sprint 17.5 R2・85 → 120) ──────────────────
  // Rank 3:楠木正成核 + 聖徳太子陵 + 御堂筋 + 松竹座 + NGK
  "kanshin-ji": 3, // 楠木正成菩提寺・国宝
  "kongo-ji-amano": 3, // 国宝多宝塔・女人高野
  "chihaya-jo-ato": 3, // 楠木挙兵地・元弘の乱
  "eifuku-ji-taishi": 3, // 聖徳太子廟・国宝
  "midosuji-avenue": 3, // 1937 御堂筋・大阪近代化
  "namba-grand-kagetsu": 3, // 漫才聖地
  "osaka-shochiku-za": 3, // 上方歌舞伎本拠
  "aizen-matsuri": 3, // 大阪三大夏祭
  "menyo-kaikan": 3, // 重文・船場最名建築
  // Rank 2:R2 補完 26 件
  "sakurai-no-eki-ato": 2, "nonaka-ji": 2, "domyo-ji-tenmangu": 2,
  "abe-no-seimei-jinja": 2, "yasui-jinja-osaka": 2,
  "abeno-jinja": 2, "mizunashi-jingu": 2, "hiraoka-jinja": 2,
  "kumata-jinja": 2, "dainenbutsu-ji": 2,
  "takidani-fudo-myoo-ji": 2,
  "tondabayashi-jinai-cho": 2, "chausuyama-tennoji": 2,
  "osaka-gas-bldg": 2, "osaka-club": 2, "nihon-ginko-osaka-shiten": 2,
  "kobayashi-ichizo-kinenkan": 2, "peace-osaka": 2,
  "kosetsu-bijutsukan-nakanoshima": 2, "abeno-harukas-bijutsukan": 2,
  "osaka-kagakukan": 2,
  "yoshimoto-1912-tenma": 2,
  "oda-sakunosuke-kahi": 2, "kawabata-yasunari-ibaraki": 2,
  "tanabe-seiko-bungakukan": 2,
  "hirano-kumata-danjiri": 2,

  // ── 大阪楽 R1 (Sprint 17.6 樂・0 → 44) ──────────────────
  // Rank 3:USJ + 海遊館 + 桜大阪城 + 造幣局 + PL 花火 + 御堂筋イルミ + ハルカス + 京セラ
  "usj-universal-studios-japan": 3,
  "usj-super-nintendo-world": 3,
  "usj-harry-potter-area": 3,
  "osaka-kaiyukan": 3,
  "osaka-castle-sakura": 3,
  "zoheikyoku-sakura-toshikenukei": 3,
  "kema-sakuranomiya-sakura": 3,
  "tenjin-matsuri-hanabi": 3,
  "naniwa-yodogawa-hanabi": 3,
  "pl-hanabi-tondabayashi": 3,
  "midosuji-illumination": 3,
  "abeno-harukas-300": 3,
  "dotonbori-glico-night": 3,
  "kyocera-dome-osaka": 3,
  // Rank 2:R1 補完 30 件
  "usj-minion-park": 2, "usj-jurassic-park": 2,
  "hirakata-park": 2, "nifrel-suita": 2, "expo-city-osaka-wheel": 2,
  "tennoji-zoo": 2,
  "expo-koen-sakura": 2, "takatsuki-shiroyama-sakura": 2,
  "minoo-koen-momiji": 2, "kanshin-ji-momiji": 2, "ushiotaki-momiji-kishiwada": 2,
  "izumiotsu-rinkukoen-hanabi": 2,
  "osaka-hikari-no-kyoen": 2, "namba-parks-canyon-illumination": 2, "expo-city-illumination": 2,
  "nagai-shokubutsu-en": 2, "expo-rose-garden": 2, "hattori-ryokuchi-park": 2,
  "yanmar-stadium-nagai": 2,
  "summer-sonic-osaka": 2,
  "umeda-sky-building-floating-garden": 2, "tsutenkaku-night-view": 2,
  "osaka-castle-illumination": 2,
  "spa-world-shinsekai": 2, "minoo-onsen-spa-garden": 2,
  "kawachi-grape-picking-summer": 2, "kishiwada-strawberry-picking-spring": 2,
  "fugu-winter-osaka-experience": 2,
  "izumi-mizunashi-takenoko-spring": 2, "kishiwada-orange-picking-winter": 2,

  // ── 大阪楽 R2 (Sprint 17.6 R2・49 → 73) ──────────────────
  // Rank 3:USJ 季節 + ネモフィラ + COSMO TOWER + ガンバ吹田 + 万博跡地
  "usj-halloween-horror-night": 3,
  "usj-christmas-season": 3,
  "maishima-seaside-park-nemophila": 3, // 100 万本 SNS 強
  "cosmo-tower-saka": 3, // 252 m 穴場夜景
  "tempozan-ferris-wheel": 3, // 海遊館隣接
  "panasonic-stadium-suita": 3, // ガンバ J1
  "expo2025-yumeshima-legacy": 3, // 2025 万博跡地
  // Rank 2:R2 補完 17 件
  "usj-cool-japan-season": 2, "universal-citywalk-osaka": 2,
  "daisen-koen-sakura": 2, "ibaraki-motoibaraki-sakura": 2, "ikeda-jo-koen-sakura": 2,
  "expo-koen-koyo": 2,
  "eiraku-dam-ajisai": 2, "tsurumi-ryokuchi-flower": 2,
  "naniwa-kenkou-land": 2, "amano-yu-onsen-kawachinagano": 2,
  "kids-plaza-osaka": 2,
  "hirakata-park-illumination": 2, "kishiwada-castle-illumi": 2,
  "senshu-tamanegi-spring": 2, "kawachi-momo-summer": 2, "tondabayashi-eggplant-summer": 2,
  "hankai-trolley-retro-tour": 2,

  // ── 大阪衣 R1 (Sprint 17.7 衣・0 → 37) ──────────────────
  // Rank 3:大丸心斎橋 + 阪急梅田 + 高島屋なんば + 心斎橋筋 + 天神橋筋 + アメ村 + グランフロント + りんくう
  "daimaru-shinsaibashi-honten": 3,
  "hankyu-umeda-honten": 3,
  "takashimaya-namba-honten": 3,
  "shinsaibashi-suji-shotengai": 3,
  "tenjinbashisuji-shotengai": 3,
  "amerikamura-fashion": 3,
  "grandfront-osaka": 3,
  "rinku-premium-outlets": 3,
  "kintetsu-abeno-harukas": 3, // 関西最大百貨店
  "nipponbashi-denden-town": 3, // 大阪秋葉原
  // Rank 2:R1 補完 27 件
  "hanshin-umeda-honten": 2, "daimaru-umeda": 2, "kintetsu-uehonmachi": 2,
  "ebisubashi-suji-shotengai": 2, "nipponbashi-otaroad": 2,
  "lucua-osaka": 2, "namba-parks-mall": 2, "namba-city-mall": 2,
  "tennoji-mio": 2, "abeno-cues-mall": 2,
  "horie-fashion-district": 2, "nakazakicho-vintage": 2, "minami-senba-boutique": 2,
  "mitsui-outlet-tsurumi": 2,
  "crysta-nagahori": 2, "whitey-umeda": 2, "hankyu-sanban-gai": 2,
  "dia-mall-osaka": 2, "namba-walk-underground": 2,
  "hep-five-umeda": 2, "hep-navio": 2, "shinsaibashi-opa": 2, "namba-marui": 2,
  "tempozan-marketplace": 2, "yodobashi-umeda": 2,
  "kitashinchi-fashion-night": 2,
  "tenma-furuhonchi": 2,

  // ── 大阪衣 R2 (Sprint 17.7 R2・37 → 63) ──────────────────
  // Rank 3:ららぽーと EXPOCITY + ドンキ道頓堀 + LINKS UMEDA + 京阪モール + 阪急メンズ
  "lalaport-expo-city": 3, // 関西最大級モール
  "donquijote-dotonbori": 3, // 観光客 SNS No.1
  "links-umeda": 3, // 無印旗艦
  "keihan-mall-kyobashi": 3, // 京阪沿線最大
  "hankyu-mens-osaka": 3, // 関西最大メンズ
  "namba-skyo": 3, // 2018 新世代
  "labi1-namba": 3, // 関西最大ヤマダ
  // Rank 2:R2 補完 19 件
  "takashimaya-higashi-betsukan": 2, "daimaru-shinsaibashi-kita-kan": 2,
  "lalaport-izumi": 2, "lalaport-kadoma": 2, "aeon-mall-sakai-teppocho": 2,
  "nu-chayamachi": 2,
  "arios-otori": 2,
  "donquijote-namba": 2,
  "joshin-nipponbashi": 2, "animate-nipponbashi": 2, "mandarake-grand-chaos": 2,
  "takatsuki-center-gai": 2, "ibaraki-hankyu-honmachi": 2, "uranamba-fashion": 2,
  "osaka-honbasho-ichiba": 2,
  "ekimo-umeda": 2, "est-umeda": 2,
  "e-ma-umeda": 2, "super-kids-land-osaka": 2,

  // ── 大阪住 R1 (Sprint 17.8 住・0 → 43) ──────────────────
  // Rank 3:Ritz + Conrad + W + Four Seasons + USJ + 関空 + 帝国 + Hilton + Granvia + Hyatt
  "ritz-carlton-osaka": 3,
  "conrad-osaka": 3,
  "w-osaka": 3,
  "four-seasons-osaka": 3, // 2024 最新
  "imperial-hotel-osaka": 3,
  "hilton-osaka": 3,
  "hotel-granvia-osaka": 3, // 関空 + 新幹線 hub
  "rihga-royal-hotel-osaka": 3,
  "hotel-universal-port": 3, // USJ オフィシャル No.1
  "park-front-hotel-usj": 3, // USJ ゲート 1 分
  "nikko-kansai-airport": 3, // 関空島内唯一
  "hyatt-regency-kix": 3,
  "swissotel-nankai-osaka": 3, // なんば直結
  "osaka-marriott-miyako": 3, // ハルカス最高層
  // Rank 2:R1 補完 29 件
  "st-regis-osaka": 2,
  "hyatt-regency-osaka": 2, "hotel-new-otani-osaka": 2,
  "ana-crowne-plaza-osaka": 2, "hotel-monterey-grasmere": 2,
  "cross-hotel-osaka": 2, "moxy-osaka-honmachi": 2,
  "mitsui-garden-osaka-premier": 2, "hotel-monterey-osaka": 2,
  "hotel-monterey-la-soeur-osaka": 2, "mitsui-garden-yodoyabashi": 2,
  "hotel-the-flag-shinsaibashi": 2,
  "apa-namba-shinsaibashi": 2, "apa-osaka-umeda": 2,
  "toyoko-inn-osaka-namba": 2, "richmond-osaka-namba": 2,
  "dormy-inn-namba-osaka": 2, "super-hotel-tennouji": 2,
  "hotel-keihan-kyobashi": 2,
  "hotel-keihan-universal-tower": 2, "jr-hotel-universal-city": 2,
  "nine-hours-namba": 2, "first-cabin-umeda": 2,
  "khaosan-world-namba": 2, "drop-inn-osaka": 2, "hostel-q-osaka": 2,
  "stargate-hotel-kansai-airport": 2,
  "hotel-hankyu-international": 2, "remm-hotel-shin-osaka": 2,

  // ── 大阪住 R2 (Sprint 17.8 R2・43 → 66) ──────────────────
  // Rank 3:インターコンチ + 隈研吾ロイヤルクラシック + アロフト + USJ 第 6 + Royal Park Iconic + Marriott コートヤード新大阪
  "intercontinental-osaka": 3, // 関西初インターコンチ
  "sheraton-miyako-osaka": 3, // 1973 老舗・近鉄系
  "hotel-nikko-osaka": 3, // JAL 旗艦
  "hotel-royal-classic-osaka": 3, // 隈研吾・歌舞伎座跡
  "liber-hotel-usj": 3, // USJ 最新 第 6
  "royal-park-iconic-osaka-midosuji": 3,
  "courtyard-marriott-shin-osaka": 3, // 新大阪駅 1 分
  // Rank 2:R2 補完 16 件
  "art-hotel-osaka-bay-tower": 2,
  "aloft-osaka-dojima": 2, "voco-osaka-central": 2,
  "candeo-hotels-osaka-namba": 2, "royal-park-canvas-osaka-kitahama": 2,
  "mitsui-garden-osaka-honmachi": 2, "exel-tokyu-shinsaibashi": 2,
  "hotel-universal-port-vita": 2,
  "hotel-hewitt-rinku": 2,
  "apa-tenmabashi": 2, "daiwa-roynet-yodoyabashi": 2,
  "henn-na-hotel-osaka-namba": 2, "shin-osaka-station-hotel": 2,
  "holiday-inn-osaka-namba": 2,
  "hotel-hankyu-respire-osaka": 2, "hotel-vischio-shin-osaka": 2,

  // ── 大阪衣 R3 (Sprint 17.7 R3・63 → 83) ──────────────────
  // Rank 3:京阪百貨店 + 千里セルシー + アトレ + キンジ + 阿倍野本通 + IKEA
  "keihan-dept-moriguchi": 3, // 京阪沿線唯一百貨店
  "senri-celcy": 3, // 関西最古級 SC
  "atre-osaka-2024": 3, // 2024 最新 + JR 東日本系
  "kinji-tempozan": 3, // 大阪最大古着
  "abeno-honmachi-shotengai": 3, // 関西第三規模商店街
  "ikea-tsuruhama": 3, // 関西初 IKEA
  "tower-records-namba": 3, // 関西最大 CD
  // Rank 2:R3 補完 13 件
  "takashimaya-sakai-store": 2,
  "aeon-mall-osaka-dome-city": 2, "aeon-mall-shijonawate": 2,
  "ekimaru-osaka-1-4-bld": 2, "namba-zaza-fashion": 2,
  "chicago-namba": 2, "spinns-osaka-amerikamura": 2,
  "fukushima-shotengai": 2, "tamatsukuri-shotengai": 2,
  "tanimachi-yon-shotengai": 2,
  "tokyu-hands-shinsaibashi": 2, "bookoff-namba": 2,
  "solaha-tennoji": 2,

  // ── 大阪食 R2 (Sprint 17.1 R2・41 → 63) ──────────────────
  // Rank 3:大阪洋食三巨頭 + りくろー + デパ地下 阪神 + 鳥貴族 + 春駒 + とよ + 横綱
  "jiyuken-1910-namba": 3, // 大阪洋食発祥
  "hokkyokusei-1922-shinsaibashi": 3, // オムライス発祥
  "meijiken-1925-shinsaibashi": 3,
  "rikuro-ojiisan-1955-namba": 3, // 大阪土産 No.1
  "hanshin-depachika-umeda-amakunai": 3, // イカ焼発祥・庶民派
  "tori-kizoku-honten-osaka": 3, // 焼鳥チェーン創業地
  "tachi-nomi-haruko-tenma": 3, // 立ち寿司聖地
  "izakaya-toyo-tsuruhashi": 3, // YouTube 世界的話題
  "ramen-yokozuna-honten": 3, // 関西豚骨醤油老舗
  "okonomiyaki-tsuruhashi-fugetsu-1948": 3, // 鶴橋お好み焼チェーン本店
  // Rank 2:R2 補完 12 件
  "okonomiyaki-yukari-dotonbori": 2, "takoyaki-juhachiban-honten": 2,
  "ramen-kinkyuemon-dotonbori": 2, "ramen-jinrui-mina-menrui": 2,
  "menya-jou-roku-tennoji": 2,
  "ippinkou-tsuruhashi": 2,
  "sakimoto-honmachi-shokupan": 2, "tsukikesho-namba": 2, "gokan-kitahama-1992": 2,
  "takashimaya-namba-depachika": 2, "hankyu-depachika-umeda": 2,
  "tendon-makino-osaka": 2,

  // ── 大阪行 R3 (Sprint 17.4 R3・60 → 84) ──────────────────
  // Rank 3:大阪モノレール本線 + 新大阪 + 大阪周遊パス + ICOCA + 関空リムジン + 関空アクセス比較
  "osaka-monorail-honsen": 3, // 世界最長モノレール
  "shin-osaka-station-hub": 3, // 新幹線関西始発
  "osaka-shuyu-pass": 3, // 大阪 No.1 観光パス
  "icoca-card-system": 3, // 関西広域 IC
  "kix-limousine-bus": 3, // 関空リムジン
  "kix-to-osaka-routes": 3, // 関空アクセス比較
  "osaka-castle-gozabune": 3, // 大阪城観光船
  "umeda-osaka-east-station": 3, // 2025 うめきた 2 期
  // Rank 2:R3 補完 16 件
  "osaka-monorail-saito-line": 2,
  "jr-yamatoji-line": 2, "jr-gakkentoshi-line": 2, "jr-fukuchiyama-line": 2,
  "senri-chuo-station-hub": 2, "hotarugaike-station-hub": 2,
  "kadomashi-station-hub": 2, "uehonmachi-station-hub": 2,
  "takatsuki-shi-station-hub": 2, "ibaraki-shi-station-hub": 2, "fuse-station-hub": 2,
  "osaka-metro-1day-pass": 2,
  "osaka-open-bus-tour": 2, "tempozan-usj-shuttle-bay": 2,
  "itami-to-osaka-routes": 2,
  "hubchari-osaka-share-bike": 2,

  // ── 大阪楽 R3 (Sprint 17.6 R3・73 → 91) ──────────────────
  // Rank 3:LEGOLAND + USJ ドンキーコング 2024 + 大阪マラソン + 春場所 + 万博コスモス + 中之島バラ
  "lego-discovery-center-osaka": 3,
  "usj-donkey-kong-country": 3,
  "osaka-marathon-march": 3,
  "osaka-grand-sumo-haru-basho": 3,
  "expo-park-cosmos-october": 3,
  "nakanoshima-park-bara-spring": 3,
  "hattori-ryokuchi-sakura": 3,
  // Rank 2:R3 補完 11 件
  "bornelund-asobi-tsurumi": 2, "nhk-osaka-bk-plaza": 2,
  "daisen-koen-koyo": 2, "ikeda-jo-koen-koyo": 2, "takatsuki-shiroyama-koyo": 2,
  "nakanoshima-park-bara-autumn": 2,
  "expo-park-azalea-spring": 2,
  "spa-suminoe": 2, "naniwanoyu-tenma": 2,
  "kawachi-fig-autumn": 2, "osaka-strawberry-greenhouse-winter": 2,

  // ── 兵庫食 R1 (Sprint 18.1 食・0 → 26) ──────────────────
  // Rank 3:神戸ステーキ ミソノ + モロゾフ + ユーハイム + 剣菱 + 揖保乃糸 + ヒガシマル + 明石焼 + WAKKOQU
  "misono-kobe-1945": 3, // 世界初 鉄板焼発祥
  "morozoff-1931-honten": 3, // バレンタイン日本初提唱
  "juchheim-1909-honten": 3, // バウムクーヘン日本初
  "kenbishi-1505": 3, // 現存最古日本酒蔵元
  "ibonoito-tatsuno-1418-shiryokan": 3, // 600 年余そうめん
  "higashimaru-shoyu-1666": 3, // 薄口醤油発祥
  "akashiyaki-honke-kikuyo-1949": 3, // 明石焼老舗
  "mooria-honten-shinkobe": 3, // 神戸ステーキ最古 1885
  "wakkoqu-kobe-1962": 3, // 北野異人館街
  "donq-1905-kobe-honten": 3, // 日本フランスパン文化起源
  // Rank 2:R1 補完 16 件
  "kobe-plaisir-toranomon-honten": 2,
  "goncharoff-1923-honten": 2, "freundlieb-1924-kobe": 2,
  "kobe-fugetsudo-1897": 2, "kobe-isuzu-bakery-1946": 2,
  "kikumasamune-kinenkan-1659": 2, "hakushika-kinenkan-1662": 2,
  "hakutsuru-shiryokan-1743": 2, "ozeki-shuzo-1711": 2, "sawanotsuru-shiryokan-1717": 2,
  "minori-honten-nankinmachi": 2, "grill-ippei-1952-kobe": 2,
  "nishimura-coffee-1948-honten": 2, "tor-road-delicatessen-1957-kobe": 2,
  "yamasakamaboko-1916": 2,
  "ho-mei-shuzo-1797-sasayama": 2,

  // ── 兵庫住 R1 (Sprint 18.2 住・0 → 29) ──────────────────
  // Rank 3:オークラ神戸 + ANA クラウン神戸 + ポートピア + 三木屋志賀直哉 + 西村屋本館 + 御所坊 1191 + ウェスティン淡路 2024 + 姫路日航
  "okura-kobe-1989": 3,
  "ana-crowne-plaza-kobe-1990": 3, // 新神戸駅直結
  "portopia-hotel-kobe-1981": 3, // 関西最大級・神戸ポートピア博覧会同時
  "mikiya-kinosaki-1781": 3, // 志賀直哉舞台
  "nishimuraya-honkan-1858": 3, // 城崎登録文化財
  "goshobo-arima-1191": 3, // 日本最古級旅館
  "westin-awaji-2024": 3, // 安藤忠雄・最新リブランド
  "hotel-nikko-himeji-1995": 3, // 姫路最高級
  "la-suite-kobe-2009": 3, // オールスイート
  "kobe-kitano-hotel-1998": 3, // 世界一の朝食
  // Rank 2:R1 補完 19 件
  "bay-sheraton-kobe-1992": 2, "meriken-park-oriental-1995": 2,
  "mitsui-garden-kobe-sannomiya-2008": 2,
  "dormy-inn-kobe-motomachi": 2, "apa-hotel-kobe-sannomiya": 2,
  "toyoko-inn-kobe-sannomiya": 2, "richmond-hotel-kobe-2010": 2,
  "nishimuraya-shogetsuken": 2, "mikuniya-kinosaki-1851": 2,
  "hyoe-koyokaku-1587": 2, "nakanobou-zuien-arima": 2,
  "gekkoen-kokorokan-arima-1955": 2, "arima-grand-hotel-1985": 2,
  "hotel-monterey-himeji-2008": 2, "apa-himeji-ekimae": 2,
  "hotel-newawaji-1976": 2,
  "takarazuka-hotel-1926": 2, "hotel-hewitt-koshien-1992": 2,
  "asanoya-yumura-1300yr": 2,

  // ── 兵庫育 R1 (Sprint 18.3 育・0 → 39) ──────────────────
  // Rank 3:姫路城世界遺産 + 北野異人館 + 赤穂浪士 + 伊弉諾神宮 + 城崎志賀直哉 + 竹田城天空 + 圓教寺ラストサムライ
  "himeji-jo": 3, // 世界遺産・国宝
  "kazami-dori-no-yakata-1909": 3, // 北野異人館代表
  "ako-jo-ato": 3, // 忠臣蔵領地
  "ako-oishi-jinja-1900": 3, // 47 義士祀
  "izanagi-jingu-awaji": 3, // 国生み神話・最古
  "shiga-naoya-monument-kinosaki": 3, // 城の崎にて
  "takeda-jo-ato-asago": 3, // 天空の城
  "shoshazan-engyoji-966": 3, // 国宝 + ラストサムライロケ
  "kobe-port-tower-1963": 3, // 神戸港シンボル
  "minatogawa-jinja-1872": 3, // 楠木正成
  "ikuta-jinja": 3, // 神戸地名由来
  "kitano-ijinkan-1868-overview": 3, // 北野異人館街概論
  "nankinmachi-1868-history": 3, // 日本三大中華街
  "ako-rosi-shi-overview": 3, // 忠臣蔵物語
  "hito-to-bosai-2002": 3, // 阪神淡路大震災記念
  // Rank 2:R1 補完 24 件
  "moegi-no-yakata-1903": 2, "raine-no-yakata-1907": 2,
  "uroko-no-ie-1885": 2, "ben-no-yakata-1902": 2, "england-yakata-1907": 2,
  "former-foreign-settlement-15": 2, "kobe-mosque-1935": 2,
  "kobe-shiritsu-hakubutsukan": 2, "kobe-fashion-museum-1997": 2,
  "kobe-port-museum-1992": 2,
  "nagata-jinja": 2,
  "shoyo-en-himeji-1991": 2, "tatsuno-shiroyama-jo": 2,
  "ikuno-kozan-1542": 2, "izushi-shiroyama-1604": 2,
  "sasayama-jo-ato-1609": 2, "sasayama-jokamachi": 2, "tanba-sasayama-rekishi-museum": 2,
  "awaji-ningyo-joruri-yakata": 2,
  "nishinomiya-jinja-fukuotoko": 2, "koshien-rekishikan-1924": 2,
  "taisan-ji-kobe-1331": 2,
  "miki-kanamono-history": 2, "tatsuno-shoyu-no-machi": 2,

  // ── 兵庫楽 R1 (Sprint 18.4 楽・0 → 30) ──────────────────
  // Rank 3:神戸ハーバー + ルミナリエ + 有馬金の湯 + 姫路桜 + 鳴門渦潮 + 1000 万ドル夜景 + 甲子園 + 淡路花さじき
  "kobe-harborland-1992": 3,
  "kobe-luminarie-1995": 3, // 震災追悼イルミ
  "arima-kin-no-yu": 3, // 有馬温泉公衆湯
  "himeji-jo-sakura": 3, // 世界遺産白鷺城桜
  "naruto-uzunoki-cruise": 3, // 世界最大級渦潮
  "mt-maya-1000man-night": 3, // 1000 万ドル夜景発祥
  "hanshin-koshien-stadium-1924": 3, // 100 年高校野球聖地
  "awaji-hanasajiki-1998": 3, // 15 ha 花畑
  "atoa-kobe-2021": 3, // 新型水族館
  "minato-kobe-fireworks": 3, // 神戸港 8 月花火
  // Rank 2:R1 補完 20 件
  "mosaic-kobe-1992": 2,
  "arima-gin-no-yu": 2, "arima-tansan-park-1925": 2,
  "arima-onsen-momiji": 2, "shoshazan-engyoji-momiji": 2,
  "awaji-yumebutai-2000": 2, "nunobiki-herb-park-1991": 2,
  "himeji-castle-night-illumi": 2,
  "kobe-fruit-flower-park-1991": 2, "kobe-anpanman-museum-2013": 2,
  "kobe-oji-zoo-1951": 2,
  "kobe-marathon-2011": 2,
  "naruto-bridge-1985": 2,
  "mt-rokko-nightview": 2,
  "kinosaki-matsuba-gani-winter": 2, "tajima-beef-tour": 2, "awaji-onion-summer": 2,
  "shin-kobe-ropeway": 2, "kobe-bay-concerto-cruise": 2,
  "takeda-jo-unkai-autumn": 2,

  // ── 兵庫衣 R1 (Sprint 18.5 衣・0 → 19) ──────────────────
  // Rank 3:大丸神戸 + 神戸阪急 + 元町 + umie + 西宮ガーデンズ + 神戸三田 + 北野工房
  "daimaru-kobe-1913": 3,
  "kobe-hankyu-2019": 3,
  "motomachi-shotengai": 3, // 神戸最古アーケード
  "kobe-harborland-umie": 3,
  "nishinomiya-gardens-2008": 3, // 関西最大級駅前
  "kobe-sanda-premium-outlets-2007": 3, // 関西最大プレミアム
  "kitano-koubou-1998": 3, // 登録文化財
  "tor-road-kobe": 3, // 神戸開港 European
  "piole-himeji-2017": 3,
  // Rank 2:R1 補完 10 件
  "sannomiya-center-gai": 2,
  "mint-kobe-2006": 2, "sannomiya-opa-2008": 2,
  "kobe-international-1999": 2, "kobe-fashion-mart-1996": 2,
  "mitsui-outlet-marinepia-1999": 2,
  "miyuki-dori-himeji-1934": 2, "grand-festa-himeji-2003": 2,
  "lalaport-koshien-2008": 2,
  "arima-onsen-omiyage-shotengai": 2,

  // ── 兵庫行 R1 (Sprint 18.6 行・0 → 25) ──────────────────
  // Rank 3:神戸空港 + 新神戸 + 三宮 + 姫路 + 山陽新幹線 + 明石海峡大橋 + ポートライナー + 神戸電鉄
  "kobe-airport-2006": 3,
  "shin-kobe-station-1972": 3, // 山陽新幹線兵庫始発
  "kobe-sannomiya-station": 3, // 神戸都心 5 線集結
  "himeji-station-jr": 3, // 姫路城世界遺産アクセス
  "jr-sanyo-shinkansen-hyogo": 3,
  "akashi-kaikyo-bridge-1998": 3, // 世界最長吊橋
  "port-liner-1981": 3, // 日本初新交通 AGT
  "kobe-densha-arima-line": 3, // 有馬温泉アクセス
  "kobe-subway-seishin-yamate-1977": 3, // 神戸地下鉄初路線
  "sanyo-electric-railway": 3, // 阪神 - 山陽直通
  // Rank 2:R1 補完 15 件
  "motomachi-station-kobe": 2, "kobe-station-jr": 2,
  "amagasaki-station-jr-hanshin": 2, "nishinomiya-kitaguchi-hankyu": 2,
  "takarazuka-station": 2, "toyooka-station-jr": 2,
  "kinosaki-onsen-station": 2, "shinkaichi-station-hub": 2,
  "jr-sanyo-honsen-hyogo": 2, "jr-banshin-line": 2,
  "kobe-subway-kaigan-line-2001": 2,
  "hankyu-imazu-line": 2,
  "kobe-city-loop-bus": 2,
  "kix-shuttle-bus-kobe": 2,
  "honshu-shikoku-bus-naruto-route": 2,

  // ── 兵庫 R2 補完 (Sprint 18 R2・168 → 180) ──────────────────
  // Rank 3:駅弁発祥 + 鶴林寺国宝 + 中山寺安産日本一 + 摩耶ケーブル日本最古 + ピエナ朝食 No.1
  "maneki-shokuhin-1888-himeji": 3, // 日本初駅弁発祥
  "kakurinji-kakogawa": 3, // 国宝・播磨の法隆寺
  "nakayamaji-takarazuka": 3, // 日本一安産祈願
  "maya-cable-1925": 3, // 日本最古現役ケーブル
  "piena-kobe-1996": 3, // 日本朝食 No.1
  "ginsuiso-choraku-arima-1959": 3, // 有馬最大級
  // Rank 2:R2 補完 6 件
  "konigskrone-1977-kobe": 2, "fukuya-izushi-soba-honten": 2,
  "kiyomizu-dera-banshu-kasai": 2,
  "mt-rokko-cable-1932": 2,
  "nishi-akashi-station": 2, "ako-station-jr": 2,

  // ── 兵庫 R3 (Sprint 18 R3・180 → 192) ──────────────────
  // Rank 3:三田屋 + 福寿ノーベル + 玄武洞 + 動物王国 + 神戸高速鉄道 + 神戸文学館
  "mita-honten-1976": 3, // 三田牛ステーキ専門
  "fukuju-shushinkan-1751": 3, // 2008 ノーベル晩餐酒
  "genbudou-toyooka": 3, // 国指定天然記念物・地磁気逆転発見地
  "kobe-doubutsu-okoku-2014": 3, // 体験型動物園
  "kobe-rapid-transit-1968": 3, // 4 社接続要路線
  "kobe-bungakukan-1904": 3, // 関学旧チャペル登録文化財
  // Rank 2:R3 補完 6 件
  "antenor-1978-kobe": 2,
  "yamate-8-bankan-1907": 2,
  "motomachi-koukashita-shotengai": 2,
  "shintetsu-aoo-line": 2, "hojo-tetsudo": 2,
  "arima-kosenkaku-1969": 2,

  // ── 兵庫 R4 (Sprint 18 R4・192 → 201)・食/住強化 ──────────────────
  // Rank 3:出石酒造 1708 + ノーベル福寿 R3 + サウザンド神戸 + 山本屋 1908
  "izushi-shuzo-1708": 3, // 但馬唯一の酒蔵
  "yamamotoya-honkan-kinosaki-1908": 3, // 城崎登録文化財旅館
  "the-thousand-kobe-2008": 3, // 三宮駅前ラグジュアリー
  "mitsumori-honpo-arima-1907": 3, // 有馬炭酸せんべい本家
  "mt-rokko-ranch-1976": 3, // 都市近郊高原牧場
  // Rank 2:R4 補完 4 件
  "nadakiku-shuzo-1910-himeji": 2,
  "kobe-pudding-1991": 2,
  "setre-kobe-2014": 2,
  "kakogawa-station-jr": 2,

  // ── 兵庫 R5 (Sprint 18 R5・201 → 210)・育/楽強化 ──────────────────
  // Rank 3:一乗寺国宝 + 須磨寺源平 + 宝塚大劇場 + 永楽館近畿最古芝居小屋
  "ichijoji-kasai-650": 3, // 国宝三重塔
  "sumadera-986-kobe": 3, // 源平合戦聖地
  "takarazuka-grand-theater-1924": 3, // 全国唯一女性のみ歌劇団
  "eirakukan-izushi-1901": 3, // 近畿最古芝居小屋
  "miki-castle-1335": 3, // 秀吉三木合戦・国指定史跡
  "oriental-hotel-kobe-2010": 3, // 1870 系譜・神戸最古級
  // Rank 2:R5 補完 3 件
  "ikaruga-dera-tateaiba-taishi": 2,
  "mt-rokko-snow-park": 2,
  "hagiwara-coffee-1928-kobe": 2,

  // ── 兵庫 R6 (Sprint 18 R6・210 → 219)・衣/行強化 ──────────────────
  // Rank 3:イオン尼崎関西最大 + 明石駅標準時 + ニッケパーク関西最古モール + フラワーセンター
  "aeon-mall-amagasaki-2009": 3, // 関西最大級イオン
  "akashi-station-jr": 3, // 標準時子午線・海峡大橋アクセス
  "nikke-park-town-itami-1985": 3, // 関西最古級モール
  "kasai-flower-center-1985": 3, // 西日本最大級植物園
  "ako-line-jr-1962": 3, // 忠臣蔵 + 瀬戸内海ルート
  // Rank 2:R6 補完 4 件
  "aeon-mall-itami-2007": 2, "aeon-mall-kobe-kita-2008": 2,
  "aeon-mall-himeji-rivercity-2007": 2,
  "tarumi-station-jr": 2,

  // ── 沖縄補完 (老卷補完・行/衣強化) ──────────────────
  // Rank 3:那覇バスT 4 社統合 + おもろまち + 石垣港 + リウボウ + DFS
  "naha-bus-terminal-2018": 3, // 4 社統合 hub
  "yui-rail-omoromachi-station": 3, // 那覇新都心 DFS 直結
  "ishigaki-port-rito-terminal-2007": 3, // 八重山 7 離島基地
  "ryubo-departstore-1953-naha": 3, // 沖縄唯一百貨店
  "dfs-galleria-okinawa-2004": 3, // 国内唯一市中免税店
  "naha-main-place-2002": 3, // 沖縄最大級モール
  // Rank 2:補完 3 件
  "yui-rail-makishi-station": 2, "yui-rail-asahibashi-station": 2,
  "nago-bus-terminal": 2,

  // ── 北海道楽 補完 ──────────────────
  // Rank 3:ガリンコ号 + ニッカ余市マッサン + 阿寒アイヌコタン + 摩周湖 + 知床クルーズ
  "okhotsk-monbetsu-garinko-go": 3, // 流氷砕氷船
  "nikka-yoichi-distillery-1934": 3, // マッサン・国登録文化財
  "akan-ainu-kotan": 3, // ユネスコ古式舞踊
  "shiretoko-cruise-summer": 3, // 世界自然遺産
  "mashu-ko-observatory": 3, // 世界透明度湖
  "shikaribetsu-kotan-winter": 3, // 氷上集落
  // Rank 2:補完 2 件
  "sapporo-odori-beer-garden": 2,
  "hakodate-yunokawa-onsen-1453": 2,

  // ── 大阪育 R3 (Sprint 17.5 R3・120 → 138) ──────────────────
  // Rank 3:愛染堂 + 久安寺 + 鴻池新田会所 + 東洋陶磁美 + 聖霊会舞楽 + 河内音頭
  "aizen-do-shitennoji": 3, // 愛染祭祭場
  "kyu-an-ji-ikeda": 3, // 重源 + 北摂モミジ
  "konoike-shinden-kaisho": 3, // 国指定史跡
  "osaka-toyou-touji-bijutsukan": 3, // 国宝 2
  "shoryoue-bugaku-shitennoji": 3, // 1500 年余古典舞楽
  "kawachi-ondo-bonodori": 3, // 府指定無形文化財
  "osaka-houhei-koushou-ato": 3, // 登録文化財
  // Rank 2:R3 補完 11 件
  "enmei-ji-kawachinagano": 2, "naritasan-osaka-betsuin": 2, "migukurumitama-jinja": 2,
  "nakatsuyama-kofun": 2, "kuromiya-kofun-sakai": 2,
  "hanshin-expressway-route1-1964": 2,
  "osaka-furitsu-jidou-bungakukan": 2, "osaka-furitsu-chuo-toshokan": 2,
  "osaka-karaki-sashimono": 2,
  "osaka-craft-park-hirano": 2,
  "kawaguchi-foreign-settlement": 2,

  // ── 静岡県 食類 (Sprint 19.1 R1) ──────────────────
  // Rank 3:静岡食の最大代表(発祥・最古老舗・全国 1 位産業・B-1 連覇)
  "honyama-cha-shizuoka-1241": 3, // 1241 駿河茶発祥・聖一国師
  "yui-sakura-ebi-port": 3, // 世界唯一桜えび漁場
  "utogi-wasabi-1607": 3, // 1607 わさび栽培発祥・徳川献上
  "unagi-yaotoku-1869-hamamatsu": 3, // 浜松うなぎ最古 1869
  "unagi-sakuraya-1856-mishima": 3, // 三島うなぎ最古 1856
  "shizuoka-oden-aoba-yokocho": 3, // 静岡おでん聖地・戦後闇市発祥
  "fujinomiya-omiya-yokocho": 3, // 富士宮焼きそば B-1 連覇 2006-07
  "shunkado-unagi-pie-1961": 3, // うなぎパイ 1961 全国区静岡銘菓
  "tamaruya-honten-1875": 3, // わさび漬最古 1875
  "ishibeya-1804-abekawa-mochi": 3, // 安倍川もち発祥 1804
  "isojiman-yaizu-1830": 3, // 静岡銘酒最高峰 1830
  "yaizu-sakana-center": 3, // 焼津カツオ全国 1 位
  "shimizu-kashi-no-ichi-1995": 3, // 清水マグロ全国 1 位
  "shimoda-kinmedai-fujimi-shokudo": 3, // 下田金目鯛全国 1 位水揚
  // Rank 2:有力名店・食材代表
  "unagi-atsumi-1907-hamamatsu": 2, // 浜松うなぎ百年老舗 1907
  "unagi-nakagawaya-hamamatsu": 2, // 浜松うなぎ大正期老舗
  "unagi-suminobou-mishima": 2, // 三島うなぎ二強
  "shizuoka-oden-obachan": 2, // 青葉横丁代表
  "shizuoka-oden-haikara-yokocho": 2, // 青葉おでん街老舗
  "fujinomiya-yakisoba-yumura": 2, // 富士宮焼きそば老舗
  "fujinomiya-yakisoba-yuguchi": 2, // 富士宮焼きそば学会公認
  "numazu-uogashi-marutori-honten": 2, // 沼津港海鮮丼代表
  "yui-hama-kakiage-ya": 2, // 由比港桜えびかき揚げ
  "kaiun-doi-shuzo-1872": 2, // 開運 1872 能登杜氏
  "takasago-numazu-1842": 2, // 富士伏流水酒 1842
  "ishimatsu-gyoza-hamamatsu": 2, // 浜松餃子代表 1953
  "mutsugiku-hamamatsu": 2, // 浜松餃子双璧 1962
  "mishima-corokke-bbazaru": 2, // 三島馬鈴薯 B 級

  // ── 静岡県 住類 (Sprint 19.2 R1) ──────────────────
  // Rank 3:静岡住の最上位(伊豆温泉最古老舗・文学聖地・登録文化財)
  "furuya-ryokan-1806-atami": 3, // 熱海最古 1806
  "asaba-ryokan-1675-shuzenji": 3, // 修善寺最古 1675・能舞台・Relais&Chateaux
  "arai-ryokan-1872-shuzenji": 3, // 漱石定宿・登録文化財 13 棟
  "kikuya-ryokan-shuzenji": 3, // 漱石「修善寺の大患」舞台
  "ochiairou-1874-yugashima": 3, // 1874・登録文化財 19 棟・芥川/与謝野ゆかり
  "yumotokan-yugashima": 3, // 川端康成『伊豆の踊子』執筆地
  "kawana-hotel-1936-ito": 3, // 1936 大倉喜七郎・世界 100 大ゴルフコース
  "atami-horai-1932": 3, // 熱海ハイエンド 1932・Relais&Chateaux
  "okura-act-city-hamamatsu-1994": 3, // 浜松 45F ランドマーク 1994
  // Rank 2:有力老舗・代表級宿
  "tsuruya-ryokan-atami": 2, // 熱海老舗
  "hotel-new-akao-1973": 2, // 昭和歌謡聖地 1973
  "ono-yakata-honkan-ito": 2, // 伊東木造 4F 文化財 1925
  "dankoen-ryokan-ito": 2, // 伊東中堅老舗
  "kurofune-hotel-shimoda": 2, // 下田開国コンセプト
  "izu-imaihama-tokyu-resort": 2, // 河津今井浜海辺リゾート
  "tokinosumika-gotemba": 2, // 御殿場大型温泉リゾート 1996
  "hotel-clad-gotemba-2019": 2, // 御殿場アウトレット隣接 2019
  "fujisan-mishima-tokyu-2018": 2, // 三島駅前 2018 東急
  "hotel-associa-shizuoka-1996": 2, // 静岡駅直結 JR 東海ホテル
  "shizuoka-grand-nakajima-1955": 2, // 静岡老舗 1955
  "hotel-century-shizuoka": 2, // 静岡駅前 budget
  "hotel-crown-palais-hamamatsu": 2, // 浜松駅南口
  "hotel-concorde-hamamatsu": 2, // 浜松地元名門 1979
  "hotel-kokonoe-kanzanji": 2, // 舘山寺老舗
  "wellseason-hamanako-2007": 2, // 舘山寺リゾート 2007
  "sumatakyo-suikoen": 2, // 寸又峡夢の吊橋玄関
  "minamiizu-iromura-tsuti": 2, // 弓ヶ浜民宿
  "nishiizu-koibitomisaki-minshuku": 2, // 西伊豆夕陽民宿

  // ── 静岡県 衣類 (Sprint 19.3 R1) ──────────────────
  // Rank 3:遠州織物・伝統工芸・最大級アウトレット
  "enshu-orimono-overview": 3, // 遠州織物概論・全国 3 大綿織物産地
  "enshu-shima-traditional": 3, // 遠州縞・縞帖の代表柄
  "kakegawa-kuzufu-overview": 3, // 掛川葛布・日本唯一の現存葛布産地
  "suruga-take-sensuji-zaiku-1844": 3, // 駿河竹千筋細工 1844・経産大臣指定
  "matsuzakaya-shizuoka-1932": 3, // 1932 老舗百貨店
  "gotemba-premium-outlets-2000": 3, // 全国最大級アウトレット 2000
  "kakegawa-yamanashiya-1812": 3, // 葛布最古老舗 1812
  // Rank 2:有力施設・伝統継承
  "suruga-shikki-tegaki-edo": 2, // 駿河漆器・江戸期発祥
  "shin-shizuoka-cenova-2011": 2, // 静鉄系 2011
  "shizuoka-parco-2007": 2, // 静岡パルコ 2007
  "marui-shizuoka": 2, // 静岡 0101
  "enstetsu-dept-hamamatsu-1988": 2, // 浜松最大級百貨店 1988
  "meione-hamamatsu-1988": 2, // 浜松駅ビル 1988
  "zaza-city-chuo-hamamatsu": 2, // 浜松繁華街 mall 1996
  "ion-mall-hamamatsu-shitoro": 2, // 浜松志都呂 2005
  "ion-mall-fuji": 2, // 富士宮 2003
  "atami-ginza-shotengai": 2, // 熱海銀座
  "shimoda-perry-road": 2, // 下田開国 1854
  "shizuoka-aoba-shotengai": 2, // 静岡呉服町
  "mishima-eki-mae-shotengai": 2, // 三島駅前
  "ikedaya-shizuoka-kimono": 2, // 静岡呉服町老舗
  "atami-yukata-onsen-rental": 2, // 熱海浴衣文化
  "shuzenji-yukata-rental-area": 2, // 修善寺浴衣
  "suruga-kogei-center-shizuoka": 2, // 駿河工芸センター
  "izu-kogen-art-craft-zone": 2, // 伊豆高原クラフト
  "shimoda-perry-tee-souvenir": 2, // 下田 t-shirt 観光土産
  "fujisan-souvenir-shop-area": 2, // 富士山 t-shirt 観光土産
  "enshu-jeans-makers-modern": 2, // 浜松現代ジーンズ

  // ── 静岡県 育類 (Sprint 19.4 R1) ──────────────────
  // Rank 3:静岡育の最大代表(世遺・国宝・経産大臣指定・全国級美術館)
  "fujisan-world-heritage-2013": 3, // 富士山世遺概論
  "fujisan-hongu-sengen-taisha": 3, // 駿河国一宮・浅間神社総本社・徳川 1604 本殿
  "miho-no-matsubara": 3, // 三保松原・羽衣伝説・国指定名勝
  "shiraito-no-taki": 3, // 国指定名勝+天然記念物・富士山世遺
  "kuno-zan-toshogu-1616": 3, // 国宝本殿・家康初葬地
  "sumpu-jo-park": 3, // 駿府城・家康大御所政治拠点
  "shizuoka-sengen-jinja-three": 3, // 26 棟重文・家康元服地
  "nirayama-hansharo-1854": 3, // 2015 世界遺産・国指定史跡・国内唯一現存反射炉
  "ryosenji-1854-shimoda": 3, // 1854 日米下田条約締結地・国指定史跡
  "gyokusenji-1856-shimoda": 3, // 初代米総領事館・国指定史跡
  "egawatei-nirayama": 3, // 重文 8 棟・江川英龍
  "mishima-taisha-ichinomiya": 3, // 伊豆国一宮・1180 頼朝挙兵祈願
  "moa-museum-1982-atami": 3, // 国宝 3 件(紅白梅図屏風)・全国級
  "shizuoka-prefectural-museum": 3, // ロダン館 32 点・全国級
  "hamamatsu-music-museum-1995": 3, // 日本初の公立楽器博物館・1500 点
  "toro-iseki-yayoi": 3, // 国指定特別史跡・1947 発見
  "totomi-kokubunji-iwata": 3, // 国指定特別史跡・奈良時代
  "izu-bungaku-park-yugashima": 3, // 井上靖記念館・伊豆文学聖地
  // Rank 2:有力史跡・寺社・美術館・祭礼
  "fujisan-shizuoka-routes": 2, // 富士登山 3 ルート
  "rinzaiji-tokugawa-childhood": 2, // 家康幼少期・特別公開のみ
  "okuni-jinja-mori": 2, // 遠江国一宮
  "hiroshige-tokaido-museum-yui": 2, // 由比・東海道広重専門
  "shiseido-art-house-kakegawa": 2, // 1978・無料近代美術
  "amagi-tunnel-tenjokoe": 2, // 重文・伊豆の踊子+天城越え
  "izu-no-odoriko-shimoda": 2, // 川端康成『伊豆の踊子』終結地
  "kiunkaku-1919-atami": 2, // 大正期別荘建築・志賀直哉
  "shimoda-kurofune-matsuri-1934": 2, // 1934 開始・米軍参加日米友好祭
  "shizuoka-matsuri-ieyasu": 2, // 1957 開始・家康行列

  // ── 静岡県 楽類 (Sprint 19.5 R1) ──────────────────
  // Rank 3:富士山眺望代表・全国級・国指定
  "nihondaira-ropeway-yakei": 3, // 国指定名勝・夜景 100 選・隈研吾 2018
  "satta-toge-hiroshige-view": 3, // 広重浮世絵原画地・現存
  "mishima-skywalk-2015": 3, // 日本最長歩行者専用吊橋 400m
  "kawazu-zakura-matsuri": 3, // 全国級早咲き桜 8000 本
  "izu-shaboten-1959": 3, // カピバラ温泉発祥地
  "numazu-shinkai-aquarium": 3, // 国内唯一の深海専門水族館
  "oigawa-tetsudo-sl": 3, // 国内最大級現役 SL
  "atami-kaijo-fireworks": 3, // 年 12+ 回・1952 開始
  "tokinosumika-illumination": 3, // 全国 5 大級 600 万球
  "yumeno-tsuribashi-sumatakyo": 3, // 寸又峡コバルトブルー
  "shirahama-beach-shimoda": 3, // 伊豆 No.1・日本の渚 100 選
  "joren-no-taki-amagi": 3, // 日本の滝百選・天城越え歌詞
  // Rank 2:有力観光地・テーマパーク
  "osezaki-jinike-suruga": 2, // 神池天然記念物・西伊豆富士絶景
  "hamanako-pal-pal": 2, // 浜名湖大型遊園地 1959
  "izu-grandparis": 2, // 伊豆高原大型レジャー
  "fujikyu-grinpa-yamabe": 2, // 富士山麓家族遊園地
  "shimoda-aquarium": 2, // 湾内浮遊水族館 1967
  "nihondaira-zoo-shizuoka": 2, // 静岡市民動物園
  "tenryu-hamanako-rail": 2, // 国登録文化財駅舎多数
  "izukyu-resort-21": 2, // 伊豆東海岸観光列車
  "shimizu-minato-fireworks": 2, // 静岡市最大花火 1947
  "omaezaki-surfing": 2, // 全国級サーフポイント
  "shuzenji-niji-no-sato": 2, // 修善寺花の郷
  "ekopa-stadium-iwata": 2, // W 杯ラグビー 2019・5 万人収容
  "hatsushima-atami-pica": 2, // 熱海離島リゾート
  "ito-marina-town": 2, // 伊東港 道の駅 hub
  "numazu-goyotei-park": 2, // 明治皇族別荘・国指定名勝
  "kawazu-nanadaru-7falls": 2, // 伊豆の踊子作中地・天城七滝

  // ── 静岡県 行類 (Sprint 19.6 R1) ──────────────────
  // Rank 3:静岡行の最大代表(動脈・歴史的初・全国級)
  "tokaido-shinkansen-shizuoka-overview": 3, // 1964 開業・県内 6 駅・全国最多
  "shizuoka-station-hub-shinkansen": 3, // 県庁所在地 hub・1 日 12 万人
  "hamamatsu-station-hub-shinkansen": 3, // 遠江西部最大 hub・アクトシティ複合
  "atami-station-hub-shinkansen": 3, // 伊豆東岸玄関・観光客 70% 経由
  "izukyu-line-1961": 3, // 伊豆東岸大動脈
  "oigawa-tetsudo-overview-1925": 3, // 国内最大級 SL + アプト式
  "shizuoka-airport-2009": 3, // 2009 開港・FDA 本社
  "izuhakone-sunzu-line-1898": 3, // 伊豆地方最古私鉄 1898
  "shizuoka-tetsudo-line-1908": 3, // 静岡市最古私鉄 1908
  "tenryu-hamanako-line-1935": 3, // 国登録駅 17・遺産路線
  "gakunan-densha-1949": 3, // 鉄道夜景遺産全国初・富士山眺望
  "suruga-bay-ferry": 3, // 1958 開業・伊豆 access 短縮
  // Rank 2:有力路線・hub・パス
  "mishima-station-hub-shinkansen": 2, // 伊豆中部 + 箱根西側 hub
  "jr-tokaido-line-shizuoka": 2, // 在来線 200 km
  "jr-ito-line-1938": 2, // 1938・東京-下田直通連絡
  "jr-gotemba-line-1889": 2, // 1889・富士山眺望
  "enstetsu-line-1923": 2, // 浜松「赤電」1923
  "hatsushima-ferry-atami": 2, // 本州最近離島連絡
  "shizutetsu-just-line": 2, // 静岡市最大バス
  "enstetsu-bus-hamamatsu": 2, // 浜松最大バス
  "tokai-bus-izu-overview": 2, // 伊豆全域バス
  "shizuoka-tokyo-highway-bus": 2, // 静岡-東京高速バス
  "hamamatsu-tokyo-highway-bus": 2, // 浜松-東京高速バス
  "izukyu-2day-free-pass": 2, // 伊豆急 2 日フリー
  "tokai-bus-izu-2day-pass": 2, // 東海バス伊豆フリー
  "shimoda-cruise-susquehanna": 2, // 黒船型遊覧船
  "shizuoka-airport-shuttle-bus": 2, // 空港 5 路線リムジン
  "numazu-station-hub": 2, // 伊豆西側 + 富士南麓 hub

  // ── 静岡県 R2 補完 (Sprint 19.7) ──────────────────
  // Rank 3:遠州三山 + 浜松城 + 富士サファリ + 井川線アプト式 + 熱海梅園
  "hattasan-sonenji-fukuroi": 3, // 遠州三山筆頭 725
  "kasuisai-fukuroi": 3, // 遠州三山 1394・徳川家康寺号下賜
  "yuusanji-fukuroi": 3, // 遠州三山 749・三重文(山門/本堂/三重塔)
  "hamamatsu-jo-park": 3, // 出世城・家康若年居城 17 年
  "fuji-safari-park-susono-1980": 3, // 国内最大級サファリ
  "atami-baien-1886": 3, // 日本一早咲き梅+遅紅葉
  "oigawa-ikawa-line-abt": 3, // 日本唯一現役アプト式
  "crown-melon-fukuroi": 3, // 全国 1 位高級メロン
  // Rank 2:有力代表
  "mikkabi-mikan-hamamatsu": 2, // 全国 5 位温州みかん
  "hoshino-kai-anjin-2020": 2, // 星野リゾート 2020 熱海
  "hatoya-hotel-1947-ito": 2, // ハトヤ伊東元祖 1947・全国 CM
  "kuno-zan-ropeway-1957": 2, // 久能山ロープウェイ 1957

  // ── 静岡県 R3 補完 (Sprint 19.8) ──────────────────
  // Rank 3:世界級・国宝級・全国級
  "horai-bashi-1879-shimada": 3, // 世界最長木造歩道橋 897m・国登録
  "mishima-rakujuen-1890": 3, // 国指定名勝+天然記念物・名水百選
  "kakegawa-jo-1469": 3, // 全国 4 例木造復元天守 1994
  "kusanagi-jinja-shimizu": 3, // 草薙剣神話発祥地・大楠樹齢 1000 年
  "hamamatsu-flower-park-1970": 3, // 関西/中部最大級花テーマパーク
  "saphire-odoriko-e261-2020": 3, // プレミアム特急 2020
  // Rank 2:有力老舗・代表施設
  "fukyu-ya-numazu-hanpen-1916": 2, // 黒はんぺん老舗 1916
  "hoshino-kai-ito-2014": 2, // 星野リゾート界 伊東 2014
  "fujispeedway-hotel-2022": 2, // F1 サーキット隣接 Marriott
  "shizuoka-airport-tax-free": 2, // 国際線免税店
  "kakegawa-sai-festival-3year": 2, // 遠州三大祭・3 年に 1 度
  "shizutetsu-1day-pass": 2, // 静岡市交通万能パス

  // ── 静岡県 R4 補完 (Sprint 19.9) ──────────────────
  // Rank 3:全国 No.1・国指定・世遺構成資産
  "kuno-yama-ishigaki-ichigo": 3, // 全国唯一斜面石垣栽培法
  "kakegawa-fukamushi-cha-1959": 3, // 深蒸し製法発祥地・全国 1 位
  "suyama-sengen-jinja-fujisan": 3, // 富士山世遺構成資産
  "nakatajima-sakyu-hamamatsu": 3, // 国指定名勝・日本三大砂丘
  "ryuke-ji-shimizu-sotetsu": 3, // 国指定天然記念物蘇鉄・1100 年
  "fujikawa-rakuza-1996": 3, // 道の駅+SA連結・富士山絶景
  "hamanako-garden-park-2004": 3, // 浜名湖花博跡地 56ha 無料
  // Rank 2:有力代表
  "kambara-sakura-ebi-port": 2, // 由比と双璧の桜えび漁港
  "hoshino-resonare-atami-2009": 2, // ファミリー特化リゾート
  "san-hatoya-1972-ito": 2, // ハトヤ姉妹館 1972
  "odoriko-e257-tokyo-shuzenji": 2, // 特急踊り子 E257 1981
  "fujikyu-fujisan-5gome-bus": 2, // 富士山登山バス夏季限定

  // ── 静岡県 R5 補完 (Sprint 19.10) ──────────────────
  // Rank 3:富士山世遺・国指定・全国級
  "yamamiya-sengen-jinja-fujisan": 3, // 本殿無し遥拝所・富士山世遺
  "murayama-sengen-jinja-fujisan": 3, // 末代上人 12C 修験道発祥・富士山世遺
  "mishima-taisai-summer": 3, // 伊豆国一宮例祭・80 万人動員
  "shuzenji-takebayashi-night": 3, // 修善寺シンボル散策路
  "yurucan-asagiri-fujinomiya": 3, // 全国級アニメ聖地
  "shizuoka-eki-bento-tokai-1898": 3, // 静岡駅弁老舗 1898・全国級
  "toi-makizen-1750": 3, // 1750 創業・若山牧水ゆかり・登録文化財
  // Rank 2:有力老舗・代表
  "yaizu-katsuobushi-marushichi-1929": 2, // 焼津カツオ節老舗
  "oedo-onsen-atami-mizuhatei": 2, // 大江戸熱海大型チェーン
  "shuzenji-nenoyu-taisanso-1872": 2, // 修善寺中堅老舗 1872
  "hamamatsu-zoological-park-1950": 2, // 浜松動物園 1950
  "mishima-skywalk-zip-line-2017": 2, // ジップライン 560m
  "jr-shizuoka-rental-car": 2, // 駅レンタカー戦略
  "numazu-bus-terminal-hub": 2, // 沼津駅前バス hub
  "izuhakone-1day-pass": 2, // 伊豆箱根 1 日フリー

  // ── 静岡県 R6 補完 (Sprint 19.11) ──────────────────
  // Rank 3:歴史的代表・国指定・1607 創業
  "yui-shukuba-tokaido-16": 3, // 東海道 16 番宿・広重画題・現存
  "shouseitsu-konya-yui-1607": 3, // 1607 由井正雪生家・国登録
  "shijimi-tsuka-iseki-hamamatsu": 3, // 国指定史跡・西日本最大級縄文貝塚
  "omaezaki-lighthouse-1874": 3, // 1874・国登録・登れる灯台 16 基中
  "atami-pudding-2017": 3, // 観光土産代表・SNS全国級
  "shizuoka-airport-parking-free": 3, // 国内最大級 2000 台無料駐車
  // Rank 2:有力名宿・観光施設
  "resorpia-atami-1969": 2, // 大型温泉ホテル 1969
  "shuzenji-takitei-1925": 2, // 修善寺中堅老舗 1925
  "shizuoka-airport-domestic-shop": 2, // 国内線土産集積
  "oigawa-river-rapids-shimada": 2, // 大井川ラフティング
  "omaezaki-marine-park": 2, // 御前崎海浜公園
  "mishima-skywalk-bus-shuttle": 2, // スカイウォーク直行バス

  // ── 沖縄県 行類 R3 補完(老卷・Sprint 19.12)──────────────────
  // 45 → 55:ゆいレール残駅 + 空港 + 港 + 高速 + バス
  "naha-airport-international-2014": 3, // 2014・国際路線数日本 4 位
  "yonaguni-airport-westernmost": 3, // 日本最西端空港
  "okinawa-jidoshado-1987": 3, // 沖縄唯一の高速・1987
  "yanbaru-rapid-bus-okinawa": 3, // 那覇 ↔ 国頭 高速バス
  "miyako-hirara-port-2007": 2, // 宮古諸島フェリー hub
  "yui-rail-miebashi-naha": 2, // 国際通り入口
  "yui-rail-akamine-naha": 2, // 日本最南端モノレール駅
  "yui-rail-gibo-naha": 2, // 首里手前
  "yui-rail-kyozuka-urasoe": 2, // 2019 延伸
  "yui-rail-shimin-byoin-mae-naha": 2, // 沖縄県立博物館アクセス

  // ── 兵庫県 衣類 R2 補完(老卷・Sprint 19.13)──────────────────
  // 25 → 35:5 国の伝統工芸 + 浴衣 + 百貨店 + 中華街
  // Rank 3:国指定伝統工芸 + 全国級・老舗百貨店
  "akoo-dantsu-1786": 3, // 1786・国指定伝統工芸 1979・全国唯一の純国産絨毯
  "izushi-yaki-1789": 3, // 1789・国指定伝統工芸 1980・但馬白磁
  "miki-kanamono-1996": 3, // 国指定 1996・大工道具全国 No.1
  "awaji-kawara-1648": 3, // 1648・国指定 2017・日本 3 大瓦産地
  "kinosaki-sotoyu-yukata": 3, // 1300 年浴衣街道・志賀直哉
  "nankin-machi-china-1868": 3, // 日本三大中華街
  // Rank 2:有力代表
  "tanba-fu-1853": 2, // 1853・柳宗悦 1954 復興
  "arima-onsen-yukata-rental": 2, // 日本三古湯浴衣文化
  "sanyo-himeji-1953": 2, // 姫路駅前老舗百貨店
  "mosaic-harborland-1992": 2, // 神戸港絶景 mall

  // ── 兵庫県 行類 R2 補完(老卷・Sprint 19.14)──────────────────
  // 34 → 44:六甲ライナー + ジャンボフェリー + 但馬空港 + 阪神甲子園 + JR 新快速等
  "kobe-jumbo-ferry-takamatsu-1969": 3, // 関西-四国主要海路
  "tajima-airport-1994": 3, // 但馬唯一空港
  "awaji-genova-line-akashi": 3, // 本州-淡路最速航路
  "hanshin-koshien-station": 3, // 阪神タイガース+高校野球聖地
  "shintetsu-arima-saka": 3, // 有馬温泉アクセス主役
  "rokko-liner-1990": 2, // 神戸 2 つ目自動運転モノレール
  "kobe-bay-shuttle-kix": 2, // 関西 2 空港高速船
  "kobe-municipal-bus": 2, // 神戸市営バス
  "jr-shin-kaisoku-osaka-himeji": 2, // 関西最速在来線快速
  "jr-fukuchiyama-line-amagasaki-fukuchiyama": 2, // 但馬丹波アクセス主役

  // ── 大阪府 食類 R3 補完(老卷・Sprint 19.15)──────────────────
  // 63 → 73:吉野寿司 + 釣鐘屋 + グリル丸善 + つるとんたん + 白雲台 + 道具屋筋 + 阪急ラーメン横丁 + 鶴橋焼肉街 + 夫婦善哉 + コナモンミュージアム
  "yoshino-zushi-1841-osaka": 3, // 大阪箱寿司発祥 1841
  "tsuriganeya-honpo-1900-shinsekai": 3, // 釣鐘饅頭発祥 1900
  "hozenji-meoto-zenzai-1883": 3, // 1883・織田作之助小説舞台
  "sennichimae-doguya-suji-1882": 3, // 関西最大料理道具街 1882
  "tsuruhashi-yakiniku-shotengai": 3, // 日本最大焼肉密集地
  "grill-marusai-1939-shinsaibashi": 2, // 大阪洋食老舗 1939
  "tsurutontan-soemoncho-1989": 2, // 大阪うどん代表 1989
  "hakuun-dai-tsuruhashi": 2, // 鶴橋焼肉老舗
  "hankyu-3bangai-ramen-yokocho-1969": 2, // 関西初駅地下ラーメン横丁
  "konamon-museum-dotonbori-2003": 2, // 粉もん体験博物館

  // ── 京都府 楽類 R7 補完(老卷・Sprint 19.16)──────────────────
  // 75 → 85:京都三大祭 + 鉄道博物館 + マンガ + 舞鶴赤レンガ + 貴船川床 + 鞍馬山 + 叡山 + 駅ビル
  // Rank 3:京都三大祭 + 国指定文化財 + 全国級
  "kyoto-gion-matsuri-summer": 3, // 1100 年・ユネスコ無形文化遺産
  "kyoto-aoi-matsuri-may": 3, // 三大祭最古
  "kyoto-jidai-matsuri-october": 3, // 三大祭・1895 創始
  "kyoto-railway-museum-2016": 3, // 国内最大級鉄道博物館
  "maizuru-akarenga-park": 3, // 国指定重文 12 棟
  "kifune-kawadoko-summer": 3, // 京都夏伝統
  // Rank 2:有力施設・観光体験
  "kyoto-manga-museum-2006": 2, // 30 万冊マンガ博物館
  "kurama-yama-hike": 2, // 義経修行地ハイキング
  "eizan-cable-hieizan-1925": 2, // 比叡山アクセス 1925
  "kyoto-station-rooftop-garden": 2, // 駅ビル屋上無料絶景

  // ── 長崎県 食類 R1 (Sprint 20.1) ──────────────────
  // Rank 3:発祥級 + 国指定 + 全国級
  "nagasaki-champon-shikairo-1899": 3, // 1899・ちゃんぽん+皿うどん発祥
  "fukusaya-castella-1624": 3, // 1624・カステラ最古老舗
  "shoouken-castella-1681": 3, // 1681・カステラ三大老舗
  "shippoku-kagetsu-1642": 3, // 1642・卓袱料亭最古・国指定史跡
  "nagasaki-shinchi-chuka-gai-1689": 3, // 日本三大中華街最古
  "fukuda-shuzo-hirado-1688": 3, // 1688・長崎現存最古酒蔵・国登録文化財
  "yossou-kakuni-man-1866": 3, // 1866・角煮まん老舗
  "tsuruchan-toruko-rice-1925": 3, // 九州最古純喫茶 + トルコライス代表
  "shimabara-somen-overview": 3, // 全国 3 大素麺
  "goto-udon-overview": 3, // あごだし発祥
  "nagasaki-shippoku-ryori-overview": 3, // 卓袱料理概論
  "nagasaki-castella-history-overview": 3, // カステラ概論・1550s 伝来
  "tsushima-tora-fugu-overview": 3, // 全国 4 大とらふぐ産地
  "iki-mugi-shochu-gi-2005": 3, // GI 認定・麦焼酎発祥地
  "omura-zushi-1573-overview": 3, // 押し寿司発祥 1573
  "nagasaki-konfeito-portuguese-1546": 3, // 1546 ポルトガル伝来南蛮菓子
  // Rank 2:有力老舗・代表
  "bunmei-do-castella-1900": 2, // 1900・カステラ全国普及
  "iwasakimotoshouten-kakuni": 2, // 角煮まん全国普及
  "koraku-en-1899-shinchi": 2, // 1898・新地ちゃんぽん
  "soshurin-1985-shinchi": 2, // 1985・新地皿うどん
  "nagasaki-toruko-rice-overview": 2, // トルコライス概論
  "goto-ago-himono-overview": 2, // 五島あご
  "obama-jigoku-mushi": 2, // 小浜温泉地獄蒸し
  "shimabara-kanzarashi-traditional": 2, // 島原寒晒し
  "unzen-jigoku-cuisine": 2, // 雲仙地獄料理

  // ── 長崎県 住類 R1 (Sprint 20.2) ──────────────────
  // Rank 3:国指定文化財 + 全国級 + 三大クラシック + 1700s 老舗
  "unzen-kanko-hotel-1935": 3, // 国登録文化財・日本三大クラシックホテル
  "unzen-fukiya-1730": 3, // 雲仙最古旅館 1730・290 年
  "unzen-kyushu-hotel-1917": 3, // 大正期老舗 1917
  "obama-shunyokan-1926": 3, // 国登録文化財 1926
  "garden-terrace-nagasaki-2009-kuma": 3, // 隈研吾 2009・世界新三大夜景
  "hotel-europa-htb": 3, // HTB 内最高級 1992
  "iki-retreat-kairi-2016": 3, // 全国級高級宿 2016
  // Rank 2:有力老舗・代表
  "ana-crowne-plaza-nagasaki-glover": 2, // グラバー園隣接
  "hotel-bellview-nagasaki-dejima": 2, // 出島隣接
  "hotel-new-nagasaki-station": 2, // 駅前 1980
  "nagasaki-hotel-seifu-1955": 2, // 思案橋 1955
  "unzen-hansuiroh": 2, // 雲仙現代高級
  "obama-onsen-iseya": 2, // 小浜中堅
  "hotel-amsterdam-htb": 2, // HTB 中堅 1992
  "hotel-okura-jr-huis-ten-bosch-1992": 2, // HTB 駅直結 1992
  "hirado-kaijo-hotel": 2, // 平戸城前
  "hirado-kankou-hotel": 2, // 平戸国際観光
  "campana-hotel-fukue": 2, // 五島福江代表 1992
  "goto-conkana-1980s": 2, // 五島総合リゾート
  "shinkamigoto-pension-zone": 2, // 上五島ペンション
  "iki-hirayama-ryokan": 2, // 壱岐湯本 1700s
  "tsushima-grand-hotel": 2, // 対馬最大
  "tsushima-ryokan-onsen-area": 2, // 対馬厳原町宿
  "shimabara-nampuro": 2, // 島原温泉代表
  "shimabara-onsen-overview": 2, // 島原温泉郷概論

  // ── 長崎県 衣類 R1 (Sprint 20.3) ──────────────────
  // Rank 3:国伝統的工芸品概論 + 国宝/世界遺産連動 + 1700s〜1800s 老舗 + 全国級アーケード
  "hasami-yaki-1599-overview": 3, // 波佐見焼概論・全国 5 位生産
  "mikawachi-yaki-1650s-overview": 3, // 三川内焼概論・国伝統的工芸品
  "nagasaki-bidoro-overview": 3, // 長崎ビードロ概論・南蛮伝来
  "nagasaki-bekko-overview": 3, // 長崎べっ甲概論・国伝統的工芸品
  "hamaya-nagasaki-1880": 3, // 浜屋百貨店 1880・長崎随一
  "nagasaki-hamano-machi-arcade": 3, // 浜の町商店街・長崎最大繁華街
  "sasebo-tamaya-1806": 3, // 佐世保玉屋 1806・220 年老舗
  "sasebo-yonkacho-arcade-1km": 3, // 四ヶ町アーケード・全国最長級 1km
  "oura-tenshudo-shop": 3, // 大浦天主堂・国宝
  "goto-church-pilgrim-shop": 3, // 五島教会群・世界遺産
  "dejima-shop-edo": 3, // 出島・国指定史跡
  "esaki-bekko-1709": 3, // 江崎べっ甲店 1709・320 年老舗
  // Rank 2:代表メーカー・主要商業施設・伝統祭り
  "hasami-hakusan-toki": 2, // 白山陶器・波佐見代表
  "hasami-natural-69-modern": 2, // natural69・波佐見現代代表
  "amyu-plaza-nagasaki-2000": 2, // アミュプラザ長崎・駅直結
  "sasebo-5ban-gai-2013": 2, // 佐世保 5 番街・駅前
  "amyu-plaza-sasebo-2000": 2, // アミュプラザ佐世保
  "nagasaki-shinchi-souvenir": 2, // 新地中華街土産
  "shimabara-yusui-shotengai": 2, // 島原湧水商店街
  "nagasaki-kunchi-shozoku-rental": 2, // 長崎くんち装束
  "htb-souvenir-european": 2, // HTB 欧風土産
  "nagasaki-bidoro-shop": 2, // 長崎ビードロ店
  "obama-onsen-shotengai": 2, // 小浜温泉商店街

  // ── 長崎県 育類 R1 (Sprint 20.4) ──────────────────
  // Rank 3:国宝 + 世界遺産 + 国指定史跡 + 国特別史跡 + 国重要無形民俗 + 維新史 + 三大くんち
  "oura-tenshudo-kokuhou-1864": 3, // 国宝・世遺・現存最古教会
  "nagasaki-26-saints-1597": 3, // 国史跡・1862 列聖
  "goto-church-group-overview-2018": 3, // 世遺 12 構成資産概論
  "ebukuro-tenshudo-1918": 3, // 国重文・世遺
  "kashiragashima-tenshudo-1910": 3, // 国重文・全国唯一石造
  "gunkanjima-hashima-1916": 3, // 国史跡・世遺・象徴的観光地
  "glover-house-kokushu-1863": 3, // 国重文・現存最古洋館・世遺
  "kosugi-shipping-1869": 3, // 国史跡・日本最古洋式・世遺
  "mitsubishi-dai-3-dock-1905": 3, // 世遺・現役・武蔵建造ドック
  "dejima-1634-1859": 3, // 国史跡・長崎象徴
  "tojinyashiki-1689": 3, // 国史跡・中華街起源
  "hirado-dutch-trading-1609": 3, // 国史跡・日本最古蘭館
  "sofukuji-kokuhou-1629": 3, // 国宝 2 棟(大雄宝殿+第一峰門)
  "tsushima-banshoin-1615": 3, // 国宝梵鐘・国史跡・対馬象徴
  "peace-park-statue-1955": 3, // 平和象徴・8/9 平和宣言会場
  "nagasaki-atomic-museum": 3, // 必訪・被爆実相
  "suwa-shrine-1626": 3, // 鎮西大社・全国 16 番格式
  "nagasaki-kunchi-1634": 3, // 国重要無形民俗・三大くんち
  "iki-haruno-tsuji-yayoi": 3, // 国特別史跡(全国 60 件のみ)
  "harajiro-amakusa-1637": 3, // 国史跡・世遺・島原の乱
  "kameyama-shachu-ryoma-1865": 3, // 龍馬関連・維新象徴
  // Rank 2:国登録/重文 + 部分公開 + 重複感
  "takashima-coal-1881": 2, // 国史跡・世遺だが軍艦島と関連重複
  "siebold-narutaki-1824": 2, // 国史跡だが小規模
  "kofukuji-obaku-1620": 2, // 重文・崇福寺と機能重複
  "urakami-tenshudo-1959": 2, // 再建・原爆資料館と関連

  // ── 長崎県 樂類 R1 (Sprint 20.5) ──────────────────
  // Rank 3:世界級認定 + 国指定名勝 + 国立公園第 1 号 + 全国最大級 + 国内最古
  "inasayama-night-1000man": 3, // 世界新三大夜景 2012・1000 万ドル
  "huis-ten-bosch-theme-park-1992": 3, // 国内最大級テーマパーク 152 ha
  "htb-illumination-kingdom-of-light": 3, // 日本三大イルミ 3 年連続 1 位
  "kujukushima-208-islands": 3, // 西海国立公園・ミシュラン 3 つ星
  "saikai-bridge-park-sakura": 3, // 国指定名勝・1955 西海橋
  "unzen-jigoku-walk": 3, // 1934 国立公園第 1 号・長崎観光象徴
  "omura-park-sakura-2000": 3, // 国指定名勝・桜名所 100 選・2000 本
  "nagasaki-lantern-festival": 3, // 来場 100 万人・国内最大級アジア祭
  "shoryo-nagashi-815": 3, // 長崎独自・全国知名(さだまさし歌)
  "iojima-resort-iland": 3, // 長崎市離島・代表リゾート
  "obama-asia-longest-footbath": 3, // 全国最長 105m 足湯
  // Rank 2:有力観光 + 国登録 + 国内最古/最多 + 代表
  "nabekanmuriyama-park-night": 2, // 無料穴場夜景・地元定番
  "glover-garden-night-illumination": 2, // 国重文洋館 + 夜間
  "htb-flower-festival": 2, // 国内最大級花祭
  "pearl-ship-cruise-sasebo": 2, // 九十九島代表遊覧船
  "unzen-fugendake-nita-momiji": 2, // 雲仙ロープウェイ紅葉
  "nagasaki-penguin-aquarium": 2, // 国内最多ペンギン 9 種
  "nagasaki-bio-park-isahaya": 2, // 代表接触型動物園
  "tabira-cherry-hirado-1500": 2, // 1500 本・地元穴場
  "nagasaki-peron-championship": 2, // 国内最古龍舟競漕 1655
  "minato-nagasaki-mizube-firework": 2, // 港+稲佐山+ 8000 発
  "iki-marine-summer": 2, // 透明度+ イルカ + 5 ビーチ
  "goto-onibire-volcano": 2, // 五島福江象徴・サンセット
  "tsushima-aso-bay-cruise": 2, // 対馬象徴・リアス式
  "nagasaki-port-cruise-night": 2, // 海上ナイトクルーズ・特殊体験

  // ── 長崎県 行類 R1 (Sprint 20.6) ──────────────────
  // Rank 3:2022 新幹線開業 + 国内最初 + 観光必須 + 大動脈 + 国登録車両
  "nishi-kyushu-shinkansen-2022": 3, // 2022/9/23 開業・最新新幹線
  "nagasaki-station-2020-renewal": 3, // 西九州新幹線終着・2020 高架
  "jr-sasebo-line": 3, // HTB+ 九十九島大動脈
  "jr-omura-line": 3, // 大村湾景観路線
  "futatsu-boshi-4047-2022": 3, // 2022 新観光特急 D&S
  "nagasaki-tram-1915": 3, // 観光必須・国登録車両 19 系
  "kyushu-shosen-goto-fukue": 3, // 五島メイン海運
  "yamasa-gunkanjima-cruise": 3, // 軍艦島メイン上陸ツアー
  "nagasaki-airport-1975": 3, // 国内最初の海上空港
  "nagasaki-tram-1day-pass": 3, // 観光客必須 ¥600 1 日券
  // Rank 2:重要観光連絡 + 代表 + 第三セクター + 高速バス
  "relay-kamome-rinkan": 2, // 博多-武雄温泉連絡特急
  "shin-omura-station-2022": 2, // 新幹線新設駅・空港 hub
  "jr-nagasaki-honsen": 2, // 在来線・新幹線並走
  "matsuura-railway-1988": 2, // 国内最西端駅
  "shimabara-railway-1908": 2, // 島原半島東岸
  "kyushu-yusen-iki-tsushima": 2, // 壱岐対馬主要海運
  "jr-kyushu-jetfoil-iki": 2, // 高速船最速級
  "nagasaki-island-airports": 2, // 離島 3 空港統合
  "nagasaki-city-bus": 2, // 市内補完交通
  "saihi-bus-sasebo": 2, // 佐世保エリア大手
  "nagasaki-highway-bus-fukuoka": 2, // 福岡-長崎高速バス
  "nagasaki-expressway": 2, // 県内高速大動脈
  "hirado-ohashi-1977": 2, // 平戸島連結記念橋
  "iojima-ohashi-2011": 2, // 伊王島連結 i+Land 触媒
  "nagasaki-rental-car-area": 2, // 離島観光必須戦略

  // ── 長崎県 R2 全カテゴリ補完 (Sprint 21.1-21.6) ──────────────────
  // 食 R2:茶碗蒸し+ぶたまん+ 一口餃子 発祥
  "yossou-chawanmushi-1866": 3, // 茶碗蒸し発祥 1866
  "momotaro-butaman-1957": 3, // ぶたまん発祥 1957
  "unryutei-gyoza-1955": 3, // 一口餃子発祥 1955
  "chuoken-champon-1925": 2, // 浜の町ちゃんぽん老舗 100 年
  "yamanokotobuki-sake-hirado": 2, // 平戸地酒 1830・195 年
  // 住 R2:長崎都市+ 諫早佐世保+ 島原老舗
  "nagasaki-marriott-2024": 3, // 国際ブランド最新・駅直結
  "globalview-nagasaki-2017": 2, // 駅前中規模 236 室
  "hotel-monterey-nagasaki-1995": 2, // 大浦居留地・南欧スタイル
  "richmond-sasebo-2002": 2, // 佐世保駅前定番
  "shimabara-toyokan-1932": 2, // 島原 90 年老舗
  // 衣 R2:波佐見現代+ 三川内具体+ ビードロ
  "hasami-maruhiro-2010": 3, // HASAMI ブランド最大功労者
  "mikawachi-yaki-bijutsukan": 3, // 50 窯元共同施設
  "hasami-aiyu-modern": 2, // 波佐見現代ブランド
  "mikawachi-fujishou-kiln": 2, // 三川内焼代表窯元
  "nakao-bidoro-1973": 2, // ビードロ専門 50 年
  // 育 R2:残り潜伏キリシタン世遺 5+ 平戸城+ 諫早眼鏡橋+ 島原城+ 美術館 2
  "shitsu-tenshudo-1882": 3, // 国重文・世遺・ド・ロ神父
  "ono-tenshudo-1893": 3, // 国重文・世遺・ド・ロ神父
  "kuroshima-tenshudo-1902": 3, // 国重文・世遺・島民総出建立
  "tabira-tenshudo-1918": 3, // 国重文・鉄川与助代表作
  "nokubi-church-nozakijima": 3, // 国重文・世遺・無人島
  "hirado-castle-1707": 3, // 国指定史跡・続 100 名城
  "matsuura-museum": 3, // 松浦氏旧居・国登録
  "isahaya-meganebashi-1839": 3, // 国重文・現存最古アーチ石橋
  "shimabara-castle-1624": 3, // 続 100 名城・島原の乱主因
  "gunkanjima-digital-museum-2015": 3, // 軍艦島代替/補完体験
  "nagasaki-prefectural-art-museum-2005": 3, // 隈研吾建築・スペイン美術 750
  "fukusaiji-1628": 2, // 万国霊廟観音 18m
  // 楽 R2:季節祭礼+ 大渦+ ロープウェイ
  "hirado-okuncchi-oct": 3, // 国指定無形民俗 1991
  "unzen-ropeway-1957": 3, // 1957 老舗ロープウェイ
  "shimabara-mizu-matsuri-aug": 2, // 名水百選祭
  "goto-tsubaki-fest-feb": 2, // 国内 3 位椿生産地
  "saikai-uzu-spring-tour": 2, // 大渦観潮船季節限定
  // 行 R2:軍艦島他社+ 諫早駅
  "isahaya-station-2022-renewal": 3, // 4 重結節 hub
  "gunkanjima-concierge": 2, // 軍艦島専門ガイド
  "dai7-ebisumaru": 2, // 元島民ガイド

  // ── 長崎県 R3 全カテゴリ補完 (Sprint 22.x) ──────────────────
  // 食 R3
  "hayashimori-hatoshi": 3, // ハトシ発祥
  "baigetsudo-shisukeki": 3, // 1894 老舗・シースケーキ発祥 1955
  "shimabara-gusozoni-ginsui": 3, // 110 年老舗・島原の乱起源
  "keikaen-1925": 2, // 新地中華 100 年
  "hirado-gyu-overview": 2, // 平戸牛ブランド概論
  // 住 R3
  "unzen-miyazaki-ryokan-1830": 3, // 雲仙最古級 195 年
  "nikko-hotel-nagasaki-1989": 2, // ANA 系 35 年
  "jr-kyushu-hotel-nagasaki": 2, // 駅前定番
  // 衣 R3
  "nishi-no-hara-hasami-area": 3, // 波佐見観光メイン
  "saikai-toki-1969": 2, // 波佐見最大手商社
  // 育 R3
  "kyu-gorin-tenshudo-1881": 3, // 国重文・世遺・現存最古木造教会
  "kyu-orth-residence-1865": 3, // 国重文・グラバー園 3 大邸宅
  "kyu-ringer-residence-1869": 3, // 国重文・3 大邸宅唯一石造
  "kyu-hongkong-shanghai-bank-1904": 3, // 国重文・下田菊太郎
  "kyu-rakurin-school": 3, // 国重文・日本最古神学校
  "hirado-xavier-church-1931": 3, // 寺院教会併立眺望・観光名所
  "kurosaki-kyokai-1920": 2, // 鉄川与助・遠藤周作
  "shofukuji-1677": 2, // 四福寺最後・国重文亀趺
  "unzen-oyama-info-center": 2, // 国立公園情報館
  "isahaya-jou-ato": 2, // 城跡公園
  // 楽 R3
  "shianbashi-yokocho-night": 3, // 長崎夜中心 80 軒
  "dejima-illumination-night": 2, // 年中ライトアップ
  "nagasaki-port-festival-summer": 2, // 港祭 50 万人
  "mizugaura-fukue-beach": 2, // 五島代表ビーチ
  "isahaya-meganebashi-light": 2, // 国重文ライトアップ
  // 行 R3
  "dejima-wharf-port-hub": 3, // 1999 港観光最重要 hub
  "nagasaki-port-international": 3, // 大型クルーズ船拠点
  "nagasaki-tour-rabbit-bus": 2, // 観光バス

  // ── 長崎県 R4 全カテゴリ補完 (Sprint 23.x) ──────────────────
  // 食 R4
  "goto-wagyu-overview": 3, // 全国和牛枝肉共励会 3 年連続日本一
  "iki-jidori-gi-2017": 3, // GI 認定離島ブランド地鶏
  "ono-unagi-isahaya": 2, // 90 年老舗うなぎ
  "tsushima-iwagaki-summer": 2, // 国内最大級岩牡蠣
  "nagasaki-castera-zaka-walk": 2, // カステラ 4 老舗散策
  // 住 R4
  "ueno-ryokan-fukue-1935": 2, // 90 年福江老舗
  "toyoko-inn-nagasaki-eki": 2, // 駅前定番
  "shimabara-jonan-hotel-1952": 2, // 70 年中堅温泉
  // 衣 R4
  "mikawachi-yumesyouen-kiln": 2, // 三川内若手窯元
  "omura-aizome-yokoyama": 2, // 大村藍染唯一の現役工房
  // 育 R4
  "nagasaki-museum-history-culture-2005": 3, // 旧奉行所跡・必訪博物館
  "gamadasu-dome-1995-eruption": 3, // 44 名犠牲災害記念館
  "urakami-yobankuzure-1867": 3, // キリシタン史最重要事件
  "shimabara-bukei-yashiki": 3, // 武家屋敷 3 軒+ 鯉の泳ぐまち
  "watazumi-jinja-tsushima": 3, // 対馬一宮・国宝高麗仏
  "dejima-restoration-1996": 3, // 16 棟復元事業
  "unzen-jigoku-kirishitan-junkyo": 2, // 33 名処刑碑
  "tsukiyomi-jinja-iki": 2, // 壱岐古社・延喜式内社
  "zuiun-ji-hirado": 2, // 松浦家菩提寺
  // 楽 R4
  "shimabara-yusui-meguri-7sites": 3, // 名水百選・7 大湧水
  "unzen-miyamakirishima-may": 3, // 国指定天然記念物・10 万本
  "tsushima-eboshidake-tenboudai": 2, // 浅茅湾全景
  "hirado-tabira-sunset": 2, // 全国級夕陽
  "fukue-doroibata-onsen": 2, // 五島離島温泉
  // 行 R4
  "orc-air-1961-overview": 3, // 国内最小級航空・離島生命線
  "shin-kamigoto-municipal-bus": 2, // 離島町営バス
  "goto-municipal-bus-fukue": 2, // 五島市内バス
  "nagasaki-airport-limousine": 2, // 空港アクセス定番

  // ── 長崎県 R5 全カテゴリ補完 (Sprint 24.x) ──────────────────
  // 食 R5
  "kozanrou-1946": 3, // 新地三大老舗・特上ちゃんぽん
  "kawauchi-manju-1623": 3, // 平戸 400 年・カスドース南蛮菓子
  "mogi-biwa-150-years": 2, // 全国 1 位生産
  "iki-ika-ikizukuri": 2, // 玄界灘ブランド・透明度世界級
  // 住 R5
  "fukue-kankoh-hotel": 2, // 五島市内随一 60 年
  "tsushima-asahiya-1907": 2, // 対馬最古宿 118 年
  // 衣 R5
  "hasami-nakaoyama-area": 3, // 国登録登り窯 2 基・伝統陶器街
  // 育 R5
  "iki-ikkokuhakubutsukan-2010": 3, // 黒川紀章建築・国宝銅鏡
  "tsushima-kokubunji": 3, // 国指定史跡・対馬最古寺
  "iki-kojima-jinja": 3, // 干潮参拝・モンサンミッシェル風
  "tojinyashiki-shijou": 3, // 国指定史跡・唐人屋敷四堂
  "nagasaki-bombcenter-monument": 3, // 1945 原爆爆心地碑
  "komyoji-hirado-1486": 2, // 平戸古刹 540 年
  "fukue-tenshudo-1962": 2, // 五島本島最大教会
  "omura-gokoku-jinja": 2, // 海軍航空隊ゆかり
  // 楽 R5
  "iki-saruiwa-monument": 3, // 国指定名勝・自然奇岩
  "mitsuhiro-cape-fukue": 3, // 遣唐使最後寄港地・空海ゆかり
  "tsushima-waniura-asahi": 2, // 韓国 50km・日本初日の出
  "saikai-yumeshi-cape": 2, // 西海多島海絶景
  "omura-bay-cycling-route": 2, // 100km 湾一周
  // 行 R5
  "seaman-shoukai-gunkanjima": 2, // 軍艦島 4 大ツアー最後
  "nagasaki-1day-model-course": 3, // 路面電車 1 日券完結モデル
  "unzen-isahaya-bus-line": 2, // 雲仙温泉アクセス幹線
  "htb-fukuoka-direct-bus": 2, // HTB-福岡空港直通
  "saikai-bashi-park-bus": 2, // 西海橋公園アクセス

  // ── 長崎県 R6 全カテゴリ補完 (Sprint 25.x) ──────────────────
  // 食 R6
  "mogi-ikkokou-1844": 3, // 茂木一口香 180 年・南蛮焼菓子
  "shippoku-shinwakaen-1934": 3, // 卓袱料理 90 年老舗
  "tsushima-shiitake-overview": 2, // 全国有数生産・郷土食材
  "shimabara-tofu-shu": 2, // 名水百選湧水豆腐
  "fukue-shio-overview": 2, // 五島ミネラル塩
  // 住 R6
  "dormy-inn-nagasaki": 3, // 駅前+ 天然温泉+ 夜鳴きそば
  "tsushima-tiara-izuhara": 2, // 対馬中規模 92 室
  "shimabara-yamato-1956": 2, // 70 年中堅温泉
  // 衣 R6
  "shimabara-bussankan": 2, // 観光土産集積 hub
  // 育 R6
  "nagasaki-megane-bashi-1634": 3, // 国重文・現存最古アーチ石橋・日本三大名橋
  "fukue-jou-ato-1849": 3, // 国指定史跡・幕末日本最後の海城
  "hirado-oranda-ido-1639": 3, // 国指定史跡・日本最古洋風遺構 380+ 年
  "omura-sumitada-haka": 3, // 日本初キリシタン大名・1574 長崎開港者
  "hirado-tei-seikou-kinenkan": 3, // 鄭成功生誕地・日中台外交象徴
  "watadustumi-jinja-tsushima": 3, // 神話海宮・干潮時鳥居 5 基
  "isahaya-jinja": 2, // 諫早領主鎮守
  "sotome-kounoura-kyokai": 2, // 外海地区 4 教会の 1
  // 楽 R6
  "ohsezaki-tousen-fukue": 3, // 灯台 50 選・ロマンチストの聖地
  "takahama-beach-fukue": 3, // 渚百選+ 快水浴場百選 W 認定
  "iki-sakyobana": 3, // 国指定名勝・160m 断崖
  "shin-kamigoto-ryukanyama": 2, // 上五島最高峰展望
  "arima-kirishitan-isan-kinenkan": 2, // 原城跡併設・天草四郎陣中旗
  // 行 R6
  "tsushima-municipal-bus": 2, // 対馬離島生命線バス
  "hirado-sasebo-bus-line": 2, // 平戸観光アクセス幹線
  "nagasaki-fukuoka-airport-shuttle": 2, // LCC 利用者向け

  // ── 長崎県 R7 全カテゴリ補完 (Sprint 26.x) ──────────────────
  // 食 R7
  "ringer-hut-1962-isahaya": 3, // ちゃんぽん全国普及・諫早発祥
  "tsushima-rokubei-overview": 2, // 対馬郷土麺・サツマイモ澱粉
  "iki-uni-don-katsumoto": 3, // 玄海ウニ・5-9 月旬
  "shimabara-itohatsu-soumen": 2, // 全国 3 大素麺・島原代表
  // 住 R7
  "ana-crowne-plaza-htb-1992": 3, // ANA インターコンチ HTB 最新最高級
  "saint-hill-nagasaki-1968": 2, // 駅前老舗 57 年
  "fukue-pension-tsubaki": 2, // 五島家族経営小宿
  // 衣 R7
  "hirado-bidoro-direct": 2, // 平戸 1550s 南蛮ガラス系統
  // 育 R7
  "doromaki-tenshudo-fukue-1908": 3, // 五島最初のレンガ造教会
  "aosagaura-tenshudo-1910": 3, // 国重文・鉄川与助代表
  "hirado-kasuga-village-2018": 3, // 世遺・棚田文化景観
  "hirado-nakaenoshima-2018": 3, // 世遺・無人島巡礼地
  "tsushima-kaneda-jou-special": 3, // 国指定特別史跡・667 山城
  "isahaya-canal-irrigation": 3, // 国営最大級干拓堤防 7050m
  "hirado-kawauchi-toge-meishou": 3, // 国指定名勝 260m 高原
  "unzen-nita-rindou": 2, // 雲仙国立公園循環道路
  // 楽 R7
  "saikai-oshima-bridge-2009": 3, // 県内最長橋 1095m
  "tsushima-stargazing-spot": 3, // IDA 候補・無光害星空
  "iki-katsumoto-port-fes": 2, // 勝本浦祭夏祭
  "saikai-jet-ski-pearl-shore": 2, // 西海マリンスポーツ
  // 行 R7
  "nagasaki-tour-taxi-1day": 3, // プレミアム観光タクシー
  "shimabara-fukuoka-bus-direct": 2, // 島原半島観光福岡アクセス
  "kamome-shinkansen-detail": 3, // 西九州新幹線車両詳細

  // ── 兵庫県 R2 補完 (Sprint 27.x) ──────────────────
  // 食 R2
  "ako-shio-overview": 3, // 国指定塩・全国 5 大製塩地
  "tanba-kuromame-overview": 3, // 全国最高級ブランド大豆
  "himeji-anago-overview": 2, // 瀬戸内海産・姫路郷土料理
  "izushi-soba-tachibanaya-1924": 2, // 出石そば 100 年老舗
  // 住 R2
  "kinosaki-mikiya-1758": 3, // 城崎温泉 267 年・志賀直哉舞台
  "takedao-onsen-1718": 2, // 神戸近郊秘境温泉 300 年
  "arima-yumebana-modern": 2, // 有馬温泉中堅老舗
  // 衣 R2
  "kobe-pearl-overview": 3, // 全国真珠加工 70%+ シェア
  "kobe-nankin-machi-souvenir": 3, // 全国 3 大中華街
  // 育 R2
  "nishinomiya-ebisu-jinja": 3, // 全国戎神社総本宮・国重文
  "tamba-sasayama-jo": 3, // 国指定史跡・続 100 名城
  "ako-rekishi-hakubutsukan": 2, // 忠臣蔵+ 赤穂塩文化総合
  // 楽 R2
  "amagasaki-shinkawa-canal": 2, // 阪神工業地帯運河文化
  // 行 R2
  "jr-bantan-line": 2, // 但馬地方アクセス幹線
  "jr-sanin-honsen-hyogo": 2, // 城崎温泉アクセス幹線

  // ── 静岡県 R7 補完 (Sprint 28.x) ──────────────────
  // 食 R7
  "yaizu-maguro-port-overview": 3, // 全国 1 位 鰹+ まぐろ水揚港
  "hamamatsu-gyoza-overview": 3, // 全国 1 位餃子消費都市
  "shimizu-sushi-overview": 2, // 冷凍まぐろ寿司聖地
  // 住 R7
  "imaihama-onsen-overview": 2, // 伊豆東海岸海岸温泉
  "izunokuni-bay-resort-2010s": 2, // 伊豆の国市現代温泉地
  // 衣 R7
  "yui-port-sakuraebi-souvenir": 2, // 国内唯一桜えび漁港土産
  "mishima-station-shotengai": 2, // 三島駅前 + スカイウォーク hub
  // 育 R7
  "atami-kinomiya-jinja": 3, // 大楠樹齢 2100 年・国天然記念物
  "izu-geopark-2018": 3, // ユネスコ世界ジオパーク 2018
  "kunouzan-toshogu-1617": 3, // 国宝 2010・徳川家康初葬地
  // 楽 R7
  "izu-jogasaki-coast": 3, // 国指定名勝・伊豆ジオパーク主要 site

  // ── 兵庫 R3 + 静岡 R8 補完 (Sprint 29.x) ──────────────────
  // 兵庫 R3
  "sanda-gyu-overview": 3, // 神戸牛元祖系統・年 200 頭希少
  "tatsuno-leather-overview": 3, // 全国皮革加工 80%+
  "kobe-marriott-2024": 3, // 2024 開業最新マリオット
  "izushi-castle-1604": 3, // 続日本 100 名城・但馬の小京都
  "arima-yumeguri-tour": 2, // 三大古泉本場湯巡り
  // 静岡 R8
  "tagonoura-port-fuji": 3, // 万葉集名所+ 富士山眺望漁港
  "shimoda-bay-cruise": 3, // 1853 ペリー来航地クルーズ
  "shizuoka-asama-jinja-3sha": 3, // 国重文 13 棟・家康元服祭祀
  "shizuoka-rekishi-bunkakan-2023": 3, // 2023 開館最新博物館
  "numazu-port-cuisine-area": 2, // 駿河湾深海魚食堂街

  // ── 4 卷補完 (Sprint 30.x) ──────────────────
  // 北海道 行 +6
  "shin-chitose-airport-rail-link": 3, // 北海道空港鉄道 hub
  "heart-land-ferry-rishiri-rebun": 3, // 利尻礼文離島生命線
  "tomakomai-port-ferry": 3, // 全国フェリー利用 1 位港
  "otaru-canal-cruise": 2, // 1923 運河+ 倉庫群クルーズ
  "kushiro-airport-limousine": 2, // 道東観光起点
  "niseko-united-shuttle": 2, // 4 リゾート巡回無料
  // 沖縄 楽 +6
  "yomitan-zampa-misaki": 3, // 残波岬+ 1974 灯台・サンセット名所
  "miyako-yonaha-maehama-beach": 3, // 東洋一の白砂 7km
  "kerama-whale-watching-feb": 3, // 1-3 月遭遇率 98%+
  "kafu-banta-cape": 2, // 30m 断崖絶景
  "ikei-island-bridge": 2, // 4 段橋連絡終点
  "shuri-jo-night-illumination": 2, // 首里城夜間ライトアップ
  // 京都 衣 +6
  "kyo-uchiwa-overview": 3, // 1500 年伝統+ 宮内庁御用達
  "fujii-daimaru-1923": 3, // 京都 3 大百貨店・100 年
  "kiyomizu-zaka-omiyage": 3, // 清水寺参道 1.2km
  "arashiyama-kimono-rental-zone": 2, // 嵐山着物レンタル集積
  "kawaramachi-modi-mall": 2, // 2017 開業若年層 mall
  "fushimi-inari-omiyage-zone": 2, // 伏見稲荷参道土産
  // 奈良 食 +6
  "morinaraduke-honke-1869": 3, // 奈良漬最古 155 年
  "miwa-soumen-ikiri-honten": 3, // 全国 3 大素麺発祥地老舗
  "yoshino-kuzu-honke": 3, // 全国最高級葛粉・1300 年
  "nara-yamato-cha-cafe": 2, // 大和茶 1300 年伝統
  "asuka-kodaimi-cuisine": 2, // 飛鳥古代米料理
  "yamato-yasai-cuisine": 2, // 大和野菜 20 品種

  // ── 広島県 食 R1 (Sprint 31.1) ──────────────────
  // Rank 3:発祥店 + 全国 1 位 + 国内最大級
  "hiroshima-okonomiyaki-overview": 3, // 全国 1 位密度 1500 軒
  "mitchan-1950-ekimae": 3, // 広島流発祥 1950・75 年
  "takatsudo-momiji-1906": 3, // もみじ饅頭発祥 1906・119 年
  "miyajima-uenoanagomeshi-1901": 3, // あなごめし発祥 1901・124 年
  "hiroshima-kaki-overview": 3, // 全国 60% シェア・国内最大産地
  "kanawa-1959-hatchobori": 3, // 広島市内最高級牡蠣料理
  "onomichi-shukaen-1947": 3, // 尾道ラーメン発祥 1947・78 年
  "saijo-shuzo-michi-7": 3, // 全国 3 大銘醸地・25 万人来場
  "kamotsuru-shuzo-1873": 3, // 西条 7 蔵代表・大吟醸命名 1958
  "tomonoura-homeishu-1659": 3, // 1659 薬酒・徳川幕府献上
  "setoda-lemon-overview": 3, // 全国 1 位 国産レモン 30%
  // Rank 2:有力老舗 + 代表銘菓 + 中堅
  "okonomimura-shintenchi-1985": 2, // 25 軒集積観光名所
  "hassei-okonomiyaki": 2, // 広島代表中堅 1957
  "miyajima-kakiya-1948": 2, // 宮島代表牡蠣 1948
  "hiroshima-kaki-doteyaki-cuisine": 2, // 広島発祥郷土鍋
  "onomichi-ramen-overview": 2, // 瀬戸内系ご当地ラーメン
  "fukuyama-ramen-overview": 2, // 備後系別系統
  "nishikido-momiji-1947": 2, // もみじ饅頭最大ブランド
  "shobara-hibagyu-overview": 2, // 全国和牛共進会受賞・希少
  "miyoshi-wine-1965": 2, // 備北最大ワイナリー 60 年
  "hiroshima-anago-cuisine": 2, // 瀬戸内代表海産物
  "tomonoura-tai-cuisine": 2, // 鯛網漁伝統
  "mihara-tako-cuisine": 2, // 三原やっさ郷土料理
  "fukuyama-bara-wagashi": 2, // 福山ばら祭和菓子
  "jinseki-jibie": 2, // 神石高原ジビエ

  // ── 広島県 住 R1 (Sprint 31.2) ──────────────────
  // Rank 3:国登録 + 老舗 + 国際ブランド + 駅直結
  "iwaso-1854-miyajima": 3, // 宮島最古 171 年・国登録
  "kinsuikan-miyajima-1902": 3, // 宮島老舗 123 年
  "miyajima-iroha-modern": 3, // 宮島モダン高級 全室海眺望
  "tomonoura-onkiakaihone-modern": 3, // 鞆の浦現代高級 全室温泉露天
  "nishiyama-bekkan-onomichi-1840": 3, // 尾道最古 185 年・国登録
  "bella-vista-onomichi-2009": 3, // しまなみ起点・星野リゾート系
  "rihga-royal-hiroshima-1994": 3, // 市内最高層 33 階 490 室
  "sheraton-hiroshima-2010": 3, // 国際ブランド・駅直結
  "hotel-granvia-hiroshima-1999": 3, // JR 西日本系 407 室
  // Rank 2:中堅老舗 + ハイミドル + 駅前
  "miyajima-grand-hotel-arimoto": 2, // 島内最大級 47 室
  "miyajima-pension-area": 2, // 家族経営小規模圏
  "onomichi-kokusai-hotel-1962": 2, // 尾道千光寺中腹 60 年
  "tomonoura-kanko-hotel": 2, // 鞆中堅老舗 70 年
  "ana-crowne-plaza-hiroshima-1986": 2, // 市内中心 39 年
  "mitsui-garden-hiroshima": 2, // 八丁堀デザインホテル
  "fukuyama-prince-1956": 2, // 備後最大老舗 69 年
  "richmond-fukuyama-2007": 2, // 福山駅前定番
  "kure-grand-hotel-1980": 2, // 呉港眺望・大和ミュージアム
  "toyoko-inn-hiroshima-eki": 2, // 駅前格安チェーン
  "dormy-inn-hiroshima": 2, // 天然温泉+ 夜鳴きそば
  "jr-clement-hiroshima": 2, // 駅直結ミドル
  "shobara-kokumin-shukusha": 2, // 備北山間温泉
  "miyoshi-business-stay": 2, // 三次駅前
  "saijo-station-business": 2, // 西条酒祭り最寄
  "miyajima-guchi-resort": 2, // 宮島フェリー前

  // ── 広島県 衣 R1 (Sprint 31.3) ──────────────────
  // Rank 3:国指定+ 全国 1 位+ 老舗+ 駅直結
  "kumano-fude-overview": 3, // 国指定 1975・全国 80% シェア
  "fude-no-sato-koubou-2003": 3, // 全国唯一筆ミュージアム
  "hakuhodo-fude-1959": 3, // 世界 70 国輸出・OEM
  "fukuya-1929-hatchobori": 3, // 広島最古百貨店 96 年
  "fukuyama-koto-overview": 3, // 国指定 1985・全国 70% シェア
  "kawadori-mochi-kameya-1839": 3, // 広島代表銘菓 186 年
  "miyajima-shamoji-overview": 3, // 杓子発祥地 1800
  "ekie-hiroshima-station-2017": 3, // 駅直結 160+ 軒
  "shareo-underground-mall-2001": 3, // 中四国最大地下街
  "hondori-shotengai-hiroshima": 3, // 広島最大繁華街
  "miyajima-omotesandou-shotengai": 3, // 厳島神社参道
  "saijo-sake-souvenir-zone": 3, // 西条 7 蔵直販
  // Rank 2:中堅 + 商店街 + 工芸
  "kumano-fude-festival-923": 2, // 全国唯一筆供養祭
  "sogo-hiroshima-1974": 2, // 紙屋町中心 51 年
  "tenmaya-hiroshima-hatchobori": 2, // 中四国地場系
  "parco-hiroshima": 2, // 若年層 mall
  "hatchobori-shintenchi-area": 2, // 1000+ 軒夜街
  "mihara-daruma-overview": 2, // 西日本最古級だるま
  "onomichi-hanpu-overview": 2, // しまなみブランド
  "fukuyama-bara-souvenir-zone": 2, // 福山ばら土産集積
  "onomichi-shotengai-arcade": 2, // 1.2km 商店街
  "tomonoura-shotengai": 2, // 伝統建造物群保存地区
  "hiroshima-kimono-rental-zone": 2, // 着物レンタル集積
  "hiroshima-airport-souvenir": 2, // 空港 30+ 軒土産
  "hatsukaichi-momijidani-shotengai": 2, // 宮島フェリー前 hub

  // ── 広島県 育 R1 (Sprint 31.4) ──────────────────
  // Rank 3:世界遺産 + 国宝 + 国指定史跡 + 国指定特別名勝 + 国重要無形民俗
  "genbaku-dome-1996": 3, // 世遺 1996 否定遺産
  "peace-memorial-park-1955": 3, // 丹下健三設計
  "peace-memorial-museum-1955": 3, // 200 万人/年・必訪
  "itsukushima-jinja-593": 3, // 世遺 1996・593 創建・国宝 6 棟
  "itsukushima-otorii-1875": 3, // 国重文・象徴的海上鳥居
  "itsukushima-five-pagoda": 3, // 国重文 1407
  "miyajima-misen-806": 3, // 弘法大師開山・1200 年聖火
  "itsukushima-kangensai-summer": 3, // 国重要無形民俗・1168 平清盛
  "hiroshima-jou-1591": 3, // 国指定史跡・100 名城
  "shukkei-en-1620": 3, // 国指定名勝
  "fukuyama-jou-1622": 3, // 国指定史跡・続 100 名城
  "yamato-museum-2005": 3, // 戦艦大和 26m 模型・100 万人
  "etajima-naval-academy-1888": 3, // 国登録・東郷山本五十六母校
  "senkoji-806": 3, // 1200 年・尾道シンボル
  "tomonoura-jouyatou-1859": 3, // 国指定史跡・現存最古江戸期常夜灯
  "sandankyo-1925": 3, // 国指定特別名勝(全国 36 件のみ)
  // Rank 2:重文 + 国名勝 + 美術館 + 文学
  "heiwa-no-tomoshibi-1964": 2, // 永遠灯火
  "korean-victims-monument-1970": 2, // 朝鮮人 2 万人犠牲慰霊
  "itsukushima-tahoto": 2, // 国重文 1523
  "hiroshima-toushogu-1648": 2, // 国登録・浅野家造営
  "kusato-sengen-machi-museum": 2, // 中世遺跡発掘+ ジオラマ
  "taishakukyo-1923": 2, // 国指定名勝
  "hiroshima-bijutsukan-1978": 2, // 印象派 300 点
  "hiroshima-kenritsu-bijutsukan-1968": 2, // ダリ収蔵
  "linfumiko-bungaku-onomichi": 2, // 林芙美子生誕地

  // ── 広島県 楽 R1 (Sprint 31.5) ──────────────────
  // Rank 3:しまなみ + 宮島花火 + 国指定無形民俗 + マツダ + カープ + 80 万人祭
  "shimanami-kaido-overview": 3, // 世界唯一自転車道高速 60km
  "shimanami-cycling-1day": 3, // サイクリング聖地体験
  "miyajima-mizu-hanabi-aug": 3, // 30 万人来場・世界級花火
  "mazda-stadium-2009": 3, // カープ本拠 33k 収容
  "asa-zoo-1971": 3, // 全国 2 位飼育数 170 種
  "miyajima-aquarium-1959": 3, // スナメリ全国唯一
  "hiroshima-flower-festival-may": 3, // 80 万人 GW 全国級
  "fukuyama-bara-matsuri-may": 3, // 80 万人ばら祭
  "miyoshi-hanada-ue-may": 3, // 国指定 1976+ ユネスコ 2011
  "yuki-onsen-overview": 3, // 広島最古温泉 1300 年
  // Rank 2:有力スポット + 渓谷 + 祭礼 + 温泉
  "ikuchi-island-attractions": 2, // しまなみ中継 平山郁夫美術館
  "omishima-mishimataisha": 2, // 伊予国一宮 国宝 80%
  "miyajima-koyo-dani": 2, // 宮島紅葉名所 1000 本
  "miyajima-overnight-walk": 2, // 宿泊客特権夜散策
  "miyajima-sika-deer": 2, // 600 頭神聖島の使い
  "sandankyo-rafting": 2, // 国特別名勝渓流舟下り
  "taishakukyo-canoe": 2, // 国名勝湖カヌー
  "mizuho-ski-resort": 2, // 西日本屈指雪量
  "mazda-museum": 2, // 無料工場見学
  "tokasan-orifuren-fes-jun": 2, // 60 万人浴衣の日始まり
  "mihara-yatsui-aug": 2, // 35 万人 1567 起源
  "urihime-yama-yakei": 2, // 日本夜景遺産 137m
  "miyahama-onsen-overview": 2, // 宮島眺望温泉
  "egashira-beach-onomichi": 2, // しまなみリゾートビーチ
  "etajima-tsuboi-beach": 2, // 海軍兵学校徒歩

  // ── 広島県 行 R1 (Sprint 31.6) ──────────────────
  // Rank 3:大動脈 + 全国唯一 + 1 日券必須 + 必訪 hub
  "sanyo-shinkansen-hiroshima": 3, // 山陽新幹線 5 駅・東京-広島 3h50m
  "hiroshima-station-2025-renewal": 3, // 中国地方最大交通結節
  "hiroshima-densha-1912": 3, // 全国最長路面電車 112 年
  "hiroshima-densha-1day-pass": 3, // 観光客必須 ¥700
  "miyajima-jr-ferry": 3, // 宮島観光メイン海上アクセス
  "hiroshima-airport-1993": 3, // 中四国主要空港
  "hiroshima-meipuru-pu-loop": 3, // 観光ループバス ¥400
  "astram-line-1994": 3, // 全国唯一案内軌条式
  // Rank 2:在来線+ 連絡+ 戦略 + 設備
  "fukuyama-station-shinkansen": 2, // 備後 hub
  "higashi-hiroshima-station": 2, // 西条酒蔵アクセス
  "jr-sanyo-line-hiroshima": 2, // 山陽本線 528km 大動脈
  "jr-geibi-line": 2, // 備北山間アクセス
  "jr-fukushio-line": 2, // 備後内陸
  "jr-kure-line": 2, // 海岸沿い絶景
  "jr-kabe-line": 2, // 廃線復活
  "hiroshima-densha-historic-cars": 2, // 651 形原爆生残り
  "miyajima-line-densha": 2, // 広電宮島線
  "miyajima-matsudai-ferry": 2, // 松大汽船 2 大事業者
  "hiroshima-port-1899": 2, // 宇品港 125 年
  "hiroshima-airport-limousine": 2, // 空港アクセス
  "hiroshima-bus-network": 2, // バス全社網
  "sanyo-jidosha-do-hiroshima": 2, // 山陽自動車道
  "hiroshima-rental-car-area": 2, // しまなみ必須レンタカー
  "hiroshima-1day-passes-overview": 2, // 1 日券一覧戦略
  "hiroshima-tour-taxi": 2, // 観光タクシー

  // ── 広島県 R2 補完 (Sprint 32.x) ──────────────────
  // Rank 3:国指定 + 老舗 + 国際イベント + 全国最大祭
  "kure-kaigun-curry": 3, // 海軍由来 30 軒認定店・観光名物
  "onomichi-u2-2014": 3, // 世界初サイクリストホテル
  "tomonoura-iroha-2008": 3, // 宮崎駿監修古民家リノベ
  "kumano-fude-takemoto-1746": 3, // 熊野最古級 279 年
  "takehara-machinami-souvenir": 3, // 国指定伝統建造物群 1982
  "mouri-motonari-haka-akitakata": 3, // 国指定史跡・三本の矢伝説
  "tomonoura-fukuzenji-tairo-1697": 3, // 国指定史跡・朝鮮通信使迎接
  "saijo-sake-festival-october": 3, // 全国最大酒祭 25 万人
  "shimanami-cycling-marathon-oct": 3, // 国際 8000 人参加
  "miyoshi-night-mist-river": 3, // 全国屈指雲海絶景
  // Rank 2:重要観光連絡 + 補完 + 銘菓
  "setoda-lemon-cake": 2, // しまなみ銘菓
  "miyajima-kakimeshi-cuisine": 2, // 牡蠣めし郷土料理
  "saijo-station-classical-stay": 2, // 西条古民家泊
  "kakurinji-kasai-650": 2, // 備後最古寺 1370 年
  "hijiyama-park-rikugun-bochi": 2, // 軍都広島象徴
  "miyoshi-jinja-akitakata": 2, // 備北延喜式内社
  "mihara-kobayakawa-takakage-fes": 2, // 三原 3 大祭
  "shimanami-ferry-routes": 2, // サイクリスト向け
  "kure-station-jr": 2, // 呉観光起点
  "innoshima-bridge-walk": 2, // しまなみ第 1 橋

  // ── 広島県 R3 補完 (Sprint 33.x) ──────────────────
  // Rank 3:国宝 + 1000 年級寺 + 全国級観光地 + 全国 1 位
  "onomichi-jodoji-1328": 3, // 国宝 2 棟・616 創建聖徳太子建立伝
  "onomichi-saikokuji-1066": 3, // 729 創建行基開山・全国唯一大わらじ
  "okunoshima-rabbit-island": 3, // 世界級うさぎ島・1000+ 頭・年 30 万人
  "innoshima-hassaku": 3, // 全国八朔発祥地 1860
  "hiroshima-mocag-1989": 3, // 全国初の現代美術専門館
  "kusato-inari-shrine": 3, // 備後一宮+ 全国 5 大稲荷
  "egashima-kaki-yoshoku": 3, // 養殖筏 1500 基・体験型
  // Rank 2:中堅+ 観光連絡+ 補完
  "fukuyama-ramen-tamanoi": 2, // 福山ラーメン老舗 60 年
  "miyoshi-winery-stay": 2, // R1 食 ワイナリー併設宿
  "tomonoura-shionagi-2018": 2, // 鞆中堅温泉ホテル 47 室
  "taishakukyo-kanko-hotel": 2, // 帝釈峡国民宿舎
  "miyoshi-bori-bina": 2, // 三次彫り雛伝統工芸
  "otake-bingo-textile": 2, // 大竹備後織+ 和紙
  "onomichi-tenneiji-3pagoda-1388": 2, // 国重文 1388・室町
  "sandankyo-spring-flowers": 2, // 三段峡春 angle
  "akitakata-kagura-overview": 2, // 備北神楽中心
  "fukuyama-bara-park": 2, // 280 品種 5500 株
  "okunoshima-tadanoumi-ferry": 2, // うさぎ島メイン
  "ninoshima-ferry": 2, // 似島原爆+ ハイキング
  "hiroshima-matsuyama-superjet": 2, // 四国愛媛 1h8m

  // ── 広島県 R4 補完 (Sprint 34.x) ──────────────────
  // Rank 3:国宝 + 国指定 + 全国唯一 + 被爆生残り
  "miyajima-toyokuni-shrine-1587": 3, // 国重文 1587・豊臣秀吉建立・畳 857 枚
  "fudoin-1540-kondo": 3, // 国宝 1540・原爆生残り
  "aki-kokubunji-ato": 3, // 国指定史跡・741 創建
  "miyoshi-mononoke-museum-2019": 3, // 全国唯一妖怪専門館
  "former-second-army-hq-monument": 3, // 1945 大本営被爆遺構
  "skyrail-service-mihara": 3, // 全国唯一懸垂型新交通 1998
  // Rank 2:中堅+ 補完
  "miyajima-momiji-yoroichaya": 2, // 紅葉谷茶屋
  "fukuyama-anjuyaki": 2, // 福山郷土焼菓子
  "hatsukaichi-anago-cuisine": 2, // 廿日市あなご本場
  "fukuyama-resol-hotel": 2, // 福山駅前 151 室
  "miyajima-bonzu-shukubo": 2, // 神聖島宿坊
  "fukuyama-geta": 2, // 全国シェア 50%
  "mihara-towel": 2, // 国内 3 大タオル産地
  "fukuyama-hachimangu": 2, // 福山藩水野家氏神
  "innoshima-suigun-fes": 2, // 8 月村上水軍祭
  "takehara-take-matsuri": 2, // 1 万本竹灯篭
  "hiroshima-koen-summer-night": 2, // 8/6 灯篭流し 1 万個
  "miyoshi-orochi-kagura-night": 2, // 三次八岐大蛇神楽
  "nishi-hiroshima-station": 2, // JR+ 広電連絡駅
  "miyajima-airbus-direct": 2, // 空港 → 宮島直通

  // ── 広島県 R5 補完 (Sprint 35.x) ──────────────────
  // Rank 3:国宝+ 国登録+ 老舗酒蔵+ 全国唯一+ 被爆建物代表
  "takehara-taketsuru-shuzo": 3, // 1733・292 年・ニッカ創業者生家
  "ankokuji-akitakata-1369": 3, // 国宝経蔵 1370・足利尊氏
  "kyu-nichigin-hiroshima-1936": 3, // 被爆建物 4 大代表・380m
  "miyoshi-fudoki-no-oka": 3, // 国指定史跡 1976・古墳 200 基
  "innoshima-suigun-castle": 3, // 全国唯一水軍博物館城
  // Rank 2:中堅+ 補完
  "innoshima-suigun-nabe": 2, // 因島水軍鍋・冬郷土
  "kure-stew-overview": 2, // 海軍肉じゃが東郷発案伝説
  "sandankyo-ryokan-area": 2, // 三段峡周辺旅館
  "ikuchi-island-pension": 2, // しまなみサイクリスト宿
  "miyajima-rokuhara-yaki": 2, // 宮島焼伝統陶磁器
  "kure-naval-souvenir": 2, // 戦艦大和模型等独自土産
  "ohbayashi-nobuhiko-museum-onomichi": 2, // 尾道映画三部作監督
  "fukuyama-bijutsukan-1988": 2, // 備後代表美術館
  "fukuyama-bara-night-illumi": 2, // 5500 株+ LED
  "miyoshi-fudoki-sakura": 2, // 古墳+ 桜 1000 本
  "saka-kosho-sakura-park": 2, // 呉軍港眺望桜
  "miyoshi-isuzu-orochi-jinja": 2, // 1749 妖怪伝承
  "mazda-stadium-shuttle-bus": 2, // カープ観戦シャトル
  "miyajima-rope-misen": 2, // 弥山ロープウェー 1959
  "hiroshima-meipuru-extended-routes": 2, // 観光循環拡張

  // ── 広島県 R6 補完 (Sprint 36.x・250 突破) ──────────────────
  // Rank 3:国宝+ 老舗 165 年+ 国指定+ 国登録 + 重文
  "yaezakura-shuzo-mihara-1860": 3, // 1860 創業 165 年・八重櫻
  "miyajima-daishoin-806": 3, // 806 弘法大師創建・宮島真言宗総本山
  "yoshida-koriyama-jou-ato": 3, // 国指定史跡 1940・毛利元就居城
  "takehara-jr-station": 3, // 1932 国登録有形・歴史的駅舎
  // Rank 2:中堅+ 補完
  "setouchi-tsukudani": 2, // 瀬戸内小魚佃煮郷土
  "shobara-michi-no-eki-overview": 2, // 庄原道の駅圏概論
  "nakamoto-ryokan-takehara": 2, // 竹原老舗旅館
  "shobara-yumegasaki-onsen": 2, // 庄原 1995 開湯
  "shobara-knitwear": 2, // 庄原ニット産地
  "miyajima-aki-bori": 2, // 安芸彫宮島伝統
  "saijo-okumura-jinja": 2, // 御建神社 807・酒造神
  "fukuyama-myo-myo-jin": 2, // 妙宣寺 1271 日蓮宗
  "kibitsu-jinja-bingo-kagura": 2, // 備後吉備津神社神楽
  "miyajima-tamatori-fes-aug": 2, // 玉取祭 8 月夏祭
  "saijo-akiyo-walk": 2, // 西条酒蔵通り散策
  "mihara-yakitori-zone": 2, // 三原焼鳥圏
  "kake-momiji-spot": 2, // 大鼓滝紅葉
  "innoshima-flower-center": 2, // 因島フラワーセンター
  "shimanami-cycling-toll": 2, // しまなみ通行料インフラ
  "tomonoura-kanko-bus": 2, // 鞆の浦観光バス

  // ── 広島県 R7 補完 (Sprint 37.x・270 達成) ──────────────────
  // Rank 3:重文+ 国指定史跡+ 老舗+ 発祥+ 国営公園+ 鎮守府代表
  "hiroshima-peace-cathedral-1954": 3, // 重文 2006・戦後建築初・村野藤吾
  "mihara-jou-ato": 3, // 1567 小早川隆景・国指定史跡 1957・海上浮城
  "tomonoura-numakuma-jinja": 3, // 延喜式式内社・能舞台重文・ハマボウ天然記念物
  "kure-chinjufu-historic-zone": 3, // 1889 4 大鎮守府・大和建造地
  "shobara-bihoku-park-1995": 3, // 中国地方唯一国営公園・150ha
  "shirunashi-tantanmen-kisaku-1999": 3, // 汁なし担々麺発祥
  "kure-reimen-chinraiken-1956": 3, // 呉冷麺発祥 1956
  "onomichi-meron-pan-honten": 3, // 尾道メロンパン発祥 1936
  // Rank 2:中堅+ 補完
  "okunoshima-kyukamura": 2, // 休暇村大久野島 1963・うさぎ島唯一宿
  "jinseki-kogen-hotel": 2, // 県北部高原リゾート・標高 700m
  "carp-official-shop-mazda-stadium": 2, // カープ公式店・スタジアム内
  "miyoshi-mirasaka-aizome": 2, // 三良坂藍染・備後伝統
  "fukuyama-seishikan-1855": 2, // 福山藩校・阿部正弘設立
  "ehaba-park-yozakura": 2, // 江波山桜 1300・固有種
  "hijiyama-park-sakura-1903": 2, // 比治山公園 1903・都市公園 100 選
  "kosuke-yama-etajima": 2, // 古鷹山 376m・旧海兵象徴
  "anjitsu-grape-picking": 2, // 安芸津ぶどう狩り
  "etajima-ferry-hiroshima": 2, // 江田島フェリー
  "okunoshima-rabbit-rental-cycle": 2, // 大久野島レンタサイクル
  "kure-chuo-sanbashi": 2, // 呉中央桟橋・松山+ 江田島 hub

  // ── 静岡県 R9 補完 (Sprint 38.x・267 達成) ──────────────────
  // Rank 3:国宝+ 老舗 429 年+ 国指定史跡+ 国宝五仏+ 名勝+ 早咲き 1 位
  "cho-jiya-1596-mariko": 3, // 1596・429 年・歌川広重浮世絵モチーフ
  "ganjyojuin-1189-izunokuni": 3, // 1189 北条時政・国宝運慶五仏
  "ryotanji-1340-hamamatsu": 3, // 1340 井伊家菩提・小堀遠州国指定名勝
  "yokosuka-jou-ato-kakegawa": 3, // 1578 徳川築・国指定史跡 1981
  "shuzenji-temple-807": 3, // 807 空海開基・修善寺発祥
  "akiha-jinja-tenryu": 3, // 全国 800 社総本宮・1300 年
  "dougashima-cave-cruise": 3, // 国指定天然記念物・遊覧船洞窟進入
  "atami-cherry-blossom-jan": 3, // 全国最早桜
  // Rank 2:中堅+ 補完
  "heda-fukai-ebi": 2, // 戸田深海えび料理
  "kawazu-kinmedai": 2, // 河津金目鯛
  "heda-onsen-area": 2, // 戸田温泉旅館圏
  "matsuzaki-onsen-area": 2, // 松崎温泉旅館圏
  "hamamatsu-hina-ningyo": 2, // 浜松雛人形・全国 3 大
  "yaizu-eki-mae-shotengai": 2, // 焼津駅前商店街
  "koganezaki-sunset": 2, // 黄金崎・夕陽百選
  "matsuzaki-namako-kabe": 2, // 松崎なまこ壁通り
  "heda-tuna-festival-jan": 2, // 戸田まぐろ祭 1 月
  "jr-minobu-line-shizuoka": 2, // JR 身延線
  "hamanako-yuran-sen": 2, // 浜名湖遊覧船
  "ito-port-oshima-ferry": 2, // 伊東-大島フェリー

  // ── 第十七卷 石川県 食 R1 (Sprint 39.1・開卷) ──────────────────
  // Rank 3:御用達 + 400 年老舗 + 全国 4 大 + 国指定無形 + 三大朝市 + 5 大醤油郷
  "kanazawa-jibuni-otomatsu-1830": 3, // 1830 加賀藩御用達料亭
  "ono-shoyu-1644-overview": 3, // 全国 5 大醤油郷・1644 380 年
  "omicho-ichiba-1721": 3, // 1721 304 年・金沢の台所
  "moriya-1625-kanazawa": 3, // 1625 400 年・全国 4 大老舗・長生殿落雁
  "morohachi-rakugan-1849": 3, // 1849 176 年・落雁老舗
  "maruhachi-bocha-1863": 3, // 1863 162 年・加賀棒茶発祥
  "fukumitsuya-1625-kanazawa": 3, // 1625 400 年・石川県最古酒蔵
  "manzairaku-shuzo-1716": 3, // 1716 309 年・萬歳楽
  "noguchi-naohiko-shuzo-2017": 3, // 現代の名工 農口杜氏
  "wajima-asaichi-1000-years": 3, // 千年市場・日本三大朝市
  "suzu-shio-agehama-350": 3, // 国指定無形民俗 2008・全国唯一現役揚浜式
  // Rank 2:中堅 + 補完
  "jibuni-overview": 2, // 治部煮郷土料理
  "kaga-yasai-overview": 2, // 加賀野菜 15 品目認定 1997
  "morimori-zushi-kanazawa-1995": 2, // 1995 30 年・回転寿司代表
  "kanazawa-mawaru-zushi-overview": 2, // 廻る金沢概論
  "kanazawa-kaisendon-omicho": 2, // 近江町海鮮丼集積
  "kanazawa-oden-takasa-1936": 2, // 高砂 1936 89 年
  "kanazawa-oden-kuroyuri-1953": 2, // 黒百合 1953 72 年
  "kanazawa-oden-sanko-1958": 2, // 三幸 1958 67 年
  "kuruma-bu-ishikawa-overview": 2, // 車麩郷土
  "nakatani-kintsuba-1934": 2, // 中田屋 1934 91 年
  "fukume-shogatsu-kanazawa": 2, // 福梅・正月菓子
  "kaga-bocha-overview": 2, // 加賀棒茶概論
  "kazuma-shuzo-1869-noto": 2, // 数馬酒造 1869 156 年・能登
  "noto-fugu-overview": 2, // 能登ふぐ・冬旬

  // ── 第十七卷 石川県 住 R1 (Sprint 39.2) ──────────────────
  // Rank 3:1300+ 年老舗 + 国指定重伝建 + 日本三名湯 + 日本一の宿連続 40 年 + 国際ブランド
  "araya-totoan-1624-yamashiro": 3, // 1624 401 年・北大路魯山人滞在
  "houshi-718-awazu": 3, // 718 1307 年・世界第 2 古旅館・46 代継承
  "yamanaka-onsen-area-overview": 3, // 日本三名湯・芭蕉奥の細道
  "yamashiro-onsen-area-overview": 3, // 1300 年・北大路魯山人ゆかり・古総湯 2010
  "kagaya-1906-wakura": 3, // 1906 119 年・日本一の宿連続首位 40 年 + 232 室
  "wakura-onsen-area-overview": 3, // 1200 年・能登半島代表
  "higashichayagai-machiya-stay": 3, // 国指定重伝建 2001・最大規模
  "hyatt-centric-kanazawa-2020": 3, // Hyatt 北陸初進出
  // Rank 2:中堅 + 補完
  "kanazawa-machiya-overview": 2, // 金沢町家泊概論
  "nishichayagai-machiya-stay": 2, // 重伝建 2008・最静か
  "kanazumi-chayagai-machiya-stay": 2, // 重伝建 2008・五木寛之文学
  "kaga-onsen-area-overview": 2, // 加賀温泉郷概論
  "yamanaka-kohotei-1641": 2, // 古久里来 1641 384 年
  "awazu-onsen-area-overview": 2, // 粟津温泉概論
  "katayamazu-onsen-area-overview": 2, // 片山津温泉
  "notojima-minshuku-area-overview": 2, // 能登島民宿圏・2024 被災
  "wajima-onsen-stay-area": 2, // 輪島温泉宿圏・2024 大火被災
  "noto-2024-quake-lodging-impact": 2, // 能登地震宿泊状況総覧
  "ana-crowne-plaza-kanazawa-2009": 2, // ANA クラウンプラザ 1985 40 年
  "hotel-nikko-kanazawa-1995": 2, // ホテル日航金沢 1995 30 年・大友楼入居
  "kanazawa-tokyu-hotel-1972": 2, // 金沢東急 1972 53 年
  "dormy-inn-kanazawa-natural-onsen": 2, // ドーミーイン 天然温泉 + 夜鳴きそば
  "toyoko-inn-kanazawa-eki-higashi": 2, // 東横イン 駅東口
  "mitsui-garden-kanazawa-2009": 2, // 三井ガーデン 2009
  "richmond-hotel-kanazawa-2010": 2, // リッチモンド 2010

  // ── 第十七卷 石川県 衣 R1 (Sprint 39.3) ──────────────────
  // Rank 3:全国 99% シェア + 国指定伝統工芸品 + 全国唯一 + 二大友禅 + 老舗 359 年
  "kanazawa-haku-overview": 3, // 全国 99% シェア・国指定 1977
  "hakuza-kanazawa": 3, // 黄金の蔵・代表観光拠点
  "imai-kinpaku-1898": 3, // 1898 127 年・国宝供給
  "kaga-yuzen-overview": 3, // 二大友禅・武家文化・国指定 1975
  "kaga-yuzen-densan-kaikan": 3, // 加賀友禅振興会総合拠点
  "nagamachi-buke-yashiki-area": 3, // 1583 442 年・武家文化象徴
  "kutaniyaki-overview-1655": 3, // 1655 大聖寺藩・国指定 1975・全国 3 大磁器
  "komatsu-kutaniyaki-art-museum": 3, // 2002 開館・九谷焼総合美術館
  "wajima-nuri-overview-1975": 3, // 国指定 1975・124 工程
  "wajima-koubo-nagaya-2009": 3, // 2009 9 工房連結
  "yamanaka-shikki-overview": 3, // 全国木地最大産地・国指定 1975
  "ootabi-yaki-1666": 3, // 1666 359 年・加賀藩茶道御用窯・11 代継承
  "kaga-kebari-overview": 3, // 全国唯一伝統釣り毛針・国指定 1980
  "korinbo-daiwa-1923": 3, // 1923 102 年・金沢中心代表
  // Rank 2:中堅 + 補完
  "yasue-kinpaku-museum-1974": 2, // 1974 51 年・日本唯一金箔博物館
  "kanazawa-haku-experience-overview": 2, // 金箔貼体験概論
  "kaga-gosai-overview": 2, // 加賀五彩(藍 + 臙脂 + 草 + 黄土 + 古代紫)
  "kaga-yuzen-experience-overview": 2, // 加賀友禅体験概論
  "kutaniyaki-five-areas": 2, // 5 大主要産地概論
  "dera-i-kutani-area-nomi": 2, // 寺井 30+ 窯元
  "wajima-shikki-kaikan": 2, // 輪島塗振興会会館
  "yamanaka-uruschiza": 2, // 山中漆器伝統産業会館
  "kaga-nui-overview": 2, // 加賀繍・国指定 1979
  "meitetsu-emza-1970": 2, // 1970 55 年・武蔵ランドマーク
  "kanazawa-anto-100ban": 2, // 北陸新幹線後の観光土産 hub

  // ── 第十七卷 石川県 育 R1 (Sprint 39.4) ──────────────────
  // Rank 3:日本三名園・国指定特別名勝・国指定重文・国宝・国指定無形民俗・1300+ 年・米国ミシュラン
  "kenrokuen-1822": 3, // 1822 203 年・日本三名園・国指定特別名勝 1922
  "kanazawa-jou-park-1583": 3, // 1583 442 年・前田家本拠地・石川門 国重文
  "myoryuji-ninja-1643": 3, // 1643 382 年・忍者寺・からくり仕掛け
  "terramachi-tera-cluster-1616": 3, // 1616・国指定重伝建 2012・70+ 寺院
  "daijoji-1263": 3, // 1263 762 年・曹洞宗北陸別格本山・国指定重文
  "nataadera-717": 3, // 717 1308 年・国指定重文・芭蕉ゆかり
  "shirayama-hime-jinja-717": 3, // 全国白山神社 3000 社総本宮・1300 年
  "keta-taisha-noto": 3, // 能登一宮・国指定重文 5 棟
  "oyama-jinja-1873": 3, // 神門 国指定重文 1875・前田利家祭神
  "kanazawa-21st-museum-2004": 3, // SANAA 設計・年間 200+ 万人
  "kokuritsu-kogeikan-2020": 3, // 国立美術館初の地方移転
  "ishikawa-prefectural-museum-1959": 3, // 国宝色絵雉香炉 野々村仁清
  "noto-kiriko-matsuri-overview": 3, // 国指定重要無形民俗 2015・200+ 祭
  "nanao-seihaku-matsuri-may": 3, // 国指定重要無形民俗 1983・でか山日本最大級
  "anjyaku-no-seki-1184-komatsu": 3, // 1184 841 年・歌舞伎勧進帳発祥
  "nomura-ke-bukeyashiki": 3, // ミシュラン 2 つ星 2009
  // Rank 2:中堅 + 補完
  "kanazawa-jou-50ken-nagaya-2001": 2, // 五十間長屋 90m 木造復元
  "gyokusen-immarui-2015": 2, // 玉泉院丸庭園復元
  "kanazawa-jou-kahokumon-2010": 2, // 河北門復元
  "suzu-suga-jinja": 2, // 須須神社・式内社・御船祭 国指定 2014
  "kanazawa-jinja-1794": 2, // 1794 231 年・前田家祈願所
  "dt-suzuki-museum-2011": 2, // 鈴木大拙館・谷口吉生設計
  "taniguchi-architecture-museum-2019": 2, // 谷口父子記念建築館
  "wajima-kiriko-kaikan": 2, // 30+ 基大型キリコ展示
  "udatsu-yama-park-1635": 2, // 1635 390 年・金沢俯瞰

  // ── 第十七卷 石川県 楽 R1 (Sprint 39.5) ──────────────────
  // Rank 3:日本三霊山・国指定名勝・全国唯一・1300 年湯・代表祭礼
  "kanazawa-hyakumangoku-matsuri-jun": 3, // 1952 74 年・前田利家入城祭・200,000+ 観客
  "hakusan-1day-hike": 3, // 2702m・日本三霊山・白山国立公園 1962
  "hakusan-shiramine-village": 3, // 国指定重伝建 2012
  "shiroyone-senmaida-rice-terrace": 3, // 国指定名勝 2001・1004 棚田
  "chirihama-nagisa-driveway": 3, // 全国唯一砂浜車道・1968 57 年
  "kakusenkei-yamanaka-walk": 3, // 鶴仙渓・芭蕉ゆかり・あやとり橋 1991
  "yamashiro-kosouyu-2010": 3, // 山代古総湯 2010 復元
  "awazu-onsen-soyu-ashiyu": 3, // 1300 年共同湯・粟津温泉
  "notojima-aquarium-1982": 3, // 北陸最大水族館・ジンベエザメ
  "noto-kongo-cliff-shika": 3, // 30km 断崖・松本清張ゼロの焦点
  "kanazawa-jou-yozakura-spring": 3, // 兼六園無料夜開放 + 桜
  // Rank 2:中堅 + 補完
  "kanazawa-jou-50ken-lightup": 2, // 五十間長屋ライトアップ
  "gyokusen-immarui-yakei": 2, // 玉泉院丸夜景
  "kanazawa-lightup-bus-weekend": 2, // ライトアップバス週末
  "katamachi-nightlife": 2, // 北陸最大繁華街
  "higashichayagai-night-walk": 2, // ひがし茶屋街夜散策
  "kanazawa-summer-fireworks": 2, // 金沢納涼花火 12000 発
  "katayamazu-shibayama-cruise": 2, // 柴山潟遊覧船・7 色変化湖
  "hakusan-ichi-rino-ski": 2, // 一里野温泉スキー場
  "shirayamahime-area-walk": 2, // 白山比咩神社周辺散策
  "seiiki-no-misaki-suzu": 2, // 聖域の岬・パワースポット
  "mitsuke-jima-noto": 2, // 見附島・軍艦島・2024 崩壊
  "wakura-yumoto-square-ashiyu": 2, // 和倉湯元 24h 足湯
  "noto-2024-quake-tourism-impact": 2, // 能登観光復興状況

  // ── 第十七卷 石川県 行 R1 (Sprint 39.6・R1 全完結) ──────────────────
  // Rank 3:北陸新幹線開業 + 鼓門世界 14 駅 + 全国先駆 + 大規模空港
  "hokuriku-shinkansen-2015-kanazawa": 3, // 2015 金沢延伸・観光ブーム起点
  "hokuriku-shinkansen-2024-tsuruga": 3, // 2024 敦賀延伸・関西連結
  "kanazawa-eki-2015-tsuzumimon": 3, // 鼓門 2005・世界 14 駅選出
  "komatsu-airport-1944": 3, // 1944 81 年・石川主空港・国際線
  "machinori-rental-cycle-2012": 3, // 2012 全国先駆共有自転車
  "kanazawa-shujou-bus": 3, // 観光客主要交通
  // Rank 2:中堅 + 補完
  "komatsu-eki-2024": 2, // 2024 新幹線新駅
  "kaga-onsen-eki-2024": 2, // 2024 新幹線新駅・加賀温泉 hub
  "jr-nanao-line": 2, // JR 七尾線
  "iri-ishikawa-railway-2015": 2, // IR いしかわ並行在来線
  "wakura-onsen-eki": 2, // 七尾線終端・のと鉄道起点
  "hokutetsu-ishikawa-line": 2, // 北鉄石川線・白山アクセス
  "hokutetsu-asanogawa-line": 2, // 北鉄浅野川線・内灘
  "kanazawa-furatto-bus": 2, // ふらっとバス・100 円
  "hokutetsu-bus-overview": 2, // 北鉄バス全体
  "noto-railway-anasui": 2, // のと鉄道・里山里海号
  "noto-airport-2003": 2, // 能登空港 2003・1 日 2 便
  "noto-bus-overview": 2, // 能登バス
  "noto-2024-quake-transport-impact": 2, // 能登交通復興 advisory
  "komatsu-airport-limousine": 2, // 金沢-小松空港リムジン
  "ishikawa-rental-car-area": 2, // 県内レンタカー・能登推奨
  "kanazawa-tour-taxi": 2, // 観光タクシー
  "hokuriku-jidousha-do-ishikawa": 2, // 北陸自動車道
  "kanazawa-port-2018": 2, // 金沢港・国際クルーズ

  // ── 第十七卷 石川県 R2 補完 (Sprint 40.x) ──────────────────
  // Rank 3:GI 認定+ 老舗 168 年+ 国指定重要文化財・国指定史跡・国指定無形民俗 1979・全国唯一
  "kano-gani-overview": 3, // GI 登録 2014・全国 3 大ズワイ
  "noto-gyu-overview": 3, // GI 登録 2007・全国上位希少和牛
  "koshi-amasei-1857": 3, // 1857 168 年・あんころ餅老舗
  "kayotei-yamanaka-1932": 3, // 1932 93 年・山中高級料理旅館
  "hanamurasaki-yamashiro-1872": 3, // 1872 153 年
  "kanazawa-shokunin-daigaku-1996": 3, // 全国初伝統工芸技術継承学校
  "kanazawa-chikuonki-museum-2001": 3, // 全国唯一蓄音器博物館
  "honganji-kanazawa-bukke-1546": 3, // 1546 479 年・加賀一向一揆中心
  "noda-yama-maeda-haka": 3, // 国指定史跡 2009・前田家代々墓
  "gojinjo-daiko-namune-1577": 3, // 1577 448 年・国指定無形民俗 1979
  "shima-1820-higashichaya": 3, // 1820 205 年・国指定重文 2003・全国最古級茶屋建築
  // Rank 2:中堅 + 補完
  "hakuichi-soft-higashichaya": 2, // 金箔ソフトクリーム代表
  "gori-cuisine-kanazawa": 2, // ゴリ料理・加賀料理基本
  "yatadaya-shoutoen-katayamazu": 2, // 片山津江戸期老舗
  "yokoyasue-shotengai-kanazawa": 2, // 横安江町通り「金沢の原宿」
  "kanazawa-noh-museum-2006": 2, // 加賀宝生流能楽
  "nishida-kitaro-museum-2002": 2, // 西田哲学・谷口設計
  "kanazawa-shimin-geijutsumura-1996": 2, // 全国唯一 24h 開放文化施設
  "yamanaka-za-yamanaka": 2, // 山中節伝統芸能
  "hokuriku-shinkansen-kagayaki": 2, // 北陸新幹線最速列車

  // ── 第十七卷 石川県 R3 補完 (Sprint 41.x) ──────────────────
  // Rank 3:発祥老舗 + 国指定史跡 + 国指定重文 + 全国唯一・最古
  "champion-curry-1961-nonoichi": 3, // 1961 64 年・金沢カレー発祥
  "hanton-rice-grill-otsuka": 3, // 1957 68 年・ハントンライス発祥
  "8ban-ramen-1967-kaga": 3, // 1967 58 年・北陸代表チェーン
  "ranpu-no-yado-suzu": 3, // 1579 446 年・聖域の岬高級宿
  "kutaniyaki-yoshidaya-1822": 3, // 国指定史跡 2009・再興九谷代表
  "rosanjin-yamashiro-1915": 3, // 北大路魯山人滞在跡
  "fukuura-toudai-shika-1876": 3, // 1876 149 年・国指定史跡 2017・全国最古現役木造灯台
  "ushitsu-abare-matsuri-jul-noto": 3, // 能登キリコ祭中核・国指定無形 2015
  "kanazawa-akarenga-museum-2015": 3, // 国指定重文 1990・1909-1914 陸軍兵器庫
  "noto-satoyama-yu-doro-2013": 3, // 80.8km 能登観光大動脈・2013 無料化
  // Rank 2:中堅 + 補完
  "komatsu-uton-overview": 2, // 江戸期郷土食・徳川家康好物
  "wakura-niji-to-umi-1985": 2, // 加賀屋系列モダン本館 1985
  "wakura-aenokaze-2006": 2, // 加賀屋系列現代和風 2006
  "kanazawa-kimono-rental-area": 2, // 着物レンタル 50 店舗
  "muro-saisei-museum-kanazawa-2002": 2, // 室生犀星記念館
  "izumi-kyoka-museum-kanazawa-1999": 2, // 泉鏡花記念館
  "kanazawa-furusato-ijinkan-1992": 2, // 金沢ふるさと偉人館 12 人
  "uchi-nada-beach-summer": 2, // 内灘海岸 8km 海水浴
  "asanogawa-kohan-sakura": 2, // 浅野川河畔桜 200 株
  "kanazawa-noto-direct-bus": 2, // 金沢-能登直行バス

  // ── 第十七卷 石川県 R4 補完 (Sprint 42.x) ──────────────────
  // Rank 3:1300+ 年・国指定重伝建・国指定重要文化財・全国唯一・老舗 132 年
  "matsuda-wagasa-1893": 3, // 1893 132 年・加賀和傘 国指定 1983
  "wajima-shitsugei-museum-1991": 3, // 1991 34 年・全国唯一漆芸専門
  "monzen-ji-soto-zen-noto-1321": 3, // 1321 704 年・曹洞宗大本山祖院
  "kuroshima-bukke-yashiki-2009": 3, // 国指定重伝建 2009・北前船船主集落
  "nanao-bijutsukan-1995-tohaku": 3, // 長谷川等伯記念
  // Rank 2:中堅 + 補完
  "shichiri-iwagaki-noto": 2, // 七尾湾岩牡蠣・夏旬
  "gogo-curry-2003-kanazawa": 2, // 金沢カレー全国 + 海外展開
  "kanazawa-eki-bento-overview": 2, // 金沢駅弁概論
  "kagari-kichijotei-yamanaka-1932": 2, // 1932 93 年・河鹿風呂
  "basho-no-yakata-yamanaka": 2, // 山中温泉芭蕉ゆかり史跡
  "hatori-yamashiro-modern": 2, // 山代温泉現代和風モダン・五彩テーマ
  "kanazawa-craft-experience-overview": 2, // 4 大工芸体験概論
  "kanazawa-nishi-chayagai-shiryokan-1990": 2, // 西茶屋資料館・島田清次郎
  "ishikawa-kenritsu-nougakudo-1972": 2, // 加賀宝生流専用舞台
  "shigure-tei-tea-house-kenrokuen": 2, // 兼六園内 1726 茶亭復元
  "saigawa-yuhodo-walk": 2, // 室生犀星筆名由来
  "asanogawa-yuzen-nagashi-may": 2, // 加賀友禅水洗実演 5 月
  "noto-michi-no-eki-overview": 2, // 能登道の駅 8+ 駅
  "kanazawa-takayama-highway-bus": 2, // 金沢-高山 4 時間
  "kanazawa-kyoto-osaka-highway-bus": 2, // 金沢-関西高速バス

  // ── 第十七卷 石川県 R5 補完 (Sprint 43.x) ──────────────────
  // Rank 3:老舗 279/206/158/93+ 年・全国 3 大魚醤・全国唯一・国指定・年中行事
  "kuze-shuzoten-1746-tsubata": 3, // 1746 279 年・河北郡最古酒蔵
  "kano-shuzo-1819-kaga": 3, // 1819 206 年・常きげん
  "ishiri-noto-fish-sauce": 3, // 全国 3 大魚醤
  "asadaya-1867-kanazawa": 3, // 1867 158 年・谷崎潤一郎滞在
  "wagara-naka-koubo-yamanaka-1908": 3, // 1908 117 年・山中漆器老舗
  "anjyaku-sumiyoshi-jinja-noto": 3, // 全国唯一の難関突破祈願
  "kanazawa-kogei-koubou-utatsu-2008": 3, // 2008 若手工芸家育成 5 部門
  "kanazawa-marathon-2014": 3, // 2014 開始・12,000+ 人参加
  // Rank 2:中堅 + 補完
  "kanazawa-daikon-zushi": 2, // 金沢冬郷土食
  "kaga-renkon-tempura": 2, // 加賀料理基本
  "kanazawa-newgrand-hotel-1958": 2, // 1958 67 年・香林坊
  "wakura-rurikou-1932": 2, // 1932 93 年・和倉独立旅館
  "kaga-hachiman-okiagari": 2, // 加賀百万石郷土玩具
  "kanazawa-shinise-kinenkan-1989": 2, // 老舗記念館・旧中島薬局
  "gokoku-jinja-kanazawa-1875": 2, // 1875 150 年・桜 200 株
  "kanazawa-jazz-street-october": 2, // 北陸ジャズ代表音楽祭
  "maido-san-volunteer-1996": 2, // 1996 29 年・100+ ボランティアガイド
  "kaga-onsen-bus-canbus": 2, // 加賀温泉郷周遊バス・1 日券 ¥1,100
  "noto-airport-shuttle-bus": 2, // 能登空港 ANA 便接続
  "hokutetsu-1day-free-pass": 2, // ¥800・観光客必須

  // ── 第十七卷 石川県 R6 補完 (Sprint 44.x) ──────────────────
  // Rank 3:老舗 1300+ 年 + 1257 年最古神社 + 691 年寺 + 444 年公園 + 257 年酒蔵
  "soumegen-shuzo-1768-suzu": 3, // 1768 257 年・能登最古酒蔵
  "fubaya-1865-honten": 3, // 1865 160 年・加賀麩老舗
  "honkokuji-nanao-1334": 3, // 1334 691 年・日蓮宗
  "yama-no-tera-cluster-nanao-1581": 3, // 1581 444 年・前田利家整備 16+ 寺
  "komaruyama-park-1581-nanao": 3, // 1581 444 年・前田利家初築城跡
  "ishiura-jinja-kanazawa-768": 3, // 768 1257 年・金沢最古神社
  "yuwaku-onsen-area-1300": 3, // 1300+ 年湯・養老 2 開湯
  "suda-seika-kutaniyaki-1869": 3, // 1869 156 年・魯山人指導窯
  // Rank 2:中堅 + 補完
  "noto-konbu-overview": 2, // 北前船流通系譜
  "kawashika-sou-yamanaka-1937": 2, // 1937 88 年・鶴仙渓沿
  "kanazawa-shiratoriro-yamaraku-1990": 2, // 大正ロマン・金沢城隣接
  "mystays-premier-kanazawa-2018": 2, // 北陸新幹線後新ホテル
  "owari-machi-shotengai-kanazawa": 2, // 江戸期商人街・老舗集積
  "kanazawa-yuwaku-yumeji-museum-1981": 2, // 竹久夢二記念
  "yuwaku-yumeji-sai-april": 2, // 4 月夢二祭
  "shirasagi-jr-tokuetsu-1964": 2, // 1964 61 年・JR 特急
  "kanazawa-tokyo-night-bus-overview": 2, // 関東連結代替路
  "kanazawa-eki-tax-free-counter-2015": 2, // 北陸新幹線開業時開設

  // ── 第十七卷 石川県 R7 補完 (Sprint 45.x) ──────────────────
  // Rank 3:ミシュラン 2 つ星 + 国指定重要文化財 + 日本最古銅像 + 国際芸術祭
  "mekumi-zushi-1973-nonoichi": 3, // ミシュラン 2 つ星 2024-2025
  "komatsu-tenmangu-1683": 3, // 国指定重文 1968・1683 前田利常造営
  "meiji-kinen-no-hyou-1880-kenrokuen": 3, // 1880 145 年・日本武尊像最古級銅像
  "oku-noto-art-festival-2017": 3, // 北川フラム総合プロデューサー
  // Rank 2:中堅 + 補完
  "kaga-gyu-overview": 2, // 加賀地方ブランド和牛
  "nomi-budou-overview": 2, // 能美ぶどう郷
  "yusankaku-yamashiro-1898": 2, // 1898 127 年・山代温泉中堅老舗
  "nakamura-bijutsukan-kanazawa-1966": 2, // 茶道美術専門・谷口吉郎設計
  "maeda-tosanokami-museum-2002": 2, // 加賀藩 8 家家老史料館
  "noto-kannon-pilgrimage-overview": 2, // 能登 33 観音霊場
  "asanogawa-toro-nagashi-summer": 2, // 加賀夏の風物詩

  // ── 第四三卷 熊本県 食 R1 (Sprint 46.1・開卷) ──────────────────
  // Rank 3:発祥老舗 + GI 指定 + 全国 1 位 + 江戸期細川家伝来 + 全国 3 大
  "kokutei-1957-kumamoto": 3, // 元祖熊本ラーメン・焦がしニンニク発祥
  "keika-ramen-1955": 3, // 太肉麺発祥・全国チェーン
  "komurasaki-1954": 3, // 熊本ラーメン最古老舗
  "koranetei-1934-kumamoto": 3, // 太平燕発祥・1934 91 年
  "mori-karashi-renkon-1864": 3, // 1864 161 年・元祖辛子蓮根
  "takahashi-shuzo-1900": 3, // 全国 1 位米焼酎メーカー・白岳
  "ohishi-shuzo-1872": 3, // 球磨焼酎最古級・1872 153 年
  "kuma-shochu-overview": 3, // GI 指定 1995・全国 GI 焼酎代表
  "aso-akagyu-overview": 3, // GI 指定 2017・阿蘇カルデラ放牧
  "amakusa-daiou-chicken-overview": 3, // 1928 絶滅 → 1993 復活・大型地鶏
  "basashi-overview": 3, // 全国 1 位馬肉消費県
  "kumamoto-suika-overview": 3, // 全国 1 位生産県
  // Rank 2:中堅 + 補完
  "kumamoto-ramen-overview": 2, // 全国 3 大豚骨概論
  "kogashi-niniku-overview": 2, // マー油発祥
  "taipien-overview": 2, // 太平燕概論
  "suganoya-1968-kumamoto": 2, // 馬肉専門代表 1968
  "karashi-renkon-overview": 2, // 細川家伝来概論
  "horaku-manju-1953": 2, // 蜂楽饅頭・熊本銘菓
  "ikinari-dango-overview": 2, // 江戸期郷土菓子
  "sengetsu-shuzo-1903": 2, // 1903 122 年・繊月
  "jufuku-shuzo-1890": 2, // 1890 135 年・武者返し
  "amakusa-takomeshi": 2, // 天草郷土食
  "takana-overview": 2, // 全国 3 大高菜
  "ittsuji-guruguru-overview": 2, // 細川家伝来前菜
  "aso-dengaku-overview": 2, // 阿蘇郷土食

  // ── 第四三卷 熊本県 住 R1 (Sprint 46.2) ──────────────────
  // Rank 3:303 年最古旅館 + 1300 年伝承 + 黒川温泉日本一連続上位 + 加藤清正寄進湯
  "okyaku-ya-kurokawa-1722": 3, // 1722 303 年・黒川温泉郷最古
  "shinmeikan-kurokawa-1944": 3, // 洞窟風呂発祥・黒川復興立役者
  "yamamizuki-kurokawa-1995": 3, // プロが選ぶ 100 選連続上位・全室露天
  "kurokawa-onsen-area-overview": 3, // 九州 2 大温泉郷・入湯手形
  "tsuetate-onsen-overview": 3, // 弘法大師伝承 1300 年・鯉のぼり 3500 匹
  "shimoda-onsen-amakusa-overview": 3, // 1502 開湯・天草最古・520+ 年
  "yamaga-onsen-sakura-yu-2012": 3, // 1640 加藤清正寄進・2012 復元
  "ana-crowne-plaza-kumamoto-newsky-1972": 3, // 熊本最初国際ブランド・熊本城 view
  "kumamoto-castle-hotel-1969": 3, // 熊本最古級・56 年
  // Rank 2:中堅 + 補完
  "fumoto-ryokan-kurokawa": 2, // 1898 127 年・黒川中堅
  "ayu-no-sato-hitoyoshi-1965": 2, // 1965 60 年・球磨川沿
  "hitoyoshi-onsen-area-overview": 2, // 1494 開湯伝承・530+ 年
  "aso-uchinomaki-onsen-overview": 2, // 1885 開湯・140 年
  "kikuchi-onsen-overview": 2, // 美肌の湯・菊池一族文化
  "tamana-onsen-overview": 2, // 1300 年伝承・大宰府古道沿
  "hotel-nikko-kumamoto-2003": 2, // 2003 22 年・上通商店街徒歩 1 分
  "mitsui-garden-kumamoto-2012": 2, // 2012 13 年・駅徒歩 3 分
  "dormy-inn-kumamoto-2008": 2, // 2008 17 年・天然温泉
  "kumamoto-2016-quake-lodging-impact": 2, // 2016 地震宿泊復興状況
  "hitoyoshi-2020-water-impact-overview": 2, // 2020 7 月水害宿泊復興

  // ── 第四三卷 熊本県 衣 R1 (Sprint 46.3) ──────────────────
  // Rank 3:国指定伝統工芸品 + 国指定無形民俗 + 1573 加藤清正町割り + 1300 年伝承 + 全国 80% シェア
  "higo-zougan-overview": 3, // 国指定 1985・細川家武士道具
  "yamaga-toro-matsuri-overview": 3, // 国指定無形民俗 1980・千人灯籠踊り
  "kutami-uchiwa-overview": 3, // 国指定 1976・加藤清正招致阿波職人
  "shodai-yaki-overview": 3, // 国指定 2003・1632 加藤清正開窯
  "amakusa-toseki-overview": 3, // 全国磁器原料シェア 80%
  "amakusa-toujiki-overview": 3, // 国指定 2003・天草陶石使用
  "itsuki-washi-overview": 3, // 1300 年伝承・子守唄の里
  "kamitori-shotengai-1573": 3, // 1573 加藤清正町割り・452 年
  "tsuruya-dept-1952": 3, // 熊本最大百貨店・73 年
  "kumamoto-prefectural-craft-museum-1982": 3, // 熊本工芸総合展示・43 年
  // Rank 2:中堅 + 補完
  "higo-zougan-experience-overview": 2, // 肥後象眼体験概論
  "yamaga-toro-mingei-kan": 2, // 1925 建築・国登録有形
  "yamaga-toyozenkaidou-machinami": 2, // 江戸期豊前街道町並み
  "konohazaru-overview": 2, // 玉名江戸期郷土玩具
  "higo-temari-overview": 2, // 細川家女性手芸
  "cocosa-2017": 2, // 下通中央 SC
  "sakuramachi-kumamoto-2019": 2, // 大型複合 SC + バスハブ
  "shimotori-shotengai-overview": 2, // 480m アーケード・100+ 店

  // ── 第四三卷 熊本県 育 R1 (Sprint 46.4) ──────────────────
  // Rank 3:国指定特別史跡 + 国宝 + 国指定重文 + 世界遺産 + 1219 年・2300 年伝承
  "kumamoto-jou-1607": 3, // 1607 418 年・特別史跡 1955・日本三名城・2032 復興目標
  "kumamoto-jou-honmaru-goten-2008": 3, // 本丸御殿 2008 復元
  "kato-jinja-shrine": 3, // 加藤清正祭神・熊本城内
  "honmyoji-kumamoto-1614": 3, // 1614 411 年・加藤清正菩提
  "aso-jinja-overview": 3, // BC282 伝承・全国 500 社総本宮・国重文楼門 2023 復元
  "aso-five-peaks-overview": 3, // 世界最大級カルデラ・現役活火山
  "suizenji-jojuen-1632": 3, // 1632 393 年・国指定史跡 + 名勝 1929
  "taishoji-tomb-hosokawa": 3, // 1610 415 年・細川家代々墓・国指定史跡 1932
  "amakusa-sakitsu-kyokai-1888": 3, // 世界遺産 2018・海の天主堂
  "amakusa-oe-kyokai-1933": 3, // 1933・天草キリシタン代表
  "aoi-aso-jinja-1610": 3, // 1610 国宝 5 棟 2008・茅葺独特建築
  "hitoyoshi-jou-ato": 3, // 1198 827 年・相良家 700 年・国指定史跡 1961
  "yachiyo-za-1910": 3, // 1910 115 年・国指定重文 1988・坂東玉三郎
  "kikuchi-jinja-1869": 3, // 別格官幣社・菊池武士団 700 年
  "kumamoto-jou-2016-quake-restoration": 3, // 2032 復興目標
  // Rank 2:中堅 + 補完
  "kumamoto-prefectural-bijutsukan-1976": 2, // 細川家伝来 + 装飾古墳壁画
  "amakusa-shiro-museum-1989": 2, // 島原の乱 1637 関連
  "amakusa-collegio-kan-1985": 2, // 16-17C 天草学林・最古活字
  "kumamoto-prefecture-museum-1952": 2, // 自然史 + 熊本歴史総合
  "soseki-natsume-kumamoto-residence": 2, // 1968 移築・草枕の故郷
  "lafcadio-hearn-kumamoto-residence": 2, // 1891-1894・漱石前任

  // ───────────────────────────────────────────────
  // Sprint 46.5 楽 R1 — 熊本楽 19 筆
  // ───────────────────────────────────────────────
  // Rank 3:阿蘇象徴 + 国指定 + 名水百選 + 三大祭 + 恐竜
  "aso-volcanic-crater-overview": 3, // 阿蘇活火山・九州象徴
  "kusasenri-overview": 3, // 阿蘇のシンボル草原
  "daikanbo-overview": 3, // 阿蘇カルデラ最展望地
  "komezuka-overview": 3, // 国指定 1937・阿蘇象徴
  "shirakawa-suigen-overview": 3, // 名水百選 1985
  "amakusa-5-bridges-1966-pearl-line": 3, // 1966 60 年・天草本土結
  "kumagawa-kudari-1487": 3, // 538 年・日本三急流
  "hi-no-kuni-matsuri-aug": 3, // 80 万人・熊本市三大祭代表
  "mifune-kyoryu-museum-1998": 3, // 1998 27 年・恐竜化石
  // Rank 2:中堅
  "takamori-yusui-tunnel": 2, // 高森湧水トンネル
  "kurokawa-yuakari-illumi": 2, // 黒川温泉湯あかり
  "amakusa-dolphin-watching": 2, // 天草イルカ
  "kikuchi-keikoku-momiji": 2, // 菊池渓谷
  "a-train-jr-2011": 2, // 観光列車 A 列車
  "asobo-i-jr-2011": 2, // 観光列車あそぼーい
  "kawasemi-yamasemi-jr-2017": 2, // 観光列車かわせみ・やませみ
  "kumamoto-jou-cherry-spring": 2, // 熊本城桜
  "kinpou-zan-kumamoto-665m": 2, // 金峰山
  "kumamoto-zoo-1929": 2, // 1929 96 年動植物園

  // ───────────────────────────────────────────────
  // Sprint 46.6 行 R1 — 熊本行 20 筆
  // ───────────────────────────────────────────────
  // Rank 3:新幹線全通 + 駅 icon + 全国最古級市電 + 県唯一空港 + 西日本最大 BT
  "kyushu-shinkansen-2011-full": 3, // 2011 全通・九州縦貫
  "kumamoto-eki-2018-andou-tadao": 3, // 安藤忠雄設計象徴
  "kumamoto-ichi-densha-1924": 3, // 101 年・全国最古級市電
  "aso-kumamoto-airport-1971": 3, // 県唯一空港・54 年
  "kumamoto-sakuramachi-bus-terminal-2019": 3, // 西日本最大級 BT
  // Rank 2:中堅 + 補完
  "shin-yatsushiro-eki": 2, // 新幹線分岐駅
  "jr-hoyoji-line-1928": 2, // 豊肥本線
  "jr-misumi-line-1899": 2, // 三角線
  "jr-hisatsu-line-2020-suspended": 2, // 肥薩線・2020 豪雨運休
  "minami-aso-tetsudou-1986": 2, // 南阿蘇鉄道・観光復旧 2023
  "kuma-kawa-tetsudou-1989": 2, // くま川鉄道
  "kumamoto-fukuoka-highway-bus": 2, // 福岡熊本高速バス・ひのくに
  "kumamoto-osaka-night-bus": 2, // 大阪熊本夜行バス
  "kumamoto-shimabara-ferry-30min": 2, // 熊本港-島原 30 分
  "kumamoto-airport-limousine": 2, // 空港リムジン
  "kumamoto-rental-car-area": 2, // レンタカー総覧
  "kumamoto-tour-taxi": 2, // 観光タクシー
  "kumamoto-bus-1day-pass": 2, // バス 1 日券
  "kumamoto-2016-quake-transport-impact": 2, // 2016 地震交通影響
  "kumamoto-2020-flood-transport-impact": 2, // 2020 豪雨交通影響

  // ───────────────────────────────────────────────
  // Sprint 47.x R2 補完 — 熊本県 +20 筆
  // ───────────────────────────────────────────────
  // Rank 3:国宝 + UNESCO + 国指定 + 528 年最古銘菓 + 黒川ブランド + 九州横断
  "chosen-ame-sonodaya": 3, // 528 年・熊本最古銘菓
  "kaseita-takadaya": 3, // 370 年・細川家御用達献上菓子
  "yatsushiro-jinja-myoken-1186": 3, // 839 年・全国妙見総本宮の一つ
  "yatsushiro-myoken-matsuri-unesco-2016": 3, // UNESCO 2016 + 国指定重要無形 2011
  "tsujun-kyo-1854-national-treasure-2023": 3, // 国宝 2023 + 江戸期土木遺産初の国宝
  "tabaruzaka-1877-seinan-war": 3, // 国指定史跡 1979 + 西南戦争激戦地
  "kyu-hosokawa-gyobu-tei-1646": 3, // 国指定重文 1985 + 武家屋敷現存稀少
  "yamaga-toro-koubo-overview": 3, // 国指定無形民俗 1980
  "yatsushiro-igusa-tatami-overview": 3, // 国内 80%シェア + 350 年
  "kurokawa-nyutou-tegata-1986": 3, // 黒川観光ブランド構築の象徴
  "yamanami-highway-1964": 3, // 61 年・九州横断観光ルート
  // Rank 2:中堅 + 補完
  "homare-no-jindaiko-koubai-1953": 2, // 1953 香梅・熊本代表ブランド
  "sozankyo-uchinomaki-1933": 2, // 阿蘇内牧 92 年元華族別荘
  "ryokan-sanga-kurokawa-1947": 2, // 黒川 78 年 5 老舗の一つ
  "hirayama-onsen-area-overview": 2, // 山鹿郊外美肌温泉
  "kawajiri-hamono-overview": 2, // 国指定伝統工芸 2003
  "aso-farmland-1995": 2, // 南阿蘇カルデラ拠点リゾート
  "ubuyama-bokujo": 2, // 阿蘇北部酪農体験
  "milk-road-aso-outer-rim": 2, // 阿蘇外輪山ドライブ
  "sl-hitoyoshi-2009-2024-retired": 2, // 2009-2024 引退済 SL

  // ───────────────────────────────────────────────
  // Sprint 48.x R3 補完 — 熊本県 +20 筆
  // ───────────────────────────────────────────────
  // Rank 3:三大老舗 + 国指定 + グローバル 800 店 + 全国 1 位
  "keika-ramen-1955-kumamoto": 3, // 熊本ラーメン三大老舗 70 年
  "ajisen-ramen-1968": 3, // グローバル 800 店熊本発
  "senkou-farm-1972-mifune": 3, // 馬肉全国トップ級ブランド
  "dekopon-shiranui-1972-origin": 3, // 熊本県発祥 + 全国 1 位生産
  "shouhinken-1688-yatsushiro": 3, // 国指定名勝 1955 + 337 年
  "yatsushiro-jou-ato-1622": 3, // 国指定史跡 1955 + 一国一城令例外
  "aso-jinja-hifuri-shinji-march": 3, // 重要無形民俗 1982 + 800 年
  "aso-panorama-line-1958": 3, // 火口直行 67 年 + ロープウェイ後の主要 access
  // Rank 2:中堅
  "yamauni-tofu-itsuki": 2, // 五木村郷土食 600 年
  "yoneya-bessou-tsuetate-1925": 2, // 杖立 100 年大正期建築
  "aso-plaza-hotel-1971": 2, // 阿蘇内牧大型 54 年
  "hotel-sekia-1989-tamana": 2, // 玉名 36 年ゴルフリゾート
  "amu-plaza-kumamoto-2021": 2, // JR 駅前 200 店 SC・4 年
  "joyusaien-sakura-no-baba-2011": 2, // 熊本城下 30 店・14 年
  "higo-rokka-shoubu-edo": 2, // 細川藩園芸文化県無形
  "aso-ropeway-1958-2024-discontinued": 2, // 廃止済世界初活火山ロープウェイ
  "aso-cuddly-dominion-1959": 2, // 動物公園 66 年
  "aspecta-1995-nishihara": 2, // 県営野外コンサート 30 年
  "36-plus-3-jr-kyushu-2020": 2, // JR 九州 D&S 列車
  "kumamoto-kagoshima-highway-bus": 2, // 桜島号高速バス 27 年

  // ───────────────────────────────────────────────
  // Sprint 49.x R4 補完 — 熊本県 +20 筆
  // ───────────────────────────────────────────────
  // Rank 3:国指定 + 国登録 + 県最大バス + 西日本最大遊園地 + 阿蘇五大宮
  "higo-chonkake-koma": 3, // 国指定重要有形民俗 1980
  "kuma-ken-1991-national-intangible": 3, // 国指定重要無形民俗 1991
  "enkei-bunsui-yamato-1956": 3, // 国登録有形 1999 + 実用稼働
  "soyokyo-1934-national-meisho": 3, // 国指定名勝 1934
  "mitsui-greenland-1965-arao": 3, // 西日本最大級遊園地 60 年
  "chiyonosono-shuzo-1896": 3, // 129 年熊本酵母 KA-1 蔵
  "hitoyoshi-ryokan-1908": 3, // 国登録有形文化財 1996 + 117 年
  "sankou-bus-1898": 3, // 127 年熊本最大バス事業者
  "kunizou-jinja": 3, // BC282 阿蘇神社五大宮の一つ
  // Rank 2:中堅 + 補完
  "okashi-no-shiro-musha-gaeshi-1978": 2, // 武者がえし観光菓子工場 47 年
  "aso-torimiya-1925": 2, // 阿蘇内牧馬ロッケ 100 年
  "suiranrou-hitoyoshi-1925": 2, // 人吉温泉 100 年
  "konohazaru-tomita-kiln": 2, // 玉東町土人形 700 年県指定
  "kamishikimi-kumano-imasu-jinja": 2, // 高森パワースポット
  "itsuki-no-komoriuta": 2, // 五木村民謡代表
  "musashi-zuka-park": 2, // 武蔵終焉地 + 記念館
  "senzui-kyo-aso-miyama-kirishima": 2, // 阿蘇ミヤマキリシマ 100 万本
  "kusamakura-onsen-tensui": 2, // 漱石草枕舞台公共温泉
  "kumamoto-dentetsu-1911": 2, // くまでん 114 年
  "kamikumamoto-eki-1891": 2, // 上熊本駅 134 年

  // ───────────────────────────────────────────────
  // Sprint 50.x R5 補完 — 熊本県 +20 筆
  // ───────────────────────────────────────────────
  // Rank 3:国指定特別史跡 + 国指定史跡 + 全国 1 位 + ハイヤ系発祥 + 主要 access
  "kikuchi-jou-7c-special-historic": 3, // 国指定特別史跡 2004 + 7C 古代山城
  "tomioka-jou-ato-reihoku-2003": 3, // 国指定史跡 2003 + 423 年
  "tamana-kofun-gun": 3, // 国指定史跡 1922 + 1500 年装飾古墳
  "kusakabe-yoshimi-jinja": 3, // BC282 阿蘇五大宮南宮 + 下り宮
  "yokoi-shonan-memorial": 3, // 幕末改革思想家 + 公議政体論
  "kumamoto-tomato-winter-spring": 3, // 冬春トマト全国 1 位
  "kyushu-expressway-kumamoto-1980": 3, // 45 年・福岡-鹿児島大動脈
  "aso-kumamoto-airport-international": 3, // 国際線 gateway 台湾観光
  "jr-kagoshima-honsen-kumamoto-1909": 3, // 116 年幹線
  "ushibuka-haiya-matsuri-april": 3, // 全国ハイヤ系民謡発祥
  // Rank 2:中堅
  "senryu-ramen-1962-tamana": 2, // 玉名ラーメン代表
  "sanzoku-ryorimichi-takamori": 2, // 高森山賊料理発祥
  "umasakura-basashi-kumamoto": 2, // 馬肉専門 60 年
  "sangen-kurokawa-modern": 2, // 黒川モダン高級
  "aso-san-hotel": 2, // 阿蘇火口直下 60 年
  "tsukasa-no-yu-tamana": 2, // 玉名公共温泉
  "michi-no-eki-aso-1995": 2, // 阿蘇物産集積 30 年
  "michi-no-eki-tsujun-kyo": 2, // 山都町観光ハブ
  "nagabuta-kaishouro-uto": 2, // 干潮道路 SNS スポット
  "nabegataki-falls-oguni": 2, // 裏見滝 + CM 撮影地

  // ───────────────────────────────────────────────
  // Sprint 51.x R6 補完 — 熊本県 +20 筆
  // ───────────────────────────────────────────────
  // Rank 3:県内最古酒蔵 + 国指定史跡 + 国指定無形 + 全国最大級五重塔 + 鯉のぼり元祖
  "tsujun-shuzo-yamato-1770": 3, // 1770 県内最古級・255 年
  "tatsuda-shizen-koen-hosokawa-tomb": 3, // 国指定史跡 1955 + 細川 4 代墓
  "shimo-jinja-aso-1551": 3, // 国指定重無形 1995 + 阿蘇五大宮
  "rengeji-tanjouji-tamana-1956": 3, // 全国最大級五重塔 51m
  "tsuetate-koinobori-april-may": 3, // 鯉のぼり川渡し祭発祥
  "imakin-shokudo-uchinomaki-1925": 3, // 阿蘇赤牛丼名店 100 年
  "eikokuji-hitoyoshi-1408": 3, // 相良菩提寺 + 幽霊画 + 漱石記述
  "yatsushiro-eki-1896": 3, // 八代旧駅 + 3 線結節 129 年
  "aso-volcano-museum-1982": 3, // 阿蘇火山学解説中核
  "aso-kumamoto-airport-domestic": 3, // 国内主要 access
  // Rank 2:中堅
  "kawazu-shuzo-yamaga-1932": 2, // 山鹿酒蔵 93 年
  "ikoi-ryokan-kurokawa-1956": 2, // 黒川 69 年中堅
  "noshiyu-kurokawa-1980": 2, // 黒川 杉皮葺 45 年
  "michi-no-eki-itsuki-2002": 2, // 五木観光 23 年
  "aso-jinja-monzen-shopping": 2, // 阿蘇神社参道商店街
  "yatsushiro-matsui-jinja-1701": 2, // 八代松井家氏神 324 年
  "tsukimawari-park-takamori": 2, // 阿蘇 5 岳眺望田園公園
  "greenpia-minami-aso-1989": 2, // 公共大型リゾート 36 年
  "route-218-yamato-takachiho": 2, // 通潤橋 + 蘇陽峡ルート
  "kumamoto-oita-highway-bus-1985": 2, // やまびこ号阿蘇経由 40 年

  // ═══════════════════════════════════════════════════════════════════
  // 第〇二卷 青森県 R1 — Sprint 1.1-1.6 + 8 rank 3 + 30 rank 2 = 38
  // ═══════════════════════════════════════════════════════════════════

  // Rank 3:世遺 + 国指定 + 全国級 + 日本三大
  "sannai-maruyama-jomon": 3, // UNESCO 世遺 2021・縄文最大級
  "korekawa-jomon-museum-hachinohe": 3, // UNESCO 世遺 2021 + 国宝合掌土偶 2009
  "aomori-nebuta-festival": 3, // 国指定 1980 + 東北三大祭・270 万人
  "hirosaki-castle-tenshu": 3, // 東北唯一現存十二天守 + 国指定重文
  "hirosaki-sakura-festival": 3, // 日本三大桜・200 万人
  "oirase-keiryu": 3, // 国特別名勝 + 国天然記念物 1928
  "oma-tuna-port-shimokita": 3, // 本州最北端鮪 + 2019 年 3.3 億円
  "shayokan-dazai-osamu-kanagi": 3, // 太宰治生家 + 国指定重文 2004

  // Rank 2:地域代表
  // 食
  "a-factory-aomori": 2, // JR 東日本 2010 + 青森駅前
  "senbei-jiru-hachinohe": 2, // B-1 グランプリ 2012 + 郷土料理百選
  "ki-ni-naru-ringo-ragnao": 2, // 青森銘菓代表
  "mutsu-bay-hotate-hiranai": 2, // 帆立全国 2 位 + 1958 養殖発祥
  "tsugaru-niboshi-ramen-overview": 2, // 青森ラーメン主流系
  // 衣
  "tsugaru-nuri-overview": 2, // 経産省指定 1975
  "hirosaki-kogin-research-institute": 2, // こぎん復興本山 1962
  "tsugaru-vidro-hokuyo-glass": 2, // 北洋硝子 1949 + 県伝統工芸
  "yawatauma-hachinohe": 2, // 日本三大駒
  // 住
  "sukayu-onsen-hakkoda": 2, // 国民保養温泉地第 1 号 1954
  "tsuta-onsen-oirase": 2, // 1147 + 大町桂月終焉地
  "hoshino-aomoriya-misawa": 2, // 星野リゾート 2009
  "aoni-onsen-lamp": 2, // 1929 + 電気なしランプの宿
  "furofushi-onsen-fukaura": 2, // 日本海絶景露天
  "oirase-keiryu-hotel": 2, // 星野・1939 + 国岡本太郎暖炉
  // 育
  "aomori-prefectural-museum-art": 2, // あおもり犬・奈良美智
  "towada-art-center": 2, // フラワー・ホース・草間彌生 SANAA
  "hirosaki-renga-museum": 2, // 奈良美智 + 1923 煉瓦倉庫
  "terayama-shuji-memorial-misawa": 2, // 1997 + 寺山修司
  "munakata-shiko-memorial-aomori": 2, // 文化勲章 1970 + ヴェネチア 1956
  "wa-rasse-aomori-nebuta": 2, // 2011 + ねぶた山車 4 台
  "kushibiki-hachimangu-hachinohe": 2, // 1222 + 国宝赤糸威鎧 2 領
  // 楽
  "hirosaki-neputa-festival": 2, // 国指定 1980 + 扇型 8m
  "goshogawara-tachineputa-festival": 2, // 22m 巨大ねぷた
  "hachinohe-sansha-taisai": 2, // ユネスコ 2016 + 国指定 2004
  "gono-line-resort-shirakami": 2, // JR 東 五能線観光列車 1997
  "osorezan-shimokita-spirit": 2, // 日本三大霊場・862 円仁
  "hakkoda-juhyo-snow-monsters": 2, // 日本二大樹氷
  "towada-lake-cruise": 2, // 二重カルデラ + 国特別名勝
  "shirakami-juniko": 2, // 白神世遺バッファ + 青池
  "tsugaru-railway-stove-train": 2, // 1930 + 太宰治『津軽』
  // 行
  "tohoku-shinkansen-shin-aomori-hachinohe": 2, // 2010 全線開通
  "aomori-airport": 2, // 1964 + 県玄関空港
  "jr-east-pass-tohoku-area": 2, // 訪日客 5 日 ¥30,000

  // ═══════════════════════════════════════════════════════════════════
  // 第〇三卷 岩手県 R1 — Sprint 1.1-1.6 + 8 rank 3 + 30 rank 2 = 38
  // ═══════════════════════════════════════════════════════════════════

  // Rank 3:世遺 + 国指定 + 全国級 + 日本三大
  "chusonji-konjikido-hiraizumi": 3, // 国宝建造物第 1 号 1951 + UNESCO 2011
  "motsuji-hiraizumi": 3, // 国特別史跡+名勝 1959 + UNESCO 2011
  "morioka-3-men-overview": 3, // 全国唯一 3 大麺都市
  "morioka-sansa-odori": 3, // 太鼓ギネス 2007 + 東北 5 大祭
  "kitakami-tenshochi-sakura": 3, // 全国 5 大桜名所 + 1921
  "ryusendo-iwaizumi-cave": 3, // 日本三大鍾乳洞 + 国指定天然 1938
  "sanriku-railway-rias-line": 3, // 全国最長第三セクター + 2019 復興
  "appi-kogen-resort": 3, // 全国最大級スキー + 1981

  // Rank 2:地域代表
  // 食
  "shokudoen-morioka-reimen-1954": 2, // 盛岡冷麺発祥
  "hakuryu-morioka-jajamen-1953": 2, // 盛岡じゃじゃ麺発祥
  "azumaya-morioka-wanko-soba": 2, // わんこそば老舗 1907
  "kuji-uni-don-amachan": 2, // 北限うに + あまちゃん効果
  "maesawa-gyu-oshu": 2, // 全国和牛 5 大ブランド
  // 衣
  "nanbu-tetsubin-overview": 2, // 経産省指定 1975
  "suzuki-morihisa-1625": 2, // 400 年最古工房 + 14 代継承
  "iwate-homespun-overview": 2, // 全国唯一伝承 + 英国 1882
  "kawatoku-morioka-1866": 2, // 岩手最古老舗百貨店 159 年
  // 住
  "osawa-onsen-jisuibu": 2, // 1200 年 + 国民保養 + 自炊湯治
  "namari-onsen-fujisanryo": 2, // 600 年 + 国登録 1996 + 立ち湯
  "metropolitan-morioka-hotel": 2, // 374 室盛岡最大級 + JR 東日本
  "jodogahama-park-hotel": 2, // 国立公園内絶景宿
  // 育
  "kanjizaiou-in-ato-hiraizumi": 2, // UNESCO 2011 構成資産
  "goshono-jomon-iseki": 2, // UNESCO 2021 構成資産
  "miyazawa-kenji-memorial-hanamaki": 2, // 1982 + 賢治記念
  "ishikawa-takuboku-memorial-shibutami": 2, // 1986 + 啄木故郷
  "tono-monogatari-museum": 2, // 1910 民俗学発祥
  "iwate-bank-akarenga-1911": 2, // 国指定重文 1994 + 辰野金吾
  "iwate-prefectural-museum-art": 2, // 2001 + 萬鉄五郎
  // 楽
  "hanamaki-matsuri": 2, // 1593 + 神輿 100 基(全国最多)
  "haru-no-fujiwara-matsuri": 2, // 平泉春祭 + 1965
  "jodogahama-miyako": 2, // 三陸復興国立公園代表
  "kitayamazaki-tanohata": 2, // 全国海岸景観 1 位 + 200m 断崖
  "geibikei-ichinoseki": 2, // 国指定名勝 1925 + 三大渓谷美
  "iwatesan-tozan": 2, // 岩手最高峰 2,038m 南部富士
  "koiwai-farm-shizukuishi-1891": 2, // 1891 + 国登録文化財 21 棟
  // 行
  "tohoku-shinkansen-iwate": 2, // 1982 大宮-盛岡開業
  "iwate-hanamaki-airport": 2, // 1964 + 県玄関空港
  "sanriku-fukko-expressway": 2, // 復興道路 + 全区間無料

  // ── 岩手県 R2-R6 補完(Rank 3 +1 + Rank 2 +8 = 9 追加)──

  // Rank 3:UNESCO 無形 + 国宝級
  "hayachine-kagura": 3, // UNESCO 無形 2009 + 国指定 1976 + 800+ 年

  // Rank 2:R2-R6 の地域代表
  "chagu-chagu-umakko": 2, // 国指定重要無形民俗 1978
  "takadachi-yoshitsune-do": 2, // 義経自刃地 + 国指定史跡 + 平泉観光必須
  "mizusawa-imono-oshu": 2, // 南部鉄器水沢系 1,000+ 年最古級
  "kamaishi-unosumai-stadium": 2, // 2019 ラグビー W 杯会場
  "johoji-urushi-kakikaki": 2, // 国選定保存技術 1976 + 全国漆 70%
  "tsunami-densho-museum-rikuzentakata": 2, // 国営追悼祈念施設 2019
  "hayachine-zan-tozan": 2, // 1,917m 岩手 3 大霊山 + UNESCO 無形故山
  "hachimantai-snow-corridor": 2, // 全国 3 大雪の回廊
};

async function main() {
  const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--dry");
  const sb = createAdminClient();

  // 現況查詢 — slug 数 500 超で URL 長制限に当たるため chunk pagination で分割
  const allSlugs = Object.keys(RANK_MAP);
  const CHUNK = 100;
  const currentMap = new Map<string, number>();
  for (let i = 0; i < allSlugs.length; i += CHUNK) {
    const chunk = allSlugs.slice(i, i + CHUNK);
    const { data: currentRows, error: selErr } = await sb
      .from("japan_entries")
      .select("slug, feature_rank")
      .in("slug", chunk);
    if (selErr) throw new Error(`select_failed: ${selErr.message}`);
    for (const r of currentRows ?? [])
      currentMap.set(r.slug as string, (r.feature_rank as number) ?? 0);
  }

  const totalTargets = Object.keys(RANK_MAP).length;
  const foundTargets = currentMap.size;
  const missingSlugs = Object.keys(RANK_MAP).filter(
    (s) => !currentMap.has(s),
  );

  // 計算要變更的筆數
  const toUpdate: Array<{ slug: string; from: number; to: Rank }> = [];
  for (const [slug, targetRank] of Object.entries(RANK_MAP)) {
    const current = currentMap.get(slug);
    if (current === undefined) continue;
    if (current !== targetRank) {
      toUpdate.push({ slug, from: current, to: targetRank });
    }
  }

  console.log(`[rank] 白名單筆數: ${totalTargets}`);
  console.log(`[rank] DB 命中: ${foundTargets}`);
  if (missingSlugs.length > 0) {
    console.warn(
      `[rank] ⚠ ${missingSlugs.length} 筆 slug 不在 DB(可能已 rename 或 seed 尚未跑):`,
    );
    for (const s of missingSlugs) console.warn(`       · ${s}`);
  }
  console.log(`[rank] 需更新: ${toUpdate.length}`);
  for (const u of toUpdate) {
    console.log(`       · ${u.slug}: ${u.from} → ${u.to}`);
  }

  if (dryRun) {
    console.log("[rank] --dry 模式結束,未寫入 DB");
    return;
  }

  if (toUpdate.length === 0) {
    console.log("[rank] 無須更新,DB 已與白名單一致");
    return;
  }

  // 逐筆 UPDATE(量不大,不需批次)
  let ok = 0;
  let fail = 0;
  for (const u of toUpdate) {
    const { error } = await sb
      .from("japan_entries")
      .update({ feature_rank: u.to })
      .eq("slug", u.slug);
    if (error) {
      console.error(`[rank] ✗ ${u.slug}: ${error.message}`);
      fail += 1;
    } else {
      ok += 1;
    }
  }
  console.log(`[rank] ✅ 完成: ok=${ok}, fail=${fail}`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
