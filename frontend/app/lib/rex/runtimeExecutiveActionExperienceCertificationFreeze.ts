/**
 * REX-5:8 — Runtime Executive Action Experience Certification & Freeze.
 *
 * Certifies, compatibility-checks, freezes, and locks the completed
 * REX-5:7 Action Experience Platform before REX-5:9 Public Index.
 *
 * Canonical flow:
 *   REX-5:7 Platform → Certification → Compatibility → Freeze → Lock
 *     → Ready for REX-5:9 Public Index
 *
 * Certification ≠ Behavior Change. Freeze ≠ Reimplementation.
 * Lock ≠ External Dispatch.
 *
 * No new action semantics. No UI. No AI. No provider integration. No dispatch.
 */

import {
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_BOUNDARY,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_PUBLIC_TYPE_NAMES,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS,
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
  createRuntimeExecutiveActionExperiencePlatformSnapshot,
  createRuntimeExecutiveActionOrchestrationSnapshot,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionConfirmationReadiness,
  evaluateRuntimeExecutiveActionExperience,
  evaluateRuntimeExecutiveActionOrchestration,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  evaluateRuntimeExecutiveActionSafety,
  getRuntimeExecutiveActionExperiencePlatform,
  getRuntimeExecutiveActionExperiencePlatformCapabilities,
  getRuntimeExecutiveActionExperiencePlatformGuarantees,
  getRuntimeExecutiveActionExperiencePlatformIdentity,
  getRuntimeExecutiveActionExperiencePlatformRegistry,
  hasRuntimeExecutiveActionChangedSincePreview,
  orchestrateRuntimeExecutiveAction,
  resolveRuntimeExecutiveActionConfirmation,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionExperiencePlatform,
  runtimeExecutiveActionExperiencePlatformApiNames,
  runtimeExecutiveActionExperiencePlatformCanonicalIdentity,
  runtimeExecutiveActionExperiencePlatformConsumerInformation,
  runtimeExecutiveActionExperiencePlatformIdentity,
  runtimeExecutiveActionExperiencePlatformNamespace,
  runtimeExecutiveActionExperiencePlatformRegistry,
  runtimeExecutiveActionExperiencePlatformSupportedImportPath,
  runtimeExecutiveActionExperiencePlatformVersion,
  verifyRuntimeExecutiveActionConfirmationSafety,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionExperiencePlatform,
  verifyRuntimeExecutiveActionExperiencePlatformCompatibility,
  verifyRuntimeExecutiveActionExperiencePlatformConsumerReadiness,
  verifyRuntimeExecutiveActionExperiencePlatformInvariants,
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
} from "@/app/lib/rex/runtimeExecutiveActionExperiencePlatform";

// ─── Approved re-exports for REX-5:9 (no behavior change) ───────────────────

export {
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES,
  RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_INVARIANTS,
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
  createRuntimeExecutiveActionExperiencePlatformSnapshot,
  createRuntimeExecutiveActionOrchestrationSnapshot,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionConfirmationReadiness,
  evaluateRuntimeExecutiveActionExperience,
  evaluateRuntimeExecutiveActionOrchestration,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  evaluateRuntimeExecutiveActionSafety,
  getRuntimeExecutiveActionExperiencePlatform,
  getRuntimeExecutiveActionExperiencePlatformCapabilities,
  getRuntimeExecutiveActionExperiencePlatformGuarantees,
  getRuntimeExecutiveActionExperiencePlatformIdentity,
  getRuntimeExecutiveActionExperiencePlatformRegistry,
  hasRuntimeExecutiveActionChangedSincePreview,
  orchestrateRuntimeExecutiveAction,
  resolveRuntimeExecutiveActionConfirmation,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  verifyRuntimeExecutiveActionConfirmationSafety,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionExperiencePlatform,
  verifyRuntimeExecutiveActionExperiencePlatformCompatibility,
  verifyRuntimeExecutiveActionExperiencePlatformConsumerReadiness,
  verifyRuntimeExecutiveActionExperiencePlatformInvariants,
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

export const runtimeExecutiveActionExperienceCertificationFreezeIdentity =
  "REX-5:8/RuntimeExecutiveActionExperienceCertificationFreeze" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeVersion =
  "5.8.0" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeNamespace =
  "nexora.rex.action-experience.certification-freeze" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeLayer =
  "REX" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeCapability =
  "RuntimeExecutiveActionExperience" as const;

export const runtimeExecutiveActionExperienceCertificationFreezePhase =
  "CertificationFreeze" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeStatus =
  "ReadyForPublicIndex" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeArchitecturalRole =
  "RuntimeExecutiveActionExperienceCertificationFreeze" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeConsumerRole =
  "FrozenPrePublicIndexSurface" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeDependencyIdentity =
  runtimeExecutiveActionExperiencePlatformIdentity;

export const runtimeExecutiveActionExperienceCertificationFreezeDependencyPath =
  runtimeExecutiveActionExperiencePlatformSupportedImportPath;

export const runtimeExecutiveActionExperienceCertificationFreezeSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveActionExperienceCertificationFreeze" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeStability =
  "CertifiedFrozen" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeDeterministic =
  true as const;

export const runtimeExecutiveActionExperienceCertificationFreezeSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeMutationPolicy =
  "immutable" as const;

/** Exact immutable platform lock constant. */
export const REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED =
  "REX-5-RUNTIME-EXECUTIVE-ACTION-EXPERIENCE-PLATFORM-LOCKED" as const;

export const runtimeExecutiveActionExperienceCertificationFreezeCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveActionExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveActionExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveActionExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveActionExperienceCertificationFreezeLayer,
    capability: runtimeExecutiveActionExperienceCertificationFreezeCapability,
    phase: runtimeExecutiveActionExperienceCertificationFreezePhase,
    status: runtimeExecutiveActionExperienceCertificationFreezeStatus,
    architecturalRole:
      runtimeExecutiveActionExperienceCertificationFreezeArchitecturalRole,
    consumerRole:
      runtimeExecutiveActionExperienceCertificationFreezeConsumerRole,
    dependencyIdentity:
      runtimeExecutiveActionExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperienceCertificationFreezeSupportedImportPath,
    upstreamVersion: runtimeExecutiveActionExperiencePlatformVersion,
    stabilityStatus:
      runtimeExecutiveActionExperienceCertificationFreezeStability,
    deterministicStatus:
      runtimeExecutiveActionExperienceCertificationFreezeDeterministic,
    sideEffectPolicy:
      runtimeExecutiveActionExperienceCertificationFreezeSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveActionExperienceCertificationFreezeMutationPolicy,
    certificationStatus: "certified" as const,
    compatibilityStatus: "compatible" as const,
    freezeStatus: "frozen" as const,
    lockStatus: "locked" as const,
    platformLock: REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
    readiness: "ready-for-public-index" as const,
  });

