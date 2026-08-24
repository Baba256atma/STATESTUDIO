/**
 * REX-2:1 — Runtime Executive Stage Experience Foundation.
 *
 * Establishes renderer-neutral runtime semantics for the Executive Stage:
 * subjects, selection, focus, presentation, visibility, attention,
 * connections, scene membership, and executive context.
 *
 * Canonical flow:
 *   REX-1:9 Public Index → REX-2:1 Runtime Executive Stage Experience Foundation
 *
 * Foundation only. No React, Three.js, animation, orchestration, or UI.
 *
 * The Executive Stage is not a dashboard canvas.
 * It is a runtime executive scene.
 */

import {
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RUNTIME_AUTHORITY_POLICY,
  runtimeEnabledExecutiveExperiencePublicIndexIdentity,
  runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
  runtimeEnabledExecutiveExperiencePublicIndexVersion,
  verifyRuntimeEnabledExecutiveExperienceConsumerEntry,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveStageExperienceFoundationIdentity =
  "REX-2:1/RuntimeExecutiveStageExperienceFoundation" as const;

export const runtimeExecutiveStageExperienceFoundationVersion =
  "2.1.0" as const;

export const runtimeExecutiveStageExperienceFoundationNamespace =
  "nexora.rex.stage.foundation" as const;

export const runtimeExecutiveStageExperienceFoundationLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveStageExperienceFoundationDomain =
  "ExecutiveStage" as const;

export const runtimeExecutiveStageExperienceFoundationPhase =
  "Foundation" as const;

export const runtimeExecutiveStageExperienceFoundationArchitecturalRole =
  "RuntimeExecutiveStageExperienceFoundationBoundary" as const;

export const runtimeExecutiveStageExperienceFoundationDependencyIdentity =
  runtimeEnabledExecutiveExperiencePublicIndexIdentity;

export const runtimeExecutiveStageExperienceFoundationDependencyPath =
  runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath;

export const runtimeExecutiveStageExperienceFoundationStability =
  "FoundationReady" as const;

export const runtimeExecutiveStageExperienceFoundationDeterministic =
  true as const;

export const runtimeExecutiveStageExperienceFoundationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveStageExperienceFoundationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveStageExperienceFoundationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveStageExperienceFoundationIdentity,
    version: runtimeExecutiveStageExperienceFoundationVersion,
    namespace: runtimeExecutiveStageExperienceFoundationNamespace,
    layer: runtimeExecutiveStageExperienceFoundationLayer,
    domain: runtimeExecutiveStageExperienceFoundationDomain,
    phase: runtimeExecutiveStageExperienceFoundationPhase,
    architecturalRole:
      runtimeExecutiveStageExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveStageExperienceFoundationDependencyIdentity,
    dependencyPath: runtimeExecutiveStageExperienceFoundationDependencyPath,
    upstreamVersion: runtimeEnabledExecutiveExperiencePublicIndexVersion,
    stabilityStatus: runtimeExecutiveStageExperienceFoundationStability,
    deterministicStatus:
      runtimeExecutiveStageExperienceFoundationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveStageExperienceFoundationSideEffectPolicy,
    mutationPolicy: runtimeExecutiveStageExperienceFoundationMutationPolicy,
    runtimeAuthorityPolicy:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RUNTIME_AUTHORITY_POLICY,
  });

export const RUNTIME_EXECUTIVE_STAGE_FOUNDATION_PRINCIPLE =
  "The Executive Stage is a runtime executive scene — subjects, focus, selection, presentation, visibility, attention, relationships, connections, and context — not a dashboard canvas." as const;

export const RUNTIME_EXECUTIVE_STAGE_FOUNDATION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-enabled-Executive-Experience" as const,
  stageAuthority: "REX-2:1" as const,
  architecturalRole:
    "RuntimeExecutiveStageExperienceFoundationBoundary" as const,
  soleImmediateDependency:
    "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" as const,
  consumesPublicIndexOnly: true as const,
  importsRex1InternalDirectly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  introducesRendering: false as const,
  introducesOrchestration: false as const,
  introducesSelectionEngine: false as const,
  introducesFocusResolution: false as const,
  introducesAttentionResolution: false as const,
  encodesRendererStyling: false as const,
});

export const RUNTIME_EXECUTIVE_STAGE_FOUNDATION_RELATIONSHIP_CHAIN =
  Object.freeze([
    "Executive Context",
    "Stage Scene",
    "Stage Subjects",
    "Selection / Focus / Attention",
    "Presentation State",
    "Connections",
  ] as const);

// ─── Vocabularies (reuse frozen REX-1 where available) ───────────────────────

/**
 * Canonical presentation states — reused exactly from REX-1:9 frozen surface.
 * minimum = executive glance; report = understanding; operation = action.
 */
export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES =
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES;

export type RuntimeExecutiveStagePresentationState =
  (typeof RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES)[number];

/**
 * Stage subject kinds: frozen REX-1 kinds plus Stage-only kinds not published
 * upstream (task, insight, advisor-subject). object ≡ NexoraObject;
 * execution ≡ ExecutionPlan. Do not introduce KOR.
 */
export const RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS = Object.freeze([
  ...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
  "task",
  "insight",
  "advisor-subject",
] as const);

export type RuntimeExecutiveStageSubjectKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS)[number];

export const RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES = Object.freeze([
  "visible",
  "hidden",
  "collapsed",
] as const);

export type RuntimeExecutiveStageVisibility =
  (typeof RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES)[number];

export const RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES = Object.freeze([
  "unselected",
  "selected",
] as const);

export type RuntimeExecutiveStageSelectionState =
  (typeof RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES)[number];

/**
 * Focus roles — selected ≠ focused.
 * primary / secondary / contextual / background / unfocused.
 */
export const RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES = Object.freeze([
  "primary",
  "secondary",
  "contextual",
  "background",
  "unfocused",
] as const);

export type RuntimeExecutiveStageFocusRole =
  (typeof RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES)[number];

/**
 * Attention levels — executive awareness strength only.
 * Does not encode color or renderer styling.
 */
export const RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS = Object.freeze([
  "normal",
  "informational",
  "elevated",
  "warning",
  "critical",
] as const);

export type RuntimeExecutiveStageAttentionLevel =
  (typeof RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS)[number];

export const RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS = Object.freeze([
  "dependency",
  "influence",
  "flow",
  "hierarchy",
  "kpi-relationship",
  "koi-relationship",
  "impact",
  "execution",
  "contextual",
] as const);

export type RuntimeExecutiveStageConnectionKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS)[number];

export const RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS = Object.freeze([
  "directed",
  "bidirectional",
  "undirected",
] as const);

export type RuntimeExecutiveStageConnectionDirection =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS)[number];

export const RUNTIME_EXECUTIVE_STAGE_CONNECTION_STATES = Object.freeze([
  "inactive",
  "active",
  "emphasized",
] as const);

export type RuntimeExecutiveStageConnectionState =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONNECTION_STATES)[number];

export const RUNTIME_EXECUTIVE_STAGE_SCENE_STATES = Object.freeze([
  "idle",
  "active",
  "transitioning",
] as const);

export type RuntimeExecutiveStageSceneState =
  (typeof RUNTIME_EXECUTIVE_STAGE_SCENE_STATES)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveStageSubject {
  readonly subjectId: string;
  readonly kind: RuntimeExecutiveStageSubjectKind;
  readonly parentId?: string;
  readonly label?: string;
  readonly presentationState: RuntimeExecutiveStagePresentationState;
  readonly visibility: RuntimeExecutiveStageVisibility;
  readonly selection: RuntimeExecutiveStageSelectionState;
  readonly focusRole: RuntimeExecutiveStageFocusRole;
  readonly attention: RuntimeExecutiveStageAttentionLevel;
  readonly lifecycleState?: string;
  readonly sourceVersion?: string;
}

export interface RuntimeExecutiveStageConnection {
  readonly connectionId: string;
  readonly sourceSubjectId: string;
  readonly targetSubjectId: string;
  readonly kind: RuntimeExecutiveStageConnectionKind;
  readonly direction: RuntimeExecutiveStageConnectionDirection;
  readonly state: RuntimeExecutiveStageConnectionState;
  readonly attention?: RuntimeExecutiveStageAttentionLevel;
  readonly label?: string;
}

export interface RuntimeExecutiveStageContext {
  readonly contextId: string;
  readonly experienceId?: string;
  readonly activeSubjectId?: string;
  readonly goalId?: string;
  readonly intentionId?: string;
  readonly presentationState?: RuntimeExecutiveStagePresentationState;
  readonly runtimeContextId?: string;
  readonly mode?: string;
  readonly lens?: string;
  readonly runtimeAuthorityPolicy: typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RUNTIME_AUTHORITY_POLICY;
}

export interface RuntimeExecutiveStageScene {
  readonly sceneId: string;
  readonly revision: string;
  readonly subjects: ReadonlyArray<RuntimeExecutiveStageSubject>;
  readonly connections: ReadonlyArray<RuntimeExecutiveStageConnection>;
  readonly selectedSubjectId?: string;
  readonly primaryFocusSubjectId?: string;
  readonly presentationContext?: RuntimeExecutiveStagePresentationState;
  readonly sceneState: RuntimeExecutiveStageSceneState;
  readonly context: RuntimeExecutiveStageContext;
  readonly foundationIdentity: typeof runtimeExecutiveStageExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeExecutiveStageExperienceFoundationVersion;
}

export interface RuntimeExecutiveStageSnapshot {
  readonly snapshotId: string;
  readonly scene: RuntimeExecutiveStageScene;
  readonly observedRevision: string;
  readonly selectedSubjectId?: string;
  readonly primaryFocusSubjectId?: string;
  readonly subjectCount: number;
  readonly connectionCount: number;
  readonly foundationIdentity: typeof runtimeExecutiveStageExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeExecutiveStageExperienceFoundationVersion;
  readonly timestampIso?: string;
}

export interface RuntimeExecutiveStageFoundationIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

