/**
 * NEA-8:3 — Executive Gateway Suite Model.
 *
 * Canonical immutable domain model layer for the Executive Gateway Suite.
 * Consumes only NEA-8:2 Executive Gateway Suite Registry public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by NEA-8:3.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewaySuiteModelId
 *   ExecutiveGatewaySuiteModelVersion
 *   ExecutiveGatewaySuiteModelName
 *   ExecutiveGatewaySuiteModelNamespace
 *   ExecutiveGatewaySuiteModelStatus
 *   ExecutiveGatewaySuiteModelReadiness
 *   ExecutiveGatewaySuiteModelPlatform
 *   getExecutiveGatewaySuiteModelSummary()
 */

import {
  ExecutiveGatewaySuiteRegistryId,
  ExecutiveGatewaySuiteRegistryPlatform,
  ExecutiveGatewaySuiteRegistryVersion,
} from "./executiveGatewaySuiteRegistry.ts";
import { ExecutiveGatewaySuiteModelLifecycle } from "./executiveGatewaySuiteModelLifecycle.ts";
import { ExecutiveGatewaySuiteModelMetadata } from "./executiveGatewaySuiteModelMetadata.ts";
import {
  ExecutiveGatewaySuiteModelBoundaries,
  ExecutiveGatewaySuiteModelOwnership,
} from "./executiveGatewaySuiteModelOwnership.ts";
import { ExecutiveGatewaySuiteDomainModelCatalog } from "./executiveGatewaySuiteModels.ts";
import { ExecutiveGatewaySuiteModelRelationshipCatalog } from "./executiveGatewaySuiteRelationships.ts";
import type {
  ExecutiveGatewaySuiteModelIdentity,
  ExecutiveGatewaySuiteModelSummary,
} from "./executiveGatewaySuiteModelTypes.ts";

/** Canonical model identity. */
export const ExecutiveGatewaySuiteModelId =
  "NEA-8:3/ExecutiveGatewaySuiteModel" as const;

/** Human-readable model name. */
export const ExecutiveGatewaySuiteModelName =
  "Executive Gateway Suite Model" as const;

/** Semantic version. */
export const ExecutiveGatewaySuiteModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewaySuiteModelNamespace =
  "nexora.nea.executive-gateway-suite.model" as const;

/** Model status. */
export const ExecutiveGatewaySuiteModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewaySuiteModelReadiness =
  "ReadyForValidation" as const;

