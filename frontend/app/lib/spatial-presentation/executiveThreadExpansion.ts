/**
 * STAGE-THREAD:1 — Executive Thread Expansion & Decision-Object Projection.
 * STAGE-THREAD:1-FIX — Executive Thread Gateway Discoverability.
 *
 * Executive Thread is a presentation/context gateway — never a Business Object.
 * Expansion projects canonical Problem / Scenario / Decision / Execution into
 * real Stage objects around the current business anchor (anchor stays fixed).
 */

import { formatExecutiveObjectStageLabel } from "./executiveObjectLabelRelationshipGrammar.ts";
import type { ExecutiveStage2DPresentationClass } from "./executiveStage2DHardSeparation.ts";
import { EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION } from "./executiveStageReservedRegionContainment.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveThreadExpansionIdentity =
  "STAGE-THREAD:1/ExecutiveThreadExpansionDecisionObjectProjection" as const;

export const executiveThreadGatewayDiscoverabilityIdentity =
  "STAGE-THREAD:1-FIX/ExecutiveThreadGatewayDiscoverability" as const;

export const executiveThreadExpansionVersion = "5.1.1" as const;

export const executiveThreadExpansionNamespace =
  "nexora.spatial-presentation.executive-thread-expansion" as const;

export const executiveThreadGatewayDiscoverabilityNamespace =
  "nexora.spatial-presentation.executive-thread-gateway-discoverability" as const;

export const executiveThreadExpansionPhase =
  "ExecutiveThreadExpansionAndDecisionObjectProjection" as const;

export const executiveThreadGatewayDiscoverabilityPhase =
  "ExecutiveThreadGatewayDiscoverability" as const;

export const executiveThreadExpansionArchitecturalRole =
  "PresentationOnlyExecutiveThreadContextGateway" as const;

export type ExecutiveThreadExpansionIdentity = {
  readonly id: typeof executiveThreadExpansionIdentity;
  readonly version: typeof executiveThreadExpansionVersion;
  readonly namespace: typeof executiveThreadExpansionNamespace;
  readonly phase: typeof executiveThreadExpansionPhase;
  readonly architecturalRole: typeof executiveThreadExpansionArchitecturalRole;
  readonly fixId: typeof executiveThreadGatewayDiscoverabilityIdentity;
  readonly fixNamespace: typeof executiveThreadGatewayDiscoverabilityNamespace;
};

const IDENTITY: ExecutiveThreadExpansionIdentity = Object.freeze({
  id: executiveThreadExpansionIdentity,
  version: executiveThreadExpansionVersion,
  namespace: executiveThreadExpansionNamespace,
  phase: executiveThreadExpansionPhase,
  architecturalRole: executiveThreadExpansionArchitecturalRole,
  fixId: executiveThreadGatewayDiscoverabilityIdentity,
  fixNamespace: executiveThreadGatewayDiscoverabilityNamespace,
});

export function getExecutiveThreadExpansionIdentity(): ExecutiveThreadExpansionIdentity {
  return IDENTITY;
}

export function getExecutiveThreadGatewayDiscoverabilityIdentity(): Readonly<{
  readonly id: typeof executiveThreadGatewayDiscoverabilityIdentity;
  readonly version: typeof executiveThreadExpansionVersion;
  readonly namespace: typeof executiveThreadGatewayDiscoverabilityNamespace;
  readonly phase: typeof executiveThreadGatewayDiscoverabilityPhase;
  readonly contract: "stage-thread-1-fix";
}> {
  return Object.freeze({
    id: executiveThreadGatewayDiscoverabilityIdentity,
    version: executiveThreadExpansionVersion,
    namespace: executiveThreadGatewayDiscoverabilityNamespace,
    phase: executiveThreadGatewayDiscoverabilityPhase,
    contract: "stage-thread-1-fix",
  });
}

export const EXECUTIVE_THREAD_EXPANSION_BOUNDARY = Object.freeze({
  architecturalRole: executiveThreadExpansionArchitecturalRole,
  isBusinessObject: false as const,
  replacesBusinessAnchor: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  inventsRelationships: false as const,
  pushesObjectNavigationHistory: false as const,
  createsSecondLayoutEngine: false as const,
});

