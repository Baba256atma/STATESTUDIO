import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestMultiTimelineSnapshot } from "./multiTimelineSelectors";
import { evaluateTemporalConvergenceIntelligence } from "./temporalConvergenceEngine";
import type { TemporalConvergenceResult } from "./temporalConvergenceTypes";
import { selectLatestOrganizationalReplaySnapshot } from "./operationalReplaySelectors";
import { selectLatestTemporalDriftSnapshot } from "./temporalDriftProjectionSelectors";
import { selectLatestEnterpriseTemporalSnapshot } from "./temporalCognitionSelectors";

/**
 * D9:3:6 — Passive temporal convergence integration.
 * Multi-Timeline Divergence → Convergence Intelligence → Enterprise Stability Alignment Awareness
 */
export function integrateTemporalConvergenceWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): TemporalConvergenceResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateTemporalConvergenceIntelligence({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    temporalSnapshot: selectLatestEnterpriseTemporalSnapshot(organizationId),
    driftSnapshot: selectLatestTemporalDriftSnapshot(organizationId),
    replaySnapshot: selectLatestOrganizationalReplaySnapshot(organizationId),
    multiTimelineSnapshot: selectLatestMultiTimelineSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
