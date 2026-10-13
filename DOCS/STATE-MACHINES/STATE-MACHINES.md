# Canonical State Machines

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Decisions:** D-005, D-008, D-023, D-025, D-051, D-055 · **Open issues:** OI-027, OI-012, OI-019, OI-022, OI-036

Each section gives the states, the legal transitions, who may trigger them, guards that must hold, and what must be recorded. A transition not listed here is illegal.

---

## 1. Booking (axis 1 of D-025)

States: `held`, `confirmed`, `cancel_pending`, `cancelled`, `expired`. Terminal: `cancelled`, `expired`.

| From | To | Trigger | Actor | Guard | Side effects | Required record |
|---|---|---|---|---|---|---|
| (none) | `held` | hold seats | Member, Marshal (walk-on), Admin | Assignment `booking_open`; seats available under row lock; member approved; guests approved for guest riders | Ledger `+n` (hold); `hold_expires_at` set (D-003 TTL, proposed 15 min) | Transition row, audit |
| `held` | `confirmed` | payment succeeded; or, for a free programme, a reached call and the member's confirmation recorded by the marshal | System (webhook); Marshal (free only, own assignment) | Payment `succeeded` for this booking, amount matches; or programme free and a `reached` contact with confirmation recorded (D-051) | Manifest entries `awaiting` created; notifications queued | Transition row, payment event ID or contact record |
| `held` | `expired` | hold timer passes | System (scheduler) | `now() > hold_expires_at` and not confirmed. For a free booking, `hold_expires_at` is 18:00 Lagos time the day before departure, or the manifest lock if the booking was made after that time (D-055) | Ledger `-n` (expire) | Transition row |
| `held` | `cancelled` | member or admin abandons | Member, Admin | Not yet confirmed | Ledger `-n` (release) | Transition row, reason |
| `confirmed` | `cancelled` | cancellation with no payment, or free booking | Member (in window), Marshal, Admin | Before departure; within cancellation window per OI-022 | Ledger `-n` (cancel); manifest entries `removed`; notifications | Transition row, reason |
| `confirmed` | `cancel_pending` | cancellation of a paid booking | Member, Admin | Paid; refund rule requires review or is manual | Refund request created (refund machine) | Transition row, reason |
| `cancel_pending` | `cancelled` | refund decided (approved or denied) | Admin | Refund decision recorded | Ledger `-n`; manifest `removed` | Transition row, refund ID |
| `confirmed` | `cancelled` (event cancelled) | programme cancelled | System, Admin | Programme `cancelled` | Refund requests for paid bookings; notifications | Transition row, reason `event_cancelled` |

**Rules**

- A free booking stays `held` until the marshal records a reached call and the member's confirmation (D-051). It is never confirmed by the member alone.
- A booking is never moved back from `cancelled` or `expired`. A new booking is created instead.
- `expired` and a late payment: if a payment succeeds after `expired`, the payment goes to `reconciliation_required` (payment machine) and the booking is not revived automatically. An admin decides (PRD §6 item 2).
- Cancellation has one function callable by member, marshal and admin (PRD §6 item 3). Only the actor and the window check differ.

---

## 2. Rider on manifest (axis 3 of D-025), per leg

States: `awaiting`, `boarded`, `no_show`, `removed`. Terminal: `boarded` (except by correction), `removed`.

| From | To | Trigger | Actor | Guard | Required record |
|---|---|---|---|---|---|
| (created) | `awaiting` | booking confirmed for this leg, or walk-on added | System, Marshal | Assignment not `departed` or `closed` | Entry created |
| `awaiting` | `boarded` | marshal taps board or scans | Marshal, Admin | Assignment `departed` not yet; or before departure | Manifest transition |
| `awaiting` | `no_show` | marshal closes the list | Marshal, Admin | Manifest locks 30 minutes before departure (Q-013, D-037). No-shows may be marked from the lock onward. Additions after the lock need admin approval with a reason | Manifest transition, reason optional |
| `awaiting` | `removed` | cancellation, or admin removal | Member, Marshal, Admin | Reason required for marshal and admin | Manifest transition, reason |
| `no_show` | `boarded` | **correction only** | Admin | Reason required | Correction record (supersedes the no-show), audit |
| `boarded` / `removed` | (any) | **none** | none | none | Use correction |

**Rules**

- `no_show` is a first-class terminal state (D-008), distinct from `removed`. Reports count them separately.
- A rider on a round trip has two entries. Boarding one leg does not change the other.
- Return-only riders have one entry on the return leg.
- Riders on a held free booking appear on the duty list as "to contact" until a contact result is recorded (D-051).

---

## 3. Payment

States: `not_required`, `pending`, `redirected`, `succeeded`, `failed`, `expired`, `reconciliation_required`, `refund_pending`, `refunded`.

