/**
 * EIL-2:5 — Integration Connector Manifest.
 *
 * Canonical immutable architectural publication of EIL-2 through Validation.
 * Consumes only the EIL-2:4 Integration Connector Validation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by EIL-2:5.
 *
 * Public exports (exactly 8):
 *   IntegrationConnectorManifestIdentity
 *   IntegrationConnectorArchitectureManifest
 *   IntegrationConnectorInventoryManifest
 *   IntegrationConnectorDependencyManifest
 *   IntegrationConnectorCompatibilityManifest
 *   IntegrationConnectorManifestCollections
 *   IntegrationConnectorManifestSummary
 *   IntegrationConnectorManifestPlatform
 */

import { IntegrationConnectorArchitectureManifest } from "./integrationConnectorArchitectureManifest.ts";
import { IntegrationConnectorCompatibilityManifest } from "./integrationConnectorCompatibilityManifest.ts";
import { IntegrationConnectorDependencyManifest } from "./integrationConnectorDependencyManifest.ts";
import { IntegrationConnectorInventoryManifest } from "./integrationConnectorInventoryManifest.ts";
import {
  IntegrationConnectorManifestDependencies,
  IntegrationConnectorManifestIdentity,
  IntegrationConnectorManifestReadinessState,
  IntegrationConnectorManifestStatus,
} from "./integrationConnectorManifestIdentity.ts";
import type {
  IntegrationConnectorManifestCollectionsDescriptor,
  IntegrationConnectorManifestInventory,
  IntegrationConnectorManifestReadinessDescriptor,
  IntegrationConnectorManifestSummaryDescriptor,
} from "./integrationConnectorManifestTypes.ts";
import {
  IntegrationConnectorValidationIdentity,
  IntegrationConnectorValidationPlatform,
  IntegrationConnectorValidationSummary,
} from "./integrationConnectorValidation.ts";

export { IntegrationConnectorManifestIdentity } from "./integrationConnectorManifestIdentity.ts";
export { IntegrationConnectorArchitectureManifest } from "./integrationConnectorArchitectureManifest.ts";
export { IntegrationConnectorInventoryManifest } from "./integrationConnectorInventoryManifest.ts";
export { IntegrationConnectorDependencyManifest } from "./integrationConnectorDependencyManifest.ts";
export { IntegrationConnectorCompatibilityManifest } from "./integrationConnectorCompatibilityManifest.ts";

