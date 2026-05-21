import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { integrateActionDependencyWithCognition } from "./integrateActionDependencyWithCognition";
import { integrateAdaptiveSequencingWithCognition } from "./integrateAdaptiveSequencingWithCognition";
import { integrateDecisionConfidenceWithCognition } from "./integrateDecisionConfidenceWithCognition";
import { integrateDecisionOrchestrationWithCognition } from "./integrateDecisionOrchestrationWithCognition";
import { integrateInstitutionalAlignmentWithCognition } from "./integrateInstitutionalAlignmentWithCognition";
import { integrateInterventionProjectionWithCognition } from "./integrateInterventionProjectionWithCognition";
import { integratePriorityArbitrationWithCognition } from "./integratePriorityArbitrationWithCognition";
import { integrateScenarioCoordinationWithCognition } from "./integrateScenarioCoordinationWithCognition";
import { integrateStabilityOptimizationWithCognition } from "./integrateStabilityOptimizationWithCognition";
import type { EnterpriseDecisionOrchestrationPipelineResult } from "./unifiedDecisionRuntimeTypes";

/**
 * D9:5:1–D9:5:9 — Canonical enterprise strategic action orchestration pipeline.
 * Orchestrated deterministically; does not mutate operational state.
 */
export type { EnterpriseDecisionOrchestrationPipelineResult } from "./unifiedDecisionRuntimeTypes";

export function integrateEnterpriseDecisionOrchestrationWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): EnterpriseDecisionOrchestrationPipelineResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const base = {
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    pressureTopologyStressed: params.pressureTopologyStressed ?? false,
    now: params.now,
  };

  const decisionOrchestration = integrateDecisionOrchestrationWithCognition(base);
  const actionDependency = integrateActionDependencyWithCognition(base);
  const priorityArbitration = integratePriorityArbitrationWithCognition(base);
  const scenarioCoordination = integrateScenarioCoordinationWithCognition(base);
  const adaptiveSequencing = integrateAdaptiveSequencingWithCognition(base);
  const confidenceArbitration = integrateDecisionConfidenceWithCognition(base);
  const institutionalAlignment = integrateInstitutionalAlignmentWithCognition(base);
  const interventionProjection = integrateInterventionProjectionWithCognition(base);
  const stabilityOptimization = integrateStabilityOptimizationWithCognition(base);

  const pipelineSignature = [
    decisionOrchestration.storeSignature,
    actionDependency.storeSignature,
    priorityArbitration.storeSignature,
    scenarioCoordination.storeSignature,
    adaptiveSequencing.storeSignature,
    confidenceArbitration.storeSignature,
    institutionalAlignment.storeSignature,
    interventionProjection.storeSignature,
    stabilityOptimization.storeSignature,
  ].join("|");

  return {
    organizationId,
    pipelineSignature,
    decisionOrchestration,
    actionDependency,
    priorityArbitration,
    scenarioCoordination,
    adaptiveSequencing,
    confidenceArbitration,
    institutionalAlignment,
    interventionProjection,
    stabilityOptimization,
  };
}
