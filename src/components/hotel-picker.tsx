"use client";

import { useEffect, useMemo, useState } from "react";

export interface HotelSuggestion {
  rakuten_hotel_no: number;
  name_jp: string;
  prefecture: string | null;
  address1: string | null;
  address2: string | null;
  lat: number | null;
  lon: number | null;
  brand: string | null;
  brand_can_send: string | null;
  rakuten_url: string | null;
}

// Controlled hotel autocomplete backed by Rakuten Travel data in Supabase.
// Uses native <datalist>. When the user picks an option, the input value
// exactly matches `hotel.name_jp` — we detect that in onChange and fire
// `onPick` so callers can write full address / coords into sibling fields.
export function HotelPicker({
  id,
  value,
  onChange,
  onPick,
  prefecture,
  placeholder,
  className,
  required,
  submitName,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onPick?: (h: HotelSuggestion) => void;
  prefecture?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  /** If set, also render a hidden input with this `name` carrying the
   * resolved address (for plain HTML form submission). */
  submitName?: string;
}) {
  const [hotels, setHotels] = useState<HotelSuggestion[]>([]);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) return;
    let cancelled = false;
    const handle = setTimeout(async () => {
      const params = new URLSearchParams({ q, limit: "20" });
      if (prefecture) params.set("pref", prefecture);
      try {
        const res = await fetch(`/api/hotels?${params.toString()}`);
        if (!res.ok) return;
        const data = (await res.json()) as { hotels?: HotelSuggestion[] };
        if (!cancelled) setHotels(data.hotels ?? []);
      } catch {
        // Network hiccup — swallow; user can retype to retry.
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [value, prefecture]);

  const exactMatch = useMemo(
    () => hotels.find((h) => h.name_jp === value),
    [hotels, value],
  );
  const submitValue = exactMatch
    ? [exactMatch.address1, exactMatch.address2].filter(Boolean).join("") ||
      value
    : value;
  const displayHotels = value.trim().length < 2 ? [] : hotels;

  return (
    <>
      <input
        type="text"
        list={id}
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v);
          const match = hotels.find((h) => h.name_jp === v);
          if (match) onPick?.(match);
        }}
        placeholder={placeholder}
        className={className}
        required={required}
        autoComplete="off"
      />
      {submitName && (
        <input type="hidden" name={submitName} value={submitValue} />
      )}
      <datalist id={id}>
        {displayHotels.map((h) => {
          const addr = [h.address1, h.address2].filter(Boolean).join("");
          const label = addr || h.prefecture || "";
          return (
            <option key={h.rakuten_hotel_no} value={h.name_jp}>
              {label}
            </option>
          );
        })}
      </datalist>
    </>
  );
}

// Convenience wrapper for plain HTML form fields — manages its own state so
// a parent server component can swap <input name="..."> for this in-place.
export function HotelPickerField({
  id,
  name,
  defaultValue,
  prefecture,
  placeholder,
  className,
  required,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  prefecture?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}) {
  const [v, setV] = useState(defaultValue ?? "");
  return (
    <HotelPicker
      id={id}
      value={v}
      onChange={setV}
      submitName={name}
      prefecture={prefecture}
      placeholder={placeholder}
      className={className}
      required={required}
    />
  );
}
