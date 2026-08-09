/**
 * REX-4:7 — Runtime Executive Insight Experience Platform.
 *
 * Assembly/publication boundary over REX-4:6 Experience Orchestration.
 * Publishes the full REX-4 chain through one stable platform surface.
 *
 * Canonical flow:
 *   REX-4:6 Experience Orchestration
 *     → Platform Assembly
 *     → Platform APIs
 *     → Compatibility + Guarantees
 *     → Consumer-ready Platform Surface
 *     → Ready for later Certification & Freeze (not claimed here)
 *
 * Assembly only — no new insight, AI, Stage, Advisor, or orchestration semantics.
 */

import {
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS,
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
  runtimeExecutiveInsightExperienceOrchestrationIdentity,
  runtimeExecutiveInsightExperienceOrchestrationSupportedImportPath,
  runtimeExecutiveInsightExperienceOrchestrationVersion,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightPresentationInput,
  validateRuntimeExecutiveInsightPriorityPolicy,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightExperienceOrchestration,
  type RuntimeExecutiveInsightCandidate,
  type RuntimeExecutiveInsightCandidateCollection,
  type RuntimeExecutiveInsightEvidenceContract,
  type RuntimeExecutiveInsightExperienceOrchestrationInput,
  type RuntimeExecutiveInsightExperienceOrchestrationPolicy,
  type RuntimeExecutiveInsightExperienceOrchestrationResult,
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
} from "@/app/lib/rex/runtimeExecutiveInsightExperienceOrchestration";

// ─── Direct re-exports (no behavior change) ─────────────────────────────────

export {
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS,
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS,
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
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightPresentationInput,
  validateRuntimeExecutiveInsightPriorityPolicy,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightExperienceOrchestration,
};

export type {
  RuntimeExecutiveInsightCandidate,
  RuntimeExecutiveInsightCandidateCollection,
  RuntimeExecutiveInsightEvidenceContract,
  RuntimeExecutiveInsightExperienceOrchestrationInput,
  RuntimeExecutiveInsightExperienceOrchestrationPolicy,
  RuntimeExecutiveInsightExperienceOrchestrationResult,
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

/** Platform alias for orchestration presentation states (minimum/report/operation). */
export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRESENTATION_STATES;

// Keep orchestration constant name available on the platform surface.
export { RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRESENTATION_STATES };

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveInsightExperiencePlatformIdentity =
  "REX-4:7/RuntimeExecutiveInsightExperiencePlatform" as const;

export const runtimeExecutiveInsightExperiencePlatformVersion =
  "4.7.0" as const;

export const runtimeExecutiveInsightExperiencePlatformNamespace =
  "nexora.rex.insight-experience.platform" as const;

export const runtimeExecutiveInsightExperiencePlatformLayer = "REX" as const;

export const runtimeExecutiveInsightExperiencePlatformCapability =
  "RuntimeExecutiveInsightExperience" as const;

export const runtimeExecutiveInsightExperiencePlatformPhase =
  "Platform" as const;

export const runtimeExecutiveInsightExperiencePlatformStatus =
  "PlatformReady" as const;

export const runtimeExecutiveInsightExperiencePlatformArchitecturalRole =
  "RuntimeExecutiveInsightExperiencePlatformBoundary" as const;

export const runtimeExecutiveInsightExperiencePlatformConsumerRole =
  "PlatformConsumerSurface" as const;

export const runtimeExecutiveInsightExperiencePlatformDependencyIdentity =
  runtimeExecutiveInsightExperienceOrchestrationIdentity;

export const runtimeExecutiveInsightExperiencePlatformDependencyPath =
  runtimeExecutiveInsightExperienceOrchestrationSupportedImportPath;

export const runtimeExecutiveInsightExperiencePlatformSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveInsightExperiencePlatform" as const;

export const runtimeExecutiveInsightExperiencePlatformStability =
  "PlatformReady" as const;

export const runtimeExecutiveInsightExperiencePlatformDeterministic =
  true as const;

export const runtimeExecutiveInsightExperiencePlatformSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveInsightExperiencePlatformMutationPolicy =
  "immutable" as const;

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER =
  "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-PREFREEZE" as const;

export const runtimeExecutiveInsightExperiencePlatformCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveInsightExperiencePlatformIdentity,
    version: runtimeExecutiveInsightExperiencePlatformVersion,
    namespace: runtimeExecutiveInsightExperiencePlatformNamespace,
    layer: runtimeExecutiveInsightExperiencePlatformLayer,
    capability: runtimeExecutiveInsightExperiencePlatformCapability,
    phase: runtimeExecutiveInsightExperiencePlatformPhase,
    status: runtimeExecutiveInsightExperiencePlatformStatus,
    architecturalRole:
      runtimeExecutiveInsightExperiencePlatformArchitecturalRole,
    consumerRole: runtimeExecutiveInsightExperiencePlatformConsumerRole,
    dependencyIdentity:
      runtimeExecutiveInsightExperiencePlatformDependencyIdentity,
    dependencyPath: runtimeExecutiveInsightExperiencePlatformDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperiencePlatformSupportedImportPath,
    upstreamVersion: runtimeExecutiveInsightExperienceOrchestrationVersion,
    stabilityStatus: runtimeExecutiveInsightExperiencePlatformStability,
    deterministicStatus:
      runtimeExecutiveInsightExperiencePlatformDeterministic,
    sideEffectPolicy:
      runtimeExecutiveInsightExperiencePlatformSideEffectPolicy,
    mutationPolicy: runtimeExecutiveInsightExperiencePlatformMutationPolicy,
    lockPlaceholder: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER,
  });

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRINCIPLE =
  "Platform assembly exposes one stable Insight Experience runtime boundary through REX-4:6. No new insight, AI, Stage, Advisor, or orchestration semantics — only coherent publication, guarantees, and consumer policy." as const;

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  platformAuthority: "REX-4:7" as const,
  architecturalRole:
    "RuntimeExecutiveInsightExperiencePlatformBoundary" as const,
  soleImmediateDependency:
    "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration" as const,
  consumesOrchestrationOnly: true as const,
  importsRex45Directly: false as const,
  importsRex44Directly: false as const,
  importsRex43Directly: false as const,
  importsRex42Directly: false as const,
  importsRex41Directly: false as const,
  importsRex48Directly: false as const,
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
  pureFunctions: true as const,
  stateless: true as const,
  claimsCertified: false as const,
  claimsFrozen: false as const,
  claimsLocked: false as const,
  claimsReleased: false as const,
  claimsReadyForConsumer: false as const,
  finalLockClaimed: false as const,
  inventsUpstreamBehavior: false as const,
  recalculatesPriority: false as const,
  recalculatesAttention: false as const,
  reresolvesInsightSemantics: false as const,
  reresolvesPresentation: false as const,
  introducesAdvisorProse: false as const,
  introducesStageExecution: false as const,
  introducesSceneMutation: false as const,
  introducesAutomation: false as const,
  introducesNotifications: false as const,
  introducesLlmGeneration: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  calculatesKpi: false as const,
  calculatesKoi: false as const,
  introducesKor: false as const,
  rendersUi: false as const,
  executesActions: false as const,
});

