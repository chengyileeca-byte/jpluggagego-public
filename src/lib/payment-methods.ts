// 支払方法対応表 — 空港カウンター vs 一般集荷 / 郵便局持込 的付款方式。
//
// 資料源(2026-04 查):
//   - Yamato FAQ: https://faq.kuronekoyamato.co.jp/  (クロネコメンバー割 / 持込割)
//   - 日本郵便 ゆうパック 支払方法頁 / 空港カウンター現地標示
//   - 空港カウンター 實地抽樣確認 (NRT/HND/KIX/CTS/FUK)
//
// 注意:
//   - 各營業所/郵便局 對「カード・IC・QR」支援程度差異大;此表只列「多數支援」
//   - 對觀光客的實用建議寫在 `tip` 欄位
//   - 若遇現場與此表不符,請以現場告示為準

export type PaymentTag =
  | "現金"
  | "クレカ"
  | "IC"
  | "QR"
  | "代引き"
  | "メンバー割";

export interface PaymentInfo {
  methods: PaymentTag[];
  // i18n key pointing to the tip string in src/lib/i18n.ts
  tipKey?: string;
}

export const PAYMENTS = {
  yamato: {
    airport: {
      methods: ["現金", "クレカ", "IC", "QR", "メンバー割"],
      tipKey: "payment.yamato.airport.tip",
    } as PaymentInfo,
    branch: {
      methods: ["現金", "メンバー割"],
      tipKey: "payment.yamato.branch.tip",
    } as PaymentInfo,
  },
  yuu: {
    airport: {
      methods: ["現金"],
      tipKey: "payment.yuu.airport.tip",
    } as PaymentInfo,
    postoffice: {
      methods: ["現金", "クレカ", "IC", "QR"],
      tipKey: "payment.yuu.postoffice.tip",
    } as PaymentInfo,
  },
} as const;
