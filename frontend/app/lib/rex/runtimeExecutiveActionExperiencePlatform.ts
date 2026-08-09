/**
 * REX-5:7 — Runtime Executive Action Experience Platform.
 *
 * Canonical platform consolidation surface over REX-5:6 Orchestration.
 * Composes, normalizes, exposes, verifies, and describes the completed
 * REX-5 Runtime Executive Action Experience chain.
 *
 * Canonical flow:
 *   REX-5:6 Action Orchestration → REX-5:7 Platform → later Certification & Freeze
 *
 * Platform ≠ New Behavior ≠ Integration Layer ≠ External Execution.
 *
 * No UI, no AI, no provider routing, no persistence, no external dispatch.
 */

import {
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
  canConfirmRuntimeExecutiveAction,
  canTransitionRuntimeExecutiveActionOrchestration,
  createRuntimeExecutiveActionConfirmationFingerprint,
  createRuntimeExecutiveActionConfirmationScope,
  createRuntimeExecutiveActionDispatchRequest,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionOrchestrationSnapshot,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionConfirmationReadiness,
  evaluateRuntimeExecutiveActionOrchestration,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  evaluateRuntimeExecutiveActionSafety,
  hasRuntimeExecutiveActionChangedSincePreview,
  orchestrateRuntimeExecutiveAction,
  resolveRuntimeExecutiveActionConfirmation,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionConfirmationSafetyIdentity,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionIntentContextIdentity,
  runtimeExecutiveActionOrchestrationIdentity,
  runtimeExecutiveActionOrchestrationSupportedImportPath,
  runtimeExecutiveActionOrchestrationVersion,
  runtimeExecutiveActionPresentationPreviewIdentity,
  verifyRuntimeExecutiveActionConfirmationSafety,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionIntentContext,
  verifyRuntimeExecutiveActionOrchestration,
  verifyRuntimeExecutiveActionPresentationPreview,
  type RuntimeExecutiveActionAcknowledgment,
  type RuntimeExecutiveActionConfirmation,
  type RuntimeExecutiveActionConfirmationResult,
  type RuntimeExecutiveActionDispatchRequest,
  type RuntimeExecutiveActionDraft,
  type RuntimeExecutiveActionIntentContextRequest,
  type RuntimeExecutiveActionIntentContextResult,
  type RuntimeExecutiveActionOrchestration,
  type RuntimeExecutiveActionOrchestrationIssue,
  type RuntimeExecutiveActionOrchestrationRequest,
  type RuntimeExecutiveActionOrchestrationResult,
  type RuntimeExecutiveActionOrchestrationSnapshot,
  type RuntimeExecutiveActionPreparationResult,
  type RuntimeExecutiveActionPreviewResult,
  type RuntimeExecutiveActionProposalContract,
} from "@/app/lib/rex/runtimeExecutiveActionOrchestration";

// ─── Direct approved re-exports (no behavior change) ────────────────────────

export {
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
  canConfirmRuntimeExecutiveAction,
  canTransitionRuntimeExecutiveActionOrchestration,
  createRuntimeExecutiveActionConfirmationFingerprint,
  createRuntimeExecutiveActionConfirmationScope,
  createRuntimeExecutiveActionDispatchRequest,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionOrchestrationSnapshot,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionConfirmationReadiness,
  evaluateRuntimeExecutiveActionOrchestration,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  evaluateRuntimeExecutiveActionSafety,
  hasRuntimeExecutiveActionChangedSincePreview,
  orchestrateRuntimeExecutiveAction,
  resolveRuntimeExecutiveActionConfirmation,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  verifyRuntimeExecutiveActionConfirmationSafety,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionIntentContext,
  verifyRuntimeExecutiveActionOrchestration,
  verifyRuntimeExecutiveActionPresentationPreview,
};

