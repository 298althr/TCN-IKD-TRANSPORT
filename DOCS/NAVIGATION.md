# Navigation Guide: Documents, Decisions and Logs

**Status:** Accepted · **Version:** 1.0 · **Date:** 2026-10-13 · **Owner:** Product Manager
**Governed by:** `CONVENTIONS/README.md` (identifiers, status headers, logging) · D-026
**Start with:** `../HANDOFF.md` for the current state and what to do next

---

## 1. The three rules

1. **The decision log wins.** `DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md` is the live record. If a narrative document disagrees with it, the document is wrong (`CONVENTIONS/README.md` §1).
2. **Every answer has a question.** The question and its options are in `DECISION-LOGS/QA-LOG.md` before the answer is recorded. The decision cites the question (`Q-###`).
3. **Nothing is silently changed.** An earlier decision is superseded, never edited. Its replacement is recorded in the supersession table (section 1.0 of the decision log).

---

## 2. Where to look for each question

| If you want to know… | Read |
|---|---|
| What is the state of the project right now? | `../HANDOFF.md` |
| What was decided, and why? | Decision log, section 1 (`D-###`) |
| What is still open, and who owns it? | Decision log, section 2 (`OI-###`) |
| Who asked which question, and what was answered? | `DECISION-LOGS/QA-LOG.md` (`Q-###`, batches 0 to 9) |
| Which features exist, and what is in scope? | `PRD/PRD-v1.0-CANDIDATE.md` (sections 3 and 5); `PRODUCT/SCOPE-AND-JOURNEYS.md` |
| Does a given BRD requirement have a design? | `PRD/PRD-v1.0-CANDIDATE.md` §13 (BRD trace) |
| How does a booking, payment, manifest or refund move between states? | `STATE-MACHINES/STATE-MACHINES.md` |
| What tables and fields exist? | `DATA-MODEL/ENTITIES.md` |
| What functions and endpoints will the app call? | `API-CONTRACTS/CONTRACTS.md` |
| How is the system built and why? | `ARCHITECTURE/SYSTEM-ARCHITECTURE.md` and `ARCHITECTURE/ADR/` |
| How do members, marshals, admins and guests sign in? | `AUTH/AUTH-DESIGN.md` |
| How are payments handled, and what must never be stored? | `PAYMENTS/PAYMENTS-DESIGN.md`; `PAYMENTS/PROVIDER-CONTRACTS.md` |
| What messages are sent, and when? | `NOTIFICATIONS/NOTIFICATIONS-DESIGN.md` |
| What is the support process? | `SUPPORT/SUPPORT-SYSTEM.md` |
| What do the screens look like? | `PROTOTYPE/` (open `index.html`); `FRONTEND/FRONTEND-DESIGN.md` for the route map |
| What must the department write before the pilot? | `GOVERNANCE/DEPARTMENT-POLICY-REGISTER.md` |
| What must be tested before public use? | `TESTING/ACCEPTANCE-CRITERIA.md`; `TESTING/TEST-STRATEGY.md`; `ROADMAP/IMPLEMENTATION-TASKS.md` §11 and §12 |
| What must be built, in what order, by whom? | `ROADMAP/IMPLEMENTATION-TASKS.md`; `ROADMAP/DEVELOPMENT-STRATEGY.md` |
| What are the risks? | `RISK-ASSESSMENT.md` (internal); decision log (`RISK-###` in consequences) |
| How do we deploy and back up? | `DEVOPS/DEVOPS-PLAN.md`; `DEVOPS/ENVIRONMENT-VARIABLES.md` (names only) |
| What are the security controls? | `SECURITY/THREAT-MODEL.md` |
| How do we work together and version the work? | `AGENTS.md`; `CANONICAL-PROJECT-LIFECYCLE.yaml`; `VERSION-CONTROL/VERSION-CONTROL.md` |
| What do the terms mean? | Section 5 of this guide |

---

## 3. The logs

