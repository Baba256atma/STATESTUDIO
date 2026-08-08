/**
 * DRI-5:7 — Director Runtime Adaptive Presentation Platform.
 *
 * Stable, deterministic, immutable, renderer-independent platform surface over
 * DRI-5:6 Adaptive Presentation Orchestration. Exposure only — no policy
 * duplication, no rendering, no certification/freeze, no public index.
 */

import {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_ATTENTION_REASONS,
  DIRECTOR_RUNTIME_ATTENTION_SIGNALS,
  DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimeAdaptivePresentationPlansEqual,
  areDirectorRuntimePresentationIntentsEqual,
  assessDirectorRuntimeAdaptivePresentationCompatibility,
  compareDirectorRuntimeAdaptivePresentationPlans,
  compareDirectorRuntimeAttentionLevels,
  compareDirectorRuntimeEmphasisLevels,
  compareDirectorRuntimeInformationDensities,
  compareDirectorRuntimePresentationIntents,
  compareDirectorRuntimePresentationStates,
  createDirectorRuntimeAdaptivePresentationPlanSnapshot,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimeAdaptivePresentationPlanId,
  deriveDirectorRuntimePresentationIntentId,
  describeDirectorRuntimeInformationDensityTransition,
  describeDirectorRuntimePresentationStateTransition,
  directorRuntimeAdaptivePresentationOrchestrationIdentity,
  findDirectorRuntimeAdaptivePresentationPlanById,
  findDirectorRuntimeAdaptivePresentationPlansBySubjectId,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimeAttentionRank,
  getDirectorRuntimeEmphasisRank,
  getDirectorRuntimeInformationDensityRank,
  getDirectorRuntimePresentationStateRank,
  isDirectorRuntimeAttentionAtLeast,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeEmphasisLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInformationDensityAtLeast,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationStateAtLeast,
  isDirectorRuntimePresentationVisibility,
  orchestrateDirectorRuntimeAdaptivePresentation,
  orchestrateDirectorRuntimeAdaptivePresentations,
  resolveDirectorRuntimeAttention,
  resolveDirectorRuntimeAttentionEmphasisPolicies,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeEmphasis,
  resolveDirectorRuntimeInformationDensities,
  resolveDirectorRuntimeInformationDensity,
  resolveDirectorRuntimePresentationState,
  resolveDirectorRuntimePresentationStates,
  validateDirectorRuntimeAdaptivePresentationOrchestrationInput,
  validateDirectorRuntimeAdaptivePresentationPlanCollection,
  validateDirectorRuntimeAttentionPolicyInput,
  validateDirectorRuntimeInformationDensityPolicyInput,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
  verifyDirectorRuntimeAdaptivePresentationOrchestration,
} from "@/app/lib/dri/directorRuntimeAdaptivePresentationOrchestration";

export {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_ATTENTION_REASONS,
  DIRECTOR_RUNTIME_ATTENTION_SIGNALS,
  DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimeAdaptivePresentationPlansEqual,
  areDirectorRuntimePresentationIntentsEqual,
  assessDirectorRuntimeAdaptivePresentationCompatibility,
  compareDirectorRuntimeAdaptivePresentationPlans,
  compareDirectorRuntimeAttentionLevels,
  compareDirectorRuntimeEmphasisLevels,
  compareDirectorRuntimeInformationDensities,
  compareDirectorRuntimePresentationIntents,
  compareDirectorRuntimePresentationStates,
  createDirectorRuntimeAdaptivePresentationPlanSnapshot,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimeAdaptivePresentationPlanId,
  deriveDirectorRuntimePresentationIntentId,
  describeDirectorRuntimeInformationDensityTransition,
  describeDirectorRuntimePresentationStateTransition,
  findDirectorRuntimeAdaptivePresentationPlanById,
  findDirectorRuntimeAdaptivePresentationPlansBySubjectId,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimeAttentionRank,
  getDirectorRuntimeEmphasisRank,
  getDirectorRuntimeInformationDensityRank,
  getDirectorRuntimePresentationStateRank,
  isDirectorRuntimeAttentionAtLeast,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeEmphasisLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInformationDensityAtLeast,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationStateAtLeast,
  isDirectorRuntimePresentationVisibility,
  orchestrateDirectorRuntimeAdaptivePresentation,
  orchestrateDirectorRuntimeAdaptivePresentations,
  resolveDirectorRuntimeAttention,
  resolveDirectorRuntimeAttentionEmphasisPolicies,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeEmphasis,
  resolveDirectorRuntimeInformationDensities,
  resolveDirectorRuntimeInformationDensity,
  resolveDirectorRuntimePresentationState,
  resolveDirectorRuntimePresentationStates,
  validateDirectorRuntimeAdaptivePresentationOrchestrationInput,
  validateDirectorRuntimeAdaptivePresentationPlanCollection,
  validateDirectorRuntimeAttentionPolicyInput,
  validateDirectorRuntimeInformationDensityPolicyInput,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
  verifyDirectorRuntimeAdaptivePresentationOrchestration,
};

