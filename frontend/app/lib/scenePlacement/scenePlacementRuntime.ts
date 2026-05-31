import {
  logObjectCreated,
  logObjectFocused,
  logObjectPlaced,
  logPlacementValidated,
} from "../objectCatalog/objectCatalogInstrumentation";
import { registerSceneObjectPlacement } from "../modeling/objectPlacementRuntime";
import {
  evaluateCameraStability,
  resolveExecutiveBaseObjectScale,
  resolveSpacedCatalogPlacementPosition,
} from "../scene/density";
import type { CatalogObjectDefinition } from "../objectCatalog/objectCatalogTypes";
import type { SceneJson, SceneObject, Vector3Tuple } from "../sceneTypes";
import type {
  CreatedCatalogObjectMetadata,
  PlacementValidationResult,
  ScenePlacementRequest,
  ScenePlacementResult,
} from "./scenePlacementTypes";

export type {
  CreatedCatalogObjectMetadata,
  PlacementValidationResult,
  ScenePlacementRequest,
  ScenePlacementResult,
} from "./scenePlacementTypes";

const ROLE_TO_SCENE_TYPE: Record<string, string> = {
  core: "core",
  input: "node",
  process: "flow",
  constraint: "ring",
  risk: "shield",
  decision: "diamond",
  output: "sphere",
  monitor: "signal",
  flow: "flow",
};

const CATEGORY_SHAPE: Record<CatalogObjectDefinition["category"], string> = {
  operations: "box",
  finance: "sphere",
  project: "cone",
  strategy: "diamond",
  custom: "box",
};

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function sceneObjects(scene: SceneJson): SceneObject[] {
  return Array.isArray(scene.scene.objects) ? scene.scene.objects : [];
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function objectPosition(object: SceneObject): Vector3Tuple | null {
  const pos = object.position ?? (object as { pos?: Vector3Tuple }).pos;
  if (!Array.isArray(pos) || pos.length < 3) return null;
  return [Number(pos[0]) || 0, Number(pos[1]) || 0, Number(pos[2]) || 0];
}

function distance(a: Vector3Tuple, b: Vector3Tuple): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function buildOrbitCandidate(index: number): Vector3Tuple {
  if (index <= 0) return [0, 0, 0];
  const radius = 2.1 + Math.floor((index - 1) / 8) * 0.65;
  const angle = (index - 1) * 2.399963229728653;
  const y = ((index - 1) % 3 - 1) * 0.22;
  return [
    Number((Math.cos(angle) * radius).toFixed(3)),
    Number(y.toFixed(3)),
    Number((Math.sin(angle) * radius).toFixed(3)),
  ];
}

/** Resolve a non-overlapping placement within executive workspace bounds. */
export function resolveCatalogPlacementPosition(
  existingObjects: SceneObject[],
  startIndex: number,
  minDistance = 1.35
): PlacementValidationResult {
  const occupied = existingObjects
    .map(objectPosition)
    .filter((pos): pos is Vector3Tuple => pos != null);

  const spaced = resolveSpacedCatalogPlacementPosition(occupied, startIndex, {
    objectCount: existingObjects.length + 1,
  });
  if (occupied.every((pos) => distance(pos, spaced.position) >= Math.min(minDistance, 1.02))) {
    return { valid: true, position: spaced.position, reason: spaced.reason };
  }

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const position = buildOrbitCandidate(startIndex + attempt);
    const withinBounds = Math.hypot(position[0], position[2]) <= 8.5 && Math.abs(position[1]) <= 2.5;
    if (!withinBounds) continue;
    const overlaps = occupied.some((pos) => distance(pos, position) < minDistance);
    if (!overlaps) {
      return { valid: true, position, reason: "clear_orbit_slot" };
    }
  }

  const fallback = buildOrbitCandidate(startIndex + 24);
  return { valid: true, position: fallback, reason: "fallback_orbit_slot" };
}

export function createCatalogSceneObject(
  definition: CatalogObjectDefinition,
  position: Vector3Tuple,
  labelOverride?: string
): { object: SceneObject; metadata: CreatedCatalogObjectMetadata } {
  const label = (labelOverride ?? definition.label).trim() || definition.label;
  const slug = normalizeSlug(label);
  const uniqueSuffix = Date.now().toString(36);
  const id = `catalog_${definition.category}_${slug || definition.id}_${uniqueSuffix}`;
  const createdAt = new Date().toISOString();
  const role = definition.defaultRole ?? "core";
  const metadata: CreatedCatalogObjectMetadata = {
    id,
    label,
    category: definition.category,
    createdAt,
    source: "catalog",
  };

  const object: SceneObject = {
    id,
    label,
    name: label,
    type: ROLE_TO_SCENE_TYPE[role] ?? CATEGORY_SHAPE[definition.category] ?? "box",
    role,
    position,
    scale: resolveExecutiveBaseObjectScale({ role }),
    emphasis: Math.min(0.85, Math.max(0.2, definition.defaultSeverity ?? 0.4)),
    tags: ["catalog_object", definition.category, definition.id],
    semantic: {
      display_label: label,
      category: definition.category,
      role,
      business_meaning: definition.description,
      type: "catalog_object",
    },
    ux: {
      shape: CATEGORY_SHAPE[definition.category],
      base_color: definition.category === "strategy" ? "purple" : "blue",
    },
    meta: {
      ...metadata,
      catalogId: definition.id,
      ...definition.defaultMetadata,
    },
  };

  return { object, metadata };
}

export function insertCatalogObjectIntoScene(request: ScenePlacementRequest): ScenePlacementResult {
  if (!isSceneJson(request.currentScene)) {
    return { success: false, warnings: ["invalid_scene"] };
  }

  const objects = sceneObjects(request.currentScene);
  const placement = resolveCatalogPlacementPosition(objects, objects.length);
  const { object, metadata } = createCatalogSceneObject(
    request.definition,
    placement.position,
    request.label
  );

  logPlacementValidated({
    objectId: object.id,
    valid: placement.valid,
    reason: placement.reason,
  });

  const nextScene: SceneJson = {
    ...request.currentScene,
    meta: {
      ...(request.currentScene.meta ?? {}),
      lastCatalogObjectInsertedAt: metadata.createdAt,
    },
    scene: {
      ...request.currentScene.scene,
      objects: [...objects, object],
    },
  };

  logObjectCreated({
    objectId: object.id,
    category: metadata.category,
    source: "catalog",
  });
  logObjectPlaced({
    objectId: object.id,
    category: metadata.category,
    position: placement.position,
    source: "catalog",
  });
  registerSceneObjectPlacement(object);
  evaluateCameraStability({
    trigger: "object_created",
    previousObjectCount: objects.length,
    nextObjectCount: objects.length + 1,
  });

  return {
    success: true,
    nextScene,
    createdObjectId: object.id,
    position: placement.position,
    warnings: placement.reason ? [placement.reason] : undefined,
  };
}

/** Post-insert lifecycle hooks — select + camera focus via existing navigation contract. */
export function focusPlacedCatalogObject(
  objectId: string,
  focus: (id: string, source: "panel" | "toolbar" | "assistant" | "legacy") => void
): void {
  const trimmed = objectId.trim();
  if (!trimmed) return;
  logObjectFocused({ objectId: trimmed, source: "catalog" });
  focus(trimmed, "panel");
}
