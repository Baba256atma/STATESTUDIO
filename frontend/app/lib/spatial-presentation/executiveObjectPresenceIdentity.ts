/**
 * STAGE-OBJ:2 — Executive Business Object Presence & Identity.
 *
 * Type-C visual authority (mass, territory, silhouette, hierarchy)
 * on the certified Executive Stage architecture (XY topology, z=0,
 * local +Z geometry, Deep-Z environment, fixed camera).
 *
 * Presentation only — never writes topology truth or relationships.
 */

import type { ExecutiveObject3DPresentationLevel } from "./executiveObject3DGeometry.ts";
import type { ExecutiveObject3DShape } from "./executiveObject3DGeometry.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectPresenceIdentity =
  "STAGE-OBJ:2/ExecutiveBusinessObjectPresenceIdentity" as const;

export const executiveObjectPresenceVersion = "4.2.0" as const;

export const executiveObjectPresenceNamespace =
  "nexora.spatial-presentation.executive-object-presence-identity" as const;

export const executiveObjectPresencePhase =
  "ExecutiveBusinessObjectPresenceAndIdentity" as const;

export const executiveObjectPresenceArchitecturalRole =
  "PresentationOnlyObjectPresenceAndSemanticSilhouette" as const;

export type ExecutiveObjectPresenceIdentity = {
  readonly id: typeof executiveObjectPresenceIdentity;
  readonly version: typeof executiveObjectPresenceVersion;
  readonly namespace: typeof executiveObjectPresenceNamespace;
  readonly phase: typeof executiveObjectPresencePhase;
  readonly architecturalRole: typeof executiveObjectPresenceArchitecturalRole;
};

const IDENTITY: ExecutiveObjectPresenceIdentity = Object.freeze({
  id: executiveObjectPresenceIdentity,
  version: executiveObjectPresenceVersion,
  namespace: executiveObjectPresenceNamespace,
  phase: executiveObjectPresencePhase,
  architecturalRole: executiveObjectPresenceArchitecturalRole,
});

export function getExecutiveObjectPresenceIdentity(): ExecutiveObjectPresenceIdentity {
  return IDENTITY;
}

export const EXECUTIVE_OBJECT_PRESENCE_BOUNDARY = Object.freeze({
  architecturalRole: executiveObjectPresenceArchitecturalRole,
  changesSemanticZ: false as const,
  usesZForTopology: false as const,
  usesZForCollision: false as const,
  usesZForFocus: false as const,
  movesCamera: false as const,
  inventsRelationships: false as const,
  restoresTypeCXzTopology: false as const,
  /** Depth stays within STAGE-OBJ:1 caps; presence grows XY first. */
  increasesDepthForPresence: false as const,
});

// ─── Toggle ─────────────────────────────────────────────────────────────────

/** Dev/test toggle — not production UI. Default ON for STAGE-OBJ:2. */
let objectPresenceV2Enabled = true;

export function setExecutiveObjectPresenceV2Enabled(enabled: boolean): void {
  objectPresenceV2Enabled = enabled === true;
}

function readPresenceQueryOverride(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const flag =
      params.get("objPresence") ??
      params.get("objectPresence") ??
      params.get("stageObj2");
    if (flag === "0" || flag === "off" || flag === "false" || flag === "v1") {
      return false;
    }
    if (flag === "1" || flag === "on" || flag === "true" || flag === "v2") {
      return true;
    }
  } catch {
    return null;
  }
  return null;
}

export function isExecutiveObjectPresenceV2Enabled(): boolean {
  const query = readPresenceQueryOverride();
  if (query != null) return query;
  if (typeof process !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_NEXORA_STAGE_OBJ_PRESENCE;
    if (fromEnv === "0" || fromEnv === "false" || fromEnv === "off") {
      return false;
    }
    if (fromEnv === "1" || fromEnv === "true" || fromEnv === "on") {
      return true;
    }
  }
  return objectPresenceV2Enabled;
}

