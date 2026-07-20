/**
 * NEA-8:4 — Executive Gateway Suite Validation.
 *
 * Canonical immutable declarative validation architecture for the Executive Gateway Suite.
 * Consumes only NEA-8:3 Executive Gateway Suite Model public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by NEA-8:4.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewaySuiteValidationId
 *   ExecutiveGatewaySuiteValidationVersion
 *   ExecutiveGatewaySuiteValidationName
 *   ExecutiveGatewaySuiteValidationNamespace
 *   ExecutiveGatewaySuiteValidationStatus
 *   ExecutiveGatewaySuiteValidationReadiness
 *   ExecutiveGatewaySuiteValidationPlatform
 *   getExecutiveGatewaySuiteValidationSummary()
 */

import {
  ExecutiveGatewaySuiteModelId,
  ExecutiveGatewaySuiteModelPlatform,
  ExecutiveGatewaySuiteModelVersion,
} from "./executiveGatewaySuiteModel.ts";
import { ExecutiveGatewaySuiteValidationMetadata } from "./executiveGatewaySuiteValidationMetadata.ts";
import {
  ExecutiveGatewaySuiteValidationBoundaries,
  ExecutiveGatewaySuiteValidationOwnership,
} from "./executiveGatewaySuiteValidationOwnership.ts";
import { ExecutiveGatewaySuiteValidationPolicyCatalog } from "./executiveGatewaySuiteValidationPolicies.ts";
import { ExecutiveGatewaySuiteValidationRelationshipCatalog } from "./executiveGatewaySuiteValidationRelationships.ts";
import { ExecutiveGatewaySuiteValidationRuleCatalog } from "./executiveGatewaySuiteValidationRules.ts";
import type {
  ExecutiveGatewaySuiteValidationIdentity,
  ExecutiveGatewaySuiteValidationSummary,
} from "./executiveGatewaySuiteValidationTypes.ts";

/** Canonical validation identity. */
export const ExecutiveGatewaySuiteValidationId =
  "NEA-8:4/ExecutiveGatewaySuiteValidation" as const;

/** Human-readable validation name. */
export const ExecutiveGatewaySuiteValidationName =
  "Executive Gateway Suite Validation" as const;

/** Semantic version. */
export const ExecutiveGatewaySuiteValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewaySuiteValidationNamespace =
  "nexora.nea.executive-gateway-suite.validation" as const;

/** Validation status. */
export const ExecutiveGatewaySuiteValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewaySuiteValidationReadiness =
  "ReadyForManifest" as const;

