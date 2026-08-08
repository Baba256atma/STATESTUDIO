/**
 * DRI-1:7 — Director Runtime Integration Platform
 *
 * Stable composition of certified DRI-1 capabilities. The Platform exposes
 * immutable architectural descriptions only and performs no live integration.
 */

import {
  certifyDirectorRuntimeIntegration,
  directorRuntimeCanonicalCertificationFixture,
  directorRuntimeIntegrationCertificationIdentity,
  directorRuntimeIntegrationCertificationMetadata,
  verifyDirectorRuntimeIntegrationCertification,
  type DirectorRuntimeCertificationReport,
  type DirectorRuntimeCertificationStatus,
} from "./directorRuntimeIntegrationCertification.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeIntegrationPlatformIdentity =
  "DRI-1:7/DirectorRuntimeIntegrationPlatform" as const;
export const directorRuntimeIntegrationPlatformVersion = "1.7.0" as const;
export const directorRuntimeIntegrationPlatformNamespace =
  "nexora.dri.runtime.integration.platform" as const;
export const directorRuntimeIntegrationPlatformUpstream =
  directorRuntimeIntegrationCertificationIdentity;

export const directorRuntimeIntegrationPlatformMetadata = Object.freeze({
  identity: directorRuntimeIntegrationPlatformIdentity,
  version: directorRuntimeIntegrationPlatformVersion,
  namespace: directorRuntimeIntegrationPlatformNamespace,
  layer: "DRI" as const,
  phase: "DRI-1" as const,
  stage: "Platform" as const,
  status: "PlatformReady" as const,
  upstream: directorRuntimeIntegrationPlatformUpstream,
  direction: directorRuntimeIntegrationCertificationMetadata.direction,
  authority: directorRuntimeIntegrationCertificationMetadata.authority,
  publicIndex: false as const,
  frozen: false as const,
  soleConsumerEntryPoint: false as const,
});

// ─── Platform vocabulary ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_STATUSES = Object.freeze([
  "initializing", "ready", "degraded", "blocked", "unavailable",
] as const);
export type DirectorRuntimeIntegrationPlatformStatus =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_STATUSES)[number];

export const DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS = Object.freeze([
  "foundation", "contracts", "mapping", "binding", "validation",
  "certification", "registry", "verification",
] as const);
export type DirectorRuntimeIntegrationPlatformCapabilityKind =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS)[number];

export const DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_STATUSES = Object.freeze([
  "available", "limited", "blocked", "unavailable",
] as const);
export type DirectorRuntimeIntegrationPlatformCapabilityStatus =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_STATUSES)[number];

