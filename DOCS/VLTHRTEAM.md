# VLTHRTEAM — Reusable Multi-Agent Team Management System

**Version:** 1.0 | **Status:** Extracted & generalised from the TCN Ikorodu Transport App build
**Nature:** A complete organizational, operational, and workflow management system for cooperative multi-agent (human or AI) product teams. Portable to any high-value task, workflow, or project.
**Benchmark basis:** Fortune-500-grade operating practices — mapped section by section, imported at pattern level only (Ponytail discipline: take the law, not the machinery).

---

## PART 0 — WHAT VLTHRTEAM IS

VLTHRTEAM is a team operating system: a fixed set of **roles, registers, protocols, and gates** that turns a group of independent specialists (or agents) into a single delivery organism.

Its core claim:

> **No agent starts from a blank page. Every participant inherits accumulated context, makes recorded decisions, and leaves a transferable artifact — so the team's collective intelligence compounds instead of resetting.**

It was built and battle-tested on a real product (a church transport management system) across: requirements extraction, stakeholder decision conflicts, sequential specialist onboarding, live agent-mail infrastructure, and governance registration. Everything below is something that actually ran — not theory.

---

## PART 1 — ORGANIZATIONAL MODEL

### 1.1 The Three-Level Hierarchy

```
LEVEL 1 — EXECUTIVE SPONSOR        owns: executive authority (budget, policy, launch, direction)
    │
LEVEL 2 — PRODUCT MANAGER (HUB)    owns: decision log, issue register, scope, sequencing, gates
    │         + SECRETARY          owns: onboarding, directory, coordination broadcasts
    │
LEVEL 3 — DOMAIN LANES             owns: their domain, their artifact, their decisions
         ┌──────────┬──────────┬──────────┬──────────────┐
      DELIVERY    DESIGN    ASSURANCE    CROSS-LANE
      (eng)      (uiux)     (qa+sec)     (devops, data)
```

**Fortune-500 anchors:**
- *Single-Threaded Owner (Amazon)* — every domain has exactly one accountable owner; ownership is never shared or implied.
- *RAPID decision rights (Bain)* — every decision names who Recommends, who Agrees, who Performs, who Inputs, who Decides. In VLTHRTEAM: the domain owner Recommends+Performs, affected peers Input, PM Agrees/Decides on cross-domain items, Sponsor Decides on executive items.
- *Two-pizza team* — the roster stays small; roles collapse onto fewer humans when headcount is low, but **profile boundaries never collapse** — the registry preserves the ownership map even when one person wears three hats.

### 1.2 Hub-and-Spoke, Not Committee

The PM is the hub. Spokes are domain owners. The chain is **sequential enough that each specialist temporarily becomes the context provider for the next** — `Hub → Domain → Artifact → Handoff → Next Domain → Review → Hub`, never "ten agents produce ten opinions."

### 1.3 The Team Registry

A machine-readable registry (`team-registry.yaml`) holds **one profile per agent**: mailbox, API key scope, lane, `owns`, `reports_to`, `upstream`/`downstream`, `status`, `current_task`. The registry — not org chart drawings — is the queryable source of truth for "who owns X right now."

### 1.4 Ownership Pie

Assign each role a percentage of *product responsibility* (not salary, not effort). PM holds the largest share because synthesis is the highest-leverage accountability — but a small-share role (e.g., the domain-truth liaison) can hold *very high authority* inside its lane. Percentages make the org legible and rebalancable.

---

## PART 2 — THE REGISTERS (System of Record)

VLTHRTEAM runs on five registers. **Documents narrate; registers decide.**

| Register | Contains | Rule |
|---|---|---|
| **Decision Log** | `D-###` records: decision, status, owner, reason, evidence, alternatives, consequences, next action | No important choice lives outside it |
| **Open-Issue Register** | `OI-###` records: description, why-it-matters, owner, options, recommended resolution, decision-required-from, gate, status | Every issue has an owner + gate — never "TBD" |
| **Risk Register** | `RISK-###` with mitigation owner | Risks link to the OI/decision that spawns them |
| **Scope Register** | Every capability → CORE / MVP / PHASE 2 / FUTURE / OUT OF SCOPE | Classified by business value + dependency, never by difficulty |
| **Team Registry** | Agent profiles (above) | PM-owned; changes land via D-records |

**Conflict rule:** on any disagreement between a narrative document and the registers, **the registers win**. Narrative docs are history; registers are state.