| Log | What it holds | Identifier |
|---|---|---|
| Decision log | Each decision: status, owner, reason, evidence, alternatives, consequences, next action. Section 1.0 is the supersession table | `D-001` to `D-057` (`D-018` is an internal tool decision with a heading) |
| Open-issue register | Each unresolved matter: description, owner, options, recommendation, gate, status | `OI-001` to `OI-050` |
| Question log | Each multiple-choice question, its options, the recommended option, and the answer | `Q-001` to `Q-042`, in batches |
| Risk register | Philosophy-mapped and product risks | `L-#`, `R-##` (in `RISK-ASSESSMENT.md`); `RISK-###` (cited in the decision log) |
| Mail mirror | Agent and liaison messages, one file per thread | `DOCS/MAIL/` (see section 6) |
| Recommendations | The advice for each open issue, by area, with the decision owner | `RECOMMENDATIONS/OPEN-ISSUE-RECOMMENDATIONS.md` |
| Version history | Commits and tags | `git log`, `git tag` |

**Batches in the question log.**

| Batch | Questions | Topic |
|---|---|---|
| 0 | (earlier, recovered) | Questions from the first engineering round |
| 1 | Q-001 to Q-005 | Stack, hosting, alerts, sign-in, placeholder folders |
| 2 | Q-006 to Q-009 | Cash, overflow, design system, cutoff |
| 3 | Q-010 to Q-013 | Guest priority, offer window, document colour, manifest lock |
| 4 | Q-014 to Q-017 | Refund policy, pricing by leg, guest caps, late additions |
| 5 | Q-018 to Q-021 | Support owners, event approval, retention, registration turnaround |
| 6 | Q-022 to Q-026 | Sent by mail (liaison, secretary, backend, data science). Unanswered in the log |
| 7 | Q-027 to Q-035 | Sign-off pack. Waiting for the return |
| 8 | Q-036 to Q-039 | Gaps between the BRD and the design (answered) |
| 9 | Q-040 to Q-042 | Follow-up from batch 8 (answered) |

---

## 4. The identifiers

| Prefix | Meaning | Where it lives |
|---|---|---|
| `D-###` | Decision | Decision log |
| `OI-###` | Open issue | Decision log, section 2 |
| `Q-###` | Question put to the sponsor or a domain owner | `QA-LOG.md` |
| `RISK-###` | Risk | Decision log; `RISK-ASSESSMENT.md` |
| `R-##`, `L-#` | Product and philosophy risks | `RISK-ASSESSMENT.md` |
| `C-###`, `R-###` (requirement) | Constraint and requirement | Decision log (older entries) |
| `P-##` | Department policy | `GOVERNANCE/DEPARTMENT-POLICY-REGISTER.md` |
| `A-##` | Assumption to confirm | PRD candidate §14 |
| `FR-##` / `NFR-##` | Functional and non-functional requirement | `PRD/PRD-v1.0-CANDIDATE.md` |
| `MOD-##` | Feature module | PRD candidate §5 |
| `MEM-`, `GST-`, `MAR-`, `ADM-`, `SYS-` | Acceptance criterion (Given/When/Then) | `TESTING/ACCEPTANCE-CRITERIA.md` |
| `A01` to `I09` (letters and digits) | Scenario | `PRODUCT/SCENARIOS-AND-EDGE-CASES.md` |
| `T1` to `T24` | Threat | `SECURITY/THREAT-MODEL.md` |
| `ADR-####` | Architecture decision record | `ARCHITECTURE/ADR/` |
| `GOV-`, `ENG-`, `FE-F#-`, `BE-B#-`, `AU-`, `INT-`, `NOT-`, `DEP-`, `REV-`, `SEC-`, `TST-`, `PUB-`, `OPS-` | Implementation task | `ROADMAP/IMPLEMENTATION-TASKS.md` |
| `CR-###` | Change request after the freeze | `VERSION-CONTROL/VERSION-CONTROL.md` |

