import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestStrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceSelectors";
import { selectLatestTemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionSelectors";
import { selectLatestOrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplaySelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestEnterpriseEarlyWarningSnapshot } from "./earlyWarningSelectors";
import { selectLatestInterventionWindowSnapshot } from "./interventionTimingSelectors";
import { selectLatestPositiveTrajectorySnapshot } from "./positiveDriftSelectors";
import { selectLatestStressSimulationSnapshot } from "./stressSimulationSelectors";
import { evaluateEnterprisePreparednessAwareness } from "./preparednessCognitionEngine";
import type { ExecutivePreparednessCognitionResult } from "./preparednessCognitionTypes";

/**
 * D9:4:7 — Passive enterprise preparedness cognition integration.
 * Intervention Timing Intelligence → Preparedness Cognition → Executive Strategic Readiness Awareness
 */
export function integratePreparednessCognitionWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): ExecutivePreparednessCognitionResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateEnterprisePreparednessAwareness({
    organizationId,
    cognitionSnapshot: cognition,
    interventionSnapshot: selectLatestInterventionWindowSnapshot(organizationId),
    stressSnapshot: selectLatestStressSimulationSnapshot(organizationId),
    earlyWarningSnapshot: selectLatestEnterpriseEarlyWarningSnapshot(organizationId),
    positiveDriftSnapshot: selectLatestPositiveTrajectorySnapshot(organizationId),
    convergenceSnapshot: selectLatestStrategicAlignmentSnapshot(organizationId),
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
