/**
 * NEA-2:7 — Channel Connectors Certification.
 *
 * Canonical immutable certification surface for the Channel Connectors Platform.
 * Consumes only NEA-2:6 Channel Connectors Platform public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by NEA-2:7.
 *
 * Public exports (exactly 8):
 *   ChannelConnectorCertificationId
 *   ChannelConnectorCertificationVersion
 *   ChannelConnectorCertificationName
 *   ChannelConnectorCertificationNamespace
 *   ChannelConnectorCertificationStatus
 *   ChannelConnectorCertificationReadiness
 *   ChannelConnectorCertificationPlatform
 *   getChannelConnectorCertificationSummary()
 */

import {
  ChannelConnectorPlatform,
  ChannelConnectorPlatformId,
  ChannelConnectorPlatformVersion,
} from "./channelConnectorPlatform.ts";
import { ChannelConnectorCertificationComplianceCatalog } from "./channelConnectorCertificationCompliance.ts";
import { ChannelConnectorCertificationGateCatalog } from "./channelConnectorCertificationGates.ts";
import {
  ChannelConnectorCertificationMetadata,
  ChannelConnectorCertificationReadinessValue,
} from "./channelConnectorCertificationMetadata.ts";
import {
  ChannelConnectorCertificationBoundaries,
  ChannelConnectorCertificationOwnership,
} from "./channelConnectorCertificationOwnership.ts";
import { buildChannelConnectorCertificationSummary } from "./channelConnectorCertificationSummary.ts";
import type {
  ChannelConnectorCertificationIdentity,
  ChannelConnectorCertificationSummary,
} from "./channelConnectorCertificationTypes.ts";

/** Canonical certification identity. */
export const ChannelConnectorCertificationId =
  "NEA-2:7/ChannelConnectorCertification" as const;

/** Human-readable certification name. */
export const ChannelConnectorCertificationName =
  "Channel Connectors Certification" as const;

/** Semantic version. */
export const ChannelConnectorCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ChannelConnectorCertificationNamespace =
  "nexora.nea.channel-connectors.certification" as const;

/** Certification status. */
export const ChannelConnectorCertificationStatus = "Certification" as const;

/** Immediate next-phase readiness. */
export const ChannelConnectorCertificationReadiness =
  ChannelConnectorCertificationReadinessValue;

const identity: ChannelConnectorCertificationIdentity = Object.freeze({
  certificationId: ChannelConnectorCertificationId,
  certificationName: ChannelConnectorCertificationName,
  certificationVersion: ChannelConnectorCertificationVersion,
  certificationNamespace: ChannelConnectorCertificationNamespace,
  layer: "NEA" as const,
  phase: "NEA-2:7" as const,
  stage: "Certification" as const,
  sourcePhase: "NEA-2:7" as const,
  owner: "NEA-2 Channel Connectors",
  status: ChannelConnectorCertificationStatus,
  readiness: ChannelConnectorCertificationReadiness,
  platformId: ChannelConnectorPlatformId,
  platformVersion: ChannelConnectorPlatformVersion,
  description:
    "Immutable certification architecture declaring Channel Connectors Platform compliance across Foundation through Platform.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-2:7/Dependency/NEA26Platform",
  directPreviousPhaseModule: "channelConnectorPlatform.ts" as const,
  platformOnly: true as const,
  platformId: ChannelConnectorPlatformId,
  platformVersion: ChannelConnectorPlatformVersion,
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
  canonicalPath: "NEA-2:7 → NEA-2:6 ChannelConnectorPlatform (exclusive)",
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
    id: `NEA-2:7/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-2:7" as const,
    section: "Certification" as const,
    kind,
    version: ChannelConnectorCertificationVersion,
    status: ChannelConnectorCertificationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "channelConnectorCertification.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ChannelConnectorCertificationApiRegistry = Object.freeze([
  certificationApi("ChannelConnectorCertificationId", "IdentityConstant"),
  certificationApi("ChannelConnectorCertificationVersion", "IdentityConstant"),
  certificationApi("ChannelConnectorCertificationName", "IdentityConstant"),
  certificationApi(
    "ChannelConnectorCertificationNamespace",
    "IdentityConstant",
  ),
  certificationApi("ChannelConnectorCertificationStatus", "MetadataConstant"),
  certificationApi(
    "ChannelConnectorCertificationReadiness",
    "MetadataConstant",
  ),
  certificationApi("ChannelConnectorCertificationPlatform", "Aggregate"),
  certificationApi("getChannelConnectorCertificationSummary", "Helper"),
]);

/**
 * Canonical immutable Channel Connectors Certification platform.
 * Nine ordered sections. Metadata only.
 */
export const ChannelConnectorCertificationPlatform = Object.freeze({
  identity,
  dependency,
  gates: ChannelConnectorCertificationGateCatalog,
  compliance: ChannelConnectorCertificationComplianceCatalog,
  metadata: ChannelConnectorCertificationMetadata,
  ownership: ChannelConnectorCertificationOwnership,
  boundaries: ChannelConnectorCertificationBoundaries,
  summary: buildChannelConnectorCertificationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-2:7/CertificationReadiness",
    readiness: ChannelConnectorCertificationReadiness,
    nextPhase: ChannelConnectorCertificationMetadata.nextPhase,
    certificationOutcome:
      ChannelConnectorCertificationMetadata.certificationOutcome,
    claimsReadyForPublicIndex: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ChannelConnectorCertificationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ChannelConnectorCertificationStatus,
  nextPhase: ChannelConnectorCertificationMetadata.nextPhase,
  downstreamReadiness: ChannelConnectorCertificationReadiness,
  platform: ChannelConnectorPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  implementsConnectors: false as const,
  networkingBehavior: false as const,
  oauthFlow: false as const,
  messageProcessing: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Channel Connectors Certification summary.
 * Counts are derived exclusively from canonical certification collections.
 */
export function getChannelConnectorCertificationSummary(): ChannelConnectorCertificationSummary {
  return buildChannelConnectorCertificationSummary();
}
