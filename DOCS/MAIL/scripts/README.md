# MAIL/scripts

**Status:** Tooling · **Date:** 2026-10-12 · **Owner:** Product Manager

## What this folder is for

Scripts and data used to onboard agent mailboxes and record the onboarding threads.

## Files

| File | Role |
|---|---|
| `onboard_agents.py` | Onboarding script for agent mailboxes |
| `onboard_roster.json` | Roster of roles and mailboxes the script reads |
| `onboard_threads.log` | Log of onboarding thread creation |
| `mail.mjs` | Mail service: writes new threads, appends replies, rebuilds `../INDEX.md`. Local only; no sending |

## Rules

- Keys are read from the environment at run time (see `AGENT-COMMUNICATIONS-WORKFLOW.md` for the provisioning recipe). Never write a key into these files.
- Check `onboard_threads.log` before re-running, so that a mailbox is not onboarded twice.

## mail.mjs usage

```
node DOCS/MAIL/scripts/mail.mjs new --from PM --to LIAISON --type Q --entity POLICY-REGISTER --summary "Short summary" --body FILE.md --ref PATH
node DOCS/MAIL/scripts/mail.mjs append --file DOCS/MAIL/PM/THREAD-xxxx.md --from PM --to LIAISON --type C --entity ENTITY --summary "Short summary" --body FILE.md
node DOCS/MAIL/scripts/mail.mjs index
```

Types: Q, D, H, R, B, E, M, C (see `AGENT-COMMUNICATIONS-WORKFLOW.md` §2). `--to` takes several roles separated by commas. `--priority blocking` only for true gates. Bodies are read from a file so that no text is pasted into the command line.
