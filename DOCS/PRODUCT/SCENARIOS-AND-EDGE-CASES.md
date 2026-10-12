# Scenarios and Edge Cases

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Decisions:** D-005, D-008, D-009, D-010, D-011, D-023, D-025, D-027 to D-044 · **Open issues:** OI-012, OI-014, OI-017, OI-018, OI-019, OI-020, OI-022, OI-036, OI-038
**Feeds:** `TESTING/TEST-STRATEGY.md` (test cases), `GOVERNANCE/DEPARTMENT-POLICY-REGISTER.md` (policy IDs P-01 to P-29)

---

## 1. How to read this

**Trip types**

| Code | Trip type |
|---|---|
| O | Single outbound trip |
| R | Single return trip (return-only rider) |
| RT | Round trip (outbound and return) |
| G | Group booking (host books for named riders) |
| SE | Special event (paid) |
| SUN | Recurring Sunday service (free) |
| ALL | Applies to every trip type |

**Status**

| Status | Meaning | What happens next |
|---|---|---|
| Decided | A recorded decision gives the outcome | Build and test it |
| Designed | Follows from the state machines; no policy decision needed | Build and test it |
| POLICY | The department must write the rule | Owner in the register drafts it; the build waits or uses a stated default |
| DECISION | A sponsor or reconvene decision is needed | Goes to the decision log |

Every POLICY row cites a register ID (P-xx). If a row needs an answer for the pilot, the register marks it as a pilot gate.

---

## 2. Booking basics

| ID | Trip | Scenario | Expected outcome | Status | Ref |
|---|---|---|---|---|---|
| A01 | O | Outbound booking, bus has seats | Held; confirmed (free) or paid; one outbound manifest entry | Designed | STATE-MACHINES §1 |
| A02 | R | Return-only booking | One return manifest entry; no outbound entry; boards on return list | Decided | PROGRAMMES §2 |
| A03 | RT | Round trip, both legs have seats | Two manifest entries, one per leg; one price per rider | Decided | D-039 |
| A04 | RT | Round trip, outbound full, return has seats | Hold fails for the full leg with SEATS_UNAVAILABLE. Member is offered: join the outbound waitlist, or book the return leg only. Whether a round trip can be split this way is not decided | POLICY | P-06 |
| A05 | RT | Round trip, member wants outbound now and return later (different bus) | Each leg is its own assignment; the two legs are separate bookings or one booking with two assignments. Rule not decided | POLICY | P-06 |
| A06 | G | Host books for four (host plus three riders), one payment | One booking, four riders, one payment, every rider on the manifest | Decided | PAY-3, D-011 |
| A07 | G | Host books for four, one rider removed before payment | Total recalculated; payment starts only after the change | Designed | BACKEND §2 |
| A08 | SUN | Member books free Sunday seat with a guest | Free; guest must be approved (invite link path or public path) | Decided | D-040, PROGRAMMES §4 |
| A09 | SE | Member books paid special event for self only | Price per rider × riders; provider checkout | Decided | PAY-2, D-033 |
| A10 | SE | Special event falls on a Sunday | Still paid. Never the free path | Decided | PROGRAMMES §1 |
| A11 | SE | Special event with no marshal or bus assigned | Booking cannot open (state guard) | Designed | STATE-MACHINES §10 |
| A12 | ALL | Member tries to book for a person who is not a member or approved guest | Refused. Route: guest invite or public registration | Decided | D-028, PROGRAMMES §4 |
| A13 | ALL | Booking attempted after the booking window closes | Refused with BOOKING_CLOSED and the next available programme | Designed | STATE-MACHINES §5 |
| A14 | ALL | Booking attempted at the exact moment the window closes | Server time decides. Boundary (open or closed) is the window's own rule | Designed | BACKEND §2 |
| A15 | ALL | Booking across midnight, Lagos time | Cutoffs and windows use Africa/Lagos, not the phone's clock | Designed | D-032 |

---

## 3. Capacity, waitlist and overflow