**IDs are never reused.** A retired ID stays in the log with its new status.

---

## 5. Status words

| Word | Used for | Meaning |
|---|---|---|
| Proposed | Documents, decisions | Ready for review; depends on an open decision |
| Accepted | Decisions, documents | Every cited decision is accepted |
| Superseded | Decisions, documents | Replaced by a later entry; kept for history |
| Frozen v1.0 | Documents after the freeze | Changes need a change request |
| Decided | Scenarios, requirements | A decision fixes the outcome |
| Designed | Scenarios, requirements | Follows from the state machines; no policy needed |
| Policy | Scenarios, requirements | The department must write the rule first |
| Gap | Requirements | The BRD or design misses it; an issue tracks it |
| Blocked | Requirements, decisions | A reconvene decision must come first |
| Verify | Facts about vendors or frameworks | Check against a live source before code depends on it |
| NEW | Tasks | An engineering standard proposed by the plan; the sponsor may reject it |

---

## 6. Working with the mail mirror

The mail mirror (`DOCS/MAIL/`) stores each agent and liaison thread as a Markdown file. The tool is local and sends nothing.

```bash
# Start a new thread
node DOCS/MAIL/scripts/mail.mjs new --from PM --to LIAISON --type Q --entity POLICY-REGISTER --summary "Short summary" --body FILE.md

# Append a reply to an existing thread
node DOCS/MAIL/scripts/mail.mjs append --file DOCS/MAIL/PM/THREAD-xxxx.md --from PM --to LIAISON --type C --entity ENTITY --summary "Short summary" --body FILE.md

# Rebuild the index
node DOCS/MAIL/scripts/mail.mjs index
```

Rules (`AGENT-COMMUNICATIONS-WORKFLOW.md`):

- One thread per entity. Subject grammar `[TYPE][ENTITY]`.
- Each message carries a YAML envelope with IDs, but never a secret.
- Questions to the sponsor are also logged in `QA-LOG.md` before they are asked.
- Nothing is sent outside the team without the sponsor's approval. The mirror is a record, not the sending channel.

`DOCS/MAIL/INDEX.md` lists every thread.

---

## 7. How to log something new

**A new question for the sponsor.**

1. Add a `Q-###` entry in `QA-LOG.md`, in a new batch, with options, consequences and the recommended option.
2. Only then ask it.
3. When the answer arrives, add it to the batch table, then add or update a `D-###` entry that cites the `Q-###`.

**A new decision.** Use the decision record format in `DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md`: ID, decision, status, owner, reason, evidence, alternatives, consequences, affected systems, next action. Add it to the log before the document changes.

**A new open issue.** Use the open-issue format: ID, description, why it matters, domain, owner, agents, options, recommended resolution, decision owner, gate, status. Every issue has an owner and a gate.

**A change to a decision.** Do not edit the old entry. Add a new one, add a row to the supersession table (section 1.0), and update the documents that cite it.

**A change to a frozen document after the freeze.** Open a change request (`CR-###`) on a `change/CR-###` branch, following `VERSION-CONTROL/VERSION-CONTROL.md`.

---

## 8. Checking for drift

Drift means a document says something the log does not support. Check these before each stage exit and before the freeze.

1. **Every ID exists.** Search the documents for each `D-`, `OI-`, `Q-` and `P-` ID. Each must exist in its log.
   ```bash
   git grep -n "D-0[0-9][0-9]" -- DOCS | head
   ```
2. **Every question has an answer, or is marked open.** Check each batch in `QA-LOG.md`.
3. **No duplicate IDs.** Look for the same `D-` or `OI-` heading twice in the decision log.
4. **Counts agree.** The acceptance criteria total (116 in `ACCEPTANCE-CRITERIA.md`) must match the PRD (§9), the task plan (TST-11, PUB-02) and the decision that set it (D-047, D-051).
5. **No em dashes in new text.** Search for the em dash character in the files changed since the last freeze. Older files still contain some.
6. **Every folder has a README.** Each folder under `DOCS/` contains a `README.md` (`CONVENTIONS/README.md` §7).
7. **Frozen files carry the freeze line.** After the freeze, each frozen file says `Frozen v1.0`.

