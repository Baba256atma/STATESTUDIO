/**
 * SP:1.3 — Executive Camera Navigation.
 *
 * Presentation-only, bounded navigation policy for the Nexora Executive Stage.
 * UI issues semantic actions; this module resolves offsets into SP:1.1 intents.
 *
 * Dependency direction (required):
 *   User Navigation Intent
 *     → Executive Camera Navigation Policy
 *       → Canonical Camera Intent
 *         → SP:1.1 Camera Resolver
 *           → Existing Executive Camera Controller
 */

import {
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS,
  clampExecutiveCameraDistance,
  clampExecutiveCameraElevation,
  executiveCameraFoundationIdentity,
  normalizeExecutiveCameraAzimuth,
  resolveExecutiveCameraPresentation,
  sanitizeExecutiveCameraIntent,
  toExecutiveCameraTuplePresentation,
  type ExecutiveCameraFramingPadding,
  type ExecutiveCameraIntent,
  type ExecutiveCameraPresentation,
  type ExecutiveCameraTuplePresentation,
  type ExecutiveCameraVector,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_FOCUS_VIEWING_POLICY,
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
  executiveViewingAngleIdentity,
} from "./executiveViewingAngle.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveCameraNavigationIdentity =
  "SP:1.3/ExecutiveCameraNavigation" as const;

export const executiveCameraNavigationVersion = "1.3.0" as const;

export const executiveCameraNavigationNamespace =
  "nexora.spatial-presentation.executive-camera-navigation" as const;

export const executiveCameraNavigationPhase =
  "ExecutiveCameraNavigation" as const;

export const executiveCameraNavigationArchitecturalRole =
  "PresentationOnlyBoundedExecutiveCameraNavigation" as const;

export const executiveCameraNavigationReadiness =
  "ReadyForFocusCameraChoreography" as const;

export const executiveCameraNavigationUpstreamCameraFoundationIdentity =
  executiveCameraFoundationIdentity;

export const executiveCameraNavigationUpstreamViewingAngleIdentity =
  executiveViewingAngleIdentity;

export type ExecutiveCameraNavigationIdentity = {
  readonly id: typeof executiveCameraNavigationIdentity;
  readonly version: typeof executiveCameraNavigationVersion;
  readonly namespace: typeof executiveCameraNavigationNamespace;
  readonly phase: typeof executiveCameraNavigationPhase;
  readonly architecturalRole: typeof executiveCameraNavigationArchitecturalRole;
  readonly upstreamCameraFoundation: typeof executiveCameraFoundationIdentity;
  readonly upstreamViewingAngle: typeof executiveViewingAngleIdentity;
};

const NAVIGATION_IDENTITY: ExecutiveCameraNavigationIdentity = Object.freeze({
  id: executiveCameraNavigationIdentity,
  version: executiveCameraNavigationVersion,
  namespace: executiveCameraNavigationNamespace,
  phase: executiveCameraNavigationPhase,
  architecturalRole: executiveCameraNavigationArchitecturalRole,
  upstreamCameraFoundation: executiveCameraFoundationIdentity,
  upstreamViewingAngle: executiveViewingAngleIdentity,
});

export function getExecutiveCameraNavigationIdentity(): ExecutiveCameraNavigationIdentity {
  return NAVIGATION_IDENTITY;
}

export const EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveCameraNavigationArchitecturalRole,
  dependsOnCameraFoundation: true as const,
  dependsOnViewingAngle: true as const,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsSelection: false as const,
  ownsFocus: false as const,
  ownsRelationships: false as const,
  ownsWorkspaceSemantics: false as const,
  introducesUnrestrictedOrbitControls: false as const,
  introducesFreeCameraNavigation: false as const,
  introducesFocusChoreography: false as const,
  introducesSpatialObjectComposition: false as const,
  persistsCameraPreferences: false as const,
  createsCompetingCameraAuthority: false as const,
  presentationOnly: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export const EXECUTIVE_CAMERA_NAVIGATION_ACTIONS = Object.freeze([
  "orbit-left",
  "orbit-right",
  "tilt-up",
  "tilt-down",
  "zoom-in",
  "zoom-out",
  "reset",
] as const);

export type ExecutiveCameraNavigationAction =
  (typeof EXECUTIVE_CAMERA_NAVIGATION_ACTIONS)[number];

/**
 * Offsets from the active SP:1.2 base viewing intent.
 * Desired intent = base + offsets (then clamped by SP:1.1).
 */
export type ExecutiveCameraNavigationState = {
  readonly azimuthOffset: number;
  readonly elevationOffset: number;
  readonly distanceOffset: number;
};

