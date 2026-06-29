/**
 * APP-1:6.5 — Executive Event Authority Contract.
 * Canonical event definition and validation — no processing, persistence, or replay.
 */

import type {
  ExecutiveEvent,
  ExecutiveEventFutureModuleContracts,
  ExecutiveEventOwnershipRules,
  ExecutiveEventPublishRequest,
  ExecutiveEventPublishResult,
  ExecutiveEventReadOnlyDependencies,
  ExecutiveEventValidationResult,
} from "./executiveEventAuthorityTypes.ts";
import {
  EXECUTIVE_EVENT_AUTHORITY_OWNER,
  EXECUTIVE_EVENT_AUTHORITY_VERSION,
  ExecutiveEventProcessingDeferredError,
} from "./executiveEventAuthorityTypes.ts";
import {
  EXECUTIVE_EVENT_PUBLISHER_RULES,
  validateExecutiveEventPublisherRequest,
} from "./executiveEventPublisherContract.ts";
import { validateExecutiveEventConsumerInput } from "./executiveEventConsumerContract.ts";

export const EXECUTIVE_EVENT_TYPES = Object.freeze([
  "state_change",
  "transition",
  "priority_change",
  "context_shift",
  "camera_move",
  "lifecycle",
  "audit",
  "manual",
  "system",
] as const);

export const EXECUTIVE_EVENT_CATEGORIES = Object.freeze([
  "scenario",
  "decision",
  "kpi",
  "risk",
  "object",
  "relationship",
  "data_source",
  "dashboard",
  "assistant",
  "temporal",
  "platform",
] as const);

export const EXECUTIVE_EVENT_OWNERSHIP_RULES: ExecutiveEventOwnershipRules = Object.freeze({
  authorityOwns: Object.freeze(["canonical_event_definition", "event_identity", "event_validation", "event_normalization"]),
  publisherOwns: Object.freeze(["request_generation"]),
  consumerOwns: Object.freeze(["read_only_consumption"]),
});

export const EXECUTIVE_EVENT_READONLY_DEPENDENCIES: ExecutiveEventReadOnlyDependencies = Object.freeze({
  context: Object.freeze({
    moduleId: "executive-time-context-engine",
    operations: Object.freeze(["resolveCurrentContext"]),
    mutationPermitted: false,
  }),
  camera: Object.freeze({
    moduleId: "executive-time-camera-engine",
    operations: Object.freeze(["getExecutiveTimeCameraPosition"]),
    mutationPermitted: false,
  }),
  state: Object.freeze({
    moduleId: "executive-time-state-engine",
    operations: Object.freeze(["resolveExecutiveTimeStateTemporalSnapshot", "getExecutiveTimeEntityCurrentState"]),
    mutationPermitted: false,
  }),
  transition: Object.freeze({
    moduleId: "executive-time-transition-engine",
    operations: Object.freeze(["evaluateTransition", "orchestrateTransition"]),
    mutationPermitted: false,
  }),
  priority: Object.freeze({
    moduleId: "executive-time-priority-engine",
    operations: Object.freeze(["evaluatePriority"]),
    mutationPermitted: false,
  }),
});

export const EXECUTIVE_EVENT_FUTURE_MODULE_CONTRACTS: ExecutiveEventFutureModuleContracts = Object.freeze({
  timeline: Object.freeze({ moduleId: "timeline", consumerOnly: true, integrationImplemented: false }),
  executiveMemory: Object.freeze({ moduleId: "executive_memory", consumerOnly: true, integrationImplemented: false }),
  dashboard: Object.freeze({ moduleId: "dashboard", consumerOnly: true, integrationImplemented: false }),
  assistant: Object.freeze({ moduleId: "assistant", consumerOnly: true, integrationImplemented: false }),
  recommendation: Object.freeze({ moduleId: "recommendation", consumerOnly: true, integrationImplemented: false }),
  scenario: Object.freeze({ moduleId: "scenario", publisherCapable: true, integrationImplemented: false }),
  audit: Object.freeze({ moduleId: "audit", consumerOnly: true, integrationImplemented: false }),
  lay: Object.freeze({ moduleId: "lay", publisherCapable: true, integrationImplemented: false }),
  ds: Object.freeze({ moduleId: "ds", publisherCapable: true, integrationImplemented: false }),
  int: Object.freeze({ moduleId: "int", publisherCapable: true, integrationImplemented: false }),
});

