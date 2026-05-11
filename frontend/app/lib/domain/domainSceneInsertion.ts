import {
  createDomainSceneObject,
  type DomainObjectCreationRequest,
} from "./domainObjectCreation.ts";
import { domainObjectDedupeSignature } from "./domainDedupe.ts";
import type { SceneJson, SceneObject, Vector3Tuple } from "../sceneTypes.ts";

export type DomainSceneInsertionRequest = {
  currentScene: unknown;
  creationRequest: DomainObjectCreationRequest;
};

export type DomainSceneInsertionResult = {
  success: boolean;
  nextScene?: SceneJson;
  createdObjectId?: string;
  targetPanel?: string;
  warnings?: string[];
};

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene && typeof (value as SceneJson).scene === "object");
}

function sceneObjects(scene: SceneJson): SceneObject[] {
  return Array.isArray(scene.scene.objects) ? scene.scene.objects : [];
}

function normalizeLabel(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function objectLabel(object: SceneObject): string {
  return String(object.label ?? object.name ?? object.id ?? "").trim();
}

function hasDuplicateObject(objects: SceneObject[], nextObject: SceneObject): boolean {
  const nextId = String(nextObject.id ?? "");
  const nextSignature = domainObjectDedupeSignature(nextObject);
  const nextDomainId = String((nextObject.meta as Record<string, unknown> | undefined)?.domainId ?? nextObject.domain ?? "");
  const nextTemplateId = String((nextObject.meta as Record<string, unknown> | undefined)?.templateId ?? "");
  const nextLabel = normalizeLabel(objectLabel(nextObject));

  return objects.some((object) => {
    if (String(object.id ?? "") === nextId) return true;
    if (domainObjectDedupeSignature(object) === nextSignature) return true;
    const domainId = String((object.meta as Record<string, unknown> | undefined)?.domainId ?? object.domain ?? "");
    const templateId = String((object.meta as Record<string, unknown> | undefined)?.templateId ?? "");
    const label = normalizeLabel(objectLabel(object));
    return Boolean(nextDomainId && nextTemplateId && domainId === nextDomainId && templateId === nextTemplateId && label === nextLabel);
  });
}

function buildOrbitPosition(index: number): Vector3Tuple {
  if (index <= 0) return [0, 0, 0];
  const radius = 2.2 + Math.floor((index - 1) / 8) * 0.55;
  const angle = (index - 1) * 2.399963229728653;
  const y = ((index - 1) % 3 - 1) * 0.18;
  return [
    Number((Math.cos(angle) * radius).toFixed(3)),
    Number(y.toFixed(3)),
    Number((Math.sin(angle) * radius).toFixed(3)),
  ];
}

function withResolvedPosition(
  object: SceneObject,
  index: number,
  preferredPosition: DomainObjectCreationRequest["preferredPosition"]
): SceneObject {
  if (preferredPosition === "center") return { ...object, position: [0, 0, 0] };
  if (preferredPosition === "orbit" || preferredPosition === "auto" || !object.position) {
    return { ...object, position: buildOrbitPosition(index) };
  }
  return object;
}

export function insertDomainObjectIntoScene(
  request: DomainSceneInsertionRequest
): DomainSceneInsertionResult {
  if (!isSceneJson(request.currentScene)) {
    return {
      success: false,
      warnings: ["invalid_scene"],
    };
  }

  const creation = createDomainSceneObject(request.creationRequest);
  if (!creation.success || !creation.normalizedObject) {
    return {
      success: false,
      warnings: creation.warnings ?? ["creation_failed"],
    };
  }

  const objects = sceneObjects(request.currentScene);
  const nextObject = withResolvedPosition(
    creation.normalizedObject,
    objects.length,
    request.creationRequest.preferredPosition ?? "auto"
  );

  if (hasDuplicateObject(objects, nextObject)) {
    return {
      success: false,
      nextScene: request.currentScene,
      createdObjectId: nextObject.id,
      targetPanel: creation.targetPanel,
      warnings: [...(creation.warnings ?? []), "duplicate_object_skipped"],
    };
  }

  const nextScene: SceneJson = {
    ...request.currentScene,
    meta: {
      ...(request.currentScene.meta ?? {}),
      lastDomainObjectInsertedAt: new Date().toISOString(),
    },
    scene: {
      ...request.currentScene.scene,
      objects: [...objects, nextObject],
    },
  };

  return {
    success: true,
    nextScene,
    createdObjectId: nextObject.id,
    targetPanel: creation.targetPanel,
    warnings: creation.warnings,
  };
}
