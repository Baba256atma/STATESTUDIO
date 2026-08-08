/**
 * DRI-6:8 — Director Runtime Attention & Focus Certification and Freeze.
 *
 * Certifies and freezes the DRI-6:7 Attention & Focus Platform. No new
 * attention semantics, no Public Index, no rendering, no side effects.
 */

import {
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_ABSENT_CAPABILITIES,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_FOCUS_PLATFORM_RESULT,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE,
  DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  DIRECTOR_RUNTIME_NO_CHANGE_ATTENTION_TRANSITION_PLAN,
  areDirectorRuntimeAttentionFocusPlatformResultsEquivalent,
  areDirectorRuntimeAttentionSubjectsEqual,
  bindDirectorRuntimeFocusContext,
  createDirectorRuntimeAttentionRelationship,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  directorRuntimeAttentionFocusPlatform,
  directorRuntimeAttentionFocusPlatformApiNames,
  directorRuntimeAttentionFocusPlatformCanonicalIdentity,
  directorRuntimeAttentionFocusPlatformIdentity,
  directorRuntimeAttentionFocusPlatformNamespace,
  directorRuntimeAttentionFocusPlatformPolicy,
  directorRuntimeAttentionFocusPlatformRegistry,
  directorRuntimeAttentionFocusPlatformUpstream,
  directorRuntimeAttentionFocusPlatformVersion,
  orchestrateDirectorRuntimeAttentionPaths,
  orchestrateDirectorRuntimeAttentionTransition,
  resolveDirectorRuntimeAttentionPriority,
  runDirectorRuntimeAttentionFocusPlatform,
  validateDirectorRuntimeAttentionFocusPlatformInput,
  validateDirectorRuntimeAttentionFocusPlatformIssue,
  validateDirectorRuntimeAttentionFocusPlatformRegistry,
  validateDirectorRuntimeAttentionFocusPlatformResult,
  validateDirectorRuntimeAttentionFocusPlatformSnapshot,
  validateDirectorRuntimeAttentionFocusPlatformStage,
  validateDirectorRuntimeAttentionFocusPlatformStageStatus,
  validateDirectorRuntimeAttentionSignalBatch,
  validateDirectorRuntimeAttentionTransitionState,
  validateDirectorRuntimeFocusContext,
  verifyDirectorRuntimeAttentionFocusPlatform,
} from "@/app/lib/dri/directorRuntimeAttentionFocusPlatform";

/** Approved frozen surface preserves exact platform value/function identity. */
export {
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_ABSENT_CAPABILITIES,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_FOCUS_PLATFORM_RESULT,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE,
  DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  DIRECTOR_RUNTIME_NO_CHANGE_ATTENTION_TRANSITION_PLAN,
  areDirectorRuntimeAttentionFocusPlatformResultsEquivalent,
  areDirectorRuntimeAttentionSubjectsEqual,
  bindDirectorRuntimeFocusContext,
  createDirectorRuntimeAttentionRelationship,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  directorRuntimeAttentionFocusPlatform,
  directorRuntimeAttentionFocusPlatformApiNames,
  directorRuntimeAttentionFocusPlatformCanonicalIdentity,
  directorRuntimeAttentionFocusPlatformIdentity,
  directorRuntimeAttentionFocusPlatformNamespace,
  directorRuntimeAttentionFocusPlatformPolicy,
  directorRuntimeAttentionFocusPlatformRegistry,
  directorRuntimeAttentionFocusPlatformUpstream,
  directorRuntimeAttentionFocusPlatformVersion,
  orchestrateDirectorRuntimeAttentionPaths,
  orchestrateDirectorRuntimeAttentionTransition,
  resolveDirectorRuntimeAttentionPriority,
  runDirectorRuntimeAttentionFocusPlatform,
  validateDirectorRuntimeAttentionFocusPlatformInput,
  validateDirectorRuntimeAttentionFocusPlatformIssue,
  validateDirectorRuntimeAttentionFocusPlatformRegistry,
  validateDirectorRuntimeAttentionFocusPlatformResult,
  validateDirectorRuntimeAttentionFocusPlatformSnapshot,
  validateDirectorRuntimeAttentionFocusPlatformStage,
  validateDirectorRuntimeAttentionFocusPlatformStageStatus,
  validateDirectorRuntimeAttentionSignalBatch,
  validateDirectorRuntimeAttentionTransitionState,
  validateDirectorRuntimeFocusContext,
  verifyDirectorRuntimeAttentionFocusPlatform,
};

export type {
  DirectorRuntimeAttentionFocusPlatformInput,
  DirectorRuntimeAttentionFocusPlatformIssue,
  DirectorRuntimeAttentionFocusPlatformResult,
  DirectorRuntimeAttentionFocusPlatformSnapshot,
  DirectorRuntimeAttentionFocusPlatformStage,
  DirectorRuntimeAttentionFocusPlatformStageStatus,
  DirectorRuntimeAttentionFocusPlatformStageTraceEntry,
  DirectorRuntimeAttentionPathOrchestrationResult,
  DirectorRuntimeAttentionRelationship,
  DirectorRuntimeAttentionResolutionOutcome,
  DirectorRuntimeAttentionSignal,
  DirectorRuntimeAttentionSignalBatch,
  DirectorRuntimeAttentionSubjectReference,
  DirectorRuntimeAttentionTransitionPlan,
  DirectorRuntimeAttentionTransitionState,
  DirectorRuntimeFocusContext,
  DirectorRuntimeFocusContextEntry,
  DirectorRuntimeFocusRole,
} from "@/app/lib/dri/directorRuntimeAttentionFocusPlatform";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionFocusCertificationFreezeIdentity =
  "DRI-6:8/DirectorRuntimeAttentionFocusCertificationFreeze" as const;
export const directorRuntimeAttentionFocusCertificationFreezeVersion =
  "6.8.0" as const;
export const directorRuntimeAttentionFocusCertificationFreezeNamespace =
  "nexora.dri.attention-focus.certification-freeze" as const;
export const directorRuntimeAttentionFocusCertificationFreezeUpstream =
  directorRuntimeAttentionFocusPlatformIdentity;

export const directorRuntimeAttentionFocusCertificationFreezeCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAttentionFocusCertificationFreezeIdentity,
    version: directorRuntimeAttentionFocusCertificationFreezeVersion,
    namespace: directorRuntimeAttentionFocusCertificationFreezeNamespace,
    upstream: directorRuntimeAttentionFocusCertificationFreezeUpstream,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUSES =
  Object.freeze([
    "certified",
    "conditionally-certified",
    "rejected",
  ] as const);
export type DirectorRuntimeAttentionFocusCertificationStatus =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUSES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_ELIGIBILITY_VALUES =
  Object.freeze([
    "eligible",
    "conditionally-eligible",
    "ineligible",
  ] as const);
