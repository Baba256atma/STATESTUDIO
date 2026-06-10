/**
 * MRP:7:1 — Assistant → Dashboard Executive Action Handoff Contract.
 *
 * Assistant suggests. Dashboard Runtime decides and executes.
 * Bridge owns action transport only — never state.
 */

import type { DashboardMode } from "../dashboard/dashboardModeRuntimeContract.ts";
import type { ObjectPanelDashboardAction } from "../object-panel/objectPanelActionRouterContract.ts";

/** Actions the bridge may route to Dashboard Runtime today. */
export type AssistantExecutiveActionId =
  | "FOCUS_OBJECT"
  | "OPEN_ANALYZE"
  | "OPEN_COMPARE"
  | "OPEN_SCENARIO"
  | "OPEN_WARROOM";

/** Reserved for future prompts — validated but not executable in MRP:7:1. */
export type AssistantExecutiveFutureActionId =
  | "OPEN_RISK"
  | "OPEN_TIMELINE"
  | "OPEN_RECOMMENDATIONS"
  | "OPEN_SIMULATION"
  | "OPEN_DECISION_CENTER";

export type AssistantExecutiveActionKind = AssistantExecutiveActionId | AssistantExecutiveFutureActionId;

export const ASSISTANT_EXECUTABLE_ACTIONS: readonly AssistantExecutiveActionId[] = Object.freeze([
  "FOCUS_OBJECT",
  "OPEN_ANALYZE",
  "OPEN_COMPARE",
  "OPEN_SCENARIO",
  "OPEN_WARROOM",
]);

export const ASSISTANT_FUTURE_ACTIONS: readonly AssistantExecutiveFutureActionId[] = Object.freeze([
  "OPEN_RISK",
  "OPEN_TIMELINE",
  "OPEN_RECOMMENDATIONS",
  "OPEN_SIMULATION",
  "OPEN_DECISION_CENTER",
]);

export type AssistantExecutiveActionPayload = Readonly<{
  action: AssistantExecutiveActionKind;
  objectId: string;
  objectName: string;
  source: "assistant";
  timestamp: number;
  requestId?: string;
}>;

export type AssistantExecutiveActionRequestInput = Readonly<{
  action: unknown;
  objectId?: unknown;
  objectName?: unknown;
  timestamp?: number;
  requestId?: unknown;
}>;

export type AssistantExecutiveActionRouteResult = Readonly<{
  success: boolean;
  mode: DashboardMode | null;
  objectPanelAction: ObjectPanelDashboardAction | null;
  payload: AssistantExecutiveActionPayload | null;
  objectPanelInput: {
    action: ObjectPanelDashboardAction;
    objectId: string;
    objectName: string;
    timestamp: number;
  } | null;
  reason: string;
}>;

export const ASSISTANT_DASHBOARD_ACTION_EVENT = "nexora:assistant-dashboard-action";

const EXECUTABLE_SET = new Set<string>(ASSISTANT_EXECUTABLE_ACTIONS);
const FUTURE_SET = new Set<string>(ASSISTANT_FUTURE_ACTIONS);
const ALL_ACTIONS_SET = new Set<string>([...ASSISTANT_EXECUTABLE_ACTIONS, ...ASSISTANT_FUTURE_ACTIONS]);

const ASSISTANT_ACTION_TO_OBJECT_PANEL: Readonly<Record<string, ObjectPanelDashboardAction>> =
  Object.freeze({
    FOCUS_OBJECT: "focus",
    OPEN_ANALYZE: "analyze",
    OPEN_COMPARE: "compare",
    OPEN_SCENARIO: "scenario",
    OPEN_WARROOM: "war_room",
  });

const ASSISTANT_ACTION_TO_MODE: Readonly<Record<string, DashboardMode>> = Object.freeze({
  FOCUS_OBJECT: "focus",
  OPEN_ANALYZE: "analyze",
  OPEN_COMPARE: "compare",
  OPEN_SCENARIO: "scenario",
  OPEN_WARROOM: "war_room",
});

