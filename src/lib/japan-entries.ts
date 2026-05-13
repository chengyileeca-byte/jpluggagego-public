// JapanPrep 資料層 — japan_entries + japan_municipalities 的型別與 DB helper。
//
// 見 docs/japan-prep-plan.md §3(sub_type)§4(地理)§5(schema)。

import { promises as fs } from "node:fs";
import path from "node:path";

export const CATEGORIES = [
  "food",
  "fashion",
  "lodging",
  "transport",
  "culture",
  "entertainment",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL_ZH: Record<Category, string> = {
  food: "食",
  fashion: "衣",
  lodging: "住",
  transport: "行",
  culture: "育",
  entertainment: "樂",
};

// 6 分類下各自的 sub_type 清單。為了 UI 下拉選單與校驗使用。
// 日後有新 sub_type 直接加這裡,不需 migration(DB 上 sub_type 是 free text)。
export const SUB_TYPES_BY_CATEGORY: Record<Category, readonly string[]> = {
  food: [
    "restaurant_recommend",
    "restaurant_reservation",
    "ramen_shop",
    "izakaya_sake",
    "seasonal_food",
    "street_food_market",
    "cafe_wagashi",
    "michelin_star",
    "local_specialty",
    "farmers_market",
    "seafood_market",
    "jingisukan",
    "sweets_dairy",
    "soup_curry",
    "brewery",
    // Sprint 16.4 北海道 食類專屬 sub_type:
    "hokkaido_local_food", // 北海道郷土名物(豚丼/石狩鍋/ザンギ/松前漬等)+ 飲料(ガラナ/カツゲン)
    // Sprint 17.1 大阪府 食類專屬 sub_type:
    "osaka_konamon", // 粉もん文化(たこ焼/お好み焼/モダン焼/ねぎ焼・大阪のソウルフード)
    "osaka_kushikatsu", // 串カツ(新世界発祥・二度漬禁止文化・だるま 1929 等)
    "osaka_kuidaore", // 食い倒れ街(道頓堀・千日前・新世界・法善寺横丁)
    "osaka_market", // 大阪の市場(黒門「大阪の台所」+ 鶴橋 + 木津 + 天満)
    // Sprint 18.1 兵庫県 食類專屬 sub_type:
    "kobe_steak", // 神戸ステーキ(モーリヤ 1885・WAKKOQU 1962・ミソノ 1945 鉄板焼発祥・神戸牛但馬血統)
    "kobe_sweets", // 神戸洋菓子・ベーカリー(モロゾフ 1931・ユーハイム 1909・ゴンチャロフ 1923・ドンク 1905・フロインドリーブ 1924)
    "nada_brewery", // 灘五郷酒造(西郷+御影郷+魚崎郷+西宮郷+今津郷の 5 大酒造地・剣菱+菊正宗+白鹿+白鶴+大関+沢の鶴)
    "harima_local", // 播磨郷土(明石焼・姫路おでん・揖保乃糸 1418・ヒガシマル醤油 1666・赤穂塩・加古川かつめし)
    "tanba_hyogo_local", // 丹波兵庫郷土(篠山黒豆・栗・松茸・牡丹鍋・鳳鳴酒造 1797・京都丹波と連続)
    "tajima_local", // 但馬郷土(但馬牛 1300 年血統・出石そば 1706・城崎温泉海鮮・松葉ガニ 津居山香住)
    "awaji_local", // 淡路島郷土(玉ねぎ全国 No.1・淡路ビーフ・鳴門鯛春・焼穴子)
    // Sprint 14.1 京都府 食類專屬 sub_type:
    "kyo_kaiseki", // 京懐石・料亭(瓢亭・菊乃井・和久傳 etc.)
    "shojin_ryori", // 精進料理・湯豆腐・湯葉(大德寺一久・順正・奥丹)
    "obanzai", // おばんざい(京町家家庭料理)
    "kyo_zushi", // 京寿司・棒寿司・鯖寿司・箱寿司(いづう・いづ重)
    // Sprint 14.6 沖縄県 食類專屬 sub_type:
    "okinawa_soba", // 沖縄そば(本島・宮古・八重山系統)— ソーキ/三枚肉/中身
    "champuru_ryori", // チャンプルー・沖縄家庭料理(ゴーヤ/ナーベラー/フー/トーフ)
    "american_diner_okinawa", // 米統治 1945-72 由来:A&W・ステーキ・タコライス・ポーク玉子
    "agu_pork_yagi", // アグー豚・山羊(ヒージャー)料理 — 沖縄固有の畜産文化
    "wagyu_yakiniku_okinawa", // 石垣牛・本部牛・沖縄県産和牛 焼肉/ステーキ(Phase 2)
    // Sprint 15.1 奈良県 食類專屬 sub_type:
    "kakinoha_zushi", // 柿の葉寿司(吉野・五條発祥・押し寿司)
    "naraduke", // 奈良漬(酒粕漬・奈良市発祥・1492 文献初出)
    "miwa_somen", // 三輪そうめん(桜井市・素麺発祥地・1200 年前から)
    "yoshino_kuzu", // 吉野葛(本葛・吉野山地・葛餅・葛切り)
    "yamato_cha", // 大和茶(月ヶ瀬・宇陀・山添・茶生産北限)
    "yamato_terroir", // 大和食材(大和牛・大和肉鶏・大和野菜・大和芋等のブランド)
    "cha_gayu", // 茶粥(大和の伝統朝食・1000 年以上の食文化)
    "asuka_food", // 飛鳥鍋・古代食・蘇(明日香・古代再現食)
    "nara_ryotei", // 大和料亭・古都料理(奈良ホテル・三笠会館・江戸三 等)
    // Sprint 19.1 静岡県 食類專屬 sub_type:
    "shizuoka_unagi", // 浜松/三島うなぎ(浜名湖養殖発祥・関西風直焼き・八百徳1869・桜家1856 等)
    "shizuoka_oden", // 静岡おでん(黒だし・串・青のり+削り粉・戦後闇市起源・三河屋1892 等)
    "shizuoka_yakisoba", // 富士宮焼きそば(蒸し太麺・肉かす・削り節・B-1グランプリ 2006/2007 連覇)
    "shizuoka_sakura_ebi", // 桜えび(由比/蒲原・駿河湾固有・世界唯一漁場・春秋2季漁)
    "shizuoka_wasabi", // 静岡わさび(有東木1607発祥・天城/伊豆・徳川献上・葵紋由来)
    "shizuoka_cha", // 静岡茶(本山/川根/牧之原/掛川深蒸/天竜・全国1位生産・八十八夜新茶)
    "shizuoka_meika", // 静岡銘菓(春華堂うなぎパイ1961・田丸屋わさび漬1875・石部屋安倍川もち1804 等)
    // Sprint 20.1 長崎県 食類專屬 sub_type:
    // Sprint 31.1 広島県 食類專屬 sub_type:
    "hiroshima_okonomiyaki", // 広島お好み焼(キャベツ+ 麺入り重ね焼・1500+ 軒・全国 1 位密度)
    "hiroshima_kaki", // 広島牡蠣(全国 60% シェア・宮島周辺養殖・牡蠣土手鍋発祥)
    "hiroshima_ramen", // 尾道ラーメン(小魚+ 背脂)+ 福山ラーメン(備後系)+ 三原やっさ
    "hiroshima_meika", // もみじ饅頭(高津堂 1906 発祥)+ あなごめし(うえの 1901)+ 福山ばら和菓子
    "hiroshima_setouchi_san", // 瀬戸内産物(瀬戸田レモン+ 三原タコ+ 広島あなご+ 鞆鯛)
    "hiroshima_brewery", // 西条酒蔵通り(7 蔵・全国 3 大銘醸地)+ 鞆の浦保命酒(1659 薬酒)
    "hiroshima_hokubu", // 県北部(庄原比婆牛+ 神石高原ジビエ+ 三次ワイナリー)
    "nagasaki_champon", // 長崎ちゃんぽん・皿うどん(四海楼 1899 発祥・新地中華街)
    "nagasaki_castella", // 長崎カステラ(福砂屋 1624 最古・松翁軒 1681・文明堂 1900・ポルトガル伝来)
    "nagasaki_shippoku", // 卓袱料理(中華+和食+蘭学 fusion・花月 1642 最古料亭・卓袱皿の円卓食)
    "nagasaki_chuka", // 中華街(新地中華街 1689・角煮まん よっそう 1866・岩崎本舗 等)
    "nagasaki_toruko_rice", // トルコライス(ピラフ+トンカツ+ナポリタン・ツル茶ん 1925)
    "nagasaki_men", // 島原素麺(全国 3 大)+ 五島うどん(あごだし発祥)
    "nagasaki_shima_san", // 離島産物(対馬とらふぐ・壱岐麦焼酎 GI・五島あご・平戸魚介)
    // Sprint 39.1 石川県 食類專屬 sub_type:
    "ishikawa_kaga_ryori", // 加賀料理(治部煮+ 加賀野菜+ 大野醤油 1644・武家公家料理)
    "ishikawa_kanazawa_sushi", // 金沢寿司+ 近江町市場 1721+ 廻る金沢(回転寿司激戦区)
    "ishikawa_kanazawa_oden", // 金沢おでん(加能ガニ+ 車麩+ 梅貝・高砂 1936/黒百合 1953/三幸)
    "ishikawa_kanazawa_meika", // 金沢銘菓(森八 1625・諸江屋 1849・丸八製茶場 1863・中田屋 1934・落雁 + 加賀棒茶)
    "ishikawa_brewery", // 石川酒蔵(福光屋 1625・萬歳楽 1716・農口尚彦・能登伝統)
    "ishikawa_noto_san", // 能登産物(能登ふぐ + 輪島朝市千年・珠洲塩揚浜 350 年・能登牛)
    // Sprint 46.1 熊本県 食類專屬 sub_type:
    "kumamoto_ramen", // 熊本ラーメン(豚骨 + 焦がしニンニク発祥・黒亭 1957・桂花 1955・こむらさき 1954)
    "kumamoto_taipien", // 太平燕(熊本中華・春雨スープ・紅蘭亭 1934 発祥)
    "kumamoto_basashi", // 馬刺し馬肉料理(全国 1 位消費県・菅乃屋 1968 等)
    "kumamoto_karashi_renkon", // 辛子蓮根(細川家伝来・森本舗 1864・郷土食)
    "kumamoto_meika", // 熊本銘菓(いきなり団子・蜂楽饅頭 1953・誉の陣太鼓等)
    "kumamoto_kuma_shochu", // 球磨焼酎(GI 1995・米焼酎・高橋 1900・繊月 1903・大石 1872・寿福 1890)
    "kumamoto_aso_amakusa", // 阿蘇 + 天草産物(阿蘇赤牛 GI 2017・天草大王・タコめし・高菜)
  ],
  fashion: [
    "shopping_district_urban",
    "shopping_district_local",
    "kimono_rental",
    "outlet_mall",
    "vintage_used",
    "craft_goods",
    "textile_traditional",
    "footwear_traditional",
    // Sprint 14.2 京都府 衣類專屬 sub_type:
    "kyo_kimono_shop", // 京呉服老舗(千總・ゑり善・矢代仁・千切屋治兵衛・岡重 etc.)
    "nishijin_ori", // 西陣織元・帯司(龍村・帯屋捨松・川島・誉田屋・細尾)
    "kyo_yuzen", // 京友禅 工房・染屋
    "kyo_kuro_zome", // 京黒紋付染(馬場染工業 etc.)
    "kyo_komon", // 京小紋
    "kyo_shibori", // 京鹿の子絞
    "kyo_nui", // 京繍(刺繍)
    "tenugui_furoshiki", // 手ぬぐい・風呂敷(永楽屋 etc.)
    "obi_specialty", // 帯専門店
    "nenju_buddhist", // 念珠・数珠(安田念珠 etc.)
    "tabi_traditional", // 足袋・京履物
    "kanzashi_hairorn", // かんざし・髪飾り(かづら清 etc.)
    "tango_chirimen", // 丹後ちりめん(丹後地域の織元)
    "textile_workshop", // 織物・染物 工房・体験施設
    "textile_museum", // 織物・染色 博物館・記念館
    "kimono_event", // 装束行事(葵祭・時代祭・舞妓体験)
    // Sprint 14.6 沖縄県 衣類專屬 sub_type:
    "bingata", // 紅型(琉球王府御用達の型染・城間/玉那覇/知念 etc.)
    "ryukyu_textile", // 沖縄伝統織物統合 — 芭蕉布・宮古上布・八重山ミンサー・首里織・読谷山花織・久米島紬・知花花織
    "ryukyu_glass", // 琉球ガラス(米軍 1945 廃瓶再利用文化由来・読谷/北谷)
    "ryusou_experience", // 琉装体験(琉球王朝期の宮廷衣装、本土系 kimono と異なる)
    "kariyushi_wear", // かりゆしウェア(沖縄版アロハ・1970 沖縄県開発・公務員制服可)
    "okinawa_accessory", // 琉球サンゴ細工・月桃製品・勾玉・紅型風呂敷 等の沖縄独自アクセ
    // Sprint 16.1 北海道 衣類專屬 sub_type:
    "hokkaido_winter_gear", // 防寒装備(スノーブーツ・ダウン・カイロ・氷上滑り止め等の北海道必需品)
    "hokkaido_outdoor_gear", // アウトドア(ニセコスキー・大雪山登山・ライダース・釣り gear)
    "ainu_traditional_dress", // アイヌ伝統衣装(ルウンペ・チカルカルペ・モコシ等・神事 + 民族衣装)
    // Sprint 15.2 奈良県 衣類專屬 sub_type:
    "nara_uchiwa", // 奈良団扇(春日大社御用達・1818 池田含香堂 等)
    "nara_zarashi", // 奈良晒(平安期からの麻織物・仏教衣装・茶人愛用)
    "yamato_kasuri", // 大和絣・郷土織物
    "yoshino_washi", // 吉野和紙(国栖紙・寺装紙)
    "nara_shika_souvenir", // 鹿モチーフ・現代奈良観光衣・絞り・t-shirt
    "nara_shrine_amulet", // 寺社授与所(御守・御朱印帳・破魔矢 等の wearable accessory)
    // Sprint 17.7 大阪府 衣類專屬 sub_type:
    "osaka_dept_store", // 大阪老舗百貨店(大丸心斎橋 1726・阪急梅田 1929・高島屋なんば 1932 等)
    "osaka_underground_mall", // 大阪地下街(世界最大級・クリスタ長堀 + ホワイティ + 阪急三番街 + ディアモール 等)
    "osaka_youth_fashion", // 大阪若者ファッション街(アメリカ村・堀江・中崎町・南船場)
    // Sprint 19.3 静岡県 衣類專屬 sub_type:
    "shizuoka_enshu_textile", // 遠州織物(浜松綿織物産業の核心・遠州縞・遠州ストライプ・現代ジーンズ伝承)
    "shizuoka_kakegawa_kuzufu", // 掛川葛布(平安期からの葛繊維織物・山梨屋等の現存業者)
    "shizuoka_suruga_craft", // 駿河工芸(竹千筋細工 1844・駿河漆器・駿河和染・静岡市山間)
    // Sprint 20.3 長崎県 衣類專屬 sub_type:
    // Sprint 31.3 広島県 衣類專屬 sub_type:
    "hiroshima_kumanofude", // 熊野筆(国指定伝統工芸品 1975・安芸郡熊野町・全国 80% シェア・化粧筆+ 書道筆)
    "nagasaki_hasami_mikawachi", // 波佐見焼 + 三川内焼(国指定伝統工芸品 1978・東彼杵郡 + 佐世保)
    "nagasaki_bidoro_bekko", // 長崎ビードロ(吹きガラス)+ 長崎べっ甲(鎖国期独占・タイマイ甲細工)
    "nagasaki_dept_arcade", // 長崎佐世保百貨店 + アーケード商店街(浜屋 1880・玉屋 1806・四ヶ町 1km)
    "nagasaki_christian_pilgrim", // 教会群+大浦天主堂+出島の宗教/異国記念土産
    // Sprint 23.x 長崎県 衣類追加 sub_type:
    "nagasaki_omura_aizome", // 大村藍染(江戸期からの長崎県唯一の藍染め伝統・横山藍染工房)
    "osaka_mall_building", // 大阪 具体 ショッピングビル(グランフロント + ルクア + なんばパークス + HEP FIVE + ヨドバシ 等の建物単位)
    // Sprint 18.5 兵庫県 衣類專屬 sub_type:
    "hyogo_dept_store", // 兵庫老舗百貨店(大丸神戸 1913・神戸阪急 2019 旧そごう 1933)
    "hyogo_mall_building", // 兵庫 具体 ショッピングビル(umie + ミント神戸 + 神戸国際会館 + 西宮ガーデンズ + ピオレ姫路 等)
    // Sprint 補完 沖縄県 衣類追加 sub_type:
    "okinawa_dept_store", // 沖縄百貨店(リウボウ 1953・沖縄唯一の百貨店)
    "okinawa_mall_building", // 沖縄 具体 ショッピングビル(那覇メインプレイス 2002 + DFS T ギャラリア 2004 等)
    // Sprint 46.3 熊本県 衣類專屬 sub_type:
    "kumamoto_higo_zougan", // 肥後象眼(国指定伝統工芸 1985・鉄地金銀象嵌・細川家武士道具由来)
    "kumamoto_yamaga_kutami", // 山鹿灯籠(国指定無形民俗 1980)+ 来民うちわ(国指定伝統 1976・加藤清正招致阿波職人由来)
    "kumamoto_shodai_amakusa", // 小代焼(1632 加藤清正開窯・国指定伝統 2003)+ 天草陶磁器(国指定 2003・天草陶石全国 80%)
    "kumamoto_traditional_craft", // その他熊本工芸(五木和紙・木葉猿・肥後手まり等)
    "kumamoto_kumamoto_dept", // 熊本市内百貨店 + 商店街(鶴屋 1952・サクラマチ 2019・COCOSA 2017・上通 1573・下通 480m)
    // Sprint 39.3 石川県 衣類專屬 sub_type:
    "ishikawa_kanazawa_haku", // 金沢箔(全国 99% シェア・箔座・今井金箔 1898・安江金箔工芸館 1974・食用箔)
    "ishikawa_kaga_yuzen", // 加賀友禅(京友禅と並ぶ二大友禅・武家文化・加賀五彩・伝統産業会館)
    "ishikawa_kutaniyaki", // 九谷焼(1655 大聖寺藩開窯・1807 再興・5 大エリア・小松美術館 2002)
    "ishikawa_wajima_nuri", // 輪島塗(1975 国指定伝統工芸・工房長屋 2009・2024 大火被災)
    "ishikawa_yamanaka_shikki", // 山中漆器(全国木地最大産地・1975 国指定・山中温泉郷一体)
    "ishikawa_kanazawa_kogei", // 金沢工芸(大樋焼 1666・加賀繍・加賀毛針 等の小規模工芸)
    "ishikawa_kanazawa_dept", // 金沢百貨店・商店街(エムザ 1970・香林坊大和 1923・あんと 2010 等)
  ],
  lodging: [
    "budget_hotel_chain",
    "onsen_ryokan",
    "luxury_hotel",
    "rural_minshuku",
    "capsule_hostel",
    "love_hotel",
    "glamping_camp",
    "flash_sale",
    // Sprint 14.3 京都府 住類專屬 sub_type:
    "kyo_ryokan_classic", // 老舗京旅館(俵屋・柊家・炭屋 等)
    "international_luxury", // 超高級 international(Aman・Ritz・Four Seasons 等)
    "kyo_machiya_stay", // 京町家泊(庵 Iori・京の温所・町家ホテル)
    "shukubo_temple", // 寺宿・宿坊(妙心寺・延暦寺・南禅寺 等)
    "rural_ryokan_kyoto", // 京都北部・南部 rural 旅館(美山・丹後・大原)
    "lodging_area_guide", // エリア別住宿推奨(京都駅周辺・祇園・嵐山 等)
    "seasonal_lodging", // 花見・紅葉・雪見 季節限定推奨
    // Sprint 14.6 沖縄県 住類專屬 sub_type:
    "okinawa_resort_hotel", // 沖縄海洋リゾート(本部/恩納/読谷/宮古/八重山 大型ビーチホテル)
    "island_minshuku", // 離島民宿(波照間/与那国/座間味/伊江/小浜/粟国 等の家族経営)
    "american_house_stay", // 米軍住宅再利用宿(浦添パイプライン/港川/北谷の外人住宅)
    // Sprint 15.3 奈良県 住類專屬 sub_type:
    "nara_hotel_classical", // 奈良ホテル 1909 + 歴史的洋館(関西の迎賓館)
    "nara_machiya", // ならまち町家泊(京都町家とは別系統・古都圈古民家)
    "yoshino_sankei_yado", // 吉野山参詣宿(桜・修験道・千本桜 view)
    // Sprint 17.8 大阪府 住類專屬 sub_type:
    "osaka_usj_official", // USJ オフィシャル 4 ホテル(ユニバーサルポート + 京阪 + パークフロント + JR)
    "osaka_kix_airport", // 関空エリアホテル(空港島 + りんくう泊)
    // Sprint 19.2 静岡県 住類專屬 sub_type:
    "shizuoka_izu_classic", // 伊豆温泉老舗旅館(熱海:古屋 1806・つるや 1900・蓬莱 1932・大観荘 / 修善寺:あさば 1675・新井 1872・菊屋 / 伊東:大野屋・川奈 1936 / 湯ヶ島:落合楼 1874・湯本館 1923 等)
    "shizuoka_fuji_resort", // 富士山麓リゾート(御殿場時之栖・ホテルクラッド・富士山三島東急 等)
    "shizuoka_hamanako_lodging", // 浜名湖・舘山寺温泉(ホテル九重・ウェルシーズン浜名湖 等)
    // Sprint 20.2 長崎県 住類專屬 sub_type:
    // Sprint 31.2 広島県 住類專屬 sub_type:
    "hiroshima_miyajima_lodging", // 宮島内宿(岩惣 1854・厳島いろは・宮島ホテル群・神聖島泊)
    "hiroshima_setouchi_classical", // 尾道+ 鞆の浦+ しまなみ classical 宿(西山別館 1840・尾道国際 1962・ベラビスタ等)
    "nagasaki_unzen_classical", // 雲仙温泉老舗(雲仙観光ホテル 1935 国登録・富貴屋 1730・九州ホテル 1917・国立公園第 1 号 1934)
    "nagasaki_huis_ten_bosch", // ハウステンボス内ホテル群(ホテルヨーロッパ・アムステルダム・オークラ JR HTB 等)
    "nagasaki_island_lodging", // 離島宿(五島・壱岐・対馬の旅館+民宿+リゾート・教会群アクセス)
    // Sprint 39.2 石川県 住類專屬 sub_type:
    "ishikawa_kanazawa_machiya", // 金沢町家泊(ひがし/にし/主計町 3 茶屋街周辺の古民家ステイ)
    "ishikawa_kaga_onsen_classic", // 加賀温泉郷老舗(山中/山代/粟津/片山津・法師 718 1300 年・あらや 1624・古久里来 1641・芭蕉ゆかり)
    "ishikawa_noto_classic", // 能登老舗(和倉加賀屋 1906・能登島民宿・輪島温泉・2024 地震影響)
    "ishikawa_kanazawa_classic", // 金沢市内 高級 + ビジネス(ANA クラウンプラザ + Hyatt 2020 + 日航 1995 + 東急 1972 + 三井 + ドーミー 等)
    // Sprint 46.2 熊本県 住類專屬 sub_type:
    "kumamoto_kurokawa_classic", // 黒川温泉郷(御客屋 1722・新明館・山みず木 1995・ふもと等の 30 旅館・日本一温泉地連続上位)
    "kumamoto_kuma_aso_classic", // 球磨人吉温泉(あゆの里 1965 + 1494 開湯伝承)+ 阿蘇内牧温泉(明治期)
    "kumamoto_other_onsen", // 山鹿(さくら湯 2012 復元)+ 天草下田 1502+ 杖立 1300 年+ 菊池+ 玉名等
    "kumamoto_kumamoto_classic", // 熊本市内ホテル(ANA 1972 + キャッスル 1969 + 日航 2003 + 三井 2012 + ドーミー 等)
  ],
  transport: [
    "ticket_promo",
    "route_map_urban",
    "cable_car_lift",
    "sightseeing_train",
    "limited_express_private",
    "night_transit",
    "ferry_island",
    "rental_car_tips",
    "airport_access",
    // Sprint 14.4 京都府 行類專屬 sub_type:
    "kyo_railway_company", // 京都の鉄道会社・路線(JR・京阪・阪急・嵐電・叡電・地下鉄)
    "kyo_one_day_pass", // 1 日券・トラベルパス
    "kyo_taxi_service", // 京都タクシー(MK・ヤサカ・京観 等)
    "bicycle_rental", // レンタサイクル
    "area_access_guide", // エリア別アクセス(嵐山・鞍馬・大原 等)
    "walking_route", // 散策路線・歩き旅
    "transit_hub", // 主要乗換 hub(京都駅・出町柳 等)
    "seasonal_transit", // 季節限定運行・行事日交通規制
    "accessibility_info", // バリアフリー・車椅子情報
    // Sprint 14.6 沖縄県 行類專屬 sub_type:
    "okinawa_yui_rail", // ゆいレール(沖縄都市モノレール・沖縄唯一の鉄道・2003 開業)
    "okinawa_island_routes", // 離島空路・フェリー統合(RAC・JTA・安栄観光・八重山観光等)
    "okinawa_us_military_transit", // 米軍関係交通(嘉手納・普天間・キャンプ周辺アクセス)
    // Sprint 15.4 奈良県 行類專屬 sub_type:
    "nara_kintetsu_line", // 近鉄路線(奈良の動脈・奈良/京都/吉野/橿原/大阪/南大阪 6 線)
    "nara_haisen_ato", // 廃線遺跡(大仏鉄道・吉野山ロープウェイ前身等)
    // Sprint 16.2 北海道 行類專屬 sub_type:
    "hokkaido_jr_line", // JR本線・支線(函館本線/千歳線/宗谷本線/根室本線/石北本線等)
    "hokkaido_haisen_ato", // 廃線跡(夕張線/士幌線/天北線等・タウシュベツ橋梁ほか)
    // Sprint 19.6 静岡県 行類專屬 sub_type:
    "shizuoka_tokaido_shinkansen", // 東海道新幹線(静岡県内 6 駅・東京 ↔ 京阪神の大動脈)
    "shizuoka_local_railway", // 静岡県内私鉄(静鉄 1908・遠鉄 1923・大井川 1925・天浜 1935・伊豆急 1961・伊豆箱根 1898・岳南 1949)
    "shizuoka_izu_access", // 伊豆アクセス(駿河湾フェリー・東海バス・初島連絡船・伊豆観光船)
    // Sprint 17.4 大阪府 行類專屬 sub_type:
    "osaka_metro_line", // 大阪メトロ 9 路線(御堂筋/谷町/四つ橋/中央/千日前/堺筋/長堀鶴見/今里/南港)
    "osaka_private_rail", // 大阪私鉄(阪急/阪神/京阪/近鉄/南海)+ JR 大阪環状線・京都線・神戸線等
    // Sprint 18.6 兵庫県 行類專屬 sub_type:
    "hyogo_kobe_subway", // 神戸市営地下鉄(西神山手 1977 + 海岸線 2001 の 2 路線)
    "hyogo_private_rail", // 兵庫私鉄(山陽電鉄 + 神戸電鉄 + 阪急今津 + JR 但馬・播磨等の兵庫主体路線)
    // Sprint 20.6 長崎県 行類專屬 sub_type:
    // Sprint 31.6 広島県 行類專屬 sub_type:
    "hiroshima_sanyo_shinkansen", // 山陽新幹線(東京-博多・広島駅+ 福山駅+ 三原駅+ 東広島駅・1975 全通)
    "hiroshima_jr_local", // JR 在来線(山陽本線+ 芸備線+ 福塩線+ 呉線+ 可部線)
    "hiroshima_densha", // 広島電鉄(1912 開業・全国最長路面電車 112 年)
    "hiroshima_island_routes", // 広島港+ 宮島フェリー+ 江田島連絡船 等の海上交通
    "nagasaki_west_kyushu_shinkansen", // 西九州新幹線 2022/9/23 開業(武雄温泉-長崎 66 km・部分開業)+リレーかもめ
    "nagasaki_jr_line", // JR 在来線(長崎本線・佐世保線・大村線・佐世保 - 長崎大動脈)
    "nagasaki_streetcar_1915", // 長崎電気軌道(路面電車 1915)+ 松浦鉄道 1988 + 島原鉄道 1908
    "nagasaki_island_routes", // 離島航路統合(九州商船+九州郵船+JR 九州高速船+やまさ海運+離島空路)
    // Sprint 46.6 熊本県 行類專屬 sub_type:
    "kumamoto_kyushu_shinkansen", // 九州新幹線(2004 部分・2011 全通・博多-鹿児島)+ JR 熊本駅(2018 安藤忠雄設計)
    "kumamoto_jr_local", // JR 在来線(豊肥本線・三角線・肥薩線・鹿児島本線)
    "kumamoto_local_railway", // 熊本市電 1924+ 南阿蘇鉄道 1986+ くま川鉄道 1989
    "kumamoto_airport_bus_ferry", // 阿蘇くまもと空港 1971+ 熊本桜町バスターミナル 2019+ 熊本-島原フェリー
    "kumamoto_drive_route", // やまなみハイウェイ 1964+ ミルクロード+ 阿蘇パノラマライン+ 観光ドライブルート
    // Sprint 39.6 石川県 行類專屬 sub_type:
    "ishikawa_hokuriku_shinkansen", // 北陸新幹線(2015 金沢延伸 + 2024 敦賀延伸 + 金沢/小松/加賀温泉駅)
    "ishikawa_jr_local", // JR 在来線(七尾線・IR いしかわ並行 2015)
    "ishikawa_hokutetsu", // 北陸鉄道(石川線+ 浅野川線+ 周遊バス+ ふらっとバス)
    "ishikawa_noto_access", // 能登アクセス(のと鉄道+ 能登空港 2003+ 能登バス・2024 地震被災影響)
  ],
  culture: [
    "temple_shrine",
    "history_site_castle",
    "world_heritage",
    "regional_custom",
    "ancient_festival",
    "matsuri_small",
    "craft_experience",
    "museum_art",
    "industrial_heritage",
    "literature_pilgrimage",
    "anime_pilgrimage",
    // Sprint 14.5 京都府 育類專屬 sub_type:
    "kyo_iemoto", // 茶華香能楽の家元・流派(裏千家・池坊・観世 等)
    "kyo_traditional_craft", // 京焼・京漆・京蒔絵・京仏具 等(衣以外の工芸)
    "kyo_imperial_villa", // 御所・離宮(京都御所・桂離宮・修学院離宮)
    // Sprint 14.6 沖縄県 育類專屬 sub_type:
    "utaki_sacred_site", // 御嶽(琉球独自の神聖空間・斎場御嶽 + 各地 1 万以上)
    "okinawa_war_memorial", // 沖縄戦遺産(ひめゆりの塔・摩文仁・対馬丸・佐喜眞)
    "us_occupation_history", // 米軍統治期歷史(1945-72・コザ事件・普天間移設・基地周辺)
    "ryukyu_kobu", // 琉球古典芸能(組踊 2010 ユネスコ・三線・琉球舞踊)
    "eisa_dance", // エイサー(旧盆舞踊・全島エイサーまつり・各市町村青年会)
    "karate_dojo", // 空手(沖縄発祥武術・首里手/那覇手/泊手 三大流派・UNESCO 候補)
    // Sprint 15.5 奈良県 育類專屬 sub_type:
    "nanto_rokushu", // 南都六宗(古代仏教学派・三論/成実/法相/倶舎/華厳/律)
    "nara_buddhist_treasure", // 仏教美術・仏像・正倉院宝物(天平彫刻 + シルクロード文物)
    "asuka_archaeological", // 飛鳥古墳・遺跡(高松塚・キトラ・石舞台・飛鳥京)
    "shugendo_yamabushi", // 修験道・山伏(役行者・大峯山・吉野山)
    "kasuga_shika_culture", // 春日大社・神鹿・若宮おん祭一体文化(藤原氏氏神 + 1200 頭神鹿)
    "nara_historical_figure", // 古代奈良ゆかり歴史人物(聖徳太子/行基/鑑真/太安万侶/大津皇子 等)
    // Sprint 19.4 静岡県 育類專屬 sub_type:
    "shizuoka_fujisan_heritage", // 富士山世遺構成資産(富士山本宮浅間大社・三保松原・白糸の滝・五合目登山口)
    "shizuoka_tokugawa", // 徳川家康ゆかり(駿府城・久能山東照宮 1616・臨済寺・静岡浅間神社三社)
    "shizuoka_bakumatsu", // 幕末開国(1854 ペリー・了仙寺・玉泉寺・韮山反射炉・江川邸)
    // Sprint 20.4 長崎県 育類專屬 sub_type:
    // Sprint 31.4 広島県 育類專屬 sub_type:
    "hiroshima_atomic_peace", // 原爆ドーム + 広島平和記念公園 + 平和記念資料館 + 平和の灯(世遺 1996)
    "hiroshima_itsukushima_world", // 厳島神社+ 大鳥居+ 五重塔+ 多宝塔+ 弥山(世遺 1996・593 創建)
    "nagasaki_christian_history", // 潜伏キリシタン世界遺産 2018(12 構成資産・大浦天主堂国宝・26 聖人殉教地・五島教会群)
    "nagasaki_industrial_revolution", // 明治日本産業革命遺産 2015(軍艦島・旧グラバー住宅・小菅修船場・高島炭坑・三菱造船所)
    "nagasaki_dutch_china_trade", // 鎖国期異国交易(出島 1634・唐人屋敷 1689・平戸オランダ商館 1609・鳴滝塾 1824)
    "nagasaki_atomic_peace", // 被爆遺産(平和公園・平和祈念像 1955・原爆資料館・浦上天主堂)
    // Sprint 46.4 熊本県 育類專屬 sub_type:
    "kumamoto_jou_kato", // 熊本城(1607 加藤清正・国指定特別史跡 1955・2016 地震 → 2032 完全復興)+ 加藤神社+ 本妙寺
    "kumamoto_aso_shrine", // 阿蘇神社(BC282 伝承・国重文楼門・2016 倒壊 → 2023 復元・全国 500 社総本宮)+ 阿蘇五岳
    "kumamoto_hosokawa", // 細川家(1632-)関連:水前寺成趣園 1632(国指定史跡+名勝 1929)+ 泰勝寺跡(菩提寺)
    "kumamoto_amakusa_christian", // 天草キリシタン(世界遺産 2018):崎津教会 1888 + 大江教会 1933 + 天草四郎 1989 + コレジヨ館 1985
    "kumamoto_kuma_yamaga_kikuchi", // 球磨人吉相良家 700 年(青井阿蘇神社 国宝 2008 + 人吉城跡)+ 山鹿八千代座 1910(国重文 1988)+ 菊池神社 1869
    "kumamoto_yatsushiro_yamato", // 八代+山都+田原坂:八代神社妙見宮 1186 + 妙見祭 UNESCO 2016 + 通潤橋 国宝 2023(1854 アーチ水路橋)+ 田原坂西南戦争 1877
    // Sprint 39.4 石川県 育類專屬 sub_type:
    "ishikawa_kanazawa_castle_kenrokuen", // 金沢城公園 1583+ 兼六園 1822(日本三名園・国指定特別名勝)+ 五十間長屋 2001 復元
    "ishikawa_noto_kiriko", // 能登キリコ祭(国指定無形民俗 2015・200+ 祭) + 七尾青柏祭でか山(国指定 1983)
  ],
  entertainment: [
    "theme_park",
    "sakura",
    "momiji",
    "ski_season",
    "firework_festival",
    "illumination",
    "flower_field",
    "fireworks_small",
    "aquarium_zoo",
    "music_festival",
    "sports_spectate",
    // Sprint 14.6 沖縄県 樂類專屬 sub_type:
    "okinawa_marine_activity", // ダイビング・シュノーケル・ホエール・SUP・パラセール
    "okinawa_beach_hub", // 主要ビーチ(古宇利・万座・残波・宮古・八重山・離島)
    "okinawa_baseball_camp", // 2 月プロ野球キャンプ(全 12 球団中 9 球団沖縄キャンプ)
    "okinawa_nightlife", // 夜の沖縄(三線酒場・ライブハウス・サンセットバー・クラブ)
    // Sprint 15.6 奈良県 樂類專屬 sub_type:
    "nara_yoshino_onsen", // 吉野郡温泉(十津川/洞川/上湯/湯泉地・関西三大秘湯)
    "nara_park_play", // 奈良公園 + 神鹿との遊び方(picnic/せんべい/子鹿公開)
    "nara_mountain_hike", // 山岳ハイキング(大峯/大台/葛城/二上 — 楽 angle)
    "nara_rural_outdoor", // 田舎アクティビティ(吉野川ラフティング/月ヶ瀬カヌー/クライミング)
    "model_course", // 観光モデルコース(1 日/半日定番ルート)
    // Sprint 17.2 食類 reclassification:食 → 楽 移行で必要(季節食材 = 観光体験)
    "seasonal_food", // 季節食材(春アスパラ/秋松茸/冬ふぐ等・観光体験 angle)
    // Sprint 17.6 大阪府 樂類專屬 sub_type:
    "osaka_night_view", // 大阪夜景(ハルカス展望 + 通天閣 + グリコサイン + 梅田スカイ + 大阪城公園イルミ)
    "osaka_onsen_spa", // 大阪温泉・スパ(スパワールド + 箕面温泉スパガーデン)
    // Sprint 18.4 兵庫県 樂類專屬 sub_type:
    "hyogo_kobe_night_view", // 神戸夜景(六甲山 + 摩耶山掬星台 1000 万ドル夜景・日本三大夜景の一)
    "hyogo_arima_yu", // 有馬温泉公衆湯(金の湯 + 銀の湯 + 炭酸泉源公園・日本三古湯の体験 angle)
    // Sprint 19.5 静岡県 樂類專屬 sub_type:
    "shizuoka_fujisan_view", // 富士山眺望スポット(日本平・薩埵峠・大瀬崎・三島スカイウォーク 等)
    "shizuoka_kawazu_sakura", // 河津桜(2-3 月・全国級早咲き桜)
    "shizuoka_observation_train", // 観光列車(大井川 SL・伊豆急リゾート 21・天竜浜名湖鉄道)
    "shizuoka_nature_spot", // 静岡自然名所(海水浴場・滝・吊橋・離島・公園 等の単一地点)
    // Sprint 20.5 長崎県 樂類專屬 sub_type:
    // Sprint 31.5 広島県 樂類專屬 sub_type:
    "hiroshima_shimanami", // しまなみ海道(尾道-今治・全長 60km・1999 開通・サイクリスト聖地)
    "hiroshima_miyajima_play", // 宮島観光楽 angle(水中花火+ 紅葉谷+ 鹿+ 夜歩き)
    "hiroshima_setouchi_onsen", // 瀬戸内温泉(湯来 1300 年+ 宮浜+ 安芸太田)+ 海水浴
    "nagasaki_night_view", // 稲佐山世界新三大夜景(2012)・鍋冠山・グラバー園夜・港クルーズ
    "nagasaki_kujukushima_marine", // 西海国立公園 + 九十九島 208 島・伊王島・離島マリン体験
    "nagasaki_unzen_jigoku", // 雲仙地獄 + 仁田峠 + 小浜全国最長足湯(国立公園第 1 号 1934)
    "nagasaki_lantern_fest", // 中華街春節ランタン(2/1-15・1.5 万個)+ ペーロン+ 精霊流し
    // Sprint 46.5 熊本県 樂類專屬 sub_type:
    "kumamoto_aso_play", // 阿蘇火山 + 草千里 + 大観峰 + 米塚 + 白川水源 + 高森湧水隧道
    "kumamoto_kurokawa_amakusa_play", // 黒川温泉湯あかり + 天草五橋 + イルカウォッチング
    "kumamoto_kuma_yamaga_play", // 球磨川下り 1487+ 菊池渓谷+ 観光列車(A 列車・あそぼーい・かわせみ)
    "kumamoto_kumamoto_play", // 火の国まつり 1978 + 熊本城桜 + 金峰山 + zoo 1929 + 御船恐竜
    // Sprint 39.5 石川県 樂類專屬 sub_type:
    "ishikawa_kanazawa_play", // 金沢の遊び(百万石まつり 6 月・ライトアップバス・茶屋街夜・片町・夜桜・玉泉院丸夜景)
    "ishikawa_kaga_onsen_play", // 加賀温泉郷の遊び(山中鶴仙渓+ 山代古総湯 2010+ 粟津足湯+ 片山津柴山潟遊覧船)
    "ishikawa_hakusan_outdoor", // 白山+ 北陸三霊山+ 白峰村重伝建 2012+ 一里野スキー+ 白山比咩神社周辺
    "ishikawa_noto_play", // 能登半島観光(のとじま水族館 1982+ 白米千枚田+ 聖域の岬+ 能登金剛+ 千里浜+ 見附島+ 2024 被災影響)
  ],
};

export const REGIONS = [
  "hokkaido",
  "tohoku",
  "kanto",
  "chubu",
  "kansai",
  "chugoku",
  "shikoku",
  "kyushu",
  "okinawa",
] as const;
export type Region = (typeof REGIONS)[number];

export const REGION_LABEL_ZH: Record<Region, string> = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "關東",
  chubu: "中部",
  kansai: "關西",
  chugoku: "中國",
  shikoku: "四國",
  kyushu: "九州",
  okinawa: "沖繩",
};

