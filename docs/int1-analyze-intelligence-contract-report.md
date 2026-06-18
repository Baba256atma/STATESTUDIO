# INT:1:2 — Analyze Intelligence Contract Report

Freeze Tag:

- `[INT1_ANALYZE_CONTRACT_COMPLETE]`

## Objective

Create the canonical intelligence contract consumed by Analyze mode, mapping the
certified `ExecutiveIntelligenceSnapshot` into executive-facing Analyze exposures
without changing UI, panels, Scene, routing, or MRP behavior.

## Implementation

Added canonical INT-1:2 profile at `frontend/app/lib/intelligence/`:

| Module | Role |
|--------|------|
| `analyzeIntelligenceProfileContract.ts` | Immutable `AnalyzeIntelligenceProfile` contract |
| `AnalyzeIntelligenceProfile.ts` | `buildAnalyzeIntelligenceProfile()` snapshot mapper |
| `AnalyzeIntelligenceProfile.test.ts` | Contract regression suite |

The `intelligence-integration/` Analyze binding layer delegates profile
generation to the canonical builder and enriches scenario summary metadata from
the adapter registry for INT-1:3 onward.

## AnalyzeIntelligenceProfile

Executive-facing exposures:

| Field | Source |
|-------|--------|
| Health | Object + KPI average health scores |
| Impact | Object + KPI average impact scores |
| Trend | Object trend posture + KPI declining signals |
| Importance | Object average importance + attention count |
| Risk | Risk propagation score + top risks |
| ScenarioSummary | Executive scenario summary + recommended scenario |
| Confidence | Object + KPI average confidence scores |

Regression guards (all `false`):

- `sceneMutation`
- `objectMutation`
- `mrpMutation`
- `routingMutation`
- `simulationActive`
- `uiRendering`

## Diagnostics

- `[ANALYZE_INTELLIGENCE_CONTRACT]`
- `[ANALYZE_INTELLIGENCE_CONTRACT_READY]`

## Acceptance Criteria

- A. Contract compiles: PASS
- B. Snapshot maps correctly: PASS
- C. No DS mutations: PASS
- D. Build passes: PASS

## Verification

```bash
node --test frontend/app/lib/intelligence/AnalyzeIntelligenceProfile.test.ts
node --test frontend/app/lib/intelligence-integration/AnalyzeIntelligenceProfile.test.ts
npm run build
```

## Guardrails

- No UI changes
- No panel changes
- No Scene changes
- No routing changes
- No MRP mutations
- No DS-3 through DS-7 contract modifications

## Result

Analyze Intelligence Profile ready for INT-1:3 binding.

Tags: `[INT1_ANALYZE_CONTRACT_COMPLETE]` `[ANALYZE_INTELLIGENCE_CONTRACT]` `[ANALYZE_INTELLIGENCE_CONTRACT_READY]`
