# Documentation Conventions

**Status:** v1.0, Accepted (D-026) · **Date:** 2026-10-12 · **Owner:** Product Manager

This file defines how every document under `DOCS/` is written, identified, versioned and linked. It exists so that a reviewer can trace any claim in the product back to a decision, an open issue, or a source document, and so that drift between documents is visible.

## 1. Authority order

When documents disagree, the higher item wins. Fix the lower item, do not argue with it.

1. `DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md`: decisions (D-), open issues (OI-), scope tiers. **Canonical.**
2. `DECISION-LOGS/QA-LOG.md`: the question and answer trail that produced decisions. Answers recorded here are the evidence for a decision.
3. `CANONICAL-PROJECT-LIFECYCLE.yaml`: the team constitution (phases, gates, invariants).
4. `PRD_TCN_Ikorodu_Transport_App.md` and the domain folders (`PRODUCT/`, `DATA-MODEL/`, `STATE-MACHINES/`, and so on).
5. Meeting notes, minutes, presentations, prototypes. These are history and evidence. They are not specifications.

## 2. Status header

Every new or rewritten document starts with the same block:

```
# Title
**Status:** Draft | Proposed | Accepted | Superseded · **Version:** 0.x · **Date:** YYYY-MM-DD · **Owner:** role
**Decisions:** D-xxx, D-yyy · **Open issues:** OI-xxx
```

- `Draft`: being written, not for decisions.
- `Proposed`: ready for review; decisions it depends on are still open.
- `Accepted`: every decision it cites is Accepted in the log.
- `Superseded`: replaced; keep the file and link to the replacement.

Documents are dated with ISO dates. Version numbers increase when content changes meaning, not for typos.

## 3. Identifiers

| Prefix | Meaning | Lives in |
|---|---|---|
| `D-###` | Decision | Decision log |
| `OI-###` | Open issue | Open-issue register |
| `RISK-###` | Risk | Decision log, `RISK-ASSESSMENT.md` |
| `R-###` / `C-###` | Requirement / constraint | Decision log |
| `Q-###` | Question asked of a sponsor or domain owner | `QA-LOG.md` |
| `ADR-####` | Architecture decision record (technical detail behind a `D-`) | `ARCHITECTURE/ADR/` |
| `SR-###` | Support report raised by a member or marshal in the app (runtime data, not a doc ID) | Database |
| `INC-###` | Operational incident on travel day | Database and `ISSUE-MANAGEMENT/` |

IDs are never reused. A retired ID stays in the log with status Superseded or Rejected.

## 4. Reopening

A decision is reopened only with the format in `AGENTS.md` Part I §4: **Existing decision → New evidence → Impact → Alternative → Recommendation**. The reopen is recorded as a new decision entry that references the old one. The old one is never edited in place.

## 5. Logging questions and answers

From 2026-10-12 onward, every multiple-choice question asked to the sponsor is written into `DECISION-LOGS/QA-LOG.md` before it is asked, with a `Q-###` ID, the options, and the recommended option. The answer is added when given. An answer that changes a decision creates or updates a `D-` entry and cites the `Q-` ID as evidence. This is the audit trail for drift: if a document says something no Q&A entry supports, it is a finding.

## 6. Writing rules

- Plain language first. Internal IDs belong in internal documents. Church-facing documents (`INITIAL-PRODUCT-SPEC.html`) do not carry D- or OI- codes.
- Say what is decided, what is proposed, and what is unknown. Do not write "TBD" without an owner, a next action, and a deadline (`AGENTS.md` Part I §7).
- Do not use em dashes in new documents. Use a colon, parentheses, or a new sentence.
- Mark anything that is a recommendation rather than a fact as **Recommendation**. Mark anything that needs checking against a live source as **Verify**.
- Never write secret values, keys, card data, or real member personal data into any document. Reference variable names only.
- Vendor limits, prices and terms change. Any figure from a vendor page carries the date it was checked.

## 7. Folder rule

Every folder under `DOCS/` contains a `README.md` that states: what the folder is for, its status, the files in it, which decisions govern it, and who owns it. A folder without a README is a finding.

## 8. Change process

1. Change the log first if a decision or open issue changes.
2. Change the domain document second.
3. Add the `Q-` answer to `QA-LOG.md` if the change came from a sponsor answer.
4. Update the `DOCS/README.md` index if a file was added, renamed or superseded.
5. Bump the version and date in the document header.
