# STATE-MACHINES

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Product Manager (author), Backend and Database (validate)
**Governed by:** D-008, D-025, D-023, D-005 · **Open issues:** OI-027 (this folder answers it), OI-012, OI-019, OI-022

## What this folder is for

The single canonical table of states, allowed transitions, who may trigger each one, and what must be recorded. OI-027 found that engineers would otherwise invent their own transitions, which is the shadow-mutability failure (RISK-008). Prototype labels are not the source; this folder is.

## Files

| File | Contents |
|---|---|
| `STATE-MACHINES.md` | Every state machine, with transitions, actors, guards, side effects and audit requirements |

## Conventions

- Transitions not listed are **illegal** and must be rejected by the database function.
- "Actor" is the role that may trigger. "System" means a scheduled or webhook call under a server role.
- Every transition writes a transition row with actor, role, prior state, new state, reason (where listed as required), and correlation ID.

## Open issues

OI-012 (corrections, which use supersession rather than transitions), OI-019 (bus cancellation details), OI-022 (cancellation cutoff value), OI-036 (refund amounts).
