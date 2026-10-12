# Management System

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Decisions:** D-012, D-016, D-017, D-026 · **Open issues:** OI-013, OI-014, OI-015

---

## 1. Roles

| Role | Who (current) | Decides | Does not decide |
|---|---|---|---|
| Executive Product Sponsor | Project sponsor (you) | Budget, church policy, launch, material product direction, refund policy approval | Domain technical choices |
| Product Manager | PM agent | Scope tiers, sequencing, decision log upkeep, arbitration of scope conflicts, drift checks | Tie-breaks between respondents (D-012) |
| Respondents (Phase 1) | Backend and Database (and others as named) | Technical pair D-002 and D-003; policy pair D-007 with AUTH-2 | Each other's domain without reconvene |
| Domain owners | Frontend, Backend, Database, Integrations, Security, DevOps, QA, UI/UX, Data Science | Their domain's design within approved decisions | Scope, budget, policy |
| Transport Department Liaison | Church transport department | Operational truth, refund policy drafting, support ownership, marshal and bus rules | Technical design |
| Secretary | Coordination support | Onboarding and scheduling | Decisions |
| Admins (church) | Named church administrators (at least two, OI-014) | Day-to-day approvals within policy, corrections with reason | Policy changes |
| Marshals (church) | Named per bus | Boarding, no-show, walk-on within duty | Booking policy |

---

## 2. Decision rights (RACI for the main decisions)

R = Responsible (does the work) · A = Accountable (decides) · C = Consulted · I = Informed

| Decision area | Sponsor | PM | Respondents | Domain owner | Liaison | Security |
|---|---|---|---|---|---|---|
| Stack (D-002) | A | I | R | C | I | C |
| Seat hold (D-003) | I | C | A/R | C | I | C |
| Membership gate (D-007 / AUTH-2) | A | C | R | C | C | R |
| Payment provider (OI-025) | A | C | I | R (Integrations) | C | C |
| Refund policy (OI-036) | A | R (draft) | I | C | R (amend) | C |
| Special-event rules (OI-024) | A | C | I | C | R | I |
| Support ownership and SLA (OI-026) | A | C | I | C | R | I |
| Data protection (OI-038) | A | C | I | R | C | R |
| Hosting budget (OI-030) | A | C | I | R | I | C |
| Design system (OI-034) | A | C | I | R (UI/UX) | C | I |
| Scope tier changes | C | A/R | I | C | C | I |

---

## 3. Cadence

| Meeting or review | Who | When | Output |
|---|---|---|---|
| Open-issue review | PM, domain owners | Weekly during design and build | Owners, dates, escalations |
| Sponsor question round | PM, Sponsor | Four questions at a time, when enough context is ready | Answers in QA-LOG; decisions updated |
| Decision review | PM, Sponsor | Fortnightly | Accept, reopen or close decisions |
| Drift check | PM | Before each walkthrough and gate | Findings with owners |
| Walkthrough with transport department | PM, Liaison, dev team | At each design lock and before pilot | Findings as Q- or BUG- |
| Incident review | Admin on duty, PM | Within five working days of S1 or travel incident | Blameless review |
| Audit review | Two named admins; sponsor digest | Monthly after launch (OI-013) | Sign-off |

---

## 4. Reporting to the sponsor

- The management source of truth (`DOCS/MANAGEMENT-SOURCE-OF-TRUTH.md`) is updated at each phase gate.
- Each report says: what is decided, what is proposed, what is blocked (with the blocker), and what the sponsor must decide next.
- The decision log and QA log are the record; reports summarise them and never replace them.

---

## 5. Change control

- Scope change: decision entry, scope table update, roadmap update, notice to affected owners.
- Decision reopen: reopen format (AGENTS Part I §4), PM decides whether it is formally reopened, affected documents marked for review.
- Document change: header version and date updated; index updated if a file is added or superseded.
- Production change: pipeline only (DEVOPS §3).

---

## 6. Staffing and continuity

- At least two trained admins before pilot (OI-014). Each has a runbook and a named backup.
- A second person reviews every security-relevant change.
- Key vendor accounts (hosting, provider, email) have two named holders, recorded in the registry, with credentials in the password manager only.

---

## 7. Records kept

| Record | Location | Retention |
|---|---|---|
| Decisions and open issues | Decision log | Permanent |
| Question and answer trail | QA-LOG | Permanent |
| Release records | Release notes and CI links | Permanent |
| Incident reviews | ISSUE-MANAGEMENT | Permanent (no personal data) |
| Audit of operational changes | Database audit tables | Per OI-038 |
