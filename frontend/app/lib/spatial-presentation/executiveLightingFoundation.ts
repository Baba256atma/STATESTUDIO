/**
 * SP:3.1 — Executive Lighting Foundation.
 *
 * Presentation-only lighting architecture for the Nexora Executive Stage.
 * Improves object depth, silhouette readability, spatial hierarchy, ground
 * perception, and premium separation — without owning business truth,
 * Data Reality, camera contracts, or SP:2 composition.
 *
 * Dependency direction (required):
 *   Stage presentation / environment visual state
 *     → Executive Lighting Resolver
 *       → Executive Lighting Configuration
 *         → NexoraExecutiveLightingRig (R3F boundary only)
 *
 * Framework-independent resolver. No post-processing, bloom, fog ownership,
 * volumetric effects, or workspace/focus-reactive themes in SP:3.1.
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveLightingFoundationIdentity =
  "SP:3.1/ExecutiveLightingFoundation" as const;

export const executiveLightingFoundationVersion = "3.1.0" as const;

export const executiveLightingFoundationNamespace =
  "nexora.spatial-presentation.executive-lighting" as const;

export const executiveLightingFoundationPhase =
  "ExecutiveLightingFoundation" as const;

export const executiveLightingFoundationArchitecturalRole =
  "PresentationOnlyExecutiveLightingFoundation" as const;

export const executiveLightingFoundationReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveLightingFoundationIdentity = {
  readonly id: typeof executiveLightingFoundationIdentity;
  readonly version: typeof executiveLightingFoundationVersion;
  readonly namespace: typeof executiveLightingFoundationNamespace;
  readonly phase: typeof executiveLightingFoundationPhase;
  readonly architecturalRole: typeof executiveLightingFoundationArchitecturalRole;
};

const FOUNDATION_IDENTITY: ExecutiveLightingFoundationIdentity = Object.freeze({
  id: executiveLightingFoundationIdentity,
  version: executiveLightingFoundationVersion,
  namespace: executiveLightingFoundationNamespace,
  phase: executiveLightingFoundationPhase,
  architecturalRole: executiveLightingFoundationArchitecturalRole,
});

export function getExecutiveLightingFoundationIdentity(): ExecutiveLightingFoundationIdentity {
  return FOUNDATION_IDENTITY;
}

export const EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveLightingFoundationArchitecturalRole,
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
  introducesWorkspaceSpecificLighting: false as const,
  introducesFocusReactiveLighting: false as const,
  introducesAttentionReactiveLighting: false as const,
  introducesObjectSpecificSpotlights: false as const,
  introducesAnimatedLightingTransitions: false as const,
  introducesCinematicLighting: false as const,
  introducesBloom: false as const,
  introducesDepthOfField: false as const,
  introducesFogOwnership: false as const,
  introducesVolumetricEffects: false as const,
  introducesColorGrading: false as const,
  introducesPostProcessing: false as const,
  frameworkIndependentResolver: true as const,
  presentationOnly: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveLightingProfileId = "executive-default";

export type ExecutiveLightingVector = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export type ExecutiveLightingTuple = readonly [number, number, number];

/**
 * Ground illumination / material response — restrained Stage floor perception.
 * Not decorative floor geometry.
 */
export type ExecutiveLightingGroundResponse = {
  readonly hemisphereIntensity: number;
  readonly skyColor: string;
  readonly groundColor: string;
  readonly receiveShadows: boolean;
  readonly materialMetalness: number;
  readonly materialRoughness: number;
};

/**
 * Centralized deterministic lighting tokens (SP:3.1).
 * Raw intensity/position values must not be scattered through React components.
 */
export type ExecutiveLightingTokens = {
  readonly ambientIntensity: number;
  readonly keyIntensity: number;
  readonly keyPosition: ExecutiveLightingVector;
  readonly keyColor: string;
  readonly fillIntensity: number;
  readonly fillPosition: ExecutiveLightingVector;
  readonly fillColor: string;
  readonly rimIntensity: number;
  readonly rimPosition: ExecutiveLightingVector;
  readonly rimColor: string;
  readonly groundResponse: ExecutiveLightingGroundResponse;
  readonly shadowEnabled: boolean;
  readonly shadowBias: number;
  readonly shadowNormalBias: number;
  readonly shadowMapSize: number;
};

export type ExecutiveLightingProfile = {
  readonly id: ExecutiveLightingProfileId;
  readonly label: string;
  readonly tokens: ExecutiveLightingTokens;
};