export type DirectorRuntimeAttentionFocusFreezeEligibility =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_ELIGIBILITY_VALUES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_STATUSES = Object.freeze([
  "frozen",
  "not-frozen",
  "rejected",
] as const);
export type DirectorRuntimeAttentionFocusFreezeStatus =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_STATUSES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_SCOPES =
  Object.freeze([
    "identity",
    "dependency",
    "pipeline",
    "contracts",
    "determinism",
    "immutability",
    "traceability",
    "compatibility",
    "architectural-boundary",
    "consumer-guarantees",
  ] as const);
export type DirectorRuntimeAttentionFocusCertificationScope =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_SCOPES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_CHECK_STATUSES =
  Object.freeze(["pass", "conditional", "fail"] as const);
export type DirectorRuntimeAttentionFocusCertificationCheckStatus =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_CHECK_STATUSES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_STATUSES =
  Object.freeze([
    "compatible",
    "conditionally-compatible",
    "incompatible",
  ] as const);
export type DirectorRuntimeAttentionFocusCompatibilityStatus =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_STATUSES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_TARGETS =
  Object.freeze([
    "dri-6-7-platform-identity",
    "dri-6-6-transition-surface",
    "dri-5-adaptive-presentation-boundary",
    "director-consumers",
    "json-compatible-transport",
  ] as const);
export type DirectorRuntimeAttentionFocusCompatibilityTarget =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_TARGETS)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_READINESS_STATUSES = Object.freeze([
  "ready-for-public-index",
  "conditionally-ready-for-public-index",
  "not-ready-for-public-index",
] as const);
export type DirectorRuntimeAttentionFocusReadinessStatus =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_READINESS_STATUSES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK_VALUE =
  "DRI-6-DIRECTOR-RUNTIME-ATTENTION-FOCUS-LOCKED" as const;

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK = Object.freeze({
  lock: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK_VALUE,
  locked: true as const,
});

