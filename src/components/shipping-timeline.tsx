export interface ShippingTimelineStage {
  no: number;
  icon: string;
  title: string;
  /** 預估時間 free text:"10 分" / "翌日 16:00" / "D+2~3" 都可以 */
  duration: string;
  body: string;
  tone?: "default" | "warn" | "success";
}

export interface ShippingTimelineProps {
  scenario: "airport-counter" | "branch-office" | "hotel-forward" | "to-taiwan";
  stages: ShippingTimelineStage[];
  /** 右上角總時長徽章,如「整趟 25-35 分」 */
  totalLabel?: string;
  /** 底部補充註解(來源、服務差異、tips) */
  note?: string;
}

const TONE_STYLES = {
  default: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900",
  warn: "bg-amber-500 dark:bg-amber-400 text-white dark:text-zinc-950",
  success: "bg-emerald-500 dark:bg-emerald-400 text-white dark:text-zinc-950",
} as const;

export function ShippingTimeline({ stages, totalLabel, note }: ShippingTimelineProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            🕒 流程時間軸
          </h3>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500">
            每一步在哪、要做什麼、大概花多久。先看一遍再開始。
          </p>
        </div>
        {totalLabel && (
          <span className="shrink-0 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-1 text-[11px] font-medium">
            總計 · {totalLabel}
          </span>
        )}
      </div>

      <ol className="mt-5 space-y-0">
        {stages.map((stage, i) => {
          const isLast = i === stages.length - 1;
          const tone = stage.tone ?? "default";
          return (
            <li key={stage.no} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm ${TONE_STYLES[tone]}`}
                  aria-hidden
                >
                  {stage.icon}
                </span>
                {!isLast && (
                  <span className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800 my-1" aria-hidden />
                )}
              </div>
              <div className={`flex-1 ${isLast ? "" : "pb-5"}`}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                    {String(stage.no).padStart(2, "0")}
                  </span>
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {stage.title}
                  </h4>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    · {stage.duration}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {stage.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {note && (
        <p className="mt-4 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed border-t border-zinc-200 dark:border-zinc-800 pt-3">
          {note}
        </p>
      )}
    </div>
  );
}