/**
 * Optional environment color/intensity hints from Stage presentation.
 * SP:3.1 does not introduce workspace lighting themes — hints may tint colors
 * within foundation bounds while preserving Key > Fill hierarchy.
 */
export type ExecutiveLightingEnvironmentHints = {
  readonly ambientIntensity?: number;
  readonly keyLightIntensity?: number;
  readonly keyLightColor?: string;
  readonly fillLightIntensity?: number;
  readonly fillLightColor?: string;
  readonly groundColor?: string;
};

export type ResolveExecutiveLightingProfileInput = {
  readonly profileId?: ExecutiveLightingProfileId;
  readonly environment?: ExecutiveLightingEnvironmentHints;
};

/**
 * Resolved presentation configuration consumed by the R3F lighting rig.
 */
export type ExecutiveLightingConfiguration = {
  readonly identity: typeof executiveLightingFoundationIdentity;
  readonly version: typeof executiveLightingFoundationVersion;
  readonly profileId: ExecutiveLightingProfileId;
  readonly tokens: ExecutiveLightingTokens;
  readonly lightTypes: readonly ExecutiveLightingLightType[];
  readonly hierarchy: ExecutiveLightingHierarchy;
  readonly shadow: ExecutiveLightingShadowConfiguration;
  readonly shadowParticipation: typeof EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION;
  readonly materialCompatibility: typeof EXECUTIVE_LIGHTING_MATERIAL_COMPATIBILITY;
};

export type ExecutiveLightingLightType =
  | "ambient"
  | "key-directional"
  | "fill-directional"
  | "rim-directional"
  | "hemisphere-ground";

export type ExecutiveLightingHierarchy = {
  readonly keyGreaterThanFill: true;
  readonly keyIntensity: number;
  readonly fillIntensity: number;
  readonly rimIntensity: number;
  readonly ambientIntensity: number;
  readonly keyToFillRatio: number;
};

export type ExecutiveLightingShadowConfiguration = {
  readonly enabled: boolean;
  readonly bias: number;
  readonly normalBias: number;
  readonly mapSize: number;
  readonly castFromKeyOnly: true;
  readonly softIntensityBias: number;
  readonly camera: Readonly<{
    readonly near: number;
    readonly far: number;
    readonly size: number;
  }>;
};

// ─── Bounds ─────────────────────────────────────────────────────────────────

export const EXECUTIVE_LIGHTING_TOKEN_BOUNDS = Object.freeze({
  ambientIntensity: Object.freeze({ min: 0.12, max: 0.42 }),
  keyIntensity: Object.freeze({ min: 0.65, max: 1.35 }),
  fillIntensity: Object.freeze({ min: 0.12, max: 0.55 }),
  rimIntensity: Object.freeze({ min: 0.05, max: 0.35 }),
  hemisphereIntensity: Object.freeze({ min: 0.06, max: 0.28 }),
  shadowBias: Object.freeze({ min: -0.001, max: 0 }),
  shadowNormalBias: Object.freeze({ min: 0, max: 0.08 }),
  shadowMapSize: Object.freeze({
    allowed: Object.freeze([512, 1024, 2048] as const),
    default: 1024 as const,
    maximum: 2048 as const,
  }),
  materialMetalness: Object.freeze({ min: 0, max: 0.25 }),
  materialRoughness: Object.freeze({ min: 0.7, max: 1 }),
  minimumKeyToFillRatio: 1.35,
});

/**
 * Explicit shadow participation — do not auto-enable every Stage element.
 */
export const EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION = Object.freeze({
  stageObjectGeometry: Object.freeze({
    castShadow: true,
    receiveShadow: true,
  }),
  stageGround: Object.freeze({
    castShadow: false,
    receiveShadow: true,
  }),
  contextNodes: Object.freeze({
    castShadow: false,
    receiveShadow: true,
  }),
  pickingHelpers: Object.freeze({
    castShadow: false,
    receiveShadow: false,
  }),
  edgeChannels: Object.freeze({
    castShadow: false,
    receiveShadow: false,
  }),
  focusPedestals: Object.freeze({
    castShadow: false,
    receiveShadow: false,
  }),
  labels: Object.freeze({
    castShadow: false,
    receiveShadow: false,
  }),
  connections: Object.freeze({
    castShadow: false,
    receiveShadow: false,
  }),
});

