/**
 * REX-3:8 — Runtime Executive Advisor Experience Certification & Freeze.
 *
 * Certifies, compatibility-checks, freezes, and locks the completed REX-3
 * Advisor Experience Platform before publication through REX-3:9 Public Index.
 *
 * Canonical flow:
 *   REX-3:7 Platform
 *     → Certification Evaluation
 *     → Compatibility Verification
 *     → Invariant Verification
 *     → Approved Export Freeze
 *     → Platform Lock
 *     → Ready for REX-3:9 Public Index
 *
 * Certification observes and freezes only. No new runtime behavior.
 */

import {
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_FORBIDDEN,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_METADATA,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_MODE_MAPPINGS,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_PUBLIC_TYPE_NAMES,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES,
  getRuntimeExecutiveAdvisorExperiencePlatformIdentity,
  isRuntimeExecutiveAdvisorPlatformCertificationReady,
  isRuntimeExecutiveAdvisorPlatformFreezeReady,
  isRuntimeExecutiveAdvisorPlatformOperational,
  isRuntimeExecutiveAdvisorPlatformReady,
  resolveRuntimeExecutiveAdvisorExperiencePlatform,
  resolveRuntimeExecutiveAdvisorPlatformCompatibility,
  resolveRuntimeExecutiveAdvisorPlatformExecutionMode,
  resolveRuntimeExecutiveAdvisorPlatformHealth,
  resolveRuntimeExecutiveAdvisorPlatformState,
  runtimeExecutiveAdvisorExperiencePlatform,
  runtimeExecutiveAdvisorExperiencePlatformApiNames,
  runtimeExecutiveAdvisorExperiencePlatformCanonicalIdentity,
  runtimeExecutiveAdvisorExperiencePlatformIdentity,
  runtimeExecutiveAdvisorExperiencePlatformNamespace,
  runtimeExecutiveAdvisorExperiencePlatformRegistry,
  runtimeExecutiveAdvisorExperiencePlatformSupportedImportPath,
  runtimeExecutiveAdvisorExperiencePlatformVersion,
  validateRuntimeExecutiveAdvisorExperiencePlatform,
  verifyRuntimeExecutiveAdvisorExperiencePlatform,
  type RuntimeExecutiveAdvisorExperiencePlatformResult,
  type RuntimeExecutiveAdvisorPlatformCompatibility,
  type RuntimeExecutiveAdvisorPlatformExecutionMode,
  type RuntimeExecutiveAdvisorPlatformHealth,
  type RuntimeExecutiveAdvisorPlatformInput,
  type RuntimeExecutiveAdvisorPlatformMetadata,
  type RuntimeExecutiveAdvisorPlatformState,
} from "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePlatform";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity =
  "REX-3:8/RuntimeExecutiveAdvisorExperienceCertificationFreeze" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeVersion =
  "3.8.0" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeNamespace =
  "nexora.rex.advisor-experience.certification-freeze" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeDomain =
  "ExecutiveAdvisor" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezePhase =
  "CertificationFreeze" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeArchitecturalRole =
  "RuntimeExecutiveAdvisorExperienceCertificationFreezeBoundary" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyIdentity =
  runtimeExecutiveAdvisorExperiencePlatformIdentity;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyPath =
  runtimeExecutiveAdvisorExperiencePlatformSupportedImportPath;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveAdvisorExperienceCertificationFreeze" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeStability =
  "CertifiedFrozen" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeDeterministic =
  true as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeMutationPolicy =
  "immutable" as const;

/** Exact immutable platform lock constant. */
export const REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED =
  "REX-3-RUNTIME-EXECUTIVE-ADVISOR-EXPERIENCE-PLATFORM-LOCKED" as const;

export const runtimeExecutiveAdvisorExperienceCertificationFreezeCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveAdvisorExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveAdvisorExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveAdvisorExperienceCertificationFreezeLayer,
    domain: runtimeExecutiveAdvisorExperienceCertificationFreezeDomain,
    phase: runtimeExecutiveAdvisorExperienceCertificationFreezePhase,
    architecturalRole:
      runtimeExecutiveAdvisorExperienceCertificationFreezeArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorExperienceCertificationFreezeSupportedImportPath,
    upstreamVersion: runtimeExecutiveAdvisorExperiencePlatformVersion,
    stabilityStatus:
      runtimeExecutiveAdvisorExperienceCertificationFreezeStability,
    deterministicStatus:
      runtimeExecutiveAdvisorExperienceCertificationFreezeDeterministic,
    sideEffectPolicy:
      runtimeExecutiveAdvisorExperienceCertificationFreezeSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveAdvisorExperienceCertificationFreezeMutationPolicy,
    certificationStatus: "certified" as const,
    compatibilityStatus: "compatible" as const,
    freezeStatus: "frozen" as const,
    lockStatus: "locked" as const,
    platformLock: REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED,
    readiness: "ready-for-public-index" as const,
  });

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_FREEZE_PRINCIPLE =
  "Verify → certify → freeze. Certification observes the REX-3:7 Platform; it does not invent, repair, or execute Advisor behavior." as const;

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_FREEZE_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    certificationAuthority: "REX-3:8" as const,
    architecturalRole:
      "RuntimeExecutiveAdvisorExperienceCertificationFreezeBoundary" as const,
    soleImmediateDependency:
      "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform" as const,
    consumesPlatformOnly: true as const,
    importsRex36Directly: false as const,
    importsRex35Directly: false as const,
    importsRex34Directly: false as const,
    importsRex33Directly: false as const,
    importsRex32Directly: false as const,
    importsRex31Directly: false as const,
    importsRex2Directly: false as const,
    importsRex1Directly: false as const,
    importsExDriDirectly: false as const,
    importsDriDirectly: false as const,
    importsNolDirectly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    aiProviderIndependent: true as const,
    introducesRuntimeBehavior: false as const,
    modifiesPlatformBehavior: false as const,
    executesActions: false as const,
    mutatesStageState: false as const,
    rendersUi: false as const,
    isFinalPublicConsumerIndex: false as const,
    preparesPublicIndex: true as const,
    mutatesInput: false as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_STATUSES = Object.freeze([
  "uncertified",
  "certified",
  "failed",
] as const);

export type RuntimeExecutiveAdvisorCertificationStatus =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_OUTCOMES = Object.freeze([
  "pass",
  "fail",
] as const);

export type RuntimeExecutiveAdvisorCertificationOutcome =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_OUTCOMES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_SEVERITIES = Object.freeze([
  "required",
  "critical",
] as const);

