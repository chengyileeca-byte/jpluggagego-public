"use client";

import { useState } from "react";

export type ProhibitionScenario = "domestic" | "to-taiwan";

interface ProhibitionQuestion {
  id: string;
  /** 勾選題文字(問使用者) */
  question: string;
  /** 回 Yes 時顯示的紅色警告 */
  blocker: {
    title: string;
    body: string;
  };
}

const DOMESTIC_QUESTIONS: ProhibitionQuestion[] = [
  {
    id: "power-bank",
    question: "箱子裡有行動電源(モバイルバッテリー)、散裝鋰電池、電子菸嗎?",
    blocker: {
      title: "這項不能寄 — 請從箱子取出隨身手提",
      body: "日本國內宅配(Yamato 宅急便 / ゆうパック)一律禁止液態鋰電池單體與電子菸。行動電源、散裝 18650、AA/AAA 可充電電池都要手提,筆電/相機等「電池內建於機器」可以寄。",
    },
  },
  {
    id: "aerosol",
    question: "有噴霧罐嗎?(防曬噴霧、止汗劑噴霧、髮膠、殺蟲劑、可燃噴霧)",
    blocker: {
      title: "這項不能寄 — 含推進劑的噴霧受航空貨物法限制",
      body: "日本國內宅配對可燃性/高壓氣體一律拒收。防曬/止汗劑請改用乳液或固體款,或直接手提(機艙規定 ≤ 100 mL/瓶、合計 ≤ 2 kg)。",
    },
  },
  {
    id: "valuable",
    question: "有現金、貴金屬、無可替代的證件(護照、身分證)嗎?",
    blocker: {
      title: "絕對不要寄 — 貨損無從補償",
      body: "現金與貴金屬是所有日本宅配的約款明文拒收品;即使真的寄丟或遺失,運送人免責。護照遺失在國外補辦需 1-2 週,絕對要隨身。",
    },
  },
];

const TO_TAIWAN_QUESTIONS: ProhibitionQuestion[] = [
  {
    id: "power-bank",
    question: "箱子裡有行動電源、散裝鋰電池、電子菸嗎?",
    blocker: {
      title: "這項不能寄 — 請手提上飛機",
      body: "日本郵便所有服務(EMS / 航空小包 / 船便)與 Yamato 國際宅急便一律禁止液態鋰電池單體。回台灣只能手提(航空公司通常限 ≤ 100 Wh)。",
    },
  },
  {
    id: "meat",
    question: "有肉類或肉製品嗎?(牛肉乾、火腿、香腸、肉鬆、含肉湯底泡麵)",
    blocker: {
      title: "台灣防疫禁止 — 從第 1 公克起都違法",
      body: "台灣防疫法禁止所有肉類製品入境,含真空包、罐頭、乾燥、調味包。被查獲會沒入 + 行政罰。日本人氣伴手禮「牛タン」「ビーフジャーキー」「松阪牛カレー」都中招。改買海鮮加工品(鰹節、海苔)或純素商品。",
    },
  },
  {
    id: "meds-over-limit",
    question: "藥品 ≥ 4 種,或單項 ≥ 3 盒,或保健食品 > 36 瓶?",
    blocker: {
      title: "超量會被扣關 — 強烈建議分裝或減量",
      body: "台灣規定:藥品每種 ≤ 2 盒、合計 ≤ 6 種;保健食品每種 ≤ 12 瓶、總和 ≤ 36 瓶。超量視同商業進口,須進口許可否則沒入。實務建議:單次郵包控制在 3 種藥內、每種 1 盒,保留日文原包裝利通關。",
    },
  },
];

const QUESTIONS_BY_SCENARIO: Record<
  ProhibitionScenario,
  ProhibitionQuestion[]
> = {
  domestic: DOMESTIC_QUESTIONS,
  "to-taiwan": TO_TAIWAN_QUESTIONS,
};

type Answer = "yes" | "no" | null;

export function ProhibitionGate({
  scenario,
  title,
  intro,
  prohibitedHref,
}: {
  scenario: ProhibitionScenario;
  title: string;
  intro: string;
  /** 禁寄品總表的錨點連結,「查看完整清單」按鈕會指過去 */
  prohibitedHref: string;
}) {
  const questions = QUESTIONS_BY_SCENARIO[scenario];
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, null])),
  );

  const allAnswered = questions.every((q) => answers[q.id] !== null);
  const blockers = questions.filter((q) => answers[q.id] === "yes");
  const passed = allAnswered && blockers.length === 0;

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-base"
        >
          ⚠
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {intro}
          </p>
        </div>
      </div>

      <ol className="mt-4 space-y-3">
        {questions.map((q, idx) => {
          const current = answers[q.id];
          return (
            <li
              key={q.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3"
            >
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] flex items-center justify-center font-semibold">
                  {idx + 1}
                </span>
                <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-snug flex-1">
                  {q.question}
                </p>
              </div>
              <div className="mt-2 flex gap-2 pl-8">
                <AnswerButton
                  label="有"
                  active={current === "yes"}
                  tone="danger"
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [q.id]: "yes" }))
                  }
                />
                <AnswerButton
                  label="沒有"
                  active={current === "no"}
                  tone="safe"
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [q.id]: "no" }))
                  }
                />
              </div>
            </li>
          );
        })}
      </ol>

      {blockers.length > 0 && (
        <div className="mt-4 space-y-3">
          {blockers.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4"
            >
              <div className="text-sm font-semibold text-red-800 dark:text-red-200">
                {q.blocker.title}
              </div>
              <p className="mt-1 text-xs text-red-700 dark:text-red-300 leading-relaxed">
                {q.blocker.body}
              </p>
            </div>
          ))}
          <a
            href={prohibitedHref}
            className="inline-block text-xs text-zinc-600 dark:text-zinc-400 underline hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            查看完整禁寄品清單 →
          </a>
        </div>
      )}

      {passed && (
        <div className="mt-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-4">
          <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            ✅ 雷區排除,可以往下看打包流程
          </div>
          <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
            這 3 題擋掉最常見的退件/扣關場景。完整禁寄品仍建議快速掃一遍:
            <a
              href={prohibitedHref}
              className="underline hover:opacity-80 ml-1"
            >
              禁寄品清單
            </a>
          </p>
        </div>
      )}

      {!allAnswered && blockers.length === 0 && (
        <p className="mt-4 text-[11px] text-zinc-500 dark:text-zinc-500">
          回答 3 題後會顯示結論。
        </p>
      )}
    </section>
  );
}

function AnswerButton({
  label,
  active,
  tone,
  onClick,
}: {
  label: string;
  active: boolean;
  tone: "danger" | "safe";
  onClick: () => void;
}) {
  const activeClass =
    tone === "danger"
      ? "bg-red-600 text-white border-red-600"
      : "bg-emerald-600 text-white border-emerald-600";
  const idleClass =
    "border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-xs font-medium border transition ${active ? activeClass : idleClass}`}
    >
      {label}
    </button>
  );
}
