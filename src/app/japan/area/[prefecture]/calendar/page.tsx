import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_LABEL_ZH,
  listEntriesForCard,
  type JapanEntryCard,
} from "@/lib/japan-entries";
import { SUPPORTED_PREFECTURES } from "@/lib/japan-area-styles";

// ISR — 1 時間に 1 回再生成(egress 削減)
export const revalidate = 3600;

const MONTH_LABEL_ZH: Record<number, string> = {
  1: "1 月",
  2: "2 月",
  3: "3 月",
  4: "4 月",
  5: "5 月",
  6: "6 月",
  7: "7 月",
  8: "8 月",
  9: "9 月",
  10: "10 月",
  11: "11 月",
  12: "12 月",
};

// "YYYY-MM-DD" → MMDD 數字
function parseMD(s: string): number | null {
  const m = s.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) * 100 + Number(m[2]);
}

function entryHitsMonth(e: JapanEntryCard, year: number, month: number): boolean {
  // season 區間(MMDD-anchored)與月份區間 overlap 判定
  if (e.season_start && e.season_end) {
    const startMD = parseMD(e.season_start);
    const endMD = parseMD(e.season_end);
    if (startMD !== null && endMD !== null) {
      const mStart = month * 100 + 1;
      const mEnd = month * 100 + 31;
      if (startMD <= endMD) {
        if (!(mEnd < startMD || mStart > endMD)) return true;
      } else {
        // 跨年季:[startMD..1231] ∪ [0101..endMD]
        if (!(mEnd < startMD) || !(mStart > endMD)) return true;
      }
    }
  }
  // event(絕對時戳)與月份區間 overlap
  if (e.event_start || e.event_end) {
    const s = e.event_start ? new Date(e.event_start).getTime() : -Infinity;
    const en = e.event_end ? new Date(e.event_end).getTime() : Infinity;
    const monthStart = new Date(year, month - 1, 1).getTime();
    const monthEnd = new Date(year, month, 0, 23, 59, 59).getTime();
    if (!(monthEnd < s || monthStart > en)) return true;
  }
  return false;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}): Promise<Metadata> {
  const { prefecture } = await params;
  const prefectureJa = decodeURIComponent(prefecture);
  if (!SUPPORTED_PREFECTURES.has(prefectureJa)) return {};
  return {
    title: `${prefectureJa} · 年曆 | 日本大小事備忘錄`,
    description: `${prefectureJa}全年 12 月活動、祭典、季節限定條目一覽。`,
    alternates: {
      canonical: `/japan/area/${encodeURIComponent(prefectureJa)}/calendar`,
    },
  };
}

export default async function AreaCalendarPage({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}) {
  const { prefecture } = await params;
  const prefectureJa = decodeURIComponent(prefecture);
  if (!SUPPORTED_PREFECTURES.has(prefectureJa)) notFound();

  const all = await listEntriesForCard({
    prefecture_ja: prefectureJa,
    limit: 500,
    excludeMeta: true,
  });
  const year = new Date().getFullYear();

  const byMonth = new Map<number, JapanEntryCard[]>();
  for (let m = 1; m <= 12; m++) byMonth.set(m, []);
  for (const e of all) {
    for (let m = 1; m <= 12; m++) {
      if (entryHitsMonth(e, year, m)) byMonth.get(m)!.push(e);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs tracking-[0.2em] uppercase text-zinc-500">
          <Link href="/japan" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            日本大小事
          </Link>
          <span>·</span>
          <Link
            href={`/japan/area/${encodeURIComponent(prefectureJa)}`}
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {prefectureJa}
          </Link>
        </div>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {prefectureJa} · 年曆 {year}
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            含季節區間與有明確日期的事件。空月表示目前無登錄活動。
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...byMonth.entries()].map(([month, rows]) => (
            <section
              key={month}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {MONTH_LABEL_ZH[month]}
                </h2>
                <span className="text-[11px] text-zinc-500">
                  {rows.length} 筆
                </span>
              </div>
              {rows.length === 0 ? (
                <p className="mt-3 text-xs text-zinc-400">—</p>
              ) : (
                <ul className="mt-3 space-y-1.5">
                  {rows.slice(0, 10).map((e) => (
                    <li key={e.id}>
                      <Link
                        href={`/japan/entry/${e.slug}`}
                        className="flex items-start gap-2 text-sm hover:text-sky-700 dark:hover:text-sky-400"
                      >
                        <span className="shrink-0 mt-0.5 text-[10px] text-zinc-500">
                          {CATEGORY_LABEL_ZH[e.category]}
                        </span>
                        <span className="text-zinc-800 dark:text-zinc-200 leading-snug">
                          {e.title_zh}
                        </span>
                      </Link>
                    </li>
                  ))}
                  {rows.length > 10 && (
                    <li className="text-[11px] text-zinc-500">
                      … 另 {rows.length - 10} 筆
                    </li>
                  )}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
