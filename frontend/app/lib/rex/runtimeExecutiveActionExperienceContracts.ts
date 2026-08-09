/**
 * REX-5:2 — Runtime Executive Action Experience Contracts.
 *
 * Formal immutable contract layer over REX-5:1 foundation semantics.
 * Defines how runtime components may safely communicate about Executive Actions:
 * proposal, subject/target/recipient, intent, priority, context, lifecycle,
 * readiness, preparation request/result, and contract-safe outcomes.
 *
 * Canonical flow:
 *   REX-5:1 Foundation → REX-5:2 Contracts → later REX-5 Intent & Context
 *
 * REX-5:1 answers: What is an Executive Action?
 * REX-5:2 answers: How may runtime components safely communicate about one?
 *
 * Contracts only. No orchestration, UI, recipient resolution, confirmation,
 * external dispatch, messaging, agent execution, or provider integrations.
 *
 * Contract ≠ Orchestration ≠ Execution ≠ Integration
 */

import {
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS,
  canTransitionRuntimeExecutiveActionLifecycle,
  createRuntimeExecutiveActionDraft,
  evaluateRuntimeExecutiveActionReadiness,
  getAllowedRuntimeExecutiveActionLifecycleTransitions,
  isRuntimeExecutiveActionIntentKind,
  isRuntimeExecutiveActionKind,
  isRuntimeExecutiveActionLifecycleState,
  isRuntimeExecutiveActionPriority,
  isRuntimeExecutiveActionRecipientKind,
  isRuntimeExecutiveActionSubjectKind,
  isRuntimeExecutiveActionTargetKind,
  normalizeRuntimeExecutiveActionContext,
  normalizeRuntimeExecutiveActionIntent,
  normalizeRuntimeExecutiveActionRecipient,
  normalizeRuntimeExecutiveActionSubject,
  normalizeRuntimeExecutiveActionTarget,
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionExperienceFoundationSupportedImportPath,
  runtimeExecutiveActionExperienceFoundationVersion,
  verifyRuntimeExecutiveActionExperienceFoundation,
  type RuntimeExecutiveActionContext,
  type RuntimeExecutiveActionDraft,
  type RuntimeExecutiveActionIntent,
  type RuntimeExecutiveActionIntentKind,
  type RuntimeExecutiveActionKind,
  type RuntimeExecutiveActionLifecycleState,
  type RuntimeExecutiveActionPriority,
  type RuntimeExecutiveActionReadiness,
  type RuntimeExecutiveActionReadinessMissingField,
  type RuntimeExecutiveActionReason,
  type RuntimeExecutiveActionRecipient,
  type RuntimeExecutiveActionSubject,
  type RuntimeExecutiveActionTarget,
} from "@/app/lib/rex/runtimeExecutiveActionExperienceFoundation";

// ─── Transitively published Foundation surface (for REX-5:3+) ───────────────
// Additive publication: later phases obtain foundation drafts/identity through REX-5:2.

export {
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS,
  createRuntimeExecutiveActionDraft,
  evaluateRuntimeExecutiveActionReadiness,
  runtimeExecutiveActionExperienceFoundationIdentity,
  verifyRuntimeExecutiveActionExperienceFoundation,
};

export type {
  RuntimeExecutiveActionDraft,
  RuntimeExecutiveActionIntent,
  RuntimeExecutiveActionKind,
  RuntimeExecutiveActionLifecycleState,
  RuntimeExecutiveActionPriority,
  RuntimeExecutiveActionRecipient,
  RuntimeExecutiveActionSubject,
  RuntimeExecutiveActionTarget,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveActionExperienceContractsIdentity =
  "REX-5:2/RuntimeExecutiveActionExperienceContracts" as const;

export const runtimeExecutiveActionExperienceContractsVersion =
  "5.2.0" as const;

export const runtimeExecutiveActionExperienceContractsNamespace =
  "nexora.rex.action-experience.contracts" as const;

export const runtimeExecutiveActionExperienceContractsLayer =
  "REX" as const;

export const runtimeExecutiveActionExperienceContractsCapability =
  "RuntimeExecutiveActionExperience" as const;

export const runtimeExecutiveActionExperienceContractsPhase =
  "Contracts" as const;

export const runtimeExecutiveActionExperienceContractsStatus =
  "ContractsReady" as const;

export const runtimeExecutiveActionExperienceContractsArchitecturalRole =
  "ExecutiveActionExperienceContractLayer" as const;

export const runtimeExecutiveActionExperienceContractsDependencyIdentity =
  runtimeExecutiveActionExperienceFoundationIdentity;

export const runtimeExecutiveActionExperienceContractsDependencyPath =
  runtimeExecutiveActionExperienceFoundationSupportedImportPath;

export const runtimeExecutiveActionExperienceContractsSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveActionExperienceContracts" as const;

export const runtimeExecutiveActionExperienceContractsStability =
  "ContractsReady" as const;

export const runtimeExecutiveActionExperienceContractsDeterministic =
  true as const;

export const runtimeExecutiveActionExperienceContractsSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveActionExperienceContractsMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveActionExperienceContractsCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveActionExperienceContractsIdentity,
    version: runtimeExecutiveActionExperienceContractsVersion,
    namespace: runtimeExecutiveActionExperienceContractsNamespace,
    layer: runtimeExecutiveActionExperienceContractsLayer,
    capability: runtimeExecutiveActionExperienceContractsCapability,
    phase: runtimeExecutiveActionExperienceContractsPhase,
    status: runtimeExecutiveActionExperienceContractsStatus,
    architecturalRole:
      runtimeExecutiveActionExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionExperienceContractsDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionExperienceContractsDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperienceContractsSupportedImportPath,
    upstreamVersion: runtimeExecutiveActionExperienceFoundationVersion,
    stabilityStatus: runtimeExecutiveActionExperienceContractsStability,
    deterministicStatus:
      runtimeExecutiveActionExperienceContractsDeterministic,
    sideEffectPolicy:
      runtimeExecutiveActionExperienceContractsSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveActionExperienceContractsMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ACTION_CONTRACTS_PRINCIPLE =
  "Contracts define runtime boundaries for communicating about Executive Actions — not orchestration, execution, recipient resolution, or external dispatch." as const;

export const RUNTIME_EXECUTIVE_ACTION_CONTRACTS_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  contractsAuthority: "REX-5:2" as const,
  architecturalRole: "ExecutiveActionExperienceContractLayer" as const,
  soleImmediateDependency:
    "REX-5:1/RuntimeExecutiveActionExperienceFoundation" as const,
  consumesFoundationOnly: true as const,
  importsRex4Directly: false as const,
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
  introducesOrchestration: false as const,
  introducesDispatch: false as const,
  introducesMessaging: false as const,
  introducesRecipientResolution: false as const,
  introducesConfirmationWorkflow: false as const,
  introducesUiBehavior: false as const,
  introducesRendering: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  introducesIntentInference: false as const,
  reinterpretsUpstreamInsight: false as const,
});

// ─── Inherited foundation vocabularies (exact references — not forked) ──────

export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_KINDS =
  RUNTIME_EXECUTIVE_ACTION_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_ACTION_SUBJECT_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_TARGET_KINDS =
  RUNTIME_EXECUTIVE_ACTION_TARGET_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_RECIPIENT_KINDS =
  RUNTIME_EXECUTIVE_ACTION_RECIPIENT_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_INTENT_KINDS =
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_PRIORITIES =
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES;
export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_LIFECYCLE_STATES =
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES;
export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_READINESS_STATUSES =
  RUNTIME_EXECUTIVE_ACTION_READINESS_STATUSES;

// ─── Contract families ──────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES = Object.freeze([
  "ActionProposal",
  "ActionSubject",
  "ActionTarget",
  "ActionRecipient",
  "ActionIntent",
  "ActionPriority",
  "ActionContext",
  "ActionLifecycle",
  "ActionReadiness",
  "ActionPreparation",
  "ActionOutcome",
] as const);

export type RuntimeExecutiveActionContractFamily =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES = Object.freeze([
  "deterministic",
  "immutable",
  "foundation-aligned",
  "contract-composable",
  "progressive-construction-safe",
  "incomplete-distinct-from-invalid",
  "subject-target-recipient-separated",
  "kind-intent-separated",
  "context-preserving",
  "renderer-independent",
  "provider-independent",
  "transport-independent",
  "side-effect-free",
  "dispatch-free",
] as const);