/**
 * STAGE-THREAD:1-FIX — discoverable collapsed gateway footprint (world XY).
 * ~1.5–2× more prominent than the prior 0.4×0.4 ring hit target.
 */
export const EXECUTIVE_THREAD_GATEWAY_FOOTPRINT = Object.freeze({
  /** Visible capsule width / height in Stage world units. */
  width: 1.38,
  height: 0.4,
  /** Pointer hit target (larger than visible chrome). */
  hitWidth: 1.55,
  hitHeight: 0.56,
  /** AABB half-extents for separation / containment (capsule, not square). */
  halfWidth: 0.78,
  halfHeight: 0.3,
  /** Conservative circular half-extent for coarse distance checks. */
  halfExtent: 0.78,
  /** Quiet collapse control while expanded. */
  collapseWidth: 0.95,
  collapseHeight: 0.28,
  collapseHitWidth: 1.05,
  collapseHitHeight: 0.38,
  collapseHalfWidth: 0.53,
  collapseHalfHeight: 0.2,
  collapseHalfExtent: 0.53,
  /** Legacy collapsed ring hit size (regression baseline). */
  legacyHitSize: 0.4,
});

/** Preferred → fallback gateway sectors (upper-right first, reserved-safe). */
export const EXECUTIVE_THREAD_GATEWAY_SECTORS: readonly Readonly<{
  readonly x: number;
  readonly y: number;
}>[] = Object.freeze([
  Object.freeze({ x: 1.45, y: 0.72 }), // NE preferred (below risk / Presentation Level)
  Object.freeze({ x: 1.95, y: 0.42 }), // ENE
  Object.freeze({ x: 2.15, y: -0.05 }), // E
  Object.freeze({ x: -1.45, y: 0.72 }), // NW
  Object.freeze({ x: -1.95, y: 0.42 }), // WNW
  Object.freeze({ x: 1.2, y: -0.62 }), // SE shallow
  Object.freeze({ x: -1.2, y: -0.62 }), // SW shallow
  Object.freeze({ x: 0.35, y: 1.25 }), // N shallow
]);

export const EXECUTIVE_THREAD_COLLAPSE_CONTROL_SECTOR = Object.freeze({
  // Quiet SE shallow — clear of Workspace Dial reserved region.
  x: 1.55,
  y: -0.95,
});

function gatewayIntersectsHardReserved(
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number,
): boolean {
  const minX = x - halfWidth;
  const maxX = x + halfWidth;
  const minY = y - halfHeight;
  const maxY = y + halfHeight;
  for (const region of EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardReservedRegions) {
    const intersects =
      minX < region.maxX - 1e-6 &&
      maxX > region.minX + 1e-6 &&
      minY < region.maxY - 1e-6 &&
      maxY > region.minY + 1e-6;
    if (intersects) return true;
  }
  return false;
}

function gatewayFootprintFitsRect(
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number,
): boolean {
  const usable = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect;
  return (
    x - halfWidth >= usable.minX - 1e-6 &&
    x + halfWidth <= usable.maxX + 1e-6 &&
    y - halfHeight >= usable.minY - 1e-6 &&
    y + halfHeight <= usable.maxY + 1e-6
  );
}

function gatewayOverlapsOccupied(
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number,
  occupied: readonly Readonly<{
    readonly x: number;
    readonly y: number;
    readonly halfWidth?: number;
    readonly halfHeight?: number;
    readonly halfExtent?: number;
  }>[],
  minGap: number,
): boolean {
  const gMinX = x - halfWidth - minGap;
  const gMaxX = x + halfWidth + minGap;
  const gMinY = y - halfHeight - minGap;
  const gMaxY = y + halfHeight + minGap;
  for (const center of occupied) {
    const ohw = center.halfWidth ?? center.halfExtent ?? 0.4;
    const ohh = center.halfHeight ?? center.halfExtent ?? 0.4;
    const oMinX = center.x - ohw;
    const oMaxX = center.x + ohw;
    const oMinY = center.y - ohh;
    const oMaxY = center.y + ohh;
    if (
      gMinX < oMaxX - 1e-6 &&
      gMaxX > oMinX + 1e-6 &&
      gMinY < oMaxY - 1e-6 &&
      gMaxY > oMinY + 1e-6
    ) {
      return true;
    }
  }
  return false;
}

