# PRD v1.0 (Candidate): TCN Ikorodu Transport Booking and Management App

**Status:** Candidate, not frozen · **Version:** 1.0-candidate · **Date:** 2026-10-13 · **Owner:** Product Manager (author); Executive Product Sponsor (approves at the freeze)
**Decisions:** D-024, D-025, D-027 to D-057; this candidate is D-050 · **Open issues:** OI-001 to OI-050 (section 12) · **Questions:** Q-001 to Q-042

---

## 0. Status and how to use this document

- This candidate summarises the requirements. It does not replace the detailed documents, which hold the rules. Each requirement links to its source.
- **Nothing here is binding yet.** Binding content is the decision log (`DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md`) and the frozen set (`ROADMAP/DEVELOPMENT-STRATEGY.md` §3). This file becomes `PRD-v1.0.md` at the freeze (D-045), after the transport sign-off and the technical reconvene.
- **Trace keys.** `BRD §` is the Business Requirements Document. `FR-` is a functional requirement in this file. `NFR-` is a non-functional requirement. `D-` is a decision, `OI-` an open issue, `Q-` a question, `P-` a department policy (`GOVERNANCE/DEPARTMENT-POLICY-REGISTER.md`), `RISK-` a risk. `MEM-`, `GST-`, `MAR-`, `ADM-` and `SYS-` are acceptance criteria (`TESTING/ACCEPTANCE-CRITERIA.md`). `A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I` followed by two digits are scenarios (`PRODUCT/SCENARIOS-AND-EDGE-CASES.md`).
- **Status values.** *Designed* means the design documents define it. *Decided* means a decision record fixes it. *Policy* means the department must write the rule first. *Gap* means the BRD or the design is missing it, and an open issue tracks it. *Blocked* means a reconvene decision must come first.

---

## 1. Product statement

**The product.** A central, trackable, capacity-aware booking and management system for church transport. It replaces the current process of phone calls, WhatsApp messages and informal headcounts (BRD §2 and §3; PRD draft §2).

**The outcome.** Every seat on every bus is known before departure. Each rider is a booking, and each booking is either held, confirmed, cancelled or expired. A confirmed rider is either boarded, a no-show, or removed, and the difference between a booking and a confirmed passenger is always visible (BRD requirement 11; D-025).

**The scale.** One congregation. Not multi-tenant, not multi-branch (BRD §2; OUT OF SCOPE rows in SCOPE-AND-JOURNEYS §1). Sunday services and special events such as Hallelujah Night.

**The platform.** An installable web app (PWA) with three role experiences (member, marshal, administrator) on one codebase (D-009, D-024). TypeScript throughout. Next.js on Vercel Pro for the app; Supabase for Postgres, authentication, realtime and scheduled functions (D-024, D-027). Ratification of the stack is pending at the reconvene (OI-001).

**Proposed success measures (Recommendation, for sponsor confirmation).**

| Measure | Target | Source |
|---|---|---|
| Overbooked seats | Zero, under concurrent load | SYS-01; TEST-STRATEGY §4 |
| Manifest matches the paper list at departure | Every pilot departure | UAT-2; roadmap Stage 6 |
| Payment differences between provider and app | Zero unresolved at each day's close | PAYMENTS §5 |
| Missed marshal alerts | Below a threshold agreed before the pilot | OI-031; roadmap Stage 6 |
| Support reports answered within target | Per SUPPORT §4, once confirmed | D-042; P-23 |
| Riders on the manifest who booked in the app | Tracked from the first programme | Journey D |

---

## 2. Users and access

| User | Who | What they do | Access |
|---|---|---|---|
| Member | Church member, signed in and approved | Book for self and approved guests; pay where required; cancel in the window; report a problem | Own bookings and riders only (AUTH §6; MEM-31) |
| Guest | Invited by a member, or applied publicly, and approved | Book as a rider under a host; see own bookings | Own bookings only (GST-06) |
| First-time applicant | Not yet approved | Apply; wait for a decision within 24 hours (D-044) | No booking controls (MEM-03) |
| Transport marshal | Named for a bus or a special event | Duty list, boarding, no-show, walk-on, incidents, contact admin | Own assignment only (AUTH §6; MAR-02) |
| Administrator | Trained, with a second factor (at least two, OI-014) | Programmes, buses, marshals, approvals, refunds, reports, audit, broadcast | All, with reasons on corrections (AUTH §6) |
| Church Transport Department | Liaison and staff | Writes policies; owns the register and support categories | No app role at launch except through administrators |
| Finance contact | Named by the church (D14) | Owns payment problems (D-042) | **Not defined.** Recorded as assumption A-08 |
| Executive Product Sponsor | Church leadership | Approves rules, money and launch | No app role |

---

## 3. Scope

Scope tiers are classified by business value, operational necessity and dependency (AGENTS Part I §13). The full table with its basis is in `PRODUCT/SCOPE-AND-JOURNEYS.md` §1. Summary:

| Tier | Capabilities |
|---|---|
| CORE | Membership-gated sign-in and registration; programmes and special events; routes and buses with per-bus booking toggle; booking lifecycle; capacity engine with atomic reservation; provider-hosted payment; three role apps |
| MVP | Group booking with named riders (D-011); refunds (admin-approved; automation after the policy, D-038); push, email and inbox; SMS for marshal alerts and sign-in codes (D-028); support surfaces; admin approval of first-time registration; printable manifest; basic audit trail; role-based access; automated backups with tested restore; `transport` schema; waitlist (D-030) |
| PHASE 2 | WhatsApp Business API (D-010, OI-037); full exportable audit for leadership; reporting beyond the operational dashboard and no-show forecasting (D-022); quota tuning from real usage (RATE-2); point-in-time recovery (DEVOPS §5) |
| FUTURE | Multi-tenant infrastructure (OI-008) |
| OUT OF SCOPE | Cash, POS and manual payment records (D-033, retires D-021); native iOS and Android store apps (D-009); card or bank details stored in the app (D-023); marshal self-release or claim pool (D-005); multi-branch or multi-congregation |

**Assumption A-01.** Outbound and return seats are counted separately (PROGRAMMES-LEGS-GUESTS §2). The source says "confirm with the department", but the question was never asked. It is assumed until the pilot.

---

## 4. Journeys

The journeys are the acceptance script for the prototypes and the end-to-end tests. Each step and its state change are in `PRODUCT/SCOPE-AND-JOURNEYS.md` §2.

| Journey | Summary | Source |
|---|---|---|
| A. First-time member | Applies; sees "under review"; admin approves, rejects or asks for information; member notified | BRD journey A; D-044 |
| B. Returning member books | Chooses programme, leg, bus and pickup; adds riders; seats held; a free booking waits for the marshal's call, a paid one for the provider; a hold expires if not paid, and a free hold ends at 18:00 the day before departure | BRD journey B; D-051; D-055 |
| C. Member cancels | Inside the window: cancelled, seats released, refund requested if paid. Outside: contact route only | The BRD has no journey C. The PRD draft §3 supplies one as an interpretation; D-032 |
| D. Marshal runs a bus | Opens duty; boards; marks no-shows after the lock; adds walk-ons before the lock; reports problems; ends duty with a summary | BRD journey D; D-037, D-041 |
| E. Administrator | Creates programme or special event; configures buses and marshals; publishes; opens (second approval); handles approvals, support and corrections; reports | BRD journey E; D-042 |
| F. Guest joins | Invite link, public application, or added by a host | PROGRAMMES-LEGS-GUESTS §4; D-040 |
| G. Special event lifecycle | Draft, published, booking open, paused, closed, in progress, completed, cancelled | STATE-MACHINES §5 |
| H. Member reports a problem | Opens report with booking reference; category sets owner; admin triages; resolved or closed | SUPPORT-SYSTEM §1 to §3 |

---

## 5. Functional requirements by module

Each module lists its functional requirements. Tier and status are given per requirement. Tables, states and rules sit in the frozen documents named in each module.

