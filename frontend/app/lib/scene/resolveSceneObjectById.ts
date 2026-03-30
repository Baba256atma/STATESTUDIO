"use client";

export type SceneResolvedObjectInfo = {
  id: string;
  label: string | null;
  type: string | null;
  position?: unknown;
  emphasis?: number | null;
  metadata?: Record<string, unknown> | null;
  raw?: unknown;
};

type SceneObjectSource =
  | { scene?: { objects?: unknown[] | null } | null }
  | { objects?: unknown[] | null }
  | unknown[]
  | null
  | undefined;

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function getSceneObjects(source: SceneObjectSource): Record<string, unknown>[] {
  if (Array.isArray(source)) return source.filter((value): value is Record<string, unknown> => !!toRecord(value));
  const record = toRecord(source);
  if (!record) return [];

  const nestedScene = toRecord(record.scene);
  const directObjects = Array.isArray(record.objects) ? record.objects : null;
  const nestedObjects = nestedScene && Array.isArray(nestedScene.objects) ? nestedScene.objects : null;
  const objects = directObjects ?? nestedObjects ?? [];
  return objects.filter((value): value is Record<string, unknown> => !!toRecord(value));
}

export function getSceneObjectId(source: unknown): string | null {
  const record = toRecord(source);
  if (!record) return null;
  const candidates = [record.id, record.objectId, record.object_id, record.name];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) return candidate.trim();
  }
  return null;
}

function getSceneObjectLabel(source: Record<string, unknown>, fallbackId: string): string | null {
  const candidates = [source.label, source.name, source.title];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) return candidate.trim();
  }
  return fallbackId || null;
}

function getSceneObjectType(source: Record<string, unknown>): string | null {
  const candidates = [source.type, source.object_type, source.kind];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) return candidate.trim();
  }
  return null;
}

function getSceneObjectMetadata(source: Record<string, unknown>): Record<string, unknown> | null {
  const metadata = toRecord(source.metadata);
  if (metadata) return metadata;
  const semantic = toRecord(source.semantic);
  if (semantic) return semantic;
  return null;
}

function getSceneObjectPosition(source: Record<string, unknown>): unknown {
  const transform = toRecord(source.transform);
  if (Array.isArray(transform?.pos)) return transform?.pos;
  if (Array.isArray(source.position)) return source.position;
  return undefined;
}

function getSceneObjectEmphasis(source: Record<string, unknown>): number | null {
  const candidates = [source.emphasis, source.scanner_emphasis];
  for (const candidate of candidates) {
    const next = Number(candidate);
    if (Number.isFinite(next)) return next;
  }
  return null;
}

export function resolveSceneObjectById(source: SceneObjectSource, objectId: string | null | undefined): SceneResolvedObjectInfo | null {
  const normalizedId = typeof objectId === "string" ? objectId.trim() : "";
  if (!normalizedId) return null;

  const match = getSceneObjects(source).find((entry) => getSceneObjectId(entry) === normalizedId);
  if (!match) return null;

  return {
    id: normalizedId,
    label: getSceneObjectLabel(match, normalizedId),
    type: getSceneObjectType(match),
    position: getSceneObjectPosition(match),
    emphasis: getSceneObjectEmphasis(match),
    metadata: getSceneObjectMetadata(match),
    raw: match,
  };
}
