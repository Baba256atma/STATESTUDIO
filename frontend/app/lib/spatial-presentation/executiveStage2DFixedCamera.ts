/**
 * STAGE-2D:1 — Fixed Camera Foundation for the Nexora Executive Stage.
 *
 * Product contract:
 *   Camera stays fixed → Stage center stays fixed → topology moves later.
 *
 * Coordinate convention (canonical):
 *   Stage horizontal = X
 *   Stage vertical   = Y
 *   Stage depth      = Z
 *   CANONICAL_STAGE_DEPTH  = 0
 *   CANONICAL_STAGE_CENTER = { x: 0, y: 0, z: 0 }
 *
 * Authority:
 *   FIXED STAGE CAMERA
 *     > focus-driven camera behavior
 *     > attention-driven camera behavior
 *     > scene choreography camera behavior
 *     > fallback camera behavior
 *
 * Object moves. Camera does not.
 */

import {
  EXECUTIVE_CAMERA_PROJECTION,
  stabilizeExecutiveCameraScalar,
  stabilizeExecutiveCameraVector,
  toExecutiveCameraTuplePresentation,
  type ExecutiveCameraPresentation,
  type ExecutiveCameraTuplePresentation,
  type ExecutiveCameraVector,
} from "./executiveCameraFoundation.ts";
import { EXECUTIVE_RENDER_PLANE_Z } from "./executiveTrue2DStageAuthority.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStage2DFixedCameraIdentity =
  "STAGE-2D:1/ExecutiveStage2DFixedCamera" as const;

export const executiveStage2DFixedCameraVersion = "2.1.0" as const;

export const executiveStage2DFixedCameraNamespace =
  "nexora.spatial-presentation.executive-stage-2d-fixed-camera" as const;

export const executiveStage2DFixedCameraPhase =
  "ExecutiveStage2DFixedCameraFoundation" as const;

export const executiveStage2DFixedCameraArchitecturalRole =
  "PresentationOnlyFixedStageCameraAuthority" as const;

export type ExecutiveStage2DFixedCameraIdentity = {
  readonly id: typeof executiveStage2DFixedCameraIdentity;
  readonly version: typeof executiveStage2DFixedCameraVersion;
  readonly namespace: typeof executiveStage2DFixedCameraNamespace;
  readonly phase: typeof executiveStage2DFixedCameraPhase;
  readonly architecturalRole: typeof executiveStage2DFixedCameraArchitecturalRole;
};

const IDENTITY: ExecutiveStage2DFixedCameraIdentity = Object.freeze({
  id: executiveStage2DFixedCameraIdentity,
  version: executiveStage2DFixedCameraVersion,
  namespace: executiveStage2DFixedCameraNamespace,
  phase: executiveStage2DFixedCameraPhase,
  architecturalRole: executiveStage2DFixedCameraArchitecturalRole,
});

export function getExecutiveStage2DFixedCameraIdentity(): ExecutiveStage2DFixedCameraIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY = Object.freeze({
  architecturalRole: executiveStage2DFixedCameraArchitecturalRole,
  cameraMode: "fixed-2d" as const,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsAttentionTruth: false as const,
  ownsTopologyLayout: false as const,
  movesCameraOnFocus: false as const,
  movesCameraOnSelection: false as const,
  movesCameraOnAttention: false as const,
  movesCameraOnDirectorIntent: false as const,
  allowsOrbit: false as const,
  allowsPan: false as const,
  allowsZoom: false as const,
  allowsAutoRotate: false as const,
  introducesOrbitControls: false as const,
  retargetsOnObjectFocus: false as const,
  /** Projection remains PerspectiveCamera for STAGE-2D:1 (stable, localized). */
  cameraProjection: "perspective" as const,
});

/**
 * Authority law — fixed Stage camera outranks every competing camera writer.
 */
export const EXECUTIVE_STAGE_2D_CAMERA_AUTHORITY = Object.freeze({
  statement: "Object moves. Camera does not.",
  rank: Object.freeze([
    "fixed-stage-camera",
    "focus-driven-camera",
    "attention-driven-camera",
    "scene-choreography-camera",
    "fallback-camera",
  ] as const),
});

// ─── Canonical Stage coordinate contract ────────────────────────────────────

/** Canonical Stage depth — topology must not use Z for separation. */
export const EXECUTIVE_STAGE_2D_DEPTH = EXECUTIVE_RENDER_PLANE_Z;

/** Alias matching the STAGE-2D:1 mission vocabulary. */
export const CANONICAL_STAGE_DEPTH = EXECUTIVE_STAGE_2D_DEPTH;

/** Canonical Stage center — sole authoritative camera target. */
export const EXECUTIVE_STAGE_2D_CENTER: ExecutiveCameraVector = Object.freeze({
  x: 0,
  y: 0,
  z: 0,
});

/** Alias matching the STAGE-2D:1 mission vocabulary. */
export const CANONICAL_STAGE_CENTER = EXECUTIVE_STAGE_2D_CENTER;

/**
 * Deterministic front-facing distance along +Z.
 * Existing Stage framing used ~10–12; keep that scale so PerspectiveCamera
 * remains readable without introducing OrthographicCamera in STAGE-2D:1.
 */
export const EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE = 11 as const;

export const EXECUTIVE_STAGE_FIXED_CAMERA_FOV =
  EXECUTIVE_CAMERA_PROJECTION.defaultFov;

