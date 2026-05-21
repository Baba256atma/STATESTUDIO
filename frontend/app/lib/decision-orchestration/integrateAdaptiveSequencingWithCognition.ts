import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestEnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionSelectors";
import { selectLatestInterventionWindowSnapshot } from "../foresight-cognition/interventionTimingSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestOrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplaySelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestDependencyAwarenessSnapshot } from "./actionDependencySelectors";
import { selectLatestDecisionCoordinationSnapshot } from "./decisionOrchestrationSelectors";
import { selectLatestMultiObjectiveDecisionSnapshot } from "./priorityArbitrationSelectors";
import { selectLatestScenarioCoordinationSnapshot } from "./scenarioCoordinationSelectors";
import { evaluateAdaptiveDecisionSequencing } from "./adaptiveSequencingEngine";
import type { AdaptiveDecisionSequencingResult } from "./adaptiveSequencingTypes";

/**
 * D9:5:5 — Passive executive adaptive decision sequencing integration.
 * Scenario Coordination → Adaptive Sequencing → Dynamic Response Evolution Awareness
 */
export function integrateAdaptiveSequencingWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): AdaptiveDecisionSequencingResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateAdaptiveDecisionSequencing({
    organizationId,
    cognitionSnapshot: cognition,
    coordinationSnapshot: selectLatestDecisionCoordinationSnapshot(organizationId),
    dependencySnapshot: selectLatestDependencyAwarenessSnapshot(organizationId),
    arbitrationSnapshot: selectLatestMultiObjectiveDecisionSnapshot(organizationId),
    scenarioSnapshot: selectLatestScenarioCoordinationSnapshot(organizationId),
    anticipatorySnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    preparednessSnapshot: selectLatestEnterprisePreparednessSnapshot(organizationId),
    interventionSnapshot: selectLatestInterventionWindowSnapshot(organizationId),
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
