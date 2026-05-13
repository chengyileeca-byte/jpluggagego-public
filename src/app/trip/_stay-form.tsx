"use client";

import { useState, useMemo, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PREFECTURES } from "@/lib/japan";
import { HOME_SIZES, type HomeSizeCode } from "@/lib/home-sizes";
import { matchHotelBrand } from "@/lib/hotel-policies";
import { t, tf, type Lang } from "@/lib/i18n";
import { HotelPicker, type HotelSuggestion } from "@/components/hotel-picker";
import { StayNearby } from "./_stay-nearby";

// Shape stored in the URL. Server re-parses and validates; this is the
// client-side draft.
export interface StayDraft {
  id: string;
  label: string;
  address: string;
  prefecture: string;
  checkIn: string;
  checkOut: string;
  baggage: Partial<Record<HomeSizeCode, number>>;
  shipDayBefore: boolean;
  /** Set when the hotel was picked from the Rakuten autocomplete. Powers the
   * "附近宅急便/郵便局" panel — absent when user typed a free-form label. */
  lat?: number;
  lon?: number;
}

interface AirportOption {
  iata: string;
  labelJp: string;
}

// `seq` is supplied by the caller from a monotonic counter. IDs must be
// deterministic across SSR and client hydration — using Date.now() here caused
// <datalist> id mismatches when useState initializer re-ran on the client.
function newStay(seq: number): StayDraft {
  return {
    id: `s-${seq}`,
    label: "",
    address: "",
    prefecture: "",
    checkIn: "",
    checkOut: "",
    baggage: {},
    shipDayBefore: false,
  };
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function HotelBrandBadge({ name, lang }: { name: string; lang: Lang }) {
  const match = useMemo(() => matchHotelBrand(name), [name]);
  if (!name.trim()) return null;
  if (match && match.canSend === "yes") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300">
        <span className="font-medium">{match.name}</span>
        <span>·</span>
        <span>{t(lang, "trip.stay.brand_ok")}</span>
      </span>
    );
  }
  if (match && match.canSend === "case-by-case") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-300">
        <span className="font-medium">{match.name}</span>
        <span>·</span>
        <span>{t(lang, "trip.stay.brand_check")}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-500">
      {t(lang, "trip.stay.brand_unknown")}
    </span>
  );
}

function ShipDayBeforeTip({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        aria-label={t(lang, "trip.stay.ship_day_before_tip_aria")}
        aria-expanded={open}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-zinc-400 dark:border-zinc-600 text-[10px] font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 leading-none"
      >
        ?
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute z-20 bottom-full left-0 mb-1.5 w-64 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg p-3 text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1.5"
        >
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
            {t(lang, "trip.stay.ship_day_before_tip_title")}
          </div>
          <ul className="space-y-1">
            <li>{t(lang, "trip.stay.ship_day_before_tip_chain")}</li>
            <li>{t(lang, "trip.stay.ship_day_before_tip_ryokan")}</li>
            <li>{t(lang, "trip.stay.ship_day_before_tip_airbnb")}</li>
          </ul>
        </div>
      )}
    </span>
  );
}

export type FinalMode = "none" | "airport" | "taiwan";