export type RuntimeExecutiveAdvisorCertificationSeverity =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_SEVERITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS = Object.freeze([
  "identity",
  "dependency",
  "platform-contract",
  "platform-state",
  "execution-mode",
  "health",
  "compatibility",
  "guidance-safety",
  "action-safety",
  "manager-authority",
  "stage-ownership",
  "context-safety",
  "confirmation",
  "determinism",
  "immutability",
  "non-execution",
  "ai-neutrality",
  "ui-neutrality",
  "registry",
  "capabilities",
  "guarantees",
  "consumer-policy",
  "exports",
  "publication-readiness",
] as const);

export type RuntimeExecutiveAdvisorCertificationDomain =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_COMPATIBILITY =
  Object.freeze(["compatible", "incompatible"] as const);

export type RuntimeExecutiveAdvisorCertificationCompatibility =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_COMPATIBILITY)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_FREEZE_STATUSES = Object.freeze([
  "unfrozen",
  "frozen",
] as const);

export type RuntimeExecutiveAdvisorFreezeStatus =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_FREEZE_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_LOCK_STATUSES = Object.freeze([
  "unlocked",
  "locked",
] as const);

export type RuntimeExecutiveAdvisorLockStatus =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_LOCK_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PUBLICATION_READINESS = Object.freeze([
  "not-ready",
  "ready-for-public-index",
] as const);

export type RuntimeExecutiveAdvisorPublicationReadiness =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PUBLICATION_READINESS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES =
  Object.freeze([
    "platform-certification",
    "platform-compatibility-verification",
    "platform-invariant-verification",
    "guidance-safety-certification",
    "action-safety-certification",
    "manager-authority-certification",
    "stage-ownership-certification",
    "context-safety-certification",
    "confirmation-certification",
    "determinism-certification",
    "immutability-certification",
    "non-execution-certification",
    "ai-neutrality-certification",
    "ui-neutrality-certification",
    "approved-export-freeze",
    "platform-lock",
    "publication-readiness",
  ] as const);

export type RuntimeExecutiveAdvisorCertificationCapability =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "CertificationDomains",
    "CertificationChecks",
    "CertificationStatus",
    "Compatibility",
    "Freeze",
    "Lock",
    "ApprovedExports",
    "Invariants",
    "PublicationReadiness",
    "Capabilities",
  ] as const);

export type RuntimeExecutiveAdvisorCertificationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_REGISTRY_SECTIONS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS = Object.freeze([
  "platform-identity-frozen",
  "platform-version-frozen",
  "platform-namespace-frozen",
  "dependency-boundary-frozen",
  "platform-state-semantics-frozen",
  "execution-mode-semantics-frozen",
  "health-semantics-frozen",
  "compatibility-semantics-frozen",
  "manager-authority-frozen",
  "stage-ownership-frozen",
  "context-safety-frozen",
  "confirmation-semantics-frozen",
  "guidance-safety-frozen",
  "action-safety-frozen",
  "non-execution-frozen",
  "determinism-frozen",
  "immutability-frozen",
  "ai-neutrality-frozen",
  "ui-neutrality-frozen",
  "registry-order-frozen",
  "capability-surface-frozen",
  "guarantee-surface-frozen",
  "consumer-policy-frozen",
  "approved-export-surface-frozen",
] as const);

export type RuntimeExecutiveAdvisorFreezeInvariant =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS)[number];

