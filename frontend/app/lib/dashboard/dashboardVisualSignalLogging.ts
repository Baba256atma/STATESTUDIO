/**
 * Phase 3:5 — Dashboard visual signal logging.
 */

import type { DashboardAccordionPanelType } from "./dashboardAccordionPanelContract.ts";
import type { DashboardMicroChartSignal, ExecutiveImpactCardSignal } from "./dashboardVisualSignalContract.ts";

const loggedVisualKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedVisualKeys.has(key)) return false;
  loggedVisualKeys.add(key);
  return true;
}

export function reportVisualSignal(
  panelType: DashboardAccordionPanelType,
  detail: Readonly<Record<string, unknown>>
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `visual:${panelType}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][VisualSignal]", { panelType, ...detail });
}

export function reportImpactCard(signal: ExecutiveImpactCardSignal, panelType: DashboardAccordionPanelType): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `impact:${panelType}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ImpactCard]", { panelType, ...signal });
}

export function reportMicroChart(chart: DashboardMicroChartSignal, panelType: DashboardAccordionPanelType): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `micro:${panelType}:${chart.kind}:${chart.label}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][MicroChart]", { panelType, kind: chart.kind, label: chart.label });
}

export function reportTrendIndicator(
  panelType: DashboardAccordionPanelType,
  direction: string,
  summaryValue: string
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `trend:${panelType}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][TrendIndicator]", { panelType, direction, summaryValue });
}

export function reportDashboardVisual(
  panelType: DashboardAccordionPanelType,
  detail: Readonly<Record<string, unknown>>
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `dashboard-visual:${panelType}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][DashboardVisual]", { panelType, ...detail });
}

export function resetDashboardVisualSignalLoggingForTests(): void {
  loggedVisualKeys.clear();
}
