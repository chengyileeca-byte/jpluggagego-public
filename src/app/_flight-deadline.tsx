"use client";

import { useState } from "react";
import { t, tf, type Lang } from "@/lib/i18n";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function formatMd(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function weekdayJp(d: Date): string {
  return ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
}

function todayAtMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function subtractDays(iso: string, days: number): Date {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() - days);
  return d;
}

function daysUntil(iso: string): number {
  const flight = new Date(`${iso}T00:00:00`);
  return Math.round((flight.getTime() - todayAtMidnight().getTime()) / MS_PER_DAY);
}

export function FlightDeadline({ lang }: { lang: Lang }) {
  const [flight, setFlight] = useState("");
  const [remote, setRemote] = useState(false);

  const hasDate = /^\d{4}-\d{2}-\d{2}$/.test(flight);
  const days = hasDate ? daysUntil(flight) : null;
  const recommendOffset = remote ? 3 : 2;
  const latestOffset = remote ? 2 : 1;
  const recommend = hasDate ? subtractDays(flight, recommendOffset) : null;
  const latest = hasDate ? subtractDays(flight, latestOffset) : null;
  const latestDaysOut = days == null ? null : days - latestOffset;

  const urgency =
    latestDaysOut == null
      ? null
      : latestDaysOut < 0
        ? "past"
        : latestDaysOut <= 1
          ? "red"
          : latestDaysOut <= 3
            ? "amber"
            : "green";

  const urgencyClass =
    urgency === "past"
      ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
      : urgency === "red"
        ? "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200 border-red-200 dark:border-red-900"
        : urgency === "amber"
          ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 border-amber-200 dark:border-amber-900"
          : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900";

  const urgencyLabel = urgency
    ? t(lang, `flight.urgency.${urgency}`)
    : "";

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {t(lang, "flight.title")}
        </h2>
        <span className="text-xs text-zinc-500">
          {t(lang, "flight.disclaimer")}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="flex flex-col gap-1.5 text-xs text-zinc-500">
          <span>{t(lang, "flight.flight_date")}</span>
          <input
            type="date"
            value={flight}
            onChange={(e) => setFlight(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 sm:pb-2">
          <input
            type="checkbox"
            checked={remote}
            onChange={(e) => setRemote(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300"
          />
          {t(lang, "flight.remote_check")}
        </label>
      </div>

      {hasDate && recommend && latest && days != null && (
        <div className={`mt-4 rounded-lg border px-4 py-3 ${urgencyClass}`}>
          <div className="text-sm font-semibold">{urgencyLabel}</div>
          <div className="mt-2 grid gap-1 text-sm">
            <div>
              {t(lang, "flight.recommend")}
              <strong>{formatMd(recommend)} ({weekdayJp(recommend)})</strong>
              {days - recommendOffset >= 0 && (
                <span className="ml-2 opacity-70">
                  · {tf(lang, "flight.days_until", { n: days - recommendOffset })}
                </span>
              )}
            </div>
            <div>
              {t(lang, "flight.latest")}
              <strong>{formatMd(latest)} ({weekdayJp(latest)})</strong>
              <span className="ml-2 opacity-70">{t(lang, "flight.pickup_cutoff")}</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed opacity-80">
            {remote
              ? t(lang, "flight.remote_hint")
              : t(lang, "flight.mainland_hint")}
            {t(lang, "flight.hotel_tail")}
          </p>
        </div>
      )}

      {!hasDate && (
        <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
          {t(lang, "flight.no_date_hint")}
        </p>
      )}
    </div>
  );
}
