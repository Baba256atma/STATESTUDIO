/**
 * REX-5:1 — Runtime Executive Action Experience Foundation.
 *
 * Establishes the canonical deterministic foundation for Executive Actions
 * inside Nexora’s runtime-enabled Executive Experience:
 * vocabulary, immutable primitives, subject/target/recipient separation,
 * intent/kind separation, lifecycle transitions, draft readiness,
 * context preservation, and foundation registry.
 *
 * Canonical flow:
 *   REX-4:9 Public Index → REX-5:1 Runtime Executive Action Experience Foundation
 *
 * Foundation only. No external dispatch, messaging, Jira/Slack/email,
 * agent execution, recipient resolution, UI, rendering, persistence,
 * or provider-specific integration fields.
 *
 * An Executive Action is a runtime executive intention to cause or request
 * a controlled future effect — not the external effect itself.
 */

import {
  runtimeExecutiveInsightExperiencePublicIndexIdentity,
  runtimeExecutiveInsightExperiencePublicIndexSupportedImportPath,
  runtimeExecutiveInsightExperiencePublicIndexVersion,
  verifyRuntimeExecutiveInsightExperiencePublicIndex,
} from "@/app/lib/rex/runtimeExecutiveInsightExperiencePublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveActionExperienceFoundationIdentity =
  "REX-5:1/RuntimeExecutiveActionExperienceFoundation" as const;

export const runtimeExecutiveActionExperienceFoundationVersion =
  "5.1.0" as const;

export const runtimeExecutiveActionExperienceFoundationNamespace =
  "nexora.rex.action-experience.foundation" as const;

export const runtimeExecutiveActionExperienceFoundationLayer =
  "REX" as const;

export const runtimeExecutiveActionExperienceFoundationCapability =
  "RuntimeExecutiveActionExperience" as const;

export const runtimeExecutiveActionExperienceFoundationPhase =
  "Foundation" as const;

export const runtimeExecutiveActionExperienceFoundationStatus =
  "FoundationReady" as const;

export const runtimeExecutiveActionExperienceFoundationArchitecturalRole =
  "ExecutiveActionExperienceFoundation" as const;

export const runtimeExecutiveActionExperienceFoundationDependencyIdentity =
  runtimeExecutiveInsightExperiencePublicIndexIdentity;

export const runtimeExecutiveActionExperienceFoundationDependencyPath =
  runtimeExecutiveInsightExperiencePublicIndexSupportedImportPath;

/** Sole supported import path for REX-5 consumers of this foundation. */
export const runtimeExecutiveActionExperienceFoundationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveActionExperienceFoundation" as const;

export const runtimeExecutiveActionExperienceFoundationStability =
  "FoundationReady" as const;

export const runtimeExecutiveActionExperienceFoundationDeterministic =
  true as const;

export const runtimeExecutiveActionExperienceFoundationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveActionExperienceFoundationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveActionExperienceFoundationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveActionExperienceFoundationIdentity,
    version: runtimeExecutiveActionExperienceFoundationVersion,
    namespace: runtimeExecutiveActionExperienceFoundationNamespace,
    layer: runtimeExecutiveActionExperienceFoundationLayer,
    capability: runtimeExecutiveActionExperienceFoundationCapability,
    phase: runtimeExecutiveActionExperienceFoundationPhase,
    status: runtimeExecutiveActionExperienceFoundationStatus,
    architecturalRole:
      runtimeExecutiveActionExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionExperienceFoundationDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperienceFoundationSupportedImportPath,
    upstreamVersion: runtimeExecutiveInsightExperiencePublicIndexVersion,
    stabilityStatus:
      runtimeExecutiveActionExperienceFoundationStability,
    deterministicStatus:
      runtimeExecutiveActionExperienceFoundationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveActionExperienceFoundationSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveActionExperienceFoundationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_PRINCIPLE =
  "An Executive Action is a runtime executive intention to cause or request a controlled future effect — not external execution, message delivery, Jira creation, email, or agent dispatch." as const;

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  actionAuthority: "REX-5:1" as const,
  architecturalRole: "ExecutiveActionExperienceFoundation" as const,
  soleImmediateDependency:
    "REX-4:9/RuntimeExecutiveInsightExperiencePublicIndex" as const,
  consumesPublicIndexOnly: true as const,
  importsRex4InternalDirectly: false as const,
  importsRex3Directly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  transportIndependent: true as const,
  providerIndependent: true as const,
  introducesDispatch: false as const,
  introducesMessaging: false as const,
  introducesJiraIntegration: false as const,
  introducesSlackIntegration: false as const,
  introducesEmailDelivery: false as const,
  introducesAgentExecution: false as const,
  introducesRecipientResolution: false as const,
  introducesRendering: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  introducesUiBehavior: false as const,
});

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_RELATIONSHIP_CHAIN =
  Object.freeze([
    "See",
    "Understand",
    "Evaluate",
    "Decide",
    "Prepare Action",
    "Confirm",
    "Future Dispatch",
  ] as const);

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_RESPONSIBILITY_SEPARATION =
  Object.freeze({
    rex41Owns: "What an Executive Insight is." as const,
    rex51Owns:
      "What an Executive Action is (structure and vocabulary for prepared intention)." as const,
    laterRex5Owns:
      "Contracts, intent/context enrichment, presentation, confirmation, orchestration, dispatch adapters." as const,
    executiveActionIsNotExternalExecution: true as const,
    confirmedDoesNotMeanExecuted: true as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

/**
 * Canonical ordered Executive Action kinds.
 * Generic executive intention vocabulary — not provider-specific operations.
 */
export const RUNTIME_EXECUTIVE_ACTION_KINDS = Object.freeze([
  "request",
  "assign",
  "send",
  "approve",
  "review",
  "escalate",
  "follow-up",
] as const);

export type RuntimeExecutiveActionKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_KINDS)[number];

/**
 * What executive thing this action is about.
 * Reference-oriented; does not embed large upstream domain objects.
 */
export const RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS = Object.freeze([
  "object",
  "goal",
  "problem",
  "scenario",
  "decision",
  "execution",
  "insight",
  "pack",
  "workspace",
] as const);

export type RuntimeExecutiveActionSubjectKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS)[number];

/**
 * What is expected to receive or be affected by this action.
 * Distinct from recipient (responsibility / attention).
 */
export const RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS = Object.freeze([
  "person",
  "team",
  "role",
  "project",
  "workspace",
  "object",
  "decision",
  "external-system",
] as const);

export type RuntimeExecutiveActionTargetKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS)[number];

/**
 * Who or what is intended to receive responsibility, information, or attention.
 * `unresolved` allows representing intended responsibility before resolution.
 */
export const RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS = Object.freeze([
  "person",
  "team",
  "role",
  "agent",
  "system",
  "unresolved",
] as const);

export type RuntimeExecutiveActionRecipientKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS)[number];

/**
 * Why the executive is taking the action.
 * Distinct from Action Kind (what form of action).
 */
export const RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS = Object.freeze([
  "inform",
  "request-information",
  "request-action",
  "delegate",
  "review",
  "approve",
  "reject",
  "escalate",
  "coordinate",
  "follow-up",
] as const);

export type RuntimeExecutiveActionIntentKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS)[number];

export const RUNTIME_EXECUTIVE_ACTION_PRIORITIES = Object.freeze([
  "low",
  "normal",
  "high",
  "critical",
] as const);

export type RuntimeExecutiveActionPriority =
  (typeof RUNTIME_EXECUTIVE_ACTION_PRIORITIES)[number];

/**
 * Foundational lifecycle vocabulary.
 * `confirmed` means confirmed for a future downstream dispatch process —
 * not that an external system has completed work.
 */
