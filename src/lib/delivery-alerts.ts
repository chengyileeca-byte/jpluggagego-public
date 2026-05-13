// 配送遅延 alerts(主頁 marquee 用)
//
// 主頁の跑馬燈は ZERO alert なら表示しない方針。post-Supabase は
// public/data/delivery_alerts.json を読む。snapshot は github-actions の
// fetch-carrier-delays workflow が日次更新・auto-commit。

import { promises as fs } from "node:fs";
import path from "node:path";

export interface DeliveryAlert {
  id: number;
  regions_zh: string;
  regions_ja: string[];
  weather_zh: string;
  weather_type: string | null;
  carriers: string[];
  severity: "info" | "warning" | "danger";
  starts_at: string;
  expires_at: string;
  source_url: string | null;
  source_label: string | null;
}

const SEVERITY_RANK: Record<DeliveryAlert["severity"], number> = {
  danger: 0,
  warning: 1,
  info: 2,
};

export async function getActiveDeliveryAlerts(): Promise<DeliveryAlert[]> {
  let raw: string;
  try {
    raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "delivery_alerts.json"),
      "utf-8",
    );
  } catch {
    // ファイル未生成 = まだ scraper が一度も走っていない、または
    // 公告無しで空ファイル削除された場合。marquee 隠す。
    return [];
  }
  const all = JSON.parse(raw) as DeliveryAlert[];
  const nowIso = new Date().toISOString();
  return all
    .filter((a) => a.starts_at <= nowIso && nowIso <= a.expires_at)
    .sort((a, b) => {
      const s = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      if (s !== 0) return s;
      return a.starts_at < b.starts_at ? 1 : -1;
    });
}
