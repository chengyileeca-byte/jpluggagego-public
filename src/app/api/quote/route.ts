import { type NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PREFECTURES } from "@/lib/japan";

export const dynamic = "force-dynamic";

type FareRow = {
  from_pref: string;
  to_pref: string;
  size_code: string;
  price_jpy: number;
  scraped_at: string;
};

let _yamatoFaresCache: FareRow[] | null = null;
let _yuuFaresCache: FareRow[] | null = null;
let _airportCountersCache: CounterRow[] | null = null;

async function loadYamatoFares() {
  if (!_yamatoFaresCache) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yamato_fares.json"),
      "utf-8",
    );
    _yamatoFaresCache = JSON.parse(raw) as FareRow[];
  }
  return _yamatoFaresCache;
}
async function loadYuuFares() {
  if (!_yuuFaresCache) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yuu_pack_fares.json"),
      "utf-8",
    );
    _yuuFaresCache = JSON.parse(raw) as FareRow[];
  }
  return _yuuFaresCache;
}
async function loadAirportCounters() {
  if (!_airportCountersCache) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yamato_airport_counters.json"),
      "utf-8",
    );
    _airportCountersCache = JSON.parse(raw) as CounterRow[];
  }
  return _airportCountersCache;
}

const VALID_SIZES = new Set([
  "60",
  "80",
  "100",
  "120",
  "140",
  "160",
  "180",
  "200",
]);
// ゆうパック 上限 170;180/200 在 ゆうパック 不適用,response 標 yu_pack_oversize=true
// 讓 caller 知道 yuupack.price_jpy=null 是「服務不涵蓋」而非「資料缺失」。
const YUU_PACK_MAX_SIZE = 170;

// 空港ゆうパック(機場 → 自宅 / 自宅 → 機場 旅行配送)
// 一律加 +¥800 機場手續費。長さ ≤150cm(スキー道具 ≤210cm)。
// 受理品:旅行カバン / スキー / ゴルフ のみ(一般紙箱不可)
// Source: https://www.post.japanpost.jp/service/you_pack/airpo/index.html
const AIRPORT_YUU_PACK_SURCHARGE_JPY = 800;
// 折扣機制(疊加最多 -¥360):
//   持込割: -¥120/件(郵便局持込)
//   往復割: -¥120(復路のみ、往復同時申込)
// Source: https://www.post.japanpost.jp/service/you_pack/airpo/merit.html
const AIRPORT_YUU_PACK_CARRY_IN_DISCOUNT_JPY = 120;
const AIRPORT_YUU_PACK_ROUNDTRIP_DISCOUNT_JPY = 120;

interface CounterRow {
  airport_iata: string;
  airport_name_jp: string;
  terminal: string | null;
  prefecture: string;
  service_type: string;
  floor: string | null;
  detail_url: string | null;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const rawFrom =
    sp.get("from") ??
    (sp.get("airport") ? `airport:${sp.get("airport")}` : null);
  const toPref = sp.get("to_pref");
  const size = sp.get("size");

  if (!rawFrom || !toPref || !size) {
    return json(
      {
        error: "missing_param",
        required: ["from (airport:IATA|pref:都道府県)", "to_pref", "size"],
        example:
          "/api/quote?from=airport:NRT&to_pref=東京都&size=160  or  /api/quote?from=pref:東京都&to_pref=京都府&size=140",
      },
      400,
    );
  }

  if (!VALID_SIZES.has(size)) {
    return json(
      { error: "invalid_size", allowed: [...VALID_SIZES] },
      400,
    );
  }

  if (!PREFECTURES.some((p) => p.name === toPref)) {
    return json(
      { error: "invalid_to_pref", hint: "must match PREFECTURES[].name" },
      400,
    );
  }

  const counters = await loadAirportCounters();

  const airportByIata = new Map<string, CounterRow>();
  for (const c of counters) {
    if (!airportByIata.has(c.airport_iata)) airportByIata.set(c.airport_iata, c);
  }

