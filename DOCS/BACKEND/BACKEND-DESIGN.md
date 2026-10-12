# Backend Design

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Backend/Systems Engineer
**Decisions:** D-003 (proposed TTL hold, pending ratification), D-004, D-005, D-006, D-025 · **Open issues:** OI-001, OI-029, OI-032, OI-020

---

## 1. Layout

```
supabase/
  migrations/          # versioned SQL, applied in order, never edited after merge
  functions/           # Edge Functions (Deno): start-payment, paystack-webhook, opay-webhook,
                       #   dispatch-notifications, reconcile-payments, expire-holds
  tests/               # pgTAP suites (state machines, RLS, capacity)
  seed.sql             # reference data and non-personal fixtures only
packages/
  domain/              # pure TypeScript: enums for states, error codes, money helpers, zod schemas
apps/
  web/                 # Next.js (see FRONTEND)
```

`packages/domain` is the only code shared by the web app and Edge Functions. It contains no I/O.

---

## 2. Seat holds (D-003, proposed)

Requirement: two members must never both secure the last seat, and abandoned holds must not leak seats (PRD §6 item 1; QA invariant recorded at OI-001).

Approach: lock the bus-leg row, sum the ledger under the lock, and insert. The ledger is append-only; available seats are derived, never stored as a counter.

**DRAFT: illustrates ADR-0002. Not migrated, not reviewed.**

```sql
create or replace function transport.hold_seats(
  p_assignment uuid,
  p_leg        text,
  p_riders     jsonb,        -- [{ "type": "member"|"guest"|"walk_on", "profile_id": uuid?, "guest_id": uuid?, "name": text }]
  p_idem       text
) returns jsonb
language plpgsql
security definer
set search_path = transport, public
as $$
declare
  v_actor   uuid := auth.uid();
  v_open    boolean;
  v_cap     int;
  v_taken   int;
  v_need    int := jsonb_array_length(p_riders);
  v_booking uuid := gen_random_uuid();
  v_expiry  timestamptz := now() + interval '15 minutes';   -- D-003 TTL, pending ratification
begin
  if v_actor is null then raise exception 'UNAUTHENTICATED'; end if;
  if not transport.is_approved_member(v_actor) then raise exception 'NOT_APPROVED'; end if;
  if v_need < 1 then raise exception 'VALIDATION_FAILED'; end if;

  -- idempotency: return the earlier result for the same key
  if exists (select 1 from transport.idempotency_keys where caller = v_actor and key = p_idem) then
    return (select response from transport.idempotency_keys where caller = v_actor and key = p_idem);
  end if;

  -- serialise every hold on this bus-leg
  select booking_open, seats_capacity into v_open, v_cap
    from transport.route_bus_assignments where id = p_assignment for update;
  if not coalesce(v_open, false) then raise exception 'BOOKING_CLOSED'; end if;

  select coalesce(sum(delta), 0) into v_taken
    from transport.seat_ledger where assignment_id = p_assignment and leg = p_leg;
  if v_taken + v_need > v_cap then raise exception 'SEATS_UNAVAILABLE'; end if;

  insert into transport.bookings (id, assignment_id, leg, booked_by_profile_id, status, hold_expires_at)
    values (v_booking, p_assignment, p_leg, v_actor, 'held', v_expiry);

  insert into transport.booking_riders (booking_id, rider_type, profile_id, guest_id, display_name, leg)
    select v_booking, r->>'type', (r->>'profile_id')::uuid, (r->>'guest_id')::uuid, r->>'name', p_leg
    from jsonb_array_elements(p_riders) r;

  insert into transport.seat_ledger (assignment_id, leg, delta, reason, booking_id)
    values (p_assignment, p_leg, v_need, 'hold', v_booking);

  insert into transport.booking_transitions (booking_id, from_status, to_status, actor_profile_id, actor_role)
    values (v_booking, null, 'held', v_actor, 'member');

  insert into transport.audit_events (actor_profile_id, action, entity_type, entity_id, after_state, source)
    values (v_actor, 'booking.held', 'booking', v_booking, 'held', 'ui');

  insert into transport.idempotency_keys (caller, key, response)
    values (v_actor, p_idem, jsonb_build_object('ok', true, 'booking_id', v_booking, 'status', 'held'));

  return jsonb_build_object('ok', true, 'booking_id', v_booking, 'status', 'held', 'hold_expires_at', v_expiry);
end $$;

revoke execute on function transport.hold_seats(uuid, text, jsonb, text) from public;
grant  execute on function transport.hold_seats(uuid, text, jsonb, text) to authenticated;
```

**Notes on the draft**

- The lock is taken before the ledger is read, so the read is consistent with the lock.
- Holds and confirmations both count against capacity. Expiry releases them.
- `search_path` is pinned; `public` is revoked; only `authenticated` may execute.
- The idempotency lookup should be extended to check the key's stored input hash (`DUPLICATE` if reused with different input).
- A load test (k6, `TESTING/`) must show zero overbooking at 2x capacity contention.

---

## 3. Expiry

`expire_holds()` runs every minute from pg_cron.

- Select held bookings past `hold_expires_at` with `for update skip locked` so concurrent runs do not double-process.
- For each: set `expired`, write a ledger release (`reason = 'expire'`), write transition and audit.
- It never touches `confirmed` bookings, and a payment that arrives later is handled by reconciliation, not revived.

---

## 4. Outbox and notifications

Every event that needs a message inserts into `notifications_outbox` in the same transaction as the state change. `dispatch-notifications` runs every minute, takes a batch with `skip locked`, sends, and updates the row.

| Attempt | Delay before retry |
|---|---|
| 1 | immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |
| after 5 | status `dead`, admin alert |

Retry delays are a proposal. Dead letters are visible in the admin queue.

---

## 5. Payments on the backend

Covered in `../PAYMENTS/PAYMENTS-DESIGN.md`. Backend contract: `start-payment` reads the amount from the database, never from the request. `apply_payment_event` is the only function allowed to move a payment to `succeeded`.

---

## 6. Reconciliation (OI-020)

`reconcile-payments` runs every 10 minutes. It selects payments in `redirected` or `pending` older than the provider window and calls the provider status API. Any result is applied through `apply_payment_event` so it goes through the same path as a webhook. Missed webhooks are therefore recovered without a second code path.

---

## 7. Observability

- Correlation ID created at the edge (per request), passed into every function call and stored on each transition and audit row.
- Edge Function logs carry event IDs and outcomes, never bodies or personal data.
- Failed transitions, dead outbox rows, and webhooks with bad signatures are counted and surfaced in the admin overview.

---

## 8. Migrations and environments

- Migrations are SQL files in `supabase/migrations/`, applied by the Supabase CLI. Once merged, they are never edited; a fix is a new migration.
- Production schema is changed only by migration. The Supabase dashboard is read-only for schema in production.
- Seed data contains reference rows (roles, example bus labels) and no real personal data.
- Each environment has its own Supabase project and its own secrets (`DEVOPS/ENVIRONMENT-VARIABLES.md`).

---

## 9. Testing hooks

- pgTAP covers: state machine legality (every illegal transition rejected), capacity under lock, idempotency, RLS per role, audit row presence.
- Edge Functions have contract tests using recorded provider payloads with secrets removed.

---

## 10. Open items specific to this design

- Whether `hold_seats` takes one leg or both legs for round-trip riders in one call (leaning one call, two ledger writes).
- Hold TTL value (D-003 proposal 15 minutes; QA and backend to confirm).
- Concurrent holds per member limit (OI-017).
