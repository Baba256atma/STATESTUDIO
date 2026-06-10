/**
 * MRP:4:1 — Compare Mode runtime contract.
 *
 * Dashboard is a read-only consumer of object context. Compare workspace is presentation only.
 * Phase 1: primary object only; target is a placeholder until future prompts add selection.
 */

import type { ExecutiveObjectPanelData } from "../../panels/executiveObjectPanelData.ts";
import {
  resolveFocusObjectId,
  type FocusModeContextInput,
} from "../focus/focusModeContract.ts";

export type CompareModeContextInput = FocusModeContextInput;

export type CompareReadinessStatus = "waiting_for_target" | "limited";

export type CompareModuleSlot = Readonly<{
  id: string;
  label: string;
  status: "coming_soon";
}>;

export type CompareWorkspaceContextView = Readonly<{
  primaryObjectId: string;
  primaryObjectName: string;
  targetObjectId: string | null;
  targetObjectName: string;
  comparisonStatus: CompareReadinessStatus;
  comparisonStatusLabel: string;
  modules: readonly CompareModuleSlot[];
}>;

export type CompareModeContextResult = Readonly<{
  context: CompareWorkspaceContextView | null;
  primaryObjectId: string | null;
  reason:
    | "resolved"
    | "missing_object"
    | "invalid_comparison_context"
    | "missing_comparison_contract";
}>;

export const COMPARE_TARGET_PLACEHOLDER_LABEL = "Not Selected";

export const COMPARE_WORKSPACE_MODULES: readonly CompareModuleSlot[] = Object.freeze([
  { id: "impact", label: "Impact Comparison", status: "coming_soon" },
  { id: "risk", label: "Risk Comparison", status: "coming_soon" },
  { id: "confidence", label: "Confidence Comparison", status: "coming_soon" },
  { id: "scenario", label: "Scenario Comparison", status: "coming_soon" },
]);

const loggedBrakes = new Set<string>();

export function warnCompareModeBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[CompareMode][Brake]", { message, ...detail });
}

export function resetCompareModeContractForTests(): void {
  loggedBrakes.clear();
}

function statusLabel(status: CompareReadinessStatus): string {
  return status === "waiting_for_target"
    ? "Waiting For Comparison Target"
    : "Limited Context";
}

function buildWorkspaceContext(
  primaryObjectId: string,
  primaryObjectName: string,
  comparisonStatus: CompareReadinessStatus
): CompareWorkspaceContextView {
  return Object.freeze({
    primaryObjectId,
    primaryObjectName,
    targetObjectId: null,
    targetObjectName: COMPARE_TARGET_PLACEHOLDER_LABEL,
    comparisonStatus,
    comparisonStatusLabel: statusLabel(comparisonStatus),
    modules: COMPARE_WORKSPACE_MODULES,
  });
}

function isValidPanelData(panelData: ExecutiveObjectPanelData | null, objectId: string): boolean {
  return Boolean(panelData?.objectId?.trim() && panelData.objectId === objectId);
}

export function resolveCompareModeContext(input: CompareModeContextInput): CompareModeContextResult {
  const primaryObjectId = resolveFocusObjectId(input);
  if (!primaryObjectId) {
    warnCompareModeBrake("Missing object.");
    return Object.freeze({
      context: null,
      primaryObjectId: null,
      reason: "missing_object",
    });
  }

  if (!COMPARE_WORKSPACE_MODULES.length) {
    warnCompareModeBrake("Missing comparison contract.");
    return Object.freeze({
      context: null,
      primaryObjectId,
      reason: "missing_comparison_contract",
    });
  }

  const primaryObjectName =
    input.routeObjectName?.trim() || input.panelData?.objectName?.trim() || primaryObjectId;
  const panelData = input.panelData;

  if (!panelData || !isValidPanelData(panelData, primaryObjectId)) {
    warnCompareModeBrake("Invalid comparison context.", { objectId: primaryObjectId });
    return Object.freeze({
      context: buildWorkspaceContext(primaryObjectId, primaryObjectName, "limited"),
      primaryObjectId,
      reason: "invalid_comparison_context",
    });
  }

  if (!panelData.objectId.trim()) {
    warnCompareModeBrake("Invalid comparison context.", { objectId: primaryObjectId });
    return Object.freeze({
      context: buildWorkspaceContext(primaryObjectId, primaryObjectName, "limited"),
      primaryObjectId,
      reason: "invalid_comparison_context",
    });
  }

  return Object.freeze({
    context: buildWorkspaceContext(
      primaryObjectId,
      panelData.objectName?.trim() || primaryObjectName,
      "waiting_for_target"
    ),
    primaryObjectId,
    reason: "resolved",
  });
}
