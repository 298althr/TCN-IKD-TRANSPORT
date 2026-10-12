# Development Strategy: Freeze, PRD, Frontend First, Then Backend

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Decisions:** D-024 (proposed, ratified at reconvene), D-027, D-045 (sign-off gate and freeze), D-046 (frontend first on frozen contracts), D-047 (criteria are release criteria)
**Related:** `SIGN-OFF/TRANSPORT-SIGN-OFF-PACK.html`, `TESTING/ACCEPTANCE-CRITERIA.md`, `ROADMAP/IMPLEMENTATION-ROADMAP.md`

---

## 1. The sequence in one view

```
Transport sign-off ──┐
                     ├─► G0 Gate ─► Freeze docs v1.0 ─► PRD v1.0 ─► Roadmap baseline
Technical reconvene ─┘                                     │
                                                           ▼
                F0 contracts + stand-in data ─► F1 member ─► F2 marshal ─► F3 admin ─► F4 guest
                                                           │
                                                           ▼
                B0 schema + RLS + functions ─► B1 holds and waiting list ─► B2 payments
                                                ─► B3 notifications ─► B4 admin functions and audit
                                                           │
                                                           ▼
                I0 integration (stand-in removed) ─► UAT ─► Pilot ─► Launch review
```

---

## 2. Gate G0: what must be true before anything is built

Both halves are needed. The transport half is the sign-off pack. The technical half is the reconvene.

| Condition | Owner | Evidence |
|---|---|---|
| Transport team has signed the pack (page 11) | Department lead; sponsor approves | Signed pages filed; decision log entry (D-045) |
| Ten rules confirmed and policy owners named | Department | Pack pages 03, 06, 07 |
| Technical reconvene: stack ratified (D-024), seat hold decided (D-003), membership gate decided (D-007) | Respondents | Decision log entries Accepted |
| Pilot programme chosen (Q-027) | Sponsor with department | Decision log entry |
| Hosting tier accepted for pilot (D-027) | Sponsor | Already recorded; pilot-gate review noted |

**Important.** The transport sign-off alone does not start the backend. The frontend can start on the stand-in data once the frontend framework is ratified, because the screens do not need the database to exist.

---

## 3. Freeze: what "frozen" means

Freezing means the documents are the agreed specification for version 1.0. Changes after the freeze are controlled.

**Frozen set (version 1.0):**

| Area | Files |
|---|---|
| Product | `PRODUCT/SCOPE-AND-JOURNEYS.md`, `PRODUCT/PROGRAMMES-LEGS-GUESTS.md`, `PRODUCT/SCENARIOS-AND-EDGE-CASES.md` |
| Rules | `STATE-MACHINES/STATE-MACHINES.md`, `DATA-MODEL/ENTITIES.md`, `API-CONTRACTS/CONTRACTS.md` |
| Domains | `AUTH/AUTH-DESIGN.md`, `PAYMENTS/PAYMENTS-DESIGN.md`, `NOTIFICATIONS/NOTIFICATIONS-DESIGN.md`, `SUPPORT/SUPPORT-SYSTEM.md` |
| Frontend | `FRONTEND/FRONTEND-DESIGN.md` |
| Tests | `TESTING/ACCEPTANCE-CRITERIA.md` |
| Governance | `GOVERNANCE/DEPARTMENT-POLICY-REGISTER.md` (policy statuses at sign-off), `SIGN-OFF/` pack as signed |

**Not frozen (still moving):** the decision log and QA log (they grow by design), the recommendations folder, the prototypes, the mail mirror, and the technical choices still awaiting the reconvene.

**How it is marked.** Each frozen file's status line changes to `Frozen v1.0 · date · decision D-045`. The repository is under git (D-049). The freeze is the annotated tag `docs-v1.0` on `main`. The rules are in `VERSION-CONTROL/VERSION-CONTROL.md`.

**Change control after the freeze.**

| Change type | Route |
|---|---|
| Typo, broken link, clarified wording with no behaviour change | Edit; note in the file's change line |
| Behaviour change, new rule, new state, new field | Change request → decision entry (D-xxx) → sign-off by the owner and the PM → version 1.1 |
| Policy outcome that changes a rule | Department signs the policy; PM records the decision and updates the affected criteria |
| New scenario found in development | Added to the scenario table as a new row, with status; no code change without a decision |

