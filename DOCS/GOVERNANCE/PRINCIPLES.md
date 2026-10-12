# Principles

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Sources:** `philosophy.md` (immutability as a human problem), `AGENTS.md` Parts I and II, `CANONICAL-PROJECT-LIFECYCLE.yaml` invariants, `RISK-ASSESSMENT.md`

Principles are tests. A proposal that breaks one must say which one and why it is still right.

---

## 1. Product principles

1. **Church first.** The app serves members, marshals and the transport department. Vendor preference and engineering preference come after that.
2. **A booking is not a passenger.** A seat is held, then confirmed, then boarded. The system never treats a booking as a person on the bus.
3. **Money is confirmed by the provider, not by the browser.** No payment instrument is stored by the church (D-023).
4. **Plain language.** Members see what happened to them in words they use. Internal states stay internal.
5. **The phone still works.** WhatsApp and phone calls are first-class on travel day. The app records; it does not gate safety.
6. **Membership is a decision, not a side effect.** Signing in does not make someone a member. A person accountable for the approval is named.

---

## 2. Record principles (from the philosophy review)

7. **Immutable, attributed records.** Every change is recorded with who, when, what before, what after and why. Records are superseded, not rewritten.
8. **Explicit authority.** Every transition names the role allowed to trigger it. Every open issue names an owner.
9. **Cheap replacement.** Components can be swapped (provider, channel, host) without rewriting the rules. Rules live in one place.
10. **Blameless records.** Incident and error reviews ask what the system allowed, not who failed. Blame culture hides information.
11. **No shadow mutability.** Every route that changes state goes through the audited path. A side channel (a spreadsheet, a direct database edit, a verbal change) is a defect to be logged.

---

## 3. Anti-failure-mode checks (the five named in the philosophy review)

| Failure mode | Check before accepting a design |
|---|---|
| Ossification | Can the rule be changed by a decision entry without a rewrite? |
| Shadow mutability | Is there any path that changes state without an audit row? |
| Authority vacuum | Who can decide this, and who can correct it afterwards? |
| Ceremony over substance | Does this step prevent a real failure, or only look like control? |
| Blame culture | Does the record help us learn, or does it assign a person to blame? |

---

## 4. Engineering principles (from `AGENTS.md` and the constitution)

12. Contract first: interfaces agreed before implementation assumptions harden.
13. Single source of truth: the decision log for decisions; the database for operational state; no duplicated business rules.
14. Separation of concerns: a domain does not quietly take over another domain's problem.
15. Security by design: never a final-stage activity.
16. Reversibility: prefer decisions that do not require destructive redesign later.
17. Anti-bloat (ponytail ladder): YAGNI, then reuse, then the platform's own feature, then a dependency, then the smallest custom code. Each step up needs a reason in the log.
18. Observability: important events are traceable across the system with a correlation ID.

---

## 5. Decision principles

19. Respondents decide domain questions (D-012). The PM arbitrates scope and sequencing, not domain facts. The sponsor decides policy, money and launch.
20. Evidence before opinion: a recommendation cites evidence or is marked as assumption.
21. Reopen only with new evidence of material impact (AGENTS Part I §4).
22. Every question to the sponsor is logged before it is asked (D-026).
23. An unresolved question is never silently defaulted. Provisional defaults are labelled provisional, with an owner and an expiry.
