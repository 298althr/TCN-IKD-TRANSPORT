# Notifications Design

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** UI/UX Designer and Backend
**Decisions:** D-009, D-010, D-025 · **Open issues:** OI-004, OI-031, OI-037, OI-038

---

## 1. Channel matrix (MVP)

| Channel | MVP? | Used for | Constraints |
|---|---|---|---|
| Web Push | Yes (D-009) | Booking confirmed, held-seat reminder, marshal alerts, changes to bookings | Requires permission and, on iOS, the app added to the home screen (iOS 16.4 or later). Browser must support push |
| Email | Yes (D-009) | Receipts, cancellation confirmations, registration decisions | Transactional email provider to choose (Verify pricing and free tier at build) |
| In-app inbox | Yes | Permanent record of every message sent to the person | Always available, even if push and email fail |
| SMS | **MVP** (D-028); vendor and cost open (OI-031) | Marshal critical alerts; sign-in codes | Vendor candidates: Termii, Africa's Talking (pricing to verify) |
| WhatsApp | Deep link only (OI-037) | Member contacts marshal; marshal contacts admin | `wa.me` links prefilled with booking reference. No automated sending |
| Phone call | Link only (`tel:`) | Travel-day contact | Not automated |

---

## 2. Event catalogue

| Event (source state change) | Recipient | Channels | Priority |
|---|---|---|---|
| Application submitted | Member | Inbox, email | Normal |
| Registration pending after 12 hours (D-044) | Admin on rota | Push, inbox | High |
| Application approved / rejected / needs info | Member | Push, email, inbox | High |
| Guest invite redeemed | Host member | Inbox | Normal |
| Guest approved / declined | Guest and host | Push or email, inbox | Normal |
| Booking held | Member | Inbox | Normal (reminder before hold expiry: push) |
| Hold about to expire (5 minutes left) | Member | Push | High |
| Booking confirmed | Member and each rider with an account | Push, email, inbox | High |
| Payment succeeded | Member | Email, inbox | High |
| Payment failed | Member | Push, inbox | High |
| Booking cancelled | Member, marshal of assignment | Push, email, inbox | High |
| Refund requested / decided / completed | Member | Email, inbox | Normal |
| Rider removed from manifest | Rider's account holder | Push, inbox | High |
| Assignment changed or marshal reassigned (D-005) | New and old marshal, affected riders | Push, inbox | High |
| Bus cancelled or breakdown incident (OI-019) | All riders on bus, admin, marshal | Push, email, inbox, SMS (D-028) | Critical |
| Programme cancelled | All booked riders, admin | Push, email, inbox | Critical |
| Support report received / status changed | Reporter | Push, inbox | Normal |
| Admin broadcast | Segment | Push, email, inbox | As selected |
| Marshal duty assigned | Marshal | Push, inbox | High |
| Waitlist offer (seat released or bus added) | Waitlisted riders, in priority order | Push, SMS, inbox | Critical (offer window applies) |
| Waitlist offer expired; next rider offered | Next rider | Push, SMS, inbox | High |
| Marshal notified: bus needed for waitlist (D-030) | Marshal, admin | Push, inbox | High |
| New booking on the assignment (D-053; BRD §13) | Marshal of the assignment | Push, inbox | High |
| Payment changed on a booked rider (D-053; BRD §18) | Marshal of the assignment | Push, inbox | High |
| Programme reminder the day before departure (D-053; BRD §18) | Booked riders | Push, inbox | Normal |

---

## 3. Outbox behaviour

- Each row: recipient, channel, template key, payload (IDs and display names only), status, attempts, next attempt, last error.
- Dispatcher runs every minute; sends in batches; marks sent on provider acknowledgement.
- Retry schedule as in `BACKEND/BACKEND-DESIGN.md` §4.
- Duplicate protection: each outbox row has a deduplication key from the event (for example `booking.confirmed:{bookingId}:{channel}`).
- A `dead` row raises an admin alert. Admin can resend or mark resolved with a reason.
- Retention of sent rows per OI-038.

---

## 4. Quiet hours

Proposal (Recommendation, to confirm with the transport department): no non-critical push or email between 22:00 and 05:00 Lagos time. Critical messages (bus cancelled, breakdown, marshal alerts on travel day) bypass quiet hours.

---

## 5. Permission flow

- Do not request notification permission on first launch. Ask after the first successful booking or first duty, with a plain reason ("so we can tell you if your bus changes").
- If declined, the in-app inbox still works and the app shows the reason again only from Settings.
- Platform install steps appear before the permission request on iOS (D-009, OI-004).

---

## 6. Content rules

- Plain language. Booking reference always included. Programme name and departure time included.
- No payment instruments, passwords, or one-time codes in any message. OTP codes are sent only by the sign-in provider.
- No internal state names; use the member-facing labels from `FRONTEND/FRONTEND-DESIGN.md` §4.
- Marshal push alerts name the rider and the booking reference, for the marshal's own assignment only. An SMS to a marshal shows only the bus and the rider count (D-053).
- Messages in English at launch.

---

## 7. Templates (initial list)

`application.decided`, `booking.held`, `booking.hold_expiring`, `booking.confirmed`, `booking.cancelled`, `payment.failed`, `refund.decided`, `rider.removed`, `assignment.changed`, `incident.opened`, `programme.cancelled`, `support.updated`, `guest.decided`, `broadcast.generic`, `marshal.booking_created`, `marshal.payment_changed`, `programme.reminder` (the last three from D-053).

Each template has a plain-language version for push, a fuller version for email, and an inbox entry.

---

## 8. Testing

- Every event in §2 has a test that checks: the outbox row exists in the same transaction, the right recipient is chosen, and the message contains no forbidden content (payment, OTP, passwords).
- Dispatch failure test: provider down for 30 minutes; rows retry, then go `dead`, then alert.
- Route scoping test: a marshal never receives alerts for another assignment.
