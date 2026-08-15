/**
 * SP:4.2 — Executive 2D Presentation Plane Foundation
 * (SP:4.3B true-2D authority interpretation).
 *
 * Architectural authority:
 *   Disclosure (WHAT) → 2D Network Topology (WHERE)
 *     → Executive2DPosition {x,y} → R3F render mapping → 3D Object Rendering
 *
 * Product law: 2D decides WHERE. 3D decides HOW IT LOOKS.
 * Composition mode token remains `executive-2_5d` for compatibility; layout
 * authority is unequivocally 2D. depthRole must not move objects.
 *
 * Three.js / R3F remains the rendering engine. SP:4.4–4.6 own focus
 * choreography and final separation polish.
 */

import { EXECUTIVE_FOCUS_ANCHOR_TARGET } from "./executiveCameraFoundation.ts";
import { EXECUTIVE_FOCUS_VISUAL_SEPARATION } from "./executiveFocusVisualGrammar.ts";
import {
  resolveExecutiveObjectGeometryFamily,
  type ExecutiveObjectGeometryFamily,
} from "./executiveObjectGeometryLanguage.ts";
import {
  EXECUTIVE_OBJECT_SCALE_ENVELOPE,
  resolveExecutiveObjectScale,
} from "./executiveObjectVisualFoundation.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE,
} from "./executiveSpatialComposition.ts";
import {
  resolveExecutiveUsableStageWorldAnchor,
  type ExecutiveUsableStageWorldAnchor,
} from "./executiveUsableStageViewport.ts";
import { EXECUTIVE_RENDER_PLANE_Z } from "./executiveTrue2DStageAuthority.ts";

/** Re-export the render-plane constant without `export … from` (avoids Turbopack locals split). */
export { EXECUTIVE_RENDER_PLANE_Z };

// ─── Identity ───────────────────────────────────────────────────────────────

export const executivePresentationPlaneFoundationIdentity =
  "SP:4.2/Executive25DStageFoundation" as const;

export const executivePresentationPlaneFoundationVersion = "4.2.0" as const;

export const executivePresentationPlaneFoundationNamespace =
  "nexora.spatial-presentation.executive-presentation-plane" as const;

export const executivePresentationPlaneFoundationPhase =
  "Executive25DStageFoundation" as const;

export const executivePresentationPlaneFoundationArchitecturalRole =
  "PresentationOnlyExecutive25DStageFoundation" as const;

export const executivePresentationPlaneFoundationReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutivePresentationPlaneFoundationIdentity = {
  readonly id: typeof executivePresentationPlaneFoundationIdentity;
  readonly version: typeof executivePresentationPlaneFoundationVersion;
  readonly namespace: typeof executivePresentationPlaneFoundationNamespace;
  readonly phase: typeof executivePresentationPlaneFoundationPhase;
  readonly architecturalRole: typeof executivePresentationPlaneFoundationArchitecturalRole;
};

const FOUNDATION_IDENTITY: ExecutivePresentationPlaneFoundationIdentity =
  Object.freeze({
    id: executivePresentationPlaneFoundationIdentity,
    version: executivePresentationPlaneFoundationVersion,
    namespace: executivePresentationPlaneFoundationNamespace,
    phase: executivePresentationPlaneFoundationPhase,
    architecturalRole: executivePresentationPlaneFoundationArchitecturalRole,
  });

export function getExecutivePresentationPlaneFoundationIdentity(): ExecutivePresentationPlaneFoundationIdentity {
  return FOUNDATION_IDENTITY;
}

