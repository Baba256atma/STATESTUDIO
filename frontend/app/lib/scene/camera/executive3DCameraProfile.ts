import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { ExecutiveCameraBounds, ExecutiveCameraFrame } from "./executive2DCameraProfile";
import {
  applyExecutive3DFramingPullback,
  buildExecutive3DCameraFrame,
  computeExecutiveFramingRadius,
  EXECUTIVE_3D_CAMERA_OFFSET,
} from "./executiveCameraFrameFormulas";
import { shouldSuppressIdleDebugLog } from "../../runtime/idleRuntimeStabilityGuard";

/** P4 — Executive command-center 3D camera profile (lower, closer, readable depth). */
export const EXECUTIVE_3D_CAMERA_PROFILE = Object.freeze({
  id: "executive_3d_strategic",
  fov: 43,
  horizontalBias: 0.02,
  verticalBias: 0.02,
  pullback: 0.96,
  positionScale: Object.freeze({ x: 0.24, y: 0.82, z: 0.94 }),
  minDistance: 7,
  maxDistance: 52,
  orbitEnabled: true,
  projection: "perspective",
  defaultTiltRadians: 0.58,
});

/** Default scene radius before pullback — tuned for first-load command-center presence. */
export const EXECUTIVE_3D_DEFAULT_FRAMING_RADIUS = 6.5;

const loggedExecutiveCameraProfileSignatures = new Set<string>();

export function resolveExecutive3DCameraFrame(
  bounds: ExecutiveCameraBounds,
  radius: number,
  opts?: {
    horizontalBias?: number;
    verticalBias?: number;
    pullback?: number;
    executiveTiltRadians?: number;
    objectCount?: number;
  }
): ExecutiveCameraFrame {
  void opts;
  const framingRadius = computeExecutiveFramingRadius(bounds, "3D");
  const effectiveRadius = applyExecutive3DFramingPullback(Math.max(radius, framingRadius));
  const frame = buildExecutive3DCameraFrame(bounds.center, effectiveRadius);
  logExecutiveCameraProfileOnce({
    viewMode: "3D",
    position: frame.position,
    lookAt: frame.lookAt,
    radius: effectiveRadius,
    framingRadius,
    cameraOffset: EXECUTIVE_3D_CAMERA_OFFSET,
    objectCount: opts?.objectCount,
  });
  return frame;
}

export function resolveExecutive3DDefaultCamera(): ExecutiveCameraFrame {
  const effectiveRadius = applyExecutive3DFramingPullback(EXECUTIVE_3D_DEFAULT_FRAMING_RADIUS);
  const frame = buildExecutive3DCameraFrame([0, 0, 0], effectiveRadius);
  logExecutiveCameraProfileOnce({
    viewMode: "3D",
    position: frame.position,
    lookAt: frame.lookAt,
    radius: effectiveRadius,
    framingRadius: effectiveRadius,
    cameraOffset: EXECUTIVE_3D_CAMERA_OFFSET,
    objectCount: 0,
    reason: "default_camera",
  });
  return frame;
}

export function logExecutiveCameraProfileOnce(payload: {
  viewMode: WorkspaceViewMode;
  position: [number, number, number];
  lookAt: [number, number, number];
  radius: number;
  framingRadius: number;
  cameraOffset: Readonly<{ x: number; y: number; z: number }>;
  objectCount?: number;
  reason?: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const signature = [
    payload.viewMode,
    payload.reason ?? "framing",
    payload.objectCount ?? 0,
    payload.radius.toFixed(3),
    payload.framingRadius.toFixed(3),
    payload.position.map((value) => value.toFixed(3)).join(","),
    payload.lookAt.map((value) => value.toFixed(3)).join(","),
  ].join("|");
  if (loggedExecutiveCameraProfileSignatures.has(signature)) return;
  if (shouldSuppressIdleDebugLog(`executive-camera-profile:${signature}`)) return;
  loggedExecutiveCameraProfileSignatures.add(signature);
  console.info("[Nexora][ExecutiveCameraProfile]", {
    viewMode: payload.viewMode,
    position: payload.position,
    lookAt: payload.lookAt,
    radius: payload.radius,
    framingRadius: payload.framingRadius,
    cameraOffset: payload.cameraOffset,
    objectCount: payload.objectCount ?? 0,
    reason: payload.reason ?? "framing",
  });
}

export function logExecutive3DProfile(context: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][3DProfile]", context);
}

export function resetExecutive3DCameraProfileLogsForTests(): void {
  loggedExecutiveCameraProfileSignatures.clear();
}

export function isExecutive3DMode(mode: WorkspaceViewMode): mode is "3D" {
  return mode === "3D";
}

export type { ExecutiveCameraBounds, ExecutiveCameraFrame };
