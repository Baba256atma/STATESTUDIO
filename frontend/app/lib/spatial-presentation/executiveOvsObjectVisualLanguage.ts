/**
 * NPA-T OVS:1 — Executive 3D Object Visual Language.
 *
 * Presentation only. Consumes existing kind cues (SP:2.2 / STAGE-OBJ:2).
 * Does not own identity, selection, Theatre, camera, motion, or state.
 *
 * Geometry + silhouette + label identify category. Color stays supporting.
 */

import { resolveExecutiveObjectSemanticShapeFamily } from "./executiveObjectPresenceIdentity.ts";

export const executiveOvsObjectVisualLanguageIdentity =
  "NPA-T OVS:1/Executive3DObjectVisualLanguage" as const;

export const executiveOvsObjectVisualLanguageVersion = "1.0.0" as const;

export const executiveOvsObjectVisualLanguageNamespace =
  "nexora.spatial-presentation.ovs-executive-object-visual-language" as const;

export const executiveOvsObjectVisualLanguagePhase =
  "Executive3DObjectVisualLanguage" as const;

export const executiveOvsObjectVisualLanguageArchitecturalRole =
  "PresentationOnlyExecutiveObjectGeometryLanguage" as const;

export type ExecutiveOvsObjectVisualLanguageIdentity = {
  readonly id: typeof executiveOvsObjectVisualLanguageIdentity;
  readonly version: typeof executiveOvsObjectVisualLanguageVersion;
  readonly namespace: typeof executiveOvsObjectVisualLanguageNamespace;
  readonly phase: typeof executiveOvsObjectVisualLanguagePhase;
  readonly architecturalRole: typeof executiveOvsObjectVisualLanguageArchitecturalRole;
};

const IDENTITY: ExecutiveOvsObjectVisualLanguageIdentity = Object.freeze({
  id: executiveOvsObjectVisualLanguageIdentity,
  version: executiveOvsObjectVisualLanguageVersion,
  namespace: executiveOvsObjectVisualLanguageNamespace,
  phase: executiveOvsObjectVisualLanguagePhase,
  architecturalRole: executiveOvsObjectVisualLanguageArchitecturalRole,
});

export function getExecutiveOvsObjectVisualLanguageIdentity(): ExecutiveOvsObjectVisualLanguageIdentity {
  return IDENTITY;
}

export const EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY = Object.freeze({
  architecturalRole: executiveOvsObjectVisualLanguageArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsObjectCatalog: false as const,
  ownsSelection: false as const,
  ownsFocus: false as const,
  ownsDisclosure: false as const,
  ownsRelationships: false as const,
  ownsCamera: false as const,
  ownsMotion: false as const,
  ownsTheatre: false as const,
  ownsDirector: false as const,
  changesSemanticZ: false as const,
  introducesSecondCanvas: false as const,
  introducesCss3dBodies: false as const,
  inventsBusinessStates: false as const,
  encodesCategoryInColorAlone: false as const,
  geometryOrigin: "back-on-plane-front-toward-camera" as const,
});

/** Shared primitive vocabulary — one Nexora physical family. */
export const EXECUTIVE_OVS_PRIMITIVES = Object.freeze([
  "orb",
  "rounded-block",
  "cylinder",
  "prism",
  "hex-prism",
  "diamond",
  "ring",
] as const);

export type ExecutiveOvsPrimitive = (typeof EXECUTIVE_OVS_PRIMITIVES)[number];

export const EXECUTIVE_OVS_OBJECT_FAMILIES = Object.freeze([
  "operational",
  "goal",
  "kpi",
  "problem",
  "risk",
  "scenario",
  "decision",
  "execution",
  "outcome",
  "context",
] as const);

export type ExecutiveOvsObjectFamily =
  (typeof EXECUTIVE_OVS_OBJECT_FAMILIES)[number];

/**
 * Category → primitive. Shared forms where literacy does not need a new sculpture.
 *
 * | Family | Primitive | Recognition (labels-off) |
 * | goal | orb | stable aspirational mass |
 * | kpi | cylinder | tall instrument column |
 * | problem | prism | constrained angular block |
 * | risk | diamond | tension polyhedron |
 * | scenario | rounded-block | wider possibility plate |
 * | decision | hex-prism | committed hex facing Stage XY |
 * | execution | rounded-block | lower action slab |
 * | outcome | ring | resolved enclosure |
 * | context | orb | subordinate smaller orb |
 * | operational | rounded-block | default Nexora body |
 *
 * Scenario and execution share rounded-block; aspect and corner radius differ.
 * Goal and context share orb; aspect/depth differ. Color is supporting only.
 * Unknown falls back to operational rounded-block.
 */
export const EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE = Object.freeze({
  operational: "rounded-block",
  goal: "orb",
  kpi: "cylinder",
  problem: "prism",
  risk: "diamond",
  scenario: "rounded-block",
  decision: "hex-prism",
  execution: "rounded-block",
  outcome: "ring",
  context: "orb",
} as const satisfies Record<ExecutiveOvsObjectFamily, ExecutiveOvsPrimitive>);

