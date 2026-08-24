/**
 * REX-6:5 — Runtime Executive Workspace Transition & Dial Orchestration.
 *
 * Deterministic orchestration of semantic workspace transitions after REX-6:3
 * resolves context and REX-6:4 resolves surface composition.
 *
 * Canonical flow:
 *   Control / Runtime Signal → Transition Request
 *     → REX-6:3 Resolve Context → REX-6:4 Compose Surfaces
 *     → REX-6:5 Coordinate Transition → Workspace Transition Plan
 *
 * The Workspace Dial is a semantic transition control source — not a workspace,
 * not a surface, and not a visual component. No Dial geometry, automotive
 * styling, animation timing, React, or Three.js/R3F.
 *
 * Dial selects meaning → REX resolves meaning → REX orchestrates meaning → Cockpit renders experience.
 */

import {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_TRANSITION_REASONS,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSurfaceCompositionResult,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSubject,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  resolveRuntimeExecutiveWorkspaceSurfaceParticipation,
  runtimeExecutiveWorkspaceSurfaceCompositionIdentity,
  runtimeExecutiveWorkspaceSurfaceCompositionSupportedImportPath,
  runtimeExecutiveWorkspaceSurfaceCompositionVersion,
  verifyRuntimeExecutiveWorkspaceSurfaceComposition,
  type RuntimeExecutiveWorkspaceContextContract,
  type RuntimeExecutiveWorkspaceContextResolutionResult,
  type RuntimeExecutiveWorkspaceFocusContract,
  type RuntimeExecutiveWorkspaceIntent,
  type RuntimeExecutiveWorkspaceKind,
  type RuntimeExecutiveWorkspacePresentationState,
  type RuntimeExecutiveWorkspaceSubjectContract,
  type RuntimeExecutiveWorkspaceSurfaceCompositionResult,
  type RuntimeExecutiveWorkspaceSurfaceParticipation,
  type RuntimeExecutiveWorkspaceSurfaceRole,
  type RuntimeExecutiveWorkspaceTransitionReason,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceSurfaceComposition";

// ─── Transitively published Composition / Transition surface (for REX-6:6+) ─

export {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSurfaceCompositionResult,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSubject,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  resolveRuntimeExecutiveWorkspaceSurfaceParticipation,
  runtimeExecutiveWorkspaceSurfaceCompositionIdentity,
  verifyRuntimeExecutiveWorkspaceSurfaceComposition,
};

export type {
  RuntimeExecutiveWorkspaceContextContract,
  RuntimeExecutiveWorkspaceContextResolutionResult,
  RuntimeExecutiveWorkspaceFocusContract,
  RuntimeExecutiveWorkspaceIntent,
  RuntimeExecutiveWorkspaceKind,
  RuntimeExecutiveWorkspacePresentationState,
  RuntimeExecutiveWorkspaceSubjectContract,
  RuntimeExecutiveWorkspaceSurfaceCompositionResult,
  RuntimeExecutiveWorkspaceSurfaceParticipation,
  RuntimeExecutiveWorkspaceSurfaceRole,
  RuntimeExecutiveWorkspaceTransitionReason,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity =
  "REX-6:5/RuntimeExecutiveWorkspaceTransitionDialOrchestration" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationVersion =
  "6.5.0" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationNamespace =
  "nexora.rex.workspace-experience.transition-dial-orchestration" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationLayer =
  "REX" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationCapability =
  "RuntimeExecutiveWorkspaceExperience" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationPhase =
  "TransitionDialOrchestration" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationStatus =
  "TransitionDialOrchestrationReady" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationArchitecturalRole =
  "RuntimeExecutiveWorkspaceTransitionDialOrchestration" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyIdentity =
  runtimeExecutiveWorkspaceSurfaceCompositionIdentity;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyPath =
  runtimeExecutiveWorkspaceSurfaceCompositionSupportedImportPath;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveWorkspaceTransitionDialOrchestration" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationStability =
  "TransitionDialOrchestrationReady" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationDeterministic =
  true as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity,
    version: runtimeExecutiveWorkspaceTransitionDialOrchestrationVersion,
    namespace: runtimeExecutiveWorkspaceTransitionDialOrchestrationNamespace,
    layer: runtimeExecutiveWorkspaceTransitionDialOrchestrationLayer,
    capability:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationCapability,
    phase: runtimeExecutiveWorkspaceTransitionDialOrchestrationPhase,
    status: runtimeExecutiveWorkspaceTransitionDialOrchestrationStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationSupportedImportPath,
    upstreamVersion: runtimeExecutiveWorkspaceSurfaceCompositionVersion,
    stabilityStatus:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationStability,
    deterministicStatus:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_PRINCIPLE =
  "Coordinate semantic workspace transitions after context resolution and surface composition — Dial/control sources request meaning; REX orchestrates meaning; cockpit renders experience." as const;

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    orchestrationAuthority: "REX-6:5" as const,
    architecturalRole:
      "RuntimeExecutiveWorkspaceTransitionDialOrchestration" as const,
    soleImmediateDependency:
      "REX-6:4/RuntimeExecutiveWorkspaceSurfaceComposition" as const,
    consumesCompositionOnly: true as const,
    importsRex63Directly: false as const,
    importsRex62Directly: false as const,
    importsRex61Directly: false as const,
    importsRex5Directly: false as const,
    importsRex4Directly: false as const,
    importsRex3Directly: false as const,
    importsRex2Directly: false as const,
    importsRex1Directly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    dialIsControlSource: true as const,
    dialIsNotWorkspace: true as const,
    dialIsNotSurface: true as const,
    dialGeometryIndependent: true as const,
    automotiveStylingIndependent: true as const,
    animationTimingIndependent: true as const,
    inputDeviceIndependent: true as const,
    imposesLinearWorkflow: false as const,
    allWorkspacePairsRepresentable: true as const,
    introducesUi: false as const,
    introducesDialGeometry: false as const,
    introducesRendering: false as const,
    introducesTimers: false as const,
    introducesBusinessExecution: false as const,
    introducesAdvisorGeneration: false as const,
    introducesInsightGeneration: false as const,
    introducesCameraBehavior: false as const,
    introducesPersistence: false as const,
    introducesExternalIntegration: false as const,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_SEPARATION =
  Object.freeze({
    dialSelectsMeaning: true as const,
    rexResolvesMeaning: true as const,
    rexOrchestratesMeaning: true as const,
    cockpitRendersExperience: true as const,
    dialDoesNotManipulateStageDirectly: true as const,
  });

// ─── Inherited vocabularies ─────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_WORKSPACE_KINDS =
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS;

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SURFACES =
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES;

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PARTICIPATIONS =
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS;

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS =
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_TRANSITION_REASONS;

// ─── Transition / Dial vocabularies ─────────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES = Object.freeze([
  "planned",
  "unchanged",
  "rejected",
] as const);

