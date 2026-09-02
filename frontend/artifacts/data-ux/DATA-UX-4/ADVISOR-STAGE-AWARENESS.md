# DATA-UX:4 Advisor Stage Awareness

Date: 2026-08-31

## Authority

Advisor remains NCA / existing conversational experience. DATA-UX:4 adds a read-only explanation adapter that:

1. Runs only when a DATA_OBJECT is selected
2. Interprets the turn through `interpretCanonicalManagerMeaning` (FINAL:6.1)
3. Answers from canonical DATA_OBJECT + DATA-UX:3 `summarizeCsvSemantics`
4. Returns `null` so ordinary conversation continues when the turn is not about the selected source

It does not own Stage, Focus, Evidence, or Data Reality.

## Deictic resolution

Selected DATA_OBJECT is the referent for `this` / `it` while selected.

Selecting a KPI/Problem clears Data Object selection, so a later “Show me its data” is not stolen by the CSV.

Follow-up “What does it support?” uses the same selected source and canonical `supplies-data-to` relationships.

## Unsupported deletion

“Delete this CSV” receives the DATA-UX:5 boundary: deletion needs dependency review; Stage removal is not deletion.

## No phrase table

Example questions in the mission are coverage, not routes. Operation classes (EXPLAIN / IMPACT / CAUSE / STATUS) plus canonical relationship vocabulary drive the answer.
