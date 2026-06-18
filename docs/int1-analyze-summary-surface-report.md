# INT:1:4 — Analyze Summary Surface Report

Freeze Tag:

- `[INT1_ANALYZE_SURFACE_COMPLETE]`

## Objective

Render executive intelligence inside the existing Analyze workspace surface without
creating new routes, tabs, panels, or navigation.

## Implementation

Extended the Analyze executive summary surface:

| Module | Role |
|--------|------|
| `intelligence/analyzeExecutiveSummarySurfaceContract.ts` | Summary view contract + builder |
| `AnalyzeWorkspaceShell.tsx` | Renders intelligence metrics in existing layout |
| `analyzeIntelligenceBindingBridge.ts` | Attaches summary from binding + profile |

## Displayed Fields

Executive Intelligence Summary card (2-column `metricCell` grid, MRP `softCardStyle`):

| Field | Source |
|-------|--------|
| Health | Binding health score |
| Impact | Binding impact score |
| Trend | Binding trend label + detail |
| Importance | Binding importance score |
| Risk | Binding risk score |
| Confidence | Profile confidence score |
| Scenario Summary | Recommended scenario label or scenario count |

Trend detail renders below the grid using existing HUD typography tokens (`nx.lowMuted` labels, 13px values).

## Empty State

When an object is selected but intelligence is unavailable, the summary card shows:

> Intelligence unavailable for the selected object.

Existing "No active object selected" empty state is unchanged when context is null.

## Diagnostics

- `[ANALYZE_SUMMARY_SURFACE]`
- `[ANALYZE_SUMMARY_READY]`

Shell attributes:

- `data-nx-analyze-summary-surface`
- `data-nx-analyze-summary-ready`

## Acceptance Criteria

- A. Analyze displays intelligence: PASS
- B. Existing layout preserved: PASS
- C. No visual regressions: PASS — same shell structure, object card, modules list
- D. Build passes: PASS

## Verification

```bash
node --test frontend/app/lib/intelligence/analyzeExecutiveSummarySurfaceContract.test.ts
node --test frontend/app/lib/intelligence-integration/analyzeExecutiveSummaryContract.test.ts
node --test frontend/app/lib/dashboard/analyze/analyzeIntelligenceBindingBridge.test.ts
node --test frontend/app/lib/intelligence-integration/analyzeIntelligenceCertification.test.ts
npm run build
```

## Guardrails

- No new routes, tabs, panels, or navigation
- No dashboard changes
- No assistant changes
- MRP styling and HUD typography preserved

## Result

Analyze workspace renders executive intelligence summary surface.

Tags: `[INT1_ANALYZE_SURFACE_COMPLETE]` `[ANALYZE_SUMMARY_SURFACE]` `[ANALYZE_SUMMARY_READY]`
