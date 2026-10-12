# QA Log: Questions, Options, Answers

**Status:** Live · **Started:** 2026-10-12 · **Owner:** Product Manager
**Purpose:** Every multiple-choice question put to the sponsor or a domain owner is recorded here before it is asked, and its answer is recorded when given. Decisions in `PM-DECISION-LOG-AND-ROADMAP.md` cite the `Q-` IDs that support them. Rule: `CONVENTIONS/README.md` §5.

**Precedent:** `software-engineer-questions.md` (earlier four-question round on programme/route/bus model, stack, seat-hold and booking window) predates this log. Its answers are carried into the decision log as D-001, D-002, D-003 and D-004. Its questions are reproduced in Batch 0 below for traceability.

---

## Batch 0: Earlier round (pre-log, recovered from `software-engineer-questions.md`)

| Q | Question | Options | Recorded outcome |
|---|---|---|---|
| Q-000a | Programme, route and bus relationship | A: one route, one bus · B: route with multiple buses (capacity is sum) · C: buses attached to programme | **B** → D-001 |
| Q-000b | Build stack | A: Next.js + Supabase · B: FastAPI + React + Postgres · C: Next.js frontend + FastAPI backend | **Split respondent answers (B vs A).** Blocked → D-002, OI-001 |
| Q-000c | Seat protection during payment | A: TTL hold on booking start · B: decrement on payment success · C: decrement on booking, manual cleanup | **Split respondent answers (C vs A).** Blocked → D-003 |
| Q-000d | Booking window automation | A: scheduler/cron · B: on-demand time check · C: manual admin toggle | **A** → D-004 |

---

## Batch 1: Ratify the stack direction and the launch constraints

**Asked:** 2026-10-12 · **Trigger:** Sponsor direction "supabase and typescript", and the Vercel/Supabase deployment question. Vendor terms were checked the same day (see `DEVOPS/DEVOPS-PLAN.md` §2).

### Q-001: How should the Supabase + TypeScript direction be ratified?
**Recommended:** B

| Option | Consequence |
|---|---|
| A. Sponsor accepts now; respondents only confirm | Fastest. Respects sponsor authority, but D-012 says the original respondents decide, so this may need a reopen later. |
| **B. Recorded as sponsor direction; respondents ratify at the OI-001 reconvene** ★ | Matches D-012. No schema or API work starts until the reconvene confirms. Docs can proceed in the meantime. |
| C. Hold all stack-dependent documents until the reconvene | Cleanest audit trail, but stalls the design artifacts the team needs. |
| D. Choose a different stack | Only if the reconvene finds a material constraint. |

### Q-002: Production hosting budget, given Vercel Hobby cannot be used for payment processing
**Recommended:** A (see OI-030)

Vercel's fair-use terms restrict Hobby to non-commercial personal use and list "requesting or processing payment from visitors" as commercial. This app processes member payments, so production frontend needs a Pro plan.

| Option | Monthly cost (approx.) | Consequence |
|---|---|---|
| **A. Vercel Pro + Supabase Pro** ★ | About $45 before SMS, email and domain | Terms-compliant. Daily backups (7 days). Projects are never paused for inactivity. Meets RISK-001 backups. |
| B. Vercel Pro + Supabase Free | About $20 | Cheaper. Free projects pause after 1 week of low activity, which is a real risk for a weekly-use app. No automatic backups, so RISK-001 needs a manual dump process. |
| C. Free frontend host (to be verified for terms) + Supabase Free | $0 | Keeps the $0 posture. Needs terms verification and has the same pausing and backup risks as B. |

### Q-003: Marshal critical alerts (boarding list changes, bus-no-show, urgent incidents): which channel at MVP?
**Recommended:** B (see OI-031)

The PRD recommends push plus SMS for marshal alerts. Decision D-010 places SMS in Phase 2 under the $0 posture. These conflict.

