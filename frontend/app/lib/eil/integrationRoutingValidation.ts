/**
 * EIL-3:4 — Integration Routing Validation.
 *
 * Canonical immutable validation architecture for the Integration Routing Platform.
 * Consumes only the EIL-3:3 Integration Routing Model aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by EIL-3:4.
 *
 * Public exports (exactly 8):
 *   IntegrationRoutingValidationIdentity
 *   IntegrationRoutingValidationRules
 *   IntegrationRoutingValidationCategories
 *   IntegrationRoutingValidationFindings
 *   IntegrationRoutingValidationReadiness
 *   IntegrationRoutingValidationCollections
 *   IntegrationRoutingValidationSummary
 *   IntegrationRoutingValidationPlatform
 */

import {
  IntegrationRoutingModelIdentity,
  IntegrationRoutingModelPlatform,
  IntegrationRoutingModelSummary,
} from "./integrationRoutingModel.ts";
import { IntegrationRoutingValidationCategories } from "./integrationRoutingValidationCategories.ts";
import { IntegrationRoutingValidationFindings } from "./integrationRoutingValidationFindings.ts";
import {
  IntegrationRoutingValidationDependencies,
  IntegrationRoutingValidationIdentity,
  IntegrationRoutingValidationReadinessStateValue,
  IntegrationRoutingValidationStatusValue,
} from "./integrationRoutingValidationIdentity.ts";
import { IntegrationRoutingValidationReadiness } from "./integrationRoutingValidationReadiness.ts";
import { IntegrationRoutingValidationRules } from "./integrationRoutingValidationRules.ts";
import type {
  RoutingValidationCollections,
  RoutingValidationInventory,
  RoutingValidationSummary,
} from "./integrationRoutingValidationTypes.ts";

export { IntegrationRoutingValidationIdentity } from "./integrationRoutingValidationIdentity.ts";
export { IntegrationRoutingValidationRules } from "./integrationRoutingValidationRules.ts";
export { IntegrationRoutingValidationCategories } from "./integrationRoutingValidationCategories.ts";
export { IntegrationRoutingValidationFindings } from "./integrationRoutingValidationFindings.ts";
export { IntegrationRoutingValidationReadiness } from "./integrationRoutingValidationReadiness.ts";

const validationResult = Object.freeze({
  resultId: "EIL-3:4/Result/Declared" as const,
  declaredFindingStates: Object.freeze(
    IntegrationRoutingValidationFindings.map((item) => item.state),
  ),
  runtimeExecuted: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from validation arrays.
 */
export const IntegrationRoutingValidationCollections: RoutingValidationCollections =
  Object.freeze({
    collectionsId: "EIL-3:4/Collections",
    sourcePhase: "EIL-3:4" as const,
    rules: IntegrationRoutingValidationRules,
    categories: IntegrationRoutingValidationCategories,
    findings: IntegrationRoutingValidationFindings,
    ruleCount: IntegrationRoutingValidationRules.length,
    categoryCount: IntegrationRoutingValidationCategories.length,
    findingCount: IntegrationRoutingValidationFindings.length,
    totalValidationEntryCount:
      IntegrationRoutingValidationRules.length +
      IntegrationRoutingValidationCategories.length +
      IntegrationRoutingValidationFindings.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: RoutingValidationInventory = Object.freeze({
  inventoryId: "EIL-3:4/Inventory",
  ruleCount: IntegrationRoutingValidationCollections.ruleCount,
  categoryCount: IntegrationRoutingValidationCollections.categoryCount,
  findingCount: IntegrationRoutingValidationCollections.findingCount,
  totalValidationEntryCount:
    IntegrationRoutingValidationCollections.totalValidationEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Routing Validation summary.
 */
export const IntegrationRoutingValidationSummary: RoutingValidationSummary =
  Object.freeze({
    validationId: "EIL-3:4/IntegrationRoutingValidation",
    version: "1.0.0",
    name: "Integration Routing Validation",
    namespace: "nexora.eil.integration-routing.validation",
    status: IntegrationRoutingValidationStatusValue,
    readiness: IntegrationRoutingValidationReadinessStateValue,
    modelId: "EIL-3:3/IntegrationRoutingModel",
    ruleCount: IntegrationRoutingValidationCollections.ruleCount,
    categoryCount: IntegrationRoutingValidationCollections.categoryCount,
    findingCount: IntegrationRoutingValidationCollections.findingCount,
    totalValidationEntryCount:
      IntegrationRoutingValidationCollections.totalValidationEntryCount,
    nextPhase: "EIL-3:5 — Integration Routing Manifest",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-3:4/Dependency/EIL33Model",
  phaseDependencies: IntegrationRoutingValidationDependencies,
  phaseDependencyCount: IntegrationRoutingValidationDependencies.length,
  directPreviousPhaseModule: "integrationRoutingModel.ts" as const,
  modelOnly: true as const,
  modelId: IntegrationRoutingModelIdentity.canonicalId,
  modelVersion: IntegrationRoutingModelIdentity.version,
  modelNamespace: IntegrationRoutingModelIdentity.namespace,
  modelPublicSurfaceOnly: true as const,
  modelInternalImport: false as const,
  registryInternalImport: false as const,
  foundationInternalImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil3PhaseImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "EIL-3:4 → EIL-3:3 IntegrationRoutingModelPlatform (exclusive)",
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
 * Canonical immutable Integration Routing Validation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationRoutingValidationPlatform = Object.freeze({
  identity: IntegrationRoutingValidationIdentity,
  dependency,
  modelIdentity: IntegrationRoutingModelIdentity,
  categories: IntegrationRoutingValidationCategories,
  rules: IntegrationRoutingValidationRules,
  findings: IntegrationRoutingValidationFindings,
  readiness: IntegrationRoutingValidationReadiness,
  collections: IntegrationRoutingValidationCollections,
  inventory,
  result: validationResult,
  summary: IntegrationRoutingValidationSummary,
  status: IntegrationRoutingValidationStatusValue,
  sources: Object.freeze({
    modelId: IntegrationRoutingModelIdentity.canonicalId,
    modelEntryPoint: "integrationRoutingModel.ts" as const,
    modelNamespace: IntegrationRoutingModelIdentity.namespace,
    modelSummary: IntegrationRoutingModelSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-3:5 — Integration Routing Manifest",
  modelPlatform: IntegrationRoutingModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  ruleExecution: false as const,
  routingEngine: false as const,
  messageExecution: false as const,
  orchestrationBehavior: false as const,
  schedulingBehavior: false as const,
  networkingBehavior: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  queueBehavior: false as const,
  connectorExecution: false as const,
  adapterBehavior: false as const,
  sdkRuntime: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  serviceBehavior: false as const,
  dependencyInjection: false as const,
  loggingBehavior: false as const,
  monitoringBehavior: false as const,
  telemetryBehavior: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  businessLogicBehavior: false as const,
  stateMutation: false as const,
  previousEilPlatformDependency: false as const,
  importsLaterEil3Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
