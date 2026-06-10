/**
 * MRP:7:2 — Assistant Executive Action Card contract.
 *
 * Cards suggest. Bridge transports. Dashboard executes.
 * Assistant owns card rendering only — never runtime state.
 */

import type { DashboardMode } from "../dashboard/dashboardModeRuntimeContract.ts";
import {
  emitAssistantExecutiveActionRequest,
  isAssistantExecutiveActionId,
  isAssistantExecutiveFutureActionId,
  type AssistantExecutiveActionId,
  type AssistantExecutiveActionKind,
} from "../assistant-bridge/assistantDashboardBridgeContract.ts";
import { routeAssistantExecutiveActionRequest } from "../assistant-bridge/assistantDashboardBridgeRuntime.ts";

export type AssistantActionCardId =
  | "focus"
  | "analyze"
  | "compare"
  | "scenario"
  | "war_room"
  | "risk"
  | "timeline"
  | "simulation"
  | "recommendations"
  | "decision_center";

export type AssistantActionCardStatus = "available" | "coming_soon";

export type AssistantActionCardModel = Readonly<{
  id: AssistantActionCardId;
  title: string;
  description: string;
  action: AssistantExecutiveActionKind;
  launchLabel: string;
  status: AssistantActionCardStatus;
  confidenceLabel?: string;
}>;

/** Read-only context — Assistant never owns these values. */
export type AssistantActionCardContext = Readonly<{
  selectedObjectId: string | null;
  selectedObjectName: string | null;
  dashboardMode: DashboardMode;
  dashboardRouteObjectId: string | null;
}>;

export type AssistantActionCardLaunchResult = Readonly<{
  success: boolean;
  message: string;
  action: AssistantExecutiveActionKind | null;
  objectId: string | null;
  reason: string;
}>;

export const ASSISTANT_ACTION_CARD_LAUNCH_ACK_EVENT = "nexora:assistant-action-card-launch-ack";

export type AssistantActionCardLaunchAck = Readonly<{
  success: boolean;
  action: AssistantExecutiveActionKind | null;
  objectId: string | null;
  message: string;
  reason: string;
}>;

const CARD_ACTION_MAP: Readonly<Record<AssistantActionCardId, AssistantExecutiveActionKind>> =
  Object.freeze({
    focus: "FOCUS_OBJECT",
    analyze: "OPEN_ANALYZE",
    compare: "OPEN_COMPARE",
    scenario: "OPEN_SCENARIO",
    war_room: "OPEN_WARROOM",
    risk: "OPEN_RISK",
    timeline: "OPEN_TIMELINE",
    simulation: "OPEN_SIMULATION",
    recommendations: "OPEN_RECOMMENDATIONS",
    decision_center: "OPEN_DECISION_CENTER",
  });

const loggedBrakes = new Set<string>();

export function warnAssistantActionCardBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[AssistantActionCard][Brake]", { message, ...detail });
}

export function resetAssistantActionCardContractForTests(): void {
  loggedBrakes.clear();
}

function resolveTargetObject(context: AssistantActionCardContext): {
  objectId: string | null;
  objectName: string | null;
} {
  const objectId =
    context.dashboardRouteObjectId?.trim() || context.selectedObjectId?.trim() || null;
  const objectName = context.selectedObjectName?.trim() || objectId;
  return { objectId, objectName };
}

function buildCard(
  id: AssistantActionCardId,
  title: string,
  description: string,
  launchLabel: string,
  status: AssistantActionCardStatus,
  confidenceLabel?: string
): AssistantActionCardModel {
  return Object.freeze({
    id,
    title,
    description,
    action: CARD_ACTION_MAP[id],
    launchLabel,
    status,
    confidenceLabel,
  });
}

export function buildDefaultAssistantActionCards(
  context: AssistantActionCardContext
): readonly AssistantActionCardModel[] {
  const { objectName } = resolveTargetObject(context);
  const label = objectName || "Selected Object";
  const short = objectName ? label : "Object";

  return Object.freeze([
    buildCard(
      "focus",
      `Focus on ${short}`,
      "Open the executive object context surface for the current selection.",
      "Launch Focus Workspace",
      "available"
    ),
    buildCard(
      "analyze",
      `Analyze ${short}`,
      "Investigate operational impact, dependencies, and intelligence modules.",
      "Launch Analyze Workspace",
      "available",
      objectName ? "Context ready" : undefined
    ),
    buildCard(
      "compare",
      "Compare Alternatives",
      "Prepare a comparison workspace for strategic option evaluation.",
      "Launch Compare Workspace",
      "available"
    ),
    buildCard(
      "scenario",
      "Create Scenario",
      "Open the scenario workspace to explore possible futures and outcomes.",
      "Launch Scenario Workspace",
      "available"
    ),
    buildCard(
      "war_room",
      "Open War Room",
      "Convene the executive war room workspace for high-impact decisions.",
      "Launch War Room Workspace",
      "available"
    ),
    buildCard(
      "risk",
      "Risk Assessment",
      "Evaluate strategic and operational risk posture.",
      "Launch Risk Workspace",
      "coming_soon"
    ),
    buildCard(
      "timeline",
      "Timeline Review",
      "Review decision timeline and operational events.",
      "Launch Timeline Workspace",
      "coming_soon"
    ),
    buildCard(
      "simulation",
      "Run Simulation",
      "Explore simulated outcomes and system responses.",
      "Launch Simulation Workspace",
      "coming_soon"
    ),
    buildCard(
      "recommendations",
      "Recommendations",
      "Review executive recommendations and guidance layers.",
      "Launch Recommendation Center",
      "coming_soon"
    ),
    buildCard(
      "decision_center",
      "Decision Center",
      "Open the executive decision review center.",
      "Launch Decision Center",
      "coming_soon"
    ),
  ]);
}

