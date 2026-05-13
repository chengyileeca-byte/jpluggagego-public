import type { Metadata } from "next";
import Link from "next/link";
import { HOME_SIZES, type HomeSizeCode } from "@/lib/home-sizes";
import { PREFECTURES } from "@/lib/japan";
import { promises as fs } from "node:fs";
import path from "node:path";
import { geocodeAddress } from "@/lib/geocode";
import {
  buildTripPlan,
  type DeliveryLeg,
  type DestinationEnd,
  type FareLookup,
  type PlanLeg,
  type SkippedLeg,
  type Stay,
  type TripPlan,
} from "@/lib/trip-plan";
import { StayForm, type StayDraft, type FinalMode } from "./_stay-form";
import { t, tf, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { LangSwitcher } from "../_lang-switcher";

const VALID_SIZES = new Set<string>(HOME_SIZES.map((s) => s.code));
const PREF_SET = new Set<string>(PREFECTURES.map((p) => p.name));

export const metadata: Metadata = {
  title: "多段行李配送計畫 · JPLuggageGo",
  description:
    "輸入旅程 D1 東京→D3 京都→D5 大阪,自動生每段行李寄送日、運費、Yamato vs ゆうパック 對比。",
  alternates: { canonical: "https://jpluggagego.com/trip" },
};

interface ParsedStayInput {
  id: string;
  label: string | null;
  address: string | null;
  resolvedAddress?: string | null;
  prefecture: string; // "" if unresolved after geocoding
  checkIn: string;
  checkOut: string;
  baggage: Array<{ size: HomeSizeCode; count: number }>;
  shipDayBefore: boolean;
}

function parseStays(raw: string | null): ParsedStayInput[] | null {
  if (!raw) return null;
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(obj)) return null;
  // Hard cap so a pathological URL doesn't stall parse / plan-build. Realistic
  // upper bound is ~14 nights × 2 moves/night ≈ 30 stays — 32 leaves headroom
  // without letting an abusive caller flood buildTripPlan() with 1000 legs.
  if (obj.length > 32) return null;
  const out: ParsedStayInput[] = [];
  for (const s of obj) {
    if (typeof s !== "object" || s === null) return null;
    const rec = s as Record<string, unknown>;
    // Prefecture is optional — if empty but address is present, we'll geocode
    // it server-side to derive the prefecture. If geocoding fails the plan
    // render stage surfaces a clear message to the user.
    const rawPref = typeof rec.prefecture === "string" ? rec.prefecture : "";
    const prefecture = PREF_SET.has(rawPref) ? rawPref : "";
    const address = typeof rec.address === "string" ? rec.address.trim() : "";
    if (!prefecture && !address) return null;
    const checkIn = typeof rec.checkIn === "string" ? rec.checkIn : "";
    const checkOut = typeof rec.checkOut === "string" ? rec.checkOut : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn)) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return null;
    if (checkIn >= checkOut) return null;
    const baggage: ParsedStayInput["baggage"] = [];
    if (Array.isArray(rec.baggage)) {
      for (const b of rec.baggage) {
        if (typeof b !== "object" || b === null) continue;
        const size = (b as Record<string, unknown>).size;
        const count = Number((b as Record<string, unknown>).count);
        if (typeof size !== "string" || !VALID_SIZES.has(size)) continue;
        if (!Number.isFinite(count) || count <= 0 || count > 20) continue;
        baggage.push({
          size: size as HomeSizeCode,
          count: Math.floor(count),
        });
      }
    }
    out.push({
      id: typeof rec.id === "string" ? rec.id : String(out.length),
      label: typeof rec.label === "string" ? rec.label : null,
      address: address || null,
      prefecture,
      checkIn,
      checkOut,
      baggage,
      shipDayBefore: rec.shipDayBefore === true,
    });
  }
  if (out.length < 2) return null;
  return out;
}

// For stays missing a prefecture but carrying an address, geocode in parallel
// and fill in the prefecture. Returns the list of stay ids that still lack a
// prefecture (UI surfaces them as a blocking error).
async function resolveMissingPrefectures(
  stays: ParsedStayInput[],
): Promise<string[]> {
  const pending = stays.filter((s) => !s.prefecture && s.address);
  if (pending.length === 0)
    return stays.filter((s) => !s.prefecture).map((s) => s.id);
  await Promise.all(
    pending.map(async (s) => {
      const g = await geocodeAddress(s.address!);
      const pref = g?.address?.prefecture;
      if (pref && PREF_SET.has(pref)) {
        s.prefecture = pref;
        s.resolvedAddress = g.display_name;
      }
    }),
  );
  return stays.filter((s) => !s.prefecture).map((s) => s.id);
}