export type {
  DirectorRuntimeAdaptivePresentationOrchestrationInput,
  DirectorRuntimeAdaptivePresentationPlan,
  DirectorRuntimeAdaptivePresentationPlanChangeDimension,
  DirectorRuntimeAdaptivePresentationPlanCollection,
  DirectorRuntimeAdaptivePresentationPlanSnapshot,
  DirectorRuntimeAdaptivePresentationTransition,
  DirectorRuntimeAttentionEmphasisPolicyResult,
  DirectorRuntimeAttentionLevel,
  DirectorRuntimeEmphasisLevel,
  DirectorRuntimeInformationDensity,
  DirectorRuntimeInformationDensityResolution,
  DirectorRuntimeInteractionExposure,
  DirectorRuntimePresentationIntent,
  DirectorRuntimePresentationIntentContextReference,
  DirectorRuntimePresentationIntentReason,
  DirectorRuntimePresentationIntentSource,
  DirectorRuntimePresentationPriority,
  DirectorRuntimePresentationState,
  DirectorRuntimePresentationStateResolution,
  DirectorRuntimePresentationSubject,
  DirectorRuntimePresentationVisibility,
} from "@/app/lib/dri/directorRuntimeAdaptivePresentationOrchestration";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAdaptivePresentationPlatformIdentity =
  "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform" as const;
export const directorRuntimeAdaptivePresentationPlatformVersion =
  "5.7.0" as const;
export const directorRuntimeAdaptivePresentationPlatformNamespace =
  "nexora.dri.adaptive-presentation.platform" as const;
export const directorRuntimeAdaptivePresentationPlatformUpstream =
  directorRuntimeAdaptivePresentationOrchestrationIdentity;

export const directorRuntimeAdaptivePresentationPlatformCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAdaptivePresentationPlatformIdentity,
    version: directorRuntimeAdaptivePresentationPlatformVersion,
    namespace: directorRuntimeAdaptivePresentationPlatformNamespace,
    dependency: directorRuntimeAdaptivePresentationPlatformUpstream,
  });

// ─── Status ─────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUSES =
  Object.freeze(["established", "ready-for-certification"] as const);
export type DirectorRuntimeAdaptivePresentationPlatformStatus =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUSES)[number];

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS =
  "ready-for-certification" as const satisfies DirectorRuntimeAdaptivePresentationPlatformStatus;

// ─── Capabilities ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES =
  Object.freeze([
    "foundation",
    "intent",
    "state-resolution",
    "attention-emphasis",
    "information-density",
    "orchestration",
    "plan-inspection",
    "batch-orchestration",
  ] as const);
export type DirectorRuntimeAdaptivePresentationPlatformCapability =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES)[number];

export interface DirectorRuntimeAdaptivePresentationPlatformCapabilityDescriptor {
  readonly capability: DirectorRuntimeAdaptivePresentationPlatformCapability;
  readonly available: true;
  readonly semanticRole: string;
}

const CAPABILITY_SEMANTIC_ROLES = Object.freeze({
  foundation: "presentation-vocabulary-access",
  intent: "presentation-intent-creation-validation",
  "state-resolution": "presentation-state-resolution",
  "attention-emphasis": "attention-emphasis-policy",
  "information-density": "information-density-policy",
  orchestration: "adaptive-presentation-orchestration",
  "plan-inspection": "adaptive-presentation-plan-inspection",
  "batch-orchestration": "adaptive-presentation-batch-orchestration",
} as const satisfies Record<
  DirectorRuntimeAdaptivePresentationPlatformCapability,
  string
>);

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITY_DESCRIPTORS =
  Object.freeze(
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES.map(
      (capability) =>
        Object.freeze({
          capability,
          available: true as const,
          semanticRole: CAPABILITY_SEMANTIC_ROLES[capability],
        }),
    ),
  ) as readonly DirectorRuntimeAdaptivePresentationPlatformCapabilityDescriptor[];

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES =
  Object.freeze([
    "deterministic",
    "immutable",
    "semantic",
    "renderer-independent",
    "framework-independent",
    "side-effect-free",
    "ordered",
    "upstream-preserving",
  ] as const);
export type DirectorRuntimeAdaptivePresentationPlatformGuarantee =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES)[number];

// ─── Compatibility ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY_STATUSES =
  Object.freeze(["compatible", "incompatible"] as const);
export type DirectorRuntimeAdaptivePresentationPlatformCompatibilityStatus =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY_STATUSES)[number];

