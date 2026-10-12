# ISSUE-MANAGEMENT

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Product Manager
**Governed by:** `AGENTS.md` Part I §7 (no open issue without owner, next action, deadline, escalation), `CONVENTIONS/README.md` · **Open issues:** this folder defines how all of them are tracked

## What this folder is for

How the team tracks everything that is not yet decided or not yet working: open decisions, risks, product defects, travel-day incidents, and questions to the sponsor. It defines the IDs, the lifecycle, severity levels, the review rhythm, and where each record lives. It is about running the project. Member-facing issues are in `SUPPORT/`.

## Files

| File | Contents |
|---|---|
| `ISSUE-MANAGEMENT.md` | Record types, IDs, lifecycle, severity, owners, review cadence, post-incident review |

## Where each record lives

| Record | System of record | Mirror |
|---|---|---|
| Decision (D-) | `DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md` | Domain docs cite it |
| Open issue (OI-) | Same log, open-issue register | `RECOMMENDATIONS/` |
| Question to sponsor (Q-) | `DECISION-LOGS/QA-LOG.md` | Decision entries cite it |
| Risk (RISK-) | Same log, risk section | `RISK-ASSESSMENT.md` (internal) |
| Product defect (BUG-) | Issue tracker (GitHub Issues or equivalent, free tier) | Linked to the OI or domain doc it touches |
| Travel-day incident (INC-) | Database (`incidents` table) | Blameless review in this folder |
| Member support report | Database (`support_reports`) | Not mirrored (personal data) |

The log wins on any conflict. An issue tracker item that changes a decision must cite a Q- or D- entry.

## Open-issue lifecycle

`Open` → `In analysis` → `Recommended` → `Decided` (D- entry) → `Closed`, or `Escalated` at any point. A blocked issue stays open with the blocker named. "TBD" is not a status.

Every open issue carries: owner, next action, decision deadline or gate, escalation state (within team, to PM, to sponsor).

## Severity for defects and incidents

| Level | Meaning | Example | Response |
|---|---|---|---|
| S1 | Money or safety at risk, or bus cannot be run | Payment confirmed twice; manifest unavailable on duty day | Immediate; phone the on-call admin; fix before next duty |
| S2 | Core flow broken, workaround exists | Booking fails for one bus | Same day |
| S3 | Degraded, no money or safety impact | Wrong label on a screen | Next release |
| S4 | Cosmetic or wish | Layout spacing | Backlog |

## Review rhythm

| Review | Who | Cadence | Output |
|---|---|---|---|
| Open-issue review | PM, domain owners | Weekly during design and build | Updated owners, dates, escalations |
| Decision and QA-log review | PM, sponsor | Fortnightly | Decisions accepted, reopened or closed |
| Drift check (documents vs log) | PM | Before each walkthrough and each phase gate | Findings listed with owners |
| Incident review (blameless) | Admin on duty, PM | Within five working days of any S1 or travel incident | Review document, action items |
| Audit review | Admin (two named), sponsor digest | Monthly after launch (OI-013) | Sign-off recorded |

## Blameless review (post-incident)

Every S1 and every travel-day incident gets a short review. The review asks: what happened, what the system allowed, what information was missing, and what change prevents recurrence. It does not ask who was at fault. Actions have owners and dates. The review is filed here as `YYYY-MM-DD-INC-###.md`.

## Escalation

1. Domain owner (first).
2. Product Manager (domain disagreement, unclear ownership, or deadline at risk).
3. Executive Product Sponsor (budget, policy, launch authority, or a material product change) per `AGENTS.md` Part I §2.

A decision that the respondents must make (D-012) goes to the reconvene, not to the PM.

## Reopening

A decision reopens only with the format in `AGENTS.md` Part I §4 and a PM decision that it is reopened. The reopen is a new D- entry that cites the old one.
