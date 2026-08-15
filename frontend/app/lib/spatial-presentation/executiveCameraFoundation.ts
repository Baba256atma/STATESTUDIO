/**
 * SP:1.1 — Executive Camera Foundation.
 *
 * Framework-independent presentation camera contracts and resolution for the
 * Nexora Executive Stage. Camera is presentation-only — never business truth.
 *
 * Dependency direction (required):
 *   Executive Runtime / Stage State
 *     → Camera Intent
 *       → Executive Camera Resolver
 *         → Camera Presentation
 *           → Three.js / R3F (controller boundary only)
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveCameraFoundationIdentity =
  "SP:1.1/ExecutiveCameraFoundation" as const;

export const executiveCameraFoundationVersion = "1.1.0" as const;

export const executiveCameraFoundationNamespace =
  "nexora.spatial-presentation.executive-camera" as const;

export const executiveCameraFoundationPhase =
  "ExecutiveCameraFoundation" as const;

export const executiveCameraFoundationArchitecturalRole =
  "PresentationOnlyExecutiveCameraResolution" as const;

export const executiveCameraFoundationReadiness =
  "ReadyForCameraNavigation" as const;

export type ExecutiveCameraFoundationIdentity = {
  readonly id: typeof executiveCameraFoundationIdentity;
  readonly version: typeof executiveCameraFoundationVersion;
  readonly namespace: typeof executiveCameraFoundationNamespace;
  readonly phase: typeof executiveCameraFoundationPhase;
  readonly architecturalRole: typeof executiveCameraFoundationArchitecturalRole;
};

const FOUNDATION_IDENTITY: ExecutiveCameraFoundationIdentity = Object.freeze({
  id: executiveCameraFoundationIdentity,
  version: executiveCameraFoundationVersion,
  namespace: executiveCameraFoundationNamespace,
  phase: executiveCameraFoundationPhase,
  architecturalRole: executiveCameraFoundationArchitecturalRole,
});

export function getExecutiveCameraFoundationIdentity(): ExecutiveCameraFoundationIdentity {
  return FOUNDATION_IDENTITY;
}

export const EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveCameraFoundationArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsKpiState: false as const,
  ownsExecutiveSeverity: false as const,
  ownsObjectImportance: false as const,
  ownsDataReality: false as const,
  ownsRelationships: false as const,
  ownsWorkspaceSemantics: false as const,
  ownsAdvisorConclusions: false as const,
  ownsAttentionTruth: false as const,
  introducesOrbitUi: false as const,
  introducesFocusChoreography: false as const,
  introducesDensityAwareFraming: false as const,
  introducesFreeCameraNavigation: false as const,
  frameworkIndependentResolver: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveCameraVector = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

/**
 * Desired camera — spherical pose relative to an explicit look target.
 * Consumed by the resolver; never written by Three.js / R3F.
 */
export type ExecutiveCameraIntent = {
  readonly target: ExecutiveCameraVector;
  readonly distance: number;
  /** Horizontal orbit angle in radians (0 = +Z toward target). */
  readonly azimuth: number;
  /** Elevation above the horizontal plane in radians. */
  readonly elevation: number;
  readonly fov?: number;
};

/**
 * Resolved presentation pose for the active Stage camera.
 * Consumed by the R3F controller; not a source of business meaning.
 */
export type ExecutiveCameraPresentation = {
  readonly position: ExecutiveCameraVector;
  readonly target: ExecutiveCameraVector;
  readonly fov: number;
  readonly near: number;
  readonly far: number;
};

/**
 * Future shell-aware framing. SP:1.1 accepts padding; density-aware
 * composition remains deferred to later SP phases.
 */
export type ExecutiveCameraFramingPadding = {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
};

export type ResolveExecutiveCameraPresentationOptions = {
  readonly framing?: ExecutiveCameraFramingPadding;
  readonly near?: number;
  readonly far?: number;
  readonly fov?: number;
};

export type ExecutiveCameraTuplePresentation = {
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
  readonly fov: number;
  readonly near: number;
  readonly far: number;
};

// ─── Constraints & defaults ─────────────────────────────────────────────────

const DEG = Math.PI / 180;

export const EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS = Object.freeze({
  minimumDistance: 3.5,
  defaultDistance: 10.35,
  /** SP:1.7 — raised to admit calibrated high-density overview pullback. */
  maximumDistance: 14,
});

export const EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS = Object.freeze({
  minimumElevation: 14 * DEG,
  /** SP:4.3B — restrained volume reveal; network must not read as recession. */
  defaultElevation: 18 * DEG,
  maximumElevation: 52 * DEG,
});

