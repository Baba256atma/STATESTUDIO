/**
 * EIL-1:5 — Integration Manifest.
 *
 * Canonical immutable architectural publication of EIL-1 through Validation.
 * Consumes only the EIL-1:4 Integration Validation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by EIL-1:5.
 *
 * Public exports (exactly 8):
 *   IntegrationManifestIdentity
 *   IntegrationArchitectureManifest
 *   IntegrationInventoryManifest
 *   IntegrationDependencyManifest
 *   IntegrationCompatibilityManifest
 *   IntegrationManifestCollections
 *   IntegrationManifestSummary
 *   IntegrationManifestPlatform
 */

import { IntegrationArchitectureManifest } from "./integrationArchitectureManifest.ts";
import { IntegrationCompatibilityManifest } from "./integrationCompatibilityManifest.ts";
import { IntegrationDependencyManifest } from "./integrationDependencyManifest.ts";
import { IntegrationInventoryManifest } from "./integrationInventoryManifest.ts";
import {
  IntegrationManifestDependencies,
  IntegrationManifestIdentity,
  IntegrationManifestReadinessState,
  IntegrationManifestStatus,
} from "./integrationManifestIdentity.ts";
import type {
  IntegrationManifestInventory,
  IntegrationManifestReadinessDescriptor,
  IntegrationManifestSummaryDescriptor,
} from "./integrationManifestTypes.ts";
import {
  IntegrationValidationIdentity,
  IntegrationValidationPlatform,
  IntegrationValidationSummary,
} from "./integrationValidation.ts";

export { IntegrationManifestIdentity } from "./integrationManifestIdentity.ts";
export { IntegrationArchitectureManifest } from "./integrationArchitectureManifest.ts";
export { IntegrationInventoryManifest } from "./integrationInventoryManifest.ts";
export { IntegrationDependencyManifest } from "./integrationDependencyManifest.ts";
export { IntegrationCompatibilityManifest } from "./integrationCompatibilityManifest.ts";

const readiness: IntegrationManifestReadinessDescriptor = Object.freeze({
  readinessId: "EIL-1:5/Readiness",
  status: IntegrationManifestStatus,
  readiness: IntegrationManifestReadinessState,
  nextPhase: "EIL-1:6 — Integration Platform",
  claimsRuntimeReady: false as const,
  claimsReadyForCertification: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Inventory totals are derived from the inventory manifesto.
 */
export const IntegrationManifestCollections = Object.freeze({
  collectionsId: "EIL-1:5/Collections",
  sourcePhase: "EIL-1:5" as const,
  architecture: IntegrationArchitectureManifest,
  inventory: IntegrationInventoryManifest,
  dependency: IntegrationDependencyManifest,
  compatibility: IntegrationCompatibilityManifest,
  compatibilityDeclarationCount:
    IntegrationCompatibilityManifest.declarationCount,
  foundationContractCount:
    IntegrationInventoryManifest.foundationContractCount,
  registryEntryCount: IntegrationInventoryManifest.registryEntryCount,
  domainModelCount: IntegrationInventoryManifest.domainModelCount,
  validationRuleCount: IntegrationInventoryManifest.validationRuleCount,
  totalInventoryCount: IntegrationInventoryManifest.totalInventoryCount,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const inventory: IntegrationManifestInventory = Object.freeze({
  inventoryId: "EIL-1:5/ManifestInventory",
  foundationContractCount:
    IntegrationManifestCollections.foundationContractCount,
  registryEntryCount: IntegrationManifestCollections.registryEntryCount,
  domainModelCount: IntegrationManifestCollections.domainModelCount,
  validationRuleCount: IntegrationManifestCollections.validationRuleCount,
  totalInventoryCount: IntegrationManifestCollections.totalInventoryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Manifest summary.
 */
export const IntegrationManifestSummary: IntegrationManifestSummaryDescriptor =
  Object.freeze({
    manifestId: "EIL-1:5/IntegrationManifest",
    version: "1.0.0",
    name: "Integration Manifest",
    namespace: "nexora.eil.integration.manifest",
    status: IntegrationManifestStatus,
    readiness: IntegrationManifestReadinessState,
    validationId: "EIL-1:4/IntegrationValidation",
    validationStatus: "Validation",
    dependencySummary:
      "Sole upstream dependency: EIL-1:4/IntegrationValidation via integrationValidation.ts",
    compatibilitySummary:
      `Declares ${IntegrationCompatibilityManifest.declarationCount} compatibility scopes across Foundation through Validation.`,
    foundationContractCount:
      IntegrationInventoryManifest.foundationContractCount,
    registryEntryCount: IntegrationInventoryManifest.registryEntryCount,
    domainModelCount: IntegrationInventoryManifest.domainModelCount,
    validationRuleCount: IntegrationInventoryManifest.validationRuleCount,
    totalInventoryCount: IntegrationInventoryManifest.totalInventoryCount,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-1:6 — Integration Platform",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-1:5/Dependency/EIL14Validation",
  phaseDependencies: IntegrationManifestDependencies,
  phaseDependencyCount: IntegrationManifestDependencies.length,
  directPreviousPhaseModule: "integrationValidation.ts" as const,
  validationOnly: true as const,
  validationId: IntegrationValidationIdentity.canonicalId,
  validationVersion: IntegrationValidationIdentity.version,
  validationNamespace: IntegrationValidationIdentity.namespace,
  validationPublicSurfaceOnly: true as const,
  validationInternalImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEilPhaseImport: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-1:5 → EIL-1:4 IntegrationValidationPlatform (exclusive)",
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
 * Canonical immutable Integration Manifest platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationManifestPlatform = Object.freeze({
  identity: IntegrationManifestIdentity,
  dependency,
  validationIdentity: IntegrationValidationIdentity,
  architecture: IntegrationArchitectureManifest,
  inventory: IntegrationInventoryManifest,
  dependencyManifest: IntegrationDependencyManifest,
  compatibility: IntegrationCompatibilityManifest,
  collections: IntegrationManifestCollections,
  summary: IntegrationManifestSummary,
  readiness,
  status: IntegrationManifestStatus,
  sources: Object.freeze({
    validationId: IntegrationValidationIdentity.canonicalId,
    validationEntryPoint: "integrationValidation.ts" as const,
    validationNamespace: IntegrationValidationIdentity.namespace,
    validationSummary: IntegrationValidationSummary,
    inventoryEnvelope: inventory,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-1:6 — Integration Platform",
  validationPlatform: IntegrationValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
  orchestrationEngine: false as const,
  routingEngine: false as const,
  validationEngine: false as const,
  serviceDiscovery: false as const,
  apiBehavior: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  queueBehavior: false as const,
  connectorBehavior: false as const,
  adapterBehavior: false as const,
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
