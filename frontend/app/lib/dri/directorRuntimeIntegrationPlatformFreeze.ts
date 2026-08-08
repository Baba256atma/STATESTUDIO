/**
 * DRI-1:8 — Director Runtime Integration Platform Freeze
 *
 * Release-lock metadata over the exact certified DRI-1:7 Platform surface.
 * Freeze restricts and publishes; it introduces no new integration behavior.
 */

import {
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
  isDirectorRuntimeIntegrationPlatformCapabilityKind,
  isDirectorRuntimeIntegrationPlatformCapabilityStatus,
  isDirectorRuntimeIntegrationPlatformStatus,
  resolveDirectorRuntimeIntegrationPlatformCapabilities,
  resolveDirectorRuntimeIntegrationPlatformReadiness,
  verifyDirectorRuntimeIntegrationPlatform,
  type DirectorRuntimeIntegrationPlatform,
  type DirectorRuntimeIntegrationPlatformCapability,
  type DirectorRuntimeIntegrationPlatformCapabilityKind,
  type DirectorRuntimeIntegrationPlatformCapabilityStatus,
  type DirectorRuntimeIntegrationPlatformComposition,
  type DirectorRuntimeIntegrationPlatformConsumerInformation,
  type DirectorRuntimeIntegrationPlatformInput,
  type DirectorRuntimeIntegrationPlatformManifest,
  type DirectorRuntimeIntegrationPlatformReadiness,
  type DirectorRuntimeIntegrationPlatformStatus,
} from "./directorRuntimeIntegrationPlatform.ts";

// Approved upstream re-exports preserve exact value and function identity.
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
  isDirectorRuntimeIntegrationPlatformCapabilityKind,
  isDirectorRuntimeIntegrationPlatformCapabilityStatus,
  isDirectorRuntimeIntegrationPlatformStatus,
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
};

// ─── Freeze identity and vocabulary ────────────────────────────────────────

export const directorRuntimeIntegrationPlatformFreezeIdentity =
  "DRI-1:8/DirectorRuntimeIntegrationPlatformFreeze" as const;
export const directorRuntimeIntegrationPlatformFreezeVersion = "1.8.0" as const;
export const directorRuntimeIntegrationPlatformFreezeNamespace =
  "nexora.dri.runtime.integration.platform.freeze" as const;
export const directorRuntimeIntegrationPlatformFreezeUpstream =
  directorRuntimeIntegrationPlatformIdentity;

export const DIRECTOR_RUNTIME_INTEGRATION_FREEZE_STATES = Object.freeze([
  "draft", "candidate", "frozen", "invalid",
] as const);
export type DirectorRuntimeIntegrationFreezeState =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_FREEZE_STATES)[number];

export const DIRECTOR_RUNTIME_INTEGRATION_RELEASE_STATUSES = Object.freeze([
  "unreleased", "release-candidate", "released", "withdrawn",
] as const);
export type DirectorRuntimeIntegrationReleaseStatus =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_RELEASE_STATUSES)[number];

export const DIRECTOR_RUNTIME_INTEGRATION_STABILITY_STATUSES = Object.freeze([
  "experimental", "stable", "deprecated", "retired",
] as const);
export type DirectorRuntimeIntegrationStabilityStatus =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_STABILITY_STATUSES)[number];

