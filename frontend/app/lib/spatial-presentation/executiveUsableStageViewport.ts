/**
 * SP:4.3A — Usable Stage viewport for 2.5D visual authority.
 *
 * The geometric canvas center is not the executive visual center.
 * Persistent Stage overlays (object list, Dial, Timeline, Presentation Depth,
 * Advisor) shrink the usable composition region.
 *
 * Presentation {0,0} must map to the world point that projects near
 * usableCenter — not merely the raw look-at / canvas midpoint.
 */

import {
  DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT,
  EXECUTIVE_FOCUS_ANCHOR_TARGET,
  resolveExecutiveCameraPresentation,
  type ExecutiveCameraVector,
} from "./executiveCameraFoundation.ts";
import { projectExecutiveWorldPointToNdc } from "./executiveFramingVisualCalibration.ts";
import { EXECUTIVE_RENDER_PLANE_Z } from "./executiveTrue2DStageAuthority.ts";

export const executiveUsableStageViewportIdentity =
  "SP:4.3A/ExecutiveUsableStageViewport" as const;

export const executiveUsableStageViewportVersion = "4.3.1" as const;

/** Normalized Stage fractions (0–1), origin bottom-left of the Stage canvas. */
export type ExecutiveUsableStageViewport = {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly centerX: number;
  readonly centerY: number;
  /** Usable center in NDC (−1…1), Y-up. */
  readonly centerNdcX: number;
  readonly centerNdcY: number;
};

export type ExecutiveUsableStageWorldAnchor = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1e6) / 1e6;
}

/**
 * Deterministic usable Stage region.
 * Biased away from left object-list, right Advisor, bottom Dial/Timeline,
 * and top Presentation Depth chrome.
 */
export const EXECUTIVE_USABLE_STAGE_VIEWPORT_DEFAULT: ExecutiveUsableStageViewport =
  (() => {
    const minX = 0.16;
    const maxX = 0.78;
    const minY = 0.16;
    const maxY = 0.88;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    return Object.freeze({
      minX,
      maxX,
      minY,
      maxY,
      centerX: stabilize(centerX),
      centerY: stabilize(centerY),
      // Stage fraction → NDC (Y-up).
      centerNdcX: stabilize((centerX - 0.5) * 2),
      centerNdcY: stabilize((centerY - 0.5) * 2),
    });
  })();

export function resolveExecutiveUsableStageViewport(
  overrides?: Partial<ExecutiveUsableStageViewport>,
): ExecutiveUsableStageViewport {
  const minX = overrides?.minX ?? EXECUTIVE_USABLE_STAGE_VIEWPORT_DEFAULT.minX;
  const maxX = overrides?.maxX ?? EXECUTIVE_USABLE_STAGE_VIEWPORT_DEFAULT.maxX;
  const minY = overrides?.minY ?? EXECUTIVE_USABLE_STAGE_VIEWPORT_DEFAULT.minY;
  const maxY = overrides?.maxY ?? EXECUTIVE_USABLE_STAGE_VIEWPORT_DEFAULT.maxY;
  const centerX = overrides?.centerX ?? stabilize((minX + maxX) / 2);
  const centerY = overrides?.centerY ?? stabilize((minY + maxY) / 2);
  return Object.freeze({
    minX: stabilize(minX),
    maxX: stabilize(maxX),
    minY: stabilize(minY),
    maxY: stabilize(maxY),
    centerX: stabilize(centerX),
    centerY: stabilize(centerY),
    centerNdcX: stabilize(
      overrides?.centerNdcX ?? (centerX - 0.5) * 2,
    ),
    centerNdcY: stabilize(
      overrides?.centerNdcY ?? (centerY - 0.5) * 2,
    ),
  });
}

/**
 * World-space look-at used by the focus camera (canvas geometric aim).
 * Presentation {0,0} is intentionally NOT this point when usable center
 * differs from canvas center — see resolveExecutiveUsableStageWorldAnchor.
 */
export function resolveExecutiveFocusLookAtTarget(): ExecutiveCameraVector {
  return EXECUTIVE_FOCUS_ANCHOR_TARGET;
}

/**
 * World position for presentation {0,0}.
 * Offset from the camera look-at along camera-right / camera-up so the
 * projected NDC of this point approximates the usable Stage center.
 */
