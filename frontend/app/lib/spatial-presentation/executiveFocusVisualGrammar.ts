/**
 * SP:4.1C — Executive Focus Visual Grammar & Object Separation.
 *
 * Presentation layer that governs HOW disclosed Stage subjects coexist after
 * SP:4.1B Disclosure (WHAT) and SP:4.1 Topology (WHERE).
 *
 * Disclosure = WHAT. Topology = WHERE. Visual Grammar = HOW.
 * Never invents business truth. Never solves overlap by Z-hiding alone.
 *
 * Human-signoff calibration: final rendered silhouette is the acceptance
 * boundary. Downstream choreography must not undo calibrated positions —
 * applyExecutiveFocusVisualGrammarToStagePresentation is followed by
 * SP:4.2 applyExecutivePresentationPlaneToStagePresentation.
 */

import {
  EXECUTIVE_FOCUS_ANCHOR_TARGET,
  type ExecutiveCameraVector,
} from "./executiveCameraFoundation.ts";
import { projectExecutiveWorldPointToNdc } from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET,
  type ExecutiveFocusDisclosureState,
  type ExecutiveFocusPresentationDepth,
  type ExecutiveWorkKind,
} from "./executiveFocusSceneDisclosure.ts";
import {
  EXECUTIVE_LIGHTING_EMPHASIS_PROFILES,
  resolveExecutiveLightingEmphasis,
} from "./executiveLightingHierarchy.ts";
import {
  resolveExecutiveObjectGeometryFamily,
  type ExecutiveObjectDimensions,
  type ExecutiveObjectGeometryFamily,
} from "./executiveObjectGeometryLanguage.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  applyExecutiveSpatialUiOverlaySafeCorrection,
  clampExecutiveSpatialVector,
  type ExecutiveSpatialCompositionBounds,
  type ExecutiveSpatialVector,
} from "./executiveSpatialComposition.ts";
import {
  EXECUTIVE_FOCUS_HUB_SECTOR_POLICY,
  allocateExecutiveFocusHubSectors,
  type ExecutiveFocusHubSectorAssignment,
} from "./executiveFocusHubProjectedSectors.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveFocusVisualGrammarIdentity =
  "SP:4.1C/ExecutiveFocusVisualGrammar" as const;

export const executiveFocusVisualGrammarVersion = "4.1.2" as const;

export const executiveFocusVisualGrammarNamespace =
  "nexora.spatial-presentation.executive-focus-visual-grammar" as const;

export const executiveFocusVisualGrammarPhase =
  "ExecutiveFocusVisualGrammar" as const;

export const executiveFocusVisualGrammarArchitecturalRole =
  "PresentationOnlyExecutiveFocusVisualGrammar" as const;

export const executiveFocusVisualGrammarReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveFocusVisualGrammarIdentity = {
  readonly id: typeof executiveFocusVisualGrammarIdentity;
  readonly version: typeof executiveFocusVisualGrammarVersion;
  readonly namespace: typeof executiveFocusVisualGrammarNamespace;
  readonly phase: typeof executiveFocusVisualGrammarPhase;
  readonly architecturalRole: typeof executiveFocusVisualGrammarArchitecturalRole;
};

const GRAMMAR_IDENTITY: ExecutiveFocusVisualGrammarIdentity = Object.freeze({
  id: executiveFocusVisualGrammarIdentity,
  version: executiveFocusVisualGrammarVersion,
  namespace: executiveFocusVisualGrammarNamespace,
  phase: executiveFocusVisualGrammarPhase,
  architecturalRole: executiveFocusVisualGrammarArchitecturalRole,
});

export function getExecutiveFocusVisualGrammarIdentity(): ExecutiveFocusVisualGrammarIdentity {
  return GRAMMAR_IDENTITY;
}

export const EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY = Object.freeze({
  architecturalRole: executiveFocusVisualGrammarArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsAdvisorState: false as const,
  ownsCanonicalRelationships: false as const,
  inventsRelationships: false as const,
  ownsFocusSemantics: false as const,
  ownsAttentionTruth: false as const,
  ownsDisclosureMembership: false as const,
  replacesTopologyAuthority: false as const,
  replacesLightingHierarchy: false as const,
  solvesOverlapViaZOnly: false as const,
  usesPhysicsEngine: false as const,
  usesForceSimulation: false as const,
  usesPerFrameSolver: false as const,
  activatesHybridTopology: false as const,
  presentationOnly: true as const,
});

// ─── Tokens ─────────────────────────────────────────────────────────────────

export type ExecutiveVisualGrammarRole =
  | "primary"
  | "elevated"
  | "related"
  | "background"
  | "executive-thread"
  | "collapsed-thread";

export type ExecutiveVisualGrammarFamily =
  | "business-object"
  | "executive-work"
  | "collapsed-thread";

export const EXECUTIVE_FOCUS_VISUAL_SCALE = Object.freeze({
  primary: 1,
  elevated: 0.86,
  related: 0.76,
  background: 0.62,
  executiveThread: 0.68,
  /** Collapsed thread is a subordinate marker — not a peer Stage object. */
  collapsedThread: 0.38,
  maximumPrimary: 1.06,
  minimumReadable: 0.48,
});

export const EXECUTIVE_FOCUS_VISUAL_SEPARATION = Object.freeze({
  /**
   * Perceived-gap calibration — accounts for edge wireframe (~1.14–1.25)
   * and focus pedestal rings that extend beyond canonical mesh AABB.
   */
  silhouetteExtentScale: 1.18,
  minimumWorldGap: 0.42,
  focusWhitespaceGap: 0.62,
  minimumProjectedGapNdc: 0.045,
  maxPrimaryScreenOccupancy: 0.18,
  maxCalibrationPasses: 6,
  maxPairNudge: 0.72,
  hubDensityAllowance: 0.28,
  hubRadiusMin: 1.85,
  hubRadiusMax: 2.95,
  minHubAngularSeparationRad: (48 * Math.PI) / 180,
  collapsedThreadOrbitFactor: 1.12,
  collapsedThreadMajorRadius: 0.14,
  collapsedThreadTubeRadius: 0.035,
  threadLateralOffset: 2.15,
  threadStepY: 0.22,
  threadStepZ: 0.95,
  threadBaseY: 0.42,
  threadBaseZ: -0.55,
  aspect: 16 / 9,
});

