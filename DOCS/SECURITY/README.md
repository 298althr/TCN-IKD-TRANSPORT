# SECURITY

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Security & Compliance Lead
**Governed by:** `SKILLS/04-SAFETY-INVARIANTS.md`, D-023, AUTH folder, AUTH-3, AUTH-4 · **Open issues:** OI-003, OI-007 (policy part), OI-012, OI-038, OI-039

## What this folder is for

What could go wrong, what the system does to prevent it, and how we would know. The threat model, the controls that map to each threat, the data-protection position, and the response plan when something happens.

## Files

| File | Contents |
|---|---|
| `THREAT-MODEL.md` | Assets, actors, threats by category, controls, tests, data protection, breach response |

## Governing rules

- Security is designed in, not tested in at the end (constitution, cooperative engineering model).
- No client is trusted for authority. Database rules and provider signatures are the enforcement points.
- Least privilege for every role and every service.

## Open issues

OI-038 (data protection review, blocking pilot), OI-039 (staff MFA), OI-012 (correction authority), OI-003 (mutability list, first pass in DATA-MODEL §3).
