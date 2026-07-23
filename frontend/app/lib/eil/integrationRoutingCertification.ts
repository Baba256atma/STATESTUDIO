/**
 * EIL-3:7 — Integration Routing Certification.
 *
 * Canonical immutable certification architecture for the EIL-3 Routing Platform.
 * Consumes only the EIL-3:6 Integration Routing Platform aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by EIL-3:7.
 *
 * Public exports (exactly 8):
 *   IntegrationRoutingCertificationIdentity
 *   IntegrationRoutingCertificationCriteria
 *   IntegrationRoutingCertificationGates
 *   IntegrationRoutingComplianceDeclarations
 *   IntegrationRoutingCertificationReadiness
 *   IntegrationRoutingCertificationCollections
 *   IntegrationRoutingCertificationSummary
 *   IntegrationRoutingCertificationPlatform
 */

import { IntegrationRoutingCertificationCriteria } from "./integrationRoutingCertificationCriteria.ts";
import { IntegrationRoutingCertificationGates } from "./integrationRoutingCertificationGates.ts";
import {
  IntegrationRoutingCertificationDependencies,
  IntegrationRoutingCertificationIdentity,
  IntegrationRoutingCertificationReadinessStateValue,
  IntegrationRoutingCertificationStatusValue,
} from "./integrationRoutingCertificationIdentity.ts";
import { IntegrationRoutingCertificationReadiness } from "./integrationRoutingCertificationReadiness.ts";
import { IntegrationRoutingComplianceDeclarations } from "./integrationRoutingComplianceDeclarations.ts";
import type {
  RoutingCertificationCollections,
  RoutingCertificationInventory,
  RoutingCertificationSummary,
} from "./integrationRoutingCertificationTypes.ts";
import {
  IntegrationRoutingPlatform,
  IntegrationRoutingPlatformIdentity,
  IntegrationRoutingPlatformSummary,
} from "./integrationRoutingPlatform.ts";

export { IntegrationRoutingCertificationIdentity } from "./integrationRoutingCertificationIdentity.ts";
export { IntegrationRoutingCertificationCriteria } from "./integrationRoutingCertificationCriteria.ts";
export { IntegrationRoutingCertificationGates } from "./integrationRoutingCertificationGates.ts";
export { IntegrationRoutingComplianceDeclarations } from "./integrationRoutingComplianceDeclarations.ts";
export { IntegrationRoutingCertificationReadiness } from "./integrationRoutingCertificationReadiness.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from certification arrays.
 */
export const IntegrationRoutingCertificationCollections: RoutingCertificationCollections =
  Object.freeze({
    collectionsId: "EIL-3:7/Collections",
    sourcePhase: "EIL-3:7" as const,
    criteria: IntegrationRoutingCertificationCriteria,
    gates: IntegrationRoutingCertificationGates,
    compliance: IntegrationRoutingComplianceDeclarations,
    criteriaCount: IntegrationRoutingCertificationCriteria.length,
    gateCount: IntegrationRoutingCertificationGates.length,
    complianceCount: IntegrationRoutingComplianceDeclarations.length,
    totalCertificationEntryCount:
      IntegrationRoutingCertificationCriteria.length +
      IntegrationRoutingCertificationGates.length +
      IntegrationRoutingComplianceDeclarations.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: RoutingCertificationInventory = Object.freeze({
  inventoryId: "EIL-3:7/Inventory",
  criteriaCount: IntegrationRoutingCertificationCollections.criteriaCount,
  gateCount: IntegrationRoutingCertificationCollections.gateCount,
  complianceCount: IntegrationRoutingCertificationCollections.complianceCount,
  totalCertificationEntryCount:
    IntegrationRoutingCertificationCollections.totalCertificationEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Routing Certification summary.
 */
export const IntegrationRoutingCertificationSummary: RoutingCertificationSummary =
  Object.freeze({
    certificationId: "EIL-3:7/IntegrationRoutingCertification",
    version: "1.0.0",
    name: "Integration Routing Certification",
    namespace: "nexora.eil.integration-routing.certification",
    status: IntegrationRoutingCertificationStatusValue,
    readiness: IntegrationRoutingCertificationReadinessStateValue,
    platformId: "EIL-3:6/IntegrationRoutingPlatform",
    criteriaCount: IntegrationRoutingCertificationCollections.criteriaCount,
    gateCount: IntegrationRoutingCertificationCollections.gateCount,
    complianceCount:
      IntegrationRoutingCertificationCollections.complianceCount,
    totalCertificationEntryCount:
      IntegrationRoutingCertificationCollections.totalCertificationEntryCount,
    nextPhase: "EIL-3:8 — Integration Routing Freeze",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-3:7/Dependency/EIL36Platform",
  phaseDependencies: IntegrationRoutingCertificationDependencies,
  phaseDependencyCount: IntegrationRoutingCertificationDependencies.length,
  directPreviousPhaseModule: "integrationRoutingPlatform.ts" as const,
  platformOnly: true as const,
  platformId: IntegrationRoutingPlatformIdentity.canonicalId,
  platformVersion: IntegrationRoutingPlatformIdentity.version,
  platformNamespace: IntegrationRoutingPlatformIdentity.namespace,
  platformPublicSurfaceOnly: true as const,
  platformInternalImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil3PhaseImport: false as const,
  reconstructsPlatform: false as const,
  duplicatesPlatformValues: false as const,
  canonicalPath:
    "EIL-3:7 → EIL-3:6 IntegrationRoutingPlatform (exclusive)",
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
 * Canonical immutable Integration Routing Certification platform.
 * Sole entry point for Freeze consumers.
 */
export const IntegrationRoutingCertificationPlatform = Object.freeze({
  identity: IntegrationRoutingCertificationIdentity,
  dependency,
  platformIdentity: IntegrationRoutingPlatformIdentity,
  criteria: IntegrationRoutingCertificationCriteria,
  gates: IntegrationRoutingCertificationGates,
  compliance: IntegrationRoutingComplianceDeclarations,
  readiness: IntegrationRoutingCertificationReadiness,
  collections: IntegrationRoutingCertificationCollections,
  inventory,
  summary: IntegrationRoutingCertificationSummary,
  status: IntegrationRoutingCertificationStatusValue,
  sources: Object.freeze({
    platformId: IntegrationRoutingPlatformIdentity.canonicalId,
    platformEntryPoint: "integrationRoutingPlatform.ts" as const,
    platformNamespace: IntegrationRoutingPlatformIdentity.namespace,
    platformSummary: IntegrationRoutingPlatformSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-3:8 — Integration Routing Freeze",
  integrationRoutingPlatform: IntegrationRoutingPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  certificationEngine: false as const,
  runtimeCertification: false as const,
  gateExecution: false as const,
  routingEngine: false as const,
  messageExecution: false as const,
  orchestrationBehavior: false as const,
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
  importsLaterEil3Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