export const EXECUTIVE_PRESENTATION_PLANE_BOUNDARY = Object.freeze({
  architecturalRole: executivePresentationPlaneFoundationArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsAdvisorState: false as const,
  ownsCanonicalRelationships: false as const,
  inventsRelationships: false as const,
  ownsDisclosureMembership: false as const,
  ownsFocusSemantics: false as const,
  ownsLighting: false as const,
  ownsGeometryLanguage: false as const,
  implementsNetworkTopologyComposition: false as const,
  implementsFocusCenteredChoreography: false as const,
  implementsFinalScreenSeparation: false as const,
  usesPhysicsEngine: false as const,
  usesForceSimulation: false as const,
  usesPerFrameLayoutSolver: false as const,
  usesRandomLayout: false as const,
  depthResolvesCollision: false as const,
  usedZOnlyEscape: false as const,
  depthRolePositionEffect: 0 as const,
  presentationPlaneOwnsLayout: true as const,
  renderingConsumesComposition: true as const,
  presentationOnly: true as const,
  true2DLayoutAuthority: true as const,
});

/**
 * Controlled migration mode. Not an end-user setting.
 * `executive-2_5d` = active true-2D Stage layout + 3D object rendering.
 */
export type ExecutiveStageCompositionMode = "spatial-3d" | "executive-2_5d";

export const EXECUTIVE_STAGE_COMPOSITION_MODE_DEFAULT: ExecutiveStageCompositionMode =
  "executive-2_5d";

export const EXECUTIVE_STAGE_COMPOSITION_MODE_LEGACY: ExecutiveStageCompositionMode =
  "spatial-3d";

// ─── Core contracts ─────────────────────────────────────────────────────────

/**
 * Authoritative Stage layout position (SP:4.3B).
 * Never includes z — z is renderer-boundary only.
 */
export type Executive2DPosition = {
  readonly x: number;
  readonly y: number;
};

/** @deprecated Prefer Executive2DPosition — kept as alias for SP:4.2 callers. */
export type ExecutivePresentationPosition = Executive2DPosition;

/**
 * Presentation plane in Stage presentation coordinates (true 2D).
 * Axis mapping (SP:4.3B):
 *   presentation.x → world.x
 *   presentation.y → world.y
 *   render plane   → constant world.z (not topology)
 */
export type ExecutivePresentationPlane = {
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly restingWorldY: number;
};

export type ExecutivePresentationDepthRole =
  | "focus"
  | "foreground"
  | "standard"
  | "background"
  | "thread";

export type ExecutivePresentationRegionId =
  | "business-network"
  | "executive-thread"
  | "background-context";

export type ExecutivePresentationRegion = {
  readonly id: ExecutivePresentationRegionId;
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
};

export type ExecutivePresentationSafeAreaId =
  | "workspace-dial"
  | "presentation-depth"
  | "timeline"
  | "stage-border"
  | "object-list"
  | "advisor";

export type ExecutivePresentationSafeArea = {
  readonly id: ExecutivePresentationSafeAreaId;
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  /** When true, layout must avoid this rectangle. */
  readonly excludesLayout: boolean;
};

export type ExecutivePresentationFootprint = {
  readonly geometryFamily: ExecutiveObjectGeometryFamily;
  readonly width: number;
  readonly height: number;
  readonly compositionScale: number;
  readonly extentScale: number;
};

export type ExecutivePresentationTerritory = {
  readonly objectId: string;
  readonly center: ExecutivePresentationPosition;
  readonly width: number;
  readonly height: number;
  readonly padding: number;
  readonly region: ExecutivePresentationRegionId;
  readonly depthRole: ExecutivePresentationDepthRole;
};

/** Composition contract — WHERE the subject appears. */
export type ExecutivePresentationCompositionContract = {
  readonly objectId: string;
  readonly presentationPosition: ExecutivePresentationPosition;
  readonly layoutRole: "focus" | "related" | "background" | "thread";
  readonly visibility: "visible" | "hidden";
  readonly prominence: "primary" | "elevated" | "standard" | "reduced";
  readonly depthRole: ExecutivePresentationDepthRole;
  readonly region: ExecutivePresentationRegionId;
  readonly territory: ExecutivePresentationTerritory;
  readonly footprint: ExecutivePresentationFootprint;
  readonly compositionScale: number;
};

