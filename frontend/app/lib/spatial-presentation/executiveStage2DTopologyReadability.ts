/**
 * STAGE-2D:4 — Anchored Topology Readability & Navigation Polish.
 *
 * Refines STAGE-2D:3 click-to-center recomposition for calmer, denser Stages.
 * Does not redesign navigation, invent relationships, move the camera, or use Z.
 *
 * Footprint model (presentation-class estimates — not live screen measurement):
 *   minimum center distance = footprint(A) + footprint(B) + readabilityGap
 * Presentation state enlarges footprints (Minimum < Report < Operation).
 */

import {
  EXECUTIVE_STAGE_2D_CENTER,
  EXECUTIVE_STAGE_2D_DEPTH,
  normalizeExecutiveStage2DPosition,
} from "./executiveStage2DFixedCamera.ts";
import {
  resolveExecutiveStage2DHardSeparatedLayout,
  EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT,
  type ExecutiveStage2DLayoutStatus,
} from "./executiveStage2DHardSeparation.ts";
import { applyExecutiveStageSectorBreathing } from "./executiveObjectLabelRelationshipGrammar.ts";
import {
  EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION,
  resolveExecutiveStageReservedRegionContainment,
  type ExecutiveStageContainmentStatus,
} from "./executiveStageReservedRegionContainment.ts";
import {
  resolveExecutiveThreadSectorPosition,
} from "./executiveThreadExpansion.ts";
import {
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS,
  EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT,
  resolveExecutiveStage2DTopologyRecomposition,
  type ExecutiveStage2DNeighborhoodClass,
  type ExecutiveStage2DResolvedPosition,
  type ExecutiveStage2DTopologyRecomposition,
  type ResolveExecutiveStage2DTopologyRecompositionInput,
} from "./executiveStage2DTopologyRecomposition.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStage2DTopologyReadabilityIdentity =
  "STAGE-2D:4/ExecutiveStage2DTopologyReadability" as const;

export const executiveStage2DTopologyReadabilityVersion = "2.4.0" as const;

export const executiveStage2DTopologyReadabilityNamespace =
  "nexora.spatial-presentation.executive-stage-2d-topology-readability" as const;

export const executiveStage2DTopologyReadabilityPhase =
  "ExecutiveStage2DAnchoredTopologyReadabilityAndNavigationPolish" as const;

export const executiveStage2DTopologyReadabilityArchitecturalRole =
  "PresentationOnlyAnchoredTopologyReadabilityPolish" as const;

export type ExecutiveStage2DTopologyReadabilityIdentity = {
  readonly id: typeof executiveStage2DTopologyReadabilityIdentity;
  readonly version: typeof executiveStage2DTopologyReadabilityVersion;
  readonly namespace: typeof executiveStage2DTopologyReadabilityNamespace;
  readonly phase: typeof executiveStage2DTopologyReadabilityPhase;
  readonly architecturalRole: typeof executiveStage2DTopologyReadabilityArchitecturalRole;
};

const IDENTITY: ExecutiveStage2DTopologyReadabilityIdentity = Object.freeze({
  id: executiveStage2DTopologyReadabilityIdentity,
  version: executiveStage2DTopologyReadabilityVersion,
  namespace: executiveStage2DTopologyReadabilityNamespace,
  phase: executiveStage2DTopologyReadabilityPhase,
  architecturalRole: executiveStage2DTopologyReadabilityArchitecturalRole,
});

export function getExecutiveStage2DTopologyReadabilityIdentity(): ExecutiveStage2DTopologyReadabilityIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_2D_READABILITY_BOUNDARY = Object.freeze({
  architecturalRole: executiveStage2DTopologyReadabilityArchitecturalRole,
  inventsRelationships: false as const,
  redesignsRecomposition: false as const,
  neighborhoodDepth: 1 as const,
  movesCamera: false as const,
  usesZForSeparation: false as const,
  movesAnchor: false as const,
  routingMode: "readability" as const,
});

export const EXECUTIVE_STAGE_2D_READABILITY_OBSERVABILITY = Object.freeze({
  anchoredMode: "anchored" as const,
  overviewMode: "overview" as const,
  routingMode: "readability" as const,
  contract: "stage-2d-4" as const,
});

// ─── Footprint / spacing ────────────────────────────────────────────────────

export type ExecutiveStage2DPresentationClass =
  | "minimum"
  | "report"
  | "operation";

/**
 * Stable presentation-class radius estimates (world XY).
 * Chosen over live screen-space measurement for determinism and simplicity.
 */
export const EXECUTIVE_STAGE_2D_PRESENTATION_FOOTPRINT = Object.freeze({
  minimum: Object.freeze({
    anchor: 0.4,
    related: 0.32,
    secondary: 0.26,
    background: 0.22,
  }),
  report: Object.freeze({
    anchor: 0.46,
    related: 0.36,
    secondary: 0.28,
    background: 0.24,
  }),
  operation: Object.freeze({
    anchor: 0.52,
    related: 0.4,
    secondary: 0.3,
    background: 0.26,
  }),
  readabilityGap: 0.2,
  baseMinimumSeparation: 0.92,
});

