/**
 * NEA-1:5 — Executive Gateway Manifest.
 *
 * Canonical immutable architectural publication of NEA-1 through Validation.
 * Consumes only NEA-1:4 Executive Gateway Validation public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by NEA-1:5.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewayManifestId
 *   ExecutiveGatewayManifestVersion
 *   ExecutiveGatewayManifestName
 *   ExecutiveGatewayManifestNamespace
 *   ExecutiveGatewayManifestStatus
 *   ExecutiveGatewayManifestReadiness
 *   ExecutiveGatewayManifestPlatform
 *   getExecutiveGatewayManifestSummary()
 */

import {
  ExecutiveGatewayValidationId,
  ExecutiveGatewayValidationPlatform,
  ExecutiveGatewayValidationVersion,
} from "./executiveGatewayValidation.ts";
import { ExecutiveGatewayManifestInventoryCatalog } from "./executiveGatewayManifestInventory.ts";
import { ExecutiveGatewayManifestMetadata } from "./executiveGatewayManifestMetadata.ts";
import {
  ExecutiveGatewayManifestBoundaries,
  ExecutiveGatewayManifestOwnership,
} from "./executiveGatewayManifestOwnership.ts";
import {
  ExecutiveGatewayManifestReadinessDeclaration,
  ExecutiveGatewayManifestReadinessValue,
} from "./executiveGatewayManifestReadiness.ts";
import { buildExecutiveGatewayManifestSummary } from "./executiveGatewayManifestSummary.ts";
import type {
  ExecutiveGatewayManifestIdentity,
  ExecutiveGatewayManifestSummary,
} from "./executiveGatewayManifestTypes.ts";

/** Canonical manifest identity. */
export const ExecutiveGatewayManifestId =
  "NEA-1:5/ExecutiveGatewayManifest" as const;

/** Human-readable manifest name. */
export const ExecutiveGatewayManifestName =
  "Executive Gateway Manifest" as const;

/** Semantic version. */
export const ExecutiveGatewayManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewayManifestNamespace =
  "nexora.nea.executive-gateway.manifest" as const;

/** Manifest status. */
export const ExecutiveGatewayManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewayManifestReadiness =
  ExecutiveGatewayManifestReadinessValue;

const identity: ExecutiveGatewayManifestIdentity = Object.freeze({
  manifestId: ExecutiveGatewayManifestId,
  manifestName: ExecutiveGatewayManifestName,
  manifestVersion: ExecutiveGatewayManifestVersion,
  manifestNamespace: ExecutiveGatewayManifestNamespace,
  layer: "NEA" as const,
  phase: "NEA-1:5" as const,
  stage: "Manifest" as const,
  sourcePhase: "NEA-1:5" as const,
  owner: "NEA-1 Executive Gateway",
  status: ExecutiveGatewayManifestStatus,
  readiness: ExecutiveGatewayManifestReadiness,
  validationId: ExecutiveGatewayValidationId,
  validationVersion: ExecutiveGatewayValidationVersion,
  description:
    "Immutable architectural publication of the Executive Gateway aggregating Foundation, Registry, Model, and Validation through canonical references only.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-1:5/Dependency/NEA14Validation",
  directPreviousPhaseModule: "executiveGatewayValidation.ts" as const,
  validationOnly: true as const,
  validationId: ExecutiveGatewayValidationId,
  validationVersion: ExecutiveGatewayValidationVersion,
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
    "NEA-1:5 → NEA-1:4 ValidationPlatform → Model → Registry → Foundation",
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
    id: `NEA-1:5/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-1:5" as const,
    section: "Manifest" as const,
    kind,
    version: ExecutiveGatewayManifestVersion,
    status: ExecutiveGatewayManifestStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewayManifest.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewayManifestApiRegistry = Object.freeze([
  manifestApi("ExecutiveGatewayManifestId", "IdentityConstant"),
  manifestApi("ExecutiveGatewayManifestVersion", "IdentityConstant"),
  manifestApi("ExecutiveGatewayManifestName", "IdentityConstant"),
  manifestApi("ExecutiveGatewayManifestNamespace", "IdentityConstant"),
  manifestApi("ExecutiveGatewayManifestStatus", "MetadataConstant"),
  manifestApi("ExecutiveGatewayManifestReadiness", "MetadataConstant"),
  manifestApi("ExecutiveGatewayManifestPlatform", "Aggregate"),
  manifestApi("getExecutiveGatewayManifestSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Manifest platform.
 * Nine ordered sections. Metadata only.
 */
export const ExecutiveGatewayManifestPlatform = Object.freeze({
  identity,
  dependency,
  phaseReferences: ExecutiveGatewayManifestInventoryCatalog.phaseReferences,
  inventory: ExecutiveGatewayManifestInventoryCatalog,
  metadata: ExecutiveGatewayManifestMetadata,
  ownership: ExecutiveGatewayManifestOwnership,
  boundaries: ExecutiveGatewayManifestBoundaries,
  readiness: ExecutiveGatewayManifestReadinessDeclaration,
  summary: buildExecutiveGatewayManifestSummary(),
  apiRegistry: ExecutiveGatewayManifestApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewayManifestStatus,
  nextPhase: ExecutiveGatewayManifestReadinessDeclaration.nextPhase,
  downstreamReadiness: ExecutiveGatewayManifestReadiness,
  validationPlatform: ExecutiveGatewayValidationPlatform,
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
 * Deterministic frozen Executive Gateway Manifest summary.
 * Counts are derived exclusively from canonical inventory collections.
 */
export function getExecutiveGatewayManifestSummary(): ExecutiveGatewayManifestSummary {
  return buildExecutiveGatewayManifestSummary();
}
