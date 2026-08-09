/**
 * REX-4:8 — Runtime Executive Insight Experience Certification & Freeze.
 *
 * Certifies, compatibility-checks, freezes, and locks the completed REX-4
 * Insight Experience Platform before publication through REX-4:9 Public Index.
 *
 * Canonical flow:
 *   REX-4:7 Platform
 *     → Certification Evaluation
 *     → Compatibility Verification
 *     → Invariant Verification
 *     → Approved Export Freeze
 *     → Platform Lock
 *     → Ready for REX-4:9 Public Index
 *
 * Certification observes and freezes only. No new insight behavior.
 */

import {
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_BOUNDARY,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_COMPATIBILITY_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PUBLIC_TYPE_NAMES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightExperienceOrchestrationPolicy,
  createRuntimeExecutiveInsightPresentationPolicy,
  createRuntimeExecutiveInsightPriorityPolicy,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  evaluateRuntimeExecutiveInsightPriority,
  getRuntimeExecutiveInsightExperiencePlatformCapabilities,
  getRuntimeExecutiveInsightExperiencePlatformIdentity,
  getRuntimeExecutiveInsightExperiencePlatformRegistry,
  orchestrateRuntimeExecutiveInsightExperience,
  orchestrateRuntimeExecutiveInsightFocus,
  orchestrateRuntimeExecutiveInsightSelection,
  rankRuntimeExecutiveInsights,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsightAttention,
  resolveRuntimeExecutiveInsightExperienceContexts,
  resolveRuntimeExecutiveInsightExperienceIntents,
  resolveRuntimeExecutiveInsightInteractions,
  resolveRuntimeExecutiveInsightPresentation,
  resolveRuntimeExecutiveInsights,
  runtimeExecutiveInsightExperiencePlatform,
  runtimeExecutiveInsightExperiencePlatformApprovedExports,
  runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry,
  runtimeExecutiveInsightExperiencePlatformCanonicalIdentity,
  runtimeExecutiveInsightExperiencePlatformCapability,
  runtimeExecutiveInsightExperiencePlatformDependencyIdentity,
  runtimeExecutiveInsightExperiencePlatformDependencyPath,
  runtimeExecutiveInsightExperiencePlatformFunctionalApiNames,
  runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry,
  runtimeExecutiveInsightExperiencePlatformIdentity,
  runtimeExecutiveInsightExperiencePlatformLayer,
  runtimeExecutiveInsightExperiencePlatformNamespace,
  runtimeExecutiveInsightExperiencePlatformPhase,
  runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry,
  runtimeExecutiveInsightExperiencePlatformRegistry,
  runtimeExecutiveInsightExperiencePlatformStatus,
  runtimeExecutiveInsightExperiencePlatformSupportedImportPath,
  runtimeExecutiveInsightExperiencePlatformUpstreamApiNames,
  runtimeExecutiveInsightExperiencePlatformVersion,
  supportsRuntimeExecutiveInsightExperienceCapability,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightExperiencePlatform,
  validateRuntimeExecutiveInsightPresentationInput,
  validateRuntimeExecutiveInsightPriorityPolicy,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightExperienceCompatibility,
  verifyRuntimeExecutiveInsightExperienceOrchestration,
  verifyRuntimeExecutiveInsightExperiencePlatform,
  type RuntimeExecutiveInsightCandidate,
  type RuntimeExecutiveInsightCandidateCollection,
  type RuntimeExecutiveInsightEvidenceContract,
  type RuntimeExecutiveInsightExperienceOrchestrationInput,
  type RuntimeExecutiveInsightExperienceOrchestrationPolicy,
  type RuntimeExecutiveInsightExperienceOrchestrationResult,
  type RuntimeExecutiveInsightExperiencePlatformVerification,
  type RuntimeExecutiveInsightPlatformApiFamily,
  type RuntimeExecutiveInsightPlatformCapability,
  type RuntimeExecutiveInsightPlatformCapabilityName,
  type RuntimeExecutiveInsightPlatformCapabilityStatus,
  type RuntimeExecutiveInsightPlatformCompatibilityInput,
  type RuntimeExecutiveInsightPlatformCompatibilityResult,
  type RuntimeExecutiveInsightPlatformCompatibilityStatus,
  type RuntimeExecutiveInsightPlatformConsumerGuarantee,
  type RuntimeExecutiveInsightPlatformExperienceSurface,
  type RuntimeExecutiveInsightPlatformRegistrySection,
  type RuntimeExecutiveInsightPlatformValidationIssue,
  type RuntimeExecutiveInsightPlatformValidationResult,
  type RuntimeExecutiveInsightPlatformVerificationCode,
  type RuntimeExecutiveInsightPlatformVerificationStatus,
  type RuntimeExecutiveInsightPresentationDescriptor,
  type RuntimeExecutiveInsightPresentationResult,
  type RuntimeExecutiveInsightPresentationState,
  type RuntimeExecutiveInsightPriorityAttentionState,
  type RuntimeExecutiveInsightPriorityBand,
  type RuntimeExecutiveInsightPriorityResult,
  type RuntimeExecutiveInsightSignalContract,
  type RuntimeExecutiveInsightSourceContract,
  type RuntimeExecutiveInsightSubjectContract,
  type RuntimeExecutiveRankedInsight,
} from "@/app/lib/rex/runtimeExecutiveInsightExperiencePlatform";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveInsightExperienceCertificationFreezeIdentity =
  "REX-4:8/RuntimeExecutiveInsightExperienceCertificationFreeze" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeVersion =
  "4.8.0" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeNamespace =
  "nexora.rex.insight-experience.certification-freeze" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeLayer =
  "REX" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeCapability =
  "RuntimeExecutiveInsightExperience" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezePhase =
  "CertificationFreeze" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeStatus =
  "ReadyForPublicIndex" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeArchitecturalRole =
  "RuntimeExecutiveInsightExperienceCertificationFreezeBoundary" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeConsumerRole =
  "CertifiedFrozenPlatformBoundary" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeDependencyIdentity =
  runtimeExecutiveInsightExperiencePlatformIdentity;

export const runtimeExecutiveInsightExperienceCertificationFreezeDependencyPath =
  runtimeExecutiveInsightExperiencePlatformSupportedImportPath;

export const runtimeExecutiveInsightExperienceCertificationFreezeSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveInsightExperienceCertificationFreeze" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeStability =
  "CertifiedFrozen" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeDeterministic =
  true as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeMutationPolicy =
  "immutable" as const;

/** Exact immutable platform lock constant. */
export const REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED =
  "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-LOCKED" as const;

export const runtimeExecutiveInsightExperienceCertificationFreezeCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveInsightExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveInsightExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveInsightExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveInsightExperienceCertificationFreezeLayer,
    capability: runtimeExecutiveInsightExperienceCertificationFreezeCapability,
    phase: runtimeExecutiveInsightExperienceCertificationFreezePhase,
    status: runtimeExecutiveInsightExperienceCertificationFreezeStatus,
    architecturalRole:
      runtimeExecutiveInsightExperienceCertificationFreezeArchitecturalRole,
    consumerRole:
      runtimeExecutiveInsightExperienceCertificationFreezeConsumerRole,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveInsightExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperienceCertificationFreezeSupportedImportPath,
    upstreamVersion: runtimeExecutiveInsightExperiencePlatformVersion,
    stabilityStatus:
      runtimeExecutiveInsightExperienceCertificationFreezeStability,
    deterministicStatus:
      runtimeExecutiveInsightExperienceCertificationFreezeDeterministic,
    sideEffectPolicy:
      runtimeExecutiveInsightExperienceCertificationFreezeSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveInsightExperienceCertificationFreezeMutationPolicy,
    certificationStatus: "certified" as const,
    compatibilityStatus: "compatible" as const,
    freezeStatus: "frozen" as const,
    lockStatus: "locked" as const,
    platformLock: REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED,
    readiness: "ready-for-public-index" as const,
    readinessDisplay: "ReadyForPublicIndex" as const,
  });

export const RUNTIME_EXECUTIVE_INSIGHT_CERTIFICATION_FREEZE_PRINCIPLE =
  "Verify → certify → freeze. Certification observes the REX-4:7 Platform; it does not invent, repair, or execute Insight behavior." as const;

export const RUNTIME_EXECUTIVE_INSIGHT_CERTIFICATION_FREEZE_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    certificationAuthority: "REX-4:8" as const,
    architecturalRole:
      "RuntimeExecutiveInsightExperienceCertificationFreezeBoundary" as const,
    consumerRole: "CertifiedFrozenPlatformBoundary" as const,
    soleImmediateDependency:
      "REX-4:7/RuntimeExecutiveInsightExperiencePlatform" as const,
    consumesPlatformOnly: true as const,
    importsRex46Directly: false as const,
    importsRex45Directly: false as const,
    importsRex44Directly: false as const,
    importsRex43Directly: false as const,
    importsRex42Directly: false as const,
    importsRex41Directly: false as const,
    importsRex49Directly: false as const,
    importsRex3Directly: false as const,
    importsRex2Directly: false as const,
    importsRex1Directly: false as const,
    importsExDriDirectly: false as const,
    importsDriDirectly: false as const,
    importsNolDirectly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    reactIndependent: true as const,
    aiProviderIndependent: true as const,
    introducesRuntimeBehavior: false as const,
    modifiesPlatformBehavior: false as const,
    executesActions: false as const,
    calculatesKpi: false as const,
    calculatesKoi: false as const,
    introducesKor: false as const,
    rendersUi: false as const,
    introducesAutomation: false as const,
    introducesPersistence: false as const,
    introducesExternalIntegration: false as const,
    isFinalPublicConsumerIndex: false as const,
    preparesPublicIndex: true as const,
    claimsReleased: false as const,
    claimsReadyForConsumer: false as const,
    claimsFinalConsumerEntry: false as const,
    mutatesInput: false as const,
  });

