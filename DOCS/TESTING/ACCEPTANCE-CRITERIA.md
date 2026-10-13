# Acceptance Criteria by Role

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** QA/Test Engineer with Product Manager
**Decisions:** D-019, D-025, D-029, D-030 to D-044, D-045 (sign-off gate), D-047 (criteria are release criteria), D-051 (MAR-21 added) · **Source scenarios:** `PRODUCT/SCENARIOS-AND-EDGE-CASES.md`

---

## 1. How to read this

Each criterion is written as **Given / When / Then** in one line. The ID tells you the role. The **Level** says whether it must pass before the pilot (**P**) or is scheduled after it (**L**). The **Source** column links to the scenario, decision or document that defines it.

| Prefix | Who |
|---|---|
| MEM | Member (signed in, approved) |
| GST | Guest (invited, or registered and waiting for approval) |
| MAR | Marshal (duty for an assigned bus) |
| ADM | Administrator (trained, second factor enrolled) |
| SYS | Cross-cutting: payments, security, data, system behaviour |

**Test layers.** During frontend-first development, criteria are first run against the stand-in data layer (UI and behaviour). The same criteria are re-run against the real backend when it is integrated. A criterion passes only when both runs pass.

**Release rule.** A release for the pilot passes only when every P criterion for the roles in that release passes. L criteria are tracked and scheduled.

---

## 2. Member

| ID | Given / When / Then | Source | Level |
|---|---|---|---|
| MEM-01 | Given a number on the register, when the member asks for a sign-in code, then a six-digit code arrives by SMS and signs them in | D-029, F12 | P |
| MEM-02 | Given a number not on the register, when signing in, then the app shows "awaiting approval" and reveals nothing about the register | AUTH §3, F02, T12 | P |
| MEM-03 | Given a first-time application, when it is pending, then the app shows "under review" and no booking controls | D-044, F01 | P |
| MEM-04 | Given an approval, when the admin approves, then the member is notified and sees booking controls | ADM-03 | P |
| MEM-05 | Given a rejection, when the member opens the app, then the reason and the contact route are shown and no booking is possible | F02 | P |
| MEM-06 | Given a request for more information, when the member replies, then the status returns to pending | F03 | P |
| MEM-07 | Given a free Sunday seat, when the member chooses the bus and pickup and confirms, then one outbound booking is created with a reference and shows as waiting for the marshal's call | A01, SUN, D-051 | P |
| MEM-08 | Given a return-only booking, when the member travels, then the ticket shows the return leg only and the rider appears on the return list only | A02 | P |
| MEM-09 | Given both legs open, when the member books a round trip, then the two legs are shown and one price per rider applies whichever leg | A03, D-039 | P |
| MEM-10 | Given one leg full, when the member books a round trip, then the app offers the open leg or the waiting list and never books a leg the member did not choose | A04, P-06 | P |
| MEM-11 | Given a host booking for named riders, when the host adds riders, then one total and one payment are shown for everyone | A06 | P |
| MEM-12 | Given a paid booking awaiting payment, when the hold runs out, then the booking shows "expired", the seat is released, and the member is told | C05, SYS-02 | P |
| MEM-13 | Given a paid booking, when payment starts, then the member is sent to the provider's page, and no card, CVV, account or wallet field exists anywhere in the app | D-023, C02 | P |
| MEM-14 | Given a return from the provider without a completed payment, when the page loads, then it shows "checking your payment" and does not show the booking as confirmed | C03 | P |
| MEM-15 | Given a payment confirmed by the provider, when the member closed the browser, then the booking shows as confirmed on next open | C02 | P |
| MEM-16 | Given a declined payment, when the member is told, then the status is "payment failed", retry is offered, and the seat stays held until the hold runs out | C04 | P |
| MEM-17 | Given a free booking cancelled inside the window, when the member confirms, then the booking is cancelled, the seat released, and a confirmation shown | D01, D-032 | P |
| MEM-18 | Given a cancellation after the cutoff, when the member tries to cancel online, then cancellation is blocked and the contact route is shown | D02, D-032 | P |
| MEM-19 | Given a paid booking cancelled inside the window, when the member confirms, then the status shows "refund requested"; no amount is shown until the refund policy is signed | C15, P-01 | P |
| MEM-20 | Given a full bus, when the member joins the waiting list, then the app shows "on the waiting list" and does not show other riders' places | B02, D-030 | P |
| MEM-21 | Given a seat offered from the waiting list, when the offer arrives, then the member gets push and SMS and sees a two-hour countdown | B03, D-035 | P |
| MEM-22 | Given an open offer, when the member accepts inside two hours, then a booking is created by the normal booking path and payment follows | B04 | P |
| MEM-23 | Given an offer that runs out, when the time passes, then the member's status shows "expired" and they can no longer accept | B05 | P |
| MEM-24 | Given an open offer, when the member declines, then the status shows "declined" | B06 | P |
| MEM-25 | Given any booking, when the member views it, then booking status, payment status and boarding status are shown as three separate labels | D-025 | P |
| MEM-26 | Given a rider who has boarded or been marked no-show, when the member views the booking, then the boarding result is shown for that leg only | D-008, E07 | P |
| MEM-27 | Given a booking problem, when the member submits a report, then the booking reference is pre-filled and a report reference and status are shown | SUPPORT §9, D-042 | P |
| MEM-28 | Given travel day, when the member taps "WhatsApp marshal" or "Call", then WhatsApp opens with the booking reference, or the phone dialler opens with the marshal's configured number | SUPPORT §7 | P |
| MEM-29 | Given a support report with internal notes, when the member views it, then only messages marked for the reporter are shown | H05, SUPPORT §6 | P |
| MEM-30 | Given a member who invites a guest, when the invite is created, then the link is shown once, the guest list shows its status, and the member can revoke the link | F07, PROG §4 | P |
| MEM-31 | Given two members, when one signs in, then the other member's bookings, riders and contact details are never shown | SYS-09, T1 | P |
| MEM-32 | Given a push permission refused, when a booking is confirmed, then the confirmation still appears in the in-app inbox | I05, NOTIF §5 | P |
| MEM-33 | Given a non-urgent message at night, when it would send between 22:00 and 05:00, then it is held; urgent messages are sent | I09, P-24 | L |
| MEM-34 | Given no connection, when the member taps confirm, then no hold is created and the member is told to retry | I01 | P |
| MEM-35 | Given a double tap on confirm, when both taps are processed, then one booking is created | I02, B14 | P |
| MEM-36 | Given a screen reader and a keyboard only, when the member completes booking, then every action is reachable and labelled, and touch targets are at least 44 by 44 pixels | FRONTEND §6 | P |
| MEM-37 | Given the programme list offline, when it is shown, then a "last synced at" time is displayed | OPT §5, E12 | P |
| MEM-38 | Given a suspended member with future bookings, when they open the app, then they cannot book and the bookings are flagged for the admin | F10, P-10 | L |
| MEM-39 | Given a booking for three riders, when the total is shown, then it equals price per rider times three, on any leg | D-039 | P |
| MEM-40 | Given a free Sunday booking, when the member confirms, then no payment step is shown and the booking is not confirmed until the marshal records the member's confirmation | A08, SUN, D-051 | P |