export const RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_FREEZE_PRINCIPLE =
  "Certification ≠ Behavior Change. Freeze ≠ Reimplementation. Lock ≠ External Dispatch. REX-5:8 certifies the exact REX-5:7 platform surface." as const;

export const RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_FREEZE_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    certificationAuthority: "REX-5:8" as const,
    architecturalRole:
      "RuntimeExecutiveActionExperienceCertificationFreeze" as const,
    consumerRole: "FrozenPrePublicIndexSurface" as const,
    soleImmediateDependency:
      "REX-5:7/RuntimeExecutiveActionExperiencePlatform" as const,
    consumesPlatformOnly: true as const,
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
    aiIndependent: true as const,
    introducesRuntimeBehavior: false as const,
    modifiesPlatformBehavior: false as const,
    introducesDispatch: false as const,
    isFinalPublicConsumerIndex: false as const,
    isReleased: false as const,
    preparesPublicIndex: true as const,
  });

// ─── Status vocabularies ────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_STATUSES = Object.freeze([
  "certified",
  "not-certified",
] as const);

export type RuntimeExecutiveActionExperienceCertificationStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_FREEZE_STATUSES = Object.freeze([
  "frozen",
  "not-frozen",
] as const);

export type RuntimeExecutiveActionExperienceFreezeStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_FREEZE_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_LOCK_STATUSES = Object.freeze([
  "locked",
  "unlocked",
] as const);

export type RuntimeExecutiveActionExperienceLockStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_LOCK_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_COMPATIBILITY_STATUSES = Object.freeze([
  "compatible",
  "incompatible",
] as const);

export type RuntimeExecutiveActionExperienceCompatibilityStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_COMPATIBILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_READINESS = Object.freeze([
  "ready-for-public-index",
  "not-ready-for-public-index",
] as const);

export type RuntimeExecutiveActionExperiencePublicIndexReadiness =
  (typeof RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_READINESS)[number];

export const RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_SEVERITIES = Object.freeze([
  "warning",
  "error",
  "critical",
] as const);

export type RuntimeExecutiveActionExperienceCertificationSeverity =
  (typeof RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_SEVERITIES)[number];

// ─── Domains / issue codes ──────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_DOMAINS = Object.freeze([
  "Identity",
  "DependencyChain",
  "Foundation",
  "Contracts",
  "IntentContext",
  "PresentationPreview",
  "ConfirmationSafety",
  "Orchestration",
  "DispatchBoundary",
  "PlatformCapabilities",
  "PlatformRegistry",
  "PlatformInvariants",
  "PlatformGuarantees",
  "Compatibility",
  "Immutability",
  "Determinism",
  "RendererIndependence",
  "ProviderIndependence",
  "ExternalDispatchAbsence",
] as const);

export type RuntimeExecutiveActionExperienceCertificationDomain =
  (typeof RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_DOMAINS)[number];

export const RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_ISSUE_CODES = Object.freeze([
  "identity-mismatch",
  "dependency-chain-invalid",
  "capability-missing",
  "registry-invalid",
  "invariant-failed",
  "guarantee-missing",
  "compatibility-failed",
  "immutability-failed",
  "determinism-failed",
  "confirmation-gate-bypassed",
  "scope-stability-failed",
  "phase-order-invalid",
  "dispatch-boundary-violated",
  "provider-neutrality-violated",
  "renderer-independence-violated",
  "ai-independence-violated",
  "external-dispatch-detected",
] as const);

export type RuntimeExecutiveActionExperienceCertificationIssueCode =
  (typeof RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_ISSUE_CODES)[number];

// ─── Frozen invariants / guarantees ─────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANT_IDS = Object.freeze([
  "sole-immediate-dependency",
  "canonical-identity-chain",
  "foundation-preserved",
  "contracts-preserved",
  "subject-target-recipient-separated",
  "action-kind-intent-separated",
  "explicit-intent-precedence",
  "ambiguity-preserved",
  "minimum-report-operation-preserved",
  "explicit-confirmation-required",
  "auto-confirmation-forbidden",
  "scope-stability-required",
  "critical-action-review-preserved",
  "decline-cancel-separated",
  "orchestration-phase-order-preserved",
  "phase-skipping-forbidden",
  "downstream-eligibility-confirmation-gated",
  "dispatch-request-provider-neutral",
  "dispatch-request-not-execution",
  "external-dispatch-absent",
  "renderer-independent",
  "AI-independent",
  "transport-independent",
  "immutable",
  "deterministic",
] as const);

export type RuntimeExecutiveActionExperienceFrozenInvariantId =
  (typeof RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANT_IDS)[number];

export interface RuntimeExecutiveActionExperienceFrozenInvariant {
  readonly id: RuntimeExecutiveActionExperienceFrozenInvariantId;
  readonly domain: RuntimeExecutiveActionExperienceCertificationDomain;
  readonly description: string;
  readonly status: "enforced";
}

