import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import {
  buildExecutive2DCameraFrame,
  computeExecutiveFramingRadius,
} from "./executiveCameraFrameFormulas";

export type ExecutiveCameraBounds = {
  center: [number, number, number];
  size: [number, number, number];
};

export type ExecutiveCameraFrame = {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
};

export type Executive2DOrthographicFrame = ExecutiveCameraFrame & {
  projection: "orthographic";
  zoom: number;
  orthoSize: number;
};

export const EXECUTIVE_2D_CAMERA_PROFILE = Object.freeze({
  id: "executive_2d_strategic",
  fov: 1,
  horizontalBias: 0,
  verticalBias: 0,
  pullback: 0.92,
  positionScale: Object.freeze({ x: 0, y: 1, z: 0.001 }),
  minDistance: 8,
  maxDistance: 48,
  orbitEnabled: false,
  projection: "orthographic",
});

/** @deprecated Use resolveExecutive2DOrthographicFrame for E2:92 strategic map mode. */
export function resolveExecutive2DCameraFrame(
  bounds: ExecutiveCameraBounds,
  radius: number
): ExecutiveCameraFrame {
  return resolveExecutive2DOrthographicFrame(bounds, 1440, 900, radius);
}

/** True orthographic strategic map framing — fits operational topology, not largest mesh. */
export function resolveExecutive2DOrthographicFrame(
  bounds: ExecutiveCameraBounds,
  viewportWidth: number,
  viewportHeight: number,
  framingRadius?: number
): Executive2DOrthographicFrame {
  const [cx, cy, cz] = bounds.center;
  const groundSpan = Math.max(bounds.size[0], bounds.size[2], 0.75);
  const densityBoost =
    groundSpan <= 8 ? 0.88 : groundSpan <= 16 ? 0.94 : groundSpan <= 28 ? 1 : 1.06;
  const orthoSize = Math.max(3.2, groundSpan * densityBoost * 0.54);
  const aspect = Math.max(0.75, viewportWidth / Math.max(1, viewportHeight));
  const fitZoom = Math.max(
    10,
    Math.min(180, ((Math.max(viewportHeight, 640) / 720) * 48) / orthoSize)
  );
  const radius = Math.max(framingRadius ?? computeExecutiveFramingRadius(bounds, "2D"), groundSpan * 0.46);
  const topDown = buildExecutive2DCameraFrame([cx, cy, cz], radius);

  return {
    projection: "orthographic",
    position: topDown.position,
    lookAt: topDown.lookAt,
    fov: EXECUTIVE_2D_CAMERA_PROFILE.fov,
    zoom: Number(fitZoom.toFixed(2)),
    orthoSize: Number((orthoSize * aspect).toFixed(3)),
  };
}

export function resolveExecutive2DDefaultCamera(): Executive2DOrthographicFrame {
  return {
    projection: "orthographic",
    position: [0, 24, 0.001],
    lookAt: [0, 0, 0],
    fov: EXECUTIVE_2D_CAMERA_PROFILE.fov,
    zoom: 42,
    orthoSize: 12,
  };
}

export function logExecutive2DProfile(context: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][2DProfile]", context);
}

export function isExecutive2DMode(mode: WorkspaceViewMode): mode is "2D" {
  return mode === "2D";
}
