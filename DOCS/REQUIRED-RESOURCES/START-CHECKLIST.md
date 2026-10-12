# Start Checklist: What We Need to Begin

**Status:** Live · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Gate:** Stage 2 (foundation) starts only when section A is complete. Sections B to F run in parallel with design.

Status key: `Open` (not started), `In progress`, `Done`, `Blocked` (name the blocker).

---

## A. Decisions that gate engineering (must be Done)

| # | Item | Owner | Source | Status |
|---|---|---|---|---|
| A1 | Reconvene: decide D-002 (stack) and D-003 (seat hold) | Original respondents | OI-001, D-012 | Open |
| A2 | Reconvene: decide D-007 with AUTH-2 (membership gate) | Original respondents with Security | OI-001, D-007 | Open |
| A3 | Ratify or reject D-024 (Supabase and TypeScript direction). Route set by Q-001: ratify at the reconvene | Respondents at A1 | D-024, Q-001 | Open |
| A4 | Choose production hosting tier | Sponsor | OI-030, Q-002 | Done: Vercel Pro + Supabase Free (D-027). Revisit at pilot gate |
| A5 | Choose staff and member sign-in methods | Sponsor | Q-004, OI-039 | Done: phone code, authenticator for admins, Google at deployment (D-029) |
| A6 | Choose the marshal critical-alert channel for MVP | Sponsor | OI-031, Q-003 | Done: push and SMS at MVP (D-028). Vendor open (OI-031) |
| A7 | Choose design system for production | Sponsor | OI-034, Q-008, Q-012 | Done: one orange system for the apps (D-031); documents stay blue (D-036) |
| A8 | Payment model | Sponsor | OI-023, Q-006 | Done: fully digital through Paystack and/or OPay; no cash, no POS (D-033) |

---

## B. Accounts and subscriptions (owner-held, two named holders each)

| # | Item | Notes | Status |
|---|---|---|---|
| B1 | Vercel team on Pro, with the church as owner | Needed for commercial use (OI-030) | Open |
| B2 | Supabase organisation on Free for production (D-027) | Pausing and backup risks accepted: RISK-009, RISK-010. Revisit at pilot gate | Done (Q-002) |
| B3 | Paystack merchant account and sandbox keys | D-006 onboarding already assigned | In progress (per D-006) |
| B4 | OPay merchant account and sandbox access | Needed only if OI-025 selects OPay | Open |
| B5 | Domain for the app, registered to the church | Registrar account owned by the church | Open |
| B6 | Transactional email provider account and verified sender domain (SPF, DKIM, DMARC) | Vendor to choose | Open |
| B7 | SMS vendor account (sign-in codes and marshal alerts) | MVP per D-028; vendor choice in OI-031 | Open |
| B8 | Source repository with branch protection and CI minutes | Free tier options to verify | Open |
| B9 | Shared password manager vault for vendor credentials | Credentials never in documents or chat | Open |
| B10 | Web Push keys (VAPID) generated and stored as secrets | Per environment | Open |
| B11 | Error tracking and uptime monitoring accounts (free tier) | Verify tiers | Open |
| B12 | Google sign-in client | Integrate at deployment (D-029) | Deferred |

---

## C. People and roles

| # | Role | Needed for | Status |
|---|---|---|---|
| C1 | Backend and Database lead (respondents, A1 and A2) | Stages 1 to 2 | Open |
| C2 | Frontend engineer | Stages 2 to 4 | Open |
| C3 | Integrations specialist (payments and notifications) | Stage 3 | Open |
| C4 | Security and compliance lead | Stages 1, 2, 5 | Open |
| C5 | DevOps and infrastructure engineer | Stage 2 onward | Open |
| C6 | QA and test engineer | Stage 2 onward | Open |
| C7 | UI/UX designer (install flow, notification design, design system) | Stage 1 onward | Open |
| C8 | Transport department liaison (rules, refund drafting, support owners) | Gate 0 onward | Open |
| C9 | At least two church administrators, trained, with MFA (OI-014) | Pilot | Open |
| C10 | Named marshal for each bus and each special event | Pilot | Open |
| C11 | Sponsor time for question rounds (four per round) | Gate 0 onward | Open |

