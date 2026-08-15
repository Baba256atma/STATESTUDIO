/**
 * STAGE-2D:6V — Visual Center & Object Plane Certification.
 *
 * Distinguishes:
 *   WORLD CENTER  — semantic anchor {0,0,0}
 *   VISIBLE STAGE CENTER — projected usable Stage rect center
 *
 * Fixes visual centering via a presentation-only Stage content offset
 * (camera remains fixed at (0,0,11) → (0,0,0)).
 */

import {
  EXECUTIVE_STAGE_2D_CENTER,
  EXECUTIVE_STAGE_2D_DEPTH,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_USABLE_STAGE_VIEWPORT_DEFAULT,
  resolveExecutiveUsableStageViewport,
  type ExecutiveUsableStageViewport,
} from "./executiveUsableStageViewport.ts";
import { projectExecutiveWorldPointToNdc } from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS,
} from "./executiveStage2DTopologyRecomposition.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStage2DVisualCertificationIdentity =
  "STAGE-2D:6V/ExecutiveStage2DVisualCertification" as const;

export const executiveStage2DVisualCertificationVersion = "2.6.1" as const;

export const executiveStage2DVisualCertificationNamespace =
  "nexora.spatial-presentation.executive-stage-2d-visual-certification" as const;

export const executiveStage2DVisualCertificationPhase =
  "ExecutiveStage2DVisualCenterAndObjectPlaneCertification" as const;

export const executiveStage2DVisualCertificationArchitecturalRole =
  "PresentationOnlyStage2DVisualCertification" as const;

export type ExecutiveStage2DVisualCertificationIdentity = {
  readonly id: typeof executiveStage2DVisualCertificationIdentity;
  readonly version: typeof executiveStage2DVisualCertificationVersion;
  readonly namespace: typeof executiveStage2DVisualCertificationNamespace;
  readonly phase: typeof executiveStage2DVisualCertificationPhase;
  readonly architecturalRole: typeof executiveStage2DVisualCertificationArchitecturalRole;
};

const IDENTITY: ExecutiveStage2DVisualCertificationIdentity = Object.freeze({
  id: executiveStage2DVisualCertificationIdentity,
  version: executiveStage2DVisualCertificationVersion,
  namespace: executiveStage2DVisualCertificationNamespace,
  phase: executiveStage2DVisualCertificationPhase,
  architecturalRole: executiveStage2DVisualCertificationArchitecturalRole,
});

export function getExecutiveStage2DVisualCertificationIdentity(): ExecutiveStage2DVisualCertificationIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveStage2DVisualCertificationArchitecturalRole,
  movesCamera: false as const,
  inventsRelationships: false as const,
  changesSemanticAnchor: false as const,
  usesZForTopologySeparation: false as const,
  /** Tiny technical thickness — STAGE-2D:6V-FIX uses true planar bodies (0). */
  retainedTechnicalThickness: 0 as const,
  objectPlane: "planar" as const,
});

export const EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_OBSERVABILITY =
  Object.freeze({
    contract: "stage-2d-6v" as const,
    objectPlane: "planar" as const,
  });

/**
 * Screen-center tolerance in NDC units (~8% of half-frame).
 * |anchorNdc − usableCenterNdc| ≤ tolerance per axis after hypot check.
 */
export const EXECUTIVE_STAGE_2D_SCREEN_CENTER_TOLERANCE_NDC = 0.1;

/** Deterministic projection aspect for Stage-2D visual certification. */
export const EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_ASPECT = 16 / 9;

// ─── Usable Stage rect (STAGE-2D:6V) ────────────────────────────────────────

/**
 * Usable topology viewport for fixed front camera + Stage chrome.
 * Tuned vs SP:4.3A defaults for Dial (BR), object list (L), Presentation (TR),
 * breadcrumb (T). Origin: Stage canvas fractions bottom-left.
 */
export const EXECUTIVE_STAGE_2D_USABLE_RECT = Object.freeze({
  left: 0.14,
  right: 0.74,
  top: 0.9,
  bottom: 0.22,
  get centerX() {
    return (this.left + this.right) / 2;
  },
  get centerY() {
    return (this.bottom + this.top) / 2;
  },
});

export type ExecutiveStage2DUsableRect = {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  readonly centerX: number;
  readonly centerY: number;
};

