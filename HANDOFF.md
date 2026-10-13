# Handoff: TCN Ikorodu Transport Booking and Management App

**Status:** Proposed handoff · **Version:** 1.0 · **Date:** 2026-10-13 · **Owner:** Product Manager
**Decisions:** D-024, D-027 to D-057 (D-045 and D-046 govern the start of development) · **Open issues:** see section F
**Format:** the project handoff packet (`AGENTS.md` Part I §14), with a context capsule at the end.
**Navigation:** `DOCS/NAVIGATION.md` explains how to find things in the docs and logs.

> **Keep this repository private.** It holds internal risk notes, the team mail mirror with real mailbox addresses, and the agent roster. It must never hold member data, keys, or returned sign-off forms (`.gitignore` and `DOCS/VERSION-CONTROL/VERSION-CONTROL.md` §1).

---

## A. Executive summary

The repository holds the documentation, prototypes and decision record for the transport app. It holds **no application code yet**: no database schema, no functions, no frontend project, no CI.

Development is gated. The sponsor's rule (D-045) is that development begins only when two things are both done:

1. The transport team signs the sign-off pack. It has not been returned.
2. The technical reconvene ratifies the stack (D-024), the seat-hold method (D-003) and the membership-matching rule (D-007 with AUTH-2, D-002 included). The reconvene has not been scheduled (OI-001).

Until both are done, do not commit schema, API or application code to `main` (D-024: "no schema migration or API code is committed"). Frontend stage F0 also waits for the framework to be ratified (D-046).

What is ready now:

- Product scope, journeys, scenarios (125 rows), and a candidate PRD with a line-by-line BRD trace.
- A full implementation task plan (360 tasks) from governance through public use.
- Data model, state machines and API contracts, drafted and linked to decisions.
- Acceptance criteria: 116 Given/When/Then criteria (110 before the pilot).
- A prototype (three role apps in plain HTML) for walkthroughs.
- The decision log, the question log, the open-issue register and the risk register, all cross-referenced.

---

## B. Decisions made since the baseline

The baseline is tag `docs-baseline-2026-10-12`. Every decision below is recorded in `DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md`, with its question in `DECISION-LOGS/QA-LOG.md`.

| Area | Decision | Source |
|---|---|---|
| Payments | Digital only (Paystack and/or OPay). No cash, no POS, no manual records | D-033 |
| Waiting list | In MVP; first-timer guests first; two-hour offer window | D-030, D-034, D-035 |
| Manifest | Locks 30 minutes before departure; late additions need admin approval | D-037, D-041 |
| Free bookings | Wait for the marshal's reached call and the member's confirmation (BRD rule restored) | D-051 |
| Free-booking hold | Ends 18:00 Lagos time the day before departure; later bookings hold until the lock | D-055 |
| Sign-in | Phone code; password next to it; magic link and Google later; admin authenticator | D-029, D-052, D-056 |
| Gender | Required; male or female only; no decline option | D-052, D-057 |
| Marshal alerts | App names the rider; SMS shows bus and count; three alerts added | D-053 |
| Public use | Pilot group first; all members after the 30-day review | D-054 |
| Hosting | Vercel Pro with Supabase Free, with recorded risks | D-027 |
| Build order | Frontend first on frozen contracts, then backend | D-046 |
| Acceptance | 116 criteria are the release test (110 before the pilot) | D-047, D-051 |
| Sign-off | Interactive form; print layout retired | D-048 |
| Version control | Git; tag `docs-baseline-2026-10-12`; freeze will be tag `docs-v1.0` | D-049 |
| Plan | Candidate PRD and task plan adopted as working baselines | D-050 |

---

## C. Deliverables in this repository

| Deliverable | Where |
|---|---|
| Candidate PRD (23 modules, 170 requirements, BRD trace) | `DOCS/PRD/PRD-v1.0-CANDIDATE.md` |
| Implementation task plan (360 tasks, gates, public-use gate) | `DOCS/ROADMAP/IMPLEMENTATION-TASKS.md` |
| Roadmap and development strategy | `DOCS/ROADMAP/` |
| Scope, journeys, programmes, legs, guests | `DOCS/PRODUCT/` |
| Scenario and edge-case table (125 rows) | `DOCS/PRODUCT/SCENARIOS-AND-EDGE-CASES.md` |
| State machines (booking, payment, refund, manifest, programme, support, incident, registration, waiting list, corrections) | `DOCS/STATE-MACHINES/STATE-MACHINES.md` |
| Data model (tables, mutability, retention) | `DOCS/DATA-MODEL/ENTITIES.md` |
| API contracts (functions, webhooks, realtime) | `DOCS/API-CONTRACTS/CONTRACTS.md` |
| Architecture and ADRs | `DOCS/ARCHITECTURE/` |
| Backend, frontend, auth, payments, notifications, support | `DOCS/BACKEND/`, `DOCS/FRONTEND/`, `DOCS/AUTH/`, `DOCS/PAYMENTS/`, `DOCS/NOTIFICATIONS/`, `DOCS/SUPPORT/` |
| DevOps, security, testing, optimisation | `DOCS/DEVOPS/`, `DOCS/SECURITY/`, `DOCS/TESTING/`, `DOCS/OPTIMISATION/` |
| Acceptance criteria (116) | `DOCS/TESTING/ACCEPTANCE-CRITERIA.md` |
| Department policy register (29 policies) | `DOCS/GOVERNANCE/DEPARTMENT-POLICY-REGISTER.md` |
| Sign-off form (interactive, not sent) | `DOCS/SIGN-OFF/TRANSPORT-SIGN-OFF-PACK.html` |
| Prototypes (member, marshal, administrator) | `PROTOTYPE/` |
| Mail mirror and mail tool | `DOCS/MAIL/` |

