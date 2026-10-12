# PAYMENTS

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Integrations Specialist with Backend
**Governed by:** D-006 (automated refunds via provider), D-011 (bulk payments in MVP), D-023 (no payment instruments stored), ADR-0003 · **Open issues:** OI-018, OI-020, OI-023, OI-025, OI-033, OI-036, OI-038

## What this folder is for

How money moves through the product: which provider, what the member sees, how a payment is confirmed, how missed events are recovered, and how refunds are handled. The app is not a payment processor. It is a booking system that asks a licensed provider to take the payment and reports on the result.

## Files

| File | Contents |
|---|---|
| `PAYMENTS-DESIGN.md` | Payment flows, bulk and group payments, reconciliation, refunds, failure handling, PCI stance |
| `PROVIDER-CONTRACTS.md` | Provider facts checked and facts still to verify, with the sandbox checklist (OI-033) |

## Governing rules

- Card, account and wallet details are never entered into, displayed by, or stored in the app (D-023).
- A booking is confirmed only after a verified provider event or a server status query.
- Refund rules come from the policy (OI-036), not from code defaults.

## Open issues

OI-025 (provider selection), OI-033 (contract verification), OI-020 (reconciliation), OI-018 and OI-036 (refund policy), OI-038 (compliance review). Cash and POS are out of scope (D-033).