// sub_type 繁中標籤 — 用於列表、詳情頁、麵包屑。
// 未掛入 `SUB_TYPES_BY_CATEGORY` 的 sub_type(admin 可自由填)會 fallback 顯示原字串。
export const SUB_TYPE_LABEL_ZH: Record<string, string> = {
  // food
  restaurant_recommend: "人氣餐廳",
  restaurant_reservation: "預約必備",
  ramen_shop: "拉麵專門",
  izakaya_sake: "居酒屋/酒場",
  seasonal_food: "季節限定美食",
  street_food_market: "小吃/朝市",
  cafe_wagashi: "喫茶/和菓子",
  michelin_star: "米其林",
  local_specialty: "地方名物",
  farmers_market: "農協直賣/道之驛",
  seafood_market: "海鮮市場/寿司",
  jingisukan: "ジンギスカン",
  sweets_dairy: "乳製品/甜點",
  soup_curry: "湯咖哩",
  brewery: "酒造/釀造所",
  hokkaido_local_food: "北海道郷土食(豚丼/石狩鍋/ザンギ等)",
  osaka_konamon: "大阪粉もん(章魚燒/大阪燒/燒蕎麥)",
  osaka_kushikatsu: "串炸(新世界發祥)",
  osaka_kuidaore: "大阪食い倒れ街(道頓堀/橫丁)",
  osaka_market: "大阪市場(黑門/鶴橋等)",
  kyo_kaiseki: "京懷石/料亭",
  shojin_ryori: "精進料理/湯豆腐",
  obanzai: "京おばんざい",
  kyo_zushi: "京壽司/棒壽司",
  okinawa_soba: "沖繩そば",
  champuru_ryori: "チャンプルー/家庭料理",
  american_diner_okinawa: "米軍由来洋食(A&W/牛排/塔可飯)",
  agu_pork_yagi: "阿古豬/山羊料理",
  wagyu_yakiniku_okinawa: "石垣牛/本部牛 焼肉",
  kakinoha_zushi: "柿葉壽司",
  naraduke: "奈良漬",
  miwa_somen: "三輪素麵",
  yoshino_kuzu: "吉野葛",
  yamato_cha: "大和茶",
  yamato_terroir: "大和食材(牛/肉雞/野菜)",
  cha_gayu: "茶粥(古都朝食)",
  asuka_food: "飛鳥鍋/古代食",
  nara_ryotei: "大和料亭/郷土料理",
  shizuoka_unagi: "靜岡うなぎ(浜松/三島)",
  shizuoka_oden: "靜岡おでん(黒だし/串)",
  shizuoka_yakisoba: "富士宮焼きそば",
  shizuoka_sakura_ebi: "由比桜えび",
  shizuoka_wasabi: "靜岡わさび(有東木/天城)",
  shizuoka_cha: "靜岡茶(本山/川根/牧之原)",
  shizuoka_meika: "靜岡銘菓(うなぎパイ/わさび漬)",
  hiroshima_okonomiyaki: "広島お好み焼(キャベツ+麺・全國 1 位密度)",
  hiroshima_kaki: "広島牡蠣(全國 60% シェア+ 牡蠣土手鍋)",
  hiroshima_ramen: "尾道ラーメン+ 福山ラーメン+ 三原やっさ",
  hiroshima_meika: "もみじ饅頭(高津堂 1906)+ あなごめし(うえの 1901)",
  hiroshima_setouchi_san: "瀬戸內產物(レモン/タコ/あなご/鯛)",
  hiroshima_brewery: "西條酒蔵通り 7 蔵+ 鞆保命酒 1659",
  hiroshima_hokubu: "縣北部(比婆牛+ 三次ワイナリー)",
  nagasaki_champon: "長崎ちゃんぽん/皿うどん(四海樓 1899)",
  nagasaki_castella: "長崎カステラ(福砂屋 1624 最古)",
  nagasaki_shippoku: "卓袱料理(花月 1642)",
  nagasaki_chuka: "中華街/角煮まん(新地 1689)",
  nagasaki_toruko_rice: "トルコライス(洋食ハイブリッド)",
  nagasaki_men: "島原素麵/五島うどん",
  nagasaki_shima_san: "離島産物(對馬ふぐ/壱岐燒酎/五島あご)",
  ishikawa_kaga_ryori: "加賀料理(治部煮/加賀野菜/大野醤油 1644)",
  ishikawa_kanazawa_sushi: "金沢寿司+ 近江町市場 1721+ 回転寿司",
  ishikawa_kanazawa_oden: "金沢おでん(加能ガニ/車麩/梅貝)",
  ishikawa_kanazawa_meika: "金沢銘菓(森八 1625/落雁/加賀棒茶/きんつば)",
  ishikawa_brewery: "石川酒蔵(福光屋 1625/萬歳楽 1716/農口尚彦)",
  ishikawa_noto_san: "能登産物(能登ふぐ/輪島朝市/珠洲塩 350 年)",
  kumamoto_ramen: "熊本ラーメン(豚骨+焦がしニンニク・黒亭/桂花/こむらさき)",
  kumamoto_taipien: "太平燕(熊本中華・春雨・紅蘭亭 1934)",
  kumamoto_basashi: "馬刺し(全国 1 位消費県・菅乃屋 1968)",
  kumamoto_karashi_renkon: "辛子蓮根(細川家伝来・森本舗 1864)",
  kumamoto_meika: "熊本銘菓(いきなり団子/蜂楽饅頭 1953)",
  kumamoto_kuma_shochu: "球磨焼酎(GI 1995・米焼酎・高橋/繊月/大石)",
  kumamoto_aso_amakusa: "阿蘇 + 天草(赤牛 GI 2017/天草大王/タコめし)",
  // fashion
  shopping_district_urban: "大都市商圈",
  shopping_district_local: "地方都市商圈",
  kimono_rental: "和服體驗",
  outlet_mall: "Outlet",
  vintage_used: "古著",
  craft_goods: "工藝品",
  textile_traditional: "傳統織物",
  footwear_traditional: "和式鞋履老舖",
  kyo_kimono_shop: "京呉服老舗",
  nishijin_ori: "西陣織/帯司",
  kyo_yuzen: "京友禅",
  kyo_kuro_zome: "京黒紋付染",
  kyo_komon: "京小紋",
  kyo_shibori: "京鹿の子絞",
  kyo_nui: "京繍/刺繍",
  tenugui_furoshiki: "手拭い/風呂敷",
  obi_specialty: "帯専門店",
  nenju_buddhist: "念珠/数珠",
  tabi_traditional: "足袋/京履物",
  kanzashi_hairorn: "簪/髮飾",
  tango_chirimen: "丹後縐綢",
  textile_workshop: "織物/染物工房",
  textile_museum: "織物/染色博物館",
  kimono_event: "裝束行事",
  bingata: "紅型染",
  ryukyu_textile: "琉球織物(芭蕉布/宮古上布/ミンサー)",
  ryukyu_glass: "琉球玻璃",
  ryusou_experience: "琉裝體驗",
  kariyushi_wear: "嘉利吉襯衫(沖繩版アロハ)",
  okinawa_accessory: "琉球飾品(珊瑚/月桃/勾玉)",
  hokkaido_winter_gear: "防寒裝備(雪靴/羽絨/暖暖包等)",
  hokkaido_outdoor_gear: "戶外裝備(滑雪/登山/重機)",
  ainu_traditional_dress: "愛努傳統服飾(ルウンペ/チカル/モコシ)",
  nara_uchiwa: "奈良團扇",
  nara_zarashi: "奈良晒(麻織物)",
  yamato_kasuri: "大和絣",
  yoshino_washi: "吉野和紙",
  nara_shika_souvenir: "鹿圖案/觀光衣",
  nara_shrine_amulet: "寺社授與所(御守/御朱印帳)",
  shizuoka_enshu_textile: "遠州織物(濱松綿織)",
  shizuoka_kakegawa_kuzufu: "掛川葛布(平安期~)",
  shizuoka_suruga_craft: "駿河工藝(竹千筋/漆器/和染)",
  hiroshima_kumanofude: "熊野筆(國指定 1975・全國 80% シェア)",
  nagasaki_hasami_mikawachi: "波佐見燒/三川內燒(國指定 1978)",
  nagasaki_bidoro_bekko: "長崎ビードロ/べっ甲(鎖國期獨占)",
  nagasaki_dept_arcade: "長崎佐世保百貨/商店街",
  nagasaki_christian_pilgrim: "教會群+大浦天主堂+出島土產",
  ishikawa_kanazawa_haku: "金沢箔(全國 99% / 箔座 / 安江金箔)",
  ishikawa_kaga_yuzen: "加賀友禪(京友禪と並ぶ二大・五彩)",
  ishikawa_kutaniyaki: "九谷燒(1655 大聖寺藩・5 大エリア)",
  ishikawa_wajima_nuri: "輪島塗(1975 國指定・2024 被災)",
  ishikawa_yamanaka_shikki: "山中漆器(全國木地最大産地)",
  ishikawa_kanazawa_kogei: "金沢工藝(大樋焼 1666 / 加賀繍 / 加賀毛針)",
  ishikawa_kanazawa_dept: "金沢百貨店(エムザ / 香林坊大和 / あんと)",
  kumamoto_higo_zougan: "肥後象眼(國指定 1985・鐵地金銀象嵌)",
  kumamoto_yamaga_kutami: "山鹿燈籠(國指定 1980)+ 來民團扇(1976)",
  kumamoto_shodai_amakusa: "小代燒 1632+ 天草陶磁(國指定 2003)",
  kumamoto_traditional_craft: "熊本工藝(五木和紙/木葉猿/肥後手まり)",
  kumamoto_kumamoto_dept: "熊本市內百貨(鶴屋 1952/サクラマチ 2019/上通 1573)",
  // lodging
  budget_hotel_chain: "商務連鎖",
  onsen_ryokan: "溫泉旅館",
  luxury_hotel: "高級飯店",
  rural_minshuku: "偏鄉民宿",
  capsule_hostel: "膠囊/青旅",
  love_hotel: "ラブホ",
  glamping_camp: "Glamping/營地",
  flash_sale: "限時特價",
  kyo_ryokan_classic: "京老舗旅館",
  international_luxury: "國際頂級飯店",
  kyo_machiya_stay: "京町家住宿",
  shukubo_temple: "寺宿/宿坊",
  rural_ryokan_kyoto: "京郊旅館",
  lodging_area_guide: "住宿區域推薦",
  seasonal_lodging: "季節限定住宿",
  okinawa_resort_hotel: "沖繩海洋度假村",
  island_minshuku: "離島民宿",
  american_house_stay: "米軍住宅改造宿",
  nara_hotel_classical: "奈良古典ホテル(1909 系)",
  nara_machiya: "奈良町家泊",
  yoshino_sankei_yado: "吉野山參詣宿",
  shizuoka_izu_classic: "伊豆溫泉老舖旅館(熱海/修善寺/伊東/湯ヶ島)",
  shizuoka_fuji_resort: "富士山麓度假村(御殿場/富士宮)",
  shizuoka_hamanako_lodging: "濱名湖/舘山寺溫泉",
  hiroshima_miyajima_lodging: "宮島內宿(岩惣 1854・神聖島泊)",
  hiroshima_setouchi_classical: "尾道+ 鞆の浦+ しまなみ classical 宿",
  nagasaki_unzen_classical: "雲仙溫泉老舖(1934 國立公園第 1 號)",
  nagasaki_huis_ten_bosch: "ハウステンボス內ホテル",
  nagasaki_island_lodging: "離島宿(五島/壱岐/対馬)",
  ishikawa_kanazawa_machiya: "金沢町家泊(3 茶屋街古民家)",
  ishikawa_kaga_onsen_classic: "加賀溫泉郷老舗(法師 718/あらや 1624/芭蕉)",
  ishikawa_noto_classic: "能登老舗(和倉加賀屋 1906/2024 地震影響)",
  ishikawa_kanazawa_classic: "金沢市內 高級+ビジネス(ANA/Hyatt/日航 等)",
  kumamoto_kurokawa_classic: "黒川溫泉郷(御客屋 1722/新明館/30 旅館)",
  kumamoto_kuma_aso_classic: "球磨人吉(あゆの里)+ 阿蘇內牧溫泉",
  kumamoto_other_onsen: "山鹿+ 天草+ 杖立+ 菊池+ 玉名 溫泉",
  kumamoto_kumamoto_classic: "熊本市內(ANA 1972/キャッスル 1969/日航 2003)",
  // transport
  ticket_promo: "票券優惠",
  route_map_urban: "都市交通圖",
  cable_car_lift: "纜車/索道",
  sightseeing_train: "觀光列車",
  limited_express_private: "私鐵特急",
  night_transit: "深夜交通",
  ferry_island: "離島渡輪",
  rental_car_tips: "租車",
  airport_access: "機場交通",
  kyo_railway_company: "京都鐵道公司",
  kyo_one_day_pass: "1日券/通票",
  kyo_taxi_service: "京都計程車",
  bicycle_rental: "租自行車",
  area_access_guide: "區域交通指南",
  walking_route: "散策路線",
  transit_hub: "主要轉運站",
  seasonal_transit: "季節限定運行",
  accessibility_info: "無障礙資訊",
  okinawa_yui_rail: "沖繩單軌電車",
  okinawa_island_routes: "離島空路/渡輪",
  okinawa_us_military_transit: "米軍関係交通",
  nara_kintetsu_line: "近鐵路線(奈良動脈)",
  nara_haisen_ato: "廢線遺跡",
  hokkaido_jr_line: "JR本線/支線",
  hokkaido_haisen_ato: "廢線跡(夕張/士幌等)",
  osaka_metro_line: "大阪メトロ路線",
  osaka_private_rail: "私鐵/JR路線",
  shizuoka_tokaido_shinkansen: "東海道新幹線(縣內 6 駅)",
  shizuoka_local_railway: "靜岡縣內私鐵(7 社)",
  shizuoka_izu_access: "伊豆 access(駿河灣 ferry/東海 bus)",
  hiroshima_sanyo_shinkansen: "山陽新幹線(廣島駅 hub・1975 全通)",
  hiroshima_jr_local: "JR 在來線(山陽/藝備/福鹽/吳/可部)",
  hiroshima_densha: "廣島電鐵(1912・全國最長路面電車 112 年)",
  hiroshima_island_routes: "廣島港+ 宮島フェリー+ 江田島",
  nagasaki_west_kyushu_shinkansen: "西九州新幹線(2022/9/23 武雄溫泉-長崎 66km)",
  nagasaki_jr_line: "JR 在來線(長崎本線/佐世保線/大村線)",
  nagasaki_streetcar_1915: "長崎電軌(1915 路面電車)+ 松浦鐵道 + 島原鐵道",
  nagasaki_island_routes: "離島航路(九州商船/九州郵船/JR 高速船/離島空路)",
  ishikawa_hokuriku_shinkansen: "北陸新幹線(2015 金沢/2024 敦賀延伸)",
  ishikawa_jr_local: "JR 在來線(七尾線/IR いしかわ 2015)",
  ishikawa_hokutetsu: "北鐵(石川/浅野川+周遊バス/ふらっと)",
  ishikawa_noto_access: "能登アクセス(のと鐵道/能登空港/2024 地震)",
  // culture
  temple_shrine: "寺廟神社",
  history_site_castle: "歷史古蹟/城",
  world_heritage: "世界遺產",
  regional_custom: "地方人情",
  ancient_festival: "古老慶典",
  matsuri_small: "在地小祭",
  craft_experience: "手作體驗",
  museum_art: "美術館/博物館",
  industrial_heritage: "近代產業遺產",
  literature_pilgrimage: "文學聖地",
  anime_pilgrimage: "動漫聖地",
  kyo_iemoto: "京都家元/流派",
  kyo_traditional_craft: "京都傳統工藝",
  kyo_imperial_villa: "御所/離宮",
  utaki_sacred_site: "御嶽(琉球神道聖地)",
  okinawa_war_memorial: "沖繩戰遺產",
  us_occupation_history: "米軍統治期歷史",
  ryukyu_kobu: "琉球古典藝能(組踊/三線/舞踊)",
  eisa_dance: "エイサー(沖繩盆舞)",
  karate_dojo: "空手道場/流派",
  // Sprint 15.5 奈良県 育類:
  nanto_rokushu: "南都六宗(古代佛教學派)",
  nara_buddhist_treasure: "佛教美術/正倉院寶物",
  asuka_archaeological: "飛鳥古墳/遺跡",
  shugendo_yamabushi: "修驗道/山伏",
  kasuga_shika_culture: "春日大社/神鹿文化",
  nara_historical_figure: "古代歷史人物(聖德太子/行基/鑑真等)",
  shizuoka_fujisan_heritage: "富士山世遺(淺間大社/三保松原/白糸の滝)",
  shizuoka_tokugawa: "德川家康ゆかり(駿府城/久能山/臨濟寺)",
  shizuoka_bakumatsu: "幕末開國(了仙寺/玉泉寺/韮山反射爐/江川邸)",
  hiroshima_atomic_peace: "原爆ドーム + 平和記念公園(世遺 1996)",
  hiroshima_itsukushima_world: "厳島神社 + 大鳥居 + 弥山(世遺 1996/593 創建)",
  nagasaki_christian_history: "潛伏天主教徒世遺(2018/大浦天主堂國寶/26 聖人)",
  nagasaki_industrial_revolution: "明治產業革命遺(2015/軍艦島/格洛佛住宅/小菅修船場)",
  nagasaki_dutch_china_trade: "鎖國異國交易(出島 1634/唐人屋敷 1689/平戶蘭館 1609)",
  nagasaki_atomic_peace: "被爆遺產(平和公園/原爆資料館/浦上天主堂)",
  ishikawa_kanazawa_castle_kenrokuen: "金沢城+ 兼六園(日本三名園・1822 完成)",
  ishikawa_noto_kiriko: "能登キリコ祭(国指定 2015)+ 七尾青柏祭(1983)",
  kumamoto_jou_kato: "熊本城 1607 加藤清正(2032 復興予定)+ 加藤神社 + 本妙寺",
  kumamoto_aso_shrine: "阿蘇神社(BC282/全國 500 社總本宮)+ 阿蘇五嶽",
  kumamoto_hosokawa: "細川家(水前寺成趣園 1632/泰勝寺跡)",
  kumamoto_amakusa_christian: "天草キリシタン(世遺 2018・崎津 + 大江 + 天草四郎)",
  kumamoto_kuma_yamaga_kikuchi: "球磨人吉(青井阿蘇国宝)+ 八千代座 1910 + 菊池神社",
  kumamoto_yatsushiro_yamato: "八代妙見祭(UNESCO 2016)+ 通潤橋(国宝 2023)+ 田原坂(西南戦争 1877)",
  // entertainment
  theme_park: "主題樂園",
  sakura: "賞櫻",
  momiji: "紅葉",
  ski_season: "滑雪",
  firework_festival: "煙火大會",
  illumination: "冬季點燈",
  flower_field: "花田",
  fireworks_small: "地方小煙火",
  aquarium_zoo: "水族館/動物園",
  music_festival: "音樂祭",
  sports_spectate: "運動觀賽",
  okinawa_marine_activity: "海洋活動(潛水/浮潛/賞鯨)",
  okinawa_beach_hub: "沖繩主要海灘",
  okinawa_baseball_camp: "職棒春季沖繩キャンプ",
  okinawa_nightlife: "沖繩夜生活(三線/Live/サンセット)",
  // Sprint 15.6 奈良県 樂類:
  nara_yoshino_onsen: "吉野郡溫泉(十津川/洞川等)",
  nara_park_play: "奈良公園+神鹿玩法",
  nara_mountain_hike: "奈良山岳健行",
  nara_rural_outdoor: "鄉村戶外活動(泛舟/攀岩)",
  model_course: "觀光路線推薦",
  shizuoka_fujisan_view: "富士山眺望(日本平/薩埵峠/大瀬崎)",
  shizuoka_kawazu_sakura: "河津櫻(2-3 月早開)",
  shizuoka_observation_train: "觀光列車(大井川 SL/伊豆急/天竜濱名湖)",
  shizuoka_nature_spot: "靜岡自然名所(海水浴場/瀑布/吊橋/離島)",
  hiroshima_shimanami: "しまなみ海道(60km・1999 開通)",
  hiroshima_miyajima_play: "宮島樂 angle(水中花火/紅葉谷/鹿)",
  hiroshima_setouchi_onsen: "瀨戶內溫泉(湯來 1300 年/宮浜)+ 海水浴",
  nagasaki_night_view: "稻佐山世界新三大夜景(1000 萬美元/2012)",
  nagasaki_kujukushima_marine: "九十九島/西海國立公園/離島海域",
  nagasaki_unzen_jigoku: "雲仙地獄+仁田峠+小濱足湯(1934 國立公園第 1 號)",
  nagasaki_lantern_fest: "中華街春節+ペーロン+精靈流し",
  ishikawa_kanazawa_play: "金沢の遊び(百万石/ライトアップ/茶屋街夜/片町)",
  ishikawa_kaga_onsen_play: "加賀温泉郷の遊び(鶴仙渓/古総湯/足湯/柴山潟)",
  ishikawa_hakusan_outdoor: "白山(2702m・三霊山)+ 白峰村+ 一里野スキー",
  ishikawa_noto_play: "能登半島(のとじま水族館/千枚田/聖域の岬/千里浜)",
  kumamoto_aso_play: "阿蘇火口+ 草千里+ 大観峰+ 米塚+ 白川水源",
  kumamoto_kurokawa_amakusa_play: "黒川湯あかり + 天草五橋 + イルカ",
  kumamoto_kuma_yamaga_play: "球磨川下り + 菊池渓谷 + 観光列車",
  kumamoto_kumamoto_play: "火の国まつり + 熊本城桜 + 金峰山 + zoo",
  kumamoto_kyushu_shinkansen: "九州新幹線(2011 全通)+ 熊本駅 2018 安藤忠雄",
  kumamoto_jr_local: "JR 豊肥 + 三角線 1899 + 肥薩線(2020 水害)",
  kumamoto_local_railway: "熊本市電 1924+ 南阿蘇 1986 + くま川 1989",
  kumamoto_airport_bus_ferry: "阿蘇空港 1971 + サクラマチ + 島原フェリー",
  kumamoto_drive_route: "やまなみハイウェイ + ミルクロード + 阿蘇パノラマライン",
};

