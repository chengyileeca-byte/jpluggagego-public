# Supabase

## Running the initial migration

The repo stores SQL migrations under `supabase/migrations/`. Apply them in one of two ways:

### Option A — Supabase Studio (fastest, no CLI)

1. Open https://supabase.com/dashboard → your project → SQL Editor
2. Paste the contents of `supabase/migrations/0001_init.sql`
3. Run

### Option B — Supabase CLI

```bash
npx supabase link --project-ref <YOUR_PROJECT_REF>
npx supabase db push
```

## Required env vars

After the migration, copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose)

These live in Supabase Dashboard → Project Settings → API.
