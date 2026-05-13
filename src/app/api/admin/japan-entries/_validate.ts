import {
  AREA_TYPES,
  CATEGORIES,
  REGIONS,
  SUB_TYPES_BY_CATEGORY,
  type AreaType,
  type Category,
  type JapanEntryInput,
  type Region,
} from "@/lib/japan-entries";

type ValidationResult =
  | { error: string }
  | { value: Partial<JapanEntryInput> };

// 校驗前端送來的 payload,回傳乾淨的 insertable / patchable 物件。
// 所有 null/empty string 正規化。未識別欄位直接丟,不讓它進 DB。
export function validateEntryInput(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { error: "body_not_object" };
  }
  const b = body as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  // slug
  if ("slug" in b) {
    if (typeof b.slug !== "string" || !/^[a-z0-9][a-z0-9-]{1,80}$/.test(b.slug)) {
      return { error: "invalid_slug" };
    }
    out.slug = b.slug;
  }

  // category
  if ("category" in b) {
    if (!CATEGORIES.includes(b.category as Category)) {
      return { error: "invalid_category" };
    }
    out.category = b.category;
  }

  // sub_type — 必須落在所選 category 的清單內;若 category 未給,允許自由文字。
  if ("sub_type" in b) {
    if (typeof b.sub_type !== "string" || b.sub_type.length === 0) {
      return { error: "invalid_sub_type" };
    }
    const cat = (out.category ?? b.category) as Category | undefined;
    if (cat && CATEGORIES.includes(cat)) {
      const allowed = SUB_TYPES_BY_CATEGORY[cat];
      if (!allowed.includes(b.sub_type)) {
        return { error: `sub_type_not_in_${cat}` };
      }
    }
    out.sub_type = b.sub_type;
  }

  // 繁中文字欄位
  for (const f of ["title_zh", "summary_zh"] as const) {
    if (f in b) {
      if (typeof b[f] !== "string" || (b[f] as string).trim().length === 0) {
        return { error: `invalid_${f}` };
      }
      out[f] = (b[f] as string).trim();
    }
  }
  for (const f of ["title_ja", "romaji", "content_md"] as const) {
    if (f in b) {
      if (b[f] === null || b[f] === "") {
        out[f] = null;
      } else if (typeof b[f] === "string") {
        out[f] = (b[f] as string).trim();
      } else {
        return { error: `invalid_${f}` };
      }
    }
  }

  // region / prefecture_ja
  if ("region" in b) {
    if (!REGIONS.includes(b.region as Region)) {
      return { error: "invalid_region" };
    }
    out.region = b.region;
  }
  if ("prefecture_ja" in b) {
    if (typeof b.prefecture_ja !== "string" || b.prefecture_ja.length === 0) {
      return { error: "invalid_prefecture_ja" };
    }
    out.prefecture_ja = b.prefecture_ja;
  }

  // 可空字串欄位
  for (const f of ["gun_ja", "municipality_ja", "lg_code"] as const) {
    if (f in b) {
      if (b[f] === null || b[f] === "") {
        out[f] = null;
      } else if (typeof b[f] === "string") {
        out[f] = b[f];
      } else {
        return { error: `invalid_${f}` };
      }
    }
  }

  // lg_code 格式
  if (out.lg_code && !/^\d{5}$/.test(out.lg_code as string)) {
    return { error: "invalid_lg_code_format" };
  }

  // area_types 陣列
  if ("area_types" in b) {
    if (!Array.isArray(b.area_types)) {
      return { error: "invalid_area_types" };
    }
    const set: AreaType[] = [];
    for (const t of b.area_types) {
      if (!AREA_TYPES.includes(t as AreaType)) {
        return { error: `invalid_area_type_${t}` };
      }
      set.push(t as AreaType);
    }
    out.area_types = set;
  }

  // 座標
  for (const f of ["lat", "lon"] as const) {
    if (f in b) {
      if (b[f] === null || b[f] === "") {
        out[f] = null;
      } else {
        const n = typeof b[f] === "number" ? b[f] : Number(b[f]);
        if (!Number.isFinite(n)) return { error: `invalid_${f}` };
        out[f] = n;
      }
    }
  }

  // date-only
  for (const f of ["season_start", "season_end"] as const) {
    if (f in b) {
      if (b[f] === null || b[f] === "") {
        out[f] = null;
      } else if (typeof b[f] === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b[f])) {
        out[f] = b[f];
      } else {
        return { error: `invalid_${f}` };
      }
    }
  }
  // timestamp
  for (const f of ["event_start", "event_end"] as const) {
    if (f in b) {
      if (b[f] === null || b[f] === "") {
        out[f] = null;
      } else if (typeof b[f] === "string") {
        const d = new Date(b[f]);
        if (Number.isNaN(d.getTime())) return { error: `invalid_${f}` };
        out[f] = d.toISOString();
      } else {
        return { error: `invalid_${f}` };
      }
    }
  }

  // 數值
  if ("price_tier" in b) {
    if (b.price_tier === null || b.price_tier === "") {
      out.price_tier = null;
    } else {
      const n =
        typeof b.price_tier === "number" ? b.price_tier : Number(b.price_tier);
      if (!Number.isInteger(n) || n < 0 || n > 5) {
        return { error: "invalid_price_tier" };
      }
      out.price_tier = n;
    }
  }
  if ("booking_window_days" in b) {
    if (b.booking_window_days === null || b.booking_window_days === "") {
      out.booking_window_days = null;
    } else {
      const n =
        typeof b.booking_window_days === "number"
          ? b.booking_window_days
          : Number(b.booking_window_days);
      if (!Number.isInteger(n) || n < 0) {
        return { error: "invalid_booking_window_days" };
      }
      out.booking_window_days = n;
    }
  }
  if ("feature_rank" in b) {
    const n =
      typeof b.feature_rank === "number"
        ? b.feature_rank
        : Number(b.feature_rank);
    if (!Number.isInteger(n) || n < 0 || n > 3) {
      return { error: "invalid_feature_rank" };
    }
    out.feature_rank = n;
  }

  // 字串陣列
  for (const f of ["closed_days", "tags"] as const) {
    if (f in b) {
      if (!Array.isArray(b[f])) return { error: `invalid_${f}` };
      const arr: string[] = [];
      for (const s of b[f] as unknown[]) {
        if (typeof s !== "string" || s.length === 0) {
          return { error: `invalid_${f}_item` };
        }
        arr.push(s);
      }
      out[f] = arr;
    }
  }

  // external_urls jsonb
  if ("external_urls" in b) {
    if (!b.external_urls || typeof b.external_urls !== "object") {
      return { error: "invalid_external_urls" };
    }
    const urls: Record<string, string> = {};
    for (const [k, v] of Object.entries(b.external_urls as object)) {
      if (typeof v !== "string" || v.length === 0) continue;
      urls[k] = v;
    }
    out.external_urls = urls;
  }

  // source
  if ("source" in b) {
    if (b.source !== "manual" && b.source !== "api" && b.source !== "ugc") {
      return { error: "invalid_source" };
    }
    out.source = b.source;
  }

  // last_verified_at (optional) — 允許 admin 手動更新
  if ("last_verified_at" in b) {
    if (b.last_verified_at === null || b.last_verified_at === "") {
      // undefined → 讓 DB default
      delete out.last_verified_at;
    } else if (typeof b.last_verified_at === "string") {
      const d = new Date(b.last_verified_at);
      if (Number.isNaN(d.getTime())) {
        return { error: "invalid_last_verified_at" };
      }
      out.last_verified_at = d.toISOString();
    } else {
      return { error: "invalid_last_verified_at" };
    }
  }

  return { value: out as Partial<JapanEntryInput> };
}

// 校驗「新增」需要必填欄位齊全。
export function validateCreateRequired(
  v: Partial<JapanEntryInput>,
): string | null {
  const required: (keyof JapanEntryInput)[] = [
    "slug",
    "category",
    "sub_type",
    "title_zh",
    "summary_zh",
    "region",
    "prefecture_ja",
  ];
  for (const k of required) {
    if (!v[k]) return `missing_${k}`;
  }
  return null;
}