/**
 * Fixed Executive Stage camera — front-facing view of the X/Y presentation plane.
 *
 * World convention (already established by SP:4.3B):
 *   presentation {x,y} → world {x,y} with z = 0
 * Therefore the camera sits on +Z and looks at the origin (no azimuth / elevation).
 */
export const EXECUTIVE_STAGE_FIXED_CAMERA = Object.freeze({
  mode: "fixed-2d" as const,
  target: EXECUTIVE_STAGE_2D_CENTER,
  position: Object.freeze({
    x: 0,
    y: 0,
    z: EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  }) satisfies ExecutiveCameraVector,
  distance: EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  azimuth: 0 as const,
  elevation: 0 as const,
  fov: EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
  near: EXECUTIVE_CAMERA_PROJECTION.near,
  far: EXECUTIVE_CAMERA_PROJECTION.far,
  orbitEnabled: false as const,
  panEnabled: false as const,
  zoomEnabled: false as const,
  autoRotateEnabled: false as const,
});

// ─── Resolution ─────────────────────────────────────────────────────────────

export type ExecutiveStageFixedCameraPresentation = ExecutiveCameraPresentation;

export function resolveExecutiveStageFixedCamera(): ExecutiveStageFixedCameraPresentation {
  return Object.freeze({
    position: stabilizeExecutiveCameraVector(EXECUTIVE_STAGE_FIXED_CAMERA.position),
    target: stabilizeExecutiveCameraVector(EXECUTIVE_STAGE_FIXED_CAMERA.target),
    fov: stabilizeExecutiveCameraScalar(EXECUTIVE_STAGE_FIXED_CAMERA.fov),
    near: stabilizeExecutiveCameraScalar(EXECUTIVE_STAGE_FIXED_CAMERA.near),
    far: stabilizeExecutiveCameraScalar(EXECUTIVE_STAGE_FIXED_CAMERA.far),
  });
}

export function resolveExecutiveStageFixedCameraTuple(): ExecutiveCameraTuplePresentation {
  return toExecutiveCameraTuplePresentation(resolveExecutiveStageFixedCamera());
}

/**
 * STAGE-2D depth invariant — any Stage position normalized under this
 * foundation must use z = 0. Preserves x/y; never invents layout.
 */
export function normalizeExecutiveStage2DPosition(position: {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
}): Readonly<{ readonly x: number; readonly y: number; readonly z: 0 }> {
  return Object.freeze({
    x: stabilizeExecutiveCameraScalar(position.x),
    y: stabilizeExecutiveCameraScalar(position.y),
    z: CANONICAL_STAGE_DEPTH,
  });
}

export function isExecutiveStageFixedCameraTarget(
  target: ExecutiveCameraVector | readonly [number, number, number],
): boolean {
  const x = Array.isArray(target) ? target[0] : target.x;
  const y = Array.isArray(target) ? target[1] : target.y;
  const z = Array.isArray(target) ? target[2] : target.z;
  return x === 0 && y === 0 && z === 0;
}

export function isExecutiveStageFixedCameraPosition(
  position: ExecutiveCameraVector | readonly [number, number, number],
): boolean {
  const fixed = EXECUTIVE_STAGE_FIXED_CAMERA.position;
  const x = Array.isArray(position) ? position[0] : position.x;
  const y = Array.isArray(position) ? position[1] : position.y;
  const z = Array.isArray(position) ? position[2] : position.z;
  return x === fixed.x && y === fixed.y && z === fixed.z;
}

/**
 * Observability tokens for Stage host diagnostics (dev/test only attributes).
 */
export const EXECUTIVE_STAGE_2D_CAMERA_OBSERVABILITY = Object.freeze({
  cameraMode: "fixed-2d" as const,
  cameraTarget: "0,0,0" as const,
  stageDepth: "0" as const,
  contract: "stage-2d-1" as const,
});

export function verifyExecutiveStage2DFixedCamera(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly targetIsOrigin: boolean;
  readonly depthIsZero: boolean;
  readonly orbitDisabled: boolean;
  readonly panDisabled: boolean;
  readonly zoomDisabled: boolean;
  readonly focusCannotRetarget: boolean;
}> {
  const identity = getExecutiveStage2DFixedCameraIdentity();
  const camera = resolveExecutiveStageFixedCamera();
  const identityValid =
    identity.id === "STAGE-2D:1/ExecutiveStage2DFixedCamera" &&
    identity.version === "2.1.0";
  const targetIsOrigin =
    camera.target.x === 0 && camera.target.y === 0 && camera.target.z === 0;
  const depthIsZero = EXECUTIVE_STAGE_2D_DEPTH === 0;
  const orbitDisabled =
    EXECUTIVE_STAGE_FIXED_CAMERA.orbitEnabled === false &&
    EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.allowsOrbit === false;
  const panDisabled =
    EXECUTIVE_STAGE_FIXED_CAMERA.panEnabled === false &&
    EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.allowsPan === false;
  const zoomDisabled =
    EXECUTIVE_STAGE_FIXED_CAMERA.zoomEnabled === false &&
    EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.allowsZoom === false;
  const focusCannotRetarget =
    EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.retargetsOnObjectFocus === false &&
    EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.movesCameraOnFocus === false;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    targetIsOrigin &&
    depthIsZero &&
    orbitDisabled &&
    panDisabled &&
    zoomDisabled &&
    focusCannotRetarget;

  return Object.freeze({
    ok,
    identityValid,
    targetIsOrigin,
    depthIsZero,
    orbitDisabled,
    panDisabled,
    zoomDisabled,
    focusCannotRetarget,
  });
}
