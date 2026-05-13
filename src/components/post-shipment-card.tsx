"use client";

import { useMemo, useState } from "react";

interface Milestone {
  dayFrom: number;
  dayTo: number;
  icon: string;
  label: string;
  body: string;
}

interface ServicePlan {
  key: string;
  label: string;
  kind: "domestic" | "to-taiwan";
  trackUrl: { label: string; href: string }[];
  milestones: Milestone[];
}

const PLANS: ServicePlan[] = [
  {
    key: "yamato-domestic",
    label: "Yamato 宅急便(境內 · 翌日配送)",
    kind: "domestic",
    trackUrl: [
      {
        label: "黒猫ヤマト 荷物問合せ",
        href: "https://toi.kuronekoyamato.co.jp/cgi-bin/tneko",
      },
    ],
    milestones: [
      {
        dayFrom: 0,
        dayTo: 0,
        icon: "📮",
        label: "寄出",
        body: "櫃台 / 営業所 / ドライバー 收件,系統當天入庫。",
      },
      {
        dayFrom: 1,
        dayTo: 1,
        icon: "🚛",
        label: "翌日送達",
        body: "基本規則:當日 17:00 前收件 → 翌日指定時段(午前/14-16/16-18/18-20/20-21)送達。北海道/沖繩再 +1 天。",
      },
    ],
  },
  {
    key: "yuu-domestic",
    label: "ゆうパック(境內)",
    kind: "domestic",
    trackUrl: [
      {
        label: "日本郵便 追跡サービス",
        href: "https://trackings.post.japanpost.jp/services/srv/search/",
      },
    ],
    milestones: [
      {
        dayFrom: 0,
        dayTo: 0,
        icon: "📮",
        label: "寄出",
        body: "郵便局窗口收件,系統當天登錄「引受」。",
      },
      {
        dayFrom: 1,
        dayTo: 2,
        icon: "🚛",
        label: "送達",
        body: "本州:翌日 / 北海道・沖縄・離島:翌々日。沒指定時段預設 9:00-21:00 內。",
      },
    ],
  },
  {
    key: "ems",
    label: "EMS 國際快捷(到台灣)",
    kind: "to-taiwan",
    trackUrl: [
      {
        label: "日本郵便 EMS 追跡",
        href: "https://trackings.post.japanpost.jp/services/srv/search/?locale=ja",
      },
      {
        label: "中華郵政 國際郵件查詢",
        href: "https://postserv.post.gov.tw/pstmail/main_mail.html",
      },
    ],
    milestones: [
      {
        dayFrom: 0,
        dayTo: 0,
        icon: "📮",
        label: "日本投函",
        body: "郵便局 EMS 窗口收件,系統登錄「引受」。",
      },
      {
        dayFrom: 1,
        dayTo: 1,
        icon: "✈️",
        label: "離境日本",
        body: "通常當晚或翌日凌晨班機從成田/關西/福岡出。",
      },
      {
        dayFrom: 2,
        dayTo: 2,
        icon: "🛬",
        label: "抵達台灣",
        body: "桃園國際郵件中心分類,台北關進口通關。",
      },
      {
        dayFrom: 2,
        dayTo: 3,
        icon: "📦",
        label: "派送完成",
        body: "中華郵政派送到府。離島(澎金馬)+1-2 天。",
      },
    ],
  },
  {
    key: "air-intl",
    label: "航空小包(到台灣)",
    kind: "to-taiwan",
    trackUrl: [
      {
        label: "日本郵便 追跡",
        href: "https://trackings.post.japanpost.jp/services/srv/search/?locale=ja",
      },
      {
        label: "中華郵政 國際郵件查詢",
        href: "https://postserv.post.gov.tw/pstmail/main_mail.html",
      },
    ],
    milestones: [
      {
        dayFrom: 0,
        dayTo: 0,
        icon: "📮",
        label: "日本投函",
        body: "郵便局窗口收件,「引受」登錄。",
      },
      {
        dayFrom: 2,
        dayTo: 3,
        icon: "✈️",
        label: "離境日本",
        body: "空運貨艙,需等 slot,比 EMS 晚 1-2 天。",
      },
      {
        dayFrom: 3,
        dayTo: 5,
        icon: "🛬",
        label: "抵達台灣",
        body: "桃園國際郵件中心分類 + 通關。",
      },
      {
        dayFrom: 4,
        dayTo: 6,
        icon: "📦",
        label: "派送完成",
        body: "中華郵政派送到府。",
      },
    ],
  },
  {
    key: "sea-intl",
    label: "船便(SAL / 水陸)到台灣",
    kind: "to-taiwan",
    trackUrl: [
      {
        label: "日本郵便 追跡",
        href: "https://trackings.post.japanpost.jp/services/srv/search/?locale=ja",
      },
    ],
    milestones: [
      {
        dayFrom: 0,
        dayTo: 0,
        icon: "📮",
        label: "日本投函",
        body: "郵便局窗口收件。",
      },
      {
        dayFrom: 5,
        dayTo: 7,
        icon: "⛴",
        label: "離境日本",
        body: "下一班國際航班(每週 1-2 班)。",
      },
      {
        dayFrom: 14,
        dayTo: 21,
        icon: "📦",
        label: "派送完成",
        body: "抵港後清關 → 中華郵政派送。海象不穩定可能再 +3-7 天。",
      },
    ],
  },
  {
    key: "yamato-intl",
    label: "Yamato 国際宅急便(到台灣)",
    kind: "to-taiwan",
    trackUrl: [
      {
        label: "黒猫ヤマト 荷物問合せ",
        href: "https://toi.kuronekoyamato.co.jp/cgi-bin/tneko",
      },
      {
        label: "台灣雅瑪多 台灣端查詢",
        href: "https://www.t-cat.com.tw/Inquire/Trace.aspx",
      },
    ],
    milestones: [
      {
        dayFrom: 0,
        dayTo: 0,
        icon: "📮",
        label: "日本收件",
        body: "Yamato 営業所 / 機場櫃台,當天入庫。",
      },
      {
        dayFrom: 1,
        dayTo: 2,
        icon: "✈️",
        label: "離境日本",
        body: "台灣雅瑪多對接航班(成田 / 關西 / 福岡 → 桃園)。",
      },
      {
        dayFrom: 2,
        dayTo: 3,
        icon: "🛬",
        label: "抵達台灣",
        body: "台灣雅瑪多進口通關(EZ WAY 事前委任完成才放行)。",
      },
      {
        dayFrom: 3,
        dayTo: 4,
        icon: "📦",
        label: "派送完成",
        body: "台北 / 新北 / 桃園 / 台中 / 台南 / 高雄 到府。偏遠 +1 天。",
      },
    ],
  },
];

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function formatMd(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}

