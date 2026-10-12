# ADR-0002: Write Path

**Status:** Proposed · **Date:** 2026-10-12
**Decisions:** D-003, D-004, D-005, D-006, D-025 · **Open issues:** OI-029, OI-020, OI-017

## Context

Every state change (booking, payment, manifest, registration, support) must be safe under concurrency, attributable, and reversible without data loss. Clients (phones) are unreliable and must not decide authority. Provider webhooks arrive with no user session and may be duplicated or late.

## Decision

1. **Clients never write state tables directly.** Row-level security grants `select` only, filtered by role and route.
2. **Business transitions are Postgres functions** (`SECURITY DEFINER`, `search_path` pinned, `EXECUTE` revoked from `public` and granted to `authenticated` only). Each function:
   - checks `auth.uid()` and the caller's role;
   - locks the rows it changes (`SELECT ... FOR UPDATE` on the bus-leg row for seat changes);
   - validates the transition against the state machine table;
   - writes the new state, the transition row, the audit event and any outbox row in one transaction.
3. **Provider webhooks and scheduled jobs are Supabase Edge Functions.** They verify provider signatures, deduplicate on provider event ID, then call the same database functions as the UI, using a server role. Provider secrets live only in function secrets.
4. **Next.js route handlers are not used for webhooks.** They may serve pages and read data through RLS.
5. **Idempotency.** Every mutating call carries an idempotency key stored in `idempotency_keys` (unique on caller and key). A retry returns the first result.

## Why not the alternatives

- *Application-level check then write* (read seats, then insert): overbooks under concurrent taps. PRD §6 item 1 forbids it.
- *Next.js route handlers for webhooks*: Vercel Hobby cron and function timing are weaker for scheduled work, and it would put provider secrets in the web runtime. Route handlers are still allowed for page rendering.
- *Message broker*: unnecessary at this scale. The outbox table gives ordering and retry with no new service.

## Consequences

- Business logic is in SQL, which needs pgTAP tests and migration discipline (`DEVOPS/`).
- Any new feature must add or reuse a function. There is no quick "update the column" path, which is intentional.
- Edge Functions are a second runtime. Shared domain types are kept in a package that compiles for both.

## Open

OI-029 asks the reconvene to confirm this. If the reconvene picks a FastAPI backend (ADR-0001 fallback), functions move into the API layer but the rules above stay the same: no client writes, one transaction per transition, outbox for messages.