// ─── Status vocabularies ────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_STATUSES =
  Object.freeze(["certified", "failed"] as const);

export type RuntimeExecutiveInsightExperienceCertificationStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_COMPATIBILITY_STATUSES =
  Object.freeze(["compatible", "incompatible"] as const);

export type RuntimeExecutiveInsightExperienceCompatibilityStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_COMPATIBILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_STATUSES =
  Object.freeze(["frozen", "unfrozen"] as const);

export type RuntimeExecutiveInsightExperienceFreezeStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_LOCK_STATUSES = Object.freeze([
  "locked",
  "unlocked",
] as const);

export type RuntimeExecutiveInsightExperienceLockStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_LOCK_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_READINESS =
  Object.freeze(["ready-for-public-index", "not-ready"] as const);

export type RuntimeExecutiveInsightExperiencePublicIndexReadiness =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_READINESS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_READINESS_DISPLAY =
  Object.freeze(["ReadyForPublicIndex", "NotReady"] as const);

export type RuntimeExecutiveInsightExperiencePublicIndexReadinessDisplay =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_READINESS_DISPLAY)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CHECK_STATUSES =
  Object.freeze(["passed", "failed"] as const);

export type RuntimeExecutiveInsightExperienceCertificationCheckStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CHECK_STATUSES)[number];

// ─── Certification domains / codes / failures ───────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS =
  Object.freeze([
    "Identity",
    "Dependency",
    "PlatformVerification",
    "PublicSurface",
    "Contracts",
    "Resolution",
    "PriorityAttention",
    "Presentation",
    "Orchestration",
    "Compatibility",
    "Determinism",
    "Immutability",
    "ConsumerGuarantees",
    "ForbiddenDependencies",
    "Terminology",
    "Freeze",
    "Lock",
    "PublicIndexReadiness",
  ] as const);

export type RuntimeExecutiveInsightExperienceCertificationDomain =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES =
  Object.freeze([
    "identity-valid",
    "version-valid",
    "namespace-valid",
    "dependency-valid",
    "platform-verification-passed",
    "public-surface-valid",
    "approved-exports-valid",
    "approved-types-valid",
    "approved-apis-valid",
    "contracts-valid",
    "resolution-valid",
    "priority-attention-valid",
    "presentation-valid",
    "orchestration-valid",
    "compatibility-valid",
    "determinism-valid",
    "immutability-valid",
    "consumer-guarantees-valid",
    "forbidden-dependencies-absent",
    "ai-dependency-absent",
    "renderer-dependency-absent",
    "persistence-dependency-absent",
    "external-access-absent",
    "automation-behavior-absent",
    "kpi-semantics-valid",
    "koi-semantics-valid",
    "kor-absent",
    "freeze-invariants-valid",
    "platform-lock-valid",
    "public-index-readiness-valid",
  ] as const);

export type RuntimeExecutiveInsightExperienceCertificationCode =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES =
  Object.freeze([
    "invalid-identity",
    "invalid-version",
    "invalid-namespace",
    "invalid-dependency",
    "platform-verification-failed",
    "duplicate-approved-export",
    "missing-approved-export",
    "incompatible-platform",
    "nondeterministic-platform",
    "mutable-registry",
    "forbidden-import",
    "ai-dependency-detected",
    "renderer-dependency-detected",
    "persistence-dependency-detected",
    "external-access-detected",
    "automation-behavior-detected",
    "terminology-violation",
    "lock-mismatch",
    "not-ready-for-public-index",
  ] as const);

export type RuntimeExecutiveInsightExperienceCertificationFailureCode =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES)[number];

// ─── Freeze invariants ──────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "severity-not-priority",
      domain: "Terminology" as const,
      reference: "severity ≠ priority",
      required: true as const,
    }),
    Object.freeze({
      id: "importance-not-priority",
      domain: "Terminology" as const,
      reference: "importance ≠ priority",
      required: true as const,
    }),
    Object.freeze({
      id: "attention-not-focus",
      domain: "Terminology" as const,
      reference: "attention ≠ focus",
      required: true as const,
    }),
    Object.freeze({
      id: "selection-not-focus",
      domain: "Terminology" as const,
      reference: "selection ≠ focus",
      required: true as const,
    }),
    Object.freeze({
      id: "operation-not-action-execution",
      domain: "Presentation" as const,
      reference: "operation presentation ≠ action execution",
      required: true as const,
    }),
    Object.freeze({
      id: "insight-not-recommendation",
      domain: "Terminology" as const,
      reference: "Executive Insight ≠ Executive Recommendation",
      required: true as const,
    }),
    Object.freeze({
      id: "presentation-states-minimum-report-operation",
      domain: "Presentation" as const,
      reference: "minimum|report|operation only",
      required: true as const,
    }),
    Object.freeze({
      id: "minimum-executive-awareness",
      domain: "Presentation" as const,
      reference: "minimum → executive awareness",
      required: true as const,
    }),
    Object.freeze({
      id: "report-executive-understanding",
      domain: "Presentation" as const,
      reference: "report → executive understanding",
      required: true as const,
    }),
    Object.freeze({
      id: "operation-executive-action-context",
      domain: "Presentation" as const,
      reference: "operation → executive interaction/action context",
      required: true as const,
    }),
    Object.freeze({
      id: "no-ai-llm-execution",
      domain: "ForbiddenDependencies" as const,
      reference: "no AI/LLM execution behavior",
      required: true as const,
    }),
    Object.freeze({
      id: "no-react-renderer",
      domain: "ForbiddenDependencies" as const,
      reference: "no React/renderer ownership",
      required: true as const,
    }),
    Object.freeze({
      id: "no-persistence",
      domain: "ForbiddenDependencies" as const,
      reference: "no persistence dependency",
      required: true as const,
    }),
    Object.freeze({
      id: "no-external-access",
      domain: "ForbiddenDependencies" as const,
      reference: "no external service access",
      required: true as const,
    }),
    Object.freeze({
      id: "no-automation",
      domain: "ForbiddenDependencies" as const,
      reference: "no autonomous automation",
      required: true as const,
    }),
    Object.freeze({
      id: "kpi-structured-context-only",
      domain: "Terminology" as const,
      reference: "KPI = Key Performance Indicator; not calculated",
      required: true as const,
    }),
    Object.freeze({
      id: "koi-structured-context-only",
      domain: "Terminology" as const,
      reference: "KOI = Key Output Index; not calculated",
      required: true as const,
    }),
    Object.freeze({
      id: "kor-prohibited",
      domain: "Terminology" as const,
      reference: "KOR must not be introduced",
      required: true as const,
    }),
    Object.freeze({
      id: "platform-identity-frozen",
      domain: "Identity" as const,
      reference: "REX-4:7 identity frozen",
      required: true as const,
    }),
    Object.freeze({
      id: "platform-version-frozen",
      domain: "Identity" as const,
      reference: "REX-4:7 version frozen",
      required: true as const,
    }),
    Object.freeze({
      id: "sole-dependency-rex-4-7",
      domain: "Dependency" as const,
      reference: "REX-4:8 depends only on REX-4:7",
      required: true as const,
    }),
    Object.freeze({
      id: "approved-exports-frozen",
      domain: "Freeze" as const,
      reference: "approved export surface frozen",
      required: true as const,
    }),
    Object.freeze({
      id: "approved-types-frozen",
      domain: "Freeze" as const,
      reference: "approved type surface frozen",
      required: true as const,
    }),
    Object.freeze({
      id: "approved-apis-frozen",
      domain: "Freeze" as const,
      reference: "approved API surface frozen",
      required: true as const,
    }),
    Object.freeze({
      id: "consumer-guarantees-frozen",
      domain: "ConsumerGuarantees" as const,
      reference: "consumer guarantees frozen",
      required: true as const,
    }),
    Object.freeze({
      id: "deterministic-platform",
      domain: "Determinism" as const,
      reference: "equivalent input → equivalent output",
      required: true as const,
    }),
    Object.freeze({
      id: "immutable-registries",
      domain: "Immutability" as const,
      reference: "registries and results immutable",
      required: true as const,
    }),
    Object.freeze({
      id: "platform-lock-exact",
      domain: "Lock" as const,
      reference: "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-LOCKED",
      required: true as const,
    }),
    Object.freeze({
      id: "ready-for-public-index-only-when-certified",
      domain: "PublicIndexReadiness" as const,
      reference: "ReadyForPublicIndex only when all gates pass",
      required: true as const,
    }),
    Object.freeze({
      id: "rex-4-9-consumes-freeze-only",
      domain: "Freeze" as const,
      reference: "REX-4:9 must depend only on REX-4:8",
      required: true as const,
    }),
  ] as const);