---

## D. Dependencies and what you need on the other machine

**Repository.** Clone the repository. The working folder becomes `TCN-IKD-TRANSPORT`, not `TRANSPORT-MANAGEMENT-SYSTEM`.

**Tools.**

- Git (the project was built with git 2.51).
- GitHub CLI (`gh`), logged in to the account that owns the repository.
- Node.js LTS. The mail tool (`DOCS/MAIL/scripts/mail.mjs`) runs on Node with no packages.
- Docker and the Supabase CLI are needed only from stage B0 (local database stack). Not needed yet.

**Credentials.** None are in the repository. Vendor keys (AgentMail, and later Paystack, OPay, SMS, email, push) live in the team password manager and in hosting secret stores. Ask the sponsor for access. Do not paste keys into documents, mail or commits.

**Source document outside the repository.** The original Business Requirements Document, `BRD for TCN Ikorodu Transport App.md`, sits one folder above the repository (in `TRANSPORT-TEAM/`) and was not pushed. The candidate PRD traces to it. Copy it onto the other machine from the original location, or see section E.

---

## E. Setup on the other machine

Run these in PowerShell or Git Bash. Replace the placeholders.

```bash
# 1. Sign in to GitHub (once per machine)
gh auth login

# 2. Clone the repository
gh repo clone 298althr/TCN-IKD-TRANSPORT
cd TCN-IKD-TRANSPORT

# 3. Set your commit identity for this repository only (do not use --global unless you mean it)
git config --local user.name "Your Name"
git config --local user.email "you@example.com"

# 4. Check the baseline is present
git log --oneline -n 3
git tag
```

Expected: the latest commit is the handoff commit, and the tag `docs-baseline-2026-10-12` is present. The tag `docs-v1.0` does not exist yet; it is created only at the freeze.

**Line endings.** `.gitattributes` normalises line endings. If git warns about CRLF on Windows, the warning is expected and harmless.

**Opening the prototypes.** Open `PROTOTYPE/index.html` in a browser. The prototypes keep their state in memory. If a page opens blank, serve the `PROTOTYPE/` folder with any static file server; the earlier previews used one.

---

## F. Open items the next owner must know

Status is taken from the decision log and the candidate PRD §12. Confirm the current status in the register before acting.

**Gate items (blocking development).**

| ID | Item | Owner |
|---|---|---|
| OI-001 | Technical reconvene: stack (D-024), seat hold (D-003), duplicate and membership rule (D-007 with AUTH-2) | Original respondents (D-012). Not scheduled |
| GOV-01 | Sign-off pack returned by the transport team. Not sent yet | Product manager sends; sponsor approves |
| D-045 | Freeze the documents at version 1.0 (tag `docs-v1.0`) and create PRD v1.0 | Product manager; sponsor approves |

**Open issues that still need an owner or a decision.**

| ID | Item | Owner |
|---|---|---|
| OI-043 | Programme end time, venue, description, transport flag; pickup time per pickup point per leg (fields missing from the data model) | Product manager; database lead |
| OI-045 | Screens missing from the route map (member notifications and profile; marshal incident and walk-on; admin reports and settings) | Product manager; frontend lead |
| OI-046 | Conflict rule for offline marshal taps | Backend lead; transport department |
| OI-047 | Backup destination and encryption, error tracking, uptime monitor, email and SMS vendors, key custody | DevOps lead |
| OI-048 | Report and finance formulas and export format | Data science; church finance contact |
| OI-004 | Browse-only before install | UI/UX designer; product manager |
| OI-005, OI-020, OI-025, OI-033 | Backups, payment reconciliation, provider choice (Paystack or OPay), provider sandbox checks | DevOps; integrations specialist |
| OI-031 | SMS vendor and cost | Integrations specialist; sponsor |
| OI-036 | Refund policy (the transport department drafts it from scratch, D-038) | Transport department; sponsor |
| OI-038 | Data protection review, privacy notice, processor terms (blocks the pilot) | Sponsor with counsel |
| OI-040 | Pilot programme and team (Q-027 is in the sign-off pack) | Product manager; sponsor |
| OI-015, OI-017, OI-019 | Membership register steward; hold-abuse limit; day-of exception flows | Transport department; backend lead |

