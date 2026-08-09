/**
 * REX-5:9 — Runtime Executive Action Experience Public Index.
 *
 * Sole supported consumer entry point for the certified, frozen REX-5
 * Runtime Executive Action Experience.
 *
 * Canonical flow:
 *   … → REX-5:8 Certification & Freeze → REX-5:9 Public Index
 *
 * Publication only. No new Action behavior, orchestration, or semantics.
 *
 * Consumers know REX-5:9.
 * REX-5:9 knows REX-5:8.
 * REX-5:8 protects the certified platform.
 *
 * Supported import:
 *   @/app/lib/rex/runtimeExecutiveActionExperiencePublicIndex
 */

import {
  REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
  RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES,
  RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
  canTransitionRuntimeExecutiveActionOrchestration,
  createRuntimeExecutiveActionDispatchRequest,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionExperience,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionSafety,
  getRuntimeExecutiveActionExperienceCertificationFreezeIdentity,
  getRuntimeExecutiveActionExperienceCertificationFreezeRegistry,
  getRuntimeExecutiveActionExperienceFreeze,
  getRuntimeExecutiveActionExperiencePlatformLock,
  hasRuntimeExecutiveActionChangedSincePreview,
  orchestrateRuntimeExecutiveAction,
  resolveRuntimeExecutiveActionConfirmation,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionExperienceCertificationFreeze,
  runtimeExecutiveActionExperienceCertificationFreezeConsumerInformation,
  runtimeExecutiveActionExperienceCertificationFreezeIdentity,
  runtimeExecutiveActionExperienceCertificationFreezeNamespace,
  runtimeExecutiveActionExperienceCertificationFreezeSupportedImportPath,
  runtimeExecutiveActionExperienceCertificationFreezeVersion,
  verifyRuntimeExecutiveActionExperienceCertification,
  verifyRuntimeExecutiveActionExperienceCompatibility,
  verifyRuntimeExecutiveActionExperienceFreeze,
  verifyRuntimeExecutiveActionExperiencePlatform,
} from "@/app/lib/rex/runtimeExecutiveActionExperienceCertificationFreeze";

// ─── Exact REX-5:8-approved publication (direct re-export) ──────────────────

export {
  REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
  RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES,
  RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
  canTransitionRuntimeExecutiveActionOrchestration,
  createRuntimeExecutiveActionDispatchRequest,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionExperience,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionSafety,
  getRuntimeExecutiveActionExperienceCertificationFreezeIdentity,
  getRuntimeExecutiveActionExperienceCertificationFreezeRegistry,
  getRuntimeExecutiveActionExperienceFreeze,
  getRuntimeExecutiveActionExperiencePlatformLock,
  hasRuntimeExecutiveActionChangedSincePreview,
  orchestrateRuntimeExecutiveAction,
  resolveRuntimeExecutiveActionConfirmation,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionExperienceCertificationFreezeConsumerInformation,
  runtimeExecutiveActionExperienceCertificationFreezeIdentity,
  runtimeExecutiveActionExperienceCertificationFreezeNamespace,
  runtimeExecutiveActionExperienceCertificationFreezeVersion,
  verifyRuntimeExecutiveActionExperienceCertification,
  verifyRuntimeExecutiveActionExperienceCompatibility,
  verifyRuntimeExecutiveActionExperienceFreeze,
  verifyRuntimeExecutiveActionExperiencePlatform,
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
  RuntimeExecutiveActionExperienceCertification,
  RuntimeExecutiveActionExperienceCertificationCheck,
  RuntimeExecutiveActionExperienceCertificationResult,
  RuntimeExecutiveActionExperienceCertificationStatus,
  RuntimeExecutiveActionExperienceCompatibilityStatus,
  RuntimeExecutiveActionExperienceFreeze,
  RuntimeExecutiveActionExperienceFreezeStatus,
  RuntimeExecutiveActionExperienceLockStatus,
  RuntimeExecutiveActionExperiencePublicIndexReadiness,
  RuntimeExecutiveActionExperienceFrozenInvariant,
  RuntimeExecutiveActionExperienceFrozenGuarantee,
  RuntimeExecutiveActionExperienceApprovedExport,
} from "@/app/lib/rex/runtimeExecutiveActionExperienceCertificationFreeze";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveActionExperiencePublicIndexIdentity =
  "REX-5:9/RuntimeExecutiveActionExperiencePublicIndex" as const;

export const runtimeExecutiveActionExperiencePublicIndexVersion =
  "5.9.0" as const;

export const runtimeExecutiveActionExperiencePublicIndexNamespace =
  "nexora.rex.action-experience.public-index" as const;

export const runtimeExecutiveActionExperiencePublicIndexLayer = "REX" as const;

export const runtimeExecutiveActionExperiencePublicIndexCapability =
  "RuntimeExecutiveActionExperience" as const;

