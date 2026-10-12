# FRONTEND

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Frontend Engineer with UI/UX Designer
**Governed by:** D-009 (PWA, forced install), D-024 (Next.js on Vercel), OI-004, OI-034 · **Open issues:** OI-004, OI-034

## What this folder is for

The web app that members, marshals and admins use: route map, data access pattern, state handling, PWA and offline behaviour, accessibility, and performance targets. The prototypes in `PROTOTYPE/` are walkthroughs. This folder defines what the production app must do.

## Files

| File | Contents |
|---|---|
| `FRONTEND-DESIGN.md` | Routes per role, data access, state, PWA, offline, accessibility, components, testing |

## Governing rules

- The browser never has authority. Every screen shows state read from the database and every action calls a function.
- The app works in a browser; the install step is required for push notifications and recommended for daily use (D-009, OI-004).
- Marshal screens must show when data was last synced. Stale manifests are the failure mode to design against.

## Open issues

OI-004 (browse-only before install), OI-034 (one design system for apps and documents).
