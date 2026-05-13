# JPLuggageGo · 日本宅配比價

[jpluggagego.com](https://jpluggagego.com) — 日本國內 / 機場 ↔ 住宿的行李宅配比價、最近據點查詢,加上 47 都道府縣自助旅行策展。三語(繁中 / 日 / 英)。

## 這是什麼

- **比價**:Yamato 黒猫宅急便 vs 郵便局 ゆうパック,47×47 全都道府縣運費矩陣
- **最近據點**:貼地址 / 座標 / Google Maps 連結,找最近 5 間 Yamato 営業所 + 5 間郵便局
- **機場櫃台**:Yamato 33 筆 + ゆう 13 筆,營業時段、直通電話
- **同日到達**:Airporter 覆蓋對照(NRT / HND / KIX / ITM / CTS / FUK / OKA × 鄰近都道府縣)
- **飯店代收**:APA / 東横 INN / Dormy Inn / 三井ガーデン / Nishitetsu 五大連鎖代收條款
- **/japan 策展**:13,000+ 筆景點 / 美食 / 住宿 / 交通 / 文化 / 娛樂條目,自助旅行者深度策展
- **/planner**:基於景點 pool 的旅程草圖產生器,5 強度 × 6 主題 × 14 天
- **LINE Bot**:輸入「試算 東京 大阪 120」→ Flex Message 回運費對比

## 技術棧

- Next.js 16 App Router · React 19 · TypeScript
- Tailwind CSS
- JSON-as-database(`public/data/*.json`,scraper cron 自動更新)
- Vercel(production)· GitHub Actions(週爬)

## 開發

```bash
npm install
cp .env.example .env.local   # 大部分 env 不設也能跑
npm run dev                  # http://localhost:3000
```

⚠️ **本 repo 不含 `public/data/*`** — scraped data(運費 matrix、營業所、郵便局、飯店)因 Zenrin / 樂天 API TOS 等資料源條款不便公開散布。本地開發需自己跑 `npm run scrape:*`,或預期沒 data 的頁面回 empty。

## 環境變數

看 [`.env.example`](./.env.example)。大部分功能不設 env 也能跑;以下 env 啟用對應功能:

- `GITHUB_FEEDBACK_REPO` + `GITHUB_FEEDBACK_TOKEN`:`/feedback` 表單轉 GitHub Issue
- `LINE_*`:LINE Bot + LINE Login
- `SESSION_SECRET`:LINE Login session cookie 簽章
- `CRON_SECRET`:`/api/cron/track` 認證(GitHub Actions 用)
- `SCRAPER_USER_AGENT`:scrapers User-Agent

## 資料管線

所有 scraper `tsx scripts/*.ts`,支援 `--dry-run` 與 `--limit N`:

| 指令 | 頻率 | 內容 |
|---|---|---|
| `npm run scrape:yamato` | 週 | Yamato 47×47 運費矩陣 |
| `npm run scrape:yuu-pack` | 週 | ゆうパック 47×47×7 矩陣 |
| `npm run scrape:yamato-branches` | 季 | Yamato 営業所全國清單 |
| `npm run scrape:yuu-post` | 週 | 郵便局全國清單(OSM Overpass) |

GitHub Actions 排程位於 [`.github/workflows/`](./.github/workflows/)。

## 文件

- [`AGENTS.md`](./AGENTS.md) — Next.js 16 fork notes(AI agent 工作規範)
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — 貢獻流程
- [`SECURITY.md`](./SECURITY.md) — 漏洞通報

## 授權

[MIT License](./LICENSE) — 原始碼自由使用、改作、商用。

**資料來源 attribution**:

- 郵便局位置 © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright)
- 郵便番號 © 日本郵便株式会社(ken_all.csv,public domain factual data)
- Yamato 運費 / 営業所:scraped from kuronekoyamato.co.jp(本 repo 不重新散布)
- ゆうパック 運費:scraped from post.japanpost.jp(本 repo 不重新散布)
- 樂天 Hotel:Rakuten Travel API(申請制免費,本 repo 不重新散布抓取結果)
