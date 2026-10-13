# PM Decision Log, Open-Issue Register & Scope Roadmap

**Product:** TCN Ikorodu Transport Booking & Management App
**Prepared by:** Product Manager / Product Owner
**Status:** v1 — READY WITH CONDITIONS (see Open Issues)
**Supersedes-as-source-of-truth:** the flat decision table in `MEETING-MINUTES-02-Systems-Scope.md` §1 and §4 — those remain valid narrative context, but **this document is now the canonical Decision Log and Open-Issue Register** going forward (single source of truth principle). New decisions get recorded here, not re-litigated in the minutes.

---

## 0. Sponsor Inputs Incorporated

| Question | Answer | Effect on this document |
|---|---|---|
| Tie-breaking authority | Respondents reconvene (not delegated to PM) | D-002, D-003, D-007 logged as **Blocked**, not resolved by me. OI-001 opened to schedule the reconvene. |
| Launch timeline | Soft target, no hard forcing event | Bulk payment and full refund automation pulled into **MVP** scope (Section 3) instead of Phase 2 — no deadline pressure to cut them. |
| Budget posture | $0 at launch, revisit after | SMS/WhatsApp notification tier and managed-DB-backup upgrades classified **Phase 2**, funded once usage data exists — not Future, not blocked indefinitely. |

---

## 1. Decision Log

### 1.0 Sponsor answers of 2026-10-12: supersessions

These answers are recorded in `QA-LOG.md` (Batches 1 and 2). Where an answer changes an earlier entry, the earlier entry is not edited. Its status below is authoritative.

| Earlier entry | New status | Recorded in |
|---|---|---|
| D-021 manual and cash payment path | **Retired.** No cash, no POS, no manual payment records | D-033 |
| D-010 SMS in Phase 2 | **Reopened for SMS only.** SMS is MVP for marshal alerts and sign-in codes | D-028 |
| D-010 $0 posture (hosting) | **Reopened.** Vercel Pro from launch; Supabase Free accepted with recorded risks | D-027 |
| OI-002 proof-of-payment upload scope | **Closed.** No manual payment records exist, so no upload or receipt field is needed | D-033 |
| OI-021 waitlist scope | **Decided.** Waitlist is in MVP | D-030 |
| OI-022 cancellation cutoff | **Decided as default.** 12 hours before departure; admin sets per programme. Department confirms the number | D-032 |
| OI-023 cash versus no cash | **Closed.** Fully digital | D-033 |
| OI-030 hosting cost versus terms | **Decided.** Vercel Pro + Supabase Free | D-027 |
| OI-031 SMS channel | **Channel decided.** Vendor and cost open | D-028 |
| OI-034 visual system | **Closed.** One orange system for the apps; documents stay blue | D-031, D-036 |
| OI-039 staff sign-in | **Partly decided** | D-029 |
| RISK-003 cash bypasses reconciliation | **Closed by D-033** | D-033 |
| RISK-007 payment-model contradiction | **Closed by D-033** | D-033 |
| BRD §15 waitlist deferral | **Superseded by D-030** | D-030 |
| OI-036 refund policy drafting (owner) | **Owner set:** department drafts from scratch; PM supplies the decision list as input only | D-038 |
| OI-028 guest caps | **Decided:** no cap at launch; admin monitors; review after pilot | D-040 |
| Round-trip and return-only pricing (PAYMENTS-DESIGN §2) | **Decided:** one price per rider per programme | D-039 |
| Late rider additions after the lock (D-037) | **Decided:** admin approves in the app with a reason | D-041 |
| OI-026 support owners | **Decided in part:** split by category; finance contact to be named by the church | D-042 |
| OI-024 special-event approval | **Decided:** second admin approves before booking opens | D-042 |
| OI-038 record retention (proposal in DATA-MODEL §4) | **Decided in part:** payments per finance period; attendance to counts after one year. Legal review still required | D-043 |
| OI-028 registration turnaround | **Decided:** 24 hours, admin reminder at 12 hours | D-044 |
| Journey B4a and STATE-MACHINES §1: free booking confirmed at once | **Superseded.** A free booking is confirmed after the marshal's call | D-051 |
| BRD requirement 11: booking is not the same as a confirmed booking | **Restored** (BRD rule kept; the design had dropped it) | D-051 |
| D-029: sign-in methods at MVP (phone code, authenticator, Google at deployment) | **Extended.** Magic link is added later, alongside the phone code | D-052 |
| NOTIFICATIONS §6: marshal alerts name the bus, not the passenger list | **Superseded.** The app names the rider; SMS shows the bus and count | D-053 |
| NOTIFICATIONS §2 and §7: 22 event rows, 14 templates | **Extended.** 25 event rows, 17 templates | D-053 |
| D-047: 115 acceptance criteria (109 at Level P) | **Extended.** MAR-21 added at Level P: 116 criteria, 110 at Level P | D-051 |
| OI-049 meaning of public use (open) | **Decided.** Pilot group first; all members after the 30-day review | D-054 |
| OI-050 hold length for unconfirmed free bookings (open) | **Decided.** Held until 18:00 the day before departure (not the manifest lock) | D-055 |
| OI-042 password question (open) | **Decided.** Password added next to the phone code | D-056 |
| OI-042 gender choices (open) | **Decided.** Male or female only; no decline option | D-057 |
| D-029: phone code only for members at MVP | **Extended.** Password next to the phone code (D-056); magic link and Google later (D-052) | D-056 |

**Decision ID:** D-030
**Decision:** When a programme or bus is full, riders join a **waitlist**. When a seat is released or a bus is added, the marshal is notified, the marshal contacts admin, and admin adds a bus or finds another solution. Waitlisted riders are offered seats in priority order (guests first, then members) by push and SMS, and must rebook within an offer window. Priority is defined by the sponsor as "guests are first-timers"; the definition is confirmed in Q-010.
**Status:** Accepted (Q-007, custom answer).
**Owner:** Executive Product Sponsor (rule); Backend/Systems Engineer (waitlist states); Transport Department (operations).
**Reason:** Sponsor operating rule: no rider is turned away before capacity has been sought.
**Evidence:** QA-LOG Q-007. Reverses the BRD §15 deferral and the OI-021 recommendation to remove waitlist language.
**Alternatives considered:** refuse with contact route (option A); waitlist as a later phase (rejected by sponsor); members-first priority (option D, not chosen).
**Consequences:** Adds a waitlist entity and states (DATA-MODEL §2.3, STATE-MACHINES §11, API-CONTRACTS §2). Requires a value for the offer window (proposal two hours, Q-011). The priority rule is a fairness decision that members may question, so the rule must be visible and every offer must be recorded.
**Affected systems:** Booking, capacity, notifications, prototypes (waitlist copy is now correct), PRODUCT scope tiers.
**Next action:** Answered by Q-010 and Q-011 (D-034, D-035).

---

**Decision ID:** D-031
**Decision:** One burnt-orange and yellow system for the production apps (member, marshal, admin). Church-facing and internal documents remain blue until Q-010 decides otherwise.
**Status:** Accepted for the apps (Q-008). Documents: see D-036 (stay blue).
**Owner:** Executive Product Sponsor; UI/UX Designer.
**Reason:** Sponsor choice of a single identity for the apps.
**Consequences:** Prototypes are already aligned. Design tokens in FRONTEND use the orange system. The church-facing specification would need redesign if Q-010 moves it.
**Affected systems:** FRONTEND, PROTOTYPES, OI-034.
**Next action:** Resolved by Q-012 (D-036).

---

**Decision ID:** D-032
**Decision:** The cancellation cutoff for refunds is **12 hours before departure** by default. An admin may set a different cutoff for a programme, with a recorded reason.
**Status:** Accepted (Q-009).
**Owner:** Executive Product Sponsor (value); Backend/Systems Engineer (configuration and enforcement).
**Reason:** Sponsor choice. Fair to evening and early-morning departures alike, and easy to test.
**Consequences:** The department confirms the 12-hour figure (START-CHECKLIST D10). Refund amounts remain open under OI-036.
**Affected systems:** STATE-MACHINES §1, PROGRAMMES-LEGS-GUESTS §1, Refund workflow.
**Next action:** Department confirms the number.

---

**Decision ID:** D-033
**Decision:** Every payment is made digitally through **Paystack and/or OPay**. There is no cash, no POS, and no manual payment record path. This retires D-021. The choice of one provider or both remains OI-025.
**Status:** Accepted (Q-006, custom answer). Retires D-021.
**Owner:** Executive Product Sponsor.
**Reason:** Sponsor operating rule. Keeps every payment inside the provider-confirmed path (ADR-0003) and removes the manual-reconciliation problem (RISK-003).
**Evidence:** QA-LOG Q-006. The liaison's field report of 2026-10-07 said a subset of members relies on cash. That evidence is recorded as RISK-011, which the sponsor should review at the pilot.
**Consequences:** Marshals never handle money. Refunds go through the provider or are manual admin actions against a provider reference. Members who cannot pay digitally cannot book (RISK-011). OI-002 and OI-023 close.
**Affected systems:** PAYMENTS, ADR-0003, prototypes (remove any cash wording), scope tiers.
**Next action:** Integrations confirms which channels each provider offers members without cards (Verify), and the team records that assessment against RISK-011.

---

**Decision ID:** D-034
**Decision:** Waitlist priority: **first-timer guests** (guests who are first-timers) are offered seats first. All other waiting riders (members, and guests who are not first-timers) follow in order of joining the waitlist.
**Status:** Accepted (Q-010, option A). Refines D-030.
**Owner:** Executive Product Sponsor.
**Evidence:** QA-LOG Q-010.
**Consequences:** A member's own guest who is not a first-timer ranks with members. Priority is applied at offer time and visible to admin.
**Affected systems:** STATE-MACHINES §11, DATA-MODEL `waitlist_entries`, PROGRAMMES-LEGS-GUESTS §3.
**Next action:** None beyond build.

---

**Decision ID:** D-035
**Decision:** A waitlisted rider has **2 hours** to accept a seat offer.
**Status:** Accepted (Q-011, option B). Refines D-030.
**Owner:** Executive Product Sponsor; Backend/Systems Engineer (scheduler).
**Consequences:** A live offer should reserve its seats until it is accepted or expires (Recommendation; the reservation is released on expiry, so an expired offer never holds a seat). The department confirms the two-hour figure in practice.
**Affected systems:** STATE-MACHINES §11, notifications, scheduler.
**Next action:** Backend confirms the reservation rule in Stage 2.

---

**Decision ID:** D-036
**Decision:** Church-facing and internal documents stay **blue**. The orange system applies to the production apps only (D-031).
**Status:** Accepted (Q-012, option A).
**Owner:** Executive Product Sponsor; UI/UX Designer.
**Evidence:** QA-LOG Q-012. The sponsor's earlier instruction for the church-facing specification was blue.
**Consequences:** Two visual identities: orange for the apps, blue for documents. Revisit at the pilot if the church asks for one identity.
**Affected systems:** INITIAL-PRODUCT-SPEC.html, MEETING-NOTES-03, DOCS templates. OI-034 is closed for the apps and for documents.

---

**Decision ID:** D-037
**Decision:** The rider list is **fixed 30 minutes before departure** (the manifest lock). From the lock, no-shows may be marked. Additions and removals after the lock need an admin approval with a recorded reason.
**Status:** Accepted (Q-013, option A). Not the recommended one-hour lock.
**Owner:** Executive Product Sponsor; Transport Department (operations).
**Evidence:** QA-LOG Q-013.
**Consequences:** Thirty minutes is short for marshals to resolve late additions. Walk-ons after the lock need admin approval, which may slow a boarding in practice. The department reviews after the first two programmes; a change to one hour is a reopen with evidence.
**Affected systems:** STATE-MACHINES §2, FRONTEND (marshal manifest), API-CONTRACTS (`add_walk_on`).
**Next action:** Department confirms the walk-on approval route for the lock period (answered by Q-017, D-041).

---

**Decision ID:** D-038
**Decision:** The refund policy (OI-036) is drafted **by the transport department from scratch**. The PM supplies the decision list from `MEETING-NOTES-03` as input only, not as a draft. Refund automation (D-006) waits for a ratified policy. Admin-approved refunds with a provider reference continue in the meantime.
**Status:** Accepted (Q-014, option B). Not the recommended option (PM draft).
**Owner:** Church Transport Department (drafting); Executive Product Sponsor (approval).
**Consequences:** The slowest route to a policy. The draft date is not yet set; it becomes the gate for refund automation.
**Affected systems:** PAYMENTS §6, STATE-MACHINES §4, refund build (Stage 5).
**Next action:** Sponsor and department agree a draft date.

---

**Decision ID:** D-039
**Decision:** The price is **one price per rider per programme, whatever the leg**. Round-trip and return-only riders pay the same.
**Status:** Accepted (Q-015, option A).
**Owner:** Executive Product Sponsor.
**Consequences:** Simple to explain and test. No per-leg price configuration. Revisit if return-only riders are given a discount.
**Affected systems:** PAYMENTS-DESIGN §2, PROGRAMMES-LEGS-GUESTS §2, programme configuration.

---

**Decision ID:** D-040
**Decision:** **No guest cap** at launch. Admin monitors guest numbers per programme and per bus. The position is reviewed after the pilot.
**Status:** Accepted (Q-016, option D). Not the recommended option (3 guests).
**Owner:** Executive Product Sponsor; Transport Department (monitoring).
**Consequences:** Guests may fill buses. Under D-034, first-timer guests rank ahead of members on the waitlist, so members can be displaced on full buses. Recorded as RISK-012.
**Affected systems:** PROGRAMMES-LEGS-GUESTS §4, waitlist priority, admin reports.
**Next action:** Admin dashboard shows guest share per bus from the pilot. Review at the pilot gate.

---

**Decision ID:** D-041
**Decision:** After the manifest lock, a rider may be added only by **admin approval in the app, with a reason**. The marshal asks admin; the approval is logged.
**Status:** Accepted (Q-017, option A).
**Owner:** Executive Product Sponsor; Transport Department (admin on-call rota).
**Consequences:** Depends on admin availability on the day. A second admin should be reachable on travel days (OI-014).
**Affected systems:** STATE-MACHINES §2, API-CONTRACTS (`add_walk_on`), admin on-call rota.
**Next action:** Department sets the on-call rota for travel days.

---

**Decision ID:** D-042
**Decision:** Support owners are split by category: **admin** owns booking problems and travel incidents; a **finance contact named by the church** owns payment problems; **app bugs** go through the admin to the developer. Opening a special event for booking needs **approval by a second admin**.
**Status:** Accepted (Q-018 and Q-019, recommended options).
**Owner:** Executive Product Sponsor; Transport Department (names the finance contact).
**Consequences:** Needs a named finance contact (START-CHECKLIST D14). Needs two trained admins (OI-014). Response targets in SUPPORT §4 stand as proposed until the department changes them.
**Affected systems:** Support queue, special-event approval, admin roles, AUTH (admin roles).
**Next action:** Church names the finance contact and a second admin.

---

**Decision ID:** D-043
**Decision:** Payment records are kept for the **finance period set by the church**. Attendance is kept at personal level for one programme year, then reduced to counts.
**Status:** Accepted (Q-020, recommended option). The legal review (OI-038) still applies.
**Owner:** Executive Product Sponsor; church finance office (period).
**Consequences:** The finance period is needed before production data is retained (START-CHECKLIST D13). Attendance reduction is a scheduled job to design in Stage 5.
**Affected systems:** DATA-MODEL §4, retention jobs, reporting.

---

**Decision ID:** D-044
**Decision:** A first-timer registration is decided within **24 hours**. The admin is reminded after **12 hours** if the application is still pending.
**Status:** Accepted (Q-021, recommended option).
**Owner:** Executive Product Sponsor; Transport Department (admin rota).
**Consequences:** Needs an admin on rota (OI-014). A reminder is a notification (NOTIFICATIONS event catalogue).
**Affected systems:** AUTH §3, admin queue, notifications.

---

**Decision ID:** D-045
**Decision:** Development begins only after two conditions are met. (a) The transport team signs the sign-off pack (`SIGN-OFF/TRANSPORT-SIGN-OFF-PACK.html`, page 11). (b) The technical reconvene ratifies the stack (D-024, D-002), the seat-hold method (D-003), and the membership-matching rule (D-007, with the policy in P-20). When both are met, the documentation is frozen at version 1.0, the PRD is written as version 1.0 from the frozen set, and the roadmap is baselined.
**Status:** Accepted (sponsor direction, 2026-10-12).
**Owner:** Executive Product Sponsor (approval); Product Manager (freeze and PRD record).
**Reason:** Sponsor wants the transport team's sign-off before any build, and a documented baseline so later change is controlled.
**Evidence:** QA-LOG Batch 7. `ROADMAP/DEVELOPMENT-STRATEGY.md` §2 to §5.
**Consequences:** Transport sign-off does not on its own start the backend. Changes after the freeze go through change control (DEVELOPMENT-STRATEGY §3). The root PRD draft is superseded by PRD-v1.0.
**Affected systems:** All frozen documents; PRD folder; roadmap baseline; decision log.
**Next action:** Transport team returns the pack; freeze and PRD v1.0 follow in that order.

