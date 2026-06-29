/**
 * APP-5:2 — Scenario Timeline Event identity builder.
 */

import type {
  ScenarioTimelineEventId,
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineScenarioId,
  ScenarioTimelineWorkspaceId,
} from "./scenarioTimelinePlatformTypes.ts";
import type { ScenarioTimelineEventIdentity } from "./scenarioTimelineEventTypes.ts";

let eventSequence = 0;

export function resetScenarioTimelineEventIdentityForTests(): void {
  eventSequence = 0;
}

export function createScenarioTimelineEventId(
  scenarioId: ScenarioTimelineScenarioId,
  stage: ScenarioTimelineLifecycleStage,
  timestamp: string
): ScenarioTimelineEventId {
  eventSequence += 1;
  const normalizedTime = timestamp.replace(/[:.]/g, "-");
  return `timeline-event-${scenarioId}-${stage}-${normalizedTime}-${eventSequence}`;
}

export function buildScenarioTimelineEventIdentity(input: {
  eventId: ScenarioTimelineEventId;
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  stage: ScenarioTimelineLifecycleStage;
}): ScenarioTimelineEventIdentity {
  return Object.freeze({
    eventId: input.eventId,
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    stage: input.stage,
    readOnly: true as const,
  });
}

export const ScenarioTimelineEventIdentityBuilder = Object.freeze({
  createScenarioTimelineEventId,
  buildScenarioTimelineEventIdentity,
  resetScenarioTimelineEventIdentityForTests,
});
