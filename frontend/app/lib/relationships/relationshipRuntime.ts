import {
  logRelationshipBuilderClosed,
  logRelationshipBuilderOpened,
  logRelationshipCreated,
  logRelationshipPreview,
  logRelationshipValidated,
} from "./relationshipInstrumentation";
import { getRelationshipTypeDefinition, resolveRelationshipDirectionLabel } from "./relationshipRegistry";
import type {
  NexoraRelationship,
  ObjectRelationshipSummary,
  RelationshipCreateRequest,
  RelationshipCreateResult,
  RelationshipPreviewModel,
  SceneRelationshipEdge,
} from "./relationshipTypes";
import {
  isNexoraRelationship,
  relationshipSignature,
  validateRelationshipCreateRequest,
} from "./relationshipValidation";
import type { SceneJson, SceneObject } from "../sceneTypes";

export const RELATIONSHIP_BUILDER_OPEN_EVENT = "nexora:relationship-builder-open";
export const RELATIONSHIP_BUILDER_CLOSE_EVENT = "nexora:relationship-builder-close";

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function sceneObjects(scene: SceneJson): SceneObject[] {
  return Array.isArray(scene.scene.objects) ? scene.scene.objects : [];
}

function readRelationshipsFromScene(scene: SceneJson): NexoraRelationship[] {
  const raw = (scene.scene as { relationships?: unknown }).relationships;
  if (!Array.isArray(raw)) return [];
  return raw.filter(isNexoraRelationship);
}

function objectLabel(object: SceneObject): string {
  return String(object.label ?? object.name ?? object.id ?? "").trim() || String(object.id);
}

export function buildSceneObjectLabelMap(sceneJson: unknown): Map<string, string> {
  const map = new Map<string, string>();
  if (!isSceneJson(sceneJson)) return map;
  sceneObjects(sceneJson).forEach((object) => {
    const id = String(object.id ?? "").trim();
    if (!id) return;
    map.set(id, objectLabel(object));
  });
  return map;
}

export function readSceneRelationships(sceneJson: unknown): NexoraRelationship[] {
  if (!isSceneJson(sceneJson)) return [];
  return readRelationshipsFromScene(sceneJson);
}

export function formatRelationshipSummary(
  relationship: NexoraRelationship,
  labels: Map<string, string>
): string {
  const source = labels.get(relationship.sourceId) ?? relationship.sourceId;
  const target = labels.get(relationship.targetId) ?? relationship.targetId;
  const typeLabel = getRelationshipTypeDefinition(relationship.type)?.label ?? relationship.type;
  const arrow = relationship.direction === "bi" ? "↔" : "→";
  return `${source} ${arrow} ${target} (${typeLabel})`;
}

export function summarizeObjectRelationships(
  sceneJson: unknown,
  objectId: string | null | undefined
): ObjectRelationshipSummary {
  const selectedId = String(objectId ?? "").trim();
  if (!selectedId) return { incoming: [], outgoing: [], count: 0 };

  const relationships = readSceneRelationships(sceneJson);
  const labels = buildSceneObjectLabelMap(sceneJson);
  const incoming: string[] = [];
  const outgoing: string[] = [];

  relationships.forEach((relationship) => {
    if (relationship.sourceId === selectedId) {
      outgoing.push(formatRelationshipSummary(relationship, labels));
    }
    if (relationship.targetId === selectedId) {
      incoming.push(formatRelationshipSummary(relationship, labels));
    }
    if (relationship.direction === "bi" && relationship.targetId === selectedId) {
      if (!incoming.some((entry) => entry.includes(relationship.sourceId))) {
        incoming.push(formatRelationshipSummary(relationship, labels));
      }
    }
  });

  return {
    incoming: incoming.slice(0, 4),
    outgoing: outgoing.slice(0, 4),
    count: relationships.filter(
      (rel) => rel.sourceId === selectedId || rel.targetId === selectedId
    ).length,
  };
}

export function buildRelationshipPreviewModel(input: {
  sourceId: string;
  targetId: string;
  type: NexoraRelationship["type"];
  direction?: NexoraRelationship["direction"];
  labels: Map<string, string>;
}): RelationshipPreviewModel | null {
  const sourceId = input.sourceId.trim();
  const targetId = input.targetId.trim();
  if (!sourceId || !targetId) return null;
  const typeDef = getRelationshipTypeDefinition(input.type);
  if (!typeDef) return null;
  const direction = input.direction ?? typeDef.defaultDirection;

  const preview: RelationshipPreviewModel = {
    sourceId,
    sourceLabel: input.labels.get(sourceId) ?? sourceId,
    targetId,
    targetLabel: input.labels.get(targetId) ?? targetId,
    type: input.type,
    typeLabel: typeDef.label,
    direction,
    directionLabel: resolveRelationshipDirectionLabel(direction),
  };

  logRelationshipPreview({
    sourceId,
    targetId,
    type: input.type,
    direction,
  });

  return preview;
}

