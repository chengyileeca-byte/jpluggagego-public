"use client";

import { useState } from "react";

type Speed = "fast" | "medium" | "slow";
type Food = "has" | "none";
type Weight = "light" | "heavy";

interface Answers {
  speed: Speed | null;
  food: Food | null;
  weight: Weight | null;
}

interface Recommendation {
  primary: {
    name: string;
    tone: "red" | "amber" | "sky" | "emerald";
    why: string;
    transit: string;
  };
  yamatoAlt?: string;
  hints: string[];
}

function resolve(a: Answers): Recommendation | null {
  if (a.speed === null || a.food === null || a.weight === null) return null;

  const isHeavy = a.weight === "heavy";
  const hasFood = a.food === "has";
  const yamatoBlocked = isHeavy || hasFood;

  const hints: string[] = [];
  if (isHeavy) hints.push("超過 25 kg 只能走郵便局 — Yamato 上限 25 kg/件。");
  if (hasFood) hints.push("有食品必須走郵便局 — Yamato 對食品一律拒收。");
  hints.push("所有郵便局服務(EMS / 航空 / 船便)禁寄行動電源與電子菸。");

  if (a.speed === "fast") {
    return {
      primary: {
        name: "郵便局 EMS",
        tone: "red",
        transit: "2-4 天",
        why: "急件首選,追蹤完整,台日雙邊海關最熟悉。",
      },
      yamatoAlt: yamatoBlocked
        ? undefined
        : "若想要台灣落地 Yamato 自家派送 + 中文客服補件,可改選 Yamato 國際宅急便(+¥500~¥1,500、+5~+6 天)。",
      hints,
    };
  }

  if (a.speed === "medium") {
    return {
      primary: {
        name: "郵便局 航空小包",
        tone: "amber",
        transit: "6-8 天",
        why: "比 EMS 省 30-50%,時效比船便快 2-3 倍,CP 最高。",
      },
      yamatoAlt: yamatoBlocked
        ? undefined
        : "若重視台灣側派送體驗,可考慮 Yamato 國際宅急便(略貴、但客服處理扣關最順)。",
      hints,
    };
  }

  return {
    primary: {
      name: "郵便局 船便",
      tone: "emerald",
      transit: "14-21 天",
      why: "最便宜,20 kg 約 ¥9,400(EMS 約 ¥18,600),省一半以上。",
    },
    yamatoAlt: "Yamato 沒有海運選項,要等就只能走郵便局船便。",
    hints: [
      ...hints,
      "船便外箱建議雙層紙箱 + 六圈封箱膠帶,防船艙濕氣與多次裝卸。",
    ],
  };
}

const TONE_CLASS: Record<Recommendation["primary"]["tone"], string> = {
  red: "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100",
  amber:
    "border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100",
  sky: "border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-100",
  emerald:
    "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100",
};

export function TaiwanServiceQuiz() {
  const [answers, setAnswers] = useState<Answers>({
    speed: null,
    food: null,
    weight: null,
  });

  const recommendation = resolve(answers);

  return (
    <div className="space-y-4">
      <QuizQuestion
        label="1. 多快要送達台灣?"
        options={[
          { value: "fast", label: "3 天內必須到", hint: "親友要用、趕期限" },
          { value: "medium", label: "1 週可以等", hint: "一般自用,想省錢" },
          { value: "slow", label: "2-3 週都行", hint: "不急,要最便宜" },
        ]}
        current={answers.speed}
        onSelect={(v) => setAnswers((a) => ({ ...a, speed: v as Speed }))}
      />
      <QuizQuestion
        label="2. 箱子裡有食品嗎?"
        options={[
          { value: "has", label: "有", hint: "泡麵、零食、茶、醬料等" },
          { value: "none", label: "沒有", hint: "純衣物、紀念品、文具" },
        ]}
        current={answers.food}
        onSelect={(v) => setAnswers((a) => ({ ...a, food: v as Food }))}
      />
      <QuizQuestion
        label="3. 包裹重量 / 尺寸?"
        options={[
          { value: "light", label: "≤ 25 kg", hint: "Yamato 跟郵便局都可" },
          {
            value: "heavy",
            label: "超過 25 kg",
            hint: "大件行李箱、一次寄多箱",
          },
        ]}
        current={answers.weight}
        onSelect={(v) => setAnswers((a) => ({ ...a, weight: v as Weight }))}
      />

      {recommendation ? (
        <div
          className={`rounded-xl border p-4 ${TONE_CLASS[recommendation.primary.tone]}`}
        >
          <div className="text-[11px] tracking-wide uppercase opacity-70">
            推薦 · {recommendation.primary.transit}
          </div>
          <div className="mt-1 text-xl font-bold">
            {recommendation.primary.name}
          </div>
          <p className="mt-2 text-sm leading-relaxed">
            {recommendation.primary.why}
          </p>
          {recommendation.yamatoAlt && (
            <p className="mt-2 text-xs leading-relaxed opacity-80">
              💡 {recommendation.yamatoAlt}
            </p>
          )}
          <ul className="mt-3 space-y-1 text-xs opacity-80 leading-relaxed">
            {recommendation.hints.map((h, i) => (
              <li key={i}>· {h}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="#calc"
              className="inline-flex items-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 text-xs font-medium hover:opacity-90"
            >
              → 試算運費
            </a>
            <button
              type="button"
              onClick={() =>
                setAnswers({ speed: null, food: null, weight: null })
              }
              className="inline-flex items-center rounded-lg border border-current px-3 py-1.5 text-xs font-medium opacity-70 hover:opacity-100"
            >
              重新選擇
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          回答 3 題,系統直接推薦最合適的一家服務。
        </p>
      )}
    </div>
  );
}

interface QuizOption {
  value: string;
  label: string;
  hint?: string;
}

function QuizQuestion({
  label,
  options,
  current,
  onSelect,
}: {
  label: string;
  options: QuizOption[];
  current: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {label}
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((o) => {
          const active = current === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onSelect(o.value)}
              className={`text-left rounded-lg border px-3 py-2 transition ${
                active
                  ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              }`}
            >
              <div className="text-sm font-medium">{o.label}</div>
              {o.hint && (
                <div
                  className={`text-[11px] mt-0.5 ${
                    active
                      ? "opacity-80"
                      : "text-zinc-500 dark:text-zinc-500"
                  }`}
                >
                  {o.hint}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
