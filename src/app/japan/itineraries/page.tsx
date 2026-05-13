import type { Metadata } from "next";
import Link from "next/link";
import {
  REGION_LABEL_ZH,
  listEntriesForCard,
  type JapanEntryCard,
  type Region,
} from "@/lib/japan-entries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "規劃套餐 · 日本自由行行程組合 | 日本大小事備忘錄",
  description:
    "地域王道路線(東京/京阪奈/九州/北海道/沖繩等)+ 主題路線(櫻前線/紅葉/雪見溫泉/世遺/現存天守/吉卜力等)。每條附 Day-by-Day 行程、交通建議、預算估算。",
  alternates: { canonical: "/japan/itineraries" },
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

// 從 tags 抽日数 (eg "5day", "7day", "14day")
function extractDays(tags: string[] | null): string | null {
  if (!tags) return null;
  const match = tags.find((t) => /^\d+day$/.test(t));
  if (!match) return null;
  const n = parseInt(match.replace("day", ""), 10);
  if (n <= 3) return `${n} 天`;
  if (n <= 7) return `${n} 天`;
  return `${Math.ceil(n / 7)} 週`;
}

// 從 tags 抽分類 chip (季節/古都/世遺/家族 等代表 tag)
const CHIP_PRIORITY = [
  "桜",
  "紅葉",
  "雪見",
  "世遺",
  "現存天守",
  "茅葺",
  "三名泉",
  "お遍路",
  "ジブリ",
  "ラーメン",
  "サイクリング",
  "スキー",
  "家族",
  "子連",
  "節約",
  "学生",
  "古都",
  "温泉",
];

function pickChip(tags: string[] | null): string | null {
  if (!tags) return null;
  for (const c of CHIP_PRIORITY) {
    if (tags.includes(c)) return c;
  }
  return null;
}

export default async function ItinerariesPage() {
  const all = await listEntriesForCard({ limit: 5000 });
  const itin = all.filter((e) => e.sub_type === "itinerary");

  const thematic = itin.filter((e) => e.tags?.includes("thematic"));
  const regional = itin.filter((e) => e.tags?.includes("regional"));

  const grouped = new Map<Region, JapanEntryCard[]>();
  for (const e of regional) {
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
          className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
        >
          ← 日本大小事備忘錄
        </Link>

        <header className="mt-6">
          <div className="flex items-baseline gap-3">
            <p className="font-mincho text-[10px] tracking-[0.4em] uppercase text-amber-800 dark:text-amber-600/80">
              Itineraries
            </p>
            <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
              規&thinsp;劃&thinsp;套&thinsp;餐
            </span>
          </div>
          <h1 className="mt-3 font-mincho text-4xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
            日本自由行 · {itin.length} 條規劃套餐
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            每條附 Day-by-Day 細節、交通 pass 建議、預算估算、推薦季節。地域型 {regional.length} 條主打初次訪日王道,主題型 {thematic.length} 條按季節/興趣跨地域規劃。
          </p>
        </header>

        {/* 主題型 */}
        {thematic.length > 0 && (
          <section className="mt-12">
            <SectionHeader
              zh="主題型"
              en="Thematic"
              note={`${thematic.length} 條跨地域路線`}
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {thematic.map((e) => (
                <ItineraryCard key={e.id} entry={e} />
              ))}
            </div>
          </section>
        )}

        {/* 地域型 */}
        {regions.length > 0 && (
          <section className="mt-14">
            <SectionHeader
              zh="地域型"
              en="Regional"
              note={`${regional.length} 條地域王道路線`}
            />
            <div className="mt-5 space-y-8">
              {regions.map((r) => (
                <RegionGroup
                  key={r}
                  region={r}
                  rows={grouped.get(r)!}
                />
              ))}
            </div>
          </section>
        )}

        <footer className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 leading-relaxed">
          <p>
            預算範圍含住宿 + 餐食 + 交通 + 主要體驗,不含國際機票。各路線細節以條目頁為準,觀光景點營業時間與票價以官方公告為主。
          </p>
        </footer>
      </div>
    </main>
  );
}

function SectionHeader({
  zh,
  en,
  note,
}: {
  zh: string;
  en: string;
  note?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">
      <div className="flex items-baseline gap-3">
        <span className="font-mincho text-base font-medium text-zinc-900 dark:text-zinc-50">
          {zh}
        </span>
        <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-amber-800 dark:text-amber-600/80">
          {en}
        </span>
      </div>
      {note && (
        <span className="text-[11px] text-zinc-500 tabular-nums">{note}</span>
      )}
    </div>
  );
}

function RegionGroup({
  region,
  rows,
}: {
  region: Region;
  rows: JapanEntryCard[];
}) {
  return (
    <div>
      <h3 className="font-mincho text-sm font-medium tracking-[0.1em] text-zinc-700 dark:text-zinc-300">
        {REGION_LABEL_ZH[region]}
        <span className="ml-2 text-[10px] tracking-normal text-zinc-400">
          {rows.length} 條
        </span>
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {rows.map((e) => (
          <ItineraryCard key={e.id} entry={e} />
        ))}
      </div>
    </div>
  );
}

function ItineraryCard({ entry }: { entry: JapanEntryCard }) {
  const days = extractDays(entry.tags);
  const chip = pickChip(entry.tags);
  return (
    <Link
      href={`/japan/entry/${entry.slug}`}
      className="group block rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-amber-700/50 dark:hover:border-amber-600/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-mincho text-[15px] font-medium text-zinc-900 dark:text-zinc-50 leading-snug group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
          {entry.title_zh}
        </h4>
        {days && (
          <span className="shrink-0 font-mincho text-[11px] tabular-nums font-medium text-amber-800 dark:text-amber-600/90">
            {days}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[11.5px] text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
        {entry.summary_zh}
      </p>
      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[10px] text-zinc-500">
        {chip && (
          <span className="rounded-sm bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 font-medium tracking-wide">
            {chip}
          </span>
        )}
        <span className="font-mincho tracking-wide">
          {entry.prefecture_ja}
          {entry.municipality_ja ? ` · ${entry.municipality_ja}` : ""}
        </span>
      </div>
    </Link>
  );
}