// ─── Invariants / guarantees ────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "stable-subject-identifier",
    order: 1,
    statement: "Every Stage subject has a stable identifier.",
  }),
  Object.freeze({
    id: "unique-subject-identifiers",
    order: 2,
    statement: "Subject identifiers within a scene are unique.",
  }),
  Object.freeze({
    id: "connection-endpoints-valid",
    order: 3,
    statement: "Every connection references valid Stage subjects.",
  }),
  Object.freeze({
    id: "selection-focus-separate",
    order: 4,
    statement: "Selection and focus are separate concepts.",
  }),
  Object.freeze({
    id: "single-selected-subject",
    order: 5,
    statement:
      "At most one canonical selected subject exists when using single-selection Stage semantics.",
  }),
  Object.freeze({
    id: "single-primary-focus",
    order: 6,
    statement: "At most one primary focus subject exists.",
  }),
  Object.freeze({
    id: "canonical-presentation-states",
    order: 7,
    statement:
      "Presentation state is one of the approved three canonical states.",
  }),
  Object.freeze({
    id: "visibility-presentation-independent",
    order: 8,
    statement: "Visibility and presentation state are independent.",
  }),
  Object.freeze({
    id: "attention-not-styling",
    order: 9,
    statement: "Attention does not directly encode renderer styling.",
  }),
  Object.freeze({
    id: "connections-semantic-not-graphic",
    order: 10,
    statement: "Connections contain semantics, not graphics.",
  }),
  Object.freeze({
    id: "deterministic-scene-order",
    order: 11,
    statement: "Scene order is deterministic.",
  }),
  Object.freeze({
    id: "no-caller-input-mutation",
    order: 12,
    statement: "Foundation APIs do not mutate caller input.",
  }),
  Object.freeze({
    id: "no-renderer-specific-state",
    order: 13,
    statement: "No renderer-specific state enters the Foundation.",
  }),
  Object.freeze({
    id: "no-ui-component-identity",
    order: 14,
    statement: "No UI component identity enters the Foundation.",
  }),
  Object.freeze({
    id: "reuse-upstream-rex-1-types",
    order: 15,
    statement:
      "Upstream canonical REX-1 types are reused rather than forked where available.",
  }),
] as const);

