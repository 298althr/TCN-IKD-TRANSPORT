# Meeting Minutes: Systems Scope & Open Deliberation

**Project:** TCN Ikorodu Transport Booking & Management App
**Meeting type:** Decision review (Phase 1) + Scope expansion (Phase 2)
**Prepared for:** Team review — open deliberation and colTeamoration
**Status:** Draft for discussion — contains unresolved conflicts and open questions, flagged explicitly throughout

> **Superseded as Decision Log of record by `PM-DECISION-LOG-AND-ROADMAP.md`.** This document remains the narrative/raw-notes history. Formal Decision Records, the Open-Issue Register, and scope classification (CORE/MVP/PHASE 2/FUTURE/OUT OF SCOPE) now live in that document — check there first for current status before acting on anything below.

---

## 0. Purpose of this document

Phase 1 answered 8 infrastructure/development decisions (data model, stack, seat-holding, scheduling, Marshal reassignment, refunds, duplicate signups, no-show tracking). Those are necessary but not sufficient — they describe *how the system is built*, not *what the system must do* for every stakeholder-facing system (payment, notifications, auth, storage, database, admin control) or the cross-cutting concerns (security, audit, roles, immutability) that sit underneath all of them.

This document:
1. Reviews the two Phase 1 response sets and flags where they **disagree** — these need a final call before build starts.
2. Converts the raw meeting notes into **formal requirements per system**, each with **optimization opportunities**.
3. Confirms the dashboard count and ownership.
4. Lists everything **raised but not yet resolved**, as open items for the Team session.
5. Answers the direct technical question asked in the meeting (cPanel deployment feasibility).

---

## 1. Phase 1 Decision Review — Two Response Sets

Two sets of answers came back. Five of eight decisions agree. **Three disagree** and must be resolved before Phase 2 work starts, because they change the data model and payment logic directly.

| # | Decision | Ms/Mrs Adetutu | Mr. Isaac | Status |
|---|---|---|---|---|
| 01 | Route ↔ Bus model | B — a route can have multiple buses | B — a route can have multiple buses | ✅ **Agreed** |
| 02 | Technology stack | B — FastAPI + React + Postgres | A — Next.js + Supabase | ⚠️ **Conflict** |
| 03 | Seat protection during payment | B — decrement only on payment success | A — TTL hold on booking start | ⚠️ **Conflict** |
| 04 | Booking-window automation | A — scheduler/cron | A — scheduler/cron | ✅ **Agreed** |
| 05 | Marshal reassignment | A — admin reassigns the route | A — admin reassigns the route | ✅ **Agreed** |
| 06 | Refund automation | A — fully automatic via Paystack | A — fully automatic via Paystack | ✅ **Agreed** |
| 07 | Duplicate registration | C — block the new signup completely | A — auto-merge on email/Google ID match | ⚠️ **Conflict** |
| 08 | No-show tracking | A — first-class tracked status | A — first-class tracked status | ✅ **Agreed** |

### Why the three conflicts matter

- **Stack (02):** This is not a minor preference — it determines the repository layout, hosting bill, and who on the team can maintain the code. It cannot be "a bit of both" without taking on the highest-overhead option (two languages) by default. **Needs one explicit answer.**
- **Seat protection (03):** B (decrement on success) is simpler but allows two people to both pay for the last seat, requiring a refund to fix after the fact. A (TTL hold) prevents that but adds an expiry mechanism. This directly affects how trustworthy "seats left" is to a member looking at the app. **Needs one explicit answer.**
- **Duplicate signups (07):** C (block outright) protects data integrity but risks locking out a real returning member who, say, changed their phone number. A (auto-merge) is more forgiving but merges are hard to undo if the match is wrong. Given the "church members only" gate requirement raised later in the same meeting (Section 3.3), this decision and the authentication gate decision are now linked and should be resolved together.

**Action for the Team:** pick one final answer for 02, 03, and 07 before Phase 2 build begins. Everything in this document after this point is written to be compatible with either outcome, but the data model (Section 3.5) cannot be finalized until 02 and 03 are settled.

---

## 2. Why the scope is expanding