---

## 4. PRD version 1.0

The current root draft (`PRD_TCN_Ikorodu_Transport_App.md`) predates the decisions and the sign-off. It is not updated in place.

**Steps:**
1. Create `DOCS/PRD/PRD-v1.0.md` from the frozen set. The PRD summarises; it does not repeat the rules. Each section links to the frozen file that holds the detail.
2. The PRD carries the scope tiers, journeys, rules that the transport team signed, the policy list with statuses, the acceptance criteria summary, the roadmap summary, and the open-issue register links.
3. Mark the root draft **Superseded by PRD-v1.0** with a link.
4. The PRD is signed by the sponsor (approval) and the PM (record). It is the document the sponsor reads; the frozen set is the document engineers build from.

**PRD sections (outline):** 1 product statement and scope · 2 users and journeys · 3 rules (signed) · 4 scenarios summary · 5 policies and statuses · 6 architecture summary · 7 acceptance criteria summary · 8 roadmap and gates · 9 risks · 10 open items with owners.

---

## 5. Roadmap baseline

`ROADMAP/IMPLEMENTATION-ROADMAP.md` becomes baseline v1.0 at the freeze:

- Stages and gates are fixed. Exit criteria reference the acceptance IDs.
- Owners are named by role. Dates are left blank until the sponsor sets resourcing.
- Any stage that changes after baselining is recorded as a roadmap change in the decision log.

---

## 6. Frontend first

### 6.1 Why frontend first

- The transport team can test the screens they will use (member booking, marshal boarding, administrator approvals) early, which is when their corrections are cheapest.
- The travel-day screens are where the risk is. Testing them against a stand-in data layer finds misunderstandings before any database rule is locked in.
- The acceptance criteria are written at the screen level, so the frontend can run them directly.

### 6.2 The condition that makes it safe

Frontend first is safe only if the rules are not written in the frontend. Otherwise the backend will be built to match the screens, not the rules.

- **Contract first.** `API-CONTRACTS/CONTRACTS.md` is frozen before any screen is built. The frontend uses a typed client generated from the contract.
- **Stand-in data layer.** A mock that implements the same contract. It is generated from the contract, not hand-written per screen.
- **State rules tested once.** The transition table from `STATE-MACHINES` is turned into a test suite that runs against the stand-in. The same suite later runs against the database functions. A rule that passes on one and fails on the other is a defect in whichever one differs.
- **No rule in the UI.** A screen may display a state and call a function. It may not decide whether a seat is free, a refund is due, or a no-show is allowed. A review checklist enforces this.
- **Stand-in is retired.** At integration, the stand-in is removed, not extended.

### 6.3 Frontend stages

| Stage | Scope | Exit (from acceptance criteria) |
|---|---|---|
| F0 | Contract freeze, typed client, stand-in data layer, state-rule test suite, role-based navigation shell, design tokens (one orange system for the apps, D-031) | Every contract has a stand-in; state-rule suite runs green on the stand-in |
| F1 | Member journeys: sign-in by phone code, registration status, booking (single, return-only, round trip, group), payment handoff and return page, my bookings, cancel, waiting list, report a problem, contact links | All MEM criteria at level P pass on the stand-in |
| F2 | Marshal duty: sign-in, assigned bus, outbound and return lists, board, no-show after the lock, walk-on, offline queue and printed manifest, incident, contact admin, duty summary | All MAR criteria at level P pass on the stand-in; offline behaviour tested with network off |
| F3 | Administrator: approvals with 12-hour reminder, programmes and special events with second approval, buses and waiting list, marshals, refunds, reconciliation, support queue, corrections, audit view | All ADM criteria at level P pass on the stand-in |
| F4 | Guest: invite link, public registration, status screens, host's guest list | All GST criteria at level P pass on the stand-in |
| F5 | Accessibility and performance pass: screen reader, keyboard, touch targets, budgets from OPTIMISATION §2 | Automated accessibility checks clean; budgets met on a mid-range device profile |

