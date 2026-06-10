/**
 * Phase 4:2 — Operational Intelligence Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle } from "../dashboardVisualSignalContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export const OPERATIONAL_INTELLIGENCE_SURFACE_VERSION = "4.2.0";

export const CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER = "operationalIntelligenceRuntime";

export const CANONICAL_OPERATIONAL_INTELLIGENCE_SURFACE_ID = "operational" as const;

export type OperationalHealthLevel = "healthy" | "watch" | "degraded" | "critical";

export type OperationalPressureLevel = "low" | "moderate" | "high" | "critical";

export type DemandImpactDirection = "growing" | "stable" | "declining";

export type OperationalContextSource =
  | "scene"
  | "object"
  | "dashboard"
  | "executive_summary";

export type OperationalHealthCard = Readonly<{
  status: string;
  level: OperationalHealthLevel;
  trend: ImpactDirection;
  confidence: "low" | "moderate" | "high";
}>;

export type ActiveObjectsCard = Readonly<{
  objectsInScene: number;
  selectedObject: string | null;
  requiringAttention: number;
  recentlyUpdated: number;
  summary: string;
}>;

export type OperationalSignalsCard = Readonly<{
  signalCount: number;
  recentSummary: string;
  activityTrend: ImpactDirection;
}>;

export type OperationalPressureCard = Readonly<{
  level: OperationalPressureLevel;
  trend: ImpactDirection;
  attentionStatus: string;
}>;

export type DemandImpactCard = Readonly<{
  direction: DemandImpactDirection;
  summaryValue: string;
  trendPoints: readonly number[];
  indicator: string;
}>;

export type OperationalIntelligenceSnapshot = Readonly<{
  health: OperationalHealthCard;
  activeObjects: ActiveObjectsCard;
  signals: OperationalSignalsCard;
  pressure: OperationalPressureCard;
  demandImpact: DemandImpactCard;
}>;

export type OperationalIntelligenceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
  signalCount?: number;
}>;

export type OperationalIntelligenceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_OPERATIONAL_INTELLIGENCE_SURFACE_ID;
  owner: typeof CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER;
  headline: string;
  snapshot: OperationalIntelligenceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
  contextSources: readonly OperationalContextSource[];
}>;
