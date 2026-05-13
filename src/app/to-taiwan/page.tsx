import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { LangSwitcher } from "../_lang-switcher";
import {
  TO_TAIWAN_CONTENT_VERIFIED_AT,
  PROHIBITED_ABSOLUTE,
  PROHIBITED_CONDITIONAL,
  PROHIBITED_PITFALLS,
  TARIFF_PRINCIPLES,
  TARIFF_EXEMPTIONS,
  TARIFF_WORKFLOW_STEPS,
  TARIFF_TIPS,
  TARIFF_EXAMPLES,
  PACKING_SOP_STEPS,
  PACKING_SERVICE_GUIDES,
  FAQ_ITEMS,
  type ProhibitedItemCategory,
  type PackingServiceGuide,
} from "@/lib/to-taiwan-content";
import { TaiwanCalculator } from "./_calculator";
import { TariffCalculator } from "./_tariff-calculator";
import { TaiwanServiceQuiz } from "./_service-quiz";
import { ProhibitionGate } from "@/components/prohibition-gate";
import { ShowableJpPhrase } from "@/components/showable-jp-phrase";
import { ShippingTimeline } from "@/components/shipping-timeline";
import { TIMELINE_TO_TAIWAN } from "@/lib/shipping-timeline-data";
import { PostShipmentCard } from "@/components/post-shipment-card";
import { HashOpenPacking } from "./_hash-open-packing";
import { ConsignmentSimYamato } from "./_consignment-sim-yamato";
import { ConsignmentSimEms } from "./_consignment-sim-ems";

export const dynamic = "force-dynamic";

