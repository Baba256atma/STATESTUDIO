/**
 * STAGE-OBJ:4 — Executive Stage Visual Balance & Final Object Certification.
 *
 * Presentation composition only. Certifies:
 *   ANCHOR → RELATED NEIGHBORHOOD → PERIPHERAL EXECUTIVE CONTEXT
 *
 * Never invents relationships, never moves the camera, never changes semantic Z.
 */

import {
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS,
  type ExecutiveStage2DNeighborhoodClass,
  type ExecutiveStage2DResolvedPosition,
} from "./executiveStage2DTopologyRecomposition.ts";
import { normalizeExecutiveStage2DPosition } from "./executiveStage2DFixedCamera.ts";
import {
  resolveExecutiveStageAngularSector,
  type ExecutiveStageAngularSector,
} from "./executiveObjectLabelRelationshipGrammar.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageVisualBalanceIdentity =
  "STAGE-OBJ:4/ExecutiveStageVisualBalanceFinalObjectCertification" as const;

export const executiveStageVisualBalanceVersion = "4.4.0" as const;

export const executiveStageVisualBalanceNamespace =
  "nexora.spatial-presentation.executive-stage-visual-balance" as const;

export const executiveStageVisualBalancePhase =
  "ExecutiveStageVisualBalanceAndFinalObjectCertification" as const;

export const executiveStageVisualBalanceArchitecturalRole =
  "PresentationOnlyExecutiveStageVisualBalanceComposition" as const;

export type ExecutiveStageVisualBalanceIdentity = {
  readonly id: typeof executiveStageVisualBalanceIdentity;
  readonly version: typeof executiveStageVisualBalanceVersion;
  readonly namespace: typeof executiveStageVisualBalanceNamespace;
  readonly phase: typeof executiveStageVisualBalancePhase;
  readonly architecturalRole: typeof executiveStageVisualBalanceArchitecturalRole;
};

const IDENTITY: ExecutiveStageVisualBalanceIdentity = Object.freeze({
  id: executiveStageVisualBalanceIdentity,
  version: executiveStageVisualBalanceVersion,
  namespace: executiveStageVisualBalanceNamespace,
  phase: executiveStageVisualBalancePhase,
  architecturalRole: executiveStageVisualBalanceArchitecturalRole,
});

export function getExecutiveStageVisualBalanceIdentity(): ExecutiveStageVisualBalanceIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_VISUAL_BALANCE_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageVisualBalanceArchitecturalRole,
  inventsRelationships: false as const,
  changesRelationshipTruth: false as const,
  changesNeighborhoodDepth: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  movesAnchor: false as const,
  createsSecondTopologyEngine: false as const,
  createsSecondMotionEngine: false as const,
});

// ─── Visual roles (presentation only) ───────────────────────────────────────

export type ExecutiveStageVisualRole =
  | "anchor"
  | "related"
  | "peripheral"
  | "context"
  | "hidden";

export const EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET = Object.freeze({
  maxRelated: 6,
  maxPeripheral: 3,
  maxContext: 2,
  overviewVisibleLabelCap: 6,
  overviewPrimaryEdgeCap: 8,
  peripheralMinRadius: 2.85,
  peripheralMaxRadius: 3.35,
  relatedInnerMaxRadius: 2.35,
  orphanLabelMinBodyOpacity: 0.2,
  peripheralBodyOpacityMin: 0.48,
  peripheralBodyOpacityMax: 0.6,
  peripheralScaleMin: 0.7,
  peripheralScaleMax: 0.78,
  relatedBodyOpacityMin: 0.92,
  contextBodyOpacityMax: 0.32,
} as const);

export const EXECUTIVE_STAGE_VISUAL_AUTHORITY = Object.freeze({
  anchor: 1,
  related: 0.82,
  peripheral: 0.55,
  context: 0.28,
  hidden: 0,
} as const);

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Rank important-unrelated candidates from existing executive truth only.
 * Higher = more deserving of peripheral visibility.
 */
export function rankExecutiveStagePeripheralCandidate(input: {
  readonly attention?: string | null;
  readonly status?: string | null;
  readonly recommended?: boolean;
}): number {
  const attention = (input.attention ?? "normal").toLowerCase();
  const status = (input.status ?? "stable").toLowerCase();
  if (attention === "critical" || status === "risk") return 100;
  if (input.recommended === true) return 88;
  if (attention === "important") return 82;
  if (status === "unresolved") return 74;
  if (status === "watch") return 68;
  if (attention === "elevated") return 52;
  return 0;
}