/** Rendering contract — HOW the subject looks (consumes composition). */
export type ExecutivePresentationRenderingContract = {
  readonly objectId: string;
  readonly worldPosition: Readonly<{
    readonly x: number;
    readonly y: number;
    readonly z: number;
  }>;
  readonly compositionScale: number;
  readonly depthRole: ExecutivePresentationDepthRole;
  readonly depthOffset: number;
};

export type ExecutivePresentationWorldPosition = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

// ─── Tokens ─────────────────────────────────────────────────────────────────

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1e6) / 1e6;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * SP:4.3B — depthRole is legacy metadata only.
 * positionEffect must remain 0: hierarchy uses scale/opacity/lighting/labels.
 */
export const EXECUTIVE_PRESENTATION_DEPTH_OFFSETS = Object.freeze({
  focus: 0,
  foreground: 0,
  standard: 0,
  background: 0,
  thread: 0,
  /** Absolute max |offset| — hard invariant (must stay 0 under true-2D). */
  maximumAbsolute: 0,
  /** Hard product law: depthRole must not move objects. */
  positionEffect: 0 as const,
} as const);

export const EXECUTIVE_PRESENTATION_FOOTPRINT_POLICY = Object.freeze({
  /** Reuse SP:4.1C silhouette conservatism without camera projection loops. */
  extentScale: EXECUTIVE_FOCUS_VISUAL_SEPARATION.silhouetteExtentScale,
  defaultPadding: 0.08,
  minimumFootprint: 0.18,
});

/**
 * SP:4.3B true-2D axis mapping:
 *   presentation.x → world.x          (network horizontal)
 *   presentation.y → world.y          (network vertical)
 *   render plane   → EXECUTIVE_RENDER_PLANE_Z (constant)
 *   depthRole      → layout-inert (positionEffect = 0)
 *
 * Presentation {0,0} maps to the usable Stage world XY anchor.
 */
export const EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING = Object.freeze({
  presentationX: "world.x" as const,
  presentationY: "world.y" as const,
  depthRole: "layout-inert" as const,
  renderPlaneZ: EXECUTIVE_RENDER_PLANE_Z,
  restingWorldY: EXECUTIVE_FOCUS_ANCHOR_TARGET.y,
  restingWorldZ: EXECUTIVE_RENDER_PLANE_Z,
  rationale:
    "SP:4.3B — true 2D network on screen XY; constant render-plane Z; depthRole does not move nodes.",
});

// ─── Plane / regions / safe areas ───────────────────────────────────────────

/**
 * Canonical presentation plane — every Business Object shares this 2D plane.
 * Vertical extent reuses the former Stage Z span as network height.
 */
export function createExecutivePresentationPlane(
  options?: Partial<ExecutivePresentationPlane>,
): ExecutivePresentationPlane {
  const minX = options?.minX ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minX;
  const maxX = options?.maxX ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxX;
  // Vertical presentation extent — former depth span, now screen-vertical.
  const minY = options?.minY ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minZ;
  const maxY = options?.maxY ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxZ;
  const centerX = options?.centerX ?? 0;
  const centerY = options?.centerY ?? 0;
  return Object.freeze({
    width: stabilize(maxX - minX),
    height: stabilize(maxY - minY),
    centerX: stabilize(centerX),
    centerY: stabilize(centerY),
    minX: stabilize(minX),
    maxX: stabilize(maxX),
    minY: stabilize(minY),
    maxY: stabilize(maxY),
    restingWorldY: stabilize(
      options?.restingWorldY ?? EXECUTIVE_FOCUS_ANCHOR_TARGET.y,
    ),
  });
}

export function resolveExecutivePresentationPlaneCenter(
  plane: ExecutivePresentationPlane = createExecutivePresentationPlane(),
): ExecutivePresentationPosition {
  return Object.freeze({
    x: plane.centerX,
    y: plane.centerY,
  });
}

