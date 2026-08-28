# Known risks and proof gaps

- Hard reload still does not persist Stage focus (existing contract; PREP did not change it).
- Funnel Level 4 command stdout was inspected via exit codes; per-command `.log` files are written on subsequent funnel runs.
- Named objects appear only in fixtures and live smoke, not in production routing.
- Existing Next.js dev server remains running as a nonessential process.
