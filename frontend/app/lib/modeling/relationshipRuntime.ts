import type { SceneJson } from "../sceneTypes";
import {
  getRelationshipTypeDefinition,
  resolveRelationshipDirectionLabel,
} from "../relationships/relationshipRegistry";
import {
  isNexoraRelationship,
  validateRelationshipCreateRequest,
} from "../relationships/relationshipValidation";
import type {
  NexoraRelationship,
  NexoraRelationshipDirection,
  NexoraRelationshipType,
  RelationshipCreateRequest,
  RelationshipCreateResult,
} from "../relationships/relationshipTypes";

export type SceneRelationship = {
  id: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType:
    | "dependency"
    | "flow"
    | "ownership"
    | "information"
    | "resource"
    | "risk";
  label?: string;
  strength?: number;
  createdAt: string;
};

export type RelationshipRuntimeSnapshot = {
  selectedRelationshipId: string | null;
  relationships: SceneRelationship[];
};

const diagnosticKeys = new Set<string>();
let selectedRelationshipId: string | null = null;

const SCENE_TO_NEXORA_TYPE: Record<SceneRelationship["relationshipType"], NexoraRelationshipType> = {
  dependency: "dependency",
  flow: "supplies",
  ownership: "owns",
  information: "influences",
  resource: "supports",
  risk: "blocks",
};

const NEXORA_TO_SCENE_TYPE: Record<NexoraRelationshipType, SceneRelationship["relationshipType"]> = {
  dependency: "dependency",
  flow: "flow",
  ownership: "ownership",
  information: "information",
  resource: "resource",
  risk: "risk",
  influences: "information",
  supplies: "flow",
  reports_to: "ownership",
  blocks: "risk",
  supports: "resource",
  owns: "ownership",
  custom: "dependency",
};

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function logRelationshipDiagnostic(
  label: string,
  relationship: Pick<NexoraRelationship, "id" | "sourceId" | "targetId" | "type"> | null,
  key: string
): void {
  if (process.env.NODE_ENV === "production") return;
  const dedupeKey = `${label}:${key}`;
  if (diagnosticKeys.has(dedupeKey)) return;
  diagnosticKeys.add(dedupeKey);
  console.info(label, {
    relationshipId: relationship?.id ?? selectedRelationshipId,
    source: relationship?.sourceId ?? null,
    target: relationship?.targetId ?? null,
    type: relationship?.type ?? null,
  });
}

function readNexoraRelationships(sceneJson: unknown): NexoraRelationship[] {
  if (!isSceneJson(sceneJson)) return [];
  const raw = (sceneJson.scene as { relationships?: unknown }).relationships;
  return Array.isArray(raw) ? raw.filter(isNexoraRelationship) : [];
}

function sceneRelationshipFromNexora(relationship: NexoraRelationship): SceneRelationship {
  return {
    id: relationship.id,
    sourceObjectId: relationship.sourceId,
    targetObjectId: relationship.targetId,
    relationshipType: NEXORA_TO_SCENE_TYPE[relationship.type] ?? "dependency",
    label:
      typeof relationship.metadata?.label === "string"
        ? relationship.metadata.label
        : getRelationshipTypeDefinition(relationship.type)?.label ?? relationship.type,
    strength:
      typeof relationship.metadata?.strength === "number"
        ? Math.max(0, Math.min(1, relationship.metadata.strength))
        : undefined,
    createdAt: relationship.createdAt,
  };
}

export function toNexoraRelationshipType(type: SceneRelationship["relationshipType"]): NexoraRelationshipType {
  return SCENE_TO_NEXORA_TYPE[type] ?? "dependency";
}

export function toSceneRelationshipType(type: NexoraRelationshipType): SceneRelationship["relationshipType"] {
  return NEXORA_TO_SCENE_TYPE[type] ?? "dependency";
}

export function readSceneModelRelationships(sceneJson: unknown): SceneRelationship[] {
  return readNexoraRelationships(sceneJson).map(sceneRelationshipFromNexora);
}

export function registerRelationshipsFromScene(sceneJson: unknown): void {
  readNexoraRelationships(sceneJson).forEach((relationship) => {
    logRelationshipDiagnostic("[Nexora][RelationshipLoaded]", relationship, relationship.id);
  });
}

export function queryConnectedObjectIds(sceneJson: unknown, objectId: string): {
  incoming: string[];
  outgoing: string[];
  connected: string[];
} {
  const id = objectId.trim();
  const incoming: string[] = [];
  const outgoing: string[] = [];
  readNexoraRelationships(sceneJson).forEach((relationship) => {
    if (relationship.sourceId === id) outgoing.push(relationship.targetId);
    if (relationship.targetId === id) incoming.push(relationship.sourceId);
    if (relationship.direction === "bi") {
      if (relationship.sourceId === id) incoming.push(relationship.targetId);
      if (relationship.targetId === id) outgoing.push(relationship.sourceId);
    }
  });
  return {
    incoming: Array.from(new Set(incoming)),
    outgoing: Array.from(new Set(outgoing)),
    connected: Array.from(new Set([...incoming, ...outgoing])),
  };
}

