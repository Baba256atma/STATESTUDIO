import type {
  ExecutiveConstraintReframe,
  ExecutiveCreativeAlternative,
  ExecutiveInnovationPath,
  ExecutiveOpportunityIdea,
  ExecutiveReframe,
} from "./executiveCreativityTypes.ts";

export function buildExecutiveInnovationPaths(
  reframes: readonly ExecutiveReframe[],
  alternatives: readonly ExecutiveCreativeAlternative[],
  opportunities: readonly ExecutiveOpportunityIdea[],
  constraintReframes: readonly ExecutiveConstraintReframe[]
): readonly ExecutiveInnovationPath[] {
  return Object.freeze(
    alternatives.map((alternative, index) => {
      const reframe = reframes[index % reframes.length];
      const opportunity = opportunities[index % opportunities.length];
      const constraint = constraintReframes[index % constraintReframes.length];
      return Object.freeze({
        pathId: `innovation-path:${alternative.alternativeId}`,
        openingReframe: reframe?.reframe ?? alternative.sourceReference,
        creativeAlternative: alternative.alternative,
        opportunityReference: opportunity?.opportunityIdeaId ?? alternative.sourceReference,
        constraintInput: constraint?.designInput ?? "No specific constraint input available.",
        conceptualOnly: true as const,
        sourceReferences: Object.freeze([
          reframe?.reframeId ?? alternative.sourceReference,
          alternative.alternativeId,
          opportunity?.opportunityIdeaId ?? alternative.sourceReference,
          constraint?.constraintReframeId ?? alternative.sourceReference,
        ].sort()),
        explanation: "Innovation path is conceptual metadata only for downstream consumers.",
      });
    }).sort((left, right) => left.pathId.localeCompare(right.pathId))
  );
}
