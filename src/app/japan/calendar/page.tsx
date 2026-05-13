import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORY_LABEL_ZH,
  REGION_LABEL_ZH,
  listEntriesForCard,
  type JapanEntryCard,
  type Region,
} from "@/lib/japan-entries";

// ISR — 1 時間に 1 回再生成(egress 削減)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "年曆 · 日本大小事備忘錄",
  description:
    "全年 12 月地區代表級祭典、季節限定活動、世界遺產展期速覽。",
  alternates: { canonical: "/japan/calendar" },
};

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

const REGION_ORDER: Region[] = [
  "hokkaido",
  "tohoku",
  "kanto",
  "chubu",
  "kansai",
  "chugoku",
  "shikoku",
  "kyushu",
  "okinawa",
];

function parseMD(s: string): number | null {
  const m = s.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) * 100 + Number(m[2]);
}

function entryHitsMonth(e: JapanEntryCard, year: number, month: number): boolean {
  if (e.season_start && e.season_end) {
    const startMD = parseMD(e.season_start);
    const endMD = parseMD(e.season_end);
    if (startMD !== null && endMD !== null) {
      const mStart = month * 100 + 1;
      const mEnd = month * 100 + 31;
      if (startMD <= endMD) {
        if (!(mEnd < startMD || mStart > endMD)) return true;
      } else {
        if (!(mEnd < startMD) || !(mStart > endMD)) return true;
      }
    }
  }
  if (e.event_start || e.event_end) {
    const s = e.event_start ? new Date(e.event_start).getTime() : -Infinity;
    const en = e.event_end ? new Date(e.event_end).getTime() : Infinity;
    const monthStart = new Date(year, month - 1, 1).getTime();
    const monthEnd = new Date(year, month, 0, 23, 59, 59).getTime();
    if (!(monthEnd < s || monthStart > en)) return true;
  }
  return false;
}

export default async function GlobalCalendarPage() {
  const all = await listEntriesForCard({ feature_rank_min: 2, limit: 500 });
  const year = new Date().getFullYear();

  const byMonth = new Map<number, Map<Region, JapanEntryCard[]>>();
  for (let m = 1; m <= 12; m++) byMonth.set(m, new Map());
  for (const e of all) {
    for (let m = 1; m <= 12; m++) {
      if (entryHitsMonth(e, year, m)) {
        const regionMap = byMonth.get(m)!;
        const bucket = regionMap.get(e.region) ?? [];
        bucket.push(e);
        regionMap.set(e.region, bucket);
      }
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Link
          href="/japan"
          className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← 日本大小事備忘錄
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            年曆 {year}
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            全年地區代表級祭典與季節活動一覽。空月表示目前精選清單無登錄。
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            僅顯示「地區代表」與「全國級」。點進各地區可看當地完整年曆。
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...byMonth.entries()].map(([month, regionMap]) => {
            const total = [...regionMap.values()].reduce(
              (sum, arr) => sum + arr.length,
              0,
            );
            const regions = REGION_ORDER.filter((r) => regionMap.has(r));
            return (
              <section
                key={month}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {MONTH_LABEL_ZH[month]}
                  </h2>
                  <span className="text-[11px] text-zinc-500">
                    {total} 筆
                  </span>
                </div>
                {total === 0 ? (
                  <p className="mt-3 text-xs text-zinc-400">—</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {regions.map((r) => {
                      const rows = regionMap.get(r)!;
                      return (
                        <div key={r}>
                          <div className="text-[11px] font-medium text-zinc-500">
                            {REGION_LABEL_ZH[r]}
                          </div>
                          <ul className="mt-1 space-y-1">
                            {rows.slice(0, 6).map((e) => (
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
                            {rows.length > 6 && (
                              <li className="text-[11px] text-zinc-500">
                                … 另 {rows.length - 6} 筆
                              </li>
                            )}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