| Option | Consequence |
|---|---|
| A. Push only | Free. Depends on the marshal having the installed app open or notifications on. |
| **B. Push and email at MVP; in-app alert queue; SMS added in Phase 2 unless the pilot shows missed alerts** ★ | Matches D-010. Pilot measures delivery and triggers SMS if needed. |
| C. Push plus SMS at MVP | Matches the PRD. Adds recurring cost and reopens D-010. Needs a D-010 reopen. |

### Q-004: How do members, marshals and admins sign in?
**Recommended:** B (see AUTH/AUTH-DESIGN.md)

Members must be church members (AUTH-1). Google sign-in proves identity, not membership, per the meeting minutes.

| Option | Consequence |
|---|---|
| A. Google sign-in for everyone | Free and simple. Members without Google cannot join. Still needs the membership gate. |
| **B. Phone-number OTP for members and marshals; Google optional; email plus mandatory second factor for admins** ★ | Phone matches how the church already identifies people. OTP has an SMS cost (see OI-031). Admins get stronger protection. |
| C. Email and password for everyone | Cheapest. Weakest for a congregation that uses phones and rarely email. |

---

### Q-005: Placeholder folders found in DOCS (AGENTS, IP, ISSUES, MEMORY, PRD, PROGRESS-LOGS, TASK-LOGS)
**Recommended:** B
**Context:** Seven empty folders exist in `DOCS/`. They were not created by the documentation pass. Each has a README with a consolidation proposal. `REQUIRED-RESOURCES/` is populated and kept.

| Option | Consequence |
|---|---|
| A. Remove the seven folders now | Clean tree. Removal is destructive, so it needs explicit confirmation per folder. |
| **B. Keep the folders, each with its README; consolidate and remove later when the owner confirms** ★ | No deletion risk. Some clutter stays until confirmed. |
| C. Keep all, and fill each with real content now | Most content, most review load. Several folders duplicate existing documents. |

---

## Answers

| Q | Answer | Date | Recorded in |
|---|---|---|---|
| Q-001 | **Ratify at reconvene** (recommended) | 2026-10-12 | D-024 status; START-CHECKLIST A3 |
| Q-002 | **Vercel Pro + Supabase Free** (not the recommended option A) | 2026-10-12 | D-027; OI-030; RISK-009, RISK-010 |
| Q-003 | **Push + SMS at MVP** (not the recommended option B; reopens D-010) | 2026-10-12 | D-028; OI-031 |
| Q-004 | **Other:** phone OTP and admin TOTP; Google sign-in also offered, integrated at deployment; Google button shown in the UI | 2026-10-12 | D-029; OI-039; AUTH-DESIGN §2 |
| Q-005 | Pending | | |

**Notes on the answers**

- Q-002: the sponsor's choice is recorded as made. Supabase Free carries two risks that must be managed until the pilot gate: projects pause after a week of low activity, and no automatic backups exist. Mitigations are in DEVOPS-PLAN §5 and in RISK-009 and RISK-010.
- Q-003: this reopens D-010 for SMS only. Vendor choice and cost stay open under OI-031.
- Q-004: the answer adds Google sign-in as a method. Integration waits for deployment, per the sponsor. The button label and logo must follow Google's branding rules at integration (to verify).

---

## Batch 2: Cash, overflow, cancellation cutoff, design system

**Asked:** 2026-10-12 (logged before asking, per D-026).

### Q-006: What does "no cash payment" mean for the launch?
**Recommended:** B (see OI-023)

| Option | Consequence |
|---|---|
| A. Fully digital; no cash in any form | Retires D-021. Admin cannot record cash. Members who pay only by cash are excluded. |
| **B. No cash handling at the bus; office and bank-transfer payments recorded by admin** ★ | Keeps the manual-record path for admin only. No marshal cash handling. Records carry a reference. |
| C. Cash paid at the bus and recorded by the marshal (D-021 as proposed) | Contradicts "no cash". Needs a marshal cash process and reconciliation. |

### Q-007: When every bus on a programme is full, what happens?
**Recommended:** C (see PROGRAMMES-LEGS-GUESTS §3, OI-021)

