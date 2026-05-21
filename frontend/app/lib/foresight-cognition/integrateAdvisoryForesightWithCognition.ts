import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestStrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceSelectors";
import { selectLatestTemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestEnterpriseEarlyWarningSnapshot } from "./earlyWarningSelectors";
import { selectLatestInterventionWindowSnapshot } from "./interventionTimingSelectors";
import { selectLatestEnterprisePreparednessSnapshot } from "./preparednessCognitionSelectors";
import { selectLatestPositiveTrajectorySnapshot } from "./positiveDriftSelectors";
import { selectLatestRiskConstellationSnapshot } from "./riskConstellationSelectors";
import { selectLatestStressSimulationSnapshot } from "./stressSimulationSelectors";
import { selectLatestEnterpriseForesightSnapshot } from "./foresightCognitionSelectors";
import { evaluateStrategicExecutiveAdvisory } from "./advisoryForesightEngine";
import type { ExecutiveAdvisoryForesightResult } from "./advisoryForesightTypes";

/**
 * D9:4:8 — Passive strategic executive advisory foresight integration.
 * Preparedness Cognition → Advisory Recommendation Synthesis → Executive Strategic Guidance Awareness
 */
export function integrateAdvisoryForesightWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): ExecutiveAdvisoryForesightResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateStrategicExecutiveAdvisory({
    organizationId,
    cognitionSnapshot: cognition,
    preparednessSnapshot: selectLatestEnterprisePreparednessSnapshot(organizationId),
    interventionSnapshot: selectLatestInterventionWindowSnapshot(organizationId),
    stressSnapshot: selectLatestStressSimulationSnapshot(organizationId),
    earlyWarningSnapshot: selectLatestEnterpriseEarlyWarningSnapshot(organizationId),
    positiveDriftSnapshot: selectLatestPositiveTrajectorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseForesightSnapshot(organizationId),
    constellationSnapshot: selectLatestRiskConstellationSnapshot(organizationId),
    convergenceSnapshot: selectLatestStrategicAlignmentSnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    driftSnapshot: selectLatestTemporalDriftSnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
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