---

## 3. Guest

| ID | Given / When / Then | Source | Level |
|---|---|---|---|
| GST-01 | Given a valid invite link, when a guest opens it and signs in with a phone code, then a guest record linked to the host is created with no administrator approval | PROG §4 (G2), D-028 | P |
| GST-02 | Given an expired or used-up invite link, when a guest opens it, then "this link is no longer valid" is shown and no record is created | F07 | P |
| GST-03 | Given a public guest registration, when submitted, then the status is "pending approval" and no booking is possible | PROG §4 (G1) | P |
| GST-04 | Given an approved guest, when the host adds them to a booking, then the guest appears on the booking as a rider | A08, PROG §4 | P |
| GST-05 | Given a declined guest, when they sign in, then the decline is shown with the contact route | PROG §4 | P |
| GST-06 | Given an approved guest, when they view bookings, then they see only the bookings they are on, the host's name on their ticket, and no other riders' details | SYS-09 | P |
| GST-07 | Given a host who removes a guest, when the change is saved, then the guest is taken off future riders and the host is told | SCEN A11, PROG §4 | P |
| GST-08 | Given a guest on a manifest, when the marshal views it, then the guest is shown as "Guest of [host]" | PROG §4, CONTRACTS | P |
| GST-09 | Given a waiting-list first-time guest and a waiting member, when a seat is offered, then the first-time guest is offered first | D-034 | P |
| GST-10 | Given a guest who wants to become a member, when they apply, then the first-time registration path with approval is used | F09, D-044 | P |
| GST-11 | Given a guest who is not approved, when a host tries to add them to a booking, then the booking is refused with "not approved" | A12, API NOT_APPROVED | P |
| GST-12 | Given a guest signing in on a shared phone, when they open the app, then only their own bookings are shown | F14 | L |

---

## 4. Marshal