export function subTypeLabel(subType: string): string {
  return SUB_TYPE_LABEL_ZH[subType] ?? subType;
}

export const AREA_TYPES = [
  "urban",
  "regional_city",
  "rural",
  "island_main",
  "island_remote",
  "mountain",
  "coastal",
  "onsen_town",
  "castle_town",
  "post_town",
  "depopulated",
] as const;
export type AreaType = (typeof AREA_TYPES)[number];

export const AREA_TYPE_LABEL_ZH: Record<AreaType, string> = {
  urban: "大都市圈",
  regional_city: "地方中核都市",
  rural: "郡部/農山村",
  island_main: "離島主島",
  island_remote: "離島遠方",
  mountain: "山岳地區",
  coastal: "特殊海岸線",
  onsen_town: "溫泉鄉",
  castle_town: "城下町",
  post_town: "宿場町",
  depopulated: "過疎地",
};

export const MUNICIPALITY_KINDS = [
  "prefecture",
  "designated_city",
  "city",
  "ward",
  "special_ward",
  "town",
  "village",
] as const;
export type MunicipalityKind = (typeof MUNICIPALITY_KINDS)[number];

export interface Municipality {
  lg_code: string;
  region: Region;
  prefecture_ja: string;
  subprefecture_ja: string | null;
  gun_ja: string | null;
  parent_city_ja: string | null;
  name_ja: string;
  name_kana: string | null;
  name_romaji: string | null;
  kind: MunicipalityKind;
  name_zh: string | null;
}

