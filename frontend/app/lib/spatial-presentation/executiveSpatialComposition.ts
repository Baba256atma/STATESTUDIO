/**
 * SP:1.4 — Spatial Object Composition.
 *
 * Deterministic, presentation-only XYZ composition for the Nexora Executive Stage.
 * Position is a presentation result — never business truth.
 *
 * Dependency direction (required):
 *   Canonical Stage Objects
 *     → Spatial Composition Input
 *       → Spatial Composition Resolver
 *         → Spatial Object Presentation
 *           → Existing Stage Renderer
 *
 * Builds on SP:1.1–1.3 camera systems without controlling camera internals.
 * Does NOT implement focus choreography (SP:1.5) or density-aware layout (SP:1.6).
 */

import {
  executiveCameraFoundationIdentity,
  type ExecutiveCameraVector,
} from "./executiveCameraFoundation.ts";
import { executiveViewingAngleIdentity } from "./executiveViewingAngle.ts";
import { executiveCameraNavigationIdentity } from "./executiveCameraNavigation.ts";
import {
  resolveExecutiveOverviewConstellationRelaxation,
} from "./executiveOverviewConstellationScreenSpaceRelaxation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveSpatialCompositionIdentity =
  "SP:1.4/ExecutiveSpatialComposition" as const;

export const executiveSpatialCompositionVersion = "1.4.0" as const;

export const executiveSpatialCompositionNamespace =
  "nexora.spatial-presentation.executive-spatial-composition" as const;

export const executiveSpatialCompositionPhase =
  "SpatialObjectComposition" as const;

export const executiveSpatialCompositionArchitecturalRole =
  "PresentationOnlyDeterministicSpatialComposition" as const;

export const executiveSpatialCompositionReadiness =
  "ReadyForFocusCameraChoreography" as const;

export const executiveSpatialCompositionUpstreamCameraFoundationIdentity =
  executiveCameraFoundationIdentity;

export const executiveSpatialCompositionUpstreamViewingAngleIdentity =
  executiveViewingAngleIdentity;

export const executiveSpatialCompositionUpstreamCameraNavigationIdentity =
  executiveCameraNavigationIdentity;

export type ExecutiveSpatialCompositionIdentity = {
  readonly id: typeof executiveSpatialCompositionIdentity;
  readonly version: typeof executiveSpatialCompositionVersion;
  readonly namespace: typeof executiveSpatialCompositionNamespace;
  readonly phase: typeof executiveSpatialCompositionPhase;
  readonly architecturalRole: typeof executiveSpatialCompositionArchitecturalRole;
  readonly upstreamCameraFoundation: typeof executiveCameraFoundationIdentity;
  readonly upstreamViewingAngle: typeof executiveViewingAngleIdentity;
  readonly upstreamCameraNavigation: typeof executiveCameraNavigationIdentity;
};

const COMPOSITION_IDENTITY: ExecutiveSpatialCompositionIdentity = Object.freeze({
  id: executiveSpatialCompositionIdentity,
  version: executiveSpatialCompositionVersion,
  namespace: executiveSpatialCompositionNamespace,
  phase: executiveSpatialCompositionPhase,
  architecturalRole: executiveSpatialCompositionArchitecturalRole,
  upstreamCameraFoundation: executiveCameraFoundationIdentity,
  upstreamViewingAngle: executiveViewingAngleIdentity,
  upstreamCameraNavigation: executiveCameraNavigationIdentity,
});

export function getExecutiveSpatialCompositionIdentity(): ExecutiveSpatialCompositionIdentity {
  return COMPOSITION_IDENTITY;
}