interface AirportRow {
  airport_iata: string;
  airport_name_jp: string;
  prefecture: string;
}

async function loadAirports(): Promise<AirportRow[]> {
  const raw = await fs.readFile(
    path.join(process.cwd(), "public", "data", "yamato_airport_counters.json"),
    "utf-8",
  );
  const all = JSON.parse(raw) as AirportRow[];
  const sorted = [...all].sort((a, b) =>
    a.airport_iata < b.airport_iata ? -1 : a.airport_iata > b.airport_iata ? 1 : 0,
  );
  const byIata = new Map<string, AirportRow>();
  for (const r of sorted) {
    if (!byIata.has(r.airport_iata)) byIata.set(r.airport_iata, r);
  }
  return [...byIata.values()];
}

type FareRow = {
  from_pref: string;
  to_pref: string;
  size_code: string;
  price_jpy: number;
};

let _yamatoFaresCache: FareRow[] | null = null;
let _yuuFaresCache: FareRow[] | null = null;

async function loadFareMaps(
  fromPrefs: Set<string>,
  toPrefs: Set<string>,
): Promise<{
  yamato: Map<string, number>;
  yuu: Map<string, number>;
}> {
  if (!_yamatoFaresCache) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yamato_fares.json"),
      "utf-8",
    );
    _yamatoFaresCache = JSON.parse(raw) as FareRow[];
  }
  if (!_yuuFaresCache) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yuu_pack_fares.json"),
      "utf-8",
    );
    _yuuFaresCache = JSON.parse(raw) as FareRow[];
  }
  const matches = (r: FareRow) =>
    fromPrefs.has(r.from_pref) && toPrefs.has(r.to_pref);

  const yamato = new Map<string, number>();
  for (const r of _yamatoFaresCache) {
    if (!matches(r)) continue;
    yamato.set(
      `${r.from_pref}→${r.to_pref}→${r.size_code}`,
      Number(r.price_jpy),
    );
  }
  const yuu = new Map<string, number>();
  for (const r of _yuuFaresCache) {
    if (!matches(r)) continue;
    yuu.set(`${r.from_pref}→${r.to_pref}→${r.size_code}`, Number(r.price_jpy));
  }
  return { yamato, yuu };
}

function makeFareLookup(
  yamato: Map<string, number>,
  yuu: Map<string, number>,
): FareLookup {
  return (from, to, size) => {
    const k = `${from}→${to}→${size}`;
    return {
      yamato: yamato.get(k) ?? null,
      yuu: yuu.get(k) ?? null,
    };
  };
}

