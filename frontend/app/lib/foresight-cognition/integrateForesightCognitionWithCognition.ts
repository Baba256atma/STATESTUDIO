import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestMultiTimelineSnapshot } from "../temporal-cognition/multiTimelineSelectors";
import { selectLatestStrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceSelectors";
import { selectLatestTemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { evaluateExecutiveStrategicForesight } from "./foresightCognitionEngine";
import type { ExecutiveStrategicForesightResult } from "./foresightCognitionTypes";

/**
 * D9:4:1 — Passive anticipatory foresight integration.
 * Unified Temporal Cognition → Weak Signal Detection → Executive Strategic Foresight
 */
export function integrateForesightCognitionWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): ExecutiveStrategicForesightResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateExecutiveStrategicForesight({
    organizationId,
    cognitionSnapshot: cognition,
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    driftSnapshot: selectLatestTemporalDriftSnapshot(organizationId),
    divergenceSnapshot: selectLatestMultiTimelineSnapshot(organizationId),
    convergenceSnapshot: selectLatestStrategicAlignmentSnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    enterpriseNarrativeLine:
      cognition?.timelineStrategicEvolutionLine ??
      cognition?.organizationalLearningLine ??
      cognition?.uncertaintyFactorsLine ??
      "",
    resilienceForecastLine: cognition?.resilienceForecastLine ?? "",
    pressureTopologyStressed: params.pressureTopologyStressed ?? false,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
