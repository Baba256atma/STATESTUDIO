import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { ExecutiveCameraBounds, ExecutiveCameraFrame } from "./executive2DCameraProfile";
import {
  buildExecutive3DCameraFrame,
  computeExecutiveFramingRadius,
} from "./executiveCameraFrameFormulas";

export const EXECUTIVE_3D_CAMERA_PROFILE = Object.freeze({
  id: "executive_3d_strategic",
  fov: 42,
  horizontalBias: 0.02,
  verticalBias: 0.03,
  pullback: 1.04,
  positionScale: Object.freeze({ x: 0.24, y: 0.82, z: 0.94 }),
  minDistance: 7,
  maxDistance: 52,
  orbitEnabled: true,
  projection: "perspective",
  defaultTiltRadians: 0.68,
});

export function resolveExecutive3DCameraFrame(
  bounds: ExecutiveCameraBounds,
  radius: number,
  opts?: {
    horizontalBias?: number;
    verticalBias?: number;
    pullback?: number;
    executiveTiltRadians?: number;
  }
): ExecutiveCameraFrame {
  void opts;
  const framingRadius = computeExecutiveFramingRadius(bounds);
  const effectiveRadius = Math.max(radius, framingRadius);
  return buildExecutive3DCameraFrame(bounds.center, effectiveRadius);
}

export function resolveExecutive3DDefaultCamera(): ExecutiveCameraFrame {
  return {
    position: [6, 9, 14],
    lookAt: [0, 0, 0],
    fov: EXECUTIVE_3D_CAMERA_PROFILE.fov,
  };
}

export function logExecutive3DProfile(context: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][3DProfile]", context);
}

export function isExecutive3DMode(mode: WorkspaceViewMode): mode is "3D" {
  return mode === "3D";
}

export type { ExecutiveCameraBounds, ExecutiveCameraFrame };
