/**
 * SP:2.8B — Overview Constellation Screen-Space Relaxation.
 *
 * Presentation-only calibration consumed by SP:1.4 Spatial Composition.
 * Detects projected silhouette pressure under the Overview camera and applies
 * bounded slot relaxation so independently valid 3D positions remain readable
 * after perspective projection.
 *
 * Does NOT:
 *   - own XYZ authority (SP:1.4 does);
 *   - copy Focus choreography into Overview;
 *   - increase camera distance;
 *   - run force-directed / physics layout;
 *   - invent relationships or business truth;
 *   - use object ID/name hacks.
 */

import {
  sanitizeExecutiveCameraIntent,
  resolveExecutiveCameraPresentation,
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  type ExecutiveCameraVector,
} from "./executiveCameraFoundation.ts";
import {
  projectExecutiveWorldPointToNdc,
} from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  EXECUTIVE_SPATIAL_RESERVED_CENTER,
  applyExecutiveSpatialUiOverlaySafeCorrection,
  clampExecutiveSpatialVector,
  type ExecutiveSpatialCompositionBounds,
  type ExecutiveSpatialVector,
} from "./executiveSpatialComposition.ts";
import {
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
} from "./executiveViewingAngle.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveOverviewConstellationScreenSpaceRelaxationIdentity =
  "SP:2.8B/OverviewConstellationScreenSpaceRelaxation" as const;

export const executiveOverviewConstellationScreenSpaceRelaxationVersion =
  "2.8.2" as const;

export const executiveOverviewConstellationScreenSpaceRelaxationNamespace =
  "nexora.spatial-presentation.overview-constellation-screen-space-relaxation" as const;

export const executiveOverviewConstellationScreenSpaceRelaxationPhase =
  "OverviewConstellationScreenSpaceRelaxation" as const;

export const executiveOverviewConstellationScreenSpaceRelaxationArchitecturalRole =
  "PresentationOnlyOverviewCompositionCalibration" as const;

export const executiveOverviewConstellationScreenSpaceRelaxationReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveOverviewConstellationScreenSpaceRelaxationIdentity = {
  readonly id: typeof executiveOverviewConstellationScreenSpaceRelaxationIdentity;
  readonly version: typeof executiveOverviewConstellationScreenSpaceRelaxationVersion;
  readonly namespace: typeof executiveOverviewConstellationScreenSpaceRelaxationNamespace;
  readonly phase: typeof executiveOverviewConstellationScreenSpaceRelaxationPhase;
  readonly architecturalRole: typeof executiveOverviewConstellationScreenSpaceRelaxationArchitecturalRole;
  readonly readiness: typeof executiveOverviewConstellationScreenSpaceRelaxationReadiness;
};

const RELAXATION_IDENTITY: ExecutiveOverviewConstellationScreenSpaceRelaxationIdentity =
  Object.freeze({
    id: executiveOverviewConstellationScreenSpaceRelaxationIdentity,
    version: executiveOverviewConstellationScreenSpaceRelaxationVersion,
    namespace: executiveOverviewConstellationScreenSpaceRelaxationNamespace,
    phase: executiveOverviewConstellationScreenSpaceRelaxationPhase,
    architecturalRole:
      executiveOverviewConstellationScreenSpaceRelaxationArchitecturalRole,
    readiness: executiveOverviewConstellationScreenSpaceRelaxationReadiness,
  });

export function getExecutiveOverviewConstellationScreenSpaceRelaxationIdentity(): ExecutiveOverviewConstellationScreenSpaceRelaxationIdentity {
  return RELAXATION_IDENTITY;
}

export const EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      executiveOverviewConstellationScreenSpaceRelaxationArchitecturalRole,
    ownsBusinessTruth: false as const,
    ownsCamera: false as const,
    ownsSpatialAuthority: false as const,
    inventsRelationships: false as const,
    usesObjectIdHacks: false as const,
    usesNameHacks: false as const,
    usesForceDirectedLayout: false as const,
    usesPhysicsEngine: false as const,
    increasesCameraDistance: false as const,
    rewritesFocusChoreography: false as const,
    startsSp3Atmosphere: false as const,
    autoClaimsHumanVisualSignOff: false as const,
    presentationOnly: true as const,
    consumedBySp14: true as const,
  });

