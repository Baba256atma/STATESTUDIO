import type { ExecutiveMilestone, ExecutivePhase, ExecutiveTimeline } from "./executivePlanningTypes.ts";

export function buildExecutiveTimeline(
  sessionId: string,
  phases: readonly ExecutivePhase[],
  milestones: readonly ExecutiveMilestone[]
): ExecutiveTimeline {
  const phaseSequence = phases
    .slice()
    .sort((left, right) => left.logicalOrder - right.logicalOrder)
    .flatMap((phase) => [
      phase.phaseId,
      ...milestones
        .filter((milestone) => phase.milestoneIds.includes(milestone.milestoneId))
        .sort((left, right) => left.logicalOrder - right.logicalOrder)
        .map((milestone) => milestone.milestoneId),
    ]);

  return Object.freeze({
    timelineId: `timeline:${sessionId}`,
    mode: "logical-only",
    sequence: Object.freeze(phaseSequence),
    realDatesAssigned: false,
    durationsAssigned: false,
  });
}