export const runtimeExecutiveActionExperiencePublicIndexPhase =
  "PublicIndex" as const;

export const runtimeExecutiveActionExperiencePublicIndexArchitecturalRole =
  "SoleConsumerEntryPoint" as const;

export const runtimeExecutiveActionExperiencePublicIndexConsumerRole =
  "SoleConsumerEntryPoint" as const;

export const runtimeExecutiveActionExperiencePublicIndexDependencyIdentity =
  runtimeExecutiveActionExperienceCertificationFreezeIdentity;

export const runtimeExecutiveActionExperiencePublicIndexDependencyPath =
  runtimeExecutiveActionExperienceCertificationFreezeSupportedImportPath;

export const runtimeExecutiveActionExperiencePublicIndexSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveActionExperiencePublicIndex" as const;

export const RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PRINCIPLE =
  "Public Index ≠ New Runtime Layer ≠ Wrapper Behavior ≠ Integration Layer. REX-5:9 publishes the exact approved frozen surface from REX-5:8. Consumers import REX-5 only through REX-5:9." as const;

export const RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  publicIndexAuthority: "REX-5:9" as const,
  architecturalRole: "SoleConsumerEntryPoint" as const,
  consumerRole: "SoleConsumerEntryPoint" as const,
  soleImmediateDependency:
    "REX-5:8/RuntimeExecutiveActionExperienceCertificationFreeze" as const,
  consumesCertificationFreezeOnly: true as const,
  importsRex57Directly: false as const,
  importsRex56Directly: false as const,
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
  introducesRuntimeBehavior: false as const,
  introducesDispatch: false as const,
  isFinalPublicConsumerIndex: true as const,
  isSoleConsumerEntryPoint: true as const,
  isReleased: true as const,
});

// ─── Release vocabularies ───────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_RELEASE_STATUSES =
  Object.freeze(["Released", "Unreleased"] as const);

export type RuntimeExecutiveActionExperienceReleaseStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_RELEASE_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_STABILITY_STATUSES =
  Object.freeze(["Stable", "Unstable"] as const);

export type RuntimeExecutiveActionExperienceStabilityStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_STABILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_READINESS =
  Object.freeze(["ReadyForConsumer", "NotReadyForConsumer"] as const);

export type RuntimeExecutiveActionExperienceConsumerReadiness =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_READINESS)[number];

export const RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS =
  Object.freeze([
    "Identity",
    "PublicTypes",
    "PublicAPIs",
    "Validation",
    "Certification",
    "ReleaseInformation",
    "Compatibility",
    "Registry",
    "ConsumerInformation",
  ] as const);

export type RuntimeExecutiveActionExperiencePublicIndexNamespaceSection =
  (typeof RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS)[number];

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_COMPLETE_IDENTITY_CHAIN =
  Object.freeze([
    ...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
    runtimeExecutiveActionExperienceCertificationFreezeIdentity,
    runtimeExecutiveActionExperiencePublicIndexIdentity,
  ] as const);

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_GUARANTEES =
  Object.freeze([
    "sole-consumer-entry-point",
    "certified",
    "compatible",
    "frozen",
    "locked",
    "stable",
    "ready-for-consumer",
    "deterministic",
    "immutable",
    "confirmation-gated",
    "safety-preserving",
    "scope-stable",
    "ambiguity-preserving",
    "phase-ordered",
    "provider-neutral",
    "renderer-independent",
    "transport-independent",
    "external-dispatch-free",
  ] as const);

export type RuntimeExecutiveActionExperienceConsumerGuarantee =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_GUARANTEES)[number];

/** Approved functional APIs published through the Public Index (from REX-5:8). */
export const RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS = Object.freeze([
  "createRuntimeExecutiveActionDraft",
  "createRuntimeExecutiveActionProposalContract",
  "evaluateRuntimeExecutiveActionProposalContract",
  "evaluateRuntimeExecutiveActionPreparationContract",
  "resolveRuntimeExecutiveActionIntentContext",
  "resolveRuntimeExecutiveActionPreview",
  "evaluateRuntimeExecutiveActionSafety",
  "resolveRuntimeExecutiveActionConfirmation",
  "orchestrateRuntimeExecutiveAction",
  "evaluateRuntimeExecutiveActionExperience",
  "createRuntimeExecutiveActionDispatchRequest",
  "canTransitionRuntimeExecutiveActionOrchestration",
  "hasRuntimeExecutiveActionChangedSincePreview",
  "verifyRuntimeExecutiveActionExperiencePlatform",
  "verifyRuntimeExecutiveActionExperienceCompatibility",
  "verifyRuntimeExecutiveActionExperienceCertification",
  "verifyRuntimeExecutiveActionExperienceFreeze",
  "getRuntimeExecutiveActionExperienceCertificationFreezeIdentity",
  "getRuntimeExecutiveActionExperienceCertificationFreezeRegistry",
  "getRuntimeExecutiveActionExperienceFreeze",
  "getRuntimeExecutiveActionExperiencePlatformLock",
] as const);

