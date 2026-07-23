/**
 * EIL-5:6 — Integration Policy & Governance Platform.
 *
 * Canonical immutable composition surface for the complete EIL-5 governance platform.
 * Consumes only the EIL-5:5 Integration Policy & Governance Manifest aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by EIL-5:6.
 *
 * Public exports (exactly 8):
 *   IntegrationPolicyGovernancePlatformIdentity
 *   IntegrationPolicyGovernancePlatformComposition
 *   IntegrationPolicyGovernancePlatformInventory
 *   IntegrationPolicyGovernancePlatformGuarantees
 *   IntegrationPolicyGovernancePlatformCompatibility
 *   IntegrationPolicyGovernancePlatformCollections
 *   IntegrationPolicyGovernancePlatformSummary
 *   IntegrationPolicyGovernancePlatform
 */

import { IntegrationPolicyGovernancePlatformCompatibility } from "./integrationPolicyGovernancePlatformCompatibility.ts";
import { IntegrationPolicyGovernancePlatformComposition } from "./integrationPolicyGovernancePlatformComposition.ts";
import { IntegrationPolicyGovernancePlatformGuarantees } from "./integrationPolicyGovernancePlatformGuarantees.ts";
import {
  IntegrationPolicyGovernancePlatformDependencies,
  IntegrationPolicyGovernancePlatformIdentity,
  IntegrationPolicyGovernancePlatformReadinessStateValue,
  IntegrationPolicyGovernancePlatformStatusValue,
} from "./integrationPolicyGovernancePlatformIdentity.ts";
import { IntegrationPolicyGovernancePlatformInventory } from "./integrationPolicyGovernancePlatformInventory.ts";
import type {
  IntegrationPolicyGovernancePlatformCollections as PolicyGovernancePlatformCollectionsDescriptor,
  IntegrationPolicyGovernancePlatformSummary as PolicyGovernancePlatformSummaryDescriptor,
  PolicyGovernancePlatformReadiness,
} from "./integrationPolicyGovernancePlatformTypes.ts";
import {
  IntegrationPolicyGovernanceManifestIdentity,
  IntegrationPolicyGovernanceManifestPlatform,
  IntegrationPolicyGovernanceManifestSummary,
} from "./integrationPolicyGovernanceManifest.ts";

export { IntegrationPolicyGovernancePlatformIdentity } from "./integrationPolicyGovernancePlatformIdentity.ts";
export { IntegrationPolicyGovernancePlatformComposition } from "./integrationPolicyGovernancePlatformComposition.ts";
export { IntegrationPolicyGovernancePlatformInventory } from "./integrationPolicyGovernancePlatformInventory.ts";
export { IntegrationPolicyGovernancePlatformGuarantees } from "./integrationPolicyGovernancePlatformGuarantees.ts";
export { IntegrationPolicyGovernancePlatformCompatibility } from "./integrationPolicyGovernancePlatformCompatibility.ts";

const readiness: PolicyGovernancePlatformReadiness = Object.freeze({
  readinessId: "EIL-5:6/Readiness",
  status: IntegrationPolicyGovernancePlatformStatusValue,
  readiness: IntegrationPolicyGovernancePlatformReadinessStateValue,
  nextPhase: "EIL-5:7 — Integration Policy & Governance Certification",
  claimsRuntimeReady: false as const,
  claimsFrozen: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived from platform and Manifest collections.
 */
export const IntegrationPolicyGovernancePlatformCollections: PolicyGovernancePlatformCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-5:6/Collections",
    sourcePhase: "EIL-5:6" as const,
    composition: IntegrationPolicyGovernancePlatformComposition,
    inventory: IntegrationPolicyGovernancePlatformInventory,
    guarantees: IntegrationPolicyGovernancePlatformGuarantees,
    compatibility: IntegrationPolicyGovernancePlatformCompatibility,
    guaranteeCount: IntegrationPolicyGovernancePlatformGuarantees.length,
    compatibilityCount:
      IntegrationPolicyGovernancePlatformCompatibility.length,
    manifestInventoryTotal:
      IntegrationPolicyGovernancePlatformInventory.manifestInventoryTotal,
    total: IntegrationPolicyGovernancePlatformInventory.total,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Deterministic frozen Integration Policy & Governance Platform summary.
 */
export const IntegrationPolicyGovernancePlatformSummary: PolicyGovernancePlatformSummaryDescriptor =
  Object.freeze({
    platformId: "EIL-5:6/IntegrationPolicyGovernancePlatform",
    version: "1.0.0",
    name: "Integration Policy & Governance Platform",
    namespace: "nexora.eil.integration-policy-governance.platform",
    status: IntegrationPolicyGovernancePlatformStatusValue,
    readiness: IntegrationPolicyGovernancePlatformReadinessStateValue,
    manifestId: "EIL-5:5/IntegrationPolicyGovernanceManifest",
    guaranteeCount:
      IntegrationPolicyGovernancePlatformCollections.guaranteeCount,
    compatibilityCount:
      IntegrationPolicyGovernancePlatformCollections.compatibilityCount,
    manifestInventoryTotal:
      IntegrationPolicyGovernancePlatformCollections.manifestInventoryTotal,
    total: IntegrationPolicyGovernancePlatformCollections.total,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-5:7 — Integration Policy & Governance Certification",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-5:6/Dependency/EIL55Manifest",
  phaseDependencies: IntegrationPolicyGovernancePlatformDependencies,
  phaseDependencyCount:
    IntegrationPolicyGovernancePlatformDependencies.length,
  directPreviousPhaseModule:
    "integrationPolicyGovernanceManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: IntegrationPolicyGovernanceManifestIdentity.canonicalId,
  manifestVersion: IntegrationPolicyGovernanceManifestIdentity.version,
  manifestNamespace: IntegrationPolicyGovernanceManifestIdentity.namespace,
  manifestPublicSurfaceOnly: true as const,
  manifestInternalImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil5PhaseImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-5:6 → EIL-5:5 IntegrationPolicyGovernanceManifestPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "manifestIdentity",
  "composition",
  "inventory",
  "guarantees",
  "compatibility",
  "collections",
  "summary",
  "readiness",
  "status",
  "sources",
] as const);

/**
 * Canonical immutable Integration Policy & Governance Platform aggregate.
 * Sole entry point for Certification, Freeze, and Public Index consumers.
 */
export const IntegrationPolicyGovernancePlatform = Object.freeze({
  identity: IntegrationPolicyGovernancePlatformIdentity,
  dependency,
  manifestIdentity: IntegrationPolicyGovernanceManifestIdentity,
  composition: IntegrationPolicyGovernancePlatformComposition,
  inventory: IntegrationPolicyGovernancePlatformInventory,
  guarantees: IntegrationPolicyGovernancePlatformGuarantees,
  compatibility: IntegrationPolicyGovernancePlatformCompatibility,
  collections: IntegrationPolicyGovernancePlatformCollections,
  summary: IntegrationPolicyGovernancePlatformSummary,
  readiness,
  status: IntegrationPolicyGovernancePlatformStatusValue,
  sources: Object.freeze({
    manifestId: IntegrationPolicyGovernanceManifestIdentity.canonicalId,
    manifestEntryPoint: "integrationPolicyGovernanceManifest.ts" as const,
    manifestNamespace: IntegrationPolicyGovernanceManifestIdentity.namespace,
    manifestSummary: IntegrationPolicyGovernanceManifestSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-5:7 — Integration Policy & Governance Certification",
  manifestPlatform: IntegrationPolicyGovernanceManifestPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
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
