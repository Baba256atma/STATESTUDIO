/**
 * REX-6:4 — Runtime Executive Workspace Surface Composition.
 *
 * Deterministic semantic composition of Nexora’s runtime executive surfaces
 * from the resolved workspace context produced by REX-6:3.
 *
 * Canonical flow:
 *   REX-6:3 Context & Mode Resolution → REX-6:4 Surface Composition → later REX-6:5 Transition & Dial Orchestration
 *
 * REX-6:3 answers: What workspace are we in?
 * REX-6:4 answers: How should Stage / Advisor / Insight / Action participate?
 *
 * Semantic composition only. No React layout, physical placement, Workspace Dial,
 * cockpit controls, Stage rendering, or surface content generation.
 *
 * REX-6:4 decides importance.
 * Cockpit decides placement.
 * REX-2/3/4/5 decide surface behavior.
 * Renderer decides pixels.
 */

import {
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_TRANSITION_REASONS,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceSurfaceParticipationContract,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSubject,
  runtimeExecutiveWorkspaceContextModeResolutionIdentity,
  runtimeExecutiveWorkspaceContextModeResolutionSupportedImportPath,
  runtimeExecutiveWorkspaceContextModeResolutionVersion,
  verifyRuntimeExecutiveWorkspaceContextModeResolution,
  type RuntimeExecutiveWorkspaceContextContract,
  type RuntimeExecutiveWorkspaceContextResolutionResult,
  type RuntimeExecutiveWorkspaceFocusContract,
  type RuntimeExecutiveWorkspaceIntent,
  type RuntimeExecutiveWorkspaceKind,
  type RuntimeExecutiveWorkspacePresentationState,
  type RuntimeExecutiveWorkspaceResolutionReason,
  type RuntimeExecutiveWorkspaceResolutionStatus,
  type RuntimeExecutiveWorkspaceSubjectContract,
  type RuntimeExecutiveWorkspaceSurfaceParticipation,
  type RuntimeExecutiveWorkspaceSurfaceRole,
  type RuntimeExecutiveWorkspaceTransitionReason,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceContextModeResolution";

// ─── Transitively published Resolution surface (for REX-6:5+) ───────────────
// Additive publication: transition orchestration consumes resolved contexts,
// compositions, change detectors, and transition-reason vocabulary through REX-6:4.

export {
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_TRANSITION_REASONS,
  createRuntimeExecutiveWorkspaceContextContract,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSubject,
  runtimeExecutiveWorkspaceContextModeResolutionIdentity,
  verifyRuntimeExecutiveWorkspaceContextModeResolution,
};

export type {
  RuntimeExecutiveWorkspaceContextContract,
  RuntimeExecutiveWorkspaceContextResolutionResult,
  RuntimeExecutiveWorkspaceFocusContract,
  RuntimeExecutiveWorkspaceIntent,
  RuntimeExecutiveWorkspaceKind,
  RuntimeExecutiveWorkspacePresentationState,
  RuntimeExecutiveWorkspaceResolutionReason,
  RuntimeExecutiveWorkspaceResolutionStatus,
  RuntimeExecutiveWorkspaceSubjectContract,
  RuntimeExecutiveWorkspaceSurfaceParticipation,
  RuntimeExecutiveWorkspaceSurfaceRole,
  RuntimeExecutiveWorkspaceTransitionReason,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceSurfaceCompositionIdentity =
  "REX-6:4/RuntimeExecutiveWorkspaceSurfaceComposition" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionVersion =
  "6.4.0" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionNamespace =
  "nexora.rex.workspace-experience.surface-composition" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionLayer =
  "REX" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionCapability =
  "RuntimeExecutiveWorkspaceExperience" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionPhase =
  "SurfaceComposition" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionStatus =
  "SurfaceCompositionReady" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionArchitecturalRole =
  "RuntimeExecutiveWorkspaceSurfaceComposition" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionDependencyIdentity =
  runtimeExecutiveWorkspaceContextModeResolutionIdentity;

export const runtimeExecutiveWorkspaceSurfaceCompositionDependencyPath =
  runtimeExecutiveWorkspaceContextModeResolutionSupportedImportPath;

export const runtimeExecutiveWorkspaceSurfaceCompositionSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveWorkspaceSurfaceComposition" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionStability =
  "SurfaceCompositionReady" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionDeterministic =
  true as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveWorkspaceSurfaceCompositionCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceSurfaceCompositionIdentity,
    version: runtimeExecutiveWorkspaceSurfaceCompositionVersion,
    namespace: runtimeExecutiveWorkspaceSurfaceCompositionNamespace,
    layer: runtimeExecutiveWorkspaceSurfaceCompositionLayer,
    capability: runtimeExecutiveWorkspaceSurfaceCompositionCapability,
    phase: runtimeExecutiveWorkspaceSurfaceCompositionPhase,
    status: runtimeExecutiveWorkspaceSurfaceCompositionStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceSurfaceCompositionArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceSurfaceCompositionDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceSurfaceCompositionDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceSurfaceCompositionSupportedImportPath,
    upstreamVersion: runtimeExecutiveWorkspaceContextModeResolutionVersion,
    stabilityStatus: runtimeExecutiveWorkspaceSurfaceCompositionStability,
    deterministicStatus:
      runtimeExecutiveWorkspaceSurfaceCompositionDeterministic,
    sideEffectPolicy:
      runtimeExecutiveWorkspaceSurfaceCompositionSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveWorkspaceSurfaceCompositionMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRINCIPLE =
  "Given a resolved executive workspace context, compose Stage/Advisor/Insight/Action participation semantically — not screen layout, Dial geometry, cockpit controls, or surface rendering." as const;

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  compositionAuthority: "REX-6:4" as const,
  architecturalRole:
    "RuntimeExecutiveWorkspaceSurfaceComposition" as const,
  soleImmediateDependency:
    "REX-6:3/RuntimeExecutiveWorkspaceContextModeResolution" as const,
  consumesResolutionOnly: true as const,
  importsRex62Directly: false as const,
  importsRex61Directly: false as const,
  importsRex5Directly: false as const,
  importsRex4Directly: false as const,
  importsRex3Directly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  selectorUiIndependent: true as const,
  automotiveStylingIndependent: true as const,
  dialIndependent: true as const,
  cockpitControlIndependent: true as const,
  timelineIndependent: true as const,
  physicalPlacementIndependent: true as const,
  participationNotVisibility: true as const,
  stageCenteredPrimaryPolicy: true as const,
  introducesUiLayout: false as const,
  introducesWorkspaceDial: false as const,
  introducesRendering: false as const,
  introducesOrchestration: false as const,
  introducesBusinessExecution: false as const,
  introducesAdvisorGeneration: false as const,
  introducesInsightGeneration: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
});

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SEPARATION = Object.freeze({
  compositionDecides: "semantic surface importance / participation" as const,
  cockpitDecides: "physical placement and controls" as const,
  surfacePlatformsDecide: "Stage/Advisor/Insight/Action behavior" as const,
  rendererDecides: "pixels" as const,
  workspaceIndependentOfPresentation: true as const,
  participationIndependentOfDomVisibility: true as const,
  participationIndependentOfPanelDimensions: true as const,
});

