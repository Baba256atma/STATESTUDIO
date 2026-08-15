/**
 * SP:2.3 — Executive Material & Surface System.
 *
 * Subordinate material resolver for Nexora Stage objects.
 * Surface quality, depth, reflectivity, and restrained premium finish.
 * Does NOT own severity hierarchy (SP:2.4), geometry (SP:2.2), or camera (SP:1).
 * Consumes SP:2.4 state modifiers for tint, emissive lift, and opacity floors.
 *
 * Dependency direction (required):
 *   SP:2.2 Geometry Resolution
 *     + SP:2.4 State Visual Resolution
 *     + SP:2.3 Material Resolution
 *     + SP:2.1 State Composition
 *       → ExecutiveObjectVisualPresentation
 *         → R3F Material Renderer
 *
 * Does not import SP:2.1 (avoids cycles). Uses SP:2.2 family vocabulary only.
 * No custom shaders — MeshStandardMaterial-compatible values only.
 */

import type {
  ExecutiveObjectGeometryFamily,
  ExecutiveObjectSemanticVisualFamily,
} from "./executiveObjectGeometryLanguage.ts";
import {
  EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES,
  resolveExecutiveObjectStateVisualPresentation,
} from "./executiveObjectStateVisualHierarchy.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectMaterialSurfaceIdentity =
  "SP:2.3/ExecutiveObjectMaterialSurface" as const;

export const executiveObjectMaterialSurfaceVersion = "2.3.0" as const;

export const executiveObjectMaterialSurfaceNamespace =
  "nexora.spatial-presentation.executive-object-material-surface" as const;

export const executiveObjectMaterialSurfacePhase =
  "ExecutiveMaterialAndSurfaceSystem" as const;

export const executiveObjectMaterialSurfaceArchitecturalRole =
  "PresentationOnlyExecutiveObjectMaterialResolution" as const;

export const executiveObjectMaterialSurfaceReadiness =
  "AwaitingHumanVisualSignOff" as const;

const UPSTREAM_VISUAL_FOUNDATION_IDENTITY =
  "SP:2.1/ExecutiveObjectVisualFoundation" as const;

const UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY =
  "SP:2.2/ExecutiveObjectGeometryLanguage" as const;

export type ExecutiveObjectMaterialSurfaceIdentity = {
  readonly id: typeof executiveObjectMaterialSurfaceIdentity;
  readonly version: typeof executiveObjectMaterialSurfaceVersion;
  readonly namespace: typeof executiveObjectMaterialSurfaceNamespace;
  readonly phase: typeof executiveObjectMaterialSurfacePhase;
  readonly architecturalRole: typeof executiveObjectMaterialSurfaceArchitecturalRole;
  readonly upstreamVisualFoundation: typeof UPSTREAM_VISUAL_FOUNDATION_IDENTITY;
  readonly upstreamGeometryLanguage: typeof UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY;
};

const MATERIAL_IDENTITY: ExecutiveObjectMaterialSurfaceIdentity = Object.freeze({
  id: executiveObjectMaterialSurfaceIdentity,
  version: executiveObjectMaterialSurfaceVersion,
  namespace: executiveObjectMaterialSurfaceNamespace,
  phase: executiveObjectMaterialSurfacePhase,
  architecturalRole: executiveObjectMaterialSurfaceArchitecturalRole,
  upstreamVisualFoundation: UPSTREAM_VISUAL_FOUNDATION_IDENTITY,
  upstreamGeometryLanguage: UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY,
});

export function getExecutiveObjectMaterialSurfaceIdentity(): ExecutiveObjectMaterialSurfaceIdentity {
  return MATERIAL_IDENTITY;
}

export const EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY = Object.freeze({
  architecturalRole: executiveObjectMaterialSurfaceArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsObjectKindTruth: false as const,
  ownsSeverityTruth: false as const,
  ownsAttentionTruth: false as const,
  ownsFocusTruth: false as const,
  ownsRelationships: false as const,
  ownsSpatialPosition: false as const,
  ownsCamera: false as const,
  finalizesSeverityHierarchy: false as const,
  replacesVisualFoundationAuthority: false as const,
  replacesGeometryLanguageAuthority: false as const,
  redesignsStageLighting: false as const,
  introducesCustomShaders: false as const,
  usesObjectIdMaterialHacks: false as const,
  usesLabelNameMaterialHacks: false as const,
  frameworkIndependentResolver: true as const,
  presentationOnly: true as const,
});

