import {
  calculateExecutiveCameraDistance,
  countSceneRelationships,
} from "./executiveSceneComposition";
import type { ExecutiveCameraFrame } from "./camera/executive2DCameraProfile";
import {
  resolveExecutiveCameraFrameForMode,
  resolveExecutiveDefaultCameraForMode,
} from "../workspace/workspaceModeTransitionRuntime";
import type { WorkspaceViewMode } from "../workspace/workspaceViewModeTypes";

export type ExecutiveCameraPresetId = "GLOBAL_VIEW" | "VIEW_2D" | "VIEW_3D" | "FIT_SCENE";

export type ExecutiveCameraBounds = {
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  size: [number, number, number];
};

function readObjectPosition(obj: unknown): [number, number, number] | null {
  const record = obj as { transform?: { pos?: unknown }; position?: unknown } | null;
  const transformPos = record?.transform?.pos;
  const position = record?.position;
  const source =
    Array.isArray(transformPos) && transformPos.length >= 3
      ? transformPos
      : Array.isArray(position) && position.length >= 3
        ? position
        : null;
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

export function buildExecutiveSceneObjectSignature(sceneJson: unknown): string {
  const objects = readExecutiveSceneObjects(sceneJson);
  if (!objects.length) return "empty";
  return objects
    .map((obj, index) => {
      const record = obj as { id?: unknown; name?: unknown; type?: unknown } | null;
      const id = String(record?.id ?? record?.name ?? `${record?.type ?? "obj"}:${index}`);
      const pos = readObjectPosition(obj);
      if (!pos) return `${id}:na`;
      return `${id}:${pos.map((value) => Math.round(value * 100) / 100).join(",")}`;
    })
    .sort()
    .join("|");
}

export function computeExecutiveSceneBounds(sceneJson: unknown): ExecutiveCameraBounds | null {
  const points = readExecutiveSceneObjects(sceneJson)
    .map(readObjectPosition)
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

export function resolveExecutiveCameraPresetFrame(input: {
  preset: ExecutiveCameraPresetId;
  mode: WorkspaceViewMode;
  sceneJson: unknown;
  viewportWidth?: number;
  viewportHeight?: number;
}): ExecutiveCameraFrame {
  const bounds = computeExecutiveSceneBounds(input.sceneJson);
  if (!bounds) return resolveExecutiveDefaultCameraForMode(input.mode);

  const objectCount = readExecutiveSceneObjects(input.sceneJson).length;
  const distance = calculateExecutiveCameraDistance({
    objectCount,
    relationshipCount: countSceneRelationships(input.sceneJson),
    boundsSize: bounds.size,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
  });
  const mode =
    input.preset === "VIEW_2D" ? "2D" : input.preset === "VIEW_3D" ? "3D" : input.mode;
  const radius =
    input.preset === "GLOBAL_VIEW"
      ? distance.distance * 1.08
      : input.preset === "FIT_SCENE"
        ? distance.distance * 1.02
        : distance.distance;

  return resolveExecutiveCameraFrameForMode(mode, bounds, radius, {
    pullback: input.preset === "GLOBAL_VIEW" ? 1.16 : undefined,
  });
}
