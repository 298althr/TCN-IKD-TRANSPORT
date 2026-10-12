# ARCHITECTURE

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Backend/Systems Engineer with Database/Data Architect
**Governed by:** D-024 (provisional stack), D-014 (UIOS vocabulary only), D-023 (no payment instruments)

## What this folder is for

How the system is split into parts, where each part runs, which part owns which truth, and why. It answers "where does this rule live?" before anyone writes code.

## Files

| File | Contents |
|---|---|
| `SYSTEM-ARCHITECTURE.md` | Context diagram, containers, domains, data flows, invariants, non-goals |
| `ADR/README.md` | Index of architecture decision records |
| `ADR/ADR-0001-stack.md` | Why TypeScript, Next.js, Vercel and Supabase (provisional) |
| `ADR/ADR-0002-write-path.md` | How state changes reach the database and why |
| `ADR/ADR-0003-payments-provider-hosted.md` | Why payment is provider-hosted only |

## Reading order

1. `SYSTEM-ARCHITECTURE.md`
2. ADR-0001, then ADR-0002, then ADR-0003
3. `../DATA-MODEL/ENTITIES.md`, `../STATE-MACHINES/STATE-MACHINES.md`

## Open issues

OI-029 (webhook host and write path), OI-030 (hosting cost vs terms), OI-032 (region), OI-033 (provider contracts).
