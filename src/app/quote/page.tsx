import type { Metadata } from "next";
import Link from "next/link";
import { PREFECTURES, findPrefectureIn } from "@/lib/japan";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  YUU_PACK_AIRPORT_COUNTERS,
  YUU_PACK_AIRPORT_LIST_URL,
} from "@/lib/yuu-pack-airport-counters";
import {
  yamatoAirportHours,
  YAMATO_NAVI_DIAL,
} from "@/lib/yamato-airport-hours";
import {
  estimateTransit,
  addDays,
  formatArrival,
  isValidIsoDate,
} from "@/lib/transit-days";
import { PAYMENTS } from "@/lib/payment-methods";
import {
  airporterCoverage,
  AIRPORTER_URL,
  AIRPORTER_PRICE_NOTE_KEY,
  AIRPORTER_SAMEDAY_WINDOW_KEY,
} from "@/lib/airporter";
import {
  HOTEL_CHAIN_POLICIES,
  HOTEL_POLICY_GENERAL_NOTE_KEY,
  HOTEL_POLICY_DISCLAIMER_KEY,
  type Capability,
} from "@/lib/hotel-policies";
import {
  listChainAggregates,
  listUserReports,
  type ReportField,
} from "@/lib/hotel-reports";
import { getSession } from "@/lib/session";
import { ShareButtons } from "./_share-buttons";
import {
  HotelReportForm,
  type HotelReportFormExistingEntry,
} from "./_hotel-report-form";
import { t, tf } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { LangSwitcher } from "../_lang-switcher";
import { resolveLocation } from "@/lib/resolve-location";
import { fetchBadges } from "@/lib/location-reports";
import { LocationReportPanel } from "@/components/location-report-panel";
import {
  detectRemoteIsland,
  type RemoteIslandAdvisory,
} from "@/lib/remote-islands";
import { checkRouteWeather } from "@/lib/weather-advisory";
import type {
  NearestYamatoBranch,
  NearestYuuPostOffice,
} from "@/lib/nearest-branch";
import type { GeocodeResult } from "@/lib/geocode";
import { YamatoList, YuuList } from "./_branch-lists";
import { HotelPickerField } from "@/components/hotel-picker";
import { PrefillQuiz } from "./_prefill-quiz";

function capabilityBadge(c: Capability): { sym: string; cls: string } {
  if (c === "yes")
    return {
      sym: "✓",
      cls: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40",
    };
  if (c === "case-by-case")
    return {
      sym: "△",
      cls: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40",
    };
  return {
    sym: "?",
    cls: "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
  };
}

// UGC 回報小 pill。在 capability badge 下方顯示其他旅客票數。
// 0 筆就不顯示(避免占位)。
function ReportCountPill({
  counts,
}: {
  counts: { yes: number; "case-by-case": number; check: number } | undefined;
}) {
  const total =
    (counts?.yes ?? 0) + (counts?.["case-by-case"] ?? 0) + (counts?.check ?? 0);
  if (!counts || total === 0) return null;
  return (
    <div className="mt-1 text-[9px] text-zinc-500 tabular-nums leading-tight">
      <span className="text-emerald-700 dark:text-emerald-400">{counts.yes}</span>
      <span className="opacity-40">·</span>
      <span className="text-amber-700 dark:text-amber-400">{counts["case-by-case"]}</span>
      <span className="opacity-40">·</span>
      <span className="text-zinc-500">{counts.check}</span>
    </div>
  );
}

export const dynamic = "force-dynamic";

type QuoteSearchParams = {
  from?: string;
  airport?: string;
  to_pref?: string;
  size?: string;
  ship_date?: string;
  pieces?: string;
};

