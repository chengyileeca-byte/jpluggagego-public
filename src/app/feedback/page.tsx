"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Kind =
  | "wrong-info"
  | "branch-update"
  | "hotel-update"
  | "feature-request"
  | "general";

const KIND_VALUES: ReadonlyArray<Kind> = [
  "wrong-info",
  "branch-update",
  "hotel-update",
  "feature-request",
  "general",
];

const KIND_OPTIONS: ReadonlyArray<{
  value: Kind;
  label: string;
  sub: string;
  glyph: string;
}> = [
  { value: "wrong-info", label: "資訊有誤", sub: "information error", glyph: "誤" },
  {
    value: "branch-update",
    label: "営業所·郵便局資訊更新",
    sub: "branch / post office update",
    glyph: "局",
  },
  {
    value: "hotel-update",
    label: "飯店資訊更新",
    sub: "hotel information update",
    glyph: "宿",
  },
  {
    value: "feature-request",
    label: "功能建議",
    sub: "feature request",
    glyph: "案",
  },
  { value: "general", label: "其他", sub: "general", glyph: "他" },
];

const ORDINALS = ["一", "二", "三", "四"] as const;
const ORDINAL_ROMAJI = ["ichi", "ni", "san", "shi"] as const;

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; issueNumber: number; issueUrl: string }
  | { kind: "error"; message: string; code?: string };

function fmtJst(d: Date): string {
  const fmt = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const p = fmt.formatToParts(d);
  const get = (k: string) => p.find((x) => x.type === k)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")} · ${get("hour")}:${get("minute")} JST`;
}

