/**
 * Phase 6:3 — Constraint Evaluation Layer.
 * Evaluates resource, operational, and governance constraints.
 */

import type { PolicyContext } from "./policyContextContract.ts";
import { listApprovalRequirements, listConstraints } from "./policyRegistry.ts";
import type {
  ConstraintSeverityLevel,
  GovernanceConstraintEntry,
  GovernanceConstraintsCard,
  OperationalConstraintEntry,
  OperationalConstraintsCard,
  ResourceConstraintEntry,
  ResourceConstraintsCard,
} from "./policyConstraintIntelligenceContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export type ConstraintEvaluationResult = Readonly<{
  resourceConstraints: ResourceConstraintsCard;
  operationalConstraints: OperationalConstraintsCard;
  governanceConstraints: GovernanceConstraintsCard;
  severity: ConstraintSeverityLevel;
  severityTrend: ImpactDirection;
}>;

function buildResourceConstraints(ctx: PolicyContext): ResourceConstraintsCard {
  const constraints: ResourceConstraintEntry[] = [
    Object.freeze({
      kind: "budget_constraint",
      label: "Budget Constraint",
      severity:
        ctx.scenario.expectedImpact.toLowerCase().includes("high") ? "significant" : "moderate",
      affectedArea: ctx.scenario.expectedImpact,
      summary: listConstraints().find((entry) => entry.id === "constraint_alpha")?.summary ?? "Resource boundary",
    }),
    Object.freeze({
      kind: "capacity_constraint",
      label: "Capacity Constraint",
      severity: ctx.warRoomExposure.toLowerCase().includes("high") ? "significant" : "informational",
      affectedArea: ctx.warRoomExposure,
      summary: "Institutional capacity limitation from war room exposure",
    }),
    Object.freeze({
      kind: "workforce_constraint",
      label: "Workforce Constraint",
      severity: ctx.decisionGuidance.focus === "decision_required" ? "moderate" : "informational",
      affectedArea: "Execution teams",
      summary: "Workforce availability boundary for decision execution",
    }),
    Object.freeze({
      kind: "technology_constraint",
      label: "Technology Constraint",
      severity: "informational",
      affectedArea: "Systems and dependencies",
      summary: "Technology readiness boundary — enrichment reserved for future phase",
    }),
  ];

  return Object.freeze({
    constraints: Object.freeze(constraints),
    summary: "Resource limitations visible for institutional boundary awareness",
  });
}

function buildOperationalConstraints(ctx: PolicyContext): OperationalConstraintsCard {
  const constraints: OperationalConstraintEntry[] = [
    Object.freeze({
      kind: "operational_capacity",
      label: "Operational Capacity",
      severity: ctx.warRoomUrgency.toLowerCase().includes("immediate") ? "significant" : "moderate",
      readiness: ctx.warRoomUrgency,
      summary: "Operational capacity boundary from execution realities",
    }),
    Object.freeze({
      kind: "service_availability",
      label: "Service Availability",
      severity: "moderate",
      readiness: ctx.scenario.confidence,
      summary: "Service continuity boundary for institutional execution",
    }),
    Object.freeze({
      kind: "execution_readiness",
      label: "Execution Readiness",
      severity:
        ctx.decisionGuidance.focus === "decision_required" ? "significant" : "informational",
      readiness: ctx.decisionGuidance.focus,
      summary: "Execution readiness indicator from decision context",
    }),
    Object.freeze({
      kind: "dependency_constraint",
      label: "Dependency Constraint",
      severity: ctx.decisionGuidance.tradeoffSummary.length > 0 ? "moderate" : "informational",
      readiness: "Dependency chain visible",
      summary: ctx.decisionGuidance.tradeoffSummary || "No active dependency constraint signal",
    }),
  ];

  return Object.freeze({
    constraints: Object.freeze(constraints),
    summary: "Operational limitations remain execution-focused",
  });
}

function buildGovernanceConstraints(ctx: PolicyContext): GovernanceConstraintsCard {
  const approvalAlpha = listApprovalRequirements().find((entry) => entry.id === "approval_alpha");
  const approvalBeta = listApprovalRequirements().find((entry) => entry.id === "approval_beta");

  const constraints: GovernanceConstraintEntry[] = [
    Object.freeze({
      kind: "approval_required",
      label: "Approval Required",
      requirement:
        ctx.decisionGuidance.focus === "decision_required"
          ? (approvalAlpha?.label ?? "Executive Approval")
          : "Conditional",
      summary: approvalAlpha?.summary ?? "Formal approval boundary",
    }),
    Object.freeze({
      kind: "escalation_required",
      label: "Escalation Required",
      requirement: ctx.governance.attention === "governance_escalation" ? "Yes" : "Conditional",
      summary: "Governance escalation boundary from institutional context",
    }),
    Object.freeze({
      kind: "review_required",
      label: "Review Required",
      requirement: ctx.governance.policyReviewStatus,
      summary: approvalBeta?.summary ?? "Institutional review boundary",
    }),
    Object.freeze({
      kind: "authority_limitation",
      label: "Authority Limitation",
      requirement: ctx.strategicAlignment.strategicAttention,
      summary: "Executive authority boundary from strategic alignment context",
    }),
  ];

  return Object.freeze({
    constraints: Object.freeze(constraints),
    summary: "Governance boundaries remain visible — institutional control layer",
  });
}

function resolveSeverity(
  resource: ResourceConstraintsCard,
  operational: OperationalConstraintsCard,
  governance: GovernanceConstraintsCard,
  ctx: PolicyContext
): { level: ConstraintSeverityLevel; trend: ImpactDirection } {
  const severities = [
    ...resource.constraints.map((entry) => entry.severity),
    ...operational.constraints.map((entry) => entry.severity),
  ];

  let level: ConstraintSeverityLevel = "informational";
  if (severities.includes("critical") || ctx.governance.alignment === "potential_misalignment") {
    level = "critical";
  } else if (severities.includes("significant") || governance.constraints.some((entry) => entry.requirement === "Yes")) {
    level = "significant";
  } else if (severities.includes("moderate")) {
    level = "moderate";
  }

  const trend: ImpactDirection =
    level === "critical" || level === "significant" ? "deteriorating" : level === "moderate" ? "stable" : "improving";

  return { level, trend };
}

export function evaluateConstraints(ctx: PolicyContext): ConstraintEvaluationResult {
  const resourceConstraints = buildResourceConstraints(ctx);
  const operationalConstraints = buildOperationalConstraints(ctx);
  const governanceConstraints = buildGovernanceConstraints(ctx);
  const { level, trend } = resolveSeverity(resourceConstraints, operationalConstraints, governanceConstraints, ctx);

  return Object.freeze({
    resourceConstraints,
    operationalConstraints,
    governanceConstraints,
    severity: level,
    severityTrend: trend,
  });
}
