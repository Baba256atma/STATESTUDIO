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

/** True orthographic strategic map framing — fits operational footprint without perspective shrink. */
export function resolveExecutive2DOrthographicFrame(
  bounds: ExecutiveCameraBounds,
  viewportWidth: number,
  viewportHeight: number,
  framingRadius?: number
): Executive2DOrthographicFrame {
  const [cx, cy, cz] = bounds.center;
  const span = Math.max(bounds.size[0], bounds.size[2], 0.75);
  const densityBoost = span <= 6 ? 0.72 : span <= 14 ? 0.82 : span <= 28 ? 0.9 : 1;
  const orthoSize = Math.max(2.4, span * densityBoost * 0.56);
  const aspect = Math.max(0.75, viewportWidth / Math.max(1, viewportHeight));
  const fitZoom = Math.max(
    8,
    Math.min(160, ((Math.max(viewportHeight, 640) / 720) * 42) / orthoSize)
  );
  const radius = Math.max(framingRadius ?? computeExecutiveFramingRadius(bounds), span * 0.5);
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
