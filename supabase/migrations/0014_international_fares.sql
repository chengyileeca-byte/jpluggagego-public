-- ============================================================
-- 國際寄送料金 · 台灣優先(Phase 2 / Sprint 6)
--
-- 三張表:
--   1. yuu_intl_fares          — 郵便局 EMS / 国際小包(air/SAL/sea) 爬蟲來源
--   2. yamato_intl_fares       — Yamato 國際宅急便 人肉維護
--   3. intl_country_conditions — 每國 metadata(zone、重量上限、禁制摘要)
--
-- 參考 docs/to-taiwan-plan.md §3 schema 設計。
-- ============================================================

-- ------------------------------------------------------------
-- (1) 郵便局国際料金(爬蟲表)
-- ------------------------------------------------------------
create table if not exists public.yuu_intl_fares (
  id bigserial primary key,
  service_type text not null check (service_type in (
    'ems',
    'parcel_air',
    'parcel_sal',
    'parcel_surface',
    'small_air',
    'small_sal',
    'small_surface'
  )),
  zone text not null,                     -- '1' = 台灣/韓/中, '2' = 東南亞, ...
  country_iso2 text not null,             -- 'TW', 'HK', 'KR', 'CN' ...
  weight_grams integer not null,          -- 500, 1000, 2000, 5000, 10000, 20000, 30000
  price_jpy integer not null,
  max_weight_kg numeric,                  -- 該國此服務的最大上限 (30 for TW)
  status text not null default 'active' check (status in ('active','suspended')),
  scraped_at timestamptz not null default now(),
  unique (service_type, country_iso2, weight_grams)
);

create index if not exists yuu_intl_fares_country_service_idx
  on public.yuu_intl_fares (country_iso2, service_type, weight_grams);

alter table public.yuu_intl_fares enable row level security;

create policy "yuu_intl_fares public read"
  on public.yuu_intl_fares
  for select
  using (true);

-- ------------------------------------------------------------
-- (2) Yamato 國際宅急便(人肉維護表)
-- ------------------------------------------------------------
create table if not exists public.yamato_intl_fares (
  id bigserial primary key,
  country_iso2 text not null,
  size_code text not null check (size_code in (
    'b4_doc', '60', '80', '100', '120', '140', '160'
  )),
  max_weight_kg numeric not null,
  price_jpy integer not null,
  verified_at timestamptz not null,       -- 人肉校對日(每季更新)
  unique (country_iso2, size_code)
);

create index if not exists yamato_intl_fares_country_idx
  on public.yamato_intl_fares (country_iso2);

alter table public.yamato_intl_fares enable row level security;

create policy "yamato_intl_fares public read"
  on public.yamato_intl_fares
  for select
  using (true);

-- ------------------------------------------------------------
-- (3) 國家 metadata(每國一筆)
-- ------------------------------------------------------------
create table if not exists public.intl_country_conditions (
  country_iso2 text primary key,
  name_zh text not null,
  name_ja text not null,
  zone text not null,
  yuu_max_weight_kg numeric not null,
  yuu_max_length_cm numeric not null,
  yuu_max_length_girth_cm numeric not null,
  yamato_max_weight_kg numeric,           -- nullable: Yamato 未服務該國時為 null
  yamato_transit_days text,               -- '+5~+6' 之類 range 字串
  updated_at timestamptz not null default now()
);

alter table public.intl_country_conditions enable row level security;

create policy "intl_country_conditions public read"
  on public.intl_country_conditions
  for select
  using (true);
