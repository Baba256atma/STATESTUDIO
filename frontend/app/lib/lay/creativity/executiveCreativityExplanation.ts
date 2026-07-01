import type {
  ExecutiveConstraintReframe,
  ExecutiveCreativeAlternative,
  ExecutiveCreativityExplanation,
  ExecutiveCreativitySession,
  ExecutiveInnovationPath,
  ExecutiveOpportunityIdea,
  ExecutiveReframe,
  ExecutiveStrategicAngle,
} from "./executiveCreativityTypes.ts";

export function buildExecutiveCreativityExplanation(
  session: ExecutiveCreativitySession,
  reframes: readonly ExecutiveReframe[],
  alternatives: readonly ExecutiveCreativeAlternative[],
  opportunities: readonly ExecutiveOpportunityIdea[],
  constraintReframes: readonly ExecutiveConstraintReframe[],
  strategicAngles: readonly ExecutiveStrategicAngle[],
  innovationPaths: readonly ExecutiveInnovationPath[]
): ExecutiveCreativityExplanation {
  const reframeReasons = Object.freeze(reframes.map((item) => `${item.reframeId}: ${item.explanation}`));
  const alternativeReasons = Object.freeze(alternatives.map((item) => `${item.alternativeId}: ${item.explanation}`));
  const opportunityReasons = Object.freeze(opportunities.map((item) => `${item.opportunityIdeaId}: ${item.explanation}`));
  const constraintReasons = Object.freeze(constraintReframes.map((item) => `${item.constraintReframeId}: ${item.explanation}`));
  const angleReasons = Object.freeze(strategicAngles.map((item) => `${item.angleId}: ${item.explanation}`));
  const pathReasons = Object.freeze(innovationPaths.map((item) => `${item.pathId}: ${item.explanation}`));
  const traceReferences = Object.freeze([
    session.reasoningSessionId,
    session.judgmentSessionId,
    session.planningSessionId,
    session.coachingSessionId,
    session.thoughtPartnerSessionId,
    session.visualReasoningSessionId,
    session.communicationSessionId,
    session.negotiationSessionId,
    ...reframes.map((item) => item.sourceReference),
    ...alternatives.map((item) => item.sourceReference),
    ...opportunities.map((item) => item.sourceReference),
    ...constraintReframes.map((item) => item.constraintId),
    ...strategicAngles.map((item) => item.sourceReference),
    ...innovationPaths.flatMap((item) => item.sourceReferences),
  ].sort());

  return Object.freeze({
    explanationId: `creativity-explanation:${session.sessionId}`,
    reframeReasons,
    alternativeReasons,
    opportunityReasons,
    constraintReasons,
    angleReasons,
    pathReasons,
    traceReferences,
    narrative: [...reframeReasons, ...alternativeReasons, ...opportunityReasons, ...constraintReasons, ...angleReasons, ...pathReasons].join(" "),
  });
}