### MOD-01 Identity and sign-in

*Source: AUTH-DESIGN §2 and §7; D-028; D-029; BRD §7.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-01 | Members and marshals sign in with a one-time code sent by SMS | D-028, D-029, MEM-01 | MVP | Designed; vendor open (OI-031) |
| FR-02 | Administrators sign in with email (password or magic link) and an authenticator second factor (TOTP) | D-029, ADM-01 | MVP | Designed; enrolment open (OI-039) |
| FR-03 | Google sign-in offered as an identity method, integrated at deployment. Magic link (email) is also added later, alongside the phone code. Identity only, not membership | D-029; D-052; AUTH-1 | MVP | Designed; branding check (Verify) |
| FR-04 | A returning user sees their existing profile after sign-in | BRD §7 | MVP | Designed; profile screen missing from route map (OI-045) |
| FR-05 | Session rules: members long-lived with sign-out-all; marshals short and re-checked on each duty load; administrators short idle timeout with the second factor | AUTH-DESIGN §7; MAR-19 | MVP | Designed |
| FR-06 | Password sign-in next to the phone code, as BRD §6 asks | BRD §6; D-056 | MVP | Decided (D-056); recovery through the phone code |

### MOD-02 Membership and first-time registration

*Source: AUTH-DESIGN §3 and §4; SCOPE Journey A; D-044; D-007 (blocked).*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-07 | First-time applicant gives full name, phone, email, gender (male or female, required) and who invited them | SCOPE A2; BRD §6; D-052; D-057 | MVP | Designed; other required fields from the department (OI-042) |
| FR-08 | Membership stays pending until an administrator decides. No booking controls while pending | MEM-03 | MVP | Designed |
| FR-09 | Administrator approves, rejects with a reason, or asks for information. Each decision is audited and notified | ADM-03; STATE-MACHINES §9 | MVP | Designed |
| FR-10 | Decision due within 24 hours; reminder to the administrator at 12 hours | D-044; ADM-02 | MVP | Decided |
| FR-11 | Duplicate and roster matching: a match creates a review item; nothing merges automatically | AUTH-DESIGN §4; TEST §2 item 4 | MVP | **Blocked** (D-007 with AUTH-2, OI-001) |
| FR-12 | Membership changes: suspend, reinstate, retire. Each with reason | STATE-MACHINES §9 | MVP | Designed; bookings on suspension are policy P-10 |
| FR-13 | Roster import from CSV; each import recorded and reversible; the roster is an aid to matching, not the source of membership | DATA-MODEL §2.1; OI-015 | MVP | Designed; steward open (D1, OI-015) |
| FR-14 | A person not on the roster is flagged for review, never rejected outright | RISK-ASSESSMENT L-7 | MVP | Blocked (D-007) |

### MOD-03 Guests

*Source: PROGRAMMES-LEGS-GUESTS §4; AUTH-DESIGN §5; D-040; D-034.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-15 | Invite link: random token of at least 128 bits, shown once, stored as a hash, with expiry, use limit and revoke. Redeeming creates an approved guest linked to the host, with no administrator approval | G2; GST-01, GST-02; T10 | MVP | Designed |
| FR-16 | Public guest application creates a pending record that an administrator decides | G1; GST-03 | MVP | Designed |
| FR-17 | A member adds a guest in My Guests. The guest is approved to ride under that member, visible to administrators | G3 | MVP | Designed |
| FR-18 | Guest status: invited, registered, pending, approved, declined, removed | DATA-MODEL §2.1 | MVP | Designed |
| FR-19 | A guest who wants to be a member goes through first-time registration | GST-10; D-044 | MVP | Designed |
| FR-20 | No guest cap at launch. Administrators see guest share per programme and per bus | D-040; ADM-11; RISK-012 | MVP | Decided |

### MOD-04 Programmes and special events

*Source: PROGRAMMES-LEGS-GUESTS §1; STATE-MACHINES §5 and §10; D-039; D-042.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-21 | Recurring Sunday programme: free. Booking window opens on Friday at 18:00 for the Sunday, with a per-programme override | BRD requirement 6; policy register §1 | MVP | Designed; exact window for events is policy |
| FR-22 | Special event: admin creates in draft; publishes; a second administrator approves before bookings open | D-042; ADM-04, ADM-05 | MVP | Decided |
| FR-23 | Programme fields: name, date, start time, description, routes, bus capacity, booking open and close, payment requirement, price | BRD §5 | MVP | **Gap**: end time, description, venue and transport flag missing (OI-043) |
| FR-24 | Cancel a programme with a reason. Cancels every booking, creates refund requests for paid bookings, and notifies riders | ADM-13; STATE-MACHINES §5 | MVP | Designed; amounts policy P-01 |
| FR-25 | Changing capacity or time after bookings exist is a correction that notifies affected riders and never moves them silently | PROGRAMMES §1.2; BRD requirement 3 | MVP | Designed |
| FR-26 | Booking window: opened and closed by the scheduler, or manually; can be paused | D-004; STATE-MACHINES §5 | MVP | Decided |
| FR-27 | A special event never uses the free path, even on a Sunday | PROGRAMMES §1; A10 | MVP | Decided |
| FR-28 | One price per rider per programme, whatever the leg; currency NGN, stored in kobo as whole numbers | D-039; PAYMENTS §1 and §2 | MVP | Decided |

### MOD-05 Routes, pickup points and buses

*Source: DATA-MODEL §2.2; D-001; D-013; BRD §9.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-29 | A route may have several buses. Route capacity is the sum of its buses | D-001 | CORE | Decided |
| FR-30 | Pickup points in sequence, each with a pickup time per leg | BRD §9, requirements 1 and 2 | CORE | **Gap**: no pickup time (OI-043) |
| FR-31 | Buses: label, optional plate, capacity, active flag. No driver personal data | DATA-MODEL §2.2 | CORE | Designed |
| FR-32 | Each bus can be opened or closed for booking independently of the route | D-013; ADM-07 | CORE | Decided |
| FR-33 | Changing a pickup point or route notifies riders and records the change | ADM-25; P-26 (build) | MVP | Designed; policy P-26 |

### MOD-06 Assignments, capacity and seat ledger

*Source: BRD §15; DATA-MODEL §2.2 and §6; ADR-0002; SYS-01; SYS-12.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-34 | An assignment binds a programme, route, bus, marshal and capacity per leg. The marshal must hold the marshal role | API-CONTRACTS `configure_assignment` | CORE | Designed |
| FR-35 | Available seats are derived from the seat ledger under a row lock. Clients never write a seat count | ADR-0002; DATA-MODEL §6 item 1 | CORE | Designed; reconvene (OI-001) |
| FR-36 | Members see the seats left, such as "1 seat left" | BRD requirement 5 | MVP | Designed |
| FR-37 | Capacity cannot be lowered below the number of confirmed riders | ADM-06 | MVP | Designed |
| FR-38 | Overbooking is impossible under concurrent holds | SYS-01; TEST-STRATEGY §4 | CORE | Designed; k6 test |
| FR-39 | Outbound and return seats are counted separately | PROGRAMMES §2 | CORE | **Assumption A-01** |

### MOD-07 Booking

