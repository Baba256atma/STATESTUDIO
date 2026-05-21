import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectOrganizationalContinuitySnapshot } from "../institutional-memory/institutionalContinuitySelectors";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { evaluateStrategicTimeFieldIntelligence } from "./temporalFieldEngine";
import type { StrategicTimeFieldResult } from "./temporalFieldTypes";
import { selectLatestInstitutionalTemporalSyncSnapshot } from "./temporalMemorySyncSelectors";
import { selectLatestTemporalCompressionSnapshot } from "./temporalCompressionSelectors";
import { selectLatestStrategicAlignmentSnapshot } from "./temporalConvergenceSelectors";
import { selectLatestOrganizationalReplaySnapshot } from "./operationalReplaySelectors";

/**
 * D9:3:9 — Passive long-horizon time-field integration.
 * Cross-Period Synchronization → Long-Horizon Awareness → Enterprise Time-Field Intelligence
 */
export function integrateTemporalFieldWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): StrategicTimeFieldResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateStrategicTimeFieldIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    syncSnapshot: selectLatestInstitutionalTemporalSyncSnapshot(organizationId),
    compressionSnapshot: selectLatestTemporalCompressionSnapshot(organizationId),
    replaySnapshot: selectLatestOrganizationalReplaySnapshot(organizationId),
    convergenceSnapshot: selectLatestStrategicAlignmentSnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    continuitySnapshot: selectOrganizationalContinuitySnapshot(organizationId),
    enterpriseNarrativeLine:
      cognition?.timelineStrategicEvolutionLine ??
      cognition?.organizationalLearningLine ??
      cognition?.timelineInstitutionalContinuityLine ??
      "",
    resilienceForecastLine: cognition?.resilienceForecastLine ?? "",
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
