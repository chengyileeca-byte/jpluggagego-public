-- ============================================================
-- 郵便局 (post office) master list from OpenStreetMap
-- Source: Overpass API, filter amenity=post_office, area Japan
-- License: ODbL — attribution required:
--   "地図データ © OpenStreetMap contributors, ODbL"
--
-- Scale: ~21,500 nodes as of 2026-04
-- ============================================================
create table if not exists public.yuu_post_offices (
  osm_id bigint primary key,              -- OSM node id
  name_jp text not null,                  -- name / name:ja (e.g. 新宿郵便局)
  name_en text,                           -- name:en if provided
  address_jp text,                        -- addr:full or composed
  prefecture text,                        -- is_in:state / addr:province / derived
  postal_code text,                       -- addr:postcode, 7-digit
  phone text,                             -- phone / contact:phone
  opening_hours text,                     -- raw OSM opening_hours string
  website text,                           -- website / contact:website
  lat double precision not null,
  lon double precision not null,
  geog geography(Point, 4326)
    generated always as (
      st_setsrid(st_makepoint(lon, lat), 4326)::geography
    ) stored,
  raw_tags jsonb,                         -- keep full tag bag for future enrichment
  scraped_at timestamptz not null default now()
);

create index if not exists yuu_post_offices_geog_idx
  on public.yuu_post_offices
  using gist (geog);

create index if not exists yuu_post_offices_pref_idx
  on public.yuu_post_offices (prefecture);

create index if not exists yuu_post_offices_postal_idx
  on public.yuu_post_offices (postal_code);

alter table public.yuu_post_offices enable row level security;

create policy "yuu_post_offices public read"
  on public.yuu_post_offices
  for select
  using (true);
