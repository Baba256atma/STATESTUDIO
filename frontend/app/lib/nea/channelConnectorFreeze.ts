/**
 * NEA-2:8 — Channel Connectors Freeze.
 *
 * Canonical immutable freeze surface for the certified Channel Connectors.
 * Consumes only NEA-2:7 Channel Connectors Certification public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by NEA-2:8.
 *
 * Public exports (exactly 8):
 *   ChannelConnectorFreezeId
 *   ChannelConnectorFreezeVersion
 *   ChannelConnectorFreezeName
 *   ChannelConnectorFreezeNamespace
 *   ChannelConnectorFreezeStatus
 *   ChannelConnectorFreezeReadiness
 *   ChannelConnectorFreezePlatform
 *   getChannelConnectorFreezeSummary()
 */

import {
  ChannelConnectorCertificationId,
  ChannelConnectorCertificationPlatform,
  ChannelConnectorCertificationVersion,
} from "./channelConnectorCertification.ts";
import { ChannelConnectorFreezeCompatibilityCatalog } from "./channelConnectorFreezeCompatibility.ts";
import { ChannelConnectorFreezeExtensionPolicy } from "./channelConnectorFreezeExtensions.ts";
import { ChannelConnectorFreezeLockCatalog } from "./channelConnectorFreezeLocks.ts";
import {
  buildChannelConnectorFreezeSummary,
  ChannelConnectorFreezeBoundaries,
  ChannelConnectorFreezeMetadata,
  ChannelConnectorFreezeOwnership,
  ChannelConnectorFreezeReadinessValue,
} from "./channelConnectorFreezeMetadata.ts";
import { ChannelConnectorFreezeRegistryCatalog } from "./channelConnectorFreezeRegistry.ts";
import type {
  ChannelConnectorFreezeIdentity,
  ChannelConnectorFreezeSummary,
} from "./channelConnectorFreezeTypes.ts";

/** Canonical freeze identity. */
export const ChannelConnectorFreezeId =
  "NEA-2:8/ChannelConnectorFreeze" as const;

/** Human-readable freeze name. */
export const ChannelConnectorFreezeName =
  "Channel Connectors Freeze" as const;

/** Semantic version. */
export const ChannelConnectorFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ChannelConnectorFreezeNamespace =
  "nexora.nea.channel-connectors.freeze" as const;

/** Freeze status. */
export const ChannelConnectorFreezeStatus = "Freeze" as const;

/** Immediate next-phase readiness. */
export const ChannelConnectorFreezeReadiness =
  ChannelConnectorFreezeReadinessValue;

const identity: ChannelConnectorFreezeIdentity = Object.freeze({
  freezeId: ChannelConnectorFreezeId,
  freezeName: ChannelConnectorFreezeName,
  freezeVersion: ChannelConnectorFreezeVersion,
  freezeNamespace: ChannelConnectorFreezeNamespace,
  layer: "NEA" as const,
  phase: "NEA-2:8" as const,
  stage: "Freeze" as const,
  sourcePhase: "NEA-2:8" as const,
  owner: "NEA-2 Channel Connectors",
  status: ChannelConnectorFreezeStatus,
  readiness: ChannelConnectorFreezeReadiness,
  certificationId: ChannelConnectorCertificationId,
  certificationVersion: ChannelConnectorCertificationVersion,
  description:
    "Immutable freeze layer permanently locking the certified Channel Connectors architecture as the sole frozen baseline for Public Index consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-2:8/Dependency/NEA27Certification",
  directPreviousPhaseModule: "channelConnectorCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: ChannelConnectorCertificationId,
  certificationVersion: ChannelConnectorCertificationVersion,
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
    "NEA-2:8 → NEA-2:7 ChannelConnectorCertificationPlatform (exclusive)",
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
    id: `NEA-2:8/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-2:8" as const,
    section: "Freeze" as const,
    kind,
    version: ChannelConnectorFreezeVersion,
    status: ChannelConnectorFreezeStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "channelConnectorFreeze.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ChannelConnectorFreezeApiRegistry = Object.freeze([
  freezeApi("ChannelConnectorFreezeId", "IdentityConstant"),
  freezeApi("ChannelConnectorFreezeVersion", "IdentityConstant"),
  freezeApi("ChannelConnectorFreezeName", "IdentityConstant"),
  freezeApi("ChannelConnectorFreezeNamespace", "IdentityConstant"),
  freezeApi("ChannelConnectorFreezeStatus", "MetadataConstant"),
  freezeApi("ChannelConnectorFreezeReadiness", "MetadataConstant"),
  freezeApi("ChannelConnectorFreezePlatform", "Aggregate"),
  freezeApi("getChannelConnectorFreezeSummary", "Helper"),
]);

/**
 * Canonical immutable Channel Connectors Freeze platform.
 * Metadata only. Certified architecture preserved by reference.
 */
export const ChannelConnectorFreezePlatform = Object.freeze({
  identity,
  dependency,
  registry: ChannelConnectorFreezeRegistryCatalog,
  locks: ChannelConnectorFreezeLockCatalog,
  compatibility: ChannelConnectorFreezeCompatibilityCatalog,
  extensions: ChannelConnectorFreezeExtensionPolicy,
  metadata: ChannelConnectorFreezeMetadata,
  ownership: ChannelConnectorFreezeOwnership,
  boundaries: ChannelConnectorFreezeBoundaries,
  summary: buildChannelConnectorFreezeSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-2:8/FreezeReadiness",
    readiness: ChannelConnectorFreezeReadiness,
    nextPhase: ChannelConnectorFreezeMetadata.nextPhase,
    allLocksActive: ChannelConnectorFreezeLockCatalog.allLocksActive,
    allCompatible:
      ChannelConnectorFreezeCompatibilityCatalog.allCompatible,
    certificationOutcome:
      ChannelConnectorCertificationPlatform.metadata.certificationOutcome,
    claimsReadyForPublicIndex: true as const,
    claimsPublicIndexPublished: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ChannelConnectorFreezeApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ChannelConnectorFreezeStatus,
  nextPhase: ChannelConnectorFreezeMetadata.nextPhase,
  downstreamReadiness: ChannelConnectorFreezeReadiness,
  certification: ChannelConnectorCertificationPlatform,
  certifiedPlatformReference:
    ChannelConnectorFreezeRegistryCatalog.certifiedPlatformReference,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
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
 * Deterministic frozen Channel Connectors Freeze summary.
 * Counts are derived exclusively from Certification and Freeze catalogs.
 */
export function getChannelConnectorFreezeSummary(): ChannelConnectorFreezeSummary {
  return buildChannelConnectorFreezeSummary();
}
