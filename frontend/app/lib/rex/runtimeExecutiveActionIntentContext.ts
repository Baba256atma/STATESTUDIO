/**
 * REX-5:3 — Runtime Executive Action Intent & Context.
 *
 * Deterministically resolves, preserves, normalizes, and explains the
 * executive intent and runtime context associated with a proposed action.
 *
 * Canonical flow:
 *   REX-5:2 Contracts → REX-5:3 Intent & Context → later Presentation / Confirmation
 *
 * Answers:
 *   WHY is this executive action being proposed?
 *   WHAT runtime context does this action belong to?
 *
 * Intent/context runtime only. No dispatch, UI, confirmation, recipient lookup,
 * agent execution, AI inference, or provider integrations.
 */

import {
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceContractsSupportedImportPath,
  runtimeExecutiveActionExperienceContractsVersion,
  runtimeExecutiveActionExperienceFoundationIdentity,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  type RuntimeExecutiveActionDraft,
  type RuntimeExecutiveActionPreparationResult,
  type RuntimeExecutiveActionProposalContract,
} from "@/app/lib/rex/runtimeExecutiveActionExperienceContracts";

// ─── Transitively published Contracts/Foundation surface (for REX-5:4+) ─────
// Additive publication: later phases obtain upstream gates through REX-5:3.

export {
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceFoundationIdentity,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
};

export type {
  RuntimeExecutiveActionDraft,
  RuntimeExecutiveActionPreparationResult,
  RuntimeExecutiveActionProposalContract,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveActionIntentContextIdentity =
  "REX-5:3/RuntimeExecutiveActionIntentContext" as const;

export const runtimeExecutiveActionIntentContextVersion = "5.3.0" as const;

export const runtimeExecutiveActionIntentContextNamespace =
  "nexora.rex.action-experience.intent-context" as const;

export const runtimeExecutiveActionIntentContextLayer = "REX" as const;

export const runtimeExecutiveActionIntentContextCapability =
  "RuntimeExecutiveActionExperience" as const;

export const runtimeExecutiveActionIntentContextPhase =
  "IntentContext" as const;

export const runtimeExecutiveActionIntentContextStatus =
  "IntentContextReady" as const;

export const runtimeExecutiveActionIntentContextArchitecturalRole =
  "ExecutiveActionIntentContextRuntime" as const;

export const runtimeExecutiveActionIntentContextDependencyIdentity =
  runtimeExecutiveActionExperienceContractsIdentity;

export const runtimeExecutiveActionIntentContextDependencyPath =
  runtimeExecutiveActionExperienceContractsSupportedImportPath;

export const runtimeExecutiveActionIntentContextSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveActionIntentContext" as const;

export const runtimeExecutiveActionIntentContextStability =
  "IntentContextReady" as const;

export const runtimeExecutiveActionIntentContextDeterministic = true as const;

export const runtimeExecutiveActionIntentContextSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveActionIntentContextMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveActionIntentContextCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveActionIntentContextIdentity,
    version: runtimeExecutiveActionIntentContextVersion,
    namespace: runtimeExecutiveActionIntentContextNamespace,
    layer: runtimeExecutiveActionIntentContextLayer,
    capability: runtimeExecutiveActionIntentContextCapability,
    phase: runtimeExecutiveActionIntentContextPhase,
    status: runtimeExecutiveActionIntentContextStatus,
    architecturalRole:
      runtimeExecutiveActionIntentContextArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionIntentContextDependencyIdentity,
    dependencyPath: runtimeExecutiveActionIntentContextDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionIntentContextSupportedImportPath,
    upstreamVersion: runtimeExecutiveActionExperienceContractsVersion,
    stabilityStatus: runtimeExecutiveActionIntentContextStability,
    deterministicStatus: runtimeExecutiveActionIntentContextDeterministic,
    sideEffectPolicy: runtimeExecutiveActionIntentContextSideEffectPolicy,
    mutationPolicy: runtimeExecutiveActionIntentContextMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_PRINCIPLE =
  "REX-5:3 makes executive meaning and runtime origin explicit — it does not decide whether an action should be executed, dispatched, or delivered." as const;

export const RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  intentContextAuthority: "REX-5:3" as const,
  architecturalRole: "ExecutiveActionIntentContextRuntime" as const,
  soleImmediateDependency:
    "REX-5:2/RuntimeExecutiveActionExperienceContracts" as const,
  consumesContractsOnly: true as const,
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
  introducesRecipientResolution: false as const,
  introducesConfirmationWorkflow: false as const,
  introducesAgentExecution: false as const,
  introducesLlmInference: false as const,
  introducesExternalIntegration: false as const,
  introducesPersistence: false as const,
});

// ─── Inherited contract vocabularies ────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_ACTION_KINDS =
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_INTENT_KINDS =
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_INTENT_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_ACTION_CONTRACT_SUBJECT_KINDS;

export type RuntimeExecutiveActionIntentContextActionKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_ACTION_KINDS)[number];

export type RuntimeExecutiveActionIntentContextIntentKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_INTENT_KINDS)[number];

export type RuntimeExecutiveActionIntentContextSubject =
  NonNullable<RuntimeExecutiveActionProposalContract["subject"]>;

export type RuntimeExecutiveActionIntentContextTarget =
  NonNullable<RuntimeExecutiveActionProposalContract["target"]>;

export type RuntimeExecutiveActionIntentContextRecipient =
  NonNullable<RuntimeExecutiveActionProposalContract["recipient"]>;

export type RuntimeExecutiveActionIntentContextIntent =
  NonNullable<RuntimeExecutiveActionProposalContract["intent"]>;

export type RuntimeExecutiveActionIntentContextActionContext =
  NonNullable<RuntimeExecutiveActionProposalContract["context"]>;

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES =
  Object.freeze([
    "explicit",
    "derived",
    "ambiguous",
    "unresolved",
  ] as const);

export type RuntimeExecutiveActionIntentResolutionStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_RESULT_STATUSES =
  Object.freeze([
    "resolved",
    "partially-resolved",
    "ambiguous",
    "unresolved",
    "rejected",
  ] as const);

export type RuntimeExecutiveActionIntentContextResultStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_RESULT_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS = Object.freeze([
  "manual",
  "stage",
  "advisor",
  "insight",
  "decision",
  "scenario",
  "execution",
  "workspace",
  "system",
  "agent",
] as const);

export type RuntimeExecutiveActionOriginKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES = Object.freeze([
  "workspace",
  "stage",
  "selected-subject",
  "focused-subject",
  "insight",
  "advisor",
  "scenario",
  "decision",
  "problem",
  "goal",
  "pack",
  "execution",
] as const);

export type RuntimeExecutiveActionContextRole =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES)[number];

export const RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS = Object.freeze([
  "primary",
  "supporting",
  "ambient",
] as const);

export type RuntimeExecutiveActionBindingStrength =
  (typeof RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES =
  Object.freeze(["minimal", "sufficient", "rich"] as const);

export type RuntimeExecutiveActionContextCompleteness =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTEXT_SUITABILITY_VALUES =
  Object.freeze(["insufficient", "sufficient", "strong"] as const);

export type RuntimeExecutiveActionContextSuitability =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTEXT_SUITABILITY_VALUES)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_KINDS = Object.freeze([
  "multiple-primary-subjects",
  "conflicting-origins",
  "incompatible-kind-intent",
  "duplicate-incompatible-recipient-context",
] as const);

export type RuntimeExecutiveActionContextConflictKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_KINDS)[number];

export const RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_OUTCOMES =
  Object.freeze(["preserved", "flagged", "rejected"] as const);

export type RuntimeExecutiveActionContextConflictOutcome =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_OUTCOMES)[number];

export const RUNTIME_EXECUTIVE_ACTION_INTENT_EVIDENCE_KINDS = Object.freeze([
  "explicit-intent",
  "action-kind",
  "reason-category",
  "subject-kind",
  "origin-kind",
  "context-role",
] as const);

export type RuntimeExecutiveActionIntentEvidenceKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_INTENT_EVIDENCE_KINDS)[number];

/**
 * Deterministic context source precedence.
 * Higher list position = higher priority. Insertion order must not win.
 */
