/**
 * EX-DRI-1 — Executive Experience ↔ Director Runtime Integration Foundation.
 *
 * Establishes the canonical architectural boundary between Executive Experience
 * (EX) and the frozen Director Runtime Integration (DRI) consumer platform.
 *
 * Rule:
 *   EX describes what happened.
 *   DRI decides what it means and how the executive experience should respond.
 *   EX-DRI is the controlled boundary between them.
 *
 * This phase is foundation only — no runtime orchestration, React wiring,
 * rendering behavior, hooks, stores, event handlers, or UI mutations.
 */

import {
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
  directorRuntimeConsumerIntegrationPublicIndexIdentity,
} from "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveExperienceDirectorRuntimeIntegrationFoundationIdentity =
  "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation" as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationVersion =
  "1.1.0" as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationNamespace =
  "nexora.ex.dri.integration.foundation" as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationLayer =
  "EX-DRI" as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationArchitecturalRole =
  "ExecutiveExperienceDirectorRuntimeBoundary" as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationDependencyIdentity =
  directorRuntimeConsumerIntegrationPublicIndexIdentity;

export const executiveExperienceDirectorRuntimeIntegrationFoundationDependencyPath =
  "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex" as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationStability =
  "FoundationReady" as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationDeterministic =
  true as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationSideEffectPolicy =
  "side-effect-free" as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationMutationPolicy =
  "immutable" as const;

export const executiveExperienceDirectorRuntimeIntegrationFoundationCanonicalIdentity =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeIntegrationFoundationIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationFoundationVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationFoundationNamespace,
    layer: executiveExperienceDirectorRuntimeIntegrationFoundationLayer,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationFoundationArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeIntegrationFoundationDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeIntegrationFoundationDependencyPath,
    stabilityStatus:
      executiveExperienceDirectorRuntimeIntegrationFoundationStability,
    deterministicStatus:
      executiveExperienceDirectorRuntimeIntegrationFoundationDeterministic,
    sideEffectPolicy:
      executiveExperienceDirectorRuntimeIntegrationFoundationSideEffectPolicy,
    mutationPolicy:
      executiveExperienceDirectorRuntimeIntegrationFoundationMutationPolicy,
  });

export const EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PRINCIPLE =
  "EX describes what happened. DRI decides what it means and how the executive experience should respond. EX-DRI is the controlled boundary between them." as const;

export const EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_BOUNDARY =
  Object.freeze({
    exAuthority: "Executive-Experience" as const,
    driAuthority: "Director-Runtime-Integration" as const,
    boundaryAuthority: "EX-DRI" as const,
    architecturalRole:
      "ExecutiveExperienceDirectorRuntimeBoundary" as const,
    soleImmediateDependency:
      "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex" as const,
    consumesPublicIndexOnly: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    duplicatesDirectorRuntime: false as const,
    performsBusinessCalculations: false as const,
    ownsNexoraObjectDomainTruth: false as const,
  });

// ─── Canonical surfaces (authoritative values from frozen DRI public index) ─

/**
 * Canonical Executive Experience surfaces participating in EX ↔ DRI coordination.
 * Values are the frozen DRI consumer surface vocabulary — not UI components.
 */
export const EXECUTIVE_EXPERIENCE_SURFACES =
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES;

export type ExecutiveExperienceSurface =
  (typeof EXECUTIVE_EXPERIENCE_SURFACES)[number];

// ─── Subject kinds (semantic classification only) ───────────────────────────

/**
 * High-level subject categories EX may identify at the DRI boundary.
 * Semantic classification only — no KPI/KOI calculation or business evaluation.
 * KOI = Key Output Index.
 */
export const EXECUTIVE_SUBJECT_KINDS = Object.freeze([
  "goal",
  "intent",
  "object",
  "pack",
  "problem",
  "scenario",
  "decision",
  "execution",
  "kpi",
  "koi",
  "model",
  "data",
  "journal",
] as const);

export type ExecutiveSubjectKind = (typeof EXECUTIVE_SUBJECT_KINDS)[number];

export const EXECUTIVE_SUBJECT_KIND_SEMANTICS = Object.freeze({
  kpi: "NexoraObject performance information" as const,
  koi: "Key Output Index associated with goal / intent focus" as const,
  calculatesKpi: false as const,
  calculatesKoi: false as const,
  usesOnlyCanonicalIndexTerminology: true as const,
});

// ─── Experience modes (descriptive context only — never switches modes) ─────

/**
 * Executive experience modes understood at the integration boundary.
 * Includes EX cockpit mode concepts as lowercase semantic identifiers.
 */
export const EXECUTIVE_EXPERIENCE_MODES = Object.freeze([
  "goal",
  "problem",
  "analysis",
  "scenario",
  "decision",
  "execution",
  "monitoring",
  "war-room",
] as const);

