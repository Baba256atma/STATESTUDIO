/**
 * SP:1.5 — Focus Camera Choreography.
 *
 * Presentation-only focus choreography for the Nexora Executive Stage.
 * Consumes canonical focus + relationship adjacency; never invents truth.
 *
 * Dependency direction (required):
 *   Canonical Focus / Selection State
 *     → Focus Choreography Intent
 *       → Spatial + Camera Presentation
 *         → Three.js / R3F (existing controllers)
 *
 * Builds on SP:1.1–1.4. Accepts optional SP:1.6 density camera distance/FOV.
 */

import {
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  clampExecutiveCameraDistance,
  clampExecutiveCameraElevation,
  executiveCameraFoundationIdentity,
  normalizeExecutiveCameraAzimuth,
  resolveExecutiveCameraPresentation,
  sanitizeExecutiveCameraIntent,
  toExecutiveCameraTuplePresentation,
  type ExecutiveCameraIntent,
  type ExecutiveCameraPresentation,
  type ExecutiveCameraTuplePresentation,
  type ExecutiveCameraVector,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY,
  executiveCameraNavigationIdentity,
} from "./executiveCameraNavigation.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  EXECUTIVE_SPATIAL_RESERVED_CENTER,
  applyExecutiveSpatialUiOverlaySafeCorrection,
  clampExecutiveSpatialVector,
  executiveSpatialCompositionIdentity,
  type ExecutiveSpatialVector,
} from "./executiveSpatialComposition.ts";
import {
  resolveExecutiveOcclusionAwareFocusCameraIntent,
} from "./executiveObjectOcclusion.ts";
import {
  EXECUTIVE_FOCUS_VIEWING_POLICY,
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
  EXECUTIVE_VIEWING_FOV_RANGE,
  executiveViewingAngleIdentity,
} from "./executiveViewingAngle.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveFocusChoreographyIdentity =
  "SP:1.5/ExecutiveFocusChoreography" as const;

export const executiveFocusChoreographyVersion = "1.5.0" as const;

export const executiveFocusChoreographyNamespace =
  "nexora.spatial-presentation.executive-focus-choreography" as const;

export const executiveFocusChoreographyPhase =
  "FocusCameraChoreography" as const;

export const executiveFocusChoreographyArchitecturalRole =
  "PresentationOnlyFocusSpatialAndCameraChoreography" as const;

export const executiveFocusChoreographyReadiness =
  "ReadyForDensityAwareFramingConsumer" as const;

export type ExecutiveFocusChoreographyIdentity = {
  readonly id: typeof executiveFocusChoreographyIdentity;
  readonly version: typeof executiveFocusChoreographyVersion;
  readonly namespace: typeof executiveFocusChoreographyNamespace;
  readonly phase: typeof executiveFocusChoreographyPhase;
  readonly architecturalRole: typeof executiveFocusChoreographyArchitecturalRole;
  readonly upstreamCameraFoundation: typeof executiveCameraFoundationIdentity;
  readonly upstreamViewingAngle: typeof executiveViewingAngleIdentity;
  readonly upstreamCameraNavigation: typeof executiveCameraNavigationIdentity;
  readonly upstreamSpatialComposition: typeof executiveSpatialCompositionIdentity;
};

const FOCUS_CHOREOGRAPHY_IDENTITY: ExecutiveFocusChoreographyIdentity =
  Object.freeze({
    id: executiveFocusChoreographyIdentity,
    version: executiveFocusChoreographyVersion,
    namespace: executiveFocusChoreographyNamespace,
    phase: executiveFocusChoreographyPhase,
    architecturalRole: executiveFocusChoreographyArchitecturalRole,
    upstreamCameraFoundation: executiveCameraFoundationIdentity,
    upstreamViewingAngle: executiveViewingAngleIdentity,
    upstreamCameraNavigation: executiveCameraNavigationIdentity,
    upstreamSpatialComposition: executiveSpatialCompositionIdentity,
  });

export function getExecutiveFocusChoreographyIdentity(): ExecutiveFocusChoreographyIdentity {
  return FOCUS_CHOREOGRAPHY_IDENTITY;
}

