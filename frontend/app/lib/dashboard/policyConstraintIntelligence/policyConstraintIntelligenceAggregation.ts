/**
 * Phase 6:3 — Policy & Constraint Intelligence aggregation.
 * Consumes decision guidance, governance, strategic alignment, and scenario feeds only.
 */

import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { resolveDecisionGuidanceSurface } from "../decisionGuidance/decisionGuidanceRuntime.ts";
import { resolveGovernanceIntelligenceSurface } from "../governanceIntelligence/governanceIntelligenceRuntime.ts";
import { resolveStrategicAlignmentSurface } from "../strategicAlignment/strategicAlignmentRuntime.ts";
import { getScenarioIntelligenceSnapshotForExecutiveSummary } from "../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { getWarRoomIntelligenceSnapshotForExecutiveSummary } from "../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { buildPolicyContext } from "./policyContextGeneration.ts";
import { evaluatePolicies } from "./policyEvaluation.ts";
import { evaluateConstraints } from "./constraintEvaluation.ts";
import {
  CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER,
  CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_ID,
} from "./policyConstraintIntelligenceContract.ts";
import type {
  ConstraintSeverityCard,
  ConstraintSeverityLevel,
  PolicyAlignmentCard,
  PolicyAlignmentLevel,
  PolicyAttentionCard,
  PolicyAttentionLevel,
  PolicyConstraintIntelligenceAggregationInput,
  PolicyConstraintIntelligenceSnapshot,
  PolicyConstraintIntelligenceSurfaceModel,
  PolicyImpactCard,
  PolicyImpactLevel,
} from "./policyConstraintIntelligenceContract.ts";
import type { PolicyContext } from "./policyContextContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";
import {
  reportConstraintSeverity,
  reportGovernanceConstraint,
  reportOperationalConstraint,
  reportPolicyAlignment,
  reportPolicyAttention,
  reportPolicyConstraintIntelligenceSurface,
  reportPolicyImpact,
  reportPolicyIntelligence,
  reportResourceConstraint,
} from "./policyConstraintIntelligenceLogging.ts";

const ALIGNMENT_LABEL: Readonly<Record<PolicyAlignmentLevel, string>> = Object.freeze({
  aligned: "Aligned",
  partially_aligned: "Partially Aligned",
  requires_review: "Requires Review",
  potential_conflict: "Potential Conflict",
});

const IMPACT_LABEL: Readonly<Record<PolicyImpactLevel, string>> = Object.freeze({
  low: "Low Impact",
  moderate: "Moderate Impact",
  high: "High Impact",
  critical: "Critical Impact",
});

const SEVERITY_LABEL: Readonly<Record<ConstraintSeverityLevel, string>> = Object.freeze({
  informational: "Informational",
  moderate: "Moderate",
  significant: "Significant",
  critical: "Critical",
});

const ATTENTION_LABEL: Readonly<Record<PolicyAttentionLevel, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review",
  leadership_attention_recommended: "Leadership Attention Recommended",
  policy_escalation: "Policy Escalation",
});

function buildPolicyAlignmentCard(
  alignment: PolicyAlignmentLevel,
  trend: ImpactDirection
): PolicyAlignmentCard {
  return Object.freeze({
    alignment,
    label: ALIGNMENT_LABEL[alignment],
    trend,
    summary:
      alignment === "aligned"
        ? "Decision operates within institutional policy boundaries"
        : alignment === "partially_aligned"
          ? "Partial policy alignment — leadership should understand limitations"
          : alignment === "requires_review"
            ? "Policy review recommended before proceeding"
            : "Potential policy conflict — institutional boundaries may be exceeded",
  });
}

function buildPolicyImpactCard(
  level: PolicyImpactLevel,
  affectedPolicies: PolicyImpactCard["affectedPolicies"]
): PolicyImpactCard {
  return Object.freeze({
    level,
    label: IMPACT_LABEL[level],
    affectedPolicies,
    summary: "Policy impact from institutional boundary evaluation — not compliance enforcement",
  });
}

