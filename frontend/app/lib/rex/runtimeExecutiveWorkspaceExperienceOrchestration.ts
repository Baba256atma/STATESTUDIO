/**
 * REX-6:6 — Runtime Executive Workspace Experience Orchestration.
 *
 * Coordinates the complete semantic workspace-experience pipeline:
 *   Workspace Request
 *     → REX-6:3 Context Resolution
 *     → REX-6:4 Surface Composition
 *     → REX-6:5 Transition Planning
 *     → Complete Workspace Experience Result
 *
 * Orchestrates existing semantic capabilities. Does not introduce a new
 * workspace engine, UI, Dial geometry, cockpit layout, React, or Three.js/R3F.
 *
 * REX-6:3 decides context. REX-6:4 decides participation. REX-6:5 decides
 * transition. REX-6:6 coordinates the whole experience.
 */

import {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SURFACES,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceDialRequest,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSurfaceCompositionResult,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  isRuntimeExecutiveWorkspaceSurfaceTransitionKind,
  isRuntimeExecutiveWorkspaceTransitionPhase,
  isRuntimeExecutiveWorkspaceTransitionReason,
  isRuntimeExecutiveWorkspaceTransitionSource,
  isRuntimeExecutiveWorkspaceTransitionStatus,
  normalizeRuntimeExecutiveWorkspaceDialRequest,
  orchestrateRuntimeExecutiveWorkspaceTransition,
  planRuntimeExecutiveWorkspaceTransition,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceDialSelection,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSubject,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  resolveRuntimeExecutiveWorkspaceSurfaceParticipation,
  resolveRuntimeExecutiveWorkspaceSurfaceTransition,
  runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity,
  runtimeExecutiveWorkspaceTransitionDialOrchestrationSupportedImportPath,
  runtimeExecutiveWorkspaceTransitionDialOrchestrationVersion,
  verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration,
  type RuntimeExecutiveWorkspaceContextContract,
  type RuntimeExecutiveWorkspaceContextResolutionResult,
  type RuntimeExecutiveWorkspaceDialRequest,
  type RuntimeExecutiveWorkspaceFocusContract,
  type RuntimeExecutiveWorkspaceIntent,
  type RuntimeExecutiveWorkspaceKind,
  type RuntimeExecutiveWorkspacePresentationState,
  type RuntimeExecutiveWorkspaceSubjectContract,
  type RuntimeExecutiveWorkspaceSurfaceCompositionResult,
  type RuntimeExecutiveWorkspaceSurfaceParticipation,
  type RuntimeExecutiveWorkspaceSurfaceRole,
  type RuntimeExecutiveWorkspaceTransitionOrchestrationResult,
  type RuntimeExecutiveWorkspaceTransitionPlan,
  type RuntimeExecutiveWorkspaceTransitionReason,
  type RuntimeExecutiveWorkspaceTransitionSource,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceTransitionDialOrchestration";

// ─── Transitively published Transition surface (for REX-6:7+) ───────────────

export {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceDialRequest,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSurfaceCompositionResult,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  isRuntimeExecutiveWorkspaceSurfaceTransitionKind,
  isRuntimeExecutiveWorkspaceTransitionPhase,
  isRuntimeExecutiveWorkspaceTransitionReason,
  isRuntimeExecutiveWorkspaceTransitionSource,
  isRuntimeExecutiveWorkspaceTransitionStatus,
  normalizeRuntimeExecutiveWorkspaceDialRequest,
  orchestrateRuntimeExecutiveWorkspaceTransition,
  planRuntimeExecutiveWorkspaceTransition,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceDialSelection,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSubject,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  resolveRuntimeExecutiveWorkspaceSurfaceParticipation,
  resolveRuntimeExecutiveWorkspaceSurfaceTransition,
  runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity,
  verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration,
};

export type {
  RuntimeExecutiveWorkspaceContextContract,
  RuntimeExecutiveWorkspaceContextResolutionResult,
  RuntimeExecutiveWorkspaceDialRequest,
  RuntimeExecutiveWorkspaceFocusContract,
  RuntimeExecutiveWorkspaceIntent,
  RuntimeExecutiveWorkspaceKind,
  RuntimeExecutiveWorkspacePresentationState,
  RuntimeExecutiveWorkspaceSubjectContract,
  RuntimeExecutiveWorkspaceSurfaceCompositionResult,
  RuntimeExecutiveWorkspaceSurfaceParticipation,
  RuntimeExecutiveWorkspaceSurfaceRole,
  RuntimeExecutiveWorkspaceTransitionOrchestrationResult,
  RuntimeExecutiveWorkspaceTransitionPlan,
  RuntimeExecutiveWorkspaceTransitionReason,
  RuntimeExecutiveWorkspaceTransitionSource,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceExperienceOrchestrationIdentity =
  "REX-6:6/RuntimeExecutiveWorkspaceExperienceOrchestration" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationVersion =
  "6.6.0" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationNamespace =
  "nexora.rex.workspace-experience.orchestration" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationLayer =
  "REX" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationCapability =
  "RuntimeExecutiveWorkspaceExperience" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationPhase =
  "ExperienceOrchestration" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationStatus =
  "ExperienceOrchestrationReady" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationArchitecturalRole =
  "RuntimeExecutiveWorkspaceExperienceOrchestration" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationDependencyIdentity =
  runtimeExecutiveWorkspaceTransitionDialOrchestrationIdentity;

export const runtimeExecutiveWorkspaceExperienceOrchestrationDependencyPath =
  runtimeExecutiveWorkspaceTransitionDialOrchestrationSupportedImportPath;

export const runtimeExecutiveWorkspaceExperienceOrchestrationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceOrchestration" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationStability =
  "ExperienceOrchestrationReady" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationDeterministic =
  true as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveWorkspaceExperienceOrchestrationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperienceOrchestrationIdentity,
    version: runtimeExecutiveWorkspaceExperienceOrchestrationVersion,
    namespace: runtimeExecutiveWorkspaceExperienceOrchestrationNamespace,
    layer: runtimeExecutiveWorkspaceExperienceOrchestrationLayer,
    capability:
      runtimeExecutiveWorkspaceExperienceOrchestrationCapability,
    phase: runtimeExecutiveWorkspaceExperienceOrchestrationPhase,
    status: runtimeExecutiveWorkspaceExperienceOrchestrationStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceOrchestrationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperienceOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperienceOrchestrationSupportedImportPath,
    upstreamVersion:
      runtimeExecutiveWorkspaceTransitionDialOrchestrationVersion,
    stabilityStatus:
      runtimeExecutiveWorkspaceExperienceOrchestrationStability,
    deterministicStatus:
      runtimeExecutiveWorkspaceExperienceOrchestrationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveWorkspaceExperienceOrchestrationSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveWorkspaceExperienceOrchestrationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_PRINCIPLE =
  "Coordinate REX-6:3 context resolution, REX-6:4 surface composition, and REX-6:5 transition planning into one coherent semantic workspace experience — without rendering, Dial geometry, or business execution." as const;

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    orchestrationAuthority: "REX-6:6" as const,
    architecturalRole:
      "RuntimeExecutiveWorkspaceExperienceOrchestration" as const,
    soleImmediateDependency:
      "REX-6:5/RuntimeExecutiveWorkspaceTransitionDialOrchestration" as const,
    consumesTransitionOrchestrationOnly: true as const,
    importsRex64Directly: false as const,
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
    duplicatesContextPolicy: false as const,
    duplicatesCompositionPolicy: false as const,
    duplicatesTransitionPolicy: false as const,
    dialIsControlSource: true as const,
    dialGeometryIndependent: true as const,
    cockpitLayoutIndependent: true as const,
    automotiveStylingIndependent: true as const,
    animationTimingIndependent: true as const,
    introducesUi: false as const,
    introducesRendering: false as const,
    introducesTimers: false as const,
    introducesBusinessExecution: false as const,
    introducesAdvisorGeneration: false as const,
    introducesInsightGeneration: false as const,
    introducesTimelineControl: false as const,
    introducesCockpitControlState: false as const,
    introducesPersistence: false as const,
    introducesExternalIntegration: false as const,
    imposesLinearWorkflow: false as const,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_SEPARATION =
  Object.freeze({
    rex63DecidesContext: true as const,
    rex64DecidesParticipation: true as const,
    rex65DecidesTransition: true as const,
    rex66CoordinatesExperience: true as const,
    cockpitDecidesPhysicalControls: true as const,
    stageDecidesRendering: true as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES =
  Object.freeze(["resolved", "unchanged", "rejected"] as const);

export type RuntimeExecutiveWorkspaceExperienceOrchestrationStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS =
  Object.freeze([
    "bootstrap",
    "workspace-change",
    "context-change",
    "preserved",
    "rejected-request",
  ] as const);

export type RuntimeExecutiveWorkspaceExperienceOrchestrationReason =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES =
  Object.freeze([
    "request",
    "context-resolution",
    "surface-composition",
    "transition-orchestration",
    "snapshot",
    "complete",
  ] as const);

export type RuntimeExecutiveWorkspaceExperiencePipelineStage =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_UPSTREAM_CAPABILITIES =
  Object.freeze([
    "context-resolution",
    "surface-composition",
    "transition-planning",
    "dial-request-support",
    "snapshot-derivation",
  ] as const);

export type RuntimeExecutiveWorkspaceExperienceUpstreamCapability =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_UPSTREAM_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_BOOTSTRAP_DEFAULTS =
  Object.freeze({
    workspace: "overview" as const satisfies RuntimeExecutiveWorkspaceKind,
    intent: "observe" as const satisfies RuntimeExecutiveWorkspaceIntent,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_GUARANTEES =
  Object.freeze([
    "sole-dependency-rex-6-5",
    "deterministic-pipeline-order",
    "no-upstream-policy-duplication",
    "source-metadata-preservation",
    "presentation-independence",
    "same-workspace-context-support",
    "non-linear-transition-support",
    "bootstrap-overview-observe",
    "serializable-friendly-output",
    "side-effect-free",
  ] as const);

export type RuntimeExecutiveWorkspaceExperienceOrchestrationGuarantee =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Statuses",
    "Reasons",
    "PipelineStages",
    "UpstreamCapabilities",
    "BootstrapDefaults",
    "Invariants",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveWorkspaceExperienceOrchestrationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REGISTRY_SECTIONS)[number];

// ─── Domain contracts ───────────────────────────────────────────────────────

/**
 * High-level semantic workspace experience request.
 * Device/control-mechanism independent — Dial is one possible source.
 */
export interface RuntimeExecutiveWorkspaceExperienceRequest {
  readonly requestedWorkspace?: RuntimeExecutiveWorkspaceKind;
  readonly requestedSubject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly requestedIntent?: RuntimeExecutiveWorkspaceIntent;
  readonly requestedPresentation?: RuntimeExecutiveWorkspacePresentationState;
  readonly source: RuntimeExecutiveWorkspaceTransitionSource;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
}

/**
 * Semantic view of the current executive workspace experience.
 * Context + composition only — no UI/component/renderer state.
 */
export interface RuntimeExecutiveWorkspaceExperienceSnapshot {
  readonly workspace: RuntimeExecutiveWorkspaceKind;
  readonly subject: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly focus: RuntimeExecutiveWorkspaceFocusContract;
  readonly intent: RuntimeExecutiveWorkspaceIntent;
  readonly activation: RuntimeExecutiveWorkspaceContextContract["activation"]["state"];
  readonly presentation: RuntimeExecutiveWorkspacePresentationState;
  readonly context: RuntimeExecutiveWorkspaceContextContract;
  readonly composition: RuntimeExecutiveWorkspaceSurfaceCompositionResult;
}

export interface RuntimeExecutiveWorkspaceExperienceOrchestrationInput {
  readonly currentExperience: RuntimeExecutiveWorkspaceExperienceSnapshot | null;
  readonly request: RuntimeExecutiveWorkspaceExperienceRequest;
}

export interface RuntimeExecutiveWorkspaceExperienceOrchestrationTraceEntry {
  readonly stage: RuntimeExecutiveWorkspaceExperiencePipelineStage;
  readonly ok: boolean;
  readonly detail?: string;
}

export interface RuntimeExecutiveWorkspaceExperienceOrchestrationTrace {
  readonly stages: readonly RuntimeExecutiveWorkspaceExperienceOrchestrationTraceEntry[];
  readonly rejectedAt: RuntimeExecutiveWorkspaceExperiencePipelineStage | null;
}

export interface RuntimeExecutiveWorkspaceExperienceOrchestrationResult {
  readonly status: RuntimeExecutiveWorkspaceExperienceOrchestrationStatus;
  readonly reason: RuntimeExecutiveWorkspaceExperienceOrchestrationReason;
  readonly previousExperience: RuntimeExecutiveWorkspaceExperienceSnapshot | null;
  readonly request: RuntimeExecutiveWorkspaceExperienceRequest;
  readonly resolution: RuntimeExecutiveWorkspaceContextResolutionResult | null;
  readonly resolvedContext: RuntimeExecutiveWorkspaceContextContract | null;
  readonly targetComposition: RuntimeExecutiveWorkspaceSurfaceCompositionResult | null;
  readonly transition: RuntimeExecutiveWorkspaceTransitionOrchestrationResult | null;
  readonly nextExperience: RuntimeExecutiveWorkspaceExperienceSnapshot | null;
  readonly workspaceChanged: boolean;
  readonly contextChanged: boolean;
  readonly source: RuntimeExecutiveWorkspaceTransitionSource;
  readonly transitionReason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly trace: RuntimeExecutiveWorkspaceExperienceOrchestrationTrace;
}

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "sole-dependency-rex-6-5",
      order: 1,
      statement: "REX-6:5 is the sole immediate dependency.",
    }),
    Object.freeze({
      id: "deterministic-orchestration-order",
      order: 2,
      statement: "Orchestration order is deterministic.",
    }),
    Object.freeze({
      id: "context-before-composition",
      order: 3,
      statement: "Context resolution occurs before surface composition.",
    }),
    Object.freeze({
      id: "composition-before-transition",
      order: 4,
      statement: "Surface composition occurs before transition planning.",
    }),
    Object.freeze({
      id: "snapshot-after-resolution",
      order: 5,
      statement: "Snapshot derivation occurs after semantic resolution.",
    }),
    Object.freeze({
      id: "no-upstream-policy-duplication",
      order: 6,
      statement: "Upstream policies are not duplicated.",
    }),
    Object.freeze({
      id: "resolved-has-canonical-workspace",
      order: 7,
      statement: "Every resolved result contains a canonical workspace.",
    }),
    Object.freeze({
      id: "resolved-has-complete-composition",
      order: 8,
      statement:
        "Every resolved result contains a complete canonical surface composition.",
    }),
    Object.freeze({
      id: "meaningful-change-has-transition",
      order: 9,
      statement: "Every meaningful change contains a valid transition result.",
    }),
    Object.freeze({
      id: "workspace-context-change-separate",
      order: 10,
      statement: "workspaceChanged and contextChanged remain separate.",
    }),
    Object.freeze({
      id: "same-workspace-context-supported",
      order: 11,
      statement: "Same-workspace context changes are supported.",
    }),
    Object.freeze({
      id: "identical-context-unchanged",
      order: 12,
      statement: "Identical semantic contexts produce unchanged status.",
    }),
    Object.freeze({
      id: "bootstrap-overview-semantics",
      order: 13,
      statement: "Bootstrap resolves through canonical overview semantics.",
    }),
    Object.freeze({
      id: "non-linear-workspace-supported",
      order: 14,
      statement: "Non-linear workspace changes remain supported.",
    }),
    Object.freeze({
      id: "source-not-physical-input",
      order: 15,
      statement: "Request source does not define physical input behavior.",
    }),
    Object.freeze({
      id: "dial-source-semantic-only",
      order: 16,
      statement:
        "Dial source is supported semantically without visual assumptions.",
    }),
    Object.freeze({
      id: "presentation-independent",
      order: 17,
      statement: "Presentation remains independent from workspace.",
    }),
    Object.freeze({
      id: "subject-reference-only",
      order: 18,
      statement: "Subject references remain reference-only.",
    }),
    Object.freeze({
      id: "no-business-action-execution",
      order: 19,
      statement: "Orchestration does not execute business actions.",
    }),
    Object.freeze({
      id: "no-advisor-generation",
      order: 20,
      statement: "Orchestration does not generate Advisor content.",
    }),
    Object.freeze({
      id: "no-insight-generation",
      order: 21,
      statement: "Orchestration does not generate Insight content.",
    }),
    Object.freeze({
      id: "no-stage-rendering",
      order: 22,
      statement: "Orchestration does not render Stage content.",
    }),
    Object.freeze({
      id: "no-cockpit-control-manipulation",
      order: 23,
      statement: "Orchestration does not manipulate cockpit controls.",
    }),
    Object.freeze({
      id: "no-timeline-control",
      order: 24,
      statement: "Orchestration does not control Timeline.",
    }),
    Object.freeze({
      id: "no-react-dependency",
      order: 25,
      statement: "Orchestration contains no React dependency.",
    }),
    Object.freeze({
      id: "no-three-dependency",
      order: 26,
      statement: "Orchestration contains no Three.js dependency.",
    }),
    Object.freeze({
      id: "no-r3f-dependency",
      order: 27,
      statement: "Orchestration contains no React Three Fiber dependency.",
    }),
    Object.freeze({
      id: "no-automotive-styling",
      order: 28,
      statement: "Orchestration contains no Cadillac/Porsche styling semantics.",
    }),
    Object.freeze({
      id: "no-timers",
      order: 29,
      statement: "Orchestration uses no timers.",
    }),
    Object.freeze({
      id: "no-network",
      order: 30,
      statement: "Orchestration uses no network calls.",
    }),
    Object.freeze({
      id: "outputs-mutation-safe",
      order: 31,
      statement: "Outputs are mutation-safe.",
    }),
    Object.freeze({
      id: "outputs-serializable-friendly",
      order: 32,
      statement: "Outputs are serializable-friendly.",
    }),
    Object.freeze({
      id: "registries-mutation-safe",
      order: 33,
      statement: "Canonical registries are mutation-safe.",
    }),
    Object.freeze({
      id: "repeated-inputs-equivalent",
      order: 34,
      statement: "Repeated identical inputs produce equivalent outputs.",
    }),
  ]);

export type RuntimeExecutiveWorkspaceExperienceOrchestrationInvariant =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "react-ui",
    "workspace-dial-ui",
    "quarter-circle-dial",
    "cadillac-porsche-styling",
    "stage-rendering",
    "advisor-rendering",
    "insight-rendering",
    "action-rendering",
    "top-cockpit-buttons",
    "left-dropdown-menu",
    "right-dropdown-menu",
    "timeline-rendering",
    "three-js",
    "react-three-fiber",
    "camera-movement",
    "animation-timing",
    "business-action-execution",
    "persistence",
    "routing",
    "network-calls",
  ] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function freezeTrace(
  stages: readonly RuntimeExecutiveWorkspaceExperienceOrchestrationTraceEntry[],
  rejectedAt: RuntimeExecutiveWorkspaceExperiencePipelineStage | null = null,
): RuntimeExecutiveWorkspaceExperienceOrchestrationTrace {
  return Object.freeze({
    stages: Object.freeze(stages.map((entry) => Object.freeze({ ...entry }))),
    rejectedAt,
  });
}

