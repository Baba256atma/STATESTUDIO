/**
 * EIL-3:5 — Integration Routing Manifest.
 *
 * Canonical immutable architectural publication of EIL-3 through Validation.
 * Consumes only the EIL-3:4 Integration Routing Validation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by EIL-3:5.
 *
 * Public exports (exactly 8):
 *   IntegrationRoutingManifestIdentity
 *   IntegrationRoutingArchitectureManifest
 *   IntegrationRoutingInventoryManifest
 *   IntegrationRoutingDependencyManifest
 *   IntegrationRoutingCompatibilityManifest
 *   IntegrationRoutingManifestCollections
 *   IntegrationRoutingManifestSummary
 *   IntegrationRoutingManifestPlatform
 */

import { IntegrationRoutingArchitectureManifest } from "./integrationRoutingArchitectureManifest.ts";
import { IntegrationRoutingCompatibilityManifest } from "./integrationRoutingCompatibilityManifest.ts";
import { IntegrationRoutingDependencyManifest } from "./integrationRoutingDependencyManifest.ts";
import { IntegrationRoutingInventoryManifest } from "./integrationRoutingInventoryManifest.ts";
import {
  IntegrationRoutingManifestDependencies,
  IntegrationRoutingManifestIdentity,
  IntegrationRoutingManifestReadinessStateValue,
  IntegrationRoutingManifestStatusValue,
} from "./integrationRoutingManifestIdentity.ts";
import type {
  RoutingManifestCollections,
  RoutingManifestInventory,
  RoutingManifestSummary,
} from "./integrationRoutingManifestTypes.ts";
import {
  IntegrationRoutingValidationIdentity,
  IntegrationRoutingValidationPlatform,
  IntegrationRoutingValidationSummary,
} from "./integrationRoutingValidation.ts";

export { IntegrationRoutingManifestIdentity } from "./integrationRoutingManifestIdentity.ts";
export { IntegrationRoutingArchitectureManifest } from "./integrationRoutingArchitectureManifest.ts";
export { IntegrationRoutingInventoryManifest } from "./integrationRoutingInventoryManifest.ts";
export { IntegrationRoutingDependencyManifest } from "./integrationRoutingDependencyManifest.ts";
export { IntegrationRoutingCompatibilityManifest } from "./integrationRoutingCompatibilityManifest.ts";

const readiness = Object.freeze({
  readinessId: "EIL-3:5/Readiness" as const,
  status: IntegrationRoutingManifestStatusValue,
  readiness: IntegrationRoutingManifestReadinessStateValue,
  nextPhase: "EIL-3:6 — Integration Routing Platform" as const,
  claimsRuntimeReady: false as const,
  claimsReadyForCertification: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Inventory totals are derived from the inventory manifesto.
 */
export const IntegrationRoutingManifestCollections: RoutingManifestCollections =
  Object.freeze({
    collectionsId: "EIL-3:5/Collections",
    sourcePhase: "EIL-3:5" as const,
    architecture: IntegrationRoutingArchitectureManifest,
    inventory: IntegrationRoutingInventoryManifest,
    dependency: IntegrationRoutingDependencyManifest,
    compatibility: IntegrationRoutingCompatibilityManifest,
    compatibilityDeclarationCount:
      IntegrationRoutingCompatibilityManifest.declarationCount,
    foundationCategoryCount:
      IntegrationRoutingInventoryManifest.foundationCategoryCount,
    registryEntryCount: IntegrationRoutingInventoryManifest.registryEntryCount,
    domainModelCount: IntegrationRoutingInventoryManifest.domainModelCount,
    validationRuleCount:
      IntegrationRoutingInventoryManifest.validationRuleCount,
    totalInventoryCount:
      IntegrationRoutingInventoryManifest.totalInventoryCount,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: RoutingManifestInventory = Object.freeze({
  inventoryId: "EIL-3:5/ManifestInventory",
  foundationCategoryCount:
    IntegrationRoutingManifestCollections.foundationCategoryCount,
  registryEntryCount: IntegrationRoutingManifestCollections.registryEntryCount,
  domainModelCount: IntegrationRoutingManifestCollections.domainModelCount,
  validationRuleCount:
    IntegrationRoutingManifestCollections.validationRuleCount,
  totalInventoryCount:
    IntegrationRoutingManifestCollections.totalInventoryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Routing Manifest summary.
 */
export const IntegrationRoutingManifestSummary: RoutingManifestSummary =
  Object.freeze({
    manifestId: "EIL-3:5/IntegrationRoutingManifest",
    version: "1.0.0",
    name: "Integration Routing Manifest",
    namespace: "nexora.eil.integration-routing.manifest",
    status: IntegrationRoutingManifestStatusValue,
    readiness: IntegrationRoutingManifestReadinessStateValue,
    validationId: "EIL-3:4/IntegrationRoutingValidation",
    validationStatus: "Validation",
    dependencySummary:
      "Sole upstream dependency: EIL-3:4/IntegrationRoutingValidation via integrationRoutingValidation.ts",
    compatibilitySummary: `Declares ${IntegrationRoutingCompatibilityManifest.declarationCount} compatibility scopes across Foundation through Validation.`,
    foundationCategoryCount:
      IntegrationRoutingInventoryManifest.foundationCategoryCount,
    registryEntryCount: IntegrationRoutingInventoryManifest.registryEntryCount,
    domainModelCount: IntegrationRoutingInventoryManifest.domainModelCount,
    validationRuleCount:
      IntegrationRoutingInventoryManifest.validationRuleCount,
    totalInventoryCount:
      IntegrationRoutingInventoryManifest.totalInventoryCount,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-3:6 — Integration Routing Platform",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-3:5/Dependency/EIL34Validation",
  phaseDependencies: IntegrationRoutingManifestDependencies,
  phaseDependencyCount: IntegrationRoutingManifestDependencies.length,
  directPreviousPhaseModule: "integrationRoutingValidation.ts" as const,
  validationOnly: true as const,
  validationId: IntegrationRoutingValidationIdentity.canonicalId,
  validationVersion: IntegrationRoutingValidationIdentity.version,
  validationNamespace: IntegrationRoutingValidationIdentity.namespace,
  validationPublicSurfaceOnly: true as const,
  validationInternalImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil3PhaseImport: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-3:5 → EIL-3:4 IntegrationRoutingValidationPlatform (exclusive)",
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
 * Canonical immutable Integration Routing Manifest platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationRoutingManifestPlatform = Object.freeze({
  identity: IntegrationRoutingManifestIdentity,
  dependency,
  validationIdentity: IntegrationRoutingValidationIdentity,
  architecture: IntegrationRoutingArchitectureManifest,
  inventory: IntegrationRoutingInventoryManifest,
  dependencyManifest: IntegrationRoutingDependencyManifest,
  compatibility: IntegrationRoutingCompatibilityManifest,
  collections: IntegrationRoutingManifestCollections,
  summary: IntegrationRoutingManifestSummary,
  readiness,
  status: IntegrationRoutingManifestStatusValue,
  sources: Object.freeze({
    validationId: IntegrationRoutingValidationIdentity.canonicalId,
    validationEntryPoint: "integrationRoutingValidation.ts" as const,
    validationNamespace: IntegrationRoutingValidationIdentity.namespace,
    validationSummary: IntegrationRoutingValidationSummary,
    inventoryEnvelope: inventory,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-3:6 — Integration Routing Platform",
  validationPlatform: IntegrationRoutingValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
  routingEngine: false as const,
  messageExecution: false as const,
  orchestrationBehavior: false as const,
  schedulingBehavior: false as const,
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
  importsLaterEil3Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
