// 一次性 patch:fact-check audit で発見した 3 件のエラー修正。
// User audit 2026-05-09 / 20 件サンプル中 3 件 fail:
//   1. sukawa-onsen-ichinoseki — 「1190 開湯」誤 → 正解 873(貞観 15 年)
//      根拠:https://ja.wikipedia.org/wiki/須川温泉 + sukawaonsen.jp 公式
//      「平安前期から続く・1100 年以上」
//   2. sukawa-onsen-yado — 「1500 年伝承」誤 + 「須川温泉宿」名称も誤
//      実際は宮城県栗原市の くりこま荘(住所:栗駒沼倉耕英東 95-2)
//      須川温泉郷(岩手 + 秋田)本体ではなく、栗駒山宮城側の登山口宿
//   3. ao-no-kokyokyoku — official URL が yoshinoyama-kankou.com の
//      奥千本神社頁(完全主題違い)→ Wikipedia「16200系電車」へ差替

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
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const all = JSON.parse(raw) as Entry[];
  const bySlug = new Map(all.map((e) => [e.slug, e]));

  const patches: Record<string, Partial<Entry>> = {
    "sukawa-onsen-ichinoseki": {
      title_zh:
        "須川高原温泉(一関市・標高 1,126m 東日本最高所温泉+ 873 貞観 15 年開湯・平安前期 + 1100 年以上の歴史+ 1958 国民保養温泉地指定+ 栗駒山(1,627m)山麓 + 須川岳秘境秋田岩手県境+ 5-10 月開湯 + 11-4 月閉湯+ 大露天風呂代表)",
      title_ja: "須川高原温泉",
      summary_zh:
        "**須川高原温泉は東日本最高所温泉**(一関市・**標高 1,126m**)。**873 貞観 15 年開湯・平安前期 + 1100 年以上の歴史 + 1958 国民保養温泉地指定 + 栗駒山(1,627m)山麓 + 須川岳秘境秋田岩手県境 + 5-10 月開湯 + 11-4 月閉湯**、青森酸ヶ湯 R1(925m・国民保養第 1 号 1954)に並ぶ東北山岳秘湯、大露天風呂代表。",
      content_md:
        "- 立地:**岩手県一関市厳美町祭畤山国有林**\n- 海抜:**標高 1,126m(東日本最高所温泉)**\n- 開湯:**873 貞観 15 年・平安前期(1100 年以上の歴史)**\n- 認定:**1958 国民保養温泉地指定**\n- 山:**栗駒山 1,627m 山麓・秋田岩手県境**\n- 営業:**5-10 月(国道 342 号 11-4 月通行止)**",
      tags: [
        "sukawa_onsen",
        "1126m",
        "since_873",
        "heian_early",
        "national_health_spa_1958",
        "kurikoma_yama",
      ],
      external_urls: {
        official: "https://www.sukawaonsen.jp/",
        wikipedia_ja: "https://ja.wikipedia.org/wiki/須川温泉",
      },
    },
    "sukawa-onsen-yado": {
      title_zh:
        "くりこま荘(栗原市栗駒沼倉・栗駒山宮城側登山口温泉宿+ 須川温泉郷(岩手秋田)隣接+ 含硫黄塩化物泉+ 5-10 月営業 紅葉期混雑+ 1 泊 2 食 ¥10,500-15,500 + R1 楽 栗駒山登山+ 三県境秘境)",
      title_ja: "くりこま荘",
      summary_zh:
        "**くりこま荘は栗駒山宮城側登山口温泉宿**(栗原市栗駒沼倉・**含硫黄塩化物泉**)。R1 楽 栗駒山登山拠点、須川温泉郷(岩手秋田)隣接、5-10 月営業、紅葉期混雑、¥10,500-15,500。",
      content_md:
        "- 立地:**宮城県栗原市栗駒沼倉耕英東**\n- 注:**須川温泉郷本体(岩手県一関市 + 秋田県東成瀬村)とは別、宮城側の栗駒山登山口宿**\n- 泉質:**含硫黄塩化物泉**\n- 営業:**5-10 月・紅葉期混雑**\n- 関連:**R1 楽 栗駒山登山拠点**",
      tags: ["kurikomaso", "kurikoma_base", "miyagi_side"],
      external_urls: {
        official: "http://kurikomaso.jp/index.html",
      },
    },
    "ao-no-kokyokyoku": {
      // entry 内容は概ね正確、URL のみ差替
      external_urls: {
        wikipedia_ja: "https://ja.wikipedia.org/wiki/近鉄16200系電車",
      },
    },
  };

  let updated = 0;
  for (const [slug, patch] of Object.entries(patches)) {
    const e = bySlug.get(slug);
    if (!e) {
      console.error(`[patch] missing entry: ${slug}`);
      continue;
    }
    Object.assign(e, patch, { updated_at: new Date().toISOString() });
    console.log(`[patch] ${slug} updated`);
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

  // 同期 by-pref shard
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
