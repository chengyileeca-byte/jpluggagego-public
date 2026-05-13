-- 日本大小事備忘錄 主內容表 (japan_entries)
--
-- 依據 docs/japan-prep-plan.md §5(v0.4)設計。
--
-- 模型摘要:
--   - 6 大類(衣食住行育樂 → fashion/food/lodging/transport/culture/entertainment)。
--   - sub_type 為自由文字,列舉清單見企劃書 §3,可隨類別擴充。
--   - 地理欄位同時保留 prefecture_ja / gun_ja / municipality_ja(日文原文)
--     與 lg_code(総務省 5 位碼)—— 前者讓 admin 編輯直覺,後者為權威 key。
--   - 時序分「季節範圍 (season_start/end)」與「一次性事件 (event_start/end)」。
--     season 的年份無意義,用月/日讀取即可,供「今日時序」查詢。
--   - external_urls = jsonb,依來源存(official/tabelog/jalan/booking...)。
--   - RLS 全公開讀;寫入由 admin API route 以 service-role 執行。

create table if not exists public.japan_entries (
  id bigserial primary key,
  slug text unique not null,

  category text not null check (category in (
    'food', 'fashion', 'lodging', 'transport', 'culture', 'entertainment'
  )),
  sub_type text not null,

  -- 顯示內容(永久繁中 only)
  title_zh text not null,
  title_ja text,
  romaji text,
  summary_zh text not null,
  content_md text,

  -- 地理階層
  region text not null check (region in (
    'hokkaido', 'tohoku', 'kanto', 'chubu', 'kansai',
    'chugoku', 'shikoku', 'kyushu', 'okinawa'
  )),
  prefecture_ja text not null,
  gun_ja text,
  municipality_ja text,
  lg_code text references public.japan_municipalities(lg_code)
    on update cascade on delete set null,
  area_types text[] not null default '{}',

  -- 座標(可選,用於地圖/距離查詢)
  lat double precision,
  lon double precision,

  -- 時序
  season_start date,
  season_end date,
  event_start timestamptz,
  event_end timestamptz,

  -- 屬性
  price_tier smallint check (price_tier is null or price_tier between 0 and 5),
  booking_window_days int,
  closed_days text[] not null default '{}',

  external_urls jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',

  -- 來源追蹤
  source text not null default 'manual' check (source in ('manual', 'api', 'ugc')),
  last_verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 分類 + 都道府縣查詢(列表 / 分類頁)
create index if not exists japan_entries_category_pref_idx
  on public.japan_entries (category, prefecture_ja);

-- 市町村下探(市町村頁)
create index if not exists japan_entries_muni_idx
  on public.japan_entries (prefecture_ja, gun_ja, municipality_ja);

-- 地方分區 + 類別(首頁分區卡)
create index if not exists japan_entries_region_idx
  on public.japan_entries (region, category);

-- LG Code 直查(深連接)
create index if not exists japan_entries_lg_idx
  on public.japan_entries (lg_code)
  where lg_code is not null;

-- 季節範圍(今日時序)
create index if not exists japan_entries_season_idx
  on public.japan_entries (season_start, season_end)
  where season_start is not null;

-- 事件日期(日期×地點查詢)
create index if not exists japan_entries_event_idx
  on public.japan_entries (event_start, event_end)
  where event_start is not null;

-- area_types / tags 陣列查詢用 GIN
create index if not exists japan_entries_area_types_gin
  on public.japan_entries using gin (area_types);

create index if not exists japan_entries_tags_gin
  on public.japan_entries using gin (tags);

-- updated_at 自動更新
create or replace function public.japan_entries_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists japan_entries_touch_updated_at on public.japan_entries;
create trigger japan_entries_touch_updated_at
  before update on public.japan_entries
  for each row execute function public.japan_entries_touch_updated_at();

-- 全公開讀,寫入一律 service-role。
alter table public.japan_entries enable row level security;

drop policy if exists japan_entries_read on public.japan_entries;
create policy japan_entries_read on public.japan_entries
  for select to anon, authenticated using (true);
