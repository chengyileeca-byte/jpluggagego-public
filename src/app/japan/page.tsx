import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  CATEGORIES,
  CATEGORY_LABEL_ZH,
  type Category,
} from "@/lib/japan-entries";
import { RegionBrowser } from "@/components/japan/region-browser";

// ISR — 1 時間に 1 回再生成(egress 削減)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "日本大小事備忘錄 | 繁中視角日本自由行資料庫",
  description:
    "從北海道到沖繩、從大城市到離島,繁中視角整理日本 6 大主題(食衣住行育樂)的旅遊情報。目前完整覆蓋北海道 6 大類與京都府食類深度版。",
  alternates: { canonical: "/japan" },
};

async function countByCategory(): Promise<Record<Category, number>> {
  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "japan_entries.json",
  );
  const all = JSON.parse(await fs.readFile(file, "utf-8")) as Array<{
    category: Category;
    source: string;
  }>;
  const out = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<
    Category,
    number
  >;
  // wiki-bulk (Phase 2b 2026-05-10) を Theme カウントから除外 — Claude curated のみ。
  // 詳細は docs/wiki-bulk-cleanup.md。
  for (const e of all) {
    if (e.source === "wikipedia") continue;
    if (out[e.category] !== undefined) out[e.category]++;
  }
  return out;
}

export default async function JapanHomePage() {
  const counts = await countByCategory();

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <Link
          href="/"
          className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← 回行李寄送比價
        </Link>

        <header className="mt-6">
          <h1 className="font-mincho text-4xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
            日本大小事備忘錄
          </h1>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            繁中視角整理日本自由行情報的編輯型資料庫。首頁的六大分類僅列
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              地區代表級以上
            </span>
            的精選條目;點進
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              地區頁
            </span>
            可看當地完整食衣住行育樂、依日期/年曆的時序查詢。目前完整涵蓋
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              北海道
            </span>
            (六大類)與
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              京都府
            </span>
            (食類深度版,千年古都完整性 mode)。
          </p>
        </header>

        {/* 地區索引 — 番付・索引風 main archive layout */}
        <RegionBrowser />

        {/* 副索引 — 時序 + 主題 cross-references。
            Atlas 已有 border-bottom,這裡用 mt-12 留白,不再加 top border。 */}
        <section
          aria-labelledby="secondary-index-heading"
          className="mt-12"
        >
          <div className="flex items-baseline gap-3">
            <p className="font-mincho text-[10px] tracking-[0.4em] uppercase text-amber-800 dark:text-amber-600/80">
              Secondary
            </p>
            <h2
              id="secondary-index-heading"
              className="font-mincho text-sm font-medium tracking-[0.2em] text-zinc-700 dark:text-zinc-300"
            >
              副&thinsp;索&thinsp;引
            </h2>
          </div>

          <dl className="mt-4 divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
            {/* 時序 — When / Calendar */}
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 py-3.5">
              <IndexLabel zh="時序" en="Time" />
              <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <SubLink href="/japan/when" arrow>
                  何時可去
                </SubLink>
                <Sep />
                <SubLink href="/japan/calendar" arrow>
                  年曆
                </SubLink>
              </dd>
            </div>

            {/* 主題 — 6 categories(slim 横軸 nav,書脊章節列表風) */}
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 py-3.5">
              <IndexLabel zh="主題" en="Theme" />
              <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {CATEGORIES.map((c, i) => (
                  <Fragment key={c}>
                    {i > 0 && <Sep />}
                    <SubLink href={`/japan/${c}`} count={counts[c]}>
                      {CATEGORY_LABEL_ZH[c]}
                    </SubLink>
                  </Fragment>
                ))}
              </dd>
            </div>

            {/* 規劃 — Itineraries (地域 + 主題 路線套餐) + 月曆 + Planner */}
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 py-3.5">
              <IndexLabel zh="規劃" en="Plan" />
              <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <SubLink href="/japan/planner" arrow>
                  自分プランナー
                </SubLink>
                <Sep />
                <SubLink href="/japan/itineraries" arrow>
                  行程套餐
                </SubLink>
                <Sep />
                <SubLink href="/japan/monthly" arrow>
                  月別月曆
                </SubLink>
                <Sep />
                <SubLink href="/japan/practical" arrow>
                  自助實用
                </SubLink>
              </dd>
            </div>
          </dl>
        </section>

        <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
          <p>
            本頁為{" "}
            <Link href="/" className="underline hover:text-zinc-700">
              日本行李寄送比價
            </Link>{" "}
            的擴充:整理日本旅遊情報。資料為編輯整理的原創摘要,來源標註於各條目頁。
          </p>
        </footer>
      </div>
    </main>
  );
}

// dt label group — kanji 名 + romaji small caps,固定最小寬度讓 dd 內容對齊
function IndexLabel({ zh, en }: { zh: string; en: string }) {
  return (
    <dt className="flex items-baseline gap-2 min-w-[92px]">
      <span className="font-mincho text-base font-medium text-zinc-900 dark:text-zinc-50">
        {zh}
      </span>
      <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
        {en}
      </span>
    </dt>
  );
}

// 索引項 — 路由連結。有 count 顯示 amber 數字 affordance,
// 沒 count 用 → arrow affordance。Hover 時 amber-900 + arrow translate。
function SubLink({
  href,
  children,
  count,
  arrow,
}: {
  href: string;
  children: React.ReactNode;
  count?: number;
  arrow?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group font-mincho inline-flex items-baseline gap-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
    >
      <span>{children}</span>
      {count !== undefined && (
        <span className="font-mincho tabular-nums text-xs font-medium text-amber-800 dark:text-amber-600/90 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
          {count}
        </span>
      )}
      {arrow && (
        <span
          aria-hidden
          className="text-zinc-400 dark:text-zinc-600 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-all group-hover:translate-x-0.5"
        >
          →
        </span>
      )}
    </Link>
  );
}

// 中点分隔符 — 索引項 between
function Sep() {
  return (
    <span
      aria-hidden
      className="font-mincho text-zinc-300 dark:text-zinc-700 select-none"
    >
      ·
    </span>
  );
}