export type RuntimeExecutiveInsightExperienceFreezeInvariant =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS)[number];

// ─── Approved freeze surfaces (authority for REX-4:9) ───────────────────────

function uniqueOrderedSurface<T extends string>(
  values: ReadonlyArray<T>,
): ReadonlyArray<T> {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return Object.freeze(out);
}

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES =
  uniqueOrderedSurface([
    ...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PUBLIC_TYPE_NAMES,
    "RuntimeExecutiveInsightExperienceCertificationStatus",
    "RuntimeExecutiveInsightExperienceCompatibilityStatus",
    "RuntimeExecutiveInsightExperienceFreezeStatus",
    "RuntimeExecutiveInsightExperienceLockStatus",
    "RuntimeExecutiveInsightExperiencePublicIndexReadiness",
    "RuntimeExecutiveInsightExperienceCertificationDomain",
    "RuntimeExecutiveInsightExperienceCertificationCode",
    "RuntimeExecutiveInsightExperienceCertificationFailureCode",
    "RuntimeExecutiveInsightExperienceCertificationCheck",
    "RuntimeExecutiveInsightExperienceCertificationResult",
    "RuntimeExecutiveInsightExperienceFreezeInvariant",
    "RuntimeExecutiveInsightExperienceCertificationFreezeVerification",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS =
  uniqueOrderedSurface([
    ...runtimeExecutiveInsightExperiencePlatformUpstreamApiNames,
    ...runtimeExecutiveInsightExperiencePlatformFunctionalApiNames,
    "certifyRuntimeExecutiveInsightExperiencePlatform",
    "verifyRuntimeExecutiveInsightExperienceCertificationFreeze",
    "getRuntimeExecutiveInsightExperienceCertificationFreezeIdentity",
    "getRuntimeExecutiveInsightExperienceCertificationFreezeRegistry",
    "evaluateRuntimeExecutiveInsightExperienceCertificationStatuses",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS =
  uniqueOrderedSurface([
    // Platform identity / registries
    "runtimeExecutiveInsightExperiencePlatformIdentity",
    "runtimeExecutiveInsightExperiencePlatformVersion",
    "runtimeExecutiveInsightExperiencePlatformNamespace",
    "runtimeExecutiveInsightExperiencePlatformLayer",
    "runtimeExecutiveInsightExperiencePlatformCapability",
    "runtimeExecutiveInsightExperiencePlatformPhase",
    "runtimeExecutiveInsightExperiencePlatformStatus",
    "runtimeExecutiveInsightExperiencePlatformCanonicalIdentity",
    "runtimeExecutiveInsightExperiencePlatform",
    "runtimeExecutiveInsightExperiencePlatformRegistry",
    "runtimeExecutiveInsightExperiencePlatformApprovedExports",
    "runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry",
    "runtimeExecutiveInsightExperiencePlatformFunctionalApiNames",
    "runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry",
    "runtimeExecutiveInsightExperiencePlatformUpstreamApiNames",
    "runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_BOUNDARY",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_STATUSES",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_COMPATIBILITY_STATUSES",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES",
    "RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRESENTATION_STATES",
    "RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES",
    "RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES",
    "RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS",
    "RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES",
    "RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS",
    "RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS",
    "RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES",
    "RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PUBLIC_TYPE_NAMES",
    // Upstream + platform functional APIs
    ...runtimeExecutiveInsightExperiencePlatformUpstreamApiNames,
    ...runtimeExecutiveInsightExperiencePlatformFunctionalApiNames,
    // Certification / freeze surface
    "runtimeExecutiveInsightExperienceCertificationFreezeIdentity",
    "runtimeExecutiveInsightExperienceCertificationFreezeVersion",
    "runtimeExecutiveInsightExperienceCertificationFreezeNamespace",
    "runtimeExecutiveInsightExperienceCertificationFreeze",
    "REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED",
    "RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS",
    "RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES",
    "RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS",
    "RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS",
    "RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS",
    "RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES",
    "RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES",
    "certifyRuntimeExecutiveInsightExperiencePlatform",
    "verifyRuntimeExecutiveInsightExperienceCertificationFreeze",
    "getRuntimeExecutiveInsightExperienceCertificationFreezeIdentity",
    "getRuntimeExecutiveInsightExperienceCertificationFreezeRegistry",
    "evaluateRuntimeExecutiveInsightExperienceCertificationStatuses",
  ] as const);

export type RuntimeExecutiveInsightExperienceApprovedExport =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightExperienceCertificationCheck {
  readonly id: string;
  readonly domain: RuntimeExecutiveInsightExperienceCertificationDomain;
  readonly status: RuntimeExecutiveInsightExperienceCertificationCheckStatus;
  readonly required: boolean;
  readonly code: RuntimeExecutiveInsightExperienceCertificationCode;
  readonly reference: string;
  readonly expected?: string;
  readonly actual?: string;
  readonly failureCode?: RuntimeExecutiveInsightExperienceCertificationFailureCode;
}

export interface RuntimeExecutiveInsightExperienceCertificationResult {
  readonly identity: typeof runtimeExecutiveInsightExperienceCertificationFreezeIdentity;
  readonly version: typeof runtimeExecutiveInsightExperienceCertificationFreezeVersion;
  readonly certificationStatus: RuntimeExecutiveInsightExperienceCertificationStatus;
  readonly compatibilityStatus: RuntimeExecutiveInsightExperienceCompatibilityStatus;
  readonly freezeStatus: RuntimeExecutiveInsightExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveInsightExperienceLockStatus;
  readonly readiness: RuntimeExecutiveInsightExperiencePublicIndexReadiness;
  readonly readinessDisplay: RuntimeExecutiveInsightExperiencePublicIndexReadinessDisplay;
  readonly domains: typeof RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS;
  readonly checks: ReadonlyArray<RuntimeExecutiveInsightExperienceCertificationCheck>;
  readonly totalCheckCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly platformIdentity: typeof runtimeExecutiveInsightExperiencePlatformIdentity;
  readonly platformVersion: typeof runtimeExecutiveInsightExperiencePlatformVersion;
  readonly platformLock: typeof REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED;
  readonly approvedExportCount: number;
  readonly approvedTypeCount: number;
  readonly approvedApiCount: number;
  readonly freezeInvariantCount: number;
  readonly certificationCodeCount: number;
  readonly failureCodeCount: number;
  readonly summary: string;
  readonly consumerRole: typeof runtimeExecutiveInsightExperienceCertificationFreezeConsumerRole;
}

export interface RuntimeExecutiveInsightExperienceCertificationStatuses {
  readonly certificationStatus: RuntimeExecutiveInsightExperienceCertificationStatus;
  readonly compatibilityStatus: RuntimeExecutiveInsightExperienceCompatibilityStatus;
  readonly freezeStatus: RuntimeExecutiveInsightExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveInsightExperienceLockStatus;
  readonly readiness: RuntimeExecutiveInsightExperiencePublicIndexReadiness;
  readonly readinessDisplay: RuntimeExecutiveInsightExperiencePublicIndexReadinessDisplay;
}

export interface RuntimeExecutiveInsightExperienceCertificationFreezeVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveInsightExperienceCertificationFreezeIdentity;
  readonly version: typeof runtimeExecutiveInsightExperienceCertificationFreezeVersion;
  readonly namespace: typeof runtimeExecutiveInsightExperienceCertificationFreezeNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveInsightExperienceCertificationFreezeDependencyIdentity;
  readonly certificationStatus: RuntimeExecutiveInsightExperienceCertificationStatus;
  readonly compatibilityStatus: RuntimeExecutiveInsightExperienceCompatibilityStatus;
  readonly freezeStatus: RuntimeExecutiveInsightExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveInsightExperienceLockStatus;
  readonly readiness: RuntimeExecutiveInsightExperiencePublicIndexReadiness;
  readonly readinessDisplay: RuntimeExecutiveInsightExperiencePublicIndexReadinessDisplay;
  readonly platformLock: typeof REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED;
  readonly domainCount: number;
  readonly checkCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly certificationCodeCount: number;
  readonly failureCodeCount: number;
  readonly freezeInvariantCount: number;
  readonly approvedExportCount: number;
  readonly approvedTypeCount: number;
  readonly approvedApiCount: number;
  readonly frozen: boolean;
  readonly platformOk: boolean;
  readonly readyForPublicIndex: boolean;
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

function semanticEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(input: {
  readonly id: string;
  readonly domain: RuntimeExecutiveInsightExperienceCertificationDomain;
  readonly code: RuntimeExecutiveInsightExperienceCertificationCode;
  readonly reference: string;
  readonly passed: boolean;
  readonly required?: boolean;
  readonly expected?: string;
  readonly actual?: string;
  readonly failureCode?: RuntimeExecutiveInsightExperienceCertificationFailureCode;
}): RuntimeExecutiveInsightExperienceCertificationCheck {
  return Object.freeze({
    id: input.id,
    domain: input.domain,
    status: input.passed ? ("passed" as const) : ("failed" as const),
    required: input.required ?? true,
    code: input.code,
    reference: input.reference,
    ...(input.expected !== undefined ? { expected: input.expected } : {}),
    ...(input.actual !== undefined ? { actual: input.actual } : {}),
    ...(input.failureCode !== undefined && !input.passed
      ? { failureCode: input.failureCode }
      : {}),
  });
}

function hasGuarantee(id: string): boolean {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES as readonly string[]
  ).includes(id);
}

function hasCapability(id: string): boolean {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES as readonly string[]
  ).includes(id);
}

/**
 * Pure fail-closed status derivation from check outcomes + compatibility.
 * Public certify() always uses live platform checks; tests may inject failures.
 */
export function evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
  checks: ReadonlyArray<{
    readonly required: boolean;
    readonly status: RuntimeExecutiveInsightExperienceCertificationCheckStatus;
  }>,
  compatibilityStatus: RuntimeExecutiveInsightExperienceCompatibilityStatus,
): RuntimeExecutiveInsightExperienceCertificationStatuses {
  const mandatoryFailed = checks.some(
    (entry) => entry.required && entry.status === "failed",
  );
  const certificationStatus: RuntimeExecutiveInsightExperienceCertificationStatus =
    !mandatoryFailed && compatibilityStatus === "compatible"
      ? "certified"
      : "failed";
  const resolvedCompatibility: RuntimeExecutiveInsightExperienceCompatibilityStatus =
    certificationStatus === "certified" ? "compatible" : "incompatible";
  const freezeStatus: RuntimeExecutiveInsightExperienceFreezeStatus =
    certificationStatus === "certified" &&
    resolvedCompatibility === "compatible"
      ? "frozen"
      : "unfrozen";
  const lockStatus: RuntimeExecutiveInsightExperienceLockStatus =
    freezeStatus === "frozen" ? "locked" : "unlocked";
  const readiness: RuntimeExecutiveInsightExperiencePublicIndexReadiness =
    lockStatus === "locked" ? "ready-for-public-index" : "not-ready";
  const readinessDisplay: RuntimeExecutiveInsightExperiencePublicIndexReadinessDisplay =
    readiness === "ready-for-public-index"
      ? "ReadyForPublicIndex"
      : "NotReady";

  return Object.freeze({
    certificationStatus,
    compatibilityStatus:
      certificationStatus === "certified"
        ? ("compatible" as const)
        : compatibilityStatus === "incompatible"
          ? ("incompatible" as const)
          : ("incompatible" as const),
    freezeStatus,
    lockStatus,
    readiness,
    readinessDisplay,
  });
}

// ─── Full-chain probe (platform re-exports only) ────────────────────────────

function runFullChainProbe(): {
  readonly ok: boolean;
  readonly deterministic: boolean;
  readonly inputsUnmutated: boolean;
} {
  const primary = createRuntimeExecutiveInsightSubjectContract({
    subjectId: "project.alpha",
    kind: "nexora-object",
    label: "Project Alpha",
    scope: "object",
  });
  const related = createRuntimeExecutiveInsightSubjectContract({
    subjectId: "kpi.delivery-reliability",
    kind: "kpi",
    label: "Delivery Reliability",
  });
  const source = createRuntimeExecutiveInsightSourceContract({
    kind: "runtime",
    sourceId: "runtime.1",
  });
  const evidence = createRuntimeExecutiveInsightEvidenceContract({
    evidenceId: "ev.metric",
    kind: "metric",
    source,
    subjectId: "project.alpha",
    payload: { previous: 94, current: 78, threshold: 85 },
    freshness: "current",
    observedAtIso: "2026-08-08T12:00:00.000Z",
  });
  const signal = createRuntimeExecutiveInsightSignalContract({
    signalId: "sig.metric",
    kind: "metric",
    subjectId: "project.alpha",
    source,
    direction: "decreasing",
    confidence: 0.8,
    freshness: "current",
    evidenceIds: ["ev.metric"],
  });
  const rule = createRuntimeExecutiveInsightResolutionRule({
    ruleId: "rule.threshold.delivery",
    ruleKind: "threshold",
    targetCategory: "threshold",
    applicableSubjectKinds: ["nexora-object", "kpi"],
    applicableEvidenceKinds: ["metric"],
    applicableSignalKinds: ["metric"],
    conditions: [
      {
        kind: "require-previous-and-current",
        previousField: "previous",
        currentField: "current",
      },
      {
        kind: "compare-current-to-threshold",
        currentField: "current",
        operator: "less-than",
      },
    ],
    output: {
      category: "threshold",
      directionFrom: "previous-current",
      severity: "high",
      importance: "high",
      confidence: 0.8,
      freshnessFrom: "evidence",
      scope: "object",
      candidateKey: "delivery-reliability-threshold",
    },
    precedence: 10,
    specificity: 5,
  });
  const priorityPolicy = createRuntimeExecutiveInsightPriorityPolicy({
    policyId: "policy.priority",
    weights: Object.freeze({
      severity: 0.1,
      importance: 0.1,
      urgency: 0.1,
      confidence: 0.1,
      freshness: 0.1,
      scope: 0.1,
      "focus-relevance": 0.1,
      "goal-relevance": 0.1,
      "decision-relevance": 0.1,
      "execution-relevance": 0.1,
    }),
  });
  const presentationPolicy = createRuntimeExecutiveInsightPresentationPolicy({
    policyId: "policy.presentation",
    requireOperationContext: true,
    showPriorityScore: true,
  });
  const orchestrationPolicy =
    createRuntimeExecutiveInsightExperienceOrchestrationPolicy({
      policyId: "policy.orchestration",
      policyVersion: "1",
      enabledCapabilities: [
        "StageSupportsFocus",
        "AdvisorContextAvailable",
        "SceneRelationshipExposureAvailable",
        "OperationInteractionAvailable",
      ],
      requireUniqueStageFocus: true,
      allowSparseMinimum: true,
      syncPresentationState: true,
    });

  const inputSnapshot = Object.freeze({
    primary: JSON.stringify(primary),
    related: JSON.stringify(related),
    evidence: JSON.stringify(evidence),
    signal: JSON.stringify(signal),
    rule: JSON.stringify(rule),
    priorityPolicy: JSON.stringify(priorityPolicy),
    presentationPolicy: JSON.stringify(presentationPolicy),
    orchestrationPolicy: JSON.stringify(orchestrationPolicy),
  });

  function once() {
    const resolution = resolveRuntimeExecutiveInsight({
      primarySubject: primary,
      relatedSubjects: [
        { subject: related, role: "related", order: 0 },
      ],
      evidence: [evidence],
      signals: [signal],
      context: {
        temporalRefIso: "2026-08-08T12:00:00.000Z",
        threshold: { value: 85, operator: "less-than", field: "current" },
        rules: [rule],
      },
      source,
      scope: "object",
    });
    if (resolution.status !== "resolved" || !resolution.candidate) {
      return undefined;
    }
    const priority = evaluateRuntimeExecutiveInsightPriority({
      candidate: resolution.candidate,
      context: {
        focusedSubjectId: primary.subjectId,
        decisionSubjectIds: ["decision.1"],
        executionSubjectIds: ["execution.1"],
      },
      policy: priorityPolicy,
    });
    const presentation = resolveRuntimeExecutiveInsightPresentation({
      candidate: resolution.candidate,
      priority,
      requestedState: "report",
      context: {
        focusedSubjectId: primary.subjectId,
        decisionRefs: ["decision.1"],
        executionRefs: ["execution.1"],
        scenarioRefs: ["scenario.1"],
        problemRefs: ["problem.1"],
        packRefs: ["pack.1"],
      },
      policy: presentationPolicy,
    });
    const orchestration = orchestrateRuntimeExecutiveInsightExperience({
      presentation,
      eventKind: "insight-selected",
      experienceContext: Object.freeze({
        selectedSubjectId: "project.alpha",
        focusedSubjectId: "project.alpha",
        activeDecisionId: "decision.1",
        activeExecutionId: "execution.1",
        activeScenarioId: "scenario.1",
        activeProblemId: "problem.1",
        activePackId: "pack.1",
        activePresentationState: "report" as const,
      }),
      stageContext: Object.freeze({
        selectedStageSubjectId: "project.alpha",
        sceneRef: "scene.1",
      }),
      advisorContext: Object.freeze({
        currentAdvisorSubjectId: "project.alpha",
      }),
      sceneContext: Object.freeze({
        sceneId: "scene.1",
      }),
      policy: orchestrationPolicy,
    });
    return Object.freeze({ resolution, priority, presentation, orchestration });
  }

  const first = once();
  const second = once();
  const ok =
    first !== undefined &&
    second !== undefined &&
    first.orchestration.status !== undefined;
  const deterministic =
    ok &&
    semanticEqual(first!.resolution, second!.resolution) &&
    semanticEqual(first!.priority, second!.priority) &&
    semanticEqual(first!.presentation, second!.presentation) &&
    semanticEqual(first!.orchestration, second!.orchestration);
  const inputsUnmutated =
    inputSnapshot.primary === JSON.stringify(primary) &&
    inputSnapshot.related === JSON.stringify(related) &&
    inputSnapshot.evidence === JSON.stringify(evidence) &&
    inputSnapshot.signal === JSON.stringify(signal) &&
    inputSnapshot.rule === JSON.stringify(rule) &&
    inputSnapshot.priorityPolicy === JSON.stringify(priorityPolicy) &&
    inputSnapshot.presentationPolicy === JSON.stringify(presentationPolicy) &&
    inputSnapshot.orchestrationPolicy === JSON.stringify(orchestrationPolicy);

  return Object.freeze({ ok: ok === true, deterministic, inputsUnmutated });
}

// ─── Certification checks ───────────────────────────────────────────────────

function buildCertificationChecks(): ReadonlyArray<RuntimeExecutiveInsightExperienceCertificationCheck> {
  const platform = runtimeExecutiveInsightExperiencePlatform;
  const boundary = RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_BOUNDARY;
  const freezeBoundary = RUNTIME_EXECUTIVE_INSIGHT_CERTIFICATION_FREEZE_BOUNDARY;
  const verification = verifyRuntimeExecutiveInsightExperiencePlatform();
  const identity = getRuntimeExecutiveInsightExperiencePlatformIdentity();
  const registry = getRuntimeExecutiveInsightExperiencePlatformRegistry();
  const compatibility = verifyRuntimeExecutiveInsightExperienceCompatibility({
    identity: runtimeExecutiveInsightExperiencePlatformIdentity,
    version: runtimeExecutiveInsightExperiencePlatformVersion,
    presentationStates: [
      ...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
    ],
    capabilities: [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES],
  });
  const probe = runFullChainProbe();
  const forbiddenKor = ["k", "o", "r"].join("");
  const presentationStates = [
    ...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
  ];

  const approvedExportsUnique = unique([
    ...RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS,
  ]);
  const approvedTypesUnique = unique([
    ...RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES,
  ]);
  const approvedApisUnique = unique([
    ...RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS,
  ]);
  const invariantIdsUnique = unique(
    RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.map(
      (entry) => entry.id,
    ),
  );
  const certificationCodesUnique = unique([
    ...RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES,
  ]);
  const failureCodesUnique = unique([
    ...RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES,
  ]);

  return Object.freeze([
    // Identity
    check({
      id: "platform-identity",
      domain: "Identity",
      code: "identity-valid",
      reference: "REX-4:7 platform identity exact",
      expected: "REX-4:7/RuntimeExecutiveInsightExperiencePlatform",
      actual: platform.identity,
      passed:
        platform.identity ===
          "REX-4:7/RuntimeExecutiveInsightExperiencePlatform" &&
        identity.identity === platform.identity &&
        platform.capability === "RuntimeExecutiveInsightExperience" &&
        platform.phase === "Platform" &&
        platform.status === "PlatformReady" &&
        runtimeExecutiveInsightExperienceCertificationFreezeIdentity ===
          "REX-4:8/RuntimeExecutiveInsightExperienceCertificationFreeze",
      failureCode: "invalid-identity",
    }),
    check({
      id: "platform-version",
      domain: "Identity",
      code: "version-valid",
      reference: "REX-4:7 version exact",
      expected: "4.7.0",
      actual: platform.version,
      passed:
        platform.version === "4.7.0" &&
        identity.version === "4.7.0" &&
        runtimeExecutiveInsightExperienceCertificationFreezeVersion === "4.8.0",
      failureCode: "invalid-version",
    }),
    check({
      id: "platform-namespace",
      domain: "Identity",
      code: "namespace-valid",
      reference: "REX-4:7 namespace / layer exact",
      expected: "nexora.rex.insight-experience.platform",
      actual: platform.namespace,
      passed:
        platform.namespace === "nexora.rex.insight-experience.platform" &&
        platform.layer === "REX" &&
        runtimeExecutiveInsightExperienceCertificationFreezeNamespace ===
          "nexora.rex.insight-experience.certification-freeze" &&
        runtimeExecutiveInsightExperienceCertificationFreezeLayer === "REX" &&
        runtimeExecutiveInsightExperienceCertificationFreezePhase ===
          "CertificationFreeze",
      failureCode: "invalid-namespace",
    }),

    // Dependency
    check({
      id: "sole-platform-dependency",
      domain: "Dependency",
      code: "dependency-valid",
      reference: "REX-4:8 depends only on REX-4:7",
      expected: "REX-4:7/RuntimeExecutiveInsightExperiencePlatform",
      actual:
        runtimeExecutiveInsightExperienceCertificationFreezeDependencyIdentity,
      passed:
        freezeBoundary.soleImmediateDependency ===
          "REX-4:7/RuntimeExecutiveInsightExperiencePlatform" &&
        freezeBoundary.consumesPlatformOnly === true &&
        freezeBoundary.importsRex46Directly === false &&
        freezeBoundary.importsRex45Directly === false &&
        freezeBoundary.importsRex44Directly === false &&
        freezeBoundary.importsRex43Directly === false &&
        freezeBoundary.importsRex42Directly === false &&
        freezeBoundary.importsRex41Directly === false &&
        freezeBoundary.importsRex49Directly === false &&
        platform.upstreamDependency ===
          "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration" &&
        boundary.consumesOrchestrationOnly === true,
      failureCode: "invalid-dependency",
    }),

    // Platform verification
    check({
      id: "platform-verification",
      domain: "PlatformVerification",
      code: "platform-verification-passed",
      reference: "verifyRuntimeExecutiveInsightExperiencePlatform()",
      passed:
        verification.status === "verified" &&
        verification.failed === 0 &&
        verification.orchestrationOk === true,
      failureCode: "platform-verification-failed",
    }),

    // Public surface
    check({
      id: "public-surface",
      domain: "PublicSurface",
      code: "public-surface-valid",
      reference: "platform public surface coherent",
      passed:
        registry.exportCount ===
          runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry
            .length &&
        registry.typeCount ===
          runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry.length &&
        registry.apiCount ===
          runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry
            .length &&
        exactOrder(
          [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES],
          [
            "Identity",
            "Validation",
            "Resolution",
            "Priority",
            "Attention",
            "Presentation",
            "Orchestration",
            "Compatibility",
            "Registry",
          ],
        ) &&
        unique([
          ...runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry,
        ]),
      failureCode: "missing-approved-export",
    }),
    check({
      id: "approved-exports",
      domain: "PublicSurface",
      code: "approved-exports-valid",
      reference: "approved exports unique and complete",
      passed:
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS.length > 0 &&
        approvedExportsUnique &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS.includes(
          "certifyRuntimeExecutiveInsightExperiencePlatform",
        ) &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS.includes(
          "runtimeExecutiveInsightExperiencePlatform",
        ) &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS.includes(
          "REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED",
        ),
      failureCode: approvedExportsUnique
        ? "missing-approved-export"
        : "duplicate-approved-export",
    }),
    check({
      id: "approved-types",
      domain: "PublicSurface",
      code: "approved-types-valid",
      reference: "approved public types unique",
      passed:
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES.length > 0 &&
        approvedTypesUnique,
      failureCode: "duplicate-approved-export",
    }),
    check({
      id: "approved-apis",
      domain: "PublicSurface",
      code: "approved-apis-valid",
      reference: "approved APIs unique and callable",
      passed:
        approvedApisUnique &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS.includes(
          "certifyRuntimeExecutiveInsightExperiencePlatform",
        ) &&
        typeof verifyRuntimeExecutiveInsightExperienceCompatibility ===
          "function" &&
        typeof resolveRuntimeExecutiveInsight === "function" &&
        typeof orchestrateRuntimeExecutiveInsightExperience === "function" &&
        typeof getRuntimeExecutiveInsightExperiencePlatformIdentity ===
          "function",
      failureCode: "missing-approved-export",
    }),

    // Contracts
    check({
      id: "contracts-surface",
      domain: "Contracts",
      code: "contracts-valid",
      reference: "contract create/validate APIs preserved",
      passed:
        hasCapability("contracts") &&
        hasCapability("validation") &&
        typeof createRuntimeExecutiveInsightSubjectContract === "function" &&
        typeof createRuntimeExecutiveInsightEvidenceContract === "function" &&
        typeof createRuntimeExecutiveInsightSignalContract === "function" &&
        typeof createRuntimeExecutiveInsightSourceContract === "function" &&
        typeof validateRuntimeExecutiveInsightContract === "function" &&
        typeof validateRuntimeExecutiveInsightSubjectContract === "function" &&
        typeof validateRuntimeExecutiveInsightEvidenceCollectionContract ===
          "function" &&
        typeof validateRuntimeExecutiveInsightSignalCollectionContract ===
          "function",
      failureCode: "platform-verification-failed",
    }),

    // Resolution
    check({
      id: "resolution-surface",
      domain: "Resolution",
      code: "resolution-valid",
      reference: "resolution statuses/categories + APIs",
      passed:
        hasCapability("resolution") &&
        RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES.length > 0 &&
        RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES.length > 0 &&
        typeof resolveRuntimeExecutiveInsight === "function" &&
        typeof resolveRuntimeExecutiveInsights === "function" &&
        typeof createRuntimeExecutiveInsightResolutionRule === "function" &&
        !runtimeExecutiveInsightExperiencePlatformUpstreamApiNames.some(
          (name) => /random|timestamp|now|uuid/i.test(name),
        ),
      failureCode: "nondeterministic-platform",
    }),

    // Priority / attention
    check({
      id: "priority-attention-surface",
      domain: "PriorityAttention",
      code: "priority-attention-valid",
      reference: "priority bands + attention states + APIs",
      passed:
        hasCapability("priority") &&
        hasCapability("attention") &&
        hasCapability("ranking") &&
        RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS.length > 0 &&
        RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES.length > 0 &&
        typeof evaluateRuntimeExecutiveInsightPriority === "function" &&
        typeof rankRuntimeExecutiveInsights === "function" &&
        typeof resolveRuntimeExecutiveInsightAttention === "function" &&
        typeof createRuntimeExecutiveInsightPriorityPolicy === "function" &&
        typeof validateRuntimeExecutiveInsightPriorityPolicy === "function",
      failureCode: "platform-verification-failed",
    }),

    // Presentation
    check({
      id: "presentation-states",
      domain: "Presentation",
      code: "presentation-valid",
      reference: "exact minimum|report|operation",
      expected: "minimum,report,operation",
      actual: presentationStates.join(","),
      passed:
        exactOrder(presentationStates, ["minimum", "report", "operation"]) &&
        presentationStates.length === 3 &&
        hasCapability("presentation") &&
        typeof resolveRuntimeExecutiveInsightPresentation === "function" &&
        typeof resolveRuntimeExecutiveInsightInteractions === "function" &&
        typeof createRuntimeExecutiveInsightPresentationPolicy === "function" &&
        typeof validateRuntimeExecutiveInsightPresentationInput ===
          "function" &&
        boundary.executesActions === false &&
        boundary.rendersUi === false,
      failureCode: "terminology-violation",
    }),

    // Orchestration
    check({
      id: "orchestration-surface",
      domain: "Orchestration",
      code: "orchestration-valid",
      reference: "orchestration intents/statuses + APIs",
      passed:
        hasCapability("orchestration") &&
        hasCapability("stage-context") &&
        hasCapability("advisor-context") &&
        hasCapability("scene-context") &&
        RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES.length > 0 &&
        RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS.length > 0 &&
        typeof orchestrateRuntimeExecutiveInsightExperience === "function" &&
        typeof orchestrateRuntimeExecutiveInsightSelection === "function" &&
        typeof orchestrateRuntimeExecutiveInsightFocus === "function" &&
        typeof resolveRuntimeExecutiveInsightExperienceContexts ===
          "function" &&
        typeof resolveRuntimeExecutiveInsightExperienceIntents === "function" &&
        typeof createRuntimeExecutiveInsightExperienceOrchestrationPolicy ===
          "function" &&
        typeof verifyRuntimeExecutiveInsightExperienceOrchestration ===
          "function" &&
        verifyRuntimeExecutiveInsightExperienceOrchestration().ok === true,
      failureCode: "platform-verification-failed",
    }),

    // Compatibility
    check({
      id: "compatibility",
      domain: "Compatibility",
      code: "compatibility-valid",
      reference: "canonical platform compatibility",
      passed:
        compatibility.status === "compatible" &&
        exactOrder(
          [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_COMPATIBILITY_STATUSES],
          ["compatible", "incompatible"],
        ) &&
        verifyRuntimeExecutiveInsightExperienceCompatibility({
          identity: "wrong",
        }).status === "incompatible",
      failureCode: "incompatible-platform",
    }),

    // Determinism (+ full-chain probe)
    check({
      id: "determinism-and-full-chain",
      domain: "Determinism",
      code: "determinism-valid",
      reference: "repeated identity/registry/verify + full-chain probe",
      passed:
        platform.Identity.deterministic === true &&
        boundary.pureFunctions === true &&
        boundary.stateless === true &&
        semanticEqual(
          getRuntimeExecutiveInsightExperiencePlatformIdentity(),
          getRuntimeExecutiveInsightExperiencePlatformIdentity(),
        ) &&
        semanticEqual(
          getRuntimeExecutiveInsightExperiencePlatformRegistry(),
          getRuntimeExecutiveInsightExperiencePlatformRegistry(),
        ) &&
        semanticEqual(
          verifyRuntimeExecutiveInsightExperiencePlatform(),
          verifyRuntimeExecutiveInsightExperiencePlatform(),
        ) &&
        probe.ok === true &&
        probe.deterministic === true,
      failureCode: "nondeterministic-platform",
    }),

    // Immutability
    check({
      id: "immutability",
      domain: "Immutability",
      code: "immutability-valid",
      reference: "frozen registries + unmutated probe inputs",
      passed:
        Object.isFrozen(platform) &&
        Object.isFrozen(runtimeExecutiveInsightExperiencePlatformRegistry) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS,
        ) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS,
        ) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS,
        ) &&
        verification.frozen === true &&
        probe.inputsUnmutated === true &&
        hasGuarantee("immutable-inputs") &&
        hasGuarantee("immutable-results") &&
        hasGuarantee("immutable-registry"),
      failureCode: "mutable-registry",
    }),

    // Consumer guarantees
    check({
      id: "consumer-guarantees",
      domain: "ConsumerGuarantees",
      code: "consumer-guarantees-valid",
      reference: "mandatory REX-4:7 consumer guarantees",
      passed:
        hasGuarantee("deterministic-platform-surface") &&
        hasGuarantee("immutable-inputs") &&
        hasGuarantee("no-ai") &&
        hasGuarantee("no-llm") &&
        hasGuarantee("no-react") &&
        hasGuarantee("no-rendering") &&
        hasGuarantee("no-persistence") &&
        hasGuarantee("no-external-integration") &&
        hasGuarantee("no-automation") &&
        hasGuarantee("no-semantic-rewriting") &&
        hasGuarantee("no-kpi-calculation") &&
        hasGuarantee("no-koi-calculation") &&
        hasGuarantee("no-kor-introduction") &&
        hasGuarantee("presentation-states-preserved") &&
        unique([...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES]),
      failureCode: "platform-verification-failed",
    }),

    // Forbidden dependencies (self + platform boundary flags)
    check({
      id: "forbidden-dependencies",
      domain: "ForbiddenDependencies",
      code: "forbidden-dependencies-absent",
      reference: "no forbidden direct imports / boundary flags",
      passed:
        freezeBoundary.importsRex46Directly === false &&
        freezeBoundary.importsRex41Directly === false &&
        freezeBoundary.importsRex49Directly === false &&
        freezeBoundary.importsDriDirectly === false &&
        freezeBoundary.importsNolDirectly === false &&
        freezeBoundary.importsExDriDirectly === false &&
        boundary.importsRex45Directly === false &&
        boundary.importsDriDirectly === false &&
        boundary.importsNolDirectly === false &&
        freezeBoundary.introducesRuntimeBehavior === false &&
        freezeBoundary.modifiesPlatformBehavior === false,
      failureCode: "forbidden-import",
    }),
    check({
      id: "ai-absent",
      domain: "ForbiddenDependencies",
      code: "ai-dependency-absent",
      reference: "AI/LLM independence",
      passed:
        boundary.aiProviderIndependent === true &&
        freezeBoundary.aiProviderIndependent === true &&
        hasGuarantee("no-ai") &&
        hasGuarantee("no-llm") &&
        boundary.introducesLlmGeneration === false,
      failureCode: "ai-dependency-detected",
    }),
    check({
      id: "renderer-absent",
      domain: "ForbiddenDependencies",
      code: "renderer-dependency-absent",
      reference: "React/renderer independence",
      passed:
        boundary.reactIndependent === true &&
        boundary.rendererIndependent === true &&
        freezeBoundary.reactIndependent === true &&
        freezeBoundary.rendersUi === false &&
        hasGuarantee("no-react") &&
        hasGuarantee("no-rendering"),
      failureCode: "renderer-dependency-detected",
    }),
    check({
      id: "persistence-absent",
      domain: "ForbiddenDependencies",
      code: "persistence-dependency-absent",
      reference: "no persistence",
      passed:
        boundary.introducesPersistence === false &&
        freezeBoundary.introducesPersistence === false &&
        hasGuarantee("no-persistence"),
      failureCode: "persistence-dependency-detected",
    }),
    check({
      id: "external-access-absent",
      domain: "ForbiddenDependencies",
      code: "external-access-absent",
      reference: "no external integration",
      passed:
        boundary.introducesExternalIntegration === false &&
        freezeBoundary.introducesExternalIntegration === false &&
        hasGuarantee("no-external-integration"),
      failureCode: "external-access-detected",
    }),
    check({
      id: "automation-absent",
      domain: "ForbiddenDependencies",
      code: "automation-behavior-absent",
      reference: "no automation / action execution",
      passed:
        boundary.introducesAutomation === false &&
        freezeBoundary.introducesAutomation === false &&
        boundary.executesActions === false &&
        freezeBoundary.executesActions === false &&
        hasGuarantee("no-automation"),
      failureCode: "automation-behavior-detected",
    }),

    // Terminology
    check({
      id: "kpi-semantics",
      domain: "Terminology",
      code: "kpi-semantics-valid",
      reference: "KPI = Key Performance Indicator; not calculated",
      passed:
        RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS.includes("kpi") &&
        boundary.calculatesKpi === false &&
        freezeBoundary.calculatesKpi === false &&
        verification.calculatesKpi === false &&
        hasGuarantee("no-kpi-calculation"),
      failureCode: "terminology-violation",
    }),
    check({
      id: "koi-semantics",
      domain: "Terminology",
      code: "koi-semantics-valid",
      reference: "KOI = Key Output Index; not calculated",
      passed:
        RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS.includes("koi") &&
        boundary.calculatesKoi === false &&
        freezeBoundary.calculatesKoi === false &&
        verification.calculatesKoi === false &&
        hasGuarantee("no-koi-calculation"),
      failureCode: "terminology-violation",
    }),
    check({
      id: "kor-absent",
      domain: "Terminology",
      code: "kor-absent",
      reference: "KOR prohibited",
      passed:
        !(
          RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS as readonly string[]
        ).includes(forbiddenKor) &&
        RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS
          .introducesKor === false &&
        boundary.introducesKor === false &&
        freezeBoundary.introducesKor === false &&
        verification.noKor === true &&
        hasGuarantee("no-kor-introduction") &&
        !RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS.some((name) =>
          name.toLowerCase().includes(forbiddenKor),
        ),
      failureCode: "terminology-violation",
    }),
    check({
      id: "terminology-invariants",
      domain: "Terminology",
      code: "freeze-invariants-valid",
      reference: "severity/importance/attention/selection/insight distinctions",
      passed:
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.some(
          (entry) => entry.id === "severity-not-priority",
        ) &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.some(
          (entry) => entry.id === "importance-not-priority",
        ) &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.some(
          (entry) => entry.id === "attention-not-focus",
        ) &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.some(
          (entry) => entry.id === "selection-not-focus",
        ) &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.some(
          (entry) => entry.id === "operation-not-action-execution",
        ) &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.some(
          (entry) => entry.id === "insight-not-recommendation",
        ) &&
        invariantIdsUnique &&
        certificationCodesUnique &&
        failureCodesUnique,
      failureCode: "terminology-violation",
    }),

    // Freeze
    check({
      id: "freeze-surface",
      domain: "Freeze",
      code: "freeze-invariants-valid",
      reference: "freeze invariants required + unique",
      passed:
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.length > 0 &&
        RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.every(
          (entry) => entry.required === true,
        ) &&
        invariantIdsUnique &&
        Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS) &&
        freezeBoundary.preparesPublicIndex === true &&
        freezeBoundary.isFinalPublicConsumerIndex === false,
      failureCode: "mutable-registry",
    }),

    // Lock
    check({
      id: "platform-lock",
      domain: "Lock",
      code: "platform-lock-valid",
      reference: "exact platform lock constant",
      expected: "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-LOCKED",
      actual: REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED,
      passed:
        REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED ===
          "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-LOCKED" &&
        RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER ===
          "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-PREFREEZE" &&
        !String(RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER).endsWith(
          "-LOCKED",
        ),
      failureCode: "lock-mismatch",
    }),

    // Public index readiness prerequisites (gate computed after checks)
    check({
      id: "public-index-prerequisites",
      domain: "PublicIndexReadiness",
      code: "public-index-readiness-valid",
      reference: "ready only when certified/compatible/frozen/locked",
      passed:
        freezeBoundary.preparesPublicIndex === true &&
        freezeBoundary.claimsReleased === false &&
        freezeBoundary.claimsReadyForConsumer === false &&
        freezeBoundary.claimsFinalConsumerEntry === false &&
        freezeBoundary.consumerRole === "CertifiedFrozenPlatformBoundary" &&
        runtimeExecutiveInsightExperienceCertificationFreezeConsumerRole ===
          "CertifiedFrozenPlatformBoundary" &&
        runtimeExecutiveInsightExperienceCertificationFreezeStatus ===
          "ReadyForPublicIndex",
      failureCode: "not-ready-for-public-index",
    }),
  ]);
}

