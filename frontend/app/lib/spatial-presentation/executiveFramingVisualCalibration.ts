/**
 * SP:1.7 — Executive Framing Visual Calibration.
 *
 * Visual calibration pass over SP:1.1–SP:1.6. Does not introduce a second
 * camera or composition authority. Corrects too-close overview framing and
 * usable-viewport / UI-exclusion safety after human visual failure sign-off.
 *
 * Architecture: Verified by SP:1.1–1.6
 * Automated validation: this module + tests
 * Human visual validation: required separately for SP:1 sign-off
 */

import {
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  clampExecutiveCameraDistance,
  executiveCameraFoundationIdentity,
  normalizeExecutiveCameraFramingPadding,
  resolveExecutiveCameraPresentation,
  sanitizeExecutiveCameraIntent,
  type ExecutiveCameraFramingPadding,
  type ExecutiveCameraIntent,
  type ExecutiveCameraVector,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  type ExecutiveSpatialVector,
} from "./executiveSpatialComposition.ts";
import {
  EXECUTIVE_FOCUS_VIEWING_POLICY,
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
  executiveViewingAngleIdentity,
} from "./executiveViewingAngle.ts";

/** Avoid importing SP:1.6 module (cycle risk); identity string only. */
const UPSTREAM_DENSITY_FRAMING_IDENTITY =
  "SP:1.6/ExecutiveDensityAwareFraming" as const;

export type ExecutiveStageDensityProfile =
  | "sparse"
  | "balanced"
  | "dense"
  | "high-density";

export type ExecutiveOccupiedSpatialBounds = {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly minZ: number;
  readonly maxZ: number;
};

export type ExecutiveStageViewport = {
  readonly width: number;
  readonly height: number;
  readonly usableWidthRatio?: number;
  readonly usableHeightRatio?: number;
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveFramingVisualCalibrationIdentity =
  "SP:1.7/ExecutiveFramingVisualCalibration" as const;

export const executiveFramingVisualCalibrationVersion = "1.7.0" as const;

export const executiveFramingVisualCalibrationNamespace =
  "nexora.spatial-presentation.executive-framing-visual-calibration" as const;

export const executiveFramingVisualCalibrationPhase =
  "ExecutiveFramingVisualCalibration" as const;

export const executiveFramingVisualCalibrationArchitecturalRole =
  "PresentationOnlyExecutiveFramingVisualCalibration" as const;

export const executiveFramingVisualCalibrationReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveFramingVisualCalibrationIdentity = {
  readonly id: typeof executiveFramingVisualCalibrationIdentity;
  readonly version: typeof executiveFramingVisualCalibrationVersion;
  readonly namespace: typeof executiveFramingVisualCalibrationNamespace;
  readonly phase: typeof executiveFramingVisualCalibrationPhase;
  readonly architecturalRole: typeof executiveFramingVisualCalibrationArchitecturalRole;
  readonly upstreamCameraFoundation: typeof executiveCameraFoundationIdentity;
  readonly upstreamViewingAngle: typeof executiveViewingAngleIdentity;
  readonly upstreamDensityFraming: typeof UPSTREAM_DENSITY_FRAMING_IDENTITY;
};

const CALIBRATION_IDENTITY: ExecutiveFramingVisualCalibrationIdentity =
  Object.freeze({
    id: executiveFramingVisualCalibrationIdentity,
    version: executiveFramingVisualCalibrationVersion,
    namespace: executiveFramingVisualCalibrationNamespace,
    phase: executiveFramingVisualCalibrationPhase,
    architecturalRole: executiveFramingVisualCalibrationArchitecturalRole,
    upstreamCameraFoundation: executiveCameraFoundationIdentity,
    upstreamViewingAngle: executiveViewingAngleIdentity,
    upstreamDensityFraming: UPSTREAM_DENSITY_FRAMING_IDENTITY,
  });

export function getExecutiveFramingVisualCalibrationIdentity(): ExecutiveFramingVisualCalibrationIdentity {
  return CALIBRATION_IDENTITY;
}

export const EXECUTIVE_FRAMING_VISUAL_CALIBRATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveFramingVisualCalibrationArchitecturalRole,
  ownsBusinessTruth: false as const,
  createsCompetingCameraAuthority: false as const,
  replacesSpatialComposition: false as const,
  objectSpecificHacks: false as const,
  redesignsLabels: false as const,
  redesignsObjectGeometry: false as const,
  startsStagePolish: false as const,
  presentationOnly: true as const,
});

