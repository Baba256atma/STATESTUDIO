/**
 * APP-1:7 — Executive Event Engine types.
 * Canonical registered event record — immutable and frozen.
 */

import type {
  ExecutiveEventCategory,
  ExecutiveEventPrioritySnapshot,
  ExecutiveEventStateSnapshot,
  ExecutiveEventType,
} from "./executiveEventAuthorityTypes.ts";
import type { ExecutiveEventLifecycleState } from "./executiveEventLifecycle.ts";
import type { ExecutiveEventClassificationKey } from "./executiveEventClassification.ts";
import type { ExecutiveTimeContextKey } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_EVENT_ENGINE_VERSION = "APP-1/7" as const;

export const EXECUTIVE_EVENT_ENGINE_OWNER = "executive-event-engine" as const;

export const EXECUTIVE_EVENT_REGISTRY_OWNER = "executive-event-registry" as const;

export type ExecutiveEventContextSnapshot = Readonly<{
  contextId: ExecutiveTimeContextKey;
  category: string;
  lens: string;
  readOnly: true;
}>;

export type ExecutiveEventCameraSnapshot = Readonly<{
  currentContext: string;
  mode: string;
  navigationReason: string;
  readOnly: true;
}>;

export type ExecutiveEventRecord = Readonly<{
  id: string;
  eventType: ExecutiveEventType;
  category: ExecutiveEventCategory;
  classificationKey: ExecutiveEventClassificationKey;
  sourceModule: string;
  sourceComponent: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  workspaceId: string;
  contextSnapshot: ExecutiveEventContextSnapshot;
  cameraSnapshot: ExecutiveEventCameraSnapshot;
  stateSnapshot: ExecutiveEventStateSnapshot;
  prioritySnapshot: ExecutiveEventPrioritySnapshot;
  lifecycleState: ExecutiveEventLifecycleState;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveEventCreationResult = Readonly<{
  success: boolean;
  reason: string;
  event: ExecutiveEventRecord | null;
  lifecycleState: ExecutiveEventLifecycleState | null;
}>;

export type ExecutiveEventRegistryValidationResult = Readonly<{
  valid: boolean;
  messages: readonly string[];
}>;

export type ExecutiveEventEngineFutureIntegrations = Readonly<{
  timeline: Readonly<{ moduleId: "timeline"; consumerOnly: true; integrationImplemented: false }>;
  executiveMemory: Readonly<{ moduleId: "executive_memory"; consumerOnly: true; integrationImplemented: false }>;
  dashboard: Readonly<{ moduleId: "dashboard"; consumerOnly: true; integrationImplemented: false }>;
  assistant: Readonly<{ moduleId: "assistant"; consumerOnly: true; integrationImplemented: false }>;
  recommendation: Readonly<{ moduleId: "recommendation"; consumerOnly: true; integrationImplemented: false }>;
  scenario: Readonly<{ moduleId: "scenario"; publisherCapable: true; integrationImplemented: false }>;
  audit: Readonly<{ moduleId: "audit"; consumerOnly: true; integrationImplemented: false }>;
  ds: Readonly<{ moduleId: "ds"; publisherCapable: true; integrationImplemented: false }>;
  int: Readonly<{ moduleId: "int"; publisherCapable: true; integrationImplemented: false }>;
  lay: Readonly<{ moduleId: "lay"; publisherCapable: true; integrationImplemented: false }>;
}>;

export type ExecutiveEventEngineCertificationResult = Readonly<{
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
