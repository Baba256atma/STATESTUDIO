/**
 * NEA-4:5 — Security Gateway Manifest.
 *
 * Canonical immutable architectural publication of NEA-4 through Validation.
 * Consumes only NEA-4:4 Security Gateway Validation public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by NEA-4:5.
 *
 * Public exports (exactly 8):
 *   SecurityGatewayManifestId
 *   SecurityGatewayManifestVersion
 *   SecurityGatewayManifestName
 *   SecurityGatewayManifestNamespace
 *   SecurityGatewayManifestStatus
 *   SecurityGatewayManifestReadiness
 *   SecurityGatewayManifestPlatform
 *   getSecurityGatewayManifestSummary()
 */

import {
  SecurityGatewayValidationId,
  SecurityGatewayValidationPlatform,
  SecurityGatewayValidationVersion,
} from "./securityGatewayValidation.ts";
import { SecurityGatewayManifestInventoryCatalog } from "./securityGatewayManifestInventory.ts";
import { SecurityGatewayManifestMetadata } from "./securityGatewayManifestMetadata.ts";
import {
  SecurityGatewayManifestBoundaries,
  SecurityGatewayManifestOwnership,
} from "./securityGatewayManifestOwnership.ts";
import {
  SecurityGatewayManifestReadinessDeclaration,
  SecurityGatewayManifestReadinessValue,
} from "./securityGatewayManifestReadiness.ts";
import { buildSecurityGatewayManifestSummary } from "./securityGatewayManifestSummary.ts";
import type {
  SecurityGatewayManifestIdentity,
  SecurityGatewayManifestSummary,
} from "./securityGatewayManifestTypes.ts";

/** Canonical manifest identity. */
export const SecurityGatewayManifestId =
  "NEA-4:5/SecurityGatewayManifest" as const;

/** Human-readable manifest name. */
export const SecurityGatewayManifestName =
  "Security Gateway Manifest" as const;

/** Semantic version. */
export const SecurityGatewayManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SecurityGatewayManifestNamespace =
  "nexora.nea.security-gateway.manifest" as const;

/** Manifest status. */
export const SecurityGatewayManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const SecurityGatewayManifestReadiness =
  SecurityGatewayManifestReadinessValue;

const identity: SecurityGatewayManifestIdentity = Object.freeze({
  manifestId: SecurityGatewayManifestId,
  manifestName: SecurityGatewayManifestName,
  manifestVersion: SecurityGatewayManifestVersion,
  manifestNamespace: SecurityGatewayManifestNamespace,
  layer: "NEA" as const,
  phase: "NEA-4:5" as const,
  stage: "Manifest" as const,
  sourcePhase: "NEA-4:5" as const,
  owner: "NEA-4 Security Gateway",
  status: SecurityGatewayManifestStatus,
  readiness: SecurityGatewayManifestReadiness,
  validationId: SecurityGatewayValidationId,
  validationVersion: SecurityGatewayValidationVersion,
  description:
    "Immutable architectural publication of Security Gateway aggregating Foundation, Registry, Model, and Validation through canonical references only.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-4:5/Dependency/NEA44Validation",
  directPreviousPhaseModule: "securityGatewayValidation.ts" as const,
  validationOnly: true as const,
  validationId: SecurityGatewayValidationId,
  validationVersion: SecurityGatewayValidationVersion,
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
    "NEA-4:5 → NEA-4:4 ValidationPlatform → Model → Registry → Foundation",
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
    id: `NEA-4:5/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-4:5" as const,
    section: "Manifest" as const,
    kind,
    version: SecurityGatewayManifestVersion,
    status: SecurityGatewayManifestStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "securityGatewayManifest.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SecurityGatewayManifestApiRegistry = Object.freeze([
  manifestApi("SecurityGatewayManifestId", "IdentityConstant"),
  manifestApi("SecurityGatewayManifestVersion", "IdentityConstant"),
  manifestApi("SecurityGatewayManifestName", "IdentityConstant"),
  manifestApi("SecurityGatewayManifestNamespace", "IdentityConstant"),
  manifestApi("SecurityGatewayManifestStatus", "MetadataConstant"),
  manifestApi("SecurityGatewayManifestReadiness", "MetadataConstant"),
  manifestApi("SecurityGatewayManifestPlatform", "Aggregate"),
  manifestApi("getSecurityGatewayManifestSummary", "Helper"),
]);

/**
 * Canonical immutable Security Gateway Manifest platform.
 * Nine ordered sections. Metadata only.
 */
export const SecurityGatewayManifestPlatform = Object.freeze({
  identity,
  dependency,
  phaseReferences: SecurityGatewayManifestInventoryCatalog.phaseReferences,
  inventory: SecurityGatewayManifestInventoryCatalog,
  metadata: SecurityGatewayManifestMetadata,
  ownership: SecurityGatewayManifestOwnership,
  boundaries: SecurityGatewayManifestBoundaries,
  readiness: SecurityGatewayManifestReadinessDeclaration,
  summary: buildSecurityGatewayManifestSummary(),
  apiRegistry: SecurityGatewayManifestApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SecurityGatewayManifestStatus,
  nextPhase: SecurityGatewayManifestReadinessDeclaration.nextPhase,
  downstreamReadiness: SecurityGatewayManifestReadiness,
  validationPlatform: SecurityGatewayValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsEncryption: false as const,
  runtimeSecurity: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Security Gateway Manifest summary.
 * Counts are derived exclusively from canonical inventory collections.
 */
export function getSecurityGatewayManifestSummary(): SecurityGatewayManifestSummary {
  return buildSecurityGatewayManifestSummary();
}
