/**
 * NEA-1:7 — Executive Gateway Certification.
 *
 * Canonical immutable certification surface for the Executive Gateway Platform.
 * Consumes only NEA-1:6 Executive Gateway Platform public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by NEA-1:7.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewayCertificationId
 *   ExecutiveGatewayCertificationVersion
 *   ExecutiveGatewayCertificationName
 *   ExecutiveGatewayCertificationNamespace
 *   ExecutiveGatewayCertificationStatus
 *   ExecutiveGatewayCertificationReadiness
 *   ExecutiveGatewayCertificationPlatform
 *   getExecutiveGatewayCertificationSummary()
 */

import {
  ExecutiveGatewayPlatform,
  ExecutiveGatewayPlatformId,
  ExecutiveGatewayPlatformVersion,
} from "./executiveGatewayPlatform.ts";
import { ExecutiveGatewayCertificationComplianceCatalog } from "./executiveGatewayCertificationCompliance.ts";
import { ExecutiveGatewayCertificationGateCatalog } from "./executiveGatewayCertificationGates.ts";
import {
  ExecutiveGatewayCertificationMetadata,
  ExecutiveGatewayCertificationReadinessValue,
} from "./executiveGatewayCertificationMetadata.ts";
import {
  ExecutiveGatewayCertificationBoundaries,
  ExecutiveGatewayCertificationOwnership,
} from "./executiveGatewayCertificationOwnership.ts";
import { buildExecutiveGatewayCertificationSummary } from "./executiveGatewayCertificationSummary.ts";
import type {
  ExecutiveGatewayCertificationIdentity,
  ExecutiveGatewayCertificationSummary,
} from "./executiveGatewayCertificationTypes.ts";

/** Canonical certification identity. */
export const ExecutiveGatewayCertificationId =
  "NEA-1:7/ExecutiveGatewayCertification" as const;

/** Human-readable certification name. */
export const ExecutiveGatewayCertificationName =
  "Executive Gateway Certification" as const;

/** Semantic version. */
export const ExecutiveGatewayCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewayCertificationNamespace =
  "nexora.nea.executive-gateway.certification" as const;

/** Certification status. */
export const ExecutiveGatewayCertificationStatus = "Certification" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewayCertificationReadiness =
  ExecutiveGatewayCertificationReadinessValue;

const identity: ExecutiveGatewayCertificationIdentity = Object.freeze({
  certificationId: ExecutiveGatewayCertificationId,
  certificationName: ExecutiveGatewayCertificationName,
  certificationVersion: ExecutiveGatewayCertificationVersion,
  certificationNamespace: ExecutiveGatewayCertificationNamespace,
  layer: "NEA" as const,
  phase: "NEA-1:7" as const,
  stage: "Certification" as const,
  sourcePhase: "NEA-1:7" as const,
  owner: "NEA-1 Executive Gateway",
  status: ExecutiveGatewayCertificationStatus,
  readiness: ExecutiveGatewayCertificationReadiness,
  platformId: ExecutiveGatewayPlatformId,
  platformVersion: ExecutiveGatewayPlatformVersion,
  description:
    "Immutable certification architecture declaring Executive Gateway Platform compliance across Foundation through Platform.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-1:7/Dependency/NEA16Platform",
  directPreviousPhaseModule: "executiveGatewayPlatform.ts" as const,
  platformOnly: true as const,
  platformId: ExecutiveGatewayPlatformId,
  platformVersion: ExecutiveGatewayPlatformVersion,
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
  canonicalPath: "NEA-1:7 → NEA-1:6 ExecutiveGatewayPlatform (exclusive)",
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
    id: `NEA-1:7/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-1:7" as const,
    section: "Certification" as const,
    kind,
    version: ExecutiveGatewayCertificationVersion,
    status: ExecutiveGatewayCertificationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewayCertification.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewayCertificationApiRegistry = Object.freeze([
  certificationApi("ExecutiveGatewayCertificationId", "IdentityConstant"),
  certificationApi("ExecutiveGatewayCertificationVersion", "IdentityConstant"),
  certificationApi("ExecutiveGatewayCertificationName", "IdentityConstant"),
  certificationApi("ExecutiveGatewayCertificationNamespace", "IdentityConstant"),
  certificationApi("ExecutiveGatewayCertificationStatus", "MetadataConstant"),
  certificationApi("ExecutiveGatewayCertificationReadiness", "MetadataConstant"),
  certificationApi("ExecutiveGatewayCertificationPlatform", "Aggregate"),
  certificationApi("getExecutiveGatewayCertificationSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Certification platform.
 * Nine ordered sections. Metadata only.
 */
export const ExecutiveGatewayCertificationPlatform = Object.freeze({
  identity,
  dependency,
  gates: ExecutiveGatewayCertificationGateCatalog,
  compliance: ExecutiveGatewayCertificationComplianceCatalog,
  metadata: ExecutiveGatewayCertificationMetadata,
  ownership: ExecutiveGatewayCertificationOwnership,
  boundaries: ExecutiveGatewayCertificationBoundaries,
  summary: buildExecutiveGatewayCertificationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-1:7/CertificationReadiness",
    readiness: ExecutiveGatewayCertificationReadiness,
    nextPhase: ExecutiveGatewayCertificationMetadata.nextPhase,
    certificationOutcome:
      ExecutiveGatewayCertificationMetadata.certificationOutcome,
    claimsReadyForPublicIndex: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ExecutiveGatewayCertificationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewayCertificationStatus,
  nextPhase: ExecutiveGatewayCertificationMetadata.nextPhase,
  downstreamReadiness: ExecutiveGatewayCertificationReadiness,
  platform: ExecutiveGatewayPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  authenticationExecution: false as const,
  authorizationExecution: false as const,
  routingExecution: false as const,
  connectorImplementation: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Certification summary.
 * Counts are derived exclusively from canonical certification collections.
 */
export function getExecutiveGatewayCertificationSummary(): ExecutiveGatewayCertificationSummary {
  return buildExecutiveGatewayCertificationSummary();
}
