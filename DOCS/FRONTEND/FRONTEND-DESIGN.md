# Frontend Design

**Status:** Proposed · **Version:** 0.1 · **Date:** 2026-10-12 · **Owner:** Frontend Engineer
**Decisions:** D-009, D-013, D-023, D-024, D-025 · **Open issues:** OI-004, OI-034, OI-039

---

## 1. Stack

| Concern | Choice (proposed) | Note |
|---|---|---|
| Framework | Next.js, App Router, TypeScript | ADR-0001 |
| Hosting | Vercel Pro, functions in `cpt1` | OI-030, OI-032 |
| Data client | `@supabase/ssr` (server and browser clients) | Session in cookies; no tokens in local storage |
| Validation | zod schemas from `packages/domain` | Same schema as Edge Functions |
| Styling | Tailwind CSS with design tokens from the chosen system | OI-034 |
| Components | Accessible primitives (for example Radix-based), owned in-repo | Keeps design tokens in one place |
| Server state | Read in server components via views; refresh with Realtime | No global client store |
| UI state | Local component state | Sheets, filters, form drafts |
| PWA | Web app manifest + service worker via a maintained Next.js PWA plugin (choose at build; verify maintenance status) | Install prompt per platform |
| Testing | Vitest (unit), Playwright (E2E, mobile viewport), axe (accessibility) | OI-035 |

Anti-bloat rule: no global state library, no custom router, no custom form engine. Each addition needs an entry in the decision log.

---

## 2. Route map

Route groups separate the three role apps while sharing one codebase and one service worker.

| Route | Role | Prototype source | Purpose |
|---|---|---|---|
| `/install` | Public | `member.html` install gate | Platform-specific install steps; browse-only pre-install (OI-004) |
| `/sign-in`, `/register`, `/guest/[token]` | Public | `member.html` auth tabs | Sign-in, first-timer application, invite link |
| `/pending` | Member (pending) | `member.html` pending view | Status of first-timer application |
| `/home`, `/programmes`, `/programmes/[id]` | Member | `member.html` home and booking | Programmes and special events; booking flow |
| `/book/[programmeId]` | Member | booking steps (leg, bus, pickup, riders, confirm) | Hold, then pay or confirm |
| `/pay/[bookingId]` | Member | payment view | Provider choice, redirect, return "checking" state |
| `/bookings`, `/bookings/[id]`, `/tickets/[id]` | Member | My Bookings, ticket | Status, cancel, report a problem |
| `/guests` | Member | My Guests | Invite, add, status |
| `/help` | Member | Support page | Report a problem, WhatsApp and phone links |
| `/duty`, `/duty/[assignmentId]/manifest` | Marshal | duty and manifest | Boarding, no-show, walk-on |
| `/duty/[assignmentId]/summary` | Marshal | summary | End-of-duty counts |
| `/help` (marshal) | Marshal | support | Contact admin, app bug |
| `/admin` | Admin | overview | Queues and attention items |
| `/admin/programmes`, `/admin/programmes/[id]` | Admin | programmes and special events | Create, configure, publish, close, cancel |
| `/admin/fleet` | Admin | fleet | Buses, per-bus booking toggle |
| `/admin/bookings`, `/admin/bookings/[id]` | Admin | bookings | Detail, corrections |
| `/admin/payments` | Admin | payments | Refunds, reconciliation queue |
| `/admin/people` | Admin | people | Registration queue, guests, roster import |
| `/admin/marshals` | Admin | marshals | Assignments |
| `/admin/support` | Admin | reports | Support queue |
| `/admin/incidents` | Admin | (new) | Travel-day incidents |
| `/admin/audit` | Admin | audit | Read-only audit view |
| `/admin/broadcast` | Admin | broadcast | Messages to segments |

Admin routes check the `admin` role on the server before rendering. A missing check is a finding, not a fallback.

---

## 3. Data access pattern

- **Reads:** server components query views (for example `member_bookings_view`), filtered by RLS. No raw table reads.
- **Writes:** client components call RPC functions (`hold_seats`, `board_rider`, and so on) through the Supabase client with an idempotency key generated per user action.
- **Live updates:** Realtime channels for seat counts (member, admin) and manifests (marshal). The client applies the new view row, not a computed guess.
- **Optimistic UI:** allowed only for board and no-show taps on the marshal manifest, with rollback on error and a visible "saving" chip. Never for payments or refunds.

---

## 4. States the UI must show

Every entity is shown with its state name and a plain-language label. The three booking axes (D-025) appear as separate chips.

| Surface | Chips |
|---|---|
| Booking card | Booking state; payment state (if paid); "your seat is held until HH:MM" with countdown when `held` |
| Rider row (marshal) | Board state; leg; "Guest of [host]" or "Walk-on" |
| Report | Support state; reference |
| Programme | Programme state; "booking open/closed" label derived from state |

Labels are plain language ("Seat held, payment due", "Confirmed", "Boarded", "No-show"). Internal state names are never shown to members.

---

## 5. PWA and offline

- **Installability:** manifest with name, icons, theme colour, start URL `/home` (member) or `/duty` (marshal). Install prompt is platform-specific (Android prompt; iOS "Add to Home Screen" instructions).
- **iOS:** web push requires the app to be added to the home screen (iOS 16.4 or later, D-009). The install screen states this plainly.
- **Caching:** app shell and static assets are cached. Programme lists and manifests are **network-first**. If offline, the last cached version is shown with a "last synced at HH:MM, offline" banner.
- **Never cached:** payments, sign-in, refunds, admin actions.
- **Marshal offline fallback:** printable manifest export (R-007) generated from the last synced data, with timestamp and a count check.

---

## 6. Accessibility and low-end use

- Target WCAG 2.1 AA (contrast 4.5:1 for body text, visible focus, keyboard reachable on admin).
- Touch targets at least 44 by 44 CSS pixels. Marshal actions are full-width rows.
- Font size at least 16 px for inputs (avoids zoom on iOS).
- Plain language, short sentences, no jargon. Money in naira with the thousand separator.
- Works on mid-range Android devices and 3G-class connections (targets in `OPTIMISATION/`).

---

## 7. Component inventory (initial)

Booking steps (leg picker, bus card with capacity bar, pickup picker, rider list, seat stepper), status chips, countdown, manifest row, board and no-show buttons, sheet and modal (accessible dialog), toast, empty state, skeleton (already demonstrated in the prototypes), report-a-problem form, payment provider picker, install instructions, sign-in screen (phone code, authenticator for admins, Google button as a placeholder until deployment, D-029), admin table with filters, audit row.

---

## 8. Prototype alignment

The prototypes are the walkthrough for stakeholders. Before production build, three changes are required:

1. Use D-025 axes: separate booking, payment and rider chips (the prototype uses one status).
2. Remove any copy that implies card entry in the app (already done for payment screens).
3. Add the waitlist flow to member copy (D-030), and keep payment copy digital-only (D-033).

---

## 9. Testing

- Unit tests for formatting, capacity display, and state label mapping.
- Playwright on a 390 by 844 viewport: journeys A to H in `PRODUCT/SCOPE-AND-JOURNEYS.md`.
- axe checks on every route in CI.
- Visual regression on the booking and manifest screens only (cost control).
