# API Contracts

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Backend/Systems Engineer
**Decisions:** D-003, D-004, D-005, D-006, D-023, D-025 · **Open issues:** OI-029, OI-033

Names are proposed. Parameter types are logical. Every mutating call takes `p_idem` (idempotency key) and returns the same result for the same key.

---

## 1. Conventions

**Result envelope**

```ts
type Ok<T>  = { ok: true;  data: T; correlationId: string };
type Err    = { ok: false; code: ErrorCode; message: string; details?: Record<string, unknown>; correlationId: string };
type Result<T> = Ok<T> | Err;
```

**Error codes (initial set)**

| Code | Meaning |
|---|---|
| `UNAUTHENTICATED` | No valid session |
| `FORBIDDEN` | Role or ownership check failed |
| `NOT_APPROVED` | Member or guest not approved for this action |
| `BOOKING_CLOSED` | Programme or assignment not open |
| `SEATS_UNAVAILABLE` | Not enough seats under lock |
| `HOLD_EXPIRED` | Hold passed its expiry |
| `ILLEGAL_TRANSITION` | Not in the state machine |
| `REASON_REQUIRED` | Action needs a reason |
| `CUTOFF_PASSED` | Outside cancellation window |
| `DUPLICATE` | Idempotency key reused with different input |
| `VALIDATION_FAILED` | Input does not match schema |
| `PROVIDER_UNAVAILABLE` | Payment provider call failed (retryable) |

**Auth.** Calls from the browser use the user's session (`authenticated` role). Edge Functions that the provider calls use no user session; they verify the provider signature and call functions under the `service` server role.

---

## 2. Database functions (RPC, called from the client)

| Function | Inputs (logical) | Returns | Allowed roles | Notes |
|---|---|---|---|---|
| `submit_application` | full_name, phone_e164, referred_by_name | application id | Authenticated, not yet member | Creates `pending` |
| `decide_application` | application id, decision (`approve`, `reject`, `needs_info`), reason | status | Admin | Reason required for reject and needs_info |
| `invite_guest` | name, phone (optional) | invite id, link token (shown once) | Member (approved) | Token stored as hash |
| `redeem_invite` | token | guest id, status `approved` | Authenticated | Path G2; rate limited (SECURITY) |
| `create_programme` | kind, name, times, price, currency, refund_rule_ref | programme id, status `draft` | Admin | Special events are `kind = special_event` |
| `configure_assignment` | programme id, route id, bus id, marshal profile id, capacity | assignment id | Admin | Marshal must be a `marshal` role holder |
| `publish_programme` | programme id | status `published` | Admin | Guards in STATE-MACHINES §10 |
| `set_booking_state` | assignment id or programme id, to (`open`, `closed`, `paused`) | status | Admin | Writes transition |
| `hold_seats` | assignment id, leg, riders[] (rider type, profile or guest id, display name), p_idem | booking id, reference, `hold_expires_at`, status `held` | Member (own), Marshal (walk-on), Admin | Row lock on assignment; returns `SEATS_UNAVAILABLE` if short |
| `confirm_free_booking` | booking id | status `confirmed` | Member (own, free only) | Rejects if programme has a price |
| `cancel_booking` | booking id, reason | status `cancelled` or `cancel_pending` | Member (own, in window), Marshal (own assignment), Admin | One function for all roles (PRD §6 item 3) |
| `board_rider` | manifest entry id | board status `boarded` | Marshal (own assignment), Admin | Writes manifest transition |
| `mark_no_show` | manifest entry id, reason optional | board status `no_show` | Marshal (own), Admin | Closing the list is a separate call |
| `remove_rider` | manifest entry id, reason | board status `removed` | Marshal (own), Admin | Reason required |
| `add_walk_on` | assignment id, leg, name, rider type, host profile id optional, reason | manifest entry id | Marshal (own), Admin | Reason required |
| `record_correction` | entity type, entity id, corrected value, reason | correction id | Admin | Supersession only (OI-012) |
| `request_refund` | payment id, reason | refund id, `requested` | Member (own), System | Eligibility by refund rule |
| `decide_refund` | refund id, decision, reason | refund status | Admin | |
| `create_support_report` | category, booking id optional, programme id optional, description | report id, reference, `submitted` | Member, Marshal | Pre-fills booking reference in the app |
| `transition_support_report` | report id, to, note (internal or reporter-visible) | status | Admin (assigned owner) | Reopen requires reason |
| `open_incident` | assignment id, kind, severity, description | incident id, `open` | Marshal (own), Admin | Notifies riders for breakdown or cancel |
| `transition_incident` | incident id, to, note | status | Admin | |
| `join_waitlist` | programme id, assignment id (optional), leg, riders[] | waitlist entry id, `waiting`, rank | Member (own), Admin | Bus or leg at capacity (D-030) |
| `leave_waitlist` | waitlist entry id, reason optional | status `withdrawn` | Member (own), Admin | |
| `offer_waitlist_seats` | assignment id | entries offered | System, Admin | Called when a seat is released or a bus is added; priority order |
| `accept_waitlist_offer` | waitlist entry id, p_idem | booking id, `held` | Member (own) | Offer open; calls `hold_seats` internally |
| `decline_waitlist_offer` | waitlist entry id | status `declined` | Member (own) | |
| `expire_waitlist_offers` | none | count expired | System (scheduler) | Expired offers pass the next entry the offer |
| `mark_assignment_departed` | assignment id, leg | status `departed` | Marshal (own), Admin | Closes boarding for the leg |