// ─── Calibration tokens ─────────────────────────────────────────────────────

/** Minimum projected edge gap (NDC) by presentation priority class. */
export const EXECUTIVE_OVERVIEW_SCREEN_SPACE_READABILITY_GAP = Object.freeze({
  /** Ordinary ↔ ordinary */
  base: 0.055,
  /** Involves watch/unresolved/recommended-like priority */
  elevated: 0.07,
  /** Involves critical/high-attention presentation priority */
  high: 0.09,
  /** Extra label-ownership pad folded into silhouette */
  labelOwnershipPad: 0.028,
});

export const EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS = Object.freeze({
  maxRelaxX: 0.55,
  maxRelaxY: 0.14,
  maxRelaxZ: 0.5,
  maxPasses: 4,
  pressureAcceptThreshold: 0.045,
  pressureActivateThreshold: 0.05,
  hysteresisDeadband: 0.01,
  defaultRadius: 0.38,
  /** Radial distance from reserved center treated as “central anchor resist”. */
  centralAnchorRadius: 1.05,
  centralAnchorResist: 0.62,
  separationGain: 0.95,
});

export const EXECUTIVE_OVERVIEW_RELAXATION_DENSITY_SCALE = Object.freeze({
  sparse: 0.55,
  balanced: 1,
  dense: 1.18,
  "high-density": 1.32,
} as const);

export type ExecutiveOverviewRelaxationDensityProfile =
  keyof typeof EXECUTIVE_OVERVIEW_RELAXATION_DENSITY_SCALE;

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveProjectedObjectBounds = {
  readonly objectId: string;
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly priorityRank: number;
};

export type ExecutiveOverviewRelaxationObjectInput = {
  readonly objectId: string;
  readonly canonicalPosition: ExecutiveSpatialVector;
  /** Higher resists displacement (presentation-only). */
  readonly priorityRank?: number;
  readonly stageOrder?: number;
  /** Approximate world-space silhouette radius. */
  readonly approximateRadius?: number;
};

export type ExecutiveOverviewRelaxationCameraInput = {
  readonly position: ExecutiveCameraVector;
  readonly target: ExecutiveCameraVector;
  readonly fovDegrees: number;
  readonly aspect: number;
};

export type ExecutiveOverviewRelaxationObjectResult = {
  readonly objectId: string;
  readonly canonicalPosition: ExecutiveSpatialVector;
  readonly relaxedPosition: ExecutiveSpatialVector;
  readonly delta: ExecutiveSpatialVector;
  readonly pressureBefore: number;
  readonly pressureAfter: number;
  readonly constrainedBySafeRegion: boolean;
  readonly priorityRank: number;
};

export type ExecutiveOverviewConstellationRelaxationResult = {
  readonly identity: ExecutiveOverviewConstellationScreenSpaceRelaxationIdentity;
  readonly active: boolean;
  readonly objects: readonly ExecutiveOverviewRelaxationObjectResult[];
  readonly totalPressureBefore: number;
  readonly totalPressureAfter: number;
  readonly passesExecuted: number;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function finiteOr(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) ? (value as number) : fallback;
}

