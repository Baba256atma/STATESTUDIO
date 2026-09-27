/**
 * NPA-T STAGE-CAMERA:FIX1 — Safe Stage Viewport camera fit.
 *
 * Presentation-only. Derives a distance pullback so the certified STAGE-SPATIAL:2
 * pose (azimuth 8°, elevation 10°, FOV 42, target origin) still frames the
 * current scene inside the unoccluded Stage canvas. Does not own UI, Objects,
 * Director, or a second camera.
 */

import {
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  EXECUTIVE_CAMERA_PROJECTION,
  mapExecutiveCameraSphericalToPosition,
  stabilizeExecutiveCameraScalar,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_STAGE_2D_CENTER,
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
} from "./executiveStage2DFixedCamera.ts";

export const executiveStageSafeViewportCameraFitIdentity =
  "NPA-T STAGE-CAMERA:FIX1/SafeViewportCameraFit" as const;

export const EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT_BOUNDARY = Object.freeze({
  architecturalRole: "PresentationOnlySafeStageViewportCameraFit" as const,
  ownsObjects: false as const,
  ownsDirector: false as const,
  ownsAdvisor: false as const,
  ownsNmi: false as const,
  ownsLayout: false as const,
  createsCameraController: false as const,
  allowsOrbit: false as const,
  allowsPointerParallax: false as const,
  chasesHover: false as const,
  movesCanonicalXy: false as const,
});

/** Existing overlay surfaces that can cover the Stage canvas. */
export const EXECUTIVE_STAGE_SAFE_VIEWPORT_OCCLUSION_TESTIDS = Object.freeze([
  "nexora-stage-interaction-breadcrumb",
  "nexora-presentation-state-selector",
  "nexora-stage-object-list",
  "nexora-subject-report",
  "nexora-subject-operation",
  "nexora-evidence-visual-view",
  "nexora-theatre-investigation",
  "nexora-workspace-dial-mount",
  "nexora-stage-data-control",
] as const);

export const EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT = Object.freeze({
  baseDistance: EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  /** Reuse SP:1.1 maximum — no extreme zoom-out. */
  maxDistance: EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance,
  /** Comfort pad inside the measured safe NDC rectangle (DEFAULT top 0.1 family). */
  ndcComfortPad: 0.08,
  /** Footprint half-extent when Object territory is unavailable. */
  defaultObjectHalfExtent: 0.55,
  /** Label allowance without a second layout engine. */
  labelWorldPad: 0.28,
  minReadabilityScale: 11 / 14,
});

export type ExecutiveStageSafeViewportInsets = Readonly<{
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}>;

export type ExecutiveStageSafeSceneBounds = Readonly<{
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}>;

export type ExecutiveStageSafeViewportFitResult = Readonly<{
  baseDistance: number;
  effectiveDistance: number;
  requiredDistance: number;
  conflict: "none" | "SCENE_DENSITY_LAYOUT_CONFLICT";
  reason: "base" | "safe-viewport" | "density-conflict";
  ndc: Readonly<{
    left: number;
    right: number;
    bottom: number;
    top: number;
  }>;
  sceneBounds: ExecutiveStageSafeSceneBounds;
}>;

const DEG = Math.PI / 180;
const AZIMUTH = EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG * DEG;
const ELEVATION = EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG * DEG;

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function hypot3(x: number, y: number, z: number): number {
  return Math.hypot(x, y, z);
}

export function deriveExecutiveStageSafeViewportNdc(
  insets: ExecutiveStageSafeViewportInsets,
): Readonly<{ left: number; right: number; bottom: number; top: number }> {
  const width = Math.max(1, insets.width);
  const height = Math.max(1, insets.height);
  const pad = EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT.ndcComfortPad;
  const left = -1 + 2 * clamp(insets.left / width, 0, 0.45) + pad;
  const right = 1 - 2 * clamp(insets.right / width, 0, 0.45) - pad;
  const bottom = -1 + 2 * clamp(insets.bottom / height, 0, 0.45) + pad;
  const top = 1 - 2 * clamp(insets.top / height, 0, 0.45) - pad;
  return Object.freeze({
    left: stabilizeExecutiveCameraScalar(Math.min(left, right - 0.12)),
    right: stabilizeExecutiveCameraScalar(Math.max(right, left + 0.12)),
    bottom: stabilizeExecutiveCameraScalar(Math.min(bottom, top - 0.12)),
    top: stabilizeExecutiveCameraScalar(Math.max(top, bottom + 0.12)),
  });
}

