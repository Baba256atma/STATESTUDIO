# MRP:11:2:8-FIX — Dashboard Performance Regression Export Fix

## Root Cause

`dashboardAccordionRuntime.ts` imports `recordDashboardAccordionUpdateFrequency` from `dashboardPerformanceRegression.ts`. During MRP:11:2:8 work, the regression module was reported as having **no exports**, causing Turbopack/TypeScript to fail with:

```
Export recordDashboardAccordionUpdateFrequency doesn't exist in target module.
```

Investigation found the canonical implementation already present in repo history (Phase 3:4). The failure likely occurred when the file was temporarily empty or unsaved during parallel edits. The import in `dashboardAccordionRuntime.ts` (line 28) and call site in `reduceDashboardAccordionRuntime` (line 173) were correct; the export side needed to be guaranteed stable.

## Missing Export

```typescript
export function recordDashboardAccordionUpdateFrequency(
  detail?: DashboardAccordionUpdateFrequencyDetail | DashboardPerformanceRegressionDetail
): void
```

Also consumed by:
- `frontend/app/lib/dashboard/index.ts` (re-export)
- `frontend/app/lib/dashboard/dashboardAccordionRuntime.test.ts` (`resetDashboardPerformanceRegressionForTests`)

Related exports in the same module (unchanged):
- `recordDashboardRoutingFrequency`
- `recordDashboardTraceComputeFrequency`
- `recordDashboardRenderStorm`
- `resetDashboardPerformanceRegressionForTests`

## Chosen Fix (A — restore + harden)

**Restored/confirmed** the existing Phase 3:4 frequency-guard implementation and added explicit types:

- `DashboardAccordionUpdateFrequencyDetail` — typed input contract
- `DashboardPerformanceRegressionDetail` — shared detail shape

Behavior unchanged: dev-only storm warnings via in-memory timestamp windows; no timers, no subscriptions, no DOM access.

## Runtime Safety

| Rule | Status |
|------|--------|
| SSR-safe | Yes — module-level arrays/maps only |
| Client-safe | Yes — no `window`/`document` |
| No timers | Yes — uses `Date.now()` on call only |
| No subscriptions | Yes |
| No render loops | Yes — called from accordion reduce, warns only on threshold |
| No throw | Yes — guarded reporting path |
| No behavior change | Yes — diagnostic warnings only in dev |

## Validation

| Check | Result |
|-------|--------|
| `npm run build` | pass |
| `/type-c` route compiles | pass |
| `dashboardPerformanceOptimization.test.ts` | 7/7 pass (includes new accordion frequency test) |
| `dashboardAccordionRuntime.test.ts` | pass |
| Circular imports | none — `dashboardPerformanceRegression` → `dashboardPerformanceBudget`, `dashboardPerformanceMetrics` only |
| Assistant UX | unchanged |
| Dashboard behavior | unchanged |

## Build Result

```
✓ Compiled successfully
✓ TypeScript
✓ Static pages generated (/type-c included)
```

Assistant freeze validation (`MRP:11:2:8`) can continue unchanged.
