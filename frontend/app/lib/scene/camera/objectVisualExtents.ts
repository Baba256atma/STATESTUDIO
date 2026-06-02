import { normalizeExecutiveObjectScale } from "../executiveSceneComposition";
import {
  resolveExecutiveNormalizedGeometryForObject,
  type ExecutiveGeometryBounds,
} from "../geometry/executiveRawGeometryClamp";

export type ObjectVisualExtents = {
  radius: number;
  width: number;
  height: number;
  depth: number;
};

export type ResolveObjectVisualExtentsOptions = {
  globalScale?: number;
  uxScale?: number;
  objectCount?: number;
  selected?: boolean;
  focused?: boolean;
  shape?: string | null;
};

export const MAX_EXECUTIVE_OBJECT_WIDTH = 3.2;
export const MAX_EXECUTIVE_OBJECT_HEIGHT = 2.6;
export const MAX_EXECUTIVE_OBJECT_DEPTH = 3.2;

function readUniformScale(object: unknown): number {
  const record = object as { scale?: unknown; transform?: { scale?: unknown } } | null;
  const transformScale = record?.transform?.scale;
  if (Array.isArray(transformScale) && transformScale.length > 0) {
    const uniform = Number(transformScale[0]);
    if (Number.isFinite(uniform)) return uniform;
  }
  if (Array.isArray(record?.scale) && record.scale.length > 0) {
    const uniform = Number(record.scale[0]);
    if (Number.isFinite(uniform)) return uniform;
  }
  const scalar = Number(record?.scale);
  return Number.isFinite(scalar) ? scalar : 1;
}

function readObjectId(object: unknown): string | null {
  const record = object as { id?: unknown; name?: unknown } | null;
  const value = record?.id ?? record?.name;
  return value == null ? null : String(value);
}

function readExplicitDimension(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = Number(record[key]);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return null;
}

function readExplicitBounds(object: unknown): Partial<ExecutiveGeometryBounds> | null {
  if (!object || typeof object !== "object") return null;
  const record = object as Record<string, unknown>;
  const dimensions = record.dimensions && typeof record.dimensions === "object"
    ? (record.dimensions as Record<string, unknown>)
    : record;
  const width = readExplicitDimension(dimensions, ["width", "w"]);
  const height = readExplicitDimension(dimensions, ["height", "h"]);
  const depth = readExplicitDimension(dimensions, ["depth", "d"]);
  if (width == null && height == null && depth == null) return null;
  return {
    width: width ?? undefined,
    height: height ?? undefined,
    depth: depth ?? undefined,
  };
}

function clampBoundsContribution(bounds: ExecutiveGeometryBounds): ExecutiveGeometryBounds {
  return {
    width: Math.min(bounds.width, MAX_EXECUTIVE_OBJECT_WIDTH),
    height: Math.min(bounds.height, MAX_EXECUTIVE_OBJECT_HEIGHT),
    depth: Math.min(bounds.depth, MAX_EXECUTIVE_OBJECT_DEPTH),
  };
}

function roundExtent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(3));
}

export function resolveObjectVisualExtents(
  object: unknown,
  options: ResolveObjectVisualExtentsOptions = {}
): ObjectVisualExtents {
  const rawScale = readUniformScale(object);
  const uxScale = Number.isFinite(options.uxScale) ? Number(options.uxScale) : 1;
  const globalScale = Number.isFinite(options.globalScale) ? Number(options.globalScale) : 1;
  const scale = normalizeExecutiveObjectScale({
    objectId: readObjectId(object),
    scale: rawScale * uxScale * globalScale,
    objectCount: options.objectCount,
    selected: options.selected,
    focused: options.focused,
  });
  const geometry = resolveExecutiveNormalizedGeometryForObject(object, {
    transformScale: scale,
    selected: options.selected,
    shape: options.shape ?? undefined,
  });
  const explicitBounds = readExplicitBounds(object);
  const unclamped = {
    width: (explicitBounds?.width ?? geometry.dimensions.width) * geometry.transformScale,
    height: (explicitBounds?.height ?? geometry.dimensions.height) * geometry.transformScale,
    depth: (explicitBounds?.depth ?? geometry.dimensions.depth) * geometry.transformScale,
  };
  const padded = {
    width: Math.max(0.48, unclamped.width * 1.18),
    height: Math.max(0.42, unclamped.height * 1.18),
    depth: Math.max(0.48, unclamped.depth * 1.18),
  };
  const clamped = clampBoundsContribution(padded);
  const radius = Math.sqrt(
    (clamped.width / 2) ** 2 +
      (clamped.height / 2) ** 2 +
      (clamped.depth / 2) ** 2
  );
  return {
    radius: roundExtent(radius),
    width: roundExtent(clamped.width),
    height: roundExtent(clamped.height),
    depth: roundExtent(clamped.depth),
  };
}

export function buildObjectVisualExtentsSignature(extents: ObjectVisualExtents): string {
  return `${extents.width.toFixed(2)},${extents.height.toFixed(2)},${extents.depth.toFixed(2)}`;
}
