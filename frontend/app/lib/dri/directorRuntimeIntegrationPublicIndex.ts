/**
 * DRI-1:9 — Director Runtime Integration Public Index
 *
 * The sole supported consumer publication boundary for the frozen DRI-1 Platform.
 * This module adds no integration behavior; every functional export is the exact
 * symbol approved by DRI-1:8.
 */

import {
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS,
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_STATUSES,
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_STATUSES,
  createDirectorRuntimeIntegrationPlatform,
  createDirectorRuntimeIntegrationPlatformCapability,
  directorRuntimeIntegrationFreezeCompatibility,
  directorRuntimeIntegrationFreezeRegistry,
  directorRuntimeIntegrationFrozenIdentityChain,
  directorRuntimeIntegrationFrozenPlatformLimitations,
  directorRuntimeIntegrationFrozenPublicApiSurface,
  directorRuntimeIntegrationPlatform,
  directorRuntimeIntegrationPlatformCapabilityRegistry,
  directorRuntimeIntegrationPlatformCapabilityRegistryCount,
  directorRuntimeIntegrationPlatformCompatibility,
  directorRuntimeIntegrationPlatformConsumerInformation,
  directorRuntimeIntegrationPlatformGuaranteeCount,
  directorRuntimeIntegrationPlatformGuarantees,
  directorRuntimeIntegrationPlatformIdentity,
  directorRuntimeIntegrationPlatformIdentityChain,
  directorRuntimeIntegrationPlatformIdentityChainCount,
  directorRuntimeIntegrationPlatformLimitationCount,
  directorRuntimeIntegrationPlatformLimitations,
  directorRuntimeIntegrationPlatformMetadata,
  directorRuntimeIntegrationPlatformNamespace,
  directorRuntimeIntegrationPlatformRegistry,
  directorRuntimeIntegrationPlatformRegistryCount,
  directorRuntimeIntegrationPlatformUpstream,
  directorRuntimeIntegrationPlatformVersion,
  directorRuntimeIntegrationPlatformFreeze,
  directorRuntimeIntegrationPlatformFreezeIdentity,
  directorRuntimeIntegrationPlatformFreezeVersion,
  directorRuntimeIntegrationPlatformLock,
  findBlockedDirectorRuntimeIntegrationPlatformCapabilities,
  findDirectorRuntimeIntegrationPlatformCapabilityById,
  findDirectorRuntimeIntegrationPlatformCapabilityByKind,
  findLimitedDirectorRuntimeIntegrationPlatformCapabilities,
  findRequiredDirectorRuntimeIntegrationPlatformCapabilities,
  getDirectorRuntimeIntegrationPlatformRegistry,
  isDirectorRuntimeIntegrationPlatformCapabilityAvailable,
  resolveDirectorRuntimeIntegrationPlatformCapabilities,
  resolveDirectorRuntimeIntegrationPlatformReadiness,
  verifyDirectorRuntimeIntegrationPlatform,
  verifyDirectorRuntimeIntegrationPlatformFreeze,
  type DirectorRuntimeIntegrationPlatformFreeze,
} from "./directorRuntimeIntegrationPlatformFreeze.ts";

