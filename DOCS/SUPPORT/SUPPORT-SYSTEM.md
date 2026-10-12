# Support System

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager (design), Transport Department (ownership)
**Decisions:** D-009, D-023, D-025 · **Open issues:** OI-026, OI-037, OI-038

---

## 1. Channels

| Channel | When to use | Who uses it | Recorded in app? |
|---|---|---|---|
| In-app "Report a problem" | Booking, payment or app issues that can wait a few hours | Member, marshal | Yes (`support_reports`) |
| WhatsApp (deep link to marshal) | Travel day, rider questions, bus position | Member | No (contact logged as event only, OI-037) |
| WhatsApp or phone (admin) | Marshal needs admin, incidents, bus problems | Marshal | Incident recorded in app if opened |
| Phone (transport office) | Urgent, or no signal | Anyone | No |
| Marshal "App bug" | Software faults during duty | Marshal | Yes, category `app_bug` |

Deep links prefill a message with the booking reference or the bus. Phone numbers come from configuration, not hard-coded in screens.

---

## 2. Categories

| Category | Typical examples | Initial owner (proposed) | Notes |
|---|---|---|---|
| `booking_problem` | Wrong name, wrong leg, seat missing | Admin | Correction path if the record is wrong (OI-012) |
| `payment_problem` | Paid but not confirmed, double charge, refund question | Finance contact named by the church (D-042) | Never ask for card details |
| `app_bug` | Screen fails, cannot sign in | Admin, then developer contact | Developer triage is the admin's decision |
| `travel_incident` | Bus late, breakdown, wrong bus | Admin (incident record) | Creates an `incidents` record and notifies |
| `other` | Anything else | Admin | |

Owners decided by Q-018 (D-042): admin for bookings and incidents; a finance contact named by the church for payments; app bugs through the admin to the developer.

---

## 3. Statuses

`submitted` → `received` → `assigned` → `investigating` → (`awaiting_member`) → `resolved` → `closed`. Full transitions in `STATE-MACHINES/STATE-MACHINES.md` §7.

The reporter sees: submitted, being looked at, we need more information, resolved, closed. Internal states are shown to admins only.

---

## 4. Response targets (proposed; owners decided, Q-018)

| Category | Acknowledge | First response | Target to resolve |
|---|---|---|---|
| Travel incident | Immediately (phone or WhatsApp) | During duty | Same day |
| Payment problem | 1 working day | 1 working day | 5 working days |
| Booking problem | 1 working day | 2 working days | 5 working days |
| App bug | 2 working days | 3 working days | Next release |
| Other | 2 working days | 3 working days | Best effort |

These are targets for the queue, not guarantees to members. The admin overview shows overdue items.

---

## 5. Escalation

1. Unacknowledged past target: shown on admin overview as overdue.
2. Still unresolved after two targets: escalated to the Product Manager role, which is the sponsor-level contact for disputes (OI-012 dispute path).
3. Payment item not matched to provider data after reconciliation: escalated to the provider's merchant support, with the reference.
4. Anything involving personal safety: phone the transport office immediately; the app is not the channel.

---

## 6. Privacy and content

- Reports store what the member typed. Members are told not to include card numbers, bank passwords, or one-time codes. The form shows this line.
- Attachments are not supported at MVP (no storage bucket for personal files; cash receipt photos deferred with OI-023).
- Reporter sees their own reports only. Marshals see reports they raised. Admins see all.
- Internal notes are never shown to the reporter.
- Closed reports are retained as per OI-038; contact details are pseudonymised when a report is closed after the retention window.

---

## 7. Marshal to admin contact

- Marshal screen has a "Contact admin" card with WhatsApp and phone links and an "App bug" report.
- Every contact button press is logged as an event (time, bus, channel) so the admin can see that contact was attempted. The message content is not recorded.

---

## 8. Member help

The help page lists: how to report a problem, marshal contact for the day of travel (from the member's assigned assignment), transport office WhatsApp and phone, what to do with an expired hold, how refunds work (linked to the policy once ratified, OI-036), and the privacy line about payment details.

---

## 9. Acceptance tests

- A member can submit a booking problem from a booking card and the report carries the booking reference.
- The report appears in the admin queue within one refresh, with category and owner.
- An admin status change writes an audit row and notifies the reporter with the member-facing label.
- An internal note is not visible to the reporter (RLS test).
- A marshal can contact admin by WhatsApp and phone links on mobile and desktop.
