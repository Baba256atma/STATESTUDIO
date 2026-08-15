/**
 * STAGE-DEPTH:1 — Executive Stage Deep-Z Visual Environment.
 *
 * Presentation-only atmospheric depth behind the certified STAGE-2D plane.
 *
 * Absolute separation:
 *   VISUAL DEPTH ≠ TOPOLOGY DEPTH
 *
 * Semantic topology remains:
 *   z = 0, XY hard separation, fixed camera, one-hop navigation.
 */

import { EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE } from "./executiveStage2DFixedCamera.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageDeepZVisualEnvironmentIdentity =
  "STAGE-DEPTH:1/ExecutiveStageDeepZVisualEnvironment" as const;

export const executiveStageDeepZVisualEnvironmentVersion = "3.1.0" as const;

export const executiveStageDeepZVisualEnvironmentNamespace =
  "nexora.spatial-presentation.executive-stage-deep-z-visual-environment" as const;

export const executiveStageDeepZVisualEnvironmentPhase =
  "ExecutiveStageDeepZVisualVortexFoundation" as const;

export const executiveStageDeepZVisualEnvironmentArchitecturalRole =
  "PresentationOnlyStageDeepZVisualEnvironment" as const;

export type ExecutiveStageDeepZVisualEnvironmentIdentity = {
  readonly id: typeof executiveStageDeepZVisualEnvironmentIdentity;
  readonly version: typeof executiveStageDeepZVisualEnvironmentVersion;
  readonly namespace: typeof executiveStageDeepZVisualEnvironmentNamespace;
  readonly phase: typeof executiveStageDeepZVisualEnvironmentPhase;
  readonly architecturalRole: typeof executiveStageDeepZVisualEnvironmentArchitecturalRole;
};

const IDENTITY: ExecutiveStageDeepZVisualEnvironmentIdentity = Object.freeze({
  id: executiveStageDeepZVisualEnvironmentIdentity,
  version: executiveStageDeepZVisualEnvironmentVersion,
  namespace: executiveStageDeepZVisualEnvironmentNamespace,
  phase: executiveStageDeepZVisualEnvironmentPhase,
  architecturalRole: executiveStageDeepZVisualEnvironmentArchitecturalRole,
});

export function getExecutiveStageDeepZVisualEnvironmentIdentity(): ExecutiveStageDeepZVisualEnvironmentIdentity {
  return IDENTITY;
}

export type ExecutiveStageSpatialLayer =
  | "semantic-plane"
  | "visual-depth-environment";

export const EXECUTIVE_STAGE_DEEP_Z_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageDeepZVisualEnvironmentArchitecturalRole,
  spatialLayer: "visual-depth-environment" as const,
  isNexoraObject: false as const,
  participatesInRelationships: false as const,
  participatesInCollision: false as const,
  participatesInNavigation: false as const,
  participatesInAdvisorSubject: false as const,
  interactive: false as const,
  movesCamera: false as const,
  movesSemanticObjects: false as const,
  usesZForTopology: false as const,
  /** Camera looks along −Z from +Z; deeper atmosphere is negative Z. */
  depthAxis: "-Z" as const,
  cameraDistance: EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
});

/**
 * Camera at (0,0,11) → (0,0,0) looks approximately along −Z.
 * Deeper background therefore occupies z < 0.
 */
export const EXECUTIVE_STAGE_DEEP_Z_RANGE = Object.freeze({
  semanticPlaneZ: 0 as const,
  near: -1 as const,
  far: -10 as const,
  rings: Object.freeze([
    Object.freeze({ z: -1.5, scale: 1.05, opacity: 0.07 }),
    Object.freeze({ z: -2.5, scale: 1.28, opacity: 0.09 }),
    Object.freeze({ z: -3.8, scale: 1.55, opacity: 0.1 }),
    Object.freeze({ z: -5.2, scale: 1.9, opacity: 0.085 }),
    Object.freeze({ z: -7.0, scale: 2.35, opacity: 0.065 }),
    Object.freeze({ z: -9.0, scale: 2.9, opacity: 0.045 }),
  ]),
  particleCount: 96,
  radialSegmentCount: 16,
  quietZoneRadius: 0.95,
});