// ─── Contracts (aligned with SP:2.1 / SP:2.2 — no parallel enums) ───────────

export type ExecutiveObjectMaterialSpatialRole =
  | "focus"
  | "related"
  | "background"
  | "overview";

export type ExecutiveObjectMaterialAttention =
  | "normal"
  | "elevated"
  | "important"
  | "critical";

export type ExecutiveObjectMaterialStateMarker =
  | "none"
  | "attention"
  | "critical"
  | "unresolved";

export type ExecutiveObjectMaterialOcclusionState =
  | "clear"
  | "partial"
  | "substantial";

export type ExecutiveObjectSurfaceToneToken =
  | "object.surface.base"
  | "object.surface.watch"
  | "object.surface.risk"
  | "object.surface.unresolved";

export type ExecutiveObjectMaterialSurfaceToken =
  | "object.material.base"
  | "object.material.operational"
  | "object.material.goal"
  | "object.material.metric"
  | "object.material.problem"
  | "object.material.decision"
  | "object.material.scenario"
  | "object.material.execution"
  | "object.material.context";

export type ExecutiveObjectMaterialInput = {
  readonly geometryFamily: ExecutiveObjectGeometryFamily;
  readonly semanticFamily: ExecutiveObjectSemanticVisualFamily;
  readonly spatialRole?: ExecutiveObjectMaterialSpatialRole;
  readonly selected?: boolean;
  readonly focused?: boolean;
  readonly hovered?: boolean;
  readonly attention?: ExecutiveObjectMaterialAttention | string;
  readonly status?: string;
  readonly occlusionState?: ExecutiveObjectMaterialOcclusionState;
  readonly stateMarker?: ExecutiveObjectMaterialStateMarker;
  readonly recommended?: boolean;
  readonly compositionOpacity?: number;
  readonly compositionEmissiveIntensity?: number;
};

export type ExecutiveObjectMaterialSurfacePresentation = {
  readonly surfaceToken: ExecutiveObjectMaterialSurfaceToken;
  readonly surfaceTone: ExecutiveObjectSurfaceToneToken;
  readonly baseColor: string;
  readonly color: string;
  readonly roughness: number;
  readonly metalness: number;
  readonly opacity: number;
  readonly transparent: boolean;
  readonly emissiveColor: string;
  readonly emissiveIntensity: number;
  readonly envMapIntensity: number;
  readonly depthWrite: boolean;
  readonly depthTest: boolean;
  readonly toneMapped: boolean;
};

// ─── DNA / bounds / tokens ──────────────────────────────────────────────────

/**
 * Common Nexora material DNA — premium, restrained, architectural.
 * Dark does not mean black; surfaces must reveal face gradients.
 */
export const EXECUTIVE_OBJECT_MATERIAL_DNA = Object.freeze({
  darkStructuralBody: true as const,
  readableFaceGradients: true as const,
  restrainedMetallicCharacter: true as const,
  moderateRoughness: true as const,
  limitedEmissive: true as const,
  noUncontrolledTransparency: true as const,
  noMirrorChrome: true as const,
  noNeonBody: true as const,
  noCustomShaders: true as const,
  baseBodyColor: "#536478",
});

export const EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS = Object.freeze({
  minimumOpacity: 0.28,
  maximumOpacity: 1,
  backgroundOpacityCeiling: 0.52,
  backgroundCriticalFloor: 0.5,
  backgroundWatchFloor: 0.4,
  backgroundUnresolvedFloor: 0.38,
  backgroundNormalFloor: 0.34,
  minimumRoughness: 0.34,
  maximumRoughness: 0.62,
  minimumMetalness: 0.12,
  maximumMetalness: 0.32,
  minimumEmissive: 0.02,
  maximumEmissive: 0.28,
  minimumEnvMapIntensity: 0.22,
  maximumEnvMapIntensity: 0.52,
  stateTintMinimum: 0.12,
  stateTintMaximum: 0.4,
});

/**
 * Compatibility accents — sourced from SP:2.4 profiles.
 * Desaturated relative to prototype traffic-light cubes.
 */
export const EXECUTIVE_OBJECT_MATERIAL_STATE_ACCENTS = Object.freeze({
  "object.surface.base": EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.normal.surfaceAccent,
  "object.surface.watch": EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.surfaceAccent,
  "object.surface.risk": EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.surfaceAccent,
  "object.surface.unresolved":
    EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.unresolved.surfaceAccent,
} as const satisfies Record<ExecutiveObjectSurfaceToneToken, string>);

