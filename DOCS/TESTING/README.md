# TESTING

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** QA/Test Engineer
**Governed by:** D-019 (QA release gate), D-020 (staging model), `SKILLS/03-REVIEW-PROTOCOL.md` · **Open issues:** OI-035 (tooling), OI-001 (D-003 invariant)

## What this folder is for

How the product is proven to work: the test layers, the tools, the edge-case list from the PRD converted into test cases, the release gate, and the user acceptance plan for the pilot.

## Files

| File | Contents |
|---|---|
| `TEST-STRATEGY.md` | Test layers, tools, PRD edge cases mapped to tests, release gate, UAT plan |
| `ACCEPTANCE-CRITERIA.md` | Given / When / Then criteria for members, guests, marshals, administrators and cross-cutting system behaviour. Level P (before the pilot) or L (after). The release test of "done" |

## Governing rules

- Every rule in a state machine has a test that tries to break it (illegal transition, wrong actor, missing reason).
- Money and seat-capacity tests run in CI on every change, not only before launch.
- No test uses real personal data.

## Open issues

OI-035 (TypeScript tooling accepted instead of pytest), OI-001 (hold mechanism invariant), OI-040 (pilot scope for UAT).
