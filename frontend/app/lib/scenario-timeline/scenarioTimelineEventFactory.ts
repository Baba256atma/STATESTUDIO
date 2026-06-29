/**
 * APP-5:2 — Scenario Timeline Event factory.
 */

import { buildTimelineEvent } from "./scenarioTimelineEventBuilder.ts";
import { scenarioTimelineEventEngineErrorFromCode } from "./scenarioTimelineEventErrors.ts";
import { normalizeTimelineEventInput } from "./scenarioTimelineEventNormalizer.ts";
import { allocateScenarioTimelineSequenceOrder, publishTimelineEvent } from "./scenarioTimelineEventRegistry.ts";
import type {
  CreateTimelineEventInput,
  ScenarioTimelineEvent,
  ScenarioTimelineEventResult,
} from "./scenarioTimelineEventTypes.ts";
import {
  validateNormalizedTimelineEventInput,
  validateTimelineEvent,
} from "./scenarioTimelineEventValidator.ts";
export type BuildTimelineEventResult = ScenarioTimelineEventResult<ScenarioTimelineEvent>;

export function buildTimelineEventFromInput(input: CreateTimelineEventInput): BuildTimelineEventResult {
  const normalized = normalizeTimelineEventInput(input);
  const validation = validateNormalizedTimelineEventInput(normalized, { checkDuplicate: false });
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues[0]?.message ?? "Timeline event build rejected.",
      data: null,
      error: scenarioTimelineEventEngineErrorFromCode("validationFailure", validation.issues[0]?.message ?? "Validation failed."),
      readOnly: true as const,
    });
  }

  const event = buildTimelineEvent(normalized);
  const eventValidation = validateTimelineEvent(event);
  if (!eventValidation.valid) {
    return Object.freeze({
      success: false,
      reason: eventValidation.issues[0]?.message ?? "Timeline event contract rejected.",
      data: null,
      error: scenarioTimelineEventEngineErrorFromCode("validationFailure", eventValidation.issues[0]?.message ?? "Validation failed."),
      readOnly: true as const,
    });
  }

  return Object.freeze({
    success: true,
    reason: "Timeline event built.",
    data: event,
    error: null,
    readOnly: true as const,
  });
}

export function createTimelineEventInternal(input: CreateTimelineEventInput): BuildTimelineEventResult {
  const normalized = normalizeTimelineEventInput(input);
  const validation = validateNormalizedTimelineEventInput(normalized, { checkDuplicate: true });
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues[0]?.message ?? "Timeline event creation rejected.",
      data: null,
      error: scenarioTimelineEventEngineErrorFromCode("validationFailure", validation.issues[0]?.message ?? "Validation failed."),
      readOnly: true as const,
    });
  }

  const sequenceOrder = allocateScenarioTimelineSequenceOrder(normalized.scenarioId);
  const event = buildTimelineEvent(normalized, sequenceOrder);
  const eventValidation = validateTimelineEvent(event);
  if (!eventValidation.valid) {
    return Object.freeze({
      success: false,
      reason: eventValidation.issues[0]?.message ?? "Timeline event contract rejected.",
      data: null,
      error: scenarioTimelineEventEngineErrorFromCode("validationFailure", eventValidation.issues[0]?.message ?? "Validation failed."),
      readOnly: true as const,
    });
  }

  const publishResult = publishTimelineEvent(event);
  if (!publishResult.success || !publishResult.data) {
    return Object.freeze({
      success: false,
      reason: publishResult.reason,
      data: null,
      error: publishResult.error,
      readOnly: true as const,
    });
  }

  return Object.freeze({
    success: true,
    reason: "Timeline event created and published.",
    data: publishResult.data,
    error: null,
    readOnly: true as const,
  });
}

export const ScenarioTimelineEventFactory = Object.freeze({
  buildTimelineEventFromInput,
  createTimelineEventInternal,
});