export const EXECUTIVE_STAGE_2D_READABILITY_LAYOUT = Object.freeze({
  relatedRadiusLow: 2.15,
  relatedRadiusMedium: 2.35,
  relatedRadiusHigh: 2.55,
  secondaryRadius: 3.05,
  backgroundMinRadius: 3.45,
  maxRelatedVisible: 6,
  maxSecondaryVisible: 4,
  maxRelaxationIterations: 8,
  maxRelaxationNudge: 0.32,
  bendClearancePadding: 0.08,
  bendOffset: 0.42,
});

export type ExecutiveStage2DDensityBand = "low" | "medium" | "high";

export type ExecutiveStage2DOverviewResetSource =
  | "escape"
  | "background"
  | "overview-control";

export type ExecutiveStage2DStageHitKind =
  | "none"
  | "object"
  | "connection"
  | "context"
  | "overlay"
  | "ui-control";

export type ExecutiveStage2DConnectionRouteKind = "straight" | "bent";

export type ExecutiveStage2DConnectionRoute = {
  readonly connectionId: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly routeKind: ExecutiveStage2DConnectionRouteKind;
  readonly endpoints: readonly [
    ExecutiveStage2DResolvedPosition,
    ExecutiveStage2DResolvedPosition,
  ];
  readonly controlPoint: ExecutiveStage2DResolvedPosition | null;
  readonly points: readonly ExecutiveStage2DResolvedPosition[];
  readonly primary: boolean;
};

export type ExecutiveStage2DSecondaryCandidateInput = {
  readonly id: string;
  readonly attention?: string;
  readonly kind?: string;
  readonly opacity?: number;
  readonly focused?: boolean;
  readonly priorityHint?: number;
};

export type ResolveExecutiveStage2DTopologyReadabilityInput =
  ResolveExecutiveStage2DTopologyRecompositionInput & {
    readonly presentationState?: ExecutiveStage2DPresentationClass;
    readonly secondaryCandidates?: readonly ExecutiveStage2DSecondaryCandidateInput[];
    readonly maxSecondary?: number;
  };

export type ExecutiveStage2DTopologyReadability = ExecutiveStage2DTopologyRecomposition & {
  readonly readabilityIdentity: typeof executiveStage2DTopologyReadabilityIdentity;
  readonly readabilityVersion: typeof executiveStage2DTopologyReadabilityVersion;
  readonly presentationState: ExecutiveStage2DPresentationClass;
  readonly densityBand: ExecutiveStage2DDensityBand | "overview";
  readonly secondaryOverflowCount: number;
  readonly relatedVisibleCount: number;
  readonly secondaryVisibleCount: number;
  readonly hiddenCount: number;
  readonly connectionRoutes: readonly ExecutiveStage2DConnectionRoute[];
  readonly routingMode: "readability";
  readonly footprintModel:
    | "presentation-class-estimate"
    | "executive-stage-2d-visual-footprint";
  readonly layoutStatus?: ExecutiveStage2DLayoutStatus;
  readonly layoutOverlapCount?: number;
  readonly layoutMinGap?: number;
  /** STAGE-OBJ:3 — fraction of related pairs that were angularly compressed. */
  readonly sectorCompression?: number;
  readonly sectorBreathingAdjustedCount?: number;
  /** STAGE-OBJ:4-FIX — reserved-region containment. */
  readonly containmentStatus?: ExecutiveStageContainmentStatus;
  readonly boundaryViolationCount?: number;
  readonly reservedRegionCollisionCount?: number;
  readonly bottomBoundaryViolationCount?: number;
  readonly containedObjectCount?: number;
  readonly clippedObjectCount?: number;
};

// ─── Overview return contract ───────────────────────────────────────────────

/**
 * Single authority classifier for Overview return.
 * Reset implementation remains `resetNexoraMVPObjectInteractionOverview`.
 */
export function shouldResetExecutiveStage2DToOverview(input: {
  readonly source: ExecutiveStage2DOverviewResetSource;
  readonly topologyMode: "anchored" | "overview";
  readonly hitKind?: ExecutiveStage2DStageHitKind;
}): boolean {
  if (input.source === "overview-control") return true;
  if (input.topologyMode !== "anchored") return false;
  if (input.source === "escape") return true;
  // background: only empty Stage
  return (input.hitKind ?? "none") === "none";
}

