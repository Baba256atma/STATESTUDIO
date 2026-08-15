/**
 * SP:1.2 — Executive Viewing Angle.
 *
 * Presentation-only viewing policy for the Nexora Executive Stage.
 * Builds on SP:1.1 camera mechanics — does not own Three.js / R3F, navigation,
 * object composition, or business truth.
 *
 * Dependency direction (required):
 *   SP:1.1 Camera Foundation
 *     → SP:1.2 Viewing-Angle Policy
 *       → Camera Intent / Presentation
 *         → Existing Executive Camera Controller
 */

import {
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS,
  EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY,
  EXECUTIVE_FOCUS_ANCHOR_TARGET,
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
  type ResolveExecutiveCameraPresentationOptions,
} from "./executiveCameraFoundation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveViewingAngleIdentity =
  "SP:1.2/ExecutiveViewingAngle" as const;

export const executiveViewingAngleVersion = "1.2.0" as const;

export const executiveViewingAngleNamespace =
  "nexora.spatial-presentation.executive-viewing-angle" as const;

export const executiveViewingAnglePhase = "ExecutiveViewingAngle" as const;

export const executiveViewingAngleArchitecturalRole =
  "PresentationOnlyExecutiveViewingPolicy" as const;

export const executiveViewingAngleReadiness =
  "ReadyForFocusCameraChoreography" as const;

export const executiveViewingAngleUpstreamCameraFoundationIdentity =
  executiveCameraFoundationIdentity;

export type ExecutiveViewingAngleIdentity = {
  readonly id: typeof executiveViewingAngleIdentity;
  readonly version: typeof executiveViewingAngleVersion;
  readonly namespace: typeof executiveViewingAngleNamespace;
  readonly phase: typeof executiveViewingAnglePhase;
  readonly architecturalRole: typeof executiveViewingAngleArchitecturalRole;
  readonly upstreamCameraFoundation: typeof executiveCameraFoundationIdentity;
};

const VIEWING_ANGLE_IDENTITY: ExecutiveViewingAngleIdentity = Object.freeze({
  id: executiveViewingAngleIdentity,
  version: executiveViewingAngleVersion,
  namespace: executiveViewingAngleNamespace,
  phase: executiveViewingAnglePhase,
  architecturalRole: executiveViewingAngleArchitecturalRole,
  upstreamCameraFoundation: executiveCameraFoundationIdentity,
});

export function getExecutiveViewingAngleIdentity(): ExecutiveViewingAngleIdentity {
  return VIEWING_ANGLE_IDENTITY;
}

export const EXECUTIVE_VIEWING_ANGLE_BOUNDARY = Object.freeze({
  architecturalRole: executiveViewingAngleArchitecturalRole,
  dependsOnCameraFoundation: true as const,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsExecutiveSeverity: false as const,
  ownsObjectImportance: false as const,
  ownsRelationships: false as const,
  ownsWorkspaceSemantics: false as const,
  introducesOrbitUi: false as const,
  introducesFreeCameraNavigation: false as const,
  introducesFocusChoreography: false as const,
  introducesDensityAwareFraming: false as const,
  repositionsStageObjects: false as const,
  createsCompetingCameraAuthority: false as const,
  presentationNeutralViewpoint: true as const,
});

// ─── Policy ─────────────────────────────────────────────────────────────────

const DEG = Math.PI / 180;

/**
 * Active SP:1.2 profile. Focused/dense remain reserved; only overview is live.
 * Avoids premature multi-profile abstraction while keeping a stable name.
 */
export type ExecutiveViewingProfile = "overview";

export const EXECUTIVE_VIEWING_FOV_RANGE = Object.freeze({
  minimumFov: 34,
  maximumFov: 44,
  defaultFov: 38,
  companionFocusFov: 36,
});

/**
 * Canonical overview viewing policy — validated against Stage fixture span
 * (~4.6 X × ~3.0 Z, centroid ≈ (-0.05, 0.11, 0.16)).
 *
 * Elevation reveals restrained object tops; azimuth adds oblique depth without
 * a left/right-heavy composition; FOV stays executive (not wide-angle).
 */
