/**
 * REX-6:2 — Runtime Executive Workspace Experience Contracts.
 *
 * Formal immutable contract layer over REX-6:1 foundation vocabulary.
 * Defines how runtime components may safely communicate about Executive
 * Workspace Experience: identity, subject, focus, intent, activation,
 * presentation, surface participation, context, transitions, composition
 * requests, and experience snapshots.
 *
 * Canonical flow:
 *   REX-6:1 Foundation → REX-6:2 Contracts → later REX-6 Context & Mode Resolution
 *
 * REX-6:1 answers: What does workspace experience vocabulary mean?
 * REX-6:2 answers: What information must exist for workspace coordination?
 *
 * Contracts only. No resolution, composition algorithms, orchestration,
 * Dial behavior, UI, rendering, animations, or business workflow execution.
 *
 * Workspace Contract ≠ Workspace Policy ≠ Workspace Presentation ≠ Workspace Control
 */

import {
  RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_INTENTS,
  RUNTIME_EXECUTIVE_WORKSPACE_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS,
  isRuntimeExecutiveWorkspaceActivationState,
  isRuntimeExecutiveWorkspaceIntent,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSubjectKind,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  isRuntimeExecutiveWorkspaceTransitionReason,
  runtimeExecutiveWorkspaceExperienceFoundationIdentity,
  runtimeExecutiveWorkspaceExperienceFoundationSupportedImportPath,
  runtimeExecutiveWorkspaceExperienceFoundationVersion,
  verifyRuntimeExecutiveWorkspaceExperienceFoundation,
  type RuntimeExecutiveWorkspaceActivationState,
  type RuntimeExecutiveWorkspaceIntent,
  type RuntimeExecutiveWorkspaceKind,
  type RuntimeExecutiveWorkspacePresentationState,
  type RuntimeExecutiveWorkspaceSubjectKind,
  type RuntimeExecutiveWorkspaceSurfaceParticipation,
  type RuntimeExecutiveWorkspaceSurfaceRole,
  type RuntimeExecutiveWorkspaceTransitionReason,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceFoundation";

// ─── Transitively published Foundation surface (for REX-6:3+) ───────────────

export {
  RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_INTENTS,
  RUNTIME_EXECUTIVE_WORKSPACE_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS,
  isRuntimeExecutiveWorkspaceActivationState,
  isRuntimeExecutiveWorkspaceIntent,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSubjectKind,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  isRuntimeExecutiveWorkspaceTransitionReason,
  runtimeExecutiveWorkspaceExperienceFoundationIdentity,
  verifyRuntimeExecutiveWorkspaceExperienceFoundation,
};

export type {
  RuntimeExecutiveWorkspaceActivationState,
  RuntimeExecutiveWorkspaceIntent,
  RuntimeExecutiveWorkspaceKind,
  RuntimeExecutiveWorkspacePresentationState,
  RuntimeExecutiveWorkspaceSubjectKind,
  RuntimeExecutiveWorkspaceSurfaceParticipation,
  RuntimeExecutiveWorkspaceSurfaceRole,
  RuntimeExecutiveWorkspaceTransitionReason,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceExperienceContractsIdentity =
  "REX-6:2/RuntimeExecutiveWorkspaceExperienceContracts" as const;

export const runtimeExecutiveWorkspaceExperienceContractsVersion =
  "6.2.0" as const;

export const runtimeExecutiveWorkspaceExperienceContractsNamespace =
  "nexora.rex.workspace-experience.contracts" as const;

export const runtimeExecutiveWorkspaceExperienceContractsLayer =
  "REX" as const;

export const runtimeExecutiveWorkspaceExperienceContractsCapability =
  "RuntimeExecutiveWorkspaceExperience" as const;

export const runtimeExecutiveWorkspaceExperienceContractsPhase =
  "Contracts" as const;

export const runtimeExecutiveWorkspaceExperienceContractsStatus =
  "ContractsReady" as const;

export const runtimeExecutiveWorkspaceExperienceContractsArchitecturalRole =
  "RuntimeExecutiveWorkspaceExperienceContracts" as const;

export const runtimeExecutiveWorkspaceExperienceContractsDependencyIdentity =
  runtimeExecutiveWorkspaceExperienceFoundationIdentity;

export const runtimeExecutiveWorkspaceExperienceContractsDependencyPath =
  runtimeExecutiveWorkspaceExperienceFoundationSupportedImportPath;

export const runtimeExecutiveWorkspaceExperienceContractsSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceContracts" as const;

export const runtimeExecutiveWorkspaceExperienceContractsStability =
  "ContractsReady" as const;

export const runtimeExecutiveWorkspaceExperienceContractsDeterministic =
  true as const;

export const runtimeExecutiveWorkspaceExperienceContractsSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveWorkspaceExperienceContractsMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveWorkspaceExperienceContractsCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperienceContractsIdentity,
    version: runtimeExecutiveWorkspaceExperienceContractsVersion,
    namespace: runtimeExecutiveWorkspaceExperienceContractsNamespace,
    layer: runtimeExecutiveWorkspaceExperienceContractsLayer,
    capability: runtimeExecutiveWorkspaceExperienceContractsCapability,
    phase: runtimeExecutiveWorkspaceExperienceContractsPhase,
    status: runtimeExecutiveWorkspaceExperienceContractsStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceContractsDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperienceContractsDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperienceContractsSupportedImportPath,
    upstreamVersion: runtimeExecutiveWorkspaceExperienceFoundationVersion,
    stabilityStatus: runtimeExecutiveWorkspaceExperienceContractsStability,
    deterministicStatus:
      runtimeExecutiveWorkspaceExperienceContractsDeterministic,
    sideEffectPolicy:
      runtimeExecutiveWorkspaceExperienceContractsSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveWorkspaceExperienceContractsMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_PRINCIPLE =
  "Contracts define what information must exist for workspace experience coordination — not what the workspace should become, how surfaces compose, or how a Dial/cockpit presents the change." as const;

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  contractsAuthority: "REX-6:2" as const,
  architecturalRole:
    "RuntimeExecutiveWorkspaceExperienceContracts" as const,
  soleImmediateDependency:
    "REX-6:1/RuntimeExecutiveWorkspaceExperienceFoundation" as const,
  consumesFoundationOnly: true as const,
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
  themeIndependent: true as const,
  stageCoordinateIndependent: true as const,
  dialIndependent: true as const,
  introducesResolution: false as const,
  introducesComposition: false as const,
  introducesOrchestration: false as const,
  introducesWorkflowPolicy: false as const,
  introducesUiBehavior: false as const,
  introducesRendering: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  imposesLinearWorkflow: false as const,
});

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_SEPARATION = Object.freeze({
  contractDefines: "What information must exist for coordination." as const,
  policyBelongsLater: "What the workspace should become (REX-6:3+)." as const,
  compositionBelongsLater: "Which surfaces participate (REX-6:4)." as const,
  transitionOrchestrationBelongsLater:
    "How transitions are coordinated (REX-6:5)." as const,
  cockpitOwnsExperience: "What the manager sees and manipulates." as const,
});

// ─── Inherited foundation vocabularies (exact references — not forked) ──────

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS =
  RUNTIME_EXECUTIVE_WORKSPACE_KINDS;
export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS;
export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ACTIVATION_STATES =
  RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES;
export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES =
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES;
export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_PARTICIPATIONS =
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS;
export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INTENTS =
  RUNTIME_EXECUTIVE_WORKSPACE_INTENTS;
export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_TRANSITION_REASONS =
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS;
export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES;

// ─── Contract-local vocabularies ────────────────────────────────────────────

/**
 * Semantic source of a transition request.
 * Input-mechanism independent — not mouse/touch/dial/keyboard.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES =
  Object.freeze([
    "user",
    "runtime",
    "advisor",
    "action",
    "system",
  ] as const);

export type RuntimeExecutiveWorkspaceTransitionRequestSource =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES)[number];

/**
 * Neutral transition outcome statuses.
 * Shape only — REX-6:2 does not decide which outcome occurs.
 */
export const RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES =
  Object.freeze(["accepted", "rejected", "unchanged"] as const);