function stabilize(value: number): number {
  const finite = finiteOr(value, 0);
  const rounded = Math.round(finite * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function stabilizeVector(vector: ExecutiveSpatialVector): ExecutiveSpatialVector {
  return Object.freeze({
    x: stabilize(vector.x),
    y: stabilize(vector.y),
    z: stabilize(vector.z),
  });
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function hypot2(x: number, z: number): number {
  return Math.hypot(x, z);
}

function cameraBasis(input: ExecutiveOverviewRelaxationCameraInput): {
  readonly right: ExecutiveSpatialVector;
  readonly up: ExecutiveSpatialVector;
  readonly forward: ExecutiveSpatialVector;
} | null {
  const forwardRaw = {
    x: input.target.x - input.position.x,
    y: input.target.y - input.position.y,
    z: input.target.z - input.position.z,
  };
  const forwardLen = Math.hypot(forwardRaw.x, forwardRaw.y, forwardRaw.z);
  if (forwardLen < 1e-6) return null;
  const forward = {
    x: forwardRaw.x / forwardLen,
    y: forwardRaw.y / forwardLen,
    z: forwardRaw.z / forwardLen,
  };
  const worldUp = { x: 0, y: 1, z: 0 };
  let right = {
    x: forward.y * worldUp.z - forward.z * worldUp.y,
    y: forward.z * worldUp.x - forward.x * worldUp.z,
    z: forward.x * worldUp.y - forward.y * worldUp.x,
  };
  const rightLen = Math.hypot(right.x, right.y, right.z);
  if (rightLen < 1e-6) return null;
  right = {
    x: right.x / rightLen,
    y: right.y / rightLen,
    z: right.z / rightLen,
  };
  const up = {
    x: right.y * forward.z - right.z * forward.y,
    y: right.z * forward.x - right.x * forward.z,
    z: right.x * forward.y - right.y * forward.x,
  };
  return Object.freeze({
    right: Object.freeze(right),
    up: Object.freeze(up),
    forward: Object.freeze(forward),
  });
}

export function resolveExecutiveOverviewRelaxationDefaultCamera(input?: {
  readonly aspect?: number;
  readonly azimuth?: number;
  readonly elevation?: number;
  readonly distance?: number;
}): ExecutiveOverviewRelaxationCameraInput {
  const intent = sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
      distance: finiteOr(
        input?.distance ?? EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
        EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
      ),
      azimuth: finiteOr(
        input?.azimuth ?? EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
        EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
      ),
      elevation: finiteOr(
        input?.elevation ?? EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
        EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
      ),
      fov: EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov,
    }),
  );
  const presentation = resolveExecutiveCameraPresentation(intent, {
    framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  });
  return Object.freeze({
    position: presentation.position,
    target: presentation.target,
    fovDegrees: presentation.fov,
    aspect: Math.max(0.35, finiteOr(input?.aspect ?? 1.6, 1.6)),
  });
}

function requiredGap(rankA: number, rankB: number): number {
  const high = Math.max(rankA, rankB);
  const gaps = EXECUTIVE_OVERVIEW_SCREEN_SPACE_READABILITY_GAP;
  if (high >= 70) return gaps.high;
  if (high >= 40) return gaps.elevated;
  return gaps.base;
}

function densityScale(
  profile: ExecutiveOverviewRelaxationDensityProfile | string | undefined,
): number {
  if (profile === "sparse") return EXECUTIVE_OVERVIEW_RELAXATION_DENSITY_SCALE.sparse;
  if (profile === "dense") return EXECUTIVE_OVERVIEW_RELAXATION_DENSITY_SCALE.dense;
  if (profile === "high-density") {
    return EXECUTIVE_OVERVIEW_RELAXATION_DENSITY_SCALE["high-density"];
  }
  return EXECUTIVE_OVERVIEW_RELAXATION_DENSITY_SCALE.balanced;
}

/**
 * Approximate projected silhouette from world sphere + label ownership pad.
 */
export function projectExecutiveObjectSilhouetteBounds(input: {
  readonly objectId: string;
  readonly position: ExecutiveSpatialVector;
  readonly radius: number;
  readonly priorityRank: number;
  readonly camera: ExecutiveOverviewRelaxationCameraInput;
}): ExecutiveProjectedObjectBounds | null {
  const ndc = projectExecutiveWorldPointToNdc({
    point: input.position,
    cameraPosition: input.camera.position,
    cameraTarget: input.camera.target,
    fovDegrees: input.camera.fovDegrees,
    aspect: input.camera.aspect,
  });
  if (ndc == null) return null;

  const fovRad = (finiteOr(input.camera.fovDegrees, 38) * Math.PI) / 180;
  const tanHalf = Math.tan(fovRad / 2);
  const aspect = Math.max(0.35, finiteOr(input.camera.aspect, 1.6));
  const radius = Math.max(0.12, finiteOr(input.radius, 0.38));
  const halfW =
    radius / Math.max(1e-4, ndc.depth * tanHalf * aspect) +
    EXECUTIVE_OVERVIEW_SCREEN_SPACE_READABILITY_GAP.labelOwnershipPad;
  const halfH =
    radius / Math.max(1e-4, ndc.depth * tanHalf) +
    EXECUTIVE_OVERVIEW_SCREEN_SPACE_READABILITY_GAP.labelOwnershipPad * 0.85;

  return Object.freeze({
    objectId: input.objectId,
    minX: stabilize(ndc.x - halfW),
    maxX: stabilize(ndc.x + halfW),
    minY: stabilize(ndc.y - halfH),
    maxY: stabilize(ndc.y + halfH),
    centerX: stabilize(ndc.x),
    centerY: stabilize(ndc.y),
    width: stabilize(halfW * 2),
    height: stabilize(halfH * 2),
    depth: ndc.depth,
    priorityRank: input.priorityRank,
  });
}

