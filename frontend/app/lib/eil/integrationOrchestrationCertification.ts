/**
 * EIL-4:7 — Integration Orchestration Certification.
 *
 * Canonical immutable certification architecture for the EIL-4 Orchestration Platform.
 * Consumes only the EIL-4:6 Integration Orchestration Platform aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by EIL-4:7.
 *
 * Public exports (exactly 8):
 *   IntegrationOrchestrationCertificationIdentity
 *   IntegrationOrchestrationCertificationCriteria
 *   IntegrationOrchestrationCertificationGates
 *   IntegrationOrchestrationComplianceDeclarations
 *   IntegrationOrchestrationCertificationReadiness
 *   IntegrationOrchestrationCertificationCollections
 *   IntegrationOrchestrationCertificationSummary
 *   IntegrationOrchestrationCertificationPlatform
 */

import { IntegrationOrchestrationCertificationCriteria } from "./integrationOrchestrationCertificationCriteria.ts";
import { IntegrationOrchestrationCertificationGates } from "./integrationOrchestrationCertificationGates.ts";
import {
  IntegrationOrchestrationCertificationDependencies,
  IntegrationOrchestrationCertificationIdentity,
  IntegrationOrchestrationCertificationReadinessStateValue,
  IntegrationOrchestrationCertificationStatusValue,
} from "./integrationOrchestrationCertificationIdentity.ts";
import { IntegrationOrchestrationCertificationReadiness } from "./integrationOrchestrationCertificationReadiness.ts";
import { IntegrationOrchestrationComplianceDeclarations } from "./integrationOrchestrationComplianceDeclarations.ts";
import type {
  IntegrationOrchestrationCertificationCollections as OrchestrationCertificationCollectionsDescriptor,
  IntegrationOrchestrationCertificationInventory as OrchestrationCertificationInventoryDescriptor,
  IntegrationOrchestrationCertificationSummary as OrchestrationCertificationSummaryDescriptor,
} from "./integrationOrchestrationCertificationTypes.ts";
import {
  IntegrationOrchestrationPlatform,
  IntegrationOrchestrationPlatformIdentity,
  IntegrationOrchestrationPlatformSummary,
} from "./integrationOrchestrationPlatform.ts";

export { IntegrationOrchestrationCertificationIdentity } from "./integrationOrchestrationCertificationIdentity.ts";
export { IntegrationOrchestrationCertificationCriteria } from "./integrationOrchestrationCertificationCriteria.ts";
export { IntegrationOrchestrationCertificationGates } from "./integrationOrchestrationCertificationGates.ts";
export { IntegrationOrchestrationComplianceDeclarations } from "./integrationOrchestrationComplianceDeclarations.ts";
export { IntegrationOrchestrationCertificationReadiness } from "./integrationOrchestrationCertificationReadiness.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from certification arrays.
 */