export interface DirectorRuntimeAdaptivePresentationPlatformCompatibility {
  readonly status: DirectorRuntimeAdaptivePresentationPlatformCompatibilityStatus;
  readonly dependency: typeof directorRuntimeAdaptivePresentationPlatformUpstream;
  readonly expectedDependency: "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration";
}

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY =
  Object.freeze({
    status: "compatible" as const,
    dependency: directorRuntimeAdaptivePresentationPlatformUpstream,
    expectedDependency:
      "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration" as const,
  }) satisfies DirectorRuntimeAdaptivePresentationPlatformCompatibility;

// ─── Approved API registry ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_CATEGORIES =
  Object.freeze([
    "intent",
    "state",
    "attention-emphasis",
    "density",
    "orchestration",
    "inspection",
    "validation",
    "verification",
  ] as const);
export type DirectorRuntimeAdaptivePresentationPlatformApprovedApiCategory =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_CATEGORIES)[number];

export interface DirectorRuntimeAdaptivePresentationPlatformApprovedApiEntry {
  readonly name: string;
  readonly category: DirectorRuntimeAdaptivePresentationPlatformApprovedApiCategory;
}

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS =
  Object.freeze([
    Object.freeze({ name: "createDirectorRuntimePresentationIntent", category: "intent" as const }),
    Object.freeze({ name: "validateDirectorRuntimePresentationIntent", category: "intent" as const }),
    Object.freeze({ name: "deriveDirectorRuntimePresentationIntentId", category: "intent" as const }),
    Object.freeze({ name: "areDirectorRuntimePresentationIntentsEqual", category: "intent" as const }),
    Object.freeze({ name: "compareDirectorRuntimePresentationIntents", category: "intent" as const }),
    Object.freeze({ name: "createDirectorRuntimePresentationIntentCollection", category: "intent" as const }),
    Object.freeze({ name: "createDirectorRuntimePresentationIntentSnapshot", category: "intent" as const }),
    Object.freeze({ name: "findDirectorRuntimePresentationIntentById", category: "intent" as const }),
    Object.freeze({ name: "findDirectorRuntimePresentationIntentsBySubjectId", category: "intent" as const }),
    Object.freeze({ name: "resolveDirectorRuntimePresentationState", category: "state" as const }),
    Object.freeze({ name: "resolveDirectorRuntimePresentationStates", category: "state" as const }),
    Object.freeze({ name: "validateDirectorRuntimePresentationStateResolutionInput", category: "state" as const }),
    Object.freeze({ name: "compareDirectorRuntimePresentationStates", category: "state" as const }),
    Object.freeze({ name: "getDirectorRuntimePresentationStateRank", category: "state" as const }),
    Object.freeze({ name: "isDirectorRuntimePresentationStateAtLeast", category: "state" as const }),
    Object.freeze({ name: "describeDirectorRuntimePresentationStateTransition", category: "state" as const }),
    Object.freeze({ name: "resolveDirectorRuntimeAttention", category: "attention-emphasis" as const }),
    Object.freeze({ name: "resolveDirectorRuntimeEmphasis", category: "attention-emphasis" as const }),
    Object.freeze({ name: "resolveDirectorRuntimeAttentionEmphasisPolicy", category: "attention-emphasis" as const }),
    Object.freeze({ name: "resolveDirectorRuntimeAttentionEmphasisPolicies", category: "attention-emphasis" as const }),
    Object.freeze({ name: "validateDirectorRuntimeAttentionPolicyInput", category: "attention-emphasis" as const }),
    Object.freeze({ name: "compareDirectorRuntimeAttentionLevels", category: "attention-emphasis" as const }),
    Object.freeze({ name: "compareDirectorRuntimeEmphasisLevels", category: "attention-emphasis" as const }),
    Object.freeze({ name: "getDirectorRuntimeAttentionRank", category: "attention-emphasis" as const }),
    Object.freeze({ name: "getDirectorRuntimeEmphasisRank", category: "attention-emphasis" as const }),
    Object.freeze({ name: "isDirectorRuntimeAttentionAtLeast", category: "attention-emphasis" as const }),
    Object.freeze({ name: "resolveDirectorRuntimeInformationDensity", category: "density" as const }),
    Object.freeze({ name: "resolveDirectorRuntimeInformationDensities", category: "density" as const }),
    Object.freeze({ name: "validateDirectorRuntimeInformationDensityPolicyInput", category: "density" as const }),
    Object.freeze({ name: "compareDirectorRuntimeInformationDensities", category: "density" as const }),
    Object.freeze({ name: "getDirectorRuntimeInformationDensityRank", category: "density" as const }),
    Object.freeze({ name: "isDirectorRuntimeInformationDensityAtLeast", category: "density" as const }),
    Object.freeze({ name: "describeDirectorRuntimeInformationDensityTransition", category: "density" as const }),
    Object.freeze({ name: "orchestrateDirectorRuntimeAdaptivePresentation", category: "orchestration" as const }),
    Object.freeze({ name: "orchestrateDirectorRuntimeAdaptivePresentations", category: "orchestration" as const }),
    Object.freeze({ name: "assessDirectorRuntimeAdaptivePresentationCompatibility", category: "orchestration" as const }),
    Object.freeze({ name: "deriveDirectorRuntimeAdaptivePresentationPlanId", category: "orchestration" as const }),
    Object.freeze({ name: "validateDirectorRuntimeAdaptivePresentationOrchestrationInput", category: "orchestration" as const }),
    Object.freeze({ name: "areDirectorRuntimeAdaptivePresentationPlansEqual", category: "inspection" as const }),
    Object.freeze({ name: "compareDirectorRuntimeAdaptivePresentationPlans", category: "inspection" as const }),
    Object.freeze({ name: "findDirectorRuntimeAdaptivePresentationPlanById", category: "inspection" as const }),
    Object.freeze({ name: "findDirectorRuntimeAdaptivePresentationPlansBySubjectId", category: "inspection" as const }),
    Object.freeze({ name: "createDirectorRuntimeAdaptivePresentationPlanSnapshot", category: "inspection" as const }),
    Object.freeze({ name: "validateDirectorRuntimeAdaptivePresentationPlanCollection", category: "validation" as const }),
    Object.freeze({ name: "validateDirectorRuntimeAdaptivePresentationPlatform", category: "validation" as const }),
    Object.freeze({ name: "verifyDirectorRuntimeAdaptivePresentationPlatform", category: "verification" as const }),
    Object.freeze({ name: "verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility", category: "verification" as const }),
    Object.freeze({ name: "hasDirectorRuntimeAdaptivePresentationCapability", category: "verification" as const }),
    Object.freeze({ name: "getDirectorRuntimeAdaptivePresentationCapability", category: "verification" as const }),
    Object.freeze({ name: "verifyDirectorRuntimeAdaptivePresentationOrchestration", category: "verification" as const }),
  ] as const) satisfies readonly DirectorRuntimeAdaptivePresentationPlatformApprovedApiEntry[];

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_NAMES =
  Object.freeze(
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS.map(
      (entry) => entry.name,
    ),
  );

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS =
  Object.freeze([
    "exactly-one-immediate-dependency",
    "sole-dependency-is-dri-5-6",
    "exactly-eight-canonical-platform-capabilities",
    "every-canonical-capability-available",
    "capability-order-is-deterministic",
    "capability-entries-are-unique",
    "exactly-eight-canonical-guarantees",
    "guarantee-order-is-deterministic",
    "guarantee-entries-are-unique",
    "platform-exposes-existing-dri-5-semantics",
    "platform-does-not-duplicate-state-resolution",
    "platform-does-not-duplicate-attention-resolution",
    "platform-does-not-duplicate-emphasis-resolution",
    "platform-does-not-duplicate-density-resolution",
    "platform-does-not-duplicate-orchestration",
    "platform-preserves-plan-semantics",
    "platform-preserves-deterministic-behavior",
    "platform-preserves-runtime-immutability",
    "platform-remains-renderer-independent",
    "platform-remains-framework-independent",
    "platform-remains-side-effect-free",
    "platform-contains-no-ui-behavior",
    "platform-contains-no-renderer-behavior",
    "platform-contains-no-scene-behavior",
    "platform-contains-no-kpi-koi-calculation",
    "platform-contains-no-risk-calculation",
    "platform-contains-no-content-materialization",
    "platform-manifest-is-deterministic",
    "approved-api-registry-is-deterministic",
    "compatibility-result-is-deterministic",
    "platform-is-not-certified-in-dri-5-7",
    "platform-is-not-frozen-in-dri-5-7",
    "platform-is-not-the-public-index",
    "dri-5-8-plus-behavior-is-not-implemented",
  ] as const);

