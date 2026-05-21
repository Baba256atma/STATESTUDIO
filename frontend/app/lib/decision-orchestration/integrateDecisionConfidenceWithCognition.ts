import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestStrategicConsensusSnapshot } from "../foresight-cognition/consensusForesightSelectors";
import { selectLatestEnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionSelectors";
import { selectLatestInterventionWindowSnapshot } from "../foresight-cognition/interventionTimingSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestDependencyAwarenessSnapshot } from "./actionDependencySelectors";
import { selectLatestDecisionCoordinationSnapshot } from "./decisionOrchestrationSelectors";
import { selectLatestMultiObjectiveDecisionSnapshot } from "./priorityArbitrationSelectors";
import { selectLatestScenarioCoordinationSnapshot } from "./scenarioCoordinationSelectors";
import { selectLatestAdaptiveSequencingSnapshot } from "./adaptiveSequencingSelectors";
import { evaluateExecutiveDecisionConfidence } from "./decisionConfidenceEngine";
import type { ExecutiveDecisionConfidenceResult } from "./decisionConfidenceTypes";

/**
 * D9:5:6 — Passive executive decision confidence arbitration integration.
 * Adaptive Sequencing → Confidence Arbitration → Executive Strategic Certainty Awareness
 */
export function integrateDecisionConfidenceWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): ExecutiveDecisionConfidenceResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateExecutiveDecisionConfidence({
    organizationId,
    cognitionSnapshot: cognition,
    coordinationSnapshot: selectLatestDecisionCoordinationSnapshot(organizationId),
    dependencySnapshot: selectLatestDependencyAwarenessSnapshot(organizationId),
    arbitrationSnapshot: selectLatestMultiObjectiveDecisionSnapshot(organizationId),
    scenarioSnapshot: selectLatestScenarioCoordinationSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    anticipatorySnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    consensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    preparednessSnapshot: selectLatestEnterprisePreparednessSnapshot(organizationId),
    interventionSnapshot: selectLatestInterventionWindowSnapshot(organizationId),
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
