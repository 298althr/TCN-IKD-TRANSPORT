# Department Policy Register

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Purpose:** Every rule the transport department (or the church) must write for the system to run. The product can hold a default for a few weeks; it cannot invent policy. Each policy is linked to the scenarios that need it (`PRODUCT/SCENARIOS-AND-EDGE-CASES.md`).

**Who writes:** the Transport Department drafts (Q-014, D-038). The sponsor approves policies that involve money or a change of church rule. The PM supplies the decision list as input, not as a draft.

**Priority:** **Pilot** = must be ratified before the pilot. **Build** = needed before that feature is built. **Later** = after the pilot.

---

## 1. Policies already partly answered

| Policy | What is answered | Still to write | Ref |
|---|---|---|---|
| Booking window | Friday 6 PM rule for Sunday programmes; per-programme window | Exact window for special events | PRD req 6, liaison truth |
| Cancellation cutoff | 12 hours before departure by default; admin can override per programme | Department confirms the number; exceptions | D-032 |
| Manifest lock | 30 minutes before departure; additions after lock need admin approval | Walk-on approval route for the lock period | D-037, D-041 |
| Price | One price per rider per programme, any leg | Fees, waivers, price changes | D-039 |
| Guests | No cap at launch; admin monitors | Who may bring guests; invite validity; conduct | D-040, D-034 |
| Waitlist | Priority: first-timer guests, then join time; offer window 2 hours | What is said when no bus is found; bus choice on multi-bus routes | D-030, D-034, D-035 |
| Payments | Digital only (Paystack and/or OPay); no cash, no POS | Assisted payment for members without digital access | D-033, RISK-011 |
| Refunds | Department drafts from scratch | The whole refund rule | D-038, OI-036 |
| Support | Owners split by category; finance contact | Response targets confirmed; finance contact named | D-042 |
| Approvals | Second admin approves special events; 24-hour registration decision | Admin rota and escalation when unavailable | D-042, D-044 |
| Retention | Payments per finance period; attendance to counts after a year | The finance period; legal review | D-043, OI-038 |

---

## 2. Policies still to write