export type {
  RuntimeExecutiveActionAcknowledgment,
  RuntimeExecutiveActionConfirmation,
  RuntimeExecutiveActionConfirmationResult,
  RuntimeExecutiveActionDispatchRequest,
  RuntimeExecutiveActionDraft,
  RuntimeExecutiveActionIntentContextRequest,
  RuntimeExecutiveActionIntentContextResult,
  RuntimeExecutiveActionOrchestration,
  RuntimeExecutiveActionOrchestrationIssue,
  RuntimeExecutiveActionOrchestrationRequest,
  RuntimeExecutiveActionOrchestrationResult,
  RuntimeExecutiveActionOrchestrationSnapshot,
  RuntimeExecutiveActionPreparationResult,
  RuntimeExecutiveActionPreviewResult,
  RuntimeExecutiveActionProposalContract,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveActionExperiencePlatformIdentity =
  "REX-5:7/RuntimeExecutiveActionExperiencePlatform" as const;

export const runtimeExecutiveActionExperiencePlatformVersion =
  "5.7.0" as const;

export const runtimeExecutiveActionExperiencePlatformNamespace =
  "nexora.rex.action-experience.platform" as const;

export const runtimeExecutiveActionExperiencePlatformLayer = "REX" as const;

export const runtimeExecutiveActionExperiencePlatformCapability =
  "RuntimeExecutiveActionExperience" as const;

export const runtimeExecutiveActionExperiencePlatformPhase =
  "Platform" as const;

export const runtimeExecutiveActionExperiencePlatformStatus =
  "PlatformComplete" as const;

export const runtimeExecutiveActionExperiencePlatformArchitecturalRole =
  "RuntimeExecutiveActionExperiencePlatform" as const;

export const runtimeExecutiveActionExperiencePlatformConsumerRole =
  "PreCertificationPlatformSurface" as const;

export const runtimeExecutiveActionExperiencePlatformDependencyIdentity =
  runtimeExecutiveActionOrchestrationIdentity;

export const runtimeExecutiveActionExperiencePlatformDependencyPath =
  runtimeExecutiveActionOrchestrationSupportedImportPath;

export const runtimeExecutiveActionExperiencePlatformSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveActionExperiencePlatform" as const;

export const runtimeExecutiveActionExperiencePlatformStability =
  "ReadyForCertification" as const;

export const runtimeExecutiveActionExperiencePlatformDeterministic =
  true as const;

export const runtimeExecutiveActionExperiencePlatformSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveActionExperiencePlatformMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveActionExperiencePlatformCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveActionExperiencePlatformIdentity,
    version: runtimeExecutiveActionExperiencePlatformVersion,
    namespace: runtimeExecutiveActionExperiencePlatformNamespace,
    layer: runtimeExecutiveActionExperiencePlatformLayer,
    capability: runtimeExecutiveActionExperiencePlatformCapability,
    phase: runtimeExecutiveActionExperiencePlatformPhase,
    status: runtimeExecutiveActionExperiencePlatformStatus,
    architecturalRole:
      runtimeExecutiveActionExperiencePlatformArchitecturalRole,
    consumerRole: runtimeExecutiveActionExperiencePlatformConsumerRole,
    dependencyIdentity:
      runtimeExecutiveActionExperiencePlatformDependencyIdentity,
    dependencyPath: runtimeExecutiveActionExperiencePlatformDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperiencePlatformSupportedImportPath,
    upstreamVersion: runtimeExecutiveActionOrchestrationVersion,
    stabilityStatus: runtimeExecutiveActionExperiencePlatformStability,
    deterministicStatus:
      runtimeExecutiveActionExperiencePlatformDeterministic,
    sideEffectPolicy:
      runtimeExecutiveActionExperiencePlatformSideEffectPolicy,
    mutationPolicy: runtimeExecutiveActionExperiencePlatformMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_PRINCIPLE =
  "Platform ≠ New Behavior ≠ Integration Layer ≠ External Execution. REX-5:7 composes and exposes the completed REX-5 runtime action experience for certification." as const;

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    platformAuthority: "REX-5:7" as const,
    architecturalRole: "RuntimeExecutiveActionExperiencePlatform" as const,
    consumerRole: "PreCertificationPlatformSurface" as const,
    soleImmediateDependency:
      "REX-5:6/RuntimeExecutiveActionOrchestration" as const,
    consumesOrchestrationOnly: true as const,
    importsRex55Directly: false as const,
    importsRex54Directly: false as const,
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
    providerNeutral: true as const,
    aiIndependent: true as const,
    introducesDispatch: false as const,
    introducesExternalExecution: false as const,
    introducesUiBehavior: false as const,
    introducesPersistence: false as const,
    introducesProviderRouting: false as const,
    isFinalPublicConsumerIndex: false as const,
    isCertified: false as const,
    isFrozen: false as const,
    isReleased: false as const,
  });

// ─── Identity chain ─────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN = Object.freeze([
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionIntentContextIdentity,
  runtimeExecutiveActionPresentationPreviewIdentity,
  runtimeExecutiveActionConfirmationSafetyIdentity,
  runtimeExecutiveActionOrchestrationIdentity,
  runtimeExecutiveActionExperiencePlatformIdentity,
] as const);

export type RuntimeExecutiveActionExperienceIdentityChain =
  typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN;

// ─── Capabilities / readiness / verification vocabularies ───────────────────

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES = Object.freeze([
  "action-domain",
  "action-contracts",
  "intent-context-resolution",
  "presentation-preview",
  "confirmation-safety",
  "action-orchestration",
  "dispatch-request-preparation",
] as const);

export type RuntimeExecutiveActionExperienceCapability =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITY_STATUSES =
  Object.freeze(["available", "unavailable"] as const);

export type RuntimeExecutiveActionExperienceCapabilityStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_READINESS =
  Object.freeze(["ready", "not-ready"] as const);

