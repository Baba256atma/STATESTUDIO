import {
  computeExecutiveSceneBounds,
  readExecutiveSceneObjects,
  type ExecutiveCameraBounds,
} from "../camera/executiveCameraPresetRegistry";
import { readSceneRelationshipEdges } from "../interaction/executiveRelationshipExplorationRuntime";
import type { ExecutiveSceneBoundsKind, ExecutiveSceneBoundsSnapshot } from "./executiveSceneFramingTypes";

export type SceneObjectPosition = {
  id: string;
  position: [number, number, number];
  tags: string[];
  role: string;
  riskKind: string;
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

function readObjectRecord(obj: unknown, index: number): SceneObjectPosition | null {
  const record = obj as {
    id?: unknown;
    name?: unknown;
    type?: unknown;
    tags?: unknown;
    role?: unknown;
    risk_kind?: unknown;
  } | null;
  const position = readObjectPosition(obj);
  if (!position) return null;
  const id = String(record?.id ?? record?.name ?? `${record?.type ?? "obj"}:${index}`).trim();
  if (!id) return null;
  const tags = Array.isArray(record?.tags) ? record.tags.map((tag) => String(tag).toLowerCase()) : [];
  return {
    id,
    position,
    tags,
    role: String(record?.role ?? "").toLowerCase(),
    riskKind: String(record?.risk_kind ?? "").toLowerCase(),
  };
}

export function readExecutiveSceneObjectPositions(sceneJson: unknown): SceneObjectPosition[] {
  return readExecutiveSceneObjects(sceneJson)
    .map(readObjectRecord)
    .filter((entry): entry is SceneObjectPosition => entry != null);
}

function computeBoundsSpan(size: [number, number, number]): number {
  return Math.max(size[0] ?? 0, size[1] ?? 0, size[2] ?? 0, 0.75);
}

function computeBoundsFromPositions(
  positions: [number, number, number][],
  minSizeFloor = 0.75
): ExecutiveCameraBounds & { min: [number, number, number]; max: [number, number, number] } | null {
  if (!positions.length) return null;

  let minX = positions[0][0];
  let minY = positions[0][1];
  let minZ = positions[0][2];
  let maxX = positions[0][0];
  let maxY = positions[0][1];
  let maxZ = positions[0][2];

  for (const point of positions) {
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
      Math.max(minSizeFloor, maxX - minX),
      Math.max(minSizeFloor, maxY - minY),
      Math.max(minSizeFloor, maxZ - minZ),
    ],
  };
}

function toBoundsSnapshot(
  kind: ExecutiveSceneBoundsKind,
  bounds: ExecutiveCameraBounds & { min?: [number, number, number]; max?: [number, number, number] },
  objectCount: number
): ExecutiveSceneBoundsSnapshot {
  const min = bounds.min ?? [
    bounds.center[0] - bounds.size[0] / 2,
    bounds.center[1] - bounds.size[1] / 2,
    bounds.center[2] - bounds.size[2] / 2,
  ];
  const max = bounds.max ?? [
    bounds.center[0] + bounds.size[0] / 2,
    bounds.center[1] + bounds.size[1] / 2,
    bounds.center[2] + bounds.size[2] / 2,
  ];
  return {
    kind,
    min,
    max,
    center: bounds.center,
    size: bounds.size,
    span: computeBoundsSpan(bounds.size),
    objectCount,
  };
}

function resolveObjectPositionsByIds(
  objects: SceneObjectPosition[],
  ids: Set<string> | null
): SceneObjectPosition[] {
  if (!ids || ids.size === 0) return objects;
  return objects.filter((object) => ids.has(object.id));
}

