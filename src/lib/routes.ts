// Popular routes featured on the home page and surfaced as individual
// SEO landing pages at /routes/[slug]. `fromPref` is the DB key used to
// look up prices in yamato_fares / yuu_pack_fares — it equals the
// prefecture that hosts the airport when fromKind === "airport".

export interface PopularRoute {
  slug: string;
  label: string;
  subKey: string;
  fromKind: "airport" | "pref";
  fromCode?: string;
  fromPref: string;
  fromLabel: string;
  toPref: string;
}

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    slug: "nrt-to-tokyo",
    label: "NRT → 東京都",
    subKey: "home.route.nrt_tokyo.sub",
    fromKind: "airport",
    fromCode: "NRT",
    fromPref: "千葉県",
    fromLabel: "NRT 成田空港",
    toPref: "東京都",
  },
  {
    slug: "hnd-to-tokyo",
    label: "HND → 東京都",
    subKey: "home.route.hnd_tokyo.sub",
    fromKind: "airport",
    fromCode: "HND",
    fromPref: "東京都",
    fromLabel: "HND 羽田空港",
    toPref: "東京都",
  },
  {
    slug: "kix-to-osaka",
    label: "KIX → 大阪府",
    subKey: "home.route.kix_osaka.sub",
    fromKind: "airport",
    fromCode: "KIX",
    fromPref: "大阪府",
    fromLabel: "KIX 関西空港",
    toPref: "大阪府",
  },
  {
    slug: "kix-to-kyoto",
    label: "KIX → 京都府",
    subKey: "home.route.kix_kyoto.sub",
    fromKind: "airport",
    fromCode: "KIX",
    fromPref: "大阪府",
    fromLabel: "KIX 関西空港",
    toPref: "京都府",
  },
  {
    slug: "cts-to-hokkaido",
    label: "CTS → 北海道",
    subKey: "home.route.cts_hokkaido.sub",
    fromKind: "airport",
    fromCode: "CTS",
    fromPref: "北海道",
    fromLabel: "CTS 新千歳空港",
    toPref: "北海道",
  },
  {
    slug: "fuk-to-fukuoka",
    label: "FUK → 福岡県",
    subKey: "home.route.fuk_fukuoka.sub",
    fromKind: "airport",
    fromCode: "FUK",
    fromPref: "福岡県",
    fromLabel: "FUK 福岡空港",
    toPref: "福岡県",
  },
  {
    slug: "tokyo-to-osaka",
    label: "東京都 → 大阪府",
    subKey: "home.route.tokyo_osaka.sub",
    fromKind: "pref",
    fromPref: "東京都",
    fromLabel: "東京都",
    toPref: "大阪府",
  },
  {
    slug: "tokyo-to-fukuoka",
    label: "東京都 → 福岡県",
    subKey: "home.route.tokyo_fukuoka.sub",
    fromKind: "pref",
    fromPref: "東京都",
    fromLabel: "東京都",
    toPref: "福岡県",
  },
];

export function findRouteBySlug(slug: string): PopularRoute | undefined {
  return POPULAR_ROUTES.find((r) => r.slug === slug);
}

export function routeFromParam(r: PopularRoute): string {
  return r.fromKind === "airport"
    ? `airport:${r.fromCode}`
    : `pref:${r.fromPref}`;
}