// ─── Platform descriptor ────────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationPlatform {
  readonly identity: typeof directorRuntimeAdaptivePresentationPlatformIdentity;
  readonly version: "5.7.0";
  readonly namespace: "nexora.dri.adaptive-presentation.platform";
  readonly dependency: typeof directorRuntimeAdaptivePresentationPlatformUpstream;
  readonly status: typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS;
  readonly capabilities: readonly DirectorRuntimeAdaptivePresentationPlatformCapability[];
  readonly guarantees: readonly DirectorRuntimeAdaptivePresentationPlatformGuarantee[];
}

export const directorRuntimeAdaptivePresentationPlatform = Object.freeze({
  identity: directorRuntimeAdaptivePresentationPlatformIdentity,
  version: directorRuntimeAdaptivePresentationPlatformVersion,
  namespace: directorRuntimeAdaptivePresentationPlatformNamespace,
  dependency: directorRuntimeAdaptivePresentationPlatformUpstream,
  status: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS,
  capabilities: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES,
  guarantees: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES,
  capabilityDescriptors:
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITY_DESCRIPTORS,
  approvedApis: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS,
  invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS,
  compatibility: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY,
  certified: false as const,
  frozen: false as const,
  released: false as const,
  readyForConsumer: false as const,
  soleConsumerEntryPoint: false as const,
  publicIndex: false as const,
  createIntent: createDirectorRuntimePresentationIntent,
  validateIntent: validateDirectorRuntimePresentationIntent,
  resolveState: resolveDirectorRuntimePresentationState,
  validateStateInput: validateDirectorRuntimePresentationStateResolutionInput,
  resolveAttention: resolveDirectorRuntimeAttention,
  resolveEmphasis: resolveDirectorRuntimeEmphasis,
  resolveAttentionEmphasis: resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDensity: resolveDirectorRuntimeInformationDensity,
  orchestrate: orchestrateDirectorRuntimeAdaptivePresentation,
  orchestrateBatch: orchestrateDirectorRuntimeAdaptivePresentations,
  validateOrchestrationInput:
    validateDirectorRuntimeAdaptivePresentationOrchestrationInput,
  validatePlanCollection: validateDirectorRuntimeAdaptivePresentationPlanCollection,
  plansEqual: areDirectorRuntimeAdaptivePresentationPlansEqual,
  comparePlans: compareDirectorRuntimeAdaptivePresentationPlans,
  findPlanById: findDirectorRuntimeAdaptivePresentationPlanById,
  findPlansBySubjectId: findDirectorRuntimeAdaptivePresentationPlansBySubjectId,
  createPlanSnapshot: createDirectorRuntimeAdaptivePresentationPlanSnapshot,
}) satisfies DirectorRuntimeAdaptivePresentationPlatform & Record<string, unknown>;

