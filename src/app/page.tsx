import Link from "next/link";
import { promises as fs } from "node:fs";
import path from "node:path";
import { HOME_SIZES } from "@/lib/home-sizes";
import { HomeSizeSelector } from "./_home-size-selector";
import { FlightDeadline } from "./_flight-deadline";
import { DeliveryAlertMarquee } from "./_delivery-alert-marquee";
import { t, tf } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { LangSwitcher } from "./_lang-switcher";
import { POPULAR_ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

const DEFAULT_SIZE = "160";
const VALID_SIZE_CODES = new Set<string>(HOME_SIZES.map((s) => s.code));

type Price = { yamato: number | null; yuu: number | null };

type FareRow = { from_pref: string; to_pref: string; size_code: string; price_jpy: number };

let _yamatoFares: FareRow[] | null = null;
let _yuuFares: FareRow[] | null = null;

async function fetchPrices(size: string): Promise<Price[]> {
  if (!_yamatoFares) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yamato_fares.json"),
      "utf-8",
    );
    _yamatoFares = JSON.parse(raw) as FareRow[];
  }
  if (!_yuuFares) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yuu_pack_fares.json"),
      "utf-8",
    );
    _yuuFares = JSON.parse(raw) as FareRow[];
  }

  const fromPrefs = new Set(POPULAR_ROUTES.map((r) => r.fromPref));
  const toPrefs = new Set(POPULAR_ROUTES.map((r) => r.toPref));
  const matches = (r: FareRow) =>
    r.size_code === size && fromPrefs.has(r.from_pref) && toPrefs.has(r.to_pref);

  const key = (from: string, to: string) => `${from}|${to}`;
  const yMap = new Map(
    _yamatoFares.filter(matches).map((r) => [key(r.from_pref, r.to_pref), r.price_jpy]),
  );
  const uMap = new Map(
    _yuuFares.filter(matches).map((r) => [key(r.from_pref, r.to_pref), r.price_jpy]),
  );

  return POPULAR_ROUTES.map((r) => ({
    yamato: yMap.get(key(r.fromPref, r.toPref)) ?? null,
    yuu: uMap.get(key(r.fromPref, r.toPref)) ?? null,
  }));
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ size?: string }>;
}) {
  const sp = await searchParams;
  const size =
    sp.size && VALID_SIZE_CODES.has(sp.size) ? sp.size : DEFAULT_SIZE;
  const [prices, lang] = await Promise.all([fetchPrices(size), getLang()]);
  const sizeLabel =
    HOME_SIZES.find((s) => s.code === size)?.label ?? size;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* 配送遅延 marquee — active alert なし時は null 返却で消える */}
      <DeliveryAlertMarquee />
      <div className="px-6 py-24 mx-auto max-w-3xl">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-500">
            {t(lang, "site.brand")} · jpluggagego.com
          </p>
          <LangSwitcher current={lang} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
          {t(lang, "hero.title.line1")}
          <br />
          {t(lang, "hero.title.line2")}
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {t(lang, "hero.lead")}
        </p>
        <p className="mt-4 text-base text-zinc-500 leading-relaxed">
          {t(lang, "hero.free")}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/quote"
            className="inline-flex items-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            {t(lang, "hero.cta.quote")}
          </Link>
          <Link
            href="/trip"
            className="inline-flex items-center rounded-lg border border-zinc-900 dark:border-white text-zinc-900 dark:text-white px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-colors"
          >
            {t(lang, "hero.cta.trip")}
          </Link>
          <span className="inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-xs text-zinc-600 dark:text-zinc-400">
            {t(lang, "hero.chip.coverage")}
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-xs text-zinc-600 dark:text-zinc-400">
            {t(lang, "hero.chip.line")}
          </span>
        </div>

        <section className="mt-12">
          <FlightDeadline lang={lang} />
        </section>

        <section id="popular" className="mt-12 scroll-mt-6">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {t(lang, "home.popular.header")}
            </h2>
            <HomeSizeSelector size={size} />
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-sm">
              <thead className="text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="text-left font-normal px-4 py-3">
                    {t(lang, "home.popular.col.route")}
                  </th>
                  <th className="text-right font-normal px-3 py-3">Yamato</th>
                  <th className="text-right font-normal px-3 py-3">ゆう</th>
                  <th className="text-right font-normal px-4 py-3">
                    {t(lang, "home.popular.col.diff")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {POPULAR_ROUTES.map((route, i) => {
                  const { yamato, yuu } = prices[i];
                  const diff =
                    yamato != null && yuu != null ? yamato - yuu : null;
                  const winner =
                    diff == null
                      ? null
                      : diff < 0
                        ? "yamato"
                        : diff > 0
                          ? "yuu"
                          : "tie";
                  return (
                    <tr
                      key={route.label}
                      className="border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/routes/${route.slug}`}
                          className="block"
                        >
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">
                            {route.label}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {t(lang, route.subKey)}
                          </div>
                        </Link>
                      </td>
                      <td
                        className={`text-right px-3 py-3 tabular-nums ${
                          winner === "yamato"
                            ? "font-semibold text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {yamato != null ? `¥${yamato.toLocaleString()}` : "—"}
                      </td>
                      <td
                        className={`text-right px-3 py-3 tabular-nums ${
                          winner === "yuu"
                            ? "font-semibold text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {yuu != null ? `¥${yuu.toLocaleString()}` : "—"}
                      </td>
                      <td className="text-right px-4 py-3 text-xs tabular-nums">
                        {diff == null ? (
                          <span className="text-zinc-400">—</span>
                        ) : diff === 0 ? (
                          <span className="text-zinc-500">
                            {t(lang, "home.popular.diff.equal")}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {tf(
                              lang,
                              diff < 0
                                ? "home.popular.diff.yamato_save"
                                : "home.popular.diff.yuu_save",
                              { amount: Math.abs(diff).toLocaleString() },
                            )}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
            ※ {sizeLabel} · {t(lang, "home.popular.footer")}
          </p>
        </section>

        <section className="mt-12 grid gap-3 sm:grid-cols-3">
          <Link
            href="/guide/shipping"
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
          >
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {t(lang, "home.help.guide")} →
            </div>
          </Link>
          <Link
            href="/to-taiwan"
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
          >
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {t(lang, "home.help.toTaiwan")} →
            </div>
          </Link>
          <Link
            href="/faq"
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
          >
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {t(lang, "home.help.faq")} →
            </div>
          </Link>
        </section>

        <p className="mt-6 text-center text-xs text-zinc-500">
          <Link href="/japan" className="hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline">
            日本大小事備忘錄 →
          </Link>
        </p>
      </div>
    </main>
  );
}
