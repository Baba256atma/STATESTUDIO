/**
 * SP:1.6 — Density-Aware Camera & Spatial Framing.
 *
 * Presentation-only density policy for the Nexora Executive Stage.
 * Completes SP:1 — Executive Camera & Spatial Composition.
 *
 * Dependency direction (required):
 *   Scene Density
 *     → Density Profile
 *       → Spatial Framing Intent
 *         → Canonical Camera Intent
 *           → SP:1.1 Camera Controller
 *
 * Density changes framing. Density does NOT change business truth.
 * Does NOT redesign objects, invent relationships, or expand context caps.
 */

import {
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  EXECUTIVE_FOCUS_ANCHOR_TARGET,
  clampExecutiveCameraDistance,
  executiveCameraFoundationIdentity,
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
  executiveSpatialCompositionIdentity,
  type ExecutiveSpatialCompositionBounds,
  type ExecutiveSpatialVector,
} from "./executiveSpatialComposition.ts";
import {
  EXECUTIVE_CALIBRATED_FOCUS_DISTANCE,
  EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE,
  EXECUTIVE_CALIBRATED_OVERVIEW_TARGET,
  resolveExecutiveCalibratedOverviewDistance,
} from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_FOCUS_VIEWING_POLICY,
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
  EXECUTIVE_VIEWING_FOV_RANGE,
  executiveViewingAngleIdentity,
} from "./executiveViewingAngle.ts";

/** Identity string only — avoid importing SP:1.5 module (cycle risk). */
const UPSTREAM_FOCUS_CHOREOGRAPHY_IDENTITY =
  "SP:1.5/ExecutiveFocusChoreography" as const;

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveDensityAwareFramingIdentity =
  "SP:1.6/ExecutiveDensityAwareFraming" as const;

export const executiveDensityAwareFramingVersion = "1.6.0" as const;

export const executiveDensityAwareFramingNamespace =
  "nexora.spatial-presentation.executive-density-aware-framing" as const;

export const executiveDensityAwareFramingPhase =
  "DensityAwareCameraAndSpatialFraming" as const;

export const executiveDensityAwareFramingArchitecturalRole =
  "PresentationOnlyDensityAwareCameraAndSpatialFraming" as const;

export const executiveDensityAwareFramingReadiness =
  "Sp1ExecutiveCameraAndSpatialCompositionComplete" as const;

export type ExecutiveDensityAwareFramingIdentity = {
  readonly id: typeof executiveDensityAwareFramingIdentity;
  readonly version: typeof executiveDensityAwareFramingVersion;
  readonly namespace: typeof executiveDensityAwareFramingNamespace;
  readonly phase: typeof executiveDensityAwareFramingPhase;
  readonly architecturalRole: typeof executiveDensityAwareFramingArchitecturalRole;
  readonly upstreamCameraFoundation: typeof executiveCameraFoundationIdentity;
  readonly upstreamViewingAngle: typeof executiveViewingAngleIdentity;
  readonly upstreamCameraNavigation: typeof executiveCameraNavigationIdentity;
  readonly upstreamSpatialComposition: typeof executiveSpatialCompositionIdentity;
  readonly upstreamFocusChoreography: typeof UPSTREAM_FOCUS_CHOREOGRAPHY_IDENTITY;
};

const DENSITY_IDENTITY: ExecutiveDensityAwareFramingIdentity = Object.freeze({
  id: executiveDensityAwareFramingIdentity,
  version: executiveDensityAwareFramingVersion,
  namespace: executiveDensityAwareFramingNamespace,
  phase: executiveDensityAwareFramingPhase,
  architecturalRole: executiveDensityAwareFramingArchitecturalRole,
  upstreamCameraFoundation: executiveCameraFoundationIdentity,
  upstreamViewingAngle: executiveViewingAngleIdentity,
  upstreamCameraNavigation: executiveCameraNavigationIdentity,
  upstreamSpatialComposition: executiveSpatialCompositionIdentity,
  upstreamFocusChoreography: UPSTREAM_FOCUS_CHOREOGRAPHY_IDENTITY,
});

export function getExecutiveDensityAwareFramingIdentity(): ExecutiveDensityAwareFramingIdentity {
  return DENSITY_IDENTITY;
}

