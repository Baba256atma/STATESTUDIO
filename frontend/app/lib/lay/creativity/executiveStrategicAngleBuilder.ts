import type { ExecutiveCreativeAlternative, ExecutiveOpportunityIdea, ExecutiveStrategicAngle } from "./executiveCreativityTypes.ts";

export function buildExecutiveStrategicAngles(
  alternatives: readonly ExecutiveCreativeAlternative[],
  opportunities: readonly ExecutiveOpportunityIdea[]
): readonly ExecutiveStrategicAngle[] {
  return Object.freeze(
    alternatives.map((alternative, index) => {
      const opportunity = opportunities[index % opportunities.length];
      return Object.freeze({
        angleId: `strategic-angle:${alternative.alternativeId}`,
        sourceReference: opportunity?.opportunityIdeaId ?? alternative.alternativeId,
        angle: `Pair ${alternative.alternativeId} with ${opportunity?.opportunityIdeaId ?? "available opportunity metadata"}.`,
        explanation: "Strategic angle combines alternatives and opportunities without recommending a choice.",
      });
    }).sort((left, right) => left.angleId.localeCompare(right.angleId))
  );
}
