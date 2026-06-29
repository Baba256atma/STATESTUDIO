/**
 * APP-6:2 — Decision Event Engine domain types and constants.
 * Extends APP-6:1 foundation types — does not redefine them.
 */

import type { DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./decisionTimelineConstants.ts";
import type {
  DecisionContext,
  DecisionEventId,
  DecisionId,
  DecisionMetadata,
  DecisionReference,
  DecisionTag,
  DecisionTimelineEntry,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

export const DECISION_EVENT_ENGINE_CONTRACT_VERSION = "APP-6/2" as const;
export const DECISION_EVENT_ENGINE_ARCHITECTURE_VERSION = "APP-6/2-event-engine-arch" as const;
export const DECISION_EVENT_SCHEMA_VERSION = "1.0.0" as const;
export const DECISION_EVENT_SEMANTIC_VERSION = "1.0.0" as const;

export const DECISION_EVENT_ENGINE_TAGS = Object.freeze([
  "[APP6_2]",
  "[DECISION_EVENT_ENGINE]",
  "[IMMUTABLE_EVENTS]",
  "[APPEND_ONLY]",
  "[NO_PERSISTENCE]",
  "[NO_ANALYTICS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_ENGINE_EVENT_TYPE_KEYS = Object.freeze([
  "DECISION_CREATED",
  "DECISION_UPDATED",
  "DECISION_APPROVED",
  "DECISION_REJECTED",
  "DECISION_CANCELLED",
  "DECISION_SUPERSEDED",
  "DECISION_EXECUTED",
  "DECISION_COMPLETED",
  "DECISION_ARCHIVED",
] as const);

export const DECISION_ENGINE_LIFECYCLE_KEYS = Object.freeze([
  "proposed",
  "evaluated",
  "approved",
  "rejected",
  "cancelled",
  "superseded",
  "executed",
  "completed",
  "archived",
] as const);

export const DECISION_EVENT_MANDATORY_IDENTITY_FIELDS = Object.freeze([
  "eventId",
  "decisionId",
  "timelineEntryId",
  "workspaceId",
  "timestamp",
  "version",
  "createdBy",
] as const);

export const DECISION_EVENT_MANDATORY_FIELDS = Object.freeze([
  "eventId",
  "decisionId",
  "timelineEntryId",
  "workspaceId",
  "eventType",
  "lifecycle",
  "timestamp",
  "createdBy",
  "platformVersion",
  "title",
  "summary",
  "sourceModule",
  "sequenceNumber",
  "identity",
  "version",
  "metadata",
  "extensions",
] as const);

export const DECISION_EVENT_TYPE_LIFECYCLE_MAP = Object.freeze({
  DECISION_CREATED: "proposed",
  DECISION_UPDATED: "evaluated",
  DECISION_APPROVED: "approved",
  DECISION_REJECTED: "rejected",
  DECISION_CANCELLED: "cancelled",
  DECISION_SUPERSEDED: "superseded",
  DECISION_EXECUTED: "executed",
  DECISION_COMPLETED: "completed",
  DECISION_ARCHIVED: "archived",
} as const satisfies Readonly<Record<DecisionEngineEventType, DecisionEngineLifecycle>>);

export const DECISION_ENGINE_TO_FOUNDATION_EVENT_TYPE_MAP = Object.freeze({
  DECISION_CREATED: "decision_created",
  DECISION_UPDATED: "decision_updated",
  DECISION_APPROVED: "decision_committed",
  DECISION_REJECTED: "decision_revoked",
  DECISION_CANCELLED: "decision_deferred",
  DECISION_SUPERSEDED: "decision_superseded",
  DECISION_EXECUTED: "custom",
  DECISION_COMPLETED: "custom",
  DECISION_ARCHIVED: "metadata_annotation",
} as const);

export const DECISION_EVENT_ENGINE_LIMITS = Object.freeze({
  maxMetadataKeys: 32,
  maxExtensionKeys: 16,
  maxMetadataValueLength: 512,
  maxExtensionValueLength: 512,
  maxCreatedByLength: 128,
  maxPublishedEvents: 10_000,
  maxReferences: 16,
  maxTags: 32,
} as const);

export const DECISION_EVENT_ENGINE_ERROR_CODES = Object.freeze({
  validationFailure: "validation_failure",
  duplicateEvent: "duplicate_event",
  invalidLifecycle: "invalid_lifecycle",
  invalidEventType: "invalid_event_type",
  registryFull: "registry_full",
  engineNotInitialized: "engine_not_initialized",
  workspaceIsolation: "workspace_isolation",
  manifestIncompatible: "manifest_incompatible",
} as const);

export const DECISION_EVENT_ALLOWED_EXTENSION_KEYS = Object.freeze([
  "correlationId",
  "scenarioReferenceId",
  "intentReferenceId",
  "decisionReferenceId",
  "memoryReferenceId",
  "replayExtensionId",
  "analyticsExtensionId",
  "outcomeExtensionId",
  "mlExtensionId",
] as const);

export const DECISION_EVENT_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "DecisionChart",
  "DecisionViewer",
  "ReplayEngine",
  "OutcomeTracker",
  "vectorSearch",
  "semanticSearch",
  "localStorage",
  "indexedDB",
  "axios",
] as const);

