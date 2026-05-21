import type { AdaptationRuntimeState } from "./enterpriseCognitiveRuntimeTypes";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

/**
 * F10:6 — Institutional adaptation continuity (evolution awareness, not self-mutation).
 */
export class InstitutionalAdaptationContinuityLayer {
  inferAdaptationState(stack: AdaptiveGovernanceIntelligenceSnapshot): AdaptationRuntimeState {
    if (stack.organizationalEvolutionActive && stack.cognitiveEvolutionActive) {
      return "sustained";
    }
    if (stack.organizationalEvolutionActive || stack.adaptationGovernanceActive) {
      return "evolving";
    }
    return "nascent";
  }

  synthesizeAdaptationContinuityLine(state: AdaptationRuntimeState): string {
    if (state === "sustained") {
      return "Adaptation continuity sustained — governance maturity and organizational evolution aligned";
    }
    if (state === "evolving") {
      return "Adaptation continuity evolving — institutional maturity progression visible";
    }
    return "Adaptation continuity nascent — enterprise evolution awareness establishing";
  }
}

export const institutionalAdaptationContinuityLayer = new InstitutionalAdaptationContinuityLayer();
