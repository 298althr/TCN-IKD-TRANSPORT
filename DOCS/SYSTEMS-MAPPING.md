# UIOS Systems Mapping — TCN Ikorodu Transport App

**Prepared by:** Product Manager / Product Owner
**Version:** 1.0
**Status:** Canonical reference for how the UIOS engine specs (`DOCS/SYSTEMS/`) relate to this product
**Companion discipline:** Ponytail System (`DOCS/SKILLS/`) — governs what we import vs. cut

---

## 0. What the SYSTEMS docs actually are

`DOCS/SYSTEMS/` is **not a product spec for this app**. It is the engine catalog for a general-purpose "Universal Intelligence Operating System" — a multi-domain decision-intelligence platform covering problem discovery → research → knowledge → hypothesis → simulation → recommendation → governance → execution → monitoring → learning → memory → explainability, all riding on a shared kernel (UIK) and integration backbone (UAIE).

Two readings matter for us:

- **As product spec:** wrong tool. The full UIOS carries ~380 tables across 19 engines — built for organizations running Monte Carlo simulations and multi-model AI consensus. Our app books bus seats for one congregation.
- **As architectural vocabulary and discipline:** correct tool. The *patterns* — kernel-first identity, append-only audit, every action emits an event, contract-first integration, explicit lifecycle state machines, agents read dependencies before editing — are exactly what this project's meeting minutes keep reaching for (immutable systems, audit trail, context object, rate limiting, explainability of "who confirmed this booking").

**The ponytail verdict up front:** we import the *laws* of UIOS, not the *machinery*. For each engine below: what it teaches us, what maps to a real requirement in this product, and what gets cut. Review tags follow the ponytail system (`delete:`, `native:`, `yagni:`).

---

## 1. Engine-by-Engine Mapping