/**
 * Focus-center capability foundation (SP:4.4 will choreograph the network).
 * Focused anchor may occupy exact plane center without fighting depth/topology.
 */
export function resolveExecutivePresentationFocusCenter(
  plane: ExecutivePresentationPlane = createExecutivePresentationPlane(),
): ExecutivePresentationPosition {
  return resolveExecutivePresentationPlaneCenter(plane);
}

export function createExecutivePresentationPosition(
  x: number,
  y: number,
): Executive2DPosition {
  return Object.freeze({
    x: stabilize(x),
    y: stabilize(y),
  });
}

/** Alias — preferred name under SP:4.3B true-2D authority. */
export const createExecutive2DPosition = createExecutivePresentationPosition;

export function clampExecutivePresentationPosition(
  position: ExecutivePresentationPosition,
  plane: ExecutivePresentationPlane = createExecutivePresentationPlane(),
): ExecutivePresentationPosition {
  return Object.freeze({
    x: stabilize(clamp(position.x, plane.minX, plane.maxX)),
    y: stabilize(clamp(position.y, plane.minY, plane.maxY)),
  });
}

/**
 * Region ownership — clamp a presentation position into a named region AABB.
 * Used so Executive Thread cannot drift into Business Network / focus center.
 */
export function clampExecutivePresentationPositionToRegion(
  position: ExecutivePresentationPosition,
  region: ExecutivePresentationRegion,
): ExecutivePresentationPosition {
  return Object.freeze({
    x: stabilize(clamp(position.x, region.minX, region.maxX)),
    y: stabilize(clamp(position.y, region.minY, region.maxY)),
  });
}

export function resolveExecutivePresentationRegionCenter(
  region: ExecutivePresentationRegion,
): ExecutivePresentationPosition {
  return createExecutivePresentationPosition(
    (region.minX + region.maxX) / 2,
    (region.minY + region.maxY) / 2,
  );
}

export function resolveExecutivePresentationRegions(
  plane: ExecutivePresentationPlane = createExecutivePresentationPlane(),
): readonly ExecutivePresentationRegion[] {
  const threadBand = 0.55;
  return Object.freeze([
    Object.freeze({
      id: "business-network" as const,
      minX: plane.minX,
      maxX: plane.maxX,
      minY: plane.minY + threadBand * 0.35,
      maxY: plane.maxY,
    }),
    Object.freeze({
      id: "executive-thread" as const,
      minX: plane.minX * 0.55,
      maxX: plane.maxX * 0.55,
      minY: plane.minY,
      maxY: plane.minY + threadBand,
    }),
    Object.freeze({
      id: "background-context" as const,
      minX: plane.minX,
      maxX: plane.maxX,
      minY: plane.minY,
      maxY: plane.maxY,
    }),
  ]);
}

/**
 * Stage UI exclusions expressed directly in presentation coordinates
 * (no world→camera→NDC→DOM round-trip for layout queries).
 */
export function resolveExecutivePresentationSafeAreas(
  plane: ExecutivePresentationPlane = createExecutivePresentationPlane(),
): readonly ExecutivePresentationSafeArea[] {
  const dial = EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE;
  return Object.freeze([
    Object.freeze({
      id: "workspace-dial" as const,
      minX: dial.unsafeMinX,
      maxX: plane.maxX,
      minY: dial.unsafeMinZ,
      maxY: plane.maxY,
      excludesLayout: true,
    }),
    Object.freeze({
      id: "timeline" as const,
      minX: plane.minX,
      maxX: plane.maxX,
      minY: plane.minY,
      maxY: Math.min(plane.maxY, plane.minY + 0.28),
      excludesLayout: true,
    }),
    Object.freeze({
      id: "presentation-depth" as const,
      minX: plane.minX * 0.35,
      maxX: plane.maxX * 0.35,
      minY: plane.maxY - 0.35,
      maxY: plane.maxY,
      excludesLayout: true,
    }),
    Object.freeze({
      id: "object-list" as const,
      minX: plane.minX,
      maxX: plane.minX + 0.85,
      minY: plane.minY + 0.4,
      maxY: plane.maxY,
      excludesLayout: true,
    }),
    Object.freeze({
      id: "advisor" as const,
      minX: plane.maxX - 0.55,
      maxX: plane.maxX,
      minY: plane.minY + 0.5,
      maxY: plane.maxY - 0.2,
      excludesLayout: true,
    }),
    Object.freeze({
      id: "stage-border" as const,
      minX: plane.minX,
      maxX: plane.maxX,
      minY: plane.minY,
      maxY: plane.maxY,
      excludesLayout: false,
    }),
  ]);
}

