/**
 * NEA-5:8 — Gateway Routing Freeze Metadata.
 *
 * Immutable freeze metadata and summary helpers.
 * Counts and certification outcome are derived exclusively from Certification.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:8.
 */

import {
  GatewayRoutingCertificationId,
  GatewayRoutingCertificationPlatform,
  getGatewayRoutingCertificationSummary,
} from "./gatewayRoutingCertification.ts";
import { GatewayRoutingFreezeCompatibilityCatalog } from "./gatewayRoutingFreezeCompatibility.ts";
import { GatewayRoutingFreezeExtensionPolicy } from "./gatewayRoutingFreezeExtensions.ts";
import {
  GatewayRoutingFreezeAllLocksActive,
  GatewayRoutingFreezeLockCatalog,
} from "./gatewayRoutingFreezeLocks.ts";
import { GatewayRoutingFreezeRegistryCatalog } from "./gatewayRoutingFreezeRegistry.ts";
import type { GatewayRoutingFreezeSummary } from "./gatewayRoutingFreezeTypes.ts";

/** Canonical readiness value. */
export const GatewayRoutingFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Ownership surfaces owned by Freeze. */
export const GATEWAY_ROUTING_FREEZE_OWNS = Object.freeze([
  "Freeze Metadata",
  "Freeze Locks",
  "Compatibility Declarations",
  "Extension Policy",
  "Freeze Summary",
] as const);

/** Surfaces Freeze does not own. */
export const GATEWAY_ROUTING_FREEZE_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventories",
  "Platform Composition",
  "Certification Gates",
  "Runtime Routing",
  "Runtime Validation",
  "Runtime Certification",
  "Routing Algorithms",
  "Consumer Selection",
  "DKL",
  "Executive Engine",
  "Advisor",
  "Director",
  "EVE",
  "Persistence",
  "Networking",
] as const);

/** Prohibited Freeze surfaces. */
export const GATEWAY_ROUTING_FREEZE_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Freeze",
  "Runtime Routing",
  "Runtime Validation",
  "Runtime Certification",
  "Routing Algorithms",
  "Strategy Execution",
  "Consumer Selection",
  "Message Processing",
  "Connector Execution",
  "HTTP",
  "REST",
  "WebSockets",
  "Database",
  "Queue",
  "Event Bus",
  "Authentication",
  "Authorization",
  "AI",
  "LLM",
  "DKL invocation",
  "Executive Engine invocation",
  "Advisor invocation",
  "Director invocation",
  "EVE invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable freeze ownership. */
export const GatewayRoutingFreezeOwnership = Object.freeze({
  ownershipId: "NEA-5:8/GatewayRoutingFreezeOwnership",
  sourcePhase: "NEA-5:8" as const,
  owns: GATEWAY_ROUTING_FREEZE_OWNS,
  doesNotOwn: GATEWAY_ROUTING_FREEZE_DOES_NOT_OWN,
  ownsCount: GATEWAY_ROUTING_FREEZE_OWNS.length,
  doesNotOwnCount: GATEWAY_ROUTING_FREEZE_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsPlatformComposition: false as const,
  ownsCertificationGates: false as const,
  ownsRuntimeRouting: false as const,
  ownsRuntimeValidation: false as const,
  ownsRuntimeCertification: false as const,
  ownsRoutingAlgorithms: false as const,
  ownsConsumerSelection: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze boundaries. */
export const GatewayRoutingFreezeBoundaries = Object.freeze({
  boundariesId: "NEA-5:8/GatewayRoutingFreezeBoundaries",
  sourcePhase: "NEA-5:8" as const,
  consumes: Object.freeze([
    "NEA-5:7 Gateway Routing Certification",
  ] as const),
  provides: Object.freeze(["Gateway Routing Freeze"] as const),
  prohibitedSurfaces: GATEWAY_ROUTING_FREEZE_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: GATEWAY_ROUTING_FREEZE_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  executesStrategies: false as const,
  implementsConsumerSelection: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  invokesAdvisor: false as const,
  invokesDirector: false as const,
  invokesEve: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze metadata. */
export const GatewayRoutingFreezeMetadata = Object.freeze({
  metadataId: "NEA-5:8/GatewayRoutingFreezeMetadata",
  sourcePhase: "NEA-5:8" as const,
  freezeStatus: "Freeze" as const,
  freezeVersion: "1.0.0" as const,
  freezeNamespace: "nexora.nea.gateway-routing.freeze" as const,
  certifiedPlatformReference:
    GatewayRoutingFreezeRegistryCatalog.certifiedPlatformReference.referenceId,
  certificationId: GatewayRoutingCertificationId,
  certificationOutcome:
    GatewayRoutingCertificationPlatform.metadata.certificationOutcome,
  readiness: GatewayRoutingFreezeReadinessValue,
  nextPhase: "NEA-5:9 — Gateway Routing Public Index",
  lockSummary: Object.freeze({
    lockCount: GatewayRoutingFreezeLockCatalog.lockCount,
    lockedLockCount: GatewayRoutingFreezeLockCatalog.lockedLockCount,
    allLocksActive: GatewayRoutingFreezeAllLocksActive,
  }),
  compatibilitySummary: Object.freeze({
    compatibilityCount:
      GatewayRoutingFreezeCompatibilityCatalog.compatibilityCount,
    allCompatible: GatewayRoutingFreezeCompatibilityCatalog.allCompatible,
  }),
  componentCount: GatewayRoutingFreezeRegistryCatalog.componentCount,
  routeIdentityCount: GatewayRoutingFreezeRegistryCatalog.routeIdentityCount,
  domainModelCount: GatewayRoutingFreezeRegistryCatalog.domainModelCount,
  allowedExtensionCount:
    GatewayRoutingFreezeExtensionPolicy.allowedExtensionCount,
  forbiddenExtensionCount:
    GatewayRoutingFreezeExtensionPolicy.forbiddenExtensionCount,
  ownershipCount: GatewayRoutingFreezeOwnership.ownsCount,
  nonOwnershipCount: GatewayRoutingFreezeOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    GatewayRoutingFreezeBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  derivedFromCertification: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Freeze identity constants used by summary composition. */
export const GATEWAY_ROUTING_FREEZE_SUMMARY_IDENTITY = Object.freeze({
  freezeId: "NEA-5:8/GatewayRoutingFreeze" as const,
  name: "Gateway Routing Freeze" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.gateway-routing.freeze" as const,
  publicExportCount: 8 as const,
  sectionCount: 11 as const,
});

/**
 * Build deterministic frozen Freeze summary.
 * Derived exclusively from Certification and Freeze catalogs.
 */
export function buildGatewayRoutingFreezeSummary(): GatewayRoutingFreezeSummary {
  const identity = GATEWAY_ROUTING_FREEZE_SUMMARY_IDENTITY;
  const meta = GatewayRoutingFreezeMetadata;
  const certificationSummary = getGatewayRoutingCertificationSummary();
  return Object.freeze({
    freezeId: identity.freezeId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-5:8" as const,
    status: "Freeze" as const,
    readiness: meta.readiness,
    certificationId: certificationSummary.certificationId,
    certificationOutcome: certificationSummary.certificationOutcome,
    lockCount: meta.lockSummary.lockCount,
    lockedLockCount: meta.lockSummary.lockedLockCount,
    compatibilityCount: meta.compatibilitySummary.compatibilityCount,
    componentCount: meta.componentCount,
    routeIdentityCount: meta.routeIdentityCount,
    domainModelCount: meta.domainModelCount,
    allowedExtensionCount: meta.allowedExtensionCount,
    forbiddenExtensionCount: meta.forbiddenExtensionCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
