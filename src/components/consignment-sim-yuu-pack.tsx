"use client";

import { useMemo, useState } from "react";
import {
  Field,
  OutputBlock,
  type Hint,
} from "@/components/consignment-form-kit";

function validateRequired(v: string, field: string): Hint {
  return v.trim()
    ? { level: "ok", text: "OK" }
    : { level: "error", text: `${field}必填` };
}

function validateJpPostal(v: string): Hint {
  const t = v.trim().replace(/[^0-9-]/g, "");
  if (!t) return { level: "error", text: "必填" };
  if (!/^\d{3}-?\d{4}$/.test(t)) {
    return { level: "error", text: "格式錯 — 7 位數字,例 100-0005 或 1000005" };
  }
  return { level: "ok", text: "OK" };
}

function validateJpPhone(v: string): Hint {
  const t = v.trim();
  if (!t) return { level: "error", text: "必填" };
  const digits = t.replace(/[^0-9]/g, "");
  if (!digits.startsWith("0")) {
    return { level: "error", text: "日本電話必須 0 開頭(例 03-1234-5678 或 090-1234-5678)" };
  }
  if (digits.length < 10 || digits.length > 11) {
    return { level: "error", text: "電話總共 10-11 位數字" };
  }
  return { level: "ok", text: "OK" };
}

function validateItemName(v: string): Hint {
  const t = v.trim();
  if (!t) return { level: "error", text: "必填,請具体的に書く" };
  const lone = ["その他", "荷物", "お土産", "雑貨", "おみやげ"];
  if (lone.includes(t)) {
    return {
      level: "error",
      text: `「${t}」太籠統 — 請具體寫,例:衣類、お菓子、書籍、食器`,
    };
  }
  if (t.length < 2) {
    return { level: "warn", text: "建議至少 2 字以上,櫃台可能會要求補充" };
  }
  return { level: "ok", text: "OK" };
}

const TIME_SLOTS = [
  "指定なし",
  "午前中(~12:00)",
  "12:00-14:00",
  "14:00-16:00",
  "16:00-18:00",
  "18:00-20:00",
  "19:00-21:00",
] as const;
type TimeSlot = (typeof TIME_SLOTS)[number];

const BOX_SIZES = ["60", "80", "100", "120", "140", "160", "170"] as const;
type BoxSize = (typeof BOX_SIZES)[number];