/** Sync module flag from URL — call on Stage mount / popstate. */
export function syncExecutiveObjectPresenceV2FromEnvironment(): boolean {
  const query = readPresenceQueryOverride();
  if (query != null) {
    objectPresenceV2Enabled = query;
    return query;
  }
  return objectPresenceV2Enabled;
}

// ─── Semantic families ──────────────────────────────────────────────────────

export type ExecutiveObjectSemanticShapeFamily =
  | "business-object"
  | "goal"
  | "problem"
  | "risk"
  | "scenario"
  | "decision"
  | "execution"
  | "context";

export type ExecutiveObjectPresenceClass =
  | "primary"
  | "related"
  | "secondary"
  | "context";

export type ExecutiveObjectTerritoryStyle =
  | "none"
  | "quiet"
  | "active"
  | "focused"
  | "attention"
  | "critical";

export type ExecutiveObjectTerritoryCollisionPolicy =
  | "none"
  | "soft-visual"
  | "hard-footprint";

export type ExecutiveObjectInteractionPresenceState =
  | "overview"
  | "focused"
  | "selected"
  | "related"
  | "secondary"
  | "background";

export type ExecutiveObjectExecutivePresenceState =
  | "normal"
  | "watch"
  | "critical"
  | "recommended"
  | "unresolved";

export type ExecutiveObjectPresenceProfile = {
  readonly width: number;
  readonly height: number;
  readonly geometryDepth: number;
  readonly territoryRadius: number;
  readonly labelOffset: number;
  readonly emphasisScale: number;
  readonly bodyPresence: number;
};

export type ExecutiveObjectVisualIdentity = {
  readonly shapeFamily: ExecutiveObjectSemanticShapeFamily;
  readonly geometryShape: ExecutiveObject3DShape;
  readonly presenceClass: ExecutiveObjectPresenceClass;
  readonly bodyScale: number;
  readonly presence: ExecutiveObjectPresenceProfile;
  readonly territoryStyle: ExecutiveObjectTerritoryStyle;
  readonly territoryCollision: ExecutiveObjectTerritoryCollisionPolicy;
  readonly territoryInner: number;
  readonly territoryOuter: number;
  readonly territoryOpacity: number;
  readonly edgeStyle: "restrained" | "emphasized" | "critical" | "quiet";
  readonly faceStyle: "standard" | "elevated" | "subdued" | "attention";
  readonly stateMarkerStyle: "none" | "dot" | "segment" | "corner";
  readonly labelRole: "primary" | "secondary" | "suppressed";
  readonly connectionDominance: "subordinate" | "anchor-clear";
};

/** STAGE-OBJ:1 depth contract retained — presence grows XY, not Z. */
export const EXECUTIVE_OBJECT_PRESENCE_DEPTH_BY_LEVEL = Object.freeze({
  minimum: 0.14,
  report: 0.22,
  operation: 0.3,
} as const);

/**
 * Canonical XY presence by presentation level (Business Object base).
 * Replaces the STAGE-OBJ:1 *0.72 shrink that produced ~0.52 graph nodes.
 */
export const EXECUTIVE_OBJECT_PRESENCE_BY_LEVEL = Object.freeze({
  minimum: Object.freeze({
    width: 1.05,
    height: 1.05,
    territoryRadius: 0.64,
    labelOffset: 0.7,
    emphasisScale: 1.12,
    bodyPresence: 1,
  }),
  report: Object.freeze({
    width: 1.14,
    height: 1.14,
    territoryRadius: 0.72,
    labelOffset: 0.78,
    emphasisScale: 1.14,
    bodyPresence: 1.08,
  }),
  operation: Object.freeze({
    width: 1.22,
    height: 1.22,
    territoryRadius: 0.8,
    labelOffset: 0.86,
    emphasisScale: 1.16,
    bodyPresence: 1.14,
  }),
} as const);

/** Hard-separation half-extents when Presence V2 is active (body + strong territory). */
export const EXECUTIVE_OBJECT_PRESENCE_HARD_FOOTPRINT = Object.freeze({
  minimum: Object.freeze({
    anchor: 0.72,
    related: 0.58,
    secondary: 0.44,
    background: 0.34,
  }),
  report: Object.freeze({
    anchor: 0.8,
    related: 0.64,
    secondary: 0.48,
    background: 0.36,
  }),
  operation: Object.freeze({
    anchor: 0.88,
    related: 0.7,
    secondary: 0.52,
    background: 0.38,
  }),
  minVisualGap: 0.4,
} as const);

