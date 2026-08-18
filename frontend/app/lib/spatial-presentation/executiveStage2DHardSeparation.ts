/**
 * STAGE-2D:6V-FIX — Single-Plane Renderer & Hard XY Separation.
 *
 * Corrective runtime phase:
 *   ONE VISUAL PLANE + ONE ANCHOR AUTHORITY + HARD XY SEPARATION
 *
 * Does not move the camera, invent relationships, or use Z for collision.
 */

import {
  EXECUTIVE_STAGE_2D_CENTER,
  EXECUTIVE_STAGE_2D_DEPTH,
  normalizeExecutiveStage2DPosition,
} from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS,
  type ExecutiveStage2DNeighborhoodClass,
  type ExecutiveStage2DResolvedPosition,
} from "./executiveStage2DTopologyRecomposition.ts";
import {
  EXECUTIVE_STAGE_2D_DIAL_EXCLUSION,
  isInsideExecutiveStage2DDialExclusion,
} from "./executiveStage2DVisualCertification.ts";
import {
  isExecutiveObject3DGeometryEnabled,
  resolveExecutiveObject3DSilhouetteHalfExtent,
} from "./executiveObject3DGeometry.ts";
import {
  isExecutive3DObjectVisualEnabled,
  EXECUTIVE_3D_OBJECT_SILHOUETTE_BOOST_BY_LEVEL,
} from "./executive3DObjectVisualProfile.ts";
import {
  isExecutive3DObjectPremiumFormEnabled,
  resolveExecutivePremiumObjectForm,
} from "./executive3DObjectPremiumForm.ts";
import {
  isExecutiveObjectPresenceV2Enabled,
  resolveExecutiveObjectPresenceFootprintHalfExtent,
  EXECUTIVE_OBJECT_PRESENCE_HARD_FOOTPRINT,
} from "./executiveObjectPresenceIdentity.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStage2DHardSeparationIdentity =
  "STAGE-2D:6V-FIX/ExecutiveStage2DHardSeparation" as const;

export const executiveStage2DHardSeparationVersion = "2.6.2" as const;

export const executiveStage2DHardSeparationNamespace =
  "nexora.spatial-presentation.executive-stage-2d-hard-separation" as const;

export const executiveStage2DHardSeparationPhase =
  "ExecutiveStage2DSinglePlaneRendererAndHardXySeparation" as const;

export const executiveStage2DHardSeparationArchitecturalRole =
  "PresentationOnlyStage2DHardSeparation" as const;

export type ExecutiveStage2DHardSeparationIdentity = {
  readonly id: typeof executiveStage2DHardSeparationIdentity;
  readonly version: typeof executiveStage2DHardSeparationVersion;
  readonly namespace: typeof executiveStage2DHardSeparationNamespace;
  readonly phase: typeof executiveStage2DHardSeparationPhase;
  readonly architecturalRole: typeof executiveStage2DHardSeparationArchitecturalRole;
};

const IDENTITY: ExecutiveStage2DHardSeparationIdentity = Object.freeze({
  id: executiveStage2DHardSeparationIdentity,
  version: executiveStage2DHardSeparationVersion,
  namespace: executiveStage2DHardSeparationNamespace,
  phase: executiveStage2DHardSeparationPhase,
  architecturalRole: executiveStage2DHardSeparationArchitecturalRole,
});

export function getExecutiveStage2DHardSeparationIdentity(): ExecutiveStage2DHardSeparationIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_2D_HARD_SEPARATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveStage2DHardSeparationArchitecturalRole,
  movesCamera: false as const,
  inventsRelationships: false as const,
  movesAnchor: false as const,
  usesZForSeparation: false as const,
  acceptsOverlap: false as const,
});

/**
 * Visual footprint half-extents (world XY) including planar body + focus ring pad.
 * Calibrated to STAGE-2D:6V-FIX planar geometry (~0.52 body, focus pad ~0.12).
 */
export const EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT = Object.freeze({
  minimum: Object.freeze({
    anchor: 0.48,
    related: 0.4,
    secondary: 0.3,
    background: 0.26,
  }),
  report: Object.freeze({
    anchor: 0.54,
    related: 0.44,
    secondary: 0.32,
    background: 0.28,
  }),
  operation: Object.freeze({
    anchor: 0.6,
    related: 0.48,
    secondary: 0.34,
    background: 0.3,
  }),
  /**
   * Required clear gap between AABB edges (not center-distance).
   * Large enough that silhouettes read as separate on the Stage.
   */
  minVisualGap: 0.35,
  maxIterations: 28,
  maxNudgePerIteration: 0.55,
  radiusExpandStep: 0.22,
  maxRadiusExpands: 5,
});

