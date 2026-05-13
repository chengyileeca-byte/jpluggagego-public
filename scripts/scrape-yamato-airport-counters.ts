// Scrape Yamato 空港宅急便 カウンター一覧 from:
//   https://www.kuronekoyamato.co.jp/ytc/customer/send/services/airport/list.html
//
// One fetch, one upsert. Rows produced: ~25 (17 airports × 1-2 counter types).
//
// Usage:
//   npm run scrape:yamato-airport:dry
//   npm run scrape:yamato-airport

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { parse, type HTMLElement } from "node-html-parser";
import { politeFetch } from "./lib/polite-fetch";
import { createAdminClient } from "../src/lib/supabase/admin";

const LIST_URL =
  "https://www.kuronekoyamato.co.jp/ytc/customer/send/services/airport/list.html";

// IATA mapping for every airport that appears on Yamato's counter list.
// (Some airports have multi-terminal entries but share one IATA code.)
const IATA_BY_JP_NAME: Array<[RegExp, string]> = [
  [/新千歳空港/, "CTS"],
  [/仙台国際空港|仙台空港/, "SDJ"],
  [/福島空港/, "FKS"],
  [/成田空港/, "NRT"],
  [/羽田空港/, "HND"],
  [/新潟空港/, "KIJ"],
  [/小松空港/, "KMQ"],
  [/中部国際空港/, "NGO"],
  [/大阪国際（伊丹）空港|伊丹空港/, "ITM"],
  [/関西国際空港/, "KIX"],
  [/岡山桃太郎空港|岡山空港/, "OKJ"],
  [/広島空港/, "HIJ"],
  [/福岡空港/, "FUK"],
  [/北九州空港/, "KKJ"],
  [/長崎空港/, "NGS"],
  [/鹿児島空港/, "KOJ"],
];

function iataFor(airportNameJp: string): string {
  for (const [re, code] of IATA_BY_JP_NAME) {
    if (re.test(airportNameJp)) return code;
  }
  throw new Error(`No IATA match for ${airportNameJp}`);
}

function parseTerminal(airportNameJp: string): string | null {
  const m =
    /第([0-9０-９])ターミナル(?:ビル)?(?:（(北ウイング|南ウイング|中央エリア|国内線|国際線|国際線ターミナルビル)）)?/.exec(
      airportNameJp,
    );
  if (!m) {
    // Handle terminal-less forms e.g. 福岡空港（国内線）, 新千歳空港（国際線ターミナルビル）
    const sub = /（(国内線|国際線|国際線ターミナルビル|中央エリア)）/.exec(
      airportNameJp,
    );
    if (sub) return sub[1];
    return null;
  }
  const num = m[1].replace(/[０-９]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0),
  );
  const area = m[2];
  return area ? `T${num}${area}` : `T${num}`;
}

interface CounterRow {
  airport_iata: string;
  airport_name_jp: string;
  terminal: string | null;
  prefecture: string;
  service_type: "受取" | "発送" | "受取・発送";
  floor: string | null;
  detail_url: string | null;
}