export function selectRelationship(relationship: NexoraRelationship | null): void {
  if (!relationship) {
    selectedRelationshipId = null;
    return;
  }
  selectedRelationshipId = relationship.id;
  logRelationshipDiagnostic("[Nexora][RelationshipSelected]", relationship, relationship.id);
}

export function getSelectedRelationshipId(): string | null {
  return selectedRelationshipId;
}

export function createSceneRelationship(
  currentScene: unknown,
  request: RelationshipCreateRequest
): RelationshipCreateResult & { nextScene?: SceneJson } {
  if (!isSceneJson(currentScene)) return { success: false, errors: ["invalid_scene"] };

  const objects = Array.isArray(currentScene.scene.objects) ? currentScene.scene.objects : [];
  const validObjectIds = new Set(objects.map((object) => String(object?.id ?? "").trim()).filter(Boolean));
  const existing = readNexoraRelationships(currentScene);
  const direction: NexoraRelationshipDirection =
    request.direction ?? getRelationshipTypeDefinition(request.type)?.defaultDirection ?? "uni";
  const validation = validateRelationshipCreateRequest({ ...request, direction }, existing, validObjectIds);
  if (!validation.valid) return { success: false, errors: validation.errors, warnings: validation.warnings };

  const now = new Date().toISOString();
  const slug = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  const relationship: NexoraRelationship = {
    id: `rel_${request.type}_${slug(request.sourceId)}_${slug(request.targetId)}_${Date.now().toString(36)}`,
    sourceId: request.sourceId.trim(),
    targetId: request.targetId.trim(),
    type: request.type,
    direction,
    metadata: {
      ...(request.metadata ?? {}),
      directionLabel: resolveRelationshipDirectionLabel(direction),
    },
    createdAt: now,
  };
  const nextRelationships = [...existing, relationship];
  const nextScene: SceneJson = {
    ...currentScene,
    meta: {
      ...(currentScene.meta ?? {}),
      lastRelationshipCreatedAt: now,
    },
    scene: {
      ...currentScene.scene,
      relationships: nextRelationships,
    },
  };
  logRelationshipDiagnostic("[Nexora][RelationshipCreated]", relationship, relationship.id);
  return { success: true, relationship, nextRelationships, nextScene, warnings: validation.warnings };
}

export function updateSceneRelationship(
  currentScene: SceneJson | null,
  relationshipId: string,
  patch: Partial<Pick<NexoraRelationship, "type" | "direction" | "metadata">>
): SceneJson | null {
  if (!currentScene?.scene) return currentScene;
  const id = relationshipId.trim();
  if (!id) return currentScene;
  const relationships = readNexoraRelationships(currentScene);
  let changed = false;
  const nextRelationships = relationships.map((relationship) => {
    if (relationship.id !== id) return relationship;
    changed = true;
    return {
      ...relationship,
      ...patch,
      metadata: { ...(relationship.metadata ?? {}), ...(patch.metadata ?? {}) },
    };
  });
  if (!changed) return currentScene;
  return {
    ...currentScene,
    scene: { ...currentScene.scene, relationships: nextRelationships },
  };
}

export function deleteSceneRelationship(
  currentScene: SceneJson | null,
  relationshipId: string
): SceneJson | null {
  if (!currentScene?.scene) return currentScene;
  const id = relationshipId.trim();
  if (!id) return currentScene;
  const relationships = readNexoraRelationships(currentScene);
  const relationship = relationships.find((item) => item.id === id) ?? null;
  const nextRelationships = relationships.filter((item) => item.id !== id);
  if (nextRelationships.length === relationships.length) return currentScene;
  if (selectedRelationshipId === id) selectedRelationshipId = null;
  logRelationshipDiagnostic("[Nexora][RelationshipDeleted]", relationship, id);
  return {
    ...currentScene,
    meta: {
      ...(currentScene.meta ?? {}),
      lastRelationshipDeletedAt: new Date().toISOString(),
    },
    scene: {
      ...currentScene.scene,
      relationships: nextRelationships,
    },
  };
}

export function getRelationshipRuntimeSnapshot(sceneJson: unknown): RelationshipRuntimeSnapshot {
  return {
    selectedRelationshipId,
    relationships: readSceneModelRelationships(sceneJson),
  };
}

export function resetRelationshipRuntimeForTests(): void {
  selectedRelationshipId = null;
  diagnosticKeys.clear();
}
