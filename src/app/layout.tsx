import type { Metadata } from "next";
import { Geist, Geist_Mono, Shippori_Mincho } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { htmlLangAttr, t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { SiteFooter } from "./_site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 千年古都 archive aesthetic — used in /japan area browser, entry titles, etc.
const shipporiMincho = Shippori_Mincho({
  variable: "--font-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const brand = t(lang, "site.brand");
  const tagline = t(lang, "site.tagline");
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://jpluggagego.com",
    ),
    title: {
      default: `${brand} · ${tagline}`,
      template: `%s · ${brand}`,
    },
    description:
      lang === "ja"
        ? "空港・ホテル → ホテル 手荷物配送の料金比較。ヤマト運輸 vs 郵便局ゆうパックを47都道府県単位で検索。"
        : lang === "en"
          ? "Airport/hotel → hotel luggage forwarding fare comparison. Yamato vs Japan Post across all 47 prefectures."
          : "機場/飯店 → 飯店 行李寄送料金比價。Yamato 黒猫宅急便 vs 郵便局 ゆうパック,以都道府県為單位查定價。",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();
  return (
    <html
      lang={htmlLangAttr(lang)}
      className={`${geistSans.variable} ${geistMono.variable} ${shipporiMincho.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
