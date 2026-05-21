import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { evaluateOperationalCausalDependencies } from "./causalDependencyEngine";
import type { OperationalCausalDependencyResult } from "./causalDependencyTypes";
import { selectLatestEnterpriseTemporalSnapshot } from "./temporalCognitionSelectors";

/**
 * D9:3:2 — Passive causal dependency integration.
 * Enterprise Cognition → Institutional Memory → Temporal Sequencing → Causal Dependency Awareness
 */
export function integrateCausalDependencyWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): OperationalCausalDependencyResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateOperationalCausalDependencies({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    temporalSnapshot: selectLatestEnterpriseTemporalSnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