export function resolveExecutiveStage2DUsableRect(): ExecutiveStage2DUsableRect {
  const left = EXECUTIVE_STAGE_2D_USABLE_RECT.left;
  const right = EXECUTIVE_STAGE_2D_USABLE_RECT.right;
  const top = EXECUTIVE_STAGE_2D_USABLE_RECT.top;
  const bottom = EXECUTIVE_STAGE_2D_USABLE_RECT.bottom;
  return Object.freeze({
    left,
    right,
    top,
    bottom,
    centerX: stabilize((left + right) / 2),
    centerY: stabilize((bottom + top) / 2),
  });
}

export function resolveExecutiveStage2DUsableViewportFromRect(
  rect: ExecutiveStage2DUsableRect = resolveExecutiveStage2DUsableRect(),
): ExecutiveUsableStageViewport {
  return resolveExecutiveUsableStageViewport({
    minX: rect.left,
    maxX: rect.right,
    minY: rect.bottom,
    maxY: rect.top,
    centerX: rect.centerX,
    centerY: rect.centerY,
  });
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

// ─── Visual presentation offset ─────────────────────────────────────────────

export type ExecutiveStage2DVisualPresentationOffset = {
  readonly x: number;
  readonly y: number;
  readonly z: 0;
};

/**
 * Presentation-only content offset so semantic {0,0,0} projects near usable
 * Stage center under the fixed STAGE-2D:1 camera.
 *
 * Root cause addressed: canvas geometric center ≠ usable topology center
 * (Dial / list / chrome asymmetry). Camera is not moved.
 */
export function resolveExecutiveStage2DVisualPresentationOffset(options?: {
  readonly viewport?: ExecutiveUsableStageViewport;
  readonly aspect?: number;
}): ExecutiveStage2DVisualPresentationOffset {
  const viewport =
    options?.viewport ?? resolveExecutiveStage2DUsableViewportFromRect();
  const camera = resolveExecutiveStageFixedCamera();
  const aspect =
    options?.aspect ?? EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_ASPECT;
  const distance = EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE;
  const fovRad = (camera.fov * Math.PI) / 180;
  const halfHeight = Math.tan(fovRad / 2) * distance;
  const halfWidth = halfHeight * aspect;
  // Front camera along +Z: right=+X, up=+Y
  return Object.freeze({
    x: stabilize(viewport.centerNdcX * halfWidth),
    y: stabilize(viewport.centerNdcY * halfHeight),
    z: 0 as const,
  });
}

export function resolveExecutiveStage2DRenderedWorldPosition(
  semantic: { readonly x: number; readonly y: number; readonly z?: number },
  offset: ExecutiveStage2DVisualPresentationOffset = resolveExecutiveStage2DVisualPresentationOffset(),
): Readonly<{ readonly x: number; readonly y: number; readonly z: 0 }> {
  return Object.freeze({
    x: stabilize(semantic.x + offset.x),
    y: stabilize(semantic.y + offset.y),
    z: EXECUTIVE_STAGE_2D_DEPTH,
  });
}

// ─── Screen-center certification ────────────────────────────────────────────

export type ExecutiveStage2DScreenCenterCertification = {
  readonly semanticWorld: Readonly<{ x: 0; y: 0; z: 0 }>;
  readonly renderedWorld: Readonly<{ x: number; y: number; z: 0 }>;
  readonly projectedNdcX: number;
  readonly projectedNdcY: number;
  readonly usableCenterNdcX: number;
  readonly usableCenterNdcY: number;
  readonly deltaNdcX: number;
  readonly deltaNdcY: number;
  readonly distanceNdc: number;
  readonly toleranceNdc: number;
  readonly withinTolerance: boolean;
  readonly cameraFixed: boolean;
};

export function certifyExecutiveStage2DAnchorScreenCenter(options?: {
  readonly offset?: ExecutiveStage2DVisualPresentationOffset;
  readonly viewport?: ExecutiveUsableStageViewport;
  readonly aspect?: number;
  readonly toleranceNdc?: number;
}): ExecutiveStage2DScreenCenterCertification {
  const viewport =
    options?.viewport ?? resolveExecutiveStage2DUsableViewportFromRect();
  const offset =
    options?.offset ??
    resolveExecutiveStage2DVisualPresentationOffset({ viewport });
  const aspect =
    options?.aspect ?? EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_ASPECT;
  const tolerance =
    options?.toleranceNdc ?? EXECUTIVE_STAGE_2D_SCREEN_CENTER_TOLERANCE_NDC;
  const camera = resolveExecutiveStageFixedCamera();
  const rendered = resolveExecutiveStage2DRenderedWorldPosition(
    EXECUTIVE_STAGE_2D_CENTER,
    offset,
  );
  const projected = projectExecutiveWorldPointToNdc({
    point: rendered,
    cameraPosition: camera.position,
    cameraTarget: camera.target,
    fovDegrees: camera.fov,
    aspect,
  });
  const projectedNdcX = projected?.x ?? 0;
  const projectedNdcY = projected?.y ?? 0;
  const deltaNdcX = projectedNdcX - viewport.centerNdcX;
  const deltaNdcY = projectedNdcY - viewport.centerNdcY;
  const distanceNdc = Math.hypot(deltaNdcX, deltaNdcY);
  const cameraFixed =
    camera.position.x === 0 &&
    camera.position.y === 0 &&
    camera.position.z === EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE &&
    camera.target.x === 0 &&
    camera.target.y === 0 &&
    camera.target.z === 0;

  return Object.freeze({
    semanticWorld: Object.freeze({ x: 0, y: 0, z: 0 as const }),
    renderedWorld: rendered,
    projectedNdcX: stabilize(projectedNdcX),
    projectedNdcY: stabilize(projectedNdcY),
    usableCenterNdcX: viewport.centerNdcX,
    usableCenterNdcY: viewport.centerNdcY,
    deltaNdcX: stabilize(deltaNdcX),
    deltaNdcY: stabilize(deltaNdcY),
    distanceNdc: stabilize(distanceNdc),
    toleranceNdc: tolerance,
    withinTolerance: distanceNdc <= tolerance,
    cameraFixed,
  });
}

// ─── Visual centroid / balance ──────────────────────────────────────────────

export type ExecutiveStage2DVisualCentroid = {
  readonly centroidX: number;
  readonly centroidY: number;
  readonly boundsMinX: number;
  readonly boundsMaxX: number;
  readonly boundsMinY: number;
  readonly boundsMaxY: number;
  readonly quadrantCompression: boolean;
};

/**
 * Diagnostic centroid of primary visible topology (semantic XY).
 * Does not move the camera.
 */
export function resolveExecutiveStage2DVisualCentroid(
  positions: readonly {
    readonly x: number;
    readonly y: number;
  }[],
): ExecutiveStage2DVisualCentroid {
  if (positions.length === 0) {
    return Object.freeze({
      centroidX: 0,
      centroidY: 0,
      boundsMinX: 0,
      boundsMaxX: 0,
      boundsMinY: 0,
      boundsMaxY: 0,
      quadrantCompression: false,
    });
  }
  let sumX = 0;
  let sumY = 0;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const position of positions) {
    sumX += position.x;
    sumY += position.y;
    minX = Math.min(minX, position.x);
    maxX = Math.max(maxX, position.x);
    minY = Math.min(minY, position.y);
    maxY = Math.max(maxY, position.y);
  }
  const centroidX = sumX / positions.length;
  const centroidY = sumY / positions.length;
  const width = maxX - minX;
  const height = maxY - minY;
  const stageW =
    EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxX -
    EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minX;
  const stageH =
    EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxY -
    EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minY;
  // Compressed into one quadrant if extent is tiny and centroid far off-origin.
  const quadrantCompression =
    (width < stageW * 0.22 && height < stageH * 0.22) ||
    (Math.hypot(centroidX, centroidY) > 1.4 &&
      width < stageW * 0.35 &&
      height < stageH * 0.35);

  return Object.freeze({
    centroidX: stabilize(centroidX),
    centroidY: stabilize(centroidY),
    boundsMinX: stabilize(minX),
    boundsMaxX: stabilize(maxX),
    boundsMinY: stabilize(minY),
    boundsMaxY: stabilize(maxY),
    quadrantCompression,
  });
}