export type RuntimeExecutiveWorkspaceTransitionOutcomeStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES = Object.freeze([
  "identity",
  "subject",
  "focus",
  "intent",
  "activation",
  "presentation",
  "surface-participation",
  "context",
  "transition",
  "composition",
  "snapshot",
] as const);

export type RuntimeExecutiveWorkspaceContractFamily =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES = Object.freeze([
  "deterministic",
  "immutable",
  "foundation-aligned",
  "plain-data",
  "serializable-friendly",
  "renderer-independent",
  "selector-ui-independent",
  "automotive-styling-independent",
  "theme-independent",
  "dial-independent",
  "stage-coordinate-independent",
  "non-linear-transition-capable",
  "presentation-state-independent",
  "side-effect-free",
  "resolution-free",
  "orchestration-free",
] as const);

export type RuntimeExecutiveWorkspaceContractGuarantee =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ISSUE_CODES = Object.freeze([
  "empty-workspace-id",
  "invalid-workspace-kind",
  "empty-subject-id",
  "invalid-subject-kind",
  "invalid-focus",
  "duplicate-related-subject",
  "invalid-intent",
  "invalid-activation-state",
  "invalid-presentation-state",
  "invalid-surface-role",
  "invalid-surface-participation",
  "duplicate-surface-role",
  "invalid-transition",
  "invalid-transition-reason",
  "invalid-transition-source",
  "invalid-transition-outcome-status",
  "invalid-context",
  "invalid-composition-request",
  "invalid-snapshot",
] as const);

export type RuntimeExecutiveWorkspaceContractIssueCode =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ISSUE_CODES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "ContractFamilies",
    "IdentityContracts",
    "SubjectContracts",
    "FocusContracts",
    "IntentContracts",
    "ActivationContracts",
    "PresentationContracts",
    "SurfaceParticipationContracts",
    "ContextContracts",
    "TransitionContracts",
    "CompositionContracts",
    "SnapshotContracts",
    "Invariants",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveWorkspaceContractRegistrySection =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_REGISTRY_SECTIONS)[number];

// ─── Domain contracts ───────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceContractMetadata {
  readonly contractIdentity: typeof runtimeExecutiveWorkspaceExperienceContractsIdentity;
  readonly contractVersion: typeof runtimeExecutiveWorkspaceExperienceContractsVersion;
  readonly sourcePhase: typeof runtimeExecutiveWorkspaceExperienceContractsPhase;
}

export interface RuntimeExecutiveWorkspaceContractIssue {
  readonly code: RuntimeExecutiveWorkspaceContractIssueCode;
  readonly message: string;
  readonly path?: string;
}

export type RuntimeExecutiveWorkspaceContractEvaluationResult<T> =
  | {
      readonly valid: true;
      readonly issues: ReadonlyArray<RuntimeExecutiveWorkspaceContractIssue>;
      readonly value: T;
    }
  | {
      readonly valid: false;
      readonly issues: ReadonlyArray<RuntimeExecutiveWorkspaceContractIssue>;
      readonly value?: undefined;
    };

/**
 * Opaque workspace identity. No visual metadata, timestamps, or generated IDs.
 */
export interface RuntimeExecutiveWorkspaceIdentityContract {
  readonly workspaceId: string;
  readonly workspaceKind: RuntimeExecutiveWorkspaceKind;
}

/**
 * Reference-only subject identifying what the workspace is organized around.
 * Does not own or duplicate the underlying business object.
 */
export interface RuntimeExecutiveWorkspaceSubjectContract {
  readonly kind: RuntimeExecutiveWorkspaceSubjectKind;
  readonly id: string;
}

/**
 * Current executive focus without focus resolution.
 * Zero or one primary; zero or more related; no Stage/camera/render state.
 */
export interface RuntimeExecutiveWorkspaceFocusContract {
  readonly primarySubject: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly relatedSubjects: readonly RuntimeExecutiveWorkspaceSubjectContract[];
}

/**
 * Executive purpose. Not an executable command.
 */
export interface RuntimeExecutiveWorkspaceIntentContract {
  readonly intent: RuntimeExecutiveWorkspaceIntent;
}

/**
 * Semantic activation state only — no animation/renderer progress.
 */
export interface RuntimeExecutiveWorkspaceActivationContract {
  readonly state: RuntimeExecutiveWorkspaceActivationState;
}

/**
 * Carries canonical presentation state without redefining semantics.
 * Independent from workspace kind.
 */
export interface RuntimeExecutiveWorkspacePresentationContract {
  readonly state: RuntimeExecutiveWorkspacePresentationState;
}

/**
 * Semantic surface participation only — no layout/render fields.
 */
export interface RuntimeExecutiveWorkspaceSurfaceParticipationContract {
  readonly surface: RuntimeExecutiveWorkspaceSurfaceRole;
  readonly participation: RuntimeExecutiveWorkspaceSurfaceParticipation;
}

/**
 * Complete semantic surface participation set for one workspace experience.
 */
export interface RuntimeExecutiveWorkspaceSurfaceSetContract {
  readonly entries: readonly RuntimeExecutiveWorkspaceSurfaceParticipationContract[];
}

/**
 * Central composed workspace context — plain, deterministic, framework-free.
 */
export interface RuntimeExecutiveWorkspaceContextContract {
  readonly workspace: RuntimeExecutiveWorkspaceIdentityContract;
  readonly subject: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly focus: RuntimeExecutiveWorkspaceFocusContract;
  readonly intent: RuntimeExecutiveWorkspaceIntentContract;
  readonly activation: RuntimeExecutiveWorkspaceActivationContract;
  readonly presentation: RuntimeExecutiveWorkspacePresentationContract;
}

/**
 * Semantic transition between workspace kinds.
 * Describes a transition — does not approve, reject, or execute it.
 * Not assumed forward-only / linear.
 */
export interface RuntimeExecutiveWorkspaceTransitionContract {
  readonly from: RuntimeExecutiveWorkspaceKind;
  readonly to: RuntimeExecutiveWorkspaceKind;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
}

/**
 * Request for the runtime to consider a workspace change.
 * Distinguishes what exists now from what is being requested.
 */
export interface RuntimeExecutiveWorkspaceTransitionRequest {
  readonly currentWorkspace: RuntimeExecutiveWorkspaceIdentityContract;
  readonly requestedWorkspaceKind: RuntimeExecutiveWorkspaceKind;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly source: RuntimeExecutiveWorkspaceTransitionRequestSource;
  readonly requestedSubject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly requestedIntent?: RuntimeExecutiveWorkspaceIntent;
  readonly requestedPresentation?: RuntimeExecutiveWorkspacePresentationState;
}

/**
 * Neutral outcome shape for later transition processing.
 * No decision algorithm lives here.
 */
export interface RuntimeExecutiveWorkspaceTransitionOutcome {
  readonly status: RuntimeExecutiveWorkspaceTransitionOutcomeStatus;
  readonly from: RuntimeExecutiveWorkspaceKind;
  readonly to: RuntimeExecutiveWorkspaceKind;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
}

/**
 * Semantic input later consumed by workspace composition (REX-6:4).
 * No visual implementation instructions.
 */
export interface RuntimeExecutiveWorkspaceCompositionRequest {
  readonly context: RuntimeExecutiveWorkspaceContextContract;
  readonly surfaces?: RuntimeExecutiveWorkspaceSurfaceSetContract;
}

/**
 * Coherent semantic view of the workspace at a point in runtime processing.
 * Plain immutable-friendly data — no timestamps, refs, callbacks, or render objects.
 */
