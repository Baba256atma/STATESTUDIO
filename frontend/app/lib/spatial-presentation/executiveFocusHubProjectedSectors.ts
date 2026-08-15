/**
 * SP:4.1C — Focused Hub projected screen-space sector allocation.
 *
 * Presentation calibration only. Topology supplies directional intent;
 * sectors decide which readable screen-space region each related object owns.
 *
 * Not a new topology. Not SP:4.2 Hybrid/Network.
 */

import type { ExecutiveCameraVector } from "./executiveCameraFoundation.ts";
import { projectExecutiveWorldPointToNdc } from "./executiveFramingVisualCalibration.ts";
import {
  clampExecutiveSpatialVector,
  type ExecutiveSpatialCompositionBounds,
  type ExecutiveSpatialVector,
} from "./executiveSpatialComposition.ts";

/** Minimal footprint contract — avoids circular import with visual grammar. */
export type ExecutiveHubSectorBounds = {
  readonly effectiveFootprintRadius: number;
  readonly effectiveBoundingRadius: number;
  readonly scale: number;
};

const HUB_SECTOR_SEPARATION = Object.freeze({
  aspect: 16 / 9,
  focusWhitespaceGap: 0.62,
  hubRadiusMax: 2.95,
  minimumProjectedGapNdc: 0.06,
});

export const EXECUTIVE_FOCUS_HUB_SECTOR_IDS = Object.freeze([
  "right",
  "upper-right",
  "upper",
  "upper-left",
  "left",
  "lower-left",
  "lower",
  "lower-right",
] as const);

export type ExecutiveFocusHubSectorId =
  (typeof EXECUTIVE_FOCUS_HUB_SECTOR_IDS)[number];

/** Screen-space sector center angles (atan2(ndcY, ndcX) relative to focus). */
export const EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES = Object.freeze({
  right: 0,
  "upper-right": Math.PI / 4,
  upper: Math.PI / 2,
  "upper-left": (Math.PI * 3) / 4,
  left: Math.PI,
  "lower-left": (-Math.PI * 3) / 4,
  lower: -Math.PI / 2,
  "lower-right": -Math.PI / 4,
} as const satisfies Record<ExecutiveFocusHubSectorId, number>);

export const EXECUTIVE_FOCUS_HUB_SECTOR_POLICY = Object.freeze({
  sectorCount: EXECUTIVE_FOCUS_HUB_SECTOR_IDS.length,
  /** Projected envelope padding beyond silhouette radius (NDC). */
  projectedSafePaddingNdc: 0.022,
  /** Focus projected clear-zone padding (NDC). */
  focusProjectedClearPaddingNdc: 0.04,
  /** Primary label clearance boost in world Y for focused object. */
  primaryLabelClearanceBoost: 0.22,
  /** Max projected angular span considered a degenerate line (radians). */
  collinearityMaxSpanRad: (70 * Math.PI) / 180,
  /** Minimum screen-space angular separation between occupied sectors. */
  minOccupiedSectorSeparationRad: (30 * Math.PI) / 180,
  /** Prefer these sectors last for collapsed-thread. */
  collapsedPreferredSectors: Object.freeze([
    "lower",
    "lower-left",
    "lower-right",
    "left",
    "right",
  ] as const satisfies readonly ExecutiveFocusHubSectorId[]),
  /** Business objects avoid pure view-axis sectors when alternatives exist. */
  businessPreferredSectors: Object.freeze([
    "left",
    "right",
    "upper-left",
    "upper-right",
    "lower-left",
    "lower-right",
  ] as const satisfies readonly ExecutiveFocusHubSectorId[]),
  /** Prefer rear/upper sectors when preferred side is crowded. */
  businessFallbackSectors: Object.freeze([
    "upper-left",
    "upper-right",
    "left",
    "right",
    "lower-left",
    "lower-right",
  ] as const satisfies readonly ExecutiveFocusHubSectorId[]),
  maxPlacementPasses: 5,
  radialStep: 0.16,
  presentationPlaneBias: 0.18,
  viewAxisLateralMinimum: 0.85,
});

export type ExecutiveProjectedObjectBounds = {
  readonly subjectId: string;
  readonly centerNdcX: number;
  readonly centerNdcY: number;
  readonly halfWidthNdc: number;
  readonly halfHeightNdc: number;
  readonly radiusNdc: number;
  readonly safeRadiusNdc: number;
  readonly depth: number;
};