  let fromPref: string;
  let originInfo: Record<string, unknown>;
  if (rawFrom.startsWith("airport:")) {
    const iata = rawFrom.slice("airport:".length);
    const a = airportByIata.get(iata);
    if (!a) return json({ error: "unknown_airport", iata }, 404);
    fromPref = a.prefecture;
    originInfo = { kind: "airport", iata, prefecture: a.prefecture };
  } else if (rawFrom.startsWith("pref:")) {
    const name = rawFrom.slice("pref:".length);
    if (!PREFECTURES.some((p) => p.name === name)) {
      return json({ error: "invalid_from_pref", value: name }, 400);
    }
    fromPref = name;
    originInfo = { kind: "pref", prefecture: name };
  } else {
    return json(
      {
        error: "invalid_from",
        hint: "must start with airport: or pref:",
        value: rawFrom,
      },
      400,
    );
  }

  const [yamatoFares, yuuFares] = await Promise.all([
    loadYamatoFares(),
    loadYuuFares(),
  ]);
  const matchFare = (rows: FareRow[]) =>
    rows.find(
      (r) =>
        r.from_pref === fromPref &&
        r.to_pref === toPref &&
        r.size_code === size,
    ) ?? null;
  const yamatoFare = matchFare(yamatoFares);
  const yuuFare = matchFare(yuuFares);

  const sendCounters =
    originInfo.kind === "airport"
      ? counters
          .filter(
            (c) =>
              c.airport_iata === originInfo.iata &&
              (c.service_type === "発送" || c.service_type === "受取・発送"),
          )
          .map((c) => ({
            airport_name_jp: c.airport_name_jp,
            terminal: c.terminal,
            floor: c.floor,
            service_type: c.service_type,
            detail_url: c.detail_url,
          }))
      : [];

  const yuuPackOversize = Number(size) > YUU_PACK_MAX_SIZE;
  const fromAirport = originInfo.kind === "airport";
  const yuuAirportSurcharge =
    fromAirport && yuuFare?.price_jpy != null
      ? AIRPORT_YUU_PACK_SURCHARGE_JPY
      : 0;
  const yuuPackEffectivePrice =
    yuuFare?.price_jpy != null
      ? yuuFare.price_jpy + yuuAirportSurcharge
      : null;

  // 比價以「實付」對照 — Yamato airport counter 通常已內含、無單獨追加,
  // 所以 yamato 直接用 base price,ゆうパック 加上空港手續費後比。
  const diffJpy =
    yamatoFare?.price_jpy != null && yuuPackEffectivePrice != null
      ? yamatoFare.price_jpy - yuuPackEffectivePrice
      : null;

  return json({
    from: originInfo,
    to_pref: toPref,
    size_code: size,
    yamato: {
      price_jpy: yamatoFare?.price_jpy ?? null,
      scraped_at: yamatoFare?.scraped_at ?? null,
      counters: sendCounters,
    },
    yuupack: {
      price_jpy: yuuFare?.price_jpy ?? null,
      scraped_at: yuuFare?.scraped_at ?? null,
      oversize: yuuPackOversize,
      // 空港ゆうパック 機場手續費 +¥800(from=airport: 才適用)
      airport_surcharge_jpy: yuuAirportSurcharge,
      // 折扣明細(空港ゆうパック 限定)
      airport_discounts: fromAirport
        ? {
            carry_in_jpy: AIRPORT_YUU_PACK_CARRY_IN_DISCOUNT_JPY, // -¥120/件
            roundtrip_jpy: AIRPORT_YUU_PACK_ROUNDTRIP_DISCOUNT_JPY, // -¥120 復路のみ
            max_combined_jpy: 360, // 公式「最大 ¥360 お得」
          }
        : null,
      effective_price_jpy: yuuPackEffectivePrice,
    },
    diff_jpy: diffJpy,
    cheaper:
      diffJpy == null
        ? null
        : diffJpy < 0
          ? "yamato"
          : diffJpy > 0
            ? "yuupack"
            : "tie",
  });
}
