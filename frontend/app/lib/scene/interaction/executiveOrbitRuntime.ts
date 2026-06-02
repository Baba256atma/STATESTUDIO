import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import { resolveExecutiveSceneFraming } from "../composition/executiveSceneFramingRuntime";
import {
  resolveExecutiveOperationalLayoutCameraFit,
  resolveExecutiveOperationalSceneCenter,
  shouldUseExecutiveOperationalLayout,
} from "../composition/normalizeExecutiveObjectLayout";
import { readExecutiveSceneObjects } from "../camera/executiveCameraPresetRegistry";
import { resolveExecutiveViewportZoomLimits } from "../viewport/executiveViewportCameraRuntime";
import {
  mapWorkspaceViewModeToFramingPreset,
  resolveExecutiveViewportModeConfig,
} from "../viewport/executiveViewportModeRuntime";

export type ExecutiveOrbitMouseButtons = {
  LEFT: number;
  MIDDLE: number;
  RIGHT: number;
};

export type ExecutiveOrbitRuntimeConfig = {
  viewMode: WorkspaceViewMode;
  enableRotate: boolean;
  enablePan: boolean;
  enableZoom: boolean;
  enableDamping: boolean;
  dampingFactor: number;
  rotateSpeed: number;
  panSpeed: number;
  zoomSpeed: number;
  screenSpacePanning: boolean;
  zoomToCursor: boolean;
  mouseButtons: ExecutiveOrbitMouseButtons;
  minPolarAngle: number;
  maxPolarAngle: number;
  minDistance: number;
  maxDistance: number;
  minZoom: number;
  maxZoom: number;
  target: [number, number, number];
  objectCount: number;
};

const EXECUTIVE_ORBIT_DAMPING = Object.freeze({
  enableDamping: true,
  dampingFactor: 0.09,
  rotateSpeed: 0.68,
  panSpeed: 0.92,
  zoomSpeed: 0.95,
});

const MOUSE = {
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
} as const;

function safeNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function resolveExecutiveOrbitDistanceLimits(sceneJson: unknown, viewMode: WorkspaceViewMode = "3D"): {
  minDistance: number;
  maxDistance: number;
  minZoom: number;
  maxZoom: number;
  target: [number, number, number];
  objectCount: number;
  operationalSpan: number;
} {
  const zoomLimits = resolveExecutiveViewportZoomLimits(viewMode);
  const objects = readExecutiveSceneObjects(sceneJson);
  const objectCount = objects.length;

  if (shouldUseExecutiveOperationalLayout(objectCount)) {
    const fit = resolveExecutiveOperationalLayoutCameraFit({
      objects,
      mode: viewMode,
    });
    const operationalSpan = Math.max(fit.bounds.size[0], fit.bounds.size[1], fit.bounds.size[2], 1);
    const minDistance = Math.max(
      zoomLimits.minDistance,
      operationalSpan * (viewMode === "2D" ? 0.38 : 0.48)
    );
    const maxDistance = Math.max(
      minDistance + 10,
      Math.min(zoomLimits.maxDistance, operationalSpan * (viewMode === "2D" ? 3.2 : 4.2))
    );
    const layoutCenter = resolveExecutiveOperationalSceneCenter(sceneJson) ?? fit.center;
    return {
      minDistance: safeNumber(minDistance, zoomLimits.minDistance),
      maxDistance: safeNumber(maxDistance, zoomLimits.maxDistance),
      minZoom: zoomLimits.minZoom,
      maxZoom: zoomLimits.maxZoom,
      target: layoutCenter,
      objectCount,
      operationalSpan,
    };
  }

  const framing = resolveExecutiveSceneFraming({
    sceneJson,
    preset: mapWorkspaceViewModeToFramingPreset(viewMode),
    mode: viewMode,
  });

  if (!framing || objectCount === 0) {
    return {
      minDistance: zoomLimits.minDistance,
      maxDistance: zoomLimits.maxDistance,
      minZoom: zoomLimits.minZoom,
      maxZoom: zoomLimits.maxZoom,
      target: [0, 0, 0],
      objectCount: 0,
      operationalSpan: 1,
    };
  }

  const operationalSpan = framing.boundsAnalysis.operational.span;
  const compression = framing.compression.cameraDistanceMultiplier;
  const minDistance = Math.max(
    zoomLimits.minDistance,
    operationalSpan * (viewMode === "2D" ? 0.42 : 0.55) * compression
  );
  const maxDistance = Math.max(
    minDistance + 8,
    Math.min(zoomLimits.maxDistance, operationalSpan * (viewMode === "2D" ? 2.8 : 3.4))
  );

  return {
    minDistance: safeNumber(minDistance, zoomLimits.minDistance),
    maxDistance: safeNumber(maxDistance, zoomLimits.maxDistance),
    minZoom: zoomLimits.minZoom,
    maxZoom: zoomLimits.maxZoom,
    target: framing.bounds.center,
    objectCount,
    operationalSpan,
  };
}

export function buildExecutiveOrbitConfigSignature(input: {
  viewMode: WorkspaceViewMode;
  sceneJson: unknown;
}): string {
  const limits = resolveExecutiveOrbitDistanceLimits(input.sceneJson, input.viewMode);
  return JSON.stringify({
    viewMode: input.viewMode,
    objectCount: limits.objectCount,
    minDistance: Number(limits.minDistance.toFixed(2)),
    maxDistance: Number(limits.maxDistance.toFixed(2)),
    minZoom: limits.minZoom,
    maxZoom: limits.maxZoom,
    target: limits.target.map((value) => Math.round(value * 100) / 100),
  });
}

export function resolveExecutiveOrbitRuntimeConfig(input: {
  viewMode: WorkspaceViewMode;
  sceneJson: unknown;
}): ExecutiveOrbitRuntimeConfig {
  const modeConfig = resolveExecutiveViewportModeConfig(input.viewMode);
  const limits = resolveExecutiveOrbitDistanceLimits(input.sceneJson, input.viewMode);
  const is3D = input.viewMode === "3D";

  return {
    viewMode: input.viewMode,
    enableRotate: modeConfig.enableOrbitRotate,
    enablePan: modeConfig.enablePan,
    enableZoom: modeConfig.enableZoom,
    enableDamping: EXECUTIVE_ORBIT_DAMPING.enableDamping,
    dampingFactor: EXECUTIVE_ORBIT_DAMPING.dampingFactor,
    rotateSpeed: EXECUTIVE_ORBIT_DAMPING.rotateSpeed,
    panSpeed: EXECUTIVE_ORBIT_DAMPING.panSpeed,
    zoomSpeed: EXECUTIVE_ORBIT_DAMPING.zoomSpeed,
    screenSpacePanning: modeConfig.screenSpacePanning,
    zoomToCursor: modeConfig.zoomToCursor,
    mouseButtons: is3D
      ? { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.PAN, RIGHT: MOUSE.PAN }
      : { LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN },
    minPolarAngle: is3D ? 0.45 : 0,
    maxPolarAngle: is3D ? 1.05 : 0,
    minDistance: limits.minDistance,
    maxDistance: limits.maxDistance,
    minZoom: limits.minZoom,
    maxZoom: limits.maxZoom,
    target: limits.target,
    objectCount: limits.objectCount,
  };
}

export function sanitizeExecutiveOrbitTarget(
  target: [number, number, number] | null | undefined
): [number, number, number] {
  if (!target) return [0, 0, 0];
  return target.map((value) => (Number.isFinite(value) ? value : 0)) as [number, number, number];
}
