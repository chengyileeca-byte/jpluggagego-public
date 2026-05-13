// 宿泊予約サイト検索チップ群。
//
// 戦略:アフィリエイトリンクなし。ユーザーに 5 サイトから選ばせる(業界透明慣行)。
// Booking.com / 楽天トラベル / じゃらん / 一休 / Google Hotels の汎用検索 URL を生成。
//
// Aggregate detection:
//   一部 entry は特定 property ではなく地区集約説明
//   (例:「砥部焼陶芸の里旅館 + 砥部温泉(5+ 軒+ 派生)」)。
//   こうした entry を name で deep-link すると booking 側で hit しない/間違う。
//   → title マーカーや sub_type で aggregate 判定し、municipality_ja で area 検索に切替。
//
// Aggregate 例:
//   - title に「+ N 軒」「派生」「エリア住宿」「一覧」「軒以上」
//   - sub_type === 'lodging_area_guide'
// Specific 例:
//   - 「ANA クラウンプラザホテル奈良」(sub_type: luxury_hotel, 単一施設)

const AGGREGATE_TITLE_PATTERN =
  /[+＋]\s*\d+\s*軒|派生|エリア住宿|一覧|軒以上|宿泊先\s*まとめ|周辺の宿/;
const AGGREGATE_SUB_TYPES = new Set(["lodging_area_guide"]);

function isAggregateLodging(titleZh: string, subType: string | null): boolean {
  if (subType && AGGREGATE_SUB_TYPES.has(subType)) return true;
  return AGGREGATE_TITLE_PATTERN.test(titleZh);
}

// 末尾括弧説明を剝離(GoogleMapsLink と同パターン):
//   「ANA クラウンプラザホテル奈良(JR 奈良駅近)」→「ANA クラウンプラザホテル奈良」
const stripParen = (s: string | null | undefined): string =>
  (s ?? "").replace(/\s*[(（].*$/u, "").trim();

type BookingSite = {
  id: string;
  label: string;
  buildUrl: (query: string) => string;
};

// 検索 URL は各サイトの公開検索エンドポイント。
// アフィリエイトコードや tracking parameter なし。
//
// 楽天 / じゃらん / 一休 は GET keyword URL が壊れている(JS submit 化 + 旧 .do endpoint 廃止 + Akamai bot block)
// ので Google site: 検索経由で 1-click 到達。Booking / Google Hotels は直リンク。
const BOOKING_SITES: BookingSite[] = [
  {
    id: "booking",
    label: "Booking.com",
    buildUrl: (q) =>
      `https://www.booking.com/searchresults.ja.html?ss=${encodeURIComponent(q)}`,
  },
  {
    id: "rakuten",
    label: "楽天トラベル",
    buildUrl: (q) =>
      `https://www.google.com/search?q=${encodeURIComponent(`site:travel.rakuten.co.jp ${q} ホテル`)}`,
  },
  {
    id: "jalan",
    label: "じゃらん",
    buildUrl: (q) =>
      `https://www.google.com/search?q=${encodeURIComponent(`site:jalan.net ${q} 宿泊`)}`,
  },
  {
    id: "ikyu",
    label: "一休",
    buildUrl: (q) =>
      `https://www.google.com/search?q=${encodeURIComponent(`site:ikyu.com ${q}`)}`,
  },
  {
    id: "google-hotels",
    label: "Google Hotels",
    buildUrl: (q) =>
      `https://www.google.com/travel/search?q=${encodeURIComponent(q)}`,
  },
];

export function LodgingBookingChips({
  titleJa,
  titleZh,
  municipalityJa,
  subType,
}: {
  titleJa: string | null;
  titleZh: string;
  municipalityJa: string | null;
  subType: string | null;
}) {
  const aggregate = isAggregateLodging(titleZh, subType);

  // Aggregate → 市町村のみで area 検索(具体施設名ないので)
  // Specific → 施設名(剝括號)+ 市町村で精密検索
  const query = aggregate
    ? (municipalityJa ?? (stripParen(titleJa) || stripParen(titleZh)))
    : `${stripParen(titleJa) || stripParen(titleZh)}${municipalityJa ? " " + municipalityJa : ""}`.trim();

  return (
    <section className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="font-mincho text-sm font-medium text-zinc-900 dark:text-zinc-50">
          予約サイトで検索
        </h3>
        {aggregate ? (
          <span className="text-[10px] text-amber-700 dark:text-amber-400">
            エリア検索({municipalityJa ?? "周辺"})
          </span>
        ) : (
          <span className="text-[10px] text-zinc-400 font-mono">
            {query}
          </span>
        )}
      </div>
      {aggregate && (
        <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
          この項目は単一施設ではなくエリア集約説明のため、市町村名で予約サイト検索します。実際の在庫は各サイトで確認してください。
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {BOOKING_SITES.map((site) => (
          <a
            key={site.id}
            href={site.buildUrl(query)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:text-amber-900 dark:hover:text-amber-300 transition"
          >
            {site.label}
          </a>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-zinc-400 leading-relaxed">
        ※ 各サイトの検索結果へリンク(アフィリエイト不使用)。実際に予約可能な在庫はサイト側に表示されます。
      </p>
    </section>
  );
}
