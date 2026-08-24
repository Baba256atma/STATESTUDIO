/**
 * STAGE-OBJ:4-FIX — Hard Stage Boundary & Reserved-Region Containment.
 *
 * Final XY footprint containment only. Does not move camera, semantic Z,
 * relationships, or object geometry contracts.
 *
 * Root cause (Capacity / Inventory): Stage frame uses overflow:hidden and the
 * Timeline dock sits beneath the Stage column. Object centers could remain
 * inside recomposition bounds while the rendered silhouette extended into the
 * clipped/covered lower Stage band.
 */

import {
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS,
  type ExecutiveStage2DNeighborhoodClass,
  type ExecutiveStage2DResolvedPosition,
} from "./executiveStage2DTopologyRecomposition.ts";
import { normalizeExecutiveStage2DPosition } from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_STAGE_2D_DIAL_EXCLUSION,
} from "./executiveStage2DVisualCertification.ts";
import {
  resolveExecutiveStage2DHardSeparatedLayout,
  resolveExecutiveStage2DMinVisualGap,
  resolveExecutiveStage2DVisibleBounds,
  resolveExecutiveStage2DVisualFootprint,
  type ExecutiveStage2DPresentationClass,
} from "./executiveStage2DHardSeparation.ts";
import { EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS } from "./executiveStageProductivityContract.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageReservedRegionContainmentIdentity =
  "STAGE-OBJ:4-FIX/ExecutiveStageReservedRegionContainment" as const;

export const executiveStageReservedRegionContainmentVersion = "4.4.3" as const;

export const executiveStageReservedRegionContainmentNamespace =
  "nexora.spatial-presentation.executive-stage-reserved-region-containment" as const;

export const executiveStageReservedRegionContainmentPhase =
  "HardStageBoundaryAndReservedRegionContainment" as const;

export const executiveStageReservedRegionContainmentArchitecturalRole =
  "PresentationOnlyReservedRegionContainment" as const;

export type ExecutiveStageReservedRegionContainmentIdentity = {
  readonly id: typeof executiveStageReservedRegionContainmentIdentity;
  readonly version: typeof executiveStageReservedRegionContainmentVersion;
  readonly namespace: typeof executiveStageReservedRegionContainmentNamespace;
  readonly phase: typeof executiveStageReservedRegionContainmentPhase;
  readonly architecturalRole: typeof executiveStageReservedRegionContainmentArchitecturalRole;
};

const IDENTITY: ExecutiveStageReservedRegionContainmentIdentity = Object.freeze({
  id: executiveStageReservedRegionContainmentIdentity,
  version: executiveStageReservedRegionContainmentVersion,
  namespace: executiveStageReservedRegionContainmentNamespace,
  phase: executiveStageReservedRegionContainmentPhase,
  architecturalRole: executiveStageReservedRegionContainmentArchitecturalRole,
});

export function getExecutiveStageReservedRegionContainmentIdentity(): ExecutiveStageReservedRegionContainmentIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageReservedRegionContainmentArchitecturalRole,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  movesAnchor: false as const,
  inventsRelationships: false as const,
  usesZForContainment: false as const,
  shrinksObjectsByDefault: false as const,
  continuousSolver: false as const,
  maxIterations: 4 as const,
});

export type ExecutiveStageContainmentStatus = "valid" | "degraded" | "failed";

export type ExecutiveStageWorldRect = Readonly<{
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly id: string;
  readonly hardness: "hard" | "soft";
}>;

/**
 * Authoritative Safe Presentation Region (world XY on semantic plane).
 * Usable rect is inset from STAGE-2D recomposition bounds so full footprints
 * remain visible inside the Stage frame (overflow:hidden) and above Timeline.
 */