/** Public Index publication-level APIs (identity/registry/verification only). */
export const RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PUBLICATION_APIS =
  Object.freeze([
    "getRuntimeExecutiveActionExperiencePublicIndexIdentity",
    "getRuntimeExecutiveActionExperiencePublicIndexRegistry",
    "getRuntimeExecutiveActionExperienceConsumerInformation",
    "verifyRuntimeExecutiveActionExperiencePublicIndex",
  ] as const);

export const RUNTIME_EXECUTIVE_ACTION_PUBLIC_VALIDATION_APIS = Object.freeze([
  "verifyRuntimeExecutiveActionExperiencePublicIndex",
  "verifyRuntimeExecutiveActionExperienceCertification",
  "verifyRuntimeExecutiveActionExperienceCompatibility",
  "verifyRuntimeExecutiveActionExperienceFreeze",
  "verifyRuntimeExecutiveActionExperiencePlatform",
] as const);

export const RUNTIME_EXECUTIVE_ACTION_PUBLIC_CERTIFICATION_PUBLICATION_APIS =
  Object.freeze([
    "verifyRuntimeExecutiveActionExperienceCertification",
    "verifyRuntimeExecutiveActionExperienceCompatibility",
    "verifyRuntimeExecutiveActionExperienceFreeze",
    "getRuntimeExecutiveActionExperiencePlatformLock",
  ] as const);

export const RUNTIME_EXECUTIVE_ACTION_PUBLIC_TYPE_NAMES = Object.freeze([
  "RuntimeExecutiveActionDraft",
  "RuntimeExecutiveActionProposalContract",
  "RuntimeExecutiveActionIntentContextRequest",
  "RuntimeExecutiveActionIntentContextResult",
  "RuntimeExecutiveActionPreviewResult",
  "RuntimeExecutiveActionConfirmation",
  "RuntimeExecutiveActionConfirmationResult",
  "RuntimeExecutiveActionAcknowledgment",
  "RuntimeExecutiveActionOrchestration",
  "RuntimeExecutiveActionOrchestrationResult",
  "RuntimeExecutiveActionOrchestrationSnapshot",
  "RuntimeExecutiveActionOrchestrationIssue",
  "RuntimeExecutiveActionOrchestrationRequest",
  "RuntimeExecutiveActionPreparationResult",
  "RuntimeExecutiveActionDispatchRequest",
  "RuntimeExecutiveActionExperienceCertification",
  "RuntimeExecutiveActionExperienceCertificationCheck",
  "RuntimeExecutiveActionExperienceCertificationResult",
  "RuntimeExecutiveActionExperienceCertificationStatus",
  "RuntimeExecutiveActionExperienceCompatibilityStatus",
  "RuntimeExecutiveActionExperienceFreeze",
  "RuntimeExecutiveActionExperienceFreezeStatus",
  "RuntimeExecutiveActionExperienceLockStatus",
  "RuntimeExecutiveActionExperiencePublicIndexReadiness",
  "RuntimeExecutiveActionExperienceFrozenInvariant",
  "RuntimeExecutiveActionExperienceFrozenGuarantee",
  "RuntimeExecutiveActionExperienceApprovedExport",
  "RuntimeExecutiveActionExperienceStabilityStatus",
  "RuntimeExecutiveActionExperienceConsumerReadiness",
  "RuntimeExecutiveActionExperienceConsumerGuarantee",
  "RuntimeExecutiveActionExperienceConsumerInformation",
  "RuntimeExecutiveActionExperiencePublicIndexVerification",
  "RuntimeExecutiveActionExperiencePublicIndexNamespaceSection",
] as const);

export interface RuntimeExecutiveActionExperienceConsumerInformation {
  readonly consumerRole: "SoleConsumerEntryPoint";
  readonly supportedImportPath: typeof runtimeExecutiveActionExperiencePublicIndexSupportedImportPath;
  readonly releaseStatus: "Released";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly certificationStatus: "Certified";
  readonly compatibilityStatus: "Compatible";
  readonly freezeStatus: "Frozen";
  readonly lockStatus: "Locked";
  readonly platformLock: typeof REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED;
  readonly externalDispatchSupport: "NotProvided";
  readonly providerRoutingSupport: "NotProvided";
  readonly uiRenderingSupport: "NotProvided";
}

export interface RuntimeExecutiveActionExperiencePublicIndexVerificationCheck {
  readonly id: string;
  readonly passed: boolean;
  readonly reason: string;
}

export interface RuntimeExecutiveActionExperiencePublicIndexVerification {
  readonly valid: boolean;
  readonly checks: ReadonlyArray<RuntimeExecutiveActionExperiencePublicIndexVerificationCheck>;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly issues: ReadonlyArray<string>;
  readonly readyForConsumer: boolean;
}

