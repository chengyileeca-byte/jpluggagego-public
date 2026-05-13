// 配送会社公式 遅延ページから delivery_alerts スナップショットを更新。
//
// データ源:
//   - JP Post (ゆうパック):https://www.post.japanpost.jp/service/unkou.pdf
//     公式が随時更新する 1-page PDF、引受停止 + お届け遅延の都道府県情報
//     (旧 URL /unkou.pdf は 2026 年に /service/ 配下へ移転、注意)
//   - Yamato:現在 bot block で fetch 不能、scrape 未実装(Playwright で将来対応)
//
// 戦略 (post-Supabase SUNSET):
//   1. PDF を fetch → pdftotext で text 抽出
//   2. 都道府県名 + 「停止」「遅延」「遅れ」などの近接 keyword から alert 化
//   3. public/data/delivery_alerts.json に snapshot replace
//
// Usage:
//   npx tsx scripts/fetch-carrier-delays.ts --dry
//   npx tsx scripts/fetch-carrier-delays.ts
//
// CI: .github/workflows/fetch-carrier-delays.yml が日次 cron で実行 + auto-commit。

import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const JP_POST_PDF = "https://www.post.japanpost.jp/service/unkou.pdf";
const JP_POST_INFO_URL = "https://www.post.japanpost.jp/service/unkou.html";

// 47 都道府県リスト(日本語名)
const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県",
  "沖縄県",
];

interface ParsedAlert {
  prefs: string[]; // ["石川県"]
  munis_zh: string; // "珠洲市・輪島市・能登町" 等の補足
  status: "suspended" | "delayed";
  delay_label: string; // "引受停止" / "数日程度の遅れ" / "1日程度の遅れ" 等
  reason: string; // "能登半島地震" 等
}

async function fetchPdf(): Promise<string> {
  // JP Post 的 server 偶發 5xx(server-side 維護或 spike)、瞬斷時 retry 3 次
  // backoff 8s → 24s → 72s,合計 < 2 分鐘,在 5 分鐘 timeout 內。
  let lastStatus = 0;
  let buf: Buffer | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(JP_POST_PDF, {
        signal: AbortSignal.timeout(30_000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; jpluggagego-carrier/1.0)" },
      });
      if (r.ok) {
        buf = Buffer.from(await r.arrayBuffer());
        break;
      }
      lastStatus = r.status;
      // 4xx は retry しても無駄(URL 移動・permanent error)
      if (r.status >= 400 && r.status < 500) {
        throw new Error(`JP Post PDF fetch failed: HTTP ${r.status} (client error, no retry)`);
      }
      console.warn(`[carrier-delays] attempt ${attempt}/3 → HTTP ${r.status}, retrying...`);
    } catch (e) {
      if (e instanceof Error && e.message.includes("client error")) throw e;
      console.warn(`[carrier-delays] attempt ${attempt}/3 → ${e instanceof Error ? e.message : String(e)}, retrying...`);
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 8000));
  }
  if (!buf) {
    throw new Error(`JP Post PDF fetch failed after 3 attempts (last HTTP ${lastStatus || "network error"})`);
  }
  const dir = mkdtempSync(join(tmpdir(), "jp-post-"));
  const pdfPath = join(dir, "unkou.pdf");
  writeFileSync(pdfPath, buf);
  // pdftotext (poppler-utils)で text 抽出
  const result = spawnSync("pdftotext", ["-layout", pdfPath, "-"], {
    encoding: "utf-8",
  });
  if (result.status !== 0) {
    throw new Error(
      `pdftotext failed: ${result.stderr ?? "non-zero exit"} (poppler-utils install required)`,
    );
  }
  unlinkSync(pdfPath);
  return result.stdout;
}

