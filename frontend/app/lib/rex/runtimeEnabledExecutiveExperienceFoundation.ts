/**
 * REX-1:1 — Runtime-enabled Executive Experience Foundation.
 *
 * Establishes the architectural boundary that allows the Executive Experience
 * to become driven by the certified runtime stack through EX-DRI.
 *
 * Canonical flow:
 *   NOL → DRI → EX-DRI → REX → Executive Experience
 *
 * Principle:
 *   Certified Executive Runtime Context → Runtime-enabled Executive Experience
 *
 * REX-1:1 is foundation only — vocabulary, contracts, and guarantees.
 * No Stage/Advisor/Insight/Timeline/Explorer binding, React hooks, stores,
 * Three.js adapters, Director computation, rendering, AI, or UX redesign.
 */

import {
  EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES,
  executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity,
  type ExecutivePresentationState,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceFoundationIdentity =
  "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation" as const;

export const runtimeEnabledExecutiveExperienceFoundationVersion =
  "1.1.0" as const;

export const runtimeEnabledExecutiveExperienceFoundationNamespace =
  "nexora.rex.runtime-enabled-executive-experience.foundation" as const;

export const runtimeEnabledExecutiveExperienceFoundationLayer =
  "REX" as const;

export const runtimeEnabledExecutiveExperienceFoundationPhase =
  "REX-1" as const;

export const runtimeEnabledExecutiveExperienceFoundationStage =
  "Foundation" as const;

export const runtimeEnabledExecutiveExperienceFoundationArchitecturalRole =
  "RuntimeEnabledExecutiveExperienceBoundary" as const;

export const runtimeEnabledExecutiveExperienceFoundationDependencyIdentity =
  executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity;

export const runtimeEnabledExecutiveExperienceFoundationDependencyPath =
  "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPublicIndex" as const;

export const runtimeEnabledExecutiveExperienceFoundationStability =
  "FoundationReady" as const;

export const runtimeEnabledExecutiveExperienceFoundationDeterministic =
  true as const;

export const runtimeEnabledExecutiveExperienceFoundationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeEnabledExecutiveExperienceFoundationMutationPolicy =
  "immutable" as const;

export const runtimeEnabledExecutiveExperienceFoundationCanonicalIdentity =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceFoundationIdentity,
    version: runtimeEnabledExecutiveExperienceFoundationVersion,
    namespace: runtimeEnabledExecutiveExperienceFoundationNamespace,
    layer: runtimeEnabledExecutiveExperienceFoundationLayer,
    phase: runtimeEnabledExecutiveExperienceFoundationPhase,
    stage: runtimeEnabledExecutiveExperienceFoundationStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceFoundationDependencyPath,
    stabilityStatus:
      runtimeEnabledExecutiveExperienceFoundationStability,
    deterministicStatus:
      runtimeEnabledExecutiveExperienceFoundationDeterministic,
    sideEffectPolicy:
      runtimeEnabledExecutiveExperienceFoundationSideEffectPolicy,
    mutationPolicy:
      runtimeEnabledExecutiveExperienceFoundationMutationPolicy,
  });

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PRINCIPLE =
  "Certified Executive Runtime Context → Runtime-enabled Executive Experience. REX consumes EX-DRI; it does not own Director decisions." as const;

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-enabled-Executive-Experience" as const,
  exDriAuthority: "Executive-Experience-Director-Runtime-Integration" as const,
  boundaryAuthority: "REX" as const,
  architecturalRole:
    "RuntimeEnabledExecutiveExperienceBoundary" as const,
  soleImmediateDependency:
    "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex" as const,
  consumesPublicIndexOnly: true as const,
  bypassesExDriIntoDri: false as const,
  bypassesDriIntoNol: false as const,
  ownsDirectorComputation: false as const,
  ownsRendering: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  introducesUxRedesign: false as const,
  calculatesFocusOrAttention: false as const,
  calculatesKpi: false as const,
  calculatesKoi: false as const,
  introducesAiReasoning: false as const,
  introducesPersistenceOrNetwork: false as const,
});

// ─── Runtime source declaration (EX-DRI → REX) ──────────────────────────────

/**
 * Immutable declaration that REX runtime authority originates from EX-DRI.
 * REX is an experience consumer of Director decisions — never their source.
 */
export const RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE = Object.freeze({
  originLayer: "EX-DRI" as const,
  destinationLayer: "REX" as const,
  relationship: "EX-DRI → REX" as const,
  authorityIdentity:
    executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity,
  authorityPath:
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPublicIndex" as const,
  rexIsDirectorDecisionSource: false as const,
  rexIsExperienceConsumer: true as const,
});

export type RuntimeExecutiveExperienceRuntimeSource =
  typeof RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE;

// ─── Executive Experience surfaces ──────────────────────────────────────────

/**
 * Canonical REX experience surfaces — destinations, not UI components.
 * Includes overall `experience` plus independently addressable surfaces.
 */
