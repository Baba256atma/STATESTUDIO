import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalRecallSnapshot } from "../institutional-memory/institutionalRecallSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { evaluateEnterpriseTemporalCognition } from "./temporalCognitionEngine";
import type { EnterpriseTemporalCognitionResult } from "./temporalCognitionTypes";

/**
 * D9:3:1 — Passive temporal cognition integration.
 * Enterprise Cognition → Institutional Memory → Historical Recall → Timeline Sequencing → Temporal Awareness
 */
export function integrateTemporalCognitionWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): EnterpriseTemporalCognitionResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateEnterpriseTemporalCognition({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    recallSnapshot: selectInstitutionalRecallSnapshot(organizationId),
    unifiedMemorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
