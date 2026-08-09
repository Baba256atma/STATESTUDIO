/**
 * REX-6:1 — Runtime Executive Workspace Experience Foundation.
 *
 * Establishes the canonical deterministic foundation for composing Nexora’s
 * runtime-enabled executive experiences into coherent executive workspaces:
 * vocabulary, identities, workspace kinds, lifecycle concepts, surface roles,
 * transition concepts, and foundational invariants.
 *
 * Canonical flow:
 *   REX-5:9 Public Index → REX-6:1 Runtime Executive Workspace Experience Foundation
 *
 * An Executive Workspace is the executive context that coordinates Stage,
 * Advisor, Insight, and Action into one coherent working environment.
 * It is not another independent surface, not a second runtime engine, and
 * does not own NexoraObject business truth.
 *
 * Foundation only. No UI, dial graphics, React, Three.js/R3F, animations,
 * persistence, routing, orchestration, or business workflow behavior.
 *
 * Architectural separation (mandatory):
 *   REX-6 defines WHAT workspace experience means
 *     → Runtime orchestration determines WHAT should happen
 *       → Executive Cockpit determines HOW it is experienced
 *         → Three.js / R3F / UI determines HOW it is rendered
 */

import {
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  runtimeExecutiveActionExperiencePublicIndexIdentity,
  runtimeExecutiveActionExperiencePublicIndexSupportedImportPath,
  runtimeExecutiveActionExperiencePublicIndexVersion,
  verifyRuntimeExecutiveActionExperiencePublicIndex,
} from "@/app/lib/rex/runtimeExecutiveActionExperiencePublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceExperienceFoundationIdentity =
  "REX-6:1/RuntimeExecutiveWorkspaceExperienceFoundation" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationVersion =
  "6.1.0" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationNamespace =
  "nexora.rex.workspace-experience.foundation" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationLayer =
  "REX" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationCapability =
  "RuntimeExecutiveWorkspaceExperience" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationPhase =
  "Foundation" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationStatus =
  "FoundationReady" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationArchitecturalRole =
  "RuntimeExecutiveWorkspaceExperienceFoundation" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationDependencyIdentity =
  runtimeExecutiveActionExperiencePublicIndexIdentity;

export const runtimeExecutiveWorkspaceExperienceFoundationDependencyPath =
  runtimeExecutiveActionExperiencePublicIndexSupportedImportPath;

/** Sole supported import path for REX-6 consumers of this foundation. */
export const runtimeExecutiveWorkspaceExperienceFoundationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceFoundation" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationStability =
  "FoundationReady" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationDeterministic =
  true as const;

