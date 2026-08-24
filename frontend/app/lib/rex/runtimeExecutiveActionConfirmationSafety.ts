/**
 * REX-5:5 — Runtime Executive Action Confirmation & Safety.
 *
 * Evaluates whether a previewed executive action is safe and clear enough
 * for confirmation, and produces immutable confirmation decisions.
 *
 * Canonical flow:
 *   REX-5:4 Presentation & Preview → REX-5:5 Confirmation & Safety → later Orchestration
 *
 * Answers:
 *   Is this action safe and clear enough for the executive to confirm?
 *   What exactly is the executive confirming?
 *
 * Confirmation ≠ Dispatch ≠ External Execution.
 *
 * No UI, no AI, no recipient lookup, no authorization, no provider integration.
 */

import {
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionIntentContextIdentity,
  runtimeExecutiveActionPresentationPreviewIdentity,
  runtimeExecutiveActionPresentationPreviewSupportedImportPath,
  runtimeExecutiveActionPresentationPreviewVersion,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionIntentContext,
  verifyRuntimeExecutiveActionPresentationPreview,
  type RuntimeExecutiveActionDraft,
  type RuntimeExecutiveActionIntentContextRequest,
  type RuntimeExecutiveActionIntentContextResult,
  type RuntimeExecutiveActionPreparationResult,
  type RuntimeExecutiveActionPresentation,
  type RuntimeExecutiveActionPreview,
  type RuntimeExecutiveActionPreviewRequest,
  type RuntimeExecutiveActionPreviewResult,
  type RuntimeExecutiveActionPreviewWarning,
  type RuntimeExecutiveActionProposalContract,
} from "@/app/lib/rex/runtimeExecutiveActionPresentationPreview";

// ─── Transitively published Preview/Intent/Contracts/Foundation (for REX-5:6+)
// Additive publication: orchestration/platform obtain the full REX-5 chain through REX-5:5.

export {
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionIntentContextIdentity,
  runtimeExecutiveActionPresentationPreviewIdentity,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionIntentContext,
  verifyRuntimeExecutiveActionPresentationPreview,
};

export type {
  RuntimeExecutiveActionDraft,
  RuntimeExecutiveActionIntentContextRequest,
  RuntimeExecutiveActionIntentContextResult,
  RuntimeExecutiveActionPreparationResult,
  RuntimeExecutiveActionPreviewRequest,
  RuntimeExecutiveActionPreviewResult,
  RuntimeExecutiveActionProposalContract,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveActionConfirmationSafetyIdentity =
  "REX-5:5/RuntimeExecutiveActionConfirmationSafety" as const;

export const runtimeExecutiveActionConfirmationSafetyVersion =
  "5.5.0" as const;

export const runtimeExecutiveActionConfirmationSafetyNamespace =
  "nexora.rex.action-experience.confirmation-safety" as const;

export const runtimeExecutiveActionConfirmationSafetyLayer = "REX" as const;

export const runtimeExecutiveActionConfirmationSafetyCapability =
  "RuntimeExecutiveActionExperience" as const;

export const runtimeExecutiveActionConfirmationSafetyPhase =
  "ConfirmationSafety" as const;

export const runtimeExecutiveActionConfirmationSafetyStatus =
  "ConfirmationSafetyReady" as const;

export const runtimeExecutiveActionConfirmationSafetyArchitecturalRole =
  "ExecutiveActionConfirmationSafetyRuntime" as const;

export const runtimeExecutiveActionConfirmationSafetyDependencyIdentity =
  runtimeExecutiveActionPresentationPreviewIdentity;

export const runtimeExecutiveActionConfirmationSafetyDependencyPath =
  runtimeExecutiveActionPresentationPreviewSupportedImportPath;

export const runtimeExecutiveActionConfirmationSafetySupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveActionConfirmationSafety" as const;

export const runtimeExecutiveActionConfirmationSafetyStability =
  "ConfirmationSafetyReady" as const;

export const runtimeExecutiveActionConfirmationSafetyDeterministic =
  true as const;

export const runtimeExecutiveActionConfirmationSafetySideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveActionConfirmationSafetyMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveActionConfirmationSafetyCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveActionConfirmationSafetyIdentity,
    version: runtimeExecutiveActionConfirmationSafetyVersion,
    namespace: runtimeExecutiveActionConfirmationSafetyNamespace,
    layer: runtimeExecutiveActionConfirmationSafetyLayer,
    capability: runtimeExecutiveActionConfirmationSafetyCapability,
    phase: runtimeExecutiveActionConfirmationSafetyPhase,
    status: runtimeExecutiveActionConfirmationSafetyStatus,
    architecturalRole:
      runtimeExecutiveActionConfirmationSafetyArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionConfirmationSafetyDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionConfirmationSafetyDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionConfirmationSafetySupportedImportPath,
    upstreamVersion: runtimeExecutiveActionPresentationPreviewVersion,
    stabilityStatus: runtimeExecutiveActionConfirmationSafetyStability,
    deterministicStatus:
      runtimeExecutiveActionConfirmationSafetyDeterministic,
    sideEffectPolicy:
      runtimeExecutiveActionConfirmationSafetySideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveActionConfirmationSafetyMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_PRINCIPLE =
  "Preview Ready ≠ Confirmation Ready ≠ Confirmed ≠ Dispatched ≠ Executed Externally. Confirmation approves a canonical payload for downstream orchestration only." as const;

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    confirmationAuthority: "REX-5:5" as const,
    architecturalRole: "ExecutiveActionConfirmationSafetyRuntime" as const,
    soleImmediateDependency:
      "REX-5:4/RuntimeExecutiveActionPresentationPreview" as const,
    consumesPresentationPreviewOnly: true as const,
    importsRex53Directly: false as const,
    importsRex52Directly: false as const,
    importsRex51Directly: false as const,
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
    aiIndependent: true as const,
    introducesDispatch: false as const,
    introducesUiBehavior: false as const,
    introducesRendering: false as const,
    introducesAuthorization: false as const,
    introducesRecipientResolution: false as const,
    introducesLlmInference: false as const,
    introducesExternalIntegration: false as const,
    introducesPersistence: false as const,
  });

// ─── Inherited preview vocabularies ─────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_PREVIEW_STATUSES =
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES;
export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_PREVIEW_WARNING_CODES =
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES;

// ─── Confirmation / safety vocabularies ─────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES = Object.freeze([
  "not-ready",
  "ready",
  "confirmed",
  "declined",
  "cancelled",
] as const);

export type RuntimeExecutiveActionConfirmationStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES = Object.freeze([
  "standard",
  "review-required",
  "explicit-high-risk",
] as const);

export type RuntimeExecutiveActionConfirmationMode =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_READINESS_STATES =
  Object.freeze(["not-ready", "review-required", "ready"] as const);

export type RuntimeExecutiveActionConfirmationReadinessState =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_READINESS_STATES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_RESULT_STATUSES =
  Object.freeze([
    "accepted",
    "blocked",
    "declined",
    "cancelled",
    "rejected",
  ] as const);

export type RuntimeExecutiveActionConfirmationResultStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_RESULT_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES = Object.freeze([
  "safe",
  "review",
  "blocked",
] as const);

export type RuntimeExecutiveActionSafetyStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_SAFETY_SEVERITIES = Object.freeze([
  "info",
  "caution",
  "high",
  "blocking",
] as const);

export type RuntimeExecutiveActionSafetySeverity =
  (typeof RUNTIME_EXECUTIVE_ACTION_SAFETY_SEVERITIES)[number];