export function analyzeExecutiveSceneBounds(input: {
  sceneJson: unknown;
  visibleObjectIds?: string[] | null;
  activeObjectIds?: string[] | null;
  focusObjectId?: string | null;
}): {
  objects: SceneObjectPosition[];
  object: ExecutiveSceneBoundsSnapshot | null;
  visible: ExecutiveSceneBoundsSnapshot | null;
  active: ExecutiveSceneBoundsSnapshot | null;
  relationship: ExecutiveSceneBoundsSnapshot | null;
  signature: string;
} {
  const objects = readExecutiveSceneObjectPositions(input.sceneJson);
  const visibleIds = input.visibleObjectIds?.length
    ? new Set(input.visibleObjectIds.map((id) => String(id).trim()).filter(Boolean))
    : null;
  const activeIds = new Set<string>();
  const focusId = input.focusObjectId?.trim();
  if (focusId) activeIds.add(focusId);
  (input.activeObjectIds ?? []).forEach((id) => {
    const trimmed = String(id).trim();
    if (trimmed) activeIds.add(trimmed);
  });

  const visibleObjects = resolveObjectPositionsByIds(objects, visibleIds);
  const activeObjects = resolveObjectPositionsByIds(objects, activeIds.size > 0 ? activeIds : null);

  const objectBounds = computeBoundsFromPositions(objects.map((entry) => entry.position));
  const visibleBounds = computeBoundsFromPositions(visibleObjects.map((entry) => entry.position));
  const activeBounds =
    activeObjects.length > 0
      ? computeBoundsFromPositions(activeObjects.map((entry) => entry.position))
      : null;

  const relationshipPositions: [number, number, number][] = [];
  const objectById = new Map(objects.map((entry) => [entry.id, entry]));
  readSceneRelationshipEdges(input.sceneJson).forEach(({ sourceId, targetId }) => {
    const source = objectById.get(sourceId);
    const target = objectById.get(targetId);
    if (source) relationshipPositions.push(source.position);
    if (target) relationshipPositions.push(target.position);
  });
  const relationshipBounds =
    relationshipPositions.length > 0 ? computeBoundsFromPositions(relationshipPositions) : null;

  const signature = [
    objects.length,
    visibleObjects.length,
    activeObjects.length,
    relationshipPositions.length,
    objectBounds ? computeBoundsSpan(objectBounds.size).toFixed(1) : "na",
    visibleBounds ? computeBoundsSpan(visibleBounds.size).toFixed(1) : "na",
  ].join("|");

  return {
    objects,
    object: objectBounds ? toBoundsSnapshot("object", objectBounds, objects.length) : null,
    visible: visibleBounds
      ? toBoundsSnapshot("visible", visibleBounds, visibleObjects.length)
      : objectBounds
        ? toBoundsSnapshot("visible", objectBounds, objects.length)
        : null,
    active: activeBounds ? toBoundsSnapshot("active", activeBounds, activeObjects.length) : null,
    relationship: relationshipBounds
      ? toBoundsSnapshot("relationship", relationshipBounds, relationshipPositions.length)
      : null,
    signature,
  };
}

export function mergeExecutiveBounds(
  primary: ExecutiveCameraBounds & { min: [number, number, number]; max: [number, number, number] },
  secondary: ExecutiveCameraBounds & { min: [number, number, number]; max: [number, number, number] } | null
): ExecutiveCameraBounds & { min: [number, number, number]; max: [number, number, number] } {
  if (!secondary) return primary;
  const min: [number, number, number] = [
    Math.min(primary.min[0], secondary.min[0]),
    Math.min(primary.min[1], secondary.min[1]),
    Math.min(primary.min[2], secondary.min[2]),
  ];
  const max: [number, number, number] = [
    Math.max(primary.max[0], secondary.max[0]),
    Math.max(primary.max[1], secondary.max[1]),
    Math.max(primary.max[2], secondary.max[2]),
  ];
  return {
    min,
    max,
    center: [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2],
    size: [Math.max(0.75, max[0] - min[0]), Math.max(0.75, max[1] - min[1]), Math.max(0.75, max[2] - min[2])],
  };
}

export function computeTightFormationBounds(
  positions: [number, number, number][],
  objectCount: number
): ExecutiveCameraBounds & { min: [number, number, number]; max: [number, number, number] } {
  if (!positions.length) {
    return {
      min: [-0.75, -0.75, -0.75],
      max: [0.75, 0.75, 0.75],
      center: [0, 0, 0],
      size: [1.5, 1.5, 1.5],
    };
  }

  const cx = positions.reduce((sum, point) => sum + point[0], 0) / positions.length;
  const cy = positions.reduce((sum, point) => sum + point[1], 0) / positions.length;
  const cz = positions.reduce((sum, point) => sum + point[2], 0) / positions.length;
  let maxDist = 0;
  for (const point of positions) {
    maxDist = Math.max(maxDist, Math.hypot(point[0] - cx, point[1] - cy, point[2] - cz));
  }

  const minRadius =
    objectCount <= 1 ? 0.62 : objectCount <= 5 ? 0.78 : objectCount <= 10 ? 0.92 : objectCount <= 25 ? 1.05 : 1.18;
  const padding =
    objectCount <= 10 ? 1.18 : objectCount <= 50 ? 1.28 : objectCount <= 100 ? 1.36 : 1.44;
  const aabbHalf = Math.max(
    Math.max(...positions.map((point) => point[0])) - Math.min(...positions.map((point) => point[0])),
    Math.max(...positions.map((point) => point[1])) - Math.min(...positions.map((point) => point[1])),
    Math.max(...positions.map((point) => point[2])) - Math.min(...positions.map((point) => point[2])),
    minRadius * 2
  ) / 2;
  const sparseCap = objectCount <= 10 ? 0.88 : objectCount <= 25 ? 0.94 : 1;
  const radius = Math.max(minRadius, Math.min(maxDist * padding, aabbHalf * sparseCap));
  return {
    min: [cx - radius, cy - radius, cz - radius],
    max: [cx + radius, cy + radius, cz + radius],
    center: [cx, cy, cz],
    size: [radius * 2, radius * 2, radius * 2],
  };
}

export function fallbackExecutiveSceneBounds(sceneJson: unknown): ExecutiveCameraBounds | null {
  return computeExecutiveSceneBounds(sceneJson);
}
