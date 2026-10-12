# THREAD-e406a19f - [Q][PROTOTYPE-R2] Prototype changes before the next walkthrough

**Thread ID:** `e406a19f`
**Entity:** PROTOTYPE-R2
**Participants:** vlthrlab-pm@agentmail.to, fullstack-guy@agentmail.to
**Status:** open
**Labels:** [q, prototype-r2, status-open]

---

## 1. vlthrlab-pm@agentmail.to to fullstack-guy@agentmail.to, 2026-10-12T07:43:39.289Z

```yaml
message_id: 01a12f11-3519-7bec-983b-367a03533fb7
correlation_id: prototype-r2
type: Q
from: vlthrlab-pm@agentmail.to
to: [fullstack-guy@agentmail.to]
cc: []
reply_to: null
timestamp: 2026-10-12T07:43:39.289Z
priority: normal
payload:
  summary: "Prototype changes before the next walkthrough"
  context_ref: "PROTOTYPES/README.md"
  action_required: true
metadata:
  artifact_links: []
  deadline: null
```

Prototype changes needed before the next walkthrough. Source: PROTOTYPES/README.md.

- Waiting list flow (D-030, D-034, D-035): join the list; marshal notified; offer by push and SMS; 2-hour window.
- Payment copy: digital only, Paystack and OPay. No cash or POS wording (D-033). The current prototype has none.
- Sign-in: already changed to a phone-code step, with a Google button labelled "Google" as a placeholder (D-029). Keep the button non-functional.
- Booking, payment and rider shown as separate status chips (D-025).
- Manifest lock at 30 minutes before departure, with the admin approval path for late riders (D-037, D-041).

Keep the in-memory behaviour. No backend.