export type ExecutiveThreadGatewayMode =
  | "discoverable-collapsed"
  | "quiet-collapse";

export type ExecutiveThreadWorkKind =
  | "problem"
  | "scenario"
  | "decision"
  | "execution";

export type ExecutiveThreadExpansionState = Readonly<{
  readonly expanded: boolean;
  readonly anchorObjectId: string | null;
  readonly threadId: string | null;
  readonly selectedSubjectId: string | null;
}>;

export const EXECUTIVE_THREAD_WORK_KIND_ORDER: readonly ExecutiveThreadWorkKind[] =
  Object.freeze(["problem", "scenario", "decision", "execution"]);

/**
 * Deterministic XY sectors around the business anchor (semantic z = 0).
 * Footprint-aware south floor keeps Execution above Timeline containment.
 */
export const EXECUTIVE_THREAD_SECTOR_BY_KIND: Readonly<
  Record<
    ExecutiveThreadWorkKind,
    Readonly<{ readonly x: number; readonly y: number; readonly z: 0 }>
  >
> = Object.freeze({
  // Clear focused-anchor half (~0.9) + gap; avoid Dial SE and Timeline south.
  problem: Object.freeze({ x: 0.72, y: 1.68, z: 0 as const }),
  scenario: Object.freeze({ x: -1.85, y: 0.35, z: 0 as const }),
  decision: Object.freeze({ x: 1.85, y: 0.35, z: 0 as const }),
  execution: Object.freeze({ x: -1.2, y: -0.78, z: 0 as const }),
});

export function collapsedExecutiveThreadId(anchorObjectId: string): string {
  return `thread-${anchorObjectId}`;
}

export function resolveExecutiveThreadExpansionState(input: {
  readonly expandExecutiveThread?: boolean;
  readonly anchorObjectId: string | null;
  readonly selectedSubjectId?: string | null;
}): ExecutiveThreadExpansionState {
  const expanded =
    input.expandExecutiveThread === true && input.anchorObjectId != null;
  return Object.freeze({
    expanded,
    anchorObjectId: expanded ? input.anchorObjectId : null,
    threadId:
      expanded && input.anchorObjectId != null
        ? collapsedExecutiveThreadId(input.anchorObjectId)
        : null,
    selectedSubjectId: expanded ? (input.selectedSubjectId ?? null) : null,
  });
}

export function isExecutiveThreadWorkKind(
  kind: string | null | undefined,
): kind is ExecutiveThreadWorkKind {
  return (
    kind === "problem" ||
    kind === "scenario" ||
    kind === "decision" ||
    kind === "execution"
  );
}

export function resolveExecutiveThreadSectorPosition(
  kind: ExecutiveThreadWorkKind,
): Readonly<{ readonly x: number; readonly y: number; readonly z: 0 }> {
  return EXECUTIVE_THREAD_SECTOR_BY_KIND[kind];
}

export function formatExecutiveThreadGatewayLabel(count: number): string {
  const safe = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  return `Executive Thread · ${safe} ›`;
}

export function formatExecutiveThreadCollapseLabel(): string {
  return "Collapse Thread";
}

/** Axis-aligned overlap test for gateway vs Stage object silhouettes. */
export function measureExecutiveThreadGatewayObjectOverlap(input: {
  readonly gatewayX: number;
  readonly gatewayY: number;
  readonly gatewayHalfWidth?: number;
  readonly gatewayHalfHeight?: number;
  readonly gatewayHalfExtent?: number;
  readonly objects: readonly Readonly<{
    readonly x: number;
    readonly y: number;
    readonly halfExtent: number;
  }>[];
}): number {
  const ghw =
    input.gatewayHalfWidth ??
    input.gatewayHalfExtent ??
    EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfWidth;
  const ghh =
    input.gatewayHalfHeight ??
    input.gatewayHalfExtent ??
    EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfHeight;
  const gMinX = input.gatewayX - ghw;
  const gMaxX = input.gatewayX + ghw;
  const gMinY = input.gatewayY - ghh;
  const gMaxY = input.gatewayY + ghh;
  let overlapCount = 0;
  for (const object of input.objects) {
    const oMinX = object.x - object.halfExtent;
    const oMaxX = object.x + object.halfExtent;
    const oMinY = object.y - object.halfExtent;
    const oMaxY = object.y + object.halfExtent;
    const intersects =
      gMinX < oMaxX - 1e-6 &&
      gMaxX > oMinX + 1e-6 &&
      gMinY < oMaxY - 1e-6 &&
      gMaxY > oMinY + 1e-6;
    if (intersects) overlapCount += 1;
  }
  return overlapCount;
}