// ─── Inherited vocabularies ─────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES;

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_PARTICIPATIONS;

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS;

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES;

/** Explicit Stage-centered primary-surface policy for initial REX-6 architecture. */
export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE =
  "stage" as const satisfies RuntimeExecutiveWorkspaceSurfaceRole;

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS = Object.freeze([
  "workspace-policy",
  "context-preserved",
  "subject-context",
  "intent-context",
  "fallback-overview",
] as const);

export type RuntimeExecutiveWorkspaceCompositionReason =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS)[number];

export type RuntimeExecutiveWorkspaceCompositionSurfaceParticipationMap =
  Readonly<
    Record<
      RuntimeExecutiveWorkspaceSurfaceRole,
      RuntimeExecutiveWorkspaceSurfaceParticipation
    >
  >;

/**
 * Canonical initial semantic composition matrix.
 * Does not encode screen layout.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX = Object.freeze({
  overview: Object.freeze({
    stage: "primary",
    advisor: "supporting",
    insight: "contextual",
    action: "inactive",
  }),
  problem: Object.freeze({
    stage: "primary",
    advisor: "supporting",
    insight: "supporting",
    action: "contextual",
  }),
  scenario: Object.freeze({
    stage: "primary",
    advisor: "supporting",
    insight: "supporting",
    action: "contextual",
  }),
  decision: Object.freeze({
    stage: "primary",
    advisor: "supporting",
    insight: "supporting",
    action: "supporting",
  }),
  execution: Object.freeze({
    stage: "primary",
    advisor: "contextual",
    insight: "supporting",
    action: "supporting",
  }),
} as const satisfies Record<
  RuntimeExecutiveWorkspaceKind,
  RuntimeExecutiveWorkspaceCompositionSurfaceParticipationMap
>);

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES = Object.freeze([
  "deterministic",
  "immutable",
  "resolution-aligned",
  "plain-data",
  "serializable-friendly",
  "renderer-independent",
  "ui-layout-independent",
  "dial-independent",
  "cockpit-control-independent",
  "stage-centered-primary",
  "presentation-state-independent",
  "participation-not-visibility",
  "side-effect-free",
  "orchestration-free",
] as const);

export type RuntimeExecutiveWorkspaceCompositionGuarantee =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Surfaces",
    "Participations",
    "Workspaces",
    "CompositionMatrix",
    "CompositionReasons",
    "PrimarySurfacePolicy",
    "Invariants",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveWorkspaceCompositionRegistrySection =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REGISTRY_SECTIONS)[number];

// ─── Domain contracts ───────────────────────────────────────────────────────

/**
 * Composition input consuming REX-6:3 semantic output.
 * No screen/device/renderer fields.
 */
export interface RuntimeExecutiveWorkspaceSurfaceCompositionInput {
  readonly resolvedContext: RuntimeExecutiveWorkspaceContextContract;
  readonly resolvedWorkspaceKind?: RuntimeExecutiveWorkspaceKind;
  readonly resolvedSubject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly resolvedIntent?: RuntimeExecutiveWorkspaceIntent;
  readonly resolvedPresentation?: RuntimeExecutiveWorkspacePresentationState;
  readonly resolutionStatus?: RuntimeExecutiveWorkspaceResolutionStatus;
  readonly resolutionReason?: RuntimeExecutiveWorkspaceResolutionReason;
}

