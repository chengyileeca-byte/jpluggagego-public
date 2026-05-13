import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { AIRPORT_SAMPLES, fetchGuideFares } from "@/lib/guide-fare-samples";
import { LangSwitcher } from "../../../_lang-switcher";
import { FareTable } from "../_fare-table";
import { ProhibitionGate } from "@/components/prohibition-gate";
import { ShowableJpPhrase } from "@/components/showable-jp-phrase";
import { ConsignmentSimYuuPack } from "@/components/consignment-sim-yuu-pack";
import { ShippingTimeline } from "@/components/shipping-timeline";
import { TIMELINE_AIRPORT_COUNTER } from "@/lib/shipping-timeline-data";

export const dynamic = "force-dynamic";

const BASE_URL = "https://jpluggagego.com";

const ARRIVAL_STEPS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const PHRASES = [1, 2, 3, 4, 5, 6, 7] as const;
const TROUBLES = [1, 2, 3, 4, 5] as const;
const FAQ_KEYS = [1, 2, 3, 4, 5] as const;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const title = t(lang, "guide.shipping.airport.meta.title");
  const description = t(lang, "guide.shipping.airport.meta.desc");
  return {
    title,
    description,
    alternates: { canonical: "/guide/shipping/airport-counter" },
    openGraph: {
      title,
      description,
      url: "/guide/shipping/airport-counter",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AirportCounterGuide() {
  const lang = await getLang();
  const fareTable = await fetchGuideFares(AIRPORT_SAMPLES);

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
        name: t(lang, "guide.shipping.card.airport.title"),
        item: `${BASE_URL}/guide/shipping/airport-counter`,
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
          {t(lang, "guide.shipping.airport.h1")}
        </h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {t(lang, "guide.shipping.airport.intro")}
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 px-2 py-1">
            💴 {t(lang, "guide.shipping.airport.summary.cost")}
          </span>
          <span className="rounded-md bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-200 px-2 py-1">
            ⏱ {t(lang, "guide.shipping.airport.summary.eta")}
          </span>
          <span className="rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 px-2 py-1">
            {t(lang, "guide.shipping.airport.summary.level")}
          </span>
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {t(lang, "guide.shipping.airport.summary.best_for")}
        </p>

        {/* 寄件前 30 秒雷區檢查 */}
        <div id="checklist" className="mt-8">
          <ProhibitionGate
            scenario="domestic"
            title="寄件前 30 秒 · 雷區自檢"
            intro="機場/営業所櫃台會當場拆包檢查,踩到雷會被退回。先確認這 3 題。"
            prohibitedHref="#troubles"
          />
        </div>

        <div className="mt-6">
          <ShippingTimeline
            scenario="airport-counter"
            stages={TIMELINE_AIRPORT_COUNTER}
            totalLabel="機場 1-1.5 小時 + 翌日抵達"
            note="時間以入境順暢、櫃台無排隊為前提。旺季(櫻花/紅葉/年末)櫃台可能排 30 分以上,建議留 buffer。"
          />
        </div>

        {/* ============ A · 落地→飯店 ============ */}
        <section id="arrival" className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.arrival.title")}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.airport.arrival.intro")}
          </p>
          <ol className="mt-5 space-y-3">
            {ARRIVAL_STEPS.map((n) => (
              <li
                key={n}
                className="flex gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center">
                  {n}
                </span>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {t(lang, `guide.shipping.airport.arrival.step_${n}.title`)}
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t(lang, `guide.shipping.airport.arrival.step_${n}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ============ B · 離日→機場 ============ */}
        <section id="departure" className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.departure.title")}
          </h2>
          <div className="mt-3 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            {t(lang, "guide.shipping.airport.departure.warning")}
          </div>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.airport.departure.intro")}
          </p>

          <h3 className="mt-6 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.departure.hotel.title")}
          </h3>
          <ol className="mt-3 space-y-2 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed list-decimal list-inside">
            <li>{t(lang, "guide.shipping.airport.departure.hotel.step_1")}</li>
            <li>{t(lang, "guide.shipping.airport.departure.hotel.step_2")}</li>
            <li>{t(lang, "guide.shipping.airport.departure.hotel.step_3")}</li>
            <li>{t(lang, "guide.shipping.airport.departure.hotel.step_4")}</li>
          </ol>

          <h3 className="mt-6 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.departure.branch.title")}
          </h3>
          <ol className="mt-3 space-y-2 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed list-decimal list-inside">
            <li>{t(lang, "guide.shipping.airport.departure.branch.step_1")}</li>
            <li>{t(lang, "guide.shipping.airport.departure.branch.step_2")}</li>
            <li>{t(lang, "guide.shipping.airport.departure.branch.step_3")}</li>
          </ol>

          <h3 className="mt-6 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.departure.pickup.title")}
          </h3>
          <ul className="mt-3 space-y-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed list-disc list-inside">
            <li>{t(lang, "guide.shipping.airport.departure.pickup.narita")}</li>
            <li>{t(lang, "guide.shipping.airport.departure.pickup.haneda")}</li>
            <li>{t(lang, "guide.shipping.airport.departure.pickup.kansai")}</li>
            <li>{t(lang, "guide.shipping.airport.departure.pickup.chubu")}</li>
          </ul>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.airport.departure.pickup.required")}
          </p>
        </section>

        {/* ============ 櫃台所在機場 ============ */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.counters.title")}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {t(lang, "guide.shipping.airport.counters.yamato.title")}
              </h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t(lang, "guide.shipping.airport.counters.yamato.list")}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {t(lang, "guide.shipping.airport.counters.jalabc.title")}
              </h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t(lang, "guide.shipping.airport.counters.jalabc.list")}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.airport.counters.which")}
          </p>
        </section>

        {/* ============ 費率 ============ */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.fare.title")}
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.airport.fare.intro")}
          </p>
          <FareTable lang={lang} table={fareTable} />
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.airport.fare.discount")}
          </p>
        </section>

        {/* ============ 日文情境句 ============ */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.phrases.title")}
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {t(lang, "guide.shipping.airport.phrases.desc")}
          </p>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {PHRASES.map((n) => {
              const jp = t(lang, `guide.shipping.airport.phrases.${n}.jp`);
              return (
                <div key={n} className="px-4 py-3">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {jp}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                    {t(lang, `guide.shipping.airport.phrases.${n}.romaji`)}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {t(lang, `guide.shipping.airport.phrases.${n}.zh`)}
                  </div>
                  <div className="mt-2">
                    <ShowableJpPhrase jp={jp} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============ 送り状 填寫預演 ============ */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            送り状 填寫預演
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            櫃台給的紙本送り状欄位不少,先在這邊預演一次,現場照抄不卡。境內寄送(機場 → 飯店)用這份 ゆうパック 版即可;Yamato 的宅急便送り状格式略同。
          </p>
          <div className="mt-4">
            <ConsignmentSimYuuPack />
          </div>
        </section>

        {/* ============ 接收端 ============ */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.receive.title")}
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.airport.receive.body")}
          </p>
          <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {t(lang, "guide.shipping.airport.receive.phrase_jp")}
            </div>
            <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 italic">
              {t(lang, "guide.shipping.airport.receive.phrase_romaji")}
            </div>
            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {t(lang, "guide.shipping.airport.receive.phrase_zh")}
            </div>
          </div>
        </section>

        {/* ============ 常見卡關 ============ */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.trouble.title")}
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {TROUBLES.map((n) => (
              <details key={n} className="group" open={n === 1}>
                <summary className="flex items-start justify-between gap-3 cursor-pointer px-5 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 list-none">
                  <span>
                    {t(lang, `guide.shipping.airport.trouble.${n}.q`)}
                  </span>
                  <span className="text-zinc-400 transition-transform group-open:rotate-45 shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {t(lang, `guide.shipping.airport.trouble.${n}.a`)}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.airport.faq.title")}
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {FAQ_KEYS.map((n) => (
              <details key={n} className="group">
                <summary className="flex items-start justify-between gap-3 cursor-pointer px-5 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 list-none">
                  <span>{t(lang, `guide.shipping.airport.faq.${n}.q`)}</span>
                  <span className="text-zinc-400 transition-transform group-open:rotate-45 shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {t(lang, `guide.shipping.airport.faq.${n}.a`)}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ============ 下一條路徑 ============ */}
        <section className="mt-14">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t(lang, "guide.shipping.airport.cta_next.title")}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Link
              href="/guide/shipping/branch-office"
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              {t(lang, "guide.shipping.airport.cta_next.branch")} →
            </Link>
            <Link
              href="/guide/shipping/hotel-forward"
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              {t(lang, "guide.shipping.airport.cta_next.hotel")} →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
