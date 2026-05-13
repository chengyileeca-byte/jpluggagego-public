// Sprint 完了直後の事実検証パイプライン。
//
// User フィードバック 2026-05-09(20 件 manual audit で 15% error rate 発見):
//   1. random 30 entries(ある sprint で書いた entries を対象)を選ぶ
//   2. 各 entry の external_urls + Wikipedia(あれば)を WebFetch
//   3. error rate(URL 死鏈 OR 主題ミスマッチ OR 公式記録と矛盾)を計算
//   4. error rate > 10% なら全 entries を WebFetch で再 verify + patch script 生成
//   5. error rate <= 10% なら spot-fix のみ
//
// 使い方:
//   npx tsx scripts/seed-helpers/audit-sprint.ts <sprint-script-path>
//   例:npx tsx scripts/seed-helpers/audit-sprint.ts \
//       scripts/seed-japan-entries-saitama-lodging-r1.ts
//
// 注:この script は audit の「サンプリング + URL 死鏈チェック」までを自動化。
// 内容ミスマッチ判定は LLM 仕事(Claude が手動 WebFetch で個別判断)。
// この script は「審査対象 30 件 + URL status」を出力するため、Claude が
// それを受け取って手動 audit を進めるためのフレーム。

import { promises as fs } from "node:fs";
import path from "node:path";

interface Entry {
  slug: string;
  title_zh: string;
  summary_zh: string;
  external_urls: Record<string, string>;
  prefecture_ja: string;
  category: string;
  sub_type: string;
}

const SAMPLE_SIZE = 30;
const ERROR_THRESHOLD = 0.1; // 10%

async function main() {
  const sprintFile = process.argv[2];
  if (!sprintFile) {
    console.error("Usage: tsx audit-sprint.ts <sprint-script-path>");
    process.exit(1);
  }

  // sprint script から slug 一覧を抽出
  const src = await fs.readFile(sprintFile, "utf-8");
  const slugMatches = src.matchAll(/^\s+slug: "([^"]+)",/gm);
  const slugs = [...slugMatches].map((m) => m[1]);
  if (slugs.length === 0) {
    console.error("[audit] no slugs found in", sprintFile);
    process.exit(1);
  }
  console.log(`[audit] sprint contains ${slugs.length} entries`);

  // entries 全件 load
  const dataFile = path.join(
    process.cwd(),
    "public",
    "data",
    "japan_entries.json",
  );
  const all = JSON.parse(await fs.readFile(dataFile, "utf-8")) as Entry[];
  const bySlug = new Map(all.map((e) => [e.slug, e]));

  // 30 件 random sample(sprint が 30 件以下なら全件)
  const target = Math.min(SAMPLE_SIZE, slugs.length);
  const shuffled = [...slugs].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, target);
  console.log(`[audit] random sample: ${sample.length} / ${slugs.length}`);

  // URL 死鏈 check
  const results: Array<{
    slug: string;
    urls: Array<{ kind: string; url: string; status: number }>;
    errors: string[];
  }> = [];

  for (const slug of sample) {
    const e = bySlug.get(slug);
    if (!e) {
      results.push({ slug, urls: [], errors: ["entry_not_found"] });
      continue;
    }
    const urls = Object.entries(e.external_urls || {});
    const urlChecks: Array<{ kind: string; url: string; status: number }> = [];
    const errors: string[] = [];
    for (const [kind, url] of urls) {
      try {
        const res = await fetch(url, {
          method: "HEAD",
          redirect: "follow",
          signal: AbortSignal.timeout(10000),
        });
        urlChecks.push({ kind, url, status: res.status });
        if (res.status >= 400) errors.push(`${kind}_url_${res.status}`);
      } catch (err) {
        urlChecks.push({ kind, url, status: 0 });
        errors.push(`${kind}_url_unreachable`);
      }
    }
    results.push({ slug, urls: urlChecks, errors });
    process.stdout.write(".");
  }
  console.log();

  // 集計
  const failedCount = results.filter((r) => r.errors.length > 0).length;
  const failRate = failedCount / results.length;
  console.log();
  console.log("─".repeat(80));
  console.log(
    `[audit] error rate: ${failedCount}/${results.length} = ${(failRate * 100).toFixed(1)}%`,
  );

  // detail 出力
  for (const r of results) {
    if (r.errors.length === 0) continue;
    console.log(`  ❌ ${r.slug}`);
    for (const u of r.urls) {
      const flag = u.status >= 400 || u.status === 0 ? "✗" : " ";
      console.log(`    ${flag} ${u.status.toString().padStart(3)} ${u.kind}  ${u.url}`);
    }
  }

  console.log();
  if (failRate > ERROR_THRESHOLD) {
    console.log(
      `[audit] ⚠️  rate > ${ERROR_THRESHOLD * 100}% — escalate: WebFetch verify ALL ${slugs.length} entries`,
    );
    console.log(`[audit] full slug list:`);
    for (const s of slugs) console.log(`    ${s}`);
  } else {
    console.log(
      `[audit] ✓ rate <= ${ERROR_THRESHOLD * 100}% — spot-fix flagged entries only`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