export const runtimeExecutiveWorkspaceExperienceFoundationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveWorkspaceExperienceFoundationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperienceFoundationIdentity,
    version: runtimeExecutiveWorkspaceExperienceFoundationVersion,
    namespace: runtimeExecutiveWorkspaceExperienceFoundationNamespace,
    layer: runtimeExecutiveWorkspaceExperienceFoundationLayer,
    capability: runtimeExecutiveWorkspaceExperienceFoundationCapability,
    phase: runtimeExecutiveWorkspaceExperienceFoundationPhase,
    status: runtimeExecutiveWorkspaceExperienceFoundationStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperienceFoundationDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperienceFoundationSupportedImportPath,
    upstreamVersion: runtimeExecutiveActionExperiencePublicIndexVersion,
    stabilityStatus:
      runtimeExecutiveWorkspaceExperienceFoundationStability,
    deterministicStatus:
      runtimeExecutiveWorkspaceExperienceFoundationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveWorkspaceExperienceFoundationSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveWorkspaceExperienceFoundationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_PRINCIPLE =
  "A Runtime Executive Workspace coordinates Stage, Advisor, Insight, and Action into one coherent executive context — it does not own NexoraObject business truth, is not a second runtime engine, and is independent of selector UI and visual styling." as const;

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  workspaceAuthority: "REX-6:1" as const,
  architecturalRole:
    "RuntimeExecutiveWorkspaceExperienceFoundation" as const,
  soleImmediateDependency:
    "REX-5:9/RuntimeExecutiveActionExperiencePublicIndex" as const,
  consumesPublicIndexOnly: true as const,
  importsRex5InternalDirectly: false as const,
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
  themeIndependent: true as const,
  duplicatesStageBehavior: false as const,
  duplicatesAdvisorBehavior: false as const,
  duplicatesInsightBehavior: false as const,
  duplicatesActionBehavior: false as const,
  introducesRendering: false as const,
  introducesOrchestration: false as const,
  introducesWorkspaceDial: false as const,
  introducesPersistence: false as const,
  introducesRouting: false as const,
  introducesUiBehavior: false as const,
  introducesExternalIntegration: false as const,
});

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_RELATIONSHIP_CHAIN =
  Object.freeze([
    "Runtime Executive Experience",
    "Stage",
    "Advisor",
    "Insight",
    "Action",
    "Executive Workspace",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_RESPONSIBILITY_SEPARATION =
  Object.freeze({
    rex61Owns:
      "What an Executive Workspace Experience means (vocabulary, kinds, lifecycle, surface roles, transition concepts)." as const,
    laterRex6Owns:
      "Contracts, context/mode resolution, surface composition, transition/dial orchestration, platform, certification." as const,
    cockpitOwns: "How the workspace is experienced (selector UI, dial, cockpit)." as const,
    rendererOwns: "How the workspace is rendered (Three.js / R3F / DOM)." as const,
    workspaceDoesNotOwnBusinessTruth: true as const,
    workspaceIsNotSecondRuntimeEngine: true as const,
    workspaceSemanticsIndependentOfSelectorUi: true as const,
    workspaceAndPresentationStateAreIndependent: true as const,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_ARCHITECTURAL_SEPARATION =
  Object.freeze({
    rex6Defines: "WHAT workspace experience means" as const,
    orchestrationDetermines: "WHAT should happen" as const,
    cockpitDetermines: "HOW it is experienced" as const,
    rendererDetermines: "HOW it is rendered" as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

/**
 * Canonical ordered Runtime Executive Workspace kinds.
 * Closed vocabulary — do not invent arbitrary kinds.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_KINDS = Object.freeze([
  "overview",
  "problem",
  "scenario",
  "decision",
  "execution",
] as const);

export type RuntimeExecutiveWorkspaceKind =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_KINDS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_KIND_SEMANTICS = Object.freeze({
  overview:
    "General executive orientation without entering a specific decision workflow." as const,
  problem:
    "Executive investigation of an issue, risk, constraint, anomaly, or opportunity." as const,
  scenario:
    "Executive exploration of possible future states, alternatives, assumptions, and consequences." as const,
  decision:
    "Executive evaluation and commitment context for choosing an action or direction." as const,
  execution:
    "Executive follow-through context for observing and acting upon an approved decision." as const,
});

/**
 * Canonical presentation states — reused exactly from REX-5:9 frozen surface.
 * Workspace and presentation state remain independent dimensions.
 * REX-6:1 does not redefine presentation-state semantics.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES;

export type RuntimeExecutiveWorkspacePresentationState =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATE_SEPARATION =
  Object.freeze({
    workspaceAnswers: "What executive context is the manager working in?" as const,
    presentationAnswers:
      "How much and what form of information should a subject currently expose?" as const,
    dimensionsIndependent: true as const,
    redefinesPresentationSemantics: false as const,
    exampleDecisionReport: Object.freeze({
      workspace: "decision" as const,
      presentation: "report" as const,
    }),
    exampleExecutionOperation: Object.freeze({
      workspace: "execution" as const,
      presentation: "operation" as const,
    }),
  });

/**
 * Workspace subject kinds — references only; no domain ownership required.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS = Object.freeze([
  "workspace",
  "goal",
  "object",
  "problem",
  "scenario",
  "decision",
  "execution",
] as const);

export type RuntimeExecutiveWorkspaceSubjectKind =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS)[number];

/**
 * Runtime experience lifecycle of a workspace.
 * Semantic state only — not animation timing or UI transitions.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES = Object.freeze([
  "inactive",
  "entering",
  "active",
  "leaving",
] as const);

export type RuntimeExecutiveWorkspaceActivationState =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES)[number];

/**
 * Surfaces participating in workspace composition.
 * Each remains independently owned by its REX platform; REX-6 coordinates.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES = Object.freeze([
  "stage",
  "advisor",
  "insight",
  "action",
] as const);

export type RuntimeExecutiveWorkspaceSurfaceRole =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES)[number];

/**
 * Conceptual participation of a surface within a workspace composition.
 * Vocabulary only — actual resolution belongs to later REX-6 phases.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS =
  Object.freeze([
    "primary",
    "supporting",
    "contextual",
    "inactive",
  ] as const);

export type RuntimeExecutiveWorkspaceSurfaceParticipation =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS)[number];

/**
 * Why the executive entered or is using a workspace.
 * Describes purpose — does not execute business actions.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_INTENTS = Object.freeze([
  "observe",
  "investigate",
  "explore",
  "evaluate",
  "decide",
  "execute",
] as const);

export type RuntimeExecutiveWorkspaceIntent =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_INTENTS)[number];

/**
 * Why a workspace transition may occur.
 * Describes reason — does not decide whether a transition is allowed.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS = Object.freeze([
  "user-request",
  "runtime-guidance",
  "subject-selection",
  "action-result",
  "context-change",
  "restore",
] as const);

export type RuntimeExecutiveWorkspaceTransitionReason =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES = Object.freeze([
  "deterministic",
  "immutable",
  "renderer-independent",
  "selector-ui-independent",
  "automotive-styling-independent",
  "theme-independent",
  "side-effect-free",
  "presentation-state-independent",
  "surface-coordination-only",
  "upstream-safe",
] as const);

export type RuntimeExecutiveWorkspaceFoundationGuarantee =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_CAPABILITIES =
  Object.freeze([
    "workspace-kind-vocabulary",
    "workspace-subject-modeling",
    "workspace-context-modeling",
    "workspace-activation-modeling",
    "workspace-surface-role-vocabulary",
    "workspace-surface-participation-vocabulary",
    "workspace-intent-vocabulary",
    "workspace-transition-modeling",
    "workspace-transition-reason-vocabulary",
    "presentation-state-separation",
    "foundation-registry",
  ] as const);

export type RuntimeExecutiveWorkspaceFoundationCapability =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "WorkspaceKinds",
    "SubjectKinds",
    "ActivationStates",
    "SurfaceRoles",
    "SurfaceParticipations",
    "Intents",
    "TransitionReasons",
    "PresentationStates",
    "Invariants",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveWorkspaceFoundationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_REGISTRY_SECTIONS)[number];

// ─── Domain contracts ───────────────────────────────────────────────────────

/**
 * Reference-oriented workspace subject.
 * Does not require actual domain objects to exist.
 */
export interface RuntimeExecutiveWorkspaceSubject {
  readonly kind: RuntimeExecutiveWorkspaceSubjectKind;
  readonly id: string;
  readonly label?: string;
  readonly referenceId?: string;
}

/**
 * Opaque executive focus reference within a workspace.
 * Reference only — does not embed Stage/Advisor focus engines.
 */
export interface RuntimeExecutiveWorkspaceFocusReference {
  readonly id: string;
  readonly kind?: RuntimeExecutiveWorkspaceSubjectKind;
  readonly label?: string;
}

/**
 * Deterministic, immutable-friendly workspace context for later orchestration.
 * Framework-independent plain data — no React/framework state.
 */
export interface RuntimeExecutiveWorkspaceContext {
  readonly kind: RuntimeExecutiveWorkspaceKind;
  readonly subject: RuntimeExecutiveWorkspaceSubject;
  readonly intent: RuntimeExecutiveWorkspaceIntent;
  readonly focus: RuntimeExecutiveWorkspaceFocusReference;
  readonly presentationState: RuntimeExecutiveWorkspacePresentationState;
  readonly activationState: RuntimeExecutiveWorkspaceActivationState;
}

/**
 * Runtime Executive Workspace — executive coordination context.
 * Coordinates presentation and executive interaction around Nexora truth;
 * does not own that truth and is not a second runtime engine.
 */
export interface RuntimeExecutiveWorkspace {
  readonly workspaceId: string;
  readonly kind: RuntimeExecutiveWorkspaceKind;
  readonly subject: RuntimeExecutiveWorkspaceSubject;
  readonly intent: RuntimeExecutiveWorkspaceIntent;
  readonly focus: RuntimeExecutiveWorkspaceFocusReference;
  readonly presentationState: RuntimeExecutiveWorkspacePresentationState;
  readonly activationState: RuntimeExecutiveWorkspaceActivationState;
  readonly label?: string;
  readonly summary?: string;
  readonly orderKey?: string;
  readonly foundationIdentity: typeof runtimeExecutiveWorkspaceExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeExecutiveWorkspaceExperienceFoundationVersion;
}

/**
 * Semantic movement from one executive workspace context to another.
 * Not restricted to a linear Problem→Scenario→Decision→Execution path.
 * Foundation model only — no transition orchestration in REX-6:1.
 */
export interface RuntimeExecutiveWorkspaceTransition {
  readonly from: RuntimeExecutiveWorkspaceContext;
  readonly to: RuntimeExecutiveWorkspaceContext;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly note?: string;
}

/**
 * Declarative surface participation entry (vocabulary carrier).
 * Resolution belongs to later REX-6 phases.
 */
export interface RuntimeExecutiveWorkspaceSurfaceParticipationEntry {
  readonly role: RuntimeExecutiveWorkspaceSurfaceRole;
  readonly participation: RuntimeExecutiveWorkspaceSurfaceParticipation;
}

export interface RuntimeExecutiveWorkspaceFoundationIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveWorkspaceFoundationValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveWorkspaceFoundationIssue>;
}

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "workspace-kinds-unique",
    order: 1,
    statement: "Workspace kinds are unique within the closed canonical vocabulary.",
  }),
  Object.freeze({
    id: "workspace-ordering-deterministic",
    order: 2,
    statement:
      "Workspace kind ordering is deterministic: overview, problem, scenario, decision, execution.",
  }),
  Object.freeze({
    id: "workspace-kinds-non-empty",
    order: 3,
    statement: "Workspace kinds vocabulary is non-empty.",
  }),
  Object.freeze({
    id: "surface-roles-unique",
    order: 4,
    statement: "Surface roles are unique within the closed canonical vocabulary.",
  }),
  Object.freeze({
    id: "surface-roles-deterministic",
    order: 5,
    statement:
      "Surface role ordering is deterministic: stage, advisor, insight, action.",
  }),
  Object.freeze({
    id: "executive-intents-unique",
    order: 6,
    statement: "Executive intents are unique within the closed canonical vocabulary.",
  }),
  Object.freeze({
    id: "activation-states-unique",
    order: 7,
    statement: "Activation states are unique within the closed canonical vocabulary.",
  }),
  Object.freeze({
    id: "transition-reasons-unique",
    order: 8,
    statement:
      "Transition reasons are unique within the closed canonical vocabulary.",
  }),
  Object.freeze({
    id: "workspace-presentation-state-separated",
    order: 9,
    statement:
      "Workspace and presentation state remain independent dimensions; REX-6 does not redefine presentation semantics.",
  }),
  Object.freeze({
    id: "workspace-subjects-are-references",
    order: 10,
    statement:
      "Workspace subjects are references rather than owned domain entities.",
  }),
  Object.freeze({
    id: "workspace-selection-ui-independent",
    order: 11,
    statement:
      "Workspace selection is UI-independent; semantics are not bound to dial, cockpit, mouse, voice, or any selector.",
  }),
  Object.freeze({
    id: "no-automotive-styling-dependency",
    order: 12,
    statement:
      "Workspace semantics contain no automotive styling dependency (Cadillac/Porsche/dial metaphor).",
  }),
  Object.freeze({
    id: "does-not-duplicate-stage",
    order: 13,
    statement: "REX-6 does not duplicate Stage behavior.",
  }),
  Object.freeze({
    id: "does-not-duplicate-advisor",
    order: 14,
    statement: "REX-6 does not duplicate Advisor behavior.",
  }),
  Object.freeze({
    id: "does-not-duplicate-insight",
    order: 15,
    statement: "REX-6 does not duplicate Insight behavior.",
  }),
  Object.freeze({
    id: "does-not-duplicate-action",
    order: 16,
    statement: "REX-6 does not duplicate Action behavior.",
  }),
  Object.freeze({
    id: "foundation-deterministic",
    order: 17,
    statement:
      "Foundation behavior is deterministic: same input produces the same output with no side effects.",
  }),
  Object.freeze({
    id: "canonical-definitions-mutation-safe",
    order: 18,
    statement:
      "Canonical definitions are mutation-safe; consumers cannot corrupt foundation vocabularies.",
  }),
]);

export type RuntimeExecutiveWorkspaceFoundationInvariant =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "workspace-ui",
    "workspace-dial-ui",
    "cadillac-style-control",
    "porsche-style-control",
    "three-js-behavior",
    "react-three-fiber-behavior",
    "stage-rendering",
    "camera-transitions",
    "scene-color-mapping",
    "animations",
    "react-components",
    "advisor-content-generation",
    "insight-generation",
    "action-execution",
    "business-workflow",
    "persistence",
    "routing",
    "api-communication",
    "mobile-ui",
    "external-messaging",
    "jira-integration",
    "database-integration",
  ] as const);

