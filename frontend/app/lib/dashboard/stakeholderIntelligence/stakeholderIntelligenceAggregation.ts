/**
 * Phase 6:4 — Stakeholder Intelligence aggregation.
 */

import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { resolveExecutiveAdvisorySurface } from "../executiveAdvisory/executiveAdvisoryRuntime.ts";
import { resolveDecisionGuidanceSurface } from "../decisionGuidance/decisionGuidanceRuntime.ts";
import { resolveGovernanceIntelligenceSurface } from "../governanceIntelligence/governanceIntelligenceRuntime.ts";
import { resolveStrategicAlignmentSurface } from "../strategicAlignment/strategicAlignmentRuntime.ts";
import { resolvePolicyConstraintIntelligenceSurface } from "../policyConstraintIntelligence/policyConstraintIntelligenceRuntime.ts";
import { getScenarioIntelligenceSnapshotForExecutiveSummary } from "../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { getWarRoomIntelligenceSnapshotForExecutiveSummary } from "../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { buildStakeholderContext } from "./stakeholderContextGeneration.ts";
import { evaluateStakeholders } from "./stakeholderEvaluation.ts";
import {
  CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER,
  CANONICAL_STAKEHOLDER_INTELLIGENCE_SURFACE_ID,
} from "./stakeholderIntelligenceContract.ts";
import type {
  StakeholderAlignmentCard,
  StakeholderAlignmentLevel,
  StakeholderAttentionCard,
  StakeholderAttentionLevel,
  StakeholderConfidenceCard,
  StakeholderImpactCard,
  StakeholderImpactLevel,
  StakeholderIntelligenceAggregationInput,
  StakeholderIntelligenceSnapshot,
  StakeholderIntelligenceSurfaceModel,
  StakeholderTensionCard,
  StakeholderTensionLevel,
  StakeholderVisibilityCard,
} from "./stakeholderIntelligenceContract.ts";
import type { StakeholderContext } from "./stakeholderContextContract.ts";
import {
  reportStakeholderAlignmentCard,
  reportStakeholderAttention,
  reportStakeholderConfidence,
  reportStakeholderImpactCard,
  reportStakeholderInfluence,
  reportStakeholderIntelligence,
  reportStakeholderIntelligenceSurface,
  reportStakeholderSupport,
  reportStakeholderTension,
} from "./stakeholderIntelligenceLogging.ts";

const IMPACT_LABEL: Readonly<Record<StakeholderImpactLevel, string>> = Object.freeze({
  positive: "Positive Impact",
  neutral: "Neutral Impact",
  negative: "Negative Impact",
  mixed: "Mixed Impact",
});

const ALIGNMENT_LABEL: Readonly<Record<StakeholderAlignmentLevel, string>> = Object.freeze({
  aligned: "Aligned",
  partially_aligned: "Partially Aligned",
  conflicting_interests: "Conflicting Interests",
  misaligned: "Misaligned",
});

const TENSION_LABEL: Readonly<Record<StakeholderTensionLevel, string>> = Object.freeze({
  no_significant_tension: "No Significant Tension",
  competing_priorities: "Competing Priorities",
  resource_conflict: "Resource Conflict",
  strategic_conflict: "Strategic Conflict",
});

const ATTENTION_LABEL: Readonly<Record<StakeholderAttentionLevel, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review",
  leadership_discussion_recommended: "Leadership Discussion Recommended",
  stakeholder_escalation: "Stakeholder Escalation",
});

function collectStakeholderInputs(input: StakeholderIntelligenceAggregationInput): StakeholderContext {
  const advisory = resolveExecutiveAdvisorySurface(input);
  const decisionGuidance = resolveDecisionGuidanceSurface(input);
  const governance = resolveGovernanceIntelligenceSurface(input);
  const strategic = resolveStrategicAlignmentSurface(input);
  const policy = resolvePolicyConstraintIntelligenceSurface(input);
  const scenario = getScenarioIntelligenceSnapshotForExecutiveSummary(input);
  const warRoom = getWarRoomIntelligenceSnapshotForExecutiveSummary(input);

  return buildStakeholderContext({
    decisionGuidance: decisionGuidance.snapshot,
    governanceSnapshot: governance.snapshot,
    strategicSnapshot: strategic.snapshot,
    policySnapshot: policy.snapshot,
    scenarioSnapshot: scenario,
    warRoomSnapshot: warRoom,
    confidenceEvaluation: advisory.confidenceEvaluation,
  });
}

