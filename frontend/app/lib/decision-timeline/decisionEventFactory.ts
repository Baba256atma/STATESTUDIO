/**
 * APP-6:2 — Decision Event factory.
 */

import { buildDecisionEvent } from "./decisionEventBuilder.ts";
import {
  allocateDecisionSequenceNumber,
  publishDecisionEvent,
} from "./decisionEventRegistry.ts";
import {
  DECISION_EVENT_ENGINE_LIMITS,
  DECISION_EVENT_TYPE_LIFECYCLE_MAP,
  type CreateDecisionEventInput,
  type DecisionEngineEvent,
  type DecisionEngineEventType,
  type DecisionEventResult,
  type NormalizedDecisionEventInput,
  decisionEventEngineErrorFromCode,
} from "./decisionEventTypes.ts";
import {
  validateDecisionEvent,
  validateNormalizedDecisionEventInput,
} from "./decisionEventValidation.ts";

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

export function resolveLifecycleForEventType(
  eventType: DecisionEngineEventType,
  lifecycle?: NormalizedDecisionEventInput["lifecycle"]
): NormalizedDecisionEventInput["lifecycle"] {
  if (lifecycle) {
    return lifecycle;
  }
  return DECISION_EVENT_TYPE_LIFECYCLE_MAP[eventType];
}

export function normalizeDecisionEventInput(input: CreateDecisionEventInput): NormalizedDecisionEventInput {
  const lifecycle = resolveLifecycleForEventType(input.eventType, input.lifecycle);

  return Object.freeze({
    eventId: input.eventId ? trim(input.eventId) : undefined,
    decisionId: trim(input.decisionId),
    timelineEntryId: input.timelineEntryId ? trim(input.timelineEntryId) : undefined,
    workspaceId: trim(input.workspaceId),
    scenarioId: input.scenarioId ? trim(input.scenarioId) : undefined,
    intentId: input.intentId ? trim(input.intentId) : undefined,
    eventType: input.eventType,
    lifecycle,
    timestamp: trim(input.timestamp),
    createdBy: trim(input.createdBy).slice(0, DECISION_EVENT_ENGINE_LIMITS.maxCreatedByLength),
    title: trim(input.title),
    summary: trim(input.summary),
    sourceModule: trim(input.sourceModule ?? "decision-event-engine"),
    metadata: normalizeStringMap(
      input.metadata,
      DECISION_EVENT_ENGINE_LIMITS.maxMetadataKeys,
      DECISION_EVENT_ENGINE_LIMITS.maxMetadataValueLength
    ),
    context: input.context,
    references: input.references ? Object.freeze([...input.references]) : undefined,
    tags: input.tags ? Object.freeze([...input.tags]) : undefined,
    extensions: normalizeStringMap(
      input.extensions,
      DECISION_EVENT_ENGINE_LIMITS.maxExtensionKeys,
      DECISION_EVENT_ENGINE_LIMITS.maxExtensionValueLength
    ),
  });
}

export type BuildDecisionEventResult = DecisionEventResult<DecisionEngineEvent>;

function buildResultFromValidationFailure(
  validation: ReturnType<typeof validateNormalizedDecisionEventInput>,
  reasonPrefix: string
): BuildDecisionEventResult {
  return Object.freeze({
    success: false,
    reason: validation.issues[0]?.message ?? `${reasonPrefix} rejected.`,
    data: null,
    error: decisionEventEngineErrorFromCode(
      "validationFailure",
      validation.issues[0]?.message ?? "Validation failed."
    ),
    readOnly: true as const,
  });
}

export function buildDecisionEventFromInput(input: CreateDecisionEventInput): BuildDecisionEventResult {
  const normalized = normalizeDecisionEventInput(input);
  const validation = validateNormalizedDecisionEventInput(normalized, { checkDuplicate: false });
  if (!validation.valid) {
    return buildResultFromValidationFailure(validation, "Decision event build");
  }

  const event = buildDecisionEvent(normalized);
  const eventValidation = validateDecisionEvent(event);
  if (!eventValidation.valid) {
    return buildResultFromValidationFailure(eventValidation, "Decision event contract");
  }

  return Object.freeze({
    success: true,
    reason: "Decision event built.",
    data: event,
    error: null,
    readOnly: true as const,
  });
}

export function createDecisionEventInternal(input: CreateDecisionEventInput): BuildDecisionEventResult {
  const normalized = normalizeDecisionEventInput(input);
  const validation = validateNormalizedDecisionEventInput(normalized, { checkDuplicate: true });
  if (!validation.valid) {
    return buildResultFromValidationFailure(validation, "Decision event creation");
  }

  const sequenceNumber = allocateDecisionSequenceNumber(normalized.decisionId);
  const event = buildDecisionEvent(normalized, sequenceNumber);
  const eventValidation = validateDecisionEvent(event);
  if (!eventValidation.valid) {
    return buildResultFromValidationFailure(eventValidation, "Decision event contract");
  }

  const publishResult = publishDecisionEvent(event);
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
    reason: "Decision event created and published.",
    data: publishResult.data,
    error: null,
    readOnly: true as const,
  });
}

function createTypedDecisionEvent(
  eventType: DecisionEngineEventType,
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createDecisionEventInternal(Object.freeze({ ...input, eventType }));
}

export function createDecisionCreatedEvent(
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createTypedDecisionEvent("DECISION_CREATED", input);
}

export function createDecisionUpdatedEvent(
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createTypedDecisionEvent("DECISION_UPDATED", input);
}

export function createDecisionApprovedEvent(
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createTypedDecisionEvent("DECISION_APPROVED", input);
}

export function createDecisionRejectedEvent(
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createTypedDecisionEvent("DECISION_REJECTED", input);
}

export function createDecisionCancelledEvent(
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createTypedDecisionEvent("DECISION_CANCELLED", input);
}

export function createDecisionSupersededEvent(
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createTypedDecisionEvent("DECISION_SUPERSEDED", input);
}

export function createDecisionExecutedEvent(
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createTypedDecisionEvent("DECISION_EXECUTED", input);
}

export function createDecisionCompletedEvent(
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createTypedDecisionEvent("DECISION_COMPLETED", input);
}

export function createDecisionArchivedEvent(
  input: Omit<CreateDecisionEventInput, "eventType">
): BuildDecisionEventResult {
  return createTypedDecisionEvent("DECISION_ARCHIVED", input);
}

export const DecisionEventFactory = Object.freeze({
  normalizeDecisionEventInput,
  buildDecisionEventFromInput,
  createDecisionEventInternal,
  createDecisionCreatedEvent,
  createDecisionUpdatedEvent,
  createDecisionApprovedEvent,
  createDecisionRejectedEvent,
  createDecisionCancelledEvent,
  createDecisionSupersededEvent,
  createDecisionExecutedEvent,
  createDecisionCompletedEvent,
  createDecisionArchivedEvent,
});
