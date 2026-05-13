-- ============================================================
-- ゆうパック (Japan Post) fares
-- Mirrors yamato_fares shape. Size codes differ: 60,80,100,120,140,160,170.
-- ============================================================
create table if not exists public.yuu_pack_fares (
  from_pref text not null,
  to_pref text not null,
  size_code text not null,
  price_jpy int not null,
  scraped_at timestamptz not null default now(),
  primary key (from_pref, to_pref, size_code)
);

alter table public.yuu_pack_fares enable row level security;

create policy "yuu_pack_fares public read"
  on public.yuu_pack_fares
  for select
  using (true);
