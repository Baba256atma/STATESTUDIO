/**
 * NEA-8:5 — Executive Gateway Suite Manifest.
 *
 * Canonical immutable architectural publication of NEA-8 through Validation.
 * Consumes only NEA-8:4 Executive Gateway Suite Validation public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by NEA-8:5.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewaySuiteManifestId
 *   ExecutiveGatewaySuiteManifestVersion
 *   ExecutiveGatewaySuiteManifestName
 *   ExecutiveGatewaySuiteManifestNamespace
 *   ExecutiveGatewaySuiteManifestStatus
 *   ExecutiveGatewaySuiteManifestReadiness
 *   ExecutiveGatewaySuiteManifestPlatform
 *   getExecutiveGatewaySuiteManifestSummary()
 */

import {
  ExecutiveGatewaySuiteValidationId,
  ExecutiveGatewaySuiteValidationPlatform,
  ExecutiveGatewaySuiteValidationVersion,
} from "./executiveGatewaySuiteValidation.ts";
import { ExecutiveGatewaySuiteManifestInventoryCatalog } from "./executiveGatewaySuiteManifestInventory.ts";
import { ExecutiveGatewaySuiteManifestMetadata } from "./executiveGatewaySuiteManifestMetadata.ts";
import {
  ExecutiveGatewaySuiteManifestBoundaries,
  ExecutiveGatewaySuiteManifestOwnership,
} from "./executiveGatewaySuiteManifestOwnership.ts";
import {
  ExecutiveGatewaySuiteManifestReadinessDeclaration,
  ExecutiveGatewaySuiteManifestReadinessValue,
} from "./executiveGatewaySuiteManifestReadiness.ts";
import { buildExecutiveGatewaySuiteManifestSummary } from "./executiveGatewaySuiteManifestSummary.ts";
import type {
  ExecutiveGatewaySuiteManifestIdentity,
  ExecutiveGatewaySuiteManifestSummary,
} from "./executiveGatewaySuiteManifestTypes.ts";

/** Canonical manifest identity. */
export const ExecutiveGatewaySuiteManifestId =
  "NEA-8:5/ExecutiveGatewaySuiteManifest" as const;

/** Human-readable manifest name. */
export const ExecutiveGatewaySuiteManifestName =
  "Executive Gateway Suite Manifest" as const;

/** Semantic version. */
export const ExecutiveGatewaySuiteManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewaySuiteManifestNamespace =
  "nexora.nea.executive-gateway-suite.manifest" as const;

/** Manifest status. */
export const ExecutiveGatewaySuiteManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewaySuiteManifestReadiness =
  ExecutiveGatewaySuiteManifestReadinessValue;

const identity: ExecutiveGatewaySuiteManifestIdentity = Object.freeze({
  manifestId: ExecutiveGatewaySuiteManifestId,
  manifestName: ExecutiveGatewaySuiteManifestName,
  manifestVersion: ExecutiveGatewaySuiteManifestVersion,
  manifestNamespace: ExecutiveGatewaySuiteManifestNamespace,
  layer: "NEA" as const,
  phase: "NEA-8:5" as const,
  stage: "Manifest" as const,
  sourcePhase: "NEA-8:5" as const,
  owner: "NEA-8 Executive Gateway Suite",
  status: ExecutiveGatewaySuiteManifestStatus,
  readiness: ExecutiveGatewaySuiteManifestReadiness,
  validationId: ExecutiveGatewaySuiteValidationId,
  validationVersion: ExecutiveGatewaySuiteValidationVersion,
  suiteName: "Executive Gateway Suite" as const,
  description:
    "Immutable architectural publication of the Executive Gateway Suite aggregating Foundation, Registry, Model, and Validation through canonical references only.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-8:5/Dependency/NEA84Validation",
  directPreviousPhaseModule: "executiveGatewaySuiteValidation.ts" as const,
  validationOnly: true as const,
  validationId: ExecutiveGatewaySuiteValidationId,
  validationVersion: ExecutiveGatewaySuiteValidationVersion,
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
    "NEA-8:5 → NEA-8:4 ValidationPlatform → Model → Registry → Foundation",
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
    id: `NEA-8:5/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-8:5" as const,
    section: "Manifest" as const,
    kind,
    version: ExecutiveGatewaySuiteManifestVersion,
    status: ExecutiveGatewaySuiteManifestStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewaySuiteManifest.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewaySuiteManifestApiRegistry = Object.freeze([
  manifestApi("ExecutiveGatewaySuiteManifestId", "IdentityConstant"),
  manifestApi("ExecutiveGatewaySuiteManifestVersion", "IdentityConstant"),
  manifestApi("ExecutiveGatewaySuiteManifestName", "IdentityConstant"),
  manifestApi("ExecutiveGatewaySuiteManifestNamespace", "IdentityConstant"),
  manifestApi("ExecutiveGatewaySuiteManifestStatus", "MetadataConstant"),
  manifestApi("ExecutiveGatewaySuiteManifestReadiness", "MetadataConstant"),
  manifestApi("ExecutiveGatewaySuiteManifestPlatform", "Aggregate"),
  manifestApi("getExecutiveGatewaySuiteManifestSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Suite Manifest platform.
 * Nine ordered sections. Metadata only.
 */
export const ExecutiveGatewaySuiteManifestPlatform = Object.freeze({
  identity,
  dependency,
  phaseReferences:
    ExecutiveGatewaySuiteManifestInventoryCatalog.phaseReferences,
  inventory: ExecutiveGatewaySuiteManifestInventoryCatalog,
  metadata: ExecutiveGatewaySuiteManifestMetadata,
  ownership: ExecutiveGatewaySuiteManifestOwnership,
  boundaries: ExecutiveGatewaySuiteManifestBoundaries,
  readiness: ExecutiveGatewaySuiteManifestReadinessDeclaration,
  summary: buildExecutiveGatewaySuiteManifestSummary(),
  apiRegistry: ExecutiveGatewaySuiteManifestApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewaySuiteManifestStatus,
  nextPhase: ExecutiveGatewaySuiteManifestReadinessDeclaration.nextPhase,
  downstreamReadiness: ExecutiveGatewaySuiteManifestReadiness,
  validationPlatform: ExecutiveGatewaySuiteValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  implementsRuntimeGateway: false as const,
  implementsRuntimeConnectors: false as const,
  implementsRuntimeSessions: false as const,
  implementsRuntimeRouting: false as const,
  implementsRuntimeSecurity: false as const,
  implementsRuntimeMessageNormalization: false as const,
  implementsRuntimeIntakeOrchestration: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  invokesAssistant: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Suite Manifest summary.
 * Counts are derived exclusively from canonical inventory collections.
 */
export function getExecutiveGatewaySuiteManifestSummary(): ExecutiveGatewaySuiteManifestSummary {
  return buildExecutiveGatewaySuiteManifestSummary();
}
