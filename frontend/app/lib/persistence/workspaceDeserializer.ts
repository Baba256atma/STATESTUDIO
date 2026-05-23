import type { NexoraRelationship } from "../relationships/relationshipTypes";
import { isNexoraRelationship } from "../relationships/relationshipValidation";
import type { SceneJson, SceneObject, Vector3Tuple } from "../sceneTypes";
import { placementPositionToVector, registerSceneObjectPlacement } from "../modeling/objectPlacementRuntime";
import type {
  SavedWorkspace,
  SavedWorkspaceObject,
  SavedWorkspaceRelationship,
} from "./workspacePersistenceTypes";
import type { PropagationPath } from "../propagation/propagationAuthoringRuntime";
import { logWorkspaceDeserialized, logWorkspaceRestored } from "./workspacePersistenceInstrumentation";

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function restoreWorkspaceObject(saved: SavedWorkspaceObject): SceneObject | null {
  const id = saved.id.trim();
  if (!id) return null;
  const metadata = saved.metadata ?? {};
  const label = saved.label.trim() || id;
  const rawPosition = saved.placement?.position ?? saved.position;
  const position: Vector3Tuple | undefined = Array.isArray(rawPosition)
    ? rawPosition
    : rawPosition && typeof rawPosition === "object"
      ? placementPositionToVector(rawPosition)
      : undefined;

  const object: SceneObject = {
    id,
    label,
    name: label,
    category: saved.category,
    type: typeof metadata.type === "string" ? metadata.type : "box",
    role: typeof metadata.role === "string" ? metadata.role : undefined,
    position,
    pos: position,
    scale: typeof metadata.scale === "number" ? metadata.scale : undefined,
    emphasis: typeof metadata.emphasis === "number" ? metadata.emphasis : undefined,
    description: typeof metadata.description === "string" ? metadata.description : undefined,
    business_meaning: typeof metadata.business_meaning === "string" ? metadata.business_meaning : undefined,
    status: typeof metadata.status === "string" ? metadata.status : undefined,
    importance: typeof metadata.importance === "number" ? metadata.importance : undefined,
    riskLevel: typeof metadata.riskLevel === "number" ? metadata.riskLevel : undefined,
    risk_level: typeof metadata.risk_level === "number" ? metadata.risk_level : undefined,
    tags: Array.isArray(metadata.tags) ? (metadata.tags as string[]) : undefined,
    semantic:
      metadata.semantic && typeof metadata.semantic === "object"
        ? (metadata.semantic as SceneObject["semantic"])
        : saved.category
          ? { category: saved.category, display_label: label }
          : undefined,
    ux:
      metadata.ux && typeof metadata.ux === "object"
        ? (metadata.ux as SceneObject["ux"])
        : undefined,
    domain: typeof metadata.domain === "string" ? metadata.domain : undefined,
    meta: {
      ...metadata,
      source: metadata.source ?? "workspace_restore",
      restoredAt: new Date().toISOString(),
    },
  };
  registerSceneObjectPlacement(object);
  return object;
}

function restoreWorkspaceRelationship(saved: SavedWorkspaceRelationship): NexoraRelationship | null {
  const sourceId = saved.sourceId.trim();
  const targetId = saved.targetId.trim();
  if (!sourceId || !targetId || !saved.id) return null;

  const relationship: NexoraRelationship = {
    id: saved.id,
    sourceId,
    targetId,
    type: saved.type as NexoraRelationship["type"],
    direction: saved.direction === "bi" ? "bi" : "uni",
    metadata: saved.metadata,
    createdAt: String(saved.metadata?.createdAt ?? new Date().toISOString()),
  };

  return isNexoraRelationship(relationship) ? relationship : null;
}

export function deserializeWorkspaceToScene(
  saved: SavedWorkspace,
  currentScene: unknown
): SceneJson {
  const base: SceneJson = isSceneJson(currentScene)
    ? currentScene
    : { state_vector: {}, scene: { objects: [], loops: [], relationships: [] } };

  const objects = saved.objects
    .map(restoreWorkspaceObject)
    .filter((object): object is SceneObject => object != null);

  const relationships = saved.relationships
    .map(restoreWorkspaceRelationship)
    .filter((relationship): relationship is NexoraRelationship => relationship != null);
  const propagationPaths = Array.isArray(saved.propagationPaths)
    ? (saved.propagationPaths.filter((path) => path && typeof path === "object") as PropagationPath[])
    : [];

  logWorkspaceDeserialized({
    workspaceId: saved.id,
    objectCount: objects.length,
    relationshipCount: relationships.length,
  });

  const nextScene: SceneJson = {
    ...base,
    state_vector: base.state_vector ?? {},
    meta: {
      ...(base.meta ?? {}),
      ...(saved.metadata ?? {}),
      savedWorkspaceId: saved.id,
      savedWorkspaceName: saved.name,
      lastWorkspaceLoadedAt: new Date().toISOString(),
      systemBlueprint: saved.metadata?.systemBlueprint ?? base.meta?.systemBlueprint,
    },
    scene: {
      ...base.scene,
      objects,
      relationships,
      propagationPaths,
      loops: Array.isArray(base.scene.loops) ? base.scene.loops : [],
    },
  };

  logWorkspaceRestored({
    workspaceId: saved.id,
    objectCount: objects.length,
    relationshipCount: relationships.length,
  });

  return nextScene;
}

export function toWorkspacePreview(saved: SavedWorkspace) {
  return {
    id: saved.id,
    name: saved.name,
    objectCount: saved.objects.length,
    relationshipCount: saved.relationships.length,
    createdAt: saved.createdAt,
    updatedAt: saved.updatedAt,
    version: saved.version,
  };
}
