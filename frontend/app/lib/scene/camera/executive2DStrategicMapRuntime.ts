/**
 * P1 — 2D executive strategic map framing (topology-first, not geometry-first).
 */

import type { ExecutiveCameraBounds } from "./executive2DCameraProfile";

/** Uniform node footprint for map bounds — ignores oversized raw geometry. */
export const STRATEGIC_2D_NODE_RADIUS = 0.52;

/** Extra padding so relationship edges remain inside the viewport. */
export const STRATEGIC_2D_NETWORK_PADDING = 1.28;

/** Minimum ground-plane span for readable multi-node maps. */
export const STRATEGIC_2D_MIN_NETWORK_SPAN = 6.5;

function readObjectId(obj: unknown, index: number): string {
  const record = obj as { id?: unknown; name?: unknown } | null;
  return String(record?.id ?? record?.name ?? `obj:${index}`);
}

function readObjectPosition(
  obj: unknown,
  layoutPositions?: Record<string, [number, number, number]>
): [number, number, number] | null {
  const id = readObjectId(obj, 0);
  if (layoutPositions?.[id]) return layoutPositions[id];

  const record = obj as { transform?: { pos?: unknown }; position?: unknown; name?: unknown } | null;
  const altId = record?.name != null ? String(record.name) : null;
  if (altId && layoutPositions?.[altId]) return layoutPositions[altId]!;

  const source =
    Array.isArray(record?.transform?.pos) && (record?.transform?.pos as unknown[]).length >= 3
      ? (record?.transform?.pos as number[])
      : Array.isArray(record?.position) && record.position.length >= 3
        ? (record.position as number[])
        : null;
  if (!source) return null;
  const x = Number(source[0]);
  const y = Number(source[1]);
  const z = Number(source[2]);
  if (![x, y, z].every(Number.isFinite)) return null;
  return [x, y, z];
}

/**
 * Bounds from node positions + uniform strategic footprint.
 * Does not expand bounds from largest mesh geometry.
 */
export function compute2DStrategicNetworkBounds(
  objects: unknown[],
  layoutPositions?: Record<string, [number, number, number]>,
  options?: {
    nodeRadius?: number;
    networkPadding?: number;
  }
): ExecutiveCameraBounds & {
  min: [number, number, number];
  max: [number, number, number];
} {
  const nodeRadius = options?.nodeRadius ?? STRATEGIC_2D_NODE_RADIUS;
  const networkPadding = options?.networkPadding ?? STRATEGIC_2D_NETWORK_PADDING;

  if (!objects.length) {
    return {
      min: [-3, 0, -3],
      max: [3, 0, 3],
      center: [0, 0, 0],
      size: [6, 0.5, 6],
    };
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = 0;
  let minZ = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = 0;
  let maxZ = Number.NEGATIVE_INFINITY;
  let positioned = 0;

  objects.forEach((obj, index) => {
    const position = readObjectPosition(obj, layoutPositions);
    if (!position) return;
    positioned += 1;
    const [x, , z] = position;
    minX = Math.min(minX, x - nodeRadius);
    minZ = Math.min(minZ, z - nodeRadius);
    maxX = Math.max(maxX, x + nodeRadius);
    maxZ = Math.max(maxZ, z + nodeRadius);
  });

  if (!positioned || !Number.isFinite(minX)) {
    return {
      min: [-3, 0, -3],
      max: [3, 0, 3],
      center: [0, 0, 0],
      size: [6, 0.5, 6],
    };
  }

  const width = Math.max(STRATEGIC_2D_MIN_NETWORK_SPAN, (maxX - minX) * networkPadding);
  const depth = Math.max(STRATEGIC_2D_MIN_NETWORK_SPAN, (maxZ - minZ) * networkPadding);
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const halfW = width / 2;
  const halfD = depth / 2;

  return {
    min: [centerX - halfW, minY, centerZ - halfD],
    max: [centerX + halfW, maxY, centerZ + halfD],
    center: [centerX, 0, centerZ],
    size: [width, 0.5, depth],
  };
}
