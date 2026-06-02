/** E2:108 — One-shot dev audit of raw geometry dimensions and final world size. */

import {
  buildSceneObjectScaleAuditSignature,
  readObjectRawScale,
} from "../sceneObjectScaleAudit";
import {
  resolveExecutiveNormalizedGeometryForObject,
  type ExecutiveNormalizedGeometrySpec,
} from "./executiveRawGeometryClamp";

export type RawGeometryAuditEntry = {
  objectId: string;
  type: string;
  geometryWidth: number;
  geometryHeight: number;
  geometryDepth: number;
  scale: number;
  finalWorldSize: number;
};

function readObjectId(obj: unknown, index: number): string {
  const record = obj as { id?: unknown; name?: unknown } | null;
  return String(record?.id ?? record?.name ?? `obj:${index}`);
}

function readObjectType(obj: unknown): string {
  const record = obj as { type?: unknown; shape?: unknown } | null;
  return String(record?.shape ?? record?.type ?? "unknown");
}

export function buildRawGeometryAuditEntries(sceneJson: unknown): RawGeometryAuditEntry[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  if (!Array.isArray(objects)) return [];

  return objects.map((obj, index) => {
    const objectId = readObjectId(obj, index);
    const type = readObjectType(obj);
    const scale = readObjectRawScale(obj);
    const normalized: ExecutiveNormalizedGeometrySpec = resolveExecutiveNormalizedGeometryForObject(obj, {
      transformScale: scale,
    });
    return {
      objectId,
      type,
      geometryWidth: normalized.dimensions.width,
      geometryHeight: normalized.dimensions.height,
      geometryDepth: normalized.dimensions.depth,
      scale: normalized.transformScale,
      finalWorldSize: normalized.finalWorldSize,
    };
  });
}

const emittedAuditSignatures = new Set<string>();

export function logRawGeometryAuditOnce(sceneJson: unknown): RawGeometryAuditEntry[] {
  const entries = buildRawGeometryAuditEntries(sceneJson);
  if (process.env.NODE_ENV === "production") return entries;

  const signature = buildSceneObjectScaleAuditSignature(sceneJson);
  if (emittedAuditSignatures.has(signature)) return entries;
  emittedAuditSignatures.add(signature);

  globalThis.console?.debug?.("[Nexora][RawGeometryAudit]", {
    signature,
    objectCount: entries.length,
    objects: entries,
  });
  return entries;
}

export function resetRawGeometryAuditForTests(): void {
  emittedAuditSignatures.clear();
}