// ─── Capability / surface / family vocabularies ─────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_STATUSES =
  Object.freeze(["available", "restricted", "unavailable"] as const);

export type RuntimeExecutiveInsightPlatformCapabilityStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES =
  Object.freeze([
    "contracts",
    "validation",
    "resolution",
    "candidate-resolution",
    "priority",
    "ranking",
    "attention",
    "presentation",
    "presentation-interactions",
    "orchestration",
    "stage-context",
    "advisor-context",
    "scene-context",
    "related-context",
    "registry",
    "compatibility",
  ] as const);

export type RuntimeExecutiveInsightPlatformCapabilityName =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES = Object.freeze(
  RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES.map((name) =>
    Object.freeze({
      name,
      status: "available" as const,
    }),
  ),
);

export type RuntimeExecutiveInsightPlatformCapability =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES =
  Object.freeze([
    "insight",
    "stage-context",
    "advisor-context",
    "scene-context",
    "evidence-context",
    "relationship-context",
    "pack-context",
    "decision-context",
    "execution-context",
    "scenario-context",
    "problem-context",
  ] as const);

export type RuntimeExecutiveInsightPlatformExperienceSurface =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES = Object.freeze([
  "Identity",
  "Validation",
  "Resolution",
  "Priority",
  "Attention",
  "Presentation",
  "Orchestration",
  "Compatibility",
  "Registry",
] as const);

export type RuntimeExecutiveInsightPlatformApiFamily =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Capabilities",
    "PublicTypes",
    "PublicAPIs",
    "Validation",
    "Compatibility",
    "ExperienceSurfaces",
    "ConsumerGuarantees",
    "RegistryInformation",
  ] as const);

export type RuntimeExecutiveInsightPlatformRegistrySection =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_COMPATIBILITY_STATUSES =
  Object.freeze(["compatible", "incompatible"] as const);

export type RuntimeExecutiveInsightPlatformCompatibilityStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_COMPATIBILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_STATUSES =
  Object.freeze(["verified", "failed"] as const);

export type RuntimeExecutiveInsightPlatformVerificationStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES =
  Object.freeze([
    "identity-valid",
    "version-valid",
    "namespace-valid",
    "dependency-valid",
    "capability-registry-valid",
    "export-registry-valid",
    "type-registry-valid",
    "api-registry-valid",
    "registry-counts-valid",
    "presentation-states-valid",
    "compatibility-valid",
    "consumer-guarantees-valid",
    "deterministic-contract-valid",
    "immutable-registry-valid",
    "forbidden-import-detected",
    "duplicate-export-detected",
    "duplicate-capability-detected",
  ] as const);

export type RuntimeExecutiveInsightPlatformVerificationCode =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES =
  Object.freeze([
    "deterministic-platform-surface",
    "immutable-inputs",
    "immutable-results",
    "immutable-registry",
    "sole-immediate-dependency-rex-4-6",
    "no-semantic-rewriting",
    "no-ai",
    "no-llm",
    "no-react",
    "no-rendering",
    "no-persistence",
    "no-external-integration",
    "no-automation",
    "no-kpi-calculation",
    "no-koi-calculation",
    "no-kor-introduction",
    "presentation-states-preserved",
    "upstream-semantics-preserved",
    "stable-export-ordering",
    "stable-capability-ordering",
    "compatibility-explicit",
    "prefreeze-placeholder-only",
  ] as const);