| ID | Given / When / Then | Source | Level |
|---|---|---|---|
| MAR-01 | Given a marshal with a phone code, when they sign in, then the duty screen shows only buses assigned to them | E04, D-005 | P |
| MAR-02 | Given a duty, when the marshal views it, then only the assigned bus and its legs are shown | T2, SYS-10 | P |
| MAR-03 | Given a return-only rider, when the marshal views the outbound list, then the rider is not there; on the return list, they are | A02 | P |
| MAR-04 | Given a rider on the list, when the marshal taps "boarded", then the status changes once; a second tap shows "already boarded" and creates no second record | E14 | P |
| MAR-05 | Given a rider not yet boarded, when the marshal marks no-show before the lock, then it is refused; after the lock it is allowed | D-037 | P |
| MAR-06 | Given a walk-on before the lock, when the marshal adds the person with a reason, then they appear on the list as a walk-on | D-041, E16 | P |
| MAR-07 | Given a walk-on after the lock, when the marshal tries to add the person, then the request goes to the administrator and the person does not appear until approved | D-041, E06 | P |
| MAR-08 | Given a boarded rider, when the marshal tries to remove them, then the app refuses; only an administrator correction is possible | E15 | P |
| MAR-09 | Given a rider who boarded the wrong bus, when the marshal reports it, then an administrator correction with a reason is recorded | E05 | P |
| MAR-10 | Given no signal, when the marshal taps "boarded", then the tap is stored on the device with its time and sent when the connection returns, and the screen shows "waiting to send" until then | E12, E13 | P |
| MAR-11 | Given a printed manifest, when it is exported, then it matches the app list at that moment and shows the count and the time | R-007, E12 | P |
| MAR-12 | Given a problem on the bus, when the marshal opens "Contact admin", then WhatsApp and phone links open with the bus name filled in | SUPPORT §7 | P |
| MAR-13 | Given a breakdown, when the marshal opens an incident, then riders on the bus are notified and the administrator is alerted | E03, INC | P |
| MAR-14 | Given an app fault, when the marshal reports it, then a category and a reference are shown | H03, D-042 | P |
| MAR-15 | Given a marshal, when they open another bus's data by any route, then no passenger contact details are shown | T2, SYS-10 | P |
| MAR-16 | Given a finished duty, when the marshal opens the summary, then boarded, no-show, walk-on and return-only counts equal the manifest | Journey D | P |
| MAR-17 | Given a reassignment, when the administrator assigns another marshal, then the old marshal loses access at once and the new one sees the same statuses | E04, D-005 | P |
| MAR-18 | Given a dispute at the bus, when the marshal flags it, then the flag is recorded and the marshal cannot change any fee or refund | H04, P-14 | L |
| MAR-19 | Given a duty ended or a session idle for the set time, when the marshal returns, then they must sign in again | AUTH §7 | P |
| MAR-20 | Given a bus marked departed, when a boarding tap is made, then it is refused unless an administrator corrects it | STATE §6 | P |
| MAR-21 | Given a free booking held for a rider, when the marshal records a reached call and the member's confirmation, then the booking is confirmed; when the marshal records not reached, then the rider stays held and shows as not reached | D-051, BRD §11, requirements 10 and 11 | P |

---

## 5. Administrator

| ID | Given / When / Then | Source | Level |
|---|---|---|---|
| ADM-01 | Given an administrator, when they sign in, then a second factor from an authenticator app is required | D-029, OI-039 | P |
| ADM-02 | Given a pending application, when it is more than 12 hours old, then a reminder appears; the decision is due within 24 hours | D-044, F01 | P |
| ADM-03 | Given an application, when the administrator approves, rejects (with a reason) or requests information, then the change is audited and the member is notified | F02, F03 | P |
| ADM-04 | Given a new special event, when it is created, then it is a draft and booking cannot open | D-042, G01 | P |
| ADM-05 | Given a special event created by one administrator, when that administrator tries to approve it, then the approval is refused; a second administrator must approve | D-042 | P |
| ADM-06 | Given a bus with confirmed riders, when capacity is lowered below the number confirmed, then the change is refused | B16 | P |
| ADM-07 | Given a bus closed by the toggle, when the waiting list exists, then offers stop; when the bus reopens, offers resume in priority order | B12, D-013 | P |
| ADM-08 | Given an assignment, when a marshal is assigned, then the marshal is notified and any previous marshal loses access | D-005, E04 | P |
| ADM-09 | Given a full bus with a waiting list, when the administrator adds an extra bus, then a new assignment is created and offers begin by priority | B07, D-030 | P |
| ADM-10 | Given the waiting list, when the administrator views it, then riders are shown in offer order with first-time guests first | D-034 | P |
| ADM-11 | Given a bus with guests, when the office views guest numbers, then guest share per bus is shown; no action is blocked | D-040, RISK-012 | P |
| ADM-12 | Given a rider to add after the lock, when the administrator approves with a reason, then the approval and the approver are recorded | D-041 | P |
| ADM-13 | Given a programme to cancel, when the administrator cancels with a reason, then every booking is cancelled, refund requests are created for paid bookings, and riders are notified | D08, D-032 | P |
| ADM-14 | Given a refund request, when the administrator opens it, then the eligibility (12-hour cutoff) is shown, and any override needs a reason | C13, D-032, P-01 | P |
| ADM-15 | Given a refund request after the cutoff, when the administrator approves it, then a recorded override reason is required and the override is audited | C14 | P |
| ADM-16 | Given a payment flagged for reconciliation, when the administrator resolves it, then the decision and reason are recorded | C09, C11 | P |
| ADM-17 | Given any change to a booking, rider or manifest, when the administrator saves it, then a reason is required; the original is kept and the correction appears in the history | H01, H07, D-025 | P |
| ADM-18 | Given a support report, when it is routed, then payment items go to the finance contact and booking and incident items to the administrator; every status change is audited; internal notes are hidden from the reporter | H02, D-042 | P |
| ADM-19 | Given a broadcast to a large group, when it is sent, then a second administrator must approve it | I10, P-24 | L |
| ADM-20 | Given the audit view, when an administrator looks for an edit or delete control, then none exists; the audit is read-only | T15 | P |
| ADM-21 | Given a finance export, when it is made, then it covers only the finance period set by the church | D-043 | L |
| ADM-22 | Given any admin screen, when a payment record is shown, then no card, account or wallet detail appears | D-023 | P |
| ADM-23 | Given an administrator who leaves the role, when the role is removed, then access ends at once | P-22 | P |
| ADM-24 | Given a bus that will not run, when the administrator opens the incident, then riders can be notified from one action | E02, INC | P |
| ADM-25 | Given a changed pickup point, when the administrator saves it, then riders are notified and see the change in their booking | E08 | P |