export function ConsignmentSimYuuPack() {
  const [senderName, setSenderName] = useState("");
  const [senderPostal, setSenderPostal] = useState("");
  const [senderAddr, setSenderAddr] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [recipName, setRecipName] = useState("");
  const [recipPostal, setRecipPostal] = useState("");
  const [recipAddr, setRecipAddr] = useState("");
  const [recipPhone, setRecipPhone] = useState("");
  const [itemName, setItemName] = useState("");
  const [boxSize, setBoxSize] = useState<BoxSize>("100");
  const [payer, setPayer] = useState<"sender" | "recipient">("sender");
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("指定なし");
  const [fragile, setFragile] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const hints = useMemo(
    () => ({
      senderName: validateRequired(senderName, "ご依頼主(差出人)氏名"),
      senderPostal: validateJpPostal(senderPostal),
      senderAddr: validateRequired(senderAddr, "差出人 住所"),
      senderPhone: validateJpPhone(senderPhone),
      recipName: validateRequired(recipName, "お届け先 氏名"),
      recipPostal: validateJpPostal(recipPostal),
      recipAddr: validateRequired(recipAddr, "お届け先 住所"),
      recipPhone: validateJpPhone(recipPhone),
      itemName: validateItemName(itemName),
    }),
    [
      senderName,
      senderPostal,
      senderAddr,
      senderPhone,
      recipName,
      recipPostal,
      recipAddr,
      recipPhone,
      itemName,
    ],
  );

  const hasErrors = Object.values(hints).some((h) => h.level === "error");

  const output = useMemo(
    () =>
      [
        "━━━ ゆうパック · 送り状 謄寫稿 ━━━",
        "",
        "【ご依頼主 / 寄件人】",
        ` お名前:   ${senderName}`,
        ` 〒:       ${senderPostal}`,
        ` ご住所:   ${senderAddr}`,
        ` お電話:   ${senderPhone}`,
        "",
        "【お届け先 / 收件人】",
        ` お名前:   ${recipName}`,
        ` 〒:       ${recipPostal}`,
        ` ご住所:   ${recipAddr}`,
        ` お電話:   ${recipPhone}`,
        "",
        `【品名】  ${itemName}`,
        `【サイズ】 ${boxSize} サイズ`,
        `【お支払い】 ${payer === "sender" ? "元払い(寄件人付)" : "着払い(收件人付)"}`,
        `【お届け日時】 ${timeSlot}`,
        fragile ? "【取扱注意】 割れ物(易碎品)→ ビニール袋で保護してください" : "【取扱注意】 なし",
        "",
        "【⚠ 櫃台最後確認】",
        " ✓ 箱子封好透明膠帶",
        payer === "recipient"
          ? " ⚠ 著払い記得提前通知收件人有金額要付"
          : " ✓ 料金當場付清",
        " ✓ 內無航空禁止品(鋰電池、行動電源若走空運)",
        "━━━━━━━━━━━━━━━━━━━━━━",
      ].join("\n"),
    [
      senderName,
      senderPostal,
      senderAddr,
      senderPhone,
      recipName,
      recipPostal,
      recipAddr,
      recipPhone,
      itemName,
      boxSize,
      payer,
      timeSlot,
      fragile,
    ],
  );

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center gap-2">
        <span>📝</span>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          送り状 填寫預演器 · ゆうパック(境內)
        </div>
      </div>
      <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
        郵便局櫃台的紙本 ゆうパック送り状 最容易卡在:郵便番号格式、品名太籠統、電話少了區碼。先填一次讓系統檢查,確認後產謄寫稿,現場照抄最順。
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="ご依頼主 お名前(寄件人)"
          value={senderName}
          onChange={setSenderName}
          hint={hints.senderName}
          placeholder="山田 太郎 / Your name"
        />
        <Field
          label="ご依頼主 お電話"
          value={senderPhone}
          onChange={setSenderPhone}
          hint={hints.senderPhone}
          placeholder="飯店電話 03-XXXX-XXXX"
        />
        <Field
          label="ご依頼主 〒(郵便番号)"
          value={senderPostal}
          onChange={setSenderPostal}
          hint={hints.senderPostal}
          placeholder="100-0005"
        />
        <Field
          label="ご依頼主 ご住所"
          value={senderAddr}
          onChange={setSenderAddr}
          hint={hints.senderAddr}
          placeholder="東京都千代田区..."
        />

        <Field
          label="お届け先 お名前(收件人)"
          value={recipName}
          onChange={setRecipName}
          hint={hints.recipName}
          placeholder="次の宿泊先または自宅"
        />
        <Field
          label="お届け先 お電話"
          value={recipPhone}
          onChange={setRecipPhone}
          hint={hints.recipPhone}
          placeholder="飯店櫃台 0X-XXXX-XXXX"
        />
        <Field
          label="お届け先 〒"
          value={recipPostal}
          onChange={setRecipPostal}
          hint={hints.recipPostal}
          placeholder="605-0001"
        />
        <Field
          label="お届け先 ご住所"
          value={recipAddr}
          onChange={setRecipAddr}
          hint={hints.recipAddr}
          placeholder="京都市東山区..."
        />

        <Field
          className="sm:col-span-2"
          label="品名(具体的に)"
          value={itemName}
          onChange={setItemName}
          hint={hints.itemName}
          placeholder="衣類とお菓子 / 書籍 / 食器 …"
        />

        <div>
          <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            サイズ(箱の三辺合計)
          </label>
          <select
            value={boxSize}
            onChange={(e) => setBoxSize(e.target.value as BoxSize)}
            className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100"
          >
            {BOX_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} サイズ(三辺合計 ≤ {s} cm)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            お支払方法
          </label>
          <div className="mt-2 flex gap-4 text-xs text-zinc-700 dark:text-zinc-300">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                checked={payer === "sender"}
                onChange={() => setPayer("sender")}
              />
              <span>元払い(我付)</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                checked={payer === "recipient"}
                onChange={() => setPayer("recipient")}
              />
              <span>着払い(收件人付)</span>
            </label>
          </div>
          {payer === "recipient" && (
            <div className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
              ⚠ 記得先跟收件人說好有金額要付
            </div>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            お届け日時帯
          </label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
            className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100"
          >
            {TIME_SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={fragile}
              onChange={(e) => setFragile(e.target.checked)}
            />
            <span>割れ物(易碎品 — 玻璃、陶器、電子產品)</span>
          </label>
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
          title="謄寫稿(在郵便局櫃台拿出手機對著抄)"
          text={output}
          footnote="郵便局窗口會給紙本 ゆうパック送り状。欄位順序與此一致,對照抄即可。Yamato 營業所的「宅急便送り状」格式略同,主要差在 Yamato 把「お届け日時」排在更前面。"
        />
      )}
    </div>
  );
}
