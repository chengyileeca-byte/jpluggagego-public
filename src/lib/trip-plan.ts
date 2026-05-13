import type { HomeSizeCode } from "./home-sizes";

// Multi-leg luggage forwarding plan.
//
// Given an optional arrival airport, a list of stays, and an optional
// departure airport, decide which legs need a door-to-door delivery and
// how much each carrier costs.
//
// Scope of this v0 skeleton:
//   - 都道府県 level only (no address geocoding yet; that's Sprint 5 terrain,
//     can be bolted on later via resolve-location.ts)
//   - "ship on checkout day, 翌日 16:00 到" fixed rule (hotel代収/前日投單
//     refinement comes later with flight-deadline / hotel-policy overlays)
//   - skip rule: same-pref same-day → user can walk/hand-carry
//   - skip rule: no baggage declared on that stay
//   - per-size count × unit fare; leg total / plan total

export type StayKind = "chain-hotel" | "independent" | "airbnb";

export interface Stay {
  id: string;
  prefecture: string; // must match PREFECTURES[].name
  // Display hints — not used by the algorithm but carried through to UI.
  label?: string | null;
  address?: string | null;
  // Resolved display string from geocoder (e.g. "京都府京都市東山区祇園町南側 572"),
  // kept separate from `address` (user input) for UI clarity.
  resolvedAddress?: string | null;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  kind?: StayKind;
  baggage: Array<{ size: HomeSizeCode; count: number }>;
  // When true, we assume hotel 前日投單 (concierge collects the parcel the
  // evening before checkout), so shipDate = checkOut - 1 and the parcel lands
  // at the next destination on checkout/checkIn day. Requires the stay to be
  // at least 2 nights, otherwise we silently fall back to same-day shipping.
  shipDayBefore?: boolean;
}

export type DestinationEnd =
  | { kind: "stay"; stay: Stay }
  | { kind: "airport"; iata: string; prefecture: string; label?: string };

export interface FareRate {
  yamato: number | null;
  yuu: number | null;
}

// Callback-based fare lookup so the algorithm stays DB-agnostic and easily
// testable. Page-level code hydrates fares in bulk, then passes a getter.
export type FareLookup = (
  fromPref: string,
  toPref: string,
  size: HomeSizeCode,
) => FareRate;

export interface LegPriceRow {
  size: HomeSizeCode;
  count: number;
  yamato: number | null;
  yuu: number | null;
  cheaper: "yamato" | "yuu" | "tie" | null;
}

export interface DeliveryLeg {
  index: number;
  from: DestinationEnd;
  to: DestinationEnd;
  shipDate: string; // YYYY-MM-DD
  arriveDate: string; // YYYY-MM-DD (shipDate + 1)
  usedDayBefore: boolean; // true when 前日投單 actually applied
  dayBeforeFallback: boolean; // true when 前日投單 requested but stay too short
  perSize: LegPriceRow[];
  totals: { yamato: number | null; yuu: number | null };
  skipped: false;
}

export interface SkippedLeg {
  index: number;
  from: DestinationEnd;
  to: DestinationEnd;
  skipped: true;
  reason: "same_pref_same_day" | "no_baggage";
}

export type PlanLeg = DeliveryLeg | SkippedLeg;

