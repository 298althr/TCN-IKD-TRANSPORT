# Implementation Task Plan: Build, Deploy, Review, Secure and Test to Public Use

**Status:** Proposed working baseline (D-050), becomes baseline v1.0 at the freeze (D-045) · **Version:** 1.0-candidate · **Date:** 2026-10-13 · **Owner:** Product Manager (plan); each task has a named role owner
**Decisions:** D-024, D-027, D-033, D-045, D-046, D-047, D-048, D-049, D-050 · **Open issues:** OI-001, OI-004, OI-005, OI-015, OI-017, OI-019, OI-020, OI-025, OI-029, OI-031 to OI-033, OI-036, OI-038, OI-040, OI-043, OI-045 to OI-048 (OI-041, OI-049 and OI-050 decided; OI-042 and OI-044 partly decided; see decision log)
**Related:** `PRD/PRD-v1.0-CANDIDATE.md` (requirements, FR IDs), `ROADMAP/DEVELOPMENT-STRATEGY.md` (sequence), `ROADMAP/IMPLEMENTATION-ROADMAP.md` (stages), `TESTING/ACCEPTANCE-CRITERIA.md` (release test)

---

## 0. How to read this plan

**Order of work.** Governance first, then the frontend on frozen contracts, then the backend, then integration, security acceptance, pilot and public-use release (D-046, DEVELOPMENT-STRATEGY §1). Nothing here has a date. Dates follow resourcing (DEVELOPMENT-STRATEGY §10).

**Source tags.**

| Tag | Meaning |
|---|---|
| `DOC` | Taken from a named source document. The reference is in the Source column |
| `NEW` | An engineering standard this plan adds. The sponsor may reject it; a rejected task is removed by decision, not silently |
| `VERIFY` | Must be checked against a live vendor or framework document before code depends on it |

**Owner roles.** PM (product manager); SPON (executive product sponsor); LIAI (transport department liaison); DEPT (transport department); FIN (finance contact named by the church); FE (frontend lead); BE (backend lead); DB (database lead); INTG (integrations specialist); SEC (security and compliance lead); DEVOPS (DevOps and infrastructure lead); QA (QA and test lead); UX (UI/UX designer); DS (data science); ADM (trained administrators); MAR (named marshals); COUN (external counsel).

**Done when.** Every task closes on evidence (a passing suite, a signed record, a recorded decision, a checked list). "Code written" is never done.

**Task IDs.** `GOV` governance, `ENG` engineering foundation, `FE-Fn` frontend stage n, `BE-Bn` backend stage n, `AU` authentication, `INT` payments and integrations, `NOT` notifications, `DEP` deployment, `REV` review, `SEC` security development, `TST` testing, `PUB` public-use release gate, `OPS` after launch. Requirement IDs (FR-, NFR-) refer to `PRD/PRD-v1.0-CANDIDATE.md`. Criteria IDs (MEM-, GST-, MAR-, ADM-, SYS-) refer to `TESTING/ACCEPTANCE-CRITERIA.md`.

---

## 1. Gates and stage exits

Each gate is passed by evidence. A stage does not start until the gate before it has passed.

| Gate | Name | Passes when | Source |
|---|---|---|---|
| G0 | Decisions | GOV-01 to GOV-09 done; technical reconvene has ratified D-024 and decided D-002 and D-003; policy reconvene has decided D-007 with AUTH-2; OI-043 and OI-045 to OI-048 closed or deferred with a named owner (OI-041, OI-042, OI-044, OI-049 and OI-050 are decided or partly decided) | D-045; START-CHECKLIST §A |
| G1 | Design lock | `CONTRACTS.md` and `STATE-MACHINES.md` accepted; typed contract exists (ENG-04, ENG-05); OI-043 and OI-045 closed; prototype walkthrough repeated | IMPLEMENTATION-ROADMAP §3 |
| G2 | Frontend start | Framework ratified (D-024, D-046); route shell approved (FE-F0-03); OI-004 decided | D-046 condition |
| G3 | Backend start | D-002 ratified; D-003 decided; OI-042 and OI-043 closed for the schema; webhook and job placement ratified (OI-029) | IMPLEMENTATION-ROADMAP §4; D-002; D-003 |
| F1 to F4 exit | Per role | Every criterion at level P for the role passes on the stand-in data (for example, F1: all MEM criteria at P) | DEVELOPMENT-STRATEGY §6.3 |
| F5 exit | Accessibility and performance | Automated accessibility checks clean; budgets met on the mid-range profile | DEVELOPMENT-STRATEGY §6.3 |
| B0 to B5 exit | Per stage | Criteria listed for the stage pass on the real backend | DEVELOPMENT-STRATEGY §7.1 |
| I0 | Integration | Stand-in removed; full end-to-end suite passes on staging with synthetic data | DEVELOPMENT-STRATEGY §8 |
| UAT | Acceptance by users | UAT-1 to UAT-4 scripts pass with real administrators and marshals on staging | TEST-STRATEGY §6 |
| G-SEC | Security acceptance | Every item in THREAT-MODEL §7 ticked with evidence | THREAT-MODEL §7 |
| G-PILOT | Pilot gate | Pilot scope chosen (Q-027, OI-040); pilot policies ratified or labelled provisional; OI-038 outcome recorded; restore drill passed | DEVELOPMENT-STRATEGY §8 |
| G-PUB | Public-use release | Every task in §12 closed | This plan §12 |
| G-LAUNCH | Launch review | 30-day review decision recorded | IMPLEMENTATION-ROADMAP §9 |

**Mapping to the roadmap stages.** Stage 1 (design lock) is G1. Stage 2 (foundation) is ENG, FE-F0 and BE-B0 to B1. Stage 3 (booking and payments) is FE-F1 and BE-B1 to B2. Stage 4 (role apps and notifications) is FE-F2 to F4 and BE-B3 to B4. Stage 5 (hardening) is BE-B5, SEC, DEP and TST load and restore work. Stage 6 (pilot) is UAT and the pilot gate. Stage 7 (launch and review) is PUB and OPS.

---

## 2. Governance and decisions (development prerequisite)

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| GOV-01 | Return the transport sign-off pack and import the answers into QA-LOG Batch 7 (Q-027 to Q-035) and the decision register | PM | Pack returned | Answers recorded; D-045 condition (a) met | D-045; D-048; SIGN-OFF README |
| GOV-02 | Batch 8 and Batch 9 answers recorded (Q-036 to Q-042) and applied to the documents (D-051 to D-057) | PM | None | Done 2026-10-13; no sponsor answer outstanding for these questions | QA-LOG Batches 8 and 9 |
| GOV-03 | Technical reconvene: ratify D-024 (stack); decide D-002, D-003 and the hold limit (OI-017); decide webhook and job placement (OI-029); confirm the booking-state design (OI-027) and the context object (OI-009) | Respondents (D-012) | GOV-01 | Each item Accepted or Rejected in the register | OI-001; D-012; BACKEND §10 |
| GOV-04 | Policy reconvene: decide D-007 together with AUTH-2; name the roster steward (OI-015); decide correction authority (OI-012); decide registration checks (OI-028) | Respondents with SEC; SPON | GOV-01 | Each item Accepted or Rejected | OI-001 policy track; AUTH §4 |
| GOV-05 | Owners and draft dates for the 29 policies (Q-035); pilot policies drafted in the order the register gives | DEPT | GOV-01 | Owner and date named for each policy | DEPARTMENT-POLICY-REGISTER §3 |
| GOV-06 | Name the finance contact, the second trained administrator, the marshal for each bus, and the programme calendar | DEPT | GOV-01 | START-CHECKLIST D2 to D5, D14, D15, C9, C10 marked Done | START-CHECKLIST §C, §D |
| GOV-07 | Confirm assumptions A-01 to A-10 (candidate PRD §14) and the staging tier (A-10) | SPON | GOV-03 | Each assumption confirmed, changed or logged as open | PRD-CANDIDATE §14 |
| GOV-08 | Freeze the documents at version 1.0: set each frozen file's status line; create tag `docs-v1.0`; record D-045 as done | PM | GOV-01 to GOV-07 | Tag exists; drift check finds no frozen file marked Proposed | D-045; VERSION-CONTROL |
| GOV-09 | Write `PRD/PRD-v1.0.md` from the candidate; mark the root draft Superseded; sponsor approves | PM; SPON | GOV-08 | Signed approval block; root draft carries a link to v1.0 | DEVELOPMENT-STRATEGY §4 |
| GOV-10 | Baseline the roadmap: this plan and IMPLEMENTATION-ROADMAP at version 1.0; name a stage owner for each stage | PM | GOV-08 | Baseline recorded; owners named | DEVELOPMENT-STRATEGY §5, §9 item 3 |
| GOV-11 | Choose the source host for the repository, owned by the church; set up the team's accounts in pairs | SPON | None | Host chosen; START-CHECKLIST B1 to B9 each show two holders | D-049; START-CHECKLIST §B |
| GOV-12 | Engage counsel for the data protection review, the privacy notice and the processor terms | SPON | None | Engagement recorded; scope set (SEC-25 to SEC-27) | OI-038; START-CHECKLIST E1 |
| GOV-13 | Confirm the post-freeze change route: change request, decision entry, owner and PM sign-off, then version 1.1 | PM | GOV-08 | Route written in VERSION-CONTROL | DEVELOPMENT-STRATEGY §3 |

---