// ─── Dial exclusion (world XY) ──────────────────────────────────────────────

/**
 * Bottom-right Workspace Dial exclusion in Stage XY (semantic plane).
 * Topology placement should prefer outside this region.
 */
export const EXECUTIVE_STAGE_2D_DIAL_EXCLUSION = Object.freeze({
  minX: 1.35,
  maxX: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxX,
  minY: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minY,
  maxY: -0.85,
});

export function isInsideExecutiveStage2DDialExclusion(
  x: number,
  y: number,
): boolean {
  const zone = EXECUTIVE_STAGE_2D_DIAL_EXCLUSION;
  return x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY;
}

export function pushOutOfExecutiveStage2DDialExclusion(
  x: number,
  y: number,
): Readonly<{ readonly x: number; readonly y: number }> {
  if (!isInsideExecutiveStage2DDialExclusion(x, y)) {
    return Object.freeze({ x: stabilize(x), y: stabilize(y) });
  }
  // Push toward Stage center-left of the dial zone.
  return Object.freeze({
    x: stabilize(Math.min(x, EXECUTIVE_STAGE_2D_DIAL_EXCLUSION.minX - 0.2)),
    y: stabilize(Math.max(y, EXECUTIVE_STAGE_2D_DIAL_EXCLUSION.maxY + 0.2)),
  });
}