export const EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION = Object.freeze({
  /**
   * Usable content rect — footprint edges must stay inside.
   * UX:1 collapsed Timeline is a compact period strip; keep a hard bottom
   * clip so objects never sit under that strip or the Stage overflow edge.
   */
  usableRect: Object.freeze({
    id: "usable-stage",
    hardness: "hard" as const,
    minX: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minX + 0.15,
    maxX: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxX - 0.15,
    /** Footprint minY must be >= this (not center Y). */
    minY: -1.72,
    maxY: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxY - 0.2,
  }),
  hardReservedRegions: Object.freeze([
    Object.freeze({
      id: "bottom-timeline-stage-clip",
      hardness: "hard" as const,
      minX: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minX,
      maxX: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxX,
      minY: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minY,
      maxY: -1.72,
    }),
    Object.freeze({
      id: "workspace-dial",
      hardness: "hard" as const,
      minX: EXECUTIVE_STAGE_2D_DIAL_EXCLUSION.minX,
      maxX: EXECUTIVE_STAGE_2D_DIAL_EXCLUSION.maxX,
      minY: EXECUTIVE_STAGE_2D_DIAL_EXCLUSION.minY,
      maxY: EXECUTIVE_STAGE_2D_DIAL_EXCLUSION.maxY,
    }),
    Object.freeze({
      id: "presentation-level-control",
      hardness: "hard" as const,
      // UX:1 compact View chip — top-right, smaller than the old panel.
      minX: 1.85,
      maxX: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxX,
      minY: 1.72,
      maxY: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxY,
    }),
    Object.freeze({
      id: "breadcrumb-header",
      hardness: "hard" as const,
      minX: -1.4,
      maxX: 1.4,
      minY: 2.05,
      maxY: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxY,
    }),
    /**
     * STAGE-PROD:0 — Executive Queue control strip.
     * Collection controls only; semantic Objects must not enter.
     */
    Object.freeze({
      id: EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue.id,
      hardness: "hard" as const,
      minX: EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue.minX,
      maxX: EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue.maxX,
      minY: EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue.minY,
      maxY: EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue.maxY,
    }),
  ]),
  softReservedRegions: Object.freeze([
    Object.freeze({
      id: "left-object-list-soft",
      hardness: "soft" as const,
      // UX:1 Objects disclosure is a compact top-left chip, not a tall list.
      minX: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minX,
      maxX: -2.15,
      minY: 1.55,
      maxY: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxY,
    }),
  ]),
  /** Soft territory may approach this pad beyond hard body containment. */
  softTerritoryPad: 0.08,
  hardTerritoryPad: 0.12,
} as const);

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function rectsIntersect(
  a: Readonly<{ minX: number; maxX: number; minY: number; maxY: number }>,
  b: Readonly<{ minX: number; maxX: number; minY: number; maxY: number }>,
): boolean {
  return !(
    a.maxX <= b.minX ||
    a.minX >= b.maxX ||
    a.maxY <= b.minY ||
    a.minY >= b.maxY
  );
}

function intersectionArea(
  a: Readonly<{ minX: number; maxX: number; minY: number; maxY: number }>,
  b: Readonly<{ minX: number; maxX: number; minY: number; maxY: number }>,
): number {
  const w = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);
  const h = Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY);
  if (w <= 0 || h <= 0) return 0;
  return w * h;
}

export function resolveExecutiveStageObjectContainmentHalfExtent(input: {
  readonly classification: ExecutiveStage2DNeighborhoodClass;
  readonly presentationState?: ExecutiveStage2DPresentationClass;
  readonly focused?: boolean;
}): number {
  const footprint = resolveExecutiveStage2DVisualFootprint(
    input.classification === "hidden" ? "background" : input.classification,
    input.presentationState ?? "minimum",
  );
  const focusBoost = input.focused ? 1.08 : 1;
  // Hard territory (anchor/focused) must clear reserved regions.
  // Soft related halo may approach the boundary (mission §8) — do not inflate
  // related body containment with softTerritoryPad.
  const territoryPad =
    input.classification === "anchor" || input.focused
      ? EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardTerritoryPad
      : 0;
  return stabilize(footprint.halfExtent * focusBoost + territoryPad);
}

export type ExecutiveStageContainmentViolation = Readonly<{
  readonly objectId: string;
  readonly regionId: string;
  readonly kind: "usable" | "hard-reserved";
}>;