export const RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_DOMAINS = Object.freeze([
  "subject",
  "target",
  "recipient",
  "intent",
  "priority",
  "reason",
  "context",
  "consequence",
  "lifecycle",
  "confirmation",
] as const);

export type RuntimeExecutiveActionSafetyIssueDomain =
  (typeof RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_DOMAINS)[number];

export const RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES = Object.freeze([
  "recipient-unresolved",
  "recipient-missing",
  "target-missing",
  "intent-ambiguous",
  "intent-unresolved",
  "context-conflict",
  "reason-missing",
  "consequence-unclear",
  "critical-priority-review",
  "lifecycle-not-confirmable",
  "preview-blocked",
  "confirmation-scope-missing",
  "review-acknowledgment-required",
  "high-risk-explicit-acknowledgment-required",
  "confirmation-scope-changed",
  "subject-missing",
] as const);

export type RuntimeExecutiveActionSafetyIssueCode =
  (typeof RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES)[number];

export const RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS = Object.freeze([
  "reviewed-warning",
  "accepted-critical-priority",
  "accepted-consequence",
  "accepted-unresolved-recipient",
] as const);

export type RuntimeExecutiveActionAcknowledgmentKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_DECISIONS = Object.freeze([
  "evaluate",
  "confirm",
  "decline",
  "cancel",
] as const);

export type RuntimeExecutiveActionConfirmationDecision =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_DECISIONS)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMABLE_LIFECYCLES = Object.freeze([
  "prepared",
  "pending-confirmation",
] as const);

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES =
  Object.freeze([
    "deterministic",
    "immutable",
    "preview-aligned",
    "scope-stable",
    "safety-aware",
    "blocking-aware",
    "review-aware",
    "acknowledgment-explicit",
    "critical-action-safe",
    "ambiguity-blocking",
    "context-conflict-preserving",
    "lifecycle-aware",
    "renderer-independent",
    "provider-independent",
    "transport-independent",
    "side-effect-free",
    "dispatch-free",
  ] as const);

export type RuntimeExecutiveActionConfirmationSafetyGuarantee =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "ConfirmationStatuses",
    "ConfirmationModes",
    "ConfirmationReadiness",
    "SafetyStatuses",
    "SafetySeverities",
    "SafetyIssueDomains",
    "SafetyIssueCodes",
    "AcknowledgmentKinds",
    "ReviewRequirements",
    "ConfirmationPolicy",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveActionConfirmationSafetyRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_REGISTRY_SECTIONS)[number];

// ─── Policy ─────────────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionConfirmationPolicyRule {
  readonly id: string;
  readonly kind:
    | "block-preview-status"
    | "block-intent"
    | "block-lifecycle"
    | "block-missing-subject"
    | "block-unresolved-recipient-send"
    | "review-unresolved-recipient-assign"
    | "review-critical-priority"
    | "review-context-conflict"
    | "review-missing-consequence-operation"
    | "caution-missing-target"
    | "info-missing-reason";
  readonly description: string;
}

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY_RULES = Object.freeze([
  Object.freeze({
    id: "block-preview-blocked",
    kind: "block-preview-status",
    description: "Blocked preview cannot be confirmed",
  }),
  Object.freeze({
    id: "block-intent-ambiguous",
    kind: "block-intent",
    description: "Ambiguous intent blocks confirmation",
  }),
  Object.freeze({
    id: "block-intent-unresolved",
    kind: "block-intent",
    description: "Unresolved intent blocks confirmation",
  }),
  Object.freeze({
    id: "block-lifecycle-not-confirmable",
    kind: "block-lifecycle",
    description: "Only prepared/pending-confirmation may be confirmed",
  }),
  Object.freeze({
    id: "block-subject-missing",
    kind: "block-missing-subject",
    description: "Missing subject blocks confirmation",
  }),
  Object.freeze({
    id: "block-unresolved-recipient-send",
    kind: "block-unresolved-recipient-send",
    description: "Send/request with unresolved recipient is blocking",
  }),
  Object.freeze({
    id: "review-unresolved-recipient-assign",
    kind: "review-unresolved-recipient-assign",
    description:
      "Assign with unresolved role recipient requires acknowledgment",
  }),
  Object.freeze({
    id: "review-critical-priority",
    kind: "review-critical-priority",
    description: "Critical priority requires explicit acknowledgment",
  }),
  Object.freeze({
    id: "review-context-conflict",
    kind: "review-context-conflict",
    description: "Context conflict requires review acknowledgment",
  }),
  Object.freeze({
    id: "review-missing-consequence-operation",
    kind: "review-missing-consequence-operation",
    description: "Operation preview without consequence requires review",
  }),
  Object.freeze({
    id: "caution-missing-target",
    kind: "caution-missing-target",
    description: "Missing target is cautionary, not always blocking",
  }),
  Object.freeze({
    id: "info-missing-reason",
    kind: "info-missing-reason",
    description: "Missing reason is informational",
  }),
] as const satisfies ReadonlyArray<RuntimeExecutiveActionConfirmationPolicyRule>);

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY = Object.freeze({
  identity: "REX-5:5/CanonicalConfirmationPolicy" as const,
  confirmableLifecycles: RUNTIME_EXECUTIVE_ACTION_CONFIRMABLE_LIFECYCLES,
  confirmablePreviewStatuses: Object.freeze([
    "ready",
    "partial",
  ] as const),
  rules: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY_RULES,
  ruleCount: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY_RULES.length,
  criticalRequiresAcknowledgment: true as const,
  ambiguityBlocks: true as const,
  sendUnresolvedRecipientBlocks: true as const,
  assignUnresolvedRecipientReview: true as const,
});

// ─── Domain models ──────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionConfirmationScope {
  readonly actionId?: string;
  readonly actionKind?: string;
  readonly subjectId?: string;
  readonly subjectLabel?: string;
  readonly targetId?: string;
  readonly targetLabel?: string;
  readonly recipientId?: string;
  readonly recipientKind?: string;
  readonly recipientLabel?: string;
  readonly intent?: string;
  readonly intentStatus?: string;
  readonly priority?: string;
  readonly reason?: string;
  readonly consequence?: string;
  readonly lifecycle?: string;
  readonly title?: string;
}

export interface RuntimeExecutiveActionConfirmationFingerprint {
  readonly value: string;
  readonly algorithm: "rex-action-scope-v1";
  readonly scope: RuntimeExecutiveActionConfirmationScope;
}

export interface RuntimeExecutiveActionSafetyIssue {
  readonly code: RuntimeExecutiveActionSafetyIssueCode;
  readonly domain: RuntimeExecutiveActionSafetyIssueDomain;
  readonly severity: RuntimeExecutiveActionSafetySeverity;
  readonly blocking: boolean;
  readonly message: string;
  readonly field?: string;
}

export interface RuntimeExecutiveActionSafetyEvaluation {
  readonly status: RuntimeExecutiveActionSafetyStatus;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionSafetyIssue>;
  readonly dimensions: Readonly<{
    readonly clarity: "clear" | "unclear";
    readonly recipientCertainty: "certain" | "uncertain" | "missing";
    readonly intentCertainty: "certain" | "ambiguous" | "unresolved";
    readonly targetCertainty: "certain" | "missing";
    readonly contextConsistency: "consistent" | "conflicted";
    readonly prioritySeverity: "normal" | "elevated" | "critical";
    readonly consequenceClarity: "clear" | "unclear";
    readonly lifecycleValidity: "confirmable" | "not-confirmable";
  }>;
}

