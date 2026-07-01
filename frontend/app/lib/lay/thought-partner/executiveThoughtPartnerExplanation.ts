import type {
  ExecutiveCounterpoint,
  ExecutivePerspectiveFrame,
  ExecutiveTensionMap,
  ExecutiveThoughtPartnerExplanation,
  ExecutiveThoughtPartnerSession,
} from "./executiveThoughtPartnerTypes.ts";

export function buildExecutiveThoughtPartnerExplanation(
  session: ExecutiveThoughtPartnerSession,
  perspectives: readonly ExecutivePerspectiveFrame[],
  counterpoints: readonly ExecutiveCounterpoint[],
  tensionMap: readonly ExecutiveTensionMap[]
): ExecutiveThoughtPartnerExplanation {
  const perspectiveReasons = Object.freeze(perspectives.map((perspective) => `${perspective.perspectiveId}: ${perspective.basis}`));
  const counterpointReasons = Object.freeze(counterpoints.map((counterpoint) => `${counterpoint.counterpointId}: ${counterpoint.reason}`));
  const tensionReasons = Object.freeze(tensionMap.map((tension) => `${tension.tensionId}: ${tension.leftPole} and ${tension.rightPole} are both visible.`));
  const traceReferences = Object.freeze([
    session.reasoningSessionId,
    session.judgmentSessionId,
    session.planningSessionId,
    session.coachingSessionId,
    ...perspectives.flatMap((perspective) => perspective.linkedReferences),
    ...counterpoints.map((counterpoint) => counterpoint.sourceReference),
    ...tensionMap.flatMap((tension) => tension.traceReferences),
  ].sort());

  return Object.freeze({
    explanationId: `thought-partner-explanation:${session.sessionId}`,
    perspectiveReasons,
    counterpointReasons,
    tensionReasons,
    traceReferences,
    narrative: [...perspectiveReasons, ...counterpointReasons, ...tensionReasons].join(" "),
  });
}
