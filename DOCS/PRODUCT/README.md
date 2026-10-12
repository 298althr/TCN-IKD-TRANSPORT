# PRODUCT

**Status:** Draft v0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager

## What this folder is for

What the product does, for whom, and in what order it gets built. This is the bridge between the BRD (business baseline) and the engineering folders (`DATA-MODEL/`, `STATE-MACHINES/`, `API-CONTRACTS/`). If a feature is not classified here, it is not in the build.

## Files

| File | Contents |
|---|---|
| `SCOPE-AND-JOURNEYS.md` | Scope tiers (CORE / MVP / PHASE 2 / FUTURE / OUT OF SCOPE), user journeys A to H, the three dashboards |
| `PROGRAMMES-LEGS-GUESTS.md` | Programme types (recurring and special events), trip legs, capacity, guests, overflow |
| `SCENARIOS-AND-EDGE-CASES.md` | 125 scenarios across single trips, round trips, groups, waiting list, payments, cancellations, bus operations, registration and technical cases. Each marked Decided, Designed, POLICY or DECISION |

## Governed by

D-001 (route with several buses), D-005 (admin-triggered marshal reassignment), D-008 (no-show is a state), D-009 (push and email, forced install), D-010 ($0 posture), D-011 (soft timeline), D-013 (per-bus booking toggle), D-023 (no payment instruments stored). Constraints PAY-1 (Sunday free, special events paid), AUTH-1 (membership gate).

## Open issues that shape this folder

OI-018 (group partial refunds), OI-019 (bus cancellation), OI-021 (waitlist scope), OI-022 (cancellation cutoff), OI-024 (special-event governance), OI-028 (registration-path governance), OI-036 (refund policy).

## Source documents

`PRD_TCN_Ikorodu_Transport_App.md`, `DECISION-LOGS/MEETING-MINUTES-02-Systems-Scope.md`, `MEETING-NOTES-03-Dev-Transport-Session.html`, `RISK-ASSESSMENT.md`.
