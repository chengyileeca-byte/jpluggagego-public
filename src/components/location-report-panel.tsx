import { getSession } from "@/lib/session";
import {
  fetchBadges,
  isTourismEntity,
  type Badge,
  type EntityType,
} from "@/lib/location-reports";
import { LocationReportButton } from "./location-report-button";

// 顯示徽章 + 開啟回報 modal 的按鈕。Server Component。
// - 單次使用傳 entity_id 即可(內部 fetch 單筆 badge)
// - 批次頁面(如 /quote 結果) 請用 <LocationReportBatch>,預先 fetch 所有 badge 再傳入
//
// 匿名模式:session 為 null 時,顯示「LINE 登入後即可回報」CTA。

export async function LocationReportPanel({
  entityType,
  entityId,
  entityLabel,
  badge,
  compact = false,
}: {
  entityType: EntityType;
  entityId: string;
  entityLabel: string; // 顯示在 modal 標題 e.g. "成田空港第1 Yamato 櫃台"
  badge?: Badge | null;
  compact?: boolean;
}) {
  const session = await getSession();
  const resolvedBadge =
    badge !== undefined
      ? badge
      : (await fetchBadges(entityType, [entityId])).get(entityId) ?? null;

  const tourism = isTourismEntity(entityType);

  return (
    <div className={compact ? "" : "mt-3"}>
      <BadgeRow badge={resolvedBadge} compact={compact} tourism={tourism} />
      <div className="mt-2">
        <LocationReportButton
          entityType={entityType}
          entityId={entityId}
          entityLabel={entityLabel}
          loggedIn={!!session}
        />
      </div>
    </div>
  );
}

function BadgeRow({
  badge,
  compact,
  tourism,
}: {
  badge: Badge | null;
  compact: boolean;
  tourism: boolean;
}) {
  if (!badge || (badge.success_12mo === 0 && badge.blocked_12mo === 0)) {
    return (
      <p className={`${compact ? "text-[10px]" : "text-[11px]"} text-zinc-400 dark:text-zinc-600 italic`}>
        還沒有人回報
      </p>
    );
  }
  const fresh = badge.last_success_at
    ? formatDate(badge.last_success_at)
    : null;
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {badge.success_12mo > 0 && (
        <span
          className={`inline-flex items-center gap-1 rounded-md border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 text-[10px] font-medium`}
        >
          ✓ {badge.success_12mo} {tourism ? "人去過驗證" : "人寄成功"}
          {fresh && (
            <span className="opacity-60">· 最近 {fresh}</span>
          )}
        </span>
      )}
      {badge.blocked_12mo > 0 && (
        <span
          className={`inline-flex items-center gap-1 rounded-md border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 text-[10px] font-medium`}
        >
          ⚠️ {badge.blocked_12mo} {tourism ? "人回報資訊不符" : "人回報拒收"}
          {badge.top_reject_reasons && badge.top_reject_reasons.length > 0 && (
            <span className="opacity-70">
              · {topReasons(badge.top_reject_reasons, 2).map(reasonLabel).join(" / ")}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

// view 回傳的是 blocked 的全部 reject_reason(含重複),在這裡做頻率排序後取 top N。
function topReasons(reasons: string[], n: number): string[] {
  const counts = new Map<string, number>();
  for (const r of reasons) counts.set(r, (counts.get(r) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([r]) => r);
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function reasonLabel(code: string): string {
  switch (code) {
    // 快遞
    case "refuse_oversize":
      return "尺寸超限";
    case "refuse_overweight":
      return "重量超限";
    case "refuse_content":
      return "內容物拒收";
    case "closed":
      return "休業";
    case "queue_too_long":
      return "排隊過長";
    case "machine_broken":
      return "機器故障";
    case "staff_refuse":
      return "店員拒收";
    // 景點
    case "info_wrong":
      return "資訊不符";
    case "closed_today":
      return "臨時休";
    case "construction":
      return "整修中";
    case "crowded_too_long":
      return "排隊過長";
    case "entry_restricted":
      return "入場限制";
    default:
      return "其他";
  }
}