export type ExecutiveExperienceMode =
  (typeof EXECUTIVE_EXPERIENCE_MODES)[number];

// ─── Presentation states (authoritative NexoraObject presentation model) ────

/**
 * Canonical NexoraObject presentation states from frozen DRI public index.
 * EX-DRI-1 defines these states only — DRI resolves which state to use.
 *
 * minimum  — small visual presence / point / caption
 * report   — executive-readable information / KPI / KOI / risk / status
 * operation — interactive executive action / message / command context
 */
export const EXECUTIVE_PRESENTATION_STATES =
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES;

export type ExecutivePresentationState =
  (typeof EXECUTIVE_PRESENTATION_STATES)[number];

// ─── Interaction kinds ──────────────────────────────────────────────────────

/**
 * Canonical EX interaction vocabulary.
 * Overlapping values reuse the frozen DRI consumer interaction kinds.
 * open / close / expand / collapse extend the vocabulary for EX surfaces
 * without conflicting with DRI identifiers.
 */
export const EXECUTIVE_INTERACTION_KINDS = Object.freeze([
  "select",
  "focus",
  "activate",
  "open",
  "close",
  "expand",
  "collapse",
  "dismiss",
  "hover",
  "navigate",
  "inspect",
] as const);

export type ExecutiveInteractionKind =
  (typeof EXECUTIVE_INTERACTION_KINDS)[number];

/** DRI-authoritative interaction kinds preserved for compatibility. */
export const EXECUTIVE_INTERACTION_KINDS_FROM_DRI =
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS;

// ─── Runtime direction kinds (conceptual categories only) ───────────────────

export const EXECUTIVE_RUNTIME_DIRECTION_KINDS = Object.freeze([
  "scene",
  "focus",
  "attention",
  "presentation",
  "guidance",
  "interaction",
  "coordination",
] as const);

export type ExecutiveRuntimeDirectionKind =
  (typeof EXECUTIVE_RUNTIME_DIRECTION_KINDS)[number];

// ─── Integration directions ─────────────────────────────────────────────────

export const EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS = Object.freeze([
  "ex-to-dri",
  "dri-to-ex",
] as const);

export type ExecutiveDirectorRuntimeIntegrationDirection =
  (typeof EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS)[number];

// ─── Plain-data contracts ───────────────────────────────────────────────────

/**
 * Minimal immutable context EX may send toward DRI.
 * Plain, serializable, renderer-independent — no callbacks or DOM refs.
 */
export interface ExecutiveExperienceContext {
  readonly surface: ExecutiveExperienceSurface;
  readonly mode?: ExecutiveExperienceMode;
  readonly selectedSubjectId?: string;
  readonly focusedSubjectId?: string;
  readonly activeGoalId?: string;
  readonly activePackId?: string;
  readonly activeModelId?: string;
  readonly presentationState?: ExecutivePresentationState;
}

/**
 * Lightweight subject identity reference — not a NexoraObject payload.
 */
export interface ExecutiveSubjectReference {
  readonly id: string;
  readonly kind: ExecutiveSubjectKind;
  readonly label?: string;
}

/**
 * Immutable EX-side interaction description: what happened in EX.
 * Does not describe what the UI should do next (DRI decides that).
 */
export interface ExecutiveExperienceInteraction {
  readonly interactionId: string;
  readonly kind: ExecutiveInteractionKind;
  readonly surface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveSubjectReference;
  readonly context: ExecutiveExperienceContext;
}

/**
 * Conceptual request crossing from EX toward DRI — facts and intent only.
 * Must not contain Director instructions (move/dim/open/color/show chart).
 */
export interface ExecutiveDirectorRuntimeRequest {
  readonly interaction?: ExecutiveExperienceInteraction;
  readonly context: ExecutiveExperienceContext;
}

/**
 * Minimal abstract result reference for DRI-directed output toward EX.
 * Conceptual category only — no resolver or directive generation here.
 */
export interface ExecutiveRuntimeDirectionReference {
  readonly directionId: string;
  readonly kind: ExecutiveRuntimeDirectionKind;
  readonly surface?: ExecutiveExperienceSurface;
  readonly subjectId?: string;
}

// ─── Boundary principles ────────────────────────────────────────────────────

