# Agent Communications Workflow — Email-Linked Multi-Agent Team

**Prepared by:** Product Manager / Product Owner
**Version:** 1.1 — updated after live provisioning (AgentMail confirmed, bootstrap sent)
**Status:** ACTIVE on free tier — 3 inboxes in org `edcd2158-…`
**Implements:** UAIE message-envelope pattern (`DOCS/SYSTEMS-MAPPING.md` §1) + IOE `context_packages` + Master Prompt §14–15 handoff protocol

---

## 0. What this is

This product is built by a cooperative sequential team — domain owners handing deliverables downstream, per the Master Multi-Agent Prompt. The missing piece has always been **transport**: how does a Decision Record, a handoff packet, or a blocking question actually move between agents (and their human operators) without a shared session?

This document defines that transport: **each agent owns a dedicated mailbox** (via AgentMail, or any programmatic send/receive mail service — Resend Inbound, Mailgun Routes, SES — the protocol below is service-agnostic). Email is the right medium because it is already asynchronous, already threaded, already durable, already addressable, and already human-readable — the liaison and sponsor can read the same messages the agents do.

UIOS solved this exact problem internally: `UAIE`'s standard message envelope and `IOE`'s `engine_messages` + `context_packages` tables. We adopt the envelope verbatim as the email body format.

---

## 1. Mailbox Plan — as provisioned

**Constraint:** free tier = 3 inboxes, 3,000 emails/mo, 100/day. The full 12-role map below is the *target* topology; only 3 are live now.

### Live mailboxes (org `edcd2158-…`, free tier)

| Address | Role | Scope | API key |
|---|---|---|---|
| `vlthrlab-pm@agentmail.to` | **Product Manager** | PM duties + all broadcasts (sends `all@` traffic as multi-recipient sends — no separate broadcast inbox) | `pm-inbox-scoped` key minted + verified: message/draft/webhook perms only, no inbox admin, no key creation |
| `vlthr-asset-generator@agentmail.to` | **Data Science / asset generation** | DS-related concerns | `AGENTMAIL_DS_SCOPED` minted |
| `victoria-3416@agentmail.to` | **QA / Test Engineer** (Victoria) | Review requests, completed artifacts | `AGENTMAIL_QA_SCOPED` minted |
| `vlthr-secretary@agentmail.to` | **Secretary (Ufuoma)** — second org | Onboarding welcomes, coordination | managed under second account |
| `saviour-backend-engineer@agentmail.to` | **Backend Engineer (Saviour)** — second org | State machine, payments, scheduler, API contracts | managed under second account |
| `fullstack-guy@agentmail.to` | **Full Stack Engineer** — second org | End-to-end features, FE/BE bridge, integrations impl. | managed under second account |
| `sayveeyhur@agentmail.to` | **Database / Data Architect** — second org | Schema, migrations, capacity model, audit tables | managed under second account |
| `uiux-expert@agentmail.to` | **UI/UX Designer** — second org | Journeys, Notification/PWA design doc, install flow | managed under second account |
| `vlthrlabs@gmail.com` | **Church Transport Liaison** — human participant | Domain-truth questions (plain language only) | none — real email |

### Target map (assigned as mailboxes are created — sponsor plans a second account/org for expansion)