export type ExecutiveCameraNavigationLimitState = {
  readonly canOrbitLeft: boolean;
  readonly canOrbitRight: boolean;
  readonly canTiltUp: boolean;
  readonly canTiltDown: boolean;
  readonly canZoomIn: boolean;
  readonly canZoomOut: boolean;
  readonly canReset: boolean;
  readonly atMinimumAzimuth: boolean;
  readonly atMaximumAzimuth: boolean;
  readonly atMinimumElevation: boolean;
  readonly atMaximumElevation: boolean;
  readonly atMinimumDistance: boolean;
  readonly atMaximumDistance: boolean;
};

const DEG = Math.PI / 180;

/** Discrete executive steps — perceptible without dramatic jumps. */
export const EXECUTIVE_CAMERA_NAVIGATION_STEPS = Object.freeze({
  /** SP:1.8 — slightly larger orbit step for clearer parallax reveal. */
  azimuthStep: 10 * DEG,
  elevationStep: 5 * DEG,
  distanceStep: 0.7,
});

/**
 * Horizontal orbit envelope around the SP:1.2 default azimuth.
 * SP:1.8 widens ±32° → ±48° for useful occlusion-separation parallax.
 * Still not a full 360° free orbit.
 */
export const EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS = Object.freeze({
  minimumAzimuthOffset: -48 * DEG,
  maximumAzimuthOffset: 48 * DEG,
});

export const INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE: ExecutiveCameraNavigationState =
  Object.freeze({
    azimuthOffset: 0,
    elevationOffset: 0,
    distanceOffset: 0,
  });

export function isExecutiveCameraNavigationAction(
  value: unknown,
): value is ExecutiveCameraNavigationAction {
  return (
    typeof value === "string" &&
    (EXECUTIVE_CAMERA_NAVIGATION_ACTIONS as readonly string[]).includes(value)
  );
}

export function createInitialExecutiveCameraNavigationState(): ExecutiveCameraNavigationState {
  return INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
}

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function stabilize(value: number): number {
  const finite = finiteOr(value, 0);
  const rounded = Math.round(finite * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function clampExecutiveCameraNavigationState(
  state: ExecutiveCameraNavigationState,
  baseIntent: ExecutiveCameraIntent,
): ExecutiveCameraNavigationState {
  const {
    minimumAzimuthOffset,
    maximumAzimuthOffset,
  } = EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS;
  const {
    minimumElevation,
    maximumElevation,
  } = EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS;
  const {
    minimumDistance,
    maximumDistance,
  } = EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS;

  const baseElevation = clampExecutiveCameraElevation(baseIntent.elevation);
  const baseDistance = clampExecutiveCameraDistance(baseIntent.distance);

  const azimuthOffset = clamp(
    finiteOr(state.azimuthOffset, 0),
    minimumAzimuthOffset,
    maximumAzimuthOffset,
  );
  const elevationOffset = clamp(
    finiteOr(state.elevationOffset, 0),
    minimumElevation - baseElevation,
    maximumElevation - baseElevation,
  );
  const distanceOffset = clamp(
    finiteOr(state.distanceOffset, 0),
    minimumDistance - baseDistance,
    maximumDistance - baseDistance,
  );

  return Object.freeze({
    azimuthOffset: stabilize(azimuthOffset),
    elevationOffset: stabilize(elevationOffset),
    distanceOffset: stabilize(distanceOffset),
  });
}

/**
 * Base spherical intent for navigation. Preserves the active presentation
 * target so focus choreography / SP:1.6 density can retarget without
 * hardwiring origin.
 *
 * Manual navigation policy (SP:1.3 + SP:1.6):
 * - density framing establishes canonical base distance/FOV;
 * - user azimuth/tilt/zoom offsets apply on top and survive density recalcs;
 * - Reset clears offsets → current density-aware base (not a fixed SP:1.2 constant).
 */
export function resolveExecutiveCameraNavigationBaseIntent(input: {
  readonly mode: "overview" | "focus";
  readonly target: ExecutiveCameraVector;
  /** SP:1.6 density-aware base distance when provided. */
  readonly distance?: number;
  /** Optional density-aware FOV; defaults to SP:1.2 family. */
  readonly fov?: number;
}): ExecutiveCameraIntent {
  const policy =
    input.mode === "focus"
      ? EXECUTIVE_FOCUS_VIEWING_POLICY
      : EXECUTIVE_OVERVIEW_VIEWING_POLICY;
  return sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: Object.freeze({
        x: finiteOr(input.target.x, policy.target.x),
        y: finiteOr(input.target.y, policy.target.y),
        z: finiteOr(input.target.z, policy.target.z),
      }),
      distance:
        input.distance === undefined
          ? policy.distance
          : finiteOr(input.distance, policy.distance),
      azimuth: policy.azimuth,
      elevation: policy.elevation,
      fov:
        input.fov === undefined ? policy.fov : finiteOr(input.fov, policy.fov),
    }),
  );
}

