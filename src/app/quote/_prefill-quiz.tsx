"use client";

import Link from "next/link";
import { useState } from "react";
import { PREFECTURES_BY_REGION, REGIONS } from "@/lib/japan";

type FromMode = "airport" | "pref";

interface MajorAirport {
  iata: string;
  label: string;
}

const MAJOR_AIRPORTS: MajorAirport[] = [
  { iata: "NRT", label: "NRT 成田(東京)" },
  { iata: "HND", label: "HND 羽田(東京)" },
  { iata: "KIX", label: "KIX 関西(大阪)" },
  { iata: "ITM", label: "ITM 伊丹(大阪)" },
  { iata: "NGO", label: "NGO 中部(名古屋)" },
  { iata: "FUK", label: "FUK 福岡" },
  { iata: "CTS", label: "CTS 新千歳(札幌)" },
  { iata: "OKA", label: "OKA 那覇(沖縄)" },
];

interface SizePreset {
  code: string;
  label: string;
  hint: string;
}

const SIZE_PRESETS: SizePreset[] = [
  { code: "60", label: "60サイズ", hint: "後背包 / 手提紙袋 · ~2 kg" },
  { code: "100", label: "100サイズ", hint: "21 吋手提行李箱 · ~10 kg" },
  { code: "140", label: "140サイズ", hint: "26 吋行李箱 / 滿滿一大紙箱 · ~20 kg" },
  { code: "160", label: "160サイズ", hint: "29 吋行李箱 / 大型紙箱 · ~25 kg" },
];

export function PrefillQuiz() {
  const [fromMode, setFromMode] = useState<FromMode | null>(null);
  const [fromValue, setFromValue] = useState<string>("");
  const [toPref, setToPref] = useState<string>("");
  const [size, setSize] = useState<string>("");

  const valid = fromMode !== null && fromValue !== "" && toPref !== "" && size !== "";

  const href = (() => {
    if (!valid) return "#";
    const q = new URLSearchParams();
    q.set("from_mode", fromMode);
    if (fromMode === "airport") q.set("from", `airport:${fromValue}`);
    else q.set("from", `pref:${fromValue}`);
    q.set("to_pref", toPref);
    q.set("size", size);
    return `/quote?${q.toString()}`;
  })();

  return (
    <div>
      <div className="space-y-3">
        {/* Q1 · 現在在哪 */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            1. 你現在在哪裡?
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <QuizButton
              active={fromMode === "airport"}
              label="剛下飛機 · 在機場"
              hint="要把行李直接寄到飯店,輕裝搭電車"
              onClick={() => {
                setFromMode("airport");
                setFromValue("");
              }}
            />
            <QuizButton
              active={fromMode === "pref"}
              label="已經在某個縣市"
              hint="在旅館 / 營業所 / 郵便局 寄"
              onClick={() => {
                setFromMode("pref");
                setFromValue("");
              }}
            />
          </div>

          {fromMode === "airport" && (
            <div className="mt-3">
              <label className="text-[11px] text-zinc-600 dark:text-zinc-400">
                哪個機場?
              </label>
              <select
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option value="">-- 選機場 --</option>
                {MAJOR_AIRPORTS.map((a) => (
                  <option key={a.iata} value={a.iata}>
                    {a.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-500">
                沒在清單?表單上還有 16 個機場可選。
              </p>
            </div>
          )}

          {fromMode === "pref" && (
            <div className="mt-3">
              <label className="text-[11px] text-zinc-600 dark:text-zinc-400">
                哪個都道府縣?
              </label>
              <select
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option value="">-- 選縣市 --</option>
                {REGIONS.map((r) => (
                  <optgroup key={r} label={r}>
                    {PREFECTURES_BY_REGION[r].map((p) => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Q2 · 要寄到哪 */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
            2. 寄到哪一個縣市?
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
            通常是你下一家飯店的縣市。不確定就選東京都 / 大阪府 / 京都府。
          </p>
          <select
            value={toPref}
            onChange={(e) => setToPref(e.target.value)}
            className="mt-2 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          >
            <option value="">-- 選縣市 --</option>
            {REGIONS.map((r) => (
              <optgroup key={r} label={r}>
                {PREFECTURES_BY_REGION[r].map((p) => (
                  <option key={p.code} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Q3 · 多大 */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            3. 要寄多大一件?
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SIZE_PRESETS.map((s) => (
              <QuizButton
                key={s.code}
                active={size === s.code}
                label={s.label}
                hint={s.hint}
                onClick={() => setSize(s.code)}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-500">
            兩件以上?填完先看一件的運費 × 件數即可。Yamato 上限 25 kg / ゆうパック 上限 25 kg,超過就要分箱。
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        {valid ? (
          <Link
            href={href}
            className="inline-flex items-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-xs font-semibold hover:opacity-90"
          >
            → 看我的運費
          </Link>
        ) : (
          <span className="inline-flex items-center rounded-lg bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600 px-4 py-2 text-xs font-semibold cursor-not-allowed">
            → 填完 3 題才能看運費
          </span>
        )}
        {valid && (
          <button
            type="button"
            onClick={() => {
              setFromMode(null);
              setFromValue("");
              setToPref("");
              setSize("");
            }}
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 underline"
          >
            重新填
          </button>
        )}
      </div>
    </div>
  );
}

function QuizButton({
  active,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-lg border px-3 py-2 transition ${
        active
          ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
          : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
      }`}
    >
      <div className="text-sm font-medium">{label}</div>
      <div
        className={`text-[11px] mt-0.5 ${
          active ? "opacity-80" : "text-zinc-500 dark:text-zinc-500"
        }`}
      >
        {hint}
      </div>
    </button>
  );
}