// ─── Manifest ───────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST =
  Object.freeze({
    identity: directorRuntimeAdaptivePresentationPlatformIdentity,
    version: directorRuntimeAdaptivePresentationPlatformVersion,
    namespace: directorRuntimeAdaptivePresentationPlatformNamespace,
    dependency: directorRuntimeAdaptivePresentationPlatformUpstream,
    status: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS,
    capabilities: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES,
    capabilityDescriptors:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITY_DESCRIPTORS,
    guarantees: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES,
    approvedApis: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS,
    approvedApiNames:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_NAMES,
    approvedApiCategories:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_CATEGORIES,
    invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS,
    compatibility: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY,
    platformInvariants: Object.freeze([
      "exposure-not-reimplementation",
      "single-immediate-dependency",
      "not-certified",
      "not-frozen",
      "not-public-index",
    ] as const),
  });

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeAdaptivePresentationPlatformRegistry = Object.freeze({
  identity: directorRuntimeAdaptivePresentationPlatformIdentity,
  version: directorRuntimeAdaptivePresentationPlatformVersion,
  namespace: directorRuntimeAdaptivePresentationPlatformNamespace,
  dependency: directorRuntimeAdaptivePresentationPlatformUpstream,
  status: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS,
  compatibility: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY,
  capabilities: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES,
  capabilityCount:
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES.length,
  guarantees: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES,
  guaranteeCount:
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES.length,
  approvedApis: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS,
  approvedApiCount:
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS.length,
  manifest: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST,
  invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS,
  invariantCount:
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS.length,
});

export const directorRuntimeAdaptivePresentationPlatformNamespaceSections =
  Object.freeze([
    "Identity",
    "Capabilities",
    "Intent",
    "State Resolution",
    "Attention & Emphasis",
    "Information Density",
    "Orchestration",
    "Plan Inspection",
    "Validation",
    "Compatibility",
    "Verification",
    "Platform Information",
  ] as const);

export const directorRuntimeAdaptivePresentationPlatformLayer = Object.freeze({
  phase: "DRI-5:7" as const,
  name: "DirectorRuntimeAdaptivePresentationPlatform" as const,
  identity: directorRuntimeAdaptivePresentationPlatformIdentity,
  namespace: directorRuntimeAdaptivePresentationPlatformNamespace,
  version: directorRuntimeAdaptivePresentationPlatformVersion,
  layer: "DirectorRuntimeAdaptivePresentation" as const,
  stage: "AdaptivePresentationPlatform" as const,
  status: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS,
  upstreamDependency: directorRuntimeAdaptivePresentationPlatformUpstream,
  deterministic: true as const,
  immutable: true as const,
  rendererIndependent: true as const,
  frameworkIndependent: true as const,
  sideEffectFree: true as const,
  semantic: true as const,
  certified: false as const,
  frozen: false as const,
  released: false as const,
  readyForConsumer: false as const,
  soleConsumerEntryPoint: false as const,
  publicIndex: false as const,
  capabilities: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES,
  guarantees: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES,
  invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS,
  approvedApiSurface:
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_NAMES,
  registry: directorRuntimeAdaptivePresentationPlatformRegistry,
  manifest: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST,
  namespaceSections:
    directorRuntimeAdaptivePresentationPlatformNamespaceSections,
  architecturalStatus:
    "Established · Deterministic · Immutable · Semantic · Compatible · RendererIndependent · ReadyForCertification" as const,
});