export interface JapanEntry {
  id: number;
  slug: string;
  category: Category;
  sub_type: string;

  title_zh: string;
  title_ja: string | null;
  romaji: string | null;
  summary_zh: string;
  content_md: string | null;

  region: Region;
  prefecture_ja: string;
  gun_ja: string | null;
  municipality_ja: string | null;
  lg_code: string | null;
  area_types: AreaType[];

  lat: number | null;
  lon: number | null;

  season_start: string | null; // YYYY-MM-DD(年份無意義)
  season_end: string | null;
  event_start: string | null; // ISO timestamptz
  event_end: string | null;

  price_tier: number | null;
  booking_window_days: number | null;
  closed_days: string[];

  external_urls: Record<string, string>;
  tags: string[];

  // 0=一般 / 1=縣代表 / 2=地區代表 / 3=全國級。>=2 會在全域類別頁/when/calendar 露出。
  feature_rank: number;

  // popularity_tier: 1=新手必訪 / 2=大型 famous / 3=主要 spot / 4=穴場 / 5=niche
  // 0=meta(itinerary/monthly/etc excluded from planner)
  // /japan/planner で熟練度別 spot 選別。
  popularity_tier?: number;

  // pending_rewrite: #118 stage 1 で wiki copy を stub 化した entry を mark。
  // Stage 2 L1-L5 sprint round で深度 research 重写後、解除される。
  // entry 頁で「内容整備中」banner 表示用。
  pending_rewrite?: boolean;

