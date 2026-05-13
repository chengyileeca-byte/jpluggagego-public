-- Fix Supabase Security Advisor warnings — Phase 2 (2026-04-29)
--
-- Two classes of issues addressed:
--   (A) Function Search Path Mutable × 10 — our own functions/triggers
--       lack `search_path` setting, vulnerable to schema-injection.
--   (B) RLS Enabled No Policy × 3 — admin-only tables (intentional
--       service-role-only access). Add explicit deny-all policies to
--       make the intent visible to the linter.
--
-- Note: PostGIS-owned functions (st_estimatedextent ×6) and extensions
-- (postgis, pg_trgm in public) cannot be fixed (superuser ownership).
-- See 0024 for acknowledgement.

-- ──────────────────────────────────────────────────────────────────────
-- (A) Function Search Path Mutable — pin search_path to public, pg_temp
-- ──────────────────────────────────────────────────────────────────────

alter function public.flag_low_star_rating()
  set search_path = public, pg_temp;

alter function public.refresh_rating_aggregate(text, text)
  set search_path = public, pg_temp;

alter function public.trg_rating_change()
  set search_path = public, pg_temp;

alter function public.nearest_yamato_branches(
  double precision, double precision, double precision, integer
) set search_path = public, pg_temp;

alter function public.nearest_yuu_post_offices(
  double precision, double precision, double precision, integer
) set search_path = public, pg_temp;

alter function public.touch_shipments_updated_at()
  set search_path = public, pg_temp;

alter function public.touch_updated_at()
  set search_path = public, pg_temp;

alter function public.location_reports_rate_limit()
  set search_path = public, pg_temp;

alter function public.japan_entries_touch_updated_at()
  set search_path = public, pg_temp;

alter function public.japan_sakura_forecast_touch_updated_at()
  set search_path = public, pg_temp;

-- ──────────────────────────────────────────────────────────────────────
-- (B) RLS Enabled No Policy — make deny-all intent explicit
-- ──────────────────────────────────────────────────────────────────────
-- These three tables are intentionally service-role-only (admin data).
-- The linter flags "RLS enabled but no policy = nothing visible" as
-- ambiguous design. Adding explicit `using (false)` policies for anon +
-- authenticated makes the intent unambiguous. Service role bypasses RLS.

create policy "shipments_deny_all_non_service" on public.shipments
  for all to anon, authenticated using (false) with check (false);

create policy "hotel_chain_reports_deny_all_non_service"
  on public.hotel_chain_reports
  for all to anon, authenticated using (false) with check (false);

create policy "location_reports_deny_all_non_service"
  on public.location_reports
  for all to anon, authenticated using (false) with check (false);
