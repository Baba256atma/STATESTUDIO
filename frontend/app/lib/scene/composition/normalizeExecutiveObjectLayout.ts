/**
 * E2:107 — Executive operational map layout for Type-C scenes (6–12 objects).
 * Render-only positions; does not mutate scene JSON.
 */

import type { Vector3Tuple } from "../../sceneTypes";
import { computeScaleAwareSceneBounds, fitCameraToSceneObjects } from "../camera/fitCameraToSceneObjects";
import type { ExecutiveCameraBounds } from "../camera/executive2DCameraProfile";
import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";

export const EXECUTIVE_LAYOUT_MIN_DISTANCE = 1.8;

export type ExecutiveObjectLayoutRole = "center" | "flow" | "risk" | "outcome" | "other";

export type ExecutiveLayoutLabelOffset = {
  y: number;
  opacity: number;
};

export type NormalizeExecutiveObjectLayoutOptions = {
  minDistance?: number;
  centerObjectId?: string | null;
  viewportMode?: WorkspaceViewMode;
  viewportWidth?: number;
  viewportHeight?: number;
};

export type ExecutiveLayoutNormalizedResult = {
  positions: Record<string, Vector3Tuple>;
  layoutPreset: string;
  bounds: ExecutiveCameraBounds;
  objectCount: number;
  visibleCount: number;
  minDistance: number;
  overlapCountBefore: number;
  overlapCountAfter: number;
  cameraFitDistance: number;
  labelOffsets: Record<string, ExecutiveLayoutLabelOffset>;
};

type LayoutObject = {
  id: string;
  label: string;
  role: ExecutiveObjectLayoutRole;
  rawPosition: Vector3Tuple;
};

const layoutCache = new Map<string, ExecutiveLayoutNormalizedResult>();
const emittedLayoutSignatures = new Set<string>();
const emittedLayoutAuditSignatures = new Set<string>();

function readObjectId(obj: unknown, index: number): string {
  const record = obj as { id?: unknown; name?: unknown } | null;
  return String(record?.id ?? record?.name ?? `obj:${index}`);
}

function readObjectPosition(obj: unknown): Vector3Tuple {
  const record = obj as { transform?: { pos?: unknown }; position?: unknown } | null;
  const source =
    Array.isArray(record?.transform?.pos) && (record?.transform?.pos as unknown[]).length >= 3
      ? (record?.transform?.pos as number[])
      : Array.isArray(record?.position) && record.position.length >= 3
        ? (record.position as number[])
        : [0, 0, 0];
  return [Number(source[0]) || 0, Number(source[1]) || 0, Number(source[2]) || 0];
}

function readObjectLabel(obj: unknown, fallbackId: string): string {
  const record = obj as { label?: unknown; name?: unknown } | null;
  return String(record?.label ?? record?.name ?? fallbackId).trim() || fallbackId;
}

export function classifyExecutiveObjectLayoutRole(obj: unknown): ExecutiveObjectLayoutRole {
  const record = obj as {
    label?: unknown;
    name?: unknown;
    role?: unknown;
    type?: unknown;
    semantic?: { role?: unknown; category?: unknown; tags?: unknown[] };
    tags?: unknown[];
  } | null;
  const label = readObjectLabel(obj, "object").toLowerCase();
  const role = String(record?.role ?? record?.semantic?.role ?? "").toLowerCase();
  const category = String(record?.semantic?.category ?? "").toLowerCase();
  const tags = [...(Array.isArray(record?.semantic?.tags) ? record.semantic.tags : []), ...(Array.isArray(record?.tags) ? record.tags : [])]
    .map((tag) => String(tag).toLowerCase());

  if (
    /operations|nexora.?core|warehouse|execution hub/.test(label) ||
    role === "operational_node" ||
    category === "execution"
  ) {
    return "center";
  }
  if (
    /risk|delay|disruption|pressure|fragility|cash pressure|price pressure/.test(label) ||
    role.includes("risk") ||
    category.includes("risk") ||
    category.includes("pressure") ||
    tags.some((tag) => tag.includes("pressure") || tag.includes("risk") || tag.includes("fragility"))
  ) {
    return "risk";
  }
  if (
    /customer|trust|outcome|demand|satisfaction/.test(label) ||
    role.includes("customer") ||
    role.includes("outcome") ||
    category.includes("outcome") ||
    category.includes("market")
  ) {
    return "outcome";
  }
  if (
    /supplier|delivery|flow|inventory|buffer|capacity|fulfillment|operational flow/.test(label) ||
    role.includes("flow") ||
    role.includes("buffer") ||
    role.includes("core_system") ||
    category.includes("operations") ||
    tags.some((tag) => tag.includes("flow") || tag.includes("supplier") || tag.includes("buffer"))
  ) {
    return "flow";
  }
  return "other";
}