## 3. Engineering foundation

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| ENG-01 | Create the remote repository on the chosen host. Protect the main branch: pull request required, two approvals for schema, function and payment changes, required checks | DEVOPS | GOV-11 | Protection rules visible in settings; test push rejected | D-049; DEVELOPMENT-STRATEGY §10 |
| ENG-02 | Repository layout: `apps/web` (Next.js), `packages/domain` (pure TypeScript, no I/O), `supabase/` (migrations, functions, tests, seed) | BE | G2 | Layout exists; packages build | BACKEND-DESIGN §1 |
| ENG-03 | Pin the toolchain: Node LTS, a lockfile, TypeScript in strict mode, linting and formatting | FE | ENG-02 | CI fails on lint or type errors | NEW; FRONTEND-DESIGN §1 |
| ENG-04 | Typed contract: turn `API-CONTRACTS/CONTRACTS.md` §1 to §5 into types and schemas in `packages/domain`: function names, inputs, the result envelope, error codes, edge endpoints, realtime channels | BE; FE | G1 | Every row of CONTRACTS §2 and §3 has a type and a test; REV-04 diff passes | CONTRACTS §1 says names are proposed; DEVELOPMENT-STRATEGY §6.2 |
| ENG-05 | Transition table as data: the legal transitions from `STATE-MACHINES.md` §1 to §11 in `packages/domain`, with actor, guard and required record | BE; FE | ENG-04 | Table has a row for every transition in the document; reviewed against the document | STATE-MACHINES; DEVELOPMENT-STRATEGY §6.2 |
| ENG-06 | Money and time helpers: integer kobo, naira formatting with thousands separator, a clock that reads Africa/Lagos | FE | ENG-02 | Unit tests for rounding, formatting and cutoff boundaries | PAYMENTS §1; FRONTEND §6; SYS-13 |
| ENG-07 | Validation schemas (zod) in `packages/domain`, used by the web app and by Edge Functions | FE; BE | ENG-04 | Same schema imported by both; invalid input returns `VALIDATION_FAILED` | FRONTEND §1; BACKEND §1; CONTRACTS §1 |
| ENG-08 | Design tokens for the apps (one orange and yellow system) and accessible component primitives owned in the repository | UX; FE | G2 | Token file reviewed by UX; components pass axe | D-031; FRONTEND §1 and §7 |
| ENG-09 | Route shell with three role groups. Admin routes check the admin role on the server before rendering | FE | ENG-08 | Test: a member or marshal reaching an admin route is refused by the server | FRONTEND §2 (a missing check is a finding) |
| ENG-10 | Error, not-found, server-error, offline and maintenance pages | FE | ENG-09 | Each page reachable by test | NEW |
| ENG-11 | Security headers and content security policy configured in the web app | SEC | ENG-09 | Header scan shows the configured values on every route | NEW; SEC-11 |
| ENG-12 | Environment variable register: names only in the repository; every added variable recorded in the same change | DEVOPS | ENG-02 | Names match ENVIRONMENT-VARIABLES; no value in repository | ENVIRONMENT-VARIABLES rules |
| ENG-13 | Pre-commit and CI scan for secrets and for any `NEXT_PUBLIC_` name that holds a secret | SEC | ENG-01 | Seeded test secret is caught | THREAT-MODEL T16; TEST-STRATEGY §3 |
| ENG-14 | Dependency rule: pin versions; a newly added dependency must have been published at least seven days before adoption; each non-trivial addition recorded | BE; FE | ENG-03 | Rule written in CONVENTIONS and enforced in review | NEW (project rules) |
| ENG-15 | Review tags in the pull request template: `delete`, `stdlib`, `native`, `yagni`, `shrink`, with a net line count | PM | ENG-01 | Template in repository; used on the first pull request | `SKILLS/03-REVIEW-PROTOCOL`; ponytail |
| ENG-16 | Stand-in data layer generated from the typed contract: in-memory, seeded from ENG-18 data, returning the same error codes | FE | ENG-04, ENG-05 | Every contract function answers in the stand-in | DEVELOPMENT-STRATEGY §6.2 |
| ENG-17 | Stand-in enforces the transition table; an illegal transition returns `ILLEGAL_TRANSITION` | FE | ENG-05, ENG-16 | State-rule suite (TST-02) green on the stand-in | DEVELOPMENT-STRATEGY §6.2 |
| ENG-18 | Test-data seed: synthetic members and phone numbers in a reserved range; programmes, buses, marshals and bookings in every state | QA | ENG-05 | Seed loads; each state appears at least once | TEST-STRATEGY §5 |
| ENG-19 | Local stack: Supabase CLI and Docker, used for pgTAP and integration tests | DEVOPS | ENG-02 | Local stack starts; migrations apply | DEVOPS-PLAN §1; START-CHECKLIST F1 |
| ENG-20 | Anti-bloat check on each new module: a short note of why each dependency or abstraction is needed | PM | ENG-14 | Note in each pull request | AGENTS Part I §10 |

---

## 4. Frontend (development)

Built in the order the strategy gives: F0 foundation, then F1 member and F2 marshal (the travel-day risk), then F3 administrator, then F4 guest, then F5 accessibility and performance (DEVELOPMENT-STRATEGY §6.3).

### F0: Foundation

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| FE-F0-01 | Confirm the framework is ratified before F0 starts | PM | GOV-03 | Register shows D-024 Accepted | D-046 condition |
| FE-F0-02 | Decide browse-only before install (OI-004), so the install route can be built | UX; PM | GOV-03 | OI-004 closed | OI-004 recommendation (b) |
| FE-F0-03 | Update the route map with the screens the scope requires but the map omits: member notifications and profile; marshal incident, walk-on and summary; admin reports, finance views and settings | PM; FE | GOV-03 | FRONTEND-DESIGN §2 updated; OI-045 closed | OI-045; SCOPE §3 |
| FE-F0-04 | Typed client generated from the contract (ENG-04); no screen calls the database directly | FE | ENG-04 | Lint rule blocks direct table access in screens | FRONTEND §3 |
| FE-F0-05 | Stand-in data layer complete (ENG-16, ENG-17); state-rule suite green on it | FE | ENG-17 | TST-02 green on the stand-in | DEVELOPMENT-STRATEGY §6.3 F0 exit |
| FE-F0-06 | Design tokens and component kit (ENG-08) in use by the shell | UX; FE | ENG-08 | Shell uses tokens only; no hard-coded colour | FRONTEND §1 |
| FE-F0-07 | Role navigation shell, with role-specific start pages (`/home`, `/duty`, `/admin`) | FE | ENG-09 | Each role lands on its start page; other roles refused | FRONTEND §2 and §5 |
| FE-F0-08 | Accessibility checks in CI on the shell | QA | FE-F0-07 | axe runs in CI; serious violations fail the build | TEST-STRATEGY §1 |
| FE-F0-09 | Member-facing vocabulary map from FRONTEND §4; internal state names never shown | UX; LIAI | FE-F0-06 | Map reviewed by the liaison; labels checked in tests | FRONTEND §4; REV-08 |

### F1: Member

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| FE-F1-01 | Sign-in by phone code: number entry, six-digit code, visible resend cooldown; unknown numbers get "awaiting approval" without revealing whether the number is on the roster | FE | FE-F0-07 | MEM-01 and MEM-02 pass on the stand-in | FR-01; AUTH §2 and §3 |
| FE-F1-02 | Authenticator step for administrators, with its route guard | FE | FE-F0-07 | ADM-01 passes on the stand-in | FR-02; AUTH §2 |
| FE-F1-03 | Google button: labelled and logo-marked as Google's branding guidance requires; not functional until deployment | UX | FE-F1-01 | Branding check recorded (VERIFY) | FR-03; D-029; AUTH §2 |
| FE-F1-04 | First-time application form: name, phone, email, gender (male or female, required, no decline option), invited by. Other required fields as the department lists them | FE | OI-042 (other fields) | Form matches D-057 | FR-07; D-052; D-057 |
| FE-F1-05 | Pending, rejected and needs-information screens. Pending shows "under review" and no booking controls | FE | FE-F1-04 | MEM-03, MEM-05, MEM-06 pass | FR-08; FR-09 |
| FE-F1-06 | Programme list including special events; the Friday 18:00 window text; "N seats left" labels | FE | FE-F0-07 | MEM-07 and BRD requirement 5 pass | FR-21, FR-36; BRD §8 |
| FE-F1-07 | Programme detail: description, date, start and end times, venue (fields from OI-043) | FE | OI-043 | Fields shown exactly as the schema holds them | FR-23; BRD §5 and §8 |
| FE-F1-08 | Leg picker: outbound, return-only, round trip. Return-only riders see the return list only | FE | FE-F1-06 | MEM-08 and MEM-09 pass | FR-40, FR-47; A02, A03 |
| FE-F1-09 | Bus card with capacity bar and seats left. A full bus offers the waiting list and never says "booking closed" | FE | FE-F1-08 | MEM-10 passes; FR-49 | FR-49; D-030 |
| FE-F1-10 | Pickup picker with the pickup time for the chosen leg | FE | OI-043 | Pickup time shown for each leg | FR-30; BRD requirements 1 and 2 |
| FE-F1-11 | Riders step: self, approved guests, named riders for a host; an unapproved guest is refused | FE | FE-F1-08 | GST-11 passes; MEM-11 passes | FR-40, FR-48 |
| FE-F1-12 | Review step: total in bold; price per rider times riders | FE | FE-F1-11 | MEM-39 passes; BRD requirement 7 | FR-50 |
| FE-F1-13 | Confirm: double-tap protection; free bookings show "waiting for the marshal's call" and skip payment; paid programmes move to payment | FE | FE-F1-12 | MEM-35 and MEM-40 (revised) pass | FR-51; FR-43; D-051 |
| FE-F1-14 | Booking received screen with reference and a visible hold countdown | FE | FE-F1-13 | Acknowledgement shown at once; BRD requirement 13 | FR-42; FR-41 |
| FE-F1-15 | Payment provider choice and redirect; no card, CVV, account or wallet field anywhere | FE | INT-05 | MEM-13 passes; repository scan finds no card field | FR-66; D-023 |
| FE-F1-16 | Return page reads "checking your payment"; a confirmed booking shows on the next open | FE | INT-07 | MEM-14 and MEM-15 pass | FR-72; C02, C03 |
| FE-F1-17 | Payment failed state with retry; the seat stays held until the hold runs out | FE | INT-07 | MEM-16 passes | FR-44 |
| FE-F1-18 | My bookings: three separate labels per booking (booking, payment, boarding) | FE | FE-F1-14 | MEM-25 and MEM-26 pass | FR-46; D-025 |
| FE-F1-19 | Booking detail: rider list with status per leg | FE | FE-F1-18 | Each rider shows its own status for each leg | D-025; STATE-MACHINES §2 |
| FE-F1-20 | Cancel flow: inside the window, cancelled; outside, the contact route; paid bookings show "refund requested" with no amount | FE | BE-B1-07 | MEM-17 to MEM-19 pass | FR-52, FR-53 |
| FE-F1-21 | Waiting list: join; "on the waiting list" status; offer screen with a two-hour countdown; accept, decline and expired states | FE | BE-B1-14 | MEM-20 to MEM-24 pass | FR-55 to FR-61 |
| FE-F1-22 | Report a problem: booking reference filled in; category; reference and status shown; reminder not to send card details | FE | BE-B4-05 | MEM-27 passes; SUPPORT §6 | FR-118; FR-120 |
| FE-F1-23 | Help page: report route, WhatsApp and phone links read from configuration, refund explanation, privacy line | FE | BE-B4-15 | MEM-28 passes; no phone number hard-coded | FR-123; FR-124 |
| FE-F1-24 | My guests: add a guest; invite link shown once; guest status; revoke | FE | BE-B4-03 | MEM-30 and GST-01 pass | FR-15, FR-17 |
| FE-F1-25 | Notifications inbox: every message the member received, read or unread | FE | NOT-01 | Message present even when push is refused (MEM-32) | FR-108; NOTIFICATIONS §1 |
| FE-F1-26 | Profile: the returning user's details; sign out everywhere | FE | AU-05 | FR-04 and FR-05 pass | FR-04; AUTH §7 |
| FE-F1-27 | Last-synced banner on programme lists when offline | FE | FE-F5-03 | MEM-37 passes with the network off | OPTIMISATION §5 |
| FE-F1-28 | Skeleton loading states on every data screen; empty and error states | FE | FE-F0-07 | FR-170 checked on each screen | FRONTEND §7 |
| FE-F1-29 | Keyboard and screen-reader path through booking | FE | FE-F1-14 | MEM-36 passes | FRONTEND §6 |
| FE-F1-30 | Retries never create a second booking on a slow network | FE | BE-B1-01 | MEM-34 passes | MEM-34 |
| FE-F1-31 | Install route with platform steps; browse-only pre-install as OI-004 decides | FE; UX | FE-F0-02 | FR-153 and FR-154 pass | OI-004; D-009 |
| FE-F1-32 | Permission request after the first booking, with a plain reason | FE | NOT-14 | Permission not requested on first launch | NOTIFICATIONS §5 |
| FE-F1-33 | Sign-in and payment pages never cached by the service worker | FE | ENG-16 | Cache rules tested | FRONTEND §5; FR-156 |
| FE-F1-34 | Password sign-in next to the phone code, with recovery through the phone code | FE | AU-10 | Password sign-in and recovery tested | FR-06; D-056 |

