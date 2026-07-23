/**
 * EIL-1:7 — Integration Certification.
 *
 * Canonical immutable certification architecture for the EIL-1 Platform.
 * Consumes only the EIL-1:6 Integration Platform aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by EIL-1:7.
 *
 * Public exports (exactly 8):
 *   IntegrationCertificationIdentity
 *   IntegrationCertificationCriteria
 *   IntegrationCertificationGates
 *   IntegrationComplianceDeclarations
 *   IntegrationCertificationReadiness
 *   IntegrationCertificationCollections
 *   IntegrationCertificationSummary
 *   IntegrationCertificationPlatform
 */

import { IntegrationCertificationCriteria } from "./integrationCertificationCriteria.ts";
import { IntegrationCertificationGates } from "./integrationCertificationGates.ts";
import {
  IntegrationCertificationDependencies,
  IntegrationCertificationIdentity,
  IntegrationCertificationReadinessState,
  IntegrationCertificationStatus,
} from "./integrationCertificationIdentity.ts";
import { IntegrationCertificationReadiness } from "./integrationCertificationReadiness.ts";
import { IntegrationComplianceDeclarations } from "./integrationComplianceDeclarations.ts";
import type {
  IntegrationCertificationCollectionsDescriptor,
  IntegrationCertificationInventory,
  IntegrationCertificationSummaryDescriptor,
} from "./integrationCertificationTypes.ts";
import {
  IntegrationPlatform,
  IntegrationPlatformIdentity,
  IntegrationPlatformSummary,
} from "./integrationPlatform.ts";

export { IntegrationCertificationIdentity } from "./integrationCertificationIdentity.ts";
export { IntegrationCertificationCriteria } from "./integrationCertificationCriteria.ts";
export { IntegrationCertificationGates } from "./integrationCertificationGates.ts";
export { IntegrationComplianceDeclarations } from "./integrationComplianceDeclarations.ts";
export { IntegrationCertificationReadiness } from "./integrationCertificationReadiness.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from certification arrays.
 */
export const IntegrationCertificationCollections: IntegrationCertificationCollectionsDescriptor =
  Object.freeze({
  collectionsId: "EIL-1:7/Collections",
  sourcePhase: "EIL-1:7" as const,
  criteria: IntegrationCertificationCriteria,
  gates: IntegrationCertificationGates,
  compliance: IntegrationComplianceDeclarations,
  criteriaCount: IntegrationCertificationCriteria.length,
  gateCount: IntegrationCertificationGates.length,
  complianceCount: IntegrationComplianceDeclarations.length,
  totalCertificationEntryCount:
    IntegrationCertificationCriteria.length +
    IntegrationCertificationGates.length +
    IntegrationComplianceDeclarations.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const inventory: IntegrationCertificationInventory = Object.freeze({
  inventoryId: "EIL-1:7/Inventory",
  criteriaCount: IntegrationCertificationCollections.criteriaCount,
  gateCount: IntegrationCertificationCollections.gateCount,
  complianceCount: IntegrationCertificationCollections.complianceCount,
  totalCertificationEntryCount:
    IntegrationCertificationCollections.totalCertificationEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Certification summary.
 */
export const IntegrationCertificationSummary: IntegrationCertificationSummaryDescriptor =
  Object.freeze({
    certificationId: "EIL-1:7/IntegrationCertification",
    version: "1.0.0",
    name: "Integration Certification",
    namespace: "nexora.eil.integration.certification",
    status: IntegrationCertificationStatus,
    readiness: IntegrationCertificationReadinessState,
    platformId: "EIL-1:6/IntegrationPlatform",
    criteriaCount: IntegrationCertificationCollections.criteriaCount,
    gateCount: IntegrationCertificationCollections.gateCount,
    complianceCount: IntegrationCertificationCollections.complianceCount,
    totalCertificationEntryCount:
      IntegrationCertificationCollections.totalCertificationEntryCount,
    nextPhase: "EIL-1:8 — Integration Freeze",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-1:7/Dependency/EIL16Platform",
  phaseDependencies: IntegrationCertificationDependencies,
  phaseDependencyCount: IntegrationCertificationDependencies.length,
  directPreviousPhaseModule: "integrationPlatform.ts" as const,
  platformOnly: true as const,
  platformId: IntegrationPlatformIdentity.canonicalId,
  platformVersion: IntegrationPlatformIdentity.version,
  platformNamespace: IntegrationPlatformIdentity.namespace,
  platformPublicSurfaceOnly: true as const,
  platformInternalImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEilPhaseImport: false as const,
  reconstructsPlatform: false as const,
  duplicatesPlatformValues: false as const,
  canonicalPath:
    "EIL-1:7 → EIL-1:6 IntegrationPlatform (exclusive)",
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
 * Canonical immutable Integration Certification platform.
 * Sole entry point for Freeze consumers.
 */
export const IntegrationCertificationPlatform = Object.freeze({
  identity: IntegrationCertificationIdentity,
  dependency,
  platformIdentity: IntegrationPlatformIdentity,
  criteria: IntegrationCertificationCriteria,
  gates: IntegrationCertificationGates,
  compliance: IntegrationComplianceDeclarations,
  readiness: IntegrationCertificationReadiness,
  collections: IntegrationCertificationCollections,
  inventory,
  summary: IntegrationCertificationSummary,
  status: IntegrationCertificationStatus,
  sources: Object.freeze({
    platformId: IntegrationPlatformIdentity.canonicalId,
    platformEntryPoint: "integrationPlatform.ts" as const,
    platformNamespace: IntegrationPlatformIdentity.namespace,
    platformSummary: IntegrationPlatformSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-1:8 — Integration Freeze",
  integrationPlatform: IntegrationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  certificationEngine: false as const,
  runtimeCertification: false as const,
  gateExecution: false as const,
  routingEngine: false as const,
  orchestrationEngine: false as const,
  validationExecution: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  eventBus: false as const,
  queueBehavior: false as const,
  adapterBehavior: false as const,
  connectorBehavior: false as const,
  dependencyInjection: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  loggingRuntime: false as const,
  monitoringRuntime: false as const,
  telemetryRuntime: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  visualizationBehavior: false as const,
  sdkRuntime: false as const,
  apiBehavior: false as const,
  stateMutation: false as const,
  importsLaterEilPhases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
