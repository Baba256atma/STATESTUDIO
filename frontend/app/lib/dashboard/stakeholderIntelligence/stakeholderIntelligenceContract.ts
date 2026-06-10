/**
 * Phase 6:4 — Stakeholder Intelligence Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";
import type { StakeholderContext } from "./stakeholderContextContract.ts";

export const STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION = "6.4.0";

export const CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER = "stakeholderIntelligenceRuntime";

export const CANONICAL_STAKEHOLDER_INTELLIGENCE_SURFACE_ID = "stakeholder_intelligence" as const;

export type StakeholderImpactLevel = "positive" | "neutral" | "negative" | "mixed";

export type StakeholderAlignmentLevel =
  | "aligned"
  | "partially_aligned"
  | "conflicting_interests"
  | "misaligned";

export type StakeholderInfluenceLevel = "low" | "moderate" | "high" | "critical";

export type StakeholderTensionLevel =
  | "no_significant_tension"
  | "competing_priorities"
  | "resource_conflict"
  | "strategic_conflict";

export type StakeholderSupportLevel =
  | "strong_support"
  | "moderate_support"
  | "uncertain_support"
  | "potential_resistance";

export type StakeholderConfidenceLevel = "low" | "moderate" | "high";

export type StakeholderAttentionLevel =
  | "monitor"
  | "review"
  | "leadership_discussion_recommended"
  | "stakeholder_escalation";

export type StakeholderVisibilityEntry = Readonly<{
  groupId: string;
  label: string;
  visibility: string;
  summary: string;
}>;

export type StakeholderVisibilityCard = Readonly<{
  stakeholders: readonly StakeholderVisibilityEntry[];
  summary: string;
}>;

export type StakeholderImpactCard = Readonly<{
  impact: StakeholderImpactLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type StakeholderAlignmentEntry = Readonly<{
  groupId: string;
  label: string;
  alignment: StakeholderAlignmentLevel;
  summary: string;
}>;

export type StakeholderAlignmentCard = Readonly<{
  alignment: StakeholderAlignmentLevel;
  label: string;
  entries: readonly StakeholderAlignmentEntry[];
  summary: string;
}>;

export type StakeholderInfluenceEntry = Readonly<{
  groupId: string;
  label: string;
  influence: StakeholderInfluenceLevel;
  summary: string;
}>;

export type StakeholderInfluenceCard = Readonly<{
  entries: readonly StakeholderInfluenceEntry[];
  summary: string;
}>;

export type StakeholderTensionCard = Readonly<{
  level: StakeholderTensionLevel;
  label: string;
  competingInterests: readonly string[];
  summary: string;
}>;

export type StakeholderSupportEntry = Readonly<{
  groupId: string;
  label: string;
  support: StakeholderSupportLevel;
  summary: string;
}>;

export type StakeholderSupportCard = Readonly<{
  entries: readonly StakeholderSupportEntry[];
  summary: string;
}>;

export type StakeholderConfidenceCard = Readonly<{
  level: StakeholderConfidenceLevel;
  label: string;
  metadata: string;
  summary: string;
}>;

export type StakeholderAttentionCard = Readonly<{
  level: StakeholderAttentionLevel;
  label: string;
  escalationIndicator: string;
  discussionIndicator: string;
  summary: string;
}>;

export type StakeholderIntelligenceSnapshot = Readonly<{
  stakeholderVisibility: StakeholderVisibilityCard;
  stakeholderImpact: StakeholderImpactCard;
  stakeholderAlignment: StakeholderAlignmentCard;
  stakeholderInfluence: StakeholderInfluenceCard;
  stakeholderTension: StakeholderTensionCard;
  stakeholderSupport: StakeholderSupportCard;
  stakeholderConfidence: StakeholderConfidenceCard;
  stakeholderAttention: StakeholderAttentionCard;
}>;

export type StakeholderIntelligenceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type StakeholderIntelligenceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_STAKEHOLDER_INTELLIGENCE_SURFACE_ID;
  owner: typeof CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER;
  headline: string;
  stakeholderContext: StakeholderContext;
  snapshot: StakeholderIntelligenceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
}>;