export const EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES =
  Object.freeze([
    Object.freeze({
      id: "ex-owns-presentation-components",
      order: 1,
      statement: "EX owns presentation components.",
    }),
    Object.freeze({
      id: "ex-owns-user-interaction-capture",
      order: 2,
      statement: "EX owns user interaction capture.",
    }),
    Object.freeze({
      id: "ex-may-report-executive-context",
      order: 3,
      statement: "EX may report executive context.",
    }),
    Object.freeze({
      id: "ex-must-not-orchestrate-director",
      order: 4,
      statement:
        "EX must not independently orchestrate Director behavior.",
    }),
    Object.freeze({
      id: "dri-owns-runtime-interpretation",
      order: 5,
      statement: "DRI owns runtime interpretation.",
    }),
    Object.freeze({
      id: "dri-owns-focus-attention-resolution",
      order: 6,
      statement: "DRI owns focus and attention resolution.",
    }),
    Object.freeze({
      id: "dri-owns-scene-direction",
      order: 7,
      statement: "DRI owns scene-direction decisions.",
    }),
    Object.freeze({
      id: "dri-owns-adaptive-presentation",
      order: 8,
      statement: "DRI owns adaptive presentation decisions.",
    }),
    Object.freeze({
      id: "dri-owns-runtime-guidance-coordination",
      order: 9,
      statement: "DRI owns runtime guidance coordination.",
    }),
    Object.freeze({
      id: "ex-renders-runtime-directed-outcomes",
      order: 10,
      statement: "EX renders runtime-directed outcomes.",
    }),
    Object.freeze({
      id: "ex-dri-translates-domains",
      order: 11,
      statement: "EX-DRI translates between the two domains.",
    }),
    Object.freeze({
      id: "ex-dri-does-not-duplicate-dri-engines",
      order: 12,
      statement: "EX-DRI does not duplicate DRI engines.",
    }),
    Object.freeze({
      id: "ex-dri-does-not-perform-business-calculations",
      order: 13,
      statement: "EX-DRI does not perform business calculations.",
    }),
    Object.freeze({
      id: "ex-dri-does-not-own-nexora-object-truth",
      order: 14,
      statement: "EX-DRI does not own NexoraObject domain truth.",
    }),
    Object.freeze({
      id: "integration-contracts-deterministic-immutable",
      order: 15,
      statement:
        "Integration contracts must remain deterministic and immutable.",
    }),
  ] as const);

export type ExecutiveExperienceDirectorRuntimeBoundaryPrinciple =
  (typeof EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES)[number];

// ─── Forbidden responsibilities ─────────────────────────────────────────────

export const EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React components",
    "React hooks",
    "Next.js routes",
    "Three.js scene mutation",
    "DOM operations",
    "event listeners",
    "runtime engines",
    "focus resolution",
    "attention scoring",
    "scene orchestration",
    "presentation resolution",
    "guidance generation",
    "Advisor reasoning",
    "Insight generation",
    "KPI calculations",
    "KOI calculations",
    "scenario simulation",
    "decision approval",
    "execution workflow",
    "timeline mutation",
    "journal mutation",
    "network requests",
    "database access",
    "state stores",
    "Zustand stores",
    "Redux stores",
    "side effects",
    "async orchestration",
  ] as const);

export type ExecutiveExperienceDirectorRuntimeForbiddenResponsibility =
  (typeof EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_FORBIDDEN_RESPONSIBILITIES)[number];

// ─── Vocabulary membership helpers ──────────────────────────────────────────

export function isExecutiveExperienceSurface(
  value: unknown,
): value is ExecutiveExperienceSurface {
  return (EXECUTIVE_EXPERIENCE_SURFACES as readonly unknown[]).includes(value);
}

export function isExecutiveSubjectKind(
  value: unknown,
): value is ExecutiveSubjectKind {
  return (EXECUTIVE_SUBJECT_KINDS as readonly unknown[]).includes(value);
}

export function isExecutiveExperienceMode(
  value: unknown,
): value is ExecutiveExperienceMode {
  return (EXECUTIVE_EXPERIENCE_MODES as readonly unknown[]).includes(value);
}

export function isExecutivePresentationState(
  value: unknown,
): value is ExecutivePresentationState {
  return (EXECUTIVE_PRESENTATION_STATES as readonly unknown[]).includes(value);
}

export function isExecutiveInteractionKind(
  value: unknown,
): value is ExecutiveInteractionKind {
  return (EXECUTIVE_INTERACTION_KINDS as readonly unknown[]).includes(value);
}

export function isExecutiveRuntimeDirectionKind(
  value: unknown,
): value is ExecutiveRuntimeDirectionKind {
  return (EXECUTIVE_RUNTIME_DIRECTION_KINDS as readonly unknown[]).includes(
    value,
  );
}

export function isExecutiveDirectorRuntimeIntegrationDirection(
  value: unknown,
): value is ExecutiveDirectorRuntimeIntegrationDirection {
  return (
    EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS as readonly unknown[]
  ).includes(value);
}

// ─── List helpers ───────────────────────────────────────────────────────────

export function listExecutiveExperienceSurfaces(): ReadonlyArray<
  ExecutiveExperienceSurface
> {
  return EXECUTIVE_EXPERIENCE_SURFACES;
}

