/**
 * STAGE-OBJ:1 — 3D Object on 2D Plane Foundation.
 *
 * Z may belong to object geometry, but never to object topology.
 *
 * Semantic position: { x, y, z: 0 }
 * Local geometry:    back ≈ 0 → front = +depth (toward camera at z=11)
 */

import type { ExecutiveObjectGeometryFamily } from "./executiveObjectVisualFoundation.ts";
import {
  isExecutiveObjectPresenceV2Enabled,
  resolveExecutiveObjectVisualIdentity,
} from "./executiveObjectPresenceIdentity.ts";
import {
  isExecutive3DObjectVisualEnabled,
  resolveExecutive3DObjectVisualProfile,
} from "./executive3DObjectVisualProfile.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObject3DGeometryIdentity =
  "STAGE-OBJ:1/ExecutiveObject3DGeometry" as const;

export const executiveObject3DGeometryVersion = "4.1.0" as const;

export const executiveObject3DGeometryNamespace =
  "nexora.spatial-presentation.executive-object-3d-geometry" as const;

export const executiveObject3DGeometryPhase =
  "ExecutiveObject3DOn2DPlaneFoundation" as const;

export const executiveObject3DGeometryArchitecturalRole =
  "PresentationOnlyObjectGeometryDepth" as const;

export type ExecutiveObject3DGeometryIdentity = {
  readonly id: typeof executiveObject3DGeometryIdentity;
  readonly version: typeof executiveObject3DGeometryVersion;
  readonly namespace: typeof executiveObject3DGeometryNamespace;
  readonly phase: typeof executiveObject3DGeometryPhase;
  readonly architecturalRole: typeof executiveObject3DGeometryArchitecturalRole;
};

const IDENTITY: ExecutiveObject3DGeometryIdentity = Object.freeze({
  id: executiveObject3DGeometryIdentity,
  version: executiveObject3DGeometryVersion,
  namespace: executiveObject3DGeometryNamespace,
  phase: executiveObject3DGeometryPhase,
  architecturalRole: executiveObject3DGeometryArchitecturalRole,
});

export function getExecutiveObject3DGeometryIdentity(): ExecutiveObject3DGeometryIdentity {
  return IDENTITY;
}

export type ExecutiveStageSpatialLayer =
  | "semantic-plane"
  | "object-geometry"
  | "visual-depth-environment";

export type ExecutiveObject3DPresentationLevel =
  | "minimum"
  | "report"
  | "operation";

export type ExecutiveObject3DShape =
  | "rounded-slab"
  | "rect-slab"
  | "disc-slab"
  | "hex-slab"
  | "diamond-slab"
  | "soft-plate";

export type ExecutiveObject3DGeometryProfile = {
  readonly enabled: boolean;
  readonly shape: ExecutiveObject3DShape;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly bevel: number;
  /** Local Z of back/base (on semantic plane). */
  readonly backZ: 0;
  /** Local Z of front face (toward camera). */
  readonly frontZ: number;
  /** Mesh center Z so back sits on z=0. */
  readonly centerZ: number;
  readonly materialRole: "executive-standard" | "executive-3dobj-visual";
  readonly spatialLayer: "object-geometry";
  readonly silhouettePad: number;
  /** STAGE-3DOBJ:1 — presentation-only visual enrichment active. */
  readonly visualFoundation: boolean;
  readonly frontFaceInset: number;
  readonly edgeRadius: number;
};

export const EXECUTIVE_OBJECT_3D_GEOMETRY_BOUNDARY = Object.freeze({
  architecturalRole: executiveObject3DGeometryArchitecturalRole,
  changesSemanticZ: false as const,
  usesZForTopology: false as const,
  usesZForCollision: false as const,
  usesZForFocus: false as const,
  attentionChangesDepth: false as const,
  movesCamera: false as const,
  inventsRelationships: false as const,
  /** Geometry extends toward camera (+Z); back rests on semantic plane. */
  geometryOrigin: "back-on-plane-front-toward-camera" as const,
});

/**
 * Hard cap — no object type may exceed silently.
 * Calibrated vs camera distance 11 so depth reads as object volume, not displacement.
 */
export const MAX_EXECUTIVE_OBJECT_GEOMETRY_DEPTH = 0.36;

/** Presentation-level body depth (appearance only). */
export const EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL = Object.freeze({
  minimum: 0.14,
  report: 0.22,
  operation: 0.3,
});

/** Extra XY half-extent for projected 3D silhouette in hard separation. */
export const EXECUTIVE_OBJECT_3D_SILHOUETTE_PAD_BY_LEVEL = Object.freeze({
  minimum: 0.05,
  report: 0.07,
  operation: 0.09,
});

export const EXECUTIVE_OBJECT_3D_OBSERVABILITY = Object.freeze({
  contract: "stage-obj-1" as const,
});

