/**
 * NEA-4:8 — Security Gateway Freeze Metadata.
 *
 * Immutable freeze metadata and summary helpers.
 * Counts and certification outcome are derived exclusively from Certification.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:8.
 */

import {
  SecurityGatewayCertificationId,
  SecurityGatewayCertificationPlatform,
  getSecurityGatewayCertificationSummary,
} from "./securityGatewayCertification.ts";
import { SecurityGatewayFreezeCompatibilityCatalog } from "./securityGatewayFreezeCompatibility.ts";
import { SecurityGatewayFreezeExtensionPolicy } from "./securityGatewayFreezeExtensions.ts";
import {
  SecurityGatewayFreezeAllLocksActive,
  SecurityGatewayFreezeLockCatalog,
} from "./securityGatewayFreezeLocks.ts";
import { SecurityGatewayFreezeRegistryCatalog } from "./securityGatewayFreezeRegistry.ts";
import type { SecurityGatewayFreezeSummary } from "./securityGatewayFreezeTypes.ts";

/** Canonical readiness value. */
export const SecurityGatewayFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Ownership surfaces owned by Freeze. */
export const SECURITY_GATEWAY_FREEZE_OWNS = Object.freeze([
  "Freeze Locks",
  "Compatibility Metadata",
  "Freeze Metadata",
  "Extension Policy",
  "Freeze Summary",
] as const);

/** Surfaces Freeze does not own. */
export const SECURITY_GATEWAY_FREEZE_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
  "Platform Composition",
  "Certification Gates",
  "Authentication",
  "Authorization",
  "Permission Evaluation",
  "Trust Evaluation",
  "Consent Enforcement",
  "Login",
  "Logout",
  "OAuth",
  "JWT",
  "MFA",
  "Encryption",
  "Secret Management",
  "Runtime Security",
  "Gateway Routing",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

