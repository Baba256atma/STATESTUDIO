/**
 * EIL-5:4 — Integration Policy & Governance Validation.
 *
 * Canonical immutable validation architecture for the Integration Policy & Governance Platform.
 * Consumes only the EIL-5:3 Integration Policy & Governance Model aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by EIL-5:4.
 *
 * Public exports (exactly 8):
 *   IntegrationPolicyGovernanceValidationIdentity
 *   IntegrationPolicyGovernanceValidationRules
 *   IntegrationPolicyGovernanceValidationCategories
 *   IntegrationPolicyGovernanceValidationFindings
 *   IntegrationPolicyGovernanceValidationReadiness
 *   IntegrationPolicyGovernanceValidationCollections
 *   IntegrationPolicyGovernanceValidationSummary
 *   IntegrationPolicyGovernanceValidationPlatform
 */

import {
  IntegrationPolicyGovernanceModelIdentity,
  IntegrationPolicyGovernanceModelPlatform,
  IntegrationPolicyGovernanceModelSummary,
} from "./integrationPolicyGovernanceModel.ts";
import { IntegrationPolicyGovernanceValidationCategories } from "./integrationPolicyGovernanceValidationCategories.ts";
import { IntegrationPolicyGovernanceValidationFindings } from "./integrationPolicyGovernanceValidationFindings.ts";
import {
  IntegrationPolicyGovernanceValidationDependencies,
  IntegrationPolicyGovernanceValidationIdentity,
  IntegrationPolicyGovernanceValidationReadinessStateValue,
  IntegrationPolicyGovernanceValidationStatusValue,
} from "./integrationPolicyGovernanceValidationIdentity.ts";
import { IntegrationPolicyGovernanceValidationReadiness } from "./integrationPolicyGovernanceValidationReadiness.ts";
import { IntegrationPolicyGovernanceValidationRules } from "./integrationPolicyGovernanceValidationRules.ts";
import type {
  IntegrationPolicyGovernanceValidationCollections as PolicyGovernanceValidationCollectionsDescriptor,
  IntegrationPolicyGovernanceValidationInventory,
  IntegrationPolicyGovernanceValidationSummary as PolicyGovernanceValidationSummaryDescriptor,
} from "./integrationPolicyGovernanceValidationTypes.ts";

export { IntegrationPolicyGovernanceValidationIdentity } from "./integrationPolicyGovernanceValidationIdentity.ts";
export { IntegrationPolicyGovernanceValidationRules } from "./integrationPolicyGovernanceValidationRules.ts";
export { IntegrationPolicyGovernanceValidationCategories } from "./integrationPolicyGovernanceValidationCategories.ts";
export { IntegrationPolicyGovernanceValidationFindings } from "./integrationPolicyGovernanceValidationFindings.ts";
export { IntegrationPolicyGovernanceValidationReadiness } from "./integrationPolicyGovernanceValidationReadiness.ts";

