/**
 * APP-1:6.5 — Executive Event Authority types.
 * Canonical temporal event contract — no processing, persistence, or replay.
 */

import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeContextKey } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";
import type { ExecutiveTimePriorityLevel } from "./executiveTimePriorityAuthorityTypes.ts";

export const EXECUTIVE_EVENT_AUTHORITY_VERSION = "APP-1/6.5" as const;

export const EXECUTIVE_EVENT_AUTHORITY_OWNER = "executive-event-authority" as const;

export const EXECUTIVE_EVENT_PUBLISHER_OWNER = "executive-event-publisher" as const;

export const EXECUTIVE_EVENT_CONSUMER_OWNER = "executive-event-consumer" as const;

export type ExecutiveEventType =
  | "state_change"
  | "transition"
  | "priority_change"
  | "context_shift"
  | "camera_move"
  | "lifecycle"
  | "audit"
  | "manual"
  | "system";

export type ExecutiveEventCategory =
  | "scenario"
  | "decision"
  | "kpi"
  | "risk"
  | "object"
  | "relationship"
  | "data_source"
  | "dashboard"
  | "assistant"
  | "temporal"
  | "platform";

export type ExecutiveEventStateSnapshot = Readonly<{
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  currentState: string;
  readOnly: true;
}>;

export type ExecutiveEventPrioritySnapshot = Readonly<{
  priority: ExecutiveTimePriorityLevel;
  confidence: number;
  escalationLevel: string;
  readOnly: true;
}>;

export type ExecutiveEvent = Readonly<{
  id: string;
  eventType: ExecutiveEventType;
  category: ExecutiveEventCategory;
  sourceModule: string;
  sourceComponent: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  workspaceId: string;
  timestamp: string;
  timeContext: ExecutiveTimeContextKey;
  cameraContext: ExecutiveTimeContextKey | string;
  stateSnapshot: ExecutiveEventStateSnapshot;
  prioritySnapshot: ExecutiveEventPrioritySnapshot;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveEventPublishRequest = Readonly<{
  eventType: ExecutiveEventType;
  category: ExecutiveEventCategory;
  sourceModule: string;
  sourceComponent: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  workspaceId: string;
  timestamp: string;
  actor: string;
  reason: string;
  metadata?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveEventValidationResult = Readonly<{
  valid: boolean;
  messages: readonly string[];
  normalizedRequest: ExecutiveEventPublishRequest | null;
}>;

export type ExecutiveEventPublishResult = Readonly<{
  accepted: boolean;
  rejected: boolean;
  reason: string;
  request: ExecutiveEventPublishRequest;
  event: ExecutiveEvent | null;
  publisherMayStore: false;
  publisherMayReplay: false;
}>;

export type ExecutiveEventOwnershipRules = Readonly<{
  authorityOwns: readonly string[];
  publisherOwns: readonly string[];
  consumerOwns: readonly string[];
}>;

export type ExecutiveEventReadOnlyDependency = Readonly<{
  moduleId: string;
  operations: readonly string[];
  mutationPermitted: false;
}>;

export type ExecutiveEventReadOnlyDependencies = Readonly<{
  context: ExecutiveEventReadOnlyDependency;
  camera: ExecutiveEventReadOnlyDependency;
  state: ExecutiveEventReadOnlyDependency;
  transition: ExecutiveEventReadOnlyDependency;
  priority: ExecutiveEventReadOnlyDependency;
}>;

export type ExecutiveEventFutureModuleContracts = Readonly<{
  timeline: Readonly<{ moduleId: "timeline"; consumerOnly: true; integrationImplemented: false }>;
  executiveMemory: Readonly<{ moduleId: "executive_memory"; consumerOnly: true; integrationImplemented: false }>;
  dashboard: Readonly<{ moduleId: "dashboard"; consumerOnly: true; integrationImplemented: false }>;
  assistant: Readonly<{ moduleId: "assistant"; consumerOnly: true; integrationImplemented: false }>;
  recommendation: Readonly<{ moduleId: "recommendation"; consumerOnly: true; integrationImplemented: false }>;
  scenario: Readonly<{ moduleId: "scenario"; publisherCapable: true; integrationImplemented: false }>;
  audit: Readonly<{ moduleId: "audit"; consumerOnly: true; integrationImplemented: false }>;
  lay: Readonly<{ moduleId: "lay"; publisherCapable: true; integrationImplemented: false }>;
  ds: Readonly<{ moduleId: "ds"; publisherCapable: true; integrationImplemented: false }>;
  int: Readonly<{ moduleId: "int"; publisherCapable: true; integrationImplemented: false }>;
}>;

export type ExecutiveEventAuthorityCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ExecutiveTimeCertificationCheck[];
  passedChecks: readonly ExecutiveTimeCertificationCheck[];
  failedChecks: readonly ExecutiveTimeCertificationCheck[];
  warnings: readonly string[];
  tags: readonly string[];
  summary: string;
  generatedAt: string;
}>;

export class ExecutiveEventProcessingDeferredError extends Error {
  readonly code = "EVENT_PROCESSING_DEFERRED_TO_APP_1_7" as const;

  constructor() {
    super("Executive event publishing is deferred to APP-1:7 Event Engine.");
    this.name = "ExecutiveEventProcessingDeferredError";
  }
}
