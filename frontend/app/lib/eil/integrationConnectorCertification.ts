/**
 * EIL-2:7 — Integration Connector Certification.
 *
 * Canonical immutable certification architecture for the EIL-2 Connector Platform.
 * Consumes only the EIL-2:6 Integration Connector Platform aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by EIL-2:7.
 *
 * Public exports (exactly 8):
 *   IntegrationConnectorCertificationIdentity
 *   IntegrationConnectorCertificationCriteria
 *   IntegrationConnectorCertificationGates
 *   IntegrationConnectorComplianceDeclarations
 *   IntegrationConnectorCertificationReadiness
 *   IntegrationConnectorCertificationCollections
 *   IntegrationConnectorCertificationSummary
 *   IntegrationConnectorCertificationPlatform
 */

import { IntegrationConnectorCertificationCriteria } from "./integrationConnectorCertificationCriteria.ts";
import { IntegrationConnectorCertificationGates } from "./integrationConnectorCertificationGates.ts";
import {
  IntegrationConnectorCertificationDependencies,
  IntegrationConnectorCertificationIdentity,
  IntegrationConnectorCertificationReadinessState,
  IntegrationConnectorCertificationStatus,
} from "./integrationConnectorCertificationIdentity.ts";
import { IntegrationConnectorCertificationReadiness } from "./integrationConnectorCertificationReadiness.ts";
import { IntegrationConnectorComplianceDeclarations } from "./integrationConnectorComplianceDeclarations.ts";
import type {
  IntegrationConnectorCertificationCollectionsDescriptor,
  IntegrationConnectorCertificationInventory,
  IntegrationConnectorCertificationSummaryDescriptor,
} from "./integrationConnectorCertificationTypes.ts";
import {
  IntegrationConnectorPlatform,
  IntegrationConnectorPlatformIdentity,
  IntegrationConnectorPlatformSummary,
} from "./integrationConnectorPlatform.ts";

export { IntegrationConnectorCertificationIdentity } from "./integrationConnectorCertificationIdentity.ts";
export { IntegrationConnectorCertificationCriteria } from "./integrationConnectorCertificationCriteria.ts";
export { IntegrationConnectorCertificationGates } from "./integrationConnectorCertificationGates.ts";
export { IntegrationConnectorComplianceDeclarations } from "./integrationConnectorComplianceDeclarations.ts";
export { IntegrationConnectorCertificationReadiness } from "./integrationConnectorCertificationReadiness.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from certification arrays.
 */
export const IntegrationConnectorCertificationCollections: IntegrationConnectorCertificationCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-2:7/Collections",
    sourcePhase: "EIL-2:7" as const,
    criteria: IntegrationConnectorCertificationCriteria,
    gates: IntegrationConnectorCertificationGates,
    compliance: IntegrationConnectorComplianceDeclarations,
    criteriaCount: IntegrationConnectorCertificationCriteria.length,
    gateCount: IntegrationConnectorCertificationGates.length,
    complianceCount: IntegrationConnectorComplianceDeclarations.length,
    totalCertificationEntryCount:
      IntegrationConnectorCertificationCriteria.length +
      IntegrationConnectorCertificationGates.length +
      IntegrationConnectorComplianceDeclarations.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationConnectorCertificationInventory = Object.freeze({
  inventoryId: "EIL-2:7/Inventory",
  criteriaCount: IntegrationConnectorCertificationCollections.criteriaCount,
  gateCount: IntegrationConnectorCertificationCollections.gateCount,
  complianceCount: IntegrationConnectorCertificationCollections.complianceCount,
  totalCertificationEntryCount:
    IntegrationConnectorCertificationCollections.totalCertificationEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Connector Certification summary.
 */
export const IntegrationConnectorCertificationSummary: IntegrationConnectorCertificationSummaryDescriptor =
  Object.freeze({
    certificationId: "EIL-2:7/IntegrationConnectorCertification",
    version: "1.0.0",
    name: "Integration Connector Certification",
    namespace: "nexora.eil.integration-connector.certification",
    status: IntegrationConnectorCertificationStatus,
    readiness: IntegrationConnectorCertificationReadinessState,
    platformId: "EIL-2:6/IntegrationConnectorPlatform",
    criteriaCount: IntegrationConnectorCertificationCollections.criteriaCount,
    gateCount: IntegrationConnectorCertificationCollections.gateCount,
    complianceCount:
      IntegrationConnectorCertificationCollections.complianceCount,
    totalCertificationEntryCount:
      IntegrationConnectorCertificationCollections.totalCertificationEntryCount,
    nextPhase: "EIL-2:8 — Integration Connector Freeze",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-2:7/Dependency/EIL26Platform",
  phaseDependencies: IntegrationConnectorCertificationDependencies,
  phaseDependencyCount: IntegrationConnectorCertificationDependencies.length,
  directPreviousPhaseModule: "integrationConnectorPlatform.ts" as const,
  platformOnly: true as const,
  platformId: IntegrationConnectorPlatformIdentity.canonicalId,
  platformVersion: IntegrationConnectorPlatformIdentity.version,
  platformNamespace: IntegrationConnectorPlatformIdentity.namespace,
  platformPublicSurfaceOnly: true as const,
  platformInternalImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  eil1Dependency: false as const,
  laterEil2PhaseImport: false as const,
  reconstructsPlatform: false as const,
  duplicatesPlatformValues: false as const,
  canonicalPath:
    "EIL-2:7 → EIL-2:6 IntegrationConnectorPlatform (exclusive)",
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
 * Canonical immutable Integration Connector Certification platform.
 * Sole entry point for Freeze consumers.
 */
export const IntegrationConnectorCertificationPlatform = Object.freeze({
  identity: IntegrationConnectorCertificationIdentity,
  dependency,
  platformIdentity: IntegrationConnectorPlatformIdentity,
  criteria: IntegrationConnectorCertificationCriteria,
  gates: IntegrationConnectorCertificationGates,
  compliance: IntegrationConnectorComplianceDeclarations,
  readiness: IntegrationConnectorCertificationReadiness,
  collections: IntegrationConnectorCertificationCollections,
  inventory,
  summary: IntegrationConnectorCertificationSummary,
  status: IntegrationConnectorCertificationStatus,
  sources: Object.freeze({
    platformId: IntegrationConnectorPlatformIdentity.canonicalId,
    platformEntryPoint: "integrationConnectorPlatform.ts" as const,
    platformNamespace: IntegrationConnectorPlatformIdentity.namespace,
    platformSummary: IntegrationConnectorPlatformSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-2:8 — Integration Connector Freeze",
  integrationConnectorPlatform: IntegrationConnectorPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  certificationEngine: false as const,
  runtimeCertification: false as const,
  gateExecution: false as const,
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
  sdkRuntime: false as const,
  apiBehavior: false as const,
  stateMutation: false as const,
  eil1Dependency: false as const,
  importsLaterEil2Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
