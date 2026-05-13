import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_LABEL_ZH,
  getEntryBySlug,
  subTypeLabel,
  type JapanEntry,
} from "@/lib/japan-entries";
import {
  WEEKDAY_LABEL_ZH,
  formatDateShort,
  formatSeasonRange,
  isInSeason,
  priceTierLabel,
} from "@/lib/japan-prep-ui";
import { LocationReportPanel } from "@/components/location-report-panel";
import { GoogleMapsLink } from "@/components/google-maps-link";
import { LodgingBookingChips } from "@/components/japan/lodging-booking-chips";

// ISR — 1 時間に 1 回再生成(force-dynamic は egress 浪費)
export const revalidate = 3600;

const BASE_URL = "https://jpluggagego.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);
  if (!entry) return { title: "條目不存在" };
  return {
    title: `${entry.title_zh} · 日本大小事備忘錄`,
    description: entry.summary_zh,
    alternates: { canonical: `/japan/entry/${entry.slug}` },
    openGraph: {
      title: entry.title_zh,
      description: entry.summary_zh,
      type: "article",
    },
  };
}

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);
  if (!entry) notFound();

  const today = new Date();
  const active = isInSeason(
    { start: entry.season_start, end: entry.season_end },
    today,
  );
  const season = formatSeasonRange({
    start: entry.season_start,
    end: entry.season_end,
  });
  const price = priceTierLabel(entry.price_tier);

  const daysOld = Math.floor(
    (Date.now() - new Date(entry.last_verified_at).getTime()) / 86_400_000,
  );
  const staleClass =
    daysOld > 365
      ? "text-rose-600"
      : daysOld > 180
        ? "text-amber-600"
        : "text-zinc-500";

  const jsonLd = buildJsonLd(entry);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* 路徑:日本大小事 / 類別 / 都道府縣 / 市町村 */}
        <nav className="text-xs text-zinc-500 flex flex-wrap gap-1.5 items-center">
          <Link href="/japan" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            日本大小事備忘錄
          </Link>
          <span>/</span>
          <Link
            href={`/japan/${entry.category}`}
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {CATEGORY_LABEL_ZH[entry.category]}
          </Link>
          <span>/</span>
          <Link
            href={`/japan/area/${encodeURIComponent(entry.prefecture_ja)}`}
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {entry.prefecture_ja}
          </Link>
          {entry.municipality_ja && (
            <>
              <span>/</span>
              <Link
                href={`/japan/area/${encodeURIComponent(entry.prefecture_ja)}/${encodeURIComponent(entry.municipality_ja)}`}
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {entry.municipality_ja}
              </Link>
            </>
          )}
        </nav>

        <header className="mt-6">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-700 dark:text-zinc-300">
              {CATEGORY_LABEL_ZH[entry.category]} · {subTypeLabel(entry.sub_type)}
            </span>
            {active && (
              <span className="rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-medium">
                進行中
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {entry.title_zh}
          </h1>
          {(entry.title_ja || entry.romaji) && (
            <p className="mt-1 text-sm text-zinc-500">
              {entry.title_ja}
              {entry.title_ja && entry.romaji && " · "}
              {entry.romaji && (
                <span className="font-mono text-[12px]">{entry.romaji}</span>
              )}
            </p>
          )}
          <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {entry.summary_zh}
          </p>

          {/* pending_rewrite banner — #118 stub entry(深度内容整備中) */}
          {entry.pending_rewrite && (
            <div className="mt-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 p-3">
              <p className="text-xs text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">📝 內容整備中</span>
                {" — "}
                此條目深度介紹正在補完。位置 / 房型 / 價位請參考下方予約サイト檢索;
                歡迎透過下方「社群驗證」協助回報實地資訊。
              </p>
            </div>
          )}

          {/* Google Places business_status banner(D' 系統)*/}
          {entry.business_status === "CLOSED_PERMANENTLY" && (
            <div className="mt-4 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-bold text-rose-800 dark:text-rose-200">
                  ⚠️ 已結束營業
                </span>
                {entry.business_status_checked_at && (
                  <span className="text-[11px] text-rose-600 dark:text-rose-400">
                    (Google 偵測 ·{" "}
                    {new Date(entry.business_status_checked_at)
                      .toISOString()
                      .slice(0, 10)}
                    )
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
                此據點 Google Maps 上已標示永久結束營業。資料保留供參考,
                但已從推薦列表隱藏。如有誤,請從 LINE 回報。
              </p>
            </div>
          )}
          {entry.business_status === "CLOSED_TEMPORARILY" && (
            <div className="mt-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  🚧 臨時休業中
                </span>
                {entry.business_status_checked_at && (
                  <span className="text-[11px] text-amber-700 dark:text-amber-400">
                    (Google 偵測 ·{" "}
                    {new Date(entry.business_status_checked_at)
                      .toISOString()
                      .slice(0, 10)}
                    )
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                可能是季節限定、整修中或裝修。出發前請確認官網最新公告。
              </p>
            </div>
          )}

          <div className="mt-4">
            <PrimaryAction entry={entry} />
          </div>
        </header>

        {/* metadata 表 */}
        <section className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
          {season && <Row label="季節"><span className="font-mono">{season}</span></Row>}
          {entry.event_start && (
            <Row label="活動">
              {formatDateShort(entry.event_start)}
              {entry.event_end && entry.event_end !== entry.event_start && (
                <> – {formatDateShort(entry.event_end)}</>
              )}
            </Row>
          )}
          {price && <Row label="價位">{price}</Row>}
          {entry.booking_window_days !== null &&
            entry.booking_window_days !== undefined && (
              <Row label="建議預約">
                提前 {entry.booking_window_days} 天
              </Row>
            )}
          {entry.closed_days.length > 0 && (
            <Row label="公休">
              {entry.closed_days
                .map((d) => WEEKDAY_LABEL_ZH[d] ?? d)
                .join("、")}
            </Row>
          )}
          {entry.area_types.length > 0 && (
            <Row label="地域類型">{entry.area_types.join("、")}</Row>
          )}
          {entry.tags.length > 0 && (
            <Row label="標籤">
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-700 dark:text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Row>
          )}
        </section>

        <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
          ※ 季節與活動日期為編輯整理,實際以官方公告為準;出發前請確認當年最新時程。
        </p>

        {/* 宿泊予約 — lodging entry のみ。
            Aggregate(地区集約)entry は municipality_ja で area 検索に切替。 */}
        {entry.category === "lodging" && (
          <LodgingBookingChips
            titleJa={entry.title_ja}
            titleZh={entry.title_zh}
            municipalityJa={entry.municipality_ja}
            subType={entry.sub_type}
          />
        )}

        {/* UGC 回報 — 你去過 / 現場不符 / 資料錯 */}
        <section className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
          <h2 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            社群驗證
          </h2>
          <LocationReportPanel
            entityType="japan_entry"
            entityId={entry.slug}
            entityLabel={entry.title_zh}
          />
        </section>

        {/* 正文 markdown */}
        {entry.content_md && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              內容
            </h2>
            <div className="mt-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <SimpleMarkdown text={entry.content_md} />
            </div>
          </section>
        )}

        {/* 外部連結 */}
        {normalizeExternalUrls(entry.external_urls).length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              外部資源
            </h2>
            <ul className="mt-3 space-y-1.5">
              {normalizeExternalUrls(entry.external_urls).map(({ key, url, hasNamedKey }, i) => (
                <li key={`${key}-${i}`} className="text-sm">
                  {hasNamedKey && (
                    <span className="text-zinc-500 mr-2">{urlLabel(key)}:</span>
                  )}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sky-700 dark:text-sky-400 hover:underline break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
          <p>
            來源:{entry.source === "manual" ? "編輯手動整理" : entry.source} ·
            <span className={`ml-1 ${staleClass}`}>
              verified {daysOld} 天前
            </span>
            {entry.lg_code && <> · LG {entry.lg_code}</>}
          </p>
          <p className="mt-1">
            本頁為編輯整理的原創繁中摘要,資料可能有誤差,以官方公告為準。
          </p>
        </footer>
      </div>
    </main>
  );
}

// Google Maps 一律表示(title_ja + municipality_ja から検索 URL 自動生成、google_place_id 不要)。
// 加えて external_urls の代表 URL を「官方」secondary chip として並列表示。
const URL_PRIORITY = [
  "official",
  "wikipedia",
  "tabelog",
  "jalan",
  "booking",
  "instagram",
  "twitter",
];
function pickPrimaryExternalUrl(
  urls: Record<string, string> | string[] | undefined,
): { key: string; url: string } | null {
  if (!urls) return null;
  if (Array.isArray(urls)) {
    return urls.length > 0 ? { key: "official", url: urls[0] } : null;
  }
  for (const k of URL_PRIORITY) {
    if (urls[k]) return { key: k, url: urls[k] };
  }
  const keys = Object.keys(urls);
  if (keys.length > 0) return { key: keys[0], url: urls[keys[0]] };
  return null;
}
const FALLBACK_LABEL: Record<string, string> = {
  official: "官方網站",
  wikipedia: "Wikipedia",
  tabelog: "Tabelog",
  jalan: "Jalan",
  booking: "Booking",
  instagram: "Instagram",
  twitter: "Twitter",
};
function PrimaryAction({ entry }: { entry: JapanEntry }) {
  const externalPick = pickPrimaryExternalUrl(entry.external_urls);
  return (
    <div className="flex flex-wrap gap-2">
      <GoogleMapsLink
        titleJa={entry.title_ja}
        titleZh={entry.title_zh}
        municipalityJa={entry.municipality_ja}
      />
      {externalPick && (
        <a
          href={externalPick.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-3 py-1 text-xs text-amber-900 dark:text-amber-200 transition"
        >
          🌐 {FALLBACK_LABEL[externalPick.key] ?? externalPick.key}
        </a>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-3">
      <span className="w-20 shrink-0 text-xs text-zinc-500">{label}</span>
      <div className="flex-1 text-sm text-zinc-800 dark:text-zinc-200">
        {children}
      </div>
    </div>
  );
}

const URL_LABELS: Record<string, string> = {
  official: "官方網站",
  tabelog: "Tabelog",
  jalan: "Jalan",
  booking: "Booking",
  wikipedia: "Wikipedia",
};
function urlLabel(key: string): string {
  return URL_LABELS[key] ?? key;
}

// external_urls は dict (named keys: "official"/"wikipedia"/etc) と list (bare URLs) の両方が DB に混在。
// dict は名前付きラベル表示、list は URL のみ表示(「0:」「1:」ラベルなし)。
function normalizeExternalUrls(
  urls: Record<string, string> | string[] | undefined,
): { key: string; url: string; hasNamedKey: boolean }[] {
  if (!urls) return [];
  if (Array.isArray(urls)) {
    return urls.map((u, i) => ({ key: String(i), url: u, hasNamedKey: false }));
  }
  return Object.entries(urls).map(([key, url]) => ({ key, url, hasNamedKey: true }));
}

// 極簡 markdown 渲染:支援 `- ` 列表、空行分段、**粗體**。
// 不引入 remark/react-markdown 以避免加依賴;seed 內容也只用這幾種。
function SimpleMarkdown({ text }: { text: string }) {
  const blocks = splitBlocks(text);
  return (
    <div className="space-y-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
      {blocks.map((b, i) => {
        if (b.kind === "ul") {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {b.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(b.text)}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

function splitBlocks(src: string): Block[] {
  const lines = src.split("\n");
  const blocks: Block[] = [];
  let paraBuf: string[] = [];
  let listBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length > 0) {
      blocks.push({ kind: "p", text: paraBuf.join("\n") });
      paraBuf = [];
    }
  };
  const flushList = () => {
    if (listBuf.length > 0) {
      blocks.push({ kind: "ul", items: listBuf });
      listBuf = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("- ")) {
      flushPara();
      listBuf.push(line.slice(2));
    } else if (line === "") {
      flushPara();
      flushList();
    } else {
      flushList();
      paraBuf.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

// 行內:**text** → <strong>
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-zinc-900 dark:text-zinc-100">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

// JSON-LD builder。
// - event_start 有 → Event
// - 其餘 → TouristAttraction(最通用)
function buildJsonLd(entry: JapanEntry): Record<string, unknown> {
  const url = `${BASE_URL}/japan/entry/${entry.slug}`;
  const location = [
    entry.municipality_ja,
    entry.gun_ja ? `${entry.gun_ja}` : null,
    entry.prefecture_ja,
    "Japan",
  ]
    .filter(Boolean)
    .join(", ");

  const geo =
    entry.lat !== null && entry.lon !== null
      ? {
          "@type": "GeoCoordinates",
          latitude: entry.lat,
          longitude: entry.lon,
        }
      : undefined;

  const sameAs = Object.values(entry.external_urls).filter(Boolean);

  if (entry.event_start) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: entry.title_zh,
      description: entry.summary_zh,
      startDate: entry.event_start,
      endDate: entry.event_end ?? undefined,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: location,
        address: {
          "@type": "PostalAddress",
          addressCountry: "JP",
          addressRegion: entry.prefecture_ja,
          addressLocality: entry.municipality_ja ?? undefined,
        },
        geo,
      },
      url,
      ...(sameAs.length > 0 ? { sameAs } : {}),
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: entry.title_zh,
    description: entry.summary_zh,
    url,
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: entry.prefecture_ja,
      addressLocality: entry.municipality_ja ?? undefined,
    },
    geo,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