export const RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES = Object.freeze([
  "experience",
  "stage",
  "advisor",
  "insight",
  "timeline",
  "explorer",
] as const);

export type RuntimeExecutiveExperienceSurface =
  (typeof RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES)[number];

// ─── Executive Experience subjects ──────────────────────────────────────────

/**
 * Minimum subject vocabulary for runtime-enabled executive experiences.
 * KOI = Key Output Index (goals/intents / executive focus).
 * KPI belongs to NexoraObjects and their performance.
 * KOR terminology is not part of this architecture.
 */
export const RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS = Object.freeze([
  "goal",
  "object",
  "problem",
  "scenario",
  "decision",
  "execution",
  "kpi",
  "koi",
  "pack",
] as const);

export type RuntimeExecutiveExperienceSubjectKind =
  (typeof RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS)[number];

export const RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KIND_SEMANTICS =
  Object.freeze({
    kpi: "NexoraObject performance information" as const,
    koi: "Key Output Index associated with goals/intents and executive focus" as const,
    calculatesKpi: false as const,
    calculatesKoi: false as const,
    usesOnlyCanonicalIndexTerminology: true as const,
    introducesKor: false as const,
  });

// ─── Experience runtime state ───────────────────────────────────────────────

/**
 * Deterministic vocabulary describing whether an Executive Experience can
 * consume runtime information. Transitions are not implemented in REX-1:1.
 */
export const RUNTIME_EXECUTIVE_EXPERIENCE_STATES = Object.freeze([
  "unavailable",
  "available",
  "ready",
  "active",
] as const);

export type RuntimeExecutiveExperienceState =
  (typeof RUNTIME_EXECUTIVE_EXPERIENCE_STATES)[number];

// ─── Experience activation ──────────────────────────────────────────────────

/**
 * Activation vocabulary for surface/subject participation eligibility.
 * Orchestration is not implemented in REX-1:1.
 */
export const RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES = Object.freeze([
  "inactive",
  "eligible",
  "activated",
] as const);

export type RuntimeExecutiveExperienceActivationState =
  (typeof RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES)[number];

// ─── Presentation compatibility (upstream EX-DRI public types) ──────────────

/**
 * Canonical NexoraObject presentation states from the EX-DRI public boundary.
 * REX represents the presentation relationship only — does not redefine semantics.
 *
 * minimum  — small visual presence / point / caption
 * report   — executive-readable information / KPI / KOI / risk / status
 * operation — interactive executive action / message / command context
 */
export const RUNTIME_EXECUTIVE_PRESENTATION_STATES =
  EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES;

export type RuntimeExecutivePresentationState = ExecutivePresentationState;

// ─── Plain-data contracts ───────────────────────────────────────────────────

/**
 * Minimum readonly plain-data envelope REX can expose toward later
 * Executive Experience consumers. Framework-neutral and serializable.
 */
export interface RuntimeExecutiveExperienceContext {
  readonly experienceId: string;
  readonly runtimeState: RuntimeExecutiveExperienceState;
  readonly activationState: RuntimeExecutiveExperienceActivationState;
  readonly activeSurface?: RuntimeExecutiveExperienceSurface;
  readonly activeSubjectKind?: RuntimeExecutiveExperienceSubjectKind;
  readonly activeSubjectId?: string;
  readonly presentationState?: RuntimeExecutivePresentationState;
  readonly runtimeContextAvailable: boolean;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
  readonly foundationIdentity: typeof runtimeEnabledExecutiveExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeEnabledExecutiveExperienceFoundationVersion;
  readonly timestampIso?: string;
}

/**
 * Runtime-facing state of one Executive Experience surface.
 * Values are represented only — never calculated here.
 */
export interface RuntimeExecutiveSurfaceState {
  readonly surface: RuntimeExecutiveExperienceSurface;
  readonly availability: RuntimeExecutiveExperienceState;
  readonly activation: RuntimeExecutiveExperienceActivationState;
  readonly subjectKind?: RuntimeExecutiveExperienceSubjectKind;
  readonly subjectId?: string;
  readonly presentationState?: RuntimeExecutivePresentationState;
  /** Opaque focus subject id when exposed by upstream contracts — not computed. */
  readonly focusedSubjectId?: string;
  /** Opaque attention subject id when exposed by upstream contracts — not computed. */
  readonly attentionSubjectId?: string;
}

/**
 * Immutable high-level representation of the Executive Experience at a
 * point in runtime. No store, subscription, or event emitter.
 */
export interface RuntimeExecutiveExperienceSnapshot {
  readonly snapshotId: string;
  readonly context: RuntimeExecutiveExperienceContext;
  readonly surfaceStates: ReadonlyArray<RuntimeExecutiveSurfaceState>;
  readonly currentSubjectKind?: RuntimeExecutiveExperienceSubjectKind;
  readonly currentSubjectId?: string;
  readonly runtimeReadiness: RuntimeExecutiveExperienceState;
  readonly upstreamIntegrationIdentity: typeof executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity;
  readonly upstreamIntegrationVersion: "1.9.0";
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
  readonly foundationIdentity: typeof runtimeEnabledExecutiveExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeEnabledExecutiveExperienceFoundationVersion;
}

