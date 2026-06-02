import { getSceneObjectId, getSceneObjects } from "./resolveSceneObjectById";

export type SceneObjectHudPosition = [number, number, number];

function toPosTuple(raw: unknown, fallback: [number, number, number]): [number, number, number] {
  if (Array.isArray(raw) && raw.length >= 3) {
    return [Number(raw[0]) || 0, Number(raw[1]) || 0, Number(raw[2]) || 0];
  }
  if (raw && typeof raw === "object" && "x" in raw && "y" in raw && "z" in raw) {
    const record = raw as { x?: unknown; y?: unknown; z?: unknown };
    return [Number(record.x) || 0, Number(record.y) || 0, Number(record.z) || 0];
  }
  return fallback;
}

function fallbackPos(index: number, total: number): [number, number, number] {
  const n = Math.max(1, total);
  const radius = Math.max(2.5, n * 0.12);
  const angle = (index / n) * Math.PI * 2;
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
}

function hashIdToUnit(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 100000) / 100000;
}

function fallbackPosFromId(id: string): [number, number, number] {
  const unit = hashIdToUnit(id);
  const angle = unit * Math.PI * 2;
  const radius = 2.2;
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
}

const BASELINE_POS: Record<string, [number, number, number]> = {
  obj_inventory: [-1.6, 0, 0],
  obj_delivery: [0, 0, 0],
  obj_risk_zone: [1.6, 0, 0],
};

/**
 * Resolves a stable world position for object-anchored HUD placement.
 */
export function resolveSceneObjectHudPosition(
  sceneJson: unknown,
  objectId: string | null | undefined
): SceneObjectHudPosition | null {
  const normalizedId = typeof objectId === "string" ? objectId.trim() : "";
  if (!normalizedId) return null;

  const objects = getSceneObjects(sceneJson as Parameters<typeof getSceneObjects>[0]);
  if (!objects.length) return null;

  if (BASELINE_POS[normalizedId]) {
    const [x, y, z] = BASELINE_POS[normalizedId];
    return [x, y + 0.55, z];
  }

  const index = objects.findIndex((entry) => getSceneObjectId(entry) === normalizedId);
  const match = index >= 0 ? objects[index] : null;
  const defaultPos = index >= 0 ? fallbackPos(index, objects.length) : fallbackPosFromId(normalizedId);
  const transform = match && typeof match.transform === "object" ? (match.transform as { pos?: unknown }) : null;
  const pos = toPosTuple(transform?.pos ?? match?.position, defaultPos);
  return [pos[0], pos[1] + 0.55, pos[2]];
}
