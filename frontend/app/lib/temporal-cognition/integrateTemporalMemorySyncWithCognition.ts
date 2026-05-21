import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { evaluateInstitutionalTemporalMemorySync } from "./temporalMemorySyncEngine";
import type { TemporalMemorySyncResult } from "./temporalMemorySyncTypes";
import { selectLatestTemporalCompressionSnapshot } from "./temporalCompressionSelectors";
import { selectLatestStrategicAlignmentSnapshot } from "./temporalConvergenceSelectors";
import { selectLatestMultiTimelineSnapshot } from "./multiTimelineSelectors";
import { selectLatestTemporalDriftSnapshot } from "./temporalDriftProjectionSelectors";
import { selectLatestEnterpriseTemporalSnapshot } from "./temporalCognitionSelectors";

/**
 * D9:3:8 — Passive institutional temporal memory synchronization integration.
 * Temporal Compression → Cross-Period Awareness → Institutional Memory Sync
 */
export function integrateTemporalMemorySyncWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): TemporalMemorySyncResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateInstitutionalTemporalMemorySync({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    temporalSnapshot: selectLatestEnterpriseTemporalSnapshot(organizationId),
    driftSnapshot: selectLatestTemporalDriftSnapshot(organizationId),
    multiTimelineSnapshot: selectLatestMultiTimelineSnapshot(organizationId),
    convergenceSnapshot: selectLatestStrategicAlignmentSnapshot(organizationId),
    compressionSnapshot: selectLatestTemporalCompressionSnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
