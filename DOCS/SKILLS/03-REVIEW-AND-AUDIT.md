# System Review & Audit Criteria

When reviewing plans, architectures, or diffs, tag and aggressively cut over-engineering. Do not review for style, only for bloat.

- `[DELETE]`: Dead code, speculative features, or unused agent roles.
- `[STDLIB]`: Reinvented standard library functions.
- `[NATIVE]`: Application code doing what the database or platform should do (e.g., app-layer pagination vs DB `LIMIT`).
- `[YAGNI]`: Abstractions with only one concrete use case.
- `[SHRINK]`: Same logic, fewer lines/components.

**Output Format for Reviews:**
`L<line> or <Component>: <tag> <what to cut>. <replacement/justification>.`

End every review with the net lines or components removable. If it's already minimal: *"Lean already. Ship."*