export function resolveExecutiveStage2DEscapeOverviewAction(input: {
  readonly topologyMode: "anchored" | "overview";
}): "reset-overview" | "noop" {
  return shouldResetExecutiveStage2DToOverview({
    source: "escape",
    topologyMode: input.topologyMode,
  })
    ? "reset-overview"
    : "noop";
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function clampToBounds(
  x: number,
  y: number,
): ExecutiveStage2DResolvedPosition {
  const bounds = EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS;
  return normalizeExecutiveStage2DPosition({
    x: Math.min(bounds.maxX, Math.max(bounds.minX, x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, y)),
    z: EXECUTIVE_STAGE_2D_DEPTH,
  }) as ExecutiveStage2DResolvedPosition;
}

export function resolveExecutiveStage2DDensityBand(
  relatedCount: number,
): ExecutiveStage2DDensityBand {
  if (relatedCount <= 3) return "low";
  if (relatedCount <= 4) return "medium";
  return "high";
}

export function resolveExecutiveStage2DFootprintRadius(
  presentationState: ExecutiveStage2DPresentationClass,
  neighborhoodClass: Exclude<ExecutiveStage2DNeighborhoodClass, "hidden">,
): number {
  const table = EXECUTIVE_STAGE_2D_PRESENTATION_FOOTPRINT[presentationState];
  if (neighborhoodClass === "anchor") return table.anchor;
  if (neighborhoodClass === "related") return table.related;
  if (neighborhoodClass === "secondary") return table.secondary;
  return table.background;
}

export function resolveExecutiveStage2DPairMinimumSeparation(
  leftClass: Exclude<ExecutiveStage2DNeighborhoodClass, "hidden">,
  rightClass: Exclude<ExecutiveStage2DNeighborhoodClass, "hidden">,
  presentationState: ExecutiveStage2DPresentationClass,
): number {
  const left = resolveExecutiveStage2DFootprintRadius(
    presentationState,
    leftClass,
  );
  const right = resolveExecutiveStage2DFootprintRadius(
    presentationState,
    rightClass,
  );
  const required =
    left + right + EXECUTIVE_STAGE_2D_PRESENTATION_FOOTPRINT.readabilityGap;
  return Math.max(
    EXECUTIVE_STAGE_2D_PRESENTATION_FOOTPRINT.baseMinimumSeparation,
    required,
  );
}

function attentionScore(attention: string | undefined): number {
  const value = (attention ?? "normal").toLowerCase();
  if (value === "critical") return 100;
  if (value === "important") return 80;
  if (value === "elevated") return 60;
  return 20;
}

function contextKindScore(kind: string | undefined): number {
  const value = (kind ?? "").toLowerCase();
  if (value === "decision" || value === "goal") return 40;
  if (value === "problem" || value === "scenario") return 30;
  if (value === "evidence" || value === "action") return 20;
  return 0;
}

export function scoreExecutiveStage2DSecondaryCandidate(
  candidate: ExecutiveStage2DSecondaryCandidateInput,
): number {
  return (
    attentionScore(candidate.attention) +
    contextKindScore(candidate.kind) +
    (candidate.focused ? 50 : 0) +
    Math.round((candidate.opacity ?? 0) * 10) +
    (candidate.priorityHint ?? 0)
  );
}

export function prioritizeExecutiveStage2DSecondaryCandidates(
  candidates: readonly ExecutiveStage2DSecondaryCandidateInput[],
  maxVisible: number,
): {
  readonly visibleIds: readonly string[];
  readonly overflowCount: number;
} {
  const ranked = [...candidates].sort((left, right) => {
    const scoreDelta =
      scoreExecutiveStage2DSecondaryCandidate(right) -
      scoreExecutiveStage2DSecondaryCandidate(left);
    if (scoreDelta !== 0) return scoreDelta;
    return compareIds(left.id, right.id);
  });
  const visibleIds = Object.freeze(
    ranked.slice(0, maxVisible).map((entry) => entry.id),
  );
  return Object.freeze({
    visibleIds,
    overflowCount: Math.max(0, ranked.length - visibleIds.length),
  });
}

function placeRelatedAdaptive(
  index: number,
  total: number,
  band: ExecutiveStage2DDensityBand,
): ExecutiveStage2DResolvedPosition {
  const layout = EXECUTIVE_STAGE_2D_READABILITY_LAYOUT;
  const baseRadius =
    band === "low"
      ? layout.relatedRadiusLow
      : band === "medium"
        ? layout.relatedRadiusMedium
        : layout.relatedRadiusHigh;

  // STAGE-OBJ:4 — prefer east-first; STAGE-OBJ:4-FIX — skip due-south slots.
  // Focused-anchor + related footprints cannot fit on pure south above usable.minY.
  const preferredAngles = [
    0, // E
    Math.PI * 0.55, // NNE (avoids pure N overflow + presentation NE)
    Math.PI, // W
    -Math.PI * 0.28, // ESE shallow south (clears Dial + bottom)
    Math.PI * 0.72, // NNW
    -Math.PI * 0.72, // WSW shallow south
    Math.PI * 0.35, // NE
    -Math.PI * 0.45, // SE shallow
  ];
  const angle =
    preferredAngles[index % preferredAngles.length]! +
    Math.floor(index / preferredAngles.length) * 0.11;
  const stagger =
    band === "high" && index % 2 === 1 ? baseRadius * 0.14 : 0;
  const radius = baseRadius + stagger;
  const rx = band === "high" ? radius * 1.08 : radius;
  const ry = band === "high" ? radius * 0.78 : radius * 0.9;
  // STAGE-OBJ:4-FIX — center floors from footprint containment (usable.minY=-1.42).
  const relatedHalfEstimate = 0.6;
  const southFloor =
    EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect.minY +
    relatedHalfEstimate +
    0.04;
  const northCeil =
    EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect.maxY -
    relatedHalfEstimate -
    0.04;
  const y = Math.min(
    Math.max(Math.sin(angle) * ry, southFloor),
    northCeil,
  );
  return clampToBounds(Math.cos(angle) * rx, y);
}

function placeSecondarySlot(
  index: number,
  total: number,
): ExecutiveStage2DResolvedPosition {
  const layout = EXECUTIVE_STAGE_2D_READABILITY_LAYOUT;
  const angle =
    Math.PI / 4 + (index * (Math.PI * 2)) / Math.max(total * 2, 8);
  return clampToBounds(
    Math.cos(angle) * layout.secondaryRadius,
    Math.sin(angle) * layout.secondaryRadius,
  );
}

function placeBackground(
  objectId: string,
  index: number,
  base?: { readonly x: number; readonly y: number },
): ExecutiveStage2DResolvedPosition {
  const layout = EXECUTIVE_STAGE_2D_READABILITY_LAYOUT;
  let hash = 0;
  for (let i = 0; i < objectId.length; i += 1) {
    hash = (hash * 31 + objectId.charCodeAt(i)) >>> 0;
  }
  const angle = ((hash % 360) / 360) * Math.PI * 2 + index * 0.37;
  let x = base?.x ?? 0;
  let y = base?.y ?? 0;
  const radial = Math.hypot(x, y);
  if (radial < layout.backgroundMinRadius) {
    x = Math.cos(angle) * layout.backgroundMinRadius;
    y = Math.sin(angle) * layout.backgroundMinRadius;
  } else {
    const scale = layout.backgroundMinRadius / radial;
    x *= Math.max(1.15, scale);
    y *= Math.max(1.15, scale);
  }
  return clampToBounds(x, y);
}

/**
 * Footprint-aware XY relaxation. Anchor is immovable. Never uses Z.
 */
export function relaxExecutiveStage2DReadabilityPositions(input: {
  readonly positions: Readonly<
    Record<string, ExecutiveStage2DResolvedPosition>
  >;
  readonly orderedIds: readonly string[];
  readonly anchorObjectId: string;
  readonly classifications: Readonly<
    Record<string, ExecutiveStage2DNeighborhoodClass>
  >;
  readonly priority: Readonly<Record<string, number>>;
  readonly presentationState: ExecutiveStage2DPresentationClass;
}): Readonly<Record<string, ExecutiveStage2DResolvedPosition>> {
  const layout = EXECUTIVE_STAGE_2D_READABILITY_LAYOUT;
  const next: Record<string, ExecutiveStage2DResolvedPosition> = {
    ...input.positions,
  };
  next[input.anchorObjectId] = normalizeExecutiveStage2DPosition({
    x: 0,
    y: 0,
    z: 0,
  }) as ExecutiveStage2DResolvedPosition;

  const classOf = (
    id: string,
  ): Exclude<ExecutiveStage2DNeighborhoodClass, "hidden"> => {
    const value = input.classifications[id];
    if (
      value === "anchor" ||
      value === "related" ||
      value === "secondary" ||
      value === "peripheral" ||
      value === "background"
    ) {
      return value === "peripheral" ? "background" : value;
    }
    return "background";
  };

  for (let pass = 0; pass < layout.maxRelaxationIterations; pass += 1) {
    let moved = false;
    for (let i = 0; i < input.orderedIds.length; i += 1) {
      const leftId = input.orderedIds[i]!;
      const left = next[leftId];
      if (left == null) continue;
      for (let j = i + 1; j < input.orderedIds.length; j += 1) {
        const rightId = input.orderedIds[j]!;
        const right = next[rightId];
        if (right == null) continue;
        const minSep = resolveExecutiveStage2DPairMinimumSeparation(
          classOf(leftId),
          classOf(rightId),
          input.presentationState,
        );
        const dx = right.x - left.x;
        const dy = right.y - left.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= minSep || distance < 1e-6) continue;
        const push = Math.min(
          layout.maxRelaxationNudge,
          (minSep - distance) * 0.5,
        );
        const nx = dx / distance;
        const ny = dy / distance;
        const leftPriority = input.priority[leftId] ?? 0;
        const rightPriority = input.priority[rightId] ?? 0;
        const leftIsAnchor = leftId === input.anchorObjectId;
        const rightIsAnchor = rightId === input.anchorObjectId;

        if (!leftIsAnchor && leftPriority <= rightPriority) {
          next[leftId] = clampToBounds(left.x - nx * push, left.y - ny * push);
          moved = true;
        }
        if (!rightIsAnchor && rightPriority <= leftPriority) {
          next[rightId] = clampToBounds(
            right.x + nx * push,
            right.y + ny * push,
          );
          moved = true;
        }
      }
    }
    next[input.anchorObjectId] = normalizeExecutiveStage2DPosition({
      x: 0,
      y: 0,
      z: 0,
    }) as ExecutiveStage2DResolvedPosition;
    if (!moved) break;
  }

  return Object.freeze({ ...next });
}

