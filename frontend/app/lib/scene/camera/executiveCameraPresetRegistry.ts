import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import {
  resolveExecutiveCameraFrameForMode,
  resolveExecutiveDefaultCameraForMode,
} from "../../workspace/workspaceModeTransitionRuntime";
import type { ExecutiveCameraFrame } from "./executive2DCameraProfile";
import { resolveSceneObjectHudPosition } from "../resolveSceneObjectHudPosition";
import {
  applyExecutiveCompositionQuality,
  resolveExecutiveViewportFramingAdjustments,
} from "./executiveCameraFramingRuntime";
import { logExecutiveCameraPreset } from "./executiveCameraDiagnostics";
import { resolveExecutiveOperationalLayoutCameraFit, shouldUseExecutiveOperationalLayout } from "../composition/normalizeExecutiveObjectLayout";
import { resolveExecutiveSceneFraming, resetExecutiveSceneFramingForTests } from "../composition/executiveSceneFramingRuntime";
import { fitCameraToSceneObjects } from "./fitCameraToSceneObjects";

export type ExecutiveCameraPresetId =
  | "GLOBAL"
  | "EXECUTIVE"
  | "OPERATIONS"
  | "RISK"
  | "SCENARIO"
  | "FOCUS"
  | "GLOBAL_VIEW"
  | "FIT_SCENE"
  | "VIEW_2D"
  | "VIEW_3D";

/** @deprecated Use ExecutiveCameraPresetId */
export type LegacyExecutiveCameraPresetId = ExecutiveCameraPresetId;

export type ExecutiveCameraPresetDefinition = {
  id: ExecutiveCameraPresetId;
  label: string;
  purpose: string;
  radiusMultiplier: number;
  pullback?: number;
  horizontalBias?: number;
  verticalBias?: number;
  fovOffset?: number;
  compositionPadding?: number;
  timelineClearance?: number;
  focusDistanceScale?: number;
};

export type ExecutiveCameraBounds = {
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  size: [number, number, number];
};

const EXECUTIVE_CAMERA_PRESET_REGISTRY: Record<
  Exclude<ExecutiveCameraPresetId, "GLOBAL_VIEW">,
  ExecutiveCameraPresetDefinition
> = {
  GLOBAL: {
    id: "GLOBAL",
    label: "Global View",
    purpose: "Balanced whole-system overview with comfortable spacing",
    radiusMultiplier: 1.08,
    pullback: 1.16,
    horizontalBias: 0.02,
    verticalBias: 0.04,
    compositionPadding: 1.14,
  },
  EXECUTIVE: {
    id: "EXECUTIVE",
    label: "Executive Overview",
    purpose: "Default Nexora landing — strategic hierarchy and readability",
    radiusMultiplier: 1.04,
    pullback: 1.14,
    horizontalBias: 0.015,
    verticalBias: 0.05,
    fovOffset: 0,
    compositionPadding: 1.12,
  },
  OPERATIONS: {
    id: "OPERATIONS",
    label: "Operations View",
    purpose: "Closer operational relationship and dependency inspection",
    radiusMultiplier: 0.92,
    pullback: 1.02,
    horizontalBias: 0.035,
    verticalBias: 0.02,
    fovOffset: -2,
    compositionPadding: 1.06,
  },
  RISK: {
    id: "RISK",
    label: "Risk View",
    purpose: "Wider framing for risk propagation and critical node spread",
    radiusMultiplier: 1.12,
    pullback: 1.18,
    horizontalBias: 0.01,
    verticalBias: 0.03,
    fovOffset: 2,
    compositionPadding: 1.18,
  },
  SCENARIO: {
    id: "SCENARIO",
    label: "Scenario View",
    purpose: "Simulation playback with timeline clearance",
    radiusMultiplier: 1,
    pullback: 1.1,
    horizontalBias: 0.02,
    verticalBias: 0.06,
    timelineClearance: 0.14,
    compositionPadding: 1.1,
  },
  FOCUS: {
    id: "FOCUS",
    label: "Focus View",
    purpose: "Single-object investigation with preserved system context",
    radiusMultiplier: 0.78,
    pullback: 0.96,
    horizontalBias: 0.01,
    verticalBias: 0.025,
    fovOffset: -1,
    focusDistanceScale: 0.88,
    compositionPadding: 1.04,
  },
  FIT_SCENE: {
    id: "FIT_SCENE",
    label: "Fit Scene",
    purpose: "Tight fit to current operational mass",
    radiusMultiplier: 1.02,
    pullback: 1.04,
    verticalBias: 0.03,
    compositionPadding: 1.05,
  },
  VIEW_2D: {
    id: "VIEW_2D",
    label: "Strategic Map",
    purpose: "Orthographic executive operational map with compressed empty space",
    radiusMultiplier: 0.84,
    pullback: 0.9,
    horizontalBias: 0,
    verticalBias: 0,
    compositionPadding: 0.88,
  },
  VIEW_3D: {
    id: "VIEW_3D",
    label: "Perspective Operations",
    purpose: "Executive perspective workspace with cinematic orbit navigation",
    radiusMultiplier: 0.94,
    pullback: 1.02,
    horizontalBias: 0.018,
    verticalBias: 0.04,
    fovOffset: 0,
    compositionPadding: 0.98,
  },
};

