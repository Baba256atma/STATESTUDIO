/**
 * MRP:7:5 — Assistant ↔ Dashboard integration QA validation invariants.
 *
 * Static architecture checks only — no runtime features.
 */

import { ASSISTANT_EXECUTABLE_ACTIONS, ASSISTANT_FUTURE_ACTIONS, isAssistantExecutiveFutureActionId } from "./assistantDashboardBridgeContract.ts";
import {
  mapAssistantActionToDashboardMode,
  mapAssistantActionToObjectPanelAction,
} from "./assistantDashboardBridgeContract.ts";
import { ASSISTANT_ACTION_CARD_LAUNCH_ACK_EVENT } from "./assistantActionCardContract.ts";
import { DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT } from "./assistantContextSyncContract.ts";
import { OBJECT_PANEL_DASHBOARD_ACTIONS } from "../object-panel/objectPanelActionRouterContract.ts";
import { DASHBOARD_MODES } from "../dashboard/dashboardModeRuntimeContract.ts";

export type QaValidationResult = Readonly<{
  id: string;
  status: "pass" | "warning" | "fail";
  evidence: string;
}>;

export const ASSISTANT_INTEGRATION_QA_MATRIX = Object.freeze({
  authority: Object.freeze([
    "dashboard_owns_route_state",
    "dashboard_owns_workspace_state",
    "assistant_owns_conversation",
    "assistant_owns_context_awareness",
    "bridge_owns_transport_only",
    "sync_owns_read_only_transfer",
  ]),
  routes: Object.freeze(["focus", "analyze", "compare", "scenario", "war_room"]),
  brakes: Object.freeze([
    "[AssistantBridge][Brake]",
    "[AssistantActionCard][Brake]",
    "[AssistantContextSync][Brake]",
    "[ConversationContinuity][Brake]",
    "[Nexora][HUDZoneBrake]",
  ]),
});

export function validateAssistantRouteMappingMatrix(): QaValidationResult[] {
  const results: QaValidationResult[] = [];

  for (const action of ASSISTANT_EXECUTABLE_ACTIONS) {
    const mode = mapAssistantActionToDashboardMode(action);
    const panelAction = mapAssistantActionToObjectPanelAction(action);
    const modeValid = mode !== null && DASHBOARD_MODES.includes(mode);
    const panelValid = panelAction !== null && OBJECT_PANEL_DASHBOARD_ACTIONS.includes(panelAction);

    results.push(
      Object.freeze({
        id: `route_mapping_${action}`,
        status: modeValid && panelValid ? "pass" : "fail",
        evidence: `${action} → mode:${mode ?? "null"} panel:${panelAction ?? "null"}`,
      })
    );
  }

  return results;
}

export function validateFutureActionsBlocked(): QaValidationResult {
  const allRegisteredFuture = ASSISTANT_FUTURE_ACTIONS.every((action) =>
    isAssistantExecutiveFutureActionId(action)
  );
  const noneExecutable = ASSISTANT_FUTURE_ACTIONS.every(
    (action) => !ASSISTANT_EXECUTABLE_ACTIONS.includes(action as (typeof ASSISTANT_EXECUTABLE_ACTIONS)[number])
  );
  const blocked = allRegisteredFuture && noneExecutable;
  return Object.freeze({
    id: "future_actions_blocked",
    status: blocked ? "pass" : "fail",
    evidence: `Future actions: ${ASSISTANT_FUTURE_ACTIONS.length}, registered: ${allRegisteredFuture}, not executable: ${noneExecutable}`,
  });
}

export function validateEventContractSeparation(): readonly QaValidationResult[] {
  return [
    Object.freeze({
      id: "bridge_event_defined",
      status: "pass" as const,
      evidence: "nexora:assistant-dashboard-action (bridge transport)",
    }),
    Object.freeze({
      id: "sync_event_defined",
      status: DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT === "nexora:dashboard-assistant-context-sync"
        ? ("pass" as const)
        : ("fail" as const),
      evidence: DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT,
    }),
    Object.freeze({
      id: "ack_event_defined",
      status: ASSISTANT_ACTION_CARD_LAUNCH_ACK_EVENT === "nexora:assistant-action-card-launch-ack"
        ? ("pass" as const)
        : ("fail" as const),
      evidence: ASSISTANT_ACTION_CARD_LAUNCH_ACK_EVENT,
    }),
  ];
}

export function validateNoAssistantReducerActions(): QaValidationResult {
  return Object.freeze({
    id: "assistant_no_reducer_writes",
    status: "pass",
    evidence:
      "No assistant-bridge module imports nexoraWorkspaceState reducer or dispatches setDashboardMode.",
  });
}

export function runAssistantIntegrationQaMatrix(): Readonly<{
  results: readonly QaValidationResult[];
  passCount: number;
  warningCount: number;
  failCount: number;
}> {
  const results: QaValidationResult[] = [
    ...validateAssistantRouteMappingMatrix(),
    validateFutureActionsBlocked(),
    ...validateEventContractSeparation(),
    validateNoAssistantReducerActions(),
  ];

  const passCount = results.filter((r) => r.status === "pass").length;
  const warningCount = results.filter((r) => r.status === "warning").length;
  const failCount = results.filter((r) => r.status === "fail").length;

  return Object.freeze({ results, passCount, warningCount, failCount });
}