export const EXECUTIVE_OVERVIEW_VIEWING_POLICY = Object.freeze({
  profile: "overview" as const,
  /**
   * SP:1.7 calibrated visual center — biased away from Workspace Dial
   * (bottom-right) while preserving SP:1.2 elevation/azimuth language.
   */
  target: Object.freeze({
    x: -0.22,
    y: 0.2,
    z: 0.02,
  }) satisfies ExecutiveCameraVector,
  /** SP:1.7 — calibrated balanced overview (replaces obsolete 8.85). */
  distance: 10.65,
  /** Small intentional horizontal offset — depth without spectacle. */
  azimuth: 28 * DEG,
  /** Moderate elevation — object tops visible, not top-down. */
  elevation: 34 * DEG,
  fov: EXECUTIVE_VIEWING_FOV_RANGE.defaultFov,
});

/**
 * Companion focus intent shares the same angle family for visual continuity.
 * SP:1.7 modestly increases focus distance for cluster breathing room.
 */
export const EXECUTIVE_FOCUS_VIEWING_POLICY = Object.freeze({
  target: EXECUTIVE_FOCUS_ANCHOR_TARGET,
  distance: 7.15,
  azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
  elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
  fov: EXECUTIVE_VIEWING_FOV_RANGE.companionFocusFov,
});

/** Pre-readability Stage overview target — same composition center policy. */
export const EXECUTIVE_STAGE_OVERVIEW_VIEWING_POLICY = Object.freeze({
  target: Object.freeze({
    x: -0.22,
    y: 0.18,
    z: 0.02,
  }) satisfies ExecutiveCameraVector,
  distance: 10.55,
  azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
  elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
  fov: EXECUTIVE_VIEWING_FOV_RANGE.defaultFov,
});

export const EXECUTIVE_STAGE_FOCUS_VIEWING_POLICY = Object.freeze({
  target: Object.freeze({
    x: 0,
    y: 0.42,
    z: 0,
  }) satisfies ExecutiveCameraVector,
  distance: 7.35,
  azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
  elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
  fov: EXECUTIVE_VIEWING_FOV_RANGE.companionFocusFov,
});

export type ResolveExecutiveViewingIntentInput = {
  readonly profile?: ExecutiveViewingProfile;
  /** Optional composition-center override — presentation geometry only. */
  readonly stageCenter?: ExecutiveCameraVector;
  readonly framing?: ExecutiveCameraFramingPadding;
};

function withOptionalCenter(
  base: ExecutiveCameraIntent,
  stageCenter: ExecutiveCameraVector | undefined,
): ExecutiveCameraIntent {
  if (stageCenter === undefined) {
    return base;
  }
  return Object.freeze({
    ...base,
    target: Object.freeze({
      x: stageCenter.x,
      y: stageCenter.y,
      z: stageCenter.z,
    }),
  });
}

/**
 * Resolve the canonical default executive viewing intent (overview).
 * Policy only — camera math remains in SP:1.1.
 */
export function resolveExecutiveDefaultViewingIntent(
  input: ResolveExecutiveViewingIntentInput = {},
): ExecutiveCameraIntent {
  const profile = input.profile ?? "overview";
  if (profile !== "overview") {
    // Reserved profiles are not active in SP:1.2.
    throw new TypeError(
      `SP:1.2 active viewing profile is "overview"; received "${String(profile)}"`,
    );
  }

  const intent = withOptionalCenter(
    Object.freeze({
      target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
      distance: EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
      azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
      elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
      fov: EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov,
    }),
    input.stageCenter,
  );

  // Clamp/normalize only — framing boost is applied once at presentation resolve.
  return sanitizeExecutiveCameraIntent(intent);
}

/** @deprecated Alias — prefer resolveExecutiveDefaultViewingIntent. */
export function getExecutiveOverviewCameraIntent(
  input: ResolveExecutiveViewingIntentInput = {},
): ExecutiveCameraIntent {
  return resolveExecutiveDefaultViewingIntent(input);
}

