# INT:2:3 — Operational Intelligence Feed Report

Freeze Tag:

- `[INT2_OPERATIONAL_FEED_COMPLETE]`

## Objective

Connect the existing Operational Dashboard panel to the certified Intelligence Core
so operational cards display read-only object, relationship, and KPI intelligence
without layout, routing, or scene changes.

## Implementation

| Module | Role |
|--------|------|
| `operationalIntelligenceFeedContract.ts` | Feed contract + diagnostics |
| `OperationalIntelligenceFeed.ts` | Builds feed from Dashboard Intelligence Adapter |
| `operationalIntelligenceFeedBridge.ts` | Maps feed into existing operational snapshot |
| `OperationalIntelligenceFeed.test.ts` | Regression suite |

## Consumption Model

```
Scene Input
  ↓
DashboardIntelligenceAdapterRegistry
  ↓
ExecutiveIntelligenceSnapshot (DS-3 → DS-7)
  ↓
OperationalIntelligenceFeed
  ↓
attachOperationalIntelligenceFeed()
  ↓
OperationalIntelligenceSurface (existing 4-card layout)
```

## Card Binding (structure preserved)

Existing domain cards are reused; titles and values are enriched when feed is bound:

| Card Slot | Intelligence Section |
|-----------|---------------------|
| `health` | Object Health |
| `active_objects` | Object Trend |
| `signals` | Operational KPI Signals |
| `pressure` | Relationship Health + Relationship Dependency |

## Wiring

- `OperationalIntelligenceSurface.tsx` — optional `sceneJson` + feed bridge
- `DashboardRuntimeContainer.tsx` — passes `sceneJson` through accordion
- `DashboardAccordionSystem.tsx` / `DashboardAccordionPanel.tsx` — propagate `sceneJson`
- `RightPanelHost.tsx` — supplies scene context to dashboard runtime

## Regression Guards

All guards are `false`:

- `sceneMutation`
- `objectMutation`
- `mrpMutation`
- `routingMutation`
- `topologyMutation`
- `legacyRouterUsage`

## Diagnostics

- `[OPERATIONAL_FEED]`
- `[OPERATIONAL_FEED_READY]`

## Acceptance Criteria

- A. Operational panel displays intelligence: PASS
- B. Existing structure preserved: PASS

## Verification

```bash
node --test frontend/app/lib/intelligence-integration/OperationalIntelligenceFeed.test.ts
npm run build
```

## Guardrails

- No panel redesign
- No routing changes
- No scene changes
- Read-only intelligence consumption only

## Result

Operational Dashboard panel is bound to Intelligence Core and ready for INT-2
downstream dashboard contract work.

Tags: `[INT2_OPERATIONAL_FEED_COMPLETE]` `[OPERATIONAL_FEED]` `[OPERATIONAL_FEED_READY]`