export interface RuntimeExecutiveWorkspaceSurfaceCompositionEntry {
  readonly surface: RuntimeExecutiveWorkspaceSurfaceRole;
  readonly participation: RuntimeExecutiveWorkspaceSurfaceParticipation;
}

export interface RuntimeExecutiveWorkspaceSurfaceCompositionResult {
  readonly workspace: RuntimeExecutiveWorkspaceKind;
  readonly subject: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly intent: RuntimeExecutiveWorkspaceIntent;
  readonly presentation: RuntimeExecutiveWorkspacePresentationState;
  readonly surfaces: readonly RuntimeExecutiveWorkspaceSurfaceCompositionEntry[];
  readonly primarySurface: RuntimeExecutiveWorkspaceSurfaceRole;
  readonly compositionReason: RuntimeExecutiveWorkspaceCompositionReason;
  readonly resolutionStatus?: RuntimeExecutiveWorkspaceResolutionStatus;
  readonly resolutionReason?: RuntimeExecutiveWorkspaceResolutionReason;
}

/**
 * Immutable semantic snapshot of workspace surface composition.
 * No timestamps, random IDs, or renderer objects.
 */
export interface RuntimeExecutiveWorkspaceSurfaceCompositionSnapshot {
  readonly workspace: RuntimeExecutiveWorkspaceKind;
  readonly subject: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly intent: RuntimeExecutiveWorkspaceIntent;
  readonly presentation: RuntimeExecutiveWorkspacePresentationState;
  readonly surfaces: readonly RuntimeExecutiveWorkspaceSurfaceCompositionEntry[];
  readonly primarySurface: RuntimeExecutiveWorkspaceSurfaceRole;
  readonly compositionReason: RuntimeExecutiveWorkspaceCompositionReason;
}

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "every-workspace-has-composition",
    order: 1,
    statement: "Every canonical workspace has a composition.",
  }),
  Object.freeze({
    id: "composition-covers-every-surface-once",
    order: 2,
    statement:
      "Every composition covers every canonical surface exactly once.",
  }),
  Object.freeze({
    id: "no-duplicate-surfaces",
    order: 3,
    statement: "No composition contains duplicate surfaces.",
  }),
  Object.freeze({
    id: "participation-values-canonical",
    order: 4,
    statement: "Every participation value is canonical.",
  }),
  Object.freeze({
    id: "exactly-one-primary-surface",
    order: 5,
    statement: "Every workspace has exactly one primary surface.",
  }),
  Object.freeze({
    id: "stage-canonical-initial-primary",
    order: 6,
    statement: "Stage is the canonical initial primary surface.",
  }),
  Object.freeze({
    id: "overview-composition-deterministic",
    order: 7,
    statement: "Overview composition is deterministic.",
  }),
  Object.freeze({
    id: "problem-composition-deterministic",
    order: 8,
    statement: "Problem composition is deterministic.",
  }),
  Object.freeze({
    id: "scenario-composition-deterministic",
    order: 9,
    statement: "Scenario composition is deterministic.",
  }),
  Object.freeze({
    id: "decision-composition-deterministic",
    order: 10,
    statement: "Decision composition is deterministic.",
  }),
  Object.freeze({
    id: "execution-composition-deterministic",
    order: 11,
    statement: "Execution composition is deterministic.",
  }),
  Object.freeze({
    id: "does-not-alter-workspace-resolution",
    order: 12,
    statement: "Composition does not alter workspace resolution.",
  }),
  Object.freeze({
    id: "does-not-alter-subject-identity",
    order: 13,
    statement: "Composition does not alter subject identity.",
  }),
  Object.freeze({
    id: "does-not-execute-actions",
    order: 14,
    statement: "Composition does not execute actions.",
  }),
  Object.freeze({
    id: "does-not-generate-advisor-content",
    order: 15,
    statement: "Composition does not generate Advisor content.",
  }),
  Object.freeze({
    id: "does-not-generate-insight-content",
    order: 16,
    statement: "Composition does not generate Insight content.",
  }),
  Object.freeze({
    id: "does-not-render-stage-content",
    order: 17,
    statement: "Composition does not render Stage content.",
  }),
  Object.freeze({
    id: "no-physical-screen-placement",
    order: 18,
    statement: "Composition does not define physical screen placement.",
  }),
  Object.freeze({
    id: "participation-not-dom-visibility",
    order: 19,
    statement: "Participation does not equal DOM visibility.",
  }),
  Object.freeze({
    id: "participation-not-panel-dimensions",
    order: 20,
    statement: "Participation does not equal panel dimensions.",
  }),
  Object.freeze({
    id: "workspace-independent-of-presentation",
    order: 21,
    statement: "Workspace remains independent of presentation state.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    order: 22,
    statement: "Composition contains no React dependency.",
  }),
  Object.freeze({
    id: "no-three-js-dependency",
    order: 23,
    statement: "Composition contains no Three.js dependency.",
  }),
  Object.freeze({
    id: "no-r3f-dependency",
    order: 24,
    statement: "Composition contains no React Three Fiber dependency.",
  }),
  Object.freeze({
    id: "no-automotive-styling-dependency",
    order: 25,
    statement: "Composition contains no automotive styling dependency.",
  }),
  Object.freeze({
    id: "dial-not-canonical-surface",
    order: 26,
    statement: "Workspace Dial is not a canonical surface.",
  }),
  Object.freeze({
    id: "cockpit-controls-not-canonical-surfaces",
    order: 27,
    statement: "Cockpit controls are not canonical surfaces.",
  }),
  Object.freeze({
    id: "policies-mutation-safe",
    order: 28,
    statement: "Canonical policies are mutation-safe.",
  }),
  Object.freeze({
    id: "composition-deterministic",
    order: 29,
    statement: "Composition is deterministic.",
  }),
  Object.freeze({
    id: "output-serializable-friendly",
    order: 30,
    statement: "Composition output is serializable-friendly.",
  }),
]);

