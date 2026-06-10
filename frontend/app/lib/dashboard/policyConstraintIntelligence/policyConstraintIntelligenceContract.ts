/**
 * Phase 6:3 — Policy & Constraint Intelligence Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";
import type { PolicyContext } from "./policyContextContract.ts";

export const POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION = "6.3.0";

export const CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER = "policyConstraintIntelligenceRuntime";

export const CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_ID = "policy_constraint" as const;

export type PolicyAlignmentLevel =
  | "aligned"
  | "partially_aligned"
  | "requires_review"
  | "potential_conflict";

export type PolicyImpactLevel = "low" | "moderate" | "high" | "critical";

export type ResourceConstraintKind =
  | "budget_constraint"
  | "capacity_constraint"
  | "workforce_constraint"
  | "technology_constraint";

export type OperationalConstraintKind =
  | "operational_capacity"
  | "service_availability"
  | "execution_readiness"
  | "dependency_constraint";

export type GovernanceConstraintKind =
  | "approval_required"
  | "escalation_required"
  | "review_required"
  | "authority_limitation";

export type ConstraintSeverityLevel = "informational" | "moderate" | "significant" | "critical";

export type PolicyAttentionLevel =
  | "monitor"
  | "review"
  | "leadership_attention_recommended"
  | "policy_escalation";

export type PolicyAlignmentCard = Readonly<{
  alignment: PolicyAlignmentLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type PolicyImpactEntry = Readonly<{
  policyId: string;
  label: string;
  impact: PolicyImpactLevel;
  summary: string;
}>;

export type PolicyImpactCard = Readonly<{
  level: PolicyImpactLevel;
  label: string;
  affectedPolicies: readonly PolicyImpactEntry[];
  summary: string;
}>;

export type ResourceConstraintEntry = Readonly<{
  kind: ResourceConstraintKind;
  label: string;
  severity: ConstraintSeverityLevel;
  affectedArea: string;
  summary: string;
}>;

export type ResourceConstraintsCard = Readonly<{
  constraints: readonly ResourceConstraintEntry[];
  summary: string;
}>;

export type OperationalConstraintEntry = Readonly<{
  kind: OperationalConstraintKind;
  label: string;
  severity: ConstraintSeverityLevel;
  readiness: string;
  summary: string;
}>;

export type OperationalConstraintsCard = Readonly<{
  constraints: readonly OperationalConstraintEntry[];
  summary: string;
}>;

export type GovernanceConstraintEntry = Readonly<{
  kind: GovernanceConstraintKind;
  label: string;
  requirement: string;
  summary: string;
}>;

export type GovernanceConstraintsCard = Readonly<{
  constraints: readonly GovernanceConstraintEntry[];
  summary: string;
}>;

export type ConstraintSeverityCard = Readonly<{
  level: ConstraintSeverityLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type PolicyAttentionCard = Readonly<{
  level: PolicyAttentionLevel;
  label: string;
  escalationIndicator: string;
  reviewIndicator: string;
  summary: string;
}>;

export type PolicyConstraintIntelligenceSnapshot = Readonly<{
  policyAlignment: PolicyAlignmentCard;
  policyImpact: PolicyImpactCard;
  resourceConstraints: ResourceConstraintsCard;
  operationalConstraints: OperationalConstraintsCard;
  governanceConstraints: GovernanceConstraintsCard;
  constraintSeverity: ConstraintSeverityCard;
  policyAttention: PolicyAttentionCard;
}>;

export type PolicyConstraintIntelligenceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type PolicyConstraintIntelligenceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_ID;
  owner: typeof CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER;
  headline: string;
  policyContext: PolicyContext;
  snapshot: PolicyConstraintIntelligenceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
}>;