/** Corner softness for shared rounded-block families — not a second primitive. */
export const EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY = Object.freeze({
  operational: 0.055,
  scenario: 0.16,
  execution: 0.045,
} as const);

/**
 * VISUAL-SYSTEM:1 — one Object = one primary body.
 * Contact disc and OVS:2 rings are presentation, not sculpture.
 * Subdivision stays at or below the prior live mesh budget.
 */
export const EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION = Object.freeze({
  onePrimaryBody: true as const,
  decorativeSubMeshes: false as const,
  roundedBlockSmoothness: 2 as const,
  hexPrismRadialSegments: 6 as const,
  hexPrismHeightSegments: 1 as const,
  cylinderRadialSegments: 24 as const,
  orbWidthSegments: 24 as const,
  orbHeightSegments: 16 as const,
  diamondDetail: 0 as const,
  torusRadialSegments: 10 as const,
  torusTubularSegments: 28 as const,
  contactDiscIsNotObjectGeometry: true as const,
});

export const EXECUTIVE_OVS_MATERIAL_LANGUAGE = Object.freeze({
  metalness: 0.22,
  roughness: 0.46,
  envMapIntensity: 0.34,
  emissiveScale: 0.32,
  maxEmissive: 0.16,
  highlightLift: 0.12,
  sideDarken: 0.22,
});

/** Local +Z depth as a fraction of the existing XY footprint — not a second layout. */
export const EXECUTIVE_OVS_DEPTH_FACTOR_BY_FAMILY = Object.freeze({
  operational: 0.72,
  goal: 0.92,
  kpi: 0.78,
  problem: 0.68,
  risk: 0.8,
  scenario: 0.4,
  decision: 0.5,
  execution: 0.56,
  outcome: 0.42,
  context: 0.7,
} as const satisfies Record<ExecutiveOvsObjectFamily, number>);

export const EXECUTIVE_OVS_MAX_VISUAL_DEPTH = 0.78;

export const EXECUTIVE_OVS_ASPECT_BY_FAMILY = Object.freeze({
  operational: Object.freeze({ width: 1, height: 1 }),
  goal: Object.freeze({ width: 1, height: 1 }),
  kpi: Object.freeze({ width: 0.72, height: 1.12 }),
  problem: Object.freeze({ width: 1.08, height: 0.78 }),
  risk: Object.freeze({ width: 0.96, height: 0.96 }),
  scenario: Object.freeze({ width: 1.16, height: 0.78 }),
  decision: Object.freeze({ width: 1, height: 1 }),
  execution: Object.freeze({ width: 1.22, height: 0.72 }),
  outcome: Object.freeze({ width: 1, height: 1 }),
  context: Object.freeze({ width: 0.78, height: 0.78 }),
} as const);

export type ExecutiveOvsObjectVisualLanguage = {
  readonly enabled: boolean;
  readonly contract: "ovs-1";
  readonly family: ExecutiveOvsObjectFamily;
  readonly primitive: ExecutiveOvsPrimitive;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly backZ: 0;
  readonly frontZ: number;
  readonly centerZ: number;
  readonly rotationX: 0;
  readonly rotationY: 0;
  readonly material: typeof EXECUTIVE_OVS_MATERIAL_LANGUAGE;
  readonly fallback: boolean;
};

let ovsLanguageEnabled = true;

export function setExecutiveOvsObjectVisualLanguageEnabled(
  enabled: boolean,
): void {
  ovsLanguageEnabled = enabled === true;
}

function readOvsQueryOverride(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("ovs1") ?? params.get("ovsLanguage");
    if (flag === "0" || flag === "off" || flag === "false") return false;
    if (flag === "1" || flag === "on" || flag === "true") return true;
  } catch {
    return null;
  }
  return null;
}

