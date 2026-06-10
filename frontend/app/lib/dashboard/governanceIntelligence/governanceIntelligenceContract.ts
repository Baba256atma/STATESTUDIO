/**
 * Phase 6:1 — Governance Intelligence Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";
import type { GovernanceContext } from "./governanceContextContract.ts";

export const GOVERNANCE_INTELLIGENCE_SURFACE_VERSION = "6.1.0";

export const CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER = "governanceIntelligenceRuntime";

export const CANONICAL_GOVERNANCE_INTELLIGENCE_SURFACE_ID = "governance" as const;

export type GovernanceAlignmentLevel =
  | "aligned"
  | "partially_aligned"
  | "requires_review"
  | "potential_misalignment";

export type PolicyAwarenessStatus =
  | "policy_impact"
  | "policy_review_required"
  | "policy_conflict_detected"
  | "no_policy_signal";

export type ConstraintCategory =
  | "resource_constraints"
  | "timeline_constraints"
  | "operational_constraints"
  | "governance_constraints";

export type ConstraintSeverity = "low" | "moderate" | "high" | "critical";

export type StakeholderGroup =
  | "executive_impact"
  | "operational_impact"
  | "financial_impact"
  | "cross_team_impact";

export type AccountabilityIndicator =
  | "decision_owner"
  | "review_owner"
  | "approval_required"
  | "escalation_path";

export type GovernanceAttentionLevel =
  | "monitor"
  | "review"
  | "approval_recommended"
  | "governance_escalation";

export type GovernanceAlignmentCard = Readonly<{
  alignment: GovernanceAlignmentLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type PolicyConsideration = Readonly<{
  label: string;
  status: PolicyAwarenessStatus;
  summary: string;
}>;

export type PolicyAwarenessCard = Readonly<{
  considerations: readonly PolicyConsideration[];
  reviewStatus: string;
  conflictIndicator: string;
  summary: string;
}>;

export type ConstraintEntry = Readonly<{
  category: ConstraintCategory;
  label: string;
  severity: ConstraintSeverity;
  summary: string;
}>;

export type ConstraintAwarenessCard = Readonly<{
  constraints: readonly ConstraintEntry[];
  summary: string;
}>;

export type StakeholderImpactEntry = Readonly<{
  group: StakeholderGroup;
  label: string;
  impactSummary: string;
  visibility: string;
}>;

export type StakeholderImpactCard = Readonly<{
  stakeholders: readonly StakeholderImpactEntry[];
  summary: string;
}>;

export type AccountabilityEntry = Readonly<{
  indicator: AccountabilityIndicator;
  label: string;
  value: string;
  summary: string;
}>;

export type AccountabilityContextCard = Readonly<{
  entries: readonly AccountabilityEntry[];
  summary: string;
}>;

export type GovernanceAttentionCard = Readonly<{
  level: GovernanceAttentionLevel;
  label: string;
  reviewStatus: string;
  escalationStatus: string;
  summary: string;
}>;

export type GovernanceIntelligenceSnapshot = Readonly<{
  governanceAlignment: GovernanceAlignmentCard;
  policyAwareness: PolicyAwarenessCard;
  constraintAwareness: ConstraintAwarenessCard;
  stakeholderImpact: StakeholderImpactCard;
  accountabilityContext: AccountabilityContextCard;
  governanceAttention: GovernanceAttentionCard;
}>;

export type GovernanceIntelligenceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type GovernanceIntelligenceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_GOVERNANCE_INTELLIGENCE_SURFACE_ID;
  owner: typeof CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER;
  headline: string;
  governanceContext: GovernanceContext;
  snapshot: GovernanceIntelligenceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
}>;
