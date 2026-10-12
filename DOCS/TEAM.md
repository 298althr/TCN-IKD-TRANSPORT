# TCN Ikorodu Transport App — Project Team

Treats the project as active from here. Lists who needs to be in the room, what they own, and what they need to go get answered before their part can start. Kept brief — full context lives in `PRD_TCN_Ikorodu_Transport_App.md` and `DECISION-LOGS/MEETING-MINUTES-02-Systems-Scope.md`.

At this scale, several of these roles can be one person wearing two hats (e.g. Backend + Database, or Frontend + UI/UX). Listed separately here because the *responsibility* is distinct, not because 9 hires are required.

--

## 1. Product Manager / Product Owner

**Owns:** scope, prioritization, and the sign-off chain between church leadership and the build team. Already running — ran both meetings to date.

**Picks up:** PRD, BRD, both Meeting Minutes docs.

**Must get answered before handoff:**
- Final call on the three conflicting Phase 1 decisions (stack, seat-hold strategy, duplicate-signup handling).
- Who owns the membership-gate decision, and on what timeline.
- "Refund before day of event" — exact cutoff (midnight before, or service start time)?

---

## 2. Backend / Systems Engineer

**Owns:** booking lifecycle state machine, capacity engine, payment + refund integration, scheduler, API layer.

**Picks up:** Meeting Minutes 02 §3.1 (Payment), §3.5 (Database), §3.6 (Admin); PRD §4–5 decision tree.

**Must get answered before building:**
- Stack decision (02) — cannot start until resolved.
- Seat-hold strategy (03) — changes the booking-creation code path directly.
- Paystack merchant credentials and sandbox access.
- Confirmation of the `BookingGroup` entity for bulk payments (net-new, not in original BRD).

---

## 3. Database / Data Architect

**Owns:** schema design (Programme, Route, Bus, BookingGroup, Payment, Refund, Marshal, AuditLog) and migrations.

**Picks up:** Meeting Minutes 02 §3.5; Decision 01 (route↔bus model).

**Must get answered before schema lock:**
- Is Bus modeled as independent of Route (via join table) or nested under it?
- Per-programme capacity snapshot confirmed, or live-on-route acceptable?
- Mutable vs. immutable entity list (§4) — needed before constraints are written, not after.

---

## 4. Frontend Engineer

**Owns:** the three dashboards — Member, Admin, Marshal — sharing one data layer.

**Picks up:** Meeting Minutes 02 §2 (dashboard table); BRD §8–14; presentation deck mockups.

**Must get answered before building:**
- Framework choice (downstream of the stack decision).
- Low-end device / slow-connection requirement — how far does "graceful degradation" need to go?
- Does the bulk-booking flow (host selecting beneficiaries) need a dedicated UI pattern, or is it an extension of single booking?

---

## 5. DevOps / Infrastructure Engineer

**Owns:** hosting, CI/CD, environments, the scheduler/cron job runner, backups, cost monitoring.

**Picks up:** Meeting Minutes 02 §5 (cPanel answer); PRD §7.1/7.5 (environment & hosting decisions).

**Must get answered before provisioning:**
- Is there a pre-paid cPanel/hosting plan already in place that needs to be used, or is hosting a clean choice?
- Who approves recurring spend (Paystack fees, SMS/WhatsApp API, hosting tier upgrades)?
- Backup/retention expectation for payment and booking records.

---

## 6. Security & Compliance Lead

**Owns:** auth hardening, RBAC, audit-trail design, PCI scope reduction, data privacy for the membership database.

**Picks up:** Meeting Minutes 02 §3.3 (Authentication); §4 (security, audit, roles, immutability — all open).

**Must get answered before design is final:**
- What's the actual privacy bar for member data — self-imposed, or is there a real compliance requirement (e.g. NDPR)?
- Who is allowed to view the audit log — Admin only, or also church leadership?
- Final mutable/immutable entity list (shared deliverable with Database Architect).

---

## 7. Integrations Specialist — Payments & Notifications

**Owns:** vendor setup for Paystack, and whichever notification channel is chosen; webhook reconciliation design.

**Picks up:** Meeting Minutes 02 §3.1 (Payment), §3.2 (Notifications — explicitly unresolved).

**Must get answered before integration work starts:**
- Can the church register a Paystack merchant account — under what registered entity/KYC?
- Is a WhatsApp Business number available, or does a new one need provisioning?
- Realistic notification budget and the timeline to revisit the "no budget yet" constraint.

---

## 8. QA / Test Engineer

**Owns:** test plans for concurrency (last-seat race), payment webhook retries, refund-window edge cases, bulk-booking receipt correctness, Admin/Marshal dashboard parity.

**Picks up:** PRD §6 (edge cases); Meeting Minutes 02 action items.

**Must get answered before test planning:**
- Which real Marshals/Admins are available for UAT before launch?
- Is a Paystack test/sandbox account set up separately from production?
- Which upcoming programme is the pilot/first live run?

---

## 9. UI/UX Designer

**Owns:** booking flow, dashboard layouts, receipt design (host + beneficiary shown correctly), accessibility and low-bandwidth design.

**Picks up:** BRD journey maps; PRD Journey C; presentation deck mockups.

**Must get answered before design work starts:**
- Does the receipt need a printable/shareable format (PDF/image) to match the congregation's WhatsApp-sharing habit?
- What's the visual identity to apply — church branding, logo, color palette?

---

## 10. Church Transport Department Liaison (Business Stakeholder)

**Owns:** domain authority — the actual day-to-day Marshal/Admin operational knowledge; approves business rules (refund cutoff, membership roll, per-bus capacity practice).

**Picks up:** everything — this role is the source of truth behind Meeting Minutes 02's Appendix ("current manual process").

**Must get answered before rules are finalized:**
- Who maintains the membership roll today, and will they keep doing it once the app exists?
- Has a refund ever actually been issued under the current manual process — what happened?
- How many buses/routes typically run on a normal Sunday vs. a special programme — is the multi-bus-per-route case common or rare?