The 8 Phase 1 decisions were infrastructure/engineering decisions — they assumed the *what* (BRD/PRD feature list) was already settled and only asked *how to build it*. The follow-up meeting surfaced that several **whole systems were never scoped at all**: notifications, file storage, and the full shape of authentication, plus cross-cutting concerns (security, audit, roles, immutability) that the original BRD touched only briefly in Section 19.

It also surfaced that **today's actual process** is fully manual and WhatsApp-based:

> "Right now it is fully manual, done on WhatsApp. Payment is made to admin and sent via WhatsApp, and admin notes down the name."

This is the baseline the system replaces. Every system below is framed against that baseline, with what's being automated and what decision is still needed.

We now also know there will be **at least two dashboards, likely three**:

| Dashboard | Who | Status |
|---|---|---|
| **Member/User Dashboard** | Congregation members | Confirmed — booking, payment, bulk booking, receipts |
| **Admin Dashboard** | Transport Administrator | Confirmed — programme/route/bus control, reports, refund oversight, audit |
| **Marshal Dashboard** | Transport Marshals | Already scoped in BRD §14 — confirm as separate from Admin, sharing the same data layer per PRD §5 |

---

## 3. System-by-System Breakdown

Each system below follows the same structure: **what was said in the meeting → formal requirement → optimization opportunities → open questions for the Team.**

### 3.1 Payment System

**Raw meeting input:**
> "We need to develop a payment system. We need to get payment APIs. Sunday bookings are free. Payments are only during special programmes. A user can book for multiple people. The person that makes bulk payment for other people must have membership, and they must be tagged to the bulk payment. The payer is the host for the bulk payment and must be shown on the receipt to the beneficiary. Refund can only happen before the day of the event."

**Formal requirements:**

| ID | Requirement |
|---|---|
| PAY-1 | Payment is never required for Sunday service — only for designated "special programmes" (programme-level flag, already in BRD §5). |
| PAY-2 | Integrate a Nigerian payment gateway — **Paystack**, per Phase 1 Decision 06. Requires a registered merchant account and API keys before any integration work starts. |
| PAY-3 | **Bulk booking/payment**: one authenticated, verified member (the "host") can book and pay for multiple people (the "beneficiaries") in a single transaction. |
| PAY-4 | Every beneficiary in a bulk booking must be explicitly tagged to the host's payment record — not just counted as extra seats. |
| PAY-5 | Receipts must show the **host as payer** and each **beneficiary by name**, so a beneficiary who never touched the payment still has valid proof of a confirmed seat. |
| PAY-6 | Refunds are only permitted **strictly before the programme date** — same-day/day-of cancellations are not refundable. This is a firmer rule than the BRD's general "refund policy" language and should supersede it. |
| PAY-7 | Refund execution is fully automatic via the Paystack refund API (Decision 06), gated by PAY-6's eligibility window. |

**Optimization opportunities:**
- **Idempotency keys** on every payment and refund call — prevents double-charges or double-refunds if a network retry happens, which is a common real-world failure mode with payment APIs.
- **Webhook-first reconciliation**: let Paystack's webhook be the source of truth for payment status rather than polling or trusting the client's "payment done" signal — closes the exact gap flagged in the PRD's edge case #2 (payment mid-flight vs. cancellation).
- **Store money in kobo (integer), not naira (float)** — standard practice to avoid rounding errors compounding across bulk-payment splits.
- **Data-model consequence (important):** the original booking lifecycle assumed one Payment ↔ one Booking. Bulk payment breaks that assumption — one Payment must now relate to **many** Bookings (one per beneficiary). This needs a `BookingGroup` (or `PartyBooking`) entity sitting between Payment and Booking. **This changes Decision 01's schema and must be folded back in before the data model is finalized.**
- **Guest beneficiaries**: consider allowing a beneficiary to exist as a lightweight record (name + phone, no login) rather than forcing every person a host brings along to register — matches real behavior (a member brings family/visitors) and reduces registration friction, while still letting the host be the accountable, verified party.

**Open questions for the Team:**
- Does a beneficiary ever need their *own* login later (e.g. to self-manage a future booking), or do they stay permanently tied to whichever host paid for them?
- What happens if a host wants to cancel one beneficiary out of a group booking but keep the rest? (Not yet specified.)

---

### 3.2 Notifications System

**Raw meeting input:**
> "What is requiring notification, why? How are they notified? No budget for these yet. We need to determine the way the notifications will be sent."