Known check that is not yet in the repository: a script that reads the logs and checks the IDs above. Ask for it to be added (section F of `HANDOFF.md`).

---

## 9. Version control

- **Branches.** `main` holds the agreed state. Use `docs/<topic>` for documents, `frontend/F0` to `F5` and `backend/B0` to `B5` for build stages, `change/CR-###` for frozen-document changes, and `fix/<topic>` for defects. See `VERSION-CONTROL/VERSION-CONTROL.md` §2.
- **Tags.** `docs-baseline-2026-10-12` is the state before the sign-off. `docs-v1.0` is the freeze and is not yet created. Later tags are listed in `VERSION-CONTROL/VERSION-CONTROL.md` §3.
- **Useful commands.**
  ```bash
  git log --oneline                 # history
  git tag                           # tags
  git show docs-baseline-2026-10-12 --stat   # what the baseline contained
  git log -S "D-051" --oneline      # every commit that touched a decision ID
  ```
- **Never commit** `.env` files, keys, returned sign-off forms (`DOCS/SIGN-OFF/returns/`), member data or backups (`.gitignore`).

---

## 10. Reading order for a new person

| Role | Read first | Then |
|---|---|---|
| Sponsor | `HANDOFF.md` §A and §G; `PRD/PRD-v1.0-CANDIDATE.md` §0, §6, §12, §13 | Decision log section 1.0; QA-LOG batches 7 to 9 |
| Product manager | `AGENTS.md`; this guide | Decision log in full; QA-LOG; the candidate PRD |
| Frontend lead | `HANDOFF.md`; `FRONTEND/FRONTEND-DESIGN.md`; `PROTOTYPE/` | `API-CONTRACTS/CONTRACTS.md`; `STATE-MACHINES/`; `ROADMAP/IMPLEMENTATION-TASKS.md` §4 |
| Backend lead | `HANDOFF.md`; `ARCHITECTURE/` and the ADRs | `DATA-MODEL/`; `STATE-MACHINES/`; `API-CONTRACTS/`; `PAYMENTS/`; task plan §5 to §7 |
| Security lead | `SECURITY/THREAT-MODEL.md`; `AUTH/AUTH-DESIGN.md` | Task plan §10; `DATA-MODEL/ENTITIES.md` §3 and §4 |
| QA lead | `TESTING/ACCEPTANCE-CRITERIA.md`; `TESTING/TEST-STRATEGY.md` | `PRODUCT/SCENARIOS-AND-EDGE-CASES.md`; task plan §11 |
| DevOps lead | `DEVOPS/DEVOPS-PLAN.md`; `DEVOPS/ENVIRONMENT-VARIABLES.md` | Task plan §8 and §12 |
| Transport liaison | `PRODUCT/SCOPE-AND-JOURNEYS.md`; `GOVERNANCE/DEPARTMENT-POLICY-REGISTER.md` | `PROTOTYPE/`; the sign-off pack |

---

## 11. Folder map

