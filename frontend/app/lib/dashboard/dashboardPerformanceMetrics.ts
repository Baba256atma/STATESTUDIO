/**
 * Phase 3:4 — Dashboard runtime performance metrics (dev diagnostics, deduped).
 */

import {
  DASHBOARD_PERFORMANCE_BUDGETS,
  isWithinDashboardBudget,
} from "./dashboardPerformanceBudget.ts";

const metricLogKeys = new Set<string>();

function shouldEmit(label: string, key: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const dedupeKey = `${label}:${key}`;
  if (metricLogKeys.has(dedupeKey)) return false;
  metricLogKeys.add(dedupeKey);
  return true;
}

function nowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

export function measureDashboardOperation<T>(
  operation: "contextRouting" | "surfaceResolution" | "accordionUpdate" | "dashboardTrace" | "accordionRender",
  fn: () => T,
  detail?: Readonly<Record<string, unknown>>
): T {
  const started = nowMs();
  const result = fn();
  const durationMs = nowMs() - started;

  if (operation === "contextRouting") {
    reportDashboardContextCost({ durationMs, withinBudget: isWithinDashboardBudget("contextRouting", durationMs), ...detail });
  } else if (operation === "surfaceResolution") {
    reportDashboardSurfaceCost({ durationMs, withinBudget: isWithinDashboardBudget("surfaceResolution", durationMs), ...detail });
  } else if (operation === "accordionUpdate" || operation === "accordionRender") {
    reportDashboardRender({
      phase: operation === "accordionUpdate" ? "accordion_update" : "accordion_render",
      durationMs,
      withinBudget: isWithinDashboardBudget("accordionUpdate", durationMs),
      ...detail,
    });
  } else if (operation === "dashboardTrace") {
    reportDashboardTrace({
      durationMs,
      withinBudget: isWithinDashboardBudget("dashboardTrace", durationMs),
      budgetMs: DASHBOARD_PERFORMANCE_BUDGETS.dashboardTraceMs,
      ...detail,
    });
  }

  return result;
}

export function reportDashboardTrace(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.signature ?? payload.phase ?? "trace"}:${payload.durationMs ?? 0}:${payload.fromCache ?? false}`;
  if (!shouldEmit("[Nexora][DashboardTrace]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardTrace]", payload);
}

export function reportDashboardPerformance(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.phase ?? "unknown"}:${payload.durationMs ?? 0}`;
  if (!shouldEmit("[Nexora][DashboardPerformance]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardPerformance]", payload);
}

export function reportDashboardRender(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.phase ?? "render"}:${payload.contextSignature ?? "none"}:${payload.durationMs ?? 0}`;
  if (!shouldEmit("[Nexora][DashboardRender]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardRender]", payload);
}

export function reportDashboardContextCost(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.phase ?? "context"}:${payload.contextId ?? payload.contextSignature ?? "none"}:${payload.durationMs ?? 0}`;
  if (!shouldEmit("[Nexora][DashboardContextCost]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardContextCost]", payload);
}

export function reportDashboardSurfaceCost(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.surfaceId ?? "unknown"}:${payload.contextId ?? "none"}:${payload.durationMs ?? 0}`;
  if (!shouldEmit("[Nexora][DashboardSurfaceCost]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardSurfaceCost]", payload);
}

export function resetDashboardPerformanceMetricsForTests(): void {
  metricLogKeys.clear();
}
