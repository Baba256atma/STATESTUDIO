/**
 * APP-5:2 — Scenario Timeline Event builder.
 */

import {
  SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
} from "./scenarioTimelineEventConstants.ts";
import {
  buildScenarioTimelineEventIdentity,
  createScenarioTimelineEventId,
} from "./scenarioTimelineEventIdentity.ts";
import type { NormalizedTimelineEventInput } from "./scenarioTimelineEventNormalizer.ts";
import { buildScenarioTimelineEventVersion } from "./scenarioTimelineEventNormalizer.ts";
import { allocateScenarioTimelineSequenceOrder, peekScenarioTimelineSequenceOrder } from "./scenarioTimelineEventRegistry.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";

export function buildTimelineEvent(
  input: NormalizedTimelineEventInput,
  sequenceOrder: number = peekScenarioTimelineSequenceOrder(input.scenarioId)
): ScenarioTimelineEvent {
  const eventId = input.eventId ?? createScenarioTimelineEventId(input.scenarioId, input.stage, input.timestamp);

  return Object.freeze({
    eventId,
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    eventType: input.eventType,
    stage: input.stage,
    timestamp: input.timestamp,
    createdBy: input.createdBy,
    platformVersion: SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
    title: input.title,
    summary: input.summary,
    sourceModule: input.sourceModule,
    sequenceOrder,
    identity: buildScenarioTimelineEventIdentity({
      eventId,
      scenarioId: input.scenarioId,
      workspaceId: input.workspaceId,
      stage: input.stage,
    }),
    version: buildScenarioTimelineEventVersion(),
    metadata: input.metadata,
    extensions: input.extensions,
    readOnly: true as const,
  });
}

export const ScenarioTimelineEventBuilder = Object.freeze({
  buildTimelineEvent,
});
