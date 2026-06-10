/**
 * Phase 6:2 — Strategic Alignment Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";
import type { StrategicContext } from "./strategicContextContract.ts";

export const STRATEGIC_ALIGNMENT_SURFACE_VERSION = "6.2.0";

export const CANONICAL_STRATEGIC_ALIGNMENT_OWNER = "strategicAlignmentRuntime";

export const CANONICAL_STRATEGIC_ALIGNMENT_SURFACE_ID = "strategic_alignment" as const;

export type StrategicAlignmentScoreLevel =
  | "strong_alignment"
  | "moderate_alignment"
  | "weak_alignment"
  | "potential_misalignment";

export type StrategicDirectionLevel =
  | "advances_strategic_direction"
  | "maintains_strategic_direction"
  | "conflicts_with_strategic_direction";

export type StrategicTensionLevel =
  | "no_significant_tension"
  | "competing_priorities"
  | "strategic_conflict";

export type StrategicConfidenceLevel = "low" | "moderate" | "high";

export type StrategicAttentionLevel =
  | "monitor"
  | "review"
  | "leadership_attention_recommended"
  | "strategic_escalation";

export type StrategicTradeoffAxis =
  | "growth_vs_stability"
  | "innovation_vs_risk"
  | "speed_vs_governance"
  | "short_term_vs_long_term";

export type StrategicAlignmentScoreCard = Readonly<{
  score: StrategicAlignmentScoreLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type ObjectiveImpactEntry = Readonly<{
  objectiveId: string;
  label: string;
  impact: "supported" | "neutral" | "at_risk";
  influence: string;
  visibility: string;
  summary: string;
}>;

export type StrategicObjectivesImpactCard = Readonly<{
  objectives: readonly ObjectiveImpactEntry[];
  summary: string;
}>;

export type StrategicDirectionCard = Readonly<{
  direction: StrategicDirectionLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type StrategicTradeoffEntry = Readonly<{
  axis: StrategicTradeoffAxis;
  label: string;
  indicator: string;
  implication: string;
}>;

export type StrategicTradeoffCard = Readonly<{
  tradeoffs: readonly StrategicTradeoffEntry[];
  summary: string;
}>;

export type StrategicTensionCard = Readonly<{
  level: StrategicTensionLevel;
  label: string;
  conflictingPriorities: readonly string[];
  summary: string;
}>;

export type StrategicConfidenceCard = Readonly<{
  level: StrategicConfidenceLevel;
  label: string;
  trend: ImpactDirection;
  metadata: string;
  summary: string;
}>;

export type StrategicAttentionCard = Readonly<{
  level: StrategicAttentionLevel;
  label: string;
  escalationIndicator: string;
  leadershipReviewIndicator: string;
  summary: string;
}>;

export type StrategicAlignmentSnapshot = Readonly<{
  alignmentScore: StrategicAlignmentScoreCard;
  objectivesImpact: StrategicObjectivesImpactCard;
  strategicDirection: StrategicDirectionCard;
  strategicTradeoffs: StrategicTradeoffCard;
  strategicTension: StrategicTensionCard;
  strategicConfidence: StrategicConfidenceCard;
  strategicAttention: StrategicAttentionCard;
}>;

export type StrategicAlignmentAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type StrategicAlignmentSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_STRATEGIC_ALIGNMENT_SURFACE_ID;
  owner: typeof CANONICAL_STRATEGIC_ALIGNMENT_OWNER;
  headline: string;
  strategicContext: StrategicContext;
  snapshot: StrategicAlignmentSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
}>;