export const RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS = Object.freeze(
  RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANT_IDS.map((id) =>
    Object.freeze({
      id,
      domain: domainForInvariant(id),
      description: `Frozen invariant enforced: ${id}`,
      status: "enforced" as const,
    }),
  ),
) as ReadonlyArray<RuntimeExecutiveActionExperienceFrozenInvariant>;

function domainForInvariant(
  id: RuntimeExecutiveActionExperienceFrozenInvariantId,
): RuntimeExecutiveActionExperienceCertificationDomain {
  switch (id) {
    case "sole-immediate-dependency":
    case "canonical-identity-chain":
      return "DependencyChain";
    case "foundation-preserved":
      return "Foundation";
    case "contracts-preserved":
    case "subject-target-recipient-separated":
    case "action-kind-intent-separated":
      return "Contracts";
    case "explicit-intent-precedence":
    case "ambiguity-preserved":
      return "IntentContext";
    case "minimum-report-operation-preserved":
      return "PresentationPreview";
    case "explicit-confirmation-required":
    case "auto-confirmation-forbidden":
    case "scope-stability-required":
    case "critical-action-review-preserved":
    case "decline-cancel-separated":
      return "ConfirmationSafety";
    case "orchestration-phase-order-preserved":
    case "phase-skipping-forbidden":
    case "downstream-eligibility-confirmation-gated":
      return "Orchestration";
    case "dispatch-request-provider-neutral":
    case "dispatch-request-not-execution":
    case "external-dispatch-absent":
      return "DispatchBoundary";
    case "renderer-independent":
      return "RendererIndependence";
    case "AI-independent":
      return "ProviderIndependence";
    case "transport-independent":
      return "ProviderIndependence";
    case "immutable":
      return "Immutability";
    case "deterministic":
      return "Determinism";
    default:
      return "PlatformInvariants";
  }
}

export const RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES = Object.freeze([
  "certified",
  "compatible",
  "frozen",
  "locked",
  "behavior-preserving",
  "platform-aligned",
  "invariant-enforced",
  "confirmation-gated",
  "scope-stable",
  "phase-order-preserved",
  "provider-neutral",
  "renderer-independent",
  "AI-independent",
  "transport-independent",
  "immutable",
  "deterministic",
  "external-dispatch-free",
  "ready-for-public-index",
] as const);

export type RuntimeExecutiveActionExperienceFrozenGuarantee =
  (typeof RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES)[number];

// ─── Approved exports for REX-5:9 ───────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS =
  Object.freeze([
    // Identity
    "runtimeExecutiveActionExperienceCertificationFreezeIdentity",
    "runtimeExecutiveActionExperienceCertificationFreezeVersion",
    "runtimeExecutiveActionExperienceCertificationFreezeNamespace",
    "REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED",
    "getRuntimeExecutiveActionExperienceCertificationFreezeIdentity",
    // Platform identity chain / domain
    "RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN",
    "RUNTIME_EXECUTIVE_ACTION_KINDS",
    "RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS",
    "RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES",
    "RUNTIME_EXECUTIVE_ACTION_PRIORITIES",
    "RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES",
    "RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES",
    "RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES",
    "RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES",
    // Core APIs
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
    // Verification / certification / freeze
    "verifyRuntimeExecutiveActionExperiencePlatform",
    "verifyRuntimeExecutiveActionExperienceCompatibility",
    "verifyRuntimeExecutiveActionExperienceCertification",
    "verifyRuntimeExecutiveActionExperienceFreeze",
    "getRuntimeExecutiveActionExperienceCertificationFreezeRegistry",
    "getRuntimeExecutiveActionExperienceFreeze",
    "getRuntimeExecutiveActionExperiencePlatformLock",
    // Registry / consumer preparation
    "RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS",
    "RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS",
    "RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES",
    "runtimeExecutiveActionExperienceCertificationFreezeConsumerInformation",
  ] as const);

export type RuntimeExecutiveActionExperienceApprovedExport =
  (typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS)[number];

export const RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Certification",
    "CertificationDomains",
    "CertificationChecks",
    "Compatibility",
    "Freeze",
    "Lock",
    "FrozenInvariants",
    "FrozenGuarantees",
    "ApprovedExports",
    "PublicIndexReadiness",
    "ConsumerInformation",
  ] as const);

// ─── Models ─────────────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionExperienceCertificationCheck {
  readonly id: string;
  readonly domain: RuntimeExecutiveActionExperienceCertificationDomain;
  readonly passed: boolean;
  readonly reason: string;
  readonly severity?: RuntimeExecutiveActionExperienceCertificationSeverity;
}

export interface RuntimeExecutiveActionExperienceCertificationIssue {
  readonly code: RuntimeExecutiveActionExperienceCertificationIssueCode;
  readonly domain: RuntimeExecutiveActionExperienceCertificationDomain;
  readonly severity: RuntimeExecutiveActionExperienceCertificationSeverity;
  readonly message: string;
}

export interface RuntimeExecutiveActionExperienceCertificationResult {
  readonly status: RuntimeExecutiveActionExperienceCertificationStatus;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly checks: ReadonlyArray<RuntimeExecutiveActionExperienceCertificationCheck>;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionExperienceCertificationIssue>;
  readonly compatibility: RuntimeExecutiveActionExperienceCompatibilityStatus;
  readonly freeze: RuntimeExecutiveActionExperienceFreezeStatus;
  readonly lock: RuntimeExecutiveActionExperienceLockStatus;
  readonly platformLock: typeof REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED | "";
  readonly readyForPublicIndex: RuntimeExecutiveActionExperiencePublicIndexReadiness;
}

