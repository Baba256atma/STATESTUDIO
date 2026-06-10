/**
 * Phase 6:6 — Institutional Alignment Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";
import type { InstitutionalContext } from "./institutionalContextContract.ts";

export const INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION = "6.6.0";

export const CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER = "institutionalAlignmentRuntime";

export const CANONICAL_INSTITUTIONAL_ALIGNMENT_SURFACE_ID = "institutional_alignment" as const;

export type InstitutionalHealthLevel =
  | "strong_alignment"
  | "moderate_alignment"
  | "fragmented_alignment"
  | "institutional_risk";

export type GovernanceStatusLevel =
  | "governance_aligned"
  | "governance_review_required"
  | "governance_escalation";

export type StrategicAlignmentStatusLevel =
  | "strategic_objectives_supported"
  | "mixed_strategic_signals"
  | "strategic_misalignment";

export type PolicyStatusLevel = "policy_aligned" | "constraint_pressure" | "policy_conflict";

export type StakeholderStatusLevel =
  | "strong_support"
  | "mixed_support"
  | "stakeholder_resistance";

export type ConsensusStatusLevel =
  | "strong_consensus"
  | "partial_consensus"
  | "institutional_tension";

export type InstitutionalAttentionLevel =
  | "monitor"
  | "review"
  | "leadership_discussion_recommended"
  | "institutional_escalation";

export type InstitutionalHealthCard = Readonly<{
  level: InstitutionalHealthLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type GovernanceStatusCard = Readonly<{
  level: GovernanceStatusLevel;
  label: string;
  alert: string;
  visibility: string;
  summary: string;
}>;

export type StrategicAlignmentStatusCard = Readonly<{
  level: StrategicAlignmentStatusLevel;
  label: string;
  visibility: string;
  concern: string;
  summary: string;
}>;

export type PolicyStatusCard = Readonly<{
  level: PolicyStatusLevel;
  label: string;
  policyVisibility: string;
  constraintVisibility: string;
  summary: string;
}>;

export type StakeholderStatusCard = Readonly<{
  level: StakeholderStatusLevel;
  label: string;
  supportVisibility: string;
  tensionVisibility: string;
  summary: string;
}>;

export type ConsensusStatusCard = Readonly<{
  level: ConsensusStatusLevel;
  label: string;
  convergenceVisibility: string;
  divergenceVisibility: string;
  summary: string;
}>;

export type InstitutionalAttentionCard = Readonly<{
  level: InstitutionalAttentionLevel;
  label: string;
  escalationIndicator: string;
  discussionIndicator: string;
  summary: string;
}>;

export type InstitutionalAlignmentSnapshot = Readonly<{
  institutionalHealth: InstitutionalHealthCard;
  governanceStatus: GovernanceStatusCard;
  strategicAlignmentStatus: StrategicAlignmentStatusCard;
  policyStatus: PolicyStatusCard;
  stakeholderStatus: StakeholderStatusCard;
  consensusStatus: ConsensusStatusCard;
  institutionalAttention: InstitutionalAttentionCard;
}>;

export type InstitutionalAlignmentAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type InstitutionalAlignmentSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_INSTITUTIONAL_ALIGNMENT_SURFACE_ID;
  owner: typeof CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER;
  headline: string;
  institutionalContext: InstitutionalContext;
  snapshot: InstitutionalAlignmentSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
}>;