| ID | Trip | Scenario | Expected outcome | Status | Ref |
|---|---|---|---|---|---|
| B01 | O | Two members tap confirm on the last seat at the same moment | One succeeds. The other gets SEATS_UNAVAILABLE and the waitlist offer | Decided | ADR-0002, D-030 |
| B02 | O | Bus full; member joins waitlist | Waiting. Rank: first-timer guests first, then join time | Decided | D-030, D-034 |
| B03 | O | Seat released by cancellation; top waiting rider is offered | Offer for two hours; push and SMS sent | Decided | D-035, D-028 |
| B04 | O | Offer accepted within two hours | Hold created through the normal booking path; payment follows | Designed | STATE-MACHINES §11 |
| B05 | O | Offer not accepted in two hours | Expired; next rider in priority is offered | Decided | D-035 |
| B06 | O | Offer declined | Declined; next rider is offered | Designed | STATE-MACHINES §11 |
| B07 | O | Bus full; admin adds an extra bus | New assignment; waitlist offered; a marshal must be assigned | Decided | D-030, D-005 |
| B08 | O | Bus full; no extra bus can be found | Waitlist remains. What the department tells waiting riders and what they are offered is not decided | POLICY | P-05 |
| B09 | O | First-timer guests fill the bus before waiting members | Members are displaced. Monitored per bus; reviewed after pilot | Decided (monitor) | D-040, RISK-012 |
| B10 | RT | Round-trip rider waiting for both legs; only one leg opens | Offer on the open leg only, or wait for both. Not decided | POLICY | P-06 |
| B11 | R | Return-only rider waiting; return leg full, outbound empty | Waitlisted on the return leg only. Allowed | Designed | D-025 axes |
| B12 | ALL | Admin closes a bus while people are waiting | Waitlist frozen; reopening the bus resumes offers | Designed | STATE-MACHINES §6 |
| B13 | ALL | Route has three buses; one is full, two are empty | Member chooses a bus. Whether the system may assign any bus on the route is not decided | POLICY | P-05 |
| B14 | ALL | Same member taps confirm from two devices | Idempotency key: one booking | Designed | ADR-0002 §5 |
| B15 | ALL | Member holds many seats and lets them expire | Concurrent holds capped; repeated expiry flagged to admin | POLICY | P-08, OI-017 |
| B16 | ALL | Admin changes bus capacity down after bookings exist | Confirmed riders are not removed. Capacity cannot go below confirmed riders; correction needed | Designed | DATA-MODEL §2.2 |

---

## 4. Payments

| ID | Trip | Scenario | Expected outcome | Status | Ref |
|---|---|---|---|---|---|
| C01 | SE | Payment succeeds normally | Booking confirmed; manifest updated; member notified | Designed | PAYMENTS-DESIGN §3 |
| C02 | SE | Member pays, closes the browser before returning | Webhook confirms; member sees confirmation on next open | Designed | ADR-0003 |
| C03 | SE | Return page opened without a payment | "Checking" state. No confirmation | Designed | ADR-0003 |
| C04 | SE | Payment declined | Failed; hold stays until expiry; member may retry | Designed | PAYMENTS-DESIGN §3 |
| C05 | SE | Payment abandoned | Expired; seats released | Designed | STATE-MACHINES §3 |
| C06 | SE | Webhook never arrives | Reconciliation status query after the window | Designed | OI-020 |
| C07 | SE | Same webhook delivered twice | Second is a no-op | Designed | API-CONTRACTS §3 |
| C08 | SE | Webhook with bad signature | Rejected 401. No state change | Designed | THREAT-MODEL T6 |
| C09 | SE | Webhook amount differs from booking amount | Not confirmed. reconciliation_required | Designed | PAYMENTS-DESIGN §9 |
| C10 | SE | Provider down when payment starts | PROVIDER_UNAVAILABLE. Nothing charged. Retry | Designed | API-CONTRACTS §3 |
| C11 | SE | Paid, but hold expired during a slow payment | reconciliation_required. Reinstate if the seat is still free, or refund. The rule is not decided | POLICY | P-12, P-01 |
| C12 | SE | Member relies on cash and cannot pay digitally | Cannot book under D-033. Assisted digital payment or exception not decided | POLICY | P-12, RISK-011 |
| C13 | SE | Refund requested before cutoff (12 hours before departure) | Admin approves; provider refund. Amount rule not decided | POLICY | P-01, D-032 |
| C14 | SE | Refund requested after cutoff | Denied by default. Exceptions and appeal not decided | POLICY | P-01, P-21 |
| C15 | SE | Member cancels in window; refund approved | requested → approved → processing → completed | Designed | STATE-MACHINES §4 |
| C16 | SE | Refund fails at the provider | Failed. Admin queue. Retry is an admin action | Designed | STATE-MACHINES §4 |
| C17 | SE | Refund requested twice | One refund record | Designed | ADR-0002 §5 |
| C18 | SE | Payer changed bank or phone since paying | Refund goes to the original provider reference. Name check rule not decided | POLICY | P-29 |
| C19 | ALL | Provider charges fees; refund includes or excludes fees | Not decided | POLICY | P-13, P-29 |
| C20 | ALL | Price or waiver for a member in financial need | No waiver rule exists | POLICY | P-13 |

