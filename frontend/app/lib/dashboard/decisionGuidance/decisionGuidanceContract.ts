/**
 * Phase 5:5 — Decision Guidance Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";
import type { AdvisoryExplanationBundle } from "../executiveAdvisory/explainability/advisoryExplainabilityContract.ts";
import type { AdvisoryConfidenceEvaluation } from "../executiveAdvisory/confidence/advisoryConfidenceContract.ts";
import type { ExecutiveAdvisorySnapshot } from "../executiveAdvisory/executiveAdvisoryContract.ts";

export const DECISION_GUIDANCE_SURFACE_VERSION = "5.5.0";

export const CANONICAL_DECISION_GUIDANCE_OWNER = "decisionGuidanceRuntime";

export const CANONICAL_DECISION_GUIDANCE_SURFACE_ID = "decision_guidance" as const;

export type DecisionFocusLevel =
  | "monitor"
  | "review"
  | "investigate"
  | "decision_recommended"
  | "decision_required";

export type DecisionGuidanceInput = Readonly<{
  advisorySnapshot: ExecutiveAdvisorySnapshot;
  confidenceEvaluation: AdvisoryConfidenceEvaluation;
  explanationBundle: AdvisoryExplanationBundle;
  warRoomTradeoffSummary: string;
  warRoomDecisionFocus: string;
}>;

export type DecisionFocusCard = Readonly<{
  focus: DecisionFocusLevel;
  label: string;
  urgency: string;
  attentionStatus: string;
  summary: string;
}>;

export type ExecutiveGuidanceEntry = Readonly<{
  kind: string;
  label: string;
  suggestion: string;
}>;

export type ExecutiveGuidanceCard = Readonly<{
  entries: readonly ExecutiveGuidanceEntry[];
  summary: string;
}>;

export type ConfidenceSummaryCard = Readonly<{
  level: string;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type ExplanationSummaryCard = Readonly<{
  supportingEvidence: string;
  confidenceDrivers: string;
  confidenceLimiters: string;
  reasoningPath: string;
  summary: string;
}>;

export type TradeoffSummaryEntry = Readonly<{
  label: string;
  indicator: string;
}>;

export type TradeoffSummaryCard = Readonly<{
  tradeoffs: readonly TradeoffSummaryEntry[];
  summary: string;
}>;

export type DecisionContextHighlight = Readonly<{
  domain: "operational" | "risk" | "timeline" | "scenario" | "war_room";
  label: string;
  summary: string;
}>;

export type DecisionContextCard = Readonly<{
  highlights: readonly DecisionContextHighlight[];
  summary: string;
}>;

export type DecisionGuidanceSnapshot = Readonly<{
  decisionFocus: DecisionFocusCard;
  executiveGuidance: ExecutiveGuidanceCard;
  confidenceSummary: ConfidenceSummaryCard;
  explanationSummary: ExplanationSummaryCard;
  tradeoffSummary: TradeoffSummaryCard;
  decisionContext: DecisionContextCard;
}>;

export type DecisionGuidanceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type DecisionGuidanceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_DECISION_GUIDANCE_SURFACE_ID;
  owner: typeof CANONICAL_DECISION_GUIDANCE_OWNER;
  headline: string;
  snapshot: DecisionGuidanceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
}>;
