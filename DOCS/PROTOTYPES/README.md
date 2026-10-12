# PROTOTYPES

**Status:** Live walkthrough artifacts · **Date:** 2026-10-12 · **Owner:** UI/UX Designer with Frontend
**Location of the files:** `PROTOTYPE/` (project root, outside `DOCS/`) · **Open issues:** OI-034 (documents), OI-004 · **Decisions:** D-030, D-031, D-033

## What this folder is for

A pointer to the clickable prototypes, what each one demonstrates, and what none of them proves. The prototypes are for walkthroughs with the transport department and the development team. They are not the production product.

## Files in PROTOTYPE/

| File | Role | What it demonstrates |
|---|---|---|
| `index.html` | Launcher | Chooses a role |
| `member.html` | Member app | Install gate, sign-in and registration, pending approval, home, special-event and Sunday booking, riders and guests, payment screen with provider choice, ticket, bookings and cancel, support and report modal, notifications |
| `marshal.html` | Marshal app | Duty, outbound and return manifests, board and no-show, walk-on, incident, app bug, contact admin, summary |
| `admin.html` | Admin app | Overview with attention queue and reports, programmes and special events, fleet with per-bus toggle, bookings with corrections, payments and refunds, people approvals, marshals, reports, audit, broadcast |

## What the prototypes do

- Keep all state in memory in the page. Actions change state and re-render lists. A refresh resets everything.
- Show state labels and an audit feed in the admin app so the effect of an action is visible.
- Demonstrate flows end to end for walkthrough purposes (for example, a guest added appears in the list; a booking reduces seats).

## What the prototypes do not do

- No backend, no database, no persistence, no authentication.
- No payment. The provider screen is a simulation. No card fields exist in any file.
- No real notifications, no real WhatsApp or phone links beyond placeholder numbers.
- They are not evidence of security, compliance, or performance.
- They use the burnt-orange and yellow system (OI-034 open).

## Known gaps to close before the next walkthrough

1. Show booking, payment and rider states as separate chips (D-025). The prototypes currently use one status field.
2. Add the waitlist flow (D-030): full bus, join waitlist, marshal notified, bus added, rebook offer by push and SMS, guests before members.
3. Label the payment screen with "Provider-hosted checkout (simulation)" in plain words so no reviewer mistakes it for in-app payment.
4. Make payment copy digital-only: Paystack and OPay, no cash or POS wording (D-033).
5. Sign-in: replace the password field with a phone-code step. Keep the Google button as a visible placeholder marked not yet connected (D-029).

## Running locally

Serve the `PROTOTYPE/` folder with any static server and open `index.html`. The preview used during design was a local static server on port 8381.
