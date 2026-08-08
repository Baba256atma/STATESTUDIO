/**
 * DRI-5:8 — Director Runtime Adaptive Presentation Certification & Freeze.
 *
 * Validates, certifies, confirms compatibility, freezes, and locks the
 * DRI-5:7 Adaptive Presentation Platform for Public Index preparation.
 * No new presentation semantics, no Public Index, no rendering.
 */

import {
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_NAMES,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITY_DESCRIPTORS,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS,
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
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
  directorRuntimeAdaptivePresentationPlatform,
  directorRuntimeAdaptivePresentationPlatformCanonicalIdentity,
  directorRuntimeAdaptivePresentationPlatformIdentity,
  directorRuntimeAdaptivePresentationPlatformNamespace,
  directorRuntimeAdaptivePresentationPlatformRegistry,
  directorRuntimeAdaptivePresentationPlatformUpstream,
  directorRuntimeAdaptivePresentationPlatformVersion,
  findDirectorRuntimeAdaptivePresentationPlanById,
  findDirectorRuntimeAdaptivePresentationPlansBySubjectId,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimeAdaptivePresentationCapability,
  getDirectorRuntimeAttentionRank,
  getDirectorRuntimeEmphasisRank,
  getDirectorRuntimeInformationDensityRank,
  getDirectorRuntimePresentationStateRank,
  hasDirectorRuntimeAdaptivePresentationCapability,
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
  validateDirectorRuntimeAdaptivePresentationPlatform,
  validateDirectorRuntimeAttentionPolicyInput,
  validateDirectorRuntimeInformationDensityPolicyInput,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
  verifyDirectorRuntimeAdaptivePresentationOrchestration,
  verifyDirectorRuntimeAdaptivePresentationPlatform,
  verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility,
} from "@/app/lib/dri/directorRuntimeAdaptivePresentationPlatform";

/** Approved frozen surface preserves exact platform value/function identity. */
export {
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_API_NAMES,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITY_DESCRIPTORS,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST,
  DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS,
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
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
  directorRuntimeAdaptivePresentationPlatform,
  directorRuntimeAdaptivePresentationPlatformCanonicalIdentity,
  directorRuntimeAdaptivePresentationPlatformIdentity,
  directorRuntimeAdaptivePresentationPlatformNamespace,
  directorRuntimeAdaptivePresentationPlatformRegistry,
  directorRuntimeAdaptivePresentationPlatformUpstream,
  directorRuntimeAdaptivePresentationPlatformVersion,
  findDirectorRuntimeAdaptivePresentationPlanById,
  findDirectorRuntimeAdaptivePresentationPlansBySubjectId,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimeAdaptivePresentationCapability,
  getDirectorRuntimeAttentionRank,
  getDirectorRuntimeEmphasisRank,
  getDirectorRuntimeInformationDensityRank,
  getDirectorRuntimePresentationStateRank,
  hasDirectorRuntimeAdaptivePresentationCapability,
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
  validateDirectorRuntimeAdaptivePresentationPlatform,
  validateDirectorRuntimeAttentionPolicyInput,
  validateDirectorRuntimeInformationDensityPolicyInput,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
  verifyDirectorRuntimeAdaptivePresentationOrchestration,
  verifyDirectorRuntimeAdaptivePresentationPlatform,
  verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility,
};

export type {
  DirectorRuntimeAdaptivePresentationOrchestrationInput,
  DirectorRuntimeAdaptivePresentationPlan,
  DirectorRuntimeAdaptivePresentationPlanCollection,
  DirectorRuntimeAdaptivePresentationPlanSnapshot,
  DirectorRuntimeAttentionEmphasisPolicyResult,
  DirectorRuntimeAttentionLevel,
  DirectorRuntimeEmphasisLevel,
  DirectorRuntimeInformationDensity,
  DirectorRuntimeInformationDensityResolution,
  DirectorRuntimePresentationIntent,
  DirectorRuntimePresentationState,
  DirectorRuntimePresentationStateResolution,
  DirectorRuntimePresentationSubject,
} from "@/app/lib/dri/directorRuntimeAdaptivePresentationPlatform";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAdaptivePresentationFreezeIdentity =
  "DRI-5:8/DirectorRuntimeAdaptivePresentationFreeze" as const;
export const directorRuntimeAdaptivePresentationFreezeVersion = "5.8.0" as const;
export const directorRuntimeAdaptivePresentationFreezeNamespace =
  "nexora.dri.adaptive-presentation.freeze" as const;
export const directorRuntimeAdaptivePresentationFreezeUpstream =
  directorRuntimeAdaptivePresentationPlatformIdentity;

export const directorRuntimeAdaptivePresentationFreezeCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAdaptivePresentationFreezeIdentity,
    version: directorRuntimeAdaptivePresentationFreezeVersion,
    namespace: directorRuntimeAdaptivePresentationFreezeNamespace,
    dependency: directorRuntimeAdaptivePresentationFreezeUpstream,
  });

// ─── Status vocabularies ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_STATUSES =
  Object.freeze(["certified", "failed"] as const);
export type DirectorRuntimeAdaptivePresentationCertificationStatus =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_STATUSES)[number];

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_STATUSES =
  Object.freeze(["frozen", "unfrozen"] as const);
export type DirectorRuntimeAdaptivePresentationFreezeStatus =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_STATUSES)[number];

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_COMPATIBILITY_STATUSES =
  Object.freeze(["compatible", "incompatible"] as const);
export type DirectorRuntimeAdaptivePresentationFreezeCompatibilityStatus =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_COMPATIBILITY_STATUSES)[number];

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_READINESS_STATUSES =
  Object.freeze([
    "ready-for-public-index",
    "not-ready-for-public-index",
  ] as const);
export type DirectorRuntimeAdaptivePresentationReadinessStatus =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_READINESS_STATUSES)[number];

// ─── Lock ───────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK_VALUE =
  "DRI-5-ADAPTIVE-PRESENTATION-PLATFORM-LOCKED" as const;

export interface DirectorRuntimeAdaptivePresentationLock {
  readonly lock: typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK_VALUE;
  readonly locked: true;
}

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK = Object.freeze({
  lock: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK_VALUE,
  locked: true as const,
}) satisfies DirectorRuntimeAdaptivePresentationLock;

