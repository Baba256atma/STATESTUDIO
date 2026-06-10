/**
 * MRP:3:1 — Analyze Mode runtime contract.
 *
 * Dashboard is a read-only consumer of object context. Analyze workspace is presentation only.
 * Does not own object selection or dashboard mode.
 */

import type { ExecutiveObjectPanelData } from "../../panels/executiveObjectPanelData.ts";
import {
  resolveFocusObjectId,
  type FocusModeContextInput,
} from "../focus/focusModeContract.ts";

export type AnalyzeModeContextInput = FocusModeContextInput;

export type AnalyzeWorkspaceStatus = "ready" | "limited";

export type AnalyzeModuleSlot = Readonly<{
  id: string;
  label: string;
  status: "coming_soon";
}>;

export type AnalyzeWorkspaceContextView = Readonly<{
  objectId: string;
  objectName: string;
  analysisStatus: AnalyzeWorkspaceStatus;
  analysisStatusLabel: string;
  modules: readonly AnalyzeModuleSlot[];
}>;

export type AnalyzeModeContextResult = Readonly<{
  context: AnalyzeWorkspaceContextView | null;
  objectId: string | null;
  reason:
    | "resolved"
    | "missing_object"
    | "missing_analysis_context"
    | "invalid_workspace_state";
}>;

export const ANALYZE_WORKSPACE_MODULES: readonly AnalyzeModuleSlot[] = Object.freeze([
  { id: "risk", label: "Risk Analysis", status: "coming_soon" },
  { id: "impact", label: "Impact Analysis", status: "coming_soon" },
  { id: "confidence", label: "Confidence Analysis", status: "coming_soon" },
  { id: "dependency", label: "Dependency Analysis", status: "coming_soon" },
  { id: "scenario", label: "Scenario Analysis", status: "coming_soon" },
  { id: "recommendations", label: "Executive Recommendations", status: "coming_soon" },
]);

const loggedBrakes = new Set<string>();

export function warnAnalyzeModeBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[AnalyzeMode][Brake]", { message, ...detail });
}

export function resetAnalyzeModeContractForTests(): void {
  loggedBrakes.clear();
}

function statusLabel(status: AnalyzeWorkspaceStatus): string {
  return status === "ready" ? "Ready" : "Limited";
}

function buildWorkspaceContext(
  objectId: string,
  objectName: string,
  analysisStatus: AnalyzeWorkspaceStatus
): AnalyzeWorkspaceContextView {
  return Object.freeze({
    objectId,
    objectName,
    analysisStatus,
    analysisStatusLabel: statusLabel(analysisStatus),
    modules: ANALYZE_WORKSPACE_MODULES,
  });
}

function isValidPanelData(panelData: ExecutiveObjectPanelData | null, objectId: string): boolean {
  return Boolean(panelData?.objectId?.trim() && panelData.objectId === objectId);
}

export function resolveAnalyzeModeContext(input: AnalyzeModeContextInput): AnalyzeModeContextResult {
  const objectId = resolveFocusObjectId(input);
  if (!objectId) {
    warnAnalyzeModeBrake("Missing object.");
    return Object.freeze({
      context: null,
      objectId: null,
      reason: "missing_object",
    });
  }

  const objectName = input.routeObjectName?.trim() || input.panelData?.objectName?.trim() || objectId;
  const panelData = input.panelData;

  if (!panelData || !isValidPanelData(panelData, objectId)) {
    warnAnalyzeModeBrake("Missing analysis context.", { objectId });
    return Object.freeze({
      context: buildWorkspaceContext(objectId, objectName, "limited"),
      objectId,
      reason: "missing_analysis_context",
    });
  }

  if (!panelData.objectId.trim()) {
    warnAnalyzeModeBrake("Invalid workspace state.", { objectId });
    return Object.freeze({
      context: buildWorkspaceContext(objectId, objectName, "limited"),
      objectId,
      reason: "invalid_workspace_state",
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