export type RuntimeExecutiveStageFoundationInvariant =
  (typeof RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_STAGE_FOUNDATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React components",
    "Stage JSX",
    "Three.js",
    "React Three Fiber",
    "camera control",
    "object positioning",
    "layout algorithms",
    "animation",
    "transitions",
    "materials",
    "colors",
    "meshes",
    "arrows",
    "connection geometry",
    "click handlers",
    "hover handlers",
    "keyboard handlers",
    "scene orchestration engine",
    "selection engine",
    "focus resolution engine",
    "attention resolution engine",
    "presentation-state resolver",
    "Director decision logic",
    "Advisor behavior",
    "timeline behavior",
    "persistence",
    "network/API behavior",
    "telemetry",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_FOUNDATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "SubjectKinds",
    "PresentationStates",
    "Visibility",
    "Selection",
    "Focus",
    "Attention",
    "Connections",
    "Scene",
    "Context",
    "Snapshot",
    "Invariants",
    "APIs",
    "Validation",
  ] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveStagePresentationState(
  value: unknown,
): value is RuntimeExecutiveStagePresentationState {
  return (
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageSubjectKind(
  value: unknown,
): value is RuntimeExecutiveStageSubjectKind {
  return (
    RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageVisibility(
  value: unknown,
): value is RuntimeExecutiveStageVisibility {
  return (
    RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageSelectionState(
  value: unknown,
): value is RuntimeExecutiveStageSelectionState {
  return (
    RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageFocusRole(
  value: unknown,
): value is RuntimeExecutiveStageFocusRole {
  return (
    RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageAttentionLevel(
  value: unknown,
): value is RuntimeExecutiveStageAttentionLevel {
  return (
    RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageConnectionKind(
  value: unknown,
): value is RuntimeExecutiveStageConnectionKind {
  return (
    RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageConnectionDirection(
  value: unknown,
): value is RuntimeExecutiveStageConnectionDirection {
  return (
    RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageSceneState(
  value: unknown,
): value is RuntimeExecutiveStageSceneState {
  return (
    RUNTIME_EXECUTIVE_STAGE_SCENE_STATES as readonly unknown[]
  ).includes(value);
}

// ─── Subject helpers ────────────────────────────────────────────────────────

export function createRuntimeExecutiveStageSubject(input: {
  readonly subjectId: string;
  readonly kind: RuntimeExecutiveStageSubjectKind;
  readonly parentId?: string;
  readonly label?: string;
  readonly presentationState?: RuntimeExecutiveStagePresentationState;
  readonly visibility?: RuntimeExecutiveStageVisibility;
  readonly selection?: RuntimeExecutiveStageSelectionState;
  readonly focusRole?: RuntimeExecutiveStageFocusRole;
  readonly attention?: RuntimeExecutiveStageAttentionLevel;
  readonly lifecycleState?: string;
  readonly sourceVersion?: string;
}): RuntimeExecutiveStageSubject {
  if (!isNonEmptyString(input.subjectId)) {
    throw new TypeError("subjectId must be a non-empty string");
  }
  if (!isRuntimeExecutiveStageSubjectKind(input.kind)) {
    throw new TypeError("kind must be a known Stage subject kind");
  }
  const presentationState = input.presentationState ?? "minimum";
  if (!isRuntimeExecutiveStagePresentationState(presentationState)) {
    throw new TypeError("presentationState must be minimum, report, or operation");
  }
  const visibility = input.visibility ?? "visible";
  if (!isRuntimeExecutiveStageVisibility(visibility)) {
    throw new TypeError("visibility must be visible, hidden, or collapsed");
  }
  const selection = input.selection ?? "unselected";
  if (!isRuntimeExecutiveStageSelectionState(selection)) {
    throw new TypeError("selection must be unselected or selected");
  }
  const focusRole = input.focusRole ?? "unfocused";
  if (!isRuntimeExecutiveStageFocusRole(focusRole)) {
    throw new TypeError("focusRole is invalid");
  }
  const attention = input.attention ?? "normal";
  if (!isRuntimeExecutiveStageAttentionLevel(attention)) {
    throw new TypeError("attention is invalid");
  }

  return Object.freeze({
    subjectId: input.subjectId,
    kind: input.kind,
    presentationState,
    visibility,
    selection,
    focusRole,
    attention,
    ...(input.parentId !== undefined ? { parentId: input.parentId } : {}),
    ...(input.label !== undefined ? { label: input.label } : {}),
    ...(input.lifecycleState !== undefined
      ? { lifecycleState: input.lifecycleState }
      : {}),
    ...(input.sourceVersion !== undefined
      ? { sourceVersion: input.sourceVersion }
      : {}),
  });
}

export function isRuntimeExecutiveStageSubjectSelected(
  subject: RuntimeExecutiveStageSubject,
): boolean {
  return subject.selection === "selected";
}

export function isRuntimeExecutiveStageSubjectFocused(
  subject: RuntimeExecutiveStageSubject,
): boolean {
  return subject.focusRole !== "unfocused";
}

export function isRuntimeExecutiveStageSubjectVisible(
  subject: RuntimeExecutiveStageSubject,
): boolean {
  return subject.visibility === "visible";
}

export function getRuntimeExecutiveStageSubjectPresentationState(
  subject: RuntimeExecutiveStageSubject,
): RuntimeExecutiveStagePresentationState {
  return subject.presentationState;
}

export function getRuntimeExecutiveStageSubjectAttention(
  subject: RuntimeExecutiveStageSubject,
): RuntimeExecutiveStageAttentionLevel {
  return subject.attention;
}

// ─── Connection helpers ─────────────────────────────────────────────────────

export function createRuntimeExecutiveStageConnection(input: {
  readonly connectionId: string;
  readonly sourceSubjectId: string;
  readonly targetSubjectId: string;
  readonly kind: RuntimeExecutiveStageConnectionKind;
  readonly direction?: RuntimeExecutiveStageConnectionDirection;
  readonly state?: RuntimeExecutiveStageConnectionState;
  readonly attention?: RuntimeExecutiveStageAttentionLevel;
  readonly label?: string;
}): RuntimeExecutiveStageConnection {
  if (!isNonEmptyString(input.connectionId)) {
    throw new TypeError("connectionId must be a non-empty string");
  }
  if (!isNonEmptyString(input.sourceSubjectId)) {
    throw new TypeError("sourceSubjectId must be a non-empty string");
  }
  if (!isNonEmptyString(input.targetSubjectId)) {
    throw new TypeError("targetSubjectId must be a non-empty string");
  }
  if (!isRuntimeExecutiveStageConnectionKind(input.kind)) {
    throw new TypeError("kind must be a known Stage connection kind");
  }
  const direction = input.direction ?? "directed";
  if (!isRuntimeExecutiveStageConnectionDirection(direction)) {
    throw new TypeError("direction is invalid");
  }
  const state = input.state ?? "inactive";
  if (
    !(
      RUNTIME_EXECUTIVE_STAGE_CONNECTION_STATES as readonly string[]
    ).includes(state)
  ) {
    throw new TypeError("connection state is invalid");
  }
  if (
    input.attention !== undefined &&
    !isRuntimeExecutiveStageAttentionLevel(input.attention)
  ) {
    throw new TypeError("attention is invalid");
  }

  return Object.freeze({
    connectionId: input.connectionId,
    sourceSubjectId: input.sourceSubjectId,
    targetSubjectId: input.targetSubjectId,
    kind: input.kind,
    direction,
    state,
    ...(input.attention !== undefined ? { attention: input.attention } : {}),
    ...(input.label !== undefined ? { label: input.label } : {}),
  });
}

export function getRuntimeExecutiveStageConnectionDirection(
  connection: RuntimeExecutiveStageConnection,
): RuntimeExecutiveStageConnectionDirection {
  return connection.direction;
}

// ─── Context / scene / snapshot ─────────────────────────────────────────────

export function createRuntimeExecutiveStageContext(input: {
  readonly contextId: string;
  readonly experienceId?: string;
  readonly activeSubjectId?: string;
  readonly goalId?: string;
  readonly intentionId?: string;
  readonly presentationState?: RuntimeExecutiveStagePresentationState;
  readonly runtimeContextId?: string;
  readonly mode?: string;
  readonly lens?: string;
}): RuntimeExecutiveStageContext {
  if (!isNonEmptyString(input.contextId)) {
    throw new TypeError("contextId must be a non-empty string");
  }
  if (
    input.presentationState !== undefined &&
    !isRuntimeExecutiveStagePresentationState(input.presentationState)
  ) {
    throw new TypeError("presentationState must be minimum, report, or operation");
  }

  return Object.freeze({
    contextId: input.contextId,
    runtimeAuthorityPolicy:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RUNTIME_AUTHORITY_POLICY,
    ...(input.experienceId !== undefined
      ? { experienceId: input.experienceId }
      : {}),
    ...(input.activeSubjectId !== undefined
      ? { activeSubjectId: input.activeSubjectId }
      : {}),
    ...(input.goalId !== undefined ? { goalId: input.goalId } : {}),
    ...(input.intentionId !== undefined
      ? { intentionId: input.intentionId }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.runtimeContextId !== undefined
      ? { runtimeContextId: input.runtimeContextId }
      : {}),
    ...(input.mode !== undefined ? { mode: input.mode } : {}),
    ...(input.lens !== undefined ? { lens: input.lens } : {}),
  });
}

export function createRuntimeExecutiveStageScene(input: {
  readonly sceneId: string;
  readonly revision: string;
  readonly subjects: ReadonlyArray<RuntimeExecutiveStageSubject>;
  readonly connections?: ReadonlyArray<RuntimeExecutiveStageConnection>;
  readonly selectedSubjectId?: string;
  readonly primaryFocusSubjectId?: string;
  readonly presentationContext?: RuntimeExecutiveStagePresentationState;
  readonly sceneState?: RuntimeExecutiveStageSceneState;
  readonly context: RuntimeExecutiveStageContext;
}): RuntimeExecutiveStageScene {
  if (!isNonEmptyString(input.sceneId)) {
    throw new TypeError("sceneId must be a non-empty string");
  }
  if (!isNonEmptyString(input.revision)) {
    throw new TypeError("revision must be a non-empty string");
  }
  if (!Array.isArray(input.subjects)) {
    throw new TypeError("subjects must be a readonly array");
  }

  const subjects = Object.freeze(input.subjects.map((subject) => Object.freeze({ ...subject })));
  const connections = Object.freeze(
    (input.connections ?? []).map((connection) =>
      Object.freeze({ ...connection }),
    ),
  );
  const sceneState = input.sceneState ?? "idle";
  if (!isRuntimeExecutiveStageSceneState(sceneState)) {
    throw new TypeError("sceneState must be idle, active, or transitioning");
  }
  if (
    input.presentationContext !== undefined &&
    !isRuntimeExecutiveStagePresentationState(input.presentationContext)
  ) {
    throw new TypeError("presentationContext must be minimum, report, or operation");
  }

  const subjectIds = subjects.map((subject) => subject.subjectId);
  if (!unique(subjectIds)) {
    throw new TypeError("subject identifiers within a scene must be unique");
  }

  const idSet = new Set(subjectIds);
  for (const connection of connections) {
    if (
      !idSet.has(connection.sourceSubjectId) ||
      !idSet.has(connection.targetSubjectId)
    ) {
      throw new TypeError(
        `connection ${connection.connectionId} references unknown Stage subjects`,
      );
    }
  }

  const selectedCount = subjects.filter(
    (subject) => subject.selection === "selected",
  ).length;
  if (selectedCount > 1) {
    throw new TypeError(
      "single-selection Stage semantics allow at most one selected subject",
    );
  }
  if (
    input.selectedSubjectId !== undefined &&
    !idSet.has(input.selectedSubjectId)
  ) {
    throw new TypeError("selectedSubjectId must reference a scene subject");
  }
  if (
    input.selectedSubjectId !== undefined &&
    subjects.find((subject) => subject.subjectId === input.selectedSubjectId)
      ?.selection !== "selected"
  ) {
    throw new TypeError(
      "selectedSubjectId must reference a subject with selection=selected",
    );
  }

  const primaryFocusCount = subjects.filter(
    (subject) => subject.focusRole === "primary",
  ).length;
  if (primaryFocusCount > 1) {
    throw new TypeError("at most one primary focus subject may exist");
  }
  if (
    input.primaryFocusSubjectId !== undefined &&
    !idSet.has(input.primaryFocusSubjectId)
  ) {
    throw new TypeError("primaryFocusSubjectId must reference a scene subject");
  }
  if (
    input.primaryFocusSubjectId !== undefined &&
    subjects.find(
      (subject) => subject.subjectId === input.primaryFocusSubjectId,
    )?.focusRole !== "primary"
  ) {
    throw new TypeError(
      "primaryFocusSubjectId must reference a subject with focusRole=primary",
    );
  }

  return Object.freeze({
    sceneId: input.sceneId,
    revision: input.revision,
    subjects,
    connections,
    sceneState,
    context: input.context,
    foundationIdentity: runtimeExecutiveStageExperienceFoundationIdentity,
    foundationVersion: runtimeExecutiveStageExperienceFoundationVersion,
    ...(input.selectedSubjectId !== undefined
      ? { selectedSubjectId: input.selectedSubjectId }
      : {}),
    ...(input.primaryFocusSubjectId !== undefined
      ? { primaryFocusSubjectId: input.primaryFocusSubjectId }
      : {}),
    ...(input.presentationContext !== undefined
      ? { presentationContext: input.presentationContext }
      : {}),
  });
}

export function createRuntimeExecutiveStageSnapshot(input: {
  readonly snapshotId: string;
  readonly scene: RuntimeExecutiveStageScene;
  readonly timestampIso?: string;
}): RuntimeExecutiveStageSnapshot {
  if (!isNonEmptyString(input.snapshotId)) {
    throw new TypeError("snapshotId must be a non-empty opaque identifier");
  }
  return Object.freeze({
    snapshotId: input.snapshotId,
    scene: input.scene,
    observedRevision: input.scene.revision,
    subjectCount: input.scene.subjects.length,
    connectionCount: input.scene.connections.length,
    foundationIdentity: runtimeExecutiveStageExperienceFoundationIdentity,
    foundationVersion: runtimeExecutiveStageExperienceFoundationVersion,
    ...(input.scene.selectedSubjectId !== undefined
      ? { selectedSubjectId: input.scene.selectedSubjectId }
      : {}),
    ...(input.scene.primaryFocusSubjectId !== undefined
      ? { primaryFocusSubjectId: input.scene.primaryFocusSubjectId }
      : {}),
    ...(input.timestampIso !== undefined
      ? { timestampIso: input.timestampIso }
      : {}),
  });
}

export function getRuntimeExecutiveStageSubjectById(
  scene: RuntimeExecutiveStageScene,
  subjectId: string,
): RuntimeExecutiveStageSubject | undefined {
  return scene.subjects.find((subject) => subject.subjectId === subjectId);
}

export function getRuntimeExecutiveStageSelectedSubject(
  scene: RuntimeExecutiveStageScene,
): RuntimeExecutiveStageSubject | undefined {
  if (scene.selectedSubjectId !== undefined) {
    return getRuntimeExecutiveStageSubjectById(scene, scene.selectedSubjectId);
  }
  return scene.subjects.find((subject) => subject.selection === "selected");
}

export function getRuntimeExecutiveStagePrimaryFocusSubject(
  scene: RuntimeExecutiveStageScene,
): RuntimeExecutiveStageSubject | undefined {
  if (scene.primaryFocusSubjectId !== undefined) {
    return getRuntimeExecutiveStageSubjectById(
      scene,
      scene.primaryFocusSubjectId,
    );
  }
  return scene.subjects.find((subject) => subject.focusRole === "primary");
}

export function getRuntimeExecutiveStageConnectionsForSubject(
  scene: RuntimeExecutiveStageScene,
  subjectId: string,
): ReadonlyArray<RuntimeExecutiveStageConnection> {
  return Object.freeze(
    scene.connections.filter(
      (connection) =>
        connection.sourceSubjectId === subjectId ||
        connection.targetSubjectId === subjectId,
    ),
  );
}

export function validateRuntimeExecutiveStageScene(
  value: unknown,
): value is RuntimeExecutiveStageScene {
  if (!isPlainObject(value)) return false;
  if (!isNonEmptyString(value.sceneId) || !isNonEmptyString(value.revision)) {
    return false;
  }
  if (!Array.isArray(value.subjects) || !Array.isArray(value.connections)) {
    return false;
  }
  if (!isRuntimeExecutiveStageSceneState(value.sceneState)) return false;
  if (
    value.foundationIdentity !==
      runtimeExecutiveStageExperienceFoundationIdentity ||
    value.foundationVersion !==
      runtimeExecutiveStageExperienceFoundationVersion
  ) {
    return false;
  }

  const subjectIds = value.subjects.map(
    (subject: { subjectId?: unknown }) => subject.subjectId,
  );
  if (
    !subjectIds.every(isNonEmptyString) ||
    !unique(subjectIds as string[])
  ) {
    return false;
  }
  const idSet = new Set(subjectIds as string[]);
  for (const connection of value.connections as RuntimeExecutiveStageConnection[]) {
    if (
      !idSet.has(connection.sourceSubjectId) ||
      !idSet.has(connection.targetSubjectId)
    ) {
      return false;
    }
  }

  const selected = (
    value.subjects as RuntimeExecutiveStageSubject[]
  ).filter((subject) => subject.selection === "selected");
  if (selected.length > 1) return false;
  const primary = (
    value.subjects as RuntimeExecutiveStageSubject[]
  ).filter((subject) => subject.focusRole === "primary");
  if (primary.length > 1) return false;

  return true;
}

export function getRuntimeExecutiveStageExperienceFoundationIdentity():
  typeof runtimeExecutiveStageExperienceFoundationCanonicalIdentity {
  return runtimeExecutiveStageExperienceFoundationCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveStageExperienceFoundationApiNames = Object.freeze([
  "createRuntimeExecutiveStageSubject",
  "isRuntimeExecutiveStageSubjectSelected",
  "isRuntimeExecutiveStageSubjectFocused",
  "isRuntimeExecutiveStageSubjectVisible",
  "getRuntimeExecutiveStageSubjectPresentationState",
  "getRuntimeExecutiveStageSubjectAttention",
  "createRuntimeExecutiveStageConnection",
  "getRuntimeExecutiveStageConnectionDirection",
  "createRuntimeExecutiveStageContext",
  "createRuntimeExecutiveStageScene",
  "createRuntimeExecutiveStageSnapshot",
  "getRuntimeExecutiveStageSubjectById",
  "getRuntimeExecutiveStageSelectedSubject",
  "getRuntimeExecutiveStagePrimaryFocusSubject",
  "getRuntimeExecutiveStageConnectionsForSubject",
  "isRuntimeExecutiveStagePresentationState",
  "isRuntimeExecutiveStageSubjectKind",
  "isRuntimeExecutiveStageVisibility",
  "isRuntimeExecutiveStageSelectionState",
  "isRuntimeExecutiveStageFocusRole",
  "isRuntimeExecutiveStageAttentionLevel",
  "isRuntimeExecutiveStageConnectionKind",
  "isRuntimeExecutiveStageConnectionDirection",
  "isRuntimeExecutiveStageSceneState",
  "validateRuntimeExecutiveStageScene",
  "verifyRuntimeExecutiveStageExperienceFoundation",
  "getRuntimeExecutiveStageExperienceFoundationIdentity",
] as const);

export const runtimeExecutiveStageExperienceFoundationRegistry = Object.freeze({
  identity: runtimeExecutiveStageExperienceFoundationIdentity,
  version: runtimeExecutiveStageExperienceFoundationVersion,
  namespace: runtimeExecutiveStageExperienceFoundationNamespace,
  layer: runtimeExecutiveStageExperienceFoundationLayer,
  domain: runtimeExecutiveStageExperienceFoundationDomain,
  phase: runtimeExecutiveStageExperienceFoundationPhase,
  dependencyIdentity:
    runtimeExecutiveStageExperienceFoundationDependencyIdentity,
  dependencyPath: runtimeExecutiveStageExperienceFoundationDependencyPath,
  sections: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_REGISTRY_SECTIONS.length,
  subjectKinds: RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS,
  subjectKindCount: RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS.length,
  presentationStates: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES,
  presentationStateCount: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES.length,
  visibilityStates: RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES,
  visibilityStateCount: RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES.length,
  selectionStates: RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES,
  selectionStateCount: RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES.length,
  focusRoles: RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES,
  focusRoleCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES.length,
  attentionLevels: RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS,
  attentionLevelCount: RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS.length,
  connectionKinds: RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS,
  connectionKindCount: RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS.length,
  connectionDirections: RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS,
  connectionDirectionCount:
    RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS.length,
  sceneStates: RUNTIME_EXECUTIVE_STAGE_SCENE_STATES,
  sceneStateCount: RUNTIME_EXECUTIVE_STAGE_SCENE_STATES.length,
  invariants: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS,
  invariantCount: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS.length,
  publicApis: runtimeExecutiveStageExperienceFoundationApiNames,
  publicApiCount: runtimeExecutiveStageExperienceFoundationApiNames.length,
  relationshipChain: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_RELATIONSHIP_CHAIN,
});

export const runtimeExecutiveStageExperienceFoundation = Object.freeze({
  phase: "Foundation" as const,
  name: "RuntimeExecutiveStageExperienceFoundation" as const,
  identity: runtimeExecutiveStageExperienceFoundationIdentity,
  version: runtimeExecutiveStageExperienceFoundationVersion,
  namespace: runtimeExecutiveStageExperienceFoundationNamespace,
  layer: runtimeExecutiveStageExperienceFoundationLayer,
  domain: runtimeExecutiveStageExperienceFoundationDomain,
  architecturalRole:
    runtimeExecutiveStageExperienceFoundationArchitecturalRole,
  role: "Foundation" as const,
  status: runtimeExecutiveStageExperienceFoundationStability,
  upstreamDependency:
    runtimeExecutiveStageExperienceFoundationDependencyIdentity,
  dependencyPath: runtimeExecutiveStageExperienceFoundationDependencyPath,
  deterministic: runtimeExecutiveStageExperienceFoundationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_BOUNDARY,
  presentationStates: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES,
  subjectKinds: RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS,
  visibilityStates: RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES,
  selectionStates: RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES,
  focusRoles: RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES,
  attentionLevels: RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS,
  connectionKinds: RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS,
  connectionDirections: RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS,
  sceneStates: RUNTIME_EXECUTIVE_STAGE_SCENE_STATES,
  invariants: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_STAGE_FOUNDATION_FORBIDDEN_RESPONSIBILITIES,
  relationshipChain: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_RELATIONSHIP_CHAIN,
  publicApiSurface: runtimeExecutiveStageExperienceFoundationApiNames,
  registry: runtimeExecutiveStageExperienceFoundationRegistry,
  publicIndexBoundary: "REX-1:9-public-index-only" as const,
  architecturalStatus:
    "REX-2:1 Foundation Complete — Ready for REX-2:2 Runtime Executive Stage Experience Contracts" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveStageExperienceFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveStageExperienceFoundationIdentity;
  readonly version: typeof runtimeExecutiveStageExperienceFoundationVersion;
  readonly namespace: typeof runtimeExecutiveStageExperienceFoundationNamespace;
  readonly layer: typeof runtimeExecutiveStageExperienceFoundationLayer;
  readonly domain: typeof runtimeExecutiveStageExperienceFoundationDomain;
  readonly phase: typeof runtimeExecutiveStageExperienceFoundationPhase;
  readonly dependencyIdentity: typeof runtimeExecutiveStageExperienceFoundationDependencyIdentity;
  readonly subjectKindCount: number;
  readonly presentationStateCount: number;
  readonly visibilityStateCount: number;
  readonly selectionStateCount: number;
  readonly focusRoleCount: number;
  readonly attentionLevelCount: number;
  readonly connectionKindCount: number;
  readonly connectionDirectionCount: number;
  readonly sceneStateCount: number;
  readonly invariantCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly publicIndexBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly reusesUpstreamPresentationStates: boolean;
  readonly reusesUpstreamSubjectKinds: boolean;
  readonly upstreamConsumerEntryOk: boolean;
}

export function verifyRuntimeExecutiveStageExperienceFoundation():
  RuntimeExecutiveStageExperienceFoundationVerification {
  const runtimeModule = runtimeExecutiveStageExperienceFoundation;
  const registry = runtimeExecutiveStageExperienceFoundationRegistry;
  const upstream = verifyRuntimeEnabledExecutiveExperienceConsumerEntry();

  const identityOk =
    runtimeModule.identity === "REX-2:1/RuntimeExecutiveStageExperienceFoundation" &&
    runtimeModule.version === "2.1.0" &&
    runtimeModule.namespace === "nexora.rex.stage.foundation" &&
    runtimeModule.layer === "RuntimeExecutiveExperience" &&
    runtimeModule.domain === "ExecutiveStage" &&
    runtimeModule.phase === "Foundation" &&
    runtimeModule.upstreamDependency ===
      "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" &&
    runtimeModule.upstreamDependency ===
      runtimeEnabledExecutiveExperiencePublicIndexIdentity &&
    runtimeModule.dependencyPath ===
      "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex" &&
    runtimeModule.publicIndexBoundary === "REX-1:9-public-index-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES], [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES], [
      "visible",
      "hidden",
      "collapsed",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES], [
      "unselected",
      "selected",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES], [
      "primary",
      "secondary",
      "contextual",
      "background",
      "unfocused",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS], [
      "normal",
      "informational",
      "elevated",
      "warning",
      "critical",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS], [
      "directed",
      "bidirectional",
      "undirected",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_STAGE_SCENE_STATES], [
      "idle",
      "active",
      "transitioning",
    ]) &&
    RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS.includes("object") &&
    RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS.includes("goal") &&
    RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS.includes("task") &&
    RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS.includes("insight") &&
    RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS.includes("advisor-subject") &&
    !RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS.includes("kor" as never);

  const reusesUpstreamPresentationStates =
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES ===
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES;

  const reusesUpstreamSubjectKinds =
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS.every((kind) =>
      RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS.includes(kind),
    );

  const invariantsOk =
    RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS.length === 15 &&
    RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS.map((entry) => entry.id),
    );

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(runtimeExecutiveStageExperienceFoundationCanonicalIdentity) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_SCENE_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_FOUNDATION_BOUNDARY);

  const publicIndexBoundaryIntact =
    runtimeModule.boundary.soleImmediateDependency ===
      "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" &&
    runtimeModule.boundary.consumesPublicIndexOnly === true &&
    runtimeModule.boundary.importsRex1InternalDirectly === false &&
    runtimeModule.boundary.importsExDriDirectly === false &&
    runtimeModule.boundary.importsDriDirectly === false &&
    runtimeModule.boundary.importsNolDirectly === false &&
    runtimeModule.boundary.introducesRendering === false &&
    runtimeModule.boundary.encodesRendererStyling === false;

  const ok =
    identityOk &&
    vocabOk &&
    reusesUpstreamPresentationStates &&
    reusesUpstreamSubjectKinds &&
    invariantsOk &&
    frozen &&
    publicIndexBoundaryIntact &&
    runtimeModule.frameworkIndependent === true &&
    runtimeModule.rendererIndependent === true &&
    upstream.ok === true &&
    runtimeModule.principle === RUNTIME_EXECUTIVE_STAGE_FOUNDATION_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveStageExperienceFoundationIdentity,
    version: runtimeExecutiveStageExperienceFoundationVersion,
    namespace: runtimeExecutiveStageExperienceFoundationNamespace,
    layer: runtimeExecutiveStageExperienceFoundationLayer,
    domain: runtimeExecutiveStageExperienceFoundationDomain,
    phase: runtimeExecutiveStageExperienceFoundationPhase,
    dependencyIdentity:
      runtimeExecutiveStageExperienceFoundationDependencyIdentity,
    subjectKindCount: RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS.length,
    presentationStateCount: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES.length,
    visibilityStateCount: RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES.length,
    selectionStateCount: RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES.length,
    focusRoleCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES.length,
    attentionLevelCount: RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS.length,
    connectionKindCount: RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS.length,
    connectionDirectionCount:
      RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS.length,
    sceneStateCount: RUNTIME_EXECUTIVE_STAGE_SCENE_STATES.length,
    invariantCount: RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS.length,
    publicApiCount: runtimeExecutiveStageExperienceFoundationApiNames.length,
    frozen,
    publicIndexBoundaryIntact,
    rendererIndependent: runtimeModule.rendererIndependent === true,
    reusesUpstreamPresentationStates,
    reusesUpstreamSubjectKinds,
    upstreamConsumerEntryOk: upstream.ok === true,
  });
}