// Exact DRI-1:8-approved publication. Do not wrap or rename these symbols.
export {
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS,
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_STATUSES,
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_STATUSES,
  createDirectorRuntimeIntegrationPlatform,
  createDirectorRuntimeIntegrationPlatformCapability,
  directorRuntimeIntegrationPlatform,
  directorRuntimeIntegrationPlatformCapabilityRegistry,
  directorRuntimeIntegrationPlatformCapabilityRegistryCount,
  directorRuntimeIntegrationPlatformCompatibility,
  directorRuntimeIntegrationPlatformConsumerInformation,
  directorRuntimeIntegrationPlatformGuaranteeCount,
  directorRuntimeIntegrationPlatformGuarantees,
  directorRuntimeIntegrationPlatformIdentity,
  directorRuntimeIntegrationPlatformIdentityChain,
  directorRuntimeIntegrationPlatformIdentityChainCount,
  directorRuntimeIntegrationPlatformLimitationCount,
  directorRuntimeIntegrationPlatformLimitations,
  directorRuntimeIntegrationPlatformMetadata,
  directorRuntimeIntegrationPlatformNamespace,
  directorRuntimeIntegrationPlatformRegistry,
  directorRuntimeIntegrationPlatformRegistryCount,
  directorRuntimeIntegrationPlatformUpstream,
  directorRuntimeIntegrationPlatformVersion,
  findBlockedDirectorRuntimeIntegrationPlatformCapabilities,
  findDirectorRuntimeIntegrationPlatformCapabilityById,
  findDirectorRuntimeIntegrationPlatformCapabilityByKind,
  findLimitedDirectorRuntimeIntegrationPlatformCapabilities,
  findRequiredDirectorRuntimeIntegrationPlatformCapabilities,
  getDirectorRuntimeIntegrationPlatformRegistry,
  isDirectorRuntimeIntegrationPlatformCapabilityAvailable,
  resolveDirectorRuntimeIntegrationPlatformCapabilities,
  resolveDirectorRuntimeIntegrationPlatformReadiness,
  verifyDirectorRuntimeIntegrationPlatform,
};
export type {
  DirectorRuntimeIntegrationPlatform,
  DirectorRuntimeIntegrationPlatformCapability,
  DirectorRuntimeIntegrationPlatformCapabilityKind,
  DirectorRuntimeIntegrationPlatformCapabilityStatus,
  DirectorRuntimeIntegrationPlatformComposition,
  DirectorRuntimeIntegrationPlatformConsumerInformation,
  DirectorRuntimeIntegrationPlatformInput,
  DirectorRuntimeIntegrationPlatformManifest,
  DirectorRuntimeIntegrationPlatformReadiness,
  DirectorRuntimeIntegrationPlatformStatus,
} from "./directorRuntimeIntegrationPlatformFreeze.ts";

export const directorRuntimeIntegrationPublicIndexIdentity =
  "DRI-1:9/DirectorRuntimeIntegrationPublicIndex" as const;
export const directorRuntimeIntegrationPublicIndexVersion = "1.9.0" as const;
export const directorRuntimeIntegrationPublicIndexNamespace =
  "nexora.dri.runtime.integration.public-index" as const;
export const directorRuntimeIntegrationPublicIndexUpstream =
  directorRuntimeIntegrationPlatformFreezeIdentity;
export const directorRuntimeIntegrationConsumerEntryPath =
  "@/app/lib/dri/directorRuntimeIntegrationPublicIndex" as const;

export interface DirectorRuntimeIntegrationConsumerEntry {
  readonly module: "@/app/lib/dri/directorRuntimeIntegrationPublicIndex";
  readonly role: "SoleConsumerEntryPoint";
  readonly phase: "DRI-1";
  readonly readiness: "ReadyForConsumer";
}

export const directorRuntimeIntegrationConsumerEntry = Object.freeze({
  module: directorRuntimeIntegrationConsumerEntryPath,
  role: "SoleConsumerEntryPoint" as const,
  phase: "DRI-1" as const,
  readiness: "ReadyForConsumer" as const,
});

export interface DirectorRuntimeIntegrationPublicIndexManifest {
  readonly publicIndexId: "DRI-1:9/DirectorRuntimeIntegrationPublicIndex";
  readonly version: "1.9.0";
  readonly namespace: "nexora.dri.runtime.integration.public-index";
  readonly layer: "DRI";
  readonly phase: "DRI-1";
  readonly stage: "PublicIndex";
  readonly status: "Released";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly upstreamIdentity: "DRI-1:8/DirectorRuntimeIntegrationPlatformFreeze";
  readonly consumerRole: "SoleConsumerEntryPoint";
  readonly integrationDirection: "runtime-to-director";
}

export const directorRuntimeIntegrationPublicIndexManifest = Object.freeze({
  publicIndexId: directorRuntimeIntegrationPublicIndexIdentity,
  version: directorRuntimeIntegrationPublicIndexVersion,
  namespace: directorRuntimeIntegrationPublicIndexNamespace,
  layer: "DRI" as const,
  phase: "DRI-1" as const,
  stage: "PublicIndex" as const,
  status: "Released" as const,
  stability: "Stable" as const,
  readiness: "ReadyForConsumer" as const,
  upstreamIdentity: directorRuntimeIntegrationPlatformFreezeIdentity,
  consumerRole: "SoleConsumerEntryPoint" as const,
  integrationDirection: "runtime-to-director" as const,
}) satisfies DirectorRuntimeIntegrationPublicIndexManifest;

