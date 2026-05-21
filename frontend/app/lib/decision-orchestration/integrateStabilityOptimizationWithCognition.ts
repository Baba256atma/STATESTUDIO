import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestEnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestOrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplaySelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestDependencyAwarenessSnapshot } from "./actionDependencySelectors";
import { selectLatestDecisionCoordinationSnapshot } from "./decisionOrchestrationSelectors";
import { selectLatestMultiObjectiveDecisionSnapshot } from "./priorityArbitrationSelectors";
import { selectLatestScenarioCoordinationSnapshot } from "./scenarioCoordinationSelectors";
import { selectLatestAdaptiveSequencingSnapshot } from "./adaptiveSequencingSelectors";
import { selectLatestConfidenceArbitrationSnapshot } from "./decisionConfidenceSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "./institutionalAlignmentSelectors";
import { selectLatestOutcomeProjectionSnapshot } from "./interventionProjectionSelectors";
import { evaluateStrategicStabilityOptimization } from "./stabilityOptimizationEngine";
import type { StrategicStabilityOptimizationResult } from "./stabilityOptimizationTypes";

/**
 * D9:5:9 — Passive executive strategic stability optimization integration.
 * Intervention Projection → Stability Optimization → Resilience-Oriented Orchestration Awareness
 */
export function integrateStabilityOptimizationWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): StrategicStabilityOptimizationResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateStrategicStabilityOptimization({
    organizationId,
    cognitionSnapshot: cognition,
    coordinationSnapshot: selectLatestDecisionCoordinationSnapshot(organizationId),
    dependencySnapshot: selectLatestDependencyAwarenessSnapshot(organizationId),
    arbitrationSnapshot: selectLatestMultiObjectiveDecisionSnapshot(organizationId),
    scenarioSnapshot: selectLatestScenarioCoordinationSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    alignmentSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    projectionSnapshot: selectLatestOutcomeProjectionSnapshot(organizationId),
    anticipatorySnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    preparednessSnapshot: selectLatestEnterprisePreparednessSnapshot(organizationId),
    replaySnapshot: selectLatestOrganizationalReplaySnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    enterpriseNarrativeLine:
      cognition?.timelineStrategicEvolutionLine ??
      cognition?.organizationalLearningLine ??
      "",
    resilienceForecastLine: cognition?.resilienceForecastLine ?? "",
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    pressureTopologyStressed: params.pressureTopologyStressed ?? false,
    now: params.now,
  });
}