// ─── Pre-SP:1.7 baselines (documented for regression) ───────────────────────

/** Obsolete too-close overview family retained for regression assertions. */
export const EXECUTIVE_FRAMING_PRE_CALIBRATION_OVERVIEW_DISTANCE = Object.freeze({
  sparse: 7.85,
  balanced: 8.85,
  dense: 10.05,
  "high-density": 11.25,
} as const);

export const EXECUTIVE_FRAMING_PRE_CALIBRATION_FOCUS_DISTANCE = Object.freeze({
  focusOnly: 5.95,
  smallCluster: 6.55,
  mediumCluster: 7.05,
  largeCluster: 7.55,
} as const);

// ─── Safe framing envelope ──────────────────────────────────────────────────

/**
 * Normalized usable-screen margins (0–1 of half-extent after NDC map).
 * Asymmetric: bottom-right reserved for Workspace Dial + camera controls.
 */
/**
 * Normalized NDC edge insets (0–1). Safe region is |ndc| <= 1 - margin.
 * Asymmetric: more right/bottom for Advisor + Workspace Dial.
 */
export const EXECUTIVE_SAFE_FRAMING_MARGINS = Object.freeze({
  left: 0.1,
  // SP:2.8A — stronger right/bottom clearance for full Dial panel + Timeline.
  right: 0.34,
  top: 0.1,
  bottom: 0.3,
});

/**
 * Workspace Dial exclusion in normalized Stage space (bottom-right quadrant).
 * Represents the visible Dial *panel* (body + control + title + options)
 * plus a small breathing margin — not only the circular control.
 *
 * SP:2.8A — panel-accurate NDC footprint. Outer-right mid slots project to
 * moderate NDC x; the Dial panel sits further right and lower. Geometry
 * clearance for bottom-right objects is owned by SP:1.4 UI overlay safe-zone;
 * this envelope primarily protects labels/framing from the Dial panel.
 */
export const EXECUTIVE_WORKSPACE_DIAL_EXCLUSION = Object.freeze({
  /** NDC x minimum for dial panel zone (right side of Stage). */
  minNdcX: 0.42,
  /** NDC y maximum for dial panel zone (bottom; NDC y decreases downward). */
  maxNdcY: -0.32,
});

/** Default object/label extent used when expanding occupied AABB. */
export const EXECUTIVE_FRAMING_OBJECT_EXTENT = Object.freeze({
  radius: 0.32,
  labelPadding: 0.18,
});

/**
 * Calibrated overview intent distances (pre-framing-boost).
 * Balanced is the primary default experience — no manual Zoom Out required.
 */
export const EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE = Object.freeze({
  // SP:2.8 — modest pullback so wider constellation envelope still fits Dial margins.
  sparse: 9.45,
  balanced: 10.65,
  dense: 11.85,
  "high-density": 12.95,
} as const satisfies Record<ExecutiveStageDensityProfile, number>);

/**
 * Calibrated focus cluster distances — modest pullback for breathing room
 * without making focus feel distant.
 */
export const EXECUTIVE_CALIBRATED_FOCUS_DISTANCE = Object.freeze({
  focusOnly: 6.55,
  smallCluster: 7.15,
  mediumCluster: 7.75,
  largeCluster: 8.35,
});

/** Modest overview target offset away from Dial (presentation-only). */
export const EXECUTIVE_CALIBRATED_OVERVIEW_TARGET: ExecutiveCameraVector =
  Object.freeze({
    x: -0.22,
    y: 0.2,
    z: 0.02,
  });

export type ExecutiveSafeFramingEnvelope = {
  readonly margins: typeof EXECUTIVE_SAFE_FRAMING_MARGINS;
  readonly dialExclusion: typeof EXECUTIVE_WORKSPACE_DIAL_EXCLUSION;
  readonly objectExtent: typeof EXECUTIVE_FRAMING_OBJECT_EXTENT;
  readonly framingPadding: ExecutiveCameraFramingPadding;
};