| From | To | Trigger | Actor | Guard | Required record |
|---|---|---|---|---|---|
| (none) | `not_required` | free programme | System | Programme price is zero | Payment row |
| (none) | `pending` | start payment | Member, System | Booking `held`; provider order created | Payment row with provider reference |
| `pending` | `redirected` | member sent to hosted checkout | System | Checkout URL returned by provider | `redirected_at` |
| `pending` / `redirected` | `succeeded` | verified provider event (webhook) or status query | System | Signature valid (webhook) or status query result; amount and reference match; event ID not seen | Payment event row; booking confirmed in same transaction if still `held` |
| `pending` / `redirected` | `failed` | provider reports failure | System | Verified event | Payment event row, failure reason |
| `pending` / `redirected` | `expired` | no success before limit | System | Provider limit passed | Payment event row or status query |
| `succeeded` | `reconciliation_required` | success arrives for a booking already `expired` or `cancelled` | System | Booking not `held` at arrival | Payment event row; admin alert |
| `succeeded` | `refund_pending` | refund approved | Admin, System (rule-driven) | Refund decided | Refund row |
| `refund_pending` | `refunded` | provider refund confirmed | System | Provider refund reference | Payment event row |
| `refund_pending` | `succeeded` | refund failed and reverted | System, Admin | Refund row `failed` | Refund row |

**Rules**

- The return URL never changes payment state. Only verified events and server status queries do.
- Payment rows contain no card, account or wallet fields (D-023).

---

## 4. Refund

States: `requested`, `approved`, `denied`, `processing`, `completed`, `failed`. Terminal: `completed`, `denied`.

| From | To | Trigger | Actor | Guard | Required record |
|---|---|---|---|---|---|
| (none) | `requested` | member cancels a paid booking, or admin cancels programme | Member, System | Payment `succeeded` | Refund row, reason |
| `requested` | `approved` | admin decision | Admin | Rule (OI-036) applied or override with reason | Decision row |
| `requested` | `denied` | admin decision | Admin | Reason required | Decision row |
| `approved` | `processing` | provider refund initiated | System | Provider supports refund (D-006), else manual | Provider reference |
| `approved` | `processing` (manual) | admin records manual refund made | Admin | Manual refund reference | Reference recorded |
| `processing` | `completed` | provider confirms | System | Verified event | Payment event row |
| `processing` | `failed` | provider rejects | System | Verified event | Failure reason; admin queue |
| `failed` | `processing` | retry | Admin | Reason | Refund row |

**Rules**

- Refund amounts and eligibility come from the refund rule (OI-036). Until ratified, every refund is `requested` and an admin decides. No automatic refund is shipped on a provisional rule.

---

## 5. Programme (special events and recurring)

States: `draft`, `published`, `booking_open`, `booking_paused`, `booking_closed`, `in_progress`, `completed`, `cancelled`.

| From | To | Trigger | Actor |
|---|---|---|---|
| (none) | `draft` | create | Admin |
| `draft` | `published` | publish (visible to members, no bookings) | Admin |
| `published` | `booking_open` | open booking: a second admin approves (D-042); the scheduler opens at `booking_opens_at` only after that approval | Admin, System |
| `booking_open` | `booking_paused` | pause | Admin |
| `booking_paused` | `booking_open` | resume | Admin |
| `booking_open` / `booking_paused` | `booking_closed` | close (manual, or scheduler at `booking_closes_at`) | Admin, System |
| `booking_closed` | `in_progress` | first departure | System |
| `in_progress` | `completed` | all assignments closed | System, Admin |
| any non-terminal | `cancelled` | cancel programme with reason | Admin |

**Rules**

- A special event cannot be `booking_open` without at least one assignment with a marshal and capacity.
- `cancelled` cascades to bookings (booking machine, row "programme cancelled") and refunds.
- Editing capacity or time after bookings exist is a correction that notifies riders (PROGRAMMES-LEGS-GUESTS §1.2).

---

## 6. Route bus assignment (D-013 per-bus toggle)

States: `scheduled`, `booking_open`, `booking_closed`, `departed`, `closed`, `cancelled`.

| From | To | Trigger | Actor |
|---|---|---|---|
| `scheduled` | `booking_open` | open bus | Admin, System |
| `booking_open` | `booking_closed` | close bus (full, or manual) | Admin, System |
| `booking_closed` | `booking_open` | reopen | Admin |
| `booking_open` / `booking_closed` | `departed` | departure recorded by marshal | Marshal, Admin |
| `departed` | `closed` | duty summary completed | Marshal, Admin |
| any non-terminal | `cancelled` (bus cancelled, OI-019) | cancel bus | Admin |

**Rules**

- `cancelled` on a bus triggers the bus-cancellation flow: mass notification, rebook offer or refund request for each booking on that bus (rules pending OI-019 and OI-036).

---

## 7. Support report

States: `submitted`, `received`, `assigned`, `investigating`, `awaiting_member`, `resolved`, `closed`.

