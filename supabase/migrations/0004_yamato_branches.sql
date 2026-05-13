-- ============================================================
-- Yamato 営業所 (branch) master list
-- Source: locations.kuronekoyamato.co.jp nkyoten.cgi TSV export
-- Filter jkn=COL_01:1 → only 営業所 proper (no konbini, no PUDO).
-- Hours model: Yamato exposes 3 buckets (平日/土/日祝) + 受付終了, not 7 days.
--
-- Replaces the placeholder table from 0001_init.sql which used `lng`/`name`
-- and was never populated.
-- ============================================================
drop table if exists public.yamato_branches cascade;

create table public.yamato_branches (
  branch_code text primary key,             -- e.g. "132610", "039340"
  name_jp text not null,                    -- 新宿支店 / 中野本町３丁目営業所 ...
  address_jp text not null,                 -- 都道府県+市区町村+番地
  prefecture text not null,                 -- 都道府県 (derived from address)
  postal_code text,                         -- 7-digit, no hyphen
  phone text,                               -- 03-xxxx-xxxx / 0570-xxx-xxx
  lat double precision not null,
  lon double precision not null,
  grade text,                               -- A / B / C — branch class flag
  hours_weekday text,                       -- "09:00-20:00" / null if 要問合せ
  last_accept_weekday text,                 -- "19:00"
  hours_saturday text,
  last_accept_saturday text,
  hours_sunday_holiday text,
  last_accept_sunday_holiday text,
  flags_raw text,                           -- "1,1,1,1,1,0,0,0,0,0" (10 slots, meaning TBD)
  scraped_at timestamptz not null default now()
);

create index yamato_branches_pref_idx
  on public.yamato_branches (prefecture);

-- Lat/lon composite index for bounding-box filters.
create index yamato_branches_latlon_idx
  on public.yamato_branches (lat, lon);

alter table public.yamato_branches enable row level security;

create policy "yamato_branches public read"
  on public.yamato_branches
  for select
  using (true);
