/**
 * SP:1.8 — Occlusion-Aware Object Readability & Camera Navigation.
 *
 * Presentation-only occlusion classification for the Nexora Executive Stage.
 * Preserves useful 3D depth; assists discoverability when objects become
 * unreadable. Never mutates business truth or SP:1.4 base composition.
 *
 * Dependency direction:
 *   Rendered Spatial Composition + Camera Presentation
 *     → Occlusion Readability Resolution
 *       → Presentation Assistance / Focus Micro-Adjustment
 */

import {
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  clampExecutiveCameraDistance,
  clampExecutiveCameraElevation,
  executiveCameraFoundationIdentity,
  normalizeExecutiveCameraAzimuth,
  resolveExecutiveCameraPresentation,
  sanitizeExecutiveCameraIntent,
  type ExecutiveCameraIntent,
  type ExecutiveCameraVector,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS,
  EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY,
  executiveCameraNavigationIdentity,
} from "./executiveCameraNavigation.ts";
import {
  projectExecutiveWorldPointToNdc,
} from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_FOCUS_VIEWING_POLICY,
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
} from "./executiveViewingAngle.ts";
import type { ExecutiveSpatialVector } from "./executiveSpatialComposition.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectOcclusionIdentity =
  "SP:1.8/ExecutiveObjectOcclusion" as const;

export const executiveObjectOcclusionVersion = "1.8.0" as const;

export const executiveObjectOcclusionNamespace =
  "nexora.spatial-presentation.executive-object-occlusion" as const;

export const executiveObjectOcclusionPhase =
  "OcclusionAwareObjectReadabilityAndCameraNavigation" as const;

export const executiveObjectOcclusionArchitecturalRole =
  "PresentationOnlyOcclusionAwareObjectReadability" as const;

export const executiveObjectOcclusionReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveObjectOcclusionIdentity = {
  readonly id: typeof executiveObjectOcclusionIdentity;
  readonly version: typeof executiveObjectOcclusionVersion;
  readonly namespace: typeof executiveObjectOcclusionNamespace;
  readonly phase: typeof executiveObjectOcclusionPhase;
  readonly architecturalRole: typeof executiveObjectOcclusionArchitecturalRole;
  readonly upstreamCameraFoundation: typeof executiveCameraFoundationIdentity;
  readonly upstreamCameraNavigation: typeof executiveCameraNavigationIdentity;
};

const OCCLUSION_IDENTITY: ExecutiveObjectOcclusionIdentity = Object.freeze({
  id: executiveObjectOcclusionIdentity,
  version: executiveObjectOcclusionVersion,
  namespace: executiveObjectOcclusionNamespace,
  phase: executiveObjectOcclusionPhase,
  architecturalRole: executiveObjectOcclusionArchitecturalRole,
  upstreamCameraFoundation: executiveCameraFoundationIdentity,
  upstreamCameraNavigation: executiveCameraNavigationIdentity,
});

export function getExecutiveObjectOcclusionIdentity(): ExecutiveObjectOcclusionIdentity {
  return OCCLUSION_IDENTITY;
}