/**
 * Material compatibility contract for SP:3.1 lighting response.
 * Objects must remain lit (MeshStandard-compatible); unlit body materials
 * are incompatible with the executive lighting rig.
 */
export const EXECUTIVE_LIGHTING_MATERIAL_COMPATIBILITY = Object.freeze({
  requiredBodyMaterialFamily: "MeshStandardMaterial" as const,
  unlitBodyMaterialsAllowed: false as const,
  edgeChannelMayRemainUnlit: true as const,
  pickingHelpersMayRemainUnlit: true as const,
  preservesSemanticColors: true as const,
  preservesAttentionState: true as const,
  preservesFocusState: true as const,
  preservesSelectionState: true as const,
  redesignsObjectAppearance: false as const,
});

export const EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS = Object.freeze({
  maximumDynamicLights: 5 as const,
  keyCastsShadowsOnly: true as const,
  maximumShadowMapSize: 2048 as const,
  defaultShadowMapSize: 1024 as const,
  noPostProcessing: true as const,
  noVolumetricLighting: true as const,
  noBloom: true as const,
  noRayTracedEffects: true as const,
  noPerFrameLightingAllocations: true as const,
});

export const EXECUTIVE_LIGHTING_LIGHT_TYPES = Object.freeze([
  "ambient",
  "key-directional",
  "fill-directional",
  "rim-directional",
  "hemisphere-ground",
] as const satisfies readonly ExecutiveLightingLightType[]);

// ─── Canonical profile ──────────────────────────────────────────────────────

/**
 * Restrained executive product-visualization lighting.
 * Elevated off-axis key; softer opposing fill; subtle rear/upper rim.
 */
export const EXECUTIVE_DEFAULT_LIGHTING_TOKENS: ExecutiveLightingTokens =
  Object.freeze({
    ambientIntensity: 0.26,
    keyIntensity: 1.08,
    keyPosition: Object.freeze({ x: 4.4, y: 8.2, z: 4.6 }),
    keyColor: "#f3f5f7",
    fillIntensity: 0.36,
    fillPosition: Object.freeze({ x: -5.4, y: 3.1, z: -2.9 }),
    fillColor: "#9aadc0",
    rimIntensity: 0.18,
    rimPosition: Object.freeze({ x: -1.8, y: 5.8, z: -6.2 }),
    rimColor: "#c9d4e0",
    groundResponse: Object.freeze({
      hemisphereIntensity: 0.16,
      skyColor: "#d7dee8",
      groundColor: "#1a2230",
      receiveShadows: true,
      materialMetalness: 0.07,
      materialRoughness: 0.9,
    }),
    shadowEnabled: true,
    shadowBias: -0.00018,
    shadowNormalBias: 0.025,
    shadowMapSize: 1024,
  });

export const EXECUTIVE_DEFAULT_LIGHTING_PROFILE: ExecutiveLightingProfile =
  Object.freeze({
    id: "executive-default",
    label: "Executive Default",
    tokens: EXECUTIVE_DEFAULT_LIGHTING_TOKENS,
  });

export const EXECUTIVE_LIGHTING_PROFILES = Object.freeze({
  "executive-default": EXECUTIVE_DEFAULT_LIGHTING_PROFILE,
} as const satisfies Record<
  ExecutiveLightingProfileId,
  ExecutiveLightingProfile
>);

const SHADOW_CAMERA = Object.freeze({
  near: 0.5,
  far: 28,
  size: 11,
});

// Softens perceived shadow darkness without disabling grounding.
const SHADOW_SOFT_INTENSITY_BIAS = 0.42;

// ─── Helpers ────────────────────────────────────────────────────────────────

function stabilize(value: number): number {
  return Object.is(value, -0) ? 0 : value;
}

function clamp(value: number, min: number, max: number): number {
  return stabilize(Math.min(max, Math.max(min, value)));
}

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function freezeVector(vector: ExecutiveLightingVector): ExecutiveLightingVector {
  return Object.freeze({
    x: stabilize(vector.x),
    y: stabilize(vector.y),
    z: stabilize(vector.z),
  });
}

export function toExecutiveLightingTuple(
  vector: ExecutiveLightingVector,
): ExecutiveLightingTuple {
  return Object.freeze([vector.x, vector.y, vector.z] as const);
}

function assertSafeShadowMapSize(size: number): number {
  const allowed = EXECUTIVE_LIGHTING_TOKEN_BOUNDS.shadowMapSize.allowed;
  if ((allowed as readonly number[]).includes(size)) {
    return size;
  }
  return EXECUTIVE_LIGHTING_TOKEN_BOUNDS.shadowMapSize.default;
}

