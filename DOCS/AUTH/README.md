# AUTH

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Security & Compliance Lead with Backend
**Governed by:** AUTH-1 (membership gate), AUTH-3 and AUTH-4 (RBAC), D-007 (blocked), D-023 · **Open issues:** D-007/AUTH-2 (OI-001 policy track), OI-015, OI-028, OI-039, Q-004

## What this folder is for

How people prove who they are, how the church's membership gate is applied, how roles are granted, and how staff accounts are protected. The membership policy (who counts as a member) is partly decided and partly blocked; this folder marks which parts are which.

## Files

| File | Contents |
|---|---|
| `AUTH-DESIGN.md` | Sign-in methods, membership gate, roles, sessions, MFA, invitations, recovery, rate limits |

## Governing rules

- Identity (who you are) comes from Supabase Auth. Membership (whether the church recognises you) comes from the approval record. These are separate facts.
- Google sign-in proves identity, not membership (meeting minutes 2026-10-09).
- Roles are stored in a server-controlled table, never in user-editable profile data.

## Open issues

D-007 and AUTH-2 are blocked on the reconvene (OI-001). OI-015 covers who keeps the register current. OI-039 covers staff MFA. Q-004 is answered (D-029).