// ─── Release gate (derived from REX-5:8 — not recomputed independently) ─────

function evaluateReleaseGate(): {
  readonly releaseStatus: RuntimeExecutiveActionExperienceReleaseStatus;
  readonly consumerReadiness: RuntimeExecutiveActionExperienceConsumerReadiness;
  readonly certificationStatus: "Certified" | "NotCertified";
  readonly compatibilityStatus: "Compatible" | "Incompatible";
  readonly freezeStatus: "Frozen" | "NotFrozen";
  readonly lockStatus: "Locked" | "Unlocked";
  readonly stability: RuntimeExecutiveActionExperienceStabilityStatus;
  readonly gatePassed: boolean;
} {
  const certification = verifyRuntimeExecutiveActionExperienceCertification();
  const compatibility = verifyRuntimeExecutiveActionExperienceCompatibility();
  const freeze = verifyRuntimeExecutiveActionExperienceFreeze();
  const gatePassed =
    certification.status === "certified" &&
    compatibility.status === "compatible" &&
    freeze.freezeStatus === "frozen" &&
    freeze.lockStatus === "locked" &&
    freeze.lock ===
      REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED &&
    freeze.frozenCompatibility === "compatible" &&
    freeze.readyForPublicIndex === "ready-for-public-index";

  return Object.freeze({
    releaseStatus: gatePassed ? ("Released" as const) : ("Unreleased" as const),
    consumerReadiness: gatePassed
      ? ("ReadyForConsumer" as const)
      : ("NotReadyForConsumer" as const),
    certificationStatus: gatePassed
      ? ("Certified" as const)
      : ("NotCertified" as const),
    compatibilityStatus: gatePassed
      ? ("Compatible" as const)
      : ("Incompatible" as const),
    freezeStatus: gatePassed ? ("Frozen" as const) : ("NotFrozen" as const),
    lockStatus: gatePassed ? ("Locked" as const) : ("Unlocked" as const),
    stability: gatePassed ? ("Stable" as const) : ("Unstable" as const),
    gatePassed,
  });
}

const CANONICAL_RELEASE_GATE = evaluateReleaseGate();

export const runtimeExecutiveActionExperiencePublicIndexStatus =
  CANONICAL_RELEASE_GATE.releaseStatus;

export const runtimeExecutiveActionExperiencePublicIndexStability =
  CANONICAL_RELEASE_GATE.stability;

export const runtimeExecutiveActionExperiencePublicIndexDeterministic =
  true as const;

export const runtimeExecutiveActionExperiencePublicIndexSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveActionExperiencePublicIndexMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveActionExperiencePublicIndexCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveActionExperiencePublicIndexIdentity,
    version: runtimeExecutiveActionExperiencePublicIndexVersion,
    namespace: runtimeExecutiveActionExperiencePublicIndexNamespace,
    layer: runtimeExecutiveActionExperiencePublicIndexLayer,
    capability: runtimeExecutiveActionExperiencePublicIndexCapability,
    phase: runtimeExecutiveActionExperiencePublicIndexPhase,
    status: CANONICAL_RELEASE_GATE.releaseStatus,
    architecturalRole:
      runtimeExecutiveActionExperiencePublicIndexArchitecturalRole,
    consumerRole: runtimeExecutiveActionExperiencePublicIndexConsumerRole,
    dependencyIdentity:
      runtimeExecutiveActionExperiencePublicIndexDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionExperiencePublicIndexDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperiencePublicIndexSupportedImportPath,
    upstreamVersion: runtimeExecutiveActionExperienceCertificationFreezeVersion,
    stabilityStatus: CANONICAL_RELEASE_GATE.stability,
    deterministicStatus:
      runtimeExecutiveActionExperiencePublicIndexDeterministic,
    sideEffectPolicy:
      runtimeExecutiveActionExperiencePublicIndexSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveActionExperiencePublicIndexMutationPolicy,
    releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
    certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
    compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
    lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
    platformLock: REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
    consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
  });

export const runtimeExecutiveActionExperienceConsumerInformation =
  Object.freeze({
    consumerRole: "SoleConsumerEntryPoint",
    supportedImportPath:
      runtimeExecutiveActionExperiencePublicIndexSupportedImportPath,
    releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
    stability: CANONICAL_RELEASE_GATE.stability,
    readiness: CANONICAL_RELEASE_GATE.consumerReadiness,
    certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
    compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
    lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
    platformLock: REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
    externalDispatchSupport: "NotProvided",
    providerRoutingSupport: "NotProvided",
    uiRenderingSupport: "NotProvided",
  }) as RuntimeExecutiveActionExperienceConsumerInformation;