export interface RuntimeExecutiveActionReviewRequirement {
  readonly id: string;
  readonly reason: string;
  readonly requiredAcknowledgment: RuntimeExecutiveActionAcknowledgmentKind;
  readonly relatedIssueCode?: RuntimeExecutiveActionSafetyIssueCode;
  readonly requiredMode: RuntimeExecutiveActionConfirmationMode;
}

export interface RuntimeExecutiveActionAcknowledgment {
  readonly kind: RuntimeExecutiveActionAcknowledgmentKind;
  readonly acknowledged: boolean;
  readonly reference?: string;
}

export interface RuntimeExecutiveActionConfirmationReadiness {
  readonly state: RuntimeExecutiveActionConfirmationReadinessState;
  readonly mode: RuntimeExecutiveActionConfirmationMode;
  readonly reviewRequirements: ReadonlyArray<RuntimeExecutiveActionReviewRequirement>;
  readonly canConfirm: boolean;
}

export interface RuntimeExecutiveActionConfirmationExplanation {
  readonly summary: string;
  readonly readinessReason: string;
  readonly confirmingStatement?: string;
}

export interface RuntimeExecutiveActionConfirmation {
  readonly actionId?: string;
  readonly previewTitle: string;
  readonly status: RuntimeExecutiveActionConfirmationStatus;
  readonly mode: RuntimeExecutiveActionConfirmationMode;
  readonly scope: RuntimeExecutiveActionConfirmationScope;
  readonly fingerprint: RuntimeExecutiveActionConfirmationFingerprint;
  readonly safety: RuntimeExecutiveActionSafetyEvaluation;
  readonly readiness: RuntimeExecutiveActionConfirmationReadiness;
  readonly reviewRequirements: ReadonlyArray<RuntimeExecutiveActionReviewRequirement>;
  readonly explanation: RuntimeExecutiveActionConfirmationExplanation;
  readonly resultingLifecycleIntent?: "confirmed";
  readonly metadata?: Readonly<Record<string, string>>;
  readonly identity: typeof runtimeExecutiveActionConfirmationSafetyIdentity;
  readonly version: typeof runtimeExecutiveActionConfirmationSafetyVersion;
}

