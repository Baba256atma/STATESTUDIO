/**
 * Phase 4:4 — Timeline Intelligence Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";

export const TIMELINE_INTELLIGENCE_SURFACE_VERSION = "4.4.0";

export const CANONICAL_TIMELINE_INTELLIGENCE_OWNER = "timelineIntelligenceRuntime";

export const CANONICAL_TIMELINE_INTELLIGENCE_SURFACE_ID = "timeline" as const;

export type TimelineMomentumLevel = "accelerating" | "stable" | "slowing" | "blocked";

export type MilestonePressureLevel = "low" | "moderate" | "high" | "critical";

export type ScheduleDriftLevel = "on_track" | "minor_drift" | "moderate_drift" | "major_drift";

export type EventDensityLevel = "sparse" | "normal" | "heavy" | "overloaded";

export type DecisionWindowStatus =
  | "upcoming"
  | "active"
  | "missed"
  | "none";

export type TimelineContextSource =
  | "operational"
  | "risk"
  | "object"
  | "timeline"
  | "dashboard";

/** Future scene-native timeline integration points (contracts only). */
export type TimelineGraphicalContract = Readonly<{
  baseline: string;
  nodes: readonly string[];
  events: readonly string[];
  attentionPoints: readonly string[];
  decisionPoints: readonly string[];
}>;

export type TimelineMomentumCard = Readonly<{
  level: TimelineMomentumLevel;
  label: string;
  trend: ImpactDirection;
  confidence: "low" | "moderate" | "high";
  trendPoints: readonly number[];
}>;

export type MilestonePressureCard = Readonly<{
  level: MilestonePressureLevel;
  label: string;
  upcomingSummary: string;
  concentration: string;
}>;

export type ScheduleDriftCard = Readonly<{
  level: ScheduleDriftLevel;
  label: string;
  trend: ImpactDirection;
  confidence: "low" | "moderate" | "high";
}>;

export type EventDensityCard = Readonly<{
  level: EventDensityLevel;
  label: string;
  concentration: string;
  activityTrend: ImpactDirection;
}>;

export type DecisionWindowsCard = Readonly<{
  status: DecisionWindowStatus;
  label: string;
  currentWindow: string;
  upcomingWindow: string;
}>;

export type TimelineIntelligenceSnapshot = Readonly<{
  momentum: TimelineMomentumCard;
  milestonePressure: MilestonePressureCard;
  scheduleDrift: ScheduleDriftCard;
  eventDensity: EventDensityCard;
  decisionWindows: DecisionWindowsCard;
  graphicalContract: TimelineGraphicalContract;
}>;

export type TimelineIntelligenceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type TimelineIntelligenceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_TIMELINE_INTELLIGENCE_SURFACE_ID;
  owner: typeof CANONICAL_TIMELINE_INTELLIGENCE_OWNER;
  headline: string;
  snapshot: TimelineIntelligenceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
  contextSources: readonly TimelineContextSource[];
}>;
