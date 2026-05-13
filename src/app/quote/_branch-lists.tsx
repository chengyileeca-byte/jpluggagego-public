import {
  googleMapsDirectionsUrl,
  formatDistance,
  type NearestYamatoBranch,
  type NearestYuuPostOffice,
} from "@/lib/nearest-branch";
import { t, tf, type Lang } from "@/lib/i18n";

// Server components used by /quote 地址 mode to render a list of nearest
// Yamato branches / 郵便局 carriers.

export function YamatoList({
  branches,
  lang,
}: {
  branches: NearestYamatoBranch[];
  lang: Lang;
}) {
  if (branches.length === 0) {
    return (
      <p className="mt-2 text-sm text-zinc-500">
        {t(lang, "nearby.result.empty")}
      </p>
    );
  }
  return (
    <ul className="mt-3 grid gap-3">
      {branches.map((b) => (
        <li
          key={b.branch_code}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {b.name_jp}
            </div>
            <div className="text-xs text-zinc-500 tabular-nums">
              {tf(lang, "nearby.result.distance", {
                v: formatDistance(b.distance_m),
              })}
            </div>
          </div>
          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {b.address_jp}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            {b.hours_weekday && (
              <span>
                {tf(lang, "nearby.result.hours", { v: b.hours_weekday })}
              </span>
            )}
            {b.phone && (
              <a
                href={`tel:${b.phone}`}
                className="text-blue-600 dark:text-blue-300 hover:underline"
              >
                {b.phone}
              </a>
            )}
            <a
              href={googleMapsDirectionsUrl(b.lat, b.lon, {
                name: b.name_jp,
                address: b.address_jp,
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
  );
}

export function YuuList({
  offices,
  lang,
}: {
  offices: NearestYuuPostOffice[];
  lang: Lang;
}) {
  if (offices.length === 0) {
    return (
      <p className="mt-2 text-sm text-zinc-500">
        {t(lang, "nearby.result.empty")}
      </p>
    );
  }
  return (
    <ul className="mt-3 grid gap-3">
      {offices.map((p) => (
        <li
          key={p.osm_id}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {p.name_jp}
            </div>
            <div className="text-xs text-zinc-500 tabular-nums">
              {tf(lang, "nearby.result.distance", {
                v: formatDistance(p.distance_m),
              })}
            </div>
          </div>
          {p.address_jp && (
            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {p.address_jp}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            {p.opening_hours && <span>{p.opening_hours}</span>}
            {p.phone && (
              <a
                href={`tel:${p.phone}`}
                className="text-blue-600 dark:text-blue-300 hover:underline"
              >
                {p.phone}
              </a>
            )}
            <a
              href={googleMapsDirectionsUrl(p.lat, p.lon, {
                name: p.name_jp,
                address: p.address_jp,
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
  );
}