export const IntegrationOrchestrationCertificationCollections: OrchestrationCertificationCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-4:7/Collections",
    sourcePhase: "EIL-4:7" as const,
    criteria: IntegrationOrchestrationCertificationCriteria,
    gates: IntegrationOrchestrationCertificationGates,
    compliance: IntegrationOrchestrationComplianceDeclarations,
    criteriaCount: IntegrationOrchestrationCertificationCriteria.length,
    gateCount: IntegrationOrchestrationCertificationGates.length,
    complianceCount: IntegrationOrchestrationComplianceDeclarations.length,
    totalCertificationEntryCount:
      IntegrationOrchestrationCertificationCriteria.length +
      IntegrationOrchestrationCertificationGates.length +
      IntegrationOrchestrationComplianceDeclarations.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: OrchestrationCertificationInventoryDescriptor = Object.freeze({
  inventoryId: "EIL-4:7/Inventory",
  criteriaCount: IntegrationOrchestrationCertificationCollections.criteriaCount,
  gateCount: IntegrationOrchestrationCertificationCollections.gateCount,
  complianceCount:
    IntegrationOrchestrationCertificationCollections.complianceCount,
  totalCertificationEntryCount:
    IntegrationOrchestrationCertificationCollections.totalCertificationEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Orchestration Certification summary.
 */
export const IntegrationOrchestrationCertificationSummary: OrchestrationCertificationSummaryDescriptor =
  Object.freeze({
    certificationId: "EIL-4:7/IntegrationOrchestrationCertification",
    version: "1.0.0",
    name: "Integration Orchestration Certification",
    namespace: "nexora.eil.integration-orchestration.certification",
    status: IntegrationOrchestrationCertificationStatusValue,
    readiness: IntegrationOrchestrationCertificationReadinessStateValue,
    platformId: "EIL-4:6/IntegrationOrchestrationPlatform",
    criteriaCount:
      IntegrationOrchestrationCertificationCollections.criteriaCount,
    gateCount: IntegrationOrchestrationCertificationCollections.gateCount,
    complianceCount:
      IntegrationOrchestrationCertificationCollections.complianceCount,
    totalCertificationEntryCount:
      IntegrationOrchestrationCertificationCollections.totalCertificationEntryCount,
    nextPhase: "EIL-4:8 — Integration Orchestration Freeze",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-4:7/Dependency/EIL46Platform",
  phaseDependencies: IntegrationOrchestrationCertificationDependencies,
  phaseDependencyCount:
    IntegrationOrchestrationCertificationDependencies.length,
  directPreviousPhaseModule: "integrationOrchestrationPlatform.ts" as const,
  platformOnly: true as const,
  platformId: IntegrationOrchestrationPlatformIdentity.canonicalId,
  platformVersion: IntegrationOrchestrationPlatformIdentity.version,
  platformNamespace: IntegrationOrchestrationPlatformIdentity.namespace,
  platformPublicSurfaceOnly: true as const,
  platformInternalImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil4PhaseImport: false as const,
  reconstructsPlatform: false as const,
  duplicatesPlatformValues: false as const,
  canonicalPath:
    "EIL-4:7 → EIL-4:6 IntegrationOrchestrationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "platformIdentity",
  "criteria",
  "gates",
  "compliance",
  "readiness",
  "collections",
  "inventory",
  "summary",
  "status",
  "sources",
] as const);

/**
 * Canonical immutable Integration Orchestration Certification platform.
 * Sole entry point for Freeze consumers.
 */
export const IntegrationOrchestrationCertificationPlatform = Object.freeze({
  identity: IntegrationOrchestrationCertificationIdentity,
  dependency,
  platformIdentity: IntegrationOrchestrationPlatformIdentity,
  criteria: IntegrationOrchestrationCertificationCriteria,
  gates: IntegrationOrchestrationCertificationGates,
  compliance: IntegrationOrchestrationComplianceDeclarations,
  readiness: IntegrationOrchestrationCertificationReadiness,
  collections: IntegrationOrchestrationCertificationCollections,
  inventory,
  summary: IntegrationOrchestrationCertificationSummary,
  status: IntegrationOrchestrationCertificationStatusValue,
  sources: Object.freeze({
    platformId: IntegrationOrchestrationPlatformIdentity.canonicalId,
    platformEntryPoint: "integrationOrchestrationPlatform.ts" as const,
    platformNamespace: IntegrationOrchestrationPlatformIdentity.namespace,
    platformSummary: IntegrationOrchestrationPlatformSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-4:8 — Integration Orchestration Freeze",
  integrationOrchestrationPlatform: IntegrationOrchestrationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  certificationEngine: false as const,
  runtimeCertification: false as const,
  gateExecution: false as const,
  orchestrationEngine: false as const,
  workflowExecution: false as const,
  routingExecution: false as const,
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
  apiBehavior: false as const,
  stateMutation: false as const,
  previousEilPlatformDependency: false as const,
  importsLaterEil4Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
