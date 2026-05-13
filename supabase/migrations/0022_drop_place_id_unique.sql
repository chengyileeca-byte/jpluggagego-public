-- 0022 · 移除 japan_entries.google_place_id 的 UNIQUE 限制
--
-- 背景(實作後才發現):
--   0021 設 google_place_id UNIQUE 假設「一個 Google place ↔ 一個 entry」,
--   但跑 match script 後發現:**事件 / 體驗 / 票券 等抽象 entry 沒專屬 place,
--   Google 找最近 venue 回給你**。例如:
--     - 函館八幡宮例大祭 → place_id = 函館八幡宮
--     - 登別地獄まつり    → place_id = 登別地獄谷
--     - 平取アイヌ刺繍体驗 → place_id = 平取町アイヌ工芸伝承館
--   這些 venue 已經是其他 entry 的 owner,衝突 16 筆。
--
-- 設計修正:改成 **1:N**(同一 place_id 可被多 entry 共享)。
--   語意:venue 歇業 → 該 venue 上所有 entry 同步隱藏(refresh script 各自 update)。
--   是合理的傳遞(場地關了,場地的祭典也辦不成)。
--   refresh script 對每筆 entry 各自 call 一次 Place Details 不需去重 — 月用量
--   原本 ~328 calls,即使全部都共享 place 仍 ≤ 328 calls,計費影響可忽略。

drop index if exists public.japan_entries_google_place_id_uniq;

-- 改用一般 b-tree index(查詢用)— 不要再 UNIQUE。
create index if not exists japan_entries_google_place_id_idx
  on public.japan_entries (google_place_id)
  where google_place_id is not null;
