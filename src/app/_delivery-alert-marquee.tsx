// 主頁 marquee — 配送遅延 alerts(active が無ければ render しない)。
//
// CSS-only horizontal scrolling、severity で配色:
//   info    → blue/sky
//   warning → amber/yellow
//   danger  → rose/red
//
// 単一 alert なら静止表示、複数なら左へ scroll。

import {
  getActiveDeliveryAlerts,
  type DeliveryAlert,
} from "@/lib/delivery-alerts";

const CARRIER_LABEL: Record<string, string> = {
  yamato: "Yamato",
  yuu: "ゆうパック",
};

const SEVERITY_STYLES: Record<
  DeliveryAlert["severity"],
  { bg: string; border: string; text: string; icon: string }
> = {
  info: {
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-900/60",
    text: "text-sky-900 dark:text-sky-200",
    icon: "ℹ︎",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-900/60",
    text: "text-amber-900 dark:text-amber-200",
    icon: "⚠︎",
  },
  danger: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-900/60",
    text: "text-rose-900 dark:text-rose-200",
    icon: "✕",
  },
};

function formatAlertText(a: DeliveryAlert): string {
  const carriers = a.carriers
    .map((c) => CARRIER_LABEL[c] ?? c)
    .join(" / ");
  const carrierPart = carriers ? `${carriers}・` : "";
  return `${carrierPart}${a.regions_zh} 因 ${a.weather_zh} 可能延誤`;
}

export async function DeliveryAlertMarquee() {
  const alerts = await getActiveDeliveryAlerts();
  if (alerts.length === 0) return null;

  // 主 severity(最も高い)で全体の色を決定
  const top = alerts[0];
  const styles = SEVERITY_STYLES[top.severity];

  // 単一なら静止、複数なら scroll
  const animate = alerts.length > 1;

  const items = alerts.map((a) => {
    const s = SEVERITY_STYLES[a.severity];
    return (
      <span key={a.id} className="inline-flex items-center gap-2 px-6">
        <span className={`text-xs ${s.text}`} aria-hidden>
          {s.icon}
        </span>
        <span className={`text-sm ${s.text}`}>{formatAlertText(a)}</span>
        {a.source_url && (
          <a
            href={a.source_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`text-xs underline opacity-70 hover:opacity-100 ${s.text}`}
          >
            {a.source_label ?? "出典"}
          </a>
        )}
      </span>
    );
  });

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative overflow-hidden border-y ${styles.bg} ${styles.border}`}
    >
      <div
        className={`whitespace-nowrap py-2 ${animate ? "animate-marquee" : ""}`}
      >
        {/* 一輪目 */}
        {items}
        {/* 二輪目(seamless loop 用) */}
        {animate && items}
      </div>
    </div>
  );
}