*Source: STATE-MACHINES §1 and §2; API-CONTRACTS `hold_seats`; D-003; D-025; D-039.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-40 | Member chooses programme, leg (outbound, return or round trip), bus, pickup point and riders (self, approved guests, named riders for a host) | BRD §10; SCOPE B1 and B2 | CORE | Designed |
| FR-41 | Seats are held atomically. Hold length 15 minutes (proposal) | D-003; BACKEND-DESIGN §2 | CORE | **Blocked** (OI-001) |
| FR-42 | The app acknowledges the booking at once with a reference | BRD requirement 13 | MVP | Designed |
| FR-43 | A free booking stays held until the marshal records a reached call and the member's confirmation | D-051; BRD §12, requirement 11 | MVP | Decided (D-051); the hold ends at 18:00 the day before departure (D-055) |
| FR-44 | A paid booking goes to the provider's checkout and is confirmed only by a verified provider event | D-023; PAYMENTS §3; SYS-03 | CORE | Designed |
| FR-45 | An unpaid hold expires and releases its seats | BACKEND-DESIGN §3; SYS-02 | CORE | Designed |
| FR-46 | Booking states: held, confirmed, cancel pending, cancelled, expired. Payment, rider and boarding are separate axes | D-025; STATE-MACHINES §1 | CORE | Decided |
| FR-47 | A round trip makes one manifest entry per leg. A return-only rider makes one entry, on the return leg | A02, A03; D-039 | CORE | Decided |
| FR-48 | Group booking: a host books for named riders with one payment. All riders are held together or the request fails | PAYMENTS §4; D-011; A06 | MVP | Designed |
| FR-49 | A full bus does not show "booking closed": it offers the waiting list. "Booking closed" is shown only when an administrator closes the bus or window | BRD requirement 4, superseded by D-030 | MVP | Covered with change |
| FR-50 | Paid amount shown in bold, with the price per rider and the total | BRD requirement 7; MEM-39 | MVP | Designed |
| FR-51 | A double tap on confirm creates one booking | MEM-35; B14 | CORE | Designed |
| FR-52 | Member cancels inside the window; outside it, the app shows the contact route | MEM-17, MEM-18; D-032 | MVP | Designed; cutoff confirmed by the department (D10) |
| FR-53 | Cancelling a paid booking creates a refund request. No amount is shown until the refund policy is signed | MEM-19; P-01 | MVP | Policy P-01 |
| FR-54 | A limit on concurrent holds per member | OI-017; R-01 | MVP | **Blocked** (with D-003) |

### MOD-08 Waiting list

*Source: D-030, D-034, D-035; STATE-MACHINES §11; PAYMENTS and CONTRACTS.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-55 | A member joins a waiting list when a bus or leg is full | MEM-20; D-030 | MVP | Decided |
| FR-56 | Priority: first-timer guests first; then everyone else by time joined | D-034; GST-09 | MVP | Decided |
| FR-57 | When a seat is released or a bus is added, the marshal is notified, and the administrator adds a bus or finds another solution | D-030; ADM-09 | MVP | Decided |
| FR-58 | Offers are sent by push and SMS. The rider has two hours to accept | D-035; MEM-21 | MVP | Decided |
| FR-59 | A live offer holds its seats until accepted or expired | D-035 (Recommendation); Q-025 | MVP | **Assumption A-02** |
| FR-60 | When an offer expires, the next rider is offered. An expired offer never holds a seat | STATE-MACHINES §11; MEM-23 | MVP | Designed |
| FR-61 | Accepting creates a booking through the normal hold path; payment follows | MEM-22 | MVP | Designed |
| FR-62 | Every offer, acceptance, decline and expiry is recorded | STATE-MACHINES §11 | MVP | Designed |
| FR-63 | The administrator sees the queue in offer order, with first-timer guests first | ADM-10 | MVP | Designed |
| FR-64 | The BRD's deferral of the waiting list is replaced by this module | BRD §15; D-030 | MVP | Covered with change |

### MOD-09 Payments

*Source: PAYMENTS-DESIGN; PROVIDER-CONTRACTS; ADR-0003; D-006; D-023; D-033.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-65 | Provider-hosted checkout through Paystack, or OPay, or both. The choice is open | OI-025; D-023 | CORE | **Gap** until OI-025 and sandbox results (OI-033) |
| FR-66 | No card, CVV, account or wallet field anywhere in the app or database | D-023; SYS-08; ADM-22 | CORE | Decided |
| FR-67 | The amount is computed on the server from the booking. The client sends only the booking and the provider | PAYMENTS §1; SYS-05; T8 | CORE | Designed |
| FR-68 | Webhooks: signature verified on the raw body; each event stored once; duplicates are no-ops | API-CONTRACTS §3; SYS-03, SYS-04 | CORE | Designed |
| FR-69 | Reconciliation every 10 minutes of aged redirected payments, through the same apply path | OI-020; BACKEND-DESIGN §6 | CORE | Designed |
| FR-70 | A payment that succeeds after its hold expired goes to reconciliation and is not confirmed automatically | SYS-06 | CORE | Designed |
| FR-71 | A payment whose amount or reference differs from the booking is not confirmed and is flagged | SYS-05 | CORE | Designed |
| FR-72 | The return page never changes payment state. It shows "checking your payment" | MEM-14; T9 | CORE | Designed |
| FR-73 | Payment states: not required, pending, redirected, succeeded, failed, expired, reconciliation required, refund pending, refunded. BRD "Cancelled" maps to expired or abandoned | BRD §11; STATE-MACHINES §3 | CORE | Covered with mapping |
| FR-74 | Daily summary of provider totals against succeeded payments. Differences are alerts for the administrator, not automatic corrections | PAYMENTS §5 | MVP | Designed |
| FR-75 | No cash, no POS, no manual payment records | D-033; SYS-18 | CORE | Decided |
| FR-76 | Assisted payment for members without a digital route | P-12; RISK-011 | MVP | **Policy P-12**; conflicts with D-033 by design (RISK-011) |

### MOD-10 Refunds and financial controls

*Source: STATE-MACHINES §4; PAYMENTS §6; D-006; D-032; D-038; P-01, P-02, P-13, P-29.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-77 | A refund request is created on an eligible cancellation or a programme cancellation | STATE-MACHINES §4 | MVP | Designed |
| FR-78 | An administrator decides each refund. The amount follows the refund rule, which is not yet written. Until then the calculation is shown and the administrator decides | PAYMENTS §6; OI-036; D-038 | MVP | **Policy P-01** |
| FR-79 | An override after the cutoff needs a reason and is audited | ADM-15 | MVP | Designed |
| FR-80 | Refunds go through the provider where supported. Otherwise they are recorded manually with the provider's reference | D-006; PAYMENTS §6 | MVP | Verify (provider refund APIs) |
| FR-81 | A failed refund goes to the administrator's queue; retry is an administrator action | STATE-MACHINES §4 | MVP | Designed |
| FR-82 | One refund record per request, even when requested twice | SYS-07 | MVP | Designed |
| FR-83 | Partial and group refunds: who receives the refund when one rider leaves a paid group | OI-018; P-02; A08 | MVP | **Policy P-02** |
| FR-84 | Finance views by finance period: expected, received, successful, failed, pending, refunded | BRD §17; D-043 | MVP | Designed; definitions **Gap** (OI-048) |
| FR-85 | Refund approval limits and reconciliation cadence | P-29 | MVP | **Policy P-29** |

### MOD-11 Manifest and boarding

*Source: STATE-MACHINES §2; D-037; D-041; BRD requirement 8 and §14.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-86 | The manifest for each assignment and leg lists every rider with status and labels: guest of host, walk-on, return-only | BRD requirement 8; PROGRAMMES §4 | CORE | Designed |
| FR-87 | Marking a rider boarded happens once. A second tap shows "already boarded" and creates no second record | MAR-04; E14 | CORE | Designed |
| FR-88 | No-show can be marked from the manifest lock onward | D-037; MAR-05 | CORE | Decided |
| FR-89 | A boarded rider cannot be removed. Only an administrator correction, with a reason | MAR-08; ADM-17 | CORE | Designed |
| FR-90 | The manifest locks 30 minutes before departure. The lock is enforced on the server, not only in the screen | D-037; SYS-12 | CORE | Decided |
| FR-91 | After the lock, a rider may be added only by administrator approval, with a reason | D-041; MAR-07 | CORE | Decided |
| FR-92 | A marshal sees contact details only for riders on their own assignment | AUTH-DESIGN §6; SYS-10; MAR-15 | CORE | Designed |
| FR-93 | The marshal records each contact per rider (reached, not reached, no longer going) and the member's confirmation. Held riders show as "to contact" on the duty list | D-051; BRD requirement 10 | MVP | Decided (D-051) |
| FR-94 | Departure recorded; boarding closes for that leg | STATE-MACHINES §6; MAR-20 | CORE | Designed |
| FR-95 | A printable manifest shows the count, the time, and when it was last synced | R-007; MAR-11 | MVP | Designed |