// ─── Depth / footprint / territory ──────────────────────────────────────────

export function resolveExecutivePresentationDepthOffset(
  _role: ExecutivePresentationDepthRole,
): number {
  // SP:4.3B — depthRole has zero positional effect.
  void _role;
  return EXECUTIVE_PRESENTATION_DEPTH_OFFSETS.positionEffect;
}

export function mapVisualGrammarRoleToPresentationDepthRole(
  role: string | undefined,
): ExecutivePresentationDepthRole {
  switch (role) {
    case "primary":
    case "focus":
      return "focus";
    case "elevated":
      return "foreground";
    case "background":
      return "background";
    case "executive-thread":
    case "collapsed-thread":
    case "thread":
      return "thread";
    default:
      return "standard";
  }
}

export function mapVisualGrammarRoleToPresentationRegion(
  role: string | undefined,
): ExecutivePresentationRegionId {
  switch (role) {
    case "executive-thread":
    case "collapsed-thread":
    case "thread":
      return "executive-thread";
    case "background":
      return "background-context";
    default:
      return "business-network";
  }
}

/**
 * Stable certified presentation footprint from geometry family + scale.
 * Camera-independent — avoids reintroducing projection-driven layout.
 */
export function resolveExecutivePresentationFootprint(input: {
  readonly objectKind?: string;
  readonly geometryFamily?: ExecutiveObjectGeometryFamily;
  readonly compositionScale: number;
  readonly extentScale?: number;
}): ExecutivePresentationFootprint {
  const geometry = resolveExecutiveObjectGeometryFamily({
    objectKind: input.objectKind ?? "object",
  });
  const family = input.geometryFamily ?? geometry.geometryFamily;
  const extentScale =
    input.extentScale ?? EXECUTIVE_PRESENTATION_FOOTPRINT_POLICY.extentScale;
  const scale = Math.max(
    EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale,
    input.compositionScale,
  );
  const dims = geometry.dimensions;
  // Presentation footprint — conservative silhouette on the network plane.
  // Keep depth-weighted height so SP:4.3 spacing calibration remains stable
  // after the SP:4.3A screen-aligned axis remap.
  const width = Math.max(
    EXECUTIVE_PRESENTATION_FOOTPRINT_POLICY.minimumFootprint,
    dims.width * scale * extentScale,
  );
  const height = Math.max(
    EXECUTIVE_PRESENTATION_FOOTPRINT_POLICY.minimumFootprint,
    Math.max(dims.depth, dims.height * 0.55) * scale * extentScale,
  );
  return Object.freeze({
    geometryFamily: family,
    width: stabilize(width),
    height: stabilize(height),
    compositionScale: stabilize(scale),
    extentScale: stabilize(extentScale),
  });
}