export type RuntimeExecutiveWorkspaceTransitionStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES = Object.freeze([
  "prepare",
  "leave",
  "enter",
  "settle",
] as const);

export type RuntimeExecutiveWorkspaceTransitionPhase =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES)[number];

/**
 * Semantic transition sources. `dial` means the request originated from a
 * Workspace Dial control — not geometry, styling, or physical interaction.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES = Object.freeze([
  "user",
  "dial",
  "advisor",
  "action",
  "runtime",
  "system",
] as const);

export type RuntimeExecutiveWorkspaceTransitionSource =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS =
  Object.freeze([
    "preserve",
    "activate",
    "deactivate",
    "promote",
    "demote",
  ] as const);

export type RuntimeExecutiveWorkspaceSurfaceTransitionKind =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS)[number];

/** Semantic participation rank for promote/demote comparison only — not z-index/size. */
export const RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK = Object.freeze({
  inactive: 0,
  contextual: 1,
  supporting: 2,
  primary: 3,
} as const satisfies Record<
  RuntimeExecutiveWorkspaceSurfaceParticipation,
  number
>);

export const RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_TRANSITION_KINDS =
  Object.freeze(["preserve", "replace", "clear"] as const);

export type RuntimeExecutiveWorkspaceSubjectTransitionKind =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_TRANSITION_KINDS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_FOCUS_TRANSITION_KINDS = Object.freeze([
  "preserve",
  "retarget",
  "clear",
] as const);

export type RuntimeExecutiveWorkspaceFocusTransitionKind =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_FOCUS_TRANSITION_KINDS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_TRANSITION_KINDS =
  Object.freeze(["preserve", "replace"] as const);

export type RuntimeExecutiveWorkspacePresentationTransitionKind =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_TRANSITION_KINDS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_DIAL_AVAILABILITIES = Object.freeze([
  "available",
  "current",
  "unavailable",
] as const);

export type RuntimeExecutiveWorkspaceDialAvailability =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_DIAL_AVAILABILITIES)[number];

/** Canonical workspace options a generic Dial may expose semantically. */
export const RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS = Object.freeze([
  "overview",
  "problem",
  "scenario",
  "decision",
  "execution",
] as const satisfies ReadonlyArray<RuntimeExecutiveWorkspaceKind>);

