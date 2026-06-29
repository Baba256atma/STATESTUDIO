/**
 * APP-7:2 — Business Event Engine domain types.
 * Extends APP-7:1 foundation types — does not redefine them.
 */

import type { BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./businessTimelineConstants.ts";
import type {
  BusinessEventCategory,
  BusinessEventId,
  BusinessEventImportance,
  BusinessEventMetadata,
  BusinessEventSource,
  BusinessEventStatus,
  BusinessEventType,
  BusinessTag,
  BusinessValidationIssue,
  BusinessValidationResult,
  BusinessWorkspaceId,
} from "./businessTimelineTypes.ts";

export const BUSINESS_EVENT_ENGINE_CONTRACT_VERSION = "APP-7/2" as const;
export const BUSINESS_EVENT_ENGINE_ARCHITECTURE_VERSION = "APP-7/2-event-engine-arch" as const;

export const BUSINESS_EVENT_ENGINE_TAGS = Object.freeze([
  "[APP7_2]",
  "[BUSINESS_EVENT_ENGINE]",
  "[IMMUTABLE_EVENTS]",
  "[APPEND_ONLY]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const BUSINESS_EVENT_ENGINE_MANDATORY_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "title",
  "description",
  "category",
  "type",
  "importance",
  "status",
  "source",
  "createdAt",
  "occurredAt",
  "createdBy",
  "tags",
  "metadata",
  "contractVersion",
  "revisionVersion",
] as const);

export const BUSINESS_EVENT_UPDATABLE_FIELDS = Object.freeze([
  "title",
  "description",
  "importance",
  "status",
  "tags",
  "metadata",
] as const);

export const BUSINESS_EVENT_IMMUTABLE_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "occurredAt",
  "createdAt",
  "createdBy",
  "source",
  "category",
  "type",
] as const);

export const BUSINESS_EVENT_ENGINE_LIMITS = Object.freeze({
  maxPublishedEvents: 10_000,
  maxTagsPerEvent: 32,
  maxTagLength: 64,
  maxTitleLength: 256,
  maxDescriptionLength: 4096,
  maxMetadataKeys: 32,
  maxMetadataValueLength: 512,
  maxCreatedByLength: 128,
} as const);

export const BUSINESS_EVENT_ENGINE_ERROR_CODES = Object.freeze({
  validationFailure: "validation_failure",
  duplicateEvent: "duplicate_event",
  registryFull: "registry_full",
  engineNotInitialized: "engine_not_initialized",
  workspaceIsolation: "workspace_isolation",
  eventNotFound: "event_not_found",
  forbiddenMutation: "forbidden_mutation",
  foundationIncompatible: "foundation_incompatible",
} as const);

export const BUSINESS_EVENT_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "scenario-timeline/",
  "decision-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "BusinessChart",
  "TimelineRenderer",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export type BusinessEngineEvent = Readonly<{
  id: BusinessEventId;
  workspaceId: BusinessWorkspaceId;
  title: string;
  description: string;
  category: BusinessEventCategory;
  type: BusinessEventType;
  importance: BusinessEventImportance;
  status: BusinessEventStatus;
  source: BusinessEventSource;
  createdAt: string;
  occurredAt: string;
  createdBy: string;
  tags: readonly BusinessTag[];
  metadata: BusinessEventMetadata;
  contractVersion: typeof BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION;
  revisionVersion: number;
  archived: boolean;
  readOnly: true;
}>;

export type CreateBusinessEventInput = Readonly<{
  id?: BusinessEventId;
  workspaceId: BusinessWorkspaceId;
  title: string;
  description: string;
  category: BusinessEventCategory;
  type: BusinessEventType;
  importance: BusinessEventImportance;
  status: BusinessEventStatus;
  source: BusinessEventSource;
  createdAt: string;
  occurredAt: string;
  createdBy: string;
  tags?: readonly BusinessTag[];
  metadata?: Readonly<Record<string, string>>;
}>;

export type NormalizedBusinessEventInput = Readonly<{
  id?: BusinessEventId;
  workspaceId: BusinessWorkspaceId;
  title: string;
  description: string;
  category: BusinessEventCategory;
  type: BusinessEventType;
  importance: BusinessEventImportance;
  status: BusinessEventStatus;
  source: BusinessEventSource;
  createdAt: string;
  occurredAt: string;
  createdBy: string;
  tags: readonly BusinessTag[];
  metadata: BusinessEventMetadata;
}>;

export type UpdateBusinessEventMetadataInput = Readonly<{
  id: BusinessEventId;
  workspaceId: BusinessWorkspaceId;
  title?: string;
  description?: string;
  importance?: BusinessEventImportance;
  status?: BusinessEventStatus;
  tags?: readonly BusinessTag[];
  metadata?: Readonly<Record<string, string>>;
}>;

export type BusinessEventFilter = Readonly<{
  workspaceId: BusinessWorkspaceId;
  category?: BusinessEventCategory;
  type?: BusinessEventType;
  importance?: BusinessEventImportance;
  status?: BusinessEventStatus;
  source?: BusinessEventSource;
  tags?: readonly BusinessTag[];
  occurredAtFrom?: string;
  occurredAtTo?: string;
  includeArchived?: boolean;
}>;

export type BusinessEventEngineState = Readonly<{
  engineId: "business-event-engine";
  contractVersion: typeof BUSINESS_EVENT_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  publishedEventCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type BusinessEventEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type BusinessEventResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: BusinessEventEngineError | null;
  readOnly: true;
}>;

export type BusinessEventRegistrySnapshot = Readonly<{
  registryVersion: string;
  publishedEventCount: number;
  eventIds: readonly BusinessEventId[];
  readOnly: true;
}>;

export type BusinessEventCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessEventEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly BusinessEventCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export function createBusinessEventEngineError(
  code: string,
  message: string,
  field?: string
): BusinessEventEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function businessEventEngineErrorFromCode(
  code: keyof typeof BUSINESS_EVENT_ENGINE_ERROR_CODES,
  message: string,
  field?: string
): BusinessEventEngineError {
  return createBusinessEventEngineError(BUSINESS_EVENT_ENGINE_ERROR_CODES[code], message, field);
}

export type { BusinessValidationIssue, BusinessValidationResult };
