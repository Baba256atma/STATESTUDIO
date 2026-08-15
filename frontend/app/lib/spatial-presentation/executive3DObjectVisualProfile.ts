/**
 * STAGE-3DOBJ:1 — Executive 3D Object Visual Foundation.
 *
 * Stage truth stays flat. Object appearance may be volumetric.
 *
 * CAMERA → [3D NexoraObject local +Z] → semantic plane z=0 → Deep-Z z<0
 *
 * Presentation only — no topology, relationships, camera, or label authority.
 */

import type { ExecutiveObject3DShape } from "./executiveObject3DGeometry.ts";
import {
  resolveExecutiveObjectGeometryShapeForFamily,
  resolveExecutiveObjectSemanticShapeFamily,
  type ExecutiveObjectSemanticShapeFamily,
} from "./executiveObjectPresenceIdentity.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executive3DObjectVisualIdentity =
  "STAGE-3DOBJ:1/Executive3DObjectVisualFoundation" as const;

export const executive3DObjectVisualVersion = "1.0.0" as const;

export const executive3DObjectVisualNamespace =
  "nexora.spatial-presentation.executive-3d-object-visual" as const;

export const executive3DObjectVisualPhase =
  "Executive3DObjectVisualFoundation" as const;

export const executive3DObjectVisualArchitecturalRole =
  "PresentationOnlyExecutive3DObjectAppearance" as const;

export type Executive3DObjectVisualIdentity = {
  readonly id: typeof executive3DObjectVisualIdentity;
  readonly version: typeof executive3DObjectVisualVersion;
  readonly namespace: typeof executive3DObjectVisualNamespace;
  readonly phase: typeof executive3DObjectVisualPhase;
  readonly architecturalRole: typeof executive3DObjectVisualArchitecturalRole;
};

const IDENTITY: Executive3DObjectVisualIdentity = Object.freeze({
  id: executive3DObjectVisualIdentity,
  version: executive3DObjectVisualVersion,
  namespace: executive3DObjectVisualNamespace,
  phase: executive3DObjectVisualPhase,
  architecturalRole: executive3DObjectVisualArchitecturalRole,
});

export function getExecutive3DObjectVisualIdentity(): Executive3DObjectVisualIdentity {
  return IDENTITY;
}

export const EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY = Object.freeze({
  architecturalRole: executive3DObjectVisualArchitecturalRole,
  changesSemanticZ: false as const,
  usesZForTopology: false as const,
  usesZForCollision: false as const,
  stateChangesDepth: false as const,
  focusCreatesDuplicateBody: false as const,
  selectionCreatesDuplicateBody: false as const,
  movesCamera: false as const,
  inventsRelationships: false as const,
  ownsLabels: false as const,
  geometryOrigin: "back-on-plane-front-toward-camera" as const,
});

export type Executive3DObjectPresentationLevel =
  | "minimum"
  | "report"
  | "operation";

export type Executive3DObjectInteractionState =
  | "overview"
  | "focused"
  | "selected"
  | "related"
  | "secondary"
  | "background";

export type Executive3DObjectExecutiveState =
  | "normal"
  | "watch"
  | "critical"
  | "recommended"
  | "unresolved";

/** Semantic silhouette families — distinguishable labels-off. */
export type Executive3DObjectShapeFamily =
  | "business-object"
  | "goal"
  | "problem"
  | "risk"
  | "scenario"
  | "decision"
  | "execution"
  | "context";

export type Executive3DObjectVisualShape =
  | "rounded-executive-slab"
  | "target-puck"
  | "angular-block"
  | "beveled-diamond"
  | "soft-hex-plate"
  | "decisive-hex"
  | "operational-slab"
  | "subordinate-plate";

export type Executive3DObjectMaterialRole =
  | "nexora-business"
  | "nexora-goal"
  | "nexora-problem"
  | "nexora-risk"
  | "nexora-scenario"
  | "nexora-decision"
  | "nexora-execution"
  | "nexora-context";

export type Executive3DObjectEdgeRole =
  | "quiet"
  | "restrained"
  | "emphasized"
  | "critical"
  | "watch"
  | "recommended"
  | "selected"
  | "focused";

export type Executive3DObjectSideFaceRole =
  | "recessed"
  | "standard"
  | "muted";

export type Executive3DObjectFrontFaceRole =
  | "dominant"
  | "elevated"
  | "subdued"
  | "incomplete"
  | "attention";

