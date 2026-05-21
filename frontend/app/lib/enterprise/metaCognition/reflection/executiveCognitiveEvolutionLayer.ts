import type {
  CoordinationEvolution,
  GovernanceMaturity,
  ReasoningEvolution,
  ResilienceProgression,
  StrategicBehaviorPattern,
} from "./institutionalStrategicReflectionTypes";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

/**
 * F10:3 — Executive cognitive evolution awareness (not autonomous self-modification).
 */
export class ExecutiveCognitiveEvolutionLayer {
  synthesizeStrategicMaturityLine(
    governanceMaturity: GovernanceMaturity,
    reasoningEvolution: ReasoningEvolution
  ): string {
    return `Governance maturity ${governanceMaturity} · reasoning evolution ${reasoningEvolution}`;
  }

  synthesizeResilienceEvolutionLine(resilienceProgression: ResilienceProgression): string {
    if (resilienceProgression === "mature") {
      return "Resilience progression mature — fragility reduction and coordination stabilization observed";
    }
    if (resilienceProgression === "fragile") {
      return "Resilience progression fragile — institutional learning should reinforce continuity before acceleration";
    }
    return `Resilience progression ${resilienceProgression}`;
  }

  inferReasoningEvolution(stack: AdaptiveGovernanceIntelligenceSnapshot): ReasoningEvolution {
    if (stack.executiveMetaCognitionActive && stack.unifiedGovernanceRuntimeActive) {
      return "sustained";
    }
    if (stack.metaCognitionPosture === "reflecting" || stack.metaCognitionPosture === "transparent") {
      return "maturing";
    }
    if (stack.governanceOversightActive) return "forming";
    return "nascent";
  }

  inferStrategicBehaviorPattern(stack: AdaptiveGovernanceIntelligenceSnapshot): StrategicBehaviorPattern {
    if (stack.unifiedGovernanceRuntimeActive && stack.executiveStabilityActive) return "coordinated";
    if (stack.strategicCalibrationActive) return "disciplined";
    if (stack.organizationalEvolutionActive) return "adaptive";
    return "reactive";
  }

  inferGovernanceMaturity(stack: AdaptiveGovernanceIntelligenceSnapshot): GovernanceMaturity {
    if (stack.unifiedGovernanceRuntimeActive && stack.governanceOversightActive) return "mature";
    if (stack.enterpriseCoherenceActive || stack.strategicCalibrationActive) return "developing";
    if (stack.pressurePosture === "attention") return "strained";
    return "nascent";
  }

  inferResilienceProgression(
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    fragilityElevated: boolean
  ): ResilienceProgression {
    if (fragilityElevated) return "fragile";
    if (stack.executiveStabilityActive && stack.pressurePosture === "resilient") return "mature";
    if (stack.executiveStabilityActive) return "sustained";
    return "strengthening";
  }

  inferCoordinationEvolution(
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    cognitionConverged: boolean
  ): CoordinationEvolution {
    if (cognitionConverged && stack.enterpriseCoherenceActive) return "institutional";
    if (stack.enterpriseCoherenceActive) return "coordinated";
    if (stack.strategicAlignmentIntegrityActive) return "aligning";
    return "fragmented";
  }
}

export const executiveCognitiveEvolutionLayer = new ExecutiveCognitiveEvolutionLayer();