export type RuntimeExecutiveWorkspaceCompositionInvariant =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "react-components",
    "stage-renderer",
    "advisor-renderer",
    "insight-renderer",
    "action-renderer",
    "workspace-dial",
    "automotive-styling",
    "top-cockpit-buttons",
    "left-dropdown-ui",
    "right-dropdown-ui",
    "asset-insight-tabs",
    "timeline-rendering",
    "physical-panel-layout",
    "screen-geometry",
    "responsive-layout",
    "css",
    "three-js",
    "react-three-fiber",
    "camera-behavior",
    "lighting",
    "scene-colors",
    "animation",
    "routing",
    "persistence",
    "api-calls",
    "business-action-execution",
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

function buildEntries(
  map: RuntimeExecutiveWorkspaceCompositionSurfaceParticipationMap,
): readonly RuntimeExecutiveWorkspaceSurfaceCompositionEntry[] {
  return Object.freeze(
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.map((surface) =>
      Object.freeze({
        surface,
        participation: map[surface],
      }),
    ),
  );
}

function countPrimary(
  entries: readonly RuntimeExecutiveWorkspaceSurfaceCompositionEntry[],
): number {
  return entries.filter((entry) => entry.participation === "primary").length;
}

function resolveCompositionReason(input: {
  readonly workspace: RuntimeExecutiveWorkspaceKind;
  readonly resolutionReason?: RuntimeExecutiveWorkspaceResolutionReason;
  readonly resolutionStatus?: RuntimeExecutiveWorkspaceResolutionStatus;
}): RuntimeExecutiveWorkspaceCompositionReason {
  if (input.resolutionStatus === "rejected") {
    return "context-preserved";
  }
  if (input.resolutionReason === "fallback-overview") {
    return "fallback-overview";
  }
  if (
    input.resolutionReason === "subject-derived" ||
    input.resolutionReason === "same-context"
  ) {
    return input.resolutionReason === "subject-derived"
      ? "subject-context"
      : "workspace-policy";
  }
  if (input.resolutionReason === "intent-derived") {
    return "intent-context";
  }
  if (input.resolutionReason === "preserved-current") {
    return "context-preserved";
  }
  return "workspace-policy";
}

// ─── Predicates / validation ────────────────────────────────────────────────