export function createRelationshipId(
  type: NexoraRelationship["type"],
  sourceId: string,
  targetId: string
): string {
  const slug = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  return `rel_${type}_${slug(sourceId)}_${slug(targetId)}_${Date.now().toString(36)}`;
}

export function createNexoraRelationship(request: RelationshipCreateRequest): NexoraRelationship {
  const typeDef = getRelationshipTypeDefinition(request.type);
  const direction = request.direction ?? typeDef?.defaultDirection ?? "uni";
  return {
    id: createRelationshipId(request.type, request.sourceId, request.targetId),
    sourceId: request.sourceId.trim(),
    targetId: request.targetId.trim(),
    type: request.type,
    direction,
    metadata: request.metadata,
    createdAt: new Date().toISOString(),
  };
}

export function insertRelationshipIntoScene(
  currentScene: unknown,
  request: RelationshipCreateRequest
): RelationshipCreateResult & { nextScene?: SceneJson } {
  if (!isSceneJson(currentScene)) {
    return { success: false, errors: ["invalid_scene"] };
  }

  const objects = sceneObjects(currentScene);
  const validObjectIds = new Set(objects.map((object) => String(object.id ?? "").trim()).filter(Boolean));
  const existing = readRelationshipsFromScene(currentScene);
  const validation = validateRelationshipCreateRequest(request, existing, validObjectIds);

  logRelationshipValidated({
    valid: validation.valid,
    sourceId: request.sourceId,
    targetId: request.targetId,
    type: request.type,
    direction: request.direction ?? getRelationshipTypeDefinition(request.type)?.defaultDirection ?? "uni",
    reason: validation.errors[0] ?? validation.warnings[0],
  });

  if (!validation.valid) {
    return { success: false, errors: validation.errors, warnings: validation.warnings };
  }

  const relationship = createNexoraRelationship(request);
  const nextRelationships = [...existing, relationship];
  const nextScene: SceneJson = {
    ...currentScene,
    meta: {
      ...(currentScene.meta ?? {}),
      lastRelationshipCreatedAt: relationship.createdAt,
    },
    scene: {
      ...currentScene.scene,
      relationships: nextRelationships,
    },
  };

  logRelationshipCreated({
    relationshipId: relationship.id,
    sourceId: relationship.sourceId,
    targetId: relationship.targetId,
    type: relationship.type,
    direction: relationship.direction,
  });

  return {
    success: true,
    relationship,
    nextRelationships,
    nextScene,
    warnings: validation.warnings,
  };
}

/** Converts canonical relationships into overlay-compatible dependency edges. */
export function relationshipsToSceneEdges(sceneJson: unknown): SceneRelationshipEdge[] {
  const relationships = readSceneRelationships(sceneJson);
  const edges: SceneRelationshipEdge[] = [];

  relationships.forEach((relationship) => {
    const strength =
      relationship.type === "blocks"
        ? 0.72
        : relationship.type === "influences"
          ? 0.58
          : relationship.type === "dependency"
            ? 0.42
            : 0.34;

    edges.push({
      from: relationship.sourceId,
      to: relationship.targetId,
      strength,
      depth: 1,
      relationshipId: relationship.id,
      type: relationship.type,
      direction: relationship.direction,
    });

    if (relationship.direction === "bi") {
      edges.push({
        from: relationship.targetId,
        to: relationship.sourceId,
        strength: strength * 0.85,
        depth: 1,
        relationshipId: relationship.id,
        type: relationship.type,
        direction: relationship.direction,
      });
    }
  });

  return edges;
}

export function collectDependencyOverlayEdges(sceneJson: unknown): SceneRelationshipEdge[] {
  const edges: SceneRelationshipEdge[] = [...relationshipsToSceneEdges(sceneJson)];
  if (!isSceneJson(sceneJson)) return edges;

  sceneObjects(sceneJson).forEach((object, index) => {
    const objectId = String(object.id ?? object.name ?? `${object.type ?? "obj"}:${index}`).trim();
    if (!objectId) return;
    const deps = Array.isArray(object.dependencies) ? object.dependencies : [];
    deps.forEach((dep) => {
      const depId = String(dep ?? "").trim();
      if (!depId) return;
      edges.push({ from: objectId, to: depId, strength: 0.28, depth: 1, type: "dependency" });
    });
  });

  const seen = new Set<string>();
  return edges.filter((edge) => {
    const key = `${edge.from}->${edge.to}:${edge.type ?? "dependency"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function requestOpenRelationshipBuilder(source: string, sourceObjectId: string | null): void {
  if (typeof window === "undefined") return;
  logRelationshipBuilderOpened(source, sourceObjectId);
  window.dispatchEvent(
    new CustomEvent(RELATIONSHIP_BUILDER_OPEN_EVENT, {
      detail: { source, sourceObjectId },
    })
  );
}

export function requestCloseRelationshipBuilder(source: string): void {
  if (typeof window === "undefined") return;
  logRelationshipBuilderClosed(source);
  window.dispatchEvent(new CustomEvent(RELATIONSHIP_BUILDER_CLOSE_EVENT, { detail: { source } }));
}

export { relationshipSignature, validateRelationshipCreateRequest };
