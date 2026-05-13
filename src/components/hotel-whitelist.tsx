import {
  HOTEL_CHAIN_POLICIES,
  type HotelChainPolicy,
} from "@/lib/hotel-policies";
import { fetchBadges, type Badge as ReportBadge } from "@/lib/location-reports";
import { LocationReportPanel } from "./location-report-panel";

interface CaveatGroup {
  title: string;
  intro: string;
  items: { label: string; note: string }[];
}

const CAVEAT_GROUPS: CaveatGroup[] = [
  {
    title: "⚠️ 通常要先問 · 不保證收",
    intro: "以下類型個別店差異大,check-in 前建議 email / 電話確認。",
    items: [
      {
        label: "京都町家型民宿 / 無人型民泊",
        note: "櫃台時段短或無常駐人員,宅配需在指定時段當面交付 → 多數無法代收代寄。",
      },
      {
        label: "Airbnb 民泊 · 個人オーナー",
        note: "管家多半只管 check-in / check-out,日常代收代寄視個人意願,不穩定。",
      },
      {
        label: "傳統旅館(老舗旅館 / 温泉宿)",
        note: "設有帳場(櫃台)但只在日間營業,代寄較嚴格。高級旅館多半可,中小型看店。",
      },
      {
        label: "カプセルホテル(膠囊旅館)",
        note: "空間僅容人,沒有行李暫存位;通常拒收大件宅配。",
      },
      {
        label: "ゲストハウス / バックパッカーズ",
        note: "櫃台時段短 + 無保管空間;視地區與經營者決定。",
      },
    ],
  },
];

function cap(c: HotelChainPolicy["canReceive"]): {
  label: string;
  cls: string;
} {
  if (c === "yes") {
    return {
      label: "OK",
      cls: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800",
    };
  }
  if (c === "case-by-case") {
    return {
      label: "看店",
      cls: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800",
    };
  }
  return {
    label: "要問",
    cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700",
  };
}

// async server component:批次抓所有 chain badges 一次,避免每張 PolicyCard
// 各自 fetch 造成 N+1。entity_id = policy.code(hotel_chain 是 curated 字串,
// auto-apply 不會觸發,只標 applied 留 audit trail)。
export async function HotelWhitelist() {
  const codes = HOTEL_CHAIN_POLICIES.map((p) => p.code);
  const badges = await fetchBadges("hotel_chain", codes);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          🏨 飯店代寄白名單
        </h3>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
          以下連鎖依官方 FAQ / 總部政策,前臺常態代收與代寄。個別分店可能不同,遇到店員說「できません」可引用官網連結 push back。
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {HOTEL_CHAIN_POLICIES.map((p) => (
          <PolicyCard
            key={p.code}
            policy={p}
            badge={badges.get(p.code) ?? null}
          />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {CAVEAT_GROUPS.map((g) => (
          <div
            key={g.title}
            className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4"
          >
            <div className="text-xs font-semibold text-amber-900 dark:text-amber-200">
              {g.title}
            </div>
            <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              {g.intro}
            </p>
            <ul className="mt-2 space-y-1.5">
              {g.items.map((it, i) => (
                <li
                  key={i}
                  className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed"
                >
                  <span className="font-medium">{it.label}</span>
                  <span className="opacity-80"> · {it.note}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[10px] text-zinc-400 dark:text-zinc-600 leading-relaxed">
        資料為連鎖總部一般政策(2026-04 時點 FAQ 抽樣),不即時反映分店變動。OK = 官方明示可代收代寄;看店 = 部分分店 OK;要問 = 連鎖層級未統一,必須問個別分店。
      </p>
    </div>
  );
}

// async because LocationReportPanel 是 server component。
async function PolicyCard({
  policy,
  badge,
}: {
  policy: HotelChainPolicy;
  badge: ReportBadge | null;
}) {
  const r = cap(policy.canReceive);
  const s = cap(policy.canSend);
  const p = cap(policy.preCheckinHold);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
          {policy.name}
        </span>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
          {policy.nameJp}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge label="代收" detail={r.label} cls={r.cls} />
        <Badge label="代寄" detail={s.label} cls={s.cls} />
        <Badge label="入住前到" detail={p.label} cls={p.cls} />
      </div>
      {policy.url && (
        <a
          href={policy.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex text-[10px] text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 underline"
        >
          官方 FAQ →
        </a>
      )}
      <LocationReportPanel
        entityType="hotel_chain"
        entityId={policy.code}
        entityLabel={`${policy.name} (${policy.nameJp})`}
        badge={badge}
        compact
      />
    </div>
  );
}

function Badge({
  label,
  detail,
  cls,
}: {
  label: string;
  detail: string;
  cls: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${cls}`}
    >
      <span className="opacity-70">{label}</span>
      <span className="font-semibold">{detail}</span>
    </span>
  );
}