| Address pattern | Role |
|---|---|
| `sponsor@` | Executive Product Sponsor *(can also be a real human email — sponsors don't need an AgentMail inbox)* |
| `backend@` | Backend/Systems Engineer |
| `database@` | Database/Data Architect |
| `frontend@` | Frontend Engineer |
| `devops@` | DevOps/Infra Engineer |
| `security@` | Security & Compliance Lead |
| `integrations@` | Integrations Specialist |
| `uiux@` | UI/UX Designer |
| `liaison@` | Church Transport Dept. Liaison *(real email is fine)* |

**Interim consolidation rule** (until more inboxes exist): unassigned roles route through `vlthrlab-pm@` — the subject grammar (`[Q][OI-006]` etc.) and labels carry the routing, so a shared inbox still works.

**Cross-org note:** mailboxes created under the sponsor's *second* AgentMail account are a different `organization_id` — that org's master key must mint its own inbox-scoped keys; this org's key cannot. Protocol is identical either way.

**Secrets rule:** mailboxes carry *references* to secrets ("Paystack live keys provisioned — stored in vault"), never secret values. This is a safety invariant (SKILLS/04 §3).

---

## 2. Message Types & Subject Grammar

Every message has a type encoded in the subject — so threads self-organize and agents can filter on rule alone:

```
[TYPE][ENTITY-ID] Free-text summary
```

| Type | Used for | Example |
|---|---|---|
| `Q` | Question to a domain owner | `[Q][OI-002] Manual payment-proof fallback needed?` |
| `D` | Decision record (proposed/accepted/rejected/reopened) | `[D][D-014] Accept UIOS message envelope as wire format` |
| `H` | Handoff packet (deliverable complete → downstream) | `[H][SCHEMA] ERD v1 ready for backend contract` |
| `R` | Review request / review result | `[R][API-v0.2] QA veto: missing idempotency test` |
| `B` | Blocked notice (agent is stuck) | `[B][D-003] Backend blocked awaiting seat-hold reconvene` |
| `E` | Escalation to sponsor via PM | `[E][OI-001] Conflicting respondents not reconvening` |
| `M` | Minutes/announcement to `all@` | `[M][WEEKLY] Gate 0 released; schema phase open` |
| `C` | Context sync (capsule refresh, no action needed) | `[C][PM-LOG] Open issues now OI-006..OI-009` |

**Threading rule:** the entity ID IS the thread. An open issue's entire deliberation lives in one thread; when it closes, PM sends a final `[D]` or resolution message and the thread is archived. Replies must keep the original `In-Reply-To`/`References` headers — never fork a thread for the same entity.

---

## 3. Canonical Message Envelope (body format)

The UAIE standard envelope, adapted — this is the *first thing* in every message body, as fenced YAML, so agents can parse it deterministically and humans can still read it:

```yaml
message_id:    msg_01JQR4…        # UUIDv7 — unique per message
correlation_id: oi-006            # the thread entity (issue/decision/artifact ID)
type:          Q                  # subject grammar type
from:          security@…
to:            [backend@…]
cc:            [pm@…]             # PM is always CC'd on D, B, E types
reply_to:      msg_01JQKX…        # parent message, if a reply
timestamp:     2025-07-14T09:30:00Z
priority:      normal             # low | normal | blocking
payload:
  summary: "One-line plain-language statement of what this message needs."
  context_ref: "PM-DECISION-LOG-AND-ROADMAP.md#OI-006"   # where canonical context lives
  action_required: true
  gate_impact: "blocks rate-limit design start"
metadata:
  artifact_links: []
  deadline: null
```

**Rules:**
- `correlation_id` is mandatory — a message with no governing entity is either noise (don't send) or a new OI (open it first, then mail).
- `context_ref` points at the canonical doc, so the *system of record* stays the docs, not the mailbox. Mail is transport, not storage.
- `blocking` priority is reserved for true gates; false-positive `blocking` is itself an audit-worthy pattern (rate limiting applies to agents too — see §3.7 of Meeting Minutes; contributor quotas are real here: agents that spam `all@` or send unactionable broadcast noise consume every other agent's context budget).
- Human-readable prose may follow the YAML block — the liaison and sponsor never need to read the envelope to understand the message.

---

## 4. The Usage Workflow — end to end

```
1. ONBOARD   → agent joins: reads sources_of_truth in order
               (CANONICAL-PROJECT-LIFECYCLE.yaml §sources_of_truth),
               joins mailbox, sends no mail until context-complete.
               [Index.txt's rule: "never modify from a single document alone"]

2. WORK      → agent produces artifact locally; questions go out as [Q]
               scoped to the ONE owner who can answer (not broadcast)

3. BLOCK     → if a needed input doesn't exist: [B] to PM, who either
               resolves, assigns an OI, or escalates [E] to sponsor

4. DECIDE    → answers return; proposing agent issues [D] with
               recommended resolution; owner accepts/rejects in-thread;
               PM logs accepted D in the canonical register

5. HANDOFF   → completed artifact goes downstream as [H] with the full
               context capsule (Master Prompt §15) appended — the
               receiving agent must NOT have to reconstruct reasoning

6. REVIEW    → QA/security pull review copies via [R]; veto = reopen
               the [D] or return the [H] with tagged ponytail findings

7. SYNC      → PM sends [C] digests — open-issue deltas, gate status —
               so agents stay aligned WITHOUT re-reading everything
```

**The handoff packet is the load-bearing step.** Per the master prompt, `[H]` messages carry the full context capsule; everything else can be terse.

---

## 5. Escalation Ladder

```
Level 1: agent↔agent [Q] thread          — 48h working SLA
Level 2: no response / disagreement      → [B] to PM → PM arbitrates or splits into OI
Level 3: OI requires authority PM lacks  → [E] to sponsor (sponsor mailbox is quiet by design —
                                          only Level 3 traffic reaches it)
```

This ladder is deliberate and has a UIOS ancestor: IOE's failure pipeline (`Detection → Retry → Alternative Path → Escalation → Audit`). A stalemate between domain owners is a *workflow failure*, and it gets the same treatment — a named retry path, then escalation, then it lands in the log.

---

## 6. Retention & Audit

- Every message is an event; the mailbox archive is the episodic record (MME pattern).
- **Local mirror:** each agent maintains `DOCS/MAIL/<ROLE>/` — one doc per thread (`THREAD-<id>-<slug>.md`), replies appended, fresh mail = new doc. See `DOCS/MAIL/README.md`.
- PM mirrors *accepted* decisions into the canonical log — mail proposes, the log disposes. Mail threads can diverge, ramble, fork; the register cannot.
- The local mirror is the durable archive: a new agent in month 4 can reconstruct *why* D-009 chose forced-install, not just that it did (XTE provenance, applied to our own process).

---

## 7. Implementation — AgentMail specifics (verified live)

**Service: AgentMail** (agentmail.to). Org `edcd2158-…`, free tier. Env vars in `TCN/.env.local`: `AGENTMAIL_API` (org master key — sponsor/PM only, never distributed) and `AGENTMAIL_PM_SCOPED` (PM's inbox-scoped key).

### Provisioning a new agent (repeatable recipe)

```bash
# 1. Create the inbox (org master key only)
POST /v0/inboxes  { "username": "vlthr-backend", "display_name": "BACKEND ENGINEER — TCN",
                    "metadata": {"project":"tcn-ikd-transport","role":"backend","protocol":"tcn-mail-v1"} }

# 2. Mint its scoped key — whitelist only what the agent needs
POST /v0/inboxes/{inbox}/api-keys  { "name": "{role}-inbox-scoped",
  "permissions": { "message_read":true, "message_send":true, "message_reply":true,
                   "message_update":true, "draft_*":true, "webhook_read":true,
                   "webhook_create":true, "metrics_read":true } }
# Deliberately DENIED for every agent: inbox_* admin, api_key_*, message_delete,
# domain_*, pod_*, list_entry_* — no agent can self-escalate or widen its key.
```

Verified behavior: scoped key reads its own inbox (200) and gets `403 missing_permission` on any other inbox or org endpoint. Child keys can never exceed the parent's permissions — isolation is enforced server-side.

### Operating rules under the free tier

- **3,000 emails/mo, 100/day** — the subject-grammar discipline isn't just hygiene, it's quota protection. `blocking` priority reserved for true gates.
- **Never poll.** Use webhooks or WebSockets for inbound (`message.received` events); tight-loop polling is the #1 documented cause of `429`s. On `429`, respect `Retry-After` (usually 1s) and back off.
- **Labels are free-form** — apply at send or PATCH later. Convention: `[type-letter, entity-id, status-*]` e.g. `["q","oi-006","status-open"]`.
- **Paused inboxes drop mail silently** — never pause a live role inbox; sender isn't notified and mail is not recovered on resume.
- **Threads span inboxes** — a reply addressed to multiple agents lands in each inbox as the same logical conversation; the `correlation_id` in the YAML envelope is what actually ties it to the canonical entity.
- Inbound mail from outside AgentMail works normally — sponsor/liaison can email any agent inbox from Gmail/etc.

### Free-tier ceiling (ponytail ceiling comment, project-scale)

`ponytail: free tier caps at 3 inboxes + 100 sends/day. Upgrade path: Developer plan ($20/mo, 10 inboxes) or pay-as-you-go +$2/inbox. Trigger: when >3 agents run concurrently or daily mail exceeds ~80.`

---

## CONTEXT CAPSULE

**PRODUCT:** TCN Ikorodu Transport Booking & Management App
**MY ROLE:** Product Manager / Product Owner
**MY DOMAIN:** Agent collaboration infrastructure
**DECISIONS LOCKED:** Email as agent transport (pending sponsor's service pick); UAIE envelope as body format; entity-ID threading; PM-register as system of record; escalation ladder L1→L2→L3
**NEW REQUIREMENTS:** mailbox per role; `[H]` must carry full context capsule; `blocking` priority reserved for true gates
**CONSTRAINTS:** no secrets in mail, ever; service-agnostic protocol
**RISKS:** agent mailbox spam / context-budget burn (mitigated by §3.7 contributor quota concept — yes, our own rate-limiting applies to us)
**DEPENDENCIES:** sponsor selects mail service; each agent role gets a live mailbox
**CHANGES REQUIRED:** none — extends, doesn't modify, existing docs
**DELIVERABLE:** this document
**DOWNSTREAM AGENT:** whoever provisions mail (likely DevOps + Integrations)
**DOWNSTREAM ACTION:** provision 12 mailboxes, configure inbound webhook → agent dispatch, send bootstrap message
**OPEN ISSUES:** service selection (AgentMail vs Mailgun vs SES vs Resend) — needs a [D] once sponsor prices them
**STATUS:** READY