---

## PART 3 — OPERATING PROTOCOLS

### 3.1 Onboarding Protocol (every new agent/member)

1. **Confirm role** — what you own, what you don't, what you received, who depends on you.
2. **Interpret the product** — ≤500 words on what the work is *actually* trying to accomplish (not restating the brief).
3. **Assess the landscape** — what's defined / incomplete / contradictory / dangerous-if-undefined.
4. **Ask exactly three MCQs** — the three decisions whose answers most change your work, each with options + recommendation + consequence per option. Never spend a question on already-settled material.
5. **Check the mailbox** — read the thread state before producing anything.

*Benchmark: executive onboarding memos + Amazon "Day 1" narrative discipline — forced written understanding before action.*

### 3.2 Daily Start Protocol

`CHECK INBOX → ACKNOWLEDGE ("MAIL RECEIVED" + deltas) → RECONCILE ("does this invalidate prior work?") → DELIBERATE`

The reconcile step is the load-bearing one: every agent must explicitly declare **REVISION REQUIRED** or **PREVIOUS WORK REMAINS VALID** before working. *Benchmark: airline pre-flight checklists applied to knowledge work.*

### 3.3 Decision Protocol

- Important questions never stay observations — they become **Decision Records**.
- Statuses: `Proposed / Accepted / Rejected / Reopened`.
- **Reopen** requires *new evidence of material impact* (security, scale, cost, usability, reliability, compliance, integrity, feasibility, or a discovered contradiction). The PM decides whether a reopen is formal.
- *Benchmark: ADR (Architecture Decision Record) practice + RAPID + "disagree and commit" — once decided, execution proceeds under the recorded decision even by those who argued against it.*

### 3.4 Handoff Protocol

Every completed work package ships as a **Handoff Packet**: executive summary → decisions made → deliverable → dependencies → changes-required-elsewhere → open issues → downstream instructions → **Context Capsule** (machine-readable: role, domain, locked decisions, requirements, constraints, risks, dependencies, deliverable, next agent, next action, open issues, status).

*Benchmark: surgical handoff protocols (SBAR) + Amazon 6-pager — the reader must not need a meeting to understand the artifact.*

### 3.5 Communications Protocol (the agent-mail layer)

