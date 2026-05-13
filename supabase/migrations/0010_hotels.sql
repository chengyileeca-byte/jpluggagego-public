-- ============================================================
-- Hotel master list, sourced from Rakuten Travel API
-- Source: https://webservice.rakuten.co.jp/api/simplehotelsearch/
-- License: Rakuten Web Service — free-use with attribution.
--   UI must show: "ホテル情報提供: 楽天トラベル" + link to hotelInformationUrl.
--
-- Purpose: power the /trip stay-form 飯店下拉選單 (name + address
-- auto-fill) and the /quote 概略價 hotel picker. Brand-level 代收/代寄
-- capability comes from src/lib/hotel-policies.ts via string match on
-- name_jp — persisted here as `brand` + `brand_can_send` for fast filter.
--
-- Scale: ~15-25k hotels across 47 prefectures (Rakuten's coverage).
-- ============================================================
create table if not exists public.hotels (
  rakuten_hotel_no bigint primary key,
  name_jp text not null,                 -- hotelName
  name_kana text,                        -- hotelKanaName
  prefecture text,                       -- == address1, e.g. "東京都"
  address1 text,                         -- prefecture, kept separately
  address2 text,                         -- city + town + block
  postal_code text,
  phone text,
  lat double precision,
  lon double precision,
  geog geography(Point, 4326)
    generated always as (
      case
        when lat is not null and lon is not null
        then st_setsrid(st_makepoint(lon, lat), 4326)::geography
        else null
      end
    ) stored,
  brand text,                            -- matched brand name from hotel-policies.ts, null if unknown
  brand_can_send text,                   -- "yes" | "case-by-case" | "check"
  rakuten_url text,                      -- hotelInformationUrl (may include ?afid=)
  min_charge_jpy integer,                -- hotelMinCharge (reference only)
  review_count integer,
  review_average numeric(3, 2),
  raw jsonb,                             -- full hotelBasicInfo for future enrichment
  scraped_at timestamptz not null default now()
);

create index if not exists hotels_geog_idx
  on public.hotels
  using gist (geog);

create index if not exists hotels_prefecture_idx
  on public.hotels (prefecture);

create index if not exists hotels_brand_idx
  on public.hotels (brand);

create index if not exists hotels_name_idx
  on public.hotels (name_jp);

alter table public.hotels enable row level security;

create policy "hotels public read"
  on public.hotels
  for select
  using (true);
