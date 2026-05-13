"use client";

import type { ReactNode } from "react";

export type Hint = { level: "ok" | "warn" | "error"; text: string };

export function HintRow({ h }: { h: Hint }) {
  const color = {
    ok: "text-emerald-600 dark:text-emerald-400",
    warn: "text-amber-600 dark:text-amber-400",
    error: "text-red-600 dark:text-red-400",
  }[h.level];
  const icon = { ok: "✓", warn: "⚠", error: "✕" }[h.level];
  return (
    <div className={`text-[11px] mt-1 ${color}`}>
      {icon} {h.text}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  hint,
  placeholder,
  className = "",
  type = "text",
  uppercase = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint: Hint;
  placeholder?: string;
  className?: string;
  type?: string;
  uppercase?: boolean;
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)
        }
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
      />
      <HintRow h={hint} />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  className = "",
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint: Hint;
  placeholder?: string;
  className?: string;
  rows?: number;
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-mono"
      />
      <HintRow h={hint} />
    </div>
  );
}

export function OutputBlock({
  title,
  text,
  footnote,
}: {
  title: string;
  text: string;
  footnote?: ReactNode;
}) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* 不支援 clipboard API 就算了 */
    }
  }
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </div>
        <CopyButton onCopy={handleCopy} />
      </div>
      <pre className="mt-2 whitespace-pre-wrap text-[11px] font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-3 text-zinc-800 dark:text-zinc-200 leading-relaxed overflow-x-auto">
{text}
      </pre>
      {footnote && (
        <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
          {footnote}
        </p>
      )}
    </div>
  );
}

import { useState } from "react";
function CopyButton({ onCopy }: { onCopy: () => Promise<void> }) {
  const [copied, setCopied] = useState(false);
  async function handle() {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      type="button"
      onClick={handle}
      className="text-[11px] rounded-md border border-zinc-300 dark:border-zinc-700 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
    >
      {copied ? "✓ 已複製" : "📋 複製"}
    </button>
  );
}
