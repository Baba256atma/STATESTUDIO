/**
 * APP-6:2 — Decision Event validation.
 */

import { DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./decisionTimelineConstants.ts";
import {
  validateDecisionEventContractShape,
  validateWorkspaceIsolation,
} from "./decisionTimelineValidation.ts";
import type { DecisionEvent } from "./decisionTimelineTypes.ts";
import { getDecisionTimelineManifest } from "./decisionTimelineContracts.ts";
import {
  DECISION_ENGINE_EVENT_TYPE_KEYS,
  DECISION_ENGINE_LIFECYCLE_KEYS,
  DECISION_ENGINE_TO_FOUNDATION_EVENT_TYPE_MAP,
  DECISION_EVENT_ALLOWED_EXTENSION_KEYS,
  DECISION_EVENT_ENGINE_CONTRACT_VERSION,
  DECISION_EVENT_ENGINE_LIMITS,
  DECISION_EVENT_MANDATORY_FIELDS,
  DECISION_EVENT_TYPE_LIFECYCLE_MAP,
  type DecisionEngineEvent,
  type DecisionEngineEventType,
  type DecisionEngineLifecycle,
  type DecisionValidationIssue,
  type DecisionValidationResult,
  type NormalizedDecisionEventInput,
} from "./decisionEventTypes.ts";
import { isDuplicateDecisionEventId } from "./decisionEventRegistry.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function isValidIsoTimestamp(value: string): boolean {
  if (value.length === 0) {
    return false;
  }
  return Number.isFinite(Date.parse(value));
}

export function isDecisionEngineEventType(value: string): value is DecisionEngineEventType {
  return (DECISION_ENGINE_EVENT_TYPE_KEYS as readonly string[]).includes(value);
}

export function isDecisionEngineLifecycle(value: string): value is DecisionEngineLifecycle {
  return (DECISION_ENGINE_LIFECYCLE_KEYS as readonly string[]).includes(value);
}

function validateExtensionKeys(extensions: Readonly<Record<string, string>>): DecisionValidationIssue[] {
  const issues: DecisionValidationIssue[] = [];
  const allowed = new Set(DECISION_EVENT_ALLOWED_EXTENSION_KEYS as readonly string[]);
  for (const key of Object.keys(extensions)) {
    if (!allowed.has(key)) {
      issues.push(issue("invalid_extension", `Extension key not registered: ${key}.`, "extensions"));
    }
  }
  return issues;
}

