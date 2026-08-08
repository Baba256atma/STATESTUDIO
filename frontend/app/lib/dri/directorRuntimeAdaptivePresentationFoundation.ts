/**
 * DRI-5:1 — Director Runtime Adaptive Presentation Foundation.
 *
 * Establishes immutable, renderer-independent presentation vocabulary and
 * plain-data contracts. Describes semantic presentation requirements only;
 * performs no resolution, orchestration, or rendering.
 */

import { directorRuntimeInteractionOrchestrationPublicIndexIdentity } from
  "@/app/lib/dri/directorRuntimeInteractionOrchestrationPublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAdaptivePresentationFoundationIdentity =
  "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation" as const;
export const directorRuntimeAdaptivePresentationFoundationVersion =
  "5.1.0" as const;
export const directorRuntimeAdaptivePresentationFoundationNamespace =
  "nexora.dri.adaptive-presentation.foundation" as const;
export const directorRuntimeAdaptivePresentationFoundationUpstream =
  directorRuntimeInteractionOrchestrationPublicIndexIdentity;

/** Canonical identity metadata — deterministic, immutable, inspectable. */
export const directorRuntimeAdaptivePresentationFoundationCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAdaptivePresentationFoundationIdentity,
    version: directorRuntimeAdaptivePresentationFoundationVersion,
    namespace: directorRuntimeAdaptivePresentationFoundationNamespace,
    upstream: directorRuntimeAdaptivePresentationFoundationUpstream,
  });

// ─── Presentation states ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_STATES = Object.freeze([
  "minimum",
  "report",
  "operation",
] as const);
export type DirectorRuntimePresentationState =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_STATES)[number];

export type DirectorRuntimePresentationInformationLevel =
  | "lowest"
  | "executive"
  | "action-capable";

export type DirectorRuntimePresentationActionCapability =
  | "none"
  | "informational"
  | "executive-operation";

export interface DirectorRuntimePresentationStateDescriptor {
  readonly state: DirectorRuntimePresentationState;
  readonly informationLevel: DirectorRuntimePresentationInformationLevel;
  readonly actionCapability: DirectorRuntimePresentationActionCapability;
  readonly executivePurpose: string;
}

export const DIRECTOR_RUNTIME_PRESENTATION_STATE_DESCRIPTORS = Object.freeze({
  minimum: Object.freeze({
    state: "minimum",
    informationLevel: "lowest",
    actionCapability: "none",
    executivePurpose:
      "Lowest-information representation for identity, caption, presence, and basic status.",
  } satisfies DirectorRuntimePresentationStateDescriptor),
  report: Object.freeze({
    state: "report",
    informationLevel: "executive",
    actionCapability: "informational",
    executivePurpose:
      "Executive information representation for status, KPI, trend, risk, warning, and summary context.",
  } satisfies DirectorRuntimePresentationStateDescriptor),
  operation: Object.freeze({
    state: "operation",
    informationLevel: "action-capable",
    actionCapability: "executive-operation",
    executivePurpose:
      "Action-capable executive representation for decisions, approvals, and runtime operation context.",
  } satisfies DirectorRuntimePresentationStateDescriptor),
} as const);

export const DIRECTOR_RUNTIME_PRESENTATION_STATE_DESCRIPTOR_LIST = Object.freeze(
  DIRECTOR_RUNTIME_PRESENTATION_STATES.map(
    (state) => DIRECTOR_RUNTIME_PRESENTATION_STATE_DESCRIPTORS[state],
  ),
);

// ─── Attention levels ───────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_LEVELS = Object.freeze([
  "normal",
  "notice",
  "warning",
  "critical",
] as const);
export type DirectorRuntimeAttentionLevel =
  (typeof DIRECTOR_RUNTIME_ATTENTION_LEVELS)[number];

// ─── Information density ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INFORMATION_DENSITIES = Object.freeze([
  "minimal",
  "standard",
  "expanded",
] as const);
export type DirectorRuntimeInformationDensity =
  (typeof DIRECTOR_RUNTIME_INFORMATION_DENSITIES)[number];