export function aggregateStakeholderIntelligence(
  input: StakeholderIntelligenceAggregationInput
): StakeholderIntelligenceSurfaceModel {
  const stakeholderContext = collectStakeholderInputs(input);
  const evaluation = evaluateStakeholders(stakeholderContext);

  const stakeholderVisibility: StakeholderVisibilityCard = Object.freeze({
    stakeholders: evaluation.visibility,
    summary: "Affected stakeholder groups visible for organizational impact awareness",
  });

  const stakeholderImpact: StakeholderImpactCard = Object.freeze({
    impact: evaluation.impact,
    label: IMPACT_LABEL[evaluation.impact],
    trend: evaluation.impactTrend,
    summary: "Primary stakeholder signal — who benefits, suffers, or experiences mixed impact",
  });

  const stakeholderAlignment: StakeholderAlignmentCard = Object.freeze({
    alignment: evaluation.aggregateAlignment,
    label: ALIGNMENT_LABEL[evaluation.aggregateAlignment],
    entries: evaluation.alignmentEntries,
    summary: "Shared and conflicting stakeholder interests across organizational groups",
  });

  const stakeholderInfluence = Object.freeze({
    entries: evaluation.influenceEntries,
    summary: "Organizational leverage points — influence does not imply authority",
  });

  const stakeholderTension: StakeholderTensionCard = Object.freeze({
    level: evaluation.tension,
    label: TENSION_LABEL[evaluation.tension],
    competingInterests: evaluation.competingInterests,
    summary:
      evaluation.tension === "no_significant_tension"
        ? "No significant stakeholder tension detected"
        : "Stakeholder tensions require leadership awareness",
  });

  const stakeholderSupport = Object.freeze({
    entries: evaluation.supportEntries,
    summary: "Support awareness indicator — not a prediction of stakeholder behavior",
  });

  const stakeholderConfidence: StakeholderConfidenceCard = Object.freeze({
    level: evaluation.confidence,
    label: stakeholderContext.confidenceLabel,
    metadata: `Inherited from Advisory Confidence Framework · ${stakeholderContext.confidenceLevel}`,
    summary: "Stakeholder conclusions inherit advisory confidence metadata",
  });

  const stakeholderAttention: StakeholderAttentionCard = Object.freeze({
    level: evaluation.attention,
    label: ATTENTION_LABEL[evaluation.attention],
    escalationIndicator:
      evaluation.attention === "stakeholder_escalation" ? "Escalation recommended" : "No escalation",
    discussionIndicator:
      evaluation.attention === "leadership_discussion_recommended" ||
      evaluation.attention === "stakeholder_escalation"
        ? "Leadership discussion recommended"
        : "Routine monitoring",
    summary: "Final stakeholder output — organizational impact awareness",
  });

  const snapshot: StakeholderIntelligenceSnapshot = Object.freeze({
    stakeholderVisibility,
    stakeholderImpact,
    stakeholderAlignment,
    stakeholderInfluence,
    stakeholderTension,
    stakeholderSupport,
    stakeholderConfidence,
    stakeholderAttention,
  });

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_STAKEHOLDER_INTELLIGENCE_SURFACE_ID);

  const model: StakeholderIntelligenceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_STAKEHOLDER_INTELLIGENCE_SURFACE_ID,
    owner: CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER,
    headline: "Who is affected by this decision?",
    stakeholderContext,
    snapshot,
    visualBundle,
  });

  reportStakeholderIntelligence({
    dashboardContext: input.dashboardContext,
    version: "6.4.0",
    impact: stakeholderImpact.impact,
    owner: CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER,
  });
  reportStakeholderImpactCard(snapshot.stakeholderImpact);
  reportStakeholderAlignmentCard(snapshot.stakeholderAlignment);
  reportStakeholderInfluence(snapshot.stakeholderInfluence);
  reportStakeholderTension(snapshot.stakeholderTension);
  reportStakeholderSupport(snapshot.stakeholderSupport);
  reportStakeholderConfidence(snapshot.stakeholderConfidence);
  reportStakeholderAttention(snapshot.stakeholderAttention);
  reportStakeholderIntelligenceSurface(model);

  return model;
}