function weekdayZh(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return ["日", "一", "二", "三", "四", "五", "六"][dt.getDay()];
}

type Status = "past" | "today" | "future";

function status(today: string, dayFrom: number, dayTo: number, shipped: string): Status {
  const from = addDays(shipped, dayFrom);
  const to = addDays(shipped, dayTo);
  if (today > to) return "past";
  if (today >= from) return "today";
  return "future";
}

export function PostShipmentCard() {
  const defaultDate = useMemo(() => todayIso(), []);
  const [planKey, setPlanKey] = useState<string>(PLANS[0].key);
  const [shippedAt, setShippedAt] = useState<string>(defaultDate);

  const plan = PLANS.find((p) => p.key === planKey) ?? PLANS[0];
  const today = todayIso();

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          📨 寄出後安心卡
        </h3>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
          已經寄出、每天刷追蹤頁也沒變?填服務 + 寄件日期 → 看預期時序。時間沒到就別擔心。
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            服務
          </span>
          <select
            value={planKey}
            onChange={(e) => setPlanKey(e.target.value)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          >
            <optgroup label="境內日本">
              {PLANS.filter((p) => p.kind === "domestic").map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="寄回台灣">
              {PLANS.filter((p) => p.kind === "to-taiwan").map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            寄件日期(D+0)
          </span>
          <input
            type="date"
            value={shippedAt}
            onChange={(e) => setShippedAt(e.target.value)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </label>
      </div>

      <ol className="mt-5 relative border-l border-zinc-200 dark:border-zinc-800 ml-2">
        {plan.milestones.map((m, idx) => {
          const s = status(today, m.dayFrom, m.dayTo, shippedAt);
          const dateFrom = addDays(shippedAt, m.dayFrom);
          const dateTo = addDays(shippedAt, m.dayTo);
          const dayLabel =
            m.dayFrom === m.dayTo ? `D+${m.dayFrom}` : `D+${m.dayFrom}~${m.dayTo}`;
          const dateLabel =
            m.dayFrom === m.dayTo
              ? `${formatMd(dateFrom)}(${weekdayZh(dateFrom)})`
              : `${formatMd(dateFrom)}~${formatMd(dateTo)}`;

          const dotCls =
            s === "past"
              ? "bg-emerald-500"
              : s === "today"
                ? "bg-blue-500 ring-4 ring-blue-200 dark:ring-blue-900"
                : "bg-zinc-300 dark:bg-zinc-700";
          const textCls =
            s === "future"
              ? "text-zinc-500 dark:text-zinc-500"
              : "text-zinc-900 dark:text-zinc-50";
          const statusBadge =
            s === "past"
              ? "✅ 已過"
              : s === "today"
                ? "🔵 進行中"
                : "⏳ 未到";

          return (
            <li key={idx} className="ml-4 pb-5 last:pb-0">
              <span
                className={`absolute -left-[7px] w-3.5 h-3.5 rounded-full ${dotCls}`}
                aria-hidden
              />
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`text-sm font-semibold ${textCls}`}>
                  {m.icon} {m.label}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                  {dayLabel} · {dateLabel}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
                  {statusBadge}
                </span>
              </div>
              <p className={`mt-1 text-[11px] leading-relaxed ${textCls}`}>
                {m.body}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-3">
        <div className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
          🔗 查實際狀態
        </div>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {plan.trackUrl.map((u) => (
            <a
              key={u.href}
              href={u.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {u.label} →
            </a>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[10px] text-zinc-400 dark:text-zinc-600 leading-relaxed">
        時序為主要都市(東京 / 大阪 / 台北圈)基準。颱風 / 寒流 / 海關塞車 / 連假可能延誤 1-3 天;離島(石垣 / 澎金馬)再 +1-2 天。系統沒更新不代表卡關,可能只是還沒掃到下一站。
      </p>
    </div>
  );
}
