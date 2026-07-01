import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";
import type { ExecutiveConfidence, ExecutiveJudgmentLevel } from "./executiveJudgmentTypes.ts";

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) return 1;
  return Number((numerator / denominator).toFixed(2));
}

function confidenceLevel(average: number): ExecutiveJudgmentLevel {
  if (average >= 0.8) return "high";
  if (average >= 0.5) return "moderate";
  return "low";
}

export function buildExecutiveConfidence(reasoning: ExecutiveReasoningResult): ExecutiveConfidence {
  const reasoningCompleteness = reasoning.validation.valid ? 1 : 0;
  const evidenceCoverage = ratio(
    reasoning.chain.nodes.filter((node) => node.evidenceReference.trim().length > 0).length,
    reasoning.chain.nodes.length
  );
  const assumptionQuality = ratio(
    reasoning.components.assumptions.filter((assumption) => assumption.impact.trim().length > 0).length,
    reasoning.components.assumptions.length
  );
  const constraintConsistency = ratio(
    reasoning.components.constraints.filter((constraint) => constraint.consequence.trim().length > 0).length,
    reasoning.components.constraints.length
  );
  const average = (reasoningCompleteness + evidenceCoverage + assumptionQuality + constraintConsistency) / 4;
  const level = confidenceLevel(average);

  return Object.freeze({
    level,
    reasoningCompleteness,
    evidenceCoverage,
    assumptionQuality,
    constraintConsistency,
    justification: `Confidence is ${level} because completeness=${reasoningCompleteness}, evidence=${evidenceCoverage}, assumptions=${assumptionQuality}, constraints=${constraintConsistency}.`,
  });
}