export type Executive3DObjectVisualProfile = {
  readonly enabled: boolean;
  readonly contract: "stage-3dobj-1";
  readonly shapeFamily: Executive3DObjectShapeFamily;
  readonly visualShape: Executive3DObjectVisualShape;
  /** Maps to STAGE-OBJ:1 mesh shape token. */
  readonly shape: ExecutiveObject3DShape;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly bevel: number;
  readonly edgeRadius: number;
  readonly frontFaceInset: number;
  readonly materialRole: Executive3DObjectMaterialRole;
  readonly edgeRole: Executive3DObjectEdgeRole;
  readonly sideFaceRole: Executive3DObjectSideFaceRole;
  readonly frontFaceRole: Executive3DObjectFrontFaceRole;
  readonly backZ: 0;
  readonly frontZ: number;
  readonly centerZ: number;
  readonly rotationX: 0;
  readonly rotationY: 0;
  /** Diamond semantic orientation only. */
  readonly rotationZ: number;
  readonly frontFaceContrast: number;
  readonly sideFaceDarken: number;
  readonly emissiveCue: number;
  readonly contactShadowOpacity: number;
  readonly silhouetteBoost: number;
  readonly labelAnchorHint: "front-center";
  readonly frontFaceBounds: Readonly<{
    readonly width: number;
    readonly height: number;
  }>;
  readonly silhouetteBounds: Readonly<{
    readonly halfExtentX: number;
    readonly halfExtentY: number;
  }>;
  readonly layers: Readonly<{
    readonly body: true;
    readonly frontFace: boolean;
    readonly contactCue: boolean;
  }>;
};

/** Restrained depth bands — never large cubes. */
export const EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL = Object.freeze({
  minimum: 0.18,
  report: 0.26,
  operation: 0.32,
} as const);

export const MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH = 0.4;

/** Kind depth multipliers — Context stays subordinate; Scenario softer plate. */
export const EXECUTIVE_3D_OBJECT_DEPTH_FACTOR_BY_FAMILY = Object.freeze({
  "business-object": 1,
  goal: 0.92,
  problem: 1,
  risk: 0.95,
  scenario: 0.72,
  decision: 1,
  execution: 0.88,
  context: 0.48,
} as const);

export const EXECUTIVE_3D_OBJECT_BEVEL_BY_FAMILY = Object.freeze({
  "business-object": 0.048,
  goal: 0.055,
  problem: 0.012,
  risk: 0.028,
  scenario: 0.038,
  decision: 0.03,
  execution: 0.036,
  context: 0.01,
} as const);

export const EXECUTIVE_3D_OBJECT_FRONT_INSET_BY_LEVEL = Object.freeze({
  minimum: 0.012,
  report: 0.016,
  operation: 0.02,
} as const);

export const EXECUTIVE_3D_OBJECT_SILHOUETTE_BOOST_BY_LEVEL = Object.freeze({
  minimum: 0.03,
  report: 0.04,
  operation: 0.05,
} as const);

export const EXECUTIVE_3D_OBJECT_VISUAL_OBSERVABILITY = Object.freeze({
  contract: "stage-3dobj-1" as const,
});

/** Dev/test toggle — ?obj3dVisual=0|1 */
let object3DVisualEnabled = true;

export function setExecutive3DObjectVisualEnabled(enabled: boolean): void {
  object3DVisualEnabled = enabled === true;
}

function readObject3DVisualQueryOverride(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const flag =
      params.get("obj3dVisual") ??
      params.get("object3dVisual") ??
      params.get("stage3dobj");
    if (flag === "0" || flag === "off" || flag === "false") return false;
    if (flag === "1" || flag === "on" || flag === "true") return true;
  } catch {
    return null;
  }
  return null;
}

