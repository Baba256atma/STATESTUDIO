/**
 * E2:109 — Canonical executive camera framing.
 *
 * Coordinate system:
 * - X = horizontal flow (left/right)
 * - Y = vertical height (up)
 * - Z = depth (forward/back)
 *
 * 2D mode: camera on +Y looking down at the operational center.
 * 3D mode: angled executive perspective above and behind the map.
 */

import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { ExecutiveCameraBounds, ExecutiveCameraFrame } from "./executive2DCameraProfile";
import { EXECUTIVE_3D_CAMERA_PROFILE } from "./executive3DCameraProfile";

export const EXECUTIVE_2D_CAMERA_LIFT_MULTIPLIER = 2.4;
export const EXECUTIVE_3D_CAMERA_OFFSET = Object.freeze({
  x: 1.0,
  y: 0.55,
  z: 1.15,
});
export const EXECUTIVE_FRAME_ALL_PADDING = 1.18;

export function computeExecutiveFramingRadius(bounds: ExecutiveCameraBounds): number {
  return (
    Math.max(bounds.size[0] / 2, bounds.size[1] / 2, bounds.size[2] / 2, 2.5) *
    EXECUTIVE_FRAME_ALL_PADDING
  );
}

export function buildExecutive3DCameraFrame(
  center: [number, number, number],
  radius: number
): Pick<ExecutiveCameraFrame, "position" | "lookAt" | "fov"> {
  const [cx, cy, cz] = center;
  return {
    position: [
      cx + radius * EXECUTIVE_3D_CAMERA_OFFSET.x,
      cy + radius * EXECUTIVE_3D_CAMERA_OFFSET.y,
      cz + radius * EXECUTIVE_3D_CAMERA_OFFSET.z,
    ],
    lookAt: [cx, cy, cz],
    fov: EXECUTIVE_3D_CAMERA_PROFILE.fov,
  };
}

export function buildExecutive2DCameraFrame(
  center: [number, number, number],
  radius: number
): Pick<ExecutiveCameraFrame, "position" | "lookAt"> {
  const [cx, cy, cz] = center;
  return {
    position: [cx, cy + radius * EXECUTIVE_2D_CAMERA_LIFT_MULTIPLIER, cz],
    lookAt: [cx, cy, cz],
  };
}

export function buildExecutiveCameraFrameForMode(
  mode: WorkspaceViewMode,
  center: [number, number, number],
  radius: number
): Pick<ExecutiveCameraFrame, "position" | "lookAt" | "fov"> {
  if (mode === "2D") {
    return {
      ...buildExecutive2DCameraFrame(center, radius),
      fov: 1,
    };
  }
  return buildExecutive3DCameraFrame(center, radius);
}