---

## 6. Cross-cutting (system)

| ID | Given / When / Then | Source | Level |
|---|---|---|---|
| SYS-01 | Given two requests for the last seat at the same moment, when both are processed, then one succeeds and the other is refused and offered the waiting list | B01, ADR-0002 | P |
| SYS-02 | Given a held seat, when 15 minutes pass with no payment (value as ratified), then the hold expires and the seat is released | C05, D-003 | P |
| SYS-03 | Given a webhook with a bad signature, when it arrives, then it is refused and no state changes | C08, T6 | P |
| SYS-04 | Given the same webhook delivered twice, when both are processed, then the second has no effect | C07, T7 | P |
| SYS-05 | Given a webhook amount that differs from the booking, when it is processed, then the booking is not confirmed and the payment is flagged | C09 | P |
| SYS-06 | Given a payment that arrives after its hold expired, when processed, then it is flagged for reconciliation and not confirmed automatically | C11, PRD §6 | P |
| SYS-07 | Given two refund requests for one payment, when both arrive, then one refund record exists | C17 | P |
| SYS-08 | Given the database, when every table is checked, then no card, CVV, account or wallet field exists | D-023 | P |
| SYS-09 | Given a member role, when it reads another member's rows, then the database refuses | T1 | P |
| SYS-10 | Given a marshal role, when it reads another assignment's rows, then the database refuses | T2 | P |
| SYS-11 | Given a marshal alert, when it is sent, then only the assignment's marshal receives it | NOTIF §8 | P |
| SYS-12 | Given the manifest lock, when a change is attempted through the API (not only the screen), then the lock is enforced on the server | D-037 | P |
| SYS-13 | Given a cutoff, when it is calculated, then Africa/Lagos time is used | A15, D-032 | P |
| SYS-14 | Given any state change, when it is saved, then a transition record and an audit record are written in the same operation | T15, ADR-0002 | P |
| SYS-15 | Given a notification that fails after all retries, when it is dead-lettered, then an administrator alert is raised | I06, BACKEND §4 | P |
| SYS-16 | Given a restored backup, when the counts of bookings, payments and riders are compared, then they match the source | RISK-001 | P |
| SYS-17 | Given a paused database project, when the runbook is followed, then service is restored and verified | I07, DEVOPS §8 | P |
| SYS-18 | Given every screen in the three apps, when they are checked, then no cash or POS option appears | D-033 | P |

---

## 7. Coverage check

| Role | Criteria | Level P (before pilot) | Level L (after pilot) |
|---|---|---|---|
| Member | 40 | 38 | 2 (MEM-33, MEM-38) |
| Guest | 12 | 11 | 1 (GST-12) |
| Marshal | 21 | 20 | 1 (MAR-18) |
| Administrator | 25 | 23 | 2 (ADM-19, ADM-21) |
| Cross-cutting | 18 | 18 | 0 |
| **Total** | **116** | **110** | **6** |

Counts are checked by the test-mapping step in the frontend-first plan (`ROADMAP/DEVELOPMENT-STRATEGY.md`). Any scenario marked POLICY in the scenario table must be covered by at least one criterion or be listed as deferred with its policy ID.
