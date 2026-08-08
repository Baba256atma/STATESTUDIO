/**
 * DRI-8:1 — Director Runtime Consumer Integration Foundation.
 *
 * Establishes immutable vocabulary and plain-data contracts for connecting
 * the frozen Director Runtime platform to Nexora consumer experiences.
 * Defines WHAT the experience should present/emphasize/expose/react to —
 * never HOW it is visually rendered, animated, or interacted with.
 *
 * Principle: DRI-8 = semantic consumer contract.
 * Executive Experience = visual implementation.
 */

import { directorRuntimeExecutiveGuidancePublicIndexIdentity } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeConsumerIntegrationFoundationIdentity =
  "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation" as const;
export const directorRuntimeConsumerIntegrationFoundationVersion =
  "8.1.0" as const;
export const directorRuntimeConsumerIntegrationFoundationNamespace =
  "nexora.dri.consumer-integration.foundation" as const;
export const directorRuntimeConsumerIntegrationFoundationUpstream =
  directorRuntimeExecutiveGuidancePublicIndexIdentity;

export const directorRuntimeConsumerIntegrationFoundationCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeConsumerIntegrationFoundationIdentity,
    version: directorRuntimeConsumerIntegrationFoundationVersion,
    namespace: directorRuntimeConsumerIntegrationFoundationNamespace,
    upstream: directorRuntimeConsumerIntegrationFoundationUpstream,
  });

// ─── Principle & architectural boundary ─────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PRINCIPLE =
  "Director Runtime determines semantic experience intent. Consumer UI determines rendering implementation." as const;

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_BOUNDARY = Object.freeze({
  runtimeAuthority: "Director-Runtime" as const,
  driAuthority: "DRI-8" as const,
  experienceAuthority: "Executive-Experience" as const,
  semanticIntentOwner: "Director-Runtime" as const,
  renderingOwner: "Consumer-UI" as const,
  consumesPublicIndexOnly: true as const,
  soleImmediateDependency: "DRI-7:9" as const,
  frameworkIndependent: true as const,
  mutatesUpstreamRuntime: false as const,
});

// ─── Consumer definition ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_FAMILIES = Object.freeze([
  "executive-experience",
] as const);
export type DirectorRuntimeConsumerFamily =
  (typeof DIRECTOR_RUNTIME_CONSUMER_FAMILIES)[number];

/**
 * Approved Nexora experience capable of consuming Director Runtime output.
 * Framework-independent — no UI-framework or component concepts.
 */
export interface DirectorRuntimeConsumer {
  readonly consumerId: string;
  readonly consumerFamily: DirectorRuntimeConsumerFamily;
}

// ─── Experience surface vocabulary ──────────────────────────────────────────

/** Semantic experience surfaces — not UI components. */
export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACES = Object.freeze([
  "stage",
  "advisor",
  "insight",
  "live-lens",
  "timeline",
  "explorer",
] as const);
export type DirectorRuntimeExperienceSurface =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACES)[number];

// ─── Consumer binding vocabulary ────────────────────────────────────────────

/** Semantic binding kinds connecting Director Runtime output to a surface. */
export const DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS = Object.freeze([
  "context",
  "state",
  "scene",
  "presentation",
  "attention",
  "guidance",
  "interaction",
  "coordination",
] as const);
export type DirectorRuntimeConsumerBindingKind =
  (typeof DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS)[number];

export interface DirectorRuntimeConsumerBindingDescriptor {
  readonly bindingId: string;
  readonly bindingKind: DirectorRuntimeConsumerBindingKind;
  readonly surface: DirectorRuntimeExperienceSurface;
  readonly consumerId: string;
}

// ─── Experience projection vocabulary ───────────────────────────────────────

/** Categories of Director Runtime information prepared for experience consumption. */
export const DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS = Object.freeze([
  "identity",
  "context",
  "state",
  "scene",
  "focus",
  "visibility",
  "presentation",
  "attention",
  "guidance",
  "interaction",
] as const);
export type DirectorRuntimeExperienceProjectionKind =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS)[number];

/**
 * Immutable Director Runtime information prepared for an experience.
 * A projection is NOT rendered UI.
 */
export interface DirectorRuntimeExperienceProjection {
  readonly projectionId: string;
  readonly projectionKind: DirectorRuntimeExperienceProjectionKind;
  readonly surface: DirectorRuntimeExperienceSurface;
  readonly subjectId?: string;
  readonly attributes?: Readonly<
    Record<string, string | number | boolean | null>
  >;
}

