# Test Strategy

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** QA/Test Engineer
**Decisions:** D-019, D-020, D-024 · **Open issues:** OI-001, OI-033, OI-035, OI-040

---

## 1. Layers

| Layer | Scope | Tool (proposed) | Runs |
|---|---|---|---|
| Unit | Pure domain rules: money, labels, validators, state name mapping | Vitest | Every change |
| SQL and state | State machine legality, RLS per role, capacity under lock, idempotency, audit presence, append-only enforcement | pgTAP on local Supabase | Every change |
| Contract | Edge Functions with recorded provider payloads (secrets removed), signature checks | Vitest + fixtures | Every change |
| Integration | Frontend calling real functions on the local stack | Playwright (API mode) | Every change |
| End to end | Journeys A to H on mobile and desktop viewports | Playwright | Every merge to main and before release |
| Concurrency and load | Seat holds at 2x capacity; manifest updates under many taps | k6 | Nightly and before pilot |
| Accessibility | Axe on every route; keyboard path on admin | axe-core via Playwright | Every change to UI |
| Sandbox payment | Real provider sandbox, payment checklist | Manual with recorded results | Before each payment release |
| Restore | Backup restored and counted | Manual script | Quarterly and before pilot |
| User acceptance | Real marshals and admins on staging with synthetic data | Scripted sessions | Pilot gate |

OI-035 asked whether pytest should remain. Recommendation: TypeScript-native tooling, with k6 kept for load testing because it is language-neutral.

---

## 2. Edge-case register (PRD §6) converted to tests

| PRD item | Edge case | Test | Layer |
|---|---|---|---|
| 1 | Two members book the last seat simultaneously | Concurrent hold requests at capacity 1, 10 and 50; exactly capacity succeed | k6, pgTAP |
| 2 | Payment succeeds after member cancelled | Webhook for a cancelled booking goes to `reconciliation_required`; no seat taken | pgTAP, contract |
| 3 | Marshal and member cancellation converge | Same function for both roles; identical ledger and manifest effect | pgTAP |
| 4 | Same person registers twice with different phone | Matching creates a review item, does not merge (AUTH §4) | pgTAP, E2E |
| 5 | Paid programme without refund rule | Creation blocked or default applied with a recorded override | pgTAP |
| 6 | No-show versus cancelled | Terminal `no_show` separate from `removed`; reporting counts both | pgTAP, E2E |
| 7 | Marshal reassigned mid-programme | Notifications re-scoped to new marshal; old marshal loses access | E2E, pgTAP |

Additional cases from the state machines:

| Case | Test |
|---|---|
| Duplicate webhook event | Second apply is a no-op |
| Webhook with bad signature | 401, no state change |
| Expiry job run twice concurrently | Each held booking expired once |
| Return URL with no payment | Stays pending |
| Client sends lower amount | Server amount used |
| Illegal transition (for example boarded to awaiting) | Rejected with `ILLEGAL_TRANSITION` |
| Member reads another member's booking | Denied by RLS |
| Marshal reads another bus's manifest | Denied |
| Internal support note shown to reporter | Not shown |
| Outbox row missing for confirmed booking | Test fails the build |
| Offline manifest shows last synced banner | E2E with network off |
| Guest invite redeemed twice | Second denied when uses exhausted |

---

## 3. Release gate (D-019)

A release is blocked if any of these is true:

- A test in the state, RLS, or payment suites fails.
- A new `NEXT_PUBLIC_` variable holds a secret (scan).
- Accessibility check reports a serious violation on a changed route.
- A migration has not been applied to staging.
- A money-affecting change has no recorded sandbox run.
- An S1 defect is open.

QA signs the release record. The sponsor is informed of pilot-level releases.

---

## 4. Concurrency target

- Capacity 50 on one bus-leg, 200 simultaneous hold requests: exactly 50 succeed, 150 receive `SEATS_UNAVAILABLE`, ledger sums to 50, no negative availability.
- Repeat with expiry running concurrently: no seat lost or double-released.
- Target latency for a hold request at p95: set after measurement from Lagos test connections (OI-032).

---

## 5. Test data

- Synthetic members, guests and phone numbers in a reserved range.
- Seed script creates programmes, buses, marshals and bookings in every state.
- No production export is used, ever.

---

## 6. User acceptance (pilot gate)

| Session | Participants | Scenario | Pass criteria |
|---|---|---|---|
| UAT-1 | Admin | Create special event, publish, open, cancel; approve registration; triage report | All steps completed without developer help; audit entries visible |
| UAT-2 | Marshal | Full duty: board, no-show, walk-on, incident, contact admin, summary | Manifest matches the paper list; no double boarding; contact works on phone |
| UAT-3 | Member | Sign up, wait for approval, book, pay (sandbox), cancel, report | Member understands each state without help; payment is on provider page |
| UAT-4 | Marshal and admin | Offline manifest export on duty | Printout matches last synced data with timestamp |

Participants and dates are part of OI-040.

---

## 7. Reporting

Test results are stored in CI with links from the release record. Failures carry the state machine or test ID so they map back to `STATE-MACHINES/` and the PRD edge case.
