/**
 * Phase 3:4 — Dashboard performance regression protection (warnings only).
 */

import { DASHBOARD_PERFORMANCE_BUDGETS } from "./dashboardPerformanceBudget.ts";
import { reportDashboardPerformance } from "./dashboardPerformanceMetrics.ts";

export type DashboardPerformanceRegressionDetail = Readonly<Record<string, unknown>>;

export type DashboardAccordionUpdateFrequencyDetail = Readonly<{
  signature?: string;
  source?: string;
  updateCount?: number;
  timestamp?: number;
  action?: string;
  contextSignature?: string;
  expandedCount?: number;
}>;

type FrequencyWindow = {
  timestamps: number[];
};

const routingWindow: FrequencyWindow = { timestamps: [] };
const traceComputeWindow: FrequencyWindow = { timestamps: [] };
const accordionUpdateWindow: FrequencyWindow = { timestamps: [] };
const renderStormSignatures = new Map<string, number>();

function pruneWindow(window: FrequencyWindow, horizonMs: number, now: number): void {
  window.timestamps = window.timestamps.filter((timestamp) => now - timestamp <= horizonMs);
}

function recordFrequency(
  window: FrequencyWindow,
  horizonMs: number,
  maxPerWindow: number,
  phase: string,
  detail?: Readonly<Record<string, unknown>>
): void {
  const now = Date.now();
  pruneWindow(window, horizonMs, now);
  window.timestamps.push(now);
  if (window.timestamps.length > maxPerWindow) {
    reportDashboardPerformance({
      phase,
      warning: "frequency_threshold_exceeded",
      count: window.timestamps.length,
      horizonMs,
      maxPerWindow,
      ...detail,
    });
  }
}

export function recordDashboardRoutingFrequency(detail?: Readonly<Record<string, unknown>>): void {
  recordFrequency(
    routingWindow,
    DASHBOARD_PERFORMANCE_BUDGETS.routingStormWindowMs,
    DASHBOARD_PERFORMANCE_BUDGETS.routingStormMaxPerWindow,
    "routing_storm_warning",
    detail
  );
}

export function recordDashboardTraceComputeFrequency(detail?: Readonly<Record<string, unknown>>): void {
  recordFrequency(
    traceComputeWindow,
    DASHBOARD_PERFORMANCE_BUDGETS.traceStormWindowMs,
    DASHBOARD_PERFORMANCE_BUDGETS.traceStormMaxPerWindow,
    "trace_storm_warning",
    detail
  );
}

export function recordDashboardAccordionUpdateFrequency(
  detail?: DashboardAccordionUpdateFrequencyDetail | DashboardPerformanceRegressionDetail
): void {
  recordFrequency(
    accordionUpdateWindow,
    DASHBOARD_PERFORMANCE_BUDGETS.accordionUpdateStormWindowMs,
    DASHBOARD_PERFORMANCE_BUDGETS.accordionUpdateStormMaxPerWindow,
    "accordion_update_storm_warning",
    detail
  );
}

export function recordDashboardRenderStorm(signature: string): void {
  const count = (renderStormSignatures.get(signature) ?? 0) + 1;
  renderStormSignatures.set(signature, count);
  if (count > 6) {
    reportDashboardPerformance({
      phase: "render_storm_warning",
      signature,
      renderCount: count,
      warning: "repeated_render_signature",
    });
  }
}

export function resetDashboardPerformanceRegressionForTests(): void {
  routingWindow.timestamps = [];
  traceComputeWindow.timestamps = [];
  accordionUpdateWindow.timestamps = [];
  renderStormSignatures.clear();
}
