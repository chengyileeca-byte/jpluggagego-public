import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin · 服務暫停",
  robots: { index: false, follow: false },
};

export default function AdminDisabledPage() {
  return (
    <main className="min-h-screen bg-zinc-50 py-20 px-6">
      <div className="mx-auto max-w-xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          503 · service unavailable
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">
          後台已停用
        </h1>
        <p className="mt-4 text-sm text-zinc-600">
          資料庫已下線,目前後台寫入功能不可用。資料以 git 中的 JSON snapshot
          唯讀方式提供,如需編輯請直接修改{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">
            public/data/japan_entries.json
          </code>
          。
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-zinc-700 underline hover:text-zinc-900"
        >
          ← 回到首頁
        </Link>
      </div>
    </main>
  );
}
