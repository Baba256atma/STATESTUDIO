# Live evidence

Script: `frontend/scripts/mra-3-final-fix1-fix1-live-audit.mjs`  
Capture: `live-audit.json`, `live-proofs.png`

## Mandatory Stage sequence

Scenario collection → CSV inventory → Capacity Gap → click Revenue → `look at Capacity Gap` → `explain it`

| Check | Actual |
| --- | --- |
| Stage / focused subject | `ctx-problem-capacity` |
| MO:1 active | `ctx-problem-capacity` |
| Composition | `Capacity Gap is constraining delivery performance...` |
| Stale Scenario primary | absent (`Capacity Expansion Plan explores` not used) |
| Page errors | 0 (`zeroPageErrors: true`) |

## Tests A–G

Same audit file as FINAL-FIX1 parity, plus this Stage composition assert.

## Scenario assessment still live

- `Demand Surge` → `explain it` → `Scenario: Demand Surge...`
- `how sure are you?` remains a confidence/evidence-style reply, not Problem substitution