export function isExecutiveOvsObjectVisualLanguageEnabled(): boolean {
  const query = readOvsQueryOverride();
  if (query != null) return query;
  if (typeof process !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_NEXORA_OVS1;
    if (fromEnv === "0" || fromEnv === "false" || fromEnv === "off") {
      return false;
    }
    if (fromEnv === "1" || fromEnv === "true" || fromEnv === "on") {
      return true;
    }
  }
  return ovsLanguageEnabled;
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/**
 * Kind-cue → OVS family. Reads the same concatenated id/label/kind cue the
 * Stage already passes. Does not invent catalog kinds.
 */
export function resolveExecutiveOvsObjectFamily(
  objectKind?: string | null,
): ExecutiveOvsObjectFamily {
  const kind = (objectKind ?? "").toLowerCase();
  if (kind.includes("outcome") || kind.includes("learning")) return "outcome";
  if (
    kind.includes("kpi") ||
    kind.includes("koi") ||
    kind.includes("measure")
  ) {
    return "kpi";
  }
  if (
    kind.includes("context") ||
    kind.includes("insight") ||
    kind.includes("guidance")
  ) {
    return "context";
  }
  if (kind.includes("risk")) return "risk";
  if (kind.includes("problem") || kind.includes("issue")) return "problem";
  if (kind.includes("decision")) return "decision";
  if (kind.includes("scenario")) return "scenario";
  if (
    kind.includes("execution") ||
    kind.includes("action") ||
    kind.includes("task")
  ) {
    return "execution";
  }
  if (kind.includes("goal") || kind.includes("objective")) return "goal";

  const presence = resolveExecutiveObjectSemanticShapeFamily(objectKind);
  switch (presence) {
    case "goal":
      return "goal";
    case "problem":
      return "problem";
    case "risk":
      return "risk";
    case "scenario":
      return "scenario";
    case "decision":
      return "decision";
    case "execution":
      return "execution";
    case "context":
      return "context";
    default:
      return "operational";
  }
}

export function resolveExecutiveOvsPrimitive(
  family: ExecutiveOvsObjectFamily,
): ExecutiveOvsPrimitive {
  return EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE[family];
}

export function resolveExecutiveOvsObjectVisualLanguage(input: {
  readonly objectKind?: string | null;
  readonly width?: number;
  readonly height?: number;
  readonly enabled?: boolean;
}): ExecutiveOvsObjectVisualLanguage {
  const enabled = input.enabled ?? isExecutiveOvsObjectVisualLanguageEnabled();
  const family = resolveExecutiveOvsObjectFamily(input.objectKind);
  const primitive = resolveExecutiveOvsPrimitive(family);
  const cue = `${input.objectKind ?? ""}`.toLowerCase();
  const fallback =
    family === "operational" &&
    !cue.includes("object") &&
    !cue.includes("pack");

  const aspect = EXECUTIVE_OVS_ASPECT_BY_FAMILY[family];
  const baseW = input.width ?? 1.05;
  const baseH = input.height ?? 1.05;
  const width =
    input.width != null ? stabilize(baseW) : stabilize(baseW * aspect.width);
  const height =
    input.height != null ? stabilize(baseH) : stabilize(baseH * aspect.height);
  const depth = enabled
    ? stabilize(
        clamp(
          Math.min(width, height) * EXECUTIVE_OVS_DEPTH_FACTOR_BY_FAMILY[family],
          0.28,
          EXECUTIVE_OVS_MAX_VISUAL_DEPTH,
        ),
      )
    : 0;

  return Object.freeze({
    enabled,
    contract: "ovs-1",
    family,
    primitive,
    width,
    height,
    depth,
    backZ: 0,
    frontZ: depth,
    centerZ: stabilize(depth * 0.5),
    rotationX: 0,
    rotationY: 0,
    material: EXECUTIVE_OVS_MATERIAL_LANGUAGE,
    fallback: family === "operational" && fallback,
  });
}

export function getExecutiveOvsObjectVisualLanguageObservability(input?: {
  readonly enabled?: boolean;
  readonly objectKind?: string | null;
}): Readonly<{
  readonly contract: "ovs-1";
  readonly identity: typeof executiveOvsObjectVisualLanguageIdentity;
  readonly enabled: "true" | "false";
  readonly family: ExecutiveOvsObjectFamily | "off";
  readonly primitive: ExecutiveOvsPrimitive | "off";
}> {
  const enabled = input?.enabled ?? isExecutiveOvsObjectVisualLanguageEnabled();
  if (!enabled) {
    return Object.freeze({
      contract: "ovs-1" as const,
      identity: executiveOvsObjectVisualLanguageIdentity,
      enabled: "false" as const,
      family: "off" as const,
      primitive: "off" as const,
    });
  }
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: input?.objectKind,
    enabled: true,
  });
  return Object.freeze({
    contract: "ovs-1" as const,
    identity: executiveOvsObjectVisualLanguageIdentity,
    enabled: "true" as const,
    family: language.family,
    primitive: language.primitive,
  });
}

export function verifyExecutiveOvsObjectVisualLanguage(): true {
  if (
    IDENTITY.id !== "NPA-T OVS:1/Executive3DObjectVisualLanguage" ||
    IDENTITY.architecturalRole !==
      "PresentationOnlyExecutiveObjectGeometryLanguage"
  ) {
    throw new Error("OVS:1 identity mismatch");
  }
  if (EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.introducesSecondCanvas) {
    throw new Error("OVS:1 must not introduce a second Canvas");
  }
  if (EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.ownsCamera) {
    throw new Error("OVS:1 must not own camera");
  }
  if (EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.goal !== "orb") {
    throw new Error("OVS:1 goal mapping drifted");
  }
  if (EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.decision !== "hex-prism") {
    throw new Error("OVS:1 decision mapping drifted");
  }
  if (EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.kpi !== "cylinder") {
    throw new Error("OVS:1 kpi mapping drifted");
  }
  if (EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.onePrimaryBody !== true) {
    throw new Error("OVS:1 must keep one primary body");
  }
  if (EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.roundedBlockSmoothness > 2) {
    throw new Error("OVS:1 rounded-block smoothness exceeds simplicity budget");
  }
  if (EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.hexPrismHeightSegments !== 1) {
    throw new Error("OVS:1 hex-prism must not stack extra height segments");
  }
  return true;
}