export type RuntimeExecutiveActionContractGuarantee =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES = Object.freeze([
  "missing-action",
  "invalid-action-kind",
  "missing-subject",
  "invalid-subject",
  "invalid-target",
  "invalid-recipient",
  "missing-intent",
  "invalid-intent",
  "invalid-priority",
  "invalid-context",
  "invalid-lifecycle-state",
  "invalid-lifecycle-transition",
  "incomplete-action",
] as const);

export type RuntimeExecutiveActionContractIssueCode =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_DOMAINS = Object.freeze([
  "action",
  "subject",
  "target",
  "recipient",
  "intent",
  "priority",
  "context",
  "lifecycle",
  "readiness",
] as const);

export type RuntimeExecutiveActionContractIssueDomain =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_DOMAINS)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_SEVERITIES = Object.freeze([
  "error",
  "warning",
  "info",
] as const);

export type RuntimeExecutiveActionContractIssueSeverity =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_SEVERITIES)[number];

export const RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES =
  Object.freeze(["accepted", "incomplete", "rejected"] as const);

export type RuntimeExecutiveActionPreparationResultStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTRACT_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "ContractFamilies",
    "ProposalContracts",
    "SubjectContracts",
    "TargetContracts",
    "RecipientContracts",
    "IntentContracts",
    "PriorityContracts",
    "ContextContracts",
    "LifecycleContracts",
    "ReadinessContracts",
    "PreparationContracts",
    "ResultContracts",
    "IssueCodes",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveActionContractRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTRACT_REGISTRY_SECTIONS)[number];

// ─── Contract metadata / issue / result models ──────────────────────────────

export interface RuntimeExecutiveActionContractMetadata {
  readonly contractIdentity: typeof runtimeExecutiveActionExperienceContractsIdentity;
  readonly contractVersion: typeof runtimeExecutiveActionExperienceContractsVersion;
  readonly sourcePhase: typeof runtimeExecutiveActionExperienceContractsPhase;
}

export interface RuntimeExecutiveActionContractIssue {
  readonly code: RuntimeExecutiveActionContractIssueCode;
  readonly domain: RuntimeExecutiveActionContractIssueDomain;
  readonly severity: RuntimeExecutiveActionContractIssueSeverity;
  readonly message: string;
  readonly field?: string;
}

export type RuntimeExecutiveActionContractEvaluationResult<T> =
  | {
      readonly valid: true;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionContractIssue>;
      readonly value: T;
    }
  | {
      readonly valid: false;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionContractIssue>;
      readonly value?: undefined;
    };

// ─── Domain contracts ───────────────────────────────────────────────────────

/**
 * Request to propose/create an executive action from supplied runtime information.
 * May be incomplete — proposal ≠ execution.
 */