/** Role scale relative to presence body (restrained). */
export const EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE = Object.freeze({
  focused: 1.12,
  selected: 1.06,
  related: 0.94,
  secondary: 0.86,
  background: 0.78,
  overview: 0.96,
  context: 0.55,
} as const);

export const EXECUTIVE_OBJECT_PRESENCE_CONNECTION = Object.freeze({
  /** Emphasized anchor-incident lines stay readable but subordinate to bodies. */
  anchorIncidentOpacityCap: 0.48,
  anchorIncidentLineWidthCap: 1.15,
  backgroundOpacityCap: 0.08,
  backgroundLineWidthCap: 0.75,
} as const);

export const EXECUTIVE_OBJECT_PRESENCE_DEEP_Z = Object.freeze({
  farDiscOpacity: 0.38,
  ringOpacityScale: 0.72,
  particleOpacityScale: 0.7,
} as const);

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/**
 * Map object kind / semantic cues → STAGE-OBJ:2 shape family.
 * Deterministic silhouette grammar for labels-off recognition.
 */
export function resolveExecutiveObjectSemanticShapeFamily(
  objectKind?: string | null,
): ExecutiveObjectSemanticShapeFamily {
  const kind = (objectKind ?? "").toLowerCase();
  if (kind.includes("context") || kind.includes("insight") || kind.includes("guidance")) {
    return "context";
  }
  if (kind.includes("risk")) return "risk";
  if (kind.includes("problem")) return "problem";
  if (kind.includes("decision")) return "decision";
  if (kind.includes("scenario")) return "scenario";
  if (kind.includes("execution") || kind.includes("task")) return "execution";
  if (kind.includes("goal")) return "goal";
  if (
    kind.includes("object") ||
    kind.includes("pack") ||
    kind.includes("kpi") ||
    kind.includes("koi") ||
    kind === "" ||
    kind === "unknown"
  ) {
    return "business-object";
  }
  return "business-object";
}

export function resolveExecutiveObjectGeometryShapeForFamily(
  family: ExecutiveObjectSemanticShapeFamily,
): ExecutiveObject3DShape {
  switch (family) {
    case "goal":
      return "disc-slab";
    case "problem":
      return "rect-slab";
    case "risk":
      return "diamond-slab";
    case "scenario":
      return "soft-plate";
    case "decision":
      return "hex-slab";
    case "execution":
      return "rounded-slab";
    case "context":
      return "soft-plate";
    case "business-object":
    default:
      return "rounded-slab";
  }
}

function resolvePresenceClass(
  interaction: ExecutiveObjectInteractionPresenceState,
): ExecutiveObjectPresenceClass {
  if (interaction === "focused" || interaction === "selected") return "primary";
  if (interaction === "related") return "related";
  if (interaction === "overview") return "context";
  return "secondary";
}

