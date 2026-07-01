import type {
  ExecutiveCounterpoint,
  ExecutiveDebatePath,
  ExecutiveStrategicReflection,
  ExecutiveThoughtPartnerInput,
} from "./executiveThoughtPartnerTypes.ts";

export function buildExecutiveStrategicReflections(input: ExecutiveThoughtPartnerInput): readonly ExecutiveStrategicReflection[] {
  const reflections: ExecutiveStrategicReflection[] = [
    ...input.coaching.reflectionPrompts.map((prompt) =>
      Object.freeze({
        reflectionId: `strategic-reflection:${prompt.promptId}`,
        prompt: prompt.prompt,
        sourceReference: prompt.sourceId,
        traceReference: prompt.traceReference,
      })
    ),
    ...input.coaching.decisionQualityPrompts.map((prompt) =>
      Object.freeze({
        reflectionId: `strategic-reflection:${prompt.promptId}`,
        prompt: prompt.prompt,
        sourceReference: prompt.sourceId,
        traceReference: prompt.traceReference,
      })
    ),
    ...input.coaching.planReviewPrompts.map((prompt) =>
      Object.freeze({
        reflectionId: `strategic-reflection:${prompt.promptId}`,
        prompt: prompt.prompt,
        sourceReference: prompt.sourceId,
        traceReference: prompt.traceReference,
      })
    ),
  ];

  return Object.freeze(reflections.sort((left, right) => left.reflectionId.localeCompare(right.reflectionId)));
}

export function buildExecutiveDebatePaths(counterpoints: readonly ExecutiveCounterpoint[]): readonly ExecutiveDebatePath[] {
  return Object.freeze(
    counterpoints.map((counterpoint) =>
      Object.freeze({
        debatePathId: `debate-path:${counterpoint.counterpointId}`,
        openingPosition: `Consider the position behind ${counterpoint.sourceReference}.`,
        counterpoint: counterpoint.statement,
        refinementQuestion: `What would make ${counterpoint.sourceReference} stronger, weaker, or irrelevant?`,
        possibleSynthesis: "Hold both positions as unresolved conversation paths until future judgment or planning layers consume them.",
        traceReferences: Object.freeze([counterpoint.sourceReference]),
      })
    )
  );
}
