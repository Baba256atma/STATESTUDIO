/**
 * APP-1:9 — Executive Time Platform Gateway.
 * Validates consumer access and routes exclusively through ExecutiveTimePlatform.
 */

import type { ExecutiveEventPublishRequest } from "./executiveEventAuthorityTypes.ts";
import type { ExecutivePredictionRequest } from "./executivePredictionAuthorityTypes.ts";
import { ExecutiveTimePlatform } from "./executiveTimePlatformApi.ts";
import type { ExecutiveTimeCameraMoveRequest } from "./executiveTimeCameraTypes.ts";
import type { ExecutiveTimeContextKey, ExecutiveTimeWorkspaceId } from "./executiveTimeTypes.ts";
import type { ExecutiveTimePriorityEvaluationRequest } from "./executiveTimePriorityAuthorityTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";
import type { ExecutiveTimeApprovedTransitionInput } from "./executiveTimeTransitionAuthorityTypes.ts";
import type { ExecutiveTimeTransitionEvaluationRequest } from "./executiveTimeTransitionResolver.ts";
import type { ExecutiveTimeConsumerId } from "./executiveTimeConsumerRegistry.ts";
import {
  validateApiAccess,
  type ExecutiveTimePlatformPublicOperation,
} from "./executiveTimeIntegrationResolver.ts";

export type ExecutiveTimeGatewayAccessContext = Readonly<{
  consumerId: ExecutiveTimeConsumerId;
  importPath?: string;
}>;

export type ExecutiveTimeGatewayResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
}>;

function assertGatewayAccess(
  context: ExecutiveTimeGatewayAccessContext,
  operation: ExecutiveTimePlatformPublicOperation
): Readonly<{ permitted: boolean; reason: string }> {
  const access = validateApiAccess({
    consumerId: context.consumerId,
    operation,
    importPath: context.importPath,
  });
  return Object.freeze({ permitted: access.permitted, reason: access.reason });
}

function wrapGatewayCall<T>(
  context: ExecutiveTimeGatewayAccessContext,
  operation: ExecutiveTimePlatformPublicOperation,
  execute: () => T
): ExecutiveTimeGatewayResult<T> {
  const access = assertGatewayAccess(context, operation);
  if (!access.permitted) {
    return Object.freeze({ success: false, reason: access.reason, data: null });
  }
  const data = execute();
  return Object.freeze({
    success: true,
    reason: "Request routed through Executive Time Platform Gateway.",
    data,
  });
}

export const ExecutiveTimePlatformGateway = Object.freeze({
  getCurrentContext(
    context: ExecutiveTimeGatewayAccessContext,
    input: { workspaceId: ExecutiveTimeWorkspaceId; anchorDate?: string }
  ) {
    return wrapGatewayCall(context, "getCurrentContext", () => ExecutiveTimePlatform.getCurrentContext(input));
  },

  switchContext(
    context: ExecutiveTimeGatewayAccessContext,
    input: { workspaceId: ExecutiveTimeWorkspaceId; contextId: ExecutiveTimeContextKey }
  ) {
    return wrapGatewayCall(context, "switchContext", () => ExecutiveTimePlatform.switchContext(input));
  },

  getCamera(context: ExecutiveTimeGatewayAccessContext, workspaceId: ExecutiveTimeWorkspaceId) {
    return wrapGatewayCall(context, "getCamera", () => ExecutiveTimePlatform.getCamera(workspaceId));
  },

  moveCamera(context: ExecutiveTimeGatewayAccessContext, input: ExecutiveTimeCameraMoveRequest) {
    return wrapGatewayCall(context, "moveCamera", () => ExecutiveTimePlatform.moveCamera(input));
  },

  getState(
    context: ExecutiveTimeGatewayAccessContext,
    input: {
      workspaceId: string;
      entityType: ExecutiveTimeEntityType;
      entityId: string;
      fallbackState?: string;
    }
  ) {
    return wrapGatewayCall(context, "getState", () => ExecutiveTimePlatform.getState(input));
  },

  applyApprovedTransition(
    context: ExecutiveTimeGatewayAccessContext,
    input: ExecutiveTimeApprovedTransitionInput
  ) {
    return wrapGatewayCall(context, "applyApprovedTransition", () =>
      ExecutiveTimePlatform.applyApprovedTransition(input)
    );
  },

  evaluateTransition(
    context: ExecutiveTimeGatewayAccessContext,
    input: ExecutiveTimeTransitionEvaluationRequest
  ) {
    return wrapGatewayCall(context, "evaluateTransition", () => ExecutiveTimePlatform.evaluateTransition(input));
  },

  evaluatePriority(
    context: ExecutiveTimeGatewayAccessContext,
    request: ExecutiveTimePriorityEvaluationRequest
  ) {
    return wrapGatewayCall(context, "evaluatePriority", () => ExecutiveTimePlatform.evaluatePriority(request));
  },

  createExecutiveEvent(context: ExecutiveTimeGatewayAccessContext, request: ExecutiveEventPublishRequest) {
    return wrapGatewayCall(context, "createExecutiveEvent", () => ExecutiveTimePlatform.createExecutiveEvent(request));
  },

  resolveEvent(context: ExecutiveTimeGatewayAccessContext, eventId: string) {
    return wrapGatewayCall(context, "resolveEvent", () => ExecutiveTimePlatform.resolveEvent(eventId));
  },

  generatePrediction(context: ExecutiveTimeGatewayAccessContext, request: ExecutivePredictionRequest) {
    return wrapGatewayCall(context, "generatePrediction", () => ExecutiveTimePlatform.generatePrediction(request));
  },

  detectConflict(context: ExecutiveTimeGatewayAccessContext, request: ExecutivePredictionRequest) {
    return wrapGatewayCall(context, "detectConflict", () => ExecutiveTimePlatform.detectConflict(request));
  },
});

export type ExecutiveTimePlatformGatewayFacade = typeof ExecutiveTimePlatformGateway;
