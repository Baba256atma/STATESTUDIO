import type { SceneJson, SceneObject, Vector3Tuple } from "../sceneTypes";

/**
 * ARCHITECTURE NOTE:
 * Object placement runtime may mirror the selected object for drag/placement
 * diagnostics, but it is not the canonical Object Panel selection store.
 * Direct object creation or mutation must not originate from Object Panel actions.
 * See docs/nexora-object-panel-architecture.md.
 */
export type SceneObjectPlacement = {
  id: string;
  objectType: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
  scale?: number;
};

export type ObjectPlacementRuntimeSnapshot = {
  selectedObjectId: string | null;
  objects: SceneObjectPlacement[];
};

const SCENE_PLACEMENT_BOUNDS = Object.freeze({
  minX: -8.5,
  maxX: 8.5,
  minY: -2.5,
  maxY: 2.5,
  minZ: -8.5,
  maxZ: 8.5,
});

let selectedObjectId: string | null = null;
const placementsById = new Map<string, SceneObjectPlacement>();
const diagnosticKeys = new Set<string>();

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals = 3): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function logPlacementDiagnostic(label: string, placement: SceneObjectPlacement | null, key: string): void {
  if (process.env.NODE_ENV === "production") return;
  const dedupeKey = `${label}:${key}`;
  if (diagnosticKeys.has(dedupeKey)) return;
  diagnosticKeys.add(dedupeKey);
  console.info(label, {
    objectId: placement?.id ?? selectedObjectId,
    objectType: placement?.objectType ?? null,
    position: placement?.position ?? null,
  });
}

export function vectorToPlacementPosition(position: Vector3Tuple | undefined | null): SceneObjectPlacement["position"] {
  return clampSceneObjectPosition({
    x: Number(position?.[0] ?? 0),
    y: Number(position?.[1] ?? 0),
    z: Number(position?.[2] ?? 0),
  });
}

export function placementPositionToVector(position: SceneObjectPlacement["position"]): Vector3Tuple {
  const clamped = clampSceneObjectPosition(position);
  return [clamped.x, clamped.y, clamped.z];
}

export function clampSceneObjectPosition(position: SceneObjectPlacement["position"]): SceneObjectPlacement["position"] {
  return {
    x: round(clamp(position.x, SCENE_PLACEMENT_BOUNDS.minX, SCENE_PLACEMENT_BOUNDS.maxX)),
    y: round(clamp(position.y, SCENE_PLACEMENT_BOUNDS.minY, SCENE_PLACEMENT_BOUNDS.maxY)),
    z: round(clamp(position.z, SCENE_PLACEMENT_BOUNDS.minZ, SCENE_PLACEMENT_BOUNDS.maxZ)),
  };
}

function placementFromSceneObject(object: SceneObject): SceneObjectPlacement | null {
  const id = String(object.id ?? "").trim();
  if (!id) return null;
  const position = object.position ?? object.pos ?? [0, 0, 0];
  const rotation = (object.rotation ?? (object.transform as { rot?: Vector3Tuple } | undefined)?.rot) as
    | Vector3Tuple
    | undefined;
  return {
    id,
    objectType: String(object.type ?? object.role ?? object.category ?? "object"),
    position: vectorToPlacementPosition(position),
    rotation: Array.isArray(rotation)
      ? { x: round(Number(rotation[0] ?? 0)), y: round(Number(rotation[1] ?? 0)), z: round(Number(rotation[2] ?? 0)) }
      : undefined,
    scale: typeof object.scale === "number" && Number.isFinite(object.scale) ? object.scale : undefined,
  };
}

function samePlacement(a: SceneObjectPlacement | undefined, b: SceneObjectPlacement): boolean {
  return (
    a?.id === b.id &&
    a.objectType === b.objectType &&
    a.position.x === b.position.x &&
    a.position.y === b.position.y &&
    a.position.z === b.position.z &&
    (a.scale ?? null) === (b.scale ?? null)
  );
}

export function registerSceneObjectPlacement(
  object: SceneObject,
  options?: { silent?: boolean }
): SceneObjectPlacement | null {
  const placement = placementFromSceneObject(object);
  if (!placement) return null;
  const previous = placementsById.get(placement.id);
  if (samePlacement(previous, placement)) return previous ?? placement;
  placementsById.set(placement.id, placement);
  if (options?.silent !== true) {
    logPlacementDiagnostic("[Nexora][ObjectPlaced]", placement, placement.id);
  }
  return placement;
}

