"use client";

import { useEffect, useMemo, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import {
  JPY_TO_TWD,
  JPY_TO_TWD_VERIFIED_AT,
  jpyToTwd,
} from "@/lib/exchange-rate";
import { PREFILL_FREIGHT_EVENT } from "./_prefill-event";

// 稅率來源:財政部關務署「進口稅則」常見章節,並以 WTO ITA(資訊科技協定)
// 對 3C 零關稅的豁免校準(手機/筆電/相機 0%),化妝品 33 章 0% 已查證
// (Rainieis、Money101、iHerb 多源交叉驗證一致)。
// 真實進口依細項 HS code 差異,本頁為估算工具不為法律依據。
const CATEGORIES = [
  { code: "general", rate: 0.1, labelKey: "toTw.tariff.cat.general" },
  { code: "clothing", rate: 0.12, labelKey: "toTw.tariff.cat.clothing" },
  { code: "food", rate: 0.1, labelKey: "toTw.tariff.cat.food" },
  { code: "cosmetics", rate: 0, labelKey: "toTw.tariff.cat.cosmetics" },
  { code: "electronics", rate: 0, labelKey: "toTw.tariff.cat.electronics" },
  { code: "appliance", rate: 0.05, labelKey: "toTw.tariff.cat.appliance" },
  { code: "watch", rate: 0.04, labelKey: "toTw.tariff.cat.watch" },
  { code: "shoes", rate: 0.05, labelKey: "toTw.tariff.cat.shoes" },
  { code: "bag", rate: 0.066, labelKey: "toTw.tariff.cat.bag" },
  { code: "leather", rate: 0.067, labelKey: "toTw.tariff.cat.leather" },
  { code: "supplement", rate: 0.3, labelKey: "toTw.tariff.cat.supplement" },
  { code: "tobacco_alcohol", rate: -1, labelKey: "toTw.tariff.cat.tobacco" },
] as const;

const VAT_RATE = 0.05;
const EXEMPTION_TWD = 2000;
const FORMAL_CUSTOMS_THRESHOLD_TWD = 50_000;
const FREQUENCY_LIMIT = 6;

interface Result {
  cif: number;
  exempt: boolean;
  importDuty: number;
  vat: number;
  total: number;
  notes: string[];
  warnings: string[];
}

function computeTariff({
  goods,
  freight,
  rate,
  category,
  timesInHalfYear,
}: {
  goods: number;
  freight: number;
  rate: number;
  category: string;
  timesInHalfYear: number;
}): Result {
  const cif = goods + freight;
  const notes: string[] = [];
  const warnings: string[] = [];

  if (category === "tobacco_alcohol") {
    warnings.push(
      "菸酒從第 1 次就課稅,且稅率極高(菸品稅+健康捐,每包可能 ≥ 稅後 NT$80)。強烈建議改旅行手提。",
    );
    return { cif, exempt: false, importDuty: 0, vat: 0, total: 0, notes, warnings };
  }

  if (category === "food") {
    warnings.push(
      "食品以「一般零食/餅乾/茶」10% 估算。肉類/糖/米/酒類稅率可達 15-30%,請以實際 HS code 為準。",
    );
  }
  if (category === "electronics") {
    notes.push(
      "手機、筆電、相機、平板等依 WTO ITA 協定一般為 0% 進口關稅(仍需繳 5% 營業稅)。若為小家電請改選「小家電」類別。",
    );
  }
  if (category === "cosmetics") {
    notes.push(
      "化妝品 / 保養品 / 彩妝(HS 第 33 章)進口關稅 0%,仍需繳 5% 營業稅。注意:含藥化妝品、處方保養需另查細項。",
    );
  }
  if (category === "supplement") {
    warnings.push(
      "保健食品不僅關稅高(30%),個人進口還有「6 瓶、合計 36 瓶/年」數量上限(《食品及相關產品輸入查驗辦法》),超量一律全額課稅 + 可能退運。",
    );
  }

  const freqOver = timesInHalfYear >= FREQUENCY_LIMIT + 1;
  const isSmall = cif <= EXEMPTION_TWD;
  const exempt = isSmall && !freqOver;

  if (exempt) {
    notes.push(`CIF NT$${cif.toLocaleString()} ≤ NT$${EXEMPTION_TWD.toLocaleString()} 免稅額,且半年內累計第 ${timesInHalfYear} 次(未超過 ${FREQUENCY_LIMIT} 次)。`);
    return { cif, exempt: true, importDuty: 0, vat: 0, total: 0, notes, warnings };
  }

  if (freqOver) {
    warnings.push(`半年內已累計第 ${timesInHalfYear} 次郵包(> ${FREQUENCY_LIMIT} 次門檻),從第 7 次起一律課稅,不享免稅。`);
  } else if (!isSmall) {
    notes.push(`CIF NT$${cif.toLocaleString()} > 免稅額 NT$${EXEMPTION_TWD.toLocaleString()},需課稅。`);
  }

  warnings.push("⚠ EZ WAY 2026-03-01 起強制事前委任:所有個人簡易申報跨境快遞(含免稅包裹)都要先在 App 點「申報相符」海關才受理報關,48 小時未點部分業者收倉儲費(≥ NT$450)、2-7 天退運。抵台前務必下載 App + 身分證+健保卡註冊 + 開推播。");
  if (cif > FORMAL_CUSTOMS_THRESHOLD_TWD) {
    warnings.push(`CIF > NT$${FORMAL_CUSTOMS_THRESHOLD_TWD.toLocaleString()} 強制 G1 正式報關(《快遞貨物通關辦法》法定),須紙本個人委任書 + 身分證影本,要找報關行或攜資料到關務署郵包組辦理。`);
  }

  const importDuty = Math.round(cif * rate);
  const vat = Math.round((cif + importDuty) * VAT_RATE);
  const total = importDuty + vat;

  return { cif, exempt: false, importDuty, vat, total, notes, warnings };
}

export function TariffCalculator({ lang }: { lang: Lang }) {
  const [goodsStr, setGoodsStr] = useState("5000");
  const [freightStr, setFreightStr] = useState("3900");
  const [category, setCategory] = useState<string>("general");
  const [timesStr, setTimesStr] = useState("1");
  const [prefilledFromJpy, setPrefilledFromJpy] = useState<number | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ jpy: number }>).detail;
      if (!detail || typeof detail.jpy !== "number") return;
      const twd = jpyToTwd(detail.jpy);
      setFreightStr(String(twd));
      setPrefilledFromJpy(detail.jpy);
      const el = document.getElementById("tariff-calc-root");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener(PREFILL_FREIGHT_EVENT, handler);
    return () => window.removeEventListener(PREFILL_FREIGHT_EVENT, handler);
  }, []);

  const result = useMemo<Result | null>(() => {
    const goods = parseFloat(goodsStr);
    const freight = parseFloat(freightStr);
    const times = parseInt(timesStr, 10);
    if (!Number.isFinite(goods) || goods < 0) return null;
    if (!Number.isFinite(freight) || freight < 0) return null;
    if (!Number.isFinite(times) || times < 1) return null;
    const cat = CATEGORIES.find((c) => c.code === category);
    if (!cat) return null;
    return computeTariff({
      goods,
      freight,
      rate: cat.rate,
      category: cat.code,
      timesInHalfYear: times,
    });
  }, [goodsStr, freightStr, category, timesStr]);

  return (
    <div id="tariff-calc-root" className="space-y-4 scroll-mt-20">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-[11px] text-zinc-500 dark:text-zinc-500">
          {t(lang, "toTw.tariff.calc.rate_badge")}:{" "}
          <span className="font-mono">¥1 = NT${JPY_TO_TWD.toFixed(3)}</span>
          <span className="opacity-60"> ({JPY_TO_TWD_VERIFIED_AT})</span>
        </div>
        {prefilledFromJpy !== null && (
          <div className="text-[11px] text-blue-700 dark:text-blue-300">
            {t(lang, "toTw.tariff.calc.prefilled_from")}: ¥
            {prefilledFromJpy.toLocaleString()} → NT$
            {jpyToTwd(prefilledFromJpy).toLocaleString()}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            {t(lang, "toTw.tariff.calc.goods")} (TWD)
          </span>
          <input
            type="number"
            min={0}
            step={100}
            value={goodsStr}
            onChange={(e) => setGoodsStr(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            {t(lang, "toTw.tariff.calc.freight")} (TWD)
          </span>
          <input
            type="number"
            min={0}
            step={100}
            value={freightStr}
            onChange={(e) => setFreightStr(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none"
          />
          <span className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 block leading-snug">
            {t(lang, "toTw.tariff.calc.freight_hint")}
          </span>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            {t(lang, "toTw.tariff.calc.category")}
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.code} value={c.code}>
                {t(lang, c.labelKey)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            {t(lang, "toTw.tariff.calc.times")}
          </span>
          <input
            type="number"
            min={1}
            max={20}
            step={1}
            value={timesStr}
            onChange={(e) => setTimesStr(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none"
          />
        </label>
      </div>

      {result && <TariffResult result={result} lang={lang} />}
    </div>
  );
}

function TariffResult({ result, lang }: { result: Result; lang: Lang }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-xs text-zinc-500 dark:text-zinc-500">
          CIF {t(lang, "toTw.tariff.calc.cif_sum")}
        </div>
        <div className="text-sm font-mono tabular-nums text-zinc-900 dark:text-zinc-50">
          NT${result.cif.toLocaleString()}
        </div>
      </div>

      {result.exempt ? (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-3">
          <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            ✓ {t(lang, "toTw.tariff.calc.exempt_title")}
          </div>
          <div className="mt-1 text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed">
            {t(lang, "toTw.tariff.calc.exempt_body")}
          </div>
        </div>
      ) : result.total === 0 && result.warnings.length > 0 ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3">
          <div className="text-sm font-semibold text-red-800 dark:text-red-200">
            ⚠ {t(lang, "toTw.tariff.calc.tobacco_title")}
          </div>
        </div>
      ) : (
        <div className="space-y-1.5 text-sm">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-zinc-600 dark:text-zinc-400">
              {t(lang, "toTw.tariff.calc.import_duty")}
            </span>
            <span className="font-mono tabular-nums text-zinc-900 dark:text-zinc-50">
              NT${result.importDuty.toLocaleString()}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-zinc-600 dark:text-zinc-400">
              {t(lang, "toTw.tariff.calc.vat")}
            </span>
            <span className="font-mono tabular-nums text-zinc-900 dark:text-zinc-50">
              NT${result.vat.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2 flex items-baseline justify-between gap-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {t(lang, "toTw.tariff.calc.total")}
            </span>
            <span className="text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
              NT${result.total.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {result.notes.map((note, i) => (
        <p key={`n-${i}`} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {note}
        </p>
      ))}
      {result.warnings.map((w, i) => (
        <p key={`w-${i}`} className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          ⚠ {w}
        </p>
      ))}
    </div>
  );
}