const identity: ExecutiveGatewaySuiteValidationIdentity = Object.freeze({
  validationId: ExecutiveGatewaySuiteValidationId,
  validationName: ExecutiveGatewaySuiteValidationName,
  validationVersion: ExecutiveGatewaySuiteValidationVersion,
  validationNamespace: ExecutiveGatewaySuiteValidationNamespace,
  layer: "NEA" as const,
  phase: "NEA-8:4" as const,
  stage: "Validation" as const,
  sourcePhase: "NEA-8:4" as const,
  owner: "NEA-8 Executive Gateway Suite",
  status: ExecutiveGatewaySuiteValidationStatus,
  readiness: ExecutiveGatewaySuiteValidationReadiness,
  modelId: ExecutiveGatewaySuiteModelId,
  modelVersion: ExecutiveGatewaySuiteModelVersion,
  suiteName: "Executive Gateway Suite" as const,
  description:
    "Immutable declarative validation architecture for Executive Gateway Suite domain models. Metadata only; no validation engine, runtime gateway behavior, orchestration, or business logic.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-8:4/Dependency/NEA83Model",
  directPreviousPhaseModule: "executiveGatewaySuiteModel.ts" as const,
  modelOnly: true as const,
  modelId: ExecutiveGatewaySuiteModelId,
  modelVersion: ExecutiveGatewaySuiteModelVersion,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  nea1ThroughNea7InternalImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "NEA-8:4 → NEA-8:3 ExecutiveGatewaySuiteModelPlatform (exclusive)",
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
    id: `NEA-8:4/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-8:4" as const,
    section: "Validation" as const,
    kind,
    version: ExecutiveGatewaySuiteValidationVersion,
    status: ExecutiveGatewaySuiteValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewaySuiteValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewaySuiteValidationApiRegistry = Object.freeze([
  validationApi("ExecutiveGatewaySuiteValidationId", "IdentityConstant"),
  validationApi("ExecutiveGatewaySuiteValidationVersion", "IdentityConstant"),
  validationApi("ExecutiveGatewaySuiteValidationName", "IdentityConstant"),
  validationApi("ExecutiveGatewaySuiteValidationNamespace", "IdentityConstant"),
  validationApi("ExecutiveGatewaySuiteValidationStatus", "MetadataConstant"),
  validationApi("ExecutiveGatewaySuiteValidationReadiness", "MetadataConstant"),
  validationApi("ExecutiveGatewaySuiteValidationPlatform", "Aggregate"),
  validationApi("getExecutiveGatewaySuiteValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Suite Validation platform.
 * Ten ordered sections. Metadata only.
 */
export const ExecutiveGatewaySuiteValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: ExecutiveGatewaySuiteValidationRuleCatalog.categories,
  rules: ExecutiveGatewaySuiteValidationRuleCatalog,
  relationships: ExecutiveGatewaySuiteValidationRelationshipCatalog,
  policies: ExecutiveGatewaySuiteValidationPolicyCatalog,
  metadata: ExecutiveGatewaySuiteValidationMetadata,
  ownership: ExecutiveGatewaySuiteValidationOwnership,
  boundaries: ExecutiveGatewaySuiteValidationBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-8:4/ValidationReadiness",
    readiness: ExecutiveGatewaySuiteValidationReadiness,
    nextPhase: ExecutiveGatewaySuiteValidationMetadata.nextPhase,
    claimsReadyForManifest: true as const,
    claimsReadyForRuntime: false as const,
    claimsValidationEngine: false as const,
    claimsRuntimeGatewayImplemented: false as const,
    claimsRuntimeConnectorsImplemented: false as const,
    claimsRuntimeSessionsImplemented: false as const,
    claimsRuntimeRoutingImplemented: false as const,
    claimsRuntimeSecurityImplemented: false as const,
    claimsRuntimeMessageNormalizationImplemented: false as const,
    claimsRuntimeIntakeOrchestrationImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ExecutiveGatewaySuiteValidationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewaySuiteValidationStatus,
  nextPhase: ExecutiveGatewaySuiteValidationMetadata.nextPhase,
  downstreamReadiness: ExecutiveGatewaySuiteValidationReadiness,
  modelPlatform: ExecutiveGatewaySuiteModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  implementsRuntimeGateway: false as const,
  implementsRuntimeConnectors: false as const,
  implementsRuntimeSessions: false as const,
  implementsRuntimeRouting: false as const,
  implementsRuntimeSecurity: false as const,
  implementsRuntimeMessageNormalization: false as const,
  implementsRuntimeIntakeOrchestration: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Suite Validation summary.
 * Counts are derived exclusively from canonical validation collections and Model.
 */
export function getExecutiveGatewaySuiteValidationSummary(): ExecutiveGatewaySuiteValidationSummary {
  const meta = ExecutiveGatewaySuiteValidationMetadata;
  return Object.freeze({
    validationId: ExecutiveGatewaySuiteValidationId,
    version: ExecutiveGatewaySuiteValidationVersion,
    name: ExecutiveGatewaySuiteValidationName,
    namespace: ExecutiveGatewaySuiteValidationNamespace,
    layer: "NEA" as const,
    phase: "NEA-8:4" as const,
    status: ExecutiveGatewaySuiteValidationStatus,
    readiness: ExecutiveGatewaySuiteValidationReadiness,
    modelId: ExecutiveGatewaySuiteModelId,
    suiteName: "Executive Gateway Suite" as const,
    categoryCount: meta.categoryCount,
    domainCategoryCount: meta.domainCategoryCount,
    ruleCount: meta.ruleCount,
    crossModelRuleCount: meta.crossModelRuleCount,
    platformIntegrityRuleCount: meta.platformIntegrityRuleCount,
    relationshipCount: meta.relationshipCount,
    policyCount: meta.policyCount,
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
