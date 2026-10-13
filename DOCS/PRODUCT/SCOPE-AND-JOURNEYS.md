# Scope and User Journeys

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Decisions:** D-001, D-005, D-006, D-008, D-009, D-010 (reopened for SMS, D-028), D-011, D-013, D-023, D-027, D-028, D-029, D-030, D-031, D-032, D-033 · **Open issues:** OI-018, OI-019, OI-024, OI-026, OI-028, OI-036, OI-037

---

## 1. Scope tiers

Classified by business value, operational necessity and dependency, not by build difficulty (`AGENTS.md` Part I §13).

| Tier | Capability | Basis |
|---|---|---|
| CORE | Membership-gated sign-in and registration | AUTH-1; nothing works without it |
| CORE | Programme management, including special events (admin-created) | Dept session 2026-10-09 |
| CORE | Route and bus management, several buses per route, per-bus booking toggle | D-001, D-013 |
| CORE | Booking lifecycle (held, confirmed, cancelled, expired) and manifest (awaiting, boarded, no-show, removed) | D-008, D-025 |
| CORE | Capacity engine with atomic seat reservation | PRD §4.2 item 2; QA invariant (OI-001 evidence) |
| CORE | Provider-hosted payment (Paystack, OPay candidate) with zero card storage | D-023; OI-025 for provider selection |
| CORE | Three role apps: Member, Marshal, Admin | BRD §5 |
| MVP | Bulk and group booking with named riders | D-011 |
| MVP | Refund workflow (automated via provider where supported, admin-approved otherwise) | D-006; policy OI-036 |
| MVP | Notifications: Web Push, email, in-app inbox | D-009 |
| MVP | SMS for marshal critical alerts and sign-in codes | D-028 (reopens D-010 for SMS); vendor OI-031 |
| MVP | Sign-in: phone code (members, marshals), authenticator for admins, Google added at deployment | D-029 |
| MVP | Support: report a problem (booking, payment, bug), WhatsApp and phone links to marshal and admin | Dept session 2026-10-09; intake rules OI-026 |
| MVP | Admin approval for first-time registration | Dept session 2026-10-09 |
| MVP | Printable manifest export (offline fallback) | R-007 |
| MVP | Basic audit trail (status, payment, correction log) | OI-003, R-003 |
| MVP | Role-based access control | AUTH-3, AUTH-4 |
| MVP | Automated backups with tested restore | INS-1, RISK-001 |
| MVP | Schema namespacing under `transport` | OI-008 |
| OUT OF SCOPE | Cash, POS and manual payment records | D-033 (Q-006): every payment is digital through Paystack and/or OPay. D-021 retired |
| PHASE 2 | WhatsApp Business API (automated messages) | D-010; OI-037 (deep links only at MVP) |
| PHASE 2 | Full exportable audit for leadership | OI-003 |
| PHASE 2 | Reporting beyond the operational dashboard; no-show forecasting | D-022 (six months of data first) |
| PHASE 2 | Quota tuning from real usage | RATE-2 |
| MVP | Waitlist for full buses: marshal notified, admin adds a bus, offers by push and SMS, guests before members | D-030 (Q-007) supersedes the BRD §15 deferral |
| FUTURE | Multi-tenant infrastructure | OI-008 |
| OUT OF SCOPE | Native iOS and Android store apps | D-009 (forced install is the substitute) |
| OUT OF SCOPE | Storing card or bank details in the app | D-023 |
| OUT OF SCOPE | Marshal self-release or claim pool | D-005 |
| OUT OF SCOPE | Multi-branch or multi-congregation | BRD single-congregation scope |

---

## 2. Journeys

Each journey lists the steps, the state that changes at each step, and the dashboard that sees it. Journeys are the acceptance script for the prototypes and for QA end-to-end tests.

### Journey A: First-time member (admin approval)

| # | Step | State change | Seen by |
|---|---|---|---|
| A1 | Opens app, install gate (browse-only pre-install, OI-004) | none | Member |
| A2 | Signs up as first-timer; gives name, phone, "who invited you" | application `submitted` | Member, Admin |
| A3 | Sees "Registration under review", not membership | membership `pending` | Member |
| A4 | Admin reviews: approve, reject, or request more information | application `approved` / `rejected` / `needs_info` | Admin (audit) |
| A5 | Member notified; can now book | membership `approved` | Member |

### Journey B: Returning member books a seat

