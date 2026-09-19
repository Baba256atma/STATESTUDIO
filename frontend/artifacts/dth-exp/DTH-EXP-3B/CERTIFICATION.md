# NPA-T DTH-EXP:3B — Nexo Family Recipe Definitions

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:4.

## Status

**NPA-T DTH-EXP:3B — CERTIFIED**

## Architecture inspected

DTH-EXP:1–3A, DTH:1–12, DIR:1, NEX-MVP:3/4, MO, NMI, VAI:1–8, CC:8/10/11, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## Nine family definitions

NexoBubble, NexoBars, NexoFlow, NexoImpact, NexoRisk, NexoTime, NexoCause, NexoExecution, NexoOutcome — each `defineNexo*Recipe` emits a DTH-EXP:3A `DthExpSceneRecipe`.

## Shared recipe engine

`resolver === resolveDthExpSceneRecipe`. No BubbleEngine/FlowEngine/CauseEngine. `parallelEngine: false`.

## Cross-family Object identity

Product Line A remains `obj-product-line-a` as flow-node, bar, bubble, cause-node, impact-node, and time-point. Supplier → Production → Product Line A → Market relationships keep NMI source refs.

## Flow / bottleneck

Bottleneck is emphasized attention inside NexoFlow. `NEXO_BOTTLENECK` does not exist.

## VAI / Cause safety

Impact: VAI `LEVER` + Theatre `impact-node`. Cause: `impliesCausality: false`, correlation is not cause.

## NexoTime / timeline

Time-point + historical/current/future grouping. No Timeline authority or store.

## Execution / Outcome

Read-only over CC:11 and CORE-OUT. Writes remain false.

## Authority

Stage and Director unchanged. Families are not business truth.

## Files

Created: Nexo family identity/boundary/contract/definitions/tests and `artifacts/dth-exp/DTH-EXP-3B/*`.

Modified: 3A analytical dimensions (`value`, `effort`, `strategic-relevance`), public index.

## Tests

DTH-EXP:3B + :3A + :2 + :1 — **75 pass / 0 fail**. ESLint 0. Typecheck pass.

## Remaining debt

See `KNOWN-DEBT.md`.
