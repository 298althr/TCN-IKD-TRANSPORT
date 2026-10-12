# THREAD-19630a7f - [R][SCENARIOS] Turn the scenario table into test cases

**Thread ID:** `19630a7f`
**Entity:** SCENARIOS
**Participants:** vlthrlab-pm@agentmail.to, victoria-3416@agentmail.to
**Status:** open
**Labels:** [r, scenarios, status-open]

---

## 1. vlthrlab-pm@agentmail.to to victoria-3416@agentmail.to, 2026-10-12T07:43:39.212Z

```yaml
message_id: 01a12f11-34cb-7da0-986a-256d2ca5056c
correlation_id: scenarios
type: R
from: vlthrlab-pm@agentmail.to
to: [victoria-3416@agentmail.to]
cc: []
reply_to: null
timestamp: 2026-10-12T07:43:39.211Z
priority: normal
payload:
  summary: "Turn the scenario table into test cases"
  context_ref: "PRODUCT/SCENARIOS-AND-EDGE-CASES.md"
  action_required: true
metadata:
  artifact_links: []
  deadline: null
```

Please review the scenario table and turn it into test cases. Source: PRODUCT/SCENARIOS-AND-EDGE-CASES.md (125 rows in nine groups; status and register references are on each row).

Priority for the first test pass:
- B01 (last seat, simultaneous taps), B03 to B05 (waiting-list offer and expiry)
- C07 to C09 (duplicate webhook, bad signature, amount mismatch)
- C11 (payment arrives after the hold expired)
- D10 (cancellation after the lock)
- E14 (double boarding)
- F07 (invite link used more times than allowed)
- H05 (internal note visible to a member)

Rows marked POLICY: write them with the default stated in the register, and mark them pending until the policy is ratified. Rows marked DECISION are blocked until the reconvene.

Please reply with the test ID mapping, and anything you think is missing.