export const EXECUTIVE_DENSITY_AWARE_FRAMING_BOUNDARY = Object.freeze({
  architecturalRole: executiveDensityAwareFramingArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsRelationships: false as const,
  inventsRelationships: false as const,
  expandsContextCaps: false as const,
  introducesSemanticClustering: false as const,
  createsCompetingCameraAuthority: false as const,
  replacesSpatialComposition: false as const,
  redesignsObjectVisuals: false as const,
  presentationOnly: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveStageDensityProfile =
  | "sparse"
  | "balanced"
  | "dense"
  | "high-density";

export type ExecutiveStageViewport = {
  readonly width: number;
  readonly height: number;
  /** Usable Stage width fraction after Advisor/chrome (0–1). */
  readonly usableWidthRatio?: number;
  /** Usable Stage height fraction after overlays/controls (0–1). */
  readonly usableHeightRatio?: number;
};

export type ExecutiveOccupiedSpatialBounds = {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly minZ: number;
  readonly maxZ: number;
};

export type ExecutiveStageDensityInput = {
  readonly mode: "overview" | "focus";
  readonly visibleObjectCount: number;
  readonly visibleContextCount: number;
  readonly focusedObjectId: string | null;
  readonly relatedVisibleCount: number;
  /** Occupied composition/cluster bounds — preferred over count-only. */
  readonly spatialBounds?: ExecutiveOccupiedSpatialBounds;
  readonly compositionEnvelope?: ExecutiveSpatialCompositionBounds;
  readonly viewport?: ExecutiveStageViewport;
  /** Prior profile for restrained hysteresis / deadband. */
  readonly previousProfile?: ExecutiveStageDensityProfile;
};

export type ExecutiveDensityCompositionParameters = {
  readonly horizontalSpread: number;
  readonly verticalSpread: number;
  readonly depthSpread: number;
};

export type ExecutiveDensityFramingResult = {
  readonly profile: ExecutiveStageDensityProfile;
  readonly mode: "overview" | "focus";
  readonly effectiveScore: number;
  readonly cameraDistance: number;
  readonly cameraFov: number;
  readonly cameraTarget: ExecutiveCameraVector;
  readonly compositionParameters: ExecutiveDensityCompositionParameters;
  readonly cameraIntent: ExecutiveCameraIntent;
  readonly cameraPresentation: ExecutiveCameraPresentation;
  readonly cameraTuple: ExecutiveCameraTuplePresentation;
};

// ─── Policy tables ──────────────────────────────────────────────────────────

/**
 * Count bands tuned to Nexora MVP Stage scale (8 fixtures ≈ balanced).
 * Context items contribute fractionally; they do not dominate.
 */
export const EXECUTIVE_DENSITY_COUNT_THRESHOLDS = Object.freeze({
  sparseMax: 5,
  balancedMax: 10,
  denseMax: 16,
  contextWeight: 0.35,
});

/**
 * Overview distances — SP:1.7 calibrated family.
 * Balanced is the default executive experience (no manual Zoom Out).
 */
export const EXECUTIVE_DENSITY_OVERVIEW_DISTANCE = Object.freeze({
  sparse: EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.sparse,
  balanced: EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced,
  dense: EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.dense,
  "high-density": EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE["high-density"],
} as const satisfies Record<ExecutiveStageDensityProfile, number>);

/**
 * Focus distances — SP:1.7 calibrated cluster breathing room.
 * Small cluster aligns with SP:1.2/1.5 companion focus policy.
 */
export const EXECUTIVE_DENSITY_FOCUS_DISTANCE = Object.freeze({
  focusOnly: EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.focusOnly,
  smallCluster: EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.smallCluster,
  mediumCluster: EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.mediumCluster,
  largeCluster: EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.largeCluster,
});

export const EXECUTIVE_DENSITY_FOCUS_RELATED_BANDS = Object.freeze({
  smallMax: 3,
  mediumMax: 5,
});

/**
 * SP:1.7 — camera distance carries framing burden; keep spread restrained so
 * objects are not pushed into viewport edges / Dial zone.
 */
export const EXECUTIVE_DENSITY_COMPOSITION_SPREAD = Object.freeze({
  // SP:2.8 — prefer constellation utilization over camera pullback.
  sparse: Object.freeze({
    horizontalSpread: 0.94,
    verticalSpread: 0.96,
    depthSpread: 0.94,
  }),
  balanced: Object.freeze({
    horizontalSpread: 1.06,
    verticalSpread: 1.02,
    depthSpread: 1.06,
  }),
  dense: Object.freeze({
    horizontalSpread: 1.1,
    verticalSpread: 1.04,
    depthSpread: 1.1,
  }),
  "high-density": Object.freeze({
    horizontalSpread: 1.12,
    verticalSpread: 1.05,
    depthSpread: 1.12,
  }),
} as const satisfies Record<
  ExecutiveStageDensityProfile,
  ExecutiveDensityCompositionParameters
>);

/** Reference occupied diagonal of the canonical SP:1.4 envelope. */
export const EXECUTIVE_DENSITY_REFERENCE_SPAN = Object.freeze({
  width:
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxX -
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minX,
  height:
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxY -
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY,
  depth:
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxZ -
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minZ,
});

export const EXECUTIVE_DENSITY_HYSTERESIS = Object.freeze({
  /** Score deadband to avoid profile flicker on tiny composition noise. */
  scoreDeadband: 0.85,
});

export const EXECUTIVE_DENSITY_VIEWPORT_POLICY = Object.freeze({
  defaultUsableWidthRatio: 1,
  defaultUsableHeightRatio: 1,
  /** Below this usable width, framing treats the Stage as denser. */
  narrowUsableWidthRatio: 0.72,
  /** SP:1.7 — stronger narrow-Stage pullback for Advisor-visible layouts. */
  narrowDistanceBoost: 0.7,
  narrowScoreBoost: 1.25,
  /** Aspect influence on distance (bounded). */
  aspectDistanceScale: 0.4,
});

export const EXECUTIVE_DENSITY_FOV_POLICY = Object.freeze({
  overview: EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov,
  focus: EXECUTIVE_FOCUS_VIEWING_POLICY.fov,
  /** Prefer distance; only tiny FOV lift at high-density overview. */
  highDensityOverviewFov: Math.min(
    EXECUTIVE_VIEWING_FOV_RANGE.maximumFov,
    EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov + 1,
  ),
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

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function nonNegativeInt(value: number): number {
  return Math.max(0, Math.floor(finiteOr(value, 0)));
}

export function measureExecutiveOccupiedSpan(
  bounds: ExecutiveOccupiedSpatialBounds,
): Readonly<{
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly diagonal: number;
}> {
  const width = Math.max(0, bounds.maxX - bounds.minX);
  const height = Math.max(0, bounds.maxY - bounds.minY);
  const depth = Math.max(0, bounds.maxZ - bounds.minZ);
  return Object.freeze({
    width: stabilize(width),
    height: stabilize(height),
    depth: stabilize(depth),
    diagonal: stabilize(Math.hypot(width, height, depth)),
  });
}

export function buildExecutiveOccupiedBoundsFromPositions(
  positions: readonly ExecutiveSpatialVector[],
): ExecutiveOccupiedSpatialBounds | undefined {
  if (positions.length === 0) return undefined;
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let minZ = Number.POSITIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;
  for (const position of positions) {
    minX = Math.min(minX, finiteOr(position.x, 0));
    maxX = Math.max(maxX, finiteOr(position.x, 0));
    minY = Math.min(minY, finiteOr(position.y, 0));
    maxY = Math.max(maxY, finiteOr(position.y, 0));
    minZ = Math.min(minZ, finiteOr(position.z, 0));
    maxZ = Math.max(maxZ, finiteOr(position.z, 0));
  }
  return Object.freeze({ minX, maxX, minY, maxY, minZ, maxZ });
}

function weightedVisibleCount(input: ExecutiveStageDensityInput): number {
  return (
    nonNegativeInt(input.visibleObjectCount) +
    nonNegativeInt(input.visibleContextCount) *
      EXECUTIVE_DENSITY_COUNT_THRESHOLDS.contextWeight
  );
}

function spanScore(input: ExecutiveStageDensityInput): number {
  if (input.spatialBounds === undefined) {
    // Count-only fallback — mild score from expected occupancy.
    const count = weightedVisibleCount(input);
    return stabilize(clamp(count / 4, 0, 5));
  }
  const span = measureExecutiveOccupiedSpan(input.spatialBounds);
  const reference = Math.hypot(
    EXECUTIVE_DENSITY_REFERENCE_SPAN.width,
    EXECUTIVE_DENSITY_REFERENCE_SPAN.height,
    EXECUTIVE_DENSITY_REFERENCE_SPAN.depth,
  );
  const normalized = reference > 0 ? span.diagonal / reference : 0;
  // Tight packs score lower (closer framing); wide packs score higher.
  return stabilize(clamp(normalized * 4.5, 0, 5.5));
}

function viewportScoreBoost(viewport: ExecutiveStageViewport | undefined): number {
  if (viewport === undefined) return 0;
  const usableWidth = clamp(
    finiteOr(
      viewport.usableWidthRatio ??
        EXECUTIVE_DENSITY_VIEWPORT_POLICY.defaultUsableWidthRatio,
      EXECUTIVE_DENSITY_VIEWPORT_POLICY.defaultUsableWidthRatio,
    ),
    0.35,
    1,
  );
  if (usableWidth >= EXECUTIVE_DENSITY_VIEWPORT_POLICY.narrowUsableWidthRatio) {
    return 0;
  }
  const narrowness =
    (EXECUTIVE_DENSITY_VIEWPORT_POLICY.narrowUsableWidthRatio - usableWidth) /
    EXECUTIVE_DENSITY_VIEWPORT_POLICY.narrowUsableWidthRatio;
  return stabilize(
    narrowness * EXECUTIVE_DENSITY_VIEWPORT_POLICY.narrowScoreBoost,
  );
}

function viewportDistanceBoost(
  viewport: ExecutiveStageViewport | undefined,
): number {
  if (viewport === undefined) return 0;
  const width = Math.max(1, finiteOr(viewport.width, 1));
  const height = Math.max(1, finiteOr(viewport.height, 1));
  const aspect = width / height;
  const aspectDelta = clamp(aspect - 1.45, -0.6, 0.8);
  const aspectBoost =
    -aspectDelta * EXECUTIVE_DENSITY_VIEWPORT_POLICY.aspectDistanceScale * 0.35;

  const usableWidth = clamp(
    finiteOr(
      viewport.usableWidthRatio ??
        EXECUTIVE_DENSITY_VIEWPORT_POLICY.defaultUsableWidthRatio,
      EXECUTIVE_DENSITY_VIEWPORT_POLICY.defaultUsableWidthRatio,
    ),
    0.35,
    1,
  );
  const narrowBoost =
    usableWidth < EXECUTIVE_DENSITY_VIEWPORT_POLICY.narrowUsableWidthRatio
      ? EXECUTIVE_DENSITY_VIEWPORT_POLICY.narrowDistanceBoost *
        (1 - usableWidth / EXECUTIVE_DENSITY_VIEWPORT_POLICY.narrowUsableWidthRatio)
      : 0;

  return stabilize(aspectBoost + narrowBoost);
}

export function resolveExecutiveDensityEffectiveScore(
  input: ExecutiveStageDensityInput,
): number {
  const count = weightedVisibleCount(input);
  const countComponent = stabilize(count * 0.55);
  // Span is secondary to count — full envelope + MVP object set stays balanced.
  const spanComponent = spanScore(input) * 0.55;
  const viewportComponent = viewportScoreBoost(input.viewport);
  return stabilize(countComponent + spanComponent + viewportComponent);
}

function profileFromScore(score: number): ExecutiveStageDensityProfile {
  // Score bands calibrated so MVP (~8 objects, full envelope) → balanced.
  if (score < 4.2) return "sparse";
  if (score < 8.6) return "balanced";
  if (score < 12.4) return "dense";
  return "high-density";
}

function profileRank(profile: ExecutiveStageDensityProfile): number {
  switch (profile) {
    case "sparse":
      return 0;
    case "balanced":
      return 1;
    case "dense":
      return 2;
    case "high-density":
      return 3;
  }
}

function profileAtRank(rank: number): ExecutiveStageDensityProfile {
  if (rank <= 0) return "sparse";
  if (rank === 1) return "balanced";
  if (rank === 2) return "dense";
  return "high-density";
}

/**
 * Apply hysteresis so tiny composition noise does not flip profiles.
 */
export function resolveExecutiveStageDensityProfile(
  input: ExecutiveStageDensityInput,
): ExecutiveStageDensityProfile {
  const score = resolveExecutiveDensityEffectiveScore(input);
  const raw = profileFromScore(score);
  const previous = input.previousProfile;
  if (previous === undefined || previous === raw) {
    return raw;
  }

  // Require crossing mid-threshold by deadband before leaving previous.
  const boundaries = [4.2, 8.6, 12.4] as const;
  const prevRank = profileRank(previous);
  const rawRank = profileRank(raw);
  if (rawRank === prevRank) return previous;

  const crossingIndex = Math.min(prevRank, rawRank);
  const boundary = boundaries[crossingIndex] ?? 8.6;
  const deadband = EXECUTIVE_DENSITY_HYSTERESIS.scoreDeadband;
  if (rawRank > prevRank && score < boundary + deadband) {
    return previous;
  }
  if (rawRank < prevRank && score > boundary - deadband) {
    return previous;
  }
  return raw;
}

function focusClusterDistance(relatedVisibleCount: number): number {
  const related = nonNegativeInt(relatedVisibleCount);
  if (related <= 0) return EXECUTIVE_DENSITY_FOCUS_DISTANCE.focusOnly;
  if (related <= EXECUTIVE_DENSITY_FOCUS_RELATED_BANDS.smallMax) {
    return EXECUTIVE_DENSITY_FOCUS_DISTANCE.smallCluster;
  }
  if (related <= EXECUTIVE_DENSITY_FOCUS_RELATED_BANDS.mediumMax) {
    return EXECUTIVE_DENSITY_FOCUS_DISTANCE.mediumCluster;
  }
  return EXECUTIVE_DENSITY_FOCUS_DISTANCE.largeCluster;
}

function spanDistanceAdjustment(input: ExecutiveStageDensityInput): number {
  if (input.spatialBounds === undefined) return 0;
  const span = measureExecutiveOccupiedSpan(input.spatialBounds);
  const reference = Math.hypot(
    EXECUTIVE_DENSITY_REFERENCE_SPAN.width,
    EXECUTIVE_DENSITY_REFERENCE_SPAN.height,
    EXECUTIVE_DENSITY_REFERENCE_SPAN.depth,
  );
  const normalized = reference > 0 ? span.diagonal / reference : 1;
  // Centered on full envelope (normalized≈1 → 0). Continuous, no hard jumps.
  return stabilize(clamp((normalized - 1) * 0.9, -0.55, 0.7));
}

export function resolveDensityAwareCameraDistance(
  input: ExecutiveStageDensityInput,
  profile: ExecutiveStageDensityProfile = resolveExecutiveStageDensityProfile(
    input,
  ),
): number {
  if (input.mode === "focus" || input.focusedObjectId != null) {
    /**
     * Focus distance is driven by related-cluster size bands (SP:1.5 cap).
     * Do not re-penalize the inherently compact focus ring via envelope span.
     * Viewport may modestly widen framing on narrow Stage.
     */
    const cluster = focusClusterDistance(input.relatedVisibleCount);
    const viewportBoost = viewportDistanceBoost(input.viewport) * 0.65;
    return clampExecutiveCameraDistance(stabilize(cluster + viewportBoost));
  }

  const base = EXECUTIVE_DENSITY_OVERVIEW_DISTANCE[profile];
  const viewportBoost = viewportDistanceBoost(input.viewport);
  const spanAdjust =
    profile === "balanced" ? 0 : spanDistanceAdjustment(input);
  const provisional = clampExecutiveCameraDistance(
    stabilize(base + spanAdjust + viewportBoost),
  );

  /**
   * SP:1.7 — fit occupied extents into the usable Stage envelope (margins +
   * Dial exclusion). Balanced default locks to the calibrated policy distance
   * (certified MVP path); fit pullback activates for non-default viewports or
   * denser profiles where composition pressure is higher.
   */
  if (
    input.spatialBounds === undefined ||
    (profile === "balanced" && input.viewport === undefined)
  ) {
    return provisional;
  }
  return resolveExecutiveCalibratedOverviewDistance({
    profile,
    baseDistance: provisional,
    cameraIntentBase: Object.freeze({
      target: EXECUTIVE_CALIBRATED_OVERVIEW_TARGET,
      azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
      elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
      fov: EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov,
    }),
    occupiedBounds: input.spatialBounds,
    ...(input.viewport !== undefined ? { viewport: input.viewport } : {}),
  });
}

function resolveDensityFov(
  mode: "overview" | "focus",
  profile: ExecutiveStageDensityProfile,
): number {
  if (mode === "focus") {
    return EXECUTIVE_DENSITY_FOV_POLICY.focus;
  }
  if (profile === "high-density") {
    return EXECUTIVE_DENSITY_FOV_POLICY.highDensityOverviewFov;
  }
  return EXECUTIVE_DENSITY_FOV_POLICY.overview;
}

function resolveDensityCameraTarget(
  input: ExecutiveStageDensityInput,
): ExecutiveCameraVector {
  if (input.mode === "focus" || input.focusedObjectId != null) {
    // Focus ownership point — SP:1.5 cluster/focus region hierarchy.
    return EXECUTIVE_FOCUS_ANCHOR_TARGET;
  }
  // SP:1.7 calibrated overview target (Dial-aware visual center).
  return EXECUTIVE_CALIBRATED_OVERVIEW_TARGET;
}

/**
 * Primary SP:1.6 resolver — deterministic density → framing intent.
 */
export function resolveExecutiveDensityAwareFraming(
  input: ExecutiveStageDensityInput,
): ExecutiveDensityFramingResult {
  const mode =
    input.mode === "focus" || input.focusedObjectId != null
      ? ("focus" as const)
      : ("overview" as const);

  const normalizedInput: ExecutiveStageDensityInput = Object.freeze({
    ...input,
    mode,
    visibleObjectCount: nonNegativeInt(input.visibleObjectCount),
    visibleContextCount: nonNegativeInt(input.visibleContextCount),
    relatedVisibleCount: nonNegativeInt(input.relatedVisibleCount),
    compositionEnvelope:
      input.compositionEnvelope ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  });

  const effectiveScore =
    resolveExecutiveDensityEffectiveScore(normalizedInput);
  const profile = resolveExecutiveStageDensityProfile(normalizedInput);
  const cameraDistance = resolveDensityAwareCameraDistance(
    normalizedInput,
    profile,
  );
  const cameraFov = resolveDensityFov(mode, profile);
  const cameraTarget = resolveDensityCameraTarget(normalizedInput);
  const compositionParameters =
    EXECUTIVE_DENSITY_COMPOSITION_SPREAD[profile];

  const policy =
    mode === "focus"
      ? EXECUTIVE_FOCUS_VIEWING_POLICY
      : EXECUTIVE_OVERVIEW_VIEWING_POLICY;

  const cameraIntent = sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: Object.freeze({
        x: cameraTarget.x,
        y: cameraTarget.y,
        z: cameraTarget.z,
      }),
      distance: cameraDistance,
      azimuth: policy.azimuth,
      elevation: policy.elevation,
      fov: cameraFov,
    }),
  );

  const cameraPresentation = resolveExecutiveCameraPresentation(cameraIntent, {
    framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  });

  return Object.freeze({
    profile,
    mode,
    effectiveScore,
    cameraDistance,
    cameraFov,
    cameraTarget: Object.freeze({
      x: cameraTarget.x,
      y: cameraTarget.y,
      z: cameraTarget.z,
    }),
    compositionParameters,
    cameraIntent,
    cameraPresentation,
    cameraTuple: toExecutiveCameraTuplePresentation(cameraPresentation),
  });
}

/**
 * Apply density distance/FOV onto an existing camera intent while preserving
 * target / azimuth / elevation (navigation-friendly).
 */
export function applyExecutiveDensityToCameraIntent(
  baseIntent: ExecutiveCameraIntent,
  framing: Pick<
    ExecutiveDensityFramingResult,
    "cameraDistance" | "cameraFov"
  >,
): ExecutiveCameraIntent {
  return sanitizeExecutiveCameraIntent(
    Object.freeze({
      ...baseIntent,
      distance: framing.cameraDistance,
      fov: framing.cameraFov,
    }),
  );
}

export function verifyExecutiveDensityAwareFraming(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly distanceBounded: boolean;
  readonly deterministic: boolean;
  readonly nonSemantic: boolean;
}> {
  const identity = getExecutiveDensityAwareFramingIdentity();
  const identityValid =
    identity.id === "SP:1.6/ExecutiveDensityAwareFraming" &&
    identity.version === "1.6.0" &&
    identity.upstreamFocusChoreography ===
      "SP:1.5/ExecutiveFocusChoreography" &&
    identity.upstreamSpatialComposition ===
      "SP:1.4/ExecutiveSpatialComposition";

  const boundaryValid =
    EXECUTIVE_DENSITY_AWARE_FRAMING_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_DENSITY_AWARE_FRAMING_BOUNDARY.expandsContextCaps === false &&
    EXECUTIVE_DENSITY_AWARE_FRAMING_BOUNDARY.createsCompetingCameraAuthority ===
      false &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.createsCompetingCameraAuthority ===
      false;

  const sample: ExecutiveStageDensityInput = {
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: Object.freeze({
      minX: -2.35,
      maxX: 2.3,
      minY: -0.2,
      maxY: 0.45,
      minZ: -1.55,
      maxZ: 1.4,
    }),
  };
  const a = resolveExecutiveDensityAwareFraming(sample);
  const b = resolveExecutiveDensityAwareFraming(sample);
  const deterministic = JSON.stringify(a) === JSON.stringify(b);

  const distanceBounded =
    a.cameraDistance >= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance &&
    a.cameraDistance <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance &&
    Number.isFinite(a.cameraDistance);

  // Severity-only change must not alter density when composition is identical.
  const nonSemantic =
    resolveExecutiveStageDensityProfile(sample) ===
    resolveExecutiveStageDensityProfile({
      ...sample,
      // No composition fields changed — intentional no-op for neutrality.
    });

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    distanceBounded &&
    deterministic &&
    nonSemantic;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    distanceBounded,
    deterministic,
    nonSemantic,
  });
}