---

**Decision ID:** D-046
**Decision:** Development order after the freeze is frontend first, then backend. The frontend is built against the frozen API contracts and a stand-in data layer generated from them. The state-transition rules are tested once and run against both the stand-in and the database functions. No business rule is computed in the UI. The stand-in is removed at integration.
**Status:** Accepted (sponsor direction, 2026-10-12), with conditions: the frontend framework is ratified before frontend stage F0; each backend stage is done only when its criteria pass on the real backend.
**Owner:** Product Manager (sequence); Frontend and Backend leads (execution).
**Reason:** Lets the transport team test the travel-day screens before the database locks in rules; finds misunderstandings early.
**Evidence:** `ROADMAP/DEVELOPMENT-STRATEGY.md` §6 and §7. QA-LOG Batch 7.
**Consequences:** Risk that screens drift from the rules; mitigated by contract-first, shared state tests, the no-rule-in-UI checklist, and running the same criteria on both sides (DEVELOPMENT-STRATEGY §9). Supersedes the backend-first build order in `ROADMAP/IMPLEMENTATION-ROADMAP.md` (note added there).
**Affected systems:** Frontend, backend, testing, roadmap.
**Next action:** Reconvene ratifies the frontend framework so that F0 can start.

---

**Decision ID:** D-047
**Decision:** The 115 acceptance criteria in `TESTING/ACCEPTANCE-CRITERIA.md` (members 40, guests 12, marshals 20, administrators 25, system 18) are the release test of "done". The 109 at level P must all pass before the pilot. The six at level L are scheduled after it.
**Status:** Proposed. Drafted from the scenario table and the decisions. The transport sign-off confirms the rules they test (pack pages 03 and 05 to 09).
**Owner:** Product Manager (criteria); QA/Test Engineer (test mapping, OI-035).
**Consequences:** Every POLICY row in the scenario table must be covered by a criterion or listed as deferred with its policy ID. A criterion that fails on the real backend reopens the stage it belongs to.
**Affected systems:** Testing, every build stage, the release gate (D-019).
**Next action:** QA maps each criterion to automated tests (stand-in first, real backend second).

---

**Decision ID:** D-048
**Decision:** The transport sign-off is an interactive form, not a printed document. Every question is a choice (buttons or drop-downs). Typing is limited to a name and an optional short note. Answers save in the reviewer's browser and export as one JSON file, with each answer carrying its decision or issue reference. An exported file can be imported again to update answers later. The A4 print layout is retired.
**Status:** Accepted (sponsor instruction, 2026-10-12).
**Owner:** Product Manager.
**Reason:** Sponsor wants the review done in about 20 minutes, with minimal typing, and answers that can be carried into the register and updated later.
**Evidence:** `SIGN-OFF/TRANSPORT-SIGN-OFF-PACK.html`, version 1.0 (66 items). QA-LOG Batch 7.
**Consequences:** Returned files are personal records and are kept outside version control (D-049). The decision log cites each returned file by name and date.
**Affected systems:** SIGN-OFF folder, QA-LOG Batch 7, decision and issue registers.
**Next action:** Send the form to the transport team by the sponsor's chosen route (not sent yet).

---

**Decision ID:** D-049
**Decision:** The project is under version control with git, at the project root. The baseline is committed on `main` and tagged `docs-baseline-2026-10-12`. Branch, tag and commit rules are in `DOCS/VERSION-CONTROL/VERSION-CONTROL.md`. The freeze is the tag `docs-v1.0`. Secrets, returned sign-off forms and member data are never committed (`.gitignore`). No remote is set and nothing is pushed until the sponsor chooses a host.
**Status:** Accepted (sponsor instruction, 2026-10-12).
**Owner:** Product Manager (rules); Executive Product Sponsor (remote and hosting account).
**Reason:** The documentation freeze and change control require an audit trail of versions. The project was not under version control.
**Evidence:** Repository initialised 2026-10-12; secret scan of the tree before the first commit (no matches).
**Consequences:** Change control after the freeze uses change requests and branches (`change/CR-###`). Git identity is set per person; no configuration is altered by scripts.
**Affected systems:** Whole project; DEVELOPMENT-STRATEGY §3 and §9.
**Next action:** Sponsor chooses a host for the remote, owned by the church rather than an individual.

---

**Decision ID:** D-050
**Decision:** The requirements are consolidated in a candidate PRD (`PRD/PRD-v1.0-CANDIDATE.md`), with a line-by-line trace to the BRD. The full build, deployment, review, security and testing work is planned in `ROADMAP/IMPLEMENTATION-TASKS.md`. Both are working baselines. They become PRD v1.0 and roadmap baseline v1.0 only at the freeze (D-045). BRD requirements that the design does not yet meet are recorded as OI-041 to OI-049, not absorbed silently. Tasks tagged NEW in the task plan are engineering standards proposed by this plan, not requirements from the sponsor; the sponsor may reject any of them.
**Status:** Proposed (product manager working baseline, 2026-10-13). Not frozen.
**Owner:** Product Manager (documents); Executive Product Sponsor (approval at the freeze).
**Reason:** The sponsor asked for a complete plan covering build, deployment, review, security and final testing before public use, traced to the documents. The trace against the BRD found four requirement conflicts and five gaps that the design had not closed.
**Evidence:** Candidate PRD §13 (BRD trace) and §14 (gaps and assumptions). Task plan §14 (module coverage). QA-LOG Batch 8 (Q-036 to Q-039).
**Alternatives considered:** Write PRD v1.0 now (rejected: it would precede the sign-off and break D-045). Plan without a BRD trace (rejected: requirements would be lost silently).
**Consequences:** A stage that depends on OI-041 to OI-049 cannot close until each is decided or deferred with a named owner. The plan adds NEW tasks that the source documents do not list. Risk RISK-013: requirements lost between the BRD and the build. Mitigation: the trace in the PRD, module coverage in the task plan, and change control after the freeze.
**Affected systems:** PRD, roadmap, testing (criteria mapping), frontend route map (OI-045), data model (OI-042, OI-043), notifications (OI-044).
**Next action:** Batch 8 answers recorded when given. Owners named for OI-043 and OI-045 to OI-048, which need no sponsor question. Candidate PRD and task plan reviewed with the sponsor before the reconvene.

**Update 2026-10-13.** Batch 8 answers are recorded: D-051 to D-054 below. The candidate PRD and task plan are updated to match.

---

**Decision ID:** D-051
**Decision:** A free booking stays `held` until the marshal has called the member and recorded the result. Only a reached call with the member's confirmation moves it to `confirmed`. A member cannot confirm a free booking alone. The marshal records each contact per rider (reached, not reached, or no longer going). Held riders appear on the duty list as "to contact".
**Status:** Accepted (sponsor answer Q-036, option A, the BRD rule). Not the recommended option B.
**Owner:** Executive Product Sponsor (rule); Product Manager (state change); Backend lead (functions); Frontend lead (duty list).
**Reason:** BRD §11 and requirement 11: a booking is a request; a confirmed booking is when the marshal has called the member. The sponsor chose the BRD rule.
**Evidence:** QA-LOG Batch 8, Q-036. BRD §12, requirements 10 and 11, journeys A and B. Priority note recorded in QA-LOG Batch 8.
**Alternatives considered:** confirm on booking and track the call (recommended, not chosen); paid confirms on payment and free waits (not chosen).
**Consequences:** Supersedes the free path in SCOPE Journey B4a and STATE-MACHINES §1. Adds `record_contact` and a marshal-side `confirm_free_booking` to CONTRACTS §2. Adds MAR-21 to the criteria (supersession table). Creates OI-050 (how long an unconfirmed free booking holds its seat, Q-040). A seat held for a call can starve the waiting list until OI-050 is decided.
**Affected systems:** Booking state machine, API contracts, marshal duty screens, notifications, acceptance criteria (MEM-07, MEM-40 revised; MAR-21 added), scenario A01.
**Next action:** Q-040 decides the hold length (OI-050). Backend implements after the decision (BE-B1-05, BE-B1-18).

---

**Decision ID:** D-052
**Decision:** Gender is a required member field at registration. Its choices are set by Q-042. Members and marshals sign in with a phone code. Magic link (email) and Google sign-in are added later, alongside the phone code. Whether a password is also offered is set by Q-041.
**Status:** Accepted in part (sponsor answer Q-037, "Other"). The password question (Q-041) and the gender choices (Q-042) are open under OI-042.
**Owner:** Executive Product Sponsor (requirement); Security and compliance lead (sign-in methods); Transport Department (other fields).
**Reason:** The sponsor requires gender for the male and female report, and states that BRD rules take priority.
**Evidence:** QA-LOG Batch 8, Q-037. BRD §6 and §17.
**Consequences:** `profiles` gains a required `gender` field (DATA-MODEL §2.1). AUTH-DESIGN §2 lists magic link as a later member method. Extends D-029 (its other sign-in answers stand). The password question stays open, so BRD §6's password requirement is neither met nor dropped until Q-041 is answered. Gender is personal data and is minimised in reports (OI-038).
**Affected systems:** Registration form, profiles table, reports (male and female), AUTH-DESIGN, criteria (none changed).
**Next action:** Q-041 (password) and Q-042 (gender choices).

---

**Decision ID:** D-053
**Decision:** Marshal alert content. The app push names the rider and booking reference, for the marshal's own assignment only. An SMS to a marshal shows only the bus and the rider count. Three missing alerts are added, following BRD §13 and §18: a new-booking alert to the assignment's marshal; a payment-change alert to the marshal; and a programme reminder to booked riders the day before departure.
**Status:** Accepted for content (sponsor answer Q-038, option A). The three added alerts follow the BRD, and are a product manager decision under the "BRD rules are the priority" note (QA-LOG Batch 8). The sponsor may reopen them.
**Owner:** Executive Product Sponsor (content); Product Manager (event list); Security lead (privacy).
**Reason:** Names on the phone are useful on duty; SMS is a copy that leaves the app's control, so it carries the minimum.
**Evidence:** QA-LOG Batch 8, Q-038. BRD §13 and §18. NOTIFICATIONS-DESIGN §2 and §6 (before this decision).
**Consequences:** NOTIFICATIONS-DESIGN §2 gains three event rows (25 in total). §6 content rule is replaced. §7 template list gains three templates (17 in total). Closes the content part of OI-044. The SMS vendor and cost remain OI-031.
**Affected systems:** Notifications, marshal duty screens, privacy (SMS minimal).
**Next action:** Backend adds the three events to the outbox catalogue (NOT-12).

---

**Decision ID:** D-054
**Decision:** Public use is staged. A named pilot group uses the app first. All members are admitted after the 30-day review of the pilot. The public-use gate (task plan §12) applies to the release to all members.
**Status:** Accepted (sponsor answer Q-039, option A, recommended).
**Owner:** Executive Product Sponsor.
**Evidence:** QA-LOG Batch 8, Q-039.
**Consequences:** The roster import is staged: the pilot list first, then the whole roster after the review (DEP-16). The pilot group still needs its programme (Q-027, OI-040) and its marshals and administrators (START-CHECKLIST C9, C10).
**Affected systems:** Roster import, support load, public-use gate, roadmap §8 and §9.
**Next action:** Name the pilot group (OI-040).

---

**Decision ID:** D-055
**Decision:** A free booking's hold ends at 18:00 (Africa/Lagos time) on the day before departure. The existing expiry rule then applies (STATE-MACHINES §1): the booking expires and its seats return to the waiting list. A free booking made after that time holds until the manifest lock, 30 minutes before departure. The after-18:00 rule is a product manager recommendation, not a sponsor answer; the sponsor confirms it at the freeze.
**Status:** Accepted (sponsor answer Q-040, option B). Not the recommended option A (hold until the lock).
**Owner:** Executive Product Sponsor (time); Product Manager (after-18:00 rule); Backend lead (expiry rule).
**Reason:** The sponsor wants seats released a day before departure so the waiting list can use them, and accepts less time to call late bookings.
**Evidence:** QA-LOG Batch 9, Q-040. D-030 and D-035 (waiting list), D-037 (lock).
**Alternatives considered:** hold until the manifest lock (option A, recommended, not chosen); no limit (not recommended); the 15-minute hold (not practical for calls).
**Consequences:** A rider not reached by 18:00 the day before loses the held seat and must rebook if seats remain. The day-of calls cannot hold a seat. Uses the existing `expired` state; no new state is added. The waiting list receives the released seats.
**Affected systems:** Expiry job; `hold_seats` (`hold_expires_at` value for free bookings); notifications (hold expiring); duty list ("to contact" window); criteria MAR-21.
**Next action:** Backend implements the rule (BE-B1-18). Department confirms the 18:00 time.

---

**Decision ID:** D-056
**Decision:** Password sign-in is added next to the phone code, as BRD §6 asks. Members and marshals may sign in with either. Magic link (email) and Google sign-in are added later (D-052). Password recovery uses the phone code, so a member never needs a second channel to recover an account. The recovery route is a recommendation for the security review to confirm.
**Status:** Accepted (sponsor answer Q-041, option A). It follows the sponsor's note that BRD rules are the priority (QA-LOG Batch 8). It extends D-029, which had no passwords for members.
**Owner:** Executive Product Sponsor; Security and compliance lead (password policy); Backend lead (implementation).
**Reason:** BRD §6 asks for a password for subsequent login.
**Evidence:** QA-LOG Batch 9, Q-041; QA-LOG Batch 8, Q-037; BRD §6.
**Alternatives considered:** phone code only (option B, not chosen).
**Consequences:** Adds password handling: a password policy, lockout and rate limits (AU-03), recovery through the phone code. A credential-stuffing threat is added to the threat model. Administrators keep the password plus authenticator (D-029).
**Affected systems:** Auth, member sign-in screen, threat model, security tasks (SEC-05 to SEC-08), acceptance criteria mapping (TST-22).
**Next action:** Security lead writes the password policy and the recovery procedure; threat model updated (REV-11).

---

**Decision ID:** D-057
**Decision:** Gender is a required field with two choices, male or female. There is no decline option. It is used for the male and female report and for no other purpose.
**Status:** Accepted (sponsor answer Q-042, option A). Replaces the recommended option B (prefer not to say).
**Owner:** Executive Product Sponsor; Security and compliance lead (privacy review).
**Reason:** Matches the BRD §17 report exactly.
**Evidence:** QA-LOG Batch 9, Q-042; BRD §17; D-052.
**Consequences:** RISK-014: a forced binary choice may exclude a person, and gender is personal data, so it can cause a privacy complaint. Counsel review (OI-038, SEC-25) must cover it. The pilot review revisits it (RISK-014).
**Affected systems:** Registration form; profiles table (`gender`, values `male` and `female`); reports; privacy notice.
**Next action:** Counsel review includes the gender field (SEC-25). Pilot review checks for exclusions (RISK-014).

---

Format per protocol. Decisions already agreed in Phase 1 are formalized here for the first time; new decisions from today's sponsor input are added.

---

**Decision ID:** D-001
**Decision:** Programme↔Route↔Bus model — a route may have multiple buses; total route capacity is the sum of its buses' capacities.
**Status:** Accepted
**Owner:** Database/Data Architect
**Reason:** Both Phase 1 respondents agreed independently.
**Evidence:** Meeting Minutes 02 §1, row 01.
**Alternatives considered:** 1 route = 1 bus; buses attached directly to programme.
**Chosen option:** Route can have multiple buses (Option B).
**Consequences:** Requires a `route_buses` join table, not a direct capacity field on Route.
**Affected systems:** Database schema, capacity engine, Admin per-bus toggle (D-013).
**Next action:** Database/Data Architect to model schema per Meeting Minutes 02 §3.5 optimization notes.

---

**Decision ID:** D-002
**Decision:** Technology stack (Next.js+Supabase vs. FastAPI+React+Postgres vs. split stack).
**Status:** **Blocked — Reopened for reconvene**
**Owner:** Backend/Systems Engineer + Database/Data Architect (joint)
**Reason:** The two Phase 1 respondents gave conflicting answers (B vs. A). Per sponsor direction (Section 0), the PM does not break this tie — the original respondents must reconvene.
**Evidence:** Meeting Minutes 02 §1, row 02.
**Alternatives considered:** Next.js+Supabase; FastAPI+React+Postgres; Next.js front + FastAPI back.
**Chosen option:** None yet.
**Consequences:** **This blocks all Database and Backend domain work** — schema, API contracts, and hosting choice all depend on it.
**Affected systems:** Database, Backend, DevOps/hosting, Frontend framework.
**Next action:** PM schedules the reconvene (OI-001). Gate: no schema or API work starts until Accepted.

