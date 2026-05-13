-- japan_entries.feature_rank — 標記「地區代表」級別
--
-- 背景:
--   Sprint 10 路由重構。全域 6 大類頁(/japan/food 等)從「列出所有條目」改為
--   「只顯示 feature_rank >= 2 的地區代表」,作為跨地區發現入口。
--   完整條目列表改放在地區頁底下(/japan/area/[prefecture]/[category])。
--
-- 等級定義:
--   0 = 一般(地區頁才顯示,預設值)
--   1 = 都道府縣級代表(該縣內知名)
--   2 = 地區(北海道/關東等 9 區)代表(全域類別頁 + 全域 when/calendar 會露出)
--   3 = 全國級(外國觀光客等級,如札幌雪祭、富士山)
--
-- 回填策略:欄位 default 0。實際 rank 由 scripts/rank-japan-entries.ts 依 slug 白名單
--   idempotent UPDATE。Seed script 不寫 feature_rank,避免 re-seed 洗掉 rank。

alter table public.japan_entries
  add column if not exists feature_rank smallint not null default 0
    check (feature_rank between 0 and 3);

-- 全域頁查詢:feature_rank >= 2 + region + category 排序。
-- Partial index 只索引 rank >= 2 的少數條目,成本低。
create index if not exists japan_entries_feature_rank_idx
  on public.japan_entries (feature_rank desc, region, category)
  where feature_rank >= 2;
