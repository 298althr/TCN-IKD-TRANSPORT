# DATA-MODEL

**Status:** Proposed · **Date:** 2026-10-12 · **Owner:** Database/Data Architect
**Governed by:** D-001, D-008, D-013, D-023, D-025 · **Open issues:** OI-003, OI-008, OI-011, OI-012, OI-038

## What this folder is for

The entities, keys, relationships, immutability rules and retention rules the database will hold. It is the contract between the product (what must be remembered) and the backend (how it is stored and changed). Schema SQL is written only after OI-001 ratifies the stack; this folder defines what that SQL must express.

## Files

| File | Contents |
|---|---|
| `ENTITIES.md` | Every table, its key, columns, owner domain, mutability, retention, and relationships, with an ERD |

## Rules that apply to every table

- Schema `transport` (OI-008). Exposed to the API deliberately, not by default.
- UUID primary keys. Human references (for example, `TCN-8F3K2`) are separate unique columns.
- `created_at` and `created_by` on every table. State changes go through transition tables, not in-place edits.
- Mutability class per table: **append-only** (audit, transitions, payment events, ledger), **state-machine** (changed only by a named function that writes a transition), or **reference** (changed by admin with an audit row).
- No hard deletes on operational data. Personal data erasure follows OI-038 (pending).

## Open issues

OI-003 (mutability list, first pass in ENTITIES §3), OI-011 (data-science contract), OI-012 (correction records), OI-038 (retention).
