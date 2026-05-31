import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { ExecutiveCameraBounds, ExecutiveCameraFrame } from "./executive2DCameraProfile";

export const EXECUTIVE_3D_CAMERA_PROFILE = Object.freeze({
  id: "executive_3d_strategic",
  fov: 42,
  horizontalBias: 0.02,
  verticalBias: 0,
  pullback: 1.12,
  positionScale: Object.freeze({ x: 0.18, y: 0.64, z: 1.08 }),
  minDistance: 9,
  maxDistance: 46,
  orbitEnabled: true,
  projection: "perspective",
});

export function resolveExecutive3DCameraFrame(
  bounds: ExecutiveCameraBounds,
  radius: number,
  opts?: { horizontalBias?: number; verticalBias?: number; pullback?: number }
): ExecutiveCameraFrame {
  const [cx, cy, cz] = bounds.center;
  const horizontalBias = opts?.horizontalBias ?? EXECUTIVE_3D_CAMERA_PROFILE.horizontalBias;
  const verticalBias = opts?.verticalBias ?? EXECUTIVE_3D_CAMERA_PROFILE.verticalBias;
  const pullback = opts?.pullback ?? EXECUTIVE_3D_CAMERA_PROFILE.pullback;

  const lookAt: [number, number, number] = [
    cx - radius * horizontalBias,
    cy + radius * verticalBias,
    cz - radius * 0.06,
  ];
  const position: [number, number, number] = [
    lookAt[0] + radius * EXECUTIVE_3D_CAMERA_PROFILE.positionScale.x,
    lookAt[1] + radius * EXECUTIVE_3D_CAMERA_PROFILE.positionScale.y,
    lookAt[2] + radius * EXECUTIVE_3D_CAMERA_PROFILE.positionScale.z * Math.max(1, pullback),
  ];

  return {
    position,
    lookAt,
    fov: EXECUTIVE_3D_CAMERA_PROFILE.fov,
  };
}

export function resolveExecutive3DDefaultCamera(): ExecutiveCameraFrame {
  return {
    position: [0, 8, 20],
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
