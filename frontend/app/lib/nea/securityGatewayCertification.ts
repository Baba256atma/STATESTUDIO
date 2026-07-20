/**
 * NEA-4:7 — Security Gateway Certification.
 *
 * Canonical immutable certification surface for the Security Gateway Platform.
 * Consumes only NEA-4:6 Security Gateway Platform public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by NEA-4:7.
 *
 * Public exports (exactly 8):
 *   SecurityGatewayCertificationId
 *   SecurityGatewayCertificationVersion
 *   SecurityGatewayCertificationName
 *   SecurityGatewayCertificationNamespace
 *   SecurityGatewayCertificationStatus
 *   SecurityGatewayCertificationReadiness
 *   SecurityGatewayCertificationPlatform
 *   getSecurityGatewayCertificationSummary()
 */

import {
  SecurityGatewayPlatform,
  SecurityGatewayPlatformId,
  SecurityGatewayPlatformVersion,
} from "./securityGatewayPlatform.ts";
import { SecurityGatewayCertificationComplianceCatalog } from "./securityGatewayCertificationCompliance.ts";
import { SecurityGatewayCertificationGateCatalog } from "./securityGatewayCertificationGates.ts";
import {
  SecurityGatewayCertificationMetadata,
  SecurityGatewayCertificationReadinessValue,
} from "./securityGatewayCertificationMetadata.ts";
import {
  SecurityGatewayCertificationBoundaries,
  SecurityGatewayCertificationOwnership,
} from "./securityGatewayCertificationOwnership.ts";
import { buildSecurityGatewayCertificationSummary } from "./securityGatewayCertificationSummary.ts";
import type {
  SecurityGatewayCertificationIdentity,
  SecurityGatewayCertificationSummary,
} from "./securityGatewayCertificationTypes.ts";

/** Canonical certification identity. */
export const SecurityGatewayCertificationId =
  "NEA-4:7/SecurityGatewayCertification" as const;

/** Human-readable certification name. */
export const SecurityGatewayCertificationName =
  "Security Gateway Certification" as const;

/** Semantic version. */
export const SecurityGatewayCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SecurityGatewayCertificationNamespace =
  "nexora.nea.security-gateway.certification" as const;

/** Certification status. */
export const SecurityGatewayCertificationStatus = "Certification" as const;

/** Immediate next-phase readiness. */
export const SecurityGatewayCertificationReadiness =
  SecurityGatewayCertificationReadinessValue;

const identity: SecurityGatewayCertificationIdentity = Object.freeze({
  certificationId: SecurityGatewayCertificationId,
  certificationName: SecurityGatewayCertificationName,
  certificationVersion: SecurityGatewayCertificationVersion,
  certificationNamespace: SecurityGatewayCertificationNamespace,
  layer: "NEA" as const,
  phase: "NEA-4:7" as const,
  stage: "Certification" as const,
  sourcePhase: "NEA-4:7" as const,
  owner: "NEA-4 Security Gateway",
  status: SecurityGatewayCertificationStatus,
  readiness: SecurityGatewayCertificationReadiness,
  platformId: SecurityGatewayPlatformId,
  platformVersion: SecurityGatewayPlatformVersion,
  description:
    "Immutable certification architecture declaring Security Gateway Platform compliance across Foundation through Platform.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-4:7/Dependency/NEA46Platform",
  directPreviousPhaseModule: "securityGatewayPlatform.ts" as const,
  platformOnly: true as const,
  platformId: SecurityGatewayPlatformId,
  platformVersion: SecurityGatewayPlatformVersion,
  platformPublicSurfaceOnly: true as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesPlatformArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-4:7 → NEA-4:6 SecurityGatewayPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "gates",
  "compliance",
  "metadata",
  "ownership",
  "boundaries",
  "summary",
  "readiness",
] as const);

const certificationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-4:7/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-4:7" as const,
    section: "Certification" as const,
    kind,
    version: SecurityGatewayCertificationVersion,
    status: SecurityGatewayCertificationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "securityGatewayCertification.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SecurityGatewayCertificationApiRegistry = Object.freeze([
  certificationApi("SecurityGatewayCertificationId", "IdentityConstant"),
  certificationApi("SecurityGatewayCertificationVersion", "IdentityConstant"),
  certificationApi("SecurityGatewayCertificationName", "IdentityConstant"),
  certificationApi(
    "SecurityGatewayCertificationNamespace",
    "IdentityConstant",
  ),
  certificationApi("SecurityGatewayCertificationStatus", "MetadataConstant"),
  certificationApi(
    "SecurityGatewayCertificationReadiness",
    "MetadataConstant",
  ),
  certificationApi("SecurityGatewayCertificationPlatform", "Aggregate"),
  certificationApi("getSecurityGatewayCertificationSummary", "Helper"),
]);

/**
 * Canonical immutable Security Gateway Certification platform.
 * Nine ordered sections. Metadata only.
 */
export const SecurityGatewayCertificationPlatform = Object.freeze({
  identity,
  dependency,
  gates: SecurityGatewayCertificationGateCatalog,
  compliance: SecurityGatewayCertificationComplianceCatalog,
  metadata: SecurityGatewayCertificationMetadata,
  ownership: SecurityGatewayCertificationOwnership,
  boundaries: SecurityGatewayCertificationBoundaries,
  summary: buildSecurityGatewayCertificationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-4:7/CertificationReadiness",
    readiness: SecurityGatewayCertificationReadiness,
    nextPhase: SecurityGatewayCertificationMetadata.nextPhase,
    certificationOutcome:
      SecurityGatewayCertificationMetadata.certificationOutcome,
    claimsReadyForPublicIndex: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SecurityGatewayCertificationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SecurityGatewayCertificationStatus,
  nextPhase: SecurityGatewayCertificationMetadata.nextPhase,
  downstreamReadiness: SecurityGatewayCertificationReadiness,
  platform: SecurityGatewayPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  evaluatesPermissions: false as const,
  implementsEncryption: false as const,
  runtimeSecurity: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Security Gateway Certification summary.
 * Counts are derived exclusively from canonical certification collections.
 */
export function getSecurityGatewayCertificationSummary(): SecurityGatewayCertificationSummary {
  return buildSecurityGatewayCertificationSummary();
}