// ─── Presentation priority ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES = Object.freeze([
  "low",
  "normal",
  "high",
  "urgent",
] as const);
export type DirectorRuntimePresentationPriority =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES)[number];

// ─── Presentation visibility ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES = Object.freeze([
  "visible",
  "hidden",
  "collapsed",
] as const);
export type DirectorRuntimePresentationVisibility =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES)[number];

// ─── Interaction exposure ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INTERACTION_EXPOSURES = Object.freeze([
  "none",
  "inspect",
  "select",
  "operate",
] as const);
export type DirectorRuntimeInteractionExposure =
  (typeof DIRECTOR_RUNTIME_INTERACTION_EXPOSURES)[number];

// ─── Plain-data contracts ───────────────────────────────────────────────────

/** Renderer-independent subject whose presentation is being described. */
export interface DirectorRuntimePresentationSubject {
  readonly subjectId: string;
  readonly subjectKind: string;
  readonly namespace?: string;
}

/** Foundational semantic presentation intent — data contract only. */
export interface DirectorRuntimePresentationIntent {
  readonly subject: DirectorRuntimePresentationSubject;
  readonly state: DirectorRuntimePresentationState;
  readonly attention: DirectorRuntimeAttentionLevel;
  readonly density: DirectorRuntimeInformationDensity;
  readonly priority: DirectorRuntimePresentationPriority;
  readonly visibility: DirectorRuntimePresentationVisibility;
  readonly interactionExposure: DirectorRuntimeInteractionExposure;
}

/**
 * Minimal immutable context references for later DRI-5 resolution stages.
 * Prefer identifiers over duplicated upstream structures.
 */
export interface DirectorRuntimePresentationContext {
  readonly runtimeContextId?: string;
  readonly sceneContextId?: string;
  readonly interactionContextId?: string;
  readonly focusContextId?: string;
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
}

/** Semantic capability surface a consumer may support. */
export interface DirectorRuntimePresentationCapability {
  readonly presentationStates: readonly DirectorRuntimePresentationState[];
  readonly attentionLevels: readonly DirectorRuntimeAttentionLevel[];
  readonly informationDensities: readonly DirectorRuntimeInformationDensity[];
  readonly priorities: readonly DirectorRuntimePresentationPriority[];
  readonly visibilities: readonly DirectorRuntimePresentationVisibility[];
  readonly interactionExposures: readonly DirectorRuntimeInteractionExposure[];
}

/** Full semantic capability covering the entire foundation vocabulary. */
export const DIRECTOR_RUNTIME_PRESENTATION_FULL_CAPABILITY = Object.freeze({
  presentationStates: DIRECTOR_RUNTIME_PRESENTATION_STATES,
  attentionLevels: DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  informationDensities: DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  priorities: DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  visibilities: DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  interactionExposures: DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
} satisfies DirectorRuntimePresentationCapability);

// ─── Vocabulary predicates ──────────────────────────────────────────────────

