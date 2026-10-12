# ADR-0003: Payments Are Provider-Hosted Only

**Status:** Proposed · **Date:** 2026-10-12
**Decisions:** D-023 (proposed), D-006 (refund automation via provider), D-011 (bulk payments in MVP), D-033 (fully digital, retires D-021) · **Open issues:** OI-025, OI-033, OI-038

## Context

The church holds no licence to store payment details. The meeting of 2026-10-09 confirmed: payment will be done on Paystack or OPay through their APIs. PCI DSS applies to anyone who stores, processes or transmits card data. Hosted checkout keeps card entry on the provider's page, so the church's systems receive references and statuses only.

## Decision

1. The app never displays, collects, stores, logs or transmits card numbers, CVV, expiry, bank login or wallet credentials.
2. Every payment starts with a server-side call to the provider that creates an order for a booking and returns a hosted checkout URL. The member is redirected to it.
3. **Confirmation happens only server-side.** The return URL shows "checking your payment" and never confirms a booking. Confirmation comes from the verified provider webhook or a status query made by the server.
4. The payment record stores only: provider, provider order or transaction reference, booking reference, amount in minor units, currency, status, timestamps, and the hash of the provider event. Customer contact fields from provider payloads are not stored.
5. Provider choice: Paystack for MVP unless OI-025 decides otherwise; OPay sits behind the same interface so a second provider needs no schema change.

## Provider facts (to verify in sandbox, OI-033)

| Fact | Paystack | OPay |
|---|---|---|
| Hosted checkout | Yes (redirect to Paystack page) | Yes: OPay Cashier create-order API returns a `cashierUrl` to redirect to (Verify) |
| Order creation | Initialize transaction API (Verify) | `/cashier/create` with merchant public key bearer and merchant ID header (checked 2026-10-12) |
| Webhook signature | HMAC-SHA512 of body with secret key in `x-paystack-signature` (Verify) | Callback notifications on `callbackUrl`; status queries use HMAC-SHA512 of JSON body as bearer (checked 2026-10-12, Verify callback signature) |
| Status query | Verify transaction API | `/cashier/status` by merchant reference or order number |
| Refund API | Yes (D-006 assumes) | Not confirmed (Verify); may require manual refund |

## Consequences

- **Webhook reliability is the critical path.** Missed events are caught by reconciliation (OI-020): payments in `redirected` longer than an agreed window are status-queried.
- **Refunds** use the provider API where available. Where not, refunds are a manual, audited admin action with the payment reference (OI-036 sets the rules).
- **Cash, POS and manual payment records are not payment paths.** Decided by Q-006 (D-033). Every payment is digital through Paystack and/or OPay. RISK-011 records the concern for members who rely on cash.
- **Support** staff are told never to ask members for card details (`SUPPORT/SUPPORT-SYSTEM.md`).
- **Compliance review** of this design is required before pilot (OI-038). Provider-hosted checkout is the expected route to a reduced PCI scope, but the assessment must be confirmed with a qualified reviewer, not assumed.

## Alternatives rejected

- Storing tokens or card references in-app: unlicensed, and still in PCI scope.
- Bank transfer with manual confirmation as the only path: reintroduces the reconciliation problem (PRD §7.6 option C).
- Confirming on the return URL: a member can close the browser after paying, or forge a return. Rejected.