export function isDirectorRuntimeIntegrationFreezeState(
  value: unknown,
): value is DirectorRuntimeIntegrationFreezeState {
  return (DIRECTOR_RUNTIME_INTEGRATION_FREEZE_STATES as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeIntegrationReleaseStatus(
  value: unknown,
): value is DirectorRuntimeIntegrationReleaseStatus {
  return (DIRECTOR_RUNTIME_INTEGRATION_RELEASE_STATUSES as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeIntegrationStabilityStatus(
  value: unknown,
): value is DirectorRuntimeIntegrationStabilityStatus {
  return (DIRECTOR_RUNTIME_INTEGRATION_STABILITY_STATUSES as readonly unknown[]).includes(value);
}

export const DIRECTOR_RUNTIME_INTEGRATION_FREEZE_ISSUE_CODES = Object.freeze([
  "DRI_FREEZE_VALID", "DRI_FREEZE_PLATFORM_NOT_READY",
  "DRI_FREEZE_CERTIFICATION_INVALID", "DRI_FREEZE_CAPABILITY_MISSING",
  "DRI_FREEZE_CAPABILITY_NOT_AVAILABLE", "DRI_FREEZE_IDENTITY_INVALID",
  "DRI_FREEZE_UPSTREAM_INVALID", "DRI_FREEZE_AUTHORITY_INVALID",
  "DRI_FREEZE_DIRECTION_INVALID", "DRI_FREEZE_GUARANTEE_MISSING",
  "DRI_FREEZE_LIMITATION_MISSING", "DRI_FREEZE_PUBLIC_API_INVALID",
  "DRI_FREEZE_REGISTRY_INVALID", "DRI_FREEZE_COMPATIBILITY_INVALID",
] as const);
export type DirectorRuntimeIntegrationFreezeIssueCode =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_FREEZE_ISSUE_CODES)[number];

// ─── Lock, manifest, and release metadata ──────────────────────────────────

export interface DirectorRuntimeIntegrationPlatformLock {
  readonly lockId: "DRI-1-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED";
  readonly locked: true;
  readonly phase: "DRI-1";
  readonly stage: "Freeze";
}

export const directorRuntimeIntegrationPlatformLock = Object.freeze({
  lockId: "DRI-1-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED" as const,
  locked: true as const,
  phase: "DRI-1" as const,
  stage: "Freeze" as const,
});

export interface DirectorRuntimeIntegrationPlatformFreezeManifest {
  readonly freezeId: string;
  readonly version: string;
  readonly namespace: string;
  readonly layer: "DRI";
  readonly phase: "DRI-1";
  readonly stage: "Freeze";
  readonly status: "Frozen" | "Invalid";
  readonly readiness: "ReadyForPublicIndex" | "NotReadyForPublicIndex";
  readonly upstreamIdentity: string;
  readonly lockId: string;
  readonly releaseStatus: DirectorRuntimeIntegrationReleaseStatus;
  readonly stabilityStatus: DirectorRuntimeIntegrationStabilityStatus;
  readonly integrationDirection: "runtime-to-director";
}

export const directorRuntimeIntegrationFreezeCompatibility = Object.freeze({
  phase: "DRI-1" as const,
  platformVersion: "1.7.0" as const,
  freezeVersion: "1.8.0" as const,
  requiredUpstream: "DRI-1:7/DirectorRuntimeIntegrationPlatform" as const,
  integrationDirection: "runtime-to-director" as const,
  runtimeAuthorityRequired: true as const,
  liveSynchronizationSupported: false as const,
  renderingSupported: false as const,
  reverseWriteBackSupported: false as const,
  readyForPublicIndex: true as const,
});

export const directorRuntimeIntegrationFreezeConsumerRules = Object.freeze([
  "consume DRI-1 through DRI-1:9 Public Index",
  "do not directly import DRI-1:1 through DRI-1:7 implementation modules",
  "do not import Freeze as a normal application service",
  "do not mutate exported registries",
  "do not generate reverse Runtime authority",
  "do not add live synchronization through DRI-1",
  "do not add React or Three.js behavior through DRI-1",
  "do not use DRI-1 for KPI or business calculation",
  "preserve caller identities and collection order",
  "use supported verification APIs",
] as const);
export const directorRuntimeIntegrationFreezeConsumerRuleCount =
  directorRuntimeIntegrationFreezeConsumerRules.length;

export const directorRuntimeIntegrationFreezeReleaseInformation = Object.freeze({
  releaseStatus: "released" as const,
  stability: "stable" as const,
  freezeStatus: "frozen" as const,
  readiness: "ReadyForPublicIndex" as const,
  consumerEntry: "pending DRI-1:9" as const,
  breakingChangesAllowedWithinDri1: false as const,
  liveSynchronization: "unsupported" as const,
  rendering: "unsupported" as const,
  role: "FrozenUpstreamForPublicIndex" as const,
  publicIndex: false as const,
  soleConsumerEntryPoint: false as const,
  finalConsumerEntry: false as const,
});

// ─── Frozen ordered surfaces ───────────────────────────────────────────────

export const directorRuntimeIntegrationFrozenIdentityChain = Object.freeze([
  ...directorRuntimeIntegrationPlatformIdentityChain,
  directorRuntimeIntegrationPlatformFreezeIdentity,
] as const);
export const directorRuntimeIntegrationFrozenIdentityChainCount =
  directorRuntimeIntegrationFrozenIdentityChain.length;

// Exact upstream objects are retained rather than rewritten.
export const directorRuntimeIntegrationFrozenPlatformGuarantees =
  directorRuntimeIntegrationPlatformGuarantees;
export const directorRuntimeIntegrationFrozenPlatformGuaranteeCount =
  directorRuntimeIntegrationFrozenPlatformGuarantees.length;
export const directorRuntimeIntegrationFrozenPlatformLimitations =
  directorRuntimeIntegrationPlatformLimitations;
export const directorRuntimeIntegrationFrozenPlatformLimitationCount =
  directorRuntimeIntegrationFrozenPlatformLimitations.length;

export interface DirectorRuntimeIntegrationFrozenPublicExport {
  readonly exportName: string;
  readonly exportKind: "value" | "type" | "api" | "registry" | "metadata";
}

export const directorRuntimeIntegrationFrozenPublicApiSurface = Object.freeze([
  ["directorRuntimeIntegrationPlatformIdentity", "metadata"],
  ["directorRuntimeIntegrationPlatformVersion", "metadata"],
  ["directorRuntimeIntegrationPlatformNamespace", "metadata"],
  ["directorRuntimeIntegrationPlatformMetadata", "metadata"],
  ["DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_STATUSES", "value"],
  ["DirectorRuntimeIntegrationPlatformStatus", "type"],
  ["DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS", "value"],
  ["DirectorRuntimeIntegrationPlatformCapabilityKind", "type"],
  ["DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_STATUSES", "value"],
  ["DirectorRuntimeIntegrationPlatformCapabilityStatus", "type"],
  ["DirectorRuntimeIntegrationPlatformCapability", "type"],
  ["DirectorRuntimeIntegrationPlatformReadiness", "type"],
  ["DirectorRuntimeIntegrationPlatformComposition", "type"],
  ["DirectorRuntimeIntegrationPlatformManifest", "type"],
  ["DirectorRuntimeIntegrationPlatformConsumerInformation", "type"],
  ["DirectorRuntimeIntegrationPlatform", "type"],
  ["DirectorRuntimeIntegrationPlatformInput", "type"],
  ["directorRuntimeIntegrationPlatformIdentityChain", "value"],
  ["directorRuntimeIntegrationPlatformIdentityChainCount", "value"],
  ["directorRuntimeIntegrationPlatformGuarantees", "value"],
  ["directorRuntimeIntegrationPlatformGuaranteeCount", "value"],
  ["directorRuntimeIntegrationPlatformLimitations", "value"],
  ["directorRuntimeIntegrationPlatformLimitationCount", "value"],
  ["directorRuntimeIntegrationPlatformCompatibility", "metadata"],
  ["directorRuntimeIntegrationPlatformConsumerInformation", "metadata"],
  ["directorRuntimeIntegrationPlatformCapabilityRegistry", "registry"],
  ["directorRuntimeIntegrationPlatformCapabilityRegistryCount", "value"],
  ["directorRuntimeIntegrationPlatformRegistry", "registry"],
  ["directorRuntimeIntegrationPlatformRegistryCount", "value"],
  ["directorRuntimeIntegrationPlatform", "value"],
  ["createDirectorRuntimeIntegrationPlatformCapability", "api"],
  ["resolveDirectorRuntimeIntegrationPlatformCapabilities", "api"],
  ["resolveDirectorRuntimeIntegrationPlatformReadiness", "api"],
  ["createDirectorRuntimeIntegrationPlatform", "api"],
  ["findDirectorRuntimeIntegrationPlatformCapabilityById", "api"],
  ["findDirectorRuntimeIntegrationPlatformCapabilityByKind", "api"],
  ["findBlockedDirectorRuntimeIntegrationPlatformCapabilities", "api"],
  ["findLimitedDirectorRuntimeIntegrationPlatformCapabilities", "api"],
  ["findRequiredDirectorRuntimeIntegrationPlatformCapabilities", "api"],
  ["isDirectorRuntimeIntegrationPlatformCapabilityAvailable", "api"],
  ["getDirectorRuntimeIntegrationPlatformRegistry", "api"],
  ["verifyDirectorRuntimeIntegrationPlatform", "api"],
].map(([exportName, exportKind]) => Object.freeze({ exportName, exportKind })) as
  readonly DirectorRuntimeIntegrationFrozenPublicExport[]);
export const directorRuntimeIntegrationFrozenPublicApiCount =
  directorRuntimeIntegrationFrozenPublicApiSurface.length;

export const directorRuntimeIntegrationFreezeGuarantees = Object.freeze([
  "platform-identity-locked", "upstream-platform-locked", "identity-chain-locked",
  "capability-kinds-locked", "required-capabilities-available",
  "runtime-authority-locked", "integration-direction-locked",
  "platform-guarantees-locked", "platform-limitations-locked",
  "compatibility-locked", "consumer-rules-locked", "public-api-surface-locked",
  "registry-order-locked", "caller-input-immutability-preserved",
  "no-new-functional-behavior", "ready-for-public-index",
] as const);
export const directorRuntimeIntegrationFreezeGuaranteeCount =
  directorRuntimeIntegrationFreezeGuarantees.length;

export const directorRuntimeIntegrationFreezeRegistry = Object.freeze([
  "Freeze Identity", "Upstream Platform", "Freeze State", "Release Status",
  "Stability", "Lock", "Identity Chain", "Platform Capabilities",
  "Runtime Authority", "Integration Direction", "Platform Guarantees",
  "Platform Limitations", "Compatibility", "Consumer Rules",
  "Public API Surface", "Freeze Eligibility", "Release Information",
  "Verification", "Public Index Readiness",
].map((concept, index) => Object.freeze({ order: index + 1, concept })));
export const directorRuntimeIntegrationFreezeRegistryCount =
  directorRuntimeIntegrationFreezeRegistry.length;

// ─── Eligibility and Freeze creation ───────────────────────────────────────

export interface DirectorRuntimeIntegrationFreezeCandidate {
  readonly platform: DirectorRuntimeIntegrationPlatform;
  readonly upstreamIdentity: string;
  readonly identityChain: readonly string[];
  readonly guarantees: readonly string[];
  readonly limitations: readonly string[];
  readonly publicApiSurface: readonly DirectorRuntimeIntegrationFrozenPublicExport[];
  readonly platformRegistry: readonly { readonly order: number; readonly concept: string }[];
  readonly compatibility: typeof directorRuntimeIntegrationFreezeCompatibility;
}

export interface DirectorRuntimeIntegrationFreezeEligibility {
  readonly eligible: boolean;
  readonly platformReady: boolean;
  readonly certificationAccepted: boolean;
  readonly requiredCapabilitiesAvailable: boolean;
  readonly authorityPreserved: boolean;
  readonly directionPreserved: boolean;
  readonly issueCodes: readonly DirectorRuntimeIntegrationFreezeIssueCode[];
}

export interface DirectorRuntimeIntegrationPlatformFreeze {
  readonly manifest: DirectorRuntimeIntegrationPlatformFreezeManifest;
  readonly state: DirectorRuntimeIntegrationFreezeState;
  readonly eligibility: DirectorRuntimeIntegrationFreezeEligibility;
  readonly platform: DirectorRuntimeIntegrationPlatform;
  readonly lock: DirectorRuntimeIntegrationPlatformLock;
  readonly identityChain: readonly string[];
  readonly guarantees: readonly string[];
  readonly limitations: readonly string[];
  readonly publicApiSurface: readonly DirectorRuntimeIntegrationFrozenPublicExport[];
  readonly compatibility: typeof directorRuntimeIntegrationFreezeCompatibility;
  readonly consumerRules: readonly string[];
  readonly releaseInformation: typeof directorRuntimeIntegrationFreezeReleaseInformation;
  readonly freezeGuarantees: readonly string[];
}

function exactOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function validApiSurface(surface: readonly DirectorRuntimeIntegrationFrozenPublicExport[]): boolean {
  return surface.length === directorRuntimeIntegrationFrozenPublicApiSurface.length &&
    new Set(surface.map(({ exportName }) => exportName)).size === surface.length &&
    surface.every((entry, index) =>
      entry.exportName === directorRuntimeIntegrationFrozenPublicApiSurface[index]?.exportName &&
      entry.exportKind === directorRuntimeIntegrationFrozenPublicApiSurface[index]?.exportKind);
}

function validRegistry(registry: readonly { readonly order: number; readonly concept: string }[]): boolean {
  return registry.length === directorRuntimeIntegrationPlatformRegistry.length &&
    registry.every((entry, index) => entry.order === index + 1 &&
      entry.concept === directorRuntimeIntegrationPlatformRegistry[index]?.concept);
}

export function resolveDirectorRuntimeIntegrationFreezeEligibility(
  candidate: DirectorRuntimeIntegrationFreezeCandidate,
): DirectorRuntimeIntegrationFreezeEligibility {
  const issues: DirectorRuntimeIntegrationFreezeIssueCode[] = [];
  const platformReady = candidate.platform.manifest.status === "ready" &&
    candidate.platform.readiness.ready === true;
  if (!platformReady) issues.push("DRI_FREEZE_PLATFORM_NOT_READY");
  const certificationAccepted = ["certified", "certified-with-notes"]
    .includes(candidate.platform.certificationReport.status) &&
    candidate.platform.certificationReport.decision.readyForPlatform === true;
  if (!certificationAccepted) issues.push("DRI_FREEZE_CERTIFICATION_INVALID");
  const missingCapability = directorRuntimeIntegrationPlatformCapabilityRegistry
    .some((expected) => !candidate.platform.capabilities.some((actual) => actual.kind === expected.kind));
  if (missingCapability) issues.push("DRI_FREEZE_CAPABILITY_MISSING");
  const requiredCapabilitiesAvailable = directorRuntimeIntegrationPlatformCapabilityRegistry
    .filter(({ required }) => required)
    .every((expected) => candidate.platform.capabilities.some((actual) =>
      actual.kind === expected.kind && actual.required && actual.status === "available"));
  if (!requiredCapabilitiesAvailable && !missingCapability) {
    issues.push("DRI_FREEZE_CAPABILITY_NOT_AVAILABLE");
  }
  if (!exactOrder(candidate.identityChain, directorRuntimeIntegrationFrozenIdentityChain) ||
    new Set(candidate.identityChain).size !== candidate.identityChain.length ||
    candidate.platform.manifest.platformId !== directorRuntimeIntegrationPlatformIdentity) {
    issues.push("DRI_FREEZE_IDENTITY_INVALID");
  }
  if (candidate.upstreamIdentity !== directorRuntimeIntegrationPlatformIdentity ||
    candidate.platform.manifest.upstreamIdentity !== directorRuntimeIntegrationPlatformUpstream) {
    issues.push("DRI_FREEZE_UPSTREAM_INVALID");
  }
  const authorityPreserved = candidate.platform.manifest.authority ===
    "Runtime is authoritative operational and business state" &&
    candidate.platform.compatibility.runtimeAuthorityRequired === true;
  if (!authorityPreserved) issues.push("DRI_FREEZE_AUTHORITY_INVALID");
  const directionPreserved = candidate.platform.manifest.direction === "runtime-to-director" &&
    candidate.platform.compatibility.integrationDirection === "runtime-to-director";
  if (!directionPreserved) issues.push("DRI_FREEZE_DIRECTION_INVALID");
  if (!exactOrder(candidate.guarantees, directorRuntimeIntegrationPlatformGuarantees)) {
    issues.push("DRI_FREEZE_GUARANTEE_MISSING");
  }
  if (!exactOrder(candidate.limitations, directorRuntimeIntegrationPlatformLimitations)) {
    issues.push("DRI_FREEZE_LIMITATION_MISSING");
  }
  if (!validApiSurface(candidate.publicApiSurface)) {
    issues.push("DRI_FREEZE_PUBLIC_API_INVALID");
  }
  if (!validRegistry(candidate.platformRegistry) ||
    !verifyDirectorRuntimeIntegrationPlatform(candidate.platform)) {
    issues.push("DRI_FREEZE_REGISTRY_INVALID");
  }
  if (JSON.stringify(candidate.compatibility) !==
    JSON.stringify(directorRuntimeIntegrationFreezeCompatibility)) {
    issues.push("DRI_FREEZE_COMPATIBILITY_INVALID");
  }
  return Object.freeze({
    eligible: issues.length === 0,
    platformReady,
    certificationAccepted,
    requiredCapabilitiesAvailable,
    authorityPreserved,
    directionPreserved,
    issueCodes: Object.freeze(issues),
  });
}

function clonePublicApiSurface(
  surface: readonly DirectorRuntimeIntegrationFrozenPublicExport[],
): readonly DirectorRuntimeIntegrationFrozenPublicExport[] {
  return Object.freeze(surface.map((entry) => Object.freeze({ ...entry })));
}

function deepFreezeClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return Object.freeze(value.map((item) => deepFreezeClone(item))) as T;
  }
  if (value !== null && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, deepFreezeClone(item)]),
    )) as T;
  }
  return value;
}