export interface RuntimeExecutiveActionProposalContract {
  readonly kind?: RuntimeExecutiveActionKind;
  readonly subject?: RuntimeExecutiveActionSubject;
  readonly target?: RuntimeExecutiveActionTarget;
  readonly recipient?: RuntimeExecutiveActionRecipient;
  readonly intent?: RuntimeExecutiveActionIntent;
  readonly priority?: RuntimeExecutiveActionPriority;
  readonly context?: RuntimeExecutiveActionContext;
  readonly title?: string;
  readonly summary?: string;
  readonly reason?: RuntimeExecutiveActionReason | string;
  readonly actionId?: string;
  readonly lifecycle?: RuntimeExecutiveActionLifecycleState;
  readonly sourceReferenceId?: string;
  readonly orderKey?: string;
  readonly createdAtIso?: string;
  readonly updatedAtIso?: string;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

/** Subject = what the action is about. Wraps REX-5:1 subject representation. */
export interface RuntimeExecutiveActionSubjectContract {
  readonly subject: RuntimeExecutiveActionSubject;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

/** Target = what is intended to be affected. Distinct from subject and recipient. */
export interface RuntimeExecutiveActionTargetContract {
  readonly target: RuntimeExecutiveActionTarget;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

/** Recipient = who/what receives responsibility/information/attention. */
export interface RuntimeExecutiveActionRecipientContract {
  readonly recipient: RuntimeExecutiveActionRecipient;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

/** Intent is distinct from Action Kind. Never inferred. */
export interface RuntimeExecutiveActionIntentContract {
  readonly intent: RuntimeExecutiveActionIntent;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

/** Consumes canonical REX-5:1 priority vocabulary only. */
export interface RuntimeExecutiveActionPriorityContract {
  readonly priority: RuntimeExecutiveActionPriority;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

/** Preserves supplied origin references; does not derive context. */
export interface RuntimeExecutiveActionContextContract {
  readonly context: RuntimeExecutiveActionContext;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

/**
 * Expresses current/requested lifecycle without mutating the action.
 * Uses REX-5:1 transition helpers for structural allowance.
 */
export interface RuntimeExecutiveActionLifecycleContract {
  readonly current: RuntimeExecutiveActionLifecycleState;
  readonly requested?: RuntimeExecutiveActionLifecycleState;
  readonly transitionIntent?: "advance" | "cancel" | "none";
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

/** Preparation readiness — not external dispatch readiness. */
export interface RuntimeExecutiveActionReadinessContract {
  readonly draft: RuntimeExecutiveActionDraft | RuntimeExecutiveActionProposalContract;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

/**
 * Request to assess/prepare an action proposal/draft according to contracts.
 * Plain data only — no preparation orchestration.
 */
export interface RuntimeExecutiveActionPreparationRequest {
  readonly draft: RuntimeExecutiveActionDraft | RuntimeExecutiveActionProposalContract;
  readonly context?: RuntimeExecutiveActionContext;
  readonly requestedLifecycle?: RuntimeExecutiveActionLifecycleState;
  readonly requireResolvedRecipient?: boolean;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

export type RuntimeExecutiveActionPreparationResult =
  | {
      readonly status: "accepted";
      readonly valid: true;
      readonly incomplete: false;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionContractIssue>;
      readonly value: RuntimeExecutiveActionDraft;
      readonly readiness: RuntimeExecutiveActionReadiness;
    }
  | {
      readonly status: "incomplete";
      readonly valid: true;
      readonly incomplete: true;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionContractIssue>;
      readonly value: RuntimeExecutiveActionDraft;
      readonly readiness: RuntimeExecutiveActionReadiness;
      readonly missing: ReadonlyArray<
        RuntimeExecutiveActionReadinessMissingField | "resolved-recipient"
      >;
    }
  | {
      readonly status: "rejected";
      readonly valid: false;
      readonly incomplete: false;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionContractIssue>;
      readonly value?: undefined;
      readonly readiness?: RuntimeExecutiveActionReadiness;
    };

/** Contract-safe outcome representation — never means externally executed. */
export interface RuntimeExecutiveActionOutcomeContract {
  readonly status: RuntimeExecutiveActionPreparationResultStatus;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionContractIssue>;
  readonly readiness?: RuntimeExecutiveActionReadiness;
  readonly metadata?: RuntimeExecutiveActionContractMetadata;
}

export interface RuntimeExecutiveActionLifecycleEvaluation {
  readonly allowed: boolean;
  readonly current: RuntimeExecutiveActionLifecycleState;
  readonly requested?: RuntimeExecutiveActionLifecycleState;
  readonly allowedTransitions: ReadonlyArray<RuntimeExecutiveActionLifecycleState>;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionContractIssue>;
}

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

function contractMetadata(): RuntimeExecutiveActionContractMetadata {
  return Object.freeze({
    contractIdentity: runtimeExecutiveActionExperienceContractsIdentity,
    contractVersion: runtimeExecutiveActionExperienceContractsVersion,
    sourcePhase: runtimeExecutiveActionExperienceContractsPhase,
  });
}

function issue(
  code: RuntimeExecutiveActionContractIssueCode,
  domain: RuntimeExecutiveActionContractIssueDomain,
  severity: RuntimeExecutiveActionContractIssueSeverity,
  message: string,
  field?: string,
): RuntimeExecutiveActionContractIssue {
  return Object.freeze(
    field === undefined
      ? { code, domain, severity, message }
      : { code, domain, severity, message, field },
  );
}

function freezeIssues(
  issues: ReadonlyArray<RuntimeExecutiveActionContractIssue>,
): ReadonlyArray<RuntimeExecutiveActionContractIssue> {
  return Object.freeze([...issues]);
}

function hasErrorIssues(
  issues: ReadonlyArray<RuntimeExecutiveActionContractIssue>,
): boolean {
  return issues.some((entry) => entry.severity === "error");
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveActionContractFamily(
  value: unknown,
): value is RuntimeExecutiveActionContractFamily {
  return (
    RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionContractIssueCode(
  value: unknown,
): value is RuntimeExecutiveActionContractIssueCode {
  return (
    RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionPreparationResultStatus(
  value: unknown,
): value is RuntimeExecutiveActionPreparationResultStatus {
  return (
    RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionContractGuarantee(
  value: unknown,
): value is RuntimeExecutiveActionContractGuarantee {
  return (
    RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES as readonly unknown[]
  ).includes(value);
}

// ─── Constructors (contract-safe plain data) ────────────────────────────────

export function createRuntimeExecutiveActionContractMetadata():
  RuntimeExecutiveActionContractMetadata {
  return contractMetadata();
}

export function createRuntimeExecutiveActionSubjectContract(input: {
  readonly subject: RuntimeExecutiveActionSubject;
}): RuntimeExecutiveActionSubjectContract {
  return Object.freeze({
    subject: normalizeRuntimeExecutiveActionSubject(input.subject),
    metadata: contractMetadata(),
  });
}

export function createRuntimeExecutiveActionTargetContract(input: {
  readonly target: RuntimeExecutiveActionTarget;
}): RuntimeExecutiveActionTargetContract {
  return Object.freeze({
    target: normalizeRuntimeExecutiveActionTarget(input.target),
    metadata: contractMetadata(),
  });
}

export function createRuntimeExecutiveActionRecipientContract(input: {
  readonly recipient: RuntimeExecutiveActionRecipient;
}): RuntimeExecutiveActionRecipientContract {
  return Object.freeze({
    recipient: normalizeRuntimeExecutiveActionRecipient(input.recipient),
    metadata: contractMetadata(),
  });
}

export function createRuntimeExecutiveActionIntentContract(input: {
  readonly intent: RuntimeExecutiveActionIntent;
}): RuntimeExecutiveActionIntentContract {
  return Object.freeze({
    intent: normalizeRuntimeExecutiveActionIntent(input.intent),
    metadata: contractMetadata(),
  });
}

export function createRuntimeExecutiveActionPriorityContract(input: {
  readonly priority: RuntimeExecutiveActionPriority;
}): RuntimeExecutiveActionPriorityContract {
  if (!isRuntimeExecutiveActionPriority(input.priority)) {
    throw new TypeError("priority must be a known action priority");
  }
  return Object.freeze({
    priority: input.priority,
    metadata: contractMetadata(),
  });
}

export function createRuntimeExecutiveActionContextContract(input: {
  readonly context: RuntimeExecutiveActionContext;
}): RuntimeExecutiveActionContextContract {
  return Object.freeze({
    context: normalizeRuntimeExecutiveActionContext(input.context),
    metadata: contractMetadata(),
  });
}

export function createRuntimeExecutiveActionLifecycleContract(input: {
  readonly current: RuntimeExecutiveActionLifecycleState;
  readonly requested?: RuntimeExecutiveActionLifecycleState;
  readonly transitionIntent?: "advance" | "cancel" | "none";
}): RuntimeExecutiveActionLifecycleContract {
  if (!isRuntimeExecutiveActionLifecycleState(input.current)) {
    throw new TypeError("current must be a known action lifecycle state");
  }
  if (
    input.requested !== undefined &&
    !isRuntimeExecutiveActionLifecycleState(input.requested)
  ) {
    throw new TypeError("requested must be a known action lifecycle state");
  }
  return Object.freeze({
    current: input.current,
    ...(input.requested !== undefined ? { requested: input.requested } : {}),
    ...(input.transitionIntent !== undefined
      ? { transitionIntent: input.transitionIntent }
      : {}),
    metadata: contractMetadata(),
  });
}

export function createRuntimeExecutiveActionProposalContract(input?: {
  readonly kind?: RuntimeExecutiveActionKind;
  readonly subject?: RuntimeExecutiveActionSubject;
  readonly target?: RuntimeExecutiveActionTarget;
  readonly recipient?: RuntimeExecutiveActionRecipient;
  readonly intent?: RuntimeExecutiveActionIntent;
  readonly priority?: RuntimeExecutiveActionPriority;
  readonly context?: RuntimeExecutiveActionContext;
  readonly title?: string;
  readonly summary?: string;
  readonly reason?: RuntimeExecutiveActionReason | string;
  readonly actionId?: string;
  readonly lifecycle?: RuntimeExecutiveActionLifecycleState;
  readonly sourceReferenceId?: string;
  readonly orderKey?: string;
  readonly createdAtIso?: string;
  readonly updatedAtIso?: string;
}): RuntimeExecutiveActionProposalContract {
  const draft = createRuntimeExecutiveActionDraft({
    ...(input?.kind !== undefined ? { kind: input.kind } : {}),
    ...(input?.subject !== undefined ? { subject: input.subject } : {}),
    ...(input?.target !== undefined ? { target: input.target } : {}),
    ...(input?.recipient !== undefined ? { recipient: input.recipient } : {}),
    ...(input?.intent !== undefined ? { intent: input.intent } : {}),
    ...(input?.priority !== undefined ? { priority: input.priority } : {}),
    ...(input?.context !== undefined ? { context: input.context } : {}),
    ...(input?.title !== undefined ? { title: input.title } : {}),
    ...(input?.summary !== undefined ? { summary: input.summary } : {}),
    ...(input?.reason !== undefined ? { reason: input.reason } : {}),
    ...(input?.actionId !== undefined ? { actionId: input.actionId } : {}),
    lifecycle: input?.lifecycle ?? "draft",
    ...(input?.sourceReferenceId !== undefined
      ? { sourceReferenceId: input.sourceReferenceId }
      : {}),
    ...(input?.orderKey !== undefined ? { orderKey: input.orderKey } : {}),
    ...(input?.createdAtIso !== undefined
      ? { createdAtIso: input.createdAtIso }
      : {}),
    ...(input?.updatedAtIso !== undefined
      ? { updatedAtIso: input.updatedAtIso }
      : {}),
  });

  return Object.freeze({
    ...(draft.kind !== undefined ? { kind: draft.kind } : {}),
    ...(draft.subject !== undefined ? { subject: draft.subject } : {}),
    ...(draft.target !== undefined ? { target: draft.target } : {}),
    ...(draft.recipient !== undefined ? { recipient: draft.recipient } : {}),
    ...(draft.intent !== undefined ? { intent: draft.intent } : {}),
    ...(draft.priority !== undefined ? { priority: draft.priority } : {}),
    ...(draft.context !== undefined ? { context: draft.context } : {}),
    ...(draft.title !== undefined ? { title: draft.title } : {}),
    ...(draft.summary !== undefined ? { summary: draft.summary } : {}),
    ...(draft.reason !== undefined ? { reason: draft.reason } : {}),
    ...(draft.actionId !== undefined ? { actionId: draft.actionId } : {}),
    lifecycle: draft.lifecycle,
    ...(draft.sourceReferenceId !== undefined
      ? { sourceReferenceId: draft.sourceReferenceId }
      : {}),
    ...(draft.orderKey !== undefined ? { orderKey: draft.orderKey } : {}),
    ...(draft.createdAtIso !== undefined
      ? { createdAtIso: draft.createdAtIso }
      : {}),
    ...(draft.updatedAtIso !== undefined
      ? { updatedAtIso: draft.updatedAtIso }
      : {}),
    metadata: contractMetadata(),
  });
}

export function createRuntimeExecutiveActionPreparationRequest(input: {
  readonly draft:
    | RuntimeExecutiveActionDraft
    | RuntimeExecutiveActionProposalContract;
  readonly context?: RuntimeExecutiveActionContext;
  readonly requestedLifecycle?: RuntimeExecutiveActionLifecycleState;
  readonly requireResolvedRecipient?: boolean;
}): RuntimeExecutiveActionPreparationRequest {
  return Object.freeze({
    draft: input.draft,
    ...(input.context !== undefined
      ? { context: normalizeRuntimeExecutiveActionContext(input.context) }
      : {}),
    ...(input.requestedLifecycle !== undefined
      ? { requestedLifecycle: input.requestedLifecycle }
      : {}),
    requireResolvedRecipient: input.requireResolvedRecipient ?? true,
    metadata: contractMetadata(),
  });
}

export function createRuntimeExecutiveActionOutcomeContract(input: {
  readonly status: RuntimeExecutiveActionPreparationResultStatus;
  readonly issues?: ReadonlyArray<RuntimeExecutiveActionContractIssue>;
  readonly readiness?: RuntimeExecutiveActionReadiness;
}): RuntimeExecutiveActionOutcomeContract {
  if (!isRuntimeExecutiveActionPreparationResultStatus(input.status)) {
    throw new TypeError("status must be a known preparation result status");
  }
  return Object.freeze({
    status: input.status,
    issues: freezeIssues(input.issues ?? []),
    ...(input.readiness !== undefined ? { readiness: input.readiness } : {}),
    metadata: contractMetadata(),
  });
}

// ─── Composable field evaluators ────────────────────────────────────────────

export function evaluateRuntimeExecutiveActionSubjectContract(
  value: unknown,
): RuntimeExecutiveActionContractEvaluationResult<RuntimeExecutiveActionSubjectContract> {
  const issues: RuntimeExecutiveActionContractIssue[] = [];

  if (value === undefined || value === null) {
    issues.push(
      issue(
        "missing-subject",
        "subject",
        "error",
        "subject is required",
        "subject",
      ),
    );
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }

  const subjectValue = isPlainObject(value) && "subject" in value
    ? value.subject
    : value;

  if (!isPlainObject(subjectValue)) {
    issues.push(
      issue(
        "invalid-subject",
        "subject",
        "error",
        "subject must be a plain object",
        "subject",
      ),
    );
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }

  if (!isRuntimeExecutiveActionSubjectKind(subjectValue.kind)) {
    issues.push(
      issue(
        "invalid-subject",
        "subject",
        "error",
        "subject kind is not canonical",
        "subject.kind",
      ),
    );
  }
  if (!isNonEmptyString(subjectValue.id)) {
    issues.push(
      issue(
        "invalid-subject",
        "subject",
        "error",
        "subject identity must be a non-empty string",
        "subject.id",
      ),
    );
  }

  if (hasErrorIssues(issues)) {
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }

  try {
    const contract = createRuntimeExecutiveActionSubjectContract({
      subject: subjectValue as RuntimeExecutiveActionSubject,
    });
    return Object.freeze({
      valid: true,
      issues: freezeIssues(issues),
      value: contract,
    });
  } catch {
    issues.push(
      issue(
        "invalid-subject",
        "subject",
        "error",
        "subject reference is structurally invalid",
        "subject",
      ),
    );
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }
}

export function evaluateRuntimeExecutiveActionTargetContract(
  value: unknown,
): RuntimeExecutiveActionContractEvaluationResult<
  RuntimeExecutiveActionTargetContract | undefined
> {
  if (value === undefined || value === null) {
    return Object.freeze({
      valid: true,
      issues: Object.freeze([]),
      value: undefined,
    });
  }

  const issues: RuntimeExecutiveActionContractIssue[] = [];
  const targetValue =
    isPlainObject(value) && "target" in value ? value.target : value;

  if (!isPlainObject(targetValue)) {
    issues.push(
      issue(
        "invalid-target",
        "target",
        "error",
        "target must be a plain object when provided",
        "target",
      ),
    );
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }
  if (!isRuntimeExecutiveActionTargetKind(targetValue.kind)) {
    issues.push(
      issue(
        "invalid-target",
        "target",
        "error",
        "target kind is not canonical",
        "target.kind",
      ),
    );
  }
  if (!isNonEmptyString(targetValue.id)) {
    issues.push(
      issue(
        "invalid-target",
        "target",
        "error",
        "target identity must be a non-empty string",
        "target.id",
      ),
    );
  }
  if (hasErrorIssues(issues)) {
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }

  try {
    return Object.freeze({
      valid: true,
      issues: Object.freeze([]),
      value: createRuntimeExecutiveActionTargetContract({
        target: targetValue as RuntimeExecutiveActionTarget,
      }),
    });
  } catch {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "invalid-target",
          "target",
          "error",
          "target reference is structurally invalid",
          "target",
        ),
      ]),
    });
  }
}

export function evaluateRuntimeExecutiveActionRecipientContract(
  value: unknown,
  options?: { readonly required?: boolean },
): RuntimeExecutiveActionContractEvaluationResult<
  RuntimeExecutiveActionRecipientContract | undefined
> {
  const required = options?.required === true;
  if (value === undefined || value === null) {
    if (required) {
      return Object.freeze({
        valid: false,
        issues: freezeIssues([
          issue(
            "invalid-recipient",
            "recipient",
            "error",
            "recipient is required",
            "recipient",
          ),
        ]),
      });
    }
    return Object.freeze({
      valid: true,
      issues: Object.freeze([]),
      value: undefined,
    });
  }

  const issues: RuntimeExecutiveActionContractIssue[] = [];
  const recipientValue =
    isPlainObject(value) && "recipient" in value ? value.recipient : value;

  if (!isPlainObject(recipientValue)) {
    issues.push(
      issue(
        "invalid-recipient",
        "recipient",
        "error",
        "recipient must be a plain object when provided",
        "recipient",
      ),
    );
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }
  if (!isRuntimeExecutiveActionRecipientKind(recipientValue.kind)) {
    issues.push(
      issue(
        "invalid-recipient",
        "recipient",
        "error",
        "recipient kind is not canonical",
        "recipient.kind",
      ),
    );
  } else if (
    recipientValue.kind !== "unresolved" &&
    !isNonEmptyString(recipientValue.id)
  ) {
    issues.push(
      issue(
        "invalid-recipient",
        "recipient",
        "error",
        "recipient identity is required when recipient is not unresolved",
        "recipient.id",
      ),
    );
  }

  if (hasErrorIssues(issues)) {
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }

  try {
    return Object.freeze({
      valid: true,
      issues: Object.freeze([]),
      value: createRuntimeExecutiveActionRecipientContract({
        recipient: recipientValue as RuntimeExecutiveActionRecipient,
      }),
    });
  } catch {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "invalid-recipient",
          "recipient",
          "error",
          "recipient reference is structurally invalid",
          "recipient",
        ),
      ]),
    });
  }
}

export function evaluateRuntimeExecutiveActionIntentContract(
  value: unknown,
  options?: { readonly required?: boolean },
): RuntimeExecutiveActionContractEvaluationResult<
  RuntimeExecutiveActionIntentContract | undefined
> {
  const required = options?.required === true;
  if (value === undefined || value === null) {
    if (required) {
      return Object.freeze({
        valid: false,
        issues: freezeIssues([
          issue(
            "missing-intent",
            "intent",
            "error",
            "intent is required",
            "intent",
          ),
        ]),
      });
    }
    return Object.freeze({
      valid: true,
      issues: Object.freeze([]),
      value: undefined,
    });
  }

  const intentValue =
    isPlainObject(value) && "intent" in value ? value.intent : value;
  const kind =
    typeof intentValue === "string"
      ? intentValue
      : isPlainObject(intentValue)
        ? intentValue.kind
        : undefined;

  if (!isRuntimeExecutiveActionIntentKind(kind)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "invalid-intent",
          "intent",
          "error",
          "intent kind is not canonical",
          "intent.kind",
        ),
      ]),
    });
  }