| Option | Consequence |
|---|---|
| A. Refuse with a clear message and the contact route | Simple. Demand beyond capacity is lost. |
| B. Waitlist | Out of MVP scope (OI-021). Would need its own state machine. |
| **C. Admin adds an extra bus; if none is possible, refuse** ★ | Uses the admin-triggered assignment (D-005). Needs a spare bus or marshal. |
| D. Priority rule: members before guests, then first come | Fairer to members. Needs a visible rule and an override with reason. |

### Q-008: Which visual system does the production app use?
**Recommended:** B (see OI-034)

| Option | Consequence |
|---|---|
| A. Orange for the role apps, blue for documents | Two identities. Documents and app can look unrelated. |
| **B. One blue system across apps and documents** ★ | One identity. Prototypes remain walkthrough artifacts. |
| C. One orange system across apps and documents | One identity, but the church-facing spec must be redesigned. |

### Q-009: When does the cancellation cutoff for refunds fall?
**Recommended:** A (see OI-022, OI-036)

| Option | Consequence |
|---|---|
| **A. Departure time minus 12 hours** ★ | Fair to evening programmes. Easy to test. Needs the department to confirm the number. |
| B. Midnight before the programme date | Simple to explain. Gives early-morning departures almost no window. |
| C. Set per programme by admin, default 12 hours | Flexible. Adds a configuration every admin must understand. |

---

### Answers, Batch 2 (2026-10-12)

| Q | Answer | Recorded in |
|---|---|---|
| Q-006 | **Other:** no physical cash; every payment is digital through Paystack and/or OPay; no POS | D-033 (retires D-021); closes OI-023 and OI-002; RISK-011 |
| Q-007 | **Other:** waitlist first; marshal notified to add a bus; marshal contacts admin; admin finds a solution; waitlisted riders notified by push and text to rebook. Priority: guests first, then members. Guests are first-timers | D-030 (reverses the BRD §15 deferral and the OI-021 recommendation) |
| Q-008 | **One orange system** (not the recommended option) | D-031 (apps); documents: see Q-012 and D-036 |
| Q-009 | **Set per programme, default 12 hours** | D-032 (default 12 hours before departure; admin override with reason) |

**Clarifications raised by these answers (to ask in Batch 3):**

- **Q-010:** Are "guests" in the priority rule the same as first-timers, or does the rule cover all guests of members? Does the church-facing specification also move to the orange system, or does it stay blue as first requested?
- **Q-011:** What is the offer window for a waitlisted rider to rebook (proposal: two hours; to confirm with the department)?

---

## Batch 3: Waitlist priority, offer window, document colour, manifest lock

**Asked:** 2026-10-12 (logged before asking, per D-026).

### Q-010: Who counts as a "guest" for waitlist priority (guests before members)?
**Recommended:** A (see D-030)

| Option | Consequence |
|---|---|
| **A. Guests who are first-timers only** ★ | Matches the sponsor's words. Members' own guests who are not first-timers would queue with members. |
| B. All guests, including members' guests | Wider priority. Members' household guests would rank ahead of members. |
| C. First-timers and all guests, both ahead of members | Simplest to explain, but the widest displacement of members. |

### Q-011: How long does a waitlisted rider have to accept an offer?
**Recommended:** B (see D-030, OI-021)

| Option | Consequence |
|---|---|
| A. 30 minutes | Fast turnover of seats. Tight for people away from their phone. |
| **B. 2 hours** ★ | Balances turnover and time to respond. Proposal; to confirm with the department. |
| C. Until two hours before departure | Maximum time to respond. Seats may stay unused until late. |
| D. Admin sets per programme | Flexible. Admins must know the rule for each event. |

### Q-012: Do the church-facing specification and meeting notes stay blue?
**Recommended:** A (see D-031)

| Option | Consequence |
|---|---|
| **A. Stay blue (your earlier instruction for the specification)** ★ | The app is orange; the documents are blue. Two identities, as chosen for the apps (Q-008). |
| B. Move all documents to orange | One identity. Requires redesigning the specification, which you asked to be blue. |
| C. Blue for the church-facing specification, orange for internal notes | Keeps the church document blue and matches internal notes to the app. |

