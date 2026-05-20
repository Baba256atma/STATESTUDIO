import type { AdaptiveGovernanceIntelligenceSnapshot } from "./adaptiveGovernanceTypes";
import { ADAPTIVE_GOVERNANCE_INTELLIGENCE_SYNC_EVENT } from "./adaptiveGovernanceTypes";

export function publishAdaptiveGovernanceIntelligenceSnapshot(
  snapshot: AdaptiveGovernanceIntelligenceSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(ADAPTIVE_GOVERNANCE_INTELLIGENCE_SYNC_EVENT, { detail: snapshot })
  );
}
