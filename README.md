# JPLuggageGo · 日本宅配比價

[jpluggagego.com](https://jpluggagego.com) — Luggage forwarding fare comparison + self-guided travel curation for Japan. Trilingual (Traditional Chinese / Japanese / English).

[繁中 README](#-繁中)

---

## Status (2026-09)

**The site is live as a frozen static archive.** On 2026-08-27 the dynamic app was retired and jpluggagego.com was crawled into 8,654 static HTML pages, now served as pure static assets on Cloudflare Workers — US$0/month, with no runtime left to break.

Why: production had migrated from Vercel to Cloudflare Workers (OpenNext), and measured Worker CPU was **P50 23.8 ms / P99 632 ms against the free plan's 10 ms cap** — once the paid plan ended, roughly 70% of dynamic requests would have failed with Error 1102. Freezing the site into static assets beat leaving it to error out unattended. `audio.jpluggagego.com` (R2) is unaffected.

This repo is a source snapshot from 2026-05-13; the private upstream has 1,600+ commits. Shipped after this snapshot and not included here:

- **Learning mode** — Japanese-learning layer with 6,201 generated audio files served from R2
- **Reader contributions** (2026-09-01) — no-login submissions behind Turnstile, unpublished by default, stored in D1, kept strictly separate from the verified fact layer

## What it does

- **Fare comparison** — Yamato 黒猫宅急便 vs JP Post ゆうパック, full 47×47 prefecture matrix
- **Nearest drop-off** — paste address / coordinates / Google Maps link → top 5 Yamato branches + top 5 post offices
- **Airport counters** — 33 Yamato + 13 JP Post counters with hours and direct phone
- **Same-day arrival** — Airporter coverage across NRT / HND / KIX / ITM / CTS / FUK / OKA + neighbouring prefectures
- **Hotel receive-on-behalf** — APA / Toyoko Inn / Dormy Inn / Mitsui Garden / Nishitetsu chain policies
- **/japan curation** — 13,000+ entries (food / fashion / lodging / transit / culture / entertainment) curated for self-guided travellers
- **/planner** — itinerary draft generator from the entry pool: 5 intensities × 6 themes × up to 14 days
- **LINE Bot** — `試算 東京 大阪 120` → Flex Message fare comparison

## Stack

- Next.js 16 App Router · React 19 · TypeScript
- Tailwind CSS
- JSON-as-database (`public/data/*.json`, refreshed by scraper cron)
- Production history: Vercel → OpenNext on Cloudflare Workers → static freeze on 2026-08-27 (see [Status](#status-2026-09)) · GitHub Actions (weekly scrapes)

## Local development

```bash
npm install
cp .env.example .env.local   # most envs optional
npm run dev                  # http://localhost:3000
```

⚠️ **This repo does not ship `public/data/*`** — scraped data is excluded because Zenrin / Rakuten API / similar source TOS restrict redistribution. Run `npm run scrape:*` locally to populate, or expect data-less pages to render empty.

## Environment variables

See [`.env.example`](./.env.example). Most features work without env. The following enable specific features:

- `GITHUB_FEEDBACK_REPO` + `GITHUB_FEEDBACK_TOKEN` — `/feedback` form posts to GitHub Issues
- `LINE_*` — LINE Bot + LINE Login
- `SESSION_SECRET` — HMAC for LINE Login session cookie
- `CRON_SECRET` — auth for `/api/cron/track` (used by GitHub Actions)
- `SCRAPER_USER_AGENT` — User-Agent for outbound scrapers

## Data pipeline

All scrapers are `tsx scripts/*.ts`, with `--dry-run` and `--limit N` flags:

| Command | Cadence | Contents |
|---|---|---|
| `npm run scrape:yamato` | Weekly | Yamato 47×47 fare matrix |
| `npm run scrape:yuu-pack` | Weekly | ゆうパック 47×47×7 matrix |
| `npm run scrape:yamato-branches` | Quarterly | Yamato branch master list |
| `npm run scrape:yuu-post` | Weekly | Post office list (OSM Overpass) |

GitHub Actions schedules live in [`.github/workflows/`](./.github/workflows/).

## Docs

- [`AGENTS.md`](./AGENTS.md) — Next.js 16 fork notes (rules for AI coding agents)
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — contribution flow
- [`SECURITY.md`](./SECURITY.md) — vulnerability disclosure

## License

[MIT License](./LICENSE) — source code may be used, modified, and distributed freely, including commercially.

**Data attribution:**

- Post office locations © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright)
- Postal codes © Japan Post Co., Ltd. (`ken_all.csv`, factual data)
- Yamato fares / branches — scraped from kuronekoyamato.co.jp (not redistributed in this repo)
- ゆうパック fares — scraped from post.japanpost.jp (not redistributed in this repo)
- Rakuten Travel hotel data — Rakuten Travel API (free with registration; scraped output not redistributed)

---

## 🇹🇼 繁中

[jpluggagego.com](https://jpluggagego.com) — 日本國內 / 機場 ↔ 住宿的行李宅配比價、最近據點查詢,加上 47 都道府縣自助旅行策展。三語(繁中 / 日 / 英)。

### 現況(2026-09)

**站點仍在線上,但已凍結為靜態封存版。** 2026-08-27 動態應用退役,整站爬成 8,654 頁靜態 HTML,以 Cloudflare Workers 純靜態資產供應——每月 $0、沒有會壞的執行時。

原因:production 先前已從 Vercel 遷到 Cloudflare Workers(OpenNext),實測 Worker CPU **P50 23.8 ms / P99 632 ms,對上免費方案 10 ms 上限**——付費方案到期後約七成動態請求會回 Error 1102。與其讓站在無人看管下持續噴錯,不如凍結成靜態資產。`audio.jpluggagego.com`(R2)不受影響。

本 repo 是 2026-05-13 的原始碼快照;私有上游有 1,600+ commits。快照之後上線、不在本 repo 的功能:

- **學習モード**——日語學習層,6,201 個生成音檔由 R2 供應
- **讀者投稿系統**(2026-09-01)——免登入投稿、Turnstile 防濫用、預設不發佈、D1 儲存,讀者內容與查證事實層嚴格分離

### 這是什麼

- **比價**:Yamato 黒猫宅急便 vs 郵便局 ゆうパック,47×47 全都道府縣運費矩陣
- **最近據點**:貼地址 / 座標 / Google Maps 連結,找最近 5 間 Yamato 営業所 + 5 間郵便局
- **機場櫃台**:Yamato 33 筆 + ゆう 13 筆,營業時段、直通電話
- **同日到達**:Airporter 覆蓋對照(NRT / HND / KIX / ITM / CTS / FUK / OKA × 鄰近都道府縣)
- **飯店代收**:APA / 東横 INN / Dormy Inn / 三井ガーデン / Nishitetsu 五大連鎖代收條款
- **/japan 策展**:13,000+ 筆景點 / 美食 / 住宿 / 交通 / 文化 / 娛樂條目,自助旅行者深度策展
- **/planner**:基於景點 pool 的旅程草圖產生器,5 強度 × 6 主題 × 14 天
- **LINE Bot**:輸入「試算 東京 大阪 120」→ Flex Message 回運費對比

### 技術棧

- Next.js 16 App Router · React 19 · TypeScript
- Tailwind CSS
- JSON-as-database(`public/data/*.json`,scraper cron 自動更新)
- Production 歷程:Vercel → OpenNext on Cloudflare Workers → 2026-08-27 靜態凍結(見「現況」)· GitHub Actions(週爬)

### 開發

```bash
npm install
cp .env.example .env.local   # 大部分 env 不設也能跑
npm run dev                  # http://localhost:3000
```

⚠️ **本 repo 不含 `public/data/*`** — scraped data 因 Zenrin / 樂天 API TOS 等資料源條款不便公開散布。本地開發需自己跑 `npm run scrape:*`,或預期沒 data 的頁面回 empty。

### 環境變數

看 [`.env.example`](./.env.example)。大部分功能不設 env 也能跑;以下 env 啟用對應功能:

- `GITHUB_FEEDBACK_REPO` + `GITHUB_FEEDBACK_TOKEN`:`/feedback` 表單轉 GitHub Issue
- `LINE_*`:LINE Bot + LINE Login
- `SESSION_SECRET`:LINE Login session cookie 簽章
- `CRON_SECRET`:`/api/cron/track` 認證(GitHub Actions 用)
- `SCRAPER_USER_AGENT`:scrapers User-Agent

### 資料管線

所有 scraper `tsx scripts/*.ts`,支援 `--dry-run` 與 `--limit N`:

| 指令 | 頻率 | 內容 |
|---|---|---|
| `npm run scrape:yamato` | 週 | Yamato 47×47 運費矩陣 |
| `npm run scrape:yuu-pack` | 週 | ゆうパック 47×47×7 矩陣 |
| `npm run scrape:yamato-branches` | 季 | Yamato 営業所全國清單 |
| `npm run scrape:yuu-post` | 週 | 郵便局全國清單(OSM Overpass) |

GitHub Actions 排程位於 [`.github/workflows/`](./.github/workflows/)。

### 文件

- [`AGENTS.md`](./AGENTS.md) — Next.js 16 fork notes(AI agent 工作規範)
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — 貢獻流程
- [`SECURITY.md`](./SECURITY.md) — 漏洞通報

### 授權

[MIT License](./LICENSE) — 原始碼自由使用、改作、商用。

**資料來源 attribution**:

- 郵便局位置 © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright)
- 郵便番號 © 日本郵便株式会社(ken_all.csv,public domain factual data)
- Yamato 運費 / 営業所:scraped from kuronekoyamato.co.jp(本 repo 不重新散布)
- ゆうパック 運費:scraped from post.japanpost.jp(本 repo 不重新散布)
- 樂天 Hotel:Rakuten Travel API(申請制免費,本 repo 不重新散布抓取結果)
