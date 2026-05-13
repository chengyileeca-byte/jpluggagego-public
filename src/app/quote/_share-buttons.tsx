"use client";

import { useState } from "react";

export function ShareButtons({
  shareText,
  copyLabel,
  copiedLabel,
  lineLabel,
}: {
  shareText: string;
  copyLabel: string;
  copiedLabel: string;
  lineLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard denied — fall back to selection prompt.
      window.prompt("複製這個連結:", window.location.href);
    }
  }

  function shareLine() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const text = `${shareText}\n${url}`;
    const share = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(share, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        <span>{copied ? `✓ ${copiedLabel}` : `📋 ${copyLabel}`}</span>
      </button>
      <button
        type="button"
        onClick={shareLine}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#06C755]/40 bg-[#06C755]/10 dark:bg-[#06C755]/20 px-3 py-1.5 text-xs font-medium text-[#06C755] hover:bg-[#06C755]/20"
      >
        <span>📨 {lineLabel}</span>
      </button>
    </div>
  );
}