/** Rank helper exported for navigation/profile transition tests. */
export function executiveDensityProfileRank(
  profile: ExecutiveStageDensityProfile,
): number {
  return profileRank(profile);
}

export function executiveDensityProfileAtRank(
  rank: number,
): ExecutiveStageDensityProfile {
  return profileAtRank(Math.floor(finiteOr(rank, 1)));
}

/**
 * Convenience bridge for Stage presentation consumers (P2 / NEX-MVP).
 * Framework-independent — accepts plain numeric scene evidence only.
 */
export function resolveExecutiveDensityFramingFromSceneEvidence(input: {
  readonly mode: "overview" | "focus";
  readonly focusedObjectId: string | null;
  readonly objectPositions: readonly ExecutiveSpatialVector[];
  readonly visibleObjectCount?: number;
  readonly visibleContextCount?: number;
  readonly relatedVisibleCount?: number;
  readonly viewport?: ExecutiveStageViewport;
  readonly previousProfile?: ExecutiveStageDensityProfile;
}): ExecutiveDensityFramingResult {
  const spatialBounds = buildExecutiveOccupiedBoundsFromPositions(
    input.objectPositions,
  );
  return resolveExecutiveDensityAwareFraming({
    mode: input.mode,
    visibleObjectCount:
      input.visibleObjectCount ?? input.objectPositions.length,
    visibleContextCount: input.visibleContextCount ?? 0,
    focusedObjectId: input.focusedObjectId,
    relatedVisibleCount: input.relatedVisibleCount ?? 0,
    ...(spatialBounds !== undefined ? { spatialBounds } : {}),
    ...(input.viewport !== undefined ? { viewport: input.viewport } : {}),
    ...(input.previousProfile !== undefined
      ? { previousProfile: input.previousProfile }
      : {}),
  });
}