### Q-013: When does the boarding list lock before departure?
**Recommended:** C (see OI-038 family and STATE-MACHINES §2)

| Option | Consequence |
|---|---|
| A. 30 minutes before departure | Late additions get little time to be checked. |
| B. At departure | Simple. Walk-ons after departure need an exception path. |
| **C. One hour before departure** ★ | Gives marshals time to resolve no-shows and walk-ons before the bus leaves. |
| D. Two hours before departure | Earliest certainty. Blocks late valid riders and walk-ons. |

---

### Answers, Batch 3 (2026-10-12)

| Q | Answer | Recorded in |
|---|---|---|
| Q-010 | **First-timer guests only** (recommended) | D-034 |
| Q-011 | **2 hours** (recommended) | D-035 |
| Q-012 | **Stay blue** (recommended) | D-036 |
| Q-013 | **30 minutes before departure** (not the recommended one-hour lock) | D-037 |

**Consequence of Q-013.** Thirty minutes is short for marshals to resolve late additions. The rider list is fixed at the lock. Additions after the lock need admin approval with a reason. This is recorded in D-037 and STATE-MACHINES §2.

---

## Batch 4: Refund policy, pricing by leg, guest caps, walk-ons after the lock

**Asked:** 2026-10-12 (logged before asking, per D-026).

### Q-014: Who drafts the refund policy (OI-036), and when?
**Recommended:** A (see OI-036)

| Option | Consequence |
|---|---|
| **A. PM drafts a first version with explicit decision points; department amends** ★ | Gives the department a draft to react to rather than a blank page. Needs a set date for the draft. |
| B. Department drafts from scratch | Owned fully by the department. Slowest; refund build waits. |
| C. Sponsor drafts | Fast, but policy ownership sits with the sponsor rather than the department that will run it. |
| D. Defer; manual refunds only until the policy is ratified after the pilot | No automation until the policy exists. Refunds stay admin-approved and provider-referenced (D-006). |

### Q-015: What price does a round-trip or return-only rider pay?
**Recommended:** A (see PAYMENTS-DESIGN §2)

| Option | Consequence |
|---|---|
| **A. One price per rider per programme, whatever the leg** ★ | Simple to explain and to test. A return-only rider pays the same as a round-trip rider. |
| B. Round trip full price; return-only half price | Fairer to people who travel one way. Adds a second price per programme. |
| C. Price set per leg | Most flexible. Doubles configuration and confuses members. |
| D. Return-only is free | Generous. Needs a funding decision and a clear rule for who qualifies. |

### Q-016: How many guests may one member bring per programme?
**Recommended:** B (see OI-028)

| Option | Consequence |
|---|---|
| A. 2 guests | Tight for families. Fair to other members. |
| **B. 3 guests, reviewed after the pilot** ★ | Starting point with a visible review point. |
| C. 5 guests | Generous. Larger buses fill with guests before members (see D-034). |
| D. No cap; admin monitors | No limit to enforce. Harder to defend when seats run short. |

### Q-017: How are riders added after the manifest lock (D-037)?
**Recommended:** A (see D-037)

| Option | Consequence |
|---|---|
| **A. Marshal asks admin; admin approves in the app with a reason; the approval is logged** ★ | Keeps the audit trail intact. Depends on admin availability on the day. |
| B. Marshal adds the rider with a reason; admin reviews afterwards | Fast at the bus. Admin oversight is after the event, which is weaker control. |
| C. No additions after the lock; the rider travels on the next bus | Clear rule. Frustrating for people who arrive late but were booked. |
| D. Marshal may add up to a set number per bus | Practical. Needs a limit and a reason for each. |

---

### Answers, Batch 4 (2026-10-12)

| Q | Answer | Recorded in |
|---|---|---|
| Q-014 | **Department drafts from scratch** (not the recommended option) | D-038 |
| Q-015 | **One price per rider** (recommended) | D-039 |
| Q-016 | **No cap; admin monitors** (not the recommended option) | D-040 (risk RISK-012) |
| Q-017 | **Marshal asks admin; admin approves in the app; logged** (recommended) | D-041 |

---

