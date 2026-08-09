/**
 * REX-6:3 — Runtime Executive Workspace Context & Mode Resolution.
 *
 * Deterministic resolution of REX-6:2 workspace contracts into the next
 * semantic executive workspace context: workspace mode, subject, intent,
 * focus, activation, and presentation carry-forward.
 *
 * Canonical flow:
 *   REX-6:2 Contracts → REX-6:3 Context & Mode Resolution → later REX-6:4 Surface Composition
 *
 * REX-6:2 answers: What information must exist for workspace coordination?
 * REX-6:3 answers: Given current context and a request signal, what semantic
 * workspace context should Nexora resolve?
 *
 * Resolves meaning, not pixels. No surface composition, Dial UI, Stage
 * rendering, animations, or business workflow execution.
 *
 * Workspace Mode ≠ Presentation State
 */

import {
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ACTIVATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INTENTS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_TRANSITION_REASONS,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES,
  createRuntimeExecutiveWorkspaceActivationContract,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceFocusContract,
  createRuntimeExecutiveWorkspaceIdentityContract,
  createRuntimeExecutiveWorkspaceIntentContract,
  createRuntimeExecutiveWorkspacePresentationContract,
  createRuntimeExecutiveWorkspaceSubjectContract,
  createRuntimeExecutiveWorkspaceSurfaceParticipationContract,
  createRuntimeExecutiveWorkspaceSurfaceSetContract,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceIntent,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSubjectContract,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  isRuntimeExecutiveWorkspaceTransitionReason,
  isRuntimeExecutiveWorkspaceTransitionRequestSource,
  runtimeExecutiveWorkspaceExperienceContractsIdentity,
  runtimeExecutiveWorkspaceExperienceContractsSupportedImportPath,
  runtimeExecutiveWorkspaceExperienceContractsVersion,
  verifyRuntimeExecutiveWorkspaceExperienceContracts,
  type RuntimeExecutiveWorkspaceActivationState,
  type RuntimeExecutiveWorkspaceContextContract,
  type RuntimeExecutiveWorkspaceFocusContract,
  type RuntimeExecutiveWorkspaceIntent,
  type RuntimeExecutiveWorkspaceKind,
  type RuntimeExecutiveWorkspacePresentationState,
  type RuntimeExecutiveWorkspaceSubjectContract,
  type RuntimeExecutiveWorkspaceSubjectKind,
  type RuntimeExecutiveWorkspaceSurfaceParticipation,
  type RuntimeExecutiveWorkspaceSurfaceParticipationContract,
  type RuntimeExecutiveWorkspaceSurfaceRole,
  type RuntimeExecutiveWorkspaceSurfaceSetContract,
  type RuntimeExecutiveWorkspaceTransitionReason,
  type RuntimeExecutiveWorkspaceTransitionRequestSource,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceContracts";

// ─── Transitively published Contracts surface (for REX-6:4+) ────────────────
// Additive publication: REX-6:4 consumes surface-role/participation vocabulary
// and resolved context contracts through REX-6:3 only.

export {
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ACTIVATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INTENTS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceFocusContract,
  createRuntimeExecutiveWorkspaceIdentityContract,
  createRuntimeExecutiveWorkspaceIntentContract,
  createRuntimeExecutiveWorkspacePresentationContract,
  createRuntimeExecutiveWorkspaceSubjectContract,
  createRuntimeExecutiveWorkspaceSurfaceParticipationContract,
  createRuntimeExecutiveWorkspaceSurfaceSetContract,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSubjectContract,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  runtimeExecutiveWorkspaceExperienceContractsIdentity,
  verifyRuntimeExecutiveWorkspaceExperienceContracts,
};

export type {
  RuntimeExecutiveWorkspaceActivationState,
  RuntimeExecutiveWorkspaceContextContract,
  RuntimeExecutiveWorkspaceFocusContract,
  RuntimeExecutiveWorkspaceIntent,
  RuntimeExecutiveWorkspaceKind,
  RuntimeExecutiveWorkspacePresentationState,
  RuntimeExecutiveWorkspaceSubjectContract,
  RuntimeExecutiveWorkspaceSubjectKind,
  RuntimeExecutiveWorkspaceSurfaceParticipation,
  RuntimeExecutiveWorkspaceSurfaceParticipationContract,
  RuntimeExecutiveWorkspaceSurfaceRole,
  RuntimeExecutiveWorkspaceSurfaceSetContract,
  RuntimeExecutiveWorkspaceTransitionReason,
  RuntimeExecutiveWorkspaceTransitionRequestSource,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceContextModeResolutionIdentity =
  "REX-6:3/RuntimeExecutiveWorkspaceContextModeResolution" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionVersion =
  "6.3.0" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionNamespace =
  "nexora.rex.workspace-experience.context-mode-resolution" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionLayer =
  "REX" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionCapability =
  "RuntimeExecutiveWorkspaceExperience" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionPhase =
  "ContextModeResolution" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionStatus =
  "ContextModeResolutionReady" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionArchitecturalRole =
  "RuntimeExecutiveWorkspaceContextModeResolution" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionDependencyIdentity =
  runtimeExecutiveWorkspaceExperienceContractsIdentity;

export const runtimeExecutiveWorkspaceContextModeResolutionDependencyPath =
  runtimeExecutiveWorkspaceExperienceContractsSupportedImportPath;

export const runtimeExecutiveWorkspaceContextModeResolutionSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveWorkspaceContextModeResolution" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionStability =
  "ContextModeResolutionReady" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionDeterministic =
  true as const;

export const runtimeExecutiveWorkspaceContextModeResolutionSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveWorkspaceContextModeResolutionCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceContextModeResolutionIdentity,
    version: runtimeExecutiveWorkspaceContextModeResolutionVersion,
    namespace: runtimeExecutiveWorkspaceContextModeResolutionNamespace,
    layer: runtimeExecutiveWorkspaceContextModeResolutionLayer,
    capability: runtimeExecutiveWorkspaceContextModeResolutionCapability,
    phase: runtimeExecutiveWorkspaceContextModeResolutionPhase,
    status: runtimeExecutiveWorkspaceContextModeResolutionStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceContextModeResolutionArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceContextModeResolutionDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceContextModeResolutionDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceContextModeResolutionSupportedImportPath,
    upstreamVersion: runtimeExecutiveWorkspaceExperienceContractsVersion,
    stabilityStatus:
      runtimeExecutiveWorkspaceContextModeResolutionStability,
    deterministicStatus:
      runtimeExecutiveWorkspaceContextModeResolutionDeterministic,
    sideEffectPolicy:
      runtimeExecutiveWorkspaceContextModeResolutionSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveWorkspaceContextModeResolutionMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRINCIPLE =
  "Given current executive workspace context and a runtime request signal, resolve the next semantic workspace context — not surface composition, Dial animation, or pixel presentation." as const;

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  resolutionAuthority: "REX-6:3" as const,
  architecturalRole:
    "RuntimeExecutiveWorkspaceContextModeResolution" as const,
  soleImmediateDependency:
    "REX-6:2/RuntimeExecutiveWorkspaceExperienceContracts" as const,
  consumesContractsOnly: true as const,
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
  stageCoordinateIndependent: true as const,
  imposesLinearWorkflow: false as const,
  introducesSurfaceComposition: false as const,
  introducesOrchestration: false as const,
  introducesUiBehavior: false as const,
  introducesRendering: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  introducesBusinessExecution: false as const,
});

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_SEPARATION = Object.freeze({
  workspaceMode:
    "overview | problem | scenario | decision | execution" as const,
  presentationState: "minimum | report | operation" as const,
  dimensionsIndependent: true as const,
  resolvesMeaningNotPixels: true as const,
  surfaceCompositionBelongsToRex64: true as const,
});

