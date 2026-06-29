/**
 * APP-1:8.5 — Executive Time Platform Facade.
 * ExecutiveTimePlatform is the sole public object for APP-1 consumers.
 */

import type { ExecutiveEventPublishRequest } from "./executiveEventAuthorityTypes.ts";
import type { ExecutivePredictionRequest } from "./executivePredictionAuthorityTypes.ts";
import type { ExecutiveTimeCameraMoveRequest } from "./executiveTimeCameraTypes.ts";
import type { ExecutiveTimeContextKey, ExecutiveTimeWorkspaceId } from "./executiveTimeTypes.ts";
import type { ExecutiveTimePriorityEvaluationRequest } from "./executiveTimePriorityAuthorityTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";
import type { ExecutiveTimeApprovedTransitionInput } from "./executiveTimeTransitionAuthorityTypes.ts";
import type { ExecutiveTimeTransitionEvaluationRequest } from "./executiveTimeTransitionResolver.ts";
import {
  routeApplyApprovedTransition,
  routeCreateExecutiveEvent,
  routeDetectConflict,
  routeEvaluatePriority,
  routeEvaluateTransition,
  routeGeneratePrediction,
  routeGetCamera,
  routeGetCurrentContext,
  routeGetState,
  routeMoveCamera,
  routeResolveEvent,
  routeSwitchContext,
} from "./executiveTimePlatformResolver.ts";

export const ExecutiveTimePlatform = Object.freeze({
  getCurrentContext(input: { workspaceId: ExecutiveTimeWorkspaceId; anchorDate?: string }) {
    return routeGetCurrentContext(input);
  },

  switchContext(input: { workspaceId: ExecutiveTimeWorkspaceId; contextId: ExecutiveTimeContextKey }) {
    return routeSwitchContext(input);
  },

  moveCamera(input: ExecutiveTimeCameraMoveRequest) {
    return routeMoveCamera(input);
  },

  getCamera(workspaceId: ExecutiveTimeWorkspaceId) {
    return routeGetCamera(workspaceId);
  },

  getState(input: {
    workspaceId: string;
    entityType: ExecutiveTimeEntityType;
    entityId: string;
    fallbackState?: string;
  }) {
    return routeGetState(input);
  },

  applyApprovedTransition(input: ExecutiveTimeApprovedTransitionInput) {
    return routeApplyApprovedTransition(input);
  },

  evaluateTransition(input: ExecutiveTimeTransitionEvaluationRequest) {
    return routeEvaluateTransition(input);
  },

  evaluatePriority(request: ExecutiveTimePriorityEvaluationRequest) {
    return routeEvaluatePriority(request);
  },

  createExecutiveEvent(request: ExecutiveEventPublishRequest) {
    return routeCreateExecutiveEvent(request);
  },

  resolveEvent(eventId: string) {
    return routeResolveEvent(eventId);
  },

  generatePrediction(request: ExecutivePredictionRequest) {
    return routeGeneratePrediction(request);
  },

  detectConflict(request: ExecutivePredictionRequest) {
    return routeDetectConflict(request);
  },
});

export type ExecutiveTimePlatformFacade = typeof ExecutiveTimePlatform;
