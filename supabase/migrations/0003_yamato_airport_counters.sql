-- ============================================================
-- Yamato 空港宅急便 櫃台一覽
-- From https://www.kuronekoyamato.co.jp/ytc/customer/send/services/airport/list.html
-- Operating hours are NOT on this page (only in the official PDF); we
-- capture hours in a separate scrape pass later.
-- ============================================================
create table if not exists public.yamato_airport_counters (
  id uuid primary key default gen_random_uuid(),
  airport_iata text not null,          -- NRT / HND / KIX / ITM / CTS / FUK / NGO / OKJ ...
  airport_name_jp text not null,       -- 成田空港第1ターミナル（北ウイング）
  terminal text,                       -- T1北 / T1南 / T2 / T3 / (null for airports without terminals)
  prefecture text not null,            -- 千葉県 / 東京都 / 大阪府 ...
  service_type text not null check (service_type in ('受取', '発送', '受取・発送')),
  floor text,                          -- 1F / 3F / 4F / B1 etc
  detail_url text,                     -- link back to Yamato's page
  hours_jst text,                      -- null for now; filled by later scraper
  phone text,                          -- null for now
  scraped_at timestamptz not null default now(),
  unique (airport_name_jp, service_type)
);

create index if not exists yamato_airport_counters_iata_idx
  on public.yamato_airport_counters (airport_iata);

alter table public.yamato_airport_counters enable row level security;

create policy "yamato_airport_counters public read"
  on public.yamato_airport_counters
  for select
  using (true);