export function measureExecutiveThreadGatewayContainment(input: {
  readonly gatewayX: number;
  readonly gatewayY: number;
  readonly gatewayHalfWidth?: number;
  readonly gatewayHalfHeight?: number;
  readonly gatewayHalfExtent?: number;
}): Readonly<{
  readonly clipped: boolean;
  readonly reservedCollisionCount: number;
}> {
  const halfWidth =
    input.gatewayHalfWidth ??
    input.gatewayHalfExtent ??
    EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfWidth;
  const halfHeight =
    input.gatewayHalfHeight ??
    input.gatewayHalfExtent ??
    EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfHeight;
  const usable = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect;
  const minX = input.gatewayX - halfWidth;
  const maxX = input.gatewayX + halfWidth;
  const minY = input.gatewayY - halfHeight;
  const maxY = input.gatewayY + halfHeight;
  const clipped =
    minX < usable.minX - 1e-6 ||
    maxX > usable.maxX + 1e-6 ||
    minY < usable.minY - 1e-6 ||
    maxY > usable.maxY + 1e-6;
  let reservedCollisionCount = 0;
  for (const region of EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardReservedRegions) {
    const intersects =
      minX < region.maxX - 1e-6 &&
      maxX > region.minX + 1e-6 &&
      minY < region.maxY - 1e-6 &&
      maxY > region.minY + 1e-6;
    if (intersects) reservedCollisionCount += 1;
  }
  return Object.freeze({ clipped, reservedCollisionCount });
}

function gatewayFootprintFits(
  x: number,
  y: number,
  halfExtent: number,
): boolean {
  return gatewayFootprintFitsRect(x, y, halfExtent, halfExtent);
}

/**
 * Deterministic preferred-sector placement for the collapsed gateway.
 * Falls back through EXECUTIVE_THREAD_GATEWAY_SECTORS when a sector cannot fit.
 */