// ─── Inherited vocabularies (exact references) ──────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_KINDS =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS;
export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SUBJECT_KINDS;
export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INTENTS =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INTENTS;
export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_ACTIVATION_STATES =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ACTIVATION_STATES;
export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES;
export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_TRANSITION_REASONS =
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_TRANSITION_REASONS;
export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REQUEST_SOURCES =
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES;

// ─── Resolution vocabularies / policies ─────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES = Object.freeze([
  "changed",
  "unchanged",
  "rejected",
] as const);

export type RuntimeExecutiveWorkspaceResolutionStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS = Object.freeze([
  "explicit-workspace",
  "subject-derived",
  "intent-derived",
  "preserved-current",
  "fallback-overview",
  "same-context",
  "invalid-request",
] as const);

export type RuntimeExecutiveWorkspaceResolutionReason =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE = Object.freeze([
  "explicit-workspace",
  "subject-derived",
  "intent-derived",
  "preserved-current",
  "fallback-overview",
] as const);

export type RuntimeExecutiveWorkspaceResolutionPrecedenceStep =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE)[number];

/** Canonical safe workspace fallback. */
export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE =
  "overview" as const satisfies RuntimeExecutiveWorkspaceKind;

/** Canonical safe presentation default when none is available. */
export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_PRESENTATION =
  "report" as const satisfies RuntimeExecutiveWorkspacePresentationState;

/**
 * Workspace default executive intents.
 * Not business workflow commands.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND = Object.freeze({
  overview: "observe",
  problem: "investigate",
  scenario: "explore",
  decision: "decide",
  execution: "execute",
} as const satisfies Record<
  RuntimeExecutiveWorkspaceKind,
  RuntimeExecutiveWorkspaceIntent
>);

/**
 * Subject kinds with specialized workspace affinity.
 * goal / object / workspace intentionally omit specialized mappings.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY = Object.freeze({
  problem: "problem",
  scenario: "scenario",
  decision: "decision",
  execution: "execution",
} as const satisfies Partial<
  Record<RuntimeExecutiveWorkspaceSubjectKind, RuntimeExecutiveWorkspaceKind>
>);

/**
 * Intent → workspace implication.
 * `evaluate` is conservative: preserve specialized current context when present,
 * otherwise decision. Explicit workspace/subject always take precedence upstream.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_INTENT_AFFINITY = Object.freeze({
  observe: "overview",
  investigate: "problem",
  explore: "scenario",
  evaluate: "decision",
  decide: "decision",
  execute: "execution",
} as const satisfies Record<
  RuntimeExecutiveWorkspaceIntent,
  RuntimeExecutiveWorkspaceKind
>);

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_ISSUE_CODES = Object.freeze([
  "invalid-current-context",
  "invalid-requested-workspace-kind",
  "invalid-requested-subject",
  "empty-requested-subject-id",
  "invalid-requested-intent",
  "invalid-requested-presentation",
  "invalid-transition-reason",
  "invalid-request-source",
] as const);

export type RuntimeExecutiveWorkspaceResolutionIssueCode =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_ISSUE_CODES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Precedence",
    "Statuses",
    "Reasons",
    "DefaultWorkspace",
    "DefaultIntents",
    "SubjectAffinities",
    "IntentAffinities",
    "PresentationDefault",
    "Invariants",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveWorkspaceResolutionRegistrySection =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REGISTRY_SECTIONS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES = Object.freeze([
  "deterministic",
  "immutable",
  "contracts-aligned",
  "plain-data",
  "serializable-friendly",
  "renderer-independent",
  "selector-ui-independent",
  "dial-independent",
  "automotive-styling-independent",
  "non-linear-transition-capable",
  "presentation-state-independent",
  "side-effect-free",
  "composition-free",
  "orchestration-free",
] as const);

export type RuntimeExecutiveWorkspaceResolutionGuarantee =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES)[number];

// ─── Domain contracts ───────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceResolutionIssue {
  readonly code: RuntimeExecutiveWorkspaceResolutionIssueCode;
  readonly message: string;
  readonly path?: string;
}

/**
 * Resolution input distinguishing current state from requested state.
 * No UI/device/renderer fields.
 */
export interface RuntimeExecutiveWorkspaceContextResolutionInput {
  readonly currentContext?: RuntimeExecutiveWorkspaceContextContract | null;
  readonly requestedWorkspaceKind?: RuntimeExecutiveWorkspaceKind;
  readonly requestedSubject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly requestedIntent?: RuntimeExecutiveWorkspaceIntent;
  readonly transitionReason?: RuntimeExecutiveWorkspaceTransitionReason;
  readonly requestSource?: RuntimeExecutiveWorkspaceTransitionRequestSource;
  readonly requestedPresentation?: RuntimeExecutiveWorkspacePresentationState;
}

export interface RuntimeExecutiveWorkspaceModeResolution {
  readonly kind: RuntimeExecutiveWorkspaceKind;
  readonly reason: RuntimeExecutiveWorkspaceResolutionReason;
}

/**
 * Complete semantic resolution result.
 * Plain immutable-friendly data — no composition or render instructions.
 */
