# API-CONTRACTS

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Backend/Systems Engineer
**Governed by:** ADR-0002, D-003, D-004, D-005, D-023 · **Open issues:** OI-029, OI-033

## What this folder is for

The callable surface the frontend and the provider integrations depend on: database functions called through the Supabase client, Edge Function endpoints, provider webhooks, and the error and idempotency conventions. A contract here must be stable before the UI is wired to it.

## Files

| File | Contents |
|---|---|
| `CONTRACTS.md` | Function signatures, Edge Function endpoints, webhook contracts, error codes, idempotency rules |

## Rules

- Every mutating function takes an idempotency key (ADR-0002 §5).
- Every function returns a result object or a named error code. Clients never parse messages.
- Breaking changes create a new function name with a version suffix. Old names are removed only after the release that stops calling them.

## Open issues

OI-029 (where webhooks run), OI-033 (provider contracts verified in sandbox).
