import type { Metadata } from "next";
import Link from "next/link";
import {
  listEntriesForCard,
  type JapanEntryCard,
} from "@/lib/japan-entries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "月別 must-do 月曆 · 1-12 月日本旅遊指南 | 日本大小事備忘錄",
  description:
    "12 個月各 1 篇跨地域季節必訪:1 月初詣 + 雪國 / 4 月櫻花 / 7 月祇園祭 / 8 月夏祭高峰 / 11 月紅葉 / 12 月燈飾。直接解「X 月去日本玩什麼」問題。",
  alternates: { canonical: "/japan/monthly" },
};

const MONTH_LABEL_ZH: Record<number, string> = {
  1: "一月",
  2: "二月",
  3: "三月",
  4: "四月",
  5: "五月",
  6: "六月",
  7: "七月",
  8: "八月",
  9: "九月",
  10: "十月",
  11: "十一月",
  12: "十二月",
};

const MONTH_THEME: Record<number, string> = {
  1: "初詣・雪國",
  2: "雪祭・梅",
  3: "桜開花",
  4: "桜満開",
  5: "GW・新緑",
  6: "梅雨・紫陽花",
  7: "祇園祭・花火",
  8: "盆・夏祭",
  9: "月見・台風",
  10: "紅葉始",
  11: "紅葉ピーク",
  12: "イルミ・年越",
};

function monthFromSeasonStart(start: string | null): number | null {
  if (!start) return null;
  const match = /^(\d{1,2})-\d{2}$/.exec(start);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  return n >= 1 && n <= 12 ? n : null;
}

export default async function MonthlyPage() {
  const all = await listEntriesForCard({ limit: 5000 });
  const monthly = all.filter((e) => e.sub_type === "monthly_guide");

  const byMonth = new Map<number, JapanEntryCard>();
  for (const e of monthly) {
    const m = monthFromSeasonStart(e.season_start);
    if (m !== null) byMonth.set(m, e);
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <Link
          href="/japan"
          className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
        >
          ← 日本大小事備忘錄
        </Link>

        <header className="mt-6">
          <div className="flex items-baseline gap-3">
            <p className="font-mincho text-[10px] tracking-[0.4em] uppercase text-amber-800 dark:text-amber-600/80">
              Monthly
            </p>
            <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
              月&thinsp;別&thinsp;月&thinsp;曆
            </span>
          </div>
          <h1 className="mt-3 font-mincho text-4xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
            12 月 must-do · 跨地域季節月曆
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            每月一篇 700-1,000 字深度指南:風物詩、必訪 spot、推薦地域、注意事項、推薦行程套餐。直接解「X 月去日本玩什麼」常問題。
          </p>
        </header>

        <section className="mt-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const entry = byMonth.get(m);
              return (
                <MonthCard
                  key={m}
                  month={m}
                  entry={entry}
                />
              );
            })}
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 leading-relaxed">
          <p>
            季節時程以本州關東/關西為主基準。北海道紅葉提前 1 個月(9 月中起),沖繩季節滯後或無梅雨/積雪。各景點實際日期以官方公告為主。
          </p>
        </footer>
      </div>
    </main>
  );
}

function MonthCard({
  month,
  entry,
}: {
  month: number;
  entry: JapanEntryCard | undefined;
}) {
  if (!entry) {
    return (
      <div className="block rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 p-4 opacity-60">
        <div className="flex items-baseline gap-2">
          <span className="font-mincho text-2xl font-medium tabular-nums text-zinc-400">
            {month}
          </span>
          <span className="font-mincho text-xs text-zinc-400">
            {MONTH_LABEL_ZH[month]}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">未撰寫</p>
      </div>
    );
  }
  return (
    <Link
      href={`/japan/entry/${entry.slug}`}
      className="group block rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-amber-700/50 dark:hover:border-amber-600/40 transition-colors"
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mincho text-3xl font-medium tabular-nums text-amber-800 dark:text-amber-500 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
          {month}
        </span>
        <span className="font-mincho text-xs text-zinc-500">
          {MONTH_LABEL_ZH[month]}
        </span>
      </div>
      <h2 className="mt-2 font-mincho text-[14px] font-medium text-zinc-900 dark:text-zinc-50 leading-snug group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
        {MONTH_THEME[month]}
      </h2>
      <p className="mt-1.5 text-[11.5px] text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
        {entry.summary_zh.replace(/^【季節風物詩】[^【]*/, "").slice(0, 100)}…
      </p>
    </Link>
  );
}
