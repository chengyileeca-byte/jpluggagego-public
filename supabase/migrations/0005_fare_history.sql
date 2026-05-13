-- ============================================================
-- fare_history — append-only snapshot of every weekly scrape.
--
-- Purpose: enable 6-month price-trend charts on /quote, and
-- detect silent carrier price changes. yamato_fares / yuu_pack_fares
-- remain upsert-on-conflict (newest price wins), but each scrape run
-- also appends one row per (carrier, from_pref, to_pref, size_code)
-- here so history is never overwritten.
--
-- Keyed on captured_at → a single scrape run will naturally produce
-- identical captured_at for all its rows; we keep primary-key uniqueness
-- by including captured_at, so retries in the same millisecond are rare
-- and would simply ON CONFLICT DO NOTHING.
-- ============================================================

create table if not exists public.fare_history (
  carrier text not null check (carrier in ('yamato', 'yuu_pack')),
  from_pref text not null,
  to_pref text not null,
  size_code text not null,
  price_jpy int not null,
  captured_at timestamptz not null default now(),
  primary key (carrier, from_pref, to_pref, size_code, captured_at)
);

-- Main lookup: "show me the 6-month series for Tokyo→Osaka 120 Yamato"
create index if not exists fare_history_route_time_idx
  on public.fare_history (carrier, from_pref, to_pref, size_code, captured_at desc);

-- Prune index: "which rows are older than 2 years?"
create index if not exists fare_history_captured_at_idx
  on public.fare_history (captured_at);

alter table public.fare_history enable row level security;

create policy "fare_history public read"
  on public.fare_history
  for select
  using (true);
