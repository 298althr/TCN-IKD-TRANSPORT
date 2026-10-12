# Risk Assessment & Loophole Review — TCN Transport System

**Status:** INTERNAL — not for church distribution (per sponsor direction)
**Method:** the immutability philosophy (`philosophy.md` — "immutability moves risk to the decision layer; every failure is a human-coordination failure") applied to the product spec, plus product-level loophole hunting.
**Date:** 2026-10-08 · Prepared by PM

---

## Part 1 — Philosophy-mapped loopholes (the human layer)

The philosophy's five failure modes, mapped to our design:

### L-1 · Shadow mutability — *the manual-payment path is our biggest leak*
**Loophole:** The liaison confirmed cash/manual payments are essential. If an Admin records a cash payment by any path other than the same booking state machine + audit events, the record and reality diverge — *worse than no audit*.
**Severity:** HIGH — this is the original WhatsApp problem wearing a uniform.
**Mitigation:** cash payment is a *payment method*, not a bypass — same states (`held → confirmed`), same audit event, actor = the recording Admin. Receipt-note field optional but encouraged. **Needs a decision record.**

### L-2 · Authority vacuum — *who can un-mark a no-show?*
**Loophole:** A marshal mis-taps "no-show," or an Admin's manual entry is wrong. Our audit is append-only — good — but we never defined **who may issue a correcting entry**, or how a member disputes a record.
**Severity:** HIGH — a wrongly-flagged no-show affects a real member's standing.
**Mitigation:** correction-by-supersession (philosophy §3.5): a new event that *points at* the wrong one; member-visible dispute request → Admin resolves; sponsor arbitrates admin-level corrections. Feeds OI-003.

### L-3 · Ossification / friction — *if correcting is hard, admins return to WhatsApp*
**Loophole:** The system's survival depends on the sanctioned path being the *easy* path (§3.3). Every correction that requires PM/dev involvement is a push back to side channels.
**Severity:** MEDIUM.
**Mitigation:** self-serve corrections for Admin/Marshal within their scopes; audited but instant.

### L-4 · Ceremony over substance — *an audit log nobody reads is decoration*
**Loophole:** We write immutable events, but no one reviews them. The first integrity failure would go unnoticed for months.
**Severity:** MEDIUM.
**Mitigation:** weekly Admin audit digest (auto-generated), sponsor-visible anomaly report. Cheap, native to the reporting engine.

### L-5 · Single-point knowledge — *same failure we're replacing, one level up*
**Loophole:** If one Admin is the only person who understands the system, we've rebuilt the single point of failure in software.
**Severity:** MEDIUM.
**Mitigation:** ≥2 trained Admins minimum; marshal rotation training; runbook owned by liaison.

### L-6 · Blame culture — *the audit trail must never be a weapon*
**Loophole:** If marshals/admins fear the record, they'll hide errors or delay entries — the record loses truth (§5).
**Severity:** MEDIUM.
**Mitigation:** corrections framed as normal workflow (supersede, don't punish); postmortems blameless by policy.

### L-7 · Register staleness — *the membership roll drifts from reality*
**Loophole:** We pre-load the member register (CSV). Members join/leave; the roll must have an owner and a refresh cadence, or the gate silently locks out real members.
**Severity:** MEDIUM.
**Mitigation:** register owned by Transport Dept (liaison), re-export cadence defined; "member not on roll" path exists — flagged-for-review, not rejected (this informs D-007).

### L-8 · Orphaned artifacts — *retirement paths missing*
Philosophy §3.7: everything sealed needs an owner + a way to stop relying on it. Applies to: expired holds (sweeper), stale waitlists, old programmes, marshals who leave.
**Severity:** LOW-MEDIUM. **Mitigation:** every entity gets lifecycle states including retired/expired; review in OI-003 pass.

---

## Part 2 — Product-level loopholes & risks

| ID | Loophole / risk | Severity | Where it bites |
|---|---|---|---|
| R-01 | **Seat-hold hoarding** — member repeatedly holds seats, lets them expire, starves real demand | HIGH | D-003 hold design needs: max concurrent holds, repeat-expiry counter feeding §3.7 quota |
| R-02 | **Group partial-refund** — host pays ₦10k for 4, one beneficiary cancels pre-event: ₦2,500 to *whom*? | HIGH | Saviour flagged; unresolved — goes on OI-001 reconvene agenda |
| R-03 | **Bus no-show / day-of cancellation** — bus doesn't come; 14 confirmed passengers stranded with no flow | HIGH | Needs: admin "bus cancelled" state → mass notify + auto-rebook/refund option |
| R-04 | **Paystack webhook missed** — member paid, webhook never arrived → seat shows pending, seat-hold expires | MEDIUM | Reconciliation job: poll transaction status for aged pending payments |
| R-05 | **Waitlist undefined** — prototype shows "join waitlist," no decision exists | MEDIUM | Decide: waitlist + auto-notify on release, or full = full |
| R-06 | **Cutoff edge** — "before event day" is ambiguous at 23:59 vs 00:01 | MEDIUM | QA flagged; define cutoff as programme departure time − N hours, explicit |
| R-07 | **Marshal device failure** — phone dies mid-boarding, manifest gone | MEDIUM | Printable manifest export + a second marshal's phone can host |
| R-08 | **Account sharing / roll bypass** — member credentials lent to non-member | LOW-MED | Membership gate + booking names must match roll identity |
| R-09 | **Phone change / ticket recovery** — member loses phone before Sunday | LOW-MED | Booking retrievable by ref + name at marshal desk |
| R-10 | **Admin misconduct** — manual cancellations/refunds abused | MED | All audited + sponsor-level review of admin actions (L-4 digest) |
| R-11 | **No-notification members** — push off, email unread → miss departure changes | LOW-MED | Marshal carries fallback comms; SMS is Phase 2 |
| R-12 | **Cash proof gap** — OI-002 narrowed: cash recorded but no proof artifact → unresolvable disputes later | MED | Optional receipt-photo field on manual-payment record (cheap storage) |

## Part 3 — What gets added to the work plan

1. **OI-001 reconvene agenda gains:** group partial-refund rule (R-02), waitlist policy (R-05), cutoff definition (R-06), correction authority (L-2), manifest lock time (liaison's question).
2. **OI-003 scope widens:** immutable/mutable classification must include correction-by-supersession paths.
3. **New requirement — "Bus cancelled" state** with mass-notify + rebook (R-03): currently absent from the BRD entirely.
4. **Payment reconciliation job** (R-04): poll aged pending payments — belongs in the scheduler that already exists (D-004).
5. **Cash-path integrity rule** (L-1): manual payment = payment method through the same state machine, never a side write.
6. **Admin audit digest** (L-4) — weekly auto-report to sponsor.
7. **≥2 admin policy** (L-5) — training/coverage requirement, sponsor-owned.

**Philosophy summary for the record:** the technical invariants (capacity transaction, append-only audit, webhook idempotency) are sound. The exposed layer is *who decides, who corrects, who reviews* — exactly what the philosophy predicts. Every HIGH above is a people-layer gap, not a code gap.