export const RUNTIME_EXECUTIVE_ACTION_CONTEXT_SOURCE_PRECEDENCE =
  Object.freeze([
    "explicit-action-context",
    "selected-subject",
    "focused-subject",
    "insight-reference",
    "advisor-reference",
    "workspace-stage-context",
  ] as const);

export type RuntimeExecutiveActionContextSourcePrecedence =
  (typeof RUNTIME_EXECUTIVE_ACTION_CONTEXT_SOURCE_PRECEDENCE)[number];

export const RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES = Object.freeze([
  "deterministic",
  "immutable",
  "contract-aligned",
  "explicit-intent-precedence",
  "ambiguity-preserving",
  "context-preserving",
  "origin-preserving",
  "subject-target-recipient-separated",
  "kind-intent-separated",
  "auditable-resolution",
  "renderer-independent",
  "provider-independent",
  "transport-independent",
  "side-effect-free",
  "dispatch-free",
] as const);

export type RuntimeExecutiveActionIntentContextGuarantee =
  (typeof RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "IntentResolutionStatuses",
    "OriginKinds",
    "ContextRoles",
    "BindingStrengths",
    "ContextCompleteness",
    "ResolutionStatuses",
    "CompatibilityRules",
    "IntentRules",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveActionIntentContextRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_REGISTRY_SECTIONS)[number];

// ─── Intent rules & compatibility ───────────────────────────────────────────

export interface RuntimeExecutiveActionIntentRule {
  readonly id: string;
  readonly actionKind: RuntimeExecutiveActionIntentContextActionKind;
  readonly resolvedIntent: RuntimeExecutiveActionIntentContextIntentKind;
  readonly precedence: number;
  readonly condition: "direct-kind" | "context-decision" | "context-status-request";
  readonly description: string;
}

/**
 * Deterministic kind→intent derivation rules.
 * Ambiguous kinds (send/request) only resolve when contextual evidence matches.
 */
export const RUNTIME_EXECUTIVE_ACTION_INTENT_RULES = Object.freeze([
  Object.freeze({
    id: "assign-delegate",
    actionKind: "assign",
    resolvedIntent: "delegate",
    precedence: 1,
    condition: "direct-kind",
    description: "assign maps to delegate",
  }),
  Object.freeze({
    id: "approve-approve",
    actionKind: "approve",
    resolvedIntent: "approve",
    precedence: 1,
    condition: "direct-kind",
    description: "approve maps to approve",
  }),
  Object.freeze({
    id: "review-review",
    actionKind: "review",
    resolvedIntent: "review",
    precedence: 1,
    condition: "direct-kind",
    description: "review maps to review",
  }),
  Object.freeze({
    id: "escalate-escalate",
    actionKind: "escalate",
    resolvedIntent: "escalate",
    precedence: 1,
    condition: "direct-kind",
    description: "escalate maps to escalate",
  }),
  Object.freeze({
    id: "follow-up-follow-up",
    actionKind: "follow-up",
    resolvedIntent: "follow-up",
    precedence: 1,
    condition: "direct-kind",
    description: "follow-up maps to follow-up",
  }),
  Object.freeze({
    id: "send-inform-decision",
    actionKind: "send",
    resolvedIntent: "inform",
    precedence: 2,
    condition: "context-decision",
    description: "send with decision context maps to inform",
  }),
  Object.freeze({
    id: "send-request-information-status",
    actionKind: "send",
    resolvedIntent: "request-information",
    precedence: 2,
    condition: "context-status-request",
    description: "send with status-request evidence maps to request-information",
  }),
  Object.freeze({
    id: "request-request-action",
    actionKind: "request",
    resolvedIntent: "request-action",
    precedence: 2,
    condition: "direct-kind",
    description: "request maps to request-action when no status evidence",
  }),
  Object.freeze({
    id: "request-request-information-status",
    actionKind: "request",
    resolvedIntent: "request-information",
    precedence: 1,
    condition: "context-status-request",
    description: "request with status-request evidence maps to request-information",
  }),
] as const satisfies ReadonlyArray<RuntimeExecutiveActionIntentRule>);

export type RuntimeExecutiveActionKindIntentCompatibilityPair = Readonly<{
  readonly actionKind: RuntimeExecutiveActionIntentContextActionKind;
  readonly intentKind: RuntimeExecutiveActionIntentContextIntentKind;
}>;

/** Explicit compatible kind/intent pairs. Unlisted pairs are incompatible. */
export const RUNTIME_EXECUTIVE_ACTION_KIND_INTENT_COMPATIBILITY =
  Object.freeze([
    Object.freeze({ actionKind: "assign", intentKind: "delegate" }),
    Object.freeze({ actionKind: "approve", intentKind: "approve" }),
    Object.freeze({ actionKind: "review", intentKind: "review" }),
    Object.freeze({ actionKind: "escalate", intentKind: "escalate" }),
    Object.freeze({ actionKind: "follow-up", intentKind: "follow-up" }),
    Object.freeze({ actionKind: "send", intentKind: "inform" }),
    Object.freeze({ actionKind: "send", intentKind: "request-information" }),
    Object.freeze({ actionKind: "send", intentKind: "coordinate" }),
    Object.freeze({ actionKind: "request", intentKind: "request-information" }),
    Object.freeze({ actionKind: "request", intentKind: "request-action" }),
    Object.freeze({ actionKind: "request", intentKind: "follow-up" }),
  ] as const satisfies ReadonlyArray<RuntimeExecutiveActionKindIntentCompatibilityPair>);

export const RUNTIME_EXECUTIVE_ACTION_SEND_AMBIGUOUS_CANDIDATES = Object.freeze([
  "inform",
  "request-information",
  "coordinate",
] as const satisfies ReadonlyArray<RuntimeExecutiveActionIntentContextIntentKind>);

export const RUNTIME_EXECUTIVE_ACTION_REQUEST_AMBIGUOUS_CANDIDATES =
  Object.freeze([
    "request-information",
    "request-action",
  ] as const satisfies ReadonlyArray<RuntimeExecutiveActionIntentContextIntentKind>);

// ─── Domain models ──────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionOrigin {
  readonly kind: RuntimeExecutiveActionOriginKind;
  readonly referenceId?: string;
  readonly label?: string;
}

export interface RuntimeExecutiveActionContextReference {
  readonly role: RuntimeExecutiveActionContextRole;
  readonly id: string;
  readonly label?: string;
  readonly strength: RuntimeExecutiveActionBindingStrength;
  readonly sourcePrecedence: RuntimeExecutiveActionContextSourcePrecedence;
}

export interface RuntimeExecutiveActionContextBinding {
  readonly references: ReadonlyArray<RuntimeExecutiveActionContextReference>;
  readonly primary: ReadonlyArray<RuntimeExecutiveActionContextReference>;
  readonly supporting: ReadonlyArray<RuntimeExecutiveActionContextReference>;
  readonly ambient: ReadonlyArray<RuntimeExecutiveActionContextReference>;
  readonly completeness: RuntimeExecutiveActionContextCompleteness;
  readonly conflicts: ReadonlyArray<RuntimeExecutiveActionContextConflict>;
}

export interface RuntimeExecutiveActionContextConflict {
  readonly kind: RuntimeExecutiveActionContextConflictKind;
  readonly outcome: RuntimeExecutiveActionContextConflictOutcome;
  readonly message: string;
  readonly referenceIds: ReadonlyArray<string>;
}

export interface RuntimeExecutiveActionIntentEvidence {
  readonly kind: RuntimeExecutiveActionIntentEvidenceKind;
  readonly value: string;
  readonly contribution: string;
}

export interface RuntimeExecutiveActionReasonContext {
  readonly reason?: string;
  readonly sourceKind?: RuntimeExecutiveActionOriginKind | "supplied";
  readonly sourceReferenceId?: string;
  readonly derived: boolean;
}

export interface RuntimeExecutiveActionIntentResolution {
  readonly status: RuntimeExecutiveActionIntentResolutionStatus;
  readonly resolvedIntent?: RuntimeExecutiveActionIntentContextIntentKind;
  readonly sourceIntent?: RuntimeExecutiveActionIntentContextIntentKind;
  readonly candidates: ReadonlyArray<RuntimeExecutiveActionIntentContextIntentKind>;
  readonly evidence: ReadonlyArray<RuntimeExecutiveActionIntentEvidence>;
  readonly reason?: RuntimeExecutiveActionReasonContext;
  readonly compatible: boolean;
}

