import type { ExecutiveAttentionRuntimeState } from "./enterpriseCognitiveRuntimeTypes";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

/**
 * F10:6 — Executive cognitive synchronization (executive remains final authority).
 */
export class ExecutiveCognitionSynchronizationLayer {
  inferExecutiveAttention(
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    fragilityElevated: boolean
  ): ExecutiveAttentionRuntimeState {
    if (fragilityElevated || stack.pressurePosture === "attention") {
      return "escalation_aware";
    }
    if (
      stack.enterpriseMetaIntelligenceActive ||
      stack.executiveMetaCognitionActive
    ) {
      return "synchronized";
    }
    return "distributed";
  }

  synthesizeExecutiveCognitionSyncLine(state: ExecutiveAttentionRuntimeState): string {
    if (state === "synchronized") {
      return "Executive cognition synchronized — strategic awareness sustained without overriding judgment";
    }
    if (state === "escalation_aware") {
      return "Executive cognition escalation-aware — resilience and stabilization framing prioritized";
    }
    return "Executive cognition distributed — calm orchestration across intelligence layers";
  }
}

export const executiveCognitionSynchronizationLayer = new ExecutiveCognitionSynchronizationLayer();
