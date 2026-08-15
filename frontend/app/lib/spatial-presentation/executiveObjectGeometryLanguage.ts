/**
 * SP:2.2 — Object Type Geometry Language.
 *
 * Deterministic semantic silhouette mapping for Nexora Stage objects.
 * Geometry represents object category — never state, severity, or identity.
 *
 * Dependency direction (required):
 *   Canonical Object Kind
 *     → Semantic Geometry Family Resolution
 *       → SP:2.1 Geometry Contract
 *         → Approved Dimensions / Silhouette
 *           → R3F Geometry Renderer
 *
 * Does NOT redesign materials, severity colors, lighting, or camera/position.
 * Does not import SP:2.1 module body (avoids cycles); identity string only.
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectGeometryLanguageIdentity =
  "SP:2.2/ExecutiveObjectGeometryLanguage" as const;

export const executiveObjectGeometryLanguageVersion = "2.2.0" as const;

export const executiveObjectGeometryLanguageNamespace =
  "nexora.spatial-presentation.executive-object-geometry-language" as const;

export const executiveObjectGeometryLanguagePhase =
  "ObjectTypeGeometryLanguage" as const;

export const executiveObjectGeometryLanguageArchitecturalRole =
  "PresentationOnlySemanticObjectGeometryResolution" as const;

export const executiveObjectGeometryLanguageReadiness =
  "AwaitingHumanVisualSignOff" as const;

/** Upstream SP:2.1 identity — string only (no module import cycle). */
const UPSTREAM_VISUAL_FOUNDATION_IDENTITY =
  "SP:2.1/ExecutiveObjectVisualFoundation" as const;

export type ExecutiveObjectGeometryLanguageIdentity = {
  readonly id: typeof executiveObjectGeometryLanguageIdentity;
  readonly version: typeof executiveObjectGeometryLanguageVersion;
  readonly namespace: typeof executiveObjectGeometryLanguageNamespace;
  readonly phase: typeof executiveObjectGeometryLanguagePhase;
  readonly architecturalRole: typeof executiveObjectGeometryLanguageArchitecturalRole;
  readonly upstreamVisualFoundation: typeof UPSTREAM_VISUAL_FOUNDATION_IDENTITY;
};

const GEOMETRY_LANGUAGE_IDENTITY: ExecutiveObjectGeometryLanguageIdentity =
  Object.freeze({
    id: executiveObjectGeometryLanguageIdentity,
    version: executiveObjectGeometryLanguageVersion,
    namespace: executiveObjectGeometryLanguageNamespace,
    phase: executiveObjectGeometryLanguagePhase,
    architecturalRole: executiveObjectGeometryLanguageArchitecturalRole,
    upstreamVisualFoundation: UPSTREAM_VISUAL_FOUNDATION_IDENTITY,
  });

export function getExecutiveObjectGeometryLanguageIdentity(): ExecutiveObjectGeometryLanguageIdentity {
  return GEOMETRY_LANGUAGE_IDENTITY;
}

export const EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY = Object.freeze({
  architecturalRole: executiveObjectGeometryLanguageArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsObjectKindTruth: false as const,
  ownsSeverityTruth: false as const,
  ownsAttentionTruth: false as const,
  ownsFocusTruth: false as const,
  ownsRelationships: false as const,
  ownsSpatialPosition: false as const,
  ownsCamera: false as const,
  encodesStateInGeometry: false as const,
  usesObjectIdGeometryHacks: false as const,
  usesLabelNameGeometryHacks: false as const,
  inventsParallelTaxonomy: false as const,
  finalizesMaterialLanguage: false as const,
  finalizesSeverityColors: false as const,
  introducesDecorativeAnimation: false as const,
  replacesVisualFoundationAuthority: false as const,
  frameworkIndependentResolver: true as const,
  presentationOnly: true as const,
});

// ─── Geometry vocabulary (aligned with SP:2.1 — do not expand casually) ─────

export type ExecutiveObjectGeometryFamily =
  | "block"
  | "rounded"
  | "cylindrical"
  | "orbital"
  | "planar";

export type ExecutiveObjectDimensions = {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
};

/** Mirrors SP:2.1 Stage-safe envelope — geometry must remain inside. */
export const EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE = Object.freeze({
  canonicalWidth: 0.72,
  canonicalHeight: 0.72,
  canonicalDepth: 0.64,
  minimumWidth: 0.48,
  minimumHeight: 0.48,
  minimumDepth: 0.4,
  maximumWidth: 0.9,
  maximumHeight: 0.9,
  maximumDepth: 0.82,
});

