/**
 * Phase 4:5 — Scenario Intelligence Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";

export const SCENARIO_INTELLIGENCE_SURFACE_VERSION = "4.5.0";

export const CANONICAL_SCENARIO_INTELLIGENCE_OWNER = "scenarioIntelligenceRuntime";

export const CANONICAL_SCENARIO_INTELLIGENCE_SURFACE_ID = "scenario" as const;

export type ScenarioId = "scenario_a" | "scenario_b" | "scenario_c" | "additional";

export type ScenarioConfidenceLevel = "low" | "moderate" | "high";

export type ExpectedImpactLevel = "low" | "moderate" | "high" | "transformational";

export type TradeoffAxis =
  | "cost_vs_speed"
  | "risk_vs_reward"
  | "short_term_vs_long_term"
  | "stability_vs_growth";

export type InvestigationPathKind =
  | "gather_more_data"
  | "review_assumptions"
  | "analyze_dependencies"
  | "escalate_to_war_room";

export type ScenarioContextSource =
  | "operational"
  | "risk"
  | "timeline"
  | "executive_summary"
  | "dashboard";

/** Future War Room bridge — contracts only. */
export type WarRoomEscalationContract = Readonly<{
  escalationId: string;
  sourceScenarioId: ScenarioId;
  targetContext: "war_room";
  readiness: "ready" | "pending_review" | "not_ready";
  summary: string;
}>;

/** Scenario comparison framework — contracts only (no simulation engine). */
export type ScenarioComparisonContract = Readonly<{
  comparisonId: string;
  mode: "pair" | "triple";
  scenarioIds: readonly ScenarioId[];
  summary: string;
  preferredScenarioId: ScenarioId | null;
}>;

export type ScenarioPortfolioEntry = Readonly<{
  id: ScenarioId;
  label: string;
  summary: string;
  score: number;
  active: boolean;
}>;

export type ScenarioPortfolioCard = Readonly<{
  activeCount: number;
  totalCount: number;
  scenarios: readonly ScenarioPortfolioEntry[];
  comparisonEntryPoint: string;
}>;

export type ScenarioConfidenceCard = Readonly<{
  level: ScenarioConfidenceLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type ExpectedImpactCard = Readonly<{
  level: ExpectedImpactLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type TradeoffEntry = Readonly<{
  axis: TradeoffAxis;
  label: string;
  indicator: string;
  summary: string;
}>;

export type TradeoffAnalysisCard = Readonly<{
  tradeoffs: readonly TradeoffEntry[];
  summary: string;
}>;

export type InvestigationPathEntry = Readonly<{
  kind: InvestigationPathKind;
  label: string;
  priority: "low" | "moderate" | "high";
}>;

export type InvestigationPathsCard = Readonly<{
  paths: readonly InvestigationPathEntry[];
  summary: string;
}>;

export type ScenarioIntelligenceSnapshot = Readonly<{
  portfolio: ScenarioPortfolioCard;
  confidence: ScenarioConfidenceCard;
  expectedImpact: ExpectedImpactCard;
  tradeoffs: TradeoffAnalysisCard;
  investigationPaths: InvestigationPathsCard;
  comparisonContract: ScenarioComparisonContract;
  warRoomEscalation: WarRoomEscalationContract;
}>;

export type ScenarioIntelligenceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type ScenarioIntelligenceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_SCENARIO_INTELLIGENCE_SURFACE_ID;
  owner: typeof CANONICAL_SCENARIO_INTELLIGENCE_OWNER;
  headline: string;
  snapshot: ScenarioIntelligenceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
  contextSources: readonly ScenarioContextSource[];
}>;