export interface RuntimeExecutiveWorkspaceExperienceSnapshot {
  readonly workspace: RuntimeExecutiveWorkspaceIdentityContract;
  readonly subject: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly focus: RuntimeExecutiveWorkspaceFocusContract;
  readonly intent: RuntimeExecutiveWorkspaceIntentContract;
  readonly activation: RuntimeExecutiveWorkspaceActivationContract;
  readonly presentation: RuntimeExecutiveWorkspacePresentationContract;
  readonly surfaces: RuntimeExecutiveWorkspaceSurfaceSetContract;
}

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "identity-has-valid-workspace-kind",
    order: 1,
    statement: "Every workspace identity has a valid workspace kind from REX-6:1.",
  }),
  Object.freeze({
    id: "workspace-ids-non-empty",
    order: 2,
    statement: "Workspace IDs are non-empty opaque runtime identifiers.",
  }),
  Object.freeze({
    id: "subject-ids-non-empty",
    order: 3,
    statement: "Subject IDs are non-empty.",
  }),
  Object.freeze({
    id: "subject-kinds-canonical",
    order: 4,
    statement: "Subject kinds use the REX-6:1 vocabulary.",
  }),
  Object.freeze({
    id: "focus-at-most-one-primary",
    order: 5,
    statement: "Focus contains at most one primary subject.",
  }),
  Object.freeze({
    id: "related-subjects-deterministic",
    order: 6,
    statement: "Related subject references are deterministically ordered.",
  }),
  Object.freeze({
    id: "duplicate-related-subjects-invalid",
    order: 7,
    statement: "Duplicated related subject references are invalid.",
  }),
  Object.freeze({
    id: "intent-canonical",
    order: 8,
    statement: "Executive intent uses canonical REX-6:1 vocabulary.",
  }),
  Object.freeze({
    id: "activation-canonical",
    order: 9,
    statement: "Activation uses canonical REX-6:1 vocabulary.",
  }),
  Object.freeze({
    id: "presentation-independent-of-workspace-kind",
    order: 10,
    statement: "Presentation remains independent from workspace kind.",
  }),
  Object.freeze({
    id: "surface-roles-canonical",
    order: 11,
    statement: "Surface roles use canonical REX-6:1 vocabulary.",
  }),
  Object.freeze({
    id: "duplicate-surface-participation-invalid",
    order: 12,
    statement: "Duplicate surface participation entries are invalid.",
  }),
  Object.freeze({
    id: "transitions-valid-source-target",
    order: 13,
    statement: "Transitions contain valid source and target workspaces.",
  }),
  Object.freeze({
    id: "transitions-not-forward-only",
    order: 14,
    statement: "Transitions are not assumed to be forward-only.",
  }),
  Object.freeze({
    id: "transition-reason-canonical",
    order: 15,
    statement: "Transition reason uses canonical vocabulary.",
  }),
  Object.freeze({
    id: "request-outcome-separated",
    order: 16,
    statement: "Transition request and transition outcome remain separate.",
  }),
  Object.freeze({
    id: "no-business-execution",
    order: 17,
    statement: "Contracts contain no business execution behavior.",
  }),
  Object.freeze({
    id: "no-renderer-behavior",
    order: 18,
    statement: "Contracts contain no renderer behavior.",
  }),
  Object.freeze({
    id: "no-selector-implementation",
    order: 19,
    statement: "Contracts contain no selector implementation.",
  }),
  Object.freeze({
    id: "no-automotive-styling",
    order: 20,
    statement: "Contracts contain no automotive styling semantics.",
  }),
  Object.freeze({
    id: "no-three-js-dependency",
    order: 21,
    statement: "Contracts contain no Three.js/R3F dependency.",
  }),
  Object.freeze({
    id: "deterministic",
    order: 22,
    statement: "Contracts remain deterministic.",
  }),
  Object.freeze({
    id: "registries-mutation-safe",
    order: 23,
    statement: "Canonical contract registries are mutation-safe.",
  }),
  Object.freeze({
    id: "subjects-are-references",
    order: 24,
    statement:
      "Workspace subjects remain references rather than domain ownership.",
  }),
]);

export type RuntimeExecutiveWorkspaceContractInvariant =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "workspace-resolution",
    "workspace-mode-resolution",
    "surface-composition-algorithm",
    "transition-orchestration",
    "workspace-dial",
    "cockpit-ui",
    "react-components",
    "three-js",
    "react-three-fiber",
    "scene-rendering",
    "scene-colors",
    "camera-movement",
    "animations",
    "advisor-generation",
    "insight-generation",
    "action-execution",
    "business-workflow-execution",
    "routing",
    "persistence",
    "network-communication",
    "database-communication",
    "jira-integration",
    "messaging",
    "mobile-interface",
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

function trimId(value: string): string {
  return value.trim();
}

function subjectKey(subject: RuntimeExecutiveWorkspaceSubjectContract): string {
  return `${subject.kind}:${subject.id}`;
}

function surfaceRoleOrder(role: RuntimeExecutiveWorkspaceSurfaceRole): number {
  return RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES.indexOf(role);
}

function contractMetadata(): RuntimeExecutiveWorkspaceContractMetadata {
  return Object.freeze({
    contractIdentity: runtimeExecutiveWorkspaceExperienceContractsIdentity,
    contractVersion: runtimeExecutiveWorkspaceExperienceContractsVersion,
    sourcePhase: runtimeExecutiveWorkspaceExperienceContractsPhase,
  });
}

function issue(
  code: RuntimeExecutiveWorkspaceContractIssueCode,
  message: string,
  path?: string,
): RuntimeExecutiveWorkspaceContractIssue {
  return Object.freeze(
    path === undefined ? { code, message } : { code, message, path },
  );
}

function freezeIssues(
  issues: ReadonlyArray<RuntimeExecutiveWorkspaceContractIssue>,
): ReadonlyArray<RuntimeExecutiveWorkspaceContractIssue> {
  return Object.freeze([...issues]);
}

