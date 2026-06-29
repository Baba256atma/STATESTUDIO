/**
 * APP-5:2 — Scenario Timeline Event normalizer.
 */

import {
  SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS,
  SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP,
} from "./scenarioTimelineEventConstants.ts";
import type { CreateTimelineEventInput } from "./scenarioTimelineEventTypes.ts";
import { SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./scenarioTimelinePlatformConstants.ts";
import type {
  ScenarioTimelineEventType,
  ScenarioTimelineLifecycleStage,
} from "./scenarioTimelinePlatformTypes.ts";
import { isScenarioTimelineEventType } from "./scenarioTimelinePlatformValidation.ts";

export type NormalizedTimelineEventInput = Readonly<{
  eventId?: string;
  scenarioId: string;
  workspaceId: string;
  stage: ScenarioTimelineLifecycleStage;
  eventType: ScenarioTimelineEventType;
  timestamp: string;
  createdBy: string;
  title: string;
  summary: string;
  sourceModule: string;
  metadata: Readonly<Record<string, string>>;
  extensions: Readonly<Record<string, string>>;
}>;

function trim(value: string): string {
  return value.trim();
}

function normalizeStringMap(
  input: Readonly<Record<string, string>> | undefined,
  maxKeys: number,
  maxValueLength: number
): Readonly<Record<string, string>> {
  if (!input) {
    return Object.freeze({});
  }
  const normalized: Record<string, string> = {};
  let count = 0;
  for (const [rawKey, rawValue] of Object.entries(input)) {
    if (count >= maxKeys) {
      break;
    }
    const key = trim(rawKey);
    const value = trim(String(rawValue));
    if (key.length === 0 || value.length === 0) {
      continue;
    }
    normalized[key] = value.slice(0, maxValueLength);
    count += 1;
  }
  return Object.freeze(normalized);
}

export function resolveEventTypeForStage(
  stage: ScenarioTimelineLifecycleStage,
  eventType?: ScenarioTimelineEventType
): ScenarioTimelineEventType {
  if (eventType && isScenarioTimelineEventType(eventType)) {
    return eventType;
  }
  return SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP[stage as keyof typeof SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP];
}

export function normalizeTimelineEventInput(input: CreateTimelineEventInput): NormalizedTimelineEventInput {
  const stage = input.stage;
  const eventType = resolveEventTypeForStage(stage, input.eventType);

  return Object.freeze({
    eventId: input.eventId ? trim(input.eventId) : undefined,
    scenarioId: trim(input.scenarioId),
    workspaceId: trim(input.workspaceId),
    stage,
    eventType,
    timestamp: trim(input.timestamp),
    createdBy: trim(input.createdBy).slice(0, SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS.maxCreatedByLength),
    title: trim(input.title),
    summary: trim(input.summary),
    sourceModule: trim(input.sourceModule ?? "scenario-timeline-event-engine"),
    metadata: normalizeStringMap(
      input.metadata,
      SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS.maxMetadataKeys,
      SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS.maxMetadataValueLength
    ),
    extensions: normalizeStringMap(
      input.extensions,
      SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS.maxExtensionKeys,
      SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS.maxExtensionValueLength
    ),
  });
}

export function buildScenarioTimelineEventVersion(): Readonly<{
  semanticVersion: string;
  schemaVersion: string;
  engineVersion: "APP-5/2";
  foundationContractVersion: typeof SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}> {
  return Object.freeze({
    semanticVersion: "1.0.0",
    schemaVersion: "1.0.0",
    engineVersion: "APP-5/2" as const,
    foundationContractVersion: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const ScenarioTimelineEventNormalizer = Object.freeze({
  normalizeTimelineEventInput,
  resolveEventTypeForStage,
  buildScenarioTimelineEventVersion,
});
