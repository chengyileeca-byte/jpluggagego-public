import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

const BASE_URL = "https://jpluggagego.com";

export const metadata: Metadata = {
  title: "ヤマト QR 寄行李教學 · 不用日文寫送り状 · JPLuggageGo",
  description:
    "ヤマト公式 App + LINE 連携,在手機填寄件單拿 QR Code,到營業所/PUDO/7-11/ファミマ 直接掃碼寄行李。省 ¥160(持込割 ¥100 + デジタル割 ¥60),全程不用寫日文。",
  alternates: { canonical: "/guide/shipping/qr-app" },
  openGraph: {
    title: "ヤマト QR 寄行李教學 · 不用日文寫送り状",
    description:
      "ヤマト 公式 App + LINE 預填送り状 → 拿 QR → 持込割 + デジタル割 = -¥160 / 件",
    url: "/guide/shipping/qr-app",
  },
};

const STEPS = [
  {
    n: 1,
    title: "下載 ヤマト 公式 App(或加 LINE 公式帳號)",
    body: "App Store / Google Play 搜「ヤマト運輸」(クロネコのアイコン)。或在 LINE 加「ヤマト運輸」公式帳號連動。註冊只需 email + 手機,不需日本住址,觀光客也能用。",
    detail: [
      "App 沒中文介面,但流程圖示化、步驟少,跟著日文漢字 + 圖示就能填完",
      "LINE 連携版:在 LINE 對話視窗點選單就能填送り状,介面更直覺",
      "クロネコメンバーズ 帳號(免費)可累積寄送紀錄、查歷史 QR",
    ],
  },
  {
    n: 2,
    title: "App 內預填送り状(寄件單)→ 取得 QR Code",
    body: "App 內選「送り状を作成」(製作運單)→ 填寄件人(自動帶入)、收件人(地址 / 電話 / 姓名)、尺寸 / 日期 → 結帳前會生成一組 QR Code(2 次元コード),有效 30 分鐘。",
    detail: [
      "收件人地址可以用日本郵遞區號自動帶出都道府縣 + 市區町村",
      "尺寸不會選的話,可以先在 /quote 試算,再回 App 套用",
      "QR Code 過期重新生成即可,不影響已預填的內容",
      "送り状本體不需手寫,完全用 App 鍵盤輸入(中文輸入法可以)",
    ],
  },
  {
    n: 3,
    title: "帶行李 + QR 到 持込點 → ネコピット 掃碼 → 結帳",
    body: "去任一持込點:ヤマト 営業所、PUDO 機(地下鐵站 / 商辦樓內 24h)、7-Eleven、ファミリーマート。ヤマト 営業所有「ネコピット」機台 — 把 QR 對著機台鏡頭掃一下,印出送り状,貼在行李上,結帳即完成。",
    detail: [
      "全程不用寫字、不用講日文",
      "現金 / 信用卡 / 交通系 IC(Suica/Pasmo/ICOCA)/ PayPay / d払い 都可付",
      "コンビニ(7-11/ファミマ)持込只需把 QR 給店員掃,直接付錢",
      "PUDO 機 24h 都能用,適合早班機 / 夜間寄送",
    ],
  },
] as const;

const PICKUP_POINTS = [
  {
    name: "ヤマト 営業所",
    count: "全國約 4,000 點",
    hours: "依分店,通常 09-19",
    note: "有 ネコピット 機台、店員協助,新手友善",
    pro: "可現金 / 卡 / IC 結帳",
  },
  {
    name: "PUDO 機",
    count: "全國約 6,000 機",
    hours: "24 小時",
    note: "地下鐵站、商辦大樓、超商外設置;觸控操作",
    pro: "深夜也能寄、不用排隊",
  },
  {
    name: "7-Eleven",
    count: "全國約 21,000 店",
    hours: "24 小時",
    note: "把 QR 給店員掃即可",
    pro: "便利店密度最高",
  },
  {
    name: "ファミリーマート",
    count: "全國約 16,000 店",
    hours: "24 小時",
    note: "把 QR 給店員掃即可",
    pro: "支援樂天 Edy / FamiPay 結帳",
  },
] as const;

const FAQS = [
  {
    q: "沒日本手機門號可以註冊 App 嗎?",
    a: "可以,App 接受 email 註冊,SMS 認證可走 email 連結代替。LINE 連携版直接用 LINE 帳號,完全不需日本門號。",
  },
  {
    q: "App 有中文介面嗎?",
    a: "目前沒有中文版。但介面圖示化、步驟標準化,跟著漢字 + 數字 + 圖示按就可以。如真的卡住,Google 翻譯相機掃畫面即可。",
  },
  {
    q: "信用卡 / 海外卡能用嗎?",
    a: "信用卡可在 App 內事前存,結帳時直接扣,海外發行的 Visa / Master / JCB / Amex 多數可用。コンビニ持込也可用 PayPay / d払い 等 QR 支付。",
  },
  {
    q: "QR Code 過期怎麼辦?",
    a: "QR 從生成起 30 分鐘內有效。過期了就在 App 重新生成同一份送り状,內容會自動帶入,不需重填。",
  },
  {
    q: "機場 ヤマト 櫃台 也能用 QR 嗎?",
    a: "機場專用「空港宅急便」櫃台主要走現場 紙本送り状 流程,不一定能用 ネコピット 掃碼。但若已在 App 預填過,雖無法掃碼,仍可享 デジタル割 -¥60。",
  },
  {
    q: "如果不會掃碼怎麼辦?",
    a: "去 ヤマト 営業所,直接把 QR Code 給櫃檯店員看,他們會幫忙掃。コンビニ也是直接給店員掃。完全不需自己操作機台。",
  },
] as const;

