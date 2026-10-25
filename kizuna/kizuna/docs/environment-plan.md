# SAKURA Environment Variable Plan

Environment variables must be read on the server unless a value is intentionally public. Do not
expose database URLs, direct database credentials, service-role keys, or future auth secrets to
the browser.

## Current variables

| Variable | Current use | Target handling |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser Supabase client and seed script | Replace application use with server-only `DATABASE_URL`; keep only for an explicit Supabase-hosted integration if needed |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser Supabase client | Retire after Prisma migration; never use it as a database credential |
| `SUPABASE_SERVICE_ROLE_KEY` | `scripts/seed.ts` | Retire or restrict to a separate one-off import tool; never load in a client bundle |

## Target variables

### Required application configuration

| Variable | Visibility | Purpose |
|---|---|---|
| `DATABASE_URL` | server-only | Prisma pooled PostgreSQL/Supabase connection string for application runtime |
| `DIRECT_URL` | server-only | Prisma migration/direct connection when the provider requires a separate non-pooled URL |
| `APP_ENV` | server-only | `development`, `test`, or `production`; controls explicit adapter and logging behavior |
| `LOG_LEVEL` | server-only | Structured log level with a safe production default |

### Optional operational configuration

| Variable | Visibility | Purpose |
|---|---|---|
| `SENTRY_DSN` | server-only | Error reporting, if the deployment standard selects Sentry |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | server-only | Trace export endpoint, if OpenTelemetry is enabled |
| `SEED_DATABASE` | server-only/CI | Explicit opt-in for non-production seed execution |

### Future, not to be added in this phase

- Auth issuer/client credentials.
- Session encryption secrets.
- External API keys.
- Intelligence service URL or service token.
- Payment or partner credentials.

## Loading and validation rules

1. Parse environment variables once in a server-only module.
2. Validate required values at startup with actionable errors.
3. Fail fast in production when `DATABASE_URL` is missing or invalid.
4. Permit mock data only when `APP_ENV=development` or an explicit test/demo adapter is selected.
5. Never use an empty string or a public variable as a success-shaped database fallback.
6. Keep `.env.example` limited to names and safe placeholders; document secret ownership outside
   the repository.

## Deployment environments

- **Local:** mock adapter by default; optional local/staging PostgreSQL for Prisma development.
- **CI:** isolated test database URL; migrations run before integration tests.
- **Staging:** Supabase PostgreSQL project with Prisma migrations and seeded non-production data.
- **Production:** separate Supabase PostgreSQL project, pooled runtime connection, direct migration
  connection restricted to deployment jobs, and no seed credentials in the web process.

