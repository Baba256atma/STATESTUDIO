import type { ExecutiveCreativeAlternative, ExecutiveReframe } from "./executiveCreativityTypes.ts";

export function generateExecutiveAlternatives(reframes: readonly ExecutiveReframe[]): readonly ExecutiveCreativeAlternative[] {
  return Object.freeze(
    reframes.slice(0, Math.max(4, Math.min(10, reframes.length))).map((reframe) =>
      Object.freeze({
        alternativeId: `creative-alternative:${reframe.reframeId}`,
        sourceReference: reframe.reframeId,
        alternative: `Alternative path derived from: ${reframe.reframe}`,
        selectionState: "not-selected" as const,
        explanation: "Alternative is generated for option space expansion only and is not selected.",
      })
    ).sort((left, right) => left.alternativeId.localeCompare(right.alternativeId))
  );
}
