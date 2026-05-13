import Link from "next/link";
import { t, tf } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import {
  GUIDE_SIZES,
  type GuideFareTable,
} from "@/lib/guide-fare-samples";

export function FareTable({
  lang,
  table,
}: {
  lang: Lang;
  table: GuideFareTable;
}) {
  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <table className="w-full text-xs">
          <thead className="text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="text-left font-normal px-4 py-3">
                {t(lang, "guide.shipping.fare.col.route")}
              </th>
              {GUIDE_SIZES.map((s) => (
                <th
                  key={s.code}
                  className="text-right font-normal px-3 py-3 tabular-nums"
                >
                  {s.label}
                  <span className="ml-1 text-zinc-400 text-[10px]">
                    {s.hint}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr
                key={r.label}
                className="border-t border-zinc-100 dark:border-zinc-800"
              >
                <td className="px-4 py-2.5 text-zinc-800 dark:text-zinc-200">
                  {r.label}
                </td>
                {GUIDE_SIZES.map((s) => {
                  const p = r.prices[s.code];
                  return (
                    <td
                      key={s.code}
                      className="text-right px-3 py-2.5 tabular-nums text-zinc-700 dark:text-zinc-300"
                    >
                      {p != null ? `¥${p.toLocaleString()}` : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-zinc-400 leading-relaxed">
        {table.latestScrapedAt
          ? tf(lang, "guide.shipping.fare.updated", {
              date: table.latestScrapedAt.slice(0, 10),
            })
          : t(lang, "guide.shipping.fare.no_data")}
        {" · "}
        {t(lang, "guide.shipping.fare.source")}
      </p>
      <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {t(lang, "guide.shipping.fare.note")}
      </p>
      <Link
        href="/quote"
        className="mt-3 inline-flex items-center text-xs font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
      >
        {t(lang, "guide.shipping.fare.check_yours")} →
      </Link>
    </div>
  );
}
