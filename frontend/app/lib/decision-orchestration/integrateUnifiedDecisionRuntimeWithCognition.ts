import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { evaluateUnifiedExecutiveDecisionRuntime } from "./unifiedDecisionRuntimeEngine";
import type { UnifiedExecutiveDecisionRuntimeResult } from "./unifiedDecisionRuntimeTypes";

/**
 * D9:5:10 — Passive unified executive decision orchestration runtime integration.
 * Consolidates D9:5:1–D9:5:9 into a single enterprise strategic action intelligence runtime pass.
 */
export function integrateUnifiedDecisionRuntimeWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): UnifiedExecutiveDecisionRuntimeResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateUnifiedExecutiveDecisionRuntime({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    pressureTopologyStressed: params.pressureTopologyStressed ?? false,
    now: params.now,
  });
}
