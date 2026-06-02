import type { ExecutiveCameraPresetId } from "../camera/executiveCameraPresetRegistry";
import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { ExecutiveCameraBounds } from "../camera/executive2DCameraProfile";

export type ExecutiveViewportProjection = "perspective" | "orthographic";

export type ExecutiveViewportModePreset = Extract<ExecutiveCameraPresetId, "VIEW_2D" | "VIEW_3D">;

export type ExecutiveViewportModeConfig = {
  viewMode: WorkspaceViewMode;
  projection: ExecutiveViewportProjection;
  framingPreset: ExecutiveViewportModePreset;
  navigationPreset: ExecutiveViewportModePreset;
  transitionDurationMs: number;
  enableOrbitRotate: boolean;
  enablePan: boolean;
  enableZoom: boolean;
  zoomToCursor: boolean;
  screenSpacePanning: boolean;
  executiveTiltRadians: number | null;
};

export type ExecutiveViewportCameraFrame = {
  projection: ExecutiveViewportProjection;
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  zoom: number;
  orthoSize: number;
  operationalCenter: [number, number, number];
  bounds?: ExecutiveCameraBounds;
};