/** Prohibited Freeze surfaces. */
export const SECURITY_GATEWAY_FREEZE_PROHIBITED_SURFACES = Object.freeze([
  "Authentication",
  "Authorization",
  "Permission Evaluation",
  "Trust Evaluation",
  "Consent Enforcement",
  "Login",
  "Logout",
  "OAuth",
  "JWT",
  "SAML",
  "OpenID Connect",
  "MFA",
  "Encryption",
  "Secret Management",
  "Runtime Security",
  "HTTP",
  "REST",
  "Database",
  "Queue",
  "Event Bus",
  "Gateway Routing",
  "AI / LLM",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable freeze ownership. */
export const SecurityGatewayFreezeOwnership = Object.freeze({
  ownershipId: "NEA-4:8/SecurityGatewayFreezeOwnership",
  sourcePhase: "NEA-4:8" as const,
  owns: SECURITY_GATEWAY_FREEZE_OWNS,
  doesNotOwn: SECURITY_GATEWAY_FREEZE_DOES_NOT_OWN,
  ownsCount: SECURITY_GATEWAY_FREEZE_OWNS.length,
  doesNotOwnCount: SECURITY_GATEWAY_FREEZE_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsPlatformComposition: false as const,
  ownsCertificationGates: false as const,
  ownsAuthentication: false as const,
  ownsAuthorization: false as const,
  ownsEncryption: false as const,
  ownsRuntimeSecurity: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze boundaries. */
export const SecurityGatewayFreezeBoundaries = Object.freeze({
  boundariesId: "NEA-4:8/SecurityGatewayFreezeBoundaries",
  sourcePhase: "NEA-4:8" as const,
  consumes: Object.freeze([
    "NEA-4:7 Security Gateway Certification",
  ] as const),
  provides: Object.freeze(["Security Gateway Freeze"] as const),
  prohibitedSurfaces: SECURITY_GATEWAY_FREEZE_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SECURITY_GATEWAY_FREEZE_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  evaluatesPermissions: false as const,
  implementsEncryption: false as const,
  runtimeSecurity: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
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
export const SecurityGatewayFreezeMetadata = Object.freeze({
  metadataId: "NEA-4:8/SecurityGatewayFreezeMetadata",
  sourcePhase: "NEA-4:8" as const,
  freezeVersion: "1.0.0" as const,
  freezeStatus: "Freeze" as const,
  architectureVersion:
    SecurityGatewayCertificationPlatform.platform.metadata.architectureVersion,
  certificationOutcome:
    SecurityGatewayCertificationPlatform.metadata.certificationOutcome,
  compatibilityStatus:
    SecurityGatewayFreezeCompatibilityCatalog.allCompatible
      ? ("Compatible" as const)
      : ("Incompatible" as const),
  certifiedPlatformReference:
    SecurityGatewayFreezeRegistryCatalog.certifiedPlatformReference
      .referenceId,
  certificationId: SecurityGatewayCertificationId,
  readiness: SecurityGatewayFreezeReadinessValue,
  nextPhase: "NEA-4:9 — Security Gateway Public Index",
  lockSummary: Object.freeze({
    lockCount: SecurityGatewayFreezeLockCatalog.lockCount,
    lockedLockCount: SecurityGatewayFreezeLockCatalog.lockedLockCount,
    allLocksActive: SecurityGatewayFreezeAllLocksActive,
  }),
  compatibilitySummary: Object.freeze({
    compatibilityCount:
      SecurityGatewayFreezeCompatibilityCatalog.compatibilityCount,
    allCompatible: SecurityGatewayFreezeCompatibilityCatalog.allCompatible,
  }),
  componentCount: SecurityGatewayFreezeRegistryCatalog.componentCount,
  securityIdentityCount:
    SecurityGatewayFreezeRegistryCatalog.securityIdentityCount,
  securityPolicyCount:
    SecurityGatewayFreezeRegistryCatalog.securityPolicyCount,
  permissionCount: SecurityGatewayFreezeRegistryCatalog.permissionCount,
  allowedExtensionCount:
    SecurityGatewayFreezeExtensionPolicy.allowedExtensionCount,
  allowedExtensionGroupCount:
    SecurityGatewayFreezeExtensionPolicy.allowedExtensionGroupCount,
  forbiddenExtensionCount:
    SecurityGatewayFreezeExtensionPolicy.forbiddenExtensionCount,
  ownershipCount: SecurityGatewayFreezeOwnership.ownsCount,
  nonOwnershipCount: SecurityGatewayFreezeOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SecurityGatewayFreezeBoundaries.prohibitedSurfaceCount,
  inventoryEntryCount:
    SecurityGatewayCertificationPlatform.metadata.inventoryEntryCount,
  totalArchitectureCount:
    SecurityGatewayCertificationPlatform.metadata.totalArchitectureCount,
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
export const SECURITY_GATEWAY_FREEZE_SUMMARY_IDENTITY = Object.freeze({
  freezeId: "NEA-4:8/SecurityGatewayFreeze" as const,
  name: "Security Gateway Freeze" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.security-gateway.freeze" as const,
  publicExportCount: 8 as const,
  sectionCount: 11 as const,
});

/**
 * Build deterministic frozen Freeze summary.
 * Derived exclusively from Certification and Freeze catalogs.
 */
export function buildSecurityGatewayFreezeSummary(): SecurityGatewayFreezeSummary {
  const identity = SECURITY_GATEWAY_FREEZE_SUMMARY_IDENTITY;
  const meta = SecurityGatewayFreezeMetadata;
  const certificationSummary = getSecurityGatewayCertificationSummary();
  return Object.freeze({
    freezeId: identity.freezeId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-4:8" as const,
    status: "Freeze" as const,
    readiness: meta.readiness,
    certificationId: certificationSummary.certificationId,
    certificationOutcome: certificationSummary.certificationOutcome,
    lockCount: meta.lockSummary.lockCount,
    lockedLockCount: meta.lockSummary.lockedLockCount,
    compatibilityCount: meta.compatibilitySummary.compatibilityCount,
    componentCount: meta.componentCount,
    securityIdentityCount: meta.securityIdentityCount,
    securityPolicyCount: meta.securityPolicyCount,
    permissionCount: meta.permissionCount,
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