// ─── Planar object contract ─────────────────────────────────────────────────

export const EXECUTIVE_STAGE_2D_OBJECT_PLANE = Object.freeze({
  /** Perceptible topology depth must be zero; technical thickness only. */
  technicalThickness: EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_BOUNDARY.retainedTechnicalThickness,
  facesCamera: true as const,
  shadowsEnabled: false as const,
  classification: Object.freeze({
    boxGeometryDepth: "PLANARIZE" as const,
    cylinderSphereVolume: "PLANARIZE" as const,
    focusPedestalFloorDisc: "PLANARIZE" as const,
    edgeWireframe: "SIMPLIFY" as const,
    meshStandardLighting: "SIMPLIFY" as const,
    semanticShapeLanguage: "KEEP" as const,
  }),
});

export function planarizeExecutiveStage2DObjectDepth(depth: number): number {
  void depth;
  return EXECUTIVE_STAGE_2D_OBJECT_PLANE.technicalThickness;
}

// ─── Observability ──────────────────────────────────────────────────────────

export function getExecutiveStage2DVisualCertificationObservability(input?: {
  readonly screenCentered?: boolean;
  readonly overlapCount?: number;
  readonly controlCollisionCount?: number;
}): Readonly<{
  readonly visualCertification: string;
  readonly anchorWorldCenter: string;
  readonly anchorScreenCentered: string;
  readonly objectPlane: string;
  readonly visualOverlapCount: string;
  readonly controlCollisionCount: string;
  readonly contract: string;
}> {
  const screen =
    input?.screenCentered ??
    certifyExecutiveStage2DAnchorScreenCenter().withinTolerance;
  return Object.freeze({
    visualCertification:
      EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_OBSERVABILITY.contract,
    anchorWorldCenter: "0,0,0",
    anchorScreenCentered: String(screen),
    objectPlane:
      EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_OBSERVABILITY.objectPlane,
    visualOverlapCount: String(input?.overlapCount ?? 0),
    controlCollisionCount: String(input?.controlCollisionCount ?? 0),
    contract: EXECUTIVE_STAGE_2D_VISUAL_CERTIFICATION_OBSERVABILITY.contract,
  });
}

export function verifyExecutiveStage2DVisualCertification(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly screenCentered: boolean;
  readonly cameraFixed: boolean;
  readonly usableDiffersFromCanvas: boolean;
}> {
  const identity = getExecutiveStage2DVisualCertificationIdentity();
  const identityValid =
    identity.id === "STAGE-2D:6V/ExecutiveStage2DVisualCertification" &&
    identity.version === "2.6.1";
  const cert = certifyExecutiveStage2DAnchorScreenCenter();
  const usable = resolveExecutiveStage2DUsableRect();
  const usableDiffersFromCanvas =
    Math.abs(usable.centerX - 0.5) > 0.01 ||
    Math.abs(usable.centerY - 0.5) > 0.01;

  return Object.freeze({
    ok:
      options?.forceFailure !== true &&
      identityValid &&
      cert.withinTolerance &&
      cert.cameraFixed &&
      usableDiffersFromCanvas,
    identityValid,
    screenCentered: cert.withinTolerance,
    cameraFixed: cert.cameraFixed,
    usableDiffersFromCanvas,
  });
}

/** Re-export default usable viewport constant for diagnostics. */
export { EXECUTIVE_USABLE_STAGE_VIEWPORT_DEFAULT };
