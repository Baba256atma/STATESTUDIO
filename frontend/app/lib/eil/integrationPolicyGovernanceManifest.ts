/**
 * EIL-5:5 — Integration Policy & Governance Manifest.
 *
 * Canonical immutable architectural publication of EIL-5 through Validation.
 * Consumes only the EIL-5:4 Integration Policy & Governance Validation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by EIL-5:5.
 *
 * Public exports (exactly 8):
 *   IntegrationPolicyGovernanceManifestIdentity
 *   IntegrationPolicyGovernanceArchitectureManifest
 *   IntegrationPolicyGovernanceInventoryManifest
 *   IntegrationPolicyGovernanceDependencyManifest
 *   IntegrationPolicyGovernanceCompatibilityManifest
 *   IntegrationPolicyGovernanceManifestCollections
 *   IntegrationPolicyGovernanceManifestSummary
 *   IntegrationPolicyGovernanceManifestPlatform
 */

import { IntegrationPolicyGovernanceArchitectureManifest } from "./integrationPolicyGovernanceArchitectureManifest.ts";
import { IntegrationPolicyGovernanceCompatibilityManifest } from "./integrationPolicyGovernanceCompatibilityManifest.ts";
import { IntegrationPolicyGovernanceDependencyManifest } from "./integrationPolicyGovernanceDependencyManifest.ts";
import { IntegrationPolicyGovernanceInventoryManifest } from "./integrationPolicyGovernanceInventoryManifest.ts";
import {
  IntegrationPolicyGovernanceManifestDependencies,
  IntegrationPolicyGovernanceManifestIdentity,
  IntegrationPolicyGovernanceManifestReadinessStateValue,
  IntegrationPolicyGovernanceManifestStatusValue,
} from "./integrationPolicyGovernanceManifestIdentity.ts";
import type {
  IntegrationPolicyGovernanceManifestCollections as PolicyGovernanceManifestCollectionsDescriptor,
  IntegrationPolicyGovernanceManifestInventory,
  IntegrationPolicyGovernanceManifestSummary as PolicyGovernanceManifestSummaryDescriptor,
} from "./integrationPolicyGovernanceManifestTypes.ts";
import {
  IntegrationPolicyGovernanceValidationIdentity,
  IntegrationPolicyGovernanceValidationPlatform,
  IntegrationPolicyGovernanceValidationSummary,
} from "./integrationPolicyGovernanceValidation.ts";

export { IntegrationPolicyGovernanceManifestIdentity } from "./integrationPolicyGovernanceManifestIdentity.ts";
export { IntegrationPolicyGovernanceArchitectureManifest } from "./integrationPolicyGovernanceArchitectureManifest.ts";
export { IntegrationPolicyGovernanceInventoryManifest } from "./integrationPolicyGovernanceInventoryManifest.ts";
export { IntegrationPolicyGovernanceDependencyManifest } from "./integrationPolicyGovernanceDependencyManifest.ts";
export { IntegrationPolicyGovernanceCompatibilityManifest } from "./integrationPolicyGovernanceCompatibilityManifest.ts";