export default function QrAppGuide() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "JPLuggageGo",
        item: `${BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "寄行李教學",
        item: `${BASE_URL}/guide/shipping`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "ヤマト QR 寄行李教學",
        item: `${BASE_URL}/guide/shipping/qr-app`,
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
        <nav className="text-xs text-zinc-500 flex flex-wrap gap-1.5 items-center">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            JPLuggageGo
          </Link>
          <span>/</span>
          <Link
            href="/guide/shipping"
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            寄行李教學
          </Link>
          <span>/</span>
          <span className="text-zinc-700 dark:text-zinc-300">QR 無紙化</span>
        </nav>

        <header className="mt-6">
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 text-[11px] font-medium">
            不用日文 · 手機 3 步驟
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
            ヤマト 黒猫 QR 寄行李教學
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            App 預填送り状(運單)→ 拿 QR Code → 帶行李去 營業所 / PUDO / 7-11 /
            ファミマ → 機台一掃 → 結帳。<strong>全程不用寫字、不用講日文。</strong>
            而且還能省 ¥160 / 件(持込割 ¥100 + デジタル割 ¥60)。
          </p>
        </header>

        {/* 省錢公式 highlight */}
        <section className="mt-8 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-5">
          <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            省錢公式
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-100 tabular-nums">
            持込割 <span className="text-3xl">¥100</span>
            <span className="mx-2 text-emerald-700 dark:text-emerald-300">+</span>
            デジタル割 <span className="text-3xl">¥60</span>
            <span className="mx-2 text-emerald-700 dark:text-emerald-300">=</span>
            <span className="text-3xl">¥160</span> / 件
          </div>
          <p className="mt-2 text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
            <strong>持込割</strong>:自己拿到 営業所 / コンビニ 持込點寄,
            -¥100。
            <strong className="ml-2">デジタル割</strong>:用 App 預填送り状(無紙化),
            -¥60。
            兩個可疊加,寄 1 件最多省 ¥160,寄 2 件就是 ¥320。
          </p>
        </section>

        {/* 三步驟流程 */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            操作流程(3 步驟)
          </h2>
          <ol className="mt-4 space-y-4">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold flex items-center justify-center">
                    {s.n}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {s.body}
                    </p>
                    <ul className="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                      {s.detail.map((d, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-zinc-400">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 持込點對比 */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            4 種持込點任你選
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            持込割 -¥100 同樣適用。看哪個離你最近 / 哪個營業時間配合行程。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PICKUP_POINTS.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
              >
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {p.name}
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">
                  {p.count} · {p.hours}
                </div>
                <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {p.note}
                </p>
                <div className="mt-2 inline-block rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-1.5 py-0.5 text-[10px] text-emerald-800 dark:text-emerald-200">
                  ✓ {p.pro}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 注意事項 */}
        <section className="mt-10 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5">
          <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
            ⚠️ 注意事項
          </h2>
          <ul className="mt-3 space-y-2 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                QR 30 分鐘有效,行程延誤時要重生成。
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                コンビニ持込:不收冷藏 / 冷凍 / 生鮮、行李箱(體積限制嚴格)。
                這些要去 ヤマト 営業所。
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                行李箱寄送 → 推薦 営業所 或 PUDO 中型機,コンビニ會被擋。
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                飯店代寄 不適用持込割(¥100),但能省自己搬行李的力氣。
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                機場「空港宅急便」櫃台主要走 紙本送り状,不一定能掃 QR;但 App 預填過仍享 デジタル割 -¥60。
              </span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            FAQ
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {FAQS.map((f, i) => (
              <details key={i} className="group">
                <summary className="cursor-pointer px-5 py-4 flex items-baseline justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Q. {f.q}
                  </span>
                  <span className="text-zinc-400 group-open:rotate-180 transition shrink-0">
                    ▼
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link
            href="/quote"
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
          >
            <div className="text-xs text-zinc-500">先試算運費</div>
            <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              /quote 比價試算 →
            </div>
            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
              選機場 / 都道府縣 + 尺寸,即時看 Yamato vs Yu-Pack 報價
            </p>
          </Link>
          <Link
            href="/guide/shipping/branch-office"
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
          >
            <div className="text-xs text-zinc-500">想看完整教學</div>
            <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              営業所持込 全流程 →
            </div>
            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
              送り状欄位、日文情境句、常見卡關處理
            </p>
          </Link>
        </section>

        {/* 來源 */}
        <section className="mt-12">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            資料來源
          </h2>
          <ul className="mt-2 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <li>
              <a
                href="https://www.kuronekoyamato.co.jp/ytc/customer/send/sp/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 underline"
              >
                ヤマト 公式「宅急便をスマホで送る」
              </a>
            </li>
            <li>
              <a
                href="https://www.kuronekoyamato.co.jp/ytc/customer/send/members/rakuraku/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 underline"
              >
                らくらく送り状発行サービス
              </a>
            </li>
            <li>
              <a
                href="https://faq.kuronekoyamato.co.jp/app/answers/detail/a_id/2562/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 underline"
              >
                ヤマト FAQ:QR Code 出し方 · 有効期限
              </a>
            </li>
            <li>
              <a
                href="https://line-works.com/landing/takkyubin-okuru/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 underline"
              >
                LINE 連携アプリ「宅急便を送る」
              </a>
            </li>
          </ul>
          <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
            ※ 資料更新於 2026-04;ヤマト 服務細節以官方公告為準。
            持込割 ¥100 / デジタル割 ¥60 為現行金額。
          </p>
        </section>
      </div>
    </main>
  );
}