// forward declaration satisfaction for approved-apis check referencing certify
function certifyRuntimeExecutiveInsightExperiencePlatformImpl(): RuntimeExecutiveInsightExperienceCertificationResult {
  const checks = buildCertificationChecks();
  const passedCheckCount = checks.filter(
    (entry) => entry.status === "passed",
  ).length;
  const failedCheckCount = checks.length - passedCheckCount;
  const compatibilityLive =
    verifyRuntimeExecutiveInsightExperienceCompatibility({
      identity: runtimeExecutiveInsightExperiencePlatformIdentity,
      version: runtimeExecutiveInsightExperiencePlatformVersion,
      presentationStates: [
        ...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
      ],
      capabilities: [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES],
    });
  const statuses = evaluateRuntimeExecutiveInsightExperienceCertificationStatuses(
    checks,
    compatibilityLive.status,
  );

  const summary =
    statuses.certificationStatus === "certified" &&
    statuses.compatibilityStatus === "compatible" &&
    statuses.freezeStatus === "frozen" &&
    statuses.lockStatus === "locked" &&
    statuses.readiness === "ready-for-public-index"
      ? "Certified · Compatible · Frozen · Locked · ReadyForPublicIndex"
      : "Failed · Incompatible · Unfrozen · Unlocked · NotReady";

  return Object.freeze({
    identity: runtimeExecutiveInsightExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveInsightExperienceCertificationFreezeVersion,
    certificationStatus: statuses.certificationStatus,
    compatibilityStatus: statuses.compatibilityStatus,
    freezeStatus: statuses.freezeStatus,
    lockStatus: statuses.lockStatus,
    readiness: statuses.readiness,
    readinessDisplay: statuses.readinessDisplay,
    domains: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS,
    checks,
    totalCheckCount: checks.length,
    passedCheckCount,
    failedCheckCount,
    platformIdentity: runtimeExecutiveInsightExperiencePlatformIdentity,
    platformVersion: runtimeExecutiveInsightExperiencePlatformVersion,
    platformLock: REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED,
    approvedExportCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS.length,
    approvedTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES.length,
    approvedApiCount: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS.length,
    freezeInvariantCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.length,
    certificationCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES.length,
    failureCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES.length,
    summary,
    consumerRole:
      runtimeExecutiveInsightExperienceCertificationFreezeConsumerRole,
  });
}