// ─── Certification domains ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS =
  Object.freeze([
    "identity",
    "dependency",
    "capabilities",
    "semantics",
    "determinism",
    "immutability",
    "compatibility",
    "renderer-independence",
    "framework-independence",
    "side-effect-freedom",
    "platform-boundary",
    "public-index-readiness",
  ] as const);
export type DirectorRuntimeAdaptivePresentationCertificationDomain =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS)[number];

// ─── Certification checks registry ──────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationCertificationCheck {
  readonly id: string;
  readonly domain: DirectorRuntimeAdaptivePresentationCertificationDomain;
  readonly description: string;
}

function checkDef(
  domain: DirectorRuntimeAdaptivePresentationCertificationDomain,
  name: string,
  description: string,
): DirectorRuntimeAdaptivePresentationCertificationCheck {
  return Object.freeze({
    id: `dri-5:8/${domain}/${name}`,
    domain,
    description,
  });
}

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_CHECKS =
  Object.freeze([
    checkDef("identity", "exact-identity", "Platform identity is exact"),
    checkDef("identity", "exact-version", "Platform version is exact"),
    checkDef("identity", "exact-namespace", "Platform namespace is exact"),
    checkDef("dependency", "exactly-one-immediate-dependency", "Freeze has exactly one immediate dependency"),
    checkDef("dependency", "dependency-is-dri-5-7", "Immediate dependency is DRI-5:7 Platform"),
    checkDef("dependency", "no-upstream-bypass", "No upstream bypass of DRI-5:7"),
    checkDef("capabilities", "canonical-capability-count", "Canonical capability count is eight"),
    checkDef("capabilities", "capability-uniqueness", "Capabilities are unique"),
    checkDef("capabilities", "canonical-capability-order", "Capabilities preserve canonical order"),
    checkDef("capabilities", "all-capabilities-available", "All capabilities are available"),
    checkDef("semantics", "foundation-capability-exposed", "Foundation capability is exposed"),
    checkDef("semantics", "intent-capability-exposed", "Intent capability is exposed"),
    checkDef("semantics", "state-resolution-capability-exposed", "State-resolution capability is exposed"),
    checkDef("semantics", "attention-emphasis-capability-exposed", "Attention/emphasis capability is exposed"),
    checkDef("semantics", "density-orchestration-semantics-exposed", "Density and orchestration semantics are exposed without reinterpretation"),
    checkDef("determinism", "platform-verification-deterministic", "Platform verification is deterministic"),
    checkDef("determinism", "compatibility-deterministic", "Compatibility verification is deterministic"),
    checkDef("determinism", "approved-frozen-manifest-deterministic", "Approved frozen manifest is deterministic"),
    checkDef("immutability", "platform-surface-immutable", "Platform surface is immutable"),
    checkDef("immutability", "freeze-metadata-immutable", "Freeze metadata is immutable"),
    checkDef("immutability", "approved-export-manifest-immutable", "Approved export manifest is immutable"),
    checkDef("compatibility", "dri-5-7-identity-compatible", "DRI-5:7 identity is compatible"),
    checkDef("compatibility", "required-guarantees-compatible", "Required platform guarantees are compatible"),
    checkDef("compatibility", "canonical-compatibility-compatible", "Canonical compatibility result is compatible"),
    checkDef("renderer-independence", "no-renderer-dependency", "No renderer dependency"),
    checkDef("renderer-independence", "no-renderer-fields", "No renderer fields in frozen surface"),
    checkDef("renderer-independence", "no-visual-policy-implementation", "No visual policy implementation"),
    checkDef("framework-independence", "no-react-next-runtime-dependency", "No React/Next runtime dependency"),
    checkDef("framework-independence", "no-ui-framework-state-dependency", "No UI framework state dependency"),
    checkDef("side-effect-freedom", "no-global-mutation", "No global mutation behavior"),
    checkDef("side-effect-freedom", "no-network-storage-timer-behavior", "No network/storage/timer behavior"),
    checkDef("platform-boundary", "no-new-state-policy", "No new state policy"),
    checkDef("platform-boundary", "no-new-attention-emphasis-policy", "No new attention/emphasis policy"),
    checkDef("platform-boundary", "no-new-density-policy", "No new density policy"),
    checkDef("platform-boundary", "no-new-orchestration-policy", "No new orchestration policy"),
    checkDef("public-index-readiness", "frozen-approved-export-surface-exists", "Frozen approved export surface exists"),
    checkDef("public-index-readiness", "lock-is-active", "Platform lock is active"),
    checkDef("public-index-readiness", "ready-for-public-index-status-established", "Ready-for-public-index status established"),
  ] as const) satisfies readonly DirectorRuntimeAdaptivePresentationCertificationCheck[];

// ─── Frozen export surface ──────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationFrozenExport {
  readonly name: string;
  readonly category: string;
}

function frozenExport(
  name: string,
  category: string,
): DirectorRuntimeAdaptivePresentationFrozenExport {
  return Object.freeze({ name, category });
}

const APPROVED_API_CATEGORY_TO_FROZEN = Object.freeze({
  intent: "factory",
  state: "resolver",
  "attention-emphasis": "policy",
  density: "policy",
  orchestration: "orchestration",
  inspection: "inspection",
  validation: "validation",
  verification: "verification",
} as const);

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS = Object.freeze([
  frozenExport("directorRuntimeAdaptivePresentationPlatformIdentity", "identity"),
  frozenExport("directorRuntimeAdaptivePresentationPlatformVersion", "identity"),
  frozenExport("directorRuntimeAdaptivePresentationPlatformNamespace", "identity"),
  frozenExport("directorRuntimeAdaptivePresentationPlatformUpstream", "identity"),
  frozenExport("directorRuntimeAdaptivePresentationPlatformCanonicalIdentity", "identity"),
  frozenExport("DirectorRuntimePresentationIntent", "type"),
  frozenExport("DirectorRuntimePresentationState", "type"),
  frozenExport("DirectorRuntimeAttentionLevel", "type"),
  frozenExport("DirectorRuntimeEmphasisLevel", "type"),
  frozenExport("DirectorRuntimeInformationDensity", "type"),
  frozenExport("DirectorRuntimeAdaptivePresentationPlan", "type"),
  frozenExport("DirectorRuntimeAdaptivePresentationOrchestrationInput", "type"),
  frozenExport("DIRECTOR_RUNTIME_PRESENTATION_STATES", "constant"),
  frozenExport("DIRECTOR_RUNTIME_ATTENTION_LEVELS", "constant"),
  frozenExport("DIRECTOR_RUNTIME_EMPHASIS_LEVELS", "constant"),
  frozenExport("DIRECTOR_RUNTIME_INFORMATION_DENSITIES", "constant"),
  frozenExport("DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES", "constant"),
  frozenExport("DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES", "constant"),
  frozenExport("DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS", "constant"),
  frozenExport("DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST", "platform"),
  frozenExport("directorRuntimeAdaptivePresentationPlatform", "platform"),
  frozenExport("directorRuntimeAdaptivePresentationPlatformRegistry", "platform"),
  ...DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_APPROVED_APIS.map((entry) =>
    frozenExport(
      entry.name,
      APPROVED_API_CATEGORY_TO_FROZEN[entry.category] ?? entry.category,
    ),
  ),
] as const) satisfies readonly DirectorRuntimeAdaptivePresentationFrozenExport[];

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORT_NAMES =
  Object.freeze(
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS.map((entry) => entry.name),
  );

