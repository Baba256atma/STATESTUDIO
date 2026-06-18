# INT:2:4 — Risk Intelligence Feed Report

Freeze Tag:

- `[INT2_RISK_FEED_COMPLETE]`

## Objective

Connect the existing Risk Dashboard panel to certified DS-6 Risk Intelligence so
risk cards display read-only top risks, chains, propagation, and vulnerability
signals without layout or mutation changes.

## Implementation

| Module | Role |
|--------|------|
| `riskIntelligenceFeedContract.ts` | Feed contract + diagnostics |
| `RiskIntelligenceFeed.ts` | Builds feed from DS-6 via Dashboard Intelligence Adapter |
| `riskIntelligenceFeedBridge.ts` | Maps feed into existing risk snapshot |
| `RiskIntelligenceFeed.test.ts` | Regression suite |

## Consumption Model

```
Scene Input
  ↓
DashboardIntelligenceAdapterRegistry
  ↓
ExecutiveRiskSummary (DS-6)
  ↓
RiskIntelligenceFeed
  ↓
attachRiskIntelligenceFeed()
  ↓
RiskIntelligenceSurface (existing 4-card layout)
```

## Card Binding (UI preserved)

Existing domain cards are reused; titles and values are enriched when feed is bound:

| Card Slot | DS-6 Section |
|-----------|--------------|
| `active_risks` | Top Risks |
| `exposure` | Risk Propagation |
| `confidence` | Risk Chains |
| `executive_attention` | Critical Vulnerabilities |

## Wiring

- `RiskIntelligenceSurface.tsx` — optional `sceneJson` + feed bridge
- `DashboardAccordionPanel.tsx` — passes `sceneJson` into risk surface

## Regression Guards

All guards are `false`:

- `sceneMutation`
- `objectMutation`
- `mrpMutation`
- `routingMutation`
- `topologyMutation`
- `legacyRouterUsage`

## Diagnostics

- `[RISK_FEED]`
- `[RISK_FEED_READY]`

## Acceptance Criteria

- A. Risk panel consumes DS-6: PASS
- B. Existing UI preserved: PASS

## Verification

```bash
node --test frontend/app/lib/intelligence-integration/RiskIntelligenceFeed.test.ts
npm run build
```

## Guardrails

- No panel redesign
- Read-only DS-6 consumption only
- No mutations

## Result

Risk Dashboard panel is bound to DS-6 Risk Intelligence and ready for INT-2
downstream dashboard contract work.

Tags: `[INT2_RISK_FEED_COMPLETE]` `[RISK_FEED]` `[RISK_FEED_READY]`