| # | Step | State change | Seen by |
|---|---|---|---|
| B1 | Chooses programme, leg (outbound, return, round trip), bus and pickup point | none | Member |
| B2 | Adds riders (self, registered guests, or guests not yet registered: see PROGRAMMES-LEGS-GUESTS) | none | Member |
| B3 | Confirms: seats reserved atomically | booking `held`, seats ledger `+n` | Member, Admin |
| B4a | Free programme (Sunday): held until the marshal records a reached call and the member's confirmation (D-051); the hold ends at 18:00 the day before departure (D-055) | booking `confirmed` | Member, Marshal |
| B4b | Paid programme: redirected to provider-hosted checkout | payment `redirected` | Member |
| B5 | Provider confirms by server-side event (never by the return URL alone) | payment `succeeded`, booking `confirmed` | Member, Admin, Marshal |
| B6 | Hold not paid in time | booking `expired`, seats released | Member |

### Journey C: Member cancels a confirmed booking

Follows the PRD flow (cancellation window, then refund rule, then seat release). Refund details are OI-036; until then the window is "before departure minus N hours" as a provisional rule (OI-022, pilot only).

| # | Step | State change |
|---|---|---|
| C1 | Opens My Bookings, selects booking | none |
| C2 | Cancellation allowed inside window? If no, shown the contact route (marshal or admin) | none |
| C3 | Paid? Refund rule applied. Automatic or flagged for admin | booking `cancel_pending` (if manual) or `cancelled` |
| C4 | Seats released, marshal manifest updated, member notified | seats ledger `-n`, rider `removed` |

Marshal-initiated and admin-initiated cancellation use the same function (PRD §6 item 3).

### Journey D: Marshal runs a bus

| # | Step | State change |
|---|---|---|
| D1 | Opens duty for the bus and leg | none |
| D2 | Boards riders (single tap or scan) | rider `boarded` |
| D3 | Marks no-show when the list closes | rider `no_show` |
| D4 | Adds a walk-on or return-only rider (recorded with reason) | rider created, source `walk_on` |
| D5 | Reports a problem (bus late, wrong bus, rider dispute) | support report `submitted` |
| D6 | Contacts admin by WhatsApp or phone (deep link) | none (logged as contact event, OI-037) |
| D7 | Completes duty summary | bus assignment `departed` |

### Journey E: Admin runs programmes and operations

| # | Step | Notes |
|---|---|---|
| E1 | Creates programme or special event (see PROGRAMMES-LEGS-GUESTS) | programme `draft` |
| E2 | Configures routes, buses, pickup points, capacity, marshal | assignments created |
| E3 | Publishes; sets booking window or opens manually | programme `published`, then `booking_open` |
| E4 | Pauses, closes, or cancels; cancellation triggers notifications and refund queue | programme `cancelled` |
| E5 | Approves registrations, guests and refunds | all audited |
| E6 | Triages support reports; updates status; replies | report state changes audited |
| E7 | Logs a correction with a required reason (never edits silently) | supersession record |

### Journey F: Guest joins

Two registration paths and member onboarding are described in PROGRAMMES-LEGS-GUESTS §4. Guest bookings require an approved guest record.

### Journey G: Special event lifecycle

Draft, published, booking open, booking paused, booking closed, in progress, completed, cancelled. Full definition in `STATE-MACHINES/STATE-MACHINES.md`.

### Journey H: Member reports a problem

| # | Step | Notes |
|---|---|---|
| H1 | Opens "Report a problem with a booking" (from booking card or Help) | Pre-fills booking reference |
| H2 | Selects category: booking, payment, app bug, other | Category sets owner (SUPPORT-SYSTEM §2) |
| H3 | Submits. Receives reference | support report `submitted` |
| H4 | Admin receives in queue; acknowledges; investigates; may request info | report `received` to `investigating`, `awaiting_member` |
| H5 | Resolved or closed; member notified | report `resolved` / `closed` |

---

## 3. Dashboards

- **Member:** home, programmes and special events, booking flow, my bookings, my guests, notifications, help and support, profile.
- **Marshal:** duty (per bus, per leg), manifest, walk-on, incidents, summary, help and contact admin.
- **Admin:** overview and queues (registrations, refunds, reports, incidents), programmes and special events, fleet, bookings, payments, people (register, guests, marshals), reports, audit, broadcast.

The prototype files (`PROTOTYPE/member.html`, `marshal.html`, `admin.html`) implement these screens as in-memory walkthroughs. See `DOCS/PROTOTYPES/README.md` for what the prototypes do and do not prove.
