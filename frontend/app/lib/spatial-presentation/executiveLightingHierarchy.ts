/**
 * SP:3.2 — Executive Lighting Hierarchy.
 *
 * Additive presentation hierarchy over SP:3.1 Executive Lighting Foundation.
 * Reinforces Stage focus / attention / spatial-role hierarchy through restrained
 * material lighting-response modulation — not additional lights, spotlights,
 * bloom, or executive-truth resolution.
 *
 * Dependency direction (required):
 *   Already-resolved Stage presentation state
 *     → Executive Lighting Hierarchy Resolver (this module)
 *       → ExecutiveLightingEmphasis
 *         → applyExecutiveLightingHierarchyToMaterial(...)
 *           → Stage mesh material (presentation only)
 *
 * Preserves SP:3.1 profile, rig, and shadow strategy unchanged.
 */

import {
  EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY,
  EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS,
  EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION,
  executiveLightingFoundationIdentity,
  executiveLightingFoundationVersion,
  resolveExecutiveLightingProfile,
} from "./executiveLightingFoundation.ts";
import { EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS } from "./executiveObjectMaterialSurface.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveLightingHierarchyIdentity =
  "SP:3.2/ExecutiveLightingHierarchy" as const;

export const executiveLightingHierarchyVersion = "3.2.0" as const;

export const executiveLightingHierarchyNamespace =
  "nexora.spatial-presentation.executive-lighting-hierarchy" as const;

export const executiveLightingHierarchyPhase =
  "ExecutiveLightingHierarchy" as const;

export const executiveLightingHierarchyArchitecturalRole =
  "PresentationOnlyExecutiveLightingHierarchy" as const;

export const executiveLightingHierarchyReadiness =
  "AwaitingHumanVisualSignOff" as const;

const UPSTREAM_LIGHTING_FOUNDATION_IDENTITY =
  "SP:3.1/ExecutiveLightingFoundation" as const;

export type ExecutiveLightingHierarchyIdentity = {
  readonly id: typeof executiveLightingHierarchyIdentity;
  readonly version: typeof executiveLightingHierarchyVersion;
  readonly namespace: typeof executiveLightingHierarchyNamespace;
  readonly phase: typeof executiveLightingHierarchyPhase;
  readonly architecturalRole: typeof executiveLightingHierarchyArchitecturalRole;
  readonly upstreamLightingFoundation: typeof UPSTREAM_LIGHTING_FOUNDATION_IDENTITY;
};

const HIERARCHY_IDENTITY: ExecutiveLightingHierarchyIdentity = Object.freeze({
  id: executiveLightingHierarchyIdentity,
  version: executiveLightingHierarchyVersion,
  namespace: executiveLightingHierarchyNamespace,
  phase: executiveLightingHierarchyPhase,
  architecturalRole: executiveLightingHierarchyArchitecturalRole,
  upstreamLightingFoundation: UPSTREAM_LIGHTING_FOUNDATION_IDENTITY,
});

export function getExecutiveLightingHierarchyIdentity(): ExecutiveLightingHierarchyIdentity {
  return HIERARCHY_IDENTITY;
}