// ─── Foundation guarantees ──────────────────────────────────────────────────

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "ex-dri-sole-immediate-dependency",
      order: 1,
      statement:
        "EX-DRI is the sole immediate architectural dependency.",
    }),
    Object.freeze({
      id: "no-bypass-ex-dri-into-dri",
      order: 2,
      statement: "REX does not bypass EX-DRI into DRI.",
    }),
    Object.freeze({
      id: "no-bypass-dri-into-nol",
      order: 3,
      statement: "REX does not bypass DRI into NOL.",
    }),
    Object.freeze({
      id: "no-director-computation",
      order: 4,
      statement: "REX does not own Director computation.",
    }),
    Object.freeze({
      id: "no-rendering-ownership",
      order: 5,
      statement: "REX does not own rendering.",
    }),
    Object.freeze({
      id: "framework-neutral-foundation",
      order: 6,
      statement: "REX is framework-neutral at the foundation level.",
    }),
    Object.freeze({
      id: "immutable-plain-data-runtime-context",
      order: 7,
      statement: "Runtime context is represented as immutable plain data.",
    }),
    Object.freeze({
      id: "surfaces-independently-addressable",
      order: 8,
      statement: "Executive surfaces remain independently addressable.",
    }),
    Object.freeze({
      id: "subjects-independently-identifiable",
      order: 9,
      statement: "Executive subjects remain independently identifiable.",
    }),
    Object.freeze({
      id: "presentation-states-preserved",
      order: 10,
      statement: "Existing presentation states are preserved.",
    }),
    Object.freeze({
      id: "represents-focus-attention-without-calculation",
      order: 11,
      statement:
        "REX may represent focus/attention but does not calculate them.",
    }),
    Object.freeze({
      id: "no-kpi-koi-calculation",
      order: 12,
      statement: "REX does not calculate KPI or KOI.",
    }),
    Object.freeze({
      id: "no-ai-reasoning",
      order: 13,
      statement: "REX introduces no AI reasoning.",
    }),
    Object.freeze({
      id: "no-persistence-network",
      order: 14,
      statement: "REX introduces no persistence/network behavior.",
    }),
    Object.freeze({
      id: "no-visible-ux-redesign",
      order: 15,
      statement: "REX-1:1 introduces no visible UX redesign.",
    }),
  ] as const);

export type RuntimeEnabledExecutiveExperienceFoundationGuarantee =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES)[number];

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "Director computation",
    "scene orchestration",
    "interaction resolution",
    "adaptive-presentation algorithms",
    "focus calculation",
    "attention calculation",
    "business models",
    "KPI calculation",
    "KOI calculation",
    "AI reasoning",
    "rendering",
    "animation",
    "React components",
    "React hooks",
    "React state",
    "Three.js behavior",
    "persistence",
    "network access",
    "runtime stores",
    "event emitters",
    "Stage binding",
    "Advisor binding",
    "Insight binding",
    "Timeline binding",
    "Explorer binding",
    "Live Lens",
    "visible UX redesign",
  ] as const);

// ─── Validation helpers ─────────────────────────────────────────────────────

