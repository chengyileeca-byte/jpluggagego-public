"use client";

import { useEffect } from "react";

/**
 * 當 URL hash 是 `#packing-xxx` 時,找對應 <details id="packing-xxx"> 並展開。
 * 支援 SPA-style navigation(hashchange)+ 初次載入直接帶 hash 的情況。
 *
 * Why: §3 服務卡預設只 EMS 展開,其他關。從試算結果點「如何寄送 →」跳過去時,
 * 需要自動打開對應卡片,否則使用者跳過去看不到內容。
 */
export function HashOpenPacking() {
  useEffect(() => {
    function openFromHash() {
      const hash = window.location.hash;
      if (!hash.startsWith("#packing-")) return;
      const el = document.getElementById(hash.slice(1));
      if (el instanceof HTMLDetailsElement && !el.open) {
        el.open = true;
        // 等 details 展開後再 scroll,避免 scroll 位置被 layout shift 拉偏
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return null;
}