export function isDirectorRuntimeIntegrationPlatformStatus(
  value: unknown,
): value is DirectorRuntimeIntegrationPlatformStatus {
  return (DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_STATUSES as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeIntegrationPlatformCapabilityKind(
  value: unknown,
): value is DirectorRuntimeIntegrationPlatformCapabilityKind {
  return (DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeIntegrationPlatformCapabilityStatus(
  value: unknown,
): value is DirectorRuntimeIntegrationPlatformCapabilityStatus {
  return (DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_STATUSES as readonly unknown[]).includes(value);
}

// ─── Public contracts ──────────────────────────────────────────────────────

export interface DirectorRuntimeIntegrationPlatformCapability {
  readonly capabilityId: string;
  readonly kind: DirectorRuntimeIntegrationPlatformCapabilityKind;
  readonly status: DirectorRuntimeIntegrationPlatformCapabilityStatus;
  readonly sourceIdentity: string;
  readonly required: boolean;
  readonly guaranteeIds: readonly string[];
  readonly dependencyIds: readonly string[];
}

export interface DirectorRuntimeIntegrationPlatformReadiness {
  readonly ready: boolean;
  readonly status: DirectorRuntimeIntegrationPlatformStatus;
  readonly certificationStatus: DirectorRuntimeCertificationStatus;
  readonly blockedCapabilityIds: readonly string[];
  readonly limitedCapabilityIds: readonly string[];
  readonly unavailableCapabilityIds: readonly string[];
}

export interface DirectorRuntimeIntegrationPlatformComposition {
  readonly compositionId: string;
  readonly certificationId: string;
  readonly capabilityIds: readonly string[];
  readonly guaranteeIds: readonly string[];
}

export interface DirectorRuntimeIntegrationPlatformManifest {
  readonly platformId: string;
  readonly version: string;
  readonly namespace: string;
  readonly layer: "DRI";
  readonly phase: "DRI-1";
  readonly stage: "Platform";
  readonly status: DirectorRuntimeIntegrationPlatformStatus;
  readonly upstreamIdentity: string;
  readonly capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[];
  readonly direction: "runtime-to-director";
  readonly authority: string;
  readonly readinessTarget: "DRI-1:8/DirectorRuntimeIntegrationAdapter";
}

export interface DirectorRuntimeIntegrationPlatformConsumerInformation {
  readonly consumerStage: string;
  readonly allowedCapabilities: readonly DirectorRuntimeIntegrationPlatformCapabilityKind[];
  readonly prohibitedDependencies: readonly string[];
}

export interface DirectorRuntimeIntegrationPlatform {
  readonly manifest: DirectorRuntimeIntegrationPlatformManifest;
  readonly composition: DirectorRuntimeIntegrationPlatformComposition;
  readonly readiness: DirectorRuntimeIntegrationPlatformReadiness;
  readonly capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[];
  readonly guarantees: readonly string[];
  readonly limitations: readonly string[];
  readonly compatibility: typeof directorRuntimeIntegrationPlatformCompatibility;
  readonly consumerInformation: DirectorRuntimeIntegrationPlatformConsumerInformation;
  readonly certificationReport: DirectorRuntimeCertificationReport;
}

export interface DirectorRuntimeIntegrationPlatformInput {
  readonly platformId: string;
  readonly compositionId: string;
  readonly certificationReport: DirectorRuntimeCertificationReport;
  readonly capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[];
}

function opaque(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
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

export function createDirectorRuntimeIntegrationPlatformCapability(
  input: DirectorRuntimeIntegrationPlatformCapability,
): DirectorRuntimeIntegrationPlatformCapability {
  if (!opaque(input.capabilityId) || !isDirectorRuntimeIntegrationPlatformCapabilityKind(input.kind) ||
    !isDirectorRuntimeIntegrationPlatformCapabilityStatus(input.status) || !opaque(input.sourceIdentity) ||
    input.guaranteeIds.some((id) => !opaque(id)) || input.dependencyIds.some((id) => !opaque(id))) {
    throw new TypeError("Platform capability must be deterministic plain data");
  }
  return Object.freeze({
    ...input,
    required: input.required === true,
    guaranteeIds: Object.freeze([...input.guaranteeIds]),
    dependencyIds: Object.freeze([...input.dependencyIds]),
  });
}

function acceptableCertification(report: DirectorRuntimeCertificationReport): boolean {
  return (report.status === "certified" || report.status === "certified-with-notes") &&
    report.decision.certified && report.decision.readyForPlatform;
}

export function resolveDirectorRuntimeIntegrationPlatformCapabilities(
  certificationReport: DirectorRuntimeCertificationReport,
  capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[],
): readonly DirectorRuntimeIntegrationPlatformCapability[] {
  const certificationAccepted = acceptableCertification(certificationReport);
  return Object.freeze(capabilities.map((candidate) => {
    const capability = createDirectorRuntimeIntegrationPlatformCapability(candidate);
    if (certificationAccepted || capability.status === "unavailable") return capability;
    return createDirectorRuntimeIntegrationPlatformCapability({
      ...capability,
      status: "blocked",
    });
  }));
}

export function resolveDirectorRuntimeIntegrationPlatformReadiness(
  certificationReport: DirectorRuntimeCertificationReport,
  capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[],
): DirectorRuntimeIntegrationPlatformReadiness {
  const blockedCapabilityIds = Object.freeze(capabilities
    .filter((capability) => capability.status === "blocked")
    .map((capability) => capability.capabilityId));
  const limitedCapabilityIds = Object.freeze(capabilities
    .filter((capability) => capability.status === "limited")
    .map((capability) => capability.capabilityId));
  const unavailableCapabilityIds = Object.freeze(capabilities
    .filter((capability) => capability.status === "unavailable")
    .map((capability) => capability.capabilityId));
  const requiredUnavailable = capabilities.some((capability) =>
    capability.required && capability.status === "unavailable");
  const requiredBlockedOrLimited = capabilities.some((capability) =>
    capability.required && ["blocked", "limited"].includes(capability.status));
  const missingRequiredKind = DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS
    .filter((kind) => kind !== "registry")
    .some((kind) => !capabilities.some((capability) => capability.kind === kind && capability.required));
  let status: DirectorRuntimeIntegrationPlatformStatus;
  if (capabilities.length === 0) status = "initializing";
  else if (requiredUnavailable) status = "unavailable";
  else if (!acceptableCertification(certificationReport) || requiredBlockedOrLimited || missingRequiredKind) status = "blocked";
  else if (limitedCapabilityIds.length > 0 || unavailableCapabilityIds.length > 0) status = "degraded";
  else status = "ready";
  return Object.freeze({
    ready: status === "ready" || status === "degraded",
    status,
    certificationStatus: certificationReport.status,
    blockedCapabilityIds,
    limitedCapabilityIds,
    unavailableCapabilityIds,
  });
}

export function createDirectorRuntimeIntegrationPlatform(
  input: DirectorRuntimeIntegrationPlatformInput,
): DirectorRuntimeIntegrationPlatform {
  if (!opaque(input.platformId) || !opaque(input.compositionId)) {
    throw new TypeError("Platform and composition identities must be caller-provided");
  }
  const certificationReport = deepFreezeClone(input.certificationReport);
  const capabilities = resolveDirectorRuntimeIntegrationPlatformCapabilities(
    certificationReport,
    input.capabilities,
  );
  if (new Set(capabilities.map((capability) => capability.kind)).size !== capabilities.length) {
    throw new TypeError("Platform capability kinds must be unique");
  }
  const readiness = resolveDirectorRuntimeIntegrationPlatformReadiness(
    certificationReport,
    capabilities,
  );
  const manifest = Object.freeze({
    platformId: input.platformId,
    version: directorRuntimeIntegrationPlatformVersion,
    namespace: directorRuntimeIntegrationPlatformNamespace,
    layer: "DRI" as const,
    phase: "DRI-1" as const,
    stage: "Platform" as const,
    status: readiness.status,
    upstreamIdentity: directorRuntimeIntegrationCertificationIdentity,
    capabilities,
    direction: "runtime-to-director" as const,
    authority: "Runtime is authoritative operational and business state",
    readinessTarget: "DRI-1:8/DirectorRuntimeIntegrationAdapter" as const,
  });
  const composition = Object.freeze({
    compositionId: input.compositionId,
    certificationId: certificationReport.certificationId,
    capabilityIds: Object.freeze(capabilities.map((capability) => capability.capabilityId)),
    guaranteeIds: directorRuntimeIntegrationPlatformGuarantees,
  });
  return Object.freeze({
    manifest,
    composition,
    readiness,
    capabilities,
    guarantees: directorRuntimeIntegrationPlatformGuarantees,
    limitations: directorRuntimeIntegrationPlatformLimitations,
    compatibility: directorRuntimeIntegrationPlatformCompatibility,
    consumerInformation: directorRuntimeIntegrationPlatformConsumerInformation,
    certificationReport,
  });
}

// ─── Identity, guarantees, limitations, and canonical capabilities ─────────

export const directorRuntimeIntegrationPlatformIdentityChain = Object.freeze([
  "DRI-1:1/DirectorRuntimeIntegrationFoundation",
  "DRI-1:2/DirectorRuntimeIntegrationContracts",
  "DRI-1:3/DirectorRuntimeIntegrationMapping",
  "DRI-1:4/DirectorRuntimeIntegrationBinding",
  "DRI-1:5/DirectorRuntimeIntegrationValidation",
  "DRI-1:6/DirectorRuntimeIntegrationCertification",
  "DRI-1:7/DirectorRuntimeIntegrationPlatform",
] as const);
export const directorRuntimeIntegrationPlatformIdentityChainCount =
  directorRuntimeIntegrationPlatformIdentityChain.length;

export const directorRuntimeIntegrationPlatformGuarantees = Object.freeze([
  "exact-dri-1-identity-chain", "certified-upstream-composition",
  "runtime-authority-preserved", "runtime-to-director-direction",
  "immutable-public-contracts", "deterministic-mapping",
  "explicit-binding-lifecycle", "explicit-conflict-detection",
  "release-validation-available", "platform-certification-required",
  "stable-registry-order", "caller-identity-preserved",
  "caller-input-not-mutated", "no-business-semantics",
  "no-live-synchronization", "no-rendering-dependency",
  "no-reverse-runtime-authority", "single-platform-composition-boundary",
] as const);
export const directorRuntimeIntegrationPlatformGuaranteeCount =
  directorRuntimeIntegrationPlatformGuarantees.length;

export const directorRuntimeIntegrationPlatformLimitations = Object.freeze([
  "no-live-runtime-subscription", "no-live-state-synchronization",
  "no-runtime-mutation", "no-director-rendering", "no-scene-execution",
  "no-react-integration", "no-threejs-integration", "no-business-evaluation",
  "no-kpi-calculation", "no-goal-evaluation", "no-decision-approval",
  "no-persistence", "no-network-access", "no-database-access",
] as const);
export const directorRuntimeIntegrationPlatformLimitationCount =
  directorRuntimeIntegrationPlatformLimitations.length;

export const directorRuntimeIntegrationPlatformCompatibility = Object.freeze({
  compatibleDriPhase: "DRI-1" as const,
  requiredUpstream: "DRI-1:6" as const,
  integrationDirection: "runtime-to-director" as const,
  runtimeAuthorityRequired: true as const,
  liveSynchronizationSupported: false as const,
  renderingSupported: false as const,
  reverseWriteBackSupported: false as const,
  businessEvaluationSupported: false as const,
});

export const directorRuntimeIntegrationPlatformConsumerInformation = Object.freeze({
  consumerStage: "DRI-1:8/DirectorRuntimeIntegrationAdapter",
  allowedCapabilities: DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS,
  prohibitedDependencies: Object.freeze([
    "DRI-1:1 internal implementation", "DRI-1:2 internal implementation",
    "DRI-1:3 internal implementation", "DRI-1:4 internal implementation",
    "DRI-1:5 internal implementation", "DRI-1:6 internal implementation",
    "live Runtime stores", "renderer implementations", "reverse Runtime authority",
  ]),
});

const SOURCE_IDENTITIES = Object.freeze({
  foundation: "DRI-1:1/DirectorRuntimeIntegrationFoundation",
  contracts: "DRI-1:2/DirectorRuntimeIntegrationContracts",
  mapping: "DRI-1:3/DirectorRuntimeIntegrationMapping",
  binding: "DRI-1:4/DirectorRuntimeIntegrationBinding",
  validation: "DRI-1:5/DirectorRuntimeIntegrationValidation",
  certification: directorRuntimeIntegrationCertificationIdentity,
  registry: directorRuntimeIntegrationPlatformIdentity,
  verification: directorRuntimeIntegrationPlatformIdentity,
});

export const directorRuntimeIntegrationPlatformCapabilityRegistry = Object.freeze(
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS.map((kind, index) =>
    createDirectorRuntimeIntegrationPlatformCapability({
      capabilityId: `dri-platform-capability:${kind}`,
      kind,
      status: "available",
      sourceIdentity: SOURCE_IDENTITIES[kind],
      required: kind !== "registry",
      guaranteeIds: Object.freeze([
        directorRuntimeIntegrationPlatformGuarantees[index] ??
          directorRuntimeIntegrationPlatformGuarantees[0],
      ]),
      dependencyIds: index === 0
        ? Object.freeze([])
        : Object.freeze([`dri-platform-capability:${DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS[index - 1]}`]),
    })),
);
export const directorRuntimeIntegrationPlatformCapabilityRegistryCount =
  directorRuntimeIntegrationPlatformCapabilityRegistry.length;

// ─── Query APIs ─────────────────────────────────────────────────────────────

export function findDirectorRuntimeIntegrationPlatformCapabilityById(
  capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[],
  capabilityId: string,
): DirectorRuntimeIntegrationPlatformCapability | undefined {
  return capabilities.find((capability) => capability.capabilityId === capabilityId);
}
export function findDirectorRuntimeIntegrationPlatformCapabilityByKind(
  capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[],
  kind: DirectorRuntimeIntegrationPlatformCapabilityKind,
): DirectorRuntimeIntegrationPlatformCapability | undefined {
  return capabilities.find((capability) => capability.kind === kind);
}
export function findBlockedDirectorRuntimeIntegrationPlatformCapabilities(
  capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[],
): readonly DirectorRuntimeIntegrationPlatformCapability[] {
  return Object.freeze(capabilities.filter((capability) => capability.status === "blocked"));
}
export function findLimitedDirectorRuntimeIntegrationPlatformCapabilities(
  capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[],
): readonly DirectorRuntimeIntegrationPlatformCapability[] {
  return Object.freeze(capabilities.filter((capability) => capability.status === "limited"));
}
export function findRequiredDirectorRuntimeIntegrationPlatformCapabilities(
  capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[],
): readonly DirectorRuntimeIntegrationPlatformCapability[] {
  return Object.freeze(capabilities.filter((capability) => capability.required));
}
export function isDirectorRuntimeIntegrationPlatformCapabilityAvailable(
  capabilities: readonly DirectorRuntimeIntegrationPlatformCapability[],
  kind: DirectorRuntimeIntegrationPlatformCapabilityKind,
): boolean {
  return findDirectorRuntimeIntegrationPlatformCapabilityByKind(capabilities, kind)?.status === "available";
}

// ─── Platform registry, canonical fixture, and verification ────────────────

export const directorRuntimeIntegrationPlatformRegistry = Object.freeze([
  "Identity", "Upstream Certification", "Identity Chain", "Platform Status",
  "Capability Kinds", "Capability Statuses", "Platform Manifest",
  "Platform Composition", "Platform Readiness", "Foundation Capability",
  "Contracts Capability", "Mapping Capability", "Binding Capability",
  "Validation Capability", "Certification Capability", "Runtime Authority",
  "Integration Direction", "Guarantees", "Limitations", "Consumer Information",
  "Verification",
].map((concept, index) => Object.freeze({ order: index + 1, concept })));
export const directorRuntimeIntegrationPlatformRegistryCount =
  directorRuntimeIntegrationPlatformRegistry.length;

const canonicalCertificationReport = certifyDirectorRuntimeIntegration(
  directorRuntimeCanonicalCertificationFixture,
);

export const directorRuntimeIntegrationPlatform =
  createDirectorRuntimeIntegrationPlatform({
    platformId: directorRuntimeIntegrationPlatformIdentity,
    compositionId: "dri-1:7-canonical-platform-composition",
    certificationReport: canonicalCertificationReport,
    capabilities: directorRuntimeIntegrationPlatformCapabilityRegistry,
  });

export function getDirectorRuntimeIntegrationPlatformRegistry(): typeof directorRuntimeIntegrationPlatformRegistry {
  return directorRuntimeIntegrationPlatformRegistry;
}

export function verifyDirectorRuntimeIntegrationPlatform(
  platform: DirectorRuntimeIntegrationPlatform = directorRuntimeIntegrationPlatform,
  identityChain: readonly string[] = directorRuntimeIntegrationPlatformIdentityChain,
  registry: readonly { readonly order: number; readonly concept: string }[] =
    directorRuntimeIntegrationPlatformRegistry,
): boolean {
  const capabilityKinds = platform.capabilities.map((capability) => capability.kind);
  return platform.manifest.platformId === directorRuntimeIntegrationPlatformIdentity &&
    platform.manifest.version === "1.7.0" &&
    platform.manifest.namespace === "nexora.dri.runtime.integration.platform" &&
    platform.manifest.layer === "DRI" && platform.manifest.phase === "DRI-1" &&
    platform.manifest.stage === "Platform" &&
    platform.manifest.upstreamIdentity === directorRuntimeIntegrationCertificationIdentity &&
    platform.manifest.direction === "runtime-to-director" &&
    platform.manifest.authority === "Runtime is authoritative operational and business state" &&
    platform.manifest.readinessTarget === "DRI-1:8/DirectorRuntimeIntegrationAdapter" &&
    platform.readiness.ready && acceptableCertification(platform.certificationReport) &&
    capabilityKinds.length === DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS.length &&
    new Set(capabilityKinds).size === capabilityKinds.length &&
    DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS.every((kind) => capabilityKinds.includes(kind)) &&
    identityChain.length === 7 &&
    identityChain.every((identity, index) => identity === directorRuntimeIntegrationPlatformIdentityChain[index]) &&
    directorRuntimeIntegrationPlatformGuaranteeCount === directorRuntimeIntegrationPlatformGuarantees.length &&
    directorRuntimeIntegrationPlatformLimitationCount === directorRuntimeIntegrationPlatformLimitations.length &&
    registry.length === directorRuntimeIntegrationPlatformRegistryCount &&
    registry.every((entry, index) => entry.order === index + 1 && entry.concept === directorRuntimeIntegrationPlatformRegistry[index]?.concept) &&
    directorRuntimeIntegrationPlatformCapabilityRegistryCount === directorRuntimeIntegrationPlatformCapabilityRegistry.length &&
    platform.compatibility.runtimeAuthorityRequired &&
    platform.compatibility.liveSynchronizationSupported === false &&
    platform.compatibility.renderingSupported === false &&
    platform.compatibility.reverseWriteBackSupported === false &&
    verifyDirectorRuntimeIntegrationCertification();
}