export function createExecutivePresentationTerritory(input: {
  readonly objectId: string;
  readonly center: ExecutivePresentationPosition;
  readonly footprint: ExecutivePresentationFootprint;
  readonly padding?: number;
  readonly region?: ExecutivePresentationRegionId;
  readonly depthRole?: ExecutivePresentationDepthRole;
}): ExecutivePresentationTerritory {
  const padding =
    input.padding ?? EXECUTIVE_PRESENTATION_FOOTPRINT_POLICY.defaultPadding;
  return Object.freeze({
    objectId: input.objectId,
    center: Object.freeze({
      x: stabilize(input.center.x),
      y: stabilize(input.center.y),
    }),
    width: stabilize(input.footprint.width),
    height: stabilize(input.footprint.height),
    padding: stabilize(padding),
    region: input.region ?? "business-network",
    depthRole: input.depthRole ?? "standard",
  });
}

function territoryExtents(territory: ExecutivePresentationTerritory): {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
} {
  const halfW = territory.width / 2 + territory.padding;
  const halfH = territory.height / 2 + territory.padding;
  return {
    minX: territory.center.x - halfW,
    maxX: territory.center.x + halfW,
    minY: territory.center.y - halfH,
    maxY: territory.center.y + halfH,
  };
}

/**
 * Deterministic AABB intersection on the presentation plane.
 * Depth roles are intentionally ignored — overlapping territories fail
 * even when world.y differs (Hard Depth Invariant).
 */
export function executivePresentationTerritoriesIntersect(
  left: ExecutivePresentationTerritory,
  right: ExecutivePresentationTerritory,
): boolean {
  if (left.objectId === right.objectId) return false;
  const a = territoryExtents(left);
  const b = territoryExtents(right);
  return !(
    a.maxX <= b.minX ||
    a.minX >= b.maxX ||
    a.maxY <= b.minY ||
    a.minY >= b.maxY
  );
}

/**
 * Depth cannot satisfy territory collision. Even with different depth roles,
 * overlapping presentation territories remain a layout failure.
 */
export function depthCannotResolveTerritoryCollision(
  left: ExecutivePresentationTerritory,
  right: ExecutivePresentationTerritory,
): boolean {
  return executivePresentationTerritoriesIntersect(left, right);
}

// ─── Presentation → world mapping (SP:4.3B true-2D authority) ──────────────

export function resolveExecutivePresentationWorldOrigin(
  plane: ExecutivePresentationPlane = createExecutivePresentationPlane(),
): ExecutiveUsableStageWorldAnchor {
  const usable = resolveExecutiveUsableStageWorldAnchor();
  void plane;
  // {0,0} world XY is the usable Stage visual center; Z is render-plane constant.
  return Object.freeze({
    x: usable.x,
    y: usable.y,
    z: EXECUTIVE_RENDER_PLANE_Z,
  });
}

/**
 * Renderer-boundary mapping (sole active path for Stage node anchors):
 *   Executive2DPosition {x,y} → Three.js world with constant render-plane Z.
 * depthRole is ignored for position.
 */
export function mapExecutive2DPositionToRenderWorld(input: {
  readonly position: Executive2DPosition;
  readonly plane?: ExecutivePresentationPlane;
  readonly worldOrigin?: ExecutiveUsableStageWorldAnchor;
}): ExecutivePresentationWorldPosition {
  const plane = input.plane ?? createExecutivePresentationPlane();
  const clamped = clampExecutivePresentationPosition(input.position, plane);
  const origin = input.worldOrigin ?? resolveExecutivePresentationWorldOrigin(plane);
  return Object.freeze({
    x: stabilize(origin.x + clamped.x),
    y: stabilize(origin.y + clamped.y),
    z: EXECUTIVE_RENDER_PLANE_Z,
  });
}

/**
 * Compatibility wrapper — delegates to mapExecutive2DPositionToRenderWorld.
 * depthRole cannot change the result.
 */
export function mapExecutivePresentationPositionToWorld(input: {
  readonly position: ExecutivePresentationPosition;
  readonly depthRole?: ExecutivePresentationDepthRole;
  readonly plane?: ExecutivePresentationPlane;
  readonly worldOrigin?: ExecutiveUsableStageWorldAnchor;
}): ExecutivePresentationWorldPosition {
  void input.depthRole;
  return mapExecutive2DPositionToRenderWorld({
    position: input.position,
    plane: input.plane,
    worldOrigin: input.worldOrigin,
  });
}