  const note =
    isPlainObject(intentValue) && typeof intentValue.note === "string"
      ? intentValue.note
      : undefined;

  return Object.freeze({
    valid: true,
    issues: Object.freeze([]),
    value: createRuntimeExecutiveActionIntentContract({
      intent: {
        kind: kind as RuntimeExecutiveActionIntentKind,
        ...(note !== undefined ? { note } : {}),
      },
    }),
  });
}

export function evaluateRuntimeExecutiveActionPriorityContract(
  value: unknown,
  options?: { readonly required?: boolean },
): RuntimeExecutiveActionContractEvaluationResult<
  RuntimeExecutiveActionPriorityContract | undefined
> {
  const required = options?.required === true;
  const priority =
    isPlainObject(value) && "priority" in value ? value.priority : value;

  if (priority === undefined || priority === null) {
    if (required) {
      return Object.freeze({
        valid: false,
        issues: freezeIssues([
          issue(
            "invalid-priority",
            "priority",
            "error",
            "priority is required",
            "priority",
          ),
        ]),
      });
    }
    return Object.freeze({
      valid: true,
      issues: Object.freeze([]),
      value: undefined,
    });
  }

  if (!isRuntimeExecutiveActionPriority(priority)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "invalid-priority",
          "priority",
          "error",
          "priority is not a canonical foundation priority",
          "priority",
        ),
      ]),
    });
  }

  return Object.freeze({
    valid: true,
    issues: Object.freeze([]),
    value: createRuntimeExecutiveActionPriorityContract({ priority }),
  });
}

export function evaluateRuntimeExecutiveActionContextContract(
  value: unknown,
): RuntimeExecutiveActionContractEvaluationResult<
  RuntimeExecutiveActionContextContract | undefined
