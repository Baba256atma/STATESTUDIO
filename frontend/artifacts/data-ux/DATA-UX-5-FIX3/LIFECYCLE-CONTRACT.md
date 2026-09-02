# DATA-UX:5-FIX3 Pending CSV Lifecycle Contract

Date: 2026-09-01

Pending state is a projection of the existing RDI:2 store, not a second CSV registry.

## Families

- **CSV files** — committed rows + at most one new-source pending candidate.
- **Connected** — RDI:4 live connections (Engineering Source). No CSV columns or preview.

## Counts

- `csvCount` — visible CSV library rows (committed + pending new-source).
- `committedCsvCount` / header **Ready** — committed only.
- `pendingCsvCount` — 0 or 1 new-source pending.
- `csvEmpty` — true only when there are no committed and no pending CSV rows.

Pending is never written into Data Reality. Header form: `CSV · n · Ready · x · Pending · y · Connected · m`.

## Lifecycle (manager)

1. File selected → persist candidate (`saveCsvImportCandidate`).
2. Review / clarify (FIX1 Ask Nexora) / Validate (`prepare` only).
3. **Use this data** when `prepared.ready` → commit.
4. **Cancel import** — discard candidate, clear candidate NCA pending, confirm if manager-confirmed fields exist.
5. **Close** — hide review; candidate remains; reopen resumes `initialCandidate`.

Clicking a CSV row inspects it. It does not activate the source.

## Durability

- Close / reopen Data: pending and committed survive (in-memory store).
- Page refresh / restart: not APP-4 durable. Not faked with localStorage.
