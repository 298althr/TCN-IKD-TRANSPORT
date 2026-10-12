# DEVOPS

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** DevOps/Infra Engineer
**Governed by:** D-010 ($0 posture, to be reconciled with terms), D-019 (QA release gate), D-020 (staging model), RISK-001 (backups) · **Open issues:** OI-005, OI-007 (technical part), OI-029, OI-030, OI-032

## What this folder is for

How the app is hosted, deployed, configured, backed up and monitored. It records vendor terms and costs, environment layout, the release pipeline, and where secrets live. It is the only place that states what each environment costs.

## Files

| File | Contents |
|---|---|
| `DEVOPS-PLAN.md` | Environments, pipeline, backups, monitoring, vendor terms and costs (section 2), region, runbooks |
| `ENVIRONMENT-VARIABLES.md` | Names, owners and purposes of every configuration value. No values |

## Governing rules

- No secret value is written into a file, a commit, a document, or a chat. References only.
- Production has Terms-compliant hosting (OI-030).
- Every production change is a migration or a deployment from the pipeline. No hand edits.

## Open issues

OI-030 (budget versus vendor terms; blocking production), OI-032 (region), OI-029 (where Edge Functions run), OI-005 and RISK-001 (backups).