> {
  if (value === undefined || value === null) {
    return Object.freeze({
      valid: true,
      issues: Object.freeze([]),
      value: undefined,
    });
  }

  const contextValue =
    isPlainObject(value) && "context" in value ? value.context : value;

  if (!isPlainObject(contextValue)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "invalid-context",
          "context",
          "error",
          "context must be a plain object when provided",
          "context",
        ),
      ]),
    });
  }

  const keys = [
    "workspaceId",
    "stageId",
    "selectedSubjectId",
    "focusedSubjectId",
    "advisorId",
    "insightId",
    "decisionId",
    "scenarioId",
    "packId",
  ] as const;

  for (const key of keys) {
    const entry = contextValue[key];
    if (entry !== undefined && typeof entry !== "string") {
      return Object.freeze({
        valid: false,
        issues: freezeIssues([
          issue(
            "invalid-context",
            "context",
            "error",
            `context.${key} must be a string when provided`,
            `context.${key}`,
          ),
        ]),
      });
    }
  }

  try {
    const contract = createRuntimeExecutiveActionContextContract({
      context: contextValue as RuntimeExecutiveActionContext,
    });
    return Object.freeze({
      valid: true,
      issues: Object.freeze([]),
      value: contract,
    });
  } catch {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "invalid-context",
          "context",
          "error",
          "context is structurally invalid",
          "context",
        ),
      ]),
    });
  }
}

export function evaluateRuntimeExecutiveActionLifecycleContract(
  value: unknown,
): RuntimeExecutiveActionContractEvaluationResult<RuntimeExecutiveActionLifecycleContract> & {
  readonly lifecycle?: RuntimeExecutiveActionLifecycleEvaluation;
} {
  const issues: RuntimeExecutiveActionContractIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "invalid-lifecycle-state",
          "lifecycle",
          "error",
          "lifecycle contract must be a plain object",
          "lifecycle",
        ),
      ]),
    });
  }

  if (!isRuntimeExecutiveActionLifecycleState(value.current)) {
    issues.push(
      issue(
        "invalid-lifecycle-state",
        "lifecycle",
        "error",
        "current lifecycle state is not canonical",
        "current",
      ),
    );
  }
  if (
    value.requested !== undefined &&
    !isRuntimeExecutiveActionLifecycleState(value.requested)
  ) {
    issues.push(
      issue(
        "invalid-lifecycle-state",
        "lifecycle",
        "error",
        "requested lifecycle state is not canonical",
        "requested",
      ),
    );
  }

  if (hasErrorIssues(issues)) {
    return Object.freeze({ valid: false, issues: freezeIssues(issues) });
  }

  const current = value.current as RuntimeExecutiveActionLifecycleState;
  const requested = value.requested as
    | RuntimeExecutiveActionLifecycleState
    | undefined;
  const allowedTransitions =
    getAllowedRuntimeExecutiveActionLifecycleTransitions(current);

  let allowed = true;
  if (requested !== undefined) {
    allowed = canTransitionRuntimeExecutiveActionLifecycle(current, requested);
    if (!allowed) {
      issues.push(
        issue(
          "invalid-lifecycle-transition",
          "lifecycle",
          "error",
          `transition from ${current} to ${requested} is not allowed`,
          "requested",
        ),
      );
    }
  }

  const contract = createRuntimeExecutiveActionLifecycleContract({
    current,
    ...(requested !== undefined ? { requested } : {}),
    ...(value.transitionIntent === "advance" ||
    value.transitionIntent === "cancel" ||
    value.transitionIntent === "none"
      ? { transitionIntent: value.transitionIntent }
      : {}),
  });

  const lifecycle = Object.freeze({
    allowed,
    current,
    ...(requested !== undefined ? { requested } : {}),
    allowedTransitions,
    issues: freezeIssues(issues),
  });

  if (!allowed) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues(issues),
      lifecycle,
    });
  }

  return Object.freeze({
    valid: true,
    issues: freezeIssues(issues),
    value: contract,
    lifecycle,
  });
}

export function evaluateRuntimeExecutiveActionReadinessContract(
  value: unknown,
): RuntimeExecutiveActionContractEvaluationResult<{
  readonly readiness: RuntimeExecutiveActionReadiness;
  readonly draft: RuntimeExecutiveActionDraft;
}> {
  if (!isPlainObject(value)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "missing-action",
          "action",
          "error",
          "readiness contract requires an action draft/proposal",
          "draft",
        ),
      ]),
    });
  }

  const draftInput =
    "draft" in value ? value.draft : value;
  const proposalEval = evaluateRuntimeExecutiveActionProposalContract(draftInput);
  if (!proposalEval.valid) {
    return Object.freeze({
      valid: false,
      issues: proposalEval.issues,
    });
  }

  const draft = proposalToDraft(proposalEval.value);
  const readiness = evaluateRuntimeExecutiveActionReadiness(draft);
  const issues: RuntimeExecutiveActionContractIssue[] = [];

  if (readiness.status === "incomplete") {
    issues.push(
      issue(
        "incomplete-action",
        "readiness",
        "warning",
        "action is structurally valid but preparation-incomplete",
        "readiness",
      ),
    );
  }

  return Object.freeze({
    valid: true,
    issues: freezeIssues(issues),
    value: Object.freeze({ readiness, draft }),
  });
}

// ─── Proposal / preparation evaluation ──────────────────────────────────────

function proposalToDraft(
  proposal: RuntimeExecutiveActionProposalContract,
): RuntimeExecutiveActionDraft {
  return createRuntimeExecutiveActionDraft({
    ...(proposal.kind !== undefined ? { kind: proposal.kind } : {}),
    ...(proposal.subject !== undefined ? { subject: proposal.subject } : {}),
    ...(proposal.target !== undefined ? { target: proposal.target } : {}),
    ...(proposal.recipient !== undefined
      ? { recipient: proposal.recipient }
      : {}),
    ...(proposal.intent !== undefined ? { intent: proposal.intent } : {}),
    ...(proposal.priority !== undefined ? { priority: proposal.priority } : {}),
    ...(proposal.context !== undefined ? { context: proposal.context } : {}),
    ...(proposal.title !== undefined ? { title: proposal.title } : {}),
    ...(proposal.summary !== undefined ? { summary: proposal.summary } : {}),
    ...(proposal.reason !== undefined ? { reason: proposal.reason } : {}),
    ...(proposal.actionId !== undefined ? { actionId: proposal.actionId } : {}),
    lifecycle: proposal.lifecycle ?? "draft",
    ...(proposal.sourceReferenceId !== undefined
      ? { sourceReferenceId: proposal.sourceReferenceId }
      : {}),
    ...(proposal.orderKey !== undefined ? { orderKey: proposal.orderKey } : {}),
    ...(proposal.createdAtIso !== undefined
      ? { createdAtIso: proposal.createdAtIso }
      : {}),
    ...(proposal.updatedAtIso !== undefined
      ? { updatedAtIso: proposal.updatedAtIso }
      : {}),
  });
}

/**
 * Evaluates an action proposal contract.
 * Incomplete proposals may still be structurally valid.
 * Does not execute, dispatch, or resolve recipients.
 */