export interface TripPlan {
  legs: PlanLeg[];
  totals: { yamato: number | null; yuu: number | null };
  // True when at least one active leg has a null on either carrier → total is
  // incomplete; UI should show "—" and surface the missing rows.
  hasGaps: boolean;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Decide shipDate based on stay's 前日投單 preference. Returns the resolved
// date string and whether the fallback kicked in (stay < 2 nights).
function resolveShipDate(stay: Stay): {
  shipDate: string;
  usedDayBefore: boolean;
  fallbackApplied: boolean;
} {
  if (!stay.shipDayBefore) {
    return {
      shipDate: stay.checkOut,
      usedDayBefore: false,
      fallbackApplied: false,
    };
  }
  const candidate = addDays(stay.checkOut, -1);
  if (candidate > stay.checkIn) {
    return {
      shipDate: candidate,
      usedDayBefore: true,
      fallbackApplied: false,
    };
  }
  // 1-night stay — can't ship "yesterday" because yesterday was check-in day
  // (often arriving late evening). Fall back to same-day ship.
  return {
    shipDate: stay.checkOut,
    usedDayBefore: false,
    fallbackApplied: true,
  };
}

function endPrefecture(e: DestinationEnd): string {
  return e.kind === "stay" ? e.stay.prefecture : e.prefecture;
}

export function buildTripPlan({
  stays,
  startAirport,
  finalAirport,
  fareLookup,
}: {
  stays: Stay[];
  startAirport?: { iata: string; prefecture: string; label?: string } | null;
  finalAirport?: { iata: string; prefecture: string; label?: string } | null;
  fareLookup: FareLookup;
}): TripPlan {
  const legs: PlanLeg[] = [];
  if (stays.length === 0)
    return { legs, totals: { yamato: 0, yuu: 0 }, hasGaps: false };

  // Build ordered list of endpoints. Each consecutive pair defines a leg.
  const ends: DestinationEnd[] = [];
  if (startAirport) {
    ends.push({
      kind: "airport",
      iata: startAirport.iata,
      prefecture: startAirport.prefecture,
      label: startAirport.label,
    });
  }
  for (const s of stays) ends.push({ kind: "stay", stay: s });
  if (finalAirport) {
    ends.push({
      kind: "airport",
      iata: finalAirport.iata,
      prefecture: finalAirport.prefecture,
      label: finalAirport.label,
    });
  }

  let totalYamato: number | null = 0;
  let totalYuu: number | null = 0;
  let hasGaps = false;

  for (let i = 0; i < ends.length - 1; i++) {
    const from = ends[i];
    const to = ends[i + 1];

    // Shipment's baggage source:
    // - from=stay:   from.stay's declared luggage (what user takes onward).
    // - from=airport: next stay's declared luggage (what user arrives with).
    const baggageStay: Stay | null =
      from.kind === "stay"
        ? from.stay
        : to.kind === "stay"
          ? to.stay
          : null;
    if (!baggageStay) continue; // airport→airport not a real case

    const fromPref = endPrefecture(from);
    const toPref = endPrefecture(to);

    // transitionDate = user's physical move date.
    // For stay origin: checkout day. For airport origin: first-stay checkin.
    const transitionDate =
      from.kind === "stay" ? from.stay.checkOut : baggageStay.checkIn;
    const nextCheckIn =
      to.kind === "stay" ? to.stay.checkIn : transitionDate;

    if (fromPref === toPref && transitionDate === nextCheckIn) {
      legs.push({
        index: i,
        from,
        to,
        skipped: true,
        reason: "same_pref_same_day",
      });
      continue;
    }

    if (!baggageStay.baggage.some((b) => b.count > 0)) {
      legs.push({
        index: i,
        from,
        to,
        skipped: true,
        reason: "no_baggage",
      });
      continue;
    }

    const perSize: LegPriceRow[] = baggageStay.baggage
      .filter((b) => b.count > 0)
      .map((b) => {
        const r = fareLookup(fromPref, toPref, b.size);
        const y = r.yamato != null ? r.yamato * b.count : null;
        const u = r.yuu != null ? r.yuu * b.count : null;
        const cheaper: LegPriceRow["cheaper"] =
          y == null || u == null
            ? null
            : y < u
              ? "yamato"
              : y > u
                ? "yuu"
                : "tie";
        return { size: b.size, count: b.count, yamato: y, yuu: u, cheaper };
      });

    const legYamato = perSize.every((p) => p.yamato != null)
      ? perSize.reduce((a, p) => a + (p.yamato ?? 0), 0)
      : null;
    const legYuu = perSize.every((p) => p.yuu != null)
      ? perSize.reduce((a, p) => a + (p.yuu ?? 0), 0)
      : null;

    if (legYamato == null) {
      totalYamato = null;
      hasGaps = true;
    } else if (totalYamato != null) {
      totalYamato += legYamato;
    }
    if (legYuu == null) {
      totalYuu = null;
      hasGaps = true;
    } else if (totalYuu != null) {
      totalYuu += legYuu;
    }

    // shipDate:
    // - from stay: resolveShipDate (same-day / 前日投單 / fallback).
    // - from airport: user ships on arrival day (proxied by first-stay checkin
    //   since we don't know the flight time yet).
    let shipDate: string;
    let usedDayBefore = false;
    let dayBeforeFallback = false;
    if (from.kind === "stay") {
      const r = resolveShipDate(from.stay);
      shipDate = r.shipDate;
      usedDayBefore = r.usedDayBefore;
      dayBeforeFallback = r.fallbackApplied;
    } else {
      shipDate = baggageStay.checkIn;
    }

    legs.push({
      index: i,
      from,
      to,
      shipDate,
      arriveDate: addDays(shipDate, 1),
      usedDayBefore,
      dayBeforeFallback,
      perSize,
      totals: { yamato: legYamato, yuu: legYuu },
      skipped: false,
    });
  }

  return {
    legs,
    totals: { yamato: totalYamato, yuu: totalYuu },
    hasGaps,
  };
}