function sanitizeTokens(tokens: ExecutiveLightingTokens): ExecutiveLightingTokens {
  const bounds = EXECUTIVE_LIGHTING_TOKEN_BOUNDS;
  const ambientIntensity = clamp(
    tokens.ambientIntensity,
    bounds.ambientIntensity.min,
    bounds.ambientIntensity.max,
  );
  let keyIntensity = clamp(
    tokens.keyIntensity,
    bounds.keyIntensity.min,
    bounds.keyIntensity.max,
  );
  let fillIntensity = clamp(
    tokens.fillIntensity,
    bounds.fillIntensity.min,
    bounds.fillIntensity.max,
  );
  const rimIntensity = clamp(
    tokens.rimIntensity,
    bounds.rimIntensity.min,
    bounds.rimIntensity.max,
  );

  // Enforce Key > Fill hierarchy deterministically.
  if (keyIntensity <= fillIntensity * bounds.minimumKeyToFillRatio) {
    fillIntensity = clamp(
      keyIntensity / bounds.minimumKeyToFillRatio,
      bounds.fillIntensity.min,
      bounds.fillIntensity.max,
    );
  }
  if (keyIntensity <= fillIntensity) {
    keyIntensity = clamp(
      fillIntensity * bounds.minimumKeyToFillRatio,
      bounds.keyIntensity.min,
      bounds.keyIntensity.max,
    );
  }

  return Object.freeze({
    ambientIntensity,
    keyIntensity,
    keyPosition: freezeVector(tokens.keyPosition),
    keyColor: isHexColor(tokens.keyColor)
      ? tokens.keyColor.toLowerCase()
      : EXECUTIVE_DEFAULT_LIGHTING_TOKENS.keyColor,
    fillIntensity,
    fillPosition: freezeVector(tokens.fillPosition),
    fillColor: isHexColor(tokens.fillColor)
      ? tokens.fillColor.toLowerCase()
      : EXECUTIVE_DEFAULT_LIGHTING_TOKENS.fillColor,
    rimIntensity,
    rimPosition: freezeVector(tokens.rimPosition),
    rimColor: isHexColor(tokens.rimColor)
      ? tokens.rimColor.toLowerCase()
      : EXECUTIVE_DEFAULT_LIGHTING_TOKENS.rimColor,
    groundResponse: Object.freeze({
      hemisphereIntensity: clamp(
        tokens.groundResponse.hemisphereIntensity,
        bounds.hemisphereIntensity.min,
        bounds.hemisphereIntensity.max,
      ),
      skyColor: isHexColor(tokens.groundResponse.skyColor)
        ? tokens.groundResponse.skyColor.toLowerCase()
        : EXECUTIVE_DEFAULT_LIGHTING_TOKENS.groundResponse.skyColor,
      groundColor: isHexColor(tokens.groundResponse.groundColor)
        ? tokens.groundResponse.groundColor.toLowerCase()
        : EXECUTIVE_DEFAULT_LIGHTING_TOKENS.groundResponse.groundColor,
      receiveShadows: tokens.groundResponse.receiveShadows === true,
      materialMetalness: clamp(
        tokens.groundResponse.materialMetalness,
        bounds.materialMetalness.min,
        bounds.materialMetalness.max,
      ),
      materialRoughness: clamp(
        tokens.groundResponse.materialRoughness,
        bounds.materialRoughness.min,
        bounds.materialRoughness.max,
      ),
    }),
    shadowEnabled: tokens.shadowEnabled === true,
    shadowBias: clamp(
      tokens.shadowBias,
      bounds.shadowBias.min,
      bounds.shadowBias.max,
    ),
    shadowNormalBias: clamp(
      tokens.shadowNormalBias,
      bounds.shadowNormalBias.min,
      bounds.shadowNormalBias.max,
    ),
    shadowMapSize: assertSafeShadowMapSize(tokens.shadowMapSize),
  });
}

/**
 * Soft environment tint — preserves foundation intensities/positions while
 * allowing existing Stage environment colors to tint key/fill/ground.
 * Does not create workspace-specific lighting themes.
 */