export function resolveExecutiveThreadGatewayPosition(input?: {
  readonly mode?: ExecutiveThreadGatewayMode;
  readonly occupiedCenters?: readonly Readonly<{
    readonly x: number;
    readonly y: number;
    readonly halfWidth?: number;
    readonly halfHeight?: number;
    readonly halfExtent?: number;
  }>[];
  readonly minCenterDistance?: number;
  readonly minGap?: number;
}): Readonly<{
  readonly x: number;
  readonly y: number;
  readonly z: 0;
  readonly sectorIndex: number;
}> {
  if (input?.mode === "quiet-collapse") {
    const halfWidth = EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.collapseHalfWidth;
    const halfHeight = EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.collapseHalfHeight;
    const candidates = [
      EXECUTIVE_THREAD_COLLAPSE_CONTROL_SECTOR,
      Object.freeze({ x: 1.15, y: -0.95 }),
      Object.freeze({ x: -1.55, y: -0.95 }),
      Object.freeze({ x: 0.85, y: 1.35 }),
    ];
    for (let index = 0; index < candidates.length; index += 1) {
      const sector = candidates[index]!;
      if (
        !gatewayFootprintFitsRect(sector.x, sector.y, halfWidth, halfHeight)
      ) {
        continue;
      }
      if (
        gatewayIntersectsHardReserved(sector.x, sector.y, halfWidth, halfHeight)
      ) {
        continue;
      }
      return Object.freeze({
        x: sector.x,
        y: sector.y,
        z: 0 as const,
        sectorIndex: -1 - index,
      });
    }
    return Object.freeze({
      x: EXECUTIVE_THREAD_COLLAPSE_CONTROL_SECTOR.x,
      y: EXECUTIVE_THREAD_COLLAPSE_CONTROL_SECTOR.y,
      z: 0 as const,
      sectorIndex: -1,
    });
  }
  const halfWidth = EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfWidth;
  const halfHeight = EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfHeight;
  // Soft gap — reserved/object hard separation already uses silhouette AABB.
  const gap = Number.isFinite(input?.minGap)
    ? Math.min(input?.minGap as number, 0.18)
    : 0.12;
  const occupied = input?.occupiedCenters ?? [];
  void input?.minCenterDistance;
  const candidates: Array<{
    readonly x: number;
    readonly y: number;
    readonly sectorIndex: number;
    readonly score: number;
  }> = [];

  const scoreCandidate = (x: number, y: number): number => {
    // Prefer NE: reward +x/+y while penalizing overlap depth.
    let score = x * 0.35 + y * 0.55;
    for (const center of occupied) {
      const ohw = center.halfWidth ?? center.halfExtent ?? 0.4;
      const ohh = center.halfHeight ?? center.halfExtent ?? 0.4;
      const overlapX =
        halfWidth +
        gap +
        ohw -
        Math.abs(x - center.x);
      const overlapY =
        halfHeight +
        gap +
        ohh -
        Math.abs(y - center.y);
      if (overlapX > 0 && overlapY > 0) {
        score -= 40 + overlapX * overlapY * 20;
      }
    }
    return score;
  };

  for (let index = 0; index < EXECUTIVE_THREAD_GATEWAY_SECTORS.length; index += 1) {
    const sector = EXECUTIVE_THREAD_GATEWAY_SECTORS[index]!;
    if (!gatewayFootprintFitsRect(sector.x, sector.y, halfWidth, halfHeight)) {
      continue;
    }
    if (gatewayIntersectsHardReserved(sector.x, sector.y, halfWidth, halfHeight)) {
      continue;
    }
    if (
      gatewayOverlapsOccupied(
        sector.x,
        sector.y,
        halfWidth,
        halfHeight,
        occupied,
        gap,
      )
    ) {
      candidates.push(
        Object.freeze({
          x: sector.x,
          y: sector.y,
          sectorIndex: index,
          score: scoreCandidate(sector.x, sector.y),
        }),
      );
      continue;
    }
    return Object.freeze({
      x: sector.x,
      y: sector.y,
      z: 0 as const,
      sectorIndex: index,
    });
  }

  // Deterministic spiral search (presentation-only) when sectors are occupied.
  for (let ring = 1; ring <= 8; ring += 1) {
    const radius = 1.05 + ring * 0.32;
    const steps = 10 + ring * 2;
    for (let step = 0; step < steps; step += 1) {
      // Prefer upper-right quadrant first within each ring.
      const angle = -Math.PI / 4 + (step / steps) * Math.PI * 2;
      const x = stabilizeGateway(Math.cos(angle) * radius);
      const y = stabilizeGateway(Math.sin(angle) * radius);
      if (!gatewayFootprintFitsRect(x, y, halfWidth, halfHeight)) continue;
      if (gatewayIntersectsHardReserved(x, y, halfWidth, halfHeight)) continue;
      if (gatewayOverlapsOccupied(x, y, halfWidth, halfHeight, occupied, gap)) {
        candidates.push(
          Object.freeze({
            x,
            y,
            sectorIndex: 100 + ring * 10 + step,
            score: scoreCandidate(x, y),
          }),
        );
        continue;
      }
      return Object.freeze({
        x,
        y,
        z: 0 as const,
        sectorIndex: 100 + ring * 10 + step,
      });
    }
  }

  candidates.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.sectorIndex - right.sectorIndex;
  });
  const best = candidates[0];
  if (best != null) {
    return Object.freeze({
      x: best.x,
      y: best.y,
      z: 0 as const,
      sectorIndex: best.sectorIndex,
    });
  }

  const fallback = EXECUTIVE_THREAD_GATEWAY_SECTORS[0]!;
  return Object.freeze({
    x: fallback.x,
    y: fallback.y,
    z: 0 as const,
    sectorIndex: 0,
  });
}