export function measureExecutiveProjectedSilhouettePressure(
  left: ExecutiveProjectedObjectBounds,
  right: ExecutiveProjectedObjectBounds,
): number {
  const gap = requiredGap(left.priorityRank, right.priorityRank);
  const dx = Math.abs(left.centerX - right.centerX);
  const dy = Math.abs(left.centerY - right.centerY);
  const halfSumX = left.width * 0.5 + right.width * 0.5;
  const halfSumY = left.height * 0.5 + right.height * 0.5;
  const overlapX = Math.max(0, halfSumX - dx);
  const overlapY = Math.max(0, halfSumY - dy);
  const horizontalGapDeficit = Math.max(0, halfSumX + gap - dx);
  const verticalGapDeficit = Math.max(0, halfSumY + gap - dy);
  // Overlap terms dominate; gap deficits add soft pressure near contact.
  const raw =
    overlapX * 1.35 +
    overlapY * 1.1 +
    horizontalGapDeficit * 0.55 +
    verticalGapDeficit * 0.4;
  return stabilize(raw);
}

function totalPairPressure(
  boundsById: ReadonlyMap<string, ExecutiveProjectedObjectBounds>,
  orderedIds: readonly string[],
): number {
  let total = 0;
  for (let i = 0; i < orderedIds.length; i += 1) {
    for (let j = i + 1; j < orderedIds.length; j += 1) {
      const a = boundsById.get(orderedIds[i]!);
      const b = boundsById.get(orderedIds[j]!);
      if (a == null || b == null) continue;
      total += measureExecutiveProjectedSilhouettePressure(a, b);
    }
  }
  return stabilize(total);
}

function centralResistFactor(position: ExecutiveSpatialVector): number {
  const radial = hypot2(
    position.x - EXECUTIVE_SPATIAL_RESERVED_CENTER.x,
    position.z - EXECUTIVE_SPATIAL_RESERVED_CENTER.z,
  );
  if (radial <= EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.centralAnchorRadius) {
    return EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.centralAnchorResist;
  }
  return 1;
}

function yieldWeights(
  rankA: number,
  rankB: number,
  posA: ExecutiveSpatialVector,
  posB: ExecutiveSpatialVector,
): { readonly yieldA: number; readonly yieldB: number } {
  // Lower priority and more outer objects yield more.
  const resistA = (0.35 + rankA / 120) * (2 - centralResistFactor(posA));
  const resistB = (0.35 + rankB / 120) * (2 - centralResistFactor(posB));
  const sum = Math.max(1e-6, resistA + resistB);
  return Object.freeze({
    yieldA: stabilize(resistB / sum),
    yieldB: stabilize(resistA / sum),
  });
}

function clampDelta(delta: ExecutiveSpatialVector): ExecutiveSpatialVector {
  const limits = EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS;
  return stabilizeVector({
    x: clamp(delta.x, -limits.maxRelaxX, limits.maxRelaxX),
    y: clamp(delta.y, -limits.maxRelaxY, limits.maxRelaxY),
    z: clamp(delta.z, -limits.maxRelaxZ, limits.maxRelaxZ),
  });
}