export const directorRuntimeIntegrationPublicIdentityChain = Object.freeze([
  ...directorRuntimeIntegrationFrozenIdentityChain,
  directorRuntimeIntegrationPublicIndexIdentity,
] as const);
export const directorRuntimeIntegrationPublicIdentityChainCount =
  directorRuntimeIntegrationPublicIdentityChain.length;

export const DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_NAMESPACE_SECTIONS = Object.freeze([
  "Identity", "Public Types", "Public APIs", "Validation", "Certification",
  "Release Information", "Compatibility", "Registry", "Consumer Information",
] as const);
export const directorRuntimeIntegrationPublicNamespaceSectionCount =
  DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_NAMESPACE_SECTIONS.length;

export const directorRuntimeIntegrationPublicTypeNames = Object.freeze(
  directorRuntimeIntegrationFrozenPublicApiSurface
    .filter(({ exportKind }) => exportKind === "type")
    .map(({ exportName }) => exportName),
);
export const directorRuntimeIntegrationPublicTypeCount =
  directorRuntimeIntegrationPublicTypeNames.length;
export const directorRuntimeIntegrationPublicApiNames = Object.freeze(
  directorRuntimeIntegrationFrozenPublicApiSurface
    .filter(({ exportKind }) => exportKind === "api")
    .map(({ exportName }) => exportName),
);
export const directorRuntimeIntegrationPublicApiCount =
  directorRuntimeIntegrationPublicApiNames.length;

export type DirectorRuntimeIntegrationPublicExportCategory =
  "type" | "value" | "api" | "metadata" | "registry";
export interface DirectorRuntimeIntegrationPublicApiRegistryEntry {
  readonly exportName: string;
  readonly exportCategory: DirectorRuntimeIntegrationPublicExportCategory;
  readonly sourceFrozenIdentity: "DRI-1:8/DirectorRuntimeIntegrationPlatformFreeze";
  readonly consumerAvailability: "public";
  readonly stability: "stable";
  readonly deprecated: false;
}

export const directorRuntimeIntegrationPublicApiRegistry = Object.freeze(
  directorRuntimeIntegrationFrozenPublicApiSurface.map(({ exportName, exportKind }) => Object.freeze({
    exportName,
    exportCategory: exportKind,
    sourceFrozenIdentity: directorRuntimeIntegrationPlatformFreezeIdentity,
    consumerAvailability: "public" as const,
    stability: "stable" as const,
    deprecated: false as const,
  })),
);
export const directorRuntimeIntegrationPublicApiRegistryCount =
  directorRuntimeIntegrationPublicApiRegistry.length;
export const directorRuntimeIntegrationPublicExportCount =
  directorRuntimeIntegrationPublicApiRegistry.length;

export const directorRuntimeIntegrationConsumerGuarantees = Object.freeze([
  "sole-supported-dri-1-entry", "frozen-upstream-surface",
  "exact-symbol-identity-preserved", "runtime-authority-preserved",
  "runtime-to-director-direction", "immutable-public-contracts",
  "deterministic-mapping", "explicit-binding-lifecycle",
  "explicit-conflict-detection", "structured-validation", "derived-certification",
  "certified-platform-composition", "stable-registry-order",
  "caller-identities-preserved", "caller-inputs-not-mutated",
  "no-business-semantics", "no-live-synchronization", "no-rendering-dependency",
  "no-reverse-runtime-authority",
] as const);
export const directorRuntimeIntegrationConsumerGuaranteeCount =
  directorRuntimeIntegrationConsumerGuarantees.length;

export const directorRuntimeIntegrationConsumerProhibitions = Object.freeze([
  "no-direct-foundation-import", "no-direct-contracts-import",
  "no-direct-mapping-import", "no-direct-binding-import",
  "no-direct-validation-import", "no-direct-certification-import",
  "no-direct-platform-import", "no-direct-freeze-import", "no-registry-mutation",
  "no-reverse-runtime-authority", "no-live-sync-through-dri-1",
  "no-rendering-through-dri-1", "no-kpi-calculation-through-dri-1",
  "no-business-evaluation-through-dri-1", "no-wrapper-semantic-changes",
] as const);
export const directorRuntimeIntegrationConsumerProhibitionCount =
  directorRuntimeIntegrationConsumerProhibitions.length;

