/**
 * NEA-5:4 — Gateway Routing Validation.
 *
 * Canonical immutable declarative validation architecture for Gateway Routing.
 * Consumes only NEA-5:3 Gateway Routing Model public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by NEA-5:4.
 *
 * Public exports (exactly 8):
 *   GatewayRoutingValidationId
 *   GatewayRoutingValidationVersion
 *   GatewayRoutingValidationName
 *   GatewayRoutingValidationNamespace
 *   GatewayRoutingValidationStatus
 *   GatewayRoutingValidationReadiness
 *   GatewayRoutingValidationPlatform
 *   getGatewayRoutingValidationSummary()
 */

import {
  GatewayRoutingModelId,
  GatewayRoutingModelPlatform,
  GatewayRoutingModelVersion,
} from "./gatewayRoutingModel.ts";
import { GatewayRoutingValidationMetadata } from "./gatewayRoutingValidationMetadata.ts";
import {
  GatewayRoutingValidationBoundaries,
  GatewayRoutingValidationOwnership,
} from "./gatewayRoutingValidationOwnership.ts";
import { GatewayRoutingValidationPolicyCatalog } from "./gatewayRoutingValidationPolicies.ts";
import { GatewayRoutingValidationRelationshipCatalog } from "./gatewayRoutingValidationRelationships.ts";
import { GatewayRoutingValidationRuleCatalog } from "./gatewayRoutingValidationRules.ts";
import type {
  GatewayRoutingValidationIdentity,
  GatewayRoutingValidationSummary,
} from "./gatewayRoutingValidationTypes.ts";

/** Canonical validation identity. */
export const GatewayRoutingValidationId =
  "NEA-5:4/GatewayRoutingValidation" as const;

/** Human-readable validation name. */
export const GatewayRoutingValidationName =
  "Gateway Routing Validation" as const;

/** Semantic version. */
export const GatewayRoutingValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const GatewayRoutingValidationNamespace =
  "nexora.nea.gateway-routing.validation" as const;

/** Validation status. */
export const GatewayRoutingValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const GatewayRoutingValidationReadiness = "ReadyForManifest" as const;

const identity: GatewayRoutingValidationIdentity = Object.freeze({
  validationId: GatewayRoutingValidationId,
  validationName: GatewayRoutingValidationName,
  validationVersion: GatewayRoutingValidationVersion,
  validationNamespace: GatewayRoutingValidationNamespace,
  layer: "NEA" as const,
  phase: "NEA-5:4" as const,
  stage: "Validation" as const,
  sourcePhase: "NEA-5:4" as const,
  owner: "NEA-5 Gateway Routing",
  status: GatewayRoutingValidationStatus,
  readiness: GatewayRoutingValidationReadiness,
  modelId: GatewayRoutingModelId,
  modelVersion: GatewayRoutingModelVersion,
  description:
    "Immutable declarative validation architecture for Gateway Routing domain models. Metadata only; no validation engine.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-5:4/Dependency/NEA53Model",
  directPreviousPhaseModule: "gatewayRoutingModel.ts" as const,
  modelOnly: true as const,
  modelId: GatewayRoutingModelId,
  modelVersion: GatewayRoutingModelVersion,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "NEA-5:4 → NEA-5:3 GatewayRoutingModelPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "rules",
  "relationships",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const validationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-5:4/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-5:4" as const,
    section: "Validation" as const,
    kind,
    version: GatewayRoutingValidationVersion,
    status: GatewayRoutingValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "gatewayRoutingValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const GatewayRoutingValidationApiRegistry = Object.freeze([
  validationApi("GatewayRoutingValidationId", "IdentityConstant"),
  validationApi("GatewayRoutingValidationVersion", "IdentityConstant"),
  validationApi("GatewayRoutingValidationName", "IdentityConstant"),
  validationApi("GatewayRoutingValidationNamespace", "IdentityConstant"),
  validationApi("GatewayRoutingValidationStatus", "MetadataConstant"),
  validationApi("GatewayRoutingValidationReadiness", "MetadataConstant"),
  validationApi("GatewayRoutingValidationPlatform", "Aggregate"),
  validationApi("getGatewayRoutingValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Gateway Routing Validation platform.
 * Ten ordered sections. Metadata only.
 */
export const GatewayRoutingValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: GatewayRoutingValidationRuleCatalog.categories,
  rules: GatewayRoutingValidationRuleCatalog,
  relationships: GatewayRoutingValidationRelationshipCatalog,
  policies: GatewayRoutingValidationPolicyCatalog,
  metadata: GatewayRoutingValidationMetadata,
  ownership: GatewayRoutingValidationOwnership,
  boundaries: GatewayRoutingValidationBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-5:4/ValidationReadiness",
    readiness: GatewayRoutingValidationReadiness,
    nextPhase: GatewayRoutingValidationMetadata.nextPhase,
    claimsReadyForManifest: true as const,
    claimsReadyForRuntime: false as const,
    claimsValidationEngine: false as const,
    claimsRuntimeRoutingImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: GatewayRoutingValidationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: GatewayRoutingValidationStatus,
  nextPhase: GatewayRoutingValidationMetadata.nextPhase,
  downstreamReadiness: GatewayRoutingValidationReadiness,
  modelPlatform: GatewayRoutingModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  executesStrategies: false as const,
  implementsConsumerSelection: false as const,
  processesMessages: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Gateway Routing Validation summary.
 * Counts are derived exclusively from canonical validation collections.
 */
export function getGatewayRoutingValidationSummary(): GatewayRoutingValidationSummary {
  const meta = GatewayRoutingValidationMetadata;
  return Object.freeze({
    validationId: GatewayRoutingValidationId,
    version: GatewayRoutingValidationVersion,
    name: GatewayRoutingValidationName,
    namespace: GatewayRoutingValidationNamespace,
    layer: "NEA" as const,
    phase: "NEA-5:4" as const,
    status: GatewayRoutingValidationStatus,
    readiness: GatewayRoutingValidationReadiness,
    modelId: GatewayRoutingModelId,
    categoryCount: meta.categoryCount,
    ruleCount: meta.ruleCount,
    relationshipCount: meta.relationshipCount,
    policyCount: meta.policyCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