export const EXECUTIVE_OBJECT_MATERIAL_STATE_TINT = Object.freeze({
  "object.surface.base": EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.normal.surfaceTint,
  "object.surface.watch": EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.surfaceTint,
  "object.surface.risk": EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.surfaceTint,
  "object.surface.unresolved":
    EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.unresolved.surfaceTint,
} as const satisfies Record<ExecutiveObjectSurfaceToneToken, number>);

type MaterialProfile = {
  readonly surfaceToken: ExecutiveObjectMaterialSurfaceToken;
  readonly baseColor: string;
  readonly roughness: number;
  readonly metalness: number;
  readonly opacity: number;
  readonly envMapIntensity: number;
  readonly emissiveBase: number;
};

/**
 * Semantic-family material profiles — subtle variation around shared DNA.
 * Geometry remains the primary family differentiator.
 */
export const EXECUTIVE_OBJECT_MATERIAL_PROFILES = Object.freeze({
  base: Object.freeze({
    surfaceToken: "object.material.base",
    baseColor: EXECUTIVE_OBJECT_MATERIAL_DNA.baseBodyColor,
    roughness: 0.46,
    metalness: 0.22,
    opacity: 1,
    envMapIntensity: 0.38,
    emissiveBase: 0.03,
  }),
  operational: Object.freeze({
    surfaceToken: "object.material.operational",
    baseColor: "#536478",
    roughness: 0.46,
    metalness: 0.22,
    opacity: 1,
    envMapIntensity: 0.38,
    emissiveBase: 0.03,
  }),
  goal: Object.freeze({
    surfaceToken: "object.material.goal",
    baseColor: "#5a6d82",
    roughness: 0.4,
    metalness: 0.18,
    opacity: 1,
    envMapIntensity: 0.32,
    emissiveBase: 0.03,
  }),
  kpi: Object.freeze({
    surfaceToken: "object.material.metric",
    baseColor: "#4e6278",
    roughness: 0.38,
    metalness: 0.26,
    opacity: 1,
    envMapIntensity: 0.42,
    emissiveBase: 0.03,
  }),
  risk_problem: Object.freeze({
    surfaceToken: "object.material.problem",
    baseColor: "#4a5564",
    roughness: 0.54,
    metalness: 0.14,
    opacity: 1,
    envMapIntensity: 0.3,
    emissiveBase: 0.03,
  }),
  decision: Object.freeze({
    surfaceToken: "object.material.decision",
    baseColor: "#556878",
    roughness: 0.42,
    metalness: 0.24,
    opacity: 1,
    envMapIntensity: 0.36,
    emissiveBase: 0.03,
  }),
  scenario: Object.freeze({
    surfaceToken: "object.material.scenario",
    baseColor: "#5b6c7c",
    roughness: 0.48,
    metalness: 0.16,
    opacity: 0.9,
    envMapIntensity: 0.34,
    emissiveBase: 0.03,
  }),
  execution: Object.freeze({
    surfaceToken: "object.material.execution",
    baseColor: "#4f6274",
    roughness: 0.44,
    metalness: 0.24,
    opacity: 1,
    envMapIntensity: 0.38,
    emissiveBase: 0.03,
  }),
  context: Object.freeze({
    surfaceToken: "object.material.context",
    baseColor: "#5e7084",
    roughness: 0.5,
    metalness: 0.14,
    opacity: 0.86,
    envMapIntensity: 0.3,
    emissiveBase: 0.025,
  }),
  unknown: Object.freeze({
    surfaceToken: "object.material.base",
    baseColor: EXECUTIVE_OBJECT_MATERIAL_DNA.baseBodyColor,
    roughness: 0.46,
    metalness: 0.22,
    opacity: 1,
    envMapIntensity: 0.38,
    emissiveBase: 0.03,
  }),
} as const satisfies Record<ExecutiveObjectSemanticVisualFamily | "base", MaterialProfile>);

/**
 * Per-object MeshStandardMaterial instances from immutable resolved values.
 * Do not share mutable Three.js Material objects across Stage objects.
 */
export const EXECUTIVE_OBJECT_MATERIAL_INSTANCE_POLICY = Object.freeze({
  sharedMutableMaterials: false as const,
  perObjectInstances: true as const,
  recreateEveryFrame: false as const,
  customShaders: false as const,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1e6) / 1e6;
}

