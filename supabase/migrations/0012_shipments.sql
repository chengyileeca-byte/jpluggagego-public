-- ============================================================
-- Shipment tracking bound to LINE users.
--
-- User flow:
--   1. User sends `追蹤 123456789012` (or bare 12-digit no) to the
--      LINE bot.
--   2. Webhook resolves event.source.userId, classifies carrier
--      from the tracking number shape, inserts a shipment row.
--   3. Cron (GitHub Actions → /api/cron/track, every 30min) polls
--      non-stopped rows, scrapes the carrier status page, and
--      pushes the LINE user a message when status changes.
--
-- Why `stopped` instead of just deleting: we want to leave the row
-- for user-visible history ("you tracked X last week, delivered on Y"),
-- and `stopped_reason` is useful for debugging scraper breakage vs
-- real terminal states.
-- ============================================================
create table if not exists public.shipments (
  id bigint generated always as identity primary key,
  line_user_id text not null,
  carrier text not null check (carrier in ('yamato', 'yuu')),
  tracking_no text not null,

  -- Latest known state. null until first successful scrape.
  last_status text,
  last_status_at timestamptz,
  last_checked_at timestamptz,

  -- Cron state. Once stopped=true the cron skips this row forever.
  -- Terminal: carrier reported 配達完了 / お届け済み / 返送完了.
  -- Invalid: 3 consecutive "tracking number not found" — user mis-
  --   typed, or package never handed over.
  stopped boolean not null default false,
  stopped_reason text check (stopped_reason in ('terminal', 'invalid', 'error')),
  not_found_count int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- A single user can only track a given number once. Re-sending the
  -- same number is an idempotent no-op ("already tracking").
  unique (line_user_id, tracking_no)
);

-- Cron's hot-path query: "give me up to N non-stopped rows whose
-- last_checked_at is null or older than 30min, oldest first".
create index if not exists shipments_due_idx
  on public.shipments (stopped, last_checked_at nulls first)
  where stopped = false;

-- Trigger: bump updated_at on any UPDATE.
create or replace function public.touch_shipments_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shipments_updated_at on public.shipments;
create trigger shipments_updated_at
  before update on public.shipments
  for each row execute function public.touch_shipments_updated_at();

-- RLS: locked down. Only the service-role key (webhook + cron) writes
-- here. No anon/authenticated access at all — users interact via LINE.
alter table public.shipments enable row level security;
-- No policies = no access for non-service roles.
