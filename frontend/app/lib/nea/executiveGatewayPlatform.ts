/**
 * NEA-1:6 — Executive Gateway Platform.
 *
 * Canonical immutable composition surface for the complete Executive Gateway.
 * Consumes only NEA-1:5 Executive Gateway Manifest public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by NEA-1:6.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewayPlatformId
 *   ExecutiveGatewayPlatformVersion
 *   ExecutiveGatewayPlatformName
 *   ExecutiveGatewayPlatformNamespace
 *   ExecutiveGatewayPlatformStatus
 *   ExecutiveGatewayPlatformReadiness
 *   ExecutiveGatewayPlatform
 *   getExecutiveGatewayPlatformSummary()
 */

import {
  ExecutiveGatewayManifestId,
  ExecutiveGatewayManifestPlatform,
  ExecutiveGatewayManifestVersion,
} from "./executiveGatewayManifest.ts";
import { ExecutiveGatewayPlatformMetadata } from "./executiveGatewayPlatformMetadata.ts";
import { ExecutiveGatewayPlatformNamespaceObject } from "./executiveGatewayPlatformNamespace.ts";
import {
  ExecutiveGatewayPlatformBoundaries,
  ExecutiveGatewayPlatformOwnership,
} from "./executiveGatewayPlatformOwnership.ts";
import {
  ExecutiveGatewayPlatformReadinessDeclaration,
  ExecutiveGatewayPlatformReadinessValue,
} from "./executiveGatewayPlatformReadiness.ts";
import { buildExecutiveGatewayPlatformSummary } from "./executiveGatewayPlatformSummary.ts";
import type {
  ExecutiveGatewayPlatformIdentity,
  ExecutiveGatewayPlatformSummary,
} from "./executiveGatewayPlatformTypes.ts";

/** Canonical platform identity. */
export const ExecutiveGatewayPlatformId =
  "NEA-1:6/ExecutiveGatewayPlatform" as const;

/** Human-readable platform name. */
export const ExecutiveGatewayPlatformName =
  "Executive Gateway Platform" as const;

/** Semantic version. */
export const ExecutiveGatewayPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewayPlatformNamespace =
  "nexora.nea.executive-gateway.platform" as const;

/** Platform status. */
export const ExecutiveGatewayPlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewayPlatformReadiness =
  ExecutiveGatewayPlatformReadinessValue;

const identity: ExecutiveGatewayPlatformIdentity = Object.freeze({
  platformId: ExecutiveGatewayPlatformId,
  platformName: ExecutiveGatewayPlatformName,
  platformVersion: ExecutiveGatewayPlatformVersion,
  platformNamespace: ExecutiveGatewayPlatformNamespace,
  layer: "NEA" as const,
  phase: "NEA-1:6" as const,
  stage: "Platform" as const,
  sourcePhase: "NEA-1:6" as const,
  owner: "NEA-1 Executive Gateway",
  status: ExecutiveGatewayPlatformStatus,
  readiness: ExecutiveGatewayPlatformReadiness,
  manifestId: ExecutiveGatewayManifestId,
  manifestVersion: ExecutiveGatewayManifestVersion,
  description:
    "Immutable canonical composition surface aggregating Foundation, Registry, Model, Validation, and Manifest exclusively through canonical references.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-1:6/Dependency/NEA15Manifest",
  directPreviousPhaseModule: "executiveGatewayManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: ExecutiveGatewayManifestId,
  manifestVersion: ExecutiveGatewayManifestVersion,
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
    "NEA-1:6 → NEA-1:5 ManifestPlatform → Validation → Model → Registry → Foundation",
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
    id: `NEA-1:6/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-1:6" as const,
    section: "Platform" as const,
    kind,
    version: ExecutiveGatewayPlatformVersion,
    status: ExecutiveGatewayPlatformStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewayPlatform.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewayPlatformApiRegistry = Object.freeze([
  platformApi("ExecutiveGatewayPlatformId", "IdentityConstant"),
  platformApi("ExecutiveGatewayPlatformVersion", "IdentityConstant"),
  platformApi("ExecutiveGatewayPlatformName", "IdentityConstant"),
  platformApi("ExecutiveGatewayPlatformNamespace", "IdentityConstant"),
  platformApi("ExecutiveGatewayPlatformStatus", "MetadataConstant"),
  platformApi("ExecutiveGatewayPlatformReadiness", "MetadataConstant"),
  platformApi("ExecutiveGatewayPlatform", "Aggregate"),
  platformApi("getExecutiveGatewayPlatformSummary", "Helper"),
]);

const summarySnapshot = buildExecutiveGatewayPlatformSummary();

/**
 * Canonical immutable Executive Gateway Platform.
 * Consumer surface for the complete NEA-1 architecture.
 * Nine ordered sections. Metadata only.
 */
export const ExecutiveGatewayPlatform = Object.freeze({
  identity,
  dependency,
  namespace: ExecutiveGatewayPlatformNamespaceObject,
  metadata: ExecutiveGatewayPlatformMetadata,
  ownership: ExecutiveGatewayPlatformOwnership,
  boundaries: ExecutiveGatewayPlatformBoundaries,
  readiness: ExecutiveGatewayPlatformReadinessDeclaration,
  summary: summarySnapshot,
  consumer: Object.freeze({
    consumerSurfaceId: "NEA-1:6/ConsumerPlatformSurface",
    soleSupportedEntryPoint: "executiveGatewayPlatform.ts" as const,
    accessRule:
      "Consumers shall access NEA-1 through ExecutiveGatewayPlatform only.",
    composedSections: ExecutiveGatewayPlatformNamespaceObject.sectionOrder,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ExecutiveGatewayPlatformApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewayPlatformStatus,
  nextPhase: ExecutiveGatewayPlatformReadinessDeclaration.nextPhase,
  downstreamReadiness: ExecutiveGatewayPlatformReadiness,
  manifestPlatform: ExecutiveGatewayManifestPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  routingExecution: false as const,
  authenticationExecution: false as const,
  authorizationExecution: false as const,
  connectorImplementation: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Platform summary.
 * Counts are derived exclusively from canonical upstream collections.
 */
export function getExecutiveGatewayPlatformSummary(): ExecutiveGatewayPlatformSummary {
  return buildExecutiveGatewayPlatformSummary();
}
