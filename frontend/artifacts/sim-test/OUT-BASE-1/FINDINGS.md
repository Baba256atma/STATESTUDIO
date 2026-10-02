# OUT-BASE:1 findings

## Root cause

Pre-Execution Operator CSV existed in Data Reality but was never forwarded into CORE-OUT:1A `window.baselineObservationId`. Capture subscribed only after an Execution context existed, and window open always passed `baselineObservationId: null`. CORE-OUT:1 then correctly reported `baseline-missing`.

## Repair

Reuse CORE-OUT:1A: at Execution comparison-window open, capture already-published subject+metric KPIs as unlinked observations and freeze the latest as baseline.

## Not in this phase

`comparison-ready` when expected direction is `maintain` and actual has no `observedDirection`. CORE-OUT:2 Learning is observed only.