export function mapExecutiveWorldPositionToPresentation(input: {
  readonly world:
    | ExecutivePresentationWorldPosition
    | readonly [number, number, number];
  readonly worldOrigin?: ExecutiveUsableStageWorldAnchor;
}): ExecutivePresentationPosition {
  const origin =
    input.worldOrigin ?? resolveExecutivePresentationWorldOrigin();
  if (Array.isArray(input.world)) {
    return createExecutivePresentationPosition(
      input.world[0] - origin.x,
      input.world[1] - origin.y,
    );
  }
  const world = input.world as ExecutivePresentationWorldPosition;
  return createExecutivePresentationPosition(
    world.x - origin.x,
    world.y - origin.y,
  );
}

export function resolveExecutivePresentationRenderingContract(input: {
  readonly composition: ExecutivePresentationCompositionContract;
  readonly plane?: ExecutivePresentationPlane;
}): ExecutivePresentationRenderingContract {
  const worldPosition = mapExecutivePresentationPositionToWorld({
    position: input.composition.presentationPosition,
    depthRole: input.composition.depthRole,
    plane: input.plane,
  });
  return Object.freeze({
    objectId: input.composition.objectId,
    worldPosition,
    compositionScale: input.composition.compositionScale,
    depthRole: input.composition.depthRole,
    depthOffset: 0,
  });
}

export function resolveExecutivePresentationCompositionContract(input: {
  readonly objectId: string;
  readonly presentationPosition: ExecutivePresentationPosition;
  readonly compositionScale: number;
  readonly objectKind?: string;
  readonly layoutRole?: ExecutivePresentationCompositionContract["layoutRole"];
  readonly visibility?: "visible" | "hidden";
  readonly prominence?: ExecutivePresentationCompositionContract["prominence"];
  readonly depthRole?: ExecutivePresentationDepthRole;
  readonly region?: ExecutivePresentationRegionId;
  readonly padding?: number;
  readonly plane?: ExecutivePresentationPlane;
}): ExecutivePresentationCompositionContract {
  const plane = input.plane ?? createExecutivePresentationPlane();
  const region = input.region ?? "business-network";
  const regions = resolveExecutivePresentationRegions(plane);
  const regionBounds = regions.find((entry) => entry.id === region);
  // Executive Thread (and collapsed-thread) must occupy their peripheral band —
  // never the Business Network / focus center, even when seed XY is near {0,0}.
  const positioned =
    region === "executive-thread" && regionBounds != null
      ? clampExecutivePresentationPositionToRegion(
          input.presentationPosition,
          regionBounds,
        )
      : clampExecutivePresentationPosition(input.presentationPosition, plane);
  const depthRole = input.depthRole ?? "standard";
  const footprint = resolveExecutivePresentationFootprint({
    objectKind: input.objectKind,
    compositionScale: input.compositionScale,
  });
  const territory = createExecutivePresentationTerritory({
    objectId: input.objectId,
    center: positioned,
    footprint,
    padding: input.padding,
    region,
    depthRole,
  });
  return Object.freeze({
    objectId: input.objectId,
    presentationPosition: positioned,
    layoutRole: input.layoutRole ?? "related",
    visibility: input.visibility ?? "visible",
    prominence: input.prominence ?? "standard",
    depthRole,
    region,
    territory,
    footprint,
    compositionScale: stabilize(input.compositionScale),
  });
}

/**
 * Effective rendered scale for presentation contracts — preserves SP:4.1C
 * Rendered-Bounds Truth correction (no minimumReadable inflation).
 */
