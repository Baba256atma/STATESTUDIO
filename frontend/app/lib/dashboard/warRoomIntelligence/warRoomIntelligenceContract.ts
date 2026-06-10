/**
 * Phase 4:6 — War Room Intelligence Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";

export const WAR_ROOM_INTELLIGENCE_SURFACE_VERSION = "4.6.0";

export const CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER = "warRoomIntelligenceRuntime";

export const CANONICAL_WAR_ROOM_INTELLIGENCE_SURFACE_ID = "war_room" as const;

export type WarRoomDecisionFocus = "monitor" | "review" | "investigate" | "decision_required";

export type WarRoomContextSource =
  | "operational"
  | "risk"
  | "timeline"
  | "scenario"
  | "executive_summary"
  | "dashboard";

/** Future D-phase advisory bridge — contracts only. */
export type AdvisoryIntegrationContract = Readonly<{
  bridgeId: string;
  sourceContext: "war_room";
  targetEngine: "executive_advisory";
  readiness: "ready" | "pending" | "not_available";
  summary: string;
}>;

export type SituationOverviewCard = Readonly<{
  currentState: string;
  executiveSummary: string;
  systemCondition: string;
  attentionSummary: string;
  briefing: string;
}>;

export type CriticalRisksCard = Readonly<{
  topRisks: readonly string[];
  exposure: string;
  momentum: string;
  urgency: string;
  summary: string;
}>;

export type TimelinePressureCard = Readonly<{
  decisionWindow: string;
  milestonePressure: string;
  timelineMomentum: string;
  scheduleDrift: string;
  urgencySummary: string;
}>;

export type ScenarioComparisonEntry = Readonly<{
  label: string;
  impact: string;
  confidence: string;
  tradeoff: string;
  score: number;
}>;

export type ScenarioComparisonCard = Readonly<{
  scenarios: readonly ScenarioComparisonEntry[];
  comparisonSummary: string;
  preferredPath: string;
}>;

export type WarRoomTradeoffEntry = Readonly<{
  label: string;
  indicator: string;
  consequence: string;
}>;

export type WarRoomTradeoffAnalysisCard = Readonly<{
  tradeoffs: readonly WarRoomTradeoffEntry[];
  summary: string;
}>;

export type DecisionFocusCard = Readonly<{
  focus: WarRoomDecisionFocus;
  label: string;
  urgency: string;
  recommendation: string;
  trend: ImpactDirection;
}>;

export type WarRoomIntelligenceSnapshot = Readonly<{
  situationOverview: SituationOverviewCard;
  criticalRisks: CriticalRisksCard;
  timelinePressure: TimelinePressureCard;
  scenarioComparison: ScenarioComparisonCard;
  tradeoffAnalysis: WarRoomTradeoffAnalysisCard;
  decisionFocus: DecisionFocusCard;
  advisoryIntegration: AdvisoryIntegrationContract;
}>;

export type WarRoomIntelligenceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type WarRoomIntelligenceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_WAR_ROOM_INTELLIGENCE_SURFACE_ID;
  owner: typeof CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER;
  headline: string;
  snapshot: WarRoomIntelligenceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
  contextSources: readonly WarRoomContextSource[];
  /** Executive command layout order — all section headers remain visible. */
  domainOrder: readonly [
    "situation_overview",
    "critical_risks",
    "timeline_pressure",
    "scenario_comparison",
    "tradeoff_analysis",
    "decision_focus",
  ];
}>;
