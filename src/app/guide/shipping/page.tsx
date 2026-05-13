import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { LangSwitcher } from "../../_lang-switcher";
import { PostShipmentCard } from "@/components/post-shipment-card";

export const dynamic = "force-dynamic";

const BASE_URL = "https://jpluggagego.com";

const PICK_KEYS = [
  {
    label: "guide.shipping.pick.airport.label",
    value: "guide.shipping.pick.airport.value",
    href: "/guide/shipping/airport-counter",
  },
  {
    label: "guide.shipping.pick.branch.label",
    value: "guide.shipping.pick.branch.value",
    href: "/guide/shipping/branch-office",
  },
  {
    label: "guide.shipping.pick.hotel.label",
    value: "guide.shipping.pick.hotel.value",
    href: "/guide/shipping/hotel-forward",
  },
  {
    label: "guide.shipping.pick.departure.label",
    value: "guide.shipping.pick.departure.value",
    href: "/guide/shipping/airport-counter#departure",
  },
] as const;

const CARDS = [
  {
    title: "guide.shipping.card.airport.title",
    scenario: "guide.shipping.card.airport.scenario",
    cost: "guide.shipping.card.airport.meta_cost",
    eta: "guide.shipping.card.airport.meta_eta",
    level: "guide.shipping.card.airport.meta_level",
    href: "/guide/shipping/airport-counter",
  },
  {
    title: "guide.shipping.card.branch.title",
    scenario: "guide.shipping.card.branch.scenario",
    cost: "guide.shipping.card.branch.meta_cost",
    eta: "guide.shipping.card.branch.meta_eta",
    level: "guide.shipping.card.branch.meta_level",
    href: "/guide/shipping/branch-office",
  },
  {
    title: "guide.shipping.card.hotel.title",
    scenario: "guide.shipping.card.hotel.scenario",
    cost: "guide.shipping.card.hotel.meta_cost",
    eta: "guide.shipping.card.hotel.meta_eta",
    level: "guide.shipping.card.hotel.meta_level",
    href: "/guide/shipping/hotel-forward",
  },
] as const;

const PREP_KEYS = [1, 2, 3, 4, 5] as const;

const SOURCE_LINKS = [
  {
    key: "guide.shipping.sources.yamato_airport",
    href: "https://www.kuronekoyamato.co.jp/ytc/customer/send/services/airport/",
  },
  {
    key: "guide.shipping.sources.yamato_flow_faq",
    href: "https://faq.kuronekoyamato.co.jp/app/answers/detail/a_id/1792/",
  },
  {
    key: "guide.shipping.sources.jalabc",
    href: "https://www.jalabc.com/delivery_service/airport_delivery/abc_airport_delivery.html",
  },
  {
    key: "guide.shipping.sources.yamato_send",
    href: "https://faq.kuronekoyamato.co.jp/app/answers/detail/a_id/9486/",
  },
  {
    key: "guide.shipping.sources.yamato_hotel",
    href: "https://faq.kuronekoyamato.co.jp/app/answers/detail/a_id/3425/",
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const title = t(lang, "guide.shipping.meta.title");
  const description = t(lang, "guide.shipping.meta.desc");
  return {
    title,
    description,
    alternates: { canonical: "/guide/shipping" },
    openGraph: { title, description, url: "/guide/shipping" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ShippingGuideOverview() {
  const lang = await getLang();

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
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {t(lang, "guide.nav.back_home")}
          </Link>
          <LangSwitcher current={lang} />
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t(lang, "guide.shipping.h1")}
        </h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {t(lang, "guide.shipping.intro")}
        </p>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.pick.title")}
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {t(lang, "guide.shipping.pick.subtitle")}
          </p>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {PICK_KEYS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
              >
                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t(lang, p.label)}
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {t(lang, p.value)}
                  </div>
                </div>
                <span className="text-zinc-400 shrink-0">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.cards.title")}
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {t(lang, "guide.shipping.cards.desc")}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {CARDS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
              >
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {t(lang, c.title)}
                </h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                  {t(lang, c.scenario)}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-700 dark:text-zinc-300">
                    💴 {t(lang, c.cost)}
                  </span>
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-700 dark:text-zinc-300">
                    ⏱ {t(lang, c.eta)}
                  </span>
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-700 dark:text-zinc-300">
                    {t(lang, c.level)}
                  </span>
                </div>
                <div className="mt-3 text-xs font-medium text-zinc-900 dark:text-zinc-50 group-hover:underline">
                  {t(lang, "guide.shipping.card.cta")}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.prep.title")}
          </h2>
          <ol className="mt-4 space-y-3">
            {PREP_KEYS.map((n) => (
              <li
                key={n}
                className="flex gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                  {n}
                </span>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {t(lang, `guide.shipping.prep.${n}.title`)}
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t(lang, `guide.shipping.prep.${n}.desc`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* QR / App 教學橫幅 */}
        <section className="mt-8 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                不用日文寄行李
              </div>
              <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                ヤマト QR · App 預填送り状
              </h3>
              <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                手機填寄件單 → 拿 QR Code → 帶行李去 営業所 / PUDO / 7-11 / ファミマ 一掃即寄。
                <strong className="text-emerald-800 dark:text-emerald-200">省 ¥160 / 件</strong>(持込割 ¥100 + デジタル割 ¥60)。
              </p>
            </div>
            <Link
              href="/guide/shipping/qr-app"
              className="rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-xs font-medium hover:opacity-90 self-center"
            >
              看教學 →
            </Link>
          </div>
        </section>

        {/* 寄出後安心卡 — 已經寄了、一直刷追蹤頁的使用者用 */}
        <section className="mt-8">
          <PostShipmentCard />
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "guide.shipping.aftercard.title")}
          </div>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {t(lang, "guide.shipping.aftercard.desc")}
          </p>
          <Link
            href="/quote"
            className="mt-3 inline-flex items-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-xs font-medium hover:opacity-90"
          >
            {t(lang, "guide.shipping.aftercard.cta")}
          </Link>
        </section>

        <section className="mt-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.reverse.title")}
          </div>
          <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {t(lang, "toTw.reverse.desc")}
          </p>
          <Link
            href="/to-taiwan"
            className="mt-3 inline-flex items-center text-xs font-semibold text-blue-900 dark:text-blue-200 hover:underline"
          >
            {t(lang, "toTw.reverse.cta")}
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t(lang, "guide.shipping.sources.title")}
          </h2>
          <ul className="mt-2 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            {SOURCE_LINKS.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-zinc-700 dark:hover:text-zinc-300 underline"
                >
                  {t(lang, s.key)}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
            {t(lang, "guide.shipping.sources.verified_at")}
          </p>
        </section>
      </div>
    </main>
  );
}