export function resolveExecutiveFocusViewingIntent(): ExecutiveCameraIntent {
  return sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: EXECUTIVE_FOCUS_VIEWING_POLICY.target,
      distance: EXECUTIVE_FOCUS_VIEWING_POLICY.distance,
      azimuth: EXECUTIVE_FOCUS_VIEWING_POLICY.azimuth,
      elevation: EXECUTIVE_FOCUS_VIEWING_POLICY.elevation,
      fov: EXECUTIVE_FOCUS_VIEWING_POLICY.fov,
    }),
  );
}

export function resolveExecutiveStageOverviewViewingIntent(options?: {
  readonly stageCenter?: ExecutiveCameraVector;
}): ExecutiveCameraIntent {
  const intent = withOptionalCenter(
    Object.freeze({
      target: EXECUTIVE_STAGE_OVERVIEW_VIEWING_POLICY.target,
      distance: EXECUTIVE_STAGE_OVERVIEW_VIEWING_POLICY.distance,
      azimuth: EXECUTIVE_STAGE_OVERVIEW_VIEWING_POLICY.azimuth,
      elevation: EXECUTIVE_STAGE_OVERVIEW_VIEWING_POLICY.elevation,
      fov: EXECUTIVE_STAGE_OVERVIEW_VIEWING_POLICY.fov,
    }),
    options?.stageCenter,
  );
  return sanitizeExecutiveCameraIntent(intent);
}

export function resolveExecutiveStageFocusViewingIntent(): ExecutiveCameraIntent {
  return sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: EXECUTIVE_STAGE_FOCUS_VIEWING_POLICY.target,
      distance: EXECUTIVE_STAGE_FOCUS_VIEWING_POLICY.distance,
      azimuth: EXECUTIVE_STAGE_FOCUS_VIEWING_POLICY.azimuth,
      elevation: EXECUTIVE_STAGE_FOCUS_VIEWING_POLICY.elevation,
      fov: EXECUTIVE_STAGE_FOCUS_VIEWING_POLICY.fov,
    }),
  );
}

export function resolveExecutiveDefaultViewingPresentation(
  input: ResolveExecutiveViewingIntentInput = {},
  options?: ResolveExecutiveCameraPresentationOptions,
): ExecutiveCameraPresentation {
  const intent = resolveExecutiveDefaultViewingIntent(input);
  return resolveExecutiveCameraPresentation(intent, {
    framing: input.framing ?? DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
    ...options,
  });
}

export function resolveExecutiveFocusViewingPresentation(
  options?: ResolveExecutiveCameraPresentationOptions,
): ExecutiveCameraPresentation {
  const intent = resolveExecutiveFocusViewingIntent();
  return resolveExecutiveCameraPresentation(intent, {
    framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
    ...options,
  });
}

export function resolveExecutiveStageOverviewViewingPresentation(
  options?: ResolveExecutiveCameraPresentationOptions & {
    readonly stageCenter?: ExecutiveCameraVector;
  },
): ExecutiveCameraPresentation {
  const intent = resolveExecutiveStageOverviewViewingIntent({
    stageCenter: options?.stageCenter,
  });
  return resolveExecutiveCameraPresentation(intent, {
    framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
    ...options,
  });
}

export function resolveExecutiveStageFocusViewingPresentation(
  options?: ResolveExecutiveCameraPresentationOptions,
): ExecutiveCameraPresentation {
  const intent = resolveExecutiveStageFocusViewingIntent();
  return resolveExecutiveCameraPresentation(intent, {
    framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
    ...options,
  });
}

export const EXECUTIVE_OVERVIEW_VIEWING_CAMERA_PRESENTATION =
  resolveExecutiveDefaultViewingPresentation();

export const EXECUTIVE_FOCUS_VIEWING_CAMERA_PRESENTATION =
  resolveExecutiveFocusViewingPresentation();

export const EXECUTIVE_STAGE_OVERVIEW_VIEWING_CAMERA_PRESENTATION =
  resolveExecutiveStageOverviewViewingPresentation();

export const EXECUTIVE_STAGE_FOCUS_VIEWING_CAMERA_PRESENTATION =
  resolveExecutiveStageFocusViewingPresentation();

export const EXECUTIVE_OVERVIEW_VIEWING_CAMERA_TUPLE =
  toExecutiveCameraTuplePresentation(
    EXECUTIVE_OVERVIEW_VIEWING_CAMERA_PRESENTATION,
  );