function pointToSegmentDistance(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const abx = bx - ax;
  const aby = by - ay;
  const lengthSq = abx * abx + aby * aby;
  if (lengthSq < 1e-12) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * abx + (py - ay) * aby) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  const qx = ax + abx * t;
  const qy = ay + aby * t;
  return Math.hypot(px - qx, py - qy);
}

/**
 * Lightweight planar routing: straight when clear, single bend when blocked.
 * Endpoints and relationship identity are never altered.
 */
export function resolveExecutiveStage2DConnectionRoutes(input: {
  readonly anchorObjectId: string;
  readonly relatedObjectIds: readonly string[];
  readonly relationships: readonly {
    readonly id: string;
    readonly sourceId: string;
    readonly targetId: string;
  }[];
  readonly positions: Readonly<
    Record<string, ExecutiveStage2DResolvedPosition>
  >;
  readonly classifications: Readonly<
    Record<string, ExecutiveStage2DNeighborhoodClass>
  >;
  readonly presentationState: ExecutiveStage2DPresentationClass;
}): readonly ExecutiveStage2DConnectionRoute[] {
  const relatedSet = new Set(input.relatedObjectIds);
  const layout = EXECUTIVE_STAGE_2D_READABILITY_LAYOUT;
  const routes: ExecutiveStage2DConnectionRoute[] = [];

  for (const edge of [...input.relationships].sort((a, b) =>
    compareIds(a.id, b.id),
  )) {
    const source = input.positions[edge.sourceId];
    const target = input.positions[edge.targetId];
    if (source == null || target == null) continue;

    const touchesAnchor =
      edge.sourceId === input.anchorObjectId ||
      edge.targetId === input.anchorObjectId;
    const bothNeighborhood =
      (relatedSet.has(edge.sourceId) ||
        edge.sourceId === input.anchorObjectId) &&
      (relatedSet.has(edge.targetId) ||
        edge.targetId === input.anchorObjectId);
    const primary = touchesAnchor && bothNeighborhood;
    if (!primary && !bothNeighborhood) continue;

    const blockers = Object.keys(input.positions).filter((objectId) => {
      if (objectId === edge.sourceId || objectId === edge.targetId) return false;
      const classification = input.classifications[objectId];
      return (
        classification === "related" ||
        classification === "secondary" ||
        classification === "anchor"
      );
    });

    let blocked = false;
    for (const blockerId of blockers) {
      const blocker = input.positions[blockerId]!;
      const blockerClass =
        (input.classifications[blockerId] as Exclude<
          ExecutiveStage2DNeighborhoodClass,
          "hidden"
        >) ?? "related";
      const clearance =
        resolveExecutiveStage2DFootprintRadius(
          input.presentationState,
          blockerClass,
        ) + layout.bendClearancePadding;
      const distance = pointToSegmentDistance(
        blocker.x,
        blocker.y,
        source.x,
        source.y,
        target.x,
        target.y,
      );
      if (distance < clearance) {
        blocked = true;
        break;
      }
    }

    let controlPoint: ExecutiveStage2DResolvedPosition | null = null;
    let routeKind: ExecutiveStage2DConnectionRouteKind = "straight";
    if (blocked) {
      routeKind = "bent";
      const mx = (source.x + target.x) / 2;
      const my = (source.y + target.y) / 2;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const length = Math.hypot(dx, dy) || 1;
      // Deterministic outward bend (prefer away from origin when possible).
      const px = -dy / length;
      const py = dx / length;
      const midRadial = mx * px + my * py;
      const sign = midRadial >= 0 ? 1 : -1;
      controlPoint = clampToBounds(
        mx + px * layout.bendOffset * sign,
        my + py * layout.bendOffset * sign,
      );
    }

    const points = controlPoint
      ? Object.freeze([source, controlPoint, target])
      : Object.freeze([source, target]);

    routes.push(
      Object.freeze({
        connectionId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        routeKind,
        endpoints: Object.freeze([source, target] as const),
        controlPoint,
        points,
        primary,
      }),
    );
  }

  return Object.freeze(routes);
}

