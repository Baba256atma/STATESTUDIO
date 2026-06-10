/**
 * MRP:6:1 — War Room Mode runtime contract.
 *
 * War Room is a Dashboard mode — not a separate panel, router, or runtime authority.
 * Workspace is presentation only. No engines, simulation, or recommendation execution.
 */

import type { ExecutiveObjectPanelData } from "../../panels/executiveObjectPanelData.ts";
import {
  resolveFocusObjectId,
  type FocusModeContextInput,
} from "../focus/focusModeContract.ts";

export type WarRoomModeContextInput = FocusModeContextInput;

export type WarRoomWorkspaceStatus = "ready" | "limited";

export type WarRoomModuleSlot = Readonly<{
  id: string;
  label: string;
  status: "coming_soon";
}>;

/** Future card extension points — placeholders only, no business logic. */
export type WarRoomFutureCardSlot = Readonly<{
  id: string;
  label: string;
}>;

export type WarRoomWorkspaceContextView = Readonly<{
  objectId: string;
  objectName: string;
  warRoomStatus: WarRoomWorkspaceStatus;
  warRoomStatusLabel: string;
  situationSummaryMessage: string;
  modules: readonly WarRoomModuleSlot[];
  futureCardSlots: readonly WarRoomFutureCardSlot[];
}>;

export type WarRoomModeContextResult = Readonly<{
  context: WarRoomWorkspaceContextView | null;
  objectId: string | null;
  reason:
    | "resolved"
    | "missing_object"
    | "invalid_war_room_context"
    | "missing_war_room_contract";
}>;

export const WAR_ROOM_SITUATION_EMPTY_MESSAGE = "No active war room session.";

export const WAR_ROOM_SITUATION_FUTURE_MESSAGE =
  "Future intelligence modules will appear here.";

export const WAR_ROOM_WORKSPACE_MODULES: readonly WarRoomModuleSlot[] = Object.freeze([
  { id: "situation", label: "Situation Assessment", status: "coming_soon" },
  { id: "strategic_risks", label: "Strategic Risks", status: "coming_soon" },
  { id: "priorities", label: "Executive Priorities", status: "coming_soon" },
  { id: "scenario_intelligence", label: "Scenario Intelligence", status: "coming_soon" },
  { id: "recommendations", label: "Recommendation Center", status: "coming_soon" },
  { id: "actions", label: "Action Center", status: "coming_soon" },
  { id: "decision_review", label: "Decision Review", status: "coming_soon" },
]);

export const WAR_ROOM_FUTURE_CARD_SLOTS: readonly WarRoomFutureCardSlot[] = Object.freeze([
  { id: "situation_cards", label: "Situation Cards" },
  { id: "risk_cards", label: "Risk Cards" },
  { id: "decision_cards", label: "Decision Cards" },
  { id: "recommendation_cards", label: "Recommendation Cards" },
  { id: "scenario_cards", label: "Scenario Cards" },
  { id: "timeline_cards", label: "Timeline Cards" },
]);

const loggedBrakes = new Set<string>();

export function warnWarRoomModeBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[WarRoomMode][Brake]", { message, ...detail });
}

export function resetWarRoomModeContractForTests(): void {
  loggedBrakes.clear();
}

function statusLabel(status: WarRoomWorkspaceStatus): string {
  return status === "ready" ? "Ready" : "Limited";
}

function buildWorkspaceContext(
  objectId: string,
  objectName: string,
  warRoomStatus: WarRoomWorkspaceStatus
): WarRoomWorkspaceContextView {
  return Object.freeze({
    objectId,
    objectName,
    warRoomStatus,
    warRoomStatusLabel: statusLabel(warRoomStatus),
    situationSummaryMessage: WAR_ROOM_SITUATION_EMPTY_MESSAGE,
    modules: WAR_ROOM_WORKSPACE_MODULES,
    futureCardSlots: WAR_ROOM_FUTURE_CARD_SLOTS,
  });
}

function isValidPanelData(panelData: ExecutiveObjectPanelData | null, objectId: string): boolean {
  return Boolean(panelData?.objectId?.trim() && panelData.objectId === objectId);
}

export function resolveWarRoomModeContext(input: WarRoomModeContextInput): WarRoomModeContextResult {
  const objectId = resolveFocusObjectId(input);
  if (!objectId) {
    warnWarRoomModeBrake("Missing object.");
    return Object.freeze({
      context: null,
      objectId: null,
      reason: "missing_object",
    });
  }

  if (!WAR_ROOM_WORKSPACE_MODULES.length) {
    warnWarRoomModeBrake("Missing war room contract.");
    return Object.freeze({
      context: null,
      objectId,
      reason: "missing_war_room_contract",
    });
  }

  const objectName = input.routeObjectName?.trim() || input.panelData?.objectName?.trim() || objectId;
  const panelData = input.panelData;

  if (!panelData || !isValidPanelData(panelData, objectId)) {
    warnWarRoomModeBrake("Invalid war room context.", { objectId });
    return Object.freeze({
      context: buildWorkspaceContext(objectId, objectName, "limited"),
      objectId,
      reason: "invalid_war_room_context",
    });
  }

  if (!panelData.objectId.trim()) {
    warnWarRoomModeBrake("Invalid war room context.", { objectId });
    return Object.freeze({
      context: buildWorkspaceContext(objectId, objectName, "limited"),
      objectId,
      reason: "invalid_war_room_context",
    });
  }

  return Object.freeze({
    context: buildWorkspaceContext(
      objectId,
      panelData.objectName?.trim() || objectName,
      "ready"
    ),
    objectId,
    reason: "resolved",
  });
}