### F2: Marshal

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| FE-F2-01 | Sign-in by phone code; membership re-checked on each duty load | FE | AU-09 | MAR-19 and FR-100 pass | AUTH §7 |
| FE-F2-02 | Duty list: only the buses assigned to the signed-in marshal | FE | BE-B0-02 | MAR-01 and MAR-02 pass | FR-96 |
| FE-F2-03 | Manifest tabs for outbound and return. Return-only riders on the return list only | FE | FE-F2-02 | MAR-03 passes | FR-47 |
| FE-F2-04 | Board tap: once; second tap shows "already boarded" and creates no record | FE | BE-B1-09 | MAR-04 passes | FR-87 |
| FE-F2-05 | No-show: refused before the lock, allowed after it | FE | BE-B1-09 | MAR-05 passes | FR-88; FR-90 |
| FE-F2-06 | Walk-on before the lock with a reason; after the lock, sends an administrator approval request | FE | BE-B1-09 | MAR-06 and MAR-07 pass | FR-97; FR-91 |
| FE-F2-07 | Record each contact per rider (reached, not reached, no longer going) and the member's confirmation; held riders shown as "to contact" | FE | BE-B1-05 | MAR-21 passes | FR-93; D-051 |
| FE-F2-08 | Open an incident: bus late, breakdown, cancelled, marshal absent, wrong bus, other | FE | BE-B4-06 | MAR-13 passes | FR-103; FR-104 |
| FE-F2-09 | Lookup by reference and name on duty, in case a member's phone is lost | FE | BE-B0-02 | Lookup returns only the marshal's own riders | RISK-ASSESSMENT R-09; PRD-CANDIDATE §11 |
| FE-F2-10 | Contact admin: WhatsApp and phone links with the bus filled in; each press logged as an event, not its content | FE | BE-B4-15 | MAR-12 passes; SUPPORT §7 | FR-123 |
| FE-F2-11 | App bug report with category and reference | FE | BE-B4-05 | MAR-14 passes | FR-118 |
| FE-F2-12 | Offline queue for board and no-show taps, shown as "waiting to send"; server conflict rules (OI-046) | FE; BE | OI-046 | MAR-10 passes with the network off | FR-157 |
| FE-F2-13 | Printable manifest with count, time and last-synced stamp | FE | FE-F2-03 | MAR-11 passes; output matches data | FR-95; R-007 |
| FE-F2-14 | Duty summary: boarded, no-show, walk-on and return-only counts equal the manifest | FE | BE-B1-11 | MAR-16 passes | FR-101 |
| FE-F2-15 | Marshal cannot see contact details for another bus by any route | FE; BE | BE-B0-10 | MAR-15 passes | FR-92; SYS-10 |
| FE-F2-16 | Departed bus refuses boarding taps | FE | BE-B1-11 | MAR-20 passes | FR-94 |
| FE-F2-17 | Call and WhatsApp links to a rider from the manifest | FE | FE-F2-03 | Links use the rider's number from the database view | BRD §14 "contact passengers" |
| FE-F2-18 | New-booking alert list for the assignment, route-scoped | FE | NOT-12 | SYS-11 and marshal scoping test pass | BRD requirement 9; OI-044 |
| FE-F2-19 | Payment status shown per rider on the duty list (no amounts for marshals beyond status) | FE | BE-B0-02 | Status shown; no card or amount detail | BRD §14 "view payment status" |

### F3: Administrator

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| FE-F3-01 | Sign-in with authenticator enrolment and recovery through the second admin | FE | AU-02 | ADM-01 passes | OI-039 |
| FE-F3-02 | Overview queues: registrations (12-hour reminder), refunds, reconciliation, reports, incidents, dead letters, overdue items | FE | BE-B4 | FR-143 and FR-144 pass | FRONTEND §2 |
| FE-F3-03 | Registration review: approve, reject with a reason, request information; each change audited | FE | BE-B4-03 | ADM-02 and ADM-03 pass | FR-09; FR-10 |
| FE-F3-04 | Programme list and create (draft) | FE | BE-B4-01 | ADM-04 passes | FR-22 |
| FE-F3-05 | Programme detail: routes, buses, pickup points and times; required fields from OI-043 | FE | OI-043 | Publish blocked until required fields complete | STATE-MACHINES §10 |
| FE-F3-06 | Special event: publish, then open bookings only after a second administrator approves | FE | BE-B4-02 | ADM-05 passes | FR-22; D-042 |
| FE-F3-07 | Pause, close and cancel a programme, each with a reason | FE | BE-B4-01 | Cancel cascades to bookings and refund requests | FR-24; ADM-13 |
| FE-F3-08 | Fleet: buses, capacity, per-bus booking toggle | FE | BE-B1-12 | ADM-07 passes | FR-32 |
| FE-F3-09 | Marshal assignment and revocation per assignment | FE | BE-B4-14 | ADM-08 and MAR-17 pass | FR-141; FR-99 |
| FE-F3-10 | Waiting list in offer order, with first-timer guests first; add a bus | FE | BE-B1-14 | ADM-09 and ADM-10 pass | FR-63 |
| FE-F3-11 | Bookings list and detail; correction with a required reason | FE | BE-B4-07 | ADM-17 passes | FR-136 |
| FE-F3-12 | Payments: provider totals, reconciliation queue, resolution with a reason | FE | INT-08 | ADM-16 passes | PAYMENTS §5 |
| FE-F3-13 | Refund queue: eligibility shown; override needs a reason; no card detail on screen | FE | BE-B4-09 | ADM-14, ADM-15, ADM-22 pass | FR-78; FR-79 |
| FE-F3-14 | People: roster import preview and commit; guest approval queue | FE | BE-B4-08 | Import is recorded and reversible | FR-13; FR-16 |
| FE-F3-15 | Support queue: category routing; status changes; internal notes; overdue flags | FE | BE-B4-05 | ADM-18 passes | FR-119; FR-120 |
| FE-F3-16 | Incidents: acknowledge, act, resolve; one action notifies riders | FE | BE-B4-06 | ADM-24 passes | FR-105 |
| FE-F3-17 | Broadcast: choose a segment, compose, second approval for large segments | FE | BE-B4-12 | ADM-19 passes (Level L) | FR-146 |
| FE-F3-18 | Reports: programme, route, payment and guest-share reports; CSV export by finance period | FE | OI-048 | ADM-11 and ADM-21 pass | FR-126 to FR-131 |
| FE-F3-19 | Audit view: read-only, filterable | FE | BE-B0-03 | ADM-20 passes | FR-137 |
| FE-F3-20 | Settings: default cutoff, per-programme override with reason; support numbers; quiet hours | FE | BE-B4-15 | FR-142 passes | D-032; SUPPORT §1 |
| FE-F3-21 | No delete or edit control on the audit or history screens | FE | FE-F3-19 | Checked by review and test | ADM-20 |
| FE-F3-22 | Access removed at once when a role is revoked | FE | BE-B4-14 | ADM-23 passes | P-22 |
| FE-F3-23 | Overdue support banner | FE | FE-F3-15 | FR-144 passes | SUPPORT §4 |

### F4: Guest

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| FE-F4-01 | Invite landing page: valid link leads to sign-in; expired or used-up link shows "no longer valid" | FE | BE-B4-03 | GST-01 and GST-02 pass | G2; GST-02 |
| FE-F4-02 | Guest sign-in by phone code; approved-state check | FE | AU-01 | GST-01 passes | AUTH §5 |
| FE-F4-03 | Public guest application form | FE | BE-B4-03 | GST-03 passes | G1 |
| FE-F4-04 | Guest status screens: pending, declined with contact route, removed | FE | BE-B4-03 | GST-05 passes | FR-18 |
| FE-F4-05 | Guest bookings: only the guest's own bookings; host name on the ticket | FE | FE-F1-19 | GST-06 passes | SYS-09 |
| FE-F4-06 | Guest reuses the member booking flow; no separate booking logic | FE | FE-F1-08 | Code review finds no duplicate rules | DEVELOPMENT-STRATEGY §6.2 |
| FE-F4-07 | Guest-to-member path using the first-time registration | FE | FE-F1-04 | GST-10 passes | FR-19 |
| FE-F4-08 | Guest waiting-list priority message shows the guest's own place only | FE | FE-F1-21 | No other rider's place shown | MEM-20 |