---

## D. Church data and operational inputs

| # | Input | Owner | Status |
|---|---|---|---|
| D1 | Membership register export (CSV) and its named steward | Church (OI-015) | Open |
| D2 | Bus list: labels, seat capacities, plates (optional), active status | Transport department | Open |
| D3 | Routes and pickup points with sequence | Transport department | Open |
| D4 | Marshal list with phone numbers | Transport department | Open |
| D5 | Programme calendar (recurring and known special events) | Church | Open |
| D6 | Draft refund policy (OI-036): department drafts from scratch; PM supplies the decision list (Q-014, D-038) | Transport department | Open. Draft date to set |
| D7 | Support owners decided (Q-018, D-042); response targets as proposed | Transport department to confirm targets | Open |
| D8 | WhatsApp numbers and phone numbers for transport office and admin | Transport department | Open |
| D9 | Member-facing privacy notice text (OI-038) | Counsel with Security | Open |
| D10 | Cancellation cutoff: 12 hours before departure by default, admin override per programme (D-032) | Sponsor | Done (Q-009). Department confirms the number |
| D11 | Manifest lock: 30 minutes before departure (Q-013, D-037) | Transport department confirms the walk-on approval route for the lock | Done (Q-013) |
| D12 | Guest caps: none at launch; admin monitors (Q-016, D-040) | Transport department | Done |
| D13 | Finance period for keeping payment records (Q-020, D-043) | Church finance office | Open |
| D14 | Named finance contact for payment problems (Q-018, D-042) | Church | Open |
| D15 | Named second admin for special-event approval and a 24-hour registration rota (Q-019, Q-021) | Church | Open |

---

## E. Legal and compliance

| # | Item | Owner | Status |
|---|---|---|---|
| E1 | Short data protection review under the Nigeria Data Protection Act 2023 | Sponsor with counsel (OI-038) | Open |
| E2 | Acceptance of processor terms for Vercel, Supabase, providers, email and SMS vendors | Sponsor | Open |
| E3 | Confirmation of the reduced PCI scope for provider-hosted checkout | Security with a qualified reviewer | Open |
| E4 | Record of the church's retention rules for payment and attendance records | Sponsor and finance | Open |

---

## F. Equipment and environments

| # | Item | Notes | Status |
|---|---|---|---|
| F1 | Developer machines with Node LTS, Docker, Supabase CLI, Git | Local stack for pgTAP and Playwright | Open |
| F2 | Test phones: one iPhone on iOS 16.4 or later, one mid-range Android | Install and push testing; cannot be simulated | Open |
| F3 | Network throttling profile (mid-range Android, 4G and 3G-class) | Performance budgets | Open |
| F4 | Lagos test connections for latency measurement | OI-032 | Open |
| F5 | Printer and paper for the offline manifest test | R-007 fallback | Open |

---

## G. What is already in place

- Decision log, open-issue register and QA log (`DECISION-LOGS/`).
- Documentation standard (`CONVENTIONS/`) and folder READMEs.
- Product scope, journeys, state machines, data model and contracts (drafts, pending ratification).
- Prototypes for walkthrough (`PROTOTYPE/`).
- Mail channel for the agent team (AgentMail, three inboxes).
- Provider-hosted payment direction (D-023) and provider research for Paystack and OPay (PAYMENTS, checked 2026-10-12).

---

## H. Blockers today

1. A1 and A2 (reconvene not yet scheduled).
2. A1 and A2 are the only engineering gates left in section A besides A3 ratification.
3. Accounts B1 and B2 are to be created on the decided plans (Vercel Pro, Supabase Free).
