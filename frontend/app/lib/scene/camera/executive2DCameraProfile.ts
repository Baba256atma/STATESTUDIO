import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";

export type ExecutiveCameraBounds = {
  center: [number, number, number];
  size: [number, number, number];
};

export type ExecutiveCameraFrame = {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
};

export const EXECUTIVE_2D_CAMERA_PROFILE = Object.freeze({
  id: "executive_2d_strategic",
  fov: 28,
  horizontalBias: 0,
  verticalBias: 0,
  pullback: 0.96,
  positionScale: Object.freeze({ x: 0, y: 1.72, z: 0.001 }),
  minDistance: 12,
  maxDistance: 56,
  orbitEnabled: false,
  projection: "orthographic-like",
});

export function resolveExecutive2DCameraFrame(
  bounds: ExecutiveCameraBounds,
  radius: number
): ExecutiveCameraFrame {
  const [cx, cy, cz] = bounds.center;
  const lookAt: [number, number, number] = [cx, cy, cz];
  const position: [number, number, number] = [
    cx + radius * EXECUTIVE_2D_CAMERA_PROFILE.positionScale.x,
    cy + radius * EXECUTIVE_2D_CAMERA_PROFILE.positionScale.y,
    cz + radius * EXECUTIVE_2D_CAMERA_PROFILE.positionScale.z,
  ];
  return {
    position,
    lookAt,
    fov: EXECUTIVE_2D_CAMERA_PROFILE.fov,
  };
}

export function resolveExecutive2DDefaultCamera(): ExecutiveCameraFrame {
  return {
    position: [0, 28, 0.01],
    lookAt: [0, 0, 0],
    fov: EXECUTIVE_2D_CAMERA_PROFILE.fov,
  };
}

export function logExecutive2DProfile(context: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][2DProfile]", context);
}

export function isExecutive2DMode(mode: WorkspaceViewMode): mode is "2D" {
  return mode === "2D";
}