### F5: Accessibility and performance

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| FE-F5-01 | Browser and device matrix: iOS Safari 16.4 or later (home screen, push); Android Chrome; desktop Chrome and Edge; Firefox. Matrix recorded | QA; FE | F1 to F4 | Matrix passes; gaps recorded | D-009; PRD-CANDIDATE NFR-13 |
| FE-F5-02 | Accessibility: axe on every route; keyboard path for the administrator; touch targets at least 44 by 44; input text at least 16 pixels | FE; QA | F1 to F4 | Zero serious violations on public routes | FRONTEND §6; TEST-STRATEGY §1 |
| FE-F5-03 | Performance budgets in CI: bundle size for the member route; largest contentful paint on a throttled mid-range profile | FE | F1 | Budgets met; CI fails when exceeded | OPTIMISATION §2 |
| FE-F5-04 | Web Vitals collected in aggregate with no personal data | FE; DEVOPS | FE-F5-03 | Dashboard shows aggregates only | OPTIMISATION §7 |
| FE-F5-05 | Image and font optimisation | FE | FE-F5-03 | Image budget met | OPTIMISATION §2 |
| FE-F5-06 | Visual regression on the booking and manifest screens only | QA | FE-F5-02 | Snapshot tests on those two screens | FRONTEND §9 |
| FE-F5-07 | Plain-language review of all member and marshal text | UX; LIAI | F1, F2 | Review recorded; changes applied | FRONTEND §4; REV-08 |

---

## 5. Backend (development)

Built against the same contracts the frontend used (DEVELOPMENT-STRATEGY §7).

### B0: Schema, security base

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| BE-B0-01 | Migrations for the `transport` schema: enums and tables as DATA-MODEL §2 defines them, with the outcomes of OI-042 and OI-043 | DB | G3 | Migrations apply in order on a clean local stack | DATA-MODEL §2; BACKEND §8 |
| BE-B0-02 | Read views: member bookings, marshal manifest per assignment, administrator views | DB | BE-B0-01 | Views return only the columns needed; RLS applies | DATA-MODEL §5; FRONTEND §3 |
| BE-B0-03 | Append-only enforcement on audit, transitions, payment events, seat ledger, corrections, report messages, roster batches, role rows | DB | BE-B0-01 | Update and delete rejected for every role | DATA-MODEL §3; SYS-14; ADM-20 |
| BE-B0-04 | Indexes on every foreign key used in RLS or views; seat ledger by assignment and leg | DB | BE-B0-01 | Query plans checked on seeded volume | OPTIMISATION §6 |
| BE-B0-05 | Retention and pseudonymisation columns | DB | BE-B0-01 | Columns exist per DATA-MODEL §4 | DATA-MODEL §3, §4 |
| BE-B0-06 | Seed: reference data and synthetic fixtures only | DB | ENG-18 | No real personal data in seed | BACKEND §1 |
| BE-B0-07 | Function template: SECURITY DEFINER, search path pinned, execute revoked from public, granted to the named role only | DB; SEC | BE-B0-01 | Grant audit (SEC-03) passes on every function | ADR-0002 |
| BE-B0-08 | Function inventory check: each name in CONTRACTS §2 and §3 exists with its grants | DB | ENG-04 | Check passes; REV-04 diff clean | CONTRACTS §2 |
| BE-B0-09 | pgTAP: state legality from ENG-05; illegal transitions rejected | QA; DB | ENG-05 | TST-03 green | TEST-STRATEGY §1 |
| BE-B0-10 | pgTAP: row-level security per role; cross-member and cross-bus reads denied | QA; DB | BE-B0-02 | SYS-09 and SYS-10 pass | THREAT T1, T2 |
| BE-B0-11 | pgTAP: direct writes denied; role and membership not writable by clients | QA; DB | BE-B0-07 | T3 and T4 tests pass | THREAT T3, T4 |
| BE-B0-12 | pgTAP: internal support notes hidden from the reporter | QA; DB | BE-B0-02 | MEM-29 passes | THREAT T13 |
| BE-B0-13 | Membership gate function, used by row-level security and by functions | DB | BE-B0-01 | Non-approved users denied | AUTH §3 |
| BE-B0-14 | Access-token claims from `user_roles` through an auth hook (VERIFY); never from user-editable metadata | DB; SEC | AU-01 | Test: metadata edit does not change role | AUTH §6; THREAT T3 |

### B1: Seat holds, manifest, waiting list

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| BE-B1-01 | `hold_seats`: row lock on the assignment; ledger sum under the lock; insert booking, riders, ledger, transition, audit, idempotency record | BE | G3 | SYS-01 passes; draft in BACKEND §2 completed | BACKEND §2; ADR-0002 |
| BE-B1-02 | Idempotency: store a hash of the input; the same key with different input returns `DUPLICATE`; the same input returns the first result. The draft in BACKEND §2 does not do this yet | BE | BE-B1-01 | Test: reuse with changed input returns DUPLICATE | BACKEND §2 note; CONTRACTS §1 |
| BE-B1-03 | Hold abuse limits: concurrent holds per member, repeat-expiry counter | BE | GOV-03 | Limit enforced; test passes | OI-017; R-01 |
| BE-B1-04 | Round trip: one call for both legs, or two; decided at the reconvene and recorded | BE | GOV-03 | Decision recorded; test for each leg full | BACKEND §10 |
| BE-B1-05 | `record_contact` and `confirm_free_booking`: a marshal records the member's confirmation after a reached call; refused for priced programmes; a member cannot confirm a free booking alone | BE | BE-B1-01 | MAR-21 and MEM-40 (revised) pass | CONTRACTS §2; D-051 |
| BE-B1-06 | `expire_holds` every minute with skip-locked; ledger release, transition and audit | BE | BE-B1-01 | SYS-02 passes; concurrent expiry runs release each seat once | BACKEND §3; TEST §2 |
| BE-B1-07 | `cancel_booking`: one function for member, marshal and administrator; convergence test | BE | BE-B1-01 | Same ledger and manifest effect for each caller | PRD draft §6 item 3; TEST §2 item 3 |
| BE-B1-08 | Cancellation window in Africa/Lagos time, 12-hour default, per-programme override with reason | BE | ENG-06 | SYS-13 and MEM-18 pass | D-032; SYS-13 |
| BE-B1-09 | Manifest functions: `board_rider`, `mark_no_show` (after the lock), `remove_rider` (reason), `add_walk_on` (before the lock; after it, approval) | BE | BE-B1-01 | Transition tests green; MAR-04 to MAR-08 pass | CONTRACTS §2; STATE-MACHINES §2 |
| BE-B1-10 | Manifest lock enforced on the server for every route into the function | BE | BE-B1-09 | SYS-12 passes through the API, not only the screen | D-037 |
| BE-B1-11 | `mark_assignment_departed`; boarding refused after departure | BE | BE-B1-09 | MAR-20 passes | STATE-MACHINES §6 |
| BE-B1-12 | `set_booking_state` for bus and programme windows | BE | BE-B0-01 | Pause, resume and close transitions tested | STATE-MACHINES §5 and §6 |
| BE-B1-13 | Capacity cannot be lowered below confirmed riders | BE | BE-B1-01 | ADM-06 passes | ADM-06 |
| BE-B1-14 | Waiting list: join, leave, offer in priority order, accept (calls the hold path), decline, expire after two hours on an independent timer; offered seats held until accepted or expired | BE | BE-B1-01 | MEM-20 to MEM-24, GST-09, ADM-10 pass | D-030; D-034; D-035; A-02 |
| BE-B1-15 | Marshal notified when a waiting list exists and a seat or bus is needed | BE; NOT | BE-B1-14 | Route-scoped notification sent | D-030; NOTIFICATIONS §2 |
| BE-B1-16 | Concurrency: capacity 1, 10 and 50; 200 simultaneous holds at capacity 50 gives exactly 50 successes, ledger sums to 50 | QA | BE-B1-01 | k6 report in the release record | TEST-STRATEGY §4 |
| BE-B1-17 | Expiry concurrency: expiry runs with holds in flight; no seat lost or released twice | QA | BE-B1-06 | Test passes | TEST-STRATEGY §4 |
| BE-B1-18 | Free-booking hold end: 18:00 Lagos time the day before departure; a free booking made after that holds until the manifest lock; released seats go to the waiting list | BE | D-055 | Expiry test per rule; the waiting list receives the released seats | D-055; D-030 |

### B2: Payments

Covered under INT-05 to INT-14 (section 7).

### B3: Notifications

Covered under NOT-01 to NOT-15 (section 7).

### B4: Administrator functions and audit

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| BE-B4-01 | `create_programme`, `publish_programme` (guards in STATE-MACHINES §10), `configure_assignment` (marshal must hold the marshal role) | BE | BE-B0-01 | Guards tested; A11 passes | CONTRACTS §2 |
| BE-B4-02 | Second-administrator approval to open a special event's bookings; the approver cannot be the creator | BE | BE-B4-01 | ADM-05 passes | D-042 |
| BE-B4-03 | `decide_application`, `invite_guest`, `redeem_invite` (rate-limited), guest approve and decline | BE | BE-B0-13 | MEM-03, GST-01 to GST-05 pass | CONTRACTS §2; AUTH §5 |
| BE-B4-04 | Registration reminder job at 12 hours; target tracking at 24 hours | BE | BE-B4-03 | Reminder notification sent; overdue flag shown | D-044 |
| BE-B4-05 | `create_support_report`, `transition_support_report`: routing by category; internal notes; reopen with reason | BE | BE-B0-12 | MEM-27, MEM-29, ADM-18 pass | D-042; SUPPORT §2 |
| BE-B4-06 | `open_incident`, `transition_incident`; breakdown and cancellation notify riders and admin in the same transaction | BE | BE-B4-01 | MAR-13 passes; notifications in the same transaction | STATE-MACHINES §8 |
| BE-B4-07 | `record_correction`: supersession for bookings, riders, manifest, capacity, with reason | BE | BE-B0-03 | ADM-17 passes; originals kept | STATE-MACHINES §12; OI-012 |
| BE-B4-08 | Roster import: CSV validation, batch record, row hash, reversible | BE | BE-B0-01 | Import test with synthetic file; rollback test | DATA-MODEL §2.1; FR-13 |
| BE-B4-09 | Refund functions: `request_refund` (member and system), `decide_refund` (reason; override audited), retry (admin) | BE | INT-09 | ADM-14 and ADM-15 pass; SYS-07 passes | CONTRACTS §2; STATE-MACHINES §4 |
| BE-B4-10 | Weekly administrator activity digest with anomaly flags | BE; DS | BE-B0-03 | Digest produced on synthetic data | OI-013; RISK-ASSESSMENT L-4 |
| BE-B4-11 | Finance views and CSV export by finance period | BE; DS | OI-048 | ADM-21 passes | D-043; OI-048 |
| BE-B4-12 | Broadcast: create; second approval for large segments; outbox writes; audit | BE | NOT-01 | ADM-19 passes (Level L) | NOTIFICATIONS §2 |
| BE-B4-13 | Membership changes: suspend, reinstate, retire, each with reason | BE | BE-B0-13 | Transitions tested against STATE-MACHINES §9 | STATE-MACHINES §9 |
| BE-B4-14 | Marshal reassignment: revoke the old role row, grant the new, re-scope notifications | BE | BE-B0-01 | ADM-08 and MAR-17 pass | D-005 |
| BE-B4-15 | Settings: default cutoff and overrides, support numbers, quiet hours | BE | BE-B0-01 | FR-142 passes | D-032; SUPPORT §1 |
| BE-B4-16 | Correlation ID and acting role on every write | BE | BE-B0-03 | Every audit row carries both | OI-009; BACKEND §7 |