export type ExecutiveStage2DPresentationClass =
  | "minimum"
  | "report"
  | "operation";

export type ExecutiveStage2DLayoutStatus = "valid" | "degraded" | "failed";

export type ExecutiveStage2DVisualFootprint = {
  readonly halfExtent: number;
  readonly role: ExecutiveStage2DNeighborhoodClass;
};

export type ExecutiveStage2DHardSeparationResult = {
  readonly positions: Readonly<
    Record<string, ExecutiveStage2DResolvedPosition>
  >;
  readonly hiddenObjectIds: readonly string[];
  readonly overlapCount: number;
  readonly minObservedGap: number;
  readonly layoutStatus: ExecutiveStage2DLayoutStatus;
  readonly usedZ: false;
  readonly anchorImmovable: true;
  readonly footprintModel: "executive-stage-2d-visual-footprint";
  readonly minVisualGap: number;
};

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function classRank(classification: ExecutiveStage2DNeighborhoodClass): number {
  if (classification === "anchor") return 100;
  if (classification === "related") return 80;
  if (classification === "secondary") return 40;
  if (classification === "peripheral") return 35;
  if (classification === "background") return 20;
  return 0;
}

export function resolveExecutiveStage2DVisualFootprint(
  classification: ExecutiveStage2DNeighborhoodClass,
  presentationState: ExecutiveStage2DPresentationClass = "minimum",
): ExecutiveStage2DVisualFootprint {
  const presenceOn = isExecutiveObjectPresenceV2Enabled();
  const role =
    classification === "anchor"
      ? "anchor"
      : classification === "related"
        ? "related"
        : classification === "secondary"
          ? "secondary"
          : classification === "peripheral"
            ? "secondary"
            : "background";
  const baseHalfExtent = presenceOn
    ? resolveExecutiveObjectPresenceFootprintHalfExtent({
        presentationLevel: presentationState,
        role,
      })
    : (() => {
        const table = EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT[presentationState];
        return role === "anchor"
          ? table.anchor
          : role === "related"
            ? table.related
            : role === "secondary"
              ? table.secondary
              : table.background;
      })();
  // STAGE-OBJ:1 — projected 3D silhouette may be slightly larger than planar body.
  // STAGE-OBJ:2 — presence footprints already include strong territory; keep small pad.
  // STAGE-3DOBJ:1 — final 3D projected silhouette feeds hard separation (XY only).
  let halfExtent = resolveExecutiveObject3DSilhouetteHalfExtent({
    baseHalfExtent,
    presentationLevel: presentationState,
    enabled: isExecutiveObject3DGeometryEnabled() && !presenceOn,
  });
  if (
    isExecutiveObject3DGeometryEnabled() &&
    isExecutive3DObjectVisualEnabled()
  ) {
    halfExtent += EXECUTIVE_3D_OBJECT_SILHOUETTE_BOOST_BY_LEVEL[presentationState];
  }
  // STAGE-3DOBJ:3 — tapered plate / bevel silhouette pad (XY only).
  if (
    isExecutiveObject3DGeometryEnabled() &&
    isExecutive3DObjectVisualEnabled() &&
    isExecutive3DObjectPremiumFormEnabled()
  ) {
    const form = resolveExecutivePremiumObjectForm({
      presentationLevel: presentationState,
      enabled: true,
    });
    halfExtent += form.silhouettePadBoost;
  }
  return Object.freeze({ halfExtent, role: classification });
}

export function resolveExecutiveStage2DMinVisualGap(): number {
  return isExecutiveObjectPresenceV2Enabled()
    ? EXECUTIVE_OBJECT_PRESENCE_HARD_FOOTPRINT.minVisualGap
    : EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minVisualGap;
}

/** Axis-aligned bounds for a Stage object footprint. */
export function resolveExecutiveStage2DVisibleBounds(
  x: number,
  y: number,
  halfExtent: number,
): Readonly<{
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
}> {
  return Object.freeze({
    minX: x - halfExtent,
    maxX: x + halfExtent,
    minY: y - halfExtent,
    maxY: y + halfExtent,
  });
}