export function isExecutiveStagePeripheralEligible(input: {
  readonly attention?: string | null;
  readonly status?: string | null;
  readonly recommended?: boolean;
}): boolean {
  return rankExecutiveStagePeripheralCandidate(input) > 0;
}

export function mapNeighborhoodClassToVisualRole(
  classification: ExecutiveStage2DNeighborhoodClass | string | undefined,
): ExecutiveStageVisualRole {
  if (classification === "anchor") return "anchor";
  if (classification === "related") return "related";
  if (classification === "peripheral" || classification === "background") {
    return "peripheral";
  }
  if (classification === "secondary") return "context";
  return "hidden";
}

/**
 * Place peripherals in outer band, preferring free sectors.
 */
export function placeExecutiveStagePeripheralSlot(input: {
  readonly objectId: string;
  readonly index: number;
  readonly occupiedSectors?: readonly ExecutiveStageAngularSector[];
  readonly base?: { readonly x: number; readonly y: number };
}): ExecutiveStage2DResolvedPosition {
  const budget = EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET;
  let hash = 0;
  for (let i = 0; i < input.objectId.length; i += 1) {
    hash = (hash * 31 + input.objectId.charCodeAt(i)) >>> 0;
  }
  // STAGE-OBJ:4-FIX — omit pure S; shallow SW/SE only after safer sectors.
  const sectorOrder: ExecutiveStageAngularSector[] = [
    "NE",
    "NW",
    "E",
    "W",
    "N",
    "SW",
    "SE",
  ];
  const occupied = new Set(input.occupiedSectors ?? []);
  const free = sectorOrder.filter((sector) => !occupied.has(sector));
  const pick =
    free[input.index % Math.max(free.length, 1)] ??
    sectorOrder[input.index % sectorOrder.length]!;
  const angleBySector: Record<ExecutiveStageAngularSector, number> = {
    E: 0,
    NE: Math.PI / 4,
    N: Math.PI / 2,
    NW: (3 * Math.PI) / 4,
    W: Math.PI,
    // Shallow south-west / south-east — avoid due-south clip band.
    SW: Math.PI + 0.45,
    S: (3 * Math.PI) / 2,
    SE: -0.45,
  };
  const angle =
    angleBySector[pick] + ((hash % 17) / 17 - 0.5) * 0.18 + input.index * 0.04;
  const radius =
    budget.peripheralMinRadius +
    (input.index % 2) * 0.18 +
    ((hash % 11) / 11) * 0.12;
  const r = clamp(radius, budget.peripheralMinRadius, budget.peripheralMaxRadius);
  // STAGE-OBJ:4-FIX — footprint minY must clear usable.minY (-1.42); half≈0.55.
  const southFloor = -1.42 + 0.55 + 0.06;
  const northCeil = EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxY - 0.2 - 0.55;
  const y = clamp(Math.sin(angle) * r, southFloor, northCeil);
  const x = Math.cos(angle) * r;
  return normalizeExecutiveStage2DPosition({
    x: clamp(x, EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minX, EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxX),
    y: clamp(y, southFloor, northCeil),
    z: 0,
  }) as ExecutiveStage2DResolvedPosition;
}

/**
 * Select top-N peripheral candidates deterministically.
 */
export function selectExecutiveStagePeripheralObjectIds(input: {
  readonly candidates: readonly {
    readonly objectId: string;
    readonly attention?: string | null;
    readonly status?: string | null;
    readonly recommended?: boolean;
  }[];
  readonly excludeIds: ReadonlySet<string>;
  readonly maxPeripheral?: number;
}): readonly string[] {
  const max =
    input.maxPeripheral ?? EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.maxPeripheral;
  const ranked = input.candidates
    .filter((candidate) => !input.excludeIds.has(candidate.objectId))
    .map((candidate) =>
      Object.freeze({
        objectId: candidate.objectId,
        rank: rankExecutiveStagePeripheralCandidate(candidate),
      }),
    )
    .filter((entry) => entry.rank > 0)
    .sort((a, b) => {
      if (b.rank !== a.rank) return b.rank - a.rank;
      return a.objectId < b.objectId ? -1 : a.objectId > b.objectId ? 1 : 0;
    });
  return Object.freeze(ranked.slice(0, max).map((entry) => entry.objectId));
}