function normalizeRequest(request: ExecutiveEventPublishRequest): ExecutiveEventPublishRequest {
  return Object.freeze({
    eventType: request.eventType,
    category: request.category,
    sourceModule: request.sourceModule.trim(),
    sourceComponent: request.sourceComponent.trim(),
    entityType: request.entityType,
    entityId: request.entityId.trim(),
    workspaceId: request.workspaceId.trim(),
    timestamp: request.timestamp.trim(),
    actor: request.actor.trim(),
    reason: request.reason.trim(),
    metadata: Object.freeze(request.metadata ?? {}),
  });
}

export function validateExecutiveEventRequest(
  request: ExecutiveEventPublishRequest
): ExecutiveEventValidationResult {
  const publisherValidation = validateExecutiveEventPublisherRequest(request);
  const messages = [...publisherValidation.messages];
  if (!EXECUTIVE_EVENT_TYPES.includes(request.eventType)) {
    messages.push(`Unknown eventType "${request.eventType}".`);
  }
  if (!EXECUTIVE_EVENT_CATEGORIES.includes(request.category)) {
    messages.push(`Unknown category "${request.category}".`);
  }
  const valid = messages.length === 0;
  return Object.freeze({
    valid,
    messages: Object.freeze(messages),
    normalizedRequest: valid ? normalizeRequest(request) : null,
  });
}

/** Builds immutable canonical event template for contract verification — not published. */
export function buildExecutiveEventContract(input: {
  id: string;
  eventType: ExecutiveEvent["eventType"];
  category: ExecutiveEvent["category"];
  sourceModule: string;
  sourceComponent: string;
  entityType: ExecutiveEvent["entityType"];
  entityId: string;
  workspaceId: string;
  timestamp: string;
  timeContext: ExecutiveEvent["timeContext"];
  cameraContext: ExecutiveEvent["cameraContext"];
  stateSnapshot: ExecutiveEvent["stateSnapshot"];
  prioritySnapshot: ExecutiveEvent["prioritySnapshot"];
  metadata?: Readonly<Record<string, unknown>>;
}): ExecutiveEvent {
  const event = Object.freeze({
    id: input.id.trim(),
    eventType: input.eventType,
    category: input.category,
    sourceModule: input.sourceModule.trim(),
    sourceComponent: input.sourceComponent.trim(),
    entityType: input.entityType,
    entityId: input.entityId.trim(),
    workspaceId: input.workspaceId.trim(),
    timestamp: input.timestamp.trim(),
    timeContext: input.timeContext,
    cameraContext: input.cameraContext,
    stateSnapshot: Object.freeze({ ...input.stateSnapshot, readOnly: true as const }),
    prioritySnapshot: Object.freeze({ ...input.prioritySnapshot, readOnly: true as const }),
    metadata: Object.freeze({
      contractOnly: true,
      authorityOwner: EXECUTIVE_EVENT_AUTHORITY_OWNER,
      authorityVersion: EXECUTIVE_EVENT_AUTHORITY_VERSION,
      ...(input.metadata ?? {}),
    }),
  });
  const consumerValidation = validateExecutiveEventConsumerInput(event);
  if (!consumerValidation.valid) {
    throw new Error(consumerValidation.messages[0] ?? "Invalid executive event contract.");
  }
  return event;
}

export function publishExecutiveEvent(request: ExecutiveEventPublishRequest): ExecutiveEventPublishResult {
  const validation = validateExecutiveEventRequest(request);
  const normalized = validation.normalizedRequest ?? request;
  if (!validation.valid) {
    return Object.freeze({
      accepted: false,
      rejected: true,
      reason: validation.messages[0] ?? "Event request rejected.",
      request: normalized,
      event: null,
      publisherMayStore: false,
      publisherMayReplay: false,
    });
  }
  throw new ExecutiveEventProcessingDeferredError();
}

export const ExecutiveEventAuthority = Object.freeze({
  validateExecutiveEventRequest,
  buildExecutiveEventContract,
  publishExecutiveEvent,
});

export { EXECUTIVE_EVENT_PUBLISHER_RULES };