function parseCounters(html: string): CounterRow[] {
  const root = parse(html);
  const rows: CounterRow[] = [];

  // Counter tables have <th class="table__cell--lv1">空港名</th>. Some tables
  // bury the <th> row inside <tbody> instead of <thead> (関西 block is wrong
  // in the source HTML), so match against any <th> within the table, not just
  // <thead>.
  const tables = root.querySelectorAll("table");
  for (const tbl of tables) {
    const anyHeader = tbl.querySelectorAll("th.table__cell--lv1");
    const headerText = anyHeader.map((th) => th.text).join(" ");
    if (!headerText.includes("空港名")) continue;

    let carryPref: string | null = null;
    let carryAirport: string | null = null;
    let carryDetailUrl: string | null = null;
    let remaining = 0;

    const trs = tbl.querySelectorAll("tr");
    for (const tr of trs) {
      const cells = tr.querySelectorAll("td.table__cell");
      if (cells.length === 0) continue;

      let prefCell: HTMLElement | null = null;
      let airportCell: HTMLElement | null = null;
      let serviceCell: HTMLElement | null = null;
      let floorCell: HTMLElement | null = null;
      let mapCell: HTMLElement | null = null;

      if (remaining > 0) {
        // Inherit pref + airport from the previous row (rowspan continuation)
        [serviceCell, floorCell, mapCell] = cells.slice(-3);
      } else {
        [prefCell, airportCell, serviceCell, floorCell, mapCell] = cells;
      }

      if (!serviceCell || !floorCell) continue;

      const pref: string = prefCell
        ? prefCell.text.trim()
        : (carryPref ?? "");
      const airportNameJp: string = airportCell
        ? airportCell.text.trim()
        : (carryAirport ?? "");
      const service = serviceCell.text.trim();
      const floor = floorCell.text.trim();
      const href =
        mapCell?.querySelector("a")?.getAttribute("href") ?? null;
      const detailUrl: string | null = href
        ? new URL(href, LIST_URL).toString()
        : (carryDetailUrl ?? null);

      if (!pref || !airportNameJp) continue;

      if (remaining === 0) {
        // New airport row; check if it spans two rows (rowspan="2")
        const rowspan = prefCell?.getAttribute("rowspan") ?? "1";
        if (rowspan === "2") {
          carryPref = pref;
          carryAirport = airportNameJp;
          carryDetailUrl = detailUrl;
          remaining = 1;
        }
      } else {
        remaining -= 1;
      }

      if (
        service !== "受取" &&
        service !== "発送" &&
        service !== "受取・発送"
      ) {
        console.warn(`[airport] unknown service_type "${service}" — skipped`);
        continue;
      }

      rows.push({
        airport_iata: iataFor(airportNameJp),
        airport_name_jp: airportNameJp,
        terminal: parseTerminal(airportNameJp),
        prefecture: pref,
        service_type: service,
        floor,
        detail_url: detailUrl,
      });
    }
  }

  return rows;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log(`[airport] GET ${LIST_URL}`);
  const res = await politeFetch(LIST_URL, { respectJstPeak: false });
  if (!res.ok) throw new Error(`${LIST_URL} → HTTP ${res.status}`);
  const html = await res.text();

  const rows = parseCounters(html);
  console.log(`[airport] parsed ${rows.length} counter rows`);

  const byIata = new Map<string, number>();
  for (const r of rows) byIata.set(r.airport_iata, (byIata.get(r.airport_iata) ?? 0) + 1);
  console.log(
    `[airport] IATA coverage: ${[...byIata.entries()].map(([k, v]) => `${k}×${v}`).join(", ")}`,
  );

  console.log(`\n[airport] Samples:`);
  for (const r of rows.slice(0, 10)) {
    console.log(
      `  ${r.airport_iata}  ${r.airport_name_jp.padEnd(28, " ")}  ${r.service_type.padEnd(7, " ")}  ${r.floor}  (${r.terminal ?? "-"})`,
    );
  }

  if (dryRun) {
    console.log(`\n[airport] DRY RUN — no DB writes.`);
    return;
  }

  const supabase = createAdminClient();
  // Touch scraped_at on every run so UI "最終更新" reflects the latest scrape,
  // not the first INSERT (upsert's ON CONFLICT doesn't retrigger DB DEFAULT).
  const capturedAt = new Date().toISOString();
  const rowsWithTs = rows.map((r) => ({ ...r, scraped_at: capturedAt }));
  const { error } = await supabase
    .from("yamato_airport_counters")
    .upsert(rowsWithTs, { onConflict: "airport_name_jp,service_type" });
  if (error) {
    console.error("[airport] upsert error:", error);
    process.exit(1);
  }
  console.log(`[airport] Done — ${rows.length} counter rows upserted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