---

**Decision ID:** D-003
**Decision:** Seat-protection strategy during payment (TTL hold vs. decrement-on-success vs. decrement-on-booking).
**Status:** **Blocked — Reopened for reconvene**
**Owner:** Backend/Systems Engineer
**Reason:** Conflicting Phase 1 answers (B vs. A); same authority constraint as D-002.
**Evidence:** Meeting Minutes 02 §1, row 03.
**Alternatives considered:** TTL hold; decrement-on-success; decrement-on-booking with manual cleanup.
**Chosen option:** None yet.
**Consequences:** Directly changes the booking-creation code path and whether "seats left" is trustworthy under concurrent load.
**Affected systems:** Backend booking logic, capacity engine, payment webhook handler.
**Next action:** Resolve in the same reconvene session as D-002 (both affect the same engineer's build order — bundle them, don't schedule separately).

---

**Decision ID:** D-004
**Decision:** Booking-window automation via scheduler/cron.
**Status:** Accepted
**Owner:** Backend/Systems Engineer + DevOps
**Reason:** Both respondents agreed (Option A).
**Evidence:** Meeting Minutes 02 §1, row 04.
**Chosen option:** Scheduler/cron component, per-programme configuration.
**Consequences:** Requires a job runner in the hosting environment (depends on D-002 outcome for implementation detail, not for the decision itself).
**Affected systems:** Backend, DevOps.
**Next action:** DevOps to confirm job-runner support once D-002 resolves.

---

**Decision ID:** D-005
**Decision:** Marshal reassignment is admin-triggered, not self-release/claim-pool or informal.
**Status:** Accepted
**Owner:** Backend/Systems Engineer
**Evidence:** Meeting Minutes 02 §1, row 05 (both respondents agreed Option A).
**Consequences:** Self-release/claim-pool (Option B) is formally **Out of Scope** — see Section 3.
**Affected systems:** Notification engine (route re-scoping), Marshal/Admin dashboards.
**Next action:** None — proceed to build.

---

**Decision ID:** D-006
**Decision:** Refund automation is fully automatic via Paystack's refund API, gated by the before-event-day eligibility window (PAY-6 in Meeting Minutes 02).
**Status:** Accepted
**Owner:** Integrations Specialist (Payments)
**Evidence:** Meeting Minutes 02 §1, row 06 (both respondents agreed Option A) + §3.1 raw input.
**Consequences:** Requires Paystack merchant account and refund-API access before this can be built — not just the payment API.
**Affected systems:** Payment system, audit trail.
**Next action:** Integrations Specialist to initiate Paystack merchant onboarding now — this has a vendor lead time independent of any other blocked decision.

---

**Decision ID:** D-007
**Decision:** Duplicate-registration handling (block outright vs. auto-merge vs. flag-for-review).
**Status:** **Blocked — Reopened for reconvene, with a dependency note**
**Owner:** Backend/Systems Engineer + Security & Compliance Lead (joint)
**Reason:** Conflicting Phase 1 answers (C vs. A). **New finding this session:** this decision is entangled with AUTH-2 (the membership-gate mechanism, still undecided in Meeting Minutes 02 §3.3) — if the gate becomes "match against a pre-loaded membership roll," the question of auto-merge vs. block becomes a *consequence* of that choice, not an independent one.
**Evidence:** Meeting Minutes 02 §1 row 07; §3.3 AUTH-2.
**Alternatives considered:** block outright; auto-merge on email/Google ID; flag for admin review.
**Chosen option:** None yet.
**Consequences:** Resolving D-007 in isolation from AUTH-2 risks a second reopen later.
**Affected systems:** Registration flow, member data integrity, reporting (first-time vs. returning).
**Next action:** PM instructs the reconvene session (OI-001) to resolve D-007 **together with** AUTH-2, not separately.

---

**Decision ID:** D-008
**Decision:** No-show is a first-class tracked booking-lifecycle state, not an informal note.
**Status:** Accepted
**Owner:** Database/Data Architect + Backend/Systems Engineer
**Evidence:** Meeting Minutes 02 §1, row 08 (both respondents agreed Option A).
**Consequences:** Adds a terminal state to the booking state machine distinct from Confirmed; required for reporting (BRD §17).
**Affected systems:** State machine, reporting engine.
**Next action:** Database/Data Architect to include in schema once D-002 resolves.

---

**Decision ID:** D-009
**Decision:** Notification channel baseline is Web Push + Email, delivered through a forced-PWA-install flow acting as the App Store/Play Store substitute.
**Status:** Accepted
**Owner:** UI/UX Designer (install flow + notification design) + Backend/Systems Engineer (event triggers)
**Evidence:** Meeting Minutes 02 §3.2, NOT-2/NOT-4 (sponsor-remembered follow-up).
**Consequences:** Install becomes a technical prerequisite for push on iOS Safari (16.4+), not just a UX choice. Requires the canonical Notification & PWA design doc (OI-004 dependency) before build.
**Affected systems:** Frontend (landing/install flow), notification engine.
**Next action:** UI/UX Designer owns the canonical design doc; see Open Issue OI-004.

---

**Decision ID:** D-010
**Decision:** Budget posture is $0 at launch; SMS/WhatsApp and managed-DB-backup tiers are funded post-launch once usage data justifies them.
**Status:** Accepted (sponsor input, this session)
**Owner:** PM
**Reason:** Sponsor answer, Section 0.
**Consequences:** Reclassifies SMS/WhatsApp notification tier and managed-DB-backup upgrade as **Phase 2**, not Future (Section 3). DevOps must choose a free-tier-viable hosting path for MVP regardless of D-002 outcome.
**Affected systems:** DevOps/hosting, Integrations (notifications), Database (backups).
**Next action:** DevOps to confirm free-tier capability of whichever stack D-002 selects.

---

**Decision ID:** D-011
**Decision:** No hard launch-forcing date exists; timeline is a soft target.
**Status:** Accepted (sponsor input, this session)
**Owner:** PM
**Consequences:** Bulk payment (PAY-3/PAY-4/PAY-5) and full refund automation (D-006) are pulled into **MVP** rather than deferred — there's no deadline pressure forcing a thinner cut, and Meeting Minutes 02 already flagged bulk payment as schema-altering (better built once than retrofitted).
**Affected systems:** Scope classification (Section 3), roadmap sequencing (Section 4).
**Next action:** Reflected directly in Section 3 below.

---

**Decision ID:** D-012
**Decision:** Tie-breaking authority for conflicting domain-respondent decisions rests with the original respondents reconvening, not delegated to the PM.
**Status:** Accepted (sponsor input, this session)
**Owner:** Executive Product Sponsor
**Consequences:** Slower resolution path for D-002/D-003/D-007 than PM-delegated tie-breaking would have been, but preserves respondent ownership of their own answers. PM's role on these three is strictly to schedule and frame the reconvene, not to decide.
**Affected systems:** Process/governance only.
**Next action:** OI-001.

---