export const EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY = Object.freeze({
  architecturalRole: executiveLightingHierarchyArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsCanonicalNexoraObjects: false as const,
  ownsDataReality: false as const,
  ownsExecutiveStateResolution: false as const,
  ownsRelationships: false as const,
  ownsFocusSemantics: false as const,
  ownsSelectionSemantics: false as const,
  ownsWorkspaceSemantics: false as const,
  ownsCameraContracts: false as const,
  ownsSp2CompositionContracts: false as const,
  replacesSp31LightingFoundation: false as const,
  introducesObjectSpecificLights: false as const,
  introducesPerObjectShadowMaps: false as const,
  introducesWorkspaceSpecificLighting: false as const,
  introducesAnimatedLightingChoreography: false as const,
  introducesCinematicSpotlights: false as const,
  introducesBloom: false as const,
  introducesDepthOfField: false as const,
  introducesVolumetricLighting: false as const,
  introducesColorGrading: false as const,
  introducesPostProcessing: false as const,
  mutatesSemanticColors: false as const,
  frameworkIndependentResolver: true as const,
  presentationOnly: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

/**
 * Restrained lighting emphasis levels — presentation hierarchy only.
 * Does not redefine executive attention/focus truth.
 */
export type ExecutiveLightingEmphasisLevel =
  | "primary"
  | "elevated"
  | "standard"
  | "background";

/** Presentation-facing inputs already available from Stage / SP:2 pipeline. */
export type ExecutiveLightingHierarchyInput = {
  readonly objectId: string;
  readonly focused?: boolean;
  readonly selected?: boolean;
  readonly attention?: string;
  readonly status?: string;
  readonly stateMarker?: string;
  /** SP:2 spatial role vocabulary: focus | related | background | overview */
  readonly spatialRole?: string;
  /** Stage role vocabulary: focused | related | unrelated | normal */
  readonly stageRole?: string;
  /** Context geometry / low-priority Stage companions. */
  readonly presentationTarget?: "stage-object" | "context-node";
};

/**
 * Deterministic lighting-response modulation — not a light definition.
 */
export type ExecutiveLightingMaterialResponse = {
  readonly emissiveLift: number;
  readonly roughnessDelta: number;
  readonly envMapMultiplier: number;
  /** Applied via envMapIntensity — MeshStandard light-response proxy. */
  readonly lightResponseMultiplier: number;
};

export type ExecutiveLightingEmphasis = {
  readonly objectId: string;
  readonly level: ExecutiveLightingEmphasisLevel;
  /** Lower rank = stronger lighting presence. Stable across identical inputs. */
  readonly rank: number;
  /** 0..1 relative strength for comparisons / tests. */
  readonly strength: number;
  readonly response: ExecutiveLightingMaterialResponse;
  readonly preservesSemanticColor: true;
  readonly preservesDataReality: true;
};

export type ExecutiveLightingHierarchySceneResult = {
  readonly identity: typeof executiveLightingHierarchyIdentity;
  readonly version: typeof executiveLightingHierarchyVersion;
  readonly byId: ReadonlyMap<string, ExecutiveLightingEmphasis>;
  readonly orderedObjectIds: readonly string[];
  readonly lightCountDelta: 0;
  readonly shadowStrategyUnchanged: true;
  readonly foundationProfileCanonical: true;
};

/** Minimal material surface fields required for hierarchy application. */
export type ExecutiveLightingHierarchyMaterialSurface = {
  readonly color: string;
  readonly emissiveColor?: string;
  readonly emissiveIntensity: number;
  readonly roughness: number;
  readonly metalness: number;
  readonly opacity: number;
  readonly transparent: boolean;
  readonly envMapIntensity: number;
  readonly depthWrite?: boolean;
  readonly depthTest?: boolean;
  readonly toneMapped?: boolean;
  readonly surfaceTone?: string;
  readonly surfaceToken?: string;
};

// ─── Tokens / bounds ────────────────────────────────────────────────────────

export const EXECUTIVE_LIGHTING_EMPHASIS_LEVELS = Object.freeze([
  "primary",
  "elevated",
  "standard",
  "background",
] as const satisfies readonly ExecutiveLightingEmphasisLevel[]);

/**
 * Restrained response profiles — calm executive product visualization.
 * Strength ordering: primary > elevated > standard > background.
 */
export const EXECUTIVE_LIGHTING_EMPHASIS_PROFILES = Object.freeze({
  primary: Object.freeze({
    level: "primary" as const,
    rank: 0,
    strength: 1,
    response: Object.freeze({
      emissiveLift: 0.034,
      roughnessDelta: -0.024,
      envMapMultiplier: 1.1,
      lightResponseMultiplier: 1.08,
    }),
  }),
  elevated: Object.freeze({
    level: "elevated" as const,
    rank: 1,
    strength: 0.74,
    response: Object.freeze({
      emissiveLift: 0.028,
      roughnessDelta: -0.014,
      envMapMultiplier: 1.06,
      lightResponseMultiplier: 1.05,
    }),
  }),
  standard: Object.freeze({
    level: "standard" as const,
    rank: 2,
    strength: 0.5,
    response: Object.freeze({
      emissiveLift: 0,
      roughnessDelta: 0,
      envMapMultiplier: 1,
      lightResponseMultiplier: 1,
    }),
  }),
  background: Object.freeze({
    level: "background" as const,
    rank: 3,
    strength: 0.3,
    response: Object.freeze({
      emissiveLift: -0.006,
      roughnessDelta: 0.022,
      envMapMultiplier: 0.9,
      lightResponseMultiplier: 0.94,
    }),
  }),
} as const);

export const EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS = Object.freeze({
  minimumEmissive: EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.minimumEmissive,
  maximumEmissive: EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.maximumEmissive,
  minimumRoughness: EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.minimumRoughness,
  maximumRoughness: EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.maximumRoughness,
  minimumEnvMapIntensity:
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.minimumEnvMapIntensity,
  maximumEnvMapIntensity:
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.maximumEnvMapIntensity,
  minimumStrength: 0.3,
  maximumStrength: 1,
  /** Elevated must remain clearly above standard for competing attention. */
  minimumElevatedOverStandardStrengthGap: 0.18,
  maximumLightCountDelta: 0 as const,
});

export const EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY = Object.freeze({
  addsDirectionalLights: false as const,
  addsPointLights: false as const,
  addsSpotLights: false as const,
  addsPerObjectShadowMaps: false as const,
  lightCountDelta: 0 as const,
  usesMaterialResponseOnly: true as const,
  recreatesMaterialsEveryFrame: false as const,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function stabilize(value: number): number {
  return Object.is(value, -0) ? 0 : value;
}

function clamp(value: number, min: number, max: number): number {
  return stabilize(Math.min(max, Math.max(min, value)));
}

function normalizeAttention(attention: string | undefined): string {
  return (attention ?? "normal").toLowerCase();
}

function normalizeMarker(marker: string | undefined): string {
  return (marker ?? "none").toLowerCase();
}

function isElevatedAttention(attention: string | undefined): boolean {
  const value = normalizeAttention(attention);
  return (
    value === "critical" ||
    value === "important" ||
    value === "elevated"
  );
}

function isDiscoverableMarker(marker: string | undefined): boolean {
  const value = normalizeMarker(marker);
  return (
    value === "critical" ||
    value === "attention" ||
    value === "unresolved"
  );
}

function isBackgroundRole(input: ExecutiveLightingHierarchyInput): boolean {
  if (input.presentationTarget === "context-node" && input.focused !== true) {
    return true;
  }
  const spatial = (input.spatialRole ?? "").toLowerCase();
  const stage = (input.stageRole ?? "").toLowerCase();
  return spatial === "background" || stage === "unrelated";
}

/**
 * Map existing Stage presentation signals → lighting emphasis level.
 * Precedence (presentation-only):
 *   focused → primary
 *   critical/important/elevated/selected/discoverable marker → elevated
 *   background/context → background
 *   else → standard
 */
export function mapPresentationStateToLightingEmphasisLevel(
  input: ExecutiveLightingHierarchyInput,
): ExecutiveLightingEmphasisLevel {
  if (input.focused === true) {
    return "primary";
  }

  if (
    input.selected === true ||
    isElevatedAttention(input.attention) ||
    isDiscoverableMarker(input.stateMarker)
  ) {
    return "elevated";
  }

  if (isBackgroundRole(input)) {
    return "background";
  }

  return "standard";
}

function buildEmphasis(
  objectId: string,
  level: ExecutiveLightingEmphasisLevel,
): ExecutiveLightingEmphasis {
  const profile = EXECUTIVE_LIGHTING_EMPHASIS_PROFILES[level];
  return Object.freeze({
    objectId,
    level: profile.level,
    rank: profile.rank,
    strength: profile.strength,
    response: profile.response,
    preservesSemanticColor: true as const,
    preservesDataReality: true as const,
  });
}

// ─── Resolver ───────────────────────────────────────────────────────────────

/**
 * Deterministic per-object lighting hierarchy resolution.
 * Same presentation inputs → identical ExecutiveLightingEmphasis.
 */
export function resolveExecutiveLightingEmphasis(
  input: ExecutiveLightingHierarchyInput,
): ExecutiveLightingEmphasis {
  const level = mapPresentationStateToLightingEmphasisLevel(input);
  return buildEmphasis(input.objectId, level);
}

/**
 * Scene-level hierarchy resolution with stable ordering.
 * Guarantees critical non-focused objects remain elevated when focus exists.
 */
export function resolveExecutiveLightingHierarchy(
  objects: readonly ExecutiveLightingHierarchyInput[],
): ExecutiveLightingHierarchySceneResult {
  const byId = new Map<string, ExecutiveLightingEmphasis>();

  for (const object of objects) {
    byId.set(object.objectId, resolveExecutiveLightingEmphasis(object));
  }

  const orderedObjectIds = Object.freeze(
    [...byId.values()]
      .sort((a, b) => {
        if (a.rank !== b.rank) return a.rank - b.rank;
        if (a.strength !== b.strength) return b.strength - a.strength;
        return a.objectId.localeCompare(b.objectId);
      })
      .map((entry) => entry.objectId),
  );

  return Object.freeze({
    identity: executiveLightingHierarchyIdentity,
    version: executiveLightingHierarchyVersion,
    byId,
    orderedObjectIds,
    lightCountDelta: 0 as const,
    shadowStrategyUnchanged: true as const,
    foundationProfileCanonical: true as const,
  });
}

/**
 * Apply restrained lighting-response modulation to a resolved material.
 * Never mutates the input material or semantic color fields.
 */
export function applyExecutiveLightingHierarchyToMaterial<
  T extends ExecutiveLightingHierarchyMaterialSurface,
>(
  material: T,
  emphasis: ExecutiveLightingEmphasis,
): T {
  const bounds = EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS;
  const response = emphasis.response;

  const nextEmissive = clamp(
    material.emissiveIntensity + response.emissiveLift,
    bounds.minimumEmissive,
    bounds.maximumEmissive,
  );
  const nextRoughness = clamp(
    material.roughness + response.roughnessDelta,
    bounds.minimumRoughness,
    bounds.maximumRoughness,
  );
  const nextEnvMap = clamp(
    material.envMapIntensity *
      response.envMapMultiplier *
      response.lightResponseMultiplier,
    bounds.minimumEnvMapIntensity,
    bounds.maximumEnvMapIntensity,
  );

  if (
    nextEmissive === material.emissiveIntensity &&
    nextRoughness === material.roughness &&
    nextEnvMap === material.envMapIntensity
  ) {
    return material;
  }

  return Object.freeze({
    ...material,
    color: material.color,
    emissiveColor: material.emissiveColor,
    emissiveIntensity: nextEmissive,
    roughness: nextRoughness,
    envMapIntensity: nextEnvMap,
  }) as T;
}

export function compareExecutiveLightingEmphasisStrength(
  left: ExecutiveLightingEmphasis,
  right: ExecutiveLightingEmphasis,
): number {
  if (left.strength === right.strength) return 0;
  return left.strength > right.strength ? 1 : -1;
}

export function verifyExecutiveLightingHierarchy(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly primaryStrongest: boolean;
  readonly criticalCompetingElevated: boolean;
  readonly normalReadable: boolean;
  readonly backgroundQuieter: boolean;
  readonly semanticColorPreserved: boolean;
  readonly dataRealityPreserved: boolean;
  readonly rangesValid: boolean;
  readonly complexityBounded: boolean;
  readonly sp31Canonical: boolean;
  readonly shadowUnchanged: boolean;
}> {
  const identity = getExecutiveLightingHierarchyIdentity();
  const identityValid =
    identity.id === "SP:3.2/ExecutiveLightingHierarchy" &&
    identity.version === "3.2.0" &&
    identity.namespace ===
      "nexora.spatial-presentation.executive-lighting-hierarchy" &&
    identity.architecturalRole ===
      "PresentationOnlyExecutiveLightingHierarchy" &&
    identity.upstreamLightingFoundation ===
      "SP:3.1/ExecutiveLightingFoundation";

  const boundaryValid =
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.presentationOnly === true &&
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.ownsDataReality === false &&
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.replacesSp31LightingFoundation ===
      false &&
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.introducesObjectSpecificLights ===
      false &&
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.mutatesSemanticColors === false;

  const sample = Object.freeze({
    objects: Object.freeze([
      Object.freeze({
        objectId: "revenue",
        focused: true,
        attention: "normal",
        spatialRole: "focus",
        stageRole: "focused",
      }),
      Object.freeze({
        objectId: "capacity",
        focused: false,
        attention: "critical",
        stateMarker: "critical",
        spatialRole: "background",
        stageRole: "unrelated",
      }),
      Object.freeze({
        objectId: "pipeline",
        focused: false,
        attention: "normal",
        spatialRole: "related",
        stageRole: "related",
      }),
      Object.freeze({
        objectId: "context-a",
        focused: false,
        attention: "normal",
        presentationTarget: "context-node" as const,
        spatialRole: "background",
      }),
    ]),
  });

  const a = resolveExecutiveLightingHierarchy(sample.objects);
  const b = resolveExecutiveLightingHierarchy(sample.objects);
  const deterministic =
    JSON.stringify([...a.byId.entries()]) ===
      JSON.stringify([...b.byId.entries()]) &&
    JSON.stringify(a.orderedObjectIds) === JSON.stringify(b.orderedObjectIds);

  const primary = a.byId.get("revenue")!;
  const critical = a.byId.get("capacity")!;
  const normal = a.byId.get("pipeline")!;
  const background = a.byId.get("context-a")!;

  const primaryStrongest =
    primary.level === "primary" &&
    primary.strength > critical.strength &&
    primary.strength > normal.strength &&
    primary.strength > background.strength;

  const criticalCompetingElevated =
    critical.level === "elevated" &&
    critical.strength >
      EXECUTIVE_LIGHTING_EMPHASIS_PROFILES.standard.strength +
        EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumElevatedOverStandardStrengthGap -
        0.01;

  const normalReadable =
    normal.level === "standard" &&
    normal.strength >= EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumStrength;

  const backgroundQuieter =
    background.level === "background" &&
    background.strength < normal.strength;

  const materialSample = Object.freeze({
    color: "#536478",
    emissiveColor: "#536478",
    emissiveIntensity: 0.08,
    roughness: 0.46,
    metalness: 0.22,
    opacity: 1,
    transparent: false,
    envMapIntensity: 0.38,
  });
  const applied = applyExecutiveLightingHierarchyToMaterial(
    materialSample,
    primary,
  );
  const semanticColorPreserved =
    applied.color === materialSample.color &&
    applied.emissiveColor === materialSample.emissiveColor &&
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.mutatesSemanticColors === false;

  const dataRealityPreserved =
    primary.preservesDataReality === true &&
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.ownsDataReality === false;

  const rangesValid =
    primary.strength <= EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.maximumStrength &&
    background.strength >= EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumStrength &&
    applied.emissiveIntensity <=
      EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.maximumEmissive &&
    applied.emissiveIntensity >=
      EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumEmissive;

  const complexityBounded =
    a.lightCountDelta === 0 &&
    EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY.lightCountDelta === 0 &&
    EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY.addsSpotLights === false &&
    EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY.usesMaterialResponseOnly === true;

  const foundation = resolveExecutiveLightingProfile({
    profileId: "executive-default",
  });
  const sp31Canonical =
    foundation.identity === executiveLightingFoundationIdentity &&
    foundation.version === executiveLightingFoundationVersion &&
    foundation.profileId === "executive-default" &&
    a.foundationProfileCanonical === true &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.presentationOnly === true;

  const shadowUnchanged =
    a.shadowStrategyUnchanged === true &&
    foundation.shadow.castFromKeyOnly === true &&
    EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.stageGround.receiveShadow === true &&
    EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.contextNodes.castShadow === false &&
    EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS.keyCastsShadowsOnly === true;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    primaryStrongest &&
    criticalCompetingElevated &&
    normalReadable &&
    backgroundQuieter &&
    semanticColorPreserved &&
    dataRealityPreserved &&
    rangesValid &&
    complexityBounded &&
    sp31Canonical &&
    shadowUnchanged;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    primaryStrongest,
    criticalCompetingElevated,
    normalReadable,
    backgroundQuieter,
    semanticColorPreserved,
    dataRealityPreserved,
    rangesValid,
    complexityBounded,
    sp31Canonical,
    shadowUnchanged,
  });
}