export const runtimeExecutiveActionExperienceReleaseInformation =
  Object.freeze({
    release: CANONICAL_RELEASE_GATE.releaseStatus,
    certification: CANONICAL_RELEASE_GATE.certificationStatus,
    compatibility: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freeze: CANONICAL_RELEASE_GATE.freezeStatus,
    lock: CANONICAL_RELEASE_GATE.lockStatus,
    platformLock: REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
    stability: CANONICAL_RELEASE_GATE.stability,
    readiness: CANONICAL_RELEASE_GATE.consumerReadiness,
  });

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
  passed: boolean,
  reason: string,
): RuntimeExecutiveActionExperiencePublicIndexVerificationCheck {
  return Object.freeze({ id, passed, reason });
}

// ─── Registry (before verification — counts derived dynamically) ────────────

export const runtimeExecutiveActionExperiencePublicIndexRegistry =
  Object.freeze({
    identity: runtimeExecutiveActionExperiencePublicIndexIdentity,
    version: runtimeExecutiveActionExperiencePublicIndexVersion,
    namespace: runtimeExecutiveActionExperiencePublicIndexNamespace,
    layer: runtimeExecutiveActionExperiencePublicIndexLayer,
    capability: runtimeExecutiveActionExperiencePublicIndexCapability,
    phase: runtimeExecutiveActionExperiencePublicIndexPhase,
    status: CANONICAL_RELEASE_GATE.releaseStatus,
    architecturalRole:
      runtimeExecutiveActionExperiencePublicIndexArchitecturalRole,
    consumerRole: runtimeExecutiveActionExperiencePublicIndexConsumerRole,
    dependencyIdentity:
      runtimeExecutiveActionExperiencePublicIndexDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionExperiencePublicIndexDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperiencePublicIndexSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS.length,
    identityChain: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_COMPLETE_IDENTITY_CHAIN,
    identityChainCount:
      RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_COMPLETE_IDENTITY_CHAIN.length,
    approvedExports: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS,
    approvedExportCount:
      RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS.length,
    publicTypes: RUNTIME_EXECUTIVE_ACTION_PUBLIC_TYPE_NAMES,
    publicTypeCount: RUNTIME_EXECUTIVE_ACTION_PUBLIC_TYPE_NAMES.length,
    publicApis: Object.freeze([
      ...RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS,
      ...RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PUBLICATION_APIS,
    ]),
    publicApiCount:
      RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS.length +
      RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PUBLICATION_APIS.length,
    functionalApiCount: RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS.length,
    publicationApiCount:
      RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PUBLICATION_APIS.length,
    validationApiCount: RUNTIME_EXECUTIVE_ACTION_PUBLIC_VALIDATION_APIS.length,
    certificationPublicationApiCount:
      RUNTIME_EXECUTIVE_ACTION_PUBLIC_CERTIFICATION_PUBLICATION_APIS.length,
    consumerGuarantees:
      RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_GUARANTEES,
    consumerGuaranteeCount:
      RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_GUARANTEES.length,
    releaseInformation: runtimeExecutiveActionExperienceReleaseInformation,
    consumerInformation: runtimeExecutiveActionExperienceConsumerInformation,
    platformLock: REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
    presentationStates: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
    actionKinds: RUNTIME_EXECUTIVE_ACTION_KINDS,
    intentKinds: RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
    lifecycleStates: RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
    priorities: RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
    confirmationStatuses: RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
    safetyStatuses: RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
    orchestrationPhases: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
    frozenInvariants: RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS,
    frozenGuarantees: RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES,
  });

// ─── Nine namespace sections ─────────────────────────────────────────────────

const identitySection = Object.freeze({
  identity: runtimeExecutiveActionExperiencePublicIndexIdentity,
  version: runtimeExecutiveActionExperiencePublicIndexVersion,
  namespace: runtimeExecutiveActionExperiencePublicIndexNamespace,
  phase: runtimeExecutiveActionExperiencePublicIndexPhase,
  consumerRole: runtimeExecutiveActionExperiencePublicIndexConsumerRole,
  immediateDependency:
    runtimeExecutiveActionExperiencePublicIndexDependencyIdentity,
  supportedImportPath:
    runtimeExecutiveActionExperiencePublicIndexSupportedImportPath,
});

const publicTypesSection = Object.freeze({
  typeNames: RUNTIME_EXECUTIVE_ACTION_PUBLIC_TYPE_NAMES,
  typeCount: RUNTIME_EXECUTIVE_ACTION_PUBLIC_TYPE_NAMES.length,
});

const publicApisSection = Object.freeze({
  functionalApis: RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS,
  publicationApis: RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PUBLICATION_APIS,
  apiCount:
    RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS.length +
    RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PUBLICATION_APIS.length,
});

const validationSection = Object.freeze({
  validationApis: RUNTIME_EXECUTIVE_ACTION_PUBLIC_VALIDATION_APIS,
  validationApiCount: RUNTIME_EXECUTIVE_ACTION_PUBLIC_VALIDATION_APIS.length,
});

