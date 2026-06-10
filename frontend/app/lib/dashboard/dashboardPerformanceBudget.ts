/**
 * Phase 3:4 — Dashboard runtime performance budgets (goals, not hard failures).
 */

export const DASHBOARD_PERFORMANCE_BUDGETS = Object.freeze({
  contextRoutingMs: 10,
  surfaceResolutionMs: 10,
  accordionUpdateMs: 16,
  dashboardTraceMs: 50,
  performanceGuardWarnMs: 120,
  routeDedupeWindowMs: 100,
  traceStormWindowMs: 2000,
  traceStormMaxPerWindow: 3,
  accordionUpdateStormWindowMs: 2000,
  accordionUpdateStormMaxPerWindow: 12,
  routingStormWindowMs: 2000,
  routingStormMaxPerWindow: 8,
});

export type DashboardPerformanceBudgetId = keyof typeof DASHBOARD_PERFORMANCE_BUDGETS;

export function isWithinDashboardBudget(
  operation: "contextRouting" | "surfaceResolution" | "accordionUpdate" | "dashboardTrace",
  durationMs: number
): boolean {
  switch (operation) {
    case "contextRouting":
      return durationMs <= DASHBOARD_PERFORMANCE_BUDGETS.contextRoutingMs;
    case "surfaceResolution":
      return durationMs <= DASHBOARD_PERFORMANCE_BUDGETS.surfaceResolutionMs;
    case "accordionUpdate":
      return durationMs <= DASHBOARD_PERFORMANCE_BUDGETS.accordionUpdateMs;
    case "dashboardTrace":
      return durationMs <= DASHBOARD_PERFORMANCE_BUDGETS.dashboardTraceMs;
    default:
      return true;
  }
}
