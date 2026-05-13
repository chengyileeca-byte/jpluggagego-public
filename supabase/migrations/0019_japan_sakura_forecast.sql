-- tenki.jp 櫻花前線 403 觀測點 daily sync (Stage C MVP)
--
-- 為什麼獨立一張表不塞 japan_entries:
--   japan_entries 是「編輯內容」(手動策展的景點、餐廳、祭典),
--   sakura forecast 是「觀測時序」(外部數據,每日變動,403 筆)。
--   混表會讓兩種資料模型糾纏,並且 RLS/編輯流程都不一樣。
--
-- 每次 scrape 以 spot_id 做 UPSERT,forecast/observed 欄位會被覆寫為最新值;
-- 歷史版本不保留(MVP 不需要)。未來若要 year-over-year 比較再另開 history table。

create table if not exists public.japan_sakura_forecast (
  -- tenki.jp 的 spot id(URL 上的數字組合,例:33_2111 = 北海道函館公園)
  spot_id text primary key,

  -- 地點資訊
  spot_name_ja text not null,
  prefecture_ja text not null,
  region text not null check (region in (
    'hokkaido', 'tohoku', 'kanto', 'chubu', 'kansai',
    'chugoku', 'shikoku', 'kyushu', 'okinawa'
  )),
  lg_code text references public.japan_municipalities(lg_code)
    on update cascade on delete set null,

  -- 座標(tenki.jp 頁面有提供)
  lat double precision,
  lon double precision,

  -- 預測日
  forecast_first_bloom date, -- 開花予想
  forecast_full_bloom date,  -- 満開予想

  -- 觀測日(開花宣言/満開宣言之後填入)
  observed_first_bloom date,
  observed_full_bloom date,

  -- 溯源
  source_url text,
  scraped_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

-- 都道府縣下探(區域頁列出該縣所有觀測點)
create index if not exists japan_sakura_forecast_pref_idx
  on public.japan_sakura_forecast (prefecture_ja, forecast_first_bloom);

-- 地方分區(全域頁按 region 分組)
create index if not exists japan_sakura_forecast_region_idx
  on public.japan_sakura_forecast (region, forecast_first_bloom);

-- lg_code 關聯(市町村頁)
create index if not exists japan_sakura_forecast_lg_idx
  on public.japan_sakura_forecast (lg_code)
  where lg_code is not null;

-- updated_at 自動更新
create or replace function public.japan_sakura_forecast_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists japan_sakura_forecast_touch_updated_at
  on public.japan_sakura_forecast;
create trigger japan_sakura_forecast_touch_updated_at
  before update on public.japan_sakura_forecast
  for each row execute function public.japan_sakura_forecast_touch_updated_at();

-- 公開讀,寫入一律 service-role(同 japan_entries pattern)
alter table public.japan_sakura_forecast enable row level security;

drop policy if exists japan_sakura_forecast_read on public.japan_sakura_forecast;
create policy japan_sakura_forecast_read on public.japan_sakura_forecast
  for select to anon, authenticated using (true);
