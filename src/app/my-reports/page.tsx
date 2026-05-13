import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { listMyReports, type MyReport } from "@/lib/location-reports";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "我的回報 · JPLuggageGo",
  description: "查看自己提交過的所有 location reports",
  robots: { index: false, follow: false },
};

// 使用者自查頁。LINE 登入後列出自己的 location_reports。
// Sprint 8 擴充 F:read-only(改/刪 留下次)。
export default async function MyReportsPage() {
  const session = await getSession();
  if (!session) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-black py-20 px-6 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          請先 LINE 登入才能看到你的回報紀錄
        </p>
        <Link
          href="/api/auth/line/start?return=/my-reports"
          className="mt-4 inline-flex rounded-lg bg-[#06C755] text-white px-4 py-2 text-sm font-semibold"
        >
          LINE 登入
        </Link>
      </main>
    );
  }

  const reports = await listMyReports(session.userId, 100);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← HOME
        </Link>

        <h1 className="mt-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          我的回報紀錄
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          你提交的 ✓ 寄成功 / ⚠️ 被拒 / 📝 資料錯。最近 100 筆。
        </p>

        {reports.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-sm text-zinc-500">還沒有回報過任何資料</p>
            <Link
              href="/quote"
              className="mt-4 inline-flex rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              去 /quote 試算 →
            </Link>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
            {reports.map((r) => (
              <ReportRow key={r.id} report={r} />
            ))}
          </ul>
        )}

        <p className="mt-8 text-[10px] text-zinc-400 leading-relaxed">
          ※ 隱私:本系統不存使用者顯示名稱,只用 LINE userId 做識別與防刷。
          每 7 天上限 5 筆。同一 entity × 同一 type 會覆寫,不重複計算。
        </p>
      </div>
    </main>
  );
}

function ReportRow({ report }: { report: MyReport }) {
  const typeMeta = (() => {
    if (report.report_type === "success")
      return {
        icon: "✓",
        label: "寄成功 / 我去過",
        cls: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
      };
    if (report.report_type === "blocked")
      return {
        icon: "⚠️",
        label: "被拒 / 現場不符",
        cls: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900",
      };
    return {
      icon: "📝",
      label: "資料錯",
      cls: "bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-900",
    };
  })();

  const statusBadge = (() => {
    if (report.report_type !== "update") return null;
    const s = report.update_status;
    if (s === "applied")
      return {
        label: "已套用",
        cls: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200",
      };
    if (s === "rejected")
      return {
        label: "已拒絕",
        cls: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200",
      };
    return {
      label: "待審核",
      cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
    };
  })();

  // entity_id 看得懂:hotel/japan_entry 直接顯示,airport 拆 IATA + 簡短名
  const entityIdHint = describeEntityId(report.entity_type, report.entity_id);
  const detail = describePayload(
    report.report_type,
    report.payload as Record<string, unknown>,
  );

  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${typeMeta.cls}`}>
          {typeMeta.icon} {typeMeta.label}
        </span>
        {statusBadge && (
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${statusBadge.cls}`}>
            {statusBadge.label}
          </span>
        )}
        <span className="text-[10px] text-zinc-500">
          {entityTypeLabel(report.entity_type)}
        </span>
        <span className="ml-auto text-[10px] text-zinc-500">
          {formatDate(report.reported_at)}
        </span>
      </div>
      <div className="mt-1.5 text-sm text-zinc-900 dark:text-zinc-50">
        {entityIdHint}
      </div>
      {detail && (
        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          {detail}
        </div>
      )}
      {report.note && (
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 italic">
          備註:{report.note}
        </p>
      )}
    </li>
  );
}

function entityTypeLabel(t: string): string {
  switch (t) {
    case "yamato_branch":
      return "Yamato 營業所";
    case "yuu_post_office":
      return "郵便局";
    case "yamato_airport":
      return "Yamato 機場櫃台";
    case "yuu_pack_airport":
      return "ゆうパック 機場櫃台";
    case "hotel_chain":
      return "飯店連鎖";
    case "japan_entry":
      return "日本大小事";
    default:
      return t;
  }
}

// entity_id 顯示成人讀得懂的形式
function describeEntityId(type: string, id: string): string {
  if (type === "japan_entry") return id; // slug 已可讀
  if (type === "yamato_airport" || type === "yuu_pack_airport") {
    // 格式:IATA:service_or_terminal:name 或 IATA:name
    return id;
  }
  return id;
}

function describePayload(
  type: string,
  payload: Record<string, unknown>,
): string | null {
  if (type === "success") {
    const parts: string[] = [];
    if (typeof payload.size === "string") parts.push(`size ${payload.size}`);
    if (typeof payload.cost_yen === "number")
      parts.push(`¥${payload.cost_yen.toLocaleString()}`);
    if (typeof payload.wait_min === "number")
      parts.push(`${payload.wait_min}分等候`);
    return parts.length > 0 ? parts.join(" · ") : null;
  }
  if (type === "blocked") {
    const reason = (payload as { reject_reason?: string }).reject_reason;
    return reason ? `原因:${reasonLabel(reason)}` : null;
  }
  if (type === "update") {
    const field = (payload as { field?: string; new_value?: string }).field;
    const newValue = (payload as { field?: string; new_value?: string })
      .new_value;
    if (field && newValue) {
      return `${fieldLabel(field)} → ${newValue}`;
    }
  }
  return null;
}

function reasonLabel(code: string): string {
  switch (code) {
    case "refuse_oversize": return "尺寸超限";
    case "refuse_overweight": return "重量超限";
    case "refuse_content": return "內容物拒收";
    case "closed": return "休業";
    case "queue_too_long": return "排隊過長";
    case "machine_broken": return "機器故障";
    case "staff_refuse": return "店員拒收";
    case "info_wrong": return "資訊不符";
    case "closed_today": return "臨時休";
    case "construction": return "整修中";
    case "crowded_too_long": return "排隊過長";
    case "entry_restricted": return "入場限制";
    default: return code;
  }
}

function fieldLabel(f: string): string {
  switch (f) {
    case "address": return "地址";
    case "phone": return "電話";
    case "hours": return "時段";
    case "closed_permanently": return "永久歇業";
    case "moved": return "搬遷";
    default: return f;
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}