export const directorRuntimeIntegrationPublicCompatibility = Object.freeze({
  phase: "DRI-1" as const,
  platformVersion: directorRuntimeIntegrationPlatformVersion,
  freezeVersion: directorRuntimeIntegrationPlatformFreezeVersion,
  publicIndexVersion: directorRuntimeIntegrationPublicIndexVersion,
  requiredUpstream: directorRuntimeIntegrationPlatformFreezeIdentity,
  integrationDirection: "runtime-to-director" as const,
  runtimeAuthorityRequired: true as const,
  liveSynchronizationSupported: false as const,
  renderingSupported: false as const,
  reverseWriteBackSupported: false as const,
  readyForConsumer: true as const,
});

export const directorRuntimeIntegrationReleaseInformation = Object.freeze({
  releaseStatus: "Released" as const,
  certificationStatus: "Certified" as const,
  freezeState: "Frozen" as const,
  stability: "Stable" as const,
  readiness: "ReadyForConsumer" as const,
  lockState: "Locked" as const,
  consumerRole: "SoleConsumerEntryPoint" as const,
  breakingChangesAllowedWithinDri1: false as const,
  liveSynchronizationSupported: false as const,
  renderingSupported: false as const,
  reverseWriteBackSupported: false as const,
  businessEvaluationSupported: false as const,
});

export const directorRuntimeIntegrationRuntimeAuthority = Object.freeze({
  runtime: "authoritative operational and business state" as const,
  dri: "certified integration-description boundary" as const,
  director: "presentation and interaction representation" as const,
});

export const directorRuntimeIntegrationConsumerInformation = Object.freeze({
  entryModule: directorRuntimeIntegrationConsumerEntryPath,
  role: "SoleConsumerEntryPoint" as const,
  readiness: "ReadyForConsumer" as const,
  allowedConsumerCapabilities: DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS,
  prohibitedDirectImports: Object.freeze([
    "directorRuntimeIntegrationFoundation", "directorRuntimeIntegrationContracts",
    "directorRuntimeIntegrationMapping", "directorRuntimeIntegrationBinding",
    "directorRuntimeIntegrationValidation", "directorRuntimeIntegrationCertification",
    "directorRuntimeIntegrationPlatform", "directorRuntimeIntegrationPlatformFreeze",
  ] as const),
  guarantees: directorRuntimeIntegrationConsumerGuarantees,
  limitations: directorRuntimeIntegrationFrozenPlatformLimitations,
  verificationRequirements: Object.freeze([
    "verify frozen upstream", "verify exact public surface",
    "preserve Runtime authority", "preserve runtime-to-director direction",
  ] as const),
});

export const directorRuntimeIntegrationPublicRegistry = Object.freeze([
  "Foundation Registry", "Contracts Registry", "Mapping Registry", "Binding Registry",
  "Validation Registry", "Certification Registry", "Platform Registry", "Freeze Registry",
  "Public Index Namespace Registry", "Frozen Public API Registry",
  "Consumer Guarantee Registry", "Consumer Prohibition Registry",
].map((concept, index) => Object.freeze({ order: index + 1, concept })));
export const directorRuntimeIntegrationPublicRegistryCount =
  directorRuntimeIntegrationPublicRegistry.length;

