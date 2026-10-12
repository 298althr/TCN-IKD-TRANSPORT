# VERSION-CONTROL

**Status:** Live · **Date:** 2026-10-12 · **Owner:** Product Manager
**Governed by:** D-049 (version control adopted), D-045 (freeze), D-026 (decision trail)

## What this folder is for

The rules for how the project's files, changes and frozen versions are kept: which branches exist, how tags mark freezes and releases, what is never committed, and how a change to a frozen document is made.

## Files

| File | Contents |
|---|---|
| `VERSION-CONTROL.md` | Branches, tags, commit messages, change control after the freeze, what is never committed, remote setup |

## Current state

- The project is a git repository at the project root. No remote is set, and nothing has been pushed.
- The baseline is committed on `main` and tagged `docs-baseline-2026-10-12`.
- The root `.gitignore` excludes secrets, returned sign-off forms, and build output.