export interface RuntimeExecutiveActionExperienceCertification {
  readonly identity: typeof runtimeExecutiveActionExperienceCertificationFreezeIdentity;
  readonly version: typeof runtimeExecutiveActionExperienceCertificationFreezeVersion;
  readonly certificationStatus: RuntimeExecutiveActionExperienceCertificationStatus;
  readonly verification: RuntimeExecutiveActionExperienceCertificationResult;
  readonly compatibility: RuntimeExecutiveActionExperienceCompatibilityStatus;
  readonly freezeStatus: RuntimeExecutiveActionExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveActionExperienceLockStatus;
  readonly platformLock: typeof REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED | "";
  readonly passedChecks: ReadonlyArray<string>;
  readonly failedChecks: ReadonlyArray<string>;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionExperienceCertificationIssue>;
  readonly certifiedGuarantees: typeof RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES | ReadonlyArray<never>;
}

export interface RuntimeExecutiveActionExperienceFreeze {
  readonly freezeStatus: RuntimeExecutiveActionExperienceFreezeStatus;
  readonly frozenIdentity: typeof runtimeExecutiveActionExperiencePlatformIdentity;
  readonly frozenVersion: typeof runtimeExecutiveActionExperiencePlatformVersion;
  readonly frozenNamespace: typeof runtimeExecutiveActionExperiencePlatformNamespace;
  readonly lock: typeof REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED | "";
  readonly lockStatus: RuntimeExecutiveActionExperienceLockStatus;
  readonly frozenInvariants: typeof RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS;
  readonly frozenGuarantees: typeof RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES;
  readonly frozenCompatibility: RuntimeExecutiveActionExperienceCompatibilityStatus;
  readonly approvedExports: typeof RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS;
  readonly readyForPublicIndex: RuntimeExecutiveActionExperiencePublicIndexReadiness;
}

