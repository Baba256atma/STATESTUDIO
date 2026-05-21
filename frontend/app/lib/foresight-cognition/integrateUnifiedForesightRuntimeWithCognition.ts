import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { evaluateUnifiedExecutiveForesightRuntime } from "./unifiedForesightRuntimeEngine";
import type { UnifiedExecutiveForesightRuntimeResult } from "./unifiedForesightRuntimeTypes";

/**
 * D9:4:10 — Passive unified executive strategic foresight runtime integration.
 * Consolidates D9:4:1–D9:4:9 into a single anticipatory intelligence runtime pass.
 */
export function integrateUnifiedForesightRuntimeWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): UnifiedExecutiveForesightRuntimeResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateUnifiedExecutiveForesightRuntime({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    pressureTopologyStressed: params.pressureTopologyStressed ?? false,
    now: params.now,
  });
}
