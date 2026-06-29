/**
 * APP-1:3 — Executive Time Camera resolver.
 * Navigation ladder, mode mapping, validation, and future consumer bindings.
 */

import { isValidContext } from "./executiveTimeContextResolver.ts";
import type { ExecutiveTimeContextKey } from "./executiveTimeTypes.ts";
import type {
  ExecutiveTimeCameraConsumerBindings,
  ExecutiveTimeCameraError,
  ExecutiveTimeCameraMode,
  ExecutiveTimeCameraMoveRequest,
  ExecutiveTimeCameraNavigationRequest,
  ExecutiveTimeCameraNavigationReason,
  ExecutiveTimeCameraNavigationSource,
  ExecutiveTimeCameraPosition,
} from "./executiveTimeCameraTypes.ts";
import { EXECUTIVE_TIME_CAMERA_VERSION } from "./executiveTimeCameraTypes.ts";

export const EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER = Object.freeze([
  "now",
  "today",
  "this_week",
  "this_month",
  "this_quarter",
  "this_year",
  "future_projection",
] as const satisfies readonly ExecutiveTimeContextKey[]);

export const EXECUTIVE_TIME_CAMERA_MODES = Object.freeze([
  "follow_now",
  "manual",
  "historical",
  "forecast",
  "comparison",
] as const);

export const EXECUTIVE_TIME_CAMERA_NAVIGATION_SOURCES = Object.freeze([
  "user",
  "assistant",
  "dashboard",
  "scenario",
  "automation",
  "system",
] as const);

export const EXECUTIVE_TIME_CAMERA_NAVIGATION_REASONS = Object.freeze([
  "manual_selection",
  "shortcut",
  "comparison",
  "review",
  "planning",
  "forecast",
  "restore",
  "initialization",
] as const);

export const EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS: ExecutiveTimeCameraConsumerBindings = Object.freeze({
  dashboard: Object.freeze({
    consumerId: "dashboard",
    readOnly: true,
    integrationImplemented: false,
    consumes: "resolveCurrentContext",
  }),
  assistant: Object.freeze({
    consumerId: "assistant",
    readOnly: true,
    integrationImplemented: false,
    consumes: "resolveCurrentContext",
  }),
  timeline: Object.freeze({
    consumerId: "timeline",
    readOnly: true,
    integrationImplemented: false,
    consumes: "resolveCurrentContext",
  }),
  scenario: Object.freeze({
    consumerId: "scenario",
    readOnly: true,
    integrationImplemented: false,
    consumes: "resolveCurrentContext",
  }),
  recommendation: Object.freeze({
    consumerId: "recommendation",
    readOnly: true,
    integrationImplemented: false,
    consumes: "resolveCurrentContext",
  }),
});

function cameraError(code: string, message: string): ExecutiveTimeCameraError {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

export function resolveCameraModeForContext(contextId: ExecutiveTimeContextKey): ExecutiveTimeCameraMode {
  switch (contextId) {
    case "now":
    case "today":
      return "follow_now";
    case "yesterday":
    case "last_week":
    case "last_month":
    case "last_quarter":
    case "last_year":
    case "past_review":
      return "historical";
    case "tomorrow":
    case "next_week":
    case "next_month":
    case "next_quarter":
    case "next_year":
    case "future_projection":
      return "forecast";
    case "custom_range":
      return "comparison";
    default:
      return "manual";
  }
}

export function resolveForwardContext(current: ExecutiveTimeContextKey): ExecutiveTimeContextKey | null {
  const index = (EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER as readonly string[]).indexOf(current);
  if (index < 0) return EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER[0] ?? null;
  return EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER[index + 1] ?? null;
}

export function resolveBackwardContext(current: ExecutiveTimeContextKey): ExecutiveTimeContextKey | null {
  const index = (EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER as readonly string[]).indexOf(current);
  if (index <= 0) return null;
  return EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER[index - 1] ?? null;
}

export function buildExecutiveTimeCameraPosition(input: {
  workspaceId: string;
  currentContext: ExecutiveTimeContextKey;
  previousContext: ExecutiveTimeContextKey | null;
  navigationReason: ExecutiveTimeCameraNavigationReason;
  navigationSource: ExecutiveTimeCameraNavigationSource;
}): ExecutiveTimeCameraPosition {
  return Object.freeze({
    currentContext: input.currentContext,
    previousContext: input.previousContext,
    navigationReason: input.navigationReason,
    navigationSource: input.navigationSource,
    timestamp: nowIso(),
    workspaceId: input.workspaceId.trim(),
    version: EXECUTIVE_TIME_CAMERA_VERSION,
    mode: resolveCameraModeForContext(input.currentContext),
  });
}

export function validateExecutiveTimeCameraNavigationRequest(
  input: ExecutiveTimeCameraNavigationRequest | ExecutiveTimeCameraMoveRequest
): Readonly<{ valid: boolean; error: ExecutiveTimeCameraError | null }> {
  const workspaceId = input.workspaceId?.trim() ?? "";
  if (input.validateWorkspace && !workspaceId) {
    return Object.freeze({
      valid: false,
      error: cameraError("invalid_workspace", "workspaceId is required when validation is enabled."),
    });
  }
  if ("contextId" in input) {
    if (!isValidContext(input.contextId)) {
      return Object.freeze({
        valid: false,
        error: cameraError("invalid_context", `Unknown context id "${input.contextId}".`),
      });
    }
  }
  return Object.freeze({ valid: true, error: null });
}

export function resolveDuplicateNavigationError(
  currentContext: ExecutiveTimeContextKey,
  targetContext: ExecutiveTimeContextKey
): ExecutiveTimeCameraError | null {
  if (currentContext === targetContext) {
    return cameraError(
      "duplicate_navigation",
      `Navigation rejected: context "${targetContext}" is already active.`
    );
  }
  return null;
}
