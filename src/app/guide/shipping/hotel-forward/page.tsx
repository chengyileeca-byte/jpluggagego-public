import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { HOTEL_SAMPLES, fetchGuideFares } from "@/lib/guide-fare-samples";
import { LangSwitcher } from "../../../_lang-switcher";
import { FareTable } from "../_fare-table";
import { ProhibitionGate } from "@/components/prohibition-gate";
import { ShowableJpPhrase } from "@/components/showable-jp-phrase";
import { ConsignmentSimYuuPack } from "@/components/consignment-sim-yuu-pack";
import { ShippingTimeline } from "@/components/shipping-timeline";
import { TIMELINE_HOTEL_FORWARD } from "@/lib/shipping-timeline-data";
import { HotelWhitelist } from "@/components/hotel-whitelist";
import { CoinLockerInfo } from "@/components/coin-locker-info";

export const dynamic = "force-dynamic";

const BASE_URL = "https://jpluggagego.com";
const STEPS = [1, 2, 3, 4, 5] as const;
const RULES = [1, 2, 3, 4, 5] as const;
const PHRASES = [1, 2, 3, 4, 5] as const;
const TROUBLES = [1, 2, 3, 4, 5] as const;
const FAQ_KEYS = [1, 2, 3, 4, 5] as const;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const title = t(lang, "guide.shipping.hotel.meta.title");
  const description = t(lang, "guide.shipping.hotel.meta.desc");
  return {
    title,
    description,
    alternates: { canonical: "/guide/shipping/hotel-forward" },
    openGraph: { title, description, url: "/guide/shipping/hotel-forward" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HotelForwardGuide() {
  const lang = await getLang();
  const fareTable = await fetchGuideFares(HOTEL_SAMPLES);

  const breadcrumbJsonLd = {
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
        name: t(lang, "guide.shipping.breadcrumb"),
        item: `${BASE_URL}/guide/shipping`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t(lang, "guide.shipping.card.hotel.title"),
        item: `${BASE_URL}/guide/shipping/hotel-forward`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/guide/shipping"
            className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {t(lang, "guide.nav.back_shipping")}
          </Link>
          <LangSwitcher current={lang} />
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t(lang, "guide.shipping.hotel.h1")}
        </h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {t(lang, "guide.shipping.hotel.intro")}
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 px-2 py-1">
            💴 {t(lang, "guide.shipping.hotel.summary.cost")}
          </span>
          <span className="rounded-md bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-200 px-2 py-1">
            ⏱ {t(lang, "guide.shipping.hotel.summary.eta")}
          </span>
          <span className="rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 px-2 py-1">
            {t(lang, "guide.shipping.hotel.summary.level")}
          </span>
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {t(lang, "guide.shipping.hotel.summary.best_for")}
        </p>

        <div id="checklist" className="mt-8">
          <ProhibitionGate
            scenario="domestic"
            title="寄件前 30 秒 · 雷區自檢"
            intro="飯店前臺會拒收禁品,甚至被罰重新打包。先確認這 3 題。"
            prohibitedHref="#troubles"
          />
        </div>

        <div className="mt-6">
          <ShippingTimeline
            scenario="hotel-forward"
            stages={TIMELINE_HOTEL_FORWARD}
            totalLabel="15-25 分 + 翌日抵達"
            note="東橫 INN / APA / ドーミーイン / 星野系 連鎖大多必收;京都町家型民宿、小型民泊常不收或需額外費。不確定的話請 check-in 時先問前臺。"
          />
        </div>

        <div className="mt-6">
          <HotelWhitelist />
        </div>

        <div className="mt-6">
          <CoinLockerInfo />
        </div>

        <section className="mt-10 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5">
          <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            {t(lang, "guide.shipping.hotel.precheck.title")}
          </h2>
          <p className="mt-2 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            {t(lang, "guide.shipping.hotel.precheck.body")}
          </p>
          <Link
            href="/quote"
            className="mt-3 inline-flex items-center rounded-lg bg-amber-900 dark:bg-amber-200 text-amber-50 dark:text-amber-950 px-3 py-1.5 text-xs font-medium hover:opacity-90"
          >
            {t(lang, "guide.shipping.hotel.precheck.cta")}
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            操作流程 5 步
          </h2>
          <ol className="mt-5 space-y-3">
            {STEPS.map((n) => (
              <li
                key={n}
                className="flex gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center">
                  {n}
                </span>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {t(lang, `guide.shipping.hotel.step_${n}.title`)}
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t(lang, `guide.shipping.hotel.step_${n}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.hotel.rules.title")}
          </h2>
          <ul className="mt-4 space-y-2 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {RULES.map((n) => (
              <li
                key={n}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
              >
                {t(lang, `guide.shipping.hotel.rules.${n}`)}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.hotel.phrases.title")}
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {t(lang, "guide.shipping.hotel.phrases.desc")}
          </p>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {PHRASES.map((n) => {
              const jp = t(lang, `guide.shipping.hotel.phrases.${n}.jp`);
              return (
                <div key={n} className="px-4 py-3">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {jp}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                    {t(lang, `guide.shipping.hotel.phrases.${n}.romaji`)}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {t(lang, `guide.shipping.hotel.phrases.${n}.zh`)}
                  </div>
                  <div className="mt-2">
                    <ShowableJpPhrase jp={jp} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            送り状 填寫預演
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            飯店前臺代填往往幫不上太多細節(僅抄你遞過去的紙條)。先在這邊預演一次,把寫好的內容給前臺最順。
          </p>
          <div className="mt-4">
            <ConsignmentSimYuuPack />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.hotel.receive.title")}
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.hotel.receive.body")}
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.hotel.fare.title")}
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.hotel.fare.intro")}
          </p>
          <FareTable lang={lang} table={fareTable} />
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.hotel.trouble.title")}
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {TROUBLES.map((n) => (
              <details key={n} className="group" open={n === 1}>
                <summary className="flex items-start justify-between gap-3 cursor-pointer px-5 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 list-none">
                  <span>
                    {t(lang, `guide.shipping.hotel.trouble.${n}.q`)}
                  </span>
                  <span className="text-zinc-400 transition-transform group-open:rotate-45 shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {t(lang, `guide.shipping.hotel.trouble.${n}.a`)}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.hotel.faq.title")}
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {FAQ_KEYS.map((n) => (
              <details key={n} className="group">
                <summary className="flex items-start justify-between gap-3 cursor-pointer px-5 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 list-none">
                  <span>{t(lang, `guide.shipping.hotel.faq.${n}.q`)}</span>
                  <span className="text-zinc-400 transition-transform group-open:rotate-45 shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {t(lang, `guide.shipping.hotel.faq.${n}.a`)}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t(lang, "guide.shipping.hotel.cta_next.title")}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Link
              href="/guide/shipping/airport-counter"
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              {t(lang, "guide.shipping.hotel.cta_next.airport")} →
            </Link>
            <Link
              href="/guide/shipping/branch-office"
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              {t(lang, "guide.shipping.hotel.cta_next.branch")} →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