### MOD-12 Marshal duty and walk-ons

*Source: SCOPE Journey D; AUTH-DESIGN §6 and §8; D-005; D-041.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-96 | The duty list shows only the buses assigned to the signed-in marshal | MAR-01; E04 | CORE | Designed |
| FR-97 | A walk-on before the lock is added with a reason and marked as a walk-on | MAR-06; D-041 | MVP | Designed |
| FR-98 | A marshal cancels a booking when a member says they will not go | BRD requirement 12; API `cancel_booking` | MVP | Designed |
| FR-99 | An administrator reassigns a marshal. The old marshal loses access at once | MAR-17; D-005 | MVP | Decided |
| FR-100 | Duty screen re-checks membership on each load | AUTH-DESIGN §7 | MVP | Designed |
| FR-101 | The duty summary counts equal the manifest | MAR-16 | MVP | Designed |
| FR-102 | A marshal cannot change fees or refunds | MAR-18; P-14 | MVP | Policy P-14 |

### MOD-13 Travel-day incidents

*Source: STATE-MACHINES §8; OI-019; RISK-ASSESSMENT R-03; SUPPORT-SYSTEM §1.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-103 | A marshal or administrator opens an incident: bus late, breakdown, cancelled, marshal absent, wrong bus, other | DATA-MODEL §2.5 | MVP | Designed |
| FR-104 | A breakdown or cancellation notifies affected riders and the administrator in the same transaction | STATE-MACHINES §8; NOTIFICATIONS §2 | MVP | Designed |
| FR-105 | An administrator acknowledges and acts on an incident: rebook, reassign, notify | ADM-24 | MVP | Designed |
| FR-106 | Cancelled bus: mass notification, then a rebook offer, or a refund request, per the policy | OI-019; P-03; Q-032 | MVP | **Policy P-03** (sign-off item Q-032) |
| FR-107 | Late bus: how long it waits, and what happens to late riders | P-04; Q-028 | MVP | **Policy P-04** (sign-off item Q-028) |

### MOD-14 Notifications and inbox

*Source: NOTIFICATIONS-DESIGN §1 to §7; D-009; D-028; D-037; BRD §13 and §18.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-108 | Channels: Web Push, email, in-app inbox; SMS for marshal critical alerts and sign-in codes; WhatsApp and phone as links only | D-009; D-028; OI-037 | MVP | Designed |
| FR-109 | Every event that needs a message writes an outbox row in the same transaction as the state change | NOTIFICATIONS §3; BACKEND-DESIGN §4 | MVP | Designed |
| FR-110 | Dispatch with retries (immediate, 1 minute, 5 minutes, 30 minutes, 2 hours), then dead letter with an administrator alert | BACKEND-DESIGN §4; SYS-15 | MVP | Designed; schedule is a proposal |
| FR-111 | Marshal alerts are scoped to the marshal's own assignment, including a new-booking alert | BRD requirement 9; BRD §13; D-053; SYS-11 | MVP | Decided (D-053) |
| FR-112 | Quiet hours 22:00 to 05:00 hold non-critical messages. Critical messages are not held | NOTIFICATIONS §4; MEM-33 | MVP | Proposal (P-24) |
| FR-113 | Messages never contain one-time codes, payment instruments or passwords | NOTIFICATIONS §6; T17 | MVP | Designed |
| FR-114 | Permission request after the first booking or duty, with a plain reason | NOTIFICATIONS §5 | MVP | Designed |
| FR-115 | Event catalogue: 25 event rows, including the marshal new-booking alert, the marshal payment-change alert and the programme reminder | NOTIFICATIONS §2; BRD §18; D-053 | MVP | Decided (D-053); SMS vendor OI-031 |
| FR-116 | Templates: seventeen. The fourteen in NOTIFICATIONS §7 (application decided, booking held, hold expiring, booking confirmed, booking cancelled, payment failed, refund decided, rider removed, assignment changed, incident opened, programme cancelled, support updated, guest decided, broadcast), plus marshal booking created, marshal payment changed and programme reminder | NOTIFICATIONS §7; D-053 | MVP | Designed; three added by D-053 |
| FR-117 | Waiting-list offer and expiry messages show a two-hour countdown in the app | MEM-21 | MVP | Designed |

### MOD-15 Support and problem reports

*Source: SUPPORT-SYSTEM; STATE-MACHINES §7; D-042; D-028.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-118 | Report a problem from a booking card or the help page, with the booking reference filled in. Categories: booking, payment, app bug, travel incident, other | SUPPORT §1 and §2; MEM-27 | MVP | Designed |
| FR-119 | Owners by category: administrator (bookings, incidents); finance contact (payments); app bugs through the administrator | D-042; SUPPORT §2 | MVP | Decided (finance contact named: D14) |
| FR-120 | Reporters see only their own reports and the messages written for them. Internal notes are hidden | MEM-29; SUPPORT §6 | MVP | Designed |
| FR-121 | Response targets per category | SUPPORT §4; P-23 | MVP | Proposal, to be confirmed (A-04) |
| FR-122 | Escalation to the product manager role after two missed targets | SUPPORT §5 | MVP | Designed |
| FR-123 | WhatsApp and phone links to the marshal and to administrators, with the booking or bus filled in. The contact is logged; the message is not | SUPPORT §7; MEM-28; MAR-12 | MVP | Designed |
| FR-124 | Help page: how to report, how refunds work, what to do with an expired hold, and the privacy line on payment details | SUPPORT §8 | MVP | Designed |
| FR-125 | No attachments at launch | SUPPORT §6 | MVP | Decided |

### MOD-16 Reports and exports

*Source: BRD §17; D-022; D-043; PRODUCT §3.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-126 | Programme report: total bookings, confirmed, cancelled, no-shows and boarded, by programme and date | BRD §17 | MVP | Designed; no report route (OI-045) |
| FR-127 | Demographics: first-time and returning members | BRD §17 | MVP | Designed (from joined_via) |
| FR-128 | Route reports: passengers per route, utilisation, most and least popular | BRD §17; D-022 | MVP | Designed; definitions **Gap** (OI-048) |
| FR-129 | Payment reports: totals, failed, pending, refunds | BRD §17 | MVP | Designed; definitions **Gap** (OI-048) |
| FR-130 | CSV export limited to the finance period set by the church | D-043; ADM-21 | MVP | Policy (finance period D13) |
| FR-131 | Guest share per bus and per programme | D-040; ADM-11 | MVP | Designed |
| FR-132 | Reports use counts. No person-level analytics beyond operational screens. Forecasting waits for six months of data | D-022; OPTIMISATION §9 | MVP | Decided |
| FR-133 | Male and female demographic report from the required gender field | BRD §17; D-057 | MVP | Decided (D-057) |

### MOD-17 Audit, corrections and oversight

*Source: DATA-MODEL §2.6 and §3; STATE-MACHINES §12; OI-012; OI-013; BRD §19.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-134 | Every state change writes its transition row and its audit row in the same transaction | SYS-14 | MVP | Designed |
| FR-135 | The audit trail is append-only. No role can edit or delete it | ADM-20; T15 | MVP | Designed |
| FR-136 | Corrections are supersession records with a reason; originals are kept | ADM-17; STATE-MACHINES §12 | MVP | Designed |
| FR-137 | Read-only audit view with filters | ADM-20 | MVP | Designed; route in place (FRONTEND §2) |
| FR-138 | Weekly administrator activity digest with anomaly flags | OI-013; RISK-ASSESSMENT L-4 | MVP | Recommendation (OI-013) |
| FR-139 | Every record carries a correlation ID and the acting role | OI-009; BACKEND-DESIGN §7 | MVP | Designed; OI-009 confirmation |

### MOD-18 Administration

