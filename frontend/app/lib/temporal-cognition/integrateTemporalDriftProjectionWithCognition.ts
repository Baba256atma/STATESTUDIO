import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestCausalDependencySnapshot } from "./causalDependencySelectors";
import { selectLatestOrganizationalReplaySnapshot } from "./operationalReplaySelectors";
import { evaluateTemporalDriftProjection } from "./temporalDriftProjectionEngine";
import type { TemporalDriftProjectionResult } from "./temporalDriftProjectionTypes";
import { selectLatestEnterpriseTemporalSnapshot } from "./temporalCognitionSelectors";

/**
 * D9:3:4 — Passive temporal drift projection integration.
 * Operational Replay → Temporal Drift Projection → Enterprise Future Trajectory Awareness
 */
export function integrateTemporalDriftProjectionWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): TemporalDriftProjectionResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateTemporalDriftProjection({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    temporalSnapshot: selectLatestEnterpriseTemporalSnapshot(organizationId),
    causalSnapshot: selectLatestCausalDependencySnapshot(organizationId),
    replaySnapshot: selectLatestOrganizationalReplaySnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
