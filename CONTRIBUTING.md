# Contributing

歡迎 issue / PR。但這是個小團隊維護的 side project,請先看下方再動手,可以避免白做工。

## 提 issue 之前

- **問題重現步驟**:URL / 操作 / 預期 vs 實際
- **環境**:瀏覽器版本 / OS / 是否 mobile
- **資料相關**:標明哪個 entry slug / 哪條 route(`?from=X&to_pref=Y&size=Z`)
- 重複 issue 會被 close 並 link 原 issue

## 提 PR 之前

請先開 issue 討論方向,避免做完不被合。**不接受**以下 PR:

- 純風格 lint / 改 import 順序
- 加新依賴(尤其大的 UI library)— 本專案盡量 keep dependency 少
- 修改 `public/data/*`(資料由 scraper 產生,人工改會被下次爬蟲覆蓋)
- 改 `docs/` 內容(這個 repo 的 docs 是 mirror,實際原稿在 private repo)

**接受**:

- Bug fix(尤其 mobile 顯示 / 翻譯錯字)
- 新 scraper / 新 carrier 整合
- a11y / SEO 改善
- 測試補強

## 開發

```bash
git clone https://github.com/chengyileeca-byte/jpluggagego-public.git
cd jpluggagego-public
npm install
cp .env.example .env.local   # 大部分 env 不設也能跑
npm run dev                  # http://localhost:3000
```

注意:本 repo 不含 `public/data/*`(scraped data,法律 / TOS 上不便公開散布)。
本地開發需要的資料需自己跑 `npm run scrape:*`,或對沒有 data 的頁面預期會 404 / empty。

## Code style

- TypeScript strict mode
- 不寫無意義註解(以 self-documenting code 為主)
- Tailwind 直接寫 className,不抽 component-specific util class
- Server component 預設 server-only,要 client interactivity 才加 `"use client"`

## 提 PR 流程

1. Fork → branch → commit
2. Commit message:`type(scope): subject`(看 git log 範例)
3. PR description 含「為什麼這樣改」(不只「what」)
4. 我會 review,可能要求改

## 安全漏洞

**不要在 public issue 提**。請看 [SECURITY.md](./SECURITY.md)。
