/**
 * NEA-5:6 — Gateway Routing Platform.
 *
 * Canonical immutable composition surface for the complete Gateway Routing architecture.
 * Consumes only NEA-5:5 Gateway Routing Manifest public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by NEA-5:6.
 *
 * Public exports (exactly 8):
 *   GatewayRoutingPlatformId
 *   GatewayRoutingPlatformVersion
 *   GatewayRoutingPlatformName
 *   GatewayRoutingPlatformNamespace
 *   GatewayRoutingPlatformStatus
 *   GatewayRoutingPlatformReadiness
 *   GatewayRoutingPlatform
 *   getGatewayRoutingPlatformSummary()
 */

import {
  GatewayRoutingManifestId,
  GatewayRoutingManifestPlatform,
  GatewayRoutingManifestVersion,
} from "./gatewayRoutingManifest.ts";
import { GatewayRoutingPlatformMetadata } from "./gatewayRoutingPlatformMetadata.ts";
import { GatewayRoutingPlatformNamespaceObject } from "./gatewayRoutingPlatformNamespace.ts";
import {
  GatewayRoutingPlatformBoundaries,
  GatewayRoutingPlatformOwnership,
} from "./gatewayRoutingPlatformOwnership.ts";
import {
  GatewayRoutingPlatformReadinessDeclaration,
  GatewayRoutingPlatformReadinessValue,
} from "./gatewayRoutingPlatformReadiness.ts";
import { buildGatewayRoutingPlatformSummary } from "./gatewayRoutingPlatformSummary.ts";
import type {
  GatewayRoutingPlatformIdentity,
  GatewayRoutingPlatformSummary,
} from "./gatewayRoutingPlatformTypes.ts";

/** Canonical platform identity. */
export const GatewayRoutingPlatformId =
  "NEA-5:6/GatewayRoutingPlatform" as const;

/** Human-readable platform name. */
export const GatewayRoutingPlatformName =
  "Gateway Routing Platform" as const;

/** Semantic version. */
export const GatewayRoutingPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const GatewayRoutingPlatformNamespace =
  "nexora.nea.gateway-routing.platform" as const;

/** Platform status. */
export const GatewayRoutingPlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const GatewayRoutingPlatformReadiness =
  GatewayRoutingPlatformReadinessValue;

const identity: GatewayRoutingPlatformIdentity = Object.freeze({
  platformId: GatewayRoutingPlatformId,
  platformName: GatewayRoutingPlatformName,
  platformVersion: GatewayRoutingPlatformVersion,
  platformNamespace: GatewayRoutingPlatformNamespace,
  layer: "NEA" as const,
  phase: "NEA-5:6" as const,
  stage: "Platform" as const,
  sourcePhase: "NEA-5:6" as const,
  owner: "NEA-5 Gateway Routing",
  status: GatewayRoutingPlatformStatus,
  readiness: GatewayRoutingPlatformReadiness,
  manifestId: GatewayRoutingManifestId,
  manifestVersion: GatewayRoutingManifestVersion,
  description:
    "Immutable canonical composition surface aggregating Foundation, Registry, Model, Validation, and Manifest exclusively through canonical references.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-5:6/Dependency/NEA55Manifest",
  directPreviousPhaseModule: "gatewayRoutingManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: GatewayRoutingManifestId,
  manifestVersion: GatewayRoutingManifestVersion,
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
    "NEA-5:6 → NEA-5:5 ManifestPlatform → Validation → Model → Registry → Foundation",
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
    id: `NEA-5:6/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-5:6" as const,
    section: "Platform" as const,
    kind,
    version: GatewayRoutingPlatformVersion,
    status: GatewayRoutingPlatformStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "gatewayRoutingPlatform.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const GatewayRoutingPlatformApiRegistry = Object.freeze([
  platformApi("GatewayRoutingPlatformId", "IdentityConstant"),
  platformApi("GatewayRoutingPlatformVersion", "IdentityConstant"),
  platformApi("GatewayRoutingPlatformName", "IdentityConstant"),
  platformApi("GatewayRoutingPlatformNamespace", "IdentityConstant"),
  platformApi("GatewayRoutingPlatformStatus", "MetadataConstant"),
  platformApi("GatewayRoutingPlatformReadiness", "MetadataConstant"),
  platformApi("GatewayRoutingPlatform", "Aggregate"),
  platformApi("getGatewayRoutingPlatformSummary", "Helper"),
]);

const summarySnapshot = buildGatewayRoutingPlatformSummary();

/**
 * Canonical immutable Gateway Routing Platform.
 * Consumer surface for the complete NEA-5 architecture.
 * Nine ordered sections. Metadata only.
 */
export const GatewayRoutingPlatform = Object.freeze({
  identity,
  dependency,
  namespace: GatewayRoutingPlatformNamespaceObject,
  metadata: GatewayRoutingPlatformMetadata,
  ownership: GatewayRoutingPlatformOwnership,
  boundaries: GatewayRoutingPlatformBoundaries,
  readiness: GatewayRoutingPlatformReadinessDeclaration,
  summary: summarySnapshot,
  consumer: Object.freeze({
    consumerSurfaceId: "NEA-5:6/ConsumerPlatformSurface",
    soleSupportedEntryPoint: "gatewayRoutingPlatform.ts" as const,
    accessRule:
      "Consumers shall access NEA-5 through GatewayRoutingPlatform only.",
    composedSections: GatewayRoutingPlatformNamespaceObject.sectionOrder,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: GatewayRoutingPlatformApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: GatewayRoutingPlatformStatus,
  nextPhase: GatewayRoutingPlatformReadinessDeclaration.nextPhase,
  downstreamReadiness: GatewayRoutingPlatformReadiness,
  manifestPlatform: GatewayRoutingManifestPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  executesStrategies: false as const,
  implementsConsumerSelection: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Gateway Routing Platform summary.
 * Counts are derived exclusively from canonical upstream collections.
 */
export function getGatewayRoutingPlatformSummary(): GatewayRoutingPlatformSummary {
  return buildGatewayRoutingPlatformSummary();
}
