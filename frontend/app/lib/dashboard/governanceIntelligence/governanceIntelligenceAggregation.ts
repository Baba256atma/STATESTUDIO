/**
 * Phase 6:1 — Governance Intelligence aggregation.
 * Consumes decision guidance, advisory, confidence, and explainability feeds only.
 */

import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { resolveExecutiveAdvisorySurface } from "../executiveAdvisory/executiveAdvisoryRuntime.ts";
import { resolveDecisionGuidanceSurface } from "../decisionGuidance/decisionGuidanceRuntime.ts";
import { getScenarioIntelligenceSnapshotForExecutiveSummary } from "../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { getWarRoomIntelligenceSnapshotForExecutiveSummary } from "../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { buildGovernanceContext } from "./governanceContextGeneration.ts";
import {
  CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER,
  CANONICAL_GOVERNANCE_INTELLIGENCE_SURFACE_ID,
} from "./governanceIntelligenceContract.ts";
import type {
  AccountabilityContextCard,
  AccountabilityEntry,
  ConstraintAwarenessCard,
  ConstraintEntry,
  GovernanceAlignmentCard,
  GovernanceAlignmentLevel,
  GovernanceAttentionCard,
  GovernanceAttentionLevel,
  GovernanceIntelligenceAggregationInput,
  GovernanceIntelligenceSnapshot,
  GovernanceIntelligenceSurfaceModel,
  PolicyAwarenessCard,
  PolicyConsideration,
  StakeholderImpactCard,
  StakeholderImpactEntry,
} from "./governanceIntelligenceContract.ts";
import type { GovernanceContext } from "./governanceContextContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";
import {
  reportAccountabilityContext,
  reportConstraintAwareness,
  reportGovernanceAlignment,
  reportGovernanceAttention,
  reportGovernanceIntelligence,
  reportGovernanceIntelligenceSurface,
  reportPolicyAwareness,
  reportStakeholderImpact,
} from "./governanceIntelligenceLogging.ts";

const ALIGNMENT_LABEL: Readonly<Record<GovernanceAlignmentLevel, string>> = Object.freeze({
  aligned: "Aligned",
  partially_aligned: "Partially Aligned",
  requires_review: "Requires Review",
  potential_misalignment: "Potential Misalignment",
});

const ATTENTION_LABEL: Readonly<Record<GovernanceAttentionLevel, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review",
  approval_recommended: "Approval Recommended",
  governance_escalation: "Governance Escalation",
});

function resolveGovernanceAlignment(ctx: GovernanceContext): GovernanceAlignmentCard {
  const focus = ctx.decisionGuidance.focus;
  const confidence = ctx.confidence.level;

  let alignment: GovernanceAlignmentLevel = "aligned";
  let trend: ImpactDirection = "stable";

  if (focus === "decision_required" && (confidence === "low" || confidence === "moderate")) {
    alignment = "potential_misalignment";
    trend = "deteriorating";
  } else if (focus === "decision_required" || focus === "decision_recommended") {
    alignment = "requires_review";
    trend = "stable";
  } else if (focus === "investigate" || focus === "review") {
    alignment = "partially_aligned";
    trend = "stable";
  } else if (ctx.warRoom.threatLevel.toLowerCase().includes("critical")) {
    alignment = "requires_review";
    trend = "deteriorating";
  }

  return Object.freeze({
    alignment,
    label: ALIGNMENT_LABEL[alignment],
    trend,
    summary:
      alignment === "aligned"
        ? "Decision posture aligns with institutional governance expectations"
        : alignment === "partially_aligned"
          ? "Governance alignment is partial — institutional review recommended"
          : alignment === "requires_review"
            ? "Institutional review recommended before proceeding"
            : "Potential governance misalignment detected — evaluate constraints and accountability",
  });
}