/**
 * Initial policy: every canonical workspace pair is semantically representable.
 * Matrix is inspectable; true means allowed.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_MATRIX = Object.freeze(
  Object.fromEntries(
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_WORKSPACE_KINDS.map((from) => [
      from,
      Object.freeze(
        Object.fromEntries(
          RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_WORKSPACE_KINDS.map((to) => [
            to,
            true,
          ]),
        ),
      ),
    ]),
  ) as Readonly<
    Record<
      RuntimeExecutiveWorkspaceKind,
      Readonly<Record<RuntimeExecutiveWorkspaceKind, true>>
    >
  >,
);

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_GUARANTEES =
  Object.freeze([
    "deterministic",
    "immutable",
    "composition-aligned",
    "plain-data",
    "serializable-friendly",
    "renderer-independent",
    "dial-geometry-independent",
    "input-device-independent",
    "animation-timing-independent",
    "automotive-styling-independent",
    "non-linear-transition-capable",
    "same-workspace-context-capable",
    "presentation-state-independent",
    "side-effect-free",
    "timer-free",
  ] as const);

export type RuntimeExecutiveWorkspaceTransitionOrchestrationGuarantee =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Statuses",
    "Phases",
    "Sources",
    "SurfaceTransitionKinds",
    "ParticipationRank",
    "SubjectTransitionKinds",
    "FocusTransitionKinds",
    "PresentationTransitionKinds",
    "DialOptions",
    "TransitionMatrix",
    "Invariants",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveWorkspaceTransitionOrchestrationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_REGISTRY_SECTIONS)[number];

// ─── Domain contracts ───────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceDialRequest {
  readonly requestedWorkspace: RuntimeExecutiveWorkspaceKind;
  readonly requestedSubject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly requestedIntent?: RuntimeExecutiveWorkspaceIntent;
  readonly reason?: RuntimeExecutiveWorkspaceTransitionReason;
}

export interface RuntimeExecutiveWorkspaceDialOption {
  readonly workspace: RuntimeExecutiveWorkspaceKind;
  readonly availability: RuntimeExecutiveWorkspaceDialAvailability;
  readonly selected: boolean;
}

export interface RuntimeExecutiveWorkspaceNormalizedTransitionRequest {
  readonly requestedWorkspaceKind: RuntimeExecutiveWorkspaceKind;
  readonly source: RuntimeExecutiveWorkspaceTransitionSource;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly requestedSubject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly requestedIntent?: RuntimeExecutiveWorkspaceIntent;
}

export interface RuntimeExecutiveWorkspaceSurfaceTransitionInstruction {
  readonly surface: RuntimeExecutiveWorkspaceSurfaceRole;
  readonly from: RuntimeExecutiveWorkspaceSurfaceParticipation;
  readonly to: RuntimeExecutiveWorkspaceSurfaceParticipation;
  readonly kind: RuntimeExecutiveWorkspaceSurfaceTransitionKind;
}

export interface RuntimeExecutiveWorkspaceSubjectTransition {
  readonly kind: RuntimeExecutiveWorkspaceSubjectTransitionKind;
  readonly from: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly to: RuntimeExecutiveWorkspaceSubjectContract | null;
}

export interface RuntimeExecutiveWorkspaceFocusTransition {
  readonly kind: RuntimeExecutiveWorkspaceFocusTransitionKind;
  readonly from: RuntimeExecutiveWorkspaceFocusContract;
  readonly to: RuntimeExecutiveWorkspaceFocusContract;
}

export interface RuntimeExecutiveWorkspacePresentationTransition {
  readonly kind: RuntimeExecutiveWorkspacePresentationTransitionKind;
  readonly from: RuntimeExecutiveWorkspacePresentationState;
  readonly to: RuntimeExecutiveWorkspacePresentationState;
}

export interface RuntimeExecutiveWorkspaceTransitionPlan {
  readonly fromWorkspace: RuntimeExecutiveWorkspaceKind;
  readonly toWorkspace: RuntimeExecutiveWorkspaceKind;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly source: RuntimeExecutiveWorkspaceTransitionSource;
  readonly phases: readonly RuntimeExecutiveWorkspaceTransitionPhase[];
  readonly surfaces: readonly RuntimeExecutiveWorkspaceSurfaceTransitionInstruction[];
  readonly subject: RuntimeExecutiveWorkspaceSubjectTransition;
  readonly focus: RuntimeExecutiveWorkspaceFocusTransition;
  readonly presentation: RuntimeExecutiveWorkspacePresentationTransition;
  readonly workspaceChanged: boolean;
  readonly contextChanged: boolean;
}

export interface RuntimeExecutiveWorkspaceTransitionOrchestrationInput {
  readonly currentContext: RuntimeExecutiveWorkspaceContextContract;
  readonly targetContext: RuntimeExecutiveWorkspaceContextContract;
  readonly currentComposition: RuntimeExecutiveWorkspaceSurfaceCompositionResult;
  readonly targetComposition: RuntimeExecutiveWorkspaceSurfaceCompositionResult;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly source: RuntimeExecutiveWorkspaceTransitionSource;
}

export interface RuntimeExecutiveWorkspaceTransitionOrchestrationResult {
  readonly status: RuntimeExecutiveWorkspaceTransitionStatus;
  readonly sourceWorkspace: RuntimeExecutiveWorkspaceKind;
  readonly targetWorkspace: RuntimeExecutiveWorkspaceKind;
  readonly workspaceChanged: boolean;
  readonly contextChanged: boolean;
  readonly sourceComposition: RuntimeExecutiveWorkspaceSurfaceCompositionResult;
  readonly targetComposition: RuntimeExecutiveWorkspaceSurfaceCompositionResult;
  readonly phases: readonly RuntimeExecutiveWorkspaceTransitionPhase[];
  readonly surfaces: readonly RuntimeExecutiveWorkspaceSurfaceTransitionInstruction[];
  readonly subject: RuntimeExecutiveWorkspaceSubjectTransition;
  readonly focus: RuntimeExecutiveWorkspaceFocusTransition;
  readonly presentation: RuntimeExecutiveWorkspacePresentationTransition;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly source: RuntimeExecutiveWorkspaceTransitionSource;
  readonly plan: RuntimeExecutiveWorkspaceTransitionPlan | null;
}

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "plan-has-canonical-source-workspace",
      order: 1,
      statement: "Every transition plan has a canonical source workspace.",
    }),
    Object.freeze({
      id: "plan-has-canonical-target-workspace",
      order: 2,
      statement: "Every transition plan has a canonical target workspace.",
    }),
    Object.freeze({
      id: "planning-deterministic",
      order: 3,
      statement: "Transition planning is deterministic.",
    }),
    Object.freeze({
      id: "phase-order-prepare-leave-enter-settle",
      order: 4,
      statement: "Phase order is always prepare → leave → enter → settle.",
    }),
    Object.freeze({
      id: "every-surface-one-instruction",
      order: 5,
      statement:
        "Every canonical surface receives exactly one transition instruction.",
    }),
    Object.freeze({
      id: "surface-kind-from-participation",
      order: 6,
      statement:
        "Surface transition kind is derived from current/target participation.",
    }),
    Object.freeze({
      id: "equal-participation-preserve",
      order: 7,
      statement: "Equal participation produces preserve.",
    }),
    Object.freeze({
      id: "inactive-to-participating-activate",
      order: 8,
      statement: "inactive → participating produces activate.",
    }),
    Object.freeze({
      id: "participating-to-inactive-deactivate",
      order: 9,
      statement: "participating → inactive produces deactivate.",
    }),
    Object.freeze({
      id: "increased-rank-promote",
      order: 10,
      statement: "Increased participation rank produces promote.",
    }),
    Object.freeze({
      id: "decreased-rank-demote",
      order: 11,
      statement: "Decreased participation rank produces demote.",
    }),
    Object.freeze({
      id: "workspace-context-change-separate",
      order: 12,
      statement: "Workspace and context change remain separate.",
    }),
    Object.freeze({
      id: "same-workspace-context-transitions-supported",
      order: 13,
      statement: "Same-workspace context transitions are supported.",
    }),
    Object.freeze({
      id: "non-linear-movement-supported",
      order: 14,
      statement: "Non-linear workspace movement is supported.",
    }),
    Object.freeze({
      id: "all-workspace-pairs-representable",
      order: 15,
      statement:
        "All canonical workspace pairs are representable under initial policy.",
    }),
    Object.freeze({
      id: "dial-is-transition-source-not-workspace",
      order: 16,
      statement: "Dial is a transition source, not a workspace.",
    }),
    Object.freeze({
      id: "dial-not-workspace-surface",
      order: 17,
      statement: "Dial is not a workspace surface.",
    }),
    Object.freeze({
      id: "dial-request-no-geometry",
      order: 18,
      statement: "Dial request contains no geometry.",
    }),
    Object.freeze({
      id: "devices-normalize-to-semantic-requests",
      order: 19,
      statement:
        "Input devices normalize to semantic transition requests.",
    }),
    Object.freeze({
      id: "reasons-device-independent",
      order: 20,
      statement: "Transition reasons remain device-independent.",
    }),
    Object.freeze({
      id: "subject-transition-no-domain-mutation",
      order: 21,
      statement: "Subject transition does not mutate domain objects.",
    }),
    Object.freeze({
      id: "focus-transition-no-camera",
      order: 22,
      statement: "Focus transition contains no camera behavior.",
    }),
    Object.freeze({
      id: "presentation-independent-of-workspace",
      order: 23,
      statement: "Presentation state remains independent from workspace.",
    }),
    Object.freeze({
      id: "no-business-execution",
      order: 24,
      statement: "Orchestration does not execute business actions.",
    }),
    Object.freeze({
      id: "no-ui-rendering",
      order: 25,
      statement: "Orchestration does not render UI.",
    }),
    Object.freeze({
      id: "no-react",
      order: 26,
      statement: "Orchestration does not call React.",
    }),
    Object.freeze({
      id: "no-three-js",
      order: 27,
      statement: "Orchestration does not depend on Three.js.",
    }),
    Object.freeze({
      id: "no-r3f",
      order: 28,
      statement: "Orchestration does not depend on R3F.",
    }),
    Object.freeze({
      id: "no-automotive-visual-semantics",
      order: 29,
      statement:
        "Orchestration contains no automotive visual semantics.",
    }),
    Object.freeze({
      id: "registries-mutation-safe",
      order: 30,
      statement: "Canonical registries are mutation-safe.",
    }),
    Object.freeze({
      id: "output-serializable-friendly",
      order: 31,
      statement: "Output is serializable-friendly.",
    }),
    Object.freeze({
      id: "no-timers-or-async-side-effects",
      order: 32,
      statement: "No timers or asynchronous side effects exist.",
    }),
  ]);

export type RuntimeExecutiveWorkspaceTransitionOrchestrationInvariant =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "visual-workspace-dial",
    "quarter-circle-dial",
    "physical-rotary-ui",
    "automotive-styling",
    "top-cockpit-buttons",
    "side-menu-controls",
    "react-components",
    "three-js",
    "react-three-fiber",
    "scene-rendering",
    "dom-manipulation",
    "camera-transitions",
    "object-movement",
    "animation-timing",
    "easing",
    "css",
    "touch-gesture-recognition",
    "pointer-event-handling",
    "keyboard-listeners",
    "voice-recognition",
    "advisor-generation",
    "insight-generation",
    "business-action-execution",
    "persistence",
    "routing",
    "networking",
  ] as const);

// ─── Internal helpers ───────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

function subjectsEqual(
  left: RuntimeExecutiveWorkspaceSubjectContract | null | undefined,
  right: RuntimeExecutiveWorkspaceSubjectContract | null | undefined,
): boolean {
  if (left == null && right == null) return true;
  if (left == null || right == null) return false;
  return left.kind === right.kind && left.id === right.id;
}

function focusEqual(
  left: RuntimeExecutiveWorkspaceFocusContract,
  right: RuntimeExecutiveWorkspaceFocusContract,
): boolean {
  if (!subjectsEqual(left.primarySubject, right.primarySubject)) return false;
  if (left.relatedSubjects.length !== right.relatedSubjects.length) return false;
  return left.relatedSubjects.every((entry, index) =>
    subjectsEqual(entry, right.relatedSubjects[index]),
  );
}

function participationForSurface(
  composition: RuntimeExecutiveWorkspaceSurfaceCompositionResult,
  surface: RuntimeExecutiveWorkspaceSurfaceRole,
): RuntimeExecutiveWorkspaceSurfaceParticipation {
  const entry = composition.surfaces.find((item) => item.surface === surface);
  if (!entry) {
    throw new TypeError(`composition missing surface ${surface}`);
  }
  return entry.participation;
}

function isFocusCleared(focus: RuntimeExecutiveWorkspaceFocusContract): boolean {
  return focus.primarySubject === null && focus.relatedSubjects.length === 0;
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveWorkspaceTransitionStatus(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionStatus {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceTransitionPhase(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionPhase {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceTransitionSource(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionSource {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceSurfaceTransitionKind(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSurfaceTransitionKind {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceDialRequest(
  value: unknown,
): value is RuntimeExecutiveWorkspaceDialRequest {
  if (!isPlainObject(value)) return false;
  return isRuntimeExecutiveWorkspaceKind(value.requestedWorkspace);
}

export function isRuntimeExecutiveWorkspaceTransitionPlan(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionPlan {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceKind(value.fromWorkspace) &&
    isRuntimeExecutiveWorkspaceKind(value.toWorkspace) &&
    Array.isArray(value.phases) &&
    exactOrder(
      value.phases as RuntimeExecutiveWorkspaceTransitionPhase[],
      [...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES],
    ) &&
    Array.isArray(value.surfaces) &&
    value.surfaces.length ===
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SURFACES.length
  );
}

export function isRuntimeExecutiveWorkspaceTransitionReason(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionReason {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS as readonly unknown[]
  ).includes(value);
}

// ─── Surface / subject / focus / presentation transition resolvers ──────────

export function resolveRuntimeExecutiveWorkspaceSurfaceTransition(input: {
  readonly from: RuntimeExecutiveWorkspaceSurfaceParticipation;
  readonly to: RuntimeExecutiveWorkspaceSurfaceParticipation;
}): RuntimeExecutiveWorkspaceSurfaceTransitionKind {
  if (
    !isRuntimeExecutiveWorkspaceSurfaceParticipation(input.from) ||
    !isRuntimeExecutiveWorkspaceSurfaceParticipation(input.to)
  ) {
    throw new TypeError("from/to must be canonical participation values");
  }
  if (input.from === input.to) return "preserve";
  if (input.from === "inactive" && input.to !== "inactive") return "activate";
  if (input.from !== "inactive" && input.to === "inactive") return "deactivate";
  const fromRank = RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK[input.from];
  const toRank = RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK[input.to];
  if (toRank > fromRank) return "promote";
  if (toRank < fromRank) return "demote";
  return "preserve";
}

export function resolveRuntimeExecutiveWorkspaceSubjectTransition(input: {
  readonly from: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly to: RuntimeExecutiveWorkspaceSubjectContract | null;
}): RuntimeExecutiveWorkspaceSubjectTransition {
  if (subjectsEqual(input.from, input.to)) {
    return Object.freeze({
      kind: "preserve",
      from: input.from,
      to: input.to,
    });
  }
  if (input.to === null) {
    return Object.freeze({
      kind: "clear",
      from: input.from,
      to: null,
    });
  }
  return Object.freeze({
    kind: "replace",
    from: input.from,
    to: input.to,
  });
}

export function resolveRuntimeExecutiveWorkspaceFocusTransition(input: {
  readonly from: RuntimeExecutiveWorkspaceFocusContract;
  readonly to: RuntimeExecutiveWorkspaceFocusContract;
}): RuntimeExecutiveWorkspaceFocusTransition {
  if (focusEqual(input.from, input.to)) {
    return Object.freeze({
      kind: "preserve",
      from: input.from,
      to: input.to,
    });
  }
  if (isFocusCleared(input.to)) {
    return Object.freeze({
      kind: "clear",
      from: input.from,
      to: input.to,
    });
  }
  return Object.freeze({
    kind: "retarget",
    from: input.from,
    to: input.to,
  });
}

export function resolveRuntimeExecutiveWorkspacePresentationTransition(input: {
  readonly from: RuntimeExecutiveWorkspacePresentationState;
  readonly to: RuntimeExecutiveWorkspacePresentationState;
}): RuntimeExecutiveWorkspacePresentationTransition {
  if (
    !isRuntimeExecutiveWorkspacePresentationState(input.from) ||
    !isRuntimeExecutiveWorkspacePresentationState(input.to)
  ) {
    throw new TypeError("presentation states must be canonical");
  }
  return Object.freeze({
    kind: input.from === input.to ? "preserve" : "replace",
    from: input.from,
    to: input.to,
  });
}

// ─── Dial semantic APIs ─────────────────────────────────────────────────────

export function resolveRuntimeExecutiveWorkspaceDialSelection(input: {
  readonly currentWorkspace: RuntimeExecutiveWorkspaceKind;
}): RuntimeExecutiveWorkspaceKind {
  if (!isRuntimeExecutiveWorkspaceKind(input.currentWorkspace)) {
    throw new TypeError("currentWorkspace must be a known workspace kind");
  }
  return input.currentWorkspace;
}

export function resolveRuntimeExecutiveWorkspaceDialOptions(input: {
  readonly currentWorkspace: RuntimeExecutiveWorkspaceKind;
}): readonly RuntimeExecutiveWorkspaceDialOption[] {
  const current = resolveRuntimeExecutiveWorkspaceDialSelection(input);
  return Object.freeze(
    RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS.map((workspace) =>
      Object.freeze({
        workspace,
        availability:
          workspace === current
            ? ("current" as const)
            : ("available" as const),
        selected: workspace === current,
      }),
    ),
  );
}

export function normalizeRuntimeExecutiveWorkspaceDialRequest(
  request: RuntimeExecutiveWorkspaceDialRequest,
): RuntimeExecutiveWorkspaceNormalizedTransitionRequest {
  if (!isRuntimeExecutiveWorkspaceDialRequest(request)) {
    throw new TypeError("request must be a valid Dial request");
  }
  if (
    request.reason !== undefined &&
    !isRuntimeExecutiveWorkspaceTransitionReason(request.reason)
  ) {
    throw new TypeError("reason must be a canonical transition reason");
  }

  return Object.freeze({
    requestedWorkspaceKind: request.requestedWorkspace,
    source: "dial",
    reason: request.reason ?? "user-request",
    ...(request.requestedSubject !== undefined
      ? { requestedSubject: request.requestedSubject }
      : {}),
    ...(request.requestedIntent !== undefined
      ? { requestedIntent: request.requestedIntent }
      : {}),
  });
}

export function canTransitionRuntimeExecutiveWorkspace(input: {
  readonly from: RuntimeExecutiveWorkspaceKind;
  readonly to: RuntimeExecutiveWorkspaceKind;
}): boolean {
  if (
    !isRuntimeExecutiveWorkspaceKind(input.from) ||
    !isRuntimeExecutiveWorkspaceKind(input.to)
  ) {
    return false;
  }
  return RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_MATRIX[input.from][input.to] ===
    true;
}

// ─── Planning / orchestration ───────────────────────────────────────────────

export function planRuntimeExecutiveWorkspaceTransition(
  input: RuntimeExecutiveWorkspaceTransitionOrchestrationInput,
): RuntimeExecutiveWorkspaceTransitionOrchestrationResult {
  if (!isRuntimeExecutiveWorkspaceContextContract(input.currentContext)) {
    throw new TypeError("currentContext must be a valid context contract");
  }
  if (!isRuntimeExecutiveWorkspaceContextContract(input.targetContext)) {
    throw new TypeError("targetContext must be a valid context contract");
  }
  if (!isRuntimeExecutiveWorkspaceSurfaceCompositionResult(input.currentComposition)) {
    throw new TypeError("currentComposition must be a valid composition result");
  }
  if (!isRuntimeExecutiveWorkspaceSurfaceCompositionResult(input.targetComposition)) {
    throw new TypeError("targetComposition must be a valid composition result");
  }
  if (!isRuntimeExecutiveWorkspaceTransitionReason(input.reason)) {
    throw new TypeError("reason must be a canonical transition reason");
  }
  if (!isRuntimeExecutiveWorkspaceTransitionSource(input.source)) {
    throw new TypeError("source must be a canonical transition source");
  }

  const sourceWorkspace = input.currentContext.workspace.workspaceKind;
  const targetWorkspace = input.targetContext.workspace.workspaceKind;

  if (!canTransitionRuntimeExecutiveWorkspace({
    from: sourceWorkspace,
    to: targetWorkspace,
  })) {
    return Object.freeze({
      status: "rejected",
      sourceWorkspace,
      targetWorkspace,
      workspaceChanged: false,
      contextChanged: false,
      sourceComposition: input.currentComposition,
      targetComposition: input.targetComposition,
      phases: Object.freeze([]),
      surfaces: Object.freeze([]),
      subject: Object.freeze({
        kind: "preserve",
        from: input.currentContext.subject,
        to: input.currentContext.subject,
      }),
      focus: Object.freeze({
        kind: "preserve",
        from: input.currentContext.focus,
        to: input.currentContext.focus,
      }),
      presentation: Object.freeze({
        kind: "preserve",
        from: input.currentContext.presentation.state,
        to: input.currentContext.presentation.state,
      }),
      reason: input.reason,
      source: input.source,
      plan: null,
    });
  }

  const workspaceChanged = hasRuntimeExecutiveWorkspaceChanged({
    previous: sourceWorkspace,
    next: targetWorkspace,
  });
  const contextChanged = hasRuntimeExecutiveWorkspaceContextChanged({
    previous: input.currentContext,
    next: input.targetContext,
  });

  const surfaces = Object.freeze(
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SURFACES.map((surface) => {
      const from = participationForSurface(input.currentComposition, surface);
      const to = participationForSurface(input.targetComposition, surface);
      return Object.freeze({
        surface,
        from,
        to,
        kind: resolveRuntimeExecutiveWorkspaceSurfaceTransition({ from, to }),
      });
    }),
  );

  const subject = resolveRuntimeExecutiveWorkspaceSubjectTransition({
    from: input.currentContext.subject,
    to: input.targetContext.subject,
  });
  const focus = resolveRuntimeExecutiveWorkspaceFocusTransition({
    from: input.currentContext.focus,
    to: input.targetContext.focus,
  });
  const presentation = resolveRuntimeExecutiveWorkspacePresentationTransition({
    from: input.currentContext.presentation.state,
    to: input.targetContext.presentation.state,
  });

  if (!workspaceChanged && !contextChanged) {
    return Object.freeze({
      status: "unchanged",
      sourceWorkspace,
      targetWorkspace,
      workspaceChanged: false,
      contextChanged: false,
      sourceComposition: input.currentComposition,
      targetComposition: input.targetComposition,
      phases: Object.freeze([]),
      surfaces,
      subject,
      focus,
      presentation,
      reason: input.reason,
      source: input.source,
      plan: null,
    });
  }

  const phases = RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES;
  const plan = Object.freeze({
    fromWorkspace: sourceWorkspace,
    toWorkspace: targetWorkspace,
    reason: input.reason,
    source: input.source,
    phases,
    surfaces,
    subject,
    focus,
    presentation,
    workspaceChanged,
    contextChanged,
  });

  return Object.freeze({
    status: "planned",
    sourceWorkspace,
    targetWorkspace,
    workspaceChanged,
    contextChanged,
    sourceComposition: input.currentComposition,
    targetComposition: input.targetComposition,
    phases,
    surfaces,
    subject,
    focus,
    presentation,
    reason: input.reason,
    source: input.source,
    plan,
  });
}

export function orchestrateRuntimeExecutiveWorkspaceTransition(
  input: RuntimeExecutiveWorkspaceTransitionOrchestrationInput,
): RuntimeExecutiveWorkspaceTransitionOrchestrationResult {
  return planRuntimeExecutiveWorkspaceTransition(input);
}

/**
 * Convenience: resolve target from a normalized request, compose surfaces,
 * and plan the transition from the provided current context/composition.
 */