export const EXECUTIVE_SAFE_FRAMING_ENVELOPE: ExecutiveSafeFramingEnvelope =
  Object.freeze({
    margins: EXECUTIVE_SAFE_FRAMING_MARGINS,
    dialExclusion: EXECUTIVE_WORKSPACE_DIAL_EXCLUSION,
    objectExtent: EXECUTIVE_FRAMING_OBJECT_EXTENT,
    framingPadding: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
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

export function expandExecutiveOccupiedBoundsWithExtents(
  bounds: ExecutiveOccupiedSpatialBounds,
  extent: {
    readonly radius?: number;
    readonly labelPadding?: number;
  } = EXECUTIVE_FRAMING_OBJECT_EXTENT,
): ExecutiveOccupiedSpatialBounds {
  const radius = Math.max(0, finiteOr(extent.radius ?? 0.42, 0.42));
  const label = Math.max(0, finiteOr(extent.labelPadding ?? 0.28, 0.28));
  const pad = radius + label * 0.55;
  return Object.freeze({
    minX: bounds.minX - pad,
    maxX: bounds.maxX + pad,
    minY: bounds.minY - radius * 0.65,
    maxY: bounds.maxY + pad,
    minZ: bounds.minZ - pad,
    maxZ: bounds.maxZ + pad,
  });
}

export function executiveOccupiedBoundsCorners(
  bounds: ExecutiveOccupiedSpatialBounds,
): readonly ExecutiveSpatialVector[] {
  const xs = [bounds.minX, bounds.maxX] as const;
  const ys = [bounds.minY, bounds.maxY] as const;
  const zs = [bounds.minZ, bounds.maxZ] as const;
  const corners: ExecutiveSpatialVector[] = [];
  for (const x of xs) {
    for (const y of ys) {
      for (const z of zs) {
        corners.push(Object.freeze({ x, y, z }));
      }
    }
  }
  return Object.freeze(corners);
}

type ExecutiveNdcPoint = {
  readonly x: number;
  readonly y: number;
  readonly depth: number;
};

/**
 * Project a world point into approximate NDC using the SP:1.1 camera pose.
 * y increases upward (standard NDC). Framework-independent.
 */
export function projectExecutiveWorldPointToNdc(input: {
  readonly point: ExecutiveSpatialVector;
  readonly cameraPosition: ExecutiveCameraVector;
  readonly cameraTarget: ExecutiveCameraVector;
  readonly fovDegrees: number;
  readonly aspect: number;
}): ExecutiveNdcPoint | null {
  const forward = {
    x: input.cameraTarget.x - input.cameraPosition.x,
    y: input.cameraTarget.y - input.cameraPosition.y,
    z: input.cameraTarget.z - input.cameraPosition.z,
  };
  const forwardLength = Math.hypot(forward.x, forward.y, forward.z);
  if (forwardLength < 1e-6) return null;
  const f = {
    x: forward.x / forwardLength,
    y: forward.y / forwardLength,
    z: forward.z / forwardLength,
  };

  // Right = normalize(cross(f, worldUp)); up = cross(right, f)
  const worldUp = { x: 0, y: 1, z: 0 };
  let right = {
    x: f.y * worldUp.z - f.z * worldUp.y,
    y: f.z * worldUp.x - f.x * worldUp.z,
    z: f.x * worldUp.y - f.y * worldUp.x,
  };
  const rightLength = Math.hypot(right.x, right.y, right.z);
  if (rightLength < 1e-6) return null;
  right = {
    x: right.x / rightLength,
    y: right.y / rightLength,
    z: right.z / rightLength,
  };
  const up = {
    x: right.y * f.z - right.z * f.y,
    y: right.z * f.x - right.x * f.z,
    z: right.x * f.y - right.y * f.x,
  };

  const toPoint = {
    x: input.point.x - input.cameraPosition.x,
    y: input.point.y - input.cameraPosition.y,
    z: input.point.z - input.cameraPosition.z,
  };
  const depth = toPoint.x * f.x + toPoint.y * f.y + toPoint.z * f.z;
  if (depth <= 0.05) return null;

  const xCam = toPoint.x * right.x + toPoint.y * right.y + toPoint.z * right.z;
  const yCam = toPoint.x * up.x + toPoint.y * up.y + toPoint.z * up.z;
  const fovRad = (finiteOr(input.fovDegrees, 38) * Math.PI) / 180;
  const tanHalf = Math.tan(fovRad / 2);
  const aspect = Math.max(0.35, finiteOr(input.aspect, 1.45));
  const ndcX = xCam / (depth * tanHalf * aspect);
  const ndcY = yCam / (depth * tanHalf);
  return Object.freeze({
    x: stabilize(ndcX),
    y: stabilize(ndcY),
    depth: stabilize(depth),
  });
}

function isInsideDialExclusion(ndc: ExecutiveNdcPoint): boolean {
  return (
    ndc.x >= EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.minNdcX &&
    ndc.y <= EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.maxNdcY
  );
}

function marginLimit(side: "left" | "right" | "top" | "bottom"): number {
  const margin = EXECUTIVE_SAFE_FRAMING_MARGINS[side];
  // Safe |ndc| must remain at or below (1 - margin).
  return 1 - margin;
}

export type ExecutiveFramingFitResult = {
  readonly fits: boolean;
  readonly geometricClipping: boolean;
  readonly uiOcclusion: boolean;
  readonly violatedEdges: readonly (
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "dial"
  )[];
  readonly requiredDistanceScale: number;
};

/**
 * Validate that occupied composition extents fit inside the executive safe
 * framing envelope for a camera intent (geometric + Dial UI occlusion).
 */
export function validateExecutiveFramingFit(input: {
  readonly cameraIntent: ExecutiveCameraIntent;
  readonly occupiedBounds: ExecutiveOccupiedSpatialBounds;
  readonly viewport?: ExecutiveStageViewport;
  readonly framing?: ExecutiveCameraFramingPadding;
  readonly includeExtents?: boolean;
}): ExecutiveFramingFitResult {
  const bounds =
    input.includeExtents === false
      ? input.occupiedBounds
      : expandExecutiveOccupiedBoundsWithExtents(input.occupiedBounds);

  const presentation = resolveExecutiveCameraPresentation(input.cameraIntent, {
    framing: input.framing ?? DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  });

  const width = Math.max(1, finiteOr(input.viewport?.width ?? 1280, 1280));
  const height = Math.max(1, finiteOr(input.viewport?.height ?? 800, 800));
  const usableWidth = clamp(
    finiteOr(input.viewport?.usableWidthRatio ?? 1, 1),
    0.35,
    1,
  );
  const aspect = (width * usableWidth) / height;

  const violated = new Set<
    "left" | "right" | "top" | "bottom" | "dial"
  >();
  let maxAbsX = 0;
  let maxAbsY = 0;

  for (const corner of executiveOccupiedBoundsCorners(bounds)) {
    const ndc = projectExecutiveWorldPointToNdc({
      point: corner,
      cameraPosition: presentation.position,
      cameraTarget: presentation.target,
      fovDegrees: presentation.fov,
      aspect,
    });
    if (ndc == null) {
      violated.add("top");
      continue;
    }
    const xLimit = marginLimit(ndc.x >= 0 ? "right" : "left");
    const yLimit = marginLimit(ndc.y >= 0 ? "top" : "bottom");
    if (Math.abs(ndc.x) > xLimit) {
      violated.add(ndc.x >= 0 ? "right" : "left");
    }
    if (Math.abs(ndc.y) > yLimit) {
      violated.add(ndc.y >= 0 ? "top" : "bottom");
    }
    if (isInsideDialExclusion(ndc)) {
      violated.add("dial");
    }
    maxAbsX = Math.max(maxAbsX, Math.abs(ndc.x) / Math.max(1e-6, xLimit));
    maxAbsY = Math.max(maxAbsY, Math.abs(ndc.y) / Math.max(1e-6, yLimit));
  }

  const geometricClipping =
    violated.has("left") ||
    violated.has("right") ||
    violated.has("top") ||
    violated.has("bottom");
  const uiOcclusion = violated.has("dial");
  const requiredDistanceScale = stabilize(
    clamp(Math.max(maxAbsX, maxAbsY, uiOcclusion ? 1.08 : 1), 1, 1.45),
  );

  return Object.freeze({
    fits: violated.size === 0,
    geometricClipping,
    uiOcclusion,
    violatedEdges: Object.freeze([...violated]),
    requiredDistanceScale,
  });
}

/**
 * Resolve a calibrated overview distance that fits occupied bounds into the
 * safe envelope. Starts from the density profile distance; pulls back if needed.
 */
export function resolveExecutiveCalibratedOverviewDistance(input: {
  readonly profile: ExecutiveStageDensityProfile;
  readonly baseDistance: number;
  readonly cameraIntentBase: Omit<ExecutiveCameraIntent, "distance"> & {
    readonly distance?: number;
  };
  readonly occupiedBounds?: ExecutiveOccupiedSpatialBounds;
  readonly viewport?: ExecutiveStageViewport;
}): number {
  let distance = clampExecutiveCameraDistance(
    finiteOr(
      input.baseDistance,
      EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE[input.profile],
    ),
  );

  if (input.occupiedBounds === undefined) {
    return distance;
  }

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const fit = validateExecutiveFramingFit({
      cameraIntent: sanitizeExecutiveCameraIntent(
        Object.freeze({
          target: input.cameraIntentBase.target,
          distance,
          azimuth: input.cameraIntentBase.azimuth,
          elevation: input.cameraIntentBase.elevation,
          fov: input.cameraIntentBase.fov,
        }),
      ),
      occupiedBounds: input.occupiedBounds,
      ...(input.viewport !== undefined ? { viewport: input.viewport } : {}),
    });
    if (fit.fits) {
      return distance;
    }
    distance = clampExecutiveCameraDistance(
      distance * Math.max(1.04, fit.requiredDistanceScale),
    );
  }
  return distance;
}

export function isObsoleteTooCloseOverviewDistance(distance: number): boolean {
  return (
    finiteOr(distance, 0) <=
    EXECUTIVE_FRAMING_PRE_CALIBRATION_OVERVIEW_DISTANCE.balanced + 0.2
  );
}

export function verifyExecutiveFramingVisualCalibration(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly balancedFartherThanObsolete: boolean;
  readonly maxDistanceAllowsCalibration: boolean;
}> {
  const identity = getExecutiveFramingVisualCalibrationIdentity();
  const identityValid =
    identity.id === "SP:1.7/ExecutiveFramingVisualCalibration" &&
    identity.version === "1.7.0" &&
    identity.upstreamDensityFraming ===
      "SP:1.6/ExecutiveDensityAwareFraming";

  const boundaryValid =
    EXECUTIVE_FRAMING_VISUAL_CALIBRATION_BOUNDARY.objectSpecificHacks ===
      false &&
    EXECUTIVE_FRAMING_VISUAL_CALIBRATION_BOUNDARY.createsCompetingCameraAuthority ===
      false &&
    EXECUTIVE_FRAMING_VISUAL_CALIBRATION_BOUNDARY.startsStagePolish === false;

  const balancedFartherThanObsolete =
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced >
      EXECUTIVE_FRAMING_PRE_CALIBRATION_OVERVIEW_DISTANCE.balanced + 0.75 &&
    EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance >=
      EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced - 1e-9;

  const maxDistanceAllowsCalibration =
    EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance >=
      EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE["high-density"] &&
    EXECUTIVE_FOCUS_VIEWING_POLICY.distance >=
      EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.smallCluster - 1e-9;

  const padding = normalizeExecutiveCameraFramingPadding(
    DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  );
  const asymmetric =
    padding.right > padding.left && padding.bottom > padding.top;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    balancedFartherThanObsolete &&
    maxDistanceAllowsCalibration &&
    asymmetric;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    balancedFartherThanObsolete,
    maxDistanceAllowsCalibration,
  });
}

/** Composition envelope used by regression fixtures (no object-ID logic). */
export function createExecutiveBoundaryCompositionBounds(input: {
  readonly leftEdgeX?: number;
  readonly rightEdgeX?: number;
  readonly lowerZ?: number;
  readonly upperZ?: number;
}): ExecutiveOccupiedSpatialBounds {
  return Object.freeze({
    minX: finiteOr(
      input.leftEdgeX ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minX,
      EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minX,
    ),
    maxX: finiteOr(
      input.rightEdgeX ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxX,
      EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxX,
    ),
    minY: EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY,
    maxY: EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxY,
    minZ: finiteOr(
      input.lowerZ ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minZ,
      EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minZ,
    ),
    maxZ: finiteOr(
      input.upperZ ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxZ,
      EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxZ,
    ),
  });
}
