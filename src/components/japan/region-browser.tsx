import Link from "next/link";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  REGION_ORDER,
  REGION_PREFECTURES,
  REGION_LABEL_JA,
  REGION_LABEL_ROMAJI,
  REGION_NUMERAL,
  type Prefecture,
} from "@/lib/japan-regions";

// 「千年古都 archive」aesthetic — 番付・索引風レイアウト。
// 9 大地區を 漢數字編號 + 縦線アクセント で章立てし、
// 各 prefecture を mincho 體の見出し + romaji small caps + 條目数 のリストで列挙。
// 資料がある prefecture は ◆ マーカ + 朱系アクセントで強調、
// 未整理は灰色 + italic Latin で「索引にあるが未着手」の体を示す。

async function fetchPrefectureCounts(): Promise<Map<string, number>> {
  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "japan_entries.json",
  );
  const all = JSON.parse(await fs.readFile(file, "utf-8")) as Array<{
    prefecture_ja: string;
    feature_rank: number;
  }>;
  const counts = new Map<string, number>();
  for (const r of all) {
    if (r.feature_rank < 0) continue;
    counts.set(r.prefecture_ja, (counts.get(r.prefecture_ja) ?? 0) + 1);
  }
  return counts;
}

export async function RegionBrowser() {
  const counts = await fetchPrefectureCounts();
  const totalActive = REGION_ORDER.flatMap((r) => REGION_PREFECTURES[r]).filter(
    (p) => (counts.get(p.name_ja) ?? 0) > 0,
  ).length;
  const totalEntries = [...counts.values()].reduce((a, b) => a + b, 0);

  return (
    <section
      aria-labelledby="region-browse-heading"
      className="relative mt-12 border-y border-zinc-300/60 dark:border-zinc-700/40 py-10"
    >
      {/* 表頭 — 索引扉ページ風 */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mincho text-[10px] tracking-[0.4em] uppercase text-amber-800 dark:text-amber-600/80">
            Atlas of Japan
          </p>
          <h2
            id="region-browse-heading"
            className="font-mincho mt-1 text-3xl font-medium text-zinc-900 dark:text-zinc-50"
          >
            地&thinsp;區&thinsp;索&thinsp;引
          </h2>
        </div>
        <div className="flex shrink-0 flex-col items-start sm:items-end gap-1 font-mincho text-zinc-600 dark:text-zinc-400">
          <div className="text-[11px] tabular-nums tracking-wider">
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">
              {totalActive}
            </span>
            <span className="opacity-60"> / 47 都道府縣</span>
          </div>
          <div className="text-[11px] tabular-nums tracking-wider opacity-70">
            <span className="text-amber-800 dark:text-amber-600/90 font-medium">
              {totalEntries.toLocaleString()}
            </span>
            <span className="opacity-60"> 條目已整理</span>
          </div>
        </div>
      </header>

      {/* 9 region 章立て */}
      <div className="mt-8 grid gap-x-10 gap-y-8 lg:grid-cols-2">
        {REGION_ORDER.map((region) => {
          const prefs = REGION_PREFECTURES[region];
          const activeInRegion = prefs.filter(
            (p) => (counts.get(p.name_ja) ?? 0) > 0,
          ).length;
          return (
            <RegionSection
              key={region}
              numeral={REGION_NUMERAL[region]}
              ja={REGION_LABEL_JA[region]}
              romaji={REGION_LABEL_ROMAJI[region]}
              activeCount={activeInRegion}
              totalCount={prefs.length}
              prefectures={prefs}
              counts={counts}
            />
          );
        })}
      </div>
    </section>
  );
}

function RegionSection({
  numeral,
  ja,
  romaji,
  activeCount,
  totalCount,
  prefectures,
  counts,
}: {
  numeral: string;
  ja: string;
  romaji: string;
  activeCount: number;
  totalCount: number;
  prefectures: Prefecture[];
  counts: Map<string, number>;
}) {
  const hasActive = activeCount > 0;
  return (
    <article
      className={`relative pl-5 sm:pl-6 ${
        hasActive ? "" : "opacity-70"
      }`}
    >
      {/* 縦アクセント線 — active region は朱、未整理は灰 */}
      <span
        aria-hidden
        className={`absolute left-0 top-2 bottom-2 w-px ${
          hasActive
            ? "bg-amber-700/70 dark:bg-amber-700/60"
            : "bg-zinc-300 dark:bg-zinc-700"
        }`}
      />

      {/* 章見出し */}
      <header className="flex items-baseline gap-3 pb-2">
        <span
          className={`font-mincho text-[11px] tabular-nums tracking-[0.2em] ${
            hasActive
              ? "text-amber-800 dark:text-amber-600/90"
              : "text-zinc-400 dark:text-zinc-600"
          }`}
        >
          {numeral}
        </span>
        <h3 className="font-mincho text-xl font-medium text-zinc-900 dark:text-zinc-50">
          {ja}
        </h3>
        <span className="font-mincho text-[10px] tracking-[0.25em] uppercase text-zinc-400 dark:text-zinc-600">
          {romaji}
        </span>
        <span className="ml-auto font-mincho text-[10px] tabular-nums text-zinc-500 dark:text-zinc-500">
          {activeCount}/{totalCount}
        </span>
      </header>

      {/* prefecture リスト */}
      <ul className="mt-1 divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
        {prefectures.map((p) => {
          const count = counts.get(p.name_ja) ?? 0;
          return (
            <PrefectureRow
              key={p.code}
              prefecture={p}
              count={count}
            />
          );
        })}
      </ul>
    </article>
  );
}

function PrefectureRow({
  prefecture,
  count,
}: {
  prefecture: Prefecture;
  count: number;
}) {
  const active = count > 0;
  const href = `/japan/area/${encodeURIComponent(prefecture.name_ja)}`;

  if (!active) {
    return (
      <li className="group flex items-baseline gap-3 py-1.5 text-zinc-400 dark:text-zinc-600">
        <span aria-hidden className="font-mincho text-[10px] opacity-40">
          ·
        </span>
        <span className="font-mincho text-sm">{prefecture.name_ja}</span>
        <span className="font-mincho text-[10px] tracking-[0.18em] uppercase opacity-50">
          {prefecture.romaji}
        </span>
        <span className="ml-auto font-mincho text-[10px] italic opacity-50">
          to come
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="group flex items-baseline gap-3 py-1.5 transition-colors hover:bg-amber-50/40 dark:hover:bg-amber-900/10"
      >
        <span
          aria-hidden
          className="font-mincho text-[10px] text-amber-700 dark:text-amber-600/90"
        >
          ◆
        </span>
        <span className="font-mincho text-sm font-medium text-zinc-900 dark:text-zinc-50 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
          {prefecture.name_ja}
        </span>
        <span className="font-mincho text-[10px] tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-500">
          {prefecture.romaji}
        </span>
        {/* dot leader — 索引古版風 */}
        <span
          aria-hidden
          className="mx-1 flex-1 self-end mb-[5px] border-b border-dotted border-zinc-300 dark:border-zinc-700/80 opacity-60"
        />
        <span className="font-mincho text-xs tabular-nums text-amber-800 dark:text-amber-600/90 font-medium">
          {count.toLocaleString()}
        </span>
        <span className="font-mincho text-[10px] text-zinc-500 dark:text-zinc-500">
          條
        </span>
        <span
          aria-hidden
          className="font-mincho text-xs text-zinc-400 dark:text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-700 dark:group-hover:text-amber-500"
        >
          →
        </span>
      </Link>
    </li>
  );
}
