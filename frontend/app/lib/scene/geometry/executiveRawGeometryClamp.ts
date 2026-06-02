/**
 * E2:108 — Clamp raw mesh geometry dimensions before render for Type-C executive scenes.
 */

import {
  clampExecutiveTypeCObjectScale,
  isZoneLikeExecutiveObject,
} from "../objectScaling/executiveTypeCScaleClamp";

export type ExecutiveGeometryBounds = {
  width: number;
  height: number;
  depth: number;
};

export const EXECUTIVE_NORMAL_GEOMETRY_MAX: ExecutiveGeometryBounds = {
  width: 1.4,
  height: 1.0,
  depth: 1.4,
};

export const EXECUTIVE_ZONE_GEOMETRY_MAX: ExecutiveGeometryBounds = {
  width: 1.2,
  depth: 0.6,
  height: 0.35,
};

export const EXECUTIVE_MAX_WORLD_SIZE = 2.0;

export type ExecutiveNormalizedGeometrySpec = {
  renderKind: string;
  args: number[];
  dimensions: ExecutiveGeometryBounds;
  transformScale: number;
  finalWorldSize: number;
};

const BASE_GEOMETRY_ARGS: Record<string, number[]> = {
  sphere: [0.8, 32, 32],
  box: [1.2, 1.2, 1.2],
  torus: [0.8, 0.25, 20, 60],
  ring: [0.55, 0.12, 16, 32],
  cone: [0.8, 1.4, 32],
  cylinder: [0.6, 0.6, 1.4, 32],
  icosahedron: [0.9, 0],
  points_cloud: [1.25, 16, 16],
};

function round3(value: number): number {
  return Number(value.toFixed(3));
}

function clampDimension(value: number, max: number): number {
  return Math.min(Math.max(value, 0.08), max);
}

function clampBounds(bounds: ExecutiveGeometryBounds, max: ExecutiveGeometryBounds): ExecutiveGeometryBounds {
  return {
    width: clampDimension(bounds.width, max.width),
    height: clampDimension(bounds.height, max.height),
    depth: clampDimension(bounds.depth, max.depth),
  };
}

export function isRegionPlaneGeometryType(type: unknown): boolean {
  const key = String(type ?? "").toLowerCase();
  return key === "region" || key === "area" || key === "plane";
}

export function readBaseGeometryBounds(type: string): ExecutiveGeometryBounds {
  const key = String(type ?? "box").toLowerCase();
  switch (key) {
    case "sphere":
    case "icosahedron": {
      const radius = BASE_GEOMETRY_ARGS[key]?.[0] ?? 0.8;
      const diameter = radius * 2;
      return { width: diameter, height: diameter, depth: diameter };
    }
    case "box":
    case "region":
    case "area":
    case "plane": {
      const [width = 1, height = 1, depth = 1] = BASE_GEOMETRY_ARGS.box;
      return { width, height, depth };
    }
    case "torus":
    case "ring": {
      const [major = 0.8, tube = 0.2] = BASE_GEOMETRY_ARGS[key] ?? BASE_GEOMETRY_ARGS.torus;
      const outer = major + tube;
      return { width: outer * 2, height: tube * 2, depth: outer * 2 };
    }
    case "cone": {
      const [radius = 0.8, height = 1.4] = BASE_GEOMETRY_ARGS.cone;
      return { width: radius * 2, height, depth: radius * 2 };
    }
    case "cylinder": {
      const [radius = 0.6, , height = 1.4] = BASE_GEOMETRY_ARGS.cylinder;
      return { width: radius * 2, height, depth: radius * 2 };
    }
    case "points_cloud": {
      const radius = BASE_GEOMETRY_ARGS.points_cloud[0];
      const diameter = radius * 2;
      return { width: diameter, height: diameter, depth: diameter };
    }
    default: {
      const [width = 1, height = 1, depth = 1] = BASE_GEOMETRY_ARGS.box;
      return { width, height, depth };
    }
  }
}