// PDF parsing 戦略:
//   引受停止セクションのみ採用(構造化された「⇒ {県} {町村}」+「災害名」+「期間」がある)。
//   お届け状況(遅延)テーブルは複数行に散らばるため LLM extract せずに正確 parse 困難
//   → 誤検出避けるため未対応(将来 LLM extraction 等で精度向上時に追加)。
//   引受停止は実際に「送れない」状態なので、これだけでも UI 価値十分。
function parseJpPostPdf(text: string): ParsedAlert[] {
  const alerts: ParsedAlert[] = [];

  // 引受停止セクション:全国 → ⇒ {県} {町村} {対象商品} {期間}
  // 期間は「YYYY/M/D～当分の間」のパターン
  const suspensionMatch = text.match(
    /引き受け、配達又は局留め扱いとなる荷物の引き受けを一時的に停止[\s\S]*?(?=お届け状況|$)/,
  );
  if (!suspensionMatch) return alerts;

  const block = suspensionMatch[0];
  // 災害名(複数の「」で囲まれる)
  const reasons: string[] = [];
  // PDF text の改行・複数空白を normalize してから match
  const blockNorm = block.replace(/\s+/g, " ");
  const reasonMatches = blockNorm.matchAll(/「([^」]+)」/g);
  for (const m of reasonMatches) {
    const r = m[1].trim();
    // 雜音 filter:「期間」「商品名」等は除外
    if (
      r.length > 3 &&
      !/[①②③]/.test(r) &&
      !/対象|期間|理由|商品|送地|宛先|引受/.test(r)
    ) {
      if (!reasons.includes(r)) reasons.push(r);
    }
  }
  const reason =
    reasons.length > 0 ? reasons.slice(0, 2).join("、") : "災害等の影響";

  // 「⇒ {県}」を含む行を行ベースで抽出。pdftotext -layout は table を空白で
  // alignment しているので、 ⇒ がある行から県名 + 直後の文字列を取る。
  const lines = block.split("\n");
  const seenPrefs = new Set<string>();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("⇒")) continue;
    // ⇒ の右側を取る(複数 ⇒ があれば最後の右側)
    const rightOfArrow = line.slice(line.lastIndexOf("⇒") + 1).trim();
    // 都道府県名で始まるかチェック
    const pref = PREFECTURES.find((p) => rightOfArrow.startsWith(p));
    if (!pref) continue;
    if (seenPrefs.has(pref)) continue;
    seenPrefs.add(pref);

    // 町村名は行をまたぐので、周辺 ±2 行から「市・町・村・郡」を含む短い fragment を集める
    const muniFrags: string[] = [];
    for (let j = i - 1; j <= i + 3 && j < lines.length; j++) {
      if (j < 0) continue;
      const segs = lines[j].split(/\s+/).filter(Boolean);
      for (const s of segs) {
        if (s === pref) continue;
        if (
          /^[一-鿿]{1,8}(市|町|村|郡|区)$/.test(s) ||
          /^[一-鿿]{1,8}(市|町|村|郡)$/.test(s.replace(/[、,]+$/, ""))
        ) {
          if (!muniFrags.includes(s)) muniFrags.push(s);
        }
      }
    }
    const munis_zh = muniFrags.slice(0, 5).join("・");

    alerts.push({
      prefs: [pref],
      munis_zh,
      status: "suspended",
      delay_label: "引受停止中",
      reason,
    });
  }

  return alerts;
}

async function main() {
  const dry = process.argv.includes("--dry");
  console.log(`[carrier-delays] fetching JP Post 運行 PDF...`);
  const text = await fetchPdf();
  console.log(`[carrier-delays] PDF text: ${text.length} chars`);

  const parsed = parseJpPostPdf(text);
  console.log(`[carrier-delays] parsed ${parsed.length} alerts:`);
  for (const a of parsed) {
    const muni = a.munis_zh ? `(${a.munis_zh})` : "";
    console.log(
      `  [${a.status}] ${a.prefs.join("、")}${muni} ${a.delay_label} — ${a.reason}`,
    );
  }

  if (dry) {
    console.log("\n[carrier-delays] --dry mode, snapshot unchanged");
    return;
  }

  // snapshot path:public/data/delivery_alerts.json。Daily cron が 24h+
  // buffer で書く(workflow が日次走るので 36h あれば安全マージン)。
  const snapshotPath = join(
    process.cwd(),
    "public",
    "data",
    "delivery_alerts.json",
  );

  if (parsed.length === 0) {
    // 公告無し → 空配列で書き出す。reader は空配列を「公告なし」と
    // 解釈して marquee を隠す。
    writeFileSync(snapshotPath, "[]\n");
    console.log("[carrier-delays] no delays — snapshot cleared, marquee will hide");
    return;
  }

  const startsAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString();
  const alerts = parsed.map((a, idx) => ({
    id: idx + 1,
    regions_zh:
      a.prefs.join("、") + (a.munis_zh ? ` ${a.munis_zh}` : ""),
    regions_ja: a.prefs,
    weather_zh: `${a.delay_label}(${a.reason})`,
    weather_type: a.status === "suspended" ? "suspended" : "delayed",
    carriers: ["yuu"],
    severity: a.status === "suspended" ? "danger" : "warning",
    starts_at: startsAt,
    expires_at: expiresAt,
    source_url: JP_POST_INFO_URL,
    source_label: "ゆうパック",
  }));
  writeFileSync(snapshotPath, JSON.stringify(alerts, null, 2) + "\n");
  console.log(
    `[carrier-delays] ✅ ${alerts.length} alerts → ${snapshotPath}`,
  );
}

main().catch((err) => {
  // PDF fetch transient failure(JP Post 5xx, network timeout)→ keep prior
  // snapshot + exit 0 so workflow stays green. Next cron will retry.
  // 真に致命的なエラー (parse logic bug 等) のみ exit 1 で workflow 紅化、
  // 但 transient remote failure は noise なので tolerate。
  const msg = err instanceof Error ? err.message : String(err);
  const isTransient =
    msg.includes("JP Post PDF fetch failed") ||
    msg.includes("fetch failed") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ECONNRESET") ||
    msg.includes("timeout");
  if (isTransient) {
    console.warn(`[carrier-delays] ⚠️  ${msg}`);
    console.warn(`[carrier-delays] keeping prior snapshot; next cron will retry.`);
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