export type RuntimeExecutiveActionExperiencePlatformReadiness =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_READINESS)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_VERIFICATION_STATUSES =
  Object.freeze(["valid", "invalid"] as const);

export type RuntimeExecutiveActionExperiencePlatformVerificationStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_VERIFICATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_VERIFICATION_DOMAINS =
  Object.freeze([
    "identity",
    "dependency",
    "foundation",
    "contracts",
    "intent-context",
    "presentation-preview",
    "confirmation-safety",
    "orchestration",
    "dispatch-boundary",
    "immutability",
    "determinism",
    "registry",
    "guarantees",
  ] as const);

export type RuntimeExecutiveActionExperiencePlatformVerificationDomain =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_VERIFICATION_DOMAINS)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_COMPATIBILITY_STATUSES =
  Object.freeze(["compatible", "incompatible"] as const);

export type RuntimeExecutiveActionExperiencePlatformCompatibility =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_COMPATIBILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_API_CATEGORIES =
  Object.freeze([
    "Identity",
    "Domain",
    "Contracts",
    "IntentContext",
    "Presentation",
    "ConfirmationSafety",
    "Orchestration",
    "Verification",
    "Registry",
    "PlatformInformation",
  ] as const);

export type RuntimeExecutiveActionExperiencePlatformApiCategory =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_API_CATEGORIES)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS =
  Object.freeze([
    "single-immediate-dependency",
    "canonical-layer-order",
    "no-phase-skipping",
    "explicit-confirmation-required",
    "confirmation-scope-stable",
    "ambiguity-not-silently-resolved",
    "provider-neutral",
    "renderer-independent",
    "external-dispatch-absent",
    "deterministic",
    "immutable",
  ] as const);

export type RuntimeExecutiveActionExperiencePlatformInvariant =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES =
  Object.freeze([
    "type-safe",
    "deterministic",
    "immutable",
    "foundation-aligned",
    "contract-aligned",
    "intent-context-aligned",
    "preview-aligned",
    "confirmation-gated",
    "safety-preserving",
    "scope-stable",
    "phase-ordered",
    "issue-preserving",
    "provider-neutral",
    "renderer-independent",
    "transport-independent",
    "side-effect-free",
    "external-dispatch-free",
  ] as const);

export type RuntimeExecutiveActionExperiencePlatformGuarantee =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_FLOW = Object.freeze([
  "action-proposal",
  "contract-evaluation",
  "intent-context-resolution",
  "presentation-preview",
  "safety-evaluation",
  "explicit-confirmation",
  "orchestration",
  "prepared-for-dispatch",
  "provider-neutral-dispatch-request",
] as const);

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_ISSUE_SOURCE_ORDER =
  Object.freeze([
    "contract",
    "intent-context",
    "preview",
    "confirmation-safety",
    "orchestration",
    "platform",
  ] as const);

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "IdentityChain",
    "Capabilities",
    "PublicTypes",
    "PublicAPIs",
    "Lifecycle",
    "Presentation",
    "ConfirmationSafety",
    "Orchestration",
    "Verification",
    "Compatibility",
    "Invariants",
    "Guarantees",
    "ConsumerInformation",
  ] as const);

export type RuntimeExecutiveActionExperiencePlatformRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS)[number];

// ─── Models ─────────────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionExperiencePlatformCheck {
  readonly id: string;
  readonly domain: RuntimeExecutiveActionExperiencePlatformVerificationDomain;
  readonly passed: boolean;
  readonly reason: string;
}

export interface RuntimeExecutiveActionExperiencePlatformVerification {
  readonly status: RuntimeExecutiveActionExperiencePlatformVerificationStatus;
  readonly checks: ReadonlyArray<RuntimeExecutiveActionExperiencePlatformCheck>;
  readonly passedCount: number;
  readonly failedCount: number;
  readonly issues: ReadonlyArray<string>;
  readonly readiness: RuntimeExecutiveActionExperiencePlatformReadiness;
  readonly readyForCertification: boolean;
}

export interface RuntimeExecutiveActionExperiencePlatformConsumerInformation {
  readonly currentPhase: "Platform";
  readonly nextPhase: "CertificationFreeze";
  readonly consumerRole: "PreCertificationPlatformSurface";
  readonly externalDispatch: "not-provided";
  readonly providerRouting: "not-provided";
  readonly uiRendering: "not-provided";
  readonly releaseStatus: "PlatformComplete";
  readonly certificationStatus: "ReadyForCertification";
  readonly consumerEntryPoint: "not-yet";
}

export interface RuntimeExecutiveActionExperiencePlatformSnapshot {
  readonly actionTitle?: string;
  readonly actionKind?: string;
  readonly intentStatus?: string;
  readonly previewStatus?: string;
  readonly confirmationStatus?: string;
  readonly orchestrationPhase?: string;
  readonly orchestrationStatus?: string;
  readonly downstreamEligibility?: string;
  readonly externalDispatch: "not-performed";
  readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
}

