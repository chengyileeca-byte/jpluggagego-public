import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { LangSwitcher } from "../_lang-switcher";

export const dynamic = "force-dynamic";

const FAQ_KEYS = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
] as const;

const BASE_URL = "https://jpluggagego.com";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const title = t(lang, "faq.meta.title");
  const description = t(lang, "faq.meta.desc");
  return {
    title,
    description,
    alternates: { canonical: "/faq" },
    openGraph: { title, description, url: "/faq" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FAQPage() {
  const lang = await getLang();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((f) => ({
      "@type": "Question",
      name: t(lang, f.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(lang, f.a),
      },
    })),
  };

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
        name: t(lang, "nav.faq"),
        item: `${BASE_URL}/faq`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
            ← JPLuggageGo
          </Link>
          <LangSwitcher current={lang} />
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t(lang, "faq.title")}
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {t(lang, "faq.intro")}
        </p>

        <div className="mt-8 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
          {FAQ_KEYS.map((f, i) => (
            <details key={i} className="group" open={i < 2}>
              <summary className="flex items-start justify-between gap-3 cursor-pointer px-5 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 list-none">
                <span>{t(lang, f.q)}</span>
                <span className="text-zinc-400 transition-transform group-open:rotate-45 shrink-0">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {t(lang, f.a)}
              </div>
            </details>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
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

        <div className="mt-8 text-center">
          <Link
            href="/quote"
            className="inline-flex items-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            {t(lang, "faq.cta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