export interface RuntimeExecutiveActionExperienceCertificationFreezeConsumerInformation {
  readonly currentPhase: "CertificationFreeze";
  readonly status: "Certified";
  readonly compatibility: "Compatible";
  readonly freeze: "Frozen";
  readonly lock: "Locked";
  readonly nextPhase: "PublicIndex";
  readonly consumerReadiness: "ReadyForPublicIndex";
  readonly consumerRole: "FrozenPrePublicIndexSurface";
  readonly readyForConsumer: false;
  readonly released: false;
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

function collectionsDiffer(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return (
    left.length !== right.length || left.some((value, index) => value !== right[index])
  );
}

function check(
  id: string,
  domain: RuntimeExecutiveActionExperienceCertificationDomain,
  passed: boolean,
  reason: string,
  severity: RuntimeExecutiveActionExperienceCertificationSeverity = "critical",
): RuntimeExecutiveActionExperienceCertificationCheck {
  return Object.freeze({ id, domain, passed, reason, severity });
}

function issueFromCheck(
  entry: RuntimeExecutiveActionExperienceCertificationCheck,
): RuntimeExecutiveActionExperienceCertificationIssue | undefined {
  if (entry.passed) return undefined;
  const codeMap: Record<
    string,
    RuntimeExecutiveActionExperienceCertificationIssueCode
  > = {
    "identity-platform": "identity-mismatch",
    "identity-chain": "dependency-chain-invalid",
    "dependency-sole": "dependency-chain-invalid",
    "capability-coverage": "capability-missing",
    "registry-integrity": "registry-invalid",
    "invariants-enforced": "invariant-failed",
    "guarantees-present": "guarantee-missing",
    "compatibility-compatible": "compatibility-failed",
    "immutability": "immutability-failed",
    "determinism": "determinism-failed",
    "confirmation-gate": "confirmation-gate-bypassed",
    "auto-confirmation-forbidden": "confirmation-gate-bypassed",
    "scope-stability": "scope-stability-failed",
    "phase-order": "phase-order-invalid",
    "phase-skipping-forbidden": "phase-order-invalid",
    "dispatch-boundary": "dispatch-boundary-violated",
    "provider-neutrality": "provider-neutrality-violated",
    "renderer-independence": "renderer-independence-violated",
    "ai-independence": "ai-independence-violated",
    "external-dispatch-absent": "external-dispatch-detected",
  };
  return Object.freeze({
    code: codeMap[entry.id] ?? "invariant-failed",
    domain: entry.domain,
    severity: entry.severity ?? "critical",
    message: entry.reason,
  });
}

// ─── Certification checks (deterministic ordered registry) ──────────────────

function buildCertificationChecks(): ReadonlyArray<RuntimeExecutiveActionExperienceCertificationCheck> {
  const platformVerification = verifyRuntimeExecutiveActionExperiencePlatform();
  const platformCompatibility =
    verifyRuntimeExecutiveActionExperiencePlatformCompatibility();
  const platformInvariants =
    verifyRuntimeExecutiveActionExperiencePlatformInvariants();
  const foundation = verifyRuntimeExecutiveActionExperienceFoundation();
  const contracts = verifyRuntimeExecutiveActionExperienceContracts();
  const intent = verifyRuntimeExecutiveActionIntentContext();
  const preview = verifyRuntimeExecutiveActionPresentationPreview();
  const confirmation = verifyRuntimeExecutiveActionConfirmationSafety();
  const orchestration = verifyRuntimeExecutiveActionOrchestration();
  const registry = getRuntimeExecutiveActionExperiencePlatformRegistry();
  const boundary = RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_BOUNDARY;

  const identityChainWithEight = freezeArray([
    ...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN,
    runtimeExecutiveActionExperienceCertificationFreezeIdentity,
  ]);

  // Action kind and intent remain independently addressable vocabularies
  // (they may share some string labels by design, but are not collapsed).
  const kindsAreSeparateCollections =
    collectionsDiffer(
      RUNTIME_EXECUTIVE_ACTION_KINDS,
      RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
    ) &&
    RUNTIME_EXECUTIVE_ACTION_KINDS[0] === "request" &&
    RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS[0] === "inform";

  const draft = createRuntimeExecutiveActionDraft({
    kind: "request",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    target: {
      kind: "team",
      id: "team.engineering",
      label: "Engineering Team",
    },
    recipient: {
      kind: "role",
      id: "role.engineering-lead",
      label: "Engineering Lead",
    },
    intent: { kind: "request-information" },
    title: "Request Update",
  });

  const subjectTargetRecipientSeparated =
    draft.subject?.id !== draft.target?.id &&
    draft.target?.id !== draft.recipient?.id &&
    draft.subject?.id !== draft.recipient?.id;

  const ambiguous = resolveRuntimeExecutiveActionIntentContext({
    kind: "send",
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    title: "Send",
  });

  const scopeA = Object.freeze({
    actionKind: "request",
    subjectId: "object.project-alpha",
    recipientId: "role.engineering-lead",
    intent: "request-information",
    priority: "high",
    reason: "Schedule risk increasing",
    consequence: "This action will request an update.",
    lifecycle: "pending-confirmation",
    title: "Request Update",
  });
  const fp1 = createRuntimeExecutiveActionConfirmationFingerprint(scopeA);
  const fp2 = createRuntimeExecutiveActionConfirmationFingerprint(scopeA);
  const scopeChanged = hasRuntimeExecutiveActionChangedSincePreview({
    expectedFingerprint: fp1.value,
    currentFingerprint: createRuntimeExecutiveActionConfirmationFingerprint(
      Object.freeze({
        ...scopeA,
        recipientId: "role.operations-lead",
      }),
    ),
  });

  return freezeArray([
    check(
      "identity-platform",
      "Identity",
      runtimeExecutiveActionExperiencePlatformIdentity ===
        "REX-5:7/RuntimeExecutiveActionExperiencePlatform" &&
        runtimeExecutiveActionExperiencePlatformVersion === "5.7.0" &&
        runtimeExecutiveActionExperiencePlatformNamespace ===
          "nexora.rex.action-experience.platform" &&
        platformVerification.status === "valid",
      "Upstream platform identity/version/namespace are exact and valid",
    ),
    check(
      "dependency-sole",
      "DependencyChain",
      runtimeExecutiveActionExperienceCertificationFreezeDependencyIdentity ===
        "REX-5:7/RuntimeExecutiveActionExperiencePlatform" &&
        RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_FREEZE_BOUNDARY
          .consumesPlatformOnly === true,
      "Sole immediate dependency is REX-5:7 platform",
    ),
    check(
      "identity-chain",
      "DependencyChain",
      exactOrder([...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN], [
        "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
        "REX-5:2/RuntimeExecutiveActionExperienceContracts",
        "REX-5:3/RuntimeExecutiveActionIntentContext",
        "REX-5:4/RuntimeExecutiveActionPresentationPreview",
        "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
        "REX-5:6/RuntimeExecutiveActionOrchestration",
        "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
      ]) &&
        exactOrder([...identityChainWithEight], [
          "REX-5:1/RuntimeExecutiveActionExperienceFoundation",
          "REX-5:2/RuntimeExecutiveActionExperienceContracts",
          "REX-5:3/RuntimeExecutiveActionIntentContext",
          "REX-5:4/RuntimeExecutiveActionPresentationPreview",
          "REX-5:5/RuntimeExecutiveActionConfirmationSafety",
          "REX-5:6/RuntimeExecutiveActionOrchestration",
          "REX-5:7/RuntimeExecutiveActionExperiencePlatform",
          "REX-5:8/RuntimeExecutiveActionExperienceCertificationFreeze",
        ]),
      "Identity chain is ordered REX-5:1 → REX-5:8",
    ),
    check(
      "foundation-preserved",
      "Foundation",
      foundation.ok === true &&
        RUNTIME_EXECUTIVE_ACTION_KINDS.includes("request") &&
        RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES.includes(
          "pending-confirmation",
        ),
      "Foundation semantics remain available and verified",
    ),
    check(
      "contracts-preserved",
      "Contracts",
      contracts.ok === true &&
        typeof evaluateRuntimeExecutiveActionProposalContract === "function" &&
        typeof evaluateRuntimeExecutiveActionPreparationContract ===
          "function",
      "Contract evaluation surface remains intact",
    ),
    check(
      "subject-target-recipient-separated",
      "Contracts",
      subjectTargetRecipientSeparated,
      "Subject, target, and recipient remain distinct domains",
    ),
    check(
      "action-kind-intent-separated",
      "Contracts",
      kindsAreSeparateCollections,
      "Action kind and intent remain independently addressable vocabularies",
    ),
    check(
      "explicit-intent-precedence",
      "IntentContext",
      intent.ok === true &&
        resolveRuntimeExecutiveActionIntentContext({
          kind: "request",
          intent: { kind: "request-information" },
          subject: {
            kind: "object",
            id: "object.project-alpha",
            label: "Project Alpha",
          },
          title: "Request Update",
        }).intentResolution.status === "explicit",
      "Explicit intent precedence remains preserved",
    ),
    check(
      "ambiguity-preserved",
      "IntentContext",
      ambiguous.status === "ambiguous" &&
        ambiguous.intentResolution.status === "ambiguous",
      "Ambiguous intent remains visible and unresolved",
    ),
    check(
      "presentation-states",
      "PresentationPreview",
      preview.ok === true &&
        exactOrder([...RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES], [
          "minimum",
          "report",
          "operation",
        ]),
      "Presentation states minimum/report/operation remain intact",
    ),
    check(
      "confirmation-gate",
      "ConfirmationSafety",
      confirmation.ok === true &&
        confirmation.acknowledgmentExplicit === true &&
        !canTransitionRuntimeExecutiveActionOrchestration({
          from: "confirmation",
          to: "prepared-for-dispatch",
          operation: "advance",
        }),
      "Explicit confirmation remains mandatory",
    ),
    check(
      "auto-confirmation-forbidden",
      "ConfirmationSafety",
      orchestration.autoConfirmationForbidden === true &&
        runtimeExecutiveActionExperiencePlatform.confirmationGated === true,
      "Auto-confirmation remains forbidden",
    ),
    check(
      "critical-action-review",
      "ConfirmationSafety",
      confirmation.criticalActionSafe === true &&
        RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES.includes(
          "explicit-high-risk",
        ),
      "Critical-action review semantics remain preserved",
    ),
    check(
      "scope-stability",
      "ConfirmationSafety",
      confirmation.scopeStable === true &&
        fp1.value === fp2.value &&
        scopeChanged === true,
      "Confirmation scope stability and change detection remain intact",
    ),
    check(
      "decline-cancel-separated",
      "ConfirmationSafety",
      confirmation.declineCancelSeparated === true &&
        RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES.includes("declined") &&
        RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES.includes("cancelled"),
      "Decline and cancel remain distinct non-dispatch outcomes",
    ),
    check(
      "phase-order",
      "Orchestration",
      orchestration.ok === true &&
        exactOrder(
          [...RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES].slice(0, 6),
          [
            "proposal",
            "contract",
            "intent-context",
            "preview",
            "confirmation",
            "prepared-for-dispatch",
          ],
        ),
      "Orchestration phase order remains canonical",
    ),
    check(
      "phase-skipping-forbidden",
      "Orchestration",
      orchestration.noPhaseSkipping === true &&
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
      "Phase skipping to prepared-for-dispatch is impossible",
    ),
    check(
      "downstream-eligibility-gated",
      "Orchestration",
      RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY.includes("eligible") &&
        RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY.includes(
          "not-eligible",
        ) &&
        canTransitionRuntimeExecutiveActionOrchestration({
          from: "confirmation",
          to: "prepared-for-dispatch",
          operation: "confirm",
        }),
      "Downstream eligibility remains confirmation-gated",
    ),
    check(
      "dispatch-boundary",
      "DispatchBoundary",
      boundary.introducesDispatch === false &&
        runtimeExecutiveActionExperiencePlatform.externalDispatchFree ===
          true &&
        typeof createRuntimeExecutiveActionDispatchRequest === "function",
      "DispatchRequest ≠ ExternalDispatch remains enforced",
    ),
    check(
      "provider-neutrality",
      "ProviderIndependence",
      boundary.providerNeutral === true &&
        boundary.providerIndependent === true,
      "Platform remains provider-neutral",
    ),
    check(
      "capability-coverage",
      "PlatformCapabilities",
      exactOrder([...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES], [
        "action-domain",
        "action-contracts",
        "intent-context-resolution",
        "presentation-preview",
        "confirmation-safety",
        "action-orchestration",
        "dispatch-request-preparation",
      ]),
      "Platform capabilities remain complete and ordered",
    ),
    check(
      "registry-integrity",
      "PlatformRegistry",
      registry.sectionCount ===
        RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS.length &&
        unique([...registry.sections]) &&
        registry.identityChainCount ===
          RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN.length &&
        registry.capabilityCount ===
          RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES.length &&
        registry.guaranteeCount ===
          RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES.length,
      "Platform registry integrity holds",
    ),
    check(
      "invariants-enforced",
      "PlatformInvariants",
      platformInvariants.ok === true &&
        RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS.every(
          (entry) => entry.status === "enforced",
        ) &&
        unique([...RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANT_IDS]),
      "Platform and frozen invariants are enforced",
    ),
    check(
      "guarantees-present",
      "PlatformGuarantees",
      RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES.includes(
        "confirmation-gated",
      ) &&
        RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_GUARANTEES.includes(
          "external-dispatch-free",
        ) &&
        RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES.includes(
          "ready-for-public-index",
        ),
      "Platform and frozen guarantees remain present",
    ),
    check(
      "compatibility-compatible",
      "Compatibility",
      platformCompatibility.status === "compatible",
      "Platform compatibility is compatible",
    ),
    check(
      "immutability",
      "Immutability",
      Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_IDENTITY_CHAIN) &&
        Object.isFrozen(runtimeExecutiveActionExperiencePlatformRegistry) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS) &&
        Object.isFrozen(draft),
      "Canonical collections and drafts preserve immutability",
    ),
    check(
      "determinism",
      "Determinism",
      runtimeExecutiveActionExperienceCertificationFreezeDeterministic ===
        true &&
        runtimeExecutiveActionExperiencePlatform.deterministic === true &&
        fp1.value === fp2.value,
      "Certification and platform APIs remain deterministic",
    ),
    check(
      "renderer-independence",
      "RendererIndependence",
      boundary.rendererIndependent === true &&
        boundary.frameworkIndependent === true,
      "Renderer independence is preserved",
    ),
    check(
      "ai-independence",
      "ProviderIndependence",
      boundary.aiIndependent === true,
      "AI independence is preserved",
    ),
    check(
      "external-dispatch-absent",
      "ExternalDispatchAbsence",
      boundary.introducesDispatch === false &&
        RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_FREEZE_BOUNDARY
          .introducesDispatch === false &&
        !RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_CAPABILITIES.some((capability) =>
          capability.includes("external-dispatch") ||
          capability.includes("provider-routing"),
        ),
      "External dispatch remains absent from the certified platform",
    ),
    check(
      "approved-exports-unique",
      "PlatformRegistry",
      unique([...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS]) &&
        RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS.length > 0,
      "Approved frozen exports are unique and non-empty",
    ),
    check(
      "lock-identity",
      "Identity",
      REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED ===
        "REX-5-RUNTIME-EXECUTIVE-ACTION-EXPERIENCE-PLATFORM-LOCKED",
      "Exact platform lock identity is correct",
    ),
  ]);
}