**Order inside frontend.** Member booking and marshal boarding come first because they carry the travel-day risk. Administrator screens depend on the data those flows create, so they follow. Guest screens reuse the member flow and come last.

### 6.4 Frontend definition of done (per screen)

- Every criterion that names the screen passes on the stand-in data.
- No business rule is computed in the UI (review checklist).
- Labels follow the member-facing vocabulary (no internal state names).
- Works at 390 by 844 pixels and on desktop.
- Accessibility checks clean for the route.

---

## 7. Backend after the frontend

### 7.1 Backend stages

| Stage | Scope | Exit |
|---|---|---|
| B0 | Schema in the `transport` namespace; row-level security per role; state functions; audit and transition tables; migrations and pgTAP tests | SYS-08 to SYS-14 pass; RLS tests for MEM, GST, MAR, ADM roles pass |
| B1 | Seat holds under lock; hold expiry; waiting list and offers; bus open and closed; manifest lock enforced on the server | SYS-01, SYS-02, SYS-12, SYS-13; MEM-20 to MEM-24 and ADM-07, ADM-09 pass on the real backend |
| B2 | Payments: provider-hosted orders; signed webhooks; duplicate handling; reconciliation; refund requests; sandbox checklist | SYS-03 to SYS-07; MEM-12 to MEM-16 pass; OI-033 sandbox checklist signed |
| B3 | Notifications: outbox; push; email; SMS for marshal alerts and sign-in codes (D-028); route-scoped marshal alerts; dead letters | SYS-11, SYS-15; MEM-21, MEM-32; MAR alerts pass |
| B4 | Administrator functions and audit: approvals, special events with second approval, corrections, support routing, finance views | ADM criteria at level P pass on the real backend |
| B5 | Backups, restore drill, runbooks, paused-project procedure | SYS-16, SYS-17 |

### 7.2 How the backend meets the frontend

- The backend implements the frozen contract. A change to the contract is a change request, not a backend shortcut.
- The frontend's end-to-end suite runs unchanged against the real backend. A failure is a defect in the backend, or a contract gap that goes through change control.
- Each backend stage is considered done only when the criteria listed for it pass on the real backend, not when the code is written.

---

## 8. Integration, user acceptance, pilot

| Step | What happens | Gate |
|---|---|---|
| I0 Integration | Stand-in removed; the full end-to-end suite runs on staging with made-up data | All P criteria for the release roles pass |
| UAT | Your marshals and administrators run the scripted sessions in `TESTING/TEST-STRATEGY.md` §6 | Pass criteria in the test strategy |
| Pilot | One programme (Q-027), with the printed list and the WhatsApp fallback running alongside | Pilot exit criteria in the roadmap |
| Launch review | 30-day review of support, reconciliation, notifications and cost | Decision to continue, change or stop |

---

## 9. Risks of this sequence and how they are managed

| Risk | Mitigation |
|---|---|
| Screens drift from the real rules | Contract first; rules tested once on both sides; no rule in the UI; review checklist |
| The stand-in behaves differently from the database | The same state-rule suite and the same criteria run on both; differences are defects |
| Frontend work is wasted if the stack changes | The framework is ratified before F0; the design tokens and components are kept portable |
| Backend is squeezed after the frontend is "done" | Backend stages have their own exit criteria and are scheduled from the baseline, not from the frontend's finish |
| Freeze becomes a bottleneck | Change control has a fast route for wording changes; behaviour changes go through a short decision |
| Scope creep during build | New scenarios become rows with a status; nothing is built without a decision |

**Decisions this strategy needs from you:**

1. ~~Version control~~ Answered: the repository is now under git (D-049). The remote is set when the sponsor chooses a host.
2. Who signs the PRD for the sponsor, and by when?
3. Is one person accountable for each stage, or is each stage run by the lead of its area?

---

## 10. Working rules

- One branch per stage or feature; each change reviewed by a second person; the QA release gate (D-019) applies at each stage exit.
- Every deviation from the frozen set is recorded in the decision log before it is merged.
- Acceptance criteria are the test of done; a criterion failing on the real backend reopens the stage it belongs to.
- No timeline estimates are set in this document. Dates follow resourcing (PRD §8.3).