export function isExecutive3DObjectVisualEnabled(): boolean {
  const query = readObject3DVisualQueryOverride();
  if (query != null) return query;
  if (typeof process !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_NEXORA_STAGE_3DOBJ_VISUAL;
    if (fromEnv === "0" || fromEnv === "false" || fromEnv === "off") {
      return false;
    }
    if (fromEnv === "1" || fromEnv === "true" || fromEnv === "on") {
      return true;
    }
  }
  return object3DVisualEnabled;
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function clampVisualDepth(depth: number): number {
  if (!Number.isFinite(depth) || depth <= 0) {
    return EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL.minimum;
  }
  return Math.min(depth, MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH);
}

export function mapSemanticFamilyToVisualShapeFamily(
  family: ExecutiveObjectSemanticShapeFamily,
): Executive3DObjectShapeFamily {
  return family;
}

export function resolveExecutive3DObjectVisualShape(
  family: Executive3DObjectShapeFamily,
): Executive3DObjectVisualShape {
  switch (family) {
    case "goal":
      return "target-puck";
    case "problem":
      return "angular-block";
    case "risk":
      return "beveled-diamond";
    case "scenario":
      return "soft-hex-plate";
    case "decision":
      return "decisive-hex";
    case "execution":
      return "operational-slab";
    case "context":
      return "subordinate-plate";
    case "business-object":
    default:
      return "rounded-executive-slab";
  }
}

export function resolveExecutive3DObjectMaterialRole(
  family: Executive3DObjectShapeFamily,
): Executive3DObjectMaterialRole {
  switch (family) {
    case "goal":
      return "nexora-goal";
    case "problem":
      return "nexora-problem";
    case "risk":
      return "nexora-risk";
    case "scenario":
      return "nexora-scenario";
    case "decision":
      return "nexora-decision";
    case "execution":
      return "nexora-execution";
    case "context":
      return "nexora-context";
    case "business-object":
    default:
      return "nexora-business";
  }
}

/** Aspect DNA — execution elongated; context compact; problem angular. */
function familyAspect(
  family: Executive3DObjectShapeFamily,
): Readonly<{ width: number; height: number }> {
  switch (family) {
    case "problem":
      return { width: 1.02, height: 0.78 };
    case "risk":
      return { width: 0.96, height: 0.96 };
    case "scenario":
      return { width: 1.04, height: 0.9 };
    case "decision":
      return { width: 1, height: 1 };
    case "execution":
      return { width: 1.18, height: 0.7 };
    case "goal":
      return { width: 1, height: 1 };
    case "context":
      return { width: 0.92, height: 0.72 };
    case "business-object":
    default:
      return { width: 1, height: 1 };
  }
}

function resolveEdgeRole(input: {
  readonly interaction: Executive3DObjectInteractionState;
  readonly executiveState: Executive3DObjectExecutiveState;
}): Executive3DObjectEdgeRole {
  if (input.interaction === "focused") return "focused";
  if (input.interaction === "selected") return "selected";
  if (input.executiveState === "critical") return "critical";
  if (input.executiveState === "watch") return "watch";
  if (input.executiveState === "recommended") return "recommended";
  if (
    input.interaction === "secondary" ||
    input.interaction === "background"
  ) {
    return "quiet";
  }
  return "restrained";
}

function resolveFrontFaceRole(input: {
  readonly interaction: Executive3DObjectInteractionState;
  readonly executiveState: Executive3DObjectExecutiveState;
}): Executive3DObjectFrontFaceRole {
  if (input.executiveState === "unresolved") return "incomplete";
  if (
    input.executiveState === "critical" ||
    input.executiveState === "watch"
  ) {
    return "attention";
  }
  if (input.interaction === "focused") return "elevated";
  if (
    input.interaction === "secondary" ||
    input.interaction === "background"
  ) {
    return "subdued";
  }
  return "dominant";
}

/**
 * Canonical STAGE-3DOBJ:1 visual-profile resolver.
 * Appearance only — never topology / relationships / semantic Z / labels.
 */
export function resolveExecutive3DObjectVisualProfile(input: {
  readonly objectKind?: string | null;
  readonly presentationLevel?: Executive3DObjectPresentationLevel;
  readonly interactionState?: Executive3DObjectInteractionState;
  readonly executiveState?: Executive3DObjectExecutiveState;
  readonly width?: number;
  readonly height?: number;
  readonly enabled?: boolean;
}): Executive3DObjectVisualProfile {
  const enabled = input.enabled ?? isExecutive3DObjectVisualEnabled();
  const level = input.presentationLevel ?? "minimum";
  const interaction = input.interactionState ?? "overview";
  const executiveState = input.executiveState ?? "normal";

  const semanticFamily = resolveExecutiveObjectSemanticShapeFamily(
    input.objectKind,
  );
  const shapeFamily = mapSemanticFamilyToVisualShapeFamily(semanticFamily);
  const visualShape = resolveExecutive3DObjectVisualShape(shapeFamily);
  const shape = resolveExecutiveObjectGeometryShapeForFamily(semanticFamily);
  const aspect = familyAspect(shapeFamily);

  const baseW = input.width ?? 1.05;
  const baseH = input.height ?? 1.05;
  // When callers pass explicit XY (Presence / geometry compose), preserve them.
  // Standalone kind-only resolves apply family aspect DNA.
  const width =
    input.width != null
      ? stabilize(baseW)
      : stabilize(baseW * aspect.width);
  const height =
    input.height != null
      ? stabilize(baseH)
      : stabilize(baseH * aspect.height);

  const depthFactor = EXECUTIVE_3D_OBJECT_DEPTH_FACTOR_BY_FAMILY[shapeFamily];
  const depth = enabled
    ? stabilize(
        clampVisualDepth(
          EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL[level] * depthFactor,
        ),
      )
    : 0;

  const bevelBase = EXECUTIVE_3D_OBJECT_BEVEL_BY_FAMILY[shapeFamily];
  const bevel = enabled
    ? stabilize(
        Math.min(
          bevelBase * (level === "operation" ? 1.08 : level === "report" ? 1.04 : 1),
          depth * 0.28,
          Math.min(width, height) * 0.12,
        ),
      )
    : 0;

  const frontFaceInset = enabled
    ? stabilize(
        Math.min(
          EXECUTIVE_3D_OBJECT_FRONT_INSET_BY_LEVEL[level],
          depth * 0.22,
        ),
      )
    : 0;

  const edgeRole = resolveEdgeRole({ interaction, executiveState });
  const frontFaceRole = resolveFrontFaceRole({ interaction, executiveState });

  // State/focus never change depth — appearance cues only.
  let frontFaceContrast = 1.08;
  let sideFaceDarken = 0.82;
  let emissiveCue = 0.04;
  if (frontFaceRole === "elevated") {
    frontFaceContrast = 1.14;
    emissiveCue = 0.08;
  } else if (frontFaceRole === "attention") {
    frontFaceContrast = 1.1;
    emissiveCue = executiveState === "critical" ? 0.12 : 0.09;
  } else if (frontFaceRole === "incomplete") {
    frontFaceContrast = 0.92;
    emissiveCue = 0.02;
  } else if (frontFaceRole === "subdued") {
    frontFaceContrast = 1.02;
    sideFaceDarken = 0.78;
    emissiveCue = 0.02;
  }

  if (edgeRole === "focused") emissiveCue = Math.max(emissiveCue, 0.1);
  if (edgeRole === "critical") emissiveCue = Math.max(emissiveCue, 0.11);
  if (edgeRole === "watch") emissiveCue = Math.max(emissiveCue, 0.08);
  if (edgeRole === "recommended") emissiveCue = Math.max(emissiveCue, 0.07);

  const rotationZ = shape === "diamond-slab" ? Math.PI / 4 : 0;
  const diamondBoost = shape === "diamond-slab" ? 0.08 : 0;
  const elongatedBoost =
    shapeFamily === "execution" ? 0.04 : shapeFamily === "scenario" ? 0.02 : 0;
  const silhouetteBoost = enabled
    ? stabilize(
        EXECUTIVE_3D_OBJECT_SILHOUETTE_BOOST_BY_LEVEL[level] +
          diamondBoost +
          elongatedBoost,
      )
    : 0;

  const halfX = stabilize(width * 0.5 * (shape === "diamond-slab" ? Math.SQRT2 : 1));
  const halfY = stabilize(height * 0.5 * (shape === "diamond-slab" ? Math.SQRT2 : 1));

  return Object.freeze({
    enabled,
    contract: "stage-3dobj-1",
    shapeFamily,
    visualShape,
    shape,
    width,
    height,
    depth,
    bevel,
    edgeRadius: bevel,
    frontFaceInset,
    materialRole: resolveExecutive3DObjectMaterialRole(shapeFamily),
    edgeRole,
    sideFaceRole:
      shapeFamily === "context"
        ? "muted"
        : frontFaceRole === "subdued"
          ? "muted"
          : "recessed",
    frontFaceRole,
    backZ: 0 as const,
    frontZ: stabilize(depth),
    centerZ: stabilize(depth * 0.5),
    rotationX: 0 as const,
    rotationY: 0 as const,
    rotationZ,
    frontFaceContrast,
    sideFaceDarken,
    emissiveCue,
    contactShadowOpacity: enabled && shapeFamily !== "context" ? 0.07 : 0,
    silhouetteBoost,
    labelAnchorHint: "front-center",
    frontFaceBounds: Object.freeze({
      width: stabilize(width * 0.88),
      height: stabilize(height * 0.88),
    }),
    silhouetteBounds: Object.freeze({
      halfExtentX: halfX,
      halfExtentY: halfY,
    }),
    layers: Object.freeze({
      body: true as const,
      frontFace: enabled && depth >= 0.12,
      contactCue: enabled && shapeFamily !== "context",
    }),
  });
}

export function resolveExecutive3DObjectVisualSilhouetteBoost(input: {
  readonly presentationLevel?: Executive3DObjectPresentationLevel;
  readonly objectKind?: string | null;
  readonly enabled?: boolean;
}): number {
  const enabled = input.enabled ?? isExecutive3DObjectVisualEnabled();
  if (!enabled) return 0;
  const profile = resolveExecutive3DObjectVisualProfile({
    objectKind: input.objectKind,
    presentationLevel: input.presentationLevel,
    enabled: true,
  });
  return profile.silhouetteBoost;
}

export function getExecutive3DObjectVisualObservability(input?: {
  readonly enabled?: boolean;
  readonly objectKind?: string | null;
  readonly presentationLevel?: Executive3DObjectPresentationLevel;
}): Readonly<{
  readonly contract: string;
  readonly enabled: string;
  readonly kind: string;
  readonly depth: string;
  readonly bevel: string;
  readonly profile: string;
  readonly materialRole: string;
  readonly frontZ: string;
  readonly backZ: string;
}> {
  const enabled = input?.enabled ?? isExecutive3DObjectVisualEnabled();
  const profile = resolveExecutive3DObjectVisualProfile({
    objectKind: input?.objectKind ?? "object",
    presentationLevel: input?.presentationLevel ?? "minimum",
    enabled,
  });
  return Object.freeze({
    contract: EXECUTIVE_3D_OBJECT_VISUAL_OBSERVABILITY.contract,
    enabled: enabled ? "true" : "false",
    kind: profile.shapeFamily,
    depth: String(profile.depth),
    bevel: String(profile.bevel),
    profile: profile.visualShape,
    materialRole: profile.materialRole,
    frontZ: String(profile.frontZ),
    backZ: String(profile.backZ),
  });
}

export function verifyExecutive3DObjectVisualFoundation(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly depthCapped: boolean;
  readonly semanticZSafe: boolean;
  readonly stateDoesNotChangeDepth: boolean;
  readonly familiesDistinct: boolean;
}> {
  const identity = getExecutive3DObjectVisualIdentity();
  const identityValid =
    identity.id === "STAGE-3DOBJ:1/Executive3DObjectVisualFoundation" &&
    identity.version === "1.0.0";

  const depths = Object.values(EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL);
  const depthCapped = depths.every(
    (d) => d > 0 && d <= MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH,
  );

  const normal = resolveExecutive3DObjectVisualProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    executiveState: "normal",
    enabled: true,
  });
  const critical = resolveExecutive3DObjectVisualProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    executiveState: "critical",
    enabled: true,
  });
  const focused = resolveExecutive3DObjectVisualProfile({
    objectKind: "object",
    presentationLevel: "minimum",
    interactionState: "focused",
    enabled: true,
  });
  const stateDoesNotChangeDepth =
    normal.depth === critical.depth && normal.depth === focused.depth;

  const shapes = [
    "object",
    "goal",
    "problem",
    "risk",
    "scenario",
    "decision",
    "execution",
    "context",
  ].map(
    (kind) =>
      resolveExecutive3DObjectVisualProfile({
        objectKind: kind,
        enabled: true,
      }).visualShape,
  );
  const familiesDistinct = new Set(shapes).size === shapes.length;

  return Object.freeze({
    ok:
      identityValid &&
      depthCapped &&
      stateDoesNotChangeDepth &&
      familiesDistinct &&
      EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.changesSemanticZ === false &&
      EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.usesZForTopology === false &&
      EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.ownsLabels === false,
    identityValid,
    depthCapped,
    semanticZSafe:
      EXECUTIVE_3D_OBJECT_VISUAL_BOUNDARY.changesSemanticZ === false,
    stateDoesNotChangeDepth,
    familiesDistinct,
  });
}
