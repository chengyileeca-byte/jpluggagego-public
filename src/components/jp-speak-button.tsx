"use client";

import { useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSupported = () => "speechSynthesis" in window;
const getSupportedServer = () => false;

/**
 * Web Speech API 日文朗讀按鈕。不敢開口的使用者把手機拿給櫃台聽,
 * 或自己先聽一遍日文怎麼唸。
 * 系統沒日文 voice 時按鈕不渲染(舊瀏覽器/server-side 都安全)。
 */
export function JpSpeakButton({
  text,
  size = "sm",
}: {
  text: string;
  size?: "sm" | "lg";
}) {
  const [speaking, setSpeaking] = useState(false);
  const supported = useSyncExternalStore(
    subscribe,
    getSupported,
    getSupportedServer,
  );

  function toggle() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    synth.cancel(); // 清掉可能殘留的 queue
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ja-JP";
    utter.rate = 0.9;
    const jaVoice = synth
      .getVoices()
      .find((v) => v.lang === "ja-JP" || v.lang.startsWith("ja"));
    if (jaVoice) utter.voice = jaVoice;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    synth.speak(utter);
    setSpeaking(true);
  }

  if (!supported) return null;

  const cls =
    size === "lg"
      ? "inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      : "inline-flex items-center gap-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800";

  return (
    <button
      type="button"
      onClick={toggle}
      className={cls}
      aria-label={speaking ? "停止朗讀" : "朗讀日文"}
    >
      {speaking ? "⏸ 停止" : "🔊 朗讀"}
    </button>
  );
}