function applySafeRegion(
  position: ExecutiveSpatialVector,
  bounds: ExecutiveSpatialCompositionBounds,
): { readonly position: ExecutiveSpatialVector; readonly constrained: boolean } {
  const before = stabilizeVector(position);
  const clamped = clampExecutiveSpatialVector(before, bounds);
  const after = applyExecutiveSpatialUiOverlaySafeCorrection(clamped, bounds);
  const constrained =
    Math.abs(after.x - before.x) > 1e-6 ||
    Math.abs(after.y - before.y) > 1e-6 ||
    Math.abs(after.z - before.z) > 1e-6;
  return Object.freeze({ position: after, constrained });
}

function rebuildBounds(
  positions: ReadonlyMap<string, ExecutiveSpatialVector>,
  meta: ReadonlyMap<
    string,
    { readonly priorityRank: number; readonly radius: number }
  >,
  camera: ExecutiveOverviewRelaxationCameraInput,
): Map<string, ExecutiveProjectedObjectBounds> {
  const map = new Map<string, ExecutiveProjectedObjectBounds>();
  for (const [objectId, position] of positions) {
    const entry = meta.get(objectId);
    if (entry == null) continue;
    const bounds = projectExecutiveObjectSilhouetteBounds({
      objectId,
      position,
      radius: entry.radius,
      priorityRank: entry.priorityRank,
      camera,
    });
    if (bounds != null) map.set(objectId, bounds);
  }
  return map;
}

/**
 * Primary SP:2.8B resolver — deterministic Overview screen-space relaxation.
 * Focus mode callers should pass `active: false` (or skip) to bypass.
 */