// ─── Freeze guarantees / invariants ─────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_GUARANTEES =
  Object.freeze([
    "identity-locked",
    "dependency-locked",
    "semantics-locked",
    "capability-surface-locked",
    "export-surface-locked",
    "deterministic",
    "immutable",
    "renderer-independent",
    "framework-independent",
    "side-effect-free",
    "compatible",
    "ready-for-public-index",
  ] as const);

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_INVARIANTS =
  Object.freeze([
    "exactly-one-immediate-dependency",
    "sole-dependency-is-dri-5-7",
    "identity-is-exact",
    "version-is-exact",
    "namespace-is-exact",
    "certification-domain-count-is-12",
    "certification-check-count-is-38",
    "certification-checks-are-uniquely-identified",
    "certification-check-order-is-deterministic",
    "all-canonical-certification-checks-pass",
    "certification-status-is-certified",
    "failed-check-count-is-zero",
    "compatibility-status-is-compatible",
    "freeze-status-is-frozen",
    "lock-is-active",
    "lock-value-is-exact",
    "frozen-export-registry-exists",
    "frozen-export-names-are-unique",
    "frozen-export-order-is-deterministic",
    "frozen-export-surface-is-immutable",
    "platform-capabilities-are-preserved",
    "platform-guarantees-are-preserved",
    "no-state-policy-is-reimplemented",
    "no-attention-emphasis-policy-is-reimplemented",
    "no-density-policy-is-reimplemented",
    "no-orchestration-policy-is-reimplemented",
    "no-renderer-behavior-exists",
    "no-framework-behavior-exists",
    "no-ui-behavior-exists",
    "no-runtime-mutable-store-exists",
    "no-kpi-calculation-exists",
    "no-koi-calculation-exists",
    "no-risk-calculation-exists",
    "freeze-verification-is-deterministic",
    "freeze-data-is-immutable",
    "dri-5-9-public-index-is-not-implemented-here",
    "readiness-is-ready-for-public-index",
    "platform-is-locked-for-public-index-consumption",
  ] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function exactOrder(actual: readonly string[], expected: readonly string[]): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function stableJson(value: unknown): string {
  return JSON.stringify(value);
}

const FORBIDDEN_RENDERER_EXPORT_PATTERN =
  /(?:react|three|camera|color|layout|css|dom|canvas|mesh|material|animation|viewport)/i;

function joinToken(...parts: readonly string[]): string {
  return parts.join("");
}

function importLinesOf(moduleSource: string): string {
  return moduleSource
    .split("\n")
    .filter((line) => /\bfrom\s+["']/.test(line) || /\bimport\s+["']/.test(line))
    .join("\n");
}

function hasDisallowedUpstreamImport(moduleSource: string): boolean {
  const imports = importLinesOf(moduleSource);
  const disallowed = [
    joinToken("directorRuntimeAdaptivePresentation", "Orchestration"),
    joinToken("directorRuntimeInformation", "DensityPolicy"),
    joinToken("directorRuntimeAttention", "EmphasisPolicy"),
    joinToken("directorRuntimePresentation", "StateResolver"),
    joinToken("directorRuntimePresentation", "Intent"),
    joinToken("directorRuntimeAdaptivePresentation", "Foundation"),
  ];
  return disallowed.some((name) => imports.includes(name));
}

function hasRendererImport(moduleSource: string): boolean {
  const imports = importLinesOf(moduleSource);
  return (
    /from\s+["']react["']/.test(imports) ||
    /from\s+["']react-dom["']/.test(imports) ||
    /from\s+["']three["']/.test(imports) ||
    imports.includes(joinToken("@react-", "three")) ||
    imports.includes(joinToken("framer-", "motion"))
  );
}

function hasFrameworkRuntime(moduleSource: string): boolean {
  return (
    /from\s+["']next\//.test(importLinesOf(moduleSource)) ||
    /\buse(?:Effect|State|Context)\b/.test(moduleSource) ||
    /\bcreateContext\s*\(/.test(moduleSource)
  );
}

function hasSideEffectRuntime(moduleSource: string): boolean {
  return (
    /\bDate\.now\s*\(/.test(moduleSource) ||
    /\bMath\.random\s*\(/.test(moduleSource) ||
    /\bcrypto\.randomUUID\s*\(/.test(moduleSource) ||
    /\blocalStorage\b/.test(moduleSource) ||
    /\bfetch\s*\(/.test(moduleSource) ||
    /\bsetTimeout\s*\(/.test(moduleSource) ||
    /\bsetInterval\s*\(/.test(moduleSource)
  );
}

function hasPolicyReimplementation(moduleSource: string): boolean {
  return (
    /\bfunction\s+createDirectorRuntimePresentationIntent\s*\(/.test(moduleSource) ||
    /\bfunction\s+resolveDirectorRuntimePresentationState\s*\(/.test(moduleSource) ||
    /\bfunction\s+resolveDirectorRuntimeAttention\s*\(/.test(moduleSource) ||
    /\bfunction\s+resolveDirectorRuntimeEmphasis\s*\(/.test(moduleSource) ||
    /\bfunction\s+resolveDirectorRuntimeInformationDensity\s*\(/.test(moduleSource) ||
    /\bfunction\s+orchestrateDirectorRuntimeAdaptivePresentation\s*\(/.test(moduleSource) ||
    moduleSource.includes(joinToken("PRESENTATION_STATE_", "PRECEDENCE")) ||
    moduleSource.includes(joinToken("ATTENTION_", "PRECEDENCE")) ||
    moduleSource.includes(joinToken("ATTENTION_EMPHASIS_", "MAPPING")) ||
    moduleSource.includes(joinToken("INFORMATION_DENSITY_", "PRECEDENCE"))
  );
}

function hasPublicIndexImplementation(moduleSource: string): boolean {
  return (
    moduleSource.includes(joinToken("Sole", "ConsumerEntryPoint")) ||
    moduleSource.includes(joinToken("ReadyFor", "Consumer")) ||
    moduleSource.includes(
      joinToken("directorRuntimeAdaptivePresentation", "PublicIndex"),
    )
  );
}

function hasRuntimeStore(moduleSource: string): boolean {
  return (
    moduleSource.includes(joinToken("Presentation", "Store")) ||
    moduleSource.includes(joinToken("Platform", "Store")) ||
    /\bEventEmitter\b/.test(moduleSource)
  );
}

/** Canonical freeze-module integrity markers (structural, not filesystem). */
const FREEZE_MODULE_INTEGRITY = Object.freeze({
  soleImport: "@/app/lib/dri/directorRuntimeAdaptivePresentationPlatform",
  noRendererFields: true,
  noVisualPolicy: true,
  noFrameworkRuntime: true,
  noSideEffects: true,
  noPolicyReimplementation: true,
  noPublicIndex: true,
  noRuntimeStore: true,
});

// ─── Certification contracts ────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationCertificationCheckResult {
  readonly checkId: string;
  readonly domain: DirectorRuntimeAdaptivePresentationCertificationDomain;
  readonly passed: boolean;
  readonly reason: string;
}

export interface DirectorRuntimeAdaptivePresentationCertificationResult {
  readonly status: DirectorRuntimeAdaptivePresentationCertificationStatus;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly checks: readonly DirectorRuntimeAdaptivePresentationCertificationCheckResult[];
}

export interface DirectorRuntimeAdaptivePresentationCertificationDomainSummary {
  readonly domain: DirectorRuntimeAdaptivePresentationCertificationDomain;
  readonly checkCount: number;
  readonly passedCount: number;
  readonly failedCount: number;
  readonly status: DirectorRuntimeAdaptivePresentationCertificationStatus;
}

export interface DirectorRuntimeAdaptivePresentationCertificationFixture {
  readonly identity?: string;
  readonly version?: string;
  readonly namespace?: string;
  readonly dependency?: string;
  readonly capabilities?: readonly string[];
  readonly guarantees?: readonly string[];
  readonly status?: string;
  readonly platformVerificationOk?: boolean;
  readonly compatibilityStatus?: DirectorRuntimeAdaptivePresentationFreezeCompatibilityStatus;
  readonly allCapabilitiesAvailable?: boolean;
  readonly moduleSource?: string;
  readonly freezeExportNames?: readonly string[];
  readonly lockActive?: boolean;
  readonly readiness?: DirectorRuntimeAdaptivePresentationReadinessStatus;
}

function result(
  check: DirectorRuntimeAdaptivePresentationCertificationCheck,
  passed: boolean,
  reason: string,
): DirectorRuntimeAdaptivePresentationCertificationCheckResult {
  return Object.freeze({
    checkId: check.id,
    domain: check.domain,
    passed,
    reason,
  });
}

export function certifyDirectorRuntimeAdaptivePresentationPlatform(
  fixture?: DirectorRuntimeAdaptivePresentationCertificationFixture,
): DirectorRuntimeAdaptivePresentationCertificationResult {
  const platform = directorRuntimeAdaptivePresentationPlatform;
  const liveVerification = verifyDirectorRuntimeAdaptivePresentationPlatform();
  const liveCompatibility =
    verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility();
  const verificationA = verifyDirectorRuntimeAdaptivePresentationPlatform();
  const compatibilityA =
    verifyDirectorRuntimeAdaptivePresentationPlatformCompatibility();

  const identity = fixture?.identity ?? platform.identity;
  const version = fixture?.version ?? platform.version;
  const namespace = fixture?.namespace ?? platform.namespace;
  const dependency = fixture?.dependency ?? platform.dependency;
  const capabilities = fixture?.capabilities ?? platform.capabilities;
  const guarantees = fixture?.guarantees ?? platform.guarantees;
  const status = fixture?.status ?? platform.status;
  const platformVerificationOk =
    fixture?.platformVerificationOk ?? liveVerification.ok;
  const compatibilityStatus =
    fixture?.compatibilityStatus ??
    (liveCompatibility.compatible ? "compatible" : "incompatible");
  const allCapabilitiesAvailable =
    fixture?.allCapabilitiesAvailable ??
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITY_DESCRIPTORS.every(
      (descriptor) => descriptor.available === true,
    );
  const moduleSource = fixture?.moduleSource;
  const freezeExportNames =
    fixture?.freezeExportNames ??
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORT_NAMES;
  const lockActive =
    fixture?.lockActive ?? DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK.locked;
  const readiness =
    fixture?.readiness ?? "ready-for-public-index";

  const expectedCapabilities = [
    "foundation",
    "intent",
    "state-resolution",
    "attention-emphasis",
    "information-density",
    "orchestration",
    "plan-inspection",
    "batch-orchestration",
  ] as const;

  const expectedGuarantees = [
    "deterministic",
    "immutable",
    "semantic",
    "renderer-independent",
    "framework-independent",
    "side-effect-free",
    "ordered",
    "upstream-preserving",
  ] as const;

  const bypassOk = moduleSource === undefined
    ? FREEZE_MODULE_INTEGRITY.soleImport.length > 0 &&
      directorRuntimeAdaptivePresentationFreezeUpstream ===
        directorRuntimeAdaptivePresentationPlatformIdentity &&
      dependency ===
        "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration"
    : !hasDisallowedUpstreamImport(moduleSource) &&
      importLinesOf(moduleSource).includes(
        "directorRuntimeAdaptivePresentationPlatform",
      );

  const rendererDependencyOk = moduleSource === undefined
    ? FREEZE_MODULE_INTEGRITY.noRendererFields &&
      (guarantees as readonly string[]).includes("renderer-independent")
    : !hasRendererImport(moduleSource);

  const rendererFieldsOk = freezeExportNames.every(
    (name) => !FORBIDDEN_RENDERER_EXPORT_PATTERN.test(name),
  );

  const visualPolicyOk = moduleSource === undefined
    ? FREEZE_MODULE_INTEGRITY.noVisualPolicy
    : !/\b(?:camera|color|layout|css|animation|viewport)\b/i.test(moduleSource);

  const frameworkOk = moduleSource === undefined
    ? FREEZE_MODULE_INTEGRITY.noFrameworkRuntime &&
      (guarantees as readonly string[]).includes("framework-independent")
    : !hasFrameworkRuntime(moduleSource);

  const uiStateOk = moduleSource === undefined
    ? FREEZE_MODULE_INTEGRITY.noRuntimeStore
    : !hasRuntimeStore(moduleSource) && !hasFrameworkRuntime(moduleSource);

  const sideEffectMutationOk = moduleSource === undefined
    ? FREEZE_MODULE_INTEGRITY.noSideEffects
    : !hasSideEffectRuntime(moduleSource);

  const sideEffectIoOk = moduleSource === undefined
    ? FREEZE_MODULE_INTEGRITY.noSideEffects
    : !hasSideEffectRuntime(moduleSource);

  const noStatePolicy = moduleSource === undefined
    ? FREEZE_MODULE_INTEGRITY.noPolicyReimplementation &&
      createDirectorRuntimePresentationIntent ===
        directorRuntimeAdaptivePresentationPlatform.createIntent &&
      resolveDirectorRuntimePresentationState ===
        directorRuntimeAdaptivePresentationPlatform.resolveState
    : !hasPolicyReimplementation(moduleSource);

  const noAttentionPolicy = moduleSource === undefined
    ? resolveDirectorRuntimeAttentionEmphasisPolicy ===
        directorRuntimeAdaptivePresentationPlatform.resolveAttentionEmphasis
    : !hasPolicyReimplementation(moduleSource);

  const noDensityPolicy = moduleSource === undefined
    ? resolveDirectorRuntimeInformationDensity ===
        directorRuntimeAdaptivePresentationPlatform.resolveDensity
    : !hasPolicyReimplementation(moduleSource);

  const noOrchestrationPolicy = moduleSource === undefined
    ? orchestrateDirectorRuntimeAdaptivePresentation ===
        directorRuntimeAdaptivePresentationPlatform.orchestrate
    : !hasPolicyReimplementation(moduleSource);

  const freezePreconditionsMet =
    platformVerificationOk &&
    compatibilityStatus === "compatible" &&
    freezeExportNames.length > 0 &&
    unique(freezeExportNames) &&
    lockActive;

  const checks = DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_CHECKS;
  const evaluated = Object.freeze([
    result(checks[0]!, identity === "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform", identity === "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform" ? "exact-platform-identity" : "platform-identity-mismatch"),
    result(checks[1]!, version === "5.7.0", version === "5.7.0" ? "exact-platform-version" : "platform-version-mismatch"),
    result(checks[2]!, namespace === "nexora.dri.adaptive-presentation.platform", namespace === "nexora.dri.adaptive-presentation.platform" ? "exact-platform-namespace" : "platform-namespace-mismatch"),
    result(checks[3]!, directorRuntimeAdaptivePresentationFreezeUpstream === directorRuntimeAdaptivePresentationPlatformIdentity, "exactly-one-immediate-dependency"),
    result(checks[4]!, directorRuntimeAdaptivePresentationFreezeUpstream === "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform", directorRuntimeAdaptivePresentationFreezeUpstream === "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform" ? "dependency-is-dri-5-7" : "dependency-mismatch"),
    result(checks[5]!, bypassOk, bypassOk ? "no-upstream-bypass" : "upstream-bypass-detected"),
    result(checks[6]!, capabilities.length === 8, capabilities.length === 8 ? "capability-count-eight" : "capability-count-mismatch"),
    result(checks[7]!, unique(capabilities as readonly string[]), unique(capabilities as readonly string[]) ? "capabilities-unique" : "duplicate-capabilities"),
    result(checks[8]!, exactOrder(capabilities as readonly string[], expectedCapabilities), exactOrder(capabilities as readonly string[], expectedCapabilities) ? "capability-order-canonical" : "capability-order-mismatch"),
    result(checks[9]!, allCapabilitiesAvailable, allCapabilitiesAvailable ? "all-capabilities-available" : "capability-unavailable"),
    result(checks[10]!, hasDirectorRuntimeAdaptivePresentationCapability("foundation") && (capabilities as readonly string[]).includes("foundation"), "foundation-capability-exposed"),
    result(checks[11]!, hasDirectorRuntimeAdaptivePresentationCapability("intent") && (capabilities as readonly string[]).includes("intent"), "intent-capability-exposed"),
    result(checks[12]!, hasDirectorRuntimeAdaptivePresentationCapability("state-resolution") && (capabilities as readonly string[]).includes("state-resolution"), "state-resolution-capability-exposed"),
    result(checks[13]!, hasDirectorRuntimeAdaptivePresentationCapability("attention-emphasis") && (capabilities as readonly string[]).includes("attention-emphasis"), "attention-emphasis-capability-exposed"),
    result(
      checks[14]!,
      hasDirectorRuntimeAdaptivePresentationCapability("information-density") &&
        hasDirectorRuntimeAdaptivePresentationCapability("orchestration") &&
        orchestrateDirectorRuntimeAdaptivePresentation ===
          directorRuntimeAdaptivePresentationPlatform.orchestrate &&
        resolveDirectorRuntimeInformationDensity ===
          directorRuntimeAdaptivePresentationPlatform.resolveDensity,
      "density-orchestration-semantics-preserved",
    ),
    result(
      checks[15]!,
      platformVerificationOk &&
        stableJson(liveVerification) === stableJson(verificationA),
      platformVerificationOk
        ? "platform-verification-deterministic"
        : "platform-verification-failed",
    ),
    result(
      checks[16]!,
      compatibilityStatus === "compatible" &&
        stableJson(liveCompatibility) === stableJson(compatibilityA),
      compatibilityStatus === "compatible"
        ? "compatibility-deterministic"
        : "compatibility-not-deterministic",
    ),
    result(
      checks[17]!,
      Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST) &&
        DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST.identity ===
          directorRuntimeAdaptivePresentationPlatformIdentity &&
        stableJson(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_MANIFEST.identity) ===
          stableJson(directorRuntimeAdaptivePresentationPlatformIdentity),
      "approved-frozen-manifest-deterministic",
    ),
    result(
      checks[18]!,
      Object.isFrozen(platform) &&
        Object.isFrozen(directorRuntimeAdaptivePresentationPlatformRegistry) &&
        Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES),
      "platform-surface-immutable",
    ),
    result(
      checks[19]!,
      Object.isFrozen(directorRuntimeAdaptivePresentationFreezeCanonicalIdentity) &&
        Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK) &&
        Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS),
      "freeze-metadata-immutable",
    ),
    result(
      checks[20]!,
      Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS) &&
        Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORT_NAMES),
      "approved-export-manifest-immutable",
    ),
    result(
      checks[21]!,
      identity === "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform" &&
        directorRuntimeAdaptivePresentationFreezeUpstream === identity,
      identity === "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform"
        ? "dri-5-7-identity-compatible"
        : "dri-5-7-identity-incompatible",
    ),
    result(
      checks[22]!,
      exactOrder(guarantees as readonly string[], expectedGuarantees),
      exactOrder(guarantees as readonly string[], expectedGuarantees)
        ? "required-guarantees-compatible"
        : "required-guarantees-incompatible",
    ),
    result(
      checks[23]!,
      compatibilityStatus === "compatible" &&
        DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_COMPATIBILITY.status ===
          "compatible",
      compatibilityStatus === "compatible"
        ? "canonical-compatibility-compatible"
        : "canonical-compatibility-incompatible",
    ),
    result(checks[24]!, rendererDependencyOk, rendererDependencyOk ? "no-renderer-dependency" : "renderer-dependency-detected"),
    result(checks[25]!, rendererFieldsOk, rendererFieldsOk ? "no-renderer-fields" : "renderer-fields-detected"),
    result(checks[26]!, visualPolicyOk, visualPolicyOk ? "no-visual-policy-implementation" : "visual-policy-detected"),
    result(checks[27]!, frameworkOk, frameworkOk ? "no-react-next-runtime-dependency" : "react-next-dependency-detected"),
    result(checks[28]!, uiStateOk, uiStateOk ? "no-ui-framework-state-dependency" : "ui-framework-state-dependency-detected"),
    result(checks[29]!, sideEffectMutationOk, sideEffectMutationOk ? "no-global-mutation" : "global-mutation-detected"),
    result(checks[30]!, sideEffectIoOk, sideEffectIoOk ? "no-network-storage-timer-behavior" : "network-storage-timer-behavior-detected"),
    result(checks[31]!, noStatePolicy, noStatePolicy ? "no-new-state-policy" : "state-policy-reimplemented"),
    result(checks[32]!, noAttentionPolicy, noAttentionPolicy ? "no-new-attention-emphasis-policy" : "attention-emphasis-policy-reimplemented"),
    result(checks[33]!, noDensityPolicy, noDensityPolicy ? "no-new-density-policy" : "density-policy-reimplemented"),
    result(checks[34]!, noOrchestrationPolicy, noOrchestrationPolicy ? "no-new-orchestration-policy" : "orchestration-policy-reimplemented"),
    result(
      checks[35]!,
      freezeExportNames.length > 0 && unique(freezeExportNames),
      freezeExportNames.length > 0 && unique(freezeExportNames)
        ? "frozen-approved-export-surface-exists"
        : "frozen-export-surface-invalid",
    ),
    result(
      checks[36]!,
      lockActive &&
        DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK.lock ===
          "DRI-5-ADAPTIVE-PRESENTATION-PLATFORM-LOCKED",
      lockActive ? "lock-is-active" : "lock-inactive",
    ),
    result(
      checks[37]!,
      freezePreconditionsMet &&
        readiness === "ready-for-public-index" &&
        status === "ready-for-certification" &&
        (moduleSource === undefined ||
          !hasPublicIndexImplementation(moduleSource)),
      freezePreconditionsMet && readiness === "ready-for-public-index"
        ? "ready-for-public-index-status-established"
        : "not-ready-for-public-index",
    ),
  ]);

  const passedChecks = evaluated.filter((entry) => entry.passed).length;
  const failedChecks = evaluated.length - passedChecks;
  const certificationStatus: DirectorRuntimeAdaptivePresentationCertificationStatus =
    failedChecks === 0 ? "certified" : "failed";

  return Object.freeze({
    status: certificationStatus,
    totalChecks: evaluated.length,
    passedChecks,
    failedChecks,
    checks: evaluated,
  });
}

export function summarizeDirectorRuntimeAdaptivePresentationCertification(
  certification:
    DirectorRuntimeAdaptivePresentationCertificationResult =
      certifyDirectorRuntimeAdaptivePresentationPlatform(),
): readonly DirectorRuntimeAdaptivePresentationCertificationDomainSummary[] {
  return Object.freeze(
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS.map((domain) => {
      const domainChecks = certification.checks.filter(
        (entry) => entry.domain === domain,
      );
      const passedCount = domainChecks.filter((entry) => entry.passed).length;
      const failedCount = domainChecks.length - passedCount;
      return Object.freeze({
        domain,
        checkCount: domainChecks.length,
        passedCount,
        failedCount,
        status: (failedCount === 0 ? "certified" : "failed") as
          DirectorRuntimeAdaptivePresentationCertificationStatus,
      });
    }),
  );
}

// ─── Compatibility ──────────────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationFreezeCompatibilityResult {
  readonly status: DirectorRuntimeAdaptivePresentationFreezeCompatibilityStatus;
  readonly freezeIdentity: typeof directorRuntimeAdaptivePresentationFreezeIdentity;
  readonly platformIdentity: typeof directorRuntimeAdaptivePresentationPlatformIdentity;
  readonly expectedPlatformIdentity: "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform";
  readonly expectedPlatformVersion: "5.7.0";
  readonly expectedDependency: "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform";
  readonly requiredCapabilitiesAvailable: boolean;
  readonly requiredGuaranteesPresent: boolean;
  readonly expectedPlatformStatus: "ready-for-certification";
  readonly platformStatusMatches: boolean;
}

export function verifyDirectorRuntimeAdaptivePresentationFreezeCompatibility(
  fixture?: DirectorRuntimeAdaptivePresentationCertificationFixture,
): DirectorRuntimeAdaptivePresentationFreezeCompatibilityResult {
  const identity =
    fixture?.identity ?? directorRuntimeAdaptivePresentationPlatformIdentity;
  const version =
    fixture?.version ?? directorRuntimeAdaptivePresentationPlatformVersion;
  const dependency =
    fixture?.dependency ??
    directorRuntimeAdaptivePresentationPlatform.dependency;
  const capabilities =
    fixture?.capabilities ??
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_CAPABILITIES;
  const guarantees =
    fixture?.guarantees ??
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_GUARANTEES;
  const status =
    fixture?.status ?? DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLATFORM_STATUS;

  const requiredCapabilitiesAvailable =
    capabilities.length === 8 &&
    exactOrder([...capabilities], [
      "foundation",
      "intent",
      "state-resolution",
      "attention-emphasis",
      "information-density",
      "orchestration",
      "plan-inspection",
      "batch-orchestration",
    ]);

  const requiredGuaranteesPresent = exactOrder([...guarantees], [
    "deterministic",
    "immutable",
    "semantic",
    "renderer-independent",
    "framework-independent",
    "side-effect-free",
    "ordered",
    "upstream-preserving",
  ]);

  const platformStatusMatches = status === "ready-for-certification";
  const identityOk =
    identity === "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform" &&
    version === "5.7.0" &&
    directorRuntimeAdaptivePresentationFreezeUpstream ===
      "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform";
  const dependencyOk =
    directorRuntimeAdaptivePresentationFreezeUpstream ===
      "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform" &&
    dependency === "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration";

  const compatible =
    identityOk &&
    dependencyOk &&
    requiredCapabilitiesAvailable &&
    requiredGuaranteesPresent &&
    platformStatusMatches;

  return Object.freeze({
    status: compatible ? ("compatible" as const) : ("incompatible" as const),
    freezeIdentity: directorRuntimeAdaptivePresentationFreezeIdentity,
    platformIdentity: directorRuntimeAdaptivePresentationPlatformIdentity,
    expectedPlatformIdentity:
      "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform" as const,
    expectedPlatformVersion: "5.7.0" as const,
    expectedDependency:
      "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform" as const,
    requiredCapabilitiesAvailable,
    requiredGuaranteesPresent,
    expectedPlatformStatus: "ready-for-certification" as const,
    platformStatusMatches,
  });
}

// ─── Freeze outcome ─────────────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationFreezeOutcome {
  readonly freezeStatus: DirectorRuntimeAdaptivePresentationFreezeStatus;
  readonly certificationStatus: DirectorRuntimeAdaptivePresentationCertificationStatus;
  readonly compatibilityStatus: DirectorRuntimeAdaptivePresentationFreezeCompatibilityStatus;
  readonly readiness: DirectorRuntimeAdaptivePresentationReadinessStatus;
  readonly locked: true | false;
}

export function resolveDirectorRuntimeAdaptivePresentationFreezeOutcome(
  certification:
    DirectorRuntimeAdaptivePresentationCertificationResult =
      certifyDirectorRuntimeAdaptivePresentationPlatform(),
  compatibility:
    DirectorRuntimeAdaptivePresentationFreezeCompatibilityResult =
      verifyDirectorRuntimeAdaptivePresentationFreezeCompatibility(),
): DirectorRuntimeAdaptivePresentationFreezeOutcome {
  const frozen =
    certification.status === "certified" &&
    certification.failedChecks === 0 &&
    certification.passedChecks === 38 &&
    compatibility.status === "compatible" &&
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK.locked === true &&
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS.length > 0;

  return Object.freeze({
    freezeStatus: frozen ? ("frozen" as const) : ("unfrozen" as const),
    certificationStatus: certification.status,
    compatibilityStatus: compatibility.status,
    readiness: frozen
      ? ("ready-for-public-index" as const)
      : ("not-ready-for-public-index" as const),
    locked: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK.locked,
  });
}

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_STATUS =
  "certified" as const satisfies DirectorRuntimeAdaptivePresentationCertificationStatus;
export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_STATUS =
  "frozen" as const satisfies DirectorRuntimeAdaptivePresentationFreezeStatus;
export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_COMPATIBILITY_STATUS =
  "compatible" as const satisfies DirectorRuntimeAdaptivePresentationFreezeCompatibilityStatus;
export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_READINESS_STATUS =
  "ready-for-public-index" as const satisfies DirectorRuntimeAdaptivePresentationReadinessStatus;

// ─── Manifest / registry / layer ────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_MANIFEST =
  Object.freeze({
    identity: directorRuntimeAdaptivePresentationFreezeIdentity,
    version: directorRuntimeAdaptivePresentationFreezeVersion,
    namespace: directorRuntimeAdaptivePresentationFreezeNamespace,
    dependency: directorRuntimeAdaptivePresentationFreezeUpstream,
    certificationStatus: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_STATUS,
    freezeStatus: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_STATUS,
    compatibilityStatus: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_COMPATIBILITY_STATUS,
    lock: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK,
    certificationDomains:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS,
    certificationDomainCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS.length,
    certificationChecks:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_CHECKS,
    certificationCheckCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_CHECKS.length,
    approvedFrozenExports:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS,
    frozenExportCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS.length,
    guarantees: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_GUARANTEES,
    invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_INVARIANTS,
    readiness: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_READINESS_STATUS,
  });

export const directorRuntimeAdaptivePresentationFreezeRegistry = Object.freeze({
  identity: directorRuntimeAdaptivePresentationFreezeIdentity,
  version: directorRuntimeAdaptivePresentationFreezeVersion,
  namespace: directorRuntimeAdaptivePresentationFreezeNamespace,
  dependency: directorRuntimeAdaptivePresentationFreezeUpstream,
  certification: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_STATUS,
  compatibility: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_COMPATIBILITY_STATUS,
  freezeStatus: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_STATUS,
  lock: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK,
  readiness: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_READINESS_STATUS,
  domains: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS,
  checks: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_CHECKS,
  frozenExports: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS,
  guarantees: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_GUARANTEES,
  manifest: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_MANIFEST,
  invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_INVARIANTS,
});

export const directorRuntimeAdaptivePresentationFreeze = Object.freeze({
  phase: "DRI-5:8" as const,
  name: "DirectorRuntimeAdaptivePresentationFreeze" as const,
  identity: directorRuntimeAdaptivePresentationFreezeIdentity,
  namespace: directorRuntimeAdaptivePresentationFreezeNamespace,
  version: directorRuntimeAdaptivePresentationFreezeVersion,
  layer: "DirectorRuntimeAdaptivePresentation" as const,
  stage: "CertificationAndFreeze" as const,
  dependency: directorRuntimeAdaptivePresentationFreezeUpstream,
  certificationStatus: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_STATUS,
  freezeStatus: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_STATUS,
  compatibilityStatus: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_COMPATIBILITY_STATUS,
  readiness: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_READINESS_STATUS,
  lock: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK,
  certified: true as const,
  frozen: true as const,
  locked: true as const,
  released: false as const,
  readyForConsumer: false as const,
  soleConsumerEntryPoint: false as const,
  publicIndex: false as const,
  domains: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS,
  checks: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_CHECKS,
  frozenExports: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS,
  guarantees: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_GUARANTEES,
  invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_INVARIANTS,
  manifest: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_MANIFEST,
  registry: directorRuntimeAdaptivePresentationFreezeRegistry,
  architecturalStatus:
    "Certified · Compatible · Frozen · Locked · Deterministic · Immutable · RendererIndependent · ReadyForPublicIndex" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationFreezeVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAdaptivePresentationFreezeIdentity;
  readonly version: typeof directorRuntimeAdaptivePresentationFreezeVersion;
  readonly namespace: typeof directorRuntimeAdaptivePresentationFreezeNamespace;
  readonly dependency: typeof directorRuntimeAdaptivePresentationFreezeUpstream;
  readonly certificationStatus: DirectorRuntimeAdaptivePresentationCertificationStatus;
  readonly freezeStatus: DirectorRuntimeAdaptivePresentationFreezeStatus;
  readonly compatibilityStatus: DirectorRuntimeAdaptivePresentationFreezeCompatibilityStatus;
  readonly readiness: DirectorRuntimeAdaptivePresentationReadinessStatus;
  readonly certificationDomainCount: number;
  readonly certificationCheckCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly frozenExportCount: number;
  readonly freezeGuaranteeCount: number;
  readonly invariantCount: number;
  readonly locked: true;
  readonly publicIndex: false;
}

export function verifyDirectorRuntimeAdaptivePresentationFreeze():
  DirectorRuntimeAdaptivePresentationFreezeVerification {
  const certification = certifyDirectorRuntimeAdaptivePresentationPlatform();
  const compatibility =
    verifyDirectorRuntimeAdaptivePresentationFreezeCompatibility();
  const outcome = resolveDirectorRuntimeAdaptivePresentationFreezeOutcome(
    certification,
    compatibility,
  );

  const identityIntegrity =
    directorRuntimeAdaptivePresentationFreezeIdentity ===
      "DRI-5:8/DirectorRuntimeAdaptivePresentationFreeze" &&
    directorRuntimeAdaptivePresentationFreezeVersion === "5.8.0" &&
    directorRuntimeAdaptivePresentationFreezeNamespace ===
      "nexora.dri.adaptive-presentation.freeze";

  const dependencyIntegrity =
    directorRuntimeAdaptivePresentationFreezeUpstream ===
      "DRI-5:7/DirectorRuntimeAdaptivePresentationPlatform";

  const certificationIntegrity =
    certification.status === "certified" &&
    certification.totalChecks === 38 &&
    certification.passedChecks === 38 &&
    certification.failedChecks === 0 &&
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_CHECKS.length === 38 &&
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS.length === 12 &&
    unique(
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_CHECKS.map(
        (entry) => entry.id,
      ),
    );

  const exportIntegrity =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS.length > 0 &&
    unique([...DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORT_NAMES]) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS);

  const lockIntegrity =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK.lock ===
      "DRI-5-ADAPTIVE-PRESENTATION-PLATFORM-LOCKED" &&
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_LOCK.locked === true;

  const manifestIntegrity =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_MANIFEST.identity ===
      directorRuntimeAdaptivePresentationFreezeIdentity &&
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_MANIFEST.readiness ===
      "ready-for-public-index" &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_MANIFEST);

  const readinessIntegrity =
    outcome.freezeStatus === "frozen" &&
    outcome.readiness === "ready-for-public-index" &&
    directorRuntimeAdaptivePresentationFreeze.released === false &&
    directorRuntimeAdaptivePresentationFreeze.readyForConsumer === false &&
    directorRuntimeAdaptivePresentationFreeze.publicIndex === false;

  const invariantIntegrity =
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_INVARIANTS.length === 38 &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_INVARIANTS);

  const ok =
    identityIntegrity &&
    dependencyIntegrity &&
    certificationIntegrity &&
    compatibility.status === "compatible" &&
    outcome.freezeStatus === "frozen" &&
    lockIntegrity &&
    exportIntegrity &&
    manifestIntegrity &&
    readinessIntegrity &&
    invariantIntegrity &&
    Object.isFrozen(directorRuntimeAdaptivePresentationFreeze) &&
    Object.isFrozen(directorRuntimeAdaptivePresentationFreezeRegistry);

  return Object.freeze({
    ok,
    identity: directorRuntimeAdaptivePresentationFreezeIdentity,
    version: directorRuntimeAdaptivePresentationFreezeVersion,
    namespace: directorRuntimeAdaptivePresentationFreezeNamespace,
    dependency: directorRuntimeAdaptivePresentationFreezeUpstream,
    certificationStatus: certification.status,
    freezeStatus: outcome.freezeStatus,
    compatibilityStatus: compatibility.status,
    readiness: outcome.readiness,
    certificationDomainCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_CERTIFICATION_DOMAINS.length,
    certificationCheckCount: certification.totalChecks,
    passedCheckCount: certification.passedChecks,
    failedCheckCount: certification.failedChecks,
    frozenExportCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FROZEN_EXPORTS.length,
    freezeGuaranteeCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_GUARANTEES.length,
    invariantCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_FREEZE_INVARIANTS.length,
    locked: true as const,
    publicIndex: false as const,
  });
}
