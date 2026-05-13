import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import {
  CATEGORIES,
  CATEGORY_LABEL_ZH,
  listEntriesForCounting,
  listMunicipalities,
  type Category,
  type Municipality,
} from "@/lib/japan-entries";
import {
  getAreaStyle,
  PREFECTURE_JIS,
  PREFECTURE_ROMAJI,
  HISTORICAL_PROVINCES,
  HISTORICAL_PROVINCE_MAP,
  HISTORICAL_PROVINCE_ORDER,
  SUPPORTED_PREFECTURES,
  type MotifType,
  type OrganizingStrategy,
} from "@/lib/japan-area-styles";
import { AreaMotif } from "@/components/japan/area-motif";

// ISR — 1 時間に 1 回再生成(egress 削減)
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}): Promise<Metadata> {
  const { prefecture } = await params;
  const name = decodeURIComponent(prefecture);
  return {
    title: `${name} · 日本大小事備忘錄`,
    description: `${name}全域市町村清單與旅遊條目索引。`,
    alternates: { canonical: `/japan/area/${encodeURIComponent(name)}` },
  };
}

export default async function PrefectureAreaPage({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}) {
  const { prefecture } = await params;
  const prefectureJa = decodeURIComponent(prefecture);
  if (!SUPPORTED_PREFECTURES.has(prefectureJa)) notFound();

  const style = getAreaStyle(prefectureJa);
  const volNumber = PREFECTURE_JIS[prefectureJa] ?? "—";
  const romaji = PREFECTURE_ROMAJI[prefectureJa] ?? "";

  const [munisRaw, entries] = await Promise.all([
    listMunicipalities({ prefecture_ja: prefectureJa }),
    listEntriesForCounting({ prefecture_ja: prefectureJa, excludeMeta: true }),
  ]);

  // 過濾:拿掉 prefecture 本体那筆(01000)。保留市/区/町/村。
  const munis = munisRaw.filter((m) => m.kind !== "prefecture");

  // 政令市の lg_code prefix 集合(該県内に X100 muni がある場合、X101-X199 は
  // 当該市の行政区とみなして本体に roll up する)。
  // 例:仙台市 04100 + 仙台市青葉区 04101..04105 → 04100 に集約
  // 注:東京都の 13101-13123(特別区)は該県に X100 muni 無いため roll up されない、
  // 各 ward が自治体 entity として独立。意図通り。
  const designatedCityPrefixes = new Set<string>();
  for (const m of munis) {
    if (m.kind === "designated_city") {
      designatedCityPrefixes.add(m.lg_code.slice(0, 2));
    }
  }
  const rollupLg = (lg: string): string => {
    if (lg.length !== 5) return lg;
    const pref = lg.slice(0, 2);
    if (!designatedCityPrefixes.has(pref)) return lg;
    const muniNum = Number.parseInt(lg.slice(2), 10);
    if (muniNum > 100 && muniNum < 200) return pref + "100";
    return lg;
  };

  // 計算每個市町村有多少 entry(by lg_code, with designated-city ward roll-up)
  const entryCountByLg = new Map<string, number>();
  for (const e of entries) {
    if (!e.lg_code) continue;
    const key = rollupLg(e.lg_code);
    entryCountByLg.set(key, (entryCountByLg.get(key) ?? 0) + 1);
  }

  // 每類計數
  const countByCategory = new Map<Category, number>();
  for (const c of CATEGORIES) countByCategory.set(c, 0);
  for (const e of entries) {
    countByCategory.set(e.category, (countByCategory.get(e.category) ?? 0) + 1);
  }

  // 市町村のグループ化 — prefecture ごとの organizing strategy に従う
  const groups = buildMuniGroups(prefectureJa, style.organizing, munis);

  const totalWithEntries = munis.filter(
    (m) => (entryCountByLg.get(m.lg_code) ?? 0) > 0,
  ).length;

  // 区分 stat のラベル — strategy に応じて意味を変える
  const groupStatLabel = GROUP_STAT_LABEL[style.organizing];

  // CSS variable 注入:area 個別 accent / atmosphere を style 経由で渡し、
  // tailwind class からは [color:var(--area-accent)] のように参照する。
  const cssVars = {
    "--area-accent": style.accent,
    "--area-accent-soft": style.accentSoft,
    "--area-atmosphere": style.atmosphere,
  } as React.CSSProperties;

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-zinc-50 dark:bg-black"
      style={cssVars}
    >
      {/* atmospheric wash — top gradient,prefecture ごとの空気感 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklab, var(--area-atmosphere) 18%, transparent) 0%, transparent 100%)",
        }}
      />
      {/* 大型 motif — 紙背の薄印 */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-120px] top-[80px] hidden opacity-[0.04] dark:opacity-[0.06] lg:block"
      >
        <AreaMotif
          motifType={style.motifType}
          color="var(--area-accent)"
          className="h-[520px] w-[520px]"
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-14">
        <Link
          href="/japan"
          className="font-mincho text-xs tracking-[0.3em] uppercase text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          ← 日本大小事備忘錄
        </Link>

        {/* 表紙 — 47卷地誌の卷之○ */}
        <header className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <span
                className="font-mincho text-[11px] tabular-nums tracking-[0.4em] uppercase"
                style={{ color: "var(--area-accent)" }}
              >
                Vol.&thinsp;{volNumber}
              </span>
              <span className="font-mincho text-[11px] tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
                ──
              </span>
              <span className="font-mincho text-[11px] tracking-[0.35em] uppercase text-zinc-500 dark:text-zinc-500">
                {romaji}
              </span>
            </div>

            <h1 className="font-mincho mt-4 text-5xl font-medium tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
              {prefectureJa}
            </h1>

            <p
              className="font-mincho mt-3 text-lg sm:text-xl"
              style={{ color: "var(--area-accent)" }}
            >
              {style.tagline}
            </p>
            <p className="font-mincho mt-1 text-[11px] tracking-[0.3em] uppercase text-zinc-500 dark:text-zinc-500">
              {style.taglineRomaji}
            </p>
          </div>

          {/* 朱印 — 右上に押される印 */}
          <div className="flex shrink-0 items-start justify-end">
            <AreaMotif
              motifType={style.motifType}
              color="var(--area-accent)"
              className="h-20 w-20 sm:h-24 sm:w-24"
              title={`${prefectureJa} seal`}
            />
          </div>
        </header>

        {/* 卷頭奥付 — 統計を漢書式に列挙 */}
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-zinc-300/60 py-5 sm:grid-cols-4 dark:border-zinc-700/40">
          <Stat
            label="市町村"
            sublabel="Cities"
            value={munis.length.toLocaleString()}
          />
          <Stat
            label={groupStatLabel.label}
            sublabel={groupStatLabel.sublabel}
            value={groups.length.toLocaleString()}
          />
          <Stat
            label="既収"
            sublabel="Active"
            value={totalWithEntries.toLocaleString()}
            accent
          />
          <Stat
            label="條目"
            sublabel="Entries"
            value={entries.length.toLocaleString()}
            accent
          />
        </dl>

        {/* 主題・時序 — slim grid。番付のような縦線 + ◆ marker */}
        <section
          aria-labelledby="themes-heading"
          className="mt-12"
        >
          <div className="flex items-baseline gap-3">
            <p
              className="font-mincho text-[11px] tracking-[0.4em] uppercase"
              style={{ color: "var(--area-accent)" }}
            >
              Themes
            </p>
            <h2
              id="themes-heading"
              className="font-mincho text-base font-medium tracking-[0.2em] text-zinc-700 dark:text-zinc-300"
            >
              主&thinsp;題&thinsp;入&thinsp;口
            </h2>
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {CATEGORIES.map((c) => {
              const count = countByCategory.get(c) ?? 0;
              const active = count > 0;
              return (
                <li key={c}>
                  <Link
                    href={`/japan/area/${encodeURIComponent(prefectureJa)}/${c}`}
                    className="group flex items-baseline gap-2.5 border-b border-dotted border-zinc-300/70 py-2.5 dark:border-zinc-700/60"
                  >
                    <span
                      aria-hidden
                      className="font-mincho text-[11px]"
                      style={{
                        color: active
                          ? "var(--area-accent)"
                          : "rgb(161 161 170 / 0.5)",
                      }}
                    >
                      {active ? "◆" : "◇"}
                    </span>
                    <span className="font-mincho text-lg font-medium text-zinc-900 transition-colors group-hover:[color:var(--area-accent)] dark:text-zinc-50">
                      {CATEGORY_LABEL_ZH[c]}
                    </span>
                    <span
                      aria-hidden
                      className="mx-1 flex-1 self-end mb-[5px] border-b border-dotted border-zinc-300 opacity-50 dark:border-zinc-700"
                    />
                    <span
                      className="font-mincho text-sm font-medium tabular-nums"
                      style={{
                        color: active
                          ? "var(--area-accent)"
                          : "rgb(161 161 170)",
                      }}
                    >
                      {count}
                    </span>
                    <span className="font-mincho text-[11px] text-zinc-500 dark:text-zinc-500">
                      條
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* 時序 — slim sub-row */}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <span className="font-mincho text-[11px] tracking-[0.35em] uppercase text-zinc-400 dark:text-zinc-600">
              Time
            </span>
            <SubLink
              href={`/japan/area/${encodeURIComponent(prefectureJa)}/when`}
            >
              何時可去
            </SubLink>
            <span
              aria-hidden
              className="font-mincho text-zinc-300 select-none dark:text-zinc-700"
            >
              ·
            </span>
            <SubLink
              href={`/japan/area/${encodeURIComponent(prefectureJa)}/calendar`}
            >
              年曆
            </SubLink>
          </div>
        </section>

        {/* 市町村索引 — 振興局ごとに章立て */}
        <section
          aria-labelledby="muni-heading"
          className="mt-14"
        >
          <div className="flex items-baseline gap-3">
            <p
              className="font-mincho text-[11px] tracking-[0.4em] uppercase"
              style={{ color: "var(--area-accent)" }}
            >
              Gazetteer
            </p>
            <h2
              id="muni-heading"
              className="font-mincho text-base font-medium tracking-[0.2em] text-zinc-700 dark:text-zinc-300"
            >
              市&thinsp;町&thinsp;村&thinsp;索&thinsp;引
            </h2>
            <span className="ml-auto font-mincho text-[11px] tracking-wider tabular-nums text-zinc-500 dark:text-zinc-500">
              {totalWithEntries}
              <span className="opacity-60">/{munis.length}</span>
            </span>
          </div>

          <p className="font-mincho mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            ◆ 印あり=既収/灰字=未収。点進皆可開空白入口。
          </p>

          <div className="mt-6 space-y-10">
            {groups.map((g, i) => {
              const withData = g.rows.filter(
                (m) => (entryCountByLg.get(m.lg_code) ?? 0) > 0,
              ).length;
              // 琉球三山章立てでは「南山」と「宮古諸島」の間に
              // 先島諸島ブレイク(本島→離島の文化跳躍)を挿入する。
              const insertSakishimaBreak =
                style.organizing === "ryukyu_sanzan" && g.key === "miyako";
              return (
                <Fragment key={g.key}>
                  {insertSakishimaBreak && (
                    <SakishimaBreak accent={style.accent} />
                  )}
                  <MuniGroupBlock
                    index={i + 1}
                    name={g.label}
                    romaji={g.romaji}
                    tagline={g.tagline}
                    glyph={g.glyph}
                    supplementary={g.supplementary}
                    rows={g.rows}
                    withData={withData}
                    motifType={style.motifType}
                    prefectureJa={prefectureJa}
                    entryCountByLg={entryCountByLg}
                    strategy={style.organizing}
                  />
                </Fragment>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

// 卷頭奥付の 1 stat セル
function Stat({
  label,
  sublabel,
  value,
  accent,
}: {
  label: string;
  sublabel: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-baseline gap-2">
        <span className="font-mincho text-base font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
        <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
          {sublabel}
        </span>
      </dt>
      <dd
        className="font-mincho text-3xl font-medium tabular-nums"
        style={{
          color: accent ? "var(--area-accent)" : undefined,
        }}
      >
        <span
          className={
            accent ? "" : "text-zinc-900 dark:text-zinc-50"
          }
        >
          {value}
        </span>
      </dd>
    </div>
  );
}

function SubLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group font-mincho inline-flex items-baseline gap-1 text-base text-zinc-700 transition-colors hover:[color:var(--area-accent)] dark:text-zinc-300"
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="text-zinc-400 transition-all group-hover:translate-x-0.5 group-hover:[color:var(--area-accent)] dark:text-zinc-600"
      >
        →
      </span>
    </Link>
  );
}

// 各 strategy の「区分 stat」用ラベル — 数字の意味が違うのでタイトルも切り替える
const GROUP_STAT_LABEL: Record<
  OrganizingStrategy,
  { label: string; sublabel: string }
> = {
  subprefecture: { label: "区分", sublabel: "Districts" },
  ryoseikoku: { label: "旧国", sublabel: "Provinces" },
  ryukyu_sanzan: { label: "三山", sublabel: "Sanzan + Isles" },
  single: { label: "区分", sublabel: "Sections" },
};

// muni group — 表示用の章。strategy ごとに作り方が違う。
interface MuniGroup {
  key: string;
  /** 主見出し — "石狩振興局" / "山城國" / "北山" / "市町村一覧" */
  label: string;
  /** romaji 副見出し(歷史章立てのみ)*/
  romaji?: string;
  /** 文化 tagline(歷史章立てのみ)*/
  tagline?: string;
  /** 章マーカー漢字一字(歷史章立てのみ。例:桜・栗・波 / 岳・城・潮)*/
  glyph?: string;
  /** 補章フラグ — 視覚的に降格(沖縄の大東諸島など) */
  supplementary?: boolean;
  rows: Municipality[];
}

// 北海道 14 振興局の表示順
const HOKKAIDO_SUBPREF_ORDER = [
  "石狩振興局",
  "渡島総合振興局",
  "檜山振興局",
  "後志総合振興局",
  "空知総合振興局",
  "上川総合振興局",
  "留萌振興局",
  "宗谷総合振興局",
  "オホーツク総合振興局",
  "胆振総合振興局",
  "日高振興局",
  "十勝総合振興局",
  "釧路総合振興局",
  "根室振興局",
  "市町村一覧",
];

function buildMuniGroups(
  prefectureJa: string,
  strategy: OrganizingStrategy,
  munis: Municipality[],
): MuniGroup[] {
  if (strategy === "subprefecture") {
    // DB の subprefecture_ja を使う(北海道専用)
    const buckets = new Map<string, Municipality[]>();
    for (const m of munis) {
      const key = m.subprefecture_ja ?? "市町村一覧";
      const arr = buckets.get(key) ?? [];
      arr.push(m);
      buckets.set(key, arr);
    }
    return [...buckets.keys()]
      .sort(
        (a, b) =>
          (HOKKAIDO_SUBPREF_ORDER.indexOf(a) === -1
            ? 99
            : HOKKAIDO_SUBPREF_ORDER.indexOf(a)) -
          (HOKKAIDO_SUBPREF_ORDER.indexOf(b) === -1
            ? 99
            : HOKKAIDO_SUBPREF_ORDER.indexOf(b)),
      )
      .map((k) => ({ key: k, label: k, rows: buckets.get(k) ?? [] }));
  }

  // 歷史章立て(京都の旧国 / 沖縄の三山)— データ形は同じ、表示が strategy で分岐
  if (strategy === "ryoseikoku" || strategy === "ryukyu_sanzan") {
    const map = HISTORICAL_PROVINCE_MAP[prefectureJa] ?? {};
    const provinces = HISTORICAL_PROVINCES[prefectureJa] ?? {};
    const order = HISTORICAL_PROVINCE_ORDER[prefectureJa] ?? [];
    const buckets = new Map<string, Municipality[]>();
    const orphans: Municipality[] = [];
    for (const m of munis) {
      const k = map[m.name_ja];
      if (k) {
        const arr = buckets.get(k) ?? [];
        arr.push(m);
        buckets.set(k, arr);
      } else {
        orphans.push(m);
      }
    }
    const groups: MuniGroup[] = order
      .filter((k) => buckets.has(k))
      .map((k) => {
        const p = provinces[k];
        return {
          key: k,
          label: p?.name ?? k,
          romaji: p?.romaji,
          tagline: p?.tagline,
          glyph: p?.glyph,
          supplementary: p?.supplementary,
          rows: buckets.get(k) ?? [],
        };
      });
    if (orphans.length > 0) {
      groups.push({ key: "_other", label: "その他", rows: orphans });
    }
    return groups;
  }

  // single — 全市町村まとめて 1 章
  return [{ key: "all", label: "市町村一覧", rows: munis }];
}

// 漢数字章番号 — 琉球三山章立て(壹貳參肆伍 + 補)で使う。
// 京都の "01-03" は印刷物的・整然、沖縄の漢数字は手書き的・古文書的アクセント。
const KANJI_NUMERALS = ["壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
function chapterIndexLabel(
  index: number,
  strategy: OrganizingStrategy,
  supplementary?: boolean,
): string {
  if (strategy === "ryukyu_sanzan") {
    if (supplementary) return "補";
    return KANJI_NUMERALS[index - 1] ?? String(index);
  }
  return String(index).padStart(2, "0");
}

// 立浪(たちなみ) — 琉球三山章の章末 separator。
// 紅型染や沖縄漆器の流水文を一筆風に SVG 化。京都の dotted underline と対比させる。
function StandingWave({
  className,
  color,
  opacity = 1,
  density = "normal",
}: {
  className?: string;
  color: string;
  opacity?: number;
  density?: "normal" | "muted";
}) {
  const strokeWidth = density === "muted" ? 0.9 : 1.4;
  return (
    <svg
      viewBox="0 0 320 12"
      className={className}
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden
    >
      <path
        d="M 0 8 Q 10 2 20 8 T 40 8 T 60 8 T 80 8 T 100 8 T 120 8 T 140 8 T 160 8 T 180 8 T 200 8 T 220 8 T 240 8 T 260 8 T 280 8 T 300 8 T 320 8"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
    </svg>
  );
}

// 先島(さきしま)離別記号 — 本島(三山)から先島(宮古・八重山)へ章が跨ぐ際の小さい区切り。
// 琉球王府は 1500 オヤケアカハチの乱以後やっと先島支配。地理 + 文化の断絶を視覚化する。
function SakishimaBreak({ accent }: { accent: string }) {
  return (
    <div className="my-6 flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-zinc-300/60 dark:bg-zinc-700/40" />
      <span
        className="font-mincho text-[10px] tracking-[0.5em] uppercase"
        style={{ color: accent, opacity: 0.7 }}
      >
        先 島 諸 島
      </span>
      <span
        className="font-mincho text-[9px] tracking-[0.35em] uppercase text-zinc-400 dark:text-zinc-600"
      >
        Sakishima
      </span>
      <span className="h-px flex-1 bg-zinc-300/60 dark:bg-zinc-700/40" />
    </div>
  );
}

function MuniGroupBlock({
  index,
  name,
  romaji,
  tagline,
  glyph,
  supplementary,
  rows,
  withData,
  motifType,
  prefectureJa,
  entryCountByLg,
  strategy,
}: {
  index: number;
  name: string;
  romaji?: string;
  tagline?: string;
  glyph?: string;
  supplementary?: boolean;
  rows: Municipality[];
  withData: number;
  motifType: MotifType;
  prefectureJa: string;
  entryCountByLg: Map<string, number>;
  strategy: OrganizingStrategy;
}) {
  const hasActive = withData > 0;
  const isSanzan = strategy === "ryukyu_sanzan";

  // 琉球は紅(accent)と藍(atmosphere)の bicolor:章番号・glyph は紅、tagline は黒潮藍。
  // 補章(大東)は accent_soft + 透明度を上げて視覚的に降格。
  const indexColor =
    isSanzan && supplementary
      ? "var(--area-accent-soft)"
      : hasActive
        ? "var(--area-accent)"
        : "rgb(161 161 170)";
  const glyphColor =
    isSanzan && supplementary
      ? "var(--area-accent-soft)"
      : hasActive
        ? "var(--area-accent)"
        : "rgb(161 161 170 / 0.5)";
  const taglineColor = isSanzan
    ? hasActive
      ? "var(--area-atmosphere)"
      : "rgb(161 161 170)"
    : hasActive
      ? "var(--area-accent)"
      : "rgb(161 161 170)";

  // 章番号フォントサイズ:琉球は漢數字 1 字なので少し大きめ + tracking なし
  const indexClass = isSanzan
    ? "font-mincho text-base font-medium leading-none"
    : "font-mincho text-[11px] tabular-nums tracking-[0.25em]";
  // 補章の見出しはやや細く・降格を視覚で表す
  const headingClass =
    isSanzan && supplementary
      ? "font-mincho text-lg font-normal text-zinc-700 dark:text-zinc-300"
      : "font-mincho text-xl font-medium text-zinc-900 dark:text-zinc-50";

  return (
    <article className="relative pl-6 sm:pl-7">
      {/* 章マーカー(左肩) — glyph があれば漢字一字、無ければ seal motif の小印 */}
      <span
        aria-hidden
        className="absolute left-0 top-1.5"
        style={{ color: glyphColor }}
      >
        {glyph ? (
          <span className="font-mincho text-base font-medium leading-none">
            {glyph}
          </span>
        ) : (
          <AreaMotif
            motifType={motifType}
            color="currentColor"
            className="h-4 w-4"
          />
        )}
      </span>

      <header
        className={
          isSanzan
            ? "pb-3"
            : "border-b border-zinc-300/60 pb-2 dark:border-zinc-700/50"
        }
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className={indexClass} style={{ color: indexColor }}>
            {chapterIndexLabel(index, strategy, supplementary)}
          </span>
          <h3 className={headingClass}>{name}</h3>
          {romaji && (
            <span className="font-mincho text-[10px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
              {romaji}
            </span>
          )}
          <span className="ml-auto font-mincho text-[11px] tabular-nums text-zinc-500 dark:text-zinc-500">
            {rows.length} 市町村
            <span className="opacity-50"> · </span>
            {withData} 既収
          </span>
        </div>
        {tagline && (
          <p
            className="font-mincho mt-1 text-xs sm:text-sm"
            style={{ color: taglineColor }}
          >
            {tagline}
          </p>
        )}
        {/* 琉球三山章は dotted underline ではなく立浪(海紋)で章を区切る。
             補章はストロークを細め、不透明度を下げて視覚的に降格。 */}
        {isSanzan && (
          <StandingWave
            className="mt-2 h-2.5 w-full"
            color={
              supplementary
                ? "var(--area-accent-soft)"
                : "var(--area-atmosphere)"
            }
            opacity={supplementary ? 0.5 : 0.85}
            density={supplementary ? "muted" : "normal"}
          />
        )}
      </header>

      <ul className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 font-mincho text-sm">
        {rows.map((m, i) => {
          const count = entryCountByLg.get(m.lg_code) ?? 0;
          const label =
            m.kind === "ward" && m.parent_city_ja
              ? `${m.parent_city_ja} ${m.name_ja}`
              : m.name_ja;
          return (
            <Fragment key={m.lg_code}>
              {i > 0 && (
                <span
                  aria-hidden
                  className="font-mincho text-zinc-300 select-none dark:text-zinc-700"
                >
                  ·
                </span>
              )}
              <Link
                href={`/japan/area/${encodeURIComponent(prefectureJa)}/${encodeURIComponent(m.name_ja)}`}
                className={
                  count > 0
                    ? "group inline-flex items-baseline gap-1 text-zinc-900 transition-colors hover:[color:var(--area-accent)] dark:text-zinc-100"
                    : "group inline-flex items-baseline gap-1 text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400"
                }
              >
                <span>{label}</span>
                {count > 0 && (
                  <span
                    className="font-mincho text-[11px] tabular-nums"
                    style={{ color: "var(--area-accent)" }}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </Fragment>
          );
        })}
      </ul>
    </article>
  );
}