export interface RuntimeExecutiveWorkspaceContextResolutionResult {
  readonly status: RuntimeExecutiveWorkspaceResolutionStatus;
  readonly previousWorkspaceKind: RuntimeExecutiveWorkspaceKind | null;
  readonly resolvedWorkspaceKind: RuntimeExecutiveWorkspaceKind;
  readonly workspaceChanged: boolean;
  readonly contextChanged: boolean;
  readonly resolvedContext: RuntimeExecutiveWorkspaceContextContract;
  readonly resolvedSubject: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly resolvedIntent: RuntimeExecutiveWorkspaceIntent;
  readonly resolvedFocus: RuntimeExecutiveWorkspaceFocusContract;
  readonly resolvedActivation: RuntimeExecutiveWorkspaceActivationState;
  readonly resolvedPresentation: RuntimeExecutiveWorkspacePresentationState;
  readonly resolutionReason: RuntimeExecutiveWorkspaceResolutionReason;
  readonly issues: ReadonlyArray<RuntimeExecutiveWorkspaceResolutionIssue>;
}

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "resolved-workspace-canonical",
    order: 1,
    statement: "Every resolved workspace is a canonical REX-6 workspace kind.",
  }),
  Object.freeze({
    id: "explicit-workspace-precedence",
    order: 2,
    statement:
      "Explicit valid workspace requests take precedence over inference.",
  }),
  Object.freeze({
    id: "subject-may-determine-workspace",
    order: 3,
    statement:
      "A compatible explicit subject may determine workspace when workspace is absent.",
  }),
  Object.freeze({
    id: "intent-lower-than-explicit-workspace",
    order: 4,
    statement:
      "Intent inference is lower precedence than explicit workspace.",
  }),
  Object.freeze({
    id: "preserve-current-without-stronger-signal",
    order: 5,
    statement:
      "Current workspace is preserved when no stronger signal exists.",
  }),
  Object.freeze({
    id: "overview-canonical-fallback",
    order: 6,
    statement: "Overview is the canonical safe workspace fallback.",
  }),
  Object.freeze({
    id: "deterministic-resolution",
    order: 7,
    statement: "Resolution is deterministic for identical semantic inputs.",
  }),
  Object.freeze({
    id: "no-random-or-time-behavior",
    order: 8,
    statement: "No random or time-based behavior exists.",
  }),
  Object.freeze({
    id: "no-linear-workflow",
    order: 9,
    statement: "No linear workflow is enforced.",
  }),
  Object.freeze({
    id: "decision-to-scenario-supported",
    order: 10,
    statement: "Decision can resolve back to scenario.",
  }),
  Object.freeze({
    id: "execution-to-decision-supported",
    order: 11,
    statement: "Execution can resolve back to decision.",
  }),
  Object.freeze({
    id: "scenario-to-problem-supported",
    order: 12,
    statement: "Scenario can resolve back to problem.",
  }),
  Object.freeze({
    id: "subject-ids-never-generated",
    order: 13,
    statement: "Subject IDs are never generated.",
  }),
  Object.freeze({
    id: "focus-does-not-mutate-input",
    order: 14,
    statement: "Focus resolution does not mutate input.",
  }),
  Object.freeze({
    id: "presentation-independent-of-mode",
    order: 15,
    statement:
      "Presentation state remains independent from workspace mode.",
  }),
  Object.freeze({
    id: "workspace-vs-context-change-distinct",
    order: 16,
    statement: "Workspace change and context change remain distinct.",
  }),
  Object.freeze({
    id: "no-business-execution",
    order: 17,
    statement: "Resolution does not execute business actions.",
  }),
  Object.freeze({
    id: "no-ui-surface-composition",
    order: 18,
    statement: "Resolution does not compose UI surfaces.",
  }),
  Object.freeze({
    id: "no-stage-rendering",
    order: 19,
    statement: "Resolution does not render Stage objects.",
  }),
  Object.freeze({
    id: "input-device-independent",
    order: 20,
    statement: "Resolution does not depend on input device.",
  }),
  Object.freeze({
    id: "dial-geometry-independent",
    order: 21,
    statement: "Resolution does not depend on Dial geometry.",
  }),
  Object.freeze({
    id: "no-automotive-styling",
    order: 22,
    statement:
      "Resolution contains no automotive styling or selector-visual semantics.",
  }),
  Object.freeze({
    id: "registries-mutation-safe",
    order: 23,
    statement: "All canonical registries are mutation-safe.",
  }),
  Object.freeze({
    id: "results-serializable-friendly",
    order: 24,
    statement: "Result structures are serializable-friendly.",
  }),
]);

export type RuntimeExecutiveWorkspaceResolutionInvariant =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "workspace-surface-composition",
    "stage-composition",
    "advisor-composition",
    "insight-composition",
    "action-composition",
    "workspace-transition-animation",
    "workspace-dial-ui",
    "cockpit-ui",
    "react-components",
    "three-js",
    "react-three-fiber",
    "scene-colors",
    "camera-behavior",
    "object-geometry",
    "routing",
    "persistence",
    "network-calls",
    "business-workflow-execution",
    "advisor-generation",
    "insight-generation",
    "external-integrations",
  ] as const);

// ─── Internal helpers ───────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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

function issue(
  code: RuntimeExecutiveWorkspaceResolutionIssueCode,
  message: string,
  path?: string,
): RuntimeExecutiveWorkspaceResolutionIssue {
  return Object.freeze(
    path === undefined ? { code, message } : { code, message, path },
  );
}

function freezeIssues(
  issues: ReadonlyArray<RuntimeExecutiveWorkspaceResolutionIssue>,
): ReadonlyArray<RuntimeExecutiveWorkspaceResolutionIssue> {
  return Object.freeze([...issues]);
}

function subjectKey(
  subject: RuntimeExecutiveWorkspaceSubjectContract,
): string {
  return `${subject.kind}:${subject.id}`;
}

function cloneSubject(
  subject: RuntimeExecutiveWorkspaceSubjectContract,
): RuntimeExecutiveWorkspaceSubjectContract {
  return createRuntimeExecutiveWorkspaceSubjectContract(subject);
}

function cloneFocus(
  focus: RuntimeExecutiveWorkspaceFocusContract,
): RuntimeExecutiveWorkspaceFocusContract {
  return createRuntimeExecutiveWorkspaceFocusContract({
    primarySubject: focus.primarySubject,
    relatedSubjects: focus.relatedSubjects,
  });
}