export function certifyRuntimeExecutiveInsightExperiencePlatform():
  RuntimeExecutiveInsightExperienceCertificationResult {
  return certifyRuntimeExecutiveInsightExperiencePlatformImpl();
}

export function getRuntimeExecutiveInsightExperienceCertificationFreezeIdentity():
  typeof runtimeExecutiveInsightExperienceCertificationFreezeCanonicalIdentity {
  return runtimeExecutiveInsightExperienceCertificationFreezeCanonicalIdentity;
}

export const runtimeExecutiveInsightExperienceCertificationFreezeRegistry =
  Object.freeze({
    identity: runtimeExecutiveInsightExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveInsightExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveInsightExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveInsightExperienceCertificationFreezeLayer,
    capability: runtimeExecutiveInsightExperienceCertificationFreezeCapability,
    phase: runtimeExecutiveInsightExperienceCertificationFreezePhase,
    consumerRole:
      runtimeExecutiveInsightExperienceCertificationFreezeConsumerRole,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveInsightExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperienceCertificationFreezeSupportedImportPath,
    domains: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS,
    domainCount: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS.length,
    certificationCodes: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES,
    certificationCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES.length,
    failureCodes:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES,
    failureCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES.length,
    certificationStatuses:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_STATUSES,
    compatibilityStatuses:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_COMPATIBILITY_STATUSES,
    freezeStatuses: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_STATUSES,
    lockStatuses: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_LOCK_STATUSES,
    readiness: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_READINESS,
    readinessDisplay:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_PUBLIC_INDEX_READINESS_DISPLAY,
    checkStatuses:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CHECK_STATUSES,
    approvedExports: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS,
    approvedExportCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS.length,
    approvedPublicTypes:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES,
    approvedTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES.length,
    approvedApis: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS,
    approvedApiCount: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS.length,
    freezeInvariants: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS,
    freezeInvariantCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.length,
    consumerGuarantees: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES,
    consumerGuaranteeCount:
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.length,
    platformLock: REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED,
    compatibility: "compatible" as const,
    publicIndexReadiness: "ready-for-public-index" as const,
  });