export const EXECUTIVE_FOCUS_CHOREOGRAPHY_BOUNDARY = Object.freeze({
  architecturalRole: executiveFocusChoreographyArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsRelationships: false as const,
  inventsRelationships: false as const,
  inventsContext: false as const,
  mutatesBaseComposition: false as const,
  introducesDensityAwareCamera: false as const,
  introducesMultiHopExpansion: false as const,
  createsCompetingCameraAuthority: false as const,
  presentationOnly: true as const,
  oneHopDefault: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveFocusObjectRole = "focus" | "related" | "background";

export type ExecutiveFocusConnectionInput = {
  readonly id?: string;
  readonly sourceId: string;
  readonly targetId: string;
};

export type ExecutiveFocusObjectInput = {
  readonly objectId: string;
  /** SP:1.4 base / overview home position — never mutated. */
  readonly basePosition: ExecutiveSpatialVector;
  /** Presentation-only discoverability hint (e.g. critical retention). */
  readonly retainDiscoverability?: boolean;
};

export type ExecutiveFocusChoreographyInput = {
  readonly focusedObjectId: string | null;
  readonly objects: readonly ExecutiveFocusObjectInput[];
  readonly connections: readonly ExecutiveFocusConnectionInput[];
  /** Optional override; defaults to SP:1.2 overview intent. */
  readonly baseCameraIntent?: ExecutiveCameraIntent;
  readonly maxRelatedVisible?: number;
  /** SP:1.6 density-aware focus/overview distance override. */
  readonly cameraDistance?: number;
  /** SP:1.6 density-aware FOV override. */
  readonly cameraFov?: number;
  /**
   * SP:1.8 — when true (default for focus), apply a tiny deterministic
   * viewpoint micro-adjustment if the canonical focus view is occluded.
   */
  readonly occlusionAwareViewAdjustment?: boolean;
};

export type ExecutiveFocusObjectPresentation = {
  readonly objectId: string;
  readonly role: ExecutiveFocusObjectRole;
  readonly basePosition: ExecutiveSpatialVector;
  readonly targetPosition: ExecutiveSpatialVector;
  readonly emphasis: number;
  readonly relatedSlotIndex: number | null;
  readonly retainDiscoverability: boolean;
};

export type ExecutiveFocusChoreographyResult = {
  readonly focusedObjectId: string | null;
  readonly objects: readonly ExecutiveFocusObjectPresentation[];
  readonly relatedObjectIds: readonly string[];
  readonly overflowRelatedObjectIds: readonly string[];
  readonly clusterCenter: ExecutiveSpatialVector;
  readonly cameraIntent: ExecutiveCameraIntent;
  readonly cameraPresentation: ExecutiveCameraPresentation;
  readonly cameraTuple: ExecutiveCameraTuplePresentation;
};

// ─── Focus region & related slots ───────────────────────────────────────────

/**
 * Elevated executive focus ownership point.
 * Compatible with certified P2:8.3 focus readability framing (y ≈ 0.42).
 * Distinct from SP:1.4 reserved center base (used as overview strategic void).
 */
export const EXECUTIVE_FOCUS_REGION: ExecutiveSpatialVector = Object.freeze({
  x: 0,
  y: 0.42,
  z: 0,
});

export const EXECUTIVE_FOCUS_RELATED_LIMITS = Object.freeze({
  maxRelatedVisible: 6,
  // SP:2.8 — slightly wider related ring for silhouette/label separation.
  relatedRadius: 1.78,
});

/**
 * Deterministic relative slots around focus (XY ring).
 * STAGE-2D:2 — former XZ ring remapped onto the Stage plane; z always 0.
 * Order is stable; assignment uses canonical related order.
 */
export const EXECUTIVE_FOCUS_RELATED_SLOT_OFFSETS: readonly ExecutiveSpatialVector[] =
  Object.freeze([
    Object.freeze({ x: 0, y: -1.78, z: 0 }),
    Object.freeze({ x: 1.78, y: 0, z: 0 }),
    Object.freeze({ x: 0, y: 1.78, z: 0 }),
    Object.freeze({ x: -1.78, y: 0, z: 0 }),
    Object.freeze({ x: 1.26, y: -1.26, z: 0 }),
    Object.freeze({ x: -1.26, y: -1.26, z: 0 }),
    Object.freeze({ x: 1.26, y: 1.26, z: 0 }),
    Object.freeze({ x: -1.26, y: 1.26, z: 0 }),
  ]);

export const EXECUTIVE_FOCUS_CAMERA_POLICY = Object.freeze({
  /** SP:1.7 calibrated small-cluster focus distance. */
  distance: EXECUTIVE_FOCUS_VIEWING_POLICY.distance,
  azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
  elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
  fov: EXECUTIVE_VIEWING_FOV_RANGE.companionFocusFov,
});

export const EXECUTIVE_FOCUS_BACKGROUND_PUSH = Object.freeze({
  // SP:2.8 — background uses more outer envelope without leaving Stage bounds.
  // STAGE-2D:2 — radial push stays in X/Y; no Z bias.
  radialScale: 2.05,
  dropY: 0.58,
  zBias: 0,
  minRadial: EXECUTIVE_FOCUS_RELATED_LIMITS.relatedRadius + 0.62,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
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

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function addVectors(
  origin: ExecutiveSpatialVector,
  offset: ExecutiveSpatialVector,
): ExecutiveSpatialVector {
  return stabilizeVector({
    x: origin.x + offset.x,
    y: origin.y + offset.y,
    z: origin.z + offset.z,
  });
}

/**
 * 1-hop adjacency from canonical connections only — never invents edges.
 */
export function resolveExecutiveFocusRelatedObjectIds(input: {
  readonly focusedObjectId: string;
  readonly connections: readonly ExecutiveFocusConnectionInput[];
}): readonly string[] {
  const related = new Set<string>();
  for (const connection of input.connections) {
    if (connection.sourceId === input.focusedObjectId) {
      related.add(connection.targetId);
    } else if (connection.targetId === input.focusedObjectId) {
      related.add(connection.sourceId);
    }
  }
  return Object.freeze([...related].sort(compareIds));
}

function pushBackgroundPosition(
  base: ExecutiveSpatialVector,
): ExecutiveSpatialVector {
  const {
    radialScale,
    dropY,
    zBias,
    minRadial,
  } = EXECUTIVE_FOCUS_BACKGROUND_PUSH;
  // STAGE-2D:2 — push on the XY plane only (legacy used XZ + zBias).
  void zBias;
  let x = base.x * radialScale;
  let y = base.y * radialScale - dropY;
  const radial = Math.hypot(x, y);
  if (radial < minRadial) {
    const angle =
      radial < 0.001 ? Math.atan2(base.y || 1, base.x || 1) : Math.atan2(y, x);
    x = Math.cos(angle) * minRadial;
    y = Math.sin(angle) * minRadial;
  }
  return applyExecutiveSpatialUiOverlaySafeCorrection(
    clampExecutiveSpatialVector(
      { x, y, z: 0 },
      EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
    ),
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  );
}

function resolveFocusCameraIntent(
  clusterCenter: ExecutiveSpatialVector,
  overrides?: {
    readonly cameraDistance?: number;
    readonly cameraFov?: number;
  },
): ExecutiveCameraIntent {
  const distanceOverride = overrides?.cameraDistance;
  const fovOverride = overrides?.cameraFov;
  return sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: clusterCenter,
      distance:
        distanceOverride === undefined
          ? EXECUTIVE_FOCUS_CAMERA_POLICY.distance
          : finiteOr(
              distanceOverride,
              EXECUTIVE_FOCUS_CAMERA_POLICY.distance,
            ),
      azimuth: EXECUTIVE_FOCUS_CAMERA_POLICY.azimuth,
      elevation: EXECUTIVE_FOCUS_CAMERA_POLICY.elevation,
      fov:
        fovOverride === undefined
          ? EXECUTIVE_FOCUS_CAMERA_POLICY.fov
          : finiteOr(fovOverride, EXECUTIVE_FOCUS_CAMERA_POLICY.fov),
    }),
  );
}

function resolveOverviewCameraIntent(
  baseCameraIntent: ExecutiveCameraIntent | undefined,
): ExecutiveCameraIntent {
  if (baseCameraIntent !== undefined) {
    return sanitizeExecutiveCameraIntent(baseCameraIntent);
  }
  return sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
      distance: EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
      azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
      elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
      fov: EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov,
    }),
  );
}