const presetResultCache = new Map<string, ExecutiveCameraFrame>();

function readObjectPosition(
  obj: unknown,
  layoutPositions?: Record<string, [number, number, number]>,
  index?: number
): [number, number, number] | null {
  const record = obj as { id?: unknown; name?: unknown; transform?: { pos?: unknown }; position?: unknown } | null;
  const id = record?.id != null ? String(record.id) : "";
  const name = record?.name != null ? String(record.name) : "";
  const layoutPosition =
    (id ? layoutPositions?.[id] : undefined) ??
    (name ? layoutPositions?.[name] : undefined);
  if (layoutPosition) return layoutPosition;
  const transformPos = record?.transform?.pos;
  const position = record?.position;
  const source =
    Array.isArray(transformPos) && transformPos.length >= 3
      ? transformPos
      : Array.isArray(position) && position.length >= 3
        ? position
        : null;
  if (!source && typeof index === "number") return [index * 1.8 - 1.8, 0, 0];
  if (!source) return null;
  const x = Number(source[0]);
  const y = Number(source[1]);
  const z = Number(source[2]);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return null;
  return [x, y, z];
}

export function readExecutiveSceneObjects(sceneJson: unknown): unknown[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? objects : [];
}

export function buildExecutiveSceneObjectSignature(
  sceneJson: unknown,
  layoutPositions?: Record<string, [number, number, number]>
): string {
  const objects = readExecutiveSceneObjects(sceneJson);
  if (!objects.length) return "empty";
  return objects
    .map((obj, index) => {
      const record = obj as { id?: unknown; name?: unknown; type?: unknown } | null;
      const id = String(record?.id ?? record?.name ?? `${record?.type ?? "obj"}:${index}`);
      const pos = readObjectPosition(obj, layoutPositions, index);
      if (!pos) return `${id}:na`;
      return `${id}:${pos.map((value) => Math.round(value * 100) / 100).join(",")}`;
    })
    .sort()
    .join("|");
}

export function computeExecutiveSceneBounds(
  sceneJson: unknown,
  layoutPositions?: Record<string, [number, number, number]>
): ExecutiveCameraBounds | null {
  const points = readExecutiveSceneObjects(sceneJson)
    .map((obj, index) => readObjectPosition(obj, layoutPositions, index))
    .filter((point): point is [number, number, number] => point != null);
  if (!points.length) return null;

  let minX = points[0][0];
  let minY = points[0][1];
  let minZ = points[0][2];
  let maxX = points[0][0];
  let maxY = points[0][1];
  let maxZ = points[0][2];

  for (const point of points) {
    minX = Math.min(minX, point[0]);
    minY = Math.min(minY, point[1]);
    minZ = Math.min(minZ, point[2]);
    maxX = Math.max(maxX, point[0]);
    maxY = Math.max(maxY, point[1]);
    maxZ = Math.max(maxZ, point[2]);
  }

  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
    center: [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2],
    size: [
      Math.max(0.75, maxX - minX),
      Math.max(0.75, maxY - minY),
      Math.max(0.75, maxZ - minZ),
    ],
  };
}

export function isValidExecutiveCameraFrame(frame: ExecutiveCameraFrame): boolean {
  return [...frame.position, ...frame.lookAt, frame.fov].every(Number.isFinite);
}

export function normalizeExecutiveCameraPresetId(
  preset: ExecutiveCameraPresetId
): Exclude<ExecutiveCameraPresetId, "GLOBAL_VIEW"> {
  if (preset === "GLOBAL_VIEW") return "GLOBAL";
  return preset;
}

export function getExecutiveCameraPresetDefinition(
  preset: ExecutiveCameraPresetId
): ExecutiveCameraPresetDefinition {
  const normalized = normalizeExecutiveCameraPresetId(preset);
  return EXECUTIVE_CAMERA_PRESET_REGISTRY[normalized];
}

export function listExecutiveCameraPresets(): ExecutiveCameraPresetDefinition[] {
  return Object.values(EXECUTIVE_CAMERA_PRESET_REGISTRY);
}

function buildPresetResultCacheKey(input: {
  preset: ExecutiveCameraPresetId;
  mode: WorkspaceViewMode;
  sceneSignature: string;
  viewportWidth?: number;
  viewportHeight?: number;
  focusObjectId?: string | null;
}): string {
  return JSON.stringify({
    preset: input.preset,
    mode: input.mode,
    sceneSignature: input.sceneSignature,
    viewportWidth: input.viewportWidth ?? null,
    viewportHeight: input.viewportHeight ?? null,
    focusObjectId: input.focusObjectId ?? null,
  });
}