// ─── Capability query / inspection ──────────────────────────────────────────

export function hasDirectorRuntimeAdaptivePresentationCapability(
  capability: unknown,
): boolean {
  return (
    typeof capability === "string" &&
    (DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES as readonly string[])
      .includes(capability)
  );
}

export function getDirectorRuntimeAdaptivePresentationCapability(
  capability: DirectorRuntimeAdaptivePresentationPlatformCapability,
): DirectorRuntimeAdaptivePresentationPlatformCapabilityDescriptor | null {
  const descriptor =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITY_DESCRIPTORS.find(
      (entry) => entry.capability === capability,
    );
  return descriptor ?? null;
}

// ─── Compatibility verification ─────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationPlatformCompatibilityVerification {
  readonly compatible: boolean;
  readonly status: DirectorRuntimeAdaptivePresentationPlatformCompatibilityStatus;
  readonly dependency: typeof directorRuntimeAdaptivePresentationPlatformUpstream;
  readonly expectedDependency: "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration";
  readonly orchestrationIdentityMatches: boolean;
  readonly requiredCapabilitiesAvailable: boolean;
  readonly requiredGuaranteesPresent: boolean;
}

export function verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility():
  DirectorRuntimeAdaptivePresentationPlatformCompatibilityVerification {
  const orchestrationIdentityMatches =
    directorRuntimeAdaptivePresentationPlatformUpstream ===
      "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration" &&
    directorRuntimeAdaptivePresentationPlatformUpstream ===
      directorRuntimeAdaptivePresentationOrchestrationIdentity;

  const requiredCapabilitiesAvailable =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES.length === 8 &&
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITY_DESCRIPTORS
      .every((descriptor) => descriptor.available === true);

  const requiredGuaranteesPresent =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES.length === 8 &&
    exactOrder(
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES,
      [
        "deterministic",
        "immutable",
        "semantic",
        "renderer-independent",
        "framework-independent",
        "side-effect-free",
        "ordered",
        "upstream-preserving",
      ],
    );

  const compatible =
    orchestrationIdentityMatches &&
    requiredCapabilitiesAvailable &&
    requiredGuaranteesPresent &&
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY.status ===
      "compatible";

  return Object.freeze({
    compatible,
    status: compatible ? ("compatible" as const) : ("incompatible" as const),
    dependency: directorRuntimeAdaptivePresentationPlatformUpstream,
    expectedDependency:
      "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration" as const,
    orchestrationIdentityMatches,
    requiredCapabilitiesAvailable,
    requiredGuaranteesPresent,
  });
}

// ─── Platform validation ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_VALIDATION_ISSUE_CODES =
  Object.freeze([
    "wrong-identity",
    "wrong-version",
    "wrong-namespace",
    "wrong-dependency",
    "missing-capability",
    "duplicate-capability",
    "unexpected-capability",
    "wrong-capability-order",
    "missing-guarantee",
    "duplicate-guarantee",
    "unexpected-guarantee",
    "wrong-guarantee-order",
    "invalid-manifest",
    "incomplete-approved-apis",
    "wrong-status",
  ] as const);
export type DirectorRuntimeAdaptivePresentationPlatformValidationIssueCode =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_VALIDATION_ISSUE_CODES)[number];

export interface DirectorRuntimeAdaptivePresentationPlatformValidationIssue {
  readonly code: DirectorRuntimeAdaptivePresentationPlatformValidationIssueCode;
  readonly message: string;
}

export interface DirectorRuntimeAdaptivePresentationPlatformValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DirectorRuntimeAdaptivePresentationPlatformValidationIssue[];
}

