// /japan/area/[prefecture]/[slug] — 動態段合流路由
//
// [slug] 同時承擔兩個用途:
//   1. category 深度頁(slug = food/lodging/transport/fashion/culture/entertainment)
//   2. 市町村頁(slug = 北海道下的市/区/町/村名,例:札幌市、函館市、ニセコ町)
//
// Next.js 不允許 [category] 與 [municipality] 兩個動態段並存,所以合併在同一
// segment,程式內依 slug 先比對是否為 Category,若是就走 category 分支,否則
// 當作 municipality 名稱去查 japan_municipalities。
//
// 兩邊不可能同字:category 是英文 slug,municipality 是日文漢字/假名。

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  CATEGORY_LABEL_ZH,
  SUB_TYPES_BY_CATEGORY,
  listEntriesForCard,
  listMunicipalities,
  subTypeLabel,
  type Category,
  type JapanEntryCard,
  type Municipality,
} from "@/lib/japan-entries";
import {
  formatSeasonRange,
  isInSeason,
  priceTierLabel,
} from "@/lib/japan-prep-ui";
import { SUPPORTED_PREFECTURES } from "@/lib/japan-area-styles";

// ISR — 1 時間に 1 回再生成(force-dynamic は egress 浪費)
export const revalidate = 3600;

function isCategory(x: string): x is Category {
  return (CATEGORIES as readonly string[]).includes(x);
}

// ---------- metadata dispatch ----------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefecture: string; slug: string }>;
}): Promise<Metadata> {
  const { prefecture, slug } = await params;
  const prefectureJa = decodeURIComponent(prefecture);
  const slugDec = decodeURIComponent(slug);
  if (!SUPPORTED_PREFECTURES.has(prefectureJa)) return {};

  if (isCategory(slugDec)) {
    const catZh = CATEGORY_LABEL_ZH[slugDec];
    return {
      title: `${prefectureJa} · ${catZh} | 日本大小事備忘錄`,
      description: `${prefectureJa}全域 ${catZh} 類條目。依 sub_type 分組,含季節進行中標記。`,
      alternates: {
        canonical: `/japan/area/${encodeURIComponent(prefectureJa)}/${slugDec}`,
      },
    };
  }
  return {
    title: `${prefectureJa} · ${slugDec} · 日本大小事備忘錄`,
    description: `${prefectureJa} ${slugDec} 的旅遊情報條目。`,
    alternates: {
      canonical: `/japan/area/${encodeURIComponent(prefectureJa)}/${encodeURIComponent(slugDec)}`,
    },
  };
}

// ---------- page dispatch ----------

export default async function AreaSlugPage({
  params,
}: {
  params: Promise<{ prefecture: string; slug: string }>;
}) {
  const { prefecture, slug } = await params;
  const prefectureJa = decodeURIComponent(prefecture);
  const slugDec = decodeURIComponent(slug);
  if (!SUPPORTED_PREFECTURES.has(prefectureJa)) notFound();

  if (isCategory(slugDec)) {
    return <CategoryView prefectureJa={prefectureJa} category={slugDec} />;
  }
  return <MunicipalityView prefectureJa={prefectureJa} nameJa={slugDec} />;
}

// ====================== Category 分支 ======================

