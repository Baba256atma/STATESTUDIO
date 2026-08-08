/**
 * DRI-7:8 — Director Runtime Executive Guidance Certification & Freeze.
 *
 * Certifies and freezes the complete DRI-7:1→7:7 Executive Guidance chain.
 * Inspection and lock only — no new guidance semantics, adapters, runtime
 * pipeline APIs, dispatch, or Public Index.
 *
 * Principle: Certification proves the chain. Freeze locks the certified chain.
 * Public Index publishes the frozen chain.
 */

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_BOUNDARY,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_PUBLIC_TYPE_NAMES,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ACCEPTED_PLATFORM_VERSION,
  directorRuntimeExecutiveGuidanceAdapterCertification,
  directorRuntimeExecutiveGuidanceAdapterCertificationApiNames,
  directorRuntimeExecutiveGuidanceAdapterCertificationIdentity,
  directorRuntimeExecutiveGuidanceAdapterCertificationManifest,
  directorRuntimeExecutiveGuidanceAdapterCertificationReport,
  directorRuntimeExecutiveGuidanceAdapterCertificationVersion,
  verifyDirectorRuntimeExecutiveGuidanceAdapterCertification,
  type DirectorRuntimeExecutiveGuidanceAdapterCapability,
  type DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck,
  type DirectorRuntimeExecutiveGuidanceAdapterCertificationCheckId,
  type DirectorRuntimeExecutiveGuidanceAdapterCertificationDomain,
  type DirectorRuntimeExecutiveGuidanceAdapterCertificationInput,
  type DirectorRuntimeExecutiveGuidanceAdapterCertificationInvariant,
  type DirectorRuntimeExecutiveGuidanceAdapterCertificationManifest,
  type DirectorRuntimeExecutiveGuidanceAdapterCertificationReport,
  type DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus,
  type DirectorRuntimeExecutiveGuidanceAdapterCertificationVerification,
  type DirectorRuntimeExecutiveGuidanceAdapterCompatibilityStatus,
  type DirectorRuntimeExecutiveGuidanceAdapterConsumerKind,
  type DirectorRuntimeExecutiveGuidanceAdapterDescriptor,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceAdapterCertification";

/** Approved frozen publication surface for DRI-7:9 (adapter-certification stage). */
export type {
  DirectorRuntimeExecutiveGuidanceAdapterCapability,
  DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck,
  DirectorRuntimeExecutiveGuidanceAdapterCertificationCheckId,
  DirectorRuntimeExecutiveGuidanceAdapterCertificationDomain,
  DirectorRuntimeExecutiveGuidanceAdapterCertificationInput,
  DirectorRuntimeExecutiveGuidanceAdapterCertificationInvariant,
  DirectorRuntimeExecutiveGuidanceAdapterCertificationManifest,
  DirectorRuntimeExecutiveGuidanceAdapterCertificationReport,
  DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus,
  DirectorRuntimeExecutiveGuidanceAdapterCertificationVerification,
  DirectorRuntimeExecutiveGuidanceAdapterCompatibilityStatus,
  DirectorRuntimeExecutiveGuidanceAdapterConsumerKind,
  DirectorRuntimeExecutiveGuidanceAdapterDescriptor,
};

export {
  certifyDirectorExecutiveGuidanceAdapter,
  certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters,
  createDirectorExecutiveGuidanceAdapterCertificationInput,
  createDirectorExecutiveGuidanceAdapterDescriptor,
  isDirectorRuntimeExecutiveGuidanceAdapterCertificationStatus,
  isDirectorRuntimeExecutiveGuidanceAdapterConsumerKind,
  verifyDirectorRuntimeExecutiveGuidanceAdapterCertification,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceAdapterCertification";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceFreezeIdentity =
  "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze" as const;
export const directorRuntimeExecutiveGuidanceFreezeVersion =
  "7.8.0" as const;
export const directorRuntimeExecutiveGuidanceFreezeNamespace =
  "nexora.dri.executive-guidance.freeze" as const;
export const directorRuntimeExecutiveGuidanceFreezeUpstream =
  directorRuntimeExecutiveGuidanceAdapterCertificationIdentity;

export const directorRuntimeExecutiveGuidanceFreezeCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidanceFreezeIdentity,
    version: directorRuntimeExecutiveGuidanceFreezeVersion,
    namespace: directorRuntimeExecutiveGuidanceFreezeNamespace,
    upstream: directorRuntimeExecutiveGuidanceFreezeUpstream,
  });

