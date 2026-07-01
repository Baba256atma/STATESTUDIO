import type {
  ExecutiveConcessionCandidate,
  ExecutiveConflictZone,
  ExecutiveInterestAnalysis,
  ExecutiveLeveragePoint,
  ExecutiveNegotiationExplanation,
  ExecutiveNegotiationPath,
  ExecutiveNegotiationSession,
  ExecutiveStakeholderPosition,
} from "./executiveNegotiationTypes.ts";

export function buildExecutiveNegotiationExplanation(
  session: ExecutiveNegotiationSession,
  positions: readonly ExecutiveStakeholderPosition[],
  interests: readonly ExecutiveInterestAnalysis[],
  leveragePoints: readonly ExecutiveLeveragePoint[],
  concessions: readonly ExecutiveConcessionCandidate[],
  conflictZones: readonly ExecutiveConflictZone[],
  paths: readonly ExecutiveNegotiationPath[]
): ExecutiveNegotiationExplanation {
  const positionReasons = Object.freeze(positions.map((position) => `${position.stakeholderId}: ${position.explanation}`));
  const interestReasons = Object.freeze(interests.map((interest) => `${interest.interestId}: ${interest.explanation}`));
  const leverageReasons = Object.freeze(leveragePoints.map((leverage) => `${leverage.leverageId}: ${leverage.explanation}`));
  const concessionReasons = Object.freeze(concessions.map((concession) => `${concession.concessionId}: ${concession.explanation}`));
  const conflictReasons = Object.freeze(conflictZones.map((zone) => `${zone.conflictZoneId}: ${zone.explanation}`));
  const pathReasons = Object.freeze(paths.map((path) => `${path.pathId}: ${path.explanation}`));
  const traceReferences = Object.freeze([
    session.reasoningSessionId,
    session.judgmentSessionId,
    session.planningSessionId,
    session.coachingSessionId,
    session.thoughtPartnerSessionId,
    session.visualReasoningSessionId,
    session.communicationSessionId,
    ...positions.map((position) => position.sourceReference),
    ...interests.map((interest) => interest.sourceReference),
    ...leveragePoints.map((leverage) => leverage.sourceReference),
    ...concessions.map((concession) => concession.sourceReference),
    ...conflictZones.flatMap((zone) => zone.sourceReferences),
    ...paths.flatMap((path) => path.sourceReferences),
  ].sort());

  return Object.freeze({
    explanationId: `negotiation-explanation:${session.sessionId}`,
    positionReasons,
    interestReasons,
    leverageReasons,
    concessionReasons,
    conflictReasons,
    pathReasons,
    traceReferences,
    narrative: [...positionReasons, ...interestReasons, ...leverageReasons, ...concessionReasons, ...conflictReasons, ...pathReasons].join(" "),
  });
}
