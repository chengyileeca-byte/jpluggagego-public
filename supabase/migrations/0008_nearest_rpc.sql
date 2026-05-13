-- ============================================================
-- Nearest-neighbour RPC for /quote address mode
-- Consumed by src/lib/nearest-branch.ts via supabase.rpc(...)
-- ============================================================

create or replace function public.nearest_yamato_branches(
  target_lat double precision,
  target_lon double precision,
  radius_m double precision default 5000,
  result_limit integer default 5
)
returns table (
  branch_code text,
  name_jp text,
  address_jp text,
  prefecture text,
  postal_code text,
  phone text,
  lat double precision,
  lon double precision,
  hours_weekday text,
  last_accept_weekday text,
  hours_saturday text,
  hours_sunday_holiday text,
  distance_m double precision
)
language sql
stable
as $$
  select
    b.branch_code,
    b.name_jp,
    b.address_jp,
    b.prefecture,
    b.postal_code,
    b.phone,
    b.lat,
    b.lon,
    b.hours_weekday,
    b.last_accept_weekday,
    b.hours_saturday,
    b.hours_sunday_holiday,
    st_distance(
      b.geog,
      st_setsrid(st_makepoint(target_lon, target_lat), 4326)::geography
    ) as distance_m
  from public.yamato_branches b
  where st_dwithin(
    b.geog,
    st_setsrid(st_makepoint(target_lon, target_lat), 4326)::geography,
    radius_m
  )
  order by b.geog <-> st_setsrid(st_makepoint(target_lon, target_lat), 4326)::geography
  limit result_limit;
$$;

create or replace function public.nearest_yuu_post_offices(
  target_lat double precision,
  target_lon double precision,
  radius_m double precision default 5000,
  result_limit integer default 5
)
returns table (
  osm_id bigint,
  name_jp text,
  name_en text,
  address_jp text,
  prefecture text,
  postal_code text,
  phone text,
  opening_hours text,
  website text,
  lat double precision,
  lon double precision,
  distance_m double precision
)
language sql
stable
as $$
  select
    p.osm_id,
    p.name_jp,
    p.name_en,
    p.address_jp,
    p.prefecture,
    p.postal_code,
    p.phone,
    p.opening_hours,
    p.website,
    p.lat,
    p.lon,
    st_distance(
      p.geog,
      st_setsrid(st_makepoint(target_lon, target_lat), 4326)::geography
    ) as distance_m
  from public.yuu_post_offices p
  where st_dwithin(
    p.geog,
    st_setsrid(st_makepoint(target_lon, target_lat), 4326)::geography,
    radius_m
  )
  order by p.geog <-> st_setsrid(st_makepoint(target_lon, target_lat), 4326)::geography
  limit result_limit;
$$;

grant execute on function public.nearest_yamato_branches(double precision, double precision, double precision, integer) to anon, authenticated;
grant execute on function public.nearest_yuu_post_offices(double precision, double precision, double precision, integer) to anon, authenticated;