export function deriveExecutiveStageSafeSceneBounds(
  objects: readonly Readonly<{
    readonly targetPosition: readonly [number, number, number];
    readonly scale?: number;
    readonly opacity?: number;
    readonly role?: string;
    readonly presentationComposition?: Readonly<{
      readonly territory?: Readonly<{
        readonly width: number;
        readonly height: number;
        readonly padding: number;
      }>;
    }>;
  }>[],
): ExecutiveStageSafeSceneBounds {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  let any = false;
  for (const object of objects) {
    if ((object.opacity ?? 1) < 0.25) continue;
    if (object.role === "unrelated" || object.role === "hidden") continue;
    const x = object.targetPosition[0];
    const y = object.targetPosition[1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const territory = object.presentationComposition?.territory;
    const halfX =
      territory != null
        ? territory.width * 0.5 + territory.padding
        : EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT.defaultObjectHalfExtent *
          (object.scale ?? 1);
    const halfY =
      territory != null
        ? territory.height * 0.5 + territory.padding
        : EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT.defaultObjectHalfExtent *
          (object.scale ?? 1);
    const label = EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT.labelWorldPad;
    any = true;
    minX = Math.min(minX, x - halfX);
    maxX = Math.max(maxX, x + halfX);
    minY = Math.min(minY, y - halfY);
    maxY = Math.max(maxY, y + halfY + label);
  }
  if (!any) {
    return Object.freeze({ minX: -0.8, maxX: 0.8, minY: -0.8, maxY: 0.8 });
  }
  return Object.freeze({ minX, maxX, minY, maxY });
}

function projectWorldToNdc(
  x: number,
  y: number,
  z: number,
  distance: number,
  aspect: number,
): readonly [number, number] {
  const eye = mapExecutiveCameraSphericalToPosition({
    target: EXECUTIVE_STAGE_2D_CENTER,
    distance,
    azimuth: AZIMUTH,
    elevation: ELEVATION,
  });
  const fx = EXECUTIVE_STAGE_2D_CENTER.x - eye.x;
  const fy = EXECUTIVE_STAGE_2D_CENTER.y - eye.y;
  const fz = EXECUTIVE_STAGE_2D_CENTER.z - eye.z;
  const flen = Math.max(1e-6, hypot3(fx, fy, fz));
  const f0 = fx / flen;
  const f1 = fy / flen;
  const f2 = fz / flen;
  let rx = f1 * 0 - f2 * 1;
  let ry = f2 * 0 - f0 * 0;
  let rz = f0 * 1 - f1 * 0;
  const rlen = Math.max(1e-6, hypot3(rx, ry, rz));
  rx /= rlen;
  ry /= rlen;
  rz /= rlen;
  const ux = ry * f2 - rz * f1;
  const uy = rz * f0 - rx * f2;
  const uz = rx * f1 - ry * f0;
  const vx = x - eye.x;
  const vy = y - eye.y;
  const vz = z - eye.z;
  const camX = vx * rx + vy * ry + vz * rz;
  const camY = vx * ux + vy * uy + vz * uz;
  const camZ = -(vx * f0 + vy * f1 + vz * f2);
  const fov = EXECUTIVE_STAGE_FIXED_CAMERA_FOV * DEG;
  const sy = 1 / Math.tan(fov * 0.5);
  const sx = sy / Math.max(0.5, aspect);
  const near = EXECUTIVE_CAMERA_PROJECTION.near;
  const far = EXECUTIVE_CAMERA_PROJECTION.far;
  const clipW = -camZ;
  const clipX = camX * sx;
  const clipY = camY * sy;
  const clipZ = ((far + near) * camZ + 2 * far * near) / (near - far);
  const w = clipW === 0 ? 1e-6 : clipW;
  return [clipX / w, clipY / w, clipZ / w] as unknown as readonly [number, number];
}

function sceneFits(
  distance: number,
  bounds: ExecutiveStageSafeSceneBounds,
  ndc: Readonly<{ left: number; right: number; bottom: number; top: number }>,
  aspect: number,
): boolean {
  const zs = [0, 0.35];
  const xs = [bounds.minX, bounds.maxX];
  const ys = [bounds.minY, bounds.maxY];
  for (const x of xs) {
    for (const y of ys) {
      for (const z of zs) {
        const [nx, ny] = projectWorldToNdc(x, y, z, distance, aspect);
        if (nx < ndc.left || nx > ndc.right || ny < ndc.bottom || ny > ndc.top) {
          return false;
        }
      }
    }
  }
  return true;
}

export function measureExecutiveStageSafeViewportInsets(input: {
  readonly canvas: Readonly<{
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  }>;
  readonly overlays: readonly Readonly<{
    left: number;
    top: number;
    right: number;
    bottom: number;
  }>[];
}): ExecutiveStageSafeViewportInsets {
  const canvas = input.canvas;
  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;
  for (const overlay of input.overlays) {
    const ixLeft = Math.max(canvas.left, overlay.left);
    const ixTop = Math.max(canvas.top, overlay.top);
    const ixRight = Math.min(canvas.right, overlay.right);
    const ixBottom = Math.min(canvas.bottom, overlay.bottom);
    const ixW = ixRight - ixLeft;
    const ixH = ixBottom - ixTop;
    if (ixW < 24 || ixH < 16) continue;
    const canvasH = Math.max(1, canvas.bottom - canvas.top);
    const canvasW = Math.max(1, canvas.right - canvas.left);
    const distTop = ixTop - canvas.top;
    const distBottom = canvas.bottom - ixBottom;
    const distLeft = ixLeft - canvas.left;
    const distRight = canvas.right - ixRight;
    const dock = 64;
    const dockLeft = distLeft < dock;
    const dockRight = distRight < dock;
    const dockTop = distTop < dock;
    const dockBottom = distBottom < dock;
    const tallStrip = ixH >= canvasH * 0.5;
    const wideStrip = ixW >= canvasW * 0.35;
    if (dockLeft && tallStrip) {
      left = Math.max(left, ixRight - canvas.left);
    } else if (dockRight && tallStrip) {
      right = Math.max(right, canvas.right - ixLeft);
    } else if (dockTop && wideStrip) {
      top = Math.max(top, ixBottom - canvas.top);
    } else if (dockBottom && wideStrip) {
      bottom = Math.max(bottom, canvas.bottom - ixTop);
    } else {
      const topCost = (ixBottom - canvas.top) * canvasW;
      const bottomCost = (canvas.bottom - ixTop) * canvasW;
      const leftCost = (ixRight - canvas.left) * canvasH;
      const rightCost = (canvas.right - ixLeft) * canvasH;
      const candidates: Array<[string, number, number]> = [];
      if (dockTop) candidates.push(["top", topCost, ixBottom - canvas.top]);
      if (dockBottom) candidates.push(["bottom", bottomCost, canvas.bottom - ixTop]);
      if (dockLeft) candidates.push(["left", leftCost, ixRight - canvas.left]);
      if (dockRight) candidates.push(["right", rightCost, canvas.right - ixLeft]);
      if (candidates.length === 0) {
        const nearest = Math.min(distTop, distBottom, distLeft, distRight);
        if (nearest === distLeft) left = Math.max(left, ixRight - canvas.left);
        else if (nearest === distRight) {
          right = Math.max(right, canvas.right - ixLeft);
        } else if (nearest === distTop) {
          top = Math.max(top, ixBottom - canvas.top);
        } else bottom = Math.max(bottom, canvas.bottom - ixTop);
      } else {
        candidates.sort((a, b) => a[2] - b[2]);
        const [edge, , depth] = candidates[0];
        if (edge === "top") top = Math.max(top, depth);
        else if (edge === "bottom") bottom = Math.max(bottom, depth);
        else if (edge === "left") left = Math.max(left, depth);
        else right = Math.max(right, depth);
      }
    }
  }
  return Object.freeze({
    left: stabilizeExecutiveCameraScalar(left),
    right: stabilizeExecutiveCameraScalar(right),
    top: stabilizeExecutiveCameraScalar(top),
    bottom: stabilizeExecutiveCameraScalar(bottom),
    width: Math.max(1, canvas.width),
    height: Math.max(1, canvas.height),
  });
}

export function resolveExecutiveStageSafeViewportCameraFit(input: {
  readonly insets: ExecutiveStageSafeViewportInsets;
  readonly sceneBounds: ExecutiveStageSafeSceneBounds;
}): ExecutiveStageSafeViewportFitResult {
  const base = EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT.baseDistance;
  const max = EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT.maxDistance;
  const ndc = deriveExecutiveStageSafeViewportNdc(input.insets);
  const aspect = input.insets.width / input.insets.height;
  if (sceneFits(base, input.sceneBounds, ndc, aspect)) {
    return Object.freeze({
      baseDistance: base,
      effectiveDistance: base,
      requiredDistance: base,
      conflict: "none",
      reason: "base",
      ndc,
      sceneBounds: input.sceneBounds,
    });
  }
  let lo: number = base;
  let hi: number = max;
  for (let i = 0; i < 18; i += 1) {
    const mid = (lo + hi) * 0.5;
    if (sceneFits(mid, input.sceneBounds, ndc, aspect)) hi = mid;
    else lo = mid;
  }
  const required = stabilizeExecutiveCameraScalar(hi);
  const conflict =
    !sceneFits(max, input.sceneBounds, ndc, aspect)
      ? ("SCENE_DENSITY_LAYOUT_CONFLICT" as const)
      : ("none" as const);
  const effective = conflict === "SCENE_DENSITY_LAYOUT_CONFLICT" ? max : required;
  return Object.freeze({
    baseDistance: base,
    effectiveDistance: stabilizeExecutiveCameraScalar(effective),
    requiredDistance: required,
    conflict,
    reason: conflict === "SCENE_DENSITY_LAYOUT_CONFLICT" ? "density-conflict" : "safe-viewport",
    ndc,
    sceneBounds: input.sceneBounds,
  });
}

export function verifyExecutiveStageSafeViewportCameraFit(): boolean {
  return (
    EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT.baseDistance === 11 &&
    EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT.maxDistance === 14 &&
    EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT_BOUNDARY.createsCameraController === false &&
    EXECUTIVE_CAMERA_PROJECTION.defaultFov === 42
  );
}
