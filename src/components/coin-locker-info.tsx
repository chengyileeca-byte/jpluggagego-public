interface SizeRow {
  size: string;
  dim: string;
  price: string;
  fits: string;
}

const SIZES: SizeRow[] = [
  {
    size: "小 (S)",
    dim: "約 30 × 40 × 60 cm",
    price: "¥300-500",
    fits: "背包、相機包、小手提",
  },
  {
    size: "中 (M)",
    dim: "約 55 × 40 × 60 cm",
    price: "¥500-700",
    fits: "20-24 吋登機箱",
  },
  {
    size: "大 (L)",
    dim: "約 90 × 40 × 60 cm",
    price: "¥700-1,000",
    fits: "26-29 吋大行李 (緊)",
  },
  {
    size: "特大 (XL)",
    dim: "少數車站有",
    price: "¥1,000 上下",
    fits: "高爾夫袋、樂器、特殊件",
  },
];

interface WhenToUse {
  scene: string;
  pick: "locker" | "forward" | "ecbo";
  reason: string;
}

const WHEN: WhenToUse[] = [
  {
    scene: "飯店不代收 / 退房後班機還早",
    pick: "locker",
    reason: "幾小時的事,直接塞車站 locker 最快,¥700 解決",
  },
  {
    scene: "中途去 day trip(白川鄉、箱根、奈良)",
    pick: "locker",
    reason: "當天來回,車站寄存比拖著大箱子輕鬆太多",
  },
  {
    scene: "下一家飯店在不同城市(京都 → 大阪)",
    pick: "forward",
    reason: "Yamato 飯店代寄翌日送達,不用自己拖",
  },
  {
    scene: "要放 2 天以上 / 附近 locker 全滿",
    pick: "ecbo",
    reason: "ecbo Cloak 每日定額、容量彈性、線上預約保位",
  },
];

function pickBadge(p: WhenToUse["pick"]): { label: string; cls: string } {
  if (p === "locker") {
    return {
      label: "Locker",
      cls: "bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-800",
    };
  }
  if (p === "forward") {
    return {
      label: "飯店代寄",
      cls: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800",
    };
  }
  return {
    label: "ecbo",
    cls: "bg-violet-100 dark:bg-violet-950/40 text-violet-800 dark:text-violet-200 border-violet-300 dark:border-violet-800",
  };
}

export function CoinLockerInfo() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          🔐 Plan B · 投幣寄物櫃 コインロッカー
        </h3>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
          飯店不收、退房後還要玩、中途輕裝 day trip —— 這三種情境 locker 比代寄便宜。以下為各家車站通用規格,實際看站點設備。
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 dark:bg-zinc-950 text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
            <tr>
              <th className="px-3 py-2 font-medium">尺寸</th>
              <th className="px-3 py-2 font-medium">容量</th>
              <th className="px-3 py-2 font-medium">單次費用</th>
              <th className="px-3 py-2 font-medium">能塞什麼</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {SIZES.map((r) => (
              <tr key={r.size} className="text-zinc-700 dark:text-zinc-300">
                <td className="px-3 py-2 font-medium text-zinc-900 dark:text-zinc-50">
                  {r.size}
                </td>
                <td className="px-3 py-2 text-[11px]">{r.dim}</td>
                <td className="px-3 py-2 text-[11px] tabular-nums">{r.price}</td>
                <td className="px-3 py-2 text-[11px]">{r.fits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4">
        <div className="text-xs font-semibold text-amber-900 dark:text-amber-200">
          ⚠️ 3 個必知地雷
        </div>
        <ul className="mt-2 space-y-1.5 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
          <li>
            <span className="font-medium">大尺寸一大早就滿</span>
            <span className="opacity-80">
              {" "}
              · 東京站、新宿、京都這種觀光大站 L 櫃常常 9 點前就清空,行程 day trip 建議 8:30 前到站卡位,或改用 ecbo
            </span>
          </li>
          <li>
            <span className="font-medium">IC 卡式鎖要同一張卡</span>
            <span className="opacity-80">
              {" "}
              · 用 Suica 鎖就要用同一張 Suica 開。中途換卡 / 弄丟 → 得找站務員強開(可能出示護照 + 等 20-30 分)
            </span>
          </li>
          <li>
            <span className="font-medium">24 小時費用會疊加</span>
            <span className="opacity-80">
              {" "}
              · 過午夜 0:00 即算新一天費用。車站多半 5:00-23:30 開放,閉門後拿不到 → 跨夜寄存請找 24hr locker 或 ecbo
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
          何時用 locker?何時用別的?
        </div>
        <div className="mt-2 grid gap-2">
          {WHEN.map((w) => {
            const b = pickBadge(w.pick);
            return (
              <div
                key={w.scene}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                    {w.scene}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${b.cls}`}
                  >
                    {b.label}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {w.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-[10px] text-zinc-400 dark:text-zinc-600 leading-relaxed">
        規格為民營 + JR 主要廠商(Alpha / フルタイムロッカー)通用值,實際尺寸與費用以現地標示為準。尋找即時空櫃可查「JR 東日本 コインロッカー空室検索」或 Google Maps 搜尋「近くのコインロッカー」。
      </p>
    </div>
  );
}
