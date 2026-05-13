// Sprint 1.3 audit 後の spot-fix patch。
// audit pipeline で URL 死鏈 2 件発覚(全 20 中 10.0% = threshold 同等)、
// うち 1 件は deep-check で内容も誤りが発覚:
//
// 1. seibu-chichibu-matsurinoyu — official URL 404(seiburailway.jp/railways/...)
//    実際の official URL は確認できず → URL 削除。本文は概ね正確。
//
// 2. naguri-onsen-daishokaku-1885 — daishokaku.com 不可達 + Wikipedia
//    「名栗温泉」記事から:大松閣は大正初期(1910s)開業で 1885 ではない、
//    泉質はラジウム鉱泉ではなく弱アルカリ性冷鉱泉 pH 9.4、
//    西武飯能駅 → バス 30 分(50 分ではない)
//    → 内容修正 + external_urls を Wikipedia 安定 URL に差替

import { promises as fs } from "node:fs";
import path from "node:path";

interface Entry {
  slug: string;
  title_zh: string;
  title_ja: string | null;
  summary_zh: string;
  content_md: string | null;
  external_urls: Record<string, string>;
  tags: string[];
  updated_at: string;
  prefecture_ja: string;
  [key: string]: unknown;
}

const DATA_FILE = path.join(
  process.cwd(),
  "public",
  "data",
  "japan_entries.json",
);

async function main() {
  const all = JSON.parse(await fs.readFile(DATA_FILE, "utf-8")) as Entry[];
  const bySlug = new Map(all.map((e) => [e.slug, e]));

  const patches: Record<string, Partial<Entry>> = {
    "seibu-chichibu-matsurinoyu": {
      // URL 削除のみ(本文は正確)
      external_urls: {},
    },
    "naguri-onsen-daishokaku-1885": {
      title_zh:
        "名栗温泉 大松閣(飯能市下名栗・大正初期 1912 開業 113 年級+ 名栗川源流弱アルカリ性冷鉱泉 pH 9.4・温度 17.0°C+ 関東屈指の山中秘湯+ 山の幸郷土料理+ R1 楽 棒の嶺ハイキング+ 1 泊 2 食 ¥18,500-32,500・西武飯能駅 → バス約 30 分)",
      title_ja: "名栗温泉 大松閣",
      summary_zh:
        "**名栗温泉 大松閣は大正初期 1912 開業 113 年級・名栗川源流弱アルカリ性冷鉱泉 pH 9.4(17.0°C)**(飯能市下名栗・**関東屈指の山中秘湯**)。R1 楽 棒の嶺連動、¥18,500-32,500、西武飯能駅 → バス 30 分。",
      content_md:
        "- 立地:**飯能市下名栗**\n- 起源:**大正初期 1912 開業 113 年級**\n- 泉質:**弱アルカリ性冷鉱泉 pH 9.4・温度 17.0°C(名栗川源流)**\n- 価位:**¥18,500-32,500 / 1 泊 2 食**\n- 関連:**R1 楽 棒の嶺ハイキング**\n- アクセス:**西武飯能駅 → バス 約 30 分**",
      external_urls: {
        wikipedia_ja: "https://ja.wikipedia.org/wiki/名栗温泉",
      },
      tags: [
        "naguri_onsen",
        "daishokaku",
        "1912_taisho_early",
        "alkaline_cold_spring",
      ],
    },
  };

  let updated = 0;
  for (const [slug, patch] of Object.entries(patches)) {
    const e = bySlug.get(slug);
    if (!e) {
      console.error(`[patch] missing: ${slug}`);
      continue;
    }
    Object.assign(e, patch, { updated_at: new Date().toISOString() });
    console.log(`[patch] ${slug}`);
    updated++;
  }

  const sorted = [...bySlug.values()].sort(
    (a, b) => (a as { id: number }).id - (b as { id: number }).id,
  );
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify(sorted, null, 2) + "\n",
    "utf-8",
  );
  console.log(`[patch] wrote japan_entries.json — ${updated} patched`);

  // by-pref shard 同期
  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "by-pref",
    encodeURIComponent("埼玉県"),
    "japan_entries.json",
  );
  const prefRows = sorted.filter((e) => e.prefecture_ja === "埼玉県");
  await fs.writeFile(file, JSON.stringify(prefRows, null, 2) + "\n", "utf-8");
  console.log(`[patch] sync by-pref/埼玉県 (${prefRows.length} rows)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
