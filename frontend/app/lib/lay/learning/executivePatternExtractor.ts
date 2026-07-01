import type { ExecutiveLearningContext, ExecutiveLearningPattern } from "./executiveLearningTypes.ts";

function pattern(patternType: ExecutiveLearningPattern["patternType"], sourceReferences: readonly string[]): ExecutiveLearningPattern {
  const sorted = Object.freeze([...sourceReferences].sort());
  return Object.freeze({
    patternId: `learning-pattern:${patternType}`,
    patternType,
    sourceReferences: sorted,
    observation: `${patternType} signals appear across the executive workflow.`,
    explanation: `Pattern exists because ${patternType} metadata can be reused as learning context.`,
  });
}

export function extractExecutivePatterns(context: ExecutiveLearningContext): readonly ExecutiveLearningPattern[] {
  return Object.freeze([
    pattern("assumption", context.assumptionIds),
    pattern("constraint", context.constraintIds),
    pattern("risk", context.riskIds),
    pattern("tension", context.tensionIds),
    pattern("priority", context.priorityIds),
    pattern("blindSpot", context.blindSpotIds),
    pattern("conflict", context.conflictZoneIds),
    pattern("reframe", context.reframeIds),
  ].filter((item) => item.sourceReferences.length > 0).sort((left, right) => left.patternId.localeCompare(right.patternId)));
}