export const RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_CHECKS =
  buildCertificationChecks();

// ─── Public verification APIs ───────────────────────────────────────────────

export function verifyRuntimeExecutiveActionExperienceCompatibility():
  Readonly<{
    readonly status: RuntimeExecutiveActionExperienceCompatibilityStatus;
    readonly reasons: ReadonlyArray<string>;
  }> {
  const platform =
    verifyRuntimeExecutiveActionExperiencePlatformCompatibility();
  const certification = RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_CHECKS;
  const failed = certification.filter((entry) => !entry.passed);
  const reasons = freezeArray([
    ...platform.reasons,
    ...failed.map((entry) => entry.id),
  ]);
  return Object.freeze({
    status: reasons.length === 0 ? "compatible" : "incompatible",
    reasons,
  });
}

export function verifyRuntimeExecutiveActionExperienceCertification():
  RuntimeExecutiveActionExperienceCertificationResult {
  const checks = RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_CHECKS;
  const passedCheckCount = checks.filter((entry) => entry.passed).length;
  const failedCheckCount = checks.length - passedCheckCount;
  const issues = freezeArray(
    checks
      .map(issueFromCheck)
      .filter(
        (entry): entry is RuntimeExecutiveActionExperienceCertificationIssue =>
          entry !== undefined,
      ),
  );
  const certified = failedCheckCount === 0;
  return Object.freeze({
    status: certified ? "certified" : "not-certified",
    passedCheckCount,
    failedCheckCount,
    checks,
    issues,
    compatibility: certified ? "compatible" : "incompatible",
    freeze: certified ? "frozen" : "not-frozen",
    lock: certified ? "locked" : "unlocked",
    platformLock: certified
      ? REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED
      : "",
    readyForPublicIndex: certified
      ? "ready-for-public-index"
      : "not-ready-for-public-index",
  });
}

