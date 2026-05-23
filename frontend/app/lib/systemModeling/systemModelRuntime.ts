import { getCatalogObjectDefinition } from "../objectCatalog/objectCatalogRegistry";
import type { CatalogObjectDefinition } from "../objectCatalog/objectCatalogTypes";
import { createNexoraRelationship } from "../relationships/relationshipRuntime";
import type { NexoraRelationship } from "../relationships/relationshipTypes";
import {
  createCatalogSceneObject,
  resolveCatalogPlacementPosition,
} from "../scenePlacement/scenePlacementRuntime";
import type { SceneJson, SceneObject, Vector3Tuple } from "../sceneTypes";
import {
  logBlueprintCreated,
  logSystemGenerated,
  logTemplatePreview,
  logTemplateValidated,
  logTemplateOpened,
  logTemplateWorkspaceClosed,
  logWorkspaceGenerated,
} from "./systemModelInstrumentation";
import { loadDomainTemplate, resolveDomainTemplatePreview } from "./templateLoader";
import type {
  DomainTemplate,
  DomainTemplatePreview,
  SystemBlueprintMetadata,
  SystemGenerationRequest,
  SystemGenerationResult,
  TemplateObjectDefinition,
} from "./systemModelTypes";
import { TEMPLATE_RELATIONSHIP_TO_NEXORA as RELATIONSHIP_MAP } from "./systemModelTypes";
import { validateDomainTemplate } from "./templateValidation";

export const SYSTEM_MODELING_OPEN_EVENT = "nexora:system-modeling-open";
export const SYSTEM_MODELING_CLOSE_EVENT = "nexora:system-modeling-close";

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function sceneObjects(scene: SceneJson): SceneObject[] {
  return Array.isArray(scene.scene.objects) ? scene.scene.objects : [];
}

function readRelationships(scene: SceneJson): NexoraRelationship[] {
  const raw = (scene.scene as { relationships?: unknown }).relationships;
  return Array.isArray(raw) ? (raw as NexoraRelationship[]) : [];
}

function resolveCatalogDefinition(object: TemplateObjectDefinition): CatalogObjectDefinition {
  const fromCatalog = object.catalogId ? getCatalogObjectDefinition(object.catalogId) : undefined;
  if (fromCatalog) return fromCatalog;

  return {
    id: object.key,
    label: object.label,
    category: "operations",
    icon: object.icon,
    description: object.description ?? `${object.label} template object`,
    defaultRole: object.role ?? "core",
    defaultSeverity: 0.45,
  };
}

function resolveTemplateLayoutPosition(
  template: DomainTemplate,
  index: number,
  total: number
): Vector3Tuple {
  const layout = String(template.metadata?.layout ?? "orbit");
  if (layout === "linear_chain") {
    const spacing = 2.4;
    const offset = ((total - 1) * spacing) / 2;
    return [Number((index * spacing - offset).toFixed(3)), 0, 0];
  }
  if (layout === "governance_stack") {
    const row = index % 3;
    const col = Math.floor(index / 3);
    return [Number((col * 2.6 - 2.6).toFixed(3)), Number((row * 0.35 - 0.35).toFixed(3)), 0];
  }
  if (layout === "finance_flow") {
    return [Number((index * 2.1 - 5.2).toFixed(3)), Number(((index % 2) * 0.4 - 0.2).toFixed(3)), 0];
  }
  if (layout === "operations_hub") {
    const angle = (index / Math.max(1, total)) * Math.PI * 2;
    const radius = 3.2;
    return [
      Number((Math.cos(angle) * radius).toFixed(3)),
      Number(((index % 2) * 0.25).toFixed(3)),
      Number((Math.sin(angle) * radius).toFixed(3)),
    ];
  }
  return resolveCatalogPlacementPosition([], index).position;
}

function applyTemplateObjectIdentity(
  object: SceneObject,
  template: DomainTemplate,
  objectKey: string,
  runSuffix: string,
  generatedAt: string
): SceneObject {
  const id = `tmpl_${template.id}_${objectKey}_${runSuffix}`;
  return {
    ...object,
    id,
    meta: {
      ...(object.meta as Record<string, unknown> | undefined),
      source: "template",
      templateId: template.id,
      templateName: template.name,
      templateObjectKey: objectKey,
      generatedAt,
    },
  };
}

export function buildTemplatePreview(templateId: string): DomainTemplatePreview | null {
  const template = loadDomainTemplate(templateId);
  if (!template) return null;
  const preview = resolveDomainTemplatePreview(template);
  logTemplatePreview({
    templateId: template.id,
    templateName: template.name,
    objectCount: preview.objectCount,
    relationshipCount: preview.relationshipCount,
  });
  return preview;
}

export function readSystemBlueprint(sceneJson: unknown): SystemBlueprintMetadata | null {
  if (!isSceneJson(sceneJson)) return null;
  const blueprint = sceneJson.meta?.systemBlueprint;
  if (!blueprint || typeof blueprint !== "object") return null;
  const value = blueprint as SystemBlueprintMetadata;
  if (!value.templateId || value.source !== "template") return null;
  return value;
}

