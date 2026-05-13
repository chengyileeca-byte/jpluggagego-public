-- JPLuggageGo · initial schema
-- Aligns with 專精方向.txt §VII and JPLuggageGo 市場驗證.txt §2.4 / §2.7

create extension if not exists "pgcrypto";

-- ============================================================
-- users
-- ============================================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  line_user_id text unique,
  display_name text,
  lang text default 'zh-TW' check (lang in ('zh-TW','zh-CN','en','ja')),
  tier text default 'free' check (tier in ('free','premium')),
  created_at timestamptz not null default now()
);
create index if not exists users_line_user_id_idx on public.users (line_user_id);

-- ============================================================
-- trips & hotels
-- ============================================================
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text,
  start_date date not null,
  end_date date not null,
  status text default 'draft' check (status in ('draft','active','completed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);
create index if not exists trips_user_id_idx on public.trips (user_id);

create table if not exists public.trip_hotels (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  order_index int not null,
  hotel_name text not null,
  address text,
  prefecture text,
  city text,
  lat double precision,
  lng double precision,
  check_in date not null,
  check_out date not null,
  created_at timestamptz not null default now(),
  check (check_out >= check_in)
);
create index if not exists trip_hotels_trip_id_idx on public.trip_hotels (trip_id, order_index);

-- ============================================================
-- Scraped data: Yamato
-- ============================================================
create table if not exists public.yamato_fares (
  from_pref text not null,
  to_pref text not null,
  size_code text not null,
  price_jpy int not null,
  scraped_at timestamptz not null default now(),
  primary key (from_pref, to_pref, size_code)
);

create table if not exists public.yamato_branches (
  id uuid primary key default gen_random_uuid(),
  branch_code text unique,
  name text not null,
  address text,
  prefecture text,
  city text,
  lat double precision,
  lng double precision,
  phone text,
  hours text,
  raw jsonb,
  scraped_at timestamptz not null default now()
);
create index if not exists yamato_branches_pref_idx on public.yamato_branches (prefecture, city);

-- ============================================================
-- Scraped data: ecbo cloak
-- ============================================================
create table if not exists public.ecbo_locations (
  id uuid primary key default gen_random_uuid(),
  ecbo_id text unique not null,
  slug text,
  name text not null,
  address text,
  prefecture text,
  city text,
  lat double precision,
  lng double precision,
  price_small_jpy int,
  price_large_jpy int,
  operating_hours text,
  raw jsonb,
  scraped_at timestamptz not null default now()
);
create index if not exists ecbo_locations_pref_idx on public.ecbo_locations (prefecture, city);

-- ============================================================
-- Ratings (核心 moat)
-- ============================================================
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete set null,
  target_type text not null check (
    target_type in ('yamato_branch','hotel','ecbo_location','route_plan')
  ),
  target_id text not null,
  stars int not null check (stars between 1 and 5),
  comment text,
  route_price_accurate boolean,
  timing_accurate boolean,
  would_recommend boolean,
  lang text default 'zh-TW',
  flagged_for_review boolean not null default false,
  editable_until timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);
create index if not exists ratings_target_idx on public.ratings (target_type, target_id);
create index if not exists ratings_user_idx on public.ratings (user_id);

-- Auto-flag 1-star ratings for human review (防惡意)
create or replace function public.flag_low_star_rating()
returns trigger language plpgsql as $$
begin
  if new.stars = 1 then new.flagged_for_review := true; end if;
  return new;
end $$;

drop trigger if exists trg_flag_low_star on public.ratings;
create trigger trg_flag_low_star
  before insert on public.ratings
  for each row execute function public.flag_low_star_rating();

-- ============================================================
-- rating_aggregates (SEO 頁面直接讀此表,避免逐筆 scan)
-- ============================================================
create table if not exists public.rating_aggregates (
  target_type text not null,
  target_id text not null,
  avg_stars numeric(3,2) not null default 0,
  total_count int not null default 0,
  last_updated timestamptz not null default now(),
  primary key (target_type, target_id)
);

create or replace function public.refresh_rating_aggregate(
  p_target_type text, p_target_id text
) returns void language plpgsql as $$
begin
  insert into public.rating_aggregates (target_type, target_id, avg_stars, total_count, last_updated)
  select
    p_target_type,
    p_target_id,
    coalesce(round(avg(stars)::numeric, 2), 0),
    count(*),
    now()
  from public.ratings
  where target_type = p_target_type
    and target_id = p_target_id
    and flagged_for_review = false
  on conflict (target_type, target_id) do update
    set avg_stars = excluded.avg_stars,
        total_count = excluded.total_count,
        last_updated = excluded.last_updated;
end $$;

create or replace function public.trg_rating_change()
returns trigger language plpgsql as $$
begin
  perform public.refresh_rating_aggregate(
    coalesce(new.target_type, old.target_type),
    coalesce(new.target_id, old.target_id)
  );
  return coalesce(new, old);
end $$;

drop trigger if exists trg_ratings_aggregate on public.ratings;
create trigger trg_ratings_aggregate
  after insert or update or delete on public.ratings
  for each row execute function public.trg_rating_change();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.users enable row level security;
alter table public.trips enable row level security;
alter table public.trip_hotels enable row level security;
alter table public.ratings enable row level security;

-- Public read for scraped reference data & aggregates
alter table public.yamato_fares enable row level security;
alter table public.yamato_branches enable row level security;
alter table public.ecbo_locations enable row level security;
alter table public.rating_aggregates enable row level security;

-- Policies: users can read/update their own row
drop policy if exists users_self_read on public.users;
create policy users_self_read on public.users
  for select using (auth.uid() = id);

drop policy if exists users_self_update on public.users;
create policy users_self_update on public.users
  for update using (auth.uid() = id);

-- trips & trip_hotels: user scoped
drop policy if exists trips_self on public.trips;
create policy trips_self on public.trips
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists trip_hotels_via_trip on public.trip_hotels;
create policy trip_hotels_via_trip on public.trip_hotels
  for all using (
    exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid())
  );

-- ratings: insert/update by owner, public read (for SEO pages)
drop policy if exists ratings_public_read on public.ratings;
create policy ratings_public_read on public.ratings
  for select using (flagged_for_review = false);

drop policy if exists ratings_owner_write on public.ratings;
create policy ratings_owner_write on public.ratings
  for insert with check (auth.uid() = user_id);

drop policy if exists ratings_owner_update on public.ratings;
create policy ratings_owner_update on public.ratings
  for update using (auth.uid() = user_id and editable_until > now());

-- Scraped reference data: public read
drop policy if exists yamato_fares_read on public.yamato_fares;
create policy yamato_fares_read on public.yamato_fares for select using (true);

drop policy if exists yamato_branches_read on public.yamato_branches;
create policy yamato_branches_read on public.yamato_branches for select using (true);

drop policy if exists ecbo_locations_read on public.ecbo_locations;
create policy ecbo_locations_read on public.ecbo_locations for select using (true);

drop policy if exists rating_aggregates_read on public.rating_aggregates;
create policy rating_aggregates_read on public.rating_aggregates for select using (true);