export function measureExecutiveStage2DBoundsGap(
  a: Readonly<{
    readonly minX: number;
    readonly maxX: number;
    readonly minY: number;
    readonly maxY: number;
  }>,
  b: Readonly<{
    readonly minX: number;
    readonly maxX: number;
    readonly minY: number;
    readonly maxY: number;
  }>,
): number {
  const gapX = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX));
  const gapY = Math.max(0, Math.max(a.minY, b.minY) - Math.min(a.maxY, b.maxY));
  // Overlap on both axes ⇒ negative penetration depth (worst axis).
  if (gapX === 0 && gapY === 0) {
    const overlapX = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);
    const overlapY = Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY);
    return -Math.min(overlapX, overlapY);
  }
  // Separated on at least one axis — Chebyshev-style edge gap.
  if (gapX === 0) return gapY;
  if (gapY === 0) return gapX;
  return Math.hypot(gapX, gapY);
}

function clampToBounds(x: number, y: number): { x: number; y: number } {
  const bounds = EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS;
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, y)),
  };
}

function pushOutOfReserved(x: number, y: number): { x: number; y: number } {
  let nextX = x;
  let nextY = y;
  if (isInsideExecutiveStage2DDialExclusion(nextX, nextY)) {
    nextX = Math.min(nextX, EXECUTIVE_STAGE_2D_DIAL_EXCLUSION.minX - 0.25);
    nextY = Math.max(nextY, EXECUTIVE_STAGE_2D_DIAL_EXCLUSION.maxY + 0.25);
  }
  // Presentation Level control — upper-right canvas reserve (world XY heuristic).
  if (nextX >= 1.55 && nextY >= 1.35) {
    nextX = Math.min(nextX, 1.35);
    nextY = Math.min(nextY, 1.2);
  }
  // Soft south floor for centers (hard footprint containment is STAGE-OBJ:4-FIX).
  if (nextY < -1.05) nextY = -1.05;
  return clampToBounds(nextX, nextY);
}

type WorkingNode = {
  id: string;
  x: number;
  y: number;
  half: number;
  rank: number;
  classification: ExecutiveStage2DNeighborhoodClass;
  hidden: boolean;
};

function evaluatePairs(nodes: readonly WorkingNode[]): {
  overlapCount: number;
  minGap: number;
  pairs: Array<{ a: number; b: number; gap: number }>;
} {
  let overlapCount = 0;
  let minGap = Number.POSITIVE_INFINITY;
  const pairs: Array<{ a: number; b: number; gap: number }> = [];
  const visible = nodes
    .map((node, index) => ({ node, index }))
    .filter((entry) => !entry.node.hidden);
  for (let i = 0; i < visible.length; i += 1) {
    for (let j = i + 1; j < visible.length; j += 1) {
      const left = visible[i]!;
      const right = visible[j]!;
      const gap = measureExecutiveStage2DBoundsGap(
        resolveExecutiveStage2DVisibleBounds(
          left.node.x,
          left.node.y,
          left.node.half,
        ),
        resolveExecutiveStage2DVisibleBounds(
          right.node.x,
          right.node.y,
          right.node.half,
        ),
      );
      pairs.push({ a: left.index, b: right.index, gap });
      if (gap < 0) overlapCount += 1;
      minGap = Math.min(minGap, gap);
    }
  }
  if (!Number.isFinite(minGap)) minGap = resolveExecutiveStage2DMinVisualGap();
  return { overlapCount, minGap, pairs };
}

/**
 * Final hard XY separation after candidate layout.
 * Anchor is immovable. Never uses Z. Never moves the camera.
 */