| Engine | What it is in UIOS | What it means for THIS product | Verdict |
|---|---|---|---|
| **UIK-001** Kernel | Universal infra: UUIDs, workspaces, objects, events, permissions, audit, versioning. No business logic. | Our shared identity + audit substrate. Member/Booking/Payment records get UUIDs, append-only history, and lifecycle states — the "immutable systems" ask from Meeting Minutes §4 is literally UIK's `audit_log` ("nothing is deleted, only archived"). | **IMPORT the pattern.** `delete:` 20-table kernel → we need ~6 entities (members, programmes, routes, buses, bookings, payments) + `audit_log` + `event_log`. |
| **UAIE-019** Integration backbone (Master.txt) | API gateway, connectors, webhooks, event bus, standard message envelope, `rate_limit_events` table. | **Directly relevant.** Paystack webhooks (D-006), push/email providers (D-009), the rate-limiting system (§3.7 — UIOS already has `rate_limit_events` as a first-class table), and — see §3 — the agent-to-agent mail protocol. The **standard message envelope** (message_id, correlation_id, event_type, source, target, timestamp, payload, metadata) becomes our canonical message format. | **IMPORT strongest.** This is the single most reusable engine for us. |
| **ADCOS-002** Decision orchestrator | Routes every decision case through stages with approval gates and rollback policies. | Our booking lifecycle IS a small ADCOS workflow: `Booked → Marshal Contacted → Confirmed → Boarded` with gates (payment required? member confirmed?) and rollback (cancellation restores seat). | **IMPORT the lifecycle/gate model.** `yagni:` the generic DAG executor — our flows are linear pipelines, not arbitrary graphs. |
| **IOE-018** Orchestration engine | DAG workflows, execution queue, retry/failure recovery, context packages. | The booking-window scheduler (D-004) + notification fan-out (D-009) are IOE-style scheduled/event-driven jobs. `context_packages` maps directly to our Context Management System (§3.10) — IOE already solved "who is acting, on behalf of whom" propagation. | **IMPORT context_packages + retry queue concepts.** `yagni:` distributed/parallel execution modes — single VPS doesn't need them. |
| **PRE-008** Problem & research | Problem discovery, evidence collection, readiness assessment before solutioning. | Already done — the BRD → decision-deck → meeting-minutes chain WAS PRE executed manually. Its `readiness_assessment` concept is now our Gate 0 (OI-001 reconvene). | **ALREADY APPLIED.** Keep the readiness-gate idea for future feature intake. |
| **QOF-005** Observation quality | Scores inputs before they become trusted evidence: source reliability, provenance, completeness. | Maps to input validation + membership-roll verification (AUTH-2) + payment webhook verification. "Only observations meeting quality thresholds are promoted" = only verified Paystack webhooks update booking state. | **IMPORT as a rule:** no external input becomes state without validation. `delete:` the 20-table observation registry. |
| **KGE-007** Knowledge engine | Knowledge as interconnected concepts/facts/relationships with confidence scores. | Our "knowledge" is just the relational domain model — Member, Programme, Route, Bus, Booking. Relationships are FKs, not a semantic graph. | **`yagni:` the whole engine.** A Postgres schema IS our knowledge graph. Keep one idea: relationships are first-class (`route_buses`, `booking_group.beneficiaries`). |
| **ARUEV-006** Assumptions/risks/validation | Every decision owns explicit assumptions, risks, uncertainties, evidence; revalidation triggers. | This is literally what we built: Decision Records carry Reason/Evidence/Consequences; Open-Issue Register carries owners/gates; RISK-001/002 are its risk register. | **ALREADY EMBODIED** in `PM-DECISION-LOG-AND-ROADMAP.md`. Formal recognition, no new build. |
| **HVE-009** Hypothesis & validation | Falsifiable hypotheses, statistical testing, acceptance criteria. | Our "hypotheses" are the conflicting Phase 1 answers (D-002/003/007). Validation = the reconvene + evidence. Post-launch: "seats-left display reduces no-shows" is a measurable hypothesis. | **IMPORT the acceptance-criteria habit** for reports/forecasts. `delete:` statistical machinery for MVP. |
| **DQS-004** Decision quality | Scores/certifies decisions on completeness, consistency, evidence before execution. | Our launch-readiness gate (Roadmap Phase C): concurrency test, webhook test, UAT, backup check. Certification levels ≈ CORE→MVP→PHASE 2 promotion. | **IMPORT as gate criteria.** `yagni:` continuous scoring infrastructure. |
| **SME-010** Simulation engine | Monte Carlo, digital twins, what-if analysis, counterfactuals. | Closest real need: "what if we add a second bus to Ikorodu Central?" — answered by our capacity report, not simulation. | **`yagni:` entire engine for this product.** Route-utilization reports (BRD §17) cover the actual question. |
| **RGE-011** Recommendation engine | Evidence-backed recommendations with ranked alternatives and tradeoffs. | Phase 2 "Analyse Transport Demand" (Journey E): reports that recommend route/capacity adjustments based on utilization history. | **PHASE 2.** LME+MME must accumulate real data first; nothing to recommend from yet. |
| **EXE-012** Execution & workflow | Tasks, checkpoints, approvals, rollback, auditable execution. | Booking creation, payment capture, refund execution, marshal status updates — each is an "execution" with checkpoints (payment webhook verify) and rollback (cancellation/refund). | **IMPORT checkpoint + rollback vocabulary** into the booking/payment state machine. |
| **MOE-013** Monitoring | Expected vs actual, thresholds, drift, anomaly alerts. | The reporting engine (BRD §17) + capacity dashboards + future "route demand drift" detection. Post-launch: alert when confirmed-attendance drifts from bookings. | **IMPORT for reporting/alerts.** Drift/anomaly detection = **PHASE 2** (needs data). |
| **LME-014** Learning | Outcome→lesson loops, controlled adaptation, pattern discovery. | The demand-forecast feedback loop: each programme's no-show rate should inform next programme's capacity recommendation. Explicitly the "maintain historical records" pain point (BRD §3). | **PHASE 2+, data-gated.** The mechanism: every completed programme writes a lesson record (attendance vs. booking variance). |
| **MME-015** Memory | Episodic/semantic/procedural memory, retention policies, controlled forgetting. | Immutable booking/payment history + retention policy. Maps to the "immutable systems" open item — MME's retention_policies table IS the answer shape for "which records expire vs. preserve permanently." | **IMPORT the retention-policy concept** for OI-003's immutability deliverable. |
| **GCE-016** Governance/compliance | Policies, RBAC, approval workflows, immutable audit, accountability registry. | Our RBAC (Member/Marshal/Admin) + approval gates (marshal confirms, admin overrides refunds) + audit trail + the privacy gate (AUTH-1). The `accountability_registry` concept = every booking status change has a named actor. | **IMPORT RBAC + approvals + audit as MVP.** `delete:` ethics-review machinery. |
| **XTE-017** Explainability | Full provenance: reconstruct any decision, who/what contributed, alternatives rejected. | The church version: "why does this seat record say Cancelled — who cancelled it, when, was a refund issued?" Every booking must be reconstructable end-to-end (booking → payment → marshal contact → confirmation → boarding/cancellation). | **IMPORT the provenance rule:** every state transition stores actor + timestamp + prior state. No separate engine — it lives in `audit_log` + `event_log`. |
| **Index.txt** Reading protocol | Four-pass learning strategy, never-edit-in-isolation rule, AI agent reading protocol. | **The agent onboarding protocol for this project.** "Before modifying, read dependents + consumers + shared entities" is exactly what the multi-agent prompt demands of every team role. | **IMPORT wholesale as process** — it's a working agreement, not software. |

