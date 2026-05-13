-- ============================================================
-- Japan Post 郵便番号 → 住所 lookup (KEN_ALL dataset)
-- Source: https://www.post.japanpost.jp/zipcode/dl/kogaki-zip.html
--   ken_all.zip (shift-jis CSV, ~13万 rows, ~7MB)
-- License: 日本郵便 free-use, no attribution required.
--
-- Purpose: when user pastes a romaji address from Google Maps containing
-- a postal code (`xxx-xxxx`), reverse-lookup to produce a Japanese address
-- that GSI can geocode to 町名 precision (~100-500m).
--
-- Scale: Japan has ~123k unique postal codes. A single code usually maps
-- to one (pref, city, town), but some big codes split across rows in
-- ken_all.csv — we collapse on import.
-- ============================================================
create table if not exists public.postal_codes (
  postal_code text primary key,          -- 7-digit, no hyphen: "9638811"
  prefecture text not null,              -- 福島県
  city text not null,                    -- 郡山市
  town text not null,                    -- 方八町
  imported_at timestamptz not null default now()
);

create index if not exists postal_codes_pref_idx
  on public.postal_codes (prefecture);

alter table public.postal_codes enable row level security;

create policy "postal_codes public read"
  on public.postal_codes
  for select
  using (true);
