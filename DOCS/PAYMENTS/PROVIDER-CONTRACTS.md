# Provider Contracts

**Status:** Draft · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Integrations Specialist
**Open issues:** OI-025, OI-033 · **Decisions:** D-006, D-023

Every row is one fact about a provider. "Checked" means read from the provider's public documentation on 2026-10-12. "Verify" means it must be confirmed in sandbox before code depends on it. No secret values appear in this file.

---

## 1. OPay (Cashier, hosted)

| Item | Status | Detail |
|---|---|---|
| Hosted checkout | Checked | Create-order call returns a `cashierUrl`; member is redirected |
| Create endpoint (staging) | Checked | `https://testapi.opaycheckout.com/api/v1/international/cashier/create` (POST) |
| Create endpoint (production) | Checked | `https://liveapi.opaycheckout.com/api/v1/international/cashier/create` |
| Create request headers | Checked | Bearer public key; merchant ID header |
| Create request fields | Checked | `country`, `reference`, `amount` (total and currency), `returnUrl`, `callbackUrl`, `cancelUrl`, `displayName`, `customerVisitSource`, `evokeOpay` (among others) |
| Status query | Checked (OpenAPI) | `/cashier/status` by merchant reference or order number; bearer is HMAC-SHA512 of the JSON body |
| Server-to-server payment | Checked (OpenAPI) | `/payment/create` with `payMethod` (card with 3DS, transfer, USSD, account, POS, OPay wallet, reference code); response includes `nextAction` |
| Callback signature | **Verify** | How the callback body is signed and which header carries it |
| Refund API | **Verify** | Whether a refund endpoint exists for Cashier orders |
| Currency and country | **Verify** | NGN with `country` set to NG for Nigerian merchant accounts |
| Merchant onboarding | **Verify** | Account, keys, and sandbox access for the church's merchant account |

**Recommendation.** Use `cashierUrl` redirect (hosted) only. Do not use `/payment/create` with card or bank fields in the app. Even with a provider-side flow, the app must not collect card data; OPay's own page does.

---

## 2. Paystack

| Item | Status | Detail |
|---|---|---|
| Hosted checkout | **Verify** | Initialize-transaction flow returns an authorization URL to redirect to |
| Webhook signature | **Verify** | HMAC-SHA512 of the raw body with the secret key, sent in `x-paystack-signature` |
| Event receiver | **Verify** | Event types for successful charge and failed charge; which fields carry reference and amount |
| Transaction verify API | **Verify** | Server-side status query by reference |
| Refund API | **Verify** | Refund endpoint and reference returned (D-006 assumes automated refunds) |
| Test keys | **Verify** | Sandbox account and test keys stored only in the secret manager |
| Fees and settlement | **Verify** | Fee structure to feed OI-018 and OI-025 comparison |

---

## 3. Sandbox verification checklist (OI-033)

- [ ] Create one order per provider with a booking reference; confirm redirect URL shape.
- [ ] Complete a test payment; confirm webhook arrives, signature verifies, duplicate delivery is a no-op.
- [ ] Trigger a failed payment; confirm failure event handling.
- [ ] Abandon a payment; confirm status query returns pending or expired.
- [ ] Refund a test payment (where supported); record the refund reference and event.
- [ ] Replay a webhook with a modified body; confirm rejection.
- [ ] Record the exact field names used, with secrets and personal data removed, in this file.
- [ ] Sign off in the decision log (OI-033 status).

---

## 4. Data we keep from provider payloads

Kept: provider name, transaction or order reference, amount, currency, status, event type, timestamps, and a hash of the payload. Redacted copy of the payload kept for reconciliation only, with customer contact fields removed.

Not kept: card or account numbers, expiry, CVV, bank or wallet credentials, customer email or phone taken from the payload (the church's own profile holds contact details).