### B5: Operations and data life cycle

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| BE-B5-01 | Retention jobs: report pseudonymisation after the window; push endpoint clean-up; payload purge after reconciliation; attendance to counts after one year; roster rotation | BE | BE-B0-05; D-043 | FR-149 passes on synthetic data | DATA-MODEL §4 |
| BE-B5-02 | Erasure request procedure: pseudonymise person fields; keep event rows | BE; SEC | OI-038 | FR-151 passes | DATA-MODEL §3 |
| BE-B5-03 | Health function behind `/api/health` | BE | ENG-02 | Returns status with no personal data | DEVOPS-PLAN §6 |
| BE-B5-04 | Restore verification script: counts of bookings, payments and riders against source | QA; DEVOPS | DEP-10 | Counts match on a restored copy | SYS-16; DEVOPS-PLAN §5 |
| BE-B5-05 | Administrator lockout procedure: second administrator resets second factor; logged | BE; SEC | AU-02 | Procedure tested on staging | DEVOPS-PLAN §8 |

---

## 6. Authentication (AU)

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| AU-01 | Phone sign-in: one-time codes sent by the SMS provider; message template carries no secret | BE; INTG | NOT-05 | MEM-01 passes on staging | AUTH §2; D-028 |
| AU-02 | Administrator sign-in: email with password or magic link, plus TOTP enrolment; recovery through the second administrator | BE; SEC | BE-B5-05 | ADM-01 passes; TOTP mandatory | AUTH §2; OI-039 |
| AU-03 | Rate limits: codes per phone and per IP with a visible cooldown; redemption per token and per IP; failed administrator sign-ins lock out and notify | BE; SEC | SEC-06 | Limit tests pass; values recorded | AUTH §9; THREAT T10, T11 |
| AU-04 | Session lifetimes per role: members long; marshals short; administrators short idle timeout | BE | AU-01 | Timeouts tested | AUTH §7 |
| AU-05 | Sign out everywhere (member) | BE | AU-01 | Other sessions revoked | AUTH §7 |
| AU-06 | Google sign-in integrated at deployment; branding checked (VERIFY) | BE; UX | DEP-03 | Identity only; no membership granted | D-029; AUTH §2 |
| AU-07 | Generic responses for sign-in and registration; no register match shown | BE | AU-01 | MEM-02 and T12 review pass | AUTH §3; THREAT T12 |
| AU-08 | Invite token: at least 128 bits; stored as a hash; expiry; use limit | BE | BE-B4-03 | Token shape test; GST-02 passes | AUTH §5; THREAT T10 |
| AU-09 | Membership and role re-checked on each duty load and each sensitive call | BE | BE-B0-13 | Revoked role denied on the next call | AUTH §6 and §7 |
| AU-10 | Password sign-in: password policy; storage through the authentication service (VERIFY); lockout through AU-03; recovery through the phone code | BE; SEC | AU-01 | Policy written; recovery tested; credential-stuffing test passes | D-056; AUTH §9 |

---

## 7. Integrations: payments and notifications

### Payments (INT)

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| INT-01 | Provider decision (OI-025): compare fees, channels, webhook reliability and refund APIs in sandbox | INTG; SPON | GOV-03 | Decision recorded | OI-025; PAYMENTS §7 |
| INT-02 | Paystack merchant account and sandbox keys stored in the team vault | INTG | GOV-11 | Keys in vault; none in repository | D-006; START-CHECKLIST B3 |
| INT-03 | Verify Paystack points in PROVIDER-CONTRACTS §2 (hosted checkout, signature, events, verify API, refund API, fees) and record the field names | INTG | INT-02 | Checklist recorded with secrets removed | OI-033; VERIFY |
| INT-04 | Verify OPay points in PROVIDER-CONTRACTS §1 if OPay is chosen | INTG | INT-01 | Callback signature and refund API confirmed | OI-033; VERIFY |
| INT-05 | `start-payment` Edge Function: amount read from the booking; provider order created; `PROVIDER_UNAVAILABLE` is retryable | BE; INTG | BE-B1-01 | SYS: client-sent amount ignored (T8); contract test | CONTRACTS §3 |
| INT-06 | Webhook receiver: raw body verified; 401 on mismatch; event stored once; apply; 200 returned quickly | BE; INTG | INT-03 | SYS-03 and SYS-04 pass | CONTRACTS §3; ADR-0003 |
| INT-07 | `apply_payment_event`: transitions in STATE-MACHINES §3; late payment to reconciliation; amount and reference match | BE | INT-06 | SYS-05, SYS-06, MEM-12 pass | STATE-MACHINES §3 |
| INT-08 | `reconcile-payments` every 10 minutes through the same apply path | BE | INT-07 | Missed-webhook test passes | OI-020; BACKEND §6 |
| INT-09 | Refunds: provider request and status (where supported); manual refund with provider reference; failure to queue; one row per request | BE; INTG | BE-B4-09 | SYS-07 passes | D-006; PAYMENTS §6 |
| INT-10 | Daily reconciliation summary and alert for any difference | BE | INT-07 | Difference raises an alert in test | PAYMENTS §5 |
| INT-11 | Sandbox checklist (PROVIDER-CONTRACTS §3): one order; one test payment with webhook; failed payment; abandoned payment; refund; modified-body replay rejected | INTG; QA | INT-06 | Six items recorded with results | OI-033 |
| INT-12 | Contract tests with recorded payloads, secrets and personal fields removed | QA | INT-03 | Tests run in CI | TEST-STRATEGY §1 |
| INT-13 | OPay webhook on the same path, if OPay is chosen | BE | INT-04 | Same tests pass | PAYMENTS §7 |
| INT-14 | Payment wording: digital only; no cash or POS option anywhere | UX | FE-F1-15 | SYS-18 passes | D-033 |
| INT-15 | Provider keys per environment: sandbox in staging; live in production only; in function secrets | DEVOPS | ENG-12 | Names only in ENVIRONMENT-VARIABLES | ENVIRONMENT-VARIABLES; DEVOPS-PLAN §4 |

### Notifications (NOT)

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| NOT-01 | Outbox rows written in the same transaction as each event | BE | BE-B0-01 | Test: no event without an outbox row; the build fails if one is missing | NOTIFICATIONS §3, §8; TEST §2 |
| NOT-02 | Dispatcher every minute: batches with skip-locked; retry schedule; dead letters | BE | NOT-01 | Retry and dead-letter tests pass | BACKEND §4; NOTIFICATIONS §3 |
| NOT-03 | Web Push: VAPID keys per environment (START B10); subscriptions rate-limited; revoked on sign-out | BE; SEC | DEP-03 | Subscription tests pass | THREAT T18; ENVIRONMENT-VARIABLES |
| NOT-04 | Email provider with SPF, DKIM and DMARC on the sender domain | DEVOPS | DEP-09 | Sender domain verified; test message delivered | DEVOPS-PLAN §7; START-CHECKLIST B6 |
| NOT-05 | SMS vendor for sign-in codes and critical marshal alerts; per-message price recorded; cost estimate against the pilot | INTG; SPON | OI-031 | Vendor contracted; cost approved | D-028; OI-031 |
| NOT-06 | Seventeen templates in plain language (the fourteen in NOTIFICATIONS §7 plus three from D-053); booking reference always included | UX; BE | NOT-01 | NOTIFICATIONS §7 list (17) complete; LIAI review | NOTIFICATIONS §6 and §7; D-053 |
| NOT-07 | Event tests: for each event in NOTIFICATIONS §2, the outbox row exists, the recipient is right, and the content has no forbidden item | QA | NOT-06 | All 25 event rows tested | NOTIFICATIONS §8 |
| NOT-08 | Route-scoped marshal alerts: no marshal receives another assignment's alerts | QA | NOT-02 | SYS-11 passes | NOTIFICATIONS §8 |
| NOT-09 | Quiet hours 22:00 to 05:00 for non-critical messages; critical messages not held | BE | NOT-02 | MEM-33 passes (Level L) | NOTIFICATIONS §4; P-24 |
| NOT-10 | Dead-letter alert to the administrator; resend or resolve with a reason | BE; FE | NOT-02 | SYS-15 passes | NOTIFICATIONS §3 |
| NOT-11 | Failure test: provider down for 30 minutes; rows retry, go dead, then alert | QA | NOT-02 | Test passes | NOTIFICATIONS §8 |
| NOT-12 | Add the three alerts decided in D-053: marshal new-booking alert; marshal payment-change alert; programme reminder the day before to booked riders | BE | D-053 | Event rows added; tests added (NOT-07) | D-053; BRD §13, §18 |
| NOT-13 | Waiting-list offer by push and SMS; expiry notice to the next rider | BE | BE-B1-14 | MEM-21 passes | D-035; NOTIFICATIONS §2 |
| NOT-14 | Permission request after the first booking or duty, not on first launch | FE | NOT-02 | Checked in test | NOTIFICATIONS §5 |
| NOT-15 | Every message also appears in the in-app inbox | BE | NOT-02 | MEM-32 passes | NOTIFICATIONS §1; FR-108 |

---