export interface DirectorRuntimeAdaptivePresentationPlatformValidationInput {
  readonly identity?: unknown;
  readonly version?: unknown;
  readonly namespace?: unknown;
  readonly dependency?: unknown;
  readonly status?: unknown;
  readonly capabilities?: readonly unknown[];
  readonly guarantees?: readonly unknown[];
  readonly approvedApiNames?: readonly unknown[];
  readonly manifest?: unknown;
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

function issue(
  code: DirectorRuntimeAdaptivePresentationPlatformValidationIssueCode,
  message: string,
): DirectorRuntimeAdaptivePresentationPlatformValidationIssue {
  return Object.freeze({ code, message });
}

function collectSequenceIssues(
  actual: readonly unknown[] | undefined,
  expected: readonly string[],
  missingCode: DirectorRuntimeAdaptivePresentationPlatformValidationIssueCode,
  duplicateCode: DirectorRuntimeAdaptivePresentationPlatformValidationIssueCode,
  unexpectedCode: DirectorRuntimeAdaptivePresentationPlatformValidationIssueCode,
  orderCode: DirectorRuntimeAdaptivePresentationPlatformValidationIssueCode,
  label: string,
): DirectorRuntimeAdaptivePresentationPlatformValidationIssue[] {
  const issues: DirectorRuntimeAdaptivePresentationPlatformValidationIssue[] = [];
  if (!Array.isArray(actual)) {
    issues.push(issue(missingCode, `${label} sequence is missing`));
    return issues;
  }

  const seen = new Set<string>();
  for (const value of actual) {
    if (typeof value !== "string") {
      issues.push(issue(unexpectedCode, `${label} contains non-string entry`));
      continue;
    }
    if (seen.has(value)) {
      issues.push(issue(duplicateCode, `duplicate ${label}: ${value}`));
    }
    seen.add(value);
    if (!(expected as readonly string[]).includes(value)) {
      issues.push(issue(unexpectedCode, `unexpected ${label}: ${value}`));
    }
  }

  for (const expectedValue of expected) {
    if (!seen.has(expectedValue)) {
      issues.push(issue(missingCode, `missing ${label}: ${expectedValue}`));
    }
  }

  if (
    actual.every((value) => typeof value === "string") &&
    !exactOrder(actual as readonly string[], expected)
  ) {
    issues.push(issue(orderCode, `${label} order is not canonical`));
  }

  return issues;
}

export function validateDirectorRuntimeAdaptivePresentationPlatform(
  input: DirectorRuntimeAdaptivePresentationPlatformValidationInput =
    directorRuntimeAdaptivePresentationPlatform,
): DirectorRuntimeAdaptivePresentationPlatformValidationResult {
  const issues: DirectorRuntimeAdaptivePresentationPlatformValidationIssue[] = [];

  if (input.identity !== directorRuntimeAdaptivePresentationPlatformIdentity) {
    issues.push(issue("wrong-identity", "platform identity is not canonical"));
  }
  if (input.version !== directorRuntimeAdaptivePresentationPlatformVersion) {
    issues.push(issue("wrong-version", "platform version is not 5.7.0"));
  }
  if (input.namespace !== directorRuntimeAdaptivePresentationPlatformNamespace) {
    issues.push(issue("wrong-namespace", "platform namespace is not canonical"));
  }
  if (
    input.dependency !==
      "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration"
  ) {
    issues.push(issue("wrong-dependency", "platform dependency is not DRI-5:6"));
  }
  if (
    input.status !== undefined &&
    input.status !== DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS
  ) {
    issues.push(issue("wrong-status", "platform status is not ready-for-certification"));
  }

  issues.push(
    ...collectSequenceIssues(
      input.capabilities,
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES,
      "missing-capability",
      "duplicate-capability",
      "unexpected-capability",
      "wrong-capability-order",
      "capability",
    ),
  );

  issues.push(
    ...collectSequenceIssues(
      input.guarantees,
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES,
      "missing-guarantee",
      "duplicate-guarantee",
      "unexpected-guarantee",
      "wrong-guarantee-order",
      "guarantee",
    ),
  );

  const approved =
    input.approvedApiNames ??
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_NAMES;
  if (
    !Array.isArray(approved) ||
    !exactOrder(
      approved.filter((value): value is string => typeof value === "string"),
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_NAMES,
    ) ||
    approved.length !==
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_NAMES.length
  ) {
    issues.push(
      issue("incomplete-approved-apis", "approved API registry is incomplete"),
    );
  }

  const manifest = input.manifest ?? DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST;
  if (
    manifest === null ||
    typeof manifest !== "object" ||
    (manifest as { identity?: unknown }).identity !==
      directorRuntimeAdaptivePresentationPlatformIdentity ||
    (manifest as { version?: unknown }).version !==
      directorRuntimeAdaptivePresentationPlatformVersion ||
    (manifest as { namespace?: unknown }).namespace !==
      directorRuntimeAdaptivePresentationPlatformNamespace ||
    (manifest as { dependency?: unknown }).dependency !==
      "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration"
  ) {
    issues.push(issue("invalid-manifest", "platform manifest integrity failed"));
  }

  const orderedIssueCodes =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_VALIDATION_ISSUE_CODES;
  const sorted = [...issues].sort((left, right) => {
    const leftIndex = orderedIssueCodes.indexOf(left.code);
    const rightIndex = orderedIssueCodes.indexOf(right.code);
    if (leftIndex !== rightIndex) return leftIndex - rightIndex;
    return left.message.localeCompare(right.message);
  });

  return Object.freeze({
    valid: sorted.length === 0,
    issues: Object.freeze(sorted.map((entry) => Object.freeze({ ...entry }))),
  });
}

// ─── Platform verification ──────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationPlatformVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAdaptivePresentationPlatformIdentity;
  readonly version: typeof directorRuntimeAdaptivePresentationPlatformVersion;
  readonly namespace: typeof directorRuntimeAdaptivePresentationPlatformNamespace;
  readonly dependency: typeof directorRuntimeAdaptivePresentationPlatformUpstream;
  readonly status: typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS;
  readonly capabilityCount: number;
  readonly guaranteeCount: number;
  readonly approvedApiCount: number;
  readonly invariantCount: number;
  readonly namespaceSectionCount: number;
  readonly compatibility: DirectorRuntimeAdaptivePresentationPlatformCompatibilityVerification;
  readonly validation: DirectorRuntimeAdaptivePresentationPlatformValidationResult;
  readonly frozen: boolean;
  readonly certified: false;
  readonly publicIndex: false;
}