export function evaluateRuntimeExecutiveActionProposalContract(
  value: unknown,
): RuntimeExecutiveActionContractEvaluationResult<RuntimeExecutiveActionProposalContract> {
  if (value === undefined || value === null) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "missing-action",
          "action",
          "error",
          "action proposal is required",
          "proposal",
        ),
      ]),
    });
  }

  if (!isPlainObject(value)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "missing-action",
          "action",
          "error",
          "action proposal must be a plain object",
          "proposal",
        ),
      ]),
    });
  }

  const issues: RuntimeExecutiveActionContractIssue[] = [];

  if (value.kind !== undefined && !isRuntimeExecutiveActionKind(value.kind)) {
    issues.push(
      issue(
        "invalid-action-kind",
        "action",
        "error",
        "action kind is not canonical",
        "kind",
      ),
    );
  }

  if (value.subject !== undefined) {
    const subjectEval = evaluateRuntimeExecutiveActionSubjectContract(
      value.subject,
    );
    if (!subjectEval.valid) {
      issues.push(...subjectEval.issues);
    }
  }

  if (value.target !== undefined) {
    const targetEval = evaluateRuntimeExecutiveActionTargetContract(
      value.target,
    );
    if (!targetEval.valid) {
      issues.push(...targetEval.issues);
    }
  }

  if (value.recipient !== undefined) {
    const recipientEval = evaluateRuntimeExecutiveActionRecipientContract(
      value.recipient,
    );
    if (!recipientEval.valid) {
      issues.push(...recipientEval.issues);
    }
  }

  if (value.intent !== undefined) {
    const intentEval = evaluateRuntimeExecutiveActionIntentContract(
      value.intent,
    );
    if (!intentEval.valid) {
      issues.push(...intentEval.issues);
    }
  }

  if (value.priority !== undefined) {
    const priorityEval = evaluateRuntimeExecutiveActionPriorityContract(
      value.priority,
    );
    if (!priorityEval.valid) {
      issues.push(...priorityEval.issues);
    }
  }

  if (value.context !== undefined) {
    const contextEval = evaluateRuntimeExecutiveActionContextContract(
      value.context,
    );
    if (!contextEval.valid) {
      issues.push(...contextEval.issues);
    }
  }

  if (
    value.lifecycle !== undefined &&
    !isRuntimeExecutiveActionLifecycleState(value.lifecycle)
  ) {
    issues.push(
      issue(
        "invalid-lifecycle-state",
        "lifecycle",
        "error",
        "lifecycle state is not canonical",
        "lifecycle",
      ),
    );
  }

  if (
    value.title !== undefined &&
    (typeof value.title !== "string" || value.title.trim().length === 0)
  ) {
    issues.push(
      issue(
        "missing-action",
        "action",
        "error",
        "title must be a non-empty string when provided",
        "title",
      ),
    );
  }

  if (hasErrorIssues(issues)) {
    return Object.freeze({
      valid: false,
      issues: freezeIssues(issues.filter((entry) => entry.severity === "error")),
    });
  }

  try {
    const proposal = createRuntimeExecutiveActionProposalContract({
      ...(value.kind !== undefined
        ? { kind: value.kind as RuntimeExecutiveActionKind }
        : {}),
      ...(value.subject !== undefined
        ? { subject: value.subject as RuntimeExecutiveActionSubject }
        : {}),
      ...(value.target !== undefined
        ? { target: value.target as RuntimeExecutiveActionTarget }
        : {}),
      ...(value.recipient !== undefined
        ? { recipient: value.recipient as RuntimeExecutiveActionRecipient }
        : {}),
      ...(value.intent !== undefined
        ? { intent: value.intent as RuntimeExecutiveActionIntent }
        : {}),
      ...(value.priority !== undefined
        ? { priority: value.priority as RuntimeExecutiveActionPriority }
        : {}),
      ...(value.context !== undefined
        ? { context: value.context as RuntimeExecutiveActionContext }
        : {}),
      ...(typeof value.title === "string" ? { title: value.title } : {}),
      ...(typeof value.summary === "string" ? { summary: value.summary } : {}),
      ...(value.reason !== undefined
        ? {
            reason: value.reason as RuntimeExecutiveActionReason | string,
          }
        : {}),
      ...(typeof value.actionId === "string" ? { actionId: value.actionId } : {}),
      ...(value.lifecycle !== undefined
        ? {
            lifecycle: value.lifecycle as RuntimeExecutiveActionLifecycleState,
          }
        : {}),
      ...(typeof value.sourceReferenceId === "string"
        ? { sourceReferenceId: value.sourceReferenceId }
        : {}),
      ...(typeof value.orderKey === "string" ? { orderKey: value.orderKey } : {}),
      ...(typeof value.createdAtIso === "string"
        ? { createdAtIso: value.createdAtIso }
        : {}),
      ...(typeof value.updatedAtIso === "string"
        ? { updatedAtIso: value.updatedAtIso }
        : {}),
    });

    // Progressive construction: missing preparation fields are warnings, not invalid.
    const draft = proposalToDraft(proposal);
    const readiness = evaluateRuntimeExecutiveActionReadiness(draft);
    if (readiness.status === "incomplete") {
      issues.push(
        issue(
          "incomplete-action",
          "readiness",
          "warning",
          "proposal is structurally valid but preparation-incomplete",
          "readiness",
        ),
      );
    }

    return Object.freeze({
      valid: true,
      issues: freezeIssues(issues),
      value: proposal,
    });
  } catch {
    return Object.freeze({
      valid: false,
      issues: freezeIssues([
        issue(
          "missing-action",
          "action",
          "error",
          "action proposal could not be normalized into a contract-safe shape",
          "proposal",
        ),
      ]),
    });
  }
}

/**
 * Evaluates a preparation request against action contracts.
 * Statuses: accepted | incomplete | rejected.
 * Never dispatches or mutates external systems.
 */