export function listExecutiveSubjectKinds(): ReadonlyArray<ExecutiveSubjectKind> {
  return EXECUTIVE_SUBJECT_KINDS;
}

export function listExecutiveExperienceModes(): ReadonlyArray<
  ExecutiveExperienceMode
> {
  return EXECUTIVE_EXPERIENCE_MODES;
}

export function listExecutivePresentationStates(): ReadonlyArray<
  ExecutivePresentationState
> {
  return EXECUTIVE_PRESENTATION_STATES;
}

export function listExecutiveInteractionKinds(): ReadonlyArray<
  ExecutiveInteractionKind
> {
  return EXECUTIVE_INTERACTION_KINDS;
}

export function listExecutiveRuntimeDirectionKinds(): ReadonlyArray<
  ExecutiveRuntimeDirectionKind
> {
  return EXECUTIVE_RUNTIME_DIRECTION_KINDS;
}

export function listExecutiveDirectorRuntimeIntegrationDirections():
  ReadonlyArray<ExecutiveDirectorRuntimeIntegrationDirection> {
  return EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS;
}

export function getExecutiveExperienceDirectorRuntimeIntegrationFoundationIdentity():
  typeof executiveExperienceDirectorRuntimeIntegrationFoundationCanonicalIdentity {
  return executiveExperienceDirectorRuntimeIntegrationFoundationCanonicalIdentity;
}

// ─── Immutable constructors (plain-data freeze only) ────────────────────────

function requireOpaqueId(value: string, field: string): void {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
}

export function createExecutiveExperienceContext(
  input: ExecutiveExperienceContext,
): ExecutiveExperienceContext {
  if (!isExecutiveExperienceSurface(input.surface)) {
    throw new TypeError("surface must be a known executive experience surface");
  }
  if (input.mode !== undefined && !isExecutiveExperienceMode(input.mode)) {
    throw new TypeError("mode must be a known executive experience mode");
  }
  if (
    input.presentationState !== undefined &&
    !isExecutivePresentationState(input.presentationState)
  ) {
    throw new TypeError(
      "presentationState must be a known executive presentation state",
    );
  }
  const context: ExecutiveExperienceContext = { surface: input.surface };
  const withOptional = {
    ...context,
    ...(input.mode !== undefined ? { mode: input.mode } : {}),
    ...(input.selectedSubjectId !== undefined
      ? { selectedSubjectId: input.selectedSubjectId }
      : {}),
    ...(input.focusedSubjectId !== undefined
      ? { focusedSubjectId: input.focusedSubjectId }
      : {}),
    ...(input.activeGoalId !== undefined
      ? { activeGoalId: input.activeGoalId }
      : {}),
    ...(input.activePackId !== undefined
      ? { activePackId: input.activePackId }
      : {}),
    ...(input.activeModelId !== undefined
      ? { activeModelId: input.activeModelId }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
  };
  return Object.freeze(withOptional);
}

export function createExecutiveSubjectReference(
  input: ExecutiveSubjectReference,
): ExecutiveSubjectReference {
  requireOpaqueId(input.id, "id");
  if (!isExecutiveSubjectKind(input.kind)) {
    throw new TypeError("kind must be a known executive subject kind");
  }
  if (input.label !== undefined && typeof input.label !== "string") {
    throw new TypeError("label must be a string when provided");
  }
  return Object.freeze(
    input.label !== undefined
      ? { id: input.id, kind: input.kind, label: input.label }
      : { id: input.id, kind: input.kind },
  );
}

export function createExecutiveExperienceInteraction(
  input: ExecutiveExperienceInteraction,
): ExecutiveExperienceInteraction {
  requireOpaqueId(input.interactionId, "interactionId");
  if (!isExecutiveInteractionKind(input.kind)) {
    throw new TypeError("kind must be a known executive interaction kind");
  }
  if (!isExecutiveExperienceSurface(input.surface)) {
    throw new TypeError("surface must be a known executive experience surface");
  }
  const context = createExecutiveExperienceContext(input.context);
  const interaction: ExecutiveExperienceInteraction = {
    interactionId: input.interactionId,
    kind: input.kind,
    surface: input.surface,
    context,
  };
  if (input.subject !== undefined) {
    return Object.freeze({
      ...interaction,
      subject: createExecutiveSubjectReference(input.subject),
    });
  }
  return Object.freeze(interaction);
}

export function createExecutiveDirectorRuntimeRequest(
  input: ExecutiveDirectorRuntimeRequest,
): ExecutiveDirectorRuntimeRequest {
  const context = createExecutiveExperienceContext(input.context);
  if (input.interaction !== undefined) {
    return Object.freeze({
      context,
      interaction: createExecutiveExperienceInteraction(input.interaction),
    });
  }
  return Object.freeze({ context });
}

export function createExecutiveRuntimeDirectionReference(
  input: ExecutiveRuntimeDirectionReference,
): ExecutiveRuntimeDirectionReference {
  requireOpaqueId(input.directionId, "directionId");
  if (!isExecutiveRuntimeDirectionKind(input.kind)) {
    throw new TypeError("kind must be a known executive runtime direction kind");
  }
  if (
    input.surface !== undefined &&
    !isExecutiveExperienceSurface(input.surface)
  ) {
    throw new TypeError("surface must be a known executive experience surface");
  }
  return Object.freeze({
    directionId: input.directionId,
    kind: input.kind,
    ...(input.surface !== undefined ? { surface: input.surface } : {}),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
  });
}

// ─── Public API / type catalogs ─────────────────────────────────────────────

export const EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "ExecutiveExperienceSurface",
    "ExecutiveSubjectKind",
    "ExecutiveExperienceMode",
    "ExecutivePresentationState",
    "ExecutiveInteractionKind",
    "ExecutiveRuntimeDirectionKind",
    "ExecutiveDirectorRuntimeIntegrationDirection",
    "ExecutiveExperienceContext",
    "ExecutiveSubjectReference",
    "ExecutiveExperienceInteraction",
    "ExecutiveDirectorRuntimeRequest",
    "ExecutiveRuntimeDirectionReference",
    "ExecutiveExperienceDirectorRuntimeBoundaryPrinciple",
    "ExecutiveExperienceDirectorRuntimeForbiddenResponsibility",
    "ExecutiveExperienceDirectorRuntimeIntegrationFoundationVerification",
  ] as const);

