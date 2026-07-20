/**
 * NEA-1:8 — Executive Gateway Freeze Metadata.
 *
 * Immutable freeze metadata and summary helpers.
 * Counts and certification outcome are derived exclusively from Certification.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:8.
 */

import {
  ExecutiveGatewayCertificationId,
  ExecutiveGatewayCertificationPlatform,
  getExecutiveGatewayCertificationSummary,
} from "./executiveGatewayCertification.ts";
import { ExecutiveGatewayFreezeCompatibilityCatalog } from "./executiveGatewayFreezeCompatibility.ts";
import { ExecutiveGatewayFreezeExtensionPolicy } from "./executiveGatewayFreezeExtensions.ts";
import {
  ExecutiveGatewayFreezeAllLocksActive,
  ExecutiveGatewayFreezeLockCatalog,
} from "./executiveGatewayFreezeLocks.ts";
import { ExecutiveGatewayFreezeRegistryCatalog } from "./executiveGatewayFreezeRegistry.ts";
import type { ExecutiveGatewayFreezeSummary } from "./executiveGatewayFreezeTypes.ts";

/** Canonical readiness value. */
export const ExecutiveGatewayFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Ownership surfaces owned by Freeze. */
export const EXECUTIVE_GATEWAY_FREEZE_OWNS = Object.freeze([
  "Freeze State",
  "Freeze Metadata",
  "Compatibility Metadata",
  "Extension Metadata",
  "Certified Platform Reference",
  "Freeze Locks",
  "Freeze Summary",
] as const);

/** Surfaces Freeze does not own. */
export const EXECUTIVE_GATEWAY_FREEZE_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
  "Platform Composition",
  "Certification Gates",
  "Runtime Processing",
  "Connectors",
  "Persistence",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

/** Prohibited Freeze surfaces. */
export const EXECUTIVE_GATEWAY_FREEZE_PROHIBITED_SURFACES = Object.freeze([
  "Runtime processing",
  "Runtime validation",
  "Runtime certification",
  "Runtime freeze logic",
  "Authentication",
  "Authorization",
  "Routing",
  "Connectors",
  "HTTP",
  "REST",
  "Webhooks",
  "Telegram Bot",
  "WhatsApp API",
  "Slack API",
  "Teams API",
  "Email Client",
  "Voice Processing",
  "SDK Runtime",
  "MCP Runtime",
  "Database",
  "Queue",
  "Event Bus",
  "AI",
  "LLM",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "Advisor",
  "Director",
  "EVE",
  "React",
  "Next.js",
] as const);

/** Canonical immutable freeze ownership. */
export const ExecutiveGatewayFreezeOwnership = Object.freeze({
  ownershipId: "NEA-1:8/ExecutiveGatewayFreezeOwnership",
  sourcePhase: "NEA-1:8" as const,
  owns: EXECUTIVE_GATEWAY_FREEZE_OWNS,
  doesNotOwn: EXECUTIVE_GATEWAY_FREEZE_DOES_NOT_OWN,
  ownsCount: EXECUTIVE_GATEWAY_FREEZE_OWNS.length,
  doesNotOwnCount: EXECUTIVE_GATEWAY_FREEZE_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsPlatformComposition: false as const,
  ownsCertificationGates: false as const,
  ownsRuntimeProcessing: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze boundaries. */
export const ExecutiveGatewayFreezeBoundaries = Object.freeze({
  boundariesId: "NEA-1:8/ExecutiveGatewayFreezeBoundaries",
  sourcePhase: "NEA-1:8" as const,
  consumes: Object.freeze([
    "NEA-1:7 Executive Gateway Certification",
  ] as const),
  provides: Object.freeze(["Executive Gateway Freeze"] as const),
  prohibitedSurfaces: EXECUTIVE_GATEWAY_FREEZE_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    EXECUTIVE_GATEWAY_FREEZE_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze metadata. */
export const ExecutiveGatewayFreezeMetadata = Object.freeze({
  metadataId: "NEA-1:8/ExecutiveGatewayFreezeMetadata",
  sourcePhase: "NEA-1:8" as const,
  freezeStatus: "Freeze" as const,
  freezeVersion: "1.0.0" as const,
  certifiedPlatformReference:
    ExecutiveGatewayFreezeRegistryCatalog.certifiedPlatformReference
      .referenceId,
  certificationId: ExecutiveGatewayCertificationId,
  certificationOutcome:
    ExecutiveGatewayCertificationPlatform.metadata.certificationOutcome,
  readiness: ExecutiveGatewayFreezeReadinessValue,
  nextPhase: "NEA-1:9 — Executive Gateway Public Index",
  lockSummary: Object.freeze({
    lockCount: ExecutiveGatewayFreezeLockCatalog.lockCount,
    lockedLockCount: ExecutiveGatewayFreezeLockCatalog.lockedLockCount,
    allLocksActive: ExecutiveGatewayFreezeAllLocksActive,
  }),
  compatibilitySummary: Object.freeze({
    compatibilityCount:
      ExecutiveGatewayFreezeCompatibilityCatalog.compatibilityCount,
    allCompatible: ExecutiveGatewayFreezeCompatibilityCatalog.allCompatible,
  }),
  componentCount: ExecutiveGatewayFreezeRegistryCatalog.componentCount,
  allowedExtensionCount:
    ExecutiveGatewayFreezeExtensionPolicy.allowedExtensionCount,
  forbiddenExtensionCount:
    ExecutiveGatewayFreezeExtensionPolicy.forbiddenExtensionCount,
  ownershipCount: ExecutiveGatewayFreezeOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewayFreezeOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewayFreezeBoundaries.prohibitedSurfaceCount,
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
export const EXECUTIVE_GATEWAY_FREEZE_SUMMARY_IDENTITY = Object.freeze({
  freezeId: "NEA-1:8/ExecutiveGatewayFreeze" as const,
  name: "Executive Gateway Freeze" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.executive-gateway.freeze" as const,
  publicExportCount: 8 as const,
  sectionCount: 11 as const,
});

/**
 * Build deterministic frozen Freeze summary.
 * Derived exclusively from Certification and Freeze catalogs.
 */
export function buildExecutiveGatewayFreezeSummary(): ExecutiveGatewayFreezeSummary {
  const identity = EXECUTIVE_GATEWAY_FREEZE_SUMMARY_IDENTITY;
  const meta = ExecutiveGatewayFreezeMetadata;
  const certificationSummary = getExecutiveGatewayCertificationSummary();
  return Object.freeze({
    freezeId: identity.freezeId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-1:8" as const,
    status: "Freeze" as const,
    readiness: meta.readiness,
    certificationId: certificationSummary.certificationId,
    certificationOutcome: certificationSummary.certificationOutcome,
    lockCount: meta.lockSummary.lockCount,
    lockedLockCount: meta.lockSummary.lockedLockCount,
    compatibilityCount: meta.compatibilitySummary.compatibilityCount,
    componentCount: meta.componentCount,
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
