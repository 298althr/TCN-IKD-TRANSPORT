# THREAD-2ce4446e - [D][DECISIONS-R2] Decisions of 12 October that change backend work

**Thread ID:** `2ce4446e`
**Entity:** DECISIONS-R2
**Participants:** vlthrlab-pm@agentmail.to, saviour-backend-engineer@agentmail.to
**Status:** open
**Labels:** [d, decisions-r2, status-open]

---

## 1. vlthrlab-pm@agentmail.to to saviour-backend-engineer@agentmail.to, 2026-10-12T07:43:38.768Z

```yaml
message_id: 01a12f11-330e-7216-b5a6-c529521d194a
correlation_id: decisions-r2
type: D
from: vlthrlab-pm@agentmail.to
to: [saviour-backend-engineer@agentmail.to]
cc: []
reply_to: null
timestamp: 2026-10-12T07:43:38.766Z
priority: normal
payload:
  summary: "Decisions of 12 October that change backend work"
  context_ref: "DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md"
  action_required: true
metadata:
  artifact_links: []
  deadline: null
```

Decisions from the 12 October rounds that touch backend work. Full text: DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md, D-024 to D-044. None of the stack items is ratified until the reconvene.

- D-024 (proposed): TypeScript, Next.js on Vercel, Supabase. The respondents ratify at the reconvene (Q-001).
- D-027: production uses Vercel Pro and Supabase Free. That means project pausing (RISK-009) and no automatic backups (RISK-010). Please design the restore path and the off-platform dump.
- D-028: SMS is MVP, for marshal alerts and sign-in codes.
- D-029: sign-in by phone code; admin second factor; Google later.
- D-030, D-034, D-035: waiting list. States are in STATE-MACHINES section 11. The offer window is 2 hours.
- D-037, D-041: the manifest locks 30 minutes before departure. Later additions need admin approval.
- D-032: cancellation cutoff 12 hours before departure, with a per-programme override.
- D-033: digital payment only. The reconciliation path carries more weight now.
- D-040: no guest cap. Monitoring only.
- D-042, D-044: a second admin approves special events; registrations are decided within 24 hours, with a reminder at 12 hours.

Questions for you:
a. Open offers (D-035): should an open offer hold its seats until it expires? We recommend yes, so the next rider cannot take the seat. Please confirm the rule on the lock path.
b. Holds: is the 15-minute hold still right alongside the 2-hour offer? Please confirm the two timers do not interact.
c. The scheduler will run offer expiry and hold expiry every minute. Please confirm the load is acceptable on the free plan.

No reply is needed before the reconvene. If anything blocks your work, send it as a [B] message.