export function applyExecutiveCameraNavigationOffsets(
  baseIntent: ExecutiveCameraIntent,
  navigation: ExecutiveCameraNavigationState,
): ExecutiveCameraIntent {
  const safeNavigation = clampExecutiveCameraNavigationState(
    navigation,
    baseIntent,
  );
  return sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: baseIntent.target,
      distance: baseIntent.distance + safeNavigation.distanceOffset,
      azimuth: normalizeExecutiveCameraAzimuth(
        baseIntent.azimuth + safeNavigation.azimuthOffset,
      ),
      elevation: baseIntent.elevation + safeNavigation.elevationOffset,
      fov: baseIntent.fov,
    }),
  );
}

export function applyExecutiveCameraNavigationAction(
  state: ExecutiveCameraNavigationState,
  action: ExecutiveCameraNavigationAction,
  baseIntent: ExecutiveCameraIntent,
): ExecutiveCameraNavigationState {
  if (action === "reset") {
    return INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  }

  const {
    azimuthStep,
    elevationStep,
    distanceStep,
  } = EXECUTIVE_CAMERA_NAVIGATION_STEPS;

  let next: ExecutiveCameraNavigationState = state;
  switch (action) {
    case "orbit-left":
      next = Object.freeze({
        ...state,
        azimuthOffset: state.azimuthOffset - azimuthStep,
      });
      break;
    case "orbit-right":
      next = Object.freeze({
        ...state,
        azimuthOffset: state.azimuthOffset + azimuthStep,
      });
      break;
    case "tilt-up":
      next = Object.freeze({
        ...state,
        elevationOffset: state.elevationOffset + elevationStep,
      });
      break;
    case "tilt-down":
      next = Object.freeze({
        ...state,
        elevationOffset: state.elevationOffset - elevationStep,
      });
      break;
    case "zoom-in":
      next = Object.freeze({
        ...state,
        distanceOffset: state.distanceOffset - distanceStep,
      });
      break;
    case "zoom-out":
      next = Object.freeze({
        ...state,
        distanceOffset: state.distanceOffset + distanceStep,
      });
      break;
    default:
      next = state;
  }

  return clampExecutiveCameraNavigationState(next, baseIntent);
}

export function resolveNavigatedExecutiveCameraIntent(input: {
  readonly mode: "overview" | "focus";
  readonly target: ExecutiveCameraVector;
  readonly navigation: ExecutiveCameraNavigationState;
  readonly distance?: number;
  readonly fov?: number;
}): ExecutiveCameraIntent {
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: input.mode,
    target: input.target,
    ...(input.distance !== undefined ? { distance: input.distance } : {}),
    ...(input.fov !== undefined ? { fov: input.fov } : {}),
  });
  return applyExecutiveCameraNavigationOffsets(base, input.navigation);
}

export function resolveNavigatedExecutiveCameraPresentation(input: {
  readonly mode: "overview" | "focus";
  readonly target: ExecutiveCameraVector;
  readonly navigation: ExecutiveCameraNavigationState;
  readonly framing?: ExecutiveCameraFramingPadding;
  readonly distance?: number;
  readonly fov?: number;
}): ExecutiveCameraPresentation {
  const intent = resolveNavigatedExecutiveCameraIntent(input);
  return resolveExecutiveCameraPresentation(intent, {
    framing: input.framing ?? DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  });
}

export function resolveNavigatedExecutiveCameraTuple(input: {
  readonly mode: "overview" | "focus";
  readonly target: ExecutiveCameraVector;
  readonly navigation: ExecutiveCameraNavigationState;
  readonly framing?: ExecutiveCameraFramingPadding;
  readonly distance?: number;
  readonly fov?: number;
}): ExecutiveCameraTuplePresentation {
  return toExecutiveCameraTuplePresentation(
    resolveNavigatedExecutiveCameraPresentation(input),
  );
}