export const executiveExperienceDirectorRuntimeIntegrationFoundationApiNames =
  Object.freeze([
    "getExecutiveExperienceDirectorRuntimeIntegrationFoundationIdentity",
    "listExecutiveExperienceSurfaces",
    "listExecutiveSubjectKinds",
    "listExecutiveExperienceModes",
    "listExecutivePresentationStates",
    "listExecutiveInteractionKinds",
    "listExecutiveRuntimeDirectionKinds",
    "listExecutiveDirectorRuntimeIntegrationDirections",
    "isExecutiveExperienceSurface",
    "isExecutiveSubjectKind",
    "isExecutiveExperienceMode",
    "isExecutivePresentationState",
    "isExecutiveInteractionKind",
    "isExecutiveRuntimeDirectionKind",
    "isExecutiveDirectorRuntimeIntegrationDirection",
    "createExecutiveExperienceContext",
    "createExecutiveSubjectReference",
    "createExecutiveExperienceInteraction",
    "createExecutiveDirectorRuntimeRequest",
    "createExecutiveRuntimeDirectionReference",
    "verifyExecutiveExperienceDirectorRuntimeIntegrationFoundation",
  ] as const);

export const EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_REGISTRY_SECTIONS =
  Object.freeze([
    "identity",
    "surfaces",
    "subjectKinds",
    "modes",
    "presentationStates",
    "interactionKinds",
    "runtimeDirectionKinds",
    "integrationDirections",
    "boundaryPrinciples",
  ] as const);

// ─── Foundation registry ────────────────────────────────────────────────────

export const executiveExperienceDirectorRuntimeIntegrationFoundationRegistry =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeIntegrationFoundationIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationFoundationVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationFoundationNamespace,
    layer: executiveExperienceDirectorRuntimeIntegrationFoundationLayer,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationFoundationArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeIntegrationFoundationDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeIntegrationFoundationDependencyPath,
    principle: EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PRINCIPLE,
    boundary: EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_BOUNDARY,
    surfaces: EXECUTIVE_EXPERIENCE_SURFACES,
    surfaceCount: EXECUTIVE_EXPERIENCE_SURFACES.length,
    subjectKinds: EXECUTIVE_SUBJECT_KINDS,
    subjectKindCount: EXECUTIVE_SUBJECT_KINDS.length,
    modes: EXECUTIVE_EXPERIENCE_MODES,
    modeCount: EXECUTIVE_EXPERIENCE_MODES.length,
    presentationStates: EXECUTIVE_PRESENTATION_STATES,
    presentationStateCount: EXECUTIVE_PRESENTATION_STATES.length,
    interactionKinds: EXECUTIVE_INTERACTION_KINDS,
    interactionKindCount: EXECUTIVE_INTERACTION_KINDS.length,
    runtimeDirectionKinds: EXECUTIVE_RUNTIME_DIRECTION_KINDS,
    runtimeDirectionKindCount: EXECUTIVE_RUNTIME_DIRECTION_KINDS.length,
    integrationDirections:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS,
    integrationDirectionCount:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS.length,
    boundaryPrinciples:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES,
    boundaryPrincipleCount:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES.length,
    forbiddenResponsibilities:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_FORBIDDEN_RESPONSIBILITIES,
    forbiddenResponsibilityCount:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_FORBIDDEN_RESPONSIBILITIES.length,
    registrySections:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_REGISTRY_SECTIONS,
    registrySectionCount:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_REGISTRY_SECTIONS.length,
    publicTypes:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_TYPE_NAMES.length,
    publicApis:
      executiveExperienceDirectorRuntimeIntegrationFoundationApiNames,
    publicApiCount:
      executiveExperienceDirectorRuntimeIntegrationFoundationApiNames.length,
  });

