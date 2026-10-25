# SAKURA Backend Dependency List

This is the proposed dependency set for the backend migration. It is a planning list; packages
are not installed by this audit and the UI dependency manifest is intentionally unchanged.

## Required for the first Prisma migration

| Package | Purpose | Scope |
|---|---|---|
| `prisma` | Schema, migrations, Prisma CLI, generate/seed tooling | dev dependency |
| `@prisma/client` | Typed PostgreSQL data access at runtime | dependency |
| `zod` | Request, environment, and service-boundary validation | dependency |

## Recommended production support

| Package | Purpose | Scope |
|---|---|---|
| `pino` | Structured server logs | dependency |
| `pino-pretty` | Human-readable local logs | dev dependency |
| `@opentelemetry/api` | Stable tracing/metrics instrumentation boundary | dependency |

These observability packages can be introduced with the operational-hardening phase if the
deployment platform already supplies equivalent telemetry.

## Test tooling to select before write migration

The repository currently has no test runner. Select one standard before adding service/repository
tests, for example:

- `vitest` for unit and integration tests.
- `@vitest/coverage-v8` if coverage is required.
- `playwright` for route and browser smoke tests.

Do not add all test tools solely for the audit; choose them as part of the implementation task.

## Deliberately not required now

- Auth SDKs: authentication is explicitly out of scope.
- Payment, commerce, seller, ticketing, or external API SDKs.
- Python/FastAPI client libraries.
- ML/embedding/vector database packages.
- A second database client: application persistence should not mix Prisma and Supabase JS.

## Manifest change policy

Add dependencies only in the implementation phase that uses them, update the lockfile in the same
change, and run the smallest applicable typecheck/build/test command after installation.