export function getExecutiveCameraNavigationLimitState(
  state: ExecutiveCameraNavigationState,
  baseIntent: ExecutiveCameraIntent,
): ExecutiveCameraNavigationLimitState {
  const clamped = clampExecutiveCameraNavigationState(state, baseIntent);
  const {
    minimumAzimuthOffset,
    maximumAzimuthOffset,
  } = EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS;
  const {
    minimumElevation,
    maximumElevation,
  } = EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS;
  const {
    minimumDistance,
    maximumDistance,
  } = EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS;
  const absoluteElevation =
    baseIntent.elevation + clamped.elevationOffset;
  const absoluteDistance = baseIntent.distance + clamped.distanceOffset;

  const atMinimumAzimuth = clamped.azimuthOffset <= minimumAzimuthOffset + 1e-9;
  const atMaximumAzimuth = clamped.azimuthOffset >= maximumAzimuthOffset - 1e-9;
  const atMinimumElevation = absoluteElevation <= minimumElevation + 1e-9;
  const atMaximumElevation = absoluteElevation >= maximumElevation - 1e-9;
  const atMinimumDistance = absoluteDistance <= minimumDistance + 1e-9;
  const atMaximumDistance = absoluteDistance >= maximumDistance - 1e-9;

  return Object.freeze({
    canOrbitLeft: !atMinimumAzimuth,
    canOrbitRight: !atMaximumAzimuth,
    canTiltUp: !atMaximumElevation,
    canTiltDown: !atMinimumElevation,
    canZoomIn: !atMinimumDistance,
    canZoomOut: !atMaximumDistance,
    canReset:
      Math.abs(clamped.azimuthOffset) > 1e-9 ||
      Math.abs(clamped.elevationOffset) > 1e-9 ||
      Math.abs(clamped.distanceOffset) > 1e-9,
    atMinimumAzimuth,
    atMaximumAzimuth,
    atMinimumElevation,
    atMaximumElevation,
    atMinimumDistance,
    atMaximumDistance,
  });
}

/** True when navigation offsets are at the SP:1.2 default (zero offsets). */
export function isExecutiveCameraNavigationAtDefault(
  state: ExecutiveCameraNavigationState,
): boolean {
  return (
    Math.abs(state.azimuthOffset) <= 1e-9 &&
    Math.abs(state.elevationOffset) <= 1e-9 &&
    Math.abs(state.distanceOffset) <= 1e-9
  );
}

export function verifyExecutiveCameraNavigation(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly dependsOnFoundationAndViewingAngle: boolean;
  readonly resetRestoresDefault: boolean;
  readonly boundsEnforced: boolean;
  readonly deterministic: boolean;
  readonly presentationOnly: boolean;
}> {
  const identity = getExecutiveCameraNavigationIdentity();
  const identityValid =
    identity.id === "SP:1.3/ExecutiveCameraNavigation" &&
    identity.version === "1.3.0" &&
    identity.upstreamCameraFoundation ===
      "SP:1.1/ExecutiveCameraFoundation" &&
    identity.upstreamViewingAngle === "SP:1.2/ExecutiveViewingAngle";

  const boundaryValid =
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.dependsOnCameraFoundation === true &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.dependsOnViewingAngle === true &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.introducesUnrestrictedOrbitControls ===
      false &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.createsCompetingCameraAuthority ===
      false &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.persistsCameraPreferences === false;

  const dependsOnFoundationAndViewingAngle =
    identity.upstreamCameraFoundation === executiveCameraFoundationIdentity &&
    identity.upstreamViewingAngle === executiveViewingAngleIdentity;

  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
  });
  let state = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  state = applyExecutiveCameraNavigationAction(state, "orbit-right", base);
  state = applyExecutiveCameraNavigationAction(state, "tilt-up", base);
  state = applyExecutiveCameraNavigationAction(state, "zoom-in", base);
  const reset = applyExecutiveCameraNavigationAction(state, "reset", base);
  const resetRestoresDefault = isExecutiveCameraNavigationAtDefault(reset);

  let extreme = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (let index = 0; index < 12; index += 1) {
    extreme = applyExecutiveCameraNavigationAction(
      extreme,
      "orbit-right",
      base,
    );
    extreme = applyExecutiveCameraNavigationAction(extreme, "tilt-up", base);
    extreme = applyExecutiveCameraNavigationAction(
      extreme,
      "zoom-out",
      base,
    );
  }
  const intent = applyExecutiveCameraNavigationOffsets(base, extreme);
  const boundsEnforced =
    intent.elevation >=
      EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation &&
    intent.elevation <=
      EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation &&
    intent.distance >= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance &&
    intent.distance <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance &&
    extreme.azimuthOffset <=
      EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS.maximumAzimuthOffset + 1e-9;

  const a = resolveNavigatedExecutiveCameraPresentation({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    navigation: state,
  });
  const b = resolveNavigatedExecutiveCameraPresentation({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    navigation: state,
  });
  const deterministic = JSON.stringify(a) === JSON.stringify(b);

  const presentationOnly =
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.ownsSelection === false &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.ownsFocus === false &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.presentationOnly === true;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    dependsOnFoundationAndViewingAngle &&
    resetRestoresDefault &&
    boundsEnforced &&
    deterministic &&
    presentationOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    dependsOnFoundationAndViewingAngle,
    resetRestoresDefault,
    boundsEnforced,
    deterministic,
    presentationOnly,
  });
}