- **Transport:** one mailbox per role; inbox-scoped credentials (an agent's key can only reach its own inbox — isolation is enforced by the infrastructure, not by politeness).
- **Envelope:** every message opens with a structured block — `message_id, correlation_id, type, from, to, timestamp, payload, metadata`.
- **Subject grammar:** `[TYPE][ENTITY-ID]` — `Q` question, `D` decision, `H` handoff, `R` review, `B` blocked, `E` escalation, `M` announcement, `C` context-sync.
- **Threading:** the entity ID *is* the thread — an issue's entire life lives in one conversation.
- **Labels** carry machine-routable state (`status-open`, entity tags).
- **Mirror to disk:** per-role folders, one doc per thread — the durable archive for late joiners.
- **Rules:** no secrets in mail (references only) · `blocking` priority reserved for true gates · questions go to the ONE owner who can answer · mail is transport, registers are record.

*Benchmark: internal API contracts between teams + Amazon's "API mandate" applied to human/agent communication.*

### 3.6 Escalation Ladder

```
L1  agent↔agent [Q] thread                          — 48h working SLA
L2  stalemate/no-response → [B] to PM → arbitrate or open OI
L3  executive-level (budget, policy, launch, direction) → [E] to Sponsor via PM
```

The sponsor's mailbox is *quiet by design* — only L3 traffic reaches it. *Benchmark: incident severity/escalation matrices (ITIL-lite) — escalation is a designed path, not a social act.*

### 3.7 Review & Correction Protocol

- **Corrections are normal operations, not insults.** Format: `CORRECTION REQUEST {target, version, issue, evidence, impact, required fix, owner, priority}`.
- **Bloat audits** use the Ponytail tags only: `delete:` `stdlib:` `native:` `yagni:` `shrink:` — ending with a `net:` metric. Style is out of scope; bloat is the only target.
- *Benchmark: blameless postmortems + engineering bar-raiser reviews — critique the artifact, protect the author.*

### 3.8 Delivery Flow (SDLC registration)

`Define & Prioritise (PM) → Design (UX) → Implement + Code Review (Eng) → Test Gate (QA) → Deploy & Monitor (Ops)` — **fail loops back to Implement, never skipping review**. Product-side gates sit upstream of "Implement" so engineering never starts on unresolved conflicts.

*Benchmark: stage-gate/phase-gate (used by every F500 hardware+software org) + swimlane accountability.*

---

## PART 4 — THE ENGINEERING DISCIPLINE (Ponytail, embedded)

VLTHRTEAM embeds an anti-bloat ladder as standing law:

1. **YAGNI** — reject speculative "for the future" requirements.
2. **Reuse** — find the existing pattern first.
3. **Native** — offload to DB/OS/platform before writing code.
4. **Existing dep** — prefer what's already installed.
5. **One-liner** — if a line of logic does it, that IS the implementation.
6. **Minimum viable system** — only then build.

Deliberate shortcuts must carry a ceiling comment: `ponytail: [ceiling], [upgrade path]`.

**Safety invariants — never simplifiable:** input validation at trust boundaries · error handling that prevents data loss · security/auth · one runnable check for non-trivial logic.

*Benchmark: Google's "simplicity is a feature" engineering culture + YAGNI/KISS orthodoxy — but enforced through an auditable review tag grammar, not vibes.*

---

## PART 5 — GATES

Gates are the only things that can stop work. Everything else is a queue.

| Gate | Question | Blocks |
|---|---|---|
| **G0 — Decision Gate** | Are the blocking conflicts resolved? | Domain build start |
| **G1 — Contract Gate** | Are interfaces between domains defined? | Implementation assumptions hardening |
| **G2 — Launch Readiness** | Concurrency test, integration retry tests, UAT, backup verified? | Production |
| **G3 — PRD Readiness** | Journeys, boundary, rules, model, economics, risks all evidenced? | Formal PRD authorship |

*Benchmark: F500 capital-expenditure stage gates — funding/effort only flows past an evidence checkpoint. Same discipline, smaller scale.*

---

## PART 6 — INSTANTIATION CHECKLIST (reusing VLTHRTEAM on a new project)

1. **Name the registers** — create empty Decision Log, Open-Issue Register, Risk Register, Scope Register, Team Registry.
2. **Appoint the hub** — PM role first; every other role is a spoke.
3. **Draw lanes** — map the project's domains onto delivery / design / assurance / cross-lane.
4. **Provision the mail layer** — one mailbox per agent, scoped keys, envelope + subject grammar live before the first handoff.
5. **Run onboarding** — every member: role confirm → interpretation → 3 MCQs to the sponsor.
6. **Set the gates** — define G0's blocking conflicts explicitly; nothing downstream of G0 starts early.
7. **First broadcast** — `[M][BOOTSTRAP]` message: mailbox map + envelope spec + register locations.
8. **Operate the loop** — daily start protocol → deliberate → decide → record → hand off → review → next domain.
9. **PM synthesizes last** — the hub integrates domains into one coherent product and rules on PRD readiness.

---

## PART 7 — WHAT VLTHRTEAM DELIBERATELY ISN'T

- **Not a meeting system.** Decisions happen in threads and records, not calls. A meeting is a *failure mode* for when the async system stalls (L2/L3 escalation).
- **Not headcount-dependent.** One human can hold five profiles; five agents can hold one lane. Profiles are ownership boundaries, not seats.
- **Not a surveillance system.** Registers record *decisions and states*, not activity. Trust is structural (scoped keys, attribution), not observational.
- **Not heavyweight governance.** Every construct below survives only because it prevented a real ambiguity during the extraction project — anything that becomes ceremonial deadweight gets `yagni:`'d out.

---

## CONTEXT CAPSULE

```text
PRODUCT: VLTHRTEAM — reusable multi-agent team management system
EXTRACTED FROM: TCN Ikorodu Transport Booking & Management App build
DECISIONS EMBODIED: D-009 (comms channel strategy) · D-012 (reconvene over tie-break) ·
                    D-015 (mail transport + scoped keys) · D-016 (governance registration)
CONSTRAINTS: works at $0 budget · async-first · secrets never in transit ·
             registers beat narratives on conflict
DEPENDENCIES: a mail transport (AgentMail or equivalent) · a docs tree · a sponsor
DELIVERABLE: DOCS/VLTHRTEAM.md (this document)
REUSE CONTRACT: instantiate via Part 6 checklist; registers are mandatory,
                role names are templates, protocols are fixed
STATUS: READY
```
