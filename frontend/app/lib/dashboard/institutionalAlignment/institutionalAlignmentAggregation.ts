/**
 * Phase 6:6 — Institutional Alignment aggregation.
 */

import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { resolveGovernanceIntelligenceSurface } from "../governanceIntelligence/governanceIntelligenceRuntime.ts";
import { resolveStrategicAlignmentSurface } from "../strategicAlignment/strategicAlignmentRuntime.ts";
import { resolvePolicyConstraintIntelligenceSurface } from "../policyConstraintIntelligence/policyConstraintIntelligenceRuntime.ts";
import { resolveStakeholderIntelligenceSurface } from "../stakeholderIntelligence/stakeholderIntelligenceRuntime.ts";
import { resolveConsensusIntelligenceSurface } from "../consensusIntelligence/consensusIntelligenceRuntime.ts";
import { buildInstitutionalContext } from "./institutionalContextGeneration.ts";
import { evaluateInstitutionalAlignment } from "./institutionalEvaluation.ts";
import {
  CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
  CANONICAL_INSTITUTIONAL_ALIGNMENT_SURFACE_ID,
} from "./institutionalAlignmentContract.ts";
import type {
  ConsensusStatusLevel,
  GovernanceStatusLevel,
  InstitutionalAlignmentAggregationInput,
  InstitutionalAlignmentSnapshot,
  InstitutionalAlignmentSurfaceModel,
  InstitutionalAttentionLevel,
  InstitutionalHealthLevel,
  PolicyStatusLevel,
  StakeholderStatusLevel,
  StrategicAlignmentStatusLevel,
} from "./institutionalAlignmentContract.ts";
import type { InstitutionalContext } from "./institutionalContextContract.ts";
import {
  reportConsensusStatus,
  reportGovernanceStatus,
  reportInstitutionalAlignment,
  reportInstitutionalAlignmentSurface,
  reportInstitutionalAttention,
  reportInstitutionalHealth,
  reportPolicyStatus,
  reportStakeholderStatus,
  reportStrategicAlignmentStatus,
} from "./institutionalAlignmentLogging.ts";

const HEALTH_LABEL: Readonly<Record<InstitutionalHealthLevel, string>> = Object.freeze({
  strong_alignment: "Strong Alignment",
  moderate_alignment: "Moderate Alignment",
  fragmented_alignment: "Fragmented Alignment",
  institutional_risk: "Institutional Risk",
});

const GOVERNANCE_LABEL: Readonly<Record<GovernanceStatusLevel, string>> = Object.freeze({
  governance_aligned: "Governance Aligned",
  governance_review_required: "Governance Review Required",
  governance_escalation: "Governance Escalation",
});

const STRATEGIC_LABEL: Readonly<Record<StrategicAlignmentStatusLevel, string>> = Object.freeze({
  strategic_objectives_supported: "Strategic Objectives Supported",
  mixed_strategic_signals: "Mixed Strategic Signals",
  strategic_misalignment: "Strategic Misalignment",
});

const POLICY_LABEL: Readonly<Record<PolicyStatusLevel, string>> = Object.freeze({
  policy_aligned: "Policy Aligned",
  constraint_pressure: "Constraint Pressure",
  policy_conflict: "Policy Conflict",
});

const STAKEHOLDER_LABEL: Readonly<Record<StakeholderStatusLevel, string>> = Object.freeze({
  strong_support: "Strong Support",
  mixed_support: "Mixed Support",
  stakeholder_resistance: "Stakeholder Resistance",
});

const CONSENSUS_LABEL: Readonly<Record<ConsensusStatusLevel, string>> = Object.freeze({
  strong_consensus: "Strong Consensus",
  partial_consensus: "Partial Consensus",
  institutional_tension: "Institutional Tension",
});

const ATTENTION_LABEL: Readonly<Record<InstitutionalAttentionLevel, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review",
  leadership_discussion_recommended: "Leadership Discussion Recommended",
  institutional_escalation: "Institutional Escalation",
});

function collectInstitutionalInputs(
  input: InstitutionalAlignmentAggregationInput
): InstitutionalContext {
  const governance = resolveGovernanceIntelligenceSurface(input);
  const strategic = resolveStrategicAlignmentSurface(input);
  const policy = resolvePolicyConstraintIntelligenceSurface(input);
  const stakeholder = resolveStakeholderIntelligenceSurface(input);
  const consensus = resolveConsensusIntelligenceSurface(input);

  return buildInstitutionalContext({
    governanceSnapshot: governance.snapshot,
    strategicSnapshot: strategic.snapshot,
    policySnapshot: policy.snapshot,
    stakeholderSnapshot: stakeholder.snapshot,
    consensusSnapshot: consensus.snapshot,
  });
}

