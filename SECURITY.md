# Security Policy

## 通報窗口

請**私下**通報,不要在 public issue 或 PR 描述漏洞細節。

- Email:chengyilee.ca@gmail.com
- 標題請帶 `[SECURITY]` 開頭

## 內容請含

- **影響範圍**:會怎樣?(資料外洩 / RCE / XSS / 認證繞過 / 其他)
- **重現步驟**:最小化的 PoC,curl / browser steps
- **affected 程式碼位置**:檔案 + 行號,或 commit hash
- **建議修法**(若有想法)

## 我會做什麼

- 收到後 7 天內回覆確認
- 已 fix 後會在 commit message / changelog credit 通報者(若你願意公開)
- 重大漏洞修完會公開 advisory(GitHub Security Advisory)

## 不在範圍

- Rate-limit / DoS by flooding(serverless 平台層處理)
- 自簽 / 過期 cert(由 Vercel 管)
- 第三方依賴的已知 CVE(請看 `npm audit`,我們會定期 update)
- 程式設計優劣(那是 PR / issue,不是 security)

## 範圍

- `jpluggagego.com` 線上服務
- 本 repo 內所有原始碼

不含:contributors fork 的 instance、自架部署環境的設定錯誤。