function emptyFocus(): RuntimeExecutiveWorkspaceFocusContract {
  return createRuntimeExecutiveWorkspaceFocusContract({
    primarySubject: null,
    relatedSubjects: [],
  });
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

function contextsEqual(
  left: RuntimeExecutiveWorkspaceContextContract,
  right: RuntimeExecutiveWorkspaceContextContract,
): boolean {
  return (
    left.workspace.workspaceId === right.workspace.workspaceId &&
    left.workspace.workspaceKind === right.workspace.workspaceKind &&
    subjectsEqual(left.subject, right.subject) &&
    left.intent.intent === right.intent.intent &&
    left.activation.state === right.activation.state &&
    left.presentation.state === right.presentation.state &&
    focusEqual(left.focus, right.focus)
  );
}

function workspaceAffinityForSubject(
  subject: RuntimeExecutiveWorkspaceSubjectContract,
): RuntimeExecutiveWorkspaceKind | null {
  const affinity =
    RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY[
      subject.kind as keyof typeof RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY
    ];
  return affinity ?? null;
}

function intentImpliedWorkspace(
  intent: RuntimeExecutiveWorkspaceIntent,
  currentKind: RuntimeExecutiveWorkspaceKind | null,
): RuntimeExecutiveWorkspaceKind {
  if (intent === "evaluate") {
    if (
      currentKind !== null &&
      currentKind !== RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE
    ) {
      return currentKind;
    }
    return RUNTIME_EXECUTIVE_WORKSPACE_INTENT_AFFINITY.evaluate;
  }
  return RUNTIME_EXECUTIVE_WORKSPACE_INTENT_AFFINITY[intent];
}

function deterministicWorkspaceId(
  kind: RuntimeExecutiveWorkspaceKind,
  current: RuntimeExecutiveWorkspaceContextContract | null,
): string {
  if (current !== null && current.workspace.workspaceKind === kind) {
    return current.workspace.workspaceId;
  }
  return `workspace.resolved.${kind}`;
}

function buildOverviewFallbackContext(): RuntimeExecutiveWorkspaceContextContract {
  return createRuntimeExecutiveWorkspaceContextContract({
    workspace: createRuntimeExecutiveWorkspaceIdentityContract({
      workspaceId: deterministicWorkspaceId(
        RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE,
        null,
      ),
      workspaceKind: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE,
    }),
    subject: null,
    focus: emptyFocus(),
    intent: createRuntimeExecutiveWorkspaceIntentContract({
      intent:
        RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND[
          RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE
        ],
    }),
    activation: createRuntimeExecutiveWorkspaceActivationContract({
      state: "active",
    }),
    presentation: createRuntimeExecutiveWorkspacePresentationContract({
      state: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_PRESENTATION,
    }),
  });
}

function validateResolutionInput(
  input: RuntimeExecutiveWorkspaceContextResolutionInput,
): ReadonlyArray<RuntimeExecutiveWorkspaceResolutionIssue> {
  const issues: RuntimeExecutiveWorkspaceResolutionIssue[] = [];

  if (
    input.currentContext !== undefined &&
    input.currentContext !== null &&
    !isRuntimeExecutiveWorkspaceContextContract(input.currentContext)
  ) {
    issues.push(
      issue(
        "invalid-current-context",
        "currentContext must be a valid workspace context contract when provided",
        "currentContext",
      ),
    );
  }

  if (
    input.requestedWorkspaceKind !== undefined &&
    !isRuntimeExecutiveWorkspaceKind(input.requestedWorkspaceKind)
  ) {
    issues.push(
      issue(
        "invalid-requested-workspace-kind",
        "requestedWorkspaceKind must be a known workspace kind",
        "requestedWorkspaceKind",
      ),
    );
  }

  if (input.requestedSubject !== undefined && input.requestedSubject !== null) {
    if (!isPlainObject(input.requestedSubject)) {
      issues.push(
        issue(
          "invalid-requested-subject",
          "requestedSubject must be a plain subject contract",
          "requestedSubject",
        ),
      );
    } else if (!isNonEmptyString(input.requestedSubject.id)) {
      issues.push(
        issue(
          "empty-requested-subject-id",
          "requestedSubject.id must be a non-empty string",
          "requestedSubject.id",
        ),
      );
    } else if (
      !isRuntimeExecutiveWorkspaceSubjectContract(input.requestedSubject)
    ) {
      issues.push(
        issue(
          "invalid-requested-subject",
          "requestedSubject must use a canonical subject kind",
          "requestedSubject",
        ),
      );
    }
  }

  if (
    input.requestedIntent !== undefined &&
    !isRuntimeExecutiveWorkspaceIntent(input.requestedIntent)
  ) {
    issues.push(
      issue(
        "invalid-requested-intent",
        "requestedIntent must be a known workspace intent",
        "requestedIntent",
      ),
    );
  }

  if (
    input.requestedPresentation !== undefined &&
    !isRuntimeExecutiveWorkspacePresentationState(input.requestedPresentation)
  ) {
    issues.push(
      issue(
        "invalid-requested-presentation",
        "requestedPresentation must be minimum, report, or operation",
        "requestedPresentation",
      ),
    );
  }

  if (
    input.transitionReason !== undefined &&
    !isRuntimeExecutiveWorkspaceTransitionReason(input.transitionReason)
  ) {
    issues.push(
      issue(
        "invalid-transition-reason",
        "transitionReason must be a known transition reason",
        "transitionReason",
      ),
    );
  }

  if (
    input.requestSource !== undefined &&
    !isRuntimeExecutiveWorkspaceTransitionRequestSource(input.requestSource)
  ) {
    issues.push(
      issue(
        "invalid-request-source",
        "requestSource must be user, runtime, advisor, action, or system",
        "requestSource",
      ),
    );
  }

  return freezeIssues(issues);
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveWorkspaceResolutionStatus(
  value: unknown,
): value is RuntimeExecutiveWorkspaceResolutionStatus {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceResolutionReason(
  value: unknown,
): value is RuntimeExecutiveWorkspaceResolutionReason {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceResolutionGuarantee(
  value: unknown,
): value is RuntimeExecutiveWorkspaceResolutionGuarantee {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES as readonly unknown[]
  ).includes(value);
}

// ─── Change detectors ───────────────────────────────────────────────────────

export function hasRuntimeExecutiveWorkspaceChanged(input: {
  readonly previous: RuntimeExecutiveWorkspaceKind | null | undefined;
  readonly next: RuntimeExecutiveWorkspaceKind;
}): boolean {
  if (input.previous == null) return true;
  return input.previous !== input.next;
}

export function hasRuntimeExecutiveWorkspaceContextChanged(input: {
  readonly previous: RuntimeExecutiveWorkspaceContextContract | null | undefined;
  readonly next: RuntimeExecutiveWorkspaceContextContract;
}): boolean {
  if (input.previous == null) return true;
  return !contextsEqual(input.previous, input.next);
}

// ─── Dedicated resolvers ────────────────────────────────────────────────────

export function resolveRuntimeExecutiveWorkspaceMode(
  input: RuntimeExecutiveWorkspaceContextResolutionInput,
): RuntimeExecutiveWorkspaceModeResolution {
  const current =
    input.currentContext !== undefined &&
    input.currentContext !== null &&
    isRuntimeExecutiveWorkspaceContextContract(input.currentContext)
      ? input.currentContext
      : null;
  const currentKind = current?.workspace.workspaceKind ?? null;

  if (
    input.requestedWorkspaceKind !== undefined &&
    isRuntimeExecutiveWorkspaceKind(input.requestedWorkspaceKind)
  ) {
    return Object.freeze({
      kind: input.requestedWorkspaceKind,
      reason: "explicit-workspace",
    });
  }

  if (
    input.requestedSubject !== undefined &&
    input.requestedSubject !== null &&
    isRuntimeExecutiveWorkspaceSubjectContract(input.requestedSubject)
  ) {
    const affinity = workspaceAffinityForSubject(input.requestedSubject);
    if (affinity !== null) {
      return Object.freeze({
        kind: affinity,
        reason: "subject-derived",
      });
    }
  }

  if (
    input.requestedIntent !== undefined &&
    isRuntimeExecutiveWorkspaceIntent(input.requestedIntent)
  ) {
    return Object.freeze({
      kind: intentImpliedWorkspace(input.requestedIntent, currentKind),
      reason: "intent-derived",
    });
  }

  if (currentKind !== null) {
    return Object.freeze({
      kind: currentKind,
      reason: "preserved-current",
    });
  }

  return Object.freeze({
    kind: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE,
    reason: "fallback-overview",
  });
}

export function resolveRuntimeExecutiveWorkspaceSubject(
  input: RuntimeExecutiveWorkspaceContextResolutionInput,
): RuntimeExecutiveWorkspaceSubjectContract | null {
  if (input.requestedSubject === null) {
    return null;
  }

  if (
    input.requestedSubject !== undefined &&
    isRuntimeExecutiveWorkspaceSubjectContract(input.requestedSubject)
  ) {
    return cloneSubject(input.requestedSubject);
  }

  if (
    input.currentContext !== undefined &&
    input.currentContext !== null &&
    isRuntimeExecutiveWorkspaceContextContract(input.currentContext) &&
    input.currentContext.subject !== null
  ) {
    return cloneSubject(input.currentContext.subject);
  }

  return null;
}

export function resolveRuntimeExecutiveWorkspaceIntent(input: {
  readonly requestedIntent?: RuntimeExecutiveWorkspaceIntent;
  readonly resolvedWorkspaceKind: RuntimeExecutiveWorkspaceKind;
  readonly currentIntent?: RuntimeExecutiveWorkspaceIntent;
}): RuntimeExecutiveWorkspaceIntent {
  if (
    input.requestedIntent !== undefined &&
    isRuntimeExecutiveWorkspaceIntent(input.requestedIntent)
  ) {
    return input.requestedIntent;
  }

  const inferred =
    RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND[
      input.resolvedWorkspaceKind
    ];

  if (
    input.currentIntent !== undefined &&
    isRuntimeExecutiveWorkspaceIntent(input.currentIntent)
  ) {
    // Prefer workspace-default when workspace mode drove resolution without
    // an explicit intent; preserve current only when it already matches the
    // resolved workspace default or when mode was preserved with no intent signal.
    if (input.currentIntent === inferred) {
      return input.currentIntent;
    }
  }

  return inferred;
}

/**
 * Intent resolution for the full context pipeline.
 * Precedence: explicit requested → workspace default for resolved mode
 * (with current preserved only when it already equals that default).
 */
function resolveIntentForContext(input: {
  readonly requestedIntent?: RuntimeExecutiveWorkspaceIntent;
  readonly resolvedWorkspaceKind: RuntimeExecutiveWorkspaceKind;
  readonly currentIntent?: RuntimeExecutiveWorkspaceIntent;
  readonly modeReason: RuntimeExecutiveWorkspaceResolutionReason;
}): RuntimeExecutiveWorkspaceIntent {
  if (
    input.requestedIntent !== undefined &&
    isRuntimeExecutiveWorkspaceIntent(input.requestedIntent)
  ) {
    return input.requestedIntent;
  }

  const workspaceDefault =
    RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND[
      input.resolvedWorkspaceKind
    ];

  if (
    (input.modeReason === "preserved-current" ||
      input.modeReason === "same-context") &&
    input.currentIntent !== undefined &&
    isRuntimeExecutiveWorkspaceIntent(input.currentIntent)
  ) {
    return input.currentIntent;
  }

  if (
    input.currentIntent !== undefined &&
    isRuntimeExecutiveWorkspaceIntent(input.currentIntent) &&
    input.currentIntent === workspaceDefault
  ) {
    return input.currentIntent;
  }

  return workspaceDefault;
}

export function resolveRuntimeExecutiveWorkspaceFocus(input: {
  readonly currentFocus?: RuntimeExecutiveWorkspaceFocusContract | null;
  readonly requestedSubject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly resolvedSubject: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly workspaceChanged: boolean;
}): RuntimeExecutiveWorkspaceFocusContract {
  const currentFocus =
    input.currentFocus === undefined || input.currentFocus === null
      ? emptyFocus()
      : cloneFocus(input.currentFocus);

  if (
    input.requestedSubject !== undefined &&
    input.requestedSubject !== null &&
    isRuntimeExecutiveWorkspaceSubjectContract(input.requestedSubject)
  ) {
    const primary = cloneSubject(input.requestedSubject);
    const related = currentFocus.relatedSubjects.filter(
      (entry) => subjectKey(entry) !== subjectKey(primary),
    );
    return createRuntimeExecutiveWorkspaceFocusContract({
      primarySubject: primary,
      relatedSubjects: related,
    });
  }

  if (input.requestedSubject === null) {
    return emptyFocus();
  }

  if (!input.workspaceChanged) {
    return currentFocus;
  }

  if (input.resolvedSubject !== null) {
    const primary = cloneSubject(input.resolvedSubject);
    const related = currentFocus.relatedSubjects.filter(
      (entry) => subjectKey(entry) !== subjectKey(primary),
    );
    return createRuntimeExecutiveWorkspaceFocusContract({
      primarySubject: primary,
      relatedSubjects: related,
    });
  }

  return emptyFocus();
}

export function resolveRuntimeExecutiveWorkspaceActivation(input: {
  readonly workspaceChanged: boolean;
  readonly currentActivation?: RuntimeExecutiveWorkspaceActivationState;
}): RuntimeExecutiveWorkspaceActivationState {
  if (input.workspaceChanged) {
    return "entering";
  }
  if (
    input.currentActivation !== undefined &&
    (
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_ACTIVATION_STATES as readonly string[]
    ).includes(input.currentActivation)
  ) {
    if (
      input.currentActivation === "entering" ||
      input.currentActivation === "leaving" ||
      input.currentActivation === "inactive"
    ) {
      return "active";
    }
    return input.currentActivation;
  }
  return "active";
}

export function resolveRuntimeExecutiveWorkspacePresentation(input: {
  readonly requestedPresentation?: RuntimeExecutiveWorkspacePresentationState;
  readonly currentPresentation?: RuntimeExecutiveWorkspacePresentationState;
}): RuntimeExecutiveWorkspacePresentationState {
  if (
    input.requestedPresentation !== undefined &&
    isRuntimeExecutiveWorkspacePresentationState(input.requestedPresentation)
  ) {
    return input.requestedPresentation;
  }
  if (
    input.currentPresentation !== undefined &&
    isRuntimeExecutiveWorkspacePresentationState(input.currentPresentation)
  ) {
    return input.currentPresentation;
  }
  return RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_PRESENTATION;
}

// ─── Central context resolver ───────────────────────────────────────────────

export function resolveRuntimeExecutiveWorkspaceContext(
  input: RuntimeExecutiveWorkspaceContextResolutionInput,
): RuntimeExecutiveWorkspaceContextResolutionResult {
  const issues = validateResolutionInput(input);
  const current =
    input.currentContext !== undefined &&
    input.currentContext !== null &&
    isRuntimeExecutiveWorkspaceContextContract(input.currentContext)
      ? input.currentContext
      : null;
  const previousWorkspaceKind = current?.workspace.workspaceKind ?? null;

  if (issues.length > 0) {
    const preserved = current ?? buildOverviewFallbackContext();
    return Object.freeze({
      status: "rejected",
      previousWorkspaceKind,
      resolvedWorkspaceKind: preserved.workspace.workspaceKind,
      workspaceChanged: false,
      contextChanged: false,
      resolvedContext: preserved,
      resolvedSubject: preserved.subject,
      resolvedIntent: preserved.intent.intent,
      resolvedFocus: preserved.focus,
      resolvedActivation: preserved.activation.state,
      resolvedPresentation: preserved.presentation.state,
      resolutionReason: "invalid-request",
      issues,
    });
  }

  const mode = resolveRuntimeExecutiveWorkspaceMode(input);
  const resolvedWorkspaceKind = mode.kind;
  const workspaceChanged = hasRuntimeExecutiveWorkspaceChanged({
    previous: previousWorkspaceKind,
    next: resolvedWorkspaceKind,
  });

  const resolvedSubject = resolveRuntimeExecutiveWorkspaceSubject(input);

  const resolvedIntent = resolveIntentForContext({
    requestedIntent: input.requestedIntent,
    resolvedWorkspaceKind,
    currentIntent: current?.intent.intent,
    modeReason: mode.reason,
  });

  const resolvedFocus = resolveRuntimeExecutiveWorkspaceFocus({
    currentFocus: current?.focus ?? null,
    requestedSubject: input.requestedSubject,
    resolvedSubject,
    workspaceChanged,
  });

  const resolvedActivation = resolveRuntimeExecutiveWorkspaceActivation({
    workspaceChanged,
    currentActivation: current?.activation.state,
  });

  const resolvedPresentation = resolveRuntimeExecutiveWorkspacePresentation({
    requestedPresentation: input.requestedPresentation,
    currentPresentation: current?.presentation.state,
  });

  const resolvedContext = createRuntimeExecutiveWorkspaceContextContract({
    workspace: createRuntimeExecutiveWorkspaceIdentityContract({
      workspaceId: deterministicWorkspaceId(resolvedWorkspaceKind, current),
      workspaceKind: resolvedWorkspaceKind,
    }),
    subject: resolvedSubject,
    focus: resolvedFocus,
    intent: createRuntimeExecutiveWorkspaceIntentContract({
      intent: resolvedIntent,
    }),
    activation: createRuntimeExecutiveWorkspaceActivationContract({
      state: resolvedActivation,
    }),
    presentation: createRuntimeExecutiveWorkspacePresentationContract({
      state: resolvedPresentation,
    }),
  });

  const contextChanged = hasRuntimeExecutiveWorkspaceContextChanged({
    previous: current,
    next: resolvedContext,
  });

  let resolutionReason: RuntimeExecutiveWorkspaceResolutionReason = mode.reason;
  if (!workspaceChanged && !contextChanged) {
    // Preserve explicit signal reasons even when the resolved mode is unchanged.
    if (
      mode.reason === "preserved-current" ||
      mode.reason === "fallback-overview"
    ) {
      resolutionReason = "same-context";
    }
  } else if (
    !workspaceChanged &&
    contextChanged &&
    mode.reason === "preserved-current"
  ) {
    if (
      input.requestedSubject !== undefined &&
      input.requestedSubject !== null
    ) {
      resolutionReason = "subject-derived";
    } else if (input.requestedIntent !== undefined) {
      resolutionReason = "intent-derived";
    } else {
      resolutionReason = "preserved-current";
    }
  }

  const status: RuntimeExecutiveWorkspaceResolutionStatus =
    workspaceChanged || contextChanged ? "changed" : "unchanged";

  return Object.freeze({
    status,
    previousWorkspaceKind,
    resolvedWorkspaceKind,
    workspaceChanged,
    contextChanged,
    resolvedContext,
    resolvedSubject,
    resolvedIntent,
    resolvedFocus,
    resolvedActivation,
    resolvedPresentation,
    resolutionReason,
    issues: Object.freeze([]),
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveWorkspaceContextModeResolutionIdentity():
  typeof runtimeExecutiveWorkspaceContextModeResolutionCanonicalIdentity {
  return runtimeExecutiveWorkspaceContextModeResolutionCanonicalIdentity;
}

export function getRuntimeExecutiveWorkspaceContextModeResolutionGuarantees():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES {
  return RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES;
}

export function getRuntimeExecutiveWorkspaceContextModeResolutionRegistry():
  typeof runtimeExecutiveWorkspaceContextModeResolutionRegistry {
  return runtimeExecutiveWorkspaceContextModeResolutionRegistry;
}

export function getRuntimeExecutiveWorkspaceContextModeResolutionInvariants():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS {
  return RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceContextModeResolutionApiNames =
  Object.freeze([
    "getRuntimeExecutiveWorkspaceContextModeResolutionIdentity",
    "getRuntimeExecutiveWorkspaceContextModeResolutionRegistry",
    "getRuntimeExecutiveWorkspaceContextModeResolutionGuarantees",
    "getRuntimeExecutiveWorkspaceContextModeResolutionInvariants",
    "isRuntimeExecutiveWorkspaceResolutionStatus",
    "isRuntimeExecutiveWorkspaceResolutionReason",
    "isRuntimeExecutiveWorkspaceResolutionGuarantee",
    "hasRuntimeExecutiveWorkspaceChanged",
    "hasRuntimeExecutiveWorkspaceContextChanged",
    "resolveRuntimeExecutiveWorkspaceMode",
    "resolveRuntimeExecutiveWorkspaceSubject",
    "resolveRuntimeExecutiveWorkspaceIntent",
    "resolveRuntimeExecutiveWorkspaceFocus",
    "resolveRuntimeExecutiveWorkspaceActivation",
    "resolveRuntimeExecutiveWorkspacePresentation",
    "resolveRuntimeExecutiveWorkspaceContext",
    "verifyRuntimeExecutiveWorkspaceContextModeResolution",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveWorkspaceResolutionStatus",
    "RuntimeExecutiveWorkspaceResolutionReason",
    "RuntimeExecutiveWorkspaceResolutionPrecedenceStep",
    "RuntimeExecutiveWorkspaceResolutionIssueCode",
    "RuntimeExecutiveWorkspaceResolutionGuarantee",
    "RuntimeExecutiveWorkspaceResolutionRegistrySection",
    "RuntimeExecutiveWorkspaceResolutionIssue",
    "RuntimeExecutiveWorkspaceContextResolutionInput",
    "RuntimeExecutiveWorkspaceModeResolution",
    "RuntimeExecutiveWorkspaceContextResolutionResult",
    "RuntimeExecutiveWorkspaceResolutionInvariant",
    "RuntimeExecutiveWorkspaceContextModeResolutionVerification",
  ] as const);

export const runtimeExecutiveWorkspaceContextModeResolutionRegistry =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceContextModeResolutionIdentity,
    version: runtimeExecutiveWorkspaceContextModeResolutionVersion,
    namespace: runtimeExecutiveWorkspaceContextModeResolutionNamespace,
    layer: runtimeExecutiveWorkspaceContextModeResolutionLayer,
    capability: runtimeExecutiveWorkspaceContextModeResolutionCapability,
    phase: runtimeExecutiveWorkspaceContextModeResolutionPhase,
    status: runtimeExecutiveWorkspaceContextModeResolutionStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceContextModeResolutionArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceContextModeResolutionDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceContextModeResolutionDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceContextModeResolutionSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REGISTRY_SECTIONS.length,
    precedence: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE,
    precedenceStepCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE.length,
    resolutionStatuses: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES,
    resolutionStatusCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES.length,
    resolutionReasons: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS,
    resolutionReasonCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS.length,
    defaultWorkspace:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE,
    defaultPresentation:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_PRESENTATION,
    defaultIntents: RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND,
    defaultIntentCount: Object.keys(
      RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND,
    ).length,
    subjectAffinities: RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY,
    subjectAffinityCount: Object.keys(
      RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY,
    ).length,
    intentAffinities: RUNTIME_EXECUTIVE_WORKSPACE_INTENT_AFFINITY,
    intentAffinityCount: Object.keys(
      RUNTIME_EXECUTIVE_WORKSPACE_INTENT_AFFINITY,
    ).length,
    workspaceKinds: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_KINDS,
    workspaceKindCount: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_KINDS.length,
    issueCodes: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_ISSUE_CODES,
    issueCodeCount: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_ISSUE_CODES.length,
    guarantees: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES,
    guaranteeCount: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES.length,
    invariants: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS.length,
    publicTypes: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveWorkspaceContextModeResolutionApiNames,
    publicApiCount:
      runtimeExecutiveWorkspaceContextModeResolutionApiNames.length,
  });

export const runtimeExecutiveWorkspaceContextModeResolution = Object.freeze({
  phase: "ContextModeResolution" as const,
  name: "RuntimeExecutiveWorkspaceContextModeResolution" as const,
  identity: runtimeExecutiveWorkspaceContextModeResolutionIdentity,
  version: runtimeExecutiveWorkspaceContextModeResolutionVersion,
  namespace: runtimeExecutiveWorkspaceContextModeResolutionNamespace,
  layer: runtimeExecutiveWorkspaceContextModeResolutionLayer,
  capability: runtimeExecutiveWorkspaceContextModeResolutionCapability,
  architecturalRole:
    runtimeExecutiveWorkspaceContextModeResolutionArchitecturalRole,
  role: "ContextModeResolution" as const,
  status: runtimeExecutiveWorkspaceContextModeResolutionStatus,
  upstreamDependency:
    runtimeExecutiveWorkspaceContextModeResolutionDependencyIdentity,
  dependencyPath:
    runtimeExecutiveWorkspaceContextModeResolutionDependencyPath,
  supportedImportPath:
    runtimeExecutiveWorkspaceContextModeResolutionSupportedImportPath,
  deterministic:
    runtimeExecutiveWorkspaceContextModeResolutionDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  contractsAligned: true as const,
  plainData: true as const,
  serializableFriendly: true as const,
  rendererIndependent: true as const,
  selectorUiIndependent: true as const,
  dialIndependent: true as const,
  automotiveStylingIndependent: true as const,
  nonLinearTransitionCapable: true as const,
  presentationStateIndependent: true as const,
  compositionFree: true as const,
  orchestrationFree: true as const,
  principle: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_BOUNDARY,
  separation: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_SEPARATION,
  precedence: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE,
  resolutionStatuses: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES,
  resolutionReasons: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS,
  defaultWorkspace: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE,
  defaultPresentation:
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_PRESENTATION,
  defaultIntents: RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND,
  subjectAffinities: RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY,
  intentAffinities: RUNTIME_EXECUTIVE_WORKSPACE_INTENT_AFFINITY,
  guarantees: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES,
  invariants: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_FORBIDDEN_RESPONSIBILITIES,
  publicTypeNames: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveWorkspaceContextModeResolutionApiNames,
  registry: runtimeExecutiveWorkspaceContextModeResolutionRegistry,
  contractsBoundary: "REX-6:2-contracts-only" as const,
  architecturalStatus:
    "REX-6:3 Runtime Executive Workspace Context & Mode Resolution — ContextModeResolutionReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceContextModeResolutionVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveWorkspaceContextModeResolutionIdentity;
  readonly version: typeof runtimeExecutiveWorkspaceContextModeResolutionVersion;
  readonly namespace: typeof runtimeExecutiveWorkspaceContextModeResolutionNamespace;
  readonly phase: typeof runtimeExecutiveWorkspaceContextModeResolutionPhase;
  readonly architecturalRole: typeof runtimeExecutiveWorkspaceContextModeResolutionArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveWorkspaceContextModeResolutionDependencyIdentity;
  readonly resolutionStatusCount: number;
  readonly resolutionReasonCount: number;
  readonly precedenceStepCount: number;
  readonly invariantCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly contractsBoundaryIntact: boolean;
  readonly nonLinearTransitionCapable: boolean;
  readonly presentationStateIndependent: boolean;
  readonly compositionFree: boolean;
  readonly dialIndependent: boolean;
  readonly automotiveStylingIndependent: boolean;
  readonly upstreamContractsOk: boolean;
}

export function verifyRuntimeExecutiveWorkspaceContextModeResolution():
  RuntimeExecutiveWorkspaceContextModeResolutionVerification {
  const module = runtimeExecutiveWorkspaceContextModeResolution;
  const registry = runtimeExecutiveWorkspaceContextModeResolutionRegistry;
  const upstream = verifyRuntimeExecutiveWorkspaceExperienceContracts();

  const identityOk =
    module.identity ===
      "REX-6:3/RuntimeExecutiveWorkspaceContextModeResolution" &&
    module.version === "6.3.0" &&
    module.namespace ===
      "nexora.rex.workspace-experience.context-mode-resolution" &&
    module.phase === "ContextModeResolution" &&
    module.architecturalRole ===
      "RuntimeExecutiveWorkspaceContextModeResolution" &&
    module.upstreamDependency ===
      "REX-6:2/RuntimeExecutiveWorkspaceExperienceContracts" &&
    module.upstreamDependency ===
      runtimeExecutiveWorkspaceExperienceContractsIdentity &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceContracts" &&
    module.contractsBoundary === "REX-6:2-contracts-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES], [
      "changed",
      "unchanged",
      "rejected",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS], [
      "explicit-workspace",
      "subject-derived",
      "intent-derived",
      "preserved-current",
      "fallback-overview",
      "same-context",
      "invalid-request",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE], [
      "explicit-workspace",
      "subject-derived",
      "intent-derived",
      "preserved-current",
      "fallback-overview",
    ]) &&
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE === "overview" &&
    RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND.overview === "observe" &&
    RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND.problem ===
      "investigate" &&
    RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND.scenario === "explore" &&
    RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND.decision === "decide" &&
    RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND.execution === "execute" &&
    RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY.problem === "problem" &&
    RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY.scenario === "scenario" &&
    RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY.decision === "decision" &&
    RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY.execution === "execution" &&
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_BOUNDARY.imposesLinearWorkflow ===
      false &&
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_BOUNDARY
      .introducesSurfaceComposition === false;

  const nonLinearTransitionCapable = (() => {
    const pairs: ReadonlyArray<
      readonly [RuntimeExecutiveWorkspaceKind, RuntimeExecutiveWorkspaceKind]
    > = [
      ["decision", "scenario"],
      ["execution", "decision"],
      ["scenario", "problem"],
      ["problem", "overview"],
      ["overview", "decision"],
    ];
    return pairs.every(([from, to]) => {
      const current = createRuntimeExecutiveWorkspaceContextContract({
        workspace: {
          workspaceId: `workspace.${from}`,
          workspaceKind: from,
        },
        subject: null,
        focus: emptyFocus(),
        intent: {
          intent: RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND[from],
        },
        activation: { state: "active" },
        presentation: { state: "report" },
      });
      const result = resolveRuntimeExecutiveWorkspaceContext({
        currentContext: current,
        requestedWorkspaceKind: to,
        requestSource: "user",
        transitionReason: "user-request",
      });
      return (
        result.status !== "rejected" &&
        result.resolvedWorkspaceKind === to &&
        result.workspaceChanged === true
      );
    });
  })();

  const exampleA = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: createRuntimeExecutiveWorkspaceContextContract({
      workspace: {
        workspaceId: "workspace.alpha.overview",
        workspaceKind: "overview",
      },
      subject: null,
      focus: emptyFocus(),
      intent: { intent: "observe" },
      activation: { state: "active" },
      presentation: { state: "minimum" },
    }),
    requestedSubject: { kind: "problem", id: "supply-risk" },
    requestedIntent: "investigate",
  });

  const exampleC = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: createRuntimeExecutiveWorkspaceContextContract({
      workspace: {
        workspaceId: "workspace.alpha.execution",
        workspaceKind: "execution",
      },
      subject: { kind: "execution", id: "capacity-expansion" },
      focus: {
        primarySubject: { kind: "execution", id: "capacity-expansion" },
        relatedSubjects: [],
      },
      intent: { intent: "execute" },
      activation: { state: "active" },
      presentation: { state: "operation" },
    }),
  });

  const examplesOk =
    exampleA.resolvedWorkspaceKind === "problem" &&
    exampleA.workspaceChanged === true &&
    exampleA.resolvedActivation === "entering" &&
    exampleA.resolvedSubject?.id === "supply-risk" &&
    exampleA.resolvedIntent === "investigate" &&
    exampleA.resolvedPresentation === "minimum" &&
    exampleC.resolvedWorkspaceKind === "execution" &&
    exampleC.workspaceChanged === false &&
    exampleC.status === "unchanged";

  const countsOk =
    registry.resolutionStatusCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES.length &&
    registry.resolutionReasonCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS.length &&
    registry.precedenceStepCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      runtimeExecutiveWorkspaceContextModeResolutionApiNames.length &&
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS.length === 24 &&
    RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS.map((entry) => entry.id),
    );

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_INTENT_AFFINITY) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS) &&
    Object.isFrozen(
      runtimeExecutiveWorkspaceContextModeResolutionCanonicalIdentity,
    ) &&
    Object.isFrozen(runtimeExecutiveWorkspaceContextModeResolutionRegistry) &&
    Object.isFrozen(runtimeExecutiveWorkspaceContextModeResolution);

  const ok =
    identityOk &&
    vocabOk &&
    countsOk &&
    frozen &&
    nonLinearTransitionCapable &&
    examplesOk &&
    module.presentationStateIndependent === true &&
    module.compositionFree === true &&
    module.dialIndependent === true &&
    module.automotiveStylingIndependent === true &&
    module.nonLinearTransitionCapable === true &&
    upstream.ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveWorkspaceContextModeResolutionIdentity,
    version: runtimeExecutiveWorkspaceContextModeResolutionVersion,
    namespace: runtimeExecutiveWorkspaceContextModeResolutionNamespace,
    phase: runtimeExecutiveWorkspaceContextModeResolutionPhase,
    architecturalRole:
      runtimeExecutiveWorkspaceContextModeResolutionArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceContextModeResolutionDependencyIdentity,
    resolutionStatusCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES.length,
    resolutionReasonCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS.length,
    precedenceStepCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE.length,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS.length,
    guaranteeCount: RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveWorkspaceContextModeResolutionApiNames.length,
    frozen,
    contractsBoundaryIntact:
      module.contractsBoundary === "REX-6:2-contracts-only",
    nonLinearTransitionCapable,
    presentationStateIndependent:
      module.presentationStateIndependent === true,
    compositionFree: module.compositionFree === true,
    dialIndependent: module.dialIndependent === true,
    automotiveStylingIndependent:
      module.automotiveStylingIndependent === true,
    upstreamContractsOk: upstream.ok === true,
  });
}