export function isRuntimeExecutiveWorkspaceCompositionReason(
  value: unknown,
): value is RuntimeExecutiveWorkspaceCompositionReason {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceCompositionGuarantee(
  value: unknown,
): value is RuntimeExecutiveWorkspaceCompositionGuarantee {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceSurfaceCompositionEntry(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSurfaceCompositionEntry {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceSurfaceRole(value.surface) &&
    isRuntimeExecutiveWorkspaceSurfaceParticipation(value.participation)
  );
}

export function isRuntimeExecutiveWorkspaceSurfaceCompositionComplete(
  value: unknown,
): boolean {
  if (!Array.isArray(value)) return false;
  if (value.length !== RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.length) {
    return false;
  }
  if (
    !value.every((entry) =>
      isRuntimeExecutiveWorkspaceSurfaceCompositionEntry(entry),
    )
  ) {
    return false;
  }
  const surfaces = value.map(
    (entry) =>
      (entry as RuntimeExecutiveWorkspaceSurfaceCompositionEntry).surface,
  );
  if (!unique(surfaces)) return false;
  for (const surface of RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES) {
    if (!surfaces.includes(surface)) return false;
  }
  return (
    countPrimary(
      value as RuntimeExecutiveWorkspaceSurfaceCompositionEntry[],
    ) === 1
  );
}

export function isRuntimeExecutiveWorkspaceSurfaceCompositionResult(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSurfaceCompositionResult {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceKind(value.workspace) &&
    (value.subject === null ||
      (isPlainObject(value.subject) &&
        typeof value.subject.kind === "string" &&
        typeof value.subject.id === "string")) &&
    typeof value.intent === "string" &&
    isRuntimeExecutiveWorkspacePresentationState(value.presentation) &&
    Array.isArray(value.surfaces) &&
    isRuntimeExecutiveWorkspaceSurfaceCompositionComplete(value.surfaces) &&
    isRuntimeExecutiveWorkspaceSurfaceRole(value.primarySurface) &&
    isRuntimeExecutiveWorkspaceCompositionReason(value.compositionReason) &&
    value.surfaces.some(
      (entry) =>
        isRuntimeExecutiveWorkspaceSurfaceCompositionEntry(entry) &&
        entry.surface === value.primarySurface &&
        entry.participation === "primary",
    )
  );
}

export function isRuntimeExecutiveWorkspaceSurfaceCompositionSnapshot(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSurfaceCompositionSnapshot {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceKind(value.workspace) &&
    (value.subject === null || isPlainObject(value.subject)) &&
    typeof value.intent === "string" &&
    isRuntimeExecutiveWorkspacePresentationState(value.presentation) &&
    Array.isArray(value.surfaces) &&
    isRuntimeExecutiveWorkspaceSurfaceCompositionComplete(value.surfaces) &&
    isRuntimeExecutiveWorkspaceSurfaceRole(value.primarySurface) &&
    isRuntimeExecutiveWorkspaceCompositionReason(value.compositionReason)
  );
}

// ─── Composition resolvers ──────────────────────────────────────────────────

export function getRuntimeExecutiveWorkspaceCompositionPolicy(
  workspace: RuntimeExecutiveWorkspaceKind,
): RuntimeExecutiveWorkspaceCompositionSurfaceParticipationMap {
  if (!isRuntimeExecutiveWorkspaceKind(workspace)) {
    throw new TypeError("workspace must be a known workspace kind");
  }
  return RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX[workspace];
}

export function resolveRuntimeExecutiveWorkspaceSurfaceParticipation(input: {
  readonly workspace: RuntimeExecutiveWorkspaceKind;
  readonly surface: RuntimeExecutiveWorkspaceSurfaceRole;
}): RuntimeExecutiveWorkspaceSurfaceParticipation {
  if (!isRuntimeExecutiveWorkspaceKind(input.workspace)) {
    throw new TypeError("workspace must be a known workspace kind");
  }
  if (!isRuntimeExecutiveWorkspaceSurfaceRole(input.surface)) {
    throw new TypeError("surface must be a known workspace surface role");
  }
  return RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX[input.workspace][
    input.surface
  ];
}

export function createRuntimeExecutiveWorkspaceSurfaceCompositionEntry(input: {
  readonly surface: RuntimeExecutiveWorkspaceSurfaceRole;
  readonly participation: RuntimeExecutiveWorkspaceSurfaceParticipation;
}): RuntimeExecutiveWorkspaceSurfaceCompositionEntry {
  return createRuntimeExecutiveWorkspaceSurfaceParticipationContract(input);
}

export function createRuntimeExecutiveWorkspaceSurfaceCompositionInputFromResolution(
  resolution: RuntimeExecutiveWorkspaceContextResolutionResult,
): RuntimeExecutiveWorkspaceSurfaceCompositionInput {
  return Object.freeze({
    resolvedContext: resolution.resolvedContext,
    resolvedWorkspaceKind: resolution.resolvedWorkspaceKind,
    resolvedSubject: resolution.resolvedSubject,
    resolvedIntent: resolution.resolvedIntent,
    resolvedPresentation: resolution.resolvedPresentation,
    resolutionStatus: resolution.status,
    resolutionReason: resolution.resolutionReason,
  });
}

export function resolveRuntimeExecutiveWorkspaceSurfaceComposition(
  input: RuntimeExecutiveWorkspaceSurfaceCompositionInput,
): RuntimeExecutiveWorkspaceSurfaceCompositionResult {
  if (!isRuntimeExecutiveWorkspaceContextContract(input.resolvedContext)) {
    throw new TypeError(
      "resolvedContext must be a valid workspace context contract",
    );
  }

  const workspace =
    input.resolvedWorkspaceKind !== undefined &&
    isRuntimeExecutiveWorkspaceKind(input.resolvedWorkspaceKind)
      ? input.resolvedWorkspaceKind
      : input.resolvedContext.workspace.workspaceKind;

  const policy = getRuntimeExecutiveWorkspaceCompositionPolicy(workspace);
  const surfaces = buildEntries(policy);
  const primarySurface = RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE;

  if (policy[primarySurface] !== "primary") {
    throw new Error(
      "canonical composition policy must designate stage as primary",
    );
  }

  const subject =
    input.resolvedSubject !== undefined
      ? input.resolvedSubject
      : input.resolvedContext.subject;
  const intent =
    input.resolvedIntent !== undefined
      ? input.resolvedIntent
      : input.resolvedContext.intent.intent;
  const presentation =
    input.resolvedPresentation !== undefined &&
    isRuntimeExecutiveWorkspacePresentationState(input.resolvedPresentation)
      ? input.resolvedPresentation
      : input.resolvedContext.presentation.state;

  const compositionReason = resolveCompositionReason({
    workspace,
    resolutionReason: input.resolutionReason,
    resolutionStatus: input.resolutionStatus,
  });

  return Object.freeze({
    workspace,
    subject,
    intent,
    presentation,
    surfaces,
    primarySurface,
    compositionReason,
    ...(input.resolutionStatus !== undefined
      ? { resolutionStatus: input.resolutionStatus }
      : {}),
    ...(input.resolutionReason !== undefined
      ? { resolutionReason: input.resolutionReason }
      : {}),
  });
}

export function createRuntimeExecutiveWorkspaceSurfaceCompositionSnapshot(
  result: RuntimeExecutiveWorkspaceSurfaceCompositionResult,
): RuntimeExecutiveWorkspaceSurfaceCompositionSnapshot {
  if (!isRuntimeExecutiveWorkspaceSurfaceCompositionResult(result)) {
    throw new TypeError("result must be a valid surface composition result");
  }
  return Object.freeze({
    workspace: result.workspace,
    subject: result.subject,
    intent: result.intent,
    presentation: result.presentation,
    surfaces: result.surfaces,
    primarySurface: result.primarySurface,
    compositionReason: result.compositionReason,
  });
}

/**
 * Convenience: resolve REX-6:3 context then compose surfaces.
 * Pure and deterministic — no side effects.
 */
export function composeRuntimeExecutiveWorkspaceSurfacesFromResolution(
  resolution: RuntimeExecutiveWorkspaceContextResolutionResult,
): RuntimeExecutiveWorkspaceSurfaceCompositionResult {
  return resolveRuntimeExecutiveWorkspaceSurfaceComposition(
    createRuntimeExecutiveWorkspaceSurfaceCompositionInputFromResolution(
      resolution,
    ),
  );
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveWorkspaceSurfaceCompositionIdentity():
  typeof runtimeExecutiveWorkspaceSurfaceCompositionCanonicalIdentity {
  return runtimeExecutiveWorkspaceSurfaceCompositionCanonicalIdentity;
}

export function getRuntimeExecutiveWorkspaceSurfaceCompositionGuarantees():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES {
  return RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES;
}

export function getRuntimeExecutiveWorkspaceSurfaceCompositionRegistry():
  typeof runtimeExecutiveWorkspaceSurfaceCompositionRegistry {
  return runtimeExecutiveWorkspaceSurfaceCompositionRegistry;
}

export function getRuntimeExecutiveWorkspaceSurfaceCompositionInvariants():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS {
  return RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS;
}

export function getRuntimeExecutiveWorkspaceCompositionMatrix():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX {
  return RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceSurfaceCompositionApiNames =
  Object.freeze([
    "getRuntimeExecutiveWorkspaceSurfaceCompositionIdentity",
    "getRuntimeExecutiveWorkspaceSurfaceCompositionRegistry",
    "getRuntimeExecutiveWorkspaceSurfaceCompositionGuarantees",
    "getRuntimeExecutiveWorkspaceSurfaceCompositionInvariants",
    "getRuntimeExecutiveWorkspaceCompositionMatrix",
    "getRuntimeExecutiveWorkspaceCompositionPolicy",
    "isRuntimeExecutiveWorkspaceCompositionReason",
    "isRuntimeExecutiveWorkspaceCompositionGuarantee",
    "isRuntimeExecutiveWorkspaceSurfaceCompositionEntry",
    "isRuntimeExecutiveWorkspaceSurfaceCompositionComplete",
    "isRuntimeExecutiveWorkspaceSurfaceCompositionResult",
    "isRuntimeExecutiveWorkspaceSurfaceCompositionSnapshot",
    "resolveRuntimeExecutiveWorkspaceSurfaceParticipation",
    "resolveRuntimeExecutiveWorkspaceSurfaceComposition",
    "createRuntimeExecutiveWorkspaceSurfaceCompositionEntry",
    "createRuntimeExecutiveWorkspaceSurfaceCompositionInputFromResolution",
    "createRuntimeExecutiveWorkspaceSurfaceCompositionSnapshot",
    "composeRuntimeExecutiveWorkspaceSurfacesFromResolution",
    "verifyRuntimeExecutiveWorkspaceSurfaceComposition",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveWorkspaceCompositionReason",
    "RuntimeExecutiveWorkspaceCompositionSurfaceParticipationMap",
    "RuntimeExecutiveWorkspaceCompositionGuarantee",
    "RuntimeExecutiveWorkspaceCompositionRegistrySection",
    "RuntimeExecutiveWorkspaceSurfaceCompositionInput",
    "RuntimeExecutiveWorkspaceSurfaceCompositionEntry",
    "RuntimeExecutiveWorkspaceSurfaceCompositionResult",
    "RuntimeExecutiveWorkspaceSurfaceCompositionSnapshot",
    "RuntimeExecutiveWorkspaceCompositionInvariant",
    "RuntimeExecutiveWorkspaceSurfaceCompositionVerification",
  ] as const);

export const runtimeExecutiveWorkspaceSurfaceCompositionRegistry =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceSurfaceCompositionIdentity,
    version: runtimeExecutiveWorkspaceSurfaceCompositionVersion,
    namespace: runtimeExecutiveWorkspaceSurfaceCompositionNamespace,
    layer: runtimeExecutiveWorkspaceSurfaceCompositionLayer,
    capability: runtimeExecutiveWorkspaceSurfaceCompositionCapability,
    phase: runtimeExecutiveWorkspaceSurfaceCompositionPhase,
    status: runtimeExecutiveWorkspaceSurfaceCompositionStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceSurfaceCompositionArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceSurfaceCompositionDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceSurfaceCompositionDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceSurfaceCompositionSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REGISTRY_SECTIONS.length,
    surfaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
    surfaceCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.length,
    participations: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
    participationCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS.length,
    workspaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
    workspaceCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.length,
    compositionMatrix: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
    compositionCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.length,
    compositionReasons: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS,
    compositionReasonCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS.length,
    primarySurface: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
    guarantees: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES,
    guaranteeCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES.length,
    invariants: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS.length,
    publicTypes: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveWorkspaceSurfaceCompositionApiNames,
    publicApiCount:
      runtimeExecutiveWorkspaceSurfaceCompositionApiNames.length,
  });

export const runtimeExecutiveWorkspaceSurfaceComposition = Object.freeze({
  phase: "SurfaceComposition" as const,
  name: "RuntimeExecutiveWorkspaceSurfaceComposition" as const,
  identity: runtimeExecutiveWorkspaceSurfaceCompositionIdentity,
  version: runtimeExecutiveWorkspaceSurfaceCompositionVersion,
  namespace: runtimeExecutiveWorkspaceSurfaceCompositionNamespace,
  layer: runtimeExecutiveWorkspaceSurfaceCompositionLayer,
  capability: runtimeExecutiveWorkspaceSurfaceCompositionCapability,
  architecturalRole:
    runtimeExecutiveWorkspaceSurfaceCompositionArchitecturalRole,
  role: "SurfaceComposition" as const,
  status: runtimeExecutiveWorkspaceSurfaceCompositionStatus,
  upstreamDependency:
    runtimeExecutiveWorkspaceSurfaceCompositionDependencyIdentity,
  dependencyPath: runtimeExecutiveWorkspaceSurfaceCompositionDependencyPath,
  supportedImportPath:
    runtimeExecutiveWorkspaceSurfaceCompositionSupportedImportPath,
  deterministic: runtimeExecutiveWorkspaceSurfaceCompositionDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  resolutionAligned: true as const,
  plainData: true as const,
  serializableFriendly: true as const,
  rendererIndependent: true as const,
  uiLayoutIndependent: true as const,
  dialIndependent: true as const,
  cockpitControlIndependent: true as const,
  stageCenteredPrimary: true as const,
  presentationStateIndependent: true as const,
  participationNotVisibility: true as const,
  orchestrationFree: true as const,
  principle: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_BOUNDARY,
  separation: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SEPARATION,
  surfaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  participations: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  compositionMatrix: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  compositionReasons: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS,
  primarySurface: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  guarantees: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES,
  invariants: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_FORBIDDEN_RESPONSIBILITIES,
  publicTypeNames: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveWorkspaceSurfaceCompositionApiNames,
  registry: runtimeExecutiveWorkspaceSurfaceCompositionRegistry,
  resolutionBoundary: "REX-6:3-resolution-only" as const,
  architecturalStatus:
    "REX-6:4 Runtime Executive Workspace Surface Composition — SurfaceCompositionReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceSurfaceCompositionVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveWorkspaceSurfaceCompositionIdentity;
  readonly version: typeof runtimeExecutiveWorkspaceSurfaceCompositionVersion;
  readonly namespace: typeof runtimeExecutiveWorkspaceSurfaceCompositionNamespace;
  readonly phase: typeof runtimeExecutiveWorkspaceSurfaceCompositionPhase;
  readonly architecturalRole: typeof runtimeExecutiveWorkspaceSurfaceCompositionArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveWorkspaceSurfaceCompositionDependencyIdentity;
  readonly surfaceCount: number;
  readonly participationCount: number;
  readonly compositionCount: number;
  readonly compositionReasonCount: number;
  readonly invariantCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly resolutionBoundaryIntact: boolean;
  readonly everyWorkspaceHasExactlyOnePrimary: boolean;
  readonly stageIsCanonicalPrimary: boolean;
  readonly presentationStateIndependent: boolean;
  readonly dialIndependent: boolean;
  readonly cockpitControlIndependent: boolean;
  readonly uiLayoutIndependent: boolean;
  readonly upstreamResolutionOk: boolean;
}

export function verifyRuntimeExecutiveWorkspaceSurfaceComposition():
  RuntimeExecutiveWorkspaceSurfaceCompositionVerification {
  const module = runtimeExecutiveWorkspaceSurfaceComposition;
  const registry = runtimeExecutiveWorkspaceSurfaceCompositionRegistry;
  const upstream = verifyRuntimeExecutiveWorkspaceContextModeResolution();

  const identityOk =
    module.identity ===
      "REX-6:4/RuntimeExecutiveWorkspaceSurfaceComposition" &&
    module.version === "6.4.0" &&
    module.namespace ===
      "nexora.rex.workspace-experience.surface-composition" &&
    module.phase === "SurfaceComposition" &&
    module.architecturalRole ===
      "RuntimeExecutiveWorkspaceSurfaceComposition" &&
    module.upstreamDependency ===
      "REX-6:3/RuntimeExecutiveWorkspaceContextModeResolution" &&
    module.upstreamDependency ===
      runtimeExecutiveWorkspaceContextModeResolutionIdentity &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveWorkspaceContextModeResolution" &&
    module.resolutionBoundary === "REX-6:3-resolution-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES], [
      "stage",
      "advisor",
      "insight",
      "action",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS], [
      "primary",
      "supporting",
      "contextual",
      "inactive",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS], [
      "workspace-policy",
      "context-preserved",
      "subject-context",
      "intent-context",
      "fallback-overview",
    ]) &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE === "stage" &&
    !RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.includes(
      "dial" as never,
    ) &&
    !RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.includes(
      "timeline" as never,
    );

  const matrixExact =
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.overview.stage ===
      "primary" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.overview.advisor ===
      "supporting" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.overview.insight ===
      "contextual" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.overview.action ===
      "inactive" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.problem.stage === "primary" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.problem.advisor ===
      "supporting" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.problem.insight ===
      "supporting" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.problem.action ===
      "contextual" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.scenario.stage ===
      "primary" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.scenario.advisor ===
      "supporting" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.scenario.insight ===
      "supporting" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.scenario.action ===
      "contextual" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.decision.stage ===
      "primary" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.decision.advisor ===
      "supporting" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.decision.insight ===
      "supporting" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.decision.action ===
      "supporting" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.execution.stage ===
      "primary" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.execution.advisor ===
      "contextual" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.execution.insight ===
      "supporting" &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.execution.action ===
      "supporting";

  const everyWorkspaceHasExactlyOnePrimary =
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.every((kind) => {
      const entries = buildEntries(
        RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX[kind],
      );
      return (
        countPrimary(entries) === 1 &&
        isRuntimeExecutiveWorkspaceSurfaceCompositionComplete(entries)
      );
    });

  const presentationIndependent = (() => {
    const base = resolveRuntimeExecutiveWorkspaceContext({
      requestedWorkspaceKind: "decision",
      requestedSubject: { kind: "decision", id: "increase-capacity" },
      requestedIntent: "decide",
    });
    return (
      ["minimum", "report", "operation"] as const
    ).every((presentation) => {
      const composed = resolveRuntimeExecutiveWorkspaceSurfaceComposition({
        resolvedContext: {
          ...base.resolvedContext,
          presentation: { state: presentation },
        },
        resolvedWorkspaceKind: "decision",
        resolvedPresentation: presentation,
      });
      return (
        composed.workspace === "decision" &&
        composed.presentation === presentation &&
        composed.surfaces.find((entry) => entry.surface === "action")
          ?.participation === "supporting" &&
        composed.primarySurface === "stage"
      );
    });
  })();

  const countsOk =
    registry.surfaceCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.length &&
    registry.participationCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS.length &&
    registry.compositionCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.length &&
    registry.compositionReasonCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REGISTRY_SECTIONS.length &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS.length === 30 &&
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS.map((entry) => entry.id),
    );

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.overview) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.decision) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS) &&
    Object.isFrozen(
      runtimeExecutiveWorkspaceSurfaceCompositionCanonicalIdentity,
    ) &&
    Object.isFrozen(runtimeExecutiveWorkspaceSurfaceCompositionRegistry) &&
    Object.isFrozen(runtimeExecutiveWorkspaceSurfaceComposition);

  const ok =
    identityOk &&
    vocabOk &&
    matrixExact &&
    everyWorkspaceHasExactlyOnePrimary &&
    presentationIndependent &&
    countsOk &&
    frozen &&
    module.stageCenteredPrimary === true &&
    module.presentationStateIndependent === true &&
    module.dialIndependent === true &&
    module.cockpitControlIndependent === true &&
    module.uiLayoutIndependent === true &&
    upstream.ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveWorkspaceSurfaceCompositionIdentity,
    version: runtimeExecutiveWorkspaceSurfaceCompositionVersion,
    namespace: runtimeExecutiveWorkspaceSurfaceCompositionNamespace,
    phase: runtimeExecutiveWorkspaceSurfaceCompositionPhase,
    architecturalRole:
      runtimeExecutiveWorkspaceSurfaceCompositionArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceSurfaceCompositionDependencyIdentity,
    surfaceCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.length,
    participationCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS.length,
    compositionCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.length,
    compositionReasonCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS.length,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS.length,
    guaranteeCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveWorkspaceSurfaceCompositionApiNames.length,
    frozen,
    resolutionBoundaryIntact:
      module.resolutionBoundary === "REX-6:3-resolution-only",
    everyWorkspaceHasExactlyOnePrimary,
    stageIsCanonicalPrimary:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE === "stage" &&
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.every(
        (kind) =>
          RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX[kind].stage ===
          "primary",
      ),
    presentationStateIndependent: presentationIndependent,
    dialIndependent: module.dialIndependent === true,
    cockpitControlIndependent: module.cockpitControlIndependent === true,
    uiLayoutIndependent: module.uiLayoutIndependent === true,
    upstreamResolutionOk: upstream.ok === true,
  });
}