function stabilizeGateway(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

export type ExecutiveThreadProjectableSubject = Readonly<{
  readonly id: string;
  readonly label: string;
  readonly kind: ExecutiveThreadWorkKind;
  readonly status: string;
  readonly attention: string;
}>;

/**
 * Derive projectable thread subjects from canonical catalog links.
 * Count is never hard-coded — it is the resolved set length.
 */
export function resolveExecutiveThreadProjectableSubjects(input: {
  readonly anchorObjectId: string;
  readonly contextSubjects: readonly {
    readonly id: string;
    readonly label: string;
    readonly kind: string;
    readonly status: string;
    readonly attention: string;
  }[];
  readonly contextLinks: readonly {
    readonly objectId: string;
    readonly contextId: string;
  }[];
}): readonly ExecutiveThreadProjectableSubject[] {
  const linkedIds = new Set(
    input.contextLinks
      .filter((link) => link.objectId === input.anchorObjectId)
      .map((link) => link.contextId),
  );
  const subjects = input.contextSubjects
    .filter(
      (subject) =>
        linkedIds.has(subject.id) && isExecutiveThreadWorkKind(subject.kind),
    )
    .map((subject) =>
      Object.freeze({
        id: subject.id,
        label: subject.label,
        kind: subject.kind as ExecutiveThreadWorkKind,
        status: subject.status,
        attention: subject.attention,
      }),
    )
    .sort((left, right) => {
      const rank =
        EXECUTIVE_THREAD_WORK_KIND_ORDER.indexOf(left.kind) -
        EXECUTIVE_THREAD_WORK_KIND_ORDER.indexOf(right.kind);
      if (rank !== 0) return rank;
      return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
    });
  return Object.freeze(subjects);
}

export function formatExecutiveThreadSubjectLabel(input: {
  readonly label: string;
  readonly kind: ExecutiveThreadWorkKind;
  readonly presentationLevel?: ExecutiveStage2DPresentationClass;
}): Readonly<{
  readonly primaryLine: string;
  readonly secondaryLine: string | null;
}> {
  const formatted = formatExecutiveObjectStageLabel({
    objectName: input.label,
    objectKind: input.kind,
    presentationLevel: input.presentationLevel ?? "minimum",
  });
  // Prefer subject name primary + kind secondary.
  const kindLabel =
    input.kind.charAt(0).toUpperCase() + input.kind.slice(1);
  const primary = formatted.primaryLine.trim();
  const primaryLooksLikeKind =
    primary.toLowerCase() === input.kind ||
    primary.toLowerCase() === kindLabel.toLowerCase();
  if (primaryLooksLikeKind) {
    return Object.freeze({
      primaryLine: input.label.trim() || primary,
      secondaryLine: kindLabel,
    });
  }
  if (formatted.secondaryLine == null) {
    return Object.freeze({
      primaryLine: primary || input.label,
      secondaryLine: kindLabel,
    });
  }
  return Object.freeze({
    primaryLine: primary || input.label,
    secondaryLine: formatted.secondaryLine,
  });
}

export function getExecutiveThreadExpansionObservability(input?: {
  readonly expanded?: boolean;
  readonly anchorObjectId?: string | null;
  readonly threadId?: string | null;
  readonly subjects?: readonly ExecutiveThreadProjectableSubject[];
  readonly selectedSubjectId?: string | null;
  readonly orphanLabelCount?: number;
  readonly clippedObjectCount?: number;
  readonly overlapCount?: number;
  readonly gatewayVisible?: boolean;
  readonly gatewayX?: number | null;
  readonly gatewayY?: number | null;
  readonly gatewayHitTarget?: boolean;
  readonly gatewayOverlapCount?: number;
  readonly gatewayClipped?: boolean;
  readonly gatewayReservedCollisionCount?: number;
  readonly gatewayCount?: number;
}): Readonly<{
  readonly contract: "stage-thread-1";
  readonly fixContract: "stage-thread-1-fix";
  readonly identity: string;
  readonly version: string;
  readonly threadState: "collapsed" | "expanded";
  readonly threadAnchor: string;
  readonly threadId: string;
  readonly subjectCount: string;
  readonly problemCount: string;
  readonly scenarioCount: string;
  readonly decisionCount: string;
  readonly executionCount: string;
  readonly selectedSubjectId: string;
  readonly orphanLabelCount: string;
  readonly clippedObjectCount: string;
  readonly overlapCount: string;
  readonly gatewayState: "collapsed" | "expanded";
  readonly gatewayCount: string;
  readonly gatewayVisible: string;
  readonly gatewayX: string;
  readonly gatewayY: string;
  readonly gatewayHitTarget: string;
  readonly gatewayOverlapCount: string;
  readonly gatewayClipped: string;
  readonly gatewayReservedCollisionCount: string;
}> {
  const subjects = input?.subjects ?? [];
  const countKind = (kind: ExecutiveThreadWorkKind) =>
    subjects.filter((subject) => subject.kind === kind).length;
  const expanded = input?.expanded === true;
  return Object.freeze({
    contract: "stage-thread-1",
    fixContract: "stage-thread-1-fix",
    identity: executiveThreadExpansionIdentity,
    version: executiveThreadExpansionVersion,
    threadState: expanded ? "expanded" : "collapsed",
    threadAnchor: input?.anchorObjectId ?? "none",
    threadId: input?.threadId ?? "none",
    subjectCount: String(subjects.length),
    problemCount: String(countKind("problem")),
    scenarioCount: String(countKind("scenario")),
    decisionCount: String(countKind("decision")),
    executionCount: String(countKind("execution")),
    selectedSubjectId: input?.selectedSubjectId ?? "none",
    orphanLabelCount: String(input?.orphanLabelCount ?? 0),
    clippedObjectCount: String(input?.clippedObjectCount ?? 0),
    overlapCount: String(input?.overlapCount ?? 0),
    gatewayState: expanded ? "expanded" : "collapsed",
    gatewayCount: String(
      input?.gatewayCount ?? (expanded ? 0 : subjects.length),
    ),
    gatewayVisible: String(input?.gatewayVisible ?? !expanded),
    gatewayX:
      input?.gatewayX != null && Number.isFinite(input.gatewayX)
        ? String(input.gatewayX)
        : "none",
    gatewayY:
      input?.gatewayY != null && Number.isFinite(input.gatewayY)
        ? String(input.gatewayY)
        : "none",
    gatewayHitTarget: String(input?.gatewayHitTarget ?? true),
    gatewayOverlapCount: String(input?.gatewayOverlapCount ?? 0),
    gatewayClipped: String(input?.gatewayClipped ?? false),
    gatewayReservedCollisionCount: String(
      input?.gatewayReservedCollisionCount ?? 0,
    ),
  });
}

export function verifyExecutiveThreadExpansion(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly cameraSafe: boolean;
  readonly anchorPreserved: boolean;
  readonly gatewayFootprintLargerThanLegacy: boolean;
}> {
  const identity = getExecutiveThreadExpansionIdentity();
  const gateway = getExecutiveThreadGatewayDiscoverabilityIdentity();
  return Object.freeze({
    ok:
      identity.id ===
        "STAGE-THREAD:1/ExecutiveThreadExpansionDecisionObjectProjection" &&
      identity.version === "5.1.1" &&
      gateway.id ===
        "STAGE-THREAD:1-FIX/ExecutiveThreadGatewayDiscoverability" &&
      EXECUTIVE_THREAD_EXPANSION_BOUNDARY.replacesBusinessAnchor === false &&
      EXECUTIVE_THREAD_EXPANSION_BOUNDARY.movesCamera === false &&
      EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.hitWidth >
        EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.legacyHitSize * 1.5,
    identityValid:
      identity.id ===
        "STAGE-THREAD:1/ExecutiveThreadExpansionDecisionObjectProjection" &&
      gateway.id ===
        "STAGE-THREAD:1-FIX/ExecutiveThreadGatewayDiscoverability",
    cameraSafe: EXECUTIVE_THREAD_EXPANSION_BOUNDARY.movesCamera === false,
    anchorPreserved:
      EXECUTIVE_THREAD_EXPANSION_BOUNDARY.replacesBusinessAnchor === false,
    gatewayFootprintLargerThanLegacy:
      EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.hitWidth >
        EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.legacyHitSize * 1.5 &&
      EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.hitHeight >
        EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.legacyHitSize * 1.2,
  });
}