export type ExecutiveStageReservedRegionContainmentResult = Readonly<{
  readonly positions: Readonly<
    Record<string, ExecutiveStage2DResolvedPosition>
  >;
  readonly hiddenObjectIds: readonly string[];
  readonly status: ExecutiveStageContainmentStatus;
  readonly boundaryViolationCount: number;
  readonly reservedRegionCollisionCount: number;
  readonly bottomBoundaryViolationCount: number;
  readonly containedObjectCount: number;
  readonly clippedObjectCount: number;
  readonly correctedObjectIds: readonly string[];
  readonly violations: readonly ExecutiveStageContainmentViolation[];
  readonly iterations: number;
}>;

function classPriority(classification: ExecutiveStage2DNeighborhoodClass): number {
  if (classification === "anchor") return 100;
  if (classification === "related") return 80;
  if (classification === "peripheral") return 40;
  if (classification === "secondary") return 30;
  if (classification === "background") return 20;
  return 0;
}

function collectViolations(input: {
  readonly objectId: string;
  readonly bounds: Readonly<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }>;
}): ExecutiveStageContainmentViolation[] {
  const usable = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect;
  const violations: ExecutiveStageContainmentViolation[] = [];
  if (
    input.bounds.minX < usable.minX ||
    input.bounds.maxX > usable.maxX ||
    input.bounds.minY < usable.minY ||
    input.bounds.maxY > usable.maxY
  ) {
    violations.push(
      Object.freeze({
        objectId: input.objectId,
        regionId: usable.id,
        kind: "usable" as const,
      }),
    );
  }
  for (const region of EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardReservedRegions) {
    if (intersectionArea(input.bounds, region) > 1e-6) {
      violations.push(
        Object.freeze({
          objectId: input.objectId,
          regionId: region.id,
          kind: "hard-reserved" as const,
        }),
      );
    }
  }
  return violations;
}

function pushOutOfHardRegions(
  x0: number,
  y0: number,
  h: number,
): { x: number; y: number } {
  const usable = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect;
  let x = clamp(x0, usable.minX + h, usable.maxX - h);
  let y = clamp(y0, usable.minY + h, usable.maxY - h);

  for (let pass = 0; pass < 4; pass += 1) {
    const bounds = resolveExecutiveStage2DVisibleBounds(x, y, h);
    let pushed = false;
    for (const region of EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardReservedRegions) {
      if (!rectsIntersect(bounds, region)) continue;
      pushed = true;
      if (region.id === "bottom-timeline-stage-clip") {
        y = region.maxY + h + 0.02;
        continue;
      }
      const overlapLeft = bounds.maxX - region.minX;
      const overlapRight = region.maxX - bounds.minX;
      const overlapBottom = bounds.maxY - region.minY;
      const overlapTop = region.maxY - bounds.minY;
      const options = [
        { axis: "x" as const, delta: -(overlapLeft + 0.02) },
        { axis: "x" as const, delta: overlapRight + 0.02 },
        { axis: "y" as const, delta: -(overlapBottom + 0.02) },
        { axis: "y" as const, delta: overlapTop + 0.02 },
      ].sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));
      const best = options[0]!;
      if (best.axis === "x") x += best.delta;
      else y += best.delta;
    }
    x = clamp(x, usable.minX + h, usable.maxX - h);
    y = clamp(y, usable.minY + h, usable.maxY - h);
    if (!pushed) break;
  }
  return { x, y };
}

function isFootprintValid(x: number, y: number, h: number): boolean {
  const bounds = resolveExecutiveStage2DVisibleBounds(x, y, h);
  return collectViolations({ objectId: "_", bounds }).length === 0;
}

/**
 * Minimal XY correction so footprint sits in usable rect and clears hard regions.
 * When a pure clamp would collide with the immovable anchor, re-sector deterministically.
 */
