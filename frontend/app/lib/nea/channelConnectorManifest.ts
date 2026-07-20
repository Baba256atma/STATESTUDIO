/**
 * NEA-2:5 — Channel Connectors Manifest.
 *
 * Canonical immutable architectural publication of NEA-2 through Validation.
 * Consumes only NEA-2:4 Channel Connectors Validation public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by NEA-2:5.
 *
 * Public exports (exactly 8):
 *   ChannelConnectorManifestId
 *   ChannelConnectorManifestVersion
 *   ChannelConnectorManifestName
 *   ChannelConnectorManifestNamespace
 *   ChannelConnectorManifestStatus
 *   ChannelConnectorManifestReadiness
 *   ChannelConnectorManifestPlatform
 *   getChannelConnectorManifestSummary()
 */

import {
  ChannelConnectorValidationId,
  ChannelConnectorValidationPlatform,
  ChannelConnectorValidationVersion,
} from "./channelConnectorValidation.ts";
import { ChannelConnectorManifestInventoryCatalog } from "./channelConnectorManifestInventory.ts";
import { ChannelConnectorManifestMetadata } from "./channelConnectorManifestMetadata.ts";
import {
  ChannelConnectorManifestBoundaries,
  ChannelConnectorManifestOwnership,
} from "./channelConnectorManifestOwnership.ts";
import {
  ChannelConnectorManifestReadinessDeclaration,
  ChannelConnectorManifestReadinessValue,
} from "./channelConnectorManifestReadiness.ts";
import { buildChannelConnectorManifestSummary } from "./channelConnectorManifestSummary.ts";
import type {
  ChannelConnectorManifestIdentity,
  ChannelConnectorManifestSummary,
} from "./channelConnectorManifestTypes.ts";

/** Canonical manifest identity. */
export const ChannelConnectorManifestId =
  "NEA-2:5/ChannelConnectorManifest" as const;

/** Human-readable manifest name. */
export const ChannelConnectorManifestName =
  "Channel Connectors Manifest" as const;

/** Semantic version. */
export const ChannelConnectorManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ChannelConnectorManifestNamespace =
  "nexora.nea.channel-connectors.manifest" as const;

/** Manifest status. */
export const ChannelConnectorManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const ChannelConnectorManifestReadiness =
  ChannelConnectorManifestReadinessValue;

const identity: ChannelConnectorManifestIdentity = Object.freeze({
  manifestId: ChannelConnectorManifestId,
  manifestName: ChannelConnectorManifestName,
  manifestVersion: ChannelConnectorManifestVersion,
  manifestNamespace: ChannelConnectorManifestNamespace,
  layer: "NEA" as const,
  phase: "NEA-2:5" as const,
  stage: "Manifest" as const,
  sourcePhase: "NEA-2:5" as const,
  owner: "NEA-2 Channel Connectors",
  status: ChannelConnectorManifestStatus,
  readiness: ChannelConnectorManifestReadiness,
  validationId: ChannelConnectorValidationId,
  validationVersion: ChannelConnectorValidationVersion,
  description:
    "Immutable architectural publication of Channel Connectors aggregating Foundation, Registry, Model, and Validation through canonical references only.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-2:5/Dependency/NEA24Validation",
  directPreviousPhaseModule: "channelConnectorValidation.ts" as const,
  validationOnly: true as const,
  validationId: ChannelConnectorValidationId,
  validationVersion: ChannelConnectorValidationVersion,
  validationPublicSurfaceOnly: true as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-2:5 → NEA-2:4 ValidationPlatform → Model → Registry → Foundation",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "phaseReferences",
  "inventory",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
] as const);

const manifestApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-2:5/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-2:5" as const,
    section: "Manifest" as const,
    kind,
    version: ChannelConnectorManifestVersion,
    status: ChannelConnectorManifestStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "channelConnectorManifest.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ChannelConnectorManifestApiRegistry = Object.freeze([
  manifestApi("ChannelConnectorManifestId", "IdentityConstant"),
  manifestApi("ChannelConnectorManifestVersion", "IdentityConstant"),
  manifestApi("ChannelConnectorManifestName", "IdentityConstant"),
  manifestApi("ChannelConnectorManifestNamespace", "IdentityConstant"),
  manifestApi("ChannelConnectorManifestStatus", "MetadataConstant"),
  manifestApi("ChannelConnectorManifestReadiness", "MetadataConstant"),
  manifestApi("ChannelConnectorManifestPlatform", "Aggregate"),
  manifestApi("getChannelConnectorManifestSummary", "Helper"),
]);

/**
 * Canonical immutable Channel Connectors Manifest platform.
 * Nine ordered sections. Metadata only.
 */
export const ChannelConnectorManifestPlatform = Object.freeze({
  identity,
  dependency,
  phaseReferences: ChannelConnectorManifestInventoryCatalog.phaseReferences,
  inventory: ChannelConnectorManifestInventoryCatalog,
  metadata: ChannelConnectorManifestMetadata,
  ownership: ChannelConnectorManifestOwnership,
  boundaries: ChannelConnectorManifestBoundaries,
  readiness: ChannelConnectorManifestReadinessDeclaration,
  summary: buildChannelConnectorManifestSummary(),
  apiRegistry: ChannelConnectorManifestApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ChannelConnectorManifestStatus,
  nextPhase: ChannelConnectorManifestReadinessDeclaration.nextPhase,
  downstreamReadiness: ChannelConnectorManifestReadiness,
  validationPlatform: ChannelConnectorValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
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
 * Deterministic frozen Channel Connectors Manifest summary.
 * Counts are derived exclusively from canonical inventory collections.
 */
export function getChannelConnectorManifestSummary(): ChannelConnectorManifestSummary {
  return buildChannelConnectorManifestSummary();
}
