# ADR-0001: Stack (TypeScript, Next.js on Vercel, Supabase)

**Status:** Proposed (sponsor direction 2026-10-12; ratification at OI-001 reconvene) · **Date:** 2026-10-12
**Decisions:** D-024 (proposed), D-002 (blocked), D-010 ($0 posture), D-012 (respondents decide) · **Open issues:** OI-001, OI-030, OI-032

## Context

Two Phase 1 respondents disagreed on the stack (D-002). The sponsor now prefers TypeScript with Supabase and Vercel. The PRD (§7) recommends the same combination. Constraints: a small team, a single congregation, low traffic bursts on Sundays and special events, a travel-day reliability requirement, and a soft budget that must be reconciled with vendor terms.

## Decision (proposed)

- **Language:** TypeScript for the web app, server functions and database-adjacent code. SQL for schema, functions and policies.
- **Frontend:** Next.js App Router on **Vercel Pro**. Installable PWA (manifest, service worker). Server components for lists, client components for interactive flows.
- **Backend of record:** **Supabase** (Postgres, Auth, Realtime, Storage (unused at MVP), Edge Functions, pg_cron).
- **Shared rules:** domain types in a TypeScript package imported by both the web app and Edge Functions. Business rules live in Postgres functions so they cannot be bypassed by any client.

## Alternatives

| Option | Why not chosen (or why kept as fallback) |
|---|---|
| FastAPI + React + Postgres (D-002 respondent B) | Credible, and matches a Python-leaning respondent. Splits the codebase and adds hosting work. Kept as fallback if the reconvene prefers Python; ADR-0002 would then move functions into the API. |
| Next.js frontend + FastAPI (D-002 option C) | Two languages for a small team. Highest handoff cost. Not recommended. |
| Firebase | Weak fit for relational capacity and audit. Rejected in the PRD. |
| Self-managed Postgres on a VPS | Full ops burden, and backups become our job (RISK-001). Rejected for MVP. |

## Consequences

- **Authorization sits in the database.** Row-level security and function-level role checks are the enforcement point. The UI is not trusted.
- **Vendor terms are a design input.** Vercel Hobby cannot be used for payment processing (commercial-use clause, checked 2026-10-12). Production frontend needs Pro (OI-030).
- **Supabase Free carries production risk.** Projects pause after a week of low activity and free projects have no automatic backups. Production uses Supabase Free by sponsor decision (D-027; RISK-009, RISK-010). Revisit at the pilot gate, where Pro is the recommended option.
- **Region.** Supabase's region list at check time had no South African region. Choose the lowest-latency available region after measuring (OI-032). Vercel functions can run in `cpt1`.
- **Edge Functions run on Deno.** Shared TypeScript types are fine; Node-only libraries are not.
- **Two pinned runtime environments.** Local development uses the Supabase CLI and Docker for a local Postgres. Keep migrations in version control and never edit production schema by hand.

## Verification

Ratification requires: (1) respondents confirm or reject at the OI-001 reconvene; (2) a spike shows a booking round-trip from Lagos test connections within an agreed latency target (OPTIMISATION §3); (3) the Supabase local stack runs the pgTAP suite in CI.