export function verifyDirectorRuntimeAdaptivePresentationPlatform():
  DirectorRuntimeAdaptivePresentationPlatformVerification {
  const compatibility =
    verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility();
  const validation = validateDirectorRuntimeAdaptivePresentationPlatform(
    directorRuntimeAdaptivePresentationPlatform,
  );

  const identityIntegrity =
    directorRuntimeAdaptivePresentationPlatform.identity ===
      "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform" &&
    directorRuntimeAdaptivePresentationPlatform.version === "5.7.0" &&
    directorRuntimeAdaptivePresentationPlatform.namespace ===
      "nexora.dri.adaptive-presentation.platform" &&
    directorRuntimeAdaptivePresentationPlatform.dependency ===
      "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration";

  const capabilityIntegrity = exactOrder(
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES,
    [
      "foundation",
      "intent",
      "state-resolution",
      "attention-emphasis",
      "information-density",
      "orchestration",
      "plan-inspection",
      "batch-orchestration",
    ],
  );

  const guaranteeIntegrity = exactOrder(
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES,
    [
      "deterministic",
      "immutable",
      "semantic",
      "renderer-independent",
      "framework-independent",
      "side-effect-free",
      "ordered",
      "upstream-preserving",
    ],
  );

  const manifestIntegrity =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST.identity ===
      directorRuntimeAdaptivePresentationPlatformIdentity &&
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST.version ===
      directorRuntimeAdaptivePresentationPlatformVersion &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST);

  const approvedApiIntegrity =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS.length ===
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_NAMES.length &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS);

  const invariantIntegrity =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS.length === 34 &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS);

  const boundaryIntegrity =
    directorRuntimeAdaptivePresentationPlatform.certified === false &&
    directorRuntimeAdaptivePresentationPlatform.frozen === false &&
    directorRuntimeAdaptivePresentationPlatform.released === false &&
    directorRuntimeAdaptivePresentationPlatform.readyForConsumer === false &&
    directorRuntimeAdaptivePresentationPlatform.soleConsumerEntryPoint === false &&
    directorRuntimeAdaptivePresentationPlatform.publicIndex === false &&
    directorRuntimeAdaptivePresentationPlatform.status ===
      "ready-for-certification";

  const ok =
    identityIntegrity &&
    capabilityIntegrity &&
    guaranteeIntegrity &&
    manifestIntegrity &&
    approvedApiIntegrity &&
    invariantIntegrity &&
    boundaryIntegrity &&
    compatibility.compatible &&
    validation.valid &&
    Object.isFrozen(directorRuntimeAdaptivePresentationPlatform) &&
    Object.isFrozen(directorRuntimeAdaptivePresentationPlatformRegistry);

  return Object.freeze({
    ok,
    identity: directorRuntimeAdaptivePresentationPlatformIdentity,
    version: directorRuntimeAdaptivePresentationPlatformVersion,
    namespace: directorRuntimeAdaptivePresentationPlatformNamespace,
    dependency: directorRuntimeAdaptivePresentationPlatformUpstream,
    status: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS,
    capabilityCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES.length,
    guaranteeCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES.length,
    approvedApiCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS.length,
    invariantCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_INVARIANTS.length,
    namespaceSectionCount:
      directorRuntimeAdaptivePresentationPlatformNamespaceSections.length,
    compatibility,
    validation,
    frozen: Object.isFrozen(directorRuntimeAdaptivePresentationPlatform),
    certified: false as const,
    publicIndex: false as const,
  });
}