function buildPolicyAwarenessCard(ctx: GovernanceContext): PolicyAwarenessCard {
  const considerations: PolicyConsideration[] = [];

  if (ctx.decisionGuidance.focus === "decision_required" || ctx.decisionGuidance.focus === "decision_recommended") {
    considerations.push(
      Object.freeze({
        label: "Decision Policy Impact",
        status: "policy_review_required" as const,
        summary: "Executive decision may require policy review before commitment",
      })
    );
  }

  if (ctx.decisionGuidance.tradeoffSummary.length > 0) {
    considerations.push(
      Object.freeze({
        label: "Tradeoff Policy Impact",
        status: "policy_impact" as const,
        summary: ctx.decisionGuidance.tradeoffSummary,
      })
    );
  }

  if (ctx.explainability.assumptionsSummary.length > 20) {
    considerations.push(
      Object.freeze({
        label: "Assumption Policy Review",
        status: "policy_conflict_detected" as const,
        summary: ctx.explainability.assumptionsSummary,
      })
    );
  }

  if (considerations.length === 0) {
    considerations.push(
      Object.freeze({
        label: "No Active Policy Signal",
        status: "no_policy_signal" as const,
        summary: "No immediate policy considerations from current decision context",
      })
    );
  }

  const hasConflict = considerations.some((entry) => entry.status === "policy_conflict_detected");

  return Object.freeze({
    considerations: Object.freeze(considerations),
    reviewStatus:
      considerations.some((entry) => entry.status === "policy_review_required")
        ? "Policy review recommended"
        : "No policy review required",
    conflictIndicator: hasConflict ? "Policy conflict indicators present" : "No policy conflicts detected",
    summary: "Policy awareness from decision intelligence — not compliance automation",
  });
}

function buildConstraintAwarenessCard(ctx: GovernanceContext): ConstraintAwarenessCard {
  const constraints: ConstraintEntry[] = [];

  if (ctx.warRoom.actionUrgency.toLowerCase().includes("immediate") || ctx.warRoom.threatLevel.toLowerCase().includes("high")) {
    constraints.push(
      Object.freeze({
        category: "operational_constraints" as const,
        label: "Operational Pressure",
        severity: "high" as const,
        summary: `${ctx.warRoom.threatLevel} · ${ctx.warRoom.actionUrgency}`,
      })
    );
  }

  if (ctx.scenario.expectedImpact.toLowerCase().includes("high") || ctx.scenario.expectedImpact.toLowerCase().includes("critical")) {
    constraints.push(
      Object.freeze({
        category: "resource_constraints" as const,
        label: "Resource Impact",
        severity: "moderate" as const,
        summary: ctx.scenario.expectedImpact,
      })
    );
  }

  constraints.push(
    Object.freeze({
      category: "timeline_constraints" as const,
      label: "Decision Window",
      severity: ctx.decisionGuidance.focus === "decision_required" ? "critical" : "moderate",
      summary: ctx.executiveAdvisory.urgency,
    })
  );

  constraints.push(
    Object.freeze({
      category: "governance_constraints" as const,
      label: "Governance Posture",
      severity:
        ctx.decisionGuidance.focus === "decision_required"
          ? "high"
          : ctx.decisionGuidance.focus === "investigate"
            ? "moderate"
            : "low",
      summary: ctx.decisionGuidance.contextSummary,
    })
  );

  return Object.freeze({
    constraints: Object.freeze(constraints),
    summary: "Institutional constraints visible for executive evaluation",
  });
}

function buildStakeholderImpactCard(ctx: GovernanceContext): StakeholderImpactCard {
  const stakeholders: StakeholderImpactEntry[] = [
    Object.freeze({
      group: "executive_impact" as const,
      label: "Executive Impact",
      impactSummary: ctx.executiveAdvisory.guidanceSummary,
      visibility: "executive",
    }),
    Object.freeze({
      group: "operational_impact" as const,
      label: "Operational Impact",
      impactSummary: ctx.warRoom.decisionFocus,
      visibility: "operational",
    }),
    Object.freeze({
      group: "financial_impact" as const,
      label: "Financial Impact",
      impactSummary: ctx.scenario.expectedImpact,
      visibility: "financial",
    }),
    Object.freeze({
      group: "cross_team_impact" as const,
      label: "Cross-Team Impact",
      impactSummary: ctx.scenario.comparisonSummary,
      visibility: "cross_functional",
    }),
  ];

  return Object.freeze({
    stakeholders: Object.freeze(stakeholders),
    summary: "Stakeholder impact awareness — foundation for institutional alignment",
  });
}