export const EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS = Object.freeze({
  /** SP:4.3B — near-frontal executive view; avoid diagonal topology distortion. */
  defaultAzimuth: 8 * DEG,
});

export const EXECUTIVE_CAMERA_PROJECTION = Object.freeze({
  defaultFov: 42,
  focusFov: 40,
  near: 0.1,
  far: 80,
});

/**
 * Asymmetric shell-aware framing (SP:1.7).
 * Extra right/bottom room for Advisor pressure + Workspace Dial exclusion.
 */
export const DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING: ExecutiveCameraFramingPadding =
  Object.freeze({
    top: 0.1,
    right: 0.3,
    bottom: 0.22,
    left: 0.12,
  });

export const EXECUTIVE_STAGE_CENTER_TARGET: ExecutiveCameraVector = Object.freeze({
  x: 0,
  y: 0.12,
  z: 0,
});

export const EXECUTIVE_FOCUS_ANCHOR_TARGET: ExecutiveCameraVector = Object.freeze({
  x: 0,
  y: 0.42,
  z: 0,
});

/** Pre-readability Stage overview look target (composition center). */
export const EXECUTIVE_STAGE_OVERVIEW_TARGET: ExecutiveCameraVector = Object.freeze({
  x: 0,
  y: 0.1,
  z: 0,
});

/** Pre-readability Stage focus look target. */
export const EXECUTIVE_STAGE_FOCUS_TARGET: ExecutiveCameraVector = Object.freeze({
  x: 0,
  y: 0.25,
  z: 0,
});

export const DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT: ExecutiveCameraIntent =
  Object.freeze({
    target: EXECUTIVE_STAGE_CENTER_TARGET,
    distance: EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.defaultDistance,
    azimuth: EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS.defaultAzimuth,
    elevation: EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.defaultElevation,
    fov: EXECUTIVE_CAMERA_PROJECTION.defaultFov,
  });

export const DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT: ExecutiveCameraIntent =
  Object.freeze({
    target: EXECUTIVE_FOCUS_ANCHOR_TARGET,
    distance: 6.85,
    azimuth: EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS.defaultAzimuth,
    elevation: 16 * DEG,
    fov: EXECUTIVE_CAMERA_PROJECTION.focusFov,
  });

export const DEFAULT_EXECUTIVE_STAGE_OVERVIEW_CAMERA_INTENT: ExecutiveCameraIntent =
  Object.freeze({
    target: EXECUTIVE_STAGE_OVERVIEW_TARGET,
    distance: 9.55,
    azimuth: EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS.defaultAzimuth,
    elevation: EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.defaultElevation,
    fov: EXECUTIVE_CAMERA_PROJECTION.defaultFov,
  });

export const DEFAULT_EXECUTIVE_STAGE_FOCUS_CAMERA_INTENT: ExecutiveCameraIntent =
  Object.freeze({
    target: EXECUTIVE_STAGE_FOCUS_TARGET,
    distance: 7.05,
    azimuth: EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS.defaultAzimuth,
    elevation: 16 * DEG,
    fov: EXECUTIVE_CAMERA_PROJECTION.focusFov,
  });