export interface RuntimeExecutiveActionConfirmationRequest {
  readonly previewResult: RuntimeExecutiveActionPreviewResult;
  readonly decision: RuntimeExecutiveActionConfirmationDecision;
  readonly acknowledgments?: ReadonlyArray<RuntimeExecutiveActionAcknowledgment>;
  readonly expectedFingerprint?: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export type RuntimeExecutiveActionConfirmationResult =
  | {
      readonly status: "accepted";
      readonly confirmation: RuntimeExecutiveActionConfirmation;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionSafetyIssue>;
    }
  | {
      readonly status: "blocked";
      readonly confirmation: RuntimeExecutiveActionConfirmation;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionSafetyIssue>;
    }
  | {
      readonly status: "declined";
      readonly confirmation: RuntimeExecutiveActionConfirmation;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionSafetyIssue>;
    }
  | {
      readonly status: "cancelled";
      readonly confirmation: RuntimeExecutiveActionConfirmation;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionSafetyIssue>;
    }
  | {
      readonly status: "rejected";
      readonly confirmation?: undefined;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionSafetyIssue>;
    };

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function freezeArray<T>(values: readonly T[]): ReadonlyArray<T> {
  return Object.freeze([...values]);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function issue(
  code: RuntimeExecutiveActionSafetyIssueCode,
  domain: RuntimeExecutiveActionSafetyIssueDomain,
  severity: RuntimeExecutiveActionSafetySeverity,
  blocking: boolean,
  message: string,
  field?: string,
): RuntimeExecutiveActionSafetyIssue {
  return Object.freeze(
    field === undefined
      ? { code, domain, severity, blocking, message }
      : { code, domain, severity, blocking, message, field },
  );
}

/** Deterministic non-cryptographic fingerprint (FNV-1a 32-bit hex). */
function fnv1aHex(input: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function hasAcknowledgment(
  acknowledgments: ReadonlyArray<RuntimeExecutiveActionAcknowledgment> | undefined,
  kind: RuntimeExecutiveActionAcknowledgmentKind,
): boolean {
  return (
    acknowledgments?.some(
      (entry) => entry.kind === kind && entry.acknowledged === true,
    ) === true
  );
}

function warningHas(
  warnings: ReadonlyArray<RuntimeExecutiveActionPreviewWarning>,
  code: string,
): boolean {
  return warnings.some((entry) => entry.code === code);
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveActionConfirmationStatus(
  value: unknown,
): value is RuntimeExecutiveActionConfirmationStatus {
  return (
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionConfirmationMode(
  value: unknown,
): value is RuntimeExecutiveActionConfirmationMode {
  return (
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionConfirmationReadinessState(
  value: unknown,
): value is RuntimeExecutiveActionConfirmationReadinessState {
  return (
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_READINESS_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionSafetyStatus(
  value: unknown,
): value is RuntimeExecutiveActionSafetyStatus {
  return (
    RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionSafetyIssueCode(
  value: unknown,
): value is RuntimeExecutiveActionSafetyIssueCode {
  return (
    RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionAcknowledgmentKind(
  value: unknown,
): value is RuntimeExecutiveActionAcknowledgmentKind {
  return (
    RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS as readonly unknown[]
  ).includes(value);
}

// ─── Scope / fingerprint ────────────────────────────────────────────────────

export function createRuntimeExecutiveActionConfirmationScope(
  presentation: RuntimeExecutiveActionPresentation,
): RuntimeExecutiveActionConfirmationScope {
  return Object.freeze({
    ...(presentation.actionId !== undefined
      ? { actionId: presentation.actionId }
      : {}),
    ...(presentation.actionKind !== undefined
      ? { actionKind: presentation.actionKind }
      : {}),
    ...(presentation.subject !== undefined
      ? {
          subjectId: presentation.subject.id,
          subjectLabel: presentation.subject.label,
        }
      : {}),
    ...(presentation.target !== undefined
      ? {
          targetId: presentation.target.id,
          targetLabel: presentation.target.label,
        }
      : {}),
    ...(presentation.recipient !== undefined
      ? {
          recipientId: presentation.recipient.id,
          recipientKind: presentation.recipient.kind,
          recipientLabel: presentation.recipient.label,
        }
      : {}),
    ...(presentation.intent.resolvedIntent !== undefined
      ? { intent: presentation.intent.resolvedIntent }
      : {}),
    intentStatus: presentation.intent.status,
    ...(presentation.priority !== undefined
      ? { priority: presentation.priority.value }
      : {}),
    ...(presentation.reason !== undefined
      ? { reason: presentation.reason }
      : {}),
    ...(presentation.consequence !== undefined
      ? { consequence: presentation.consequence.statement }
      : {}),
    ...(presentation.lifecycle !== undefined
      ? { lifecycle: presentation.lifecycle.state }
      : {}),
    title: presentation.title,
  });
}

export function createRuntimeExecutiveActionConfirmationFingerprint(
  scope: RuntimeExecutiveActionConfirmationScope,
): RuntimeExecutiveActionConfirmationFingerprint {
  const material = [
    scope.actionKind ?? "",
    scope.subjectId ?? "",
    scope.targetId ?? "",
    scope.recipientKind ?? "",
    scope.recipientId ?? "",
    scope.intent ?? "",
    scope.intentStatus ?? "",
    scope.priority ?? "",
    scope.reason ?? "",
    scope.consequence ?? "",
    scope.lifecycle ?? "",
    scope.title ?? "",
  ].join("\u001f");

  return Object.freeze({
    value: `rex.confirm.v1:${fnv1aHex(material)}`,
    algorithm: "rex-action-scope-v1" as const,
    scope,
  });
}

export function hasRuntimeExecutiveActionChangedSincePreview(input: {
  readonly expectedFingerprint?: string;
  readonly currentFingerprint: RuntimeExecutiveActionConfirmationFingerprint;
}): boolean {
  if (!isNonEmptyString(input.expectedFingerprint)) {
    return false;
  }
  return input.expectedFingerprint !== input.currentFingerprint.value;
}

// ─── Safety evaluation ──────────────────────────────────────────────────────

export function evaluateRuntimeExecutiveActionSafety(input: {
  readonly previewResult: RuntimeExecutiveActionPreviewResult;
  readonly acknowledgments?: ReadonlyArray<RuntimeExecutiveActionAcknowledgment>;
  readonly expectedFingerprint?: string;
}): RuntimeExecutiveActionSafetyEvaluation {
  const issues: RuntimeExecutiveActionSafetyIssue[] = [];
  const preview = input.previewResult.preview;
  const presentation = input.previewResult.presentation ?? preview?.presentation;

  if (
    input.previewResult.identity !==
      runtimeExecutiveActionPresentationPreviewIdentity ||
    presentation === undefined ||
    preview === undefined
  ) {
    issues.push(
      issue(
        "confirmation-scope-missing",
        "confirmation",
        "blocking",
        true,
        "Confirmation requires a valid REX-5:4 preview result",
        "preview",
      ),
    );
    return Object.freeze({
      status: "blocked",
      issues: freezeArray(issues),
      dimensions: Object.freeze({
        clarity: "unclear",
        recipientCertainty: "missing",
        intentCertainty: "unresolved",
        targetCertainty: "missing",
        contextConsistency: "consistent",
        prioritySeverity: "normal",
        consequenceClarity: "unclear",
        lifecycleValidity: "not-confirmable",
      }),
    });
  }

  const warnings = preview.warnings;
  const actionKind = presentation.actionKind;
  const scope = createRuntimeExecutiveActionConfirmationScope(presentation);
  const fingerprint = createRuntimeExecutiveActionConfirmationFingerprint(scope);

  if (
    hasRuntimeExecutiveActionChangedSincePreview({
      expectedFingerprint: input.expectedFingerprint,
      currentFingerprint: fingerprint,
    })
  ) {
    issues.push(
      issue(
        "confirmation-scope-changed",
        "confirmation",
        "blocking",
        true,
        "Action meaning changed since preview; re-preview required",
        "fingerprint",
      ),
    );
  }

  if (input.previewResult.status === "blocked") {
    // Canonical policy may permit assign + unresolved recipient as
    // review-required rather than hard-blocked by preview status alone.
    const assignUnresolvedReviewPermitted =
      actionKind === "assign" &&
      presentation.recipient?.unresolved === true &&
      presentation.subject !== undefined &&
      presentation.intent.ambiguous !== true &&
      presentation.intent.resolvedIntent !== undefined;

    if (!assignUnresolvedReviewPermitted) {
      issues.push(
        issue(
          "preview-blocked",
          "confirmation",
          "blocking",
          true,
          "Preview is blocked and cannot be confirmed",
          "preview.status",
        ),
      );
    }
  }

  if (input.previewResult.status === "rejected") {
    issues.push(
      issue(
        "confirmation-scope-missing",
        "confirmation",
        "blocking",
        true,
        "Rejected preview cannot be confirmed",
        "preview.status",
      ),
    );
  }

  if (presentation.subject === undefined) {
    issues.push(
      issue(
        "subject-missing",
        "subject",
        "blocking",
        true,
        "Subject is required for confirmation",
        "subject",
      ),
    );
  }

  if (presentation.intent.ambiguous || presentation.intent.status === "ambiguous") {
    issues.push(
      issue(
        "intent-ambiguous",
        "intent",
        "blocking",
        true,
        "Ambiguous intent blocks confirmation",
        "intent",
      ),
    );
  } else if (
    presentation.intent.status === "unresolved" ||
    presentation.intent.resolvedIntent === undefined
  ) {
    issues.push(
      issue(
        "intent-unresolved",
        "intent",
        "blocking",
        true,
        "Unresolved intent blocks confirmation",
        "intent",
      ),
    );
  }

  const lifecycle = presentation.lifecycle?.state;
  const lifecycleConfirmable =
    lifecycle !== undefined &&
    (RUNTIME_EXECUTIVE_ACTION_CONFIRMABLE_LIFECYCLES as readonly string[]).includes(
      lifecycle,
    );
  if (!lifecycleConfirmable) {
    issues.push(
      issue(
        "lifecycle-not-confirmable",
        "lifecycle",
        "blocking",
        true,
        "Lifecycle state is not confirmable",
        "lifecycle",
      ),
    );
  }

  const recipientUnresolved = presentation.recipient?.unresolved === true;
  const recipientMissing = presentation.recipient === undefined;

  if (recipientMissing) {
    issues.push(
      issue(
        "recipient-missing",
        "recipient",
        "blocking",
        true,
        "Recipient is required for confirmation",
        "recipient",
      ),
    );
  } else if (recipientUnresolved) {
    if (actionKind === "assign") {
      issues.push(
        issue(
          "recipient-unresolved",
          "recipient",
          "high",
          false,
          "Unresolved assign recipient requires review acknowledgment",
          "recipient",
        ),
      );
    } else {
      issues.push(
        issue(
          "recipient-unresolved",
          "recipient",
          "blocking",
          true,
          "Unresolved recipient blocks confirmation for this action kind",
          "recipient",
        ),
      );
    }
  }

  if (presentation.target === undefined) {
    issues.push(
      issue(
        "target-missing",
        "target",
        "caution",
        false,
        "Target is not supplied",
        "target",
      ),
    );
  }

  if (warningHas(warnings, "context-conflict")) {
    issues.push(
      issue(
        "context-conflict",
        "context",
        "high",
        false,
        "Context conflict requires review",
        "context",
      ),
    );
  }

  if (!isNonEmptyString(presentation.reason)) {
    issues.push(
      issue(
        "reason-missing",
        "reason",
        "info",
        false,
        "Reason is not supplied",
        "reason",
      ),
    );
  }

  if (
    presentation.presentationState === "operation" &&
    presentation.consequence === undefined
  ) {
    issues.push(
      issue(
        "consequence-unclear",
        "consequence",
        "high",
        false,
        "Operation preview lacks a consequence description",
        "consequence",
      ),
    );
  }

  if (presentation.priority?.value === "critical") {
    issues.push(
      issue(
        "critical-priority-review",
        "priority",
        "high",
        false,
        "Critical priority requires explicit acknowledgment",
        "priority",
      ),
    );
  }

  // Acknowledgments are never inferred here. Missing acknowledgments are
  // enforced at readiness / confirmation resolution time only.
  void input.acknowledgments;

  const severityRank = new Map(
    (["blocking", "high", "caution", "info"] as const).map((value, index) => [
      value,
      index,
    ]),
  );
  const codeRank = new Map(
    RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES.map((value, index) => [
      value,
      index,
    ]),
  );
  const ordered = [...issues].sort((a, b) => {
    const severityDelta =
      (severityRank.get(a.severity) ?? 99) - (severityRank.get(b.severity) ?? 99);
    if (severityDelta !== 0) return severityDelta;
    return (codeRank.get(a.code) ?? 0) - (codeRank.get(b.code) ?? 0);
  });

  const hasBlocking = ordered.some((entry) => entry.blocking);
  const hasReview = ordered.some(
    (entry) =>
      !entry.blocking &&
      (entry.severity === "high" || entry.severity === "caution"),
  );

  const status: RuntimeExecutiveActionSafetyStatus = hasBlocking
    ? "blocked"
    : hasReview
      ? "review"
      : "safe";

  return Object.freeze({
    status,
    issues: freezeArray(ordered),
    dimensions: Object.freeze({
      clarity:
        presentation.intent.ambiguous || presentation.subject === undefined
          ? ("unclear" as const)
          : ("clear" as const),
      recipientCertainty: recipientMissing
        ? ("missing" as const)
        : recipientUnresolved
          ? ("uncertain" as const)
          : ("certain" as const),
      intentCertainty: presentation.intent.ambiguous
        ? ("ambiguous" as const)
        : presentation.intent.resolvedIntent === undefined
          ? ("unresolved" as const)
          : ("certain" as const),
      targetCertainty:
        presentation.target === undefined
          ? ("missing" as const)
          : ("certain" as const),
      contextConsistency: warningHas(warnings, "context-conflict")
        ? ("conflicted" as const)
        : ("consistent" as const),
      prioritySeverity:
        presentation.priority?.value === "critical"
          ? ("critical" as const)
          : presentation.priority?.value === "high"
            ? ("elevated" as const)
            : ("normal" as const),
      consequenceClarity:
        presentation.consequence === undefined &&
        presentation.presentationState === "operation"
          ? ("unclear" as const)
          : ("clear" as const),
      lifecycleValidity: lifecycleConfirmable
        ? ("confirmable" as const)
        : ("not-confirmable" as const),
    }),
  });
}

// ─── Review requirements / readiness ────────────────────────────────────────

export function collectRuntimeExecutiveActionReviewRequirements(input: {
  readonly presentation: RuntimeExecutiveActionPresentation;
  readonly safety: RuntimeExecutiveActionSafetyEvaluation;
}): ReadonlyArray<RuntimeExecutiveActionReviewRequirement> {
  const requirements: RuntimeExecutiveActionReviewRequirement[] = [];

  if (
    input.safety.issues.some(
      (entry) => entry.code === "critical-priority-review",
    )
  ) {
    requirements.push(
      Object.freeze({
        id: "review-critical-priority",
        reason: "Critical priority requires explicit acknowledgment",
        requiredAcknowledgment: "accepted-critical-priority",
        relatedIssueCode: "critical-priority-review",
        requiredMode: "explicit-high-risk",
      }),
    );
  }

  if (
    input.presentation.actionKind === "assign" &&
    input.presentation.recipient?.unresolved === true
  ) {
    requirements.push(
      Object.freeze({
        id: "review-unresolved-assign-recipient",
        reason: "Unresolved assign recipient requires acknowledgment",
        requiredAcknowledgment: "accepted-unresolved-recipient",
        relatedIssueCode: "recipient-unresolved",
        requiredMode: "review-required",
      }),
    );
  }

  if (
    input.safety.issues.some((entry) => entry.code === "context-conflict")
  ) {
    requirements.push(
      Object.freeze({
        id: "review-context-conflict",
        reason: "Context conflict must be acknowledged",
        requiredAcknowledgment: "reviewed-warning",
        relatedIssueCode: "context-conflict",
        requiredMode: "review-required",
      }),
    );
  }

  if (
    input.presentation.priority?.value === "critical" &&
    input.presentation.consequence !== undefined
  ) {
    requirements.push(
      Object.freeze({
        id: "review-critical-consequence",
        reason: "Critical consequence must be acknowledged",
        requiredAcknowledgment: "accepted-consequence",
        relatedIssueCode: "critical-priority-review",
        requiredMode: "explicit-high-risk",
      }),
    );
  }

  return freezeArray(requirements);
}

export function evaluateRuntimeExecutiveActionConfirmationReadiness(input: {
  readonly previewResult: RuntimeExecutiveActionPreviewResult;
  readonly safety: RuntimeExecutiveActionSafetyEvaluation;
  readonly acknowledgments?: ReadonlyArray<RuntimeExecutiveActionAcknowledgment>;
}): RuntimeExecutiveActionConfirmationReadiness {
  const presentation =
    input.previewResult.presentation ??
    input.previewResult.preview?.presentation;

  if (presentation === undefined) {
    return Object.freeze({
      state: "not-ready",
      mode: "standard",
      reviewRequirements: Object.freeze([]),
      canConfirm: false,
    });
  }

  const reviewRequirements = collectRuntimeExecutiveActionReviewRequirements({
    presentation,
    safety: input.safety,
  });

  const mode: RuntimeExecutiveActionConfirmationMode =
    presentation.priority?.value === "critical"
      ? "explicit-high-risk"
      : reviewRequirements.length > 0
        ? "review-required"
        : "standard";

  if (input.safety.status === "blocked") {
    return Object.freeze({
      state: "not-ready",
      mode,
      reviewRequirements,
      canConfirm: false,
    });
  }

  const unmet = reviewRequirements.filter(
    (requirement) =>
      !hasAcknowledgment(
        input.acknowledgments,
        requirement.requiredAcknowledgment,
      ),
  );

  if (unmet.length > 0) {
    return Object.freeze({
      state: "review-required",
      mode,
      reviewRequirements,
      canConfirm: false,
    });
  }

  // Formal review requirements may be satisfied; non-blocking caution/info
  // issues alone do not prevent confirmation readiness.
  return Object.freeze({
    state: "ready",
    mode: reviewRequirements.length > 0 ? mode : "standard",
    reviewRequirements,
    canConfirm: true,
  });
}

export function canConfirmRuntimeExecutiveAction(input: {
  readonly previewResult: RuntimeExecutiveActionPreviewResult;
  readonly acknowledgments?: ReadonlyArray<RuntimeExecutiveActionAcknowledgment>;
  readonly expectedFingerprint?: string;
}): boolean {
  const safety = evaluateRuntimeExecutiveActionSafety(input);
  const readiness = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult: input.previewResult,
    safety,
    acknowledgments: input.acknowledgments,
  });
  return readiness.canConfirm === true && readiness.state === "ready";
}

function buildExplanation(input: {
  readonly readiness: RuntimeExecutiveActionConfirmationReadiness;
  readonly safety: RuntimeExecutiveActionSafetyEvaluation;
  readonly scope: RuntimeExecutiveActionConfirmationScope;
}): RuntimeExecutiveActionConfirmationExplanation {
  if (input.safety.status === "blocked") {
    const blocking = input.safety.issues
      .filter((entry) => entry.blocking)
      .map((entry) => entry.message)
      .slice(0, 3)
      .join("; ");
    return Object.freeze({
      summary: "Confirmation is blocked.",
      readinessReason:
        blocking.length > 0
          ? blocking
          : "One or more blocking safety issues are unresolved.",
    });
  }

  if (input.readiness.state === "review-required") {
    return Object.freeze({
      summary: "Confirmation requires explicit review.",
      readinessReason: input.readiness.reviewRequirements
        .map((entry) => entry.reason)
        .join("; "),
    });
  }

  const confirmingStatement = [
    input.scope.actionKind ?? "action",
    input.scope.subjectLabel ?? input.scope.subjectId,
    input.scope.recipientLabel ?? input.scope.recipientId,
    input.scope.intent,
  ]
    .filter((value): value is string => isNonEmptyString(value))
    .join(" · ");

  return Object.freeze({
    summary: "Action is clear enough for executive confirmation.",
    readinessReason: "Preview is ready and safety evaluation is safe.",
    confirmingStatement: `Confirming: ${confirmingStatement}`,
  });
}

function buildConfirmation(input: {
  readonly preview: RuntimeExecutiveActionPreview;
  readonly presentation: RuntimeExecutiveActionPresentation;
  readonly status: RuntimeExecutiveActionConfirmationStatus;
  readonly safety: RuntimeExecutiveActionSafetyEvaluation;
  readonly readiness: RuntimeExecutiveActionConfirmationReadiness;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly resultingLifecycleIntent?: "confirmed";
}): RuntimeExecutiveActionConfirmation {
  const scope = createRuntimeExecutiveActionConfirmationScope(
    input.presentation,
  );
  const fingerprint = createRuntimeExecutiveActionConfirmationFingerprint(scope);
  const explanation = buildExplanation({
    readiness: input.readiness,
    safety: input.safety,
    scope,
  });

  return Object.freeze({
    ...(input.presentation.actionId !== undefined
      ? { actionId: input.presentation.actionId }
      : {}),
    previewTitle: input.preview.title,
    status: input.status,
    mode: input.readiness.mode,
    scope,
    fingerprint,
    safety: input.safety,
    readiness: input.readiness,
    reviewRequirements: input.readiness.reviewRequirements,
    explanation,
    ...(input.resultingLifecycleIntent !== undefined
      ? { resultingLifecycleIntent: input.resultingLifecycleIntent }
      : {}),
    ...(input.metadata !== undefined
      ? { metadata: Object.freeze({ ...input.metadata }) }
      : {}),
    identity: runtimeExecutiveActionConfirmationSafetyIdentity,
    version: runtimeExecutiveActionConfirmationSafetyVersion,
  });
}

// ─── Confirmation resolver ──────────────────────────────────────────────────

/**
 * Resolve an executive confirmation decision from a REX-5:4 preview result.
 * Pure and deterministic. Never dispatches or mutates external systems.
 */
export function resolveRuntimeExecutiveActionConfirmation(
  request: RuntimeExecutiveActionConfirmationRequest,
): RuntimeExecutiveActionConfirmationResult {
  if (
    request === undefined ||
    request.previewResult === undefined ||
    request.previewResult.identity !==
      runtimeExecutiveActionPresentationPreviewIdentity
  ) {
    return Object.freeze({
      status: "rejected",
      issues: freezeArray([
        issue(
          "confirmation-scope-missing",
          "confirmation",
          "blocking",
          true,
          "Confirmation request requires a valid REX-5:4 preview result",
        ),
      ]),
    });
  }

  if (
    !(
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_DECISIONS as readonly string[]
    ).includes(request.decision)
  ) {
    return Object.freeze({
      status: "rejected",
      issues: freezeArray([
        issue(
          "confirmation-scope-missing",
          "confirmation",
          "blocking",
          true,
          "Confirmation decision is not canonical",
          "decision",
        ),
      ]),
    });
  }

  // Acknowledgments must be caller-supplied; never invent them.
  const acknowledgments = request.acknowledgments
    ? freezeArray(
        request.acknowledgments.map((entry) =>
          Object.freeze({
            kind: entry.kind,
            acknowledged: entry.acknowledged === true,
            ...(entry.reference !== undefined
              ? { reference: entry.reference }
              : {}),
          }),
        ),
      )
    : undefined;

  const preview = request.previewResult.preview;
  const presentation =
    request.previewResult.presentation ?? preview?.presentation;

  if (preview === undefined || presentation === undefined) {
    return Object.freeze({
      status: "rejected",
      issues: freezeArray([
        issue(
          "confirmation-scope-missing",
          "confirmation",
          "blocking",
          true,
          "Preview presentation is missing",
        ),
      ]),
    });
  }

  const safety = evaluateRuntimeExecutiveActionSafety({
    previewResult: request.previewResult,
    acknowledgments,
    expectedFingerprint: request.expectedFingerprint,
  });

  const readiness = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult: request.previewResult,
    safety,
    acknowledgments,
  });

  if (request.decision === "decline") {
    const confirmation = buildConfirmation({
      preview,
      presentation,
      status: "declined",
      safety,
      readiness,
      metadata: request.metadata,
    });
    return Object.freeze({
      status: "declined",
      confirmation,
      issues: safety.issues,
    });
  }

  if (request.decision === "cancel") {
    const confirmation = buildConfirmation({
      preview,
      presentation,
      status: "cancelled",
      safety,
      readiness,
      metadata: request.metadata,
    });
    return Object.freeze({
      status: "cancelled",
      confirmation,
      issues: safety.issues,
    });
  }

  if (request.decision === "evaluate") {
    const status: RuntimeExecutiveActionConfirmationStatus =
      readiness.state === "ready" ? "ready" : "not-ready";
    const confirmation = buildConfirmation({
      preview,
      presentation,
      status,
      safety,
      readiness,
      metadata: request.metadata,
    });
    // Evaluate never accepts a confirmation — accepted is reserved for confirm.
    return Object.freeze({
      status: "blocked",
      confirmation,
      issues: safety.issues,
    });
  }

  // decision === "confirm"
  if (!readiness.canConfirm || readiness.state !== "ready") {
    const ackIssues: RuntimeExecutiveActionSafetyIssue[] = [];
    for (const requirement of readiness.reviewRequirements) {
      if (
        !hasAcknowledgment(acknowledgments, requirement.requiredAcknowledgment)
      ) {
        ackIssues.push(
          issue(
            requirement.requiredAcknowledgment === "accepted-critical-priority"
              ? "high-risk-explicit-acknowledgment-required"
              : "review-acknowledgment-required",
            "confirmation",
            "blocking",
            true,
            requirement.reason,
            "acknowledgment",
          ),
        );
      }
    }
    const confirmation = buildConfirmation({
      preview,
      presentation,
      status: "not-ready",
      safety,
      readiness,
      metadata: request.metadata,
    });
    return Object.freeze({
      status: "blocked",
      confirmation,
      issues: freezeArray([...safety.issues, ...ackIssues]),
    });
  }

  const confirmation = buildConfirmation({
    preview,
    presentation,
    status: "confirmed",
    safety,
    readiness,
    metadata: request.metadata,
    resultingLifecycleIntent: "confirmed",
  });

  return Object.freeze({
    status: "accepted",
    confirmation,
    issues: Object.freeze([]),
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveActionConfirmationSafetyIdentity():
  typeof runtimeExecutiveActionConfirmationSafetyCanonicalIdentity {
  return runtimeExecutiveActionConfirmationSafetyCanonicalIdentity;
}

export function getRuntimeExecutiveActionConfirmationSafetyGuarantees():
  typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES {
  return RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES;
}

export function getRuntimeExecutiveActionConfirmationSafetyRegistry():
  typeof runtimeExecutiveActionConfirmationSafetyRegistry {
  return runtimeExecutiveActionConfirmationSafetyRegistry;
}

export function getRuntimeExecutiveActionConfirmationPolicy():
  typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY {
  return RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveActionConfirmationSafetyApiNames = Object.freeze([
  "getRuntimeExecutiveActionConfirmationSafetyIdentity",
  "getRuntimeExecutiveActionConfirmationSafetyRegistry",
  "getRuntimeExecutiveActionConfirmationSafetyGuarantees",
  "getRuntimeExecutiveActionConfirmationPolicy",
  "isRuntimeExecutiveActionConfirmationStatus",
  "isRuntimeExecutiveActionConfirmationMode",
  "isRuntimeExecutiveActionConfirmationReadinessState",
  "isRuntimeExecutiveActionSafetyStatus",
  "isRuntimeExecutiveActionSafetyIssueCode",
  "isRuntimeExecutiveActionAcknowledgmentKind",
  "createRuntimeExecutiveActionConfirmationScope",
  "createRuntimeExecutiveActionConfirmationFingerprint",
  "hasRuntimeExecutiveActionChangedSincePreview",
  "evaluateRuntimeExecutiveActionSafety",
  "collectRuntimeExecutiveActionReviewRequirements",
  "evaluateRuntimeExecutiveActionConfirmationReadiness",
  "canConfirmRuntimeExecutiveAction",
  "resolveRuntimeExecutiveActionConfirmation",
  "verifyRuntimeExecutiveActionConfirmationSafety",
] as const);

export const RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveActionConfirmationStatus",
    "RuntimeExecutiveActionConfirmationMode",
    "RuntimeExecutiveActionConfirmationReadinessState",
    "RuntimeExecutiveActionConfirmationResultStatus",
    "RuntimeExecutiveActionSafetyStatus",
    "RuntimeExecutiveActionSafetySeverity",
    "RuntimeExecutiveActionSafetyIssueDomain",
    "RuntimeExecutiveActionSafetyIssueCode",
    "RuntimeExecutiveActionAcknowledgmentKind",
    "RuntimeExecutiveActionConfirmationDecision",
    "RuntimeExecutiveActionConfirmationSafetyGuarantee",
    "RuntimeExecutiveActionConfirmationSafetyRegistrySection",
    "RuntimeExecutiveActionConfirmationPolicyRule",
    "RuntimeExecutiveActionConfirmationScope",
    "RuntimeExecutiveActionConfirmationFingerprint",
    "RuntimeExecutiveActionSafetyIssue",
    "RuntimeExecutiveActionSafetyEvaluation",
    "RuntimeExecutiveActionReviewRequirement",
    "RuntimeExecutiveActionAcknowledgment",
    "RuntimeExecutiveActionConfirmationReadiness",
    "RuntimeExecutiveActionConfirmationExplanation",
    "RuntimeExecutiveActionConfirmation",
    "RuntimeExecutiveActionConfirmationRequest",
    "RuntimeExecutiveActionConfirmationResult",
    "RuntimeExecutiveActionConfirmationSafetyVerification",
  ] as const);

export const runtimeExecutiveActionConfirmationSafetyRegistry = Object.freeze({
  identity: runtimeExecutiveActionConfirmationSafetyIdentity,
  version: runtimeExecutiveActionConfirmationSafetyVersion,
  namespace: runtimeExecutiveActionConfirmationSafetyNamespace,
  layer: runtimeExecutiveActionConfirmationSafetyLayer,
  capability: runtimeExecutiveActionConfirmationSafetyCapability,
  phase: runtimeExecutiveActionConfirmationSafetyPhase,
  status: runtimeExecutiveActionConfirmationSafetyStatus,
  architecturalRole:
    runtimeExecutiveActionConfirmationSafetyArchitecturalRole,
  dependencyIdentity:
    runtimeExecutiveActionConfirmationSafetyDependencyIdentity,
  dependencyPath: runtimeExecutiveActionConfirmationSafetyDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionConfirmationSafetySupportedImportPath,
  sections: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_REGISTRY_SECTIONS,
  sectionCount:
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_REGISTRY_SECTIONS.length,
  confirmationStatuses: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  confirmationStatusCount:
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES.length,
  confirmationModes: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES,
  confirmationModeCount: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES.length,
  confirmationReadinessStates:
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_READINESS_STATES,
  confirmationReadinessStateCount:
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_READINESS_STATES.length,
  safetyStatuses: RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
  safetyStatusCount: RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES.length,
  safetySeverities: RUNTIME_EXECUTIVE_ACTION_SAFETY_SEVERITIES,
  safetySeverityCount: RUNTIME_EXECUTIVE_ACTION_SAFETY_SEVERITIES.length,
  safetyIssueDomains: RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_DOMAINS,
  safetyIssueDomainCount: RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_DOMAINS.length,
  safetyIssueCodes: RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES,
  safetyIssueCodeCount: RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES.length,
  acknowledgmentKinds: RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS,
  acknowledgmentKindCount:
    RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS.length,
  reviewRequirementKinds: Object.freeze([
    "review-critical-priority",
    "review-unresolved-assign-recipient",
    "review-context-conflict",
    "review-critical-consequence",
  ] as const),
  reviewRequirementKindCount: 4,
  confirmationPolicy: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY,
  confirmationPolicyRuleCount:
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY.ruleCount,
  guarantees: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES,
  guaranteeCount: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES.length,
  publicTypes: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveActionConfirmationSafetyApiNames,
  publicApiCount: runtimeExecutiveActionConfirmationSafetyApiNames.length,
});

export const runtimeExecutiveActionConfirmationSafety = Object.freeze({
  phase: "ConfirmationSafety" as const,
  name: "RuntimeExecutiveActionConfirmationSafety" as const,
  identity: runtimeExecutiveActionConfirmationSafetyIdentity,
  version: runtimeExecutiveActionConfirmationSafetyVersion,
  namespace: runtimeExecutiveActionConfirmationSafetyNamespace,
  layer: runtimeExecutiveActionConfirmationSafetyLayer,
  capability: runtimeExecutiveActionConfirmationSafetyCapability,
  architecturalRole:
    runtimeExecutiveActionConfirmationSafetyArchitecturalRole,
  role: "ConfirmationSafety" as const,
  status: runtimeExecutiveActionConfirmationSafetyStatus,
  upstreamDependency:
    runtimeExecutiveActionConfirmationSafetyDependencyIdentity,
  dependencyPath: runtimeExecutiveActionConfirmationSafetyDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionConfirmationSafetySupportedImportPath,
  deterministic: runtimeExecutiveActionConfirmationSafetyDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  previewAligned: true as const,
  scopeStable: true as const,
  safetyAware: true as const,
  blockingAware: true as const,
  reviewAware: true as const,
  acknowledgmentExplicit: true as const,
  criticalActionSafe: true as const,
  ambiguityBlocking: true as const,
  contextConflictPreserving: true as const,
  lifecycleAware: true as const,
  rendererIndependent: true as const,
  providerIndependent: true as const,
  transportIndependent: true as const,
  aiIndependent: true as const,
  dispatchFree: true as const,
  principle: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_BOUNDARY,
  confirmationStatuses: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  confirmationModes: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES,
  safetyStatuses: RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
  safetyIssueCodes: RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES,
  acknowledgmentKinds: RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS,
  policy: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY,
  guarantees: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES,
  publicTypeNames:
    RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveActionConfirmationSafetyApiNames,
  registry: runtimeExecutiveActionConfirmationSafetyRegistry,
  presentationPreviewBoundary: "REX-5:4-presentation-preview-only" as const,
  architecturalStatus:
    "REX-5:5 Runtime Executive Action Confirmation & Safety — ConfirmationSafetyReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionConfirmationSafetyVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveActionConfirmationSafetyIdentity;
  readonly version: typeof runtimeExecutiveActionConfirmationSafetyVersion;
  readonly namespace: typeof runtimeExecutiveActionConfirmationSafetyNamespace;
  readonly phase: typeof runtimeExecutiveActionConfirmationSafetyPhase;
  readonly architecturalRole: typeof runtimeExecutiveActionConfirmationSafetyArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveActionConfirmationSafetyDependencyIdentity;
  readonly confirmationStatusCount: number;
  readonly confirmationModeCount: number;
  readonly confirmationReadinessStateCount: number;
  readonly safetyStatusCount: number;
  readonly safetySeverityCount: number;
  readonly safetyIssueDomainCount: number;
  readonly safetyIssueCodeCount: number;
  readonly acknowledgmentKindCount: number;
  readonly confirmationPolicyRuleCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly presentationPreviewBoundaryIntact: boolean;
  readonly scopeStable: boolean;
  readonly fingerprintDeterministic: boolean;
  readonly criticalActionSafe: boolean;
  readonly ambiguityBlocking: boolean;
  readonly acknowledgmentExplicit: boolean;
  readonly declineCancelSeparated: boolean;
  readonly rendererIndependent: boolean;
  readonly aiIndependent: boolean;
  readonly providerIndependent: boolean;
  readonly transportIndependent: boolean;
  readonly dispatchFree: boolean;
  readonly upstreamPresentationPreviewOk: boolean;
}

export function verifyRuntimeExecutiveActionConfirmationSafety():
  RuntimeExecutiveActionConfirmationSafetyVerification {
  const runtimeModule = runtimeExecutiveActionConfirmationSafety;
  const registry = runtimeExecutiveActionConfirmationSafetyRegistry;
  const upstream = verifyRuntimeExecutiveActionPresentationPreview();

  const identityOk =
    runtimeModule.identity ===
      "REX-5:5/RuntimeExecutiveActionConfirmationSafety" &&
    runtimeModule.version === "5.5.0" &&
    runtimeModule.namespace ===
      "nexora.rex.action-experience.confirmation-safety" &&
    runtimeModule.phase === "ConfirmationSafety" &&
    runtimeModule.architecturalRole ===
      "ExecutiveActionConfirmationSafetyRuntime" &&
    runtimeModule.upstreamDependency ===
      "REX-5:4/RuntimeExecutiveActionPresentationPreview" &&
    runtimeModule.upstreamDependency ===
      runtimeExecutiveActionPresentationPreviewIdentity &&
    runtimeModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveActionPresentationPreview" &&
    runtimeModule.presentationPreviewBoundary ===
      "REX-5:4-presentation-preview-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES], [
      "not-ready",
      "ready",
      "confirmed",
      "declined",
      "cancelled",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES], [
      "standard",
      "review-required",
      "explicit-high-risk",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_READINESS_STATES], [
      "not-ready",
      "review-required",
      "ready",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES], [
      "safe",
      "review",
      "blocked",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_SAFETY_SEVERITIES], [
      "info",
      "caution",
      "high",
      "blocking",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_DOMAINS], [
      "subject",
      "target",
      "recipient",
      "intent",
      "priority",
      "reason",
      "context",
      "consequence",
      "lifecycle",
      "confirmation",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS], [
      "reviewed-warning",
      "accepted-critical-priority",
      "accepted-consequence",
      "accepted-unresolved-recipient",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES],
      [
        "deterministic",
        "immutable",
        "preview-aligned",
        "scope-stable",
        "safety-aware",
        "blocking-aware",
        "review-aware",
        "acknowledgment-explicit",
        "critical-action-safe",
        "ambiguity-blocking",
        "context-conflict-preserving",
        "lifecycle-aware",
        "renderer-independent",
        "provider-independent",
        "transport-independent",
        "side-effect-free",
        "dispatch-free",
      ],
    );

  const scopeA = Object.freeze({
    actionKind: "request",
    subjectId: "object.project-alpha",
    recipientId: "role.engineering-lead",
    intent: "request-information",
    priority: "high",
    reason: "Schedule risk increasing",
    consequence: "This action will request an update from the selected recipient.",
    lifecycle: "pending-confirmation",
    title: "Request Update",
  });
  const fp1 = createRuntimeExecutiveActionConfirmationFingerprint(scopeA);
  const fp2 = createRuntimeExecutiveActionConfirmationFingerprint(scopeA);
  const fingerprintDeterministic = fp1.value === fp2.value;
  const scopeChanged = hasRuntimeExecutiveActionChangedSincePreview({
    expectedFingerprint: fp1.value,
    currentFingerprint: createRuntimeExecutiveActionConfirmationFingerprint(
      Object.freeze({
        ...scopeA,
        recipientId: "role.operations-lead",
      }),
    ),
  });

  const countsOk =
    registry.confirmationStatusCount ===
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES.length &&
    registry.confirmationModeCount ===
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES.length &&
    registry.safetyIssueCodeCount ===
      RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES.length &&
    registry.acknowledgmentKindCount ===
      RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS.length &&
    registry.confirmationPolicyRuleCount ===
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY_RULES.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES.length &&
    registry.publicApiCount ===
      runtimeExecutiveActionConfirmationSafetyApiNames.length &&
    unique([
      ...RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY_RULES.map(
        (rule) => rule.id,
      ),
    ]);

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES) &&
    Object.isFrozen(
      runtimeExecutiveActionConfirmationSafetyCanonicalIdentity,
    ) &&
    Object.isFrozen(runtimeExecutiveActionConfirmationSafetyRegistry) &&
    Object.isFrozen(runtimeExecutiveActionConfirmationSafety);

  const ok =
    identityOk &&
    vocabOk &&
    countsOk &&
    frozen &&
    fingerprintDeterministic &&
    scopeChanged &&
    runtimeModule.scopeStable === true &&
    runtimeModule.criticalActionSafe === true &&
    runtimeModule.ambiguityBlocking === true &&
    runtimeModule.acknowledgmentExplicit === true &&
    runtimeModule.rendererIndependent === true &&
    runtimeModule.aiIndependent === true &&
    runtimeModule.providerIndependent === true &&
    runtimeModule.transportIndependent === true &&
    runtimeModule.dispatchFree === true &&
    upstream.ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveActionConfirmationSafetyIdentity,
    version: runtimeExecutiveActionConfirmationSafetyVersion,
    namespace: runtimeExecutiveActionConfirmationSafetyNamespace,
    phase: runtimeExecutiveActionConfirmationSafetyPhase,
    architecturalRole:
      runtimeExecutiveActionConfirmationSafetyArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionConfirmationSafetyDependencyIdentity,
    confirmationStatusCount:
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES.length,
    confirmationModeCount: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES.length,
    confirmationReadinessStateCount:
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_READINESS_STATES.length,
    safetyStatusCount: RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES.length,
    safetySeverityCount: RUNTIME_EXECUTIVE_ACTION_SAFETY_SEVERITIES.length,
    safetyIssueDomainCount: RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_DOMAINS.length,
    safetyIssueCodeCount: RUNTIME_EXECUTIVE_ACTION_SAFETY_ISSUE_CODES.length,
    acknowledgmentKindCount:
      RUNTIME_EXECUTIVE_ACTION_ACKNOWLEDGMENT_KINDS.length,
    confirmationPolicyRuleCount:
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_POLICY_RULES.length,
    guaranteeCount:
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_GUARANTEES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_SAFETY_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveActionConfirmationSafetyApiNames.length,
    frozen,
    presentationPreviewBoundaryIntact:
      runtimeModule.presentationPreviewBoundary ===
      "REX-5:4-presentation-preview-only",
    scopeStable: scopeChanged,
    fingerprintDeterministic,
    criticalActionSafe: runtimeModule.criticalActionSafe === true,
    ambiguityBlocking: runtimeModule.ambiguityBlocking === true,
    acknowledgmentExplicit: runtimeModule.acknowledgmentExplicit === true,
    declineCancelSeparated: true,
    rendererIndependent: runtimeModule.rendererIndependent === true,
    aiIndependent: runtimeModule.aiIndependent === true,
    providerIndependent: runtimeModule.providerIndependent === true,
    transportIndependent: runtimeModule.transportIndependent === true,
    dispatchFree: runtimeModule.dispatchFree === true,
    upstreamPresentationPreviewOk: upstream.ok === true,
  });
}