function buildConstraintSeverityCard(
  level: ConstraintSeverityLevel,
  trend: ImpactDirection
): ConstraintSeverityCard {
  return Object.freeze({
    level,
    label: SEVERITY_LABEL[level],
    trend,
    summary:
      level === "critical"
        ? "Critical constraint severity — primary institutional guardrail signal"
        : level === "significant"
          ? "Significant constraints require leadership awareness"
          : level === "moderate"
            ? "Moderate constraints visible for executive evaluation"
            : "Informational constraints — routine monitoring",
  });
}

function resolvePolicyAttention(
  alignment: PolicyAlignmentLevel,
  severity: ConstraintSeverityLevel,
  ctx: PolicyContext
): PolicyAttentionCard {
  let level: PolicyAttentionLevel = "monitor";

  if (alignment === "potential_conflict" || severity === "critical") {
    level = "policy_escalation";
  } else if (alignment === "requires_review" || severity === "significant") {
    level = "leadership_attention_recommended";
  } else if (alignment === "partially_aligned" || ctx.governance.policyReviewStatus.includes("recommended")) {
    level = "review";
  }

  return Object.freeze({
    level,
    label: ATTENTION_LABEL[level],
    escalationIndicator: level === "policy_escalation" ? "Escalation recommended" : "No escalation",
    reviewIndicator:
      level === "review" || level === "leadership_attention_recommended" || level === "policy_escalation"
        ? "Policy review active"
        : "Routine monitoring",
    summary: "Final policy output — institutional boundary awareness",
  });
}

function collectPolicyInputs(input: PolicyConstraintIntelligenceAggregationInput): PolicyContext {
  const decisionGuidance = resolveDecisionGuidanceSurface(input);
  const governance = resolveGovernanceIntelligenceSurface(input);
  const strategic = resolveStrategicAlignmentSurface(input);
  const scenario = getScenarioIntelligenceSnapshotForExecutiveSummary(input);
  const warRoom = getWarRoomIntelligenceSnapshotForExecutiveSummary(input);

  return buildPolicyContext({
    decisionGuidance: decisionGuidance.snapshot,
    governanceSnapshot: governance.snapshot,
    strategicSnapshot: strategic.snapshot,
    scenarioSnapshot: scenario,
    warRoomSnapshot: warRoom,
  });
}

export function aggregatePolicyConstraintIntelligence(
  input: PolicyConstraintIntelligenceAggregationInput
): PolicyConstraintIntelligenceSurfaceModel {
  const policyContext = collectPolicyInputs(input);
  const policyEvaluation = evaluatePolicies(policyContext);
  const constraintEvaluation = evaluateConstraints(policyContext);

  const policyAlignment = buildPolicyAlignmentCard(
    policyEvaluation.alignment,
    policyEvaluation.alignmentTrend
  );
  const policyImpact = buildPolicyImpactCard(
    policyEvaluation.impactLevel,
    policyEvaluation.affectedPolicies
  );
  const constraintSeverity = buildConstraintSeverityCard(
    constraintEvaluation.severity,
    constraintEvaluation.severityTrend
  );
  const policyAttention = resolvePolicyAttention(
    policyEvaluation.alignment,
    constraintEvaluation.severity,
    policyContext
  );

  const snapshot: PolicyConstraintIntelligenceSnapshot = Object.freeze({
    policyAlignment,
    policyImpact,
    resourceConstraints: constraintEvaluation.resourceConstraints,
    operationalConstraints: constraintEvaluation.operationalConstraints,
    governanceConstraints: constraintEvaluation.governanceConstraints,
    constraintSeverity,
    policyAttention,
  });

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_ID);

  const model: PolicyConstraintIntelligenceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_ID,
    owner: CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER,
    headline: "Can this decision be executed within organizational constraints?",
    policyContext,
    snapshot,
    visualBundle,
  });

  reportPolicyIntelligence({
    dashboardContext: input.dashboardContext,
    version: "6.3.0",
    alignment: policyAlignment.alignment,
    owner: CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER,
  });
  reportPolicyAlignment(snapshot.policyAlignment);
  reportPolicyImpact(snapshot.policyImpact);
  reportResourceConstraint(snapshot.resourceConstraints);
  reportOperationalConstraint(snapshot.operationalConstraints);
  reportGovernanceConstraint(snapshot.governanceConstraints);
  reportConstraintSeverity(snapshot.constraintSeverity);
  reportPolicyAttention(snapshot.policyAttention);
  reportPolicyConstraintIntelligenceSurface(model);

  return model;
}
