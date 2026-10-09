# NPA-T STAGE-COMPOSITION:7 — Cross-Subject Visual Focus & Presentation Reconciliation

Identity: `NPA-T STAGE-COMPOSITION:7/CrossSubjectVisualFocus`

## Classification

A — REFERENT/FOCUS HANDOFF MISSING

`Show Inventory chart` resolved an Inventory visual while the visual path returned early with Capacity still as Stage focus. STAGE-PROD then omitted the chart as stale-unrelated evidence.

## Repair

- After a **SUPPORTED** visual, apply `selectNexoraMVPInteractionSubject` for the resolved canonical `visualSubject`.
- Commit runtime only when focus actually changes.
- Failed/unsupported named visuals do not navigate.
- Route stage projection uses composition focal subject so renderable means mount-eligible.

## Rule

An explicit named subject in a successful governed visual request is canonical subject selection as well as visual intent. Stale-visual protection (`stageProdRequestedVisualRemainsValid`) remains.

## Gates

Typecheck 0, L4 eslint PASS, build PASS, diff-check PASS, live smoke PASS, live `/executive` proofs PASS.

CLOSED: cross-subject visual focus / presentation mismatch.

NPA-T STAGE-COMPOSITION:7 — CERTIFIED + SEALED