// ─── Consumer interaction vocabulary ────────────────────────────────────────

/** Semantic consumer-to-runtime interaction intents — not browser/framework events. */
export const DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS = Object.freeze([
  "select",
  "focus",
  "activate",
  "hover",
  "navigate",
  "inspect",
  "dismiss",
] as const);
export type DirectorRuntimeConsumerInteractionKind =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS)[number];

export interface DirectorRuntimeConsumerInteractionIntent {
  readonly intentId: string;
  readonly interactionKind: DirectorRuntimeConsumerInteractionKind;
  readonly surface: DirectorRuntimeExperienceSurface;
  readonly subjectId?: string;
}

// ─── Experience coordination vocabulary ─────────────────────────────────────

/**
 * Immutable vocabulary names for multi-surface coordination contracts.
 * Describes coordinated surfaces — does not implement orchestration.
 */
export const DIRECTOR_RUNTIME_COORDINATION_VOCABULARY = Object.freeze([
  "primary-surface",
  "supporting-surfaces",
  "affected-surfaces",
  "coordination-scope",
  "coordination-reason",
] as const);
export type DirectorRuntimeCoordinationVocabularyTerm =
  (typeof DIRECTOR_RUNTIME_COORDINATION_VOCABULARY)[number];

export const DIRECTOR_RUNTIME_COORDINATION_SCOPES = Object.freeze([
  "experience",
  "surface-set",
  "binding",
] as const);
export type DirectorRuntimeCoordinationScope =
  (typeof DIRECTOR_RUNTIME_COORDINATION_SCOPES)[number];

export const DIRECTOR_RUNTIME_COORDINATION_REASONS = Object.freeze([
  "selection-changed",
  "focus-changed",
  "context-changed",
  "guidance-changed",
  "state-changed",
  "attention-changed",
] as const);
export type DirectorRuntimeCoordinationReason =
  (typeof DIRECTOR_RUNTIME_COORDINATION_REASONS)[number];

export interface DirectorRuntimeExperienceCoordinationDescriptor {
  readonly coordinationId: string;
  readonly primarySurface: DirectorRuntimeExperienceSurface;
  readonly supportingSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly affectedSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly coordinationScope: DirectorRuntimeCoordinationScope;
  readonly coordinationReason: DirectorRuntimeCoordinationReason;
}

// ─── Surface capability contracts ───────────────────────────────────────────

/**
 * Projection/binding capabilities a surface may consume.
 * Union of binding and projection kind vocabularies relevant to surface allow-lists.
 */
export const DIRECTOR_RUNTIME_SURFACE_CAPABILITY_KINDS = Object.freeze([
  "identity",
  "context",
  "state",
  "scene",
  "focus",
  "visibility",
  "presentation",
  "attention",
  "guidance",
  "interaction",
  "coordination",
] as const);
export type DirectorRuntimeSurfaceCapabilityKind =
  (typeof DIRECTOR_RUNTIME_SURFACE_CAPABILITY_KINDS)[number];

export type DirectorRuntimeExperienceSurfaceCapabilities = Readonly<{
  readonly [K in DirectorRuntimeExperienceSurface]: ReadonlyArray<
    DirectorRuntimeSurfaceCapabilityKind
  >;
}>;

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITIES =
  Object.freeze({
    stage: Object.freeze([
      "scene",
      "presentation",
      "attention",
      "interaction",
    ] as const),
    advisor: Object.freeze([
      "context",
      "guidance",
      "attention",
    ] as const),
    insight: Object.freeze([
      "context",
      "state",
      "guidance",
    ] as const),
    "live-lens": Object.freeze([
      "scene",
      "focus",
      "visibility",
      "attention",
    ] as const),
    timeline: Object.freeze([
      "state",
      "context",
      "interaction",
    ] as const),
    explorer: Object.freeze([
      "context",
      "state",
      "scene",
      "interaction",
    ] as const),
  }) satisfies DirectorRuntimeExperienceSurfaceCapabilities;