export const EXECUTIVE_STAGE_DEEP_Z_OBSERVABILITY = Object.freeze({
  contract: "stage-depth-1" as const,
  depthEnvironment: "deep-z" as const,
  interactive: "false" as const,
});

/** Dev/test toggle — not a user-facing setting. */
let deepZEnvironmentEnabled = true;

export function setExecutiveStageDeepZEnvironmentEnabled(
  enabled: boolean,
): void {
  deepZEnvironmentEnabled = enabled === true;
}

function readDeepZQueryOverride(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("deepZ") ?? params.get("stageDeepZ");
    if (flag === "0" || flag === "off" || flag === "false") return false;
    if (flag === "1" || flag === "on" || flag === "true") return true;
  } catch {
    return null;
  }
  return null;
}

export function isExecutiveStageDeepZEnvironmentEnabled(): boolean {
  const query = readDeepZQueryOverride();
  if (query != null) return query;
  if (typeof process !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_NEXORA_STAGE_DEEP_Z;
    if (fromEnv === "0" || fromEnv === "false" || fromEnv === "off") {
      return false;
    }
    if (fromEnv === "1" || fromEnv === "true" || fromEnv === "on") {
      return true;
    }
  }
  return deepZEnvironmentEnabled;
}

export function getExecutiveStageDeepZVisualEnvironmentObservability(input?: {
  readonly enabled?: boolean;
  readonly reducedMotion?: boolean;
}): Readonly<{
  readonly contract: string;
  readonly depthEnvironment: string;
  readonly semanticPlaneZ: string;
  readonly depthNear: string;
  readonly depthFar: string;
  readonly depthInteractive: string;
  readonly cameraFixed: string;
  readonly enabled: string;
  readonly reducedMotion: string;
  readonly spatialLayer: ExecutiveStageSpatialLayer;
}> {
  const enabled =
    input?.enabled ?? isExecutiveStageDeepZEnvironmentEnabled();
  return Object.freeze({
    contract: EXECUTIVE_STAGE_DEEP_Z_OBSERVABILITY.contract,
    depthEnvironment: enabled
      ? EXECUTIVE_STAGE_DEEP_Z_OBSERVABILITY.depthEnvironment
      : "off",
    semanticPlaneZ: "0",
    depthNear: String(EXECUTIVE_STAGE_DEEP_Z_RANGE.near),
    depthFar: String(EXECUTIVE_STAGE_DEEP_Z_RANGE.far),
    depthInteractive: EXECUTIVE_STAGE_DEEP_Z_OBSERVABILITY.interactive,
    cameraFixed: "true",
    enabled: enabled ? "true" : "false",
    reducedMotion: input?.reducedMotion === true ? "true" : "false",
    spatialLayer: "visual-depth-environment",
  });
}

export function classifyExecutiveStageSpatialLayer(
  layer: ExecutiveStageSpatialLayer,
): ExecutiveStageSpatialLayer {
  return layer;
}

export function verifyExecutiveStageDeepZVisualEnvironment(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly depthBehindPlane: boolean;
  readonly nonInteractive: boolean;
  readonly nonSemantic: boolean;
}> {
  const identity = getExecutiveStageDeepZVisualEnvironmentIdentity();
  const identityValid =
    identity.id === "STAGE-DEPTH:1/ExecutiveStageDeepZVisualEnvironment" &&
    identity.version === "3.1.0";
  const depthBehindPlane =
    EXECUTIVE_STAGE_DEEP_Z_RANGE.near < 0 &&
    EXECUTIVE_STAGE_DEEP_Z_RANGE.far < EXECUTIVE_STAGE_DEEP_Z_RANGE.near &&
    EXECUTIVE_STAGE_DEEP_Z_RANGE.rings.every((ring) => ring.z < 0);
  return Object.freeze({
    ok:
      identityValid &&
      depthBehindPlane &&
      EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.interactive === false &&
      EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.isNexoraObject === false,
    identityValid,
    depthBehindPlane,
    nonInteractive: EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.interactive === false,
    nonSemantic: EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.isNexoraObject === false,
  });
}