function distance3(a: Vector3Tuple, b: Vector3Tuple): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function countOverlaps(positions: Vector3Tuple[], minDistance: number): number {
  let overlaps = 0;
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      if (distance3(positions[i], positions[j]) < minDistance) overlaps += 1;
    }
  }
  return overlaps;
}

function pushApart(positions: Vector3Tuple[], minDistance: number, iterations = 8): Vector3Tuple[] {
  const next = positions.map((pos) => [...pos] as Vector3Tuple);
  for (let pass = 0; pass < iterations; pass += 1) {
    for (let i = 0; i < next.length; i += 1) {
      for (let j = i + 1; j < next.length; j += 1) {
        const dist = distance3(next[i], next[j]);
        if (dist >= minDistance || dist <= 1e-6) continue;
        const push = (minDistance - dist) / 2;
        const dx = (next[j][0] - next[i][0]) / dist;
        const dz = (next[j][2] - next[i][2]) / dist;
        next[i][0] -= dx * push;
        next[i][1] = 0;
        next[i][2] -= dz * push;
        next[j][0] += dx * push;
        next[j][1] = 0;
        next[j][2] += dz * push;
      }
    }
  }
  return next.map(([x, y, z]) => [Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3))]);
}

function roleSortWeight(role: ExecutiveObjectLayoutRole): number {
  switch (role) {
    case "center":
      return 0;
    case "flow":
      return 1;
    case "risk":
      return 2;
    case "outcome":
      return 3;
    default:
      return 4;
  }
}

function buildExecutiveSlotMap(count: number): Record<ExecutiveObjectLayoutRole, Vector3Tuple[]> {
  if (count >= 6 && count <= 12) {
    // Executive operational layout is ground-plane based:
    // X = horizontal, Y = elevation, Z = depth.
    // Base object placement must keep Y = 0.
    return {
      center: [[0, 0, 0]],
      flow: [
        [-4.2, 0, 2.4],
        [-1.4, 0, 2.4],
        [1.4, 0, 2.4],
        [4.2, 0, 2.4],
        [-4.2, 0, -2.4],
        [-1.4, 0, -2.4],
      ],
      risk: [
        [-2.8, 0, 0],
        [0, 0, -0.8],
        [2.8, 0, 0],
      ],
      outcome: [
        [1.4, 0, -2.4],
        [4.2, 0, -2.4],
        [0, 0, -2.4],
      ],
      other: [
        [-2.8, 0, -1.2],
        [2.8, 0, -1.2],
        [0, 0, 1.2],
      ],
    };
  }

  const cols = Math.max(3, Math.ceil(Math.sqrt(count)));
  const spacing = EXECUTIVE_LAYOUT_MIN_DISTANCE + 0.2;
  const gridSlots: Vector3Tuple[] = [];
  for (let index = 0; index < count; index += 1) {
    const col = index % cols;
    const row = Math.floor(index / cols);
    gridSlots.push([
      (col - (cols - 1) / 2) * spacing,
      0,
      (row - Math.floor((count - 1) / cols) / 2) * spacing,
    ]);
  }
  return {
    center: [gridSlots[0] ?? [0, 0, 0]],
    flow: gridSlots.slice(1),
    risk: [],
    outcome: [],
    other: [],
  };
}