// ─── Lock ───────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK =
  "DRI-7-EXECUTIVE-GUIDANCE-PLATFORM-LOCKED" as const;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS =
  "locked" as const;

// ─── Principle / boundary ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_PRINCIPLE =
  "Certification proves the chain. Freeze locks the certified chain. Public Index publishes the frozen chain." as const;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_BOUNDARY =
  Object.freeze({
    adapterCertificationAuthority: "DRI-7:7" as const,
    freezeAuthority: "DRI-7:8" as const,
    publicIndexAuthority: "DRI-7:9" as const,
    certifiesAndFreezesOnly: true as const,
    doesNotAddGuidanceSemantics: true as const,
    doesNotImplementAdapters: true as const,
    doesNotExposePublicIndex: true as const,
    doesNotIntroduceRuntimePipelineApis: true as const,
    consumesAdapterCertificationOnly: true as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_STATUSES =
  Object.freeze(["frozen", "not-frozen"] as const);
export type DirectorRuntimeExecutiveGuidanceFreezeStatus =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_STATUSES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELEASE_READINESS_VALUES =
  Object.freeze([
    "ready-for-public-index",
    "not-ready-for-public-index",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceReleaseReadiness =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELEASE_READINESS_VALUES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CERTIFICATION_DOMAINS =
  Object.freeze([
    "identity-chain",
    "version-chain",
    "namespace-chain",
    "dependency-chain",
    "foundation-integrity",
    "contract-integrity",
    "resolution-integrity",
    "composition-integrity",
    "delivery-integrity",
    "platform-integrity",
    "adapter-certification",
    "semantic-boundary",
    "traceability",
    "determinism",
    "immutability",
    "renderer-independence",
    "advisor-independence",
    "action-independence",
    "side-effect-freedom",
    "consumer-readiness",
    "release-readiness",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceFreezeCertificationDomain =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CERTIFICATION_DOMAINS)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CHECK_IDS =
  Object.freeze([
    "dri7.freeze.identity-chain",
    "dri7.freeze.version-chain",
    "dri7.freeze.namespace-chain",
    "dri7.freeze.dependency-chain",
    "dri7.freeze.foundation-integrity",
    "dri7.freeze.contract-integrity",
    "dri7.freeze.resolution-integrity",
    "dri7.freeze.composition-integrity",
    "dri7.freeze.delivery-integrity",
    "dri7.freeze.platform-integrity",
    "dri7.freeze.adapter-certification",
    "dri7.freeze.semantic-boundary",
    "dri7.freeze.traceability",
    "dri7.freeze.determinism",
    "dri7.freeze.immutability",
    "dri7.freeze.renderer-independence",
    "dri7.freeze.advisor-independence",
    "dri7.freeze.action-independence",
    "dri7.freeze.side-effect-freedom",
    "dri7.freeze.consumer-readiness",
    "dri7.freeze.release-readiness",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceFreezeCheckId =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CHECK_IDS)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_MANDATORY_CHECK_IDS =
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CHECK_IDS;

// ─── Canonical chains ───────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN =
  Object.freeze([
    "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
    "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
    "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution",
    "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition",
    "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
    "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
    "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
    "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze",
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN =
  Object.freeze([
    "7.1.0",
    "7.2.0",
    "7.3.0",
    "7.4.0",
    "7.5.0",
    "7.6.0",
    "7.7.0",
    "7.8.0",
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN =
  Object.freeze([
    "nexora.dri.executive-guidance.foundation",
    "nexora.dri.executive-guidance.contracts",
    "nexora.dri.executive-guidance.resolution",
    "nexora.dri.executive-guidance.composition",
    "nexora.dri.executive-guidance.delivery",
    "nexora.dri.executive-guidance.platform",
    "nexora.dri.executive-guidance.adapter-certification",
    "nexora.dri.executive-guidance.freeze",
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN =
  Object.freeze([
    "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze",
    "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
    "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
    "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
    "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition",
    "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution",
    "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
    "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
    "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex",
  ] as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceFreezeCertificationCheck {
  readonly checkId: DirectorRuntimeExecutiveGuidanceFreezeCheckId | string;
  readonly domain: DirectorRuntimeExecutiveGuidanceFreezeCertificationDomain;
  readonly passed: boolean;
  readonly reason: string;
}

export interface DirectorRuntimeExecutiveGuidanceFreezeCertificationResult {
  readonly certificationStatus:
    | DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus
    | "not-certified";
  readonly compatibilityStatus:
    | DirectorRuntimeExecutiveGuidanceAdapterCompatibilityStatus
    | "incompatible";
  readonly freezeStatus: DirectorRuntimeExecutiveGuidanceFreezeStatus;
  readonly releaseReadiness: DirectorRuntimeExecutiveGuidanceReleaseReadiness;
  readonly lock: typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK;
  readonly lockStatus: typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS | "unlocked";
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly checks: readonly DirectorRuntimeExecutiveGuidanceFreezeCertificationCheck[];
}

export interface DirectorRuntimeExecutiveGuidanceFreezeManifest {
  readonly identity: string;
  readonly version: string;
  readonly namespace: string;
  readonly lock: typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK;
  readonly lockStatus: typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS | "unlocked";
  readonly certificationStatus:
    | DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus
    | "not-certified";
  readonly compatibilityStatus:
    | DirectorRuntimeExecutiveGuidanceAdapterCompatibilityStatus
    | "incompatible";
  readonly freezeStatus: DirectorRuntimeExecutiveGuidanceFreezeStatus;
  readonly releaseReadiness: DirectorRuntimeExecutiveGuidanceReleaseReadiness;
  readonly identityChain: readonly string[];
  readonly versionChain: readonly string[];
  readonly namespaceChain: readonly string[];
  readonly dependencyChain: readonly string[];
  readonly checks: readonly DirectorRuntimeExecutiveGuidanceFreezeCertificationCheck[];
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly readinessLabel: "ReadyForPublicIndex" | "NotReadyForPublicIndex";
}

export interface DirectorRuntimeExecutiveGuidanceFrozenExportManifest {
  readonly stage: string;
  readonly exportNames: readonly string[];
}

export interface DirectorRuntimeExecutiveGuidanceFreezeCertificationInput {
  readonly forceFailedCheckId?: string | null;
  readonly identityOverride?: string | null;
  readonly adapterCertificationStatusOverride?:
    | DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus
    | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function freezeCheck(input: {
  readonly checkId: string;
  readonly domain: DirectorRuntimeExecutiveGuidanceFreezeCertificationDomain;
  readonly passed: boolean;
  readonly reason: string;
}): DirectorRuntimeExecutiveGuidanceFreezeCertificationCheck {
  return Object.freeze({
    checkId: input.checkId,
    domain: input.domain,
    passed: input.passed,
    reason: input.reason,
  });
}

function arraysEqual(
  left: readonly string[],
  right: readonly string[],
): boolean {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

function evaluateFreezeChecks(
  input: DirectorRuntimeExecutiveGuidanceFreezeCertificationInput = {},
): readonly DirectorRuntimeExecutiveGuidanceFreezeCertificationCheck[] {
  const adapterVerification =
    verifyDirectorRuntimeExecutiveGuidanceAdapterCertification();
  const adapterReport = directorRuntimeExecutiveGuidanceAdapterCertificationReport;
  const adapterManifest =
    directorRuntimeExecutiveGuidanceAdapterCertificationManifest;
  const adapter = directorRuntimeExecutiveGuidanceAdapterCertification;
  const boundary = DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_BOUNDARY;

  const observedIdentity =
    input.identityOverride ?? directorRuntimeExecutiveGuidanceFreezeIdentity;
  const adapterStatus =
    input.adapterCertificationStatusOverride ??
    adapterReport.certificationStatus;

  const identityChainExact = arraysEqual(
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN,
    [
      "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
      "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
      "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution",
      "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition",
      "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
      "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
      "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
      observedIdentity,
    ],
  );

  const versionChainExact = arraysEqual(
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN,
    [
      "7.1.0",
      "7.2.0",
      "7.3.0",
      "7.4.0",
      "7.5.0",
      "7.6.0",
      directorRuntimeExecutiveGuidanceAdapterCertificationVersion,
      directorRuntimeExecutiveGuidanceFreezeVersion,
    ],
  );

  const namespaceChainExact = arraysEqual(
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN,
    [
      "nexora.dri.executive-guidance.foundation",
      "nexora.dri.executive-guidance.contracts",
      "nexora.dri.executive-guidance.resolution",
      "nexora.dri.executive-guidance.composition",
      "nexora.dri.executive-guidance.delivery",
      "nexora.dri.executive-guidance.platform",
      "nexora.dri.executive-guidance.adapter-certification",
      directorRuntimeExecutiveGuidanceFreezeNamespace,
    ],
  );

  const dependencyChainExact =
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN[0] ===
      observedIdentity &&
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN[1] ===
      directorRuntimeExecutiveGuidanceAdapterCertificationIdentity &&
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN[2] ===
      adapterManifest.platformIdentity &&
    directorRuntimeExecutiveGuidanceFreezeUpstream ===
      directorRuntimeExecutiveGuidanceAdapterCertificationIdentity &&
    adapter.upstreamDependency === adapterManifest.platformIdentity &&
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN[8] ===
      "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex";

  const adapterCertified =
    adapterStatus === "certified" &&
    adapterReport.compatibilityStatus === "compatible" &&
    adapterReport.failedCheckCount === 0 &&
    adapterVerification.ok;

  const baseChecks = Object.freeze([
    freezeCheck({
      checkId: "dri7.freeze.identity-chain",
      domain: "identity-chain",
      passed:
        identityChainExact &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN.length === 8,
      reason: "exact DRI-7:1→7:8 identity chain is stable",
    }),
    freezeCheck({
      checkId: "dri7.freeze.version-chain",
      domain: "version-chain",
      passed:
        versionChainExact &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN.length === 8,
      reason: "exact DRI-7 version chain 7.1.0→7.8.0 is stable",
    }),
    freezeCheck({
      checkId: "dri7.freeze.namespace-chain",
      domain: "namespace-chain",
      passed:
        namespaceChainExact &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN.length === 8,
      reason: "exact executive-guidance namespace chain is stable",
    }),
    freezeCheck({
      checkId: "dri7.freeze.dependency-chain",
      domain: "dependency-chain",
      passed:
        dependencyChainExact &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN.length === 9,
      reason: "immediate-dependency chain 7:8→…→7:1→DRI-6:9 is intact",
    }),
    freezeCheck({
      checkId: "dri7.freeze.foundation-integrity",
      domain: "foundation-integrity",
      passed:
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN[0] ===
          "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation" &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN[0] === "7.1.0",
      reason: "foundation identity/version remain certified in the freeze chain",
    }),
    freezeCheck({
      checkId: "dri7.freeze.contract-integrity",
      domain: "contract-integrity",
      passed:
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN[1] ===
          "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts" &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN[1] === "7.2.0",
      reason: "contracts identity/version remain certified in the freeze chain",
    }),
    freezeCheck({
      checkId: "dri7.freeze.resolution-integrity",
      domain: "resolution-integrity",
      passed:
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN[2] ===
          "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution" &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN[2] === "7.3.0",
      reason: "resolution identity/version remain certified in the freeze chain",
    }),
    freezeCheck({
      checkId: "dri7.freeze.composition-integrity",
      domain: "composition-integrity",
      passed:
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN[3] ===
          "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition" &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN[3] === "7.4.0",
      reason:
        "composition identity/version remain certified in the freeze chain",
    }),
    freezeCheck({
      checkId: "dri7.freeze.delivery-integrity",
      domain: "delivery-integrity",
      passed:
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN[4] ===
          "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery" &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN[4] === "7.5.0",
      reason: "delivery identity/version remain certified in the freeze chain",
    }),
    freezeCheck({
      checkId: "dri7.freeze.platform-integrity",
      domain: "platform-integrity",
      passed:
        adapterManifest.platformIdentity ===
          "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform" &&
        adapterManifest.platformVersion === "7.6.0" &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ACCEPTED_PLATFORM_VERSION ===
          "7.6.0",
      reason: "platform identity/version remain certified via adapter surface",
    }),
    freezeCheck({
      checkId: "dri7.freeze.adapter-certification",
      domain: "adapter-certification",
      passed: adapterCertified,
      reason:
        "upstream adapter certification is certified, compatible, and zero-failure",
    }),
    freezeCheck({
      checkId: "dri7.freeze.semantic-boundary",
      domain: "semantic-boundary",
      passed:
        boundary.platformAuthority === "DRI-7:6" &&
        boundary.adapterCertificationAuthority === "DRI-7:7" &&
        boundary.freezeAuthority === "DRI-7:8" &&
        boundary.certifiesBoundaryOnly === true,
      reason: "stage ownership boundaries remain exclusive and explicit",
    }),
    freezeCheck({
      checkId: "dri7.freeze.traceability",
      domain: "traceability",
      passed:
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN.length === 9 &&
        adapterReport.checks.some(
          (entry) =>
            entry.checkId === "dri7.adapter.provenance.preserved" &&
            entry.passed,
        ),
      reason:
        "end-to-end identity continuity from DRI-6:9 through freeze is supported",
    }),
    freezeCheck({
      checkId: "dri7.freeze.determinism",
      domain: "determinism",
      passed:
        adapter.deterministic === true &&
        adapterVerification.checks.includes("canonical-certified"),
      reason: "canonical adapter certification remains deterministic",
    }),
    freezeCheck({
      checkId: "dri7.freeze.immutability",
      domain: "immutability",
      passed:
        Object.isFrozen(adapter) &&
        Object.isFrozen(adapterReport) &&
        Object.isFrozen(adapterManifest) &&
        Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN),
      reason: "upstream artifacts and freeze chains are immutable",
    }),
    freezeCheck({
      checkId: "dri7.freeze.renderer-independence",
      domain: "renderer-independence",
      passed: adapter.rendererIndependent === true &&
        adapterManifest.rendererIndependent === true,
      reason: "DRI-7 freeze remains free of renderer requirements",
    }),
    freezeCheck({
      checkId: "dri7.freeze.advisor-independence",
      domain: "advisor-independence",
      passed: adapter.advisorIndependent === true &&
        adapterManifest.advisorIndependent === true,
      reason: "DRI-7 freeze remains free of Advisor conversation requirements",
    }),
    freezeCheck({
      checkId: "dri7.freeze.action-independence",
      domain: "action-independence",
      passed: adapter.actionIndependent === true &&
        adapterManifest.actionIndependent === true,
      reason: "DRI-7 freeze remains free of business-action execution",
    }),
    freezeCheck({
      checkId: "dri7.freeze.side-effect-freedom",
      domain: "side-effect-freedom",
      passed: adapter.sideEffectFree === true &&
        adapterManifest.sideEffectBoundaryCertified === true,
      reason: "semantic guidance pipeline remains side-effect free",
    }),
    freezeCheck({
      checkId: "dri7.freeze.consumer-readiness",
      domain: "consumer-readiness",
      passed:
        adapterReport.capabilities.includes("consume-platform-result") &&
        adapterReport.capabilities.includes("preserve-readiness"),
      reason:
        "chain can produce consumer-ready semantic packages without visual readiness",
    }),
    freezeCheck({
      checkId: "dri7.freeze.release-readiness",
      domain: "release-readiness",
      passed: adapterCertified && identityChainExact && dependencyChainExact,
      reason:
        "certified/compatible adapter boundary plus intact chains enable Public Index",
    }),
  ]);

  if (
    typeof input.forceFailedCheckId === "string" &&
    input.forceFailedCheckId.length > 0
  ) {
    return Object.freeze(
      baseChecks.map((check) =>
        check.checkId === input.forceFailedCheckId
          ? freezeCheck({
              checkId: check.checkId,
              domain: check.domain,
              passed: false,
              reason: `forced failure for ${check.checkId}`,
            })
          : check,
      ),
    );
  }

  return baseChecks;
}

function finalizeCertificationResult(
  checks: readonly DirectorRuntimeExecutiveGuidanceFreezeCertificationCheck[],
): DirectorRuntimeExecutiveGuidanceFreezeCertificationResult {
  let passedCheckCount = 0;
  let failedCheckCount = 0;
  for (const check of checks) {
    if (check.passed) passedCheckCount += 1;
    else failedCheckCount += 1;
  }
  const allPassed = failedCheckCount === 0;
  return Object.freeze({
    certificationStatus: allPassed
      ? ("certified" as const)
      : ("not-certified" as const),
    compatibilityStatus: allPassed
      ? ("compatible" as const)
      : ("incompatible" as const),
    freezeStatus: allPassed ? ("frozen" as const) : ("not-frozen" as const),
    releaseReadiness: allPassed
      ? ("ready-for-public-index" as const)
      : ("not-ready-for-public-index" as const),
    lock: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
    lockStatus: allPassed
      ? DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS
      : ("unlocked" as const),
    passedCheckCount,
    failedCheckCount,
    checks: Object.freeze([...checks]),
  });
}

function buildManifest(
  result: DirectorRuntimeExecutiveGuidanceFreezeCertificationResult,
): DirectorRuntimeExecutiveGuidanceFreezeManifest {
  return Object.freeze({
    identity: directorRuntimeExecutiveGuidanceFreezeIdentity,
    version: directorRuntimeExecutiveGuidanceFreezeVersion,
    namespace: directorRuntimeExecutiveGuidanceFreezeNamespace,
    lock: result.lock,
    lockStatus: result.lockStatus,
    certificationStatus: result.certificationStatus,
    compatibilityStatus: result.compatibilityStatus,
    freezeStatus: result.freezeStatus,
    releaseReadiness: result.releaseReadiness,
    identityChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN,
    versionChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN,
    namespaceChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN,
    dependencyChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN,
    checks: result.checks,
    passedCheckCount: result.passedCheckCount,
    failedCheckCount: result.failedCheckCount,
    readinessLabel:
      result.releaseReadiness === "ready-for-public-index"
        ? ("ReadyForPublicIndex" as const)
        : ("NotReadyForPublicIndex" as const),
  });
}

// ─── Main APIs ──────────────────────────────────────────────────────────────

export function certifyDirectorRuntimeExecutiveGuidanceFreeze(
  input: DirectorRuntimeExecutiveGuidanceFreezeCertificationInput = {},
): DirectorRuntimeExecutiveGuidanceFreezeCertificationResult {
  return finalizeCertificationResult(evaluateFreezeChecks(input));
}

export function createDirectorRuntimeExecutiveGuidanceFreezeManifest(
  input: DirectorRuntimeExecutiveGuidanceFreezeCertificationInput = {},
): DirectorRuntimeExecutiveGuidanceFreezeManifest {
  return buildManifest(certifyDirectorRuntimeExecutiveGuidanceFreeze(input));
}

// ─── Frozen export surface for DRI-7:9 ──────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST =
  Object.freeze([
    Object.freeze({
      stage: "DRI-7:7/AdapterCertification",
      exportNames: Object.freeze([
        ...directorRuntimeExecutiveGuidanceAdapterCertificationApiNames,
        ...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_PUBLIC_TYPE_NAMES,
      ]),
    }),
    Object.freeze({
      stage: "DRI-7:8/Freeze",
      exportNames: Object.freeze([
        "directorRuntimeExecutiveGuidanceFreezeIdentity",
        "directorRuntimeExecutiveGuidanceFreezeVersion",
        "directorRuntimeExecutiveGuidanceFreezeNamespace",
        "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK",
        "directorRuntimeExecutiveGuidanceFreezeManifest",
        "directorRuntimeExecutiveGuidanceFreezeRegistry",
        "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST",
        "certifyDirectorRuntimeExecutiveGuidanceFreeze",
        "createDirectorRuntimeExecutiveGuidanceFreezeManifest",
        "verifyDirectorRuntimeExecutiveGuidanceFreeze",
      ]),
    }),
    Object.freeze({
      stage: "ApprovedCategories",
      exportNames: Object.freeze([
        "Foundation public types",
        "Contracts public types",
        "Resolution public types/APIs",
        "Composition public types/APIs",
        "Delivery public types/APIs",
        "Platform public types/APIs",
        "Adapter certification types/APIs",
        "Freeze metadata/verification",
      ]),
    }),
  ]) as readonly DirectorRuntimeExecutiveGuidanceFrozenExportManifest[];

// ─── Canonical freeze artifacts ─────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceFreezeCertificationResult =
  certifyDirectorRuntimeExecutiveGuidanceFreeze();

export const directorRuntimeExecutiveGuidanceFreezeManifest =
  buildManifest(directorRuntimeExecutiveGuidanceFreezeCertificationResult);

// ─── Registry / module descriptor ───────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_INVARIANTS =
  Object.freeze([
    "all-or-nothing-freeze",
    "no-partial-freeze",
    "no-certification-score",
    "sole-adapter-certification-dependency",
    "no-deep-dri-imports",
    "no-public-index",
    "no-new-runtime-pipeline-apis",
    "no-adapter-implementation",
    "consumers-use-public-index-only-after-release",
    "ready-for-public-index-not-ready-for-consumer",
  ] as const);

export type DirectorRuntimeExecutiveGuidanceFreezeInvariant =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_INVARIANTS)[number];

export const directorRuntimeExecutiveGuidanceFreezeApiNames = Object.freeze([
  "certifyDirectorRuntimeExecutiveGuidanceFreeze",
  "createDirectorRuntimeExecutiveGuidanceFreezeManifest",
  "verifyDirectorRuntimeExecutiveGuidanceFreeze",
] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeExecutiveGuidanceFreezeStatus",
    "DirectorRuntimeExecutiveGuidanceReleaseReadiness",
    "DirectorRuntimeExecutiveGuidanceFreezeCertificationDomain",
    "DirectorRuntimeExecutiveGuidanceFreezeCheckId",
    "DirectorRuntimeExecutiveGuidanceFreezeCertificationCheck",
    "DirectorRuntimeExecutiveGuidanceFreezeCertificationResult",
    "DirectorRuntimeExecutiveGuidanceFreezeManifest",
    "DirectorRuntimeExecutiveGuidanceFrozenExportManifest",
    "DirectorRuntimeExecutiveGuidanceFreezeCertificationInput",
    "DirectorRuntimeExecutiveGuidanceFreezeInvariant",
    "DirectorRuntimeExecutiveGuidanceFreezeVerification",
  ] as const);

export const directorRuntimeExecutiveGuidanceFreezeRegistry = Object.freeze({
  identity: directorRuntimeExecutiveGuidanceFreezeIdentity,
  version: directorRuntimeExecutiveGuidanceFreezeVersion,
  namespace: directorRuntimeExecutiveGuidanceFreezeNamespace,
  dependency: directorRuntimeExecutiveGuidanceFreezeUpstream,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_BOUNDARY,
  lock: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
  lockStatus: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS,
  freezeStatuses: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_STATUSES,
  freezeStatusCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_STATUSES.length,
  releaseReadinessValues:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELEASE_READINESS_VALUES,
  releaseReadinessCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELEASE_READINESS_VALUES.length,
  domains: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CERTIFICATION_DOMAINS,
  domainCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CERTIFICATION_DOMAINS.length,
  checkIds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CHECK_IDS,
  checkCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CHECK_IDS.length,
  mandatoryCheckIds:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_MANDATORY_CHECK_IDS,
  mandatoryCheckCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_MANDATORY_CHECK_IDS.length,
  identityChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN,
  identityChainCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN.length,
  versionChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN,
  versionChainCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN.length,
  namespaceChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN,
  namespaceChainCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN.length,
  dependencyChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN,
  dependencyChainCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN.length,
  frozenExportManifest:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST,
  frozenExportManifestCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST.length,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_INVARIANTS.length,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_PUBLIC_TYPE_NAMES.length,
  publicApis: directorRuntimeExecutiveGuidanceFreezeApiNames,
  publicApiCount: directorRuntimeExecutiveGuidanceFreezeApiNames.length,
  registrySectionCount: 7 as const,
});

export const directorRuntimeExecutiveGuidanceFreeze = Object.freeze({
  phase: "DRI-7:8" as const,
  name: "DirectorRuntimeExecutiveGuidanceFreeze" as const,
  identity: directorRuntimeExecutiveGuidanceFreezeIdentity,
  namespace: directorRuntimeExecutiveGuidanceFreezeNamespace,
  version: directorRuntimeExecutiveGuidanceFreezeVersion,
  layer: "Director Runtime Integration" as const,
  domain: "ExecutiveGuidanceAttentionDelivery" as const,
  role: "CertificationFreeze" as const,
  stage: "CertificationFreeze" as const,
  status: "FrozenReadyForPublicIndex" as const,
  upstreamDependency: directorRuntimeExecutiveGuidanceFreezeUpstream,
  lock: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
  lockStatus: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS,
  deterministic: true as const,
  certifiesAndFreezesOnly: true as const,
  sideEffectFree: true as const,
  rendererIndependent: true as const,
  advisorIndependent: true as const,
  actionIndependent: true as const,
  noPublicIndex: true as const,
  noConcreteAdapters: true as const,
  readiness: "ReadyForPublicIndex" as const,
  manifest: directorRuntimeExecutiveGuidanceFreezeManifest,
  registry: directorRuntimeExecutiveGuidanceFreezeRegistry,
  frozenExportManifest:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceFreezeVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidanceFreezeIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidanceFreezeVersion;
  readonly namespace: typeof directorRuntimeExecutiveGuidanceFreezeNamespace;
  readonly upstream: typeof directorRuntimeExecutiveGuidanceFreezeUpstream;
  readonly lock: typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK;
  readonly lockStatus: typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS;
  readonly freezeStatus: DirectorRuntimeExecutiveGuidanceFreezeStatus;
  readonly releaseReadiness: DirectorRuntimeExecutiveGuidanceReleaseReadiness;
  readonly certificationStatus:
    | DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus
    | "not-certified";
  readonly compatibilityStatus:
    | DirectorRuntimeExecutiveGuidanceAdapterCompatibilityStatus
    | "incompatible";
  readonly checkCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly checks: readonly string[];
}

export function verifyDirectorRuntimeExecutiveGuidanceFreeze():
  DirectorRuntimeExecutiveGuidanceFreezeVerification {
  const manifest = directorRuntimeExecutiveGuidanceFreezeManifest;
  const result = directorRuntimeExecutiveGuidanceFreezeCertificationResult;
  const checks: string[] = [];
  const record = (name: string, pass: boolean): void => {
    if (pass) checks[checks.length] = name;
  };

  record(
    "identity",
    directorRuntimeExecutiveGuidanceFreezeIdentity ===
      "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze",
  );
  record(
    "version",
    directorRuntimeExecutiveGuidanceFreezeVersion === "7.8.0",
  );
  record(
    "namespace",
    directorRuntimeExecutiveGuidanceFreezeNamespace ===
      "nexora.dri.executive-guidance.freeze",
  );
  record(
    "sole-dependency",
    directorRuntimeExecutiveGuidanceFreezeUpstream ===
      "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
  );
  record(
    "lock",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK ===
      "DRI-7-EXECUTIVE-GUIDANCE-PLATFORM-LOCKED",
  );
  record(
    "lock-status",
    manifest.lockStatus === "locked",
  );
  record(
    "identity-chain",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN.length === 8,
  );
  record(
    "version-chain",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN.length === 8,
  );
  record(
    "namespace-chain",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN.length === 8,
  );
  record(
    "domain-uniqueness",
    new Set(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CERTIFICATION_DOMAINS)
      .size ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CERTIFICATION_DOMAINS.length,
  );
  record(
    "check-uniqueness",
    new Set(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CHECK_IDS).size ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CHECK_IDS.length,
  );
  record(
    "canonical-frozen",
    manifest.freezeStatus === "frozen" &&
      manifest.certificationStatus === "certified" &&
      manifest.compatibilityStatus === "compatible" &&
      manifest.releaseReadiness === "ready-for-public-index" &&
      result.failedCheckCount === 0,
  );
  record(
    "counts-reconcile",
    result.passedCheckCount + result.failedCheckCount === result.checks.length,
  );
  record(
    "manifest-frozen",
    Object.isFrozen(manifest) && Object.isFrozen(manifest.checks),
  );
  record(
    "registry-frozen",
    Object.isFrozen(directorRuntimeExecutiveGuidanceFreezeRegistry),
  );
  record(
    "export-manifest-frozen",
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST),
  );

  const ok =
    checks.length === 16 &&
    checks.includes("identity") &&
    checks.includes("version") &&
    checks.includes("namespace") &&
    checks.includes("sole-dependency") &&
    checks.includes("canonical-frozen");

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidanceFreezeIdentity,
    version: directorRuntimeExecutiveGuidanceFreezeVersion,
    namespace: directorRuntimeExecutiveGuidanceFreezeNamespace,
    upstream: directorRuntimeExecutiveGuidanceFreezeUpstream,
    lock: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
    lockStatus: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS,
    freezeStatus: manifest.freezeStatus,
    releaseReadiness: manifest.releaseReadiness,
    certificationStatus: manifest.certificationStatus,
    compatibilityStatus: manifest.compatibilityStatus,
    checkCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_CHECK_IDS.length,
    passedCheckCount: result.passedCheckCount,
    failedCheckCount: result.failedCheckCount,
    checks: Object.freeze([...checks]),
  });
}
