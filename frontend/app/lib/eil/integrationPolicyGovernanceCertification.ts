/**
 * EIL-5:7 — Integration Policy & Governance Certification.
 *
 * Canonical immutable certification architecture for the EIL-5 Governance Platform.
 * Consumes only the EIL-5:6 Integration Policy & Governance Platform aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by EIL-5:7.
 *
 * Public exports (exactly 8):
 *   IntegrationPolicyGovernanceCertificationIdentity
 *   IntegrationPolicyGovernanceCertificationCriteria
 *   IntegrationPolicyGovernanceCertificationGates
 *   IntegrationPolicyGovernanceComplianceDeclarations
 *   IntegrationPolicyGovernanceCertificationReadiness
 *   IntegrationPolicyGovernanceCertificationCollections
 *   IntegrationPolicyGovernanceCertificationSummary
 *   IntegrationPolicyGovernanceCertificationPlatform
 */

import { IntegrationPolicyGovernanceCertificationCriteria } from "./integrationPolicyGovernanceCertificationCriteria.ts";
import { IntegrationPolicyGovernanceCertificationGates } from "./integrationPolicyGovernanceCertificationGates.ts";
import {
  IntegrationPolicyGovernanceCertificationDependencies,
  IntegrationPolicyGovernanceCertificationIdentity,
  IntegrationPolicyGovernanceCertificationReadinessStateValue,
  IntegrationPolicyGovernanceCertificationStatusValue,
} from "./integrationPolicyGovernanceCertificationIdentity.ts";
import { IntegrationPolicyGovernanceCertificationReadiness } from "./integrationPolicyGovernanceCertificationReadiness.ts";
import { IntegrationPolicyGovernanceComplianceDeclarations } from "./integrationPolicyGovernanceComplianceDeclarations.ts";
import type {
  IntegrationPolicyGovernanceCertificationCollections as PolicyGovernanceCertificationCollectionsDescriptor,
  IntegrationPolicyGovernanceCertificationInventory as PolicyGovernanceCertificationInventoryDescriptor,
  IntegrationPolicyGovernanceCertificationSummary as PolicyGovernanceCertificationSummaryDescriptor,
} from "./integrationPolicyGovernanceCertificationTypes.ts";
import {
  IntegrationPolicyGovernancePlatform,
  IntegrationPolicyGovernancePlatformIdentity,
  IntegrationPolicyGovernancePlatformSummary,
} from "./integrationPolicyGovernancePlatform.ts";

export { IntegrationPolicyGovernanceCertificationIdentity } from "./integrationPolicyGovernanceCertificationIdentity.ts";
export { IntegrationPolicyGovernanceCertificationCriteria } from "./integrationPolicyGovernanceCertificationCriteria.ts";
export { IntegrationPolicyGovernanceCertificationGates } from "./integrationPolicyGovernanceCertificationGates.ts";
export { IntegrationPolicyGovernanceComplianceDeclarations } from "./integrationPolicyGovernanceComplianceDeclarations.ts";
export { IntegrationPolicyGovernanceCertificationReadiness } from "./integrationPolicyGovernanceCertificationReadiness.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from certification arrays.
 */
