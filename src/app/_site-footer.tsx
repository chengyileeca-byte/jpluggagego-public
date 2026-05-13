import Link from "next/link";

// 全站 footer。/feedback の入口を毎ページ確保 + 編集者風 colophon。
// Server Component:i18n 不要(zh-TW 固定で十分)。
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-6 py-10">
      <div className="mx-auto max-w-3xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        {/* Left: brand mark + colophon */}
        <div>
          <Link
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            JPLuggageGo
          </Link>
          <p className="mt-2 text-[10px] tracking-wide text-zinc-400 dark:text-zinc-600 leading-relaxed">
            行李寄送 + 日本大小事備忘錄
            <br />
            <span className="tabular-nums">© {year}</span> · zh-TW edition
          </p>
        </div>

        {/* Right: anchor links */}
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <Link
            href="/quote"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            報價
          </Link>
          <Link
            href="/japan"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            日本備忘錄
          </Link>
          <Link
            href="/faq"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            FAQ
          </Link>
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-medium underline decoration-dotted underline-offset-4 hover:decoration-solid"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            投書箱
            <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-500 dark:text-zinc-500">
              feedback ↗
            </span>
          </Link>
        </nav>
      </div>
    </footer>
  );
}