const readiness = Object.freeze({
  readinessId: "EIL-5:5/Readiness" as const,
  status: IntegrationPolicyGovernanceManifestStatusValue,
  readiness: IntegrationPolicyGovernanceManifestReadinessStateValue,
  nextPhase: "EIL-5:6 — Integration Policy & Governance Platform" as const,
  claimsRuntimeReady: false as const,
  claimsReadyForCertification: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Inventory totals are derived from the inventory manifesto.
 */
export const IntegrationPolicyGovernanceManifestCollections: PolicyGovernanceManifestCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-5:5/Collections",
    sourcePhase: "EIL-5:5" as const,
    architecture: IntegrationPolicyGovernanceArchitectureManifest,
    inventory: IntegrationPolicyGovernanceInventoryManifest,
    dependency: IntegrationPolicyGovernanceDependencyManifest,
    compatibility: IntegrationPolicyGovernanceCompatibilityManifest,
    compatibilityDeclarationCount:
      IntegrationPolicyGovernanceCompatibilityManifest.declarationCount,
    foundationCategoryCount:
      IntegrationPolicyGovernanceInventoryManifest.foundationCategoryCount,
    registryEntryCount:
      IntegrationPolicyGovernanceInventoryManifest.registryEntryCount,
    domainModelCount:
      IntegrationPolicyGovernanceInventoryManifest.domainModelCount,
    validationRuleCount:
      IntegrationPolicyGovernanceInventoryManifest.validationRuleCount,
    totalInventoryCount:
      IntegrationPolicyGovernanceInventoryManifest.totalInventoryCount,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationPolicyGovernanceManifestInventory = Object.freeze({
  inventoryId: "EIL-5:5/ManifestInventory",
  foundationCategoryCount:
    IntegrationPolicyGovernanceManifestCollections.foundationCategoryCount,
  registryEntryCount:
    IntegrationPolicyGovernanceManifestCollections.registryEntryCount,
  domainModelCount:
    IntegrationPolicyGovernanceManifestCollections.domainModelCount,
  validationRuleCount:
    IntegrationPolicyGovernanceManifestCollections.validationRuleCount,
  totalInventoryCount:
    IntegrationPolicyGovernanceManifestCollections.totalInventoryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Policy & Governance Manifest summary.
 */
export const IntegrationPolicyGovernanceManifestSummary: PolicyGovernanceManifestSummaryDescriptor =
  Object.freeze({
    manifestId: "EIL-5:5/IntegrationPolicyGovernanceManifest",
    version: "1.0.0",
    name: "Integration Policy & Governance Manifest",
    namespace: "nexora.eil.integration-policy-governance.manifest",
    status: IntegrationPolicyGovernanceManifestStatusValue,
    readiness: IntegrationPolicyGovernanceManifestReadinessStateValue,
    validationId: "EIL-5:4/IntegrationPolicyGovernanceValidation",
    validationStatus: "Validation",
    dependencySummary:
      "Sole upstream dependency: EIL-5:4/IntegrationPolicyGovernanceValidation via integrationPolicyGovernanceValidation.ts",
    compatibilitySummary: `Declares ${IntegrationPolicyGovernanceCompatibilityManifest.declarationCount} compatibility scopes across Foundation through Validation.`,
    foundationCategoryCount:
      IntegrationPolicyGovernanceInventoryManifest.foundationCategoryCount,
    registryEntryCount:
      IntegrationPolicyGovernanceInventoryManifest.registryEntryCount,
    domainModelCount:
      IntegrationPolicyGovernanceInventoryManifest.domainModelCount,
    validationRuleCount:
      IntegrationPolicyGovernanceInventoryManifest.validationRuleCount,
    totalInventoryCount:
      IntegrationPolicyGovernanceInventoryManifest.totalInventoryCount,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-5:6 — Integration Policy & Governance Platform",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-5:5/Dependency/EIL54Validation",
  phaseDependencies: IntegrationPolicyGovernanceManifestDependencies,
  phaseDependencyCount:
    IntegrationPolicyGovernanceManifestDependencies.length,
  directPreviousPhaseModule:
    "integrationPolicyGovernanceValidation.ts" as const,
  validationOnly: true as const,
  validationId: IntegrationPolicyGovernanceValidationIdentity.canonicalId,
  validationVersion: IntegrationPolicyGovernanceValidationIdentity.version,
  validationNamespace: IntegrationPolicyGovernanceValidationIdentity.namespace,
  validationPublicSurfaceOnly: true as const,
  validationInternalImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil5PhaseImport: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-5:5 → EIL-5:4 IntegrationPolicyGovernanceValidationPlatform (exclusive)",
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
 * Canonical immutable Integration Policy & Governance Manifest platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationPolicyGovernanceManifestPlatform = Object.freeze({
  identity: IntegrationPolicyGovernanceManifestIdentity,
  dependency,
  validationIdentity: IntegrationPolicyGovernanceValidationIdentity,
  architecture: IntegrationPolicyGovernanceArchitectureManifest,
  inventory: IntegrationPolicyGovernanceInventoryManifest,
  dependencyManifest: IntegrationPolicyGovernanceDependencyManifest,
  compatibility: IntegrationPolicyGovernanceCompatibilityManifest,
  collections: IntegrationPolicyGovernanceManifestCollections,
  summary: IntegrationPolicyGovernanceManifestSummary,
  readiness,
  status: IntegrationPolicyGovernanceManifestStatusValue,
  sources: Object.freeze({
    validationId: IntegrationPolicyGovernanceValidationIdentity.canonicalId,
    validationEntryPoint: "integrationPolicyGovernanceValidation.ts" as const,
    validationNamespace: IntegrationPolicyGovernanceValidationIdentity.namespace,
    validationSummary: IntegrationPolicyGovernanceValidationSummary,
    inventoryEnvelope: inventory,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-5:6 — Integration Policy & Governance Platform",
  validationPlatform: IntegrationPolicyGovernanceValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
  governanceEngine: false as const,
  policyEnforcement: false as const,
  authorizationEngine: false as const,
  complianceEngine: false as const,
  orchestrationRuntime: false as const,
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
  importsLaterEil5Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