---

## 5. Cancellation

| ID | Trip | Scenario | Expected outcome | Status | Ref |
|---|---|---|---|---|---|
| D01 | O | Member cancels confirmed free booking in window | Cancelled; seat released; waitlist offer | Designed | STATE-MACHINES §1 |
| D02 | SUN | Member cancels free Sunday seat after the cutoff | Online cancellation blocked. Contact the marshal or office. Whether a no-show rule applies is not decided | POLICY | P-07, P-08 |
| D03 | RT | Member cancels the outbound leg only | Leg cancellation. Whether allowed, and any refund, not decided | POLICY | P-06 |
| D04 | RT | Member cancels the return leg after boarding outbound | Same as D03; the outbound boarding stays on record | POLICY | P-06 |
| D05 | ALL | Marshal removes a rider at the bus (rider decides not to travel) | Removed with reason. Refund not decided (default: none) | POLICY | P-07, P-01 |
| D06 | ALL | Admin cancels a booking for a member | Reason required; member notified | Designed | STATE-MACHINES §1 |
| D07 | SE | Member cancels while redirected to checkout | Hold released. If payment later succeeds, reconciliation applies | Designed | PRD §6 item 2 |
| D08 | SE | Special event cancelled after payments | Refund requests for every paid booking. Amount rule pending | POLICY | P-11, P-01 |
| D09 | SUN | Recurring Sunday service cancelled | All bookings cancelled; notify; waitlist closed | Designed | STATE-MACHINES §5 |
| D10 | ALL | Cancellation after the manifest lock (30 minutes before departure) | Admin approval with reason | Decided | D-037, D-041 |
| D11 | O | Rider does not show up | No-show recorded. Non-refundable by default | POLICY | P-07 (liaison, 2026-10-07, truth 5) |
| D12 | ALL | Same member no-shows repeatedly | Consequence not decided (warning, booking limit, or none) | POLICY | P-07, OI-017 |

---

## 6. Bus and operations