export function buildRecommendedAssistantActionCards(
  context: AssistantActionCardContext
): readonly AssistantActionCardModel[] {
  return buildDefaultAssistantActionCards(context).filter((card) => card.status === "available");
}

export function validateAssistantActionCardLaunch(input: {
  card: AssistantActionCardModel;
  context: AssistantActionCardContext;
}): AssistantActionCardLaunchResult {
  const { card, context } = input;

  if (card.status === "coming_soon") {
    warnAssistantActionCardBrake("Route unavailable.", { cardId: card.id, action: card.action });
    return Object.freeze({
      success: false,
      message: "Route not ready.",
      action: card.action,
      objectId: null,
      reason: "route_unavailable",
    });
  }

  if (isAssistantExecutiveFutureActionId(card.action)) {
    warnAssistantActionCardBrake("Unauthorized launch.", { action: card.action });
    return Object.freeze({
      success: false,
      message: "Route not ready.",
      action: card.action,
      objectId: null,
      reason: "unauthorized_launch",
    });
  }

  if (!isAssistantExecutiveActionId(card.action)) {
    warnAssistantActionCardBrake("Invalid action type.", { action: card.action });
    return Object.freeze({
      success: false,
      message: "Workspace unavailable.",
      action: card.action,
      objectId: null,
      reason: "invalid_action_type",
    });
  }

  const { objectId, objectName } = resolveTargetObject(context);
  if (!objectId) {
    warnAssistantActionCardBrake("Invalid target object.", { cardId: card.id });
    return Object.freeze({
      success: false,
      message: "Object not available.",
      action: card.action,
      objectId: null,
      reason: "missing_target_object",
    });
  }

  const routePreview = routeAssistantExecutiveActionRequest({
    action: card.action,
    objectId,
    objectName: objectName ?? objectId,
  });

  if (!routePreview.success) {
    warnAssistantActionCardBrake("Route unavailable.", {
      action: card.action,
      reason: routePreview.reason,
    });
    const message =
      routePreview.reason === "missing_object"
        ? "Object not available."
        : "Workspace unavailable.";
    return Object.freeze({
      success: false,
      message,
      action: card.action,
      objectId,
      reason: routePreview.reason,
    });
  }

  return Object.freeze({
    success: true,
    message: "Launch request submitted.",
    action: card.action,
    objectId,
    reason: "validated",
  });
}

/**
 * Card launch — emits bridge request only. Does not modify dashboard/scene/selection directly.
 */
export function launchAssistantActionCard(input: {
  card: AssistantActionCardModel;
  context: AssistantActionCardContext;
  requestId?: string;
}): AssistantActionCardLaunchResult {
  const validation = validateAssistantActionCardLaunch(input);
  if (!validation.success || !validation.objectId || !validation.action) {
    return validation;
  }

  if (!isAssistantExecutiveActionId(validation.action)) {
    warnAssistantActionCardBrake("Unauthorized launch.", { action: validation.action });
    return Object.freeze({
      success: false,
      message: "Route not ready.",
      action: validation.action,
      objectId: validation.objectId,
      reason: "unauthorized_launch",
    });
  }

  if (typeof window === "undefined") {
    warnAssistantActionCardBrake("Missing bridge.", { action: validation.action });
    return Object.freeze({
      success: false,
      message: "Workspace unavailable.",
      action: validation.action,
      objectId: validation.objectId,
      reason: "missing_bridge",
    });
  }

  const payload = emitAssistantExecutiveActionRequest({
    action: validation.action as AssistantExecutiveActionId,
    objectId: validation.objectId,
    objectName: input.context.selectedObjectName ?? validation.objectId,
    requestId: input.requestId,
  });

  if (!payload) {
    warnAssistantActionCardBrake("Missing bridge.", { action: validation.action });
    return Object.freeze({
      success: false,
      message: "Workspace unavailable.",
      action: validation.action,
      objectId: validation.objectId,
      reason: "bridge_emit_failed",
    });
  }

  return Object.freeze({
    success: true,
    message: "Launch request submitted.",
    action: validation.action,
    objectId: validation.objectId,
    reason: "bridge_dispatched",
  });
}

export function emitAssistantActionCardLaunchAck(detail: AssistantActionCardLaunchAck): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(ASSISTANT_ACTION_CARD_LAUNCH_ACK_EVENT, {
      detail,
    })
  );
}