function addDaysStr(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function toStays(input: ParsedStayInput[]): Stay[] {
  return input.map((s) => ({
    id: s.id,
    prefecture: s.prefecture,
    label: s.label,
    address: s.address,
    checkIn: s.checkIn,
    checkOut: s.checkOut,
    baggage: s.baggage,
    shipDayBefore: s.shipDayBefore,
  }));
}

export default async function TripPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const lang = await getLang();
  const raw = typeof sp.stays === "string" ? sp.stays : null;
  const rawArrival = typeof sp.arrival === "string" ? sp.arrival : "";
  const rawDeparture =
    typeof sp.airport === "string"
      ? sp.airport
      : typeof sp.departure === "string"
        ? sp.departure
        : "";
  const shipToTaiwan =
    typeof sp.destination === "string" && sp.destination === "taiwan";

  const parsed = parseStays(raw);
  const airports = await loadAirports();
  const arrivalRow =
    rawArrival && airports.find((a) => a.airport_iata === rawArrival);
  const departureRow =
    !shipToTaiwan && rawDeparture
      ? airports.find((a) => a.airport_iata === rawDeparture)
      : null;
  const finalMode: FinalMode = shipToTaiwan
    ? "taiwan"
    : departureRow
      ? "airport"
      : "none";

  let unresolvedIds: string[] = [];
  if (parsed) {
    unresolvedIds = await resolveMissingPrefectures(parsed);
  }

  let plan: TripPlan | null = null;
  if (parsed && unresolvedIds.length === 0) {
    const stays = toStays(parsed);
    const fromPrefs = new Set<string>(stays.map((s) => s.prefecture));
    const toPrefs = new Set<string>(stays.slice(1).map((s) => s.prefecture));
    if (arrivalRow) fromPrefs.add(arrivalRow.prefecture);
    if (arrivalRow) toPrefs.add(stays[0].prefecture);
    if (departureRow) toPrefs.add(departureRow.prefecture);
    const maps = await loadFareMaps(fromPrefs, toPrefs);
    const fareLookup = makeFareLookup(maps.yamato, maps.yuu);
    plan = buildTripPlan({
      stays,
      startAirport: arrivalRow
        ? {
            iata: arrivalRow.airport_iata,
            prefecture: arrivalRow.prefecture,
            label: arrivalRow.airport_name_jp,
          }
        : null,
      finalAirport: departureRow
        ? {
            iata: departureRow.airport_iata,
            prefecture: departureRow.prefecture,
            label: departureRow.airport_name_jp,
          }
        : null,
      fareLookup,
    });
  }

  const initialDraft: StayDraft[] = parsed
    ? parsed.map((s) => {
        const baggage: StayDraft["baggage"] = {};
        for (const b of s.baggage) baggage[b.size] = b.count;
        return {
          id: s.id,
          label: s.label ?? "",
          address: s.address ?? "",
          prefecture: s.prefecture,
          checkIn: s.checkIn,
          checkOut: s.checkOut,
          baggage,
          shipDayBefore: s.shipDayBefore,
        };
      })
    : [];

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-zinc-500 mb-1 print:hidden">
            <Link href="/" className="hover:underline">
              JPLuggageGo
            </Link>
            {" / "}
            <span>{t(lang, "trip.title")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            {t(lang, "trip.title")}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl print:hidden">
            {t(lang, "trip.sub")}
          </p>
        </div>
        <div className="print:hidden">
          <LangSwitcher current={lang} />
        </div>
      </header>

      <div className="print:hidden">
        <StayForm
          lang={lang}
          initial={initialDraft}
          initialArrivalAirport={arrivalRow ? arrivalRow.airport_iata : ""}
          initialDepartureAirport={departureRow ? departureRow.airport_iata : ""}
          initialFinalMode={finalMode}
          airports={airports.map((a) => ({
            iata: a.airport_iata,
            labelJp: a.airport_name_jp,
          }))}
        />
      </div>

      {parsed && unresolvedIds.length > 0 && (
        <div className="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-4 text-sm text-amber-800 dark:text-amber-200 print:hidden">
          {t(lang, "trip.validation.pref_unresolved")}
        </div>
      )}

      {plan ? (
        <PlanView plan={plan} lang={lang} />
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center text-sm text-zinc-500 print:hidden">
          {t(lang, "trip.empty")}
        </div>
      )}

      {plan && shipToTaiwan && parsed && (
        <TaiwanHandoffCard
          lastStay={parsed[parsed.length - 1]}
          lang={lang}
        />
      )}
    </div>
  );
}

function PlanView({ plan, lang }: { plan: TripPlan; lang: Lang }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {t(lang, "trip.result.header")}
      </h2>
      <GanttChart plan={plan} lang={lang} />
      <ol className="space-y-3">
        {plan.legs.map((leg, idx) => (
          <li
            key={idx}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
          >
            {leg.skipped ? (
              <SkippedRow leg={leg} lang={lang} />
            ) : (
              <DeliveryRow leg={leg} lang={lang} />
            )}
          </li>
        ))}
      </ol>
      <TotalRow plan={plan} lang={lang} />
      <p className="text-[11px] text-zinc-500 print:hidden">
        {t(lang, "trip.print.hint")}
      </p>
    </section>
  );
}

function legLabel(leg: PlanLeg, lang: Lang): string {
  return tf(lang, "trip.result.leg", { n: String(leg.index + 1) });
}

function endDisplay(e: DestinationEnd): string {
  if (e.kind === "airport") {
    return e.label ? `${e.label}(${e.iata})` : e.iata;
  }
  const s = e.stay;
  return s.label ? `${s.label}(${s.prefecture})` : s.prefecture;
}