export function mapDecisionEngineEventToFoundationContract(event: DecisionEngineEvent): DecisionEvent {
  const foundationEventType =
    DECISION_ENGINE_TO_FOUNDATION_EVENT_TYPE_MAP[
      event.eventType as keyof typeof DECISION_ENGINE_TO_FOUNDATION_EVENT_TYPE_MAP
    ];

  return Object.freeze({
    eventId: event.eventId,
    decisionId: event.decisionId,
    workspaceId: event.workspaceId,
    eventType: foundationEventType,
    title: event.title,
    summary: event.summary,
    occurredAt: event.timestamp,
    sourceModule: event.sourceModule,
    contractVersion: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function validateNormalizedDecisionEventInput(
  input: NormalizedDecisionEventInput,
  options?: Readonly<{ checkDuplicate?: boolean }>
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  for (const field of DECISION_EVENT_MANDATORY_FIELDS) {
    if (
      field === "metadata" ||
      field === "extensions" ||
      field === "platformVersion" ||
      field === "eventId" ||
      field === "timelineEntryId" ||
      field === "identity" ||
      field === "version" ||
      field === "sequenceNumber"
    ) {
      continue;
    }
    const value = input[field as keyof NormalizedDecisionEventInput];
    if (value === undefined || value === null || (typeof value === "string" && value.trim().length === 0)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    }
  }

  if (!isDecisionEngineEventType(input.eventType)) {
    issues.push(issue("invalid_enum", "Invalid event type.", "eventType"));
  }
  if (!isDecisionEngineLifecycle(input.lifecycle)) {
    issues.push(issue("invalid_enum", "Invalid lifecycle.", "lifecycle"));
  }
  if (isDecisionEngineEventType(input.eventType) && isDecisionEngineLifecycle(input.lifecycle)) {
    const expected = DECISION_EVENT_TYPE_LIFECYCLE_MAP[input.eventType];
    if (input.lifecycle !== expected) {
      issues.push(
        issue(
          "event_lifecycle_mismatch",
          `Lifecycle ${input.lifecycle} is incompatible with event type ${input.eventType}. Expected ${expected}.`,
          "lifecycle"
        )
      );
    }
  }

  if (!isValidIsoTimestamp(input.timestamp)) {
    issues.push(issue("invalid_timestamp", "timestamp must be a valid ISO-8601 value.", "timestamp"));
  }

  if (input.createdBy.length > DECISION_EVENT_ENGINE_LIMITS.maxCreatedByLength) {
    issues.push(issue("invalid_field", "createdBy exceeds maximum length.", "createdBy"));
  }

  if (Object.keys(input.metadata).length > DECISION_EVENT_ENGINE_LIMITS.maxMetadataKeys) {
    issues.push(issue("invalid_metadata", "metadata exceeds maximum key count.", "metadata"));
  }
  if (Object.keys(input.extensions).length > DECISION_EVENT_ENGINE_LIMITS.maxExtensionKeys) {
    issues.push(issue("invalid_extensions", "extensions exceed maximum key count.", "extensions"));
  }
  issues.push(...validateExtensionKeys(input.extensions));

  if (input.context && input.context.workspaceId !== input.workspaceId) {
    issues.push(issue("workspace_isolation_violation", "context workspaceId must match event workspaceId.", "context"));
  }

  if (input.references && input.references.length > DECISION_EVENT_ENGINE_LIMITS.maxReferences) {
    issues.push(issue("invalid_field", "references exceed maximum count.", "references"));
  }

  if (input.tags && input.tags.length > DECISION_EVENT_ENGINE_LIMITS.maxTags) {
    issues.push(issue("invalid_field", "tags exceed maximum count.", "tags"));
  }

  if (options?.checkDuplicate && input.eventId && isDuplicateDecisionEventId(input.eventId)) {
    issues.push(issue("duplicate_event", `Duplicate eventId: ${input.eventId}.`, "eventId"));
  }

  return result(issues);
}

export function validateDecisionEvent(event: DecisionEngineEvent): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (event.platformVersion !== DECISION_EVENT_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_platform_version", "Invalid platformVersion.", "platformVersion"));
  }
  if (event.readOnly !== true) {
    issues.push(issue("contract_violation", "Decision events must be read-only.", "readOnly"));
  }

  const normalizedValidation = validateNormalizedDecisionEventInput(
    Object.freeze({
      eventId: event.eventId,
      decisionId: event.decisionId,
      timelineEntryId: event.timelineEntryId,
      workspaceId: event.workspaceId,
      scenarioId: event.scenarioId,
      intentId: event.intentId,
      eventType: event.eventType,
      lifecycle: event.lifecycle,
      timestamp: event.timestamp,
      createdBy: event.createdBy,
      title: event.title,
      summary: event.summary,
      sourceModule: event.sourceModule,
      metadata: event.metadata,
      context: event.context,
      references: event.references,
      tags: event.tags,
      extensions: event.extensions,
    }),
    { checkDuplicate: false }
  );
  issues.push(...normalizedValidation.issues);

  const foundationValidation = validateDecisionEventContractShape(mapDecisionEngineEventToFoundationContract(event));
  issues.push(...foundationValidation.issues);

  const isolationValidation = validateWorkspaceIsolation(event.workspaceId, event.identity.workspaceId);
  issues.push(...isolationValidation.issues);

  if (event.sequenceNumber < 1) {
    issues.push(issue("invalid_order", "sequenceNumber must be positive.", "sequenceNumber"));
  }

  if (event.identity.eventId !== event.eventId) {
    issues.push(issue("immutable_identity_violation", "identity.eventId must match event.eventId.", "identity"));
  }
  if (event.identity.timestamp !== event.timestamp) {
    issues.push(issue("immutable_timestamp_violation", "identity.timestamp must match event.timestamp.", "identity"));
  }

  return result(issues);
}

export function validateManifestCompatibility(timestamp: string): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  const manifest = getDecisionTimelineManifest(timestamp);
  if (manifest.manifestVersion !== DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("manifest_incompatible", "Foundation manifest version mismatch.", "manifestVersion"));
  }
  if (manifest.futureCompatibility.eventsReady !== false) {
    issues.push(issue("manifest_incompatible", "Foundation must not claim eventsReady before APP-6/2 certification.", "eventsReady"));
  }
  return result(issues);
}

export const DecisionEventValidation = Object.freeze({
  isDecisionEngineEventType,
  isDecisionEngineLifecycle,
  validateDecisionEvent,
  validateNormalizedDecisionEventInput,
  mapDecisionEngineEventToFoundationContract,
  validateManifestCompatibility,
});