  // Google Places D' 系統(0021 migration)— 偵測歇業用,不做評分排序。
  google_place_id: string | null;
  business_status:
    | "OPERATIONAL"
    | "CLOSED_TEMPORARILY"
    | "CLOSED_PERMANENTLY"
    | null;
  business_status_checked_at: string | null;

  source: "manual" | "api" | "ugc" | "wikipedia";
  last_verified_at: string;
  created_at: string;
  updated_at: string;
}

export const FEATURE_RANK_LABEL_ZH: Record<0 | 1 | 2 | 3, string> = {
  0: "一般",
  1: "縣代表",
  2: "地區代表",
  3: "全國級",
};

export type JapanEntryInput = Omit<
  JapanEntry,
  | "id"
  | "created_at"
  | "updated_at"
  | "last_verified_at"
  | "feature_rank"
  | "google_place_id"
  | "business_status"
  | "business_status_checked_at"
> & {
  last_verified_at?: string;
  feature_rank?: number;
  google_place_id?: string | null;
  business_status?: JapanEntry["business_status"];
  business_status_checked_at?: string | null;
};

// JSON snapshot loader — Supabase has been sunset, data is read-only from
// public/data/japan_entries.json (committed snapshot). Cached in module scope.
// mtime-keyed cache: invalidates automatically when JSON file changes on disk
// (dev workflow: append-claude-entries.py 改 JSON 後立即反映,無需 dev restart)。
let _entriesCache: { mtimeMs: number; data: JapanEntry[] } | null = null;
let _municipalitiesCache: { mtimeMs: number; data: Municipality[] } | null = null;

