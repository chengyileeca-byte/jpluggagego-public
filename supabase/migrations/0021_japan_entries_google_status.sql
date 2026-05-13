-- japan_entries · Google Places business_status 整合(D')
--
-- 背景:
--   Sprint 9 累積 328 筆策展型 entries。要偵測歇業而不毀「策展+繁中文化 context」護城河,
--   用 Google Places API 當 status checker —— 不是用它做評分排序,只查 business_status。
--
-- 欄位:
--   google_place_id          一次性配對(scripts/match-google-place-ids.ts),NULL = 還沒配
--   business_status          OPERATIONAL / CLOSED_TEMPORARILY / CLOSED_PERMANENTLY / null
--   business_status_checked_at 最後一次 refresh 時間
--
-- 自動行為(在 refresh script 裡寫,不在 DB trigger 裡):
--   CLOSED_PERMANENTLY → feature_rank 自動降為 0(從公開頁、全域 when/calendar 消失)
--   保留 entry 不刪 → 留 audit + 給 admin 反悔機會(rebrand 也許 place_id 重配後復活)
--
-- Cost-aware index:
--   partial index 只索引 closure 狀態,給 admin queue 用,主要查詢是少量。
--   一般查詢(/japan/food 顯示 OPERATIONAL)不需新 index — feature_rank index 已過濾。

alter table public.japan_entries
  add column if not exists google_place_id text,
  add column if not exists business_status text
    check (
      business_status is null
      or business_status in (
        'OPERATIONAL',
        'CLOSED_TEMPORARILY',
        'CLOSED_PERMANENTLY'
      )
    ),
  add column if not exists business_status_checked_at timestamptz;

-- place_id 應 unique(同一 Google place 不應對到多筆 entry,若有衝突先警告再人工處理)
-- 注意:NULL 不入 UNIQUE 約束,多筆 NULL 共存 OK
create unique index if not exists japan_entries_google_place_id_uniq
  on public.japan_entries (google_place_id)
  where google_place_id is not null;

-- Admin 歇業候補 queue:列 CLOSED_PERMANENTLY 的 entries
create index if not exists japan_entries_business_closed_idx
  on public.japan_entries (business_status_checked_at desc)
  where business_status = 'CLOSED_PERMANENTLY';
