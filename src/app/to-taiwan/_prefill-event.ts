// 兩個 client component 之間用 CustomEvent 傳 state,避免 Provider 把整個
// /to-taiwan 頁面(含 server-rendered sections)全部撈進 client bundle。
//
// 事件由 _calculator.tsx(運費試算 ResultCard)dispatch,_tariff-calculator.tsx
// 監聽後把 JPY 用匯率換 TWD → prefill freight 欄 + scrollIntoView。

export const PREFILL_FREIGHT_EVENT = "jpluggagego:prefill-tariff-freight";

export interface PrefillFreightDetail {
  /** 要帶入的日圓運費金額 */
  jpy: number;
}