/** Dev/test toggle — not production UI. */
let object3DGeometryEnabled = true;

export function setExecutiveObject3DGeometryEnabled(enabled: boolean): void {
  object3DGeometryEnabled = enabled === true;
}

function readObject3DQueryOverride(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const flag =
      params.get("obj3d") ??
      params.get("object3d") ??
      params.get("stageObj3d");
    if (flag === "0" || flag === "off" || flag === "false") return false;
    if (flag === "1" || flag === "on" || flag === "true") return true;
  } catch {
    return null;
  }
  return null;
}

export function isExecutiveObject3DGeometryEnabled(): boolean {
  const query = readObject3DQueryOverride();
  if (query != null) return query;
  if (typeof process !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_NEXORA_STAGE_OBJ_3D;
    if (fromEnv === "0" || fromEnv === "false" || fromEnv === "off") {
      return false;
    }
    if (fromEnv === "1" || fromEnv === "true" || fromEnv === "on") {
      return true;
    }
  }
  return object3DGeometryEnabled;
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function clampDepth(depth: number): number {
  if (!Number.isFinite(depth) || depth <= 0) {
    return EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL.minimum;
  }
  return Math.min(depth, MAX_EXECUTIVE_OBJECT_GEOMETRY_DEPTH);
}

function shapeForFamily(
  family: ExecutiveObjectGeometryFamily,
  objectKind?: string,
): ExecutiveObject3DShape {
  // STAGE-OBJ:2 — semantic silhouette grammar when presence is enabled.
  if (isExecutiveObjectPresenceV2Enabled()) {
    return resolveExecutiveObjectVisualIdentity({
      objectKind,
      presentationLevel: "minimum",
    }).geometryShape;
  }
  const kind = (objectKind ?? "").toLowerCase();
  if (kind.includes("risk") || kind.includes("decision")) {
    return kind.includes("risk") ? "diamond-slab" : "hex-slab";
  }
  if (kind.includes("goal") || kind.includes("scenario")) {
    return kind.includes("goal") ? "disc-slab" : "soft-plate";
  }
  switch (family) {
    case "cylindrical":
      return "disc-slab";
    case "orbital":
      return "disc-slab";
    case "rounded":
      return "rounded-slab";
    case "planar":
      return "soft-plate";
    case "block":
    default:
      return "rect-slab";
  }
}

/**
 * Canonical STAGE-OBJ:1 geometry-profile resolver.
 * STAGE-OBJ:2 presence grows XY mass when enabled; depth stays STAGE-OBJ:1
 * unless STAGE-3DOBJ:1 visual foundation is ON (appearance depth only).
 * Appearance only — no position / relationship / attention depth coupling.
 */
export function resolveExecutiveObject3DGeometryProfile(input: {
  readonly objectKind?: string;
  readonly geometryFamily?: ExecutiveObjectGeometryFamily;
  readonly presentationLevel?: ExecutiveObject3DPresentationLevel;
  readonly width?: number;
  readonly height?: number;
  readonly enabled?: boolean;
  readonly interactionState?:
    | "overview"
    | "focused"
    | "selected"
    | "related"
    | "secondary"
    | "background";
  readonly executiveState?:
    | "normal"
    | "watch"
    | "critical"
    | "recommended"
    | "unresolved";
}): ExecutiveObject3DGeometryProfile {
  const enabled = input.enabled ?? isExecutiveObject3DGeometryEnabled();
  const level = input.presentationLevel ?? "minimum";
  const family = input.geometryFamily ?? "block";
  const presenceOn = isExecutiveObjectPresenceV2Enabled();
  const visualOn = isExecutive3DObjectVisualEnabled();

  let width: number;
  let height: number;
  let shape: ExecutiveObject3DShape;
  let silhouettePad: number;

  if (presenceOn) {
    const identity = resolveExecutiveObjectVisualIdentity({
      objectKind: input.objectKind,
      presentationLevel: level,
      interactionState: input.interactionState ?? "overview",
      executiveState: input.executiveState ?? "normal",
    });
    width = stabilize(identity.presence.width * identity.bodyScale);
    height = stabilize(identity.presence.height * identity.bodyScale);
    shape = identity.geometryShape;
    silhouettePad = enabled
      ? stabilize(
          EXECUTIVE_OBJECT_3D_SILHOUETTE_PAD_BY_LEVEL[level] +
            (identity.territoryCollision === "hard-footprint"
              ? Math.max(0, identity.territoryOuter - Math.max(width, height) * 0.5)
              : 0),
        )
      : 0;
  } else {
    // STAGE-OBJ:1 legacy shrink (Presence V1 compare path).
    width = stabilize((input.width ?? 0.72) * 0.72);
    height = stabilize((input.height ?? 0.72) * 0.72);
    shape = shapeForFamily(family, input.objectKind);
    silhouettePad = enabled
      ? EXECUTIVE_OBJECT_3D_SILHOUETTE_PAD_BY_LEVEL[level]
      : 0;
  }

  // STAGE-3DOBJ:1 — premium visual depth/bevel/aspect when toggle ON.
  if (enabled && visualOn) {
    const visual = resolveExecutive3DObjectVisualProfile({
      objectKind: input.objectKind,
      presentationLevel: level,
      interactionState: input.interactionState ?? "overview",
      executiveState: input.executiveState ?? "normal",
      width,
      height,
      enabled: true,
    });
    return Object.freeze({
      enabled,
      shape: visual.shape,
      width: visual.width,
      height: visual.height,
      depth: visual.depth,
      bevel: visual.bevel,
      backZ: 0 as const,
      frontZ: visual.frontZ,
      centerZ: visual.centerZ,
      materialRole: "executive-3dobj-visual" as const,
      spatialLayer: "object-geometry" as const,
      silhouettePad: stabilize(silhouettePad + visual.silhouetteBoost),
      visualFoundation: true,
      frontFaceInset: visual.frontFaceInset,
      edgeRadius: visual.edgeRadius,
    });
  }

  const depth = enabled
    ? clampDepth(EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL[level])
    : 0;
  const bevel = enabled
    ? stabilize(
        Math.min(
          presenceOn ? 0.055 : 0.04,
          depth * 0.22,
          Math.min(width, height) * (presenceOn ? 0.1 : 0.08),
        ),
      )
    : 0;

  return Object.freeze({
    enabled,
    shape,
    width,
    height,
    depth,
    bevel,
    backZ: 0 as const,
    frontZ: stabilize(depth),
    centerZ: stabilize(depth * 0.5),
    materialRole: "executive-standard" as const,
    spatialLayer: "object-geometry" as const,
    silhouettePad,
    visualFoundation: false,
    frontFaceInset: 0,
    edgeRadius: bevel,
  });
}

export function resolveExecutiveObject3DSilhouetteHalfExtent(input: {
  readonly baseHalfExtent: number;
  readonly presentationLevel?: ExecutiveObject3DPresentationLevel;
  readonly enabled?: boolean;
}): number {
  const enabled = input.enabled ?? isExecutiveObject3DGeometryEnabled();
  if (!enabled) return input.baseHalfExtent;
  const level = input.presentationLevel ?? "minimum";
  return stabilize(
    input.baseHalfExtent + EXECUTIVE_OBJECT_3D_SILHOUETTE_PAD_BY_LEVEL[level],
  );
}

export function getExecutiveObject3DGeometryObservability(input?: {
  readonly enabled?: boolean;
  readonly sampleDepth?: number;
}): Readonly<{
  readonly contract: string;
  readonly objectGeometry: string;
  readonly enabled: string;
  readonly maxDepth: string;
  readonly sampleDepth: string;
  readonly geometryOrigin: string;
  readonly semanticZ: string;
}> {
  const enabled = input?.enabled ?? isExecutiveObject3DGeometryEnabled();
  return Object.freeze({
    contract: EXECUTIVE_OBJECT_3D_OBSERVABILITY.contract,
    objectGeometry: enabled ? "3d-slab" : "planar",
    enabled: enabled ? "true" : "false",
    maxDepth: String(MAX_EXECUTIVE_OBJECT_GEOMETRY_DEPTH),
    sampleDepth: String(
      input?.sampleDepth ??
        (enabled ? EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL.minimum : 0),
    ),
    geometryOrigin: EXECUTIVE_OBJECT_3D_GEOMETRY_BOUNDARY.geometryOrigin,
    semanticZ: "0",
  });
}

export function verifyExecutiveObject3DGeometry(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly depthCapped: boolean;
  readonly semanticZSafe: boolean;
}> {
  const identity = getExecutiveObject3DGeometryIdentity();
  const identityValid =
    identity.id === "STAGE-OBJ:1/ExecutiveObject3DGeometry" &&
    identity.version === "4.1.0";
  const depths = Object.values(EXECUTIVE_OBJECT_3D_DEPTH_BY_LEVEL);
  const depthCapped = depths.every(
    (depth) => depth > 0 && depth <= MAX_EXECUTIVE_OBJECT_GEOMETRY_DEPTH,
  );
  return Object.freeze({
    ok:
      identityValid &&
      depthCapped &&
      EXECUTIVE_OBJECT_3D_GEOMETRY_BOUNDARY.changesSemanticZ === false &&
      EXECUTIVE_OBJECT_3D_GEOMETRY_BOUNDARY.usesZForTopology === false,
    identityValid,
    depthCapped,
    semanticZSafe:
      EXECUTIVE_OBJECT_3D_GEOMETRY_BOUNDARY.changesSemanticZ === false,
  });
}