function resolveTerritory(input: {
  readonly interaction: ExecutiveObjectInteractionPresenceState;
  readonly executiveState: ExecutiveObjectExecutivePresenceState;
  readonly presenceClass: ExecutiveObjectPresenceClass;
}): {
  readonly style: ExecutiveObjectTerritoryStyle;
  readonly collision: ExecutiveObjectTerritoryCollisionPolicy;
  readonly opacity: number;
  readonly pad: number;
} {
  if (input.presenceClass === "context") {
    return {
      style: "none",
      collision: "none",
      opacity: 0,
      pad: 0,
    };
  }
  if (input.interaction === "focused") {
    return {
      style: "focused",
      collision: "hard-footprint",
      // STAGE-3DOBJ:2-FIX — support object; do not dominate body.
      opacity: 0.28,
      pad: 0.14,
    };
  }
  if (input.interaction === "selected") {
    return {
      style: "active",
      collision: "hard-footprint",
      opacity: 0.2,
      pad: 0.1,
    };
  }
  if (input.executiveState === "critical") {
    return {
      style: "critical",
      collision: "hard-footprint",
      opacity: 0.24,
      pad: 0.11,
    };
  }
  if (
    input.executiveState === "watch" ||
    input.executiveState === "unresolved"
  ) {
    return {
      style: "attention",
      collision: "soft-visual",
      // Watch: edge/face accent carries more; halo quieter.
      opacity: 0.12,
      pad: 0.07,
    };
  }
  if (input.executiveState === "recommended") {
    return {
      style: "quiet",
      collision: "soft-visual",
      opacity: 0.1,
      pad: 0.04,
    };
  }
  if (input.interaction === "related") {
    return {
      style: "quiet",
      collision: "soft-visual",
      opacity: 0.08,
      pad: 0.03,
    };
  }
  return {
    style: "none",
    collision: "none",
    opacity: 0,
    pad: 0,
  };
}

function familySizeFactor(family: ExecutiveObjectSemanticShapeFamily): {
  readonly width: number;
  readonly height: number;
} {
  switch (family) {
    case "goal":
      return { width: 0.96, height: 0.96 };
    case "problem":
      return { width: 1.05, height: 0.72 };
    case "risk":
      return { width: 0.94, height: 0.94 };
    case "scenario":
      return { width: 1.08, height: 0.78 };
    case "decision":
      return { width: 1.0, height: 1.0 };
    case "execution":
      return { width: 1.1, height: 0.72 };
    case "context":
      return { width: 0.42, height: 0.42 };
    case "business-object":
    default:
      return { width: 1, height: 1 };
  }
}

/**
 * Canonical STAGE-OBJ:2 visual identity resolver.
 * Presentation only — never topology / relationships / Data Reality.
 */
export function resolveExecutiveObjectVisualIdentity(input: {
  readonly objectKind?: string | null;
  readonly presentationLevel?: ExecutiveObject3DPresentationLevel;
  readonly interactionState?: ExecutiveObjectInteractionPresenceState;
  readonly executiveState?: ExecutiveObjectExecutivePresenceState;
}): ExecutiveObjectVisualIdentity {
  const level = input.presentationLevel ?? "minimum";
  const interaction = input.interactionState ?? "overview";
  const executiveState = input.executiveState ?? "normal";
  const shapeFamily = resolveExecutiveObjectSemanticShapeFamily(input.objectKind);
  const geometryShape = resolveExecutiveObjectGeometryShapeForFamily(shapeFamily);
  const presenceClass =
    shapeFamily === "context"
      ? "context"
      : resolvePresenceClass(interaction);
  const base = EXECUTIVE_OBJECT_PRESENCE_BY_LEVEL[level];
  const sizeFactor = familySizeFactor(shapeFamily);
  const roleScale =
    presenceClass === "context"
      ? EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE.context
      : interaction === "focused"
        ? EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE.focused
        : interaction === "selected"
          ? EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE.selected
          : interaction === "related"
            ? EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE.related
            : interaction === "secondary"
              ? EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE.secondary
              : interaction === "background"
                ? EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE.background
                : EXECUTIVE_OBJECT_PRESENCE_ROLE_SCALE.overview;

  const width = stabilize(base.width * sizeFactor.width);
  const height = stabilize(base.height * sizeFactor.height);
  const bodyScale = stabilize(roleScale);
  const territory = resolveTerritory({
    interaction,
    executiveState,
    presenceClass,
  });
  const maxDim = Math.max(width, height) * bodyScale;
  const territoryInner = stabilize(maxDim * 0.55);
  const territoryOuter = stabilize(
    maxDim * 0.55 + 0.05 + territory.pad * (territory.style === "none" ? 0 : 1),
  );

  let edgeStyle: ExecutiveObjectVisualIdentity["edgeStyle"] = "restrained";
  let faceStyle: ExecutiveObjectVisualIdentity["faceStyle"] = "standard";
  let stateMarkerStyle: ExecutiveObjectVisualIdentity["stateMarkerStyle"] =
    "none";
  if (interaction === "focused") {
    edgeStyle = "emphasized";
    faceStyle = "elevated";
  } else if (executiveState === "critical") {
    edgeStyle = "critical";
    faceStyle = "attention";
    stateMarkerStyle = "corner";
  } else if (executiveState === "watch") {
    edgeStyle = "emphasized";
    faceStyle = "attention";
    stateMarkerStyle = "segment";
  } else if (executiveState === "unresolved") {
    faceStyle = "subdued";
    stateMarkerStyle = "dot";
  } else if (executiveState === "recommended") {
    stateMarkerStyle = "segment";
  } else if (presenceClass === "secondary" || presenceClass === "context") {
    edgeStyle = "quiet";
    faceStyle = "subdued";
  }

  const labelRole: ExecutiveObjectVisualIdentity["labelRole"] =
    presenceClass === "context"
      ? "suppressed"
      : presenceClass === "secondary"
        ? "secondary"
        : "primary";

  return Object.freeze({
    shapeFamily,
    geometryShape,
    presenceClass,
    bodyScale,
    presence: Object.freeze({
      width,
      height,
      geometryDepth: EXECUTIVE_OBJECT_PRESENCE_DEPTH_BY_LEVEL[level],
      territoryRadius: stabilize(base.territoryRadius * roleScale),
      labelOffset: stabilize(base.labelOffset),
      emphasisScale: base.emphasisScale,
      bodyPresence: stabilize(base.bodyPresence * roleScale),
    }),
    territoryStyle: territory.style,
    territoryCollision: territory.collision,
    territoryInner,
    territoryOuter,
    territoryOpacity: territory.opacity,
    edgeStyle,
    faceStyle,
    stateMarkerStyle,
    labelRole,
    connectionDominance:
      interaction === "focused" ? "anchor-clear" : "subordinate",
  });
}