export interface RuntimeExecutiveActionExperiencePlatform {
  readonly identity: typeof runtimeExecutiveActionExperiencePlatformIdentity;
  readonly version: typeof runtimeExecutiveActionExperiencePlatformVersion;
  readonly namespace: typeof runtimeExecutiveActionExperiencePlatformNamespace;
  readonly phase: typeof runtimeExecutiveActionExperiencePlatformPhase;
  readonly architecturalRole: typeof runtimeExecutiveActionExperiencePlatformArchitecturalRole;
  readonly consumerRole: typeof runtimeExecutiveActionExperiencePlatformConsumerRole;
  readonly capabilities: typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES;
  readonly identityChain: typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN;
  readonly actionKinds: typeof RUNTIME_EXECUTIVE_ACTION_KINDS;
  readonly lifecycleStates: typeof RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES;
  readonly presentationStates: typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES;
  readonly confirmationStatuses: typeof RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES;
  readonly safetyStatuses: typeof RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES;
  readonly orchestrationPhases: typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES;
  readonly guarantees: typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES;
  readonly invariants: typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS;
  readonly readiness: RuntimeExecutiveActionExperiencePlatformReadiness;
  readonly status: typeof runtimeExecutiveActionExperiencePlatformStatus;
  readonly flow: typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_FLOW;
  readonly registry: typeof runtimeExecutiveActionExperiencePlatformRegistry;
}

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

function check(
  id: string,
  domain: RuntimeExecutiveActionExperiencePlatformVerificationDomain,
  passed: boolean,
  reason: string,
): RuntimeExecutiveActionExperiencePlatformCheck {
  return Object.freeze({ id, domain, passed, reason });
}

// ─── Issue aggregation ──────────────────────────────────────────────────────

export function collectRuntimeExecutiveActionExperienceIssues(input: {
  readonly orchestration?: RuntimeExecutiveActionOrchestration;
  readonly platformIssues?: ReadonlyArray<string>;
}): ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue | {
  readonly code: string;
  readonly source: "platform";
  readonly severity: "blocking";
  readonly blocking: true;
  readonly message: string;
}> {
  const sourceRank = new Map(
    RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_ISSUE_SOURCE_ORDER.map(
      (value, index) => [value, index],
    ),
  );
  const issues = [
    ...(input.orchestration?.issues ?? []),
    ...(input.platformIssues ?? []).map((message) =>
      Object.freeze({
        code: "platform-issue",
        source: "platform" as const,
        severity: "blocking" as const,
        blocking: true as const,
        message,
      }),
    ),
  ];
  return freezeArray(
    [...issues].sort(
      (a, b) =>
        (sourceRank.get(a.source) ?? 99) - (sourceRank.get(b.source) ?? 99),
    ),
  );
}

// ─── Snapshot / experience evaluation ───────────────────────────────────────

export function createRuntimeExecutiveActionExperiencePlatformSnapshot(
  orchestration: RuntimeExecutiveActionOrchestration,
): RuntimeExecutiveActionExperiencePlatformSnapshot {
  return Object.freeze({
    ...(orchestration.proposal?.title !== undefined
      ? { actionTitle: orchestration.proposal.title }
      : {}),
    ...(orchestration.proposal?.kind !== undefined
      ? { actionKind: orchestration.proposal.kind }
      : {}),
    ...(orchestration.intentContextResult?.status !== undefined
      ? { intentStatus: orchestration.intentContextResult.status }
      : {}),
    ...(orchestration.previewResult?.status !== undefined
      ? { previewStatus: orchestration.previewResult.status }
      : {}),
    ...(orchestration.confirmation?.status !== undefined
      ? { confirmationStatus: orchestration.confirmation.status }
      : {}),
    orchestrationPhase: orchestration.phase,
    orchestrationStatus: orchestration.status,
    downstreamEligibility: orchestration.downstreamEligibility,
    externalDispatch: "not-performed",
    issues: orchestration.issues,
  });
}

/**
 * Pure full-pipeline evaluation up to the explicit confirmation boundary.
 * Never auto-confirms. Never dispatches.
 */
export function evaluateRuntimeExecutiveActionExperience(
  request: Omit<RuntimeExecutiveActionOrchestrationRequest, "operation">,
): RuntimeExecutiveActionOrchestrationResult {
  return evaluateRuntimeExecutiveActionOrchestration(request);
}

// ─── Invariant / compatibility / consumer readiness ─────────────────────────