function emptyOverviewReadability(
  presentationState: ExecutiveStage2DPresentationClass,
  reason: string,
): ExecutiveStage2DTopologyReadability {
  const base = resolveExecutiveStage2DTopologyRecomposition({
    anchorObjectId: null,
    objects: [],
    relationships: [],
  });
  return Object.freeze({
    ...base,
    recompositionReason: reason,
    readabilityIdentity: executiveStage2DTopologyReadabilityIdentity,
    readabilityVersion: executiveStage2DTopologyReadabilityVersion,
    presentationState,
    densityBand: "overview" as const,
    secondaryOverflowCount: 0,
    relatedVisibleCount: 0,
    secondaryVisibleCount: 0,
    hiddenCount: 0,
    connectionRoutes: Object.freeze([]),
    routingMode: "readability" as const,
    footprintModel: "presentation-class-estimate" as const,
    containmentStatus: "valid" as const,
    boundaryViolationCount: 0,
    reservedRegionCollisionCount: 0,
    bottomBoundaryViolationCount: 0,
    containedObjectCount: 0,
    clippedObjectCount: 0,
  });
}

/**
 * Resolve STAGE-2D:3 recomposition, then apply STAGE-2D:4 readability polish.
 */
export function resolveExecutiveStage2DTopologyReadability(
  input: ResolveExecutiveStage2DTopologyReadabilityInput,
): ExecutiveStage2DTopologyReadability {
  const presentationState = input.presentationState ?? "minimum";
  const base = resolveExecutiveStage2DTopologyRecomposition(input);

  if (base.mode !== "anchored" || base.anchorObjectId == null) {
    return emptyOverviewReadability(
      presentationState,
      base.recompositionReason,
    );
  }

  const anchorObjectId = base.anchorObjectId;
  const maxRelated =
    input.maxRelated ?? EXECUTIVE_STAGE_2D_READABILITY_LAYOUT.maxRelatedVisible;
  const maxSecondary =
    input.maxSecondary ??
    EXECUTIVE_STAGE_2D_READABILITY_LAYOUT.maxSecondaryVisible;

  // Preserve STAGE-2D:3 related truth — readability may only reorder layout.
  const relatedObjectIds = [...base.relatedObjectIds.slice(0, maxRelated)];
  const relatedSet = new Set(relatedObjectIds);
  const densityBand = resolveExecutiveStage2DDensityBand(relatedObjectIds.length);

  const secondaryInput: readonly ExecutiveStage2DSecondaryCandidateInput[] =
    input.secondaryCandidates ??
    (input.secondaryCandidateIds ?? []).map((id) =>
      Object.freeze({ id }),
    );
  const filteredSecondary = secondaryInput.filter(
    (candidate) =>
      candidate.id !== anchorObjectId && !relatedSet.has(candidate.id),
  );
  const prioritized = prioritizeExecutiveStage2DSecondaryCandidates(
    filteredSecondary,
    maxSecondary,
  );
  const secondaryObjectIds = [...prioritized.visibleIds];
  const secondarySet = new Set(secondaryObjectIds);

  const classifications: Record<string, ExecutiveStage2DNeighborhoodClass> = {
    [anchorObjectId]: "anchor",
  };
  const positions: Record<string, ExecutiveStage2DResolvedPosition> = {
    [anchorObjectId]: normalizeExecutiveStage2DPosition(
      EXECUTIVE_STAGE_2D_CENTER,
    ) as ExecutiveStage2DResolvedPosition,
  };
  const priority: Record<string, number> = {
    [anchorObjectId]: 100,
  };

  relatedObjectIds.forEach((objectId, index) => {
    classifications[objectId] = "related";
    positions[objectId] = placeRelatedAdaptive(
      index,
      relatedObjectIds.length,
      densityBand,
    );
    priority[objectId] = 80 - index;
  });

  secondaryObjectIds.forEach((objectId, index) => {
    const candidate = filteredSecondary.find((entry) => entry.id === objectId);
    const kind = candidate?.kind;
    if (
      kind === "problem" ||
      kind === "scenario" ||
      kind === "decision" ||
      kind === "execution"
    ) {
      // Smaller secondary footprint + high priority keeps all four visible.
      classifications[objectId] = "secondary";
      const sector = resolveExecutiveThreadSectorPosition(kind);
      positions[objectId] = normalizeExecutiveStage2DPosition({
        x: sector.x,
        y: sector.y,
        z: 0,
      }) as ExecutiveStage2DResolvedPosition;
      priority[objectId] = 90 - index;
    } else {
      classifications[objectId] = "secondary";
      positions[objectId] = placeSecondarySlot(index, secondaryObjectIds.length);
      priority[objectId] = 40 - index;
    }
  });

  const backgroundObjectIds: string[] = [];
  const peripheralObjectIds: string[] = [];
  const hiddenObjectIds: string[] = [];

  input.objects.forEach((object, index) => {
    if (object.objectId === anchorObjectId) return;
    if (relatedSet.has(object.objectId)) return;
    if (secondarySet.has(object.objectId)) return;
    // STAGE-OBJ:4 — preserve peripheral (and legacy background) from base.
    const baseClass = base.classifications[object.objectId];
    if (baseClass === "peripheral" || baseClass === "background") {
      classifications[object.objectId] = "peripheral";
      peripheralObjectIds.push(object.objectId);
      backgroundObjectIds.push(object.objectId);
      positions[object.objectId] =
        base.positions[object.objectId] ??
        placeBackground(object.objectId, index, object.basePosition);
      priority[object.objectId] = 35 - peripheralObjectIds.length;
      return;
    }
    classifications[object.objectId] = "hidden";
    hiddenObjectIds.push(object.objectId);
  });

  // Context-only secondary ids may not appear in objects[].
  for (const secondaryId of secondaryObjectIds) {
    if (positions[secondaryId] == null) {
      classifications[secondaryId] = "secondary";
    }
  }

  const orderedIds = Object.freeze([
    anchorObjectId,
    ...relatedObjectIds,
    ...secondaryObjectIds,
    ...peripheralObjectIds,
  ]);

  const relaxed = relaxExecutiveStage2DReadabilityPositions({
    positions,
    orderedIds,
    anchorObjectId,
    classifications,
    priority,
    presentationState,
  });

  const finalPositions: Record<string, ExecutiveStage2DResolvedPosition> = {
    ...relaxed,
    [anchorObjectId]: normalizeExecutiveStage2DPosition({
      x: 0,
      y: 0,
      z: 0,
    }) as ExecutiveStage2DResolvedPosition,
  };

  // Stabilize floating point for determinism.
  for (const objectId of Object.keys(finalPositions)) {
    const position = finalPositions[objectId]!;
    finalPositions[objectId] = normalizeExecutiveStage2DPosition({
      x: stabilize(position.x),
      y: stabilize(position.y),
      z: 0,
    }) as ExecutiveStage2DResolvedPosition;
  }
  finalPositions[anchorObjectId] = normalizeExecutiveStage2DPosition({
    x: 0,
    y: 0,
    z: 0,
  }) as ExecutiveStage2DResolvedPosition;

  // STAGE-OBJ:3 — sector breathing before hard separation (presentation XY only).
  const breathed = applyExecutiveStageSectorBreathing({
    positions: finalPositions,
    relatedObjectIds,
    anchorObjectId,
    classifications,
  });
  for (const objectId of Object.keys(breathed.positions)) {
    finalPositions[objectId] = breathed.positions[objectId]!;
  }
  finalPositions[anchorObjectId] = normalizeExecutiveStage2DPosition({
    x: 0,
    y: 0,
    z: 0,
  }) as ExecutiveStage2DResolvedPosition;

  // STAGE-2D:6V-FIX — hard XY separation (no overlap accepted).
  const hard = resolveExecutiveStage2DHardSeparatedLayout({
    anchorObjectId,
    positions: finalPositions,
    classifications,
    priority,
    presentationState,
    orderedIds,
  });
  for (const objectId of Object.keys(hard.positions)) {
    finalPositions[objectId] = hard.positions[objectId]!;
  }
  for (const hiddenId of hard.hiddenObjectIds) {
    if (hiddenId === anchorObjectId) continue;
    if (!hiddenObjectIds.includes(hiddenId)) {
      hiddenObjectIds.push(hiddenId);
    }
    classifications[hiddenId] = "hidden";
    delete finalPositions[hiddenId];
    // Remove from visible role lists.
    const relatedIndex = relatedObjectIds.indexOf(hiddenId);
    if (relatedIndex >= 0) relatedObjectIds.splice(relatedIndex, 1);
    const secondaryIndex = secondaryObjectIds.indexOf(hiddenId);
    if (secondaryIndex >= 0) secondaryObjectIds.splice(secondaryIndex, 1);
    const backgroundIndex = backgroundObjectIds.indexOf(hiddenId);
    if (backgroundIndex >= 0) backgroundObjectIds.splice(backgroundIndex, 1);
    const peripheralIndex = peripheralObjectIds.indexOf(hiddenId);
    if (peripheralIndex >= 0) peripheralObjectIds.splice(peripheralIndex, 1);
  }
  finalPositions[anchorObjectId] = normalizeExecutiveStage2DPosition({
    x: 0,
    y: 0,
    z: 0,
  }) as ExecutiveStage2DResolvedPosition;

  // STAGE-OBJ:4-FIX — reserved-region containment after hard separation.
  const contained = resolveExecutiveStageReservedRegionContainment({
    anchorObjectId,
    positions: finalPositions,
    classifications,
    priority,
    presentationState,
    orderedIds,
  });
  for (const objectId of Object.keys(finalPositions)) {
    if (contained.positions[objectId] == null) {
      delete finalPositions[objectId];
      continue;
    }
    finalPositions[objectId] = contained.positions[objectId]!;
  }
  for (const hiddenId of contained.hiddenObjectIds) {
    if (hiddenId === anchorObjectId) continue;
    if (!hiddenObjectIds.includes(hiddenId)) {
      hiddenObjectIds.push(hiddenId);
    }
    classifications[hiddenId] = "hidden";
    delete finalPositions[hiddenId];
    const relatedIndex = relatedObjectIds.indexOf(hiddenId);
    if (relatedIndex >= 0) relatedObjectIds.splice(relatedIndex, 1);
    const secondaryIndex = secondaryObjectIds.indexOf(hiddenId);
    if (secondaryIndex >= 0) secondaryObjectIds.splice(secondaryIndex, 1);
    const backgroundIndex = backgroundObjectIds.indexOf(hiddenId);
    if (backgroundIndex >= 0) backgroundObjectIds.splice(backgroundIndex, 1);
    const peripheralIndex = peripheralObjectIds.indexOf(hiddenId);
    if (peripheralIndex >= 0) peripheralObjectIds.splice(peripheralIndex, 1);
  }
  finalPositions[anchorObjectId] = normalizeExecutiveStage2DPosition({
    x: 0,
    y: 0,
    z: 0,
  }) as ExecutiveStage2DResolvedPosition;

  const connectionRoutes = resolveExecutiveStage2DConnectionRoutes({
    anchorObjectId,
    relatedObjectIds,
    relationships: input.relationships,
    positions: finalPositions,
    classifications,
    presentationState,
  });

  return Object.freeze({
    identity: base.identity,
    version: base.version,
    mode: "anchored" as const,
    anchorObjectId,
    anchorPosition: finalPositions[anchorObjectId]!,
    relatedObjectIds: Object.freeze(relatedObjectIds),
    secondaryObjectIds: Object.freeze(secondaryObjectIds),
    backgroundObjectIds: Object.freeze(backgroundObjectIds.sort(compareIds)),
    peripheralObjectIds: Object.freeze(peripheralObjectIds.sort(compareIds)),
    hiddenObjectIds: Object.freeze(hiddenObjectIds.sort(compareIds)),
    classifications: Object.freeze(classifications),
    positions: Object.freeze(finalPositions),
    recompositionReason: "click-to-center-one-hop-readability",
    neighborhoodDepth: 1 as const,
    readabilityIdentity: executiveStage2DTopologyReadabilityIdentity,
    readabilityVersion: executiveStage2DTopologyReadabilityVersion,
    presentationState,
    densityBand,
    secondaryOverflowCount: prioritized.overflowCount,
    relatedVisibleCount: relatedObjectIds.length,
    secondaryVisibleCount: secondaryObjectIds.length,
    hiddenCount: hiddenObjectIds.length,
    connectionRoutes,
    routingMode: "readability" as const,
    footprintModel: "executive-stage-2d-visual-footprint" as const,
    layoutStatus: hard.layoutStatus,
    layoutOverlapCount: hard.overlapCount,
    layoutMinGap: hard.minObservedGap,
    sectorCompression: breathed.sectorCompression,
    sectorBreathingAdjustedCount: breathed.adjustedCount,
    containmentStatus: contained.status,
    boundaryViolationCount: contained.boundaryViolationCount,
    reservedRegionCollisionCount: contained.reservedRegionCollisionCount,
    bottomBoundaryViolationCount: contained.bottomBoundaryViolationCount,
    containedObjectCount: contained.containedObjectCount,
    clippedObjectCount: contained.clippedObjectCount,
  });
}