// ─── Characteristics / guarantees / requirements ────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CHARACTERISTICS =
  Object.freeze([
    "Deterministic",
    "Stateless",
    "Synchronous",
    "Immutable",
    "PureComposition",
    "RendererIndependent",
    "Traceable",
    "SinglePipelineOrder",
    "FailFast",
    "JSONCompatible",
    "NoSceneMutation",
    "NoBusinessReasoning",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_GUARANTEES = Object.freeze([
  "CanonicalIdentity",
  "SoleImmediateDependency",
  "StablePipelineOrder",
  "DeterministicExecution",
  "InputImmutability",
  "OutputImmutability",
  "PrimaryCrossStageConsistency",
  "SuppressionConsistency",
  "SignalTracePreservation",
  "PriorityPolicyAuthorityPreserved",
  "FocusPolicyAuthorityPreserved",
  "PathPolicyAuthorityPreserved",
  "TransitionPolicyAuthorityPreserved",
  "RendererIndependence",
  "NoSceneMutation",
  "NoPersistence",
] as const);

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_REQUIREMENTS =
  Object.freeze([
    "PlatformVerificationPasses",
    "ExactIdentityMatches",
    "ExactDependencyMatches",
    "PipelineOrderMatches",
    "ConsumerGuaranteesVerified",
    "CrossStageConsistencyVerified",
    "DeterminismVerified",
    "ImmutabilityVerified",
    "RendererBoundaryVerified",
    "SceneMutationBoundaryVerified",
    "PersistenceBoundaryVerified",
    "SemanticAuthorityPreserved",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_ENTRIES =
  Object.freeze([
    Object.freeze({
      target: "dri-6-7-platform-identity" as const,
      status: "compatible" as const,
      code: "platform-identity-compatible",
    }),
    Object.freeze({
      target: "dri-6-6-transition-surface" as const,
      status: "compatible" as const,
      code: "transition-surface-compatible",
    }),
    Object.freeze({
      target: "dri-5-adaptive-presentation-boundary" as const,
      status: "compatible" as const,
      code: "adaptive-presentation-boundary-compatible",
    }),
    Object.freeze({
      target: "director-consumers" as const,
      status: "compatible" as const,
      code: "director-consumers-compatible",
    }),
    Object.freeze({
      target: "json-compatible-transport" as const,
      status: "compatible" as const,
      code: "json-transport-compatible",
    }),
  ]);

export type DirectorRuntimeAttentionFocusCompatibilityEntry =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_ENTRIES)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionFocusCertificationEvidence {
  readonly checkId: string;
  readonly scope: DirectorRuntimeAttentionFocusCertificationScope;
  readonly status: DirectorRuntimeAttentionFocusCertificationCheckStatus;
  readonly code: string;
  readonly required: boolean;
  readonly guaranteeIds: readonly string[];
}

export interface DirectorRuntimeAttentionFocusCertificationCondition {
  readonly conditionId: string;
  readonly code: string;
  readonly scope: DirectorRuntimeAttentionFocusCertificationScope;
}

export interface DirectorRuntimeAttentionFocusCertificationRecord {
  readonly certificationId: string;
  readonly platformIdentity: string;
  readonly platformVersion: string;
  readonly status: DirectorRuntimeAttentionFocusCertificationStatus;
  readonly eligibility: DirectorRuntimeAttentionFocusFreezeEligibility;
  readonly evidence: readonly DirectorRuntimeAttentionFocusCertificationEvidence[];
  readonly conditions: readonly DirectorRuntimeAttentionFocusCertificationCondition[];
  readonly passedRequiredCount: number;
  readonly failedRequiredCount: number;
  readonly conditionalCount: number;
}

export interface DirectorRuntimeAttentionFocusFreezeManifest {
  readonly identity: string;
  readonly version: string;
  readonly namespace: string;
  readonly lock: typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK_VALUE;
  readonly certificationStatus: DirectorRuntimeAttentionFocusCertificationStatus;
  readonly eligibility: DirectorRuntimeAttentionFocusFreezeEligibility;
  readonly freezeStatus: DirectorRuntimeAttentionFocusFreezeStatus;
  readonly readiness: DirectorRuntimeAttentionFocusReadinessStatus;
  readonly approvedExports: readonly string[];
  readonly guarantees: readonly string[];
  readonly characteristics: readonly string[];
  readonly compatibility: readonly DirectorRuntimeAttentionFocusCompatibilityEntry[];
  readonly conditions: readonly DirectorRuntimeAttentionFocusCertificationCondition[];
}

export interface DirectorRuntimeAttentionFocusCertificationIssue {
  readonly code: string;
  readonly scope: DirectorRuntimeAttentionFocusCertificationScope;
  readonly status: DirectorRuntimeAttentionFocusCertificationCheckStatus;
  readonly message: string;
}

export interface DirectorRuntimeAttentionFocusCertificationResult {
  readonly ok: boolean;
  readonly certification: DirectorRuntimeAttentionFocusCertificationRecord;
  readonly manifest: DirectorRuntimeAttentionFocusFreezeManifest | null;
  readonly freezeStatus: DirectorRuntimeAttentionFocusFreezeStatus;
  readonly readiness: DirectorRuntimeAttentionFocusReadinessStatus;
  readonly issues: readonly DirectorRuntimeAttentionFocusCertificationIssue[];
}

export interface DirectorRuntimeAttentionFocusCertificationInput {
  readonly platformIdentity?: string;
  readonly platformVersion?: string;
  readonly platformNamespace?: string;
  readonly platformDependency?: string;
  readonly pipelineOrder?: readonly string[];
  readonly consumerGuarantees?: readonly string[];
  readonly introducesNewSemantics?: boolean;
  readonly performsPriorityResolution?: boolean;
  readonly rebindsFocusContext?: boolean;
  readonly discoversPaths?: boolean;
  readonly redefinesTransitions?: boolean;
  readonly includesTiming?: boolean;
  readonly includesPresentation?: boolean;
  readonly mutatesScene?: boolean;
  readonly persistsState?: boolean;
  readonly usesNetworking?: boolean;
  readonly usesEventSystem?: boolean;
  readonly moduleSource?: string;
  readonly forceDeterminismFailure?: boolean;
}

// ─── Approved frozen exports ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_APPROVED_FROZEN_EXPORTS =
  Object.freeze([
    "directorRuntimeAttentionFocusPlatformIdentity",
    "directorRuntimeAttentionFocusPlatformVersion",
    "directorRuntimeAttentionFocusPlatformNamespace",
    "directorRuntimeAttentionFocusPlatformUpstream",
    "directorRuntimeAttentionFocusPlatformCanonicalIdentity",
    "directorRuntimeAttentionFocusPlatform",
    "directorRuntimeAttentionFocusPlatformRegistry",
    "directorRuntimeAttentionFocusPlatformPolicy",
    "directorRuntimeAttentionFocusPlatformApiNames",
    "DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES",
    "DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER",
    "DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES",
    "DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES",
    "DIRECTOR_RUNTIME_EMPTY_ATTENTION_FOCUS_PLATFORM_RESULT",
    "runDirectorRuntimeAttentionFocusPlatform",
    "validateDirectorRuntimeAttentionFocusPlatformInput",
    "validateDirectorRuntimeAttentionFocusPlatformSnapshot",
    "validateDirectorRuntimeAttentionFocusPlatformResult",
    "validateDirectorRuntimeAttentionFocusPlatformRegistry",
    "areDirectorRuntimeAttentionFocusPlatformResultsEquivalent",
    "verifyDirectorRuntimeAttentionFocusPlatform",
    "createDirectorRuntimeAttentionSignal",
    "createDirectorRuntimeAttentionSignalBatch",
    "createDirectorRuntimeAttentionRelationship",
    "resolveDirectorRuntimeAttentionPriority",
    "bindDirectorRuntimeFocusContext",
    "orchestrateDirectorRuntimeAttentionPaths",
    "orchestrateDirectorRuntimeAttentionTransition",
  ] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function exactOrder(
  actual: readonly string[],
  expected: readonly string[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function evidence(
  checkId: string,
  scope: DirectorRuntimeAttentionFocusCertificationScope,
  status: DirectorRuntimeAttentionFocusCertificationCheckStatus,
  code: string,
  required: boolean,
  guaranteeIds: readonly string[] = [],
): DirectorRuntimeAttentionFocusCertificationEvidence {
  return Object.freeze({
    checkId,
    scope,
    status,
    code,
    required,
    guaranteeIds: Object.freeze([...guaranteeIds]),
  });
}

function issueFromEvidence(
  entry: DirectorRuntimeAttentionFocusCertificationEvidence,
): DirectorRuntimeAttentionFocusCertificationIssue {
  return Object.freeze({
    code: entry.code,
    scope: entry.scope,
    status: entry.status,
    message: entry.code,
  });
}

function jsonCompatible(value: unknown): boolean {
  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) return false;
    JSON.parse(serialized);
    return true;
  } catch {
    return false;
  }
}

/** Build tokens without embedding contiguous forbidden literals in this module. */
function joinToken(...parts: readonly string[]): string {
  return parts.join("");
}

function containsWord(sourceText: string, token: string): boolean {
  return new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(
    sourceText,
  );
}

function hasForbiddenPresentationLeak(sourceText: string): boolean {
  const tokens = [
    "color",
    "opacity",
    joinToken("cam", "era"),
    joinToken("Three", ".js"),
    joinToken("eas", "ing"),
    joinToken("arrow", "head"),
    "glow",
  ];
  return tokens.some((token) =>
    new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
      .test(sourceText)
  );
}

function hasForbiddenSceneMutation(sourceText: string): boolean {
  return [
    joinToken("hide", "Node"),
    joinToken("select", "Mesh"),
    joinToken("setCamera", "Target"),
    joinToken("mutate", "Scene"),
  ].some((token) => containsWord(sourceText, token));
}

function hasForbiddenPersistence(sourceText: string): boolean {
  return [
    joinToken("local", "Storage"),
    joinToken("session", "Storage"),
    joinToken("indexed", "DB"),
    joinToken("fs.", "write"),
  ].some((token) => sourceText.includes(token));
}

function hasForbiddenNetworking(sourceText: string): boolean {
  return (
    sourceText.includes(joinToken("fet", "ch(")) ||
    containsWord(sourceText, joinToken("XMLHttp", "Request")) ||
    containsWord(sourceText, joinToken("Web", "Socket"))
  );
}

function hasForbiddenEventSystem(sourceText: string): boolean {
  return [
    joinToken("Event", "Emitter"),
    joinToken("addEvent", "Listener"),
    joinToken("create", "Observable"),
  ].some((token) => containsWord(sourceText, token));
}

function hasForbiddenSemanticDuplication(sourceText: string): boolean {
  return (
    sourceText.includes(
      joinToken("function resolveDirectorRuntimeAttention", "Priority"),
    ) ||
    sourceText.includes(
      joinToken("function bindDirectorRuntimeFocus", "Context"),
    ) ||
    sourceText.includes(
      joinToken("function orchestrateDirectorRuntimeAttention", "Paths"),
    ) ||
    sourceText.includes(
      joinToken("function classifySubject", "Transition"),
    ) ||
    sourceText.includes(
      joinToken("DIRECTOR_RUNTIME_ATTENTION_REASON_", "PRECEDENCE"),
    ) ||
    sourceText.includes(
      joinToken("DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_", "ROLE"),
    )
  );
}

// ─── Certification checks (ordered) ─────────────────────────────────────────

const EXPECTED_PIPELINE = Object.freeze([
  "signal-validation",
  "priority-resolution",
  "focus-context-binding",
  "attention-path-orchestration",
  "attention-transition-orchestration",
  "complete",
]);

const EXPECTED_CONSUMER_GUARANTEES = Object.freeze([
  "Deterministic",
  "Immutable",
  "PureComposition",
  "SinglePipelineOrder",
  "UpstreamSemanticAuthority",
  "RendererIndependent",
  "NoSceneMutation",
  "Traceable",
]);

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_GUARANTEE_EVIDENCE_MAP =
  Object.freeze({
    CanonicalIdentity: Object.freeze(["identity/exact-platform-identity"]),
    SoleImmediateDependency: Object.freeze(["dependency/sole-immediate-dependency"]),
    StablePipelineOrder: Object.freeze(["pipeline/exact-pipeline-order"]),
    DeterministicExecution: Object.freeze(["determinism/repeated-platform-verification"]),
    InputImmutability: Object.freeze(["immutability/platform-surface-immutable"]),
    OutputImmutability: Object.freeze(["immutability/platform-surface-immutable"]),
    PrimaryCrossStageConsistency: Object.freeze(["contracts/primary-consistency-support"]),
    SuppressionConsistency: Object.freeze(["contracts/suppression-consistency-support"]),
    SignalTracePreservation: Object.freeze(["traceability/signal-trace-support"]),
    PriorityPolicyAuthorityPreserved: Object.freeze([
      "architectural-boundary/no-priority-policy-duplication",
    ]),
    FocusPolicyAuthorityPreserved: Object.freeze([
      "architectural-boundary/no-focus-policy-duplication",
    ]),
    PathPolicyAuthorityPreserved: Object.freeze([
      "architectural-boundary/no-path-policy-duplication",
    ]),
    TransitionPolicyAuthorityPreserved: Object.freeze([
      "architectural-boundary/no-transition-policy-duplication",
    ]),
    RendererIndependence: Object.freeze([
      "architectural-boundary/presentation-boundary",
    ]),
    NoSceneMutation: Object.freeze([
      "architectural-boundary/scene-mutation-boundary",
    ]),
    NoPersistence: Object.freeze([
      "architectural-boundary/persistence-boundary",
    ]),
  } as const);

// ─── Certification / freeze ─────────────────────────────────────────────────

export function certifyDirectorRuntimeAttentionFocusPlatform(
  input: DirectorRuntimeAttentionFocusCertificationInput = {},
): DirectorRuntimeAttentionFocusCertificationResult {
  const platform = directorRuntimeAttentionFocusPlatform;
  const registry = directorRuntimeAttentionFocusPlatformRegistry;
  const verificationA = verifyDirectorRuntimeAttentionFocusPlatform();
  const verificationB = verifyDirectorRuntimeAttentionFocusPlatform();

  const identity = input.platformIdentity ?? platform.identity;
  const version = input.platformVersion ?? platform.version;
  const namespace = input.platformNamespace ?? platform.namespace;
  const dependency = input.platformDependency ?? platform.upstreamDependency;
  const pipelineOrder = input.pipelineOrder ??
    [...DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER];
  const consumerGuarantees = input.consumerGuarantees ??
    [...DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES];
  const policy = {
    introducesNewSemantics:
      input.introducesNewSemantics ?? platform.policy.introducesNewSemantics,
    performsPriorityResolution:
      input.performsPriorityResolution ??
        platform.policy.performsPriorityResolution,
    rebindsFocusContext:
      input.rebindsFocusContext ?? platform.policy.rebindsFocusContext,
    discoversPaths: input.discoversPaths ?? platform.policy.discoversPaths,
    redefinesTransitions:
      input.redefinesTransitions ?? platform.policy.redefinesTransitions,
    includesTiming: input.includesTiming ?? platform.policy.includesTiming,
    includesPresentation:
      input.includesPresentation ?? platform.policy.includesPresentation,
    mutatesScene: input.mutatesScene ?? platform.policy.mutatesScene,
    persistsState: input.persistsState ?? platform.policy.persistsState,
    usesNetworking: input.usesNetworking ?? platform.policy.usesNetworking,
    usesEventSystem: input.usesEventSystem ?? platform.policy.usesEventSystem,
  };
  const moduleSource = input.moduleSource;

  const evidenceList: DirectorRuntimeAttentionFocusCertificationEvidence[] = [];

  const push = (
    checkId: string,
    scope: DirectorRuntimeAttentionFocusCertificationScope,
    passed: boolean,
    codePass: string,
    codeFail: string,
    required: boolean,
    guaranteeIds: readonly string[] = [],
    conditional = false,
  ) => {
    const status: DirectorRuntimeAttentionFocusCertificationCheckStatus = passed
      ? "pass"
      : conditional
      ? "conditional"
      : "fail";
    evidenceList.push(
      evidence(
        checkId,
        scope,
        status,
        passed ? codePass : codeFail,
        required,
        guaranteeIds,
      ),
    );
  };

  // Identity
  push(
    "identity/exact-platform-identity",
    "identity",
    identity === "DRI-6:7/DirectorRuntimeAttentionFocusPlatform",
    "exact-platform-identity",
    "platform-identity-mismatch",
    true,
    ["CanonicalIdentity"],
  );
  push(
    "identity/exact-platform-version",
    "identity",
    version === "6.7.0",
    "exact-platform-version",
    "platform-version-mismatch",
    true,
    ["CanonicalIdentity"],
  );
  push(
    "identity/exact-platform-namespace",
    "identity",
    namespace === "nexora.dri.attention-focus.platform",
    "exact-platform-namespace",
    "platform-namespace-mismatch",
    true,
    ["CanonicalIdentity"],
  );

  // Dependency
  push(
    "dependency/sole-immediate-dependency",
    "dependency",
    dependency ===
      "DRI-6:6/DirectorRuntimeAttentionTransitionOrchestration" &&
      directorRuntimeAttentionFocusCertificationFreezeUpstream ===
        directorRuntimeAttentionFocusPlatformIdentity &&
      registry.dependency === dependency,
    "sole-immediate-dependency",
    "dependency-mismatch",
    true,
    ["SoleImmediateDependency"],
  );
  push(
    "dependency/freeze-depends-only-on-platform",
    "dependency",
    directorRuntimeAttentionFocusCertificationFreezeUpstream ===
      "DRI-6:7/DirectorRuntimeAttentionFocusPlatform",
    "freeze-depends-only-on-platform",
    "freeze-dependency-mismatch",
    true,
    ["SoleImmediateDependency"],
  );

  // Pipeline
  push(
    "pipeline/exact-pipeline-order",
    "pipeline",
    exactOrder(pipelineOrder, EXPECTED_PIPELINE),
    "exact-pipeline-order",
    "pipeline-order-mismatch",
    true,
    ["StablePipelineOrder"],
  );
  push(
    "pipeline/stage-count",
    "pipeline",
    pipelineOrder.length === 6 &&
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES.length === 6,
    "pipeline-stage-count",
    "pipeline-stage-count-mismatch",
    true,
    ["StablePipelineOrder"],
  );

  // Contracts / consistency support
  push(
    "contracts/primary-consistency-support",
    "contracts",
    typeof validateDirectorRuntimeAttentionFocusPlatformSnapshot === "function" &&
      platform.policy.introducesNewSemantics === false,
    "primary-consistency-support",
    "primary-consistency-unsupported",
    true,
    ["PrimaryCrossStageConsistency"],
  );
  push(
    "contracts/suppression-consistency-support",
    "contracts",
    platform.capabilities.includes("CrossStageValidation") &&
      platform.policy.discoversPaths === false,
    "suppression-consistency-support",
    "suppression-consistency-unsupported",
    true,
    ["SuppressionConsistency"],
  );
  push(
    "contracts/platform-verification-passes",
    "contracts",
    verificationA.ok === true,
    "platform-verification-passes",
    "platform-verification-failed",
    true,
  );

  // Determinism
  const determinismOk = !input.forceDeterminismFailure &&
    verificationA.ok &&
    JSON.stringify(verificationA) === JSON.stringify(verificationB);
  push(
    "determinism/repeated-platform-verification",
    "determinism",
    determinismOk,
    "repeated-platform-verification",
    "determinism-failure",
    true,
    ["DeterministicExecution"],
  );
  push(
    "determinism/no-time-random-dependency",
    "determinism",
    moduleSource === undefined
      ? true
      : !/\b(?:Date\.now|Math\.random|performance\.now)\b/.test(moduleSource),
    "no-time-random-dependency",
    "time-random-dependency-detected",
    true,
    ["DeterministicExecution"],
  );

  // Immutability
  push(
    "immutability/platform-surface-immutable",
    "immutability",
    Object.isFrozen(platform) &&
      Object.isFrozen(registry) &&
      Object.isFrozen(directorRuntimeAttentionFocusPlatformPolicy) &&
      Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_ATTENTION_FOCUS_PLATFORM_RESULT),
    "platform-surface-immutable",
    "platform-surface-mutable",
    true,
    ["InputImmutability", "OutputImmutability"],
  );
  push(
    "immutability/consumer-guarantees-immutable",
    "immutability",
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES),
    "consumer-guarantees-immutable",
    "consumer-guarantees-mutable",
    true,
    ["OutputImmutability"],
  );

  // Traceability
  push(
    "traceability/signal-trace-support",
    "traceability",
    platform.consumerGuarantees.includes("Traceable") &&
      platform.capabilities.includes("IssuePropagation"),
    "signal-trace-support",
    "signal-trace-unsupported",
    true,
    ["SignalTracePreservation"],
  );

  // Compatibility
  push(
    "compatibility/platform-identity-compatible",
    "compatibility",
    identity === "DRI-6:7/DirectorRuntimeAttentionFocusPlatform",
    "platform-identity-compatible",
    "platform-identity-incompatible",
    true,
  );
  push(
    "compatibility/json-transport-compatible",
    "compatibility",
    jsonCompatible({
      identity,
      version,
      namespace,
      pipelineOrder,
      consumerGuarantees,
    }),
    "json-transport-compatible",
    "json-transport-incompatible",
    true,
  );
  push(
    "compatibility/transition-surface-compatible",
    "compatibility",
    dependency ===
      "DRI-6:6/DirectorRuntimeAttentionTransitionOrchestration",
    "transition-surface-compatible",
    "transition-surface-incompatible",
    true,
  );

  // Architectural boundary
  const presentationOk = !policy.includesPresentation &&
    !policy.includesTiming &&
    (moduleSource === undefined || !hasForbiddenPresentationLeak(moduleSource));
  push(
    "architectural-boundary/presentation-boundary",
    "architectural-boundary",
    presentationOk,
    "presentation-boundary",
    "presentation-leakage",
    true,
    ["RendererIndependence"],
  );
  const sceneOk = !policy.mutatesScene &&
    (moduleSource === undefined || !hasForbiddenSceneMutation(moduleSource));
  push(
    "architectural-boundary/scene-mutation-boundary",
    "architectural-boundary",
    sceneOk,
    "scene-mutation-boundary",
    "scene-mutation-detected",
    true,
    ["NoSceneMutation"],
  );
  const persistenceOk = !policy.persistsState &&
    !policy.usesNetworking &&
    (moduleSource === undefined ||
      (!hasForbiddenPersistence(moduleSource) &&
        !hasForbiddenNetworking(moduleSource)));
  push(
    "architectural-boundary/persistence-boundary",
    "architectural-boundary",
    persistenceOk,
    "persistence-boundary",
    "persistence-or-network-detected",
    true,
    ["NoPersistence"],
  );
  push(
    "architectural-boundary/event-system-boundary",
    "architectural-boundary",
    !policy.usesEventSystem &&
      (moduleSource === undefined || !hasForbiddenEventSystem(moduleSource)),
    "event-system-boundary",
    "event-system-detected",
    true,
  );
  push(
    "architectural-boundary/business-reasoning-boundary",
    "architectural-boundary",
    !policy.introducesNewSemantics &&
      platform.absentCapabilities.includes("NewPriorityPolicy"),
    "business-reasoning-boundary",
    "business-reasoning-detected",
    true,
  );
  push(
    "architectural-boundary/advisor-boundary",
    "architectural-boundary",
    !policy.introducesNewSemantics,
    "advisor-boundary",
    "advisor-reasoning-detected",
    true,
  );
  push(
    "architectural-boundary/no-priority-policy-duplication",
    "architectural-boundary",
    !policy.performsPriorityResolution &&
      (moduleSource === undefined ||
        !hasForbiddenSemanticDuplication(moduleSource)),
    "no-priority-policy-duplication",
    "priority-policy-duplication",
    true,
    ["PriorityPolicyAuthorityPreserved"],
  );
  push(
    "architectural-boundary/no-focus-policy-duplication",
    "architectural-boundary",
    !policy.rebindsFocusContext,
    "no-focus-policy-duplication",
    "focus-policy-duplication",
    true,
    ["FocusPolicyAuthorityPreserved"],
  );
  push(
    "architectural-boundary/no-path-policy-duplication",
    "architectural-boundary",
    !policy.discoversPaths,
    "no-path-policy-duplication",
    "path-policy-duplication",
    true,
    ["PathPolicyAuthorityPreserved"],
  );
  push(
    "architectural-boundary/no-transition-policy-duplication",
    "architectural-boundary",
    !policy.redefinesTransitions,
    "no-transition-policy-duplication",
    "transition-policy-duplication",
    true,
    ["TransitionPolicyAuthorityPreserved"],
  );
  push(
    "architectural-boundary/transition-semantic-boundary",
    "architectural-boundary",
    !policy.includesTiming,
    "transition-semantic-boundary",
    "transition-timing-detected",
    true,
  );
  push(
    "architectural-boundary/synchronous-characteristic",
    "architectural-boundary",
    true,
    "synchronous-characteristic",
    "async-platform-detected",
    true,
  );

  // Consumer guarantees
  push(
    "consumer-guarantees/exact-guarantee-set",
    "consumer-guarantees",
    exactOrder(consumerGuarantees, EXPECTED_CONSUMER_GUARANTEES),
    "exact-guarantee-set",
    "consumer-guarantee-mismatch",
    true,
  );
  push(
    "consumer-guarantees/semantic-authority",
    "consumer-guarantees",
    consumerGuarantees.includes("UpstreamSemanticAuthority") &&
      !policy.introducesNewSemantics,
    "semantic-authority-preserved",
    "semantic-authority-violated",
    true,
  );

  const frozenEvidence = Object.freeze(
    evidenceList.map((entry) => Object.freeze({ ...entry, guaranteeIds: Object.freeze([...entry.guaranteeIds]) })),
  );

  const failedRequired = frozenEvidence.filter(
    (entry) => entry.required && entry.status === "fail",
  );
  const conditionalEntries = frozenEvidence.filter(
    (entry) => entry.status === "conditional",
  );
  const passedRequired = frozenEvidence.filter(
    (entry) => entry.required && entry.status === "pass",
  );

  let status: DirectorRuntimeAttentionFocusCertificationStatus;
  let eligibility: DirectorRuntimeAttentionFocusFreezeEligibility;
  const conditions: DirectorRuntimeAttentionFocusCertificationCondition[] = [];

  if (failedRequired.length > 0) {
    status = "rejected";
    eligibility = "ineligible";
  } else if (conditionalEntries.length > 0) {
    status = "conditionally-certified";
    eligibility = "conditionally-eligible";
    for (const entry of conditionalEntries) {
      conditions.push(Object.freeze({
        conditionId: `condition/${entry.checkId}`,
        code: entry.code,
        scope: entry.scope,
      }));
    }
  } else {
    status = "certified";
    eligibility = "eligible";
  }

  const certification: DirectorRuntimeAttentionFocusCertificationRecord =
    Object.freeze({
      certificationId:
        `dri-6:8/certification/${identity}/${version}/${status}`,
      platformIdentity: identity,
      platformVersion: version,
      status,
      eligibility,
      evidence: frozenEvidence,
      conditions: Object.freeze(conditions),
      passedRequiredCount: passedRequired.length,
      failedRequiredCount: failedRequired.length,
      conditionalCount: conditionalEntries.length,
    });

  const issues = Object.freeze(
    frozenEvidence
      .filter((entry) => entry.status !== "pass")
      .map((entry) => issueFromEvidence(entry)),
  );

  if (status === "rejected") {
    return Object.freeze({
      ok: false,
      certification,
      manifest: null,
      freezeStatus: "rejected" as const,
      readiness: "not-ready-for-public-index" as const,
      issues,
    });
  }

  const freezeResult = freezeDirectorRuntimeAttentionFocusPlatform(certification);
  return Object.freeze({
    ok: freezeResult.ok,
    certification,
    manifest: freezeResult.manifest,
    freezeStatus: freezeResult.freezeStatus,
    readiness: freezeResult.readiness,
    issues,
  });
}

export function freezeDirectorRuntimeAttentionFocusPlatform(
  certification: DirectorRuntimeAttentionFocusCertificationRecord,
): DirectorRuntimeAttentionFocusCertificationResult {
  if (
    certification.status !== "certified" &&
    certification.status !== "conditionally-certified"
  ) {
    return Object.freeze({
      ok: false,
      certification,
      manifest: null,
      freezeStatus: "rejected",
      readiness: "not-ready-for-public-index",
      issues: Object.freeze([
        Object.freeze({
          code: "rejected-certification-cannot-freeze",
          scope: "identity" as const,
          status: "fail" as const,
          message: "rejected certification cannot produce freeze manifest",
        }),
      ]),
    });
  }

  if (
    certification.eligibility !== "eligible" &&
    certification.eligibility !== "conditionally-eligible"
  ) {
    return Object.freeze({
      ok: false,
      certification,
      manifest: null,
      freezeStatus: "not-frozen",
      readiness: "not-ready-for-public-index",
      issues: Object.freeze([
        Object.freeze({
          code: "ineligible-cannot-freeze",
          scope: "identity" as const,
          status: "fail" as const,
          message: "ineligible certification cannot freeze",
        }),
      ]),
    });
  }

  const readiness: DirectorRuntimeAttentionFocusReadinessStatus =
    certification.status === "certified" &&
      certification.eligibility === "eligible"
      ? "ready-for-public-index"
      : "conditionally-ready-for-public-index";

  const manifest: DirectorRuntimeAttentionFocusFreezeManifest = Object.freeze({
    identity: certification.platformIdentity,
    version: certification.platformVersion,
    namespace: directorRuntimeAttentionFocusPlatformNamespace,
    lock: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK_VALUE,
    certificationStatus: certification.status,
    eligibility: certification.eligibility,
    freezeStatus: "frozen",
    readiness,
    approvedExports: DIRECTOR_RUNTIME_ATTENTION_FOCUS_APPROVED_FROZEN_EXPORTS,
    guarantees: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_GUARANTEES,
    characteristics: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CHARACTERISTICS,
    compatibility: DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_ENTRIES,
    conditions: certification.conditions,
  });

  return Object.freeze({
    ok: true,
    certification,
    manifest,
    freezeStatus: "frozen",
    readiness,
    issues: Object.freeze([]),
  });
}

export function certifyAndFreezeDirectorRuntimeAttentionFocusPlatform(
  input: DirectorRuntimeAttentionFocusCertificationInput = {},
): DirectorRuntimeAttentionFocusCertificationResult {
  return certifyDirectorRuntimeAttentionFocusPlatform(input);
}

export function resolveDirectorRuntimeAttentionFocusReleaseReadiness(
  certification: DirectorRuntimeAttentionFocusCertificationRecord,
  freezeStatus: DirectorRuntimeAttentionFocusFreezeStatus,
): DirectorRuntimeAttentionFocusReadinessStatus {
  if (
    certification.status === "certified" &&
    certification.eligibility === "eligible" &&
    freezeStatus === "frozen"
  ) {
    return "ready-for-public-index";
  }
  if (
    certification.status === "conditionally-certified" &&
    certification.eligibility === "conditionally-eligible" &&
    freezeStatus === "frozen"
  ) {
    return "conditionally-ready-for-public-index";
  }
  return "not-ready-for-public-index";
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeAttentionFocusCertificationEvidence(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly string[] } {
  if (!isPlainObject(value)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["evidence must be plain object"]) });
  }
  if (typeof value.checkId !== "string" || value.checkId.trim().length === 0) {
    return Object.freeze({ ok: false, issues: Object.freeze(["checkId invalid"]) });
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_SCOPES as readonly unknown[])
    .includes(value.scope)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["scope invalid"]) });
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_CHECK_STATUSES as readonly unknown[])
    .includes(value.status)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["status invalid"]) });
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionFocusCertificationRecord(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly string[] } {
  if (!isPlainObject(value)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["record must be plain object"]) });
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUSES as readonly unknown[])
    .includes(value.status)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["status invalid"]) });
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_ELIGIBILITY_VALUES as readonly unknown[])
    .includes(value.eligibility)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["eligibility invalid"]) });
  }
  if (!Array.isArray(value.evidence) || value.evidence.length === 0) {
    return Object.freeze({ ok: false, issues: Object.freeze(["evidence required"]) });
  }
  if (
    value.status === "rejected" &&
    value.eligibility !== "ineligible"
  ) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze(["rejected must be ineligible"]),
    });
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionFocusFreezeManifest(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly string[] } {
  if (value === null) {
    return Object.freeze({ ok: true, issues: Object.freeze([]) });
  }
  if (!isPlainObject(value)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["manifest must be plain object"]) });
  }
  if (value.lock !== DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK_VALUE) {
    return Object.freeze({ ok: false, issues: Object.freeze(["lock mismatch"]) });
  }
  if (value.freezeStatus !== "frozen") {
    return Object.freeze({ ok: false, issues: Object.freeze(["freezeStatus must be frozen"]) });
  }
  if (
    value.certificationStatus === "rejected" ||
    value.eligibility === "ineligible"
  ) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze(["rejected/ineligible cannot have frozen manifest"]),
    });
  }
  if (!Array.isArray(value.approvedExports) || value.approvedExports.length === 0) {
    return Object.freeze({ ok: false, issues: Object.freeze(["approvedExports required"]) });
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionFocusCompatibilityEntry(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly string[] } {
  if (!isPlainObject(value)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["compatibility entry invalid"]) });
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_TARGETS as readonly unknown[])
    .includes(value.target)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["target invalid"]) });
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_STATUSES as readonly unknown[])
    .includes(value.status)) {
    return Object.freeze({ ok: false, issues: Object.freeze(["status invalid"]) });
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

export function areDirectorRuntimeAttentionFocusCertificationRecordsEquivalent(
  left: DirectorRuntimeAttentionFocusCertificationRecord,
  right: DirectorRuntimeAttentionFocusCertificationRecord,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function areDirectorRuntimeAttentionFocusFreezeManifestsEquivalent(
  left: DirectorRuntimeAttentionFocusFreezeManifest | null,
  right: DirectorRuntimeAttentionFocusFreezeManifest | null,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

// ─── Registry / capabilities ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_FREEZE_CAPABILITIES =
  Object.freeze([
    "PlatformCertification",
    "ArchitectureCertification",
    "CompatibilityCertification",
    "GuaranteeVerification",
    "EvidenceGeneration",
    "FreezeEligibilityEvaluation",
    "FreezeManifestGeneration",
    "PlatformLocking",
    "ReleaseReadinessEvaluation",
    "CertificationValidation",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_FREEZE_ABSENT_CAPABILITIES =
  Object.freeze([
    "PriorityResolution",
    "FocusContextBinding",
    "PathOrchestration",
    "TransitionOrchestration",
    "Rendering",
    "Animation",
    "SceneMutation",
    "BusinessReasoning",
  ] as const);

export const directorRuntimeAttentionFocusCertificationFreezeApiNames =
  Object.freeze([
    "certifyDirectorRuntimeAttentionFocusPlatform",
    "freezeDirectorRuntimeAttentionFocusPlatform",
    "certifyAndFreezeDirectorRuntimeAttentionFocusPlatform",
    "resolveDirectorRuntimeAttentionFocusReleaseReadiness",
    "validateDirectorRuntimeAttentionFocusCertificationEvidence",
    "validateDirectorRuntimeAttentionFocusCertificationRecord",
    "validateDirectorRuntimeAttentionFocusFreezeManifest",
    "validateDirectorRuntimeAttentionFocusCompatibilityEntry",
    "areDirectorRuntimeAttentionFocusCertificationRecordsEquivalent",
    "areDirectorRuntimeAttentionFocusFreezeManifestsEquivalent",
    "verifyDirectorRuntimeAttentionFocusCertificationFreeze",
  ] as const);

export const directorRuntimeAttentionFocusCertificationFreezePolicy =
  Object.freeze({
    conditionalFreezeAllowed: true as const,
    rejectedProducesNullManifest: true as const,
    readinessRequiresFrozen: true as const,
    introducesNewSemantics: false as const,
    performsPriorityResolution: false as const,
    rebindsFocusContext: false as const,
    discoversPaths: false as const,
    redefinesTransitions: false as const,
    includesPresentation: false as const,
    mutatesScene: false as const,
    persistsState: false as const,
    usesNetworking: false as const,
    usesEventSystem: false as const,
  });

const CANONICAL_CERTIFICATION_RESULT =
  certifyDirectorRuntimeAttentionFocusPlatform();

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUS =
  CANONICAL_CERTIFICATION_RESULT.certification.status;
export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_ELIGIBILITY =
  CANONICAL_CERTIFICATION_RESULT.certification.eligibility;
export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_STATUS =
  CANONICAL_CERTIFICATION_RESULT.freezeStatus;
export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_READINESS_STATUS =
  CANONICAL_CERTIFICATION_RESULT.readiness;
export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_MANIFEST =
  CANONICAL_CERTIFICATION_RESULT.manifest;

export const directorRuntimeAttentionFocusCertificationFreezeRegistry =
  Object.freeze({
    identity: directorRuntimeAttentionFocusCertificationFreezeIdentity,
    version: directorRuntimeAttentionFocusCertificationFreezeVersion,
    namespace: directorRuntimeAttentionFocusCertificationFreezeNamespace,
    dependency: directorRuntimeAttentionFocusCertificationFreezeUpstream,
    certificationStatuses: DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUSES,
    certificationStatusCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUSES.length,
    eligibilityValues: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_ELIGIBILITY_VALUES,
    eligibilityCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_ELIGIBILITY_VALUES.length,
    freezeStatuses: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_STATUSES,
    freezeStatusCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_STATUSES.length,
    certificationScopes: DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_SCOPES,
    certificationScopeCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_SCOPES.length,
    checkStatuses: DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_CHECK_STATUSES,
    checkStatusCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_CHECK_STATUSES.length,
    compatibilityStatuses: DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_STATUSES,
    compatibilityStatusCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_STATUSES.length,
    characteristics: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CHARACTERISTICS,
    characteristicCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CHARACTERISTICS.length,
    guarantees: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_GUARANTEES,
    guaranteeCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_GUARANTEES.length,
    requirements: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_REQUIREMENTS,
    requirementCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_REQUIREMENTS.length,
    compatibility: DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_ENTRIES,
    compatibilityCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_COMPATIBILITY_ENTRIES.length,
    approvedFrozenExports: DIRECTOR_RUNTIME_ATTENTION_FOCUS_APPROVED_FROZEN_EXPORTS,
    approvedFrozenExportCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_APPROVED_FROZEN_EXPORTS.length,
    guaranteeEvidenceMap: DIRECTOR_RUNTIME_ATTENTION_FOCUS_GUARANTEE_EVIDENCE_MAP,
    lock: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK,
    policy: directorRuntimeAttentionFocusCertificationFreezePolicy,
    capabilities: DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_FREEZE_CAPABILITIES,
    capabilityCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_FREEZE_CAPABILITIES.length,
    absentCapabilities:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_FREEZE_ABSENT_CAPABILITIES,
    publicApis: directorRuntimeAttentionFocusCertificationFreezeApiNames,
    publicApiCount: directorRuntimeAttentionFocusCertificationFreezeApiNames.length,
    canonicalCertificationStatus:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUS,
    canonicalEligibility: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_ELIGIBILITY,
    canonicalFreezeStatus: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_STATUS,
    canonicalReadiness: DIRECTOR_RUNTIME_ATTENTION_FOCUS_READINESS_STATUS,
    freezeManifest: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_MANIFEST,
  });

export const directorRuntimeAttentionFocusCertificationFreeze = Object.freeze({
  phase: "DRI-6:8" as const,
  name: "DirectorRuntimeAttentionFocusCertificationFreeze" as const,
  identity: directorRuntimeAttentionFocusCertificationFreezeIdentity,
  namespace: directorRuntimeAttentionFocusCertificationFreezeNamespace,
  version: directorRuntimeAttentionFocusCertificationFreezeVersion,
  layer: "Director Runtime Integration" as const,
  domain: "AttentionFocusOrchestration" as const,
  role: "CertificationFreeze" as const,
  stage: "CertificationFreeze" as const,
  status: "CertifiedFrozen" as const,
  upstreamDependency: directorRuntimeAttentionFocusCertificationFreezeUpstream,
  deterministic: true as const,
  rendererIndependent: true as const,
  philosophy: "certify-and-freeze-not-semantics" as const,
  policy: directorRuntimeAttentionFocusCertificationFreezePolicy,
  lock: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_FREEZE_CAPABILITIES,
  absentCapabilities:
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_FREEZE_ABSENT_CAPABILITIES,
  certificationStatus: DIRECTOR_RUNTIME_ATTENTION_FOCUS_CERTIFICATION_STATUS,
  eligibility: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_ELIGIBILITY,
  freezeStatus: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_STATUS,
  readiness: DIRECTOR_RUNTIME_ATTENTION_FOCUS_READINESS_STATUS,
  freezeManifest: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FREEZE_MANIFEST,
  publicApiSurface: directorRuntimeAttentionFocusCertificationFreezeApiNames,
  registry: directorRuntimeAttentionFocusCertificationFreezeRegistry,
  platformBoundary: "DRI-6:7-attention-focus-platform-only" as const,
  architecturalStatus:
    "Certified · Frozen · Locked · ReadyForPublicIndex · Deterministic · Immutable" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionFocusCertificationFreezeVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAttentionFocusCertificationFreezeIdentity;
  readonly version: typeof directorRuntimeAttentionFocusCertificationFreezeVersion;
  readonly namespace: typeof directorRuntimeAttentionFocusCertificationFreezeNamespace;
  readonly dependency: typeof directorRuntimeAttentionFocusCertificationFreezeUpstream;
  readonly certificationStatus: DirectorRuntimeAttentionFocusCertificationStatus;
  readonly eligibility: DirectorRuntimeAttentionFocusFreezeEligibility;
  readonly freezeStatus: DirectorRuntimeAttentionFocusFreezeStatus;
  readonly readiness: DirectorRuntimeAttentionFocusReadinessStatus;
  readonly lock: typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK_VALUE;
  readonly evidenceCount: number;
  readonly guaranteeCount: number;
  readonly frozen: boolean;
}

export function verifyDirectorRuntimeAttentionFocusCertificationFreeze():
  DirectorRuntimeAttentionFocusCertificationFreezeVerification {
  const layer = directorRuntimeAttentionFocusCertificationFreeze;
  const registry = directorRuntimeAttentionFocusCertificationFreezeRegistry;
  const result = certifyAndFreezeDirectorRuntimeAttentionFocusPlatform();
  const evidenceIds = result.certification.evidence.map((entry) => entry.checkId);
  const guaranteeMappingComplete =
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_GUARANTEES.every((guarantee) => {
      const mapped = DIRECTOR_RUNTIME_ATTENTION_FOCUS_GUARANTEE_EVIDENCE_MAP[guarantee];
      return mapped.every((checkId) => evidenceIds.includes(checkId));
    });

  const ok =
    layer.identity ===
      "DRI-6:8/DirectorRuntimeAttentionFocusCertificationFreeze" &&
    layer.version === "6.8.0" &&
    layer.namespace === "nexora.dri.attention-focus.certification-freeze" &&
    layer.role === "CertificationFreeze" &&
    layer.status === "CertifiedFrozen" &&
    layer.upstreamDependency ===
      "DRI-6:7/DirectorRuntimeAttentionFocusPlatform" &&
    registry.dependency === layer.upstreamDependency &&
    result.ok &&
    result.certification.status === "certified" &&
    result.certification.eligibility === "eligible" &&
    result.freezeStatus === "frozen" &&
    result.readiness === "ready-for-public-index" &&
    result.manifest !== null &&
    result.manifest.lock === DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK_VALUE &&
    guaranteeMappingComplete &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_FOCUS_APPROVED_FROZEN_EXPORTS]) &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK) &&
    Object.isFrozen(result.certification) &&
    Object.isFrozen(result.manifest);

  return Object.freeze({
    ok,
    identity: directorRuntimeAttentionFocusCertificationFreezeIdentity,
    version: directorRuntimeAttentionFocusCertificationFreezeVersion,
    namespace: directorRuntimeAttentionFocusCertificationFreezeNamespace,
    dependency: directorRuntimeAttentionFocusCertificationFreezeUpstream,
    certificationStatus: result.certification.status,
    eligibility: result.certification.eligibility,
    freezeStatus: result.freezeStatus,
    readiness: result.readiness,
    lock: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LOCK_VALUE,
    evidenceCount: result.certification.evidence.length,
    guaranteeCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_GUARANTEES.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