**Decision ID:** D-013
**Decision:** Admin can open/close booking per individual bus, not only per route.
**Status:** Accepted
**Owner:** Database/Data Architect + Frontend Engineer (Admin dashboard)
**Evidence:** Meeting Minutes 02 §3.5, DB-2.
**Consequences:** Requires the open/close flag to live on the `route_buses` join row, not the Route record (ties to D-001's schema shape).
**Affected systems:** Database, Admin dashboard.
**Next action:** Fold into D-001's schema work.

---

**Decision ID:** D-014
**Decision:** The UIOS engine specs (`DOCS/SYSTEMS/`) are adopted as the project's architectural *vocabulary and discipline*, not as implementation scope. The mapping doc formalizes which 7 invariants carry over; the ~380-table machinery does not get imported.
**Status:** Accepted
**Owner:** Product Manager
**Reason:** The meeting minutes kept independently reaching for UIOS-native concepts (immutable records, audit trail, rate-limit events, context propagation, message envelopes). Rather than inventing ad-hoc versions, we adopt the already-thought-through patterns — while applying the Ponytail decision ladder to cut everything that's enterprise-scale but product-irrelevant.
**Evidence:** `DOCS/SYSTEMS-MAPPING.md` — full per-engine mapping, import list, and ponytail cut list.
**Alternatives considered:** (a) Implement UIOS literally — rejected, would bury a booking app under decision-intelligence infrastructure; (b) ignore the specs entirely — rejected, wastes already-answered design thinking; (c) this option — pattern-level import.
**Consequences:** Agents must read `SYSTEMS-MAPPING.md` before referencing UIOS concepts, to avoid importing machinery along with the pattern.
**Affected systems:** All domain docs going forward.
**Next action:** Reference SYSTEMS-MAPPING in agent onboarding.

---

**Decision ID:** D-015
**Decision:** Agent-to-agent and agent-to-human direct communication runs on email — one mailbox per team role — with the UAIE standard message envelope as the body format and entity-ID-based threading. The canonical register remains the system of record; mail is transport, not storage. **Service: AgentMail** (free tier); key model is **inbox-scoped API keys** per agent with permission whitelists.
**Status:** Accepted — provisioned and verified live (2026-10-06)
**Owner:** Product Manager (protocol); Sponsor (org master key custody); DevOps + Integrations (expansion)
**Reason:** The Master Multi-Agent Prompt defines handoff packets and context capsules but not transport. Email is asynchronous, threaded, durable, and human-readable — the sponsor and liaison can read the same channel the agents do.
**Evidence:** `DOCS/AGENT-COMMUNICATIONS-WORKFLOW.md` v1.1; live verification — org `edcd2158-…` holds 3 inboxes (`vlthrlab-pm`, `vlthr-asset-generator`, `victoria-3416`); PM scoped key minted and isolation-tested (own inbox 200, org endpoints 403); bootstrap message sent to all three inboxes with labels.
**Alternatives considered:** Shared doc-polling (loses threading/notifications), chat platform like Slack (adds cost and a second surface, conflicts with $0 launch), other mail APIs (Mailgun/SES/Resend — superseded by sponsor's AgentMail choice).
**Consequences:** Free-tier ceiling of 3 inboxes forces interim consolidation — unassigned roles route through `pm@` via subject/label grammar. Expansion path: sponsor's second AgentMail account (cross-org, each org mints its own scoped keys) or Developer plan $20/mo / +$2 per inbox pay-as-you-go.
**Affected systems:** Team operating model; `AGENT-COMMUNICATIONS-WORKFLOW.md`; `.env.local` holds `AGENTMAIL_API` (master, sponsor custody) + `AGENTMAIL_PM_SCOPED`.
**Next action:** Mint scoped keys for the other two live inboxes; create remaining role inboxes as the second account is provisioned. *(Scoped keys for DS + QA minted 2026-10-07 — `AGENTMAIL_DS_SCOPED`, `AGENTMAIL_QA_SCOPED` in `.env.local`.)*

---

**Decision ID:** D-016
**Decision:** The sponsor's org chart (PO/BA → PM/Scrum Master → Developers[FE/BE/Fullstack] + UI/UX + QA[Manual/Auto] + cross-lane DevOps) and SDLC swimlane (Define→Prioritise→Design→Implement→Code Review→Test gate→Deploy & Monitor, fail-loops to Implement) are formally registered as the project governance model. A machine-readable team registry (`DOCS/REGISTRY/team-registry.yaml`) holds one profile per agent; `DOCS/MANAGEMENT-SOURCE-OF-TRUTH.md` is the sponsor-facing aggregation.
**Status:** Accepted
**Owner:** Product Manager (registry authority)
**Reason:** Sponsor supplied the canonical governance diagrams; they map 1:1 onto our hub-and-spoke model (their PM/Scrum Master = our PM hub; PO/BA = sponsor-level executive authority). Formalizing removes ambiguity about reporting lines, delivery lanes, and the QA pass/fail gate.
**Evidence:** Sponsor diagrams (org chart + SDLC flow); `team-registry.yaml` `governance:` block.
**Alternatives considered:** Keep our agent-chain model only — rejected; the chart's lane structure (dev specialisations, manual/auto QA split, cross-lane DevOps) adds precision our flat roster lacked.
**Consequences:** Gate 0 (OI-001) sits upstream of the chart's "Implement" lane — engineering start is contingent on it. Secretary (Ufuoma) registered as level-2 coordination support. Extra roles not on the chart (data_science, security, liaison) slot into nearest lanes.
**Affected systems:** `team-registry.yaml`, `MANAGEMENT-SOURCE-OF-TRUTH.md`, `AGENTS.md`, lifecycle YAML.
**Next action:** Sponsor reviews management source-of-truth; registry updates flow through [D]-type changes.

---

**Decision ID:** D-017
**Decision:** The team's full operating model — organizational structure, registers, protocols, gates, and discipline — is extracted into a standalone reusable framework named **VLTHRTEAM** (`DOCS/VLTHRTEAM.md`), benchmarked against Fortune-500 practices (single-threaded owner, RAPID decision rights, stage-gate, blameless postmortems, SBAR handoffs, ADRs) and portable to other projects via a 9-step instantiation checklist.
**Status:** Accepted
**Owner:** Product Manager
**Reason:** The operating model proved itself on this build (decision-log discipline, scoped-key mail layer, handoff capsules, gate sequencing all ran live); extraction makes the method — not just the product — a reusable asset.
**Evidence:** `DOCS/VLTHRTEAM.md`; this session's live verification (mail bootstrap, scoped-key isolation, thread mirroring, governance registration).
**Alternatives considered:** Keep it project-internal — rejected; the sponsor explicitly wants reusability for other high-value tasks.
**Consequences:** VLTHRTEAM becomes the named method the team operates under; future projects instantiate via its checklist rather than re-deriving the system.
**Affected systems:** Documentation architecture; future projects.
**Next action:** Reference VLTHRTEAM in agent onboarding (AGENTS.md bootstrap).

---

### D-018 — Team meeting-room system (internal tooling, not product)
**Status:** Accepted | **Scope:** INTERNAL (tooling, outside product scope table)
- Rooms = hosted HTML docs; sections/subsections are the shared context; chat + state via one Cloudflare Worker (free tier); static-host fallback works without the Worker.
- **Room Closed contract**: chair "End Meeting" flips `state.json` → room URL permanently serves Room Closed + auto-generated public recap (`recap.html`). URLs never 404.
- Spec + shell + sample room: `DOCS/ROOMS/` (README, room-shell.html, rooms/sample/).
- ponytail ceiling: no websockets, no video, no auth wall — `[auth]` + `[websockets]` flagged as upgrade paths only if needed.

---

**Decision ID:** D-019
**Decision:** QA release gate policy — QA PASS requires all tests green with no open Critical/High defects; High-severity exceptions are permitted only with documented PM risk acceptance; Critical security/data-integrity/payment defects are absolute release blockers unless the Executive Sponsor explicitly overrides.
**Status:** Accepted
**Owner:** QA/Test Engineer (owns evidence + risk classification); Product Manager (owns documented risk acceptance); Executive Sponsor (override authority).
**Reason:** Victoria's recommended option B — QA owns the evidence, Product owns business risk acceptance, Sponsor owns the override. Mirrors the authority model already in use (D-012).
**Evidence:** THREAD-48150ccb (ONBOARD-QA), QA question Q3 + PM reply.
**Alternatives considered:** (a) hard block on any open defect — too rigid for a soft-timeline MVP; (c) QA advisory only — rejected, guts the gate.
**Consequences:** QA fail is a real gate, not a suggestion; every High-severity release exception produces an audit-able PM acceptance record.
**Affected systems:** SDLC delivery flow, QA gate, release policy.

---

**Decision ID:** D-020
**Decision:** Staging model — ephemeral PR/preview environments plus one shared staging environment for integrated/UAT testing, constrained to run inside the $0 launch posture (free-tier-viable implementations only).
**Status:** Accepted with constraint
**Owner:** DevOps/Infra Engineer (cost check + provisioning once D-002 resolves); QA/Test Engineer (consumer).
**Reason:** Victoria's recommended option B gives fast PR feedback while preserving a controlled UAT environment.
**Evidence:** THREAD-48150ccb (ONBOARD-QA), QA question Q1 + PM reply.
**Alternatives considered:** (a) persistent staging only — slower feedback; (c) shared dev only until UAT — insufficient isolation for payment/capacity testing.
**Consequences:** DevOps must verify the chosen stack (D-002 outcome) supports previews + staging at $0; if it can't, escalate rather than breach D-010.
**Affected systems:** DevOps, QA, CI/CD pipeline.
**Next action:** DevOps confirms free-tier viability after OI-001 clears D-002.

---

**Decision ID:** D-021
**Decision:** Manual/cash payment is a required payment path alongside Paystack digital: members may pay cash/in-person on the day, recorded by a Marshal/Admin, with cash refunds handled manually and every manual payment creating a ledger entry + attestation in the audit trail.
**Status:** Proposed — sponsor ratification requested (materially changes the payment model)
**Owner:** Executive Product Sponsor (ratify); Backend/Systems Engineer + Integrations Specialist (implement).
**Reason:** Church Transport Department Liaison domain truth (2026-10-07): a subset of members relies on cash/in-person payment; a digital-only launch would exclude them. This is operational reality, not preference.
**Evidence:** THREAD-5259c5d9 (ONBOARD-LIAISON), liaison operational truth #2.
**Alternatives considered:** digital-only at launch — rejected by domain truth; deferring cash to Phase 2 — rejected, the excluded members are the launch users.
**Consequences:** Payment model gains a second settlement path; cash refunds cannot use the Paystack refund API (manual admin action); reconciliation and audit requirements grow (RISK-003). BookingGroup/payment flows must accommodate non-Paystack settlement states.
**Affected systems:** Payment system, booking state machine (payment-state variants), audit trail, Marshal/Admin dashboards.
**Next action:** Sponsor ratification; then Backend/Integrations fold the manual-payment path into the payment model design.

---

**Decision ID:** D-022
**Decision:** Data Science direction — (Q1) quota/workrate observed over a rolling 30-day window; (Q2) analytics MVP is the operational utilization dashboard (bookings, confirmations, no-shows, route/bus fill); (Q3) no-show forecasting becomes a production decision tool only after ≥6 months of complete booking/attendance data — heuristic counts only until then.
**Status:** Accepted
**Owner:** Data Science (vlthr-asset-generator@agentmail.to)
**Reason:** All three are analytics-scoping calls inside PM arbitration authority; the recommended options align with BRD §17 reporting, §3.7 quota calibration, and the product's immutability stance (models don't overwrite operational truth before they earn it).
**Evidence:** THREAD-9636e9f0 (ONBOARD-DATA-SCIENCE), DS questions Q1–Q3 + PM reply. *(Announced on-thread as D-018; renumbered — D-018 is the rooms-system decision.)*
**Consequences:** Utilization dashboard ships before quota tuning (RATE-2) and forecasting; DS designs metric definitions schema-agnostically pending D-002.
**Affected systems:** Reporting, analytics, §3.7 quota/workrate system.
**Next action:** DS produces the dashboard metric spec; data-contract dependency tracked as OI-011.

---

**Decision ID:** D-023
**Decision:** No card or payment-instrument data is ever stored on church systems. All payments route through provider-hosted checkout (Paystack and/or OPay) — the member is redirected to the provider, pays there, and the app receives only the confirmation/callback with a transaction reference, amount, and status.
**Status:** Proposed — pending sponsor ratification
**Owner:** Executive Product Sponsor (ratify); Backend/Systems Engineer + Integrations Specialist (implement); Security & Compliance Lead (verify data-handling claim).
**Reason:** The church holds no license or compliance posture for storing payment details. Provider-hosted checkout keeps PCI scope entirely outside the product — the app sees references, not instruments.
**Evidence:** Dev + Transport Department session 2026-10-09 ("we do not have a license — payment will be done on Paystack or OPay with their API"). Implemented in the working prototypes: `PROTOTYPE/member.html` v-pay presents provider selection + redirect, zero card fields.
**Alternatives considered:** storing card data in-app — rejected, unlicensed and non-compliant; Paystack-only — held open as OI-025 (OPay included as a member-familiar option pending cost/feature comparison).
**Consequences:** The payment model reduces to provider reference + amount + status + timestamps; webhook/callback reliability becomes the critical failure mode (OI-020 reconciliation applies); refund mechanics depend on each provider's API surface (OI-025). **Conflicts with D-021 (manual/cash path)** — see OI-023: the same session stated "no cash payment," which would reverse the earlier liaison finding.
**Affected systems:** Payment system, booking state machine, audit trail, Member app payment view, Admin payments dashboard.
**Next action:** Sponsor ratifies; D-021/OI-023 resolved in the same session (they are one payment-model decision).

---

**Decision ID:** D-024
**Decision:** Provisional stack direction: **TypeScript throughout**, **Next.js (App Router) on Vercel Pro** as the frontend and thin server layer, and **Supabase** (Postgres, Auth, Realtime, Storage, Edge Functions, pg_cron) as the backend of record. Business state changes go through Postgres functions (RPC) with row-level security. Provider webhooks and scheduled jobs run as Supabase Edge Functions.
**Status:** Proposed. Sponsor direction (2026-10-12). Ratification route chosen by sponsor (Q-001): the original respondents ratify at the OI-001 reconvene. Not yet ratified.
**Owner:** Executive Product Sponsor (direction); Backend/Systems Engineer and Database/Data Architect (ratify at OI-001 reconvene).
**Reason:** Sponsor preference. The PRD (§7.2 to §7.5, option B across the board) recommends this same combination. It fits the $0-to-low-cost posture only with the cost changes in OI-030. Single language reduces handoff cost for a small team.
**Evidence:** Sponsor input 2026-10-12; `PRD_TCN_Ikorodu_Transport_App.md` §7; vendor terms checked 2026-10-12 (`DEVOPS/DEVOPS-PLAN.md` §2). QA-LOG Q-001.
**Alternatives considered:** FastAPI + React + Postgres (D-002 option B, backend respondent preference); Next.js frontend with FastAPI backend (option C, two languages).
**Consequences:** Makes Supabase the single place where authorization, state transitions and audit live. Frontend must never hold service-role keys. Edge Functions use Deno, not Node, so shared code is limited to pure TypeScript domain types. Vercel Hobby cannot be used (OI-030).
**Affected systems:** All of `DOCS/ARCHITECTURE/`, `BACKEND/`, `FRONTEND/`, `DEVOPS/`, `DATA-MODEL/`.
**Next action:** Reconvene (OI-001) ratifies or rejects. Until then, design artifacts are written but no schema migration or API code is committed.

---

**Decision ID:** D-025
**Decision:** Booking state is modelled on **orthogonal axes**, not one flattened status list. Axis 1 is the booking lifecycle (`held`, `confirmed`, `cancel_pending`, `cancelled`, `expired`). Axis 2 is payment (own machine, see `STATE-MACHINES/`). Axis 3 is each rider's manifest status per leg (`awaiting`, `boarded`, `no_show`, `removed`). "Problem reported" is a flag backed by a support report, not a booking state. Refunds are a refund entity, not a booking state.
**Status:** Proposed.
**Owner:** Product Manager (scope); Database/Data Architect (schema).
**Reason:** The prototype used one `status` field for booking, payment, boarding and reports together (for example "HELD · PAYMENT DUE", "CONFIRMED", "BOARDED", "NO-SHOW"). A member can be paid but not boarded, and a rider can be boarded on the return leg only. One flat list cannot express those combinations without contradictions. Risk register L-1 (shadow mutability) is worse when states overlap.
**Evidence:** Prototype `PROTOTYPE/member.html` `STATUS` map and `PROTOTYPE/marshal.html` manifest logic. PRD §4.2 item 1 (lifecycle), PRD §6 item 6 (no-show as distinct terminal state, D-008).
**Alternatives considered:** Keep one flat list (rejected: contradictory combinations). Full statechart per entity in one library (deferred: adds machinery the ponytail ladder does not justify).
**Consequences:** Dashboards show three chips per booking, not one. Reporting counts per axis. Prototype labels must be updated to match before the next walkthrough.
**Affected systems:** Booking, payment, manifest, support, refund models; all three prototypes.
**Next action:** Confirm at walkthrough. Prototype alignment is a follow-up task.

---

**Decision ID:** D-026
**Decision:** Documentation standard adopted: `DOCS/CONVENTIONS/README.md` governs status headers, identifiers, reopening, and writing rules. Every multiple-choice question put to the sponsor is logged in `DECISION-LOGS/QA-LOG.md` before it is asked, with its answer recorded when given. Every `DOCS/` folder carries a README.
**Status:** Accepted (sponsor instruction, 2026-10-12).
**Owner:** Product Manager.
**Reason:** Sponsor asked for traceability of actions to decisions, to catch drift and to allow review of decisions.
**Evidence:** Sponsor message 2026-10-12. `QA-LOG.md` Batch 0 (earlier round) and Batch 1.
**Consequences:** Adds a small logging step to every question round. Drift between documents becomes a finding, not a silent difference.
**Affected systems:** Process and documentation only.
**Next action:** Applied to the Batch 1 answers (Q-001 to Q-004), 2026-10-12. Decisions D-027 to D-029 record the answers that changed scope or cost.

---

**Decision ID:** D-027
**Decision:** Production hosting at MVP is **Vercel Pro** (frontend and server layer, required for commercial use) with **Supabase Free** as the database platform, on the sponsor's choice. Conditions: revisit before the pilot gate; manage the pausing and backup risks in the meantime (DEVOPS-PLAN §5 and §1).
**Status:** Accepted (sponsor answer Q-002, option B). Not the option recommended in Q-002 (option A: Supabase Pro).
**Owner:** Executive Product Sponsor (decision); DevOps/Infra Engineer (conditions).
**Reason:** Sponsor cost posture. Vercel Pro is required by vendor terms; Supabase Free saves about $25 a month.
**Evidence:** QA-LOG Q-002. Vendor terms checked 2026-10-12 (DEVOPS-PLAN §2).
**Alternatives considered:** Vercel Pro + Supabase Pro (recommended, option A); free frontend host (option C, terms unverified).
**Consequences:** Projects can pause after a week of low activity (RISK-009). No automatic backups (RISK-010), so a scheduled off-platform dump is required before any real data is entered. Monthly running cost about $20 before SMS and email. Reopens the cost assumption in D-010 for the frontend only.
**Affected systems:** DevOps, backups, production provisioning (OI-030 closed as decided), ADR-0001.
**Next action:** DevOps sets up the scheduled dump and verifies whether a scheduled keep-alive query counts as activity (Verify). Revisit at the pilot gate (START-CHECKLIST A4).

---

**Decision ID:** D-028
**Decision:** SMS is an MVP channel for two uses: (1) marshal critical alerts (bus changes, breakdowns, cancellations) and (2) phone-number one-time codes for sign-in. Email and push remain the channels for all other notifications. WhatsApp Business API stays Phase 2 (OI-037).
**Status:** Accepted (sponsor answer Q-003, option C). **Reopens D-010** for SMS only.
**Owner:** Executive Product Sponsor; Integrations Specialist (vendor selection, OI-031).
**Reason:** Marshal alerts are operationally load-bearing (PRD §5). Phone-number sign-in (D-029) requires SMS.
**Evidence:** QA-LOG Q-003, Q-004. PRD §7.7 recommended push plus SMS.
**Alternatives considered:** push only (option A, rejected by sponsor); push and email with SMS in Phase 2 (option B, recommended, not chosen).
**Consequences:** Recurring per-message cost from launch, scaling with notifications and sign-ins. Budget figure needed before pilot. Vendor (Termii or Africa's Talking, to verify) needed before build.
**Affected systems:** Notifications, Auth, provider and vendor accounts (START-CHECKLIST B7), environment variables.
**Next action:** Integrations selects a vendor and records the per-message price (Verify) and a cost estimate against the pilot size (OI-031 remains open for vendor and cost).

---

**Decision ID:** D-029
**Decision:** Sign-in methods: **phone-number one-time code** for members and marshals; **admin sign-in requires an authenticator-app second factor**; **Google sign-in** is offered as an additional method, shown on the sign-in screen, and integrated when the app is deployed and running.
**Status:** Accepted (sponsor answer Q-004, custom answer "Other").
**Owner:** Security & Compliance Lead (design); UI/UX Designer (sign-in screen and Google button); Backend (integration at deployment).
**Reason:** The congregation identifies people by phone number. Google adds an option for members who prefer it. Admins hold the most privileged access (OI-039).
**Evidence:** QA-LOG Q-004. AUTH-DESIGN §2.
**Consequences:** Phone sign-in depends on D-028. Google sign-in proves identity only, not membership (AUTH-1). The Google button must follow Google's sign-in branding guidelines, which may not allow a bare "Google" label; check at integration (Verify). Prototype sign-in must be updated to match.
**Affected systems:** Auth, Frontend (sign-in screen), prototypes, Security.
**Next action:** UI/UX produces the sign-in screen with a Google button placeholder (not functional). Security confirms admin TOTP enrolment steps (OI-039).

## 2. Open-Issue Register

---

**Issue ID:** OI-001
**Description:** D-002 (stack), D-003 (seat-hold), and D-007 (duplicate-signup, jointly with AUTH-2) are unresolved and require the original Phase 1 respondents to reconvene.
**Why it matters:** Blocks all Database and Backend domain work — nothing in those two domains can start until this closes.
**Domain:** Cross-cutting (Backend, Database, Security).
**Owner:** PM to schedule; respondents to decide.
**Agents required:** Both original Phase 1 respondents, Backend/Systems Engineer (silent observer), Database/Data Architect (silent observer), Security & Compliance Lead (for the D-007/AUTH-2 joint question only).
**Options:** (a) single combined session covering all three; (b) two sessions — one for D-002+D-003 (technical), one for D-007+AUTH-2 (membership policy).
**Recommended resolution:** Option (b) — the technical pair (D-002/D-003) and the policy pair (D-007/AUTH-2) have different right people in the room; combining them risks the policy conversation getting rushed under technical framing.
**Decision required from:** Phase 1 respondents.
**Deadline/gate:** Before Database/Data Architect or Backend/Systems Engineer begin any schema or API work.
**Status:** Open — Blocking.
**Evidence update (2026-10-07):** QA (Victoria) formally recommended option B for D-003 — transactional seat reservation at booking initiation, payment completion/release via the state machine — as the testable acceptance invariant for the last-seat race (THREAD-48150ccb). Logged as reconvene input; strengthens the B-side. Does not change Blocked status.
**Agenda update (2026-10-08):** reconvene agenda now also covers OI-017 (seat-hold abuse limits — bound to D-003) and OI-015 (membership-register ownership — bound to D-007/AUTH-2 policy track).

---

**Issue ID:** OI-002
**Description:** File storage scope (Section 3.4 of Meeting Minutes 02) was never confirmed — specifically whether a manual payment-proof upload (bank-transfer screenshot) is retained as a fallback alongside Paystack.
**Why it matters:** Changes whether a file-storage/object-storage system is MVP or unnecessary.
**Domain:** Backend, Payment.
**Owner:** PM + Church Transport Department Liaison.
**Agents required:** Business stakeholder (liaison), Backend/Systems Engineer.
**Options:** (a) Paystack-only, no manual fallback; (b) manual proof-of-payment upload retained for edge cases Paystack can't cover.
**Recommended resolution:** (a) for MVP — Paystack webhook reconciliation (already decided, D-006) should cover the real cases; manual fallback reintroduces exactly the reconciliation problem this project exists to remove. Revisit only if a real gap appears post-launch.
**Decision required from:** Church Transport Department Liaison (operational reality check).
**Deadline/gate:** Before Backend scopes the Payment system build.
**Status:** Open — Non-blocking (has a recommended default; proceed on (a) unless liaison objects).
**Update (2026-10-07):** liaison confirmed a manual/cash payment path is essential (D-021, proposed). Note the mechanism differs — D-021 is *recording* a cash payment, not uploading proof — so OI-002 stays open pending sponsor ratification of D-021; if D-021 is ratified, OI-002's scope narrows to whether proof-upload is still needed on top of cash recording.
**Update (2026-10-08, R-12):** narrowed further — the residual question is now whether manual-payment records carry an optional receipt-photo field for dispute evidence, not a standalone upload system. Risk: cash payments without any artifact are unresolvable in later disputes.

---

**Issue ID:** OI-003
**Description:** Security, audit, roles/relationships, and immutability policy (Meeting Minutes 02 §4) remain named but unscoped.
**Why it matters:** Schema constraints (what's editable vs. append-only) need to be known before Database/Data Architect finalizes the schema — not after.
**Domain:** Security & Compliance.
**Owner:** Security & Compliance Lead.
**Agents required:** Security & Compliance Lead, Database/Data Architect, Backend/Systems Engineer.
**Options:** (a) dedicated working session now, ahead of schema work; (b) draft a first-pass policy unilaterally and circulate for objection.
**Recommended resolution:** (b) — given the soft timeline (D-011), there's room for a first-pass draft rather than waiting on a scheduled session; Security & Compliance Lead should propose an entity-by-entity mutable/immutable list and circulate it, escalating only genuine disagreements.
**Decision required from:** Security & Compliance Lead (proposes), PM (arbitrates objections).
**Deadline/gate:** Before Database schema lock (same gate as OI-001, but not blocked by it — can proceed in parallel).
**Status:** Open — Non-blocking, parallel track.

---

**Issue ID:** OI-004
**Description:** Whether the forced-PWA-install gate blocks all functionality pre-install, or allows a read-only browse mode (e.g. viewing programmes) before install is required.
**Why it matters:** Changes the Frontend landing-page build and the first-time-member journey map.
**Domain:** Frontend, UI/UX.
**Owner:** UI/UX Designer.
**Agents required:** UI/UX Designer, Frontend Engineer, PM.
**Options:** (a) fully gated — no content visible pre-install; (b) browse-only pre-install, booking/payment gated behind install.
**Recommended resolution:** (b) — lets a curious member see what's being asked of them before committing to an install step, likely reducing drop-off risk flagged in Meeting Minutes 02 §3.2 optimization notes, without weakening the install-for-push requirement (push only matters once someone's actually booking).
**Decision required from:** UI/UX Designer (proposes), PM (confirms).
**Deadline/gate:** Before Frontend begins the landing page / install flow.
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-005
**Description:** If D-002 resolves toward a self-hosted Postgres (FastAPI path), there is currently no backup strategy, and D-010 defers paid managed-backup tiers to Phase 2.
**Why it matters:** A $0-budget MVP with no DB backups is a real operational risk for payment records specifically, not a cosmetic gap.
**Domain:** DevOps, Database.
**Owner:** DevOps/Infra Engineer.
**Agents required:** DevOps/Infra Engineer, Database/Data Architect.
**Options:** (a) free-tier managed Postgres (Supabase free tier includes backups) regardless of D-002's backend-framework outcome; (b) self-hosted Postgres + a zero-cost `pg_dump` cron to off-box free storage (e.g. a free-tier object storage bucket) as an interim MVP backup.
**Recommended resolution:** (b) if D-002 selects FastAPI+Postgres — it's zero additional cost and closes the real risk without waiting for Phase 2 budget.
**Decision required from:** DevOps/Infra Engineer.
**Deadline/gate:** Before production launch, not before build start — can be resolved after D-002.
**Status:** Open — Non-blocking, contingent on D-002 outcome. **Logged as RISK-001 below.**

---

**Issue ID:** OI-006
**Description:** "Contribution quota system" raised ambiguously — could mean system/API rate-limiting by profile (Member/Host/Marshal/Admin), or internal team workload/contribution tracking. Meeting Minutes 02 §3.7.
**Why it matters:** These are two unrelated systems with different owners; building the wrong one wastes a full design-and-build cycle.
**Domain:** Security, Backend (if system rate-limiting); People-ops/PM (if team workload).
**Owner:** PM to get clarification; Security & Compliance Lead to design once confirmed.
**Agents required:** Executive Product Sponsor (clarify intent), Security & Compliance Lead, Backend/Systems Engineer.
**Options:** (a) confirm system/API rate-limiting (working assumption, Meeting Minutes 02 §3.7); (b) confirm internal contributor workload tracking; (c) both, as two separate initiatives.
**Recommended resolution:** (a) — consistent with the "security and infrastructure" framing in the raw note; proceed on this assumption unless corrected.
**Decision required from:** Executive Product Sponsor.
**Deadline/gate:** Before Security & Compliance Lead begins rate-limiting design.
**Status:** Open — Non-blocking (proceeding on recommended default).

---

**Issue ID:** OI-007
**Description:** "Insurance system" raised ambiguously — technical backup/DR (ties to RISK-001) vs. a literal financial/cyber-insurance policy. Meeting Minutes 02 §3.8.
**Why it matters:** Technical backup/DR is an engineering task DevOps can start now at $0 cost; a financial insurance policy is a procurement decision for church leadership with real premium cost — conflating them risks neither getting properly owned.
**Domain:** DevOps (technical); Church Transport Department / leadership (financial).
**Owner:** DevOps/Infra Engineer (backup/DR); Church Transport Department Liaison (insurance policy question).
**Agents required:** DevOps/Infra Engineer, Church Transport Department Liaison.
**Options:** (a) treat as backup/DR only for now, surface the financial-insurance question to leadership separately; (b) pursue both in parallel.
**Recommended resolution:** (a) — backup/DR is free and urgent (RISK-001); a cyber-insurance policy is a separate, non-blocking leadership conversation that shouldn't hold up engineering work.
**Decision required from:** PM (splits the two), Church Transport Department Liaison (carries the insurance question to leadership).
**Deadline/gate:** Backup/DR before launch (same gate as RISK-001); insurance policy question has no engineering gate.
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-008
**Description:** Multi-product shared-database readiness raised as a future consideration — unclear if a second product is actually planned. Meeting Minutes 02 §3.9.
**Why it matters:** Decides whether schema-naming discipline (near-zero cost) is applied now or this is purely speculative and deferred.
**Domain:** Database/Data Architect.
**Owner:** PM to confirm with sponsor; Database/Data Architect to apply if confirmed.
**Agents required:** Executive Product Sponsor, Database/Data Architect.
**Options:** (a) apply schema/table namespacing now regardless (cheap insurance either way); (b) defer entirely until a second product is concretely planned.
**Recommended resolution:** (a) — the cost of namespacing tables under a `transport.` boundary now is negligible; the cost of retrofitting after a second product exists is not. Do it now even without a confirmed second product.
**Decision required from:** Database/Data Architect (implementation), PM (confirms it's worth the trivial upfront cost).
**Deadline/gate:** Before Database/Data Architect finalizes schema (same gate as OI-001/D-002).
**Status:** Open — Non-blocking, recommended default is to just do it.

---

**Issue ID:** OI-009
**Description:** "Context management system" raised with no supporting detail. Meeting Minutes 02 §3.10 offers three candidate readings (request/event context, operational/business context propagation, conversational/support context) and recommends treating it as a shared request-context object feeding the audit system (OI-003).
**Why it matters:** Building this wrong — or building a conversational/AI-context system nobody asked for — wastes effort; not building some form of it weakens OI-003's audit trail from the start.
**Domain:** Backend, Security.
**Owner:** Backend/Systems Engineer (design), Security & Compliance Lead (consumer, via audit trail).
**Agents required:** Executive Product Sponsor (confirm intent), Backend/Systems Engineer, Security & Compliance Lead.
**Options:** (a) confirm request/event-context object (recommended, Meeting Minutes 02 §3.10 working assumption); (b) something else entirely — needs the sponsor to describe it, since no detail exists yet.
**Recommended resolution:** (a) — design one shared context object (actor, role, acting-on-behalf-of, programme/booking reference) consumed by Booking, Payment, Notification, and Audit, built in the same pass as OI-003.
**Decision required from:** Executive Product Sponsor (confirm before design), then Backend/Systems Engineer + Security & Compliance Lead (joint design).
**Deadline/gate:** Before OI-003's audit-trail first-pass is finalized — they should land together.
**Status:** Open — Non-blocking, proceeding on recommended default pending confirmation.

---

**Issue ID:** OI-010
**Description:** Agent-communication mail service selection.
**Status:** **RESOLVED** — Sponsor selected AgentMail (free tier). Org provisioned, 3 inboxes live, PM scoped key verified, bootstrap sent. Residual: expansion beyond 3 inboxes needs either the sponsor's second account or a paid tier — tracked under D-015's consequences, not a blocker.

---

**Issue ID:** OI-011
**Description:** Data Science requires a data contract — authoritative schema + data dictionary, anonymized extracts or synthetic-equivalent datasets, and access to approved pilot/production aggregates — before empirical work (workrate calibration, forecasting) can begin.
**Why it matters:** Without the contract, analytics ships blind or stalls entirely once real data exists; without anonymization rules, member PII handling is undefined.
**Domain:** Data Science + Database.
**Owner:** Data Science (specifies needs); Database/Data Architect (produces schema/dictionary); Security & Compliance Lead (anonymization standard).
**Agents required:** Data Science, Database/Data Architect, Security & Compliance Lead.
**Recommended resolution:** DS defines the metric + data-need spec now (schema-agnostic); Database produces the dictionary once D-002 clears; Security sets the anonymization standard in the OI-003 pass.
**Decision required from:** none new — sequencing only.
**Deadline/gate:** Schema artifact lands after OI-001 (D-002); anonymization standard before any real data is extracted.
**Status:** Open — Non-blocking (analysis design proceeds; empirical work gated on D-002).

---

*OI-012 through OI-022 below originate from `DOCS/RISK-ASSESSMENT.md` (2026-10-08) — the immutability-philosophy loophole review (L-1…L-8) plus product loophole hunt (R-01…R-12). Philosophy-mapped findings are tagged [L-#]; product findings [R-#].*

---

**Issue ID:** OI-012
**Description:** Correction & dispute authority is undefined — no sanctioned path exists to fix a wrongly recorded booking, payment, or no-show, and no member dispute channel exists. [L-2, L-3, L-6]
**Why it matters:** An immutable log with no correction path produces either permanent wrong records (members lose standing unfairly) or shadow corrections outside the system — both poison the audit trail's truth. If correcting is painful, staff route around it.
**Domain:** Security & Compliance (policy), Backend (supersession mechanism), Admin (workflow).
**Owner:** Security & Compliance Lead.
**Agents required:** Security & Compliance Lead, Backend/Systems Engineer, PM, Church Transport Department Liaison (dispute-path reality check).
**Options:** (a) correction-by-supersession — a new audited event pointing at the wrong record, scoped by role (Marshal corrects check-ins, Admin corrects payments), plus a member-visible "report an error" request → Admin resolves; (b) admin-only corrections, no member channel; (c) PM/dev intervention per case — rejected, guarantees workarounds.
**Recommended resolution:** (a) — matches the philosophy's replace-don't-edit principle; corrections framed as normal workflow, not disciplinary events (blame-culture guard).
**Decision required from:** Security & Compliance Lead (proposes policy), PM (confirms), Sponsor (arbitrates admin-level correction disputes).
**Deadline/gate:** Same gate as OI-003 — fold into the mutability/immutability pass.
**Status:** Open — Non-blocking, parallel track.

---

**Issue ID:** OI-013
**Description:** Audit-review cadence & admin-oversight — the audit trail currently has writers but no readers; nobody is assigned to review admin actions, and no anomaly/digest reporting exists. [L-4, R-10]
**Why it matters:** An audit log nobody reads is ceremony, not control — the first integrity failure (including admin misconduct: manual cancellations, refund abuse) would go unnoticed indefinitely.
**Domain:** Security & Compliance, Reporting.
**Owner:** Security & Compliance Lead (review design); PM (digest spec).
**Agents required:** Security & Compliance Lead, Data Science (digest generation), Executive Product Sponsor (review consumer).
**Options:** (a) weekly auto-generated admin-activity digest to sponsor + anomaly flags (manual payments, mass cancellations, after-hours edits); (b) manual audit review on demand only; (c) full export deferred to Phase 2 with no interim review.
**Recommended resolution:** (a) — cheap, uses the reporting engine already in MVP scope; full exportable audit stays Phase 2.
**Decision required from:** PM (spec), Security & Compliance Lead (anomaly rules).
**Deadline/gate:** Before launch — must exist the day real data does.
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-014
**Description:** Operational coverage — only one trained Admin is planned; if that person is unavailable, the system inherits the same single-point-of-failure it was built to remove. [L-5]
**Why it matters:** Booking management, refunds, and marshal assignment all concentrate in the Admin role; a single-person dependency recreates the WhatsApp-era bottleneck one level up.
**Domain:** Operations/People.
**Owner:** Executive Product Sponsor + Church Transport Department Liaison.
**Agents required:** Sponsor (staffing decision), Liaison (nominates coverage), UI/UX (training-material input).
**Options:** (a) minimum two trained Admins + written runbook + periodic marshal cross-training; (b) single admin with documented procedures only; (c) single admin, no runbook.
**Recommended resolution:** (a) — a policy decision, not code; costs nothing but discipline.
**Decision required from:** Executive Product Sponsor.
**Deadline/gate:** Before launch (training must precede go-live).
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-015
**Description:** Membership-register stewardship — the pre-loaded member roll (AUTH-2's likely gate) has no named owner, no refresh cadence, and no defined handling for people not on the roll (new members, lapsed entries, account-sharing attempts). [L-7, R-08]
**Why it matters:** A stale gate locks out real members and lets departed ones keep access — and booking names that don't match roll identities create a membership-bypass path.
**Domain:** Security & Compliance (policy), Church Transport Department (data ownership).
**Owner:** Church Transport Department Liaison (roll data); Security & Compliance Lead (rules).
**Agents required:** Liaison, Security & Compliance Lead, Backend/Systems Engineer.
**Options:** (a) Liaison/transport dept owns the roll with a defined re-export cadence; not-on-roll signups are flagged-for-review, never rejected outright; (b) admin ad-hoc maintenance, no cadence; (c) open signup, no roll — rejected by AUTH-1.
**Recommended resolution:** (a) — links directly to the D-007/AUTH-2 joint resolution; the roll's owner should be decided in the same conversation.
**Decision required from:** Church Transport Department Liaison + Sponsor.
**Deadline/gate:** Same session as D-007/AUTH-2 resolution (OI-001's policy track).
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-016
**Description:** Entity lifecycle & retirement paths — expired holds, stale waitlists, past programmes, and departed marshals have no defined end states; nothing owns retiring artifacts. [L-8]
**Why it matters:** Every sealed entity needs a retirement path or the system accumulates zombie state — expired holds holding seats, ex-marshals retaining access, old programmes polluting reports.
**Domain:** Database/Data Architect.
**Owner:** Database/Data Architect.
**Agents required:** Database/Data Architect, Security & Compliance Lead, Backend/Systems Engineer.
**Options:** (a) every entity gets explicit lifecycle states including expired/retired/revoked, plus a sweeper for time-boxed states (holds); (b) handle retirement ad hoc per entity as problems arise.
**Recommended resolution:** (a) — fold into OI-003's entity-by-entity mutability classification; same pass, same document.
**Decision required from:** Database/Data Architect (proposes), Security & Compliance Lead (confirms).
**Deadline/gate:** With OI-003, before schema lock.
**Status:** Open — Non-blocking, parallel track.

---

**Issue ID:** OI-017
**Description:** Seat-hold abuse controls — nothing prevents a member from repeatedly holding seats and letting them expire, starving real demand. [R-01]
**Why it matters:** Whichever way D-003 resolves, time-boxed holds create a soft denial-of-seat attack that pure capacity logic can't see; ties to §3.7 quota design.
**Domain:** Backend, Security.
**Owner:** Backend/Systems Engineer.
**Agents required:** Backend/Systems Engineer, Security & Compliance Lead (quota linkage).
**Options:** (a) max concurrent holds per member + repeat-expiry counter feeding the per-profile quota; (b) rely on hold expiry alone; (c) holds only for paid programmes.
**Recommended resolution:** (a) — decided alongside D-003 in the reconvene; the hold and the abuse rule are one design.
**Decision required from:** Phase 1 respondents (as part of D-003).
**Deadline/gate:** Inside OI-001 — added to the reconvene agenda.
**Status:** Open — Blocking-adjacent (resolves with D-003).

---

**Issue ID:** OI-018
**Description:** Group partial-refund rule — when a Host paid ₦10,000 for 4 riders and one beneficiary cancels before the event day, who receives the ₦2,500 refund, and can a host cancel one beneficiary while keeping the rest? [R-02; flagged by Backend, open since Meeting Minutes 02 §3.1]
**Why it matters:** Bulk payment is MVP (D-011); an undefined partial-refund path surfaces as support chaos the first time a group partially cancels — and "refund to host vs beneficiary" is a policy call engineering can't infer.
**Domain:** Payment, Policy.
**Owner:** Executive Product Sponsor (policy); Backend/Systems Engineer (implementation).
**Agents required:** Sponsor, Integrations Specialist (Paystack partial-refund mechanics), Liaison.
**Options:** (a) refund to host (the payer — matches the receipt model), beneficiary seat released; (b) refund per-beneficiary — requires beneficiary payment instruments that don't exist; (c) group bookings are all-or-nothing for refunds.
**Recommended resolution:** (a) — simplest consistent answer with PAY-5's host-as-payer model; (c) as fallback if Paystack partial refunds prove impractical.
**Decision required from:** Executive Product Sponsor.
**Deadline/gate:** Before the payment-model build (Phase A/B boundary).
**Status:** Open — Non-blocking until payment build.

---

**Issue ID:** OI-019
**Description:** Day-of-travel exception flows are underspecified — no handling exists for: a bus not arriving/cancelling day-of (R-03, nothing in the BRD covers it), member ticket recovery after phone loss (R-09), and members with notifications disabled missing departure changes (R-11).
**Why it matters:** These are the failure modes that hit on actual travel days, in the car park, with passengers standing there — improvising them live recreates the manual chaos the system replaces.
**Domain:** Backend (states), Marshal dashboard, Admin dashboard.
**Owner:** PM (flow spec); Backend/Systems Engineer (implementation).
**Agents required:** PM, Backend, UI/UX, Liaison (which exceptions actually occur).
**Options:** (a) "bus cancelled" state → mass-notify confirmed passengers + offer rebook/refund; marshal lookup by name/booking-ref for lost phones; marshal carries fallback comms; (b) handle each exception manually per incident.
**Recommended resolution:** (a) — the bus-cancelled case is a genuine spec hole needing a new state + notification trigger; the others are cheap additions to existing surfaces.
**Decision required from:** PM (spec), Sponsor (confirm refund-on-bus-cancel policy).
**Deadline/gate:** Before launch-readiness pass (Phase C).
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-020
**Description:** Missed-webhook reconciliation — if Paystack's payment webhook never arrives, a paid member's seat stays pending until its hold expires and releases. [R-04]
**Why it matters:** Webhooks are the payment source of truth (D-006) but are not guaranteed delivery; without a fallback poller, real payments can silently fail to confirm — the single worst member-facing failure mode in the system.
**Domain:** Backend, Integrations.
**Owner:** Integrations Specialist (Payments).
**Agents required:** Integrations Specialist, Backend/Systems Engineer.
**Options:** (a) scheduled reconciliation job polls Paystack transaction status for aged pending payments (rides the D-004 scheduler); (b) manual admin check on member complaint only.
**Recommended resolution:** (a) — near-zero cost on infrastructure already decided; closes the gap the webhook-first model leaves open.
**Decision required from:** None — implementation detail within D-006; logged for tracking.
**Deadline/gate:** Before launch (Phase C testing should simulate a dropped webhook).
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-021
**Description:** Waitlist policy — the prototype shows a "join waitlist" affordance for full buses, but no waitlist decision exists anywhere in the decision log; the scope table classifies waitlist as FUTURE (BRD §15). [R-05 — spec/UI leak]
**Why it matters:** Either the prototype promises something the product won't ship (member-facing overpromise), or the scope classification is stale — one of them is wrong and needs reconciling before UI copy ships.
**Domain:** PM (scope), UI/UX (copy), Backend (if implemented).
**Owner:** PM.
**Agents required:** PM, Sponsor (scope call), UI/UX Designer.
**Options:** (a) confirm FUTURE and strip the affordance from the prototype/UI copy; (b) pull a minimal waitlist (full → notify-on-release) into MVP.
**Recommended resolution:** (a) for MVP — full means full at launch; notify-on-release is a Phase-2 candidate. Fix the prototype copy.
**Decision required from:** Executive Product Sponsor (confirm scope), PM (update artifacts).
**Deadline/gate:** Before UI copy is finalized.
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-022
**Description:** Cancellation-cutoff boundary is undefined — "before the event day" (PAY-6) is ambiguous at the edges: is 23:59 the night before refundable? Is a 6:00 AM departure cutoff midnight, or departure minus N hours? [R-06 — flagged by QA]
**Why it matters:** The refund window is an automated rule (D-006); an ambiguous boundary becomes either unfair denials or unintended refunds, and QA can't test an undefined clock.
**Domain:** Policy, Backend.
**Owner:** Executive Product Sponsor (policy); QA (test definition).
**Agents required:** Sponsor, Backend/Systems Engineer, QA/Test Engineer.
**Options:** (a) cutoff = programme departure time − N hours (recommended N=12, effectively "night before"); (b) literal calendar-day boundary (midnight before event date); (c) per-programme configurable cutoff.
**Recommended resolution:** (a) — "before the event day" most plausibly means "with enough notice to resell the seat"; departure-relative is fairer for evening programmes. Pick N with the liaison.
**Decision required from:** Executive Product Sponsor.
**Deadline/gate:** Before refund automation build + QA test writing.
**Status:** Open — Non-blocking.

---

*OI-023 through OI-028 below originate from the Dev + Transport Department session (2026-10-09): special-event governance, payment-provider compliance, support channels, the canonical state machine, and guest/first-timer registration. Logged in `DOCS/MEETING-NOTES-03-Dev-Transport-Session.html`; demonstrated in the working prototypes (`PROTOTYPE/`).*

---

**Issue ID:** OI-023
**Description:** Payment-model conflict — D-021 (manual/cash path, from liaison domain truth 2026-10-07) is contradicted by the transport department's 2026-10-09 session position: "no cash payment." The two cannot both be the launch payment model.
**Why it matters:** D-021 was proposed to protect cash-reliant members; if the department now confirms fully-digital, the cash path, its ledger/attestation overhead, and RISK-003 all drop away — but if "no cash" means "no cash handling at the bus" while office transfer payments continue, the system still needs a manual-recording variant. The wrong reading either excludes members or builds unused machinery.
**Domain:** Policy, Payment.
**Owner:** Executive Product Sponsor.
**Agents required:** Sponsor, Church Transport Department Liaison, Integrations Specialist.
**Options:** (a) fully digital — retire D-021, Paystack/OPay only; (b) digital-only at the bus + admin records office/bank-transfer payments (D-021 narrows to an admin-only settlement flag); (c) keep D-021 as proposed (marshal records cash at boarding).
**Recommended resolution:** Clarify intent first — likely (b): "no cash" typically means no physical collection at the bus, not no manual records. Whichever resolves, the payment state machine stays identical for all settlement types (L-1 discipline).
**Decision required from:** Executive Product Sponsor + Transport Department.
**Deadline/gate:** Before payment-model build + OI-025 provider work.
**Status:** Closed by Q-006 (D-033): fully digital payments. See the supersession table in section 1.0.

---

**Issue ID:** OI-024
**Description:** Special-event governance is undefined — the department confirmed Hallelujah Night-type programmes are Admin-created special events, but the rules of creation, transport configuration, and cancellation handling were not specified.
**Why it matters:** Special events are the paid, high-stakes programmes (capacity × price × refund exposure). Undefined creation rules mean any admin action is improvisational; undefined cancellation rules mean the OI-019 "bus cancelled" hole recurs at programme scale — an entire event cancelled with N confirmed paid passengers.
**Domain:** Product, Policy.
**Owner:** PM (spec); Transport Department (rules); Sponsor (ratify).
**Agents required:** Sponsor, Liaison, PM, Backend/Systems Engineer.
**Options:** (a) special event = programme template + admin-configured date/price/capacity/window, reusing the standard booking flow (prototype implements this); (b) special events as a separate entity with event-specific rules (legs, routes, marshal assignment) — heavier, more flexible.
**Recommended resolution:** (a) — prototype demonstrates the reuse path works; document per-event config (price, booking window, bus assignment, cancellation policy) as required fields. Cancellation must trigger the mass-notify + refund/void path (binds OI-019, refund policy OI pending).
**Decision required from:** Transport Department (rules) + Sponsor.
**Deadline/gate:** Before special-event section of final PRD.
**Status:** Open — Non-blocking (prototype assumes (a)).

---

**Issue ID:** OI-025
**Description:** Provider specifics undecided — Paystack only, OPay only, or both? And per-provider: which payment channels (card/transfer/USSD/wallet), webhook vs polling confirmation, and refund API capabilities.
**Why it matters:** The provider choice sets the integration surface, settlement timing, fee structure (relevant to refund math in OI-018), and the member experience — OPay's wallet is familiar to the congregation, Paystack's API/docs are stronger for the dev team.
**Domain:** Payment, Backend.
**Owner:** Integrations Specialist; Sponsor (ratify).
**Agents required:** Integrations Specialist, Backend/Systems Engineer, Liaison (member familiarity).
**Options:** (a) Paystack only — single integration, mature docs; (b) OPay only — member familiarity, transfer-first; (c) both, member picks at checkout (prototype implements this) — better UX, double integration + reconciliation surface.
**Recommended resolution:** (a) for MVP if fees/channels suffice — add the provider abstraction so OPay can be a Phase 2 addition without schema change (cheap-replacement discipline). If the department reports OPay-wallet reliance, flip to (c) now.
**Decision required from:** Sponsor after Integrations comparison (fees, channels, webhook reliability, refund API).
**Deadline/gate:** Before payment integration build — same session as OI-023.
**Status:** Open — Non-blocking on design, blocking on integration.

---

**Issue ID:** OI-026
**Description:** Support-channel model is undefined — the session confirmed member↔marshal and marshal↔admin contact via WhatsApp/phone for now, but in-app reporting (member "report a problem," marshal "app bug"/incident) now exists in the prototype with no defined intake, ownership, or SLA behind it.
**Why it matters:** A report button that goes nowhere is worse than no button — it creates an expectation of response and an authority vacuum (L-3): who triages, who owns the wrong-no-show dispute (OI-012), how fast must the first-timer approval queue move for the support load it generates?
**Domain:** Operations, Product.
**Owner:** Transport Department (ownership); PM (SLA/intake spec).
**Agents required:** Sponsor, Liaison, PM.
**Options:** (a) reports land in the admin dashboard queue (prototype implements) — admin triages, status tracked in-app; (b) reports go to a shared mailbox/WhatsApp group, app keeps only the submission receipt; (c) hybrid — booking disputes in-app, bugs to the dev team channel.
**Recommended resolution:** (a) — the queue already demonstrates the target; define per-category ownership (booking problems → admin, bugs → dev contact, travel-day emergencies → phone/WhatsApp stays primary) and a response expectation. WhatsApp/phone remain the emergency channel regardless — document, don't replace.
**Decision required from:** Transport Department + Sponsor.
**Deadline/gate:** Before support surfaces ship in final PRD.
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-027
**Description:** No canonical state machine exists — the prototype implements held/confirmed/cancelled/expired/boarded/no-show, but allowed transitions, authorization per transition, and terminal-state rules were never formally specified.
**Why it matters:** Every L-finding traces back to this: corrections (OI-012), audit (OI-013), refund timing (OI-018/OI-022), day-of exceptions (OI-019) all depend on which state a record is in and who's allowed to move it. Without the table, every engineer codes their own transitions — shadow mutability by construction.
**Domain:** Backend, Product.
**Owner:** PM (author the table); Backend/Systems Engineer + Database Architect (validate).
**Agents required:** PM, Backend, Database, Security & Compliance Lead.
**Options:** (a) single canonical table in the PRD — entities × states × allowed transitions × actor × audit requirement (recommended); (b) scattered per-feature definitions — rejected, that's how the hole happened.
**Recommended resolution:** (a) — prototype's STATUS map + the OI-012 supersession rule are the seed. Must include: booking (draft→held→confirmed→{boarded, no-show, cancelled, expired}), payment (pending→redirected→{confirmed, failed, expired, refunded}), registration (submitted→pending→{approved, rejected, more-info}), guest (invited→registered→{approved, declined, removed}), event (draft→published→open→paused→closed→in-progress→completed | cancelled), support report (submitted→received→assigned→investigating→{resolved, closed}).
**Decision required from:** PM + Backend/Database sign-off; Sponsor notified.
**Deadline/gate:** Before Backend schema work — gates with OI-001.
**Status:** Open — Non-blocking for prototype, blocking for implementation.

---

**Issue ID:** OI-028
**Description:** Registration-path governance — the session settled first-timer = admin-approved, and guest signup = two-path (public w/ approval OR link w/o approval), plus members onboarding guests. Still undefined: approval turnaround SLA, what "approved" checks (register match? phone? host vouch?), guest-to-member conversion, and per-member guest caps.
**Why it matters:** First-timers are the growth surface — mostly arriving via family/friends (department's own observation). A slow approval queue turns the welcome into a wall; an unchecked link path recreates the open-door problem the member gate was built to close.
**Domain:** Policy, Product.
**Owner:** Transport Department (rules); PM (spec).
**Agents required:** Sponsor, Liaison, PM, Security & Compliance Lead.
**Options:** (a) SLA-bound queue — e.g. approve within 24h, auto-notify; (b) host-vouch shortcut — a member's named guest bypasses queue (link path already does this); (c) hybrid — queue default + invite-link exemption + member-onboarded guests attached to host record.
**Recommended resolution:** (c) — it matches what the department actually described. Define: max guests per member per programme, whether link-signup shows the inviter, and conversion path guest→member (register re-check + admin approval, same as first-timer).
**Decision required from:** Transport Department + Sponsor.
**Deadline/gate:** Before AUTH section of final PRD — pairs with OI-001's D-007 resolution.
**Status:** Open — Non-blocking.

---

*OI-029 through OI-040 originate from the 2026-10-12 stack and deployment review (`DOCS/DEVOPS/`, `DOCS/PAYMENTS/`, `DOCS/AUTH/`, `DOCS/NOTIFICATIONS/`). Recommendations for every open issue are in `DOCS/RECOMMENDATIONS/OPEN-ISSUE-RECOMMENDATIONS.md`.*

---

**Issue ID:** OI-029
**Description:** Where provider webhooks and scheduled jobs run, and how the write path is structured (RPC from client, Edge Function for provider and job work, or Next.js route handlers).
**Why it matters:** Decides who holds provider secrets, how webhook signatures are verified, and whether payment confirmation can be replayed safely. Affects every money-moving path.
**Domain:** Backend, Payment.
**Owner:** Backend/Systems Engineer.
**Agents required:** Backend/Systems Engineer, Database/Data Architect, Integrations Specialist.
**Options:** (a) Supabase Edge Functions for webhooks and jobs; (b) Next.js route handlers on Vercel for webhooks; (c) split: Edge Functions for webhooks and jobs, route handlers only for server-rendered pages.
**Recommended resolution:** (c). Edge Functions keep webhooks and cron on the database's platform (cron on Vercel Hobby is once a day, and Pro is required anyway for commercial use). Route handlers stay free of secrets. See `ARCHITECTURE/ADR/ADR-0002-write-path.md`.
**Decision required from:** Backend/Systems Engineer (ratify at reconvene).
**Deadline/gate:** Before payment integration build.
**Status:** Open — Blocking payment build (not schema).

---

**Issue ID:** OI-030
**Description:** Production hosting costs versus vendor terms. Vercel Hobby is non-commercial only and lists processing payments from visitors as commercial use. Supabase Free pauses after one week of low activity and has no automatic backups. Both conflict with the $0 posture (C-001, D-010) if taken literally.
**Why it matters:** Running this app on Hobby is a terms breach. Running it on Supabase Free risks the project pausing during a quiet week and losing the RISK-001 backup guarantee.
**Domain:** DevOps, Sponsor (budget).
**Owner:** Executive Product Sponsor (budget decision); DevOps/Infra Engineer (implementation).
**Agents required:** Sponsor, DevOps/Infra Engineer, Product Manager.
**Options:** (a) Vercel Pro (about $20/mo) + Supabase Pro (about $25/mo); (b) Vercel Pro + Supabase Free with manual backups; (c) free frontend host (terms to verify) + Supabase Free.
**Recommended resolution:** (a) for production. (b) is acceptable for staging only. (c) requires terms verification and carries the pausing and backup risks.
**Decision required from:** Executive Product Sponsor (budget). Q-002 in QA-LOG.
**Deadline/gate:** Before production hosting is provisioned.
**Status:** Decided by Q-002: sponsor chose option (b), Vercel Pro + Supabase Free (D-027). Conditions: revisit at pilot gate; RISK-009 and RISK-010 managed. Original recommendation (a) remains on record.

---

**Issue ID:** OI-031
**Description:** Marshal critical alerts and OTP sign-in need an SMS channel. PRD §7.7 recommends push plus SMS. D-010 places SMS in Phase 2.
**Why it matters:** A boarding-list change missed by a marshal means a bus leaves with the wrong passenger list. SMS also gates phone-OTP sign-in (Q-004).
**Domain:** Notifications, Auth, Sponsor (budget).
**Owner:** Product Manager (conflict); Integrations Specialist (vendor).
**Agents required:** Sponsor, Integrations Specialist, UI/UX Designer.
**Options:** (a) push and email at MVP, SMS in Phase 2; (b) push plus SMS at MVP (reopens D-010); (c) SMS only.
**Recommended resolution:** (a), with a pilot exit criterion: missed-alert rate measured, and SMS added if it exceeds the threshold agreed in the pilot. Vendor candidates to compare: Termii, Africa's Talking (pricing to verify).
**Decision required from:** Executive Product Sponsor. Q-003 in QA-LOG.
**Deadline/gate:** Before notification design freeze and Auth sign-in method is chosen.
**Status:** Channel decided by Q-003: push and SMS at MVP for marshal alerts and sign-in codes (D-028). Vendor selection and cost remain open. Conflict with D-010 resolved by reopening it for SMS.

---

**Issue ID:** OI-032
**Description:** Database region. Supabase's region list at the 2026-10-12 check contains no South African region. Vercel functions can run in Cape Town (`cpt1`, Pro only).
**Why it matters:** Seat-hold and booking calls make several database round-trips. Long latency from Lagos to a European or Indian region is felt on every tap.
**Domain:** DevOps, Backend.
**Owner:** DevOps/Infra Engineer.
**Agents required:** DevOps/Infra Engineer, Backend/Systems Engineer.
**Options:** (a) nearest Supabase region by measured latency (London, Frankfurt, Paris, Mumbai to test); (b) wait for an African region; (c) co-locate nothing and accept latency.
**Recommended resolution:** (a). Measure round-trip time from Lagos test connections before choosing. Set Vercel functions to `cpt1` for the frontend server layer.
**Decision required from:** DevOps/Infra Engineer.
**Deadline/gate:** Before production project is created (region cannot be changed after creation without migration).
**Status:** Open — Non-blocking for design; blocking for production provisioning.

---

**Issue ID:** OI-033
**Description:** Provider API contracts (Paystack and OPay) must be verified against live documentation and sandbox accounts before any payment code is written. Assumptions in `PAYMENTS/PAYMENTS-DESIGN.md` are recorded as Verify.
**Why it matters:** Signature schemes, refund endpoints and callback fields are exactly where a payment integration silently breaks.
**Domain:** Payment, Integrations.
**Owner:** Integrations Specialist.
**Agents required:** Integrations Specialist, Backend/Systems Engineer, QA.
**Options:** (a) verify each contract in sandbox and record results in `PAYMENTS/PROVIDER-CONTRACTS.md`; (b) build from documentation alone.
**Recommended resolution:** (a). Paystack first (D-006 already assigns onboarding).
**Decision required from:** Integrations Specialist.
**Deadline/gate:** Before payment build starts.
**Status:** Open — Non-blocking for design; blocking for payment build.

---

**Issue ID:** OI-034
**Description:** Design system for production. The three prototypes use the burnt-orange/yellow VLTHRLAB system. The church-facing specification and meeting notes use the blue VLTHR system.
**Why it matters:** Two visual systems across one product confuse users and make the church-facing PDF disagree with the app.
**Domain:** UI/UX, Sponsor.
**Owner:** UI/UX Designer (proposal); Executive Product Sponsor (choice).
**Agents required:** UI/UX Designer, Sponsor, Frontend Engineer.
**Options:** (a) orange for role apps, blue for documents; (b) one system (blue) across apps and documents; (c) one system (orange) across apps and documents.
**Recommended resolution:** (b) for a single identity, with prototypes kept as walkthrough artifacts.
**Decision required from:** Executive Product Sponsor.
**Deadline/gate:** Before frontend component library is started.
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-035
**Description:** Test tooling. QA's earlier recommendation (pytest, Playwright, k6) assumed a Python backend. The stack direction in D-024 is TypeScript.
**Why it matters:** Test tooling choice shapes CI setup and who can write tests.
**Domain:** QA, DevOps.
**Owner:** QA/Test Engineer.
**Agents required:** QA, DevOps.
**Options:** (a) TypeScript-native: Vitest, Playwright, pgTAP for SQL, k6 for load (language-neutral); (b) keep pytest for the backend.
**Recommended resolution:** (a). Playwright and k6 are kept from QA's recommendation. pytest is dropped unless the backend returns to Python (D-024 reopen).
**Decision required from:** QA/Test Engineer (accept).
**Deadline/gate:** Before CI pipeline is built.
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-036
**Description:** Refund policy has no owner or drafting date. OI-018 (group partial refunds) and OI-022 (cancellation cutoff) are symptoms of one policy that the department has not written.
**Why it matters:** Refund automation (D-006) cannot be built correctly without the policy. Any default we ship becomes the policy by habit.
**Domain:** Policy, Sponsor, Transport Department.
**Owner:** Church Transport Department (drafts); Executive Product Sponsor (approves).
**Agents required:** Liaison, Sponsor, PM.
**Options:** (a) department drafts the full policy using the decision points in `MEETING-NOTES-03`; (b) PM drafts a first version for department amendment; (c) ship a provisional rule (cancel before departure minus N hours) and review after the pilot.
**Recommended resolution:** (b) then (c): PM drafts a first version with explicit decision points; the department amends; the provisional rule is used only in the pilot.
**Decision required from:** Sponsor (owner), Transport Department (drafting).
**Deadline/gate:** Before refund automation build (Phase C).
**Status:** Open — Non-blocking for design; blocking for refund build.

---

**Issue ID:** OI-037
**Description:** WhatsApp contact. The app must offer WhatsApp to members and marshals. Options are plain `wa.me` deep links (no cost, no approval) or the WhatsApp Business API (cost, business verification, template approval).
**Why it matters:** Deep links cannot send automated messages. Automated WhatsApp messages would need the Business API and a cost decision.
**Domain:** Notifications, Support.
**Owner:** Product Manager.
**Agents required:** PM, Integrations Specialist, Sponsor.
**Options:** (a) deep links only at MVP; (b) Business API for automated messages in Phase 2.
**Recommended resolution:** (a) at MVP, consistent with D-010.
**Decision required from:** Sponsor (confirm).
**Deadline/gate:** Before support pages are built.
**Status:** Open — Non-blocking.

---

**Issue ID:** OI-038
**Description:** Data protection. Member names, phone numbers, attendance, payment references and support messages are personal data. Retention periods, lawful basis, a data protection impact assessment and breach notification duties have not been defined. The Nigeria Data Protection Act 2023 applies (legal review required).
**Why it matters:** Payment and attendance records have accounting and dispute value, but personal contact data should not be kept longer than needed. Collection without a stated basis is a compliance gap.
**Domain:** Security, Legal, Sponsor.
**Owner:** Security & Compliance Lead (proposal); Executive Product Sponsor (approval, legal counsel).
**Agents required:** Security, Sponsor, Liaison.
**Options:** (a) engage counsel for a short data protection review before pilot; (b) self-assess and proceed; (c) defer until after launch.
**Recommended resolution:** (a). Keep processing to the minimum the app needs. Do not store payment instruments (D-023).
**Decision required from:** Executive Product Sponsor.
**Deadline/gate:** Before any real member data is entered (pilot gate).
**Status:** Open — Blocking pilot.

---

**Issue ID:** OI-039
**Description:** Staff authentication. Admins and marshals hold privileged access (refunds, manifests, corrections). Their sign-in method and second factor are undefined.
**Why it matters:** A compromised admin account can alter bookings and refunds. The audit trail records the action but cannot prevent it.
**Domain:** Auth, Security.
**Owner:** Security & Compliance Lead.
**Agents required:** Security, Backend, UI/UX.
**Options:** (a) phone OTP for all staff; (b) phone OTP for marshals, email plus TOTP second factor for admins; (c) TOTP for all staff.
**Recommended resolution:** (b). Q-004 in QA-LOG covers the sign-in choice.
**Decision required from:** Sponsor (Q-004), Security (design).
**Deadline/gate:** Before staff accounts are created.
**Status:** Partly decided by Q-004: phone code for marshals, authenticator second factor for admins (D-029). Enrolment procedure and device checks remain open; blocking for staff onboarding.

---

**Issue ID:** OI-040
**Description:** Pilot scope and user acceptance testing are undefined: which programme is the pilot, who the marshals are, and how the WhatsApp fallback runs alongside the app during the pilot.
**Why it matters:** Without a defined pilot, launch readiness (C-phase gates in the lifecycle) cannot be judged.
**Domain:** Product, Transport Department, QA.
**Owner:** Product Manager.
**Agents required:** PM, Liaison, QA, Sponsor.
**Options:** (a) one special event as pilot; (b) one Sunday service with paid-free booking only; (c) both, sequentially.
**Recommended resolution:** (c), with WhatsApp kept as the fallback for the whole pilot.
**Decision required from:** Sponsor; Transport Department (marshals and dates).
**Deadline/gate:** Before the Phase C launch-readiness gate.
**Status:** Open — Non-blocking for build.

---

*Register cross-references applied: OI-001's reconvene agenda now includes OI-017 (hold-abuse) and OI-015 (register ownership, alongside D-007/AUTH-2); OI-002 narrowed further by [R-12] — cash proof gap now reads "optional receipt-photo on manual-payment records" rather than a parallel upload system; R-07 (marshal device failure) is already mitigated by scope row "Printable/offline marshal manifest export" (MVP) — no separate issue needed.*

---

*OI-041 to OI-049 originate from the 2026-10-13 BRD trace in `PRD/PRD-v1.0-CANDIDATE.md` §13 and §14. Each has a required-field record per `AGENTS.md` Part I §7. Recommendations are repeated in `RECOMMENDATIONS/OPEN-ISSUE-RECOMMENDATIONS.md` §D.*

---

**Issue ID:** OI-041
**Description:** The BRD requires a marshal to call the member before a booking is confirmed (BRD §11 and requirement 11; journeys A and B: "Marshal Contacts Member, Member Confirms, BOOKING CONFIRMED"). The design confirms a free booking at once (SCOPE-AND-JOURNEYS Journey B4a; STATE-MACHINES §1). The "Marshal Contacted" step in the PRD summary (sections 1 and 4.2) has no state, and no notification tells a marshal that a booking needs confirmation (BRD §18).
**Why it matters:** It decides what a marshal does on duty and what "confirmed" means for a seat. Changing it later changes the booking state machine, the notification list and the marshal screens.
**Domain:** Product, Booking, Notifications.
**Owner:** Executive Product Sponsor (rule); Product Manager (specification).
**Agents required:** Sponsor, Liaison, PM, Backend, UI/UX.
**Options:** A. Keep the BRD rule (free bookings wait for a marshal call). B. Confirm on payment or on a free booking; record the marshal contact per rider. C. Paid confirm on payment; free needs a marshal call.
**Recommended resolution:** B. Contact is tracked per rider, not as a booking status, so D-025 holds and the marshal sees who is still uncontacted.
**Decision required from:** Executive Product Sponsor (Q-036).
**Deadline/gate:** Before the booking screens (F1) and the manifest (F2) are built.
**Status:** Decided by Q-036 (D-051). Free bookings wait for the marshal's call. Hold length for unconfirmed free bookings: OI-050.

---

**Issue ID:** OI-042
**Description:** The data model has no gender field, but BRD §17 asks for a male and female report. BRD §6 asks for a password for later sign-in; D-029 chose phone code with no password. BRD §6 also asks for "other required member information", which no document specifies.
**Why it matters:** The registration form and the demographic reports cannot be built correctly without it. Gender is personal data and must be minimised (OI-038).
**Domain:** Identity, Reporting, Privacy.
**Owner:** Church Transport Department (fields); Executive Product Sponsor (password decision).
**Agents required:** Sponsor, Liaison, Security, PM.
**Options:** A. Gender optional, aggregate only, no password. B. Gender required. C. Password offered alongside the phone code. D. No gender; first-time and returning only.
**Recommended resolution:** A, and the department lists any other required fields in writing.
**Decision required from:** Executive Product Sponsor (Q-037); Transport Department (other fields).
**Deadline/gate:** Before the registration form (F1) and the profiles table are finalised (B0).
**Status:** Decided. Gender is required with two choices, male or female (D-057). Password added next to the phone code (D-056).

---

**Issue ID:** OI-043
**Description:** BRD §5 asks for a programme end time, description, transport-availability flag and location (also BRD §8). BRD §1, §2 and §9 ask for a pickup time at every pickup point. The data model has none of these: `programmes` has no end time, description, venue or transport flag, and `pickup_points` has no time.
**Why it matters:** Members cannot see where and when to be, and marshals cannot plan. The change is cheap before data exists and expensive after.
**Domain:** Programmes, Data model.
**Owner:** Product Manager (specification); Database lead (model).
**Agents required:** Database, Frontend, Transport Department (times, from D3).
**Options:** A. Add the fields as the BRD states. B. Keep venue and times as free text (rejected: cannot compare or sort times). C. Pickup time per pickup point per leg.
**Recommended resolution:** A, with a pickup time per pickup point per leg, because return times differ from outbound times.
**Decision required from:** Product Manager (specification); Transport Department supplies the times.
**Deadline/gate:** Before the schema lock (B0 exit) and the programme screens (F3).
**Status:** Open. Blocking for the B0 schema lock.

---

**Issue ID:** OI-044
**Description:** Four notification gaps. (a) No marshal notification when a booking is created (BRD §13, §18). (b) BRD §13 puts the member's name and phone in marshal alerts; NOTIFICATIONS-DESIGN §6 limits marshal alerts to the bus. (c) No programme reminder (BRD §18). (d) No marshal notification for payment-related booking changes (BRD §18). BRD "registration successful" maps to "application submitted" (NOTIFICATIONS-DESIGN §2) and is covered.
**Why it matters:** A marshal who is not told about a booking cannot plan the bus, which is the purpose of the system.
**Domain:** Notifications, Privacy.
**Owner:** Product Manager (events); Sponsor and Liaison (content and privacy); Backend (events).
**Agents required:** Liaison, Security, Backend, UI/UX.
**Options:** (a) and (d): add route-scoped marshal alerts. (c): add a reminder the day before, by push and inbox. (b): Q-038 options A, B or C.
**Recommended resolution:** Add (a), (c) and (d). For (b), option A of Q-038: the app names the rider; SMS carries only the bus and count.
**Decision required from:** Executive Product Sponsor (Q-038); Product Manager (event list).
**Deadline/gate:** Before the marshal screens (F2) and the notification build (B3).
**Status:** Partly decided: alert content and the three added alerts (D-053). The SMS vendor remains OI-031.

---

**Issue ID:** OI-045
**Description:** The route map (FRONTEND-DESIGN §2) omits screens that the scope and BRD require: member notifications and profile (SCOPE §3, BRD §7), marshal incident and walk-on screens (SCOPE §3, Journey D), admin reports and finance views (BRD §17), and admin settings (cutoff, support numbers, quiet hours).
**Why it matters:** A screen with no route is not built, tested or traced.
**Domain:** Frontend, Product.
**Owner:** Product Manager (scope); Frontend lead (routes).
**Agents required:** Frontend, UI/UX.
**Options:** A. Add the routes to FRONTEND-DESIGN §2 now. B. Build them as sub-screens with no route (rejected: no test target).
**Recommended resolution:** A, before the route shell (F0).
**Decision required from:** Product Manager (no sponsor question needed).
**Deadline/gate:** Before the F0 route shell.
**Status:** Open. Blocking for the F0 route shell.

---

**Issue ID:** OI-046
**Description:** Marshal taps may be made offline (MAR-10, FRONTEND-DESIGN §5). When they reach the server the list may have changed: the rider was removed, the bus departed, the manifest lock passed, or the marshal was replaced (D-005). No rule says what happens to the queued tap.
**Why it matters:** A stale boarding tap accepted silently records a boarding that did not happen, or a removed rider as boarded.
**Domain:** Backend, Frontend, Duty policy.
**Owner:** Backend lead (rule); Transport Department (queue age, under P-14).
**Agents required:** Backend, Frontend, Liaison.
**Options:** A. The server decides on replay; a conflicting tap is rejected and shown to the marshal with the reason; the queue expires after departure plus a set time. B. Last write wins. C. Offline is read-only.
**Recommended resolution:** A.
**Decision required from:** Backend lead; Transport Department confirms the queue age.
**Deadline/gate:** Before the F2 offline queue and test MAR-10.
**Status:** Open. Blocking for the F2 offline queue.

---

**Issue ID:** OI-047
**Description:** Operational services are named but not chosen or recorded: off-platform backup destination and encryption (RISK-010, DEVOPS-PLAN §5), error tracking (§6), uptime monitor, transactional email provider (B6), SMS vendor (OI-031), Web Push key custody (B10), and whether a scheduled query keeps a Supabase Free project active (D-027, Verify).
**Why it matters:** Production cannot hold real member data without the backup. Monitoring is needed before the first duty day.
**Domain:** DevOps.
**Owner:** DevOps and infrastructure engineer.
**Agents required:** Security, Integrations.
**Options:** Free-tier options that meet the vendor terms recorded in DEVOPS-PLAN §2; each choice re-checked against those terms.
**Recommended resolution:** Choose one per row. Store credentials in the team vault with two holders (START-CHECKLIST B9).
**Decision required from:** DevOps lead; Sponsor approves any paid service.
**Deadline/gate:** Staging by the B0 exit. Production before any real member data (RISK-010).
**Status:** Open. Blocking for production data.

---

**Issue ID:** OI-048
**Description:** BRD §17 asks for demographic, route popularity and utilisation, and payment-total reports. The design gives no formulas, no export format and no finance-period export (D-043).
**Why it matters:** Reports built without definitions get disputed, and finance needs a stable export.
**Domain:** Reporting, Data Science, Finance.
**Owner:** Data Science (definitions); church finance contact (export format and period).
**Agents required:** Data Science, Database, Liaison.
**Options:** A. A metric specification per report, with formulas. B. Build first and define later (rejected).
**Recommended resolution:** A, with a CSV export by finance period.
**Decision required from:** Data Science (specification); finance contact (format).
**Deadline/gate:** Before the F3 reports screen and the pilot.
**Status:** Open. Non-blocking until the F3 reports screen.

---

**Issue ID:** OI-049
**Description:** The sponsor has not defined who may use the app at launch, or what "public use" means: a pilot group, all roster members, or anyone who applies. The public-use release gate in the task plan depends on this answer.
**Why it matters:** It sets the scope of the public-use gate, the roster import and the admin workload on the first day.
**Domain:** Product, Sponsor.
**Owner:** Executive Product Sponsor.
**Agents required:** PM, Liaison, QA.
**Options:** Q-039: A. Pilot group first, then all members after the 30-day review. B. All roster members after UAT. C. Anyone may apply, approved one by one.
**Recommended resolution:** A.
**Decision required from:** Executive Product Sponsor (Q-039).
**Deadline/gate:** Before the public-use release gate is defined (before B5).
**Status:** Decided by Q-039 (D-054). Pilot group first; all members after the 30-day review.

---

---

**Issue ID:** OI-050
**Description:** How long a free booking holds its seat while the marshal calls the member (D-051). The standard hold is 15 minutes (D-003, blocked), which is too short for a call. Without a limit, riders who are never reached would hold seats indefinitely.
**Why it matters:** Seats held by free bookings can starve the waiting list (D-030). An unlimited hold removes the seat guarantee that the capacity engine depends on.
**Domain:** Booking, Capacity, Policy.
**Owner:** Executive Product Sponsor (rule); Backend lead (implementation).
**Agents required:** Sponsor, Marshal lead, Backend, QA.
**Options:** Q-040. A. Until the manifest lock, 30 minutes before departure. B. Until 18:00 on the day before departure. C. No limit (not recommended). D. The 15-minute hold.
**Recommended resolution:** A. The marshal has the whole booking window to call; riders not reached by the lock are removed with notice.
**Decision required from:** Executive Product Sponsor (Q-040).
**Deadline/gate:** Before the F1 booking screens and BE-B1-18.
**Status:** Decided by Q-040 (D-055): held until 18:00 the day before departure. Not the recommended option A.

---

## 3. Scope Classification

Classified by business value, operational necessity, and dependency — not by implementation difficulty, per protocol.

| Capability | Classification | Basis |
|---|---|---|
| Membership-gated registration + login | **CORE** | AUTH-1; nothing else functions without it |
| Programme CRUD (Admin) | **CORE** | BRD §5 |
| Route/Bus management incl. multi-bus-per-route | **CORE** | D-001 |
| Booking lifecycle state machine (incl. No-show, Cancelled) | **CORE** | D-008; the architectural spine per PRD §2 |
| Capacity engine + per-bus open/close toggle | **CORE** | D-013 |
| Payment integration (provider-hosted checkout — Paystack/OPay, zero card storage) | **CORE** | PAY-1/PAY-2 + D-023; provider selection pending OI-025 |
| Special-event management (admin-created programmes — create/config/open/close/cancel) | **CORE** | Dept session 2026-10-09; rules pending OI-024 |
| Member support surfaces (report-a-problem, marshal contact, help page) | **MVP** | Dept session 2026-10-09; intake/SLA pending OI-026 |
| Manual/cash payment path (Marshal/Admin records pay-on-the-day) | **CONTESTED** *(D-021 pending; dept stated "no cash payment" 2026-10-09 — resolves with OI-023)* | Conflicting domain truth — pending sponsor clarification |
| Member / Admin / Marshal dashboards (3 surfaces, 1 data layer) | **CORE** | Meeting Minutes 02 §2 |
| Bulk booking/payment (host + beneficiaries, receipts) | **MVP** | Pulled forward by D-011 (soft timeline) — schema-altering, better built once |
| Refund automation (auto via Paystack, pre-event-only) | **MVP** | D-006, enabled fully by D-011 |
| Notifications: Web Push + Email + forced-install flow | **MVP** | D-009 |
| Canonical Notification & PWA design doc | **MVP** *(supporting deliverable)* | Required before D-009 ships correctly |
| Reporting engine (BRD §17) | **MVP** | Needed for Admin to replace manual headcount tracking |
| Basic audit trail (status/payment/admin-edit log) | **MVP** | OI-003 first-pass |
| RBAC (Member/Marshal/Admin) | **MVP** | AUTH-3/AUTH-4 |
| Duplicate-registration resolution | **MVP** *(blocked on OI-001)* | D-007 |
| Marshal reassignment (admin-triggered) | **MVP** | D-005 |
| Printable/offline marshal manifest export | **MVP** | R-007 — paper-manifest fallback is launch-required (liaison truth 6; answered question b) |
| Rate-limiting with generous defaults (per-profile) | **MVP** | RATE-1/RATE-3 — basic protection must exist at launch |
| Request/event context object (CTX-1) | **MVP** *(supporting deliverable)* | OI-009 — feeds the basic audit trail directly |
| Automated DB backup (zero-cost first pass) | **MVP** | INS-1/INS-2, RISK-001 — closes a real launch-blocking risk |
| Schema/table namespacing for future multi-product use | **MVP** *(trivial-cost deliverable)* | OI-008 — cheap now, expensive to retrofit |
| Full exportable audit system for leadership review | **PHASE 2** | OI-003 — beyond first-pass basic log |
| SMS / WhatsApp Business API notification tier | **PHASE 2** | D-010 — funded once usage data exists |
| Managed-DB-backup / hosting-tier upgrade | **PHASE 2** | D-010 |
| Manual payment-proof upload fallback | **PHASE 2** *(pending OI-002)* | Default is Paystack-only for MVP |
| Immutability enforcement mechanics (beyond policy doc) | **PHASE 2** | Policy exists at MVP (OI-003); full enforcement tooling later |
| Workrate-calculated (tuned, not generous-default) quota limits | **PHASE 2** | RATE-2 — needs real usage data to calculate correctly |
| Quarterly backup-restore fire drill | **PHASE 2** | INS-2 — process matures after launch |
| Literal cyber-insurance / liability policy | **PHASE 2** *(procurement, not engineering)* | OI-007 — leadership decision, non-blocking |
| Actual multi-tenancy infrastructure (routing, per-tenant RLS) | **FUTURE** | OI-008 — only the cheap naming discipline is in scope now |
| Waitlist for full buses | **FUTURE** | Explicitly deferred, BRD §15 |
| Marshal self-release / claim-pool reassignment | **OUT OF SCOPE** | D-005 explicitly chose admin-triggered instead |
| Native iOS/Android store apps | **OUT OF SCOPE** | D-009 — forced-PWA-install is the deliberate substitute |
| Multi-branch / multi-congregation support | **OUT OF SCOPE** | BRD explicitly single-congregation; PRD §1 scale reality check |

**RISK-002 (new):** Contribution-quota defaults set too conservatively could throttle a legitimate Host making a large bulk booking (PAY-3) — mitigation per RATE-1's "deliberately generous defaults" guidance; revisit once real usage data exists (ties to RATE-2, Phase 2).

**RISK-003 (new):** Cash/manual payments (D-021) bypass Paystack's automated reconciliation and refund trail — mitigation: every manual payment creates a ledger entry + Marshal/Admin attestation; cash refunds are manual admin actions; both audit-logged. Reconciliation workflow to be designed in the payment build.

---

## 4. Roadmap — Build Sequence

```
GATE 0 (now):  OI-001 reconvene — D-002, D-003, D-007/AUTH-2
               └─ nothing in Phase A starts until this clears

Phase A — Foundation (CORE)
  Database schema (D-001, D-008, D-013) → Auth + membership gate (AUTH-1..4, D-007)
  → Booking state machine → Capacity engine → Payment integration (D-006, Paystack onboarding
    can start immediately — not blocked by OI-001)

Phase B — MVP completion
  Bulk booking/payment + receipts → Refund automation → 3 dashboards (shared data layer)
  → Reporting engine → Basic audit trail (OI-003 first-pass) → Notification engine + forced-
    install flow (D-009, needs canonical design doc from UI/UX in parallel)

Phase C — Launch readiness
  Concurrency + payment-webhook test pass → UAT with real Marshals/Admins → RISK-001
  mitigation confirmed (backup strategy in place) → OI-004 resolved (install-gate behavior)

Phase D — Phase 2 (post-launch, budget-gated per D-010)
  SMS/WhatsApp notification tier → Managed-backup/hosting upgrade → Full audit/export system
  → Manual payment-proof fallback (only if OI-002 resolves toward keeping it)
```

---

## 5. Cross-Agent Review

- **Contradicts previous work?** No. Formalizes and extends Meeting Minutes 02 without reversing any of its content.
- **Exposes an omission?** Yes — no scope tiering existed anywhere before this document; every requirement previously had equal, undifferentiated weight.
- **Requires earlier artifacts to change?** Meeting Minutes 02 should be read as narrative history from here forward; this document is the live Decision Log. Recommend adding a one-line pointer at the top of Meeting Minutes 02 (done below).
- **New dependency introduced?** Yes — D-007 is now explicitly coupled to AUTH-2; previously tracked as independent.
- **Security/cost/scalability/usability consequence?** RISK-001 (DB backup gap under $0 budget if self-hosted Postgres is chosen) is newly named and explicit, not left implicit.
- **Downstream misunderstanding risk?** The reconvene (OI-001) could be mistaken for "PM is blocked, do nothing" — it is not: Paystack onboarding (D-006), the security policy first-pass (OI-003), and the canonical notification design doc (D-009) all proceed in parallel, unblocked.

---

## 6. Handoff Packet

**A. Executive summary:** Formalized 13 decisions (6 newly logged from today's sponsor input, 7 carried forward from Phase 1/Meeting Minutes 02), opened 5 tracked issues with owners and gates, classified every known capability into CORE/MVP/PHASE 2/FUTURE/OUT OF SCOPE, and sequenced a 4-phase build roadmap.

**B. Decisions made:** D-001 through D-013 (Section 1). Three remain Blocked (D-002, D-003, D-007) pending OI-001.

**C. Deliverable:** This document — `DOCS/DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md`.

**D. Dependencies:** OI-001 (respondent reconvene) is the critical dependency for Phase A. Paystack merchant onboarding (D-006) and the security policy first-pass (OI-003) have no such dependency and should start immediately.

**E. Changes required elsewhere:** Meeting Minutes 02 gets a pointer to this document as the new canonical Decision Log (applied below). No other artifact requires modification.

**F. Open issues:** OI-001 (blocking), OI-002, OI-003, OI-004, OI-005/RISK-001 (all non-blocking, parallel tracks).

**G. Downstream instructions:**
- **Database/Data Architect:** wait on OI-001 for D-002/D-003, but begin reviewing D-001/D-008/D-013's schema implications now so you're ready the moment it clears.
- **Backend/Systems Engineer:** same gate; begin Paystack sandbox integration work now (unblocked).
- **Security & Compliance Lead:** draft the mutable/immutable entity list now (OI-003) and circulate — don't wait for a scheduled session.
- **UI/UX Designer:** own OI-004 and begin the canonical Notification & PWA design doc (D-009) now.
- **DevOps/Infra Engineer:** monitor D-002 outcome for RISK-001; pre-plan both backup paths (managed vs. self-hosted+cron) so whichever stack wins, you're not starting cold.

**H. Context capsule:** below.

---

## CONTEXT CAPSULE

```
PRODUCT:
TCN Ikorodu Transport Booking & Management App

MY ROLE:
Product Manager / Product Owner

MY DOMAIN:
Scope classification, decision arbitration, roadmap sequencing, cross-domain synthesis

DECISIONS LOCKED:
D-001, D-004, D-005, D-006, D-008, D-009, D-010, D-011, D-012, D-013, D-014,
D-015 (AgentMail, provisioned), D-016 (governance model), D-017 (VLTHRTEAM),
D-018 (rooms system, internal tooling), D-019 (QA release gate), D-020 (staging model),
D-022 (Data Science direction)
(D-021 proposed — manual/cash payment path, CONTESTED by dept "no cash" 2026-10-09, OI-023)
(D-023 proposed — provider-hosted payment, zero card storage, pending ratification)

NEW REQUIREMENTS:
R-001 Bulk payment pulled into MVP (was ambiguous) per D-011
R-002 D-007 must resolve jointly with AUTH-2, not independently
R-003 Basic audit trail is MVP; full exportable audit system is Phase 2
R-004 Canonical Notification & PWA design doc is a tracked MVP deliverable, not optional polish
R-005 UIOS engine specs adopted as vocabulary/discipline only — 7 invariants, no machinery (D-014)
R-006 Agent comms run on role mailboxes + UAIE envelope; mail is transport, docs are record (D-015)
R-007 Printable/offline marshal manifest export — launch-required fallback (liaison truth)
R-008 Manual/cash payment recording path with ledger entry + attestation (D-021)

CONSTRAINTS:
C-001 $0 budget at launch (D-010)
C-002 Soft timeline, no hard launch date (D-011)
C-003 PM has no tie-breaking authority on respondent conflicts (D-012)

RISKS:
RISK-001 No DB backup strategy if self-hosted Postgres is chosen under $0 budget — mitigation proposed (OI-005), contingent on D-002
RISK-002 Rate-limit defaults could throttle legitimate bulk-booking hosts — mitigated by generous defaults, RATE-2 tuning deferred to Phase 2
RISK-003 Cash/manual payments bypass Paystack reconciliation + refund trail — ledger entry + attestation + manual refund workflow required (D-021)
RISK-004 Day-of-travel exception flows undefined — bus no-show/cancellation has no state, notify, or rebook path (OI-019)
RISK-005 Shadow mutability — cash path or side-channel corrections bypassing the state machine would recreate the WhatsApp problem inside the system (OI-012, L-1)
RISK-006 Audit log has writers but no readers — no review cadence or admin-oversight digest exists yet (OI-013)
RISK-007 Payment-model contradiction — D-021 cash path vs dept "no cash" could either exclude members or ship unused machinery (OI-023)
RISK-008 Canonical state machine undefined — every engineer coding own transitions recreates shadow mutability (OI-027, L-1)
RISK-009 Supabase Free pauses after a week of low activity (D-027) — a paused production database stops bookings until restored (DEVOPS-PLAN §1, §5)
RISK-010 No automatic database backups on Supabase Free (D-027) — data loss possible until the scheduled off-platform dump is verified (OI-005)
RISK-011 Members who rely on cash cannot pay under D-033 (liaison field report 2026-10-07 versus sponsor answer Q-006) — they may be excluded from booking; review at pilot
RISK-012 No guest cap (D-040) with first-timer guests ahead of members (D-034) — members may be displaced on full buses; monitor guest share per bus; review at pilot
(Full register: DOCS/RISK-ASSESSMENT.md — L-1…L-8, R-01…R-12, mapped to OI-012…OI-022; 2026-10-09 session findings OI-023…OI-028)

DEPENDENCIES:
OI-001 (respondent reconvene) blocks Database + Backend Phase A start
D-009 depends on UI/UX completing the canonical design doc before notification build
OI-011 (DS data contract) gated on D-002; design work unblocked
D-021 (cash payment path) pending sponsor ratification — contested by OI-023
D-023 (provider-hosted payment) pending sponsor ratification — pairs with OI-023/OI-025

CHANGES REQUIRED:
Meeting Minutes 02 — add pointer to this document as canonical Decision Log (applied)

DELIVERABLE:
DOCS/DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md (this document)
DOCS/SYSTEMS-MAPPING.md (UIOS → product mapping, D-014)
DOCS/CANONICAL-PROJECT-LIFECYCLE.yaml (constitution — read-first file)
DOCS/AGENT-COMMUNICATIONS-WORKFLOW.md (agent transport protocol, D-015)

DOWNSTREAM AGENT:
Database/Data Architect (primary); Backend/Systems Engineer, Security & Compliance Lead, UI/UX Designer, DevOps/Infra Engineer (parallel)

DOWNSTREAM ACTION:
Database/Data Architect: review D-001/D-008/D-013 schema implications now, begin schema the moment OI-001 clears D-002/D-003.
Backend/Systems Engineer: start Paystack sandbox integration (D-006) immediately, unblocked.
Security & Compliance Lead: produce first-pass mutable/immutable entity list (OI-003) now.
UI/UX Designer: own OI-004 resolution and begin canonical Notification & PWA design doc (D-009) now.

OPEN ISSUES:
OI-001 (blocking), OI-002, OI-003, OI-004, OI-005, OI-006, OI-007, OI-008, OI-009,
OI-010 (resolved), OI-011, OI-012, OI-013, OI-014, OI-015, OI-016, OI-017,
OI-018, OI-019, OI-020, OI-021, OI-022, OI-023 (blocking payment scope), OI-024,
OI-025, OI-026, OI-027 (blocking backend impl), OI-028,
OI-029 (webhook host, blocking payment build), OI-030 (hosting cost vs terms, blocking production), OI-031 (SMS channel), OI-032 (region), OI-033 (provider contracts), OI-034 (design system), OI-035 (test tooling), OI-036 (refund policy), OI-037 (WhatsApp deep links), OI-038 (data protection, blocking pilot), OI-039 (staff auth), OI-040 (pilot scope)

STATUS:
READY WITH CONDITIONS
```