export function isDirectorRuntimePresentationState(
  value: unknown,
): value is DirectorRuntimePresentationState {
  return (DIRECTOR_RUNTIME_PRESENTATION_STATES as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeAttentionLevel(
  value: unknown,
): value is DirectorRuntimeAttentionLevel {
  return (DIRECTOR_RUNTIME_ATTENTION_LEVELS as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeInformationDensity(
  value: unknown,
): value is DirectorRuntimeInformationDensity {
  return (DIRECTOR_RUNTIME_INFORMATION_DENSITIES as readonly unknown[]).includes(value);
}

export function isDirectorRuntimePresentationPriority(
  value: unknown,
): value is DirectorRuntimePresentationPriority {
  return (DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES as readonly unknown[]).includes(value);
}

export function isDirectorRuntimePresentationVisibility(
  value: unknown,
): value is DirectorRuntimePresentationVisibility {
  return (DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeInteractionExposure(
  value: unknown,
): value is DirectorRuntimeInteractionExposure {
  return (DIRECTOR_RUNTIME_INTERACTION_EXPOSURES as readonly unknown[]).includes(value);
}

// ─── Immutable construction helpers (no resolution) ─────────────────────────

export function createDirectorRuntimePresentationSubject(
  input: DirectorRuntimePresentationSubject,
): DirectorRuntimePresentationSubject {
  return Object.freeze({ ...input });
}

export function createDirectorRuntimePresentationIntent(
  input: DirectorRuntimePresentationIntent,
): DirectorRuntimePresentationIntent {
  return Object.freeze({
    subject: createDirectorRuntimePresentationSubject(input.subject),
    state: input.state,
    attention: input.attention,
    density: input.density,
    priority: input.priority,
    visibility: input.visibility,
    interactionExposure: input.interactionExposure,
  });
}

export function createDirectorRuntimePresentationContext(
  input: DirectorRuntimePresentationContext,
): DirectorRuntimePresentationContext {
  return Object.freeze({
    ...input,
    ...(input.metadata === undefined
      ? {}
      : { metadata: Object.freeze({ ...input.metadata }) }),
  });
}

export function createDirectorRuntimePresentationCapability(
  input: DirectorRuntimePresentationCapability,
): DirectorRuntimePresentationCapability {
  return Object.freeze({
    presentationStates: Object.freeze([...input.presentationStates]),
    attentionLevels: Object.freeze([...input.attentionLevels]),
    informationDensities: Object.freeze([...input.informationDensities]),
    priorities: Object.freeze([...input.priorities]),
    visibilities: Object.freeze([...input.visibilities]),
    interactionExposures: Object.freeze([...input.interactionExposures]),
  });
}

// ─── Foundation invariants ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FOUNDATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "presentation-state-count",
      statement: "exactly three presentation states exist",
    }),
    Object.freeze({
      id: "presentation-state-order",
      statement: "state order is deterministic",
    }),
    Object.freeze({
      id: "attention-vocabulary",
      statement: "attention vocabulary is deterministic",
    }),
    Object.freeze({
      id: "density-vocabulary",
      statement: "density vocabulary is deterministic",
    }),
    Object.freeze({
      id: "priority-vocabulary",
      statement: "priority vocabulary is deterministic",
    }),
    Object.freeze({
      id: "visibility-vocabulary",
      statement: "visibility vocabulary is deterministic",
    }),
    Object.freeze({
      id: "interaction-exposure-vocabulary",
      statement: "interaction exposure vocabulary is deterministic",
    }),
    Object.freeze({
      id: "renderer-independent-contracts",
      statement: "presentation contracts are renderer-independent",
    }),
    Object.freeze({
      id: "plain-immutable-data",
      statement: "presentation data is plain immutable data",
    }),
    Object.freeze({
      id: "state-density-independence",
      statement: "presentation state does not determine density automatically",
    }),
    Object.freeze({
      id: "attention-not-color",
      statement: "attention does not determine color",
    }),
    Object.freeze({
      id: "priority-not-animation",
      statement: "priority does not determine animation",
    }),
    Object.freeze({
      id: "visibility-not-rendering",
      statement: "visibility does not implement rendering",
    }),
    Object.freeze({
      id: "exposure-not-handlers",
      statement: "interaction exposure does not implement handlers",
    }),
    Object.freeze({
      id: "no-runtime-resolution",
      statement: "DRI-5:1 performs no runtime presentation resolution",
    }),
    Object.freeze({
      id: "no-orchestration",
      statement: "DRI-5:1 performs no orchestration",
    }),
    Object.freeze({
      id: "no-rendering",
      statement: "DRI-5:1 performs no rendering",
    }),
    Object.freeze({
      id: "sole-upstream-dri-4-9",
      statement: "DRI-5:1 depends only on DRI-4:9 Public Index",
    }),
  ] as const);

export type DirectorRuntimeAdaptivePresentationFoundationInvariant =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FOUNDATION_INVARIANTS)[number];

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeAdaptivePresentationFoundationApiNames = Object.freeze([
  "isDirectorRuntimePresentationState",
  "isDirectorRuntimeAttentionLevel",
  "isDirectorRuntimeInformationDensity",
  "isDirectorRuntimePresentationPriority",
  "isDirectorRuntimePresentationVisibility",
  "isDirectorRuntimeInteractionExposure",
  "createDirectorRuntimePresentationSubject",
  "createDirectorRuntimePresentationIntent",
  "createDirectorRuntimePresentationContext",
  "createDirectorRuntimePresentationCapability",
  "verifyDirectorRuntimeAdaptivePresentationFoundation",
] as const);

export const directorRuntimeAdaptivePresentationFoundationRegistry = Object.freeze({
  identity: directorRuntimeAdaptivePresentationFoundationIdentity,
  version: directorRuntimeAdaptivePresentationFoundationVersion,
  namespace: directorRuntimeAdaptivePresentationFoundationNamespace,
  dependency: directorRuntimeAdaptivePresentationFoundationUpstream,
  presentationStates: DIRECTOR_RUNTIME_PRESENTATION_STATES,
  presentationStateCount: DIRECTOR_RUNTIME_PRESENTATION_STATES.length,
  presentationStateDescriptors: DIRECTOR_RUNTIME_PRESENTATION_STATE_DESCRIPTOR_LIST,
  attentionLevels: DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  attentionLevelCount: DIRECTOR_RUNTIME_ATTENTION_LEVELS.length,
  informationDensities: DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  informationDensityCount: DIRECTOR_RUNTIME_INFORMATION_DENSITIES.length,
  priorities: DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  priorityCount: DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES.length,
  visibilities: DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  visibilityCount: DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES.length,
  interactionExposures: DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  interactionExposureCount: DIRECTOR_RUNTIME_INTERACTION_EXPOSURES.length,
  invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FOUNDATION_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FOUNDATION_INVARIANTS.length,
  publicApis: directorRuntimeAdaptivePresentationFoundationApiNames,
  publicApiCount: directorRuntimeAdaptivePresentationFoundationApiNames.length,
});

export const directorRuntimeAdaptivePresentationFoundation = Object.freeze({
  phase: "DRI-5:1" as const,
  name: "DirectorRuntimeAdaptivePresentationFoundation" as const,
  identity: directorRuntimeAdaptivePresentationFoundationIdentity,
  namespace: directorRuntimeAdaptivePresentationFoundationNamespace,
  version: directorRuntimeAdaptivePresentationFoundationVersion,
  layer: "DirectorRuntimeAdaptivePresentation" as const,
  stage: "Foundation" as const,
  status: "FoundationReady" as const,
  upstreamDependency: directorRuntimeAdaptivePresentationFoundationUpstream,
  deterministic: true as const,
  foundation: true as const,
  rendererIndependent: true as const,
  philosophy: "meaning-not-appearance" as const,
  presentationStates: DIRECTOR_RUNTIME_PRESENTATION_STATES,
  attentionLevels: DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  informationDensities: DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  priorities: DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  visibilities: DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  interactionExposures: DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FOUNDATION_INVARIANTS,
  publicApiSurface: directorRuntimeAdaptivePresentationFoundationApiNames,
  registry: directorRuntimeAdaptivePresentationFoundationRegistry,
  interactionOrchestrationBoundary: "DRI-4:9-public-index-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · RendererIndependent · ReadyForPresentationIntent" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAdaptivePresentationFoundationIdentity;
  readonly version: typeof directorRuntimeAdaptivePresentationFoundationVersion;
  readonly namespace: typeof directorRuntimeAdaptivePresentationFoundationNamespace;
  readonly dependency: typeof directorRuntimeAdaptivePresentationFoundationUpstream;
  readonly presentationStateCount: number;
  readonly attentionLevelCount: number;
  readonly informationDensityCount: number;
  readonly priorityCount: number;
  readonly visibilityCount: number;
  readonly interactionExposureCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);
}

export function verifyDirectorRuntimeAdaptivePresentationFoundation():
  DirectorRuntimeAdaptivePresentationFoundationVerification {
  const foundation = directorRuntimeAdaptivePresentationFoundation;
  const registry = directorRuntimeAdaptivePresentationFoundationRegistry;
  const expectedStates = ["minimum", "report", "operation"] as const;
  const expectedAttention = ["normal", "notice", "warning", "critical"] as const;
  const expectedDensities = ["minimal", "standard", "expanded"] as const;
  const expectedPriorities = ["low", "normal", "high", "urgent"] as const;
  const expectedVisibilities = ["visible", "hidden", "collapsed"] as const;
  const expectedExposures = ["none", "inspect", "select", "operate"] as const;

  const ok =
    foundation.identity ===
      "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation" &&
    foundation.version === "5.1.0" &&
    foundation.namespace === "nexora.dri.adaptive-presentation.foundation" &&
    foundation.layer === "DirectorRuntimeAdaptivePresentation" &&
    foundation.stage === "Foundation" &&
    foundation.status === "FoundationReady" &&
    foundation.deterministic === true &&
    foundation.foundation === true &&
    foundation.rendererIndependent === true &&
    foundation.upstreamDependency ===
      "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex" &&
    foundation.upstreamDependency ===
      directorRuntimeInteractionOrchestrationPublicIndexIdentity &&
    registry.dependency === foundation.upstreamDependency &&
    exactOrder(DIRECTOR_RUNTIME_PRESENTATION_STATES, expectedStates) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_LEVELS, expectedAttention) &&
    exactOrder(DIRECTOR_RUNTIME_INFORMATION_DENSITIES, expectedDensities) &&
    exactOrder(DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES, expectedPriorities) &&
    exactOrder(DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES, expectedVisibilities) &&
    exactOrder(DIRECTOR_RUNTIME_INTERACTION_EXPOSURES, expectedExposures) &&
    registry.presentationStateCount === 3 &&
    registry.attentionLevelCount === 4 &&
    registry.informationDensityCount === 3 &&
    registry.priorityCount === 4 &&
    registry.visibilityCount === 3 &&
    registry.interactionExposureCount === 4 &&
    registry.invariantCount === 18 &&
    registry.presentationStateDescriptors.length === 3 &&
    registry.presentationStateDescriptors.every(
      (descriptor, index) =>
        descriptor.state === DIRECTOR_RUNTIME_PRESENTATION_STATES[index],
    ) &&
    new Set(DIRECTOR_RUNTIME_PRESENTATION_STATES).size === 3 &&
    new Set(DIRECTOR_RUNTIME_ATTENTION_LEVELS).size === 4 &&
    new Set(DIRECTOR_RUNTIME_INFORMATION_DENSITIES).size === 3 &&
    new Set(DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES).size === 4 &&
    new Set(DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES).size === 3 &&
    new Set(DIRECTOR_RUNTIME_INTERACTION_EXPOSURES).size === 4 &&
    Object.isFrozen(foundation) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_LEVELS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INFORMATION_DENSITIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_EXPOSURES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FOUNDATION_INVARIANTS);

  return Object.freeze({
    ok,
    identity: directorRuntimeAdaptivePresentationFoundationIdentity,
    version: directorRuntimeAdaptivePresentationFoundationVersion,
    namespace: directorRuntimeAdaptivePresentationFoundationNamespace,
    dependency: directorRuntimeAdaptivePresentationFoundationUpstream,
    presentationStateCount: DIRECTOR_RUNTIME_PRESENTATION_STATES.length,
    attentionLevelCount: DIRECTOR_RUNTIME_ATTENTION_LEVELS.length,
    informationDensityCount: DIRECTOR_RUNTIME_INFORMATION_DENSITIES.length,
    priorityCount: DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES.length,
    visibilityCount: DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES.length,
    interactionExposureCount: DIRECTOR_RUNTIME_INTERACTION_EXPOSURES.length,
    invariantCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FOUNDATION_INVARIANTS.length,
    frozen: Object.isFrozen(foundation) && Object.isFrozen(registry),
  });
}
