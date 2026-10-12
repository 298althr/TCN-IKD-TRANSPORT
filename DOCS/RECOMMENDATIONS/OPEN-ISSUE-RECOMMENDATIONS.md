# Open-Issue Recommendations

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Product Manager
**Source of truth for status:** `DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md`. This table advises; it does not decide.

Blocking means a named gate cannot pass until the issue closes. Decision owner is the person or body who decides, per `AGENTS.md` Part I §2 and D-012.

---

## A. Stack, backend, data

| ID | Issue (short) | Recommendation | Decision owner | Blocks | Affects |
|---|---|---|---|---|---|
| OI-001 | D-002, D-003, D-007/AUTH-2 unresolved | Reconvene in two sessions: technical (stack, hold) and policy (membership). Ratify D-024 in the technical session | Original respondents | All engineering | ADR-0001, BACKEND, DATA-MODEL |
| OI-003 | Security, audit and immutability policy unscoped | Adopt first-pass mutability list (DATA-MODEL §3); Security circulates for objection | Security (proposes), PM (arbitrates) | Schema lock | DATA-MODEL, SECURITY |
| OI-008 | Multi-product readiness | Namespace schema `transport` now; no multi-tenant build | Database | Schema lock | DATA-MODEL |
| OI-009 | "Context management" unclear | Shared request context object (actor, role, on-behalf-of, programme or booking reference) feeding audit; confirm intent with sponsor first | Sponsor (confirm), Backend | Audit first pass | BACKEND §7 |
| OI-011 | Data science contract | DS writes metric spec now; schema dictionary after stack; anonymisation standard before any extract | DS, Database, Security | Empirical analytics | DATA-MODEL, D-022 |
| OI-029 | Where webhooks and jobs run | Edge Functions for provider webhooks and jobs; route handlers for pages only | Backend | Payment build | ADR-0002, API-CONTRACTS |
| OI-032 | Region for Lagos latency | Measure from Lagos test connections; choose nearest region with best measured latency; Vercel functions in `cpt1` if measured benefit | DevOps | Production project creation | DEVOPS, OPTIMISATION |
| OI-035 | Test tooling after stack change | Accept Vitest, Playwright, pgTAP, k6 | QA | CI build | TESTING |

## B. Money and payments

| ID | Issue (short) | Recommendation | Decision owner | Blocks | Affects |
|---|---|---|---|---|---|
| OI-002 | Proof-of-payment upload scope | **Closed (D-033):** no manual payment records exist, so no upload or receipt field is needed | Sponsor | None | PAYMENTS, SUPPORT |
| OI-018 | Group partial refunds | Refund to the payer (host) for cancelled riders, provisional and admin-approved, until OI-036 rules | Sponsor | Refund build | PAYMENTS §4 |
| OI-020 | Missed webhook reconciliation | Adopt: 10-minute reconciliation of aged redirected payments through the same apply path | Backend | Payment go-live | PAYMENTS §5 |
| OI-023 | Cash versus "no cash" | **Closed (Q-006, D-033):** fully digital through Paystack and/or OPay. No cash, no POS, no manual records. D-021 retired. RISK-011 records the cash-reliant members concern | Sponsor | None | D-021 (retired), D-033, ADR-0003 |
| OI-025 | Paystack, OPay or both | Paystack first behind a provider interface; add OPay after sandbox comparison of fees, channels and refund API | Sponsor (after Integrations comparison) | Provider build | PAYMENTS §7 |
| OI-033 | Provider contracts unverified | Sandbox checklist (PROVIDER-CONTRACTS §3) signed before payment code | Integrations | Payment build | PAYMENTS |
| OI-036 | Refund policy owner and rules | **Owner set (Q-014, D-038):** department drafts from scratch; PM supplies the decision list as input. Refund automation waits for a ratified policy. Draft date to set | Sponsor (approval), Department (drafting) | Refund build | PAYMENTS §6, STATE-MACHINES §4 |
| OI-022 | Cancellation cutoff boundary | **Decided as default (Q-009, D-032):** 12 hours before departure; admin sets a different cutoff per programme with a reason. Department confirms the number | Sponsor | Cancellation build | STATE-MACHINES §1 |

## C. Hosting, cost and vendor terms

| ID | Issue (short) | Recommendation | Decision owner | Blocks | Affects |
|---|---|---|---|---|---|
| OI-005 | Backup strategy | Supabase Pro daily backups for production; scheduled `pg_dump` copy off-platform; restore drill before pilot. Closes RISK-001 | DevOps | Production | DEVOPS §5 |
| OI-007 | Insurance (technical vs financial) | Technical DR under OI-005 now; financial cyber insurance as a separate leadership question with no engineering gate | PM (splits), Liaison (leadership) | None | SECURITY |
| OI-030 | Hosting cost versus vendor terms | **Decided (Q-002, D-027):** Vercel Pro + Supabase Free. Revisit at pilot gate. The original recommendation (Vercel Pro + Supabase Pro, about $45 per month) stays on record | Sponsor | Closed; pilot-gate review | DEVOPS §2, §5, D-027 |

## D. Membership, identity, guests