*Source: AUTH-DESIGN §6 and §8; D-005; D-032; D-041; D-042; OI-014.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-140 | At least two trained administrators. Roles are granted and revoked as rows, and each change is audited | OI-014; DATA-MODEL §2.1 | MVP | Policy P-22 |
| FR-141 | Marshal assignment and revocation | D-005; ADM-08 | MVP | Decided |
| FR-142 | Settings: default cutoff of 12 hours, per-programme override with reason; support phone numbers; quiet hours | D-032; SUPPORT §1 | MVP | Designed; route missing (OI-045) |
| FR-143 | Overview queues: registrations, refunds, reconciliation, reports, incidents, dead letters, guest share | FRONTEND §2 | MVP | Designed |
| FR-144 | Overdue items are shown on the overview | SUPPORT §4 | MVP | Designed |
| FR-145 | Travel-day on-call rota | D-041; P-22 | MVP | Policy P-22 |

### MOD-19 Broadcast

*Source: NOTIFICATIONS §2; ADM-19.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-146 | An administrator sends a message to a segment: riders on a programme, a bus, marshals, or all members. Large sends need a second administrator | ADM-19; P-24 | MVP | Designed; second approval is Level L |
| FR-147 | Every broadcast is written to the outbox and audited | NOTIFICATIONS §7 | MVP | Designed |

### MOD-20 Privacy, retention and data requests

*Source: DATA-MODEL §3 and §4; THREAT-MODEL §5; OI-038; D-043.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-148 | A privacy notice shown at sign-up | THREAT-MODEL §5; START-CHECKLIST D9 | MVP | **Blocked** on counsel (OI-038) |
| FR-149 | Scheduled retention: closed reports pseudonymised after a window; push endpoints removed on sign-out or inactivity; redacted payloads purged after the reconciliation window; attendance reduced to counts after one programme year; roster imports kept as latest and previous | DATA-MODEL §4; D-043 | MVP | Designed; windows proposed (A-07) |
| FR-150 | Access and correction requests handled through administrator corrections | THREAT-MODEL §5; P-21 | MVP | Designed; policy P-21 |
| FR-151 | Erasure: person fields pseudonymised; event rows kept | DATA-MODEL §3 | MVP | Designed; OI-038 |
| FR-152 | No location tracking. No identity documents | THREAT-MODEL §5 | MVP | Decided |

### MOD-21 Install, installable app and offline

*Source: FRONTEND-DESIGN §5; NOTIFICATIONS §5; D-009; OPTIMISATION §5.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-153 | Installable web app with a manifest and a start page for each role | FRONTEND §5 | MVP | Designed |
| FR-154 | Install instructions for each platform. Push on iOS needs iOS 16.4 or later and the app added to the home screen | D-009; FRONTEND §5 | MVP | Designed |
| FR-155 | Browse-only before install, with booking gated behind install | OI-004 | MVP | **Gap** (OI-004 open; recommendation (b)) |
| FR-156 | App shell cached. Programme lists and manifests network-first, with a last-synced banner when offline. Payments, sign-in, refunds and admin actions never cached | FRONTEND §5; OPTIMISATION §5 | MVP | Designed |
| FR-157 | Marshal taps made offline are queued, shown as "waiting to send", and sent later under conflict rules | MAR-10; OI-046 | MVP | **Gap** (OI-046) |
| FR-158 | Updates are announced and applied on next open, never during duty | OPTIMISATION §5 | MVP | Designed |

### MOD-22 Platform operations

*Source: DEVOPS-PLAN §1, §5, §6, §9; BACKEND-DESIGN §4 and §7; ENVIRONMENT-VARIABLES.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-159 | Scheduled jobs: hold expiry (1 minute), notification dispatch (1 minute), reconciliation (10 minutes), booking window open and close, weekly digest, monthly retention | BACKEND-DESIGN §3 to §6; D-004 | CORE | Designed |
| FR-160 | Health endpoint and uptime checks on the public address | DEVOPS-PLAN §6 | MVP | Designed; tool open (OI-047) |
| FR-161 | Error tracking with no personal data or request bodies in logs | DEVOPS-PLAN §6; T16 | MVP | Designed; tool open (OI-047) |
| FR-162 | Backups: daily managed backups on Pro, or a scheduled encrypted off-platform dump on Free; a restore drill with counts | DEVOPS-PLAN §5; SYS-16; RISK-001; RISK-010 | MVP | **Gap** until the destination is chosen (OI-047) |
| FR-163 | Budget alerts at 50 and 80 percent of the monthly figure | DEVOPS-PLAN §9 | MVP | Designed |
| FR-164 | Staging with synthetic data only, reset monthly | DEVOPS-PLAN §1; TEST §5 | MVP | Designed |
| FR-165 | Booking windows, per-bus toggles and cutoffs are data, not code | ARCHITECTURE §5 | CORE | Decided |

### MOD-23 Accessibility, content and language

*Source: FRONTEND-DESIGN §4 and §6; NOTIFICATIONS §6.*

| ID | Requirement | Source | Tier | Status |
|---|---|---|---|---|
| FR-166 | WCAG 2.1 AA. Touch targets at least 44 by 44 CSS pixels. Input text at least 16 pixels | FRONTEND §6; MEM-36 | MVP | Designed; verified by axe and review |
| FR-167 | Plain language. Member-facing labels only; no internal state names | FRONTEND §4; NOTIFICATIONS §6 | MVP | Designed |
| FR-168 | Money in naira with thousands separator; dates and cut-offs in Africa/Lagos time | FRONTEND §6; SYS-13; A15 | MVP | Designed |
| FR-169 | English at launch | NOTIFICATIONS §6 | MVP | Decided |
| FR-170 | Skeleton loading states on screens that fetch data | FRONTEND §7 (demonstrated in the prototypes) | MVP | Designed |

---

## 6. Business rules in force

These are the decided rules that the build must follow. Each cites its decision. Any change is a reopen (AGENTS Part I §4).

| Rule | Value | Decision |
|---|---|---|
| Payments | Digital only, provider-hosted; no cash, POS or manual records | D-033 |
| Waiting list | In MVP. Guests who are first-timers first; then join time | D-030, D-034 |
| Offer window | Two hours | D-035 |
| Manifest lock | 30 minutes before departure | D-037 |
| Late additions after the lock | Administrator approval with reason | D-041 |
| Cancellation cutoff | 12 hours before departure; override per programme with reason | D-032 (department confirms, D10) |
| Price | One price per rider per programme, any leg | D-039 |
| Guests | No cap at launch; administrators monitor | D-040 |
| Special events | Admin-created; second administrator approves before bookings open | D-042 |
| Registration | Decided within 24 hours; reminder at 12 hours | D-044 |
| Record retention | Payments per finance period; attendance to counts after one year | D-043 (legal review OI-038) |
| Sign-in | Phone code and password for members and marshals; authenticator for administrators; magic link and Google later | D-029, D-052, D-056 |
| Free booking confirmation | Held until the marshal records a reached call and the member's confirmation | D-051 |
| Free booking hold end | 18:00 Lagos time the day before departure; a free booking made after that holds until the manifest lock | D-055 |
| Gender | Required; male or female; no decline option; used for reports only | D-057 |
| Marshal alerts | The app names the rider; SMS shows bus and count; three alerts added | D-053 |
| Public use | Pilot group first; all members after the 30-day review | D-054 |
| Notifications | Push and email; SMS for marshal critical alerts and sign-in codes; WhatsApp as links | D-009, D-028, D-010 (SMS reopened) |
| Booking states | Three axes: booking, payment, rider per leg | D-025 |
| No-show | Terminal state, separate from removed | D-008 |
| Marshal reassignment | Admin-triggered only | D-005 |
| Hosting | Vercel Pro and Supabase Free, with recorded risks | D-027 |
| Documents | Blue. Apps use one orange and yellow system | D-031, D-036 |
| Freeze | Documents frozen at version 1.0 after sign-off and reconvene | D-045 |
| Build order | Frontend first on frozen contracts, then backend | D-046 |
| Acceptance | The 116 criteria are the release test (MAR-21 added by D-051) | D-047, D-051 |
| Sign-off form | Interactive; no print layout | D-048 |
| Version control | Git; baseline tag `docs-baseline-2026-10-12`; freeze tag `docs-v1.0` | D-049 |