// ─── Internal helpers ───────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
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

function requireOpaqueId(value: string, field: string): string {
  if (!isNonEmptyString(value)) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
  return value;
}

function trimText(value: string): string {
  return value.trim();
}

function normalizeOptionalText(
  value: string | undefined,
  field: string,
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new TypeError(`${field} must be a string when provided`);
  }
  const trimmed = trimText(value);
  return trimmed.length > 0 ? trimmed : undefined;
}

function issue(
  code: string,
  message: string,
  path?: string,
): RuntimeExecutiveWorkspaceFoundationIssue {
  return Object.freeze(
    path === undefined ? { code, message } : { code, message, path },
  );
}

// ─── Vocabulary predicates ──────────────────────────────────────────────────

export function isRuntimeExecutiveWorkspaceKind(
  value: unknown,
): value is RuntimeExecutiveWorkspaceKind {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceSubjectKind(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSubjectKind {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceActivationState(
  value: unknown,
): value is RuntimeExecutiveWorkspaceActivationState {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceSurfaceRole(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSurfaceRole {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceSurfaceParticipation(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSurfaceParticipation {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceIntent(
  value: unknown,
): value is RuntimeExecutiveWorkspaceIntent {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_INTENTS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceTransitionReason(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionReason {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspacePresentationState(
  value: unknown,
): value is RuntimeExecutiveWorkspacePresentationState {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceFoundationGuarantee(
  value: unknown,
): value is RuntimeExecutiveWorkspaceFoundationGuarantee {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceFoundationCapability(
  value: unknown,
): value is RuntimeExecutiveWorkspaceFoundationCapability {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_CAPABILITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceFoundationIdentity(
  value: unknown,
): value is typeof runtimeExecutiveWorkspaceExperienceFoundationIdentity {
  return (
    value === runtimeExecutiveWorkspaceExperienceFoundationIdentity
  );
}

// ─── Lightweight constructors / normalizers ─────────────────────────────────

export function createRuntimeExecutiveWorkspaceId(input: {
  readonly key: string;
}): string {
  const key = requireOpaqueId(trimText(input.key), "key");
  return `workspace.${key}`;
}

export function createRuntimeExecutiveWorkspaceSubject(input: {
  readonly kind: RuntimeExecutiveWorkspaceSubjectKind;
  readonly id: string;
  readonly label?: string;
  readonly referenceId?: string;
}): RuntimeExecutiveWorkspaceSubject {
  if (!isRuntimeExecutiveWorkspaceSubjectKind(input.kind)) {
    throw new TypeError("kind must be a known workspace subject kind");
  }
  return Object.freeze({
    kind: input.kind,
    id: requireOpaqueId(trimText(input.id), "id"),
    ...(normalizeOptionalText(input.label, "label") !== undefined
      ? { label: normalizeOptionalText(input.label, "label") }
      : {}),
    ...(normalizeOptionalText(input.referenceId, "referenceId") !== undefined
      ? {
          referenceId: normalizeOptionalText(input.referenceId, "referenceId"),
        }
      : {}),
  });
}

export function createRuntimeExecutiveWorkspaceFocusReference(input: {
  readonly id: string;
  readonly kind?: RuntimeExecutiveWorkspaceSubjectKind;
  readonly label?: string;
}): RuntimeExecutiveWorkspaceFocusReference {
  if (
    input.kind !== undefined &&
    !isRuntimeExecutiveWorkspaceSubjectKind(input.kind)
  ) {
    throw new TypeError("kind must be a known workspace subject kind when provided");
  }
  return Object.freeze({
    id: requireOpaqueId(trimText(input.id), "id"),
    ...(input.kind !== undefined ? { kind: input.kind } : {}),
    ...(normalizeOptionalText(input.label, "label") !== undefined
      ? { label: normalizeOptionalText(input.label, "label") }
      : {}),
  });
}

export function createRuntimeExecutiveWorkspaceContext(input: {
  readonly kind: RuntimeExecutiveWorkspaceKind;
  readonly subject: RuntimeExecutiveWorkspaceSubject;
  readonly intent: RuntimeExecutiveWorkspaceIntent;
  readonly focus: RuntimeExecutiveWorkspaceFocusReference;
  readonly presentationState: RuntimeExecutiveWorkspacePresentationState;
  readonly activationState: RuntimeExecutiveWorkspaceActivationState;
}): RuntimeExecutiveWorkspaceContext {
  if (!isRuntimeExecutiveWorkspaceKind(input.kind)) {
    throw new TypeError("kind must be a known workspace kind");
  }
  if (!isRuntimeExecutiveWorkspaceIntent(input.intent)) {
    throw new TypeError("intent must be a known workspace intent");
  }
  if (!isRuntimeExecutiveWorkspacePresentationState(input.presentationState)) {
    throw new TypeError(
      "presentationState must be a known presentation state (minimum, report, or operation)",
    );
  }
  if (!isRuntimeExecutiveWorkspaceActivationState(input.activationState)) {
    throw new TypeError("activationState must be a known activation state");
  }

  return Object.freeze({
    kind: input.kind,
    subject: createRuntimeExecutiveWorkspaceSubject(input.subject),
    intent: input.intent,
    focus: createRuntimeExecutiveWorkspaceFocusReference(input.focus),
    presentationState: input.presentationState,
    activationState: input.activationState,
  });
}

export function createRuntimeExecutiveWorkspace(input: {
  readonly workspaceId: string;
  readonly kind: RuntimeExecutiveWorkspaceKind;
  readonly subject: RuntimeExecutiveWorkspaceSubject;
  readonly intent: RuntimeExecutiveWorkspaceIntent;
  readonly focus: RuntimeExecutiveWorkspaceFocusReference;
  readonly presentationState: RuntimeExecutiveWorkspacePresentationState;
  readonly activationState?: RuntimeExecutiveWorkspaceActivationState;
  readonly label?: string;
  readonly summary?: string;
  readonly orderKey?: string;
}): RuntimeExecutiveWorkspace {
  const context = createRuntimeExecutiveWorkspaceContext({
    kind: input.kind,
    subject: input.subject,
    intent: input.intent,
    focus: input.focus,
    presentationState: input.presentationState,
    activationState: input.activationState ?? "inactive",
  });

  return Object.freeze({
    workspaceId: requireOpaqueId(trimText(input.workspaceId), "workspaceId"),
    kind: context.kind,
    subject: context.subject,
    intent: context.intent,
    focus: context.focus,
    presentationState: context.presentationState,
    activationState: context.activationState,
    ...(normalizeOptionalText(input.label, "label") !== undefined
      ? { label: normalizeOptionalText(input.label, "label") }
      : {}),
    ...(normalizeOptionalText(input.summary, "summary") !== undefined
      ? { summary: normalizeOptionalText(input.summary, "summary") }
      : {}),
    ...(normalizeOptionalText(input.orderKey, "orderKey") !== undefined
      ? { orderKey: normalizeOptionalText(input.orderKey, "orderKey") }
      : {}),
    foundationIdentity: runtimeExecutiveWorkspaceExperienceFoundationIdentity,
    foundationVersion: runtimeExecutiveWorkspaceExperienceFoundationVersion,
  });
}

export function createRuntimeExecutiveWorkspaceTransition(input: {
  readonly from: RuntimeExecutiveWorkspaceContext;
  readonly to: RuntimeExecutiveWorkspaceContext;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly note?: string;
}): RuntimeExecutiveWorkspaceTransition {
  if (!isRuntimeExecutiveWorkspaceTransitionReason(input.reason)) {
    throw new TypeError("reason must be a known workspace transition reason");
  }

  return Object.freeze({
    from: createRuntimeExecutiveWorkspaceContext(input.from),
    to: createRuntimeExecutiveWorkspaceContext(input.to),
    reason: input.reason,
    ...(normalizeOptionalText(input.note, "note") !== undefined
      ? { note: normalizeOptionalText(input.note, "note") }
      : {}),
  });
}

export function createRuntimeExecutiveWorkspaceSurfaceParticipationEntry(input: {
  readonly role: RuntimeExecutiveWorkspaceSurfaceRole;
  readonly participation: RuntimeExecutiveWorkspaceSurfaceParticipation;
}): RuntimeExecutiveWorkspaceSurfaceParticipationEntry {
  if (!isRuntimeExecutiveWorkspaceSurfaceRole(input.role)) {
    throw new TypeError("role must be a known workspace surface role");
  }
  if (!isRuntimeExecutiveWorkspaceSurfaceParticipation(input.participation)) {
    throw new TypeError(
      "participation must be a known workspace surface participation",
    );
  }
  return Object.freeze({
    role: input.role,
    participation: input.participation,
  });
}

export function normalizeRuntimeExecutiveWorkspaceSubject(
  value: RuntimeExecutiveWorkspaceSubject,
): RuntimeExecutiveWorkspaceSubject {
  return createRuntimeExecutiveWorkspaceSubject(value);
}

export function normalizeRuntimeExecutiveWorkspaceContext(
  value: RuntimeExecutiveWorkspaceContext,
): RuntimeExecutiveWorkspaceContext {
  return createRuntimeExecutiveWorkspaceContext(value);
}

export function normalizeRuntimeExecutiveWorkspace(
  value: RuntimeExecutiveWorkspace,
): RuntimeExecutiveWorkspace {
  return createRuntimeExecutiveWorkspace({
    workspaceId: value.workspaceId,
    kind: value.kind,
    subject: value.subject,
    intent: value.intent,
    focus: value.focus,
    presentationState: value.presentationState,
    activationState: value.activationState,
    label: value.label,
    summary: value.summary,
    orderKey: value.orderKey,
  });
}

export function normalizeRuntimeExecutiveWorkspaceTransition(
  value: RuntimeExecutiveWorkspaceTransition,
): RuntimeExecutiveWorkspaceTransition {
  return createRuntimeExecutiveWorkspaceTransition(value);
}

/**
 * Lightweight structural validation for workspace context.
 * Not the full REX-6 validation platform.
 */
export function validateRuntimeExecutiveWorkspaceContext(
  value: unknown,
): RuntimeExecutiveWorkspaceFoundationValidationResult {
  const issues: RuntimeExecutiveWorkspaceFoundationIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-context", "workspace context must be a plain object"),
      ]),
    });
  }

  if (!isRuntimeExecutiveWorkspaceKind(value.kind)) {
    issues.push(
      issue("invalid-workspace-kind", "kind must be a known workspace kind", "kind"),
    );
  }
  if (!isRuntimeExecutiveWorkspaceIntent(value.intent)) {
    issues.push(
      issue("invalid-intent", "intent must be a known workspace intent", "intent"),
    );
  }
  if (!isRuntimeExecutiveWorkspacePresentationState(value.presentationState)) {
    issues.push(
      issue(
        "invalid-presentation-state",
        "presentationState must be minimum, report, or operation",
        "presentationState",
      ),
    );
  }
  if (!isRuntimeExecutiveWorkspaceActivationState(value.activationState)) {
    issues.push(
      issue(
        "invalid-activation-state",
        "activationState must be a known activation state",
        "activationState",
      ),
    );
  }
  if (!isPlainObject(value.subject)) {
    issues.push(
      issue("invalid-subject", "subject must be a plain object", "subject"),
    );
  } else {
    if (!isRuntimeExecutiveWorkspaceSubjectKind(value.subject.kind)) {
      issues.push(
        issue(
          "invalid-subject-kind",
          "subject.kind must be a known workspace subject kind",
          "subject.kind",
        ),
      );
    }
    if (!isNonEmptyString(value.subject.id)) {
      issues.push(
        issue(
          "invalid-subject-id",
          "subject.id must be a non-empty string",
          "subject.id",
        ),
      );
    }
  }
  if (!isPlainObject(value.focus)) {
    issues.push(issue("invalid-focus", "focus must be a plain object", "focus"));
  } else if (!isNonEmptyString(value.focus.id)) {
    issues.push(
      issue("invalid-focus-id", "focus.id must be a non-empty string", "focus.id"),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveWorkspaceExperienceFoundationIdentity():
  typeof runtimeExecutiveWorkspaceExperienceFoundationCanonicalIdentity {
  return runtimeExecutiveWorkspaceExperienceFoundationCanonicalIdentity;
}

export function getRuntimeExecutiveWorkspaceExperienceFoundationGuarantees():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES {
  return RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES;
}

export function getRuntimeExecutiveWorkspaceExperienceFoundationRegistry():
  typeof runtimeExecutiveWorkspaceExperienceFoundationRegistry {
  return runtimeExecutiveWorkspaceExperienceFoundationRegistry;
}

export function getRuntimeExecutiveWorkspaceExperienceFoundationInvariants():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS {
  return RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceExperienceFoundationApiNames =
  Object.freeze([
    "getRuntimeExecutiveWorkspaceExperienceFoundationIdentity",
    "getRuntimeExecutiveWorkspaceExperienceFoundationRegistry",
    "getRuntimeExecutiveWorkspaceExperienceFoundationGuarantees",
    "getRuntimeExecutiveWorkspaceExperienceFoundationInvariants",
    "isRuntimeExecutiveWorkspaceKind",
    "isRuntimeExecutiveWorkspaceSubjectKind",
    "isRuntimeExecutiveWorkspaceActivationState",
    "isRuntimeExecutiveWorkspaceSurfaceRole",
    "isRuntimeExecutiveWorkspaceSurfaceParticipation",
    "isRuntimeExecutiveWorkspaceIntent",
    "isRuntimeExecutiveWorkspaceTransitionReason",
    "isRuntimeExecutiveWorkspacePresentationState",
    "isRuntimeExecutiveWorkspaceFoundationGuarantee",
    "isRuntimeExecutiveWorkspaceFoundationCapability",
    "isRuntimeExecutiveWorkspaceFoundationIdentity",
    "createRuntimeExecutiveWorkspaceId",
    "createRuntimeExecutiveWorkspaceSubject",
    "createRuntimeExecutiveWorkspaceFocusReference",
    "createRuntimeExecutiveWorkspaceContext",
    "createRuntimeExecutiveWorkspace",
    "createRuntimeExecutiveWorkspaceTransition",
    "createRuntimeExecutiveWorkspaceSurfaceParticipationEntry",
    "normalizeRuntimeExecutiveWorkspaceSubject",
    "normalizeRuntimeExecutiveWorkspaceContext",
    "normalizeRuntimeExecutiveWorkspace",
    "normalizeRuntimeExecutiveWorkspaceTransition",
    "validateRuntimeExecutiveWorkspaceContext",
    "verifyRuntimeExecutiveWorkspaceExperienceFoundation",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveWorkspaceKind",
    "RuntimeExecutiveWorkspaceSubjectKind",
    "RuntimeExecutiveWorkspaceActivationState",
    "RuntimeExecutiveWorkspaceSurfaceRole",
    "RuntimeExecutiveWorkspaceSurfaceParticipation",
    "RuntimeExecutiveWorkspaceIntent",
    "RuntimeExecutiveWorkspaceTransitionReason",
    "RuntimeExecutiveWorkspacePresentationState",
    "RuntimeExecutiveWorkspaceFoundationGuarantee",
    "RuntimeExecutiveWorkspaceFoundationCapability",
    "RuntimeExecutiveWorkspaceFoundationRegistrySection",
    "RuntimeExecutiveWorkspaceSubject",
    "RuntimeExecutiveWorkspaceFocusReference",
    "RuntimeExecutiveWorkspaceContext",
    "RuntimeExecutiveWorkspace",
    "RuntimeExecutiveWorkspaceTransition",
    "RuntimeExecutiveWorkspaceSurfaceParticipationEntry",
    "RuntimeExecutiveWorkspaceFoundationIssue",
    "RuntimeExecutiveWorkspaceFoundationValidationResult",
    "RuntimeExecutiveWorkspaceFoundationInvariant",
    "RuntimeExecutiveWorkspaceExperienceFoundationVerification",
  ] as const);

export const runtimeExecutiveWorkspaceExperienceFoundationRegistry =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperienceFoundationIdentity,
    version: runtimeExecutiveWorkspaceExperienceFoundationVersion,
    namespace: runtimeExecutiveWorkspaceExperienceFoundationNamespace,
    layer: runtimeExecutiveWorkspaceExperienceFoundationLayer,
    capability: runtimeExecutiveWorkspaceExperienceFoundationCapability,
    phase: runtimeExecutiveWorkspaceExperienceFoundationPhase,
    status: runtimeExecutiveWorkspaceExperienceFoundationStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperienceFoundationDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperienceFoundationSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_REGISTRY_SECTIONS.length,
    workspaceKinds: RUNTIME_EXECUTIVE_WORKSPACE_KINDS,
    workspaceKindCount: RUNTIME_EXECUTIVE_WORKSPACE_KINDS.length,
    subjectKinds: RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS,
    subjectKindCount: RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS.length,
    activationStates: RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES,
    activationStateCount: RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES.length,
    surfaceRoles: RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES,
    surfaceRoleCount: RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES.length,
    surfaceParticipations: RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS,
    surfaceParticipationCount:
      RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS.length,
    intents: RUNTIME_EXECUTIVE_WORKSPACE_INTENTS,
    intentCount: RUNTIME_EXECUTIVE_WORKSPACE_INTENTS.length,
    transitionReasons: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS,
    transitionReasonCount: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS.length,
    presentationStates: RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES,
    presentationStateCount:
      RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES.length,
    guarantees: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES,
    guaranteeCount: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES.length,
    capabilities: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_CAPABILITIES,
    capabilityCount: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_CAPABILITIES.length,
    invariants: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS.length,
    publicTypes: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveWorkspaceExperienceFoundationApiNames,
    publicApiCount:
      runtimeExecutiveWorkspaceExperienceFoundationApiNames.length,
    relationshipChain: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_RELATIONSHIP_CHAIN,
  });

export const runtimeExecutiveWorkspaceExperienceFoundation = Object.freeze({
  phase: "Foundation" as const,
  name: "RuntimeExecutiveWorkspaceExperienceFoundation" as const,
  identity: runtimeExecutiveWorkspaceExperienceFoundationIdentity,
  version: runtimeExecutiveWorkspaceExperienceFoundationVersion,
  namespace: runtimeExecutiveWorkspaceExperienceFoundationNamespace,
  layer: runtimeExecutiveWorkspaceExperienceFoundationLayer,
  capability: runtimeExecutiveWorkspaceExperienceFoundationCapability,
  architecturalRole:
    runtimeExecutiveWorkspaceExperienceFoundationArchitecturalRole,
  role: "Foundation" as const,
  status: runtimeExecutiveWorkspaceExperienceFoundationStatus,
  upstreamDependency:
    runtimeExecutiveWorkspaceExperienceFoundationDependencyIdentity,
  dependencyPath:
    runtimeExecutiveWorkspaceExperienceFoundationDependencyPath,
  supportedImportPath:
    runtimeExecutiveWorkspaceExperienceFoundationSupportedImportPath,
  deterministic: runtimeExecutiveWorkspaceExperienceFoundationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  selectorUiIndependent: true as const,
  automotiveStylingIndependent: true as const,
  themeIndependent: true as const,
  presentationStateIndependent: true as const,
  surfaceCoordinationOnly: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_BOUNDARY,
  responsibilitySeparation:
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_RESPONSIBILITY_SEPARATION,
  architecturalSeparation:
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_ARCHITECTURAL_SEPARATION,
  workspaceKinds: RUNTIME_EXECUTIVE_WORKSPACE_KINDS,
  subjectKinds: RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS,
  activationStates: RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES,
  surfaceRoles: RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES,
  surfaceParticipations: RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS,
  intents: RUNTIME_EXECUTIVE_WORKSPACE_INTENTS,
  transitionReasons: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS,
  presentationStates: RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES,
  guarantees: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES,
  capabilities: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_CAPABILITIES,
  invariants: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_FORBIDDEN_RESPONSIBILITIES,
  relationshipChain: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_RELATIONSHIP_CHAIN,
  publicTypeNames: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveWorkspaceExperienceFoundationApiNames,
  registry: runtimeExecutiveWorkspaceExperienceFoundationRegistry,
  publicIndexBoundary: "REX-5:9-public-index-only" as const,
  architecturalStatus:
    "REX-6:1 Runtime Executive Workspace Experience Foundation — FoundationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceExperienceFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveWorkspaceExperienceFoundationIdentity;
  readonly version: typeof runtimeExecutiveWorkspaceExperienceFoundationVersion;
  readonly namespace: typeof runtimeExecutiveWorkspaceExperienceFoundationNamespace;
  readonly layer: typeof runtimeExecutiveWorkspaceExperienceFoundationLayer;
  readonly capability: typeof runtimeExecutiveWorkspaceExperienceFoundationCapability;
  readonly phase: typeof runtimeExecutiveWorkspaceExperienceFoundationPhase;
  readonly status: typeof runtimeExecutiveWorkspaceExperienceFoundationStatus;
  readonly architecturalRole: typeof runtimeExecutiveWorkspaceExperienceFoundationArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveWorkspaceExperienceFoundationDependencyIdentity;
  readonly workspaceKindCount: number;
  readonly subjectKindCount: number;
  readonly activationStateCount: number;
  readonly surfaceRoleCount: number;
  readonly surfaceParticipationCount: number;
  readonly intentCount: number;
  readonly transitionReasonCount: number;
  readonly presentationStateCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly publicIndexBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly selectorUiIndependent: boolean;
  readonly automotiveStylingIndependent: boolean;
  readonly themeIndependent: boolean;
  readonly presentationStateSeparated: boolean;
  readonly upstreamConsumerEntryOk: boolean;
  readonly doesNotDuplicateSurfaces: boolean;
}

export function verifyRuntimeExecutiveWorkspaceExperienceFoundation():
  RuntimeExecutiveWorkspaceExperienceFoundationVerification {
  const foundationModule = runtimeExecutiveWorkspaceExperienceFoundation;
  const registry = runtimeExecutiveWorkspaceExperienceFoundationRegistry;
  const upstream = verifyRuntimeExecutiveActionExperiencePublicIndex();

  const identityOk =
    foundationModule.identity ===
      "REX-6:1/RuntimeExecutiveWorkspaceExperienceFoundation" &&
    foundationModule.version === "6.1.0" &&
    foundationModule.namespace ===
      "nexora.rex.workspace-experience.foundation" &&
    foundationModule.layer === "REX" &&
    foundationModule.capability === "RuntimeExecutiveWorkspaceExperience" &&
    foundationModule.phase === "Foundation" &&
    foundationModule.status === "FoundationReady" &&
    foundationModule.architecturalRole ===
      "RuntimeExecutiveWorkspaceExperienceFoundation" &&
    foundationModule.upstreamDependency ===
      "REX-5:9/RuntimeExecutiveActionExperiencePublicIndex" &&
    foundationModule.upstreamDependency ===
      runtimeExecutiveActionExperiencePublicIndexIdentity &&
    foundationModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveActionExperiencePublicIndex" &&
    foundationModule.publicIndexBoundary === "REX-5:9-public-index-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_KINDS], [
      "overview",
      "problem",
      "scenario",
      "decision",
      "execution",
    ]) &&
    RUNTIME_EXECUTIVE_WORKSPACE_KINDS.length > 0 &&
    unique([...RUNTIME_EXECUTIVE_WORKSPACE_KINDS]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS], [
      "workspace",
      "goal",
      "object",
      "problem",
      "scenario",
      "decision",
      "execution",
    ]) &&
    unique([...RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES], [
      "inactive",
      "entering",
      "active",
      "leaving",
    ]) &&
    unique([...RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES], [
      "stage",
      "advisor",
      "insight",
      "action",
    ]) &&
    unique([...RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS], [
      "primary",
      "supporting",
      "contextual",
      "inactive",
    ]) &&
    unique([...RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_INTENTS], [
      "observe",
      "investigate",
      "explore",
      "evaluate",
      "decide",
      "execute",
    ]) &&
    unique([...RUNTIME_EXECUTIVE_WORKSPACE_INTENTS]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS], [
      "user-request",
      "runtime-guidance",
      "subject-selection",
      "action-result",
      "context-change",
      "restore",
    ]) &&
    unique([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES], [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES], [
      "deterministic",
      "immutable",
      "renderer-independent",
      "selector-ui-independent",
      "automotive-styling-independent",
      "theme-independent",
      "side-effect-free",
      "presentation-state-independent",
      "surface-coordination-only",
      "upstream-safe",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_REGISTRY_SECTIONS],
      [
        "Identity",
        "WorkspaceKinds",
        "SubjectKinds",
        "ActivationStates",
        "SurfaceRoles",
        "SurfaceParticipations",
        "Intents",
        "TransitionReasons",
        "PresentationStates",
        "Invariants",
        "PublicAPIs",
        "Guarantees",
      ],
    );

  const countsOk =
    registry.workspaceKindCount === RUNTIME_EXECUTIVE_WORKSPACE_KINDS.length &&
    registry.subjectKindCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS.length &&
    registry.activationStateCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES.length &&
    registry.surfaceRoleCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES.length &&
    registry.surfaceParticipationCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS.length &&
    registry.intentCount === RUNTIME_EXECUTIVE_WORKSPACE_INTENTS.length &&
    registry.transitionReasonCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS.length &&
    registry.presentationStateCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      runtimeExecutiveWorkspaceExperienceFoundationApiNames.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_PUBLIC_TYPE_NAMES.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS.length;

  const invariantsOk =
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS.length === 18 &&
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS.map((entry) => entry.id),
    );

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_INTENTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_CAPABILITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS) &&
    Object.isFrozen(
      runtimeExecutiveWorkspaceExperienceFoundationCanonicalIdentity,
    ) &&
    Object.isFrozen(runtimeExecutiveWorkspaceExperienceFoundationRegistry) &&
    Object.isFrozen(runtimeExecutiveWorkspaceExperienceFoundation);

  const presentationStateSeparated =
    RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES ===
      RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES &&
    RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATE_SEPARATION
      .dimensionsIndependent === true &&
    RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATE_SEPARATION
      .redefinesPresentationSemantics === false &&
    RUNTIME_EXECUTIVE_WORKSPACE_KINDS !==
      (RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES as unknown);

  const doesNotDuplicateSurfaces =
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_BOUNDARY.duplicatesStageBehavior ===
      false &&
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_BOUNDARY.duplicatesAdvisorBehavior ===
      false &&
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_BOUNDARY.duplicatesInsightBehavior ===
      false &&
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_BOUNDARY.duplicatesActionBehavior ===
      false &&
    RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_BOUNDARY.introducesWorkspaceDial ===
      false;

  const ok =
    identityOk &&
    vocabOk &&
    countsOk &&
    invariantsOk &&
    frozen &&
    foundationModule.rendererIndependent === true &&
    foundationModule.selectorUiIndependent === true &&
    foundationModule.automotiveStylingIndependent === true &&
    foundationModule.themeIndependent === true &&
    foundationModule.publicIndexBoundary === "REX-5:9-public-index-only" &&
    upstream.valid === true &&
    upstream.readyForConsumer === true &&
    presentationStateSeparated &&
    doesNotDuplicateSurfaces;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveWorkspaceExperienceFoundationIdentity,
    version: runtimeExecutiveWorkspaceExperienceFoundationVersion,
    namespace: runtimeExecutiveWorkspaceExperienceFoundationNamespace,
    layer: runtimeExecutiveWorkspaceExperienceFoundationLayer,
    capability: runtimeExecutiveWorkspaceExperienceFoundationCapability,
    phase: runtimeExecutiveWorkspaceExperienceFoundationPhase,
    status: runtimeExecutiveWorkspaceExperienceFoundationStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceFoundationDependencyIdentity,
    workspaceKindCount: RUNTIME_EXECUTIVE_WORKSPACE_KINDS.length,
    subjectKindCount: RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS.length,
    activationStateCount: RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES.length,
    surfaceRoleCount: RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES.length,
    surfaceParticipationCount:
      RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS.length,
    intentCount: RUNTIME_EXECUTIVE_WORKSPACE_INTENTS.length,
    transitionReasonCount: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS.length,
    presentationStateCount:
      RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES.length,
    guaranteeCount: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveWorkspaceExperienceFoundationApiNames.length,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS.length,
    frozen,
    publicIndexBoundaryIntact:
      foundationModule.publicIndexBoundary === "REX-5:9-public-index-only",
    rendererIndependent: foundationModule.rendererIndependent === true,
    selectorUiIndependent: foundationModule.selectorUiIndependent === true,
    automotiveStylingIndependent:
      foundationModule.automotiveStylingIndependent === true,
    themeIndependent: foundationModule.themeIndependent === true,
    presentationStateSeparated,
    upstreamConsumerEntryOk:
      upstream.valid === true && upstream.readyForConsumer === true,
    doesNotDuplicateSurfaces,
  });
}