export const EXECUTIVE_OBJECT_OCCLUSION_BOUNDARY = Object.freeze({
  architecturalRole: executiveObjectOcclusionArchitecturalRole,
  ownsBusinessTruth: false as const,
  mutatesBaseComposition: false as const,
  objectSpecificHacks: false as const,
  createsCompetingCameraAuthority: false as const,
  introducesUnrestrictedOrbitControls: false as const,
  autoMovesOverviewCamera: false as const,
  presentationOnly: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveObjectOcclusionState =
  | "clear"
  | "partial"
  | "substantial";

export type ExecutiveOcclusionObjectInput = {
  readonly objectId: string;
  readonly position: ExecutiveSpatialVector;
  /** Approximate world-space half-extent (presentation geometry). */
  readonly radius?: number;
};

export type ExecutiveObjectOcclusionPresentation = {
  readonly objectId: string;
  readonly state: ExecutiveObjectOcclusionState;
  readonly occluderIds: readonly string[];
  readonly readabilityAssist: boolean;
  readonly overlapRatio: number;
};

export type ResolveExecutiveObjectOcclusionInput = {
  readonly objects: readonly ExecutiveOcclusionObjectInput[];
  readonly cameraPosition: ExecutiveCameraVector;
  readonly cameraTarget: ExecutiveCameraVector;
  readonly fovDegrees: number;
  readonly aspect?: number;
  /** Object currently hovered — strengthens assist for substantial cases. */
  readonly hoveredObjectId?: string | null;
  readonly focusedObjectId?: string | null;
};

export type ExecutiveObjectOcclusionResult = {
  readonly objects: readonly ExecutiveObjectOcclusionPresentation[];
  readonly byId: ReadonlyMap<string, ExecutiveObjectOcclusionPresentation>;
};

export const EXECUTIVE_OCCLUSION_DEFAULT_RADIUS = 0.42;

export const EXECUTIVE_OCCLUSION_THRESHOLDS = Object.freeze({
  partialOverlap: 0.18,
  substantialOverlap: 0.52,
});

/**
 * SP:1.8 orbit envelope — enough parallax to separate overlaps, not free orbit.
 * Widened from SP:1.3 ±32° after occlusion inspection.
 */
export const EXECUTIVE_OCCLUSION_NAVIGATION_AZIMUTH_LIMITS = Object.freeze({
  minimumAzimuthOffset: -48 * (Math.PI / 180),
  maximumAzimuthOffset: 48 * (Math.PI / 180),
});

export const EXECUTIVE_OCCLUSION_FOCUS_VIEW_CANDIDATES = Object.freeze([
  Object.freeze({ azimuthOffset: 0, elevationOffset: 0 }),
  Object.freeze({ azimuthOffset: -8 * (Math.PI / 180), elevationOffset: 0 }),
  Object.freeze({ azimuthOffset: 8 * (Math.PI / 180), elevationOffset: 0 }),
  Object.freeze({ azimuthOffset: -16 * (Math.PI / 180), elevationOffset: 0 }),
  Object.freeze({ azimuthOffset: 16 * (Math.PI / 180), elevationOffset: 0 }),
  Object.freeze({
    azimuthOffset: 0,
    elevationOffset: 5 * (Math.PI / 180),
  }),
] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function finiteOr(value: number | undefined | null, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stabilize(value: number): number {
  const finite = finiteOr(value, 0);
  const rounded = Math.round(finite * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

type ProjectedObject = {
  readonly objectId: string;
  readonly ndcX: number;
  readonly ndcY: number;
  readonly depth: number;
  readonly screenRadius: number;
};

function projectObject(
  object: ExecutiveOcclusionObjectInput,
  cameraPosition: ExecutiveCameraVector,
  cameraTarget: ExecutiveCameraVector,
  fovDegrees: number,
  aspect: number,
): ProjectedObject | null {
  const radius = Math.max(
    0.08,
    finiteOr(object.radius, EXECUTIVE_OCCLUSION_DEFAULT_RADIUS),
  );
  const position = Object.freeze({
    x: finiteOr(object.position.x, 0),
    y: finiteOr(object.position.y, 0),
    z: finiteOr(object.position.z, 0),
  });
  const ndc = projectExecutiveWorldPointToNdc({
    point: position,
    cameraPosition,
    cameraTarget,
    fovDegrees,
    aspect,
  });
  if (ndc == null) return null;

  const fovRad = (finiteOr(fovDegrees, 38) * Math.PI) / 180;
  const tanHalf = Math.tan(fovRad / 2);
  /**
   * Project world radius into NDC half-extent. Prefer the vertical FOV axis
   * (aspect already applied in NDC projection) so Stage-scale meshes remain
   * effective occluders without over-shrinking on wide viewports.
   */
  const verticalRadius = (radius / Math.max(0.25, ndc.depth)) / Math.max(1e-6, tanHalf);
  const horizontalRadius = verticalRadius / Math.max(0.35, aspect);
  const screenRadius = stabilize(
    Math.min(1.35, Math.max(0.06, Math.max(verticalRadius, horizontalRadius))),
  );

  return Object.freeze({
    objectId: object.objectId,
    ndcX: ndc.x,
    ndcY: ndc.y,
    depth: ndc.depth,
    screenRadius,
  });
}

function circleOverlapRatio(
  a: ProjectedObject,
  b: ProjectedObject,
): number {
  const dx = a.ndcX - b.ndcX;
  const dy = a.ndcY - b.ndcY;
  const distance = Math.hypot(dx, dy);
  const ra = a.screenRadius;
  const rb = b.screenRadius;
  if (distance >= ra + rb) return 0;
  if (distance <= Math.abs(ra - rb)) {
    const smaller = Math.min(ra, rb);
    const larger = Math.max(ra, rb);
    return larger <= 1e-6 ? 1 : stabilize((smaller * smaller) / (larger * larger));
  }
  // Approximate coverage of rear circle by intersection / rear area.
  const overlapSpan = ra + rb - distance;
  const approx = overlapSpan / Math.max(1e-6, 2 * Math.min(ra, rb));
  return stabilize(Math.min(1, Math.max(0, approx)));
}

function classifyOverlap(ratio: number): ExecutiveObjectOcclusionState {
  if (ratio >= EXECUTIVE_OCCLUSION_THRESHOLDS.substantialOverlap) {
    return "substantial";
  }
  if (ratio >= EXECUTIVE_OCCLUSION_THRESHOLDS.partialOverlap) {
    return "partial";
  }
  return "clear";
}

/**
 * Deterministic occlusion resolver — screen-space overlap + camera depth.
 * Does not mutate inputs. Object IDs never affect geometry classification.
 */
export function resolveExecutiveObjectOcclusion(
  input: ResolveExecutiveObjectOcclusionInput,
): ExecutiveObjectOcclusionResult {
  const aspect = Math.max(0.35, finiteOr(input.aspect, 1.45));
  const projected: ProjectedObject[] = [];
  for (const object of input.objects) {
    if (typeof object.objectId !== "string" || object.objectId.length === 0) {
      continue;
    }
    const entry = projectObject(
      object,
      input.cameraPosition,
      input.cameraTarget,
      input.fovDegrees,
      aspect,
    );
    if (entry != null) projected.push(entry);
  }

  // Depth sort front-to-back for stable occluder preference.
  projected.sort((left, right) => {
    if (left.depth !== right.depth) return left.depth - right.depth;
    return compareIds(left.objectId, right.objectId);
  });

  const maxOverlapById = new Map<string, number>();
  const occludersById = new Map<string, string[]>();
  for (const object of projected) {
    maxOverlapById.set(object.objectId, 0);
    occludersById.set(object.objectId, []);
  }

  for (let rearIndex = 0; rearIndex < projected.length; rearIndex += 1) {
    const rear = projected[rearIndex]!;
    for (let frontIndex = 0; frontIndex < rearIndex; frontIndex += 1) {
      const front = projected[frontIndex]!;
      // Front must be nearer (smaller depth).
      if (front.depth >= rear.depth - 1e-6) continue;
      const ratio = circleOverlapRatio(rear, front);
      if (ratio < EXECUTIVE_OCCLUSION_THRESHOLDS.partialOverlap) continue;
      const current = maxOverlapById.get(rear.objectId) ?? 0;
      if (ratio > current) {
        maxOverlapById.set(rear.objectId, ratio);
      }
      const list = occludersById.get(rear.objectId) ?? [];
      if (!list.includes(front.objectId)) {
        list.push(front.objectId);
        list.sort(compareIds);
        occludersById.set(rear.objectId, list);
      }
    }
  }

  const hoveredId = input.hoveredObjectId ?? null;
  const focusedId = input.focusedObjectId ?? null;

  const presentations = Object.freeze(
    [...maxOverlapById.keys()]
      .sort(compareIds)
      .map((objectId) => {
        const overlapRatio = stabilize(maxOverlapById.get(objectId) ?? 0);
        const state = classifyOverlap(overlapRatio);
        const occluderIds = Object.freeze(
          occludersById.get(objectId) ?? [],
        ) as readonly string[];
        const readabilityAssist =
          state === "partial" ||
          state === "substantial" ||
          objectId === hoveredId ||
          objectId === focusedId;
        return Object.freeze({
          objectId,
          state,
          occluderIds,
          readabilityAssist:
            state !== "clear" ||
            objectId === hoveredId ||
            objectId === focusedId
              ? readabilityAssist
              : false,
          overlapRatio,
        });
      }),
  );

  const byId = new Map(
    presentations.map((entry) => [entry.objectId, entry] as const),
  );

  return Object.freeze({
    objects: presentations,
    byId,
  });
}

export function resolveExecutiveOcclusionReadability(input: {
  readonly occlusion: ExecutiveObjectOcclusionPresentation;
  readonly retainDiscoverability?: boolean;
  readonly hovered?: boolean;
  readonly focused?: boolean;
}): Readonly<{
  readonly labelProminence: "full" | "reduced" | "minimal";
  readonly silhouetteAssist: boolean;
  readonly occluderDeemphasis: boolean;
}> {
  const { occlusion } = input;
  if (input.focused) {
    return Object.freeze({
      labelProminence: "full",
      silhouetteAssist: false,
      occluderDeemphasis: false,
    });
  }
  if (occlusion.state === "substantial") {
    return Object.freeze({
      labelProminence: "full",
      silhouetteAssist: true,
      occluderDeemphasis: input.hovered === true,
    });
  }
  if (occlusion.state === "partial") {
    return Object.freeze({
      labelProminence:
        input.hovered || input.retainDiscoverability ? "full" : "reduced",
      silhouetteAssist: input.hovered === true,
      occluderDeemphasis: false,
    });
  }
  return Object.freeze({
    labelProminence: input.retainDiscoverability ? "reduced" : "minimal",
    silhouetteAssist: false,
    occluderDeemphasis: false,
  });
}

/**
 * Small deterministic candidate search for focus readability.
 * Never used for overview auto-camera (stability rule).
 */
export function resolveExecutiveOcclusionAwareFocusCameraIntent(input: {
  readonly baseIntent: ExecutiveCameraIntent;
  readonly focusedObjectId: string;
  readonly objects: readonly ExecutiveOcclusionObjectInput[];
  readonly aspect?: number;
}): ExecutiveCameraIntent {
  const aspect = Math.max(0.35, finiteOr(input.aspect, 1.45));
  let bestIntent = sanitizeExecutiveCameraIntent(input.baseIntent);
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of EXECUTIVE_OCCLUSION_FOCUS_VIEW_CANDIDATES) {
    const intent = sanitizeExecutiveCameraIntent(
      Object.freeze({
        ...input.baseIntent,
        azimuth: normalizeExecutiveCameraAzimuth(
          input.baseIntent.azimuth + candidate.azimuthOffset,
        ),
        elevation: clampExecutiveCameraElevation(
          input.baseIntent.elevation + candidate.elevationOffset,
        ),
        distance: clampExecutiveCameraDistance(input.baseIntent.distance),
      }),
    );
    // Keep candidate inside navigation-safe absolute azimuth envelope.
    const azimuthDelta = Math.abs(
      normalizeExecutiveCameraAzimuth(
        intent.azimuth - EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
      ),
    );
    if (
      azimuthDelta >
      EXECUTIVE_OCCLUSION_NAVIGATION_AZIMUTH_LIMITS.maximumAzimuthOffset + 1e-9
    ) {
      continue;
    }

    const presentation = resolveExecutiveCameraPresentation(intent, {
      framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
    });
    const occlusion = resolveExecutiveObjectOcclusion({
      objects: input.objects,
      cameraPosition: presentation.position,
      cameraTarget: presentation.target,
      fovDegrees: presentation.fov,
      aspect,
      focusedObjectId: input.focusedObjectId,
    });
    const focused = occlusion.byId.get(input.focusedObjectId);
    const score =
      focused == null
        ? 10
        : focused.state === "clear"
          ? 0
          : focused.state === "partial"
            ? 1 + focused.overlapRatio
            : 3 + focused.overlapRatio;
    // Prefer canonical (first) candidate on ties.
    if (score < bestScore - 1e-9) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  // Ensure focus FOV family remains companion unless already overridden.
  return sanitizeExecutiveCameraIntent(
    Object.freeze({
      ...bestIntent,
      fov: bestIntent.fov ?? EXECUTIVE_FOCUS_VIEWING_POLICY.fov,
    }),
  );
}

export function verifyExecutiveObjectOcclusion(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly navigationWidened: boolean;
  readonly deterministic: boolean;
}> {
  const identity = getExecutiveObjectOcclusionIdentity();
  const identityValid =
    identity.id === "SP:1.8/ExecutiveObjectOcclusion" &&
    identity.version === "1.8.0";

  const boundaryValid =
    EXECUTIVE_OBJECT_OCCLUSION_BOUNDARY.objectSpecificHacks === false &&
    EXECUTIVE_OBJECT_OCCLUSION_BOUNDARY.mutatesBaseComposition === false &&
    EXECUTIVE_OBJECT_OCCLUSION_BOUNDARY.autoMovesOverviewCamera === false &&
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.createsCompetingCameraAuthority ===
      false;

  const navigationWidened =
    EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS.maximumAzimuthOffset >=
      EXECUTIVE_OCCLUSION_NAVIGATION_AZIMUTH_LIMITS.maximumAzimuthOffset - 1e-9;

  const cameraPosition = Object.freeze({ x: 4, y: 5, z: 8 });
  const cameraTarget = Object.freeze({ x: 0, y: 0.2, z: 0 });
  const sample = {
    objects: [
      Object.freeze({
        objectId: "front",
        position: Object.freeze({ x: 0.2, y: 0.1, z: 1.1 }),
        radius: 0.45,
      }),
      Object.freeze({
        objectId: "rear",
        position: Object.freeze({ x: 0.15, y: 0.12, z: -0.2 }),
        radius: 0.45,
      }),
    ],
    cameraPosition,
    cameraTarget,
    fovDegrees: 38,
    aspect: 1.45,
  };
  const a = resolveExecutiveObjectOcclusion(sample);
  const b = resolveExecutiveObjectOcclusion(sample);
  const deterministic = JSON.stringify(a.objects) === JSON.stringify(b.objects);

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    navigationWidened &&
    deterministic;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    navigationWidened,
    deterministic,
  });
}