const loggedBrakes = new Set<string>();

export function warnAssistantBridgeBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[AssistantBridge][Brake]", { message, ...detail });
}

export function resetAssistantDashboardBridgeForTests(): void {
  loggedBrakes.clear();
}

export function isAssistantExecutiveActionId(value: unknown): value is AssistantExecutiveActionId {
  return typeof value === "string" && EXECUTABLE_SET.has(value.trim());
}

export function isAssistantExecutiveFutureActionId(
  value: unknown
): value is AssistantExecutiveFutureActionId {
  return typeof value === "string" && FUTURE_SET.has(value.trim());
}

export function isAssistantExecutiveActionKind(value: unknown): value is AssistantExecutiveActionKind {
  return typeof value === "string" && ALL_ACTIONS_SET.has(value.trim());
}

export function normalizeAssistantExecutiveActionKind(value: unknown): AssistantExecutiveActionKind | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase().replace(/\s+/g, "_");
  if (ALL_ACTIONS_SET.has(normalized)) {
    return normalized as AssistantExecutiveActionKind;
  }
  const aliasMap: Readonly<Record<string, AssistantExecutiveActionKind>> = Object.freeze({
    FOCUS: "FOCUS_OBJECT",
    ANALYZE: "OPEN_ANALYZE",
    ANALYZE_OBJECT: "OPEN_ANALYZE",
    COMPARE: "OPEN_COMPARE",
    SCENARIO: "OPEN_SCENARIO",
    WAR_ROOM: "OPEN_WARROOM",
    OPEN_WAR_ROOM: "OPEN_WARROOM",
  });
  return aliasMap[normalized] ?? null;
}

export function mapAssistantActionToObjectPanelAction(
  action: AssistantExecutiveActionId
): ObjectPanelDashboardAction {
  return ASSISTANT_ACTION_TO_OBJECT_PANEL[action];
}

export function mapAssistantActionToDashboardMode(action: AssistantExecutiveActionId): DashboardMode {
  return ASSISTANT_ACTION_TO_MODE[action];
}

export function buildAssistantExecutiveActionPayload(input: {
  action: AssistantExecutiveActionKind;
  objectId: string;
  objectName?: string;
  timestamp?: number;
  requestId?: string;
}): AssistantExecutiveActionPayload {
  const objectId = input.objectId.trim();
  const objectName = (input.objectName?.trim() || objectId).slice(0, 240);
  return Object.freeze({
    action: input.action,
    objectId,
    objectName,
    source: "assistant",
    timestamp: input.timestamp ?? Date.now(),
    requestId: input.requestId,
  });
}

/**
 * Assistant-side emit only. Does not modify dashboard, scene, or selection state.
 */
export function emitAssistantExecutiveActionRequest(input: {
  action: AssistantExecutiveActionKind | string;
  objectId: string;
  objectName?: string;
  requestId?: string;
}): AssistantExecutiveActionPayload | null {
  if (typeof window === "undefined") return null;

  const normalizedAction = normalizeAssistantExecutiveActionKind(input.action);
  if (!normalizedAction || !isAssistantExecutiveActionKind(normalizedAction)) {
    warnAssistantBridgeBrake("Invalid bridge contract.", { action: input.action });
    return null;
  }

  if (!isAssistantExecutiveActionId(normalizedAction)) {
    warnAssistantBridgeBrake("Unauthorized execution request.", { action: normalizedAction });
    return null;
  }

  const objectId = String(input.objectId ?? "").trim();
  if (!objectId) {
    warnAssistantBridgeBrake("Missing object.", { action: normalizedAction });
    return null;
  }

  const payload = buildAssistantExecutiveActionPayload({
    action: normalizedAction,
    objectId,
    objectName: input.objectName,
    requestId: input.requestId,
  });

  window.dispatchEvent(
    new CustomEvent(ASSISTANT_DASHBOARD_ACTION_EVENT, {
      detail: payload,
    })
  );

  return payload;
}
