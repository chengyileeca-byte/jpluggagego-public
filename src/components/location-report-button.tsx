import Link from "next/link";
import type { EntityType } from "@/lib/location-reports";

// 旧 LINE-auth + Supabase 経由の在席/封鎖報告 UI を、/feedback への
// 静的リンクに置換。entityType に応じて kind を pre-select、
// entityLabel から prefill_title を組み立て、from で source page を保持する。
//
// loggedIn prop は無視(/feedback はログイン不要)。
//
// Server-component で OK — Link 一つだけ。
function isTourismEntity(entityType: EntityType): boolean {
  return entityType === "japan_entry";
}

export function LocationReportButton({
  entityType,
  entityId: _entityId,
  entityLabel,
  loggedIn: _loggedIn,
}: {
  entityType: EntityType;
  entityId: string;
  entityLabel: string;
  loggedIn: boolean;
}) {
  const tourism = isTourismEntity(entityType);
  const kind = tourism ? "wrong-info" : "branch-update";
  const titleSuffix = tourism ? "資訊有誤" : "資訊更新";
  const params = new URLSearchParams({
    kind,
    prefill_title: `${entityLabel} ${titleSuffix}`,
  });

  return (
    <Link
      href={`/feedback?${params.toString()}`}
      className="inline-flex items-center gap-1.5 text-[11px] tracking-wide text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline decoration-dotted underline-offset-4"
    >
      <span style={{ fontFamily: "var(--font-mincho)" }}>回報</span>
      <span className="text-[9px] tracking-[0.2em] uppercase opacity-60">
        report ↗
      </span>
    </Link>
  );
}
