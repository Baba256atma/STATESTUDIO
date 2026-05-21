import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalRecallSnapshot } from "../institutional-memory/institutionalRecallSelectors";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectLatestCausalDependencySnapshot } from "./causalDependencySelectors";
import { evaluateOperationalReplayCognition } from "./operationalReplayEngine";
import type { OperationalReplayCognitionResult } from "./operationalReplayTypes";
import { selectLatestEnterpriseTemporalSnapshot } from "./temporalCognitionSelectors";

/**
 * D9:3:3 — Passive operational replay integration.
 * Temporal Sequencing → Causal Dependency → Operational Replay Reconstruction → Historical Awareness
 */
export function integrateOperationalReplayWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): OperationalReplayCognitionResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateOperationalReplayCognition({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    temporalSnapshot: selectLatestEnterpriseTemporalSnapshot(organizationId),
    causalSnapshot: selectLatestCausalDependencySnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    recallSnapshot: selectInstitutionalRecallSnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