async function loadAllEntries(): Promise<JapanEntry[]> {
  const file = path.join(process.cwd(), "public", "data", "japan_entries.json");
  const stat = await fs.stat(file);
  if (_entriesCache && _entriesCache.mtimeMs === stat.mtimeMs) {
    return _entriesCache.data;
  }
  const raw = await fs.readFile(file, "utf-8");
  const data = JSON.parse(raw) as JapanEntry[];
  _entriesCache = { mtimeMs: stat.mtimeMs, data };
  return data;
}

async function loadAllMunicipalities(): Promise<Municipality[]> {
  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "japan_municipalities.json",
  );
  const stat = await fs.stat(file);
  if (_municipalitiesCache && _municipalitiesCache.mtimeMs === stat.mtimeMs) {
    return _municipalitiesCache.data;
  }
  const raw = await fs.readFile(file, "utf-8");
  const data = JSON.parse(raw) as Municipality[];
  _municipalitiesCache = { mtimeMs: stat.mtimeMs, data };
  return data;
}

function sortByUpdatedAtDesc<T extends { updated_at: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) =>
    a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0,
  );
}

const DISABLED_WRITE_MSG =
  "Supabase has been sunset — write operations are disabled. Edit public/data/japan_entries.json directly.";

// メタ sub_type:全国向けで地域ページ表示すると混乱するもの。
// 個別 listing ページ(/japan/itineraries + /japan/monthly + /japan/practical)で表示。
const META_SUB_TYPES = new Set([
  "itinerary",
  "monthly_guide",
  "faq",
  "checklist",
  "travel_pass",
  "transport_guide",
  "phrase",
]);