export function generateSystemFromTemplate(request: SystemGenerationRequest): SystemGenerationResult {
  const startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
  const template = loadDomainTemplate(request.templateId);

  const validation = validateDomainTemplate(template);
  logTemplateValidated({
    templateId: request.templateId,
    valid: validation.valid,
    reason: validation.errors[0] ?? validation.warnings[0],
  });

  if (!validation.valid || !template) {
    return { success: false, errors: validation.errors, warnings: validation.warnings };
  }

  if (!isSceneJson(request.currentScene)) {
    return { success: false, errors: ["invalid_scene"], warnings: validation.warnings };
  }

  const generatedAt = new Date().toISOString();
  const runSuffix = Date.now().toString(36);
  const keyToId = new Map<string, string>();
  const createdObjectIds: string[] = [];
  let workingObjects = [...sceneObjects(request.currentScene)];

  template.objects.forEach((objectDef, index) => {
    const definition = resolveCatalogDefinition(objectDef);
    const preferred = resolveTemplateLayoutPosition(template, index, template.objects.length);
    const placement = resolveCatalogPlacementPosition(workingObjects, workingObjects.length, 1.25);
    const position = preferred[0] !== 0 || index > 0 ? preferred : placement.position;
    const { object } = createCatalogSceneObject(definition, position, objectDef.label);
    const finalized = applyTemplateObjectIdentity(object, template, objectDef.key, runSuffix, generatedAt);
    keyToId.set(objectDef.key, finalized.id);
    createdObjectIds.push(finalized.id);
    workingObjects = [...workingObjects, finalized];
  });

  const existingRelationships = readRelationships(request.currentScene);
  const nextRelationships: NexoraRelationship[] = [...existingRelationships];
  const createdRelationshipIds: string[] = [];

  template.relationships.forEach((relationshipDef) => {
    const sourceId = keyToId.get(relationshipDef.sourceKey);
    const targetId = keyToId.get(relationshipDef.targetKey);
    if (!sourceId || !targetId) return;

    const nexoraType = RELATIONSHIP_MAP[relationshipDef.type] ?? "custom";
    const relationship = createNexoraRelationship({
      sourceId,
      targetId,
      type: nexoraType,
      direction: relationshipDef.direction ?? "uni",
      metadata: {
        source: "template",
        templateId: template.id,
        templateRelationshipType: relationshipDef.type,
      },
    });
    nextRelationships.push(relationship);
    createdRelationshipIds.push(relationship.id);
  });

  const generationDurationMs = Math.round(
    (typeof performance !== "undefined" ? performance.now() : Date.now()) - startedAt
  );

  const blueprint: SystemBlueprintMetadata = {
    templateId: template.id,
    templateName: template.name,
    generatedAt,
    version: template.version,
    source: "template",
    objectCount: createdObjectIds.length,
    relationshipCount: createdRelationshipIds.length,
    generationDurationMs,
  };

  const nextScene: SceneJson = {
    ...request.currentScene,
    meta: {
      ...(request.currentScene.meta ?? {}),
      systemBlueprint: blueprint,
      lastSystemGeneratedAt: generatedAt,
    },
    scene: {
      ...request.currentScene.scene,
      objects: workingObjects,
      relationships: nextRelationships,
    },
  };

  logSystemGenerated({
    templateId: template.id,
    templateName: template.name,
    objectCount: createdObjectIds.length,
    relationshipCount: createdRelationshipIds.length,
    generationDurationMs,
  });
  logBlueprintCreated({
    templateId: template.id,
    templateName: template.name,
    objectCount: createdObjectIds.length,
    relationshipCount: createdRelationshipIds.length,
  });
  logWorkspaceGenerated({
    templateId: template.id,
    templateName: template.name,
    objectCount: createdObjectIds.length,
    relationshipCount: createdRelationshipIds.length,
    generationDurationMs,
  });

  return {
    success: true,
    nextScene,
    blueprint,
    createdObjectIds,
    createdRelationshipIds,
    warnings: validation.warnings,
    generationDurationMs,
  };
}

export function requestOpenSystemModelingWorkspace(source: string): void {
  if (typeof window === "undefined") return;
  logTemplateOpened(source);
  window.dispatchEvent(new CustomEvent(SYSTEM_MODELING_OPEN_EVENT, { detail: { source } }));
}

export function requestCloseSystemModelingWorkspace(source: string): void {
  if (typeof window === "undefined") return;
  logTemplateWorkspaceClosed(source);
  window.dispatchEvent(new CustomEvent(SYSTEM_MODELING_CLOSE_EVENT, { detail: { source } }));
}

export {
  loadAllDomainTemplates,
  loadDomainTemplate,
  loadDomainTemplatesByCategory,
  resolveDomainTemplatePreview,
  DOMAIN_TEMPLATE_CATEGORIES,
} from "./templateLoader";

export type { DomainTemplate, DomainTemplatePreview, SystemBlueprintMetadata } from "./systemModelTypes";