## 8. Deployment

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| DEP-01 | Staging Supabase project; tier as A-10 decides | DEVOPS | GOV-07 | Project exists; migrations apply | DEVOPS-PLAN §1 |
| DEP-02 | Latency measurement from Lagos test connections to candidate regions; record the result; choose the region (it cannot be changed after creation) | DEVOPS | F4 (test connections) | Result recorded; region chosen | OI-032; OPTIMISATION §3; START-CHECKLIST F4 |
| DEP-03 | Vercel Pro team owned by the church; project; preview deployments; staging domain | DEVOPS | GOV-11 | Preview created per branch | DEVOPS-PLAN §1; START-CHECKLIST B1 |
| DEP-04 | Environment variables per environment, from ENVIRONMENT-VARIABLES; values in platform settings and the vault | DEVOPS | ENG-12 | Names match the register | DEVOPS-PLAN §4 |
| DEP-05 | CI pipeline: install, lint, typecheck, unit, pgTAP, contract, build; preview runs Playwright and axe; merge blocked unless green | DEVOPS; QA | ENG-01 | Failing check blocks merge | DEVOPS-PLAN §3; D-019 |
| DEP-06 | Migrations applied to staging on merge; to production only after release approval | DEVOPS; DB | DEP-05 | Migration log in release record | DEVOPS-PLAN §3 |
| DEP-07 | Production Supabase project: tier per D-027 and the pilot review; region per DEP-02 | DEVOPS | DEP-02; OI-047 | Project exists; secrets set | D-027; DEVOPS-PLAN §1 |
| DEP-08 | Production Vercel project with custom domain on a church-owned registrar; HTTPS; one canonical host | DEVOPS | START-CHECKLIST B5 | Domain resolves; TLS valid; redirect set | DEVOPS-PLAN §7; NEW |
| DEP-09 | Email sender domain verified (SPF, DKIM, DMARC) | DEVOPS | START-CHECKLIST B6 | Verification recorded | DEVOPS-PLAN §7 |
| DEP-10 | Off-platform backup: scheduled encrypted `pg_dump` to the storage chosen in OI-047; retention set; keys held by two people. Required before any real member data | DEVOPS | OI-047 | Job runs on schedule; one dump restored in DEP-12 | RISK-010; DEVOPS-PLAN §5 |
| DEP-11 | Paused-project procedure and keep-alive decision: check whether a scheduled query counts as activity (VERIFY); project status monitored | DEVOPS | DEP-07 | Decision recorded; runbook written | RISK-009; DEVOPS-PLAN §8; D-027 |
| DEP-12 | Restore drill: restore the latest backup to a scratch project; count bookings, payments and riders against the source; record | DEVOPS; QA | DEP-10 | Counts match; repeat quarterly and before pilot | DEVOPS-PLAN §5; SYS-16 |
| DEP-13 | Monitoring: error tracking (OI-047); uptime check on the public address and `/api/health`; Supabase log alerts; budget alerts at 50 and 80 percent | DEVOPS | OI-047 | Test alert received | DEVOPS-PLAN §6 and §9 |
| DEP-14 | Provider webhook addresses set to the production functions with live keys, only after INT-11 is signed | DEVOPS; INTG | INT-11 | Test event accepted in production with a test account | DEVOPS-PLAN; roadmap §10 item 4 |
| DEP-15 | Scheduled jobs enabled: hold expiry, dispatch, reconciliation, booking window open and close, weekly digest, monthly retention | DEVOPS | BE-B1-06, NOT-02, INT-08 | Each job shows last run | FR-159; BACKEND §3 to §6 |
| DEP-16 | Roster import into production for the approved scope, after the steward is named | ADM; DEVOPS | OI-015 | Import batch recorded | START-CHECKLIST D1 |
| DEP-17 | Administrator accounts with second factor; second administrator enrolled | ADM; SEC | AU-02 | Two administrators sign in with second factor | OI-014; START-CHECKLIST C9 |
| DEP-18 | Smoke test with a test account only: sign in, book, cancel, confirm audit rows. A live payment test only if the provider permits and it is recorded | QA; DEVOPS | DEP-14 | Test account cleaned up; audit rows confirmed | roadmap §10 item 7; VERIFY |
| DEP-19 | Rollback rehearsal: promote the previous frontend deployment; forward-only migrations; redeploy previous functions | DEVOPS | DEP-06 | Rehearsal recorded | DEVOPS-PLAN §3 |
| DEP-20 | Runbooks written and reviewed by the on-call administrator: payment webhook failing; outbox backing up; manifest will not load; administrator locked out; project paused; provider secret exposed | DEVOPS; ADM | BE-B5-05 | Each runbook reviewed and dated | DEVOPS-PLAN §8 |
| DEP-21 | Secret rotation and staff-access change procedure | DEVOPS; SEC | ENG-12 | Procedure written; tested once on staging | DEVOPS-PLAN §4 |
| DEP-22 | Monthly cost review against the figures in DEVOPS-PLAN §2 | DEVOPS; SPON | DEP-13 | Review recorded | OPTIMISATION §4; D-027 |
| DEP-23 | Staging reset to seed data monthly; preview deployments removed when their branch merges | DEVOPS | ENG-18 | Reset recorded | DEVOPS-PLAN §9 |
| DEP-24 | App routes marked to stay out of search results; public pages only indexed if the church asks | FE; DEVOPS | DEP-08 | Header and robots file checked | NEW |

---

## 9. Review

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| REV-01 | Pull request review by a second person, with a checklist: no business rule in the UI; no card field; no secret; row-level security and function checks; audit row; tests added | PM; BE; FE | ENG-01 | Checklist ticked on each pull request | DEVELOPMENT-STRATEGY §6.2; THREAT T4 |
| REV-02 | Anti-bloat review tags on each pull request (ENG-15) | PM | ENG-15 | Tags present; net line count recorded | SKILLS/03-REVIEW-PROTOCOL |
| REV-03 | Migration review: forward-only; reversal note; destructive change needs a written plan and sponsor confirmation | DB; SPON | BE-B0-01 | Review recorded | DEVOPS-PLAN §3 |
| REV-04 | Contract conformance: generated client and functions compared with CONTRACTS at each frontend stage exit and at B0 exit | BE; FE | ENG-04 | Diff clean; any difference is a change request | DEVELOPMENT-STRATEGY §7.2 |
| REV-05 | Architecture review at B0 exit against ADR-0002: no client writes to state tables; one transaction per transition; outbox for every message | BE; DB | BE-B0-07 | Review signed | ADR-0002 |
| REV-06 | Parity review: the same state-rule suite passes on the stand-in and on the database | QA | TST-02 | Both runs green; any difference is a defect in the side that differs | DEVELOPMENT-STRATEGY §6.2 |
| REV-07 | Liaison walkthrough at each exit of F1, F2 and F3, using the scripted journeys | PM; LIAI | FE-F1 to FE-F3 | Findings logged as Q- or BUG- entries | IMPLEMENTATION-ROADMAP §3 |
| REV-08 | Plain-language review of member and marshal text | UX; LIAI | FE-F0-09 | Review recorded | FRONTEND §4 |
| REV-09 | Accessibility review by a screen-reader user | UX | FE-F5-02 | Findings resolved or logged | NEW |
| REV-10 | Security review of every SECURITY DEFINER function by someone other than the author | SEC | BE-B0-07 | Review recorded per function | NEW; ADR-0002 |
| REV-11 | Threat model updated for any decision that touches sign-in, payments, notifications or data | SEC; PM | Each decision | Threat model dated with the decision | THREAT-MODEL header |
| REV-12 | Drift check before each stage exit: documents against the decision log | PM | Each stage | Check recorded; findings resolved | IMPLEMENTATION-ROADMAP §3 |
| REV-13 | Counsel review of the privacy notice, the processor terms and the safeguarding rule | COUN; SPON | GOV-12 | Written outcome | OI-038; P-16; P-18 |
| REV-14 | Release record: QA signs; product manager records residual risk acceptance in writing; sponsor informed | QA; PM | TST-21 | Record filed per release | D-019 |
| REV-15 | Blameless review after each severity 1 or 2 incident | PM; ADM | OPS | Review filed | ISSUE-MANAGEMENT; RISK-ASSESSMENT L-6 |
| REV-16 | Decision record for each deviation from the frozen set, before it is merged | PM | GOV-08 | Entry exists before merge | DEVELOPMENT-STRATEGY §10 |

---

## 10. Security development

