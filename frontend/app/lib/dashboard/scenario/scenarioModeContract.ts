/**
 * MRP:5:1 — Scenario Mode runtime contract.
 *
 * Dashboard is a read-only consumer of object context. Scenario workspace is presentation only.
 * No simulation, forecasting, or decision engines in this phase.
 */

import type { ExecutiveObjectPanelData } from "../../panels/executiveObjectPanelData.ts";
import {
  resolveFocusObjectId,
  type FocusModeContextInput,
} from "../focus/focusModeContract.ts";

export type ScenarioModeContextInput = FocusModeContextInput;

export type ScenarioWorkspaceStatus = "ready" | "limited";

export type ScenarioModuleSlot = Readonly<{
  id: string;
  label: string;
  status: "coming_soon";
}>;

/** Future extension points — not implemented in MRP:5:1. */
export type ScenarioFutureExtensionSlot = Readonly<{
  id: string;
  label: string;
}>;

export type ScenarioWorkspaceContextView = Readonly<{
  objectId: string;
  objectName: string;
  scenarioStatus: ScenarioWorkspaceStatus;
  scenarioStatusLabel: string;
  scenarioCenterMessage: string;
  modules: readonly ScenarioModuleSlot[];
  futureExtensions: readonly ScenarioFutureExtensionSlot[];
}>;

export type ScenarioModeContextResult = Readonly<{
  context: ScenarioWorkspaceContextView | null;
  objectId: string | null;
  reason:
    | "resolved"
    | "missing_object"
    | "invalid_scenario_context"
    | "missing_scenario_contract";
}>;

export const SCENARIO_CENTER_EMPTY_MESSAGE = "No active scenario.";

export const SCENARIO_CENTER_FUTURE_MESSAGE =
  "Future scenario generation modules will appear here.";

export const SCENARIO_WORKSPACE_MODULES: readonly ScenarioModuleSlot[] = Object.freeze([
  { id: "builder", label: "Scenario Builder", status: "coming_soon" },
  { id: "timeline", label: "Scenario Timeline", status: "coming_soon" },
  { id: "impact", label: "Impact Projection", status: "coming_soon" },
  { id: "risk", label: "Risk Projection", status: "coming_soon" },
  { id: "opportunity", label: "Opportunity Projection", status: "coming_soon" },
  { id: "recommendations", label: "Executive Recommendation Layer", status: "coming_soon" },
]);

export const SCENARIO_FUTURE_EXTENSION_SLOTS: readonly ScenarioFutureExtensionSlot[] = Object.freeze([
  { id: "scenario_a", label: "Scenario A" },
  { id: "scenario_b", label: "Scenario B" },
  { id: "scenario_timeline", label: "Scenario Timeline" },
  { id: "scenario_results", label: "Scenario Results" },
  { id: "scenario_comparison", label: "Scenario Comparison" },
  { id: "scenario_recommendation", label: "Scenario Recommendation" },
]);

const loggedBrakes = new Set<string>();

export function warnScenarioModeBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[ScenarioMode][Brake]", { message, ...detail });
}

export function resetScenarioModeContractForTests(): void {
  loggedBrakes.clear();
}

function statusLabel(status: ScenarioWorkspaceStatus): string {
  return status === "ready" ? "Ready" : "Limited";
}

function buildWorkspaceContext(
  objectId: string,
  objectName: string,
  scenarioStatus: ScenarioWorkspaceStatus
): ScenarioWorkspaceContextView {
  return Object.freeze({
    objectId,
    objectName,
    scenarioStatus,
    scenarioStatusLabel: statusLabel(scenarioStatus),
    scenarioCenterMessage: SCENARIO_CENTER_EMPTY_MESSAGE,
    modules: SCENARIO_WORKSPACE_MODULES,
    futureExtensions: SCENARIO_FUTURE_EXTENSION_SLOTS,
  });
}

function isValidPanelData(panelData: ExecutiveObjectPanelData | null, objectId: string): boolean {
  return Boolean(panelData?.objectId?.trim() && panelData.objectId === objectId);
}

export function resolveScenarioModeContext(input: ScenarioModeContextInput): ScenarioModeContextResult {
  const objectId = resolveFocusObjectId(input);
  if (!objectId) {
    warnScenarioModeBrake("Missing object.");
    return Object.freeze({
      context: null,
      objectId: null,
      reason: "missing_object",
    });
  }

  if (!SCENARIO_WORKSPACE_MODULES.length) {
    warnScenarioModeBrake("Missing scenario contract.");
    return Object.freeze({
      context: null,
      objectId,
      reason: "missing_scenario_contract",
    });
  }

  const objectName = input.routeObjectName?.trim() || input.panelData?.objectName?.trim() || objectId;
  const panelData = input.panelData;

  if (!panelData || !isValidPanelData(panelData, objectId)) {
    warnScenarioModeBrake("Invalid scenario context.", { objectId });
    return Object.freeze({
      context: buildWorkspaceContext(objectId, objectName, "limited"),
      objectId,
      reason: "invalid_scenario_context",
    });
  }

  if (!panelData.objectId.trim()) {
    warnScenarioModeBrake("Invalid scenario context.", { objectId });
    return Object.freeze({
      context: buildWorkspaceContext(objectId, objectName, "limited"),
      objectId,
      reason: "invalid_scenario_context",
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
