import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORY_LABEL_ZH,
  REGION_LABEL_ZH,
  listEntriesForCard,
  subTypeLabel,
  type JapanEntryCard,
  type Region,
} from "@/lib/japan-entries";
import {
  formatSeasonRange,
  isInSeason,
  priceTierLabel,
} from "@/lib/japan-prep-ui";

// ISR — 1 時間に 1 回再生成(egress 削減)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "何時可以去 · 日本大小事備忘錄",
  description: "指定日期看全日本當日可體驗的地區代表級活動,跨地區查詢。",
  alternates: { canonical: "/japan/when" },
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

function parseDate(s: string | undefined): Date {
  if (s && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T00:00:00`);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function inEventWindow(e: JapanEntryCard, target: Date): boolean {
  if (!e.event_start && !e.event_end) return false;
  const t = target.getTime();
  const s = e.event_start ? new Date(e.event_start).getTime() : -Infinity;
  const en = e.event_end ? new Date(e.event_end).getTime() : Infinity;
  return t >= s && t <= en;
}

export default async function GlobalWhenPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const target = parseDate(date);
  const targetYmd = formatYmd(target);

  const all = await listEntriesForCard({ feature_rank_min: 2, limit: 500 });
  const hits = all.filter((e) => {
    const seasonHit = isInSeason(
      { start: e.season_start, end: e.season_end },
      target,
    );
    return seasonHit || inEventWindow(e, target);
  });

  const byRegion = new Map<Region, JapanEntryCard[]>();
  for (const e of hits) {
    const bucket = byRegion.get(e.region) ?? [];
    bucket.push(e);
    byRegion.set(e.region, bucket);
  }
  const regions = REGION_ORDER.filter((r) => byRegion.has(r));

  const prev = new Date(target);
  prev.setDate(prev.getDate() - 1);
  const next = new Date(target);
  next.setDate(next.getDate() + 1);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <Link
          href="/japan"
          className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← 日本大小事備忘錄
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            何時可以去
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            指定日期,看全日本當日可體驗的地區代表級活動或季節限定條目。
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            僅顯示「地區代表」與「全國級」。要看單一地區完整清單請點進該地區。
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <form className="flex flex-wrap items-center gap-3" action="">
            <label className="text-sm text-zinc-700 dark:text-zinc-300">
              日期
              <input
                type="date"
                name="date"
                defaultValue={targetYmd}
                className="ml-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-3 py-1 text-sm font-medium hover:opacity-90"
            >
              查詢
            </button>
            <Link
              href={`/japan/when?date=${formatYmd(prev)}`}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              ← 前一天
            </Link>
            <Link
              href={`/japan/when?date=${formatYmd(next)}`}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              後一天 →
            </Link>
          </form>
          <p className="mt-3 text-xs text-zinc-500">
            {targetYmd} 共 {hits.length} 筆精選命中。
          </p>
        </section>

        {hits.length === 0 ? (
          <p className="mt-10 text-center text-sm text-zinc-500">
            當日沒有地區代表級活動命中。試試其他日期或看年曆。
          </p>
        ) : (
          <div className="mt-8 space-y-10">
            {regions.map((r) => (
              <RegionSection
                key={r}
                region={r}
                rows={byRegion.get(r)!}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function RegionSection({
  region,
  rows,
}: {
  region: Region;
  rows: JapanEntryCard[];
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {REGION_LABEL_ZH[region]}
        </h2>
        <span className="text-[11px] text-zinc-500">{rows.length} 筆</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {rows.map((e) => (
          <EntryCard key={e.id} entry={e} />
        ))}
      </div>
    </section>
  );
}

function EntryCard({ entry }: { entry: JapanEntryCard }) {
  const season = formatSeasonRange({
    start: entry.season_start,
    end: entry.season_end,
  });
  const price = priceTierLabel(entry.price_tier);
  return (
    <Link
      href={`/japan/entry/${entry.slug}`}
      className="block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
          {entry.title_zh}
        </h3>
        <span className="shrink-0 rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-1.5 py-0.5 text-[10px] font-medium">
          {CATEGORY_LABEL_ZH[entry.category]}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
        {entry.summary_zh}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] text-zinc-500">
        <span>
          {entry.prefecture_ja}
          {entry.municipality_ja ? ` · ${entry.municipality_ja}` : ""}
        </span>
        <span>{subTypeLabel(entry.sub_type)}</span>
        {season && <span className="font-mono">{season}</span>}
        {price && <span>{price}</span>}
      </div>
    </Link>
  );
}