function buildAccountabilityContextCard(ctx: GovernanceContext): AccountabilityContextCard {
  const entries: AccountabilityEntry[] = [
    Object.freeze({
      indicator: "decision_owner" as const,
      label: "Decision Owner",
      value: "Executive",
      summary: "Primary accountability rests with executive decision authority",
    }),
    Object.freeze({
      indicator: "review_owner" as const,
      label: "Review Owner",
      value: ctx.decisionGuidance.focus === "decision_required" ? "Governance Review" : "Advisory Review",
      summary: "Institutional review ownership before final commitment",
    }),
    Object.freeze({
      indicator: "approval_required" as const,
      label: "Approval Required",
      value: ctx.decisionGuidance.focus === "decision_required" ? "Yes" : "Conditional",
      summary:
        ctx.decisionGuidance.focus === "decision_required"
          ? "Formal approval recommended before proceeding"
          : "Approval may be deferred pending further review",
    }),
    Object.freeze({
      indicator: "escalation_path" as const,
      label: "Escalation Path",
      value: ctx.warRoom.actionUrgency,
      summary: `War Room → Advisory → Governance → Executive Summary`,
    }),
  ];

  return Object.freeze({
    entries: Object.freeze(entries),
    summary: "Accountability context clarifies responsibility — governance does not decide",
  });
}

function resolveGovernanceAttention(
  alignment: GovernanceAlignmentLevel,
  ctx: GovernanceContext
): GovernanceAttentionCard {
  let level: GovernanceAttentionLevel = "monitor";

  if (alignment === "potential_misalignment") {
    level = "governance_escalation";
  } else if (alignment === "requires_review" || ctx.decisionGuidance.focus === "decision_required") {
    level = "approval_recommended";
  } else if (alignment === "partially_aligned" || ctx.decisionGuidance.focus === "investigate") {
    level = "review";
  }

  return Object.freeze({
    level,
    label: ATTENTION_LABEL[level],
    reviewStatus:
      level === "review" || level === "approval_recommended" || level === "governance_escalation"
        ? "Governance review active"
        : "Routine monitoring",
    escalationStatus: level === "governance_escalation" ? "Escalation recommended" : "No escalation",
    summary: "Executive governance output — institutional alignment awareness",
  });
}

function collectGovernanceInputs(input: GovernanceIntelligenceAggregationInput): GovernanceContext {
  const advisory = resolveExecutiveAdvisorySurface(input);
  const decisionGuidance = resolveDecisionGuidanceSurface(input);
  const warRoom = getWarRoomIntelligenceSnapshotForExecutiveSummary(input);
  const scenario = getScenarioIntelligenceSnapshotForExecutiveSummary(input);

  return buildGovernanceContext({
    decisionGuidance: decisionGuidance.snapshot,
    advisorySnapshot: advisory.snapshot,
    confidenceEvaluation: advisory.confidenceEvaluation,
    explanationBundle: advisory.explanationBundle,
    warRoomSnapshot: warRoom,
    scenarioSnapshot: scenario,
  });
}

export function aggregateGovernanceIntelligence(
  input: GovernanceIntelligenceAggregationInput
): GovernanceIntelligenceSurfaceModel {
  const governanceContext = collectGovernanceInputs(input);
  const governanceAlignment = resolveGovernanceAlignment(governanceContext);
  const policyAwareness = buildPolicyAwarenessCard(governanceContext);
  const constraintAwareness = buildConstraintAwarenessCard(governanceContext);
  const stakeholderImpact = buildStakeholderImpactCard(governanceContext);
  const accountabilityContext = buildAccountabilityContextCard(governanceContext);
  const governanceAttention = resolveGovernanceAttention(governanceAlignment.alignment, governanceContext);

  const snapshot: GovernanceIntelligenceSnapshot = Object.freeze({
    governanceAlignment,
    policyAwareness,
    constraintAwareness,
    stakeholderImpact,
    accountabilityContext,
    governanceAttention,
  });

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_GOVERNANCE_INTELLIGENCE_SURFACE_ID);

  const model: GovernanceIntelligenceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_GOVERNANCE_INTELLIGENCE_SURFACE_ID,
    owner: CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER,
    headline: "Is this decision aligned with organizational governance?",
    governanceContext,
    snapshot,
    visualBundle,
  });

  reportGovernanceIntelligence({
    dashboardContext: input.dashboardContext,
    version: "6.1.0",
    alignment: governanceAlignment.alignment,
    owner: CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER,
  });
  reportGovernanceAlignment(snapshot.governanceAlignment);
  reportPolicyAwareness(snapshot.policyAwareness);
  reportConstraintAwareness(snapshot.constraintAwareness);
  reportStakeholderImpact(snapshot.stakeholderImpact);
  reportAccountabilityContext(snapshot.accountabilityContext);
  reportGovernanceAttention(snapshot.governanceAttention);
  reportGovernanceIntelligenceSurface(model);

  return model;
}