// ─── Consumer boundary guarantees ───────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "semantic-intent-owner",
    statement:
      "Director Runtime determines semantic experience intent.",
  }),
  Object.freeze({
    id: "rendering-owner",
    statement: "Consumer UI determines rendering implementation.",
  }),
  Object.freeze({
    id: "framework-independent-runtime",
    statement: "Runtime contracts MUST remain framework-independent.",
  }),
  Object.freeze({
    id: "no-upstream-mutation",
    statement:
      "Consumer integration MUST NOT mutate upstream Director Runtime state.",
  }),
  Object.freeze({
    id: "immutable-projections",
    statement: "Consumer projections MUST be immutable.",
  }),
  Object.freeze({
    id: "no-ui-leakage",
    statement: "UI implementation details MUST NOT leak into DRI.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    statement: "DRI MUST NOT depend on the react UI library.",
  }),
  Object.freeze({
    id: "no-threejs-dependency",
    statement: "DRI MUST NOT depend on Three.js.",
  }),
  Object.freeze({
    id: "no-dom-event-dependency",
    statement: "DRI MUST NOT depend on DOM/browser event types.",
  }),
  Object.freeze({
    id: "approved-contract-coupling",
    statement:
      "Consumer surfaces communicate through approved DRI contracts rather than direct hidden coupling.",
  }),
] as const);

export type DirectorRuntimeConsumerBoundaryGuarantee =
  (typeof DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES)[number];

// ─── Foundation invariants ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FOUNDATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "semantic-not-visual",
      statement:
        "DRI-8 describes semantic consumer contracts; Executive Experience owns visual realization",
    }),
    Object.freeze({
      id: "surfaces-not-components",
      statement:
        "experience surfaces are semantic identifiers, never UI components",
    }),
    Object.freeze({
      id: "bindings-semantic-only",
      statement:
        "bindings describe semantic relationships without markup, DOM, CSS, Three.js, or handlers",
    }),
    Object.freeze({
      id: "projections-not-ui",
      statement: "projections are immutable prepared information, not rendered UI",
    }),
    Object.freeze({
      id: "interactions-not-events",
      statement:
        "interaction kinds are semantic intents, never browser or framework events",
    }),
    Object.freeze({
      id: "coordination-vocabulary-only",
      statement:
        "coordination vocabulary describes multi-surface participation without orchestration behavior",
    }),
    Object.freeze({
      id: "capability-references-valid",
      statement:
        "surface capabilities reference only known surfaces and capability kinds",
    }),
    Object.freeze({
      id: "vocabulary-uniqueness",
      statement: "every canonical registry contains unique values",
    }),
    Object.freeze({
      id: "sole-upstream-dri-7-9",
      statement: "DRI-8:1 depends only on DRI-7:9 Public Index",
    }),
    Object.freeze({
      id: "no-runtime-mutation",
      statement:
        "constructors and registry access must not mutate caller-provided or upstream values",
    }),
  ] as const);

export type DirectorRuntimeConsumerIntegrationFoundationInvariant =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FOUNDATION_INVARIANTS)[number];

// ─── Vocabulary membership ──────────────────────────────────────────────────

