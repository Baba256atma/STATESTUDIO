/**
 * STAGE-OBJ:3 — Label & Relationship Readability Grammar.
 *
 * Objects first. Relationships second. Labels clarify, never dominate.
 *
 * Presentation only — never changes topology truth, relationships,
 * semantic Z, camera, Deep-Z, or object geometry contracts.
 */

import {
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS,
  type ExecutiveStage2DNeighborhoodClass,
  type ExecutiveStage2DResolvedPosition,
} from "./executiveStage2DTopologyRecomposition.ts";
import { normalizeExecutiveStage2DPosition } from "./executiveStage2DFixedCamera.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectLabelRelationshipGrammarIdentity =
  "STAGE-OBJ:3/ExecutiveObjectLabelRelationshipReadabilityGrammar" as const;

export const executiveObjectLabelRelationshipGrammarVersion = "4.3.0" as const;

export const executiveObjectLabelRelationshipGrammarNamespace =
  "nexora.spatial-presentation.executive-object-label-relationship-grammar" as const;

export const executiveObjectLabelRelationshipGrammarPhase =
  "LabelAndRelationshipReadabilityGrammar" as const;

export const executiveObjectLabelRelationshipGrammarArchitecturalRole =
  "PresentationOnlyLabelRelationshipReadability" as const;

export type ExecutiveObjectLabelRelationshipGrammarIdentity = {
  readonly id: typeof executiveObjectLabelRelationshipGrammarIdentity;
  readonly version: typeof executiveObjectLabelRelationshipGrammarVersion;
  readonly namespace: typeof executiveObjectLabelRelationshipGrammarNamespace;
  readonly phase: typeof executiveObjectLabelRelationshipGrammarPhase;
  readonly architecturalRole: typeof executiveObjectLabelRelationshipGrammarArchitecturalRole;
};

const IDENTITY: ExecutiveObjectLabelRelationshipGrammarIdentity = Object.freeze({
  id: executiveObjectLabelRelationshipGrammarIdentity,
  version: executiveObjectLabelRelationshipGrammarVersion,
  namespace: executiveObjectLabelRelationshipGrammarNamespace,
  phase: executiveObjectLabelRelationshipGrammarPhase,
  architecturalRole: executiveObjectLabelRelationshipGrammarArchitecturalRole,
});

export function getExecutiveObjectLabelRelationshipGrammarIdentity(): ExecutiveObjectLabelRelationshipGrammarIdentity {
  return IDENTITY;
}

export const EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY = Object.freeze({
  architecturalRole: executiveObjectLabelRelationshipGrammarArchitecturalRole,
  changesSemanticZ: false as const,
  movesCamera: false as const,
  inventsRelationships: false as const,
  changesRelationshipTruth: false as const,
  bypassesHardSeparation: false as const,
  changesNeighborhoodDepth: false as const,
});

// ─── Tokens ─────────────────────────────────────────────────────────────────

export type ExecutiveLabelPlacementSide =
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

export type ExecutiveLabelVisibilityClass =
  | "full"
  | "compact"
  | "minimal"
  | "hidden";

export type ExecutiveStageAngularSector =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW";

export const EXECUTIVE_STAGE_LABEL_SECTOR_ORDER = Object.freeze([
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
] as const satisfies readonly ExecutiveStageAngularSector[]);

export const EXECUTIVE_STAGE_SECTOR_BREATHING = Object.freeze({
  /** Minimum angular separation between related peers (radians). */
  minAngularSeparation: Math.PI / 5,
  /** Max radial scale applied while breathing. */
  maxRadiusScale: 1.18,
  /** Soft push iterations. */
  maxIterations: 8,
  /** Detect origin-collinear stacks (vertical/horizontal chains). */
  collinearSin2Threshold: 0.42,
  enabled: true,
} as const);

/** World-space label offset from placement side (object-local). */
export function resolveExecutiveLabelWorldOffset(
  side: ExecutiveLabelPlacementSide,
  distance: number,
): Readonly<{ readonly x: number; readonly y: number }> {
  const d = Math.max(0.2, distance);
  switch (side) {
    case "top":
      return Object.freeze({ x: 0, y: d });
    case "top-right":
      return Object.freeze({ x: d * 0.78, y: d * 0.78 });
    case "right":
      return Object.freeze({ x: d, y: 0 });
    case "bottom-right":
      return Object.freeze({ x: d * 0.78, y: -d * 0.78 });
    case "bottom":
      return Object.freeze({ x: 0, y: -d });
    case "bottom-left":
      return Object.freeze({ x: -d * 0.78, y: -d * 0.78 });
    case "left":
      return Object.freeze({ x: -d, y: 0 });
    case "top-left":
      return Object.freeze({ x: -d * 0.78, y: d * 0.78 });
    default:
      return Object.freeze({ x: 0, y: d });
  }
}


