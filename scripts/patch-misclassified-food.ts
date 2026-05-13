// 一次性 patch:user audit 2026-05-09 で発見した「food 分類だが実体は
// 体験 / 博物館 / 寺院」エントリ 7 件を再分類する。
//
// 規則:
//   1. 「食材を売る」「食堂」「料亭」「銘菓」「酒造店」は food 維持
//   2. 「体験 + 観光園」「博物館 / 記念館」「寺院」「美術館」は
//      entertainment / culture に再分類
//   3. slug は SEO 安定のため変更せず、category + sub_type のみ更新
//   4. by-pref shard も同期

import { promises as fs } from "node:fs";
import path from "node:path";

interface Entry {
  slug: string;
  category: string;
  sub_type: string;
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
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const all = JSON.parse(raw) as Entry[];
  const bySlug = new Map(all.map((e) => [e.slug, e]));

  const patches: Record<string, { category: string; sub_type: string }> = {
    // 1. 八郎潟わかさぎ — 冬季氷上わかさぎ釣り体験 + 干拓地歴史が主軸
    "hachirogata-wakasagi": {
      category: "entertainment",
      sub_type: "akita_outdoor",
    },
    // 2. 弘前りんご公園 — 1985 開園 80 品種 2300 本観光農園
    "hirosaki-apple-park": {
      category: "entertainment",
      sub_type: "aomori_oirase_towada", // 一番近い既存・自然観光系
    },
    // 3. 白鹿記念酒造博物館 — 西宮の酒造文化博物館(museum 主軸)
    "hakushika-kinenkan-1662": {
      category: "culture",
      sub_type: "industrial_heritage", // 兵庫 culture 既存・酒造業 = 産業遺産
    },
    // 4. 月桂冠大倉記念館 — 伏見の酒造記念館
    "kyoto-gekkeikan-okura-museum": {
      category: "culture",
      sub_type: "industrial_heritage",
    },
    // 5. 大山崎山荘美術館 cafe — 美術館 + 国宝待庵近隣
    "kyoto-oyamazaki-sanso-museum-cafe": {
      category: "culture",
      sub_type: "museum_art",
    },
    // 6. サントリー山崎蒸溜所 — 日本ウイスキー発祥工場見学
    "kyoto-suntory-yamazaki": {
      category: "culture",
      sub_type: "industrial_heritage",
    },
    // 7. 大徳寺大仙院 — 寺院塔頭(精進料理は附帯)
    "kyoto-daisen-in-daitokuji": {
      category: "culture",
      sub_type: "temple_shrine",
    },
  };

  let updated = 0;
  for (const [slug, patch] of Object.entries(patches)) {
    const e = bySlug.get(slug);
    if (!e) {
      console.error(`[patch] missing entry: ${slug}`);
      continue;
    }
    const old = `${e.category}/${e.sub_type}`;
    e.category = patch.category;
    e.sub_type = patch.sub_type;
    e.updated_at = new Date().toISOString();
    console.log(
      `[patch] ${slug.padEnd(40)} ${old.padEnd(28)} → ${patch.category}/${patch.sub_type}`,
    );
    updated++;
  }

  // 全 entries を id 順で再 sort + 書出
  const sorted = [...bySlug.values()].sort(
    (a, b) => (a as { id: number }).id - (b as { id: number }).id,
  );
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify(sorted, null, 2) + "\n",
    "utf-8",
  );
  console.log(`[patch] wrote ${DATA_FILE} — ${updated} entries patched`);

  // by-pref shard 同期
  const prefsToUpdate = new Set(
    Object.keys(patches)
      .map((s) => bySlug.get(s)?.prefecture_ja)
      .filter((x): x is string => !!x),
  );
  for (const pref of prefsToUpdate) {
    const file = path.join(
      process.cwd(),
      "public",
      "data",
      "by-pref",
      encodeURIComponent(pref),
      "japan_entries.json",
    );
    const prefRows = sorted.filter((e) => e.prefecture_ja === pref);
    await fs.writeFile(file, JSON.stringify(prefRows, null, 2) + "\n", "utf-8");
    console.log(`[patch] sync by-pref/${pref} (${prefRows.length} rows)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