export const EXECUTIVE_FOCUS_VISUAL_GRAMMAR_COMPLEXITY = Object.freeze({
  usesPhysicsEngine: false as const,
  usesForceSimulation: false as const,
  perFrameRecalculation: false as const,
  maximumCalibrationPasses: 6 as const,
  maximumPairChecksPerPass: 64 as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveStageObjectBounds = {
  readonly subjectId: string;
  readonly geometryFamily: ExecutiveObjectGeometryFamily;
  readonly dimensions: ExecutiveObjectDimensions;
  readonly scale: number;
  readonly halfWidth: number;
  readonly halfHeight: number;
  readonly halfDepth: number;
  readonly footprintRadius: number;
  readonly boundingRadius: number;
  /** Includes wireframe/edge extent — used for perceived separation. */
  readonly silhouetteExtentScale: number;
  readonly effectiveFootprintRadius: number;
  readonly effectiveBoundingRadius: number;
};

export type ExecutiveFocusVisualGrammarSubjectInput = {
  readonly subjectId: string;
  readonly label: string;
  readonly family: ExecutiveVisualGrammarFamily;
  readonly objectKind?: string;
  readonly workKind?: ExecutiveWorkKind | "executive-thread";
  readonly disclosureState?: ExecutiveFocusDisclosureState | "visible-primary";
  readonly roleHint?:
    | "focused"
    | "related"
    | "unrelated"
    | "context"
    | "collapsed-thread"
    | "source-anchor"
    | "normal";
  readonly attention?: string;
  readonly status?: string;
  readonly position: readonly [number, number, number];
  readonly scale?: number;
  readonly participatesInSeparation?: boolean;
};

export type ExecutiveFocusVisualLabelPresentation = {
  readonly hierarchy:
    | "primary"
    | "related"
    | "background"
    | "executive-thread"
    | "collapsed-thread";
  readonly prominence: "full" | "reduced" | "minimal";
  readonly primaryLine: string;
  readonly secondaryLine: string | null;
  readonly showStatus: boolean;
  readonly suppressible: boolean;
  readonly neverSuppress: boolean;
};

export type ExecutiveFocusVisualGrammarSubjectResult = {
  readonly subjectId: string;
  readonly family: ExecutiveVisualGrammarFamily;
  readonly visualRole: ExecutiveVisualGrammarRole;
  readonly scale: number;
  readonly targetPosition: readonly [number, number, number];
  readonly bounds: ExecutiveStageObjectBounds;
  readonly label: ExecutiveFocusVisualLabelPresentation;
  readonly inBusinessNetwork: boolean;
  readonly inExecutiveThread: boolean;
  readonly hubSectorId?: string;
  /** Extra world-Y clearance so primary labels clear focused silhouette. */
  readonly labelAnchorBoost: number;
};

export type ResolveExecutiveFocusVisualGrammarInput = {
  readonly subjects: readonly ExecutiveFocusVisualGrammarSubjectInput[];
  readonly focusedSubjectId?: string | null;
  readonly presentationDepth: ExecutiveFocusPresentationDepth;
  readonly mode: "overview" | "focus";
  readonly cameraPosition?: ExecutiveCameraVector;
  readonly cameraTarget?: ExecutiveCameraVector;
  readonly cameraFov?: number;
  readonly bounds?: ExecutiveSpatialCompositionBounds;
};

export type ExecutiveFocusVisualGrammarResult = {
  readonly identity: typeof executiveFocusVisualGrammarIdentity;
  readonly version: typeof executiveFocusVisualGrammarVersion;
  readonly subjects: readonly ExecutiveFocusVisualGrammarSubjectResult[];
  readonly byId: ReadonlyMap<string, ExecutiveFocusVisualGrammarSubjectResult>;
  readonly hubRadius: number;
  readonly calibrationPasses: number;
  readonly separationSatisfied: boolean;
  readonly projectedSeparationSatisfied: boolean;
  readonly focusWhitespaceSatisfied: boolean;
  readonly usedZOnlyEscape: false;
  readonly hubSectorAssignments: readonly ExecutiveFocusHubSectorAssignment[];
  readonly hubDegenerateRedistributed: boolean;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function gapSatisfies(gap: number, required: number): boolean {
  return gap + 1e-4 >= required;
}

function stabilizeVector(vector: ExecutiveSpatialVector): ExecutiveSpatialVector {
  return Object.freeze({
    x: stabilize(vector.x),
    y: stabilize(vector.y),
    z: stabilize(vector.z),
  });
}

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function toTuple(
  vector: ExecutiveSpatialVector,
): readonly [number, number, number] {
  return Object.freeze([vector.x, vector.y, vector.z] as const);
}

function fromTuple(
  tuple: readonly [number, number, number],
): ExecutiveSpatialVector {
  return Object.freeze({ x: tuple[0], y: tuple[1], z: tuple[2] });
}

function isCriticalAttention(attention: string | undefined): boolean {
  return (attention ?? "").toLowerCase() === "critical";
}

function statusLabel(status: string | undefined): string | null {
  if (status == null || status === "" || status === "stable") return null;
  return status.replace(/^\w/, (ch) => ch.toUpperCase());
}

function resolveVisualRole(
  subject: ExecutiveFocusVisualGrammarSubjectInput,
  focusedSubjectId: string | null,
): ExecutiveVisualGrammarRole {
  if (subject.family === "collapsed-thread") return "collapsed-thread";
  if (subject.family === "executive-work") return "executive-thread";
  if (focusedSubjectId != null && subject.subjectId === focusedSubjectId) {
    return "primary";
  }
  if (subject.disclosureState === "background-discoverable") return "elevated";
  if (
    subject.roleHint === "related" ||
    subject.disclosureState === "visible-related"
  ) {
    return "related";
  }
  if (isCriticalAttention(subject.attention)) return "elevated";
  if (subject.roleHint === "unrelated") return "background";
  return "related";
}

function resolveScaleForRole(role: ExecutiveVisualGrammarRole): number {
  switch (role) {
    case "primary":
      return EXECUTIVE_FOCUS_VISUAL_SCALE.primary;
    case "elevated":
      return EXECUTIVE_FOCUS_VISUAL_SCALE.elevated;
    case "related":
      return EXECUTIVE_FOCUS_VISUAL_SCALE.related;
    case "background":
      return EXECUTIVE_FOCUS_VISUAL_SCALE.background;
    case "executive-thread":
      return EXECUTIVE_FOCUS_VISUAL_SCALE.executiveThread;
    case "collapsed-thread":
      return EXECUTIVE_FOCUS_VISUAL_SCALE.collapsedThread;
  }
}

export function resolveExecutiveStageObjectBounds(input: {
  readonly subjectId: string;
  readonly objectKind?: string;
  readonly scale: number;
  readonly family?: ExecutiveVisualGrammarFamily;
  readonly silhouetteExtentScale?: number;
}): ExecutiveStageObjectBounds {
  const geometry = resolveExecutiveObjectGeometryFamily({
    objectKind: input.objectKind ?? "object",
  });
  const scale = Math.max(
    EXECUTIVE_FOCUS_VISUAL_SCALE.minimumReadable * 0.85,
    input.scale,
  );
  const silhouetteExtentScale =
    input.silhouetteExtentScale ??
    EXECUTIVE_FOCUS_VISUAL_SEPARATION.silhouetteExtentScale;

  // Collapsed-thread torus: outer radius = major + tube (presentation mesh).
  let width = geometry.dimensions.width;
  let height = geometry.dimensions.height;
  let depth = geometry.dimensions.depth;
  if (input.family === "collapsed-thread") {
    const outer =
      EXECUTIVE_FOCUS_VISUAL_SEPARATION.collapsedThreadMajorRadius +
      EXECUTIVE_FOCUS_VISUAL_SEPARATION.collapsedThreadTubeRadius;
    width = outer * 2;
    height = EXECUTIVE_FOCUS_VISUAL_SEPARATION.collapsedThreadTubeRadius * 2;
    depth = outer * 2;
  }

  const halfWidth = (width * scale * silhouetteExtentScale) / 2;
  const halfHeight = (height * scale * silhouetteExtentScale) / 2;
  const halfDepth = (depth * scale * silhouetteExtentScale) / 2;
  const footprintRadius = Math.hypot(halfWidth, halfDepth);
  const boundingRadius = Math.hypot(halfWidth, halfHeight, halfDepth);
  return Object.freeze({
    subjectId: input.subjectId,
    geometryFamily: geometry.geometryFamily,
    dimensions: Object.freeze({ width, height, depth }),
    scale,
    halfWidth: stabilize(halfWidth),
    halfHeight: stabilize(halfHeight),
    halfDepth: stabilize(halfDepth),
    footprintRadius: stabilize(footprintRadius),
    boundingRadius: stabilize(boundingRadius),
    silhouetteExtentScale,
    effectiveFootprintRadius: stabilize(footprintRadius),
    effectiveBoundingRadius: stabilize(boundingRadius),
  });
}

function geometrySurfaceGap(
  left: ExecutiveStageObjectBounds,
  leftPos: ExecutiveSpatialVector,
  right: ExecutiveStageObjectBounds,
  rightPos: ExecutiveSpatialVector,
): number {
  const centerDistance = Math.hypot(
    leftPos.x - rightPos.x,
    leftPos.y - rightPos.y,
    leftPos.z - rightPos.z,
  );
  return (
    centerDistance -
    left.effectiveBoundingRadius -
    right.effectiveBoundingRadius
  );
}

function projectedSilhouetteGap(input: {
  readonly left: ExecutiveStageObjectBounds;
  readonly leftPos: ExecutiveSpatialVector;
  readonly right: ExecutiveStageObjectBounds;
  readonly rightPos: ExecutiveSpatialVector;
  readonly cameraPosition: ExecutiveCameraVector;
  readonly cameraTarget: ExecutiveCameraVector;
  readonly cameraFov: number;
}): number | null {
  const leftNdc = projectExecutiveWorldPointToNdc({
    point: input.leftPos,
    cameraPosition: input.cameraPosition,
    cameraTarget: input.cameraTarget,
    fovDegrees: input.cameraFov,
    aspect: EXECUTIVE_FOCUS_VISUAL_SEPARATION.aspect,
  });
  const rightNdc = projectExecutiveWorldPointToNdc({
    point: input.rightPos,
    cameraPosition: input.cameraPosition,
    cameraTarget: input.cameraTarget,
    fovDegrees: input.cameraFov,
    aspect: EXECUTIVE_FOCUS_VISUAL_SEPARATION.aspect,
  });
  if (leftNdc == null || rightNdc == null) return null;

  const depthLeft = Math.max(
    0.35,
    Math.hypot(
      input.leftPos.x - input.cameraPosition.x,
      input.leftPos.y - input.cameraPosition.y,
      input.leftPos.z - input.cameraPosition.z,
    ),
  );
  const depthRight = Math.max(
    0.35,
    Math.hypot(
      input.rightPos.x - input.cameraPosition.x,
      input.rightPos.y - input.cameraPosition.y,
      input.rightPos.z - input.cameraPosition.z,
    ),
  );
  const fovRad = (input.cameraFov * Math.PI) / 180;
  const worldToNdc = (radius: number, depth: number) =>
    radius / (Math.tan(fovRad / 2) * depth);
  const leftRadiusNdc = worldToNdc(
    input.left.effectiveBoundingRadius,
    depthLeft,
  );
  const rightRadiusNdc = worldToNdc(
    input.right.effectiveBoundingRadius,
    depthRight,
  );
  const centerGap = Math.hypot(leftNdc.x - rightNdc.x, leftNdc.y - rightNdc.y);
  return centerGap - leftRadiusNdc - rightRadiusNdc;
}

function buildLabel(
  subject: ExecutiveFocusVisualGrammarSubjectInput,
  role: ExecutiveVisualGrammarRole,
): ExecutiveFocusVisualLabelPresentation {
  const status = statusLabel(subject.status);
  if (role === "primary") {
    return Object.freeze({
      hierarchy: "primary",
      prominence: "full",
      primaryLine: subject.label,
      secondaryLine: status,
      showStatus: status != null,
      suppressible: false,
      neverSuppress: true,
    });
  }
  if (role === "related") {
    // STAGE-LABEL:1 — name first; state as secondary (never "NAME · WATCH" + WATCH).
    return Object.freeze({
      hierarchy: "related",
      prominence: "reduced",
      primaryLine: subject.label,
      secondaryLine: status,
      showStatus: status != null,
      suppressible: true,
      neverSuppress: false,
    });
  }
  if (role === "executive-thread") {
    // STAGE-LABEL:1 / STAGE-THREAD:1 — subject name primary, kind secondary.
    const kind =
      subject.workKind === "executive-thread"
        ? "Thread"
        : subject.workKind != null
          ? subject.workKind.replace(/^\w/, (ch) => ch.toUpperCase())
          : "Work";
    return Object.freeze({
      hierarchy: "executive-thread",
      prominence: "reduced",
      primaryLine: subject.label,
      secondaryLine: kind,
      showStatus: false,
      suppressible: true,
      neverSuppress: false,
    });
  }
  if (role === "collapsed-thread") {
    return Object.freeze({
      hierarchy: "collapsed-thread",
      prominence: "minimal",
      primaryLine: subject.label,
      secondaryLine: null,
      showStatus: false,
      suppressible: true,
      neverSuppress: false,
    });
  }
  return Object.freeze({
    hierarchy: "background",
    prominence: "minimal",
    primaryLine: subject.label,
    secondaryLine: null,
    showStatus: false,
    suppressible: true,
    neverSuppress: false,
  });
}

function adaptiveHubRadius(input: {
  readonly focusBounds: ExecutiveStageObjectBounds;
  readonly neighborBounds: readonly ExecutiveStageObjectBounds[];
  readonly neighborCount: number;
}): number {
  const maxNeighbor = input.neighborBounds.reduce(
    (max, entry) => Math.max(max, entry.effectiveFootprintRadius),
    0,
  );
  const required =
    input.focusBounds.effectiveFootprintRadius +
    maxNeighbor +
    EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap +
    EXECUTIVE_FOCUS_VISUAL_SEPARATION.focusWhitespaceGap +
    EXECUTIVE_FOCUS_VISUAL_SEPARATION.hubDensityAllowance *
      Math.max(0, input.neighborCount - 1);
  return stabilize(
    Math.min(
      EXECUTIVE_FOCUS_VISUAL_SEPARATION.hubRadiusMax,
      Math.max(EXECUTIVE_FOCUS_VISUAL_SEPARATION.hubRadiusMin, required),
    ),
  );
}


export function resolveExecutiveFocusClearRadius(input: {
  readonly focusBounds: ExecutiveStageObjectBounds;
  readonly neighborBounds: readonly ExecutiveStageObjectBounds[];
}): number {
  const maxNeighbor = input.neighborBounds.reduce(
    (max, entry) => Math.max(max, entry.effectiveFootprintRadius),
    0,
  );
  return stabilize(
    input.focusBounds.effectiveFootprintRadius +
      maxNeighbor +
      EXECUTIVE_FOCUS_VISUAL_SEPARATION.focusWhitespaceGap,
  );
}

function normalizeAngle(angle: number): number {
  let next = angle;
  while (next <= -Math.PI) next += Math.PI * 2;
  while (next > Math.PI) next -= Math.PI * 2;
  return next;
}

function angularDelta(a: number, b: number): number {
  return Math.abs(normalizeAngle(a - b));
}

function maxRadiusAlongRay(
  focus: ExecutiveSpatialVector,
  angle: number,
  bounds: ExecutiveSpatialCompositionBounds,
): number {
  const dx = Math.cos(angle);
  const dz = Math.sin(angle);
  let tMax = Number.POSITIVE_INFINITY;
  if (dx > 1e-6) tMax = Math.min(tMax, (bounds.maxX - focus.x) / dx);
  if (dx < -1e-6) tMax = Math.min(tMax, (bounds.minX - focus.x) / dx);
  if (dz > 1e-6) tMax = Math.min(tMax, (bounds.maxZ - focus.z) / dz);
  if (dz < -1e-6) tMax = Math.min(tMax, (bounds.minZ - focus.z) / dz);
  if (!Number.isFinite(tMax) || tMax <= 0) return 0.6;
  return Math.max(0.55, tMax * 0.9);
}

function roleScaleFloor(role: ExecutiveVisualGrammarRole): number {
  if (role === "collapsed-thread") {
    return EXECUTIVE_FOCUS_VISUAL_SCALE.collapsedThread * 0.8;
  }
  if (role === "executive-thread") {
    // Thread spine packing inside Stage Z bounds needs a low floor.
    return EXECUTIVE_FOCUS_VISUAL_SCALE.minimumReadable * 0.7;
  }
  if (role === "background") {
    return EXECUTIVE_FOCUS_VISUAL_SCALE.minimumReadable * 0.85;
  }
  return EXECUTIVE_FOCUS_VISUAL_SCALE.minimumReadable * 0.9;
}

function redistributeHubNeighbors(input: {
  readonly focus: WorkingSubject;
  readonly neighbors: WorkingSubject[];
  readonly collapsed?: WorkingSubject | null;
  readonly hubRadius: number;
  readonly bounds: ExecutiveSpatialCompositionBounds;
  readonly cameraPosition: ExecutiveCameraVector;
  readonly cameraTarget: ExecutiveCameraVector;
  readonly cameraFov: number;
}): {
  readonly hubRadius: number;
  readonly assignments: readonly ExecutiveFocusHubSectorAssignment[];
  readonly degenerateRedistributed: boolean;
} {
  const attentionRank = (subject: WorkingSubject): number => {
    const attention = (subject.input.attention ?? "").toLowerCase();
    if (subject.visualRole === "elevated" || attention === "critical") return 40;
    if (attention === "important") return 30;
    if (attention === "elevated") return 20;
    if (subject.visualRole === "related") return 10;
    return 0;
  };

  const allocated = allocateExecutiveFocusHubSectors({
    focus: {
      subjectId: input.focus.subjectId,
      position: input.focus.position,
      bounds: input.focus.bounds,
    },
    neighbors: input.neighbors.map((neighbor) =>
      Object.freeze({
        subjectId: neighbor.subjectId,
        position: neighbor.position,
        bounds: neighbor.bounds,
        priority: attentionRank(neighbor),
        visualRole: neighbor.visualRole,
      }),
    ),
    collapsedThread:
      input.collapsed == null
        ? null
        : Object.freeze({
            subjectId: input.collapsed.subjectId,
            position: input.collapsed.position,
            bounds: input.collapsed.bounds,
            priority: -10,
            visualRole: input.collapsed.visualRole,
          }),
    hubRadius: input.hubRadius,
    bounds: input.bounds,
    cameraPosition: input.cameraPosition,
    cameraTarget: input.cameraTarget,
    cameraFov: input.cameraFov,
  });

  for (const neighbor of input.neighbors) {
    const scaleOverride = allocated.scaleOverrides.get(neighbor.subjectId);
    if (scaleOverride != null) {
      neighbor.scale = stabilize(
        Math.max(roleScaleFloor(neighbor.visualRole), scaleOverride),
      );
      refreshBounds(neighbor);
    }
    const placement = allocated.placements.get(neighbor.subjectId);
    if (placement != null) {
      neighbor.position = placement;
      refreshBounds(neighbor);
    }
  }

  if (input.collapsed != null) {
    const placement = allocated.placements.get(input.collapsed.subjectId);
    if (placement != null) {
      input.collapsed.position = placement;
      refreshBounds(input.collapsed);
    }
  }

  return {
    hubRadius: allocated.hubRadius,
    assignments: allocated.assignments,
    degenerateRedistributed: allocated.degenerateRedistributed,
  };
}



function placeCollapsedThreadSatellite(input: {
  readonly focus: WorkingSubject;
  readonly collapsed: WorkingSubject;
  readonly neighbors: WorkingSubject[];
  readonly hubRadius: number;
  readonly bounds: ExecutiveSpatialCompositionBounds;
}): void {
  const occupied = input.neighbors.map((neighbor) =>
    Math.atan2(
      neighbor.position.z - input.focus.position.z,
      neighbor.position.x - input.focus.position.x,
    ),
  );
  // Prefer foreground sector (+Z) then alternatives — deterministic scan.
  const candidates = Object.freeze([
    Math.PI / 2,
    (Math.PI * 3) / 4,
    Math.PI / 4,
    Math.PI,
    0,
    -Math.PI / 2,
    (-Math.PI * 3) / 4,
    -Math.PI / 4,
  ]);
  let bestAngle = candidates[0]!;
  let bestScore = -Number.POSITIVE_INFINITY;
  for (const candidate of candidates) {
    const nearest =
      occupied.length === 0
        ? Math.PI
        : Math.min(...occupied.map((angle) => angularDelta(angle, candidate)));
    // Prefer larger angular clearance; slight bias to +Z (camera-forward).
    const forwardBias = candidate === Math.PI / 2 ? 0.08 : 0;
    const score = nearest + forwardBias;
    if (score > bestScore) {
      bestScore = score;
      bestAngle = candidate;
    }
  }

  const clearRadius = resolveExecutiveFocusClearRadius({
    focusBounds: input.focus.bounds,
    neighborBounds: [
      ...input.neighbors.map((entry) => entry.bounds),
      input.collapsed.bounds,
    ],
  });
  const orbit = Math.max(
    clearRadius,
    input.hubRadius *
      EXECUTIVE_FOCUS_VISUAL_SEPARATION.collapsedThreadOrbitFactor,
  );
  input.collapsed.position = clampPosition(
    stabilizeVector({
      x: input.focus.position.x + Math.cos(bestAngle) * orbit,
      y: Math.max(input.bounds.minY + 0.08, input.focus.position.y - 0.42),
      z: input.focus.position.z + Math.sin(bestAngle) * orbit,
    }),
    input.bounds,
  );
  refreshBounds(input.collapsed);
}

function clampPosition(
  position: ExecutiveSpatialVector,
  bounds: ExecutiveSpatialCompositionBounds,
): ExecutiveSpatialVector {
  return applyExecutiveSpatialUiOverlaySafeCorrection(
    clampExecutiveSpatialVector(position, bounds),
    bounds,
  );
}

/** Bounds-only clamp — used for Executive Thread so Dial overlay rewrite cannot collapse the spine. */
function clampPositionStrict(
  position: ExecutiveSpatialVector,
  bounds: ExecutiveSpatialCompositionBounds,
): ExecutiveSpatialVector {
  return clampExecutiveSpatialVector(position, bounds);
}

type WorkingSubject = {
  readonly subjectId: string;
  readonly family: ExecutiveVisualGrammarFamily;
  readonly visualRole: ExecutiveVisualGrammarRole;
  readonly objectKind: string;
  scale: number;
  position: ExecutiveSpatialVector;
  readonly input: ExecutiveFocusVisualGrammarSubjectInput;
  bounds: ExecutiveStageObjectBounds;
  readonly inBusinessNetwork: boolean;
  readonly inExecutiveThread: boolean;
  readonly movable: boolean;
};

function refreshBounds(subject: WorkingSubject): void {
  subject.bounds = resolveExecutiveStageObjectBounds({
    subjectId: subject.subjectId,
    objectKind: subject.objectKind,
    scale: subject.scale,
    family: subject.family,
  });
}


function layoutThreadSpine(input: {
  readonly focus: ExecutiveSpatialVector;
  readonly members: WorkingSubject[];
  readonly bounds: ExecutiveSpatialCompositionBounds;
  readonly preferRight?: boolean;
}): void {
  if (input.members.length === 0) return;
  const count = input.members.length;
  const lateralOffset = EXECUTIVE_FOCUS_VISUAL_SEPARATION.threadLateralOffset;
  const lateral = input.preferRight
    ? input.focus.x + lateralOffset
    : input.focus.x - lateralOffset;

  // Pack into Stage Z bounds first, then shrink scales to guarantee surface gap.
  const zPad = 0.12;
  const zMin = input.bounds.minZ + zPad;
  const zMax = input.bounds.maxZ - zPad;
  const available = Math.max(0.5, zMax - zMin);
  const stepZ =
    count <= 1 ? available : available / Math.max(1, count - 1);

  const requiredGap = EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap + 0.04;
  const fitRadius = Math.max(0.16, (stepZ - requiredGap) / 2);
  for (const member of input.members) {
    const unitRadius =
      member.bounds.effectiveBoundingRadius / Math.max(member.scale, 1e-6);
    const nextScale = Math.max(
      roleScaleFloor(member.visualRole),
      Math.min(member.scale, fitRadius / Math.max(unitRadius, 1e-6)),
    );
    member.scale = stabilize(nextScale);
    refreshBounds(member);
  }

  const startZ = zMin;
  input.members.forEach((member, index) => {
    member.position = clampPositionStrict(
      stabilizeVector({
        x: lateral,
        y:
          EXECUTIVE_FOCUS_VISUAL_SEPARATION.threadBaseY +
          Math.min(index * EXECUTIVE_FOCUS_VISUAL_SEPARATION.threadStepY, 0.12),
        z: startZ + index * stepZ,
      }),
      input.bounds,
    );
    refreshBounds(member);
  });
}

/**
 * Deterministic visual grammar resolver.
 */
export function resolveExecutiveFocusVisualGrammar(
  input: ResolveExecutiveFocusVisualGrammarInput,
): ExecutiveFocusVisualGrammarResult {
  const bounds = input.bounds ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS;
  const focusedSubjectId =
    input.focusedSubjectId != null &&
    input.subjects.some(
      (subject) => subject.subjectId === input.focusedSubjectId,
    )
      ? input.focusedSubjectId
      : null;
  const cameraPosition =
    input.cameraPosition ??
    Object.freeze({ x: 0, y: 4.2, z: 7.4 } satisfies ExecutiveCameraVector);
  const cameraTarget =
    input.cameraTarget ??
    (focusedSubjectId != null
      ? EXECUTIVE_FOCUS_ANCHOR_TARGET
      : Object.freeze({ x: 0, y: 0.1, z: 0 }));
  const cameraFov = input.cameraFov ?? 42;

  const working: WorkingSubject[] = input.subjects
    .filter((subject) => subject.participatesInSeparation !== false)
    .filter((subject) => subject.disclosureState !== "hidden")
    .map((subject) => {
      const visualRole = resolveVisualRole(subject, focusedSubjectId);
      const scale = resolveScaleForRole(visualRole);
      const objectKind =
        subject.objectKind ??
        (subject.family === "executive-work"
          ? (subject.workKind ?? "problem")
          : subject.family === "collapsed-thread"
            ? "insight"
            : "object");
      const entry: WorkingSubject = {
        subjectId: subject.subjectId,
        family: subject.family,
        visualRole,
        objectKind,
        scale,
        position: fromTuple(subject.position),
        input: subject,
        bounds: resolveExecutiveStageObjectBounds({
          subjectId: subject.subjectId,
          objectKind,
          scale,
          family: subject.family,
        }),
        inBusinessNetwork: subject.family === "business-object",
        inExecutiveThread:
          subject.family === "executive-work" ||
          subject.family === "collapsed-thread",
        movable: !(
          focusedSubjectId != null && subject.subjectId === focusedSubjectId
        ),
      };
      return entry;
    })
    .sort((left, right) => compareIds(left.subjectId, right.subjectId));

  const focus = working.find(
    (subject) => subject.subjectId === focusedSubjectId,
  );

  let hubRadius: number = EXECUTIVE_FOCUS_VISUAL_SEPARATION.hubRadiusMin;
  let calibrationPasses = 0;
  let hubSectorAssignments: readonly ExecutiveFocusHubSectorAssignment[] = Object.freeze([]);
  let hubDegenerateRedistributed = false;

  // Overview: keep topology ownership; apply calm near-unity scales only.
  if (input.mode === "overview") {
    for (const subject of working) {
      if (subject.family === "business-object") {
        subject.scale = stabilize(0.9);
        refreshBounds(subject);
      }
    }
  }

  if (input.mode === "focus" && focus != null) {
    focus.position = stabilizeVector({
      x: EXECUTIVE_FOCUS_ANCHOR_TARGET.x,
      y: EXECUTIVE_FOCUS_ANCHOR_TARGET.y,
      // Temporary calibration depth — STAGE-2D:2 Stage boundary flattens to z=0.
      // Full XY-only grammar separation is deferred to STAGE-2D:3+.
      z: EXECUTIVE_FOCUS_ANCHOR_TARGET.z + 0.14,
    });
    refreshBounds(focus);

    const depth = Math.max(
      0.5,
      Math.hypot(
        focus.position.x - cameraPosition.x,
        focus.position.y - cameraPosition.y,
        focus.position.z - cameraPosition.z,
      ),
    );
    const fovRad = (cameraFov * Math.PI) / 180;
    const projectedWidth =
      (focus.bounds.halfWidth * 2) / (Math.tan(fovRad / 2) * depth);
    if (
      projectedWidth >
      EXECUTIVE_FOCUS_VISUAL_SEPARATION.maxPrimaryScreenOccupancy
    ) {
      const factor =
        EXECUTIVE_FOCUS_VISUAL_SEPARATION.maxPrimaryScreenOccupancy /
        projectedWidth;
      focus.scale = stabilize(
        Math.max(
          EXECUTIVE_FOCUS_VISUAL_SCALE.minimumReadable,
          Math.min(
            EXECUTIVE_FOCUS_VISUAL_SCALE.maximumPrimary,
            focus.scale * factor,
          ),
        ),
      );
      refreshBounds(focus);
    }

    const networkNeighbors = working.filter(
      (subject) =>
        subject.inBusinessNetwork &&
        subject.subjectId !== focus.subjectId &&
        (subject.visualRole === "related" || subject.visualRole === "elevated"),
    );
    hubRadius = adaptiveHubRadius({
      focusBounds: focus.bounds,
      neighborBounds: networkNeighbors.map((subject) => subject.bounds),
      neighborCount: networkNeighbors.length,
    });
    // Extra radial budget for projected-camera readability.
    hubRadius = stabilize(
      Math.min(
        EXECUTIVE_FOCUS_VISUAL_SEPARATION.hubRadiusMax,
        hubRadius + 0.18 * Math.max(0, networkNeighbors.length - 2),
      ),
    );

    const collapsed = working.find(
      (subject) => subject.family === "collapsed-thread",
    );
    const hubLayout = redistributeHubNeighbors({
      focus,
      neighbors: networkNeighbors,
      collapsed: collapsed ?? null,
      hubRadius,
      bounds,
      cameraPosition,
      cameraTarget,
      cameraFov,
    });
    hubRadius = hubLayout.hubRadius;
    hubSectorAssignments = hubLayout.assignments;
    hubDegenerateRedistributed = hubLayout.degenerateRedistributed;

    const threadMembers = working
      .filter((subject) => subject.family === "executive-work")
      .sort((left, right) => {
        const order = ["problem", "scenario", "decision", "execution"] as const;
        const leftKind = left.input.workKind ?? "problem";
        const rightKind = right.input.workKind ?? "problem";
        const leftIndex = order.indexOf(leftKind as (typeof order)[number]);
        const rightIndex = order.indexOf(rightKind as (typeof order)[number]);
        if (leftIndex !== rightIndex) return leftIndex - rightIndex;
        return compareIds(left.subjectId, right.subjectId);
      });

    const preferRightThread =
      networkNeighbors.filter((n) => n.position.x < focus.position.x).length >=
      networkNeighbors.filter((n) => n.position.x >= focus.position.x).length;
    layoutThreadSpine({
      focus: focus.position,
      members: threadMembers,
      bounds,
      preferRight: preferRightThread,
    });
  }

  const evaluateSeparation = () => {
    let worldOk = true;
    let projectedOk = true;
    let focusOk = true;
    for (let i = 0; i < working.length; i += 1) {
      for (let j = i + 1; j < working.length; j += 1) {
        const left = working[i]!;
        const right = working[j]!;
        const gap = geometrySurfaceGap(
          left.bounds,
          left.position,
          right.bounds,
          right.position,
        );
        if (!gapSatisfies(gap, EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap)) {
          worldOk = false;
        }
        const projected = projectedSilhouetteGap({
          left: left.bounds,
          leftPos: left.position,
          right: right.bounds,
          rightPos: right.position,
          cameraPosition,
          cameraTarget,
          cameraFov,
        });
        if (
          projected != null &&
          !gapSatisfies(
            projected,
            EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumProjectedGapNdc,
          )
        ) {
          projectedOk = false;
        }
      }
    }
    if (focus != null) {
      for (const neighbor of working) {
        if (neighbor.subjectId === focus.subjectId) continue;
        const gap = geometrySurfaceGap(
          focus.bounds,
          focus.position,
          neighbor.bounds,
          neighbor.position,
        );
        if (
          !gapSatisfies(
            gap,
            EXECUTIVE_FOCUS_VISUAL_SEPARATION.focusWhitespaceGap,
          )
        ) {
          focusOk = false;
        }
      }
    }
    return { worldOk, projectedOk, focusOk };
  };

  while (
    calibrationPasses < EXECUTIVE_FOCUS_VISUAL_SEPARATION.maxCalibrationPasses
  ) {
    const status = evaluateSeparation();
    if (status.worldOk && status.projectedOk && status.focusOk) break;
    calibrationPasses += 1;

    for (let i = 0; i < working.length; i += 1) {
      for (let j = i + 1; j < working.length; j += 1) {
        const left = working[i]!;
        const right = working[j]!;
        const required = Math.max(
          EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap,
          left.subjectId === focusedSubjectId ||
            right.subjectId === focusedSubjectId
            ? EXECUTIVE_FOCUS_VISUAL_SEPARATION.focusWhitespaceGap
            : EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap,
        );
        const gap = geometrySurfaceGap(
          left.bounds,
          left.position,
          right.bounds,
          right.position,
        );
        const projected = projectedSilhouetteGap({
          left: left.bounds,
          leftPos: left.position,
          right: right.bounds,
          rightPos: right.position,
          cameraPosition,
          cameraTarget,
          cameraFov,
        });
        const projectedShort =
          projected != null &&
          projected < EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumProjectedGapNdc;
        if (gap >= required && !projectedShort) continue;

        const deficit = Math.max(
          required - gap,
          projectedShort
            ? EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap * 0.5
            : 0,
        );
        const nudge = Math.min(
          EXECUTIVE_FOCUS_VISUAL_SEPARATION.maxPairNudge,
          deficit * 0.55 + 0.04,
        );

        // Executive Thread members separate along the Z spine (Stage Y is bounded).
        if (
          left.family === "executive-work" &&
          right.family === "executive-work"
        ) {
          const dir = right.position.z >= left.position.z ? 1 : -1;
          if (left.movable) {
            left.position = clampPositionStrict(
              stabilizeVector({
                x: left.position.x,
                y: left.position.y,
                z: left.position.z - dir * nudge,
              }),
              bounds,
            );
            refreshBounds(left);
          }
          if (right.movable) {
            right.position = clampPositionStrict(
              stabilizeVector({
                x: right.position.x,
                y: right.position.y,
                z: right.position.z + dir * nudge,
              }),
              bounds,
            );
            refreshBounds(right);
          }
          continue;
        }

        const dx = right.position.x - left.position.x;
        const dz = right.position.z - left.position.z;
        let dist = Math.hypot(dx, dz);
        let ux = dx;
        let uz = dz;
        if (dist < 1e-5) {
          const hash =
            (left.subjectId.charCodeAt(0) + right.subjectId.charCodeAt(0)) % 8;
          const angle = (hash / 8) * Math.PI * 2;
          ux = Math.cos(angle);
          uz = Math.sin(angle);
          dist = 1;
        } else {
          ux /= dist;
          uz /= dist;
        }

        if (left.movable) {
          left.position = clampPosition(
            stabilizeVector({
              x: left.position.x - ux * nudge,
              y: left.position.y,
              z: left.position.z - uz * nudge,
            }),
            bounds,
          );
          refreshBounds(left);
        }
        if (right.movable) {
          right.position = clampPosition(
            stabilizeVector({
              x: right.position.x + ux * nudge,
              y: right.position.y,
              z: right.position.z + uz * nudge,
            }),
            bounds,
          );
          refreshBounds(right);
        }
      }
    }

    // If projected gaps remain, expand within Stage rays and prefer X offsets.
    if (focus != null) {
      const statusMid = evaluateSeparation();
      if (!statusMid.projectedOk || !statusMid.focusOk) {
        for (const neighbor of working) {
          if (!neighbor.movable || !neighbor.inBusinessNetwork) continue;
          const dx = neighbor.position.x - focus.position.x;
          const dz = neighbor.position.z - focus.position.z;
          const angle = Math.atan2(dz, dx);
          const room = maxRadiusAlongRay(focus.position, angle, bounds);
          const localClear =
            focus.bounds.effectiveFootprintRadius +
            neighbor.bounds.effectiveFootprintRadius +
            EXECUTIVE_FOCUS_VISUAL_SEPARATION.focusWhitespaceGap;
          const placeRadius = Math.min(
            room,
            Math.max(Math.hypot(dx, dz) + 0.14, localClear),
          );
          // Restrained presentation-plane bias improves canonical-camera separation.
          const xBias =
            Math.sign(dx || 1) *
            Math.min(0.35, EXECUTIVE_FOCUS_VISUAL_SEPARATION.maxPairNudge * 0.45);
          neighbor.position = clampPosition(
            stabilizeVector({
              x: focus.position.x + Math.cos(angle) * placeRadius + xBias,
              y: neighbor.position.y,
              z: focus.position.z + Math.sin(angle) * placeRadius,
            }),
            bounds,
          );
          refreshBounds(neighbor);
        }
      }
    }

    const after = evaluateSeparation();
    if (!after.worldOk || !after.projectedOk || !after.focusOk) {
      for (const subject of working) {
        if (subject.visualRole === "primary") continue;
        const next = subject.scale * 0.92;
        subject.scale = stabilize(
          Math.max(roleScaleFloor(subject.visualRole), Math.min(subject.scale, next)),
        );
        refreshBounds(subject);
      }
    }
  }

  const finalStatus = evaluateSeparation();
  if (!finalStatus.worldOk || !finalStatus.focusOk) {
    for (let i = 0; i < working.length; i += 1) {
      for (let j = i + 1; j < working.length; j += 1) {
        const left = working[i]!;
        const right = working[j]!;
        const required =
          left.subjectId === focusedSubjectId ||
          right.subjectId === focusedSubjectId
            ? EXECUTIVE_FOCUS_VISUAL_SEPARATION.focusWhitespaceGap
            : EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap;
        const gap = geometrySurfaceGap(
          left.bounds,
          left.position,
          right.bounds,
          right.position,
        );
        if (gap >= required) continue;
        const movable = right.movable ? right : left.movable ? left : null;
        const fixed = movable === right ? left : right;
        if (movable == null) {
          if (left.visualRole !== "primary") {
            left.scale = Math.max(
              roleScaleFloor(left.visualRole),
              Math.min(left.scale, left.scale * 0.88),
            );
            refreshBounds(left);
          }
          if (right.visualRole !== "primary") {
            right.scale = Math.max(
              roleScaleFloor(right.visualRole),
              Math.min(right.scale, right.scale * 0.88),
            );
            refreshBounds(right);
          }
          continue;
        }
        const dx = movable.position.x - fixed.position.x;
        const dz = movable.position.z - fixed.position.z;
        let dist = Math.hypot(dx, dz);
        let ux = dx;
        let uz = dz;
        if (dist < 1e-5) {
          ux = 1;
          uz = 0;
          dist = 1;
        } else {
          ux /= dist;
          uz /= dist;
        }
        const need =
          fixed.bounds.effectiveBoundingRadius +
          movable.bounds.effectiveBoundingRadius +
          required;
        movable.position = clampPosition(
          stabilizeVector({
            x: fixed.position.x + ux * need,
            y: movable.position.y,
            z: fixed.position.z + uz * need,
          }),
          bounds,
        );
        refreshBounds(movable);
      }
    }
  }

  // Restore Executive Thread spine after XZ separation nudges.
  if (input.mode === "focus" && focus != null) {
    const threadMembers = working
      .filter((subject) => subject.family === "executive-work")
      .sort((left, right) => {
        const order = ["problem", "scenario", "decision", "execution"] as const;
        const leftKind = left.input.workKind ?? "problem";
        const rightKind = right.input.workKind ?? "problem";
        const leftIndex = order.indexOf(leftKind as (typeof order)[number]);
        const rightIndex = order.indexOf(rightKind as (typeof order)[number]);
        if (leftIndex !== rightIndex) return leftIndex - rightIndex;
        return compareIds(left.subjectId, right.subjectId);
      });
    if (threadMembers.length > 0) {
      const preferRightThread =
        working.filter(
          (subject) =>
            subject.inBusinessNetwork &&
            subject.subjectId !== focus.subjectId &&
            subject.position.x < focus.position.x,
        ).length >=
        working.filter(
          (subject) =>
            subject.inBusinessNetwork &&
            subject.subjectId !== focus.subjectId &&
            subject.position.x >= focus.position.x,
        ).length;
      layoutThreadSpine({
        focus: focus.position,
        members: threadMembers,
        bounds,
        preferRight: preferRightThread,
      });

      // Push thread laterally if it still collides with a business object.
      for (const member of threadMembers) {
        for (const neighbor of working) {
          if (!neighbor.inBusinessNetwork) continue;
          const gap = geometrySurfaceGap(
            member.bounds,
            member.position,
            neighbor.bounds,
            neighbor.position,
          );
          if (
            gapSatisfies(
              gap,
              EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap,
            )
          ) {
            continue;
          }
          const dir = member.position.x >= neighbor.position.x ? 1 : -1;
          const need =
            neighbor.bounds.effectiveBoundingRadius +
            member.bounds.effectiveBoundingRadius +
            EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap;
          member.position = clampPositionStrict(
            stabilizeVector({
              x: neighbor.position.x + dir * need,
              y: member.position.y,
              z: member.position.z,
            }),
            bounds,
          );
          refreshBounds(member);
          const gapAfter = geometrySurfaceGap(
            member.bounds,
            member.position,
            neighbor.bounds,
            neighbor.position,
          );
          if (
            !gapSatisfies(
              gapAfter,
              EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap,
            )
          ) {
            // Stage clamp blocked thread — move the business neighbor instead.
            if (neighbor.movable) {
              neighbor.position = clampPosition(
                stabilizeVector({
                  x: member.position.x - dir * need,
                  y: neighbor.position.y,
                  z: neighbor.position.z,
                }),
                bounds,
              );
              refreshBounds(neighbor);
            }
            member.scale = stabilize(
              Math.max(
                roleScaleFloor(member.visualRole),
                member.scale * 0.9,
              ),
            );
            refreshBounds(member);
          }
        }
      }
    }

    // Re-seat Hub sector placements after world/projected calibration nudges.
    const networkAfter = working.filter(
      (subject) =>
        subject.inBusinessNetwork &&
        subject.subjectId !== focus.subjectId &&
        (subject.visualRole === "related" || subject.visualRole === "elevated"),
    );
    const collapsedAfter = working.find(
      (subject) => subject.family === "collapsed-thread",
    );
    if (networkAfter.length > 0 || collapsedAfter != null) {
      const reseat = redistributeHubNeighbors({
        focus,
        neighbors: networkAfter,
        collapsed: collapsedAfter ?? null,
        hubRadius,
        bounds,
        cameraPosition,
        cameraTarget,
        cameraFov,
      });
      hubRadius = reseat.hubRadius;
      hubSectorAssignments = reseat.assignments;
      hubDegenerateRedistributed =
        hubDegenerateRedistributed || reseat.degenerateRedistributed;
    }

    // Restore Executive Thread spine after final Hub reseat so sectors cannot
    // leave thread members overlapping business geometry.
    if (threadMembers.length > 0) {
      const preferRightThreadFinal =
        working.filter(
          (subject) =>
            subject.inBusinessNetwork &&
            subject.subjectId !== focus.subjectId &&
            subject.position.x < focus.position.x,
        ).length >=
        working.filter(
          (subject) =>
            subject.inBusinessNetwork &&
            subject.subjectId !== focus.subjectId &&
            subject.position.x >= focus.position.x,
        ).length;
      layoutThreadSpine({
        focus: focus.position,
        members: threadMembers,
        bounds,
        preferRight: preferRightThreadFinal,
      });
      for (const member of threadMembers) {
        for (const neighbor of working) {
          if (!neighbor.inBusinessNetwork) continue;
          const gap = geometrySurfaceGap(
            member.bounds,
            member.position,
            neighbor.bounds,
            neighbor.position,
          );
          if (
            gapSatisfies(
              gap,
              EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap,
            )
          ) {
            continue;
          }
          const dir = member.position.x >= neighbor.position.x ? 1 : -1;
          const need =
            neighbor.bounds.effectiveBoundingRadius +
            member.bounds.effectiveBoundingRadius +
            EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap;
          member.position = clampPositionStrict(
            stabilizeVector({
              x: neighbor.position.x + dir * need,
              y: member.position.y,
              z: member.position.z,
            }),
            bounds,
          );
          refreshBounds(member);
          const gapAfter = geometrySurfaceGap(
            member.bounds,
            member.position,
            neighbor.bounds,
            neighbor.position,
          );
          if (
            !gapSatisfies(
              gapAfter,
              EXECUTIVE_FOCUS_VISUAL_SEPARATION.minimumWorldGap,
            )
          ) {
            // Stage clamp blocked thread — move the business neighbor instead.
            if (neighbor.movable) {
              neighbor.position = clampPosition(
                stabilizeVector({
                  x: member.position.x - dir * need,
                  y: neighbor.position.y,
                  z: neighbor.position.z,
                }),
                bounds,
              );
              refreshBounds(neighbor);
            }
            member.scale = stabilize(
              Math.max(
                roleScaleFloor(member.visualRole),
                member.scale * 0.9,
              ),
            );
            refreshBounds(member);
          }
        }
      }
    }
  }

  const verified = evaluateSeparation();
  const sectorBySubject = new Map(
    hubSectorAssignments.map((entry) => [entry.subjectId, entry.sectorId]),
  );
  const subjects = Object.freeze(
    working.map((subject) =>
      Object.freeze({
        subjectId: subject.subjectId,
        family: subject.family,
        visualRole: subject.visualRole,
        scale: stabilize(subject.scale),
        targetPosition: toTuple(subject.position),
        bounds: subject.bounds,
        label: buildLabel(subject.input, subject.visualRole),
        inBusinessNetwork: subject.inBusinessNetwork,
        inExecutiveThread: subject.inExecutiveThread,
        hubSectorId: sectorBySubject.get(subject.subjectId),
        labelAnchorBoost:
          subject.visualRole === "primary"
            ? EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.primaryLabelClearanceBoost
            : subject.visualRole === "related"
              ? 0.08
              : 0,
      }),
    ),
  );

  return Object.freeze({
    identity: executiveFocusVisualGrammarIdentity,
    version: executiveFocusVisualGrammarVersion,
    subjects,
    byId: new Map(subjects.map((subject) => [subject.subjectId, subject])),
    hubRadius,
    calibrationPasses,
    separationSatisfied: verified.worldOk,
    projectedSeparationSatisfied: verified.projectedOk,
    focusWhitespaceSatisfied: verified.focusOk,
    usedZOnlyEscape: false,
    hubSectorAssignments,
    hubDegenerateRedistributed,
  });
}

export function measureExecutiveFocusObjectGap(input: {
  readonly leftBounds: ExecutiveStageObjectBounds;
  readonly leftPosition: readonly [number, number, number];
  readonly rightBounds: ExecutiveStageObjectBounds;
  readonly rightPosition: readonly [number, number, number];
}): number {
  return geometrySurfaceGap(
    input.leftBounds,
    fromTuple(input.leftPosition),
    input.rightBounds,
    fromTuple(input.rightPosition),
  );
}

export function verifyExecutiveFocusVisualGrammar(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly separationValid: boolean;
  readonly scaleBounded: boolean;
  readonly disclosureBudgetUntouched: boolean;
  readonly lightingUnaffected: boolean;
}> {
  const identity = getExecutiveFocusVisualGrammarIdentity();
  const identityValid =
    identity.id === "SP:4.1C/ExecutiveFocusVisualGrammar" &&
    identity.version === "4.1.2" &&
    identity.namespace ===
      "nexora.spatial-presentation.executive-focus-visual-grammar" &&
    identity.architecturalRole ===
      "PresentationOnlyExecutiveFocusVisualGrammar";

  const boundaryValid =
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.presentationOnly === true &&
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.solvesOverlapViaZOnly === false &&
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.usesPhysicsEngine === false &&
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.ownsDataReality === false;

  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-capacity",
    subjects: Object.freeze([
      Object.freeze({
        subjectId: "obj-capacity",
        label: "Capacity",
        family: "business-object" as const,
        roleHint: "focused" as const,
        disclosureState: "visible-primary" as const,
        position: [0, 0.42, 0.14] as const,
        status: "watch",
      }),
      Object.freeze({
        subjectId: "obj-inventory",
        label: "Inventory",
        family: "business-object" as const,
        roleHint: "related" as const,
        disclosureState: "visible-related" as const,
        position: [-1.2, 0.42, 0.8] as const,
      }),
      Object.freeze({
        subjectId: "obj-delivery",
        label: "Delivery",
        family: "business-object" as const,
        roleHint: "related" as const,
        disclosureState: "visible-related" as const,
        position: [1.2, 0.42, 0.8] as const,
      }),
      Object.freeze({
        subjectId: "obj-budget",
        label: "Budget",
        family: "business-object" as const,
        roleHint: "related" as const,
        disclosureState: "visible-related" as const,
        position: [-1.1, 0.42, -0.9] as const,
      }),
      Object.freeze({
        subjectId: "thread-obj-capacity",
        label: "Executive Thread · 4",
        family: "collapsed-thread" as const,
        roleHint: "collapsed-thread" as const,
        disclosureState: "collapsed-thread" as const,
        position: [1.4, 0.1, 1.2] as const,
      }),
    ]),
  });

  const separationValid =
    result.separationSatisfied &&
    result.focusWhitespaceSatisfied &&
    result.usedZOnlyEscape === false;

  const primary = result.byId.get("obj-capacity");
  const related = result.byId.get("obj-inventory");
  const scaleBounded =
    primary != null &&
    related != null &&
    primary.scale <= EXECUTIVE_FOCUS_VISUAL_SCALE.maximumPrimary &&
    related.scale < primary.scale;

  const disclosureBudgetUntouched =
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.minimum.maxVisibleSubjects === 6;

  const lighting = resolveExecutiveLightingEmphasis({
    objectId: "obj-capacity",
    focused: true,
  });
  const lightingUnaffected =
    lighting.level === "primary" &&
    lighting.strength ===
      EXECUTIVE_LIGHTING_EMPHASIS_PROFILES.primary.strength;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    separationValid &&
    scaleBounded &&
    disclosureBudgetUntouched &&
    lightingUnaffected;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    separationValid,
    scaleBounded,
    disclosureBudgetUntouched,
    lightingUnaffected,
  });
}
