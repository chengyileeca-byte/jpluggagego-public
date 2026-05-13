// GET /api/intl-quote?country=TW&weight_g=20000&yamato_size=140
//
// 回傳單次查詢之四選項運費:
//   郵便局 EMS / 航空小包 / SAL 小包 / 船便 小包 + Yamato 國際宅急便(依 size)

import { type NextRequest } from "next/server";
import {
  loadYuuIntlFares,
  loadYamatoIntlFares,
  pickYuuStep,
  pickYamatoBySize,
  type YuuServiceType,
} from "@/lib/intl-fare";

export const dynamic = "force-dynamic";

const SUPPORTED_COUNTRIES = new Set(["TW", "KR", "CN"]);
const VALID_YAMATO_SIZES = new Set(["b4_doc", "60", "80", "100", "120", "140", "160"]);

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const country = (sp.get("country") ?? "").toUpperCase();
  const weightG = Number(sp.get("weight_g"));
  const yamatoSize = sp.get("yamato_size");

  if (!country || !Number.isFinite(weightG) || weightG <= 0) {
    return json(
      {
        error: "missing_param",
        required: ["country (ISO2)", "weight_g (positive int)"],
        optional: ["yamato_size (b4_doc|60|80|100|120|140|160)"],
        example: "/api/intl-quote?country=TW&weight_g=20000&yamato_size=140",
      },
      400,
    );
  }
  if (!SUPPORTED_COUNTRIES.has(country)) {
    return json(
      { error: "unsupported_country", country, supported: [...SUPPORTED_COUNTRIES] },
      400,
    );
  }
  if (yamatoSize && !VALID_YAMATO_SIZES.has(yamatoSize)) {
    return json(
      { error: "invalid_yamato_size", allowed: [...VALID_YAMATO_SIZES] },
      400,
    );
  }

  const [yuuAll, yamatoAll] = await Promise.all([
    loadYuuIntlFares(country),
    loadYamatoIntlFares(country),
  ]);

  // 郵便局四服務(只在該國有資料時回傳)
  const yuuByService: Record<YuuServiceType, typeof yuuAll> = {
    ems: yuuAll.filter((r) => r.service_type === "ems"),
    parcel_air: yuuAll.filter((r) => r.service_type === "parcel_air"),
    parcel_sal: yuuAll.filter((r) => r.service_type === "parcel_sal"),
    parcel_surface: yuuAll.filter((r) => r.service_type === "parcel_surface"),
  };

  const yuuQuote = (svc: YuuServiceType) => {
    const rows = yuuByService[svc];
    if (rows.length === 0) return { available: false };
    const pick = pickYuuStep(rows, weightG);
    if (!pick) {
      const maxG = Math.max(...rows.map((r) => r.weight_grams));
      return {
        available: true,
        overweight: true,
        max_weight_g: maxG,
        price_jpy: null,
      };
    }
    return {
      available: true,
      overweight: false,
      step_weight_g: pick.grams,
      price_jpy: pick.priceJpy,
    };
  };

  // Yamato — 只有 yamato_size 給了才試算
  let yamato: unknown = { available: yamatoAll.length > 0, queried: false };
  if (yamatoSize && yamatoAll.length > 0) {
    const weightKg = weightG / 1000;
    const pick = pickYamatoBySize(yamatoAll, yamatoSize, weightKg);
    yamato = {
      available: true,
      queried: true,
      size_code: yamatoSize,
      weight_kg: weightKg,
      price_jpy: pick.priceJpy,
      max_weight_kg: pick.maxKg,
      oversize: pick.oversize,
      suggest_size_code: pick.suggestSizeCode ?? null,
    };
  }

  return json({
    country,
    weight_g: weightG,
    yuu: {
      ems: yuuQuote("ems"),
      parcel_air: yuuQuote("parcel_air"),
      parcel_sal: yuuQuote("parcel_sal"),
      parcel_surface: yuuQuote("parcel_surface"),
    },
    yamato,
  });
}