**Follow-up, remembered after the fact:**
> "We talked about using push notifications and email to communicate with users. Since we're starting with a PWA, we must use push notifications. We want to optimize the experience — the sound, the design, the layout, the palette — and end up with a canonical documentation for it. We'll use a forced-PWA-install strategy: one door from the landing page that collects/installs the app before the user can view it, as our alternative to an App Store/Play Store listing."

**Status: partially resolved.** Channel and distribution mechanism are now decided; budget-gated extras (SMS/WhatsApp) remain open.

**Formal requirements:**

| ID | Requirement |
|---|---|
| NOT-1 | Every notification-triggering event from BRD §18 still applies (registration success, booking received, payment success/fail, booking confirmed/cancelled, programme reminder for members; new booking, cancellation, confirmation-required, payment-related update for Marshals). |
| NOT-2 | **Starting channel set is now confirmed: Web Push + Email**, both free, both native to the PWA direction already set in the PRD. SMS/WhatsApp stay deferred under the zero-budget constraint, to be revisited once real notification volume is measured. |
| NOT-3 | Web Push requires a service worker and an explicit browser permission grant. On **iOS Safari (16.4+)**, the Push API is only available **after** the app has been added to the home screen — meaning install is a technical prerequisite for push, not just a UX preference. |
| NOT-4 | **Forced PWA install strategy**: the landing page is the single "front door." Before the user reaches any functional screen, they're walked through installing the app (Add to Home Screen). This is the project's deliberate substitute for an App Store/Play Store listing — one link, one install step, no app-store review process. |
| NOT-5 | Because push is now a core, confirmed experience rather than a future nice-to-have, its **sound, visual design (icon/badge/actions), layout, and color palette** need deliberate design and sign-off — not left to browser defaults. |

**Optimization opportunities:**
- **Platform split on the install step is mandatory, not optional.** Android/desktop Chrome/Edge expose a programmatic install prompt (`beforeinstallprompt`); iOS Safari does not — it requires manual "Share → Add to Home Screen" instructions shown as in-app guidance. The forced-install screen must detect platform and branch accordingly.
- **Graceful fallback for push-incapable browsers.** Older iOS Safari (pre-16.4) and some Android WebViews cannot receive Web Push at all. Decide now whether those users are still forced through the install screen (for a consistent app-like experience) or routed to an email-only path — don't let this surface as an unhandled edge case post-launch.
- **Treat the forced-install screen as a funnel, with drop-off measured from day one.** "Forced install before access" is a real adoption risk for a congregation used to opening a WhatsApp link — instrument it early rather than assuming compliance.
- **Quiet-hours and grouping rules belong in MVP, not a later budget tier** — these are code decisions, not spend decisions. E.g. no push between ~9pm–7am; collapse multiple "seat update" pushes into one instead of spamming.
- **Fixed push categories, not one-off designs per feature**: Booking, Payment, Marshal Alert, Reminder — each with its own icon, (optional) sound, and priority, defined once and reused everywhere a notification fires.
- **Canonical deliverable**: a single **"Notification & PWA Experience" design-system document** — install-flow screens (per platform), permission-prompt copy, the push notification visual template (icon/title/body/action buttons), sound decision (including explicitly "silent, vibration only" as a valid choice), and the palette extended to notification badges/icons. Every future notification added to the product should follow this doc instead of being designed ad hoc. Owner: UI/UX Designer, with the Backend/Systems Engineer supplying the final event list (NOT-1).

**Open questions for the Team:**
- Does "forced install" block *all* functionality pre-install, or is there a read-only/browse mode (e.g. view programmes) before booking/payment gets gated behind install?
- Who owns the notification *budget* decision for the eventual SMS/WhatsApp tier — is ₦0/month indefinite, or just for MVP?
- Is WhatsApp Business API still worth evaluating as a post-MVP addition given push+email is now the confirmed baseline, or fully shelved?

---

### 3.3 Authentication System

**Raw meeting input:**
> "How are users onboarded? It should be for only church members. What is the gate, to prevent hacking into the system or database? We need more control and privacy."

**Formal requirements:**

