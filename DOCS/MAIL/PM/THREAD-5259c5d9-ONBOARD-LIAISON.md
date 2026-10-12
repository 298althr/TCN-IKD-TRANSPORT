# THREAD-5259c5d9 — [M][ONBOARD-LIAISON] Welcome aboard — Liaison | VLTHRTEAM onboarding

**Thread ID:** `5259c5d9-9753-49ee-9a00-4c77679a7cc3`
**Participants:** `vlthrlab-pm@agentmail.to` (PM), `vlthrlabs@gmail.com` (Church Transport Dept. Liaison — human)
**Status:** answered — PM reply sent 2026-10-07
**Labels:** onboarding, tcn-tms

---

## 1. ONBOARD-LIAISON broadcast (Secretary/onboarding, 2026-10-07)

Welcome package sent to liaison inbox.

## 2. Liaison reply (RE: [M][ONBOARD-LIAISON], 2026-10-07 02:02 UTC)

Envelope: `type: M`, `entity: ONBOARD-LIAISON`, `from: vlthrlabs@gmail.com`, `requires_ack: false`.

### Operational truths delivered (domain truth — logged)

1. Members inform coordinators/marshals via phone/WhatsApp/in-person; names + payments recorded on paper lists or local spreadsheets.
2. **Cash/manual pay option is essential** — a subset of members rely on cash/in-person payment; digital-only at launch would exclude them.
3. Existing department registers/contact spreadsheets can be exported (CSV/Excel) to pre-load member profiles.
4. Typically 2–4 buses per major programme; pickups on semi-fixed routes/landmarks, adjusted for turnout.
5. Non-shows generally non-refundable unless cancelled well before departure (covers bus-hire commitments).
6. Marshal check-ins use printed paper manifests + manual tick-offs.

### Readiness check (their answers)

- AGENTS.md protocol confirmed.
- Environment: Google Workspace (Gmail/Docs/Drive/APIs), Python analytics tooling, local automation backends.
- Automation: event-driven prompt loops + inbox polling.
- Immediate blockers: none.

### Their three questions

a. Manifest lock cutoff before a programme?
b. Marshal mobile web app at bus stop vs. offline/printable manifest fallback?
c. Role-based permissions for marshals vs. general admins?

## 3. PM reply sent (2026-10-07)

- Truth 2 → **D-021 (Proposed, sponsor ratification requested)**: manual/cash payment is a required payment path alongside Paystack; cash refunds handled manually + reconciliation audit.
- Truth 6 → **R-007** *(announced on-thread as R-005; renumbered — R-005 is the UIOS-vocabulary requirement)*: printable/offline manifest export promoted to MVP requirement. Correction notice sent on-thread.
- Truth 5 confirmed consistent with PAY-6 refund window — no change.
- Truth 3 feeds AUTH-2 (membership gate) + D-007 (duplicate handling) — CSV export likely becomes the member pre-load source.
- Truth 4 consistent with D-001 route↔buses model.

### Answers to their questions

a. Manifest locks at the programme's booking-window close (per-programme cutoff; Friday 6 PM rule for Sunday programmes). Admins may still process post-lock changes; manifest reflects locked set + admin adjustments.
b. **Both**: mobile web app primary + mandatory printable/offline fallback (R-005).
c. Proposed RBAC default pending OI-003: Marshal = assigned-route manifest read + boarding/no-show marking only; Admin = full booking/passenger/payment/capacity/refund + marshal assignment.

Follow-up owed to liaison: membership-roll export format once AUTH-2 is decided.

## 4. vlthrlab-pm@agentmail.to, 2026-10-12T07:43:40.237Z

```yaml
message_id: 01a12f11-38ca-7320-ade7-5f66b8e1af12
correlation_id: onboard-liaison
type: C
from: vlthrlab-pm@agentmail.to
to: [vlthrlabs@gmail.com]
cc: []
reply_to: null
timestamp: 2026-10-12T07:43:40.234Z
priority: normal
payload:
  summary: "PM follow-up: 7 October answers logged; two new threads sent"
  context_ref: "DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md"
  action_required: false
metadata:
  artifact_links: []
  deadline: null
```

PM follow-up, 12 October. Your answers from 7 October are logged. Two new threads follow: the list of policies the department needs to write, and a set of scenarios to check against real practice. No reply is needed on this thread.
