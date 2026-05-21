import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestEnterpriseRecommendationSnapshot } from "./advisoryForesightSelectors";
import { selectLatestEnterpriseEarlyWarningSnapshot } from "./earlyWarningSelectors";
import { selectLatestInterventionWindowSnapshot } from "./interventionTimingSelectors";
import { selectLatestEnterprisePreparednessSnapshot } from "./preparednessCognitionSelectors";
import { selectLatestPositiveTrajectorySnapshot } from "./positiveDriftSelectors";
import { selectLatestRiskConstellationSnapshot } from "./riskConstellationSelectors";
import { selectLatestStressSimulationSnapshot } from "./stressSimulationSelectors";
import { evaluateStrategicConsensusForesight } from "./consensusForesightEngine";
import type { ExecutiveConsensusForesightResult } from "./consensusForesightTypes";

/**
 * D9:4:9 — Passive enterprise strategic consensus foresight integration.
 * Advisory Synthesis → Multi-Perspective Consensus Awareness → Executive Alignment Intelligence
 */
export function integrateConsensusForesightWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): ExecutiveConsensusForesightResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateStrategicConsensusForesight({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    advisorySnapshot: selectLatestEnterpriseRecommendationSnapshot(organizationId),
    preparednessSnapshot: selectLatestEnterprisePreparednessSnapshot(organizationId),
    interventionSnapshot: selectLatestInterventionWindowSnapshot(organizationId),
    stressSnapshot: selectLatestStressSimulationSnapshot(organizationId),
    earlyWarningSnapshot: selectLatestEnterpriseEarlyWarningSnapshot(organizationId),
    positiveDriftSnapshot: selectLatestPositiveTrajectorySnapshot(organizationId),
    constellationSnapshot: selectLatestRiskConstellationSnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    now: params.now,
  });
}
