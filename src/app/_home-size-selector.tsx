"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { HOME_SIZES } from "@/lib/home-sizes";

export function HomeSizeSelector({ size }: { size: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-500">
      <span className="hidden sm:inline">行李尺寸</span>
      <select
        value={size}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          start(() => router.replace(`/?size=${v}#popular`, { scroll: false }));
        }}
        className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        {HOME_SIZES.map((s) => (
          <option key={s.code} value={s.code}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}
