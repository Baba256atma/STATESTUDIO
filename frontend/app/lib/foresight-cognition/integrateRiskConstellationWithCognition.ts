import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestStrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceSelectors";
import { selectLatestTemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestEnterpriseForesightSnapshot } from "./foresightCognitionSelectors";
import { evaluateWeakSignalCorrelation } from "./riskConstellationEngine";
import type { WeakSignalCorrelationResult } from "./riskConstellationTypes";

/**
 * D9:4:2 — Passive weak signal correlation + risk constellation integration.
 * Executive Strategic Foresight → Weak Signal Correlation → Risk Constellation Awareness
 */
export function integrateRiskConstellationWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): WeakSignalCorrelationResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateWeakSignalCorrelation({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    foresightSnapshot: selectLatestEnterpriseForesightSnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    driftSnapshot: selectLatestTemporalDriftSnapshot(organizationId),
    convergenceSnapshot: selectLatestStrategicAlignmentSnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    pressureTopologyStressed: params.pressureTopologyStressed ?? false,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
