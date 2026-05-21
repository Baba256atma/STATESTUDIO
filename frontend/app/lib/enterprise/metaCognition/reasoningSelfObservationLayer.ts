import type { ReasoningPath, UncertaintyLevel } from "./executiveMetaCognitionTypes";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../governance/adaptiveGovernanceTypes";

/**
 * F10:1 — Reasoning self-observation (not consciousness claims).
 */
export class ReasoningSelfObservationLayer {
  synthesizeReasoningPathLine(reasoningPath: ReasoningPath, governanceContext: string): string {
    return `Reasoning path ${reasoningPath} · ${governanceContext}`;
  }

  inferReasoningPath(stack: AdaptiveGovernanceIntelligenceSnapshot): ReasoningPath {
    if (stack.unifiedGovernanceRuntimeActive) return "reflecting";
    if (stack.governanceOversightActive && stack.strategicCalibrationActive) return "governing";
    if (stack.enterpriseCoherenceActive || stack.strategicCalibrationActive) return "advising";
    if (stack.governanceOversightActive) return "interpreting";
    return "observing";
  }

  inferUncertaintyLevel(
    fragilityElevated: boolean,
    continuityPreserved: boolean,
    stack: AdaptiveGovernanceIntelligenceSnapshot
  ): UncertaintyLevel {
    if (!continuityPreserved || fragilityElevated) return "high";
    if (stack.pressurePosture === "monitoring" || stack.pressurePosture === "attention") {
      return "elevated";
    }
    if (stack.unifiedGovernanceRuntimeActive) return "low";
    return "moderate";
  }

  collectSupportingSignals(stack: AdaptiveGovernanceIntelligenceSnapshot): string[] {
    const signals: string[] = [];
    if (stack.governanceOversightActive) signals.push("governance oversight");
    if (stack.enterpriseCoherenceActive) signals.push("strategic coherence");
    if (stack.strategicCalibrationActive) signals.push("strategic calibration");
    if (stack.executiveStabilityActive) signals.push("executive stability");
    if (stack.organizationalEvolutionActive) signals.push("organizational evolution");
    if (stack.unifiedGovernanceRuntimeActive) signals.push("unified governance runtime");
    return signals.length > 0 ? signals : ["institutional stack establishing"];
  }
}

export const reasoningSelfObservationLayer = new ReasoningSelfObservationLayer();