export function getRuntimeExecutiveInsightExperienceCertificationFreezeRegistry():
  typeof runtimeExecutiveInsightExperienceCertificationFreezeRegistry {
  return runtimeExecutiveInsightExperienceCertificationFreezeRegistry;
}

export const runtimeExecutiveInsightExperienceCertificationFreeze =
  Object.freeze({
    phase: "CertificationFreeze" as const,
    name: "RuntimeExecutiveInsightExperienceCertificationFreeze" as const,
    identity: runtimeExecutiveInsightExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveInsightExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveInsightExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveInsightExperienceCertificationFreezeLayer,
    capability: runtimeExecutiveInsightExperienceCertificationFreezeCapability,
    status: runtimeExecutiveInsightExperienceCertificationFreezeStability,
    architecturalRole:
      runtimeExecutiveInsightExperienceCertificationFreezeArchitecturalRole,
    consumerRole:
      runtimeExecutiveInsightExperienceCertificationFreezeConsumerRole,
    upstreamDependency:
      runtimeExecutiveInsightExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveInsightExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperienceCertificationFreezeSupportedImportPath,
    deterministic:
      runtimeExecutiveInsightExperienceCertificationFreezeDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    aiProviderIndependent: true as const,
    principle: RUNTIME_EXECUTIVE_INSIGHT_CERTIFICATION_FREEZE_PRINCIPLE,
    boundary: RUNTIME_EXECUTIVE_INSIGHT_CERTIFICATION_FREEZE_BOUNDARY,
    domains: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS,
    certificationCodes:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES,
    failureCodes:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES,
    freezeInvariants: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS,
    approvedExports: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS,
    approvedPublicTypes:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES,
    approvedApis: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS,
    platformLock: REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED,
    registry: runtimeExecutiveInsightExperienceCertificationFreezeRegistry,
    platformBoundary: "REX-4:7-platform-only" as const,
    architecturalStatus:
      "REX-4:8 Certification & Freeze Complete — Ready for REX-4:9 Public Index" as const,
  });