export function isRuntimeExecutiveExperienceSurface(
  value: unknown,
): value is RuntimeExecutiveExperienceSurface {
  return (
    RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveExperienceSubjectKind(
  value: unknown,
): value is RuntimeExecutiveExperienceSubjectKind {
  return (
    RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveExperienceState(
  value: unknown,
): value is RuntimeExecutiveExperienceState {
  return (
    RUNTIME_EXECUTIVE_EXPERIENCE_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveExperienceActivationState(
  value: unknown,
): value is RuntimeExecutiveExperienceActivationState {
  return (
    RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutivePresentationState(
  value: unknown,
): value is RuntimeExecutivePresentationState {
  return (
    RUNTIME_EXECUTIVE_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

export function listRuntimeExecutiveExperienceSurfaces(): ReadonlyArray<
  RuntimeExecutiveExperienceSurface
> {
  return RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES;
}

export function listRuntimeExecutiveExperienceSubjectKinds(): ReadonlyArray<
  RuntimeExecutiveExperienceSubjectKind
> {
  return RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS;
}

export function listRuntimeExecutiveExperienceStates(): ReadonlyArray<
  RuntimeExecutiveExperienceState
> {
  return RUNTIME_EXECUTIVE_EXPERIENCE_STATES;
}

export function listRuntimeExecutiveExperienceActivationStates(): ReadonlyArray<
  RuntimeExecutiveExperienceActivationState
> {
  return RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES;
}

export function listRuntimeExecutivePresentationStates(): ReadonlyArray<
  RuntimeExecutivePresentationState
> {
  return RUNTIME_EXECUTIVE_PRESENTATION_STATES;
}

export function getRuntimeEnabledExecutiveExperienceFoundationIdentity():
  typeof runtimeEnabledExecutiveExperienceFoundationCanonicalIdentity {
  return runtimeEnabledExecutiveExperienceFoundationCanonicalIdentity;
}

// ─── Immutable constructors (plain-data freeze only) ────────────────────────

function requireOpaqueId(value: string, field: string): void {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
}

export function createRuntimeExecutiveExperienceContext(
  input: RuntimeExecutiveExperienceContext,
): RuntimeExecutiveExperienceContext {
  requireOpaqueId(input.experienceId, "experienceId");
  if (!isRuntimeExecutiveExperienceState(input.runtimeState)) {
    throw new TypeError("runtimeState must be a known runtime experience state");
  }
  if (!isRuntimeExecutiveExperienceActivationState(input.activationState)) {
    throw new TypeError(
      "activationState must be a known runtime experience activation state",
    );
  }
  if (
    input.activeSurface !== undefined &&
    !isRuntimeExecutiveExperienceSurface(input.activeSurface)
  ) {
    throw new TypeError(
      "activeSurface must be a known runtime executive experience surface",
    );
  }
  if (
    input.activeSubjectKind !== undefined &&
    !isRuntimeExecutiveExperienceSubjectKind(input.activeSubjectKind)
  ) {
    throw new TypeError(
      "activeSubjectKind must be a known runtime executive experience subject kind",
    );
  }
  if (
    input.presentationState !== undefined &&
    !isRuntimeExecutivePresentationState(input.presentationState)
  ) {
    throw new TypeError(
      "presentationState must be a known executive presentation state",
    );
  }
  if (typeof input.runtimeContextAvailable !== "boolean") {
    throw new TypeError("runtimeContextAvailable must be a boolean");
  }
  if (
    input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE
  ) {
    throw new TypeError(
      "runtimeSource must be the canonical EX-DRI → REX source declaration",
    );
  }
  if (
    input.foundationIdentity !==
      runtimeEnabledExecutiveExperienceFoundationIdentity ||
    input.foundationVersion !==
      runtimeEnabledExecutiveExperienceFoundationVersion
  ) {
    throw new TypeError("foundation identity/version metadata is invalid");
  }

  return Object.freeze({
    experienceId: input.experienceId,
    runtimeState: input.runtimeState,
    activationState: input.activationState,
    runtimeContextAvailable: input.runtimeContextAvailable,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    foundationIdentity:
      runtimeEnabledExecutiveExperienceFoundationIdentity,
    foundationVersion:
      runtimeEnabledExecutiveExperienceFoundationVersion,
    ...(input.activeSurface !== undefined
      ? { activeSurface: input.activeSurface }
      : {}),
    ...(input.activeSubjectKind !== undefined
      ? { activeSubjectKind: input.activeSubjectKind }
      : {}),
    ...(input.activeSubjectId !== undefined
      ? { activeSubjectId: input.activeSubjectId }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.timestampIso !== undefined
      ? { timestampIso: input.timestampIso }
      : {}),
  });
}

export function createRuntimeExecutiveSurfaceState(
  input: RuntimeExecutiveSurfaceState,
): RuntimeExecutiveSurfaceState {
  if (!isRuntimeExecutiveExperienceSurface(input.surface)) {
    throw new TypeError(
      "surface must be a known runtime executive experience surface",
    );
  }
  if (!isRuntimeExecutiveExperienceState(input.availability)) {
    throw new TypeError("availability must be a known runtime experience state");
  }
  if (!isRuntimeExecutiveExperienceActivationState(input.activation)) {
    throw new TypeError(
      "activation must be a known runtime experience activation state",
    );
  }
  if (
    input.subjectKind !== undefined &&
    !isRuntimeExecutiveExperienceSubjectKind(input.subjectKind)
  ) {
    throw new TypeError(
      "subjectKind must be a known runtime executive experience subject kind",
    );
  }
  if (
    input.presentationState !== undefined &&
    !isRuntimeExecutivePresentationState(input.presentationState)
  ) {
    throw new TypeError(
      "presentationState must be a known executive presentation state",
    );
  }

  return Object.freeze({
    surface: input.surface,
    availability: input.availability,
    activation: input.activation,
    ...(input.subjectKind !== undefined
      ? { subjectKind: input.subjectKind }
      : {}),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.focusedSubjectId !== undefined
      ? { focusedSubjectId: input.focusedSubjectId }
      : {}),
    ...(input.attentionSubjectId !== undefined
      ? { attentionSubjectId: input.attentionSubjectId }
      : {}),
  });
}

export function createRuntimeExecutiveExperienceSnapshot(
  input: RuntimeExecutiveExperienceSnapshot,
): RuntimeExecutiveExperienceSnapshot {
  requireOpaqueId(input.snapshotId, "snapshotId");
  if (!isRuntimeExecutiveExperienceState(input.runtimeReadiness)) {
    throw new TypeError(
      "runtimeReadiness must be a known runtime experience state",
    );
  }
  if (
    input.upstreamIntegrationIdentity !==
      executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity ||
    input.upstreamIntegrationVersion !== "1.9.0"
  ) {
    throw new TypeError(
      "upstream integration identity/version must match EX-DRI public index",
    );
  }
  if (
    input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE
  ) {
    throw new TypeError(
      "runtimeSource must be the canonical EX-DRI → REX source declaration",
    );
  }
  if (
    input.foundationIdentity !==
      runtimeEnabledExecutiveExperienceFoundationIdentity ||
    input.foundationVersion !==
      runtimeEnabledExecutiveExperienceFoundationVersion
  ) {
    throw new TypeError("foundation identity/version metadata is invalid");
  }
  if (
    input.currentSubjectKind !== undefined &&
    !isRuntimeExecutiveExperienceSubjectKind(input.currentSubjectKind)
  ) {
    throw new TypeError(
      "currentSubjectKind must be a known runtime executive experience subject kind",
    );
  }
  if (!Array.isArray(input.surfaceStates)) {
    throw new TypeError("surfaceStates must be an array");
  }

  const context = createRuntimeExecutiveExperienceContext(input.context);
  const surfaceStates = Object.freeze(
    input.surfaceStates.map((state) =>
      createRuntimeExecutiveSurfaceState(state),
    ),
  );

  return Object.freeze({
    snapshotId: input.snapshotId,
    context,
    surfaceStates,
    runtimeReadiness: input.runtimeReadiness,
    upstreamIntegrationIdentity:
      executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity,
    upstreamIntegrationVersion: "1.9.0" as const,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    foundationIdentity:
      runtimeEnabledExecutiveExperienceFoundationIdentity,
    foundationVersion:
      runtimeEnabledExecutiveExperienceFoundationVersion,
    ...(input.currentSubjectKind !== undefined
      ? { currentSubjectKind: input.currentSubjectKind }
      : {}),
    ...(input.currentSubjectId !== undefined
      ? { currentSubjectId: input.currentSubjectId }
      : {}),
  });
}

// ─── Public catalogs ────────────────────────────────────────────────────────

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveExperienceSurface",
    "RuntimeExecutiveExperienceSubjectKind",
    "RuntimeExecutiveExperienceState",
    "RuntimeExecutiveExperienceActivationState",
    "RuntimeExecutivePresentationState",
    "RuntimeExecutiveExperienceRuntimeSource",
    "RuntimeExecutiveExperienceContext",
    "RuntimeExecutiveSurfaceState",
    "RuntimeExecutiveExperienceSnapshot",
    "RuntimeEnabledExecutiveExperienceFoundationGuarantee",
    "RuntimeEnabledExecutiveExperienceFoundationVerification",
  ] as const);

export const runtimeEnabledExecutiveExperienceFoundationApiNames =
  Object.freeze([
    "getRuntimeEnabledExecutiveExperienceFoundationIdentity",
    "listRuntimeExecutiveExperienceSurfaces",
    "listRuntimeExecutiveExperienceSubjectKinds",
    "listRuntimeExecutiveExperienceStates",
    "listRuntimeExecutiveExperienceActivationStates",
    "listRuntimeExecutivePresentationStates",
    "isRuntimeExecutiveExperienceSurface",
    "isRuntimeExecutiveExperienceSubjectKind",
    "isRuntimeExecutiveExperienceState",
    "isRuntimeExecutiveExperienceActivationState",
    "isRuntimeExecutivePresentationState",
    "createRuntimeExecutiveExperienceContext",
    "createRuntimeExecutiveSurfaceState",
    "createRuntimeExecutiveExperienceSnapshot",
    "verifyRuntimeEnabledExecutiveExperienceFoundation",
  ] as const);

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "Surfaces",
    "Subjects",
    "RuntimeStates",
    "ActivationStates",
    "PresentationCompatibility",
    "Context",
    "Snapshot",
    "Guarantees",
  ] as const);

// ─── Foundation registry ────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceFoundationRegistryIdentitySection =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceFoundationIdentity,
    version: runtimeEnabledExecutiveExperienceFoundationVersion,
    namespace: runtimeEnabledExecutiveExperienceFoundationNamespace,
    layer: runtimeEnabledExecutiveExperienceFoundationLayer,
    phase: runtimeEnabledExecutiveExperienceFoundationPhase,
    stage: runtimeEnabledExecutiveExperienceFoundationStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceFoundationArchitecturalRole,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistryDependencySection =
  Object.freeze({
    soleImmediateDependency:
      runtimeEnabledExecutiveExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceFoundationDependencyPath,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    consumesPublicIndexOnly: true as const,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistrySurfacesSection =
  Object.freeze({
    surfaces: RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES,
    surfaceCount: RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES.length,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistrySubjectsSection =
  Object.freeze({
    subjectKinds: RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS,
    subjectKindCount: RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS.length,
    semantics: RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KIND_SEMANTICS,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistryRuntimeStatesSection =
  Object.freeze({
    runtimeStates: RUNTIME_EXECUTIVE_EXPERIENCE_STATES,
    runtimeStateCount: RUNTIME_EXECUTIVE_EXPERIENCE_STATES.length,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistryActivationStatesSection =
  Object.freeze({
    activationStates: RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES,
    activationStateCount:
      RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES.length,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistryPresentationCompatibilitySection =
  Object.freeze({
    presentationStates: RUNTIME_EXECUTIVE_PRESENTATION_STATES,
    presentationStateCount: RUNTIME_EXECUTIVE_PRESENTATION_STATES.length,
    reusedFrom:
      "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex" as const,
    competingPresentationModel: false as const,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistryContextSection =
  Object.freeze({
    contractName: "RuntimeExecutiveExperienceContext" as const,
    frameworkNeutral: true as const,
    serializable: true as const,
    allowsCallbacks: false as const,
    allowsReactNodes: false as const,
    allowsClasses: false as const,
    allowsMutableCollections: false as const,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistrySnapshotSection =
  Object.freeze({
    contractName: "RuntimeExecutiveExperienceSnapshot" as const,
    surfaceStateContractName: "RuntimeExecutiveSurfaceState" as const,
    introducesStore: false as const,
    introducesSubscription: false as const,
    introducesEventEmitter: false as const,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistryGuaranteesSection =
  Object.freeze({
    guarantees: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES,
    guaranteeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES.length,
    forbiddenResponsibilities:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FORBIDDEN_RESPONSIBILITIES,
    forbiddenResponsibilityCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FORBIDDEN_RESPONSIBILITIES.length,
  });

export const runtimeEnabledExecutiveExperienceFoundationRegistry =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceFoundationIdentity,
    version: runtimeEnabledExecutiveExperienceFoundationVersion,
    namespace: runtimeEnabledExecutiveExperienceFoundationNamespace,
    layer: runtimeEnabledExecutiveExperienceFoundationLayer,
    phase: runtimeEnabledExecutiveExperienceFoundationPhase,
    stage: runtimeEnabledExecutiveExperienceFoundationStage,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceFoundationDependencyPath,
    sections:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_REGISTRY_SECTIONS.length,
    Identity:
      runtimeEnabledExecutiveExperienceFoundationRegistryIdentitySection,
    Dependency:
      runtimeEnabledExecutiveExperienceFoundationRegistryDependencySection,
    Surfaces:
      runtimeEnabledExecutiveExperienceFoundationRegistrySurfacesSection,
    Subjects:
      runtimeEnabledExecutiveExperienceFoundationRegistrySubjectsSection,
    RuntimeStates:
      runtimeEnabledExecutiveExperienceFoundationRegistryRuntimeStatesSection,
    ActivationStates:
      runtimeEnabledExecutiveExperienceFoundationRegistryActivationStatesSection,
    PresentationCompatibility:
      runtimeEnabledExecutiveExperienceFoundationRegistryPresentationCompatibilitySection,
    Context:
      runtimeEnabledExecutiveExperienceFoundationRegistryContextSection,
    Snapshot:
      runtimeEnabledExecutiveExperienceFoundationRegistrySnapshotSection,
    Guarantees:
      runtimeEnabledExecutiveExperienceFoundationRegistryGuaranteesSection,
    surfaceCount: RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES.length,
    subjectKindCount: RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS.length,
    runtimeStateCount: RUNTIME_EXECUTIVE_EXPERIENCE_STATES.length,
    activationStateCount:
      RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES.length,
    presentationStateCount: RUNTIME_EXECUTIVE_PRESENTATION_STATES.length,
    guaranteeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES.length,
    publicTypeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeEnabledExecutiveExperienceFoundationApiNames.length,
  });

export const runtimeEnabledExecutiveExperienceFoundation = Object.freeze({
  phase: "REX-1" as const,
  name: "RuntimeEnabledExecutiveExperienceFoundation" as const,
  identity: runtimeEnabledExecutiveExperienceFoundationIdentity,
  version: runtimeEnabledExecutiveExperienceFoundationVersion,
  namespace: runtimeEnabledExecutiveExperienceFoundationNamespace,
  layer: runtimeEnabledExecutiveExperienceFoundationLayer,
  stage: runtimeEnabledExecutiveExperienceFoundationStage,
  architecturalRole:
    runtimeEnabledExecutiveExperienceFoundationArchitecturalRole,
  role: "Foundation" as const,
  status: runtimeEnabledExecutiveExperienceFoundationStability,
  upstreamDependency:
    runtimeEnabledExecutiveExperienceFoundationDependencyIdentity,
  dependencyPath:
    runtimeEnabledExecutiveExperienceFoundationDependencyPath,
  deterministic:
    runtimeEnabledExecutiveExperienceFoundationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  foundation: true as const,
  principle: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PRINCIPLE,
  boundary: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_BOUNDARY,
  runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
  surfaces: RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES,
  subjectKinds: RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS,
  subjectKindSemantics: RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KIND_SEMANTICS,
  runtimeStates: RUNTIME_EXECUTIVE_EXPERIENCE_STATES,
  activationStates: RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES,
  presentationStates: RUNTIME_EXECUTIVE_PRESENTATION_STATES,
  guarantees: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES,
  forbiddenResponsibilities:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FORBIDDEN_RESPONSIBILITIES,
  publicApiSurface: runtimeEnabledExecutiveExperienceFoundationApiNames,
  publicTypes:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_PUBLIC_TYPE_NAMES,
  registry: runtimeEnabledExecutiveExperienceFoundationRegistry,
  exDriBoundary: "EX-DRI-9-public-index-only" as const,
  architecturalStatus:
    "Foundation Complete · Deterministic · Immutable · Framework-Independent · ReadyForContracts" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeEnabledExecutiveExperienceFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeEnabledExecutiveExperienceFoundationIdentity;
  readonly version: typeof runtimeEnabledExecutiveExperienceFoundationVersion;
  readonly namespace: typeof runtimeEnabledExecutiveExperienceFoundationNamespace;
  readonly layer: typeof runtimeEnabledExecutiveExperienceFoundationLayer;
  readonly phase: typeof runtimeEnabledExecutiveExperienceFoundationPhase;
  readonly stage: typeof runtimeEnabledExecutiveExperienceFoundationStage;
  readonly architecturalRole: typeof runtimeEnabledExecutiveExperienceFoundationArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeEnabledExecutiveExperienceFoundationDependencyIdentity;
  readonly surfaceCount: number;
  readonly subjectKindCount: number;
  readonly runtimeStateCount: number;
  readonly activationStateCount: number;
  readonly presentationStateCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly exDriBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly presentationStatesValid: boolean;
  readonly guaranteesPresent: boolean;
  readonly runtimeSourceValid: boolean;
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

export function verifyRuntimeEnabledExecutiveExperienceFoundation():
  RuntimeEnabledExecutiveExperienceFoundationVerification {
  const foundation = runtimeEnabledExecutiveExperienceFoundation;
  const registry = runtimeEnabledExecutiveExperienceFoundationRegistry;

  const identityOk =
    foundation.identity ===
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation" &&
    foundation.version === "1.1.0" &&
    foundation.namespace ===
      "nexora.rex.runtime-enabled-executive-experience.foundation" &&
    foundation.layer === "REX" &&
    foundation.phase === "REX-1" &&
    foundation.stage === "Foundation" &&
    foundation.architecturalRole ===
      "RuntimeEnabledExecutiveExperienceBoundary" &&
    foundation.role === "Foundation" &&
    foundation.status === "FoundationReady" &&
    foundation.upstreamDependency ===
      "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex" &&
    foundation.upstreamDependency ===
      executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity &&
    registry.dependencyIdentity === foundation.upstreamDependency &&
    foundation.exDriBoundary === "EX-DRI-9-public-index-only";

  const dependencyOk =
    foundation.dependencyPath ===
      "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationPublicIndex" &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_BOUNDARY.consumesPublicIndexOnly ===
      true &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_BOUNDARY.soleImmediateDependency ===
      "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex" &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_BOUNDARY.bypassesExDriIntoDri ===
      false &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_BOUNDARY.bypassesDriIntoNol === false;

  const orderingOk =
    exactOrder(RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES, [
      "experience",
      "stage",
      "advisor",
      "insight",
      "timeline",
      "explorer",
    ]) &&
    exactOrder(RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS, [
      "goal",
      "object",
      "problem",
      "scenario",
      "decision",
      "execution",
      "kpi",
      "koi",
      "pack",
    ]) &&
    exactOrder(RUNTIME_EXECUTIVE_EXPERIENCE_STATES, [
      "unavailable",
      "available",
      "ready",
      "active",
    ]) &&
    exactOrder(RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES, [
      "inactive",
      "eligible",
      "activated",
    ]) &&
    exactOrder(RUNTIME_EXECUTIVE_PRESENTATION_STATES, [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder(
      [
        ...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_REGISTRY_SECTIONS,
      ],
      [
        "Identity",
        "Dependency",
        "Surfaces",
        "Subjects",
        "RuntimeStates",
        "ActivationStates",
        "PresentationCompatibility",
        "Context",
        "Snapshot",
        "Guarantees",
      ],
    );

  const uniquenessOk =
    unique([...RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES]) &&
    unique([...RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS]) &&
    unique([...RUNTIME_EXECUTIVE_EXPERIENCE_STATES]) &&
    unique([...RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES]) &&
    unique([...RUNTIME_EXECUTIVE_PRESENTATION_STATES]) &&
    unique(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES.map(
        (entry) => entry.id,
      ),
    ) &&
    unique([
      ...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_REGISTRY_SECTIONS,
    ]);

  const presentationStatesValid =
    exactOrder(RUNTIME_EXECUTIVE_PRESENTATION_STATES, [
      "minimum",
      "report",
      "operation",
    ]) &&
    RUNTIME_EXECUTIVE_PRESENTATION_STATES ===
      EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES;

  const guaranteesPresent =
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES.length ===
      15 &&
    exactOrder(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES.map(
        (entry) => entry.id,
      ),
      [
        "ex-dri-sole-immediate-dependency",
        "no-bypass-ex-dri-into-dri",
        "no-bypass-dri-into-nol",
        "no-director-computation",
        "no-rendering-ownership",
        "framework-neutral-foundation",
        "immutable-plain-data-runtime-context",
        "surfaces-independently-addressable",
        "subjects-independently-identifiable",
        "presentation-states-preserved",
        "represents-focus-attention-without-calculation",
        "no-kpi-koi-calculation",
        "no-ai-reasoning",
        "no-persistence-network",
        "no-visible-ux-redesign",
      ],
    ) &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const runtimeSourceValid =
    RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE.relationship ===
      "EX-DRI → REX" &&
    RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE.authorityIdentity ===
      executiveExperienceDirectorRuntimeIntegrationPublicIndexIdentity &&
    RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE.rexIsDirectorDecisionSource ===
      false &&
    RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE.rexIsExperienceConsumer ===
      true;

  const registryIntegrityOk =
    registry.surfaceCount === RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES.length &&
    registry.subjectKindCount ===
      RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS.length &&
    registry.runtimeStateCount === RUNTIME_EXECUTIVE_EXPERIENCE_STATES.length &&
    registry.activationStateCount ===
      RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES.length &&
    registry.presentationStateCount ===
      RUNTIME_EXECUTIVE_PRESENTATION_STATES.length &&
    registry.guaranteeCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES.length &&
    registry.sectionCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_REGISTRY_SECTIONS
        .length &&
    registry.publicTypeCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_PUBLIC_TYPE_NAMES
        .length &&
    registry.publicApiCount ===
      runtimeEnabledExecutiveExperienceFoundationApiNames.length;

  const immutabilityOk =
    Object.isFrozen(foundation) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeEnabledExecutiveExperienceFoundationCanonicalIdentity,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_EXPERIENCE_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_PRESENTATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES,
    ) &&
    Object.isFrozen(RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_BOUNDARY) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_REGISTRY_SECTIONS,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KIND_SEMANTICS);

  const exDriBoundaryIntact =
    foundation.upstreamDependency ===
      "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex" &&
    foundation.boundary.soleImmediateDependency ===
      "EX-DRI-9/ExecutiveExperienceDirectorRuntimeIntegrationPublicIndex" &&
    foundation.boundary.consumesPublicIndexOnly === true &&
    foundation.boundary.ownsDirectorComputation === false &&
    foundation.boundary.ownsRendering === false;

  const frameworkIndependent =
    foundation.frameworkIndependent === true &&
    foundation.rendererIndependent === true &&
    foundation.browserIndependent === true &&
    foundation.boundary.frameworkIndependent === true;

  const ok =
    identityOk &&
    dependencyOk &&
    orderingOk &&
    uniquenessOk &&
    presentationStatesValid &&
    guaranteesPresent &&
    runtimeSourceValid &&
    registryIntegrityOk &&
    immutabilityOk &&
    exDriBoundaryIntact &&
    frameworkIndependent &&
    foundation.principle === RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PRINCIPLE &&
    RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KIND_SEMANTICS.koi ===
      "Key Output Index associated with goals/intents and executive focus" &&
    RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KIND_SEMANTICS.introducesKor ===
      false &&
    RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KIND_SEMANTICS.calculatesKpi ===
      false &&
    RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KIND_SEMANTICS.calculatesKoi ===
      false &&
    !(
      RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS as readonly string[]
    ).includes("kor");

  return Object.freeze({
    ok,
    identity: runtimeEnabledExecutiveExperienceFoundationIdentity,
    version: runtimeEnabledExecutiveExperienceFoundationVersion,
    namespace: runtimeEnabledExecutiveExperienceFoundationNamespace,
    layer: runtimeEnabledExecutiveExperienceFoundationLayer,
    phase: runtimeEnabledExecutiveExperienceFoundationPhase,
    stage: runtimeEnabledExecutiveExperienceFoundationStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceFoundationDependencyIdentity,
    surfaceCount: RUNTIME_EXECUTIVE_EXPERIENCE_SURFACES.length,
    subjectKindCount: RUNTIME_EXECUTIVE_EXPERIENCE_SUBJECT_KINDS.length,
    runtimeStateCount: RUNTIME_EXECUTIVE_EXPERIENCE_STATES.length,
    activationStateCount:
      RUNTIME_EXECUTIVE_EXPERIENCE_ACTIVATION_STATES.length,
    presentationStateCount: RUNTIME_EXECUTIVE_PRESENTATION_STATES.length,
    guaranteeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_GUARANTEES.length,
    registrySectionCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeEnabledExecutiveExperienceFoundationApiNames.length,
    frozen: immutabilityOk,
    exDriBoundaryIntact,
    frameworkIndependent,
    presentationStatesValid,
    guaranteesPresent,
    runtimeSourceValid,
  });
}
