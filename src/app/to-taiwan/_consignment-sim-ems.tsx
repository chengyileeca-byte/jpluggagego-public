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
    return { level: "warn", text: "EMS 品名建議英 / 日文,中文可能影響通關" };
  }
  return { level: "ok", text: "OK" };
}

function validateDeclared(v: string): Hint {
  if (!v.trim()) return { level: "error", text: "申告總額必填" };
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return { level: "error", text: "請填正整數 JPY" };
  return { level: "ok", text: "OK" };
}

/** EMS CN22 / CN23 依申告価値分岔:≤ 300 SDR(2026-01 匯率 ≈ ¥60,000)用 CN22,超過用 CN23。 */
const CN22_THRESHOLD_JPY = 60_000;
/** 台灣 簡易申報 vs 正式報關 門檻:CIF ≥ TWD 50,000(≈ ¥230,000)通常轉正式報關。 */
const FORMAL_CUSTOMS_THRESHOLD_JPY = 230_000;
/** 台灣 免稅門檻:CIF ≤ NT$2,000(≈ ¥9,000)且半年 ≤ 6 次 → 原則免稅直送。 */
const DUTY_FREE_THRESHOLD_JPY = 9_000;

export function ConsignmentSimEms() {
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderAddr, setSenderAddr] = useState("");
  const [recipNameEn, setRecipNameEn] = useState("");
  const [recipNameZh, setRecipNameZh] = useState("");
  const [recipPhone, setRecipPhone] = useState("");
  const [recipAddr, setRecipAddr] = useState("");
  const [items, setItems] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [purpose, setPurpose] = useState<"personal" | "sample" | "returned" | "sale">("personal");
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
  const declaredNum = Number(declaredValue) || 0;
  const formType = declaredNum <= CN22_THRESHOLD_JPY ? "CN22" : "CN23";
  const mayBeDutyFree = declaredNum > 0 && declaredNum <= DUTY_FREE_THRESHOLD_JPY;
  const willGoFormal = declaredNum >= FORMAL_CUSTOMS_THRESHOLD_JPY;

  const purposeLabel = {
    personal: "Personal use / 個人使用",
    sample: "Sample / 商品見本",
    returned: "Returned goods / 返送品",
    sale: "Sale of goods / 販売用",
  }[purpose];

  const output = useMemo(
    () =>
      [
        "━━━ 郵便局 EMS · 送り状 + 関税申告書 謄寫稿 ━━━",
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
        `【関税申告書】  ${formType}${formType === "CN22" ? "(価値 ≤ 300 SDR,綠色小票)" : "(価値 > 300 SDR,白色大表)"}`,
        "",
        "【物品明細 / Contents (英文逐項)】",
        items,
        "",
        `【申告総価額 / Declared Value】  JPY ${declaredValue}`,
        "",
        `【用途 / Purpose】  ${purposeLabel}`,
        "",
        "【⚠ EZ WAY 事前委任(2026-03-01 起強制)】  抵台前下載「EZ WAY 易利委」App → 身分證+健保卡註冊 → 開推播。",
        "  · 海關推播後要在 App 點「申報相符」海關才受理報關",
        "  · 48 小時未點部分業者收倉儲費(≥ NT$450)、2-7 天退運",
        mayBeDutyFree
          ? "  · 本件 X2 免稅(申告額 ≤ ¥9,000 + 半年 6 次內)→ 不繳稅但仍要事前委任"
          : willGoFormal
            ? "  · 本件 G1 正式報關(申告額 > ¥230,000)→ 另需紙本個人委任書 + 身分證影本 + 報關行"
            : "  · 本件 X3 應稅(¥9,000~¥230,000)→ 關稅+營業稅由郵差代收或 App 繳",
        "",
        "【⚠ 櫃台最後確認】",
        " ✓ 箱子已封三圈透明膠帶",
        " ✓ 內無肉類 / 鋰電池 / 行動電源",
        " ✓ 尺寸 ≤ 1.5 m 長、長+周長 ≤ 3 m、重量 ≤ 30 kg",
        " ✓ 推薦用「国際郵便マイページサービス」線上填、現場印標籤",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━",
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
      formType,
      purposeLabel,
      mayBeDutyFree,
      willGoFormal,
    ],
  );

  return (
    <div className="mt-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <div className="flex items-center gap-2">
        <span>📝</span>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          送り状 填寫預演器 · 郵便局 EMS
        </div>
      </div>
      <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
        在家先填一次,系統根據申告金額自動判斷該填 CN22(小額)還是 CN23(大額),並標示台灣通關時 EZ WAY App 該怎麼處理。確認後生成謄寫稿到郵便局櫃台對照抄。
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
            用途 / Purpose
          </label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as typeof purpose)}
            className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100"
          >
            <option value="personal">Personal use(最安全,個人自用)</option>
            <option value="sample">Sample(商品見本)</option>
            <option value="returned">Returned goods(退還/返送)</option>
            <option value="sale">Sale of goods(販售用,會被課稅)</option>
          </select>
          <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
            建議選 Personal use。不要選 Gift(關員從 2020 起對 Gift 更嚴格核查)。
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 space-y-1.5">
        <div className="text-[11px] flex items-center gap-2">
          <span className="rounded px-1.5 py-0.5 bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 font-mono text-[10px]">
            {formType}
          </span>
          <span className="text-zinc-700 dark:text-zinc-300">
            {formType === "CN22"
              ? `申告額 ≤ ¥${CN22_THRESHOLD_JPY.toLocaleString()} → 綠色小票(較簡短)`
              : `申告額 > ¥${CN22_THRESHOLD_JPY.toLocaleString()} → 白色大表(需較詳細品名列表)`}
          </span>
        </div>
        <div className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
          ⚠ <b>EZ WAY 2026-03-01 強制事前委任</b> — 不管金額多少(含免稅包裹),都要抵台前下載 App + 身分證+健保卡註冊 + 開推播;海關推播後你要點「申報相符」才受理報關。48 小時未點部分業者收倉儲費(≥ NT$450),2-7 天退運。
        </div>
        {mayBeDutyFree && (
          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
            ✅ X2 免稅 — 申告額 ≤ ¥{DUTY_FREE_THRESHOLD_JPY.toLocaleString()}(NT$2,000)+ 半年內同一收件人 ≤ 6 次 → 免關稅營業稅,但 EZ WAY 仍需「事前委任」。
          </div>
        )}
        {willGoFormal && (
          <div className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
            ⚠ G1 正式報關 — 申告額 &gt; ¥{FORMAL_CUSTOMS_THRESHOLD_JPY.toLocaleString()}(NT$50,000)依《快遞貨物通關辦法》強制走 G1,須紙本個人委任書 + 身分證影本 + 報關行。
          </div>
        )}
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
          title="謄寫稿(在郵便局櫃台拿出手機對著抄)"
          text={output}
          footnote="推薦用郵便局「国際郵便マイページサービス」線上填寫,現場列印條碼貼上,比手寫快且不會寫醜。"
        />
      )}
    </div>
  );
}
