"use client";

import { LANGS, LANG_LABELS, type Lang } from "@/lib/i18n";

const COOKIE = "lang";

function setCookie(value: string) {
  if (typeof document === "undefined") return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${oneYear}; SameSite=Lax`;
}

export function LangSwitcher({ current }: { current: Lang }) {
  function pick(l: Lang) {
    if (l === current) return;
    setCookie(l);
    // Full reload so layout + all Server Components re-render with new cookie.
    if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur text-xs overflow-hidden"
    >
      {LANGS.map((l, i) => (
        <button
          key={l}
          type="button"
          onClick={() => pick(l)}
          className={`px-3 py-1.5 transition-colors ${
            l === current
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          } ${i > 0 ? "border-l border-zinc-200 dark:border-zinc-800" : ""}`}
          aria-pressed={l === current}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