export default function FeedbackPage() {
  const [kind, setKind] = useState<Kind>("wrong-info");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contact, setContact] = useState("");
  const [page, setPage] = useState<string>("");
  const [stamp, setStamp] = useState<string>("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    // URL params:?kind=branch-update&prefill_title=...&from=/quote/...
    const sp = new URLSearchParams(window.location.search);
    const k = sp.get("kind");
    if (k && (KIND_VALUES as readonly string[]).includes(k)) {
      setKind(k as Kind);
    }
    const t = sp.get("prefill_title");
    if (t) setTitle(t.slice(0, 120));
    // 來源頁面:caller 給的 from= 優先,否則 fallback 到目前 URL
    const fromParam = sp.get("from");
    setPage(
      fromParam ?? window.location.pathname + window.location.search,
    );
    setStamp(fmtJst(new Date()));
  }, []);

  const validation = useMemo(() => {
    const titleCount = title.length;
    const bodyCount = body.length;
    return {
      titleCount,
      bodyCount,
      titleOk: titleCount >= 2 && titleCount <= 120,
      bodyOk: bodyCount >= 5 && bodyCount <= 5000,
    };
  }, [title, body]);

  const canSubmit =
    validation.titleOk && validation.bodyOk && status.kind !== "submitting";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, title, body, contact, page }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;
      if (!res.ok) {
        const code = (data.error as string) ?? `http_${res.status}`;
        const message =
          res.status === 429
            ? "送付過多 · 每小時最多 5 通,請稍候再試。"
            : res.status === 503
              ? "投書箱尚未配置 · 站長未設置 GITHUB_FEEDBACK_TOKEN。"
              : res.status === 502
                ? "上游回應失敗 · GitHub API 暫時不可達,請稍後再試。"
                : code === "invalid_title"
                  ? "標題長度需 2–120 字。"
                  : code === "invalid_body"
                    ? "內容長度需 5–5000 字。"
                    : code === "invalid_kind"
                      ? "分類值不在允許範圍。"
                      : `送付失敗 · ${code}`;
        setStatus({ kind: "error", message, code });
        return;
      }
      setStatus({
        kind: "success",
        issueNumber: Number(data.issue_number),
        issueUrl: String(data.issue_url),
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message: `網路錯誤 · ${err instanceof Error ? err.message : "unknown"}`,
      });
    }
  }

  function reset() {
    setKind("wrong-info");
    setTitle("");
    setBody("");
    setContact("");
    setStatus({ kind: "idle" });
  }

  // Success state: ledger receipt rendering. Replaces the form entirely.
  if (status.kind === "success") {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              ← JPLuggageGo
            </Link>
            <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600 tabular-nums">
              {stamp}
            </span>
          </div>

          <div className="mt-12 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
            <div className="px-8 pt-10 pb-6 text-center">
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 dark:text-zinc-600">
                received · 受領済
              </p>
              <p
                className="mt-3 text-4xl text-zinc-900 dark:text-zinc-50"
                style={{ fontFamily: "var(--font-mincho)" }}
              >
                謹受
              </p>
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                投書已登記於公開 archive。
                <br />
                Your report has been logged to our public archive.
              </p>
            </div>

            <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700 px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
                  receipt no.
                </p>
                <p
                  className="mt-1 text-3xl tabular-nums text-zinc-900 dark:text-zinc-50"
                  style={{ fontFamily: "var(--font-mincho)" }}
                >
                  #{status.issueNumber.toString().padStart(4, "0")}
                </p>
              </div>
              <a
                href={status.issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.2em] uppercase text-zinc-700 dark:text-zinc-300 underline decoration-dotted underline-offset-4 hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                view on github ↗
              </a>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950/50 px-8 py-4 text-center">
              <button
                type="button"
                onClick={reset}
                className="text-xs tracking-[0.2em] uppercase text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                + 再投一筆
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Top bar: breadcrumb + datetime stamp */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            ← JPLuggageGo
          </Link>
          <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600 tabular-nums">
            {stamp || "—"}
          </span>
        </div>

        {/* Header */}
        <header className="mt-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 dark:text-zinc-600">
            tousho · feedback ledger
          </p>
          <h1
            className="mt-3 text-5xl sm:text-6xl text-zinc-900 dark:text-zinc-50 leading-none"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            投書箱
          </h1>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-prose">
            回報資訊有誤、缺漏,或提出功能建議。送出後會在我們的 GitHub repo
            建立一份 issue,公開可追蹤。
            <span className="block mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              無需登入。
              <span className="ml-2 tracking-wide">No login required.</span>
            </span>
          </p>
        </header>

        {/* Error banner — sits above form */}
        {status.kind === "error" && (
          <div className="mt-8 border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-5 py-4">
            <div className="flex items-baseline gap-3">
              <span
                className="text-2xl leading-none"
                style={{ fontFamily: "var(--font-mincho)" }}
              >
                ⚠
              </span>
              <div className="flex-1">
                <p
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-mincho)" }}
                >
                  送付失敗
                </p>
                <p className="mt-1 text-xs leading-relaxed">
                  {status.message}
                </p>
                {status.code && (
                  <p className="mt-2 font-mono text-[10px] tracking-wider opacity-60">
                    code: {status.code}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-12 space-y-14">
          {/* 一 · 分類 */}
          <Section ord={0} kanji="分類" romaji="kind / category">
            <ul className="space-y-1.5">
              {KIND_OPTIONS.map((opt) => {
                const active = kind === opt.value;
                return (
                  <li key={opt.value}>
                    <label
                      className={[
                        "group flex items-center gap-4 px-4 py-3 cursor-pointer border transition-colors",
                        active
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="kind"
                        value={opt.value}
                        checked={active}
                        onChange={() => setKind(opt.value)}
                        className="sr-only"
                      />
                      <span
                        className={[
                          "shrink-0 w-9 h-9 grid place-items-center text-base border",
                          active
                            ? "border-zinc-50 dark:border-zinc-900"
                            : "border-zinc-300 dark:border-zinc-700",
                        ].join(" ")}
                        style={{ fontFamily: "var(--font-mincho)" }}
                        aria-hidden
                      >
                        {opt.glyph}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className="block text-sm"
                          style={{ fontFamily: "var(--font-mincho)" }}
                        >
                          {opt.label}
                        </span>
                        <span
                          className={[
                            "block text-[10px] tracking-[0.2em] uppercase mt-0.5",
                            active
                              ? "text-zinc-400 dark:text-zinc-600"
                              : "text-zinc-500 dark:text-zinc-500",
                          ].join(" ")}
                        >
                          {opt.sub}
                        </span>
                      </span>
                      <span
                        className={[
                          "text-[10px] tracking-[0.3em] uppercase tabular-nums",
                          active
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-50",
                        ].join(" ")}
                        aria-hidden
                      >
                        ●
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Section>

          {/* 二 · 標題 */}
          <Section
            ord={1}
            kanji="標題"
            romaji="title"
            counter={`${validation.titleCount} / 120`}
            counterError={!validation.titleOk && validation.titleCount > 0}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="例:京都 ヤマト 烏丸支店 営業時間が現状と違う"
              className="w-full bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none px-0 py-2 text-base text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
              style={{ fontFamily: "var(--font-mincho)" }}
            />
          </Section>

          {/* 三 · 內容 */}
          <Section
            ord={2}
            kanji="本文"
            romaji="content"
            counter={`${validation.bodyCount} / 5000`}
            counterError={!validation.bodyOk && validation.bodyCount > 0}
          >
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={5000}
              rows={6}
              placeholder="儘量具體 — 觀察到的事實、原本資料寫了什麼、應該是什麼、有沒有來源連結。寫得清楚我們才能查證。"
              className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none px-0 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 leading-relaxed resize-y transition-colors"
            />
          </Section>

          {/* 四 · 連絡(任意) */}
          <Section
            ord={3}
            kanji="連絡先"
            romaji="contact (optional)"
          >
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value.slice(0, 200))}
              placeholder="email / Twitter / IG handle — 想被回覆才填,可空白"
              className="w-full bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none px-0 py-2 text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
            />
          </Section>

          {/* Submit */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                "group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border transition-all",
                canSubmit
                  ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:gap-5"
                  : "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 cursor-not-allowed",
              ].join(" ")}
            >
              <span
                className="text-base"
                style={{ fontFamily: "var(--font-mincho)" }}
              >
                {submitting ? "送付中…" : "送付"}
              </span>
              <span className="text-[10px] tracking-[0.4em] uppercase">
                {submitting ? "submitting" : "post ↗"}
              </span>
            </button>
            <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600">
              {validation.titleOk && validation.bodyOk
                ? "ready"
                : `incomplete · 標題 ${validation.titleOk ? "✓" : "—"} · 本文 ${validation.bodyOk ? "✓" : "—"}`}
            </p>
          </div>
        </form>

        {/* Colophon — explanatory footnote */}
        <footer className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-[10px] leading-relaxed tracking-wide text-zinc-500 dark:text-zinc-500">
          <p>
            <span
              className="text-zinc-700 dark:text-zinc-300"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              凡例
            </span>{" "}
            · 此投書送出後,系統會在我們的 GitHub repository 建立一份 issue,
            內容包含本表單填寫的所有欄位與你的 IP(用於濫用追蹤)。issue 公開
            可見,所以請避免填入個人敏感資訊。
            <br />
            <span
              className="text-zinc-700 dark:text-zinc-300"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              制限
            </span>{" "}
            · 同一 IP 每小時最多 5 通。
          </p>
        </footer>
      </div>
    </main>
  );
}

// Section wrapper: kanji ordinal + dotted vertical rule + label + slot
function Section({
  ord,
  kanji,
  romaji,
  counter,
  counterError,
  children,
}: {
  ord: number;
  kanji: string;
  romaji: string;
  counter?: string;
  counterError?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="relative pl-12 sm:pl-16">
      {/* Ordinal in mincho — large, faint */}
      <span
        aria-hidden
        className="absolute left-0 top-0 text-3xl text-zinc-300 dark:text-zinc-700 select-none"
        style={{ fontFamily: "var(--font-mincho)" }}
      >
        {ORDINALS[ord]}
      </span>

      {/* Vertical dotted rule echoing the ledger */}
      <span
        aria-hidden
        className="absolute left-4 sm:left-6 top-12 bottom-0 border-l border-dotted border-zinc-200 dark:border-zinc-800"
      />

      <header className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <h2
            className="text-lg text-zinc-900 dark:text-zinc-50"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            {kanji}
          </h2>
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600 mt-0.5">
            {ORDINAL_ROMAJI[ord]} · {romaji}
          </p>
        </div>
        {counter && (
          <span
            className={[
              "shrink-0 text-[10px] tracking-wider tabular-nums uppercase",
              counterError
                ? "text-zinc-900 dark:text-zinc-100 font-medium"
                : "text-zinc-400 dark:text-zinc-600",
            ].join(" ")}
          >
            {counter}
          </span>
        )}
      </header>

      <div>{children}</div>
    </section>
  );
}
