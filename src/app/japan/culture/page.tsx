import type { Metadata } from "next";
import Link from "next/link";
import {
  REGION_LABEL_ZH,
  listEntriesForCard,
  type JapanEntryCard,
  type Region,
} from "@/lib/japan-entries";
import {
  formatSeasonRange,
  isInSeason,
  priceTierLabel,
} from "@/lib/japan-prep-ui";

// ISR — 1 時間に 1 回再生成(force-dynamic は egress 浪費)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "育 · 日本文化精選 | 日本大小事備忘錄",
  description:
    "各地區代表級以上的寺社、史跡、世界遺產、祭典、博物館。點進地區頁看完整清單。",
  alternates: { canonical: "/japan/culture" },
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

export default async function CultureCategoryPage() {
  const all = await listEntriesForCard({
    category: "culture",
    feature_rank_min: 2,
    limit: 500,
  });
  const today = new Date();

  const grouped = new Map<Region, JapanEntryCard[]>();
  for (const e of all) {
    const bucket = grouped.get(e.region) ?? [];
    bucket.push(e);
    grouped.set(e.region, bucket);
  }
  const regions = REGION_ORDER.filter((r) => grouped.has(r));

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
            育 · Culture
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            共 {all.length} 筆地區代表以上精選。
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            僅列「地區代表」與「全國級」。點進各地區可看當地完整 culture 清單。
          </p>
        </header>

        {all.length === 0 ? (
          <p className="mt-10 text-center text-sm text-zinc-500">
            尚無精選資料。
          </p>
        ) : (
          <div className="mt-10 space-y-10">
            {regions.map((r) => (
              <RegionSection
                key={r}
                region={r}
                rows={grouped.get(r)!}
                today={today}
                category="culture"
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
  today,
  category,
}: {
  region: Region;
  rows: JapanEntryCard[];
  today: Date;
  category: string;
}) {
  const prefectures = [...new Set(rows.map((r) => r.prefecture_ja))];
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {REGION_LABEL_ZH[region]}
        </h2>
        <span className="text-[11px] text-zinc-500">{rows.length} 筆精選</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {rows.map((e) => (
          <EntryCard key={e.id} entry={e} today={today} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {prefectures.map((p) => (
          <Link
            key={p}
            href={`/japan/area/${encodeURIComponent(p)}/${category}`}
            className="text-xs text-sky-700 dark:text-sky-400 hover:underline"
          >
            看 {p} 完整清單 →
          </Link>
        ))}
      </div>
    </section>
  );
}

function EntryCard({ entry, today }: { entry: JapanEntryCard; today: Date }) {
  const season = formatSeasonRange({
    start: entry.season_start,
    end: entry.season_end,
  });
  const active = isInSeason(
    { start: entry.season_start, end: entry.season_end },
    today,
  );
  const price = priceTierLabel(entry.price_tier);
  const rank = entry.feature_rank;
  return (
    <Link
      href={`/japan/entry/${entry.slug}`}
      className="block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
          {entry.title_zh}
        </h3>
        <div className="flex shrink-0 gap-1">
          {rank === 3 && (
            <span className="rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-1.5 py-0.5 text-[10px] font-medium">
              全國
            </span>
          )}
          {rank === 2 && (
            <span className="rounded-md bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 px-1.5 py-0.5 text-[10px] font-medium">
              地區
            </span>
          )}
          {active && (
            <span className="rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1.5 py-0.5 text-[10px] font-medium">
              祭期中
            </span>
          )}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
        {entry.summary_zh}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] text-zinc-500">
        <span>
          {entry.prefecture_ja}
          {entry.municipality_ja ? ` · ${entry.municipality_ja}` : ""}
        </span>
        {season && <span className="font-mono">{season}</span>}
        {price && <span>{price}</span>}
      </div>
    </Link>
  );
}