export const RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "prepared",
  "pending-confirmation",
  "confirmed",
  "cancelled",
] as const);

export type RuntimeExecutiveActionLifecycleState =
  (typeof RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES)[number];

export const RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES = Object.freeze([
  "incomplete",
  "ready",
] as const);

export type RuntimeExecutiveActionReadinessStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_READINESS_MISSING_FIELDS = Object.freeze([
  "kind",
  "subject",
  "intent",
  "title",
  "priority",
  "recipient",
] as const);

export type RuntimeExecutiveActionReadinessMissingField =
  (typeof RUNTIME_EXECUTIVE_ACTION_READINESS_MISSING_FIELDS)[number];

export type RuntimeExecutiveActionLifecycleTransition = Readonly<{
  readonly from: RuntimeExecutiveActionLifecycleState;
  readonly to: RuntimeExecutiveActionLifecycleState;
}>;

/** Explicit foundational lifecycle edges. Pure description — never mutates. */
export const RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITIONS = Object.freeze([
  Object.freeze({ from: "draft", to: "prepared" }),
  Object.freeze({ from: "draft", to: "cancelled" }),
  Object.freeze({ from: "prepared", to: "pending-confirmation" }),
  Object.freeze({ from: "prepared", to: "cancelled" }),
  Object.freeze({ from: "pending-confirmation", to: "confirmed" }),
  Object.freeze({ from: "pending-confirmation", to: "cancelled" }),
] as const satisfies ReadonlyArray<RuntimeExecutiveActionLifecycleTransition>);

const RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITION_MAP = Object.freeze({
  draft: Object.freeze(["prepared", "cancelled"] as const),
  prepared: Object.freeze(["pending-confirmation", "cancelled"] as const),
  "pending-confirmation": Object.freeze(["confirmed", "cancelled"] as const),
  confirmed: Object.freeze([] as const),
  cancelled: Object.freeze([] as const),
});

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES = Object.freeze([
  "deterministic",
  "immutable",
  "renderer-independent",
  "transport-independent",
  "provider-independent",
  "side-effect-free",
  "context-preserving",
  "recipient-resolution-independent",
  "dispatch-free",
  "upstream-safe",
] as const);

export type RuntimeExecutiveActionFoundationGuarantee =
  (typeof RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_CAPABILITIES = Object.freeze([
  "action-kind-vocabulary",
  "action-subject-modeling",
  "action-target-modeling",
  "action-recipient-modeling",
  "action-intent-modeling",
  "action-priority-modeling",
  "action-lifecycle-modeling",
  "lifecycle-transition-inspection",
  "action-context-preservation",
  "action-draft-modeling",
  "action-preparation-readiness",
  "foundation-registry",
] as const);

export type RuntimeExecutiveActionFoundationCapability =
  (typeof RUNTIME_EXECUTIVE_ACTION_FOUNDATION_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "ActionKinds",
    "SubjectKinds",
    "TargetKinds",
    "RecipientKinds",
    "Intents",
    "Priorities",
    "LifecycleStates",
    "Readiness",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveActionFoundationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ACTION_FOUNDATION_REGISTRY_SECTIONS)[number];

// ─── Domain contracts ───────────────────────────────────────────────────────

export interface RuntimeExecutiveActionSubject {
  readonly kind: RuntimeExecutiveActionSubjectKind;
  readonly id: string;
  readonly label?: string;
  readonly referenceId?: string;
}

export interface RuntimeExecutiveActionTarget {
  readonly kind: RuntimeExecutiveActionTargetKind;
  readonly id: string;
  readonly label?: string;
  readonly referenceId?: string;
}

export interface RuntimeExecutiveActionRecipient {
  readonly kind: RuntimeExecutiveActionRecipientKind;
  /** Optional when kind is `unresolved`. */
  readonly id?: string;
  readonly label?: string;
  readonly referenceId?: string;
}

/**
 * Structured intent — distinct from {@link RuntimeExecutiveActionKind}.
 * Example: kind=`send` + intent=`request-information`.
 */
export interface RuntimeExecutiveActionIntent {
  readonly kind: RuntimeExecutiveActionIntentKind;
  readonly note?: string;
}

/**
 * Lightweight origin references. Preserves supplied context; does not infer.
 */
export interface RuntimeExecutiveActionContext {
  readonly workspaceId?: string;
  readonly stageId?: string;
  readonly selectedSubjectId?: string;
  readonly focusedSubjectId?: string;
  readonly advisorId?: string;
  readonly insightId?: string;
  readonly decisionId?: string;
  readonly scenarioId?: string;
  readonly packId?: string;
}

/** Human/executive-readable reason. Plain data only — never AI-generated here. */
export interface RuntimeExecutiveActionReason {
  readonly text: string;
}

/**
 * Canonical Runtime Executive Action.
 * Renderer-independent and transport-independent plain data.
 */
export interface RuntimeExecutiveAction {
  readonly actionId: string;
  readonly kind: RuntimeExecutiveActionKind;
  readonly subject: RuntimeExecutiveActionSubject;
  readonly target?: RuntimeExecutiveActionTarget;
  readonly recipient: RuntimeExecutiveActionRecipient;
  readonly intent: RuntimeExecutiveActionIntent;
  readonly priority: RuntimeExecutiveActionPriority;
  readonly lifecycle: RuntimeExecutiveActionLifecycleState;
  readonly context?: RuntimeExecutiveActionContext;
  readonly title: string;
  readonly summary?: string;
  readonly reason?: RuntimeExecutiveActionReason;
  readonly sourceReferenceId?: string;
  readonly createdAtIso?: string;
  readonly updatedAtIso?: string;
  readonly orderKey?: string;
  readonly foundationIdentity: typeof runtimeExecutiveActionExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeExecutiveActionExperienceFoundationVersion;
}

/**
 * Intentionally incomplete action preparation representation.
 * May omit fields required for preparation readiness.
 */
export interface RuntimeExecutiveActionDraft {
  readonly actionId?: string;
  readonly kind?: RuntimeExecutiveActionKind;
  readonly subject?: RuntimeExecutiveActionSubject;
  readonly target?: RuntimeExecutiveActionTarget;
  readonly recipient?: RuntimeExecutiveActionRecipient;
  readonly intent?: RuntimeExecutiveActionIntent;
  readonly priority?: RuntimeExecutiveActionPriority;
  readonly lifecycle: RuntimeExecutiveActionLifecycleState;
  readonly context?: RuntimeExecutiveActionContext;
  readonly title?: string;
  readonly summary?: string;
  readonly reason?: RuntimeExecutiveActionReason;
  readonly sourceReferenceId?: string;
  readonly createdAtIso?: string;
  readonly updatedAtIso?: string;
  readonly orderKey?: string;
  readonly foundationIdentity: typeof runtimeExecutiveActionExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeExecutiveActionExperienceFoundationVersion;
}

export interface RuntimeExecutiveActionReadiness {
  readonly status: RuntimeExecutiveActionReadinessStatus;
  readonly missing: ReadonlyArray<RuntimeExecutiveActionReadinessMissingField>;
}

export interface RuntimeExecutiveActionFoundationIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveActionFoundationValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionFoundationIssue>;
}

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "action-is-intention-not-execution",
    order: 1,
    statement:
      "An Executive Action represents intention for a controlled future effect — not external execution.",
  }),
  Object.freeze({
    id: "subject-target-recipient-separated",
    order: 2,
    statement:
      "Action Subject, Target, and Recipient are distinct concepts and must not collapse.",
  }),
  Object.freeze({
    id: "kind-intent-separated",
    order: 3,
    statement:
      "Action Kind and Action Intent are distinct vocabulary domains.",
  }),
  Object.freeze({
    id: "confirmed-is-not-executed",
    order: 4,
    statement:
      "Lifecycle state confirmed means confirmed for future dispatch — not externally executed.",
  }),
  Object.freeze({
    id: "drafts-may-be-incomplete",
    order: 5,
    statement:
      "Drafts may intentionally omit fields; readiness reports preparation completeness only.",
  }),
  Object.freeze({
    id: "context-preserved-not-inferred",
    order: 6,
    statement:
      "Action context preserves supplied origin references and does not infer them.",
  }),
  Object.freeze({
    id: "recipient-resolution-independent",
    order: 7,
    statement:
      "Unresolved recipients are representable; REX-5:1 does not resolve directories.",
  }),
  Object.freeze({
    id: "provider-independent",
    order: 8,
    statement:
      "Canonical actions exclude provider-specific destination fields; those belong to future adapters.",
  }),
  Object.freeze({
    id: "dispatch-free",
    order: 9,
    statement:
      "No foundation API sends, dispatches, executes, or publishes externally.",
  }),
  Object.freeze({
    id: "deterministic-immutable",
    order: 10,
    statement:
      "Public foundation APIs are deterministic, pure, and immutability-preserving.",
  }),
]);