export async function listEntries(opts?: {
  category?: Category;
  region?: Region;
  prefecture_ja?: string;
  feature_rank_min?: number;
  limit?: number;
  offset?: number;
  // wiki-bulk (Phase 2b 2026-05-10) を含めるかどうか。default false。
  // 詳細見 docs/wiki-bulk-cleanup.md。
  includeWikiBulk?: boolean;
  // メタ sub_type 除外。県別 + 主題別ページで true。default false。
  excludeMeta?: boolean;
}): Promise<JapanEntry[]> {
  const all = sortByUpdatedAtDesc(await loadAllEntries());
  let filtered = all;
  if (!(opts?.includeWikiBulk ?? false)) {
    filtered = filtered.filter((e) => e.source !== "wikipedia");
  }
  if (opts?.excludeMeta ?? false) {
    filtered = filtered.filter(
      (e) => !e.sub_type || !META_SUB_TYPES.has(e.sub_type),
    );
  }
  if (opts?.category) filtered = filtered.filter((e) => e.category === opts.category);
  if (opts?.region) filtered = filtered.filter((e) => e.region === opts.region);
  if (opts?.prefecture_ja)
    filtered = filtered.filter((e) => e.prefecture_ja === opts.prefecture_ja);
  if (opts?.feature_rank_min !== undefined)
    filtered = filtered.filter((e) => e.feature_rank >= opts.feature_rank_min!);

  const offset = opts?.offset ?? 0;
  const limit = opts?.limit;
  return limit !== undefined
    ? filtered.slice(offset, offset + limit)
    : filtered.slice(offset);
}