## Batch 5: Support owners, special-event approval, record retention, registration turnaround

**Asked:** 2026-10-12 (logged before asking, per D-026).

### Q-018: Who owns each support category, and what response target applies?
**Recommended:** B (see SUPPORT/SUPPORT-SYSTEM §2, OI-026)

| Option | Consequence |
|---|---|
| A. Admin owns every category, using the proposed targets | One queue. The admin is a single point of failure (OI-014). |
| **B. Admin owns bookings and travel incidents; payment problems go to the sponsor's finance contact; app bugs go to the developer through the admin** ★ | Clear owners per category. Needs a named finance contact. |
| C. Transport office owns bookings; sponsor owns payments and refunds; admin owns bugs | Three owners. Clear for refunds, slower for bugs. |
| D. Owners set per category by the department later | Defers the decision; reports sit unowned until then (authority vacuum). |

### Q-019: Who can open a special event for booking?
**Recommended:** C (see PRODUCT/PROGRAMMES-LEGS-GUESTS §1, OI-024)

| Option | Consequence |
|---|---|
| A. Admin creates and opens booking; no second check | Fast. One person can open a paid event with no review. |
| B. Admin creates; sponsor approves each event before publishing | Strong control. Slows every event. |
| **C. Admin creates; a second admin approves before booking opens** ★ | Two-person control for paid events. Requires two trained admins (OI-014). |
| D. Department creates; admin operates | Clear split of duties. Adds a role to the app. |

### Q-020: How long are attendance and payment records kept?
**Recommended:** A (see DATA-MODEL §4, OI-038)

| Option | Consequence |
|---|---|
| **A. Payment records for the accounting period the finance office sets; attendance reduced to counts after one programme year** ★ | Keeps money records for disputes. Limits personal data. Needs the finance period from the church. |
| B. Keep everything indefinitely | Simple. Growing personal data with no purpose after a time. |
| C. Delete everything after one year | Minimal data. Loses dispute evidence for payments. |
| D. Finance office sets all periods, including attendance | Clear owner. Attendance period decided without the transport department. |

### Q-021: How quickly must a first-timer registration be decided?
**Recommended:** A (see AUTH-DESIGN §3, OI-028)

| Option | Consequence |
|---|---|
| **A. Within 24 hours; reminder to the admin after 12 hours** ★ | Most first-timers can attend the next programme. Needs an admin on rota. |
| B. Within 48 hours | Fewer admin alerts. Many registrations miss the next programme. |
| C. Decided before the cutoff for the next programme | Tied to programme schedule. Last-minute pressure on admin. |
| D. No target; admin discretion | Simple. No protection against a registration that waits for weeks. |

---

### Answers, Batch 5 (2026-10-12)

| Q | Answer | Recorded in |
|---|---|---|
| Q-018 | **Split by category** (recommended): admin for bookings and incidents; a finance contact named by the church for payments; app bugs through the admin to the developer | D-042 |
| Q-019 | **Second admin approves** before booking opens (recommended) | D-042 |
| Q-020 | **Payments kept per finance period; attendance reduced to counts after one year** (recommended) | D-043 |
| Q-021 | **24 hours, admin reminder at 12 hours** (recommended) | D-044 |

**Open from these answers:** the church must name the finance contact and the finance period (START-CHECKLIST D13, D14). Two trained admins are needed for approvals (OI-014).

---

## Batch 6: Questions sent by mail (2026-10-12)

**Asked:** 2026-10-12, by mail through the local mirror (`DOCS/MAIL/`). Logged here as required by D-026. These are open questions, not multiple-choice, so each lists the recommended answer.