function parseHex(hex: string): readonly [number, number, number] {
  const raw = hex.trim().replace("#", "");
  const full =
    raw.length === 3
      ? `${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`
      : raw.padEnd(6, "0").slice(0, 6);
  return Object.freeze([
    Number.parseInt(full.slice(0, 2), 16) || 0,
    Number.parseInt(full.slice(2, 4), 16) || 0,
    Number.parseInt(full.slice(4, 6), 16) || 0,
  ] as const);
}

function toHex(r: number, g: number, b: number): string {
  const channel = (value: number): string =>
    Math.round(clamp(value, 0, 255)).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export function mixExecutiveObjectMaterialHex(
  a: string,
  b: string,
  t: number,
): string {
  const amount = clamp(t, 0, 1);
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  return toHex(
    ar + (br - ar) * amount,
    ag + (bg - ag) * amount,
    ab + (bb - ab) * amount,
  );
}

export function resolveExecutiveObjectMaterialSurfaceTone(
  status: string | undefined,
): ExecutiveObjectSurfaceToneToken {
  switch (status) {
    case "watch":
      return "object.surface.watch";
    case "risk":
      return "object.surface.risk";
    case "unresolved":
      return "object.surface.unresolved";
    case "stable":
    default:
      return "object.surface.base";
  }
}

function profileForSemanticFamily(
  family: ExecutiveObjectSemanticVisualFamily,
): MaterialProfile {
  return EXECUTIVE_OBJECT_MATERIAL_PROFILES[family] ??
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.unknown;
}

/**
 * Pure material resolver — SP:2.3 mapping authority.
 * Geometry family may subtly tune response; it never selects a foreign material.
 * State tint / emissive lift / opacity floors come from SP:2.4.
 */
export function resolveExecutiveObjectMaterialPresentation(
  input: ExecutiveObjectMaterialInput,
): ExecutiveObjectMaterialSurfacePresentation {
  const bounds = EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS;
  const semanticFamily = input.semanticFamily ?? "unknown";
  const geometryFamily = input.geometryFamily ?? "block";
  const spatialRole = input.spatialRole ?? (input.focused ? "focus" : "overview");
  const focused = input.focused === true;
  const hovered = input.hovered === true;
  const selected = input.selected === true;
  const profile = profileForSemanticFamily(semanticFamily);
  const stateVisual = resolveExecutiveObjectStateVisualPresentation({
    status: input.status,
    attention: input.attention,
    recommended: input.recommended,
    spatialRole,
    selected,
    focused,
    hovered,
    occlusionState: input.occlusionState,
    stateMarker: input.stateMarker,
  });
  const surfaceTone = stateVisual.surfaceTone;
  const critical = stateVisual.statusClass === "critical";

  let roughness = profile.roughness + stateVisual.roughnessBias;
  let metalness = profile.metalness + stateVisual.metalnessBias;
  let opacity = profile.opacity;
  let envMapIntensity = profile.envMapIntensity;
  let emissiveIntensity = profile.emissiveBase + stateVisual.emissiveLift;

  // Geometry-family micro-tuning — keep silhouette primary.
  if (geometryFamily === "orbital") {
    envMapIntensity *= 0.85;
    roughness += 0.02;
  } else if (geometryFamily === "planar") {
    roughness += 0.02;
  } else if (geometryFamily === "cylindrical") {
    roughness -= 0.02;
  } else if (geometryFamily === "rounded") {
    envMapIntensity *= 0.92;
  }

  if (focused || spatialRole === "focus") {
    roughness -= 0.03;
    opacity = Math.max(opacity, 0.96);
    emissiveIntensity += 0.1;
  } else if (spatialRole === "related") {
    opacity = Math.min(opacity, 0.94);
  } else if (spatialRole === "background") {
    opacity = Math.min(opacity, bounds.backgroundOpacityCeiling);
    emissiveIntensity = Math.min(emissiveIntensity, critical ? 0.14 : 0.08);
  }

  if (hovered && !focused) {
    emissiveIntensity += 0.05;
    roughness -= 0.02;
  }
  if (selected && !focused) {
    emissiveIntensity += 0.03;
  }
  if (critical && !focused) {
    emissiveIntensity += 0.06;
  }

  if (
    typeof input.compositionOpacity === "number" &&
    Number.isFinite(input.compositionOpacity)
  ) {
    opacity =
      spatialRole === "background"
        ? Math.min(opacity, input.compositionOpacity)
        : input.compositionOpacity;
  }
  if (
    typeof input.compositionEmissiveIntensity === "number" &&
    Number.isFinite(input.compositionEmissiveIntensity)
  ) {
    emissiveIntensity = Math.max(
      emissiveIntensity,
      Math.min(input.compositionEmissiveIntensity, 0.22),
    );
  }

  if (spatialRole === "background") {
    opacity = Math.max(opacity, stateVisual.backgroundOpacityFloor);
    opacity = Math.min(opacity, bounds.backgroundOpacityCeiling);
  }

  roughness = clamp(roughness, bounds.minimumRoughness, bounds.maximumRoughness);
  metalness = clamp(metalness, bounds.minimumMetalness, bounds.maximumMetalness);
  opacity = clamp(opacity, bounds.minimumOpacity, bounds.maximumOpacity);
  emissiveIntensity = clamp(
    emissiveIntensity,
    bounds.minimumEmissive,
    bounds.maximumEmissive,
  );
  envMapIntensity = clamp(
    envMapIntensity,
    bounds.minimumEnvMapIntensity,
    bounds.maximumEnvMapIntensity,
  );

  const tint = clamp(
    stateVisual.surfaceTint,
    bounds.stateTintMinimum,
    bounds.stateTintMaximum,
  );
  const accent = stateVisual.surfaceAccent;
  const color = mixExecutiveObjectMaterialHex(profile.baseColor, accent, tint);
  const emissiveColor = mixExecutiveObjectMaterialHex(
    profile.baseColor,
    accent,
    Math.min(tint + 0.12, 0.48),
  );
  const transparent = opacity < 0.985;

  return Object.freeze({
    surfaceToken: profile.surfaceToken,
    surfaceTone,
    baseColor: profile.baseColor,
    color,
    roughness: stabilize(roughness),
    metalness: stabilize(metalness),
    opacity: stabilize(opacity),
    transparent,
    emissiveColor,
    emissiveIntensity: stabilize(emissiveIntensity),
    envMapIntensity: stabilize(envMapIntensity),
    depthWrite: true as const,
    depthTest: true as const,
    toneMapped: true as const,
  });
}

export function verifyExecutiveObjectMaterialSurface(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly fallbackSafe: boolean;
  readonly boundsRespected: boolean;
  readonly presentationOnly: boolean;
}> {
  const identity = getExecutiveObjectMaterialSurfaceIdentity();
  const identityValid =
    identity.id === "SP:2.3/ExecutiveObjectMaterialSurface" &&
    identity.version === "2.3.0" &&
    identity.upstreamVisualFoundation ===
      "SP:2.1/ExecutiveObjectVisualFoundation" &&
    identity.upstreamGeometryLanguage ===
      "SP:2.2/ExecutiveObjectGeometryLanguage";

  const boundaryValid =
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.finalizesSeverityHierarchy ===
      false &&
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.introducesCustomShaders ===
      false &&
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.usesObjectIdMaterialHacks ===
      false &&
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY
      .replacesVisualFoundationAuthority === false;

  const sample = Object.freeze({
    geometryFamily: "block" as const,
    semanticFamily: "operational" as const,
    spatialRole: "overview" as const,
    status: "stable",
    focused: false,
    selected: false,
  });
  const a = resolveExecutiveObjectMaterialPresentation(sample);
  const b = resolveExecutiveObjectMaterialPresentation(sample);
  const deterministic = JSON.stringify(a) === JSON.stringify(b);

  const unknown = resolveExecutiveObjectMaterialPresentation({
    geometryFamily: "block",
    semanticFamily: "unknown",
  });
  const fallbackSafe =
    unknown.surfaceToken === "object.material.base" &&
    unknown.toneMapped === true;

  const bounds = EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS;
  const boundsRespected =
    a.roughness >= bounds.minimumRoughness &&
    a.roughness <= bounds.maximumRoughness &&
    a.metalness >= bounds.minimumMetalness &&
    a.metalness <= bounds.maximumMetalness &&
    a.opacity >= bounds.minimumOpacity &&
    a.emissiveIntensity <= bounds.maximumEmissive;

  const presentationOnly =
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.presentationOnly === true;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    fallbackSafe &&
    boundsRespected &&
    presentationOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    fallbackSafe,
    boundsRespected,
    presentationOnly,
  });
}