---

## 3. Edge Function endpoints

| Endpoint | Caller | Method | Purpose | Auth |
|---|---|---|---|---|
| `/functions/v1/start-payment` | Browser (authenticated) | POST | Creates provider order for a `held` booking. Returns hosted checkout URL | User session; booking owned by user |
| `/functions/v1/paystack-webhook` | Paystack | POST | Verified event receiver | `x-paystack-signature` (HMAC-SHA512 of raw body, Verify) |
| `/functions/v1/opay-webhook` | OPay | POST | Verified callback receiver | Signature per OPay callback spec (Verify, OI-033) |
| `/functions/v1/dispatch-notifications` | pg_cron | POST | Sends queued outbox rows | Server secret |
| `/functions/v1/reconcile-payments` | pg_cron | POST | Status-queries aged `redirected` payments | Server secret |
| `/functions/v1/expire-holds` | pg_cron | POST | Calls `expire_holds()` (also callable as SQL) | Server secret |

**Webhook processing contract**

1. Read the raw body; verify the signature with the provider secret. Reject with 401 on mismatch. Do not parse before verifying.
2. Insert into `payment_events` with `(provider, provider_event_id)` unique. On conflict, return 200 and stop (idempotent).
3. Call `apply_payment_event(event id)` in a transaction. It runs the payment and booking transitions in STATE-MACHINES §3.
4. Return 200 quickly. Failures inside step 3 are stored on the event row (`outcome`), not thrown back to the provider in a way that causes unbounded retries.
5. Never log the raw body. Log event ID, type and outcome only.

**start-payment contract**

- Input: `{ bookingId, provider: 'paystack' | 'opay' }`. No amounts from the client: the amount is read from the booking and programme.
- Output: `{ redirectUrl, providerReference, expiresAt }`.
- Side effects: payment row `pending` then `redirected`. If the provider call fails, payment stays `pending` and the response is `PROVIDER_UNAVAILABLE` (retryable).

---

## 4. Realtime channels

| Channel | Who subscribes | Carries |
|---|---|---|
| `assignment:{id}:seats` | Member booking screen, Admin fleet | Seat count changes (derived view, not raw ledger) |
| `assignment:{id}:manifest` | Marshal, Admin | Board status changes for the assignment |
| `profile:{id}:inbox` | Member, Marshal | New notifications and report updates |

Subscriptions are read-only. A change is always made by calling a function.

---

## 5. Versioning

Functions are named as written. A breaking change adds `_v2`. Edge Function paths are versioned in the path when breaking (`/v2/start-payment`). Changes are recorded as decisions when they affect a state machine.