| ID | Trip | Scenario | Expected outcome | Status | Ref |
|---|---|---|---|---|---|
| E01 | O | Bus is 40 minutes late | Incident (late). Riders notified. Manifest unchanged. How long the bus waits is not decided | POLICY | P-04 |
| E02 | O | Bus does not come at all | Incident (bus cancelled). Riders notified. Rebook offer or refund. Not decided | POLICY | P-03, OI-019 |
| E03 | O | Bus breaks down mid-route | Incident (breakdown). Replacement bus or taxi. Who pays and refund rule not decided | POLICY | P-03 |
| E04 | O | Marshal absent at the bus | Admin reassigns (D-005). Riders notified. Replacement marshal sees the manifest | Decided | D-005 |
| E05 | O | Rider boards the wrong bus | Marshal corrects with reason; correction record | Designed | STATE-MACHINES §12 |
| E06 | R | Return-only rider not on the return manifest | Before the lock: walk-on. After the lock: admin approval (D-041) | Decided | D-037, D-041 |
| E07 | RT | Round-trip rider boarded outbound, does not board return | Return awaits → no-show on the return leg only | Designed | D-025 |
| E08 | ALL | Admin changes the pickup point after bookings | Riders notified. Right to withdraw without penalty not decided | POLICY | P-26 |
| E09 | ALL | Rider expects one pickup, is assigned another | Correction; notify rider | Designed | STATE-MACHINES §12 |
| E10 | ALL | Bus route changes at the last minute | Notify all riders. Refund rule if the change is material not decided | POLICY | P-26 |
| E11 | SE | Venue or time changed after bookings | Correction; notify; right to cancel with refund not decided | POLICY | P-11 |
| E12 | ALL | No mobile signal at the bus park | Printed manifest; "last synced" banner; offline export (R-007) | Decided | R-007 |
| E13 | ALL | Marshal's phone dies while boarding | Printed manifest; admin reconciles by correction later | Designed | R-007, STATE-MACHINES §12 |
| E14 | ALL | Two marshals board the same rider | Second tap shows "already boarded". No double record | Designed | STATE-MACHINES §2 |
| E15 | ALL | Rider asks to be removed after boarding | Correction only; reason required | Designed | STATE-MACHINES §2 |
| E16 | ALL | Unregistered person arrives at the bus | Walk-on before lock; admin approval after lock. Fee for walk-on not decided | Decided (approval); POLICY (fee) | D-041, P-13 |
| E17 | ALL | Child travels without a parent or guardian on the bus | Safeguarding rule needed before any child rider is accepted | POLICY | P-16 |
| E18 | ALL | Rider uses a wheelchair or needs an accessible bus | Accessibility rule and bus assignment needed | POLICY | P-17 |
| E19 | ALL | Programme cancelled on the day (weather, emergency) | Notify all; refund per P-01; not decided | POLICY | P-25 |
| E20 | ALL | Bus filled by guests (no cap, D-040) | Monitored; admin acts on the day under P-09 | Decided (monitor) | D-040 |
| E21 | ALL | Driver or marshal reports a rider behaving unsafely | Safety and removal rule needed | POLICY | P-14, P-15 |
| E22 | ALL | Emergency during travel (accident, medical) | Emergency procedure and notifications needed | POLICY | P-15 |
| E23 | ALL | Marshal wants to add or change a rider on the bus | Walk-on rules and approvals apply | Decided | D-037, D-041 |

---

## 7. Membership and registration

| ID | Trip | Scenario | Expected outcome | Status | Ref |
|---|---|---|---|---|---|
| F01 | ALL | First-timer applies; admin decides within 24 hours | Decided, with reminder at 12 hours | Decided | D-044 |
| F02 | ALL | Application rejected | Reason recorded; contact route shown; no booking | Designed | AUTH-DESIGN §3 |
| F03 | ALL | Application needs more information | needs_info; member responds; back to pending | Designed | STATE-MACHINES §9 |
| F04 | ALL | Applies Friday night for Sunday; admin unreachable | 24-hour rule breached. Escalation to second admin (D-042) | Decided | D-042, D-044 |
| F05 | ALL | Name matches the register; phone differs | Flagged for review. Automatic match rule blocked | DECISION | D-007, AUTH-2 |
| F06 | ALL | Same person registers twice | Duplicate review item; not merged automatically | DECISION | D-007 |
| F07 | ALL | Invite link used more times than allowed | Refused when uses are exhausted | Designed | AUTH-DESIGN §5 |
| F08 | ALL | Invite link forwarded to a stranger | Anyone with the link can register as a guest. Link validity and host visibility not decided | POLICY | P-09 |
| F09 | ALL | Guest later wants to be a member | First-timer route with approval | Designed | PROGRAMMES §4 |
| F10 | ALL | Member suspended while they have future bookings | Future bookings held. Treatment of confirmed riders not decided | POLICY | P-10 |
| F11 | ALL | Member leaves the church with future bookings | Retirement rule and bookings not decided | POLICY | P-10 |
| F12 | ALL | One-time code does not arrive | Retry with cooldown. Support route | Designed | AUTH-DESIGN §9 |
| F13 | ALL | Member changes phone number | Admin verifies identity; change audited | Designed | AUTH-DESIGN §8 |
| F14 | ALL | Family shares one phone and account | Account sharing rule not decided | POLICY | P-10, P-22 |
| F15 | ALL | Church register import contains errors | Import batch reversible; errors reviewed by steward | Designed | DATA-MODEL §2.1 |

---

## 8. Special events and approvals