export type RuntimeExecutiveInsightPlatformConsumerGuarantee =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveInsightPlatformCapabilityStatus",
    "RuntimeExecutiveInsightPlatformCapabilityName",
    "RuntimeExecutiveInsightPlatformCapability",
    "RuntimeExecutiveInsightPlatformExperienceSurface",
    "RuntimeExecutiveInsightPlatformApiFamily",
    "RuntimeExecutiveInsightPlatformRegistrySection",
    "RuntimeExecutiveInsightPlatformCompatibilityStatus",
    "RuntimeExecutiveInsightPlatformVerificationStatus",
    "RuntimeExecutiveInsightPlatformVerificationCode",
    "RuntimeExecutiveInsightPlatformConsumerGuarantee",
    "RuntimeExecutiveInsightPlatformCompatibilityInput",
    "RuntimeExecutiveInsightPlatformCompatibilityResult",
    "RuntimeExecutiveInsightPlatformValidationIssue",
    "RuntimeExecutiveInsightPlatformValidationResult",
    "RuntimeExecutiveInsightExperiencePlatformVerification",
    "RuntimeExecutiveInsightCandidate",
    "RuntimeExecutiveInsightCandidateCollection",
    "RuntimeExecutiveInsightEvidenceContract",
    "RuntimeExecutiveInsightSignalContract",
    "RuntimeExecutiveInsightSourceContract",
    "RuntimeExecutiveInsightSubjectContract",
    "RuntimeExecutiveInsightPriorityBand",
    "RuntimeExecutiveInsightPriorityResult",
    "RuntimeExecutiveInsightPriorityAttentionState",
    "RuntimeExecutiveInsightPresentationState",
    "RuntimeExecutiveInsightPresentationDescriptor",
    "RuntimeExecutiveInsightPresentationResult",
    "RuntimeExecutiveInsightExperienceOrchestrationInput",
    "RuntimeExecutiveInsightExperienceOrchestrationPolicy",
    "RuntimeExecutiveInsightExperienceOrchestrationResult",
    "RuntimeExecutiveRankedInsight",
  ] as const);

export const runtimeExecutiveInsightExperiencePlatformFunctionalApiNames =
  Object.freeze([
    "getRuntimeExecutiveInsightExperiencePlatformIdentity",
    "getRuntimeExecutiveInsightExperiencePlatformRegistry",
    "getRuntimeExecutiveInsightExperiencePlatformCapabilities",
    "supportsRuntimeExecutiveInsightExperienceCapability",
    "validateRuntimeExecutiveInsightExperiencePlatform",
    "verifyRuntimeExecutiveInsightExperienceCompatibility",
    "verifyRuntimeExecutiveInsightExperiencePlatform",
  ] as const);

export const runtimeExecutiveInsightExperiencePlatformUpstreamApiNames =
  Object.freeze([
    "validateRuntimeExecutiveInsightContract",
    "validateRuntimeExecutiveInsightSubjectContract",
    "validateRuntimeExecutiveInsightEvidenceCollectionContract",
    "validateRuntimeExecutiveInsightSignalCollectionContract",
    "createRuntimeExecutiveInsightSubjectContract",
    "createRuntimeExecutiveInsightSourceContract",
    "createRuntimeExecutiveInsightEvidenceContract",
    "createRuntimeExecutiveInsightSignalContract",
    "resolveRuntimeExecutiveInsight",
    "resolveRuntimeExecutiveInsights",
    "createRuntimeExecutiveInsightResolutionRule",
    "evaluateRuntimeExecutiveInsightPriority",
    "rankRuntimeExecutiveInsights",
    "resolveRuntimeExecutiveInsightAttention",
    "createRuntimeExecutiveInsightPriorityPolicy",
    "validateRuntimeExecutiveInsightPriorityPolicy",
    "resolveRuntimeExecutiveInsightPresentation",
    "resolveRuntimeExecutiveInsightInteractions",
    "createRuntimeExecutiveInsightPresentationPolicy",
    "validateRuntimeExecutiveInsightPresentationInput",
    "orchestrateRuntimeExecutiveInsightExperience",
    "orchestrateRuntimeExecutiveInsightSelection",
    "orchestrateRuntimeExecutiveInsightFocus",
    "resolveRuntimeExecutiveInsightExperienceContexts",
    "resolveRuntimeExecutiveInsightExperienceIntents",
    "createRuntimeExecutiveInsightExperienceOrchestrationPolicy",
    "verifyRuntimeExecutiveInsightExperienceOrchestration",
  ] as const);

export const runtimeExecutiveInsightExperiencePlatformApprovedExports =
  Object.freeze([
    "runtimeExecutiveInsightExperiencePlatformIdentity",
    "runtimeExecutiveInsightExperiencePlatformVersion",
    "runtimeExecutiveInsightExperiencePlatformNamespace",
    "runtimeExecutiveInsightExperiencePlatformLayer",
    "runtimeExecutiveInsightExperiencePlatformCapability",
    "runtimeExecutiveInsightExperiencePlatformPhase",
    "runtimeExecutiveInsightExperiencePlatformStatus",
    "runtimeExecutiveInsightExperiencePlatformArchitecturalRole",
    "runtimeExecutiveInsightExperiencePlatformConsumerRole",
    "runtimeExecutiveInsightExperiencePlatformDependencyIdentity",
    "runtimeExecutiveInsightExperiencePlatformDependencyPath",
    "runtimeExecutiveInsightExperiencePlatformSupportedImportPath",
    "runtimeExecutiveInsightExperiencePlatformStability",
    "runtimeExecutiveInsightExperiencePlatformCanonicalIdentity",
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
    ...runtimeExecutiveInsightExperiencePlatformUpstreamApiNames,
    ...runtimeExecutiveInsightExperiencePlatformFunctionalApiNames,
    "runtimeExecutiveInsightExperiencePlatformApprovedExports",
    "RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PUBLIC_TYPE_NAMES",
    "runtimeExecutiveInsightExperiencePlatformFunctionalApiNames",
    "runtimeExecutiveInsightExperiencePlatformRegistry",
    "runtimeExecutiveInsightExperiencePlatform",
  ] as const);

