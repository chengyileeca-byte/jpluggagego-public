import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  POPULAR_ROUTES,
  findRouteBySlug,
  routeFromParam,
  type PopularRoute,
} from "@/lib/routes";
import { HOME_SIZES } from "@/lib/home-sizes";
import { estimateTransit } from "@/lib/transit-days";
import {
  airporterCoverage,
  AIRPORTER_URL,
  AIRPORTER_PRICE_NOTE_KEY,
} from "@/lib/airporter";
import { YUU_PACK_AIRPORT_COUNTERS } from "@/lib/yuu-pack-airport-counters";
import { t, tf } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { LangSwitcher } from "../../_lang-switcher";

export const dynamic = "force-dynamic";

const SIZE_CODES = ["60", "80", "100", "120", "140", "160"] as const;
const BASE_URL = "https://jpluggagego.com";

interface CounterRow {
  airport_iata: string;
  airport_name_jp: string;
  terminal: string | null;
  service_type: string;
  floor: string | null;
}

export function generateStaticParams() {
  return POPULAR_ROUTES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = findRouteBySlug(slug);
  if (!route) return {};
  const lang = await getLang();
  const title = tf(lang, "route.title", {
    from: route.fromLabel,
    to: route.toPref,
  });
  const description = tf(lang, "route.desc", {
    from: route.fromLabel,
    to: route.toPref,
  });
  const ogQs = new URLSearchParams({
    from: routeFromParam(route),
    to_pref: route.toPref,
    size: "160",
  }).toString();
  const ogUrl = `/api/og/quote?${ogQs}`;
  const canonical = `/routes/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

type FareRow = {
  from_pref: string;
  to_pref: string;
  size_code: string;
  price_jpy: number;
  scraped_at: string;
};

let _yamatoFaresCache: FareRow[] | null = null;
let _yuuFaresCache: FareRow[] | null = null;
let _airportCountersCache: CounterRow[] | null = null;

async function loadAirportCounters(): Promise<CounterRow[]> {
  if (_airportCountersCache) return _airportCountersCache;
  const raw = await fs.readFile(
    path.join(process.cwd(), "public", "data", "yamato_airport_counters.json"),
    "utf-8",
  );
  _airportCountersCache = JSON.parse(raw) as CounterRow[];
  return _airportCountersCache;
}

async function fetchRoutePrices(route: PopularRoute) {
  if (!_yamatoFaresCache) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yamato_fares.json"),
      "utf-8",
    );
    _yamatoFaresCache = JSON.parse(raw) as FareRow[];
  }
  if (!_yuuFaresCache) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yuu_pack_fares.json"),
      "utf-8",
    );
    _yuuFaresCache = JSON.parse(raw) as FareRow[];
  }

  const sizeSet = new Set<string>(SIZE_CODES);
  const matches = (r: FareRow) =>
    r.from_pref === route.fromPref &&
    r.to_pref === route.toPref &&
    sizeSet.has(r.size_code);

  const yamatoMap = new Map<string, { price_jpy: number; scraped_at: string }>(
    _yamatoFaresCache
      .filter(matches)
      .map((r) => [r.size_code, { price_jpy: r.price_jpy, scraped_at: r.scraped_at }]),
  );
  const yuuMap = new Map<string, { price_jpy: number; scraped_at: string }>(
    _yuuFaresCache
      .filter(matches)
      .map((r) => [r.size_code, { price_jpy: r.price_jpy, scraped_at: r.scraped_at }]),
  );
  return { yamatoMap, yuuMap };
}

async function fetchAirportCounters(iata: string): Promise<CounterRow[]> {
  const all = await loadAirportCounters();
  return all
    .filter(
      (c) =>
        c.airport_iata === iata &&
        (c.service_type === "発送" || c.service_type === "受取・発送"),
    )
    .sort((a, b) =>
      a.airport_name_jp < b.airport_name_jp
        ? -1
        : a.airport_name_jp > b.airport_name_jp
          ? 1
          : 0,
    );
}

export default async function RouteLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = findRouteBySlug(slug);
  if (!route) notFound();

  const lang = await getLang();
  const { yamatoMap, yuuMap } = await fetchRoutePrices(route);

  const rows = SIZE_CODES.map((code) => {
    const ya = yamatoMap.get(code)?.price_jpy ?? null;
    const yu = yuuMap.get(code)?.price_jpy ?? null;
    const diff = ya != null && yu != null ? ya - yu : null;
    const winner: "yamato" | "yuu" | "tie" | null =
      diff == null ? null : diff < 0 ? "yamato" : diff > 0 ? "yuu" : "tie";
    const sizeInfo = HOME_SIZES.find((s) => s.code === code);
    return { code, ya, yu, diff, winner, label: sizeInfo?.label ?? code };
  });

  const latestScrapedAt = [
    ...[...yamatoMap.values()].map((v) => v.scraped_at),
    ...[...yuuMap.values()].map((v) => v.scraped_at),
  ]
    .filter(Boolean)
    .sort()
    .pop();

  const yamatoCounters =
    route.fromKind === "airport" && route.fromCode
      ? await fetchAirportCounters(route.fromCode)
      : [];

  const yuuCounters =
    route.fromKind === "airport" && route.fromCode
      ? YUU_PACK_AIRPORT_COUNTERS.filter(
          (c) => c.airport_iata === route.fromCode,
        )
      : [];

  const transit = estimateTransit(route.fromPref, route.toPref);
  const airporter =
    route.fromKind === "airport" && route.fromCode
      ? airporterCoverage(route.fromCode, route.toPref)
      : null;

  const quoteHref = `/quote?${new URLSearchParams({
    from: routeFromParam(route),
    to_pref: route.toPref,
    size: "160",
  }).toString()}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t(lang, "site.brand"),
        item: `${BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t(lang, "route.breadcrumb.routes"),
        item: `${BASE_URL}/routes/${route.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: route.label,
        item: `${BASE_URL}/routes/${route.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            ← JPLuggageGo
          </Link>
          <LangSwitcher current={lang} />
        </div>

        <nav className="mt-4 text-xs text-zinc-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">
            {t(lang, "site.brand")}
          </Link>
          <span className="mx-2 opacity-60">/</span>
          <span>{t(lang, "route.breadcrumb.routes")}</span>
          <span className="mx-2 opacity-60">/</span>
          <span className="text-zinc-700 dark:text-zinc-300">
            {route.label}
          </span>
        </nav>

        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          {tf(lang, "route.h1", {
            from: route.fromLabel,
            to: route.toPref,
          })}
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {t(lang, route.subKey)}
        </p>

        <section className="mt-8">
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {t(lang, "route.section.prices")}
            </h2>
            {latestScrapedAt && (
              <span className="text-xs text-zinc-500">
                {tf(lang, "route.updated", {
                  date: new Date(latestScrapedAt).toISOString().slice(0, 10),
                })}
              </span>
            )}
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-sm">
                <thead className="text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="text-left font-normal px-4 py-3">
                      {t(lang, "route.col.size")}
                    </th>
                    <th className="text-right font-normal px-3 py-3">Yamato</th>
                    <th className="text-right font-normal px-3 py-3">ゆう</th>
                    <th className="text-right font-normal px-4 py-3">
                      {t(lang, "home.popular.col.diff")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.code}
                      className="border-t border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {r.code}サイズ
                        </div>
                        <div className="text-xs text-zinc-500">{r.label}</div>
                      </td>
                      <td
                        className={`text-right px-3 py-3 tabular-nums ${
                          r.winner === "yamato"
                            ? "font-semibold text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {r.ya != null ? `¥${r.ya.toLocaleString()}` : "—"}
                      </td>
                      <td
                        className={`text-right px-3 py-3 tabular-nums ${
                          r.winner === "yuu"
                            ? "font-semibold text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {r.yu != null ? `¥${r.yu.toLocaleString()}` : "—"}
                      </td>
                      <td className="text-right px-4 py-3 text-xs tabular-nums">
                        {r.diff == null ? (
                          <span className="text-zinc-400">—</span>
                        ) : r.diff === 0 ? (
                          <span className="text-zinc-500">
                            {t(lang, "home.popular.diff.equal")}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {tf(
                              lang,
                              r.diff < 0
                                ? "home.popular.diff.yamato_save"
                                : "home.popular.diff.yuu_save",
                              { amount: Math.abs(r.diff).toLocaleString() },
                            )}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
            {t(lang, "route.prices.footer")}
          </p>
        </section>

        {transit && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              {t(lang, "route.section.transit")}
            </h2>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <p>
                {tf(lang, "route.transit.body", {
                  yamato: String(transit.yamato),
                  yuu: String(transit.yuu),
                })}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                {t(lang, "route.transit.footer")}
              </p>
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            {t(lang, "route.section.send_methods")}
          </h2>
          {route.fromKind === "airport" ? (
            <div className="space-y-4">
              {yamatoCounters.length > 0 && (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {tf(lang, "route.send.yamato_airport", {
                      airport: route.fromLabel,
                    })}
                  </div>
                  <ul className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                    {yamatoCounters.map((c, i) => (
                      <li key={i} className="leading-relaxed">
                        ·{" "}
                        <span className="font-medium">{c.airport_name_jp}</span>
                        {c.terminal && (
                          <span className="text-zinc-500"> · {c.terminal}</span>
                        )}
                        {c.floor && (
                          <span className="text-zinc-500"> · {c.floor}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {yuuCounters.length > 0 && (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {tf(lang, "route.send.yuu_airport", {
                      airport: route.fromLabel,
                    })}
                  </div>
                  <ul className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                    {yuuCounters.map((c, i) => (
                      <li key={i} className="leading-relaxed">
                        ·{" "}
                        <span className="font-medium">{c.counter_name_jp}</span>
                        {c.terminal && (
                          <span className="text-zinc-500"> · {c.terminal}</span>
                        )}
                        {c.hours_jst && (
                          <span className="text-zinc-500">
                            {" "}
                            · {c.hours_jst}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {airporter && (
                <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-5">
                  <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    {t(lang, "route.send.airporter_title")}
                  </div>
                  <p className="mt-2 text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                    {tf(lang, "route.send.airporter_body", {
                      airport: route.fromLabel,
                      to: route.toPref,
                    })}
                    {airporter.noteKey && (
                      <span> · {t(lang, airporter.noteKey)}</span>
                    )}
                  </p>
                  <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">
                    {t(lang, AIRPORTER_PRICE_NOTE_KEY)} ·{" "}
                    <a
                      href={AIRPORTER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline"
                    >
                      airporter.co.jp
                    </a>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {tf(lang, "route.send.pref_body", { from: route.fromLabel })}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="rounded-2xl border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 p-6 text-center">
            <div className="text-sm text-zinc-300 dark:text-zinc-600">
              {t(lang, "route.cta.kicker")}
            </div>
            <h3 className="mt-2 text-xl font-semibold text-white dark:text-zinc-900">
              {t(lang, "route.cta.title")}
            </h3>
            <Link
              href={quoteHref}
              className="mt-4 inline-flex items-center rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-5 py-2.5 text-sm font-medium hover:opacity-90"
            >
              {t(lang, "route.cta.button")}
            </Link>
          </div>
        </section>

        <section className="mt-10 text-xs text-zinc-500">
          <div className="font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            {t(lang, "route.related")}
          </div>
          <ul className="flex flex-wrap gap-2">
            {POPULAR_ROUTES.filter((r) => r.slug !== route.slug)
              .slice(0, 6)
              .map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/routes/${r.slug}`}
                    className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link
                href="/faq"
                className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {t(lang, "nav.faq")}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