const BASE_URL = "https://jpluggagego.com";
const PAGE_PATH = "/to-taiwan";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const title = t(lang, "toTw.meta.title");
  const description = t(lang, "toTw.meta.desc");
  return {
    title,
    description,
    alternates: {
      canonical: PAGE_PATH,
      languages: {
        "zh-TW": PAGE_PATH,
        "x-default": PAGE_PATH,
      },
    },
    openGraph: { title, description, url: PAGE_PATH },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ToTaiwanPage() {
  const lang = await getLang();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "日本寄台灣 · 打包寄送流程",
    step: PACKING_SOP_STEPS.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.body,
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
        name: t(lang, "toTw.title"),
        item: `${BASE_URL}${PAGE_PATH}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-10 px-5 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <HashOpenPacking />

      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            ← JPLuggageGo
          </Link>
          <LangSwitcher current={lang} />
        </div>

        <header className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
            {t(lang, "toTw.title")}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t(lang, "toTw.subtitle")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="#calc"
              className="rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              {t(lang, "toTw.cta.calc")}
            </a>
            <a
              href="#prohibited"
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {t(lang, "toTw.cta.prohibited")}
            </a>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════
            Part 1 · 🧭 決策 — 要不要寄、走哪家、大概要繳多少稅
            ════════════════════════════════════════════════════════ */}
        <PartHeader titleKey="toTw.part.decide" descKey="toTw.part.decide.desc" lang={lang} />

        {/* 決策樹(問答式)— 先決定「走哪家」 */}
        <section className="mt-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.tree")}
          </h3>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
            3 題決定你適合哪一家。答完直接跳到試算。
          </p>
          <div className="mt-4">
            <TaiwanServiceQuiz />
          </div>
        </section>

        {/* 運費試算 */}
        <section
          id="calc"
          className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.calc")}
          </h3>
          <div className="mt-4">
            <TaiwanCalculator lang={lang} />
          </div>
          <p className="mt-4 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            {t(lang, "toTw.calc.yamato_afterpay_note")}
          </p>
        </section>

        {/* 清關稅額估算 — 從 §5 關稅 SOP 抽出,讓使用者決策時先知道會被課多少 */}
        <section className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.tariff_calc")}
          </h3>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
            免稅額 NT$2,000、半年 6 次、5 萬元正式報關門檻一次帶入估算。
          </p>
          <div className="mt-4">
            <TariffCalculator lang={lang} />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            Part 2 · 📦 打包 — 雷區自檢、包材、送單 SOP、禁寄品
            ════════════════════════════════════════════════════════ */}
        <PartHeader titleKey="toTw.part.pack" descKey="toTw.part.pack.desc" lang={lang} />

        {/* 打包前 30 秒雷區自檢 */}
        <section id="checklist" className="mt-6">
          <ProhibitionGate
            scenario="to-taiwan"
            title={t(lang, "toTw.section.checklist")}
            intro="這 3 題擋掉 80% 退件與扣關場景。回答完再往下看打包步驟。"
            prohibitedHref="#prohibited"
          />
        </section>

        {/* 打包/寄送 SOP(四家服務) */}
        <section className="mt-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.packing")}
          </h3>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
            {t(lang, "toTw.packing.intro")}
          </p>
          <div className="mt-4 space-y-3">
            {PACKING_SERVICE_GUIDES.map((g) => (
              <ServiceGuideCard key={g.id} guide={g} />
            ))}
          </div>
        </section>

        {/* 禁寄品總表 */}
        <section id="prohibited" className="mt-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.prohibited")}
          </h3>
          <div className="mt-4 space-y-3">
            <ProhibitedCategory category={PROHIBITED_ABSOLUTE} variant="danger" />
            {PROHIBITED_CONDITIONAL.map((cat, i) => (
              <ProhibitedCategory key={i} category={cat} variant="warn" />
            ))}
            <ProhibitedCategory category={PROHIBITED_PITFALLS} variant="info" />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            Part 3 · ✈️ 寄出後 — 追蹤、被扣關 SOP、FAQ
            ════════════════════════════════════════════════════════ */}
        <PartHeader titleKey="toTw.part.after" descKey="toTw.part.after.desc" lang={lang} />

        {/* 跨境流程時間軸 */}
        <section className="mt-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.timeline")}
          </h3>
          <div className="mt-4">
            <ShippingTimeline
              scenario="to-taiwan"
              stages={TIMELINE_TO_TAIWAN}
              totalLabel="最快 D+2、一般 D+3~6、船便 D+14~21"
              note="時序為主要都市(台北/新北/桃園/台中/台南/高雄)基準。離島(澎湖/金門/馬祖/蘭嶼)再 +1~2 天。颱風/寒流/海關塞車可能更久。"
            />
          </div>
        </section>

        {/* 寄出後追蹤卡 */}
        <section className="mt-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.post_shipment")}
          </h3>
          <div className="mt-4">
            <PostShipmentCard />
          </div>
        </section>

        {/* 關稅 SOP — 移除估算器,剩基本公式/免稅規則/被扣關 SOP/技巧/範例 */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.tariff")}
          </h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                基本公式
              </h4>
              {TARIFF_PRINCIPLES.map((p, i) => (
                <div key={i} className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {p.title}
                  </p>
                  <p className="mt-1 font-mono text-[13px] bg-zinc-50 dark:bg-zinc-950 rounded px-3 py-2">
                    {p.body}
                  </p>
                  {p.note && (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                      {p.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                免稅額 · 2026 最新規則
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300 list-disc pl-5 leading-relaxed">
                {TARIFF_EXEMPTIONS.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                被扣關怎麼辦 · 實戰 SOP
              </h4>
              <ol className="mt-3 space-y-3">
                {TARIFF_WORKFLOW_STEPS.map((s) => (
                  <li key={s.step} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 flex items-center justify-center text-xs font-semibold">
                      {s.step}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {s.title}
                      </div>
                      <div className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {s.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                避免被扣關 4 技巧
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300 list-decimal pl-5 leading-relaxed">
                {TARIFF_TIPS.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                計算範例
              </h4>
              <div className="mt-3 space-y-4">
                {TARIFF_EXAMPLES.map((ex, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-zinc-50 dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {ex.title}
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-zinc-700 dark:text-zinc-300 list-disc pl-5">
                      {ex.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                    <div className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {ex.total}
                    </div>
                    {ex.note && (
                      <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                        ⚠ {ex.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.faq")}
          </h3>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {FAQ_ITEMS.map((f, i) => (
              <details key={i} className="group" open={i < 3}>
                <summary className="flex items-start justify-between gap-3 cursor-pointer px-5 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 list-none">
                  <span>{f.q}</span>
                  <span className="text-zinc-400 transition-transform group-open:rotate-45 shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* §7 資料來源 */}
        <section className="mt-10 mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t(lang, "toTw.section.sources")}
          </h2>
          <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
            <p>
              <strong className="text-zinc-900 dark:text-zinc-50">
                最終內容校對日:
              </strong>{" "}
              {TO_TAIWAN_CONTENT_VERIFIED_AT}
            </p>
            <p>{t(lang, "toTw.disclaimer")}</p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>
                <a
                  href="https://www.post.japanpost.jp/int/charge/list/ems1.html"
                  className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
                  target="_blank"
                  rel="noreferrer"
                >
                  郵便局 EMS 第 1 地帯料金
                </a>
              </li>
              <li>
                <a
                  href="https://www.post.japanpost.jp/int/charge/list/parcel1.html"
                  className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
                  target="_blank"
                  rel="noreferrer"
                >
                  郵便局 国際小包 第 1 地帯料金
                </a>
              </li>
              <li>
                <a
                  href="https://www.post.japanpost.jp/cgi-kokusai/country.php?cid=44"
                  className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
                  target="_blank"
                  rel="noreferrer"
                >
                  郵便局 台湾向け条件
                </a>
              </li>
              <li>
                <a
                  href="https://www.kuronekoyamato.co.jp/ytc/customer/send/services/oversea/"
                  className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
                  target="_blank"
                  rel="noreferrer"
                >
                  Yamato 國際宅急便(消費者)
                </a>
              </li>
              <li>
                <a
                  href="https://web.customs.gov.tw/"
                  className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
                  target="_blank"
                  rel="noreferrer"
                >
                  財政部關務署
                </a>
              </li>
              <li>
                <a
                  href="https://ezway.customs.gov.tw/"
                  className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
                  target="_blank"
                  rel="noreferrer"
                >
                  EZ WAY 易利委
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------
// 小元件
// ----------------------------------------------------------------

function PartHeader({
  titleKey,
  descKey,
  lang,
}: {
  titleKey: string;
  descKey: string;
  lang: Lang;
}) {
  return (
    <div className="mt-12 mb-2 border-t-2 border-zinc-900 dark:border-zinc-50 pt-5">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
        {t(lang, titleKey)}
      </h2>
      <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {t(lang, descKey)}
      </p>
    </div>
  );
}

function ServiceGuideCard({ guide }: { guide: PackingServiceGuide }) {
  return (
    <details
      id={`packing-${guide.id}`}
      open={guide.defaultOpen}
      className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden scroll-mt-6"
    >
      <summary className="cursor-pointer px-5 py-3 list-none flex items-start justify-between gap-3 border-b border-transparent group-open:border-zinc-200 dark:group-open:border-zinc-800">
        <div className="flex-1">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {guide.serviceName}
          </div>
          <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500 tracking-wide">
            {guide.badge}
          </div>
        </div>
        <span className="text-zinc-400 text-lg leading-none transition-transform group-open:rotate-45 shrink-0 select-none">
          +
        </span>
      </summary>
      <div className="px-5 py-4">
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {guide.summary}
        </p>
        <ol className="mt-4 space-y-3">
          {guide.steps.map((s) => (
            <li key={s.step} className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 flex items-center justify-center text-xs font-semibold">
                {s.step}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {s.title}
                </div>
                <div className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {s.body}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {guide.phrases && guide.phrases.length > 0 && (
          <div className="mt-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">💬</span>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                交寄櫃台 · 關鍵對話
              </div>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
              不敢開口?點「遞給櫃台看」會顯示大字版,直接把手機遞過去即可。
            </p>
            <ul className="mt-3 space-y-3">
              {guide.phrases.map((p, i) => (
                <li key={i} className="space-y-0.5">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {p.jp}
                  </div>
                  <div className="text-[11px] italic text-zinc-500 dark:text-zinc-400">
                    {p.romaji}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    {p.zh}
                  </div>
                  <div className="pt-1">
                    <ShowableJpPhrase jp={p.jp} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {guide.id === "yamato" && <ConsignmentSimYamato />}
        {guide.id === "ems" && <ConsignmentSimEms />}
      </div>
    </details>
  );
}

function ProhibitedCategory({
  category,
  variant,
}: {
  category: ProhibitedItemCategory;
  variant: "danger" | "warn" | "info";
}) {
  const header = {
    danger:
      "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200",
    warn:
      "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200",
    info:
      "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200",
  }[variant];
  return (
    <details
      open={category.defaultOpen}
      className={`rounded-xl border overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800`}
    >
      <summary
        className={`cursor-pointer px-5 py-3 text-sm font-semibold border-b ${header}`}
      >
        {category.title}
      </summary>
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {category.items.map((item, i) => (
          <li key={i} className="px-5 py-3">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {item.name}
            </div>
            {item.note && (
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.note}
              </div>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}