export function createDirectorRuntimeIntegrationPlatformFreeze(
  candidate: DirectorRuntimeIntegrationFreezeCandidate,
): DirectorRuntimeIntegrationPlatformFreeze {
  const eligibility = resolveDirectorRuntimeIntegrationFreezeEligibility(candidate);
  const frozen = eligibility.eligible;
  const manifest = Object.freeze({
    freezeId: directorRuntimeIntegrationPlatformFreezeIdentity,
    version: directorRuntimeIntegrationPlatformFreezeVersion,
    namespace: directorRuntimeIntegrationPlatformFreezeNamespace,
    layer: "DRI" as const,
    phase: "DRI-1" as const,
    stage: "Freeze" as const,
    status: frozen ? "Frozen" as const : "Invalid" as const,
    readiness: frozen ? "ReadyForPublicIndex" as const : "NotReadyForPublicIndex" as const,
    upstreamIdentity: candidate.upstreamIdentity,
    lockId: directorRuntimeIntegrationPlatformLock.lockId,
    releaseStatus: frozen ? "released" as const : "unreleased" as const,
    stabilityStatus: frozen ? "stable" as const : "experimental" as const,
    integrationDirection: "runtime-to-director" as const,
  });
  return Object.freeze({
    manifest,
    state: frozen ? "frozen" as const : "invalid" as const,
    eligibility,
    platform: deepFreezeClone(candidate.platform),
    lock: directorRuntimeIntegrationPlatformLock,
    identityChain: Object.freeze([...candidate.identityChain]),
    guarantees: Object.freeze([...candidate.guarantees]),
    limitations: Object.freeze([...candidate.limitations]),
    publicApiSurface: clonePublicApiSurface(candidate.publicApiSurface),
    compatibility: directorRuntimeIntegrationFreezeCompatibility,
    consumerRules: directorRuntimeIntegrationFreezeConsumerRules,
    releaseInformation: directorRuntimeIntegrationFreezeReleaseInformation,
    freezeGuarantees: directorRuntimeIntegrationFreezeGuarantees,
  });
}