Threat identifiers (T1 to T24) are from `SECURITY/THREAT-MODEL.md` §4. Each security task names the threat it addresses.

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| SEC-01 | Threat model: map each of T1 to T24 to a test ID; update when decisions change | SEC | GOV-08 | Every threat has a test or a recorded residual risk | THREAT-MODEL §4 and §8 |
| SEC-02 | Every transport table has row-level security enabled; a test fails when one does not | SEC; DB | BE-B0-10 | Test passes; a seeded table without RLS fails it | NEW; ADR-0002 |
| SEC-03 | Function grant audit: every function has a pinned search path and no public execute | SEC; DB | BE-B0-07 | Audit passes in CI | ADR-0002 |
| SEC-04 | Webhook tests: bad signature, replay, duplicate, tampered body | QA; INTG | INT-06 | T6 and T7 tests pass | THREAT T6, T7 |
| SEC-05 | Invite token: at least 128 bits; hashed storage; expiry; use limit; rate-limited redemption | SEC; BE | AU-08 | T10 test passes | THREAT T10 |
| SEC-06 | Rate limits: codes per phone and per IP; redemption; submissions; administrator lockout. Values recorded and reviewed after the pilot | SEC | AU-03 | Values in the register; tests pass | AUTH §9; RATE-1 to RATE-3 |
| SEC-07 | Enumeration review: sign-in and registration responses checked for any roster match signal | SEC | AU-07 | T12 review recorded | THREAT T12 |
| SEC-08 | Administrator hardening: second factor mandatory; short sessions; lockout notice | SEC | AU-02 | T14 config check passes | THREAT T14 |
| SEC-09 | Secret hygiene: secret scan in pre-commit and CI; `NEXT_PUBLIC_` check; log redaction test; no raw bodies in logs | SEC | ENG-13 | T16 checks pass | THREAT T16 |
| SEC-10 | Dependency security: lockfile; audit in CI; automatic alerts; minimal dependencies | SEC; BE; FE | ENG-14 | Audit step passes | THREAT T19 |
| SEC-11 | HTTP headers: content security policy, strict transport security, frame restriction, referrer policy, no content sniffing | SEC; FE | ENG-11 | Header scan passes | NEW |
| SEC-12 | Input validation at every boundary; invalid input refused with `VALIDATION_FAILED` | BE; FE | ENG-07 | Negative tests pass | CONTRACTS §1; ADR-0002 |
| SEC-13 | Output safety: no unsafe HTML rendering; support messages escaped | FE | FE-F1-22 | Scan finds no unsafe rendering | NEW |
| SEC-14 | Session cookies: HttpOnly, Secure, SameSite; no tokens in browser local storage | FE; SEC | AU-01 | Cookie attributes checked (VERIFY framework defaults) | FRONTEND §1 |
| SEC-15 | Audit coverage test: every state-changing function writes an audit row | QA | BE-B0-03 | SYS-14 passes | SYS-14 |
| SEC-16 | Append-only test: update and delete denied on audit and transition tables for every role | QA | BE-B0-03 | T15 and ADM-20 tests pass | THREAT T15 |
| SEC-17 | Personal-data minimisation review: columns and payloads checked against DATA-MODEL §2 and THREAT §5; no location or identity-document field | SEC | BE-B0-01 | Review recorded | THREAT §5 |
| SEC-18 | Logs and analytics aggregated only; no per-tap tracking | SEC; FE | FE-F5-04 | Review recorded | OPTIMISATION §4 |
| SEC-19 | Backups encrypted; key held by two people; restore access logged | SEC; DEVOPS | DEP-10 | Checked at the restore drill | NEW; DEVOPS-PLAN §5 |
| SEC-20 | Staff access: grants and revocations audited; offboarding the same day | SEC; ADM | BE-B4-14 | ADM-23 passes; procedure written | P-22; ADM-23 |
| SEC-21 | Marshal device controls: short sessions; sign-out on inactivity; manifest limited to the assignment | SEC; FE | FE-F2-01 | T20 manual test on duty | THREAT T20 |
| SEC-22 | Penetration-style review of the member and administrator flows by a second person (not the author) | SEC | Feature complete | Findings closed or accepted in writing | THREAT §7 |
| SEC-23 | Authorisation fuzzing: call every function as each role with foreign identifiers; expect denial | SEC; QA | BE-B0-08 | Matrix recorded; no unexpected success | NEW |
| SEC-24 | Provider payloads: redacted; no customer contact from the provider stored | INTG; SEC | INT-06 | Storage check passes | PROVIDER-CONTRACTS §4 |
| SEC-25 | Privacy notice and consent wording reviewed by counsel | COUN | GOV-12 | Written outcome; notice text approved | OI-038; START-CHECKLIST D9 |
| SEC-26 | Processor terms accepted and recorded: Vercel, Supabase, providers, email, SMS | SPON | GOV-12 | Record filed | START-CHECKLIST E2 |
| SEC-27 | Card-data scope confirmed by a qualified reviewer | SEC | INT-14 | Written outcome | START-CHECKLIST E3; PAYMENTS §8 |
| SEC-28 | Retention jobs tested on synthetic data | QA | BE-B5-01 | FR-149 tests pass | DATA-MODEL §4 |
| SEC-29 | Breach response procedure: detect, contain, assess, notify, record; contact list shared with administrators | SEC; SPON | DEP-20 | Procedure and contacts issued | THREAT §5 and §7 |
| SEC-30 | Incident drill on staging: rotate a provider key; check the audit window | DEVOPS; SEC | DEP-17 | Drill recorded | DEVOPS-PLAN §8 |
| SEC-31 | Administrator activity digest operating and reviewed | SEC; SPON | BE-B4-10 | First digest reviewed | OI-013 |
| SEC-32 | Quarterly access review for administrator and marshal roles | SEC | DEP-17 | First review recorded before pilot | P-22; NEW cadence |

---

## 11. Final testing before public use

### Test layers

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| TST-01 | Unit tests (Vitest): money, labels, validators, state label mapping | FE; BE | ENG-06 | Green in CI | TEST-STRATEGY §1 |
| TST-02 | State-rule suite: one table, run on the stand-in and on the database | QA | ENG-05 | Green on both | DEVELOPMENT-STRATEGY §6.2 |
| TST-03 | pgTAP: state legality, row-level security, capacity under lock, idempotency, audit presence, append-only | QA; DB | BE-B0-09 | Green in CI | TEST-STRATEGY §1 |
| TST-04 | Contract tests for Edge Functions with recorded payloads | QA | INT-12 | Green in CI | TEST-STRATEGY §1 |
| TST-05 | Integration: frontend against the local stack through the API | QA | BE-B1 | Green in CI | TEST-STRATEGY §1 |
| TST-06 | End-to-end Playwright: journeys A to H on mobile and desktop viewports | QA | F1 to F4 | Green on preview and staging | TEST-STRATEGY §1; FRONTEND §9 |
| TST-07 | Concurrency with k6: seat holds at twice capacity; expiry under load | QA | BE-B1-16 | Report in release record | TEST-STRATEGY §4 |
| TST-08 | Accessibility: axe on every route; keyboard path for the administrator | QA | FE-F5-02 | Zero serious violations | TEST-STRATEGY §1 |
| TST-09 | Edge-case register: PRD draft §6 items 1 to 7 each mapped to a test | QA | TST-03 | Mapping recorded; each test green | TEST-STRATEGY §2 |
| TST-10 | Additional state tests: duplicate webhook; bad signature; expiry run twice; return page without payment; client amount ignored; illegal transition; cross-member read; cross-bus read; internal note; invite redeemed twice; offline banner | QA | TST-03 | Each test green | TEST-STRATEGY §2 |
| TST-11 | Acceptance criteria mapped to automated tests: all 116. Level P criteria must pass on the stand-in and on the real backend | QA; PM | ENG-17; BE-B1 | Mapping file lists each criterion with its test ID; both runs green | D-047; ACCEPTANCE-CRITERIA §1 |
| TST-12 | Load at pilot size and at twice pilot size | QA | BE-B1-16 | Report recorded | IMPLEMENTATION-ROADMAP Stage 5 |
| TST-13 | Performance budgets checked on the mid-range profile | QA | FE-F5-03 | Budgets met | OPTIMISATION §2 |
| TST-14 | Sandbox payment checklist for each payment release | QA; INTG | INT-11 | Recorded results | TEST-STRATEGY §1 |
| TST-15 | Failure injection: provider down for 30 minutes; delayed webhook; duplicated webhook; database pause with runbook dry run | QA | NOT-11; INT-08 | Each recorded | NOTIFICATIONS §8; TEST §2 |
| TST-16 | Restore drill with counts | QA; DEVOPS | DEP-12 | Counts match | SYS-16 |
| TST-17 | Offline tests: network off on the manifest; queued taps replay; conflicts handled | QA | FE-F2-12 | MAR-10 and OI-046 rule tests pass | MAR-10; OI-046 |
| TST-18 | Device tests: iOS 16.4 or later install and push; Android install and push; mid-range Android performance | QA | FE-F5-01 | Matrix recorded | START-CHECKLIST F2 and F3 |
| TST-19 | Usability: a first-time member can sign up, wait for approval and book without help | QA; UX | UAT-3 | Result recorded | TEST-STRATEGY §6 |
| TST-20 | Regression suite on every release | QA | TST-06 | Green before each release | IMPLEMENTATION-ROADMAP §9 |
| TST-21 | Release gate: tests green; NEXT_PUBLIC scan; no serious accessibility violation; migrations on staging; sandbox run recorded; no open severity 1 | QA | DEP-05 | Gate checklist signed | TEST-STRATEGY §3; D-019 |
| TST-22 | Scenario coverage: each Decided and Designed row of the scenario table has a test; each POLICY row has a criterion or a deferred ID | QA; PM | TST-11 | Coverage table complete; deferred IDs listed | D-047 consequence; SCENARIOS §1 |
| TST-23 | UAT-1 administrator session: create and cancel a special event; publish and open with second approval; approve a registration; triage a report; audit entries visible | ADM; QA | G-PILOT prerequisites | Completed without developer help | TEST-STRATEGY §6 |
| TST-24 | UAT-2 marshal duty: board, no-show, walk-on, incident, contact admin, summary; manifest matches the paper list; no double boarding | MAR; QA | G-PILOT prerequisites | Pass criteria in TEST-STRATEGY §6 met | TEST-STRATEGY §6 |
| TST-25 | UAT-3 member: sign up, wait for approval, book, pay in sandbox, cancel, report | Member volunteer; QA | G-PILOT prerequisites | Member understands each state without help; payment on provider page | TEST-STRATEGY §6 |
| TST-26 | UAT-4 marshal and administrator: offline manifest export on duty | MAR; ADM | FE-F2-13 | Printout matches last-synced data with time shown | TEST-STRATEGY §6 |
| TST-27 | Test reporting: results linked from the release record; failures carry the state machine or test ID | QA | TST-20 | Links present | TEST-STRATEGY §7 |
| TST-28 | Regression seeds for each corrected rule (for example, group refunds after P-02) | QA | Policy decisions | Seeds added before release | NEW |

### Security acceptance

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| TST-29 | Security acceptance checklist complete: T1 to T16 in CI; no `NEXT_PUBLIC_` secret; MFA on every administrator; restore drill passed; data protection outcome recorded; incident contacts shared | SEC | SEC-01 to SEC-32 | Checklist signed with evidence | THREAT-MODEL §7 |

---

## 12. Public-use release gate

Every item must be closed before the church uses the app beyond the pilot. The scope of "public use" is set by OI-049.

