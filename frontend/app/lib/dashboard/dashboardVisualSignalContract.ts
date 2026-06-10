/**
 * Phase 3:5 — Dashboard Visual Signal Framework contract.
 * Shared types for micro charts, impact cards, and accordion header signals.
 */

import type { DashboardAccordionPanelType } from "./dashboardAccordionPanelContract.ts";

export const DASHBOARD_VISUAL_SIGNAL_VERSION = "3.5.0";

export const CANONICAL_DASHBOARD_VISUAL_OWNER = "dashboardVisualSignalFramework";

export type ImpactLevel = "low" | "moderate" | "high" | "critical";

export type ImpactDirection = "improving" | "stable" | "deteriorating";

export type ConfidenceLevel = "low" | "moderate" | "high";

export type TimeHorizon = "immediate" | "short_term" | "mid_term" | "long_term";

export type DeltaDirection = "up" | "down" | "flat";

export type MicroChartKind = "trend_line" | "micro_bar";

export type DashboardDeltaIndicator = Readonly<{
  kind: "delta";
  label: string;
  value: string;
  direction: DeltaDirection;
}>;

export type DashboardTrendLineSignal = Readonly<{
  kind: "trend_line";
  label: string;
  points: readonly number[];
  direction: ImpactDirection;
}>;

export type DashboardMicroBarSeriesSignal = Readonly<{
  kind: "micro_bar";
  label: string;
  values: readonly number[];
}>;

export type DashboardMicroChartSignal = DashboardTrendLineSignal | DashboardMicroBarSeriesSignal;

export type ExecutiveImpactCardSignal = Readonly<{
  impactLevel: ImpactLevel;
  direction: ImpactDirection;
  confidence: ConfidenceLevel;
  timeHorizon: TimeHorizon;
  headline: string;
}>;

export type DashboardAccordionHeaderVisualSignals = Readonly<{
  impactBadge: ImpactLevel;
  trendDirection: ImpactDirection;
  summaryValue: string;
  confidence: ConfidenceLevel;
  delta?: DashboardDeltaIndicator;
}>;

export type DashboardSurfaceVisualBundle = Readonly<{
  panelType: DashboardAccordionPanelType;
  impactCard: ExecutiveImpactCardSignal;
  headerSignals: DashboardAccordionHeaderVisualSignals;
  microCharts: readonly DashboardMicroChartSignal[];
  statusIndicator: string;
}>;