function averageClusterCenter(
  focus: ExecutiveSpatialVector,
  relatedTargets: readonly ExecutiveSpatialVector[],
): ExecutiveSpatialVector {
  if (relatedTargets.length === 0) {
    return focus;
  }
  // Bias toward focus ownership — cluster center stays near focus.
  let x = focus.x * 2;
  let y = focus.y * 2;
  let z = focus.z * 2;
  for (const point of relatedTargets) {
    x += point.x;
    y += point.y;
    z += point.z;
  }
  const count = relatedTargets.length + 2;
  return stabilizeVector({
    x: x / count,
    y: y / count,
    z: z / count,
  });
}

/**
 * Deterministic focus choreography resolver.
 * Preserves SP:1.4 basePosition on every object; never mutates inputs.
 */
export function resolveExecutiveFocusChoreography(
  input: ExecutiveFocusChoreographyInput,
): ExecutiveFocusChoreographyResult {
  const focusedObjectId = input.focusedObjectId;
  const maxRelated = Math.max(
    0,
    Math.floor(
      finiteOr(
        input.maxRelatedVisible ??
          EXECUTIVE_FOCUS_RELATED_LIMITS.maxRelatedVisible,
        EXECUTIVE_FOCUS_RELATED_LIMITS.maxRelatedVisible,
      ),
    ),
  );

  if (focusedObjectId == null) {
    const overviewBase = resolveOverviewCameraIntent(input.baseCameraIntent);
    const distanceOverride = input.cameraDistance;
    const fovOverride = input.cameraFov;
    const cameraIntent = sanitizeExecutiveCameraIntent(
      Object.freeze({
        ...overviewBase,
        ...(distanceOverride !== undefined
          ? {
              distance: finiteOr(distanceOverride, overviewBase.distance),
            }
          : {}),
        ...(fovOverride !== undefined
          ? {
              fov: finiteOr(
                fovOverride,
                overviewBase.fov ?? EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov,
              ),
            }
          : {}),
      }),
    );
    const cameraPresentation = resolveExecutiveCameraPresentation(
      cameraIntent,
      { framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING },
    );
    const objects = Object.freeze(
      input.objects.map((object) =>
        Object.freeze({
          objectId: object.objectId,
          role: "background" as const,
          basePosition: stabilizeVector(object.basePosition),
          targetPosition: stabilizeVector(object.basePosition),
          emphasis: 0.35,
          relatedSlotIndex: null,
          retainDiscoverability: object.retainDiscoverability === true,
        }),
      ),
    );
    return Object.freeze({
      focusedObjectId: null,
      objects,
      relatedObjectIds: Object.freeze([]),
      overflowRelatedObjectIds: Object.freeze([]),
      clusterCenter: EXECUTIVE_SPATIAL_RESERVED_CENTER,
      cameraIntent,
      cameraPresentation,
      cameraTuple: toExecutiveCameraTuplePresentation(cameraPresentation),
    });
  }

  const objectIds = new Set(input.objects.map((entry) => entry.objectId));
  if (!objectIds.has(focusedObjectId)) {
    // Unknown focus id — treat as no-focus rather than inventing geometry.
    return resolveExecutiveFocusChoreography({
      ...input,
      focusedObjectId: null,
    });
  }

  const allRelated = resolveExecutiveFocusRelatedObjectIds({
    focusedObjectId,
    connections: input.connections,
  }).filter((objectId) => objectIds.has(objectId));

  const relatedVisible = Object.freeze(allRelated.slice(0, maxRelated));
  const overflowRelated = Object.freeze(allRelated.slice(maxRelated));
  const relatedVisibleSet = new Set(relatedVisible);
  const overflowSet = new Set(overflowRelated);

  const focusTarget = clampExecutiveSpatialVector(
    EXECUTIVE_FOCUS_REGION,
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  );

  const relatedTargets: ExecutiveSpatialVector[] = [];
  const presentations: ExecutiveFocusObjectPresentation[] = [];

  for (const object of input.objects) {
    const basePosition = stabilizeVector(object.basePosition);
    const retainDiscoverability = object.retainDiscoverability === true;

    if (object.objectId === focusedObjectId) {
      presentations.push(
        Object.freeze({
          objectId: object.objectId,
          role: "focus",
          basePosition,
          targetPosition: focusTarget,
          emphasis: 1,
          relatedSlotIndex: null,
          retainDiscoverability,
        }),
      );
      continue;
    }

    if (relatedVisibleSet.has(object.objectId)) {
      const slotIndex = relatedVisible.indexOf(object.objectId);
      const offset =
        EXECUTIVE_FOCUS_RELATED_SLOT_OFFSETS[
          slotIndex % EXECUTIVE_FOCUS_RELATED_SLOT_OFFSETS.length
        ]!;
      const targetPosition = applyExecutiveSpatialUiOverlaySafeCorrection(
        clampExecutiveSpatialVector(
          addVectors(focusTarget, offset),
          EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
        ),
        EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
      );
      relatedTargets.push(targetPosition);
      presentations.push(
        Object.freeze({
          objectId: object.objectId,
          role: "related",
          basePosition,
          targetPosition,
          emphasis: 0.72,
          relatedSlotIndex: slotIndex,
          retainDiscoverability,
        }),
      );
      continue;
    }

    // Background — includes non-edges and overflow related (restrained).
    const targetPosition = pushBackgroundPosition(basePosition);
    presentations.push(
      Object.freeze({
        objectId: object.objectId,
        role: "background",
        basePosition,
        targetPosition,
        emphasis: retainDiscoverability
          ? 0.55
          : overflowSet.has(object.objectId)
            ? 0.4
            : 0.28,
        relatedSlotIndex: null,
        retainDiscoverability,
      }),
    );
  }

  // Stable output order by objectId for deterministic JSON comparisons.
  presentations.sort((left, right) =>
    compareIds(left.objectId, right.objectId),
  );

  const clusterCenter = averageClusterCenter(focusTarget, relatedTargets);
  /**
   * Camera looks at the focused-object ownership point (executive focus region).
   * SP:1.6 may supply density-aware distance/FOV for the focus cluster.
   * Related objects stay readable via restrained ring slots + focus distance.
   */
  const cameraIntent = resolveFocusCameraIntent(focusTarget, {
    ...(input.cameraDistance !== undefined
      ? { cameraDistance: input.cameraDistance }
      : {}),
    ...(input.cameraFov !== undefined ? { cameraFov: input.cameraFov } : {}),
  });
  // Ensure camera intent remains inside SP:1.1 envelopes.
  let safeCameraIntent = sanitizeExecutiveCameraIntent(
    Object.freeze({
      ...cameraIntent,
      distance: clampExecutiveCameraDistance(cameraIntent.distance),
      elevation: clampExecutiveCameraElevation(cameraIntent.elevation),
      azimuth: normalizeExecutiveCameraAzimuth(cameraIntent.azimuth),
    }),
  );

  /**
   * SP:1.8 — bounded focus viewpoint micro-adjustment only (never overview).
   * Uses focus/related target positions; does not alter SP:1.4 base homes.
   */
  if (input.occlusionAwareViewAdjustment !== false) {
    safeCameraIntent = resolveExecutiveOcclusionAwareFocusCameraIntent({
      baseIntent: safeCameraIntent,
      focusedObjectId,
      objects: presentations.map((entry) =>
        Object.freeze({
          objectId: entry.objectId,
          position: entry.targetPosition,
          radius: entry.role === "focus" ? 0.48 : 0.4,
        }),
      ),
    });
  }

  const cameraPresentation = resolveExecutiveCameraPresentation(
    safeCameraIntent,
    { framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING },
  );

  return Object.freeze({
    focusedObjectId,
    objects: Object.freeze(presentations),
    relatedObjectIds: relatedVisible,
    overflowRelatedObjectIds: overflowRelated,
    clusterCenter,
    cameraIntent: safeCameraIntent,
    cameraPresentation,
    cameraTuple: toExecutiveCameraTuplePresentation(cameraPresentation),
  });
}