export function geometryArgsFromBounds(type: string, bounds: ExecutiveGeometryBounds): { renderKind: string; args: number[] } {
  const key = String(type ?? "box").toLowerCase();
  if (isRegionPlaneGeometryType(key)) {
    return {
      renderKind: "box",
      args: [round3(bounds.width), round3(bounds.height), round3(bounds.depth)],
    };
  }

  switch (key) {
    case "sphere":
    case "icosahedron":
      return {
        renderKind: key,
        args: [round3(Math.min(bounds.width, bounds.height, bounds.depth) / 2), ...(BASE_GEOMETRY_ARGS[key]?.slice(1) ?? [0])],
      };
    case "box":
      return {
        renderKind: "box",
        args: [round3(bounds.width), round3(bounds.height), round3(bounds.depth)],
      };
    case "torus":
    case "ring": {
      const outer = Math.min(bounds.width, bounds.depth) / 2;
      const tube = Math.max(0.06, Math.min(bounds.height / 2, outer * 0.28));
      const major = Math.max(0.08, outer - tube);
      const base = BASE_GEOMETRY_ARGS[key] ?? BASE_GEOMETRY_ARGS.torus;
      return {
        renderKind: key,
        args: [round3(major), round3(tube), base[2] ?? 20, base[3] ?? 60],
      };
    }
    case "cone": {
      const radius = Math.min(bounds.width, bounds.depth) / 2;
      const base = BASE_GEOMETRY_ARGS.cone;
      return {
        renderKind: "cone",
        args: [round3(radius), round3(bounds.height), base[2] ?? 32],
      };
    }
    case "cylinder": {
      const radius = Math.min(bounds.width, bounds.depth) / 2;
      const base = BASE_GEOMETRY_ARGS.cylinder;
      return {
        renderKind: "cylinder",
        args: [round3(radius), round3(radius), round3(bounds.height), base[3] ?? 32],
      };
    }
    case "points_cloud": {
      const radius = Math.min(bounds.width, bounds.height, bounds.depth) / 2;
      const base = BASE_GEOMETRY_ARGS.points_cloud;
      return {
        renderKind: "sphere",
        args: [round3(radius), base[1] ?? 16, base[2] ?? 16],
      };
    }
    default:
      return {
        renderKind: "box",
        args: [round3(bounds.width), round3(bounds.height), round3(bounds.depth)],
      };
  }
}

export function resolveExecutiveNormalizedGeometry(input: {
  type: string;
  zoneLike?: boolean;
  transformScale?: number;
  selected?: boolean;
}): ExecutiveNormalizedGeometrySpec {
  const type = String(input.type ?? "box").toLowerCase();
  const zoneLike = input.zoneLike === true || isRegionPlaneGeometryType(type);
  const maxBounds = zoneLike ? EXECUTIVE_ZONE_GEOMETRY_MAX : EXECUTIVE_NORMAL_GEOMETRY_MAX;
  const baseBounds = readBaseGeometryBounds(type);
  const clampedBounds = clampBounds(baseBounds, maxBounds);
  const { renderKind, args } = geometryArgsFromBounds(type, clampedBounds);
  const dimensions = clampedBounds;

  const rawScale = Number.isFinite(input.transformScale) ? Number(input.transformScale) : 1;
  let transformScale = clampExecutiveTypeCObjectScale(rawScale, {
    zoneLike,
    selected: input.selected,
  });

  const maxDimension = Math.max(dimensions.width, dimensions.height, dimensions.depth);
  let finalWorldSize = maxDimension * transformScale;
  if (finalWorldSize > EXECUTIVE_MAX_WORLD_SIZE) {
    transformScale = EXECUTIVE_MAX_WORLD_SIZE / Math.max(maxDimension, 1e-6);
    finalWorldSize = maxDimension * transformScale;
  }

  return {
    renderKind: zoneLike && isRegionPlaneGeometryType(type) ? "box" : renderKind,
    args,
    dimensions: {
      width: round3(dimensions.width),
      height: round3(dimensions.height),
      depth: round3(dimensions.depth),
    },
    transformScale: round3(transformScale),
    finalWorldSize: round3(finalWorldSize),
  };
}

export function estimateExecutiveNormalizedObjectRadius(obj: unknown, transformScale = 1): number {
  const record = obj as { type?: unknown; shape?: unknown } | null;
  const type = String(record?.shape ?? record?.type ?? "box").toLowerCase();
  const zoneLike = isZoneLikeExecutiveObject(obj) || isRegionPlaneGeometryType(type);
  const normalized = resolveExecutiveNormalizedGeometry({
    type,
    zoneLike,
    transformScale,
  });
  return normalized.finalWorldSize / 2;
}

export function resolveExecutiveNormalizedGeometryForObject(
  obj: unknown,
  input?: { transformScale?: number; selected?: boolean; shape?: string }
): ExecutiveNormalizedGeometrySpec {
  const record = obj as { type?: unknown; shape?: unknown } | null;
  const type = String(input?.shape ?? record?.shape ?? record?.type ?? "box").toLowerCase();
  return resolveExecutiveNormalizedGeometry({
    type,
    zoneLike: isZoneLikeExecutiveObject(obj) || isRegionPlaneGeometryType(type),
    transformScale: input?.transformScale,
    selected: input?.selected,
  });
}
