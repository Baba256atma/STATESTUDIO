/**
 * EIL-4:5 — Integration Orchestration Manifest.
 *
 * Canonical immutable architectural publication of EIL-4 through Validation.
 * Consumes only the EIL-4:4 Integration Orchestration Validation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by EIL-4:5.
 *
 * Public exports (exactly 8):
 *   IntegrationOrchestrationManifestIdentity
 *   IntegrationOrchestrationArchitectureManifest
 *   IntegrationOrchestrationInventoryManifest
 *   IntegrationOrchestrationDependencyManifest
 *   IntegrationOrchestrationCompatibilityManifest
 *   IntegrationOrchestrationManifestCollections
 *   IntegrationOrchestrationManifestSummary
 *   IntegrationOrchestrationManifestPlatform
 */

import { IntegrationOrchestrationArchitectureManifest } from "./integrationOrchestrationArchitectureManifest.ts";
import { IntegrationOrchestrationCompatibilityManifest } from "./integrationOrchestrationCompatibilityManifest.ts";
import { IntegrationOrchestrationDependencyManifest } from "./integrationOrchestrationDependencyManifest.ts";
import { IntegrationOrchestrationInventoryManifest } from "./integrationOrchestrationInventoryManifest.ts";
import {
  IntegrationOrchestrationManifestDependencies,
  IntegrationOrchestrationManifestIdentity,
  IntegrationOrchestrationManifestReadinessStateValue,
  IntegrationOrchestrationManifestStatusValue,
} from "./integrationOrchestrationManifestIdentity.ts";
import type {
  IntegrationOrchestrationManifestCollections as OrchestrationManifestCollectionsDescriptor,
  IntegrationOrchestrationManifestInventory,
  IntegrationOrchestrationManifestSummary as OrchestrationManifestSummaryDescriptor,
} from "./integrationOrchestrationManifestTypes.ts";
import {
  IntegrationOrchestrationValidationIdentity,
  IntegrationOrchestrationValidationPlatform,
  IntegrationOrchestrationValidationSummary,
} from "./integrationOrchestrationValidation.ts";

export { IntegrationOrchestrationManifestIdentity } from "./integrationOrchestrationManifestIdentity.ts";
export { IntegrationOrchestrationArchitectureManifest } from "./integrationOrchestrationArchitectureManifest.ts";
export { IntegrationOrchestrationInventoryManifest } from "./integrationOrchestrationInventoryManifest.ts";
export { IntegrationOrchestrationDependencyManifest } from "./integrationOrchestrationDependencyManifest.ts";
export { IntegrationOrchestrationCompatibilityManifest } from "./integrationOrchestrationCompatibilityManifest.ts";

