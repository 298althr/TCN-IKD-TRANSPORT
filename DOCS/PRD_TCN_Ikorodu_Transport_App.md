# PRD: TCN Ikorodu Transport Booking & Management App
**Converted from BRD v1.0 via PCS (Problem Capture & Value Qualification System) + systems/business/full-stack/devops synthesis**
**Status:** Draft for stakeholder decision | **Prepared for handoff**

---

## 0. Framework Note

This PRD applies PCS in full: problem capture before solutioning, staged handoff structure. A second framework ("APSOS v2") was referenced but isn't available in memory or upload — the problem-to-solution mapping and decision-tree work below is done through direct systems/business/engineering reasoning in its place. If APSOS has a specific structure you want applied, send it and this doc gets revised against it.

---

## 1. Executive Summary (Handoff)

TCN Ikorodu currently runs transport logistics manually — phone calls, informal headcounts, no persistent record of who's riding which bus. This breaks down predictably: buses are planned blind, no-shows aren't tracked, payment status and attendance aren't connected, and there's no historical data to plan future capacity from.

The proposed system is a three-sided booking platform (Member, Marshal, Administrator) built around one lifecycle: **Booked → Marshal Contacted → Confirmed → Boarded/Attended**, with capacity, payment, and notification systems wired directly into that lifecycle rather than bolted on afterward.

**Scale reality check:** this is a single-congregation transport tool, not a multi-tenant SaaS product. Every technical and budget recommendation below is sized for that — lean stack, minimal ops overhead, fast to build and cheap to run, not enterprise infrastructure the church doesn't need.

**What's ready to build immediately:** registration, login, programme management, route/booking flow, marshal dashboard, admin dashboard, reporting — all fully specified in the BRD.

**What needs a decision before build starts:** payment processor, notification channel (push vs. SMS vs. both), hosting/stack choice, and the missing Journey C (see Section 3). Each is scoped as a multiple-choice decision in Section 7.

---

## 2. Problem Capture (PCS Phase 1)

| Problem | Who feels it | Current workaround | Cost of inaction |
|---|---|---|---|
| No passenger count ahead of programme day | Admin, Marshal | Guesswork, phone calls | Buses under/over-provisioned |
| No route-level visibility | Admin | Manual spreadsheets, if any | Can't plan multiple pickup points reliably |
| No attendance confirmation step | Marshal | Informal check at pickup | No-shows discovered too late to reallocate seats |
| No record of paid vs. unpaid transport | Admin | Manual reconciliation | Revenue leakage, disputes |
| No history across programmes | Admin | None | Can't forecast demand, no basis for route optimization |
| No distinction between "booked" and "actually coming" | Marshal | None — this is the single biggest operational gap in the current process | Buses sent to wrong capacity |

