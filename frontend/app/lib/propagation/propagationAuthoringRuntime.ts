import type { SceneJson } from "../sceneTypes";

export type PropagationPath = {
  id: string;
  sourceObjectId: string;
  targetObjectId: string;
  propagationType:
    | "risk"
    | "resource"
    | "financial"
    | "operational"
    | "dependency"
    | "custom";
  strength: number;
  delayHours?: number;
  notes?: string;
  createdAt: string;
  modifiedAt: string;
};

export type PropagationPathCreateRequest = {
  sourceObjectId: string;
  targetObjectId: string;
  propagationType: PropagationPath["propagationType"];
  strength: number;
  delayHours?: number;
  notes?: string;
};

export type PropagationPathPatch = Partial<
  Pick<PropagationPath, "propagationType" | "strength" | "delayHours" | "notes">
>;

export type PropagationRuntimeSnapshot = {
  selectedPathId: string | null;
  paths: PropagationPath[];
};

let selectedPathId: string | null = null;
const diagnosticKeys = new Set<string>();

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function clampStrength(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 50;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function normalizeDelayHours(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return undefined;
  return Math.max(0, Math.round(numeric));
}

function normalizeNotes(value: unknown): string | undefined {
  const notes = String(value ?? "").replace(/\s+/g, " ").trim();
  return notes || undefined;
}

function normalizeType(value: unknown): PropagationPath["propagationType"] {
  const raw = String(value ?? "").trim();
  if (
    raw === "risk" ||
    raw === "resource" ||
    raw === "financial" ||
    raw === "operational" ||
    raw === "dependency" ||
    raw === "custom"
  ) {
    return raw;
  }
  return "dependency";
}

function readObjects(sceneJson: SceneJson): Set<string> {
  const objects = Array.isArray(sceneJson.scene.objects) ? sceneJson.scene.objects : [];
  return new Set(objects.map((object) => String(object.id ?? "").trim()).filter(Boolean));
}

function isPropagationPath(value: unknown): value is PropagationPath {
  if (!value || typeof value !== "object") return false;
  const path = value as PropagationPath;
  return Boolean(
    String(path.id ?? "").trim() &&
      String(path.sourceObjectId ?? "").trim() &&
      String(path.targetObjectId ?? "").trim()
  );
}

function readRawPaths(sceneJson: unknown): PropagationPath[] {
  if (!isSceneJson(sceneJson)) return [];
  const raw = (sceneJson.scene as { propagationPaths?: unknown }).propagationPaths;
  if (!Array.isArray(raw)) return [];
  return raw.filter(isPropagationPath).map((path) => ({
    id: String(path.id).trim(),
    sourceObjectId: String(path.sourceObjectId).trim(),
    targetObjectId: String(path.targetObjectId).trim(),
    propagationType: normalizeType(path.propagationType),
    strength: clampStrength(path.strength),
    delayHours: normalizeDelayHours(path.delayHours),
    notes: normalizeNotes(path.notes),
    createdAt: String(path.createdAt ?? new Date().toISOString()),
    modifiedAt: String(path.modifiedAt ?? path.createdAt ?? new Date().toISOString()),
  }));
}

function logPropagationDiagnostic(label: string, path: PropagationPath | null, key: string): void {
  if (process.env.NODE_ENV === "production") return;
  const dedupeKey = `${label}:${key}`;
  if (diagnosticKeys.has(dedupeKey)) return;
  diagnosticKeys.add(dedupeKey);
  console.info(label, {
    pathId: path?.id ?? selectedPathId,
    sourceObjectId: path?.sourceObjectId ?? null,
    targetObjectId: path?.targetObjectId ?? null,
    type: path?.propagationType ?? null,
    strength: path?.strength ?? null,
  });
}

function createPathId(input: Pick<PropagationPath, "sourceObjectId" | "targetObjectId" | "propagationType">): string {
  const slug = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  return `prop_${input.propagationType}_${slug(input.sourceObjectId)}_${slug(input.targetObjectId)}_${Date.now().toString(36)}`;
}

export function readPropagationPaths(sceneJson: unknown): PropagationPath[] {
  return readRawPaths(sceneJson);
}

export function getSelectedPropagationPathId(): string | null {
  return selectedPathId;
}

export function selectPropagationPath(path: PropagationPath | null): void {
  selectedPathId = path?.id ?? null;
  if (path) logPropagationDiagnostic("[Nexora][PropagationSelected]", path, path.id);
}

export function validatePropagationPathRequest(
  sceneJson: unknown,
  request: Pick<PropagationPathCreateRequest, "sourceObjectId" | "targetObjectId">
): string[] {
  if (!isSceneJson(sceneJson)) return ["invalid_scene"];
  const source = request.sourceObjectId.trim();
  const target = request.targetObjectId.trim();
  if (!source || !target) return ["missing_endpoint"];
  if (source === target) return ["self_loop_not_allowed"];
  const ids = readObjects(sceneJson);
  if (!ids.has(source) || !ids.has(target)) return ["invalid_object"];
  const duplicate = readRawPaths(sceneJson).some(
    (path) => path.sourceObjectId === source && path.targetObjectId === target
  );
  return duplicate ? ["duplicate_path"] : [];
}

export function createPropagationPath(
  sceneJson: SceneJson | null,
  request: PropagationPathCreateRequest
): { nextScene: SceneJson | null; path: PropagationPath | null; errors: string[] } {
  if (!sceneJson?.scene) return { nextScene: sceneJson, path: null, errors: ["invalid_scene"] };
  const errors = validatePropagationPathRequest(sceneJson, request);
  if (errors.length) return { nextScene: sceneJson, path: null, errors };
  const now = new Date().toISOString();
  const path: PropagationPath = {
    id: createPathId({
      sourceObjectId: request.sourceObjectId,
      targetObjectId: request.targetObjectId,
      propagationType: normalizeType(request.propagationType),
    }),
    sourceObjectId: request.sourceObjectId.trim(),
    targetObjectId: request.targetObjectId.trim(),
    propagationType: normalizeType(request.propagationType),
    strength: clampStrength(request.strength),
    delayHours: normalizeDelayHours(request.delayHours),
    notes: normalizeNotes(request.notes),
    createdAt: now,
    modifiedAt: now,
  };
  logPropagationDiagnostic("[Nexora][PropagationCreated]", path, path.id);
  return {
    path,
    errors: [],
    nextScene: {
      ...sceneJson,
      meta: { ...(sceneJson.meta ?? {}), lastPropagationPathCreatedAt: now },
      scene: {
        ...sceneJson.scene,
        propagationPaths: [...readRawPaths(sceneJson), path],
      },
    },
  };
}

export function editPropagationPath(
  sceneJson: SceneJson | null,
  pathId: string,
  patch: PropagationPathPatch
): SceneJson | null {
  if (!sceneJson?.scene) return sceneJson;
  const id = pathId.trim();
  if (!id) return sceneJson;
  let changed = false;
  const now = new Date().toISOString();
  const paths = readRawPaths(sceneJson).map((path) => {
    if (path.id !== id) return path;
    changed = true;
    const next = {
      ...path,
      propagationType: patch.propagationType ? normalizeType(patch.propagationType) : path.propagationType,
      strength: patch.strength == null ? path.strength : clampStrength(patch.strength),
      delayHours: "delayHours" in patch ? normalizeDelayHours(patch.delayHours) : path.delayHours,
      notes: "notes" in patch ? normalizeNotes(patch.notes) : path.notes,
      modifiedAt: now,
    };
    logPropagationDiagnostic("[Nexora][PropagationEdited]", next, `${id}:edit`);
    return next;
  });
  if (!changed) return sceneJson;
  return {
    ...sceneJson,
    meta: { ...(sceneJson.meta ?? {}), lastPropagationPathEditedAt: now },
    scene: { ...sceneJson.scene, propagationPaths: paths },
  };
}

export function deletePropagationPath(sceneJson: SceneJson | null, pathId: string): SceneJson | null {
  if (!sceneJson?.scene) return sceneJson;
  const id = pathId.trim();
  const paths = readRawPaths(sceneJson);
  const path = paths.find((item) => item.id === id) ?? null;
  const nextPaths = paths.filter((item) => item.id !== id);
  if (nextPaths.length === paths.length) return sceneJson;
  if (selectedPathId === id) selectedPathId = null;
  logPropagationDiagnostic("[Nexora][PropagationDeleted]", path, id);
  return {
    ...sceneJson,
    meta: { ...(sceneJson.meta ?? {}), lastPropagationPathDeletedAt: new Date().toISOString() },
    scene: { ...sceneJson.scene, propagationPaths: nextPaths },
  };
}

export function registerPropagationPathsFromScene(sceneJson: unknown): void {
  readRawPaths(sceneJson).forEach((path) => {
    logPropagationDiagnostic("[Nexora][PropagationLoaded]", path, path.id);
  });
}

export function getPropagationRuntimeSnapshot(sceneJson: unknown): PropagationRuntimeSnapshot {
  return {
    selectedPathId,
    paths: readRawPaths(sceneJson),
  };
}

export function resetPropagationAuthoringRuntimeForTests(): void {
  selectedPathId = null;
  diagnosticKeys.clear();
}
