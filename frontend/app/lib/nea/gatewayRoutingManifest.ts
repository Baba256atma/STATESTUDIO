/**
 * NEA-5:5 — Gateway Routing Manifest.
 *
 * Canonical immutable architectural publication of NEA-5 through Validation.
 * Consumes only NEA-5:4 Gateway Routing Validation public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by NEA-5:5.
 *
 * Public exports (exactly 8):
 *   GatewayRoutingManifestId
 *   GatewayRoutingManifestVersion
 *   GatewayRoutingManifestName
 *   GatewayRoutingManifestNamespace
 *   GatewayRoutingManifestStatus
 *   GatewayRoutingManifestReadiness
 *   GatewayRoutingManifestPlatform
 *   getGatewayRoutingManifestSummary()
 */

import {
  GatewayRoutingValidationId,
  GatewayRoutingValidationPlatform,
  GatewayRoutingValidationVersion,
} from "./gatewayRoutingValidation.ts";
import { GatewayRoutingManifestInventoryCatalog } from "./gatewayRoutingManifestInventory.ts";
import { GatewayRoutingManifestMetadata } from "./gatewayRoutingManifestMetadata.ts";
import {
  GatewayRoutingManifestBoundaries,
  GatewayRoutingManifestOwnership,
} from "./gatewayRoutingManifestOwnership.ts";
import {
  GatewayRoutingManifestReadinessDeclaration,
  GatewayRoutingManifestReadinessValue,
} from "./gatewayRoutingManifestReadiness.ts";
import { buildGatewayRoutingManifestSummary } from "./gatewayRoutingManifestSummary.ts";
import type {
  GatewayRoutingManifestIdentity,
  GatewayRoutingManifestSummary,
} from "./gatewayRoutingManifestTypes.ts";

/** Canonical manifest identity. */
export const GatewayRoutingManifestId =
  "NEA-5:5/GatewayRoutingManifest" as const;

/** Human-readable manifest name. */
export const GatewayRoutingManifestName =
  "Gateway Routing Manifest" as const;

/** Semantic version. */
export const GatewayRoutingManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const GatewayRoutingManifestNamespace =
  "nexora.nea.gateway-routing.manifest" as const;

/** Manifest status. */
export const GatewayRoutingManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const GatewayRoutingManifestReadiness =
  GatewayRoutingManifestReadinessValue;

const identity: GatewayRoutingManifestIdentity = Object.freeze({
  manifestId: GatewayRoutingManifestId,
  manifestName: GatewayRoutingManifestName,
  manifestVersion: GatewayRoutingManifestVersion,
  manifestNamespace: GatewayRoutingManifestNamespace,
  layer: "NEA" as const,
  phase: "NEA-5:5" as const,
  stage: "Manifest" as const,
  sourcePhase: "NEA-5:5" as const,
  owner: "NEA-5 Gateway Routing",
  status: GatewayRoutingManifestStatus,
  readiness: GatewayRoutingManifestReadiness,
  validationId: GatewayRoutingValidationId,
  validationVersion: GatewayRoutingValidationVersion,
  description:
    "Immutable architectural publication of Gateway Routing aggregating Foundation, Registry, Model, and Validation through canonical references only.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-5:5/Dependency/NEA54Validation",
  directPreviousPhaseModule: "gatewayRoutingValidation.ts" as const,
  validationOnly: true as const,
  validationId: GatewayRoutingValidationId,
  validationVersion: GatewayRoutingValidationVersion,
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
    "NEA-5:5 → NEA-5:4 ValidationPlatform → Model → Registry → Foundation",
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
    id: `NEA-5:5/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-5:5" as const,
    section: "Manifest" as const,
    kind,
    version: GatewayRoutingManifestVersion,
    status: GatewayRoutingManifestStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "gatewayRoutingManifest.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const GatewayRoutingManifestApiRegistry = Object.freeze([
  manifestApi("GatewayRoutingManifestId", "IdentityConstant"),
  manifestApi("GatewayRoutingManifestVersion", "IdentityConstant"),
  manifestApi("GatewayRoutingManifestName", "IdentityConstant"),
  manifestApi("GatewayRoutingManifestNamespace", "IdentityConstant"),
  manifestApi("GatewayRoutingManifestStatus", "MetadataConstant"),
  manifestApi("GatewayRoutingManifestReadiness", "MetadataConstant"),
  manifestApi("GatewayRoutingManifestPlatform", "Aggregate"),
  manifestApi("getGatewayRoutingManifestSummary", "Helper"),
]);

/**
 * Canonical immutable Gateway Routing Manifest platform.
 * Nine ordered sections. Metadata only.
 */
export const GatewayRoutingManifestPlatform = Object.freeze({
  identity,
  dependency,
  phaseReferences: GatewayRoutingManifestInventoryCatalog.phaseReferences,
  inventory: GatewayRoutingManifestInventoryCatalog,
  metadata: GatewayRoutingManifestMetadata,
  ownership: GatewayRoutingManifestOwnership,
  boundaries: GatewayRoutingManifestBoundaries,
  readiness: GatewayRoutingManifestReadinessDeclaration,
  summary: buildGatewayRoutingManifestSummary(),
  apiRegistry: GatewayRoutingManifestApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: GatewayRoutingManifestStatus,
  nextPhase: GatewayRoutingManifestReadinessDeclaration.nextPhase,
  downstreamReadiness: GatewayRoutingManifestReadiness,
  validationPlatform: GatewayRoutingValidationPlatform,
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
 * Deterministic frozen Gateway Routing Manifest summary.
 * Counts are derived exclusively from canonical inventory collections.
 */
export function getGatewayRoutingManifestSummary(): GatewayRoutingManifestSummary {
  return buildGatewayRoutingManifestSummary();
}
