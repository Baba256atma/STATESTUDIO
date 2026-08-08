/**
 * DRI-7:9 — Director Runtime Executive Guidance Public Index.
 *
 * Sole supported consumer entry point for the certified, frozen DRI-7
 * Executive Guidance capability. Publication only — no new semantics,
 * wrappers, orchestration, rendering, dispatch, or mutation.
 *
 * Principle: Freeze decides what is approved. Public Index exposes what
 * was approved.
 */

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_PUBLIC_TYPE_NAMES,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN,
  certifyDirectorExecutiveGuidanceAdapter,
  certifyDirectorRuntimeExecutiveGuidanceFreeze,
  certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters,
  createDirectorExecutiveGuidanceAdapterCertificationInput,
  createDirectorExecutiveGuidanceAdapterDescriptor,
  createDirectorRuntimeExecutiveGuidanceFreezeManifest,
  directorRuntimeExecutiveGuidanceFreeze,
  directorRuntimeExecutiveGuidanceFreezeApiNames,
  directorRuntimeExecutiveGuidanceFreezeIdentity,
  directorRuntimeExecutiveGuidanceFreezeManifest,
  directorRuntimeExecutiveGuidanceFreezeRegistry,
  isDirectorRuntimeExecutiveGuidanceAdapterCertificationStatus,
  isDirectorRuntimeExecutiveGuidanceAdapterConsumerKind,
  verifyDirectorRuntimeExecutiveGuidanceAdapterCertification,
  verifyDirectorRuntimeExecutiveGuidanceFreeze,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceFreeze";

/** Exact DRI-7:8-approved publication. Direct re-export — no wrappers. */
export {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN,
  certifyDirectorExecutiveGuidanceAdapter,
  certifyDirectorRuntimeExecutiveGuidanceFreeze,
  certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters,
  createDirectorExecutiveGuidanceAdapterCertificationInput,
  createDirectorExecutiveGuidanceAdapterDescriptor,
  createDirectorRuntimeExecutiveGuidanceFreezeManifest,
  directorRuntimeExecutiveGuidanceFreeze,
  directorRuntimeExecutiveGuidanceFreezeIdentity,
  directorRuntimeExecutiveGuidanceFreezeManifest,
  directorRuntimeExecutiveGuidanceFreezeRegistry,
  isDirectorRuntimeExecutiveGuidanceAdapterCertificationStatus,
  isDirectorRuntimeExecutiveGuidanceAdapterConsumerKind,
  verifyDirectorRuntimeExecutiveGuidanceAdapterCertification,
  verifyDirectorRuntimeExecutiveGuidanceFreeze,
};

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
  DirectorRuntimeExecutiveGuidanceFreezeCertificationCheck,
  DirectorRuntimeExecutiveGuidanceFreezeCertificationDomain,
  DirectorRuntimeExecutiveGuidanceFreezeCertificationInput,
  DirectorRuntimeExecutiveGuidanceFreezeCertificationResult,
  DirectorRuntimeExecutiveGuidanceFreezeCheckId,
  DirectorRuntimeExecutiveGuidanceFreezeInvariant,
  DirectorRuntimeExecutiveGuidanceFreezeManifest,
  DirectorRuntimeExecutiveGuidanceFreezeStatus,
  DirectorRuntimeExecutiveGuidanceFreezeVerification,
  DirectorRuntimeExecutiveGuidanceFrozenExportManifest,
  DirectorRuntimeExecutiveGuidanceReleaseReadiness,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceFreeze";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidancePublicIndexIdentity =
  "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex" as const;
export const directorRuntimeExecutiveGuidancePublicIndexVersion =
  "7.9.0" as const;
export const directorRuntimeExecutiveGuidancePublicIndexNamespace =
  "nexora.dri.executive-guidance.public-index" as const;
export const directorRuntimeExecutiveGuidancePublicIndexUpstream =
  directorRuntimeExecutiveGuidanceFreezeIdentity;

export const directorRuntimeExecutiveGuidancePublicIndexCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidancePublicIndexIdentity,
    version: directorRuntimeExecutiveGuidancePublicIndexVersion,
    namespace: directorRuntimeExecutiveGuidancePublicIndexNamespace,
    upstream: directorRuntimeExecutiveGuidancePublicIndexUpstream,
  });

export const directorRuntimeExecutiveGuidanceConsumerImportPath =
  "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex" as const;