function mapRequestSourceForResolution(
  source: RuntimeExecutiveWorkspaceTransitionSource,
): "user" | "runtime" | "advisor" | "action" | "system" | undefined {
  if (source === "dial") return "user";
  return source;
}

function deriveOrchestrationReason(input: {
  readonly bootstrap: boolean;
  readonly status: RuntimeExecutiveWorkspaceExperienceOrchestrationStatus;
  readonly workspaceChanged: boolean;
  readonly contextChanged: boolean;
}): RuntimeExecutiveWorkspaceExperienceOrchestrationReason {
  if (input.status === "rejected") return "rejected-request";
  if (input.bootstrap) return "bootstrap";
  if (input.status === "unchanged") return "preserved";
  if (input.workspaceChanged) return "workspace-change";
  if (input.contextChanged) return "context-change";
  return "preserved";
}

function participationForSurface(
  composition: RuntimeExecutiveWorkspaceSurfaceCompositionResult,
  surface: RuntimeExecutiveWorkspaceSurfaceRole,
): RuntimeExecutiveWorkspaceSurfaceParticipation {
  const entry = composition.surfaces.find((item) => item.surface === surface);
  if (!entry) {
    throw new Error(`composition missing surface ${surface}`);
  }
  return entry.participation;
}

/**
 * Bootstrap has no prior experience. Synthesize a transition plan from
 * inactive participation into the resolved composition using REX-6:5's
 * surface transition resolver — without inventing composition policy.
 */