---

## 2. The Compressed Import List (what actually survives ponytail)

If you strip the machinery and keep the laws, UIOS reduces to **7 architectural invariants** for this product:

1. **Kernel-first identity** — every entity is UUID-keyed, versioned, never hard-deleted. *(UIK)*
2. **One message envelope** — every internal event and external webhook carries `{id, correlation_id, type, source, target, timestamp, payload, metadata}`. *(UAIE)*
3. **Lifecycle is explicit state machine, not implicit behavior** — bookings, payments, refunds all have named states and legal transitions. *(ADCOS/EXE)*
4. **No unvalidated input becomes state** — webhooks verified, membership roll checked, inputs bounded. *(QOF)*
5. **Every decision/action is attributable and reconstructable** — actor + timestamp + prior state, always. *(GCE/XTE)*
6. **Failures are first-class objects** — retry queue, failure records, rollback path designed before the happy path. *(IOE/EXE)*
7. **Nothing is built for a hypothetical second product, but nothing forecloses it** — schema namespacing only. *(OI-008, and ponytail rung 1)*

Everything else in the 19 engines — knowledge graphs, consensus nodes, simulation twins, quality certification pipelines — is **`delete:`** for this product's scope. Importing them would be the exact over-engineering ponytail exists to prevent: `net: -380 tables, -15 engines possible.` The seven invariants above carry all the value at ~2% of the machinery.

---

## 3. Where These Land in Existing Docs

| UIOS concept | Already lives at |
|---|---|
| Decision lifecycle + gates | `PM-DECISION-LOG-AND-ROADMAP.md` (D-records, scope tiers) |
| Risk/assumption register | Same doc, Section 2 Open-Issue Register + RISK entries |
| Message envelope | New: `AGENT-COMMUNICATIONS-WORKFLOW.md` (§3) + notification engine |
| Rate-limit events | Meeting Minutes §3.7 (RATE-1..3) |
| Retention/immutability policy | Meeting Minutes §3.8 + OI-003 |
| Context packages | Meeting Minutes §3.10 (CTX-1) |
| Agent reading protocol | `AGENT-COMMUNICATIONS-WORKFLOW.md` onboarding section |