function applyEnvironmentHints(
  base: ExecutiveLightingTokens,
  environment?: ExecutiveLightingEnvironmentHints,
): ExecutiveLightingTokens {
  if (environment == null) {
    return base;
  }

  return Object.freeze({
    ...base,
    keyColor:
      environment.keyLightColor != null && isHexColor(environment.keyLightColor)
        ? environment.keyLightColor.toLowerCase()
        : base.keyColor,
    fillColor:
      environment.fillLightColor != null &&
      isHexColor(environment.fillLightColor)
        ? environment.fillLightColor.toLowerCase()
        : base.fillColor,
    groundResponse: Object.freeze({
      ...base.groundResponse,
      groundColor:
        environment.groundColor != null && isHexColor(environment.groundColor)
          ? environment.groundColor.toLowerCase()
          : base.groundResponse.groundColor,
    }),
  });
}

function buildHierarchy(
  tokens: ExecutiveLightingTokens,
): ExecutiveLightingHierarchy {
  return Object.freeze({
    keyGreaterThanFill: true as const,
    keyIntensity: tokens.keyIntensity,
    fillIntensity: tokens.fillIntensity,
    rimIntensity: tokens.rimIntensity,
    ambientIntensity: tokens.ambientIntensity,
    keyToFillRatio: stabilize(tokens.keyIntensity / tokens.fillIntensity),
  });
}

function buildShadowConfiguration(
  tokens: ExecutiveLightingTokens,
): ExecutiveLightingShadowConfiguration {
  return Object.freeze({
    enabled: tokens.shadowEnabled,
    bias: tokens.shadowBias,
    normalBias: tokens.shadowNormalBias,
    mapSize: tokens.shadowMapSize,
    castFromKeyOnly: true as const,
    softIntensityBias: SHADOW_SOFT_INTENSITY_BIAS,
    camera: SHADOW_CAMERA,
  });
}

// ─── Resolver ───────────────────────────────────────────────────────────────

/**
 * Deterministic presentation-only lighting resolver.
 * Same Stage configuration + profile + environment hints → identical output.
 */
export function resolveExecutiveLightingProfile(
  input: ResolveExecutiveLightingProfileInput = {},
): ExecutiveLightingConfiguration {
  const profileId = input.profileId ?? "executive-default";
  const profile =
    EXECUTIVE_LIGHTING_PROFILES[profileId] ?? EXECUTIVE_DEFAULT_LIGHTING_PROFILE;

  const hinted = applyEnvironmentHints(profile.tokens, input.environment);
  const tokens = sanitizeTokens(hinted);
  const hierarchy = buildHierarchy(tokens);
  const shadow = buildShadowConfiguration(tokens);

  return Object.freeze({
    identity: executiveLightingFoundationIdentity,
    version: executiveLightingFoundationVersion,
    profileId: profile.id,
    tokens,
    lightTypes: EXECUTIVE_LIGHTING_LIGHT_TYPES,
    hierarchy,
    shadow,
    shadowParticipation: EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION,
    materialCompatibility: EXECUTIVE_LIGHTING_MATERIAL_COMPATIBILITY,
  });
}

export function validateExecutiveLightingTokens(
  tokens: ExecutiveLightingTokens,
): Readonly<{
  readonly ok: boolean;
  readonly keyGreaterThanFill: boolean;
  readonly positionsFinite: boolean;
  readonly intensitiesInRange: boolean;
  readonly shadowValid: boolean;
  readonly colorsValid: boolean;
}> {
  const bounds = EXECUTIVE_LIGHTING_TOKEN_BOUNDS;
  const positionsFinite =
    isFiniteNumber(tokens.keyPosition.x) &&
    isFiniteNumber(tokens.keyPosition.y) &&
    isFiniteNumber(tokens.keyPosition.z) &&
    isFiniteNumber(tokens.fillPosition.x) &&
    isFiniteNumber(tokens.fillPosition.y) &&
    isFiniteNumber(tokens.fillPosition.z) &&
    isFiniteNumber(tokens.rimPosition.x) &&
    isFiniteNumber(tokens.rimPosition.y) &&
    isFiniteNumber(tokens.rimPosition.z);

  const intensitiesInRange =
    tokens.ambientIntensity >= bounds.ambientIntensity.min &&
    tokens.ambientIntensity <= bounds.ambientIntensity.max &&
    tokens.keyIntensity >= bounds.keyIntensity.min &&
    tokens.keyIntensity <= bounds.keyIntensity.max &&
    tokens.fillIntensity >= bounds.fillIntensity.min &&
    tokens.fillIntensity <= bounds.fillIntensity.max &&
    tokens.rimIntensity >= bounds.rimIntensity.min &&
    tokens.rimIntensity <= bounds.rimIntensity.max &&
    tokens.groundResponse.hemisphereIntensity >=
      bounds.hemisphereIntensity.min &&
    tokens.groundResponse.hemisphereIntensity <=
      bounds.hemisphereIntensity.max;

  const keyGreaterThanFill =
    tokens.keyIntensity > tokens.fillIntensity &&
    tokens.keyIntensity / tokens.fillIntensity >= bounds.minimumKeyToFillRatio;

  const shadowValid =
    typeof tokens.shadowEnabled === "boolean" &&
    tokens.shadowBias >= bounds.shadowBias.min &&
    tokens.shadowBias <= bounds.shadowBias.max &&
    tokens.shadowNormalBias >= bounds.shadowNormalBias.min &&
    tokens.shadowNormalBias <= bounds.shadowNormalBias.max &&
    (bounds.shadowMapSize.allowed as readonly number[]).includes(
      tokens.shadowMapSize,
    );

  const colorsValid =
    isHexColor(tokens.keyColor) &&
    isHexColor(tokens.fillColor) &&
    isHexColor(tokens.rimColor) &&
    isHexColor(tokens.groundResponse.skyColor) &&
    isHexColor(tokens.groundResponse.groundColor);

  return Object.freeze({
    ok:
      keyGreaterThanFill &&
      positionsFinite &&
      intensitiesInRange &&
      shadowValid &&
      colorsValid,
    keyGreaterThanFill,
    positionsFinite,
    intensitiesInRange,
    shadowValid,
    colorsValid,
  });
}

