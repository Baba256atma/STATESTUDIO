import type { UnifiedAdaptiveGovernanceRuntimeSnapshot } from "./unifiedAdaptiveGovernanceTypes";
import { UNIFIED_ADAPTIVE_GOVERNANCE_RUNTIME_SYNC_EVENT } from "./unifiedAdaptiveGovernanceTypes";

export function publishUnifiedAdaptiveGovernanceRuntimeSnapshot(
  snapshot: UnifiedAdaptiveGovernanceRuntimeSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(UNIFIED_ADAPTIVE_GOVERNANCE_RUNTIME_SYNC_EVENT, {
      detail: snapshot,
    })
  );
}