export const directorRuntimeCanonicalFreezeCandidate = Object.freeze({
  platform: directorRuntimeIntegrationPlatform,
  upstreamIdentity: directorRuntimeIntegrationPlatformIdentity,
  identityChain: directorRuntimeIntegrationFrozenIdentityChain,
  guarantees: directorRuntimeIntegrationFrozenPlatformGuarantees,
  limitations: directorRuntimeIntegrationFrozenPlatformLimitations,
  publicApiSurface: directorRuntimeIntegrationFrozenPublicApiSurface,
  platformRegistry: directorRuntimeIntegrationPlatformRegistry,
  compatibility: directorRuntimeIntegrationFreezeCompatibility,
} satisfies DirectorRuntimeIntegrationFreezeCandidate);

export const directorRuntimeIntegrationPlatformFreeze =
  createDirectorRuntimeIntegrationPlatformFreeze(
    directorRuntimeCanonicalFreezeCandidate,
  );

export function getDirectorRuntimeIntegrationPlatformFreezeManifest():
  DirectorRuntimeIntegrationPlatformFreezeManifest {
  return directorRuntimeIntegrationPlatformFreeze.manifest;
}
export function getDirectorRuntimeIntegrationPlatformLock():
  DirectorRuntimeIntegrationPlatformLock {
  return directorRuntimeIntegrationPlatformLock;
}
export function getDirectorRuntimeIntegrationFrozenPublicApiSurface():
  readonly DirectorRuntimeIntegrationFrozenPublicExport[] {
  return directorRuntimeIntegrationFrozenPublicApiSurface;
}
export function getDirectorRuntimeIntegrationFreezeCompatibility():
  typeof directorRuntimeIntegrationFreezeCompatibility {
  return directorRuntimeIntegrationFreezeCompatibility;
}
export function getDirectorRuntimeIntegrationFreezeConsumerRules(): readonly string[] {
  return directorRuntimeIntegrationFreezeConsumerRules;
}
export function getDirectorRuntimeIntegrationFreezeRegistry():
  typeof directorRuntimeIntegrationFreezeRegistry {
  return directorRuntimeIntegrationFreezeRegistry;
}