export function StayForm({
  lang,
  initial,
  initialArrivalAirport,
  initialDepartureAirport,
  initialFinalMode,
  airports,
}: {
  lang: Lang;
  initial: StayDraft[];
  initialArrivalAirport: string;
  initialDepartureAirport: string;
  initialFinalMode: FinalMode;
  airports: AirportOption[];
}) {
  const router = useRouter();
  const [stays, setStays] = useState<StayDraft[]>(() => {
    if (initial.length >= 2) return initial;
    const today = new Date();
    const d3 = new Date(today);
    d3.setDate(d3.getDate() + 3);
    const d5 = new Date(today);
    d5.setDate(d5.getDate() + 5);
    return [
      { ...newStay(0), checkIn: ymd(today), checkOut: ymd(d3) },
      { ...newStay(1), checkIn: ymd(d3), checkOut: ymd(d5) },
    ];
  });
  // Monotonic counter for stay IDs, seeded from initial stays length.
  // React 19 forbids touching refs inside render (incl. useState initializer),
  // so the seed is read from `stays` after it's bound above.
  const idSeqRef = useRef(stays.length);
  const [arrivalAirport, setArrivalAirport] = useState(initialArrivalAirport);
  const [departureAirport, setDepartureAirport] = useState(
    initialDepartureAirport,
  );
  const [finalMode, setFinalMode] = useState<FinalMode>(initialFinalMode);
  const [error, setError] = useState<string | null>(null);

  // Prefecture is optional IF address is provided — server geocodes the
  // address to derive it. Require at least one of pref/address per stay.
  const canSubmit = useMemo(() => {
    if (stays.length < 2) return false;
    return stays.every(
      (s) =>
        (s.prefecture || s.address.trim()) &&
        s.checkIn &&
        s.checkOut &&
        s.checkIn < s.checkOut,
    );
  }, [stays]);

  function update(i: number, patch: Partial<StayDraft>) {
    setStays((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }

  function setBaggage(i: number, size: HomeSizeCode, count: number) {
    setStays((prev) =>
      prev.map((s, j) => {
        if (j !== i) return s;
        const b = { ...s.baggage };
        if (count <= 0) delete b[size];
        else b[size] = count;
        return { ...s, baggage: b };
      }),
    );
  }

  function addStay() {
    setStays((prev) => [...prev, newStay(idSeqRef.current++)]);
  }

  function removeStay(i: number) {
    setStays((prev) =>
      prev.length <= 2 ? prev : prev.filter((_, j) => j !== i),
    );
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (stays.length < 2) {
      setError(t(lang, "trip.validation.min_stays"));
      return;
    }
    for (const s of stays) {
      if (s.checkIn >= s.checkOut) {
        setError(t(lang, "trip.validation.invalid_date"));
        return;
      }
      if (!s.prefecture && !s.address.trim()) {
        setError(t(lang, "trip.validation.stay_missing_loc"));
        return;
      }
    }
    setError(null);
    const payload = stays.map((s) => ({
      id: s.id,
      label: s.label || undefined,
      address: s.address.trim() || undefined,
      prefecture: s.prefecture || undefined,
      checkIn: s.checkIn,
      checkOut: s.checkOut,
      baggage: Object.entries(s.baggage)
        .filter(([, c]) => (c ?? 0) > 0)
        .map(([size, count]) => ({ size, count })),
      shipDayBefore: s.shipDayBefore || undefined,
    }));
    const params = new URLSearchParams();
    params.set("stays", JSON.stringify(payload));
    if (arrivalAirport) params.set("arrival", arrivalAirport);
    if (finalMode === "airport" && departureAirport) {
      params.set("departure", departureAirport);
    } else if (finalMode === "taiwan") {
      params.set("destination", "taiwan");
    }
    router.push(`/trip?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
        <span>{t(lang, "trip.arrival.label")}</span>
        <select
          value={arrivalAirport}
          onChange={(e) => setArrivalAirport(e.target.value)}
          className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
        >
          <option value="">{t(lang, "trip.arrival.placeholder")}</option>
          {airports.map((a) => (
            <option key={a.iata} value={a.iata}>
              {a.iata} · {a.labelJp}
            </option>
          ))}
        </select>
      </label>

      <ol className="space-y-4">
        {stays.map((s, i) => (
          <li
            key={s.id}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <span>{tf(lang, "trip.stay.header", { n: String(i + 1) })}</span>
                <span className="text-[11px] font-normal text-zinc-500">
                  {t(lang, "trip.stay.here_label")}
                </span>
              </div>
              {stays.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeStay(i)}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  {t(lang, "trip.stay.remove")}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <span>{t(lang, "trip.stay.checkin")}</span>
                <input
                  type="date"
                  value={s.checkIn}
                  onChange={(e) => update(i, { checkIn: e.target.value })}
                  className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
                  required
                />
              </label>
              <label className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <span>{t(lang, "trip.stay.checkout")}</span>
                <input
                  type="date"
                  value={s.checkOut}
                  onChange={(e) => update(i, { checkOut: e.target.value })}
                  className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
                  required
                />
              </label>
              <label className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <span>{t(lang, "trip.stay.prefecture")}</span>
                <select
                  value={s.prefecture}
                  onChange={(e) => update(i, { prefecture: e.target.value })}
                  className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">
                    {t(lang, "trip.stay.pref_placeholder")}
                  </option>
                  {PREFECTURES.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              {/* Nearby toggle contains a <button>, so it can't live inside
                  <label> — clicking the button would steal focus to the input.
                  Wrap label + picker + button in a plain div instead. */}
              <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <label className="block space-y-1">
                  <span>{t(lang, "trip.stay.label")}</span>
                  <HotelPicker
                    id={`stay-label-${s.id}`}
                    value={s.label}
                    onChange={(v) =>
                      update(i, { label: v, lat: undefined, lon: undefined })
                    }
                    onPick={(h: HotelSuggestion) => {
                      const addr = [h.address1, h.address2]
                        .filter(Boolean)
                        .join("");
                      const patch: Partial<StayDraft> = {};
                      if (addr) patch.address = addr;
                      if (h.prefecture) patch.prefecture = h.prefecture;
                      if (h.lat != null) patch.lat = h.lat;
                      if (h.lon != null) patch.lon = h.lon;
                      if (Object.keys(patch).length) update(i, patch);
                    }}
                    prefecture={s.prefecture || undefined}
                    placeholder="APA 新宿 / Airbnb 祇園…"
                    className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
                  />
                </label>
                <HotelBrandBadge name={s.label} lang={lang} />
                {s.lat != null && s.lon != null && (
                  <StayNearby lat={s.lat} lon={s.lon} lang={lang} />
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                {t(lang, "trip.stay.baggage")}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {HOME_SIZES.map((sz) => {
                  const v = s.baggage[sz.code] ?? 0;
                  return (
                    <div
                      key={sz.code}
                      className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="w-14 shrink-0 tabular-nums">
                        {sz.code}
                      </span>
                      <div className="flex items-stretch rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setBaggage(i, sz.code, v - 1)}
                          disabled={v <= 0}
                          aria-label="−"
                          className="px-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent select-none leading-none"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={20}
                          value={v}
                          onChange={(e) =>
                            setBaggage(
                              i,
                              sz.code,
                              Math.max(
                                0,
                                Math.min(20, Number(e.target.value) || 0),
                              ),
                            )
                          }
                          className="no-spinner w-9 bg-transparent px-0 py-1 text-center tabular-nums outline-none border-x border-zinc-200 dark:border-zinc-800"
                        />
                        <button
                          type="button"
                          onClick={() => setBaggage(i, sz.code, v + 1)}
                          disabled={v >= 20}
                          aria-label="+"
                          className="px-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent select-none leading-none"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-zinc-500">
                        {t(lang, "trip.stay.baggage_count")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <label className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 block">
              <span>{t(lang, "trip.stay.address")}</span>
              <input
                type="text"
                value={s.address}
                onChange={(e) => update(i, { address: e.target.value })}
                placeholder={t(lang, "trip.stay.address_placeholder")}
                className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </label>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.shipDayBefore}
                    onChange={(e) =>
                      update(i, { shipDayBefore: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                  />
                  <span>{t(lang, "trip.stay.ship_day_before")}</span>
                </label>
                <ShipDayBeforeTip lang={lang} />
              </div>
              <p className="text-[11px] text-zinc-500 leading-snug pl-6">
                {t(lang, "trip.stay.ship_day_before_hint")}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div>
        <button
          type="button"
          onClick={addStay}
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {t(lang, "trip.stay.add")}
        </button>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
          {t(lang, "trip.final.label")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {(["none", "airport", "taiwan"] as const).map((m) => {
            const labelKey =
              m === "none"
                ? "trip.final.none"
                : m === "airport"
                  ? "trip.final.airport"
                  : "trip.final.taiwan";
            const active = finalMode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setFinalMode(m)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {t(lang, labelKey)}
              </button>
            );
          })}
        </div>
        {finalMode === "airport" && (
          <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
            <span>{t(lang, "trip.departure.label")}</span>
            <select
              value={departureAirport}
              onChange={(e) => setDepartureAirport(e.target.value)}
              className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option value="">{t(lang, "trip.departure.placeholder")}</option>
              {airports.map((a) => (
                <option key={a.iata} value={a.iata}>
                  {a.iata} · {a.labelJp}
                </option>
              ))}
            </select>
          </label>
        )}
        {finalMode === "taiwan" && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500 leading-snug max-w-md">
            {t(lang, "trip.final.taiwan_hint")}
          </p>
        )}
      </fieldset>

      {error && (
        <div className="rounded border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-medium disabled:opacity-40"
      >
        {t(lang, "trip.submit")}
      </button>
    </form>
  );
}
