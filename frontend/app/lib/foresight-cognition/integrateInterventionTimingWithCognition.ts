import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestTemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionSelectors";
import { selectLatestOrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplaySelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestEnterpriseEarlyWarningSnapshot } from "./earlyWarningSelectors";
import { selectLatestEnterpriseForesightSnapshot } from "./foresightCognitionSelectors";
import { selectLatestPositiveTrajectorySnapshot } from "./positiveDriftSelectors";
import { selectLatestRiskConstellationSnapshot } from "./riskConstellationSelectors";
import { selectLatestStressSimulationSnapshot } from "./stressSimulationSelectors";
import { evaluateStrategicInterventionTiming } from "./interventionTimingEngine";
import type { ExecutiveInterventionTimingResult } from "./interventionTimingTypes";

/**
 * D9:4:6 — Passive strategic intervention timing integration.
 * Stress Simulation Awareness → Intervention Timing Intelligence → Executive Strategic Timing Awareness
 */
export function integrateInterventionTimingWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): ExecutiveInterventionTimingResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateStrategicInterventionTiming({
    organizationId,
    cognitionSnapshot: cognition,
    foresightSnapshot: selectLatestEnterpriseForesightSnapshot(organizationId),
    constellationSnapshot: selectLatestRiskConstellationSnapshot(organizationId),
    earlyWarningSnapshot: selectLatestEnterpriseEarlyWarningSnapshot(organizationId),
    positiveDriftSnapshot: selectLatestPositiveTrajectorySnapshot(organizationId),
    stressSnapshot: selectLatestStressSimulationSnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    driftSnapshot: selectLatestTemporalDriftSnapshot(organizationId),
    replaySnapshot: selectLatestOrganizationalReplaySnapshot(organizationId),
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