function planBootstrapTransition(input: {
  readonly targetContext: RuntimeExecutiveWorkspaceContextContract;
  readonly targetComposition: RuntimeExecutiveWorkspaceSurfaceCompositionResult;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly source: RuntimeExecutiveWorkspaceTransitionSource;
}): RuntimeExecutiveWorkspaceTransitionOrchestrationResult {
  const targetWorkspace = input.targetContext.workspace.workspaceKind;
  const surfaces = Object.freeze(
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SURFACES.map((surface) => {
      const to = participationForSurface(input.targetComposition, surface);
      const from = "inactive" as const;
      return Object.freeze({
        surface,
        from,
        to,
        kind: resolveRuntimeExecutiveWorkspaceSurfaceTransition({ from, to }),
      });
    }),
  );

  const subject = Object.freeze({
    kind:
      input.targetContext.subject === null
        ? ("clear" as const)
        : ("replace" as const),
    from: null,
    to: input.targetContext.subject,
  });
  const focus = Object.freeze({
    kind:
      input.targetContext.focus.primarySubject === null
        ? ("clear" as const)
        : ("retarget" as const),
    from: Object.freeze({
      primarySubject: null,
      relatedSubjects: Object.freeze([]),
    }),
    to: input.targetContext.focus,
  });
  const presentation = Object.freeze({
    kind: "replace" as const,
    from: "minimum" as const,
    to: input.targetContext.presentation.state,
  });
  const phases = RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES;
  const plan = Object.freeze({
    fromWorkspace: targetWorkspace,
    toWorkspace: targetWorkspace,
    reason: input.reason,
    source: input.source,
    phases,
    surfaces,
    subject,
    focus,
    presentation,
    workspaceChanged: true,
    contextChanged: true,
  });

  return Object.freeze({
    status: "planned",
    sourceWorkspace: targetWorkspace,
    targetWorkspace,
    workspaceChanged: true,
    contextChanged: true,
    sourceComposition: input.targetComposition,
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

// ─── Validation ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveWorkspaceExperienceOrchestrationStatus(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperienceOrchestrationStatus {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceExperienceOrchestrationReason(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperienceOrchestrationReason {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceExperiencePipelineStage(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperiencePipelineStage {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceExperienceRequest(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperienceRequest {
  if (!isPlainObject(value)) return false;
  if (
    value.requestedWorkspace !== undefined &&
    !isRuntimeExecutiveWorkspaceKind(value.requestedWorkspace)
  ) {
    return false;
  }
  return (
    isRuntimeExecutiveWorkspaceTransitionSource(value.source) &&
    isRuntimeExecutiveWorkspaceTransitionReason(value.reason)
  );
}

export function isRuntimeExecutiveWorkspaceExperienceSnapshot(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperienceSnapshot {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceKind(value.workspace) &&
    isRuntimeExecutiveWorkspaceContextContract(value.context) &&
    isRuntimeExecutiveWorkspaceSurfaceCompositionResult(value.composition) &&
    value.workspace === value.context.workspace.workspaceKind &&
    value.workspace === value.composition.workspace
  );
}

export function isRuntimeExecutiveWorkspaceExperienceOrchestrationResult(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperienceOrchestrationResult {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceExperienceOrchestrationStatus(value.status) &&
    isRuntimeExecutiveWorkspaceExperienceOrchestrationReason(value.reason) &&
    isRuntimeExecutiveWorkspaceExperienceRequest(value.request) &&
    isPlainObject(value.trace) &&
    Array.isArray(value.trace.stages)
  );
}

// ─── Snapshot derivation ────────────────────────────────────────────────────

/**
 * Build the next experience snapshot from already-resolved semantic results.
 * Does not independently resolve workspace policy.
 */
export function deriveRuntimeExecutiveWorkspaceExperienceSnapshot(input: {
  readonly context: RuntimeExecutiveWorkspaceContextContract;
  readonly composition: RuntimeExecutiveWorkspaceSurfaceCompositionResult;
}): RuntimeExecutiveWorkspaceExperienceSnapshot {
  if (!isRuntimeExecutiveWorkspaceContextContract(input.context)) {
    throw new TypeError("context must be a valid context contract");
  }
  if (!isRuntimeExecutiveWorkspaceSurfaceCompositionResult(input.composition)) {
    throw new TypeError("composition must be a valid composition result");
  }
  if (input.context.workspace.workspaceKind !== input.composition.workspace) {
    throw new TypeError("context and composition workspace must match");
  }

  return Object.freeze({
    workspace: input.context.workspace.workspaceKind,
    subject: input.context.subject,
    focus: input.context.focus,
    intent: input.context.intent.intent,
    activation: input.context.activation.state,
    presentation: input.context.presentation.state,
    context: input.context,
    composition: input.composition,
  });
}

export function createRuntimeExecutiveWorkspaceExperienceSnapshot(input: {
  readonly context: RuntimeExecutiveWorkspaceContextContract;
  readonly composition: RuntimeExecutiveWorkspaceSurfaceCompositionResult;
}): RuntimeExecutiveWorkspaceExperienceSnapshot {
  return deriveRuntimeExecutiveWorkspaceExperienceSnapshot(input);
}

// ─── Central orchestration ──────────────────────────────────────────────────

export function orchestrateRuntimeExecutiveWorkspaceExperience(
  input: RuntimeExecutiveWorkspaceExperienceOrchestrationInput,
): RuntimeExecutiveWorkspaceExperienceOrchestrationResult {
  const bootstrap = input.currentExperience === null;
  const previousExperience = input.currentExperience;

  if (!isRuntimeExecutiveWorkspaceExperienceRequest(input.request)) {
    const rejectedRequest = isPlainObject(input.request)
      ? (Object.freeze({
          ...(input.request as RuntimeExecutiveWorkspaceExperienceRequest),
          source: isRuntimeExecutiveWorkspaceTransitionSource(
            (input.request as { source?: unknown }).source,
          )
            ? ((input.request as RuntimeExecutiveWorkspaceExperienceRequest)
                .source)
            : ("system" as const),
          reason: isRuntimeExecutiveWorkspaceTransitionReason(
            (input.request as { reason?: unknown }).reason,
          )
            ? ((input.request as RuntimeExecutiveWorkspaceExperienceRequest)
                .reason)
            : ("user-request" as const),
        }) as RuntimeExecutiveWorkspaceExperienceRequest)
      : Object.freeze({
          source: "system" as const,
          reason: "user-request" as const,
        });

    return Object.freeze({
      status: "rejected",
      reason: "rejected-request",
      previousExperience,
      request: rejectedRequest,
      resolution: null,
      resolvedContext: previousExperience?.context ?? null,
      targetComposition: previousExperience?.composition ?? null,
      transition: null,
      nextExperience: null,
      workspaceChanged: false,
      contextChanged: false,
      source: rejectedRequest.source,
      transitionReason: rejectedRequest.reason,
      trace: freezeTrace(
        [
          { stage: "request", ok: false, detail: "invalid-request" },
          { stage: "complete", ok: false, detail: "rejected-request" },
        ],
        "request",
      ),
    });
  }

  const request = Object.freeze({ ...input.request });
  const trace: RuntimeExecutiveWorkspaceExperienceOrchestrationTraceEntry[] = [
    { stage: "request", ok: true },
  ];

  if (
    previousExperience !== null &&
    !isRuntimeExecutiveWorkspaceExperienceSnapshot(previousExperience)
  ) {
    throw new TypeError(
      "currentExperience must be null or a valid experience snapshot",
    );
  }

  // 1–2. Resolve target workspace context (REX-6:3 via REX-6:5 publication)
  const resolution = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: previousExperience?.context ?? null,
    requestedWorkspaceKind: request.requestedWorkspace,
    requestedSubject: request.requestedSubject,
    requestedIntent: request.requestedIntent,
    requestedPresentation: request.requestedPresentation,
    transitionReason: request.reason,
    requestSource: mapRequestSourceForResolution(request.source),
  });
  trace.push({
    stage: "context-resolution",
    ok: resolution.status !== "rejected",
    detail: resolution.resolutionReason,
  });

  if (resolution.status === "rejected") {
    return Object.freeze({
      status: "rejected",
      reason: "rejected-request",
      previousExperience,
      request,
      resolution,
      resolvedContext: resolution.resolvedContext,
      targetComposition: previousExperience?.composition ?? null,
      transition: null,
      nextExperience: null,
      workspaceChanged: false,
      contextChanged: false,
      source: request.source,
      transitionReason: request.reason,
      trace: freezeTrace(
        [
          ...trace,
          { stage: "complete", ok: false, detail: "rejected-at-context" },
        ],
        "context-resolution",
      ),
    });
  }

  // 3. Resolve target surface composition (REX-6:4 via REX-6:5 publication)
  const targetComposition =
    composeRuntimeExecutiveWorkspaceSurfacesFromResolution(resolution);
  trace.push({
    stage: "surface-composition",
    ok: true,
    detail: targetComposition.compositionReason,
  });

  // 4. Plan workspace transition (REX-6:5)
  let transition: RuntimeExecutiveWorkspaceTransitionOrchestrationResult;
  if (bootstrap || previousExperience === null) {
    transition = planBootstrapTransition({
      targetContext: resolution.resolvedContext,
      targetComposition,
      reason: request.reason,
      source: request.source,
    });
  } else {
    transition = planRuntimeExecutiveWorkspaceTransition({
      currentContext: previousExperience.context,
      targetContext: resolution.resolvedContext,
      currentComposition: previousExperience.composition,
      targetComposition,
      reason: request.reason,
      source: request.source,
    });
  }

  trace.push({
    stage: "transition-orchestration",
    ok: transition.status !== "rejected",
    detail: transition.status,
  });

  if (transition.status === "rejected") {
    return Object.freeze({
      status: "rejected",
      reason: "rejected-request",
      previousExperience,
      request,
      resolution,
      resolvedContext: resolution.resolvedContext,
      targetComposition,
      transition,
      nextExperience: null,
      workspaceChanged: false,
      contextChanged: false,
      source: request.source,
      transitionReason: request.reason,
      trace: freezeTrace(
        [
          ...trace,
          { stage: "complete", ok: false, detail: "rejected-at-transition" },
        ],
        "transition-orchestration",
      ),
    });
  }

  const workspaceChanged = bootstrap
    ? true
    : transition.workspaceChanged || resolution.workspaceChanged;
  const contextChanged = bootstrap
    ? true
    : transition.contextChanged || resolution.contextChanged;

  if (!bootstrap && transition.status === "unchanged" && !contextChanged) {
    const nextExperience = previousExperience;
    trace.push({ stage: "complete", ok: true, detail: "unchanged" });
    return Object.freeze({
      status: "unchanged",
      reason: deriveOrchestrationReason({
        bootstrap: false,
        status: "unchanged",
        workspaceChanged: false,
        contextChanged: false,
      }),
      previousExperience,
      request,
      resolution,
      resolvedContext: resolution.resolvedContext,
      targetComposition,
      transition,
      nextExperience,
      workspaceChanged: false,
      contextChanged: false,
      source: request.source,
      transitionReason: request.reason,
      trace: freezeTrace(trace),
    });
  }

  // 5. Produce next semantic experience snapshot
  const nextExperience = deriveRuntimeExecutiveWorkspaceExperienceSnapshot({
    context: resolution.resolvedContext,
    composition: targetComposition,
  });
  trace.push({ stage: "snapshot", ok: true });
  trace.push({ stage: "complete", ok: true });

  const status: RuntimeExecutiveWorkspaceExperienceOrchestrationStatus =
    "resolved";

  return Object.freeze({
    status,
    reason: deriveOrchestrationReason({
      bootstrap,
      status,
      workspaceChanged,
      contextChanged,
    }),
    previousExperience,
    request,
    resolution,
    resolvedContext: resolution.resolvedContext,
    targetComposition,
    transition,
    nextExperience,
    workspaceChanged,
    contextChanged,
    source: request.source,
    transitionReason: request.reason,
    trace: freezeTrace(trace),
  });
}

