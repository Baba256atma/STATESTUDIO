# OUT-DIR:1 findings

## Discovery

Live published Data Reality KPIs (`NexoraKPIResult`) are numeric identity + value + unit + timestamp. Operator CSV / RDI imports carry the same shape. Live CORE-OUT:1A capture sets `qualitativeState: null`. `toEvaluatorObservation` therefore sets `observedDirection: null`.

Nearby fields that look like direction are not Outcome observed direction:

- Executive object state (`normal` / `attention` / `critical`)
- RDI:3 source-snapshot metric deltas (forbidden numeric inference for this phase)
- NEX-ENT manager-reported `observation.state` (utterance path, not RMS publication)

## Classification

CAPABILITY GAP — observed direction is not established upstream.

## Production

Changes = 0. No inference from 90.91 → 100.

## Mandatory arithmetic control

When actual (100) > baseline (≈ 90.91) and expectedDirection is `maintain`, `observedDirection` remains `null`. CORE-OUT:1 stays `comparison-incomplete` / `incompatible-evidence-shape`.