function assignExecutivePositions(
  objects: LayoutObject[],
  minDistance: number
): {
  positions: Record<string, Vector3Tuple>;
  preset: string;
  slotPositions: Record<string, Vector3Tuple>;
} {
  const slots = buildExecutiveSlotMap(objects.length);
  const slotCursor: Record<ExecutiveObjectLayoutRole, number> = {
    center: 0,
    flow: 0,
    risk: 0,
    outcome: 0,
    other: 0,
  };

  const sorted = [...objects].sort((a, b) => {
    const roleDelta = roleSortWeight(a.role) - roleSortWeight(b.role);
    if (roleDelta !== 0) return roleDelta;
    return a.rawPosition[0] - b.rawPosition[0];
  });

  const assigned: Vector3Tuple[] = [];
  const idOrder: string[] = [];
  const positions: Record<string, Vector3Tuple> = {};
  const slotPositions: Record<string, Vector3Tuple> = {};

  for (const object of sorted) {
    const roleSlots = slots[object.role].length > 0 ? slots[object.role] : slots.other;
    const slotIndex = Math.min(slotCursor[object.role], roleSlots.length - 1);
    slotCursor[object.role] += 1;
    const slot = roleSlots[slotIndex] ?? [0, 0, 0];
    positions[object.id] = [...slot];
    slotPositions[object.id] = [...slot];
    assigned.push([...slot]);
    idOrder.push(object.id);
  }

  const pushed = pushApart(assigned, minDistance);
  idOrder.forEach((id, index) => {
    positions[id] = pushed[index] ?? positions[id];
  });

  const preset =
    objects.length >= 6 && objects.length <= 12 ? "executive_operational_map" : "executive_compact_grid";
  return { positions, preset, slotPositions };
}

function buildLabelOffsets(
  objects: LayoutObject[],
  positions: Record<string, Vector3Tuple>
): Record<string, ExecutiveLayoutLabelOffset> {
  const offsets: Record<string, ExecutiveLayoutLabelOffset> = {};
  const sorted = [...objects].sort((a, b) => positions[a.id][0] - positions[b.id][0]);

  sorted.forEach((object, index) => {
    let y = 0;
    let opacity = 1;
    for (let prior = 0; prior < index; prior += 1) {
      const other = sorted[prior];
      const dist = distance3(positions[object.id], positions[other.id]);
      if (dist < 2.4) {
        y += 0.14;
        if (dist < 1.6) opacity = Math.min(opacity, 0.88);
      }
    }
    offsets[object.id] = { y, opacity };
  });
  return offsets;
}

function buildLayoutSignature(objects: unknown[], options?: NormalizeExecutiveObjectLayoutOptions): string {
  return JSON.stringify({
    ids: objects.map((obj, index) => {
      const id = readObjectId(obj, index);
      const pos = readObjectPosition(obj);
      return `${id}:${classifyExecutiveObjectLayoutRole(obj)}:${pos.map((v) => Math.round(v * 10) / 10).join(",")}`;
    }),
    minDistance: options?.minDistance ?? EXECUTIVE_LAYOUT_MIN_DISTANCE,
    centerObjectId: options?.centerObjectId ?? null,
  });
}