| ID | Trip | Scenario | Expected outcome | Status | Ref |
|---|---|---|---|---|---|
| G01 | SE | Admin creates event; second admin unavailable | Cannot open booking until second admin approves | Decided | D-042 |
| G02 | SE | Event time changed after bookings | Correction; notify riders | Designed | PROGRAMMES §1.2 |
| G03 | SE | Event sold out | Waitlist (D-030) | Decided | D-030 |
| G04 | SE | Price changed after some people paid | Paid members unaffected. Price change rule not decided | POLICY | P-11, P-13 |
| G05 | SE | Duplicate event created by mistake | Cancel with reason, never delete | Designed | STATE-MACHINES §5 |
| G06 | SE | Event cancelled while waitlist exists | Waitlist closed; waitlisted riders told | Designed | STATE-MACHINES §11 |

---

## 9. Support, corrections and disputes

| ID | Trip | Scenario | Expected outcome | Status | Ref |
|---|---|---|---|---|---|
| H01 | ALL | Member says marshal marked them no-show wrongly | Support report; correction by admin with reason; dispute route | Decided | D-042, OI-012 |
| H02 | SE | Payment taken, seat not confirmed | Payment problem to finance contact; reconciliation | Decided | D-042, OI-020 |
| H03 | ALL | Member reports an app bug during booking | App bug; admin to developer | Decided | D-042 |
| H04 | ALL | Dispute between rider and marshal at the bus | Who decides on the spot is not decided | POLICY | P-14, P-23 |
| H05 | ALL | Internal note shown to the member by mistake | Must never happen; tested by RLS | Designed | SUPPORT §6 |
| H06 | ALL | Admin loses second-factor device | Second admin resets; audited | Designed | OI-014, D-029 |
| H07 | ALL | Correction after the record was exported | Export is a snapshot; correction is a new record | Designed | DATA-MODEL §3 |
| H08 | ALL | Who can appeal a correction | Appeal route not decided | POLICY | P-21 |

---

## 10. Technical and environment

| ID | Trip | Scenario | Expected outcome | Status | Ref |
|---|---|---|---|---|---|
| I01 | ALL | Phone goes offline while confirming | No hold created; member told to retry. No duplicate | Designed | ADR-0002 §5 |
| I02 | ALL | Double tap on confirm | One booking | Designed | ADR-0002 §5 |
| I03 | ALL | Session expires mid-booking | Sign in again; draft kept if possible | Designed | AUTH-DESIGN §7 |
| I04 | ALL | Old app version after a release | Forced refresh on next open; no update during duty | Designed | OPTIMISATION §5 |
| I05 | ALL | Push permission denied | Inbox and SMS or email still deliver | Designed | NOTIFICATIONS §5 |
| I06 | ALL | Notification send fails for 30 minutes | Retry, then dead letter, then admin alert | Designed | BACKEND §4 |
| I07 | ALL | Supabase project paused on a Sunday | Outage. Printed manifest. Restore runbook | Designed | RISK-009, DEVOPS §8 |
| I08 | ALL | Clock on the marshal's phone wrong | Server time used for all state; display only uses device time | Designed | OPTIMISATION §7 |
| I09 | ALL | Quiet hours: an urgent bus change at night | Critical messages bypass quiet hours | Designed | NOTIFICATIONS §4 |
| I10 | ALL | Communications sent to the wrong recipient | Broadcast needs a second admin for segments over a set size (proposal, not decided) | POLICY | P-24 |

---

## 11. Totals and gaps

| Status | Count | Meaning |
|---|---|---|
| Decided | 27 | Outcome is recorded |
| Designed | 57 | Follows from the state machines |
| POLICY | 39 | Department must write the rule (each row cites a P-xx register ID) |
| DECISION | 2 | F05 and F06, blocked on the reconvene (D-007) |
| **Total** | **125** | |

The POLICY rows are the department's work list. They are grouped in `GOVERNANCE/DEPARTMENT-POLICY-REGISTER.md`.

---

## 12. How these become tests

Each row is a test candidate. Decided and Designed rows enter the test suite now. POLICY rows enter with the default stated in the register, or are marked pending until the policy is ratified. QA owns the mapping (OI-035).