| Folder | What it holds |
|---|---|
| `AGENTS/`, `IP/`, `ISSUES/`, `MEMORY/`, `PROGRESS-LOGS/`, `TASK-LOGS/` | Placeholders with a README. Their use is open (Q-005). Not removed |
| `API-CONTRACTS/` | Database functions, webhook and job endpoints, realtime channels |
| `ARCHITECTURE/` | System architecture; `ADR/` holds the decision records behind it |
| `AUTH/` | Sign-in, membership gate, roles and sessions |
| `BACKEND/` | Layout, seat-hold function draft, expiry, outbox, reconciliation |
| `CONVENTIONS/` | How documents, identifiers, status and logging work |
| `DATA-MODEL/` | Entities, mutability, retention, read views |
| `DECISION-LOGS/` | Decision log, question log, meeting minutes and the older questionnaire |
| `DEVOPS/` | Environments, vendor terms, pipeline, backups, runbooks, variable names |
| `FRONTEND/` | Stack, route map, data access, states, offline behaviour |
| `GOVERNANCE/` | Principles, management system, policy register |
| `ISSUE-MANAGEMENT/` | Issue severities, incident review |
| `MAIL/` | Mail mirror and index; `scripts/` holds the tool |
| `NOTIFICATIONS/` | Channels, event catalogue, outbox behaviour, templates |
| `OPTIMISATION/` | Performance budgets, cost controls, scale triggers |
| `PAYMENTS/` | Payment design, provider contracts, sandbox checklist |
| `PRD/` | Candidate PRD (`PRD-v1.0-CANDIDATE.md`); PRD v1.0 is created at the freeze |
| `PRODUCT/` | Scope and journeys, programmes and legs, the scenario table |
| `PROTOTYPES/` | What the three prototypes prove and do not prove |
| `RECOMMENDATIONS/` | Advice for each open issue |
| `REGISTRY/` | Team registry (roles and profiles) |
| `REQUIRED-RESOURCES/` | Start checklist: decisions, accounts, people, inputs, legal, equipment |
| `ROADMAP/` | Implementation plan, development strategy, task plan |
| `ROOMS/` | Internal meeting-room tooling (not product) |
| `SECURITY/` | Threat model and pilot security acceptance |
| `SIGN-OFF/` | Interactive sign-off form. Returned forms go in `returns/` (not in git) |
| `SKILLS/` | Engineering standards and the review protocol |
| `STATE-MACHINES/` | Every state and legal transition |
| `SUPPORT/` | Support channels, categories, response targets, escalation |
| `SYSTEMS/` | Engine specifications adopted as vocabulary only (D-014) |
| `TESTING/` | Acceptance criteria, test strategy, UAT |
| `VERSION-CONTROL/` | Branches, tags, commit messages, freeze procedure |

At the top level of `DOCS/`: `README.md` (index), `NAVIGATION.md` (this guide), `CANONICAL-PROJECT-LIFECYCLE.yaml` (the constitution), `AGENTS.md` at the repository root (operating rules), `RISK-ASSESSMENT.md`, `SYSTEMS-MAPPING.md`, `VLTHRTEAM.md`, `TEAM.md`, `MANAGEMENT-SOURCE-OF-TRUTH.md`, `AGENT-COMMUNICATIONS-WORKFLOW.md`, `INITIAL-PRODUCT-SPEC.html` (church-facing, blue), `MEETING-NOTES-03-Dev-Transport-Session.html`, and `PRD_TCN_Ikorodu_Transport_App.md` (the old draft, superseded at the freeze).

At the repository root: `PROTOTYPE/` (member, marshal, administrator and an index), `AGENTS.md`, `HANDOFF.md`, `.gitignore`, `.gitattributes`, and two PDF specifications from earlier work.

---

## 12. Common tasks

| Task | How |
|---|---|
| Find every mention of a decision | `git grep -n "D-051" -- DOCS` |
| See why a rule exists | Find its decision, then follow its **Evidence** line to the `Q-###` in `QA-LOG.md` |
| See what a question was asked | Find the `Q-###` in `QA-LOG.md`; its batch table shows the options and the answer |
| See the state of an issue | Find the `OI-###` in the decision log, section 2; its **Status** line is current |
| See whether a requirement is built | `PRD/PRD-v1.0-CANDIDATE.md` §13 (BRD trace) and §5 (its FR row) |
| See what a task needs | `ROADMAP/IMPLEMENTATION-TASKS.md`; search for the task ID |
| Read the decisions in order | Decision log section 1, from top to bottom |
| Read the answers in order | `QA-LOG.md`, from batch 0 to the last batch |
| Start a document change | Create `docs/<topic>`; log the decision first (section 7) |