---

## 7. Non-functional requirements

| ID | Area | Requirement | Source |
|---|---|---|---|
| NFR-01 | Correctness | No overbooking under concurrency; seat counts derived from the ledger | SYS-01; ADR-0002 |
| NFR-02 | Money safety | No payment confirmed without a verified provider event; amounts from the server; no card data | D-023; PAYMENTS §1 and §8 |
| NFR-03 | Availability on duty day | The manifest works with poor signal (offline queue and printable manifest); last-synced time shown | R-007; OPTIMISATION §1 |
| NFR-04 | Performance | Largest contentful paint under 2.5 seconds on the home list on a mid-range Android over throttled 4G; hold request p95 under 800 ms from Lagos (to confirm); manifest tap visible under 300 ms; first member JavaScript under 200 KB compressed | OPTIMISATION §2 |
| NFR-05 | Security | Least privilege; RLS and functions enforce rules; service keys server-side only; admin second factor; audit append-only | THREAT-MODEL; AUTH-DESIGN §6 |
| NFR-06 | Privacy | Minimum personal data; no card, identity or location data; retention per DATA §4; processor terms accepted | THREAT-MODEL §5; OI-038 |
| NFR-07 | Accessibility | WCAG 2.1 AA; keyboard usable for administrator screens | FRONTEND §6 |
| NFR-08 | Recoverability | Recovery point: 24 hours on daily backups; the interval of the off-platform dump on Free. Recovery time: 4 hours (Recommendation, to confirm at the restore drill) | DEVOPS-PLAN §5; RISK-001 |
| NFR-09 | Observability | Correlation ID on every write; counts of failures by code; no personal data in logs | BACKEND-DESIGN §7 |
| NFR-10 | Cost | About $20 a month before SMS, email and domain (D-027); alerts at 50 and 80 percent | DEVOPS-PLAN §2 and §9 |
| NFR-11 | Maintainability | Anti-bloat ladder for every addition; review tags; each dependency recorded | AGENTS Part I §10; SKILLS |
| NFR-12 | Scalability | Designed for one congregation; scale work starts only when a trigger is observed | OPTIMISATION §8; D-022 |
| NFR-13 | Browser support | iOS 16.4 or later for push (sourced). Other browser versions are a Recommendation, not in the source documents, to be confirmed in task FE-F5-01 | D-009; FRONTEND §5 |

---

## 8. Department policies

The department must write these rules. The product holds a default only for a few weeks. Full detail and owners are in `GOVERNANCE/DEPARTMENT-POLICY-REGISTER.md`.

**Before the pilot (25 policies):** P-01 refunds; P-03 bus cancelled, broken down or replaced; P-04 late bus; P-05 overflow and bus choice; P-06 round-trip and leg rules; P-07 no-shows and removal; P-09 guests; P-10 membership changes; P-11 special-event changes; P-12 failed and late payments; P-13 prices, fees and waivers; P-14 marshal duty; P-15 incidents and emergencies; P-16 safeguarding of minors; P-17 accessibility; P-18 privacy notice; P-19 retention; P-20 register stewardship; P-21 corrections and disputes; P-22 admin and marshal access; P-23 support targets; P-24 communications; P-25 programme cancellation on the day; P-28 business continuity; P-29 financial controls.

**Before each feature's build (4 policies):** P-02 group refunds (before group refunds); P-08 booking limits and hold use (before the hold build); P-26 pickup and route changes; P-27 audit review.

**Status at this candidate:** none written. Sign-off items Q-028 to Q-032 are the first answers on the bus-day rules, and Q-035 asks for owners and draft dates for all 29.

**Rule while a policy is missing.** The feature stays off, or the most conservative rule applies: no automatic refund, no automatic penalty, administrator decides (policy register §4).

---

## 9. Acceptance criteria

The release test is `TESTING/ACCEPTANCE-CRITERIA.md` (D-047). Each criterion is Given, When, Then.

| Role | Criteria | Before pilot (P) | After pilot (L) |
|---|---|---|---|
| Members | 40 | 38 | 2 |
| Guests | 12 | 11 | 1 |
| Marshals | 21 | 20 | 1 |
| Administrators | 25 | 23 | 2 |
| Cross-cutting (system) | 18 | 18 | 0 |
| **Total** | **116** | **110** | **6** |

**Coverage check.** The 125 scenario rows are Decided (27), Designed (57), POLICY (39) or DECISION (2). Every POLICY row must be covered by a criterion or listed as deferred with its policy ID (D-047 consequence). That check is in the task plan (TST-22).

---

## 10. Roadmap and gates

The full plan is `ROADMAP/IMPLEMENTATION-TASKS.md`. Summary, following D-045 and D-046:

1. **Gate G0 (decisions).** Transport sign-off, technical reconvene (stack, seat hold, membership), the open BRD gaps (OI-043, OI-045 to OI-048) closed or deferred with a named owner, freeze.
2. **Frontend F0 to F5** on frozen contracts and a stand-in data layer: member, marshal, administrator, guest, accessibility and performance.
3. **Backend B0 to B5** on the same contracts: schema and security, holds and waiting list, payments, notifications, administrator functions, operations.
4. **Integration I0.** Stand-in removed; end-to-end suite on staging with synthetic data.
5. **Security acceptance** (THREAT-MODEL §7).
6. **User acceptance UAT-1 to UAT-4** with real marshals and administrators.
7. **Pilot gate.** Pilot scope (Q-027), pilot policies ratified, OI-038 outcome recorded.
8. **Public-use release gate** (task plan, PUB section; defined by OI-049).
9. **Launch and 30-day review.**

No calendar dates are set. Dates follow resourcing set by the sponsor (DEVELOPMENT-STRATEGY §10).

---

## 11. Risks

Full register: `RISK-ASSESSMENT.md`. Current risks that the build and the pilot must manage:

| ID | Risk | Mitigation in this plan |
|---|---|---|
| RISK-001 | No tested backup restore | DEP-10 and DEP-12; SYS-16 |
| RISK-009 | Supabase Free pauses after a quiet week | DEP-11; paused-project runbook (SYS-17) |
| RISK-010 | No automatic backups on Supabase Free | DEP-10: off-platform dump before any real data (OI-047) |
| RISK-011 | Members who depend on cash cannot pay under D-033 | P-12; pilot review; Liaison engagement before the pilot |
| RISK-012 | Guests displace members on full buses (no cap, first-timer priority) | Guest share reports (FR-131); review after the pilot |
| RISK-013 | Requirements lost between the BRD and the build (new, D-050) | Trace in section 13; module coverage in the task plan; change control |
| RISK-014 | A forced male or female choice may exclude a person or cause a privacy complaint (D-057) | Counsel review (SEC-25); pilot review |
| R-01 | Seat-hold hoarding | FR-54 (blocked with D-003) |
| R-02 | Group partial refunds | FR-83 (P-02) |
| R-03 | Bus does not run | FR-103 to FR-107; P-03 |
| R-04 | Missed webhook | FR-69 reconciliation |
| R-05 | Waiting list undefined | Closed by D-030 |
| R-06 | Cutoff boundary | Closed by D-032 (Lagos time, SYS-13) |
| R-07 | Marshal phone fails | FR-95 printable manifest; FR-156 offline |
| R-08 | Account sharing | FR-07, FR-08; approval by administrator |
| R-09 | Lost phone before Sunday | Lookup by reference and name on duty (RISK-ASSESSMENT R-09); task FE-F2-09 |
| R-10 | Administrator misconduct | FR-134 to FR-138 audit and digest |
| R-11 | Notifications off | FR-108 inbox always; marshal fallback comms (P-28) |
| R-12 | Cash proof gap | Closed by D-033 (no manual payments) |