export function resolveExecutiveUsableStageWorldAnchor(options?: {
  readonly viewport?: ExecutiveUsableStageViewport;
  readonly lookAt?: ExecutiveCameraVector;
  readonly cameraDistance?: number;
  readonly cameraFov?: number;
  readonly cameraAzimuth?: number;
  readonly cameraElevation?: number;
}): ExecutiveUsableStageWorldAnchor {
  const viewport =
    options?.viewport ?? resolveExecutiveUsableStageViewport();
  const lookAt = options?.lookAt ?? resolveExecutiveFocusLookAtTarget();
  const intent = Object.freeze({
    ...DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT,
    target: lookAt,
    distance:
      options?.cameraDistance ?? DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT.distance,
    fov: options?.cameraFov ?? DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT.fov,
    azimuth:
      options?.cameraAzimuth ?? DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT.azimuth,
    elevation:
      options?.cameraElevation ??
      DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT.elevation,
  });
  const camera = resolveExecutiveCameraPresentation(intent);
  const distance = Math.max(
    0.5,
    Math.hypot(
      camera.position.x - lookAt.x,
      camera.position.y - lookAt.y,
      camera.position.z - lookAt.z,
    ),
  );
  const fovRad = ((camera.fov ?? intent.fov ?? 42) * Math.PI) / 180;
  const halfHeight = Math.tan(fovRad / 2) * distance;
  const aspect = 16 / 9;
  const halfWidth = halfHeight * aspect;

  // Camera basis: forward (look), right, up — Y-up Stage.
  const forwardX = lookAt.x - camera.position.x;
  const forwardY = lookAt.y - camera.position.y;
  const forwardZ = lookAt.z - camera.position.z;
  const forwardLen = Math.hypot(forwardX, forwardY, forwardZ) || 1;
  const fx = forwardX / forwardLen;
  const fy = forwardY / forwardLen;
  const fz = forwardZ / forwardLen;
  // right = normalize(forward × worldUp) — matches projectExecutiveWorldPointToNdc
  let rightX = -fz;
  let rightY = 0;
  let rightZ = fx;
  const rLen = Math.hypot(rightX, rightY, rightZ) || 1;
  rightX /= rLen;
  rightY /= rLen;
  rightZ /= rLen;
  // up = right × forward
  const upX = rightY * fz - rightZ * fy;
  const upY = rightZ * fx - rightX * fz;
  void (rightX * fy - rightY * fx); // upZ unused — render plane flattens Z

  // Shift from canvas-center look-at toward usable NDC, then flatten onto the
  // true-2D render plane so every Stage anchor shares constant Z.
  const offsetX = viewport.centerNdcX * halfWidth;
  const offsetY = viewport.centerNdcY * halfHeight;

  return Object.freeze({
    x: stabilize(lookAt.x + rightX * offsetX + upX * offsetY),
    y: stabilize(lookAt.y + rightY * offsetX + upY * offsetY),
    z: EXECUTIVE_RENDER_PLANE_Z,
  });
}

/**
 * Project presentation {0,0}'s world anchor and compare to usable center NDC.
 */
export function projectExecutiveUsableStageAnchorToNdc(options?: {
  readonly viewport?: ExecutiveUsableStageViewport;
}): Readonly<{
  readonly projectedNdcX: number;
  readonly projectedNdcY: number;
  readonly usableCenterNdcX: number;
  readonly usableCenterNdcY: number;
  readonly withinTolerance: boolean;
  readonly tolerance: number;
}> {
  const viewport =
    options?.viewport ?? resolveExecutiveUsableStageViewport();
  const lookAt = resolveExecutiveFocusLookAtTarget();
  const anchor = resolveExecutiveUsableStageWorldAnchor({ viewport, lookAt });
  const camera = resolveExecutiveCameraPresentation(
    Object.freeze({
      ...DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT,
      target: lookAt,
    }),
  );
  const projected = projectExecutiveWorldPointToNdc({
    point: anchor,
    cameraPosition: camera.position,
    cameraTarget: lookAt,
    fovDegrees: camera.fov ?? DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT.fov!,
    aspect: 16 / 9,
  });
  const tolerance = 0.08;
  const projectedNdcX = projected?.x ?? 0;
  const projectedNdcY = projected?.y ?? 0;
  const withinTolerance =
    Math.hypot(
      projectedNdcX - viewport.centerNdcX,
      projectedNdcY - viewport.centerNdcY,
    ) <= tolerance;
  return Object.freeze({
    projectedNdcX: stabilize(projectedNdcX),
    projectedNdcY: stabilize(projectedNdcY),
    usableCenterNdcX: viewport.centerNdcX,
    usableCenterNdcY: viewport.centerNdcY,
    withinTolerance,
    tolerance,
  });
}
