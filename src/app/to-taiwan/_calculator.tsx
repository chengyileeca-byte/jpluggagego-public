"use client";

import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { PREFILL_FREIGHT_EVENT } from "./_prefill-event";

const YAMATO_SIZES = [
  { code: "b4_doc", label: "書類 B4(1 kg)" },
  { code: "60", label: "60 cm(2 kg)" },
  { code: "80", label: "80 cm(5 kg)" },
  { code: "100", label: "100 cm(10 kg)" },
  { code: "120", label: "120 cm(15 kg)" },
  { code: "140", label: "140 cm(20 kg)" },
  { code: "160", label: "160 cm(25 kg)" },
] as const;

interface YuuQuoteSlot {
  available: boolean;
  overweight?: boolean;
  step_weight_g?: number;
  price_jpy?: number | null;
  max_weight_g?: number;
}

interface YamatoQuote {
  available: boolean;
  queried: boolean;
  size_code?: string;
  weight_kg?: number;
  price_jpy?: number | null;
  max_weight_kg?: number;
  oversize?: boolean;
  suggest_size_code?: string | null;
}

interface QuoteResponse {
  country: string;
  weight_g: number;
  yuu: {
    ems: YuuQuoteSlot;
    parcel_air: YuuQuoteSlot;
    parcel_sal: YuuQuoteSlot;
    parcel_surface: YuuQuoteSlot;
  };
  yamato: YamatoQuote;
}

type ErrorState = { error: string } | null;

const VALID_YAMATO_SIZES: Set<string> = new Set(
  YAMATO_SIZES.map((s) => s.code),
);

export function TaiwanCalculator({ lang }: { lang: Lang }) {
  const [weightKg, setWeightKg] = useState("10");
  const [yamatoSize, setYamatoSize] = useState<string>("120");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState<ErrorState>(null);

  // 從 /trip?destination=taiwan 帶過來時,URL 會有 weight_kg + yamato_size —
  // 自動填入並觸發一次查詢,省掉使用者重填的手續。只跑一次(初次 mount)。
  // 用 window.location 而非 useSearchParams:我們只在 mount 讀一次,
  // 不需要 Next 的 Suspense / CSR bailout 機制。
  const prefilledRef = useRef(false);

  async function runQuote(kg: number, size: string) {
    if (!Number.isFinite(kg) || kg <= 0) {
      setError({ error: t(lang, "toTw.calc.error_weight") });
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const g = Math.round(kg * 1000);
      const params = new URLSearchParams({
        country: "TW",
        weight_g: String(g),
      });
      if (size) params.set("yamato_size", size);
      const res = await fetch(`/api/intl-quote?${params}`);
      const data = (await res.json()) as QuoteResponse | { error: string };
      if (!res.ok || "error" in data) {
        setError({ error: "error" in data ? data.error : `HTTP ${res.status}` });
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError({ error: e instanceof Error ? e.message : "unknown" });
    } finally {
      setLoading(false);
    }
  }

  function submit() {
    runQuote(parseFloat(weightKg), yamatoSize);
  }

  useEffect(() => {
    if (prefilledRef.current) return;
    const sp = new URLSearchParams(window.location.search);
    const kgRaw = sp.get("weight_kg");
    const sizeRaw = sp.get("yamato_size");
    if (!kgRaw) return;
    const kg = parseFloat(kgRaw);
    if (!Number.isFinite(kg) || kg <= 0 || kg > 30) return;
    const size =
      sizeRaw && VALID_YAMATO_SIZES.has(sizeRaw) ? sizeRaw : yamatoSize;
    prefilledRef.current = true;
    // 這裡的 setState 是「從外部系統(URL)同步到 React」的一次性 hand-off —
    // 符合 useEffect 的合理用法,但 lint 規則擔心 re-render 瀑布。用 ref 保護
    // 只觸發一次,實務上不會 cascade。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeightKg(String(kg));
    setYamatoSize(size);
    runQuote(kg, size);
    // Initial mount only — the user owns the form after that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            {t(lang, "toTw.calc.weight")} ({t(lang, "toTw.calc.weight_unit_kg")})
          </span>
          <input
            type="number"
            min={0.5}
            max={30}
            step={0.5}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            {t(lang, "toTw.calc.yamato_size")}
          </span>
          <select
            value={yamatoSize}
            onChange={(e) => setYamatoSize(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none"
          >
            <option value="">—— {t(lang, "toTw.calc.select_yamato")} ——</option>
            {YAMATO_SIZES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
          <span className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 block leading-snug">
            {t(lang, "toTw.calc.yamato_size_hint")}
          </span>
        </label>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="w-full sm:w-auto rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
      >
        {loading ? t(lang, "toTw.calc.loading") : t(lang, "toTw.calc.submit")}
      </button>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error.error}</p>
      )}

      {result && <ResultGrid result={result} lang={lang} />}
    </div>
  );
}

function ResultCard({
  title,
  transit,
  price,
  overweight,
  maxWeightG,
  stepG,
  oversize,
  suggest,
  packingAnchor,
  lang,
}: {
  title: string;
  transit: string;
  price: number | null | undefined;
  overweight?: boolean;
  maxWeightG?: number;
  stepG?: number;
  oversize?: boolean;
  suggest?: string | null;
  /** §3 打包流程對應服務卡的 id(不含 #),連到 "#packing-ems" 等 */
  packingAnchor: string;
  lang: Lang;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-1.5">
      <div className="text-xs tracking-wide text-zinc-500 dark:text-zinc-400">
        {transit}
      </div>
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </div>
      {overweight ? (
        <div className="text-sm text-red-600 dark:text-red-400 mt-1">
          {t(lang, "toTw.calc.overweight")}
          {typeof maxWeightG === "number" && (
            <span className="text-[11px] text-zinc-500 dark:text-zinc-500 block">
              {t(lang, "toTw.calc.max_weight")}:{" "}
              {(maxWeightG / 1000).toFixed(1)} kg
            </span>
          )}
        </div>
      ) : oversize ? (
        <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">
          {t(lang, "toTw.calc.oversize")}{" "}
          <strong>{suggest ?? "—"}</strong>
        </div>
      ) : typeof price === "number" ? (
        <>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
            ¥{price.toLocaleString()}
          </div>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent(PREFILL_FREIGHT_EVENT, {
                  detail: { jpy: price },
                }),
              )
            }
            className="mt-1 text-[11px] text-blue-700 dark:text-blue-300 hover:underline text-left"
          >
            {t(lang, "toTw.calc.prefill_tariff")} ↓
          </button>
        </>
      ) : (
        <div className="text-sm text-zinc-500 dark:text-zinc-500">
          {t(lang, "toTw.calc.no_yamato_selected")}
        </div>
      )}
      {typeof stepG === "number" && !overweight && (
        <div className="text-[11px] text-zinc-500 dark:text-zinc-500">
          {t(lang, "toTw.calc.step_weight")}: {(stepG / 1000).toFixed(1)} kg
        </div>
      )}
      <a
        href={`#${packingAnchor}`}
        className="mt-2 text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:underline"
      >
        {t(lang, "toTw.calc.how_to_send")}
      </a>
    </div>
  );
}