/**
 * Approved frozen export surface for REX-3:9. Names only — values re-exported below.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS =
  Object.freeze([
    // Identity / platform
    "runtimeExecutiveAdvisorExperiencePlatformIdentity",
    "runtimeExecutiveAdvisorExperiencePlatformVersion",
    "runtimeExecutiveAdvisorExperiencePlatformNamespace",
    "runtimeExecutiveAdvisorExperiencePlatformCanonicalIdentity",
    "runtimeExecutiveAdvisorExperiencePlatform",
    "runtimeExecutiveAdvisorExperiencePlatformRegistry",
    "runtimeExecutiveAdvisorExperiencePlatformApiNames",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER",
    "RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_METADATA",
    // Public APIs
    "resolveRuntimeExecutiveAdvisorExperiencePlatform",
    "resolveRuntimeExecutiveAdvisorPlatformState",
    "resolveRuntimeExecutiveAdvisorPlatformExecutionMode",
    "resolveRuntimeExecutiveAdvisorPlatformHealth",
    "resolveRuntimeExecutiveAdvisorPlatformCompatibility",
    "isRuntimeExecutiveAdvisorPlatformReady",
    "isRuntimeExecutiveAdvisorPlatformOperational",
    "validateRuntimeExecutiveAdvisorExperiencePlatform",
    "isRuntimeExecutiveAdvisorPlatformCertificationReady",
    "isRuntimeExecutiveAdvisorPlatformFreezeReady",
    "verifyRuntimeExecutiveAdvisorExperiencePlatform",
    "getRuntimeExecutiveAdvisorExperiencePlatformIdentity",
    // Types
    "RuntimeExecutiveAdvisorPlatformState",
    "RuntimeExecutiveAdvisorPlatformExecutionMode",
    "RuntimeExecutiveAdvisorPlatformHealth",
    "RuntimeExecutiveAdvisorPlatformCompatibility",
    "RuntimeExecutiveAdvisorPlatformInput",
    "RuntimeExecutiveAdvisorExperiencePlatformResult",
    "RuntimeExecutiveAdvisorPlatformMetadata",
    // Certification / freeze surface
    "runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity",
    "runtimeExecutiveAdvisorExperienceCertificationFreezeVersion",
    "runtimeExecutiveAdvisorExperienceCertificationFreeze",
    "REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED",
    "RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS",
    "certifyRuntimeExecutiveAdvisorExperiencePlatform",
    "freezeRuntimeExecutiveAdvisorExperiencePlatform",
    "verifyRuntimeExecutiveAdvisorExperiencePlatformLock",
    "isRuntimeExecutiveAdvisorExperienceReadyForPublicIndex",
    // Additive publication for REX-3:9 consumer surface (no behavior change)
    "getRuntimeExecutiveAdvisorExperienceCertificationFreezeIdentity",
    "verifyRuntimeExecutiveAdvisorExperienceCompatibility",
    "verifyRuntimeExecutiveAdvisorExperienceCertificationFreeze",
  ] as const);

export type RuntimeExecutiveAdvisorExperienceApprovedExport =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorCertificationCheck {
  readonly id: string;
  readonly domain: RuntimeExecutiveAdvisorCertificationDomain;
  readonly severity: RuntimeExecutiveAdvisorCertificationSeverity;
  readonly outcome: RuntimeExecutiveAdvisorCertificationOutcome;
  readonly description: string;
}

export interface RuntimeExecutiveAdvisorCertificationReport {
  readonly identity: typeof runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity;
  readonly version: typeof runtimeExecutiveAdvisorExperienceCertificationFreezeVersion;
  readonly status: RuntimeExecutiveAdvisorCertificationStatus;
  readonly checks: ReadonlyArray<RuntimeExecutiveAdvisorCertificationCheck>;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly totalCheckCount: number;
  readonly isCertified: boolean;
  readonly compatibility: RuntimeExecutiveAdvisorCertificationCompatibility;
  readonly freezeStatus: RuntimeExecutiveAdvisorFreezeStatus;
  readonly lockStatus: RuntimeExecutiveAdvisorLockStatus;
  readonly platformLock: typeof REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED;
  readonly publicationReadiness: RuntimeExecutiveAdvisorPublicationReadiness;
  readonly certifiedPlatformIdentity: typeof runtimeExecutiveAdvisorExperiencePlatformIdentity;
}

export interface RuntimeExecutiveAdvisorExperienceFreezeMetadata {
  readonly certificationStatus: RuntimeExecutiveAdvisorCertificationStatus;
  readonly compatibility: RuntimeExecutiveAdvisorCertificationCompatibility;
  readonly freezeStatus: RuntimeExecutiveAdvisorFreezeStatus;
  readonly lockStatus: RuntimeExecutiveAdvisorLockStatus;
  readonly lock: typeof REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED;
  readonly publicationReadiness: RuntimeExecutiveAdvisorPublicationReadiness;
  readonly approvedExports: typeof RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS;
  readonly invariants: typeof RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS;
}

export interface RuntimeExecutiveAdvisorCertificationIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveAdvisorCertificationValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveAdvisorCertificationIssue>;
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

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function issue(
  code: string,
  message: string,
  path?: string,
): RuntimeExecutiveAdvisorCertificationIssue {
  return path === undefined
    ? Object.freeze({ code, message })
    : Object.freeze({ code, message, path });
}

function check(input: {
  readonly id: string;
  readonly domain: RuntimeExecutiveAdvisorCertificationDomain;
  readonly severity?: RuntimeExecutiveAdvisorCertificationSeverity;
  readonly description: string;
  readonly passed: boolean;
}): RuntimeExecutiveAdvisorCertificationCheck {
  return Object.freeze({
    id: input.id,
    domain: input.domain,
    severity: input.severity ?? "critical",
    outcome: input.passed ? ("pass" as const) : ("fail" as const),
    description: input.description,
  });
}

function hasGuarantee(id: string): boolean {
  return (RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES as readonly string[]).includes(
    id,
  );
}

function hasCapability(id: string): boolean {
  return (RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES as readonly string[]).includes(
    id,
  );
}

function hasPolicy(id: string): boolean {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES as readonly string[]
  ).includes(id);
}

// ─── Type guards ────────────────────────────────────────────────────────────

export function isRuntimeExecutiveAdvisorCertificationStatus(
  value: unknown,
): value is RuntimeExecutiveAdvisorCertificationStatus {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_STATUSES as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorCertificationOutcome(
  value: unknown,
): value is RuntimeExecutiveAdvisorCertificationOutcome {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_OUTCOMES as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorCertificationSeverity(
  value: unknown,
): value is RuntimeExecutiveAdvisorCertificationSeverity {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_SEVERITIES as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorCertificationDomain(
  value: unknown,
): value is RuntimeExecutiveAdvisorCertificationDomain {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorFreezeStatus(
  value: unknown,
): value is RuntimeExecutiveAdvisorFreezeStatus {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_FREEZE_STATUSES as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorLockStatus(
  value: unknown,
): value is RuntimeExecutiveAdvisorLockStatus {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_LOCK_STATUSES as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorPublicationReadiness(
  value: unknown,
): value is RuntimeExecutiveAdvisorPublicationReadiness {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_PUBLICATION_READINESS as readonly string[]).includes(
      value,
    )
  );
}

// ─── Certification checks ───────────────────────────────────────────────────

function buildCertificationChecks(): ReadonlyArray<RuntimeExecutiveAdvisorCertificationCheck> {
  const platform = runtimeExecutiveAdvisorExperiencePlatform;
  const boundary = RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY;
  const verification = verifyRuntimeExecutiveAdvisorExperiencePlatform();
  const identity = getRuntimeExecutiveAdvisorExperiencePlatformIdentity();
  const freezeBoundary = RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_FREEZE_BOUNDARY;

  return Object.freeze([
    // Identity
    check({
      id: "platform-identity",
      domain: "identity",
      description: "REX-3:7 platform identity/version/namespace/status exact",
      passed:
        platform.identity ===
          "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform" &&
        platform.version === "3.7.0" &&
        platform.namespace === "nexora.rex.advisor-experience.platform" &&
        platform.status === "PlatformReady" &&
        identity.identity === platform.identity &&
        identity.version === platform.version,
    }),
    check({
      id: "certification-identity",
      domain: "identity",
      description: "REX-3:8 certification identity exact",
      passed:
        runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity ===
          "REX-3:8/RuntimeExecutiveAdvisorExperienceCertificationFreeze" &&
        runtimeExecutiveAdvisorExperienceCertificationFreezeVersion ===
          "3.8.0" &&
        runtimeExecutiveAdvisorExperienceCertificationFreezeNamespace ===
          "nexora.rex.advisor-experience.certification-freeze" &&
        runtimeExecutiveAdvisorExperienceCertificationFreezeStability ===
          "CertifiedFrozen",
    }),

    // Dependency
    check({
      id: "sole-platform-dependency",
      domain: "dependency",
      description: "REX-3:8 depends only on REX-3:7 platform",
      passed:
        freezeBoundary.soleImmediateDependency ===
          "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform" &&
        freezeBoundary.consumesPlatformOnly === true &&
        freezeBoundary.importsRex36Directly === false &&
        freezeBoundary.importsRex35Directly === false &&
        freezeBoundary.importsRex34Directly === false &&
        freezeBoundary.importsRex33Directly === false &&
        freezeBoundary.importsRex32Directly === false &&
        freezeBoundary.importsRex31Directly === false &&
        platform.upstreamDependency ===
          "REX-3:6/RuntimeExecutiveAdvisorExperienceOrchestration",
    }),

    // Platform contract
    check({
      id: "platform-contract-apis",
      domain: "platform-contract",
      description: "canonical platform APIs exist",
      passed:
        typeof resolveRuntimeExecutiveAdvisorExperiencePlatform ===
          "function" &&
        typeof resolveRuntimeExecutiveAdvisorPlatformState === "function" &&
        typeof resolveRuntimeExecutiveAdvisorPlatformExecutionMode ===
          "function" &&
        typeof resolveRuntimeExecutiveAdvisorPlatformHealth === "function" &&
        typeof resolveRuntimeExecutiveAdvisorPlatformCompatibility ===
          "function" &&
        typeof validateRuntimeExecutiveAdvisorExperiencePlatform ===
          "function" &&
        typeof isRuntimeExecutiveAdvisorPlatformCertificationReady ===
          "function" &&
        typeof isRuntimeExecutiveAdvisorPlatformFreezeReady === "function" &&
        isRuntimeExecutiveAdvisorPlatformCertificationReady() === true &&
        isRuntimeExecutiveAdvisorPlatformFreezeReady() === true,
    }),
    check({
      id: "platform-verification-ok",
      domain: "platform-contract",
      description: "platform verification passes",
      passed: verification.ok === true && verification.orchestrationOk === true,
    }),

    // Platform state
    check({
      id: "platform-states-canonical",
      domain: "platform-state",
      description: "canonical platform states ordered and unique",
      passed:
        exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES], [
          "idle",
          "ready",
          "active",
          "degraded",
          "blocked",
        ]) && unique([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES]),
    }),

    // Execution mode
    check({
      id: "execution-modes-canonical",
      domain: "execution-mode",
      description: "execution modes map from orchestration modes",
      passed:
        exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES], [
          "observe-only",
          "response",
          "guidance",
          "coordinated",
        ]) &&
        RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_MODE_MAPPINGS.length === 4 &&
        resolveRuntimeExecutiveAdvisorPlatformExecutionMode("passive") ===
          "observe-only" &&
        resolveRuntimeExecutiveAdvisorPlatformExecutionMode("coordinated") ===
          "coordinated",
    }),

    // Health
    check({
      id: "health-states-canonical",
      domain: "health",
      description: "health states healthy/degraded/blocked",
      passed:
        exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH], [
          "healthy",
          "degraded",
          "blocked",
        ]),
    }),

    // Compatibility
    check({
      id: "compatibility-surface",
      domain: "compatibility",
      description: "compatibility values and platform compatibility",
      passed:
        exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY], [
          "compatible",
          "incompatible",
        ]) &&
        verification.ok === true,
    }),

    // Guidance safety
    check({
      id: "guidance-safety-guarantees",
      domain: "guidance-safety",
      description: "guidance remains advisory/traceable via platform guarantees",
      passed:
        hasCapability("executive-guidance") &&
        hasCapability("structured-response") &&
        hasGuarantee("guidance-traceability") &&
        hasGuarantee("no-hidden-action-execution"),
    }),

    // Action safety
    check({
      id: "action-safety-guarantees",
      domain: "action-safety",
      description: "actions remain declarative with confirmation awareness",
      passed:
        hasCapability("executive-action-options") &&
        hasCapability("confirmation-aware-actions") &&
        hasGuarantee("confirmation-preservation") &&
        hasGuarantee("no-hidden-action-execution") &&
        boundary.executesActions === false,
    }),

    // Manager authority (critical)
    check({
      id: "manager-authority-preserved",
      domain: "manager-authority",
      severity: "critical",
      description: "manager authority > advisor continuation",
      passed:
        hasGuarantee("manager-authority-preservation") &&
        hasCapability("manager-authority-protection") &&
        hasPolicy("do-not-bypass-manager-confirmation") &&
        boundary.forgesManagerConfirmation === false,
    }),

    // Stage ownership (critical)
    check({
      id: "stage-ownership-external",
      domain: "stage-ownership",
      severity: "critical",
      description: "advisor does not own Stage; no Stage setters",
      passed:
        hasGuarantee("stage-ownership-preservation") &&
        hasGuarantee("no-direct-stage-mutation") &&
        hasCapability("stage-safe-coordination") &&
        boundary.ownsStage === false &&
        boundary.mutatesStageState === false &&
        RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_FORBIDDEN.includes(
          "setStageFocus()",
        ) &&
        RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_FORBIDDEN.includes(
          "setStageSelection()",
        ) &&
        verification.noStageMutation === true,
    }),

    // Context safety
    check({
      id: "context-safety-preserved",
      domain: "context-safety",
      severity: "critical",
      description: "stale/invalid context protection preserved",
      passed:
        hasGuarantee("context-safety") &&
        hasGuarantee("stale-context-protection") &&
        hasCapability("context-freshness-protection") &&
        hasCapability("context-subject-grounding"),
    }),

    // Confirmation
    check({
      id: "confirmation-preserved",
      domain: "confirmation",
      severity: "critical",
      description: "confirmation semantics never forged or bypassed",
      passed:
        hasGuarantee("confirmation-preservation") &&
        hasCapability("confirmation-aware-actions") &&
        boundary.forgesManagerConfirmation === false &&
        hasPolicy("do-not-bypass-manager-confirmation"),
    }),

    // Determinism
    check({
      id: "determinism-preserved",
      domain: "determinism",
      description: "platform declares deterministic immutable resolution",
      passed:
        platform.deterministic === true &&
        hasGuarantee("deterministic-resolution") &&
        hasGuarantee("stable-ordering") &&
        !runtimeExecutiveAdvisorExperiencePlatformApiNames.some((name) =>
          /random|timestamp|now|uuid/i.test(name),
        ),
    }),

    // Immutability
    check({
      id: "immutability-preserved",
      domain: "immutability",
      description: "platform registries and guarantees are frozen",
      passed:
        Object.isFrozen(platform) &&
        Object.isFrozen(runtimeExecutiveAdvisorExperiencePlatformRegistry) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS) &&
        verification.frozen === true &&
        hasGuarantee("immutable-inputs") &&
        hasGuarantee("immutable-results"),
    }),

    // Non-execution
    check({
      id: "non-execution",
      domain: "non-execution",
      severity: "critical",
      description: "no hidden Stage/workflow/business execution",
      passed:
        boundary.executesActions === false &&
        boundary.mutatesStageState === false &&
        boundary.navigatesApplication === false &&
        hasGuarantee("no-hidden-action-execution") &&
        hasPolicy("do-not-execute-stage-actions-directly") &&
        verification.noAutoExecution === true &&
        freezeBoundary.executesActions === false,
    }),

    // AI neutrality
    check({
      id: "ai-neutrality",
      domain: "ai-neutrality",
      severity: "critical",
      description: "platform remains AI-provider-neutral",
      passed:
        platform.aiProviderIndependent === true &&
        boundary.aiProviderIndependent === true &&
        hasGuarantee("no-ai-dependency") &&
        hasPolicy("do-not-assume-ai-provider") &&
        verification.noAi === true &&
        freezeBoundary.aiProviderIndependent === true,
    }),

    // UI neutrality
    check({
      id: "ui-neutrality",
      domain: "ui-neutrality",
      severity: "critical",
      description: "platform remains UI/renderer-neutral",
      passed:
        platform.rendererIndependent === true &&
        platform.frameworkIndependent === true &&
        boundary.rendersUi === false &&
        hasGuarantee("no-ui-dependency") &&
        verification.noUi === true &&
        freezeBoundary.rendersUi === false,
    }),

    // Registry
    check({
      id: "registry-integrity",
      domain: "registry",
      description: "platform registry sections ordered with dynamic counts",
      passed:
        exactOrder(
          [...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS],
          [
            "Identity",
            "PlatformStates",
            "ExecutionModes",
            "Health",
            "Compatibility",
            "PublicAPIs",
            "Capabilities",
            "Guarantees",
            "Validation",
            "ConsumerPolicy",
            "CertificationReadiness",
          ],
        ) &&
        runtimeExecutiveAdvisorExperiencePlatformRegistry.sectionCount ===
          RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS.length &&
        runtimeExecutiveAdvisorExperiencePlatformRegistry.publicApiCount ===
          runtimeExecutiveAdvisorExperiencePlatformApiNames.length,
    }),

    // Capabilities
    check({
      id: "capability-integrity",
      domain: "capabilities",
      description: "assembled REX-3 capability chain present",
      passed:
        hasCapability("advisor-runtime-foundation") &&
        hasCapability("context-subject-grounding") &&
        hasCapability("structured-response") &&
        hasCapability("executive-guidance") &&
        hasCapability("executive-action-options") &&
        hasCapability("stage-coordination") &&
        hasCapability("experience-orchestration") &&
        hasCapability("platform-health") &&
        hasCapability("platform-compatibility") &&
        hasCapability("platform-validation") &&
        hasCapability("platform-readiness") &&
        unique([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES]),
    }),

    // Guarantees
    check({
      id: "guarantee-integrity",
      domain: "guarantees",
      description: "all published platform guarantees present and unique",
      passed:
        RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES.length === 18 &&
        unique([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES]) &&
        hasGuarantee("sole-immediate-dependency") &&
        hasGuarantee("stable-platform-contract"),
    }),

    // Consumer policy
    check({
      id: "consumer-policy-integrity",
      domain: "consumer-policy",
      description: "consumer policy and consumer role intact",
      passed:
        RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES.length === 8 &&
        unique([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES]) &&
        hasPolicy("consume-platform-only") &&
        hasPolicy("do-not-import-rex-3-internals") &&
        RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER.role ===
          "RuntimeExecutiveAdvisorPlatformConsumer" &&
        RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER.mayImportLowerRex3Phases ===
          false &&
        RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER.finalPublicEntry === false,
    }),

    // Exports
    check({
      id: "approved-exports-unique",
      domain: "exports",
      description: "approved exports unique and non-empty",
      passed:
        RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS.length > 0 &&
        unique([...RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS]),
    }),
    check({
      id: "approved-exports-exist",
      domain: "exports",
      description: "approved platform exports resolve on platform surface",
      passed:
        RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS.includes(
          "resolveRuntimeExecutiveAdvisorExperiencePlatform",
        ) &&
        RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS.includes(
          "runtimeExecutiveAdvisorExperiencePlatform",
        ) &&
        typeof resolveRuntimeExecutiveAdvisorExperiencePlatform ===
          "function" &&
        typeof runtimeExecutiveAdvisorExperiencePlatform === "object" &&
        RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_PUBLIC_TYPE_NAMES.length > 0,
    }),

    // Publication readiness prerequisites
    check({
      id: "publication-prerequisites",
      domain: "publication-readiness",
      description: "platform certification/freeze readiness predicates true",
      passed:
        isRuntimeExecutiveAdvisorPlatformCertificationReady() &&
        isRuntimeExecutiveAdvisorPlatformFreezeReady() &&
        freezeBoundary.preparesPublicIndex === true &&
        freezeBoundary.isFinalPublicConsumerIndex === false &&
        freezeBoundary.introducesRuntimeBehavior === false &&
        verification.noNewBehavior === true,
    }),
  ]);
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export function certifyRuntimeExecutiveAdvisorExperiencePlatform():
  RuntimeExecutiveAdvisorCertificationReport {
  const checks = buildCertificationChecks();
  const passedCheckCount = checks.filter(
    (entry) => entry.outcome === "pass",
  ).length;
  const failedCheckCount = checks.length - passedCheckCount;
  const criticalFailed = checks.some(
    (entry) => entry.severity === "critical" && entry.outcome === "fail",
  );

  const status: RuntimeExecutiveAdvisorCertificationStatus =
    failedCheckCount === 0 && !criticalFailed ? "certified" : "failed";
  const compatibility: RuntimeExecutiveAdvisorCertificationCompatibility =
    status === "certified" ? "compatible" : "incompatible";
  const freezeStatus: RuntimeExecutiveAdvisorFreezeStatus =
    status === "certified" && compatibility === "compatible"
      ? "frozen"
      : "unfrozen";
  const lockStatus: RuntimeExecutiveAdvisorLockStatus =
    freezeStatus === "frozen" ? "locked" : "unlocked";
  const publicationReadiness: RuntimeExecutiveAdvisorPublicationReadiness =
    lockStatus === "locked" ? "ready-for-public-index" : "not-ready";

  return Object.freeze({
    identity: runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveAdvisorExperienceCertificationFreezeVersion,
    status,
    checks,
    passedCheckCount,
    failedCheckCount,
    totalCheckCount: checks.length,
    isCertified: status === "certified",
    compatibility,
    freezeStatus,
    lockStatus,
    platformLock: REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED,
    publicationReadiness,
    certifiedPlatformIdentity: runtimeExecutiveAdvisorExperiencePlatformIdentity,
  });
}

export function verifyRuntimeExecutiveAdvisorExperienceCompatibility():
  RuntimeExecutiveAdvisorCertificationCompatibility {
  const report = certifyRuntimeExecutiveAdvisorExperiencePlatform();
  return report.compatibility;
}

export function freezeRuntimeExecutiveAdvisorExperiencePlatform(
  report: RuntimeExecutiveAdvisorCertificationReport = certifyRuntimeExecutiveAdvisorExperiencePlatform(),
): RuntimeExecutiveAdvisorExperienceFreezeMetadata {
  const canFreeze =
    report.status === "certified" &&
    report.compatibility === "compatible" &&
    report.failedCheckCount === 0 &&
    report.isCertified === true;

  return Object.freeze({
    certificationStatus: canFreeze ? ("certified" as const) : report.status,
    compatibility: canFreeze
      ? ("compatible" as const)
      : ("incompatible" as const),
    freezeStatus: canFreeze ? ("frozen" as const) : ("unfrozen" as const),
    lockStatus: canFreeze ? ("locked" as const) : ("unlocked" as const),
    lock: REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED,
    publicationReadiness: canFreeze
      ? ("ready-for-public-index" as const)
      : ("not-ready" as const),
    approvedExports: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS,
    invariants: RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS,
  });
}

export function verifyRuntimeExecutiveAdvisorExperiencePlatformLock(
  metadata: RuntimeExecutiveAdvisorExperienceFreezeMetadata = freezeRuntimeExecutiveAdvisorExperiencePlatform(),
): boolean {
  return (
    metadata.certificationStatus === "certified" &&
    metadata.compatibility === "compatible" &&
    metadata.freezeStatus === "frozen" &&
    metadata.lockStatus === "locked" &&
    metadata.lock ===
      REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED &&
    metadata.publicationReadiness === "ready-for-public-index" &&
    metadata.approvedExports.length > 0 &&
    unique([...metadata.approvedExports]) &&
    metadata.invariants.length ===
      RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS.length
  );
}

export function isRuntimeExecutiveAdvisorExperienceCertified(
  report: RuntimeExecutiveAdvisorCertificationReport = certifyRuntimeExecutiveAdvisorExperiencePlatform(),
): boolean {
  return report.isCertified === true && report.status === "certified";
}

export function isRuntimeExecutiveAdvisorExperienceFrozen(
  metadata: RuntimeExecutiveAdvisorExperienceFreezeMetadata = freezeRuntimeExecutiveAdvisorExperiencePlatform(),
): boolean {
  return metadata.freezeStatus === "frozen";
}

export function isRuntimeExecutiveAdvisorExperienceLocked(
  metadata: RuntimeExecutiveAdvisorExperienceFreezeMetadata = freezeRuntimeExecutiveAdvisorExperiencePlatform(),
): boolean {
  return (
    metadata.lockStatus === "locked" &&
    verifyRuntimeExecutiveAdvisorExperiencePlatformLock(metadata)
  );
}

export function isRuntimeExecutiveAdvisorExperienceReadyForPublicIndex(
  metadata: RuntimeExecutiveAdvisorExperienceFreezeMetadata = freezeRuntimeExecutiveAdvisorExperiencePlatform(),
): boolean {
  return (
    metadata.publicationReadiness === "ready-for-public-index" &&
    verifyRuntimeExecutiveAdvisorExperiencePlatformLock(metadata)
  );
}

export function validateRuntimeExecutiveAdvisorExperienceCertification(
  value: unknown,
): RuntimeExecutiveAdvisorCertificationValidationResult {
  const issues: RuntimeExecutiveAdvisorCertificationIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-report", "certification report must be an object"),
      ]),
    });
  }
  if (
    value.identity !==
    runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity
  ) {
    issues.push(issue("invalid-identity", "identity mismatch", "identity"));
  }
  if (!isRuntimeExecutiveAdvisorCertificationStatus(value.status)) {
    issues.push(issue("invalid-status", "status invalid", "status"));
  }
  if (!Array.isArray(value.checks)) {
    issues.push(issue("invalid-checks", "checks must be an array", "checks"));
  } else {
    const ids = value.checks
      .map((entry) =>
        isPlainObject(entry) && typeof entry.id === "string" ? entry.id : "",
      )
      .filter((id) => id.length > 0);
    if (!unique(ids)) {
      issues.push(
        issue("duplicate-check-ids", "check ids must be unique", "checks"),
      );
    }
    const expectedPassed = value.checks.filter(
      (entry) => isPlainObject(entry) && entry.outcome === "pass",
    ).length;
    if (
      typeof value.passedCheckCount === "number" &&
      value.passedCheckCount !== expectedPassed
    ) {
      issues.push(
        issue(
          "passed-count-mismatch",
          "passedCheckCount inconsistent",
          "passedCheckCount",
        ),
      );
    }
  }
  if (
    value.status === "certified" &&
    typeof value.failedCheckCount === "number" &&
    value.failedCheckCount !== 0
  ) {
    issues.push(
      issue(
        "certified-with-failures",
        "certified report cannot have failures",
        "failedCheckCount",
      ),
    );
  }
  if (
    value.status === "failed" &&
    (value.freezeStatus === "frozen" || value.lockStatus === "locked")
  ) {
    issues.push(
      issue(
        "failed-but-frozen",
        "failed certification cannot freeze/lock",
        "freezeStatus",
      ),
    );
  }
  if (
    value.platformLock !==
    REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED
  ) {
    issues.push(
      issue("invalid-platform-lock", "platform lock mismatch", "platformLock"),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveAdvisorExperienceCertificationFreezeIdentity():
  typeof runtimeExecutiveAdvisorExperienceCertificationFreezeCanonicalIdentity {
  return runtimeExecutiveAdvisorExperienceCertificationFreezeCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorExperienceCertificationFreezeApiNames =
  Object.freeze([
    "certifyRuntimeExecutiveAdvisorExperiencePlatform",
    "verifyRuntimeExecutiveAdvisorExperienceCompatibility",
    "freezeRuntimeExecutiveAdvisorExperiencePlatform",
    "verifyRuntimeExecutiveAdvisorExperiencePlatformLock",
    "isRuntimeExecutiveAdvisorExperienceCertified",
    "isRuntimeExecutiveAdvisorExperienceFrozen",
    "isRuntimeExecutiveAdvisorExperienceLocked",
    "isRuntimeExecutiveAdvisorExperienceReadyForPublicIndex",
    "validateRuntimeExecutiveAdvisorExperienceCertification",
    "verifyRuntimeExecutiveAdvisorExperienceCertificationFreeze",
    "getRuntimeExecutiveAdvisorExperienceCertificationFreezeIdentity",
    "isRuntimeExecutiveAdvisorCertificationStatus",
    "isRuntimeExecutiveAdvisorCertificationOutcome",
    "isRuntimeExecutiveAdvisorCertificationSeverity",
    "isRuntimeExecutiveAdvisorCertificationDomain",
    "isRuntimeExecutiveAdvisorFreezeStatus",
    "isRuntimeExecutiveAdvisorLockStatus",
    "isRuntimeExecutiveAdvisorPublicationReadiness",
  ] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveAdvisorCertificationStatus",
    "RuntimeExecutiveAdvisorCertificationOutcome",
    "RuntimeExecutiveAdvisorCertificationSeverity",
    "RuntimeExecutiveAdvisorCertificationDomain",
    "RuntimeExecutiveAdvisorCertificationCompatibility",
    "RuntimeExecutiveAdvisorFreezeStatus",
    "RuntimeExecutiveAdvisorLockStatus",
    "RuntimeExecutiveAdvisorPublicationReadiness",
    "RuntimeExecutiveAdvisorCertificationCapability",
    "RuntimeExecutiveAdvisorCertificationRegistrySection",
    "RuntimeExecutiveAdvisorFreezeInvariant",
    "RuntimeExecutiveAdvisorExperienceApprovedExport",
    "RuntimeExecutiveAdvisorCertificationCheck",
    "RuntimeExecutiveAdvisorCertificationReport",
    "RuntimeExecutiveAdvisorExperienceFreezeMetadata",
    "RuntimeExecutiveAdvisorCertificationIssue",
    "RuntimeExecutiveAdvisorCertificationValidationResult",
    "RuntimeExecutiveAdvisorExperienceCertificationFreezeVerification",
  ] as const);

export const runtimeExecutiveAdvisorExperienceCertificationFreezeRegistry =
  Object.freeze({
    identity: runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveAdvisorExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveAdvisorExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveAdvisorExperienceCertificationFreezeLayer,
    domain: runtimeExecutiveAdvisorExperienceCertificationFreezeDomain,
    phase: runtimeExecutiveAdvisorExperienceCertificationFreezePhase,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorExperienceCertificationFreezeSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_REGISTRY_SECTIONS.length,
    domains: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS,
    domainCount: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS.length,
    statuses: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_STATUSES,
    statusCount: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_STATUSES.length,
    outcomes: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_OUTCOMES,
    outcomeCount: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_OUTCOMES.length,
    severities: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_SEVERITIES,
    severityCount: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_SEVERITIES.length,
    freezeStatuses: RUNTIME_EXECUTIVE_ADVISOR_FREEZE_STATUSES,
    lockStatuses: RUNTIME_EXECUTIVE_ADVISOR_LOCK_STATUSES,
    publicationReadiness: RUNTIME_EXECUTIVE_ADVISOR_PUBLICATION_READINESS,
    approvedExports: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS,
    approvedExportCount:
      RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS.length,
    invariants: RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS.length,
    capabilities: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES,
    capabilityCount:
      RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES.length,
    publicTypes: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveAdvisorExperienceCertificationFreezeApiNames,
    publicApiCount:
      runtimeExecutiveAdvisorExperienceCertificationFreezeApiNames.length,
    platformLock: REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED,
  });

export const runtimeExecutiveAdvisorExperienceCertificationFreeze =
  Object.freeze({
    phase: "CertificationFreeze" as const,
    name: "RuntimeExecutiveAdvisorExperienceCertificationFreeze" as const,
    identity: runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveAdvisorExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveAdvisorExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveAdvisorExperienceCertificationFreezeLayer,
    domain: runtimeExecutiveAdvisorExperienceCertificationFreezeDomain,
    architecturalRole:
      runtimeExecutiveAdvisorExperienceCertificationFreezeArchitecturalRole,
    role: "CertificationAndFreezeBoundary" as const,
    status: runtimeExecutiveAdvisorExperienceCertificationFreezeStability,
    upstreamDependency:
      runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorExperienceCertificationFreezeSupportedImportPath,
    deterministic:
      runtimeExecutiveAdvisorExperienceCertificationFreezeDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    aiProviderIndependent: true as const,
    browserIndependent: true as const,
    principle: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_FREEZE_PRINCIPLE,
    boundary: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_FREEZE_BOUNDARY,
    domains: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS,
    statuses: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_STATUSES,
    outcomes: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_OUTCOMES,
    severities: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_SEVERITIES,
    freezeStatuses: RUNTIME_EXECUTIVE_ADVISOR_FREEZE_STATUSES,
    lockStatuses: RUNTIME_EXECUTIVE_ADVISOR_LOCK_STATUSES,
    publicationReadiness: RUNTIME_EXECUTIVE_ADVISOR_PUBLICATION_READINESS,
    approvedExports: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS,
    invariants: RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS,
    capabilities: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES,
    platformLock: REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED,
    publicTypeNames: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_PUBLIC_TYPE_NAMES,
    publicApiSurface:
      runtimeExecutiveAdvisorExperienceCertificationFreezeApiNames,
    registry: runtimeExecutiveAdvisorExperienceCertificationFreezeRegistry,
    platformBoundary: "REX-3:7-platform-only" as const,
    architecturalStatus:
      "REX-3:8 Certification & Freeze Complete — Ready for REX-3:9 Public Index" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorExperienceCertificationFreezeVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity;
  readonly version: typeof runtimeExecutiveAdvisorExperienceCertificationFreezeVersion;
  readonly namespace: typeof runtimeExecutiveAdvisorExperienceCertificationFreezeNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyIdentity;
  readonly domainCount: number;
  readonly checkCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly approvedExportCount: number;
  readonly invariantCount: number;
  readonly capabilityCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly certificationStatus: RuntimeExecutiveAdvisorCertificationStatus;
  readonly compatibility: RuntimeExecutiveAdvisorCertificationCompatibility;
  readonly freezeStatus: RuntimeExecutiveAdvisorFreezeStatus;
  readonly lockStatus: RuntimeExecutiveAdvisorLockStatus;
  readonly publicationReadiness: RuntimeExecutiveAdvisorPublicationReadiness;
  readonly platformLock: typeof REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED;
  readonly frozen: boolean;
  readonly platformOk: boolean;
  readonly noNewBehavior: boolean;
  readonly readyForPublicIndex: boolean;
}

export function verifyRuntimeExecutiveAdvisorExperienceCertificationFreeze():
  RuntimeExecutiveAdvisorExperienceCertificationFreezeVerification {
  const module = runtimeExecutiveAdvisorExperienceCertificationFreeze;
  const registry = runtimeExecutiveAdvisorExperienceCertificationFreezeRegistry;
  const platformOk = verifyRuntimeExecutiveAdvisorExperiencePlatform();
  const report = certifyRuntimeExecutiveAdvisorExperiencePlatform();
  const freeze = freezeRuntimeExecutiveAdvisorExperiencePlatform(report);

  const identityOk =
    module.identity ===
      "REX-3:8/RuntimeExecutiveAdvisorExperienceCertificationFreeze" &&
    module.version === "3.8.0" &&
    module.namespace ===
      "nexora.rex.advisor-experience.certification-freeze" &&
    module.status === "CertifiedFrozen" &&
    module.upstreamDependency ===
      "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform" &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePlatform" &&
    module.platformBoundary === "REX-3:7-platform-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS], [
      "identity",
      "dependency",
      "platform-contract",
      "platform-state",
      "execution-mode",
      "health",
      "compatibility",
      "guidance-safety",
      "action-safety",
      "manager-authority",
      "stage-ownership",
      "context-safety",
      "confirmation",
      "determinism",
      "immutability",
      "non-execution",
      "ai-neutrality",
      "ui-neutrality",
      "registry",
      "capabilities",
      "guarantees",
      "consumer-policy",
      "exports",
      "publication-readiness",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_REGISTRY_SECTIONS],
      [
        "Identity",
        "CertificationDomains",
        "CertificationChecks",
        "CertificationStatus",
        "Compatibility",
        "Freeze",
        "Lock",
        "ApprovedExports",
        "Invariants",
        "PublicationReadiness",
        "Capabilities",
      ],
    ) &&
    RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES.length === 17 &&
    RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS.length === 24;

  const domainCoverage = RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS.every(
    (domain) => report.checks.some((entry) => entry.domain === domain),
  );

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS) &&
    Object.isFrozen(report) &&
    Object.isFrozen(freeze);

  const boundaryOk =
    module.boundary.soleImmediateDependency ===
      "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform" &&
    module.boundary.consumesPlatformOnly === true &&
    module.boundary.importsRex36Directly === false &&
    module.boundary.introducesRuntimeBehavior === false &&
    module.boundary.executesActions === false &&
    module.boundary.preparesPublicIndex === true &&
    module.boundary.isFinalPublicConsumerIndex === false;

  const ok =
    identityOk &&
    vocabOk &&
    domainCoverage &&
    frozen &&
    boundaryOk &&
    platformOk.ok === true &&
    report.status === "certified" &&
    report.failedCheckCount === 0 &&
    freeze.freezeStatus === "frozen" &&
    verifyRuntimeExecutiveAdvisorExperiencePlatformLock(freeze) === true &&
    validateRuntimeExecutiveAdvisorExperienceCertification(report).ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveAdvisorExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveAdvisorExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveAdvisorExperienceCertificationFreezeNamespace,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperienceCertificationFreezeDependencyIdentity,
    domainCount: RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_DOMAINS.length,
    checkCount: report.totalCheckCount,
    passedCheckCount: report.passedCheckCount,
    failedCheckCount: report.failedCheckCount,
    approvedExportCount:
      RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_APPROVED_EXPORTS.length,
    invariantCount: RUNTIME_EXECUTIVE_ADVISOR_FREEZE_INVARIANTS.length,
    capabilityCount:
      RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_CERTIFICATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveAdvisorExperienceCertificationFreezeApiNames.length,
    certificationStatus: report.status,
    compatibility: report.compatibility,
    freezeStatus: freeze.freezeStatus,
    lockStatus: freeze.lockStatus,
    publicationReadiness: freeze.publicationReadiness,
    platformLock: REX_3_RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PLATFORM_LOCKED,
    frozen,
    platformOk: platformOk.ok === true,
    noNewBehavior: module.boundary.introducesRuntimeBehavior === false,
    readyForPublicIndex:
      isRuntimeExecutiveAdvisorExperienceReadyForPublicIndex(freeze),
  });
}

// ─── Frozen re-exports for REX-3:9 (platform surface only) ──────────────────

export {
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_METADATA,
  RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES,
  getRuntimeExecutiveAdvisorExperiencePlatformIdentity,
  isRuntimeExecutiveAdvisorPlatformCertificationReady,
  isRuntimeExecutiveAdvisorPlatformFreezeReady,
  isRuntimeExecutiveAdvisorPlatformOperational,
  isRuntimeExecutiveAdvisorPlatformReady,
  resolveRuntimeExecutiveAdvisorExperiencePlatform,
  resolveRuntimeExecutiveAdvisorPlatformCompatibility,
  resolveRuntimeExecutiveAdvisorPlatformExecutionMode,
  resolveRuntimeExecutiveAdvisorPlatformHealth,
  resolveRuntimeExecutiveAdvisorPlatformState,
  runtimeExecutiveAdvisorExperiencePlatform,
  runtimeExecutiveAdvisorExperiencePlatformApiNames,
  runtimeExecutiveAdvisorExperiencePlatformCanonicalIdentity,
  runtimeExecutiveAdvisorExperiencePlatformIdentity,
  runtimeExecutiveAdvisorExperiencePlatformNamespace,
  runtimeExecutiveAdvisorExperiencePlatformRegistry,
  runtimeExecutiveAdvisorExperiencePlatformVersion,
  validateRuntimeExecutiveAdvisorExperiencePlatform,
  verifyRuntimeExecutiveAdvisorExperiencePlatform,
};

export type {
  RuntimeExecutiveAdvisorExperiencePlatformResult,
  RuntimeExecutiveAdvisorPlatformCompatibility,
  RuntimeExecutiveAdvisorPlatformExecutionMode,
  RuntimeExecutiveAdvisorPlatformHealth,
  RuntimeExecutiveAdvisorPlatformInput,
  RuntimeExecutiveAdvisorPlatformMetadata,
  RuntimeExecutiveAdvisorPlatformState,
};