function endShortDisplay(e: DestinationEnd): string {
  if (e.kind === "airport") return e.iata;
  return e.stay.label || e.stay.prefecture;
}

function routeLabel(leg: PlanLeg): string {
  return `${endDisplay(leg.from)} → ${endDisplay(leg.to)}`;
}

function SkippedRow({ leg, lang }: { leg: SkippedLeg; lang: Lang }) {
  const key =
    leg.reason === "same_pref_same_day"
      ? "trip.result.skipped_same_city"
      : "trip.result.skipped_no_baggage";
  return (
    <div className="flex items-baseline justify-between gap-3 flex-wrap text-sm">
      <div>
        <span className="text-zinc-500 mr-2">{legLabel(leg, lang)}</span>
        <span className="text-zinc-900 dark:text-zinc-100">
          {routeLabel(leg)}
        </span>
      </div>
      <div className="text-xs text-zinc-500">{t(lang, key)}</div>
    </div>
  );
}

function fmtYen(v: number | null): string {
  if (v == null) return "—";
  return `¥${v.toLocaleString()}`;
}

function DeliveryRow({ leg, lang }: { leg: DeliveryLeg; lang: Lang }) {
  const diff =
    leg.totals.yamato != null && leg.totals.yuu != null
      ? leg.totals.yamato - leg.totals.yuu
      : null;
  const diffBadge =
    diff == null
      ? null
      : diff < 0
        ? tf(lang, "trip.result.cheaper_yamato", {
            v: Math.abs(diff).toLocaleString(),
          })
        : diff > 0
          ? tf(lang, "trip.result.cheaper_yuu", { v: diff.toLocaleString() })
          : t(lang, "trip.result.tie");
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-zinc-500">{legLabel(leg, lang)}</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">
            {routeLabel(leg)}
          </span>
          {leg.usedDayBefore && (
            <span className="inline-flex items-center rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300">
              {t(lang, "trip.result.day_before")}
            </span>
          )}
        </div>
        <div className="text-xs text-zinc-500 tabular-nums">
          {t(lang, "trip.result.ship_date")}: {leg.shipDate} →{" "}
          {t(lang, "trip.result.arrive_date")}: {leg.arriveDate}
        </div>
      </div>
      {leg.dayBeforeFallback && (
        <div className="text-[11px] text-amber-700 dark:text-amber-400">
          ⚠️ {t(lang, "trip.result.day_before_fallback")}
        </div>
      )}
      <table className="w-full text-xs">
        <thead className="text-zinc-500">
          <tr>
            <th className="text-left font-normal pb-1">
              {t(lang, "trip.result.baggage")}
            </th>
            <th className="text-right font-normal pb-1">
              {t(lang, "trip.result.yamato")}
            </th>
            <th className="text-right font-normal pb-1">
              {t(lang, "trip.result.yuu")}
            </th>
          </tr>
        </thead>
        <tbody className="text-zinc-700 dark:text-zinc-300">
          {leg.perSize.map((p) => (
            <tr key={p.size}>
              <td className="py-0.5">
                {p.size} × {p.count}
              </td>
              <td
                className={`py-0.5 text-right tabular-nums ${p.cheaper === "yamato" ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}`}
              >
                {fmtYen(p.yamato)}
              </td>
              <td
                className={`py-0.5 text-right tabular-nums ${p.cheaper === "yuu" ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}`}
              >
                {fmtYen(p.yuu)}
              </td>
            </tr>
          ))}
          <tr className="border-t border-zinc-200 dark:border-zinc-800">
            <td className="pt-1 text-zinc-500">小計</td>
            <td className="pt-1 text-right tabular-nums font-medium">
              {fmtYen(leg.totals.yamato)}
            </td>
            <td className="pt-1 text-right tabular-nums font-medium">
              {fmtYen(leg.totals.yuu)}
            </td>
          </tr>
        </tbody>
      </table>
      {diffBadge && (
        <div className="text-xs text-emerald-700 dark:text-emerald-400">
          {diffBadge}
        </div>
      )}
    </div>
  );
}

