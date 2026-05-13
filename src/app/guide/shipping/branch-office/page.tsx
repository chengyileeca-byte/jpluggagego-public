import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { BRANCH_SAMPLES, fetchGuideFares } from "@/lib/guide-fare-samples";
import { LangSwitcher } from "../../../_lang-switcher";
import { FareTable } from "../_fare-table";
import { ProhibitionGate } from "@/components/prohibition-gate";
import { ShowableJpPhrase } from "@/components/showable-jp-phrase";
import { ConsignmentSimYuuPack } from "@/components/consignment-sim-yuu-pack";
import { ShippingTimeline } from "@/components/shipping-timeline";
import { TIMELINE_BRANCH_OFFICE } from "@/lib/shipping-timeline-data";
import { NewcomerFriendlyPicks } from "@/components/newcomer-friendly-picks";

export const dynamic = "force-dynamic";

const BASE_URL = "https://jpluggagego.com";
const STEPS = [1, 2, 3, 4, 5, 6] as const;
const PHRASES = [1, 2, 3, 4, 5] as const;
const TROUBLES = [1, 2, 3, 4] as const;
const FAQ_KEYS = [1, 2, 3, 4, 5] as const;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const title = t(lang, "guide.shipping.branch.meta.title");
  const description = t(lang, "guide.shipping.branch.meta.desc");
  return {
    title,
    description,
    alternates: { canonical: "/guide/shipping/branch-office" },
    openGraph: { title, description, url: "/guide/shipping/branch-office" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BranchOfficeGuide() {
  const lang = await getLang();
  const fareTable = await fetchGuideFares(BRANCH_SAMPLES);

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
        name: t(lang, "guide.shipping.card.branch.title"),
        item: `${BASE_URL}/guide/shipping/branch-office`,
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
          {t(lang, "guide.shipping.branch.h1")}
        </h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {t(lang, "guide.shipping.branch.intro")}
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 px-2 py-1">
            💴 {t(lang, "guide.shipping.branch.summary.cost")}
          </span>
          <span className="rounded-md bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-200 px-2 py-1">
            ⏱ {t(lang, "guide.shipping.branch.summary.eta")}
          </span>
          <span className="rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 px-2 py-1">
            {t(lang, "guide.shipping.branch.summary.level")}
          </span>
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {t(lang, "guide.shipping.branch.summary.best_for")}
        </p>

        <div id="checklist" className="mt-8">
          <ProhibitionGate
            scenario="domestic"
            title="寄件前 30 秒 · 雷區自檢"
            intro="営業所櫃台會當場檢查,踩到雷會被退回重打包。先確認這 3 題。"
            prohibitedHref="#troubles"
          />
        </div>

        <div className="mt-6">
          <ShippingTimeline
            scenario="branch-office"
            stages={TIMELINE_BRANCH_OFFICE}
            totalLabel="來回 45-80 分 + 翌日抵達"
            note="郵便局 / Yamato 営業所 平日 9:00-17:00 最穩;週末 / 節日 部分營業所縮短或公休,出門前 Google 確認。"
          />
        </div>

        <div className="mt-6">
          <NewcomerFriendlyPicks />
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            操作流程 6 步
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
                    {t(lang, `guide.shipping.branch.step_${n}.title`)}
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t(lang, `guide.shipping.branch.step_${n}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.branch.form.title")}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.branch.form.desc")}
          </p>
          <ul className="mt-4 space-y-3 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <li className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              {t(lang, "guide.shipping.branch.form.field_sender")}
            </li>
            <li className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              {t(lang, "guide.shipping.branch.form.field_recipient")}
            </li>
            <li className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              {t(lang, "guide.shipping.branch.form.field_item")}
            </li>
            <li className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              {t(lang, "guide.shipping.branch.form.field_time")}
            </li>
            <li className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              {t(lang, "guide.shipping.branch.form.field_misc")}
            </li>
          </ul>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            💡 {t(lang, "guide.shipping.branch.form.tip")}
          </p>
          <div className="mt-6">
            <ConsignmentSimYuuPack />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.branch.phrases.title")}
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {t(lang, "guide.shipping.branch.phrases.desc")}
          </p>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {PHRASES.map((n) => {
              const jp = t(lang, `guide.shipping.branch.phrases.${n}.jp`);
              return (
                <div key={n} className="px-4 py-3">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {jp}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                    {t(lang, `guide.shipping.branch.phrases.${n}.romaji`)}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {t(lang, `guide.shipping.branch.phrases.${n}.zh`)}
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
            {t(lang, "guide.shipping.branch.fare.title")}
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t(lang, "guide.shipping.branch.fare.intro")}
          </p>
          <FareTable lang={lang} table={fareTable} />
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.branch.trouble.title")}
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {TROUBLES.map((n) => (
              <details key={n} className="group" open={n === 1}>
                <summary className="flex items-start justify-between gap-3 cursor-pointer px-5 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 list-none">
                  <span>
                    {t(lang, `guide.shipping.branch.trouble.${n}.q`)}
                  </span>
                  <span className="text-zinc-400 transition-transform group-open:rotate-45 shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {t(lang, `guide.shipping.branch.trouble.${n}.a`)}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.branch.faq.title")}
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {FAQ_KEYS.map((n) => (
              <details key={n} className="group">
                <summary className="flex items-start justify-between gap-3 cursor-pointer px-5 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 list-none">
                  <span>{t(lang, `guide.shipping.branch.faq.${n}.q`)}</span>
                  <span className="text-zinc-400 transition-transform group-open:rotate-45 shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {t(lang, `guide.shipping.branch.faq.${n}.a`)}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t(lang, "guide.shipping.branch.cta_next.title")}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Link
              href="/guide/shipping/airport-counter"
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              {t(lang, "guide.shipping.branch.cta_next.airport")} →
            </Link>
            <Link
              href="/guide/shipping/hotel-forward"
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              {t(lang, "guide.shipping.branch.cta_next.hotel")} →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
