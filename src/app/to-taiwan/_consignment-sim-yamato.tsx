"use client";

import { useMemo, useState } from "react";
import {
  Field,
  TextAreaField,
  OutputBlock,
  type Hint,
} from "@/components/consignment-form-kit";

function validateRequired(v: string, field: string): Hint {
  return v.trim()
    ? { level: "ok", text: "OK" }
    : { level: "error", text: `${field}必填` };
}

function validatePhoneCountryCode(v: string): Hint {
  const t = v.trim();
  if (!t) return { level: "error", text: "必填 — 沒填會退件" };
  if (!/\+?886|^0886/.test(t)) {
    return { level: "warn", text: "建議加 +886 國碼,例 +886-912-345-678" };
  }
  return { level: "ok", text: "國碼 OK" };
}

function validateItems(v: string): Hint {
  if (!v.trim()) return { level: "error", text: "必填,逐項英文列出" };
  const lower = v.toLowerCase();
  const banned = ["gift", "present", "personal effect"];
  for (const w of banned) {
    if (lower.includes(w)) {
      return {
        level: "error",
        text: `禁用字「${w}」— 關員視為規避申報,退件或扣關`,
      };
    }
  }
  if (/[\u4e00-\u9fa5]/.test(v)) {
    return { level: "warn", text: "Yamato 品名只接受英 / 日文,中文可能被退件" };
  }
  return { level: "ok", text: "OK" };
}

function validateDeclared(v: string): Hint {
  if (!v.trim()) return { level: "error", text: "申告總額必填" };
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return { level: "error", text: "請填正整數 JPY" };
  if (n > 200000) return { level: "warn", text: "> ¥200,000 會觸發正式報關,建議拆箱" };
  return { level: "ok", text: "OK" };
}

