# BACKEND

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Backend/Systems Engineer
**Governed by:** ADR-0001, ADR-0002, D-003, D-004, D-005, D-025 · **Open issues:** OI-001 (blocking), OI-029, OI-032

## What this folder is for

How the backend is built on Supabase: the database functions that hold business rules, the Edge Functions for provider and scheduled work, the outbox, error handling, environments and local development. Nothing here is built until OI-001 ratifies the stack.

## Files

| File | Contents |
|---|---|
| `BACKEND-DESIGN.md` | Service layout, seat-hold algorithm (draft SQL), expiry, outbox, retries, observability, migrations, seed data |

## Governing rules

- Business rules live in Postgres functions. Edge Functions call the same functions. No rule exists only in the frontend.
- Each transition is one transaction: state, transition row, audit row, outbox row.
- No client holds the service role key.

## Open issues

OI-001 (ratify stack and D-003 hold mechanism), OI-029 (webhook host), OI-032 (region for latency measurement).
