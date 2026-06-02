import type { CameraPresetId } from "../sceneNavigationTypes";
import type { ExecutiveCameraPresetId } from "./executiveCameraPresetRegistry";

export type ExecutiveCameraContextInput = {
  selectedObjectId?: string | null;
  focusedObjectId?: string | null;
  objectPanelOpen?: boolean;
  simulationRunning?: boolean;
  riskViewActive?: boolean;
  operationalAnalysisActive?: boolean;
  manualPresetId?: CameraPresetId | null;
  workspaceViewMode?: "2D" | "3D";
};

export function mapToolbarPresetToExecutivePreset(
  presetId: CameraPresetId
): ExecutiveCameraPresetId {
  switch (presetId) {
    case "global":
      return "GLOBAL";
    case "operations":
      return "OPERATIONS";
    case "risk":
      return "RISK";
    case "simulation":
      return "SCENARIO";
    default:
      return "EXECUTIVE";
  }
}

export function buildExecutiveCameraContextSignature(
  input: ExecutiveCameraContextInput
): string {
  return JSON.stringify({
    selectedObjectId: input.selectedObjectId ?? null,
    focusedObjectId: input.focusedObjectId ?? null,
    objectPanelOpen: input.objectPanelOpen === true,
    simulationRunning: input.simulationRunning === true,
    riskViewActive: input.riskViewActive === true,
    operationalAnalysisActive: input.operationalAnalysisActive === true,
    manualPresetId: input.manualPresetId ?? null,
    workspaceViewMode: input.workspaceViewMode ?? "3D",
  });
}

export function resolveExecutiveCameraPresetFromContext(
  input: ExecutiveCameraContextInput
): ExecutiveCameraPresetId {
  const hasSelection =
    Boolean(input.selectedObjectId?.trim()) ||
    Boolean(input.focusedObjectId?.trim()) ||
    input.objectPanelOpen === true;
  if (hasSelection) return "FOCUS";
  if (input.simulationRunning) return "SCENARIO";
  if (input.riskViewActive) return "RISK";
  if (input.operationalAnalysisActive) return "OPERATIONS";
  if (input.manualPresetId) {
    return mapToolbarPresetToExecutivePreset(input.manualPresetId);
  }
  return "EXECUTIVE";
}

export function describeExecutiveCameraContextReason(
  input: ExecutiveCameraContextInput,
  preset: ExecutiveCameraPresetId
): string {
  if (input.manualPresetId) return `manual:${input.manualPresetId}`;
  if (preset === "FOCUS") {
    if (input.objectPanelOpen) return "object_panel_open";
    if (input.selectedObjectId) return "object_selected";
    return "object_focused";
  }
  if (preset === "SCENARIO") return "simulation_running";
  if (preset === "RISK") return "risk_view_active";
  if (preset === "OPERATIONS") return "operational_analysis_active";
  return "executive_overview_default";
}
