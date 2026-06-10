/**
 * Phase 6:5 — Consensus Intelligence aggregation.
 */

import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { resolveExecutiveAdvisorySurface } from "../executiveAdvisory/executiveAdvisoryRuntime.ts";
import { resolveDecisionGuidanceSurface } from "../decisionGuidance/decisionGuidanceRuntime.ts";
import { resolveGovernanceIntelligenceSurface } from "../governanceIntelligence/governanceIntelligenceRuntime.ts";
import { resolveStrategicAlignmentSurface } from "../strategicAlignment/strategicAlignmentRuntime.ts";
import { resolvePolicyConstraintIntelligenceSurface } from "../policyConstraintIntelligence/policyConstraintIntelligenceRuntime.ts";
import { resolveStakeholderIntelligenceSurface } from "../stakeholderIntelligence/stakeholderIntelligenceRuntime.ts";
import { buildConsensusContext } from "./consensusContextGeneration.ts";
import { evaluateConsensus } from "./consensusEvaluation.ts";
import {
  CANONICAL_CONSENSUS_INTELLIGENCE_OWNER,
  CANONICAL_CONSENSUS_INTELLIGENCE_SURFACE_ID,
} from "./consensusIntelligenceContract.ts";
import type {
  ConsensusAttentionLevel,
  ConsensusConfidenceLevel,
  ConsensusIntelligenceAggregationInput,
  ConsensusIntelligenceSnapshot,
  ConsensusIntelligenceSurfaceModel,
  ConsensusLevel,
  ConvergenceLevel,
  DivergenceLevel,
  InstitutionalTensionLevel,
} from "./consensusIntelligenceContract.ts";
import type { ConsensusContext } from "./consensusContextContract.ts";
import {
  reportAlignmentZone,
  reportConsensusAttention,
  reportConsensusConfidence,
  reportConsensusIntelligence,
  reportConsensusIntelligenceSurface,
  reportConsensusLevel,
  reportConvergence,
  reportDisagreementZone,
  reportDivergence,
  reportInstitutionalTension,
} from "./consensusIntelligenceLogging.ts";

const LEVEL_LABEL: Readonly<Record<ConsensusLevel, string>> = Object.freeze({
  strong_consensus: "Strong Consensus",
  moderate_consensus: "Moderate Consensus",
  mixed_alignment: "Mixed Alignment",
  low_consensus: "Low Consensus",
});

const CONVERGENCE_LABEL: Readonly<Record<ConvergenceLevel, string>> = Object.freeze({
  growing_convergence: "Growing Convergence",
  stable_convergence: "Stable Convergence",
  weak_convergence: "Weak Convergence",
});

const DIVERGENCE_LABEL: Readonly<Record<DivergenceLevel, string>> = Object.freeze({
  emerging_divergence: "Emerging Divergence",
  increasing_divergence: "Increasing Divergence",
  critical_divergence: "Critical Divergence",
});

const TENSION_LABEL: Readonly<Record<InstitutionalTensionLevel, string>> = Object.freeze({
  low: "Low Tension",
  moderate: "Moderate Tension",
  high: "High Tension",
  critical: "Critical Tension",
});

const ATTENTION_LABEL: Readonly<Record<ConsensusAttentionLevel, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review",
  leadership_discussion_recommended: "Leadership Discussion Recommended",
  consensus_escalation: "Consensus Escalation",
});

function collectConsensusInputs(input: ConsensusIntelligenceAggregationInput): ConsensusContext {
  const advisory = resolveExecutiveAdvisorySurface(input);
  const decisionGuidance = resolveDecisionGuidanceSurface(input);
  const governance = resolveGovernanceIntelligenceSurface(input);
  const strategic = resolveStrategicAlignmentSurface(input);
  const policy = resolvePolicyConstraintIntelligenceSurface(input);
  const stakeholder = resolveStakeholderIntelligenceSurface(input);

  return buildConsensusContext({
    stakeholderSnapshot: stakeholder.snapshot,
    policySnapshot: policy.snapshot,
    strategicSnapshot: strategic.snapshot,
    governanceSnapshot: governance.snapshot,
    decisionGuidanceSnapshot: decisionGuidance.snapshot,
    confidenceEvaluation: advisory.confidenceEvaluation,
  });
}

