# SYSTEMS

**Status:** Reference (vocabulary only) · **Date:** 2026-10-12 · **Owner:** Product Manager
**Governed by:** D-014 (adopt vocabulary and seven invariants, not the machinery), `../SYSTEMS-MAPPING.md`

## What this folder is for

The UIOS engine specifications (one file per engine, plus an index and a master architecture file). The project adopts their vocabulary and seven invariants. It does not implement the engines. Read `SYSTEMS-MAPPING.md` before quoting any engine name in a product document.

## Files

| File | Contents |
|---|---|
| `Index.txt`, `Master.txt` | Index of engines and the master architecture |
| `ADCOS.txt`, `ARUEV.txt`, `DQS.txt`, `EXE.txt`, `GCE.txt`, `HVE.txt`, `IOE.txt`, `KGE.txt`, `LME.txt`, `MME.txt`, `MNIF.txt`, `MOE.txt`, `PRE.txt`, `QOF.txt`, `RGE.txt`, `SME.txt`, `UAIE.txt`, `UIK.txt`, `XTE.txt` | Individual engine specifications |

## Rule

Do not import engine machinery into product designs. The pattern-level imports are: immutable and attributed records, explicit state machines, message envelope, validated input, failures as objects, reversible defaults, and namespacing. Everything else is out of scope unless a decision says otherwise.
