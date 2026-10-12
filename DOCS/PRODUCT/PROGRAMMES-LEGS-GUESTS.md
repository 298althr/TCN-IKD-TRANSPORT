# Programmes, Trip Legs, Capacity and Guests

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Decisions:** D-001, D-005, D-008, D-013, D-023 · **Open issues:** OI-021, OI-022, OI-024, OI-028, OI-036

---

## 1. Programme types

A **programme** is anything that has transport. Two kinds, one data model, different rules.

| Attribute | Recurring (Sunday Service) | Special event (e.g. Hallelujah Night) |
|---|---|---|
| Created by | Admin (template repeats weekly) | Admin only. Marshals cannot create or edit events |
| Price | Free (PAY-1) | Paid where applicable (`price_minor`, `currency`) |
| Booking window | Scheduler opens and closes (D-004) | Admin opens, pauses, closes; scheduler optional |
| Routes and buses | Standing assignments, adjustable per week | Assigned per event; may differ from Sunday |
| Refund policy | Church default | Church default, with explicit per-event override recorded (PRD §6 item 5) |
| Cancellation | Admin cancels one occurrence | Admin cancels the event; triggers notifications and refund queue |

### 1.1 Special-event required fields

Name · date and time · venue · legs offered (outbound, return) · departure slots per leg · routes and pickup points · buses per route with capacity and marshal · price per rider and currency · booking opens and closes (timestamps) · cancellation and refund rule reference · contact line shown to members.

### 1.2 Special-event rules (provisional, OI-024)

- Admin creates in `draft`. Publishing makes it visible to members. Opening bookings is a separate action that needs a second admin's approval (Q-019, D-042).
- Changing capacity or departure time after members have booked is a **correction** that notifies affected riders, and never silently moves them.
- Cancelling an event does not delete bookings. Each booking moves to `cancelled` with reason `event_cancelled`, and each paid booking enters the refund queue (OI-036 determines the amount).
- Special events never use the Sunday free path, even if they fall on a Sunday.

---

## 2. Trip legs

Each booking carries a leg:

| Leg | Meaning | Capacity used |
|---|---|---|
| `outbound` | Travels to the programme | Outbound seats on the chosen bus |
| `return` | Travels back from the programme | Return seats on the chosen bus |
| `round_trip` | Both legs | One seat on each leg |

**Return-only riders.** Some people do not travel out with the bus but want to return with it (dept session 2026-10-09). A return-only booking reserves a return seat only. On the return manifest they appear as `return-only` and are boarded like any rider. If one has no booking at all, the marshal may add a walk-on rider with a reason. Walk-on riders are recorded and visible to admin.

**Independent capacity.** Outbound and return seats are counted separately. A full outbound bus can have room on return. Confirm with the department (Q batch 2).

**Pricing by leg.** Decided (Q-015, D-039): one price per rider per programme, whatever the leg.

---

## 3. Capacity and overflow

- Capacity is per bus per leg. Route capacity is the sum of its buses (D-001). Each bus has a booking open or closed flag (D-013).
- Seats are reserved atomically at booking start (D-003 proposed: 15-minute hold, ratification pending). Holds expire automatically.
- **Overflow** (all buses full) is decided (D-030). The options considered were:
  - A: refuse with a clear message and the contact route.
  - B: waitlist. Out of MVP per BRD §15 and OI-021.
  - C: admin adds an extra bus or marks a bus as added. The bus gets a new assignment, and the admin is alerted.
  - D: priority rule (members before guests, then first-come) when seats are scarce.
- **Decided flow (D-030):** a full bus takes waitlist entries. The marshal is notified and contacts admin. Admin adds a bus or finds a solution. Waitlisted riders are offered seats in priority order (first-timer guests first, then everyone else by join time, D-034) by push and SMS, and rebook within a two-hour offer window (D-035).

---

## 4. Guests

Guests are people who ride under a member's booking. Three ways a guest enters the system:

| Path | Who starts it | Approval | Attribution |
|---|---|---|---|
| G1. Public registration | Guest, via public form | **Admin approves** | Records who referred, if known |
| G2. Invite link | Member shares a link (token) | **No admin approval**, per the meeting | Host recorded on the guest record |
| G3. Member onboards a guest | Member adds a guest in My Guests | Member-added guests are **approved for riding under that member**, with admin visibility | Host is the member |

**Guest record:** name, phone (optional, for contact), host member, origin path, status (`invited`, `registered`, `pending_approval`, `approved`, `declined`, `removed`).

**Guest limits.** Decided (Q-016, D-040): no cap at launch. Admin monitors guest numbers per programme and per bus. Reviewed after the pilot. Guests may displace members on full buses (RISK-012).

**Guest to member conversion.** A guest who wants full membership goes through the first-time registration path (Admin approval). Not automatic.

**Manifest.** Marshals see "Guest of [host]" against each guest rider, so responsibility is visible at the bus.

---

## 5. Exceptions

The following need explicit rules. Each has a Batch 2 question or a register entry.

| Case | Current rule | Status |
|---|---|---|
| Return-only rider | Supported (section 2) | Designed |
| Rider on a different route at return | Admin override with reason | Open (OI-019 family) |
| Unregistered person arrives on the day | Before the lock: walk-on with reason. After the lock: admin approves in the app with a reason (D-041) | Decided |
| Marshal does not show | Admin reassigns (D-005); riders notified | Designed |
| Bus breaks down mid-route | Incident raised; riders notified; rebook rule | OI-019 |
| Rider boards the wrong bus | Marshal corrects with reason; audit | Designed |
| Bus cancelled before departure | Bus cancellation state; mass notify; refund or rebook | OI-019 |
