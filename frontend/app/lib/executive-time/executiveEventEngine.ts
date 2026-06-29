/**
 * APP-1:7 — Executive Time Event Engine.
 * Sole authority for canonical Executive Event creation and registration.
 */

import { getExecutiveTimeCameraPosition } from "./executiveTimeCameraEngine.ts";
import { resolveCurrentContext } from "./executiveTimeContextEngine.ts";
import { validateExecutiveEventRequest } from "./executiveEventAuthority.ts";
import type { ExecutiveEventPublishRequest } from "./executiveEventAuthorityTypes.ts";
import { classifyExecutiveEvent } from "./executiveEventClassification.ts";
import type {
  ExecutiveEventCameraSnapshot,
  ExecutiveEventContextSnapshot,
  ExecutiveEventCreationResult,
  ExecutiveEventEngineFutureIntegrations,
  ExecutiveEventRecord,
} from "./executiveEventEngineTypes.ts";
import {
  EXECUTIVE_EVENT_ENGINE_OWNER,
  EXECUTIVE_EVENT_ENGINE_VERSION,
} from "./executiveEventEngineTypes.ts";
import { createExecutiveEventLifecycleMetadata } from "./executiveEventLifecycle.ts";
import {
  generateExecutiveEventId,
  registerEvent,
} from "./executiveEventRegistry.ts";
import {
  resolveEntityHistory,
  resolveEvent,
  resolveEventHistory,
  resolveEvents,
  resolveLatestEvent,
  resolveWorkspaceHistory,
} from "./executiveEventResolver.ts";
import { evaluatePriority } from "./executiveTimePriorityEngine.ts";
import { resolveExecutiveTimeStateTemporalSnapshot } from "./executiveTimeStateEngine.ts";
import { getExecutiveTimeEntityCurrentState } from "./executiveTimeStateMutation.ts";

export const EXECUTIVE_EVENT_ENGINE_FUTURE_INTEGRATIONS: ExecutiveEventEngineFutureIntegrations = Object.freeze({
  timeline: Object.freeze({ moduleId: "timeline", consumerOnly: true, integrationImplemented: false }),
  executiveMemory: Object.freeze({ moduleId: "executive_memory", consumerOnly: true, integrationImplemented: false }),
  dashboard: Object.freeze({ moduleId: "dashboard", consumerOnly: true, integrationImplemented: false }),
  assistant: Object.freeze({ moduleId: "assistant", consumerOnly: true, integrationImplemented: false }),
  recommendation: Object.freeze({ moduleId: "recommendation", consumerOnly: true, integrationImplemented: false }),
  scenario: Object.freeze({ moduleId: "scenario", publisherCapable: true, integrationImplemented: false }),
  audit: Object.freeze({ moduleId: "audit", consumerOnly: true, integrationImplemented: false }),
  ds: Object.freeze({ moduleId: "ds", publisherCapable: true, integrationImplemented: false }),
  int: Object.freeze({ moduleId: "int", publisherCapable: true, integrationImplemented: false }),
  lay: Object.freeze({ moduleId: "lay", publisherCapable: true, integrationImplemented: false }),
});

function buildContextSnapshot(workspaceId: string): ExecutiveEventContextSnapshot {
  const context = resolveCurrentContext({ workspaceId });
  return Object.freeze({
    contextId: context.id,
    category: context.category,
    lens: context.lens,
    readOnly: true,
  });
}

function buildCameraSnapshot(workspaceId: string): ExecutiveEventCameraSnapshot {
  const camera = getExecutiveTimeCameraPosition(workspaceId);
  return Object.freeze({
    currentContext: camera?.currentContext ?? resolveCurrentContext({ workspaceId }).id,
    mode: camera?.mode ?? "manual",
    navigationReason: camera?.navigationReason ?? "initialization",
    readOnly: true,
  });
}

export function createExecutiveEvent(request: ExecutiveEventPublishRequest): ExecutiveEventCreationResult {
  let lifecycleState = createExecutiveEventLifecycleMetadata("created").currentState;

  const validation = validateExecutiveEventRequest(request);
  if (!validation.valid || !validation.normalizedRequest) {
    return Object.freeze({
      success: false,
      reason: validation.messages[0] ?? "Event request rejected.",
      event: null,
      lifecycleState: null,
    });
  }
  lifecycleState = "validated";

  const normalized = validation.normalizedRequest;
  const workspaceId = normalized.workspaceId;
  const contextSnapshot = buildContextSnapshot(workspaceId);
  const cameraSnapshot = buildCameraSnapshot(workspaceId);
  const temporal = resolveExecutiveTimeStateTemporalSnapshot({ workspaceId });

  const currentState =
    getExecutiveTimeEntityCurrentState({
      workspaceId,
      entityType: normalized.entityType,
      entityId: normalized.entityId,
      fallbackState: "draft",
    }) ?? "draft";

  const stateSnapshot = Object.freeze({
    entityType: normalized.entityType,
    entityId: normalized.entityId,
    currentState,
    readOnly: true as const,
  });

  const priorityResult = evaluatePriority({
    workspaceId,
    entityId: normalized.entityId,
    entityType: normalized.entityType,
    currentState,
    actor: normalized.actor,
    reason: normalized.reason,
  });

  const prioritySnapshot = Object.freeze({
    priority: priorityResult.priority,
    confidence: priorityResult.confidence,
    escalationLevel: priorityResult.escalationLevel,
    readOnly: true as const,
  });

  lifecycleState = "classified";
  const classification = classifyExecutiveEvent({
    entityType: normalized.entityType,
    category: normalized.category,
    eventType: normalized.eventType,
  });

  lifecycleState = "registered";
  const eventId = generateExecutiveEventId(workspaceId);
  const draftEvent: ExecutiveEventRecord = Object.freeze({
    id: eventId,
    eventType: normalized.eventType,
    category: normalized.category,
    classificationKey: classification.key,
    sourceModule: normalized.sourceModule,
    sourceComponent: normalized.sourceComponent,
    entityType: normalized.entityType,
    entityId: normalized.entityId,
    workspaceId,
    contextSnapshot,
    cameraSnapshot,
    stateSnapshot,
    prioritySnapshot,
    lifecycleState: "published",
    timestamp: normalized.timestamp,
    metadata: Object.freeze({
      engineVersion: EXECUTIVE_EVENT_ENGINE_VERSION,
      engineOwner: EXECUTIVE_EVENT_ENGINE_OWNER,
      actor: normalized.actor,
      reason: normalized.reason,
      temporalContextId: temporal.currentContextId,
      classificationLabel: classification.label,
      lifecycleCompleted: createExecutiveEventLifecycleMetadata("published").completedStates,
      ...(normalized.metadata ?? {}),
    }),
  });

  const registered = registerEvent(draftEvent);

  return Object.freeze({
    success: true,
    reason: "Executive event created and registered.",
    event: registered,
    lifecycleState: "published",
  });
}

export const ExecutiveEventEngine = Object.freeze({
  createExecutiveEvent,
  resolveEvent,
  resolveEvents,
  resolveLatestEvent,
  resolveEventHistory,
  resolveEntityHistory,
  resolveWorkspaceHistory,
});

export {
  EXECUTIVE_EVENT_ENGINE_VERSION,
  resolveEntityHistory,
  resolveEvent,
  resolveEventHistory,
  resolveEvents,
  resolveLatestEvent,
  resolveWorkspaceHistory,
};

export type { ExecutiveEventCreationResult, ExecutiveEventRecord };