export const EXECUTIVE_STAGE_LABEL_SECTOR_TO_SIDE: Readonly<
  Record<ExecutiveStageAngularSector, ExecutiveLabelPlacementSide>
> = Object.freeze({
  N: "top",
  NE: "top-right",
  E: "right",
  SE: "bottom-right",
  S: "bottom",
  SW: "bottom-left",
  W: "left",
  NW: "top-left",
});

/** Screen-space step directions for collision (x right, y down). */
export const EXECUTIVE_STAGE_LABEL_SIDE_OFFSET_STEPS: Readonly<
  Record<ExecutiveLabelPlacementSide, readonly [number, number][]>
> = Object.freeze({
  top: Object.freeze([
    [0, -1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
  ]),
  "top-right": Object.freeze([
    [1, -1],
    [1, 0],
    [0, -1],
    [1, 1],
    [-1, -1],
    [0, 1],
  ]),
  right: Object.freeze([
    [1, 0],
    [1, -1],
    [1, 1],
    [0, -1],
    [0, 1],
    [-1, 0],
  ]),
  "bottom-right": Object.freeze([
    [1, 1],
    [1, 0],
    [0, 1],
    [1, -1],
    [-1, 1],
    [0, -1],
  ]),
  bottom: Object.freeze([
    [0, 1],
    [1, 1],
    [-1, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
  ]),
  "bottom-left": Object.freeze([
    [-1, 1],
    [-1, 0],
    [0, 1],
    [-1, -1],
    [1, 1],
    [0, -1],
  ]),
  left: Object.freeze([
    [-1, 0],
    [-1, -1],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, 0],
  ]),
  "top-left": Object.freeze([
    [-1, -1],
    [-1, 0],
    [0, -1],
    [-1, 1],
    [1, -1],
    [0, 1],
  ]),
});

export const EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE = Object.freeze({
  primaryOpacityCap: 0.48,
  primaryLineWidthCap: 1.15,
  secondaryOpacityCap: 0.22,
  secondaryLineWidthCap: 0.9,
  backgroundOpacityCap: 0.08,
  backgroundLineWidthCap: 0.75,
} as const);

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeAngle(radians: number): number {
  let a = radians;
  while (a <= -Math.PI) a += Math.PI * 2;
  while (a > Math.PI) a -= Math.PI * 2;
  return a;
}

function angularDelta(a: number, b: number): number {
  return Math.abs(normalizeAngle(a - b));
}

/**
 * atan2(y, x) with Stage Y-up → sector id.
 * N = +Y, E = +X.
 */
export function resolveExecutiveStageAngularSector(
  x: number,
  y: number,
): ExecutiveStageAngularSector {
  if (!Number.isFinite(x) || !Number.isFinite(y) || (x === 0 && y === 0)) {
    return "N";
  }
  const angle = Math.atan2(y, x); // -PI..PI, 0 = +X
  // Map to 8 sectors centered on cardinals.
  const deg = ((angle * 180) / Math.PI + 360) % 360;
  if (deg >= 337.5 || deg < 22.5) return "E";
  if (deg < 67.5) return "NE";
  if (deg < 112.5) return "N";
  if (deg < 157.5) return "NW";
  if (deg < 202.5) return "W";
  if (deg < 247.5) return "SW";
  if (deg < 292.5) return "S";
  return "SE";
}

export function resolveExecutiveLabelPlacementSideForSector(
  sector: ExecutiveStageAngularSector,
): ExecutiveLabelPlacementSide {
  return EXECUTIVE_STAGE_LABEL_SECTOR_TO_SIDE[sector];
}

/**
 * Presentation-only label formatter.
 * Cleans redundant kind prefixes without mutating semantic names.
 */
export function formatExecutiveObjectStageLabel(input: {
  readonly objectName: string;
  readonly objectKind?: string | null;
  readonly stateText?: string | null;
  readonly presentationLevel?: "minimum" | "report" | "operation";
}): Readonly<{
  readonly primaryLine: string;
  readonly secondaryLine: string | null;
  readonly cleanedKindPrefix: boolean;
}> {
  const raw = (input.objectName ?? "").trim();
  const kind = (input.objectKind ?? "").trim().toLowerCase();
  let cleaned = raw;
  let cleanedKindPrefix = false;

  const kindTokens = [
    "scenario",
    "decision",
    "problem",
    "execution",
    "risk",
    "goal",
    "object",
  ];
  for (const token of kindTokens) {
    if (kind && kind !== token && !kind.includes(token)) continue;
    const patterns = [
      new RegExp(`^${token}\\s*[:·\\-]\\s*${token}\\s*[:·\\-]\\s*`, "i"),
      new RegExp(`^${token}\\s*[:·\\-]\\s*`, "i"),
      new RegExp(`^${token}\\s+${token}\\s+`, "i"),
      new RegExp(`^${token}\\s*·\\s*${token}\\s*·\\s*`, "i"),
    ];
    for (const pattern of patterns) {
      if (pattern.test(cleaned)) {
        cleaned = cleaned.replace(pattern, "").trim();
        cleanedKindPrefix = true;
      }
    }
  }

  // Collapse repeated "WORD · WORD" at start.
  const repeated = cleaned.match(/^([A-Za-z][A-Za-z0-9\- ]{1,24})\s*·\s*\1\b/i);
  if (repeated) {
    cleaned = cleaned.replace(repeated[0], repeated[1]!).trim();
    cleanedKindPrefix = true;
  }

  if (!cleaned) cleaned = raw;
  const primaryLine = cleaned.toUpperCase();
  const secondaryLine = input.stateText?.trim()
    ? input.stateText.trim().toLowerCase()
    : null;

  return Object.freeze({
    primaryLine,
    secondaryLine,
    cleanedKindPrefix,
  });
}

export function resolveExecutiveLabelVisibilityClass(input: {
  readonly focused?: boolean;
  readonly role?: string | null;
  readonly presentationLevel?: "minimum" | "report" | "operation";
  readonly overview?: boolean;
}): ExecutiveLabelVisibilityClass {
  if (input.focused) return "full";
  if (input.role === "related") {
    return input.presentationLevel === "minimum" ? "compact" : "full";
  }
  if (input.role === "peripheral") {
    return input.presentationLevel === "operation" ? "compact" : "minimal";
  }
  if (input.role === "unrelated" || input.role === "background") {
    return input.overview ? "minimal" : "hidden";
  }
  if (input.role === "context") return "minimal";
  return input.overview ? "compact" : "full";
}

/**
 * STAGE-OBJ:3 sector breathing — presentation XY only.
 * Spreads related peers that collapse into a narrow angular band.
 * Anchor stays at (0,0,0). Must still pass hard-separation afterward.
 */
export function applyExecutiveStageSectorBreathing(input: {
  readonly positions: Readonly<
    Record<string, ExecutiveStage2DResolvedPosition>
  >;
  readonly relatedObjectIds: readonly string[];
  readonly anchorObjectId: string;
  readonly classifications: Readonly<
    Record<string, ExecutiveStage2DNeighborhoodClass>
  >;
}): Readonly<{
  readonly positions: Readonly<
    Record<string, ExecutiveStage2DResolvedPosition>
  >;
  readonly sectorCompression: number;
  readonly adjustedCount: number;
}> {
  if (!EXECUTIVE_STAGE_SECTOR_BREATHING.enabled) {
    return Object.freeze({
      positions: input.positions,
      sectorCompression: 0,
      adjustedCount: 0,
    });
  }

  const related = [...input.relatedObjectIds]
    .filter((id) => id !== input.anchorObjectId)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  if (related.length < 2) {
    return Object.freeze({
      positions: input.positions,
      sectorCompression: 0,
      adjustedCount: 0,
    });
  }

  type Peer = {
    id: string;
    angle: number;
    radius: number;
  };

  const peers: Peer[] = related.map((id) => {
    const position = input.positions[id]!;
    const angle = Math.atan2(position.y, position.x);
    const radius = Math.max(0.01, Math.hypot(position.x, position.y));
    return { id, angle, radius };
  });

  // Measure compression: tight angular pairs + origin-collinear stacks.
  let tightPairs = 0;
  let pairCount = 0;
  for (let i = 0; i < peers.length; i += 1) {
    for (let j = i + 1; j < peers.length; j += 1) {
      pairCount += 1;
      if (
        angularDelta(peers[i]!.angle, peers[j]!.angle) <
        EXECUTIVE_STAGE_SECTOR_BREATHING.minAngularSeparation
      ) {
        tightPairs += 1;
      }
    }
  }
  const tightFraction = pairCount === 0 ? 0 : tightPairs / pairCount;
  // sin(2θ)≈0 for axis-aligned / opposite-sector chains through the origin.
  const collinearScore =
    peers.reduce((sum, peer) => sum + Math.abs(Math.sin(2 * peer.angle)), 0) /
    peers.length;
  const collinearStack =
    peers.length >= 2 &&
    collinearScore < EXECUTIVE_STAGE_SECTOR_BREATHING.collinearSin2Threshold;
  const sectorCompression = Math.max(
    tightFraction,
    collinearStack ? 0.85 : 0,
  );
  if (sectorCompression <= 0) {
    return Object.freeze({
      positions: input.positions,
      sectorCompression: 0,
      adjustedCount: 0,
    });
  }

  // Sort by identity, then redistribute angles evenly while preserving mean radius.
  const ordered = [...peers].sort((a, b) =>
    a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
  );
  // Deterministic sector fan: start east of mean, never pile on one axis.
  const meanAngle =
    ordered.reduce((sum, peer) => sum + peer.angle, 0) / ordered.length;
  const base = normalizeAngle(meanAngle - ((ordered.length - 1) * Math.PI) / ordered.length);
  const step =
    ordered.length === 2
      ? Math.PI * 0.72
      : (Math.PI * 2) / ordered.length;
  const nextPositions: Record<string, ExecutiveStage2DResolvedPosition> = {
    ...input.positions,
  };
  let adjustedCount = 0;

  ordered.forEach((peer, index) => {
    const targetAngle = normalizeAngle(base + step * index);
    const radius = clamp(
      peer.radius *
        (1 +
          0.1 *
            sectorCompression *
            EXECUTIVE_STAGE_SECTOR_BREATHING.maxRadiusScale),
      EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minX + 0.2,
      Math.min(
        EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxX,
        EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxY,
      ) - 0.15,
    );
    const x = stabilize(Math.cos(targetAngle) * radius);
    const y = stabilize(Math.sin(targetAngle) * radius);
    const clamped = normalizeExecutiveStage2DPosition({ x, y, z: 0 });
    nextPositions[peer.id] = clamped as ExecutiveStage2DResolvedPosition;
    if (
      Math.hypot(
        clamped.x - input.positions[peer.id]!.x,
        clamped.y - input.positions[peer.id]!.y,
      ) > 0.02
    ) {
      adjustedCount += 1;
    }
  });

  // Anchor immutable.
  nextPositions[input.anchorObjectId] = normalizeExecutiveStage2DPosition({
    x: 0,
    y: 0,
    z: 0,
  }) as ExecutiveStage2DResolvedPosition;

  return Object.freeze({
    positions: Object.freeze(nextPositions),
    sectorCompression: stabilize(sectorCompression),
    adjustedCount,
  });
}

type ExecutiveStageLabelObservabilitySnapshot = Readonly<{
  labelVisibleCount: number;
  labelHiddenCount: number;
  labelCollisionCount: number;
  labelOverflowCount: number;
  primaryEdgeCount: number;
  secondaryEdgeCount: number;
  edgeLabelCollisionCount: number;
  sectorCompression: number;
}>;

let lastLabelObservability: ExecutiveStageLabelObservabilitySnapshot =
  Object.freeze({
    labelVisibleCount: 0,
    labelHiddenCount: 0,
    labelCollisionCount: 0,
    labelOverflowCount: 0,
    primaryEdgeCount: 0,
    secondaryEdgeCount: 0,
    edgeLabelCollisionCount: 0,
    sectorCompression: 0,
  });

/** Runtime diagnostics publish (no visible debug UI). */
export function publishExecutiveStageLabelObservability(
  input: Partial<ExecutiveStageLabelObservabilitySnapshot>,
): void {
  lastLabelObservability = Object.freeze({
    ...lastLabelObservability,
    ...input,
  });
}

export function readExecutiveStageLabelObservability(): ExecutiveStageLabelObservabilitySnapshot {
  return lastLabelObservability;
}

export function getExecutiveObjectLabelRelationshipObservability(input?: {
  readonly labelVisibleCount?: number;
  readonly labelHiddenCount?: number;
  readonly labelCollisionCount?: number;
  readonly labelOverflowCount?: number;
  readonly primaryEdgeCount?: number;
  readonly secondaryEdgeCount?: number;
  readonly edgeLabelCollisionCount?: number;
  readonly sectorCompression?: number;
}): Readonly<{
  readonly contract: "stage-obj-3";
  readonly identity: string;
  readonly version: string;
  readonly labelVisibleCount: string;
  readonly labelHiddenCount: string;
  readonly labelCollisionCount: string;
  readonly labelOverflowCount: string;
  readonly primaryEdgeCount: string;
  readonly secondaryEdgeCount: string;
  readonly edgeLabelCollisionCount: string;
  readonly sectorCompression: string;
}> {
  const snapshot = readExecutiveStageLabelObservability();
  return Object.freeze({
    contract: "stage-obj-3",
    identity: executiveObjectLabelRelationshipGrammarIdentity,
    version: executiveObjectLabelRelationshipGrammarVersion,
    labelVisibleCount: String(
      input?.labelVisibleCount ?? snapshot.labelVisibleCount,
    ),
    labelHiddenCount: String(
      input?.labelHiddenCount ?? snapshot.labelHiddenCount,
    ),
    labelCollisionCount: String(
      input?.labelCollisionCount ?? snapshot.labelCollisionCount,
    ),
    labelOverflowCount: String(
      input?.labelOverflowCount ?? snapshot.labelOverflowCount,
    ),
    primaryEdgeCount: String(
      input?.primaryEdgeCount ?? snapshot.primaryEdgeCount,
    ),
    secondaryEdgeCount: String(
      input?.secondaryEdgeCount ?? snapshot.secondaryEdgeCount,
    ),
    edgeLabelCollisionCount: String(
      input?.edgeLabelCollisionCount ?? snapshot.edgeLabelCollisionCount,
    ),
    sectorCompression: (
      input?.sectorCompression ?? snapshot.sectorCompression
    ).toFixed(3),
  });
}

/**
 * Conceptual STAGE-OBJ:3 label grammar entry — placement + visibility class.
 * Content density remains in SP:2.5; this owns sector placement authority.
 */
export function resolveExecutiveObjectLabelGrammarPresentation(input: {
  readonly objectX: number;
  readonly objectY: number;
  readonly focused?: boolean;
  readonly role?: string | null;
  readonly presentationLevel?: "minimum" | "report" | "operation";
  readonly overview?: boolean;
}): Readonly<{
  readonly placementSide: ExecutiveLabelPlacementSide;
  readonly sector: ExecutiveStageAngularSector;
  readonly visibilityClass: ExecutiveLabelVisibilityClass;
  readonly collisionPriority: number;
}> {
  const sector = input.focused
    ? ("N" as const)
    : resolveExecutiveStageAngularSector(input.objectX, input.objectY);
  const placementSide = input.focused
    ? ("top" as const)
    : resolveExecutiveLabelPlacementSideForSector(sector);
  const visibilityClass = resolveExecutiveLabelVisibilityClass(input);
  const collisionPriority = input.focused
    ? 100
    : input.role === "related"
      ? 80
      : input.role === "context" || input.role === "secondary"
        ? 40
        : 20;
  return Object.freeze({
    placementSide,
    sector,
    visibilityClass,
    collisionPriority,
  });
}

export function verifyExecutiveObjectLabelRelationshipGrammar(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly semanticZSafe: boolean;
  readonly relationshipTruthSafe: boolean;
}> {
  const identity = getExecutiveObjectLabelRelationshipGrammarIdentity();
  return Object.freeze({
    ok:
      identity.id ===
        "STAGE-OBJ:3/ExecutiveObjectLabelRelationshipReadabilityGrammar" &&
      identity.version === "4.3.0" &&
      EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY.changesSemanticZ ===
        false &&
      EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY.inventsRelationships ===
        false,
    identityValid:
      identity.id ===
      "STAGE-OBJ:3/ExecutiveObjectLabelRelationshipReadabilityGrammar",
    semanticZSafe:
      EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY.changesSemanticZ ===
      false,
    relationshipTruthSafe:
      EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY.changesRelationshipTruth ===
      false,
  });
}