**Questions logged but not answered in the log.**

- Q-005: what to do with seven empty placeholder folders in `DOCS/` (not removed; deletion needs sponsor confirmation).
- Q-022 to Q-026: sent to the liaison, the secretary, backend and data science by mail. The log has no recorded answers.
- Q-027 to Q-035: in the sign-off pack. Waiting for the return.
- Q-041 and Q-042 are answered (D-056, D-057). Q-036 to Q-040 are answered (D-051, D-055).

**Known gaps in the repository itself.**

- The prototypes predate some decisions. Chips still need the three-axis booking, payment and rider split (D-025). The waiting-list copy, the free-booking wording (D-051), and the password sign-in (D-056) need updating. This is a prototype task, not a document task.
- The ID-consistency checker used during this work lives in the temporary folder, not in the repository. Section G of `DOCS/NAVIGATION.md` gives the manual checks. Ask to have the script added as `DOCS/VERSION-CONTROL/check-ids.mjs`.
- The repository is in a personal GitHub account. D-049 says the host must be owned by the church. Transfer it when the church account exists (`gh repo transfer`).

---

## G. Downstream instructions

**For the sponsor.**

1. Read `DOCS/PRD/PRD-v1.0-CANDIDATE.md` (sections 0, 6, 12 and 13).
2. Confirm assumptions A-01 to A-10 (PRD §14), and the 18:00 rule (D-055), which was the product manager's recommendation.
3. Send the sign-off pack (`DOCS/SIGN-OFF/TRANSPORT-SIGN-OFF-PACK.html`) by your chosen route. Nothing has been sent.
4. Schedule the technical reconvene (OI-001) and the policy session (D-007 with AUTH-2).

**For the next developer, in order.**

1. Read `AGENTS.md`, then `DOCS/NAVIGATION.md`, then the decision log.
2. Do not commit schema, API or application code to `main` until D-045 and the reconvene are done.
3. Work allowed now: documentation changes on a `docs/<topic>` branch, logged first in the decision log (`DOCS/CONVENTIONS/README.md` §5 and §8); prototype fixes; repository setup that needs no framework choice (see the task plan §3, ENG-01 and ENG-12).
4. When the reconvene ratifies the framework, start frontend stage F0 on branch `frontend/F0` (task plan §4, FE-F0-01 to FE-F0-09).
5. Backend stage B0 starts after the schema gate (task plan G3) and goes on branch `backend/B0`.
6. Every change follows the rules in `DOCS/VERSION-CONTROL/VERSION-CONTROL.md`: a second reviewer, a decision entry for any deviation from the frozen set, and a green check before merge.

**For the QA lead.** The acceptance criteria in `DOCS/TESTING/ACCEPTANCE-CRITERIA.md` are the release test. Map each criterion to an automated test (TST-11). Run each P criterion on the stand-in data first, then on the real backend.

---

## H. Context capsule

```text
PRODUCT:
TCN Ikorodu Transport Booking & Management App

MY ROLE:
Handoff packet author (Product Manager)

MY DOMAIN:
Repository state, navigation, gates, open items

DECISIONS LOCKED (in force):
D-025, D-027 to D-049, D-051 to D-057
PROPOSED: D-024 (stack, pending ratification), D-050 (candidate PRD and task plan)

NEW REQUIREMENTS (classified):
Free booking waits for marshal call (D-051). Free hold ends 18:00 day before (D-055).
Gender required (D-057). Password next to phone code (D-056). Magic link and Google later (D-052).
Marshal alert content and three added alerts (D-053). Pilot first, then public use (D-054).

CONSTRAINTS:
Single congregation, no multi-tenant. PWA only. Digital payment only.
No schema or API code before D-045 and the reconvene. Frontend first (D-046).

RISKS:
RISK-001, RISK-009 to RISK-014 (see PRD §11)

DEPENDENCIES:
OI-001 (reconvene) gates development. OI-038 gates the pilot. OI-043 and OI-045 gate the schema and the route shell.

CHANGES REQUIRED:
Prototype alignment (D-025, D-051, D-056). Route map (OI-045). Data model (OI-043). Move repository to church ownership.

DELIVERABLE:
This repository, pushed to GitHub as TCN-IKD-TRANSPORT (private), tag docs-baseline-2026-10-12 at the baseline.

DOWNSTREAM AGENT:
Executive Product Sponsor; QA lead; next developer (frontend and backend)

DOWNSTREAM ACTION:
Send the sign-off pack; schedule the reconvene; answer Q-005 and Q-022 to Q-026; then freeze.

OPEN ISSUES:
OI-001, OI-004, OI-005, OI-015, OI-017, OI-019, OI-020, OI-025, OI-031, OI-032, OI-033,
OI-036, OI-038, OI-040, OI-043, OI-045 to OI-048

STATUS:
READY WITH CONDITIONS (documentation complete for review; development blocked by D-045 and OI-001)
```