---

## 12. Open issues

Status of all open issues. Owners and gates are in the decision log register. "Blocks" names the stage that cannot close until the issue does.

| ID | Issue | Blocks | Decision owner |
|---|---|---|---|
| OI-001 | Stack, seat hold, membership gate (reconvene) | Every engineering stage | Original respondents |
| OI-002 | Proof-of-payment upload | Closed (D-033) | Sponsor |
| OI-003 | Mutability and immutability of entities | Schema lock (B0) | Security lead; PM |
| OI-004 | Browse-only before install | F0 install flow | UI/UX; PM |
| OI-005 | Backup strategy | Production data (RISK-001) | DevOps |
| OI-006 | "Contribution quota" meaning (assumed rate limiting) | Rate limits (SEC-06) | Sponsor |
| OI-007 | Insurance meaning (assumed backup only) | Launch (separate leadership item) | PM; Liaison |
| OI-008 | Multi-product readiness (namespace now) | Schema lock | Database lead |
| OI-009 | Context object | Audit first pass | Sponsor; Backend |
| OI-010 | Mail service | Closed (AgentMail) | Closed |
| OI-011 | Data science contract | Analytics (empirical) | DS; Database |
| OI-012 | Correction and dispute authority | Corrections (B4) | Security lead; PM |
| OI-013 | Audit review cadence | Launch | Security lead; PM |
| OI-014 | At least two trained administrators | Pilot | Sponsor; Liaison |
| OI-015 | Register steward and refresh cadence | Roster import; pilot | Liaison; Sponsor |
| OI-016 | Retirement paths for entities | Schema lock | Database lead |
| OI-017 | Hold abuse limits | Hold build (with D-003) | Respondents |
| OI-018 | Group partial refunds | Refund build | Sponsor |
| OI-019 | Day-of exception flows | Incidents (B4) | PM; Sponsor |
| OI-020 | Missed webhook reconciliation | Payment go-live | Integrations |
| OI-021 | Waiting list policy | Closed (D-030) | Closed |
| OI-022 | Cancellation cutoff boundary | Closed as default (D-032) | Sponsor |
| OI-023 | Cash versus no cash | Closed (D-033) | Closed |
| OI-024 | Special-event governance | Event screens (F3) | PM; Sponsor |
| OI-025 | Paystack, OPay or both | Payment build | Integrations; Sponsor |
| OI-026 | Support channel model | Support build; SLA | Department; Sponsor |
| OI-027 | Canonical state machine | Backend schema | PM; Backend |
| OI-028 | Registration governance | Registration build (F1) | Department; PM |
| OI-029 | Where webhooks and jobs run | Payment build | Backend lead |
| OI-030 | Hosting cost versus terms | Closed (D-027) | Sponsor |
| OI-031 | SMS channel | Sign-in; alerts (B3) | Sponsor; Integrations |
| OI-032 | Region for Lagos latency | Production project creation | DevOps |
| OI-033 | Provider contracts verified in sandbox | Payment build | Integrations |
| OI-034 | Design system | Closed for apps and documents (D-031, D-036) | Closed |
| OI-035 | Test tooling | CI build | QA |
| OI-036 | Refund policy drafting | Refund build | Department; Sponsor |
| OI-037 | WhatsApp deep links only (Business API in Phase 2) | Support links; confirmation by Sponsor | Sponsor |
| OI-038 | Data protection review | Pilot (blocking) | Sponsor with counsel |
| OI-039 | Staff authentication enrolment | Staff onboarding | Security lead |
| OI-040 | Pilot scope and UAT | Pilot gate | PM; Sponsor |
| OI-041 | Marshal call before confirmation | Decided (D-051) | Sponsor (Q-036 answered) |
| OI-042 | Member fields: gender and password decided; other required fields open | B0 profiles (other fields) | Department |
| OI-043 | Programme end time, venue, description, transport flag; pickup times | B0 schema lock; F3 | PM; Database lead |
| OI-044 | Notification gaps and marshal alert content | Decided (D-053); SMS vendor under OI-031 | Sponsor (Q-038 answered) |
| OI-045 | Screens missing from the route map | F0 route shell | PM; Frontend lead |
| OI-046 | Offline marshal taps and conflicts | F2 offline queue | Backend lead; Department |
| OI-047 | Backup destination, error tracking, uptime, email, SMS vendor, key custody | Production data; staging monitoring | DevOps lead |
| OI-048 | Report and finance definitions | F3 reports; pilot | Data Science; finance contact |
| OI-049 | Meaning of "public use" | Decided (D-054) | Sponsor (Q-039 answered) |
| OI-050 | Hold length for unconfirmed free bookings | Decided (D-055) | Sponsor (Q-040 answered) |

---

## 13. BRD trace

Every BRD section and numbered requirement, traced to this PRD. Status: **Covered**, **Covered with change** (a later decision supersedes the BRD wording), **Gap** (open issue), **Policy** (department rule needed), **Blocked** (reconvene decision needed).

