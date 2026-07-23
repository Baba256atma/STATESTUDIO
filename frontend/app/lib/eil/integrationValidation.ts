/**
 * EIL-1:4 — Integration Validation.
 *
 * Canonical immutable validation architecture for the Executive Integration Layer.
 * Consumes only the EIL-1:3 Integration Model aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by EIL-1:4.
 *
 * Public exports (exactly 8):
 *   IntegrationValidationIdentity
 *   IntegrationValidationRules
 *   IntegrationValidationCategories
 *   IntegrationValidationFindings
 *   IntegrationValidationReadiness
 *   IntegrationValidationCollections
 *   IntegrationValidationSummary
 *   IntegrationValidationPlatform
 */

import {
  IntegrationModelIdentity,
  IntegrationModelPlatform,
  IntegrationModelSummary,
} from "./integrationModel.ts";
import { IntegrationValidationCategories } from "./integrationValidationCategories.ts";
import { IntegrationValidationFindings } from "./integrationValidationFindings.ts";
import {
  IntegrationValidationDependencies,
  IntegrationValidationIdentity,
  IntegrationValidationReadinessState,
  IntegrationValidationStatus,
} from "./integrationValidationIdentity.ts";
import { IntegrationValidationReadiness } from "./integrationValidationReadiness.ts";
import { IntegrationValidationRules } from "./integrationValidationRules.ts";
import type {
  IntegrationValidationInventory,
  IntegrationValidationResult,
  IntegrationValidationSummaryDescriptor,
} from "./integrationValidationTypes.ts";

export { IntegrationValidationIdentity } from "./integrationValidationIdentity.ts";
export { IntegrationValidationRules } from "./integrationValidationRules.ts";
export { IntegrationValidationCategories } from "./integrationValidationCategories.ts";
export { IntegrationValidationFindings } from "./integrationValidationFindings.ts";
export { IntegrationValidationReadiness } from "./integrationValidationReadiness.ts";

const validationResult: IntegrationValidationResult = Object.freeze({
  resultId: "EIL-1:4/Result/Declared",
  declaredFindingStates: Object.freeze(
    IntegrationValidationFindings.map((item) => item.state),
  ),
  runtimeExecuted: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from validation arrays.
 */
export const IntegrationValidationCollections = Object.freeze({
  collectionsId: "EIL-1:4/Collections",
  sourcePhase: "EIL-1:4" as const,
  rules: IntegrationValidationRules,
  categories: IntegrationValidationCategories,
  findings: IntegrationValidationFindings,
  validationRuleCount: IntegrationValidationRules.length,
  categoryCount: IntegrationValidationCategories.length,
  findingStateCount: IntegrationValidationFindings.length,
  totalValidationEntryCount:
    IntegrationValidationRules.length +
    IntegrationValidationCategories.length +
    IntegrationValidationFindings.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const inventory: IntegrationValidationInventory = Object.freeze({
  inventoryId: "EIL-1:4/Inventory",
  validationRuleCount: IntegrationValidationCollections.validationRuleCount,
  categoryCount: IntegrationValidationCollections.categoryCount,
  findingStateCount: IntegrationValidationCollections.findingStateCount,
  totalValidationEntryCount:
    IntegrationValidationCollections.totalValidationEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Validation summary.
 * Inventory counts are derived from canonical collections only.
 */
export const IntegrationValidationSummary: IntegrationValidationSummaryDescriptor =
  Object.freeze({
    validationId: "EIL-1:4/IntegrationValidation",
    version: "1.0.0",
    name: "Integration Validation",
    namespace: "nexora.eil.integration.validation",
    status: IntegrationValidationStatus,
    readiness: IntegrationValidationReadinessState,
    modelId: "EIL-1:3/IntegrationModel",
    validationRuleCount: IntegrationValidationCollections.validationRuleCount,
    categoryCount: IntegrationValidationCollections.categoryCount,
    findingStateCount: IntegrationValidationCollections.findingStateCount,
    totalValidationEntryCount:
      IntegrationValidationCollections.totalValidationEntryCount,
    nextPhase: "EIL-1:5 — Integration Manifest",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-1:4/Dependency/EIL13Model",
  phaseDependencies: IntegrationValidationDependencies,
  phaseDependencyCount: IntegrationValidationDependencies.length,
  directPreviousPhaseModule: "integrationModel.ts" as const,
  modelOnly: true as const,
  modelId: IntegrationModelIdentity.canonicalId,
  modelVersion: IntegrationModelIdentity.version,
  modelNamespace: IntegrationModelIdentity.namespace,
  modelPublicSurfaceOnly: true as const,
  modelInternalImport: false as const,
  registryInternalImport: false as const,
  foundationInternalImport: false as const,
  laterEilPhaseImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "EIL-1:4 → EIL-1:3 IntegrationModelPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "modelIdentity",
  "categories",
  "rules",
  "findings",
  "readiness",
  "collections",
  "inventory",
  "result",
  "summary",
  "status",
] as const);

/**
 * Canonical immutable Integration Validation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationValidationPlatform = Object.freeze({
  identity: IntegrationValidationIdentity,
  dependency,
  modelIdentity: IntegrationModelIdentity,
  categories: IntegrationValidationCategories,
  rules: IntegrationValidationRules,
  findings: IntegrationValidationFindings,
  readiness: IntegrationValidationReadiness,
  collections: IntegrationValidationCollections,
  inventory,
  result: validationResult,
  summary: IntegrationValidationSummary,
  status: IntegrationValidationStatus,
  counts: Object.freeze({
    validationRuleCount: IntegrationValidationCollections.validationRuleCount,
    categoryCount: IntegrationValidationCollections.categoryCount,
    findingStateCount: IntegrationValidationCollections.findingStateCount,
    totalValidationEntryCount:
      IntegrationValidationCollections.totalValidationEntryCount,
  }),
  sources: Object.freeze({
    modelId: IntegrationModelIdentity.canonicalId,
    modelEntryPoint: "integrationModel.ts" as const,
    modelNamespace: IntegrationModelIdentity.namespace,
    modelSummary: IntegrationModelSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-1:5 — Integration Manifest",
  modelPlatform: IntegrationModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  ruleExecution: false as const,
  orchestrationEngine: false as const,
  routingEngine: false as const,
  networkingBehavior: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  queueBehavior: false as const,
  connectorBehavior: false as const,
  adapterBehavior: false as const,
  serviceBehavior: false as const,
  dependencyInjection: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  loggingRuntime: false as const,
  monitoringRuntime: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  visualizationBehavior: false as const,
  stateMutation: false as const,
  importsLaterEilPhases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