const frozenRuntimeSymbols: Readonly<Record<string, unknown>> = Object.freeze({
  directorRuntimeIntegrationPlatformIdentity, directorRuntimeIntegrationPlatformVersion,
  directorRuntimeIntegrationPlatformNamespace, directorRuntimeIntegrationPlatformMetadata,
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_STATUSES,
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS,
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_STATUSES,
  directorRuntimeIntegrationPlatformIdentityChain,
  directorRuntimeIntegrationPlatformIdentityChainCount,
  directorRuntimeIntegrationPlatformGuarantees, directorRuntimeIntegrationPlatformGuaranteeCount,
  directorRuntimeIntegrationPlatformLimitations, directorRuntimeIntegrationPlatformLimitationCount,
  directorRuntimeIntegrationPlatformCompatibility,
  directorRuntimeIntegrationPlatformConsumerInformation,
  directorRuntimeIntegrationPlatformCapabilityRegistry,
  directorRuntimeIntegrationPlatformCapabilityRegistryCount,
  directorRuntimeIntegrationPlatformRegistry, directorRuntimeIntegrationPlatformRegistryCount,
  directorRuntimeIntegrationPlatform, createDirectorRuntimeIntegrationPlatformCapability,
  resolveDirectorRuntimeIntegrationPlatformCapabilities,
  resolveDirectorRuntimeIntegrationPlatformReadiness, createDirectorRuntimeIntegrationPlatform,
  findDirectorRuntimeIntegrationPlatformCapabilityById,
  findDirectorRuntimeIntegrationPlatformCapabilityByKind,
  findBlockedDirectorRuntimeIntegrationPlatformCapabilities,
  findLimitedDirectorRuntimeIntegrationPlatformCapabilities,
  findRequiredDirectorRuntimeIntegrationPlatformCapabilities,
  isDirectorRuntimeIntegrationPlatformCapabilityAvailable,
  getDirectorRuntimeIntegrationPlatformRegistry, verifyDirectorRuntimeIntegrationPlatform,
});

export const DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_INDEX_ISSUE_CODES = Object.freeze([
  "DRI_PUBLIC_INDEX_VALID", "DRI_PUBLIC_INDEX_IDENTITY_INVALID",
  "DRI_PUBLIC_INDEX_VERSION_INVALID", "DRI_PUBLIC_INDEX_NAMESPACE_INVALID",
  "DRI_PUBLIC_INDEX_UPSTREAM_INVALID", "DRI_PUBLIC_INDEX_FREEZE_INVALID",
  "DRI_PUBLIC_INDEX_LOCK_INVALID", "DRI_PUBLIC_INDEX_CHAIN_INVALID",
  "DRI_PUBLIC_INDEX_NAMESPACE_SECTIONS_INVALID", "DRI_PUBLIC_INDEX_EXPORT_MISSING",
  "DRI_PUBLIC_INDEX_EXPORT_UNAPPROVED", "DRI_PUBLIC_INDEX_EXPORT_DUPLICATE",
  "DRI_PUBLIC_INDEX_SYMBOL_IDENTITY_INVALID", "DRI_PUBLIC_INDEX_VALIDATION_INVALID",
  "DRI_PUBLIC_INDEX_CERTIFICATION_INVALID", "DRI_PUBLIC_INDEX_COMPATIBILITY_INVALID",
  "DRI_PUBLIC_INDEX_REGISTRY_INVALID", "DRI_PUBLIC_INDEX_AUTHORITY_INVALID",
  "DRI_PUBLIC_INDEX_DIRECTION_INVALID", "DRI_PUBLIC_INDEX_CONSUMER_RULE_INVALID",
  "DRI_PUBLIC_INDEX_FORBIDDEN_BEHAVIOR",
] as const);
export type DirectorRuntimeIntegrationPublicIndexIssueCode =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_INDEX_ISSUE_CODES)[number];

export interface DirectorRuntimeIntegrationPublicIndexCandidate {
  readonly manifest: DirectorRuntimeIntegrationPublicIndexManifest;
  readonly freeze: DirectorRuntimeIntegrationPlatformFreeze;
  readonly lockId: string;
  readonly identityChain: readonly string[];
  readonly namespaceSections: readonly string[];
  readonly publicApiRegistry: readonly DirectorRuntimeIntegrationPublicApiRegistryEntry[];
  readonly runtimeSymbols: Readonly<Record<string, unknown>>;
  readonly compatibility: typeof directorRuntimeIntegrationPublicCompatibility;
  readonly registry: readonly { readonly order: number; readonly concept: string }[];
  readonly guarantees: readonly string[];
  readonly prohibitions: readonly string[];
  readonly authority: typeof directorRuntimeIntegrationRuntimeAuthority;
  readonly entry: DirectorRuntimeIntegrationConsumerEntry;
  readonly forbiddenBehavior: boolean;
}

export interface DirectorRuntimeIntegrationConsumerVerification {
  readonly valid: boolean;
  readonly readyForConsumer: boolean;
  readonly identityValid: boolean;
  readonly freezeValid: boolean;
  readonly publicSurfaceValid: boolean;
  readonly registryValid: boolean;
  readonly authorityValid: boolean;
  readonly directionValid: boolean;
  readonly consumerRulesValid: boolean;
  readonly issueCodes: readonly DirectorRuntimeIntegrationPublicIndexIssueCode[];
}