| From | To | Trigger | Actor |
|---|---|---|---|
| (none) | `submitted` | member or marshal submits | Member, Marshal |
| `submitted` | `received` | acknowledged by system | System |
| `received` | `assigned` | owner assigned (category rule) | Admin |
| `assigned` | `investigating` | work started | Admin |
| `investigating` | `awaiting_member` | more information requested | Admin |
| `awaiting_member` | `investigating` | member replies | System, Member |
| `investigating` | `resolved` | fix or answer given | Admin |
| `resolved` | `closed` | member confirms or auto-close after set period | Member, System |
| `resolved` | `investigating` | reopen with reason | Member, Admin |

**Rules**

- Internal notes (`visibility = internal`) never reach the reporter.
- A report is never deleted. Duplicate reports are linked, not merged silently.
- Members are told not to share card or bank details in reports (`SUPPORT/SUPPORT-SYSTEM.md`).

---

## 8. Incident (travel day)

States: `open`, `acknowledged`, `action_in_progress`, `resolved`, `closed`.

| From | To | Trigger | Actor |
|---|---|---|---|
| (none) | `open` | marshal or admin opens | Marshal, Admin |
| `open` | `acknowledged` | admin acknowledges | Admin |
| `acknowledged` | `action_in_progress` | action started (rebook, reassign, notify) | Admin |
| `action_in_progress` | `resolved` | action complete | Admin |
| `resolved` | `closed` | after review (blameless) | Admin |

**Rules**

- Opening an incident of kind `bus_breakdown` or `bus_cancelled` notifies affected riders and the admin within the same transaction.

---

## 9. Registration and guest

**Membership (profile):** `pending`, `approved`, `rejected`, `needs_info`, `suspended`, `retired`.

| From | To | Trigger | Actor |
|---|---|---|---|
| (none) | `pending` | application submitted (first-timer) | Member |
| `pending` | `approved` | admin approves | Admin |
| `pending` | `rejected` | admin rejects, reason required | Admin |
| `pending` / `needs_info` | `needs_info` / `pending` | request information, or member responds | Admin, Member |
| `approved` | `suspended` | admin suspends, reason required | Admin |
| `suspended` | `approved` | admin reinstates | Admin |
| any | `retired` | leaves the church or inactive (per register stewardship, OI-015) | Admin |

**Guest:** `invited`, `registered`, `pending_approval`, `approved`, `declined`, `removed`.

| From | To | Trigger | Actor |
|---|---|---|---|
| (none) | `invited` | host invites | Member |
| `invited` | `registered` | guest signs up via link or public form | Guest |
| `registered` | `pending_approval` | public path (G1) | System |
| `registered` | `approved` | invite-link path (G2) | System (no admin approval, per meeting) |
| `pending_approval` | `approved` / `declined` | admin decides | Admin |
| `invited` / `registered` | `declined` | guest declines | Guest |
| any active | `removed` | host or admin removes, reason | Member (own guests), Admin |

---

## 10. Special-event guard summary

| Action | Allowed only when |
|---|---|
| Open booking | Programme `published`, at least one assignment with capacity and marshal |
| Publish | Required fields complete (PROGRAMMES-LEGS-GUESTS §1.1) |
| Hold seats | Programme `booking_open`, assignment `booking_open` |
| Cancel programme | Admin, reason required |

---

## 11. Waitlist entry (D-030)

States: `waiting`, `offered`, `accepted`, `declined`, `expired`, `withdrawn`. Terminal: `accepted` (booking created through `hold_seats`), `declined`, `expired`, `withdrawn`.

| From | To | Trigger | Actor | Guard | Required record |
|---|---|---|---|---|---|
| (none) | `waiting` | rider joins waitlist for a full bus or leg | Member, Admin | Bus or leg at capacity; rider approved | Waitlist row with priority rank (first-timer guest first, then time joined; D-034) |
| `waiting` | `offered` | seat released or bus added | System, Admin | Highest priority waiting entry; seats available under lock | Offer timestamp and expiry (2 hours, Q-011, D-035); push and SMS queued |
| `offered` | `accepted` | rider rebooks within the window | Member | Offer not expired; seats still available | `hold_seats` call creates the booking; entry linked to booking |
| `offered` | `expired` | window passes without action | System (scheduler) | `now() > offer_expires_at` | Next waiting entry offered |
| `offered` | `declined` | rider declines | Member | Offer open | Reason optional |
| `waiting` / `offered` | `withdrawn` | rider leaves the queue | Member, Admin | Not accepted | Reason optional |

**Rules**

- Priority is applied at offer time, not at join time alone. The queue order is visible to admin.
- Every offer, acceptance, expiry and decline is recorded, so a dispute can be checked.
- An expired offer never holds a seat.

## 12. Corrections

Corrections are not transitions. They are supersession records (`corrections` table): the original audit row is kept, a new correction row names the superseded row, the corrected value, the reason and the actor. Used for no-show errors, wrong bus, wrong leg, and wrong capacity (OI-012).
