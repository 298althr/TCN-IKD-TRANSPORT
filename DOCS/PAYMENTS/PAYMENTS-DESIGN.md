# Payments Design

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Integrations Specialist
**Decisions:** D-006, D-011, D-023, D-033 · **Open issues:** OI-018, OI-020, OI-025, OI-033, OI-036, OI-038

---

## 1. Principles

1. **The provider takes the money. The app records the outcome.** Nothing in this app touches card data (ADR-0003).
2. **Server confirms, not the browser.** The return page says "checking"; only verified events or server queries change payment state.
3. **Amounts come from the server.** The client sends a booking ID and provider choice. The amount is computed from the booking and the programme price.
4. **Money in minor units.** Naira in kobo as integers (`amount_minor`). No floating-point money.
5. **Every movement is an event.** Payment events are stored once each, redacted, and linked to the booking.

---

## 2. Price rules

| Case | Rule | Source |
|---|---|---|
| Sunday service | Free, no payment step | PAY-1 |
| Special event | Price per rider (currency NGN) × riders on the booking | PAY-2 |
| Group booking (host pays for named riders) | Single payment for the total; each rider listed on the receipt | PAY-3 to PAY-5, D-011 |
| Round trip | One price per rider per programme, whatever the leg (Q-015, D-039) | Decided |
| Return-only | Same price as a round-trip rider (Q-015, D-039) | Decided |

---

## 3. Flow: member pays for a special event

1. Member confirms riders; `hold_seats` creates `held` booking (15-minute hold, D-003 pending).
2. Member chooses provider (Paystack or OPay, per OI-025).
3. Browser calls `start-payment`. Server creates provider order with booking reference and amount. Returns hosted checkout URL.
4. Payment row: `pending` → `redirected`. Browser redirects to the provider's page.
5. Member pays on the provider page (card, transfer, USSD, or wallet depending on provider).
6. Provider sends a webhook (and returns the member to the return URL). Return URL shows "We are confirming your payment". It does not confirm.
7. Webhook: signature verified, event stored once, `apply_payment_event` moves payment to `succeeded` and booking to `confirmed` if still `held` and amount matches.
8. If the hold has already expired: payment goes to `reconciliation_required`. Admin sees it in the queue and decides (PRD §6 item 2).
9. Member sees confirmed ticket. Marshal manifest updated in real time.

**Failure branches:** declined → `failed` and booking stays `held` until expiry (member may retry); abandoned → `expired` and seats released by expiry job; provider unreachable at start → `PROVIDER_UNAVAILABLE`, nothing charged, retry allowed.

---

## 4. Flow: group payment (bulk, D-011)

- One booking may hold several riders (host plus named beneficiaries). All riders are held together or the whole request fails (no partial holds).
- Receipt lists every rider and the total. Each rider appears on the manifest.
- Partial cancellation of riders is not supported at MVP for paid bookings. Cancellation of the whole booking uses the refund path. Partial refunds: OI-018.

---

## 5. Reconciliation (OI-020)

- `reconcile-payments` runs every 10 minutes.
- Targets: payments `redirected` or `pending` older than the provider window (value to confirm per provider), and any `reconciliation_required` item.
- Each result is applied via the same `apply_payment_event` path. There is no second code path for recovered payments.
- A daily summary compares provider totals with succeeded payments in the database. Differences are an admin alert, not an automatic correction.

---

## 6. Refunds

| Step | Rule |
|---|---|
| Request | Member requests in window; admin cancels programme; or admin-initiated |
| Eligibility | Per refund rule (OI-036). **Provisional** only in the pilot, and every refund is admin-approved |
| Execution | Provider refund API where supported (D-006; Paystack assumed, verify). Otherwise manual, recorded with the provider's reference |
| Confirmation | Provider event (or manual reference) moves refund to `completed` |
| Failure | `failed` item in admin queue; retry is an admin action |

Refund automation (D-006) is an MVP feature whose amount logic depends on OI-036. Until the policy is ratified, the build ships **manual approval** with the calculation shown to the admin.

---

## 7. Provider choice

Paystack is the working assumption for the first integration (D-006 onboarding). OPay is supported through the same internal interface (`provider` column, separate adapter). The choice between them, or both, is OI-025 and needs fees, channels and refund-API data gathered in sandbox (OI-033).

---

## 8. PCI and data handling

- No card, CVV, PIN, bank login or wallet secret enters, is displayed by, or is stored in the app.
- Logs contain references and statuses only.
- Support staff are told never to request card details (SUPPORT).
- Payment reports show amounts and references, not customer contact details.
- Compliance review is required before pilot (OI-038). The assumed reduced scope of provider-hosted checkout is to be confirmed by a qualified reviewer.

---

## 9. Money-related acceptance tests

| Test | Expected |
|---|---|
| Webhook with bad signature | Rejected 401, no state change |
| Same webhook event twice | Second is a no-op |
| Success after booking expired | `reconciliation_required`, admin alert, no seat re-taken automatically |
| Amount in webhook differs from booking | Not confirmed; `reconciliation_required` |
| Return URL opened without payment | Shows "checking", no confirmation |
| Client sends a lower amount to start-payment | Ignored; amount from server |
| Refund requested twice | One refund row (idempotency) |