const certificationSection = Object.freeze({
  certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
  freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
  lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
  platformLock: REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
  certificationPublicationApis:
    RUNTIME_EXECUTIVE_ACTION_PUBLIC_CERTIFICATION_PUBLICATION_APIS,
  certificationPublicationApiCount:
    RUNTIME_EXECUTIVE_ACTION_PUBLIC_CERTIFICATION_PUBLICATION_APIS.length,
});

const releaseInformationSection = Object.freeze({
  ...runtimeExecutiveActionExperienceReleaseInformation,
});

const compatibilitySection = Object.freeze({
  compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
  overallStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
});

const registrySection = Object.freeze({
  sectionCount: runtimeExecutiveActionExperiencePublicIndexRegistry.sectionCount,
  approvedExportCount:
    runtimeExecutiveActionExperiencePublicIndexRegistry.approvedExportCount,
  publicTypeCount:
    runtimeExecutiveActionExperiencePublicIndexRegistry.publicTypeCount,
  publicApiCount:
    runtimeExecutiveActionExperiencePublicIndexRegistry.publicApiCount,
  consumerGuaranteeCount:
    runtimeExecutiveActionExperiencePublicIndexRegistry.consumerGuaranteeCount,
  identityChainCount:
    runtimeExecutiveActionExperiencePublicIndexRegistry.identityChainCount,
});

const consumerInformationSection = Object.freeze({
  ...runtimeExecutiveActionExperienceConsumerInformation,
});

/**
 * Immutable ordered nine-section Public Index namespace.
 * Keys match RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS exactly.
 */
export const runtimeExecutiveActionExperiencePublicIndex = Object.freeze({
  Identity: identitySection,
  PublicTypes: publicTypesSection,
  PublicAPIs: publicApisSection,
  Validation: validationSection,
  Certification: certificationSection,
  ReleaseInformation: releaseInformationSection,
  Compatibility: compatibilitySection,
  Registry: registrySection,
  ConsumerInformation: consumerInformationSection,
});

export const runtimeExecutiveActionExperiencePublicIndexModule = Object.freeze({
  phase: "PublicIndex" as const,
  name: "RuntimeExecutiveActionExperiencePublicIndex" as const,
  identity: runtimeExecutiveActionExperiencePublicIndexIdentity,
  version: runtimeExecutiveActionExperiencePublicIndexVersion,
  namespace: runtimeExecutiveActionExperiencePublicIndexNamespace,
  layer: runtimeExecutiveActionExperiencePublicIndexLayer,
  capability: runtimeExecutiveActionExperiencePublicIndexCapability,
  architecturalRole:
    runtimeExecutiveActionExperiencePublicIndexArchitecturalRole,
  consumerRole: runtimeExecutiveActionExperiencePublicIndexConsumerRole,
  role: "SoleConsumerEntryPoint" as const,
  status: CANONICAL_RELEASE_GATE.releaseStatus,
  releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
  certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
  compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
  freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
  lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
  stability: CANONICAL_RELEASE_GATE.stability,
  consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
  upstreamDependency:
    runtimeExecutiveActionExperiencePublicIndexDependencyIdentity,
  dependencyPath: runtimeExecutiveActionExperiencePublicIndexDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionExperiencePublicIndexSupportedImportPath,
  deterministic: runtimeExecutiveActionExperiencePublicIndexDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  released: CANONICAL_RELEASE_GATE.gatePassed,
  certified: CANONICAL_RELEASE_GATE.gatePassed,
  compatible: CANONICAL_RELEASE_GATE.gatePassed,
  frozen: CANONICAL_RELEASE_GATE.gatePassed,
  locked: CANONICAL_RELEASE_GATE.gatePassed,
  stable: CANONICAL_RELEASE_GATE.gatePassed,
  readyForConsumer: CANONICAL_RELEASE_GATE.gatePassed,
  soleConsumerEntryPoint: true as const,
  platformLock: REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
  principle: RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_BOUNDARY,
  identityChain: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_COMPLETE_IDENTITY_CHAIN,
  consumerGuarantees: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_GUARANTEES,
  consumerInformation: runtimeExecutiveActionExperienceConsumerInformation,
  releaseInformation: runtimeExecutiveActionExperienceReleaseInformation,
  approvedExports: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS,
  publicTypes: RUNTIME_EXECUTIVE_ACTION_PUBLIC_TYPE_NAMES,
  publicFunctionalApis: RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS,
  publicationApis: RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PUBLICATION_APIS,
  publicIndex: runtimeExecutiveActionExperiencePublicIndex,
  registry: runtimeExecutiveActionExperiencePublicIndexRegistry,
  certificationFreeze: runtimeExecutiveActionExperienceCertificationFreeze,
  certificationFreezeBoundary: "REX-5:8-certification-freeze-only" as const,
  architecturalStatus:
    "REX-5:9 Runtime Executive Action Experience Public Index — RELEASED / CERTIFIED / COMPATIBLE / FROZEN / LOCKED / STABLE / READY FOR CONSUMER" as const,
});