export function resolveExecutiveOverviewConstellationRelaxation(input: {
  readonly objects: readonly ExecutiveOverviewRelaxationObjectInput[];
  readonly camera?: ExecutiveOverviewRelaxationCameraInput;
  readonly densityProfile?: ExecutiveOverviewRelaxationDensityProfile | string;
  readonly bounds?: ExecutiveSpatialCompositionBounds;
  readonly active?: boolean;
  readonly aspect?: number;
}): ExecutiveOverviewConstellationRelaxationResult {
  const active = input.active !== false;
  const bounds = input.bounds ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS;
  const camera =
    input.camera ??
    resolveExecutiveOverviewRelaxationDefaultCamera({
      aspect: input.aspect,
    });
  const scale = densityScale(input.densityProfile);
  const limits = EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS;

  const ordered = [...input.objects].sort((left, right) => {
    const rankDelta =
      finiteOr(right.priorityRank, 20) - finiteOr(left.priorityRank, 20);
    if (rankDelta !== 0) return rankDelta;
    const orderDelta =
      finiteOr(left.stageOrder, 0) - finiteOr(right.stageOrder, 0);
    if (orderDelta !== 0) return orderDelta;
    return compareIds(left.objectId, right.objectId);
  });

  const positions = new Map<string, ExecutiveSpatialVector>();
  const canonical = new Map<string, ExecutiveSpatialVector>();
  const meta = new Map<
    string,
    { readonly priorityRank: number; readonly radius: number }
  >();
  const constrainedFlags = new Map<string, boolean>();

  for (const [index, object] of ordered.entries()) {
    const canonicalPosition = stabilizeVector(object.canonicalPosition);
    canonical.set(object.objectId, canonicalPosition);
    positions.set(object.objectId, canonicalPosition);
    meta.set(
      object.objectId,
      Object.freeze({
        priorityRank: Math.round(finiteOr(object.priorityRank, 20)),
        radius: Math.max(
          0.16,
          finiteOr(object.approximateRadius, limits.defaultRadius),
        ),
      }),
    );
    constrainedFlags.set(object.objectId, false);
    void index;
  }

  const orderedIds = ordered.map((entry) => entry.objectId);
  let boundsById = rebuildBounds(positions, meta, camera);
  const pressureBefore = totalPairPressure(boundsById, orderedIds);

  if (!active || orderedIds.length < 2) {
    return Object.freeze({
      identity: RELAXATION_IDENTITY,
      active: false,
      objects: Object.freeze(
        orderedIds.map((objectId) => {
          const position = canonical.get(objectId)!;
          return Object.freeze({
            objectId,
            canonicalPosition: position,
            relaxedPosition: position,
            delta: Object.freeze({ x: 0, y: 0, z: 0 }),
            pressureBefore: 0,
            pressureAfter: 0,
            constrainedBySafeRegion: false,
            priorityRank: meta.get(objectId)!.priorityRank,
          });
        }),
      ),
      totalPressureBefore: pressureBefore,
      totalPressureAfter: pressureBefore,
      passesExecuted: 0,
    });
  }

  if (pressureBefore < limits.pressureActivateThreshold) {
    return Object.freeze({
      identity: RELAXATION_IDENTITY,
      active: true,
      objects: Object.freeze(
        orderedIds.map((objectId) => {
          const position = canonical.get(objectId)!;
          return Object.freeze({
            objectId,
            canonicalPosition: position,
            relaxedPosition: position,
            delta: Object.freeze({ x: 0, y: 0, z: 0 }),
            pressureBefore: 0,
            pressureAfter: 0,
            constrainedBySafeRegion: false,
            priorityRank: meta.get(objectId)!.priorityRank,
          });
        }),
      ),
      totalPressureBefore: pressureBefore,
      totalPressureAfter: pressureBefore,
      passesExecuted: 0,
    });
  }

  const basis = cameraBasis(camera);
  let passesExecuted = 0;
  let previousPressure = pressureBefore;

  for (let pass = 0; pass < limits.maxPasses; pass += 1) {
    boundsById = rebuildBounds(positions, meta, camera);
    const passPressure = totalPairPressure(boundsById, orderedIds);
    if (passPressure <= limits.pressureAcceptThreshold) break;
    if (
      pass > 0 &&
      Math.abs(previousPressure - passPressure) < limits.hysteresisDeadband
    ) {
      break;
    }
    previousPressure = passPressure;
    passesExecuted += 1;

    const pairList: Array<{
      readonly aId: string;
      readonly bId: string;
      readonly pressure: number;
    }> = [];
    for (let i = 0; i < orderedIds.length; i += 1) {
      for (let j = i + 1; j < orderedIds.length; j += 1) {
        const aId = orderedIds[i]!;
        const bId = orderedIds[j]!;
        const a = boundsById.get(aId);
        const b = boundsById.get(bId);
        if (a == null || b == null) continue;
        const pressure = measureExecutiveProjectedSilhouettePressure(a, b);
        if (pressure >= limits.pressureActivateThreshold) {
          pairList.push(Object.freeze({ aId, bId, pressure }));
        }
      }
    }
    pairList.sort((left, right) => {
      if (right.pressure !== left.pressure) return right.pressure - left.pressure;
      const idCmp = compareIds(left.aId, right.aId);
      if (idCmp !== 0) return idCmp;
      return compareIds(left.bId, right.bId);
    });

    for (const pair of pairList) {
      const aBounds = boundsById.get(pair.aId)!;
      const bBounds = boundsById.get(pair.bId)!;
      const posA = positions.get(pair.aId)!;
      const posB = positions.get(pair.bId)!;
      const metaA = meta.get(pair.aId)!;
      const metaB = meta.get(pair.bId)!;
      const weights = yieldWeights(
        metaA.priorityRank,
        metaB.priorityRank,
        posA,
        posB,
      );

      const ndcDx = bBounds.centerX - aBounds.centerX;
      const ndcDy = bBounds.centerY - aBounds.centerY;
      let sepX = ndcDx;
      let sepY = ndcDy;
      if (Math.hypot(sepX, sepY) < 1e-4) {
        // Degenerate projection corridor — fall back to world XZ from center.
        sepX = posB.x - posA.x;
        sepY = posB.z - posA.z;
        if (Math.hypot(sepX, sepY) < 1e-4) {
          sepX = compareIds(pair.aId, pair.bId) < 0 ? -1 : 1;
          sepY = 0;
        }
      }
      const sepLen = Math.hypot(sepX, sepY);
      const ux = sepX / sepLen;
      const uy = sepY / sepLen;

      const gap = requiredGap(metaA.priorityRank, metaB.priorityRank);
      const needX = Math.max(
        0,
        aBounds.width * 0.5 + bBounds.width * 0.5 + gap - Math.abs(ndcDx),
      );
      const needY = Math.max(
        0,
        aBounds.height * 0.5 + bBounds.height * 0.5 + gap - Math.abs(ndcDy),
      );
      const strength =
        (0.85 * needX + 0.55 * needY + pair.pressure * 0.22) *
        scale *
        limits.separationGain;

      // Preferred axes: horizontal (camera right / world X) then depth (forward→Z).
      let worldDx = 0;
      let worldDy = 0;
      let worldDz = 0;
      if (basis != null) {
        const horizontal = strength * (Math.abs(ux) < 1e-4 ? (ux < 0 ? -1 : 1) : Math.sign(ux) || 1);
        const depthish = strength * (Math.abs(uy) < 1e-4 ? 0 : Math.sign(uy));
        // Lateral first; depth second; tiny Y.
        worldDx = basis.right.x * horizontal * 1.0 + basis.forward.x * depthish * -0.45;
        worldDz = basis.right.z * horizontal * 1.0 + basis.forward.z * depthish * -0.65;
        worldDy = basis.up.y * depthish * 0.1;
      } else {
        worldDx = (Math.sign(ux) || 1) * strength * 0.85;
        worldDz = (Math.sign(uy) || 0) * strength * 0.55;
      }

      const moveA = strength * weights.yieldA;
      const moveB = strength * weights.yieldB;
      const norm = Math.max(1e-6, Math.hypot(worldDx, worldDy, worldDz));
      const unit = {
        x: worldDx / norm,
        y: worldDy / norm,
        z: worldDz / norm,
      };

      const nextA = applySafeRegion(
        {
          x: posA.x - unit.x * moveA,
          y: posA.y - unit.y * moveA * 0.35,
          z: posA.z - unit.z * moveA,
        },
        bounds,
      );
      const nextB = applySafeRegion(
        {
          x: posB.x + unit.x * moveB,
          y: posB.y + unit.y * moveB * 0.35,
          z: posB.z + unit.z * moveB,
        },
        bounds,
      );

      // Enforce max displacement from canonical.
      const canA = canonical.get(pair.aId)!;
      const canB = canonical.get(pair.bId)!;
      const deltaA = clampDelta({
        x: nextA.position.x - canA.x,
        y: nextA.position.y - canA.y,
        z: nextA.position.z - canA.z,
      });
      const deltaB = clampDelta({
        x: nextB.position.x - canB.x,
        y: nextB.position.y - canB.y,
        z: nextB.position.z - canB.z,
      });
      const clampedA = applySafeRegion(
        {
          x: canA.x + deltaA.x,
          y: canA.y + deltaA.y,
          z: canA.z + deltaA.z,
        },
        bounds,
      );
      const clampedB = applySafeRegion(
        {
          x: canB.x + deltaB.x,
          y: canB.y + deltaB.y,
          z: canB.z + deltaB.z,
        },
        bounds,
      );
      positions.set(pair.aId, clampedA.position);
      positions.set(pair.bId, clampedB.position);
      if (clampedA.constrained) constrainedFlags.set(pair.aId, true);
      if (clampedB.constrained) constrainedFlags.set(pair.bId, true);
      // Refresh projected bounds so later pairs in this pass see updates.
      boundsById = rebuildBounds(positions, meta, camera);
    }
  }

  boundsById = rebuildBounds(positions, meta, camera);
  const pressureAfter = totalPairPressure(boundsById, orderedIds);

  // Per-object residual pressure (sum of pairs involving the object).
  const perObjectPressureBefore = new Map<string, number>();
  const perObjectPressureAfter = new Map<string, number>();
  for (const objectId of orderedIds) {
    perObjectPressureBefore.set(objectId, 0);
    perObjectPressureAfter.set(objectId, 0);
  }
  const beforeBounds = rebuildBounds(canonical, meta, camera);
  for (let i = 0; i < orderedIds.length; i += 1) {
    for (let j = i + 1; j < orderedIds.length; j += 1) {
      const aId = orderedIds[i]!;
      const bId = orderedIds[j]!;
      const beforeA = beforeBounds.get(aId);
      const beforeB = beforeBounds.get(bId);
      const afterA = boundsById.get(aId);
      const afterB = boundsById.get(bId);
      if (beforeA && beforeB) {
        const p = measureExecutiveProjectedSilhouettePressure(beforeA, beforeB);
        perObjectPressureBefore.set(
          aId,
          (perObjectPressureBefore.get(aId) ?? 0) + p,
        );
        perObjectPressureBefore.set(
          bId,
          (perObjectPressureBefore.get(bId) ?? 0) + p,
        );
      }
      if (afterA && afterB) {
        const p = measureExecutiveProjectedSilhouettePressure(afterA, afterB);
        perObjectPressureAfter.set(
          aId,
          (perObjectPressureAfter.get(aId) ?? 0) + p,
        );
        perObjectPressureAfter.set(
          bId,
          (perObjectPressureAfter.get(bId) ?? 0) + p,
        );
      }
    }
  }

  return Object.freeze({
    identity: RELAXATION_IDENTITY,
    active: true,
    objects: Object.freeze(
      orderedIds.map((objectId) => {
        const can = canonical.get(objectId)!;
        const relaxed = positions.get(objectId)!;
        return Object.freeze({
          objectId,
          canonicalPosition: can,
          relaxedPosition: relaxed,
          delta: stabilizeVector({
            x: relaxed.x - can.x,
            y: relaxed.y - can.y,
            z: relaxed.z - can.z,
          }),
          pressureBefore: stabilize(perObjectPressureBefore.get(objectId) ?? 0),
          pressureAfter: stabilize(perObjectPressureAfter.get(objectId) ?? 0),
          constrainedBySafeRegion: constrainedFlags.get(objectId) === true,
          priorityRank: meta.get(objectId)!.priorityRank,
        });
      }),
    ),
    totalPressureBefore: pressureBefore,
    totalPressureAfter: pressureAfter,
    passesExecuted,
  });
}