export function correctExecutiveStageFootprintIntoSafeRegion(input: {
  readonly x: number;
  readonly y: number;
  readonly halfExtent: number;
  /** Focused anchor half-extent used for clearance (default ~presence anchor). */
  readonly anchorHalfExtent?: number;
  readonly minGap?: number;
}): Readonly<{ readonly x: number; readonly y: number; readonly moved: boolean }> {
  const h = input.halfExtent;
  const anchorHalf = input.anchorHalfExtent ?? 0.9;
  const minGap = input.minGap ?? 0.28;
  const minRadius = anchorHalf + h + minGap;

  let { x, y } = pushOutOfHardRegions(input.x, input.y, h);

  // If too close to immovable anchor after clamp, re-sector instead of clipping south.
  if (Math.hypot(x, y) + 1e-6 < minRadius || !isFootprintValid(x, y, h)) {
    const startAngle = Math.atan2(
      Number.isFinite(input.y) ? input.y : 0,
      Number.isFinite(input.x) && Math.abs(input.x) + Math.abs(input.y) > 1e-6
        ? input.x
        : 1,
    );
    // Prefer non-south sectors first (mission: avoid forbidden lower sector).
    const offsets = [
      0, Math.PI * 0.2, -Math.PI * 0.2, Math.PI * 0.4, -Math.PI * 0.4,
      Math.PI * 0.6, -Math.PI * 0.6, Math.PI * 0.8, -Math.PI * 0.8,
      Math.PI, Math.PI * 1.2, -Math.PI * 1.2,
    ];
    let best: { x: number; y: number; score: number } | null = null;
    for (const offset of offsets) {
      const angle = startAngle + offset;
      for (const radius of [
        minRadius,
        minRadius + 0.18,
        minRadius + 0.36,
        minRadius + 0.54,
      ]) {
        const candidate = pushOutOfHardRegions(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          h,
        );
        if (!isFootprintValid(candidate.x, candidate.y, h)) continue;
        if (Math.hypot(candidate.x, candidate.y) + 1e-6 < minRadius) continue;
        // Score: prefer near original angle, avoid deep south, prefer small move.
        const southPenalty = candidate.y < -0.4 ? Math.abs(candidate.y) * 2 : 0;
        const move = Math.hypot(candidate.x - input.x, candidate.y - input.y);
        const score = move + southPenalty + Math.abs(offset) * 0.15;
        if (best == null || score < best.score) {
          best = { x: candidate.x, y: candidate.y, score };
        }
      }
    }
    if (best != null) {
      x = best.x;
      y = best.y;
    }
  }

  const moved = Math.hypot(x - input.x, y - input.y) > 0.001;
  return Object.freeze({
    x: stabilize(x),
    y: stabilize(y),
    moved,
  });
}

/**
 * Final reserved-region containment pass (XY only).
 * Anchor is immovable. Lower-priority objects hide before required clipping.
 */
