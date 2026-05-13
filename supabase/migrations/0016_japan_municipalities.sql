-- 全日本市町村基準表 (japan_municipalities)
--
-- 資料源:総務省「全国地方公共団体コード」(毎年 1 月 1 日現在)
-- https://www.soumu.go.jp/denshijiti/code.html
--
-- 設計邏輯:
--   - lg_code 5 位(都道府縣 2 + 市區町村 3),不含 checksum。
--   - 47 都道府縣本身亦視為 entry(lg_code 末 3 位 = "000")供父層瀏覽用。
--   - 北海道獨有「振興局(subprefecture)」階層(14 局),非法定但實務常用。
--   - 政令指定都市的区用 parent_city_ja 標示親市(如「札幌市」「大阪市」)。
--   - 郡(gun_ja)僅鄉村町村使用,不含「郡」字。
--
-- 名稱顯示規範:
--   - prefecture_ja / gun_ja / name_ja 一律日文原文(北広島町、広島県)。
--   - name_zh 為繁中慣用譯名(可選,手動 curation)。
--   - UI 顯示繁中時,在前面自動加「廣島縣 · 山縣郡」這類路徑。

create table if not exists public.japan_municipalities (
  lg_code text primary key,
  region text not null check (region in (
    'hokkaido', 'tohoku', 'kanto', 'chubu', 'kansai',
    'chugoku', 'shikoku', 'kyushu', 'okinawa'
  )),
  prefecture_ja text not null,
  subprefecture_ja text,                 -- 振興局(北海道 14 局)
  gun_ja text,                           -- 郡(鄉村町村,不含「郡」字)
  parent_city_ja text,                   -- 政令市親市名(wards 專用)
  name_ja text not null,                 -- 市/区/町/村 名(不含郡/親市前綴)
  name_kana text,                        -- 全形片假名
  name_romaji text,                      -- 羅馬字(Hepburn)
  kind text not null check (kind in (
    'prefecture',
    'designated_city',
    'city',
    'ward',
    'special_ward',
    'town',
    'village'
  )),
  name_zh text,                          -- 繁中譯名(手動 curation)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists japan_municipalities_pref_idx
  on public.japan_municipalities (prefecture_ja, gun_ja);

create index if not exists japan_municipalities_region_idx
  on public.japan_municipalities (region);

create index if not exists japan_municipalities_subpref_idx
  on public.japan_municipalities (subprefecture_ja)
  where subprefecture_ja is not null;

create index if not exists japan_municipalities_parent_idx
  on public.japan_municipalities (parent_city_ja)
  where parent_city_ja is not null;

-- 開放 anon 讀,這是純靜態參考資料
alter table public.japan_municipalities enable row level security;

drop policy if exists japan_municipalities_read on public.japan_municipalities;
create policy japan_municipalities_read on public.japan_municipalities
  for select to anon, authenticated using (true);
