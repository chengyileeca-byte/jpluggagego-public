"use client";

import { useState } from "react";
import { fetchStayNearby, type StayNearbyResult } from "./actions";
import { googleMapsDirectionsUrl, formatDistance } from "@/lib/map-utils";
import { t, tf, type Lang } from "@/lib/i18n";

// Collapsible panel under each /trip stay row. Button triggers a server
// action on first expand, caches the result for subsequent toggles.
//
// Only rendered when the stay has lat/lon from the Rakuten HotelPicker —
// free-form (民宿/手打地址) skips the panel to avoid a second geocode hop.
export function StayNearby({
  lat,
  lon,
  lang,
}: {
  lat: number;
  lon: number;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<StayNearbyResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !data) {
      setLoading(true);
      try {
        const r = await fetchStayNearby(lat, lon);
        setData(r);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={toggle}
        className="text-[11px] text-blue-600 dark:text-blue-300 hover:underline"
      >
        {open
          ? t(lang, "trip.stay.nearby_hide")
          : t(lang, "trip.stay.nearby_show")}
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 space-y-3">
          {loading && (
            <div className="text-[11px] text-zinc-500">
              {t(lang, "trip.stay.nearby_loading")}
            </div>
          )}
          {data && (
            <>
              <NearbyGroup
                title={t(lang, "trip.stay.nearby_yamato")}
                items={data.yamato.map((b) => ({
                  key: b.branch_code,
                  name: b.name_jp,
                  addr: b.address_jp,
                  dist: b.distance_m,
                  hours: b.hours_weekday,
                  phone: b.phone,
                  lat: b.lat,
                  lon: b.lon,
                }))}
                lang={lang}
              />
              <NearbyGroup
                title={t(lang, "trip.stay.nearby_yuu")}
                items={data.yuu.map((p) => ({
                  key: String(p.osm_id),
                  name: p.name_jp,
                  addr: p.address_jp,
                  dist: p.distance_m,
                  hours: p.opening_hours,
                  phone: p.phone,
                  lat: p.lat,
                  lon: p.lon,
                }))}
                lang={lang}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface NearbyItem {
  key: string;
  name: string;
  addr: string | null;
  dist: number;
  hours: string | null;
  phone: string | null;
  lat: number;
  lon: number;
}

function NearbyGroup({
  title,
  items,
  lang,
}: {
  title: string;
  items: NearbyItem[];
  lang: Lang;
}) {
  return (
    <div>
      <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
        {title}
      </div>
      {items.length === 0 ? (
        <div className="text-[11px] text-zinc-500">
          {t(lang, "nearby.result.empty")}
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li
              key={it.key}
              className="text-[11px] text-zinc-700 dark:text-zinc-300"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{it.name}</span>
                <span className="text-zinc-500 tabular-nums">
                  {tf(lang, "nearby.result.distance", {
                    v: formatDistance(it.dist),
                  })}
                </span>
              </div>
              {it.addr && <div className="text-zinc-500">{it.addr}</div>}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                {it.hours && (
                  <span className="text-zinc-500">
                    {tf(lang, "nearby.result.hours", { v: it.hours })}
                  </span>
                )}
                {it.phone && (
                  <a
                    href={`tel:${it.phone}`}
                    className="text-blue-600 dark:text-blue-300 hover:underline"
                  >
                    {it.phone}
                  </a>
                )}
                <a
                  href={googleMapsDirectionsUrl(it.lat, it.lon, {
                    name: it.name,
                    address: it.addr,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-300 hover:underline"
                >
                  {t(lang, "nearby.result.navigate")}
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