export const EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY = Object.freeze({
  architecturalRole: executiveSpatialCompositionArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsRelationships: false as const,
  ownsSelection: false as const,
  ownsFocus: false as const,
  ownsSeverity: false as const,
  inventsRelationships: false as const,
  encodesImportanceByPosition: false as const,
  encodesImportanceByScale: false as const,
  introducesFocusChoreography: false as const,
  introducesDensityAwareLayout: false as const,
  introducesRandomLayout: false as const,
  introducesPhysicsLayout: false as const,
  createsCompetingCameraAuthority: false as const,
  presentationOnly: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

/** Alias aligned with SP:1.1 camera vector — same numeric shape. */
export type ExecutiveSpatialVector = ExecutiveCameraVector;

export type ExecutiveSpatialDepthLayer =
  | "foreground"
  | "midground"
  | "background";

export type ExecutiveSpatialSlotId =
  | "rear-left"
  | "rear-mid"
  | "rear-right"
  | "mid-left"
  | "mid-lower"
  | "mid-right"
  | "fore-left"
  | "fore-mid"
  | "fore-right";

export type ExecutiveSpatialObjectInput = {
  readonly objectId: string;
  /** Fixture / preferred placeholder coordinates — presentation hints only. */
  readonly preferredPosition?: ExecutiveSpatialVector;
  /**
   * SP:2.8B — presentation-only Overview relaxation priority.
   * Higher values resist displacement. Never encodes business focus.
   */
  readonly presentationPriorityRank?: number;
  /** SP:2.8B — approximate silhouette radius for projected pressure. */
  readonly approximateRadius?: number;
};

export type ExecutiveSpatialObjectPresentation = {
  readonly objectId: string;
  readonly position: ExecutiveSpatialVector;
  readonly slotId: ExecutiveSpatialSlotId | "overflow";
  readonly layer: ExecutiveSpatialDepthLayer;
};

export type ExecutiveSpatialCompositionBounds = {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly minZ: number;
  readonly maxZ: number;
};

/**
 * SP:1.6 density composition parameters — bounded spread multipliers.
 * SP:1.4 remains the sole XYZ authority; density only scales slot offsets.
 */
export type ExecutiveSpatialCompositionSpreadParameters = {
  readonly horizontalSpread?: number;
  readonly verticalSpread?: number;
  readonly depthSpread?: number;
};

export type ResolveExecutiveSpatialCompositionInput = {
  readonly objects: readonly ExecutiveSpatialObjectInput[];
  readonly objectCount?: number;
  readonly availableBounds?: Partial<ExecutiveSpatialCompositionBounds>;
  readonly densityProfile?: string;
  readonly compositionParameters?: ExecutiveSpatialCompositionSpreadParameters;
};

export type ExecutiveSpatialCompositionResult = {
  readonly objects: readonly ExecutiveSpatialObjectPresentation[];
  readonly bounds: ExecutiveSpatialCompositionBounds;
  readonly reservedCenter: ExecutiveSpatialVector;
};

type ExecutiveSpatialSlot = {
  readonly id: ExecutiveSpatialSlotId;
  readonly position: ExecutiveSpatialVector;
  readonly layer: ExecutiveSpatialDepthLayer;
};

// ─── Canonical bounds & slots ───────────────────────────────────────────────

/**
 * Readable Stage volume aligned with SP:1.1–1.2 framing and UI clearance
 * (left object list, right Advisor, bottom camera nav, top mode selector).
 */
export const EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS: ExecutiveSpatialCompositionBounds =
  Object.freeze({
    // SP:2.8A — preserve spread; raise bottom floor; shrink BR AABB so Dial
    // panel exclusion is reflected in the declared Stage volume (no camera bump).
    minX: -2.95,
    maxX: 2.5,
    minY: -0.14,
    maxY: 0.58,
    minZ: -1.85,
    maxZ: 1.4,
  });

/** Strategically available for SP:1.5 focus choreography — not filled by base layout. */
export const EXECUTIVE_SPATIAL_RESERVED_CENTER: ExecutiveSpatialVector =
  Object.freeze({
    x: 0,
    y: 0.18,
    z: 0.05,
  });

/**
 * SP:2.8A — world-space bottom-right UI overlay avoidance (Dial + Timeline).
 * Generic: any object in this region receives a bounded left/up correction.
 * Not object-ID based. Max correction is clamped.
 */
export const EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE = Object.freeze({
  // Dial panel corner only — not the entire outer-right Stage.
  unsafeMinX: 1.5,
  unsafeMinZ: 1.05,
  safeMaxX: 1.18,
  safeMaxZ: 0.82,
  /** Dial-region vertical clearance target. */
  safeMinY: -0.02,
  /** Global Timeline/Stage floor target (bounded lift). */
  stageFloorY: -0.08,
  maxCorrectionX: 0.9,
  maxCorrectionY: 0.32,
  maxCorrectionZ: 0.65,
});

/**
 * Bounded presentation correction for persistent Stage UI overlays.
 * Prefer left + up; never invent relationships or rewrite business truth.
 * Dial exclusion + bottom margin cooperate in one clamp — no repeated pushes.
 */
export function applyExecutiveSpatialUiOverlaySafeCorrection(
  position: ExecutiveSpatialVector,
  bounds: ExecutiveSpatialCompositionBounds = EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
): ExecutiveSpatialVector {
  const zone = EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE;
  const x0 = finiteOr(position.x, 0);
  const y0 = finiteOr(position.y, 0.1);
  const z0 = finiteOr(position.z, 0);
  const inBottomRight = x0 >= zone.unsafeMinX && z0 >= zone.unsafeMinZ;
  const tooLow = y0 < zone.stageFloorY;
  if (!inBottomRight && !tooLow) {
    return clampExecutiveSpatialVector(
      { x: x0, y: y0, z: z0 },
      bounds,
    );
  }

  let x = x0;
  let y = y0;
  let z = z0;
  if (inBottomRight) {
    const dx = Math.min(zone.maxCorrectionX, Math.max(0, x - zone.safeMaxX));
    const dz = Math.min(zone.maxCorrectionZ, Math.max(0, z - zone.safeMaxZ));
    const dy = Math.min(
      zone.maxCorrectionY,
      Math.max(0, zone.safeMinY + 0.14 - y),
    );
    x -= dx;
    z -= dz;
    y += dy;
  } else if (tooLow) {
    y += Math.min(zone.maxCorrectionY, Math.max(0, zone.stageFloorY - y));
  }

  return clampExecutiveSpatialVector({ x, y, z }, bounds);
}

/**
 * Explicit composition slots — designed, not random.
 * Center is intentionally omitted for future focus space.
 */
export const EXECUTIVE_SPATIAL_COMPOSITION_SLOTS: readonly ExecutiveSpatialSlot[] =
  Object.freeze([
    // SP:2.8 — widen constellation across usable Stage envelope (no name hacks).
    Object.freeze({
      id: "rear-left" as const,
      position: Object.freeze({ x: -2.35, y: 0.4, z: -1.55 }),
      layer: "background" as const,
    }),
    Object.freeze({
      id: "rear-mid" as const,
      position: Object.freeze({ x: -0.4, y: 0.34, z: -1.7 }),
      layer: "background" as const,
    }),
    Object.freeze({
      id: "rear-right" as const,
      position: Object.freeze({ x: 2.3, y: 0.32, z: -1.5 }),
      layer: "background" as const,
    }),
    Object.freeze({
      id: "mid-left" as const,
      position: Object.freeze({ x: -2.6, y: 0.08, z: 0.0 }),
      layer: "midground" as const,
    }),
    Object.freeze({
      id: "mid-lower" as const,
      // Keep clear of reserved center; SP:2.8A raises Y above Timeline floor.
      position: Object.freeze({ x: 1.25, y: 0.02, z: 0.55 }),
      layer: "midground" as const,
    }),
    Object.freeze({
      id: "mid-right" as const,
      position: Object.freeze({ x: 2.45, y: 0.12, z: -0.2 }),
      layer: "midground" as const,
    }),
    Object.freeze({
      id: "fore-left" as const,
      position: Object.freeze({ x: -1.7, y: -0.02, z: 1.35 }),
      layer: "foreground" as const,
    }),
    Object.freeze({
      id: "fore-mid" as const,
      position: Object.freeze({ x: 0.95, y: 0.14, z: 1.25 }),
      layer: "foreground" as const,
    }),
    Object.freeze({
      id: "fore-right" as const,
      // SP:2.8A — leave Dial panel breathing room (generic outer-right slot).
      position: Object.freeze({ x: 1.45, y: 0.12, z: 1.15 }),
      layer: "foreground" as const,
    }),
  ]);

// ─── Helpers ────────────────────────────────────────────────────────────────

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function stabilize(value: number): number {
  const finite = finiteOr(value, 0);
  const rounded = Math.round(finite * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function stabilizeVector(vector: ExecutiveSpatialVector): ExecutiveSpatialVector {
  return Object.freeze({
    x: stabilize(vector.x),
    y: stabilize(vector.y),
    z: stabilize(vector.z),
  });
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function mergeExecutiveSpatialCompositionBounds(
  override?: Partial<ExecutiveSpatialCompositionBounds>,
): ExecutiveSpatialCompositionBounds {
  const base = EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS;
  if (override === undefined) {
    return base;
  }
  return Object.freeze({
    minX: finiteOr(override.minX ?? base.minX, base.minX),
    maxX: finiteOr(override.maxX ?? base.maxX, base.maxX),
    minY: finiteOr(override.minY ?? base.minY, base.minY),
    maxY: finiteOr(override.maxY ?? base.maxY, base.maxY),
    minZ: finiteOr(override.minZ ?? base.minZ, base.minZ),
    maxZ: finiteOr(override.maxZ ?? base.maxZ, base.maxZ),
  });
}

export function clampExecutiveSpatialVector(
  vector: ExecutiveSpatialVector,
  bounds: ExecutiveSpatialCompositionBounds = EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
): ExecutiveSpatialVector {
  return stabilizeVector({
    x: clamp(finiteOr(vector.x, 0), bounds.minX, bounds.maxX),
    y: clamp(finiteOr(vector.y, 0), bounds.minY, bounds.maxY),
    z: clamp(finiteOr(vector.z, 0), bounds.minZ, bounds.maxZ),
  });
}

function squaredDistance(
  a: ExecutiveSpatialVector,
  b: ExecutiveSpatialVector,
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

function preferredOrOrigin(
  preferred: ExecutiveSpatialVector | undefined,
): ExecutiveSpatialVector {
  if (preferred === undefined) {
    return Object.freeze({ x: 0, y: 0.1, z: 0 });
  }
  return stabilizeVector({
    x: finiteOr(preferred.x, 0),
    y: finiteOr(preferred.y, 0.1),
    z: finiteOr(preferred.z, 0),
  });
}

function overflowPosition(
  index: number,
  bounds: ExecutiveSpatialCompositionBounds,
): ExecutiveSpatialVector {
  // Deterministic ring outside center for surplus objects — still in bounds.
  const angle = (index / Math.max(1, index + 1)) * Math.PI * 2 - Math.PI / 2;
  const radiusX = (bounds.maxX - bounds.minX) * 0.38;
  const radiusZ = (bounds.maxZ - bounds.minZ) * 0.38;
  return clampExecutiveSpatialVector(
    {
      x: Math.cos(angle) * radiusX,
      y: bounds.minY + 0.12 + (index % 3) * 0.08,
      z: Math.sin(angle) * radiusZ,
    },
    bounds,
  );
}

function compareObjectIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Deterministic slot assignment:
 * stable objectId order → nearest unused slot by preferredPosition.
 * Preferred fixture coordinates are spatial hints, not business meaning.
 */
function applyCompositionSpread(
  position: ExecutiveSpatialVector,
  parameters: ExecutiveSpatialCompositionSpreadParameters | undefined,
  bounds: ExecutiveSpatialCompositionBounds,
): ExecutiveSpatialVector {
  if (parameters === undefined) {
    return applyExecutiveSpatialUiOverlaySafeCorrection(
      clampExecutiveSpatialVector(position, bounds),
      bounds,
    );
  }
  const horizontal = clamp(
    finiteOr(parameters.horizontalSpread ?? 1, 1),
    0.75,
    1.25,
  );
  const vertical = clamp(finiteOr(parameters.verticalSpread ?? 1, 1), 0.75, 1.25);
  const depth = clamp(finiteOr(parameters.depthSpread ?? 1, 1), 0.75, 1.25);
  const center = EXECUTIVE_SPATIAL_RESERVED_CENTER;
  return applyExecutiveSpatialUiOverlaySafeCorrection(
    clampExecutiveSpatialVector(
      {
        x: center.x + (position.x - center.x) * horizontal,
        y: center.y + (position.y - center.y) * vertical,
        z: center.z + (position.z - center.z) * depth,
      },
      bounds,
    ),
    bounds,
  );
}

export function resolveExecutiveSpatialComposition(
  input: ResolveExecutiveSpatialCompositionInput,
): ExecutiveSpatialCompositionResult {
  const bounds = mergeExecutiveSpatialCompositionBounds(input.availableBounds);
  const objects = [...input.objects].sort((left, right) =>
    compareObjectIds(left.objectId, right.objectId),
  );

  // densityProfile / objectCount are metadata for callers; spread params apply.
  void input.densityProfile;
  void input.objectCount;

  const availableSlots = [...EXECUTIVE_SPATIAL_COMPOSITION_SLOTS];
  const presentations: ExecutiveSpatialObjectPresentation[] = [];
  let overflowIndex = 0;

  for (const object of objects) {
    const preferred = preferredOrOrigin(object.preferredPosition);
    if (availableSlots.length === 0) {
      presentations.push(
        Object.freeze({
          objectId: object.objectId,
          position: applyCompositionSpread(
            overflowPosition(overflowIndex, bounds),
            input.compositionParameters,
            bounds,
          ),
          slotId: "overflow",
          layer: "midground",
        }),
      );
      overflowIndex += 1;
      continue;
    }

    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < availableSlots.length; index += 1) {
      const slot = availableSlots[index]!;
      const distance = squaredDistance(preferred, slot.position);
      if (
        distance < bestDistance ||
        (distance === bestDistance &&
          slot.id.localeCompare(availableSlots[bestIndex]!.id) < 0)
      ) {
        bestDistance = distance;
        bestIndex = index;
      }
    }

    const [slot] = availableSlots.splice(bestIndex, 1);
    presentations.push(
      Object.freeze({
        objectId: object.objectId,
        position: applyCompositionSpread(
          slot!.position,
          input.compositionParameters,
          bounds,
        ),
        slotId: slot!.id,
        layer: slot!.layer,
      }),
    );
  }

  // Preserve input relative order in output? Spec says stable identity — sorted by id is fine
  // for map lookup. Return in objectId sort order for determinism.
  /**
   * SP:2.8B — Overview screen-space relaxation after canonical slot placement
   * and SP:2.8A UI overlay safe correction. Focus choreography continues to
   * override targets via SP:1.5; these positions remain Overview homes.
   */
  const relaxation = resolveExecutiveOverviewConstellationRelaxation({
    objects: presentations.map((entry, stageOrder) => {
      const source = objects.find((item) => item.objectId === entry.objectId);
      return Object.freeze({
        objectId: entry.objectId,
        canonicalPosition: entry.position,
        priorityRank: source?.presentationPriorityRank,
        approximateRadius: source?.approximateRadius,
        stageOrder,
      });
    }),
    densityProfile: input.densityProfile,
    bounds,
    active: true,
  });
  const relaxedById = new Map(
    relaxation.objects.map((entry) => [entry.objectId, entry.relaxedPosition]),
  );
  const relaxedPresentations = presentations.map((entry) =>
    Object.freeze({
      ...entry,
      position: relaxedById.get(entry.objectId) ?? entry.position,
    }),
  );

  return Object.freeze({
    objects: Object.freeze(relaxedPresentations),
    bounds,
    reservedCenter: EXECUTIVE_SPATIAL_RESERVED_CENTER,
  });
}

export function executiveSpatialPresentationToTuple(
  position: ExecutiveSpatialVector,
): readonly [number, number, number] {
  const stable = stabilizeVector(position);
  return Object.freeze([stable.x, stable.y, stable.z] as const);
}

export function buildExecutiveSpatialCompositionPositionMap(
  result: ExecutiveSpatialCompositionResult,
): ReadonlyMap<string, readonly [number, number, number]> {
  const map = new Map<string, readonly [number, number, number]>();
  for (const entry of result.objects) {
    map.set(
      entry.objectId,
      executiveSpatialPresentationToTuple(entry.position),
    );
  }
  return map;
}

export function hasExecutiveSpatialDepthVariation(
  result: ExecutiveSpatialCompositionResult,
): boolean {
  if (result.objects.length < 2) {
    return true;
  }
  const zs = result.objects.map((entry) => entry.position.z);
  const span = Math.max(...zs) - Math.min(...zs);
  return span >= 0.75;
}

export function verifyExecutiveSpatialComposition(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly depthPresent: boolean;
  readonly presentationOnly: boolean;
}> {
  const identity = getExecutiveSpatialCompositionIdentity();
  const identityValid =
    identity.id === "SP:1.4/ExecutiveSpatialComposition" &&
    identity.version === "1.4.0" &&
    identity.upstreamCameraFoundation ===
      "SP:1.1/ExecutiveCameraFoundation" &&
    identity.upstreamViewingAngle === "SP:1.2/ExecutiveViewingAngle" &&
    identity.upstreamCameraNavigation ===
      "SP:1.3/ExecutiveCameraNavigation";

  const boundaryValid =
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.inventsRelationships === false &&
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.introducesFocusChoreography ===
      false &&
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.introducesRandomLayout === false;

  const sample = Object.freeze([
    Object.freeze({
      objectId: "obj-a",
      preferredPosition: Object.freeze({ x: -2, y: 0.2, z: -0.5 }),
    }),
    Object.freeze({
      objectId: "obj-b",
      preferredPosition: Object.freeze({ x: 1.5, y: 0.1, z: 1 }),
    }),
    Object.freeze({
      objectId: "obj-c",
      preferredPosition: Object.freeze({ x: 0.2, y: 0.3, z: -1 }),
    }),
  ]);
  const a = resolveExecutiveSpatialComposition({ objects: sample });
  const b = resolveExecutiveSpatialComposition({ objects: sample });
  const deterministic = JSON.stringify(a) === JSON.stringify(b);
  const depthPresent = hasExecutiveSpatialDepthVariation(a);
  const presentationOnly =
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.presentationOnly === true &&
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.ownsSeverity === false;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    depthPresent &&
    presentationOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    depthPresent,
    presentationOnly,
  });
}
