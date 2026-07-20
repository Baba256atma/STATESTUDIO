/**
 * NEA-5:7 — Gateway Routing Certification.
 *
 * Canonical immutable certification surface for the Gateway Routing Platform.
 * Consumes only NEA-5:6 Gateway Routing Platform public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by NEA-5:7.
 *
 * Public exports (exactly 8):
 *   GatewayRoutingCertificationId
 *   GatewayRoutingCertificationVersion
 *   GatewayRoutingCertificationName
 *   GatewayRoutingCertificationNamespace
 *   GatewayRoutingCertificationStatus
 *   GatewayRoutingCertificationReadiness
 *   GatewayRoutingCertificationPlatform
 *   getGatewayRoutingCertificationSummary()
 */

import {
  GatewayRoutingPlatform,
  GatewayRoutingPlatformId,
  GatewayRoutingPlatformVersion,
} from "./gatewayRoutingPlatform.ts";
import { GatewayRoutingCertificationComplianceCatalog } from "./gatewayRoutingCertificationCompliance.ts";
import { GatewayRoutingCertificationGateCatalog } from "./gatewayRoutingCertificationGates.ts";
import {
  GatewayRoutingCertificationMetadata,
  GatewayRoutingCertificationReadinessValue,
} from "./gatewayRoutingCertificationMetadata.ts";
import {
  GatewayRoutingCertificationBoundaries,
  GatewayRoutingCertificationOwnership,
} from "./gatewayRoutingCertificationOwnership.ts";
import { buildGatewayRoutingCertificationSummary } from "./gatewayRoutingCertificationSummary.ts";
import type {
  GatewayRoutingCertificationIdentity,
  GatewayRoutingCertificationSummary,
} from "./gatewayRoutingCertificationTypes.ts";

/** Canonical certification identity. */
export const GatewayRoutingCertificationId =
  "NEA-5:7/GatewayRoutingCertification" as const;

/** Human-readable certification name. */
export const GatewayRoutingCertificationName =
  "Gateway Routing Certification" as const;

/** Semantic version. */
export const GatewayRoutingCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const GatewayRoutingCertificationNamespace =
  "nexora.nea.gateway-routing.certification" as const;

/** Certification status. */
export const GatewayRoutingCertificationStatus = "Certification" as const;

/** Immediate next-phase readiness. */
export const GatewayRoutingCertificationReadiness =
  GatewayRoutingCertificationReadinessValue;

const identity: GatewayRoutingCertificationIdentity = Object.freeze({
  certificationId: GatewayRoutingCertificationId,
  certificationName: GatewayRoutingCertificationName,
  certificationVersion: GatewayRoutingCertificationVersion,
  certificationNamespace: GatewayRoutingCertificationNamespace,
  layer: "NEA" as const,
  phase: "NEA-5:7" as const,
  stage: "Certification" as const,
  sourcePhase: "NEA-5:7" as const,
  owner: "NEA-5 Gateway Routing",
  status: GatewayRoutingCertificationStatus,
  readiness: GatewayRoutingCertificationReadiness,
  platformId: GatewayRoutingPlatformId,
  platformVersion: GatewayRoutingPlatformVersion,
  description:
    "Immutable certification architecture declaring Gateway Routing Platform compliance across Foundation through Platform.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-5:7/Dependency/NEA56Platform",
  directPreviousPhaseModule: "gatewayRoutingPlatform.ts" as const,
  platformOnly: true as const,
  platformId: GatewayRoutingPlatformId,
  platformVersion: GatewayRoutingPlatformVersion,
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
    "NEA-5:7 → NEA-5:6 GatewayRoutingPlatform (exclusive)",
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
    id: `NEA-5:7/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-5:7" as const,
    section: "Certification" as const,
    kind,
    version: GatewayRoutingCertificationVersion,
    status: GatewayRoutingCertificationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "gatewayRoutingCertification.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const GatewayRoutingCertificationApiRegistry = Object.freeze([
  certificationApi("GatewayRoutingCertificationId", "IdentityConstant"),
  certificationApi("GatewayRoutingCertificationVersion", "IdentityConstant"),
  certificationApi("GatewayRoutingCertificationName", "IdentityConstant"),
  certificationApi("GatewayRoutingCertificationNamespace", "IdentityConstant"),
  certificationApi("GatewayRoutingCertificationStatus", "MetadataConstant"),
  certificationApi("GatewayRoutingCertificationReadiness", "MetadataConstant"),
  certificationApi("GatewayRoutingCertificationPlatform", "Aggregate"),
  certificationApi("getGatewayRoutingCertificationSummary", "Helper"),
]);

/**
 * Canonical immutable Gateway Routing Certification platform.
 * Nine ordered sections. Metadata only.
 */
export const GatewayRoutingCertificationPlatform = Object.freeze({
  identity,
  dependency,
  gates: GatewayRoutingCertificationGateCatalog,
  compliance: GatewayRoutingCertificationComplianceCatalog,
  metadata: GatewayRoutingCertificationMetadata,
  ownership: GatewayRoutingCertificationOwnership,
  boundaries: GatewayRoutingCertificationBoundaries,
  summary: buildGatewayRoutingCertificationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-5:7/CertificationReadiness",
    readiness: GatewayRoutingCertificationReadiness,
    nextPhase: GatewayRoutingCertificationMetadata.nextPhase,
    certificationOutcome:
      GatewayRoutingCertificationMetadata.certificationOutcome,
    claimsReadyForPublicIndex: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: GatewayRoutingCertificationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: GatewayRoutingCertificationStatus,
  nextPhase: GatewayRoutingCertificationMetadata.nextPhase,
  downstreamReadiness: GatewayRoutingCertificationReadiness,
  platform: GatewayRoutingPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
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
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Gateway Routing Certification summary.
 * Counts are derived exclusively from canonical certification collections.
 */
export function getGatewayRoutingCertificationSummary(): GatewayRoutingCertificationSummary {
  return buildGatewayRoutingCertificationSummary();
}
