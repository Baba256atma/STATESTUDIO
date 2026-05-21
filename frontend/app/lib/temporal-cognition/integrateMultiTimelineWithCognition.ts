import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestCausalDependencySnapshot } from "./causalDependencySelectors";
import { evaluateMultiTimelineDivergence } from "./multiTimelineEngine";
import type { MultiTimelineDivergenceResult } from "./multiTimelineTypes";
import { selectLatestOrganizationalReplaySnapshot } from "./operationalReplaySelectors";
import { selectLatestTemporalDriftSnapshot } from "./temporalDriftProjectionSelectors";
import { selectLatestEnterpriseTemporalSnapshot } from "./temporalCognitionSelectors";

/**
 * D9:3:5 — Passive multi-timeline divergence integration.
 * Drift Projection → Multi-Timeline Divergence → Alternative Evolution Path Cognition
 */
export function integrateMultiTimelineWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): MultiTimelineDivergenceResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateMultiTimelineDivergence({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    temporalSnapshot: selectLatestEnterpriseTemporalSnapshot(organizationId),
    causalSnapshot: selectLatestCausalDependencySnapshot(organizationId),
    replaySnapshot: selectLatestOrganizationalReplaySnapshot(organizationId),
    driftSnapshot: selectLatestTemporalDriftSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