| ID | Policy | Why it is needed (scenarios) | Must decide | Priority | Drafts | Approves |
|---|---|---|---|---|---|---|
| P-01 | **Refund policy**: eligibility, amounts, cutoff exceptions, provider failures, refunds after an event is cancelled | C13, C14, C11, D08, C15 | Who is eligible; what is refunded (fees, partial); exceptions and who approves them; time to refund | Pilot | Department | Sponsor |
| P-02 | **Group and partial refunds**: one rider leaves a paid group | A07, A08, A09, A10 | Refund to host or rider; whether partial groups are allowed; late removals | Pilot | Department | Sponsor |
| P-03 | **Bus cancellation, breakdown and replacement** | E02, E03 | Notice period; replacement bus or taxi; who pays; refunds or rebooking; who tells riders | Pilot | Department | Sponsor |
| P-04 | **Late bus and waiting rule** | E01 | How long the bus waits; what happens to riders who are late | Pilot | Department | Admin lead |
| P-05 | **Overflow and bus-choice rules** | B08, B13 | What is said when no bus can be found; whether members may be auto-assigned to another bus | Pilot | Department | Sponsor |
| P-06 | **Round-trip and leg rules** | A04, A05, B10, D03, D04 | Can a round trip be split? Can a leg be cancelled? Refund for a cancelled leg | Pilot | Department | Sponsor |
| P-07 | **Attendance, no-show and removal** | D02, D05, D11, D12 | Definition of no-show; consequence of repeated no-shows; who may remove a rider at the bus | Pilot | Department | Sponsor |
| P-08 | **Booking limits and hold use** | B15, D02 | Concurrent holds allowed; cancellation after cutoff for free seats | Build | Department | Sponsor |
| P-09 | **Guest policy** | F08, E20, A08 | Who may bring guests; invite link validity and sharing; host responsibility; when monitoring triggers action | Pilot | Department | Sponsor |
| P-10 | **Membership status changes** | F10, F11, F14 | What happens to bookings when a member is suspended or leaves; account sharing | Pilot | Department | Sponsor |
| P-11 | **Special events**: changes, price changes and cancellation | G04, E11, D08 | Which changes need notice; right to cancel after a material change; cancelling a paid event | Pilot | Department | Sponsor |
| P-12 | **Payment failures and late payment** | C11, C12 | Reinstate a late-paid seat or refund; assisted digital payment for members without it | Pilot | Department | Sponsor |
| P-13 | **Prices, fees and waivers** | C19, C20, E16, G04 | Fee treatment on refunds; walk-on fees; waivers for people in financial need | Pilot | Department | Sponsor |
| P-14 | **Marshal duty and conduct** | H04, E21 | What a marshal may and may not do (add riders, change assignments); dispute handling at the bus; phone use on duty | Pilot | Department | Admin lead |
| P-15 | **Incident, safety and emergency procedure** | E21, E22 | Who calls emergency services; first aid; family notification; incident reporting | Pilot | Department | Sponsor |
| P-16 | **Safeguarding for minors and vulnerable adults** | E17 | Whether minors may travel alone; guardian consent; who may collect children | Pilot | Department with counsel | Sponsor |
| P-17 | **Accessibility** | E18 | Mobility needs; accessible bus assignment; how members ask | Pilot | Department | Sponsor |
| P-18 | **Privacy notice and consent** (OI-038) | Data collection at sign-up; all personal data | What is collected and why; consent wording; access and correction requests | Pilot | Department with counsel | Sponsor |
| P-19 | **Retention and archive** (D-043) | Data retention job | Finance period; attendance period; support reports; push endpoints | Pilot | Finance office | Sponsor |
| P-20 | **Member register stewardship** (OI-015) | F15, F05 | Who maintains the register; import cadence; who can change membership | Pilot | Department | Sponsor |
| P-21 | **Corrections and disputes** (OI-012) | H01, H07, H08, C14 | Who may correct a record; appeal route; response time | Pilot | Department | Sponsor |
| P-22 | **Admin and marshal access** (OI-014, OI-039) | F04, H06, F14 | Two admins; offboarding; second-factor enrolment; travel-day on-call rota | Pilot | Department | Sponsor |
| P-23 | **Support and response** (D-042) | H02, H03, H04 | Response targets confirmed; escalation to sponsor; finance contact | Pilot | Department | Sponsor |
| P-24 | **Communications** | I09, I10 | Which messages go out; quiet hours (proposal 22:00 to 05:00); who may broadcast; WhatsApp use | Pilot | Department | Sponsor |
| P-25 | **Programme cancellation on the day** | E19 | Who decides; how it is announced; refund link to P-01 | Pilot | Department | Sponsor |
| P-26 | **Pickup point and route changes** | E08, E10 | Notice period; rights to withdraw | Build | Department | Admin lead |
| P-27 | **Audit review and oversight** (OI-013) | Whole audit trail | Review cadence; who signs; what is reviewed | Build | Department | Sponsor |
| P-28 | **Business continuity** | E12, E13, I07 | Printed manifest; who prints; what staff do when the app is down | Pilot | Department | Admin lead |
| P-29 | **Financial controls** | C18, C19, C13 | Refund approval limits; reconciliation cadence; finance contact duties; provider statements | Pilot | Finance office | Sponsor |

---

## 3. Order of work for the department

1. **Before the pilot (25 policies, marked Pilot in section 2):** P-01, P-03, P-04, P-05, P-06, P-07, P-09, P-10, P-11, P-12, P-13, P-14, P-15, P-16, P-17, P-18, P-19, P-20, P-21, P-22, P-23, P-24, P-25, P-28, P-29. Start with the ones that stop a bus or cause a dispute on the day: P-01, P-03, P-05, P-07, P-12, P-14, P-16, P-22, P-23.
2. **Before the build of each feature (4 policies, marked Build in section 2):** P-02 before group refunds; P-08 before the hold build; P-26 before route editing; P-27 before audit views.
3. **After the pilot:** anything not needed by the pilot, reviewed with the first two programmes of data.

**Suggested starting point:** P-03 (bus does not come) and P-07 (no-show). They cover the two cases that occur most often and that the liaison described (non-shows and buses that cannot run).

---

## 4. What the product does until a policy is ratified

| Situation | Default |
|---|---|
| A policy is missing | Feature stays off, or the most conservative rule applies (no automatic refund, no automatic penalty, admin decides) |
| A default is used for the pilot | Labelled "provisional" in the app's admin view and in the register, with an expiry date |
| The default turns out to be wrong | Reopen the decision with evidence (AGENTS Part I §4) |

---

## 5. Open questions for the department

Sent to the liaison on 12 October:

- Owners and draft dates for each policy: THREAD-f06631f5 (`DOCS/MAIL/LIAISON/`), logged as Q-022
- Eight scenario checks against real practice: THREAD-4d94526b (`DOCS/MAIL/LIAISON/`), logged as Q-023

Both are recorded in `DECISION-LOGS/QA-LOG.md`, Batch 6.