export function resolveExecutiveStageReservedRegionContainment(input: {
  readonly anchorObjectId: string;
  readonly positions: Readonly<
    Record<string, ExecutiveStage2DResolvedPosition>
  >;
  readonly classifications: Readonly<
    Record<string, ExecutiveStage2DNeighborhoodClass>
  >;
  readonly priority?: Readonly<Record<string, number>>;
  readonly presentationState?: ExecutiveStage2DPresentationClass;
  readonly orderedIds?: readonly string[];
}): ExecutiveStageReservedRegionContainmentResult {
  const presentationState = input.presentationState ?? "minimum";
  const maxIterations =
    EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY.maxIterations;
  const positions: Record<string, ExecutiveStage2DResolvedPosition> = {
    ...input.positions,
  };
  positions[input.anchorObjectId] = normalizeExecutiveStage2DPosition({
    x: 0,
    y: 0,
    z: 0,
  }) as ExecutiveStage2DResolvedPosition;

  const hidden = new Set<string>();
  const corrected = new Set<string>();
  let iterations = 0;
  let lastViolations: ExecutiveStageContainmentViolation[] = [];

  const ordered =
    input.orderedIds ??
    Object.keys(positions).sort((a, b) => {
      const rank =
        classPriority(input.classifications[b] ?? "hidden") -
        classPriority(input.classifications[a] ?? "hidden");
      if (rank !== 0) return rank;
      const boost =
        (input.priority?.[b] ?? 0) - (input.priority?.[a] ?? 0);
      if (boost !== 0) return boost;
      return a < b ? -1 : a > b ? 1 : 0;
    });

  const anchorHalfExtent = resolveExecutiveStageObjectContainmentHalfExtent({
    classification: "anchor",
    presentationState,
    focused: true,
  });
  const minGap = resolveExecutiveStage2DMinVisualGap();

  const halfFor = (objectId: string): number => {
    if (objectId === input.anchorObjectId) return anchorHalfExtent;
    return resolveExecutiveStageObjectContainmentHalfExtent({
      classification: input.classifications[objectId] ?? "background",
      presentationState,
    });
  };

  const applyCorrection = (objectId: string): boolean => {
    const classification = input.classifications[objectId] ?? "hidden";
    if (classification === "hidden") return false;
    const position = positions[objectId];
    if (!position) return false;
    const halfExtent = halfFor(objectId);
    const violations = collectViolations({
      objectId,
      bounds: resolveExecutiveStage2DVisibleBounds(
        position.x,
        position.y,
        halfExtent,
      ),
    });
    if (violations.length === 0) return false;
    const correctedPos = correctExecutiveStageFootprintIntoSafeRegion({
      x: position.x,
      y: position.y,
      halfExtent,
      anchorHalfExtent,
      minGap,
    });
    const stillBad = collectViolations({
      objectId,
      bounds: resolveExecutiveStage2DVisibleBounds(
        correctedPos.x,
        correctedPos.y,
        halfExtent,
      ),
    });
    if (stillBad.length > 0) {
      // Prefer hide lower-priority; related keep best-effort only if valid sector missing.
      if (
        classification === "peripheral" ||
        classification === "secondary" ||
        classification === "background"
      ) {
        hidden.add(objectId);
        delete positions[objectId];
        return true;
      }
      // Related: leave for later hide-rank pass only if still invalid.
      return false;
    }
    if (correctedPos.moved) {
      positions[objectId] = normalizeExecutiveStage2DPosition({
        x: correctedPos.x,
        y: correctedPos.y,
        z: 0,
      }) as ExecutiveStage2DResolvedPosition;
      corrected.add(objectId);
      return true;
    }
    return false;
  };

  /**
   * Light XY separation that respects safe footprints (no radius-expand hide storm).
   */
  const separateWithinSafeRegion = (): void => {
    const ids = ordered.filter(
      (id) =>
        id !== input.anchorObjectId &&
        !hidden.has(id) &&
        positions[id] != null &&
        (input.classifications[id] ?? "hidden") !== "hidden",
    );
    for (let pass = 0; pass < 10; pass += 1) {
      let moved = false;
      for (let i = 0; i < ids.length; i += 1) {
        for (let j = i + 1; j < ids.length; j += 1) {
          const aId = ids[i]!;
          const bId = ids[j]!;
          if (hidden.has(aId) || hidden.has(bId)) continue;
          const aPos = positions[aId]!;
          const bPos = positions[bId]!;
          const aHalf = halfFor(aId);
          const bHalf = halfFor(bId);
          const aBounds = resolveExecutiveStage2DVisibleBounds(
            aPos.x,
            aPos.y,
            aHalf,
          );
          const bBounds = resolveExecutiveStage2DVisibleBounds(
            bPos.x,
            bPos.y,
            bHalf,
          );
          const overlapX =
            Math.min(aBounds.maxX, bBounds.maxX) -
            Math.max(aBounds.minX, bBounds.minX);
          const overlapY =
            Math.min(aBounds.maxY, bBounds.maxY) -
            Math.max(aBounds.minY, bBounds.minY);
          const gap =
            overlapX > 0 && overlapY > 0
              ? -Math.min(overlapX, overlapY)
              : Math.hypot(
                  Math.max(
                    0,
                    Math.max(aBounds.minX, bBounds.minX) -
                      Math.min(aBounds.maxX, bBounds.maxX),
                  ),
                  Math.max(
                    0,
                    Math.max(aBounds.minY, bBounds.minY) -
                      Math.min(aBounds.maxY, bBounds.maxY),
                  ),
                );
          if (gap >= minGap) continue;
          const aRank = classPriority(input.classifications[aId] ?? "hidden");
          const bRank = classPriority(input.classifications[bId] ?? "hidden");
          const moverId = aRank <= bRank ? aId : bId;
          const keeperId = moverId === aId ? bId : aId;
          const mover = positions[moverId]!;
          const keeper = positions[keeperId]!;
          let dx = mover.x - keeper.x;
          let dy = mover.y - keeper.y;
          let len = Math.hypot(dx, dy);
          if (len < 1e-6) {
            dx = moverId < keeperId ? 1 : -1;
            dy = 0.25;
            len = Math.hypot(dx, dy);
          }
          const step = Math.min(0.45, Math.max(minGap - gap + 0.04, 0.1));
          const next = correctExecutiveStageFootprintIntoSafeRegion({
            x: mover.x + (dx / len) * step,
            y: mover.y + (dy / len) * step,
            halfExtent: halfFor(moverId),
            anchorHalfExtent,
            minGap,
          });
          positions[moverId] = normalizeExecutiveStage2DPosition({
            x: next.x,
            y: next.y,
            z: 0,
          }) as ExecutiveStage2DResolvedPosition;
          corrected.add(moverId);
          moved = true;
        }
      }
      // Also clear overlap with immovable anchor.
      for (const objectId of ids) {
        if (hidden.has(objectId)) continue;
        const position = positions[objectId]!;
        const halfExtent = halfFor(objectId);
        const needed = anchorHalfExtent + halfExtent + minGap;
        const radial = Math.hypot(position.x, position.y);
        if (radial + 1e-6 >= needed) continue;
        const next = correctExecutiveStageFootprintIntoSafeRegion({
          x: position.x,
          y: position.y,
          halfExtent,
          anchorHalfExtent,
          minGap,
        });
        positions[objectId] = normalizeExecutiveStage2DPosition({
          x: next.x,
          y: next.y,
          z: 0,
        }) as ExecutiveStage2DResolvedPosition;
        corrected.add(objectId);
        moved = true;
      }
      if (!moved) break;
    }
  };

  for (let iter = 0; iter < maxIterations; iter += 1) {
    iterations = iter + 1;
    lastViolations = [];
    let movedAny = false;

    for (const objectId of ordered) {
      if (objectId === input.anchorObjectId) continue;
      if (hidden.has(objectId)) continue;
      const classification = input.classifications[objectId] ?? "hidden";
      if (classification === "hidden") {
        hidden.add(objectId);
        continue;
      }
      if (applyCorrection(objectId)) movedAny = true;
    }

    positions[input.anchorObjectId] = normalizeExecutiveStage2DPosition({
      x: 0,
      y: 0,
      z: 0,
    }) as ExecutiveStage2DResolvedPosition;

    if (movedAny || corrected.size > 0) {
      separateWithinSafeRegion();
    }

    lastViolations = [];
    for (const objectId of Object.keys(positions)) {
      if (objectId === input.anchorObjectId) continue;
      if (hidden.has(objectId)) continue;
      const classification = input.classifications[objectId] ?? "hidden";
      if (classification === "hidden") continue;
      const halfExtent = halfFor(objectId);
      const position = positions[objectId]!;
      lastViolations.push(
        ...collectViolations({
          objectId,
          bounds: resolveExecutiveStage2DVisibleBounds(
            position.x,
            position.y,
            halfExtent,
          ),
        }),
      );
    }

    if (lastViolations.length === 0) {
      // Check residual object-object overlap; hide lowest priority if needed.
      const visible = Object.keys(positions).filter(
        (id) =>
          !hidden.has(id) &&
          id !== input.anchorObjectId &&
          (input.classifications[id] ?? "hidden") !== "hidden",
      );
      let overlapVictim: string | null = null;
      for (let i = 0; i < visible.length; i += 1) {
        for (let j = i + 1; j < visible.length; j += 1) {
          const a = visible[i]!;
          const b = visible[j]!;
          const aBounds = resolveExecutiveStage2DVisibleBounds(
            positions[a]!.x,
            positions[a]!.y,
            halfFor(a),
          );
          const bBounds = resolveExecutiveStage2DVisibleBounds(
            positions[b]!.x,
            positions[b]!.y,
            halfFor(b),
          );
          const overlapX =
            Math.min(aBounds.maxX, bBounds.maxX) -
            Math.max(aBounds.minX, bBounds.minX);
          const overlapY =
            Math.min(aBounds.maxY, bBounds.maxY) -
            Math.max(aBounds.minY, bBounds.minY);
          if (overlapX > 1e-4 && overlapY > 1e-4) {
            const aRank = classPriority(input.classifications[a] ?? "hidden");
            const bRank = classPriority(input.classifications[b] ?? "hidden");
            overlapVictim = aRank <= bRank ? a : b;
            break;
          }
        }
        if (overlapVictim) break;
      }
      if (!overlapVictim) break;
      hidden.add(overlapVictim);
      delete positions[overlapVictim];
      continue;
    }

    const hideRank = (classification: ExecutiveStage2DNeighborhoodClass) => {
      if (classification === "background") return 1;
      if (classification === "peripheral") return 2;
      if (classification === "secondary") return 3;
      if (classification === "related") return 4;
      return 99;
    };
    const violatorIds = [
      ...new Set(lastViolations.map((violation) => violation.objectId)),
    ].sort((a, b) => {
      const rank =
        hideRank(input.classifications[a] ?? "hidden") -
        hideRank(input.classifications[b] ?? "hidden");
      if (rank !== 0) return rank;
      return a < b ? -1 : a > b ? 1 : 0;
    });
    const victim = violatorIds[0];
    if (victim == null || victim === input.anchorObjectId) break;
    hidden.add(victim);
    delete positions[victim];
  }

  // Mission §14 — if containment moved objects, re-run hard separation once,
  // then re-clamp footprints (bounded; no second hide storm of related).
  if (corrected.size > 0) {
    const visibleIds = ordered.filter(
      (id) => !hidden.has(id) && positions[id] != null,
    );
    const hard = resolveExecutiveStage2DHardSeparatedLayout({
      anchorObjectId: input.anchorObjectId,
      positions,
      classifications: input.classifications,
      priority: input.priority,
      presentationState,
      orderedIds: [
        input.anchorObjectId,
        ...visibleIds.filter((id) => id !== input.anchorObjectId),
      ],
    });
    for (const objectId of Object.keys(hard.positions)) {
      if (hidden.has(objectId)) continue;
      positions[objectId] = hard.positions[objectId]!;
    }
    for (const hiddenId of hard.hiddenObjectIds) {
      if (hiddenId === input.anchorObjectId) continue;
      const classification = input.classifications[hiddenId] ?? "hidden";
      if (
        classification === "peripheral" ||
        classification === "secondary" ||
        classification === "background"
      ) {
        hidden.add(hiddenId);
        delete positions[hiddenId];
      }
      // Related: keep prior contained position if hard-sep dropped it.
    }
    positions[input.anchorObjectId] = normalizeExecutiveStage2DPosition({
      x: 0,
      y: 0,
      z: 0,
    }) as ExecutiveStage2DResolvedPosition;
    for (const objectId of Object.keys(positions)) {
      if (objectId === input.anchorObjectId) continue;
      if (hidden.has(objectId)) continue;
      applyCorrection(objectId);
    }
    separateWithinSafeRegion();
  }

  // Final guarantee: never leave a visible clipped body.
  for (const objectId of Object.keys(positions)) {
    if (objectId === input.anchorObjectId) continue;
    const classification = input.classifications[objectId] ?? "hidden";
    if (classification === "hidden") continue;
    const halfExtent = halfFor(objectId);
    const position = positions[objectId]!;
    const violations = collectViolations({
      objectId,
      bounds: resolveExecutiveStage2DVisibleBounds(
        position.x,
        position.y,
        halfExtent,
      ),
    });
    if (violations.length > 0) {
      hidden.add(objectId);
      delete positions[objectId];
    }
  }

  const visibleIds = Object.keys(positions).filter(
    (id) => !hidden.has(id) && (input.classifications[id] ?? "hidden") !== "hidden",
  );
  let clippedObjectCount = 0;
  let bottomBoundaryViolationCount = 0;
  let reservedRegionCollisionCount = 0;
  const finalViolations: ExecutiveStageContainmentViolation[] = [];
  for (const objectId of visibleIds) {
    if (objectId === input.anchorObjectId) {
      // Anchor must fit; if model wrong, count as failure later.
      const halfExtent = resolveExecutiveStageObjectContainmentHalfExtent({
        classification: "anchor",
        presentationState,
        focused: true,
      });
      const bounds = resolveExecutiveStage2DVisibleBounds(0, 0, halfExtent);
      const violations = collectViolations({ objectId, bounds });
      if (violations.length > 0) {
        clippedObjectCount += 1;
        finalViolations.push(...violations);
      }
      continue;
    }
    const classification = input.classifications[objectId] ?? "background";
    const halfExtent = resolveExecutiveStageObjectContainmentHalfExtent({
      classification,
      presentationState,
    });
    const position = positions[objectId]!;
    const bounds = resolveExecutiveStage2DVisibleBounds(
      position.x,
      position.y,
      halfExtent,
    );
    const violations = collectViolations({ objectId, bounds });
    if (violations.length > 0) {
      clippedObjectCount += 1;
      finalViolations.push(...violations);
      for (const violation of violations) {
        if (violation.regionId === "bottom-timeline-stage-clip") {
          bottomBoundaryViolationCount += 1;
        }
        if (violation.kind === "hard-reserved") {
          reservedRegionCollisionCount += 1;
        }
      }
    }
  }

  const relatedVisible = visibleIds.filter(
    (id) => input.classifications[id] === "related",
  );
  const relatedClipped = finalViolations.some(
    (violation) => input.classifications[violation.objectId] === "related",
  );
  const status: ExecutiveStageContainmentStatus =
    clippedObjectCount === 0
      ? hidden.size > 0
        ? "degraded"
        : "valid"
      : relatedClipped || relatedVisible.length === 0
        ? "failed"
        : "degraded";

  return Object.freeze({
    positions: Object.freeze(positions),
    hiddenObjectIds: Object.freeze([...hidden].sort()),
    status,
    boundaryViolationCount: finalViolations.length,
    reservedRegionCollisionCount,
    bottomBoundaryViolationCount,
    containedObjectCount: Math.max(0, visibleIds.length - clippedObjectCount),
    clippedObjectCount,
    correctedObjectIds: Object.freeze([...corrected].sort()),
    violations: Object.freeze(finalViolations),
    iterations,
  });
}

