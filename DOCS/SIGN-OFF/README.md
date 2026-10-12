# SIGN-OFF

**Status:** Live · **Date:** 2026-10-12 · **Owner:** Product Manager
**Governed by:** D-045 (sign-off gate and documentation freeze), D-048 (interactive form, no print) · **Open issues:** OI-040 (pilot scope), OI-001 (technical reconvene)

## What this folder is for

The gate between design and development. It holds the form the transport team completes before development begins. Nothing is built on the transport side until the form is signed and exported, and the frozen documents are versioned.

## Files

| File | Contents |
|---|---|
| `TRANSPORT-SIGN-OFF-PACK.html` | Interactive form, version 1.0. Five sections and a sign-off: ten rules, eight situations, twelve facts, six choices, 29 policy owners and timings. Choices are buttons and drop-downs; the only typing is a name and an optional short note. Answers save in the browser and export as one JSON file |

## How the form is used

1. Open the file in a browser. Answers save on that device as you go.
2. Press **Export answers** when finished. The file is named `transport-signoff-<date>-signed.json` when complete, or `-draft.json` when items are missing.
3. Send the exported file to the product manager. The file carries each answer with its decision or issue reference, so the register can be updated from it.
4. To update an answer later, open the form, press **Import answers**, change what is needed and export again. Each export is a new dated file; the older ones are kept under version control.

## Rules

- The form is written in plain language. Decision IDs appear only in the small reference badge, for the product team's use.
- Every question in the form is logged in `DECISION-LOGS/QA-LOG.md` (Batch 7) before the form is issued, as required by D-026.
- An unanswered item is exported as missing. It keeps its default and is marked provisional. It is not treated as agreed.
- The exported file holds answers, names and roles only. No bank or card details are asked for or stored.
- After signing, the documents are frozen (see `ROADMAP/DEVELOPMENT-STRATEGY.md`). Version control rules are in `VERSION-CONTROL/VERSION-CONTROL.md`.