export function ConsignmentSimYamato() {
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderAddr, setSenderAddr] = useState("");
  const [recipNameEn, setRecipNameEn] = useState("");
  const [recipNameZh, setRecipNameZh] = useState("");
  const [recipPhone, setRecipPhone] = useState("");
  const [recipAddr, setRecipAddr] = useState("");
  const [items, setItems] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [settleMode, setSettleMode] = useState<"advance" | "later">("advance");
  const [showOutput, setShowOutput] = useState(false);

  const hints = useMemo(
    () => ({
      senderName: validateRequired(senderName, "寄件人姓名"),
      senderPhone: validateRequired(senderPhone, "寄件人電話"),
      senderAddr: validateRequired(senderAddr, "寄件人地址"),
      recipNameEn: validateRequired(recipNameEn, "收件人英文姓名"),
      recipNameZh: validateRequired(recipNameZh, "收件人中文姓名"),
      recipPhone: validatePhoneCountryCode(recipPhone),
      recipAddr: validateRequired(recipAddr, "收件人地址"),
      items: validateItems(items),
      declaredValue: validateDeclared(declaredValue),
    }),
    [
      senderName,
      senderPhone,
      senderAddr,
      recipNameEn,
      recipNameZh,
      recipPhone,
      recipAddr,
      items,
      declaredValue,
    ],
  );

  const hasErrors = Object.values(hints).some((h) => h.level === "error");

  const output = useMemo(
    () =>
      [
        "━━━ Yamato 国際宅急便 · 送り状 謄寫稿 ━━━",
        "",
        "【寄件人 / Sender】",
        ` Name:    ${senderName}`,
        ` Tel:     ${senderPhone}`,
        ` Address: ${senderAddr}`,
        "",
        "【收件人 / Recipient (Taiwan)】",
        ` Name (EN):  ${recipNameEn}`,
        ` Name (ZH):  ${recipNameZh}`,
        ` Tel:        ${recipPhone}`,
        ` Address:    ${recipAddr}`,
        "",
        "【物品明細 / Contents (英文逐項)】",
        items,
        "",
        `【申告総価額 / Declared Value】  JPY ${declaredValue}`,
        "",
        "【用途 / Purpose】  Personal use",
        "",
        `【精算方式】  ${settleMode === "advance" ? "事前精算(避開 ¥3,190 後日精算手数料)" : "後日精算(會多 ¥3,190,不建議)"}`,
        "",
        "【⚠ 櫃台最後確認】",
        " ✓ 箱子已封三圈透明膠帶",
        " ✓ 內無肉類 / 鋰電池 / 行動電源 / 食品 / 噴霧罐",
        " ✓ 化妝品全面確認:香水、指甲油、除光液、染髮劑、**含酒精化妝水** 一律禁寄",
        " ✓ 不含酒精的化妝水 需附 MSDS 成分表(日文或英文)證明無引火性",
        " ✓ 化妝品總量:單品項 ≤ 12 件、合計 ≤ 36 件(含保健品),超量台灣海關會判商業用途",
        " ✓ 請選「事前精算」,不是後日精算",
        " ⚠ 2025-12-21 起 Yamato 新增「禁制品手数料 ¥36,828」— 如果裡面夾到禁寄品被抽查到,會被加收這筆手續費",
        " ⚠ 2026-03-01 起台灣 EZ WAY 強制事前委任:收件人要在 App 點「申報相符」海關才受理報關,不點包裹卡海關倉庫",
        "━━━━━━━━━━━━━━━━━━━━━━━━",
      ].join("\n"),
    [
      senderName,
      senderPhone,
      senderAddr,
      recipNameEn,
      recipNameZh,
      recipPhone,
      recipAddr,
      items,
      declaredValue,
      settleMode,
    ],
  );

  return (
    <div className="mt-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <div className="flex items-center gap-2">
        <span>📝</span>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          送り状 填寫預演器 · Yamato 国際宅急便
        </div>
      </div>
      <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
        在家先填一次,系統即時抓地雷(禁用字、電話國碼、申告金額上限)。確認無誤後產生「謄寫稿」,現場照抄到 Yamato 紙本送り状。
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="寄件人姓名"
          value={senderName}
          onChange={setSenderName}
          hint={hints.senderName}
          placeholder="Your name (英文即可)"
        />
        <Field
          label="寄件人電話"
          value={senderPhone}
          onChange={setSenderPhone}
          hint={hints.senderPhone}
          placeholder="03-1234-5678 或飯店電話"
        />
        <Field
          className="sm:col-span-2"
          label="寄件人地址(可用飯店)"
          value={senderAddr}
          onChange={setSenderAddr}
          hint={hints.senderAddr}
          placeholder="〒100-0005 東京都千代田区 ..."
        />

        <Field
          label="收件人姓名(英文)"
          value={recipNameEn}
          onChange={setRecipNameEn}
          hint={hints.recipNameEn}
          placeholder="WANG Ming"
        />
        <Field
          label="收件人姓名(中文)"
          value={recipNameZh}
          onChange={setRecipNameZh}
          hint={hints.recipNameZh}
          placeholder="王小明"
        />
        <Field
          label="收件人電話(含國碼)"
          value={recipPhone}
          onChange={setRecipPhone}
          hint={hints.recipPhone}
          placeholder="+886-912-345-678"
        />
        <Field
          className="sm:col-span-2"
          label="收件人地址(中英並列最保險)"
          value={recipAddr}
          onChange={setRecipAddr}
          hint={hints.recipAddr}
          placeholder="No.99, Sec.4, Zhongxiao E. Rd., Taipei 105 / 台北市忠孝東路四段 99 號"
        />

        <TextAreaField
          className="sm:col-span-2"
          label="物品明細(英文逐項,數量 × 單價 = 小計)"
          value={items}
          onChange={setItems}
          hint={hints.items}
          placeholder={`Cotton T-shirt x 5, JPY 2,000 each = 10,000\nChocolate box x 2, JPY 1,500 each = 3,000`}
          rows={5}
        />

        <Field
          label="申告總額(JPY)"
          value={declaredValue}
          onChange={setDeclaredValue}
          hint={hints.declaredValue}
          placeholder="13000"
          type="number"
        />

        <div>
          <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            精算方式
          </label>
          <div className="mt-2 flex gap-4 text-xs text-zinc-700 dark:text-zinc-300">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                checked={settleMode === "advance"}
                onChange={() => setSettleMode("advance")}
              />
              <span>事前精算</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                checked={settleMode === "later"}
                onChange={() => setSettleMode("later")}
              />
              <span>後日精算</span>
            </label>
          </div>
          {settleMode === "later" && (
            <div className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
              ⚠ 會多收 ¥3,190 手續費,強烈建議改事前精算
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setShowOutput(true)}
          disabled={hasErrors}
          className="rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-xs font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          產生謄寫稿
        </button>
        {hasErrors && (
          <span className="text-[11px] text-red-600 dark:text-red-400">
            仍有欄位錯誤,修正後才能產生
          </span>
        )}
      </div>

      {showOutput && !hasErrors && (
        <OutputBlock
          title="謄寫稿(在 Yamato 櫃台拿出手機對著抄)"
          text={output}
          footnote="Yamato 櫃台會給紙本送り状,欄位順序與此一致。對照抄完櫃台會協助校對、貼條碼。"
        />
      )}
    </div>
  );
}