| ID | Requirement |
|---|---|
| AUTH-1 | Only congregation members may hold an account that can book transport — this is a **membership gate**, not just a login screen. |
| AUTH-2 | The gate mechanism itself is undecided — needs to be one of: (a) admin pre-loads the known membership roll and signup matches against it, (b) open self-signup followed by admin approval before the account can book, (c) invite-code distributed through existing church channels. |
| AUTH-3 | Standard security hardening regardless of gate choice: hashed passwords (bcrypt/argon2), HTTPS-only, session/token expiry, login rate-limiting. |
| AUTH-4 | Google OAuth (BRD §6) proves *identity*, not *membership* — if OAuth is offered, it must still pass through the same membership gate, otherwise anyone with a Google account could register. |

**Optimization opportunities:**
- **Pre-loaded roll + self-activation** is the strongest fit for "church members only" without creating an approval bottleneck: Admin enters/uploads the known membership list (name + phone) ahead of time; a new signup must match an entry on that list to activate. This directly resolves Decision 07's duplicate-signup conflict too — if the roll is the source of truth, "duplicate" becomes "matches an existing roll entry," which is a much cleaner rule than guessing from email/phone alone.
- **Separate the login system from the permission system.** Member, Marshal, and Admin should authenticate through the same mechanism but be authorized through an explicit role table — never by convention or hardcoded checks scattered through the code.
- **Defense in depth on "prevent hacking into the database":** the application API should be the *only* path to the database — no direct public DB access ever. If the chosen database supports it (e.g. Postgres Row-Level Security), add that as a second enforcement layer behind the API, not instead of it.