export function verifyRuntimeExecutiveInsightExperienceCertificationFreeze():
  RuntimeExecutiveInsightExperienceCertificationFreezeVerification {
  const freezeArtifact = runtimeExecutiveInsightExperienceCertificationFreeze;
  const registry = runtimeExecutiveInsightExperienceCertificationFreezeRegistry;
  const platformOk = verifyRuntimeExecutiveInsightExperiencePlatform();
  const report = certifyRuntimeExecutiveInsightExperiencePlatform();

  const identityOk =
    freezeArtifact.identity ===
      "REX-4:8/RuntimeExecutiveInsightExperienceCertificationFreeze" &&
    freezeArtifact.version === "4.8.0" &&
    freezeArtifact.namespace ===
      "nexora.rex.insight-experience.certification-freeze" &&
    freezeArtifact.layer === "REX" &&
    freezeArtifact.capability === "RuntimeExecutiveInsightExperience" &&
    freezeArtifact.consumerRole === "CertifiedFrozenPlatformBoundary" &&
    freezeArtifact.upstreamDependency ===
      "REX-4:7/RuntimeExecutiveInsightExperiencePlatform" &&
    freezeArtifact.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveInsightExperiencePlatform" &&
    freezeArtifact.platformBoundary === "REX-4:7-platform-only";

  const vocabOk =
    exactOrder(
      [...RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS],
      [
        "Identity",
        "Dependency",
        "PlatformVerification",
        "PublicSurface",
        "Contracts",
        "Resolution",
        "PriorityAttention",
        "Presentation",
        "Orchestration",
        "Compatibility",
        "Determinism",
        "Immutability",
        "ConsumerGuarantees",
        "ForbiddenDependencies",
        "Terminology",
        "Freeze",
        "Lock",
        "PublicIndexReadiness",
      ],
    ) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES],
      [...RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES],
    ) &&
    unique([...RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS]) &&
    unique(
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.map((e) => e.id),
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES.length === 30 &&
    RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES.length ===
      19 &&
    RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.length === 30;

  const domainCoverage =
    RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS.every((domain) =>
      report.checks.some((entry) => entry.domain === domain),
    );

  const frozen =
    Object.isFrozen(freezeArtifact) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS) &&
    Object.isFrozen(report) &&
    Object.isFrozen(report.checks);

  const ok =
    identityOk &&
    vocabOk &&
    domainCoverage &&
    frozen &&
    platformOk.status === "verified" &&
    report.certificationStatus === "certified" &&
    report.compatibilityStatus === "compatible" &&
    report.freezeStatus === "frozen" &&
    report.lockStatus === "locked" &&
    report.readiness === "ready-for-public-index" &&
    report.readinessDisplay === "ReadyForPublicIndex" &&
    report.failedCheckCount === 0 &&
    report.platformLock ===
      REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveInsightExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveInsightExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveInsightExperienceCertificationFreezeNamespace,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceCertificationFreezeDependencyIdentity,
    certificationStatus: report.certificationStatus,
    compatibilityStatus: report.compatibilityStatus,
    freezeStatus: report.freezeStatus,
    lockStatus: report.lockStatus,
    readiness: report.readiness,
    readinessDisplay: report.readinessDisplay,
    platformLock: REX_4_EXECUTIVE_INSIGHT_EXPERIENCE_PLATFORM_LOCKED,
    domainCount: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_DOMAINS.length,
    checkCount: report.totalCheckCount,
    passedCheckCount: report.passedCheckCount,
    failedCheckCount: report.failedCheckCount,
    certificationCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_CODES.length,
    failureCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_CERTIFICATION_FAILURE_CODES.length,
    freezeInvariantCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_FREEZE_INVARIANTS.length,
    approvedExportCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_EXPORTS.length,
    approvedTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_PUBLIC_TYPES.length,
    approvedApiCount: RUNTIME_EXECUTIVE_INSIGHT_EXPERIENCE_APPROVED_APIS.length,
    frozen,
    platformOk: platformOk.status === "verified",
    readyForPublicIndex: report.readiness === "ready-for-public-index",
  });
}