async function CategoryView({
  prefectureJa,
  category,
}: {
  prefectureJa: string;
  category: Category;
}) {
  const all = await listEntriesForCard({
    category,
    prefecture_ja: prefectureJa,
    excludeMeta: true,
  });

  const grouped = new Map<string, JapanEntryCard[]>();
  for (const st of SUB_TYPES_BY_CATEGORY[category]) grouped.set(st, []);
  for (const e of all) {
    const bucket = grouped.get(e.sub_type) ?? [];
    bucket.push(e);
    grouped.set(e.sub_type, bucket);
  }

  const today = new Date();
  const inSeasonCount = all.filter((e) =>
    isInSeason({ start: e.season_start, end: e.season_end }, today),
  ).length;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-14">
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
            {prefectureJa} · {CATEGORY_LABEL_ZH[category]}
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            共 {all.length} 筆
            {inSeasonCount > 0 ? `,${inSeasonCount} 筆季節限定進行中` : ""}。
          </p>
        </header>

        {all.length === 0 ? (
          <p className="mt-10 text-center text-sm text-zinc-500">
            尚無資料。
          </p>
        ) : (
          <div className="mt-10 space-y-10">
            {[...grouped.entries()]
              .filter(([, rows]) => rows.length > 0)
              .map(([subType, rows]) => (
                <SubTypeSection
                  key={subType}
                  subType={subType}
                  rows={rows}
                  today={today}
                />
              ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SubTypeSection({
  subType,
  rows,
  today,
}: {
  subType: string;
  rows: JapanEntryCard[];
  today: Date;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {subTypeLabel(subType)}
        </h2>
        <span className="text-[11px] text-zinc-500">{rows.length} 筆</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {rows.map((e) => (
          <CategoryCard key={e.id} entry={e} today={today} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ entry, today }: { entry: JapanEntryCard; today: Date }) {
  const season = formatSeasonRange({
    start: entry.season_start,
    end: entry.season_end,
  });
  const active = isInSeason(
    { start: entry.season_start, end: entry.season_end },
    today,
  );
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
        {active && (
          <span className="shrink-0 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1.5 py-0.5 text-[10px] font-medium">
            季節中
          </span>
        )}
      </div>
      <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
        {entry.summary_zh}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] text-zinc-500">
        <span>
          {entry.municipality_ja ?? entry.prefecture_ja}
        </span>
        {season && <span className="font-mono">{season}</span>}
        {price && <span>{price}</span>}
      </div>
    </Link>
  );
}

// ====================== Municipality 分支 ======================

async function findMunicipality(
  prefectureJa: string,
  nameJa: string,
): Promise<Municipality | null> {
  const rows = await listMunicipalities({ prefecture_ja: prefectureJa });
  const nonPref = rows.filter(
    (m) => m.kind !== "prefecture" && m.name_ja === nameJa,
  );
  if (nonPref.length === 0) return null;
  const nonWard = nonPref.find((m) => m.kind !== "ward");
  return nonWard ?? nonPref[0];
}

async function listEntriesByLgCodes(
  lgCodes: string[],
): Promise<JapanEntryCard[]> {
  if (lgCodes.length === 0) return [];
  // listEntriesForCard で軽量取得(content_md 等を pull しない)
  return listEntriesForCard({ lg_codes: lgCodes, excludeMeta: true });
}

async function MunicipalityView({
  prefectureJa,
  nameJa,
}: {
  prefectureJa: string;
  nameJa: string;
}) {
  const target = await findMunicipality(prefectureJa, nameJa);
  if (!target) notFound();

  const lgCodes = [target.lg_code];
  if (target.kind === "designated_city") {
    // 政令市 ward は japan_municipalities.json に登録なし(全 0 件)だが、
    // entries 側は ward lg_code(X101-X199 範囲)で記録済。lg_code prefix で
    // 該政令市配下の ward 範囲を生成して entries query に渡す。
    // 例:仙台市 04100 → 04101..04199(実在は 04101-04105 だが過剰でも害無し)
    const prefix = target.lg_code.slice(0, 2);
    for (let i = 101; i < 200; i++) {
      lgCodes.push(prefix + i.toString().padStart(3, "0"));
    }
  }

  const entries = await listEntriesByLgCodes(lgCodes);
  const today = new Date();

  const pathParts: string[] = [];
  if (target.subprefecture_ja) pathParts.push(target.subprefecture_ja);
  if (target.gun_ja) pathParts.push(target.gun_ja);
  if (target.parent_city_ja && target.kind === "ward") {
    pathParts.push(target.parent_city_ja);
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Link
          href={`/japan/area/${encodeURIComponent(prefectureJa)}`}
          className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← {prefectureJa}
        </Link>

        <header className="mt-6">
          <div className="text-[11px] text-zinc-500 font-mono">
            {prefectureJa} · {pathParts.join(" · ") || "—"} · LG {target.lg_code}
          </div>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {target.name_ja}
            {target.name_kana && (
              <span className="ml-2 text-sm font-normal text-zinc-500">
                ({target.name_kana})
              </span>
            )}
          </h1>
        </header>

        {entries.length === 0 ? (
          <EmptyState name={target.name_ja} />
        ) : (
          <div className="mt-8 space-y-3">
            {entries.map((e) => (
              <MunicipalityRow key={e.id} entry={e} today={today} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function MunicipalityRow({ entry, today }: { entry: JapanEntryCard; today: Date }) {
  const active = isInSeason(
    { start: entry.season_start, end: entry.season_end },
    today,
  );
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
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-700 dark:text-zinc-300">
              {CATEGORY_LABEL_ZH[entry.category]} · {subTypeLabel(entry.sub_type)}
            </span>
            {active && (
              <span className="rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-1.5 py-0.5 text-[10px] font-medium">
                進行中
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {entry.title_zh}
          </h3>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {entry.summary_zh}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] text-zinc-500">
            {season && <span className="font-mono">{season}</span>}
            {price && <span>{price}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ name }: { name: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 text-center">
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        {name} 目前尚無資料。
      </p>
      <p className="mt-2 text-xs text-zinc-500">
        如果你住過、去過這裡,未來將開放使用者回報,協助補齊內容。
      </p>
      <Link
        href="/japan"
        className="mt-5 inline-flex rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 text-xs font-semibold hover:opacity-90"
      >
        回首頁
      </Link>
    </div>
  );
}