export function resolveExecutiveCameraPresetFrame(input: {
  preset: ExecutiveCameraPresetId;
  mode: WorkspaceViewMode;
  sceneJson: unknown;
  viewportWidth?: number;
  viewportHeight?: number;
  focusObjectId?: string | null;
  layoutPositions?: Record<string, [number, number, number]>;
}): ExecutiveCameraFrame {
  const sceneSignature = buildExecutiveSceneObjectSignature(input.sceneJson, input.layoutPositions);
  const cacheKey = buildPresetResultCacheKey({ ...input, sceneSignature });
  const cached = presetResultCache.get(cacheKey);
  if (cached) return cached;

  const mode =
    input.preset === "VIEW_2D" ? "2D" : input.preset === "VIEW_3D" ? "3D" : input.mode;

  const objects = readExecutiveSceneObjects(input.sceneJson);
  const useOperationalLayout =
    shouldUseExecutiveOperationalLayout(objects.length) &&
    (input.preset === "FIT_SCENE" || input.preset === "VIEW_2D" || input.preset === "VIEW_3D" || input.preset === "EXECUTIVE");

  if (useOperationalLayout || (input.layoutPositions && Object.keys(input.layoutPositions).length > 0)) {
    const fit = input.layoutPositions && Object.keys(input.layoutPositions).length > 0
      ? fitCameraToSceneObjects({
          objects,
          mode,
          viewportWidth: input.viewportWidth,
          viewportHeight: input.viewportHeight,
          layoutPositions: input.layoutPositions,
        })
      : resolveExecutiveOperationalLayoutCameraFit({
          objects,
          mode,
          viewportWidth: input.viewportWidth,
          viewportHeight: input.viewportHeight,
        });
    presetResultCache.set(cacheKey, fit.frame);
    if (input.preset === "FIT_SCENE") {
      logExecutiveCameraPreset("FIT_SCENE", {
        mode,
        radius: fit.radius,
        center: fit.center,
        position: fit.frame.position,
        lookAt: fit.frame.lookAt,
        objectCount: objects.length,
      });
    }
    return fit.frame;
  }

  const framing = resolveExecutiveSceneFraming({
    sceneJson: input.sceneJson,
    preset: input.preset,
    mode: input.mode,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
    focusObjectId: input.focusObjectId,
  });
  if (!framing) {
    const fallback = resolveExecutiveDefaultCameraForMode(input.mode);
    presetResultCache.set(cacheKey, fallback);
    return fallback;
  }

  const bounds = framing.bounds;
  const presetDef = getExecutiveCameraPresetDefinition(input.preset);
  const viewportAdjustments = resolveExecutiveViewportFramingAdjustments(
    input.viewportWidth,
    input.viewportHeight
  );
  const composition = applyExecutiveCompositionQuality({
    center: bounds.center,
    size: bounds.size,
    verticalCompositionBias: viewportAdjustments.verticalCompositionBias + (presetDef.verticalBias ?? 0),
    horizontalCompositionBias: viewportAdjustments.horizontalCompositionBias + (presetDef.horizontalBias ?? 0),
    timelineClearance: presetDef.timelineClearance,
  });

  const objectCount = readExecutiveSceneObjects(input.sceneJson).length;
  const framingMode = mode;
  const radius =
    framing.cameraRadius *
    presetDef.radiusMultiplier *
    viewportAdjustments.radiusScale *
    (presetDef.compositionPadding ?? 1) /
    (viewportAdjustments.compositionPadding || 1);

  const focusAnchor =
    input.preset === "FOCUS" && input.focusObjectId
      ? resolveSceneObjectHudPosition(input.sceneJson, input.focusObjectId)
      : null;
  const framedBounds: ExecutiveCameraBounds = focusAnchor
    ? {
        ...bounds,
        center: focusAnchor,
      }
    : {
        ...bounds,
        center: composition.lookAt,
      };

  const frame = resolveExecutiveCameraFrameForMode(framingMode, framedBounds, radius, {
    horizontalBias: presetDef.horizontalBias,
    verticalBias: presetDef.verticalBias,
    pullback: presetDef.pullback,
  });

  if (focusAnchor && presetDef.focusDistanceScale) {
    const [px, py, pz] = frame.position;
    const [tx, ty, tz] = frame.lookAt;
    const dx = px - tx;
    const dy = py - ty;
    const dz = pz - tz;
    const scale = presetDef.focusDistanceScale;
    frame.position = [tx + dx * scale, ty + dy * scale, tz + dz * scale];
  }

  frame.fov = Math.max(
    18,
    Math.min(58, frame.fov + (presetDef.fovOffset ?? 0) + (viewportAdjustments.fovScale - 1) * 8)
  );

  presetResultCache.set(cacheKey, frame);
  logExecutiveCameraPreset(cacheKey, {
    preset: presetDef.id,
    mode,
    viewportClass: viewportAdjustments.viewportClass,
    objectCount,
    focusObjectId: input.focusObjectId ?? null,
    position: frame.position,
    lookAt: frame.lookAt,
    fov: frame.fov,
    purpose: presetDef.purpose,
    framingSignature: framing.signature,
    readabilityScore: framing.readabilityScore,
    emptySpaceRatio: framing.emptySpaceRatio,
    layoutPreset: framing.layoutPreset,
  });
  return frame;
}

export function resetExecutiveCameraPresetRegistryForTests(): void {
  presetResultCache.clear();
  resetExecutiveSceneFramingForTests();
}