export function getExecutiveStageReservedRegionContainmentObservability(input?: {
  readonly status?: ExecutiveStageContainmentStatus;
  readonly boundaryViolationCount?: number;
  readonly reservedRegionCollisionCount?: number;
  readonly bottomBoundaryViolationCount?: number;
  readonly containedObjectCount?: number;
  readonly clippedObjectCount?: number;
}): Readonly<{
  readonly contract: "stage-obj-4-fix";
  readonly identity: string;
  readonly version: string;
  readonly containmentStatus: string;
  readonly boundaryViolationCount: string;
  readonly reservedRegionCollisionCount: string;
  readonly bottomBoundaryViolationCount: string;
  readonly containedObjectCount: string;
  readonly clippedObjectCount: string;
}> {
  return Object.freeze({
    contract: "stage-obj-4-fix",
    identity: executiveStageReservedRegionContainmentIdentity,
    version: executiveStageReservedRegionContainmentVersion,
    containmentStatus: input?.status ?? "valid",
    boundaryViolationCount: String(input?.boundaryViolationCount ?? 0),
    reservedRegionCollisionCount: String(
      input?.reservedRegionCollisionCount ?? 0,
    ),
    bottomBoundaryViolationCount: String(
      input?.bottomBoundaryViolationCount ?? 0,
    ),
    containedObjectCount: String(input?.containedObjectCount ?? 0),
    clippedObjectCount: String(input?.clippedObjectCount ?? 0),
  });
}

export function verifyExecutiveStageReservedRegionContainment(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly cameraSafe: boolean;
  readonly anchorImmutable: boolean;
}> {
  const identity = getExecutiveStageReservedRegionContainmentIdentity();
  return Object.freeze({
    ok:
      identity.id ===
        "STAGE-OBJ:4-FIX/ExecutiveStageReservedRegionContainment" &&
      identity.version === "4.4.3" &&
      EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY.movesCamera ===
        false &&
      EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY.movesAnchor === false,
    identityValid:
      identity.id ===
      "STAGE-OBJ:4-FIX/ExecutiveStageReservedRegionContainment",
    cameraSafe:
      EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY.movesCamera === false,
    anchorImmutable:
      EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY.movesAnchor === false,
  });
}
