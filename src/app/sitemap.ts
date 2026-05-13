import type { MetadataRoute } from "next";
import { POPULAR_ROUTES } from "@/lib/routes";
import { listEntriesForSitemap, listMunicipalities } from "@/lib/japan-entries";

const BASE_URL = "https://jpluggagego.com";

// ISR — sitemap を 1 時間に 1 回生成。Google crawl 毎回 DB 全 fetch を防ぐ。
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routeEntries = POPULAR_ROUTES.map((r) => ({
    url: `${BASE_URL}/routes/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // JapanPrep:條目頁 + 北海道 / 京都府 / 沖縄県 市町村頁(Phase 1+)
  let japanUrls: MetadataRoute.Sitemap = [];
  try {
    // sitemap は slug + updated_at だけあれば OK。content_md 等を pull しない軽量版。
    const [entries, hokkaidoMunis, kyotoMunis, naraMunis, okinawaMunis] = await Promise.all([
      listEntriesForSitemap(),
      listMunicipalities({ region: "hokkaido" }),
      listMunicipalities({ prefecture_ja: "京都府" }),
      listMunicipalities({ prefecture_ja: "奈良県" }),
      listMunicipalities({ prefecture_ja: "沖縄県" }),
    ]);

    const entryUrls = entries.map((e) => {
      const t = e.updated_at ? new Date(e.updated_at) : null;
      return {
        url: `${BASE_URL}/japan/entry/${e.slug}`,
        lastModified: t && !isNaN(t.getTime()) ? t : now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });

    const municipalityUrls = [
      ...hokkaidoMunis,
      ...kyotoMunis,
      ...naraMunis,
      ...okinawaMunis,
    ]
      .filter((m) => m.kind !== "prefecture")
      .map((m) => ({
        url: `${BASE_URL}/japan/area/${encodeURIComponent(m.prefecture_ja)}/${encodeURIComponent(m.name_ja)}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      }));

    japanUrls = [
      {
        url: `${BASE_URL}/japan`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/japan/entertainment`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      },
      {
        url: `${BASE_URL}/japan/food`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      },
      {
        url: `${BASE_URL}/japan/lodging`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      },
      {
        url: `${BASE_URL}/japan/transport`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      },
      {
        url: `${BASE_URL}/japan/fashion`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      },
      {
        url: `${BASE_URL}/japan/culture`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      },
      {
        url: `${BASE_URL}/japan/area/${encodeURIComponent("北海道")}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/japan/area/${encodeURIComponent("京都府")}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/japan/area/${encodeURIComponent("奈良県")}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/japan/area/${encodeURIComponent("沖縄県")}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      ...entryUrls,
      ...municipalityUrls,
    ];
  } catch (err) {
    // sitemap 不該因 DB 失敗就整個掛掉 — 靜默跳過 JapanPrep URLs。
    console.error("[sitemap] JapanPrep entries fetch failed", err);
  }

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/quote`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/trip`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guide/shipping`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/guide/shipping/airport-counter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guide/shipping/branch-office`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guide/shipping/hotel-forward`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guide/shipping/qr-app`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/to-taiwan`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...routeEntries,
    ...japanUrls,
  ];
}
