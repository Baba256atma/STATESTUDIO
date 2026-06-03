/**
 * E2:107 — Executive operational map layout for Type-C scenes (6–12 objects).
 * Render-only positions; does not mutate scene JSON.
 */

import type { Vector3Tuple } from "../../sceneTypes";
import { computeScaleAwareSceneBounds, fitCameraToSceneObjects } from "../camera/fitCameraToSceneObjects";
import type { ExecutiveCameraBounds } from "../camera/executive2DCameraProfile";
import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import { assignExecutiveTemplatePositions } from "./executiveLayoutTemplateSlots";
import type { ExecutiveLayoutTemplateId } from "./executiveLayoutTemplateTypes";
import {
  buildExecutiveLayoutObjectRoleProfiles,
  collectExecutiveObjectSemanticTokens,
  logExecutiveLayoutTemplateResolvedOnce,
  resetExecutiveLayoutTemplateLogsForTests,
  resolveExecutiveLayoutTemplate,
} from "./resolveExecutiveLayoutTemplate";

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
  domainId?: string | null;
  scenePurpose?: string | null;
};

export type ExecutiveLayoutNormalizedResult = {
  positions: Record<string, Vector3Tuple>;
  layoutPreset: string;
  layoutTemplateId: ExecutiveLayoutTemplateId;
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
  tokens: string[];
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
      return `${id}:${classifyExecutiveObjectLayoutRole(obj)}:${collectExecutiveObjectSemanticTokens(obj, id).join("+")}:${pos.map((v) => Math.round(v * 10) / 10).join(",")}`;
    }),
    minDistance: options?.minDistance ?? EXECUTIVE_LAYOUT_MIN_DISTANCE,
    centerObjectId: options?.centerObjectId ?? null,
    domainId: options?.domainId ?? null,
    scenePurpose: options?.scenePurpose ?? null,
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
      layoutTemplateId: "generic_executive",
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
      tokens: collectExecutiveObjectSemanticTokens(obj, id),
    };
  });

  const roleProfiles = buildExecutiveLayoutObjectRoleProfiles(
    objects,
    classifyExecutiveObjectLayoutRole,
    readObjectId,
    readObjectLabel
  );
  const templateResolution = resolveExecutiveLayoutTemplate({
    domainId: options?.domainId ?? null,
    objectRoles: roleProfiles,
    objectCount: objects.length,
    scenePurpose: options?.scenePurpose ?? null,
  });

  logExecutiveLayoutTemplateResolvedOnce({
    templateId: templateResolution.templateId,
    domainId: templateResolution.domainId,
    objectCount: objects.length,
    roles: roleProfiles,
    reason: templateResolution.reason,
  });

  const rawPositions = layoutObjects.map((obj) => obj.rawPosition);
  const overlapCountBefore = countOverlaps(rawPositions, minDistance);
  const { positions, preset, slotPositions } = assignExecutiveTemplatePositions(
    layoutObjects,
    templateResolution.templateId,
    minDistance
  );
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
    layoutTemplateId: templateResolution.templateId,
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
  resetExecutiveLayoutTemplateLogsForTests();
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