function compareSubjectsDeterministically(
  left: RuntimeExecutiveWorkspaceSubjectContract,
  right: RuntimeExecutiveWorkspaceSubjectContract,
): number {
  const kindDelta =
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SUBJECT_KINDS.indexOf(left.kind) -
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SUBJECT_KINDS.indexOf(right.kind);
  if (kindDelta !== 0) return kindDelta;
  if (left.id < right.id) return -1;
  if (left.id > right.id) return 1;
  return 0;
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveWorkspaceContractFamily(
  value: unknown,
): value is RuntimeExecutiveWorkspaceContractFamily {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceTransitionRequestSource(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionRequestSource {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceTransitionOutcomeStatus(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionOutcomeStatus {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceContractGuarantee(
  value: unknown,
): value is RuntimeExecutiveWorkspaceContractGuarantee {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceIdentityContract(
  value: unknown,
): value is RuntimeExecutiveWorkspaceIdentityContract {
  if (!isPlainObject(value)) return false;
  return (
    isNonEmptyString(value.workspaceId) &&
    isRuntimeExecutiveWorkspaceKind(value.workspaceKind)
  );
}

export function isRuntimeExecutiveWorkspaceSubjectContract(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSubjectContract {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceSubjectKind(value.kind) &&
    isNonEmptyString(value.id)
  );
}

export function isRuntimeExecutiveWorkspaceFocusContract(
  value: unknown,
): value is RuntimeExecutiveWorkspaceFocusContract {
  if (!isPlainObject(value)) return false;
  if (!(value.primarySubject === null ||
    isRuntimeExecutiveWorkspaceSubjectContract(value.primarySubject))) {
    return false;
  }
  if (!Array.isArray(value.relatedSubjects)) return false;
  if (
    !value.relatedSubjects.every((entry) =>
      isRuntimeExecutiveWorkspaceSubjectContract(entry),
    )
  ) {
    return false;
  }
  const keys = value.relatedSubjects.map((entry) =>
    subjectKey(entry as RuntimeExecutiveWorkspaceSubjectContract),
  );
  return unique(keys);
}

export function isRuntimeExecutiveWorkspaceIntentContract(
  value: unknown,
): value is RuntimeExecutiveWorkspaceIntentContract {
  if (!isPlainObject(value)) return false;
  return isRuntimeExecutiveWorkspaceIntent(value.intent);
}

export function isRuntimeExecutiveWorkspaceActivationContract(
  value: unknown,
): value is RuntimeExecutiveWorkspaceActivationContract {
  if (!isPlainObject(value)) return false;
  return isRuntimeExecutiveWorkspaceActivationState(value.state);
}

export function isRuntimeExecutiveWorkspacePresentationContract(
  value: unknown,
): value is RuntimeExecutiveWorkspacePresentationContract {
  if (!isPlainObject(value)) return false;
  return isRuntimeExecutiveWorkspacePresentationState(value.state);
}

export function isRuntimeExecutiveWorkspaceSurfaceParticipationContract(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSurfaceParticipationContract {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceSurfaceRole(value.surface) &&
    isRuntimeExecutiveWorkspaceSurfaceParticipation(value.participation)
  );
}

export function isRuntimeExecutiveWorkspaceSurfaceSetContract(
  value: unknown,
): value is RuntimeExecutiveWorkspaceSurfaceSetContract {
  if (!isPlainObject(value) || !Array.isArray(value.entries)) return false;
  if (
    !value.entries.every((entry) =>
      isRuntimeExecutiveWorkspaceSurfaceParticipationContract(entry),
    )
  ) {
    return false;
  }
  const roles = value.entries.map(
    (entry) =>
      (entry as RuntimeExecutiveWorkspaceSurfaceParticipationContract).surface,
  );
  return unique(roles);
}

export function isRuntimeExecutiveWorkspaceTransitionContract(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionContract {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceKind(value.from) &&
    isRuntimeExecutiveWorkspaceKind(value.to) &&
    isRuntimeExecutiveWorkspaceTransitionReason(value.reason)
  );
}

export function isRuntimeExecutiveWorkspaceTransitionRequest(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionRequest {
  if (!isPlainObject(value)) return false;
  if (!isRuntimeExecutiveWorkspaceIdentityContract(value.currentWorkspace)) {
    return false;
  }
  if (!isRuntimeExecutiveWorkspaceKind(value.requestedWorkspaceKind)) {
    return false;
  }
  if (!isRuntimeExecutiveWorkspaceTransitionReason(value.reason)) return false;
  if (!isRuntimeExecutiveWorkspaceTransitionRequestSource(value.source)) {
    return false;
  }
  if (
    value.requestedSubject !== undefined &&
    value.requestedSubject !== null &&
    !isRuntimeExecutiveWorkspaceSubjectContract(value.requestedSubject)
  ) {
    return false;
  }
  if (
    value.requestedIntent !== undefined &&
    !isRuntimeExecutiveWorkspaceIntent(value.requestedIntent)
  ) {
    return false;
  }
  if (
    value.requestedPresentation !== undefined &&
    !isRuntimeExecutiveWorkspacePresentationState(value.requestedPresentation)
  ) {
    return false;
  }
  return true;
}

export function isRuntimeExecutiveWorkspaceTransitionOutcome(
  value: unknown,
): value is RuntimeExecutiveWorkspaceTransitionOutcome {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceTransitionOutcomeStatus(value.status) &&
    isRuntimeExecutiveWorkspaceKind(value.from) &&
    isRuntimeExecutiveWorkspaceKind(value.to) &&
    isRuntimeExecutiveWorkspaceTransitionReason(value.reason)
  );
}

export function isRuntimeExecutiveWorkspaceContextContract(
  value: unknown,
): value is RuntimeExecutiveWorkspaceContextContract {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceIdentityContract(value.workspace) &&
    (value.subject === null ||
      isRuntimeExecutiveWorkspaceSubjectContract(value.subject)) &&
    isRuntimeExecutiveWorkspaceFocusContract(value.focus) &&
    isRuntimeExecutiveWorkspaceIntentContract(value.intent) &&
    isRuntimeExecutiveWorkspaceActivationContract(value.activation) &&
    isRuntimeExecutiveWorkspacePresentationContract(value.presentation)
  );
}

export function isRuntimeExecutiveWorkspaceCompositionRequest(
  value: unknown,
): value is RuntimeExecutiveWorkspaceCompositionRequest {
  if (!isPlainObject(value)) return false;
  if (!isRuntimeExecutiveWorkspaceContextContract(value.context)) return false;
  if (
    value.surfaces !== undefined &&
    !isRuntimeExecutiveWorkspaceSurfaceSetContract(value.surfaces)
  ) {
    return false;
  }
  return true;
}

export function isRuntimeExecutiveWorkspaceExperienceSnapshot(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperienceSnapshot {
  if (!isPlainObject(value)) return false;
  return (
    isRuntimeExecutiveWorkspaceIdentityContract(value.workspace) &&
    (value.subject === null ||
      isRuntimeExecutiveWorkspaceSubjectContract(value.subject)) &&
    isRuntimeExecutiveWorkspaceFocusContract(value.focus) &&
    isRuntimeExecutiveWorkspaceIntentContract(value.intent) &&
    isRuntimeExecutiveWorkspaceActivationContract(value.activation) &&
    isRuntimeExecutiveWorkspacePresentationContract(value.presentation) &&
    isRuntimeExecutiveWorkspaceSurfaceSetContract(value.surfaces)
  );
}

// ─── Constructors (contract-safe plain data) ────────────────────────────────

export function createRuntimeExecutiveWorkspaceContractMetadata():
  RuntimeExecutiveWorkspaceContractMetadata {
  return contractMetadata();
}

export function createRuntimeExecutiveWorkspaceIdentityContract(input: {
  readonly workspaceId: string;
  readonly workspaceKind: RuntimeExecutiveWorkspaceKind;
}): RuntimeExecutiveWorkspaceIdentityContract {
  if (!isNonEmptyString(input.workspaceId)) {
    throw new TypeError("workspaceId must be a non-empty opaque identifier");
  }
  if (!isRuntimeExecutiveWorkspaceKind(input.workspaceKind)) {
    throw new TypeError("workspaceKind must be a known workspace kind");
  }
  return Object.freeze({
    workspaceId: trimId(input.workspaceId),
    workspaceKind: input.workspaceKind,
  });
}

export function createRuntimeExecutiveWorkspaceSubjectContract(input: {
  readonly kind: RuntimeExecutiveWorkspaceSubjectKind;
  readonly id: string;
}): RuntimeExecutiveWorkspaceSubjectContract {
  if (!isRuntimeExecutiveWorkspaceSubjectKind(input.kind)) {
    throw new TypeError("kind must be a known workspace subject kind");
  }
  if (!isNonEmptyString(input.id)) {
    throw new TypeError("id must be a non-empty subject identifier");
  }
  return Object.freeze({
    kind: input.kind,
    id: trimId(input.id),
  });
}

export function createRuntimeExecutiveWorkspaceFocusContract(input: {
  readonly primarySubject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly relatedSubjects?: readonly RuntimeExecutiveWorkspaceSubjectContract[];
}): RuntimeExecutiveWorkspaceFocusContract {
  const primarySubject =
    input.primarySubject === undefined || input.primarySubject === null
      ? null
      : createRuntimeExecutiveWorkspaceSubjectContract(input.primarySubject);

  const relatedRaw = (input.relatedSubjects ?? []).map((entry) =>
    createRuntimeExecutiveWorkspaceSubjectContract(entry),
  );
  const relatedKeys = relatedRaw.map(subjectKey);
  if (!unique(relatedKeys)) {
    throw new TypeError("relatedSubjects must not contain duplicate references");
  }

  const relatedSubjects = Object.freeze(
    [...relatedRaw].sort(compareSubjectsDeterministically),
  );

  return Object.freeze({
    primarySubject,
    relatedSubjects,
  });
}

export function createRuntimeExecutiveWorkspaceIntentContract(input: {
  readonly intent: RuntimeExecutiveWorkspaceIntent;
}): RuntimeExecutiveWorkspaceIntentContract {
  if (!isRuntimeExecutiveWorkspaceIntent(input.intent)) {
    throw new TypeError("intent must be a known workspace intent");
  }
  return Object.freeze({ intent: input.intent });
}

export function createRuntimeExecutiveWorkspaceActivationContract(input: {
  readonly state: RuntimeExecutiveWorkspaceActivationState;
}): RuntimeExecutiveWorkspaceActivationContract {
  if (!isRuntimeExecutiveWorkspaceActivationState(input.state)) {
    throw new TypeError("state must be a known workspace activation state");
  }
  return Object.freeze({ state: input.state });
}

export function createRuntimeExecutiveWorkspacePresentationContract(input: {
  readonly state: RuntimeExecutiveWorkspacePresentationState;
}): RuntimeExecutiveWorkspacePresentationContract {
  if (!isRuntimeExecutiveWorkspacePresentationState(input.state)) {
    throw new TypeError(
      "state must be a known presentation state (minimum, report, or operation)",
    );
  }
  return Object.freeze({ state: input.state });
}

export function createRuntimeExecutiveWorkspaceSurfaceParticipationContract(input: {
  readonly surface: RuntimeExecutiveWorkspaceSurfaceRole;
  readonly participation: RuntimeExecutiveWorkspaceSurfaceParticipation;
}): RuntimeExecutiveWorkspaceSurfaceParticipationContract {
  if (!isRuntimeExecutiveWorkspaceSurfaceRole(input.surface)) {
    throw new TypeError("surface must be a known workspace surface role");
  }
  if (!isRuntimeExecutiveWorkspaceSurfaceParticipation(input.participation)) {
    throw new TypeError(
      "participation must be a known workspace surface participation",
    );
  }
  return Object.freeze({
    surface: input.surface,
    participation: input.participation,
  });
}

export function createRuntimeExecutiveWorkspaceSurfaceSetContract(input: {
  readonly entries: readonly RuntimeExecutiveWorkspaceSurfaceParticipationContract[];
}): RuntimeExecutiveWorkspaceSurfaceSetContract {
  const normalized = input.entries.map((entry) =>
    createRuntimeExecutiveWorkspaceSurfaceParticipationContract(entry),
  );
  const roles = normalized.map((entry) => entry.surface);
  if (!unique(roles)) {
    throw new TypeError("surface set must not contain duplicate surface roles");
  }
  const entries = Object.freeze(
    [...normalized].sort(
      (left, right) =>
        surfaceRoleOrder(left.surface) - surfaceRoleOrder(right.surface),
    ),
  );
  return Object.freeze({ entries });
}

export function createRuntimeExecutiveWorkspaceContextContract(input: {
  readonly workspace: RuntimeExecutiveWorkspaceIdentityContract;
  readonly subject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly focus: RuntimeExecutiveWorkspaceFocusContract;
  readonly intent: RuntimeExecutiveWorkspaceIntentContract;
  readonly activation: RuntimeExecutiveWorkspaceActivationContract;
  readonly presentation: RuntimeExecutiveWorkspacePresentationContract;
}): RuntimeExecutiveWorkspaceContextContract {
  return Object.freeze({
    workspace: createRuntimeExecutiveWorkspaceIdentityContract(input.workspace),
    subject:
      input.subject === undefined || input.subject === null
        ? null
        : createRuntimeExecutiveWorkspaceSubjectContract(input.subject),
    focus: createRuntimeExecutiveWorkspaceFocusContract(input.focus),
    intent: createRuntimeExecutiveWorkspaceIntentContract(input.intent),
    activation: createRuntimeExecutiveWorkspaceActivationContract(
      input.activation,
    ),
    presentation: createRuntimeExecutiveWorkspacePresentationContract(
      input.presentation,
    ),
  });
}

export function createRuntimeExecutiveWorkspaceTransitionContract(input: {
  readonly from: RuntimeExecutiveWorkspaceKind;
  readonly to: RuntimeExecutiveWorkspaceKind;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
}): RuntimeExecutiveWorkspaceTransitionContract {
  if (!isRuntimeExecutiveWorkspaceKind(input.from)) {
    throw new TypeError("from must be a known workspace kind");
  }
  if (!isRuntimeExecutiveWorkspaceKind(input.to)) {
    throw new TypeError("to must be a known workspace kind");
  }
  if (!isRuntimeExecutiveWorkspaceTransitionReason(input.reason)) {
    throw new TypeError("reason must be a known workspace transition reason");
  }
  return Object.freeze({
    from: input.from,
    to: input.to,
    reason: input.reason,
  });
}

export function createRuntimeExecutiveWorkspaceTransitionRequest(input: {
  readonly currentWorkspace: RuntimeExecutiveWorkspaceIdentityContract;
  readonly requestedWorkspaceKind: RuntimeExecutiveWorkspaceKind;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
  readonly source: RuntimeExecutiveWorkspaceTransitionRequestSource;
  readonly requestedSubject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly requestedIntent?: RuntimeExecutiveWorkspaceIntent;
  readonly requestedPresentation?: RuntimeExecutiveWorkspacePresentationState;
}): RuntimeExecutiveWorkspaceTransitionRequest {
  if (!isRuntimeExecutiveWorkspaceKind(input.requestedWorkspaceKind)) {
    throw new TypeError(
      "requestedWorkspaceKind must be a known workspace kind",
    );
  }
  if (!isRuntimeExecutiveWorkspaceTransitionReason(input.reason)) {
    throw new TypeError("reason must be a known workspace transition reason");
  }
  if (!isRuntimeExecutiveWorkspaceTransitionRequestSource(input.source)) {
    throw new TypeError(
      "source must be a known transition request source (user/runtime/advisor/action/system)",
    );
  }
  if (
    input.requestedIntent !== undefined &&
    !isRuntimeExecutiveWorkspaceIntent(input.requestedIntent)
  ) {
    throw new TypeError("requestedIntent must be a known workspace intent");
  }
  if (
    input.requestedPresentation !== undefined &&
    !isRuntimeExecutiveWorkspacePresentationState(input.requestedPresentation)
  ) {
    throw new TypeError(
      "requestedPresentation must be a known presentation state",
    );
  }

  return Object.freeze({
    currentWorkspace: createRuntimeExecutiveWorkspaceIdentityContract(
      input.currentWorkspace,
    ),
    requestedWorkspaceKind: input.requestedWorkspaceKind,
    reason: input.reason,
    source: input.source,
    ...(input.requestedSubject !== undefined
      ? {
          requestedSubject:
            input.requestedSubject === null
              ? null
              : createRuntimeExecutiveWorkspaceSubjectContract(
                  input.requestedSubject,
                ),
        }
      : {}),
    ...(input.requestedIntent !== undefined
      ? { requestedIntent: input.requestedIntent }
      : {}),
    ...(input.requestedPresentation !== undefined
      ? { requestedPresentation: input.requestedPresentation }
      : {}),
  });
}

export function createRuntimeExecutiveWorkspaceTransitionOutcome(input: {
  readonly status: RuntimeExecutiveWorkspaceTransitionOutcomeStatus;
  readonly from: RuntimeExecutiveWorkspaceKind;
  readonly to: RuntimeExecutiveWorkspaceKind;
  readonly reason: RuntimeExecutiveWorkspaceTransitionReason;
}): RuntimeExecutiveWorkspaceTransitionOutcome {
  if (!isRuntimeExecutiveWorkspaceTransitionOutcomeStatus(input.status)) {
    throw new TypeError(
      "status must be accepted, rejected, or unchanged",
    );
  }
  if (!isRuntimeExecutiveWorkspaceKind(input.from)) {
    throw new TypeError("from must be a known workspace kind");
  }
  if (!isRuntimeExecutiveWorkspaceKind(input.to)) {
    throw new TypeError("to must be a known workspace kind");
  }
  if (!isRuntimeExecutiveWorkspaceTransitionReason(input.reason)) {
    throw new TypeError("reason must be a known workspace transition reason");
  }
  return Object.freeze({
    status: input.status,
    from: input.from,
    to: input.to,
    reason: input.reason,
  });
}

export function createRuntimeExecutiveWorkspaceCompositionRequest(input: {
  readonly context: RuntimeExecutiveWorkspaceContextContract;
  readonly surfaces?: RuntimeExecutiveWorkspaceSurfaceSetContract;
}): RuntimeExecutiveWorkspaceCompositionRequest {
  return Object.freeze({
    context: createRuntimeExecutiveWorkspaceContextContract(input.context),
    ...(input.surfaces !== undefined
      ? {
          surfaces: createRuntimeExecutiveWorkspaceSurfaceSetContract(
            input.surfaces,
          ),
        }
      : {}),
  });
}

export function createRuntimeExecutiveWorkspaceExperienceSnapshot(input: {
  readonly workspace: RuntimeExecutiveWorkspaceIdentityContract;
  readonly subject?: RuntimeExecutiveWorkspaceSubjectContract | null;
  readonly focus: RuntimeExecutiveWorkspaceFocusContract;
  readonly intent: RuntimeExecutiveWorkspaceIntentContract;
  readonly activation: RuntimeExecutiveWorkspaceActivationContract;
  readonly presentation: RuntimeExecutiveWorkspacePresentationContract;
  readonly surfaces: RuntimeExecutiveWorkspaceSurfaceSetContract;
}): RuntimeExecutiveWorkspaceExperienceSnapshot {
  return Object.freeze({
    workspace: createRuntimeExecutiveWorkspaceIdentityContract(input.workspace),
    subject:
      input.subject === undefined || input.subject === null
        ? null
        : createRuntimeExecutiveWorkspaceSubjectContract(input.subject),
    focus: createRuntimeExecutiveWorkspaceFocusContract(input.focus),
    intent: createRuntimeExecutiveWorkspaceIntentContract(input.intent),
    activation: createRuntimeExecutiveWorkspaceActivationContract(
      input.activation,
    ),
    presentation: createRuntimeExecutiveWorkspacePresentationContract(
      input.presentation,
    ),
    surfaces: createRuntimeExecutiveWorkspaceSurfaceSetContract(input.surfaces),
  });
}

// ─── Lightweight structural evaluation ──────────────────────────────────────

export function evaluateRuntimeExecutiveWorkspaceFocusContract(
  value: unknown,
): RuntimeExecutiveWorkspaceContractEvaluationResult<RuntimeExecutiveWorkspaceFocusContract> {
  const issues: RuntimeExecutiveWorkspaceContractIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue("invalid-focus", "focus must be a plain object"),
      ]),
    });
  }

  if (
    !(
      value.primarySubject === null ||
      isRuntimeExecutiveWorkspaceSubjectContract(value.primarySubject)
    )
  ) {
    issues.push(
      issue(
        "invalid-focus",
        "primarySubject must be null or a valid subject contract",
        "primarySubject",
      ),
    );
  }

  if (!Array.isArray(value.relatedSubjects)) {
    issues.push(
      issue(
        "invalid-focus",
        "relatedSubjects must be an array",
        "relatedSubjects",
      ),
    );
  } else {
    for (const [index, entry] of value.relatedSubjects.entries()) {
      if (!isRuntimeExecutiveWorkspaceSubjectContract(entry)) {
        issues.push(
          issue(
            "invalid-focus",
            "related subject must be a valid subject contract",
            `relatedSubjects[${index}]`,
          ),
        );
      }
    }
    if (
      value.relatedSubjects.every((entry) =>
        isRuntimeExecutiveWorkspaceSubjectContract(entry),
      )
    ) {
      const keys = value.relatedSubjects.map((entry) =>
        subjectKey(entry as RuntimeExecutiveWorkspaceSubjectContract),
      );
      if (!unique(keys)) {
        issues.push(
          issue(
            "duplicate-related-subject",
            "relatedSubjects must not contain duplicate references",
            "relatedSubjects",
          ),
        );
      }
    }
  }

  if (issues.length > 0) {
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }

  return Object.freeze({
    valid: true,
    issues: Object.freeze([]),
    value: createRuntimeExecutiveWorkspaceFocusContract({
      primarySubject:
        value.primarySubject as RuntimeExecutiveWorkspaceSubjectContract | null,
      relatedSubjects:
        value.relatedSubjects as RuntimeExecutiveWorkspaceSubjectContract[],
    }),
  });
}

export function evaluateRuntimeExecutiveWorkspaceSurfaceSetContract(
  value: unknown,
): RuntimeExecutiveWorkspaceContractEvaluationResult<RuntimeExecutiveWorkspaceSurfaceSetContract> {
  const issues: RuntimeExecutiveWorkspaceContractIssue[] = [];

  if (!isPlainObject(value) || !Array.isArray(value.entries)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "invalid-surface-participation",
          "surface set must be a plain object with entries array",
        ),
      ]),
    });
  }

  for (const [index, entry] of value.entries.entries()) {
    if (!isRuntimeExecutiveWorkspaceSurfaceParticipationContract(entry)) {
      issues.push(
        issue(
          "invalid-surface-participation",
          "surface participation entry is invalid",
          `entries[${index}]`,
        ),
      );
    }
  }

  if (
    value.entries.every((entry) =>
      isRuntimeExecutiveWorkspaceSurfaceParticipationContract(entry),
    )
  ) {
    const roles = value.entries.map(
      (entry) =>
        (entry as RuntimeExecutiveWorkspaceSurfaceParticipationContract)
          .surface,
    );
    if (!unique(roles)) {
      issues.push(
        issue(
          "duplicate-surface-role",
          "surface set must not contain duplicate surface roles",
          "entries",
        ),
      );
    }
  }

  if (issues.length > 0) {
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }

  return Object.freeze({
    valid: true,
    issues: Object.freeze([]),
    value: createRuntimeExecutiveWorkspaceSurfaceSetContract({
      entries:
        value.entries as RuntimeExecutiveWorkspaceSurfaceParticipationContract[],
    }),
  });
}