// Sitemap 用の超軽量取得 — slug + updated_at のみ。
export async function listEntriesForSitemap(): Promise<
  Array<{ slug: string; updated_at: string }>
> {
  const all = sortByUpdatedAtDesc(await loadAllEntries());
  return all.map((e) => ({ slug: e.slug, updated_at: e.updated_at }));
}

// Card 表示用の軽量 projection — 一覧画面で使う。content_md / last_verified_at /
// closed_days / external_urls 等の重いフィールドは除く。
// 一覧 → 詳細画面で詳細データは getEntryBySlug() で別取得。
export type JapanEntryCard = Pick<
  JapanEntry,
  | "id"
  | "slug"
  | "category"
  | "sub_type"
  | "title_zh"
  | "title_ja"
  | "romaji"
  | "summary_zh"
  | "region"
  | "prefecture_ja"
  | "municipality_ja"
  | "lg_code"
  | "lat"
  | "lon"
  | "area_types"
  | "season_start"
  | "season_end"
  | "event_start"
  | "event_end"
  | "price_tier"
  | "tags"
  | "feature_rank"
  | "google_place_id"
  | "business_status"
  | "business_status_checked_at"
>;

const CARD_COLS =
  "id, slug, category, sub_type, title_zh, title_ja, romaji, summary_zh, region, prefecture_ja, municipality_ja, lg_code, lat, lon, area_types, season_start, season_end, event_start, event_end, price_tier, tags, feature_rank, google_place_id, business_status, business_status_checked_at";

export async function listEntriesForCard(opts?: {
  category?: Category;
  region?: Region;
  prefecture_ja?: string;
  feature_rank_min?: number;
  lg_codes?: string[];
  limit?: number;
  // wiki-bulk (Phase 2b 2026-05-10) を含めるかどうか。default false。
  // 詳細見 docs/wiki-bulk-cleanup.md。
  includeWikiBulk?: boolean;
  // メタ sub_type(itinerary + monthly_guide + practical 4 種)を除外。
  // 県別 + 主題別ページで true,メタ listing ページで false。default false。
  excludeMeta?: boolean;
}): Promise<JapanEntryCard[]> {
  const all = sortByUpdatedAtDesc(await loadAllEntries());
  let filtered = all;
  if (!(opts?.includeWikiBulk ?? false)) {
    filtered = filtered.filter((e) => e.source !== "wikipedia");
  }
  if (opts?.excludeMeta ?? false) {
    filtered = filtered.filter(
      (e) => !e.sub_type || !META_SUB_TYPES.has(e.sub_type),
    );
  }
  if (opts?.category) filtered = filtered.filter((e) => e.category === opts.category);
  if (opts?.region) filtered = filtered.filter((e) => e.region === opts.region);
  if (opts?.prefecture_ja)
    filtered = filtered.filter((e) => e.prefecture_ja === opts.prefecture_ja);
  if (opts?.feature_rank_min !== undefined)
    filtered = filtered.filter((e) => e.feature_rank >= opts.feature_rank_min!);
  if (opts?.lg_codes && opts.lg_codes.length > 0) {
    const set = new Set(opts.lg_codes);
    filtered = filtered.filter((e) => e.lg_code !== null && set.has(e.lg_code));
  }
  const sliced = opts?.limit !== undefined ? filtered.slice(0, opts.limit) : filtered;
  return sliced.map(
    (e): JapanEntryCard => ({
      id: e.id,
      slug: e.slug,
      category: e.category,
      sub_type: e.sub_type,
      title_zh: e.title_zh,
      title_ja: e.title_ja,
      romaji: e.romaji,
      summary_zh: e.summary_zh,
      region: e.region,
      prefecture_ja: e.prefecture_ja,
      municipality_ja: e.municipality_ja,
      lg_code: e.lg_code,
      lat: e.lat,
      lon: e.lon,
      area_types: e.area_types,
      season_start: e.season_start,
      season_end: e.season_end,
      event_start: e.event_start,
      event_end: e.event_end,
      price_tier: e.price_tier,
      tags: e.tags,
      feature_rank: e.feature_rank,
      google_place_id: e.google_place_id,
      business_status: e.business_status,
      business_status_checked_at: e.business_status_checked_at,
    }),
  );
}

export async function listEntriesForCounting(opts: {
  prefecture_ja: string;
  // wiki-bulk (Phase 2b 2026-05-10) を Theme 数えに含めるかどうか。default false。
  // 詳細見 docs/wiki-bulk-cleanup.md。
  includeWikiBulk?: boolean;
  // メタ sub_type 除外(県別 Theme カウントで true 推奨)。default false。
  excludeMeta?: boolean;
}): Promise<Array<{ lg_code: string | null; category: Category }>> {
  const all = await loadAllEntries();
  const includeWiki = opts.includeWikiBulk ?? false;
  const excludeMeta = opts.excludeMeta ?? false;
  return all
    .filter((e) => e.prefecture_ja === opts.prefecture_ja)
    .filter((e) => includeWiki || e.source !== "wikipedia")
    .filter((e) => !excludeMeta || !e.sub_type || !META_SUB_TYPES.has(e.sub_type))
    .map((e) => ({ lg_code: e.lg_code, category: e.category }));
}

export async function getEntry(id: number): Promise<JapanEntry | null> {
  const all = await loadAllEntries();
  return all.find((e) => e.id === id) ?? null;
}

export async function getEntryBySlug(slug: string): Promise<JapanEntry | null> {
  const all = await loadAllEntries();
  return all.find((e) => e.slug === slug) ?? null;
}

export async function createEntry(
  _input: JapanEntryInput,
): Promise<JapanEntry> {
  throw new Error(`createEntry_disabled: ${DISABLED_WRITE_MSG}`);
}

export async function updateEntry(
  _id: number,
  _patch: Partial<JapanEntryInput>,
): Promise<JapanEntry> {
  throw new Error(`updateEntry_disabled: ${DISABLED_WRITE_MSG}`);
}

export async function deleteEntry(_id: number): Promise<void> {
  throw new Error(`deleteEntry_disabled: ${DISABLED_WRITE_MSG}`);
}

export async function listEntriesPendingClosure(): Promise<JapanEntry[]> {
  const all = await loadAllEntries();
  return all
    .filter((e) => e.business_status === "CLOSED_PERMANENTLY")
    .sort((a, b) => {
      const ax = a.business_status_checked_at ?? "";
      const bx = b.business_status_checked_at ?? "";
      return ax < bx ? 1 : ax > bx ? -1 : 0;
    })
    .slice(0, 100);
}

export async function listMunicipalities(opts?: {
  region?: Region;
  prefecture_ja?: string;
  subprefecture_ja?: string;
  kinds?: MunicipalityKind[];
}): Promise<Municipality[]> {
  const all = [...(await loadAllMunicipalities())].sort((a, b) =>
    a.lg_code < b.lg_code ? -1 : a.lg_code > b.lg_code ? 1 : 0,
  );
  let filtered = all;
  if (opts?.region) filtered = filtered.filter((m) => m.region === opts.region);
  if (opts?.prefecture_ja)
    filtered = filtered.filter((m) => m.prefecture_ja === opts.prefecture_ja);
  if (opts?.subprefecture_ja)
    filtered = filtered.filter((m) => m.subprefecture_ja === opts.subprefecture_ja);
  if (opts?.kinds && opts.kinds.length > 0) {
    const set = new Set(opts.kinds);
    filtered = filtered.filter((m) => set.has(m.kind));
  }
  return filtered;
}

// 取所有都道府縣(from japan_municipalities kind='prefecture') — 用於下拉選單。
// 回傳按 region 分組的 prefecture 清單,方便 UI 建 optgroup。
export async function listPrefectures(): Promise<
  Record<Region, Municipality[]>
> {
  const all = await listMunicipalities({ kinds: ["prefecture"] });
  const grouped: Record<Region, Municipality[]> = {
    hokkaido: [],
    tohoku: [],
    kanto: [],
    chubu: [],
    kansai: [],
    chugoku: [],
    shikoku: [],
    kyushu: [],
    okinawa: [],
  };
  for (const p of all) grouped[p.region].push(p);
  return grouped;
}
