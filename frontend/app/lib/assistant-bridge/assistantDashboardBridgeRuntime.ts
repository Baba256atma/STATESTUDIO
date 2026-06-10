/**
 * MRP:7:1 — Assistant → Dashboard bridge runtime.
 *
 * Validates assistant action requests. Dashboard consumer executes via Object Panel router.
 */

import { normalizeDashboardMode } from "../dashboard/dashboardModeRuntimeContract.ts";
import {
  buildAssistantExecutiveActionPayload,
  isAssistantExecutiveActionId,
  isAssistantExecutiveFutureActionId,
  mapAssistantActionToDashboardMode,
  mapAssistantActionToObjectPanelAction,
  normalizeAssistantExecutiveActionKind,
  warnAssistantBridgeBrake,
  type AssistantExecutiveActionRequestInput,
  type AssistantExecutiveActionRouteResult,
} from "./assistantDashboardBridgeContract.ts";

export function validateAssistantExecutiveActionRequest(
  input: AssistantExecutiveActionRequestInput
): AssistantExecutiveActionRouteResult {
  const normalizedAction = normalizeAssistantExecutiveActionKind(input.action);
  if (!normalizedAction) {
    warnAssistantBridgeBrake("Invalid action.", { action: input.action ?? null });
    return Object.freeze({
      success: false,
      mode: null,
      objectPanelAction: null,
      payload: null,
      objectPanelInput: null,
      reason: "invalid_action",
    });
  }

  if (isAssistantExecutiveFutureActionId(normalizedAction)) {
    warnAssistantBridgeBrake("Unauthorized execution request.", { action: normalizedAction });
    return Object.freeze({
      success: false,
      mode: null,
      objectPanelAction: null,
      payload: null,
      objectPanelInput: null,
      reason: "unauthorized_future_action",
    });
  }

  if (!isAssistantExecutiveActionId(normalizedAction)) {
    warnAssistantBridgeBrake("Invalid bridge contract.", { action: normalizedAction });
    return Object.freeze({
      success: false,
      mode: null,
      objectPanelAction: null,
      payload: null,
      objectPanelInput: null,
      reason: "invalid_bridge_contract",
    });
  }

  const objectId = typeof input.objectId === "string" ? input.objectId.trim() : "";
  if (!objectId) {
    warnAssistantBridgeBrake("Missing object.", { action: normalizedAction });
    return Object.freeze({
      success: false,
      mode: null,
      objectPanelAction: null,
      payload: null,
      objectPanelInput: null,
      reason: "missing_object",
    });
  }

  const objectName =
    (typeof input.objectName === "string" && input.objectName.trim()) || objectId;
  const objectPanelAction = mapAssistantActionToObjectPanelAction(normalizedAction);
  const mode = normalizeDashboardMode(mapAssistantActionToDashboardMode(normalizedAction), {
    warn: false,
  });

  const payload = buildAssistantExecutiveActionPayload({
    action: normalizedAction,
    objectId,
    objectName,
    timestamp: input.timestamp,
    requestId: typeof input.requestId === "string" ? input.requestId : undefined,
  });

  const objectPanelInput = Object.freeze({
    action: objectPanelAction,
    objectId,
    objectName,
    timestamp: payload.timestamp,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[AssistantBridge][Validate]", {
      action: normalizedAction,
      objectId,
      mode,
      objectPanelAction,
    });
  }

  return Object.freeze({
    success: true,
    mode,
    objectPanelAction,
    payload,
    objectPanelInput,
    reason: "assistant_to_dashboard_mode",
  });
}

export function routeAssistantExecutiveActionRequest(
  input: AssistantExecutiveActionRequestInput
): AssistantExecutiveActionRouteResult {
  return validateAssistantExecutiveActionRequest(input);
}