/**
 * Convenience: normalize a Dial request, then orchestrate through the same path.
 */
export function orchestrateRuntimeExecutiveWorkspaceExperienceFromDialRequest(input: {
  readonly currentExperience: RuntimeExecutiveWorkspaceExperienceSnapshot | null;
  readonly dialRequest: RuntimeExecutiveWorkspaceDialRequest;
}): RuntimeExecutiveWorkspaceExperienceOrchestrationResult {
  const normalized = normalizeRuntimeExecutiveWorkspaceDialRequest(
    input.dialRequest,
  );
  return orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: input.currentExperience,
    request: Object.freeze({
      requestedWorkspace: normalized.requestedWorkspaceKind,
      source: normalized.source,
      reason: normalized.reason,
      ...(normalized.requestedSubject !== undefined
        ? { requestedSubject: normalized.requestedSubject }
        : {}),
      ...(normalized.requestedIntent !== undefined
        ? { requestedIntent: normalized.requestedIntent }
        : {}),
    }),
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveWorkspaceExperienceOrchestrationIdentity():
  typeof runtimeExecutiveWorkspaceExperienceOrchestrationCanonicalIdentity {
  return runtimeExecutiveWorkspaceExperienceOrchestrationCanonicalIdentity;
}

export function getRuntimeExecutiveWorkspaceExperienceOrchestrationGuarantees():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_GUARANTEES {
  return RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_GUARANTEES;
}

export function getRuntimeExecutiveWorkspaceExperienceOrchestrationRegistry():
  typeof runtimeExecutiveWorkspaceExperienceOrchestrationRegistry {
  return runtimeExecutiveWorkspaceExperienceOrchestrationRegistry;
}

export function getRuntimeExecutiveWorkspaceExperienceOrchestrationInvariants():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS {
  return RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS;
}

export const runtimeExecutiveWorkspaceExperienceOrchestrationApiNames =
  Object.freeze([
    "getRuntimeExecutiveWorkspaceExperienceOrchestrationIdentity",
    "getRuntimeExecutiveWorkspaceExperienceOrchestrationRegistry",
    "getRuntimeExecutiveWorkspaceExperienceOrchestrationGuarantees",
    "getRuntimeExecutiveWorkspaceExperienceOrchestrationInvariants",
    "isRuntimeExecutiveWorkspaceExperienceOrchestrationStatus",
    "isRuntimeExecutiveWorkspaceExperienceOrchestrationReason",
    "isRuntimeExecutiveWorkspaceExperiencePipelineStage",
    "isRuntimeExecutiveWorkspaceExperienceRequest",
    "isRuntimeExecutiveWorkspaceExperienceSnapshot",
    "isRuntimeExecutiveWorkspaceExperienceOrchestrationResult",
    "deriveRuntimeExecutiveWorkspaceExperienceSnapshot",
    "createRuntimeExecutiveWorkspaceExperienceSnapshot",
    "orchestrateRuntimeExecutiveWorkspaceExperience",
    "orchestrateRuntimeExecutiveWorkspaceExperienceFromDialRequest",
    "verifyRuntimeExecutiveWorkspaceExperienceOrchestration",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveWorkspaceExperienceOrchestrationStatus",
    "RuntimeExecutiveWorkspaceExperienceOrchestrationReason",
    "RuntimeExecutiveWorkspaceExperiencePipelineStage",
    "RuntimeExecutiveWorkspaceExperienceUpstreamCapability",
    "RuntimeExecutiveWorkspaceExperienceRequest",
    "RuntimeExecutiveWorkspaceExperienceSnapshot",
    "RuntimeExecutiveWorkspaceExperienceOrchestrationInput",
    "RuntimeExecutiveWorkspaceExperienceOrchestrationTraceEntry",
    "RuntimeExecutiveWorkspaceExperienceOrchestrationTrace",
    "RuntimeExecutiveWorkspaceExperienceOrchestrationResult",
    "RuntimeExecutiveWorkspaceExperienceOrchestrationInvariant",
    "RuntimeExecutiveWorkspaceExperienceOrchestrationVerification",
  ] as const);

export const runtimeExecutiveWorkspaceExperienceOrchestrationRegistry =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperienceOrchestrationIdentity,
    version: runtimeExecutiveWorkspaceExperienceOrchestrationVersion,
    namespace: runtimeExecutiveWorkspaceExperienceOrchestrationNamespace,
    layer: runtimeExecutiveWorkspaceExperienceOrchestrationLayer,
    capability: runtimeExecutiveWorkspaceExperienceOrchestrationCapability,
    phase: runtimeExecutiveWorkspaceExperienceOrchestrationPhase,
    status: runtimeExecutiveWorkspaceExperienceOrchestrationStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceOrchestrationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperienceOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperienceOrchestrationSupportedImportPath,
    sections:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REGISTRY_SECTIONS
        .length,
    statuses: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
    statusCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES.length,
    reasons: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS,
    reasonCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS.length,
    pipelineStages: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES,
    pipelineStageCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES.length,
    upstreamCapabilities:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_UPSTREAM_CAPABILITIES,
    upstreamCapabilityCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_UPSTREAM_CAPABILITIES.length,
    bootstrapDefaults:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_BOOTSTRAP_DEFAULTS,
    guarantees: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_GUARANTEES,
    guaranteeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_GUARANTEES.length,
    invariants:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS,
    invariantCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS.length,
    publicTypes:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES
        .length,
    publicApis: runtimeExecutiveWorkspaceExperienceOrchestrationApiNames,
    publicApiCount:
      runtimeExecutiveWorkspaceExperienceOrchestrationApiNames.length,
  });

