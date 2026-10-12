# Optimisation Plan

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Frontend and Backend leads
**Decisions:** D-010, D-022, D-024 · **Open issues:** OI-030, OI-032, OI-006

---

## 1. What matters most

In order:

1. **Correct seats and manifests** under concurrent use (correctness beats speed).
2. **Usable on a phone with poor signal** at the bus park on a Sunday at 6 am.
3. **Stays within the budget** the sponsor approves (OI-030).
4. **Fast enough** that people do not abandon a booking.

Speed targets serve 2 to 4. Correctness has no performance trade-off.

---

## 2. Performance budgets (proposed; verify on a mid-range Android on a throttled 4G profile)

| Screen | Metric | Target |
|---|---|---|
| Home and programme list | Largest content paint | Under 2.5 s |
| Booking step (any) | Interaction to next state | Under 300 ms on server response, excluding network |
| Hold seats (RPC) | p95 round trip from Lagos test connection | Under 800 ms (to confirm after OI-032 measurement) |
| Marshal manifest | Board tap to visible change | Under 300 ms optimistic; confirmed within 2 s |
| First load of app shell | JavaScript transferred (compressed) | Under 200 KB for member route |
| Images | Per page | Under 150 KB total, served sized for device |

Budgets are checked in CI for the member booking route with a bundle size report, and in a monthly manual run on a real device.

---

## 3. Latency plan (OI-032)

- Measure round trips from Lagos test connections to each candidate Supabase region before choosing.
- Put the Vercel server layer in `cpt1` (Cape Town) only if measurements show a benefit from the server layer to the database. Otherwise keep server and database close.
- Keep booking to one or two round trips: one for hold, one for payment start. No chatty waterfalls.

---

## 4. Cost controls

| Driver | Control |
|---|---|
| Egress from database | Views return only needed columns; no full table exports in the UI |
| Realtime connections | One channel per open assignment screen; closed on navigation |
| Image transfer | Compressed assets; responsive sizes; no photo uploads at MVP |
| Function invocations | Batch outbox dispatch per minute, not per message |
| Preview deployments | Deleted on merge |
| Staging size | Reset monthly |
| Analytics | Only aggregated counts; no per-tap tracking |

Monthly cost review against the figures in `DEVOPS/DEVOPS-PLAN.md` §2.

---

## 5. Caching and offline

| Data | Strategy | Reason |
|---|---|---|
| App shell, icons, fonts | Cache first, versioned | Fast repeat load |
| Programme list | Network first, cache fallback with timestamp | Changes often |
| Manifest (marshal) | Network first; offline shows last synced data with banner | Stale data is the failure mode |
| Booking and payment | Never cached | Money and seats |
| Sign-in | Never cached | Security |

Service worker updates are announced to the user ("update ready") and applied on next open, never mid-duty.

---

## 6. Database performance

- Index every foreign key used in RLS policies and in view joins. Verify with query plans on seeded volumes.
- Keep `seat_ledger` queries bounded by `assignment_id` and `leg` (indexed).
- Use `for update skip locked` for background batches.
- Partition or archive `audit_events` and `payment_events` only when a size trigger is reached (section 8). Not before.
- Avoid `select *` in views and functions.

---

## 7. Observability for optimisation

- Measure, do not guess: Web Vitals from real sessions (aggregated, no personal data), function durations, RPC error rates by code.
- Dashboards show counts by code (for example `SEATS_UNAVAILABLE` per programme), not individual people.
- Goodhart caution: a fast booking flow that skips the confirmation check is not an improvement. Every speed change is reviewed against the correctness suite.

---

## 8. Scale triggers (from the constitution)

The product does not scale in advance. Work starts when a trigger is observed:

| Trigger | Action |
|---|---|
| Database size above 80 percent of plan | Plan upgrade or archive policy (decision required) |
| Sustained seat-hold p95 above target for a week | Investigate indexes and locks before any new component |
| Dead-letter outbox rows growing | Provider or template investigation |
| More than one church or product requested | OI-008 reopen (multi-tenant design) |
| Quota abuse observed | Rate-limit tuning (RATE-2), Phase 2 |
| Forecasting requested | Only after six months of complete data (D-022) |

---

## 9. Analytics and forecasting

Operational utilisation dashboards come first (D-022). No machine learning, no forecasting, no knowledge graph. Revisit after six months of complete booking and attendance data.