| ID | Issue (short) | Recommendation | Decision owner | Blocks | Affects |
|---|---|---|---|---|---|
| OI-004 | Browse-only before install | Browse-only (programmes visible, booking gated behind install) | UI/UX (proposes), PM (confirms) | Landing page | FRONTEND §2 |
| OI-006 | "Contribution quota" meaning | Assume API rate limiting by profile; confirm with sponsor | Sponsor | Rate-limit design | AUTH §9 |
| OI-012 | Correction and dispute authority | Supersession records with reason; admin corrects; member dispute through support category `booking_problem`; PM is the escalation point | Security (policy) | Audit build | DATA-MODEL §2.6, STATE-MACHINES §11 |
| OI-013 | Audit review cadence | Monthly review by two named admins; sponsor digest quarterly | Sponsor | Launch | ISSUE-MANAGEMENT |
| OI-014 | Single admin dependency | At least two trained admins before pilot; runbook (DEVOPS §8) | Sponsor | Pilot | DEVOPS, AUTH §8 |
| OI-015 | Membership register stewardship | Named register owner in the church; quarterly CSV import; import batches recorded and reversible | Sponsor (name owner) | Roster import | AUTH §4 |
| OI-016 | Entity lifecycle (retirement) | Use `retired`, `removed`, `expired` states as defined in STATE-MACHINES; no hard deletes | Database | Schema lock | DATA-MODEL §3 |
| OI-017 | Seat-hold hoarding | Cap concurrent holds per member (proposed 2); auto-expiry; repeated expiry raises an admin flag | Backend (with D-003) | Hold build | BACKEND §10 |
| OI-024 | Special-event governance | **Decided (Q-019, D-042):** admin creates; second admin approves before booking opens; required fields; no edits to sold bookings without correction; cancellation cascades to refund queue | Department (rules), Sponsor | Special-event build | PRODUCT/PROGRAMMES §1 |
| OI-026 | Support ownership and SLA | **Decided in part (Q-018, D-042):** split by category; finance contact named by the church; targets as proposed in SUPPORT §4 | Department, Sponsor | Support build | SUPPORT |
| OI-028 | Guest and registration governance | Hybrid: queue by default; invite-link path without approval; member-onboarded guests attached to host; conversion through approval (24-hour decision, Q-021, D-044); no guest cap at launch; admin monitors (Q-016, D-040) | Department, Sponsor | Auth build | PRODUCT/PROGRAMMES §4 |
| OI-039 | Staff authentication and MFA | **Decided in part (Q-004, D-029):** phone code for marshals; authenticator second factor for admins. Remaining: enrolment and device checks | Security | Staff onboarding | AUTH §2, D-029 |

## E. Operations, notifications, travel day

| ID | Issue (short) | Recommendation | Decision owner | Blocks | Affects |
|---|---|---|---|---|---|
| OI-019 | Bus cancellation and day-of exceptions | Add `bus_cancelled` and breakdown incident states; mass notify; rebook offer; refund request per booking; admin decides | Sponsor, Liaison | Incident build | STATE-MACHINES §8, §6 |
| OI-021 | Waitlist scope | **Decided (Q-007, D-030):** waitlist is in MVP. Marshal notified, admin adds a bus or finds a solution, guests then members offered seats by push and SMS. The earlier recommendation to remove waitlist wording is superseded | Sponsor | Waitlist build | PROGRAMMES §3, STATE-MACHINES §11 |
| OI-031 | SMS vendor and cost (channel decided) | **Channel decided (Q-003, D-028):** push and SMS at MVP for marshal alerts and sign-in codes. Choose vendor (Termii or Africa's Talking, verify) and price per message against pilot volume | Integrations, Sponsor | Notification build | NOTIFICATIONS §1, D-028 |
| OI-037 | WhatsApp deep links or Business API | Deep links only at MVP | Sponsor | Support build | NOTIFICATIONS §1 |
| OI-040 | Pilot scope and UAT | Sequential: one special event, then one Sunday; WhatsApp fallback throughout | Sponsor, Liaison | Pilot | ROADMAP §8 |

## F. Compliance and design

| ID | Issue (short) | Recommendation | Decision owner | Blocks | Affects |
|---|---|---|---|---|---|
| OI-034 | Two visual systems | **Closed (Q-008, Q-012; D-031, D-036):** one orange system for the apps; documents stay blue | Sponsor | None | FRONTEND, PROTOTYPES |
| OI-038 | Data protection, retention, DPIA | Engage counsel for a short review before pilot; minimum data; processor terms recorded; retention decided in part (Q-020, D-043) | Sponsor (with counsel) | Pilot | SECURITY §5, DATA-MODEL §4 |

## G. Governance and reporting

| ID | Issue (short) | Recommendation | Decision owner | Blocks | Affects |
|---|---|---|---|---|---|
| OI-010 | Mail service selection | Resolved (AgentMail). No action | n/a | n/a | D-015 |

---

## H. Recommended order of closure

1. OI-001 (reconvene) with OI-029, OI-003, OI-008, OI-016.
2. Sponsor batch: OI-030, OI-031, OI-034, OI-023, OI-036, OI-022, OI-028, OI-024.
3. Department batch: OI-019, OI-026, OI-040, OI-015, OI-021.
4. Counsel and security: OI-038, OI-039, OI-012, OI-013.
5. Integrations: OI-033, OI-025, OI-020.
6. DevOps: OI-032, OI-005, OI-014 (runbooks), OI-035.