export function resolveExecutivePresentationEffectiveRenderedScale(
  compositionScale: number,
  options?: { readonly focused?: boolean; readonly hovered?: boolean },
): number {
  return resolveExecutiveObjectScale({
    spatialRole: options?.focused ? "focus" : "related",
    focused: options?.focused === true,
    hovered: options?.hovered === true,
    compositionScale,
  });
}

export function worldTupleFromPresentationWorld(
  world: ExecutivePresentationWorldPosition,
): readonly [number, number, number] {
  return Object.freeze([world.x, world.y, world.z] as const);
}

export function verifyExecutivePresentationPlaneFoundation(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly planeAuthority: boolean;
  readonly depthNonStructural: boolean;
  readonly focusCenterCapable: boolean;
  readonly scaleAuthorityIntact: boolean;
  readonly deterministic: boolean;
  readonly noForceSimulation: boolean;
}> {
  const identity = getExecutivePresentationPlaneFoundationIdentity();
  const identityValid =
    identity.id === "SP:4.2/Executive25DStageFoundation" &&
    identity.version === "4.2.0" &&
    identity.namespace ===
      "nexora.spatial-presentation.executive-presentation-plane" &&
    identity.architecturalRole ===
      "PresentationOnlyExecutive25DStageFoundation";

  const plane = createExecutivePresentationPlane();
  const center = resolveExecutivePresentationFocusCenter(plane);
  const focusWorld = mapExecutivePresentationPositionToWorld({
    position: center,
    depthRole: "focus",
    plane,
  });
  const focusCenterCapable =
    center.x === plane.centerX &&
    center.y === plane.centerY &&
    Math.abs(focusWorld.x - (resolveExecutivePresentationWorldOrigin(plane).x + plane.centerX)) <
      1e-6 &&
    Math.abs(focusWorld.y - (resolveExecutivePresentationWorldOrigin(plane).y + plane.centerY)) <
      1e-6;

  const left = createExecutivePresentationTerritory({
    objectId: "a",
    center: createExecutivePresentationPosition(0, 0),
    footprint: resolveExecutivePresentationFootprint({
      compositionScale: 0.55,
      objectKind: "object",
    }),
    depthRole: "focus",
  });
  const right = createExecutivePresentationTerritory({
    objectId: "b",
    center: createExecutivePresentationPosition(0.02, 0.02),
    footprint: resolveExecutivePresentationFootprint({
      compositionScale: 0.55,
      objectKind: "object",
    }),
    depthRole: "background",
  });
  const depthNonStructural =
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.depthResolvesCollision === false &&
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usedZOnlyEscape === false &&
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.depthRolePositionEffect === 0 &&
    EXECUTIVE_PRESENTATION_DEPTH_OFFSETS.positionEffect === 0 &&
    depthCannotResolveTerritoryCollision(left, right) === true;

  const certified = 0.52;
  const rendered = resolveExecutivePresentationEffectiveRenderedScale(
    certified,
    { focused: true },
  );
  const scaleAuthorityIntact = Math.abs(certified - rendered) < 1e-9;

  const a = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(1.1, -0.4),
    depthRole: "standard",
    plane,
  });
  const b = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(1.1, -0.4),
    depthRole: "standard",
    plane,
  });
  const deterministic = JSON.stringify(a) === JSON.stringify(b);

  const planeAuthority =
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.presentationPlaneOwnsLayout ===
      true &&
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.renderingConsumesComposition === true;

  const noForceSimulation =
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usesForceSimulation === false &&
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usesPhysicsEngine === false &&
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usesPerFrameLayoutSolver === false;

  const ok =
    options?.forceFailure === true
      ? false
      : identityValid &&
        planeAuthority &&
        depthNonStructural &&
        focusCenterCapable &&
        scaleAuthorityIntact &&
        deterministic &&
        noForceSimulation;

  return Object.freeze({
    ok,
    identityValid,
    planeAuthority,
    depthNonStructural,
    focusCenterCapable,
    scaleAuthorityIntact,
    deterministic,
    noForceSimulation,
  });
}