// ─── Canonical kind vocabulary (consume existing MVP subject kinds) ─────────

/**
 * Canonical kinds accepted for geometry mapping.
 * Aligned with NexoraMVPSubjectKind + Data Reality context subject kinds.
 * Unknown strings fall back — never inferred from labels/IDs.
 */
export const EXECUTIVE_OBJECT_GEOMETRY_CANONICAL_KINDS = Object.freeze([
  "object",
  "goal",
  "kpi",
  "koi",
  "problem",
  "decision",
  "scenario",
  "execution",
  "insight",
  "guidance",
  "pack",
  "task",
] as const);

export type ExecutiveObjectGeometryCanonicalKind =
  (typeof EXECUTIVE_OBJECT_GEOMETRY_CANONICAL_KINDS)[number];

/**
 * Semantic visual families — category groups, not individual object IDs.
 * Limited set for manager literacy (not one shape per named object).
 */
export type ExecutiveObjectSemanticVisualFamily =
  | "operational"
  | "goal"
  | "kpi"
  | "risk_problem"
  | "decision"
  | "scenario"
  | "execution"
  | "context"
  | "unknown";

export type ExecutiveObjectGeometryFamilyInput = {
  readonly objectKind: string;
};

export type ExecutiveObjectGeometryResolution = {
  readonly objectKind: string;
  readonly semanticFamily: ExecutiveObjectSemanticVisualFamily;
  readonly geometryFamily: ExecutiveObjectGeometryFamily;
  readonly dimensions: ExecutiveObjectDimensions;
  readonly resourceKey: string;
  /** Extra label lift above half-height (family silhouette compensation). */
  readonly labelClearance: number;
  /** Connection radius factor relative to AABB half-extent. */
  readonly connectionRadiusFactor: number;
  /** Invisible picking volume scale relative to visual dimensions. */
  readonly pickingExtentScale: number;
};

// ─── Mapping authority (single source) ──────────────────────────────────────

type SemanticFamilyProfile = {
  readonly geometryFamily: ExecutiveObjectGeometryFamily;
  readonly dimensions: ExecutiveObjectDimensions;
  readonly resourceKey: string;
  readonly labelClearance: number;
  readonly connectionRadiusFactor: number;
  readonly pickingExtentScale: number;
};

/**
 * Volume-normalized family profiles within SP:2.1 dimension envelope.
 * Orbital/cylindrical receive slight size compensation so perceived mass
 * remains comparable to block forms.
 */
export const EXECUTIVE_OBJECT_SEMANTIC_GEOMETRY_PROFILES = Object.freeze({
  operational: Object.freeze({
    geometryFamily: "block",
    dimensions: Object.freeze({
      width: 0.72,
      height: 0.72,
      depth: 0.64,
    }),
    resourceKey: "object-geometry:block:v1",
    labelClearance: 0.36,
    connectionRadiusFactor: 1,
    pickingExtentScale: 1,
  }),
  goal: Object.freeze({
    geometryFamily: "orbital",
    // Slightly larger bounding size — spheres read smaller than cubes.
    dimensions: Object.freeze({
      width: 0.8,
      height: 0.74,
      depth: 0.8,
    }),
    resourceKey: "object-geometry:orbital:v1",
    labelClearance: 0.42,
    connectionRadiusFactor: 0.98,
    pickingExtentScale: 1.04,
  }),
  kpi: Object.freeze({
    geometryFamily: "cylindrical",
    dimensions: Object.freeze({
      width: 0.56,
      height: 0.76,
      depth: 0.56,
    }),
    resourceKey: "object-geometry:cylindrical:v1",
    labelClearance: 0.34,
    connectionRadiusFactor: 1.02,
    pickingExtentScale: 1.06,
  }),
  risk_problem: Object.freeze({
    // Compressed angular block — category silhouette, not a warning icon.
    geometryFamily: "block",
    dimensions: Object.freeze({
      width: 0.86,
      height: 0.5,
      depth: 0.56,
    }),
    resourceKey: "object-geometry:block:compressed:v1",
    labelClearance: 0.34,
    connectionRadiusFactor: 1,
    pickingExtentScale: 1.04,
  }),
  decision: Object.freeze({
    geometryFamily: "rounded",
    dimensions: Object.freeze({
      width: 0.68,
      height: 0.68,
      depth: 0.68,
    }),
    resourceKey: "object-geometry:rounded:v1",
    labelClearance: 0.36,
    connectionRadiusFactor: 1,
    pickingExtentScale: 1.02,
  }),
  scenario: Object.freeze({
    // Wide with real thickness — readable under orbit (not a flat card).
    geometryFamily: "planar",
    dimensions: Object.freeze({
      width: 0.9,
      height: 0.58,
      depth: 0.42,
    }),
    resourceKey: "object-geometry:planar:v1",
    labelClearance: 0.32,
    connectionRadiusFactor: 1.06,
    pickingExtentScale: 1.12,
  }),
  execution: Object.freeze({
    // Elongated rounded form — directional category, not an arrow.
    geometryFamily: "rounded",
    dimensions: Object.freeze({
      width: 0.9,
      height: 0.54,
      depth: 0.5,
    }),
    resourceKey: "object-geometry:rounded:elongated:v1",
    labelClearance: 0.34,
    connectionRadiusFactor: 1.02,
    pickingExtentScale: 1.06,
  }),
  context: Object.freeze({
    geometryFamily: "orbital",
    dimensions: Object.freeze({
      width: 0.6,
      height: 0.56,
      depth: 0.6,
    }),
    resourceKey: "object-geometry:orbital:context:v1",
    labelClearance: 0.38,
    connectionRadiusFactor: 0.96,
    pickingExtentScale: 1.08,
  }),
  unknown: Object.freeze({
    geometryFamily: "block",
    dimensions: Object.freeze({
      width: EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.canonicalWidth,
      height: EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.canonicalHeight,
      depth: EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.canonicalDepth,
    }),
    resourceKey: "object-geometry:block:v1",
    labelClearance: 0.36,
    connectionRadiusFactor: 1,
    pickingExtentScale: 1,
  }),
} as const satisfies Record<
  ExecutiveObjectSemanticVisualFamily,
  SemanticFamilyProfile
>);