export function verifyExecutiveLightingFoundation(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly resolutionDeterministic: boolean;
  readonly tokensValid: boolean;
  readonly hierarchyValid: boolean;
  readonly shadowValid: boolean;
  readonly presentationOnly: boolean;
  readonly environmentCompatible: boolean;
}> {
  const identity = getExecutiveLightingFoundationIdentity();
  const identityValid =
    identity.id === "SP:3.1/ExecutiveLightingFoundation" &&
    identity.version === "3.1.0" &&
    identity.namespace ===
      "nexora.spatial-presentation.executive-lighting" &&
    identity.architecturalRole ===
      "PresentationOnlyExecutiveLightingFoundation";

  const boundaryValid =
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsDataReality === false &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsCameraContracts === false &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsSp2CompositionContracts ===
      false &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.introducesPostProcessing === false &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.frameworkIndependentResolver ===
      true &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.presentationOnly === true;

  const environmentHints: ExecutiveLightingEnvironmentHints = Object.freeze({
    keyLightColor: "#f8fafc",
    fillLightColor: "#93c5fd",
    groundColor: "#111827",
  });

  const a = resolveExecutiveLightingProfile({
    profileId: "executive-default",
    environment: environmentHints,
  });
  const b = resolveExecutiveLightingProfile({
    profileId: "executive-default",
    environment: environmentHints,
  });
  const resolutionDeterministic = JSON.stringify(a) === JSON.stringify(b);

  const tokenCheck = validateExecutiveLightingTokens(a.tokens);
  const tokensValid = tokenCheck.ok;
  const hierarchyValid =
    a.hierarchy.keyGreaterThanFill === true &&
    a.tokens.keyIntensity > a.tokens.fillIntensity &&
    a.hierarchy.keyToFillRatio >=
      EXECUTIVE_LIGHTING_TOKEN_BOUNDS.minimumKeyToFillRatio;
  const shadowValid =
    a.shadow.enabled === true &&
    a.shadow.castFromKeyOnly === true &&
    a.shadow.mapSize <=
      EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS.maximumShadowMapSize &&
    tokenCheck.shadowValid;

  const presentationOnly =
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.presentationOnly === true &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsFocusSemantics === false &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsSelectionSemantics === false &&
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsWorkspaceSemantics === false;

  // Compatible with current Stage environment visual tokens (color tint only).
  const environmentCompatible =
    a.tokens.keyColor === "#f8fafc" &&
    a.tokens.fillColor === "#93c5fd" &&
    a.tokens.groundResponse.groundColor === "#111827" &&
    a.profileId === "executive-default";

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    resolutionDeterministic &&
    tokensValid &&
    hierarchyValid &&
    shadowValid &&
    presentationOnly &&
    environmentCompatible;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    resolutionDeterministic,
    tokensValid,
    hierarchyValid,
    shadowValid,
    presentationOnly,
    environmentCompatible,
  });
}