export const executiveExperienceDirectorRuntimeIntegrationFoundation =
  Object.freeze({
    phase: "EX-DRI-1" as const,
    name: "ExecutiveExperienceDirectorRuntimeIntegrationFoundation" as const,
    identity:
      executiveExperienceDirectorRuntimeIntegrationFoundationIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationFoundationVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationFoundationNamespace,
    layer: executiveExperienceDirectorRuntimeIntegrationFoundationLayer,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationFoundationArchitecturalRole,
    role: "Foundation" as const,
    stage: "Foundation" as const,
    status:
      executiveExperienceDirectorRuntimeIntegrationFoundationStability,
    upstreamDependency:
      executiveExperienceDirectorRuntimeIntegrationFoundationDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeIntegrationFoundationDependencyPath,
    deterministic:
      executiveExperienceDirectorRuntimeIntegrationFoundationDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    browserIndependent: true as const,
    foundation: true as const,
    principle: EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PRINCIPLE,
    boundary: EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_BOUNDARY,
    surfaces: EXECUTIVE_EXPERIENCE_SURFACES,
    subjectKinds: EXECUTIVE_SUBJECT_KINDS,
    modes: EXECUTIVE_EXPERIENCE_MODES,
    presentationStates: EXECUTIVE_PRESENTATION_STATES,
    interactionKinds: EXECUTIVE_INTERACTION_KINDS,
    runtimeDirectionKinds: EXECUTIVE_RUNTIME_DIRECTION_KINDS,
    integrationDirections:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS,
    boundaryPrinciples:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES,
    forbiddenResponsibilities:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_FORBIDDEN_RESPONSIBILITIES,
    subjectKindSemantics: EXECUTIVE_SUBJECT_KIND_SEMANTICS,
    publicApiSurface:
      executiveExperienceDirectorRuntimeIntegrationFoundationApiNames,
    publicTypes:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_TYPE_NAMES,
    registry:
      executiveExperienceDirectorRuntimeIntegrationFoundationRegistry,
    driBoundary: "DRI-8:9-consumer-integration-public-index-only" as const,
    architecturalStatus:
      "Foundation Complete · Deterministic · Immutable · Framework-Independent · ReadyForExDriContracts" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveExperienceDirectorRuntimeIntegrationFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveExperienceDirectorRuntimeIntegrationFoundationIdentity;
  readonly version: typeof executiveExperienceDirectorRuntimeIntegrationFoundationVersion;
  readonly namespace: typeof executiveExperienceDirectorRuntimeIntegrationFoundationNamespace;
  readonly architecturalRole: typeof executiveExperienceDirectorRuntimeIntegrationFoundationArchitecturalRole;
  readonly dependencyIdentity: typeof executiveExperienceDirectorRuntimeIntegrationFoundationDependencyIdentity;
  readonly surfaceCount: number;
  readonly subjectKindCount: number;
  readonly modeCount: number;
  readonly presentationStateCount: number;
  readonly interactionKindCount: number;
  readonly runtimeDirectionKindCount: number;
  readonly integrationDirectionCount: number;
  readonly boundaryPrincipleCount: number;
  readonly registrySectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly driBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly presentationStatesValid: boolean;
  readonly integrationDirectionsValid: boolean;
  readonly boundaryPrinciplesPresent: boolean;
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

function driVocabularyAligned(): boolean {
  return (
    exactOrder(
      [...EXECUTIVE_EXPERIENCE_SURFACES],
      [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES],
    ) &&
    exactOrder(
      [...EXECUTIVE_PRESENTATION_STATES],
      [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES],
    ) &&
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS.every(
      (kind) =>
        (EXECUTIVE_INTERACTION_KINDS as readonly string[]).includes(kind),
    )
  );
}

export function verifyExecutiveExperienceDirectorRuntimeIntegrationFoundation():
  ExecutiveExperienceDirectorRuntimeIntegrationFoundationVerification {
  const foundation =
    executiveExperienceDirectorRuntimeIntegrationFoundation;
  const registry =
    executiveExperienceDirectorRuntimeIntegrationFoundationRegistry;

  const identityOk =
    foundation.identity ===
      "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation" &&
    foundation.version === "1.1.0" &&
    foundation.namespace === "nexora.ex.dri.integration.foundation" &&
    foundation.layer === "EX-DRI" &&
    foundation.architecturalRole ===
      "ExecutiveExperienceDirectorRuntimeBoundary" &&
    foundation.role === "Foundation" &&
    foundation.status === "FoundationReady" &&
    foundation.upstreamDependency ===
      "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex" &&
    foundation.upstreamDependency ===
      directorRuntimeConsumerIntegrationPublicIndexIdentity &&
    registry.dependencyIdentity === foundation.upstreamDependency &&
    foundation.driBoundary ===
      "DRI-8:9-consumer-integration-public-index-only";

  const namespaceOk =
    executiveExperienceDirectorRuntimeIntegrationFoundationNamespace ===
      "nexora.ex.dri.integration.foundation" &&
    registry.namespace ===
      executiveExperienceDirectorRuntimeIntegrationFoundationNamespace;

  const dependencyOk =
    foundation.dependencyPath ===
      "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex" &&
    EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_BOUNDARY
      .consumesPublicIndexOnly === true &&
    EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_BOUNDARY
      .soleImmediateDependency ===
      "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex" &&
    driVocabularyAligned();

  const orderingOk =
    exactOrder(EXECUTIVE_EXPERIENCE_SURFACES, [
      "stage",
      "advisor",
      "insight",
      "live-lens",
      "timeline",
      "explorer",
    ]) &&
    exactOrder(EXECUTIVE_SUBJECT_KINDS, [
      "goal",
      "intent",
      "object",
      "pack",
      "problem",
      "scenario",
      "decision",
      "execution",
      "kpi",
      "koi",
      "model",
      "data",
      "journal",
    ]) &&
    exactOrder(EXECUTIVE_EXPERIENCE_MODES, [
      "goal",
      "problem",
      "analysis",
      "scenario",
      "decision",
      "execution",
      "monitoring",
      "war-room",
    ]) &&
    exactOrder(EXECUTIVE_PRESENTATION_STATES, [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder(EXECUTIVE_INTERACTION_KINDS, [
      "select",
      "focus",
      "activate",
      "open",
      "close",
      "expand",
      "collapse",
      "dismiss",
      "hover",
      "navigate",
      "inspect",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_DIRECTION_KINDS, [
      "scene",
      "focus",
      "attention",
      "presentation",
      "guidance",
      "interaction",
      "coordination",
    ]) &&
    exactOrder(EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS, [
      "ex-to-dri",
      "dri-to-ex",
    ]);

  const uniquenessOk =
    unique([...EXECUTIVE_EXPERIENCE_SURFACES]) &&
    unique([...EXECUTIVE_SUBJECT_KINDS]) &&
    unique([...EXECUTIVE_EXPERIENCE_MODES]) &&
    unique([...EXECUTIVE_PRESENTATION_STATES]) &&
    unique([...EXECUTIVE_INTERACTION_KINDS]) &&
    unique([...EXECUTIVE_RUNTIME_DIRECTION_KINDS]) &&
    unique([...EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS]) &&
    unique(
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES.map(
        (entry) => entry.id,
      ),
    ) &&
    unique([
      ...EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_REGISTRY_SECTIONS,
    ]);

  const presentationStatesValid = exactOrder(EXECUTIVE_PRESENTATION_STATES, [
    "minimum",
    "report",
    "operation",
  ]);

  const integrationDirectionsValid = exactOrder(
    EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS,
    ["ex-to-dri", "dri-to-ex"],
  );

  const boundaryPrinciplesPresent =
    EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES.length === 15 &&
    exactOrder(
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES.map(
        (entry) => entry.id,
      ),
      [
        "ex-owns-presentation-components",
        "ex-owns-user-interaction-capture",
        "ex-may-report-executive-context",
        "ex-must-not-orchestrate-director",
        "dri-owns-runtime-interpretation",
        "dri-owns-focus-attention-resolution",
        "dri-owns-scene-direction",
        "dri-owns-adaptive-presentation",
        "dri-owns-runtime-guidance-coordination",
        "ex-renders-runtime-directed-outcomes",
        "ex-dri-translates-domains",
        "ex-dri-does-not-duplicate-dri-engines",
        "ex-dri-does-not-perform-business-calculations",
        "ex-dri-does-not-own-nexora-object-truth",
        "integration-contracts-deterministic-immutable",
      ],
    ) &&
    EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES.every(
      (entry, index) => entry.order === index + 1,
    );

  const registryIntegrityOk =
    registry.surfaceCount === EXECUTIVE_EXPERIENCE_SURFACES.length &&
    registry.subjectKindCount === EXECUTIVE_SUBJECT_KINDS.length &&
    registry.modeCount === EXECUTIVE_EXPERIENCE_MODES.length &&
    registry.presentationStateCount ===
      EXECUTIVE_PRESENTATION_STATES.length &&
    registry.interactionKindCount === EXECUTIVE_INTERACTION_KINDS.length &&
    registry.runtimeDirectionKindCount ===
      EXECUTIVE_RUNTIME_DIRECTION_KINDS.length &&
    registry.integrationDirectionCount ===
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS.length &&
    registry.boundaryPrincipleCount ===
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES.length &&
    registry.registrySectionCount ===
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_REGISTRY_SECTIONS
        .length &&
    registry.publicTypeCount ===
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_TYPE_NAMES
        .length &&
    registry.publicApiCount ===
      executiveExperienceDirectorRuntimeIntegrationFoundationApiNames
        .length &&
    exactOrder(
      [
        ...EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_REGISTRY_SECTIONS,
      ],
      [
        "identity",
        "surfaces",
        "subjectKinds",
        "modes",
        "presentationStates",
        "interactionKinds",
        "runtimeDirectionKinds",
        "integrationDirections",
        "boundaryPrinciples",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(foundation) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      executiveExperienceDirectorRuntimeIntegrationFoundationCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_EXPERIENCE_SURFACES) &&
    Object.isFrozen(EXECUTIVE_SUBJECT_KINDS) &&
    Object.isFrozen(EXECUTIVE_EXPERIENCE_MODES) &&
    Object.isFrozen(EXECUTIVE_PRESENTATION_STATES) &&
    Object.isFrozen(EXECUTIVE_INTERACTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_DIRECTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS) &&
    Object.isFrozen(
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES,
    ) &&
    Object.isFrozen(
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_FORBIDDEN_RESPONSIBILITIES,
    ) &&
    Object.isFrozen(
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_BOUNDARY,
    ) &&
    Object.isFrozen(
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_REGISTRY_SECTIONS,
    ) &&
    Object.isFrozen(EXECUTIVE_SUBJECT_KIND_SEMANTICS);

  const driBoundaryIntact =
    foundation.upstreamDependency ===
      "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex" &&
    foundation.boundary.soleImmediateDependency ===
      "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex" &&
    foundation.boundary.consumesPublicIndexOnly === true &&
    foundation.boundary.duplicatesDirectorRuntime === false;

  const frameworkIndependent =
    foundation.frameworkIndependent === true &&
    foundation.rendererIndependent === true &&
    foundation.browserIndependent === true &&
    foundation.boundary.frameworkIndependent === true;

  const ok =
    identityOk &&
    namespaceOk &&
    dependencyOk &&
    orderingOk &&
    uniquenessOk &&
    presentationStatesValid &&
    integrationDirectionsValid &&
    boundaryPrinciplesPresent &&
    registryIntegrityOk &&
    immutabilityOk &&
    driBoundaryIntact &&
    frameworkIndependent &&
    foundation.principle ===
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PRINCIPLE &&
    EXECUTIVE_SUBJECT_KIND_SEMANTICS.koi ===
      "Key Output Index associated with goal / intent focus" &&
    EXECUTIVE_SUBJECT_KIND_SEMANTICS.usesOnlyCanonicalIndexTerminology ===
      true &&
    EXECUTIVE_SUBJECT_KIND_SEMANTICS.calculatesKpi === false &&
    EXECUTIVE_SUBJECT_KIND_SEMANTICS.calculatesKoi === false;

  return Object.freeze({
    ok,
    identity:
      executiveExperienceDirectorRuntimeIntegrationFoundationIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationFoundationVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationFoundationNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationFoundationArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeIntegrationFoundationDependencyIdentity,
    surfaceCount: EXECUTIVE_EXPERIENCE_SURFACES.length,
    subjectKindCount: EXECUTIVE_SUBJECT_KINDS.length,
    modeCount: EXECUTIVE_EXPERIENCE_MODES.length,
    presentationStateCount: EXECUTIVE_PRESENTATION_STATES.length,
    interactionKindCount: EXECUTIVE_INTERACTION_KINDS.length,
    runtimeDirectionKindCount: EXECUTIVE_RUNTIME_DIRECTION_KINDS.length,
    integrationDirectionCount:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS.length,
    boundaryPrincipleCount:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_BOUNDARY_PRINCIPLES.length,
    registrySectionCount:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_REGISTRY_SECTIONS
        .length,
    publicTypeCount:
      EXECUTIVE_EXPERIENCE_DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_TYPE_NAMES
        .length,
    publicApiCount:
      executiveExperienceDirectorRuntimeIntegrationFoundationApiNames.length,
    frozen: immutabilityOk,
    driBoundaryIntact,
    frameworkIndependent,
    presentationStatesValid,
    integrationDirectionsValid,
    boundaryPrinciplesPresent,
  });
}
