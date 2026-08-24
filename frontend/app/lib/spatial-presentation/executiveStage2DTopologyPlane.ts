/**
 * STAGE-2D:2 — True 2D Topology Plane Foundation.
 *
 * STAGE-2D:1 fixed the camera. STAGE-2D:2 fixes the space in front of it.
 *
 * Canonical contract:
 *   Stage plane = X / Y
 *   Depth axis  = Z
 *   Every semantic Stage topology position → z = EXECUTIVE_STAGE_2D_DEPTH (0)
 *
 * Topology / focus / attention / Director must not use Z for separation,
 * hierarchy, importance, or collision. Metadata depth roles may remain
 * semantic-only; physical Z stays zero.
 */

import {
  CANONICAL_STAGE_DEPTH,
  EXECUTIVE_STAGE_2D_DEPTH,
  EXECUTIVE_STAGE_FIXED_CAMERA,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  normalizeExecutiveStage2DPosition,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStage2DTopologyPlaneIdentity =
  "STAGE-2D:2/ExecutiveStage2DTopologyPlane" as const;

export const executiveStage2DTopologyPlaneVersion = "2.2.0" as const;

export const executiveStage2DTopologyPlaneNamespace =
  "nexora.spatial-presentation.executive-stage-2d-topology-plane" as const;

export const executiveStage2DTopologyPlanePhase =
  "ExecutiveStage2DTopologyPlaneFoundation" as const;

export const executiveStage2DTopologyPlaneArchitecturalRole =
  "PresentationOnlyTrue2DTopologyPlaneAuthority" as const;

export type ExecutiveStage2DTopologyPlaneIdentity = {
  readonly id: typeof executiveStage2DTopologyPlaneIdentity;
  readonly version: typeof executiveStage2DTopologyPlaneVersion;
  readonly namespace: typeof executiveStage2DTopologyPlaneNamespace;
  readonly phase: typeof executiveStage2DTopologyPlanePhase;
  readonly architecturalRole: typeof executiveStage2DTopologyPlaneArchitecturalRole;
};

const IDENTITY: ExecutiveStage2DTopologyPlaneIdentity = Object.freeze({
  id: executiveStage2DTopologyPlaneIdentity,
  version: executiveStage2DTopologyPlaneVersion,
  namespace: executiveStage2DTopologyPlaneNamespace,
  phase: executiveStage2DTopologyPlanePhase,
  architecturalRole: executiveStage2DTopologyPlaneArchitecturalRole,
});

export function getExecutiveStage2DTopologyPlaneIdentity(): ExecutiveStage2DTopologyPlaneIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_2D_TOPOLOGY_PLANE_BOUNDARY = Object.freeze({
  architecturalRole: executiveStage2DTopologyPlaneArchitecturalRole,
  stagePlane: "xy" as const,
  positionMode: "true-2d" as const,
  semanticDepth: EXECUTIVE_STAGE_2D_DEPTH,
  usesZForSeparation: false as const,
  usesZForHierarchy: false as const,
  usesZForFocus: false as const,
  usesZForAttention: false as const,
  usesZForCollision: false as const,
  usesZForPresentationEmphasis: false as const,
  preservesSharedXyzContract: true as const,
  reusesStage2D1DepthConstant: true as const,
});

/**
 * Semantic 2D Stage point — layout authority before Z normalization.
 */
export type ExecutiveStage2DPoint = {
  readonly x: number;
  readonly y: number;
};

export function createExecutiveStage2DPoint(
  x: number,
  y: number,
): ExecutiveStage2DPoint {
  return Object.freeze({ x, y });
}

/**
 * Re-export STAGE-2D:1 depth + normalizer — single canonical zero-depth constant.
 */
export {
  EXECUTIVE_STAGE_2D_DEPTH,
  CANONICAL_STAGE_DEPTH,
  normalizeExecutiveStage2DPosition,
};

/**
 * Tuple normalizer — final Stage presentation positions.
 */
export function normalizeExecutiveStage2DPositionTuple(
  position: readonly [number, number, number] | {
    readonly x: number;
    readonly y: number;
    readonly z?: number;
  },
): readonly [number, number, 0] {
  if ("x" in position) {
    const normalized = normalizeExecutiveStage2DPosition(position);
    return Object.freeze([normalized.x, normalized.y, 0] as const);
  }
  const normalized = normalizeExecutiveStage2DPosition({
    x: position[0],
    y: position[1],
    z: position[2],
  });
  return Object.freeze([normalized.x, normalized.y, 0] as const);
}

/**
 * Remap legacy Type-C hub XZ ring coordinates onto the Stage XY plane.
 * Shared hub generator may still emit {x: cos·R, y: 0, z: sin·R}.
 */
export function remapLegacyHubXzToExecutiveStage2D(position: {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}): Readonly<{ readonly x: number; readonly y: number; readonly z: 0 }> {
  // Prefer explicit Z ring component for Stage Y; keep residual Y as a tiny
  // additive so accidental XY hubs still behave.
  return normalizeExecutiveStage2DPosition({
    x: position.x,
    y: position.z + position.y,
    z: 0,
  });
}

/**
 * Render-layer vs topology distinction.
 *
 * Topology coordinates are always z = 0.
 * A tiny technical offset may be used later for GPU z-fighting on lines/labels.
 * That offset is NEVER a topology coordinate.
 */
export const EXECUTIVE_STAGE_2D_RENDER_LAYER = Object.freeze({
  /**
   * No Stage-wide topology epsilon today. Connections rely on depthWrite=false.
   * If a future line/label needs a technical offset, document it here — not in
   * semantic targetPosition.
   */
  topologyDepth: EXECUTIVE_STAGE_2D_DEPTH,
  connectionZFightingEpsilon: 0 as const,
  labelLocalOffsetIsNotTopology: true as const,
});

export const EXECUTIVE_STAGE_2D_TOPOLOGY_OBSERVABILITY = Object.freeze({
  stagePlane: "xy" as const,
  stageDepth: "0" as const,
  positionMode: "true-2d" as const,
  contract: "stage-2d-2" as const,
});

export function isExecutiveStage2DSemanticDepth(
  z: number,
): z is typeof EXECUTIVE_STAGE_2D_DEPTH {
  return z === EXECUTIVE_STAGE_2D_DEPTH;
}

export function verifyExecutiveStage2DTopologyPlane(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly depthIsZero: boolean;
  readonly normalizationFlattensZ: boolean;
  readonly cameraRegressionOk: boolean;
  readonly noSemanticZUsage: boolean;
}> {
  const identity = getExecutiveStage2DTopologyPlaneIdentity();
  const identityValid =
    identity.id === "STAGE-2D:2/ExecutiveStage2DTopologyPlane" &&
    identity.version === "2.2.0";
  const depthIsZero = EXECUTIVE_STAGE_2D_DEPTH === 0;
  const poisoned = normalizeExecutiveStage2DPosition({ x: 2, y: 3, z: 8 });
  const normalizationFlattensZ =
    poisoned.x === 2 && poisoned.y === 3 && poisoned.z === 0;
  const camera = resolveExecutiveStageFixedCamera();
  const cameraRegressionOk =
    camera.position.x === 0 &&
    camera.position.y === 0 &&
    camera.position.z === EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE &&
    camera.target.x === 0 &&
    camera.target.y === 0 &&
    camera.target.z === 0 &&
    EXECUTIVE_STAGE_FIXED_CAMERA.orbitEnabled === false;
  const noSemanticZUsage =
    EXECUTIVE_STAGE_2D_TOPOLOGY_PLANE_BOUNDARY.usesZForSeparation === false &&
    EXECUTIVE_STAGE_2D_TOPOLOGY_PLANE_BOUNDARY.usesZForFocus === false &&
    EXECUTIVE_STAGE_2D_TOPOLOGY_PLANE_BOUNDARY.usesZForAttention === false;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    depthIsZero &&
    normalizationFlattensZ &&
    cameraRegressionOk &&
    noSemanticZUsage;

  return Object.freeze({
    ok,
    identityValid,
    depthIsZero,
    normalizationFlattensZ,
    cameraRegressionOk,
    noSemanticZUsage,
  });
}
