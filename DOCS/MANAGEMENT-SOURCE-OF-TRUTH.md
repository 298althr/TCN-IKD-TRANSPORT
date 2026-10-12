# Management Source of Truth — TCN Ikorodu Transport App

**Prepared by:** Product Manager / Product Owner (`vlthrlab-pm@agentmail.to`)
**For:** Executive Product Sponsor
**Version:** 1.0 — 2026-10-07
**Nature:** This is the management-plane summary. It aggregates — never replaces — the canonical registers. If it ever disagrees with `PM-DECISION-LOG-AND-ROADMAP.md`, the log wins.

---

## 1. Governance model — registered

Your org chart and SDLC diagram are now formally registered as the project's governance model (`DOCS/REGISTRY/team-registry.yaml` → `governance:`). Reconciliation against our existing structure:

| Your chart | Our registry | Reconciliation |
|---|---|---|
| Product Owner / Business Analyst | `sponsor` | Executive product authority — budget, church policy, launch authorization, direction |
| Project Manager / Scrum Master | `product_manager` (+ `secretary` support) | Delivery hub: coordination, decision arbitration, gates. Ufuoma handles onboarding/coordination traffic |
| Developers → Frontend/Backend/Fullstack | `frontend`, `backend`, `database`, `integrations` | Database and Integrations slot into the developers lane; fullstack ≈ integrations eng |
| UI/UX Designers | `uiux` | Design lane — owns journeys + the canonical Notification/PWA design doc |
| QA Engineers → Manual/Auto | `qa` (Victoria, both initially) | Manual/exploratory + automated regression; single profile until volume justifies the split |
| DevOps Engineer (cross-lane) | `devops` | Cross-lane by design — spans all lanes on your chart |
| *(not on chart)* | `data_science`, `security`, `liaison`, `secretary` | Extensions discovered in Meeting 02 + live onboarding; registered under closest lane |

**SDLC registration:** your swimlane (Define → Prioritise → Wireframe/Prototype → Implement → Code Review → Test gate → Deploy & Monitor, fail-loops back to Implement) is registered as `governance.delivery_flow`. One overlay: our design-phase **Gate 0** (the three unresolved Phase-1 conflicts) sits upstream of the "Implement" lane — engineering cannot legitimately start until it clears.

---

## 2. Roster status — who exists now

| Agent | Mailbox | Status |
|---|---|---|
| Product Manager (me) | `vlthrlab-pm@agentmail.to` | **Live** — scoped key verified, isolation-tested |
| Secretary (Ufuoma) | `vlthr-secretary@agentmail.to` | **Live** — on your second org |
| Data Science | `vlthr-asset-generator@agentmail.to` | **Live** — introduced on WELCOME thread |
| QA (Victoria) | `victoria-3416@agentmail.to` | **Live** — introduced on WELCOME thread |
| Backend (Saviour) | `saviour-backend-engineer@agentmail.to` | **Live** — second org |
| Full Stack | `fullstack-guy@agentmail.to` | **Live** — second org |
| Database / Data Architect | `sayveeyhur@agentmail.to` | **Live** — second org |
| UI/UX Designer | `uiux-expert@agentmail.to` | **Live** — second org |
| Liaison (church transport dept.) | `vlthrlabs@gmail.com` | **Live** — human, real email |
| Integrations, Security, DevOps, Frontend | `pending` | Route via PM inbox until provisioned |

Free-tier ceiling: **3 inboxes per org** — both accounts are at/near capacity. Expansion path: more orgs (what you're already doing) or Developer plan $20/mo / +$2 per inbox.

## 3. What needs you right now

| # | Item | Type |
|---|---|---|
| 1 | **OI-001 reconvene** — the two Phase-1 respondents must re-meet on stack / seat-hold / duplicate-signup. All database + backend work is gated behind this. | Executive scheduling |
| 2 | **Mailbox expansion** — create remaining role inboxes on your second account and send me the address list; I'll update the registry and mint scoped keys where the org key permits | Provisioning |
| 3 | **Scoped keys** for `vlthr-asset-generator` and `victoria-3416` (same whitelist as PM's: messages/drafts/webhooks only, no admin) | I can mint these now — say the word |

## 4. Delivery state

- **Phase:** DESIGN — Phase A engineering blocked at Gate 0 (OI-001).
- **Unblocked work running now:** Paystack sandbox/merchant onboarding (D-006), security first-pass mutability list (OI-003), canonical Notification/PWA design doc (D-009), DevOps backup contingency (RISK-001), QA pre-build test plans.
- **Comms protocol:** live on AgentMail — envelope format, subject grammar `[TYPE][ENTITY-ID]`, thread-per-entity, no secrets in mail. Local mirror at `DOCS/MAIL/` (one doc per thread, per role folder).
- **Constitution:** `DOCS/CANONICAL-PROJECT-LIFECYCLE.yaml` | **Registry:** `DOCS/REGISTRY/team-registry.yaml` | **Live register:** `PM-DECISION-LOG-AND-ROADMAP.md`.

## 5. Current risk surface

- **RISK-001:** no DB backup strategy if self-hosted Postgres wins the stack vote under $0 budget — contingency planning in progress.
- **RISK-002:** rate-limit defaults could throttle legitimate bulk-booking hosts — mitigated by generous defaults, Phase-2 tuning.
- **Structural:** 3-inbox ceiling means the comms topology will hit its limit before the team does — expansion is a when, not an if.
