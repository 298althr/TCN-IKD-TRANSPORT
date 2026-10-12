# Environment Variables (names only)

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** DevOps/Infra Engineer

This file lists configuration names, where each lives, who may read it, and what it is for. It never contains values. A name that appears here but not in the environment, or the reverse, is a finding.

| Name | Where it lives | Visible to browser? | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel (per environment) | Yes | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel (per environment) | Yes (safe only with RLS) | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel server scope; Supabase function secrets if needed | **No** | Server-only privileged calls |
| `SUPABASE_DB_URL` | CI secret store | No | Migrations and pgTAP in CI |
| `PAYSTACK_SECRET_KEY` | Supabase function secrets | No | Webhook verification and API calls |
| `PAYSTACK_PUBLIC_KEY` | Vercel (per environment) | Yes | Client-side use only if the provider flow needs it |
| `OPAY_PUBLIC_KEY` | Supabase function secrets | No | Cashier create-order bearer (public key, still not exposed to browser by default) |
| `OPAY_SECRET_KEY` | Supabase function secrets | No | Signature for status queries (Verify) |
| `OPAY_MERCHANT_ID` | Supabase function secrets | No | Merchant header |
| `PAYMENT_RETURN_URL_BASE` | Vercel (per environment) | Yes | Return page base for provider redirects |
| `PAYMENT_CALLBACK_URL_BASE` | Supabase function secrets | No | Webhook base for provider configuration |
| `WEB_PUSH_VAPID_PUBLIC_KEY` | Vercel | Yes | Push subscription |
| `WEB_PUSH_VAPID_PRIVATE_KEY` | Supabase function secrets | No | Push sending |
| `WEB_PUSH_SUBJECT` | Supabase function secrets | No | Contact address for push service |
| `EMAIL_PROVIDER_API_KEY` | Supabase function secrets | No | Transactional email (provider to choose) |
| `EMAIL_FROM_ADDRESS` | Supabase function secrets | No | Sender address |
| `SMS_PROVIDER_API_KEY` | Supabase function secrets | No | SMS for marshal critical alerts and sign-in codes (D-028; vendor OI-031) |
| `SUPPORT_WHATSAPP_NUMBER` | Vercel (per environment) | Yes | Deep links (admin and transport office) |
| `SUPPORT_PHONE_NUMBER` | Vercel (per environment) | Yes | `tel:` links |
| `APP_ENV` | Vercel and functions | Yes | `production`, `staging`, `preview`, `local` |
| `SENTRY_DSN` or equivalent | Vercel (per environment), if used | Yes (DSN is public by design) | Error reporting (tool to verify) |
| `CRON_SHARED_SECRET` | Supabase function secrets and pg_cron setup | No | Authorise scheduled calls to Edge Functions |

**Rules**

- Names are case-sensitive and identical across environments. Values differ per environment.
- A variable prefixed `NEXT_PUBLIC_` is public. Never put a secret in one.
- Adding a variable requires a line in this file in the same change.