| Q | To | Question | Recommended answer | Mail thread |
|---|---|---|---|---|
| Q-022 | Liaison | Who in the department owns each policy in the register, and when can the first draft be ready? Who is the finance contact and the finance period? Who is the second admin? | Owners for the pilot-critical policies named now; drafts dated; refund draft date set (D-038) | THREAD-f06631f5 (`LIAISON/`) |
| Q-023 | Liaison | Eight scenario checks: E01 (late bus), E02 (bus does not come), D11 (no-show), A04 (round trip, one leg full), B13 (multi-bus route), F04 (Friday registration), E17 (children without guardian), C12 (no digital payment) | Answers reflect what happens today; the register uses them to choose defaults | THREAD-4d94526b (`LIAISON/`) |
| Q-024 | Secretary | Two reconvene sessions (technical; policy) in Lagos time | Two proposed slots each; sponsor confirms | THREAD-ecc4c711 (`SECRETARY/`) |
| Q-025 | Backend | Should an open waiting-list offer hold its seats until it expires or is accepted? Is the 15-minute hold still right alongside the 2-hour offer? Is the every-minute scheduler load acceptable on the free plan? | Yes, hold the seats for the offer window; the two timers are independent; load acceptable at this scale (verify) | THREAD-2ce4446e (`BACKEND/`) |
| Q-026 | Data science | Metric definitions for guest share per bus, members moved behind first-timer guests, and late additions after the lock (RISK-012) | Definitions in the next reply; no personal fields | Appended to THREAD-9636e9f0 (`PM/`) |

**Other mail sent without a question to answer:** decisions for backend, database, UI/UX and the full team (`D`/`M` types); a scenario review request to QA (`R`); a prototype change list to the full stack engineer (`Q`, task); routed items for security, DevOps, frontend and integrations (THREAD-243c66e8, through the PM inbox).

---

## Batch 7: Transport sign-off pack (2026-10-12)

**Issued:** 2026-10-12 as `DOCS/SIGN-OFF/TRANSPORT-SIGN-OFF-PACK.html` (eleven A4 pages). Logged before issue, per D-026. Multiple-choice items are Q-027 to Q-032; the rest of the pack asks for confirmation and information, logged as Q-033 to Q-035.

### Multiple-choice items (pages 08 and 09)

| Q | Question | Options | Recommended | Policy ref |
|---|---|---|---|---|
| Q-027 | Which programme is the pilot? | A. Next Sunday service only; B. One special event first; C. Sunday service first, then one special event | C | OI-040 |
| Q-028 | How long does a late bus wait? | A. Leaves on time; B. Waits up to 10 minutes; C. Waits up to 20 minutes; D. Marshal decides with the administrator | B | P-04 |
| Q-029 | Round trip, one leg full: what can the rider book? | A. Nothing; B. The open leg only, the full leg on the waiting list; C. Both legs only when both are open | B | P-06 |
| Q-030 | What are waiting riders told if no bus can be found? | A. No seat, contact if a bus is added; B. Same, plus refund offer after the window; C. Administrator phones each rider | A | P-05 |
| Q-031 | Consequence of repeated no-shows | A. Recorded only; B. Warning after three in twelve months; C. Booking limit; D. Decide after the pilot | B | P-07 |
| Q-032 | The church cancels a bus: what is offered? | A. Place on next bus, no refund unless asked; B. Refund offered automatically, another bus optional; C. Refund only; D. Administrator decides each case | B | P-03 |

### Confirmation and information items (pages 03, 05, 06 and 07)

| Q | Request | Recommended answer | Pack page |
|---|---|---|---|
| Q-033 | Confirm rules R1 to R10 (digital payment only; 30-minute lock; 12-hour cutoff; waiting-list priority and 2-hour window; no guest cap; one price per rider; second approval for events; 24-hour registration; department drafts refund policy) | Agree to all ten | 03 |
| Q-034 | Information: buses and capacities; routes and pickups; marshals; two administrators; finance contact and period; register steward; calendar; contact numbers; ticket name; step-free needs; children travelling | Given, or dated "to follow" | 05 |
| Q-035 | Owner and draft date for each of the 25 pilot policies and the 4 build policies | Owner named for each; drafts dated | 06, 07, 09 |

**Status:** Issued as an interactive form (D-048). No answers yet. Q-022 and Q-023 (liaison mail, Batch 6) remain open alongside these.

---

## Open questions queued for later batches

Batch 4: answered (see above).
Batch 5: answered (above). Still to verify at deployment: Google button branding (Verify, D-029).