// ─── Frozen re-exports for REX-4:9 (platform surface only) ──────────────────

export {
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_BOUNDARY,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_COMPATIBILITY_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PUBLIC_TYPE_NAMES,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS,
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightExperienceOrchestrationPolicy,
  createRuntimeExecutiveInsightPresentationPolicy,
  createRuntimeExecutiveInsightPriorityPolicy,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  evaluateRuntimeExecutiveInsightPriority,
  getRuntimeExecutiveInsightExperiencePlatformCapabilities,
  getRuntimeExecutiveInsightExperiencePlatformIdentity,
  getRuntimeExecutiveInsightExperiencePlatformRegistry,
  orchestrateRuntimeExecutiveInsightExperience,
  orchestrateRuntimeExecutiveInsightFocus,
  orchestrateRuntimeExecutiveInsightSelection,
  rankRuntimeExecutiveInsights,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsightAttention,
  resolveRuntimeExecutiveInsightExperienceContexts,
  resolveRuntimeExecutiveInsightExperienceIntents,
  resolveRuntimeExecutiveInsightInteractions,
  resolveRuntimeExecutiveInsightPresentation,
  resolveRuntimeExecutiveInsights,
  runtimeExecutiveInsightExperiencePlatform,
  runtimeExecutiveInsightExperiencePlatformApprovedExports,
  runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry,
  runtimeExecutiveInsightExperiencePlatformCanonicalIdentity,
  runtimeExecutiveInsightExperiencePlatformCapability,
  runtimeExecutiveInsightExperiencePlatformDependencyIdentity,
  runtimeExecutiveInsightExperiencePlatformDependencyPath,
  runtimeExecutiveInsightExperiencePlatformFunctionalApiNames,
  runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry,
  runtimeExecutiveInsightExperiencePlatformIdentity,
  runtimeExecutiveInsightExperiencePlatformLayer,
  runtimeExecutiveInsightExperiencePlatformNamespace,
  runtimeExecutiveInsightExperiencePlatformPhase,
  runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry,
  runtimeExecutiveInsightExperiencePlatformRegistry,
  runtimeExecutiveInsightExperiencePlatformStatus,
  runtimeExecutiveInsightExperiencePlatformSupportedImportPath,
  runtimeExecutiveInsightExperiencePlatformUpstreamApiNames,
  runtimeExecutiveInsightExperiencePlatformVersion,
  supportsRuntimeExecutiveInsightExperienceCapability,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightExperiencePlatform,
  validateRuntimeExecutiveInsightPresentationInput,
  validateRuntimeExecutiveInsightPriorityPolicy,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightExperienceCompatibility,
  verifyRuntimeExecutiveInsightExperienceOrchestration,
  verifyRuntimeExecutiveInsightExperiencePlatform,
};

export type {
  RuntimeExecutiveInsightCandidate,
  RuntimeExecutiveInsightCandidateCollection,
  RuntimeExecutiveInsightEvidenceContract,
  RuntimeExecutiveInsightExperienceOrchestrationInput,
  RuntimeExecutiveInsightExperienceOrchestrationPolicy,
  RuntimeExecutiveInsightExperienceOrchestrationResult,
  RuntimeExecutiveInsightExperiencePlatformVerification,
  RuntimeExecutiveInsightPlatformApiFamily,
  RuntimeExecutiveInsightPlatformCapability,
  RuntimeExecutiveInsightPlatformCapabilityName,
  RuntimeExecutiveInsightPlatformCapabilityStatus,
  RuntimeExecutiveInsightPlatformCompatibilityInput,
  RuntimeExecutiveInsightPlatformCompatibilityResult,
  RuntimeExecutiveInsightPlatformCompatibilityStatus,
  RuntimeExecutiveInsightPlatformConsumerGuarantee,
  RuntimeExecutiveInsightPlatformExperienceSurface,
  RuntimeExecutiveInsightPlatformRegistrySection,
  RuntimeExecutiveInsightPlatformValidationIssue,
  RuntimeExecutiveInsightPlatformValidationResult,
  RuntimeExecutiveInsightPlatformVerificationCode,
  RuntimeExecutiveInsightPlatformVerificationStatus,
  RuntimeExecutiveInsightPresentationDescriptor,
  RuntimeExecutiveInsightPresentationResult,
  RuntimeExecutiveInsightPresentationState,
  RuntimeExecutiveInsightPriorityAttentionState,
  RuntimeExecutiveInsightPriorityBand,
  RuntimeExecutiveInsightPriorityResult,
  RuntimeExecutiveInsightSignalContract,
  RuntimeExecutiveInsightSourceContract,
  RuntimeExecutiveInsightSubjectContract,
  RuntimeExecutiveRankedInsight,
};