export function aggregateConsensusIntelligence(
  input: ConsensusIntelligenceAggregationInput
): ConsensusIntelligenceSurfaceModel {
  const consensusContext = collectConsensusInputs(input);
  const evaluation = evaluateConsensus(consensusContext);

  const consensusLevel = Object.freeze({
    level: evaluation.level,
    label: LEVEL_LABEL[evaluation.level],
    trend: evaluation.levelTrend,
    summary: "Primary consensus indicator — institutional alignment awareness across stakeholders",
  });

  const alignmentZones = Object.freeze({
    zones: evaluation.alignmentZones,
    summary: "Areas of institutional agreement across executive, operational, and strategic zones",
  });

  const disagreementZones = Object.freeze({
    zones: evaluation.disagreementZones,
    summary: "Areas of institutional friction — priority, resource, timeline, and governance conflicts",
  });

  const convergence = Object.freeze({
    level: evaluation.convergence,
    label: CONVERGENCE_LABEL[evaluation.convergence],
    trend: evaluation.convergenceTrend,
    summary: "Movement toward agreement across stakeholder positions",
  });

  const divergence = Object.freeze({
    level: evaluation.divergence,
    label: DIVERGENCE_LABEL[evaluation.divergence],
    trend: evaluation.divergenceTrend,
    summary: "Movement away from agreement — emerging institutional disagreement",
  });

  const institutionalTension = Object.freeze({
    level: evaluation.institutionalTension,
    label: TENSION_LABEL[evaluation.institutionalTension],
    visibility:
      evaluation.institutionalTension === "critical" || evaluation.institutionalTension === "high"
        ? "Elevated visibility"
        : "Routine visibility",
    summary: "Organizational tension indicator — institutional friction awareness",
  });

  const consensusConfidence = Object.freeze({
    level: evaluation.confidence,
    label: consensusContext.confidenceLabel,
    metadata: `Inherited from Advisory Confidence Framework · ${consensusContext.confidenceLevel}`,
    summary: "Consensus conclusions inherit advisory confidence metadata",
  });

  const consensusAttention = Object.freeze({
    level: evaluation.attention,
    label: ATTENTION_LABEL[evaluation.attention],
    escalationIndicator:
      evaluation.attention === "consensus_escalation" ? "Escalation recommended" : "No escalation",
    discussionIndicator:
      evaluation.attention === "leadership_discussion_recommended" ||
      evaluation.attention === "consensus_escalation"
        ? "Leadership discussion recommended"
        : "Routine monitoring",
    summary: "Final consensus output — institutional alignment awareness",
  });

  const snapshot: ConsensusIntelligenceSnapshot = Object.freeze({
    consensusLevel,
    alignmentZones,
    disagreementZones,
    convergence,
    divergence,
    institutionalTension,
    consensusConfidence,
    consensusAttention,
  });

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_CONSENSUS_INTELLIGENCE_SURFACE_ID);

  const model: ConsensusIntelligenceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_CONSENSUS_INTELLIGENCE_SURFACE_ID,
    owner: CANONICAL_CONSENSUS_INTELLIGENCE_OWNER,
    headline: "Where is alignment emerging — and where is friction building?",
    consensusContext,
    snapshot,
    visualBundle,
  });

  reportConsensusIntelligence({
    dashboardContext: input.dashboardContext,
    version: "6.5.0",
    level: consensusLevel.level,
    owner: CANONICAL_CONSENSUS_INTELLIGENCE_OWNER,
  });
  reportConsensusLevel(snapshot.consensusLevel);
  reportAlignmentZone(snapshot.alignmentZones);
  reportDisagreementZone(snapshot.disagreementZones);
  reportConvergence(snapshot.convergence);
  reportDivergence(snapshot.divergence);
  reportInstitutionalTension(snapshot.institutionalTension);
  reportConsensusConfidence(snapshot.consensusConfidence);
  reportConsensusAttention(snapshot.consensusAttention);
  reportConsensusIntelligenceSurface(model);

  return model;
}