const readiness = Object.freeze({
  readinessId: "EIL-4:5/Readiness" as const,
  status: IntegrationOrchestrationManifestStatusValue,
  readiness: IntegrationOrchestrationManifestReadinessStateValue,
  nextPhase: "EIL-4:6 — Integration Orchestration Platform" as const,
  claimsRuntimeReady: false as const,
  claimsReadyForCertification: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Inventory totals are derived from the inventory manifesto.
 */
export const IntegrationOrchestrationManifestCollections: OrchestrationManifestCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-4:5/Collections",
    sourcePhase: "EIL-4:5" as const,
    architecture: IntegrationOrchestrationArchitectureManifest,
    inventory: IntegrationOrchestrationInventoryManifest,
    dependency: IntegrationOrchestrationDependencyManifest,
    compatibility: IntegrationOrchestrationCompatibilityManifest,
    compatibilityDeclarationCount:
      IntegrationOrchestrationCompatibilityManifest.declarationCount,
    foundationCategoryCount:
      IntegrationOrchestrationInventoryManifest.foundationCategoryCount,
    registryEntryCount:
      IntegrationOrchestrationInventoryManifest.registryEntryCount,
    domainModelCount:
      IntegrationOrchestrationInventoryManifest.domainModelCount,
    validationRuleCount:
      IntegrationOrchestrationInventoryManifest.validationRuleCount,
    totalInventoryCount:
      IntegrationOrchestrationInventoryManifest.totalInventoryCount,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationOrchestrationManifestInventory = Object.freeze({
  inventoryId: "EIL-4:5/ManifestInventory",
  foundationCategoryCount:
    IntegrationOrchestrationManifestCollections.foundationCategoryCount,
  registryEntryCount:
    IntegrationOrchestrationManifestCollections.registryEntryCount,
  domainModelCount: IntegrationOrchestrationManifestCollections.domainModelCount,
  validationRuleCount:
    IntegrationOrchestrationManifestCollections.validationRuleCount,
  totalInventoryCount:
    IntegrationOrchestrationManifestCollections.totalInventoryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Orchestration Manifest summary.
 */
export const IntegrationOrchestrationManifestSummary: OrchestrationManifestSummaryDescriptor =
  Object.freeze({
    manifestId: "EIL-4:5/IntegrationOrchestrationManifest",
    version: "1.0.0",
    name: "Integration Orchestration Manifest",
    namespace: "nexora.eil.integration-orchestration.manifest",
    status: IntegrationOrchestrationManifestStatusValue,
    readiness: IntegrationOrchestrationManifestReadinessStateValue,
    validationId: "EIL-4:4/IntegrationOrchestrationValidation",
    validationStatus: "Validation",
    dependencySummary:
      "Sole upstream dependency: EIL-4:4/IntegrationOrchestrationValidation via integrationOrchestrationValidation.ts",
    compatibilitySummary: `Declares ${IntegrationOrchestrationCompatibilityManifest.declarationCount} compatibility scopes across Foundation through Validation.`,
    foundationCategoryCount:
      IntegrationOrchestrationInventoryManifest.foundationCategoryCount,
    registryEntryCount:
      IntegrationOrchestrationInventoryManifest.registryEntryCount,
    domainModelCount:
      IntegrationOrchestrationInventoryManifest.domainModelCount,
    validationRuleCount:
      IntegrationOrchestrationInventoryManifest.validationRuleCount,
    totalInventoryCount:
      IntegrationOrchestrationInventoryManifest.totalInventoryCount,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-4:6 — Integration Orchestration Platform",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-4:5/Dependency/EIL44Validation",
  phaseDependencies: IntegrationOrchestrationManifestDependencies,
  phaseDependencyCount: IntegrationOrchestrationManifestDependencies.length,
  directPreviousPhaseModule: "integrationOrchestrationValidation.ts" as const,
  validationOnly: true as const,
  validationId: IntegrationOrchestrationValidationIdentity.canonicalId,
  validationVersion: IntegrationOrchestrationValidationIdentity.version,
  validationNamespace: IntegrationOrchestrationValidationIdentity.namespace,
  validationPublicSurfaceOnly: true as const,
  validationInternalImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil4PhaseImport: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-4:5 → EIL-4:4 IntegrationOrchestrationValidationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "validationIdentity",
  "architecture",
  "inventory",
  "dependencyManifest",
  "compatibility",
  "collections",
  "summary",
  "readiness",
  "status",
  "sources",
] as const);

/**
 * Canonical immutable Integration Orchestration Manifest platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationOrchestrationManifestPlatform = Object.freeze({
  identity: IntegrationOrchestrationManifestIdentity,
  dependency,
  validationIdentity: IntegrationOrchestrationValidationIdentity,
  architecture: IntegrationOrchestrationArchitectureManifest,
  inventory: IntegrationOrchestrationInventoryManifest,
  dependencyManifest: IntegrationOrchestrationDependencyManifest,
  compatibility: IntegrationOrchestrationCompatibilityManifest,
  collections: IntegrationOrchestrationManifestCollections,
  summary: IntegrationOrchestrationManifestSummary,
  readiness,
  status: IntegrationOrchestrationManifestStatusValue,
  sources: Object.freeze({
    validationId: IntegrationOrchestrationValidationIdentity.canonicalId,
    validationEntryPoint: "integrationOrchestrationValidation.ts" as const,
    validationNamespace: IntegrationOrchestrationValidationIdentity.namespace,
    validationSummary: IntegrationOrchestrationValidationSummary,
    inventoryEnvelope: inventory,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-4:6 — Integration Orchestration Platform",
  validationPlatform: IntegrationOrchestrationValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
  orchestrationEngine: false as const,
  workflowExecution: false as const,
  routingExecution: false as const,
  schedulingBehavior: false as const,
  triggerProcessing: false as const,
  validationEngine: false as const,
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
  importsLaterEil4Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
