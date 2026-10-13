# DOCS: Index

**Status:** Live · **Date:** 2026-10-12 · **Owner:** Product Manager
**Start here:** `../HANDOFF.md` for the current state, then `NAVIGATION.md` for how to read the docs and logs. Decisions and open issues: `DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md`. The log wins on any conflict.

---

## Reading order for a new reviewer

1. `../AGENTS.md` (team operating system) and `CANONICAL-PROJECT-LIFECYCLE.yaml` (constitution)
2. `DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md`
3. `DECISION-LOGS/QA-LOG.md` (questions and answers)
4. `PRD_TCN_Ikorodu_Transport_App.md` and `PRODUCT/`
5. `ARCHITECTURE/`, then `DATA-MODEL/`, `STATE-MACHINES/`, `API-CONTRACTS/`
6. Domain folders: `AUTH/`, `PAYMENTS/`, `NOTIFICATIONS/`, `SUPPORT/`, `BACKEND/`, `FRONTEND/`
7. `DEVOPS/`, `SECURITY/`, `TESTING/`, `OPTIMISATION/`, `ROADMAP/`
8. `RECOMMENDATIONS/OPEN-ISSUE-RECOMMENDATIONS.md`

---

## Folder map

### Decisions and governance

| Folder | Purpose |
|---|---|
| `DECISION-LOGS/` | Canonical decision log, open-issue register, QA log, meeting minutes, decision brief deck |
| `GOVERNANCE/` | Principles, management system, sponsor diagrams |
| `CONVENTIONS/` | How every document is written, identified and versioned |
| `SIGN-OFF/` | Transport team sign-off form: the gate before development (interactive; exports one JSON file) |
| `VERSION-CONTROL/` | Git rules: branches, tags, commit messages, change control after the freeze |
| `ISSUE-MANAGEMENT/` | How decisions, issues, defects, incidents and reviews are run |
| `RECOMMENDATIONS/` | Recommendation for each open issue |
| `REGISTRY/` | Team registry (agent profiles and governance block) |

### Product and design

| Folder | Purpose |
|---|---|
| `PRODUCT/` | Scope tiers, journeys A to H, programmes, legs, guests |
| `PROTOTYPES/` | Walkthrough prototypes: what they show and what they do not |
| `FRONTEND/` | Route map, data access, PWA, accessibility |
| `NOTIFICATIONS/` | Channels, event catalogue, outbox, content rules |
| `SUPPORT/` | Member and marshal help, categories, targets |

### System design

| Folder | Purpose |
|---|---|
| `ARCHITECTURE/` | System context, containers, domains, ADRs |
| `DATA-MODEL/` | Entities, mutability, retention |
| `STATE-MACHINES/` | Every state, transition, actor and audit requirement |
| `API-CONTRACTS/` | Database functions, Edge Functions, webhooks, error codes |
| `BACKEND/` | Seat holds, expiry, outbox, reconciliation, migrations |
| `AUTH/` | Sign-in methods, membership gate, roles |
| `PAYMENTS/` | Provider-hosted payments, reconciliation, refunds, provider contracts |

### Delivery and operations

| Folder | Purpose |
|---|---|
| `DEVOPS/` | Environments, vendor terms and costs, pipeline, backups, variables |
| `SECURITY/` | Threat model, controls, data protection, pilot security acceptance |
| `TESTING/` | Test layers, PRD edge cases as tests, release gate, UAT |
| `OPTIMISATION/` | Performance budgets, cost controls, scale triggers |
| `ROADMAP/` | PRD to deployment, gates, pilot, launch, review; `IMPLEMENTATION-TASKS.md` lists every build, deployment, review, security and test task |
| `PRD/` | Candidate PRD with feature modules, requirements, BRD trace and open issues (`PRD-v1.0-CANDIDATE.md`); PRD v1.0 is created at the freeze |

### Method, evidence and history

| Folder | Purpose |
|---|---|
| `SKILLS/` | Engineering standards (ponytail anti-bloat, safety invariants, review protocol) |
| `SYSTEMS/` | UIOS engine specifications, adopted as vocabulary only (D-014) |
| `SYSTEMS-MAPPING.md` | How UIOS concepts map to this product |
| `MAIL/` | Local mirror of agent email threads |
| `ROOMS/` | Internal meeting-room tooling (not product) |
| `MANAGEMENT-SOURCE-OF-TRUTH.md` | Sponsor-facing management summary |

---

## Root documents

| File | What it is |
|---|---|
| `PRD_TCN_Ikorodu_Transport_App.md` | Product requirements draft (engineering framing from the BRD) |
| `INITIAL-PRODUCT-SPEC.html` | Church-facing initial product specification (print to PDF; blue system) |
| `MEETING-NOTES-03-Dev-Transport-Session.html` | Internal working notes from the dev team and transport department session |
| `RISK-ASSESSMENT.md` | Internal risk and loophole review (philosophy-mapped) |
| `AGENT-COMMUNICATIONS-WORKFLOW.md` | Mail protocol for the agent team |
| `VLTHRTEAM.md` | Reusable team operating method |
| `TEAM.md` | Project team roster |
| `SYSTEMS-MAPPING.md` | UIOS to product mapping |
| `CANONICAL-PROJECT-LIFECYCLE.yaml` | Constitution: phases, gates, invariants |
| `MANAGEMENT-SOURCE-OF-TRUTH.md` | Management summary for the sponsor |

---

### Placeholder folders (found 2026-10-12, not created by the documentation pass)

`AGENTS/`, `IP/`, `ISSUES/`, `MEMORY/`, `PRD/`, `PROGRESS-LOGS/`, `TASK-LOGS/` are empty and each has a README with a consolidation proposal. `REQUIRED-RESOURCES/` is populated with the start checklist. Removing any placeholder is a destructive step, so it waits for sponsor confirmation (Q-005).

---

## Maintenance

Add a folder entry here when a folder is created. Superseded documents keep their file, with status Superseded and a link to the replacement. See `CONVENTIONS/README.md`.