export type DecisionEngineEventType = (typeof DECISION_ENGINE_EVENT_TYPE_KEYS)[number];
export type DecisionEngineLifecycle = (typeof DECISION_ENGINE_LIFECYCLE_KEYS)[number];

export type DecisionEngineEventMetadata = Readonly<Record<string, string>>;
export type DecisionEngineEventExtensions = Readonly<Record<string, string>>;

export type DecisionEngineEventVersion = Readonly<{
  semanticVersion: string;
  schemaVersion: string;
  engineVersion: typeof DECISION_EVENT_ENGINE_CONTRACT_VERSION;
  foundationContractVersion: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionEngineEventIdentity = Readonly<{
  eventId: DecisionEventId;
  decisionId: DecisionId;
  timelineEntryId: string;
  workspaceId: DecisionWorkspaceId;
  scenarioId?: string;
  intentId?: string;
  timestamp: string;
  version: DecisionEngineEventVersion;
  createdBy: string;
  readOnly: true;
}>;

export type DecisionEngineEvent = Readonly<{
  eventId: DecisionEventId;
  decisionId: DecisionId;
  timelineEntryId: string;
  workspaceId: DecisionWorkspaceId;
  scenarioId?: string;
  intentId?: string;
  eventType: DecisionEngineEventType;
  lifecycle: DecisionEngineLifecycle;
  timestamp: string;
  createdBy: string;
  platformVersion: typeof DECISION_EVENT_ENGINE_CONTRACT_VERSION;
  title: string;
  summary: string;
  sourceModule: string;
  sequenceNumber: number;
  identity: DecisionEngineEventIdentity;
  version: DecisionEngineEventVersion;
  metadata: DecisionEngineEventMetadata;
  context?: DecisionContext;
  references?: readonly DecisionReference[];
  tags?: readonly DecisionTag[];
  extensions: DecisionEngineEventExtensions;
  readOnly: true;
}>;

export type CreateDecisionEventInput = Readonly<{
  eventId?: DecisionEventId;
  decisionId: DecisionId;
  timelineEntryId?: string;
  workspaceId: DecisionWorkspaceId;
  scenarioId?: string;
  intentId?: string;
  eventType: DecisionEngineEventType;
  lifecycle?: DecisionEngineLifecycle;
  timestamp: string;
  createdBy: string;
  title: string;
  summary: string;
  sourceModule?: string;
  metadata?: DecisionEngineEventMetadata;
  context?: DecisionContext;
  references?: readonly DecisionReference[];
  tags?: readonly DecisionTag[];
  extensions?: DecisionEngineEventExtensions;
}>;

export type DecisionEventTypeRegistration = Readonly<{
  eventType: DecisionEngineEventType;
  lifecycle: DecisionEngineLifecycle;
  label: string;
  description: string;
  readOnly: true;
}>;

export type DecisionEventEngineState = Readonly<{
  engineId: "decision-event-engine";
  contractVersion: typeof DECISION_EVENT_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  publishedEventCount: number;
  registeredEventTypeCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionEventEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type DecisionEventResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: DecisionEventEngineError | null;
  readOnly: true;
}>;

export type DecisionEventRegistrySnapshot = Readonly<{
  registryVersion: string;
  publishedEventCount: number;
  registeredEventTypeCount: number;
  eventIds: readonly DecisionEventId[];
  readOnly: true;
}>;

export type DecisionEventEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionEventCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type DecisionEventCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionEventContractSurface = Readonly<{
  contractVersion: typeof DECISION_EVENT_ENGINE_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  supportedEventTypes: readonly DecisionEngineEventType[];
  supportedLifecycles: readonly DecisionEngineLifecycle[];
  readOnly: true;
}>;

export type NormalizedDecisionEventInput = Readonly<{
  eventId?: DecisionEventId;
  decisionId: DecisionId;
  timelineEntryId?: string;
  workspaceId: DecisionWorkspaceId;
  scenarioId?: string;
  intentId?: string;
  eventType: DecisionEngineEventType;
  lifecycle: DecisionEngineLifecycle;
  timestamp: string;
  createdBy: string;
  title: string;
  summary: string;
  sourceModule: string;
  metadata: DecisionEngineEventMetadata;
  context?: DecisionContext;
  references?: readonly DecisionReference[];
  tags?: readonly DecisionTag[];
  extensions: DecisionEngineEventExtensions;
}>;

export type { DecisionTimelineEntry, DecisionValidationIssue, DecisionValidationResult };

export function createDecisionEventEngineError(
  code: string,
  message: string,
  field?: string
): DecisionEventEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function decisionEventEngineErrorFromCode(
  code: keyof typeof DECISION_EVENT_ENGINE_ERROR_CODES,
  message: string,
  field?: string
): DecisionEventEngineError {
  return createDecisionEventEngineError(DECISION_EVENT_ENGINE_ERROR_CODES[code], message, field);
}

export function buildDecisionEngineEventVersion(): DecisionEngineEventVersion {
  return Object.freeze({
    semanticVersion: DECISION_EVENT_SEMANTIC_VERSION,
    schemaVersion: DECISION_EVENT_SCHEMA_VERSION,
    engineVersion: DECISION_EVENT_ENGINE_CONTRACT_VERSION,
    foundationContractVersion: "APP-6/1" as const,
    readOnly: true as const,
  });
}
