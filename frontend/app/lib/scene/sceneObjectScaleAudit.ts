/** E2:106 — One-shot dev audit of scene object scale and footprint. */

import { clampExecutiveTypeCObjectScale, isZoneLikeExecutiveObject } from "./objectScaling/executiveTypeCScaleClamp";
import { estimateExecutiveNormalizedObjectRadius } from "./geometry/executiveRawGeometryClamp";

export type SceneObjectScaleAuditEntry = {
  objectId: string;
  label: string;
  type: string;
  position: [number, number, number];
  scale: number;
  normalizedScale: number;
  computedRadius: number;
  boundingSizeEstimate: number;
};

function readObjectPosition(obj: unknown): [number, number, number] {
  const record = obj as { transform?: { pos?: unknown }; position?: unknown } | null;
  const source =
    Array.isArray(record?.transform?.pos) && (record?.transform?.pos as unknown[]).length >= 3
      ? (record?.transform?.pos as number[])
      : Array.isArray(record?.position) && record.position.length >= 3
        ? (record.position as number[])
        : [0, 0, 0];
  return [
    Number(source[0]) || 0,
    Number(source[1]) || 0,
    Number(source[2]) || 0,
  ];
}

export function readObjectRawScale(obj: unknown): number {
  const record = obj as { transform?: { scale?: unknown } } | null;
  const scale = record?.transform?.scale;
  if (Array.isArray(scale) && scale.length > 0) {
    const uniform = Number(scale[0]);
    return Number.isFinite(uniform) ? uniform : 1;
  }
  return 1;
}

function readObjectLabel(obj: unknown, fallbackId: string): string {
  const record = obj as { label?: unknown; name?: unknown; id?: unknown } | null;
  const label = String(record?.label ?? record?.name ?? record?.id ?? fallbackId).trim();
  return label.length > 0 ? label : fallbackId;
}

export function buildSceneObjectScaleAuditSignature(sceneJson: unknown): string {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  if (!Array.isArray(objects) || objects.length === 0) return "empty";
  return objects
    .map((obj, index) => {
      const record = obj as { id?: unknown; type?: unknown } | null;
      const id = String(record?.id ?? `obj:${index}`);
      const pos = readObjectPosition(obj).map((value) => Math.round(value * 100) / 100);
      const scale = Math.round(readObjectRawScale(obj) * 100) / 100;
      return `${id}:${String(record?.type ?? "unknown")}:${pos.join(",")}:${scale}`;
    })
    .sort()
    .join("|");
}

export function buildSceneObjectScaleAuditEntries(sceneJson: unknown): SceneObjectScaleAuditEntry[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  if (!Array.isArray(objects)) return [];

  return objects.map((obj, index) => {
    const record = obj as { id?: unknown; type?: unknown; shape?: unknown } | null;
    const objectId = String(record?.id ?? `obj:${index}`);
    const type = String(record?.type ?? "unknown");
    const position = readObjectPosition(obj);
    const scale = readObjectRawScale(obj);
    const normalizedScale = clampExecutiveTypeCObjectScale(scale, {
      zoneLike: isZoneLikeExecutiveObject(obj),
    });
    const computedRadius = estimateExecutiveNormalizedObjectRadius(obj, normalizedScale);
    return {
      objectId,
      label: readObjectLabel(obj, objectId),
      type,
      position,
      scale: Math.round(scale * 1000) / 1000,
      normalizedScale: Math.round(normalizedScale * 1000) / 1000,
      computedRadius: Math.round(computedRadius * 1000) / 1000,
      boundingSizeEstimate: Math.round(computedRadius * 2 * 1000) / 1000,
    };
  });
}

const emittedAuditSignatures = new Set<string>();

export function logSceneObjectScaleAuditOnce(sceneJson: unknown): SceneObjectScaleAuditEntry[] {
  const entries = buildSceneObjectScaleAuditEntries(sceneJson);
  if (process.env.NODE_ENV === "production") return entries;

  const signature = buildSceneObjectScaleAuditSignature(sceneJson);
  if (emittedAuditSignatures.has(signature)) return entries;
  emittedAuditSignatures.add(signature);

  globalThis.console?.debug?.("[Nexora][SceneObjectScaleAudit]", {
    signature,
    objectCount: entries.length,
    objects: entries,
  });
  return entries;
}

export function resetSceneObjectScaleAuditForTests(): void {
  emittedAuditSignatures.clear();
}