function GanttChart({ plan, lang }: { plan: TripPlan; lang: Lang }) {
  // Collect unique stays from both ends of every leg, preserving order.
  const seen = new Set<string>();
  const stays: Stay[] = [];
  const pushStay = (s: Stay) => {
    if (!seen.has(s.id)) {
      stays.push(s);
      seen.add(s.id);
    }
  };
  for (const leg of plan.legs) {
    if (leg.from.kind === "stay") pushStay(leg.from.stay);
    if (leg.to.kind === "stay") pushStay(leg.to.stay);
  }
  if (stays.length === 0) return null;

  // Date range: earliest checkIn to latest of checkOut/ship/arrive.
  const dates = stays.flatMap((s) => [s.checkIn, s.checkOut]);
  for (const leg of plan.legs) {
    if (!leg.skipped) dates.push(leg.shipDate, leg.arriveDate);
  }
  dates.sort();
  const start = dates[0];
  const end = dates[dates.length - 1];

  const days: string[] = [];
  for (let d = start; d <= end; d = addDaysStr(d, 1)) days.push(d);
  const dayCol = (d: string): number => Math.max(0, days.indexOf(d)) + 1;
  const gridCols = `repeat(${days.length}, minmax(2.25rem, 1fr))`;

  return (
    <section className="space-y-2 hidden sm:block print:block">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {t(lang, "trip.gantt.title")}
      </h3>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 overflow-x-auto">
        <div className="min-w-max space-y-1">
          <div className="flex gap-2">
            <div className="w-28 shrink-0" />
            <div
              className="grow grid gap-0.5"
              style={{ gridTemplateColumns: gridCols }}
            >
              {days.map((d) => (
                <div
                  key={d}
                  className="text-[10px] text-zinc-500 text-center tabular-nums"
                >
                  {d.slice(5)}
                </div>
              ))}
            </div>
          </div>
          {stays.map((s) => {
            const colStart = dayCol(s.checkIn);
            const colEnd = dayCol(s.checkOut) + 1;
            return (
              <div key={s.id} className="flex gap-2 items-center text-xs">
                <div className="w-28 shrink-0 text-zinc-700 dark:text-zinc-300 truncate">
                  {s.label || s.prefecture}
                </div>
                <div
                  className="grow grid gap-0.5"
                  style={{ gridTemplateColumns: gridCols }}
                >
                  <div
                    className="rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 px-1.5 py-1 truncate"
                    style={{ gridColumn: `${colStart} / ${colEnd}` }}
                    title={`${s.checkIn} → ${s.checkOut}`}
                  >
                    {t(lang, "trip.gantt.stay")} · {s.prefecture}
                  </div>
                </div>
              </div>
            );
          })}
          {plan.legs.map((leg, i) => {
            if (leg.skipped) return null;
            const colStart = dayCol(leg.shipDate);
            const colEnd = dayCol(leg.arriveDate) + 1;
            const destLabel = endShortDisplay(leg.to);
            return (
              <div
                key={`leg-${i}`}
                className="flex gap-2 items-center text-xs"
              >
                <div className="w-28 shrink-0 text-zinc-500 truncate">
                  {legLabel(leg, lang)} → {destLabel}
                </div>
                <div
                  className="grow grid gap-0.5"
                  style={{ gridTemplateColumns: gridCols }}
                >
                  <div
                    className="rounded bg-emerald-100 dark:bg-emerald-900/40 text-[10px] text-emerald-700 dark:text-emerald-300 px-1.5 py-1 truncate"
                    style={{ gridColumn: `${colStart} / ${colEnd}` }}
                    title={`${leg.shipDate} → ${leg.arriveDate}`}
                  >
                    {t(lang, "trip.gantt.ship")} → {t(lang, "trip.gantt.arrive")}
                    {leg.usedDayBefore
                      ? ` · ${t(lang, "trip.result.day_before")}`
                      : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TotalRow({ plan, lang }: { plan: TripPlan; lang: Lang }) {
  // Sum "cheaper-per-leg" for a one-line suggestion total.
  let suggested: number | null = 0;
  for (const leg of plan.legs) {
    if (leg.skipped) continue;
    if (leg.totals.yamato == null || leg.totals.yuu == null) {
      suggested = null;
      break;
    }
    suggested += Math.min(leg.totals.yamato, leg.totals.yuu);
  }
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 space-y-2">
      <div className="flex items-baseline justify-between gap-3 flex-wrap text-sm">
        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
          {t(lang, "trip.result.total")}
        </div>
        <div className="flex gap-4 text-sm tabular-nums">
          <span>
            {t(lang, "trip.result.yamato")}: {fmtYen(plan.totals.yamato)}
          </span>
          <span>
            {t(lang, "trip.result.yuu")}: {fmtYen(plan.totals.yuu)}
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            推薦 {fmtYen(suggested)}
          </span>
        </div>
      </div>
      <div className="text-xs text-zinc-500">
        {t(lang, "trip.result.total_note")}
      </div>
      {plan.hasGaps && (
        <div className="text-xs text-amber-700 dark:text-amber-400">
          {t(lang, "trip.result.gap")}
        </div>
      )}
    </div>
  );
}

// 由 HOME_SIZES 的「~Xkg」標籤抽出的 per-size 代表重量。用於「寄台灣」卡片
// 預填 /to-taiwan 估算器的 weight_kg。實際 Yamato 國際宅急便依體積/實重計價,
// 這裡只是「幫使用者填個合理預設值」,估算器頁可再微調。
const SIZE_APPROX_KG: Record<string, number> = {
  "60": 2,
  "80": 5,
  "100": 10,
  "120": 15,
  "140": 20,
  "160": 25,
};

function TaiwanHandoffCard({
  lastStay,
  lang,
}: {
  lastStay: ParsedStayInput;
  lang: Lang;
}) {
  const pieces = lastStay.baggage.filter((b) => b.count > 0);
  const fromLabel = lastStay.label || lastStay.prefecture;

  if (pieces.length === 0) {
    return (
      <section className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-5 print:hidden">
        <h2 className="text-base font-semibold text-rose-900 dark:text-rose-100">
          {t(lang, "trip.result.taiwan_header")}
        </h2>
        <p className="mt-2 text-sm text-rose-800 dark:text-rose-200">
          {t(lang, "trip.result.taiwan_empty")}
        </p>
        <Link
          href="/to-taiwan#calc"
          className="mt-3 inline-block rounded-lg bg-rose-900 dark:bg-white text-white dark:text-rose-900 px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          {t(lang, "trip.result.taiwan_cta")}
        </Link>
      </section>
    );
  }

  // 最大尺寸(以 code 的數值比較 — "60" < "160")代表「最大的一件」,
  // 估算器單次只能算一件,用最大件作預填最保險。
  const maxPiece = pieces.reduce((a, b) =>
    Number(a.size) >= Number(b.size) ? a : b,
  );
  const maxKg = SIZE_APPROX_KG[maxPiece.size] ?? 10;
  const totalKg = pieces.reduce(
    (sum, p) => sum + (SIZE_APPROX_KG[p.size] ?? 0) * p.count,
    0,
  );
  const hasMultiple =
    pieces.length > 1 || pieces.some((p) => p.count > 1);

  const href = `/to-taiwan?weight_kg=${maxKg}&yamato_size=${maxPiece.size}#calc`;

  return (
    <section className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-5 print:hidden space-y-3">
      <div>
        <h2 className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
          {t(lang, "trip.result.taiwan_header")}
        </h2>
        <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-200">
          {tf(lang, "trip.result.taiwan_from", { label: fromLabel })}
        </p>
      </div>
      <ul className="space-y-1 text-sm text-emerald-900 dark:text-emerald-100">
        {pieces.map((p) => (
          <li key={p.size} className="tabular-nums">
            {tf(lang, "trip.result.taiwan_piece", {
              size: p.size,
              n: String(p.count),
              kg: String(SIZE_APPROX_KG[p.size] ?? "?"),
            })}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-emerald-800 dark:text-emerald-200">
        <span>
          {t(lang, "trip.result.taiwan_total")}:{" "}
          <strong className="tabular-nums">~{totalKg} kg</strong>
        </span>
        <span>
          {t(lang, "trip.result.taiwan_suggest")}:{" "}
          <strong>
            {maxPiece.size} サイズ (~{maxKg} kg)
          </strong>
        </span>
      </div>
      {hasMultiple && (
        <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
          {t(lang, "trip.result.taiwan_hint_multi")}
        </p>
      )}
      <Link
        href={href}
        className="inline-block rounded-lg bg-emerald-700 dark:bg-emerald-500 text-white px-4 py-2 text-sm font-medium hover:opacity-90"
      >
        {t(lang, "trip.result.taiwan_cta")}
      </Link>
    </section>
  );
}