export type ExecutiveFocusHubSectorAssignment = {
  readonly subjectId: string;
  readonly sectorId: ExecutiveFocusHubSectorId;
  readonly preferredSectorId: ExecutiveFocusHubSectorId;
  readonly usedFallback: boolean;
};

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function stabilizeVector(vector: ExecutiveSpatialVector): ExecutiveSpatialVector {
  return Object.freeze({
    x: stabilize(vector.x),
    y: stabilize(vector.y),
    z: stabilize(vector.z),
  });
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

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function cameraBasis(
  cameraPosition: ExecutiveCameraVector,
  cameraTarget: ExecutiveCameraVector,
): Readonly<{
  readonly forward: ExecutiveSpatialVector;
  readonly right: ExecutiveSpatialVector;
  readonly up: ExecutiveSpatialVector;
}> {
  const fx = cameraTarget.x - cameraPosition.x;
  const fy = cameraTarget.y - cameraPosition.y;
  const fz = cameraTarget.z - cameraPosition.z;
  const fl = Math.hypot(fx, fy, fz) || 1;
  const forward = Object.freeze({ x: fx / fl, y: fy / fl, z: fz / fl });
  const worldUp = Object.freeze({ x: 0, y: 1, z: 0 });
  let rx = forward.y * worldUp.z - forward.z * worldUp.y;
  let ry = forward.z * worldUp.x - forward.x * worldUp.z;
  let rz = forward.x * worldUp.y - forward.y * worldUp.x;
  let rl = Math.hypot(rx, ry, rz);
  if (rl < 1e-6) {
    rx = 1;
    ry = 0;
    rz = 0;
    rl = 1;
  }
  const right = Object.freeze({ x: rx / rl, y: ry / rl, z: rz / rl });
  const up = Object.freeze({
    x: right.y * forward.z - right.z * forward.y,
    y: right.z * forward.x - right.x * forward.z,
    z: right.x * forward.y - right.y * forward.x,
  });
  return Object.freeze({ forward, right, up });
}

function clampPosition(
  position: ExecutiveSpatialVector,
  bounds: ExecutiveSpatialCompositionBounds,
): ExecutiveSpatialVector {
  // Hub satellites must not share the Dial corner collapse point.
  // Reject Dial via isSectorSafeForDial; clamp Stage bounds only here.
  return clampExecutiveSpatialVector(position, bounds);
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

function isSectorSafeForDial(
  focus: ExecutiveSpatialVector,
  worldAngle: number,
  radius: number,
  bounds: ExecutiveSpatialCompositionBounds,
): boolean {
  const candidate = clampPosition(
    stabilizeVector({
      x: focus.x + Math.cos(worldAngle) * radius,
      y: focus.y,
      z: focus.z + Math.sin(worldAngle) * radius,
    }),
    bounds,
  );
  // Dial/timeline bottom-right unsafe zone from SP:2.8A.
  if (candidate.x >= 1.5 && candidate.z >= 1.05) return false;
  return true;
}

/**
 * World XZ angle that places an object into the given screen-space sector
 * relative to focus under the canonical executive camera.
 */
export function resolveWorldAngleForHubSector(input: {
  readonly sectorId: ExecutiveFocusHubSectorId;
  readonly cameraPosition: ExecutiveCameraVector;
  readonly cameraTarget: ExecutiveCameraVector;
}): number {
  const screenAngle = EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[input.sectorId];
  const basis = cameraBasis(input.cameraPosition, input.cameraTarget);
  const sx = Math.cos(screenAngle);
  const sy = Math.sin(screenAngle);
  const wx = basis.right.x * sx + basis.up.x * sy;
  const wz = basis.right.z * sx + basis.up.z * sy;
  if (Math.hypot(wx, wz) < 1e-6) {
    return screenAngle;
  }
  return Math.atan2(wz, wx);
}

export function resolveExecutiveProjectedObjectBounds(input: {
  readonly subjectId: string;
  readonly position: ExecutiveSpatialVector;
  readonly bounds: ExecutiveHubSectorBounds;
  readonly cameraPosition: ExecutiveCameraVector;
  readonly cameraTarget: ExecutiveCameraVector;
  readonly cameraFov: number;
  readonly safePaddingNdc?: number;
}): ExecutiveProjectedObjectBounds | null {
  const center = projectExecutiveWorldPointToNdc({
    point: input.position,
    cameraPosition: input.cameraPosition,
    cameraTarget: input.cameraTarget,
    fovDegrees: input.cameraFov,
    aspect: HUB_SECTOR_SEPARATION.aspect,
  });
  if (center == null) return null;
  const depth = Math.max(
    0.35,
    Math.hypot(
      input.position.x - input.cameraPosition.x,
      input.position.y - input.cameraPosition.y,
      input.position.z - input.cameraPosition.z,
    ),
  );
  const fovRad = (input.cameraFov * Math.PI) / 180;
  const radiusNdc =
    input.bounds.effectiveBoundingRadius / (Math.tan(fovRad / 2) * depth);
  const pad =
    input.safePaddingNdc ??
    EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.projectedSafePaddingNdc;
  return Object.freeze({
    subjectId: input.subjectId,
    centerNdcX: stabilize(center.x),
    centerNdcY: stabilize(center.y),
    halfWidthNdc: stabilize(radiusNdc),
    halfHeightNdc: stabilize(radiusNdc),
    radiusNdc: stabilize(radiusNdc),
    safeRadiusNdc: stabilize(radiusNdc + pad),
    depth: stabilize(depth),
  });
}

export function projectedSafeEnvelopesOverlap(
  left: ExecutiveProjectedObjectBounds,
  right: ExecutiveProjectedObjectBounds,
): boolean {
  const dist = Math.hypot(
    left.centerNdcX - right.centerNdcX,
    left.centerNdcY - right.centerNdcY,
  );
  return dist + 1e-4 < left.safeRadiusNdc + right.safeRadiusNdc;
}

export function resolvePreferredHubSectorFromProjection(input: {
  readonly focusPosition: ExecutiveSpatialVector;
  readonly neighborPosition: ExecutiveSpatialVector;
  readonly cameraPosition: ExecutiveCameraVector;
  readonly cameraTarget: ExecutiveCameraVector;
  readonly cameraFov: number;
}): ExecutiveFocusHubSectorId {
  const focusNdc = projectExecutiveWorldPointToNdc({
    point: input.focusPosition,
    cameraPosition: input.cameraPosition,
    cameraTarget: input.cameraTarget,
    fovDegrees: input.cameraFov,
    aspect: HUB_SECTOR_SEPARATION.aspect,
  });
  const neighborNdc = projectExecutiveWorldPointToNdc({
    point: input.neighborPosition,
    cameraPosition: input.cameraPosition,
    cameraTarget: input.cameraTarget,
    fovDegrees: input.cameraFov,
    aspect: HUB_SECTOR_SEPARATION.aspect,
  });
  let angle: number;
  if (focusNdc == null || neighborNdc == null) {
    angle = Math.atan2(
      input.neighborPosition.z - input.focusPosition.z,
      input.neighborPosition.x - input.focusPosition.x,
    );
  } else {
    const dx = neighborNdc.x - focusNdc.x;
    const dy = neighborNdc.y - focusNdc.y;
    if (Math.hypot(dx, dy) < 1e-5) {
      angle = Math.atan2(
        input.neighborPosition.z - input.focusPosition.z,
        input.neighborPosition.x - input.focusPosition.x,
      );
    } else {
      angle = Math.atan2(dy, dx);
    }
  }
  let best: ExecutiveFocusHubSectorId = "right";
  let bestDelta = Number.POSITIVE_INFINITY;
  for (const sectorId of EXECUTIVE_FOCUS_HUB_SECTOR_IDS) {
    const delta = angularDelta(
      angle,
      EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[sectorId],
    );
    if (
      delta < bestDelta - 1e-9 ||
      (Math.abs(delta - bestDelta) <= 1e-9 &&
        compareIds(sectorId, best) < 0)
    ) {
      bestDelta = delta;
      best = sectorId;
    }
  }
  return best;
}

function nearestFreeSector(input: {
  readonly preferred: ExecutiveFocusHubSectorId;
  readonly occupied: ReadonlySet<ExecutiveFocusHubSectorId>;
  readonly orderedCandidates?: readonly ExecutiveFocusHubSectorId[];
}): ExecutiveFocusHubSectorId | null {
  const order = input.orderedCandidates ?? EXECUTIVE_FOCUS_HUB_SECTOR_IDS;
  if (!input.occupied.has(input.preferred) && order.includes(input.preferred)) {
    return input.preferred;
  }
  let best: ExecutiveFocusHubSectorId | null = null;
  let bestDelta = Number.POSITIVE_INFINITY;
  for (const sectorId of order) {
    if (input.occupied.has(sectorId)) continue;
    const delta = angularDelta(
      EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[input.preferred],
      EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[sectorId],
    );
    if (
      best == null ||
      delta < bestDelta - 1e-9 ||
      (Math.abs(delta - bestDelta) <= 1e-9 && compareIds(sectorId, best) < 0)
    ) {
      best = sectorId;
      bestDelta = delta;
    }
  }
  return best;
}

export function detectDegenerateHubCollinearity(input: {
  readonly focusProjected: ExecutiveProjectedObjectBounds;
  readonly neighborProjected: readonly ExecutiveProjectedObjectBounds[];
}): boolean {
  if (input.neighborProjected.length < 3) return false;
  const angles = input.neighborProjected.map((entry) =>
    Math.atan2(
      entry.centerNdcY - input.focusProjected.centerNdcY,
      entry.centerNdcX - input.focusProjected.centerNdcX,
    ),
  );
  const sorted = [...angles].sort((a, b) => a - b);
  let maxGap = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    const a = sorted[i]!;
    const b = sorted[(i + 1) % sorted.length]!;
    const gap =
      i + 1 === sorted.length ? a * 0 + (sorted[0]! + Math.PI * 2 - a) : b - a;
    maxGap = Math.max(maxGap, gap);
  }
  // Degenerate when neighbors occupy a narrow band (large empty arc).
  const occupiedSpan = Math.PI * 2 - maxGap;
  return occupiedSpan <= EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.collinearityMaxSpanRad;
}

export type HubSectorNeighborInput = {
  readonly subjectId: string;
  readonly position: ExecutiveSpatialVector;
  readonly bounds: ExecutiveHubSectorBounds;
  readonly priority: number;
  readonly visualRole: string;
};

export type AllocateExecutiveFocusHubSectorsInput = {
  readonly focus: {
    readonly subjectId: string;
    readonly position: ExecutiveSpatialVector;
    readonly bounds: ExecutiveHubSectorBounds;
  };
  readonly neighbors: readonly HubSectorNeighborInput[];
  readonly collapsedThread?: HubSectorNeighborInput | null;
  readonly hubRadius: number;
  readonly bounds: ExecutiveSpatialCompositionBounds;
  readonly cameraPosition: ExecutiveCameraVector;
  readonly cameraTarget: ExecutiveCameraVector;
  readonly cameraFov: number;
};

export type AllocateExecutiveFocusHubSectorsResult = {
  readonly hubRadius: number;
  readonly assignments: readonly ExecutiveFocusHubSectorAssignment[];
  readonly placements: ReadonlyMap<string, ExecutiveSpatialVector>;
  readonly scaleOverrides: ReadonlyMap<string, number>;
  readonly degenerateRedistributed: boolean;
  readonly usedZOnlyEscape: false;
};

function neighborPriority(entry: HubSectorNeighborInput): number {
  return entry.priority;
}

/**
 * Deterministic projected sector allocation for focused Hub composition.
 */
export function allocateExecutiveFocusHubSectors(
  input: AllocateExecutiveFocusHubSectorsInput,
): AllocateExecutiveFocusHubSectorsResult {
  const maxNeighbor = input.neighbors.reduce(
    (max, entry) => Math.max(max, entry.bounds.effectiveFootprintRadius),
    0,
  );
  const clearRadius = stabilize(
    input.focus.bounds.effectiveFootprintRadius +
      maxNeighbor +
      HUB_SECTOR_SEPARATION.focusWhitespaceGap,
  );
  let hubRadius = stabilize(
    Math.min(
      HUB_SECTOR_SEPARATION.hubRadiusMax,
      Math.max(input.hubRadius, clearRadius),
    ),
  );

  const ranked = [...input.neighbors].sort((left, right) => {
    const priorityDelta = neighborPriority(right) - neighborPriority(left);
    if (priorityDelta !== 0) return priorityDelta;
    return compareIds(left.subjectId, right.subjectId);
  });

  const assignments: ExecutiveFocusHubSectorAssignment[] = [];
  const occupied = new Set<ExecutiveFocusHubSectorId>();
  const preferredById = new Map<string, ExecutiveFocusHubSectorId>();
  const placementSubjects = new Map<string, HubSectorNeighborInput>();
  for (const neighbor of ranked) {
    placementSubjects.set(neighbor.subjectId, neighbor);
  }
  if (input.collapsedThread != null) {
    placementSubjects.set(
      input.collapsedThread.subjectId,
      input.collapsedThread,
    );
  }

  const scaleOverrides = new Map<string, number>();
  const placements = new Map<string, ExecutiveSpatialVector>();

  const scaledBoundsFor = (subject: HubSectorNeighborInput): ExecutiveHubSectorBounds => {
    const scale = scaleOverrides.get(subject.subjectId) ?? subject.bounds.scale;
    const ratio = scale / Math.max(subject.bounds.scale, 1e-6);
    return Object.freeze({
      effectiveFootprintRadius: subject.bounds.effectiveFootprintRadius * ratio,
      effectiveBoundingRadius: subject.bounds.effectiveBoundingRadius * ratio,
      scale,
    });
  };

  const basis = cameraBasis(input.cameraPosition, input.cameraTarget);

  const computePlacement = (
    assignment: ExecutiveFocusHubSectorAssignment,
    radiusBoost: number,
    lateralSign: number,
    lateralMagnitude: number,
  ): ExecutiveSpatialVector | null => {
    const subject = placementSubjects.get(assignment.subjectId);
    if (subject == null) return null;
    const worldAngle = resolveWorldAngleForHubSector({
      sectorId: assignment.sectorId,
      cameraPosition: input.cameraPosition,
      cameraTarget: input.cameraTarget,
    });
    const scale = scaleOverrides.get(subject.subjectId) ?? subject.bounds.scale;
    const scaleRatio = scale / Math.max(subject.bounds.scale, 1e-6);
    const footprint = subject.bounds.effectiveFootprintRadius * scaleRatio;
    const localClear =
      input.focus.bounds.effectiveFootprintRadius +
      footprint +
      HUB_SECTOR_SEPARATION.focusWhitespaceGap;
    const room = maxRadiusAlongRay(
      input.focus.position,
      worldAngle,
      input.bounds,
    );
    let placeRadius = Math.min(
      room,
      Math.max(hubRadius + radiusBoost, localClear),
    );
    if (
      !isSectorSafeForDial(
        input.focus.position,
        worldAngle,
        placeRadius,
        input.bounds,
      )
    ) {
      // Stay out of Dial AABB entirely — never collapse toward focus.
      let safeRadius = Math.min(placeRadius, room * 0.7);
      while (
        safeRadius > localClear + 0.12 &&
        !isSectorSafeForDial(
          input.focus.position,
          worldAngle,
          safeRadius,
          input.bounds,
        )
      ) {
        safeRadius -= 0.08;
      }
      if (
        !isSectorSafeForDial(
          input.focus.position,
          worldAngle,
          safeRadius,
          input.bounds,
        )
      ) {
        return null;
      }
      placeRadius = safeRadius;
    }
    // Lateral offset in camera-right projected onto XZ — breaks view-axis stacking.
    const forwardAlign = Math.abs(
      Math.cos(worldAngle) * basis.forward.x +
        Math.sin(worldAngle) * basis.forward.z,
    );
    const viewAxisBoost =
      forwardAlign > 0.72 ||
      assignment.sectorId === "lower" ||
      assignment.sectorId === "upper"
        ? EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.viewAxisLateralMinimum
        : 0;
    const lateral =
      lateralSign *
      Math.max(lateralMagnitude, viewAxisBoost) *
      (1 + (viewAxisBoost > 0 ? 0.35 : 0));
    const lx = basis.right.x * lateral;
    const lz = basis.right.z * lateral;
    return clampPosition(
      stabilizeVector({
        x:
          input.focus.position.x +
          Math.cos(worldAngle) * placeRadius +
          lx,
        y:
          subject.visualRole === "collapsed-thread"
            ? Math.max(input.bounds.minY + 0.08, input.focus.position.y - 0.42)
            : input.focus.position.y,
        z:
          input.focus.position.z +
          Math.sin(worldAngle) * placeRadius +
          lz,
      }),
      input.bounds,
    );
  };

  const projectedOf = (
    subjectId: string,
    position: ExecutiveSpatialVector,
    bounds: ExecutiveHubSectorBounds,
    focusPad = false,
  ) =>
    resolveExecutiveProjectedObjectBounds({
      subjectId,
      position,
      bounds,
      cameraPosition: input.cameraPosition,
      cameraTarget: input.cameraTarget,
      cameraFov: input.cameraFov,
      safePaddingNdc: focusPad
        ? EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.focusProjectedClearPaddingNdc
        : EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.projectedSafePaddingNdc,
    });

  const sectorConflictsProjected = (
    sectorId: ExecutiveFocusHubSectorId,
    subject: HubSectorNeighborInput,
  ): boolean => {
    const trialAssignment = Object.freeze({
      subjectId: subject.subjectId,
      sectorId,
      preferredSectorId: sectorId,
      usedFallback: false,
    });
    const worldAngle = resolveWorldAngleForHubSector({
      sectorId,
      cameraPosition: input.cameraPosition,
      cameraTarget: input.cameraTarget,
    });
    if (
      !isSectorSafeForDial(
        input.focus.position,
        worldAngle,
        Math.max(hubRadius, clearRadius),
        input.bounds,
      ) &&
      subject.visualRole !== "collapsed-thread"
    ) {
      // Prefer another sector over Dial-conflicted rays for business objects.
      return true;
    }
    const trial = computePlacement(trialAssignment, 0, compareIds(subject.subjectId, "n") < 0 ? -1 : 1, EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.presentationPlaneBias);
    if (trial == null) return true;
    if (trial.x >= 1.45 && trial.z >= 1.0) return true;
    const focusProjected = projectedOf(
      input.focus.subjectId,
      input.focus.position,
      input.focus.bounds,
      true,
    );
    const selfProjected = projectedOf(subject.subjectId, trial, subject.bounds);
    if (focusProjected == null || selfProjected == null) return true;
    if (projectedSafeEnvelopesOverlap(focusProjected, selfProjected)) return true;
    for (const prior of assignments) {
      const priorPos = placements.get(prior.subjectId);
      const priorSubject = placementSubjects.get(prior.subjectId);
      if (priorPos == null || priorSubject == null) continue;
      // Enforce minimum sector angular separation when possible.
      if (
        angularDelta(
          EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[sectorId],
          EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[prior.sectorId],
        ) <
          EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.minOccupiedSectorSeparationRad -
            1e-6 &&
        assignments.length < EXECUTIVE_FOCUS_HUB_SECTOR_IDS.length - 1
      ) {
        return true;
      }
      const priorProjected = projectedOf(
        prior.subjectId,
        priorPos,
        priorSubject.bounds,
      );
      if (
        priorProjected != null &&
        projectedSafeEnvelopesOverlap(priorProjected, selfProjected)
      ) {
        return true;
      }
    }
    return false;
  };

  const chooseSector = (
    preferred: ExecutiveFocusHubSectorId,
    subject: HubSectorNeighborInput,
    orderedCandidates?: readonly ExecutiveFocusHubSectorId[],
  ): ExecutiveFocusHubSectorId | null => {
    const order = orderedCandidates ?? EXECUTIVE_FOCUS_HUB_SECTOR_IDS;
    const rearBias = (sectorId: ExecutiveFocusHubSectorId): number =>
      sectorId.startsWith("upper")
        ? -0.08
        : sectorId.startsWith("lower")
          ? 0.1
          : 0;
    const minDistToOccupied = (sectorId: ExecutiveFocusHubSectorId): number => {
      if (occupied.size === 0) return Math.PI;
      let min = Number.POSITIVE_INFINITY;
      for (const taken of occupied) {
        min = Math.min(
          min,
          angularDelta(
            EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[sectorId],
            EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[taken],
          ),
        );
      }
      return min;
    };
    const rankedSectors = [...order]
      .filter((sectorId) => !occupied.has(sectorId))
      .sort((left, right) => {
        // Prefer sectors farthest from already occupied (readable Hub spread).
        const leftSpread = minDistToOccupied(left);
        const rightSpread = minDistToOccupied(right);
        if (Math.abs(leftSpread - rightSpread) > 1e-6) {
          return rightSpread - leftSpread;
        }
        const leftDelta =
          angularDelta(
            EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[preferred],
            EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[left],
          ) + rearBias(left);
        const rightDelta =
          angularDelta(
            EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[preferred],
            EXECUTIVE_FOCUS_HUB_SECTOR_SCREEN_ANGLES[right],
          ) + rearBias(right);
        if (leftDelta !== rightDelta) return leftDelta - rightDelta;
        return compareIds(left, right);
      });
    for (const sectorId of rankedSectors) {
      if (!sectorConflictsProjected(sectorId, subject)) {
        return sectorId;
      }
    }
    return rankedSectors[0] ?? null;
  };

  const compactSpread =
    ranked.length <= 4
      ? (Object.freeze([
          "left",
          "right",
          "upper-left",
          "upper-right",
        ] as const satisfies readonly ExecutiveFocusHubSectorId[]) as readonly ExecutiveFocusHubSectorId[])
      : EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.businessPreferredSectors;

  for (const neighbor of ranked) {
    const preferred = resolvePreferredHubSectorFromProjection({
      focusPosition: input.focus.position,
      neighborPosition: neighbor.position,
      cameraPosition: input.cameraPosition,
      cameraTarget: input.cameraTarget,
      cameraFov: input.cameraFov,
    });
    preferredById.set(neighbor.subjectId, preferred);
    const chosen =
      chooseSector(preferred, neighbor, compactSpread) ??
      chooseSector(
        preferred,
        neighbor,
        EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.businessFallbackSectors,
      ) ??
      chooseSector(preferred, neighbor);
    if (chosen == null) continue;
    occupied.add(chosen);
    const assignment = Object.freeze({
      subjectId: neighbor.subjectId,
      sectorId: chosen,
      preferredSectorId: preferred,
      usedFallback: chosen !== preferred,
    });
    assignments.push(assignment);
    const placed = computePlacement(assignment, 0, 0, EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.presentationPlaneBias);
    if (placed != null) placements.set(neighbor.subjectId, placed);
  }

  if (input.collapsedThread != null) {
    const preferred = resolvePreferredHubSectorFromProjection({
      focusPosition: input.focus.position,
      neighborPosition: input.collapsedThread.position,
      cameraPosition: input.cameraPosition,
      cameraTarget: input.cameraTarget,
      cameraFov: input.cameraFov,
    });
    const chosen =
      chooseSector(
        preferred,
        input.collapsedThread,
        EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.collapsedPreferredSectors,
      ) ?? chooseSector(preferred, input.collapsedThread);
    if (chosen != null) {
      occupied.add(chosen);
      const assignment = Object.freeze({
        subjectId: input.collapsedThread.subjectId,
        sectorId: chosen,
        preferredSectorId: preferred,
        usedFallback: chosen !== preferred,
      });
      assignments.push(assignment);
      const placed = computePlacement(
        assignment,
        0,
        compareIds(input.collapsedThread.subjectId, "m") < 0 ? -1 : 1,
        EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.presentationPlaneBias * 1.4,
      );
      if (placed != null) {
        placements.set(input.collapsedThread.subjectId, placed);
      }
    }
  }

  let degenerateRedistributed = false;

  const evaluateProjected = () => {
    const focusProjected = projectedOf(
      input.focus.subjectId,
      input.focus.position,
      input.focus.bounds,
      true,
    );
    if (focusProjected == null) {
      return {
        ok: false,
        collinear: false,
        neighborProjected: [] as ExecutiveProjectedObjectBounds[],
      };
    }
    const neighborProjected: ExecutiveProjectedObjectBounds[] = [];
    let ok = true;
    for (const assignment of assignments) {
      const subject = placementSubjects.get(assignment.subjectId);
      const position = placements.get(assignment.subjectId);
      if (subject == null || position == null) continue;
      const projected = projectedOf(
        subject.subjectId,
        position,
        scaledBoundsFor(subject),
      );
      if (projected == null) {
        ok = false;
        continue;
      }
      if (projectedSafeEnvelopesOverlap(focusProjected, projected)) ok = false;
      for (const prior of neighborProjected) {
        if (projectedSafeEnvelopesOverlap(prior, projected)) ok = false;
      }
      neighborProjected.push(projected);
    }
    const collinear = detectDegenerateHubCollinearity({
      focusProjected,
      neighborProjected: neighborProjected.filter((entry) => {
        const subject = placementSubjects.get(entry.subjectId);
        return subject?.visualRole !== "collapsed-thread";
      }),
    });
    return { ok: ok && !collinear, collinear, neighborProjected };
  };

  for (
    let pass = 0;
    pass < EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.maxPlacementPasses;
    pass += 1
  ) {
    const status = evaluateProjected();
    if (status.ok) break;

    if (status.collinear && !degenerateRedistributed) {
      degenerateRedistributed = true;
      occupied.clear();
      assignments.length = 0;
      placements.clear();
      const spread = EXECUTIVE_FOCUS_HUB_SECTOR_IDS.filter((_, index) =>
        ranked.length <= 4 ? index % 2 === 0 : true,
      );
      for (const neighbor of ranked) {
        const preferred =
          preferredById.get(neighbor.subjectId) ??
          resolvePreferredHubSectorFromProjection({
            focusPosition: input.focus.position,
            neighborPosition: neighbor.position,
            cameraPosition: input.cameraPosition,
            cameraTarget: input.cameraTarget,
            cameraFov: input.cameraFov,
          });
        const chosen = chooseSector(preferred, neighbor, spread);
        if (chosen == null) continue;
        occupied.add(chosen);
        const assignment = Object.freeze({
          subjectId: neighbor.subjectId,
          sectorId: chosen,
          preferredSectorId: preferred,
          usedFallback: chosen !== preferred,
        });
        assignments.push(assignment);
        const placed = computePlacement(
          assignment,
          0.1,
          0,
          EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.presentationPlaneBias,
        );
        if (placed != null) placements.set(neighbor.subjectId, placed);
      }
      if (input.collapsedThread != null) {
        const preferred = preferredById.get(input.collapsedThread.subjectId) ?? "lower";
        const chosen =
          chooseSector(
            preferred,
            input.collapsedThread,
            EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.collapsedPreferredSectors,
          ) ?? chooseSector(preferred, input.collapsedThread);
        if (chosen != null) {
          occupied.add(chosen);
          const assignment = Object.freeze({
            subjectId: input.collapsedThread.subjectId,
            sectorId: chosen,
            preferredSectorId: preferred,
            usedFallback: chosen !== preferred,
          });
          assignments.push(assignment);
          const placed = computePlacement(assignment, 0.1, 1, 0.22);
          if (placed != null) {
            placements.set(input.collapsedThread.subjectId, placed);
          }
        }
      }
    }

    hubRadius = stabilize(
      Math.min(
        HUB_SECTOR_SEPARATION.hubRadiusMax,
        hubRadius + EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.radialStep,
      ),
    );

    // Resolve remaining projected collisions with radius + lateral bias.
    for (let i = 0; i < assignments.length; i += 1) {
      const assignment = assignments[i]!;
      const lateralSign = i % 2 === 0 ? -1 : 1;
      const placed = computePlacement(
        assignment,
        pass * EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.radialStep,
        lateralSign,
        Math.max(
          EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.viewAxisLateralMinimum * 0.85,
          EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.presentationPlaneBias *
            (1.25 + pass * 0.45),
        ),
      );
      if (placed != null) placements.set(assignment.subjectId, placed);
    }

    if (pass >= 2) {
      for (const neighbor of ranked) {
        const current =
          scaleOverrides.get(neighbor.subjectId) ?? neighbor.bounds.scale;
        scaleOverrides.set(
          neighbor.subjectId,
          stabilize(Math.max(0.5, current * 0.93)),
        );
      }
    }
  }

  // Final pairwise projected separation — presentation-plane push only (no Z-escape).
  for (let pairPass = 0; pairPass < 5; pairPass += 1) {
    const status = evaluateProjected();
    if (status.ok) break;
    const focusProjected = projectedOf(
      input.focus.subjectId,
      input.focus.position,
      input.focus.bounds,
      true,
    );
    if (focusProjected == null) break;

    for (const assignment of assignments) {
      const subject = placementSubjects.get(assignment.subjectId);
      const position = placements.get(assignment.subjectId);
      if (subject == null || position == null) continue;
      if (subject.visualRole === "primary") continue;
      const self = projectedOf(
        subject.subjectId,
        position,
        scaledBoundsFor(subject),
      );
      if (self == null) continue;

      let pushX = 0;
      let pushZ = 0;
      if (projectedSafeEnvelopesOverlap(focusProjected, self)) {
        const dx = position.x - input.focus.position.x;
        const dz = position.z - input.focus.position.z;
        const dist = Math.hypot(dx, dz) || 1;
        pushX += (dx / dist) * (0.28 + pairPass * 0.08);
        pushZ += (dz / dist) * (0.28 + pairPass * 0.08);
        // Prefer presentation-plane (camera-right) when still view-aligned.
        pushX += basis.right.x * 0.18 * (compareIds(subject.subjectId, "m") < 0 ? -1 : 1);
        pushZ += basis.right.z * 0.18 * (compareIds(subject.subjectId, "m") < 0 ? -1 : 1);
      }

      for (const other of assignments) {
        if (other.subjectId === assignment.subjectId) continue;
        const otherSubject = placementSubjects.get(other.subjectId);
        const otherPos = placements.get(other.subjectId);
        if (otherSubject == null || otherPos == null) continue;
        const otherProj = projectedOf(
          other.subjectId,
          otherPos,
          scaledBoundsFor(otherSubject),
        );
        if (otherProj == null) continue;
        if (!projectedSafeEnvelopesOverlap(self, otherProj)) continue;
        // Lower priority yields.
        if (neighborPriority(subject) > neighborPriority(otherSubject)) continue;
        if (
          neighborPriority(subject) === neighborPriority(otherSubject) &&
          compareIds(subject.subjectId, otherSubject.subjectId) < 0
        ) {
          continue;
        }
        const dx = position.x - otherPos.x;
        const dz = position.z - otherPos.z;
        const dist = Math.hypot(dx, dz) || 1;
        pushX += (dx / dist) * (0.26 + pairPass * 0.08);
        pushZ += (dz / dist) * (0.26 + pairPass * 0.08);
      }

      if (Math.abs(pushX) + Math.abs(pushZ) < 1e-6) continue;
      placements.set(
        assignment.subjectId,
        clampPosition(
          stabilizeVector({
            x: position.x + pushX,
            y: position.y,
            z: position.z + pushZ,
          }),
          input.bounds,
        ),
      );
    }

    if (pairPass >= 1) {
      for (const neighbor of ranked) {
        const current =
          scaleOverrides.get(neighbor.subjectId) ?? neighbor.bounds.scale;
        scaleOverrides.set(
          neighbor.subjectId,
          stabilize(Math.max(0.48, current * 0.92)),
        );
      }
    }
  }

  return Object.freeze({
    hubRadius,
    assignments: Object.freeze([...assignments]),
    placements,
    scaleOverrides,
    degenerateRedistributed,
    usedZOnlyEscape: false as const,
  });
}
