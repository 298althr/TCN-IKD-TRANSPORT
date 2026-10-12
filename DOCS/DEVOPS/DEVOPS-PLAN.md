# DevOps Plan

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** DevOps/Infra Engineer
**Decisions:** D-010, D-019, D-020, D-024 · **Open issues:** OI-005, OI-030, OI-032, OI-033, OI-035

---

## 1. Environments

| Environment | Purpose | Frontend | Backend | Data | Cost posture |
|---|---|---|---|---|---|
| Local | Development and fast tests | `next dev` | Supabase CLI local stack (Docker) | Seed only | Free |
| Preview | Per-pull-request review and Playwright run | Vercel preview deployment per branch | Shared staging project, or a Supabase branch (paid per branch hour, verify) | Non-personal seed | Vercel Pro |
| Staging | Pilot rehearsal, UAT, release candidate | Vercel staging domain | Separate Supabase project | Synthetic and test data only | Supabase Pro recommended (Free pauses) |
| Production | Church use | Custom domain on Vercel Pro | Supabase Free project (D-027), region per OI-032 | Real personal data | Vercel Pro + Supabase Free (sponsor decision; revisit at pilot gate) |

**Staging and production on Supabase Free.** Accepted by sponsor decision (D-027). A quiet week can pause a project, which then has to be restored by hand (RISK-009). Pro is recommended at the pilot gate, and the choice is revisited there (OI-030).

**No shared data between staging and production.** Staging never receives a production export. Test data is generated.

---

## 2. Vendor terms and costs (checked 2026-10-12)

Re-check these before every budget decision. Terms change.

| Vendor and plan | Monthly price | Terms relevant to this app | Limits relevant to this app |
|---|---|---|---|
| Vercel Hobby | $0 | "Hobby teams are restricted to non-commercial personal use only." Commercial use includes "requesting or processing payment from visitors of the site" | Cron jobs once per day only; not suitable for reconciliation |
| Vercel Pro | $20 (includes $20 credit) | Commercial use permitted | Cron every minute; region `cpt1` (Cape Town) available; regional pricing applies |
| Supabase Free | $0 | Paused after one week of low activity. Two active free projects per organisation | 500 MB database; no automatic backups |
| Supabase Pro | From $25 (includes 8 GB disk and $10 compute credit; Micro compute database-only about $25 total) | Projects are not paused for inactivity | Daily backups kept 7 days; point-in-time recovery an add-on (about $100/month per 7 days retention, verify) |
| Supabase regions | n/a | No South African region appeared in the region list at check time | Choose lowest-latency region after measurement (OI-032) |
| OPay, Paystack | Transaction fees only (verify) | Hosted checkout; fees per transaction | See PAYMENTS |
| SMS (Termii, Africa's Talking) | Pay-as-you-go (verify) | Phase 2 or pilot decision (OI-031) | Per-message cost drives budget |
| Email transactional provider | Free tier to verify | Choose at build | Volume limits |
| Domain | About $10 to $15 per year (PRD §8.2) | | |

**Budget reading.** A terms-compliant production setup costs roughly $45 per month before SMS, email and domain (Vercel Pro about $20, Supabase Pro about $25). A $0 setup is only possible with the frontend on a free host whose terms permit this use (to verify) and with Supabase Free accepting pauses and manual backups (OI-030 option C). Sponsor decision (Q-002, D-027): Vercel Pro + Supabase Free, about $20 per month before SMS, email and domain. This reopens the cost assumption in C-001 and D-010 for the frontend.

---

## 3. Pipeline

1. Developer opens a pull request.
2. CI: install, lint, typecheck, unit tests (Vitest), SQL tests (pgTAP against local Supabase), build.
3. Vercel creates a preview deployment; Playwright runs journeys against it using the staging project (no production data).
4. axe accessibility checks on changed routes.
5. Review and merge to main. Merge is blocked unless checks pass (D-019 QA release gate).
6. Migrations apply to staging on merge (Supabase CLI), then to production when the release is approved.
7. Production deployment is a Vercel promotion of a staging-tested build.
8. Edge Functions deploy with the same pipeline, after their contract tests pass.

**Release approval.** Production release requires the QA sign-off recorded in the release record (D-019), and for money-affecting changes a sandbox run of the payment checklist (PAYMENTS/PROVIDER-CONTRACTS §3).

**Rollback.** Frontend: promote the previous Vercel deployment. Database: forward migration only; never rewrite history. Edge Functions: redeploy previous version. A destructive migration needs a written plan and sponsor confirmation.

---

## 4. Configuration and secrets

- Values live in Vercel environment settings (per environment), Supabase project secrets and Edge Function secrets, and the team's password manager. Names only in the repository (`ENVIRONMENT-VARIABLES.md`).
- The Supabase service role key is server-only and never reaches the browser. Public anon key is safe for the browser only with RLS in place.
- Provider keys (Paystack, OPay) are separate per environment: sandbox keys in staging, live keys in production only.
- Rotation: on any suspected exposure, and on each change of staff with access.

---

## 5. Backups (RISK-001, OI-005)

| Option | Cost | Recovery point | Status |
|---|---|---|---|
| Supabase Pro daily backups (7 days) | Included in Pro | Up to 24 hours | Recommended for production |
| Point-in-time recovery | About $100/month add-on (verify) | Minutes | Phase 2 review after launch data |
| Scheduled `pg_dump` to encrypted off-platform storage | Free storage tier (verify) | Interval of the job | **Required now:** production runs on Supabase Free (D-027). Set up before any real data is entered |

**Restore drill.** Before pilot, restore the latest backup to a scratch project and count bookings, payments and riders against the source. Repeat quarterly (INS-2 in the constitution). A backup that has never been restored is not a backup.

---

## 6. Monitoring

| Signal | Tool (proposed, verify tier) | Alert |
|---|---|---|
| Frontend errors | Error tracking with a free tier (verify) | Spike after release |
| Function and database logs | Supabase logs (retention per plan) | Failed webhooks, dead outbox rows, failed transitions |
| Uptime | External free uptime check on the public URL and `/api/health` | Two failed checks |
| Payments | Daily reconciliation summary (PAYMENTS §5) | Any difference |
| Travel day | On-call admin phone, incident queue | Any S1 |

Dashboards are read-only views. Alerts go to the admin on duty and the PM.

---

## 7. Domain and email

- Domain registered by the church (owner recorded). DNS managed by the church's registrar account, not a personal one.
- Email sender domain verified for transactional mail (SPF, DKIM, DMARC) to reduce spam placement.

---

## 8. Runbooks (to write before pilot)

- Payment webhook failing: check signature secret, provider status, replay from provider dashboard.
- Outbox backing up: check dispatcher schedule, provider status, dead-letter count.
- Manifest will not load on duty day: use printed manifest (R-007), log an S1 incident, call the admin.
- Admin locked out: second admin resets MFA (OI-014).
- Supabase project paused: restore from the paused-project screen; verify data; open an S1.
- Provider secret exposed: rotate at the provider, update function secret, audit the window.

---

## 9. Cost controls

- Budget alerts on Vercel and Supabase at 50 and 80 percent of the monthly figure.
- Egress and image sizes kept small (OPTIMISATION §4).
- Staging databases are reset to seed data monthly, to avoid growing cost.
- Preview deployments are deleted when a branch merges.
