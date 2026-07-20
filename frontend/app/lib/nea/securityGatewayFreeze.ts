/**
 * NEA-4:8 — Security Gateway Freeze.
 *
 * Canonical immutable freeze surface for certified Security Gateway.
 * Consumes only NEA-4:7 Security Gateway Certification public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by NEA-4:8.
 *
 * Public exports (exactly 8):
 *   SecurityGatewayFreezeId
 *   SecurityGatewayFreezeVersion
 *   SecurityGatewayFreezeName
 *   SecurityGatewayFreezeNamespace
 *   SecurityGatewayFreezeStatus
 *   SecurityGatewayFreezeReadiness
 *   SecurityGatewayFreezePlatform
 *   getSecurityGatewayFreezeSummary()
 */

import {
  SecurityGatewayCertificationId,
  SecurityGatewayCertificationPlatform,
  SecurityGatewayCertificationVersion,
} from "./securityGatewayCertification.ts";
import { SecurityGatewayFreezeCompatibilityCatalog } from "./securityGatewayFreezeCompatibility.ts";
import { SecurityGatewayFreezeExtensionPolicy } from "./securityGatewayFreezeExtensions.ts";
import { SecurityGatewayFreezeLockCatalog } from "./securityGatewayFreezeLocks.ts";
import {
  buildSecurityGatewayFreezeSummary,
  SecurityGatewayFreezeBoundaries,
  SecurityGatewayFreezeMetadata,
  SecurityGatewayFreezeOwnership,
  SecurityGatewayFreezeReadinessValue,
} from "./securityGatewayFreezeMetadata.ts";
import { SecurityGatewayFreezeRegistryCatalog } from "./securityGatewayFreezeRegistry.ts";
import type {
  SecurityGatewayFreezeIdentity,
  SecurityGatewayFreezeSummary,
} from "./securityGatewayFreezeTypes.ts";

/** Canonical freeze identity. */
export const SecurityGatewayFreezeId =
  "NEA-4:8/SecurityGatewayFreeze" as const;

/** Human-readable freeze name. */
export const SecurityGatewayFreezeName = "Security Gateway Freeze" as const;

/** Semantic version. */
export const SecurityGatewayFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SecurityGatewayFreezeNamespace =
  "nexora.nea.security-gateway.freeze" as const;

/** Freeze status. */
export const SecurityGatewayFreezeStatus = "Freeze" as const;

/** Immediate next-phase readiness. */
export const SecurityGatewayFreezeReadiness =
  SecurityGatewayFreezeReadinessValue;

const identity: SecurityGatewayFreezeIdentity = Object.freeze({
  freezeId: SecurityGatewayFreezeId,
  freezeName: SecurityGatewayFreezeName,
  freezeVersion: SecurityGatewayFreezeVersion,
  freezeNamespace: SecurityGatewayFreezeNamespace,
  layer: "NEA" as const,
  phase: "NEA-4:8" as const,
  stage: "Freeze" as const,
  sourcePhase: "NEA-4:8" as const,
  owner: "NEA-4 Security Gateway",
  status: SecurityGatewayFreezeStatus,
  readiness: SecurityGatewayFreezeReadiness,
  certificationId: SecurityGatewayCertificationId,
  certificationVersion: SecurityGatewayCertificationVersion,
  description:
    "Immutable freeze layer permanently locking the certified Security Gateway architecture as the sole frozen baseline for Public Index consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-4:8/Dependency/NEA47Certification",
  directPreviousPhaseModule: "securityGatewayCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: SecurityGatewayCertificationId,
  certificationVersion: SecurityGatewayCertificationVersion,
  certificationPublicSurfaceOnly: true as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  reconstructsCertification: false as const,
  reconstructsPlatform: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-4:8 → NEA-4:7 SecurityGatewayCertificationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "registry",
  "locks",
  "compatibility",
  "extensions",
  "metadata",
  "ownership",
  "boundaries",
  "summary",
  "readiness",
] as const);

const freezeApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-4:8/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-4:8" as const,
    section: "Freeze" as const,
    kind,
    version: SecurityGatewayFreezeVersion,
    status: SecurityGatewayFreezeStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "securityGatewayFreeze.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SecurityGatewayFreezeApiRegistry = Object.freeze([
  freezeApi("SecurityGatewayFreezeId", "IdentityConstant"),
  freezeApi("SecurityGatewayFreezeVersion", "IdentityConstant"),
  freezeApi("SecurityGatewayFreezeName", "IdentityConstant"),
  freezeApi("SecurityGatewayFreezeNamespace", "IdentityConstant"),
  freezeApi("SecurityGatewayFreezeStatus", "MetadataConstant"),
  freezeApi("SecurityGatewayFreezeReadiness", "MetadataConstant"),
  freezeApi("SecurityGatewayFreezePlatform", "Aggregate"),
  freezeApi("getSecurityGatewayFreezeSummary", "Helper"),
]);

/**
 * Canonical immutable Security Gateway Freeze platform.
 * Metadata only. Certified architecture preserved by reference.
 */
export const SecurityGatewayFreezePlatform = Object.freeze({
  identity,
  dependency,
  registry: SecurityGatewayFreezeRegistryCatalog,
  locks: SecurityGatewayFreezeLockCatalog,
  compatibility: SecurityGatewayFreezeCompatibilityCatalog,
  extensions: SecurityGatewayFreezeExtensionPolicy,
  metadata: SecurityGatewayFreezeMetadata,
  ownership: SecurityGatewayFreezeOwnership,
  boundaries: SecurityGatewayFreezeBoundaries,
  summary: buildSecurityGatewayFreezeSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-4:8/FreezeReadiness",
    readiness: SecurityGatewayFreezeReadiness,
    nextPhase: SecurityGatewayFreezeMetadata.nextPhase,
    allLocksActive: SecurityGatewayFreezeLockCatalog.allLocksActive,
    allCompatible: SecurityGatewayFreezeCompatibilityCatalog.allCompatible,
    certificationOutcome:
      SecurityGatewayCertificationPlatform.metadata.certificationOutcome,
    claimsReadyForPublicIndex: true as const,
    claimsPublicIndexPublished: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SecurityGatewayFreezeApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SecurityGatewayFreezeStatus,
  nextPhase: SecurityGatewayFreezeMetadata.nextPhase,
  downstreamReadiness: SecurityGatewayFreezeReadiness,
  certification: SecurityGatewayCertificationPlatform,
  certifiedPlatformReference:
    SecurityGatewayFreezeRegistryCatalog.certifiedPlatformReference,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsEncryption: false as const,
  runtimeSecurity: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Security Gateway Freeze summary.
 * Counts are derived exclusively from Certification and Freeze catalogs.
 */
export function getSecurityGatewayFreezeSummary(): SecurityGatewayFreezeSummary {
  return buildSecurityGatewayFreezeSummary();
}
