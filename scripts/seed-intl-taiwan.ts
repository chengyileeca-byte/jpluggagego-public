// Seed 台灣初值 — intl_country_conditions + yamato_intl_fares
//
// 執行:
//   npm run seed:intl-taiwan
//
// 安全可重跑(upsert)。Yamato 常數更新後,直接改 src/lib/yamato-intl-taiwan.ts
// 再重跑此 script 即可同步到 DB。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";
import {
  YAMATO_INTL_TAIWAN,
  YAMATO_INTL_TAIWAN_META,
  YAMATO_INTL_TAIWAN_VERIFIED_AT,
} from "../src/lib/yamato-intl-taiwan";

async function main() {
  const supabase = createAdminClient();

  // 1. intl_country_conditions — 台灣 metadata
  const countryRow = {
    country_iso2: "TW",
    name_zh: "台灣",
    name_ja: "台湾",
    zone: "1",
    yuu_max_weight_kg: 30,
    yuu_max_length_cm: 150,
    yuu_max_length_girth_cm: 300,
    yamato_max_weight_kg: YAMATO_INTL_TAIWAN_META.maxWeightKg,
    yamato_transit_days: YAMATO_INTL_TAIWAN_META.transitDays,
    updated_at: new Date().toISOString(),
  };

  const { error: countryErr } = await supabase
    .from("intl_country_conditions")
    .upsert(countryRow, { onConflict: "country_iso2" });

  if (countryErr) {
    console.error("[seed-intl-taiwan] intl_country_conditions upsert error:", countryErr);
    process.exit(1);
  }
  console.log(`[seed-intl-taiwan] intl_country_conditions · TW 已寫入`);

  // 2. yamato_intl_fares — 7 筆 size_code
  const yamatoRows = YAMATO_INTL_TAIWAN.map((fare) => ({
    country_iso2: "TW",
    size_code: fare.sizeCode,
    max_weight_kg: fare.maxWeightKg,
    price_jpy: fare.priceJpy,
    verified_at: YAMATO_INTL_TAIWAN_VERIFIED_AT,
  }));

  const { error: yamatoErr } = await supabase
    .from("yamato_intl_fares")
    .upsert(yamatoRows, { onConflict: "country_iso2,size_code" });

  if (yamatoErr) {
    console.error("[seed-intl-taiwan] yamato_intl_fares upsert error:", yamatoErr);
    process.exit(1);
  }
  console.log(
    `[seed-intl-taiwan] yamato_intl_fares · TW ${yamatoRows.length} 筆已寫入(verified_at: ${YAMATO_INTL_TAIWAN_VERIFIED_AT})`,
  );

  console.log(`[seed-intl-taiwan] ✓ Done`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
