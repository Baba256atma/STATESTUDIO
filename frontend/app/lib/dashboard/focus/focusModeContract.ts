/**
 * MRP:2:2 — Focus Mode contract.
 *
 * Dashboard is a read-only consumer of existing object selection context.
 * Does not own or mutate object selection.
 */

import type { ExecutiveObjectPanelData } from "../../panels/executiveObjectPanelData.ts";

export type FocusModeContextView = Readonly<{
  objectId: string;
  objectName: string;
  status: string;
  impact: string;
  confidenceLabel: string;
  confidenceScore: number | null;
  objectType: string;
  lastUpdated: string;
  description: string;
}>;

export type FocusModeContextInput = Readonly<{
  selectedObjectId: string | null;
  routeObjectId: string | null;
  routeObjectName: string | null;
  panelData: ExecutiveObjectPanelData | null;
}>;

export type FocusModeContextResult = Readonly<{
  context: FocusModeContextView | null;
  objectId: string | null;
  reason: "resolved" | "missing_object" | "missing_selection_context" | "invalid_object_state";
}>;

export const FOCUS_MODE_FUTURE_ACTIONS = Object.freeze([
  { id: "analyze", label: "Analyze" },
  { id: "compare", label: "Compare" },
  { id: "scenario", label: "Scenario" },
  { id: "war_room", label: "War Room" },
] as const);

const loggedBrakes = new Set<string>();

export function warnFocusModeBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[FocusMode][Brake]", { message, ...detail });
}

export function resetFocusModeContractForTests(): void {
  loggedBrakes.clear();
}

export function resolveFocusObjectId(input: FocusModeContextInput): string | null {
  const routeId = input.routeObjectId?.trim() || null;
  const selectedId = input.selectedObjectId?.trim() || null;
  return routeId || selectedId;
}

function impactLabelFromRisk(riskLevel: ExecutiveObjectPanelData["riskLevel"] | undefined): string {
  switch (riskLevel) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "medium":
      return "Moderate";
    case "low":
      return "Low";
    default:
      return "Monitoring";
  }
}

function formatConfidence(score: number | null | undefined): { label: string; score: number | null } {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return { label: "Pending", score: null };
  }
  const clamped = Math.max(0, Math.min(1, score));
  return { label: `${Math.round(clamped * 100)}%`, score: clamped };
}

function mapPanelDataToFocusContext(
  objectId: string,
  objectName: string,
  panelData: ExecutiveObjectPanelData
): FocusModeContextView {
  const confidence = formatConfidence(panelData.confidence);
  return Object.freeze({
    objectId,
    objectName: panelData.objectName?.trim() || objectName,
    status: panelData.status?.trim() || "Active",
    impact: impactLabelFromRisk(panelData.riskLevel),
    confidenceLabel: confidence.label,
    confidenceScore: confidence.score,
    objectType: panelData.objectType?.trim() || "Object",
    lastUpdated: panelData.lastUpdated?.trim() || "Runtime",
    description: panelData.insight?.trim() || "No description available for this object yet.",
  });
}

function buildFallbackFocusContext(objectId: string, objectName: string): FocusModeContextView {
  return Object.freeze({
    objectId,
    objectName,
    status: "Active",
    impact: "Monitoring",
    confidenceLabel: "Pending",
    confidenceScore: null,
    objectType: "Object",
    lastUpdated: "Runtime",
    description: "Object context is limited. Select the object in the scene for full details.",
  });
}

export function resolveFocusModeContext(input: FocusModeContextInput): FocusModeContextResult {
  const objectId = resolveFocusObjectId(input);
  if (!objectId) {
    warnFocusModeBrake("Missing object.");
    return Object.freeze({
      context: null,
      objectId: null,
      reason: "missing_object",
    });
  }

  const objectName = input.routeObjectName?.trim() || input.panelData?.objectName?.trim() || objectId;
  const panelData = input.panelData;

  if (!panelData || panelData.objectId !== objectId) {
    warnFocusModeBrake("Missing selection context.", { objectId });
    return Object.freeze({
      context: buildFallbackFocusContext(objectId, objectName),
      objectId,
      reason: "missing_selection_context",
    });
  }

  if (!panelData.objectId.trim()) {
    warnFocusModeBrake("Invalid object state.", { objectId });
    return Object.freeze({
      context: buildFallbackFocusContext(objectId, objectName),
      objectId,
      reason: "invalid_object_state",
    });
  }

  return Object.freeze({
    context: mapPanelDataToFocusContext(objectId, objectName, panelData),
    objectId,
    reason: "resolved",
  });
}