| BRD ref | Requirement (short) | PRD | Status |
|---|---|---|---|
| §2 | Purpose: central platform for church transport | §1; all modules | Covered |
| §3 | Business problems (counts, bus plans, paid tracking, history, reports) | §1 success measures; MOD-06, MOD-16 | Covered |
| §4.1 | Member (register, book, pay, cancel) | MOD-01 to MOD-03, MOD-07 | Covered |
| §4.2 | Marshal (passengers, contact, confirm) | MOD-11, MOD-12 | Covered (confirm: D-051) |
| §4.3 | Administrator (programmes, routes, buses, marshals, payments, reports) | MOD-04 to MOD-10, MOD-16 to MOD-19 | Covered |
| §5 | Programme fields: name, date, start, end, description, routes, capacity, window, transport flag, payment, fee, any day | FR-21 to FR-28 | **Gap**: end time, description, transport flag (OI-043) |
| §6 | Registration: full name, phone, email | FR-07 | Covered |
| §6 | Registration: gender | FR-07, FR-133 | Covered (D-057: male or female, required) |
| §6 | Registration: password | FR-06 | Covered (D-056: password next to phone code) |
| §6 | Registration: Google | FR-03 | Covered (deployment) |
| §6 | Registration: other member information | None | **Gap** (OI-042) |
| §6 | Identify existing users, avoid duplicates | FR-11, FR-14 | **Blocked** (D-007) |
| §7 | Login; existing profile available | FR-01, FR-04 | Covered; profile screen **Gap** (OI-045) |
| §8 | Programme list: name, date, time, location, payment | FR-21, FR-23 | **Gap**: location (OI-043) |
| §9 | Route: name, pickup point, pickup time, capacity, fee | FR-29, FR-30, FR-36 | **Gap**: pickup time (OI-043) |
| §10 | Booking steps; free booking; paid to payment | FR-40, FR-43, FR-44 | Covered (free booking waits for the marshal, D-051) |
| §11 | Payment steps: fee, initiate, process, confirm, reference, status, booking update | FR-65 to FR-74 | Covered (provider choice open: OI-025) |
| §11 | Payment statuses: pending, successful, failed, cancelled, refunded | FR-73 | Covered with mapping |
| §11 | Paid bookings not confirmed until payment | FR-44 | Covered |
| §12 | Flow: Booked, Marshal Contacted, Confirmed, Boarded | FR-43, FR-46, FR-93 | Covered (D-051) |
| §13 | Marshal notified on new booking with name, phone, programme, date, route, payment, status | FR-111, FR-115 | Covered with change (D-053): the app names the rider and reference; full detail on the duty list; SMS shows bus and count |
| §14 | Marshal dashboard: programmes, passengers, filter by route, contacts, status, confirm or cancel, payment status | FR-86, FR-92, FR-93, FR-96, FR-98 | Covered (confirm: D-051) |
| §15 | Capacity: track, reduce on booking, increase on cancel, prevent when full | FR-35 to FR-38 | Covered |
| §15 | Waitlist in a later phase | FR-55 to FR-64 | **Covered with change** (D-030) |
| §16 | Cancellation within the permitted period; refund per policy; automated or manual | FR-52, FR-53, FR-77 to FR-82 | Policy (P-01) |
| §17 | Programme report: totals, confirmed, cancelled, no-shows | FR-126 | Covered (report screen: OI-045) |
| §17 | Demographics: male, female, first-time, returning | FR-127, FR-133 | Covered (D-057) |
| §17 | Routes: most and least popular, passengers per route, utilisation | FR-128 | Covered; definitions (OI-048) |
| §17 | Payments: expected, received, successful, failed, pending, refunds | FR-84, FR-129 | Covered; definitions (OI-048) |
| §18 | Member notifications: registration, booking received, payment successful and failed, confirmed, cancelled, programme reminder | FR-115, FR-116 | Covered (D-053 adds the programme reminder) |
| §18 | Marshal notifications: new booking, cancellation, booking requiring confirmation, payment-related update | FR-111, FR-115 | Covered (D-051, D-053) |
| §19 | Authentication, member protection, restricted access, authorised admin, secure payment, audit trail | MOD-01, MOD-17, MOD-20; NFR-05, NFR-06 | Covered |
| Journey A | First-time member | FR-07 to FR-10 | Covered |
| Journey B | Returning member | FR-40 to FR-47 | Covered (D-051, D-055) |
| Journey C | Member cancellation (added by the PRD draft) | FR-52, FR-53 | Covered; policy P-01 |
| Journey D | Marshal journey | MOD-11, MOD-12 | Covered |
| Journey E | Administrator journey | MOD-04, MOD-05, MOD-18 | Covered |
| Requirement 1 | Pickup location shows date and time once chosen | FR-30 | **Gap** (OI-043) |
| Requirement 2 | Every pickup location has a pickup time | FR-30 | **Gap** (OI-043) |
| Requirement 3 | Administrator updates programmes from a dashboard | FR-23, FR-25 | Covered |
| Requirement 4 | "Booking has been closed" when full | FR-49 | **Covered with change**: full buses go to the waiting list (D-030) |
| Requirement 5 | Seats left shown | FR-36 | Covered |
| Requirement 6 | Sunday booking opens Friday 18:00 | FR-21 | Covered |
| Requirement 7 | Paid amount shown in bold | FR-50 | Covered |
| Requirement 8 | Marshal has the list of riders | FR-86 | Covered |
| Requirement 9 | Marshal alerts only for own route or pickup | FR-111 | Covered (SYS-11) |
| Requirement 10 | Marshal dashboard: Booked, contacted, confirmed | FR-93 | Covered (D-051) |
| Requirement 11 | Booking and confirmed booking are different | FR-43, FR-46 | Covered (D-051; the BRD rule is kept) |
| Requirement 12 | Marshal cancels; seats update automatically | FR-98, FR-35 | Covered |
| Requirement 13 | Immediate acknowledgement | FR-42 | Covered |

**Result.** Every BRD section and numbered requirement has a row. Rows marked Gap, Blocked or Policy cannot be built to the BRD wording yet; each names the open issue or policy that closes it. Rows marked Covered with change follow a decision that replaces the BRD wording. This table is the check for drift: if a row's status changes, this section changes with it.

---

## 14. Assumptions and design findings

**Assumptions.** Each is to be confirmed by its owner before the stage that relies on it.

| ID | Assumption | Owner | Source |
|---|---|---|---|
| A-01 | Outbound and return seats are counted separately | Transport Department | PROGRAMMES §2 (not yet asked) |
| A-02 | A live waiting-list offer holds its seats until accepted or expired | Backend lead; Sponsor | D-035; Q-025 (recommended answer, not yet recorded as answered) |
| A-03 | Seat hold lasts 15 minutes | Reconvene | D-003 (blocked, OI-001) |
| A-04 | Support response targets | Department | SUPPORT §4; D-042 |
| A-05 | Quiet hours 22:00 to 05:00 | Department | NOTIFICATIONS §4 (proposal) |
| A-06 | Refund cutoff 12 hours | Department | D-032; D10 |
| A-07 | Retention windows | Finance office; Sponsor | DATA §4; D-043 |
| A-08 | The finance contact has no app role; access will be set under P-22 | Sponsor | D-042 |
| A-09 | Recovery objectives: 24-hour recovery point; 4-hour recovery time | DevOps | NFR-08 (recommendation) |
| A-10 | Staging tier: Pro or Free | Sponsor | DEVOPS-PLAN §1 recommends Pro for staging; OI-030 accepts Free for staging only. Decide at G0 |

**Design findings** (the design documents themselves, not the BRD):

- The route map (FRONTEND-DESIGN §2) omits several screens (OI-045).
- SCOPE Journey B4a confirmed free bookings at once, which conflicted with BRD requirement 11. D-051 restores the BRD rule. SCOPE Journey B4a and STATE-MACHINES §1 are updated to match.
- The `hold_seats` draft (BACKEND-DESIGN §2) states that the idempotency check must compare input hashes and return `DUPLICATE` on reuse. That is not in the draft. Task BE-B1-02 covers it.
- `programmes` has no end time, description, venue or transport flag; `pickup_points` has no pickup time (OI-043).
- No role is defined for the finance contact (A-08).
- Marshal alerts in the design named no riders, while BRD §13 names them. D-053 resolves this.
- The offline queue for marshal taps has no conflict rule (OI-046).

---

## 15. Approval

Not signed. The freeze (D-045) requires the sponsor's approval and the product manager's record of it. The signed version becomes `PRD-v1.0.md`. This candidate stays in the folder as history.

| Role | Name | Date | Decision reference |
|---|---|---|---|
| Executive Product Sponsor | _to be completed at the freeze_ | _ | D-045 |
| Product Manager | _to be completed at the freeze_ | _ | D-045 |

---

## CONTEXT CAPSULE

```text
PRODUCT:
TCN Ikorodu Transport Booking & Management App

MY ROLE:
Product Manager (PRD author)

MY DOMAIN:
Requirements, traceability, scope, acceptance linkage

DECISIONS LOCKED (in force):
D-025, D-027 to D-049, D-051 to D-057 (see section 6)
PROPOSED: D-024 (stack, ratification at OI-001), D-050 (this candidate)

NEW REQUIREMENTS (classified, pending decision):
OI-041, OI-049 decided; OI-042 and OI-044 partly decided; OI-050 decided (section 13). Open: OI-043, OI-045 to OI-048

CONSTRAINTS:
Single congregation (no multi-tenant). PWA only (D-009). Digital payment only (D-033).
Frontend first on frozen contracts (D-046). Freeze after sign-off and reconvene (D-045).

RISKS:
RISK-001, RISK-009 to RISK-013 (section 11), R-01 to R-12

DEPENDENCIES:
OI-001 (reconvene) blocks engineering. OI-038 blocks pilot. OI-049 blocks public use.

CHANGES REQUIRED AFTER SIGN-OFF:
Mark PRD root draft superseded. Create PRD-v1.0.md from this candidate. Apply Batch 8 answers.

DELIVERABLE:
DOCS/PRD/PRD-v1.0-CANDIDATE.md and DOCS/ROADMAP/IMPLEMENTATION-TASKS.md

DOWNSTREAM AGENT:
Executive Product Sponsor (approval); Frontend and Backend leads (build from frozen set)

DOWNSTREAM ACTION:
Name owners for OI-043 and OI-045 to OI-048. Confirm A-01 to A-10, and the 18:00 rule (D-055) at the freeze. Build the password policy (D-056).

OPEN ISSUES:
OI-001, OI-004, OI-005, OI-015, OI-017, OI-019, OI-020, OI-025, OI-033, OI-036, OI-038,
OI-040, OI-043, OI-045 to OI-048

STATUS:
READY WITH CONDITIONS (not frozen; blocked from binding until D-045 conditions are met)
```