export const IntegrationPolicyGovernanceCertificationCollections: PolicyGovernanceCertificationCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-5:7/Collections",
    sourcePhase: "EIL-5:7" as const,
    criteria: IntegrationPolicyGovernanceCertificationCriteria,
    gates: IntegrationPolicyGovernanceCertificationGates,
    compliance: IntegrationPolicyGovernanceComplianceDeclarations,
    criteriaCount: IntegrationPolicyGovernanceCertificationCriteria.length,
    gateCount: IntegrationPolicyGovernanceCertificationGates.length,
    complianceCount:
      IntegrationPolicyGovernanceComplianceDeclarations.length,
    totalCertificationEntryCount:
      IntegrationPolicyGovernanceCertificationCriteria.length +
      IntegrationPolicyGovernanceCertificationGates.length +
      IntegrationPolicyGovernanceComplianceDeclarations.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: PolicyGovernanceCertificationInventoryDescriptor =
  Object.freeze({
    inventoryId: "EIL-5:7/Inventory",
    criteriaCount:
      IntegrationPolicyGovernanceCertificationCollections.criteriaCount,
    gateCount: IntegrationPolicyGovernanceCertificationCollections.gateCount,
    complianceCount:
      IntegrationPolicyGovernanceCertificationCollections.complianceCount,
    totalCertificationEntryCount:
      IntegrationPolicyGovernanceCertificationCollections.totalCertificationEntryCount,
    countsDerivedFromCollections: true as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Deterministic frozen Integration Policy & Governance Certification summary.
 */
export const IntegrationPolicyGovernanceCertificationSummary: PolicyGovernanceCertificationSummaryDescriptor =
  Object.freeze({
    certificationId: "EIL-5:7/IntegrationPolicyGovernanceCertification",
    version: "1.0.0",
    name: "Integration Policy & Governance Certification",
    namespace: "nexora.eil.integration-policy-governance.certification",
    status: IntegrationPolicyGovernanceCertificationStatusValue,
    readiness: IntegrationPolicyGovernanceCertificationReadinessStateValue,
    platformId: "EIL-5:6/IntegrationPolicyGovernancePlatform",
    criteriaCount:
      IntegrationPolicyGovernanceCertificationCollections.criteriaCount,
    gateCount: IntegrationPolicyGovernanceCertificationCollections.gateCount,
    complianceCount:
      IntegrationPolicyGovernanceCertificationCollections.complianceCount,
    totalCertificationEntryCount:
      IntegrationPolicyGovernanceCertificationCollections.totalCertificationEntryCount,
    nextPhase: "EIL-5:8 — Integration Policy & Governance Freeze",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-5:7/Dependency/EIL56Platform",
  phaseDependencies: IntegrationPolicyGovernanceCertificationDependencies,
  phaseDependencyCount:
    IntegrationPolicyGovernanceCertificationDependencies.length,
  directPreviousPhaseModule:
    "integrationPolicyGovernancePlatform.ts" as const,
  platformOnly: true as const,
  platformId: IntegrationPolicyGovernancePlatformIdentity.canonicalId,
  platformVersion: IntegrationPolicyGovernancePlatformIdentity.version,
  platformNamespace: IntegrationPolicyGovernancePlatformIdentity.namespace,
  platformPublicSurfaceOnly: true as const,
  platformInternalImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil5PhaseImport: false as const,
  reconstructsPlatform: false as const,
  duplicatesPlatformValues: false as const,
  canonicalPath:
    "EIL-5:7 → EIL-5:6 IntegrationPolicyGovernancePlatform (exclusive)",
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
 * Canonical immutable Integration Policy & Governance Certification platform.
 * Sole entry point for Freeze consumers.
 */
export const IntegrationPolicyGovernanceCertificationPlatform = Object.freeze({
  identity: IntegrationPolicyGovernanceCertificationIdentity,
  dependency,
  platformIdentity: IntegrationPolicyGovernancePlatformIdentity,
  criteria: IntegrationPolicyGovernanceCertificationCriteria,
  gates: IntegrationPolicyGovernanceCertificationGates,
  compliance: IntegrationPolicyGovernanceComplianceDeclarations,
  readiness: IntegrationPolicyGovernanceCertificationReadiness,
  collections: IntegrationPolicyGovernanceCertificationCollections,
  inventory,
  summary: IntegrationPolicyGovernanceCertificationSummary,
  status: IntegrationPolicyGovernanceCertificationStatusValue,
  sources: Object.freeze({
    platformId: IntegrationPolicyGovernancePlatformIdentity.canonicalId,
    platformEntryPoint: "integrationPolicyGovernancePlatform.ts" as const,
    platformNamespace: IntegrationPolicyGovernancePlatformIdentity.namespace,
    platformSummary: IntegrationPolicyGovernancePlatformSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-5:8 — Integration Policy & Governance Freeze",
  integrationPolicyGovernancePlatform: IntegrationPolicyGovernancePlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  certificationEngine: false as const,
  runtimeCertification: false as const,
  gateExecution: false as const,
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
  apiBehavior: false as const,
  stateMutation: false as const,
  previousEilPlatformDependency: false as const,
  importsLaterEil5Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