| ID | Requirement | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| PUB-01 | Scope decided: pilot group first, then all members after the 30-day review (D-054) | SPON | GOV-02 | Decision recorded | OI-049; D-054 |
| PUB-02 | All 110 Level P criteria pass on the real backend | QA | TST-11 | Release record shows the pass | D-047 |
| PUB-03 | Security acceptance complete, with the second-person review | SEC | TST-29; SEC-22 | Checklist signed | THREAT-MODEL §7 |
| PUB-04 | Restore drill passed; off-platform backup running for an agreed period before public use | DEVOPS | DEP-10, DEP-12 | Two weeks of backup records (proposal; NEW) | RISK-001; RISK-010 |
| PUB-05 | Data protection outcome recorded; privacy notice published in the app | SPON; COUN | SEC-25 | Notice visible at sign-up (FR-148) | OI-038 |
| PUB-06 | Processor terms and card-data scope confirmed | SPON; SEC | SEC-26, SEC-27 | Records filed | START-CHECKLIST E2, E3 |
| PUB-07 | Pilot exit criteria met: manifest matches the paper list at departure; no unresolved payment differences; missed-alert rate under the agreed threshold; no severity 1 open | PM | Pilot | Pilot record signed | IMPLEMENTATION-ROADMAP §8 |
| PUB-08 | UAT-1 to UAT-4 passed with recorded results | QA; ADM; MAR | TST-23 to TST-26 | Results filed | TEST-STRATEGY §6 |
| PUB-09 | Two trained administrators with second factor enrolled | SPON; ADM | DEP-17 | Names recorded | OI-014 |
| PUB-10 | Pilot policies ratified, or defaults labelled provisional with an expiry date | DEPT; SPON | GOV-05 | Register shows each status; P-01, P-03, P-04, P-05, P-07, P-12, P-14, P-16, P-22, P-23 ratified first | DEPARTMENT-POLICY-REGISTER §3 and §4 |
| PUB-11 | Support queue staffed; response targets confirmed | DEPT; SPON | P-23 | Targets recorded | SUPPORT §4; D-042 |
| PUB-12 | Runbooks reviewed by the on-call administrator | ADM | DEP-20 | Review dated | DEVOPS-PLAN §8 |
| PUB-13 | Rollback rehearsed | DEVOPS | DEP-19 | Rehearsal recorded | DEVOPS-PLAN §3 |
| PUB-14 | No serious accessibility violation open on public routes | QA | TST-08 | Scan clean | FRONTEND §6 |
| PUB-15 | Performance budgets met on the mid-range profile | QA | TST-13 | Report filed | OPTIMISATION §2 |
| PUB-16 | Member communications approved by the liaison (P-24); fallback instructions (WhatsApp and phone) included | LIAI | P-24 | Approved text filed | D-033; SUPPORT §1 |
| PUB-17 | Install instructions tested on iOS 16.4 or later and on Android | QA | TST-18 | Result recorded | D-009 |
| PUB-18 | Roster import completed for the approved scope; steward named | DEPT; ADM | OI-015 | Import batch recorded | START-CHECKLIST D1 |
| PUB-19 | Release record signed by QA; residual risks accepted in writing by the product manager | QA; PM | REV-14 | Record filed | D-019 |
| PUB-20 | Sponsor's go or no-go recorded in the decision log | SPON | PUB-01 to PUB-19 | Entry dated | D-045 pattern |
| PUB-21 | 30-day review date set | PM | PUB-20 | Date in the roadmap | IMPLEMENTATION-ROADMAP §9 |

---

## 13. After launch (operations)

| ID | Task | Owner | Depends on | Done when | Source |
|---|---|---|---|---|---|
| OPS-01 | Daily checks: failed webhooks, dead outbox rows, payment differences, overdue support items | DEVOPS; ADM | PUB-20 | Checks logged | DEVOPS-PLAN §6 |
| OPS-02 | Weekly administrator audit digest reviewed | SPON; SEC | BE-B4-10 | Review logged | OI-013 |
| OPS-03 | Monthly cost review | DEVOPS; SPON | DEP-22 | Review logged | DEVOPS-PLAN §9 |
| OPS-04 | Quarterly restore drill | DEVOPS | DEP-12 | Drill logged | DEVOPS-PLAN §5 |
| OPS-05 | Quarterly access review | SEC | SEC-32 | Review logged | P-22 |
| OPS-06 | Scale triggers watched (database size; hold latency; dead letters; quota abuse) | DEVOPS | Launch | Trigger log | OPTIMISATION §8 |
| OPS-07 | 30-day review: support load; payment reconciliation; notification delivery; cost against OI-030 | PM; SPON | PUB-21 | Decision: continue, change or stop | IMPLEMENTATION-ROADMAP §9 |
| OPS-08 | Pilot-gate review of the hosting tier (Supabase Free or Pro) | SPON | DEP-07 | Decision recorded | D-027; OI-030 |
| OPS-09 | Guest share review after the pilot | PM; DEPT | Pilot | Decision recorded | D-040; RISK-012 |
| OPS-10 | Cash-reliant member review at the pilot | LIAI; PM | Pilot | Result recorded | RISK-011 |
| OPS-11 | Blameless review of each severity 1 or 2 incident | PM | Incident | Review filed | REV-15 |
| OPS-12 | Policy reviews on their expiry dates | DEPT | Register | Reviews recorded | DEPARTMENT-POLICY-REGISTER §4 |

---

## 14. Module coverage check

Each module in the candidate PRD (MOD-01 to MOD-23) is checked against the tasks above. A module with no task is a gap, and the table makes it visible.

| Module | Frontend | Backend and database | Integrations and security | Testing and criteria |
|---|---|---|---|---|
| MOD-01 Identity and sign-in | FE-F0-07, FE-F1-01 to 03, FE-F1-26, FE-F1-34 | BE-B0-13, BE-B0-14 | AU-01 to AU-10, SEC-06 to SEC-08 | MEM-01, MEM-02, ADM-01 |
| MOD-02 Membership and registration | FE-F1-04, FE-F1-05, FE-F3-03 | BE-B4-03, BE-B4-04, BE-B4-13 | AU-07; **blocked by D-007** | MEM-03 to MEM-06, ADM-02, ADM-03 |
| MOD-03 Guests | FE-F1-24, FE-F4-01 to 08 | BE-B4-03 | AU-08, SEC-05 | GST-01 to GST-12 |
| MOD-04 Programmes and special events | FE-F1-06, FE-F1-07, FE-F3-04 to 07 | BE-B4-01, BE-B4-02 | (none) | ADM-04, ADM-05, ADM-13 |
| MOD-05 Routes, pickup points and buses | FE-F3-05, FE-F3-08 | BE-B0-01, BE-B1-12 | (none) | ADM-06 to ADM-08, ADM-25 |
| MOD-06 Assignments, capacity and ledger | FE-F3-05 | BE-B1-01, BE-B1-13, BE-B1-16 | (none) | SYS-01, ADM-06 |
| MOD-07 Booking | FE-F1-08 to FE-F1-14, FE-F1-18, FE-F1-19 | BE-B1-01 to BE-B1-05 | INT-05 | MEM-07 to MEM-13, MEM-35, MEM-39, MEM-40 |
| MOD-08 Waiting list | FE-F1-21, FE-F3-10 | BE-B1-14, BE-B1-15 | NOT-13 | MEM-20 to MEM-24, GST-09, ADM-09, ADM-10 |
| MOD-09 Payments | FE-F1-15 to FE-F1-17 | BE-B0-07 | INT-01 to INT-15, SEC-24, SEC-27 | MEM-12 to MEM-16, SYS-03 to SYS-08, SYS-18 |
| MOD-10 Refunds and financial controls | FE-F3-13, FE-F3-12 | BE-B4-09 | INT-09, INT-10 | MEM-19, ADM-14, ADM-15, ADM-22, SYS-07 |
| MOD-11 Manifest and boarding | FE-F2-03 to FE-F2-07, FE-F2-13, FE-F2-16 | BE-B1-05, BE-B1-09 to BE-B1-11 | (none) | MAR-01 to MAR-09, MAR-20, MAR-21, SYS-12 |
| MOD-12 Marshal duty and walk-ons | FE-F2-01, FE-F2-02, FE-F2-06, FE-F2-09, FE-F2-14, FE-F2-15 | BE-B4-14 | AU-09, SEC-21 | MAR-10 to MAR-19 |
| MOD-13 Travel-day incidents | FE-F2-08, FE-F3-16 | BE-B4-06 | (none) | MAR-13, ADM-24 |
| MOD-14 Notifications and inbox | FE-F1-25, FE-F1-32 | BE-B1-15, BE-B4-12 | NOT-01 to NOT-15 | MEM-21, MEM-32, MEM-33, SYS-11, SYS-15 |
| MOD-15 Support and problem reports | FE-F1-22, FE-F1-23, FE-F2-10, FE-F2-11, FE-F3-15, FE-F3-23 | BE-B4-05 | SEC-13 | MEM-27 to MEM-29, MAR-12, MAR-14, ADM-18 |
| MOD-16 Reports and exports | FE-F3-18 | BE-B4-11 | (none) | ADM-11, ADM-21 (criteria for reports to be added: TST-22) |
| MOD-17 Audit, corrections and oversight | FE-F3-11, FE-F3-19, FE-F3-21 | BE-B0-03, BE-B4-07, BE-B4-10, BE-B4-16 | SEC-15, SEC-16, SEC-31 | ADM-17, ADM-20, SYS-14 |
| MOD-18 Administration | FE-F3-01, FE-F3-09, FE-F3-20, FE-F3-22 | BE-B4-13 to BE-B4-15 | SEC-08, SEC-20, DEP-17 | ADM-01, ADM-08, ADM-23 |
| MOD-19 Broadcast | FE-F3-17 | BE-B4-12 | (none) | ADM-19 (Level L) |
| MOD-20 Privacy, retention and data requests | (none beyond FE-F1-22 text) | BE-B5-01, BE-B5-02, BE-B0-05 | SEC-17, SEC-25, SEC-26, SEC-28 | **No criteria yet**: FR-148 to FR-152 to be mapped in TST-22 |
| MOD-21 Install, installable app and offline | FE-F0-02, FE-F1-27, FE-F1-31, FE-F1-33, FE-F2-12 | (none) | (none) | MEM-34, MEM-37, MAR-10, TST-17, TST-18 |
| MOD-22 Platform operations | ENG-10 | BE-B5-03 to BE-B5-05, BE-B1-06 | DEP-01 to DEP-24 | SYS-16, SYS-17 |
| MOD-23 Accessibility, content and language | FE-F0-09, FE-F5-02, FE-F5-07 | (none) | REV-08, REV-09 | MEM-36 |

**Gaps this check found** (each is an open issue, so none is silently dropped): MOD-20 has no acceptance criteria (TST-22); MOD-16 has no criteria for the programme, route and payment reports; MOD-02 and MOD-07 depend on D-007 and D-003 (reconvene); MOD-08 depends on A-02; MOD-01 depends on OI-031 for SMS.

---

## 15. What this plan does not decide

- Dates and team sizes. Set by the sponsor (DEVELOPMENT-STRATEGY §10).
- The provider (OI-025), the SMS vendor (OI-031), the backup destination (OI-047) and the monitoring tools (OI-047). Each is a named task with an owner.
- Any policy text. The department writes it (DEPARTMENT-POLICY-REGISTER). The product holds a default only with a labelled expiry.
- Any sign-off. Nothing here is approved until GOV-07 to GOV-09 are done.
