import {
  NEWCOMER_FRIENDLY,
  branchGmapsUrl,
  type CarrierBranch,
  type NewcomerFriendlyArea,
} from "@/lib/newcomer-friendly-branches";
import { LocationReportPanel } from "./location-report-panel";
import { fetchBadges, type Badge } from "@/lib/location-reports";

function branchEntityId(b: CarrierBranch): string {
  // 這些分店是 TS curation、無 DB PK。用 kind + nameJp slug 當穩定 key。
  const slug = b.nameJp.replace(/\s+/g, "-");
  return `curated:${b.kind}:${slug}`;
}
function branchEntityType(b: CarrierBranch): "yamato_branch" | "yuu_post_office" {
  return b.kind === "yuu" ? "yuu_post_office" : "yamato_branch";
}

interface Props {
  /** If set, filter to areas where prefecture matches OR nearestAirports includes the code. */
  match?: { prefecture?: string; airport?: string };
  /** Limit the number of areas shown. Default: all. */
  limit?: number;
  title?: string;
}

function filterAreas(
  areas: NewcomerFriendlyArea[],
  match?: Props["match"],
): NewcomerFriendlyArea[] {
  if (!match) return areas;
  return areas.filter((a) => {
    if (match.prefecture && a.prefecture === match.prefecture) return true;
    if (match.airport && a.nearestAirports?.includes(match.airport)) return true;
    return false;
  });
}

export async function NewcomerFriendlyPicks({ match, limit, title }: Props) {
  const filtered = filterAreas(NEWCOMER_FRIENDLY, match);
  const shown = typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  if (shown.length === 0) return null;

  // 一次 fetch 兩種 entity 的徽章。避免每張卡再戳一次 DB。
  const yamatoIds: string[] = [];
  const yuuIds: string[] = [];
  for (const area of shown) {
    for (const b of area.branches) {
      const id = branchEntityId(b);
      (b.kind === "yuu" ? yuuIds : yamatoIds).push(id);
    }
  }
  const [yamatoBadges, yuuBadges] = await Promise.all([
    fetchBadges("yamato_branch", yamatoIds),
    fetchBadges("yuu_post_office", yuuIds),
  ]);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          🌟 {title ?? "新手友善分店清單"}
        </h3>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
          大型分店 / 中央郵便局,窗口多、英語對應、國際業務熟。第一次寄的話優先選這裡,
          減少被退件或需要二次跑的機率。
        </p>
      </div>

      <ul className="mt-4 space-y-4">
        {shown.map((area) => (
          <li key={area.key}>
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wide">
              📍 {area.label}
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {area.branches.map((b, i) => {
                const id = branchEntityId(b);
                const badge =
                  (b.kind === "yuu" ? yuuBadges : yamatoBadges).get(id) ?? null;
                return <BranchCard key={i} branch={b} badge={badge} />;
              })}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[10px] text-zinc-400 dark:text-zinc-600 leading-relaxed">
        清單為人工 curation,營業時間與位置以 Google Maps 實時為準(連結已預設搜索該分店)。
        若遇到窗口關閉 / 搬遷,請回報給我們。
      </p>
    </div>
  );
}

function BranchCard({ branch, badge }: { branch: CarrierBranch; badge: Badge | null }) {
  const carrierLabel =
    branch.kind === "yuu" ? "郵便局" : "ヤマト運輸";
  const tagCls =
    branch.kind === "yuu"
      ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200"
      : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200";

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
      <div className="flex items-start gap-2 flex-wrap">
        <span
          className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${tagCls}`}
        >
          {carrierLabel}
        </span>
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
          {branch.nameJp}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
        {branch.addressJp}
      </p>
      <div className="mt-2 text-[10px] font-mono text-zinc-500 dark:text-zinc-500">
        平日 {branch.hoursWeekday} · 週末 {branch.hoursWeekend}
      </div>
      <ul className="mt-2 space-y-0.5">
        {branch.whyGood.map((w, i) => (
          <li
            key={i}
            className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed"
          >
            · {w}
          </li>
        ))}
      </ul>
      <a
        href={branchGmapsUrl(branch)}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 underline"
      >
        📍 Google Maps →
      </a>
      <div className="mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-2">
        <LocationReportPanel
          entityType={branchEntityType(branch)}
          entityId={branchEntityId(branch)}
          entityLabel={branch.nameJp}
          badge={badge}
          compact
        />
      </div>
    </div>
  );
}