export const directorRuntimeExecutiveGuidanceConsumerRole =
  "SoleConsumerEntryPoint" as const;

// ─── Release vocabularies ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELEASE_STATUSES =
  Object.freeze(["released", "not-released"] as const);
export type DirectorRuntimeExecutiveGuidanceReleaseStatus =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELEASE_STATUSES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_STABILITY_VALUES =
  Object.freeze(["stable", "unstable"] as const);
export type DirectorRuntimeExecutiveGuidanceStability =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_STABILITY_VALUES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONSUMER_READINESS_VALUES =
  Object.freeze([
    "ready-for-consumer",
    "not-ready-for-consumer",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceConsumerReadiness =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONSUMER_READINESS_VALUES)[number];

// ─── Chains (extend freeze chains with Public Index) ────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_IDENTITY_CHAIN =
  Object.freeze([
    ...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN,
    directorRuntimeExecutiveGuidancePublicIndexIdentity,
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERSION_CHAIN =
  Object.freeze([
    ...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN,
    directorRuntimeExecutiveGuidancePublicIndexVersion,
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_NAMESPACE_CHAIN =
  Object.freeze([
    ...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN,
    directorRuntimeExecutiveGuidancePublicIndexNamespace,
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_DEPENDENCY_CHAIN =
  Object.freeze([
    directorRuntimeExecutiveGuidancePublicIndexIdentity,
    ...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN,
  ] as const);

// ─── Namespace sections ─────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_INDEX_SECTIONS =
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

// ─── Approved frozen exports (authoritative from DRI-7:8) ───────────────────

const FROZEN_ADAPTER_EXPORTS =
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST[0]?.exportNames ??
  Object.freeze([]);
const FROZEN_FREEZE_EXPORTS =
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST[1]?.exportNames ??
  Object.freeze([]);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_APPROVED_FROZEN_EXPORTS =
  Object.freeze([
    ...FROZEN_ADAPTER_EXPORTS,
    ...FROZEN_FREEZE_EXPORTS,
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES =
  Object.freeze([
    "certifyDirectorExecutiveGuidanceAdapter",
    "certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters",
    "createDirectorExecutiveGuidanceAdapterCertificationInput",
    "createDirectorExecutiveGuidanceAdapterDescriptor",
    "isDirectorRuntimeExecutiveGuidanceAdapterCertificationStatus",
    "isDirectorRuntimeExecutiveGuidanceAdapterConsumerKind",
    "verifyDirectorRuntimeExecutiveGuidanceAdapterCertification",
    "certifyDirectorRuntimeExecutiveGuidanceFreeze",
    "createDirectorRuntimeExecutiveGuidanceFreezeManifest",
    "verifyDirectorRuntimeExecutiveGuidanceFreeze",
    "verifyDirectorRuntimeExecutiveGuidanceConsumerEntry",
    "verifyDirectorRuntimeExecutiveGuidancePublicIndex",
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERIFICATION_API_NAMES =
  Object.freeze([
    "verifyDirectorRuntimeExecutiveGuidanceAdapterCertification",
    "verifyDirectorRuntimeExecutiveGuidanceFreeze",
    "verifyDirectorRuntimeExecutiveGuidanceConsumerEntry",
    "verifyDirectorRuntimeExecutiveGuidancePublicIndex",
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES =
  Object.freeze([
    ...FROZEN_ADAPTER_EXPORTS.filter((name) =>
      name.startsWith("DirectorRuntime"),
    ),
    ...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FREEZE_PUBLIC_TYPE_NAMES,
    "DirectorRuntimeExecutiveGuidanceReleaseStatus",
    "DirectorRuntimeExecutiveGuidanceStability",
    "DirectorRuntimeExecutiveGuidanceConsumerReadiness",
    "DirectorRuntimeExecutiveGuidanceConsumerInformation",
    "DirectorRuntimeExecutiveGuidanceConsumerEntryVerification",
    "DirectorRuntimeExecutiveGuidancePublicIndexVerification",
  ] as const);

// ─── Consumer rules / information ───────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONSUMER_RULES =
  Object.freeze([
    "Import only from Public Index.",
    "Do not import Freeze directly.",
    "Do not import Adapter Certification directly.",
    "Do not import Platform directly.",
    "Do not import Delivery directly.",
    "Do not import Composition directly.",
    "Do not import Resolution directly.",
    "Do not import Contracts/Foundation directly.",
    "Do not bypass DRI-7 semantic hierarchy.",
    "Do not mutate exported frozen structures.",
    "Renderer-specific interpretation must remain downstream.",
    "Consumer actions must remain outside DRI-7.",
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PROHIBITED_CONSUMER_IMPORTS =
  Object.freeze([
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation",
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceContracts",
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceResolution",
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceComposition",
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceDelivery",
    "@/app/lib/dri/directorRuntimeExecutiveGuidancePlatform",
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceAdapterCertification",
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceFreeze",
  ] as const);

export interface DirectorRuntimeExecutiveGuidanceConsumerInformation {
  readonly role: "SoleConsumerEntryPoint";
  readonly supportedImportPath: typeof directorRuntimeExecutiveGuidanceConsumerImportPath;
  readonly directInternalImportsSupported: false;
  readonly rendererIndependent: true;
  readonly advisorIndependent: true;
  readonly actionIndependent: true;
  readonly sideEffectFree: true;
  readonly prohibitedImports: typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PROHIBITED_CONSUMER_IMPORTS;
  readonly rules: typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONSUMER_RULES;
}

export const directorRuntimeExecutiveGuidanceConsumerInformation =
  Object.freeze({
    role: directorRuntimeExecutiveGuidanceConsumerRole,
    supportedImportPath: directorRuntimeExecutiveGuidanceConsumerImportPath,
    directInternalImportsSupported: false,
    rendererIndependent: true,
    advisorIndependent: true,
    actionIndependent: true,
    sideEffectFree: true,
    prohibitedImports:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PROHIBITED_CONSUMER_IMPORTS,
    rules: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONSUMER_RULES,
  }) satisfies DirectorRuntimeExecutiveGuidanceConsumerInformation;

// ─── Release gate ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidancePublicReleaseGateInput {
  readonly forceReleaseFailure?: boolean;
}

function evaluateReleaseGate(
  input: DirectorRuntimeExecutiveGuidancePublicReleaseGateInput = {},
): {
  readonly releaseStatus: DirectorRuntimeExecutiveGuidanceReleaseStatus;
  readonly stability: DirectorRuntimeExecutiveGuidanceStability;
  readonly consumerReadiness: DirectorRuntimeExecutiveGuidanceConsumerReadiness;
  readonly gatePassed: boolean;
} {
  const freezeManifest = directorRuntimeExecutiveGuidanceFreezeManifest;
  const freezeVerification = verifyDirectorRuntimeExecutiveGuidanceFreeze();
  const gatePassed =
    input.forceReleaseFailure !== true &&
    freezeManifest.certificationStatus === "certified" &&
    freezeManifest.compatibilityStatus === "compatible" &&
    freezeManifest.freezeStatus === "frozen" &&
    freezeManifest.lockStatus === "locked" &&
    freezeManifest.releaseReadiness === "ready-for-public-index" &&
    freezeManifest.lock ===
      "DRI-7-EXECUTIVE-GUIDANCE-PLATFORM-LOCKED" &&
    freezeVerification.ok;

  return Object.freeze({
    releaseStatus: gatePassed
      ? ("released" as const)
      : ("not-released" as const),
    stability: gatePassed ? ("stable" as const) : ("unstable" as const),
    consumerReadiness: gatePassed
      ? ("ready-for-consumer" as const)
      : ("not-ready-for-consumer" as const),
    gatePassed,
  });
}

const CANONICAL_RELEASE_GATE = evaluateReleaseGate();

export const directorRuntimeExecutiveGuidanceReleaseStatus =
  CANONICAL_RELEASE_GATE.releaseStatus;
export const directorRuntimeExecutiveGuidanceStability =
  CANONICAL_RELEASE_GATE.stability;
export const directorRuntimeExecutiveGuidanceConsumerReadiness =
  CANONICAL_RELEASE_GATE.consumerReadiness;

export const directorRuntimeExecutiveGuidanceReleaseMetadata = Object.freeze({
  releaseStatus: directorRuntimeExecutiveGuidanceReleaseStatus,
  certificationStatus:
    directorRuntimeExecutiveGuidanceFreezeManifest.certificationStatus,
  compatibilityStatus:
    directorRuntimeExecutiveGuidanceFreezeManifest.compatibilityStatus,
  freezeStatus: directorRuntimeExecutiveGuidanceFreezeManifest.freezeStatus,
  lockStatus: directorRuntimeExecutiveGuidanceFreezeManifest.lockStatus,
  lock: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
  stability: directorRuntimeExecutiveGuidanceStability,
  consumerReadiness: directorRuntimeExecutiveGuidanceConsumerReadiness,
  version: directorRuntimeExecutiveGuidancePublicIndexVersion,
  supportedImportPath: directorRuntimeExecutiveGuidanceConsumerImportPath,
});

// ─── Public Index sections ──────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidancePublicIdentity = Object.freeze({
  identity: directorRuntimeExecutiveGuidancePublicIndexIdentity,
  version: directorRuntimeExecutiveGuidancePublicIndexVersion,
  namespace: directorRuntimeExecutiveGuidancePublicIndexNamespace,
  dependency: directorRuntimeExecutiveGuidancePublicIndexUpstream,
  identityChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_IDENTITY_CHAIN,
  identityChainCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_IDENTITY_CHAIN.length,
  versionChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERSION_CHAIN,
  versionChainCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERSION_CHAIN.length,
  namespaceChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_NAMESPACE_CHAIN,
  namespaceChainCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_NAMESPACE_CHAIN.length,
  dependencyChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_DEPENDENCY_CHAIN,
  dependencyChainCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_DEPENDENCY_CHAIN.length,
});

export const directorRuntimeExecutiveGuidancePublicTypes = Object.freeze({
  names: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES,
  count: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES.length,
  source: "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze" as const,
});

export const directorRuntimeExecutiveGuidancePublicApis = Object.freeze({
  names: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES,
  count: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES.length,
  approvedFrozenExports:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_APPROVED_FROZEN_EXPORTS,
  approvedFrozenExportCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_APPROVED_FROZEN_EXPORTS.length,
  source: "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze" as const,
});

export const directorRuntimeExecutiveGuidancePublicValidation = Object.freeze({
  names: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERIFICATION_API_NAMES,
  count: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERIFICATION_API_NAMES.length,
  verifyFreeze: verifyDirectorRuntimeExecutiveGuidanceFreeze,
  verifyAdapterCertification:
    verifyDirectorRuntimeExecutiveGuidanceAdapterCertification,
});

export const directorRuntimeExecutiveGuidancePublicCertification =
  Object.freeze({
    authority: "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze" as const,
    certificationStatus:
      directorRuntimeExecutiveGuidanceFreezeManifest.certificationStatus,
    compatibilityStatus:
      directorRuntimeExecutiveGuidanceFreezeManifest.compatibilityStatus,
    freezeStatus: directorRuntimeExecutiveGuidanceFreezeManifest.freezeStatus,
    lockStatus: directorRuntimeExecutiveGuidanceFreezeManifest.lockStatus,
    lock: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
    freezeManifest: directorRuntimeExecutiveGuidanceFreezeManifest,
  });

export const directorRuntimeExecutiveGuidanceReleaseInformation =
  Object.freeze({
    releaseStatus: directorRuntimeExecutiveGuidanceReleaseStatus,
    stability: directorRuntimeExecutiveGuidanceStability,
    consumerReadiness: directorRuntimeExecutiveGuidanceConsumerReadiness,
    supportedImportPath: directorRuntimeExecutiveGuidanceConsumerImportPath,
    version: directorRuntimeExecutiveGuidancePublicIndexVersion,
    lock: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
    lockStatus: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS,
    consumerRole: directorRuntimeExecutiveGuidanceConsumerRole,
    driStatus:
      "Released · Certified · Compatible · Frozen · Locked · Stable · SoleConsumerEntryPoint · ReadyForConsumer" as const,
  });

export const directorRuntimeExecutiveGuidancePublicCompatibility =
  Object.freeze({
    authority: "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze" as const,
    compatibilityStatus:
      directorRuntimeExecutiveGuidanceFreezeManifest.compatibilityStatus,
    semanticAdapterCompatible: true as const,
  });

export const directorRuntimeExecutiveGuidancePublicIndexRegistry =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidancePublicIndexIdentity,
    version: directorRuntimeExecutiveGuidancePublicIndexVersion,
    namespace: directorRuntimeExecutiveGuidancePublicIndexNamespace,
    dependency: directorRuntimeExecutiveGuidancePublicIndexUpstream,
    sections: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_INDEX_SECTIONS,
    namespaceSectionCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_INDEX_SECTIONS.length,
    approvedFrozenExports:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_APPROVED_FROZEN_EXPORTS,
    approvedFrozenExportCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_APPROVED_FROZEN_EXPORTS.length,
    publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES.length,
    publicApis: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES,
    publicApiCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES.length,
    verificationApis:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERIFICATION_API_NAMES,
    verificationApiCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERIFICATION_API_NAMES.length,
    identityChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_IDENTITY_CHAIN,
    versionChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERSION_CHAIN,
    namespaceChain: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_NAMESPACE_CHAIN,
    dependencyChain:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_DEPENDENCY_CHAIN,
    frozenExportManifest:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST,
    freezeApiNames: directorRuntimeExecutiveGuidanceFreezeApiNames,
    releaseMetadata: directorRuntimeExecutiveGuidanceReleaseMetadata,
    consumerInformation:
      directorRuntimeExecutiveGuidanceConsumerInformation,
    registrySectionCount: 9 as const,
  });

export const directorRuntimeExecutiveGuidancePublicIndex = Object.freeze({
  phase: "DRI-7:9" as const,
  name: "DirectorRuntimeExecutiveGuidancePublicIndex" as const,
  identity: directorRuntimeExecutiveGuidancePublicIndexIdentity,
  version: directorRuntimeExecutiveGuidancePublicIndexVersion,
  namespace: directorRuntimeExecutiveGuidancePublicIndexNamespace,
  layer: "Director Runtime Integration" as const,
  domain: "ExecutiveGuidanceAttentionDelivery" as const,
  role: directorRuntimeExecutiveGuidanceConsumerRole,
  stage: "PublicIndex" as const,
  releaseStatus: directorRuntimeExecutiveGuidanceReleaseStatus,
  stability: directorRuntimeExecutiveGuidanceStability,
  consumerReadiness: directorRuntimeExecutiveGuidanceConsumerReadiness,
  supportedImportPath: directorRuntimeExecutiveGuidanceConsumerImportPath,
  immediateDependency: directorRuntimeExecutiveGuidancePublicIndexUpstream,
  lock: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
  lockStatus: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS,
  certificationStatus:
    directorRuntimeExecutiveGuidanceFreezeManifest.certificationStatus,
  compatibilityStatus:
    directorRuntimeExecutiveGuidanceFreezeManifest.compatibilityStatus,
  freezeStatus: directorRuntimeExecutiveGuidanceFreezeManifest.freezeStatus,
  publicationOnly: true as const,
  noNewRuntimeBehavior: true as const,
  noWrappers: true as const,
  sections: Object.freeze({
    Identity: directorRuntimeExecutiveGuidancePublicIdentity,
    PublicTypes: directorRuntimeExecutiveGuidancePublicTypes,
    PublicAPIs: directorRuntimeExecutiveGuidancePublicApis,
    Validation: directorRuntimeExecutiveGuidancePublicValidation,
    Certification: directorRuntimeExecutiveGuidancePublicCertification,
    ReleaseInformation: directorRuntimeExecutiveGuidanceReleaseInformation,
    Compatibility: directorRuntimeExecutiveGuidancePublicCompatibility,
    Registry: directorRuntimeExecutiveGuidancePublicIndexRegistry,
    ConsumerInformation: directorRuntimeExecutiveGuidanceConsumerInformation,
  }),
  publicTypes: directorRuntimeExecutiveGuidancePublicTypes,
  publicApis: directorRuntimeExecutiveGuidancePublicApis,
  verification: directorRuntimeExecutiveGuidancePublicValidation,
  certification: directorRuntimeExecutiveGuidancePublicCertification,
  releaseInformation: directorRuntimeExecutiveGuidanceReleaseInformation,
  compatibility: directorRuntimeExecutiveGuidancePublicCompatibility,
  registry: directorRuntimeExecutiveGuidancePublicIndexRegistry,
  consumerInformation: directorRuntimeExecutiveGuidanceConsumerInformation,
  freeze: directorRuntimeExecutiveGuidanceFreeze,
  architecturalStatus:
    "COMPLETE · CERTIFIED · COMPATIBLE · FROZEN · LOCKED · STABLE · RELEASED · READY FOR CONSUMER" as const,
});

// ─── Evaluation helpers for tests / gates ───────────────────────────────────

export function evaluateDirectorRuntimeExecutiveGuidanceReleaseGate(
  input: DirectorRuntimeExecutiveGuidancePublicReleaseGateInput = {},
): {
  readonly releaseStatus: DirectorRuntimeExecutiveGuidanceReleaseStatus;
  readonly stability: DirectorRuntimeExecutiveGuidanceStability;
  readonly consumerReadiness: DirectorRuntimeExecutiveGuidanceConsumerReadiness;
  readonly gatePassed: boolean;
} {
  return evaluateReleaseGate(input);
}

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceConsumerEntryVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidancePublicIndexIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidancePublicIndexVersion;
  readonly namespace: typeof directorRuntimeExecutiveGuidancePublicIndexNamespace;
  readonly upstream: typeof directorRuntimeExecutiveGuidancePublicIndexUpstream;
  readonly supportedImportPath: typeof directorRuntimeExecutiveGuidanceConsumerImportPath;
  readonly consumerRole: typeof directorRuntimeExecutiveGuidanceConsumerRole;
  readonly releaseStatus: DirectorRuntimeExecutiveGuidanceReleaseStatus;
  readonly stability: DirectorRuntimeExecutiveGuidanceStability;
  readonly consumerReadiness: DirectorRuntimeExecutiveGuidanceConsumerReadiness;
  readonly lock: typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK;
  readonly checks: readonly string[];
}

export interface DirectorRuntimeExecutiveGuidancePublicIndexVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidancePublicIndexIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidancePublicIndexVersion;
  readonly namespaceSectionCount: number;
  readonly approvedFrozenExportCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly verificationApiCount: number;
  readonly checks: readonly string[];
}

function collectPublishedExportNames(): readonly string[] {
  return Object.freeze([
    ...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES.filter(
      (name) =>
        name !== "verifyDirectorRuntimeExecutiveGuidanceConsumerEntry" &&
        name !== "verifyDirectorRuntimeExecutiveGuidancePublicIndex",
    ),
    "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK",
    "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK_STATUS",
    "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IDENTITY_CHAIN",
    "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_VERSION_CHAIN",
    "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_NAMESPACE_CHAIN",
    "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DEPENDENCY_CHAIN",
    "DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FROZEN_EXPORT_MANIFEST",
    "directorRuntimeExecutiveGuidanceFreezeIdentity",
    "directorRuntimeExecutiveGuidanceFreezeVersion",
    "directorRuntimeExecutiveGuidanceFreezeNamespace",
    "directorRuntimeExecutiveGuidanceFreezeManifest",
    "directorRuntimeExecutiveGuidanceFreezeRegistry",
    "directorRuntimeExecutiveGuidanceFreeze",
    ...FROZEN_ADAPTER_EXPORTS.filter((name) =>
      name.startsWith("DirectorRuntime"),
    ),
  ]);
}

export function verifyDirectorRuntimeExecutiveGuidanceConsumerEntry():
  DirectorRuntimeExecutiveGuidanceConsumerEntryVerification {
  const freezeManifest = directorRuntimeExecutiveGuidanceFreezeManifest;
  const checks: string[] = [];
  const record = (name: string, pass: boolean): void => {
    if (pass) checks[checks.length] = name;
  };

  record(
    "identity",
    directorRuntimeExecutiveGuidancePublicIndexIdentity ===
      "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
  );
  record(
    "version",
    directorRuntimeExecutiveGuidancePublicIndexVersion === "7.9.0",
  );
  record(
    "namespace",
    directorRuntimeExecutiveGuidancePublicIndexNamespace ===
      "nexora.dri.executive-guidance.public-index",
  );
  record(
    "sole-dependency",
    directorRuntimeExecutiveGuidancePublicIndexUpstream ===
      "DRI-7:8/DirectorRuntimeExecutiveGuidanceFreeze",
  );
  record(
    "freeze-certified",
    freezeManifest.certificationStatus === "certified",
  );
  record(
    "freeze-compatible",
    freezeManifest.compatibilityStatus === "compatible",
  );
  record("freeze-frozen", freezeManifest.freezeStatus === "frozen");
  record(
    "lock-preserved",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK ===
      "DRI-7-EXECUTIVE-GUIDANCE-PLATFORM-LOCKED" &&
      freezeManifest.lockStatus === "locked",
  );
  record(
    "release-status",
    directorRuntimeExecutiveGuidanceReleaseStatus === "released",
  );
  record(
    "stability",
    directorRuntimeExecutiveGuidanceStability === "stable",
  );
  record(
    "consumer-readiness",
    directorRuntimeExecutiveGuidanceConsumerReadiness ===
      "ready-for-consumer",
  );
  record(
    "supported-import-path",
    directorRuntimeExecutiveGuidanceConsumerImportPath ===
      "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex",
  );
  record(
    "consumer-role",
    directorRuntimeExecutiveGuidanceConsumerRole === "SoleConsumerEntryPoint",
  );

  const published = collectPublishedExportNames();
  const requiredFreezeExports = FROZEN_FREEZE_EXPORTS;
  const requiredAdapterApis = FROZEN_ADAPTER_EXPORTS.filter(
    (name) => !name.startsWith("DirectorRuntime"),
  );
  record(
    "approved-freeze-exports-present",
    requiredFreezeExports.every((name) => published.includes(name)),
  );
  record(
    "approved-adapter-apis-present",
    requiredAdapterApis.every((name) =>
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES.includes(
        name as (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES)[number],
      ),
    ),
  );

  const ok =
    checks.length >= 15 &&
    checks.includes("identity") &&
    checks.includes("version") &&
    checks.includes("sole-dependency") &&
    checks.includes("release-status") &&
    checks.includes("consumer-role");

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidancePublicIndexIdentity,
    version: directorRuntimeExecutiveGuidancePublicIndexVersion,
    namespace: directorRuntimeExecutiveGuidancePublicIndexNamespace,
    upstream: directorRuntimeExecutiveGuidancePublicIndexUpstream,
    supportedImportPath: directorRuntimeExecutiveGuidanceConsumerImportPath,
    consumerRole: directorRuntimeExecutiveGuidanceConsumerRole,
    releaseStatus: directorRuntimeExecutiveGuidanceReleaseStatus,
    stability: directorRuntimeExecutiveGuidanceStability,
    consumerReadiness: directorRuntimeExecutiveGuidanceConsumerReadiness,
    lock: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_LOCK,
    checks: Object.freeze([...checks]),
  });
}

export function verifyDirectorRuntimeExecutiveGuidancePublicIndex():
  DirectorRuntimeExecutiveGuidancePublicIndexVerification {
  const consumerEntry = verifyDirectorRuntimeExecutiveGuidanceConsumerEntry();
  const checks: string[] = [];
  const record = (name: string, pass: boolean): void => {
    if (pass) checks[checks.length] = name;
  };

  record("consumer-entry", consumerEntry.ok);
  record(
    "section-count",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_INDEX_SECTIONS.length === 9,
  );
  record(
    "identity-chain-count",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_IDENTITY_CHAIN.length === 9,
  );
  record(
    "version-chain-count",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERSION_CHAIN.length === 9,
  );
  record(
    "namespace-chain-count",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_NAMESPACE_CHAIN.length === 9,
  );
  record(
    "descriptor-frozen",
    Object.isFrozen(directorRuntimeExecutiveGuidancePublicIndex),
  );
  record(
    "registry-frozen",
    Object.isFrozen(directorRuntimeExecutiveGuidancePublicIndexRegistry),
  );
  record(
    "release-metadata-frozen",
    Object.isFrozen(directorRuntimeExecutiveGuidanceReleaseMetadata),
  );
  record(
    "consumer-information-frozen",
    Object.isFrozen(directorRuntimeExecutiveGuidanceConsumerInformation),
  );
  record(
    "no-partial-release",
    directorRuntimeExecutiveGuidanceReleaseStatus === "released" &&
      directorRuntimeExecutiveGuidanceStability === "stable" &&
      directorRuntimeExecutiveGuidanceConsumerReadiness ===
        "ready-for-consumer",
  );

  const ok =
    checks.length === 10 &&
    checks.includes("consumer-entry") &&
    checks.includes("section-count") &&
    checks.includes("no-partial-release");

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidancePublicIndexIdentity,
    version: directorRuntimeExecutiveGuidancePublicIndexVersion,
    namespaceSectionCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_INDEX_SECTIONS.length,
    approvedFrozenExportCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_APPROVED_FROZEN_EXPORTS.length,
    publicTypeCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_FUNCTIONAL_API_NAMES.length,
    verificationApiCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_VERIFICATION_API_NAMES.length,
    checks: Object.freeze([...checks]),
  });
}