**Open questions for the Team:**
- Does "church members only" mean the entire congregation roll, or a specific registered subset (e.g. only those who've formally joined, vs. regular attendees)?
- Who is allowed to edit the membership roll — only Admin, or also designated church office staff?

---

### 3.4 File Storage System

**Raw meeting input:** not explicitly discussed as its own topic, but implied by receipts, bulk-payment proof, and the manual WhatsApp-screenshot-based payment evidence currently in use. **This system was missed in both the BRD and PRD and is being raised for the first time here.**

**Formal requirement so far:**
- FS-1 *(provisional — needs scope confirmation)*: the system needs to store or generate: payment receipts, and possibly member profile photos or programme banner images.

**Optimization opportunities:**
- **Generate receipts on demand, don't store them.** A PDF receipt can be rendered from the underlying Payment/Booking/BookingGroup data every time it's requested, instead of storing a static file per transaction — removes storage cost and keeps the receipt always accurate to the latest record.
- **Any file that does need storing (profile photos, programme banners) should go to object storage** (e.g. Supabase Storage, Cloudflare R2) rather than the app server's own disk — most modern hosting (Vercel, Render, etc.) has no persistent local disk, so this isn't optional once a hosting choice is made.

**Open questions for the Team:**
- Is there still a need to upload a manual payment proof (e.g. a bank transfer screenshot) as a fallback path, for the cases Paystack doesn't cover? If yes, that's a real file-storage requirement, not just receipts.

---

### 3.5 Database System

**Raw meeting input:**
> "Admin sets bookings to accept per bus. Total seats are calculated across the number of buses. We need to develop the management system."

**Formal requirements:**

| ID | Requirement |
|---|---|
| DB-1 | Confirms Phase 1 Decision 01 (B): a route's total seat count is the **sum of capacities of every bus assigned to that route** for a given programme. |
| DB-2 | Admin must be able to open/close booking **per individual bus**, not only per route — e.g. close one bus on a route while a second bus on the same route still accepts bookings. |

**Optimization opportunities:**
- **Model Bus as independent of Route**, joined through a `route_buses` table (route_id, bus_id, per-bus capacity, per-bus open/closed flag). This supports DB-2 directly and allows a bus to be reassigned between routes or programmes without duplicating records.
- **Snapshot capacity per programme, not just live on the route.** If bus assignment changes between programmes, historical reports must reflect what capacity *actually existed* on the day, not what the route is configured as today. Store a point-in-time capacity snapshot per programme instance.
- This section **depends on Decision 02 and 03 being resolved** (Section 1) before the schema is finalized — stack choice affects whether this is a Postgres schema with RLS (Supabase) or a plain FastAPI/SQLAlchemy model (self-managed Postgres).

---

### 3.6 Admin Management System

**Raw meeting input:** covered partly above (per-bus accept/reject toggle) and partly already specified in BRD §5/§14.

**Formal requirements:**
- Full CRUD on Programme, Route, Bus, Marshal assignment (already in BRD §5) — now explicitly includes the per-bus capacity toggle (DB-2 above).
- A true **Admin Dashboard**, distinct from the Marshal Dashboard, per Section 2's dashboard table.

**Optimization opportunities:**
- Build the open/close-capacity action as **one shared function** callable from both the automatic scheduler (Decision 04) and a manual admin override — not two separate code paths that could drift out of sync. This is the same principle the PRD already flagged for cancellation (PRD §6, edge case 3) — apply it here too.

---

### 3.7 Contribution Quota & Rate-Limiting System

**Raw meeting input:**
> "We need to use a contribution quota system that uses profiles and assigns available quota to prevent overworking. We need to calculate workrate and allowed quota to determine their use rights per time, to determine rate limits applied for security and infrastructure insurance."

**This is ambiguous and needs a reading check before design starts.** Two genuinely different systems fit this description:
1. **System/API rate-limiting by profile** (Member, Host, Marshal, Admin) — each profile gets a calculated action quota per time window, protecting infrastructure cost and acting as an abuse control (e.g. stopping a compromised account from mass-booking or mass-cancelling seats out from under real members).
2. **Internal team workload/contribution tracking** — a people-ops concept, tracking how much a human contributor (Backend Engineer, Designer, etc.) is doing to avoid burnout.

Given this was raised in the same breath as "rate limits... for security and infrastructure," interpretation (1) is treated as the working assumption below. Interpretation (2) is named so it isn't silently dropped if that's actually what was meant.

**Formal requirements (working assumption: system rate-limiting):**

| ID | Requirement |
|---|---|
| RATE-1 | Every profile type (Member, Host/bulk-payer, Marshal, Admin) has a defined action quota per time window — e.g. max bookings/cancellations per hour, max bulk-booking size per transaction, max login attempts per minute. |
| RATE-2 | Quota must be derived from an actual observed "workrate" baseline (how often does a normal member realistically book?), not an arbitrary guessed number — guessing wrong throttles legitimate use. |
| RATE-3 | Breaching quota triggers a defined, tiered response: soft (slowdown/CAPTCHA) → hard (temporary lock + Admin notified) — every throttle event logged to the audit trail (ties to OI-003). |

**Optimization opportunities:**
- Start with deliberately generous defaults so no real Member or Marshal ever hits them under normal use; tighten only if abuse is actually observed.
- Enforce at the API gateway/middleware layer once, consistently, regardless of which dashboard the request comes from — same "one shared function" principle already applied to cancellation (PRD §6) and capacity toggles (§3.6 above).
- Keep **security rate limits** (login attempts, requests/sec — infrastructure protection) conceptually separate from **business quotas** (bookings/week, bulk-booking size — fairness/capacity protection) even if they share a mechanism — don't collapse two different concerns into one config.
- Philosophically, this is the same shape as the seat-hold decision (Decision 03) — both are time-boxed resource claims. Worth designing with one shared pattern rather than as two unrelated systems.

**Open questions for the Team:**
- **Confirm the interpretation** — system/API rate-limiting (assumed above) or human contributor workload tracking? These need completely different owners and designs.
- What's the actual unit of "workrate" — requests/minute, bookings/week, something else?
- Do Marshals/Admins get higher limits than Members by default, given they legitimately act on many passengers' behalf?

---

### 3.8 Data Insurance & Backup / Disaster-Recovery System

**Raw meeting input:**
> "We also talked about the insurance system, the backup system, in case of breaches or crashes."

This formalizes **RISK-001** (already logged in `PM-DECISION-LOG-AND-ROADMAP.md` as the no-backup-under-$0-budget risk) into a full system, and separates two different failure modes that need different responses: a **crash** (infrastructure/data loss — fixed by restoring) and a **breach** (unauthorized access — fixed by containment and assessment *before* any restore).

**Formal requirements:**

| ID | Requirement |
|---|---|
| INS-1 | Automated database backup on a defined schedule (e.g. daily), retained for a defined window (e.g. 30 days), stored off the primary server. |
| INS-2 | A documented, **tested** restore procedure — an untested backup is a hope, not a backup. |
| INS-3 | Separate response procedures for crash (restore from backup) vs. breach (contain → revoke credentials/rotate secrets → assess exposure via the audit trail → notify → *then* consider restore). |
| INS-4 | "Insurance" may also mean literal financial/cyber-insurance coverage, not only technical backup/DR — flagging both readings since the raw note doesn't disambiguate. |

**Optimization opportunities:**
- Zero-cost first pass consistent with the $0-launch budget posture (Decision Log D-010): a scheduled `pg_dump`-equivalent to a free-tier object-storage bucket, encrypted at rest — already the direction recommended for RISK-001.
- Store backups in a **different account/region than production** — a breach that compromises Admin credentials shouldn't also be able to delete the backups.
- A quarterly "fire drill" — actually restoring a backup into a scratch environment — is nearly free and is the only way INS-2 is actually true rather than assumed.
- Because card data is never stored directly (PRD's PCI-scope-reduction decision — Paystack holds that, tokenized), a church-side breach's realistic exposure is booking/member data, not payment-card data — which meaningfully narrows what a breach-notification process has to cover.

**Open questions for the Team:**
- Is a literal cyber-insurance/liability policy worth investigating (a procurement question for church leadership), separate from the technical backup/DR work (DevOps)?
- Who is responsible for deciding *if and how* members are notified in the event of an actual breach?

---

### 3.9 Multi-Product Shared Database Readiness

**Raw meeting input:**
> "In case we want to ship more products onto a shared database."

A forward-looking architectural constraint, not a current feature — classified **Future**, but worth a cheap design decision now rather than an expensive retrofit later.

**Formal requirement (provisional):**
- MULTI-1: If additional church products are ever built to share this database/infrastructure, the schema should assume **product isolation from day one** (e.g. a clear schema/table-naming boundary such as `transport.bookings`, not a bare `bookings` table claiming the whole database namespace).

**Optimization opportunities:**
- The only thing worth doing *today*: namespace tables under a clear prefix/schema now — near-zero cost as a single-product app, expensive to retrofit once a second product's tables could collide with this one's.
- Keep **membership/identity** (who is a church member) as a schema boundary logically separate from **transport-specific data** (bookings, routes, buses) — a second product would almost certainly want to reuse "who is a member" rather than reinvent it.
- Do **not** build actual multi-tenancy infrastructure now (connection routing, per-tenant quotas, tenant-aware RLS policies) — that's real engineering cost for a hypothetical product that may never exist. The schema-naming discipline above is the entire scope of "readiness" for now.

**Open questions for the Team:**
- Is a second product actually planned, or is this purely speculative? That answer decides whether this stays Future or needs a real design review now.

---

### 3.10 Context Management System

**Raw meeting input:**
> "We also need to develop the context management system."

**The vaguest item raised — no supporting detail was given.** Rather than guess at one specific design, three candidate readings, most to least likely given the rest of this project's shape:

1. **Request/event context** — a standard object carrying *who is acting, as what role, on whose behalf, for which programme/booking* through every layer of the backend. This is standard infrastructure, and it's the natural home for the host→beneficiary "acting on behalf of" relationship already identified in §3.1 (PAY-3/PAY-4) — instead of that relationship being modeled only inside the Payment system, it belongs in a shared context object that Payment, Booking, Notification, and Audit all read from.
2. **Operational/business context propagation** — every audit-log entry (OI-003) and notification (Decision D-009) needs consistent metadata (which programme, which role, which device/session) to be meaningful. This overlaps heavily with (1) and is likely the same underlying need.
3. **Conversational/support context** — relevant only if a chat or AI-assisted support surface is planned. Nothing else in the BRD, PRD, or this meeting's notes suggests that exists anywhere in scope — weakest candidate, named only so it isn't silently assumed away.

**Working assumption: (1) and (2) combined** — a single context object attached consistently to every write action, audit entry, and notification trigger.

**Formal requirement (provisional):**
- CTX-1: Define one standard context object (actor identity, active role, acting-on-behalf-of if applicable, programme/booking reference, timestamp, device/session) attached to every write action, audit-log entry, and notification trigger — rather than each system (Booking, Payment, Notification, Audit) inventing its own ad hoc version of "who did this and why."

**Optimization opportunities:**
- Build once as shared Backend middleware, not per-feature — the same Single Source of Truth principle already applied elsewhere in this project.
- This directly feeds OI-003 (the audit/immutability work) — the audit trail is only as good as the context attached to each entry, so this and OI-003 should be designed by the same owner in the same pass, not sequentially.

**Open questions for the Team:**
- **Confirm the interpretation** at the next session before any design work starts — flagged explicitly rather than built on a guess, since the raw note gave no supporting detail at all.

---

## 4. Raised but Not Yet Resolved — Open Items for the Team

These were named in the meeting as gaps in the product philosophy, without being scoped yet. Listed here as **discussion prompts**, not answers, since the meeting explicitly asked for Team-wide deliberation on them.

| Topic | What needs deciding |
|---|---|
| **Security system** | Beyond login: secrets management, dependency scanning, rate limiting on public endpoints, PCI scope reduction (never store card data — delegate fully to Paystack's tokenized flow). |
| **Audit system** | An append-only log of who changed what and when — booking status changes, payment status changes, admin edits, refund approvals. Does it need to be visible to Admin only, or exportable for church leadership review? |
| **User management system** | Admin's ability to search/view/deactivate members, manage the Marshal roster, and resolve duplicate-registration flags (ties directly to Decision 07). |
| **Roles & relationships management** | Formal roles (Member / Marshal / Admin) plus relationships that aren't roles but still need modeling: host → beneficiary (bulk payment), Marshal → Route (assignment). Should these be explicit tables, or derived? |
| **Immutable systems** | Which records, once created, should never be edited — only appended to or superseded (payment records, audit logs, booking-status history)? Which records should stay freely editable (member profile, draft programme details)? No list exists yet — needs one, entity by entity. |
| **Workflow confirmation** | The journeys drafted in the BRD/PRD (first-time member, returning member, Marshal, Admin, cancellation) were written before this meeting's manual-process detail and bulk-payment flow were known. They need a revision pass — particularly Journey C (cancellation), which must now reflect the "refund only before event day" rule (PAY-6), and the booking journeys, which must now show the bulk-booking/host-beneficiary path as a distinct branch. The first-time-member journey also now needs a **forced-install step** inserted right after "Open App," before registration (§3.2, NOT-4). |
| **Notification & PWA Experience canonical doc** | Channel (push + email) and distribution strategy (forced PWA install) are decided (§3.2) — the sound, visual template, palette, and per-platform install copy are not yet designed. Needs its own design-system document before any notification ships, so every future addition follows one standard. |
| **Contribution quota / rate-limiting interpretation** (§3.7) | Needs a plain confirmation: system/API rate-limiting by profile, or human contributor workload tracking? Different owners, different designs. |
| **Insurance scope** (§3.8) | Needs a split: technical backup/DR (DevOps, can start now at $0 cost) vs. literal cyber-insurance policy (church leadership procurement question). |
| **Multi-product database readiness** (§3.9) | Is a second product actually planned? Decides whether schema-naming discipline is applied now or this stays purely Future. |
| **Context management system interpretation** (§3.10) | No supporting detail was given at all — needs direct clarification before any design work starts. |

---

## 5. Direct Answer — Can cPanel be used to deploy this app?

**Short answer: technically sometimes, practically not recommended at this app's scale and architecture.**

- **Shared cPanel hosting** (the common/cheap kind) is built around Apache/LiteSpeed serving PHP + MySQL. It can run Node.js apps through cPanel's "Setup Node.js App" (Phusion Passenger) feature *if* the host supports it, and can run Python WSGI apps through "Setup Python App" — but **FastAPI is an ASGI framework**, and shared-host Python support is typically WSGI-only, so FastAPI would need extra adaptation that most shared cPanel plans don't support cleanly.
- **Realtime features** (Supabase Realtime, WebSockets for live seat updates) generally **do not work on shared cPanel** — no persistent socket support, no custom process control.
- **Scheduler/cron** (Decision 04) is supported on cPanel, but only at coarse granularity (commonly 5-minute minimum) and with limited reliability guarantees compared to a dedicated job runner.
- **cPanel on a VPS** (i.e., a VPS with cPanel/WHM installed for convenience, where you still have root access) *is* workable — but at that point you're really running a self-managed VPS with a GUI layer, and you could just as easily skip the cPanel license cost and deploy directly.

**Recommendation:** given the stack options actually on the table (Next.js+Supabase+Vercel, or FastAPI+React+Postgres), a managed platform (Vercel, Render, Railway, Fly.io — all have generous free/cheap tiers matching the PRD's cost analysis) is a better fit than cPanel for this app. cPanel is worth revisiting only if there's a sunk-cost hosting plan already paid for — worth confirming whether that's the case before ruling it out completely.

### 5.1 Follow-up — If we go the self-managed VPS route instead

Raised as a direct follow-up: if a private VPS is already available, cPanel is not required to "self-manage" it — a bare VPS is self-managed by default. cPanel only adds a licensed GUI layer (multi-account hosting, email, Passenger app manager) that this project doesn't need, and its default Apache setup actively competes with Docker for ports 80/443. **Recommendation: skip cPanel on the VPS.**

**Docker vs. GitHub Actions CI/CD is not an either/or** — they solve different problems and are normally combined:
- **Docker** packages the app + exact runtime into a portable image → environment consistency.
- **GitHub Actions** automates what happens on push (test → build → ship) → deploy automation.

**Recommended reference setup**, independent of whichever stack wins Decision 02:

```
Ubuntu LTS (VPS) → Docker Engine + Docker Compose
  ├─ app container(s) — built from a Dockerfile
  ├─ Postgres container — or a managed Postgres instance instead (see tradeoff below)
  └─ Caddy (reverse proxy) — automatic HTTPS

GitHub Actions on push to main:
  1. run tests → 2. build + tag image by git SHA → 3. push to GHCR → 4. SSH to VPS, docker compose pull && up -d
```

Why this over plain rsync-and-restart: versioned, rollback-able deploys and no drift between what's in git and what's actually installed on the box.

**Tradeoff to decide alongside Decision 02:** a self-hosted Postgres container has no automatic backups — that has to be built (cron `pg_dump` + off-box storage). A managed Postgres (Supabase, RDS, DO Managed DB) includes backups/failover for a small monthly fee. This is a real cost/effort difference between the two stack options, not just a deployment detail.

---

## 6. Action Items

1. **Resolve the three conflicting decisions** (stack, seat-hold strategy, duplicate-signup handling) — Section 1. These block the database schema.
2. **Decide the membership-gate mechanism** (Section 3.3) — this also resolves the duplicate-signup conflict if the "pre-loaded roll" approach is adopted.
3. **Confirm file storage scope** (Section 3.4) — specifically whether manual payment-proof upload is still needed as a fallback.
4. ~~Pick a notification channel strategy~~ — **Decided**: Web Push + Email, via a forced PWA install flow (Section 3.2, NOT-2/NOT-4). SMS/WhatsApp remain open for later.
5. **Fold the bulk-payment `BookingGroup` entity into the data model** (Section 3.1) before schema work starts — this was not in the original BRD/PRD and changes Decision 01's design.
6. **Revise the journey maps** to reflect the refund-before-event-day rule, the host/beneficiary bulk-booking path, and the new forced-install step in the first-time-member journey (Section 4, Workflow confirmation).
7. **Team session**: work through Section 4's six open topics (security, audit, user management, roles/relationships, immutability, notification & PWA design doc) and produce a position on each.
8. **Confirm or rule out cPanel** (Section 5) based on whether hosting is already paid for elsewhere.
9. **Produce the canonical "Notification & PWA Experience" design-system doc** (Section 3.2) — sound, push visual template, palette, per-platform install-flow copy. Owner: UI/UX Designer + Backend/Systems Engineer (event list).

---

## 7. Appendix — Current Manual Process (As-Is, for reference)

As stated in the meeting, this is what the system is replacing:

1. A member messages the Admin on WhatsApp to request transport for a programme.
2. If the programme requires payment, the member sends payment directly to the Admin (bank transfer), and sends proof via WhatsApp.
3. The Admin manually writes down the member's name against the programme/route.
4. There is no persistent digital record beyond the WhatsApp chat history, no seat-count enforcement, and no Marshal-level visibility until pickup day.

Every system above exists to replace one piece of this chain with something trackable, reportable, and auditable — this appendix is the baseline to measure "is this actually better" against once the app ships.