/**
 * Canonical kind → semantic visual family.
 * Sole mapping authority — never duplicated in JSX / Advisor / Data Reality.
 */
export const EXECUTIVE_OBJECT_KIND_TO_SEMANTIC_FAMILY = Object.freeze({
  object: "operational",
  pack: "operational",
  task: "operational",
  goal: "goal",
  kpi: "kpi",
  koi: "kpi",
  problem: "risk_problem",
  decision: "decision",
  scenario: "scenario",
  execution: "execution",
  insight: "context",
  guidance: "context",
} as const satisfies Record<
  ExecutiveObjectGeometryCanonicalKind,
  ExecutiveObjectSemanticVisualFamily
>);

export const EXECUTIVE_OBJECT_GEOMETRY_SEGMENTATION = Object.freeze({
  roundedRadius: 0.07,
  roundedSmoothness: 2,
  cylinderRadialSegments: 20,
  orbitalWidthSegments: 20,
  orbitalHeightSegments: 16,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1e6) / 1e6;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function clampDimensions(
  dimensions: ExecutiveObjectDimensions,
): ExecutiveObjectDimensions {
  const envelope = EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE;
  return Object.freeze({
    width: stabilize(
      clamp(dimensions.width, envelope.minimumWidth, envelope.maximumWidth),
    ),
    height: stabilize(
      clamp(dimensions.height, envelope.minimumHeight, envelope.maximumHeight),
    ),
    depth: stabilize(
      clamp(dimensions.depth, envelope.minimumDepth, envelope.maximumDepth),
    ),
  });
}

export function isExecutiveObjectGeometryCanonicalKind(
  value: string,
): value is ExecutiveObjectGeometryCanonicalKind {
  return (
    EXECUTIVE_OBJECT_GEOMETRY_CANONICAL_KINDS as readonly string[]
  ).includes(value);
}

/**
 * Map canonical object kind → semantic visual family.
 * Unknown kinds → unknown (block fallback). Never reads labels/IDs.
 */
export function resolveExecutiveObjectSemanticVisualFamily(
  objectKind: string,
): ExecutiveObjectSemanticVisualFamily {
  if (!objectKind || typeof objectKind !== "string") {
    return "unknown";
  }
  const normalized = objectKind.trim().toLowerCase();
  if (!isExecutiveObjectGeometryCanonicalKind(normalized)) {
    return "unknown";
  }
  return EXECUTIVE_OBJECT_KIND_TO_SEMANTIC_FAMILY[normalized];
}

/**
 * Pure geometry-family resolver — SP:2.2 mapping authority.
 * State/severity/focus/selection must not be accepted as inputs.
 */
export function resolveExecutiveObjectGeometryFamily(
  input: ExecutiveObjectGeometryFamilyInput,
): ExecutiveObjectGeometryResolution {
  const rawKind =
    typeof input.objectKind === "string" && input.objectKind.length > 0
      ? input.objectKind
      : "unknown";
  const semanticFamily = resolveExecutiveObjectSemanticVisualFamily(rawKind);
  const profile = EXECUTIVE_OBJECT_SEMANTIC_GEOMETRY_PROFILES[semanticFamily];
  const dimensions = clampDimensions(profile.dimensions);

  return Object.freeze({
    objectKind: rawKind,
    semanticFamily,
    geometryFamily: profile.geometryFamily,
    dimensions,
    resourceKey: profile.resourceKey,
    labelClearance: profile.labelClearance,
    connectionRadiusFactor: profile.connectionRadiusFactor,
    pickingExtentScale: profile.pickingExtentScale,
  });
}

/**
 * Family-aware connection half-extent for occlusion / endpoint presentation.
 * Does not alter relationship source/target/direction truth.
 */
export function resolveExecutiveObjectGeometryConnectionRadius(input: {
  readonly geometryFamily: ExecutiveObjectGeometryFamily;
  readonly dimensions: ExecutiveObjectDimensions;
  readonly scale: number;
  readonly connectionRadiusFactor?: number;
}): number {
  const { dimensions, geometryFamily } = input;
  const scale =
    typeof input.scale === "number" && Number.isFinite(input.scale)
      ? input.scale
      : 1;
  const factor =
    typeof input.connectionRadiusFactor === "number" &&
    Number.isFinite(input.connectionRadiusFactor)
      ? input.connectionRadiusFactor
      : 1;

  let halfExtent: number;
  switch (geometryFamily) {
    case "orbital":
      halfExtent =
        0.5 * Math.max(dimensions.width, dimensions.height, dimensions.depth);
      break;
    case "cylindrical": {
      const radius = 0.5 * Math.max(dimensions.width, dimensions.depth);
      halfExtent = Math.max(radius, dimensions.height * 0.5);
      break;
    }
    case "planar":
      // Favor horizontal extent so lines terminate near the visible plate.
      halfExtent =
        0.5 *
        Math.max(dimensions.width, dimensions.height, dimensions.depth * 1.35);
      break;
    case "rounded":
    case "block":
    default:
      halfExtent =
        0.5 * Math.max(dimensions.width, dimensions.height, dimensions.depth);
      break;
  }

  return stabilize(clamp(halfExtent * scale * factor, 0.22, 0.62));
}

export function verifyExecutiveObjectGeometryLanguage(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly operationalConsistent: boolean;
  readonly stateInvariant: boolean;
  readonly unknownFallback: boolean;
  readonly presentationOnly: boolean;
}> {
  const identity = getExecutiveObjectGeometryLanguageIdentity();
  const identityValid =
    identity.id === "SP:2.2/ExecutiveObjectGeometryLanguage" &&
    identity.version === "2.2.0" &&
    identity.upstreamVisualFoundation ===
      "SP:2.1/ExecutiveObjectVisualFoundation";

  const boundaryValid =
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.encodesStateInGeometry ===
      false &&
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.usesObjectIdGeometryHacks ===
      false &&
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.usesLabelNameGeometryHacks ===
      false &&
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY
      .replacesVisualFoundationAuthority === false;

  const sample = Object.freeze({ objectKind: "decision" });
  const a = resolveExecutiveObjectGeometryFamily(sample);
  const b = resolveExecutiveObjectGeometryFamily(sample);
  const deterministic = JSON.stringify(a) === JSON.stringify(b);

  const operationalIds = ["object", "pack", "task"] as const;
  const operationalFamilies = operationalIds.map(
    (kind) =>
      resolveExecutiveObjectGeometryFamily({ objectKind: kind }).semanticFamily,
  );
  const operationalConsistent = operationalFamilies.every(
    (family) => family === "operational",
  );

  // Geometry ignores presentation state — only objectKind is consumed.
  const stateInvariant =
    resolveExecutiveObjectGeometryFamily({ objectKind: "problem" })
      .geometryFamily ===
    resolveExecutiveObjectGeometryFamily({ objectKind: "problem" })
      .geometryFamily;

  const unknown = resolveExecutiveObjectGeometryFamily({
    objectKind: "future-unknown-type",
  });
  const unknownFallback =
    unknown.semanticFamily === "unknown" &&
    unknown.geometryFamily === "block";

  const presentationOnly =
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.presentationOnly === true;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    operationalConsistent &&
    stateInvariant &&
    unknownFallback &&
    presentationOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    operationalConsistent,
    stateInvariant,
    unknownFallback,
    presentationOnly,
  });
}
