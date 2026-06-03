import type { ExecutiveCameraBounds } from "../camera/executive2DCameraProfile";
import { resolveExecutive3DCameraFrame } from "../camera/executive3DCameraProfile";
import { resolveExecutive2DOrthographicFrame } from "../camera/executive2DCameraProfile";
import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import { readExecutiveSceneObjects } from "../camera/executiveCameraPresetRegistry";
import { resolveExecutiveSceneFraming } from "../composition/executiveSceneFramingRuntime";
import {
  resolveExecutiveOperationalLayoutCameraFit,
  resolveExecutiveOperationalSceneCenter,
  shouldUseExecutiveOperationalLayout,
} from "../composition/normalizeExecutiveObjectLayout";
import { fitCameraToSceneObjects } from "../camera/fitCameraToSceneObjects";
import type { ExecutiveViewportCameraFrame } from "./executiveViewportModeTypes";
import { mapWorkspaceViewModeToFramingPreset } from "./executiveViewportModeRuntime";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function resolveExecutiveViewportOperationalCenter(input: {
  sceneJson: unknown;
  viewMode: WorkspaceViewMode;
  preserveCenter?: [number, number, number] | null;
  layoutPositions?: Record<string, [number, number, number]>;
}): [number, number, number] {
  if (input.preserveCenter) return input.preserveCenter;
  const objects = readExecutiveSceneObjects(input.sceneJson);
  if (input.layoutPositions && Object.keys(input.layoutPositions).length > 0) {
    return fitCameraToSceneObjects({
      objects,
      mode: input.viewMode,
      layoutPositions: input.layoutPositions,
    }).center;
  }
  const layoutCenter = resolveExecutiveOperationalSceneCenter(input.sceneJson);
  if (layoutCenter) return layoutCenter;
  const framing = resolveExecutiveSceneFraming({
    sceneJson: input.sceneJson,
    preset: mapWorkspaceViewModeToFramingPreset(input.viewMode),
    mode: input.viewMode,
  });
  return framing?.bounds.center ?? [0, 0, 0];
}

export function resolveExecutiveViewportCameraFrame(input: {
  sceneJson: unknown;
  viewMode: WorkspaceViewMode;
  viewportWidth?: number;
  viewportHeight?: number;
  preserveCenter?: [number, number, number] | null;
  presetOverride?: "GLOBAL" | "FIT_SCENE" | "FOCUS" | null;
  layoutPositions?: Record<string, [number, number, number]>;
}): ExecutiveViewportCameraFrame | null {
  const preset = input.presetOverride ?? mapWorkspaceViewModeToFramingPreset(input.viewMode);
  const canonical2D = input.viewMode === "2D";
  const preserveCenter = canonical2D ? null : input.preserveCenter;
  const objects = readExecutiveSceneObjects(input.sceneJson);
  const hasLayoutPositions = Boolean(input.layoutPositions && Object.keys(input.layoutPositions).length > 0);
  const useOperationalLayout =
    shouldUseExecutiveOperationalLayout(objects.length) &&
    (preset === "FIT_SCENE" || preset === "VIEW_2D" || preset === "VIEW_3D");

  if (hasLayoutPositions || useOperationalLayout) {
    const fit = hasLayoutPositions
      ? fitCameraToSceneObjects({
          objects,
          mode: input.viewMode,
          viewportWidth: input.viewportWidth,
          viewportHeight: input.viewportHeight,
          layoutPositions: input.layoutPositions,
        })
      : resolveExecutiveOperationalLayoutCameraFit({
          objects,
          mode: input.viewMode,
          viewportWidth: input.viewportWidth,
          viewportHeight: input.viewportHeight,
        });
    const operationalCenter = fit.center;
    const frame = fit.frame as typeof fit.frame & { zoom?: number; orthoSize?: number };
    return {
      projection: input.viewMode === "2D" ? "orthographic" : "perspective",
      position: frame.position,
      lookAt: frame.lookAt,
      fov: frame.fov ?? 45,
      zoom: input.viewMode === "2D" ? frame.zoom ?? 1 : 1,
      orthoSize:
        input.viewMode === "2D"
          ? frame.orthoSize ?? Math.max(fit.bounds.size[0], fit.bounds.size[2], 1)
          : Math.max(fit.bounds.size[0], fit.bounds.size[2], 1),
      operationalCenter,
      bounds: fit.bounds,
    };
  }

  const framing = resolveExecutiveSceneFraming({
    sceneJson: input.sceneJson,
    preset,
    mode: input.viewMode,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
  });
  if (!framing) return null;

  const operationalCenter = preserveCenter ?? framing.bounds.center;
  const bounds: ExecutiveCameraBounds = {
    center: operationalCenter,
    size: framing.bounds.size,
  };
  const viewportWidth = Math.max(640, input.viewportWidth ?? 1440);
  const viewportHeight = Math.max(480, input.viewportHeight ?? 900);

  if (input.viewMode === "2D") {
    const ortho = resolveExecutive2DOrthographicFrame(bounds, viewportWidth, viewportHeight, framing.cameraRadius);
    return {
      projection: "orthographic",
      position: ortho.position,
      lookAt: ortho.lookAt,
      fov: ortho.fov,
      zoom: ortho.zoom,
      orthoSize: ortho.orthoSize,
      operationalCenter,
      bounds,
    };
  }

  const perspective = resolveExecutive3DCameraFrame(bounds, framing.cameraRadius, {
    horizontalBias: 0.02,
    verticalBias: 0.03,
    pullback: 1.04,
    executiveTiltRadians: 0.58,
  });

  return {
    projection: "perspective",
    position: perspective.position,
    lookAt: perspective.lookAt,
    fov: perspective.fov,
    zoom: 1,
    orthoSize: Math.max(bounds.size[0], bounds.size[2], 1),
    operationalCenter,
    bounds,
  };
}

export function resolveExecutiveViewportOrthoBounds(input: {
  orthoSize: number;
  viewportWidth: number;
  viewportHeight: number;
}): { left: number; right: number; top: number; bottom: number } {
  const aspect = input.viewportWidth / Math.max(1, input.viewportHeight);
  const halfHeight = input.orthoSize;
  const halfWidth = halfHeight * aspect;
  return {
    left: -halfWidth,
    right: halfWidth,
    top: halfHeight,
    bottom: -halfHeight,
  };
}

export function resolveExecutiveViewportZoomLimits(viewMode: WorkspaceViewMode): {
  minZoom: number;
  maxZoom: number;
  minDistance: number;
  maxDistance: number;
} {
  if (viewMode === "2D") {
    return {
      minZoom: 6,
      maxZoom: 220,
      minDistance: 4,
      maxDistance: 120,
    };
  }
  return {
    minZoom: 0.2,
    maxZoom: 4,
    minDistance: 5,
    maxDistance: 72,
  };
}

export function blendOperationalCenter(
  current: [number, number, number] | null | undefined,
  proposed: [number, number, number],
  preserveWeight = 0.35
): [number, number, number] {
  if (!current) return proposed;
  const weight = clamp(preserveWeight, 0, 0.75);
  return [
    current[0] * weight + proposed[0] * (1 - weight),
    current[1] * weight + proposed[1] * (1 - weight),
    current[2] * weight + proposed[2] * (1 - weight),
  ];
}
