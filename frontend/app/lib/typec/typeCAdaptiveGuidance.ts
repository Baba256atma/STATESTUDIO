import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCExecutionState } from "./typeCExecutionState.ts";
import {
  deriveTypeCLearningSignals,
  type TypeCLearningSignals,
  type TypeCMemoryState,
} from "./typeCMemory.ts";

export type TypeCAdaptiveGuidance = {
  message: string;
  contextFactors: string[];
  recommendedAdjustment: string;
  confidence: number;
};

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0.4;
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

function isActiveExecution(execution: TypeCExecutionState | null): boolean {
  return execution?.status === "running" || execution?.status === "paused";
}

function hasInputs(input: {
  decision: TypeCDecisionRecommendation | null;
  execution: TypeCExecutionState | null;
  learning: TypeCLearningSignals;
}): boolean {
  return Boolean(
    input.decision ||
      isActiveExecution(input.execution) ||
      input.learning.repeatedRisks.length ||
      input.learning.stablePatterns.length ||
      input.learning.unstablePatterns.length
  );
}

function confidenceFromFactors(input: {
  decision: TypeCDecisionRecommendation | null;
  factors: string[];
  stable: boolean;
  unstable: boolean;
  highRisk: boolean;
}): number {
  let confidence = input.decision?.confidence ?? 0.48;
  confidence += input.factors.length * 0.04;
  if (input.stable) confidence += 0.08;
  if (input.unstable) confidence += 0.06;
  if (input.highRisk) confidence += 0.05;
  return clampConfidence(confidence);
}

export function buildTypeCAdaptiveGuidance(input: {
  decision: TypeCDecisionRecommendation | null;
  execution: TypeCExecutionState | null;
  memory: TypeCMemoryState;
}): TypeCAdaptiveGuidance | null {
  try {
    const learning = deriveTypeCLearningSignals(input.memory);
    if (!hasInputs({ decision: input.decision, execution: input.execution, learning })) return null;

    const contextFactors: string[] = [];
    const highRiskExecution = isActiveExecution(input.execution) && input.execution?.riskLevel === "high";
    const unstableMemory = learning.unstablePatterns.length > 0;
    const stableMemory = learning.stablePatterns.length > 0 && !unstableMemory;
    const repeatedRisks = learning.repeatedRisks.length > 0;
    const lowConfidenceDecision = Boolean(input.decision && input.decision.confidence < 0.5);

    if (unstableMemory) contextFactors.push("memory_pattern_unstable");
    if (stableMemory) contextFactors.push("memory_pattern_stable");
    if (repeatedRisks) contextFactors.push("repeated_risk_signal");
    if (highRiskExecution) contextFactors.push("execution_high_risk");
    if (lowConfidenceDecision) contextFactors.push("low_confidence_decision");

    if (highRiskExecution) {
      return {
        message: "Active execution is running under high risk — consider pausing and reassessing.",
        contextFactors,
        recommendedAdjustment: "Pause execution, inspect active alerts, then validate the War Room assumptions.",
        confidence: confidenceFromFactors({
          decision: input.decision,
          factors: contextFactors,
          stable: stableMemory,
          unstable: unstableMemory,
          highRisk: true,
        }),
      };
    }

    if (unstableMemory) {
      return {
        message: "Previous similar executions showed instability — proceed cautiously.",
        contextFactors,
        recommendedAdjustment: "Reduce scope, compare one safer alternative, and keep monitoring signals active.",
        confidence: confidenceFromFactors({
          decision: input.decision,
          factors: contextFactors,
          stable: false,
          unstable: true,
          highRisk: false,
        }),
      };
    }

    if (lowConfidenceDecision) {
      return {
        message: "Decision confidence is low — compare more scenarios before execution.",
        contextFactors,
        recommendedAdjustment: "Add another scenario option or improve structure before committing.",
        confidence: confidenceFromFactors({
          decision: input.decision,
          factors: contextFactors,
          stable: stableMemory,
          unstable: false,
          highRisk: false,
        }),
      };
    }

    if (stableMemory) {
      return {
        message: "Similar scenarios were previously stable — confidence in execution is higher.",
        contextFactors,
        recommendedAdjustment: "Proceed with the recommended option, while keeping lightweight monitoring active.",
        confidence: confidenceFromFactors({
          decision: input.decision,
          factors: contextFactors,
          stable: true,
          unstable: false,
          highRisk: false,
        }),
      };
    }

    if (input.decision) {
      return {
        message: "Recommendation is structurally valid, but learning history is still thin.",
        contextFactors,
        recommendedAdjustment: "Run the scenario with monitoring enabled and record the outcome.",
        confidence: confidenceFromFactors({
          decision: input.decision,
          factors: contextFactors,
          stable: false,
          unstable: false,
          highRisk: false,
        }),
      };
    }

    return null;
  } catch {
    return null;
  }
}
