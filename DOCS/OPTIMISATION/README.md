# OPTIMISATION

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Frontend and Backend leads, with DevOps for cost
**Governed by:** D-010 (cost posture), D-022 (analytics timing), constitution scaling triggers · **Open issues:** OI-030, OI-032, OI-006 (rate limits, clarification pending)

## What this folder is for

What "fast enough" and "cheap enough" mean for this product, how they are measured, and when we optimise. It stops two failure modes: premature optimisation that adds machinery, and unmeasured slowness that fails on a Sunday.

## Files

| File | Contents |
|---|---|
| `OPTIMISATION-PLAN.md` | Performance budgets, caching, database performance, cost controls, observability, scale triggers |

## Governing rules

- Measure before optimising. Every target has a measurement method.
- Optimisation must not add a service, a cache layer, or a queue without a decision entry.
- Targets for this product are about travel-day reliability, not vanity metrics.

## Open issues

OI-032 (region latency), OI-030 (cost tier), OI-006 (rate limits, pending sponsor clarification).