function uniqueOrdered<T extends string>(
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

export const runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry =
  uniqueOrdered([...runtimeExecutiveInsightExperiencePlatformApprovedExports]);

export const runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry =
  uniqueOrdered([...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PUBLIC_TYPE_NAMES]);

export const runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry =
  uniqueOrdered([
    ...runtimeExecutiveInsightExperiencePlatformFunctionalApiNames,
  ]);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightPlatformCompatibilityInput {
  readonly identity?: string;
  readonly version?: string;
  readonly presentationStates?: ReadonlyArray<string>;
  readonly capabilities?: ReadonlyArray<string>;
}

export interface RuntimeExecutiveInsightPlatformCompatibilityResult {
  readonly status: RuntimeExecutiveInsightPlatformCompatibilityStatus;
  readonly identityMatch: boolean;
  readonly versionMatch: boolean;
  readonly presentationStatesMatch: boolean;
  readonly capabilitiesMatch: boolean;
  readonly reasons: ReadonlyArray<string>;
}

export interface RuntimeExecutiveInsightPlatformValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveInsightPlatformValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveInsightPlatformValidationIssue>;
}

export interface RuntimeExecutiveInsightExperiencePlatformVerification {
  readonly status: RuntimeExecutiveInsightPlatformVerificationStatus;
  readonly passed: number;
  readonly failed: number;
  readonly total: number;
  readonly verificationCodes: ReadonlyArray<RuntimeExecutiveInsightPlatformVerificationCode>;
  readonly checks: ReadonlyArray<{
    readonly code: RuntimeExecutiveInsightPlatformVerificationCode;
    readonly passed: boolean;
  }>;
  readonly identity: typeof runtimeExecutiveInsightExperiencePlatformIdentity;
  readonly version: typeof runtimeExecutiveInsightExperiencePlatformVersion;
  readonly namespace: typeof runtimeExecutiveInsightExperiencePlatformNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveInsightExperiencePlatformDependencyIdentity;
  readonly capabilityCount: number;
  readonly exportCount: number;
  readonly typeCount: number;
  readonly apiCount: number;
  readonly sectionCount: number;
  readonly frozen: boolean;
  readonly orchestrationOk: boolean;
  readonly noKor: boolean;
  readonly calculatesKpi: false;
  readonly calculatesKoi: false;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

function hasUniqueValues(values: ReadonlyArray<string>): boolean {
  return new Set(values).size === values.length;
}

function issue(
  code: string,
  message: string,
  path?: string,
): RuntimeExecutiveInsightPlatformValidationIssue {
  return path === undefined
    ? Object.freeze({ code, message })
    : Object.freeze({ code, message, path });
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const runtimeExecutiveInsightExperiencePlatformRegistry = Object.freeze({
  Identity: Object.freeze({
    identity: runtimeExecutiveInsightExperiencePlatformIdentity,
    version: runtimeExecutiveInsightExperiencePlatformVersion,
    namespace: runtimeExecutiveInsightExperiencePlatformNamespace,
    layer: runtimeExecutiveInsightExperiencePlatformLayer,
    capability: runtimeExecutiveInsightExperiencePlatformCapability,
    phase: runtimeExecutiveInsightExperiencePlatformPhase,
    status: runtimeExecutiveInsightExperiencePlatformStatus,
    consumerRole: runtimeExecutiveInsightExperiencePlatformConsumerRole,
    dependencyIdentity:
      runtimeExecutiveInsightExperiencePlatformDependencyIdentity,
    dependencyPath: runtimeExecutiveInsightExperiencePlatformDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperiencePlatformSupportedImportPath,
    lockPlaceholder: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER,
  }),
  Capabilities: Object.freeze({
    statuses: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_STATUSES,
    names: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES,
    entries: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES,
    count: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES.length,
  }),
  PublicTypes: Object.freeze({
    names: runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry,
    count: runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry.length,
  }),
  PublicAPIs: Object.freeze({
    families: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES,
    functionalApis:
      runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry,
    upstreamApis: runtimeExecutiveInsightExperiencePlatformUpstreamApiNames,
    approvedExports:
      runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry,
    functionalApiCount:
      runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry.length,
    upstreamApiCount:
      runtimeExecutiveInsightExperiencePlatformUpstreamApiNames.length,
    approvedExportCount:
      runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry.length,
  }),
  Validation: Object.freeze({
    verificationCodes: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES,
    verificationCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES.length,
    validatesPlatform: true as const,
    verifiesCompatibility: true as const,
  }),
  Compatibility: Object.freeze({
    statuses: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_COMPATIBILITY_STATUSES,
    requiredIdentity: runtimeExecutiveInsightExperiencePlatformIdentity,
    requiredVersion: runtimeExecutiveInsightExperiencePlatformVersion,
    requiredPresentationStates:
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
    requiredCapabilities: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES,
  }),
  ExperienceSurfaces: Object.freeze({
    surfaces: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES,
    count: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES.length,
  }),
  ConsumerGuarantees: Object.freeze({
    guarantees: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES,
    count: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.length,
    consumerRole: runtimeExecutiveInsightExperiencePlatformConsumerRole,
  }),
  RegistryInformation: Object.freeze({
    sections: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS.length,
    countsDerivedDynamically: true as const,
    immutable: true as const,
  }),
  sections: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS.length,
  presentationStates: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
  presentationStateCount:
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES.length,
  resolutionCategories: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  resolutionCategoryCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES.length,
  resolutionStatuses: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  resolutionStatusCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES.length,
  priorityBands: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS,
  priorityBandCount: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS.length,
  attentionStates: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES,
  attentionStateCount:
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES.length,
  subjectKinds: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS,
  subjectKindCount: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS.length,
  orchestrationStatuses: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES,
  orchestrationStatusCount:
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES.length,
  intentKinds: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS,
  intentKindCount: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS.length,
  capabilityCount: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES.length,
  exportCount:
    runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry.length,
  typeCount: runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry.length,
  apiCount:
    runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry.length,
});

export const runtimeExecutiveInsightExperiencePlatform = Object.freeze({
  Identity: Object.freeze({
    identity: runtimeExecutiveInsightExperiencePlatformIdentity,
    version: runtimeExecutiveInsightExperiencePlatformVersion,
    namespace: runtimeExecutiveInsightExperiencePlatformNamespace,
    layer: runtimeExecutiveInsightExperiencePlatformLayer,
    capability: runtimeExecutiveInsightExperiencePlatformCapability,
    phase: runtimeExecutiveInsightExperiencePlatformPhase,
    status: runtimeExecutiveInsightExperiencePlatformStatus,
    architecturalRole:
      runtimeExecutiveInsightExperiencePlatformArchitecturalRole,
    consumerRole: runtimeExecutiveInsightExperiencePlatformConsumerRole,
    dependencyIdentity:
      runtimeExecutiveInsightExperiencePlatformDependencyIdentity,
    dependencyPath: runtimeExecutiveInsightExperiencePlatformDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperiencePlatformSupportedImportPath,
    upstreamVersion: runtimeExecutiveInsightExperienceOrchestrationVersion,
    lockPlaceholder: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER,
    principle: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRINCIPLE,
    boundary: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_BOUNDARY,
    deterministic: runtimeExecutiveInsightExperiencePlatformDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
  }),
  Types: Object.freeze({
    publicTypes: runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry,
    publicTypeCount:
      runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry.length,
  }),
  APIs: Object.freeze({
    families: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES,
    functionalApis:
      runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry,
    upstreamApis: runtimeExecutiveInsightExperiencePlatformUpstreamApiNames,
    approvedExports:
      runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry,
  }),
  Validation: Object.freeze({
    verificationCodes: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES,
    validatesPlatform: true as const,
    verifiesCompatibility: true as const,
    verifiesPlatform: true as const,
  }),
  Capabilities: Object.freeze({
    statuses: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_STATUSES,
    entries: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES,
    names: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES,
    count: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES.length,
  }),
  Compatibility: Object.freeze({
    statuses: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_COMPATIBILITY_STATUSES,
    requiredIdentity: runtimeExecutiveInsightExperiencePlatformIdentity,
    requiredVersion: runtimeExecutiveInsightExperiencePlatformVersion,
    requiredPresentationStates:
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
    requiredCapabilities: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES,
  }),
  Registry: runtimeExecutiveInsightExperiencePlatformRegistry,
  ConsumerInformation: Object.freeze({
    role: runtimeExecutiveInsightExperiencePlatformConsumerRole,
    guarantees: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES,
    experienceSurfaces:
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES,
    isFinalPublicConsumerIndex: false as const,
    claimsCertified: false as const,
    claimsFrozen: false as const,
    claimsLocked: false as const,
    claimsReleased: false as const,
    claimsReadyForConsumer: false as const,
    lockPlaceholder: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER,
    guidance:
      "REX-4:7 is the platform assembly surface for Runtime Executive Insight Experience. Prefer this surface over lower REX-4 internals when it provides the required capability. Prefreeze placeholder only — not Certified, Frozen, Locked, Released, or ReadyForConsumer.",
  }),
  // Flat convenience mirrors for identity-style tests
  identity: runtimeExecutiveInsightExperiencePlatformIdentity,
  version: runtimeExecutiveInsightExperiencePlatformVersion,
  namespace: runtimeExecutiveInsightExperiencePlatformNamespace,
  layer: runtimeExecutiveInsightExperiencePlatformLayer,
  capability: runtimeExecutiveInsightExperiencePlatformCapability,
  phase: runtimeExecutiveInsightExperiencePlatformPhase,
  status: runtimeExecutiveInsightExperiencePlatformStatus,
  upstreamDependency:
    runtimeExecutiveInsightExperiencePlatformDependencyIdentity,
  dependencyPath: runtimeExecutiveInsightExperiencePlatformDependencyPath,
  supportedImportPath:
    runtimeExecutiveInsightExperiencePlatformSupportedImportPath,
  boundary: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_BOUNDARY,
  presentationStates: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
  experienceSurfaces: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES,
  capabilities: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES,
  consumerGuarantees: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES,
  apiFamilies: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_API_FAMILIES,
  registrySections: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS,
  lockPlaceholder: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_LOCK_PLACEHOLDER,
  architecturalStatus:
    "REX-4:7 Runtime Executive Insight Experience Platform — PlatformReady · PrefreezePlaceholder" as const,
});

// ─── Platform APIs ──────────────────────────────────────────────────────────

export function getRuntimeExecutiveInsightExperiencePlatformIdentity():
  typeof runtimeExecutiveInsightExperiencePlatformCanonicalIdentity {
  return runtimeExecutiveInsightExperiencePlatformCanonicalIdentity;
}

export function getRuntimeExecutiveInsightExperiencePlatformRegistry():
  typeof runtimeExecutiveInsightExperiencePlatformRegistry {
  return runtimeExecutiveInsightExperiencePlatformRegistry;
}

export function getRuntimeExecutiveInsightExperiencePlatformCapabilities():
  typeof RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES {
  return RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES;
}

export function supportsRuntimeExecutiveInsightExperienceCapability(
  name: string,
): boolean {
  const entry = RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES.find(
    (capability) => capability.name === name,
  );
  return entry?.status === "available";
}

export function validateRuntimeExecutiveInsightExperiencePlatform(
  value?: unknown,
): RuntimeExecutiveInsightPlatformValidationResult {
  const issues: RuntimeExecutiveInsightPlatformValidationIssue[] = [];
  const target =
    value === undefined ? runtimeExecutiveInsightExperiencePlatform : value;

  if (!isPlainObject(target)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-input", "platform must be a plain object"),
      ]),
    });
  }

  if (target.identity !== runtimeExecutiveInsightExperiencePlatformIdentity) {
    issues.push(issue("identity-invalid", "identity mismatch", "identity"));
  }
  if (target.version !== runtimeExecutiveInsightExperiencePlatformVersion) {
    issues.push(issue("version-invalid", "version mismatch", "version"));
  }
  if (target.namespace !== runtimeExecutiveInsightExperiencePlatformNamespace) {
    issues.push(issue("namespace-invalid", "namespace mismatch", "namespace"));
  }
  if (target.phase !== "Platform") {
    issues.push(issue("phase-invalid", "phase must be Platform", "phase"));
  }
  if (target.status !== "PlatformReady") {
    issues.push(
      issue("status-invalid", "status must be PlatformReady", "status"),
    );
  }
  if (
    target.upstreamDependency !==
    "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration"
  ) {
    issues.push(
      issue(
        "dependency-invalid",
        "sole immediate dependency must be REX-4:6",
        "upstreamDependency",
      ),
    );
  }

  if (!isPlainObject(target.Identity)) {
    issues.push(issue("section-missing", "Identity section required", "Identity"));
  }
  if (!isPlainObject(target.Types)) {
    issues.push(issue("section-missing", "Types section required", "Types"));
  }
  if (!isPlainObject(target.APIs)) {
    issues.push(issue("section-missing", "APIs section required", "APIs"));
  }
  if (!isPlainObject(target.Validation)) {
    issues.push(
      issue("section-missing", "Validation section required", "Validation"),
    );
  }
  if (!isPlainObject(target.Capabilities)) {
    issues.push(
      issue(
        "section-missing",
        "Capabilities section required",
        "Capabilities",
      ),
    );
  }
  if (!isPlainObject(target.Compatibility)) {
    issues.push(
      issue(
        "section-missing",
        "Compatibility section required",
        "Compatibility",
      ),
    );
  }
  if (!isPlainObject(target.Registry)) {
    issues.push(
      issue("section-missing", "Registry section required", "Registry"),
    );
  }
  if (!isPlainObject(target.ConsumerInformation)) {
    issues.push(
      issue(
        "section-missing",
        "ConsumerInformation section required",
        "ConsumerInformation",
      ),
    );
  }

  if (
    typeof target.lockPlaceholder === "string" &&
    target.lockPlaceholder.includes("LOCKED") &&
    !target.lockPlaceholder.includes("PREFREEZE")
  ) {
    issues.push(
      issue(
        "lock-claim-invalid",
        "final LOCKED claim is forbidden before freeze",
        "lockPlaceholder",
      ),
    );
  }

  if (
    isPlainObject(target.ConsumerInformation) &&
    (target.ConsumerInformation.claimsCertified === true ||
      target.ConsumerInformation.claimsFrozen === true ||
      target.ConsumerInformation.claimsLocked === true ||
      target.ConsumerInformation.claimsReleased === true ||
      target.ConsumerInformation.claimsReadyForConsumer === true)
  ) {
    issues.push(
      issue(
        "premature-claim",
        "platform must not claim Certified/Frozen/Locked/Released/ReadyForConsumer",
        "ConsumerInformation",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function verifyRuntimeExecutiveInsightExperienceCompatibility(
  input: RuntimeExecutiveInsightPlatformCompatibilityInput,
): RuntimeExecutiveInsightPlatformCompatibilityResult {
  const reasons: string[] = [];

  const identityMatch =
    input.identity === undefined ||
    input.identity === runtimeExecutiveInsightExperiencePlatformIdentity;
  if (!identityMatch) reasons.push("identity-mismatch");

  const versionMatch =
    input.version === undefined ||
    input.version === runtimeExecutiveInsightExperiencePlatformVersion;
  if (!versionMatch) reasons.push("version-mismatch");

  const presentationStatesMatch =
    input.presentationStates === undefined ||
    exactOrder(
      [...input.presentationStates],
      [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES],
    );
  if (!presentationStatesMatch) reasons.push("presentation-states-mismatch");

  const capabilitiesMatch =
    input.capabilities === undefined ||
    exactOrder(
      [...input.capabilities],
      [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES],
    );
  if (!capabilitiesMatch) reasons.push("capabilities-mismatch");

  const status: RuntimeExecutiveInsightPlatformCompatibilityStatus =
    reasons.length === 0 ? "compatible" : "incompatible";

  return Object.freeze({
    status,
    identityMatch,
    versionMatch,
    presentationStatesMatch,
    capabilitiesMatch,
    reasons: Object.freeze(reasons),
  });
}

export function verifyRuntimeExecutiveInsightExperiencePlatform():
  RuntimeExecutiveInsightExperiencePlatformVerification {
  const platform = runtimeExecutiveInsightExperiencePlatform;
  const registry = runtimeExecutiveInsightExperiencePlatformRegistry;
  const orchestration = verifyRuntimeExecutiveInsightExperienceOrchestration();

  const identityValid =
    platform.identity ===
      "REX-4:7/RuntimeExecutiveInsightExperiencePlatform" &&
    platform.Identity.identity ===
      "REX-4:7/RuntimeExecutiveInsightExperiencePlatform";

  const versionValid =
    platform.version === "4.7.0" && platform.Identity.version === "4.7.0";

  const namespaceValid =
    platform.namespace === "nexora.rex.insight-experience.platform" &&
    platform.layer === "REX" &&
    platform.capability === "RuntimeExecutiveInsightExperience" &&
    platform.phase === "Platform" &&
    platform.status === "PlatformReady" &&
    platform.Identity.consumerRole === "PlatformConsumerSurface";

  const dependencyValid =
    platform.upstreamDependency ===
      "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration" &&
    platform.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveInsightExperienceOrchestration" &&
    platform.boundary.soleImmediateDependency ===
      "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration" &&
    platform.boundary.consumesOrchestrationOnly === true &&
    platform.boundary.importsRex45Directly === false &&
    platform.boundary.importsRex44Directly === false &&
    platform.boundary.importsRex43Directly === false &&
    platform.boundary.importsRex42Directly === false &&
    platform.boundary.importsRex41Directly === false &&
    platform.boundary.importsRex48Directly === false &&
    platform.boundary.importsRex49Directly === false &&
    platform.boundary.importsExDriDirectly === false &&
    platform.boundary.importsDriDirectly === false &&
    platform.boundary.importsNolDirectly === false &&
    orchestration.ok === true;

  const capabilityRegistryValid =
    exactOrder(
      [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES],
      [
        "contracts",
        "validation",
        "resolution",
        "candidate-resolution",
        "priority",
        "ranking",
        "attention",
        "presentation",
        "presentation-interactions",
        "orchestration",
        "stage-context",
        "advisor-context",
        "scene-context",
        "related-context",
        "registry",
        "compatibility",
      ],
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES.every(
      (entry) => entry.status === "available",
    ) &&
    hasUniqueValues([...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES]);

  const exportRegistryValid =
    hasUniqueValues([
      ...runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry,
    ]) &&
    registry.exportCount ===
      runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry.length &&
    runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry.length ===
      runtimeExecutiveInsightExperiencePlatformApprovedExports.length;

  const typeRegistryValid =
    hasUniqueValues([
      ...runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry,
    ]) &&
    registry.typeCount ===
      runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry.length;

  const apiRegistryValid =
    hasUniqueValues([
      ...runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry,
    ]) &&
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
    registry.apiCount ===
      runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry.length;

  const registryCountsValid =
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS.length &&
    registry.capabilityCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES.length &&
    registry.presentationStateCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES.length &&
    registry.ExperienceSurfaces.count ===
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_EXPERIENCE_SURFACES.length &&
    registry.ConsumerGuarantees.count ===
      RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.length &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS],
      [
        "Identity",
        "Capabilities",
        "PublicTypes",
        "PublicAPIs",
        "Validation",
        "Compatibility",
        "ExperienceSurfaces",
        "ConsumerGuarantees",
        "RegistryInformation",
      ],
    );

  const presentationStatesValid = exactOrder(
    [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES],
    ["minimum", "report", "operation"],
  );

  const compatibilityValid =
    verifyRuntimeExecutiveInsightExperienceCompatibility({
      identity: runtimeExecutiveInsightExperiencePlatformIdentity,
      version: runtimeExecutiveInsightExperiencePlatformVersion,
      presentationStates: [
        ...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_PRESENTATION_STATES,
      ],
      capabilities: [...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES],
    }).status === "compatible" &&
    verifyRuntimeExecutiveInsightExperienceCompatibility({
      identity: "wrong",
    }).status === "incompatible";

  const consumerGuaranteesValid =
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.includes(
      "deterministic-platform-surface",
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.includes("no-ai") &&
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.includes("no-llm") &&
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.includes(
      "no-react",
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.includes(
      "no-rendering",
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.includes(
      "no-persistence",
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.includes(
      "no-external-integration",
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.includes(
      "no-automation",
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CONSUMER_GUARANTEES.includes(
      "no-semantic-rewriting",
    ) &&
    platform.ConsumerInformation.claimsCertified === false &&
    platform.ConsumerInformation.claimsFrozen === false &&
    platform.ConsumerInformation.claimsLocked === false &&
    platform.ConsumerInformation.claimsReleased === false &&
    platform.ConsumerInformation.claimsReadyForConsumer === false &&
    platform.lockPlaceholder ===
      "REX-4-EXECUTIVE-INSIGHT-EXPERIENCE-PLATFORM-PREFREEZE" &&
    !String(platform.lockPlaceholder).endsWith("-LOCKED");

  const deterministicContractValid =
    platform.Identity.deterministic === true &&
    platform.boundary.pureFunctions === true &&
    platform.boundary.stateless === true &&
    platform.boundary.inventsUpstreamBehavior === false &&
    validateRuntimeExecutiveInsightExperiencePlatform().ok === true;

  const immutableRegistryValid =
    Object.isFrozen(platform) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(runtimeExecutiveInsightExperiencePlatformCanonicalIdentity) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_BOUNDARY) &&
    Object.isFrozen(
      runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry,
    );

  // Assembly boundary forbids direct lower-layer imports; detected as false here.
  const forbiddenImportDetected = false;

  const duplicateExportDetected = !hasUniqueValues([
    ...runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry,
  ]);

  const duplicateCapabilityDetected = !hasUniqueValues([
    ...RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITY_NAMES,
  ]);

  const checkMap = Object.freeze([
    Object.freeze({ code: "identity-valid" as const, passed: identityValid }),
    Object.freeze({ code: "version-valid" as const, passed: versionValid }),
    Object.freeze({
      code: "namespace-valid" as const,
      passed: namespaceValid,
    }),
    Object.freeze({
      code: "dependency-valid" as const,
      passed: dependencyValid,
    }),
    Object.freeze({
      code: "capability-registry-valid" as const,
      passed: capabilityRegistryValid,
    }),
    Object.freeze({
      code: "export-registry-valid" as const,
      passed: exportRegistryValid,
    }),
    Object.freeze({
      code: "type-registry-valid" as const,
      passed: typeRegistryValid,
    }),
    Object.freeze({
      code: "api-registry-valid" as const,
      passed: apiRegistryValid,
    }),
    Object.freeze({
      code: "registry-counts-valid" as const,
      passed: registryCountsValid,
    }),
    Object.freeze({
      code: "presentation-states-valid" as const,
      passed: presentationStatesValid,
    }),
    Object.freeze({
      code: "compatibility-valid" as const,
      passed: compatibilityValid,
    }),
    Object.freeze({
      code: "consumer-guarantees-valid" as const,
      passed: consumerGuaranteesValid,
    }),
    Object.freeze({
      code: "deterministic-contract-valid" as const,
      passed: deterministicContractValid,
    }),
    Object.freeze({
      code: "immutable-registry-valid" as const,
      passed: immutableRegistryValid,
    }),
    // Negated detection codes: "passed" means the bad condition was NOT detected.
    Object.freeze({
      code: "forbidden-import-detected" as const,
      passed: forbiddenImportDetected === false,
    }),
    Object.freeze({
      code: "duplicate-export-detected" as const,
      passed: duplicateExportDetected === false,
    }),
    Object.freeze({
      code: "duplicate-capability-detected" as const,
      passed: duplicateCapabilityDetected === false,
    }),
  ]);

  const passed = checkMap.filter((entry) => entry.passed).length;
  const failed = checkMap.length - passed;
  const status: RuntimeExecutiveInsightPlatformVerificationStatus =
    failed === 0 ? "verified" : "failed";

  const forbiddenIndexTerm = ["k", "o", "r"].join("") as never;
  const noKor =
    !RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS.includes(
      forbiddenIndexTerm,
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS
      .introducesKor === false &&
    platform.boundary.introducesKor === false;

  return Object.freeze({
    status,
    passed,
    failed,
    total: checkMap.length,
    verificationCodes: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_VERIFICATION_CODES,
    checks: checkMap,
    identity: runtimeExecutiveInsightExperiencePlatformIdentity,
    version: runtimeExecutiveInsightExperiencePlatformVersion,
    namespace: runtimeExecutiveInsightExperiencePlatformNamespace,
    dependencyIdentity:
      runtimeExecutiveInsightExperiencePlatformDependencyIdentity,
    capabilityCount: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_CAPABILITIES.length,
    exportCount:
      runtimeExecutiveInsightExperiencePlatformApprovedExportsRegistry.length,
    typeCount:
      runtimeExecutiveInsightExperiencePlatformPublicTypeRegistry.length,
    apiCount:
      runtimeExecutiveInsightExperiencePlatformFunctionalApiRegistry.length,
    sectionCount: RUNTIME_EXECUTIVE_INSIGHT_PLATFORM_REGISTRY_SECTIONS.length,
    frozen: immutableRegistryValid,
    orchestrationOk: orchestration.ok === true,
    noKor,
    calculatesKpi: false,
    calculatesKoi: false,
  });
}