export interface RuntimeExecutiveActionIntentContextRequest {
  readonly proposal?: RuntimeExecutiveActionProposalContract;
  readonly kind?: RuntimeExecutiveActionIntentContextActionKind;
  readonly intent?: RuntimeExecutiveActionIntentContextIntent;
  readonly subject?: RuntimeExecutiveActionIntentContextSubject;
  readonly target?: RuntimeExecutiveActionIntentContextTarget;
  readonly recipient?: RuntimeExecutiveActionIntentContextRecipient;
  readonly title?: string;
  readonly summary?: string;
  readonly reason?: string | { readonly text: string };
  readonly context?: RuntimeExecutiveActionIntentContextActionContext;
  readonly origin?: RuntimeExecutiveActionOrigin;
  readonly selectedSubject?: RuntimeExecutiveActionIntentContextSubject;
  readonly focusedSubject?: RuntimeExecutiveActionIntentContextSubject;
  readonly supportingReferences?: ReadonlyArray<{
    readonly role: RuntimeExecutiveActionContextRole;
    readonly id: string;
    readonly label?: string;
  }>;
  readonly primarySubjects?: ReadonlyArray<RuntimeExecutiveActionIntentContextSubject>;
}

export interface RuntimeExecutiveActionIntentContextResult {
  readonly status: RuntimeExecutiveActionIntentContextResultStatus;
  readonly proposal?: RuntimeExecutiveActionProposalContract;
  readonly intentResolution: RuntimeExecutiveActionIntentResolution;
  readonly contextBinding: RuntimeExecutiveActionContextBinding;
  readonly origin?: RuntimeExecutiveActionOrigin;
  readonly reason?: RuntimeExecutiveActionReasonContext;
  readonly suitability: RuntimeExecutiveActionContextSuitability;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionIntentContextIssue>;
  readonly identity: typeof runtimeExecutiveActionIntentContextIdentity;
  readonly version: typeof runtimeExecutiveActionIntentContextVersion;
}