export function enforceExecutiveStageNoOrphanLabel(input: {
  readonly bodyOpacity: number;
  readonly labelVisible: boolean;
  readonly disclosureState?: string | null;
}): boolean {
  if (input.disclosureState === "hidden") return false;
  if (
    input.bodyOpacity <
    EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.orphanLabelMinBodyOpacity
  ) {
    return false;
  }
  return input.labelVisible;
}

export type ExecutiveStageVisualBalanceDiagnostic = Readonly<{
  readonly visualCentroidX: number;
  readonly visualCentroidY: number;
  readonly leftRightBalance: number;
  readonly topBottomBalance: number;
  readonly sectorOccupancy: number;
  readonly peripheralOccupancy: number;
  readonly labelDensity: number;
  readonly edgeDensity: number;
  readonly reservedRegionPressure: number;
  readonly orphanLabelCount: number;
  readonly unrelatedVisibleEdgeCount: number;
}>;

export function resolveExecutiveStageVisualBalance(input: {
  readonly positions: Readonly<
    Record<string, { readonly x: number; readonly y: number }>
  >;
  readonly visualRoles: Readonly<Record<string, ExecutiveStageVisualRole>>;
  readonly labelVisibleCount?: number;
  readonly visibleObjectCount?: number;
  readonly primaryEdgeCount?: number;
  readonly secondaryEdgeCount?: number;
  readonly unrelatedVisibleEdgeCount?: number;
  readonly orphanLabelCount?: number;
  readonly reservedRegionCollisionCount?: number;
}): ExecutiveStageVisualBalanceDiagnostic {
  const ids = Object.keys(input.positions).filter(
    (id) => (input.visualRoles[id] ?? "hidden") !== "hidden",
  );
  let sumX = 0;
  let sumY = 0;
  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;
  const sectors = new Set<string>();
  let peripheral = 0;
  for (const id of ids) {
    const position = input.positions[id]!;
    const role = input.visualRoles[id] ?? "hidden";
    const weight =
      role === "anchor"
        ? 3
        : role === "related"
          ? 2
          : role === "peripheral"
            ? 1.2
            : 0.6;
    sumX += position.x * weight;
    sumY += position.y * weight;
    if (position.x < -0.15) left += weight;
    else if (position.x > 0.15) right += weight;
    if (position.y > 0.15) top += weight;
    else if (position.y < -0.15) bottom += weight;
    if (role !== "anchor") {
      sectors.add(resolveExecutiveStageAngularSector(position.x, position.y));
    }
    if (role === "peripheral") peripheral += 1;
  }
  const weightSum = Math.max(
    ids.reduce((sum, id) => {
      const role = input.visualRoles[id] ?? "hidden";
      return (
        sum +
        (role === "anchor"
          ? 3
          : role === "related"
            ? 2
            : role === "peripheral"
              ? 1.2
              : 0.6)
      );
    }, 0),
    1e-6,
  );
  const visible = Math.max(input.visibleObjectCount ?? ids.length, 1);
  return Object.freeze({
    visualCentroidX: stabilize(sumX / weightSum),
    visualCentroidY: stabilize(sumY / weightSum),
    leftRightBalance: stabilize((right - left) / Math.max(right + left, 1)),
    topBottomBalance: stabilize((top - bottom) / Math.max(top + bottom, 1)),
    sectorOccupancy: stabilize(sectors.size / 8),
    peripheralOccupancy: stabilize(
      peripheral / EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.maxPeripheral,
    ),
    labelDensity: stabilize((input.labelVisibleCount ?? 0) / visible),
    edgeDensity: stabilize(
      ((input.primaryEdgeCount ?? 0) + (input.secondaryEdgeCount ?? 0)) /
        visible,
    ),
    reservedRegionPressure: stabilize(input.reservedRegionCollisionCount ?? 0),
    orphanLabelCount: input.orphanLabelCount ?? 0,
    unrelatedVisibleEdgeCount: input.unrelatedVisibleEdgeCount ?? 0,
  });
}

/**
 * Count rendered edges between anchor and a peripheral object — must be 0
 * unless a canonical edge exists (caller supplies canonical count).
 */