export function evaluateRuntimeExecutiveWorkspaceIdentityContract(
  value: unknown,
): RuntimeExecutiveWorkspaceContractEvaluationResult<RuntimeExecutiveWorkspaceIdentityContract> {
  const issues: RuntimeExecutiveWorkspaceContractIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue("invalid-workspace-kind", "identity must be a plain object"),
      ]),
    });
  }
  if (!isNonEmptyString(value.workspaceId)) {
    issues.push(
      issue(
        "empty-workspace-id",
        "workspaceId must be a non-empty opaque identifier",
        "workspaceId",
      ),
    );
  }
  if (!isRuntimeExecutiveWorkspaceKind(value.workspaceKind)) {
    issues.push(
      issue(
        "invalid-workspace-kind",
        "workspaceKind must be a known workspace kind",
        "workspaceKind",
      ),
    );
  }
  if (issues.length > 0) {
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }
  return Object.freeze({
    valid: true,
    issues: Object.freeze([]),
    value: createRuntimeExecutiveWorkspaceIdentityContract({
      workspaceId: value.workspaceId as string,
      workspaceKind: value.workspaceKind as RuntimeExecutiveWorkspaceKind,
    }),
  });
}

export function evaluateRuntimeExecutiveWorkspaceTransitionContract(
  value: unknown,
): RuntimeExecutiveWorkspaceContractEvaluationResult<RuntimeExecutiveWorkspaceTransitionContract> {
  if (!isRuntimeExecutiveWorkspaceTransitionContract(value)) {
    const issues: RuntimeExecutiveWorkspaceContractIssue[] = [];
    if (!isPlainObject(value)) {
      issues.push(issue("invalid-transition", "transition must be a plain object"));
    } else {
      if (!isRuntimeExecutiveWorkspaceKind(value.from)) {
        issues.push(
          issue(
            "invalid-transition",
            "from must be a known workspace kind",
            "from",
          ),
        );
      }
      if (!isRuntimeExecutiveWorkspaceKind(value.to)) {
        issues.push(
          issue(
            "invalid-transition",
            "to must be a known workspace kind",
            "to",
          ),
        );
      }
      if (!isRuntimeExecutiveWorkspaceTransitionReason(value.reason)) {
        issues.push(
          issue(
            "invalid-transition-reason",
            "reason must be a known transition reason",
            "reason",
          ),
        );
      }
    }
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }
  return Object.freeze({
    valid: true,
    issues: Object.freeze([]),
    value: createRuntimeExecutiveWorkspaceTransitionContract(value),
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveWorkspaceExperienceContractsIdentity():
  typeof runtimeExecutiveWorkspaceExperienceContractsCanonicalIdentity {
  return runtimeExecutiveWorkspaceExperienceContractsCanonicalIdentity;
}

export function getRuntimeExecutiveWorkspaceExperienceContractsGuarantees():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES {
  return RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES;
}

export function getRuntimeExecutiveWorkspaceExperienceContractsRegistry():
  typeof runtimeExecutiveWorkspaceExperienceContractsRegistry {
  return runtimeExecutiveWorkspaceExperienceContractsRegistry;
}

export function getRuntimeExecutiveWorkspaceExperienceContractsInvariants():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS {
  return RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceExperienceContractsApiNames =
  Object.freeze([
    "getRuntimeExecutiveWorkspaceExperienceContractsIdentity",
    "getRuntimeExecutiveWorkspaceExperienceContractsRegistry",
    "getRuntimeExecutiveWorkspaceExperienceContractsGuarantees",
    "getRuntimeExecutiveWorkspaceExperienceContractsInvariants",
    "isRuntimeExecutiveWorkspaceContractFamily",
    "isRuntimeExecutiveWorkspaceTransitionRequestSource",
    "isRuntimeExecutiveWorkspaceTransitionOutcomeStatus",
    "isRuntimeExecutiveWorkspaceContractGuarantee",
    "isRuntimeExecutiveWorkspaceIdentityContract",
    "isRuntimeExecutiveWorkspaceSubjectContract",
    "isRuntimeExecutiveWorkspaceFocusContract",
    "isRuntimeExecutiveWorkspaceIntentContract",
    "isRuntimeExecutiveWorkspaceActivationContract",
    "isRuntimeExecutiveWorkspacePresentationContract",
    "isRuntimeExecutiveWorkspaceSurfaceParticipationContract",
    "isRuntimeExecutiveWorkspaceSurfaceSetContract",
    "isRuntimeExecutiveWorkspaceTransitionContract",
    "isRuntimeExecutiveWorkspaceTransitionRequest",
    "isRuntimeExecutiveWorkspaceTransitionOutcome",
    "isRuntimeExecutiveWorkspaceContextContract",
    "isRuntimeExecutiveWorkspaceCompositionRequest",
    "isRuntimeExecutiveWorkspaceExperienceSnapshot",
    "createRuntimeExecutiveWorkspaceContractMetadata",
    "createRuntimeExecutiveWorkspaceIdentityContract",
    "createRuntimeExecutiveWorkspaceSubjectContract",
    "createRuntimeExecutiveWorkspaceFocusContract",
    "createRuntimeExecutiveWorkspaceIntentContract",
    "createRuntimeExecutiveWorkspaceActivationContract",
    "createRuntimeExecutiveWorkspacePresentationContract",
    "createRuntimeExecutiveWorkspaceSurfaceParticipationContract",
    "createRuntimeExecutiveWorkspaceSurfaceSetContract",
    "createRuntimeExecutiveWorkspaceContextContract",
    "createRuntimeExecutiveWorkspaceTransitionContract",
    "createRuntimeExecutiveWorkspaceTransitionRequest",
    "createRuntimeExecutiveWorkspaceTransitionOutcome",
    "createRuntimeExecutiveWorkspaceCompositionRequest",
    "createRuntimeExecutiveWorkspaceExperienceSnapshot",
    "evaluateRuntimeExecutiveWorkspaceIdentityContract",
    "evaluateRuntimeExecutiveWorkspaceFocusContract",
    "evaluateRuntimeExecutiveWorkspaceSurfaceSetContract",
    "evaluateRuntimeExecutiveWorkspaceTransitionContract",
    "verifyRuntimeExecutiveWorkspaceExperienceContracts",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveWorkspaceContractFamily",
    "RuntimeExecutiveWorkspaceContractGuarantee",
    "RuntimeExecutiveWorkspaceContractIssueCode",
    "RuntimeExecutiveWorkspaceContractRegistrySection",
    "RuntimeExecutiveWorkspaceTransitionRequestSource",
    "RuntimeExecutiveWorkspaceTransitionOutcomeStatus",
    "RuntimeExecutiveWorkspaceContractMetadata",
    "RuntimeExecutiveWorkspaceContractIssue",
    "RuntimeExecutiveWorkspaceContractEvaluationResult",
    "RuntimeExecutiveWorkspaceIdentityContract",
    "RuntimeExecutiveWorkspaceSubjectContract",
    "RuntimeExecutiveWorkspaceFocusContract",
    "RuntimeExecutiveWorkspaceIntentContract",
    "RuntimeExecutiveWorkspaceActivationContract",
    "RuntimeExecutiveWorkspacePresentationContract",
    "RuntimeExecutiveWorkspaceSurfaceParticipationContract",
    "RuntimeExecutiveWorkspaceSurfaceSetContract",
    "RuntimeExecutiveWorkspaceContextContract",
    "RuntimeExecutiveWorkspaceTransitionContract",
    "RuntimeExecutiveWorkspaceTransitionRequest",
    "RuntimeExecutiveWorkspaceTransitionOutcome",
    "RuntimeExecutiveWorkspaceCompositionRequest",
    "RuntimeExecutiveWorkspaceExperienceSnapshot",
    "RuntimeExecutiveWorkspaceContractInvariant",
    "RuntimeExecutiveWorkspaceExperienceContractsVerification",
  ] as const);

export const runtimeExecutiveWorkspaceExperienceContractsRegistry =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperienceContractsIdentity,
    version: runtimeExecutiveWorkspaceExperienceContractsVersion,
    namespace: runtimeExecutiveWorkspaceExperienceContractsNamespace,
    layer: runtimeExecutiveWorkspaceExperienceContractsLayer,
    capability: runtimeExecutiveWorkspaceExperienceContractsCapability,
    phase: runtimeExecutiveWorkspaceExperienceContractsPhase,
    status: runtimeExecutiveWorkspaceExperienceContractsStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceContractsDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperienceContractsDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperienceContractsSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_REGISTRY_SECTIONS.length,
    contractFamilies: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES,
    contractFamilyCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES.length,
    workspaceKinds: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS,
    workspaceKindCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS.length,
    subjectKinds: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SUBJECT_KINDS,
    subjectKindCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SUBJECT_KINDS.length,
    activationStates: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ACTIVATION_STATES,
    activationStateCount:
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ACTIVATION_STATES.length,
    surfaceRoles: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES,
    surfaceRoleCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES.length,
    surfaceParticipations:
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_PARTICIPATIONS,
    surfaceParticipationCount:
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_PARTICIPATIONS.length,
    intents: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INTENTS,
    intentCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INTENTS.length,
    transitionReasons: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_TRANSITION_REASONS,
    transitionReasonCount:
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_TRANSITION_REASONS.length,
    presentationStates:
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES,
    presentationStateCount:
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES.length,
    transitionRequestSources:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES,
    transitionRequestSourceCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES.length,
    transitionOutcomeStatuses:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES,
    transitionOutcomeStatusCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES.length,
    issueCodes: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ISSUE_CODES,
    issueCodeCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ISSUE_CODES.length,
    guarantees: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES,
    guaranteeCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES.length,
    invariants: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS.length,
    publicTypes: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveWorkspaceExperienceContractsApiNames,
    publicApiCount:
      runtimeExecutiveWorkspaceExperienceContractsApiNames.length,
  });

export const runtimeExecutiveWorkspaceExperienceContracts = Object.freeze({
  phase: "Contracts" as const,
  name: "RuntimeExecutiveWorkspaceExperienceContracts" as const,
  identity: runtimeExecutiveWorkspaceExperienceContractsIdentity,
  version: runtimeExecutiveWorkspaceExperienceContractsVersion,
  namespace: runtimeExecutiveWorkspaceExperienceContractsNamespace,
  layer: runtimeExecutiveWorkspaceExperienceContractsLayer,
  capability: runtimeExecutiveWorkspaceExperienceContractsCapability,
  architecturalRole:
    runtimeExecutiveWorkspaceExperienceContractsArchitecturalRole,
  role: "Contracts" as const,
  status: runtimeExecutiveWorkspaceExperienceContractsStatus,
  upstreamDependency:
    runtimeExecutiveWorkspaceExperienceContractsDependencyIdentity,
  dependencyPath:
    runtimeExecutiveWorkspaceExperienceContractsDependencyPath,
  supportedImportPath:
    runtimeExecutiveWorkspaceExperienceContractsSupportedImportPath,
  deterministic: runtimeExecutiveWorkspaceExperienceContractsDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  foundationAligned: true as const,
  plainData: true as const,
  serializableFriendly: true as const,
  rendererIndependent: true as const,
  selectorUiIndependent: true as const,
  automotiveStylingIndependent: true as const,
  themeIndependent: true as const,
  dialIndependent: true as const,
  stageCoordinateIndependent: true as const,
  nonLinearTransitionCapable: true as const,
  presentationStateIndependent: true as const,
  resolutionFree: true as const,
  orchestrationFree: true as const,
  principle: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_BOUNDARY,
  separation: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_SEPARATION,
  contractFamilies: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES,
  issueCodes: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ISSUE_CODES,
  transitionRequestSources:
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES,
  transitionOutcomeStatuses:
    RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES,
  guarantees: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES,
  invariants: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FORBIDDEN_RESPONSIBILITIES,
  publicTypeNames: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveWorkspaceExperienceContractsApiNames,
  registry: runtimeExecutiveWorkspaceExperienceContractsRegistry,
  foundationBoundary: "REX-6:1-foundation-only" as const,
  architecturalStatus:
    "REX-6:2 Runtime Executive Workspace Experience Contracts — ContractsReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceExperienceContractsVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveWorkspaceExperienceContractsIdentity;
  readonly version: typeof runtimeExecutiveWorkspaceExperienceContractsVersion;
  readonly namespace: typeof runtimeExecutiveWorkspaceExperienceContractsNamespace;
  readonly phase: typeof runtimeExecutiveWorkspaceExperienceContractsPhase;
  readonly architecturalRole: typeof runtimeExecutiveWorkspaceExperienceContractsArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveWorkspaceExperienceContractsDependencyIdentity;
  readonly contractFamilyCount: number;
  readonly issueCodeCount: number;
  readonly transitionOutcomeStatusCount: number;
  readonly guaranteeCount: number;
  readonly invariantCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly foundationBoundaryIntact: boolean;
  readonly presentationStateIndependent: boolean;
  readonly nonLinearTransitionCapable: boolean;
  readonly dialIndependent: boolean;
  readonly automotiveStylingIndependent: boolean;
  readonly rendererIndependent: boolean;
  readonly resolutionFree: boolean;
  readonly orchestrationFree: boolean;
  readonly upstreamFoundationOk: boolean;
}

export function verifyRuntimeExecutiveWorkspaceExperienceContracts():
  RuntimeExecutiveWorkspaceExperienceContractsVerification {
  const module = runtimeExecutiveWorkspaceExperienceContracts;
  const registry = runtimeExecutiveWorkspaceExperienceContractsRegistry;
  const upstream = verifyRuntimeExecutiveWorkspaceExperienceFoundation();

  const identityOk =
    module.identity ===
      "REX-6:2/RuntimeExecutiveWorkspaceExperienceContracts" &&
    module.version === "6.2.0" &&
    module.namespace === "nexora.rex.workspace-experience.contracts" &&
    module.phase === "Contracts" &&
    module.architecturalRole ===
      "RuntimeExecutiveWorkspaceExperienceContracts" &&
    module.upstreamDependency ===
      "REX-6:1/RuntimeExecutiveWorkspaceExperienceFoundation" &&
    module.upstreamDependency ===
      runtimeExecutiveWorkspaceExperienceFoundationIdentity &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceFoundation" &&
    module.foundationBoundary === "REX-6:1-foundation-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES], [
      "identity",
      "subject",
      "focus",
      "intent",
      "activation",
      "presentation",
      "surface-participation",
      "context",
      "transition",
      "composition",
      "snapshot",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES], [
      "accepted",
      "rejected",
      "unchanged",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES], [
      "user",
      "runtime",
      "advisor",
      "action",
      "system",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES], [
      "deterministic",
      "immutable",
      "foundation-aligned",
      "plain-data",
      "serializable-friendly",
      "renderer-independent",
      "selector-ui-independent",
      "automotive-styling-independent",
      "theme-independent",
      "dial-independent",
      "stage-coordinate-independent",
      "non-linear-transition-capable",
      "presentation-state-independent",
      "side-effect-free",
      "resolution-free",
      "orchestration-free",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_REGISTRY_SECTIONS],
      [
        "Identity",
        "ContractFamilies",
        "IdentityContracts",
        "SubjectContracts",
        "FocusContracts",
        "IntentContracts",
        "ActivationContracts",
        "PresentationContracts",
        "SurfaceParticipationContracts",
        "ContextContracts",
        "TransitionContracts",
        "CompositionContracts",
        "SnapshotContracts",
        "Invariants",
        "PublicAPIs",
        "Guarantees",
      ],
    ) &&
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_KINDS ===
      RUNTIME_EXECUTIVE_WORKSPACE_KINDS &&
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_PRESENTATION_STATES ===
      RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES &&
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_BOUNDARY.imposesLinearWorkflow ===
      false;

  const nonLinearTransitionCapable = (() => {
    const pairs: ReadonlyArray<
      readonly [RuntimeExecutiveWorkspaceKind, RuntimeExecutiveWorkspaceKind]
    > = [
      ["overview", "problem"],
      ["problem", "scenario"],
      ["scenario", "decision"],
      ["decision", "execution"],
      ["decision", "scenario"],
      ["scenario", "problem"],
      ["execution", "decision"],
      ["problem", "overview"],
    ];
    return pairs.every(([from, to]) =>
      isRuntimeExecutiveWorkspaceTransitionContract(
        createRuntimeExecutiveWorkspaceTransitionContract({
          from,
          to,
          reason: "user-request",
        }),
      ),
    );
  })();

  const countsOk =
    registry.contractFamilyCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES.length &&
    registry.issueCodeCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ISSUE_CODES.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      runtimeExecutiveWorkspaceExperienceContractsApiNames.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_PUBLIC_TYPE_NAMES.length &&
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS.length === 24 &&
    RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS.map((entry) => entry.id),
    );

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ISSUE_CODES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REQUEST_SOURCES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS) &&
    Object.isFrozen(
      runtimeExecutiveWorkspaceExperienceContractsCanonicalIdentity,
    ) &&
    Object.isFrozen(runtimeExecutiveWorkspaceExperienceContractsRegistry) &&
    Object.isFrozen(runtimeExecutiveWorkspaceExperienceContracts);

  const ok =
    identityOk &&
    vocabOk &&
    countsOk &&
    frozen &&
    nonLinearTransitionCapable &&
    module.presentationStateIndependent === true &&
    module.dialIndependent === true &&
    module.automotiveStylingIndependent === true &&
    module.rendererIndependent === true &&
    module.resolutionFree === true &&
    module.orchestrationFree === true &&
    module.nonLinearTransitionCapable === true &&
    upstream.ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveWorkspaceExperienceContractsIdentity,
    version: runtimeExecutiveWorkspaceExperienceContractsVersion,
    namespace: runtimeExecutiveWorkspaceExperienceContractsNamespace,
    phase: runtimeExecutiveWorkspaceExperienceContractsPhase,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceContractsDependencyIdentity,
    contractFamilyCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES.length,
    issueCodeCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ISSUE_CODES.length,
    transitionOutcomeStatusCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES.length,
    guaranteeCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES.length,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS.length,
    sectionCount: RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveWorkspaceExperienceContractsApiNames.length,
    frozen,
    foundationBoundaryIntact:
      module.foundationBoundary === "REX-6:1-foundation-only",
    presentationStateIndependent: module.presentationStateIndependent === true,
    nonLinearTransitionCapable,
    dialIndependent: module.dialIndependent === true,
    automotiveStylingIndependent:
      module.automotiveStylingIndependent === true,
    rendererIndependent: module.rendererIndependent === true,
    resolutionFree: module.resolutionFree === true,
    orchestrationFree: module.orchestrationFree === true,
    upstreamFoundationOk: upstream.ok === true,
  });
}