export interface RuntimeExecutiveActionIntentContextIssue {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function trimText(value: string): string {
  return value.trim();
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

function freezeArray<T>(values: readonly T[]): ReadonlyArray<T> {
  return Object.freeze([...values]);
}

function isActionKind(
  value: unknown,
): value is RuntimeExecutiveActionIntentContextActionKind {
  return (
    RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_ACTION_KINDS as readonly unknown[]
  ).includes(value);
}

function isIntentKind(
  value: unknown,
): value is RuntimeExecutiveActionIntentContextIntentKind {
  return (
    RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_INTENT_KINDS as readonly unknown[]
  ).includes(value);
}

function isOriginKind(value: unknown): value is RuntimeExecutiveActionOriginKind {
  return (RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS as readonly unknown[]).includes(
    value,
  );
}

function isContextRole(value: unknown): value is RuntimeExecutiveActionContextRole {
  return (RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES as readonly unknown[]).includes(
    value,
  );
}

function reasonText(
  reason: RuntimeExecutiveActionIntentContextRequest["reason"] | RuntimeExecutiveActionProposalContract["reason"],
): string | undefined {
  if (reason === undefined) return undefined;
  if (typeof reason === "string") {
    const trimmed = trimText(reason);
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (isPlainObject(reason) && typeof reason.text === "string") {
    const trimmed = trimText(reason.text);
    return trimmed.length > 0 ? trimmed : undefined;
  }
  return undefined;
}

function hasStatusRequestEvidence(input: {
  readonly reason?: string;
  readonly title?: string;
  readonly summary?: string;
}): boolean {
  const haystack = [input.reason, input.title, input.summary]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
  return (
    haystack.includes("status") ||
    haystack.includes("update") ||
    haystack.includes("request information") ||
    haystack.includes("schedule risk")
  );
}

function hasDecisionEvidence(input: {
  readonly subject?: RuntimeExecutiveActionIntentContextSubject;
  readonly context?: RuntimeExecutiveActionIntentContextActionContext;
  readonly origin?: RuntimeExecutiveActionOrigin;
}): boolean {
  return (
    input.subject?.kind === "decision" ||
    isNonEmptyString(input.context?.decisionId) ||
    input.origin?.kind === "decision"
  );
}

function issue(
  code: string,
  message: string,
  field?: string,
): RuntimeExecutiveActionIntentContextIssue {
  return Object.freeze(
    field === undefined ? { code, message } : { code, message, field },
  );
}

function evidence(
  kind: RuntimeExecutiveActionIntentEvidenceKind,
  value: string,
  contribution: string,
): RuntimeExecutiveActionIntentEvidence {
  return Object.freeze({ kind, value, contribution });
}

function referenceKey(role: RuntimeExecutiveActionContextRole, id: string): string {
  return `${role}:${id}`;
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveActionIntentResolutionStatus(
  value: unknown,
): value is RuntimeExecutiveActionIntentResolutionStatus {
  return (
    RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionIntentContextResultStatus(
  value: unknown,
): value is RuntimeExecutiveActionIntentContextResultStatus {
  return (
    RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_RESULT_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionOriginKind(
  value: unknown,
): value is RuntimeExecutiveActionOriginKind {
  return isOriginKind(value);
}

export function isRuntimeExecutiveActionContextRole(
  value: unknown,
): value is RuntimeExecutiveActionContextRole {
  return isContextRole(value);
}

export function isRuntimeExecutiveActionBindingStrength(
  value: unknown,
): value is RuntimeExecutiveActionBindingStrength {
  return (
    RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionContextCompleteness(
  value: unknown,
): value is RuntimeExecutiveActionContextCompleteness {
  return (
    RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionContextSuitability(
  value: unknown,
): value is RuntimeExecutiveActionContextSuitability {
  return (
    RUNTIME_EXECUTIVE_ACTION_CONTEXT_SUITABILITY_VALUES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionContextConflictKind(
  value: unknown,
): value is RuntimeExecutiveActionContextConflictKind {
  return (
    RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionKindIntentCompatible(
  actionKind: RuntimeExecutiveActionIntentContextActionKind,
  intentKind: RuntimeExecutiveActionIntentContextIntentKind,
): boolean {
  if (!isActionKind(actionKind) || !isIntentKind(intentKind)) {
    return false;
  }
  return RUNTIME_EXECUTIVE_ACTION_KIND_INTENT_COMPATIBILITY.some(
    (pair) =>
      pair.actionKind === actionKind && pair.intentKind === intentKind,
  );
}

// ─── Intent resolution ──────────────────────────────────────────────────────

export function resolveRuntimeExecutiveActionIntent(input: {
  readonly kind?: RuntimeExecutiveActionIntentContextActionKind;
  readonly intent?: RuntimeExecutiveActionIntentContextIntent;
  readonly subject?: RuntimeExecutiveActionIntentContextSubject;
  readonly context?: RuntimeExecutiveActionIntentContextActionContext;
  readonly origin?: RuntimeExecutiveActionOrigin;
  readonly reason?: string;
  readonly title?: string;
  readonly summary?: string;
}): RuntimeExecutiveActionIntentResolution {
  const evidenceList: RuntimeExecutiveActionIntentEvidence[] = [];
  const sourceIntent = input.intent?.kind;
  const reason = input.reason;

  const reasonContext: RuntimeExecutiveActionReasonContext | undefined =
    reason !== undefined
      ? Object.freeze({
          reason,
          sourceKind: "supplied" as const,
          derived: false,
        })
      : undefined;

  if (sourceIntent !== undefined) {
    if (!isIntentKind(sourceIntent)) {
      return Object.freeze({
        status: "unresolved",
        sourceIntent: undefined,
        candidates: Object.freeze([]),
        evidence: Object.freeze([]),
        ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
        compatible: false,
      });
    }

    evidenceList.push(
      evidence("explicit-intent", sourceIntent, "caller-supplied intent takes precedence"),
    );
    if (input.kind !== undefined) {
      evidenceList.push(
        evidence("action-kind", input.kind, "action kind retained alongside explicit intent"),
      );
    }

    const compatible =
      input.kind === undefined
        ? true
        : isRuntimeExecutiveActionKindIntentCompatible(input.kind, sourceIntent);

    return Object.freeze({
      status: "explicit",
      resolvedIntent: sourceIntent,
      sourceIntent,
      candidates: Object.freeze([sourceIntent]),
      evidence: freezeArray(evidenceList),
      ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
      compatible,
    });
  }

  if (input.kind === undefined || !isActionKind(input.kind)) {
    return Object.freeze({
      status: "unresolved",
      candidates: Object.freeze([]),
      evidence: Object.freeze([]),
      ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
      compatible: false,
    });
  }

  evidenceList.push(
    evidence("action-kind", input.kind, "action kind available for derivation"),
  );

  const statusEvidence = hasStatusRequestEvidence({
    reason,
    title: input.title,
    summary: input.summary,
  });
  const decisionEvidence = hasDecisionEvidence({
    subject: input.subject,
    context: input.context,
    origin: input.origin,
  });

  if (statusEvidence) {
    evidenceList.push(
      evidence(
        "reason-category",
        "status-request",
        "reason/title indicates status or update request",
      ),
    );
  }
  if (decisionEvidence) {
    evidenceList.push(
      evidence(
        "subject-kind",
        input.subject?.kind ?? "decision",
        "decision context/subject indicates communicate-decision purpose",
      ),
    );
  }
  if (input.origin !== undefined) {
    evidenceList.push(
      evidence("origin-kind", input.origin.kind, "origin kind available"),
    );
  }

  const matchingRules = RUNTIME_EXECUTIVE_ACTION_INTENT_RULES.filter((rule) => {
    if (rule.actionKind !== input.kind) return false;
    if (rule.condition === "direct-kind") {
      // For request, direct-kind is fallback when no status evidence.
      if (rule.actionKind === "request") {
        return !statusEvidence;
      }
      return true;
    }
    if (rule.condition === "context-decision") {
      return decisionEvidence;
    }
    if (rule.condition === "context-status-request") {
      return statusEvidence;
    }
    return false;
  }).slice().sort((a, b) => a.precedence - b.precedence);

  if (matchingRules.length === 1) {
    const rule = matchingRules[0]!;
    evidenceList.push(
      evidence("action-kind", rule.id, rule.description),
    );
    return Object.freeze({
      status: "derived",
      resolvedIntent: rule.resolvedIntent,
      candidates: Object.freeze([rule.resolvedIntent]),
      evidence: freezeArray(evidenceList),
      ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
      compatible: isRuntimeExecutiveActionKindIntentCompatible(
        input.kind,
        rule.resolvedIntent,
      ),
    });
  }

  if (matchingRules.length > 1) {
    // Prefer highest-precedence (lowest number) unique intent; if conflict, ambiguous.
    const intents = [
      ...new Set(matchingRules.map((rule) => rule.resolvedIntent)),
    ];
    if (intents.length === 1) {
      const resolvedIntent = intents[0]!;
      return Object.freeze({
        status: "derived",
        resolvedIntent,
        candidates: Object.freeze([resolvedIntent]),
        evidence: freezeArray(evidenceList),
        ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
        compatible: true,
      });
    }
  }

  if (input.kind === "send") {
    return Object.freeze({
      status: "ambiguous",
      candidates: RUNTIME_EXECUTIVE_ACTION_SEND_AMBIGUOUS_CANDIDATES,
      evidence: freezeArray(evidenceList),
      ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
      compatible: true,
    });
  }

  if (input.kind === "request" && matchingRules.length === 0) {
    return Object.freeze({
      status: "ambiguous",
      candidates: RUNTIME_EXECUTIVE_ACTION_REQUEST_AMBIGUOUS_CANDIDATES,
      evidence: freezeArray(evidenceList),
      ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
      compatible: true,
    });
  }

  // Direct-kind rules with a single match already handled; if kind has no rule → unresolved
  const direct = RUNTIME_EXECUTIVE_ACTION_INTENT_RULES.find(
    (rule) =>
      rule.actionKind === input.kind && rule.condition === "direct-kind",
  );
  if (direct && matchingRules.length === 0 && input.kind !== "request") {
    // should have matched above; defensive
    return Object.freeze({
      status: "derived",
      resolvedIntent: direct.resolvedIntent,
      candidates: Object.freeze([direct.resolvedIntent]),
      evidence: freezeArray(evidenceList),
      ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
      compatible: true,
    });
  }

  return Object.freeze({
    status: "unresolved",
    candidates: Object.freeze([]),
    evidence: freezeArray(evidenceList),
    ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
    compatible: false,
  });
}

// ─── Context binding ────────────────────────────────────────────────────────

function pushReference(
  bucket: RuntimeExecutiveActionContextReference[],
  seen: Set<string>,
  entry: RuntimeExecutiveActionContextReference,
): void {
  const key = referenceKey(entry.role, entry.id);
  if (seen.has(key)) return;
  seen.add(key);
  bucket.push(Object.freeze(entry));
}

export function bindRuntimeExecutiveActionContext(input: {
  readonly context?: RuntimeExecutiveActionIntentContextActionContext;
  readonly selectedSubject?: RuntimeExecutiveActionIntentContextSubject;
  readonly focusedSubject?: RuntimeExecutiveActionIntentContextSubject;
  readonly subject?: RuntimeExecutiveActionIntentContextSubject;
  readonly origin?: RuntimeExecutiveActionOrigin;
  readonly supportingReferences?: ReadonlyArray<{
    readonly role: RuntimeExecutiveActionContextRole;
    readonly id: string;
    readonly label?: string;
  }>;
  readonly primarySubjects?: ReadonlyArray<RuntimeExecutiveActionIntentContextSubject>;
}): RuntimeExecutiveActionContextBinding {
  const refs: RuntimeExecutiveActionContextReference[] = [];
  const seen = new Set<string>();
  const conflicts: RuntimeExecutiveActionContextConflict[] = [];

  // Precedence-driven collection (not insertion-order semantics).
  // 1) explicit action context fields
  if (input.context) {
    const ctx = input.context;
    if (isNonEmptyString(ctx.selectedSubjectId)) {
      pushReference(refs, seen, {
        role: "selected-subject",
        id: trimText(ctx.selectedSubjectId),
        strength: "primary",
        sourcePrecedence: "explicit-action-context",
      });
    }
    if (isNonEmptyString(ctx.focusedSubjectId)) {
      pushReference(refs, seen, {
        role: "focused-subject",
        id: trimText(ctx.focusedSubjectId),
        strength: "supporting",
        sourcePrecedence: "explicit-action-context",
      });
    }
    if (isNonEmptyString(ctx.insightId)) {
      pushReference(refs, seen, {
        role: "insight",
        id: trimText(ctx.insightId),
        strength: "supporting",
        sourcePrecedence: "explicit-action-context",
      });
    }
    if (isNonEmptyString(ctx.advisorId)) {
      pushReference(refs, seen, {
        role: "advisor",
        id: trimText(ctx.advisorId),
        strength: "supporting",
        sourcePrecedence: "explicit-action-context",
      });
    }
    if (isNonEmptyString(ctx.decisionId)) {
      pushReference(refs, seen, {
        role: "decision",
        id: trimText(ctx.decisionId),
        strength: "supporting",
        sourcePrecedence: "explicit-action-context",
      });
    }
    if (isNonEmptyString(ctx.scenarioId)) {
      pushReference(refs, seen, {
        role: "scenario",
        id: trimText(ctx.scenarioId),
        strength: "supporting",
        sourcePrecedence: "explicit-action-context",
      });
    }
    if (isNonEmptyString(ctx.packId)) {
      pushReference(refs, seen, {
        role: "pack",
        id: trimText(ctx.packId),
        strength: "supporting",
        sourcePrecedence: "explicit-action-context",
      });
    }
    if (isNonEmptyString(ctx.workspaceId)) {
      pushReference(refs, seen, {
        role: "workspace",
        id: trimText(ctx.workspaceId),
        strength: "ambient",
        sourcePrecedence: "explicit-action-context",
      });
    }
    if (isNonEmptyString(ctx.stageId)) {
      pushReference(refs, seen, {
        role: "stage",
        id: trimText(ctx.stageId),
        strength: "ambient",
        sourcePrecedence: "explicit-action-context",
      });
    }
  }

  // 2) selected subject
  if (input.selectedSubject && isNonEmptyString(input.selectedSubject.id)) {
    pushReference(refs, seen, {
      role: "selected-subject",
      id: trimText(input.selectedSubject.id),
      ...(input.selectedSubject.label !== undefined
        ? { label: trimText(input.selectedSubject.label) }
        : {}),
      strength: "primary",
      sourcePrecedence: "selected-subject",
    });
  }

  // Explicit additional primary subjects (conflict detection)
  const explicitPrimaries: string[] = [];
  if (input.selectedSubject && isNonEmptyString(input.selectedSubject.id)) {
    explicitPrimaries.push(trimText(input.selectedSubject.id));
  }
  if (input.primarySubjects) {
    for (const primary of input.primarySubjects) {
      if (!isNonEmptyString(primary.id)) continue;
      const id = trimText(primary.id);
      explicitPrimaries.push(id);
      pushReference(refs, seen, {
        role: "selected-subject",
        id,
        ...(primary.label !== undefined ? { label: trimText(primary.label) } : {}),
        strength: "primary",
        sourcePrecedence: "selected-subject",
      });
    }
  }

  const uniquePrimaries = [...new Set(explicitPrimaries)];
  if (uniquePrimaries.length > 1) {
    conflicts.push(
      Object.freeze({
        kind: "multiple-primary-subjects",
        outcome: "flagged",
        message: "multiple explicit primary subjects were supplied",
        referenceIds: freezeArray(uniquePrimaries),
      }),
    );
  }

  // 3) focused subject
  if (input.focusedSubject && isNonEmptyString(input.focusedSubject.id)) {
    pushReference(refs, seen, {
      role: "focused-subject",
      id: trimText(input.focusedSubject.id),
      ...(input.focusedSubject.label !== undefined
        ? { label: trimText(input.focusedSubject.label) }
        : {}),
      strength: "supporting",
      sourcePrecedence: "focused-subject",
    });
  }

  // Action subject as supporting context subject when distinct from selected/focused
  if (input.subject && isNonEmptyString(input.subject.id)) {
    const id = trimText(input.subject.id);
    const alreadyPrimary = uniquePrimaries.includes(id);
    const alreadyFocused =
      input.focusedSubject !== undefined &&
      trimText(input.focusedSubject.id) === id;
    if (!alreadyPrimary && !alreadyFocused) {
      const role: RuntimeExecutiveActionContextRole =
        input.subject.kind === "problem"
          ? "problem"
          : input.subject.kind === "goal"
            ? "goal"
            : input.subject.kind === "decision"
              ? "decision"
              : input.subject.kind === "scenario"
                ? "scenario"
                : input.subject.kind === "execution"
                  ? "execution"
                  : input.subject.kind === "pack"
                    ? "pack"
                    : "selected-subject";
      pushReference(refs, seen, {
        role,
        id,
        ...(input.subject.label !== undefined
          ? { label: trimText(input.subject.label) }
          : {}),
        strength: alreadyPrimary ? "primary" : "supporting",
        sourcePrecedence: "selected-subject",
      });
    }
  }

  // 4/5) supporting references (insight/advisor/etc.) — preserve caller order within strength
  if (input.supportingReferences) {
    for (const ref of input.supportingReferences) {
      if (!isContextRole(ref.role) || !isNonEmptyString(ref.id)) continue;
      const strength: RuntimeExecutiveActionBindingStrength =
        ref.role === "workspace" || ref.role === "stage"
          ? "ambient"
          : ref.role === "selected-subject"
            ? "primary"
            : "supporting";
      const sourcePrecedence: RuntimeExecutiveActionContextSourcePrecedence =
        ref.role === "insight"
          ? "insight-reference"
          : ref.role === "advisor"
            ? "advisor-reference"
            : ref.role === "workspace" || ref.role === "stage"
              ? "workspace-stage-context"
              : ref.role === "selected-subject"
                ? "selected-subject"
                : ref.role === "focused-subject"
                  ? "focused-subject"
                  : "insight-reference";
      pushReference(refs, seen, {
        role: ref.role,
        id: trimText(ref.id),
        ...(ref.label !== undefined ? { label: trimText(ref.label) } : {}),
        strength,
        sourcePrecedence,
      });
    }
  }

  // Origin-driven ambient/supporting hints (do not invent missing ids)
  if (input.origin && isNonEmptyString(input.origin.referenceId)) {
    const originRole: RuntimeExecutiveActionContextRole | undefined =
      input.origin.kind === "insight"
        ? "insight"
        : input.origin.kind === "advisor"
          ? "advisor"
          : input.origin.kind === "decision"
            ? "decision"
            : input.origin.kind === "scenario"
              ? "scenario"
              : input.origin.kind === "execution"
                ? "execution"
                : input.origin.kind === "workspace"
                  ? "workspace"
                  : input.origin.kind === "stage"
                    ? "stage"
                    : undefined;
    if (originRole !== undefined) {
      pushReference(refs, seen, {
        role: originRole,
        id: trimText(input.origin.referenceId),
        ...(input.origin.label !== undefined
          ? { label: trimText(input.origin.label) }
          : {}),
        strength:
          originRole === "workspace" || originRole === "stage"
            ? "ambient"
            : "supporting",
        sourcePrecedence:
          originRole === "insight"
            ? "insight-reference"
            : originRole === "advisor"
              ? "advisor-reference"
              : originRole === "workspace" || originRole === "stage"
                ? "workspace-stage-context"
                : "explicit-action-context",
      });
    }
  }

  // Deterministic order: primary → supporting → ambient, then stable role order, then id
  const roleOrder = new Map(
    RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES.map((role, index) => [role, index]),
  );
  const strengthOrder = new Map(
    RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS.map((strength, index) => [
      strength,
      index,
    ]),
  );
  const ordered = [...refs].sort((a, b) => {
    const strengthDelta =
      (strengthOrder.get(a.strength) ?? 99) -
      (strengthOrder.get(b.strength) ?? 99);
    if (strengthDelta !== 0) return strengthDelta;
    const roleDelta =
      (roleOrder.get(a.role) ?? 99) - (roleOrder.get(b.role) ?? 99);
    if (roleDelta !== 0) return roleDelta;
    return a.id.localeCompare(b.id);
  });

  const primary = ordered.filter((entry) => entry.strength === "primary");
  const supporting = ordered.filter((entry) => entry.strength === "supporting");
  const ambient = ordered.filter((entry) => entry.strength === "ambient");

  const hasPrimary = primary.length > 0 || input.subject !== undefined;
  const hasSupporting = supporting.length > 0;
  const hasAmbient = ambient.length > 0;
  const hasInsightOrDecision = ordered.some(
    (entry) => entry.role === "insight" || entry.role === "decision",
  );

  let completeness: RuntimeExecutiveActionContextCompleteness = "minimal";
  if (hasPrimary && (hasSupporting || hasAmbient)) {
    completeness = "sufficient";
  }
  if (hasPrimary && hasSupporting && hasAmbient && hasInsightOrDecision) {
    completeness = "rich";
  } else if (hasPrimary && hasInsightOrDecision && (hasSupporting || hasAmbient)) {
    completeness = "rich";
  }

  return Object.freeze({
    references: freezeArray(ordered),
    primary: freezeArray(primary),
    supporting: freezeArray(supporting),
    ambient: freezeArray(ambient),
    completeness,
    conflicts: freezeArray(conflicts),
  });
}

export function assessRuntimeExecutiveActionContextSuitability(input: {
  readonly intentResolution: RuntimeExecutiveActionIntentResolution;
  readonly contextBinding: RuntimeExecutiveActionContextBinding;
}): RuntimeExecutiveActionContextSuitability {
  const { intentResolution, contextBinding } = input;
  if (
    intentResolution.status === "unresolved" &&
    contextBinding.completeness === "minimal"
  ) {
    return "insufficient";
  }
  if (
    intentResolution.status === "explicit" ||
    intentResolution.status === "derived"
  ) {
    if (contextBinding.completeness === "rich") return "strong";
    return "sufficient";
  }
  if (intentResolution.status === "ambiguous") {
    return contextBinding.completeness === "minimal"
      ? "insufficient"
      : "sufficient";
  }
  if (intentResolution.status === "unresolved") {
    return "insufficient";
  }
  return "insufficient";
}

// ─── Combined resolution ────────────────────────────────────────────────────

function normalizeOrigin(
  origin: RuntimeExecutiveActionOrigin | undefined,
): RuntimeExecutiveActionOrigin | undefined {
  if (origin === undefined) return undefined;
  if (!isOriginKind(origin.kind)) {
    return undefined;
  }
  const referenceId =
    origin.referenceId !== undefined && isNonEmptyString(origin.referenceId)
      ? trimText(origin.referenceId)
      : undefined;
  const label =
    origin.label !== undefined && isNonEmptyString(origin.label)
      ? trimText(origin.label)
      : undefined;
  return Object.freeze({
    kind: origin.kind,
    ...(referenceId !== undefined ? { referenceId } : {}),
    ...(label !== undefined ? { label } : {}),
  });
}

export function resolveRuntimeExecutiveActionIntentContext(
  request: RuntimeExecutiveActionIntentContextRequest,
): RuntimeExecutiveActionIntentContextResult {
  const issues: RuntimeExecutiveActionIntentContextIssue[] = [];

  const proposalInput: RuntimeExecutiveActionProposalContract = {
    ...(request.proposal ?? {}),
    ...(request.kind !== undefined ? { kind: request.kind } : {}),
    ...(request.intent !== undefined ? { intent: request.intent } : {}),
    ...(request.subject !== undefined ? { subject: request.subject } : {}),
    ...(request.target !== undefined ? { target: request.target } : {}),
    ...(request.recipient !== undefined
      ? { recipient: request.recipient }
      : {}),
    ...(request.title !== undefined ? { title: request.title } : {}),
    ...(request.summary !== undefined ? { summary: request.summary } : {}),
    ...(request.context !== undefined ? { context: request.context } : {}),
    ...(request.reason !== undefined ? { reason: request.reason } : {}),
  };

  const contractEval =
    evaluateRuntimeExecutiveActionProposalContract(proposalInput);

  if (!contractEval.valid) {
    return Object.freeze({
      status: "rejected",
      intentResolution: Object.freeze({
        status: "unresolved",
        candidates: Object.freeze([]),
        evidence: Object.freeze([]),
        compatible: false,
      }),
      contextBinding: Object.freeze({
        references: Object.freeze([]),
        primary: Object.freeze([]),
        supporting: Object.freeze([]),
        ambient: Object.freeze([]),
        completeness: "minimal",
        conflicts: Object.freeze([]),
      }),
      suitability: "insufficient",
      issues: freezeArray(
        contractEval.issues.map((entry) =>
          issue(entry.code, entry.message, entry.field),
        ),
      ),
      identity: runtimeExecutiveActionIntentContextIdentity,
      version: runtimeExecutiveActionIntentContextVersion,
    });
  }

  const proposal =
    contractEval.value ??
    createRuntimeExecutiveActionProposalContract(proposalInput);

  const origin = normalizeOrigin(request.origin);
  if (request.origin !== undefined && origin === undefined) {
    issues.push(
      issue("invalid-origin", "origin kind is not canonical", "origin"),
    );
  }

  // Conflicting origins: explicit origin vs incompatible context-derived origin signal
  if (
    origin !== undefined &&
    proposal.context?.insightId !== undefined &&
    origin.kind === "decision" &&
    origin.referenceId !== undefined &&
    proposal.context.decisionId !== undefined &&
    origin.referenceId !== proposal.context.decisionId
  ) {
    // only flag when two explicit decision ids disagree — handled below via conflicts in binding
  }

  const reason = reasonText(request.reason ?? proposal.reason);
  const intentResolution = resolveRuntimeExecutiveActionIntent({
    kind: proposal.kind,
    intent: proposal.intent ?? request.intent,
    subject: proposal.subject ?? request.subject,
    context: proposal.context ?? request.context,
    origin,
    reason,
    title: proposal.title,
    summary: proposal.summary,
  });

  const contextBinding = bindRuntimeExecutiveActionContext({
    context: proposal.context ?? request.context,
    selectedSubject: request.selectedSubject,
    focusedSubject: request.focusedSubject,
    subject: proposal.subject ?? request.subject,
    origin,
    supportingReferences: request.supportingReferences,
    primarySubjects: request.primarySubjects,
  });

  const conflicts = [...contextBinding.conflicts];

  if (
    intentResolution.status === "explicit" &&
    intentResolution.compatible === false &&
    proposal.kind !== undefined &&
    intentResolution.resolvedIntent !== undefined
  ) {
    conflicts.push(
      Object.freeze({
        kind: "incompatible-kind-intent",
        outcome: "flagged",
        message: `action kind ${proposal.kind} is not compatible with intent ${intentResolution.resolvedIntent}`,
        referenceIds: Object.freeze([
          proposal.kind,
          intentResolution.resolvedIntent,
        ]),
      }),
    );
    issues.push(
      issue(
        "incompatible-kind-intent",
        "explicit intent is incompatible with action kind",
        "intent",
      ),
    );
  }

  if (
    origin !== undefined &&
    request.origin !== undefined &&
    request.supportingReferences?.some(
      (ref) =>
        ref.role === "insight" &&
        origin.kind === "insight" &&
        origin.referenceId !== undefined &&
        ref.id !== origin.referenceId,
    )
  ) {
    conflicts.push(
      Object.freeze({
        kind: "conflicting-origins",
        outcome: "flagged",
        message: "conflicting insight origin references were supplied",
        referenceIds: freezeArray(
          [
            origin.referenceId!,
            ...request.supportingReferences
              .filter((ref) => ref.role === "insight")
              .map((ref) => ref.id),
          ].filter(isNonEmptyString),
        ),
      }),
    );
  }

  const bindingWithConflicts = Object.freeze({
    ...contextBinding,
    conflicts: freezeArray(conflicts),
  });

  const suitability = assessRuntimeExecutiveActionContextSuitability({
    intentResolution,
    contextBinding: bindingWithConflicts,
  });

  const reasonContext: RuntimeExecutiveActionReasonContext | undefined =
    reason !== undefined
      ? Object.freeze({
          reason,
          sourceKind: "supplied" as const,
          ...(origin?.referenceId !== undefined
            ? { sourceReferenceId: origin.referenceId }
            : {}),
          derived: false,
        })
      : intentResolution.reason;

  let status: RuntimeExecutiveActionIntentContextResultStatus;
  if (issues.some((entry) => entry.code === "invalid-origin")) {
    status = "rejected";
  } else if (intentResolution.status === "unresolved") {
    status =
      bindingWithConflicts.references.length > 0
        ? "partially-resolved"
        : "unresolved";
  } else if (intentResolution.status === "ambiguous") {
    status = "ambiguous";
  } else if (
    intentResolution.status === "explicit" ||
    intentResolution.status === "derived"
  ) {
    status =
      bindingWithConflicts.completeness === "minimal" &&
      bindingWithConflicts.references.length === 0
        ? "partially-resolved"
        : conflicts.some((entry) => entry.outcome === "flagged")
          ? "partially-resolved"
          : "resolved";
  } else {
    status = "unresolved";
  }

  return Object.freeze({
    status,
    proposal,
    intentResolution,
    contextBinding: bindingWithConflicts,
    ...(origin !== undefined ? { origin } : {}),
    ...(reasonContext !== undefined ? { reason: reasonContext } : {}),
    suitability,
    issues: freezeArray(issues),
    identity: runtimeExecutiveActionIntentContextIdentity,
    version: runtimeExecutiveActionIntentContextVersion,
  });
}

// ─── Registries / getters ───────────────────────────────────────────────────

export function getRuntimeExecutiveActionIntentContextIdentity():
  typeof runtimeExecutiveActionIntentContextCanonicalIdentity {
  return runtimeExecutiveActionIntentContextCanonicalIdentity;
}

export function getRuntimeExecutiveActionIntentContextGuarantees():
  typeof RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES {
  return RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES;
}

export function getRuntimeExecutiveActionIntentRuleRegistry():
  typeof RUNTIME_EXECUTIVE_ACTION_INTENT_RULES {
  return RUNTIME_EXECUTIVE_ACTION_INTENT_RULES;
}

export function getRuntimeExecutiveActionIntentContextRegistry():
  typeof runtimeExecutiveActionIntentContextRegistry {
  return runtimeExecutiveActionIntentContextRegistry;
}

export const runtimeExecutiveActionIntentContextApiNames = Object.freeze([
  "getRuntimeExecutiveActionIntentContextIdentity",
  "getRuntimeExecutiveActionIntentContextRegistry",
  "getRuntimeExecutiveActionIntentContextGuarantees",
  "getRuntimeExecutiveActionIntentRuleRegistry",
  "isRuntimeExecutiveActionIntentResolutionStatus",
  "isRuntimeExecutiveActionIntentContextResultStatus",
  "isRuntimeExecutiveActionOriginKind",
  "isRuntimeExecutiveActionContextRole",
  "isRuntimeExecutiveActionBindingStrength",
  "isRuntimeExecutiveActionContextCompleteness",
  "isRuntimeExecutiveActionContextSuitability",
  "isRuntimeExecutiveActionContextConflictKind",
  "isRuntimeExecutiveActionKindIntentCompatible",
  "resolveRuntimeExecutiveActionIntent",
  "bindRuntimeExecutiveActionContext",
  "assessRuntimeExecutiveActionContextSuitability",
  "resolveRuntimeExecutiveActionIntentContext",
  "verifyRuntimeExecutiveActionIntentContext",
] as const);

export const RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveActionIntentResolutionStatus",
    "RuntimeExecutiveActionIntentContextResultStatus",
    "RuntimeExecutiveActionOriginKind",
    "RuntimeExecutiveActionContextRole",
    "RuntimeExecutiveActionBindingStrength",
    "RuntimeExecutiveActionContextCompleteness",
    "RuntimeExecutiveActionContextSuitability",
    "RuntimeExecutiveActionContextConflictKind",
    "RuntimeExecutiveActionContextConflictOutcome",
    "RuntimeExecutiveActionIntentEvidenceKind",
    "RuntimeExecutiveActionContextSourcePrecedence",
    "RuntimeExecutiveActionIntentContextGuarantee",
    "RuntimeExecutiveActionIntentContextRegistrySection",
    "RuntimeExecutiveActionIntentRule",
    "RuntimeExecutiveActionOrigin",
    "RuntimeExecutiveActionContextReference",
    "RuntimeExecutiveActionContextBinding",
    "RuntimeExecutiveActionContextConflict",
    "RuntimeExecutiveActionIntentEvidence",
    "RuntimeExecutiveActionReasonContext",
    "RuntimeExecutiveActionIntentResolution",
    "RuntimeExecutiveActionIntentContextRequest",
    "RuntimeExecutiveActionIntentContextResult",
    "RuntimeExecutiveActionIntentContextIssue",
    "RuntimeExecutiveActionIntentContextVerification",
  ] as const);

export const runtimeExecutiveActionIntentContextRegistry = Object.freeze({
  identity: runtimeExecutiveActionIntentContextIdentity,
  version: runtimeExecutiveActionIntentContextVersion,
  namespace: runtimeExecutiveActionIntentContextNamespace,
  layer: runtimeExecutiveActionIntentContextLayer,
  capability: runtimeExecutiveActionIntentContextCapability,
  phase: runtimeExecutiveActionIntentContextPhase,
  status: runtimeExecutiveActionIntentContextStatus,
  architecturalRole: runtimeExecutiveActionIntentContextArchitecturalRole,
  dependencyIdentity: runtimeExecutiveActionIntentContextDependencyIdentity,
  dependencyPath: runtimeExecutiveActionIntentContextDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionIntentContextSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_REGISTRY_SECTIONS.length,
  intentResolutionStatuses:
    RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES,
  intentResolutionStatusCount:
    RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES.length,
  originKinds: RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS,
  originKindCount: RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS.length,
  contextRoles: RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES,
  contextRoleCount: RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES.length,
  bindingStrengths: RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS,
  bindingStrengthCount: RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS.length,
  contextCompletenessValues:
    RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES,
  contextCompletenessCount:
    RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES.length,
  resultStatuses: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_RESULT_STATUSES,
  resultStatusCount:
    RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_RESULT_STATUSES.length,
  conflictKinds: RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_KINDS,
  conflictKindCount: RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_KINDS.length,
  intentRules: RUNTIME_EXECUTIVE_ACTION_INTENT_RULES,
  intentRuleCount: RUNTIME_EXECUTIVE_ACTION_INTENT_RULES.length,
  compatibilityRules: RUNTIME_EXECUTIVE_ACTION_KIND_INTENT_COMPATIBILITY,
  compatibilityRuleCount:
    RUNTIME_EXECUTIVE_ACTION_KIND_INTENT_COMPATIBILITY.length,
  contextSourcePrecedence:
    RUNTIME_EXECUTIVE_ACTION_CONTEXT_SOURCE_PRECEDENCE,
  guarantees: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES,
  guaranteeCount: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES.length,
  publicTypes: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveActionIntentContextApiNames,
  publicApiCount: runtimeExecutiveActionIntentContextApiNames.length,
});

export const runtimeExecutiveActionIntentContext = Object.freeze({
  phase: "IntentContext" as const,
  name: "RuntimeExecutiveActionIntentContext" as const,
  identity: runtimeExecutiveActionIntentContextIdentity,
  version: runtimeExecutiveActionIntentContextVersion,
  namespace: runtimeExecutiveActionIntentContextNamespace,
  layer: runtimeExecutiveActionIntentContextLayer,
  capability: runtimeExecutiveActionIntentContextCapability,
  architecturalRole: runtimeExecutiveActionIntentContextArchitecturalRole,
  role: "IntentContext" as const,
  status: runtimeExecutiveActionIntentContextStatus,
  upstreamDependency: runtimeExecutiveActionIntentContextDependencyIdentity,
  dependencyPath: runtimeExecutiveActionIntentContextDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionIntentContextSupportedImportPath,
  deterministic: runtimeExecutiveActionIntentContextDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  contractAligned: true as const,
  explicitIntentPrecedence: true as const,
  ambiguityPreserving: true as const,
  contextPreserving: true as const,
  originPreserving: true as const,
  subjectTargetRecipientSeparated: true as const,
  kindIntentSeparated: true as const,
  auditableResolution: true as const,
  rendererIndependent: true as const,
  providerIndependent: true as const,
  transportIndependent: true as const,
  aiIndependent: true as const,
  dispatchFree: true as const,
  principle: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_BOUNDARY,
  intentResolutionStatuses:
    RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES,
  originKinds: RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS,
  contextRoles: RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES,
  bindingStrengths: RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS,
  contextCompletenessValues:
    RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES,
  resultStatuses: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_RESULT_STATUSES,
  intentRules: RUNTIME_EXECUTIVE_ACTION_INTENT_RULES,
  compatibilityRules: RUNTIME_EXECUTIVE_ACTION_KIND_INTENT_COMPATIBILITY,
  guarantees: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES,
  publicTypeNames: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveActionIntentContextApiNames,
  registry: runtimeExecutiveActionIntentContextRegistry,
  contractsBoundary: "REX-5:2-contracts-only" as const,
  architecturalStatus:
    "REX-5:3 Runtime Executive Action Intent & Context — IntentContextReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionIntentContextVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveActionIntentContextIdentity;
  readonly version: typeof runtimeExecutiveActionIntentContextVersion;
  readonly namespace: typeof runtimeExecutiveActionIntentContextNamespace;
  readonly phase: typeof runtimeExecutiveActionIntentContextPhase;
  readonly architecturalRole: typeof runtimeExecutiveActionIntentContextArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveActionIntentContextDependencyIdentity;
  readonly intentResolutionStatusCount: number;
  readonly originKindCount: number;
  readonly contextRoleCount: number;
  readonly bindingStrengthCount: number;
  readonly contextCompletenessCount: number;
  readonly resultStatusCount: number;
  readonly intentRuleCount: number;
  readonly compatibilityRuleCount: number;
  readonly conflictKindCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly contractsBoundaryIntact: boolean;
  readonly explicitIntentPrecedence: boolean;
  readonly ambiguityPreserving: boolean;
  readonly contextPreserving: boolean;
  readonly originPreserving: boolean;
  readonly subjectTargetRecipientSeparated: boolean;
  readonly kindIntentSeparated: boolean;
  readonly auditableResolution: boolean;
  readonly rendererIndependent: boolean;
  readonly aiIndependent: boolean;
  readonly providerIndependent: boolean;
  readonly transportIndependent: boolean;
  readonly dispatchFree: boolean;
  readonly upstreamContractsOk: boolean;
}

export function verifyRuntimeExecutiveActionIntentContext():
  RuntimeExecutiveActionIntentContextVerification {
  const runtimeModule = runtimeExecutiveActionIntentContext;
  const registry = runtimeExecutiveActionIntentContextRegistry;
  const upstream = verifyRuntimeExecutiveActionExperienceContracts();

  const identityOk =
    runtimeModule.identity === "REX-5:3/RuntimeExecutiveActionIntentContext" &&
    runtimeModule.version === "5.3.0" &&
    runtimeModule.namespace === "nexora.rex.action-experience.intent-context" &&
    runtimeModule.phase === "IntentContext" &&
    runtimeModule.architecturalRole === "ExecutiveActionIntentContextRuntime" &&
    runtimeModule.upstreamDependency ===
      "REX-5:2/RuntimeExecutiveActionExperienceContracts" &&
    runtimeModule.upstreamDependency ===
      runtimeExecutiveActionExperienceContractsIdentity &&
    runtimeModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveActionExperienceContracts" &&
    runtimeModule.contractsBoundary === "REX-5:2-contracts-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES], [
      "explicit",
      "derived",
      "ambiguous",
      "unresolved",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS], [
      "manual",
      "stage",
      "advisor",
      "insight",
      "decision",
      "scenario",
      "execution",
      "workspace",
      "system",
      "agent",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES], [
      "workspace",
      "stage",
      "selected-subject",
      "focused-subject",
      "insight",
      "advisor",
      "scenario",
      "decision",
      "problem",
      "goal",
      "pack",
      "execution",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS], [
      "primary",
      "supporting",
      "ambient",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES], [
      "minimal",
      "sufficient",
      "rich",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_RESULT_STATUSES], [
      "resolved",
      "partially-resolved",
      "ambiguous",
      "unresolved",
      "rejected",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_KINDS], [
      "multiple-primary-subjects",
      "conflicting-origins",
      "incompatible-kind-intent",
      "duplicate-incompatible-recipient-context",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES], [
      "deterministic",
      "immutable",
      "contract-aligned",
      "explicit-intent-precedence",
      "ambiguity-preserving",
      "context-preserving",
      "origin-preserving",
      "subject-target-recipient-separated",
      "kind-intent-separated",
      "auditable-resolution",
      "renderer-independent",
      "provider-independent",
      "transport-independent",
      "side-effect-free",
      "dispatch-free",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_REGISTRY_SECTIONS],
      [
        "Identity",
        "IntentResolutionStatuses",
        "OriginKinds",
        "ContextRoles",
        "BindingStrengths",
        "ContextCompleteness",
        "ResolutionStatuses",
        "CompatibilityRules",
        "IntentRules",
        "PublicAPIs",
        "Guarantees",
      ],
    );

  const explicitWins =
    resolveRuntimeExecutiveActionIntent({
      kind: "send",
      intent: { kind: "request-information" },
      reason: "Schedule risk increasing",
    }).status === "explicit" &&
    resolveRuntimeExecutiveActionIntent({
      kind: "send",
      intent: { kind: "request-information" },
    }).resolvedIntent === "request-information";

  const derivedOk =
    resolveRuntimeExecutiveActionIntent({ kind: "assign" }).status ===
      "derived" &&
    resolveRuntimeExecutiveActionIntent({ kind: "assign" }).resolvedIntent ===
      "delegate";

  const ambiguousOk =
    resolveRuntimeExecutiveActionIntent({
      kind: "send",
      subject: { kind: "object", id: "object.project-alpha" },
    }).status === "ambiguous";

  const unresolvedOk =
    resolveRuntimeExecutiveActionIntent({}).status === "unresolved";

  const compatibilityOk =
    isRuntimeExecutiveActionKindIntentCompatible("assign", "delegate") &&
    isRuntimeExecutiveActionKindIntentCompatible("send", "inform") &&
    !isRuntimeExecutiveActionKindIntentCompatible("approve", "delegate") &&
    !isRuntimeExecutiveActionKindIntentCompatible("review", "escalate");

  const countsOk =
    registry.intentResolutionStatusCount ===
      RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES.length &&
    registry.originKindCount === RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS.length &&
    registry.contextRoleCount ===
      RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES.length &&
    registry.bindingStrengthCount ===
      RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS.length &&
    registry.intentRuleCount === RUNTIME_EXECUTIVE_ACTION_INTENT_RULES.length &&
    registry.compatibilityRuleCount ===
      RUNTIME_EXECUTIVE_ACTION_KIND_INTENT_COMPATIBILITY.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      runtimeExecutiveActionIntentContextApiNames.length &&
    unique([...RUNTIME_EXECUTIVE_ACTION_INTENT_RULES.map((rule) => rule.id)]);

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_INTENT_RULES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_KIND_INTENT_COMPATIBILITY) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES) &&
    Object.isFrozen(runtimeExecutiveActionIntentContextCanonicalIdentity) &&
    Object.isFrozen(runtimeExecutiveActionIntentContextRegistry) &&
    Object.isFrozen(runtimeExecutiveActionIntentContext);

  const ok =
    identityOk &&
    vocabOk &&
    countsOk &&
    frozen &&
    explicitWins &&
    derivedOk &&
    ambiguousOk &&
    unresolvedOk &&
    compatibilityOk &&
    runtimeModule.explicitIntentPrecedence === true &&
    runtimeModule.ambiguityPreserving === true &&
    runtimeModule.contextPreserving === true &&
    runtimeModule.originPreserving === true &&
    runtimeModule.subjectTargetRecipientSeparated === true &&
    runtimeModule.kindIntentSeparated === true &&
    runtimeModule.auditableResolution === true &&
    runtimeModule.rendererIndependent === true &&
    runtimeModule.aiIndependent === true &&
    runtimeModule.providerIndependent === true &&
    runtimeModule.transportIndependent === true &&
    runtimeModule.dispatchFree === true &&
    upstream.ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveActionIntentContextIdentity,
    version: runtimeExecutiveActionIntentContextVersion,
    namespace: runtimeExecutiveActionIntentContextNamespace,
    phase: runtimeExecutiveActionIntentContextPhase,
    architecturalRole: runtimeExecutiveActionIntentContextArchitecturalRole,
    dependencyIdentity: runtimeExecutiveActionIntentContextDependencyIdentity,
    intentResolutionStatusCount:
      RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES.length,
    originKindCount: RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS.length,
    contextRoleCount: RUNTIME_EXECUTIVE_ACTION_CONTEXT_ROLES.length,
    bindingStrengthCount: RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS.length,
    contextCompletenessCount:
      RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES.length,
    resultStatusCount:
      RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_RESULT_STATUSES.length,
    intentRuleCount: RUNTIME_EXECUTIVE_ACTION_INTENT_RULES.length,
    compatibilityRuleCount:
      RUNTIME_EXECUTIVE_ACTION_KIND_INTENT_COMPATIBILITY.length,
    conflictKindCount: RUNTIME_EXECUTIVE_ACTION_CONTEXT_CONFLICT_KINDS.length,
    guaranteeCount: RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_GUARANTEES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveActionIntentContextApiNames.length,
    frozen,
    contractsBoundaryIntact:
      runtimeModule.contractsBoundary === "REX-5:2-contracts-only",
    explicitIntentPrecedence: explicitWins,
    ambiguityPreserving: ambiguousOk,
    contextPreserving: runtimeModule.contextPreserving === true,
    originPreserving: runtimeModule.originPreserving === true,
    subjectTargetRecipientSeparated:
      runtimeModule.subjectTargetRecipientSeparated === true,
    kindIntentSeparated: runtimeModule.kindIntentSeparated === true,
    auditableResolution: runtimeModule.auditableResolution === true,
    rendererIndependent: runtimeModule.rendererIndependent === true,
    aiIndependent: runtimeModule.aiIndependent === true,
    providerIndependent: runtimeModule.providerIndependent === true,
    transportIndependent: runtimeModule.transportIndependent === true,
    dispatchFree: runtimeModule.dispatchFree === true,
    upstreamContractsOk: upstream.ok === true,
  });
}