export function registerSceneObjectPlacementsFromScene(sceneJson: unknown): void {
  const objects = Array.isArray((sceneJson as SceneJson | null)?.scene?.objects)
    ? ((sceneJson as SceneJson).scene.objects as SceneObject[])
    : [];
  const liveIds = new Set<string>();
  objects.forEach((object) => {
    const placement = registerSceneObjectPlacement(object, { silent: true });
    if (placement) liveIds.add(placement.id);
  });
  Array.from(placementsById.keys()).forEach((id) => {
    if (!liveIds.has(id)) placementsById.delete(id);
  });
  if (selectedObjectId && !liveIds.has(selectedObjectId)) selectedObjectId = null;
}

export function selectPlacedObject(objectId: string | null): void {
  const id = objectId?.trim() || null;
  if (!id) {
    deselectPlacedObject();
    return;
  }
  selectedObjectId = id;
  logPlacementDiagnostic("[Nexora][ObjectSelected]", placementsById.get(id) ?? null, id);
}

export function deselectPlacedObject(): void {
  if (!selectedObjectId) return;
  const previousId = selectedObjectId;
  const placement = placementsById.get(previousId) ?? null;
  selectedObjectId = null;
  logPlacementDiagnostic("[Nexora][ObjectDeselected]", placement, previousId);
}

export function movePlacedObject(
  objectId: string,
  position: SceneObjectPlacement["position"],
  phase: "drag" | "move" = "move"
): SceneObjectPlacement | null {
  const id = objectId.trim();
  if (!id) return null;
  const previous = placementsById.get(id);
  const next: SceneObjectPlacement = {
    id,
    objectType: previous?.objectType ?? "object",
    position: clampSceneObjectPosition(position),
    rotation: previous?.rotation,
    scale: previous?.scale,
  };
  if (samePlacement(previous, next)) return previous ?? next;
  placementsById.set(id, next);
  logPlacementDiagnostic(
    phase === "drag" ? "[Nexora][ObjectDragged]" : "[Nexora][ObjectMoved]",
    next,
    phase === "drag" ? id : `${id}:${next.position.x}:${next.position.y}:${next.position.z}`
  );
  return next;
}

export function applyObjectPlacementToScene(
  sceneJson: SceneJson | null,
  objectId: string,
  position: SceneObjectPlacement["position"],
  phase: "drag" | "move" = "move"
): SceneJson | null {
  if (!sceneJson?.scene || !Array.isArray(sceneJson.scene.objects)) return sceneJson;
  const id = objectId.trim();
  if (!id) return sceneJson;
  const moved = movePlacedObject(id, position, phase);
  if (!moved) return sceneJson;
  const nextVector = placementPositionToVector(moved.position);
  let changed = false;
  const objects = sceneJson.scene.objects.map((object) => {
    if (String(object.id ?? "").trim() !== id) return object;
    const prev = object.position ?? object.pos;
    if (Array.isArray(prev) && prev[0] === nextVector[0] && prev[1] === nextVector[1] && prev[2] === nextVector[2]) {
      return object;
    }
    changed = true;
    return {
      ...object,
      position: nextVector,
      pos: nextVector,
      meta: {
        ...((object.meta as Record<string, unknown> | undefined) ?? {}),
        placementUpdatedAt: new Date().toISOString(),
      },
    };
  });
  if (!changed) return sceneJson;
  return {
    ...sceneJson,
    scene: {
      ...sceneJson.scene,
      objects,
    },
  };
}

export function resetObjectPlacementsToGlobalLayout(
  sceneJson: SceneJson | null,
  layoutPositions?: Record<string, [number, number, number]>
): void {
  if (!sceneJson?.scene || !Array.isArray(sceneJson.scene.objects)) return;
  sceneJson.scene.objects.forEach((object, index) => {
    const id = String(object.id ?? "").trim();
    if (!id) return;
    const layoutPosition =
      layoutPositions?.[id] ??
      (object.name != null ? layoutPositions?.[String(object.name)] : undefined);
    const fallback: Vector3Tuple = [index * 1.8 - 1.8, 0, 0];
    const target = layoutPosition ?? fallback;
    movePlacedObject(id, vectorToPlacementPosition(target), "move");
  });
}

export function getObjectPlacementRuntimeSnapshot(): ObjectPlacementRuntimeSnapshot {
  return {
    selectedObjectId,
    objects: Array.from(placementsById.values()),
  };
}

export function resetObjectPlacementRuntimeForTests(): void {
  selectedObjectId = null;
  placementsById.clear();
  diagnosticKeys.clear();
}
