import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestMultiTimelineSnapshot } from "./multiTimelineSelectors";
import { selectLatestStrategicAlignmentSnapshot } from "./temporalConvergenceSelectors";
import { evaluateStrategicTemporalCompression } from "./temporalCompressionEngine";
import type { StrategicTemporalCompressionResult } from "./temporalCompressionTypes";
import { selectLatestOrganizationalReplaySnapshot } from "./operationalReplaySelectors";
import { selectLatestTemporalDriftSnapshot } from "./temporalDriftProjectionSelectors";
import { selectLatestEnterpriseTemporalSnapshot } from "./temporalCognitionSelectors";

/**
 * D9:3:7 — Passive temporal compression integration.
 * Convergence Intelligence → Temporal Compression → Executive Evolution Summarization
 */
export function integrateTemporalCompressionWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): StrategicTemporalCompressionResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateStrategicTemporalCompression({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    temporalSnapshot: selectLatestEnterpriseTemporalSnapshot(organizationId),
    driftSnapshot: selectLatestTemporalDriftSnapshot(organizationId),
    replaySnapshot: selectLatestOrganizationalReplaySnapshot(organizationId),
    multiTimelineSnapshot: selectLatestMultiTimelineSnapshot(organizationId),
    convergenceSnapshot: selectLatestStrategicAlignmentSnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
