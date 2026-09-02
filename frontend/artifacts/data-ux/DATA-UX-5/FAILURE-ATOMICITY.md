# DATA-UX:5 Failure Atomicity

One store publication removes the committed row and writes one historical reference.

- `not_found` / `workspace_mismatch` / unconfirmed `active_source`: no historical write, source unchanged, UI does not say removed.
- Retry after success: `not_found`, still one historical record.
- No half-active mapping: mappings live on the committed import that is either fully present or gone.