**Value qualification:** the highest-leverage fix is the Booked → Confirmed distinction (BRD requirement #11) — everything else (capacity tracking, reports, notifications) is downstream of getting that one state transition right. Build priority should follow this, not the document's section order.

---

## 3. Journey Gap — Journey C

**The BRD's journey maps go A (First-Time Member) → B (Returning Member) → D (Marshal) → E (Administrator). C is missing.**

### Reasoning

Two candidate explanations were evaluated:

**Candidate 1 — Journey C = Member-Initiated Cancellation.** Section 16 (Cancellation) is a fully specified requirement with its own refund-policy logic, and requirement #12 confirms cancellation is a first-class state transition with automatic seat-capacity updates. Yet no journey map shows a member walking through cancelling an already-confirmed booking — A and B only show a payment-failure retry/cancel branch, which is a different thing entirely (cancelling before a booking ever completes, not cancelling a live booking). A fully-specified feature with no journey map is the clearest kind of documentation gap.

**Candidate 2 — Journey C = Non-Sunday Programme Booking.** The Business Problem section explicitly flags "manage transportation for programmes outside Sunday services" as a distinct pain point, and requirement #6 singles out Sunday-specific booking-window rules, implying non-Sunday programmes behave differently. But on inspection, nothing in Sections 5–11 actually describes a *different flow* for non-Sunday programmes — only a different booking-window value. This is a configuration difference, not a distinct journey.

**Confidence: ~75% Candidate 1, ~20% Candidate 2, ~5% something not yet identified.**

Candidate 1 wins because it's a fully-built feature with no corresponding map — the letter gap most plausibly marks a removed or never-drafted journey, and cancellation is the one requirement in the whole BRD that's detailed enough to need one but has none. Proceeding with Candidate 1 as the built solution; flag Candidate 2 to the actual stakeholder if the sequencing was intentional for a different reason.

### Journey C — Member Cancellation (recommended, built below)

```
START
  ↓
Member Login
  ↓
View My Bookings
  ↓
Select Booking to Cancel
  ↓
Is Booking Within Cancellation Window?
   ↙                        ↘
 YES                         NO
  ↓                           ↓
Proceed to Cancel      Cancellation Not Permitted Online
  ↓                           ↓
Was Booking Paid?        Member Directed to Contact Marshal
   ↙          ↘
 NO            YES
  ↓             ↓
Cancel      Apply Church Refund Policy
Booking         ↓
  ↓      Refund Automated or Manual?
  ↓          ↙            ↘
  ↓       AUTO            MANUAL
  ↓         ↓                ↓
  ↓    Process Refund   Flag for Admin/Finance Review
  ↓         ↓                ↓
  └────→ Update Booking Status to Cancelled
              ↓
      Seat Capacity Increased Automatically
              ↓
      Marshal Notified of Cancellation
              ↓
      Member Receives Cancellation Confirmation
              ↓
             END
```

---

## 4. Product Requirements

### 4.1 User Roles
Unchanged from BRD Section 4 — Member/Passenger, Transport Marshal, Transport Administrator. No additional role identified as necessary at this scale; a combined "Finance/Reports" sub-role could split off Administrator later if reporting volume grows, not needed at launch.

### 4.2 Core Functional Requirements
Mapped directly from BRD Sections 5–18, restructured by build priority (systems-engineering lens — build the state machine first, surfaces second):

1. **Booking lifecycle state machine** — Booked → Marshal Contacted → Confirmed → Boarded/Attended → (Cancelled at any pre-boarding state). This is the architectural core; every dashboard is a view onto this state, not a separate system.
2. **Capacity engine** — real-time seat tracking per route/bus, atomic decrement/increment on booking/cancellation, hard stop at zero (no overbooking, waitlist explicitly deferred per BRD).
3. **Payment integration** — status-tracked (Pending/Successful/Failed/Cancelled/Refunded), booking not marked Confirmed until payment Successful unless Transport Dept. overrides.
4. **Notification engine** — member and marshal notification sets per BRD Section 18, route-scoped for marshals (requirement #9).
5. **Reporting engine** — programme, demographic, route, and payment reports per BRD Section 17, built on top of the state machine so no separate reporting database is needed at this scale.
6. **Registration/auth** — standard + Google OAuth, duplicate-user detection.
7. **Admin programme/route/bus management** — full CRUD per BRD Section 5.

### 4.3 Non-Functional Requirements (BRD Section 19, engineering lens)
- Authentication required for all booking actions; role-based access control for Marshal vs. Admin functions.
- Passenger contact information restricted to the assigned Marshal only (requirement #9's route-scoping implies this is also a data-access boundary, not just a notification filter).
- Payment data never stored directly — delegate to the payment processor's tokenized flow (PCI scope reduction).
- Audit trail on booking status changes, payment status changes, and admin programme edits at minimum.
- Given the primary user base likely has mixed smartphone/data reliability, the system should degrade gracefully on slow connections — this affects the frontend stack decision in Section 7.

---

## 5. Decision Tree — Development Sequencing

```
Start
 │
 ├─ Is payment required for any programme in scope at launch?
 │    ├─ YES → Build payment integration in Phase 1 (core dependency for booking confirmation logic)
 │    └─ NO  → Defer payment integration to Phase 2, build free-booking flow first
 │
 ├─ Is the booking-lifecycle state machine built and tested?
 │    ├─ NO  → STOP. Build this first. Every other feature (dashboards, reports, notifications) depends on it.
 │    └─ YES → Proceed
 │
 ├─ Are Marshal and Admin dashboards built on the same data layer as Member booking?
 │    ├─ NO  → Refactor before proceeding — divergent data layers are the most common cause of
 │    │         capacity/status drift between what Members see and what Marshals act on.
 │    └─ YES → Proceed
 │
 ├─ Is notification delivery confirmed reliable for the chosen channel?
 │    ├─ NO  → Do not launch — Marshal notification (requirement #9, route-scoped) is operationally
 │    │         load-bearing, not a nice-to-have. A missed notification means a bus leaves without
 │    │         its passenger list reconciled.
 │    └─ YES → Proceed to launch readiness
 │
 └─ Launch readiness: capacity engine tested under concurrent booking load, payment webhook
     reconciliation tested for failure/retry cases, reporting validated against seeded test data.
```

---

## 6. Open Decisions, Edge Cases & Recommendations

| # | Issue | Edge Case | Recommendation |
|---|---|---|---|
| 1 | Concurrent booking race condition | Two members book the last seat simultaneously | Use a database-level atomic decrement (row lock or `WHERE available_seats > 0`), not an application-level check-then-write — the latter will overbook under load. |
| 2 | Payment success but booking already cancelled | Member cancels while payment is mid-flight | Reconcile via payment webhook against current booking state; if cancelled, auto-trigger refund flow rather than silently dropping the payment. |
| 3 | Marshal manually cancels on member's behalf (requirement #13) vs. member self-cancels (Journey C) | Both paths must converge on the same state transition and seat-capacity update | Single cancellation function callable from both surfaces — do not duplicate the logic per role. |
| 4 | Duplicate registration detection (BRD Section 6) | Member registers again with a different phone number but same name/email | Dedupe primarily on email/Google ID; flag (not auto-merge) phone-number-only matches for admin review. |
| 5 | Programme with payment required but refund policy undefined for that specific programme | Admin creates a paid programme without specifying refund terms | Default to the Church's global refund policy; require explicit override, not silent fallback with no record. |
| 6 | No-show vs. cancelled distinction in reporting | Member confirmed, didn't board | BRD Section 17 already separates these — ensure the state machine has a distinct "No-show" terminal state, not just "Confirmed" with no boarding record. |
| 7 | Marshal reassignment mid-programme | Marshal assigned to a route becomes unavailable | Not specified in BRD — flag to stakeholder; recommend admin-triggered route reassignment that re-scopes notifications to the new Marshal. |

---

## 7. Decisions Required — Multiple Choice (max 3 options per section, recommended marked ★)

### 7.1 Production Environment
- **A.** Single shared environment (dev = staging = prod) — fastest, highest risk
- **B. ★** Two-tier: staging + production — standard for this scale, catches booking-logic bugs before live programmes
- **C.** Full dev/staging/prod three-tier — unnecessary overhead for a single-congregation app

### 7.2 Frontend
- **A.** Native mobile apps (iOS + Android) — best UX, slowest to ship, app-store approval delays, highest cost
- **B. ★** Progressive Web App (React/Next.js, mobile-first, installable, works on low-end devices/slow connections) — matches the non-functional requirement on connection reliability, single codebase, no app-store gatekeeping
- **C.** Native app via React Native — cross-platform code reuse, still carries app-store overhead B avoids

### 7.3 Backend
- **A.** Separate Node.js/Express API — clean separation, more infrastructure to run
- **B. ★** Next.js API routes (same codebase as frontend, TypeScript throughout) — matches your existing Node.js/TypeScript stack, minimizes infra surface for this scale
- **C.** Python/FastAPI backend — viable given your Python background, but splits the stack unnecessarily for an app this size

### 7.4 Database
- **A.** Self-managed PostgreSQL on a VPS — full control, full ops burden
- **B. ★** Supabase (managed Postgres + built-in auth + realtime) — realtime seat-capacity updates and auth come near-free, matches your PostgreSQL experience, minimal DevOps load
- **C.** Firebase/Firestore — fast to start, weaker fit for the relational booking/capacity/payment logic this app actually needs

### 7.5 Hosting
- **A.** Self-managed VPS (DigitalOcean/Linode) — cheapest raw compute, most ops responsibility
- **B. ★** Vercel (frontend + API routes) + Supabase (DB/auth) — near-zero DevOps, scales automatically, fits the Next.js/Supabase pairing above
- **C.** AWS full stack — most powerful, significant overkill and cost for this scale

### 7.6 Payment Platform
- **A.** Flutterwave — strong NG coverage, comparable fees
- **B. ★** Paystack — most common choice for NG church/community apps this size, straightforward webhook-based reconciliation, good documentation
- **C.** Direct bank transfer with manual confirmation — zero integration cost, reintroduces the manual-reconciliation problem this project exists to remove

### 7.7 Notification Channel
- **A.** In-app push only — free, but depends on members keeping the app open/notifications enabled, risky for a Marshal-critical alert
- **B. ★** Push + SMS fallback (via Termii or Africa's Talking) for Marshal and booking-critical alerts — SMS reliability matters most for the Marshal notification requirement, which is operationally load-bearing per Section 5
- **C.** SMS only — most reliable delivery, highest recurring cost, loses in-app UX for less critical notifications

---

## 8. Cost Breakdown Analysis

*Figures are rough-order estimates for a single-congregation deployment, not a scaled SaaS product. Treat as planning ranges, not quotes.*

### 8.1 Development & Deployment Budget (one-time)
| Item | Estimate (self-build, your stack) |
|---|---|
| Core booking engine + state machine | Primary build effort — largest time allocation |
| Member/Marshal/Admin dashboards | Built on same data layer, moderate effort given PWA + Supabase pairing |
| Payment integration (Paystack) | Low — well-documented SDK, webhook reconciliation is the main care point |
| Notification integration (push + SMS) | Low–moderate — Termii/Africa's Talking have simple REST APIs |
| Testing (concurrency, payment edge cases) | Do not skip — Section 6, items 1–2 are real production risks if untested |

### 8.2 Production Budget (recurring, monthly, modest scale)
| Item | Estimate |
|---|---|
| Vercel hosting | Free tier likely sufficient at this scale; paid tier (~$20/mo) if usage grows |
| Supabase (DB + auth + realtime) | Free tier covers early usage; paid tier starts ~$25/mo |
| SMS (Termii, pay-as-you-go) | Scales with notification volume — budget per-programme based on expected booking count × Marshal/member alert count |
| Paystack fees | Percentage-based per transaction, no fixed monthly cost |
| Domain | ~$10–15/year |

### 8.3 Development & Deployment Timeline
- **Phase 1 (core):** booking state machine, capacity engine, registration/login, programme/route management — this is the dependency root per Section 5's decision tree.
- **Phase 2:** payment integration, Marshal dashboard, notification engine.
- **Phase 3:** Admin reporting, cancellation flow (Journey C), audit trail.
- **Phase 4:** testing pass on concurrency and payment edge cases (Section 6) before first live programme.

Exact durations depend on available build time, not addressed here since that's a resourcing input only you have.

---

## 9. Handoff Note

Built sequence for your agents: this PRD → Section 5 decision tree governs build order → Section 7 choices need your sign-off before Phase 1 starts (frontend/backend/DB/hosting choices are interdependent — picking B across 7.2–7.5 is a coherent single stack, mixing in a different option elsewhere should be a deliberate call, not a default). Section 6's edge cases should become test cases, not just documentation.
