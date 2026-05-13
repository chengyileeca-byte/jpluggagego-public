-- ============================================================
-- PostGIS: nearest-neighbour queries for Yamato branches
-- Sprint 5 — 地址 → 最近據點 + 報價
--
-- Adds geography(Point,4326) generated from existing lat/lon +
-- GIST index for ST_DWithin / ST_Distance queries.
-- ============================================================
create extension if not exists postgis;

alter table public.yamato_branches
  add column if not exists geog geography(Point, 4326)
  generated always as (
    st_setsrid(st_makepoint(lon, lat), 4326)::geography
  ) stored;

create index if not exists yamato_branches_geog_idx
  on public.yamato_branches
  using gist (geog);
