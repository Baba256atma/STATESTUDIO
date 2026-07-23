/**
 * EIL-2:4 — Integration Connector Validation.
 *
 * Canonical immutable validation architecture for the Integration Connector Platform.
 * Consumes only the EIL-2:3 Integration Connector Model aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by EIL-2:4.
 *
 * Public exports (exactly 8):
 *   IntegrationConnectorValidationIdentity
 *   IntegrationConnectorValidationRules
 *   IntegrationConnectorValidationCategories
 *   IntegrationConnectorValidationFindings
 *   IntegrationConnectorValidationReadiness
 *   IntegrationConnectorValidationCollections
 *   IntegrationConnectorValidationSummary
 *   IntegrationConnectorValidationPlatform
 */

import {
  IntegrationConnectorModelIdentity,
  IntegrationConnectorModelPlatform,
  IntegrationConnectorModelSummary,
} from "./integrationConnectorModel.ts";
import { IntegrationConnectorValidationCategories } from "./integrationConnectorValidationCategories.ts";
import { IntegrationConnectorValidationFindings } from "./integrationConnectorValidationFindings.ts";
import {
  IntegrationConnectorValidationDependencies,
  IntegrationConnectorValidationIdentity,
  IntegrationConnectorValidationReadinessState,
  IntegrationConnectorValidationStatus,
} from "./integrationConnectorValidationIdentity.ts";
import { IntegrationConnectorValidationReadiness } from "./integrationConnectorValidationReadiness.ts";
import { IntegrationConnectorValidationRules } from "./integrationConnectorValidationRules.ts";
import type {
  IntegrationConnectorValidationCollectionsDescriptor,
  IntegrationConnectorValidationInventory,
  IntegrationConnectorValidationResult,
  IntegrationConnectorValidationSummaryDescriptor,
} from "./integrationConnectorValidationTypes.ts";

export { IntegrationConnectorValidationIdentity } from "./integrationConnectorValidationIdentity.ts";
export { IntegrationConnectorValidationRules } from "./integrationConnectorValidationRules.ts";
export { IntegrationConnectorValidationCategories } from "./integrationConnectorValidationCategories.ts";
export { IntegrationConnectorValidationFindings } from "./integrationConnectorValidationFindings.ts";
export { IntegrationConnectorValidationReadiness } from "./integrationConnectorValidationReadiness.ts";

const validationResult: IntegrationConnectorValidationResult = Object.freeze({
  resultId: "EIL-2:4/Result/Declared",
  declaredFindingStates: Object.freeze(
    IntegrationConnectorValidationFindings.map((item) => item.state),
  ),
  runtimeExecuted: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from validation arrays.
 */
export const IntegrationConnectorValidationCollections: IntegrationConnectorValidationCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-2:4/Collections",
    sourcePhase: "EIL-2:4" as const,
    rules: IntegrationConnectorValidationRules,
    categories: IntegrationConnectorValidationCategories,
    findings: IntegrationConnectorValidationFindings,
    validationRuleCount: IntegrationConnectorValidationRules.length,
    categoryCount: IntegrationConnectorValidationCategories.length,
    findingStateCount: IntegrationConnectorValidationFindings.length,
    totalValidationEntryCount:
      IntegrationConnectorValidationRules.length +
      IntegrationConnectorValidationCategories.length +
      IntegrationConnectorValidationFindings.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationConnectorValidationInventory = Object.freeze({
  inventoryId: "EIL-2:4/Inventory",
  validationRuleCount:
    IntegrationConnectorValidationCollections.validationRuleCount,
  categoryCount: IntegrationConnectorValidationCollections.categoryCount,
  findingStateCount:
    IntegrationConnectorValidationCollections.findingStateCount,
  totalValidationEntryCount:
    IntegrationConnectorValidationCollections.totalValidationEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Connector Validation summary.
 */
export const IntegrationConnectorValidationSummary: IntegrationConnectorValidationSummaryDescriptor =
  Object.freeze({
    validationId: "EIL-2:4/IntegrationConnectorValidation",
    version: "1.0.0",
    name: "Integration Connector Validation",
    namespace: "nexora.eil.integration-connector.validation",
    status: IntegrationConnectorValidationStatus,
    readiness: IntegrationConnectorValidationReadinessState,
    modelId: "EIL-2:3/IntegrationConnectorModel",
    validationRuleCount:
      IntegrationConnectorValidationCollections.validationRuleCount,
    categoryCount: IntegrationConnectorValidationCollections.categoryCount,
    findingStateCount:
      IntegrationConnectorValidationCollections.findingStateCount,
    totalValidationEntryCount:
      IntegrationConnectorValidationCollections.totalValidationEntryCount,
    nextPhase: "EIL-2:5 — Integration Connector Manifest",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-2:4/Dependency/EIL23Model",
  phaseDependencies: IntegrationConnectorValidationDependencies,
  phaseDependencyCount: IntegrationConnectorValidationDependencies.length,
  directPreviousPhaseModule: "integrationConnectorModel.ts" as const,
  modelOnly: true as const,
  modelId: IntegrationConnectorModelIdentity.canonicalId,
  modelVersion: IntegrationConnectorModelIdentity.version,
  modelNamespace: IntegrationConnectorModelIdentity.namespace,
  modelPublicSurfaceOnly: true as const,
  modelInternalImport: false as const,
  registryInternalImport: false as const,
  foundationInternalImport: false as const,
  eil1Dependency: false as const,
  laterEil2PhaseImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "EIL-2:4 → EIL-2:3 IntegrationConnectorModelPlatform (exclusive)",
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
 * Canonical immutable Integration Connector Validation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationConnectorValidationPlatform = Object.freeze({
  identity: IntegrationConnectorValidationIdentity,
  dependency,
  modelIdentity: IntegrationConnectorModelIdentity,
  categories: IntegrationConnectorValidationCategories,
  rules: IntegrationConnectorValidationRules,
  findings: IntegrationConnectorValidationFindings,
  readiness: IntegrationConnectorValidationReadiness,
  collections: IntegrationConnectorValidationCollections,
  inventory,
  result: validationResult,
  summary: IntegrationConnectorValidationSummary,
  status: IntegrationConnectorValidationStatus,
  sources: Object.freeze({
    modelId: IntegrationConnectorModelIdentity.canonicalId,
    modelEntryPoint: "integrationConnectorModel.ts" as const,
    modelNamespace: IntegrationConnectorModelIdentity.namespace,
    modelSummary: IntegrationConnectorModelSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-2:5 — Integration Connector Manifest",
  modelPlatform: IntegrationConnectorModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  ruleExecution: false as const,
  connectorRuntime: false as const,
  endpointExecution: false as const,
  protocolExecution: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  httpClientBehavior: false as const,
  messageBrokerBehavior: false as const,
  eventBus: false as const,
  authenticationLogic: false as const,
  authorizationLogic: false as const,
  encryptionBehavior: false as const,
  adapterBehavior: false as const,
  dependencyInjection: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  networkingBehavior: false as const,
  loggingRuntime: false as const,
  monitoringRuntime: false as const,
  telemetryRuntime: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  eil1Dependency: false as const,
  importsLaterEil2Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