function parseFromLabelForShare(raw: string | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith("airport:")) return raw.slice("airport:".length);
  if (raw.startsWith("pref:")) return raw.slice("pref:".length);
  return null;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<QuoteSearchParams>;
}): Promise<Metadata> {
  const [sp, lang] = await Promise.all([searchParams, getLang()]);
  const rawFrom = sp.from ?? (sp.airport ? `airport:${sp.airport}` : undefined);
  const fromLabel = parseFromLabelForShare(rawFrom);
  const toPref = sp.to_pref;
  const size = sp.size;

  const ogQs = new URLSearchParams();
  if (rawFrom) ogQs.set("from", rawFrom);
  if (toPref) ogQs.set("to_pref", toPref);
  if (size) ogQs.set("size", size);
  const ogUrl = `/api/og/quote${ogQs.toString() ? `?${ogQs.toString()}` : ""}`;

  const hasRoute = fromLabel && toPref;
  const baseTitle = t(lang, "quote.title");
  const title = hasRoute
    ? `${fromLabel} → ${toPref}${size ? ` · ${size}サイズ` : ""} · ${baseTitle}`
    : baseTitle;
  const genericDesc =
    lang === "ja"
      ? "発送元・届け先・サイズを選ぶだけで、ヤマト運輸 vs 郵便局ゆうパックの料金と空港カウンターを比較。"
      : lang === "en"
        ? "Pick origin, destination, and size — instantly compare Yamato vs Japan Post fares and see which airport counters accept drop-off."
        : "選擇出發機場或都道府県、送達地、行李尺寸,立刻比較 Yamato 黒猫宅急便 vs 郵便局 ゆうパック 料金,並列出機場可發送櫃台。";
  const description = hasRoute
    ? lang === "ja"
      ? `${fromLabel} → ${toPref} ルートのヤマト vs 郵便局ゆうパック 即時料金 · JPLuggageGo`
      : lang === "en"
        ? `${fromLabel} → ${toPref} · live Yamato vs Japan Post fares · JPLuggageGo`
        : `${fromLabel} → ${toPref} 路線 Yamato 黒猫宅急便 vs 郵便局 ゆうパック 即時料金比較 · JPLuggageGo`
    : genericDesc;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

const SIZES = [
  { code: "60", label: "60サイズ (~2kg)" },
  { code: "80", label: "80サイズ (~5kg · 後背包)" },
  { code: "100", label: "100サイズ (~10kg · 21吋手提)" },
  { code: "120", label: "120サイズ (~15kg · 24吋)" },
  { code: "140", label: "140サイズ (~20kg · 26吋)" },
  { code: "160", label: "160サイズ (~25kg · 29吋)" },
  { code: "180", label: "180サイズ (Yamato のみ · 30吋特大)" },
  { code: "200", label: "200サイズ (Yamato のみ · 上限 200cm/30kg)" },
] as const;

// ゆうパック 上限 170(3辺合計);180/200 不適用。
// 注意:60-160 是 size_code,170 是 ゆうパック 獨有大尺寸(對應 Yamato 沒有同層級),
// 180/200 是 Yamato 獨有(2021-10 從 ヤマト便 改入宅急便)。
const YUU_PACK_MAX_NUMERIC_SIZE = 170;

interface CounterRow {
  airport_iata: string;
  airport_name_jp: string;
  terminal: string | null;
  prefecture: string;
  service_type: string;
  floor: string | null;
  detail_url: string | null;
}

interface AirportOption {
  iata: string;
  prefecture: string;
  display: string;
}

function stripTerminal(nameJp: string): string {
  return nameJp.replace(/第[0-9０-９].*$/, "").replace(/（.*）$/, "");
}

type FromMode = "airport" | "pref" | "address";

type Origin =
  | { kind: "airport"; iata: string; prefecture: string; display: string }
  | { kind: "pref"; prefecture: string; display: string }
  | {
      kind: "address";
      address: string;
      prefecture: string;
      display: string;
      geo: GeocodeResult;
      yamato: NearestYamatoBranch[];
      yuu: NearestYuuPostOffice[];
    };

type Destination =
  | { kind: "pref"; prefecture: string }
  | {
      kind: "address";
      address: string;
      prefecture: string;
      geo: GeocodeResult;
      yamato: NearestYamatoBranch[];
      yuu: NearestYuuPostOffice[];
    };

function parseFromPrefOrAirport(
  raw: string | undefined,
  airportMap: Map<string, AirportOption>,
): Origin | undefined {
  if (!raw) return undefined;
  if (raw.startsWith("airport:")) {
    const iata = raw.slice("airport:".length);
    const a = airportMap.get(iata);
    if (!a) return undefined;
    return {
      kind: "airport",
      iata: a.iata,
      prefecture: a.prefecture,
      display: a.display,
    };
  }
  if (raw.startsWith("pref:")) {
    const name = raw.slice("pref:".length);
    const p = PREFECTURES.find((x) => x.name === name);
    if (!p) return undefined;
    return { kind: "pref", prefecture: p.name, display: p.name };
  }
  return undefined;
}

// Given raw URL params, decide which from-mode tab should be active. Explicit
// `from_mode` wins; otherwise we infer from the `from` prefix (back-compat
// for links shared before the address mode existed).
function resolveFromMode(
  explicit: string | undefined,
  rawFrom: string | undefined,
  hasFromAddress: boolean,
): FromMode {
  if (explicit === "airport" || explicit === "pref" || explicit === "address")
    return explicit;
  if (hasFromAddress) return "address";
  if (rawFrom?.startsWith("pref:")) return "pref";
  return "airport";
}

// Derive prefecture from geocoder output without relying on nearest-branch.
// Rural addresses (e.g. 群馬県沼田市薄根町) can geocode cleanly but have zero
// Yamato branches within 5km — we still want the fare lookup to work, so we
// read the pref off the display_name / address fields instead.
function prefectureFromGeo(geo: GeocodeResult): string | null {
  return (
    findPrefectureIn(geo.address?.state) ??
    findPrefectureIn(geo.address?.province) ??
    findPrefectureIn(geo.address?.prefecture) ??
    findPrefectureIn(geo.display_name) ??
    null
  );
}

// Address → address-origin. Returns null only if geocoding fails or the
// geocoder gives us no usable prefecture. Empty nearest-branch lists are fine;
// the price card / fare row can still render from the prefecture alone.
async function resolveAddressOrigin(
  address: string,
  radiusM: number,
): Promise<Extract<Origin, { kind: "address" }> | null> {
  const r = await resolveLocation(address, radiusM);
  if (!r) return null;
  const pref = prefectureFromGeo(r.geo) ?? r.yamato[0]?.prefecture ?? null;
  if (!pref) return null;
  return {
    kind: "address",
    address,
    prefecture: pref,
    display: r.geo.display_name,
    geo: r.geo,
    yamato: r.yamato,
    yuu: r.yuu,
  };
}

async function resolveAddressDestination(
  address: string,
  radiusM: number,
): Promise<Extract<Destination, { kind: "address" }> | null> {
  const r = await resolveLocation(address, radiusM);
  if (!r) return null;
  const pref = prefectureFromGeo(r.geo) ?? r.yamato[0]?.prefecture ?? null;
  if (!pref) return null;
  return {
    kind: "address",
    address,
    prefecture: pref,
    geo: r.geo,
    yamato: r.yamato,
    yuu: r.yuu,
  };
}

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    from_mode?: string;
    from_address?: string;
    airport?: string; // legacy
    to_pref?: string;
    to_address?: string;
    size?: string;
    ship_date?: string;
    pieces?: string;
  }>;
}) {
  const sp = await searchParams;
  const [lang, session, chainAggregates] = await Promise.all([
    getLang(),
    getSession(),
    listChainAggregates(),
  ]);
  const userReports = session ? await listUserReports(session.userId) : null;

  const counters = (
    JSON.parse(
      await fs.readFile(
        path.join(
          process.cwd(),
          "public",
          "data",
          "yamato_airport_counters.json",
        ),
        "utf-8",
      ),
    ) as CounterRow[]
  ).sort((a, b) => {
    if (a.airport_iata !== b.airport_iata)
      return a.airport_iata < b.airport_iata ? -1 : 1;
    return a.airport_name_jp < b.airport_name_jp ? -1 : 1;
  });

  const airportMap = new Map<string, AirportOption>();
  for (const c of counters) {
    if (!airportMap.has(c.airport_iata)) {
      airportMap.set(c.airport_iata, {
        iata: c.airport_iata,
        prefecture: c.prefecture,
        display: `${c.airport_iata} · ${stripTerminal(c.airport_name_jp)}`,
      });
    }
  }
  const airports = [...airportMap.values()];

  // Accept new `from=airport:NRT|pref:東京都` shape, fall back to legacy `airport=NRT`.
  const rawFrom =
    sp.from ?? (sp.airport ? `airport:${sp.airport}` : undefined);
  const fromAddress = (sp.from_address ?? "").trim();
  const toAddress = (sp.to_address ?? "").trim();
  const fromMode: FromMode = resolveFromMode(
    sp.from_mode,
    rawFrom,
    fromAddress.length > 0,
  );

  const toPrefRaw =
    sp.to_pref && PREFECTURES.find((x) => x.name === sp.to_pref)
      ? sp.to_pref
      : "";

  const DEFAULT_RADIUS_M = 5000;

  // Resolve origin + destination in parallel. For address mode we also fetch
  // the 5 nearest Yamato / 郵便局 (used both as a result section and to
  // derive the prefecture for fare lookup). The destination shape is flat:
  // try address first, then fall back to the pref dropdown if geocoding
  // failed or address was left blank.
  const [origin, destination] = await Promise.all([
    (async (): Promise<Origin | undefined> => {
      if (fromMode === "address" && fromAddress) {
        return (
          (await resolveAddressOrigin(fromAddress, DEFAULT_RADIUS_M)) ??
          undefined
        );
      }
      // Only accept the legacy `from` param when its prefix matches the
      // active mode — otherwise clicking the "機場" tab with a lingering
      // `pref:…` in the URL would silently keep the pref origin.
      const parsed = parseFromPrefOrAirport(rawFrom, airportMap);
      if (parsed && parsed.kind === fromMode) return parsed;
      return undefined;
    })(),
    (async (): Promise<Destination | undefined> => {
      if (toAddress) {
        const a = await resolveAddressDestination(
          toAddress,
          DEFAULT_RADIUS_M,
        );
        if (a) return a;
      }
      if (toPrefRaw) return { kind: "pref", prefecture: toPrefRaw };
      return undefined;
    })(),
  ]);
  // User supplied an address, but geocoding to a real Yamato-covered point
  // failed — we fell through to pref (if any) or undefined. Derive from the
  // final shape instead of an in-async mutation (which the new React lint
  // rule rejects).
  const toAddressFailed = !!toAddress && destination?.kind !== "address";

  // destPref drives every downstream "to" computation: fare query, transit
  // estimate, Airporter coverage. For address destinations it comes from the
  // nearest Yamato branch; for pref destinations it's the dropdown value.
  const destPref = destination?.prefecture ?? null;

  // 離島警示:只在 address 模式偵測(pref-only 無法精準分辨本島/離島)。
  const remoteIsland: RemoteIslandAdvisory | null =
    destination?.kind === "address"
      ? detectRemoteIsland(
          destination.geo.display_name,
          destination.geo.address?.city,
        )
      : null;

  // 氣象警報(#60):出發 + 目的地兩側 JMA feed 合併。
  // 只在 showResult 時呼叫(form 未填完沒意義),避免首頁進來就打 JMA。
  const weather =
    origin && destPref
      ? await checkRouteWeather(origin.prefecture, destPref)
      : null;

  const { size } = sp;
  const shipDate =
    sp.ship_date && isValidIsoDate(sp.ship_date) ? sp.ship_date : undefined;
  const piecesParsed = Number.parseInt(sp.pieces ?? "1", 10);
  const pieces =
    Number.isFinite(piecesParsed) && piecesParsed >= 1 && piecesParsed <= 5
      ? piecesParsed
      : 1;
  const YUU_MULTI_DISCOUNT = 60; // ¥/件, 同一宛先 2+ 件同時差出

  let yamatoPrice: number | null = null;
  let yamatoScrapedAt: string | null = null;
  let yuuPackPrice: number | null = null;
  let yuuPackScrapedAt: string | null = null;
  let sendCounters: CounterRow[] = [];
  let yamatoBranchCount: number | null = null;
  let yamatoBranchSamples: {
    branch_code: string;
    name_jp: string;
    hours_weekday: string | null;
  }[] = [];
  if (origin && destPref && size) {
    const fromPref = origin.prefecture;

    type FareRow = {
      from_pref: string;
      to_pref: string;
      size_code: string;
      price_jpy: number;
      scraped_at: string;
    };
    const yamatoRaw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yamato_fares.json"),
      "utf-8",
    );
    const yuuRaw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yuu_pack_fares.json"),
      "utf-8",
    );
    const yamatoFares = JSON.parse(yamatoRaw) as FareRow[];
    const yuuFares = JSON.parse(yuuRaw) as FareRow[];
    const matchFare = (rows: FareRow[]) =>
      rows.find(
        (r) =>
          r.from_pref === fromPref &&
          r.to_pref === destPref &&
          r.size_code === size,
      ) ?? null;
    const yamato = matchFare(yamatoFares);
    const yuupack = matchFare(yuuFares);
    yamatoPrice = yamato?.price_jpy ?? null;
    yamatoScrapedAt = yamato?.scraped_at ?? null;
    yuuPackPrice = yuupack?.price_jpy ?? null;
    yuuPackScrapedAt = yuupack?.scraped_at ?? null;

    if (origin.kind === "airport") {
      sendCounters = counters.filter(
        (c) =>
          c.airport_iata === origin.iata &&
          (c.service_type === "発送" || c.service_type === "受取・発送"),
      );
    }

    if (origin.kind === "pref") {
      type BranchRow = {
        branch_code: string;
        name_jp: string;
        prefecture: string;
        hours_weekday: string | null;
      };
      const file = path.join(
        process.cwd(),
        "public",
        "data",
        "by-pref",
        encodeURIComponent(origin.prefecture),
        "yamato_branches.json",
      );
      let prefBranches: BranchRow[] = [];
      try {
        prefBranches = JSON.parse(
          await fs.readFile(file, "utf-8"),
        ) as BranchRow[];
      } catch {
        prefBranches = [];
      }
      yamatoBranchCount = prefBranches.length;
      yamatoBranchSamples = prefBranches
        .filter((b) => b.hours_weekday !== null)
        .sort((a, b) => (a.name_jp < b.name_jp ? -1 : a.name_jp > b.name_jp ? 1 : 0))
        .slice(0, 3)
        .map((b) => ({
          branch_code: b.branch_code,
          name_jp: b.name_jp,
          hours_weekday: b.hours_weekday,
        }));
    }
  }

  const yuuPackCounters =
    origin?.kind === "airport"
      ? YUU_PACK_AIRPORT_COUNTERS.filter((c) => c.airport_iata === origin.iata)
      : [];

  // entity_id 規則(Sprint 8 location_reports polymorphic):
  //   yamato_branch  → branch_code(DB-backed,auto-apply 寫主表)
  //   yamato_airport / yuu_pack_airport → "{IATA}:{service_or_terminal}:{name}"
  //     (curated TS 資料無 DB PK,auto-apply 不觸發,只標 applied 留 audit)
  const yamatoAirportEntityId = (
    iata: string,
    service: string,
    name: string,
  ) => `${iata}:${service}:${name}`;
  const yuuAirportEntityId = (iata: string, name: string) => `${iata}:${name}`;

  // 批次抓 badges(避免每張卡單獨 N+1 查),只 fetch 真會 render 的 entity ids。
  const yamatoBranchIds = yamatoBranchSamples.map((b) => b.branch_code);
  const yamatoAirportIds = sendCounters.map((c) =>
    yamatoAirportEntityId(
      origin?.kind === "airport" ? origin.iata : "",
      c.service_type,
      c.airport_name_jp,
    ),
  );
  const yuuAirportIds = yuuPackCounters.map((c) =>
    yuuAirportEntityId(c.airport_iata, c.counter_name_jp),
  );

  const [yamatoBranchBadges, yamatoAirportBadges, yuuAirportBadges] =
    await Promise.all([
      yamatoBranchIds.length > 0
        ? fetchBadges("yamato_branch", yamatoBranchIds)
        : Promise.resolve(new Map()),
      yamatoAirportIds.length > 0
        ? fetchBadges("yamato_airport", yamatoAirportIds)
        : Promise.resolve(new Map()),
      yuuAirportIds.length > 0
        ? fetchBadges("yuu_pack_airport", yuuAirportIds)
        : Promise.resolve(new Map()),
    ]);

  const showResult = !!(origin && destPref && size);

  // 180/200 是 Yamato 獨有(2021-10 從 ヤマト便 改入宅急便),ゆうパック 上限 170 不收
  const yuuPackOversize =
    size != null && Number(size) > YUU_PACK_MAX_NUMERIC_SIZE;

  // 空港ゆうパック:from=airport 時,ゆうパック 加 +¥800 機場手續費
  // (郵便局持込・往復利用で最大 -¥360 まで割引可能)
  // Source: post.japanpost.jp/service/you_pack/airpo/
  const AIRPORT_YUU_PACK_SURCHARGE = 800;
  const fromAirport = origin?.kind === "airport";
  const yuuAirportSurcharge =
    fromAirport && yuuPackPrice != null ? AIRPORT_YUU_PACK_SURCHARGE : 0;

  const yuuMultiDiscountPer = pieces >= 2 ? YUU_MULTI_DISCOUNT : 0;
  const yamatoTotal = yamatoPrice != null ? yamatoPrice * pieces : null;
  const yuuTotal =
    yuuPackPrice != null
      ? (yuuPackPrice + yuuAirportSurcharge - yuuMultiDiscountPer) * pieces
      : null;
  const diff =
    yamatoTotal != null && yuuTotal != null ? yamatoTotal - yuuTotal : null;

  const airporter =
    origin?.kind === "airport" && destPref
      ? airporterCoverage(origin.iata, destPref)
      : null;

  const transit =
    origin && destPref ? estimateTransit(origin.prefecture, destPref) : null;
  const yamatoArrival =
    shipDate && transit ? addDays(shipDate, transit.yamato) : null;
  const yuuArrival =
    shipDate && transit ? addDays(shipDate, transit.yuu) : null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
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
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t(lang, "quote.title")}
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {t(lang, "quote.sub_desc")}
        </p>

        <section className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">
                {t(lang, "quote.guide_banner.tag")}
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {t(lang, "quote.guide_banner.title")}
              </div>
            </div>
            <Link
              href="/guide/shipping"
              className="inline-flex items-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 text-xs font-medium hover:opacity-90"
            >
              {t(lang, "quote.guide_banner.cta")}
            </Link>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs">
            <Link
              href="/guide/shipping/airport-counter"
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-50">
                {t(lang, "guide.shipping.card.airport.title")}
              </div>
              <div className="mt-0.5 text-[11px] text-zinc-500">
                {t(lang, "guide.shipping.card.airport.meta_eta")}
              </div>
            </Link>
            <Link
              href="/guide/shipping/branch-office"
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-50">
                {t(lang, "guide.shipping.card.branch.title")}
              </div>
              <div className="mt-0.5 text-[11px] text-zinc-500">
                {t(lang, "guide.shipping.card.branch.meta_eta")}
              </div>
            </Link>
            <Link
              href="/guide/shipping/hotel-forward"
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-50">
                {t(lang, "guide.shipping.card.hotel.title")}
              </div>
              <div className="mt-0.5 text-[11px] text-zinc-500">
                {t(lang, "guide.shipping.card.hotel.meta_eta")}
              </div>
            </Link>
          </div>

          {/* 3 題快填 — 首次使用者專用,預設摺疊,不擋老用戶 */}
          {!(rawFrom && toPrefRaw && size) && (
            <details className="mt-4 group">
              <summary className="list-none cursor-pointer inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                <span className="transition group-open:rotate-90">›</span>
                懶得填欄位?3 題快速帶你到運費
              </summary>
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <PrefillQuiz />
              </div>
            </details>
          )}
        </section>

        {(() => {
          // Build tab hrefs preserving every other form field so the user
          // doesn't lose state when flipping a mode tab.
          const baseParams = () => {
            const q = new URLSearchParams();
            if (rawFrom) q.set("from", rawFrom);
            if (fromAddress) q.set("from_address", fromAddress);
            if (toPrefRaw) q.set("to_pref", toPrefRaw);
            if (toAddress) q.set("to_address", toAddress);
            if (size) q.set("size", size);
            if (shipDate) q.set("ship_date", shipDate);
            if (pieces !== 1) q.set("pieces", String(pieces));
            return q;
          };
          const fromTabHref = (m: FromMode) => {
            const q = baseParams();
            q.set("from_mode", m);
            return `/quote?${q.toString()}`;
          };
          const tabCls = (active: boolean) =>
            `rounded-lg px-3 py-1.5 border text-xs font-medium ${
              active
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`;
          return (
            <form className="mt-8 grid gap-4 bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800">
              <input type="hidden" name="from_mode" value={fromMode} />

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-500">
                  {t(lang, "quote.form.from")}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href={fromTabHref("airport")} className={tabCls(fromMode === "airport")}>
                    {t(lang, "quote.form.from_mode.airport")}
                  </Link>
                  <Link href={fromTabHref("pref")} className={tabCls(fromMode === "pref")}>
                    {t(lang, "quote.form.from_mode.pref")}
                  </Link>
                  <Link href={fromTabHref("address")} className={tabCls(fromMode === "address")}>
                    {t(lang, "quote.form.from_mode.address")}
                  </Link>
                </div>
                {fromMode === "airport" && (
                  <select
                    name="from"
                    defaultValue={
                      origin?.kind === "airport" ? `airport:${origin.iata}` : ""
                    }
                    required
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      {t(lang, "quote.form.from.placeholder")}
                    </option>
                    {airports.map((a) => (
                      <option key={a.iata} value={`airport:${a.iata}`}>
                        {a.display}
                      </option>
                    ))}
                  </select>
                )}
                {fromMode === "pref" && (
                  <select
                    name="from"
                    defaultValue={
                      origin?.kind === "pref" ? `pref:${origin.prefecture}` : ""
                    }
                    required
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      {t(lang, "quote.form.from.placeholder")}
                    </option>
                    {PREFECTURES.map((p) => (
                      <option key={p.code} value={`pref:${p.name}`}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
                {fromMode === "address" && (
                  <>
                    <HotelPickerField
                      id="quote-from-address"
                      name="from_address"
                      defaultValue={fromAddress}
                      required
                      placeholder={t(lang, "quote.form.from_address_placeholder")}
                      className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm"
                    />
                    <span className="text-[11px] text-zinc-400">
                      {t(lang, "quote.form.from_address_hint")}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-500">
                  {t(lang, "quote.form.to")}
                </span>
                <HotelPickerField
                  id="quote-to-address"
                  name="to_address"
                  defaultValue={toAddress}
                  prefecture={toPrefRaw || undefined}
                  placeholder={t(lang, "quote.form.to_address_placeholder")}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm"
                />
                <span className="text-[11px] text-zinc-400">
                  {t(lang, "quote.form.to_address_hint")}
                </span>
                <details className="mt-1" open={!toAddress && !!toPrefRaw}>
                  <summary className="text-[11px] text-zinc-500 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">
                    {t(lang, "quote.form.to_pref_fallback_summary")}
                  </summary>
                  <select
                    name="to_pref"
                    defaultValue={toPrefRaw}
                    className="mt-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm"
                  >
                    <option value="">
                      {t(lang, "quote.form.to_pref_fallback_placeholder")}
                    </option>
                    {PREFECTURES.map((p) => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </details>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-zinc-500">
                    {t(lang, "quote.form.size")}
                  </span>
                  <select
                    name="size"
                    defaultValue={size ?? ""}
                    required
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      {t(lang, "quote.form.size.placeholder")}
                    </option>
                    {SIZES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-zinc-500">
                    {t(lang, "quote.form.ship_date")}
                  </span>
                  <input
                    type="date"
                    name="ship_date"
                    defaultValue={shipDate ?? ""}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-zinc-500">
                    {t(lang, "quote.form.pieces")}{" "}
                    <span className="text-zinc-400">
                      {t(lang, "quote.form.pieces.hint")}
                    </span>
                  </span>
                  <select
                    name="pieces"
                    defaultValue={pieces.toString()}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {t(lang, "quote.form.pieces.unit")}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <details className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs">
                <summary className="cursor-pointer select-none px-3 py-2 font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">
                  {t(lang, "quote.size_help.summary")}
                </summary>
                <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
                  <svg
                    viewBox="0 0 720 250"
                    className="w-full h-auto text-zinc-700 dark:text-zinc-300"
                    role="img"
                    aria-label={t(lang, "quote.size_help.aria_label")}
                  >
                    <g strokeWidth="1.5">
                      <rect x="30" y="170" width="40" height="30" rx="3" fill="#fef3c7" stroke="#d97706" />
                      <rect x="120" y="150" width="55" height="50" rx="3" fill="#fde68a" stroke="#d97706" />
                      <rect x="225" y="125" width="65" height="75" rx="3" fill="#fcd34d" stroke="#d97706" />
                      <rect x="340" y="100" width="75" height="100" rx="3" fill="#fbbf24" stroke="#b45309" />
                      <rect x="465" y="75" width="85" height="125" rx="3" fill="#f59e0b" stroke="#b45309" />
                      <rect x="600" y="50" width="95" height="150" rx="3" fill="#d97706" stroke="#78350f" />
                    </g>
                    <g fill="currentColor" fontFamily="system-ui" fontSize="16" fontWeight="600" textAnchor="middle">
                      <text x="50" y="220">60</text>
                      <text x="147" y="220">80</text>
                      <text x="257" y="220">100</text>
                      <text x="377" y="220">120</text>
                      <text x="507" y="220">140</text>
                      <text x="647" y="220">160</text>
                    </g>
                    <g fill="currentColor" opacity="0.7" fontFamily="system-ui" fontSize="11" textAnchor="middle">
                      <text x="50" y="238">~2kg</text>
                      <text x="147" y="238">~5kg</text>
                      <text x="257" y="238">~10kg · 21吋</text>
                      <text x="377" y="238">~15kg · 24吋</text>
                      <text x="507" y="238">~20kg · 26吋</text>
                      <text x="647" y="238">~25kg · 29吋</text>
                    </g>
                  </svg>
                  <p className="mt-3 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {t(lang, "quote.size_help.body")}
                  </p>
                </div>
              </details>

              <div>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-3 sm:py-2 text-sm font-semibold hover:opacity-90"
                >
                  {t(lang, "quote.form.submit")}
                </button>
              </div>
            </form>
          );
        })()}

        {showResult && weather?.worst && weather.delayKey && (
          <section
            className={`mt-6 rounded-2xl p-5 ${
              weather.worst === "severe"
                ? "border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200"
                : "border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200"
            }`}
          >
            <div className="text-sm font-semibold">
              {t(lang, "weather.advisory.title")}
            </div>
            <ul className="mt-2 space-y-1 text-xs leading-relaxed">
              {weather.origin && weather.origin.warnings.length > 0 && (
                <li>
                  <span className="font-medium">
                    {tf(lang, "weather.advisory.origin_label", {
                      pref: weather.origin.prefecture,
                    })}
                    :
                  </span>{" "}
                  {weather.origin.warnings.map((w) => w.label).join("、")}
                </li>
              )}
              {weather.destination &&
                weather.destination !== weather.origin &&
                weather.destination.warnings.length > 0 && (
                  <li>
                    <span className="font-medium">
                      {tf(lang, "weather.advisory.destination_label", {
                        pref: weather.destination.prefecture,
                      })}
                      :
                    </span>{" "}
                    {weather.destination.warnings
                      .map((w) => w.label)
                      .join("、")}
                  </li>
                )}
            </ul>
            <p className="mt-3 text-xs leading-relaxed">
              {t(lang, weather.delayKey)}
            </p>
            <p className="mt-2 text-[10px] opacity-70">
              {weather.origin?.reportDatetime &&
                tf(lang, "weather.advisory.updated_at", {
                  time: weather.origin.reportDatetime
                    .replace("T", " ")
                    .slice(0, 16),
                })}{" "}
              · {t(lang, "weather.advisory.source")}
            </p>
          </section>
        )}

        {showResult && (
          <div className="mt-5 flex items-center justify-end gap-3 flex-wrap">
            <Link
              href="/japan"
              className="inline-flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-100"
            >
              日本大小事備忘錄 →
            </Link>
            <ShareButtons
              shareText={`${origin?.display ?? ""} → ${destPref ?? ""} ${t(lang, "site.tagline")} (${size ?? ""}サイズ)`}
              copyLabel={t(lang, "share.copy")}
              copiedLabel={t(lang, "share.copied")}
              lineLabel={t(lang, "share.line")}
            />
          </div>
        )}

        {showResult && airporter && (
          <section className="mt-8 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="text-xs tracking-[0.15em] uppercase text-blue-700 dark:text-blue-300">
                  {t(lang, "quote.sameday.tagline")}
                </div>
                <div className="mt-1 text-2xl font-semibold text-blue-900 dark:text-blue-100">
                  Airporter
                </div>
                <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                  {airporter.cities.join(" / ")}
                </p>
              </div>
              <a
                href={AIRPORTER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-blue-700"
              >
                {t(lang, "quote.sameday.official")}
              </a>
            </div>
            <div className="mt-3 text-sm font-medium text-blue-900 dark:text-blue-100">
              {t(lang, AIRPORTER_PRICE_NOTE_KEY)}
            </div>
            <div className="mt-1 text-xs text-blue-700 dark:text-blue-300">
              {t(lang, AIRPORTER_SAMEDAY_WINDOW_KEY)}
            </div>
            {airporter.noteKey && (
              <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                ※ {t(lang, airporter.noteKey)}
              </div>
            )}
            <p className="mt-3 text-xs text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
              {t(lang, "quote.sameday.description")}
            </p>
          </section>
        )}

        {showResult && (
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <div className="text-xs tracking-wide text-zinc-500">
                Yamato 黒猫宅急便
              </div>
              <div className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                {yamatoTotal != null
                  ? `¥${yamatoTotal.toLocaleString()}`
                  : t(lang, "quote.no_route")}
              </div>
              {pieces > 1 && yamatoPrice != null && (
                <div className="mt-1 text-xs text-zinc-500">
                  {tf(lang, "quote.pieces_of", {
                    price: yamatoPrice.toLocaleString(),
                    pieces,
                  })}
                  <span className="ml-1 text-zinc-400">
                    · {t(lang, "quote.no_multi_discount")}
                  </span>
                </div>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                {origin!.prefecture} → {destPref} · {size}サイズ
                {yamatoScrapedAt && (
                  <span className="ml-2 text-zinc-400">
                    {tf(lang, "quote.rate_updated", {
                      date: yamatoScrapedAt.slice(0, 10),
                    })}
                  </span>
                )}
              </p>
              {yamatoArrival && transit && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                  {t(lang, "quote.arrival_label")}{" "}
                  <strong>{formatArrival(yamatoArrival)}</strong>
                  <span className="opacity-70">
                    {tf(lang, "quote.ship_plus_days", { n: transit.yamato })}
                  </span>
                </div>
              )}
              {origin && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {(origin.kind === "airport"
                      ? PAYMENTS.yamato.airport
                      : PAYMENTS.yamato.branch
                    ).methods.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-400"
                      >
                        💳 {m}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
                    {(() => {
                      const info =
                        origin.kind === "airport"
                          ? PAYMENTS.yamato.airport
                          : PAYMENTS.yamato.branch;
                      return info.tipKey ? t(lang, info.tipKey) : null;
                    })()}
                  </p>
                </div>
              )}
              {origin!.kind === "airport" && sendCounters.length > 0 && (
                <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <div className="text-xs font-medium text-zinc-500 mb-2">
                    {tf(lang, "quote.counters_title", {
                      n: sendCounters.length,
                    })}
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {sendCounters.map((c) => {
                      const hrs = yamatoAirportHours(
                        c.airport_name_jp,
                        c.service_type,
                      );
                      const entityId = yamatoAirportEntityId(
                        origin?.kind === "airport" ? origin.iata : "",
                        c.service_type,
                        c.airport_name_jp,
                      );
                      return (
                        <li
                          key={`${c.airport_name_jp}-${c.service_type}`}
                          className="leading-relaxed"
                        >
                          <div>
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                              {c.airport_name_jp}
                            </span>
                            {c.floor && <> · {c.floor}</>}
                            {" · "}
                            {c.service_type}
                            {c.detail_url && (
                              <>
                                {" · "}
                                <a
                                  href={c.detail_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
                                >
                                  {t(lang, "quote.counter.detail")}
                                </a>
                              </>
                            )}
                          </div>
                          {hrs && (
                            <div className="mt-0.5 text-zinc-500">
                              {t(lang, "quote.counter.reception")} {hrs.hours}
                              {" · "}
                              <a
                                href={`tel:${(hrs.phone ?? YAMATO_NAVI_DIAL).replace(/-/g, "")}`}
                                className="hover:text-zinc-900 dark:hover:text-zinc-100"
                              >
                                {hrs.phone ??
                                  `${t(lang, "quote.counter.navidial")} ${YAMATO_NAVI_DIAL}`}
                              </a>
                              {hrs.note && (
                                <span className="ml-1 text-zinc-400">
                                  · {hrs.note}
                                </span>
                              )}
                            </div>
                          )}
                          <LocationReportPanel
                            entityType="yamato_airport"
                            entityId={entityId}
                            entityLabel={`${c.airport_name_jp} · ${c.service_type}`}
                            badge={yamatoAirportBadges.get(entityId) ?? null}
                            compact
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {origin!.kind === "pref" && (
                <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-3 text-xs text-zinc-500 leading-relaxed">
                  {yamatoBranchCount != null && yamatoBranchCount > 0 ? (
                    <>
                      <div className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        {tf(lang, "quote.pref.yamato.branches_title", {
                          pref: origin!.prefecture,
                          n: yamatoBranchCount.toLocaleString(),
                        })}
                      </div>
                      {yamatoBranchSamples.length > 0 && (
                        <ul className="space-y-2 mb-2">
                          {yamatoBranchSamples.map((b) => (
                            <li key={b.branch_code} className="text-zinc-500">
                              <span className="text-zinc-700 dark:text-zinc-300">
                                {b.name_jp}
                              </span>
                              {b.hours_weekday && (
                                <span className="ml-1 text-zinc-400">
                                  · {t(lang, "quote.pref.yamato.weekday")}{" "}
                                  {b.hours_weekday}
                                </span>
                              )}
                              <LocationReportPanel
                                entityType="yamato_branch"
                                entityId={b.branch_code}
                                entityLabel={b.name_jp}
                                badge={yamatoBranchBadges.get(b.branch_code) ?? null}
                                compact
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-zinc-500">
                        {t(lang, "quote.pref.yamato.with_branches")}
                        <a
                          href="https://locations.kuronekoyamato.co.jp/p/yamato01/"
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                          {t(lang, "quote.pref.yamato.branch_search")}
                        </a>
                        {t(lang, "quote.pref.yamato.submit_tail")}
                      </p>
                    </>
                  ) : (
                    <p>{t(lang, "quote.pref.yamato.no_branches")}</p>
                  )}
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <div className="text-xs tracking-wide text-zinc-500">
                郵便局 ゆうパック
              </div>
              <div className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                {yuuPackOversize
                  ? "—"
                  : yuuTotal != null
                    ? `¥${yuuTotal.toLocaleString()}`
                    : t(lang, "quote.no_route")}
              </div>
              {yuuPackOversize && (
                <p className="mt-2 inline-block rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 px-2 py-1 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  ゆうパック 上限は 170 サイズ(3辺合計 170cm / 25kg)。
                  180・200 サイズは <strong>Yamato のみ</strong>取扱。
                </p>
              )}
              {yuuAirportSurcharge > 0 && yuuPackPrice != null && (
                <div className="mt-2 rounded-md border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-2 text-[11px] text-sky-900 dark:text-sky-200 leading-relaxed">
                  <div>
                    內含 <strong>空港ゆうパック 機場手續費 +¥
                    {yuuAirportSurcharge.toLocaleString()}</strong>
                    (基本料金 ¥{yuuPackPrice.toLocaleString()} + ¥
                    {yuuAirportSurcharge})
                  </div>

                  {/* 折扣機制 */}
                  <div className="mt-1.5 pt-1.5 border-t border-sky-200/50 dark:border-sky-800/50">
                    <div className="font-medium text-sky-800 dark:text-sky-200">
                      💡 折扣可選(疊加最多 -¥360)
                    </div>
                    <ul className="mt-0.5 ml-3 space-y-0.5 text-sky-700 dark:text-sky-300">
                      <li>
                        • 郵便局持込割 <strong>-¥120</strong> / 件
                        (自己拿到郵局或合作便利商店寄)
                      </li>
                      <li>
                        • 往復割 <strong>-¥120</strong>(復路のみ,寄件時就確定來回)
                      </li>
                    </ul>
                  </div>

                  {/* 受理條件 collapsible */}
                  <details className="mt-1.5 pt-1.5 border-t border-sky-200/50 dark:border-sky-800/50">
                    <summary className="cursor-pointer font-medium text-sky-800 dark:text-sky-200 hover:underline">
                      受理條件 / 寄出時程 ▼
                    </summary>
                    <ul className="mt-1 ml-3 space-y-0.5 text-sky-700 dark:text-sky-300">
                      <li>
                        • <strong>受理品限定</strong>:旅行カバン / スキー道具 /
                        ゴルフ用具のみ(一般ダンボールは不可)
                      </li>
                      <li>
                        • <strong>長さ上限</strong>:単辺の最大 ≤ 150cm
                        (スキー道具・ゴルフは ≤ 210cm)
                      </li>
                      <li>
                        • <strong>取扱空港</strong>:新千歳・羽田・成田・関西・
                        福岡・那覇など主要 13 空港(全空港對照見下方カウンター)
                      </li>
                      <li>
                        • <strong>寄出時程</strong>:搭乗日の前日までに空港到着が
                        基本(自宅 → 空港 1-2 日要りますので、3 日前発送が安全)
                      </li>
                    </ul>
                  </details>
                </div>
              )}
              {pieces > 1 && yuuPackPrice != null && (
                <div className="mt-1 text-xs text-zinc-500">
                  {tf(lang, "quote.pieces_of", {
                    price: yuuPackPrice.toLocaleString(),
                    pieces,
                  })}
                  {yuuMultiDiscountPer > 0 && (
                    <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                      − ¥{(yuuMultiDiscountPer * pieces).toLocaleString()}{" "}
                      {t(lang, "quote.multi_discount_label")}
                    </span>
                  )}
                </div>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                {origin!.prefecture} → {destPref} · {size}サイズ
                {yuuPackScrapedAt && (
                  <span className="ml-2 text-zinc-400">
                    {tf(lang, "quote.rate_updated", {
                      date: yuuPackScrapedAt.slice(0, 10),
                    })}
                  </span>
                )}
              </p>
              {yuuArrival && transit && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                  {t(lang, "quote.arrival_label")}{" "}
                  <strong>{formatArrival(yuuArrival)}</strong>
                  <span className="opacity-70">
                    {tf(lang, "quote.ship_plus_days", { n: transit.yuu })}
                  </span>
                </div>
              )}
              {origin && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {(origin.kind === "airport"
                      ? PAYMENTS.yuu.airport
                      : PAYMENTS.yuu.postoffice
                    ).methods.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-400"
                      >
                        💳 {m}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
                    {(() => {
                      const info =
                        origin.kind === "airport"
                          ? PAYMENTS.yuu.airport
                          : PAYMENTS.yuu.postoffice;
                      return info.tipKey ? t(lang, info.tipKey) : null;
                    })()}
                  </p>
                </div>
              )}
              {origin!.kind === "airport" && yuuPackCounters.length > 0 && (
                <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <div className="text-xs font-medium text-zinc-500 mb-2">
                    {tf(lang, "quote.yuu.counters_title", {
                      n: yuuPackCounters.length,
                    })}
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {yuuPackCounters.map((c) => {
                      const entityId = yuuAirportEntityId(
                        c.airport_iata,
                        c.counter_name_jp,
                      );
                      return (
                        <li key={c.counter_name_jp} className="leading-relaxed">
                          <div className="font-medium text-zinc-700 dark:text-zinc-300">
                            {c.counter_name_jp}
                          </div>
                          <div className="text-zinc-500">
                            {c.hours_jst}
                            {" · "}
                            <a
                              href={`tel:${c.phone.replace(/\s/g, "")}`}
                              className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                              {c.phone}
                            </a>
                          </div>
                          {c.note && (
                            <div className="text-zinc-400">{c.note}</div>
                          )}
                          <LocationReportPanel
                            entityType="yuu_pack_airport"
                            entityId={entityId}
                            entityLabel={c.counter_name_jp}
                            badge={yuuAirportBadges.get(entityId) ?? null}
                            compact
                          />
                        </li>
                      );
                    })}
                  </ul>
                  <a
                    href={YUU_PACK_AIRPORT_LIST_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {t(lang, "quote.yuu.official_list")}
                  </a>
                </div>
              )}
              {origin!.kind === "airport" && yuuPackCounters.length === 0 && (
                <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
                  {t(lang, "quote.yuu.airport_no_counter")}
                </p>
              )}
              {origin!.kind === "pref" && (
                <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
                  {t(lang, "quote.yuu.pref_note")}
                </p>
              )}
            </article>

            {origin?.kind === "pref" && (
              <div className="sm:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {t(lang, "hotel.section.title")}
                </h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {t(lang, HOTEL_POLICY_GENERAL_NOTE_KEY)}
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-zinc-500">
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="text-left font-normal py-2 pr-3">
                          {t(lang, "hotel.table.col.chain")}
                        </th>
                        <th
                          className="text-center font-normal px-1 py-2"
                          title={t(lang, "hotel.table.tooltip.receive")}
                        >
                          {t(lang, "hotel.table.col.receive")}
                        </th>
                        <th
                          className="text-center font-normal px-1 py-2"
                          title={t(lang, "hotel.table.tooltip.send")}
                        >
                          {t(lang, "hotel.table.col.send")}
                        </th>
                        <th
                          className="text-center font-normal px-1 py-2"
                          title={t(lang, "hotel.table.tooltip.precheckin")}
                        >
                          {t(lang, "hotel.table.col.precheckin")}
                        </th>
                        <th className="text-left font-normal pl-3 py-2">
                          {t(lang, "hotel.table.col.note")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {HOTEL_CHAIN_POLICIES.map((chain) => {
                        const r = capabilityBadge(chain.canReceive);
                        const s = capabilityBadge(chain.canSend);
                        const h = capabilityBadge(chain.preCheckinHold);
                        const agg = chainAggregates.get(chain.code);
                        return (
                          <tr
                            key={chain.name}
                            className="border-b border-zinc-100 dark:border-zinc-800/60"
                          >
                            <td className="py-2 pr-3 align-top">
                              {chain.url ? (
                                <a
                                  href={chain.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-zinc-900 dark:text-zinc-100 hover:underline"
                                >
                                  {chain.name}
                                </a>
                              ) : (
                                <span className="text-zinc-900 dark:text-zinc-100">
                                  {chain.name}
                                </span>
                              )}
                              <div className="text-[10px] text-zinc-400">
                                {chain.nameJp}
                              </div>
                            </td>
                            <td className="text-center px-1 py-2 align-top">
                              <span
                                className={`inline-flex h-5 w-5 items-center justify-center rounded ${r.cls}`}
                              >
                                {r.sym}
                              </span>
                              <ReportCountPill counts={agg?.can_receive} />
                            </td>
                            <td className="text-center px-1 py-2 align-top">
                              <span
                                className={`inline-flex h-5 w-5 items-center justify-center rounded ${s.cls}`}
                              >
                                {s.sym}
                              </span>
                              <ReportCountPill counts={agg?.can_send} />
                            </td>
                            <td className="text-center px-1 py-2 align-top">
                              <span
                                className={`inline-flex h-5 w-5 items-center justify-center rounded ${h.cls}`}
                              >
                                {h.sym}
                              </span>
                              <ReportCountPill counts={agg?.pre_checkin_hold} />
                            </td>
                            <td className="pl-3 py-2 text-zinc-500 align-top">
                              {chain.noteKey ? t(lang, chain.noteKey) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[10px] text-zinc-500">
                  <span>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 mr-1">
                      ✓
                    </span>
                    {t(lang, "hotel.legend.yes")}
                  </span>
                  <span>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 mr-1">
                      △
                    </span>
                    {t(lang, "hotel.legend.case")}
                  </span>
                  <span>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mr-1">
                      ?
                    </span>
                    {t(lang, "hotel.legend.check")}
                  </span>
                </div>
                <p className="mt-3 text-[10px] text-zinc-400 leading-relaxed">
                  {t(lang, HOTEL_POLICY_DISCLAIMER_KEY)}
                </p>

                {/* UGC 飯店實測回報 (#57) */}
                <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-5">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {t(lang, "hotel.report.section_title")}
                  </h4>
                  <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
                    {t(lang, "hotel.report.section_desc")}
                  </p>
                  {session ? (
                    <HotelReportForm
                      chains={HOTEL_CHAIN_POLICIES.map((c) => ({
                        code: c.code,
                        name: c.name,
                        nameJp: c.nameJp,
                      }))}
                      existing={
                        userReports
                          ? (Array.from(userReports.values()).map((e) => ({
                              chain_code: e.chain_code,
                              field: e.field as ReportField,
                              value: e.value,
                              note: e.note,
                              updated_at: e.updated_at,
                            })) as HotelReportFormExistingEntry[])
                          : []
                      }
                      userName={session.displayName}
                      labels={{
                        chain: t(lang, "hotel.report.form.chain"),
                        chainPlaceholder: t(
                          lang,
                          "hotel.report.form.chain_placeholder",
                        ),
                        receiveQ: t(lang, "hotel.report.form.receive_q"),
                        sendQ: t(lang, "hotel.report.form.send_q"),
                        precheckinQ: t(
                          lang,
                          "hotel.report.form.precheckin_q",
                        ),
                        valueYes: t(lang, "hotel.report.form.value_yes"),
                        valueCase: t(lang, "hotel.report.form.value_case"),
                        valueCheck: t(lang, "hotel.report.form.value_check"),
                        valueSkip: t(lang, "hotel.report.form.value_skip"),
                        notePlaceholder: t(
                          lang,
                          "hotel.report.form.note_placeholder",
                        ),
                        submit: t(lang, "hotel.report.form.submit"),
                        submitting: t(
                          lang,
                          "hotel.report.form.submitting",
                        ),
                        success: t(lang, "hotel.report.form.success"),
                        error: t(lang, "hotel.report.form.error"),
                        noChange: t(lang, "hotel.report.form.no_change"),
                        yourCurrent: t(lang, "hotel.report.your_current"),
                        greet: t(lang, "hotel.report.greet"),
                        logout: t(lang, "hotel.report.logout"),
                      }}
                    />
                  ) : (
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] text-zinc-500">
                        {t(lang, "hotel.report.login_cta")}
                      </span>
                      <a
                        href={`/api/auth/line/start?return=${encodeURIComponent(
                          "/quote?" +
                            (rawFrom ? `from=${encodeURIComponent(rawFrom)}&` : "") +
                            (toPrefRaw ? `to_pref=${encodeURIComponent(toPrefRaw)}&` : "") +
                            (size ? `size=${size}&` : ""),
                        )}`}
                        className="inline-flex items-center rounded-lg bg-[#06C755] text-white px-3 py-1.5 text-[11px] font-semibold hover:opacity-90"
                      >
                        📨 {t(lang, "hotel.report.login_button")}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {diff != null && (
              <div className="sm:col-span-2 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-5">
                <div className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  {(() => {
                    const piecesSuffix =
                      pieces > 1
                        ? tf(lang, "quote.diff.pieces_suffix", { pieces })
                        : "";
                    const yuuMultiSuffix =
                      pieces > 1
                        ? tf(lang, "quote.diff.pieces_multi_yuu", {
                            pieces,
                            discount: (
                              yuuMultiDiscountPer * pieces
                            ).toLocaleString(),
                          })
                        : "";
                    if (diff === 0) {
                      return (
                        tf(lang, "quote.diff.tie", {
                          amount: yamatoTotal!.toLocaleString(),
                        }) + piecesSuffix
                      );
                    }
                    if (diff < 0) {
                      return (
                        tf(lang, "quote.diff.yamato_cheaper", {
                          amount: Math.abs(diff).toLocaleString(),
                        }) + piecesSuffix
                      );
                    }
                    return (
                      tf(lang, "quote.diff.yuu_cheaper", {
                        amount: diff.toLocaleString(),
                      }) + yuuMultiSuffix
                    );
                  })()}
                </div>
                <p className="mt-1.5 text-xs text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                  {t(lang, "quote.diff.surcharge_note")}
                </p>
              </div>
            )}
          </section>
        )}

        {fromMode === "address" && fromAddress && !origin && (
          <section className="mt-8 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 text-sm text-amber-900 dark:text-amber-200">
            {t(lang, "quote.result.from_address_fail")}
          </section>
        )}

        {toAddressFailed && (
          <section className="mt-8 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 text-sm text-amber-900 dark:text-amber-200">
            {t(lang, "quote.result.to_address_fail")}
          </section>
        )}

        {origin?.kind === "address" && (
          <>
            <div className="mt-10 text-xs text-zinc-500">
              <span className="font-medium">
                {t(lang, "quote.result.from_resolved_as")}:
              </span>{" "}
              {origin.geo.display_name}
              {origin.geo.fallback_level > 0 && (
                <span className="ml-2 text-amber-700 dark:text-amber-300">
                  ⚠️ {tf(lang, "nearby.result.fallback_note", {
                    query: origin.geo.matched_query,
                  })}
                </span>
              )}
            </div>
            <section className="mt-4">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-50">
                {t(lang, "quote.result.from_yamato_header")}
              </h2>
              <YamatoList branches={origin.yamato} lang={lang} />
            </section>
            <section className="mt-6">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-50">
                {t(lang, "quote.result.from_yuu_header")}
              </h2>
              <YuuList offices={origin.yuu} lang={lang} />
            </section>
          </>
        )}

        {destination?.kind === "address" && (
          <>
            <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
              <span className="font-medium">
                {t(lang, "quote.result.to_resolved_as")}:
              </span>{" "}
              {destination.geo.display_name}
              {destination.geo.fallback_level > 0 && (
                <span className="ml-2 text-amber-700 dark:text-amber-300">
                  ⚠️ {tf(lang, "nearby.result.fallback_note", {
                    query: destination.geo.matched_query,
                  })}
                </span>
              )}
            </div>
            {remoteIsland && (
              <section className="mt-4 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 text-sm text-amber-900 dark:text-amber-200">
                <div className="font-semibold mb-2">
                  ⚠️ {t(lang, "quote.result.remote_island_title")} — {remoteIsland.name}
                </div>
                <div className="text-xs leading-relaxed mb-3 text-amber-800/90 dark:text-amber-200/90">
                  {t(lang, "quote.result.remote_island_no_surcharge")}
                </div>
                <ul className="space-y-2 text-xs leading-relaxed">
                  <li>
                    <span className="font-medium">Yamato{" "}
                      <span className={remoteIsland.yamato.status === "refused"
                        ? "text-rose-700 dark:text-rose-300"
                        : "text-amber-700 dark:text-amber-300"}>
                        {remoteIsland.yamato.status === "refused"
                          ? t(lang, "quote.result.remote_island_refused")
                          : t(lang, "quote.result.remote_island_delayed")}
                      </span>:
                    </span>{" "}
                    {remoteIsland.yamato.note}
                  </li>
                  <li>
                    <span className="font-medium">ゆうパック{" "}
                      <span className="text-amber-700 dark:text-amber-300">
                        {t(lang, "quote.result.remote_island_delayed")}
                      </span>:
                    </span>{" "}
                    {remoteIsland.yuu.note}
                  </li>
                </ul>
              </section>
            )}
            <section className="mt-4">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-50">
                {t(lang, "quote.result.to_yamato_header")}
              </h2>
              <YamatoList branches={destination.yamato} lang={lang} />
            </section>
            <section className="mt-6">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-50">
                {t(lang, "quote.result.to_yuu_header")}
              </h2>
              <YuuList offices={destination.yuu} lang={lang} />
            </section>
          </>
        )}

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

        <p className="mt-10 text-xs text-zinc-400 dark:text-zinc-600 leading-relaxed">
          {t(lang, "quote.footer")}
        </p>
      </div>
    </main>
  );
}