const readiness: IntegrationConnectorManifestReadinessDescriptor =
  Object.freeze({
    readinessId: "EIL-2:5/Readiness",
    status: IntegrationConnectorManifestStatus,
    readiness: IntegrationConnectorManifestReadinessState,
    nextPhase: "EIL-2:6 — Integration Connector Platform",
    claimsRuntimeReady: false as const,
    claimsReadyForCertification: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Canonical collections aggregate.
 * Inventory totals are derived from the inventory manifesto.
 */
export const IntegrationConnectorManifestCollections: IntegrationConnectorManifestCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-2:5/Collections",
    sourcePhase: "EIL-2:5" as const,
    architecture: IntegrationConnectorArchitectureManifest,
    inventory: IntegrationConnectorInventoryManifest,
    dependency: IntegrationConnectorDependencyManifest,
    compatibility: IntegrationConnectorCompatibilityManifest,
    compatibilityDeclarationCount:
      IntegrationConnectorCompatibilityManifest.declarationCount,
    foundationCategoryCount:
      IntegrationConnectorInventoryManifest.foundationCategoryCount,
    registryEntryCount:
      IntegrationConnectorInventoryManifest.registryEntryCount,
    domainModelCount: IntegrationConnectorInventoryManifest.domainModelCount,
    validationRuleCount:
      IntegrationConnectorInventoryManifest.validationRuleCount,
    totalInventoryCount:
      IntegrationConnectorInventoryManifest.totalInventoryCount,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationConnectorManifestInventory = Object.freeze({
  inventoryId: "EIL-2:5/ManifestInventory",
  foundationCategoryCount:
    IntegrationConnectorManifestCollections.foundationCategoryCount,
  registryEntryCount:
    IntegrationConnectorManifestCollections.registryEntryCount,
  domainModelCount: IntegrationConnectorManifestCollections.domainModelCount,
  validationRuleCount:
    IntegrationConnectorManifestCollections.validationRuleCount,
  totalInventoryCount:
    IntegrationConnectorManifestCollections.totalInventoryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Connector Manifest summary.
 */
export const IntegrationConnectorManifestSummary: IntegrationConnectorManifestSummaryDescriptor =
  Object.freeze({
    manifestId: "EIL-2:5/IntegrationConnectorManifest",
    version: "1.0.0",
    name: "Integration Connector Manifest",
    namespace: "nexora.eil.integration-connector.manifest",
    status: IntegrationConnectorManifestStatus,
    readiness: IntegrationConnectorManifestReadinessState,
    validationId: "EIL-2:4/IntegrationConnectorValidation",
    validationStatus: "Validation",
    dependencySummary:
      "Sole upstream dependency: EIL-2:4/IntegrationConnectorValidation via integrationConnectorValidation.ts",
    compatibilitySummary: `Declares ${IntegrationConnectorCompatibilityManifest.declarationCount} compatibility scopes across Foundation through Validation.`,
    foundationCategoryCount:
      IntegrationConnectorInventoryManifest.foundationCategoryCount,
    registryEntryCount:
      IntegrationConnectorInventoryManifest.registryEntryCount,
    domainModelCount: IntegrationConnectorInventoryManifest.domainModelCount,
    validationRuleCount:
      IntegrationConnectorInventoryManifest.validationRuleCount,
    totalInventoryCount:
      IntegrationConnectorInventoryManifest.totalInventoryCount,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-2:6 — Integration Connector Platform",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-2:5/Dependency/EIL24Validation",
  phaseDependencies: IntegrationConnectorManifestDependencies,
  phaseDependencyCount: IntegrationConnectorManifestDependencies.length,
  directPreviousPhaseModule: "integrationConnectorValidation.ts" as const,
  validationOnly: true as const,
  validationId: IntegrationConnectorValidationIdentity.canonicalId,
  validationVersion: IntegrationConnectorValidationIdentity.version,
  validationNamespace: IntegrationConnectorValidationIdentity.namespace,
  validationPublicSurfaceOnly: true as const,
  validationInternalImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  eil1Dependency: false as const,
  laterEil2PhaseImport: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-2:5 → EIL-2:4 IntegrationConnectorValidationPlatform (exclusive)",
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
 * Canonical immutable Integration Connector Manifest platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationConnectorManifestPlatform = Object.freeze({
  identity: IntegrationConnectorManifestIdentity,
  dependency,
  validationIdentity: IntegrationConnectorValidationIdentity,
  architecture: IntegrationConnectorArchitectureManifest,
  inventory: IntegrationConnectorInventoryManifest,
  dependencyManifest: IntegrationConnectorDependencyManifest,
  compatibility: IntegrationConnectorCompatibilityManifest,
  collections: IntegrationConnectorManifestCollections,
  summary: IntegrationConnectorManifestSummary,
  readiness,
  status: IntegrationConnectorManifestStatus,
  sources: Object.freeze({
    validationId: IntegrationConnectorValidationIdentity.canonicalId,
    validationEntryPoint: "integrationConnectorValidation.ts" as const,
    validationNamespace: IntegrationConnectorValidationIdentity.namespace,
    validationSummary: IntegrationConnectorValidationSummary,
    inventoryEnvelope: inventory,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-2:6 — Integration Connector Platform",
  validationPlatform: IntegrationConnectorValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
  connectorRuntime: false as const,
  validationEngine: false as const,
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