const validationResult = Object.freeze({
  resultId: "EIL-5:4/Result/Declared" as const,
  declaredFindingStates: Object.freeze(
    IntegrationPolicyGovernanceValidationFindings.map((item) => item.state),
  ),
  runtimeExecuted: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from validation arrays.
 */
export const IntegrationPolicyGovernanceValidationCollections: PolicyGovernanceValidationCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-5:4/Collections",
    sourcePhase: "EIL-5:4" as const,
    rules: IntegrationPolicyGovernanceValidationRules,
    categories: IntegrationPolicyGovernanceValidationCategories,
    findings: IntegrationPolicyGovernanceValidationFindings,
    ruleCount: IntegrationPolicyGovernanceValidationRules.length,
    categoryCount: IntegrationPolicyGovernanceValidationCategories.length,
    findingCount: IntegrationPolicyGovernanceValidationFindings.length,
    totalValidationEntryCount:
      IntegrationPolicyGovernanceValidationRules.length +
      IntegrationPolicyGovernanceValidationCategories.length +
      IntegrationPolicyGovernanceValidationFindings.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationPolicyGovernanceValidationInventory = Object.freeze({
  inventoryId: "EIL-5:4/Inventory",
  ruleCount: IntegrationPolicyGovernanceValidationCollections.ruleCount,
  categoryCount: IntegrationPolicyGovernanceValidationCollections.categoryCount,
  findingCount: IntegrationPolicyGovernanceValidationCollections.findingCount,
  totalValidationEntryCount:
    IntegrationPolicyGovernanceValidationCollections.totalValidationEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Policy & Governance Validation summary.
 */
export const IntegrationPolicyGovernanceValidationSummary: PolicyGovernanceValidationSummaryDescriptor =
  Object.freeze({
    validationId: "EIL-5:4/IntegrationPolicyGovernanceValidation",
    version: "1.0.0",
    name: "Integration Policy & Governance Validation",
    namespace: "nexora.eil.integration-policy-governance.validation",
    status: IntegrationPolicyGovernanceValidationStatusValue,
    readiness: IntegrationPolicyGovernanceValidationReadinessStateValue,
    modelId: "EIL-5:3/IntegrationPolicyGovernanceModel",
    ruleCount: IntegrationPolicyGovernanceValidationCollections.ruleCount,
    categoryCount:
      IntegrationPolicyGovernanceValidationCollections.categoryCount,
    findingCount: IntegrationPolicyGovernanceValidationCollections.findingCount,
    totalValidationEntryCount:
      IntegrationPolicyGovernanceValidationCollections.totalValidationEntryCount,
    nextPhase: "EIL-5:5 — Integration Policy & Governance Manifest",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-5:4/Dependency/EIL53Model",
  phaseDependencies: IntegrationPolicyGovernanceValidationDependencies,
  phaseDependencyCount:
    IntegrationPolicyGovernanceValidationDependencies.length,
  directPreviousPhaseModule: "integrationPolicyGovernanceModel.ts" as const,
  modelOnly: true as const,
  modelId: IntegrationPolicyGovernanceModelIdentity.canonicalId,
  modelVersion: IntegrationPolicyGovernanceModelIdentity.version,
  modelNamespace: IntegrationPolicyGovernanceModelIdentity.namespace,
  modelPublicSurfaceOnly: true as const,
  modelInternalImport: false as const,
  registryInternalImport: false as const,
  foundationInternalImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil5PhaseImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "EIL-5:4 → EIL-5:3 IntegrationPolicyGovernanceModelPlatform (exclusive)",
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
 * Canonical immutable Integration Policy & Governance Validation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationPolicyGovernanceValidationPlatform = Object.freeze({
  identity: IntegrationPolicyGovernanceValidationIdentity,
  dependency,
  modelIdentity: IntegrationPolicyGovernanceModelIdentity,
  categories: IntegrationPolicyGovernanceValidationCategories,
  rules: IntegrationPolicyGovernanceValidationRules,
  findings: IntegrationPolicyGovernanceValidationFindings,
  readiness: IntegrationPolicyGovernanceValidationReadiness,
  collections: IntegrationPolicyGovernanceValidationCollections,
  inventory,
  result: validationResult,
  summary: IntegrationPolicyGovernanceValidationSummary,
  status: IntegrationPolicyGovernanceValidationStatusValue,
  sources: Object.freeze({
    modelId: IntegrationPolicyGovernanceModelIdentity.canonicalId,
    modelEntryPoint: "integrationPolicyGovernanceModel.ts" as const,
    modelNamespace: IntegrationPolicyGovernanceModelIdentity.namespace,
    modelSummary: IntegrationPolicyGovernanceModelSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-5:5 — Integration Policy & Governance Manifest",
  modelPlatform: IntegrationPolicyGovernanceModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  ruleExecution: false as const,
  governanceEngine: false as const,
  policyEnforcement: false as const,
  authorizationEngine: false as const,
  complianceEngine: false as const,
  orchestrationRuntime: false as const,
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
  importsLaterEil5Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