export function aggregateInstitutionalAlignment(
  input: InstitutionalAlignmentAggregationInput
): InstitutionalAlignmentSurfaceModel {
  const institutionalContext = collectInstitutionalInputs(input);
  const evaluation = evaluateInstitutionalAlignment(institutionalContext);

  const institutionalHealth = Object.freeze({
    level: evaluation.health,
    label: HEALTH_LABEL[evaluation.health],
    trend: evaluation.healthTrend,
    summary: "Primary institutional indicator — organizational coherence across governance, strategy, and stakeholders",
  });

  const governanceStatus = Object.freeze({
    level: evaluation.governanceStatus,
    label: GOVERNANCE_LABEL[evaluation.governanceStatus],
    alert:
      evaluation.governanceStatus === "governance_escalation"
        ? "Escalation alert active"
        : "No escalation",
    visibility: institutionalContext.governance.alignmentSummary,
    summary: "Governance intelligence summary — institutional boundary and alignment conditions",
  });

  const strategicAlignmentStatus = Object.freeze({
    level: evaluation.strategicStatus,
    label: STRATEGIC_LABEL[evaluation.strategicStatus],
    visibility: institutionalContext.strategicAlignment.alignmentSummary,
    concern:
      evaluation.strategicStatus === "strategic_misalignment"
        ? "Strategic direction concern detected"
        : "No critical strategic concern",
    summary: "Strategic alignment summary — direction and objective support visibility",
  });

  const policyStatus = Object.freeze({
    level: evaluation.policyStatus,
    label: POLICY_LABEL[evaluation.policyStatus],
    policyVisibility: `Policy: ${institutionalContext.policy.policyAlignment}`,
    constraintVisibility: `Severity: ${institutionalContext.policy.constraintSeverity}`,
    summary: "Policy and constraint summary — institutional guardrail awareness",
  });

  const stakeholderStatus = Object.freeze({
    level: evaluation.stakeholderStatus,
    label: STAKEHOLDER_LABEL[evaluation.stakeholderStatus],
    supportVisibility: `Impact: ${institutionalContext.stakeholder.impact}`,
    tensionVisibility: `Tension: ${institutionalContext.stakeholder.tension}`,
    summary: "Stakeholder summary — organizational support and resistance awareness",
  });

  const consensusStatus = Object.freeze({
    level: evaluation.consensusStatus,
    label: CONSENSUS_LABEL[evaluation.consensusStatus],
    convergenceVisibility: `Consensus: ${institutionalContext.consensus.consensusLevel}`,
    divergenceVisibility: `Tension: ${institutionalContext.consensus.institutionalTension}`,
    summary: "Consensus summary — organizational agreement and institutional friction",
  });

  const institutionalAttention = Object.freeze({
    level: evaluation.attention,
    label: ATTENTION_LABEL[evaluation.attention],
    escalationIndicator:
      evaluation.attention === "institutional_escalation"
        ? "Escalation recommended"
        : "No escalation",
    discussionIndicator:
      evaluation.attention === "leadership_discussion_recommended" ||
      evaluation.attention === "institutional_escalation"
        ? "Leadership discussion recommended"
        : "Routine monitoring",
    summary: "Final institutional output — executive command center attention signal",
  });

  const snapshot: InstitutionalAlignmentSnapshot = Object.freeze({
    institutionalHealth,
    governanceStatus,
    strategicAlignmentStatus,
    policyStatus,
    stakeholderStatus,
    consensusStatus,
    institutionalAttention,
  });

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_INSTITUTIONAL_ALIGNMENT_SURFACE_ID);

  const model: InstitutionalAlignmentSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_INSTITUTIONAL_ALIGNMENT_SURFACE_ID,
    owner: CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
    headline: "Is the organization aligned — and where is friction building?",
    institutionalContext,
    snapshot,
    visualBundle,
  });

  reportInstitutionalAlignment({
    dashboardContext: input.dashboardContext,
    version: "6.6.0",
    health: institutionalHealth.level,
    owner: CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
  });
  reportInstitutionalHealth(snapshot.institutionalHealth);
  reportGovernanceStatus(snapshot.governanceStatus);
  reportStrategicAlignmentStatus(snapshot.strategicAlignmentStatus);
  reportPolicyStatus(snapshot.policyStatus);
  reportStakeholderStatus(snapshot.stakeholderStatus);
  reportConsensusStatus(snapshot.consensusStatus);
  reportInstitutionalAttention(snapshot.institutionalAttention);
  reportInstitutionalAlignmentSurface(model);

  return model;
}