// ─── Public Index APIs ──────────────────────────────────────────────────────

export function getRuntimeExecutiveActionExperiencePublicIndexIdentity():
  typeof runtimeExecutiveActionExperiencePublicIndexCanonicalIdentity {
  return runtimeExecutiveActionExperiencePublicIndexCanonicalIdentity;
}

export function getRuntimeExecutiveActionExperienceConsumerInformation():
  typeof runtimeExecutiveActionExperienceConsumerInformation {
  return runtimeExecutiveActionExperienceConsumerInformation;
}

export function getRuntimeExecutiveActionExperiencePublicIndexRegistry():
  typeof runtimeExecutiveActionExperiencePublicIndexRegistry {
  return runtimeExecutiveActionExperiencePublicIndexRegistry;
}

/**
 * Deterministic Public Index structural verification.
 * Publication-level only — does not alter Action runtime behavior.
 */
export function verifyRuntimeExecutiveActionExperiencePublicIndex():
  RuntimeExecutiveActionExperiencePublicIndexVerification {
  const certification = verifyRuntimeExecutiveActionExperienceCertification();
  const compatibility = verifyRuntimeExecutiveActionExperienceCompatibility();
  const freeze = verifyRuntimeExecutiveActionExperienceFreeze();
  const registry = runtimeExecutiveActionExperiencePublicIndexRegistry;

  const approvedFunctionalApisPresent =
    RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS.every((name) =>
      (
        RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS as readonly string[]
      ).includes(name),
    );

  const checks = freezeArray([
    check(
      "identity-exact",
      runtimeExecutiveActionExperiencePublicIndexIdentity ===
        "REX-5:9/RuntimeExecutiveActionExperiencePublicIndex" &&
        runtimeExecutiveActionExperiencePublicIndexVersion === "5.9.0" &&
        runtimeExecutiveActionExperiencePublicIndexNamespace ===
          "nexora.rex.action-experience.public-index",
      "Public Index identity/version/namespace are exact",
    ),
    check(
      "sole-dependency",
      runtimeExecutiveActionExperiencePublicIndexDependencyIdentity ===
        "REX-5:8/RuntimeExecutiveActionExperienceCertificationFreeze" &&
        RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_BOUNDARY
          .consumesCertificationFreezeOnly === true,
      "Sole immediate dependency is REX-5:8",
    ),
    check(
      "supported-import-path",
      runtimeExecutiveActionExperiencePublicIndexSupportedImportPath ===
        "@/app/lib/rex/runtimeExecutiveActionExperiencePublicIndex",
      "Supported consumer import path is exact",
    ),
    check(
      "consumer-role",
      runtimeExecutiveActionExperiencePublicIndexConsumerRole ===
        "SoleConsumerEntryPoint",
      "Consumer role is SoleConsumerEntryPoint",
    ),
    check(
      "release-status",
      CANONICAL_RELEASE_GATE.releaseStatus === "Released" &&
        runtimeExecutiveActionExperienceReleaseInformation.release ===
          "Released",
      "Release status is Released",
    ),
    check(
      "certification-preserved",
      certification.status === "certified" &&
        CANONICAL_RELEASE_GATE.certificationStatus === "Certified",
      "Upstream certification remains certified",
    ),
    check(
      "compatibility-preserved",
      compatibility.status === "compatible" &&
        freeze.frozenCompatibility === "compatible" &&
        CANONICAL_RELEASE_GATE.compatibilityStatus === "Compatible",
      "Upstream compatibility remains compatible",
    ),
    check(
      "freeze-preserved",
      freeze.freezeStatus === "frozen" &&
        CANONICAL_RELEASE_GATE.freezeStatus === "Frozen",
      "Upstream freeze remains frozen",
    ),
    check(
      "lock-preserved",
      freeze.lockStatus === "locked" &&
        freeze.lock ===
          "REX-5-RUNTIME-EXECUTIVE-ACTION-EXPERIENCE-PLATFORM-LOCKED" &&
        getRuntimeExecutiveActionExperiencePlatformLock() ===
          REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
      "Exact platform lock is preserved",
    ),
    check(
      "stability-stable",
      CANONICAL_RELEASE_GATE.stability === "Stable",
      "Stability is Stable",
    ),
    check(
      "consumer-readiness",
      CANONICAL_RELEASE_GATE.consumerReadiness === "ReadyForConsumer" &&
        runtimeExecutiveActionExperienceConsumerInformation.readiness ===
          "ReadyForConsumer",
      "Consumer readiness is ReadyForConsumer",
    ),
    check(
      "namespace-sections",
      exactOrder(
        [...RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS],
        [
          "Identity",
          "PublicTypes",
          "PublicAPIs",
          "Validation",
          "Certification",
          "ReleaseInformation",
          "Compatibility",
          "Registry",
          "ConsumerInformation",
        ],
      ) &&
        RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS.length === 9 &&
        exactOrder(
          Object.keys(runtimeExecutiveActionExperiencePublicIndex),
          [...RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS],
        ),
      "Exactly nine ordered namespace sections exist",
    ),
    check(
      "identity-chain",
      exactOrder(
        [...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_COMPLETE_IDENTITY_CHAIN],
        [
          "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
          "REX-5:2/RuntimeExecutiveActionExperienceContracts",
          "REX-5:3/RuntimeExecutiveActionIntentContext",
          "REX-5:4/RuntimeExecutiveActionPresentationPreview",
          "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
          "REX-5:6/RuntimeExecutiveActionOrchestration",
          "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
          "REX-5:8/RuntimeExecutiveActionExperienceCertificationFreeze",
          "REX-5:9/RuntimeExecutiveActionExperiencePublicIndex",
        ],
      ),
      "Complete REX-5:1 → REX-5:9 identity chain is ordered",
    ),
    check(
      "approved-exports",
      unique([...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS]) &&
        approvedFunctionalApisPresent,
      "Public APIs are approved frozen exports only",
    ),
    check(
      "registry-integrity",
      registry.sectionCount === 9 &&
        unique([...registry.sections]) &&
        registry.approvedExportCount ===
          RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS.length &&
        registry.publicTypeCount ===
          RUNTIME_EXECUTIVE_ACTION_PUBLIC_TYPE_NAMES.length &&
        registry.publicApiCount ===
          RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS.length +
            RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_PUBLICATION_APIS.length &&
        registry.consumerGuaranteeCount ===
          RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_GUARANTEES.length &&
        unique([...RUNTIME_EXECUTIVE_ACTION_PUBLIC_TYPE_NAMES]) &&
        unique([...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CONSUMER_GUARANTEES]) &&
        unique([...RUNTIME_EXECUTIVE_ACTION_PUBLIC_FUNCTIONAL_APIS]),
      "Registry counts and uniqueness hold",
    ),
    check(
      "presentation-states",
      exactOrder([...RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES], [
        "minimum",
        "report",
        "operation",
      ]),
      "Presentation states remain minimum/report/operation",
    ),
    check(
      "confirmation-gate",
      !canTransitionRuntimeExecutiveActionOrchestration({
        from: "confirmation",
        to: "prepared-for-dispatch",
        operation: "advance",
      }) &&
        canTransitionRuntimeExecutiveActionOrchestration({
          from: "confirmation",
          to: "prepared-for-dispatch",
          operation: "confirm",
        }),
      "Explicit confirmation gate remains mandatory",
    ),
    check(
      "no-phase-skipping",
      !canTransitionRuntimeExecutiveActionOrchestration({
        from: "proposal",
        to: "prepared-for-dispatch",
        operation: "advance",
      }) &&
        !canTransitionRuntimeExecutiveActionOrchestration({
          from: "preview",
          to: "prepared-for-dispatch",
          operation: "advance",
        }),
      "Phase skipping remains forbidden",
    ),
    check(
      "external-dispatch-absent",
      RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_BOUNDARY.introducesDispatch ===
        false &&
        runtimeExecutiveActionExperienceConsumerInformation
          .externalDispatchSupport === "NotProvided" &&
        runtimeExecutiveActionExperienceConsumerInformation
          .providerRoutingSupport === "NotProvided",
      "External dispatch and provider routing remain NotProvided",
    ),
    check(
      "immutability",
      Object.isFrozen(
        RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_NAMESPACE_SECTIONS,
      ) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS) &&
        Object.isFrozen(runtimeExecutiveActionExperiencePublicIndexRegistry) &&
        Object.isFrozen(runtimeExecutiveActionExperienceConsumerInformation) &&
        Object.isFrozen(runtimeExecutiveActionExperiencePublicIndex),
      "Public Index metadata remains immutable",
    ),
    check(
      "determinism",
      runtimeExecutiveActionExperiencePublicIndexDeterministic === true &&
        runtimeExecutiveActionExperienceCertificationFreeze.deterministic ===
          true,
      "Public Index and upstream certification remain deterministic",
    ),
  ]);

  const passedCheckCount = checks.filter((entry) => entry.passed).length;
  const failedCheckCount = checks.length - passedCheckCount;
  const issues = freezeArray(
    checks.filter((entry) => !entry.passed).map((entry) => entry.id),
  );

  return Object.freeze({
    valid: failedCheckCount === 0,
    checks,
    passedCheckCount,
    failedCheckCount,
    issues,
    readyForConsumer: failedCheckCount === 0,
  });
}