export function isDirectorRuntimeConsumerFamily(
  value: unknown,
): value is DirectorRuntimeConsumerFamily {
  return (DIRECTOR_RUNTIME_CONSUMER_FAMILIES as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeExperienceSurface(
  value: unknown,
): value is DirectorRuntimeExperienceSurface {
  return (DIRECTOR_RUNTIME_EXPERIENCE_SURFACES as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeConsumerBindingKind(
  value: unknown,
): value is DirectorRuntimeConsumerBindingKind {
  return (
    DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceProjectionKind(
  value: unknown,
): value is DirectorRuntimeExperienceProjectionKind {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeConsumerInteractionKind(
  value: unknown,
): value is DirectorRuntimeConsumerInteractionKind {
  return (
    DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeCoordinationScope(
  value: unknown,
): value is DirectorRuntimeCoordinationScope {
  return (DIRECTOR_RUNTIME_COORDINATION_SCOPES as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeCoordinationReason(
  value: unknown,
): value is DirectorRuntimeCoordinationReason {
  return (
    DIRECTOR_RUNTIME_COORDINATION_REASONS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeSurfaceCapabilityKind(
  value: unknown,
): value is DirectorRuntimeSurfaceCapabilityKind {
  return (
    DIRECTOR_RUNTIME_SURFACE_CAPABILITY_KINDS as readonly unknown[]
  ).includes(value);
}

// ─── Immutable constructors ─────────────────────────────────────────────────

function requireOpaqueId(value: string, field: string): void {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
}

export function createDirectorRuntimeConsumer(
  input: DirectorRuntimeConsumer,
): DirectorRuntimeConsumer {
  requireOpaqueId(input.consumerId, "consumerId");
  if (!isDirectorRuntimeConsumerFamily(input.consumerFamily)) {
    throw new TypeError("consumerFamily must be a known consumer family");
  }
  return Object.freeze({
    consumerId: input.consumerId,
    consumerFamily: input.consumerFamily,
  });
}

export function createDirectorRuntimeConsumerBindingDescriptor(
  input: DirectorRuntimeConsumerBindingDescriptor,
): DirectorRuntimeConsumerBindingDescriptor {
  requireOpaqueId(input.bindingId, "bindingId");
  requireOpaqueId(input.consumerId, "consumerId");
  if (!isDirectorRuntimeConsumerBindingKind(input.bindingKind)) {
    throw new TypeError("bindingKind must be a known consumer binding kind");
  }
  if (!isDirectorRuntimeExperienceSurface(input.surface)) {
    throw new TypeError("surface must be a known experience surface");
  }
  return Object.freeze({
    bindingId: input.bindingId,
    bindingKind: input.bindingKind,
    surface: input.surface,
    consumerId: input.consumerId,
  });
}

export function createDirectorRuntimeExperienceProjection(
  input: DirectorRuntimeExperienceProjection,
): DirectorRuntimeExperienceProjection {
  requireOpaqueId(input.projectionId, "projectionId");
  if (!isDirectorRuntimeExperienceProjectionKind(input.projectionKind)) {
    throw new TypeError("projectionKind must be a known projection kind");
  }
  if (!isDirectorRuntimeExperienceSurface(input.surface)) {
    throw new TypeError("surface must be a known experience surface");
  }
  const projection: DirectorRuntimeExperienceProjection = {
    projectionId: input.projectionId,
    projectionKind: input.projectionKind,
    surface: input.surface,
  };
  const withSubject =
    input.subjectId !== undefined
      ? { ...projection, subjectId: input.subjectId }
      : projection;
  if (input.attributes !== undefined) {
    return Object.freeze({
      ...withSubject,
      attributes: Object.freeze({ ...input.attributes }),
    });
  }
  return Object.freeze(withSubject);
}

export function createDirectorRuntimeConsumerInteractionIntent(
  input: DirectorRuntimeConsumerInteractionIntent,
): DirectorRuntimeConsumerInteractionIntent {
  requireOpaqueId(input.intentId, "intentId");
  if (!isDirectorRuntimeConsumerInteractionKind(input.interactionKind)) {
    throw new TypeError(
      "interactionKind must be a known consumer interaction kind",
    );
  }
  if (!isDirectorRuntimeExperienceSurface(input.surface)) {
    throw new TypeError("surface must be a known experience surface");
  }
  const intent: DirectorRuntimeConsumerInteractionIntent = {
    intentId: input.intentId,
    interactionKind: input.interactionKind,
    surface: input.surface,
  };
  if (input.subjectId !== undefined) {
    return Object.freeze({ ...intent, subjectId: input.subjectId });
  }
  return Object.freeze(intent);
}

export function createDirectorRuntimeExperienceCoordinationDescriptor(
  input: DirectorRuntimeExperienceCoordinationDescriptor,
): DirectorRuntimeExperienceCoordinationDescriptor {
  requireOpaqueId(input.coordinationId, "coordinationId");
  if (!isDirectorRuntimeExperienceSurface(input.primarySurface)) {
    throw new TypeError("primarySurface must be a known experience surface");
  }
  if (!isDirectorRuntimeCoordinationScope(input.coordinationScope)) {
    throw new TypeError("coordinationScope must be a known coordination scope");
  }
  if (!isDirectorRuntimeCoordinationReason(input.coordinationReason)) {
    throw new TypeError(
      "coordinationReason must be a known coordination reason",
    );
  }
  for (const surface of input.supportingSurfaces) {
    if (!isDirectorRuntimeExperienceSurface(surface)) {
      throw new TypeError(
        "supportingSurfaces must contain only known experience surfaces",
      );
    }
  }
  for (const surface of input.affectedSurfaces) {
    if (!isDirectorRuntimeExperienceSurface(surface)) {
      throw new TypeError(
        "affectedSurfaces must contain only known experience surfaces",
      );
    }
  }
  return Object.freeze({
    coordinationId: input.coordinationId,
    primarySurface: input.primarySurface,
    supportingSurfaces: Object.freeze([...input.supportingSurfaces]),
    affectedSurfaces: Object.freeze([...input.affectedSurfaces]),
    coordinationScope: input.coordinationScope,
    coordinationReason: input.coordinationReason,
  });
}

// ─── Public foundation APIs ─────────────────────────────────────────────────

export function getDirectorRuntimeConsumerIntegrationFoundationIdentity():
  typeof directorRuntimeConsumerIntegrationFoundationCanonicalIdentity {
  return directorRuntimeConsumerIntegrationFoundationCanonicalIdentity;
}

export function listDirectorRuntimeExperienceSurfaces():
  ReadonlyArray<DirectorRuntimeExperienceSurface> {
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACES;
}

export function listDirectorRuntimeConsumerBindingKinds():
  ReadonlyArray<DirectorRuntimeConsumerBindingKind> {
  return DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS;
}

export function listDirectorRuntimeExperienceProjectionKinds():
  ReadonlyArray<DirectorRuntimeExperienceProjectionKind> {
  return DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS;
}

export function listDirectorRuntimeConsumerInteractionKinds():
  ReadonlyArray<DirectorRuntimeConsumerInteractionKind> {
  return DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS;
}

export function getDirectorRuntimeExperienceSurfaceCapabilities(
  surface: DirectorRuntimeExperienceSurface,
): ReadonlyArray<DirectorRuntimeSurfaceCapabilityKind> {
  if (!isDirectorRuntimeExperienceSurface(surface)) {
    throw new TypeError("surface must be a known experience surface");
  }
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITIES[surface];
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeConsumerIntegrationFoundationApiNames =
  Object.freeze([
    "getDirectorRuntimeConsumerIntegrationFoundationIdentity",
    "listDirectorRuntimeExperienceSurfaces",
    "isDirectorRuntimeExperienceSurface",
    "listDirectorRuntimeConsumerBindingKinds",
    "listDirectorRuntimeExperienceProjectionKinds",
    "listDirectorRuntimeConsumerInteractionKinds",
    "getDirectorRuntimeExperienceSurfaceCapabilities",
    "isDirectorRuntimeConsumerFamily",
    "isDirectorRuntimeConsumerBindingKind",
    "isDirectorRuntimeExperienceProjectionKind",
    "isDirectorRuntimeConsumerInteractionKind",
    "isDirectorRuntimeCoordinationScope",
    "isDirectorRuntimeCoordinationReason",
    "isDirectorRuntimeSurfaceCapabilityKind",
    "createDirectorRuntimeConsumer",
    "createDirectorRuntimeConsumerBindingDescriptor",
    "createDirectorRuntimeExperienceProjection",
    "createDirectorRuntimeConsumerInteractionIntent",
    "createDirectorRuntimeExperienceCoordinationDescriptor",
    "verifyDirectorRuntimeConsumerIntegrationFoundation",
  ] as const);

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeConsumerFamily",
    "DirectorRuntimeConsumer",
    "DirectorRuntimeExperienceSurface",
    "DirectorRuntimeConsumerBindingKind",
    "DirectorRuntimeConsumerBindingDescriptor",
    "DirectorRuntimeExperienceProjectionKind",
    "DirectorRuntimeExperienceProjection",
    "DirectorRuntimeConsumerInteractionKind",
    "DirectorRuntimeConsumerInteractionIntent",
    "DirectorRuntimeCoordinationVocabularyTerm",
    "DirectorRuntimeCoordinationScope",
    "DirectorRuntimeCoordinationReason",
    "DirectorRuntimeExperienceCoordinationDescriptor",
    "DirectorRuntimeSurfaceCapabilityKind",
    "DirectorRuntimeExperienceSurfaceCapabilities",
    "DirectorRuntimeConsumerBoundaryGuarantee",
    "DirectorRuntimeConsumerIntegrationFoundationInvariant",
    "DirectorRuntimeConsumerIntegrationFoundationVerification",
  ] as const);

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_REGISTRY_SECTIONS =
  Object.freeze([
    "identity",
    "consumer",
    "surfaces",
    "bindings",
    "projections",
    "interactions",
    "coordination",
    "capabilities",
    "boundary-guarantees",
  ] as const);

export const directorRuntimeConsumerIntegrationFoundationRegistry =
  Object.freeze({
    identity: directorRuntimeConsumerIntegrationFoundationIdentity,
    version: directorRuntimeConsumerIntegrationFoundationVersion,
    namespace: directorRuntimeConsumerIntegrationFoundationNamespace,
    dependency: directorRuntimeConsumerIntegrationFoundationUpstream,
    principle: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PRINCIPLE,
    boundary: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_BOUNDARY,
    consumerFamilies: DIRECTOR_RUNTIME_CONSUMER_FAMILIES,
    consumerFamilyCount: DIRECTOR_RUNTIME_CONSUMER_FAMILIES.length,
    surfaces: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
    surfaceCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
    bindingKinds: DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS,
    bindingKindCount: DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS.length,
    projectionKinds: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS,
    projectionKindCount: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS.length,
    interactionKinds: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS,
    interactionKindCount: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS.length,
    coordinationVocabulary: DIRECTOR_RUNTIME_COORDINATION_VOCABULARY,
    coordinationVocabularyCount:
      DIRECTOR_RUNTIME_COORDINATION_VOCABULARY.length,
    coordinationScopes: DIRECTOR_RUNTIME_COORDINATION_SCOPES,
    coordinationScopeCount: DIRECTOR_RUNTIME_COORDINATION_SCOPES.length,
    coordinationReasons: DIRECTOR_RUNTIME_COORDINATION_REASONS,
    coordinationReasonCount: DIRECTOR_RUNTIME_COORDINATION_REASONS.length,
    surfaceCapabilityKinds: DIRECTOR_RUNTIME_SURFACE_CAPABILITY_KINDS,
    surfaceCapabilityKindCount:
      DIRECTOR_RUNTIME_SURFACE_CAPABILITY_KINDS.length,
    surfaceCapabilities: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITIES,
    surfaceCapabilityRegistryCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
    boundaryGuarantees: DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES,
    boundaryGuaranteeCount:
      DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES.length,
    invariants: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FOUNDATION_INVARIANTS,
    invariantCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FOUNDATION_INVARIANTS.length,
    registrySections: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_REGISTRY_SECTIONS,
    registrySectionCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_REGISTRY_SECTIONS.length,
    publicTypes: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.length,
    publicApis: directorRuntimeConsumerIntegrationFoundationApiNames,
    publicApiCount:
      directorRuntimeConsumerIntegrationFoundationApiNames.length,
  });

export const directorRuntimeConsumerIntegrationFoundation = Object.freeze({
  phase: "DRI-8:1" as const,
  name: "DirectorRuntimeConsumerIntegrationFoundation" as const,
  identity: directorRuntimeConsumerIntegrationFoundationIdentity,
  namespace: directorRuntimeConsumerIntegrationFoundationNamespace,
  version: directorRuntimeConsumerIntegrationFoundationVersion,
  layer: "DirectorRuntimeConsumerIntegration" as const,
  domain: "DirectorRuntimeConsumerIntegration" as const,
  role: "Foundation" as const,
  stage: "Foundation" as const,
  status: "FoundationReady" as const,
  upstreamDependency: directorRuntimeConsumerIntegrationFoundationUpstream,
  deterministic: true as const,
  foundation: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  philosophy: "semantic-consumer-contract-not-visual-implementation" as const,
  principle: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_BOUNDARY,
  consumerFamilies: DIRECTOR_RUNTIME_CONSUMER_FAMILIES,
  surfaces: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  bindingKinds: DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS,
  projectionKinds: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS,
  interactionKinds: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS,
  coordinationVocabulary: DIRECTOR_RUNTIME_COORDINATION_VOCABULARY,
  coordinationScopes: DIRECTOR_RUNTIME_COORDINATION_SCOPES,
  coordinationReasons: DIRECTOR_RUNTIME_COORDINATION_REASONS,
  surfaceCapabilities: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITIES,
  boundaryGuarantees: DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES,
  invariants: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FOUNDATION_INVARIANTS,
  publicApiSurface: directorRuntimeConsumerIntegrationFoundationApiNames,
  publicTypes: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES,
  registry: directorRuntimeConsumerIntegrationFoundationRegistry,
  executiveGuidanceBoundary: "DRI-7:9-public-index-only" as const,
  architecturalStatus:
    "Foundation Complete · Deterministic · Immutable · Framework-Independent · ReadyForConsumerContextBinding" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerIntegrationFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeConsumerIntegrationFoundationIdentity;
  readonly version: typeof directorRuntimeConsumerIntegrationFoundationVersion;
  readonly namespace: typeof directorRuntimeConsumerIntegrationFoundationNamespace;
  readonly dependency: typeof directorRuntimeConsumerIntegrationFoundationUpstream;
  readonly consumerFamilyCount: number;
  readonly surfaceCount: number;
  readonly bindingKindCount: number;
  readonly projectionKindCount: number;
  readonly interactionKindCount: number;
  readonly coordinationVocabularyCount: number;
  readonly surfaceCapabilityRegistryCount: number;
  readonly boundaryGuaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly dri7BoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly capabilitiesValid: boolean;
  readonly coordinationValid: boolean;
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function surfaceCapabilitiesValid(): boolean {
  const capabilitySet = new Set<string>(
    DIRECTOR_RUNTIME_SURFACE_CAPABILITY_KINDS,
  );
  const surfaceSet = new Set<string>(DIRECTOR_RUNTIME_EXPERIENCE_SURFACES);
  const capabilityEntries = Object.entries(
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITIES,
  );
  if (capabilityEntries.length !== DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length) {
    return false;
  }
  for (const [surface, capabilities] of capabilityEntries) {
    if (!surfaceSet.has(surface)) return false;
    const capabilityList = capabilities as readonly string[];
    if (!Array.isArray(capabilityList) || capabilityList.length < 1) {
      return false;
    }
    if (!unique(capabilityList)) return false;
    if (!Object.isFrozen(capabilityList)) return false;
    for (const capability of capabilityList) {
      if (!capabilitySet.has(capability)) return false;
    }
  }
  return true;
}

function coordinationVocabularyValid(): boolean {
  return (
    exactOrder(DIRECTOR_RUNTIME_COORDINATION_VOCABULARY, [
      "primary-surface",
      "supporting-surfaces",
      "affected-surfaces",
      "coordination-scope",
      "coordination-reason",
    ]) &&
    unique([...DIRECTOR_RUNTIME_COORDINATION_VOCABULARY]) &&
    exactOrder(DIRECTOR_RUNTIME_COORDINATION_SCOPES, [
      "experience",
      "surface-set",
      "binding",
    ]) &&
    unique([...DIRECTOR_RUNTIME_COORDINATION_SCOPES]) &&
    exactOrder(DIRECTOR_RUNTIME_COORDINATION_REASONS, [
      "selection-changed",
      "focus-changed",
      "context-changed",
      "guidance-changed",
      "state-changed",
      "attention-changed",
    ]) &&
    unique([...DIRECTOR_RUNTIME_COORDINATION_REASONS])
  );
}

export function verifyDirectorRuntimeConsumerIntegrationFoundation():
  DirectorRuntimeConsumerIntegrationFoundationVerification {
  const foundation = directorRuntimeConsumerIntegrationFoundation;
  const registry = directorRuntimeConsumerIntegrationFoundationRegistry;

  const identityOk =
    foundation.identity ===
      "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation" &&
    foundation.version === "8.1.0" &&
    foundation.namespace === "nexora.dri.consumer-integration.foundation" &&
    foundation.layer === "DirectorRuntimeConsumerIntegration" &&
    foundation.domain === "DirectorRuntimeConsumerIntegration" &&
    foundation.role === "Foundation" &&
    foundation.status === "FoundationReady" &&
    foundation.upstreamDependency ===
      "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex" &&
    foundation.upstreamDependency ===
      directorRuntimeExecutiveGuidancePublicIndexIdentity &&
    registry.dependency === foundation.upstreamDependency &&
    foundation.executiveGuidanceBoundary === "DRI-7:9-public-index-only";

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_FAMILIES, [
      "executive-experience",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_SURFACES, [
      "stage",
      "advisor",
      "insight",
      "live-lens",
      "timeline",
      "explorer",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS, [
      "context",
      "state",
      "scene",
      "presentation",
      "attention",
      "guidance",
      "interaction",
      "coordination",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS, [
      "identity",
      "context",
      "state",
      "scene",
      "focus",
      "visibility",
      "presentation",
      "attention",
      "guidance",
      "interaction",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS, [
      "select",
      "focus",
      "activate",
      "hover",
      "navigate",
      "inspect",
      "dismiss",
    ]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_FAMILIES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_SURFACES]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_SURFACE_CAPABILITY_KINDS]);

  const capabilitiesValid = surfaceCapabilitiesValid();
  const coordinationValid = coordinationVocabularyValid();

  const boundaryOk =
    DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES.length === 10 &&
    unique(
      DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES.map((entry) => entry.id),
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES.map((entry) => entry.id),
      [
        "semantic-intent-owner",
        "rendering-owner",
        "framework-independent-runtime",
        "no-upstream-mutation",
        "immutable-projections",
        "no-ui-leakage",
        "no-react-dependency",
        "no-threejs-dependency",
        "no-dom-event-dependency",
        "approved-contract-coupling",
      ],
    ) &&
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_BOUNDARY.consumesPublicIndexOnly &&
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_BOUNDARY.frameworkIndependent &&
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_BOUNDARY.mutatesUpstreamRuntime ===
      false;

  const registryIntegrityOk =
    registry.consumerFamilyCount ===
      DIRECTOR_RUNTIME_CONSUMER_FAMILIES.length &&
    registry.surfaceCount === DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length &&
    registry.bindingKindCount ===
      DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS.length &&
    registry.projectionKindCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS.length &&
    registry.interactionKindCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS.length &&
    registry.coordinationVocabularyCount ===
      DIRECTOR_RUNTIME_COORDINATION_VOCABULARY.length &&
    registry.surfaceCapabilityRegistryCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length &&
    registry.boundaryGuaranteeCount ===
      DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES.length &&
    registry.registrySectionCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_REGISTRY_SECTIONS.length &&
    registry.publicTypeCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      directorRuntimeConsumerIntegrationFoundationApiNames.length &&
    registry.invariantCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FOUNDATION_INVARIANTS.length;

  const immutabilityOk =
    Object.isFrozen(foundation) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      directorRuntimeConsumerIntegrationFoundationCanonicalIdentity,
    ) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_FAMILIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_COORDINATION_VOCABULARY) &&
    Object.isFrozen(DIRECTOR_RUNTIME_COORDINATION_SCOPES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_COORDINATION_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_SURFACE_CAPABILITY_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FOUNDATION_INVARIANTS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_BOUNDARY) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_REGISTRY_SECTIONS);

  const dri7BoundaryIntact =
    foundation.upstreamDependency ===
      "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex" &&
    foundation.boundary.soleImmediateDependency === "DRI-7:9" &&
    foundation.boundary.consumesPublicIndexOnly === true;

  const frameworkIndependent =
    foundation.frameworkIndependent === true &&
    foundation.rendererIndependent === true &&
    foundation.boundary.frameworkIndependent === true;

  const ok =
    identityOk &&
    vocabularyOk &&
    capabilitiesValid &&
    coordinationValid &&
    boundaryOk &&
    registryIntegrityOk &&
    immutabilityOk &&
    dri7BoundaryIntact &&
    frameworkIndependent &&
    foundation.principle === DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: directorRuntimeConsumerIntegrationFoundationIdentity,
    version: directorRuntimeConsumerIntegrationFoundationVersion,
    namespace: directorRuntimeConsumerIntegrationFoundationNamespace,
    dependency: directorRuntimeConsumerIntegrationFoundationUpstream,
    consumerFamilyCount: DIRECTOR_RUNTIME_CONSUMER_FAMILIES.length,
    surfaceCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
    bindingKindCount: DIRECTOR_RUNTIME_CONSUMER_BINDING_KINDS.length,
    projectionKindCount: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_KINDS.length,
    interactionKindCount: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS.length,
    coordinationVocabularyCount:
      DIRECTOR_RUNTIME_COORDINATION_VOCABULARY.length,
    surfaceCapabilityRegistryCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
    boundaryGuaranteeCount:
      DIRECTOR_RUNTIME_CONSUMER_BOUNDARY_GUARANTEES.length,
    registrySectionCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_REGISTRY_SECTIONS.length,
    publicApiCount:
      directorRuntimeConsumerIntegrationFoundationApiNames.length,
    invariantCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FOUNDATION_INVARIANTS.length,
    frozen: immutabilityOk,
    dri7BoundaryIntact,
    frameworkIndependent,
    capabilitiesValid,
    coordinationValid,
  });
}
