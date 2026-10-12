# ROADMAP

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Product Manager
**Governed by:** `CANONICAL-PROJECT-LIFECYCLE.yaml` (phases and gates), D-011 (soft timeline), D-012 (respondents decide) · **Open issues:** OI-001 (Gate 0), OI-030, OI-036, OI-038, OI-040

## What this folder is for

The path from the PRD to a running, tested, deployed product: what happens in what order, what each phase must produce, and what gate each phase must pass. No calendar dates are set here. Duration depends on resourcing, which the sponsor controls (PRD §8.3).

## Files

| File | Contents |
|---|---|
| `IMPLEMENTATION-ROADMAP.md` | Phases from PRD to deployment, testing and optimisation, with deliverables, owners, gates and exit criteria |
| `DEVELOPMENT-STRATEGY.md` | Sign-off gate, documentation freeze, PRD v1.0, frontend-first sequence (F0 to F5), then backend (B0 to B5), integration and risks. Governs the order of the roadmap (D-046) |

## Governing rules

- A phase does not start until the gate before it has passed.
- Each phase produces an artifact another role can use (`AGENTS.md` Part I §5).
- Scope changes go through the decision log, not the roadmap alone.

## Open issues

OI-001 (Gate 0 for all engineering), OI-030 (production hosting), OI-036 (refund rules before refund build), OI-038 (data protection before pilot), OI-040 (pilot scope).
