import Link from "next/link";

// 旧 LINE-auth + Supabase 経由の hotel chain capability 報告 form を
// /feedback への静的リンクに置換。caller の prop シグネチャは保持
// (chains/existing/labels/userName は ignored)。
//
// Server Component(form の use client は不要、Link のみ)。

type Capability = "yes" | "case-by-case" | "check";
type Field = "can_receive" | "can_send" | "pre_checkin_hold";

export interface HotelReportFormChain {
  code: string;
  name: string;
  nameJp: string;
}

export interface HotelReportFormExistingEntry {
  chain_code: string;
  field: Field;
  value: Capability;
  note: string | null;
  updated_at: string;
}

interface Labels {
  chain: string;
  chainPlaceholder: string;
  receiveQ: string;
  sendQ: string;
  precheckinQ: string;
  valueYes: string;
  valueCase: string;
  valueCheck: string;
  valueSkip: string;
  notePlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  noChange: string;
  yourCurrent: string;
  greet: string;
  logout: string;
}

export function HotelReportForm({
  chains: _chains,
  existing: _existing,
  userName: _userName,
  labels: _labels,
}: {
  chains: HotelReportFormChain[];
  existing: HotelReportFormExistingEntry[];
  userName: string;
  labels: Labels;
}) {
  const params = new URLSearchParams({
    kind: "hotel-update",
    prefill_title: "飯店行李寄送資訊回報",
  });
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <p
        className="text-base text-zinc-900 dark:text-zinc-50"
        style={{ fontFamily: "var(--font-mincho)" }}
      >
        飯店資訊更新
      </p>
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        實際入住飯店時,確認到「能否前置寄存(pre check-in hold)」、「行李寄送收/發
        capability」與我們資料不同?歡迎到投書箱回報,公開可追蹤。
      </p>
      <Link
        href={`/feedback?${params.toString()}`}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:opacity-90"
      >
        <span style={{ fontFamily: "var(--font-mincho)" }}>前往投書箱</span>
        <span className="text-[10px] tracking-[0.3em] uppercase">
          feedback ↗
        </span>
      </Link>
    </div>
  );
}