export function verifyRuntimeExecutiveActionExperienceFreeze():
  RuntimeExecutiveActionExperienceFreeze {
  const certification = verifyRuntimeExecutiveActionExperienceCertification();
  const compatible =
    verifyRuntimeExecutiveActionExperienceCompatibility().status ===
    "compatible";
  const ok =
    certification.status === "certified" &&
    compatible &&
    certification.failedCheckCount === 0 &&
    RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS.every(
      (entry) => entry.status === "enforced",
    ) &&
    REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED ===
      "REX-5-RUNTIME-EXECUTIVE-ACTION-EXPERIENCE-PLATFORM-LOCKED";

  return Object.freeze({
    freezeStatus: ok ? "frozen" : "not-frozen",
    frozenIdentity: runtimeExecutiveActionExperiencePlatformIdentity,
    frozenVersion: runtimeExecutiveActionExperiencePlatformVersion,
    frozenNamespace: runtimeExecutiveActionExperiencePlatformNamespace,
    lock: ok ? REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED : "",
    lockStatus: ok ? "locked" : "unlocked",
    frozenInvariants: RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS,
    frozenGuarantees: RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES,
    frozenCompatibility: ok ? "compatible" : "incompatible",
    approvedExports: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS,
    readyForPublicIndex: ok
      ? "ready-for-public-index"
      : "not-ready-for-public-index",
  });
}

export function getRuntimeExecutiveActionExperiencePlatformLock():
  typeof REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED {
  return REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED;
}

export function getRuntimeExecutiveActionExperienceFreeze():
  RuntimeExecutiveActionExperienceFreeze {
  return verifyRuntimeExecutiveActionExperienceFreeze();
}