export function evaluateRuntimeExecutiveActionPreparationContract(
  value: unknown,
): RuntimeExecutiveActionPreparationResult {
  if (!isPlainObject(value) || value.draft === undefined) {
    return Object.freeze({
      status: "rejected",
      valid: false,
      incomplete: false,
      issues: freezeIssues([
        issue(
          "missing-action",
          "action",
          "error",
          "preparation request requires a draft/proposal",
          "draft",
        ),
      ]),
    });
  }

  const requireResolvedRecipient = value.requireResolvedRecipient !== false;
  const proposalEval = evaluateRuntimeExecutiveActionProposalContract(
    value.draft,
  );

  if (!proposalEval.valid) {
    return Object.freeze({
      status: "rejected",
      valid: false,
      incomplete: false,
      issues: proposalEval.issues,
    });
  }

  const issues: RuntimeExecutiveActionContractIssue[] = [
    ...proposalEval.issues.filter((entry) => entry.severity === "error"),
  ];

  let context: RuntimeExecutiveActionContext | undefined;
  if (value.context !== undefined) {
    const contextEval = evaluateRuntimeExecutiveActionContextContract(
      value.context,
    );
    if (!contextEval.valid) {
      return Object.freeze({
        status: "rejected",
        valid: false,
        incomplete: false,
        issues: contextEval.issues,
      });
    }
    context = contextEval.value?.context;
  }

  if (
    value.requestedLifecycle !== undefined &&
    !isRuntimeExecutiveActionLifecycleState(value.requestedLifecycle)
  ) {
    return Object.freeze({
      status: "rejected",
      valid: false,
      incomplete: false,
      issues: freezeIssues([
        issue(
          "invalid-lifecycle-state",
          "lifecycle",
          "error",
          "requested lifecycle is not canonical",
          "requestedLifecycle",
        ),
      ]),
    });
  }

  const draft = proposalToDraft({
    ...proposalEval.value,
    ...(context !== undefined ? { context } : {}),
  });

  const current = draft.lifecycle;
  const requested =
    (value.requestedLifecycle as RuntimeExecutiveActionLifecycleState | undefined) ??
    "prepared";

  if (current !== requested) {
    const lifecycleEval = evaluateRuntimeExecutiveActionLifecycleContract({
      current,
      requested,
    });
    if (!lifecycleEval.valid) {
      return Object.freeze({
        status: "rejected",
        valid: false,
        incomplete: false,
        issues: lifecycleEval.issues,
        readiness: evaluateRuntimeExecutiveActionReadiness(draft),
      });
    }
  }

  const readiness = evaluateRuntimeExecutiveActionReadiness(draft);
  const missing: Array<
    RuntimeExecutiveActionReadinessMissingField | "resolved-recipient"
  > = [...readiness.missing];

  if (
    requireResolvedRecipient &&
    draft.recipient !== undefined &&
    draft.recipient.kind === "unresolved"
  ) {
    missing.push("resolved-recipient");
    issues.push(
      issue(
        "incomplete-action",
        "recipient",
        "warning",
        "preparation requires a resolved recipient",
        "recipient",
      ),
    );
  } else if (requireResolvedRecipient && draft.recipient === undefined) {
    if (!missing.includes("recipient")) {
      missing.push("recipient");
    }
    issues.push(
      issue(
        "incomplete-action",
        "recipient",
        "warning",
        "preparation requires a recipient",
        "recipient",
      ),
    );
  }

  if (readiness.status === "incomplete" || missing.length > 0) {
    // Ensure incomplete-action issue present for readiness gaps
    if (
      readiness.status === "incomplete" &&
      !issues.some((entry) => entry.code === "incomplete-action")
    ) {
      issues.push(
        issue(
          "incomplete-action",
          "readiness",
          "warning",
          "action is preparation-incomplete",
          "readiness",
        ),
      );
    }

    return Object.freeze({
      status: "incomplete",
      valid: true,
      incomplete: true,
      issues: freezeIssues(issues),
      value: draft,
      readiness,
      missing: Object.freeze([...new Set(missing)]),
    });
  }

  return Object.freeze({
    status: "accepted",
    valid: true,
    incomplete: false,
    issues: Object.freeze([]),
    value: draft,
    readiness,
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveActionExperienceContractsIdentity():
  typeof runtimeExecutiveActionExperienceContractsCanonicalIdentity {
  return runtimeExecutiveActionExperienceContractsCanonicalIdentity;
}

export function getRuntimeExecutiveActionExperienceContractsGuarantees():
  typeof RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES {
  return RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES;
}

export function getRuntimeExecutiveActionExperienceContractsRegistry():
  typeof runtimeExecutiveActionExperienceContractsRegistry {
  return runtimeExecutiveActionExperienceContractsRegistry;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveActionExperienceContractsApiNames =
  Object.freeze([
    "getRuntimeExecutiveActionExperienceContractsIdentity",
    "getRuntimeExecutiveActionExperienceContractsRegistry",
    "getRuntimeExecutiveActionExperienceContractsGuarantees",
    "isRuntimeExecutiveActionContractFamily",
    "isRuntimeExecutiveActionContractIssueCode",
    "isRuntimeExecutiveActionPreparationResultStatus",
    "isRuntimeExecutiveActionContractGuarantee",
    "createRuntimeExecutiveActionContractMetadata",
    "createRuntimeExecutiveActionProposalContract",
    "createRuntimeExecutiveActionSubjectContract",
    "createRuntimeExecutiveActionTargetContract",
    "createRuntimeExecutiveActionRecipientContract",
    "createRuntimeExecutiveActionIntentContract",
    "createRuntimeExecutiveActionPriorityContract",
    "createRuntimeExecutiveActionContextContract",
    "createRuntimeExecutiveActionLifecycleContract",
    "createRuntimeExecutiveActionPreparationRequest",
    "createRuntimeExecutiveActionOutcomeContract",
    "evaluateRuntimeExecutiveActionSubjectContract",
    "evaluateRuntimeExecutiveActionTargetContract",
    "evaluateRuntimeExecutiveActionRecipientContract",
    "evaluateRuntimeExecutiveActionIntentContract",
    "evaluateRuntimeExecutiveActionPriorityContract",
    "evaluateRuntimeExecutiveActionContextContract",
    "evaluateRuntimeExecutiveActionLifecycleContract",
    "evaluateRuntimeExecutiveActionReadinessContract",
    "evaluateRuntimeExecutiveActionProposalContract",
    "evaluateRuntimeExecutiveActionPreparationContract",
    "verifyRuntimeExecutiveActionExperienceContracts",
  ] as const);

export const RUNTIME_EXECUTIVE_ACTION_CONTRACTS_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveActionContractFamily",
    "RuntimeExecutiveActionContractGuarantee",
    "RuntimeExecutiveActionContractIssueCode",
    "RuntimeExecutiveActionContractIssueDomain",
    "RuntimeExecutiveActionContractIssueSeverity",
    "RuntimeExecutiveActionPreparationResultStatus",
    "RuntimeExecutiveActionContractRegistrySection",
    "RuntimeExecutiveActionContractMetadata",
    "RuntimeExecutiveActionContractIssue",
    "RuntimeExecutiveActionContractEvaluationResult",
    "RuntimeExecutiveActionProposalContract",
    "RuntimeExecutiveActionSubjectContract",
    "RuntimeExecutiveActionTargetContract",
    "RuntimeExecutiveActionRecipientContract",
    "RuntimeExecutiveActionIntentContract",
    "RuntimeExecutiveActionPriorityContract",
    "RuntimeExecutiveActionContextContract",
    "RuntimeExecutiveActionLifecycleContract",
    "RuntimeExecutiveActionReadinessContract",
    "RuntimeExecutiveActionPreparationRequest",
    "RuntimeExecutiveActionPreparationResult",
    "RuntimeExecutiveActionOutcomeContract",
    "RuntimeExecutiveActionLifecycleEvaluation",
    "RuntimeExecutiveActionExperienceContractsVerification",
  ] as const);

export const runtimeExecutiveActionExperienceContractsRegistry =
  Object.freeze({
    identity: runtimeExecutiveActionExperienceContractsIdentity,
    version: runtimeExecutiveActionExperienceContractsVersion,
    namespace: runtimeExecutiveActionExperienceContractsNamespace,
    layer: runtimeExecutiveActionExperienceContractsLayer,
    capability: runtimeExecutiveActionExperienceContractsCapability,
    phase: runtimeExecutiveActionExperienceContractsPhase,
    status: runtimeExecutiveActionExperienceContractsStatus,
    architecturalRole:
      runtimeExecutiveActionExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionExperienceContractsDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionExperienceContractsDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperienceContractsSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_ACTION_CONTRACT_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_REGISTRY_SECTIONS.length,
    contractFamilies: RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES,
    contractFamilyCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES.length,
    proposalContractCount: 1,
    subjectContractCount: 1,
    targetContractCount: 1,
    recipientContractCount: 1,
    intentContractCount: 1,
    priorityContractCount: 1,
    contextContractCount: 1,
    lifecycleContractCount: 1,
    readinessContractCount: 1,
    preparationContractCount: 1,
    resultContractCount: 1,
    outcomeContractCount: 1,
    actionKinds: RUNTIME_EXECUTIVE_ACTION_CONTRACT_KINDS,
    actionKindCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_KINDS.length,
    subjectKinds: RUNTIME_EXECUTIVE_ACTION_CONTRACT_SUBJECT_KINDS,
    subjectKindCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_SUBJECT_KINDS.length,
    targetKinds: RUNTIME_EXECUTIVE_ACTION_CONTRACT_TARGET_KINDS,
    targetKindCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_TARGET_KINDS.length,
    recipientKinds: RUNTIME_EXECUTIVE_ACTION_CONTRACT_RECIPIENT_KINDS,
    recipientKindCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_RECIPIENT_KINDS.length,
    intentKinds: RUNTIME_EXECUTIVE_ACTION_CONTRACT_INTENT_KINDS,
    intentKindCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_INTENT_KINDS.length,
    priorities: RUNTIME_EXECUTIVE_ACTION_CONTRACT_PRIORITIES,
    priorityCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_PRIORITIES.length,
    lifecycleStates: RUNTIME_EXECUTIVE_ACTION_CONTRACT_LIFECYCLE_STATES,
    lifecycleStateCount:
      RUNTIME_EXECUTIVE_ACTION_CONTRACT_LIFECYCLE_STATES.length,
    readinessStatuses: RUNTIME_EXECUTIVE_ACTION_CONTRACT_READINESS_STATUSES,
    preparationResultStatuses:
      RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES,
    preparationResultStatusCount:
      RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES.length,
    issueCodes: RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES,
    issueCodeCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES.length,
    issueDomains: RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_DOMAINS,
    guarantees: RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES,
    guaranteeCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES.length,
    publicTypes: RUNTIME_EXECUTIVE_ACTION_CONTRACTS_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ACTION_CONTRACTS_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveActionExperienceContractsApiNames,
    publicApiCount:
      runtimeExecutiveActionExperienceContractsApiNames.length,
  });

export const runtimeExecutiveActionExperienceContracts = Object.freeze({
  phase: "Contracts" as const,
  name: "RuntimeExecutiveActionExperienceContracts" as const,
  identity: runtimeExecutiveActionExperienceContractsIdentity,
  version: runtimeExecutiveActionExperienceContractsVersion,
  namespace: runtimeExecutiveActionExperienceContractsNamespace,
  layer: runtimeExecutiveActionExperienceContractsLayer,
  capability: runtimeExecutiveActionExperienceContractsCapability,
  architecturalRole:
    runtimeExecutiveActionExperienceContractsArchitecturalRole,
  role: "Contracts" as const,
  status: runtimeExecutiveActionExperienceContractsStatus,
  upstreamDependency:
    runtimeExecutiveActionExperienceContractsDependencyIdentity,
  dependencyPath:
    runtimeExecutiveActionExperienceContractsDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionExperienceContractsSupportedImportPath,
  deterministic: runtimeExecutiveActionExperienceContractsDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  foundationAligned: true as const,
  progressiveConstructionSafe: true as const,
  incompleteDistinctFromInvalid: true as const,
  subjectTargetRecipientSeparated: true as const,
  kindIntentSeparated: true as const,
  contextPreserving: true as const,
  rendererIndependent: true as const,
  providerIndependent: true as const,
  transportIndependent: true as const,
  dispatchFree: true as const,
  principle: RUNTIME_EXECUTIVE_ACTION_CONTRACTS_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ACTION_CONTRACTS_BOUNDARY,
  contractFamilies: RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES,
  issueCodes: RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES,
  preparationResultStatuses:
    RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES,
  guarantees: RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES,
  publicTypeNames: RUNTIME_EXECUTIVE_ACTION_CONTRACTS_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveActionExperienceContractsApiNames,
  registry: runtimeExecutiveActionExperienceContractsRegistry,
  foundationBoundary: "REX-5:1-foundation-only" as const,
  architecturalStatus:
    "REX-5:2 Runtime Executive Action Experience Contracts — ContractsReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionExperienceContractsVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveActionExperienceContractsIdentity;
  readonly version: typeof runtimeExecutiveActionExperienceContractsVersion;
  readonly namespace: typeof runtimeExecutiveActionExperienceContractsNamespace;
  readonly phase: typeof runtimeExecutiveActionExperienceContractsPhase;
  readonly architecturalRole: typeof runtimeExecutiveActionExperienceContractsArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveActionExperienceContractsDependencyIdentity;
  readonly contractFamilyCount: number;
  readonly issueCodeCount: number;
  readonly preparationResultStatusCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly foundationBoundaryIntact: boolean;
  readonly incompleteDistinctFromInvalid: boolean;
  readonly subjectTargetRecipientSeparated: boolean;
  readonly kindIntentSeparated: boolean;
  readonly contextPreserving: boolean;
  readonly lifecycleAligned: boolean;
  readonly rendererIndependent: boolean;
  readonly providerIndependent: boolean;
  readonly transportIndependent: boolean;
  readonly dispatchFree: boolean;
  readonly upstreamFoundationOk: boolean;
}

export function verifyRuntimeExecutiveActionExperienceContracts():
  RuntimeExecutiveActionExperienceContractsVerification {
  const module = runtimeExecutiveActionExperienceContracts;
  const registry = runtimeExecutiveActionExperienceContractsRegistry;
  const upstream = verifyRuntimeExecutiveActionExperienceFoundation();

  const identityOk =
    module.identity ===
      "REX-5:2/RuntimeExecutiveActionExperienceContracts" &&
    module.version === "5.2.0" &&
    module.namespace === "nexora.rex.action-experience.contracts" &&
    module.phase === "Contracts" &&
    module.architecturalRole === "ExecutiveActionExperienceContractLayer" &&
    module.upstreamDependency ===
      "REX-5:1/RuntimeExecutiveActionExperienceFoundation" &&
    module.upstreamDependency ===
      runtimeExecutiveActionExperienceFoundationIdentity &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveActionExperienceFoundation" &&
    module.foundationBoundary === "REX-5:1-foundation-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES], [
      "ActionProposal",
      "ActionSubject",
      "ActionTarget",
      "ActionRecipient",
      "ActionIntent",
      "ActionPriority",
      "ActionContext",
      "ActionLifecycle",
      "ActionReadiness",
      "ActionPreparation",
      "ActionOutcome",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES], [
      "missing-action",
      "invalid-action-kind",
      "missing-subject",
      "invalid-subject",
      "invalid-target",
      "invalid-recipient",
      "missing-intent",
      "invalid-intent",
      "invalid-priority",
      "invalid-context",
      "invalid-lifecycle-state",
      "invalid-lifecycle-transition",
      "incomplete-action",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES], [
      "accepted",
      "incomplete",
      "rejected",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES], [
      "deterministic",
      "immutable",
      "foundation-aligned",
      "contract-composable",
      "progressive-construction-safe",
      "incomplete-distinct-from-invalid",
      "subject-target-recipient-separated",
      "kind-intent-separated",
      "context-preserving",
      "renderer-independent",
      "provider-independent",
      "transport-independent",
      "side-effect-free",
      "dispatch-free",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ACTION_CONTRACT_REGISTRY_SECTIONS],
      [
        "Identity",
        "ContractFamilies",
        "ProposalContracts",
        "SubjectContracts",
        "TargetContracts",
        "RecipientContracts",
        "IntentContracts",
        "PriorityContracts",
        "ContextContracts",
        "LifecycleContracts",
        "ReadinessContracts",
        "PreparationContracts",
        "ResultContracts",
        "IssueCodes",
        "PublicAPIs",
        "Guarantees",
      ],
    ) &&
    RUNTIME_EXECUTIVE_ACTION_CONTRACT_KINDS === RUNTIME_EXECUTIVE_ACTION_KINDS &&
    RUNTIME_EXECUTIVE_ACTION_CONTRACT_PRIORITIES ===
      RUNTIME_EXECUTIVE_ACTION_PRIORITIES &&
    RUNTIME_EXECUTIVE_ACTION_CONTRACT_LIFECYCLE_STATES ===
      RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES;

  const lifecycleAligned =
    canTransitionRuntimeExecutiveActionLifecycle("draft", "prepared") &&
    !canTransitionRuntimeExecutiveActionLifecycle("cancelled", "confirmed") &&
    evaluateRuntimeExecutiveActionLifecycleContract({
      current: "draft",
      requested: "prepared",
    }).valid === true &&
    evaluateRuntimeExecutiveActionLifecycleContract({
      current: "cancelled",
      requested: "confirmed",
    }).valid === false;

  const incompleteDistinct =
    (() => {
      const proposal = evaluateRuntimeExecutiveActionProposalContract({
        kind: "request",
        subject: {
          kind: "object",
          id: "object.project-alpha",
          label: "Project Alpha",
        },
        recipient: { kind: "unresolved", label: "ops manager" },
        intent: { kind: "request-information" },
        priority: "high",
        title: "Request Update",
      });
      const preparation = evaluateRuntimeExecutiveActionPreparationContract({
        draft: proposal.valid ? proposal.value : {},
        requireResolvedRecipient: true,
      });
      return (
        proposal.valid === true &&
        preparation.status === "incomplete" &&
        preparation.valid === true &&
        preparation.incomplete === true
      );
    })();

  const countsOk =
    registry.contractFamilyCount ===
      RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES.length &&
    registry.issueCodeCount ===
      RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_ACTION_CONTRACT_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      runtimeExecutiveActionExperienceContractsApiNames.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_ACTION_CONTRACTS_PUBLIC_TYPE_NAMES.length &&
    unique([...RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES]);

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES) &&
    Object.isFrozen(runtimeExecutiveActionExperienceContractsCanonicalIdentity) &&
    Object.isFrozen(runtimeExecutiveActionExperienceContractsRegistry) &&
    Object.isFrozen(runtimeExecutiveActionExperienceContracts);

  const ok =
    identityOk &&
    vocabOk &&
    countsOk &&
    frozen &&
    lifecycleAligned &&
    incompleteDistinct &&
    module.incompleteDistinctFromInvalid === true &&
    module.subjectTargetRecipientSeparated === true &&
    module.kindIntentSeparated === true &&
    module.contextPreserving === true &&
    module.rendererIndependent === true &&
    module.providerIndependent === true &&
    module.transportIndependent === true &&
    module.dispatchFree === true &&
    upstream.ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveActionExperienceContractsIdentity,
    version: runtimeExecutiveActionExperienceContractsVersion,
    namespace: runtimeExecutiveActionExperienceContractsNamespace,
    phase: runtimeExecutiveActionExperienceContractsPhase,
    architecturalRole:
      runtimeExecutiveActionExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionExperienceContractsDependencyIdentity,
    contractFamilyCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_FAMILIES.length,
    issueCodeCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_ISSUE_CODES.length,
    preparationResultStatusCount:
      RUNTIME_EXECUTIVE_ACTION_PREPARATION_RESULT_STATUSES.length,
    guaranteeCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_GUARANTEES.length,
    sectionCount: RUNTIME_EXECUTIVE_ACTION_CONTRACT_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ACTION_CONTRACTS_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveActionExperienceContractsApiNames.length,
    frozen,
    foundationBoundaryIntact:
      module.foundationBoundary === "REX-5:1-foundation-only",
    incompleteDistinctFromInvalid: incompleteDistinct,
    subjectTargetRecipientSeparated:
      module.subjectTargetRecipientSeparated === true,
    kindIntentSeparated: module.kindIntentSeparated === true,
    contextPreserving: module.contextPreserving === true,
    lifecycleAligned,
    rendererIndependent: module.rendererIndependent === true,
    providerIndependent: module.providerIndependent === true,
    transportIndependent: module.transportIndependent === true,
    dispatchFree: module.dispatchFree === true,
    upstreamFoundationOk: upstream.ok === true,
  });
}