function exactStrings(actual: readonly string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

export const directorRuntimeIntegrationCanonicalPublicIndexCandidate = Object.freeze({
  manifest: directorRuntimeIntegrationPublicIndexManifest,
  freeze: directorRuntimeIntegrationPlatformFreeze,
  lockId: directorRuntimeIntegrationPlatformLock.lockId,
  identityChain: directorRuntimeIntegrationPublicIdentityChain,
  namespaceSections: DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_NAMESPACE_SECTIONS,
  publicApiRegistry: directorRuntimeIntegrationPublicApiRegistry,
  runtimeSymbols: frozenRuntimeSymbols,
  compatibility: directorRuntimeIntegrationPublicCompatibility,
  registry: directorRuntimeIntegrationPublicRegistry,
  guarantees: directorRuntimeIntegrationConsumerGuarantees,
  prohibitions: directorRuntimeIntegrationConsumerProhibitions,
  authority: directorRuntimeIntegrationRuntimeAuthority,
  entry: directorRuntimeIntegrationConsumerEntry,
  forbiddenBehavior: false,
}) satisfies DirectorRuntimeIntegrationPublicIndexCandidate;

export function verifyDirectorRuntimeIntegrationConsumerEntry(
  candidate: DirectorRuntimeIntegrationPublicIndexCandidate =
    directorRuntimeIntegrationCanonicalPublicIndexCandidate,
): DirectorRuntimeIntegrationConsumerVerification {
  const issues: DirectorRuntimeIntegrationPublicIndexIssueCode[] = [];
  const { manifest } = candidate;
  const identityValid = manifest.publicIndexId === directorRuntimeIntegrationPublicIndexIdentity &&
    manifest.layer === "DRI" && manifest.phase === "DRI-1" && manifest.stage === "PublicIndex" &&
    manifest.status === "Released" && manifest.stability === "Stable" &&
    manifest.readiness === "ReadyForConsumer" && manifest.consumerRole === "SoleConsumerEntryPoint";
  if (!identityValid) issues.push("DRI_PUBLIC_INDEX_IDENTITY_INVALID");
  if (manifest.version !== "1.9.0") issues.push("DRI_PUBLIC_INDEX_VERSION_INVALID");
  if (manifest.namespace !== "nexora.dri.runtime.integration.public-index") {
    issues.push("DRI_PUBLIC_INDEX_NAMESPACE_INVALID");
  }
  if (manifest.upstreamIdentity !== directorRuntimeIntegrationPlatformFreezeIdentity) {
    issues.push("DRI_PUBLIC_INDEX_UPSTREAM_INVALID");
  }
  const freezeValid = candidate.freeze.state === "frozen" &&
    candidate.freeze.manifest.releaseStatus === "released" &&
    candidate.freeze.manifest.stabilityStatus === "stable" &&
    candidate.freeze.manifest.readiness === "ReadyForPublicIndex" &&
    candidate.freeze.lock.locked && verifyDirectorRuntimeIntegrationPlatformFreeze(candidate.freeze);
  if (!freezeValid) issues.push("DRI_PUBLIC_INDEX_FREEZE_INVALID");
  if (candidate.lockId !== "DRI-1-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED") {
    issues.push("DRI_PUBLIC_INDEX_LOCK_INVALID");
  }
  if (!exactStrings(candidate.identityChain, directorRuntimeIntegrationPublicIdentityChain) ||
    new Set(candidate.identityChain).size !== candidate.identityChain.length) {
    issues.push("DRI_PUBLIC_INDEX_CHAIN_INVALID");
  }
  if (!exactStrings(candidate.namespaceSections, DIRECTOR_RUNTIME_INTEGRATION_PUBLIC_NAMESPACE_SECTIONS)) {
    issues.push("DRI_PUBLIC_INDEX_NAMESPACE_SECTIONS_INVALID");
  }
  const names = candidate.publicApiRegistry.map(({ exportName }) => exportName);
  const expectedNames = directorRuntimeIntegrationFrozenPublicApiSurface.map(({ exportName }) => exportName);
  if (expectedNames.some((name) => !names.includes(name))) issues.push("DRI_PUBLIC_INDEX_EXPORT_MISSING");
  if (names.some((name) => !expectedNames.includes(name))) issues.push("DRI_PUBLIC_INDEX_EXPORT_UNAPPROVED");
  if (new Set(names).size !== names.length) issues.push("DRI_PUBLIC_INDEX_EXPORT_DUPLICATE");
  const orderAndMetadataValid = names.length === expectedNames.length && names.every((name, index) =>
    name === expectedNames[index] && candidate.publicApiRegistry[index]?.exportCategory ===
      directorRuntimeIntegrationFrozenPublicApiSurface[index]?.exportKind);
  const symbolIdentityValid = Object.entries(frozenRuntimeSymbols)
    .every(([name, symbol]) => candidate.runtimeSymbols[name] === symbol);
  if (!symbolIdentityValid) issues.push("DRI_PUBLIC_INDEX_SYMBOL_IDENTITY_INVALID");
  const validationValid = candidate.freeze.platform.capabilities.some(({ kind, status }) =>
    kind === "validation" && status === "available");
  if (!validationValid) issues.push("DRI_PUBLIC_INDEX_VALIDATION_INVALID");
  const certificationValid = candidate.freeze.platform.capabilities.some(({ kind, status }) =>
    kind === "certification" && status === "available") &&
    candidate.freeze.platform.certificationReport.decision.certified;
  if (!certificationValid) issues.push("DRI_PUBLIC_INDEX_CERTIFICATION_INVALID");
  const compatibilityValid = JSON.stringify(candidate.compatibility) ===
    JSON.stringify(directorRuntimeIntegrationPublicCompatibility) &&
    directorRuntimeIntegrationFreezeCompatibility.readyForPublicIndex;
  if (!compatibilityValid) issues.push("DRI_PUBLIC_INDEX_COMPATIBILITY_INVALID");
  const registryValid = orderAndMetadataValid && candidate.registry.length ===
    directorRuntimeIntegrationPublicRegistry.length && candidate.registry.every((entry, index) =>
      entry.order === index + 1 && entry.concept === directorRuntimeIntegrationPublicRegistry[index]?.concept) &&
    directorRuntimeIntegrationFreezeRegistry.every((entry, index) => entry.order === index + 1);
  if (!registryValid) issues.push("DRI_PUBLIC_INDEX_REGISTRY_INVALID");
  const authorityValid = candidate.authority.runtime === "authoritative operational and business state" &&
    candidate.authority.dri === "certified integration-description boundary" &&
    candidate.authority.director === "presentation and interaction representation";
  if (!authorityValid) issues.push("DRI_PUBLIC_INDEX_AUTHORITY_INVALID");
  const directionValid = manifest.integrationDirection === "runtime-to-director" &&
    candidate.compatibility.integrationDirection === "runtime-to-director";
  if (!directionValid) issues.push("DRI_PUBLIC_INDEX_DIRECTION_INVALID");
  const consumerRulesValid = exactStrings(candidate.guarantees, directorRuntimeIntegrationConsumerGuarantees) &&
    exactStrings(candidate.prohibitions, directorRuntimeIntegrationConsumerProhibitions) &&
    candidate.entry.module === directorRuntimeIntegrationConsumerEntryPath &&
    candidate.entry.role === "SoleConsumerEntryPoint";
  if (!consumerRulesValid) issues.push("DRI_PUBLIC_INDEX_CONSUMER_RULE_INVALID");
  if (candidate.forbiddenBehavior) issues.push("DRI_PUBLIC_INDEX_FORBIDDEN_BEHAVIOR");
  return Object.freeze({
    valid: issues.length === 0,
    readyForConsumer: issues.length === 0,
    identityValid, freezeValid,
    publicSurfaceValid: orderAndMetadataValid && symbolIdentityValid &&
      !issues.some((issue) => issue.startsWith("DRI_PUBLIC_INDEX_EXPORT_")),
    registryValid, authorityValid, directionValid, consumerRulesValid,
    issueCodes: Object.freeze(issues),
  });
}

const validationCapability = directorRuntimeIntegrationPlatform.capabilities
  .find(({ kind }) => kind === "validation");
const certificationCapability = directorRuntimeIntegrationPlatform.capabilities
  .find(({ kind }) => kind === "certification");

export const directorRuntimeIntegrationPublicIdentityNamespace = Object.freeze({
  ...directorRuntimeIntegrationPublicIndexManifest,
  lockIdentity: directorRuntimeIntegrationPlatformLock.lockId,
  runtimeAuthority: directorRuntimeIntegrationRuntimeAuthority,
});
export const directorRuntimeIntegrationPublicTypesNamespace = Object.freeze({
  names: directorRuntimeIntegrationPublicTypeNames,
  count: directorRuntimeIntegrationPublicTypeCount,
});
export const directorRuntimeIntegrationPublicApisNamespace = Object.freeze({
  names: directorRuntimeIntegrationPublicApiNames,
  count: directorRuntimeIntegrationPublicApiCount,
  registry: directorRuntimeIntegrationPublicApiRegistry,
});
export const directorRuntimeIntegrationValidationNamespace = Object.freeze({
  capability: validationCapability,
  available: validationCapability?.status === "available",
  platformVerification: verifyDirectorRuntimeIntegrationPlatform,
});
export const directorRuntimeIntegrationCertificationNamespace = Object.freeze({
  capability: certificationCapability,
  available: certificationCapability?.status === "available",
  report: directorRuntimeIntegrationPlatform.certificationReport,
});
export const directorRuntimeIntegrationRegistryNamespace = Object.freeze({
  publicIndex: directorRuntimeIntegrationPublicRegistry,
  platform: directorRuntimeIntegrationPlatformRegistry,
  freeze: directorRuntimeIntegrationFreezeRegistry,
  frozenPublicApi: directorRuntimeIntegrationPublicApiRegistry,
  consumerGuarantees: directorRuntimeIntegrationConsumerGuarantees,
  consumerProhibitions: directorRuntimeIntegrationConsumerProhibitions,
});

export interface DirectorRuntimeIntegrationPublicIndex {
  readonly identity: typeof directorRuntimeIntegrationPublicIdentityNamespace;
  readonly publicTypes: typeof directorRuntimeIntegrationPublicTypesNamespace;
  readonly publicApis: typeof directorRuntimeIntegrationPublicApisNamespace;
  readonly validation: typeof directorRuntimeIntegrationValidationNamespace;
  readonly certification: typeof directorRuntimeIntegrationCertificationNamespace;
  readonly releaseInformation: typeof directorRuntimeIntegrationReleaseInformation;
  readonly compatibility: typeof directorRuntimeIntegrationPublicCompatibility;
  readonly registry: typeof directorRuntimeIntegrationRegistryNamespace;
  readonly consumerInformation: typeof directorRuntimeIntegrationConsumerInformation;
}

export const directorRuntimeIntegrationPublicIndex = Object.freeze({
  identity: directorRuntimeIntegrationPublicIdentityNamespace,
  publicTypes: directorRuntimeIntegrationPublicTypesNamespace,
  publicApis: directorRuntimeIntegrationPublicApisNamespace,
  validation: directorRuntimeIntegrationValidationNamespace,
  certification: directorRuntimeIntegrationCertificationNamespace,
  releaseInformation: directorRuntimeIntegrationReleaseInformation,
  compatibility: directorRuntimeIntegrationPublicCompatibility,
  registry: directorRuntimeIntegrationRegistryNamespace,
  consumerInformation: directorRuntimeIntegrationConsumerInformation,
}) satisfies DirectorRuntimeIntegrationPublicIndex;

export const directorRuntimeIntegrationConsumerVerification =
  verifyDirectorRuntimeIntegrationConsumerEntry();
export const directorRuntimeIntegrationReleaseDeclaration = Object.freeze({
  released: directorRuntimeIntegrationConsumerVerification.valid,
  certified: directorRuntimeIntegrationConsumerVerification.valid &&
    directorRuntimeIntegrationPlatform.certificationReport.decision.certified,
  frozen: directorRuntimeIntegrationConsumerVerification.freezeValid,
  stable: directorRuntimeIntegrationConsumerVerification.valid,
  readyForConsumer: directorRuntimeIntegrationConsumerVerification.readyForConsumer,
  role: "SoleConsumerEntryPoint" as const,
});