export function verifyRuntimeExecutiveActionExperiencePlatformInvariants():
  Readonly<{
    readonly ok: boolean;
    readonly invariants: typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS;
    readonly failures: ReadonlyArray<string>;
  }> {
  const failures: string[] = [];
  const boundary = RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_BOUNDARY;

  if (
    boundary.soleImmediateDependency !==
    "REX-5:6/RuntimeExecutiveActionOrchestration"
  ) {
    failures.push("single-immediate-dependency");
  }
  if (
    !exactOrder([...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN], [
      "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
      "REX-5:2/RuntimeExecutiveActionExperienceContracts",
      "REX-5:3/RuntimeExecutiveActionIntentContext",
      "REX-5:4/RuntimeExecutiveActionPresentationPreview",
      "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
      "REX-5:6/RuntimeExecutiveActionOrchestration",
      "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
    ])
  ) {
    failures.push("canonical-layer-order");
  }
  if (
    canTransitionRuntimeExecutiveActionOrchestration({
      from: "proposal",
      to: "prepared-for-dispatch",
      operation: "advance",
    })
  ) {
    failures.push("no-phase-skipping");
  }
  if (
    canTransitionRuntimeExecutiveActionOrchestration({
      from: "confirmation",
      to: "prepared-for-dispatch",
      operation: "advance",
    })
  ) {
    failures.push("explicit-confirmation-required");
  }
  if (boundary.providerNeutral !== true) {
    failures.push("provider-neutral");
  }
  if (boundary.rendererIndependent !== true) {
    failures.push("renderer-independent");
  }
  if (boundary.introducesDispatch !== false) {
    failures.push("external-dispatch-absent");
  }
  if (runtimeExecutiveActionExperiencePlatformDeterministic !== true) {
    failures.push("deterministic");
  }
  if (
    runtimeExecutiveActionExperiencePlatformMutationPolicy !== "immutable"
  ) {
    failures.push("immutable");
  }

  return Object.freeze({
    ok: failures.length === 0,
    invariants: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS,
    failures: freezeArray(failures),
  });
}

export function verifyRuntimeExecutiveActionExperiencePlatformCompatibility():
  Readonly<{
    readonly status: RuntimeExecutiveActionExperiencePlatformCompatibility;
    readonly reasons: ReadonlyArray<string>;
  }> {
  const reasons: string[] = [];
  const foundation = verifyRuntimeExecutiveActionExperienceFoundation();
  const contracts = verifyRuntimeExecutiveActionExperienceContracts();
  const intent = verifyRuntimeExecutiveActionIntentContext();
  const preview = verifyRuntimeExecutiveActionPresentationPreview();
  const confirmation = verifyRuntimeExecutiveActionConfirmationSafety();
  const orchestration = verifyRuntimeExecutiveActionOrchestration();

  if (!foundation.ok) reasons.push("foundation-incompatible");
  if (!contracts.ok) reasons.push("contracts-incompatible");
  if (!intent.ok) reasons.push("intent-context-incompatible");
  if (!preview.ok) reasons.push("presentation-preview-incompatible");
  if (!confirmation.ok) reasons.push("confirmation-safety-incompatible");
  if (!orchestration.ok) reasons.push("orchestration-incompatible");

  if (
    !exactOrder([...RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES], [
      "minimum",
      "report",
      "operation",
    ])
  ) {
    reasons.push("presentation-semantics-misaligned");
  }
  if (
    !exactOrder([...RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES].slice(0, 6), [
      "proposal",
      "contract",
      "intent-context",
      "preview",
      "confirmation",
      "prepared-for-dispatch",
    ])
  ) {
    reasons.push("orchestration-phase-misaligned");
  }

  return Object.freeze({
    status: reasons.length === 0 ? "compatible" : "incompatible",
    reasons: freezeArray(reasons),
  });
}

export function verifyRuntimeExecutiveActionExperiencePlatformConsumerReadiness():
  Readonly<{
    readonly status: "ReadyForCertification" | "NotReady";
    readonly consumerRole: "PreCertificationPlatformSurface";
    readonly readyForConsumer: false;
    readonly reasons: ReadonlyArray<string>;
  }> {
  const verification = verifyRuntimeExecutiveActionExperiencePlatform();
  const compatibility =
    verifyRuntimeExecutiveActionExperiencePlatformCompatibility();
  const reasons: string[] = [];
  if (verification.status !== "valid") {
    reasons.push("platform-verification-invalid");
  }
  if (compatibility.status !== "compatible") {
    reasons.push("platform-incompatible");
  }
  return Object.freeze({
    status: reasons.length === 0 ? "ReadyForCertification" : "NotReady",
    consumerRole: "PreCertificationPlatformSurface",
    readyForConsumer: false,
    reasons: freezeArray(reasons),
  });
}

// ─── Platform verification ──────────────────────────────────────────────────