export function getRuntimeExecutiveActionExperienceCertification():
  RuntimeExecutiveActionExperienceCertification {
  const verification = verifyRuntimeExecutiveActionExperienceCertification();
  return Object.freeze({
    identity: runtimeExecutiveActionExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveActionExperienceCertificationFreezeVersion,
    certificationStatus: verification.status,
    verification,
    compatibility: verification.compatibility,
    freezeStatus: verification.freeze,
    lockStatus: verification.lock,
    platformLock: verification.platformLock,
    passedChecks: freezeArray(
      verification.checks
        .filter((entry) => entry.passed)
        .map((entry) => entry.id),
    ),
    failedChecks: freezeArray(
      verification.checks
        .filter((entry) => !entry.passed)
        .map((entry) => entry.id),
    ),
    issues: verification.issues,
    certifiedGuarantees:
      verification.status === "certified"
        ? RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES
        : Object.freeze([]),
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveActionExperienceCertificationFreezeIdentity():
  typeof runtimeExecutiveActionExperienceCertificationFreezeCanonicalIdentity {
  return runtimeExecutiveActionExperienceCertificationFreezeCanonicalIdentity;
}

export function getRuntimeExecutiveActionExperienceCertificationFreezeRegistry():
  typeof runtimeExecutiveActionExperienceCertificationFreezeRegistry {
  return runtimeExecutiveActionExperienceCertificationFreezeRegistry;
}

export function getRuntimeExecutiveActionExperienceCertificationFreezeGuarantees():
  typeof RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES {
  return RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveActionExperienceCertificationFreezeApiNames =
  Object.freeze([
    "getRuntimeExecutiveActionExperienceCertificationFreezeIdentity",
    "getRuntimeExecutiveActionExperienceCertificationFreezeRegistry",
    "getRuntimeExecutiveActionExperienceCertificationFreezeGuarantees",
    "getRuntimeExecutiveActionExperienceCertification",
    "getRuntimeExecutiveActionExperienceFreeze",
    "getRuntimeExecutiveActionExperiencePlatformLock",
    "verifyRuntimeExecutiveActionExperienceCompatibility",
    "verifyRuntimeExecutiveActionExperienceCertification",
    "verifyRuntimeExecutiveActionExperienceFreeze",
  ] as const);

export const RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveActionExperienceCertificationStatus",
    "RuntimeExecutiveActionExperienceFreezeStatus",
    "RuntimeExecutiveActionExperienceLockStatus",
    "RuntimeExecutiveActionExperienceCompatibilityStatus",
    "RuntimeExecutiveActionExperiencePublicIndexReadiness",
    "RuntimeExecutiveActionExperienceCertificationSeverity",
    "RuntimeExecutiveActionExperienceCertificationDomain",
    "RuntimeExecutiveActionExperienceCertificationIssueCode",
    "RuntimeExecutiveActionExperienceFrozenInvariantId",
    "RuntimeExecutiveActionExperienceFrozenInvariant",
    "RuntimeExecutiveActionExperienceFrozenGuarantee",
    "RuntimeExecutiveActionExperienceApprovedExport",
    "RuntimeExecutiveActionExperienceCertificationCheck",
    "RuntimeExecutiveActionExperienceCertificationIssue",
    "RuntimeExecutiveActionExperienceCertificationResult",
    "RuntimeExecutiveActionExperienceCertification",
    "RuntimeExecutiveActionExperienceFreeze",
    "RuntimeExecutiveActionExperienceCertificationFreezeConsumerInformation",
    ...RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_PUBLIC_TYPE_NAMES,
  ] as const);

export const runtimeExecutiveActionExperienceCertificationFreezeConsumerInformation =
  Object.freeze({
    currentPhase: "CertificationFreeze",
    status: "Certified",
    compatibility: "Compatible",
    freeze: "Frozen",
    lock: "Locked",
    nextPhase: "PublicIndex",
    consumerReadiness: "ReadyForPublicIndex",
    consumerRole: "FrozenPrePublicIndexSurface",
    readyForConsumer: false,
    released: false,
  }) as RuntimeExecutiveActionExperienceCertificationFreezeConsumerInformation;

export const runtimeExecutiveActionExperienceCertificationFreezeRegistry =
  Object.freeze({
    identity: runtimeExecutiveActionExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveActionExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveActionExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveActionExperienceCertificationFreezeLayer,
    capability: runtimeExecutiveActionExperienceCertificationFreezeCapability,
    phase: runtimeExecutiveActionExperienceCertificationFreezePhase,
    status: runtimeExecutiveActionExperienceCertificationFreezeStatus,
    architecturalRole:
      runtimeExecutiveActionExperienceCertificationFreezeArchitecturalRole,
    consumerRole:
      runtimeExecutiveActionExperienceCertificationFreezeConsumerRole,
    dependencyIdentity:
      runtimeExecutiveActionExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperienceCertificationFreezeSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_REGISTRY_SECTIONS.length,
    certificationStatuses: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_STATUSES,
    freezeStatuses: RUNTIME_EXECUTIVE_ACTION_FREEZE_STATUSES,
    lockStatuses: RUNTIME_EXECUTIVE_ACTION_LOCK_STATUSES,
    compatibilityStatuses: RUNTIME_EXECUTIVE_ACTION_COMPATIBILITY_STATUSES,
    publicIndexReadiness: RUNTIME_EXECUTIVE_ACTION_PUBLIC_INDEX_READINESS,
    certificationDomains: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_DOMAINS,
    certificationDomainCount:
      RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_DOMAINS.length,
    certificationChecks: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_CHECKS,
    certificationCheckCount: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_CHECKS.length,
    certificationIssueCodes: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_ISSUE_CODES,
    certificationIssueCodeCount:
      RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_ISSUE_CODES.length,
    frozenInvariants: RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS,
    frozenInvariantCount: RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS.length,
    frozenGuarantees: RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES,
    frozenGuaranteeCount: RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES.length,
    approvedExports: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS,
    approvedExportCount:
      RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS.length,
    publicTypes: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveActionExperienceCertificationFreezeApiNames,
    publicApiCount:
      runtimeExecutiveActionExperienceCertificationFreezeApiNames.length,
    platformLock: REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
    consumerInformation:
      runtimeExecutiveActionExperienceCertificationFreezeConsumerInformation,
    platformApiNames: runtimeExecutiveActionExperiencePlatformApiNames,
    platformCanonicalIdentity:
      runtimeExecutiveActionExperiencePlatformCanonicalIdentity,
    platformConsumerInformation:
      runtimeExecutiveActionExperiencePlatformConsumerInformation,
  });

export const runtimeExecutiveActionExperienceCertificationFreeze =
  Object.freeze({
    phase: "CertificationFreeze" as const,
    name: "RuntimeExecutiveActionExperienceCertificationFreeze" as const,
    identity: runtimeExecutiveActionExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveActionExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveActionExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveActionExperienceCertificationFreezeLayer,
    capability: runtimeExecutiveActionExperienceCertificationFreezeCapability,
    architecturalRole:
      runtimeExecutiveActionExperienceCertificationFreezeArchitecturalRole,
    consumerRole:
      runtimeExecutiveActionExperienceCertificationFreezeConsumerRole,
    role: "CertificationFreeze" as const,
    status: runtimeExecutiveActionExperienceCertificationFreezeStatus,
    upstreamDependency:
      runtimeExecutiveActionExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionExperienceCertificationFreezeSupportedImportPath,
    deterministic:
      runtimeExecutiveActionExperienceCertificationFreezeDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
    certified: true as const,
    compatible: true as const,
    frozen: true as const,
    locked: true as const,
    readyForPublicIndex: true as const,
    readyForConsumer: false as const,
    released: false as const,
    platformLock: REX_5_RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_PLATFORM_LOCKED,
    principle: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_FREEZE_PRINCIPLE,
    boundary: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_FREEZE_BOUNDARY,
    frozenInvariants: RUNTIME_EXECUTIVE_ACTION_FROZEN_INVARIANTS,
    frozenGuarantees: RUNTIME_EXECUTIVE_ACTION_FROZEN_GUARANTEES,
    approvedExports: RUNTIME_EXECUTIVE_ACTION_EXPERIENCE_APPROVED_EXPORTS,
    consumerInformation:
      runtimeExecutiveActionExperienceCertificationFreezeConsumerInformation,
    publicTypeNames: RUNTIME_EXECUTIVE_ACTION_CERTIFICATION_PUBLIC_TYPE_NAMES,
    publicApiSurface:
      runtimeExecutiveActionExperienceCertificationFreezeApiNames,
    registry: runtimeExecutiveActionExperienceCertificationFreezeRegistry,
    platformBoundary: "REX-5:7-platform-only" as const,
    architecturalStatus:
      "REX-5:8 Runtime Executive Action Experience Certification & Freeze — CERTIFIED / COMPATIBLE / FROZEN / LOCKED / READY FOR PUBLIC INDEX" as const,
  });
