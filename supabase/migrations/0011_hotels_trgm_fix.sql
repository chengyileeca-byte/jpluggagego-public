-- ============================================================
-- Follow-up to 0010_hotels.sql:
--   1. Rakuten Travel API returns lat/lon in arc-seconds (秒),
--      not decimal degrees. All 42k rows scraped via v0.1 of
--      scrape-rakuten-hotels.ts have values ~3600× too large.
--      Backfill: divide by 3600 (≈JGD2011 → WGS84 degrees).
--      The `geog` generated column re-materializes automatically.
--   2. /api/hotels search uses ILIKE '%...%' on name_jp, which
--      can't use a B-tree index. Swap to GIN trigram so 42k-row
--      scans stay sub-second even without a pref filter.
-- ============================================================

-- Step 1: fix lat/lon for rows still storing arc-seconds.
-- The WHERE clause guards against re-running: rows already in
-- degrees (|lat| <= 90, |lon| <= 180) are skipped.
update public.hotels
set lat = lat / 3600.0,
    lon = lon / 3600.0
where (lat is not null and abs(lat) > 90)
   or (lon is not null and abs(lon) > 180);

-- Step 2: trigram GIN index for name_jp ILIKE searches.
create extension if not exists pg_trgm;

drop index if exists public.hotels_name_idx;
create index if not exists hotels_name_trgm_idx
  on public.hotels
  using gin (name_jp gin_trgm_ops);
