import type { Metadata } from "next";
import Link from "next/link";
import {
  listEntriesForCard,
  type JapanEntryCard,
} from "@/lib/japan-entries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "自助實用備忘 · FAQ + 持物 + 交通卡 + 機場交通 | 日本大小事備忘錄",
  description:
    "海外卡領現金、Wi-Fi、地震對應、護照遺失、季節持物、JR Pass、IC 卡、機場交通比較 72 篇。自助旅行最常問的實務資訊整合。",
  alternates: { canonical: "/japan/practical" },
};

type SectionKey =
  | "faq"
  | "checklist"
  | "travel_pass"
  | "transport_guide"
  | "phrase";

type SectionMeta = {
  key: SectionKey;
  zh: string;
  en: string;
  note: string;
  glyph: string;
};

const SECTIONS: SectionMeta[] = [
  { key: "faq", zh: "FAQ + 危機應變", en: "FAQ", note: "錢/網/插座/急病/遺失", glyph: "?" },
  { key: "checklist", zh: "持物 + 入境準備", en: "Checklist", note: "4 季 + Visit Japan Web + 免稅", glyph: "✓" },
  { key: "travel_pass", zh: "交通卡 + JR Pass", en: "Travel Pass", note: "JR + IC + 觀光列車", glyph: "鉄" },
  { key: "transport_guide", zh: "機場 + 交通選擇", en: "Transport", note: "成田 vs 羽田 + 都市間比較", glyph: "✈" },
  { key: "phrase", zh: "日語救命片語", en: "Phrases", note: "餐廳/問路/急病/購物/旅館", glyph: "あ" },
];

export default async function PracticalPage() {
  const all = await listEntriesForCard({ limit: 5000 });
  const practical = all.filter((e) => e.tags?.includes("practical"));

  const grouped = new Map<SectionKey, JapanEntryCard[]>();
  for (const e of practical) {
    const st = e.sub_type as SectionKey | null;
    if (!st) continue;
    const bucket = grouped.get(st) ?? [];
    bucket.push(e);
    grouped.set(st, bucket);
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
              Practical
            </p>
            <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
              自&thinsp;助&thinsp;實&thinsp;用&thinsp;備&thinsp;忘
            </span>
          </div>
          <h1 className="mt-3 font-mincho text-4xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
            自助旅行實務 · {practical.length} 篇
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            出發前讀一遍可少 80% 慌亂:海外卡領現金 / Wi-Fi 三選一 / 插座規格 / 地震對應 / 護照遺失 / 季節持物 / JR Pass 6 種比較 / 成田 vs 羽田。
          </p>
        </header>

        <div className="mt-12 space-y-12">
          {SECTIONS.map((section) => {
            const entries = grouped.get(section.key) ?? [];
            if (entries.length === 0) return null;
            return (
              <PracticalSection
                key={section.key}
                section={section}
                entries={entries}
              />
            );
          })}
        </div>

        <footer className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 leading-relaxed">
          <p>
            票價 / 規則以官方為準。本備忘整理 2024-2026 主要資訊,JR Pass 等大幅變動方案以官網公告為主。
          </p>
        </footer>
      </div>
    </main>
  );
}

function PracticalSection({
  section,
  entries,
}: {
  section: SectionMeta;
  entries: JapanEntryCard[];
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div className="flex items-baseline gap-3">
          <span
            aria-hidden
            className="font-mincho inline-flex h-6 w-6 items-center justify-center rounded-sm bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-[12px] font-medium translate-y-[1px]"
          >
            {section.glyph}
          </span>
          <span className="font-mincho text-base font-medium text-zinc-900 dark:text-zinc-50">
            {section.zh}
          </span>
          <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-amber-800 dark:text-amber-600/80">
            {section.en}
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 tabular-nums">
          {entries.length} 篇 · {section.note}
        </span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {entries.map((e) => (
          <PracticalCard key={e.id} entry={e} />
        ))}
      </div>
    </section>
  );
}

function PracticalCard({ entry }: { entry: JapanEntryCard }) {
  const tags = entry.tags ?? [];
  const chip = tags.find((t) =>
    ["emergency", "atm", "wifi", "spring", "summer", "autumn", "winter", "family", "elderly", "ski", "luxury_train"].includes(t),
  );
  return (
    <Link
      href={`/japan/entry/${entry.slug}`}
      className="group block rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-amber-700/50 dark:hover:border-amber-600/40 transition-colors"
    >
      <h3 className="font-mincho text-[14px] font-medium text-zinc-900 dark:text-zinc-50 leading-snug group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
        {entry.title_zh}
      </h3>
      <p className="mt-1.5 text-[11.5px] text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
        {entry.summary_zh}
      </p>
      {chip && (
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded-sm bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 text-[10px] font-medium tracking-wide">
            {chip}
          </span>
        </div>
      )}
    </Link>
  );
}
