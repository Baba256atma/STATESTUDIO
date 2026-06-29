/**
 * APP-1:8.5 — Executive Time Platform Resolver.
 * Internal routing and delegation — not for direct consumer import.
 */

import { detectConflict as detectConflictInternal, detectConflicts } from "./executiveConflictEngine.ts";
import { createExecutiveEvent } from "./executiveEventEngine.ts";
import type { ExecutiveEventPublishRequest } from "./executiveEventAuthorityTypes.ts";
import { resolveEvent } from "./executiveEventResolver.ts";
import { generatePrediction } from "./executivePredictionEngine.ts";
import type { ExecutivePredictionRequest } from "./executivePredictionAuthorityTypes.ts";
import type { ExecutiveConflictResult } from "./executivePredictionEngineTypes.ts";
import { validateExecutivePredictionRequest } from "./executivePredictionAuthority.ts";
import {
  getExecutiveTimeCameraPosition,
  moveToContext,
} from "./executiveTimeCameraEngine.ts";
import type {
  ExecutiveTimeCameraMoveRequest,
  ExecutiveTimeCameraNavigationResult,
  ExecutiveTimeCameraPosition,
} from "./executiveTimeCameraTypes.ts";
import { resolveCurrentContext, switchExecutiveTimeContext } from "./executiveTimeContextEngine.ts";
import { EXECUTIVE_TIME_CAMERA_MUTATION_AUTHORITY } from "./executiveTimeContextMutationAuthority.ts";
import type {
  ExecutiveTimeContextKey,
  ExecutiveTimeContextObject,
  ExecutiveTimeContextSwitchResult,
  ExecutiveTimeWorkspaceId,
} from "./executiveTimeTypes.ts";
import { evaluatePriority } from "./executiveTimePriorityEngine.ts";
import type {
  ExecutiveTimePriorityEvaluationRequest,
  ExecutiveTimePriorityResult,
} from "./executiveTimePriorityAuthorityTypes.ts";
import {
  applyApprovedTransition,
  getExecutiveTimeEntityCurrentState,
} from "./executiveTimeStateEngine.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";
import type { ExecutiveTimeApprovedTransitionInput, ExecutiveTimeStateMutationResult } from "./executiveTimeTransitionAuthorityTypes.ts";
import {
  evaluateTransition,
  type ExecutiveTimeTransitionEvaluationRequest,
  type ExecutiveTimeTransitionEvaluationResult,
} from "./executiveTimeTransitionEngine.ts";

export function routeGetCurrentContext(input: {
  workspaceId: ExecutiveTimeWorkspaceId;
  anchorDate?: string;
}): ExecutiveTimeContextObject {
  return resolveCurrentContext(input);
}

export function routeSwitchContext(input: {
  workspaceId: ExecutiveTimeWorkspaceId;
  contextId: ExecutiveTimeContextKey;
}): ExecutiveTimeContextSwitchResult {
  return switchExecutiveTimeContext({
    workspaceId: input.workspaceId,
    contextId: input.contextId,
    mutationAuthority: EXECUTIVE_TIME_CAMERA_MUTATION_AUTHORITY,
  });
}

export function routeMoveCamera(input: ExecutiveTimeCameraMoveRequest): ExecutiveTimeCameraNavigationResult {
  return moveToContext(input);
}

export function routeGetCamera(workspaceId: ExecutiveTimeWorkspaceId): ExecutiveTimeCameraPosition | null {
  return getExecutiveTimeCameraPosition(workspaceId);
}

export function routeGetState(input: {
  workspaceId: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  fallbackState?: string;
}): Readonly<{ currentState: string | null; readOnly: true }> {
  return Object.freeze({
    currentState: getExecutiveTimeEntityCurrentState(input),
    readOnly: true,
  });
}

export function routeApplyApprovedTransition(
  input: ExecutiveTimeApprovedTransitionInput
): ExecutiveTimeStateMutationResult {
  return applyApprovedTransition(input);
}

export function routeEvaluateTransition(
  input: ExecutiveTimeTransitionEvaluationRequest
): ExecutiveTimeTransitionEvaluationResult {
  return evaluateTransition(input);
}

export function routeEvaluatePriority(
  request: ExecutiveTimePriorityEvaluationRequest
): ExecutiveTimePriorityResult {
  return evaluatePriority(request);
}

export function routeCreateExecutiveEvent(request: ExecutiveEventPublishRequest) {
  return createExecutiveEvent(request);
}

export function routeResolveEvent(eventId: string) {
  return resolveEvent(eventId);
}

export function routeGeneratePrediction(request: ExecutivePredictionRequest) {
  return generatePrediction(request);
}

export function routeDetectConflict(request: ExecutivePredictionRequest): ExecutiveConflictResult | null {
  const validation = validateExecutivePredictionRequest(request);
  if (!validation.valid || !validation.normalizedRequest) return null;
  const generated = generatePrediction(validation.normalizedRequest);
  if (!generated.success || !generated.prediction) return null;
  const signals = generated.prediction.metadata.signals;
  if (!signals || typeof signals !== "object") {
    return generated.prediction.conflicts[0] ?? null;
  }
  return detectConflictInternal({
    request: validation.normalizedRequest,
    signals: signals as never,
  });
}

export function routeDetectConflicts(request: ExecutivePredictionRequest): readonly ExecutiveConflictResult[] {
  const validation = validateExecutivePredictionRequest(request);
  if (!validation.valid || !validation.normalizedRequest) return Object.freeze([]);
  const generated = generatePrediction(validation.normalizedRequest);
  if (!generated.success || !generated.prediction) return Object.freeze([]);
  const signals = generated.prediction.metadata.signals;
  if (!signals || typeof signals !== "object") {
    return generated.prediction.conflicts;
  }
  return detectConflicts({
    request: validation.normalizedRequest,
    signals: signals as never,
  });
}

export const ExecutiveTimePlatformResolver = Object.freeze({
  routeGetCurrentContext,
  routeSwitchContext,
  routeMoveCamera,
  routeGetCamera,
  routeGetState,
  routeApplyApprovedTransition,
  routeEvaluateTransition,
  routeEvaluatePriority,
  routeCreateExecutiveEvent,
  routeResolveEvent,
  routeGeneratePrediction,
  routeDetectConflict,
  routeDetectConflicts,
});