export function orchestrateRuntimeExecutiveWorkspaceTransitionFromRequest(input: {
  readonly currentContext: RuntimeExecutiveWorkspaceContextContract;
  readonly currentComposition: RuntimeExecutiveWorkspaceSurfaceCompositionResult;
  readonly request: RuntimeExecutiveWorkspaceNormalizedTransitionRequest;
}): RuntimeExecutiveWorkspaceTransitionOrchestrationResult {
  const resolution = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: input.currentContext,
    requestedWorkspaceKind: input.request.requestedWorkspaceKind,
    requestedSubject: input.request.requestedSubject,
    requestedIntent: input.request.requestedIntent,
    transitionReason: input.request.reason,
    requestSource:
      input.request.source === "dial" ? "user" : undefined,
  });

  const targetComposition =
    composeRuntimeExecutiveWorkspaceSurfacesFromResolution(resolution);

  return planRuntimeExecutiveWorkspaceTransition({
    currentContext: input.currentContext,
    targetContext: resolution.resolvedContext,
    currentComposition: input.currentComposition,
    targetComposition,
    reason: input.request.reason,
    source: input.request.source,
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveWorkspaceTransitionDialOrchestrationIdentity():
  typeof runtimeExecutiveWorkspaceTransitionDialOrchestrationCanonicalIdentity {
  return runtimeExecutiveWorkspaceTransitionDialOrchestrationCanonicalIdentity;
}

export function getRuntimeExecutiveWorkspaceTransitionDialOrchestrationGuarantees():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_GUARANTEES {
  return RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_GUARANTEES;
}

export function getRuntimeExecutiveWorkspaceTransitionDialOrchestrationRegistry():
  typeof runtimeExecutiveWorkspaceTransitionDialOrchestrationRegistry {
  return runtimeExecutiveWorkspaceTransitionDialOrchestrationRegistry;
}

export function getRuntimeExecutiveWorkspaceTransitionDialOrchestrationInvariants():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS {
  return RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationApiNames =
  Object.freeze([
    "getRuntimeExecutiveWorkspaceTransitionDialOrchestrationIdentity",
    "getRuntimeExecutiveWorkspaceTransitionDialOrchestrationRegistry",
    "getRuntimeExecutiveWorkspaceTransitionDialOrchestrationGuarantees",
    "getRuntimeExecutiveWorkspaceTransitionDialOrchestrationInvariants",
    "isRuntimeExecutiveWorkspaceTransitionStatus",
    "isRuntimeExecutiveWorkspaceTransitionPhase",
    "isRuntimeExecutiveWorkspaceTransitionSource",
    "isRuntimeExecutiveWorkspaceSurfaceTransitionKind",
    "isRuntimeExecutiveWorkspaceDialRequest",
    "isRuntimeExecutiveWorkspaceTransitionPlan",
    "isRuntimeExecutiveWorkspaceTransitionReason",
    "resolveRuntimeExecutiveWorkspaceSurfaceTransition",
    "resolveRuntimeExecutiveWorkspaceSubjectTransition",
    "resolveRuntimeExecutiveWorkspaceFocusTransition",
    "resolveRuntimeExecutiveWorkspacePresentationTransition",
    "resolveRuntimeExecutiveWorkspaceDialSelection",
    "resolveRuntimeExecutiveWorkspaceDialOptions",
    "normalizeRuntimeExecutiveWorkspaceDialRequest",
    "canTransitionRuntimeExecutiveWorkspace",
    "planRuntimeExecutiveWorkspaceTransition",
    "orchestrateRuntimeExecutiveWorkspaceTransition",
    "orchestrateRuntimeExecutiveWorkspaceTransitionFromRequest",
    "verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveWorkspaceTransitionStatus",
    "RuntimeExecutiveWorkspaceTransitionPhase",
    "RuntimeExecutiveWorkspaceTransitionSource",
    "RuntimeExecutiveWorkspaceSurfaceTransitionKind",
    "RuntimeExecutiveWorkspaceSubjectTransitionKind",
    "RuntimeExecutiveWorkspaceFocusTransitionKind",
    "RuntimeExecutiveWorkspacePresentationTransitionKind",
    "RuntimeExecutiveWorkspaceDialAvailability",
    "RuntimeExecutiveWorkspaceDialRequest",
    "RuntimeExecutiveWorkspaceDialOption",
    "RuntimeExecutiveWorkspaceNormalizedTransitionRequest",
    "RuntimeExecutiveWorkspaceSurfaceTransitionInstruction",
    "RuntimeExecutiveWorkspaceSubjectTransition",
    "RuntimeExecutiveWorkspaceFocusTransition",
    "RuntimeExecutiveWorkspacePresentationTransition",
    "RuntimeExecutiveWorkspaceTransitionPlan",
    "RuntimeExecutiveWorkspaceTransitionOrchestrationInput",
    "RuntimeExecutiveWorkspaceTransitionOrchestrationResult",
    "RuntimeExecutiveWorkspaceTransitionOrchestrationInvariant",
    "RuntimeExecutiveWorkspaceTransitionDialOrchestrationVerification",
  ] as const);

export const runtimeExecutiveWorkspaceTransitionDialOrchestrationRegistry =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity,
    version: runtimeExecutiveWorkspaceTransitionDialOrchestrationVersion,
    namespace: runtimeExecutiveWorkspaceTransitionDialOrchestrationNamespace,
    layer: runtimeExecutiveWorkspaceTransitionDialOrchestrationLayer,
    capability:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationCapability,
    phase: runtimeExecutiveWorkspaceTransitionDialOrchestrationPhase,
    status: runtimeExecutiveWorkspaceTransitionDialOrchestrationStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationSupportedImportPath,
    sections:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_REGISTRY_SECTIONS
        .length,
    statuses: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES,
    statusCount: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES.length,
    phases: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
    phaseCount: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES.length,
    sources: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
    sourceCount: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES.length,
    surfaceTransitionKinds:
      RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS,
    surfaceTransitionKindCount:
      RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS.length,
    participationRank: RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK,
    subjectTransitionKinds:
      RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_TRANSITION_KINDS,
    subjectTransitionKindCount:
      RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_TRANSITION_KINDS.length,
    focusTransitionKinds: RUNTIME_EXECUTIVE_WORKSPACE_FOCUS_TRANSITION_KINDS,
    focusTransitionKindCount:
      RUNTIME_EXECUTIVE_WORKSPACE_FOCUS_TRANSITION_KINDS.length,
    presentationTransitionKinds:
      RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_TRANSITION_KINDS,
    presentationTransitionKindCount:
      RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_TRANSITION_KINDS.length,
    dialOptions: RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
    dialOptionCount: RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS.length,
    dialAvailabilities: RUNTIME_EXECUTIVE_WORKSPACE_DIAL_AVAILABILITIES,
    transitionMatrix: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_MATRIX,
    transitionReasons: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS,
    guarantees:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_GUARANTEES,
    guaranteeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_GUARANTEES.length,
    invariants:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS,
    invariantCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS.length,
    publicTypes:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_PUBLIC_TYPE_NAMES
        .length,
    publicApis:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationApiNames,
    publicApiCount:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationApiNames.length,
  });

export const runtimeExecutiveWorkspaceTransitionDialOrchestration =
  Object.freeze({
    phase: "TransitionDialOrchestration" as const,
    name: "RuntimeExecutiveWorkspaceTransitionDialOrchestration" as const,
    identity: runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity,
    version: runtimeExecutiveWorkspaceTransitionDialOrchestrationVersion,
    namespace: runtimeExecutiveWorkspaceTransitionDialOrchestrationNamespace,
    layer: runtimeExecutiveWorkspaceTransitionDialOrchestrationLayer,
    capability:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationCapability,
    architecturalRole:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationArchitecturalRole,
    role: "TransitionDialOrchestration" as const,
    status: runtimeExecutiveWorkspaceTransitionDialOrchestrationStatus,
    upstreamDependency:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationSupportedImportPath,
    deterministic:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
    timerFree: true as const,
    compositionAligned: true as const,
    plainData: true as const,
    serializableFriendly: true as const,
    rendererIndependent: true as const,
    dialGeometryIndependent: true as const,
    inputDeviceIndependent: true as const,
    animationTimingIndependent: true as const,
    automotiveStylingIndependent: true as const,
    nonLinearTransitionCapable: true as const,
    sameWorkspaceContextCapable: true as const,
    presentationStateIndependent: true as const,
    dialIsControlSource: true as const,
    dialIsNotWorkspace: true as const,
    dialIsNotSurface: true as const,
    principle: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_PRINCIPLE,
    boundary: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_BOUNDARY,
    separation:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_SEPARATION,
    statuses: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES,
    phases: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
    sources: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
    surfaceTransitionKinds:
      RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS,
    participationRank: RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK,
    dialOptions: RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
    transitionMatrix: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_MATRIX,
    guarantees:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_GUARANTEES,
    invariants:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS,
    forbiddenResponsibilities:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_FORBIDDEN_RESPONSIBILITIES,
    publicTypeNames:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_PUBLIC_TYPE_NAMES,
    publicApiSurface:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationApiNames,
    registry: runtimeExecutiveWorkspaceTransitionDialOrchestrationRegistry,
    compositionBoundary: "REX-6:4-composition-only" as const,
    architecturalStatus:
      "REX-6:5 Runtime Executive Workspace Transition & Dial Orchestration — TransitionDialOrchestrationReady" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceTransitionDialOrchestrationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity;
  readonly version: typeof runtimeExecutiveWorkspaceTransitionDialOrchestrationVersion;
  readonly namespace: typeof runtimeExecutiveWorkspaceTransitionDialOrchestrationNamespace;
  readonly phase: typeof runtimeExecutiveWorkspaceTransitionDialOrchestrationPhase;
  readonly architecturalRole: typeof runtimeExecutiveWorkspaceTransitionDialOrchestrationArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyIdentity;
  readonly statusCount: number;
  readonly phaseCount: number;
  readonly sourceCount: number;
  readonly surfaceTransitionKindCount: number;
  readonly dialOptionCount: number;
  readonly invariantCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly compositionBoundaryIntact: boolean;
  readonly phaseOrderExact: boolean;
  readonly allWorkspacePairsRepresentable: boolean;
  readonly dialIsNotSurface: boolean;
  readonly dialIsNotWorkspace: boolean;
  readonly nonLinearTransitionCapable: boolean;
  readonly sameWorkspaceContextCapable: boolean;
  readonly presentationStateIndependent: boolean;
  readonly upstreamCompositionOk: boolean;
}

export function verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration():
  RuntimeExecutiveWorkspaceTransitionDialOrchestrationVerification {
  const runtimeModule = runtimeExecutiveWorkspaceTransitionDialOrchestration;
  const registry = runtimeExecutiveWorkspaceTransitionDialOrchestrationRegistry;
  const upstream = verifyRuntimeExecutiveWorkspaceSurfaceComposition();

  const identityOk =
    runtimeModule.identity ===
      "REX-6:5/RuntimeExecutiveWorkspaceTransitionDialOrchestration" &&
    runtimeModule.version === "6.5.0" &&
    runtimeModule.namespace ===
      "nexora.rex.workspace-experience.transition-dial-orchestration" &&
    runtimeModule.phase === "TransitionDialOrchestration" &&
    runtimeModule.architecturalRole ===
      "RuntimeExecutiveWorkspaceTransitionDialOrchestration" &&
    runtimeModule.upstreamDependency ===
      "REX-6:4/RuntimeExecutiveWorkspaceSurfaceComposition" &&
    runtimeModule.upstreamDependency ===
      runtimeExecutiveWorkspaceSurfaceCompositionIdentity &&
    runtimeModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveWorkspaceSurfaceComposition" &&
    runtimeModule.compositionBoundary === "REX-6:4-composition-only";

  const phaseOrderExact = exactOrder(
    [...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES],
    ["prepare", "leave", "enter", "settle"],
  );

  const vocabOk =
    phaseOrderExact &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES], [
      "planned",
      "unchanged",
      "rejected",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES], [
      "user",
      "dial",
      "advisor",
      "action",
      "runtime",
      "system",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS], [
      "preserve",
      "activate",
      "deactivate",
      "promote",
      "demote",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS], [
      "overview",
      "problem",
      "scenario",
      "decision",
      "execution",
    ]) &&
    !RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SURFACES.includes("dial" as never) &&
    !RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_WORKSPACE_KINDS.includes(
      "dial" as never,
    ) &&
    RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK.inactive === 0 &&
    RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK.contextual === 1 &&
    RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK.supporting === 2 &&
    RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK.primary === 3;

  const surfaceRulesOk =
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "supporting",
      to: "supporting",
    }) === "preserve" &&
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "inactive",
      to: "contextual",
    }) === "activate" &&
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "supporting",
      to: "inactive",
    }) === "deactivate" &&
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "contextual",
      to: "supporting",
    }) === "promote" &&
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "supporting",
      to: "contextual",
    }) === "demote";

  const allWorkspacePairsRepresentable =
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_WORKSPACE_KINDS.every((from) =>
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_WORKSPACE_KINDS.every((to) =>
        canTransitionRuntimeExecutiveWorkspace({ from, to }),
      ),
    );

  const nonLinearOk = (
    [
      ["decision", "scenario"],
      ["execution", "decision"],
      ["scenario", "problem"],
      ["problem", "overview"],
      ["overview", "decision"],
    ] as const
  ).every(([from, to]) =>
    canTransitionRuntimeExecutiveWorkspace({ from, to }),
  );

  const countsOk =
    registry.statusCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES.length &&
    registry.phaseCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES.length &&
    registry.sourceCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES.length &&
    registry.dialOptionCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS.length &&
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS.length ===
      32 &&
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS.map(
        (entry) => entry.id,
      ),
    );

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_MATRIX) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS,
    ) &&
    Object.isFrozen(
      runtimeExecutiveWorkspaceTransitionDialOrchestrationCanonicalIdentity,
    ) &&
    Object.isFrozen(
      runtimeExecutiveWorkspaceTransitionDialOrchestrationRegistry,
    ) &&
    Object.isFrozen(runtimeExecutiveWorkspaceTransitionDialOrchestration);

  const ok =
    identityOk &&
    vocabOk &&
    surfaceRulesOk &&
    allWorkspacePairsRepresentable &&
    nonLinearOk &&
    countsOk &&
    frozen &&
    runtimeModule.dialIsControlSource === true &&
    runtimeModule.dialIsNotWorkspace === true &&
    runtimeModule.dialIsNotSurface === true &&
    runtimeModule.animationTimingIndependent === true &&
    runtimeModule.presentationStateIndependent === true &&
    upstream.ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity,
    version: runtimeExecutiveWorkspaceTransitionDialOrchestrationVersion,
    namespace: runtimeExecutiveWorkspaceTransitionDialOrchestrationNamespace,
    phase: runtimeExecutiveWorkspaceTransitionDialOrchestrationPhase,
    architecturalRole:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationDependencyIdentity,
    statusCount: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES.length,
    phaseCount: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES.length,
    sourceCount: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES.length,
    surfaceTransitionKindCount:
      RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS.length,
    dialOptionCount: RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS.length,
    invariantCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS.length,
    guaranteeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_GUARANTEES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_REGISTRY_SECTIONS
        .length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_PUBLIC_TYPE_NAMES
        .length,
    publicApiCount:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationApiNames.length,
    frozen,
    compositionBoundaryIntact:
      runtimeModule.compositionBoundary === "REX-6:4-composition-only",
    phaseOrderExact,
    allWorkspacePairsRepresentable,
    dialIsNotSurface: runtimeModule.dialIsNotSurface === true,
    dialIsNotWorkspace: runtimeModule.dialIsNotWorkspace === true,
    nonLinearTransitionCapable: nonLinearOk,
    sameWorkspaceContextCapable: runtimeModule.sameWorkspaceContextCapable === true,
    presentationStateIndependent:
      runtimeModule.presentationStateIndependent === true,
    upstreamCompositionOk: upstream.ok === true,
  });
}