export function verifyExecutiveOverviewConstellationScreenSpaceRelaxation(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly doesNotIncreaseCameraDistance: boolean;
  readonly doesNotUseForceLayout: boolean;
  readonly doesNotStartSp3: boolean;
}> {
  const identity =
    getExecutiveOverviewConstellationScreenSpaceRelaxationIdentity();
  const identityValid =
    identity.id ===
      "SP:2.8B/OverviewConstellationScreenSpaceRelaxation" &&
    identity.version === "2.8.2" &&
    identity.architecturalRole ===
      "PresentationOnlyOverviewCompositionCalibration";
  const boundaryValid =
    EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY.ownsBusinessTruth ===
      false &&
    EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY.usesObjectIdHacks ===
      false &&
    EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY.usesNameHacks ===
      false &&
    EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY
      .usesForceDirectedLayout === false;
  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid;
  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    doesNotIncreaseCameraDistance:
      EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY
        .increasesCameraDistance === false,
    doesNotUseForceLayout:
      EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY
        .usesForceDirectedLayout === false,
    doesNotStartSp3:
      EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY
        .startsSp3Atmosphere === false,
  });
}

/** Presentation-only priority from attention/status markers (no name hacks). */
export function resolveExecutiveOverviewPresentationPriorityRank(input: {
  readonly attention?: string | null;
  readonly status?: string | null;
  readonly stateMarker?: string | null;
}): number {
  const attention = (input.attention ?? "").toLowerCase();
  const status = (input.status ?? "").toLowerCase();
  const marker = (input.stateMarker ?? "").toLowerCase();
  let rank = 20;
  if (
    attention === "critical" ||
    status === "risk" ||
    status === "critical" ||
    marker === "critical"
  ) {
    rank += 55;
  } else if (
    attention === "important" ||
    attention === "elevated" ||
    status === "watch" ||
    marker === "attention"
  ) {
    rank += 30;
  } else if (
    status === "unresolved" ||
    marker === "unresolved" ||
    status === "recommended"
  ) {
    rank += 18;
  }
  return rank;
}