export type RuntimeExecutiveActionFoundationInvariant =
  (typeof RUNTIME_EXECUTIVE_ACTION_FOUNDATION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "external-dispatch",
    "message-delivery",
    "jira-task-creation",
    "email-delivery",
    "slack-delivery",
    "agent-execution",
    "recipient-directory-lookup",
    "provider-specific-fields",
    "ui-rendering",
    "three-js-behavior",
    "persistence",
    "telemetry",
    "network-requests",
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
): RuntimeExecutiveActionFoundationIssue {
  return Object.freeze(
    path === undefined ? { code, message } : { code, message, path },
  );
}

// ─── Vocabulary predicates ──────────────────────────────────────────────────

export function isRuntimeExecutiveActionKind(
  value: unknown,
): value is RuntimeExecutiveActionKind {
  return (RUNTIME_EXECUTIVE_ACTION_KINDS as readonly unknown[]).includes(value);
}

export function isRuntimeExecutiveActionSubjectKind(
  value: unknown,
): value is RuntimeExecutiveActionSubjectKind {
  return (
    RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionTargetKind(
  value: unknown,
): value is RuntimeExecutiveActionTargetKind {
  return (
    RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionRecipientKind(
  value: unknown,
): value is RuntimeExecutiveActionRecipientKind {
  return (
    RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionIntentKind(
  value: unknown,
): value is RuntimeExecutiveActionIntentKind {
  return (
    RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionPriority(
  value: unknown,
): value is RuntimeExecutiveActionPriority {
  return (
    RUNTIME_EXECUTIVE_ACTION_PRIORITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionLifecycleState(
  value: unknown,
): value is RuntimeExecutiveActionLifecycleState {
  return (
    RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionReadinessStatus(
  value: unknown,
): value is RuntimeExecutiveActionReadinessStatus {
  return (
    RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionFoundationGuarantee(
  value: unknown,
): value is RuntimeExecutiveActionFoundationGuarantee {
  return (
    RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionFoundationCapability(
  value: unknown,
): value is RuntimeExecutiveActionFoundationCapability {
  return (
    RUNTIME_EXECUTIVE_ACTION_FOUNDATION_CAPABILITIES as readonly unknown[]
  ).includes(value);
}

// ─── Lifecycle transition inspection ────────────────────────────────────────

export function getAllowedRuntimeExecutiveActionLifecycleTransitions(
  from: RuntimeExecutiveActionLifecycleState,
): ReadonlyArray<RuntimeExecutiveActionLifecycleState> {
  if (!isRuntimeExecutiveActionLifecycleState(from)) {
    throw new TypeError("from must be a known action lifecycle state");
  }
  return RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITION_MAP[from];
}

export function canTransitionRuntimeExecutiveActionLifecycle(
  from: RuntimeExecutiveActionLifecycleState,
  to: RuntimeExecutiveActionLifecycleState,
): boolean {
  if (!isRuntimeExecutiveActionLifecycleState(from)) {
    throw new TypeError("from must be a known action lifecycle state");
  }
  if (!isRuntimeExecutiveActionLifecycleState(to)) {
    throw new TypeError("to must be a known action lifecycle state");
  }
  return (
    RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITION_MAP[from] as readonly string[]
  ).includes(to);
}

// ─── Stable identity primitives ─────────────────────────────────────────────

/**
 * Deterministic action ID from caller-provided opaque key.
 * Identical key → identical ID. No randomness, UUID, or wall-clock.
 */
export function createRuntimeExecutiveActionId(input: {
  readonly key: string;
}): string {
  return `rex.action:${requireOpaqueId(input.key, "key")}`;
}

// ─── Normalization / constructors ───────────────────────────────────────────

export function normalizeRuntimeExecutiveActionSubject(
  input: RuntimeExecutiveActionSubject,
): RuntimeExecutiveActionSubject {
  if (!isRuntimeExecutiveActionSubjectKind(input.kind)) {
    throw new TypeError("kind must be a known action subject kind");
  }
  const id = trimText(requireOpaqueId(input.id, "id"));
  if (!isNonEmptyString(id)) {
    throw new TypeError("id must be a non-empty opaque identifier");
  }
  const label = normalizeOptionalText(input.label, "label");
  const referenceId = normalizeOptionalText(input.referenceId, "referenceId");
  return Object.freeze({
    kind: input.kind,
    id,
    ...(label !== undefined ? { label } : {}),
    ...(referenceId !== undefined ? { referenceId } : {}),
  });
}

export function normalizeRuntimeExecutiveActionTarget(
  input: RuntimeExecutiveActionTarget,
): RuntimeExecutiveActionTarget {
  if (!isRuntimeExecutiveActionTargetKind(input.kind)) {
    throw new TypeError("kind must be a known action target kind");
  }
  const id = trimText(requireOpaqueId(input.id, "id"));
  if (!isNonEmptyString(id)) {
    throw new TypeError("id must be a non-empty opaque identifier");
  }
  const label = normalizeOptionalText(input.label, "label");
  const referenceId = normalizeOptionalText(input.referenceId, "referenceId");
  return Object.freeze({
    kind: input.kind,
    id,
    ...(label !== undefined ? { label } : {}),
    ...(referenceId !== undefined ? { referenceId } : {}),
  });
}

export function normalizeRuntimeExecutiveActionRecipient(
  input: RuntimeExecutiveActionRecipient,
): RuntimeExecutiveActionRecipient {
  if (!isRuntimeExecutiveActionRecipientKind(input.kind)) {
    throw new TypeError("kind must be a known action recipient kind");
  }
  const id = normalizeOptionalText(input.id, "id");
  if (input.kind !== "unresolved" && id === undefined) {
    throw new TypeError(
      "id must be a non-empty opaque identifier when recipient is not unresolved",
    );
  }
  const label = normalizeOptionalText(input.label, "label");
  const referenceId = normalizeOptionalText(input.referenceId, "referenceId");
  return Object.freeze({
    kind: input.kind,
    ...(id !== undefined ? { id } : {}),
    ...(label !== undefined ? { label } : {}),
    ...(referenceId !== undefined ? { referenceId } : {}),
  });
}

export function normalizeRuntimeExecutiveActionIntent(
  input: RuntimeExecutiveActionIntent,
): RuntimeExecutiveActionIntent {
  if (!isRuntimeExecutiveActionIntentKind(input.kind)) {
    throw new TypeError("kind must be a known action intent kind");
  }
  const note = normalizeOptionalText(input.note, "note");
  return Object.freeze({
    kind: input.kind,
    ...(note !== undefined ? { note } : {}),
  });
}

export function normalizeRuntimeExecutiveActionContext(
  input: RuntimeExecutiveActionContext,
): RuntimeExecutiveActionContext {
  if (!isPlainObject(input)) {
    throw new TypeError("context must be a plain object");
  }
  const workspaceId = normalizeOptionalText(input.workspaceId, "workspaceId");
  const stageId = normalizeOptionalText(input.stageId, "stageId");
  const selectedSubjectId = normalizeOptionalText(
    input.selectedSubjectId,
    "selectedSubjectId",
  );
  const focusedSubjectId = normalizeOptionalText(
    input.focusedSubjectId,
    "focusedSubjectId",
  );
  const advisorId = normalizeOptionalText(input.advisorId, "advisorId");
  const insightId = normalizeOptionalText(input.insightId, "insightId");
  const decisionId = normalizeOptionalText(input.decisionId, "decisionId");
  const scenarioId = normalizeOptionalText(input.scenarioId, "scenarioId");
  const packId = normalizeOptionalText(input.packId, "packId");
  return Object.freeze({
    ...(workspaceId !== undefined ? { workspaceId } : {}),
    ...(stageId !== undefined ? { stageId } : {}),
    ...(selectedSubjectId !== undefined ? { selectedSubjectId } : {}),
    ...(focusedSubjectId !== undefined ? { focusedSubjectId } : {}),
    ...(advisorId !== undefined ? { advisorId } : {}),
    ...(insightId !== undefined ? { insightId } : {}),
    ...(decisionId !== undefined ? { decisionId } : {}),
    ...(scenarioId !== undefined ? { scenarioId } : {}),
    ...(packId !== undefined ? { packId } : {}),
  });
}

export function normalizeRuntimeExecutiveActionReason(
  input: RuntimeExecutiveActionReason | string,
): RuntimeExecutiveActionReason {
  if (typeof input === "string") {
    const text = trimText(input);
    if (!isNonEmptyString(text)) {
      throw new TypeError("reason text must be a non-empty string");
    }
    return Object.freeze({ text });
  }
  if (!isPlainObject(input) || typeof input.text !== "string") {
    throw new TypeError("reason must be a string or { text: string }");
  }
  const text = trimText(input.text);
  if (!isNonEmptyString(text)) {
    throw new TypeError("reason text must be a non-empty string");
  }
  return Object.freeze({ text });
}

export function createRuntimeExecutiveActionSubject(input: {
  readonly kind: RuntimeExecutiveActionSubjectKind;
  readonly id: string;
  readonly label?: string;
  readonly referenceId?: string;
}): RuntimeExecutiveActionSubject {
  return normalizeRuntimeExecutiveActionSubject(input);
}

export function createRuntimeExecutiveActionTarget(input: {
  readonly kind: RuntimeExecutiveActionTargetKind;
  readonly id: string;
  readonly label?: string;
  readonly referenceId?: string;
}): RuntimeExecutiveActionTarget {
  return normalizeRuntimeExecutiveActionTarget(input);
}

export function createRuntimeExecutiveActionRecipient(input: {
  readonly kind: RuntimeExecutiveActionRecipientKind;
  readonly id?: string;
  readonly label?: string;
  readonly referenceId?: string;
}): RuntimeExecutiveActionRecipient {
  return normalizeRuntimeExecutiveActionRecipient(input);
}

export function createRuntimeExecutiveActionIntent(input: {
  readonly kind: RuntimeExecutiveActionIntentKind;
  readonly note?: string;
}): RuntimeExecutiveActionIntent {
  return normalizeRuntimeExecutiveActionIntent(input);
}

export function createRuntimeExecutiveActionContext(input?: {
  readonly workspaceId?: string;
  readonly stageId?: string;
  readonly selectedSubjectId?: string;
  readonly focusedSubjectId?: string;
  readonly advisorId?: string;
  readonly insightId?: string;
  readonly decisionId?: string;
  readonly scenarioId?: string;
  readonly packId?: string;
}): RuntimeExecutiveActionContext {
  return normalizeRuntimeExecutiveActionContext(input ?? {});
}

export function createRuntimeExecutiveActionReason(input: {
  readonly text: string;
}): RuntimeExecutiveActionReason {
  return normalizeRuntimeExecutiveActionReason(input);
}

export function normalizeRuntimeExecutiveActionDraft(
  input: Omit<
    RuntimeExecutiveActionDraft,
    "foundationIdentity" | "foundationVersion"
  > &
    Partial<
      Pick<
        RuntimeExecutiveActionDraft,
        "foundationIdentity" | "foundationVersion"
      >
    >,
): RuntimeExecutiveActionDraft {
  if (
    input.kind !== undefined &&
    !isRuntimeExecutiveActionKind(input.kind)
  ) {
    throw new TypeError("kind must be a known action kind when provided");
  }
  if (
    input.priority !== undefined &&
    !isRuntimeExecutiveActionPriority(input.priority)
  ) {
    throw new TypeError("priority must be a known action priority when provided");
  }
  if (!isRuntimeExecutiveActionLifecycleState(input.lifecycle)) {
    throw new TypeError("lifecycle must be a known action lifecycle state");
  }

  const actionId = normalizeOptionalText(input.actionId, "actionId");
  const title = normalizeOptionalText(input.title, "title");
  const summary = normalizeOptionalText(input.summary, "summary");
  const sourceReferenceId = normalizeOptionalText(
    input.sourceReferenceId,
    "sourceReferenceId",
  );
  const createdAtIso = normalizeOptionalText(input.createdAtIso, "createdAtIso");
  const updatedAtIso = normalizeOptionalText(input.updatedAtIso, "updatedAtIso");
  const orderKey = normalizeOptionalText(input.orderKey, "orderKey");

  const subject =
    input.subject === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionSubject(input.subject);
  const target =
    input.target === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionTarget(input.target);
  const recipient =
    input.recipient === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionRecipient(input.recipient);
  const intent =
    input.intent === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionIntent(input.intent);
  const context =
    input.context === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionContext(input.context);
  const reason =
    input.reason === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionReason(input.reason);

  return Object.freeze({
    ...(actionId !== undefined ? { actionId } : {}),
    ...(input.kind !== undefined ? { kind: input.kind } : {}),
    ...(subject !== undefined ? { subject } : {}),
    ...(target !== undefined ? { target } : {}),
    ...(recipient !== undefined ? { recipient } : {}),
    ...(intent !== undefined ? { intent } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    lifecycle: input.lifecycle,
    ...(context !== undefined ? { context } : {}),
    ...(title !== undefined ? { title } : {}),
    ...(summary !== undefined ? { summary } : {}),
    ...(reason !== undefined ? { reason } : {}),
    ...(sourceReferenceId !== undefined ? { sourceReferenceId } : {}),
    ...(createdAtIso !== undefined ? { createdAtIso } : {}),
    ...(updatedAtIso !== undefined ? { updatedAtIso } : {}),
    ...(orderKey !== undefined ? { orderKey } : {}),
    foundationIdentity: runtimeExecutiveActionExperienceFoundationIdentity,
    foundationVersion: runtimeExecutiveActionExperienceFoundationVersion,
  });
}

export function normalizeRuntimeExecutiveAction(
  input: Omit<
    RuntimeExecutiveAction,
    "foundationIdentity" | "foundationVersion"
  > &
    Partial<
      Pick<
        RuntimeExecutiveAction,
        "foundationIdentity" | "foundationVersion"
      >
    >,
): RuntimeExecutiveAction {
  if (!isRuntimeExecutiveActionKind(input.kind)) {
    throw new TypeError("kind must be a known action kind");
  }
  if (!isRuntimeExecutiveActionPriority(input.priority)) {
    throw new TypeError("priority must be a known action priority");
  }
  if (!isRuntimeExecutiveActionLifecycleState(input.lifecycle)) {
    throw new TypeError("lifecycle must be a known action lifecycle state");
  }

  const actionId = trimText(requireOpaqueId(input.actionId, "actionId"));
  const title = trimText(requireOpaqueId(input.title, "title"));
  const summary = normalizeOptionalText(input.summary, "summary");
  const sourceReferenceId = normalizeOptionalText(
    input.sourceReferenceId,
    "sourceReferenceId",
  );
  const createdAtIso = normalizeOptionalText(input.createdAtIso, "createdAtIso");
  const updatedAtIso = normalizeOptionalText(input.updatedAtIso, "updatedAtIso");
  const orderKey = normalizeOptionalText(input.orderKey, "orderKey");

  const subject = normalizeRuntimeExecutiveActionSubject(input.subject);
  const target =
    input.target === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionTarget(input.target);
  const recipient = normalizeRuntimeExecutiveActionRecipient(input.recipient);
  const intent = normalizeRuntimeExecutiveActionIntent(input.intent);
  const context =
    input.context === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionContext(input.context);
  const reason =
    input.reason === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionReason(input.reason);

  return Object.freeze({
    actionId,
    kind: input.kind,
    subject,
    ...(target !== undefined ? { target } : {}),
    recipient,
    intent,
    priority: input.priority,
    lifecycle: input.lifecycle,
    ...(context !== undefined ? { context } : {}),
    title,
    ...(summary !== undefined ? { summary } : {}),
    ...(reason !== undefined ? { reason } : {}),
    ...(sourceReferenceId !== undefined ? { sourceReferenceId } : {}),
    ...(createdAtIso !== undefined ? { createdAtIso } : {}),
    ...(updatedAtIso !== undefined ? { updatedAtIso } : {}),
    ...(orderKey !== undefined ? { orderKey } : {}),
    foundationIdentity: runtimeExecutiveActionExperienceFoundationIdentity,
    foundationVersion: runtimeExecutiveActionExperienceFoundationVersion,
  });
}

export function createRuntimeExecutiveActionDraft(input?: {
  readonly actionId?: string;
  readonly kind?: RuntimeExecutiveActionKind;
  readonly subject?: RuntimeExecutiveActionSubject;
  readonly target?: RuntimeExecutiveActionTarget;
  readonly recipient?: RuntimeExecutiveActionRecipient;
  readonly intent?: RuntimeExecutiveActionIntent;
  readonly priority?: RuntimeExecutiveActionPriority;
  readonly lifecycle?: RuntimeExecutiveActionLifecycleState;
  readonly context?: RuntimeExecutiveActionContext;
  readonly title?: string;
  readonly summary?: string;
  readonly reason?: RuntimeExecutiveActionReason | string;
  readonly sourceReferenceId?: string;
  readonly createdAtIso?: string;
  readonly updatedAtIso?: string;
  readonly orderKey?: string;
}): RuntimeExecutiveActionDraft {
  const reason =
    input?.reason === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionReason(input.reason);
  return normalizeRuntimeExecutiveActionDraft({
    ...(input?.actionId !== undefined ? { actionId: input.actionId } : {}),
    ...(input?.kind !== undefined ? { kind: input.kind } : {}),
    ...(input?.subject !== undefined ? { subject: input.subject } : {}),
    ...(input?.target !== undefined ? { target: input.target } : {}),
    ...(input?.recipient !== undefined ? { recipient: input.recipient } : {}),
    ...(input?.intent !== undefined ? { intent: input.intent } : {}),
    ...(input?.priority !== undefined ? { priority: input.priority } : {}),
    lifecycle: input?.lifecycle ?? "draft",
    ...(input?.context !== undefined ? { context: input.context } : {}),
    ...(input?.title !== undefined ? { title: input.title } : {}),
    ...(input?.summary !== undefined ? { summary: input.summary } : {}),
    ...(reason !== undefined ? { reason } : {}),
    ...(input?.sourceReferenceId !== undefined
      ? { sourceReferenceId: input.sourceReferenceId }
      : {}),
    ...(input?.createdAtIso !== undefined
      ? { createdAtIso: input.createdAtIso }
      : {}),
    ...(input?.updatedAtIso !== undefined
      ? { updatedAtIso: input.updatedAtIso }
      : {}),
    ...(input?.orderKey !== undefined ? { orderKey: input.orderKey } : {}),
  });
}

export function createRuntimeExecutiveAction(input: {
  readonly actionId: string;
  readonly kind: RuntimeExecutiveActionKind;
  readonly subject: RuntimeExecutiveActionSubject;
  readonly target?: RuntimeExecutiveActionTarget;
  readonly recipient: RuntimeExecutiveActionRecipient;
  readonly intent: RuntimeExecutiveActionIntent;
  readonly priority: RuntimeExecutiveActionPriority;
  readonly lifecycle?: RuntimeExecutiveActionLifecycleState;
  readonly context?: RuntimeExecutiveActionContext;
  readonly title: string;
  readonly summary?: string;
  readonly reason?: RuntimeExecutiveActionReason | string;
  readonly sourceReferenceId?: string;
  readonly createdAtIso?: string;
  readonly updatedAtIso?: string;
  readonly orderKey?: string;
}): RuntimeExecutiveAction {
  const reason =
    input.reason === undefined
      ? undefined
      : normalizeRuntimeExecutiveActionReason(input.reason);
  return normalizeRuntimeExecutiveAction({
    actionId: input.actionId,
    kind: input.kind,
    subject: input.subject,
    ...(input.target !== undefined ? { target: input.target } : {}),
    recipient: input.recipient,
    intent: input.intent,
    priority: input.priority,
    lifecycle: input.lifecycle ?? "draft",
    ...(input.context !== undefined ? { context: input.context } : {}),
    title: input.title,
    ...(input.summary !== undefined ? { summary: input.summary } : {}),
    ...(reason !== undefined ? { reason } : {}),
    ...(input.sourceReferenceId !== undefined
      ? { sourceReferenceId: input.sourceReferenceId }
      : {}),
    ...(input.createdAtIso !== undefined
      ? { createdAtIso: input.createdAtIso }
      : {}),
    ...(input.updatedAtIso !== undefined
      ? { updatedAtIso: input.updatedAtIso }
      : {}),
    ...(input.orderKey !== undefined ? { orderKey: input.orderKey } : {}),
  });
}

// ─── Readiness ──────────────────────────────────────────────────────────────

/**
 * Preparation readiness for advancing a draft toward prepared.
 * Not readiness for external dispatch.
 */
export function evaluateRuntimeExecutiveActionReadiness(
  draft: RuntimeExecutiveActionDraft | RuntimeExecutiveAction,
): RuntimeExecutiveActionReadiness {
  const missing: RuntimeExecutiveActionReadinessMissingField[] = [];

  if (!isRuntimeExecutiveActionKind(draft.kind)) {
    missing.push("kind");
  }
  if (
    draft.subject === undefined ||
    !isRuntimeExecutiveActionSubjectKind(draft.subject.kind) ||
    !isNonEmptyString(draft.subject.id)
  ) {
    missing.push("subject");
  }
  if (
    draft.intent === undefined ||
    !isRuntimeExecutiveActionIntentKind(draft.intent.kind)
  ) {
    missing.push("intent");
  }
  if (!isNonEmptyString(draft.title)) {
    missing.push("title");
  }
  if (!isRuntimeExecutiveActionPriority(draft.priority)) {
    missing.push("priority");
  }
  if (
    draft.recipient === undefined ||
    !isRuntimeExecutiveActionRecipientKind(draft.recipient.kind)
  ) {
    missing.push("recipient");
  }

  const status: RuntimeExecutiveActionReadinessStatus =
    missing.length === 0 ? "ready" : "incomplete";

  return Object.freeze({
    status,
    missing: Object.freeze([...missing]),
  });
}

// ─── Lightweight validation ─────────────────────────────────────────────────

export function validateRuntimeExecutiveActionDraft(
  value: unknown,
): RuntimeExecutiveActionFoundationValidationResult {
  const issues: RuntimeExecutiveActionFoundationIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-draft", "draft must be a plain object"),
      ]),
    });
  }

  if (
    value.kind !== undefined &&
    !isRuntimeExecutiveActionKind(value.kind)
  ) {
    issues.push(issue("unknown-action-kind", "unknown action kind", "kind"));
  }
  if (
    value.priority !== undefined &&
    !isRuntimeExecutiveActionPriority(value.priority)
  ) {
    issues.push(issue("unknown-priority", "unknown priority", "priority"));
  }
  if (!isRuntimeExecutiveActionLifecycleState(value.lifecycle)) {
    issues.push(
      issue("invalid-lifecycle-state", "invalid lifecycle state", "lifecycle"),
    );
  }
  if (
    value.actionId !== undefined &&
    !isNonEmptyString(value.actionId)
  ) {
    issues.push(
      issue("empty-action-id", "actionId must be non-empty when provided", "actionId"),
    );
  }
  if (value.subject !== undefined) {
    if (!isPlainObject(value.subject)) {
      issues.push(issue("invalid-subject", "subject must be an object", "subject"));
    } else {
      if (!isRuntimeExecutiveActionSubjectKind(value.subject.kind)) {
        issues.push(
          issue("invalid-subject-kind", "invalid subject kind", "subject.kind"),
        );
      }
      if (!isNonEmptyString(value.subject.id)) {
        issues.push(
          issue(
            "empty-required-identifier",
            "subject.id must be a non-empty identifier",
            "subject.id",
          ),
        );
      }
    }
  }
  if (value.target !== undefined) {
    if (!isPlainObject(value.target)) {
      issues.push(issue("invalid-target", "target must be an object", "target"));
    } else if (!isRuntimeExecutiveActionTargetKind(value.target.kind)) {
      issues.push(
        issue("invalid-target-kind", "invalid target kind", "target.kind"),
      );
    } else if (!isNonEmptyString(value.target.id)) {
      issues.push(
        issue(
          "empty-required-identifier",
          "target.id must be a non-empty identifier",
          "target.id",
        ),
      );
    }
  }
  if (value.recipient !== undefined) {
    if (!isPlainObject(value.recipient)) {
      issues.push(
        issue("invalid-recipient", "recipient must be an object", "recipient"),
      );
    } else if (!isRuntimeExecutiveActionRecipientKind(value.recipient.kind)) {
      issues.push(
        issue(
          "invalid-recipient-kind",
          "invalid recipient kind",
          "recipient.kind",
        ),
      );
    }
  }
  if (value.intent !== undefined) {
    if (!isPlainObject(value.intent)) {
      issues.push(issue("invalid-intent", "intent must be an object", "intent"));
    } else if (!isRuntimeExecutiveActionIntentKind(value.intent.kind)) {
      issues.push(
        issue("invalid-intent-kind", "invalid intent kind", "intent.kind"),
      );
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateRuntimeExecutiveAction(
  value: unknown,
): RuntimeExecutiveActionFoundationValidationResult {
  const base = validateRuntimeExecutiveActionDraft(value);
  if (!isPlainObject(value)) {
    return base;
  }

  const issues: RuntimeExecutiveActionFoundationIssue[] = [...base.issues];

  if (!isNonEmptyString(value.actionId)) {
    issues.push(
      issue(
        "empty-required-identifier",
        "actionId must be a non-empty identifier",
        "actionId",
      ),
    );
  }
  if (!isRuntimeExecutiveActionKind(value.kind)) {
    issues.push(issue("unknown-action-kind", "unknown action kind", "kind"));
  }
  if (value.subject === undefined) {
    issues.push(issue("missing-subject", "subject is required", "subject"));
  }
  if (value.recipient === undefined) {
    issues.push(
      issue("missing-recipient", "recipient is required", "recipient"),
    );
  }
  if (value.intent === undefined) {
    issues.push(issue("missing-intent", "intent is required", "intent"));
  }
  if (!isRuntimeExecutiveActionPriority(value.priority)) {
    issues.push(issue("unknown-priority", "unknown priority", "priority"));
  }
  if (!isNonEmptyString(value.title)) {
    issues.push(issue("missing-title", "title is required", "title"));
  }

  // Deduplicate by code+path
  const seen = new Set<string>();
  const deduped = issues.filter((entry) => {
    const key = `${entry.code}:${entry.path ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return Object.freeze({
    ok: deduped.length === 0,
    issues: Object.freeze(deduped),
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveActionExperienceFoundationIdentity():
  typeof runtimeExecutiveActionExperienceFoundationCanonicalIdentity {
  return runtimeExecutiveActionExperienceFoundationCanonicalIdentity;
}

export function getRuntimeExecutiveActionExperienceFoundationGuarantees():
  typeof RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES {
  return RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES;
}

export function getRuntimeExecutiveActionExperienceFoundationRegistry():
  typeof runtimeExecutiveActionExperienceFoundationRegistry {
  return runtimeExecutiveActionExperienceFoundationRegistry;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveActionExperienceFoundationApiNames =
  Object.freeze([
    "getRuntimeExecutiveActionExperienceFoundationIdentity",
    "getRuntimeExecutiveActionExperienceFoundationRegistry",
    "getRuntimeExecutiveActionExperienceFoundationGuarantees",
    "isRuntimeExecutiveActionKind",
    "isRuntimeExecutiveActionSubjectKind",
    "isRuntimeExecutiveActionTargetKind",
    "isRuntimeExecutiveActionRecipientKind",
    "isRuntimeExecutiveActionIntentKind",
    "isRuntimeExecutiveActionPriority",
    "isRuntimeExecutiveActionLifecycleState",
    "isRuntimeExecutiveActionReadinessStatus",
    "isRuntimeExecutiveActionFoundationGuarantee",
    "isRuntimeExecutiveActionFoundationCapability",
    "createRuntimeExecutiveActionId",
    "createRuntimeExecutiveActionSubject",
    "createRuntimeExecutiveActionTarget",
    "createRuntimeExecutiveActionRecipient",
    "createRuntimeExecutiveActionIntent",
    "createRuntimeExecutiveActionContext",
    "createRuntimeExecutiveActionReason",
    "createRuntimeExecutiveActionDraft",
    "createRuntimeExecutiveAction",
    "normalizeRuntimeExecutiveActionSubject",
    "normalizeRuntimeExecutiveActionTarget",
    "normalizeRuntimeExecutiveActionRecipient",
    "normalizeRuntimeExecutiveActionIntent",
    "normalizeRuntimeExecutiveActionContext",
    "normalizeRuntimeExecutiveActionReason",
    "normalizeRuntimeExecutiveActionDraft",
    "normalizeRuntimeExecutiveAction",
    "canTransitionRuntimeExecutiveActionLifecycle",
    "getAllowedRuntimeExecutiveActionLifecycleTransitions",
    "evaluateRuntimeExecutiveActionReadiness",
    "validateRuntimeExecutiveActionDraft",
    "validateRuntimeExecutiveAction",
    "verifyRuntimeExecutiveActionExperienceFoundation",
  ] as const);

export const RUNTIME_EXECUTIVE_ACTION_FOUNDATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveActionKind",
    "RuntimeExecutiveActionSubjectKind",
    "RuntimeExecutiveActionTargetKind",
    "RuntimeExecutiveActionRecipientKind",
    "RuntimeExecutiveActionIntentKind",
    "RuntimeExecutiveActionPriority",
    "RuntimeExecutiveActionLifecycleState",
    "RuntimeExecutiveActionReadinessStatus",
    "RuntimeExecutiveActionReadinessMissingField",
    "RuntimeExecutiveActionLifecycleTransition",
    "RuntimeExecutiveActionFoundationGuarantee",
    "RuntimeExecutiveActionFoundationCapability",
    "RuntimeExecutiveActionFoundationRegistrySection",
    "RuntimeExecutiveActionSubject",
    "RuntimeExecutiveActionTarget",
    "RuntimeExecutiveActionRecipient",
    "RuntimeExecutiveActionIntent",
    "RuntimeExecutiveActionContext",
    "RuntimeExecutiveActionReason",
    "RuntimeExecutiveAction",
    "RuntimeExecutiveActionDraft",
    "RuntimeExecutiveActionReadiness",
    "RuntimeExecutiveActionFoundationIssue",
    "RuntimeExecutiveActionFoundationValidationResult",
    "RuntimeExecutiveActionFoundationInvariant",
    "RuntimeExecutiveActionExperienceFoundationVerification",
  ] as const);

export const runtimeExecutiveActionExperienceFoundationRegistry =
  Object.freeze({
    identity: runtimeExecutiveActionExperienceFoundationIdentity,
    version: runtimeExecutiveActionExperienceFoundationVersion,
    namespace: runtimeExecutiveActionExperienceFoundationNamespace,
    layer: runtimeExecutiveActionExperienceFoundationLayer,
    capability: runtimeExecutiveActionExperienceFoundationCapability,
    phase: runtimeExecutiveActionExperienceFoundationPhase,
    status: runtimeExecutiveActionExperienceFoundationStatus,
    architecturalRole:
      runtimeExecutiveActionExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionExperienceFoundationDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperienceFoundationSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_REGISTRY_SECTIONS.length,
    actionKinds: RUNTIME_EXECUTIVE_ACTION_KINDS,
    actionKindCount: RUNTIME_EXECUTIVE_ACTION_KINDS.length,
    subjectKinds: RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS,
    subjectKindCount: RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS.length,
    targetKinds: RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS,
    targetKindCount: RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS.length,
    recipientKinds: RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS,
    recipientKindCount: RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS.length,
    intentKinds: RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
    intentKindCount: RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS.length,
    priorities: RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
    priorityCount: RUNTIME_EXECUTIVE_ACTION_PRIORITIES.length,
    lifecycleStates: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
    lifecycleStateCount: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES.length,
    lifecycleTransitions: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITIONS,
    lifecycleTransitionCount:
      RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITIONS.length,
    readinessStatuses: RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES,
    readinessStatusCount: RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES.length,
    readinessMissingFields: RUNTIME_EXECUTIVE_ACTION_READINESS_MISSING_FIELDS,
    guarantees: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES,
    guaranteeCount: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES.length,
    capabilities: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_CAPABILITIES,
    capabilityCount: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_CAPABILITIES.length,
    invariants: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_INVARIANTS.length,
    publicTypes: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ACTION_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveActionExperienceFoundationApiNames,
    publicApiCount:
      runtimeExecutiveActionExperienceFoundationApiNames.length,
    relationshipChain: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_RELATIONSHIP_CHAIN,
  });

export const runtimeExecutiveActionExperienceFoundation = Object.freeze({
  phase: "Foundation" as const,
  name: "RuntimeExecutiveActionExperienceFoundation" as const,
  identity: runtimeExecutiveActionExperienceFoundationIdentity,
  version: runtimeExecutiveActionExperienceFoundationVersion,
  namespace: runtimeExecutiveActionExperienceFoundationNamespace,
  layer: runtimeExecutiveActionExperienceFoundationLayer,
  capability: runtimeExecutiveActionExperienceFoundationCapability,
  architecturalRole:
    runtimeExecutiveActionExperienceFoundationArchitecturalRole,
  role: "Foundation" as const,
  status: runtimeExecutiveActionExperienceFoundationStatus,
  upstreamDependency:
    runtimeExecutiveActionExperienceFoundationDependencyIdentity,
  dependencyPath:
    runtimeExecutiveActionExperienceFoundationDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionExperienceFoundationSupportedImportPath,
  deterministic: runtimeExecutiveActionExperienceFoundationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  transportIndependent: true as const,
  providerIndependent: true as const,
  dispatchFree: true as const,
  recipientResolutionIndependent: true as const,
  contextPreserving: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_BOUNDARY,
  responsibilitySeparation:
    RUNTIME_EXECUTIVE_ACTION_FOUNDATION_RESPONSIBILITY_SEPARATION,
  actionKinds: RUNTIME_EXECUTIVE_ACTION_KINDS,
  subjectKinds: RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS,
  targetKinds: RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS,
  recipientKinds: RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS,
  intentKinds: RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  priorities: RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  lifecycleStates: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  lifecycleTransitions: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITIONS,
  readinessStatuses: RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES,
  guarantees: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES,
  capabilities: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_CAPABILITIES,
  invariants: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_ACTION_FOUNDATION_FORBIDDEN_RESPONSIBILITIES,
  relationshipChain: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_RELATIONSHIP_CHAIN,
  publicTypeNames: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveActionExperienceFoundationApiNames,
  registry: runtimeExecutiveActionExperienceFoundationRegistry,
  publicIndexBoundary: "REX-4:9-public-index-only" as const,
  architecturalStatus:
    "REX-5:1 Runtime Executive Action Experience Foundation — FoundationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionExperienceFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveActionExperienceFoundationIdentity;
  readonly version: typeof runtimeExecutiveActionExperienceFoundationVersion;
  readonly namespace: typeof runtimeExecutiveActionExperienceFoundationNamespace;
  readonly layer: typeof runtimeExecutiveActionExperienceFoundationLayer;
  readonly capability: typeof runtimeExecutiveActionExperienceFoundationCapability;
  readonly phase: typeof runtimeExecutiveActionExperienceFoundationPhase;
  readonly status: typeof runtimeExecutiveActionExperienceFoundationStatus;
  readonly architecturalRole: typeof runtimeExecutiveActionExperienceFoundationArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveActionExperienceFoundationDependencyIdentity;
  readonly actionKindCount: number;
  readonly subjectKindCount: number;
  readonly targetKindCount: number;
  readonly recipientKindCount: number;
  readonly intentKindCount: number;
  readonly priorityCount: number;
  readonly lifecycleStateCount: number;
  readonly lifecycleTransitionCount: number;
  readonly readinessStatusCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly publicIndexBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly transportIndependent: boolean;
  readonly providerIndependent: boolean;
  readonly dispatchFree: boolean;
  readonly upstreamConsumerEntryOk: boolean;
  readonly subjectTargetRecipientSeparated: boolean;
  readonly kindIntentSeparated: boolean;
}

export function verifyRuntimeExecutiveActionExperienceFoundation():
  RuntimeExecutiveActionExperienceFoundationVerification {
  const foundationModule = runtimeExecutiveActionExperienceFoundation;
  const registry = runtimeExecutiveActionExperienceFoundationRegistry;
  const upstream = verifyRuntimeExecutiveInsightExperiencePublicIndex();

  const identityOk =
    foundationModule.identity ===
      "REX-5:1/RuntimeExecutiveActionExperienceFoundation" &&
    foundationModule.version === "5.1.0" &&
    foundationModule.namespace ===
      "nexora.rex.action-experience.foundation" &&
    foundationModule.layer === "REX" &&
    foundationModule.capability === "RuntimeExecutiveActionExperience" &&
    foundationModule.phase === "Foundation" &&
    foundationModule.status === "FoundationReady" &&
    foundationModule.architecturalRole ===
      "ExecutiveActionExperienceFoundation" &&
    foundationModule.upstreamDependency ===
      "REX-4:9/RuntimeExecutiveInsightExperiencePublicIndex" &&
    foundationModule.upstreamDependency ===
      runtimeExecutiveInsightExperiencePublicIndexIdentity &&
    foundationModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveInsightExperiencePublicIndex" &&
    foundationModule.publicIndexBoundary === "REX-4:9-public-index-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_KINDS], [
      "request",
      "assign",
      "send",
      "approve",
      "review",
      "escalate",
      "follow-up",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS], [
      "object",
      "goal",
      "problem",
      "scenario",
      "decision",
      "execution",
      "insight",
      "pack",
      "workspace",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS], [
      "person",
      "team",
      "role",
      "project",
      "workspace",
      "object",
      "decision",
      "external-system",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS], [
      "person",
      "team",
      "role",
      "agent",
      "system",
      "unresolved",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS], [
      "inform",
      "request-information",
      "request-action",
      "delegate",
      "review",
      "approve",
      "reject",
      "escalate",
      "coordinate",
      "follow-up",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_PRIORITIES], [
      "low",
      "normal",
      "high",
      "critical",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES], [
      "draft",
      "prepared",
      "pending-confirmation",
      "confirmed",
      "cancelled",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES], [
      "incomplete",
      "ready",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES], [
      "deterministic",
      "immutable",
      "renderer-independent",
      "transport-independent",
      "provider-independent",
      "side-effect-free",
      "context-preserving",
      "recipient-resolution-independent",
      "dispatch-free",
      "upstream-safe",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ACTION_FOUNDATION_REGISTRY_SECTIONS],
      [
        "Identity",
        "ActionKinds",
        "SubjectKinds",
        "TargetKinds",
        "RecipientKinds",
        "Intents",
        "Priorities",
        "LifecycleStates",
        "Readiness",
        "PublicAPIs",
        "Guarantees",
      ],
    ) &&
    RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITIONS.length === 6 &&
    canTransitionRuntimeExecutiveActionLifecycle("draft", "prepared") &&
    canTransitionRuntimeExecutiveActionLifecycle("draft", "cancelled") &&
    canTransitionRuntimeExecutiveActionLifecycle(
      "prepared",
      "pending-confirmation",
    ) &&
    canTransitionRuntimeExecutiveActionLifecycle("prepared", "cancelled") &&
    canTransitionRuntimeExecutiveActionLifecycle(
      "pending-confirmation",
      "confirmed",
    ) &&
    canTransitionRuntimeExecutiveActionLifecycle(
      "pending-confirmation",
      "cancelled",
    ) &&
    !canTransitionRuntimeExecutiveActionLifecycle("confirmed", "cancelled") &&
    !canTransitionRuntimeExecutiveActionLifecycle("cancelled", "draft") &&
    !canTransitionRuntimeExecutiveActionLifecycle("draft", "confirmed");

  const countsOk =
    registry.actionKindCount === RUNTIME_EXECUTIVE_ACTION_KINDS.length &&
    registry.subjectKindCount ===
      RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS.length &&
    registry.targetKindCount === RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS.length &&
    registry.recipientKindCount ===
      RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS.length &&
    registry.intentKindCount === RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS.length &&
    registry.priorityCount === RUNTIME_EXECUTIVE_ACTION_PRIORITIES.length &&
    registry.lifecycleStateCount ===
      RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES.length &&
    registry.lifecycleTransitionCount ===
      RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITIONS.length &&
    registry.readinessStatusCount ===
      RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_ACTION_FOUNDATION_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      runtimeExecutiveActionExperienceFoundationApiNames.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_ACTION_FOUNDATION_PUBLIC_TYPE_NAMES.length;

  const invariantsOk =
    RUNTIME_EXECUTIVE_ACTION_FOUNDATION_INVARIANTS.length === 10 &&
    RUNTIME_EXECUTIVE_ACTION_FOUNDATION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_ACTION_FOUNDATION_INVARIANTS.map((entry) => entry.id),
    );

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_PRIORITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITIONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_FOUNDATION_CAPABILITIES) &&
    Object.isFrozen(runtimeExecutiveActionExperienceFoundationCanonicalIdentity) &&
    Object.isFrozen(runtimeExecutiveActionExperienceFoundationRegistry) &&
    Object.isFrozen(runtimeExecutiveActionExperienceFoundation);

  const subjectTargetRecipientSeparated =
    RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS !==
      (RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS as unknown) &&
    RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS !==
      (RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS as unknown) &&
    RUNTIME_EXECUTIVE_ACTION_FOUNDATION_RESPONSIBILITY_SEPARATION
      .executiveActionIsNotExternalExecution === true;

  const kindIntentSeparated =
    RUNTIME_EXECUTIVE_ACTION_KINDS !==
      (RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS as unknown) &&
    isRuntimeExecutiveActionKind("send") &&
    isRuntimeExecutiveActionIntentKind("request-information") &&
    !isRuntimeExecutiveActionIntentKind("send") &&
    !isRuntimeExecutiveActionKind("request-information");

  const ok =
    identityOk &&
    vocabOk &&
    countsOk &&
    invariantsOk &&
    frozen &&
    foundationModule.rendererIndependent === true &&
    foundationModule.transportIndependent === true &&
    foundationModule.providerIndependent === true &&
    foundationModule.dispatchFree === true &&
    foundationModule.publicIndexBoundary === "REX-4:9-public-index-only" &&
    upstream.ok === true &&
    subjectTargetRecipientSeparated &&
    kindIntentSeparated;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveActionExperienceFoundationIdentity,
    version: runtimeExecutiveActionExperienceFoundationVersion,
    namespace: runtimeExecutiveActionExperienceFoundationNamespace,
    layer: runtimeExecutiveActionExperienceFoundationLayer,
    capability: runtimeExecutiveActionExperienceFoundationCapability,
    phase: runtimeExecutiveActionExperienceFoundationPhase,
    status: runtimeExecutiveActionExperienceFoundationStatus,
    architecturalRole:
      runtimeExecutiveActionExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionExperienceFoundationDependencyIdentity,
    actionKindCount: RUNTIME_EXECUTIVE_ACTION_KINDS.length,
    subjectKindCount: RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS.length,
    targetKindCount: RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS.length,
    recipientKindCount: RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS.length,
    intentKindCount: RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS.length,
    priorityCount: RUNTIME_EXECUTIVE_ACTION_PRIORITIES.length,
    lifecycleStateCount: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES.length,
    lifecycleTransitionCount:
      RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_TRANSITIONS.length,
    readinessStatusCount: RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES.length,
    guaranteeCount: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_GUARANTEES.length,
    sectionCount: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ACTION_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveActionExperienceFoundationApiNames.length,
    invariantCount: RUNTIME_EXECUTIVE_ACTION_FOUNDATION_INVARIANTS.length,
    frozen,
    publicIndexBoundaryIntact:
      foundationModule.publicIndexBoundary === "REX-4:9-public-index-only",
    rendererIndependent: foundationModule.rendererIndependent === true,
    transportIndependent: foundationModule.transportIndependent === true,
    providerIndependent: foundationModule.providerIndependent === true,
    dispatchFree: foundationModule.dispatchFree === true,
    upstreamConsumerEntryOk: upstream.ok === true,
    subjectTargetRecipientSeparated,
    kindIntentSeparated,
  });
}