export function countAnchorPeripheralRenderedEdges(input: {
  readonly anchorObjectId: string;
  readonly peripheralObjectId: string;
  readonly renderedConnections: readonly {
    readonly sourceId: string;
    readonly targetId: string;
    readonly visualRole?: string | null;
    readonly opacity?: number;
  }[];
  readonly canonicalEdgeExists: boolean;
}): number {
  const rendered = input.renderedConnections.filter((connection) => {
    if ((connection.visualRole ?? "") === "hidden") return false;
    if ((connection.opacity ?? 0) <= 0) return false;
    const touches =
      (connection.sourceId === input.anchorObjectId &&
        connection.targetId === input.peripheralObjectId) ||
      (connection.targetId === input.anchorObjectId &&
        connection.sourceId === input.peripheralObjectId);
    return touches;
  }).length;
  if (!input.canonicalEdgeExists) return rendered;
  // Canonical related objects are not peripheral — still report rendered count.
  return rendered;
}

export function getExecutiveStageVisualBalanceObservability(input?: {
  readonly anchorCount?: number;
  readonly relatedCount?: number;
  readonly peripheralCount?: number;
  readonly contextCount?: number;
  readonly hiddenCount?: number;
  readonly orphanLabelCount?: number;
  readonly hardOverlapCount?: number;
  readonly minGap?: number;
  readonly primaryEdgeCount?: number;
  readonly secondaryEdgeCount?: number;
  readonly unrelatedVisibleEdgeCount?: number;
  readonly visualCentroidX?: number;
  readonly visualCentroidY?: number;
  readonly sectorCompression?: number;
  readonly reservedRegionCollisionCount?: number;
}): Readonly<{
  readonly contract: "stage-obj-4";
  readonly identity: string;
  readonly version: string;
  readonly anchorCount: string;
  readonly relatedCount: string;
  readonly peripheralCount: string;
  readonly contextCount: string;
  readonly hiddenCount: string;
  readonly orphanLabelCount: string;
  readonly hardOverlapCount: string;
  readonly minGap: string;
  readonly primaryEdgeCount: string;
  readonly secondaryEdgeCount: string;
  readonly unrelatedVisibleEdgeCount: string;
  readonly visualCentroidX: string;
  readonly visualCentroidY: string;
  readonly sectorCompression: string;
  readonly reservedRegionCollisionCount: string;
}> {
  return Object.freeze({
    contract: "stage-obj-4",
    identity: executiveStageVisualBalanceIdentity,
    version: executiveStageVisualBalanceVersion,
    anchorCount: String(input?.anchorCount ?? 0),
    relatedCount: String(input?.relatedCount ?? 0),
    peripheralCount: String(input?.peripheralCount ?? 0),
    contextCount: String(input?.contextCount ?? 0),
    hiddenCount: String(input?.hiddenCount ?? 0),
    orphanLabelCount: String(input?.orphanLabelCount ?? 0),
    hardOverlapCount: String(input?.hardOverlapCount ?? 0),
    minGap: String(input?.minGap ?? 0),
    primaryEdgeCount: String(input?.primaryEdgeCount ?? 0),
    secondaryEdgeCount: String(input?.secondaryEdgeCount ?? 0),
    unrelatedVisibleEdgeCount: String(input?.unrelatedVisibleEdgeCount ?? 0),
    visualCentroidX: (input?.visualCentroidX ?? 0).toFixed(3),
    visualCentroidY: (input?.visualCentroidY ?? 0).toFixed(3),
    sectorCompression: (input?.sectorCompression ?? 0).toFixed(3),
    reservedRegionCollisionCount: String(
      input?.reservedRegionCollisionCount ?? 0,
    ),
  });
}

export function verifyExecutiveStageVisualBalance(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly relationshipTruthSafe: boolean;
  readonly anchorImmutable: boolean;
}> {
  const identity = getExecutiveStageVisualBalanceIdentity();
  return Object.freeze({
    ok:
      identity.id ===
        "STAGE-OBJ:4/ExecutiveStageVisualBalanceFinalObjectCertification" &&
      identity.version === "4.4.0" &&
      EXECUTIVE_STAGE_VISUAL_BALANCE_BOUNDARY.inventsRelationships === false &&
      EXECUTIVE_STAGE_VISUAL_BALANCE_BOUNDARY.movesAnchor === false,
    identityValid:
      identity.id ===
      "STAGE-OBJ:4/ExecutiveStageVisualBalanceFinalObjectCertification",
    relationshipTruthSafe:
      EXECUTIVE_STAGE_VISUAL_BALANCE_BOUNDARY.changesRelationshipTruth === false,
    anchorImmutable: EXECUTIVE_STAGE_VISUAL_BALANCE_BOUNDARY.movesAnchor === false,
  });
}
