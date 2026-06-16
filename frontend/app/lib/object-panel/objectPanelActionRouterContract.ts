/**
 * MRP:2:1 — Object Panel → Dashboard Runtime routing contract.
 *
 * Object Panel emits action requests only. Dashboard Runtime owns mode + content.
 */

import type { DashboardMode } from "../dashboard/dashboardModeRuntimeContract.ts";
import type { WorkspaceLaunchRequestResult } from "../dashboard/workspaceLauncher/workspaceLauncherContract.ts";

export type ObjectPanelDashboardAction =
  | "focus"
  | "analyze"
  | "compare"
  | "scenario"
  | "war_room"
  | "advisory";

export const OBJECT_PANEL_DASHBOARD_ACTIONS: readonly ObjectPanelDashboardAction[] = Object.freeze([
  "focus",
  "analyze",
  "compare",
  "scenario",
  "war_room",
  "advisory",
]);

export type ObjectPanelActionPayload = Readonly<{
  objectId: string;
  objectName: string;
  action: ObjectPanelDashboardAction;
  timestamp: number;
}>;

export type ObjectPanelActionRequestInput = Readonly<{
  action: unknown;
  objectId: unknown;
  objectName?: unknown;
  timestamp?: number;
}>;

export type ObjectPanelActionRouteResult = Readonly<{
  success: boolean;
  mode: DashboardMode | null;
  payload: ObjectPanelActionPayload | null;
  action: ObjectPanelDashboardAction | null;
  launch: WorkspaceLaunchRequestResult | null;
  reason: string;
}>;

export const OBJECT_PANEL_FOCUS_LOCK_FIXED_TAG = "[OBJECT_PANEL_FOCUS_LOCK_FIXED]" as const;

export const OBJECT_PANEL_ACTION_EVENT = "nexora:object-panel-action";

const ACTION_SET = new Set<string>(OBJECT_PANEL_DASHBOARD_ACTIONS);
const loggedBrakes = new Set<string>();

const LEGACY_ACTION_TO_DASHBOARD: Readonly<Record<string, ObjectPanelDashboardAction>> = Object.freeze({
  focus_object: "focus",
  focus: "focus",
  analyze: "analyze",
  analyze_object: "analyze",
  compare: "compare",
  compare_scenarios: "compare",
  compare_options: "compare",
  open_strategic_comparison: "compare",
  scenario: "scenario",
  run_scenario: "scenario",
  simulate: "scenario",
  war_room: "war_room",
  open_war_room: "war_room",
  advisory: "advisory",
  explain_object: "advisory",
  next_move: "advisory",
  open_decision_analysis: "advisory",
});

/** Legacy executive-object-action ids that must route to Dashboard Runtime (not SIM/RSK panels). */
export const PRIMARY_LEGACY_DASHBOARD_OBJECT_ACTIONS = Object.freeze([
  "focus_object",
  "compare_scenarios",
  "compare_options",
  "run_scenario",
  "open_war_room",
  "war_room",
  "explain_object",
  "next_move",
  "open_decision_analysis",
] as const);

export function shouldRouteExecutiveActionToDashboard(action: unknown): boolean {
  if (typeof action !== "string") return false;
  const normalized = action.trim().toLowerCase();
  if (isObjectPanelDashboardAction(normalized)) return true;
  return PRIMARY_LEGACY_DASHBOARD_OBJECT_ACTIONS.some((entry) => entry === normalized);
}

export function warnObjectActionRouterBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[ObjectActionRouter][Brake]", { message, ...detail });
}

export function isObjectPanelDashboardAction(value: unknown): value is ObjectPanelDashboardAction {
  return typeof value === "string" && ACTION_SET.has(value.trim().toLowerCase());
}

export function normalizeObjectPanelDashboardAction(value: unknown): ObjectPanelDashboardAction | null {
  if (isObjectPanelDashboardAction(value)) {
    return value.trim().toLowerCase() as ObjectPanelDashboardAction;
  }
  if (typeof value !== "string") return null;
  const mapped = LEGACY_ACTION_TO_DASHBOARD[value.trim().toLowerCase()];
  return mapped ?? null;
}

export function objectPanelDashboardActionLabel(action: ObjectPanelDashboardAction): string {
  switch (action) {
    case "focus":
      return "Focus";
    case "analyze":
      return "Analyze";
    case "compare":
      return "Compare";
    case "scenario":
      return "Scenario";
    case "war_room":
      return "War Room";
    case "advisory":
      return "Advisory";
    default:
      return "Overview";
  }
}

export function buildObjectPanelActionPayload(input: {
  action: ObjectPanelDashboardAction;
  objectId: string;
  objectName?: string;
  timestamp?: number;
}): ObjectPanelActionPayload {
  const objectId = input.objectId.trim();
  const objectName = (input.objectName?.trim() || objectId).slice(0, 240);
  return Object.freeze({
    objectId,
    objectName,
    action: input.action,
    timestamp: input.timestamp ?? Date.now(),
  });
}

export function emitObjectPanelActionRequest(input: {
  action: ObjectPanelDashboardAction;
  objectId: string;
  objectName?: string;
}): ObjectPanelActionPayload | null {
  if (typeof window === "undefined") return null;
  const objectId = String(input.objectId ?? "").trim();
  if (!objectId) {
    warnObjectActionRouterBrake("Missing object.", { action: input.action });
    return null;
  }
  if (!isObjectPanelDashboardAction(input.action)) {
    warnObjectActionRouterBrake("Invalid action.", { action: input.action, objectId });
    return null;
  }
  const payload = buildObjectPanelActionPayload({
    action: input.action,
    objectId,
    objectName: input.objectName,
  });
  window.dispatchEvent(
    new CustomEvent(OBJECT_PANEL_ACTION_EVENT, {
      detail: payload,
    })
  );
  return payload;
}

export function resetObjectPanelActionRouterForTests(): void {
  loggedBrakes.clear();
}