// ─── Math helpers ───────────────────────────────────────────────────────────

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Stable presentation rounding — avoids -0 and float chatter. */
export function stabilizeExecutiveCameraScalar(value: number): number {
  const finite = finiteOr(value, 0);
  const rounded = Math.round(finite * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function stabilizeExecutiveCameraVector(
  vector: ExecutiveCameraVector,
): ExecutiveCameraVector {
  return Object.freeze({
    x: stabilizeExecutiveCameraScalar(vector.x),
    y: stabilizeExecutiveCameraScalar(vector.y),
    z: stabilizeExecutiveCameraScalar(vector.z),
  });
}

export function clampExecutiveCameraDistance(distance: number): number {
  const {
    minimumDistance,
    defaultDistance,
    maximumDistance,
  } = EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS;
  const value = finiteOr(distance, defaultDistance);
  return Math.min(maximumDistance, Math.max(minimumDistance, value));
}

export function clampExecutiveCameraElevation(elevation: number): number {
  const {
    minimumElevation,
    defaultElevation,
    maximumElevation,
  } = EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS;
  const value = finiteOr(elevation, defaultElevation);
  return Math.min(maximumElevation, Math.max(minimumElevation, value));
}

/** Normalize azimuth into (-π, π] for later orbit continuity. */
export function normalizeExecutiveCameraAzimuth(azimuth: number): number {
  const value = finiteOr(azimuth, EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS.defaultAzimuth);
  const tau = Math.PI * 2;
  let normalized = ((value % tau) + tau) % tau;
  if (normalized > Math.PI) {
    normalized -= tau;
  }
  return Object.is(normalized, -0) ? 0 : normalized;
}

function clampUnitPadding(value: number): number {
  const finite = finiteOr(value, 0);
  return Math.min(0.45, Math.max(0, finite));
}

export function normalizeExecutiveCameraFramingPadding(
  framing: ExecutiveCameraFramingPadding | undefined,
): ExecutiveCameraFramingPadding {
  const source = framing ?? DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING;
  return Object.freeze({
    top: clampUnitPadding(source.top),
    right: clampUnitPadding(source.right),
    bottom: clampUnitPadding(source.bottom),
    left: clampUnitPadding(source.left),
  });
}

/**
 * Mild shell-aware distance compensation. Does not implement density-aware
 * framing or object collision — only preserves readable Stage room.
 * When framing is omitted, distance is left unboosted (still clamped).
 */
export function applyExecutiveCameraFramingDistance(
  distance: number,
  framing: ExecutiveCameraFramingPadding | undefined,
): number {
  const clamped = clampExecutiveCameraDistance(distance);
  if (framing === undefined) {
    return clamped;
  }
  const padding = normalizeExecutiveCameraFramingPadding(framing);
  const horizontal = Math.max(padding.left, padding.right);
  const vertical = Math.max(padding.top, padding.bottom);
  const boost = 1 + horizontal * 0.35 + vertical * 0.2;
  return clampExecutiveCameraDistance(clamped * boost);
}

export function sanitizeExecutiveCameraIntent(
  intent: ExecutiveCameraIntent,
  options?: ResolveExecutiveCameraPresentationOptions,
): ExecutiveCameraIntent {
  const target = stabilizeExecutiveCameraVector({
    x: finiteOr(intent.target?.x, 0),
    y: finiteOr(intent.target?.y, 0),
    z: finiteOr(intent.target?.z, 0),
  });
  const distance = applyExecutiveCameraFramingDistance(
    clampExecutiveCameraDistance(intent.distance),
    options?.framing,
  );
  const elevation = clampExecutiveCameraElevation(intent.elevation);
  const azimuth = normalizeExecutiveCameraAzimuth(intent.azimuth);
  const fov = stabilizeExecutiveCameraScalar(
    finiteOr(
      options?.fov ?? intent.fov ?? EXECUTIVE_CAMERA_PROJECTION.defaultFov,
      EXECUTIVE_CAMERA_PROJECTION.defaultFov,
    ),
  );
  return Object.freeze({
    target,
    distance: stabilizeExecutiveCameraScalar(distance),
    azimuth: stabilizeExecutiveCameraScalar(azimuth),
    elevation: stabilizeExecutiveCameraScalar(elevation),
    fov,
  });
}

export function resolveExecutiveCameraPosition(
  intent: ExecutiveCameraIntent,
): ExecutiveCameraVector {
  const distance = clampExecutiveCameraDistance(intent.distance);
  const elevation = clampExecutiveCameraElevation(intent.elevation);
  const azimuth = normalizeExecutiveCameraAzimuth(intent.azimuth);
  const cosElevation = Math.cos(elevation);
  const sinElevation = Math.sin(elevation);
  const sinAzimuth = Math.sin(azimuth);
  const cosAzimuth = Math.cos(azimuth);

  return stabilizeExecutiveCameraVector({
    x: intent.target.x + distance * cosElevation * sinAzimuth,
    y: intent.target.y + distance * sinElevation,
    z: intent.target.z + distance * cosElevation * cosAzimuth,
  });
}

/**
 * Deterministic intent → presentation resolution.
 * Does not mutate input. Clamps unsafe values into usable executive bounds.
 */
export function resolveExecutiveCameraPresentation(
  intent: ExecutiveCameraIntent,
  options?: ResolveExecutiveCameraPresentationOptions,
): ExecutiveCameraPresentation {
  const safeIntent = sanitizeExecutiveCameraIntent(intent, options);
  const position = resolveExecutiveCameraPosition(safeIntent);
  const near = stabilizeExecutiveCameraScalar(
    Math.max(
      0.01,
      finiteOr(options?.near ?? EXECUTIVE_CAMERA_PROJECTION.near, 0.1),
    ),
  );
  const far = stabilizeExecutiveCameraScalar(
    Math.max(
      near + 1,
      finiteOr(options?.far ?? EXECUTIVE_CAMERA_PROJECTION.far, 80),
    ),
  );

  return Object.freeze({
    position,
    target: safeIntent.target,
    fov: safeIntent.fov ?? EXECUTIVE_CAMERA_PROJECTION.defaultFov,
    near,
    far,
  });
}

export function toExecutiveCameraTuplePresentation(
  presentation: ExecutiveCameraPresentation,
): ExecutiveCameraTuplePresentation {
  return Object.freeze({
    position: [
      presentation.position.x,
      presentation.position.y,
      presentation.position.z,
    ] as const,
    target: [
      presentation.target.x,
      presentation.target.y,
      presentation.target.z,
    ] as const,
    fov: presentation.fov,
    near: presentation.near,
    far: presentation.far,
  });
}

export function resolveDefaultExecutiveCameraPresentation(
  mode: "overview" | "focus",
  options?: ResolveExecutiveCameraPresentationOptions,
): ExecutiveCameraPresentation {
  const intent =
    mode === "focus"
      ? DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT
      : DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT;
  return resolveExecutiveCameraPresentation(intent, {
    framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
    ...options,
  });
}

export function resolveDefaultExecutiveStageCameraPresentation(
  mode: "overview" | "focus",
  options?: ResolveExecutiveCameraPresentationOptions,
): ExecutiveCameraPresentation {
  const intent =
    mode === "focus"
      ? DEFAULT_EXECUTIVE_STAGE_FOCUS_CAMERA_INTENT
      : DEFAULT_EXECUTIVE_STAGE_OVERVIEW_CAMERA_INTENT;
  return resolveExecutiveCameraPresentation(intent, {
    framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
    ...options,
  });
}

export const DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_PRESENTATION =
  resolveDefaultExecutiveCameraPresentation("overview");

export const DEFAULT_EXECUTIVE_FOCUS_CAMERA_PRESENTATION =
  resolveDefaultExecutiveCameraPresentation("focus");

export const DEFAULT_EXECUTIVE_STAGE_OVERVIEW_CAMERA_PRESENTATION =
  resolveDefaultExecutiveStageCameraPresentation("overview");

export const DEFAULT_EXECUTIVE_STAGE_FOCUS_CAMERA_PRESENTATION =
  resolveDefaultExecutiveStageCameraPresentation("focus");

export const DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_TUPLE =
  toExecutiveCameraTuplePresentation(
    DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_PRESENTATION,
  );

export const DEFAULT_EXECUTIVE_FOCUS_CAMERA_TUPLE =
  toExecutiveCameraTuplePresentation(
    DEFAULT_EXECUTIVE_FOCUS_CAMERA_PRESENTATION,
  );

export const DEFAULT_EXECUTIVE_STAGE_OVERVIEW_CAMERA_TUPLE =
  toExecutiveCameraTuplePresentation(
    DEFAULT_EXECUTIVE_STAGE_OVERVIEW_CAMERA_PRESENTATION,
  );

export const DEFAULT_EXECUTIVE_STAGE_FOCUS_CAMERA_TUPLE =
  toExecutiveCameraTuplePresentation(
    DEFAULT_EXECUTIVE_STAGE_FOCUS_CAMERA_PRESENTATION,
  );

export function verifyExecutiveCameraFoundation(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly resolutionDeterministic: boolean;
  readonly presentationOnly: boolean;
}> {
  const identity = getExecutiveCameraFoundationIdentity();
  const identityValid =
    identity.id === "SP:1.1/ExecutiveCameraFoundation" &&
    identity.version === "1.1.0" &&
    identity.namespace ===
      "nexora.spatial-presentation.executive-camera" &&
    identity.architecturalRole ===
      "PresentationOnlyExecutiveCameraResolution";

  const boundaryValid =
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsDataReality === false &&
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.introducesOrbitUi === false &&
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.frameworkIndependentResolver === true;

  const a = resolveExecutiveCameraPresentation(
    DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
    { framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING },
  );
  const b = resolveExecutiveCameraPresentation(
    DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
    { framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING },
  );
  const resolutionDeterministic = JSON.stringify(a) === JSON.stringify(b);

  const presentationOnly =
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsKpiState === false &&
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsAdvisorConclusions === false &&
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsAttentionTruth === false;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    resolutionDeterministic &&
    presentationOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    resolutionDeterministic,
    presentationOnly,
  });
}
