"use client";

import { useEffect, useState } from "react";
import { JpSpeakButton } from "./jp-speak-button";

/**
 * 給「不敢開口」的使用者用 — 點按鈕會全螢幕顯示日文大字版,
 * 直接遞手機給櫃台看。按任何地方關閉。
 */
export function ShowableJpPhrase({
  jp,
  label = "遞給櫃台看",
}: {
  jp: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        👁️ {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full rounded-2xl bg-white dark:bg-zinc-900 p-8 sm:p-12 shadow-2xl cursor-auto"
          >
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="關閉"
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="text-[11px] tracking-wide text-zinc-400 dark:text-zinc-500 uppercase">
              遞給對方看這一句
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-relaxed break-keep">
              {jp}
            </p>
            <div className="mt-5" onClick={(e) => e.stopPropagation()}>
              <JpSpeakButton text={jp} size="lg" />
            </div>
            <p className="mt-5 text-[11px] text-zinc-500 dark:text-zinc-500">
              點任何地方 / 按 ESC 關閉
            </p>
          </div>
        </div>
      )}
    </>
  );
}