export const EXECUTIVE_FOCUS_VIEWING_CAMERA_TUPLE =
  toExecutiveCameraTuplePresentation(
    EXECUTIVE_FOCUS_VIEWING_CAMERA_PRESENTATION,
  );

export const EXECUTIVE_STAGE_OVERVIEW_VIEWING_CAMERA_TUPLE =
  toExecutiveCameraTuplePresentation(
    EXECUTIVE_STAGE_OVERVIEW_VIEWING_CAMERA_PRESENTATION,
  );

export const EXECUTIVE_STAGE_FOCUS_VIEWING_CAMERA_TUPLE =
  toExecutiveCameraTuplePresentation(
    EXECUTIVE_STAGE_FOCUS_VIEWING_CAMERA_PRESENTATION,
  );

export function assertExecutiveViewingAngleWithinFoundationBounds(
  intent: ExecutiveCameraIntent,
): boolean {
  const distance = clampExecutiveCameraDistance(intent.distance);
  const elevation = clampExecutiveCameraElevation(intent.elevation);
  const azimuth = normalizeExecutiveCameraAzimuth(intent.azimuth);
  const fov = intent.fov ?? EXECUTIVE_VIEWING_FOV_RANGE.defaultFov;
  return (
    distance === clampExecutiveCameraDistance(distance) &&
    elevation >= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation &&
    elevation <= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation &&
    Number.isFinite(azimuth) &&
    fov >= EXECUTIVE_VIEWING_FOV_RANGE.minimumFov &&
    fov <= EXECUTIVE_VIEWING_FOV_RANGE.maximumFov &&
    distance >= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance &&
    distance <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance
  );
}

export function verifyExecutiveViewingAngle(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly dependsOnFoundation: boolean;
  readonly overviewWithinBounds: boolean;
  readonly deterministic: boolean;
  readonly presentationNeutral: boolean;
}> {
  const identity = getExecutiveViewingAngleIdentity();
  const identityValid =
    identity.id === "SP:1.2/ExecutiveViewingAngle" &&
    identity.version === "1.2.0" &&
    identity.namespace ===
      "nexora.spatial-presentation.executive-viewing-angle" &&
    identity.upstreamCameraFoundation === "SP:1.1/ExecutiveCameraFoundation";

  const boundaryValid =
    EXECUTIVE_VIEWING_ANGLE_BOUNDARY.dependsOnCameraFoundation === true &&
    EXECUTIVE_VIEWING_ANGLE_BOUNDARY.introducesOrbitUi === false &&
    EXECUTIVE_VIEWING_ANGLE_BOUNDARY.createsCompetingCameraAuthority ===
      false &&
    EXECUTIVE_VIEWING_ANGLE_BOUNDARY.repositionsStageObjects === false &&
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.frameworkIndependentResolver === true;

  const overviewIntent = resolveExecutiveDefaultViewingIntent();
  const overviewWithinBounds =
    assertExecutiveViewingAngleWithinFoundationBounds(overviewIntent) &&
    overviewIntent.elevation >
      EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation &&
    Math.abs(overviewIntent.azimuth) > 0;

  const a = resolveExecutiveDefaultViewingPresentation();
  const b = resolveExecutiveDefaultViewingPresentation();
  const deterministic = JSON.stringify(a) === JSON.stringify(b);

  const presentationNeutral =
    EXECUTIVE_VIEWING_ANGLE_BOUNDARY.ownsExecutiveSeverity === false &&
    EXECUTIVE_VIEWING_ANGLE_BOUNDARY.ownsObjectImportance === false &&
    EXECUTIVE_VIEWING_ANGLE_BOUNDARY.presentationNeutralViewpoint === true;

  const dependsOnFoundation =
    identity.upstreamCameraFoundation === executiveCameraFoundationIdentity;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    dependsOnFoundation &&
    overviewWithinBounds &&
    deterministic &&
    presentationNeutral;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    dependsOnFoundation,
    overviewWithinBounds,
    deterministic,
    presentationNeutral,
  });
}
