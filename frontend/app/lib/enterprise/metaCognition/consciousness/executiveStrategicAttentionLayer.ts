import type { ExecutiveAttentionState } from "./unifiedStrategicConsciousnessTypes";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

/**
 * F10:5 — Executive strategic attention orchestration (guidance, not autonomous control).
 */
export class ExecutiveStrategicAttentionLayer {
  inferExecutiveAttentionState(
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    fragilityElevated: boolean
  ): ExecutiveAttentionState {
    if (fragilityElevated || stack.pressurePosture === "attention") {
      return "escalation_aware";
    }
    if (
      stack.futureStateIntelligenceActive ||
      stack.cognitiveEvolutionActive
    ) {
      return "focused";
    }
    return "distributed";
  }

  synthesizeExecutiveAttentionLine(state: ExecutiveAttentionState): string {
    if (state === "escalation_aware") {
      return "Executive attention: escalation-aware framing — resilience and stabilization prioritized";
    }
    if (state === "focused") {
      return "Executive attention: institutional focus continuity across foresight and evolution layers";
    }
    return "Executive attention: distributed strategic awareness — calm orchestration without noise";
  }
}

export const executiveStrategicAttentionLayer = new ExecutiveStrategicAttentionLayer();
