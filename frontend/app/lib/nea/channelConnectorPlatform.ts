/**
 * NEA-2:6 — Channel Connectors Platform.
 *
 * Canonical immutable composition surface for the complete Channel Connectors architecture.
 * Consumes only NEA-2:5 Channel Connectors Manifest public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by NEA-2:6.
 *
 * Public exports (exactly 8):
 *   ChannelConnectorPlatformId
 *   ChannelConnectorPlatformVersion
 *   ChannelConnectorPlatformName
 *   ChannelConnectorPlatformNamespace
 *   ChannelConnectorPlatformStatus
 *   ChannelConnectorPlatformReadiness
 *   ChannelConnectorPlatform
 *   getChannelConnectorPlatformSummary()
 */

import {
  ChannelConnectorManifestId,
  ChannelConnectorManifestPlatform,
  ChannelConnectorManifestVersion,
} from "./channelConnectorManifest.ts";
import { ChannelConnectorPlatformMetadata } from "./channelConnectorPlatformMetadata.ts";
import { ChannelConnectorPlatformNamespaceObject } from "./channelConnectorPlatformNamespace.ts";
import {
  ChannelConnectorPlatformBoundaries,
  ChannelConnectorPlatformOwnership,
} from "./channelConnectorPlatformOwnership.ts";
import {
  ChannelConnectorPlatformReadinessDeclaration,
  ChannelConnectorPlatformReadinessValue,
} from "./channelConnectorPlatformReadiness.ts";
import { buildChannelConnectorPlatformSummary } from "./channelConnectorPlatformSummary.ts";
import type {
  ChannelConnectorPlatformIdentity,
  ChannelConnectorPlatformSummary,
} from "./channelConnectorPlatformTypes.ts";

/** Canonical platform identity. */
export const ChannelConnectorPlatformId =
  "NEA-2:6/ChannelConnectorPlatform" as const;

/** Human-readable platform name. */
export const ChannelConnectorPlatformName =
  "Channel Connectors Platform" as const;

/** Semantic version. */
export const ChannelConnectorPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ChannelConnectorPlatformNamespace =
  "nexora.nea.channel-connectors.platform" as const;

/** Platform status. */
export const ChannelConnectorPlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const ChannelConnectorPlatformReadiness =
  ChannelConnectorPlatformReadinessValue;

const identity: ChannelConnectorPlatformIdentity = Object.freeze({
  platformId: ChannelConnectorPlatformId,
  platformName: ChannelConnectorPlatformName,
  platformVersion: ChannelConnectorPlatformVersion,
  platformNamespace: ChannelConnectorPlatformNamespace,
  layer: "NEA" as const,
  phase: "NEA-2:6" as const,
  stage: "Platform" as const,
  sourcePhase: "NEA-2:6" as const,
  owner: "NEA-2 Channel Connectors",
  status: ChannelConnectorPlatformStatus,
  readiness: ChannelConnectorPlatformReadiness,
  manifestId: ChannelConnectorManifestId,
  manifestVersion: ChannelConnectorManifestVersion,
  description:
    "Immutable canonical composition surface aggregating Foundation, Registry, Model, Validation, and Manifest exclusively through canonical references.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-2:6/Dependency/NEA25Manifest",
  directPreviousPhaseModule: "channelConnectorManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: ChannelConnectorManifestId,
  manifestVersion: ChannelConnectorManifestVersion,
  manifestPublicSurfaceOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-2:6 → NEA-2:5 ManifestPlatform → Validation → Model → Registry → Foundation",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "namespace",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
  "consumer",
] as const);

const platformApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-2:6/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-2:6" as const,
    section: "Platform" as const,
    kind,
    version: ChannelConnectorPlatformVersion,
    status: ChannelConnectorPlatformStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "channelConnectorPlatform.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ChannelConnectorPlatformApiRegistry = Object.freeze([
  platformApi("ChannelConnectorPlatformId", "IdentityConstant"),
  platformApi("ChannelConnectorPlatformVersion", "IdentityConstant"),
  platformApi("ChannelConnectorPlatformName", "IdentityConstant"),
  platformApi("ChannelConnectorPlatformNamespace", "IdentityConstant"),
  platformApi("ChannelConnectorPlatformStatus", "MetadataConstant"),
  platformApi("ChannelConnectorPlatformReadiness", "MetadataConstant"),
  platformApi("ChannelConnectorPlatform", "Aggregate"),
  platformApi("getChannelConnectorPlatformSummary", "Helper"),
]);

const summarySnapshot = buildChannelConnectorPlatformSummary();

/**
 * Canonical immutable Channel Connectors Platform.
 * Consumer surface for the complete NEA-2 architecture.
 * Nine ordered sections. Metadata only.
 */
export const ChannelConnectorPlatform = Object.freeze({
  identity,
  dependency,
  namespace: ChannelConnectorPlatformNamespaceObject,
  metadata: ChannelConnectorPlatformMetadata,
  ownership: ChannelConnectorPlatformOwnership,
  boundaries: ChannelConnectorPlatformBoundaries,
  readiness: ChannelConnectorPlatformReadinessDeclaration,
  summary: summarySnapshot,
  consumer: Object.freeze({
    consumerSurfaceId: "NEA-2:6/ConsumerPlatformSurface",
    soleSupportedEntryPoint: "channelConnectorPlatform.ts" as const,
    accessRule:
      "Consumers shall access NEA-2 through ChannelConnectorPlatform only.",
    composedSections: ChannelConnectorPlatformNamespaceObject.sectionOrder,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ChannelConnectorPlatformApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ChannelConnectorPlatformStatus,
  nextPhase: ChannelConnectorPlatformReadinessDeclaration.nextPhase,
  downstreamReadiness: ChannelConnectorPlatformReadiness,
  manifestPlatform: ChannelConnectorManifestPlatform,
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
 * Deterministic frozen Channel Connectors Platform summary.
 * Counts are derived exclusively from canonical upstream collections.
 */
export function getChannelConnectorPlatformSummary(): ChannelConnectorPlatformSummary {
  return buildChannelConnectorPlatformSummary();
}