export const runtimeExecutiveWorkspaceExperienceOrchestration = Object.freeze({
  phase: "ExperienceOrchestration" as const,
  name: "RuntimeExecutiveWorkspaceExperienceOrchestration" as const,
  identity: runtimeExecutiveWorkspaceExperienceOrchestrationIdentity,
  version: runtimeExecutiveWorkspaceExperienceOrchestrationVersion,
  namespace: runtimeExecutiveWorkspaceExperienceOrchestrationNamespace,
  layer: runtimeExecutiveWorkspaceExperienceOrchestrationLayer,
  capability: runtimeExecutiveWorkspaceExperienceOrchestrationCapability,
  architecturalRole:
    runtimeExecutiveWorkspaceExperienceOrchestrationArchitecturalRole,
  role: "ExperienceOrchestration" as const,
  status: runtimeExecutiveWorkspaceExperienceOrchestrationStatus,
  upstreamDependency:
    runtimeExecutiveWorkspaceExperienceOrchestrationDependencyIdentity,
  dependencyPath:
    runtimeExecutiveWorkspaceExperienceOrchestrationDependencyPath,
  supportedImportPath:
    runtimeExecutiveWorkspaceExperienceOrchestrationSupportedImportPath,
  deterministic:
    runtimeExecutiveWorkspaceExperienceOrchestrationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  timerFree: true as const,
  plainData: true as const,
  serializableFriendly: true as const,
  rendererIndependent: true as const,
  dialGeometryIndependent: true as const,
  cockpitLayoutIndependent: true as const,
  automotiveStylingIndependent: true as const,
  animationTimingIndependent: true as const,
  nonLinearTransitionCapable: true as const,
  sameWorkspaceContextCapable: true as const,
  presentationStateIndependent: true as const,
  dialIsControlSource: true as const,
  principle: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_BOUNDARY,
  separation: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_SEPARATION,
  statuses: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
  reasons: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS,
  pipelineStages: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES,
  upstreamCapabilities:
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_UPSTREAM_CAPABILITIES,
  bootstrapDefaults: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_BOOTSTRAP_DEFAULTS,
  guarantees: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_GUARANTEES,
  invariants: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_FORBIDDEN_RESPONSIBILITIES,
  publicTypeNames:
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveWorkspaceExperienceOrchestrationApiNames,
  registry: runtimeExecutiveWorkspaceExperienceOrchestrationRegistry,
  transitionBoundary: "REX-6:5-transition-orchestration-only" as const,
  architecturalStatus:
    "REX-6:6 Runtime Executive Workspace Experience Orchestration — ExperienceOrchestrationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceExperienceOrchestrationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveWorkspaceExperienceOrchestrationIdentity;
  readonly version: typeof runtimeExecutiveWorkspaceExperienceOrchestrationVersion;
  readonly namespace: typeof runtimeExecutiveWorkspaceExperienceOrchestrationNamespace;
  readonly phase: typeof runtimeExecutiveWorkspaceExperienceOrchestrationPhase;
  readonly architecturalRole: typeof runtimeExecutiveWorkspaceExperienceOrchestrationArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveWorkspaceExperienceOrchestrationDependencyIdentity;
  readonly statusCount: number;
  readonly reasonCount: number;
  readonly pipelineStageCount: number;
  readonly upstreamCapabilityCount: number;
  readonly invariantCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly transitionBoundaryIntact: boolean;
  readonly pipelineOrderExact: boolean;
  readonly bootstrapDefaultsExact: boolean;
  readonly upstreamTransitionOk: boolean;
  readonly nonLinearTransitionCapable: boolean;
  readonly sameWorkspaceContextCapable: boolean;
  readonly presentationStateIndependent: boolean;
}

function exactOrder<T>(actual: readonly T[], expected: readonly T[]): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

export function verifyRuntimeExecutiveWorkspaceExperienceOrchestration():
  RuntimeExecutiveWorkspaceExperienceOrchestrationVerification {
  const runtimeModule = runtimeExecutiveWorkspaceExperienceOrchestration;
  const upstream = verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration();

  const pipelineOrderExact = exactOrder(
    [...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES],
    [
      "request",
      "context-resolution",
      "surface-composition",
      "transition-orchestration",
      "snapshot",
      "complete",
    ],
  );

  const bootstrapDefaultsExact =
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_BOOTSTRAP_DEFAULTS.workspace ===
      "overview" &&
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_BOOTSTRAP_DEFAULTS.intent ===
      "observe";

  const surfaceCountExact =
    RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.length === 4 &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES], [
      "stage",
      "advisor",
      "insight",
      "action",
    ]);

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
    ) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_UPSTREAM_CAPABILITIES,
    ) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS,
    ) &&
    Object.isFrozen(runtimeExecutiveWorkspaceExperienceOrchestrationRegistry) &&
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS.every(
      (entry) => Object.isFrozen(entry),
    );

  const invariantIds = new Set(
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS.map(
      (entry) => entry.id,
    ),
  );

  const ok =
    runtimeModule.identity ===
      "REX-6:6/RuntimeExecutiveWorkspaceExperienceOrchestration" &&
    runtimeModule.version === "6.6.0" &&
    runtimeModule.namespace === "nexora.rex.workspace-experience.orchestration" &&
    runtimeModule.phase === "ExperienceOrchestration" &&
    runtimeModule.architecturalRole ===
      "RuntimeExecutiveWorkspaceExperienceOrchestration" &&
    runtimeModule.upstreamDependency ===
      "REX-6:5/RuntimeExecutiveWorkspaceTransitionDialOrchestration" &&
    upstream.ok &&
    pipelineOrderExact &&
    bootstrapDefaultsExact &&
    surfaceCountExact &&
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES.length ===
      3 &&
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS.length === 5 &&
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES.length === 6 &&
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_UPSTREAM_CAPABILITIES.length === 5 &&
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS.length ===
      34 &&
    invariantIds.size ===
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS.length &&
    frozen &&
    runtimeModule.boundary.duplicatesContextPolicy === false &&
    runtimeModule.boundary.duplicatesCompositionPolicy === false &&
    runtimeModule.boundary.duplicatesTransitionPolicy === false &&
    runtimeModule.boundary.introducesUi === false &&
    runtimeModule.boundary.introducesTimers === false &&
    runtimeModule.nonLinearTransitionCapable &&
    runtimeModule.sameWorkspaceContextCapable &&
    runtimeModule.presentationStateIndependent;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveWorkspaceExperienceOrchestrationIdentity,
    version: runtimeExecutiveWorkspaceExperienceOrchestrationVersion,
    namespace: runtimeExecutiveWorkspaceExperienceOrchestrationNamespace,
    phase: runtimeExecutiveWorkspaceExperienceOrchestrationPhase,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceOrchestrationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceOrchestrationDependencyIdentity,
    statusCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES.length,
    reasonCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REASONS.length,
    pipelineStageCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES.length,
    upstreamCapabilityCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_UPSTREAM_CAPABILITIES.length,
    invariantCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_INVARIANTS.length,
    guaranteeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_GUARANTEES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_REGISTRY_SECTIONS
        .length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES
        .length,
    publicApiCount:
      runtimeExecutiveWorkspaceExperienceOrchestrationApiNames.length,
    frozen,
    transitionBoundaryIntact:
      runtimeModule.transitionBoundary === "REX-6:5-transition-orchestration-only",
    pipelineOrderExact,
    bootstrapDefaultsExact,
    upstreamTransitionOk: upstream.ok,
    nonLinearTransitionCapable: runtimeModule.nonLinearTransitionCapable,
    sameWorkspaceContextCapable: runtimeModule.sameWorkspaceContextCapable,
    presentationStateIndependent: runtimeModule.presentationStateIndependent,
  });
}