export function verifyRuntimeExecutiveActionExperiencePlatform():
  RuntimeExecutiveActionExperiencePlatformVerification {
  const foundation = verifyRuntimeExecutiveActionExperienceFoundation();
  const contracts = verifyRuntimeExecutiveActionExperienceContracts();
  const intent = verifyRuntimeExecutiveActionIntentContext();
  const preview = verifyRuntimeExecutiveActionPresentationPreview();
  const confirmation = verifyRuntimeExecutiveActionConfirmationSafety();
  const orchestration = verifyRuntimeExecutiveActionOrchestration();
  const invariants = verifyRuntimeExecutiveActionExperiencePlatformInvariants();
  const compatibility =
    verifyRuntimeExecutiveActionExperiencePlatformCompatibility();
  const registry = runtimeExecutiveActionExperiencePlatformRegistry;

  const checks = freezeArray([
    check(
      "identity-exact",
      "identity",
      runtimeExecutiveActionExperiencePlatformIdentity ===
        "REX-5:7/RuntimeExecutiveActionExperiencePlatform" &&
        runtimeExecutiveActionExperiencePlatformVersion === "5.7.0" &&
        runtimeExecutiveActionExperiencePlatformNamespace ===
          "nexora.rex.action-experience.platform",
      "Platform identity/version/namespace are exact",
    ),
    check(
      "dependency-orchestration-only",
      "dependency",
      runtimeExecutiveActionExperiencePlatformDependencyIdentity ===
        "REX-5:6/RuntimeExecutiveActionOrchestration" &&
        RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_BOUNDARY
          .consumesOrchestrationOnly === true,
      "Sole immediate dependency is REX-5:6",
    ),
    check(
      "identity-chain-order",
      "dependency",
      exactOrder([...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN], [
        "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
        "REX-5:2/RuntimeExecutiveActionExperienceContracts",
        "REX-5:3/RuntimeExecutiveActionIntentContext",
        "REX-5:4/RuntimeExecutiveActionPresentationPreview",
        "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
        "REX-5:6/RuntimeExecutiveActionOrchestration",
        "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
      ]),
      "Identity chain is ordered REX-5:1 → REX-5:7",
    ),
    check(
      "foundation-available",
      "foundation",
      foundation.ok === true,
      "Foundation verification passes",
    ),
    check(
      "contracts-available",
      "contracts",
      contracts.ok === true,
      "Contracts verification passes",
    ),
    check(
      "intent-context-available",
      "intent-context",
      intent.ok === true,
      "Intent/context verification passes",
    ),
    check(
      "presentation-preview-available",
      "presentation-preview",
      preview.ok === true,
      "Presentation/preview verification passes",
    ),
    check(
      "confirmation-safety-available",
      "confirmation-safety",
      confirmation.ok === true,
      "Confirmation/safety verification passes",
    ),
    check(
      "orchestration-available",
      "orchestration",
      orchestration.ok === true &&
        orchestration.noPhaseSkipping === true &&
        orchestration.autoConfirmationForbidden === true,
      "Orchestration verification passes with confirmation gate",
    ),
    check(
      "dispatch-boundary",
      "dispatch-boundary",
      RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_BOUNDARY.introducesDispatch ===
        false &&
        RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY.includes("eligible") &&
        RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY.includes(
          "not-eligible",
        ),
      "Prepared-for-dispatch ≠ external dispatch",
    ),
    check(
      "immutability-policy",
      "immutability",
      runtimeExecutiveActionExperiencePlatformMutationPolicy === "immutable" &&
        Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN) &&
        Object.isFrozen(runtimeExecutiveActionExperiencePlatformRegistry),
      "Immutability policy holds",
    ),
    check(
      "determinism-policy",
      "determinism",
      runtimeExecutiveActionExperiencePlatformDeterministic === true,
      "Determinism policy holds",
    ),
    check(
      "registry-integrity",
      "registry",
      registry.sectionCount ===
        RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS.length &&
        registry.capabilityCount ===
          RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES.length &&
        registry.identityChainCount ===
          RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN.length &&
        unique([...registry.sections]),
      "Registry counts and uniqueness hold",
    ),
    check(
      "guarantees-integrity",
      "guarantees",
      registry.guaranteeCount ===
        RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES.length &&
        invariants.ok === true,
      "Guarantees and invariants hold",
    ),
    check(
      "compatibility",
      "guarantees",
      compatibility.status === "compatible",
      "Platform surfaces are mutually compatible",
    ),
  ]);

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;
  const issues = freezeArray(
    checks.filter((entry) => !entry.passed).map((entry) => entry.id),
  );
  const status: RuntimeExecutiveActionExperiencePlatformVerificationStatus =
    failedCount === 0 ? "valid" : "invalid";
  const readiness: RuntimeExecutiveActionExperiencePlatformReadiness =
    status === "valid" ? "ready" : "not-ready";

  return Object.freeze({
    status,
    checks,
    passedCount,
    failedCount,
    issues,
    readiness,
    readyForCertification: status === "valid",
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveActionExperiencePlatformIdentity():
  typeof runtimeExecutiveActionExperiencePlatformCanonicalIdentity {
  return runtimeExecutiveActionExperiencePlatformCanonicalIdentity;
}

export function getRuntimeExecutiveActionExperiencePlatformGuarantees():
  typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES {
  return RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES;
}

export function getRuntimeExecutiveActionExperiencePlatformCapabilities():
  typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES {
  return RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES;
}

export function getRuntimeExecutiveActionExperiencePlatformRegistry():
  typeof runtimeExecutiveActionExperiencePlatformRegistry {
  return runtimeExecutiveActionExperiencePlatformRegistry;
}

export function getRuntimeExecutiveActionExperiencePlatform():
  RuntimeExecutiveActionExperiencePlatform {
  const verification = verifyRuntimeExecutiveActionExperiencePlatform();
  return Object.freeze({
    identity: runtimeExecutiveActionExperiencePlatformIdentity,
    version: runtimeExecutiveActionExperiencePlatformVersion,
    namespace: runtimeExecutiveActionExperiencePlatformNamespace,
    phase: runtimeExecutiveActionExperiencePlatformPhase,
    architecturalRole:
      runtimeExecutiveActionExperiencePlatformArchitecturalRole,
    consumerRole: runtimeExecutiveActionExperiencePlatformConsumerRole,
    capabilities: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES,
    identityChain: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
    actionKinds: RUNTIME_EXECUTIVE_ACTION_KINDS,
    lifecycleStates: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
    presentationStates: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
    confirmationStatuses: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
    safetyStatuses: RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
    orchestrationPhases: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
    guarantees: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES,
    invariants: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS,
    readiness: verification.readiness,
    status: runtimeExecutiveActionExperiencePlatformStatus,
    flow: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_FLOW,
    registry: runtimeExecutiveActionExperiencePlatformRegistry,
  });
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveActionExperiencePlatformApiNames = Object.freeze([
  "getRuntimeExecutiveActionExperiencePlatformIdentity",
  "getRuntimeExecutiveActionExperiencePlatformRegistry",
  "getRuntimeExecutiveActionExperiencePlatformCapabilities",
  "getRuntimeExecutiveActionExperiencePlatformGuarantees",
  "getRuntimeExecutiveActionExperiencePlatform",
  "collectRuntimeExecutiveActionExperienceIssues",
  "createRuntimeExecutiveActionExperiencePlatformSnapshot",
  "evaluateRuntimeExecutiveActionExperience",
  "verifyRuntimeExecutiveActionExperiencePlatformInvariants",
  "verifyRuntimeExecutiveActionExperiencePlatformCompatibility",
  "verifyRuntimeExecutiveActionExperiencePlatformConsumerReadiness",
  "verifyRuntimeExecutiveActionExperiencePlatform",
  "createRuntimeExecutiveActionDraft",
  "createRuntimeExecutiveActionProposalContract",
  "evaluateRuntimeExecutiveActionProposalContract",
  "evaluateRuntimeExecutiveActionPreparationContract",
  "resolveRuntimeExecutiveActionIntentContext",
  "resolveRuntimeExecutiveActionPreview",
  "evaluateRuntimeExecutiveActionSafety",
  "resolveRuntimeExecutiveActionConfirmation",
  "orchestrateRuntimeExecutiveAction",
  "createRuntimeExecutiveActionDispatchRequest",
] as const);

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveActionExperienceCapability",
    "RuntimeExecutiveActionExperienceCapabilityStatus",
    "RuntimeExecutiveActionExperiencePlatformReadiness",
    "RuntimeExecutiveActionExperiencePlatformVerificationStatus",
    "RuntimeExecutiveActionExperiencePlatformVerificationDomain",
    "RuntimeExecutiveActionExperiencePlatformCompatibility",
    "RuntimeExecutiveActionExperiencePlatformApiCategory",
    "RuntimeExecutiveActionExperiencePlatformInvariant",
    "RuntimeExecutiveActionExperiencePlatformGuarantee",
    "RuntimeExecutiveActionExperiencePlatformRegistrySection",
    "RuntimeExecutiveActionExperienceIdentityChain",
    "RuntimeExecutiveActionExperiencePlatformCheck",
    "RuntimeExecutiveActionExperiencePlatformVerification",
    "RuntimeExecutiveActionExperiencePlatformConsumerInformation",
    "RuntimeExecutiveActionExperiencePlatformSnapshot",
    "RuntimeExecutiveActionExperiencePlatform",
    "RuntimeExecutiveActionDraft",
    "RuntimeExecutiveActionProposalContract",
    "RuntimeExecutiveActionIntentContextResult",
    "RuntimeExecutiveActionPreviewResult",
    "RuntimeExecutiveActionConfirmation",
    "RuntimeExecutiveActionOrchestration",
    "RuntimeExecutiveActionDispatchRequest",
  ] as const);

export const runtimeExecutiveActionExperiencePlatformConsumerInformation =
  Object.freeze({
    currentPhase: "Platform",
    nextPhase: "CertificationFreeze",
    consumerRole: "PreCertificationPlatformSurface",
    externalDispatch: "not-provided",
    providerRouting: "not-provided",
    uiRendering: "not-provided",
    releaseStatus: "PlatformComplete",
    certificationStatus: "ReadyForCertification",
    consumerEntryPoint: "not-yet",
  }) as RuntimeExecutiveActionExperiencePlatformConsumerInformation;

export const runtimeExecutiveActionExperiencePlatformRegistry = Object.freeze({
  identity: runtimeExecutiveActionExperiencePlatformIdentity,
  version: runtimeExecutiveActionExperiencePlatformVersion,
  namespace: runtimeExecutiveActionExperiencePlatformNamespace,
  layer: runtimeExecutiveActionExperiencePlatformLayer,
  capability: runtimeExecutiveActionExperiencePlatformCapability,
  phase: runtimeExecutiveActionExperiencePlatformPhase,
  status: runtimeExecutiveActionExperiencePlatformStatus,
  architecturalRole:
    runtimeExecutiveActionExperiencePlatformArchitecturalRole,
  consumerRole: runtimeExecutiveActionExperiencePlatformConsumerRole,
  dependencyIdentity:
    runtimeExecutiveActionExperiencePlatformDependencyIdentity,
  dependencyPath: runtimeExecutiveActionExperiencePlatformDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionExperiencePlatformSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS,
  sectionCount:
    RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS.length,
  identityChain: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
  identityChainCount: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN.length,
  capabilities: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES,
  capabilityCount: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES.length,
  capabilityStatuses: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITY_STATUSES,
  publicTypes: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveActionExperiencePlatformApiNames,
  publicApiCount: runtimeExecutiveActionExperiencePlatformApiNames.length,
  apiCategories: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_API_CATEGORIES,
  apiCategoryCount:
    RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_API_CATEGORIES.length,
  lifecycleStates: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  lifecycleStateCount: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES.length,
  presentationStates: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  presentationStateCount: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES.length,
  confirmationStatuses: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  confirmationStatusCount: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES.length,
  safetyStatuses: RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
  orchestrationPhases: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
  orchestrationPhaseCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES.length,
  verificationDomains:
    RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_VERIFICATION_DOMAINS,
  verificationDomainCount:
    RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_VERIFICATION_DOMAINS.length,
  compatibilityStatuses:
    RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_COMPATIBILITY_STATUSES,
  invariants: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS,
  invariantCount: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS.length,
  guarantees: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES,
  guaranteeCount: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES.length,
  consumerInformation:
    runtimeExecutiveActionExperiencePlatformConsumerInformation,
  flow: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_FLOW,
  flowStepCount: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_FLOW.length,
});

export const runtimeExecutiveActionExperiencePlatform = Object.freeze({
  phase: "Platform" as const,
  name: "RuntimeExecutiveActionExperiencePlatform" as const,
  identity: runtimeExecutiveActionExperiencePlatformIdentity,
  version: runtimeExecutiveActionExperiencePlatformVersion,
  namespace: runtimeExecutiveActionExperiencePlatformNamespace,
  layer: runtimeExecutiveActionExperiencePlatformLayer,
  capability: runtimeExecutiveActionExperiencePlatformCapability,
  architecturalRole:
    runtimeExecutiveActionExperiencePlatformArchitecturalRole,
  consumerRole: runtimeExecutiveActionExperiencePlatformConsumerRole,
  role: "Platform" as const,
  status: runtimeExecutiveActionExperiencePlatformStatus,
  upstreamDependency:
    runtimeExecutiveActionExperiencePlatformDependencyIdentity,
  dependencyPath: runtimeExecutiveActionExperiencePlatformDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionExperiencePlatformSupportedImportPath,
  deterministic: runtimeExecutiveActionExperiencePlatformDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  confirmationGated: true as const,
  safetyPreserving: true as const,
  scopeStable: true as const,
  phaseOrdered: true as const,
  providerNeutral: true as const,
  rendererIndependent: true as const,
  transportIndependent: true as const,
  aiIndependent: true as const,
  externalDispatchFree: true as const,
  readyForCertification: true as const,
  readyForConsumer: false as const,
  certified: false as const,
  frozen: false as const,
  released: false as const,
  principle: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_BOUNDARY,
  identityChain: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
  capabilities: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES,
  invariants: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS,
  guarantees: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES,
  consumerInformation:
    runtimeExecutiveActionExperiencePlatformConsumerInformation,
  publicTypeNames:
    RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveActionExperiencePlatformApiNames,
  registry: runtimeExecutiveActionExperiencePlatformRegistry,
  orchestrationBoundary: "REX-5:6-orchestration-only" as const,
  architecturalStatus:
    "REX-5:7 Runtime Executive Action Experience Platform — PlatformComplete / ReadyForCertification" as const,
});
