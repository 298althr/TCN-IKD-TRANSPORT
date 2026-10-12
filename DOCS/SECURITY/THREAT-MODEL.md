# Threat Model

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Security & Compliance Lead
**Decisions:** D-023, D-024, D-025 · **Open issues:** OI-003, OI-012, OI-038, OI-039

Method: assets, actors, then STRIDE per trust boundary. Each threat maps to a control and to a test. Residual risk is recorded where a control is not yet decided.

---

## 1. Assets

| Asset | Why it matters | Sensitivity |
|---|---|---|
| Member identity and phone numbers | Sign-in, contact on travel day | Personal |
| Membership status | Determines who may book | Personal, governance |
| Bookings, riders, manifests | Who is on which bus | Personal |
| Payment references and amounts | Money reconciliation | Financial |
| Guest records and invite tokens | Access to bookings | Personal, access |
| Support reports | May contain personal detail typed by members | Personal |
| Audit trail | Evidence and accountability | Integrity |
| Provider and service secrets | Money and data access | Secret |

## 2. Actors

Member, guest, marshal, admin, anonymous visitor, payment provider (webhooks), outside attacker, curious insider (a member looking up another member), careless insider (admin sharing login), platform vendor.

## 3. Trust boundaries

1. Browser to web server (Vercel).
2. Web server or browser to database (Supabase, through RLS and functions).
3. Provider to Edge Function (webhooks).
4. Edge Function to provider (outbound calls).
5. Application to push, email and SMS vendors.
6. Staff devices to the app (shared or lost devices).

---

## 4. Threats and controls

| # | Boundary | Threat (STRIDE) | Control | Test |
|---|---|---|---|---|
| T1 | 1, 2 | Member reads another member's booking (Information disclosure, IDOR) | RLS by `profile_id`; views filtered; no table grants to clients | pgTAP: cross-member read denied |
| T2 | 1, 2 | Marshal reads manifest of another bus (Information disclosure) | RLS by assignment; route scoping | pgTAP and E2E |
| T3 | 1, 2 | Client sets own role or membership (Elevation) | Roles in `user_roles`; membership changed only by approval function; no writes to user metadata | pgTAP: direct update denied |
| T4 | 2 | Client writes a booking state directly (Tampering) | No write grants; functions only; illegal transitions rejected in DB | pgTAP: direct update denied, illegal transition rejected |
| T5 | 2 | Two members take the last seat (Tampering, race) | Row lock on assignment; ledger; idempotency | k6 concurrency test; pgTAP |
| T6 | 3 | Forged payment webhook (Spoofing) | Signature verification on raw body; reject 401 | Contract test with bad signature |
| T7 | 3 | Replayed webhook marks payment twice (Repudiation, Tampering) | Unique provider event ID; idempotent apply | Duplicate delivery test |
| T8 | 1, 2 | Client sets amount to a lower price (Tampering) | Amount computed on server from booking and programme | Test: client amount ignored |
| T9 | 1 | Return URL used to confirm a payment (Spoofing) | Return page never changes state | E2E: return without payment stays pending |
| T10 | 1 | Invite token guessed (Spoofing, access) | 128-bit random tokens; hashed storage; expiry; use limit; rate limit | Unit test on token shape; rate limit test |
| T11 | 1 | OTP brute force or SMS pumping (Denial, cost) | Provider OTP limits; per-phone and per-IP cooldown | Config check; alert on spike |
| T12 | 1 | Account enumeration via register match (Information disclosure) | Generic responses; no match result shown to applicant | Review of response bodies |
| T13 | 2 | Support report exposes personal text to other members (Information disclosure) | Reporter sees own reports; internal notes hidden | pgTAP and E2E |
| T14 | 1 | Admin account compromise (Elevation, Tampering) | TOTP required; short sessions; audit of refunds and corrections; second admin review | Config check; audit review (OI-013) |
| T15 | 2 | Admin silently edits history (Repudiation) | Append-only audit; corrections by supersession with reason | pgTAP: audit update denied |
| T16 | Any | Secret leaks to browser or logs (Information disclosure) | Server-only keys; log redaction; no raw bodies logged; reviews | Build check for `NEXT_PUBLIC_` names; log scan |
| T17 | 5 | Notification leaks payment or personal detail (Information disclosure) | Content rules; template review | Notification test (no forbidden content) |
| T18 | 5 | Push endpoint abuse (Denial) | Revoke on sign-out; rate limit on subscription writes | Unit test |
| T19 | Any | Dependency compromise (Tampering) | Lockfile; automated dependency alerts; minimal dependencies (ponytail) | CI audit step |
| T20 | 6 | Lost shared marshal phone shows manifest (Information disclosure) | Short sessions; sign-out on inactivity; manifest shows only assignment | Manual test on duty |
| T21 | 2 | Excess retention of personal data (Compliance) | Retention table; pseudonymisation after window | OI-038 review |
| T22 | 2 | Backup lost or unrestorable (Availability) | Scheduled off-platform dump (no automatic backups on Supabase Free, RISK-010); restore drill; RISK-001 | Quarterly restore drill |
| T23 | 2 | Supabase project paused on a quiet week (Availability) | Accepted on Free (D-027, RISK-009); activity monitoring; restore runbook (DEVOPS §8); revisit at pilot gate | Monitoring of project status |
| T24 | Any | Cross-environment data leak (Information disclosure) | Separate projects and secrets; no production export to staging | Review at each release |

---

## 5. Data protection (summary; legal review required)

- **Lawful basis and notice.** Members should be told what is collected and why at sign-up. The notice wording is an OI-038 item for counsel.
- **Minimum data.** Name, phone, membership reference, booking, attendance, payment references. No identity documents, no card or bank data, no location tracking.
- **Processors.** Supabase, Vercel, the payment providers, push and email vendors, and any SMS vendor are processors. Their data processing terms must be accepted and recorded.
- **Rights.** Access and correction requests are handled through the admin (correction records). Erasure requests are handled under the pseudonymisation rule (DATA-MODEL §3).
- **Breach response.** Detect (alerts), contain (rotate keys, disable accounts), assess (what data, how many people), notify (regulator and affected members as the law requires, counsel to confirm timing), record (incident review). Responsibility: Security & Compliance Lead, with the sponsor.
- **Transfers.** Data may be stored in a region outside Nigeria (Supabase region per OI-032). Counsel to confirm transfer obligations under the Nigeria Data Protection Act 2023.

---

## 6. Access control matrix

See `AUTH/AUTH-DESIGN.md` §6. Any change there is a security change and needs review.

---

## 7. Security acceptance for pilot

- [ ] All T1 to T16 tests pass in CI.
- [ ] Penetration-style review of the member and admin flows completed by a second person (not the author).
- [ ] Provider keys in secret stores only; no `NEXT_PUBLIC_` secrets (scan).
- [ ] MFA enabled for every admin account (OI-039).
- [ ] Restore drill passed (T22).
- [ ] Data protection review recorded (OI-038).
- [ ] Incident contact list and breach steps shared with admins.

---

## 8. Residual risks (recorded, not hidden)

| Risk | Why it remains | Owner |
|---|---|---|
| Insider misuse by a trusted admin | Controls reduce but cannot remove trust; audit and second review are the mitigation | Sponsor |
| Shared device left unlocked on duty | Physical; mitigated by short sessions only | Marshal lead |
| Provider outage | External; mitigated by reconciliation and manual fallback | Integrations |
| Mis-entered personal data | Human; mitigated by corrections and member self-check | Admin |
