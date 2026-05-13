import type { ShippingTimelineStage } from "@/components/shipping-timeline";

export const TIMELINE_AIRPORT_COUNTER: ShippingTimelineStage[] = [
  {
    no: 1,
    icon: "✈",
    title: "入境 · 提領行李",
    duration: "30-45 分",
    body: "下飛機 → 入境審查 → 提領大行李。先把「要寄的大箱」跟「要隨身的小包」分開放在手推車上。",
  },
  {
    no: 2,
    icon: "🗺",
    title: "找空港宅急便 / JP Post 櫃台",
    duration: "5-10 分",
    body: "羽田 T3 2F 到着ロビー、成田 T1/T2 1F、関西 1F 北側、新千歳 B1 — 指標跟著「宅急便」「ゆうパック」。機場 info 櫃台直接問最快。",
  },
  {
    no: 3,
    icon: "📝",
    title: "櫃台填單 · 交寄 · 付費",
    duration: "10-20 分",
    body: "送り状手寫 or 用 QR 先在家填,行李過磅、選翌日時段、付現或刷卡。aerosol / 行動電源 當場被拉出。",
  },
  {
    no: 4,
    icon: "🚇",
    title: "輕裝搭電車 / 巴士到飯店",
    duration: "60-90 分",
    body: "只提貴重物和當晚替換衣服。大行李翌日 16:00 前送到下個飯店,中間完全不用拖。",
  },
  {
    no: 5,
    icon: "🏨",
    title: "飯店抵達 · 行李代收",
    duration: "翌日 16:00",
    body: "前臺出示護照 + 追蹤碼就能取回。大型飯店會放進你房間,小旅館放櫃台。",
    tone: "success",
  },
];

export const TIMELINE_BRANCH_OFFICE: ShippingTimelineStage[] = [
  {
    no: 1,
    icon: "🏨",
    title: "飯店房間打包",
    duration: "10 分",
    body: "紙箱封三圈十字、緩衝材塞滿,行動電源/噴霧/食品 逐項確認不在箱內。",
  },
  {
    no: 2,
    icon: "🚶",
    title: "前往郵便局 / Yamato 営業所",
    duration: "10-20 分",
    body: "飯店走路圈內最穩;太遠叫計程車(告知司機「ゆうびんきょく / ヤマト営業所」)或拖手推車。平日 9-16 點最不塞。",
  },
  {
    no: 3,
    icon: "📝",
    title: "櫃台交寄",
    duration: "15-20 分",
    body: "拿白色送り状、填寫、過磅、付費、拿控え(追蹤碼)。櫃員可能問「中身は何ですか」(裡面什麼),回「衣類です」。",
  },
  {
    no: 4,
    icon: "🗼",
    title: "回飯店 / 繼續觀光",
    duration: "10-20 分",
    body: "行李已不在你手上,後面行程輕鬆很多。追蹤碼拍照存手機備份。",
  },
  {
    no: 5,
    icon: "🎯",
    title: "送達下個飯店",
    duration: "翌日 16:00",
    body: "Yamato / ゆうパック 時段指定內送達。飯店幫你代收放房間或櫃台。",
    tone: "success",
  },
];

export const TIMELINE_HOTEL_FORWARD: ShippingTimelineStage[] = [
  {
    no: 1,
    icon: "🏨",
    title: "房間打包",
    duration: "10-15 分",
    body: "紙箱封三圈、貼「天地無用 / 割れ物注意」貼紙(前臺可要),禁寄品逐一確認。手提/寄送 明確分開兩邊。",
  },
  {
    no: 2,
    icon: "🛎",
    title: "前臺說「宅配お願いします」",
    duration: "5-10 分",
    body: "遞紙箱 + 指定「Yamato で台湾 or ゆうパック で大阪」。填送り状或給前臺代填,付現 / 刷卡 / 計入房費。",
  },
  {
    no: 3,
    icon: "🧾",
    title: "拿到控え(送り状副本)",
    duration: "-",
    body: "上面有追蹤碼 12 碼。拍照存手機或 LINE,別弄丟 — 沒控え後續查件無從查。",
    tone: "warn",
  },
  {
    no: 4,
    icon: "🎯",
    title: "送達下個飯店",
    duration: "翌日 16:00",
    body: "Yamato / ゆうパック 時段指定內送達。下個飯店幫你代收放房間或櫃台。",
    tone: "success",
  },
];

export const TIMELINE_TO_TAIWAN: ShippingTimelineStage[] = [
  {
    no: 1,
    icon: "📦",
    title: "日本打包 + 交寄",
    duration: "D0 · 30-60 分",
    body: "郵便局 / Yamato 櫃台填送り状 + Commercial Invoice / CN22。品名英日文、用途 Personal use、禁寫 gift。",
  },
  {
    no: 2,
    icon: "✈",
    title: "離境日本",
    duration: "D0 ~ D+1",
    body: "通関出庫 → 國際線空運 / 海運(船便)。Yamato 追蹤顯示「集配所出庫」「通関中」等事件點。",
  },
  {
    no: 3,
    icon: "🛂",
    title: "抵台海關 · EZ WAY 事前委任",
    duration: "D+1 ~ D+2",
    body: "2026-03-01 起:海關推播到 App → 收件人必須點「申報相符」海關才受理報關。48h 未點部分業者收倉儲費(≥ NT$450)、2-7 天退運。",
    tone: "warn",
  },
  {
    no: 4,
    icon: "🧾",
    title: "海關放行 · 課稅分三層",
    duration: "D+2 ~ D+3",
    body: "X2 免稅(≤ NT$2,000 + 半年 6 次內)直送 / X3 應稅(~NT$50,000)郵差代收稅 / G1 正式報關(> NT$50,000)要紙本委任書+報關行。",
  },
  {
    no: 5,
    icon: "🎯",
    title: "派送到府",
    duration: "EMS D+2~4 · Yamato D+5~6 · 航空 D+6~8 · 船便 D+14~21",
    body: "依服務不同。收件人 2 次不在,EMS/航空/船便 會送到郵局或 7-11 自取;Yamato 會電話預約二配。",
    tone: "success",
  },
];