function ResultGrid({
  result,
  lang,
}: {
  result: QuoteResponse;
  lang: Lang;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mt-2">
      <ResultCard
        title={t(lang, "toTw.calc.result.ems")}
        transit={t(lang, "toTw.calc.transit.ems")}
        price={result.yuu.ems.price_jpy ?? null}
        overweight={result.yuu.ems.overweight}
        maxWeightG={result.yuu.ems.max_weight_g}
        stepG={result.yuu.ems.step_weight_g}
        packingAnchor="packing-ems"
        lang={lang}
      />
      <ResultCard
        title={t(lang, "toTw.calc.result.air")}
        transit={t(lang, "toTw.calc.transit.air")}
        price={result.yuu.parcel_air.price_jpy ?? null}
        overweight={result.yuu.parcel_air.overweight}
        maxWeightG={result.yuu.parcel_air.max_weight_g}
        stepG={result.yuu.parcel_air.step_weight_g}
        packingAnchor="packing-yuu-air"
        lang={lang}
      />
      <ResultCard
        title={t(lang, "toTw.calc.result.sal")}
        transit={t(lang, "toTw.calc.transit.sal")}
        price={result.yuu.parcel_sal.price_jpy ?? null}
        overweight={result.yuu.parcel_sal.overweight}
        maxWeightG={result.yuu.parcel_sal.max_weight_g}
        stepG={result.yuu.parcel_sal.step_weight_g}
        /* SAL 自 2020 起暫停,指向船便卡(步驟內文會提到 SAL 現況) */
        packingAnchor="packing-yuu-sea"
        lang={lang}
      />
      <ResultCard
        title={t(lang, "toTw.calc.result.surface")}
        transit={t(lang, "toTw.calc.transit.surface")}
        price={result.yuu.parcel_surface.price_jpy ?? null}
        overweight={result.yuu.parcel_surface.overweight}
        maxWeightG={result.yuu.parcel_surface.max_weight_g}
        stepG={result.yuu.parcel_surface.step_weight_g}
        packingAnchor="packing-yuu-sea"
        lang={lang}
      />
      <ResultCard
        title={t(lang, "toTw.calc.result.yamato")}
        transit={t(lang, "toTw.calc.transit.yamato")}
        price={
          result.yamato.queried ? (result.yamato.price_jpy ?? null) : undefined
        }
        oversize={result.yamato.oversize}
        suggest={result.yamato.suggest_size_code}
        packingAnchor="packing-yamato"
        lang={lang}
      />
    </div>
  );
}
