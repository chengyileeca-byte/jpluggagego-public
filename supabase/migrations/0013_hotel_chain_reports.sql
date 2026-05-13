-- UGC 飯店實測回報 (#57)
--
-- 每筆回報針對一個 chain + 一個 field(can_receive/can_send/pre_checkin_hold)
-- 給出 value(yes/case-by-case/check)+ 自由文字。
-- branch_name 預留(為將來升級個別分店用),v1 可空。
--
-- RLS:anon/authed 完全不可讀。App 層用 service role 做聚合 + 去識別化
-- 後回傳。line_user_id 視同個資,不直接曝露。

create table if not exists public.hotel_chain_reports (
  id bigserial primary key,
  line_user_id text not null,
  display_name text not null,
  chain_code text not null,
  field text not null check (field in ('can_receive','can_send','pre_checkin_hold')),
  value text not null check (value in ('yes','case-by-case','check')),
  note text,
  -- branch_name 空字串=針對整個 chain 的回報(分店不分)。
  -- NOT NULL 讓 PostgREST upsert onConflict 能直接 target 此組合。
  branch_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 同一人對同一 chain + 同一 field + 同一分店 只能留一筆(覆蓋式更新)。
create unique index if not exists hotel_chain_reports_user_chain_field_branch_idx
  on public.hotel_chain_reports (line_user_id, chain_code, field, branch_name);

create index if not exists hotel_chain_reports_chain_field_idx
  on public.hotel_chain_reports (chain_code, field);

-- updated_at auto-touch
create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at := now();
  return new;
end
$$ language plpgsql;

drop trigger if exists hotel_chain_reports_touch on public.hotel_chain_reports;
create trigger hotel_chain_reports_touch
  before update on public.hotel_chain_reports
  for each row execute function public.touch_updated_at();

alter table public.hotel_chain_reports enable row level security;
-- 故意不加 policy,anon/authed 完全無法 read/write。服務端用 service role。