export function verifyExecutiveStage2DTopologyReadability(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly inventsRelationships: boolean;
  readonly anchorExact: boolean;
  readonly cameraStatic: boolean;
}> {
  const identity = getExecutiveStage2DTopologyReadabilityIdentity();
  const identityValid =
    identity.id === "STAGE-2D:4/ExecutiveStage2DTopologyReadability" &&
    identity.version === "2.4.0";
  const inventsRelationships =
    EXECUTIVE_STAGE_2D_READABILITY_BOUNDARY.inventsRelationships;
  const sample = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-a",
    presentationState: "report",
    objects: [
      Object.freeze({ objectId: "obj-a" }),
      Object.freeze({ objectId: "obj-b" }),
      Object.freeze({ objectId: "obj-c", attention: "critical" }),
    ],
    relationships: [
      Object.freeze({
        id: "rel-a-b",
        sourceId: "obj-a",
        targetId: "obj-b",
      }),
    ],
  });
  const anchorExact =
    sample.anchorPosition.x === 0 &&
    sample.anchorPosition.y === 0 &&
    sample.anchorPosition.z === 0;
  const cameraStatic =
    EXECUTIVE_STAGE_2D_READABILITY_BOUNDARY.movesCamera === false;

  return Object.freeze({
    ok:
      options?.forceFailure !== true &&
      identityValid &&
      inventsRelationships === false &&
      anchorExact &&
      cameraStatic,
    identityValid,
    inventsRelationships,
    anchorExact,
    cameraStatic,
  });
}

/** Re-export STAGE-2D:3 layout constants used by readability consumers. */
export {
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS,
  EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT,
};