export function resolveExecutiveObjectPresenceFootprintHalfExtent(input: {
  readonly presentationLevel?: ExecutiveObject3DPresentationLevel;
  readonly role: "anchor" | "related" | "secondary" | "background";
}): number {
  const level = input.presentationLevel ?? "minimum";
  return EXECUTIVE_OBJECT_PRESENCE_HARD_FOOTPRINT[level][input.role];
}

export function getExecutiveObjectPresenceObservability(input?: {
  readonly enabled?: boolean;
}): Readonly<{
  readonly contract: "stage-obj-2";
  readonly presenceVersion: string;
  readonly enabled: string;
  readonly identity: string;
}> {
  const enabled = input?.enabled ?? isExecutiveObjectPresenceV2Enabled();
  return Object.freeze({
    contract: "stage-obj-2",
    presenceVersion: enabled ? "v2" : "v1",
    enabled: enabled ? "true" : "false",
    identity: executiveObjectPresenceIdentity,
  });
}

export function verifyExecutiveObjectPresenceIdentity(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly semanticZSafe: boolean;
  readonly typeCXzRejected: boolean;
}> {
  const identity = getExecutiveObjectPresenceIdentity();
  return Object.freeze({
    ok:
      identity.id ===
        "STAGE-OBJ:2/ExecutiveBusinessObjectPresenceIdentity" &&
      identity.version === "4.2.0" &&
      EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.changesSemanticZ === false &&
      EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.restoresTypeCXzTopology === false,
    identityValid:
      identity.id ===
      "STAGE-OBJ:2/ExecutiveBusinessObjectPresenceIdentity",
    semanticZSafe: EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.changesSemanticZ === false,
    typeCXzRejected:
      EXECUTIVE_OBJECT_PRESENCE_BOUNDARY.restoresTypeCXzTopology === false,
  });
}

/** Labels-off silhouette fingerprint for certification. */
export function fingerprintExecutiveObjectSilhouetteFamily(
  objectKind: string,
): string {
  const family = resolveExecutiveObjectSemanticShapeFamily(objectKind);
  const shape = resolveExecutiveObjectGeometryShapeForFamily(family);
  return `${family}:${shape}`;
}
