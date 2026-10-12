# NOTIFICATIONS

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** UI/UX Designer (install and permission flow) with Backend (triggers and dispatch)
**Governed by:** D-009 (Web Push and email, forced install), D-010 ($0 posture; SMS and WhatsApp Phase 2), PRD §4.2 item 4 · **Open issues:** OI-004, OI-031, OI-037

## What this folder is for

Which messages the system sends, to whom, through which channel, when, and how failed sends are retried or escalated. Marshal alerts are operationally load-bearing (PRD §5), so delivery is designed, not assumed.

## Files

| File | Contents |
|---|---|
| `NOTIFICATIONS-DESIGN.md` | Channel matrix, event catalogue, outbox behaviour, quiet hours, content rules, permission flow |

## Governing rules

- Every message is produced by a state change in the same transaction (outbox). No message is sent from a UI event alone.
- Messages never contain payment details, passwords, one-time codes, or more personal data than needed.
- Marshals receive only alerts for their assigned assignment (route scoping, PRD §4.3).

## Open issues

OI-031 (SMS vendor and cost; channel decided by D-028), OI-037 (WhatsApp deep links vs Business API), OI-004 (install gate affects push reach).