export function resolveExecutiveStage2DHardSeparatedLayout(input: {
  /**
   * Semantic focus anchor. Null is valid for peer collections, where no
   * arbitrary member may acquire CENTER authority.
   */
  readonly anchorObjectId: string | null;
  readonly positions: Readonly<
    Record<string, ExecutiveStage2DResolvedPosition>
  >;
  readonly classifications: Readonly<
    Record<string, ExecutiveStage2DNeighborhoodClass>
  >;
  readonly priority?: Readonly<Record<string, number>>;
  /** Optional measured/conservative XY half-extents keyed by canonical id. */
  readonly footprintHalfExtents?: Readonly<Record<string, number>>;
  readonly presentationState?: ExecutiveStage2DPresentationClass;
  readonly orderedIds?: readonly string[];
}): ExecutiveStage2DHardSeparationResult {
  const presentationState = input.presentationState ?? "minimum";
  const minGap = resolveExecutiveStage2DMinVisualGap();
  const ids =
    input.orderedIds ??
    Object.keys(input.positions).sort(compareIds).filter((id) => {
      const classification = input.classifications[id];
      return classification != null && classification !== "hidden";
    });

  const nodes: WorkingNode[] = ids.map((id) => {
    const classification = input.classifications[id] ?? "background";
    const position = input.positions[id] ?? EXECUTIVE_STAGE_2D_CENTER;
    const footprint = resolveExecutiveStage2DVisualFootprint(
      classification === "hidden" ? "background" : classification,
      presentationState,
    );
    const measuredHalf = input.footprintHalfExtents?.[id];
    const priorityBoost = input.priority?.[id] ?? 0;
    return {
      id,
      x: id === input.anchorObjectId ? 0 : position.x,
      y: id === input.anchorObjectId ? 0 : position.y,
      half:
        measuredHalf != null && Number.isFinite(measuredHalf) && measuredHalf > 0
          ? measuredHalf
          : footprint.halfExtent,
      rank: classRank(classification) + priorityBoost * 0.01,
      classification,
      hidden: classification === "hidden",
    };
  });

  // Ensure anchor exact center.
  const anchor = nodes.find((node) => node.id === input.anchorObjectId);
  if (anchor) {
    anchor.x = 0;
    anchor.y = 0;
    anchor.hidden = false;
    anchor.classification = "anchor";
    anchor.rank = 100;
  }

  const hideOrder = [...nodes]
    .filter((node) => node.id !== input.anchorObjectId)
    .sort((left, right) => {
      if (left.rank !== right.rank) return left.rank - right.rank;
      return compareIds(left.id, right.id);
    });

  let radiusExpand = 0;
  for (
    let expand = 0;
    expand <= EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.maxRadiusExpands;
    expand += 1
  ) {
    if (expand > 0) {
      radiusExpand += EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.radiusExpandStep;
      for (const node of nodes) {
        if (node.hidden || node.id === input.anchorObjectId) continue;
        const length = Math.hypot(node.x, node.y);
        if (length < 1e-6) {
          // Deterministic stagger away from origin if coincident.
          const slot = nodes.findIndex((entry) => entry.id === node.id);
          const angle = (slot * 2.399963) % (Math.PI * 2);
          node.x = Math.cos(angle) * (1.6 + radiusExpand);
          node.y = Math.sin(angle) * (1.6 + radiusExpand);
        } else {
          const scale = (length + radiusExpand) / length;
          node.x *= scale;
          node.y *= scale;
        }
        const pushed = pushOutOfReserved(node.x, node.y);
        node.x = pushed.x;
        node.y = pushed.y;
      }
    }

    for (
      let iteration = 0;
      iteration < EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.maxIterations;
      iteration += 1
    ) {
      const { overlapCount, minGap: observed, pairs } = evaluatePairs(nodes);
      if (overlapCount === 0 && observed >= minGap) {
        break;
      }
      for (const pair of pairs) {
        if (pair.gap >= minGap) continue;
        const left = nodes[pair.a]!;
        const right = nodes[pair.b]!;
        if (left.hidden || right.hidden) continue;
        const moveLeft =
          left.id !== input.anchorObjectId && left.rank <= right.rank;
        const moveRight =
          right.id !== input.anchorObjectId && right.rank < left.rank;
        const mover = moveLeft ? left : moveRight ? right : null;
        const keeper = mover === left ? right : left;
        if (mover == null) continue;
        let dx = mover.x - keeper.x;
        let dy = mover.y - keeper.y;
        let length = Math.hypot(dx, dy);
        if (length < 1e-6) {
          dx = mover.id < keeper.id ? 1 : -1;
          dy = mover.id < keeper.id ? 0.35 : -0.35;
          length = Math.hypot(dx, dy);
        }
        const needed = minGap - pair.gap + 0.02;
        const step = Math.min(
          EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.maxNudgePerIteration,
          Math.max(needed, 0.08),
        );
        mover.x += (dx / length) * step;
        mover.y += (dy / length) * step;
        const pushed = pushOutOfReserved(mover.x, mover.y);
        mover.x = pushed.x;
        mover.y = pushed.y;
      }
      // Re-pin anchor every iteration.
      if (anchor) {
        anchor.x = 0;
        anchor.y = 0;
      }
    }

    const check = evaluatePairs(nodes);
    if (check.overlapCount === 0 && check.minGap >= minGap) {
      break;
    }

    // Hide lowest-priority first (background → secondary) before next expand.
    if (expand < EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.maxRadiusExpands) {
      const victim = hideOrder.find(
        (node) =>
          !node.hidden &&
          (node.classification === "background" ||
            node.classification === "peripheral" ||
            node.classification === "secondary"),
      );
      if (victim) victim.hidden = true;
    }
  }

  // Final hide pass if still colliding — never accept overlap for related if avoidable.
  let finalEval = evaluatePairs(nodes);
  while (
    (finalEval.overlapCount > 0 || finalEval.minGap < minGap) &&
    hideOrder.some((node) => !node.hidden && node.classification !== "related")
  ) {
    const victim = hideOrder.find(
      (node) =>
        !node.hidden &&
        (node.classification === "background" ||
          node.classification === "peripheral" ||
          node.classification === "secondary"),
    );
    if (!victim) break;
    victim.hidden = true;
    finalEval = evaluatePairs(nodes);
  }

  // Last resort: hide lowest related until valid (prefer readable over crowded).
  while (
    (finalEval.overlapCount > 0 || finalEval.minGap < minGap) &&
    hideOrder.some((node) => !node.hidden && node.classification === "related")
  ) {
    const victim = hideOrder.find(
      (node) => !node.hidden && node.classification === "related",
    );
    if (!victim) break;
    victim.hidden = true;
    finalEval = evaluatePairs(nodes);
  }

  const positions: Record<string, ExecutiveStage2DResolvedPosition> = {};
  const hiddenObjectIds: string[] = [];
  for (const node of nodes) {
    if (node.hidden) {
      hiddenObjectIds.push(node.id);
      continue;
    }
    const clamped = pushOutOfReserved(node.x, node.y);
    positions[node.id] = normalizeExecutiveStage2DPosition({
      x: node.id === input.anchorObjectId ? 0 : stabilize(clamped.x),
      y: node.id === input.anchorObjectId ? 0 : stabilize(clamped.y),
      z: EXECUTIVE_STAGE_2D_DEPTH,
    }) as ExecutiveStage2DResolvedPosition;
  }
  if (input.anchorObjectId != null) {
    positions[input.anchorObjectId] = normalizeExecutiveStage2DPosition({
      x: 0,
      y: 0,
      z: 0,
    }) as ExecutiveStage2DResolvedPosition;
  }

  finalEval = evaluatePairs(nodes.filter((node) => !node.hidden));
  const layoutStatus: ExecutiveStage2DLayoutStatus =
    finalEval.overlapCount === 0 && finalEval.minGap >= minGap
      ? hiddenObjectIds.length > 0
        ? "degraded"
        : "valid"
      : "failed";

  return Object.freeze({
    positions: Object.freeze(positions),
    hiddenObjectIds: Object.freeze(hiddenObjectIds.sort(compareIds)),
    overlapCount: finalEval.overlapCount,
    minObservedGap: stabilize(finalEval.minGap),
    layoutStatus,
    usedZ: false as const,
    anchorImmovable: true as const,
    footprintModel: "executive-stage-2d-visual-footprint" as const,
    minVisualGap: minGap,
  });
}

export function verifyExecutiveStage2DHardSeparation(): Readonly<{
  readonly ok: boolean;
}> {
  const result = resolveExecutiveStage2DHardSeparatedLayout({
    anchorObjectId: "a",
    positions: {
      a: normalizeExecutiveStage2DPosition({ x: 0, y: 0, z: 0 }) as ExecutiveStage2DResolvedPosition,
      b: normalizeExecutiveStage2DPosition({ x: 0.1, y: 0, z: 0 }) as ExecutiveStage2DResolvedPosition,
      c: normalizeExecutiveStage2DPosition({ x: -0.1, y: 0, z: 0 }) as ExecutiveStage2DResolvedPosition,
    },
    classifications: {
      a: "anchor",
      b: "related",
      c: "related",
    },
  });
  return Object.freeze({
    ok:
      result.overlapCount === 0 &&
      result.minObservedGap >= resolveExecutiveStage2DMinVisualGap() &&
      result.positions.a!.x === 0 &&
      result.positions.a!.y === 0 &&
      result.usedZ === false,
  });
}