export function verifyDirectorRuntimeIntegrationPlatformFreeze(
  artifact: DirectorRuntimeIntegrationPlatformFreeze = directorRuntimeIntegrationPlatformFreeze,
  registry: readonly { readonly order: number; readonly concept: string }[] =
    directorRuntimeIntegrationFreezeRegistry,
): boolean {
  return artifact.manifest.freezeId === "DRI-1:8/DirectorRuntimeIntegrationPlatformFreeze" &&
    artifact.manifest.version === "1.8.0" &&
    artifact.manifest.namespace === "nexora.dri.runtime.integration.platform.freeze" &&
    artifact.manifest.layer === "DRI" && artifact.manifest.phase === "DRI-1" &&
    artifact.manifest.stage === "Freeze" && artifact.manifest.status === "Frozen" &&
    artifact.manifest.readiness === "ReadyForPublicIndex" &&
    artifact.manifest.upstreamIdentity === directorRuntimeIntegrationPlatformIdentity &&
    artifact.manifest.lockId === "DRI-1-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED" &&
    artifact.manifest.releaseStatus === "released" && artifact.manifest.stabilityStatus === "stable" &&
    artifact.manifest.integrationDirection === "runtime-to-director" &&
    artifact.state === "frozen" && artifact.lock.locked && artifact.eligibility.eligible &&
    exactOrder(artifact.identityChain, directorRuntimeIntegrationFrozenIdentityChain) &&
    exactOrder(artifact.guarantees, directorRuntimeIntegrationFrozenPlatformGuarantees) &&
    exactOrder(artifact.limitations, directorRuntimeIntegrationFrozenPlatformLimitations) &&
    validApiSurface(artifact.publicApiSurface) &&
    JSON.stringify(artifact.compatibility) === JSON.stringify(directorRuntimeIntegrationFreezeCompatibility) &&
    exactOrder(artifact.consumerRules, directorRuntimeIntegrationFreezeConsumerRules) &&
    registry.length === directorRuntimeIntegrationFreezeRegistryCount &&
    registry.every((entry, index) => entry.order === index + 1 &&
      entry.concept === directorRuntimeIntegrationFreezeRegistry[index]?.concept) &&
    verifyDirectorRuntimeIntegrationPlatform(artifact.platform);
}

const canonicalFreezeVerified = verifyDirectorRuntimeIntegrationPlatformFreeze();
export const directorRuntimeIntegrationPublicIndexReadiness = Object.freeze({
  nextStageId: "DRI-1:9/DirectorRuntimeIntegrationPublicIndex" as const,
  readyForPublicIndex: canonicalFreezeVerified,
  role: "FrozenUpstreamForPublicIndex" as const,
  publicIndex: false as const,
});
