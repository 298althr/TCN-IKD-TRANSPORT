# Issue Management Procedure

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Decisions:** D-012, D-017, D-026 · **Open issues:** all (this procedure governs them)

---

## 1. Identifiers

| Prefix | Record | Format example |
|---|---|---|
| D- | Decision | D-024 |
| OI- | Open issue | OI-030 |
| RISK- | Risk | RISK-008 |
| Q- | Question to sponsor or owner | Q-004 |
| ADR- | Architecture decision record | ADR-0003 |
| BUG- | Product defect (tracker) | BUG-112 (tracker number) |
| INC- | Travel-day incident | INC-027 (database number) |
| SR- | Member or marshal support report | SR-0931 (database reference) |

IDs are never reused.

---

## 2. Issue record (open issues)

Required fields (from `AGENTS.md` Part I §7 and `CANONICAL-PROJECT-LIFECYCLE.yaml`):

Issue ID · Description · Why it matters · Domain · Owner · Agents required · Options · Recommended resolution · Decision required from · Deadline or gate · Status.

Status values: `Open`, `In analysis`, `Recommended`, `Decided`, `Closed`, `Escalated`. "Open, Blocking" means a named gate cannot pass.

---

## 3. Defect handling (BUG-)

1. Report: what, where, steps, expected, actual, severity (S1 to S4), screenshot if no personal data.
2. Triage within one working day: confirm severity, assign owner, link to the domain document and any OI it touches.
3. S1 bypasses the queue: fix or workaround before the next duty, and an INC record if travel was affected.
4. Fix: branch, test (see `TESTING/`), review, merge. A regression test is added for every S1 and S2.
5. Close with the release that contains the fix.

---

## 4. Travel-day incidents (INC-)

1. Open an incident within the app (`open_incident`) or record it by phone and open it afterwards. The incident must exist before the bus leaves if possible.
2. Kinds: `bus_late`, `bus_breakdown`, `bus_cancelled`, `marshal_absent`, `wrong_bus`, `other`.
3. Admin acknowledges; action in progress (rebook, reassign, notify); resolved; closed after review.
4. Blameless review within five working days for S1 and for any breakdown or cancellation.
5. Review actions become BUG or OI records with owners.

---

## 5. Questions to the sponsor (Q-)

1. Write the Q entry in `QA-LOG.md` before asking: question, options, recommended option, consequence of each option.
2. Ask four at a time (the round size requested 2026-10-12) unless a question blocks others.
3. Record the answer and the date. Create or update the D- or OI- entry it affects, citing the Q-.
4. If an answer is not given, the question stays open with its owner and a follow-up date.

---

## 6. Risks (RISK-)

Each risk has: description, likelihood, impact, owner, mitigation, trigger (what would show it is happening). Reviewed at the weekly open-issue review.

---

## 7. Reviews and cadence

As set in `README.md` of this folder. Summary: weekly open-issue review, fortnightly decision review, drift check before every walkthrough and phase gate, monthly audit review after launch.

---

## 8. Tracker setup (recommendation)

Use a free-tier issue tracker (GitHub Issues with a project board) for BUG and implementation tasks. Labels: `S1`, `S2`, `S3`, `S4`, `blocked:OI-xxx`, `decision-needed`, `area:payments`, `area:booking`, `area:auth`, `area:notifications`, `area:support`. The tracker never holds personal data or secrets. Decisions and open issues stay in the decision log.
