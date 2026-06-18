# INT:2:5 — Scenario Intelligence Feed Report

Freeze Tag:

- `[INT2_SCENARIO_FEED_COMPLETE]`

## Objective

Connect the existing Scenario Dashboard panel to certified DS-7 Scenario Intelligence
so scenario cards display read-only summaries, recommendations, confidence, and
comparison signals without simulation execution, mutations, or routing changes.

## Implementation

| Module | Role |
|--------|------|
| `scenarioIntelligenceFeedContract.ts` | Feed contract + diagnostics |
| `ScenarioIntelligenceFeed.ts` | Builds feed from DS-7 via Dashboard Intelligence Adapter |
| `scenarioIntelligenceFeedBridge.ts` | Maps feed into existing scenario snapshot |
| `ScenarioIntelligenceFeed.test.ts` | Regression suite |

## Consumption Model

```
Scene Input
  ↓
DashboardIntelligenceAdapterRegistry
  ↓
ExecutiveScenarioSummary (DS-7)
  ↓
ScenarioIntelligenceFeed
  ↓
attachScenarioIntelligenceFeed()
  ↓
ScenarioIntelligenceSurface (existing layout)
```

## Section Binding (UI preserved)

| Surface Region | DS-7 Section |
|----------------|--------------|
| Portfolio header | Scenario Summaries |
| `scenario_confidence` card | Scenario Confidence |
| `expected_impact` card | Scenario Recommendations |
| `tradeoff_analysis` card | Scenario Comparison Summaries |
| Comparison contract footer | Scenario Comparison Summaries |

## Wiring

- `ScenarioIntelligenceSurface.tsx` — optional `sceneJson` + feed bridge
- `DashboardAccordionPanel.tsx` — passes `sceneJson` into scenario surface

## Regression Guards

All guards are `false`:

- `sceneMutation`
- `objectMutation`
- `mrpMutation`
- `routingMutation`
- `topologyMutation`
- `legacyRouterUsage`
- `simulationActive`

## Diagnostics

- `[SCENARIO_FEED]`
- `[SCENARIO_FEED_READY]`

## Acceptance Criteria

- A. Scenario panel consumes DS-7: PASS
- B. Existing UI preserved: PASS

## Verification

```bash
node --test frontend/app/lib/intelligence-integration/ScenarioIntelligenceFeed.test.ts
npm run build
```

## Guardrails

- No simulation execution
- No scenario mutations
- No routing changes
- Read-only DS-7 consumption only

## Result

Scenario Dashboard panel is bound to DS-7 Scenario Intelligence and ready for INT-2
downstream dashboard contract work.

Tags: `[INT2_SCENARIO_FEED_COMPLETE]` `[SCENARIO_FEED]` `[SCENARIO_FEED_READY]`
