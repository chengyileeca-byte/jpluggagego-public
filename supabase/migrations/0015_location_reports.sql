-- UGC 通用據點回報 (location_reports)
--
-- 設計邏輯:
--   單表 polymorphic,一次處理 5 種 entity:
--     yamato_branch / yuu_post_office / yamato_airport / yuu_pack_airport / hotel_chain
--   entity_id 為對應來源表的 PK(string 化,hotel_chain 用 chain_code)。
--
-- 三種 report_type:
--   success — 我在這邊寄成功了(payload: size, cost_yen, wait_min)
--   blocked — 被拒 / 出事(payload: reject_reason)
--   update  — 資料錯了(payload: field, new_value) → 進 pending queue,admin 審過才套用
--
-- 舊 hotel_chain_reports 保留不動;本表 hotel_chain 回報用「整體經驗」粒度,
-- 與舊表「3 個 capability 勾選」互補,不互相替代。
--
-- 隱私:完全**不存 display_name**,只存 line_user_id(hash-able 但還沒做)。
-- RLS:沒有 policy → anon/authed 完全不可讀寫,只能走 service role。
--
-- 防刷:DB trigger 限同 user 7 天內最多 5 筆(upsert 不計入)。

create table if not exists public.location_reports (
  id bigserial primary key,
  line_user_id text not null,
  entity_type text not null check (
    entity_type in (
      'yamato_branch',
      'yuu_post_office',
      'yamato_airport',
      'yuu_pack_airport',
      'hotel_chain'
    )
  ),
  entity_id text not null,
  report_type text not null check (report_type in ('success', 'blocked', 'update')),
  payload jsonb not null default '{}'::jsonb,
  note text,
  update_status text check (update_status in ('pending', 'applied', 'rejected')),
  reported_at timestamptz not null default now(),
  applied_at timestamptz,
  applied_by text
);

-- 同一人 × 同一 entity × 同一 type 僅一筆(覆蓋式)。
create unique index if not exists location_reports_user_entity_type_idx
  on public.location_reports (line_user_id, entity_type, entity_id, report_type);

-- entity 查詢用
create index if not exists location_reports_entity_idx
  on public.location_reports (entity_type, entity_id);

-- admin 查 pending update
create index if not exists location_reports_pending_updates_idx
  on public.location_reports (update_status, reported_at desc)
  where report_type = 'update' and update_status = 'pending';

-- update 類型必須有 update_status,其他類型必須 null。
-- drop 再 add 才可重跑(ALTER TABLE ADD CONSTRAINT 無 IF NOT EXISTS)。
alter table public.location_reports
  drop constraint if exists location_reports_update_status_chk;
alter table public.location_reports
  add constraint location_reports_update_status_chk
  check (
    (report_type = 'update' and update_status is not null)
    or (report_type <> 'update' and update_status is null)
  );

-- Rate limit:同 user 7 天內最多 5 筆 INSERT(upsert 的 UPDATE 不算)
-- 變數用 := 指派,避開 Supabase SQL editor 把 `SELECT INTO` 誤判為
-- 建新表的情境(會產生 "relation recent_count does not exist")。
create or replace function public.location_reports_rate_limit()
returns trigger
language plpgsql
as $func$
declare
  v_recent int;
begin
  v_recent := (
    select count(*)::int
    from public.location_reports
    where line_user_id = new.line_user_id
      and reported_at > now() - interval '7 days'
  );
  if v_recent >= 5 then
    raise exception 'rate_limit_exceeded' using errcode = 'P0001';
  end if;
  return new;
end;
$func$;

drop trigger if exists location_reports_rate_limit_trg on public.location_reports;
create trigger location_reports_rate_limit_trg
  before insert on public.location_reports
  for each row execute function public.location_reports_rate_limit();

-- 聚合 view:給頁面顯示徽章用。不含 line_user_id、note、payload 原文。
-- top_reject_reasons 用 array_agg 收集所有 blocked 的 reject_reason,
-- UI 層再用 Map 統計頻率取 top N(省掉 SQL 端 correlated subquery)。
create or replace view public.location_report_badges as
select
  entity_type,
  entity_id,
  count(*) filter (where report_type = 'success') as success_12mo,
  count(*) filter (
    where report_type = 'success'
      and reported_at > now() - interval '6 months'
  ) as success_6mo,
  count(*) filter (where report_type = 'blocked') as blocked_12mo,
  max(reported_at) filter (where report_type = 'success') as last_success_at,
  max(reported_at) filter (where report_type = 'blocked') as last_blocked_at,
  array_remove(
    array_agg(payload->>'reject_reason') filter (
      where report_type = 'blocked' and payload ? 'reject_reason'
    ),
    null
  ) as top_reject_reasons
from public.location_reports
where reported_at > now() - interval '12 months'
  and (report_type <> 'update' or update_status = 'applied')
group by entity_type, entity_id;

alter table public.location_reports enable row level security;
-- 故意不加 policy,anon/authed 完全不可讀寫。service role 全過。