const identity: ExecutiveGatewaySuiteModelIdentity = Object.freeze({
  modelId: ExecutiveGatewaySuiteModelId,
  modelName: ExecutiveGatewaySuiteModelName,
  modelVersion: ExecutiveGatewaySuiteModelVersion,
  modelNamespace: ExecutiveGatewaySuiteModelNamespace,
  layer: "NEA" as const,
  phase: "NEA-8:3" as const,
  stage: "Model" as const,
  sourcePhase: "NEA-8:3" as const,
  owner: "NEA-8 Executive Gateway Suite",
  status: ExecutiveGatewaySuiteModelStatus,
  readiness: ExecutiveGatewaySuiteModelReadiness,
  registryId: ExecutiveGatewaySuiteRegistryId,
  registryVersion: ExecutiveGatewaySuiteRegistryVersion,
  suiteName: "Executive Gateway Suite" as const,
  description:
    "Immutable domain models transforming Registry declarations into strongly typed Executive Gateway Suite structures without runtime gateway behavior, orchestration, or business logic.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-8:3/Dependency/NEA82Registry",
  directPreviousPhaseModule: "executiveGatewaySuiteRegistry.ts" as const,
  registryOnly: true as const,
  registryId: ExecutiveGatewaySuiteRegistryId,
  registryVersion: ExecutiveGatewaySuiteRegistryVersion,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  nea1ThroughNea7InternalImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "NEA-8:3 → NEA-8:2 ExecutiveGatewaySuiteRegistryPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domainModels",
  "relationships",
  "lifecycle",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const modelApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-8:3/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-8:3" as const,
    section: "Model" as const,
    kind,
    version: ExecutiveGatewaySuiteModelVersion,
    status: ExecutiveGatewaySuiteModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewaySuiteModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewaySuiteModelApiRegistry = Object.freeze([
  modelApi("ExecutiveGatewaySuiteModelId", "IdentityConstant"),
  modelApi("ExecutiveGatewaySuiteModelVersion", "IdentityConstant"),
  modelApi("ExecutiveGatewaySuiteModelName", "IdentityConstant"),
  modelApi("ExecutiveGatewaySuiteModelNamespace", "IdentityConstant"),
  modelApi("ExecutiveGatewaySuiteModelStatus", "MetadataConstant"),
  modelApi("ExecutiveGatewaySuiteModelReadiness", "MetadataConstant"),
  modelApi("ExecutiveGatewaySuiteModelPlatform", "Aggregate"),
  modelApi("getExecutiveGatewaySuiteModelSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Suite Model platform.
 * Nine ordered sections. Metadata only.
 */
export const ExecutiveGatewaySuiteModelPlatform = Object.freeze({
  identity,
  dependency,
  domainModels: ExecutiveGatewaySuiteDomainModelCatalog,
  relationships: ExecutiveGatewaySuiteModelRelationshipCatalog,
  lifecycle: ExecutiveGatewaySuiteModelLifecycle,
  metadata: ExecutiveGatewaySuiteModelMetadata,
  ownership: ExecutiveGatewaySuiteModelOwnership,
  boundaries: ExecutiveGatewaySuiteModelBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-8:3/ModelReadiness",
    readiness: ExecutiveGatewaySuiteModelReadiness,
    nextPhase: ExecutiveGatewaySuiteModelMetadata.nextPhase,
    claimsReadyForValidation: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeGatewayImplemented: false as const,
    claimsRuntimeConnectorsImplemented: false as const,
    claimsRuntimeSessionsImplemented: false as const,
    claimsRuntimeRoutingImplemented: false as const,
    claimsRuntimeSecurityImplemented: false as const,
    claimsRuntimeMessageNormalizationImplemented: false as const,
    claimsRuntimeIntakeOrchestrationImplemented: false as const,
    claimsAiImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ExecutiveGatewaySuiteModelApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewaySuiteModelStatus,
  nextPhase: ExecutiveGatewaySuiteModelMetadata.nextPhase,
  downstreamReadiness: ExecutiveGatewaySuiteModelReadiness,
  registryPlatform: ExecutiveGatewaySuiteRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsRuntimeGateway: false as const,
  implementsRuntimeConnectors: false as const,
  implementsRuntimeSessions: false as const,
  implementsRuntimeRouting: false as const,
  implementsRuntimeSecurity: false as const,
  implementsRuntimeMessageNormalization: false as const,
  implementsRuntimeIntakeOrchestration: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
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
 * Deterministic frozen Executive Gateway Suite Model summary.
 * Counts are derived exclusively from canonical model collections and Registry.
 */
export function getExecutiveGatewaySuiteModelSummary(): ExecutiveGatewaySuiteModelSummary {
  const meta = ExecutiveGatewaySuiteModelMetadata;
  return Object.freeze({
    modelId: ExecutiveGatewaySuiteModelId,
    version: ExecutiveGatewaySuiteModelVersion,
    name: ExecutiveGatewaySuiteModelName,
    namespace: ExecutiveGatewaySuiteModelNamespace,
    layer: "NEA" as const,
    phase: "NEA-8:3" as const,
    status: ExecutiveGatewaySuiteModelStatus,
    readiness: ExecutiveGatewaySuiteModelReadiness,
    registryId: ExecutiveGatewaySuiteRegistryId,
    suiteName: "Executive Gateway Suite" as const,
    domainModelCount: meta.domainModelCount,
    suiteComponentModelCount: meta.suiteComponentModelCount,
    relationshipCount: meta.relationshipCount,
    lifecycleStateCount: meta.lifecycleStateCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicApiInventoryTotal: meta.publicApiInventoryTotal,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
