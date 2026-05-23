import type { SceneJson, SceneObject, Vector3Tuple } from "../sceneTypes";
import { clampSceneObjectPosition, placementPositionToVector, vectorToPlacementPosition } from "./objectPlacementRuntime";

export type EditableSceneObject = {
  id: string;
  name: string;
  category: string;
  description?: string;
  importance?: number;
  riskLevel?: number;
  status?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

export type EditableObjectPatch = Partial<Omit<EditableSceneObject, "id" | "metadata">> & {
  metadata?: Record<string, unknown>;
};

const EXECUTIVE_OBJECT_CATEGORIES = [
  "Supplier",
  "Facility",
  "Inventory",
  "Market",
  "Project",
  "Resource",
  "Risk",
  "Team",
  "Department",
  "Objective",
  "Custom",
] as const;

const diagnosticKeys = new Set<string>();

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function clampPercent(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return undefined;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function normalizeString(value: unknown): string | undefined {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text || undefined;
}

function normalizeTags(value: unknown): string[] | undefined {
  const raw = Array.isArray(value) ? value : String(value ?? "").split(",");
  const tags = raw
    .map((tag) => String(tag ?? "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const unique = Array.from(new Set(tags));
  return unique.length ? unique : [];
}

function objectMetadata(object: SceneObject): Record<string, unknown> {
  const meta = object.metadata ?? object.meta;
  return meta && typeof meta === "object" ? { ...(meta as Record<string, unknown>) } : {};
}

function readObjectDescription(object: SceneObject): string | undefined {
  return normalizeString(
    object.description ??
      object.business_meaning ??
      object.scanner_overlay_summary ??
      object.scanner_reason ??
      object.semantic?.business_meaning
  );
}

function readObjectImportance(object: SceneObject): number | undefined {
  const meta = objectMetadata(object);
  return clampPercent(object.importance ?? meta.importance ?? (typeof object.emphasis === "number" ? object.emphasis * 100 : undefined));
}

function readObjectRiskLevel(object: SceneObject): number | undefined {
  const meta = objectMetadata(object);
  const raw = object.riskLevel ?? object.risk_level ?? meta.riskLevel ?? meta.risk_level ?? object.scanner_emphasis;
  if (typeof raw === "number" && raw <= 1) return clampPercent(raw * 100);
  return clampPercent(raw);
}

export function readEditableSceneObject(sceneJson: unknown, objectId: string | null | undefined): EditableSceneObject | null {
  const id = objectId?.trim() || "";
  if (!id || !isSceneJson(sceneJson) || !Array.isArray(sceneJson.scene.objects)) return null;
  const object = sceneJson.scene.objects.find((item) => String(item.id ?? "").trim() === id);
  if (!object) return null;
  const metadata = objectMetadata(object);
  const name =
    normalizeString(object.name ?? object.label ?? object.display_label ?? object.semantic?.display_label ?? object.id) ?? id;
  const category =
    normalizeString(object.category ?? object.semantic?.category ?? object.role ?? metadata.category) ?? "Custom";
  return {
    id,
    name,
    category,
    description: readObjectDescription(object),
    importance: readObjectImportance(object),
    riskLevel: readObjectRiskLevel(object),
    status: normalizeString(object.status ?? object.state ?? metadata.status),
    tags: normalizeTags(object.tags ?? object.semantic?.tags) ?? [],
    metadata,
  };
}

function logObjectEditingDiagnostic(
  label: string,
  payload: { objectId: string; field: string; oldValue: unknown; newValue: unknown },
  key: string
): void {
  if (process.env.NODE_ENV === "production") return;
  const dedupeKey = `${label}:${key}`;
  if (diagnosticKeys.has(dedupeKey)) return;
  diagnosticKeys.add(dedupeKey);
  console.info(label, payload);
}

function emitFieldDiagnostics(objectId: string, previous: EditableSceneObject, next: EditableSceneObject): void {
  (["name", "category", "description", "status", "importance", "riskLevel", "tags"] as const).forEach((field) => {
    const oldValue = previous[field];
    const newValue = next[field];
    const oldSig = Array.isArray(oldValue) ? oldValue.join(",") : String(oldValue ?? "");
    const newSig = Array.isArray(newValue) ? newValue.join(",") : String(newValue ?? "");
    if (oldSig === newSig) return;
    const payload = { objectId, field, oldValue, newValue };
    logObjectEditingDiagnostic("[Nexora][ObjectEdited]", payload, `${objectId}:${field}`);
    if (field === "name") logObjectEditingDiagnostic("[Nexora][ObjectRenamed]", payload, `${objectId}:name`);
    if (field === "category") logObjectEditingDiagnostic("[Nexora][ObjectCategoryChanged]", payload, `${objectId}:category`);
    if (field === "riskLevel") logObjectEditingDiagnostic("[Nexora][ObjectRiskChanged]", payload, `${objectId}:riskLevel`);
  });
}

function applyEditableObjectPatch(object: SceneObject, patch: EditableObjectPatch): SceneObject {
  const metadata = { ...objectMetadata(object), ...(patch.metadata ?? {}) };
  const semantic = object.semantic && typeof object.semantic === "object" ? { ...object.semantic } : {};
  const next: SceneObject = { ...object };

  if ("name" in patch) {
    const name = normalizeString(patch.name);
    if (name) {
      next.name = name;
      next.label = name;
      next.display_label = name;
      semantic.display_label = name;
      metadata.name = name;
    }
  }
  if ("category" in patch) {
    const category = normalizeString(patch.category) ?? "Custom";
    next.category = category;
    next.role = category.toLowerCase().replace(/\s+/g, "_");
    semantic.category = category;
    metadata.category = category;
  }
  if ("description" in patch) {
    const description = normalizeString(patch.description);
    next.description = description;
    next.business_meaning = description;
    semantic.business_meaning = description;
    metadata.description = description;
  }
  if ("status" in patch) {
    const status = normalizeString(patch.status);
    next.status = status;
    metadata.status = status;
  }
  if ("importance" in patch) {
    const importance = clampPercent(patch.importance);
    next.importance = importance;
    next.emphasis = typeof importance === "number" ? importance / 100 : next.emphasis;
    metadata.importance = importance;
  }
  if ("riskLevel" in patch) {
    const riskLevel = clampPercent(patch.riskLevel);
    next.riskLevel = riskLevel;
    next.risk_level = riskLevel;
    next.scanner_emphasis = typeof riskLevel === "number" ? riskLevel / 100 : next.scanner_emphasis;
    next.scanner_severity =
      typeof riskLevel !== "number"
        ? next.scanner_severity
        : riskLevel >= 80
          ? "critical"
          : riskLevel >= 60
            ? "high"
            : riskLevel >= 35
              ? "medium"
              : "low";
    metadata.riskLevel = riskLevel;
  }
  if ("tags" in patch) {
    const tags = normalizeTags(patch.tags) ?? [];
    next.tags = tags;
    semantic.tags = tags;
    metadata.tags = tags;
  }

  next.semantic = semantic;
  next.metadata = metadata;
  next.meta = metadata;
  next.updatedAt = new Date().toISOString();
  return next;
}

export function editSceneObject(
  sceneJson: SceneJson | null,
  objectId: string,
  patch: EditableObjectPatch
): SceneJson | null {
  if (!sceneJson?.scene || !Array.isArray(sceneJson.scene.objects)) return sceneJson;
  const id = objectId.trim();
  if (!id) return sceneJson;
  const previousEditable = readEditableSceneObject(sceneJson, id);
  if (!previousEditable) return sceneJson;
  let changed = false;
  const objects = sceneJson.scene.objects.map((object) => {
    if (String(object.id ?? "").trim() !== id) return object;
    const nextObject = applyEditableObjectPatch(object, patch);
    const nextEditable = readEditableSceneObject({ ...sceneJson, scene: { ...sceneJson.scene, objects: [nextObject] } }, id);
    if (!nextEditable) return object;
    emitFieldDiagnostics(id, previousEditable, nextEditable);
    changed = true;
    return nextObject;
  });
  if (!changed) return sceneJson;
  return {
    ...sceneJson,
    meta: { ...(sceneJson.meta ?? {}), lastObjectEditedAt: new Date().toISOString() },
    scene: { ...sceneJson.scene, objects },
  };
}

export function deleteSceneObject(sceneJson: SceneJson | null, objectId: string): SceneJson | null {
  if (!sceneJson?.scene || !Array.isArray(sceneJson.scene.objects)) return sceneJson;
  const id = objectId.trim();
  if (!id) return sceneJson;
  const previousCount = sceneJson.scene.objects.length;
  const objects = sceneJson.scene.objects.filter((object) => String(object.id ?? "").trim() !== id);
  if (objects.length === previousCount) return sceneJson;
  const relationships = Array.isArray(sceneJson.scene.relationships)
    ? sceneJson.scene.relationships.filter((relationship: any) => relationship?.sourceId !== id && relationship?.targetId !== id)
    : sceneJson.scene.relationships;
  const propagationPaths = Array.isArray(sceneJson.scene.propagationPaths)
    ? sceneJson.scene.propagationPaths.filter(
        (path: any) => path?.sourceObjectId !== id && path?.targetObjectId !== id
      )
    : sceneJson.scene.propagationPaths;
  logObjectEditingDiagnostic(
    "[Nexora][ObjectDeleted]",
    { objectId: id, field: "object", oldValue: id, newValue: null },
    id
  );
  return {
    ...sceneJson,
    meta: { ...(sceneJson.meta ?? {}), lastObjectDeletedAt: new Date().toISOString() },
    scene: { ...sceneJson.scene, objects, relationships, propagationPaths },
  };
}

function createDuplicateId(objects: SceneObject[], sourceId: string): string {
  const ids = new Set(objects.map((object) => String(object.id ?? "").trim()).filter(Boolean));
  const base = `${sourceId}_copy`;
  if (!ids.has(base)) return base;
  let index = 2;
  while (ids.has(`${base}_${index}`)) index += 1;
  return `${base}_${index}`;
}

export function duplicateSceneObject(sceneJson: SceneJson | null, objectId: string): {
  nextScene: SceneJson | null;
  duplicatedObjectId: string | null;
} {
  if (!sceneJson?.scene || !Array.isArray(sceneJson.scene.objects)) return { nextScene: sceneJson, duplicatedObjectId: null };
  const id = objectId.trim();
  const source = sceneJson.scene.objects.find((object) => String(object.id ?? "").trim() === id);
  if (!source) return { nextScene: sceneJson, duplicatedObjectId: null };
  const duplicatedObjectId = createDuplicateId(sceneJson.scene.objects, id);
  const sourcePosition = vectorToPlacementPosition((source.position ?? source.pos ?? [0, 0, 0]) as Vector3Tuple);
  const nextPosition = placementPositionToVector(
    clampSceneObjectPosition({ x: sourcePosition.x + 1.1, y: sourcePosition.y, z: sourcePosition.z + 0.8 })
  );
  const copyName = `${String(source.name ?? source.label ?? id).trim() || id} Copy`;
  const metadata = {
    ...objectMetadata(source),
    duplicatedFromObjectId: id,
    duplicatedAt: new Date().toISOString(),
  };
  const duplicate: SceneObject = {
    ...source,
    id: duplicatedObjectId,
    name: copyName,
    label: copyName,
    display_label: copyName,
    position: nextPosition,
    pos: nextPosition,
    metadata,
    meta: metadata,
    semantic: {
      ...(source.semantic ?? {}),
      display_label: copyName,
    },
  };
  logObjectEditingDiagnostic(
    "[Nexora][ObjectDuplicated]",
    { objectId: id, field: "object", oldValue: id, newValue: duplicatedObjectId },
    `${id}:${duplicatedObjectId}`
  );
  return {
    duplicatedObjectId,
    nextScene: {
      ...sceneJson,
      meta: { ...(sceneJson.meta ?? {}), lastObjectDuplicatedAt: new Date().toISOString() },
      scene: {
        ...sceneJson.scene,
        objects: [...sceneJson.scene.objects, duplicate],
      },
    },
  };
}

export function getExecutiveObjectCategories(): readonly string[] {
  return EXECUTIVE_OBJECT_CATEGORIES;
}

export function resetObjectEditingRuntimeForTests(): void {
  diagnosticKeys.clear();
}