export function executiveFocusTargetTuple(
  position: ExecutiveSpatialVector,
): readonly [number, number, number] {
  const stable = stabilizeVector(position);
  return Object.freeze([stable.x, stable.y, stable.z] as const);
}

export function verifyExecutiveFocusChoreography(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly nonEdgePreserved: boolean;
  readonly basePositionsPreserved: boolean;
  readonly deterministic: boolean;
}> {
  const identity = getExecutiveFocusChoreographyIdentity();
  const identityValid =
    identity.id === "SP:1.5/ExecutiveFocusChoreography" &&
    identity.version === "1.5.0" &&
    identity.upstreamSpatialComposition ===
      "SP:1.4/ExecutiveSpatialComposition" &&
    identity.upstreamCameraNavigation ===
      "SP:1.3/ExecutiveCameraNavigation";

  const boundaryValid =
    EXECUTIVE_FOCUS_CHOREOGRAPHY_BOUNDARY.inventsRelationships === false &&
    EXECUTIVE_FOCUS_CHOREOGRAPHY_BOUNDARY.mutatesBaseComposition === false &&
    EXECUTIVE_FOCUS_CHOREOGRAPHY_BOUNDARY.introducesDensityAwareCamera ===
      false &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.createsCompetingCameraAuthority ===
      false;

  const baseA = Object.freeze({ x: -2.2, y: 0.1, z: 0.2 });
  const baseB = Object.freeze({ x: 2.1, y: 0.05, z: 1.1 });
  const input: ExecutiveFocusChoreographyInput = {
    focusedObjectId: "obj-a",
    objects: [
      Object.freeze({ objectId: "obj-a", basePosition: baseA }),
      Object.freeze({
        objectId: "obj-b",
        basePosition: baseB,
        retainDiscoverability: true,
      }),
      Object.freeze({
        objectId: "obj-c",
        basePosition: Object.freeze({ x: 0.8, y: 0.1, z: -1 }),
      }),
    ],
    connections: [
      Object.freeze({ id: "rel-a-c", sourceId: "obj-a", targetId: "obj-c" }),
    ],
  };
  const result = resolveExecutiveFocusChoreography(input);
  const focus = result.objects.find((entry) => entry.objectId === "obj-a");
  const criticalBg = result.objects.find((entry) => entry.objectId === "obj-b");
  const related = result.objects.find((entry) => entry.objectId === "obj-c");
  const nonEdgePreserved =
    focus?.role === "focus" &&
    related?.role === "related" &&
    criticalBg?.role === "background" &&
    criticalBg.retainDiscoverability === true &&
    !result.relatedObjectIds.includes("obj-b");

  const basePositionsPreserved = result.objects.every((entry) => {
    const source = input.objects.find(
      (object) => object.objectId === entry.objectId,
    );
    return (
      source !== undefined &&
      JSON.stringify(entry.basePosition) ===
        JSON.stringify(stabilizeVector(source.basePosition))
    );
  });

  const again = resolveExecutiveFocusChoreography(input);
  const deterministic = JSON.stringify(result) === JSON.stringify(again);

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    nonEdgePreserved === true &&
    basePositionsPreserved &&
    deterministic;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    nonEdgePreserved: nonEdgePreserved === true,
    basePositionsPreserved,
    deterministic,
  });
}

/** Compatibility export — focus viewing policy distance remains SP:1.2 family. */
export const EXECUTIVE_FOCUS_CHOREOGRAPHY_DEFAULT_CAMERA_INTENT =
  resolveFocusCameraIntent(EXECUTIVE_FOCUS_REGION);