export function normalizeExecutiveObjectLayout(
  objects: unknown[],
  options?: NormalizeExecutiveObjectLayoutOptions
): ExecutiveLayoutNormalizedResult {
  const minDistance = options?.minDistance ?? EXECUTIVE_LAYOUT_MIN_DISTANCE;
  const signature = buildLayoutSignature(objects, options);
  const cached = layoutCache.get(signature);
  if (cached) return cached;

  if (!objects.length) {
    const empty: ExecutiveLayoutNormalizedResult = {
      positions: {},
      layoutPreset: "empty",
      bounds: { center: [0, 0, 0], size: [4, 4, 4] },
      objectCount: 0,
      visibleCount: 0,
      minDistance,
      overlapCountBefore: 0,
      overlapCountAfter: 0,
      cameraFitDistance: 0,
      labelOffsets: {},
    };
    layoutCache.set(signature, empty);
    return empty;
  }

  const layoutObjects: LayoutObject[] = objects.map((obj, index) => {
    const id = readObjectId(obj, index);
    let role = classifyExecutiveObjectLayoutRole(obj);
    if (options?.centerObjectId && id === options.centerObjectId) role = "center";
    return {
      id,
      label: readObjectLabel(obj, id),
      role,
      rawPosition: readObjectPosition(obj),
    };
  });

  const rawPositions = layoutObjects.map((obj) => obj.rawPosition);
  const overlapCountBefore = countOverlaps(rawPositions, minDistance);
  const { positions, preset, slotPositions } = assignExecutivePositions(layoutObjects, minDistance);
  const normalizedPositions = layoutObjects.map((obj) => positions[obj.id]);
  const overlapCountAfter = countOverlaps(normalizedPositions, minDistance);

  const virtualObjects = objects.map((obj, index) => {
    const id = readObjectId(obj, index);
    const pos = positions[id] ?? readObjectPosition(obj);
    return {
      ...(obj as object),
      id,
      position: pos,
      transform: { ...((obj as { transform?: object }).transform ?? {}), pos },
    };
  });

  const bounds = computeScaleAwareSceneBounds(virtualObjects);
  const fit = fitCameraToSceneObjects({
    objects: virtualObjects,
    mode: options?.viewportMode ?? "3D",
    viewportWidth: options?.viewportWidth,
    viewportHeight: options?.viewportHeight,
    layoutPositions: positions,
  });

  const result: ExecutiveLayoutNormalizedResult = {
    positions,
    layoutPreset: preset,
    bounds,
    objectCount: objects.length,
    visibleCount: objects.length,
    minDistance,
    overlapCountBefore,
    overlapCountAfter,
    cameraFitDistance: fit.radius,
    labelOffsets: buildLabelOffsets(layoutObjects, positions),
  };

  layoutCache.set(signature, result);

  if (process.env.NODE_ENV !== "production" && !emittedLayoutSignatures.has(signature)) {
    emittedLayoutSignatures.add(signature);
    globalThis.console?.debug?.("[Nexora][ExecutiveObjectLayoutNormalized]", {
      objectCount: result.objectCount,
      visibleCount: result.visibleCount,
      minDistance: result.minDistance,
      overlapCountBefore: result.overlapCountBefore,
      overlapCountAfter: result.overlapCountAfter,
      layoutPreset: result.layoutPreset,
      bounds: result.bounds,
      cameraFitDistance: result.cameraFitDistance,
    });
  }

  if (process.env.NODE_ENV !== "production" && !emittedLayoutAuditSignatures.has(signature)) {
    emittedLayoutAuditSignatures.add(signature);
    layoutObjects.forEach((object) => {
      globalThis.console?.debug?.("[Nexora][LayoutAudit]", {
        id: object.id,
        role: object.role,
        slot: slotPositions[object.id] ?? null,
        position: result.positions[object.id] ?? null,
      });
    });
  }

  return result;
}

export function resetExecutiveObjectLayoutForTests(): void {
  layoutCache.clear();
  emittedLayoutSignatures.clear();
  emittedLayoutAuditSignatures.clear();
}

export const EXECUTIVE_OPERATIONAL_LAYOUT_MIN_OBJECTS = 6;
export const EXECUTIVE_OPERATIONAL_LAYOUT_MAX_OBJECTS = 12;

export function shouldUseExecutiveOperationalLayout(objectCount: number): boolean {
  return objectCount >= EXECUTIVE_OPERATIONAL_LAYOUT_MIN_OBJECTS && objectCount <= EXECUTIVE_OPERATIONAL_LAYOUT_MAX_OBJECTS;
}

export function resolveExecutiveOperationalLayoutCameraFit(input: {
  objects: unknown[];
  mode: WorkspaceViewMode;
  viewportWidth?: number;
  viewportHeight?: number;
}) {
  const layout = normalizeExecutiveObjectLayout(input.objects, {
    viewportMode: input.mode,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
  });
  return fitCameraToSceneObjects({
    objects: input.objects,
    mode: input.mode,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
    layoutPositions: layout.positions,
  });
}

export function resolveExecutiveOperationalSceneCenter(sceneJson: unknown): [number, number, number] | null {
  const objects = Array.isArray((sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects)
    ? ((sceneJson as { scene: { objects: unknown[] } }).scene.objects as unknown[])
    : [];
  if (!shouldUseExecutiveOperationalLayout(objects.length)) return null;
  const fit = resolveExecutiveOperationalLayoutCameraFit({
    objects,
    mode: "3D",
  });
  return fit.center;
}
