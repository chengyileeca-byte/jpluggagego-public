// Full i18n for zh-TW / ja / en.
//
// Language is read from the `lang` cookie. The switcher (client) writes it
// and reloads. No query param, no middleware.
//
// Missing keys fall back to zh-TW (the source of truth). Keep keys dotted
// and flat. Use `t()` for plain strings and `tf()` for `{placeholder}`
// interpolation.

export const LANGS = ["zh-TW", "ja", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "zh-TW";

export const LANG_LABELS: Record<Lang, string> = {
  "zh-TW": "繁中",
  ja: "日本語",
  en: "English",
};

export function resolveLang(raw: string | undefined | null): Lang {
  if (!raw) return DEFAULT_LANG;
  return (LANGS as readonly string[]).includes(raw)
    ? (raw as Lang)
    : DEFAULT_LANG;
}

export function htmlLangAttr(lang: Lang): string {
  if (lang === "zh-TW") return "zh-Hant-TW";
  return lang;
}

type Dict = Record<string, string>;

const ZH_TW: Dict = {
  "site.brand": "JPLuggageGo",
  "site.tagline": "日本行李宅配便比價",
  "nav.home": "首頁",
  "nav.quote": "料金試算",
  "lang.notice": "",

  // Home — hero
  "hero.title.line1": "日本行李配送",
  "hero.title.line2": "運費比價工具",
  "hero.lead":
    "我們幫您整理 Yamato 黒猫 / 佐川 / 郵便局 / ecbo 的料金、時效、飯店代收規則,再照你的飯店動線排好每天的行李路徑。",
  "hero.free":
    "免費。我們只請你回來為寄過的營業所、飯店代收、ecbo 據點打個星等—— 讓下一個旅客不用踩雷。",
  "hero.cta.quote": "立即試算料金 →",
  "hero.cta.trip": "規劃多段行李 →",
  "hero.chip.coverage": "Yamato × ゆうパック 全都道府県",
  "hero.chip.line": "LINE 官方帳號: 建置中",

  // Home — popular routes table
  "home.popular.header": "熱門路線比價",
  "home.popular.col.route": "路線",
  "home.popular.col.diff": "差額",
  "home.popular.footer":
    "料金以都道府県為單位,不含早朝/夜間/離島加算。Yamato 有クロネコメンバーズ 割引、ゆうパック 有郵便局持寄 ¥120 割引。點擊任一列可選擇不同送達地。",
  "home.popular.diff.equal": "同",
  "home.help.guide": "新手指南 · 機場櫃台 / 營業所 / 飯店代寄 三條路一步步照著走",
  "home.help.faq": "常見問題 · 運費、交期、付款方式、加算規則",
  "home.popular.diff.yamato_save": "Yamato 省 ¥{amount}",
  "home.popular.diff.yuu_save": "ゆう 省 ¥{amount}",

  // Home — popular route sublabels
  "home.route.nrt_tokyo.sub": "成田空港到東京都飯店",
  "home.route.hnd_tokyo.sub": "羽田空港到東京都飯店",
  "home.route.kix_osaka.sub": "関空到大阪市飯店",
  "home.route.kix_kyoto.sub": "関空到京都飯店",
  "home.route.cts_hokkaido.sub": "新千歳到札幌飯店",
  "home.route.fuk_fukuoka.sub": "福岡空港到博多飯店",
  "home.route.tokyo_osaka.sub": "飯店→飯店 跨城",
  "home.route.tokyo_fukuoka.sub": "飯店→飯店 遠程",

  // Flight deadline card (home)
  "flight.title": "寄出倒數 · 離日本前幾天要寄?",
  "flight.disclaimer": "估算不含祝日・颱風延遲",
  "flight.flight_date": "回程航班起飛日",
  "flight.remote_check": "寄出地是 北海道/沖縄/離島",
  "flight.urgency.past": "已過最晚寄出日",
  "flight.urgency.red": "很急 · 今明兩天就要寄",
  "flight.urgency.amber": "還有幾天 · 建議盡快",
  "flight.urgency.green": "時間充裕",
  "flight.recommend": "建議寄出日:",
  "flight.latest": "最晚寄出日:",
  "flight.days_until": "距今 {n} 天",
  "flight.pickup_cutoff": "16:00 前集荷",
  "flight.remote_hint":
    "北海道・沖縄・離島 Yamato/ゆうパック 多為翌々日到達,建議起飛前 3 天寄,最晚前 2 天 16:00 前集荷。",
  "flight.mainland_hint":
    "本州・四国・九州 大多翌日到達,建議起飛前 2 天寄,最晚前 1 天 16:00 前集荷。",
  "flight.hotel_tail": "飯店代收 / 便利店寄送各有截止時間,越晚越緊。",
  "flight.no_date_hint":
    "輸入回程航班日,系統算出應在哪天寄出行李(Yamato / ゆうパック 翌日或翌々日到達)。避免行李在機場還沒到、或飛了你才發現沒寄。",

  // Quote — title, description, form
  "quote.title": "機場 / 飯店 行李宅配比價",
  "quote.sub_desc":
    "從機場或飯店寄行李都能比。Yamato 黒猫宅急便 vs 郵便局 ゆうパック,以都道府県為單位查定價。實際料金以現場測量為準,特大尺寸/離島/北海道或沖縄可能再加算。",
  "quote.guide_banner.tag": "新手指南",
  "quote.guide_banner.title": "第一次在日本寄行李?照流程走一遍",
  "quote.guide_banner.cta": "看完整流程 →",
  "quote.form.from": "出發地",
  "quote.form.from.airport": "機場櫃台",
  "quote.form.from.pref": "都道府県 (飯店・營業所)",
  "quote.form.from.placeholder": "選擇出發機場或都道府県",
  "quote.form.to": "送達地",
  "quote.form.to.placeholder": "選擇送達都道府県",
  "quote.form.size": "行李尺寸",
  "quote.form.size.placeholder": "選擇尺寸",
  "quote.form.ship_date": "寄出日期",
  "quote.form.pieces": "件數",
  "quote.form.pieces.hint": "(同宛先,ゆう 2件+ -¥60/件)",
  "quote.form.pieces.unit": "件",
  "quote.form.submit": "試算料金",
  "quote.form.from_mode.airport": "🛬 機場櫃台",
  "quote.form.from_mode.pref": "📍 都道府県",
  "quote.form.from_mode.address": "🏨 地址/飯店",
  "quote.form.from_address_placeholder":
    "例:ホテル日航新潟 / 35.6762, 139.6503 / Google Maps 連結",
  "quote.form.from_address_hint":
    "支援日文地址(最準到番地)/ Google Maps 連結 / 座標 / 含郵遞區號的英文地址。自動從最近 Yamato 營業所推出發都道府県。",
  "quote.form.to_address_placeholder":
    "例:ホテル日航新潟 / 35.6762, 139.6503 / Google Maps 連結",
  "quote.form.to_address_hint":
    "支援跟出發地一樣的格式,自動從最近 Yamato 營業所推送達都道府県。",
  "quote.form.to_pref_fallback_summary":
    "沒具體地址?改用都道府県看概略價 ▾",
  "quote.form.to_pref_fallback_placeholder": "— 不用、用上面的地址 —",
  "quote.result.from_address_fail":
    "出發地址解析失敗。請改用更完整的日文地址,或 Google Maps 連結/座標。",
  "quote.result.to_address_fail":
    "送達地址解析失敗。已回退到都道府県;或改用更完整的日文地址,或 Google Maps 連結/座標。",
  "quote.result.from_resolved_as": "出發地 標準化為",
  "quote.result.to_resolved_as": "送達地 標準化為",
  "quote.result.from_yamato_header": "出發地 附近の Yamato 営業所(最近 5 間)",
  "quote.result.from_yuu_header": "出發地 附近の 郵便局(最近 5 間)",
  "quote.result.to_yamato_header": "送達地 附近の Yamato 営業所(最近 5 間)",
  "quote.result.to_yuu_header": "送達地 附近の 郵便局(最近 5 間)",
  "quote.result.remote_island_title": "離島配送注意事項",
  "quote.result.remote_island_no_surcharge":
    "兩家運送業者離島皆無額外運費加算,但交期會延長,部分離島有配送限制。",
  "quote.result.remote_island_delayed": "(交期延長)",
  "quote.result.remote_island_refused": "(原則不配送)",

  // Quote — size help accordion
  "quote.size_help.summary": "行李尺寸對照圖 · 不確定幾サイズ?",
  "quote.size_help.aria_label": "行李尺寸比例圖",
  "quote.size_help.body":
    "サイズ = 行李 長+寬+高 三邊合計 cm。例:29吋硬殼 50×30×78 ≈ 160 サイズ、24吋軟箱 45×30×67 ≈ 140 サイズ。Yamato 和ゆうパック 都以 160 サイズ 為上限,超過請分多件寄送。",

  // Quote — Airporter (same-day)
  "quote.sameday.tagline": "同日送達 · Same Day",
  "quote.sameday.official": "官網試算 →",
  "quote.sameday.description":
    "Yamato/ゆう 翌日到達,Airporter 當日到達 —— 剛下飛機想在 check-in 前拿到行李,唯一選項。範圍外請用下方 Yamato/ゆう。",

  // Quote — result cards
  "quote.no_route": "查無此路線",
  "quote.no_multi_discount": "無多件折扣",
  "quote.rate_updated": "· 料金 {date} 更新",
  "quote.arrival_label": "到達予定",
  "quote.ship_plus_days": "· 寄出 +{n}日",
  "quote.pieces_of": "¥{price} × {pieces} 件",
  "quote.counters_title": "可發送櫃台 ({n})",
  "quote.counter.detail": "詳細",
  "quote.counter.reception": "受付",
  "quote.counter.navidial": "ナビダイヤル",
  "quote.pref.yamato.branches_title": "{pref} 営業所 ({n})",
  "quote.pref.yamato.weekday": "平日",
  "quote.pref.yamato.with_branches":
    "飯店櫃台多能代收 Yamato,或叫集荷電話 0120-01-9625(需會日文)、",
  "quote.pref.yamato.branch_search": "営業所檢索",
  "quote.pref.yamato.submit_tail": "投単。",
  "quote.pref.yamato.no_branches":
    "從飯店寄的話:多數飯店櫃台都能代收 Yamato,或直接叫集荷電話 0120-01-9625(需會日文)、用營業所檢索投単。",
  "quote.multi_discount_label": "複数口割引",
  "quote.yuu.counters_title": "空港ゆうパック カウンター ({n})",
  "quote.yuu.official_list": "官方清單 →",
  "quote.yuu.airport_no_counter":
    "此機場無「空港ゆうパック」取扱。可到出發地附近郵便局発送,或請飯店代叫 0800-0800-111 集荷。",
  "quote.yuu.pref_note":
    "全国約 24,000 家郵便局可受付,飯店櫃台多能代收。集荷電話 0800-0800-111 (需會日文)。郵便局持寄可折 ¥120。",

  // Quote — diff summary
  "quote.diff.tie": "兩家同價 ¥{amount}",
  "quote.diff.yamato_cheaper": "Yamato 比 ゆうパック 省 ¥{amount}",
  "quote.diff.yuu_cheaper": "ゆうパック 比 Yamato 省 ¥{amount}",
  "quote.diff.pieces_suffix": " ({pieces} 件合計)",
  "quote.diff.pieces_multi_yuu":
    " ({pieces} 件合計,含複数口割引 -¥{discount})",
  "quote.diff.surcharge_note":
    "※ 料金不含早朝/夜間/離島等加算,Yamato 有クロネコメンバーズ 割引、ゆうパック 有郵便局持寄 ¥120 割引。同一宛先 2 件以上 ゆう 再 -¥60/件 複数口割引 (已計入)。實際以收據為準。",

  // Quote — footer
  "quote.footer":
    "資料源:Yamato kuronekoyamato.co.jp 運賃一覧、郵便局 post.japanpost.jp 料金表、Yamato 空港カウンター一覧。最終更新依 scraped_at 欄位。此頁為資訊比較,非代寄服務。",

  // Hotel table
  "hotel.section.title": "💼 飯店代收一覽 (主要連鎖)",
  "hotel.section.general_note":
    "日本連鎖商務飯店多數可代收 Yamato/ゆう 宅配,住客亦可在櫃台填單寄出。入住前代收(還沒 check-in 就送達)各家政策不同,建議入住前至少 1 週 email 飯店確認。退房後暫寄(checkout 後當日寄到機場) 多數 OK。",
  "hotel.section.disclaimer":
    "此為總部一般政策,個別分店可能不同。收款不收貨到付款者居多 — 請事前付清。",
  "hotel.table.col.chain": "連鎖",
  "hotel.table.col.receive": "代收",
  "hotel.table.col.send": "代寄",
  "hotel.table.col.precheckin": "入住前",
  "hotel.table.col.note": "備註",
  "hotel.table.tooltip.receive": "寄到飯店給住客",
  "hotel.table.tooltip.send": "住客寄出",
  "hotel.table.tooltip.precheckin": "入住前寄達",
  "hotel.legend.yes": "通常可",
  "hotel.legend.case": "依店",
  "hotel.legend.check": "請先確認",
  "hotel.note.apa": "大型店多有專屬宅配櫃台;入住前代收建議先電話確認",
  "hotel.note.toyoko_inn": "Yamato 多數店家可代,退房前寄出穩",
  "hotel.note.dormy_inn": "溫泉系商務飯店,櫃台相對有彈性",
  "hotel.note.mitsui_garden": "都心部 設備完善,入住前寄達多能接受",
  "hotel.note.nishitetsu": "福岡・九州 主力連鎖",

  // Hotel UGC reports (#57)
  "hotel.report.section_title": "🗣️ 你住過嗎?分享你的實測",
  "hotel.report.section_desc":
    "官方政策只是起點,實際操作常因分店、時段、櫃台人員不同。你分享一次,下一位旅客就多一份保險。",
  "hotel.report.agg_none": "尚無旅客回報",
  "hotel.report.agg_tip": "其他旅客回報:{yes} 位可 / {case} 位依店 / {check} 位請先確認",
  "hotel.report.login_cta": "用 LINE 登入後,可針對下方 16 家連鎖留下你的實測回報。",
  "hotel.report.login_button": "用 LINE 登入",
  "hotel.report.greet": "已登入 · {name}",
  "hotel.report.logout": "登出",
  "hotel.report.form.chain": "選擇連鎖",
  "hotel.report.form.chain_placeholder": "— 選一個連鎖 —",
  "hotel.report.form.receive_q": "代收(寄到飯店給住客)",
  "hotel.report.form.send_q": "代寄(住客寄出)",
  "hotel.report.form.precheckin_q": "入住前代收(還沒 check-in 就寄到)",
  "hotel.report.form.value_yes": "可以",
  "hotel.report.form.value_case": "依店/看情況",
  "hotel.report.form.value_check": "建議先確認",
  "hotel.report.form.value_skip": "略過此項",
  "hotel.report.form.note_placeholder": "補充說明(選填,500字內,例:八重洲店前台爽快,但秋葉原店拒收)",
  "hotel.report.form.submit": "送出回報",
  "hotel.report.form.submitting": "送出中⋯",
  "hotel.report.form.success": "謝謝!你的回報已更新。",
  "hotel.report.form.error": "送出失敗,請稍後再試。",
  "hotel.report.form.no_change": "沒有勾選任何一項。",
  "hotel.report.your_current": "你之前回報過:",

  // Weather advisory (#60)
  "weather.advisory.title": "⚠️ 氣象警報中 · 宅配可能延誤",
  "weather.advisory.origin_label": "出發地 {pref}",
  "weather.advisory.destination_label": "目的地 {pref}",
  "weather.advisory.updated_at": "氣象廳 {time} 發布",
  "weather.delay.severe": "建議延後 2-3 天寄出,或考慮改日(宅配在大雪/暴風雪警報或任何特別警報期間經常中止收件)。",
  "weather.delay.high": "建議延後 1 天寄出或加上緩衝日(暴風/大雨/洪水警報會使交期 +1)。",
  "weather.advisory.source": "資料來源:気象庁公開 JSON feed",

  // Shipping operation guide (#59) — /guide/shipping
  "guide.nav.back_home": "← JPLuggageGo",
  "guide.nav.back_shipping": "← 操作指南",
  "nav.guide": "操作指南",

  "guide.shipping.meta.title": "日本行李寄送三條路徑完整指南 · 第一次去日本也會",
  "guide.shipping.meta.desc":
    "詳細解說機場櫃台、Yamato 營業所、飯店代寄三種寄行李路徑的一步步操作流程,包含準備什麼、怎麼跟櫃台溝通、費用時效、常見卡關。給完全沒去過日本的旅客。",
  "guide.shipping.breadcrumb": "操作指南 · 行李寄送",
  "guide.shipping.h1": "行李怎麼寄?三條路徑一次看懂",
  "guide.shipping.intro":
    "日本換飯店,寄行李比拖 29 吋行李箱輕鬆非常多。但現場會遇到什麼、怎麼跟櫃台溝通、填什麼單、付多少錢——第一次去日本沒人教真的會慌。這份指南把三條路徑拆成「出發前備什麼 → 到現場怎麼做 → 卡關怎麼辦」,照著做一步步就能成功。",

  "guide.shipping.pick.title": "快速判斷 · 你該走哪條?",
  "guide.shipping.pick.subtitle": "1 分鐘對照,看你現在人在哪、下一步要去哪。",
  "guide.shipping.pick.airport.label": "剛下飛機、要去飯店",
  "guide.shipping.pick.airport.value": "機場櫃台(最省力,新手強推)",
  "guide.shipping.pick.branch.label": "在市區/飯店想轉寄下一家",
  "guide.shipping.pick.branch.value": "自帶到營業所(最便宜)",
  "guide.shipping.pick.hotel.label": "今天退房換飯店,懶得搬",
  "guide.shipping.pick.hotel.value": "飯店前台代寄(最省事)",
  "guide.shipping.pick.departure.label": "回國當天想空手去機場",
  "guide.shipping.pick.departure.value": "看機場櫃台 → 離日分支",

  "guide.shipping.cards.title": "三條路徑詳細指南",
  "guide.shipping.cards.desc": "點下方卡片看完整步驟、日文情境句、常見卡關處理。",

  "guide.shipping.card.airport.title": "① 機場櫃台",
  "guide.shipping.card.airport.scenario":
    "落地當天或回國當天,在機場就把行李交出去。黒貓 Yamato 或 JAL ABC 櫃台代辦,現場有工作人員協助填單,新手最友善。",
  "guide.shipping.card.airport.meta_cost": "¥1,800 起",
  "guide.shipping.card.airport.meta_eta": "翌日下午",
  "guide.shipping.card.airport.meta_level": "新手友善",

  "guide.shipping.card.branch.title": "② 營業所自帶",
  "guide.shipping.card.branch.scenario":
    "從飯店或住處自己帶行李到 Yamato / 佐川最近營業所。最便宜,加「持込割」100 日圓折扣。送り状(運單)需自己填或用官方 App 預填,稍需日文基礎。",
  "guide.shipping.card.branch.meta_cost": "¥1,500 起",
  "guide.shipping.card.branch.meta_eta": "翌日",
  "guide.shipping.card.branch.meta_level": "稍需日文",

  "guide.shipping.card.hotel.title": "③ 飯店前台代寄",
  "guide.shipping.card.hotel.scenario":
    "退房當天把行李交給飯店前台,飯店幫你聯絡配合的宅配社。最省事,但不是每家飯店都有——平價/膠囊飯店常不代寄,訂房前請先查。",
  "guide.shipping.card.hotel.meta_cost": "¥2,000 起",
  "guide.shipping.card.hotel.meta_eta": "翌日下午",
  "guide.shipping.card.hotel.meta_level": "新手友善",

  "guide.shipping.card.cta": "看完整流程 →",

  "guide.shipping.prep.title": "三條路徑共通 · 出發前一定要備好這些",
  "guide.shipping.prep.1.title": "飯店日文地址",
  "guide.shipping.prep.1.desc":
    "打開訂房確認信找日文版地址(飯店漢字名 + 都道府縣 + 市區町村 + 番地 + 7 位郵遞番號);也可以用 Google Maps 搜飯店名,複製日文版地址。最好印出來或存手機截圖。",
  "guide.shipping.prep.2.title": "飯店電話",
  "guide.shipping.prep.2.desc":
    "預約信會有。格式 +81-3-XXXX-XXXX 或 03-XXXX-XXXX。櫃台要寫在送り状(運單)上,配送社遇到問題會打這通找飯店。",
  "guide.shipping.prep.3.title": "護照",
  "guide.shipping.prep.3.desc":
    "機場櫃台領取空港宅急便時 Yamato 官方要求出示身份證件。飯店代寄、營業所自帶不一定要出示,但建議帶著。",
  "guide.shipping.prep.4.title": "日幣現金(¥5,000-10,000)",
  "guide.shipping.prep.4.desc":
    "飯店代寄、小型營業所常只收現金。機場櫃台和大型營業所有收卡,但排隊前永遠備好現金最保險。大行李一件費率 ¥1,500-4,000 不等。",
  "guide.shipping.prep.5.title": "行李箱保護套(選配)",
  "guide.shipping.prep.5.desc":
    "Yamato 官方建議用保護套減少刮痕。機場便利店 / Don Quijote 可買(約 ¥1,000-2,000)。不用也可以但刮傷要自負。",

  "guide.shipping.aftercard.title": "看完想試算?",
  "guide.shipping.aftercard.desc": "回 /quote 輸入你的起點終點,馬上看三家運送公司的實際費率比較。",
  "guide.shipping.aftercard.cta": "回去試算 →",

  "guide.shipping.sources.title": "資料來源(2026 年 4 月查核)",
  "guide.shipping.sources.yamato_airport": "Yamato 空港宅急便",
  "guide.shipping.sources.yamato_flow_faq": "Yamato FAQ:利用的流れと料金",
  "guide.shipping.sources.jalabc": "JAL ABC 空港宅配",
  "guide.shipping.sources.yamato_send": "Yamato 宅急便の送り方",
  "guide.shipping.sources.yamato_hotel": "Yamato FAQ:ホテル/旅館への荷物発送",
  "guide.shipping.sources.verified_at": "以上連結為查核當日資料。費率、時效、櫃台位置可能變動,以現場為準。",

  // /guide/shipping/airport-counter
  "guide.shipping.airport.meta.title": "機場櫃台寄行李完整教學 · 落地當天 + 離日當天",
  "guide.shipping.airport.meta.desc":
    "第一次到日本,在機場怎麼把行李寄到飯店?回國當天怎麼空手去機場?黒貓 Yamato 和 JAL ABC 櫃台操作流程一步一步教,包含日文情境句、常見卡關、需要帶什麼。",
  "guide.shipping.airport.h1": "① 機場櫃台 · 完整操作流程",
  "guide.shipping.airport.intro":
    "日本的國際機場都有專門的宅配櫃台,最大兩家是黒貓 Yamato「空港宅急便」和 JAL ABC「空港宅配」。落地當天可以直接寄到飯店,回國當天也可以反過來用(前一天寄到機場、當日領取)。櫃台有會講英文的工作人員,對完全不會日文的新手最友善。",
  "guide.shipping.airport.summary.cost": "費用範圍 ¥1,800-3,500/件(依尺寸與距離)",
  "guide.shipping.airport.summary.eta": "時效 翌日下午送達(離島 2-3 天)",
  "guide.shipping.airport.summary.level": "難度 ★☆☆ · 新手友善",
  "guide.shipping.airport.summary.best_for":
    "適合:剛落地想空手搭電車、回國當天不想拖行李去機場、完全不會日文的旅客。",

  "guide.shipping.airport.arrival.title": "A · 落地當天 → 飯店",
  "guide.shipping.airport.arrival.intro":
    "下飛機領完行李過完海關後,直接到宅配櫃台辦理。整個流程在機場內約 15-30 分鐘完成,然後你就可以空手搭電車 / 巴士 / 計程車去飯店。行李通常翌日下午送達。",
  "guide.shipping.airport.arrival.step_1.title": "下機 → 領行李 → 過海關",
  "guide.shipping.airport.arrival.step_1.body":
    "跟著 Arrival / 到着 指標走。海關通過後你會抵達「到着ロビー」(Arrival Lobby),這裡就是宅配櫃台所在樓層。",
  "guide.shipping.airport.arrival.step_2.title": "找宅配櫃台",
  "guide.shipping.airport.arrival.step_2.body":
    "到着ロビー會有「手荷物配送」「空港宅配」「Baggage Delivery」的指標。黒貓 Yamato 和 JAL ABC 的櫃台通常在同一區(成田 T1/T2、羽田 T2/T3、關西 T1 都是)。找不到就去 Information Counter 問,工作人員會帶你過去。",
  "guide.shipping.airport.arrival.step_3.title": "排隊 → 說明來意",
  "guide.shipping.airport.arrival.step_3.body":
    "排到後把手機上的飯店資訊(日文地址、電話、預約編號)拿給櫃台看。會英文的櫃台人員會問你「Where to?」,你說「Ship to this hotel」。日文的話:「このホテルまで荷物を送りたいです」。",
  "guide.shipping.airport.arrival.step_4.title": "填送り状(運單)",
  "guide.shipping.airport.arrival.step_4.body":
    "櫃台會給你一張複寫式三聯單。關鍵欄位:寄件人(ご依頼主)填你的名字和手機、收件人(お届け先)欄位最重要——飯店名寫日文漢字、收件人寫「○○様気付 ○○」(気付 = 轉交)、加飯店電話和郵遞番號。櫃台通常會幫你代寫關鍵欄位,這步預留 5-10 分鐘。",
  "guide.shipping.airport.arrival.step_5.title": "秤重 → 報價",
  "guide.shipping.airport.arrival.step_5.body":
    "櫃台會秤你的行李、告知費用。Yamato 標準範圍:三邊合計 160cm 以下、30kg 以下。超過 30kg 官方直接拒收,要分兩件(可以當場買袋子分)。",
  "guide.shipping.airport.arrival.step_6.title": "付款",
  "guide.shipping.airport.arrival.step_6.body":
    "Yamato 櫃台收現金、信用卡(Visa/Master/JCB/Amex)、交通系 IC(Suica/Pasmo/ICOCA)、PayPay、d払い。JAL ABC 收現金、信用卡、電子貨幣,但不收 QR Code 支付。想用卡就先說「クレジットカードで」。",
  "guide.shipping.airport.arrival.step_7.title": "收好收據",
  "guide.shipping.airport.arrival.step_7.body":
    "會拿到一張「ご依頼主控」(寄件人聯)。這是追蹤憑證,上面有「問合せ番号」(追蹤編號,12 位數字)。拍照存手機,實體保留到行李確認送達。想查進度用這組號碼上 Yamato 官網查。",
  "guide.shipping.airport.arrival.step_8.title": "空手離開機場",
  "guide.shipping.airport.arrival.step_8.body":
    "完成!剩下的時間就是搭車去飯店。行李一般翌日下午(14:00-18:00)送達飯店前台,由飯店代收保管。你晚上 / 隔天 check-in 時跟前台說「私宛の荷物がありますか」(我有行李要取)即可。",

  "guide.shipping.airport.departure.title": "B · 離日當天 → 機場",
  "guide.shipping.airport.departure.warning":
    "⚠️ 關鍵:空港宅急便必須在搭機日「前一天」送達機場櫃台,當日寄來不及。所以要提前一天從飯店或營業所寄出。關東 / 關西地區前一天 OK,北海道 / 九州 / 沖縄則需要 2-3 天。",
  "guide.shipping.airport.departure.intro":
    "反過來用的版本:從飯店或營業所把行李寄到「離日機場的宅配櫃台」,搭機當日到機場領取、check-in。這樣搭機當天不用拖行李擠電車。兩種寄出方式。",
  "guide.shipping.airport.departure.hotel.title": "方式 1 · 從飯店寄出(最方便)",
  "guide.shipping.airport.departure.hotel.step_1":
    "退房前一天向前台說「明日、○○空港カウンターまで荷物を送りたいです」。前台會拿送り状過來。",
  "guide.shipping.airport.departure.hotel.step_2":
    "填送り状,收件人欄位寫「○○空港カウンター気付 ○○(你的名字)」。附上航空公司和航班號(如 JAL123)、預計搭機日期。",
  "guide.shipping.airport.departure.hotel.step_3":
    "付款(飯店多收現金,少數接受刷卡)、拿收據。這張收據是當日領取憑證,收好。",
  "guide.shipping.airport.departure.hotel.step_4":
    "搭機當日,提前 2-3 小時到機場,先到宅配櫃台領取再 check-in。Yamato 官方規範:可在搭機時間的 3 小時前到 1 小時前領取。",
  "guide.shipping.airport.departure.branch.title": "方式 2 · 從 Yamato 營業所寄出",
  "guide.shipping.airport.departure.branch.step_1":
    "前一天自己帶行李到最近的 Yamato 營業所(Google Maps 搜「ヤマト運輸 営業所」找最近點)。",
  "guide.shipping.airport.departure.branch.step_2":
    "現場填送り状(或用 App 預填),收件人寫「○○空港カウンター気付」。有「持込割」100 日圓折扣。",
  "guide.shipping.airport.departure.branch.step_3":
    "付款、拿收據。搭機當日到機場櫃台領取,同上方式 1 的 step_4。",
  "guide.shipping.airport.departure.pickup.title": "領取時怎麼找櫃台",
  "guide.shipping.airport.departure.pickup.narita":
    "成田 T1/T2:出発ロビー 4F,check-in 櫃台同樓層",
  "guide.shipping.airport.departure.pickup.haneda":
    "羽田 T2/T3:出発ロビー 3F,指標「手荷物受取」",
  "guide.shipping.airport.departure.pickup.kansai":
    "關西 T1:出発ロビー 4F",
  "guide.shipping.airport.departure.pickup.chubu":
    "中部(名古屋)T1:出発ロビー 3F",
  "guide.shipping.airport.departure.pickup.required":
    "領取需出示:送り状副本(寄件時拿到的那張)、護照。Yamato 官方文件寫還要印章,但外國人拿護照即可通融。",

  "guide.shipping.airport.counters.title": "櫃台所在機場完整清單",
  "guide.shipping.airport.counters.yamato.title": "黒貓 Yamato 空港宅急便",
  "guide.shipping.airport.counters.yamato.list":
    "成田(T1 / T2)、羽田(T1 / T2 / T3)、關西(T1)、中部(T1)、新千歳、仙台、福岡、那覇等主要國際・國內空港皆有。詳細清單見官方「空港宅急便 お受取り・ご發送のカウンター一覧」。",
  "guide.shipping.airport.counters.jalabc.title": "JAL ABC 空港宅配",
  "guide.shipping.airport.counters.jalabc.list":
    "成田(T1 / T2)、羽田(T2 / T3)、關西(T1)、中部(T1)共 4 個機場。比 Yamato 少,但主要國際線都覆蓋。",
  "guide.shipping.airport.counters.which":
    "要選哪家?服務大同小異,選當天你看到的第一個櫃台就好。真要比:Yamato 地點較多、App 追蹤方便;JAL ABC 對 JAL 會員有優惠、線上預約可刷卡先付。",

  "guide.shipping.fare.col.route": "航線",
  "guide.shipping.fare.updated": "料金 {date} 更新",
  "guide.shipping.fare.no_data": "料金資料載入中",
  "guide.shipping.fare.source": "資料來源:Yamato 官方料金表(每週三凌晨更新)",
  "guide.shipping.fare.note":
    "※ 實際以現場秤重為準。離島、北海道/沖縄部分區域可能再加算。特大尺寸(三邊合計 >160cm 或 >30kg)拒收,需分件處理。",
  "guide.shipping.fare.check_yours": "查你自己的路線",

  "guide.shipping.airport.fare.title": "費率大概多少?",
  "guide.shipping.airport.fare.intro":
    "以 Yamato 黒猫宅急便「空港宅急便」為例(JAL ABC 通常接近但可能貴 ¥100-300)。",
  "guide.shipping.airport.fare.discount":
    "可扣優惠:Web 預約送り状 -¥60、Yamato 會員(クロネコメンバー)事前 charge 付款 -¥15、來回同時寄 -¥120。機場櫃台臨時辦通常吃不到這些折扣。",

  "guide.shipping.airport.phrases.title": "現場最常用的日文 7 句",
  "guide.shipping.airport.phrases.desc": "不會日文也沒關係,把這幾句截圖、給櫃台看就好。",
  "guide.shipping.airport.phrases.1.jp": "このホテルまで荷物を送りたいです。",
  "guide.shipping.airport.phrases.1.romaji": "Kono hoteru made nimotsu wo okuritai desu.",
  "guide.shipping.airport.phrases.1.zh": "我想把行李寄到這間飯店。",
  "guide.shipping.airport.phrases.2.jp": "英語でお願いできますか?",
  "guide.shipping.airport.phrases.2.romaji": "Eigo de onegai dekimasu ka?",
  "guide.shipping.airport.phrases.2.zh": "可以講英文嗎?",
  "guide.shipping.airport.phrases.3.jp": "クレジットカードでお願いします。",
  "guide.shipping.airport.phrases.3.romaji": "Kurejitto kaado de onegaishimasu.",
  "guide.shipping.airport.phrases.3.zh": "我要用信用卡付。",
  "guide.shipping.airport.phrases.4.jp": "現金でお願いします。",
  "guide.shipping.airport.phrases.4.romaji": "Genkin de onegaishimasu.",
  "guide.shipping.airport.phrases.4.zh": "我要用現金付。",
  "guide.shipping.airport.phrases.5.jp": "明日の何時ごろ届きますか?",
  "guide.shipping.airport.phrases.5.romaji": "Ashita no nanji goro todokimasu ka?",
  "guide.shipping.airport.phrases.5.zh": "明天大概幾點會到?",
  "guide.shipping.airport.phrases.6.jp": "スーツケースにカバーは必要ですか?",
  "guide.shipping.airport.phrases.6.romaji": "Suutsukeesu ni kabaa wa hitsuyou desu ka?",
  "guide.shipping.airport.phrases.6.zh": "行李箱需要加保護套嗎?",
  "guide.shipping.airport.phrases.7.jp": "補償オプションはありますか?",
  "guide.shipping.airport.phrases.7.romaji": "Hoshou opushon wa arimasu ka?",
  "guide.shipping.airport.phrases.7.zh": "有保險方案嗎?",

  "guide.shipping.airport.receive.title": "行李送到飯店後會怎樣?",
  "guide.shipping.airport.receive.body":
    "飯店前台收到後會存到儲物室,等你 check-in 時交付。如果你 check-in 時行李還沒到,前台會告訴你預計送達時間;到了之後他們會打房間電話通知,或者晚點送到房間。記得 check-in 要主動說你有寄行李過來,避免前台忘了。",
  "guide.shipping.airport.receive.phrase_jp":
    "私宛に荷物が届いていますか?名前は ○○ です。",
  "guide.shipping.airport.receive.phrase_romaji":
    "Watashi ate ni nimotsu ga todoite imasu ka? Namae wa ○○ desu.",
  "guide.shipping.airport.receive.phrase_zh":
    "請問有沒有我的行李?我叫 ○○。",

  "guide.shipping.airport.trouble.title": "常見卡關 · 怎麼處理",
  "guide.shipping.airport.trouble.1.q": "行李超過 30 kg 怎麼辦?",
  "guide.shipping.airport.trouble.1.a":
    "Yamato 30kg 上限是硬規定。當場分裝成兩件,費用會多一件的費率。若是大型禮品 / 樂器,改找佐川急便(部分地區可到 50kg)。",
  "guide.shipping.airport.trouble.2.q": "沒日本現金,只有卡?",
  "guide.shipping.airport.trouble.2.a":
    "Yamato 機場櫃台多收 Visa/Master/JCB。保險起見,到達大廳的 Seven Bank ATM 先領 ¥10,000 日幣。機場內每層樓都有 Seven ATM 或郵便局 ATM,接受海外卡。",
  "guide.shipping.airport.trouble.3.q": "飯店名字不確定怎麼拼?",
  "guide.shipping.airport.trouble.3.a":
    "打開 Google Maps 搜你的飯店英文名,點進去詳細頁會顯示「カタカナ / 漢字」官方名稱。把整個 Maps 頁面截圖給櫃台看最快。",
  "guide.shipping.airport.trouble.4.q": "沒帶行李箱保護套會刮嗎?",
  "guide.shipping.airport.trouble.4.a":
    "Yamato 官方建議但不強制。想保險的話機場便利店(LAWSON/Family Mart)有賣約 ¥1,000,或到達大廳的「Donki」「Travel Store」有 ¥500-1,500 的。",
  "guide.shipping.airport.trouble.5.q": "離日當天忘了寄,還能去機場現場寄嗎?",
  "guide.shipping.airport.trouble.5.a":
    "可以,但就變成「當天現場 check-in 前放行李」。這已經不是空港宅急便,而是 check-in 時直接託運、到目的地國家海關領取。如果你想當天不拖行李去機場,那就失敗了——唯一解是 2-3 小時前到機場,拖行李進 check-in 區後立刻託運。",

  "guide.shipping.airport.faq.title": "常見問題",
  "guide.shipping.airport.faq.1.q": "一件大行李(29 吋)通常多少錢?",
  "guide.shipping.airport.faq.1.a":
    "29 吋行李箱通常落在 140-160 サイズ,東京都內 ¥1,800-2,200,東京↔大阪 / 京都 ¥2,300-2,500,東京↔福岡 / 札幌 ¥2,800-3,500,到沖縄最貴約 ¥3,500-4,500。JAL ABC 略貴 ¥300-500。",
  "guide.shipping.airport.faq.2.q": "最快多久到?當日可以嗎?",
  "guide.shipping.airport.faq.2.a":
    "標準翌日下午送達。同一都道府縣內上午寄、下午到的可能性有(Yamato 有「当日便」選項,但機場櫃台不一定接受),建議直接當翌日規劃。想當日寄到飯店的唯一方案是 Airporter(限特定機場、特定時間窗)。",
  "guide.shipping.airport.faq.3.q": "行李會被弄丟嗎?有保險嗎?",
  "guide.shipping.airport.faq.3.a":
    "Yamato 空港宅急便附基本運送保險(30 萬日圓上限);超過 30 萬價值可加付「荷受人補償」。行李弄丟的機率極低,Yamato 年遺失率 <0.001%,但電子產品、貴重品仍建議隨身。",
  "guide.shipping.airport.faq.4.q": "相機 / 筆電 / 鋰電池可以寄嗎?",
  "guide.shipping.airport.faq.4.a":
    "**不建議**。Yamato 禁止寄貴重品、易碎品、現金、信用卡等,電子產品雖不禁止但損壞不賠。鋰電池特別敏感——行動電源、獨立電池建議隨身,筆電、相機隨身。",
  "guide.shipping.airport.faq.5.q": "一個人可以寄幾件?",
  "guide.shipping.airport.faq.5.a":
    "沒有限制,每件各自算錢。通常建議:隨身行李(護照、筆電、1 晚換洗)+ 寄件行李(大行李箱 + 其他);大家庭出遊一次寄 3-5 件行李常見。",

  "guide.shipping.airport.cta_next.title": "看其他兩條路徑",
  "guide.shipping.airport.cta_next.branch": "自帶到營業所 · 最便宜",
  "guide.shipping.airport.cta_next.hotel": "飯店前台代寄 · 最省事",

  // /guide/shipping/branch-office
  "guide.shipping.branch.meta.title": "Yamato 營業所自帶寄行李完整教學 · 最便宜的路徑",
  "guide.shipping.branch.meta.desc":
    "從飯店或住處自己把行李帶到 Yamato / 佐川營業所寄,比機場櫃台便宜 10-20%。送り状怎麼填、怎麼找最近營業所、日文情境句、常見卡關處理。",
  "guide.shipping.branch.h1": "② 營業所自帶 · 完整操作流程",
  "guide.shipping.branch.intro":
    "這條路徑最便宜——有「持込割」100 日圓折扣,加上 Web 預填送り状的「デジタル割」60 日圓,最多可以省 ¥160。但代價是要自己把行李搬過去、自己填送り状。適合懂一點日文或不怕手機翻譯的旅客。",
  "guide.shipping.branch.summary.cost": "¥1,500 起(最便宜)",
  "guide.shipping.branch.summary.eta": "翌日 / 翌々日 依目的地",
  "guide.shipping.branch.summary.level": "難度 ★★☆ · 要填日文單",
  "guide.shipping.branch.summary.best_for":
    "適合:想省錢、行李一人能搬(不超過 2 件 / 單件 15kg)、不怕用手機翻譯的旅客。",

  "guide.shipping.branch.step_1.title": "Google Maps 搜最近營業所",
  "guide.shipping.branch.step_1.body":
    "在 Google Maps 搜「ヤマト運輸 営業所」(或「佐川急便 営業所」),看飯店附近哪家評價高、營業時間長。Yamato 主要「センター」多 24 小時、街角小型取扱店 9:00-20:00 為主。避開車站商場內的取扱店——他們多只收小包裹,大行李箱會被拒。",
  "guide.shipping.branch.step_2.title": "行李怎麼搬過去",
  "guide.shipping.branch.step_2.body":
    "500m 內步行拉過去;超過 500m 建議叫計程車(日本計程車起跳 ¥500-700,日文不通可以用 GO App 或 Uber Japan)。不要搭地鐵 / 電車——大行李箱上電梯、轉車是地獄,而且通勤時段會擋到其他乘客。",
  "guide.shipping.branch.step_3.title": "進營業所 → 拿送り状",
  "guide.shipping.branch.step_3.body":
    "現場有手寫複寫式送り状(白 / 粉紅 / 黃三聯),自取就好。若你有 Yamato 會員帳號(多半沒有——外國旅客辦不起來),可以用 App 預填;沒有就手寫,效率差異其實不大。櫃台也有「ネコピット」自助機,可以列印送り状,但要先綁 App,一樣不建議外國旅客用。",
  "guide.shipping.branch.step_4.title": "填送り状(5 個關鍵欄位)",
  "guide.shipping.branch.step_4.body":
    "看下方「送り状怎麼填」那一節,逐欄解說。單子全日文但欄位固定,照著填就對。",
  "guide.shipping.branch.step_5.title": "把單 + 行李交給櫃台",
  "guide.shipping.branch.step_5.body":
    "櫃台人員會:(1) 掃描你填的送り状、(2) 秤重秤尺寸、(3) 告知費率、(4) 問要不要買行李箱保護套(¥500-1000)、(5) 結帳。這步通常 2-5 分鐘。",
  "guide.shipping.branch.step_6.title": "付款 → 拿收據",
  "guide.shipping.branch.step_6.body":
    "營業所多收現金、Suica/PASMO/ICOCA 等交通系 IC、PayPay;部分 24h 營業所收卡但不保證。最保險是現金 + IC 雙備。拿到「ご依頼主控」(寄件人聯),上面有追蹤編號,拍照存手機。",

  "guide.shipping.branch.form.title": "送り状怎麼填 · 5 個關鍵欄位",
  "guide.shipping.branch.form.desc":
    "送り状分左右兩邊。右半是配送社用的(條碼、日期),不用動。左半是你要填的。",
  "guide.shipping.branch.form.field_sender":
    "「ご依頼主」(寄件人):你的名字(漢字或羅馬字都可)、電話(可填飯店電話或你的 local SIM)、郵遞番號 + 地址(飯店地址日文版)。",
  "guide.shipping.branch.form.field_recipient":
    "「お届け先」(收件人):最重要的一欄。姓名欄寫「○○ホテル ○○様気付 ○○(你的名字)」——「○○ホテル」是收件飯店、「○○様気付」意思是轉交給該飯店、後面是你的名字(飯店靠這個認人)。加上飯店郵遞番號 + 地址 + 電話。",
  "guide.shipping.branch.form.field_item":
    "「品名」(物品種類):寫「衣類」「旅行用品」即可。不要寫「貴重品」「現金」「電子機器」——Yamato 會拒收或要你簽免責。",
  "guide.shipping.branch.form.field_time":
    "「お届け希望日時」(希望到達時間):日期填翌日(今天 +1)、時間選「午前中」或「14-16時」這種時段。留空就是「最早送到」。",
  "guide.shipping.branch.form.field_misc":
    "「クール便」(冷藏冷凍):**不勾**。「代金引換」(到付):**不勾**,除非你真的要讓收件人付。",
  "guide.shipping.branch.form.tip":
    "不確定就把填好的單先給櫃台看,請對方檢查:「チェックしていただけますか?」— 他們通常會幫你抓錯。",

  "guide.shipping.branch.phrases.title": "營業所現場最常用的日文 5 句",
  "guide.shipping.branch.phrases.desc": "不會日文也沒關係,截圖或指給櫃台看。",
  "guide.shipping.branch.phrases.1.jp": "これを送りたいです。",
  "guide.shipping.branch.phrases.1.romaji": "Kore wo okuritai desu.",
  "guide.shipping.branch.phrases.1.zh": "我想寄這個。",
  "guide.shipping.branch.phrases.2.jp": "送り状のチェックをお願いできますか?",
  "guide.shipping.branch.phrases.2.romaji":
    "Okurijou no chekku wo onegai dekimasu ka?",
  "guide.shipping.branch.phrases.2.zh": "可以幫我檢查運單填寫嗎?",
  "guide.shipping.branch.phrases.3.jp": "明日の午前中に届きますか?",
  "guide.shipping.branch.phrases.3.romaji": "Ashita no gozenchuu ni todokimasu ka?",
  "guide.shipping.branch.phrases.3.zh": "明天上午會到嗎?",
  "guide.shipping.branch.phrases.4.jp": "持込割引はありますか?",
  "guide.shipping.branch.phrases.4.romaji": "Mochikomi waribiki wa arimasu ka?",
  "guide.shipping.branch.phrases.4.zh": "有自帶優惠嗎?",
  "guide.shipping.branch.phrases.5.jp": "Suica で支払えますか?",
  "guide.shipping.branch.phrases.5.romaji": "Suica de shiharaemasu ka?",
  "guide.shipping.branch.phrases.5.zh": "可以用 Suica 付嗎?",

  "guide.shipping.branch.fare.title": "費率大概多少?",
  "guide.shipping.branch.fare.intro":
    "以下是標準運賃(Yamato 黒猫宅急便)。自帶到營業所可再扣:持込割引 -¥100、Digital 割(デジタル割,用 Web 送り状)-¥60、合計最多 -¥160/件。",

  "guide.shipping.branch.trouble.title": "常見卡關 · 怎麼處理",
  "guide.shipping.branch.trouble.1.q": "App 要日本手機號碼註冊怎麼辦?",
  "guide.shipping.branch.trouble.1.a":
    "跳過 App 用手寫送り状就好,省下的 60 日圓デジタル割不值得為此辦日本 SIM。",
  "guide.shipping.branch.trouble.2.q": "店員完全不會英文怎麼辦?",
  "guide.shipping.branch.trouble.2.a":
    "用 Google 翻譯 App 的「相機模式」對準單據,或直接把需求用中文打字、翻成日文給對方看。Yamato 員工習慣外國客,遇到不會日文的會慢慢講 + 比手畫腳。",
  "guide.shipping.branch.trouble.3.q": "送り状寫錯了?",
  "guide.shipping.branch.trouble.3.a":
    "還沒交就重拿一張重填;已經交了但 15 分鐘內可請店員撤回修改。超過就要用追蹤編號上 Yamato 官網申請變更,很麻煩,不如當下認真填。",
  "guide.shipping.branch.trouble.4.q": "營業所離飯店很遠?",
  "guide.shipping.branch.trouble.4.a":
    "距離超過 1 公里 / 不想搬,直接改走飯店代寄(連結下方)或電話叫 Yamato 集貨(+¥30-60,不一定比自帶便宜)。",

  "guide.shipping.branch.faq.title": "常見問題",
  "guide.shipping.branch.faq.1.q": "營業所和取扱店差在哪?",
  "guide.shipping.branch.faq.1.a":
    "營業所(センター)是 Yamato 直營,可寄大行李 / 24h 居多;取扱店是簽約合作的便利店、商家,多只能寄 100 サイズ 以下小件。大行李箱(140+ サイズ)直接去營業所,不要去取扱店。",
  "guide.shipping.branch.faq.2.q": "便利店(7-11、Family Mart)可以寄大行李嗎?",
  "guide.shipping.branch.faq.2.a":
    "Yamato 和 Family Mart / Lawson 有合作(7-11 主要是佐川),但店員訓練不一,大件常被拒。行李箱建議直接去 Yamato 營業所,不要賭便利店。",
  "guide.shipping.branch.faq.3.q": "佐川急便跟 Yamato 差在哪?",
  "guide.shipping.branch.faq.3.a":
    "兩家主要營業所數量不相上下,價格相近(佐川「飛脚宅配便」略便宜 ¥50-100)。但佐川的機場櫃台少、旅客友善度低,**建議外國旅客優先 Yamato**。",
  "guide.shipping.branch.faq.4.q": "可以指定收件時間嗎?",
  "guide.shipping.branch.faq.4.a":
    "可以,送り状「お届け希望日時」欄選時段。可選:午前中 / 14:00-16:00 / 16:00-18:00 / 18:00-20:00 / 19:00-21:00。不保證但 Yamato 命中率 >95%。",
  "guide.shipping.branch.faq.5.q": "超過 30kg 或 200 サイズ 怎麼辦?",
  "guide.shipping.branch.faq.5.a":
    "Yamato 一件 30kg / 200 サイズ 是硬上限,超過就拒。大型家具 / 樂器改找 Yamato「家財便」或日通「単身パック」,需預約、價格高。",

  "guide.shipping.branch.cta_next.title": "看其他兩條路徑",
  "guide.shipping.branch.cta_next.airport": "機場櫃台 · 新手友善",
  "guide.shipping.branch.cta_next.hotel": "飯店前台代寄 · 最省事",

  // /guide/shipping/hotel-forward
  "guide.shipping.hotel.meta.title": "飯店前台代寄行李完整教學 · 退房當天最省事",
  "guide.shipping.hotel.meta.desc":
    "退房當天不想搬行李?讓飯店前台代辦宅配。需要先確認飯店是否代寄、收件飯店怎麼標「気付」、送り状怎麼填、付款方式、常見卡關處理。",
  "guide.shipping.hotel.h1": "③ 飯店前台代寄 · 完整操作流程",
  "guide.shipping.hotel.intro":
    "退房當天最輕鬆的方案。飯店前台幫你填送り状、付款,你把行李放著就走。但**不是每家飯店都代寄**——平價商務、膠囊、民宿常拒,訂房前要先查。",
  "guide.shipping.hotel.summary.cost": "¥2,000 起",
  "guide.shipping.hotel.summary.eta": "翌日下午送達",
  "guide.shipping.hotel.summary.level": "難度 ★☆☆ · 新手友善",
  "guide.shipping.hotel.summary.best_for":
    "適合:連鎖商務飯店以上、退房當天想空手移動、不在意多付 ¥100-300 服務費的旅客。",

  "guide.shipping.hotel.precheck.title": "⚠️ 訂房前一定要先確認",
  "guide.shipping.hotel.precheck.body":
    "不是每家飯店都代寄。膠囊飯店、青年旅館、Airbnb、部分廉價連鎖通常不辦。訂房前先查 JPLuggageGo 的「飯店連鎖政策表」(回 /quote 頁面下滑可見),或直接 Email / 打電話問飯店「このホテルから宅急便は発送できますか?」。",
  "guide.shipping.hotel.precheck.cta": "查飯店連鎖政策 →",

  "guide.shipping.hotel.step_1.title": "入住當天先問一句",
  "guide.shipping.hotel.step_1.body":
    "check-in 時順口問:「明日、荷物を発送したいですが、お願いできますか?」。確認:(1) 有沒有代寄、(2) 只收現金還是收卡、(3) 要提前多久(多半退房當天直接辦即可)。",
  "guide.shipping.hotel.step_2.title": "退房當天,行李帶到前台",
  "guide.shipping.hotel.step_2.body":
    "退房前把行李箱拉到前台,跟工作人員說:「チェックアウトと荷物の発送をお願いします」(退房 + 寄行李)。前台會給你送り状填寫。",
  "guide.shipping.hotel.step_3.title": "填送り状(飯店代寄特別注意)",
  "guide.shipping.hotel.step_3.body":
    "關鍵是「收件人」欄:寫「○○ホテル ○○様気付 ○○(你的名字)」。「気付」是「轉交」的意思——日本配送社看到這個會知道要交給飯店,不要直接找收件人本人。飯店名用漢字、郵遞番號 7 位、地址日文版。寄件人欄用這家(現在退房的)飯店為地址。",
  "guide.shipping.hotel.step_4.title": "秤重 → 費用 → 付款",
  "guide.shipping.hotel.step_4.body":
    "飯店多有小型磅秤現場秤,費用會告訴你(多半加 ¥100-300 服務費,所以比自帶營業所略貴)。現金為主,有的高級飯店可記房費刷卡。準備 ¥5,000 現金最保險。",
  "guide.shipping.hotel.step_5.title": "拿收據 → 走人",
  "guide.shipping.hotel.step_5.body":
    "飯店會給你「ご依頼主控」(送り状副本),上面有追蹤編號。拍照存手機,實體留到行李送達下家飯店。你可以輕鬆離開,行李交給飯店 + 配送社處理。",

  "guide.shipping.hotel.rules.title": "飯店代寄的特殊規則",
  "guide.shipping.hotel.rules.1":
    "**收件飯店要前一天送達**:寄到下一家飯店的行李,Yamato 規範必須在「宿泊日前一日」送達飯店儲存。如果你打算當日入住、當日到達,Yamato 可能拒收。",
  "guide.shipping.hotel.rules.2":
    "**氣付寫法絕對別錯**:「○○ホテル ○○様気付 ○○」。沒有「気付」兩個字,飯店看到會當成其他客人寄到、錯位難找。",
  "guide.shipping.hotel.rules.3":
    "**有些飯店只收不寄,或反過來**:連鎖政策表會標註每家情況,查了再訂房。",
  "guide.shipping.hotel.rules.4":
    "**貴重品 / 易碎品 / 現金自己拿**:飯店會在送り状上讓你簽「貴重品 / 現金 / 電子機器は入っていないこと」確認書,真有損壞不賠。",
  "guide.shipping.hotel.rules.5":
    "**紙箱、袋子飯店不一定提供**:行李箱直接寄最省事;若是散裝行李,建議退房前自己到便利店買紙箱。",

  "guide.shipping.hotel.phrases.title": "前台現場最常用的日文 5 句",
  "guide.shipping.hotel.phrases.desc": "不會日文也沒關係,截圖或指給前台看。",
  "guide.shipping.hotel.phrases.1.jp": "明日、荷物を発送したいです。",
  "guide.shipping.hotel.phrases.1.romaji": "Ashita, nimotsu wo hassou shitai desu.",
  "guide.shipping.hotel.phrases.1.zh": "我明天要寄行李。",
  "guide.shipping.hotel.phrases.2.jp": "このホテルから宅急便は発送できますか?",
  "guide.shipping.hotel.phrases.2.romaji":
    "Kono hoteru kara takkyuubin wa hassou dekimasu ka?",
  "guide.shipping.hotel.phrases.2.zh": "從這家飯店可以寄宅急便嗎?",
  "guide.shipping.hotel.phrases.3.jp": "次のホテルまで送りたいです。",
  "guide.shipping.hotel.phrases.3.romaji": "Tsugi no hoteru made okuritai desu.",
  "guide.shipping.hotel.phrases.3.zh": "我想寄到下一家飯店。",
  "guide.shipping.hotel.phrases.4.jp": "送り状の書き方を教えてください。",
  "guide.shipping.hotel.phrases.4.romaji":
    "Okurijou no kakikata wo oshiete kudasai.",
  "guide.shipping.hotel.phrases.4.zh": "可以教我送り状怎麼填嗎?",
  "guide.shipping.hotel.phrases.5.jp": "現金とカード、どちらがいいですか?",
  "guide.shipping.hotel.phrases.5.romaji":
    "Genkin to kaado, dochira ga ii desu ka?",
  "guide.shipping.hotel.phrases.5.zh": "付現金還是刷卡比較好?",

  "guide.shipping.hotel.receive.title": "行李送到下一家飯店後?",
  "guide.shipping.hotel.receive.body":
    "下一家飯店前台會收並存到儲物室。你 check-in 時主動跟前台說「荷物が届いているはずです」(我有行李應該到了)+ 出示收據追蹤編號截圖,前台就會去取給你。部分飯店會放到你房間內;部分要自己去前台領、簽收。",

  "guide.shipping.hotel.fare.title": "費率大概多少?",
  "guide.shipping.hotel.fare.intro":
    "以下是標準運賃(Yamato 黒猫宅急便)。飯店代寄通常原價收,部分高級飯店(帝國、麗嘉、半島)會再加服務費 ¥300-1,000/件。",

  "guide.shipping.hotel.trouble.title": "常見卡關 · 怎麼處理",
  "guide.shipping.hotel.trouble.1.q": "飯店說不代寄怎麼辦?",
  "guide.shipping.hotel.trouble.1.a":
    "改走營業所自帶——這篇指南下面有連結。退房前請飯店幫你叫 Yamato 集貨(+¥30-60)也可以,但要前一晚先預約。",
  "guide.shipping.hotel.trouble.2.q": "飯店只收現金,我沒那麼多現金?",
  "guide.shipping.hotel.trouble.2.a":
    "退房前一晚到樓下便利店 Seven ATM 領。¥5,000-10,000 夠應付 1-2 件行李代寄。如果飯店在偏僻區沒便利店,跟前台商量用房費刷卡(部分連鎖可)。",
  "guide.shipping.hotel.trouble.3.q": "氣付寫錯了會怎樣?",
  "guide.shipping.hotel.trouble.3.a":
    "飯店前台會幫你檢查,建議寫完給前台過目。真的寫錯被退回,你會在手機上收到追蹤通知,用追蹤編號上 Yamato 官網申請修正即可——配送社會重新送。",
  "guide.shipping.hotel.trouble.4.q": "下家飯店 check-in 時行李還沒到?",
  "guide.shipping.hotel.trouble.4.a":
    "用追蹤編號查 Yamato 官網看目前狀態。多半是「配達中」,會在傍晚前送到。飯店會簽收存著,你房間沒 key 也沒關係,晚點來取即可。",
  "guide.shipping.hotel.trouble.5.q": "寄到的行李如果飯店沒收到?",
  "guide.shipping.hotel.trouble.5.a":
    "極罕見。先用追蹤編號查 Yamato 配送紀錄,若顯示「配達完了」但飯店說沒收到,請飯店翻儲物室找(多半是 check-in 員沒登記)。真的遺失,拿收據到最近 Yamato 營業所或打 0120-01-9625 申訴。",

  "guide.shipping.hotel.faq.title": "常見問題",
  "guide.shipping.hotel.faq.1.q": "哪些飯店通常不代寄?",
  "guide.shipping.hotel.faq.1.a":
    "膠囊飯店(First Cabin、9hours)、青年旅館、Airbnb、部分廉價商務(Super Hotel 部分分店、Toyoko Inn 部分分店)。連鎖政策表(回 /quote)有 16 家主流的整理,實測不準就看使用者回報。",
  "guide.shipping.hotel.faq.2.q": "可以寄回台灣嗎?",
  "guide.shipping.hotel.faq.2.a":
    "不行。Yamato 空港宅急便只在日本國內配送。要寄回台灣請用「國際宅急便」(Yamato 國際、日本郵便 EMS),價格高(¥5,000-15,000)、時效 3-7 天,需要申報清關。行李箱直接託運或寄日本內下家飯店保管最省。",
  "guide.shipping.hotel.faq.3.q": "我還沒 check-in 下家飯店,可以先寄行李到嗎?",
  "guide.shipping.hotel.faq.3.a":
    "多數連鎖可(APA、東橫 INN、三井ガーデン 等),平價或精品可能要打電話先問。使用者回報表可查實測。寫送り状時在備註欄加一句「宿泊日:YYYY/MM/DD」讓飯店知道。",
  "guide.shipping.hotel.faq.4.q": "飯店代寄要付服務費嗎?",
  "guide.shipping.hotel.faq.4.a":
    "大部分飯店**不另收服務費**,只收 Yamato / 佐川的運費(但費率可能略高於營業所價,差額當服務費)。少數高級飯店(帝國、半島)會多收 ¥200-500 手續費。",
  "guide.shipping.hotel.faq.5.q": "退房後寄的行李可以退回飯店保管嗎?",
  "guide.shipping.hotel.faq.5.a":
    "不能,退房後飯店無義務保管你的東西。要寄回必須事前跟飯店協調「再度宿泊予定」(再次入住預約)。更簡單方案:寄到下家飯店、或去 ecbo Cloak、LuggAgent 等付費寄存點。",

  "guide.shipping.hotel.cta_next.title": "看其他兩條路徑",
  "guide.shipping.hotel.cta_next.airport": "機場櫃台 · 新手友善",
  "guide.shipping.hotel.cta_next.branch": "自帶到營業所 · 最便宜",

  // Airporter
  "airporter.price_note":
    "¥2,000 起/件 · 料金依尺寸/時段浮動 · 實際請至官網試算",
  "airporter.sameday_window":
    "09:00 前飯店投單 → 下午 16:00 後機場或新飯店取件",
  "airporter.note.nrt_t2": "NRT 僅限 Terminal 2 取件",

  // Payment tips
  "payment.yamato.airport.tip":
    "空港カウンター 多数:交通系 IC / PayPay / d払い 都收",
  "payment.yamato.branch.tip":
    "営業所 現金為主,クロネコメンバー割(事前チャージ)可 -10~15%。飯店代收通常現金或請飯店代墊",
  "payment.yuu.airport.tip":
    "空港ゆうパック カウンター 多為現金のみ,請準備零錢",
  "payment.yuu.postoffice.tip":
    "郵便局(大~中規模) 多支援 クレカ・交通系 IC・ゆうちょ Pay。持込 -¥120",

  // Share
  "share.copy": "複製連結",
  "share.copied": "已複製",
  "share.line": "分享到 LINE",

  // Route landing
  "route.title": "{from} → {to} 行李寄送料金比較 · 6 尺寸 Yamato vs ゆうパック",
  "route.desc":
    "{from} → {to} 路線 Yamato 黒猫宅急便 vs 郵便局 ゆうパック 6 尺寸即時料金、發送櫃台、時效 · JPLuggageGo",
  "route.h1": "{from} → {to} 料金比較",
  "route.breadcrumb.routes": "熱門路線",
  "route.section.prices": "6 尺寸料金比較",
  "route.section.send_methods": "如何發送",
  "route.section.transit": "寄達時效",
  "route.col.size": "尺寸",
  "route.updated": "資料更新 {date}",
  "route.prices.footer":
    "料金以都道府県為單位,不含早朝/夜間/離島加算。點下方按鈕可切換送達地、尺寸、寄出日試算到府時間。",
  "route.transit.body":
    "Yamato 宅急便 約 {yamato} 天、郵便局 ゆうパック 約 {yuu} 天。本州內多為翌日,沖縄需空運 2-4 天。",
  "route.transit.footer":
    "實際時效依出貨時間、天災、飯店櫃台接收時間而定,請以運送公司當日確認為準。",
  "route.send.yamato_airport": "{airport} · Yamato 発送カウンター",
  "route.send.yuu_airport": "{airport} · 空港ゆうパック カウンター",
  "route.send.airporter_title": "Airporter 同日配送 (唯一的當日方案)",
  "route.send.airporter_body":
    "Airporter 將 {airport} 到 {to} 的行李同日配送。適合下飛機就想 check-in 的旅客。",
  "route.send.pref_body":
    "從 {from} 可在任一 Yamato 営業所或郵便局直接寄出,多數飯店櫃台也能代寄。請用下方「自由試算」查特定送達地。",
  "route.cta.kicker": "想改到別的送達地 / 尺寸?",
  "route.cta.title": "自由試算 Yamato vs ゆうパック",
  "route.cta.button": "打開料金試算 →",
  "route.related": "其他熱門路線",

  // FAQ
  "nav.faq": "常見問題",
  "faq.meta.title": "常見問題 · Yamato vs ゆうパック 寄送 FAQ",
  "faq.meta.desc":
    "日本機場/飯店行李寄送常見問題:尺寸對照、飯店代收、時效、超大行李、支付方式。",
  "faq.title": "常見問題 FAQ",
  "faq.intro":
    "六條機場/飯店行李寄送最常被問的問題。想直接試算請到 /quote。",
  "faq.cta": "立即試算料金 →",
  "faq.q1": "29 吋行李箱該選哪個 size?",
  "faq.a1":
    "建議 160 サイズ(長+寬+高合計 ≤ 160 cm、重量 ≤ 25 kg)。26 吋通常落在 140、24 吋 120、21 吋 100。",
  "faq.q2": "寄到飯店會被拒收嗎?",
  "faq.a2":
    "APA、東横 INN、Dormy Inn、三井ガーデン、Nishitetsu 等主要連鎖都接受事先通知的代收,但冷凍品和本人限定品項為例外。詳情見 /quote 頁的「飯店代收一覽」。",
  "faq.q3": "多久會到?",
  "faq.a3":
    "本州內翌日;北海道/九州跨海 1-2 天;沖縄需空運 2-4 天。Yamato 跟 ゆうパック 時效相近,都會受颱風/大雪延誤影響。",
  "faq.q4": "超大行李箱(超過 160 サイズ)能寄嗎?",
  "faq.a4":
    "Yamato 最大 160 サイズ;超過需改用「ヤマト便」(貨運級、2-3 天)或分裝成 2 件。ゆうパック 也是 160 サイズ、重量上限 30 kg。",
  "faq.q5": "機場能直接寄嗎?",
  "faq.a5":
    "NRT / HND / KIX / CTS / FUK / NGO / KIJ / SDJ 等主要國際機場都有 Yamato 發送櫃台,多數 24 小時或早朝到深夜。ゆうパック 則是郵便局櫃台,營業時間較短。",
  "faq.q6": "找不到我想要的路線怎麼辦?",
  "faq.a6":
    "去 /quote 頁,自由挑選 47 都道府縣任兩地即可試算。Yamato 47×47、ゆうパック 47×47 都有完整矩陣。",

  // Drop-off list rendering — shared by /quote 地址 mode via YamatoList / YuuList
  "nearby.result.empty": "此半徑內沒有據點。請放寬半徑重試。",
  "nearby.result.distance": "{v} 外",
  "nearby.result.hours": "平日 {v}",
  "nearby.result.navigate": "🗺️ 在 Google Maps 查看",
  "nearby.result.fallback_note":
    "⚠️ 原地址 OSM 沒資料,自動改用「{query}」(市/区 層級中心點)查附近。可能不是精確民宿位置,但最近據點仍有參考價值。",

  // Trip planner — 多段行李配送計畫
  "nav.trip": "多段配送",
  "trip.meta.title": "多段行李配送計畫 · JPLuggageGo",
  "trip.meta.desc":
    "輸入旅程 D1 東京→D3 京都→D5 大阪,自動生每段行李寄送日、運費、Yamato vs ゆうパック 對比。",
  "trip.title": "多段行李配送計畫",
  "trip.sub":
    "輸入每段住宿(入住/退房日、都道府県、行李件數)→ 我們幫你決定每段寄出日、到達日、Yamato vs ゆうパック 哪家便宜,總費用一眼看完。",
  "trip.stay.header": "第 {n} 段住宿",
  "trip.stay.here_label": "🏠 住這裡",
  "trip.stay.label": "飯店/民宿(選填顯示用)",
  "trip.stay.checkin": "入住日",
  "trip.stay.checkout": "退房日",
  "trip.stay.prefecture": "都道府縣(選填,可由地址自動推算)",
  "trip.stay.pref_placeholder": "選擇或留空讓系統推算",
  "trip.stay.baggage": "行李(勾選有帶的尺寸 + 件數)",
  "trip.stay.baggage_count": "件",
  "trip.stay.address": "住這裡的地址(寄件起點 — 填了可省去選都道府縣)",
  "trip.stay.address_placeholder": "京都府京都市東山区祇園町南側 572…",
  "trip.stay.ship_day_before": "前日投單(退房前一晚交給飯店前台寄出)",
  "trip.stay.ship_day_before_hint": "需至少 2 晚。翌日 16:00 到下一家 — 退房當天直接拎輕裝出門。",
  "trip.stay.ship_day_before_tip_aria": "查看適用住宿類型",
  "trip.stay.ship_day_before_tip_title": "哪些住宿可以用?",
  "trip.stay.ship_day_before_tip_chain": "連鎖飯店(APA、東橫 INN、リッチモンド 等):絕大多數前台可代收代寄 ✓",
  "trip.stay.ship_day_before_tip_ryokan": "獨立旅館 / 溫泉旅館:多半可以,但建議事前電話確認",
  "trip.stay.ship_day_before_tip_airbnb": "Airbnb / 民宿:通常不行(屋主不在現場)→ 建議自己退房當天拎去便利商店",
  "trip.stay.nearby_show": "查看附近收發據點",
  "trip.stay.nearby_hide": "收起",
  "trip.stay.nearby_loading": "查詢中…",
  "trip.stay.nearby_yamato": "附近 Yamato 営業所",
  "trip.stay.nearby_yuu": "附近郵便局",
  "trip.stay.brand_ok": "已確認可代寄 ✓",
  "trip.stay.brand_check": "多半可代寄,建議電話確認",
  "trip.stay.brand_unknown": "未知品牌,請自行確認",
  "trip.stay.add": "+ 新增住宿",
  "trip.stay.remove": "刪除此段",
  "trip.arrival.label": "抵達機場(選填 — 從機場直送第 1 段住宿)",
  "trip.arrival.placeholder": "不從機場寄",
  "trip.departure.label": "離境機場(選填 — 最後一段直送機場櫃台)",
  "trip.departure.placeholder": "不飛機場",
  "trip.final.label": "最後一段去哪",
  "trip.final.none": "不需要(留在日本)",
  "trip.final.airport": "離境機場",
  "trip.final.taiwan": "寄回台灣",
  "trip.final.taiwan_hint":
    "系統會帶行李清單到「寄台灣估算器」,一鍵估運費 + 關稅 CIF",
  "trip.submit": "生成配送表",
  "trip.validation.min_stays": "至少要 2 段住宿才能排配送",
  "trip.validation.invalid_date": "入住日必須早於退房日",
  "trip.validation.stay_missing_loc": "每段住宿至少要填「都道府縣」或「地址」其中一個",
  "trip.validation.pref_unresolved": "有住宿的地址查不到都道府縣,請手動從下拉選單補選。",
  "trip.result.header": "配送表",
  "trip.result.leg": "第 {n} 段",
  "trip.result.skipped_same_city": "同日同都道府県 → 建議自行手提/公車,不需宅配",
  "trip.result.skipped_no_baggage": "此段未登記行李 → 跳過",
  "trip.result.ship_date": "寄出日",
  "trip.result.arrive_date": "到達日",
  "trip.result.day_before": "前日投單",
  "trip.result.day_before_fallback": "僅 1 泊 → 改為退房當天寄出",
  "trip.result.route": "路線",
  "trip.result.baggage": "行李",
  "trip.result.yamato": "Yamato",
  "trip.result.yuu": "ゆうパック",
  "trip.result.cheaper_yamato": "Yamato 省 ¥{v}",
  "trip.result.cheaper_yuu": "ゆう 省 ¥{v}",
  "trip.result.tie": "同價",
  "trip.result.total": "全程合計",
  "trip.result.total_note":
    "合計為每段建議較便宜者加總。假設翌日 16:00 送達(標準宅急便、非離島)。",
  "trip.result.gap":
    "⚠️ 部分段缺料金資料(可能是相同都道府県県内 TK.json 無值)— 合計先略過該段。",
  "trip.result.taiwan_header": "最後一段 · 寄回台灣",
  "trip.result.taiwan_from": "從 {label} 出發",
  "trip.result.taiwan_piece": "{size} サイズ × {n} 件(約 {kg} kg/件)",
  "trip.result.taiwan_total": "估計總重",
  "trip.result.taiwan_suggest": "建議試算尺寸",
  "trip.result.taiwan_hint_multi": "多件請分別試算 — 先以最大件預填",
  "trip.result.taiwan_cta": "估算跨境運費 + 關稅 →",
  "trip.result.taiwan_empty":
    "此段未登記行李 — 請回上方最後一段住宿補登,或直接前往估算器。",
  "trip.gantt.title": "行程時程",
  "trip.gantt.stay": "住宿",
  "trip.gantt.ship": "寄出",
  "trip.gantt.arrive": "到達",
  "trip.print.hint": "可用瀏覽器列印(Cmd/Ctrl + P)或存成 PDF,表單會自動隱藏。",
  "trip.empty": "上方輸入至少 2 段住宿後,配送表會顯示在這裡。",

  // /to-taiwan(回台灣國際寄送頁 · Phase 2)
  "toTw.meta.title": "日本寄台灣 · 運費 × 時效 × 禁寄 × 關稅",
  "toTw.meta.desc": "Yamato 國際宅急便 vs 郵便局 EMS / 航空小包 / 船便,一次看完運費、時效、禁寄品、EZ WAY 關稅 SOP。",
  "toTw.title": "日本 → 台灣 寄送",
  "toTw.subtitle": "Yamato 國際宅急便 vs 郵便局 EMS / 航空 / SAL / 船便 · 含禁寄與關稅 SOP",
  "toTw.cta.calc": "試算運費",
  "toTw.cta.prohibited": "查看禁寄品",
  "toTw.part.decide": "Part 1 · 決策",
  "toTw.part.decide.desc": "先決定走哪家、估好運費與關稅,再往下看實作。",
  "toTw.part.pack": "Part 2 · 打包",
  "toTw.part.pack.desc": "雷區自檢、包材尺寸、送單 SOP、禁寄品一次看完。",
  "toTw.part.after": "Part 3 · 寄出後",
  "toTw.part.after.desc": "知道自己走到哪、被扣關怎麼辦、常見疑問解答。",
  "toTw.section.calc": "運費試算",
  "toTw.section.tree": "三種方法怎麼選",
  "toTw.section.checklist": "打包前 30 秒 · 雷區自檢",
  "toTw.section.pack_materials": "包材尺寸估算",
  "toTw.section.timeline": "跨境流程時間軸",
  "toTw.section.post_shipment": "寄出後追蹤卡",
  "toTw.section.packing": "打包 · 寄送流程",
  "toTw.packing.intro":
    "四家服務的打包與送單流程細節都不同,點開看各自的差異(預設展開 EMS)。",
  "toTw.calc.how_to_send": "如何寄送 →",
  "toTw.section.prohibited": "禁寄品總表",
  "toTw.section.tariff": "關稅 · 被扣關怎麼辦",
  "toTw.section.faq": "常見問題",
  "toTw.section.sources": "資料來源 · 最終更新",
  "toTw.calc.weight": "包裹重量",
  "toTw.calc.weight_unit_g": "公克",
  "toTw.calc.weight_unit_kg": "公斤",
  "toTw.calc.yamato_size": "Yamato 尺寸",
  "toTw.calc.yamato_size_hint": "選 Yamato size 才會顯示 Yamato 料金(郵便局一律以重量計,無需選尺寸)",
  "toTw.calc.submit": "試算",
  "toTw.calc.loading": "計算中...",
  "toTw.calc.error_weight": "請輸入有效重量(> 0)。",
  "toTw.calc.result.ems": "EMS · 國際快捷",
  "toTw.calc.result.air": "航空小包",
  "toTw.calc.result.sal": "SAL 小包(經濟航空)",
  "toTw.calc.result.surface": "船便",
  "toTw.calc.result.yamato": "Yamato 國際宅急便",
  "toTw.calc.transit.ems": "2-4 天",
  "toTw.calc.transit.air": "6-8 天",
  "toTw.calc.transit.sal": "7-14 天",
  "toTw.calc.transit.surface": "14-21 天",
  "toTw.calc.transit.yamato": "+5~+6 天",
  "toTw.calc.overweight": "超過上限",
  "toTw.calc.max_weight": "上限",
  "toTw.calc.step_weight": "計費階",
  "toTw.calc.oversize": "超過此尺寸重量上限,建議選",
  "toTw.calc.select_yamato": "選擇尺寸",
  "toTw.calc.no_yamato_selected": "未選尺寸",
  "toTw.calc.yamato_afterpay_note":
    "⚠ Yamato 若選「後日精算」(到貨後結關稅)會額外收 ¥3,190 手續費(不論有無關稅)。建議櫃檯選「事前精算」。",
  "toTw.tree.q1": "多久要到?",
  "toTw.tree.a1a": "3 天內必到",
  "toTw.tree.a1b": "一週內 OK",
  "toTw.tree.a1c": "可以等 2-3 週",
  "toTw.tree.reco.ems": "推薦:郵便局 EMS",
  "toTw.tree.reco.air": "推薦:郵便局 航空小包(CP 高)",
  "toTw.tree.reco.surface": "推薦:郵便局 船便(最便宜)",
  "toTw.tree.reco.yamato": "若在意中文客服,可考慮 Yamato 國際宅急便",
  "toTw.disclaimer":
    "本頁資料來自郵便局、Yamato 與台灣關務署/食藥署官方公告,由作者整理。所有運費以官方當日公告為最終準則;寄送前請自行確認最新法規。",

  // §5 關稅 SOP 內的清關估算器
  "toTw.section.tariff_calc": "清關稅額估算",
  "toTw.tariff.calc.goods": "貨物申報值",
  "toTw.tariff.calc.freight": "運費",
  "toTw.tariff.calc.freight_hint": "從上方運費試算卡點「帶入清關估算 ↓」可自動換算 TWD;或手動輸入。",
  "toTw.tariff.calc.rate_badge": "匯率",
  "toTw.tariff.calc.prefilled_from": "已帶入",
  "toTw.calc.prefill_tariff": "帶入清關估算",
  "toTw.tariff.calc.category": "商品類別",
  "toTw.tariff.calc.times": "半年內第幾次寄包到同一收件人",
  "toTw.tariff.cat.general": "一般商品(10%)",
  "toTw.tariff.cat.clothing": "服飾 · 棉/化纖(12%)",
  "toTw.tariff.cat.food": "食品 · 一般零食/餅乾(10%)",
  "toTw.tariff.cat.cosmetics": "化妝品 · 保養品/彩妝(0%)",
  "toTw.tariff.cat.electronics": "3C · 手機/筆電/相機/平板(0%,ITA 免稅)",
  "toTw.tariff.cat.appliance": "小家電 · 吹風機/電鍋/按摩儀(5%)",
  "toTw.tariff.cat.watch": "手錶(4%)",
  "toTw.tariff.cat.shoes": "運動鞋 · 皮鞋(5%)",
  "toTw.tariff.cat.bag": "包包 · 背包/手提包(6.6%)",
  "toTw.tariff.cat.leather": "皮革衣物(6.7%)",
  "toTw.tariff.cat.supplement": "保健食品(30%,超量全額課)",
  "toTw.tariff.cat.tobacco": "菸酒 · 從第 1 次起課稅",
  "toTw.tariff.calc.cif_sum": "完稅價格",
  "toTw.tariff.calc.exempt_title": "免稅",
  "toTw.tariff.calc.exempt_body":
    "此筆郵包原則免徵進口稅與營業稅。但菸酒、農產、部分管制品不適用免稅,仍會被課稅。",
  "toTw.tariff.calc.tobacco_title": "菸酒建議改旅行手提,勿郵寄",
  "toTw.tariff.calc.import_duty": "進口稅",
  "toTw.tariff.calc.vat": "營業稅 5%",
  "toTw.tariff.calc.total": "合計應繳",

  "home.help.toTaiwan": "日本寄台灣指南",

  // 反向連結 CTA(在 /quote /guide/shipping /faq 引導使用者到 /to-taiwan)
  "toTw.reverse.title": "要寄回台灣?",
  "toTw.reverse.desc":
    "Yamato 國際宅急便 vs 郵便局 EMS / 航空 / SAL / 船便,即時試算 + 禁寄品 + EZ WAY 關稅 SOP。",
  "toTw.reverse.cta": "查看日本寄台灣指南 →",
};

const JA: Dict = {
  "site.brand": "JPLuggageGo",
  "site.tagline": "日本の手荷物配送 料金比較",
  "nav.home": "ホーム",
  "nav.quote": "料金シミュレーション",
  "lang.notice": "",

  "hero.title.line1": "日本の手荷物配送",
  "hero.title.line2": "料金比較ツール",
  "hero.lead":
    "ヤマト運輸・佐川急便・日本郵便・ecbo cloak の料金、配送日数、ホテル受取ルールをまとめ、滞在動線に合わせて毎日の手荷物ルートを設計します。",
  "hero.free":
    "完全無料。利用した営業所・ホテル受取・ecbo 拠点の評価を残してくださるだけ —— 次の旅行者が失敗しないために。",
  "hero.cta.quote": "料金を試算 →",
  "hero.cta.trip": "複数拠点プランを作成 →",
  "hero.chip.coverage": "ヤマト × ゆうパック 全47都道府県",
  "hero.chip.line": "LINE 公式アカウント: 準備中",

  "home.popular.header": "人気ルート比較",
  "home.popular.col.route": "ルート",
  "home.popular.col.diff": "差額",
  "home.popular.footer":
    "料金は都道府県単位で表示、早朝・夜間・離島の追加料金は含みません。ヤマトはクロネコメンバーズ割、ゆうパックは郵便局持込 ¥120 割引あり。各行をクリックすると送り先を変更できます。",
  "home.popular.diff.equal": "同",
  "home.popular.diff.yamato_save": "ヤマト ¥{amount} お得",
  "home.popular.diff.yuu_save": "ゆう ¥{amount} お得",

  "home.route.nrt_tokyo.sub": "成田空港→東京都のホテル",
  "home.route.hnd_tokyo.sub": "羽田空港→東京都のホテル",
  "home.route.kix_osaka.sub": "関空→大阪市内のホテル",
  "home.route.kix_kyoto.sub": "関空→京都市内のホテル",
  "home.route.cts_hokkaido.sub": "新千歳→札幌市内のホテル",
  "home.route.fuk_fukuoka.sub": "福岡空港→博多のホテル",
  "home.route.tokyo_osaka.sub": "ホテル→ホテル 都市間",
  "home.route.tokyo_fukuoka.sub": "ホテル→ホテル 長距離",

  "flight.title": "発送カウントダウン · 帰国まで残り何日?",
  "flight.disclaimer": "祝日・台風遅延は含まず",
  "flight.flight_date": "帰りのフライト日",
  "flight.remote_check": "発送元は 北海道・沖縄・離島",
  "flight.urgency.past": "最遅発送日を過ぎています",
  "flight.urgency.red": "急いで · 今日明日中に発送",
  "flight.urgency.amber": "残り数日 · 早めの発送を",
  "flight.urgency.green": "時間に余裕あり",
  "flight.recommend": "推奨発送日:",
  "flight.latest": "最遅発送日:",
  "flight.days_until": "あと {n} 日",
  "flight.pickup_cutoff": "16:00 までに集荷",
  "flight.remote_hint":
    "北海道・沖縄・離島 はヤマト/ゆうパック 翌々日到着が多く、出発の3日前に発送、遅くとも2日前の16:00までに集荷を。",
  "flight.mainland_hint":
    "本州・四国・九州 は翌日到着が多く、出発の2日前に発送、遅くとも1日前の16:00までに集荷を。",
  "flight.hotel_tail":
    "ホテル受付・コンビニ持込にもそれぞれ締切時刻があり、遅いほど余裕がなくなります。",
  "flight.no_date_hint":
    "帰りのフライト日を入れると、いつ荷物を発送すべきか計算します(ヤマト/ゆうパック 翌日または翌々日着)。空港で荷物がまだ届いていない、出国後に送り忘れに気づくのを防ぎます。",

  "quote.title": "空港 / ホテル 手荷物配送 料金比較",
  "quote.sub_desc":
    "空港からもホテルからも発送可能。ヤマト運輸 vs 郵便局ゆうパック、都道府県単位で料金を表示。特大サイズ・離島・北海道・沖縄は追加料金の場合あり。",
  "quote.form.from": "発送元",
  "quote.form.from.airport": "空港カウンター",
  "quote.form.from.pref": "都道府県 (ホテル・営業所)",
  "quote.form.from.placeholder": "発送元を選択",
  "quote.form.to": "届け先",
  "quote.form.to.placeholder": "届け先 都道府県を選択",
  "quote.form.size": "サイズ",
  "quote.form.size.placeholder": "サイズを選択",
  "quote.form.ship_date": "発送予定日",
  "quote.form.pieces": "個数",
  "quote.form.pieces.hint": "(同宛先、ゆう 2個以上 -¥60/個)",
  "quote.form.pieces.unit": "個",
  "quote.form.submit": "料金を試算",
  "quote.form.from_mode.airport": "🛬 空港カウンター",
  "quote.form.from_mode.pref": "📍 都道府県",
  "quote.form.from_mode.address": "🏨 住所・ホテル",
  "quote.form.from_address_placeholder":
    "例:ホテル日航新潟 / 35.6762, 139.6503 / Google Maps リンク",
  "quote.form.from_address_hint":
    "日本語住所・Google Maps リンク・座標・郵便番号付き英語住所 に対応。最寄りヤマト営業所から発地都道府県を自動推定。",
  "quote.form.to_address_placeholder":
    "例:ホテル日航新潟 / 35.6762, 139.6503 / Google Maps リンク",
  "quote.form.to_address_hint":
    "発送元と同じ形式に対応。最寄りヤマト営業所から届け先都道府県を自動推定。",
  "quote.form.to_pref_fallback_summary":
    "住所が未定?都道府県でざっくり試算 ▾",
  "quote.form.to_pref_fallback_placeholder": "— 不要、上の住所を使う —",
  "quote.result.from_address_fail":
    "発送元住所を解析できません。より詳しい日本語住所、Google Maps リンク、または座標をお試しください。",
  "quote.result.to_address_fail":
    "届け先住所を解析できません。都道府県で試算にフォールバック中。より詳しい住所・Google Maps リンク・座標もお試しください。",
  "quote.result.from_resolved_as": "発送元を次として解析",
  "quote.result.to_resolved_as": "届け先を次として解析",
  "quote.result.from_yamato_header": "発送元 周辺のヤマト運輸 営業所(最寄り 5 か所)",
  "quote.result.from_yuu_header": "発送元 周辺の郵便局(最寄り 5 か所)",
  "quote.result.to_yamato_header": "届け先 周辺のヤマト運輸 営業所(最寄り 5 か所)",
  "quote.result.to_yuu_header": "届け先 周辺の郵便局(最寄り 5 か所)",

  "quote.size_help.summary": "サイズ比較図 · どのサイズか分からない?",
  "quote.size_help.aria_label": "サイズ比較図",
  "quote.size_help.body":
    "サイズ = 荷物の 縦+横+高さ 三辺合計 cm。例:29インチハード 50×30×78 ≈ 160サイズ、24インチソフト 45×30×67 ≈ 140サイズ。ヤマト・ゆうパックともに 160サイズが上限、超える場合は分けて発送してください。",

  "quote.sameday.tagline": "当日配達 · Same Day",
  "quote.sameday.official": "公式サイトで試算 →",
  "quote.sameday.description":
    "ヤマト/ゆうは翌日着、Airporter は当日着 —— 到着後すぐ、チェックイン前に荷物を受け取りたいなら唯一の選択肢。対応エリア外は下のヤマト/ゆうをご利用ください。",

  "quote.no_route": "該当ルートなし",
  "quote.no_multi_discount": "複数口割引なし",
  "quote.rate_updated": "· 料金 {date} 更新",
  "quote.arrival_label": "到着予定",
  "quote.ship_plus_days": "· 発送 +{n}日",
  "quote.pieces_of": "¥{price} × {pieces} 個",
  "quote.counters_title": "発送カウンター ({n})",
  "quote.counter.detail": "詳細",
  "quote.counter.reception": "受付",
  "quote.counter.navidial": "ナビダイヤル",
  "quote.pref.yamato.branches_title": "{pref} 営業所 ({n})",
  "quote.pref.yamato.weekday": "平日",
  "quote.pref.yamato.with_branches":
    "ホテルのフロントで多くは代理発送可。集荷電話 0120-01-9625 (日本語)、",
  "quote.pref.yamato.branch_search": "営業所検索",
  "quote.pref.yamato.submit_tail": "で投函。",
  "quote.pref.yamato.no_branches":
    "ホテルから発送する場合:多くのフロントでヤマト代理発送可。集荷電話 0120-01-9625 (日本語)、または営業所検索で投函。",
  "quote.multi_discount_label": "複数口割引",
  "quote.yuu.counters_title": "空港ゆうパック カウンター ({n})",
  "quote.yuu.official_list": "公式リスト →",
  "quote.yuu.airport_no_counter":
    "この空港に「空港ゆうパック」取扱はありません。最寄りの郵便局から発送、またはホテル経由で 0800-0800-111 に集荷依頼を。",
  "quote.yuu.pref_note":
    "全国約24,000局の郵便局で受付可、ホテルのフロントでも多くは代理発送可。集荷電話 0800-0800-111 (日本語)。郵便局持込で ¥120 割引。",

  "quote.diff.tie": "同料金 ¥{amount}",
  "quote.diff.yamato_cheaper": "ヤマトの方が ¥{amount} 安い",
  "quote.diff.yuu_cheaper": "ゆうパックの方が ¥{amount} 安い",
  "quote.diff.pieces_suffix": " ({pieces} 個合計)",
  "quote.diff.pieces_multi_yuu":
    " ({pieces} 個合計、複数口割引 -¥{discount} 込み)",
  "quote.diff.surcharge_note":
    "※ 早朝・夜間・離島などの追加料金は含まず。ヤマトはクロネコメンバーズ割引、ゆうパックは郵便局持込 ¥120 割引あり。同一宛先 2個以上は ゆう 複数口割引 -¥60/個 (反映済み)。実際は領収書をご確認ください。",

  "quote.footer":
    "出典:ヤマト kuronekoyamato.co.jp 運賃一覧、日本郵便 post.japanpost.jp 料金表、ヤマト空港カウンター一覧。更新日は scraped_at 欄参照。本ページは料金比較情報で、配送代行サービスではありません。",

  "hotel.section.title": "💼 ホテル代理受付一覧 (主要チェーン)",
  "hotel.section.general_note":
    "日本のチェーン系ビジネスホテルの多くはヤマト・ゆうパックの代理受付が可能で、宿泊客は窓口で発送伝票も書けます。チェックイン前の荷物お預かり(到着前に先に届く)は各社ポリシー差あり、最低1週間前にメールで確認推奨。チェックアウト後の当日発送(空港へ) は多くの場合 OK。",
  "hotel.section.disclaimer":
    "本部レベルの一般ポリシーで、個別店舗で異なる場合があります。代引き不可の店舗が多いため、事前に支払いを。",
  "hotel.table.col.chain": "チェーン",
  "hotel.table.col.receive": "代理受取",
  "hotel.table.col.send": "代理発送",
  "hotel.table.col.precheckin": "事前預り",
  "hotel.table.col.note": "備考",
  "hotel.table.tooltip.receive": "宿泊客宛てにホテルで受取",
  "hotel.table.tooltip.send": "宿泊客が発送",
  "hotel.table.tooltip.precheckin": "チェックイン前に到着",
  "hotel.legend.yes": "通常可",
  "hotel.legend.case": "店舗次第",
  "hotel.legend.check": "要確認",
  "hotel.note.apa":
    "大型店は宅配専用窓口あり;事前受取は電話確認推奨",
  "hotel.note.toyoko_inn":
    "ヤマト対応店舗多数、チェックアウト前発送が無難",
  "hotel.note.dormy_inn":
    "温泉系ビジネスホテル、フロント対応は比較的柔軟",
  "hotel.note.mitsui_garden":
    "都心部で設備充実、事前到着も受入可が多い",
  "hotel.note.nishitetsu": "福岡・九州のメインチェーン",

  "airporter.price_note":
    "¥2,000〜/個 · サイズ・時間帯で変動 · 実際は公式サイトで試算を",
  "airporter.sameday_window":
    "09:00 までにホテル受付に依頼 → 当日 16:00 以降に空港または次のホテルで受取",
  "airporter.note.nrt_t2": "NRT はターミナル 2 のみ対応",

  "payment.yamato.airport.tip":
    "空港カウンター 多数:交通系IC / PayPay / d払い 対応",
  "payment.yamato.branch.tip":
    "営業所は現金中心。クロネコメンバー割(事前チャージ)で -10〜15%。ホテル代理受付は現金、もしくはホテル立替が一般的",
  "payment.yuu.airport.tip":
    "空港ゆうパック カウンターは現金のみが多い。小銭のご用意を",
  "payment.yuu.postoffice.tip":
    "中〜大規模郵便局 はクレカ・交通系IC・ゆうちょPay対応が多い。持込で ¥120 割引",

  "share.copy": "リンクをコピー",
  "share.copied": "コピーしました",
  "share.line": "LINE で共有",

  "route.title":
    "{from} → {to} 手荷物配送 料金比較 · 6サイズ ヤマト vs ゆうパック",
  "route.desc":
    "{from} → {to} ルートのヤマト運輸 vs 郵便局ゆうパック 6サイズ即時料金、発送カウンター、所要日数 · JPLuggageGo",
  "route.h1": "{from} → {to} 料金比較",
  "route.breadcrumb.routes": "人気ルート",
  "route.section.prices": "6サイズ料金比較",
  "route.section.send_methods": "発送方法",
  "route.section.transit": "所要日数",
  "route.col.size": "サイズ",
  "route.updated": "データ更新 {date}",
  "route.prices.footer":
    "料金は都道府県単位で表示、早朝・夜間・離島の追加料金は含みません。下のボタンで送り先・サイズ・発送日を変更して到着日も試算できます。",
  "route.transit.body":
    "ヤマト宅急便 約 {yamato} 日、ゆうパック 約 {yuu} 日。本州内は翌日、沖縄は空輸で 2-4 日です。",
  "route.transit.footer":
    "実際の所要日数は発送時刻・天災・ホテルの受取時刻に左右されます。当日は運送会社にご確認ください。",
  "route.send.yamato_airport": "{airport} · ヤマト発送カウンター",
  "route.send.yuu_airport": "{airport} · 空港ゆうパック カウンター",
  "route.send.airporter_title": "Airporter 同日配送 (唯一の当日オプション)",
  "route.send.airporter_body":
    "Airporter は {airport} から {to} への荷物を同日配送。到着日すぐにチェックインしたい旅行者向け。",
  "route.send.pref_body":
    "{from} からはヤマト営業所・郵便局のほか、多くのホテルフロントから発送できます。下の「自由試算」で送り先をお選びください。",
  "route.cta.kicker": "別の送り先やサイズで試算したい?",
  "route.cta.title": "ヤマト vs ゆうパック を自由試算",
  "route.cta.button": "料金シミュレーションを開く →",
  "route.related": "ほかの人気ルート",

  "nav.faq": "よくある質問",
  "faq.meta.title": "よくある質問 · ヤマト vs ゆうパック FAQ",
  "faq.meta.desc":
    "日本の空港・ホテル手荷物配送のよくある質問:サイズ対応、ホテル代理受取、所要日数、大型荷物、支払い方法。",
  "faq.title": "よくある質問 FAQ",
  "faq.intro":
    "空港・ホテル手荷物配送で最もよく聞かれる 6 つの質問。直接試算は /quote へ。",
  "faq.cta": "料金を試算 →",
  "faq.q1": "29 インチのスーツケースはどのサイズ?",
  "faq.a1":
    "160 サイズ(3辺合計 160cm 以内、25kg まで)がおすすめ。26 インチは通常 140、24 インチ 120、21 インチ 100。",
  "faq.q2": "ホテルで受取拒否されませんか?",
  "faq.a2":
    "APA、東横 INN、ドーミーイン、三井ガーデン、西鉄など主要チェーンは事前通知付きの代理受取に対応しています。冷凍品や本人限定受取は例外です。詳しくは /quote の「ホテル代理受取一覧」をご確認ください。",
  "faq.q3": "どれくらいで届きますか?",
  "faq.a3":
    "本州内は翌日、北海道・九州跨ぎは 1-2 日、沖縄は空輸で 2-4 日。ヤマトとゆうパックの所要日数はほぼ同等で、台風・大雪による遅延の影響は両者同様です。",
  "faq.q4": "160 サイズより大きい荷物は送れますか?",
  "faq.a4":
    "ヤマトは 160 サイズまで。超過する場合は「ヤマト便」(貨物便 2-3 日)に切り替えるか、2 個口に分けます。ゆうパックも 160 サイズ、重量上限 30kg です。",
  "faq.q5": "空港から直接発送できますか?",
  "faq.a5":
    "NRT / HND / KIX / CTS / FUK / NGO / KIJ / SDJ などの主要国際空港にヤマト発送カウンターがあり、多くは 24 時間または早朝から深夜まで営業。ゆうパックは郵便局扱いのため営業時間は短めです。",
  "faq.q6": "希望のルートが見当たりません。",
  "faq.a6":
    "/quote ページで 47 都道府県の任意の 2 地点を選んで試算できます。ヤマトもゆうパックも 47×47 の全国マトリクスを網羅しています。",

  // Drop-off list rendering — shared by /quote 住所 mode via YamatoList / YuuList
  "nearby.result.empty": "この半径に拠点はありません。半径を広げてお試しください。",
  "nearby.result.distance": "{v}",
  "nearby.result.hours": "平日 {v}",
  "nearby.result.navigate": "🗺️ Google マップで見る",
  "nearby.result.fallback_note":
    "⚠️ 元の住所が OSM に未登録のため、「{query}」(市/区 中心点)で検索しました。正確な位置ではありませんが、最寄り拠点の参考にはなります。",

  // Trip planner
  "nav.trip": "複数拠点配送",
  "trip.meta.title": "複数拠点 荷物配送プラン · JPLuggageGo",
  "trip.meta.desc":
    "D1 東京→D3 京都→D5 大阪 のような旅程を入力すると、各区間の発送日・料金・Yamato vs ゆうパック 比較を自動生成。",
  "trip.title": "複数拠点 荷物配送プラン",
  "trip.sub":
    "宿泊ごとにチェックイン/アウト日・都道府県・荷物個数を入力 → 区間ごとの発送日/到着日、Yamato vs ゆうパック の安い方、総額を一画面で。",
  "trip.stay.header": "宿泊 {n}",
  "trip.stay.here_label": "🏠 滞在先",
  "trip.stay.label": "ホテル/宿名(任意・表示用)",
  "trip.stay.checkin": "チェックイン",
  "trip.stay.checkout": "チェックアウト",
  "trip.stay.prefecture": "都道府県(任意・住所から自動判定)",
  "trip.stay.pref_placeholder": "選択または空欄で自動判定",
  "trip.stay.baggage": "荷物(サイズごとの個数)",
  "trip.stay.baggage_count": "個",
  "trip.stay.address": "滞在先の住所(発送元 — 入力すれば都道府県は不要)",
  "trip.stay.address_placeholder": "京都府京都市東山区祇園町南側 572…",
  "trip.stay.ship_day_before": "前日投函(チェックアウト前夜にフロント預け)",
  "trip.stay.ship_day_before_hint": "2 泊以上必要。翌 16:00 に次の宿へ到着 — 最終日は手ぶら移動。",
  "trip.stay.ship_day_before_tip_aria": "対応宿泊タイプを表示",
  "trip.stay.ship_day_before_tip_title": "どの宿で使える?",
  "trip.stay.ship_day_before_tip_chain": "チェーンホテル(APA・東横 INN・リッチモンド 等):ほぼフロント代行あり ✓",
  "trip.stay.ship_day_before_tip_ryokan": "独立系旅館 / 温泉旅館:多くは対応可、事前電話確認を推奨",
  "trip.stay.ship_day_before_tip_airbnb": "Airbnb / 民泊:ホスト不在のため不可が基本 → チェックアウト日にコンビニ持ち込みを推奨",
  "trip.stay.nearby_show": "近くの受付拠点を表示",
  "trip.stay.nearby_hide": "閉じる",
  "trip.stay.nearby_loading": "検索中…",
  "trip.stay.nearby_yamato": "近くの Yamato 営業所",
  "trip.stay.nearby_yuu": "近くの郵便局",
  "trip.stay.brand_ok": "代行発送 OK ✓",
  "trip.stay.brand_check": "多くは対応可、事前電話確認を推奨",
  "trip.stay.brand_unknown": "ブランド未確認、各自でご確認ください",
  "trip.stay.add": "+ 宿泊を追加",
  "trip.stay.remove": "この区間を削除",
  "trip.arrival.label": "到着空港(任意 — 空港から 1 泊目の宿へ直送)",
  "trip.arrival.placeholder": "空港からは送らない",
  "trip.departure.label": "出発空港(任意 — 最終区間は空港カウンター直送)",
  "trip.departure.placeholder": "空港を使わない",
  "trip.submit": "配送プランを作成",
  "trip.validation.min_stays": "最低 2 泊が必要です",
  "trip.validation.invalid_date": "チェックイン日はチェックアウト日より前にしてください",
  "trip.validation.stay_missing_loc": "各宿泊は「都道府県」または「住所」のいずれかを入力してください",
  "trip.validation.pref_unresolved": "住所から都道府県を特定できませんでした。プルダウンから手動で選択してください。",
  "trip.result.header": "配送プラン",
  "trip.result.leg": "区間 {n}",
  "trip.result.skipped_same_city": "同日・同都道府県 → 手持ち移動を推奨、配送不要",
  "trip.result.skipped_no_baggage": "荷物未登録 → スキップ",
  "trip.result.ship_date": "発送日",
  "trip.result.arrive_date": "到着日",
  "trip.result.day_before": "前日投函",
  "trip.result.day_before_fallback": "1 泊のため当日発送に変更",
  "trip.result.route": "区間",
  "trip.result.baggage": "荷物",
  "trip.result.yamato": "Yamato",
  "trip.result.yuu": "ゆうパック",
  "trip.result.cheaper_yamato": "Yamato が ¥{v} 安い",
  "trip.result.cheaper_yuu": "ゆう が ¥{v} 安い",
  "trip.result.tie": "同額",
  "trip.result.total": "合計",
  "trip.result.total_note":
    "各区間の安い方を合算。翌日 16:00 到着想定(標準宅急便、離島除く)。",
  "trip.result.gap":
    "⚠️ 一部区間で料金データが未取得(同一都道府県内の TK.json 欠落など)— 合計から除外。",
  "trip.gantt.title": "旅程タイムライン",
  "trip.gantt.stay": "宿泊",
  "trip.gantt.ship": "発送",
  "trip.gantt.arrive": "到着",
  "trip.print.hint": "ブラウザ印刷(Cmd/Ctrl + P)で PDF 保存可。フォーム部分は自動非表示。",
  "trip.empty": "宿泊を 2 つ以上入力すると、配送プランがここに表示されます。",

  "home.help.guide":
    "初めての方向けガイド · 空港カウンター / 営業所 / ホテル発送の 3 ルートを手順付きで解説",
  "home.help.faq": "よくある質問 · 料金・配達日数・支払い方法・追加料金ルール",

  "quote.guide_banner.tag": "初めての方向けガイド",
  "quote.guide_banner.title":
    "日本で初めて荷物を送る?手順をひととおり確認しましょう",
  "quote.guide_banner.cta": "手順を全部見る →",

  "guide.shipping.meta.title":
    "日本の手荷物配送 3 ルート完全ガイド · 初めての方でも失敗しない",
  "guide.shipping.meta.desc":
    "空港カウンター、ヤマト営業所、ホテル発送の 3 つの配送ルートを手順レベルで解説。準備物、カウンターとのやり取り、料金・配達日数、よくあるトラブルまで。日本に初めて来る旅行者向け。",
  "guide.shipping.breadcrumb": "操作ガイド · 手荷物発送",
  "guide.shipping.h1": "荷物はどう送る?3 つのルートを一気に理解",
  "guide.shipping.intro":
    "日本でホテルを移動するなら、29 インチのスーツケースを転がすより宅配が圧倒的に楽。でも現場で何が起きるのか、カウンターでどう話すのか、どの伝票を書くのか、いくらかかるのか —— 初めてだと戸惑います。このガイドは 3 ルートを「出発前の準備 → 現場での手順 → トラブル時の対処」に分けました。順に進めれば迷いません。",

  "guide.shipping.pick.title": "どのルートを選ぶ?すぐ判断",
  "guide.shipping.pick.subtitle":
    "1 分で分かる、今どこにいて次どこへ向かうかで判断。",
  "guide.shipping.pick.airport.label": "飛行機を降りたばかり、ホテルへ向かう",
  "guide.shipping.pick.airport.value":
    "空港カウンター(最もラク・初心者強く推奨)",
  "guide.shipping.pick.branch.label":
    "市街地 / ホテルから次のホテルへ転送したい",
  "guide.shipping.pick.branch.value": "営業所へ持ち込み(最安)",
  "guide.shipping.pick.hotel.label": "今日チェックアウトで次のホテルへ、楽したい",
  "guide.shipping.pick.hotel.value":
    "ホテルフロントから発送(最も手間なし)",
  "guide.shipping.pick.departure.label": "帰国当日、手ぶらで空港へ行きたい",
  "guide.shipping.pick.departure.value":
    "空港カウンター → 帰国セクションを参照",

  "guide.shipping.cards.title": "3 ルート詳細ガイド",
  "guide.shipping.cards.desc":
    "以下のカードから、手順・日本語フレーズ・よくあるトラブル対処を確認。",

  "guide.shipping.card.airport.title": "① 空港カウンター",
  "guide.shipping.card.airport.scenario":
    "到着当日または帰国当日に、空港で荷物を預ける。クロネコヤマトや JAL ABC のカウンターが対応、スタッフが伝票記入を手伝ってくれます。初心者にいちばん優しい。",
  "guide.shipping.card.airport.meta_cost": "¥1,800 〜",
  "guide.shipping.card.airport.meta_eta": "翌日午後",
  "guide.shipping.card.airport.meta_level": "初心者向け",

  "guide.shipping.card.branch.title": "② 営業所へ持ち込み",
  "guide.shipping.card.branch.scenario":
    "ホテルや滞在先から自分で最寄りのヤマト / 佐川営業所へ荷物を運ぶ。最安で、「持込割」で 100 円引き。送り状は自分で書くか公式アプリで事前入力、日本語が少し要ります。",
  "guide.shipping.card.branch.meta_cost": "¥1,500 〜",
  "guide.shipping.card.branch.meta_eta": "翌日",
  "guide.shipping.card.branch.meta_level": "日本語少々",

  "guide.shipping.card.hotel.title": "③ ホテルフロント発送",
  "guide.shipping.card.hotel.scenario":
    "チェックアウト当日、フロントに荷物を預けるとホテルが提携宅配業者に引き渡します。最も手間なし。ただし全ホテルが対応しているわけではない —— 格安 / カプセルホテルは扱わないことが多いので、予約前に確認を。",
  "guide.shipping.card.hotel.meta_cost": "¥2,000 〜",
  "guide.shipping.card.hotel.meta_eta": "翌日午後",
  "guide.shipping.card.hotel.meta_level": "初心者向け",

  "guide.shipping.card.cta": "手順を全部見る →",

  "guide.shipping.prep.title": "3 ルート共通 · 出発前に必ず用意するもの",
  "guide.shipping.prep.1.title": "ホテルの日本語住所",
  "guide.shipping.prep.1.desc":
    "予約確認メールから日本語版住所を探す(ホテル漢字名 + 都道府県 + 市区町村 + 番地 + 7 桁郵便番号)。または Google マップでホテル名を検索して日本語表記の住所をコピー。印刷またはスマホに保存しておくと安心。",
  "guide.shipping.prep.2.title": "ホテルの電話番号",
  "guide.shipping.prep.2.desc":
    "予約メールに記載あり。形式は +81-3-XXXX-XXXX または 03-XXXX-XXXX。送り状に記入し、配送業者はトラブル時にここへ連絡します。",
  "guide.shipping.prep.3.title": "パスポート",
  "guide.shipping.prep.3.desc":
    "空港カウンターで空港宅急便を引き取るとき、ヤマト公式は身分証提示を求めます。ホテル発送や営業所持込では必須ではありませんが、携行推奨。",
  "guide.shipping.prep.4.title": "日本円現金(¥5,000–10,000)",
  "guide.shipping.prep.4.desc":
    "ホテル発送や小規模営業所は現金のみのことが多い。空港カウンターや大型営業所はカード可だが、並ぶ前に現金を用意しておくと確実。大型荷物 1 個あたり ¥1,500–4,000 程度。",
  "guide.shipping.prep.5.title": "スーツケースカバー(任意)",
  "guide.shipping.prep.5.desc":
    "ヤマト公式はカバー利用を推奨(キズ防止)。空港コンビニや Don Quijote で約 ¥1,000–2,000。なくても送れますが、キズは自己負担になります。",

  "guide.shipping.aftercard.title": "読んで試算してみたい?",
  "guide.shipping.aftercard.desc":
    "/quote ページで出発地と到着地を入力すると、3 社の実料金比較がすぐ見られます。",
  "guide.shipping.aftercard.cta": "料金を試算 →",

  "guide.shipping.sources.title": "出典(2026 年 4 月確認)",
  "guide.shipping.sources.yamato_airport": "ヤマト 空港宅急便",
  "guide.shipping.sources.yamato_flow_faq":
    "ヤマト FAQ:ご利用の流れと料金",
  "guide.shipping.sources.jalabc": "JAL ABC 空港宅配",
  "guide.shipping.sources.yamato_send": "ヤマト 宅急便の送り方",
  "guide.shipping.sources.yamato_hotel":
    "ヤマト FAQ:ホテル / 旅館への荷物発送",
  "guide.shipping.sources.verified_at":
    "上記リンクは確認時点の情報です。料金・所要日数・カウンター位置は変更されることがあり、現場表示を優先してください。",

  "guide.shipping.airport.meta.title":
    "空港カウンターで荷物を送る完全マニュアル · 到着日 + 帰国日",
  "guide.shipping.airport.meta.desc":
    "日本に初めて来て、空港から荷物をホテルへ送るには?帰国日に手ぶらで空港へ行くには?クロネコヤマトと JAL ABC カウンターの手順を一つずつ解説。日本語フレーズ、よくあるトラブル、持ち物リスト付き。",
  "guide.shipping.airport.h1": "① 空港カウンター · 完全な手順",
  "guide.shipping.airport.intro":
    "日本の主要国際空港には宅配カウンターが設置されています。最大手はクロネコヤマト「空港宅急便」と JAL ABC「空港宅配」。到着当日はホテルへ直送、帰国当日は前日に空港へ送り当日引取りも可能。英語対応スタッフがいるので、日本語ゼロの初心者にいちばん優しい選択肢。",
  "guide.shipping.airport.summary.cost":
    "料金 ¥1,800–3,500 / 個(サイズと距離による)",
  "guide.shipping.airport.summary.eta":
    "所要 翌日午後到着(離島は 2–3 日)",
  "guide.shipping.airport.summary.level": "難易度 ★☆☆ · 初心者向け",
  "guide.shipping.airport.summary.best_for":
    "向いている人:到着したばかりで手ぶらで電車移動したい / 帰国日にスーツケースを引きたくない / 日本語が全く話せない旅行者。",

  "guide.shipping.airport.arrival.title": "A · 到着当日 → ホテル",
  "guide.shipping.airport.arrival.intro":
    "手荷物を受け取り税関を通過したら、そのまま宅配カウンターへ。空港内で 15–30 分程度で完了し、そのあと電車 / バス / タクシーで手ぶらでホテルへ向かえます。荷物は通常翌日午後にホテル到着。",
  "guide.shipping.airport.arrival.step_1.title": "降機 → 手荷物受取 → 税関",
  "guide.shipping.airport.arrival.step_1.body":
    "「Arrival / 到着」の案内に従います。税関通過後「到着ロビー」に着きますが、ここが宅配カウンターのあるフロアです。",
  "guide.shipping.airport.arrival.step_2.title": "宅配カウンターを探す",
  "guide.shipping.airport.arrival.step_2.body":
    "到着ロビーに「手荷物配送」「空港宅配」「Baggage Delivery」の案内表示あり。ヤマトと JAL ABC のカウンターは同じエリアに並んでいることが多い(成田 T1/T2、羽田 T2/T3、関西 T1 すべてそう)。見つからなければインフォメーションカウンターで聞くと案内してくれます。",
  "guide.shipping.airport.arrival.step_3.title": "並ぶ → 用件を伝える",
  "guide.shipping.airport.arrival.step_3.body":
    "順番が来たら、スマホのホテル情報(日本語住所、電話、予約番号)を見せます。英語対応スタッフなら「Where to?」と聞かれるので「Ship to this hotel」と答える。日本語なら「このホテルまで荷物を送りたいです」。",
  "guide.shipping.airport.arrival.step_4.title": "送り状を書く",
  "guide.shipping.airport.arrival.step_4.body":
    "カウンターで複写式 3 枚綴り伝票を渡されます。重要欄:ご依頼主には自分の氏名と携帯、お届け先がいちばん重要 —— ホテル名を漢字で、お届け先には「○○様気付 ○○」(気付=転送)、ホテル電話と郵便番号も。通常はスタッフが主要欄の代筆をしてくれます。このステップに 5–10 分見ておく。",
  "guide.shipping.airport.arrival.step_5.title": "計量 → 料金提示",
  "guide.shipping.airport.arrival.step_5.body":
    "荷物を計量し料金を提示。ヤマト標準上限は三辺合計 160cm 以下・30kg 以下。超過はきっぱり断られるので、その場で 2 個に分ける(袋はカウンターで購入可)。",
  "guide.shipping.airport.arrival.step_6.title": "支払い",
  "guide.shipping.airport.arrival.step_6.body":
    "ヤマトカウンター:現金、クレジット(Visa/Master/JCB/Amex)、交通系 IC(Suica/Pasmo/ICOCA)、PayPay、d 払い対応。JAL ABC:現金、クレジット、電子マネー可、QR コード決済は不可。カード払いなら「クレジットカードで」と先に伝える。",
  "guide.shipping.airport.arrival.step_7.title": "レシートを保管",
  "guide.shipping.airport.arrival.step_7.body":
    "「ご依頼主控」を受け取ります。これは追跡用で、「問合せ番号」(追跡番号、12 桁)が記載されています。スマホで写真を撮り、現物は荷物到着確認まで保管。追跡はヤマト公式サイトでこの番号を入力。",
  "guide.shipping.airport.arrival.step_8.title": "手ぶらで空港を出る",
  "guide.shipping.airport.arrival.step_8.body":
    "完了!あとは電車でホテルへ。荷物は通常翌日午後(14:00–18:00)にホテルフロントへ到着、ホテルが一時保管します。チェックイン時に「私宛の荷物がありますか」と伝えれば受け取れます。",

  "guide.shipping.airport.departure.title": "B · 帰国当日 → 空港",
  "guide.shipping.airport.departure.warning":
    "⚠️ 重要:空港宅急便は搭乗日の「前日」までに空港カウンターへ到着している必要があります。当日発送では間に合いません。前日までにホテルや営業所から発送を。関東 / 関西圏は前日 OK、北海道 / 九州 / 沖縄は 2–3 日必要。",
  "guide.shipping.airport.departure.intro":
    "逆向きの使い方:ホテルまたは営業所から「出国空港の宅配カウンター」まで荷物を送り、搭乗日に空港で引き取ってチェックイン。これで当日は手ぶらで電車に乗れます。発送方法は 2 通り。",
  "guide.shipping.airport.departure.hotel.title":
    "方法 1 · ホテルから発送(最も楽)",
  "guide.shipping.airport.departure.hotel.step_1":
    "チェックアウト前日にフロントへ「明日、○○空港カウンターまで荷物を送りたいです」と伝える。送り状を持ってきてくれます。",
  "guide.shipping.airport.departure.hotel.step_2":
    "送り状記入、お届け先欄に「○○空港カウンター気付 ○○(自分の氏名)」。航空会社と便名(例:JAL123)、搭乗予定日も記入。",
  "guide.shipping.airport.departure.hotel.step_3":
    "支払い(現金が多い、一部カード可)、レシート受取。これは当日引取用の証憑なので大切に保管。",
  "guide.shipping.airport.departure.hotel.step_4":
    "搭乗当日、2–3 時間前に空港へ。まず宅配カウンターで引き取り、その後チェックイン。ヤマト公式ルール:搭乗時刻の 3 時間前から 1 時間前まで引取可能。",
  "guide.shipping.airport.departure.branch.title":
    "方法 2 · ヤマト営業所から発送",
  "guide.shipping.airport.departure.branch.step_1":
    "前日に自分で最寄りのヤマト営業所へ荷物を持参(Google マップで「ヤマト運輸 営業所」検索)。",
  "guide.shipping.airport.departure.branch.step_2":
    "現場で送り状記入(またはアプリで事前入力)。お届け先は「○○空港カウンター気付」。「持込割」で 100 円引き。",
  "guide.shipping.airport.departure.branch.step_3":
    "支払い、レシート受取。搭乗当日に空港カウンターで引取、方法 1 の step_4 と同じ。",
  "guide.shipping.airport.departure.pickup.title": "引取時カウンターの場所",
  "guide.shipping.airport.departure.pickup.narita":
    "成田 T1/T2:出発ロビー 4F、チェックインカウンターと同フロア",
  "guide.shipping.airport.departure.pickup.haneda":
    "羽田 T2/T3:出発ロビー 3F、案内「手荷物受取」",
  "guide.shipping.airport.departure.pickup.kansai":
    "関西 T1:出発ロビー 4F",
  "guide.shipping.airport.departure.pickup.chubu":
    "中部(名古屋)T1:出発ロビー 3F",
  "guide.shipping.airport.departure.pickup.required":
    "引取に必要なもの:送り状の控え(発送時に受け取ったもの)、パスポート。ヤマト公式文書では印鑑も記載がありますが、外国人はパスポートで代用可。",

  "guide.shipping.airport.counters.title":
    "カウンター設置空港の全リスト",
  "guide.shipping.airport.counters.yamato.title":
    "クロネコヤマト 空港宅急便",
  "guide.shipping.airport.counters.yamato.list":
    "成田(T1 / T2)、羽田(T1 / T2 / T3)、関西(T1)、中部(T1)、新千歳、仙台、福岡、那覇など主要国際 / 国内空港。詳細は公式「空港宅急便 お受取り・ご発送のカウンター一覧」を参照。",
  "guide.shipping.airport.counters.jalabc.title": "JAL ABC 空港宅配",
  "guide.shipping.airport.counters.jalabc.list":
    "成田(T1 / T2)、羽田(T2 / T3)、関西(T1)、中部(T1)の計 4 空港。ヤマトより拠点は少ないが主要国際線はカバー。",
  "guide.shipping.airport.counters.which":
    "どちらを選ぶ?サービス内容はほぼ同じ、当日見つけた最初のカウンターで OK。強いて比較すれば、ヤマトは拠点が多くアプリ追跡が便利、JAL ABC は JAL 会員割引とオンライン予約 / クレジット先払いが可能。",

  "guide.shipping.fare.col.route": "ルート",
  "guide.shipping.fare.updated": "料金 {date} 更新",
  "guide.shipping.fare.no_data": "料金データ読み込み中",
  "guide.shipping.fare.source":
    "出典:ヤマト公式料金表(毎週水曜日早朝更新)",
  "guide.shipping.fare.note":
    "※ 実際の料金は現場での計量が優先。離島、北海道 / 沖縄の一部エリアは追加料金発生の可能性あり。特大サイズ(三辺合計 >160cm または >30kg)は取扱不可、分割が必要。",
  "guide.shipping.fare.check_yours": "自分のルートで確認",

  "guide.shipping.airport.fare.title": "料金はどれくらい?",
  "guide.shipping.airport.fare.intro":
    "ヤマトクロネコ「空港宅急便」の例(JAL ABC はほぼ同等、¥100–300 高め)。",
  "guide.shipping.airport.fare.discount":
    "適用可能な割引:Web 予約送り状 −¥60、ヤマト会員(クロネコメンバー)事前チャージ支払い −¥15、往復同時発送 −¥120。ただし空港カウンターでのその場手続きではこれらの割引が効かないことが多い。",

  "guide.shipping.airport.phrases.title": "現場でよく使う日本語 7 フレーズ",
  "guide.shipping.airport.phrases.desc":
    "日本語が話せなくても大丈夫、これらを画面に表示してカウンターに見せるだけで伝わります。",
  "guide.shipping.airport.phrases.1.jp":
    "このホテルまで荷物を送りたいです。",
  "guide.shipping.airport.phrases.1.romaji":
    "Kono hoteru made nimotsu wo okuritai desu.",
  "guide.shipping.airport.phrases.1.zh": "このホテルまで荷物を送りたい。",
  "guide.shipping.airport.phrases.2.jp": "英語でお願いできますか?",
  "guide.shipping.airport.phrases.2.romaji": "Eigo de onegai dekimasu ka?",
  "guide.shipping.airport.phrases.2.zh": "英語で対応してもらえますか。",
  "guide.shipping.airport.phrases.3.jp":
    "クレジットカードでお願いします。",
  "guide.shipping.airport.phrases.3.romaji":
    "Kurejitto kaado de onegaishimasu.",
  "guide.shipping.airport.phrases.3.zh": "クレジットカードで支払います。",
  "guide.shipping.airport.phrases.4.jp": "現金でお願いします。",
  "guide.shipping.airport.phrases.4.romaji":
    "Genkin de onegaishimasu.",
  "guide.shipping.airport.phrases.4.zh": "現金で支払います。",
  "guide.shipping.airport.phrases.5.jp":
    "明日の何時ごろ届きますか?",
  "guide.shipping.airport.phrases.5.romaji":
    "Ashita no nanji goro todokimasu ka?",
  "guide.shipping.airport.phrases.5.zh":
    "明日は何時ごろ届きますか。",
  "guide.shipping.airport.phrases.6.jp":
    "スーツケースにカバーは必要ですか?",
  "guide.shipping.airport.phrases.6.romaji":
    "Suutsukeesu ni kabaa wa hitsuyou desu ka?",
  "guide.shipping.airport.phrases.6.zh":
    "スーツケースにカバーは必要ですか。",
  "guide.shipping.airport.phrases.7.jp":
    "補償オプションはありますか?",
  "guide.shipping.airport.phrases.7.romaji":
    "Hoshou opushon wa arimasu ka?",
  "guide.shipping.airport.phrases.7.zh": "補償オプションはありますか。",

  "guide.shipping.airport.receive.title":
    "荷物がホテルに届いたあとは?",
  "guide.shipping.airport.receive.body":
    "ホテルフロントで受領後、倉庫に保管され、チェックイン時に受け渡されます。チェックイン時にまだ未着の場合はフロントが到着予定時刻を教えてくれます。到着後は部屋に電話連絡、または後ほど部屋へお届け。チェックインのときに「荷物を先に送っている」と伝えるのを忘れずに。",
  "guide.shipping.airport.receive.phrase_jp":
    "私宛に荷物が届いていますか?名前は ○○ です。",
  "guide.shipping.airport.receive.phrase_romaji":
    "Watashi ate ni nimotsu ga todoite imasu ka? Namae wa ○○ desu.",
  "guide.shipping.airport.receive.phrase_zh":
    "私宛に荷物が届いていますか。名前は ○○ です。",

  "guide.shipping.airport.trouble.title":
    "よくあるトラブル · 対処法",
  "guide.shipping.airport.trouble.1.q":
    "荷物が 30kg を超えてしまった場合は?",
  "guide.shipping.airport.trouble.1.a":
    "ヤマトの 30kg 上限は絶対規定。その場で 2 個に分け、2 個分の料金がかかります。大型ギフトや楽器は佐川急便に変更(一部地域では 50kg まで対応)。",
  "guide.shipping.airport.trouble.2.q":
    "日本円現金がなくカードしかない場合は?",
  "guide.shipping.airport.trouble.2.a":
    "ヤマト空港カウンターは Visa/Master/JCB に対応していることが多い。念のため到着ロビーの Seven Bank ATM で ¥10,000 引き出しておくと安心。空港内各フロアに Seven ATM または郵便局 ATM があり、海外カード対応。",
  "guide.shipping.airport.trouble.3.q":
    "ホテル名のスペルに自信がない場合は?",
  "guide.shipping.airport.trouble.3.a":
    "Google マップで英語名検索し、詳細ページでカタカナ / 漢字の公式名を確認。マップ画面のスクリーンショットをカウンターに見せるのが最速。",
  "guide.shipping.airport.trouble.4.q":
    "スーツケースカバーを持っていないとキズがつく?",
  "guide.shipping.airport.trouble.4.a":
    "ヤマト公式は推奨するが必須ではない。心配なら空港コンビニ(LAWSON / Family Mart)で約 ¥1,000、到着ロビーの Donki / Travel Store で ¥500–1,500 で購入可。",
  "guide.shipping.airport.trouble.5.q":
    "帰国日に発送し忘れた、当日空港で送れる?",
  "guide.shipping.airport.trouble.5.a":
    "可能だがそれは「当日チェックイン時の手荷物預け入れ」になり、空港宅急便ではなくなります。チェックインで直接航空機預入、到着国の税関で受取の通常ルート。当日手ぶらで空港に行く目的は達成できません —— 唯一の手は 2–3 時間前に空港着、スーツケースを引いてチェックインエリアに入りすぐ預ける。",

  "guide.shipping.airport.faq.title": "よくある質問",
  "guide.shipping.airport.faq.1.q":
    "大型荷物 1 個(29 インチ)だと通常いくら?",
  "guide.shipping.airport.faq.1.a":
    "29 インチスーツケースは通常 140–160 サイズ。東京都内 ¥1,800–2,200、東京↔大阪 / 京都 ¥2,300–2,500、東京↔福岡 / 札幌 ¥2,800–3,500、沖縄あてが最も高く ¥3,500–4,500。JAL ABC は ¥300–500 ほど高め。",
  "guide.shipping.airport.faq.2.q":
    "最短で何日?当日配達は可能?",
  "guide.shipping.airport.faq.2.a":
    "標準は翌日午後到着。同一都道府県内の午前発 / 午後着はあり得ますが(ヤマト「当日便」オプション、ただし空港カウンターでは取扱不可の場合あり)、原則翌日前提で計画を。当日発送したいなら唯一の選択肢は Airporter(特定空港 / 時間帯限定)。",
  "guide.shipping.airport.faq.3.q": "荷物が紛失することはある?保険は?",
  "guide.shipping.airport.faq.3.a":
    "ヤマト空港宅急便は基本運送保険付き(上限 30 万円)、30 万円超は「荷受人補償」の追加加入が可能。紛失確率はごく低く、ヤマト年間紛失率 <0.001%。ただし電子製品や貴重品は手荷物で携行を推奨。",
  "guide.shipping.airport.faq.4.q":
    "カメラ / パソコン / リチウム電池は送れる?",
  "guide.shipping.airport.faq.4.a":
    "**推奨しません**。ヤマトは貴重品、壊れ物、現金、クレジットカードなどを禁止、電子製品は禁止ではないが破損時の補償なし。リチウム電池は特に注意 —— モバイルバッテリーや単独電池は手荷物で、パソコンやカメラも手荷物で。",
  "guide.shipping.airport.faq.5.q": "1 人で何個まで送れる?",
  "guide.shipping.airport.faq.5.a":
    "個数制限なし、個別に料金計算。一般的な推奨:手荷物(パスポート、パソコン、1 泊分の着替え)+ 発送荷物(大型スーツケース+その他)。家族旅行で 3–5 個送るのもよくあります。",

  "guide.shipping.airport.cta_next.title": "他の 2 ルートを見る",
  "guide.shipping.airport.cta_next.branch":
    "営業所へ持ち込み · 最安",
  "guide.shipping.airport.cta_next.hotel":
    "ホテルフロント発送 · 最も手間なし",

  "guide.shipping.branch.meta.title":
    "ヤマト営業所へ持ち込み発送 完全マニュアル · 最安ルート",
  "guide.shipping.branch.meta.desc":
    "ホテルや滞在先から自分でヤマト / 佐川営業所へ荷物を持ち込む方法。空港カウンターより 10–20% 安い。送り状の書き方、最寄り営業所の探し方、日本語フレーズ、よくあるトラブル対処。",
  "guide.shipping.branch.h1": "② 営業所へ持ち込み · 完全な手順",
  "guide.shipping.branch.intro":
    "このルートは最安 ——「持込割」100 円引きに加え Web 事前入力送り状の「デジタル割」60 円引き、合わせて最大 ¥160 節約。代わりに、自分で荷物を運び、自分で送り状を書く必要があります。少し日本語が分かるか、スマホ翻訳を使える旅行者向け。",
  "guide.shipping.branch.summary.cost": "¥1,500 〜(最安)",
  "guide.shipping.branch.summary.eta":
    "翌日 / 翌々日(目的地による)",
  "guide.shipping.branch.summary.level":
    "難易度 ★★☆ · 日本語の伝票記入あり",
  "guide.shipping.branch.summary.best_for":
    "向いている人:節約したい / 1 人で運べる荷物(2 個以下 / 1 個 15kg 以下)/ スマホ翻訳に抵抗ない旅行者。",

  "guide.shipping.branch.step_1.title":
    "Google マップで最寄り営業所を検索",
  "guide.shipping.branch.step_1.body":
    "Google マップで「ヤマト運輸 営業所」(または「佐川急便 営業所」)と検索し、ホテル近隣で評価が高く営業時間の長い拠点を選ぶ。ヤマトの主要「センター」は 24 時間営業、街角の小型取扱店は 9:00–20:00 中心。駅ビル内取扱店は避ける —— 小包専用で大型スーツケースは断られることがあります。",
  "guide.shipping.branch.step_2.title": "荷物の運び方",
  "guide.shipping.branch.step_2.body":
    "500m 以内は徒歩で引いていく。500m 超はタクシー推奨(日本のタクシー初乗り ¥500–700、日本語が不安なら GO アプリまたは Uber Japan が便利)。地下鉄 / 電車は避ける —— 大型スーツケースでのエレベーター / 乗換は地獄、通勤時間は他の乗客の邪魔にもなります。",
  "guide.shipping.branch.step_3.title":
    "営業所に入る → 送り状を受け取る",
  "guide.shipping.branch.step_3.body":
    "手書きの 3 枚複写(白 / ピンク / 黄色)送り状が置いてあるのでセルフで取る。ヤマト会員アカウントがあれば(外国人旅行者はまず作れないので少数派)アプリ事前入力も可、ない場合は手書きで、効率差はほとんどない。カウンターには「ネコピット」セルフ機もあるが、アプリ連携が必要なので外国人旅行者には不向き。",
  "guide.shipping.branch.step_4.title":
    "送り状を書く(5 つの重要欄)",
  "guide.shipping.branch.step_4.body":
    "下の「送り状の書き方」セクションで各欄を解説。伝票は全て日本語ですが項目は固定、順に書けば問題なし。",
  "guide.shipping.branch.step_5.title":
    "伝票 + 荷物をカウンターへ",
  "guide.shipping.branch.step_5.body":
    "カウンター担当が:(1) 送り状をスキャン、(2) 重量・サイズ計測、(3) 料金通知、(4) スーツケースカバーの購入を確認(¥500–1000)、(5) 会計。このステップは通常 2–5 分。",
  "guide.shipping.branch.step_6.title":
    "支払い → レシート受取",
  "guide.shipping.branch.step_6.body":
    "営業所は現金、Suica/PASMO/ICOCA などの交通系 IC、PayPay 対応が多い。24 時間営業の一部はカード可だが保証なし。最も確実なのは現金 + IC の両方。「ご依頼主控」(発送人控)に追跡番号があるので、スマホで写真を撮っておきましょう。",

  "guide.shipping.branch.form.title":
    "送り状の書き方 · 5 つの重要欄",
  "guide.shipping.branch.form.desc":
    "送り状は左右に分かれ、右半分は配送業者が使う欄(バーコード、日付)で触らない。左半分があなたが書く欄。",
  "guide.shipping.branch.form.field_sender":
    "「ご依頼主」(発送人):あなたの氏名(漢字またはローマ字)、電話(ホテル電話または現地 SIM の番号)、郵便番号+住所(ホテルの日本語住所)。",
  "guide.shipping.branch.form.field_recipient":
    "「お届け先」(受取人):最重要欄。氏名欄には「○○ホテル ○○様気付 ○○(自分の氏名)」—— ○○ホテルが受取ホテル名、○○様気付は「このホテルに転送してほしい」の意、最後があなたの氏名(ホテルはこれで本人確認)。ホテル郵便番号+住所+電話も記入。",
  "guide.shipping.branch.form.field_item":
    "「品名」(内容物):「衣類」「旅行用品」で OK。「貴重品」「現金」「電子機器」は書かない —— ヤマトに断られるか免責サインを求められます。",
  "guide.shipping.branch.form.field_time":
    "「お届け希望日時」(希望配達日時):日付は翌日(今日+1)、時間帯は「午前中」または「14–16 時」のように指定。空欄なら「最短配達」。",
  "guide.shipping.branch.form.field_misc":
    "「クール便」(冷蔵冷凍):**チェックしない**。「代金引換」(着払):**チェックしない**、本当に受取人払にしたい場合のみ。",
  "guide.shipping.branch.form.tip":
    "記入後は迷ったらカウンターに「チェックしていただけますか?」と頼むと確認してくれます。",

  "guide.shipping.branch.phrases.title":
    "営業所現場でよく使う日本語 5 フレーズ",
  "guide.shipping.branch.phrases.desc":
    "日本語が話せなくても大丈夫、スクリーンショットをカウンターに見せるだけで伝わります。",
  "guide.shipping.branch.phrases.1.jp": "これを送りたいです。",
  "guide.shipping.branch.phrases.1.romaji": "Kore wo okuritai desu.",
  "guide.shipping.branch.phrases.1.zh": "これを送りたいです。",
  "guide.shipping.branch.phrases.2.jp":
    "送り状のチェックをお願いできますか?",
  "guide.shipping.branch.phrases.2.romaji":
    "Okurijou no chekku wo onegai dekimasu ka?",
  "guide.shipping.branch.phrases.2.zh":
    "送り状のチェックをお願いできますか。",
  "guide.shipping.branch.phrases.3.jp":
    "明日の午前中に届きますか?",
  "guide.shipping.branch.phrases.3.romaji":
    "Ashita no gozenchuu ni todokimasu ka?",
  "guide.shipping.branch.phrases.3.zh":
    "明日の午前中に届きますか。",
  "guide.shipping.branch.phrases.4.jp":
    "持込割引はありますか?",
  "guide.shipping.branch.phrases.4.romaji":
    "Mochikomi waribiki wa arimasu ka?",
  "guide.shipping.branch.phrases.4.zh": "持込割引はありますか。",
  "guide.shipping.branch.phrases.5.jp":
    "Suica で支払えますか?",
  "guide.shipping.branch.phrases.5.romaji":
    "Suica de shiharaemasu ka?",
  "guide.shipping.branch.phrases.5.zh": "Suica で支払えますか。",

  "guide.shipping.branch.fare.title": "料金はどれくらい?",
  "guide.shipping.branch.fare.intro":
    "以下は標準運賃(ヤマト クロネコ宅急便)。営業所へ持ち込むと:持込割引 −¥100、デジタル割(Web 送り状)−¥60、最大 −¥160 / 個が適用。",

  "guide.shipping.branch.trouble.title":
    "よくあるトラブル · 対処法",
  "guide.shipping.branch.trouble.1.q":
    "アプリ登録に日本の携帯番号が必要だと言われた?",
  "guide.shipping.branch.trouble.1.a":
    "アプリはスキップして手書き送り状で OK。節約できるデジタル割 60 円のために日本 SIM を契約するほどの価値はありません。",
  "guide.shipping.branch.trouble.2.q":
    "店員が英語を全く話せない場合は?",
  "guide.shipping.branch.trouble.2.a":
    "Google 翻訳アプリの「カメラモード」で伝票を撮影するか、中国語でタイプして日本語に翻訳して見せる。ヤマト従業員は外国人客に慣れていて、話せない人にはゆっくり + 身振り手振りで対応してくれます。",
  "guide.shipping.branch.trouble.3.q":
    "送り状を間違えて書いてしまった?",
  "guide.shipping.branch.trouble.3.a":
    "まだ提出前なら新しい伝票で書き直し。提出後でも 15 分以内ならスタッフに頼めば取り戻して修正可。それを過ぎると追跡番号でヤマト公式サイトから変更申請が必要、面倒なので記入時は丁寧に。",
  "guide.shipping.branch.trouble.4.q":
    "営業所がホテルから遠い?",
  "guide.shipping.branch.trouble.4.a":
    "1 km を超えていて運びたくない場合はホテル発送(下のリンク)に変更するか、電話でヤマトの集荷依頼(+¥30–60、持込より必ずしも安くない)。",

  "guide.shipping.branch.faq.title": "よくある質問",
  "guide.shipping.branch.faq.1.q":
    "営業所と取扱店の違いは?",
  "guide.shipping.branch.faq.1.a":
    "営業所(センター)はヤマト直営、大型荷物対応、24 時間営業が多い;取扱店は提携コンビニや商店、多くは 100 サイズ以下の小型のみ。大型スーツケース(140+ サイズ)は営業所へ、取扱店は避ける。",
  "guide.shipping.branch.faq.2.q":
    "コンビニ(7-11、Family Mart)で大型荷物を送れる?",
  "guide.shipping.branch.faq.2.a":
    "ヤマトは Family Mart / Lawson と提携(7-11 は主に佐川)していますが、店員の習熟度にばらつきがあり大型は断られることが多い。スーツケースはヤマト営業所へ直接持ち込み、コンビニに賭けないで。",
  "guide.shipping.branch.faq.3.q":
    "佐川急便とヤマトの違いは?",
  "guide.shipping.branch.faq.3.a":
    "両社とも営業所数はほぼ同等、料金も近い(佐川「飛脚宅配便」が ¥50–100 ほど安い)。ただし佐川は空港カウンターが少なく、外国人旅行者対応も弱い、**外国人旅行者はヤマトを優先推奨**。",
  "guide.shipping.branch.faq.4.q": "配達時間の指定はできる?",
  "guide.shipping.branch.faq.4.a":
    "可能、送り状「お届け希望日時」欄で選択。選べる時間帯:午前中 / 14:00–16:00 / 16:00–18:00 / 18:00–20:00 / 19:00–21:00。ヤマトの時間帯指定的中率は >95%。",
  "guide.shipping.branch.faq.5.q":
    "30kg または 200 サイズを超えた場合は?",
  "guide.shipping.branch.faq.5.a":
    "ヤマトは 1 個 30kg / 200 サイズが絶対上限で超過は不可。大型家具 / 楽器はヤマト「家財便」または日通「単身パック」へ、要予約、価格も高め。",

  "guide.shipping.branch.cta_next.title": "他の 2 ルートを見る",
  "guide.shipping.branch.cta_next.airport":
    "空港カウンター · 初心者向け",
  "guide.shipping.branch.cta_next.hotel":
    "ホテルフロント発送 · 最も手間なし",

  "guide.shipping.hotel.meta.title":
    "ホテルフロント代行発送 完全マニュアル · チェックアウト当日いちばん楽",
  "guide.shipping.hotel.meta.desc":
    "チェックアウト当日に荷物を運びたくない?ホテルフロントに発送代行を依頼しましょう。代行対応の確認方法、受取ホテルへの「気付」表記、送り状の書き方、支払い、よくあるトラブル対処。",
  "guide.shipping.hotel.h1":
    "③ ホテルフロント代行発送 · 完全な手順",
  "guide.shipping.hotel.intro":
    "チェックアウト当日いちばん楽な方法。フロントが送り状記入と支払いを代行、荷物を置いていくだけ。ただし**全ホテルが対応しているわけではない** —— 格安ビジネスやカプセル、民宿はしないことが多いので、予約前に確認を。",
  "guide.shipping.hotel.summary.cost": "¥2,000 〜",
  "guide.shipping.hotel.summary.eta": "翌日午後到着",
  "guide.shipping.hotel.summary.level": "難易度 ★☆☆ · 初心者向け",
  "guide.shipping.hotel.summary.best_for":
    "向いている人:チェーンビジネスホテル以上 / チェックアウト当日手ぶらで動きたい / ¥100–300 の手数料が気にならない旅行者。",

  "guide.shipping.hotel.precheck.title":
    "⚠️ 予約前に必ず確認を",
  "guide.shipping.hotel.precheck.body":
    "全ホテルが代行するわけではありません。カプセルホテル、ユースホステル、Airbnb、一部の格安チェーンは通常対応不可。予約前に JPLuggageGo の「ホテルチェーン代行ポリシー表」(/quote ページの下方)を確認するか、直接メール / 電話で「このホテルから宅急便は発送できますか?」と問い合わせる。",
  "guide.shipping.hotel.precheck.cta":
    "ホテルチェーン政策を確認 →",

  "guide.shipping.hotel.step_1.title":
    "チェックイン当日にひとこと確認",
  "guide.shipping.hotel.step_1.body":
    "チェックイン時についでに聞く:「明日、荷物を発送したいですが、お願いできますか?」。確認内容:(1) 代行対応の有無、(2) 現金のみかカード可、(3) どれくらい前に申告が必要か(多くはチェックアウト当日の申告で OK)。",
  "guide.shipping.hotel.step_2.title":
    "チェックアウト当日、荷物をフロントへ",
  "guide.shipping.hotel.step_2.body":
    "チェックアウト前にスーツケースをフロントへ運び、スタッフに:「チェックアウトと荷物の発送をお願いします」(チェックアウト + 荷物発送)と伝える。送り状を渡されます。",
  "guide.shipping.hotel.step_3.title":
    "送り状を書く(ホテル代行特有の注意点)",
  "guide.shipping.hotel.step_3.body":
    "重要なのは「お届け先」欄:「○○ホテル ○○様気付 ○○(自分の氏名)」。「気付」は「転送」の意 —— 日本の配送業者はこれを見て「ホテルに渡してほしい」と理解し、受取人本人を直接探さない。ホテル名は漢字、郵便番号 7 桁、住所は日本語版。ご依頼主欄は現在チェックアウトするホテルの住所を使う。",
  "guide.shipping.hotel.step_4.title":
    "計量 → 料金 → 支払い",
  "guide.shipping.hotel.step_4.body":
    "ホテルには小型秤があり、その場で料金通知(¥100–300 の手数料が上乗せされることが多いので、営業所持込より少し高い)。現金が主流、高級ホテルの一部は部屋料金にチャージしてカード可。¥5,000 現金を用意しておくと安心。",
  "guide.shipping.hotel.step_5.title":
    "レシート受取 → 出発",
  "guide.shipping.hotel.step_5.body":
    "ホテルから「ご依頼主控」(送り状控え)を渡されます、追跡番号記載。スマホで写真を撮り、現物は次のホテル到着まで保管。そのあとは手ぶらで出発、荷物はホテル+配送業者に任せて OK。",

  "guide.shipping.hotel.rules.title":
    "ホテル代行発送の特殊ルール",
  "guide.shipping.hotel.rules.1":
    "**受取ホテルには前日到着が必要**:次のホテル宛の荷物はヤマトの規則により「宿泊日の前日」までに到着しホテルで保管されなければなりません。当日チェックイン、当日到着だとヤマトに断られる可能性あり。",
  "guide.shipping.hotel.rules.2":
    "**「気付」の書き方を絶対間違えない**:「○○ホテル ○○様気付 ○○」。「気付」の 2 文字がないと、ホテルが他客宛と誤認し、取り違えや紛失のもと。",
  "guide.shipping.hotel.rules.3":
    "**受取のみ / 発送のみのホテルもあり**:チェーンポリシー表に各ホテルの状況を記載、確認してから予約を。",
  "guide.shipping.hotel.rules.4":
    "**貴重品 / 壊れ物 / 現金は自分で持つ**:ホテルは送り状に「貴重品 / 現金 / 電子機器は入っていない」確認書へのサインを求めることが多く、破損時の補償なし。",
  "guide.shipping.hotel.rules.5":
    "**ダンボールや袋は必ずしも用意されない**:スーツケースのまま送るのが最も楽、バラ荷物ならチェックアウト前にコンビニでダンボール購入を推奨。",

  "guide.shipping.hotel.phrases.title":
    "フロントでよく使う日本語 5 フレーズ",
  "guide.shipping.hotel.phrases.desc":
    "日本語が話せなくても大丈夫、スクリーンショットをフロントに見せるだけで伝わります。",
  "guide.shipping.hotel.phrases.1.jp":
    "明日、荷物を発送したいです。",
  "guide.shipping.hotel.phrases.1.romaji":
    "Ashita, nimotsu wo hassou shitai desu.",
  "guide.shipping.hotel.phrases.1.zh": "明日、荷物を発送したいです。",
  "guide.shipping.hotel.phrases.2.jp":
    "このホテルから宅急便は発送できますか?",
  "guide.shipping.hotel.phrases.2.romaji":
    "Kono hoteru kara takkyuubin wa hassou dekimasu ka?",
  "guide.shipping.hotel.phrases.2.zh":
    "このホテルから宅急便を発送できますか。",
  "guide.shipping.hotel.phrases.3.jp":
    "次のホテルまで送りたいです。",
  "guide.shipping.hotel.phrases.3.romaji":
    "Tsugi no hoteru made okuritai desu.",
  "guide.shipping.hotel.phrases.3.zh":
    "次のホテルまで送りたいです。",
  "guide.shipping.hotel.phrases.4.jp":
    "送り状の書き方を教えてください。",
  "guide.shipping.hotel.phrases.4.romaji":
    "Okurijou no kakikata wo oshiete kudasai.",
  "guide.shipping.hotel.phrases.4.zh":
    "送り状の書き方を教えてください。",
  "guide.shipping.hotel.phrases.5.jp":
    "現金とカード、どちらがいいですか?",
  "guide.shipping.hotel.phrases.5.romaji":
    "Genkin to kaado, dochira ga ii desu ka?",
  "guide.shipping.hotel.phrases.5.zh":
    "現金とカード、どちらがいいですか。",

  "guide.shipping.hotel.receive.title":
    "次のホテルに荷物が届いたあとは?",
  "guide.shipping.hotel.receive.body":
    "次のホテルフロントが受領し倉庫に保管。チェックイン時にフロントへ「荷物が届いているはずです」と伝え、レシートの追跡番号スクリーンショットを見せれば取ってきてくれます。一部は部屋へ運び入れ、一部はフロントで自分でサインして受取。",

  "guide.shipping.hotel.fare.title": "料金はどれくらい?",
  "guide.shipping.hotel.fare.intro":
    "以下は標準運賃(ヤマト クロネコ宅急便)。ホテル代行は基本原価、一部の高級ホテル(帝国、リッツ、ペニンシュラ)は手数料 ¥300–1,000 / 個を追加することあり。",

  "guide.shipping.hotel.trouble.title":
    "よくあるトラブル · 対処法",
  "guide.shipping.hotel.trouble.1.q":
    "ホテルが代行しないと言われた?",
  "guide.shipping.hotel.trouble.1.a":
    "営業所持込ルートに変更 —— このガイド下方にリンクあり。チェックアウト前にフロント経由でヤマト集荷を依頼(+¥30–60)も可、前夜までの予約が必要。",
  "guide.shipping.hotel.trouble.2.q":
    "ホテルが現金のみ、手持ち現金が足りない?",
  "guide.shipping.hotel.trouble.2.a":
    "チェックアウト前夜に最寄りコンビニの Seven ATM で引き出し。¥5,000–10,000 あれば 1–2 個の代行発送に十分。ホテルが辺鄙な場所でコンビニがなければ、フロントに部屋料金にチャージしてカード可か交渉(一部チェーンで可)。",
  "guide.shipping.hotel.trouble.3.q": "気付の表記を間違えた場合は?",
  "guide.shipping.hotel.trouble.3.a":
    "ホテルフロントが書き方をチェックしてくれます、書いたら見せて確認を依頼。本当に間違えて返送された場合は追跡番号でスマホ通知が来るので、ヤマト公式サイトで訂正申請 —— 配送業者が再配送します。",
  "guide.shipping.hotel.trouble.4.q":
    "次のホテルへのチェックイン時、荷物がまだ未着?",
  "guide.shipping.hotel.trouble.4.a":
    "追跡番号でヤマト公式サイトから現在状況を確認。多くは「配達中」で夕方前に到着します。ホテルはサインして保管、部屋の鍵がなくても大丈夫、後で取りに行けば OK。",
  "guide.shipping.hotel.trouble.5.q":
    "送った荷物をホテルが受け取っていないと言われた?",
  "guide.shipping.hotel.trouble.5.a":
    "極めてまれ。まず追跡番号でヤマトの配達記録を確認、「配達完了」表示なのにホテルが未受と言う場合は倉庫を探してもらう(チェックイン担当が登録を忘れていることが多い)。本当に紛失なら、レシートを最寄りヤマト営業所に持参するか 0120-01-9625 へ申告。",

  "guide.shipping.hotel.faq.title": "よくある質問",
  "guide.shipping.hotel.faq.1.q":
    "代行しないことが多いホテルは?",
  "guide.shipping.hotel.faq.1.a":
    "カプセルホテル(First Cabin、9hours)、ユースホステル、Airbnb、一部の格安ビジネス(Super Hotel 一部店舗、東横 INN 一部店舗)。チェーン政策表(/quote 参照)に 16 社の主要チェーンを整理、実測が合わなければユーザー報告を確認。",
  "guide.shipping.hotel.faq.2.q": "台湾へ送れる?",
  "guide.shipping.hotel.faq.2.a":
    "不可。ヤマト空港宅急便は日本国内配送のみ。台湾へは「国際宅急便」(ヤマト国際、日本郵便 EMS)を利用、価格が高く(¥5,000–15,000)、所要 3–7 日、通関申告が必要。スーツケースは直接航空機預入、または国内の次ホテルに保管が最も楽。",
  "guide.shipping.hotel.faq.3.q":
    "次のホテルにまだチェックインしていないが、先に荷物を送れる?",
  "guide.shipping.hotel.faq.3.a":
    "多くのチェーンは可(APA、東横 INN、三井ガーデン など)、格安やブティックは電話で確認が必要なことあり。ユーザー報告表で実測を確認可。送り状備考欄に「宿泊日:YYYY/MM/DD」と明記しホテルに伝えるとスムーズ。",
  "guide.shipping.hotel.faq.4.q":
    "ホテル代行は手数料が発生する?",
  "guide.shipping.hotel.faq.4.a":
    "大半のホテルは**手数料無料**、ヤマト / 佐川の運賃のみ徴収(ただし営業所価より少し高く、差額が実質サービス料)。一部の高級ホテル(帝国、ペニンシュラ)は ¥200–500 の手数料を追加することあり。",
  "guide.shipping.hotel.faq.5.q":
    "チェックアウト後に届いた荷物をホテルに戻して保管してもらえる?",
  "guide.shipping.hotel.faq.5.a":
    "不可、チェックアウト後はホテルに荷物保管義務なし。戻すには事前にホテルと「再度宿泊予定」(再チェックイン予約)を調整。より簡単な方法:次のホテルへ送る、または ecbo Cloak / LuggAgent などの有料手荷物預けサービスへ。",

  "guide.shipping.hotel.cta_next.title": "他の 2 ルートを見る",
  "guide.shipping.hotel.cta_next.airport":
    "空港カウンター · 初心者向け",
  "guide.shipping.hotel.cta_next.branch":
    "営業所へ持ち込み · 最安",
};

const EN: Dict = {
  "site.brand": "JPLuggageGo",
  "site.tagline": "Japan luggage forwarding comparison",
  "nav.home": "Home",
  "nav.quote": "Get a quote",
  "lang.notice": "",

  "hero.title.line1": "Japan luggage forwarding",
  "hero.title.line2": "fare comparison tool",
  "hero.lead":
    "We compile fares, transit days, and hotel handling rules for Yamato, Sagawa, Japan Post, and ecbo cloak — then plan each day's luggage route along your hotel itinerary.",
  "hero.free":
    "Free. All we ask: after your trip, rate the branches, hotel desks, and ecbo spots you used so the next traveller doesn't hit the same pitfalls.",
  "hero.cta.quote": "Compare fares →",
  "hero.cta.trip": "Plan multi-leg trip →",
  "hero.chip.coverage": "Yamato × Japan Post · all 47 prefectures",
  "hero.chip.line": "LINE official account: coming soon",

  "home.popular.header": "Popular routes",
  "home.popular.col.route": "Route",
  "home.popular.col.diff": "Diff",
  "home.popular.footer":
    "Fares shown are per-prefecture base rates — early-morning / late-night / remote-island surcharges not included. Yamato offers Kuroneko Members discount; Japan Post offers a ¥120 drop-off discount. Click any row to change the destination.",
  "home.popular.diff.equal": "Same",
  "home.popular.diff.yamato_save": "Yamato saves ¥{amount}",
  "home.popular.diff.yuu_save": "Japan Post saves ¥{amount}",

  "home.route.nrt_tokyo.sub": "Narita → Tokyo hotels",
  "home.route.hnd_tokyo.sub": "Haneda → Tokyo hotels",
  "home.route.kix_osaka.sub": "Kansai → Osaka hotels",
  "home.route.kix_kyoto.sub": "Kansai → Kyoto hotels",
  "home.route.cts_hokkaido.sub": "New Chitose → Sapporo hotels",
  "home.route.fuk_fukuoka.sub": "Fukuoka → Hakata hotels",
  "home.route.tokyo_osaka.sub": "Hotel → hotel · cross-city",
  "home.route.tokyo_fukuoka.sub": "Hotel → hotel · long haul",

  "flight.title": "Shipping countdown · how many days before you fly home?",
  "flight.disclaimer": "Estimate excludes public holidays and typhoon delays",
  "flight.flight_date": "Return flight date",
  "flight.remote_check": "Shipping from Hokkaido / Okinawa / remote islands",
  "flight.urgency.past": "Past the latest ship-by date",
  "flight.urgency.red": "Urgent · ship today or tomorrow",
  "flight.urgency.amber": "A few days left · ship soon",
  "flight.urgency.green": "Plenty of time",
  "flight.recommend": "Suggested ship date:",
  "flight.latest": "Latest ship date:",
  "flight.days_until": "{n} days from today",
  "flight.pickup_cutoff": "pick up by 16:00",
  "flight.remote_hint":
    "Hokkaido / Okinawa / remote islands typically take two days with Yamato or Japan Post. Ship 3 days before departure; pickup no later than 16:00, 2 days before.",
  "flight.mainland_hint":
    "Honshu / Shikoku / Kyushu are usually next-day. Ship 2 days before departure; pickup no later than 16:00, 1 day before.",
  "flight.hotel_tail":
    "Hotel desks and convenience stores each have their own drop-off cutoffs — the later you leave it, the tighter it gets.",
  "flight.no_date_hint":
    "Enter your return flight date and we'll work out when to ship your bags (Yamato / Japan Post deliver next day or the day after). Avoid arriving at the airport before your luggage — or flying out with bags still sitting around.",

  "quote.title": "Airport / hotel luggage forwarding comparison",
  "quote.sub_desc":
    "Ship from either airport or hotel. Yamato vs Japan Post fares by prefecture. Oversize / remote island / Hokkaido / Okinawa surcharges may apply at the counter.",
  "quote.form.from": "From",
  "quote.form.from.airport": "Airport counter",
  "quote.form.from.pref": "Prefecture (hotel / branch)",
  "quote.form.from.placeholder": "Select origin",
  "quote.form.to": "To",
  "quote.form.to.placeholder": "Select destination prefecture",
  "quote.form.size": "Size",
  "quote.form.size.placeholder": "Select size",
  "quote.form.ship_date": "Ship date",
  "quote.form.pieces": "Pieces",
  "quote.form.pieces.hint": "(same dest · Japan Post 2+ pcs = −¥60/pc)",
  "quote.form.pieces.unit": "pcs",
  "quote.form.submit": "Compare fares",
  "quote.form.from_mode.airport": "🛬 Airport counter",
  "quote.form.from_mode.pref": "📍 Prefecture",
  "quote.form.from_mode.address": "🏨 Address / hotel",
  "quote.form.from_address_placeholder":
    "e.g. Hotel Nikko Niigata / 35.6762, 139.6503 / Google Maps link",
  "quote.form.from_address_hint":
    "Accepts Japanese address (most precise), Google Maps link, coordinates, or romaji address with postal code. Origin prefecture is inferred from the nearest Yamato branch.",
  "quote.form.to_address_placeholder":
    "e.g. Hotel Nikko Niigata / 35.6762, 139.6503 / Google Maps link",
  "quote.form.to_address_hint":
    "Same formats as above. Destination prefecture is inferred from the nearest Yamato branch.",
  "quote.form.to_pref_fallback_summary":
    "No specific address? Get a rough estimate by prefecture ▾",
  "quote.form.to_pref_fallback_placeholder":
    "— Skip, use the address above —",
  "quote.result.from_address_fail":
    "Origin address not resolvable. Try a full Japanese address, Google Maps link, or coordinates.",
  "quote.result.to_address_fail":
    "Destination address not resolvable. Falling back to prefecture estimate. Try a full Japanese address, Google Maps link, or coordinates for precision.",
  "quote.result.from_resolved_as": "Origin resolved as",
  "quote.result.to_resolved_as": "Destination resolved as",
  "quote.result.from_yamato_header": "Yamato branches near origin (5 nearest)",
  "quote.result.from_yuu_header": "Japan Post near origin (5 nearest)",
  "quote.result.to_yamato_header": "Yamato branches near destination (5 nearest)",
  "quote.result.to_yuu_header": "Japan Post near destination (5 nearest)",

  "quote.size_help.summary": "Luggage size chart · not sure which size?",
  "quote.size_help.aria_label": "Luggage size scale",
  "quote.size_help.body":
    "Size = length + width + height (cm) of your bag. Example: a 29″ hard-shell at 50×30×78 ≈ size 160; a 24″ soft case at 45×30×67 ≈ size 140. Yamato and Japan Post both cap at size 160 — ship oversized bags in multiple pieces.",

  "quote.sameday.tagline": "Same-day delivery",
  "quote.sameday.official": "Fare estimate →",
  "quote.sameday.description":
    "Yamato and Japan Post deliver next day; Airporter delivers same day — the only option if you want your bags before hotel check-in. Outside the service area, use Yamato or Japan Post below.",

  "quote.no_route": "No fare for this route",
  "quote.no_multi_discount": "no multi-piece discount",
  "quote.rate_updated": "· rates updated {date}",
  "quote.arrival_label": "Arrives",
  "quote.ship_plus_days": "· {n} day(s) after ship",
  "quote.pieces_of": "¥{price} × {pieces} pcs",
  "quote.counters_title": "Accepting counters ({n})",
  "quote.counter.detail": "details",
  "quote.counter.reception": "Reception",
  "quote.counter.navidial": "Navi Dial",
  "quote.pref.yamato.branches_title": "{pref} Yamato branches ({n})",
  "quote.pref.yamato.weekday": "Weekdays",
  "quote.pref.yamato.with_branches":
    "Most hotel desks can hand your bag to Yamato. You can also call pickup at 0120-01-9625 (Japanese only), or use the ",
  "quote.pref.yamato.branch_search": "branch locator",
  "quote.pref.yamato.submit_tail": ".",
  "quote.pref.yamato.no_branches":
    "Shipping from a hotel: most front desks accept Yamato. You can also call pickup at 0120-01-9625 (Japanese only) or drop off via the branch locator.",
  "quote.multi_discount_label": "multi-piece discount",
  "quote.yuu.counters_title": "Airport Yu-Pack counters ({n})",
  "quote.yuu.official_list": "Official list →",
  "quote.yuu.airport_no_counter":
    "This airport has no Airport Yu-Pack counter. Ship from a nearby post office, or ask the hotel to call pickup at 0800-0800-111.",
  "quote.yuu.pref_note":
    "About 24,000 post offices accept drop-offs; most hotel desks can hand it off too. Pickup line: 0800-0800-111 (Japanese only). Drop-off at a post office saves ¥120.",

  "quote.diff.tie": "Same price: ¥{amount}",
  "quote.diff.yamato_cheaper": "Yamato is ¥{amount} cheaper than Japan Post",
  "quote.diff.yuu_cheaper": "Japan Post is ¥{amount} cheaper than Yamato",
  "quote.diff.pieces_suffix": " ({pieces} pcs total)",
  "quote.diff.pieces_multi_yuu":
    " ({pieces} pcs total, incl. multi-piece discount -¥{discount})",
  "quote.diff.surcharge_note":
    "※ Fares exclude early-morning / late-night / remote-island surcharges. Yamato offers Kuroneko Members discounts; Japan Post offers a ¥120 drop-off discount. For 2+ pieces to the same address, Japan Post applies a multi-piece discount of −¥60/pc (already factored in). Final charges per receipt.",

  "quote.footer":
    "Sources: Yamato (kuronekoyamato.co.jp) fare tables, Japan Post (post.japanpost.jp) Yu-Pack rates, and Yamato airport counter lists. Last update per the scraped_at field. This page is a fare comparison — we do not handle shipments.",

  "hotel.section.title": "💼 Hotel luggage handling by chain",
  "hotel.section.general_note":
    "Most chain business hotels in Japan accept incoming Yamato / Japan Post parcels, and guests can fill out shipping forms at the front desk. Pre-check-in holds (bags arriving before you do) vary by property — email the hotel at least a week ahead. Post-check-out same-day shipping to the airport is usually fine.",
  "hotel.section.disclaimer":
    "Chain-level general policies — individual properties may differ. Cash-on-delivery is usually not accepted, so pay at pickup.",
  "hotel.table.col.chain": "Chain",
  "hotel.table.col.receive": "Receive",
  "hotel.table.col.send": "Send",
  "hotel.table.col.precheckin": "Pre-check-in",
  "hotel.table.col.note": "Note",
  "hotel.table.tooltip.receive": "Receive on behalf of a guest",
  "hotel.table.tooltip.send": "Ship on behalf of a guest",
  "hotel.table.tooltip.precheckin": "Arriving before check-in",
  "hotel.legend.yes": "Usually yes",
  "hotel.legend.case": "Varies",
  "hotel.legend.check": "Check first",
  "hotel.note.apa":
    "Large properties often have dedicated shipping desks; call ahead for pre-check-in holds",
  "hotel.note.toyoko_inn":
    "Yamato widely accepted; ship before check-out to be safe",
  "hotel.note.dormy_inn":
    "Onsen-style business hotels; front desks are relatively flexible",
  "hotel.note.mitsui_garden":
    "Central-city properties; pre-check-in arrivals usually accepted",
  "hotel.note.nishitetsu": "Main chain across Fukuoka / Kyushu",

  "airporter.price_note":
    "From ¥2,000/piece · varies by size and time slot · check the official site for exact fares",
  "airporter.sameday_window":
    "Drop off at the hotel desk by 09:00 → pick up after 16:00 at the airport or next hotel",
  "airporter.note.nrt_t2": "NRT: Terminal 2 only",

  "payment.yamato.airport.tip":
    "Most airport counters accept transit IC cards, PayPay, and d-barai",
  "payment.yamato.branch.tip":
    "Branch offices mostly take cash; Kuroneko Members (prepaid) saves 10–15%. Hotel desks usually need cash or the hotel fronts it",
  "payment.yuu.airport.tip":
    "Airport Yu-Pack counters are usually cash-only — have coins ready",
  "payment.yuu.postoffice.tip":
    "Medium to large post offices take credit cards, transit IC, and Yucho Pay. Drop-off saves ¥120",

  "share.copy": "Copy link",
  "share.copied": "Copied",
  "share.line": "Share on LINE",

  "route.title":
    "{from} → {to} Luggage Forwarding Price Comparison · 6 sizes Yamato vs Yu-Pack",
  "route.desc":
    "{from} → {to} live Yamato vs Japan Post Yu-Pack fares across 6 sizes, airport drop-off counters, and transit days · JPLuggageGo",
  "route.h1": "{from} → {to} Fare Comparison",
  "route.breadcrumb.routes": "Popular Routes",
  "route.section.prices": "6-Size Fare Comparison",
  "route.section.send_methods": "How to Ship",
  "route.section.transit": "Transit Time",
  "route.col.size": "Size",
  "route.updated": "Data updated {date}",
  "route.prices.footer":
    "Fares are at prefecture granularity and exclude early-morning, late-night, and remote-island surcharges. Use the button below to customize destination, size, and ship date for arrival estimates.",
  "route.transit.body":
    "Yamato about {yamato} day(s), Yu-Pack about {yuu} day(s). Within Honshu it's usually next-day; Okinawa routes are air-only and take 2-4 days.",
  "route.transit.footer":
    "Actual transit depends on drop-off time, weather, and hotel counter hours. Confirm with the carrier on the day.",
  "route.send.yamato_airport": "{airport} · Yamato drop-off counter",
  "route.send.yuu_airport": "{airport} · Yu-Pack airport counter",
  "route.send.airporter_title":
    "Airporter same-day delivery (the only same-day option)",
  "route.send.airporter_body":
    "Airporter can move luggage from {airport} to {to} on the same day — ideal if you want to check in right after landing.",
  "route.send.pref_body":
    "From {from} you can drop off at any Yamato branch office, post office, or most hotel front desks. Use the tool below for a custom quote.",
  "route.cta.kicker": "Want a different destination or size?",
  "route.cta.title": "Run a custom Yamato vs Yu-Pack quote",
  "route.cta.button": "Open the quote tool →",
  "route.related": "Other popular routes",

  "nav.faq": "FAQ",
  "faq.meta.title": "FAQ · Yamato vs Yu-Pack luggage forwarding",
  "faq.meta.desc":
    "Common questions about airport/hotel luggage forwarding in Japan: size chart, hotel acceptance, transit days, oversized luggage, payment methods.",
  "faq.title": "Frequently Asked Questions",
  "faq.intro":
    "Six common questions about shipping luggage to or from Japanese airports and hotels. Jump straight to /quote for a live price.",
  "faq.cta": "Get a quote →",
  "faq.q1": "Which size should I choose for a 29-inch suitcase?",
  "faq.a1":
    "Size 160 (sum of length+width+height ≤ 160 cm, weight ≤ 25 kg). A 26-inch usually fits size 140, a 24-inch size 120, and a 21-inch size 100.",
  "faq.q2": "Will the hotel refuse to accept the delivery?",
  "faq.a2":
    "Major chains (APA, Toyoko Inn, Dormy Inn, Mitsui Garden, Nishitetsu Inn) accept pre-notified luggage forwarding. Refrigerated items and ID-restricted parcels are exceptions. See the hotel forwarding policy table on /quote for details.",
  "faq.q3": "How long does delivery take?",
  "faq.a3":
    "Within Honshu: next day. Hokkaido ↔ Kyushu crossings: 1–2 days. Okinawa routes are air-only, 2–4 days. Yamato and Yu-Pack deliver in about the same time, and both are equally affected by weather delays.",
  "faq.q4": "Can I ship luggage larger than size 160?",
  "faq.a4":
    "Yamato caps at size 160. For bigger items, switch to 'Yamato Bin' (freight-class, 2–3 days) or split into two packages. Yu-Pack also caps at size 160 with a 30 kg weight limit.",
  "faq.q5": "Can I drop off luggage directly at the airport?",
  "faq.a5":
    "Major international airports (NRT, HND, KIX, CTS, FUK, NGO, KIJ, SDJ, and more) have Yamato drop-off counters, most open 24/7 or from early morning to late night. Yu-Pack uses on-site post office counters with shorter hours.",
  "faq.q6": "I can't find the route I need.",
  "faq.a6":
    "Visit /quote and pick any two of the 47 prefectures for an instant fare. Both Yamato and Yu-Pack have a complete 47×47 matrix.",

  // Drop-off list rendering — shared by /quote address mode via YamatoList / YuuList
  "nearby.result.empty": "No drop-offs in this radius. Try widening the search.",
  "nearby.result.distance": "{v} away",
  "nearby.result.hours": "Weekdays {v}",
  "nearby.result.navigate": "🗺️ View on Google Maps",
  "nearby.result.fallback_note":
    "⚠️ Exact address not in OSM. Searched using \"{query}\" (city/ward centroid). Not your exact building, but nearest branches are still useful.",

  // Trip planner
  "nav.trip": "Multi-leg",
  "trip.meta.title": "Multi-leg luggage plan · JPLuggageGo",
  "trip.meta.desc":
    "Plan a trip like D1 Tokyo → D3 Kyoto → D5 Osaka and get per-leg ship dates, fares, and Yamato vs Yu-Pack comparison.",
  "trip.title": "Multi-leg luggage plan",
  "trip.sub":
    "Enter each stay (check-in/out, prefecture, luggage count) and we'll compute per-leg ship date, arrival date, cheaper carrier, and total cost in one view.",
  "trip.stay.header": "Stay {n}",
  "trip.stay.here_label": "🏠 You stay here",
  "trip.stay.label": "Hotel / lodging (optional, for display)",
  "trip.stay.checkin": "Check-in",
  "trip.stay.checkout": "Check-out",
  "trip.stay.prefecture": "Prefecture (optional — auto-resolved from address)",
  "trip.stay.pref_placeholder": "Pick one, or leave blank to auto-resolve",
  "trip.stay.baggage": "Luggage (count per size)",
  "trip.stay.baggage_count": "pcs",
  "trip.stay.address": "Address of this stay (pickup origin — skips needing prefecture)",
  "trip.stay.address_placeholder": "e.g., 572 Gionmachi-Minamigawa, Higashiyama-ku, Kyoto",
  "trip.stay.ship_day_before": "Ship the night before (hand parcel to front desk)",
  "trip.stay.ship_day_before_hint": "Requires 2+ nights. Parcel arrives next stay by 16:00 — leave hotel hands-free on checkout day.",
  "trip.stay.ship_day_before_tip_aria": "See which lodging types support this",
  "trip.stay.ship_day_before_tip_title": "Which lodging types support this?",
  "trip.stay.ship_day_before_tip_chain": "Chain hotels (APA, Toyoko Inn, Richmond, etc.): front desk almost always handles it ✓",
  "trip.stay.ship_day_before_tip_ryokan": "Independent / onsen ryokan: usually yes — call ahead to confirm",
  "trip.stay.ship_day_before_tip_airbnb": "Airbnb / homestay: usually no (host not on-site) → drop parcel at a convenience store on checkout day",
  "trip.stay.nearby_show": "Show nearby drop-off points",
  "trip.stay.nearby_hide": "Hide",
  "trip.stay.nearby_loading": "Loading…",
  "trip.stay.nearby_yamato": "Nearby Yamato branches",
  "trip.stay.nearby_yuu": "Nearby post offices",
  "trip.stay.brand_ok": "Confirmed forwarding ✓",
  "trip.stay.brand_check": "Usually OK — call ahead to confirm",
  "trip.stay.brand_unknown": "Unknown brand — please verify yourself",
  "trip.stay.add": "+ Add stay",
  "trip.stay.remove": "Remove stay",
  "trip.arrival.label":
    "Arrival airport (optional — ship straight from airport to stay #1)",
  "trip.arrival.placeholder": "Not shipping from airport",
  "trip.departure.label":
    "Departure airport (optional — last leg ships to airport counter)",
  "trip.departure.placeholder": "No airport",
  "trip.submit": "Build delivery plan",
  "trip.validation.min_stays": "Need at least 2 stays",
  "trip.validation.invalid_date": "Check-in must be before check-out",
  "trip.validation.stay_missing_loc": "Each stay needs either a prefecture or an address",
  "trip.validation.pref_unresolved": "Could not resolve a prefecture from the address — please pick one from the dropdown.",
  "trip.result.header": "Delivery plan",
  "trip.result.leg": "Leg {n}",
  "trip.result.skipped_same_city":
    "Same-day, same prefecture — hand-carry recommended, no delivery needed",
  "trip.result.skipped_no_baggage": "No luggage declared — skipped",
  "trip.result.ship_date": "Ship",
  "trip.result.arrive_date": "Arrive",
  "trip.result.day_before": "Pre-ship",
  "trip.result.day_before_fallback": "Only 1 night — fell back to same-day shipping",
  "trip.result.route": "Route",
  "trip.result.baggage": "Luggage",
  "trip.result.yamato": "Yamato",
  "trip.result.yuu": "Yu-Pack",
  "trip.result.cheaper_yamato": "Yamato saves ¥{v}",
  "trip.result.cheaper_yuu": "Yu-Pack saves ¥{v}",
  "trip.result.tie": "Tie",
  "trip.result.total": "Trip total",
  "trip.result.total_note":
    "Total uses the cheaper carrier per leg. Assumes next-day 16:00 arrival (standard express, non-remote-island).",
  "trip.result.gap":
    "⚠️ Some legs are missing fare data (likely same-prefecture rows absent from TK.json) — excluded from total.",
  "trip.gantt.title": "Trip timeline",
  "trip.gantt.stay": "Stay",
  "trip.gantt.ship": "Ship",
  "trip.gantt.arrive": "Arrive",
  "trip.print.hint": "Print from the browser (Cmd/Ctrl + P) or save as PDF — the form is auto-hidden.",
  "trip.empty":
    "Add at least 2 stays above and the delivery plan will appear here.",

  "home.help.guide":
    "Beginner guide · Airport counter / branch office / hotel forwarding — three routes, step by step",
  "home.help.faq":
    "FAQ · Fares, transit times, payment methods, surcharge rules",

  "quote.guide_banner.tag": "Beginner guide",
  "quote.guide_banner.title":
    "First time shipping luggage in Japan? Walk through the process once",
  "quote.guide_banner.cta": "See the full walkthrough →",

  "guide.shipping.meta.title":
    "Complete guide to 3 luggage-shipping routes in Japan · Even first-time travellers can do it",
  "guide.shipping.meta.desc":
    "Step-by-step walkthroughs for shipping luggage via airport counter, Yamato branch office, or hotel forwarding. What to prepare, how to talk to the counter, fares, transit times, and common snags. For travellers on their first trip to Japan.",
  "guide.shipping.breadcrumb": "Guides · Luggage shipping",
  "guide.shipping.h1": "How to ship luggage? Three routes explained",
  "guide.shipping.intro":
    "Changing hotels in Japan is a lot easier when you ship your luggage instead of dragging a 29\" suitcase around. But what actually happens at the counter, how to communicate, which form to fill out, how much it costs — it's daunting the first time. This guide breaks each of the three routes into \"what to prepare → what to do on site → what to do if you get stuck.\" Follow it step by step and you'll be fine.",

  "guide.shipping.pick.title": "Quick pick · Which route is right for you?",
  "guide.shipping.pick.subtitle":
    "One-minute check based on where you are and where you're going next.",
  "guide.shipping.pick.airport.label": "Just landed, heading to the hotel",
  "guide.shipping.pick.airport.value":
    "Airport counter (easiest — strongly recommended for beginners)",
  "guide.shipping.pick.branch.label":
    "In the city / hotel, want to forward to your next hotel",
  "guide.shipping.pick.branch.value":
    "Drop off at a branch office (cheapest)",
  "guide.shipping.pick.hotel.label":
    "Checking out today, too tired to carry luggage",
  "guide.shipping.pick.hotel.value":
    "Hotel front desk forwarding (least effort)",
  "guide.shipping.pick.departure.label":
    "Heading home — want to go to the airport hands-free",
  "guide.shipping.pick.departure.value":
    "See airport counter → departure-day section",

  "guide.shipping.cards.title": "Detailed walkthrough · three routes",
  "guide.shipping.cards.desc":
    "Tap a card below for the full steps, Japanese phrases for on-site use, and common-snag fixes.",

  "guide.shipping.card.airport.title": "① Airport counter",
  "guide.shipping.card.airport.scenario":
    "Hand luggage off at the airport on arrival or departure day. Yamato Kuroneko and JAL ABC counters handle everything on the spot, with staff helping you fill out the form. Friendliest option for beginners.",
  "guide.shipping.card.airport.meta_cost": "From ¥1,800",
  "guide.shipping.card.airport.meta_eta": "Next-day afternoon",
  "guide.shipping.card.airport.meta_level": "Beginner-friendly",

  "guide.shipping.card.branch.title": "② Drop off at branch",
  "guide.shipping.card.branch.scenario":
    "Bring your luggage yourself to the nearest Yamato / Sagawa branch. Cheapest option — a ¥100 \"drop-off discount\" applies. You fill out the airway bill yourself or use the official app to prefill, so a little Japanese helps.",
  "guide.shipping.card.branch.meta_cost": "From ¥1,500",
  "guide.shipping.card.branch.meta_eta": "Next day",
  "guide.shipping.card.branch.meta_level": "Some Japanese",

  "guide.shipping.card.hotel.title": "③ Hotel front desk forwarding",
  "guide.shipping.card.hotel.scenario":
    "On checkout day, hand your luggage to the front desk — the hotel arranges a partner courier. Least effort, but not every hotel does this. Budget hotels and capsule hotels often refuse, so check before you book.",
  "guide.shipping.card.hotel.meta_cost": "From ¥2,000",
  "guide.shipping.card.hotel.meta_eta": "Next-day afternoon",
  "guide.shipping.card.hotel.meta_level": "Beginner-friendly",

  "guide.shipping.card.cta": "See the full walkthrough →",

  "guide.shipping.prep.title":
    "Shared across all three routes · What to prepare before you leave",
  "guide.shipping.prep.1.title": "Hotel address in Japanese",
  "guide.shipping.prep.1.desc":
    "Look up the Japanese version in your booking confirmation email (hotel name in kanji + prefecture + city/ward + address + 7-digit postal code). Or search the hotel on Google Maps and copy the Japanese address. Print it or save a screenshot.",
  "guide.shipping.prep.2.title": "Hotel phone number",
  "guide.shipping.prep.2.desc":
    "In your booking email. Format: +81-3-XXXX-XXXX or 03-XXXX-XXXX. The counter will put it on the airway bill so the courier can call the hotel if anything goes wrong.",
  "guide.shipping.prep.3.title": "Passport",
  "guide.shipping.prep.3.desc":
    "Yamato's official policy requires ID when picking up at the airport counter. Not strictly required for hotel forwarding or branch drop-off, but it's still a good idea to carry it.",
  "guide.shipping.prep.4.title": "Japanese yen cash (¥5,000–10,000)",
  "guide.shipping.prep.4.desc":
    "Hotels and small branches often only take cash. Airport counters and large branches do accept cards, but having cash ready is safest. A large suitcase typically costs ¥1,500–4,000.",
  "guide.shipping.prep.5.title": "Suitcase cover (optional)",
  "guide.shipping.prep.5.desc":
    "Yamato officially recommends a cover to reduce scratches. Airport convenience stores and Don Quijote sell them for about ¥1,000–2,000. You can skip it, but scratches are on you.",

  "guide.shipping.aftercard.title": "Done reading? Try the estimator",
  "guide.shipping.aftercard.desc":
    "Head back to /quote, enter your origin and destination, and compare real fares from all three couriers.",
  "guide.shipping.aftercard.cta": "Back to the estimator →",

  "guide.shipping.sources.title": "Sources (verified April 2026)",
  "guide.shipping.sources.yamato_airport": "Yamato Airport Takkyubin",
  "guide.shipping.sources.yamato_flow_faq":
    "Yamato FAQ: how to use and pricing",
  "guide.shipping.sources.jalabc": "JAL ABC Airport Delivery",
  "guide.shipping.sources.yamato_send": "Yamato: how to send Takkyubin",
  "guide.shipping.sources.yamato_hotel":
    "Yamato FAQ: shipping to hotels / ryokan",
  "guide.shipping.sources.verified_at":
    "Links verified on the date above. Fares, transit times, and counter locations can change — follow the on-site signage.",

  "guide.shipping.airport.meta.title":
    "Complete airport-counter luggage guide · Arrival day + departure day",
  "guide.shipping.airport.meta.desc":
    "First time in Japan — how do you ship luggage from the airport to your hotel? How do you go hands-free to the airport on your departure day? Step-by-step walkthroughs for Yamato Kuroneko and JAL ABC counters, with Japanese phrases, common snags, and a packing list.",
  "guide.shipping.airport.h1": "① Airport counter · Full walkthrough",
  "guide.shipping.airport.intro":
    "Every major international airport in Japan has dedicated shipping counters. The two biggest are Yamato Kuroneko's \"Airport Takkyubin\" and JAL ABC's \"Airport Delivery.\" Ship to your hotel on arrival day, or reverse it — drop off the day before departure and pick up at the airport on your flight day. English-speaking staff are on hand, making it the friendliest option if you don't speak Japanese.",
  "guide.shipping.airport.summary.cost":
    "Cost ¥1,800–3,500 per item (depends on size and distance)",
  "guide.shipping.airport.summary.eta":
    "Transit: next-day afternoon (remote islands 2–3 days)",
  "guide.shipping.airport.summary.level":
    "Difficulty ★☆☆ · Beginner-friendly",
  "guide.shipping.airport.summary.best_for":
    "Best for: travellers who just landed and want to take the train hands-free, who don't want to drag luggage to the airport on departure day, or who don't speak any Japanese.",

  "guide.shipping.airport.arrival.title": "A · Arrival day → hotel",
  "guide.shipping.airport.arrival.intro":
    "After collecting your luggage and clearing customs, head straight to the shipping counter. The whole thing takes 15–30 minutes in the airport; after that you can take the train, bus, or taxi to your hotel with no luggage. Delivery is usually next-day afternoon.",
  "guide.shipping.airport.arrival.step_1.title":
    "Deplane → collect luggage → clear customs",
  "guide.shipping.airport.arrival.step_1.body":
    "Follow the \"Arrival / 到着\" signs. After customs you'll reach the Arrival Lobby (到着ロビー) — the shipping counters are on that floor.",
  "guide.shipping.airport.arrival.step_2.title":
    "Find the shipping counter",
  "guide.shipping.airport.arrival.step_2.body":
    "In the arrival lobby, look for signs reading 手荷物配送, 空港宅配, or Baggage Delivery. Yamato and JAL ABC counters are usually side by side (Narita T1/T2, Haneda T2/T3, Kansai T1 are all like this). If you can't find them, ask the Information Counter and they'll walk you over.",
  "guide.shipping.airport.arrival.step_3.title":
    "Queue up → state your request",
  "guide.shipping.airport.arrival.step_3.body":
    "When it's your turn, show the staff your hotel details on your phone (Japanese address, phone, booking number). English-speaking staff will ask \"Where to?\" — reply \"Ship to this hotel.\" In Japanese: \"このホテルまで荷物を送りたいです.\"",
  "guide.shipping.airport.arrival.step_4.title":
    "Fill out the airway bill (送り状)",
  "guide.shipping.airport.arrival.step_4.body":
    "The counter will hand you a three-ply carbon form. Key fields: the sender (ご依頼主) is your name and mobile; the recipient (お届け先) is the most important — hotel name in kanji, recipient line reads \"○○様気付 ○○\" (気付 = c/o), plus hotel phone and postal code. Staff usually fills in the critical fields for you. Budget 5–10 minutes for this.",
  "guide.shipping.airport.arrival.step_5.title":
    "Weigh in → get quoted",
  "guide.shipping.airport.arrival.step_5.body":
    "The counter weighs your luggage and quotes the fare. Yamato's limits: total of the three sides ≤160cm and ≤30kg. Anything heavier is refused outright — split into two pieces on the spot (you can buy a bag at the counter).",
  "guide.shipping.airport.arrival.step_6.title": "Pay",
  "guide.shipping.airport.arrival.step_6.body":
    "Yamato counters accept cash, credit cards (Visa/Mastercard/JCB/Amex), transit IC cards (Suica/Pasmo/ICOCA), PayPay, and d-barai. JAL ABC takes cash, credit cards, and e-money but not QR-code payments. If you want to use a card, say \"クレジットカードで\" upfront.",
  "guide.shipping.airport.arrival.step_7.title": "Keep the receipt",
  "guide.shipping.airport.arrival.step_7.body":
    "You'll get a sender copy (ご依頼主控). This is your tracking slip — it has a 12-digit 問合せ番号 (tracking number). Take a photo and keep the physical slip until you confirm the delivery. Track online on Yamato's site using that number.",
  "guide.shipping.airport.arrival.step_8.title":
    "Leave the airport hands-free",
  "guide.shipping.airport.arrival.step_8.body":
    "Done! Now take the train to the hotel. Luggage usually arrives at the hotel front desk between 14:00–18:00 the next day and the hotel holds it. When you check in, say \"私宛の荷物がありますか\" (do I have luggage waiting?) and they'll bring it.",

  "guide.shipping.airport.departure.title": "B · Departure day → airport",
  "guide.shipping.airport.departure.warning":
    "⚠️ Important: airport Takkyubin must arrive at the airport counter the day BEFORE your flight. Same-day shipping won't make it. Ship from your hotel or a branch the day before. The Kanto / Kansai areas reach next-day; Hokkaido / Kyushu / Okinawa need 2–3 days.",
  "guide.shipping.airport.departure.intro":
    "The reverse flow: ship your luggage from a hotel or branch to the \"departure airport counter,\" then pick it up at the airport on flight day and check in. You get to skip dragging luggage to the airport. Two shipping options.",
  "guide.shipping.airport.departure.hotel.title":
    "Option 1 · Ship from the hotel (easiest)",
  "guide.shipping.airport.departure.hotel.step_1":
    "The day before checkout, tell the front desk: \"明日、○○空港カウンターまで荷物を送りたいです.\" They'll bring you an airway bill.",
  "guide.shipping.airport.departure.hotel.step_2":
    "Fill out the form. In the recipient field write \"○○空港カウンター気付 ○○ (your name).\" Add your airline and flight number (e.g. JAL123) and planned flight date.",
  "guide.shipping.airport.departure.hotel.step_3":
    "Pay (mostly cash, some hotels take cards) and take the receipt. That receipt is your pickup proof on flight day — keep it safe.",
  "guide.shipping.airport.departure.hotel.step_4":
    "On flight day, arrive 2–3 hours early, go to the shipping counter first to pick up, then check in. Yamato's rule: pickup is allowed between 3 hours and 1 hour before your flight.",
  "guide.shipping.airport.departure.branch.title":
    "Option 2 · Ship from a Yamato branch",
  "guide.shipping.airport.departure.branch.step_1":
    "The day before, carry your luggage yourself to the nearest Yamato branch (search \"ヤマト運輸 営業所\" on Google Maps).",
  "guide.shipping.airport.departure.branch.step_2":
    "Fill out the form on site (or prefill via the app). Recipient: \"○○空港カウンター気付.\" You get the ¥100 drop-off discount.",
  "guide.shipping.airport.departure.branch.step_3":
    "Pay and take the receipt. Pick up at the airport counter on flight day — same as Option 1's step 4.",
  "guide.shipping.airport.departure.pickup.title":
    "Where to find the pickup counter",
  "guide.shipping.airport.departure.pickup.narita":
    "Narita T1/T2: Departure Lobby 4F, same floor as check-in counters",
  "guide.shipping.airport.departure.pickup.haneda":
    "Haneda T2/T3: Departure Lobby 3F, signposted 手荷物受取",
  "guide.shipping.airport.departure.pickup.kansai":
    "Kansai T1: Departure Lobby 4F",
  "guide.shipping.airport.departure.pickup.chubu":
    "Chubu (Nagoya) T1: Departure Lobby 3F",
  "guide.shipping.airport.departure.pickup.required":
    "To pick up, bring: the sender copy of the airway bill (the one you got when shipping) and your passport. Yamato's paperwork mentions a personal seal, but foreigners can use a passport instead.",

  "guide.shipping.airport.counters.title":
    "Full list of airports with counters",
  "guide.shipping.airport.counters.yamato.title":
    "Yamato Kuroneko Airport Takkyubin",
  "guide.shipping.airport.counters.yamato.list":
    "Narita (T1 / T2), Haneda (T1 / T2 / T3), Kansai (T1), Chubu (T1), New Chitose, Sendai, Fukuoka, Naha, and other major international and domestic airports. See Yamato's official \"Airport Takkyubin counter list\" for the full roster.",
  "guide.shipping.airport.counters.jalabc.title": "JAL ABC Airport Delivery",
  "guide.shipping.airport.counters.jalabc.list":
    "Narita (T1 / T2), Haneda (T2 / T3), Kansai (T1), Chubu (T1) — four airports. Fewer than Yamato, but covers the main international routes.",
  "guide.shipping.airport.counters.which":
    "Which should you pick? Service is similar — just use whichever counter you see first. If you want to compare: Yamato has more locations and app-based tracking; JAL ABC offers JAL member discounts and online pre-booking with card payment.",

  "guide.shipping.fare.col.route": "Route",
  "guide.shipping.fare.updated": "Fares updated {date}",
  "guide.shipping.fare.no_data": "Loading fare data",
  "guide.shipping.fare.source":
    "Source: Yamato official fare tables (refreshed every Wednesday morning)",
  "guide.shipping.fare.note":
    "※ Actual charges based on on-site weigh-in. Remote islands and parts of Hokkaido / Okinawa may incur surcharges. Oversized items (any side >160cm total or >30kg) are refused — split into multiple pieces.",
  "guide.shipping.fare.check_yours": "Check your own route",

  "guide.shipping.airport.fare.title": "How much does it cost?",
  "guide.shipping.airport.fare.intro":
    "Example: Yamato Kuroneko's Airport Takkyubin (JAL ABC is usually similar, ¥100–300 higher).",
  "guide.shipping.airport.fare.discount":
    "Stackable discounts: web-prefilled airway bill −¥60, Yamato member (Kuroneko Member) prepaid charge −¥15, round-trip shipping −¥120. These typically don't apply when you walk up to an airport counter cold.",

  "guide.shipping.airport.phrases.title":
    "7 Japanese phrases you'll actually use",
  "guide.shipping.airport.phrases.desc":
    "No Japanese? No problem. Screenshot these and show them to the counter.",
  "guide.shipping.airport.phrases.1.jp":
    "このホテルまで荷物を送りたいです。",
  "guide.shipping.airport.phrases.1.romaji":
    "Kono hoteru made nimotsu wo okuritai desu.",
  "guide.shipping.airport.phrases.1.zh":
    "I'd like to ship my luggage to this hotel.",
  "guide.shipping.airport.phrases.2.jp": "英語でお願いできますか?",
  "guide.shipping.airport.phrases.2.romaji":
    "Eigo de onegai dekimasu ka?",
  "guide.shipping.airport.phrases.2.zh": "Can we do this in English?",
  "guide.shipping.airport.phrases.3.jp":
    "クレジットカードでお願いします。",
  "guide.shipping.airport.phrases.3.romaji":
    "Kurejitto kaado de onegaishimasu.",
  "guide.shipping.airport.phrases.3.zh": "I'll pay by credit card.",
  "guide.shipping.airport.phrases.4.jp": "現金でお願いします。",
  "guide.shipping.airport.phrases.4.romaji":
    "Genkin de onegaishimasu.",
  "guide.shipping.airport.phrases.4.zh": "I'll pay in cash.",
  "guide.shipping.airport.phrases.5.jp":
    "明日の何時ごろ届きますか?",
  "guide.shipping.airport.phrases.5.romaji":
    "Ashita no nanji goro todokimasu ka?",
  "guide.shipping.airport.phrases.5.zh":
    "Roughly what time tomorrow will it arrive?",
  "guide.shipping.airport.phrases.6.jp":
    "スーツケースにカバーは必要ですか?",
  "guide.shipping.airport.phrases.6.romaji":
    "Suutsukeesu ni kabaa wa hitsuyou desu ka?",
  "guide.shipping.airport.phrases.6.zh":
    "Does my suitcase need a protective cover?",
  "guide.shipping.airport.phrases.7.jp":
    "補償オプションはありますか?",
  "guide.shipping.airport.phrases.7.romaji":
    "Hoshou opushon wa arimasu ka?",
  "guide.shipping.airport.phrases.7.zh":
    "Do you offer an insurance option?",

  "guide.shipping.airport.receive.title":
    "What happens once my luggage arrives at the hotel?",
  "guide.shipping.airport.receive.body":
    "The front desk receives it and puts it in storage, then hands it over when you check in. If it's not there yet at check-in, they'll tell you the estimated arrival time, call your room on delivery, or bring it up later. When you check in, proactively mention that you've shipped luggage so the front desk doesn't miss it.",
  "guide.shipping.airport.receive.phrase_jp":
    "私宛に荷物が届いていますか?名前は ○○ です。",
  "guide.shipping.airport.receive.phrase_romaji":
    "Watashi ate ni nimotsu ga todoite imasu ka? Namae wa ○○ desu.",
  "guide.shipping.airport.receive.phrase_zh":
    "Is there any luggage for me? My name is ○○.",

  "guide.shipping.airport.trouble.title":
    "Common snags · How to handle them",
  "guide.shipping.airport.trouble.1.q":
    "My luggage is over 30kg — now what?",
  "guide.shipping.airport.trouble.1.a":
    "Yamato's 30kg cap is a hard limit. Split into two pieces on the spot and pay for both. For oversized gifts or instruments, switch to Sagawa Express (up to 50kg in some regions).",
  "guide.shipping.airport.trouble.2.q":
    "No yen cash, only cards — is that OK?",
  "guide.shipping.airport.trouble.2.a":
    "Most Yamato airport counters accept Visa/Mastercard/JCB. To be safe, withdraw ¥10,000 at a Seven Bank ATM in the arrival lobby first. Every floor of the airport has a Seven ATM or Japan Post ATM, and they accept foreign cards.",
  "guide.shipping.airport.trouble.3.q":
    "I'm not sure how to spell my hotel's name.",
  "guide.shipping.airport.trouble.3.a":
    "Search the English name on Google Maps, tap the hotel, and the detail page shows the official katakana / kanji name. Screenshot the whole Maps page and show it to the counter — fastest way.",
  "guide.shipping.airport.trouble.4.q":
    "I don't have a suitcase cover — will it get scratched?",
  "guide.shipping.airport.trouble.4.a":
    "Yamato recommends one but doesn't require it. If you want extra safety, airport convenience stores (LAWSON / Family Mart) sell covers for about ¥1,000; Donki or Travel Stores in the arrival lobby have them for ¥500–1,500.",
  "guide.shipping.airport.trouble.5.q":
    "I forgot to ship on departure day — can I still do it at the airport?",
  "guide.shipping.airport.trouble.5.a":
    "Yes, but at that point it's just same-day check-in baggage. That's no longer airport Takkyubin — you just check in at the counter and collect at your destination country's customs. If your goal was to avoid dragging luggage to the airport, you're out of luck. The only remaining option is to arrive 2–3 hours early, haul it to check-in, and drop it immediately.",

  "guide.shipping.airport.faq.title": "FAQ",
  "guide.shipping.airport.faq.1.q":
    "How much does one large bag (29\") usually cost?",
  "guide.shipping.airport.faq.1.a":
    "A 29\" suitcase is typically 140–160 size. Within Tokyo: ¥1,800–2,200; Tokyo ↔ Osaka / Kyoto: ¥2,300–2,500; Tokyo ↔ Fukuoka / Sapporo: ¥2,800–3,500; to Okinawa (most expensive): ¥3,500–4,500. JAL ABC runs ¥300–500 higher.",
  "guide.shipping.airport.faq.2.q":
    "What's the fastest transit? Same-day possible?",
  "guide.shipping.airport.faq.2.a":
    "Standard is next-day afternoon. Within the same prefecture, morning-to-afternoon is possible (Yamato has a \"same-day\" option, though airport counters may not offer it); plan for next-day anyway. The only true same-day-to-hotel option is Airporter (specific airports and time windows only).",
  "guide.shipping.airport.faq.3.q":
    "Can my luggage get lost? Is there insurance?",
  "guide.shipping.airport.faq.3.a":
    "Yamato Airport Takkyubin includes basic transit insurance up to ¥300,000. Above that, you can add extended coverage. Loss rates are tiny — Yamato's annual loss rate is under 0.001% — but electronics and valuables should still go in your carry-on.",
  "guide.shipping.airport.faq.4.q":
    "Can I ship cameras / laptops / lithium batteries?",
  "guide.shipping.airport.faq.4.a":
    "**Not recommended.** Yamato forbids valuables, fragile items, cash, and credit cards; electronics aren't banned but damage won't be compensated. Lithium batteries are especially sensitive — power banks and loose batteries go in carry-on, as should laptops and cameras.",
  "guide.shipping.airport.faq.5.q":
    "How many pieces can one person ship?",
  "guide.shipping.airport.faq.5.a":
    "No limit — each piece is priced individually. Typical setup: carry-on (passport, laptop, one night's change of clothes) + shipped luggage (large suitcase + anything else). Families often ship 3–5 pieces at once.",

  "guide.shipping.airport.cta_next.title": "See the other two routes",
  "guide.shipping.airport.cta_next.branch":
    "Drop off at branch · Cheapest",
  "guide.shipping.airport.cta_next.hotel":
    "Hotel front desk forwarding · Least effort",

  "guide.shipping.branch.meta.title":
    "Complete guide to Yamato branch drop-off · The cheapest route",
  "guide.shipping.branch.meta.desc":
    "Bring your luggage yourself from the hotel to a Yamato / Sagawa branch — 10–20% cheaper than airport counters. How to fill out the airway bill, how to find the nearest branch, Japanese phrases, common snags.",
  "guide.shipping.branch.h1": "② Drop off at branch · Full walkthrough",
  "guide.shipping.branch.intro":
    "This is the cheapest route — a ¥100 drop-off discount stacks with a ¥60 digital discount (when you prefill the airway bill on the web), for up to ¥160 off. The tradeoff: you haul the luggage yourself and fill out the form yourself. Good for travellers who know some Japanese or are comfortable with a translation app.",
  "guide.shipping.branch.summary.cost": "From ¥1,500 (cheapest)",
  "guide.shipping.branch.summary.eta":
    "Next day / two days depending on destination",
  "guide.shipping.branch.summary.level":
    "Difficulty ★★☆ · Japanese paperwork",
  "guide.shipping.branch.summary.best_for":
    "Best for: budget-minded travellers, luggage that one person can carry (≤2 pieces, ≤15kg each), and those comfortable with a translation app.",

  "guide.shipping.branch.step_1.title":
    "Find the nearest branch on Google Maps",
  "guide.shipping.branch.step_1.body":
    "Search \"ヤマト運輸 営業所\" (or \"佐川急便 営業所\") on Google Maps. Pick a well-reviewed branch near your hotel with long hours. Yamato's main \"centres\" are often open 24 hours; small corner drop-points run roughly 9:00–20:00. Avoid drop-points inside train-station malls — they tend to take only small packages and will refuse large suitcases.",
  "guide.shipping.branch.step_2.title": "How to get the luggage there",
  "guide.shipping.branch.step_2.body":
    "Under 500m: walk. Over 500m: take a taxi (Japan's base fare is ¥500–700; use the GO app or Uber Japan if the language barrier worries you). Don't take the subway or train — lugging a big suitcase through elevators and transfers is hell, and blocks other passengers during commutes.",
  "guide.shipping.branch.step_3.title":
    "Enter the branch → grab an airway bill",
  "guide.shipping.branch.step_3.body":
    "There are carbon-triplicate airway bills (white / pink / yellow) on the counter — help yourself. If you have a Yamato member account (most foreigners can't sign up, so skip this), you can prefill via the app; otherwise handwrite, the efficiency gap is small. The \"NekoPit\" self-service kiosk also prints airway bills but needs the app to be linked, so it's also not really suitable for foreign travellers.",
  "guide.shipping.branch.step_4.title":
    "Fill out the airway bill (5 key fields)",
  "guide.shipping.branch.step_4.body":
    "See the \"How to fill out the airway bill\" section below — each field explained. The form is fully in Japanese, but the fields are fixed; just follow along.",
  "guide.shipping.branch.step_5.title":
    "Hand the form + luggage to the counter",
  "guide.shipping.branch.step_5.body":
    "The counter will: (1) scan your airway bill, (2) weigh and measure it, (3) tell you the fare, (4) offer to sell you a suitcase cover (¥500–1,000), and (5) check you out. Usually 2–5 minutes.",
  "guide.shipping.branch.step_6.title": "Pay → take the receipt",
  "guide.shipping.branch.step_6.body":
    "Branches take cash, transit IC cards (Suica/PASMO/ICOCA), and PayPay; some 24h branches take credit cards but it's not guaranteed. Safest combo: cash + IC card. Get the \"sender copy\" (ご依頼主控) with the tracking number and snap a photo.",

  "guide.shipping.branch.form.title":
    "How to fill out the airway bill · 5 key fields",
  "guide.shipping.branch.form.desc":
    "The airway bill is split left/right. The right half is for the courier (barcodes, dates) — don't touch it. The left half is yours to fill.",
  "guide.shipping.branch.form.field_sender":
    "\"Sender\" (ご依頼主): your name (kanji or romaji is fine), phone (hotel phone or your local SIM), postal code + address (the hotel's Japanese address).",
  "guide.shipping.branch.form.field_recipient":
    "\"Recipient\" (お届け先): the most important field. Name line: \"○○ホテル ○○様気付 ○○ (your name)\" — \"○○ホテル\" is the destination hotel, \"○○様気付\" means \"c/o that hotel,\" and the last \"○○\" is your name (the hotel uses this to identify you). Add the hotel's postal code + address + phone.",
  "guide.shipping.branch.form.field_item":
    "\"Item type\" (品名): write \"衣類\" (clothes) or \"旅行用品\" (travel items). Don't write \"valuables,\" \"cash,\" or \"electronics\" — Yamato will refuse or make you sign a waiver.",
  "guide.shipping.branch.form.field_time":
    "\"Requested delivery time\" (お届け希望日時): date = next day (today + 1), time = \"午前中\" (morning) or a slot like \"14–16 時.\" Leaving it blank means \"as early as possible.\"",
  "guide.shipping.branch.form.field_misc":
    "\"Refrigerated shipping\" (クール便): **uncheck.** \"Cash on delivery\" (代金引換): **uncheck**, unless you really want the recipient to pay.",
  "guide.shipping.branch.form.tip":
    "Unsure? Hand the form to the counter and say \"チェックしていただけますか?\" — staff will usually catch any mistakes.",

  "guide.shipping.branch.phrases.title":
    "5 Japanese phrases for the branch counter",
  "guide.shipping.branch.phrases.desc":
    "No Japanese? No problem. Screenshot these and show them to the counter.",
  "guide.shipping.branch.phrases.1.jp": "これを送りたいです。",
  "guide.shipping.branch.phrases.1.romaji": "Kore wo okuritai desu.",
  "guide.shipping.branch.phrases.1.zh": "I'd like to ship this.",
  "guide.shipping.branch.phrases.2.jp":
    "送り状のチェックをお願いできますか?",
  "guide.shipping.branch.phrases.2.romaji":
    "Okurijou no chekku wo onegai dekimasu ka?",
  "guide.shipping.branch.phrases.2.zh":
    "Could you check my airway bill?",
  "guide.shipping.branch.phrases.3.jp":
    "明日の午前中に届きますか?",
  "guide.shipping.branch.phrases.3.romaji":
    "Ashita no gozenchuu ni todokimasu ka?",
  "guide.shipping.branch.phrases.3.zh":
    "Will it arrive tomorrow morning?",
  "guide.shipping.branch.phrases.4.jp":
    "持込割引はありますか?",
  "guide.shipping.branch.phrases.4.romaji":
    "Mochikomi waribiki wa arimasu ka?",
  "guide.shipping.branch.phrases.4.zh":
    "Is there a drop-off discount?",
  "guide.shipping.branch.phrases.5.jp": "Suica で支払えますか?",
  "guide.shipping.branch.phrases.5.romaji":
    "Suica de shiharaemasu ka?",
  "guide.shipping.branch.phrases.5.zh": "Can I pay with Suica?",

  "guide.shipping.branch.fare.title": "How much does it cost?",
  "guide.shipping.branch.fare.intro":
    "Below are standard Yamato Kuroneko Takkyubin fares. Dropping off at a branch adds: −¥100 drop-off discount + −¥60 digital discount (web-prefilled airway bill) = up to −¥160 per piece.",

  "guide.shipping.branch.trouble.title":
    "Common snags · How to handle them",
  "guide.shipping.branch.trouble.1.q":
    "The app requires a Japanese phone number to register — what now?",
  "guide.shipping.branch.trouble.1.a":
    "Skip the app, handwrite the airway bill — it's fine. The ¥60 digital discount you'd save isn't worth getting a Japanese SIM for.",
  "guide.shipping.branch.trouble.2.q":
    "The staff doesn't speak any English?",
  "guide.shipping.branch.trouble.2.a":
    "Use Google Translate's camera mode on the form, or type your request in English and translate it to Japanese on your phone. Yamato staff deal with tourists constantly and are used to slow speech + gestures for non-Japanese speakers.",
  "guide.shipping.branch.trouble.3.q":
    "I messed up the airway bill — what now?",
  "guide.shipping.branch.trouble.3.a":
    "If you haven't handed it over yet, grab a fresh one and redo it. If you already handed it over, you have about 15 minutes to ask staff to pull it back and correct it. After that you'll need to submit a change request on Yamato's website using the tracking number — tedious, so fill it out carefully first time.",
  "guide.shipping.branch.trouble.4.q":
    "The branch is far from my hotel.",
  "guide.shipping.branch.trouble.4.a":
    "If it's over 1km or you don't want to haul the luggage, switch to hotel forwarding (link below) or call Yamato pickup (+¥30–60; not necessarily cheaper than drop-off).",

  "guide.shipping.branch.faq.title": "FAQ",
  "guide.shipping.branch.faq.1.q":
    "What's the difference between a branch (営業所) and a drop-point (取扱店)?",
  "guide.shipping.branch.faq.1.a":
    "Branches (\"centres\") are Yamato-owned, handle large luggage, often open 24 hours. Drop-points are partner stores (convenience stores, small shops) and usually only take items up to 100 size. For large suitcases (140+ size), go to a branch — skip drop-points.",
  "guide.shipping.branch.faq.2.q":
    "Can I ship large luggage at 7-Eleven or Family Mart?",
  "guide.shipping.branch.faq.2.a":
    "Yamato partners with Family Mart and Lawson (7-Eleven is mainly Sagawa), but staff training varies and large items are often refused. For suitcases, go to a Yamato branch instead — don't gamble on convenience stores.",
  "guide.shipping.branch.faq.3.q":
    "How does Sagawa Express differ from Yamato?",
  "guide.shipping.branch.faq.3.a":
    "Both have comparable branch networks and prices (Sagawa's \"Hikyaku Takuhaibin\" is ¥50–100 cheaper). But Sagawa has fewer airport counters and is less traveller-friendly — **recommend Yamato for foreign travellers**.",
  "guide.shipping.branch.faq.4.q":
    "Can I specify a delivery time?",
  "guide.shipping.branch.faq.4.a":
    "Yes, on the airway bill's \"requested delivery time\" field. Available slots: morning / 14:00–16:00 / 16:00–18:00 / 18:00–20:00 / 19:00–21:00. Not guaranteed, but Yamato hits the slot over 95% of the time.",
  "guide.shipping.branch.faq.5.q":
    "Over 30kg or 200 size — what now?",
  "guide.shipping.branch.faq.5.a":
    "Yamato's 30kg / 200 size cap is absolute. For bigger items (large furniture, instruments), switch to Yamato's \"Kazaibin\" or Nippon Express's \"Tanshin Pack\" — both require advance booking and cost more.",

  "guide.shipping.branch.cta_next.title": "See the other two routes",
  "guide.shipping.branch.cta_next.airport":
    "Airport counter · Beginner-friendly",
  "guide.shipping.branch.cta_next.hotel":
    "Hotel front desk · Least effort",

  "guide.shipping.hotel.meta.title":
    "Hotel front desk forwarding · The easiest checkout-day option",
  "guide.shipping.hotel.meta.desc":
    "Don't want to carry luggage on checkout day? Let the front desk handle shipping for you. How to confirm the hotel actually offers this, how to write \"c/o\" for the receiving hotel, airway bill tips, payment methods, common snag fixes.",
  "guide.shipping.hotel.h1":
    "③ Hotel front desk forwarding · Full walkthrough",
  "guide.shipping.hotel.intro":
    "The easiest checkout-day option. The front desk fills out the airway bill, pays the courier, and all you do is drop the luggage. But **not every hotel offers this** — budget business hotels, capsules, and guesthouses often refuse, so check before you book.",
  "guide.shipping.hotel.summary.cost": "From ¥2,000",
  "guide.shipping.hotel.summary.eta": "Next-day afternoon",
  "guide.shipping.hotel.summary.level":
    "Difficulty ★☆☆ · Beginner-friendly",
  "guide.shipping.hotel.summary.best_for":
    "Best for: chain business hotels and above, travellers who want to move hands-free on checkout day, and anyone who doesn't mind paying an extra ¥100–300 service fee.",

  "guide.shipping.hotel.precheck.title": "⚠️ Confirm before you book",
  "guide.shipping.hotel.precheck.body":
    "Not every hotel forwards luggage. Capsule hotels, hostels, Airbnb, and some budget chains usually don't. Before booking, check JPLuggageGo's \"hotel chain forwarding policy table\" (scroll down on the /quote page), or email / call the hotel directly: \"このホテルから宅急便は発送できますか?\"",
  "guide.shipping.hotel.precheck.cta":
    "Check hotel-chain policies →",

  "guide.shipping.hotel.step_1.title":
    "Ask at check-in with one quick line",
  "guide.shipping.hotel.step_1.body":
    "At check-in, casually ask: \"明日、荷物を発送したいですが、お願いできますか?\" Confirm: (1) whether they handle forwarding, (2) cash only or cards accepted, (3) how much lead time they need (usually same-day on checkout is fine).",
  "guide.shipping.hotel.step_2.title":
    "Checkout day: bring luggage to the front desk",
  "guide.shipping.hotel.step_2.body":
    "Bring your suitcase to the front desk before checkout and say: \"チェックアウトと荷物の発送をお願いします\" (checkout + shipping). They'll hand you an airway bill.",
  "guide.shipping.hotel.step_3.title":
    "Fill out the airway bill (hotel-forwarding specifics)",
  "guide.shipping.hotel.step_3.body":
    "The key is the recipient field: \"○○ホテル ○○様気付 ○○ (your name).\" \"気付\" means \"c/o\" — Japanese couriers see this and know to hand it off to the hotel rather than chase the recipient directly. Hotel name in kanji, 7-digit postal code, Japanese-version address. Use this (current) hotel as the sender address.",
  "guide.shipping.hotel.step_4.title":
    "Weigh-in → fare → payment",
  "guide.shipping.hotel.step_4.body":
    "Most hotels have a small scale to weigh on the spot, and they'll tell you the fare (usually a ¥100–300 service fee is added, so slightly more than a branch drop-off). Cash is the main payment method; some upscale hotels let you charge to the room and use a card. ¥5,000 cash on hand is the safest.",
  "guide.shipping.hotel.step_5.title":
    "Take the receipt → leave",
  "guide.shipping.hotel.step_5.body":
    "The hotel gives you a sender copy (ご依頼主控) with the tracking number. Photo it and keep the physical copy until your luggage arrives at the next hotel. You can leave hands-free — the rest is on the hotel and the courier.",

  "guide.shipping.hotel.rules.title":
    "Special rules for hotel forwarding",
  "guide.shipping.hotel.rules.1":
    "**Must arrive the day before the receiving hotel stay**: per Yamato rules, luggage sent to your next hotel must arrive \"the day before your stay\" and be stored there. If your stay is same-day and delivery is also same-day, Yamato may refuse.",
  "guide.shipping.hotel.rules.2":
    "**Never botch the \"c/o\" line**: \"○○ホテル ○○様気付 ○○.\" Without the \"気付\" characters, the hotel may mistake it for another guest's parcel — resulting in misrouting and hard-to-find packages.",
  "guide.shipping.hotel.rules.3":
    "**Some hotels only receive, others only forward**: the chain policy table flags this per hotel — check before you book.",
  "guide.shipping.hotel.rules.4":
    "**Carry valuables / fragile items / cash yourself**: the hotel often has you sign a waiver confirming \"no valuables / cash / electronics inside\" — damage to those items won't be compensated.",
  "guide.shipping.hotel.rules.5":
    "**Boxes and bags aren't guaranteed**: shipping the suitcase as-is is easiest. For loose items, buy a box at a convenience store before checkout.",

  "guide.shipping.hotel.phrases.title":
    "5 Japanese phrases for the front desk",
  "guide.shipping.hotel.phrases.desc":
    "No Japanese? No problem. Screenshot these and show them to the front desk.",
  "guide.shipping.hotel.phrases.1.jp":
    "明日、荷物を発送したいです。",
  "guide.shipping.hotel.phrases.1.romaji":
    "Ashita, nimotsu wo hassou shitai desu.",
  "guide.shipping.hotel.phrases.1.zh":
    "I'd like to ship my luggage tomorrow.",
  "guide.shipping.hotel.phrases.2.jp":
    "このホテルから宅急便は発送できますか?",
  "guide.shipping.hotel.phrases.2.romaji":
    "Kono hoteru kara takkyuubin wa hassou dekimasu ka?",
  "guide.shipping.hotel.phrases.2.zh":
    "Can I ship Takkyubin from this hotel?",
  "guide.shipping.hotel.phrases.3.jp":
    "次のホテルまで送りたいです。",
  "guide.shipping.hotel.phrases.3.romaji":
    "Tsugi no hoteru made okuritai desu.",
  "guide.shipping.hotel.phrases.3.zh":
    "I'd like to ship to my next hotel.",
  "guide.shipping.hotel.phrases.4.jp":
    "送り状の書き方を教えてください。",
  "guide.shipping.hotel.phrases.4.romaji":
    "Okurijou no kakikata wo oshiete kudasai.",
  "guide.shipping.hotel.phrases.4.zh":
    "Could you show me how to fill out the airway bill?",
  "guide.shipping.hotel.phrases.5.jp":
    "現金とカード、どちらがいいですか?",
  "guide.shipping.hotel.phrases.5.romaji":
    "Genkin to kaado, dochira ga ii desu ka?",
  "guide.shipping.hotel.phrases.5.zh":
    "Which is better — cash or card?",

  "guide.shipping.hotel.receive.title":
    "Once the luggage reaches the next hotel?",
  "guide.shipping.hotel.receive.body":
    "The receiving hotel takes it and puts it in storage. At check-in, proactively tell the front desk \"荷物が届いているはずです\" (my luggage should have arrived) and show the receipt's tracking number screenshot — they'll retrieve it. Some hotels put it in your room; others expect you to pick up and sign at the front desk.",

  "guide.shipping.hotel.fare.title": "How much does it cost?",
  "guide.shipping.hotel.fare.intro":
    "Below are standard Yamato Kuroneko Takkyubin fares. Hotel forwarding is usually priced at cost; a handful of luxury hotels (Imperial, Ritz, Peninsula) add a ¥300–1,000 per-piece service fee.",

  "guide.shipping.hotel.trouble.title":
    "Common snags · How to handle them",
  "guide.shipping.hotel.trouble.1.q":
    "The hotel says they don't do forwarding — now what?",
  "guide.shipping.hotel.trouble.1.a":
    "Switch to a branch drop-off — there's a link below in this guide. You can also ask the hotel to arrange Yamato pickup (+¥30–60), but book the night before.",
  "guide.shipping.hotel.trouble.2.q":
    "The hotel only takes cash and I don't have enough.",
  "guide.shipping.hotel.trouble.2.a":
    "The night before checkout, hit up a 7-Eleven ATM downstairs. ¥5,000–10,000 covers 1–2 forwarding items. If the hotel is remote with no convenience store nearby, negotiate to charge it to the room (some chains allow this).",
  "guide.shipping.hotel.trouble.3.q":
    "What if I botch the \"c/o\" line?",
  "guide.shipping.hotel.trouble.3.a":
    "The front desk usually double-checks your form, so let them review it after you fill it out. If it really does come back, you'll get tracking notifications on your phone; submit a correction on Yamato's website with the tracking number — the courier will redeliver.",
  "guide.shipping.hotel.trouble.4.q":
    "My luggage hasn't arrived when I check in at the next hotel.",
  "guide.shipping.hotel.trouble.4.a":
    "Check the current status on Yamato's website with the tracking number. It's usually \"in transit\" and will arrive by evening. The hotel will sign for it and hold it — even without a room key that's fine, pick it up later.",
  "guide.shipping.hotel.trouble.5.q":
    "The hotel says they never received my luggage.",
  "guide.shipping.hotel.trouble.5.a":
    "Very rare. First check Yamato's delivery log with the tracking number. If it shows \"delivered\" but the hotel says no, ask them to dig through the storage room (usually the check-in agent forgot to log it). If it's genuinely lost, bring the receipt to the nearest Yamato branch or call 0120-01-9625 to file a claim.",

  "guide.shipping.hotel.faq.title": "FAQ",
  "guide.shipping.hotel.faq.1.q":
    "Which hotels typically won't forward luggage?",
  "guide.shipping.hotel.faq.1.a":
    "Capsule hotels (First Cabin, 9hours), hostels, Airbnb, and some budget chains (certain Super Hotel or Toyoko Inn branches). The chain policy table (on /quote) has 16 mainstream chains listed; if the listed policy doesn't match reality, check user reports.",
  "guide.shipping.hotel.faq.2.q": "Can I ship back to Taiwan?",
  "guide.shipping.hotel.faq.2.a":
    "No. Yamato Airport Takkyubin is domestic-Japan only. To ship to Taiwan, use \"International Takkyubin\" (Yamato International, Japan Post EMS) — prices are high (¥5,000–15,000), transit is 3–7 days, and you'll need to handle customs. For suitcases, either check them onto the flight or send them to your next hotel in Japan for storage.",
  "guide.shipping.hotel.faq.3.q":
    "I haven't checked into the next hotel yet — can I still ship ahead?",
  "guide.shipping.hotel.faq.3.a":
    "Most chains allow it (APA, Toyoko Inn, Mitsui Garden, etc.); budget and boutique hotels may need a phone call first. The user reports table has real-world confirmations. Add \"宿泊日: YYYY/MM/DD\" in the airway bill's remarks so the hotel knows when you're arriving.",
  "guide.shipping.hotel.faq.4.q":
    "Do hotels charge a forwarding fee?",
  "guide.shipping.hotel.faq.4.a":
    "Most hotels **don't charge a separate service fee** — you just pay Yamato / Sagawa's shipping charge (possibly a bit higher than branch prices, with the delta acting as the implicit service fee). A few luxury hotels (Imperial, Peninsula) add ¥200–500 as a handling fee.",
  "guide.shipping.hotel.faq.5.q":
    "Can the hotel store luggage that was shipped after I checked out?",
  "guide.shipping.hotel.faq.5.a":
    "No — once you've checked out, the hotel has no obligation to store your belongings. To send something back, arrange a \"return stay\" reservation with the hotel in advance. Simpler alternative: ship to your next hotel, or use a paid luggage-storage service like ecbo Cloak or LuggAgent.",

  "guide.shipping.hotel.cta_next.title": "See the other two routes",
  "guide.shipping.hotel.cta_next.airport":
    "Airport counter · Beginner-friendly",
  "guide.shipping.hotel.cta_next.branch":
    "Drop off at branch · Cheapest",
};

const DICTS: Record<Lang, Dict> = {
  "zh-TW": ZH_TW,
  ja: JA,
  en: EN,
};

export function t(lang: Lang, key: string): string {
  return DICTS[lang]?.[key] ?? ZH_TW[key] ?? key;
}

// tf(lang, key, { name: value }) → replaces {name} in the string.
export function tf(
  lang: Lang,
  key: string,
  params: Record<string, string | number>,
): string {
  let out = t(lang, key);
  for (const [k, v] of Object.entries(params)) {
    out = out.split(`{${k}}`).join(String(v));
  }
  return out;
}
