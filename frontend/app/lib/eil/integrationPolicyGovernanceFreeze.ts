/**
 * EIL-5:8 — Integration Policy & Governance Freeze.
 *
 * Canonical immutable freeze architecture for the certified EIL-5 Governance Platform.
 * Consumes only the EIL-5:7 Integration Policy & Governance Certification aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by EIL-5:8.
 *
 * Public exports (exactly 8):
 *   IntegrationPolicyGovernanceFreezeIdentity
 *   IntegrationPolicyGovernanceFreezeLocks
 *   IntegrationPolicyGovernanceFreezeBaselines
 *   IntegrationPolicyGovernanceFreezeCompatibility
 *   IntegrationPolicyGovernanceFreezeExtensions
 *   IntegrationPolicyGovernanceFreezeCollections
 *   IntegrationPolicyGovernanceFreezeSummary
 *   IntegrationPolicyGovernanceFreezePlatform
 */

import { IntegrationPolicyGovernanceFreezeBaselines } from "./integrationPolicyGovernanceFreezeBaselines.ts";
import { IntegrationPolicyGovernanceFreezeCompatibility } from "./integrationPolicyGovernanceFreezeCompatibility.ts";
import { IntegrationPolicyGovernanceFreezeExtensions } from "./integrationPolicyGovernanceFreezeExtensions.ts";
import {
  IntegrationPolicyGovernanceFreezeDependencies,
  IntegrationPolicyGovernanceFreezeIdentity,
  IntegrationPolicyGovernanceFreezeReadinessStateValue,
  IntegrationPolicyGovernanceFreezeStatusValue,
} from "./integrationPolicyGovernanceFreezeIdentity.ts";
import {
  IntegrationPolicyGovernanceFreezeCanonicalPlatformLock,
  IntegrationPolicyGovernanceFreezeLocks,
} from "./integrationPolicyGovernanceFreezeLocks.ts";
import type {
  IntegrationPolicyGovernanceFreezeCollections as PolicyGovernanceFreezeCollectionsDescriptor,
  IntegrationPolicyGovernanceFreezeInventory as PolicyGovernanceFreezeInventoryDescriptor,
  IntegrationPolicyGovernanceFreezeSummary as PolicyGovernanceFreezeSummaryDescriptor,
} from "./integrationPolicyGovernanceFreezeTypes.ts";
import {
  IntegrationPolicyGovernanceCertificationIdentity,
  IntegrationPolicyGovernanceCertificationPlatform,
  IntegrationPolicyGovernanceCertificationSummary,
} from "./integrationPolicyGovernanceCertification.ts";

export { IntegrationPolicyGovernanceFreezeIdentity } from "./integrationPolicyGovernanceFreezeIdentity.ts";
export { IntegrationPolicyGovernanceFreezeLocks } from "./integrationPolicyGovernanceFreezeLocks.ts";
export { IntegrationPolicyGovernanceFreezeBaselines } from "./integrationPolicyGovernanceFreezeBaselines.ts";
export { IntegrationPolicyGovernanceFreezeCompatibility } from "./integrationPolicyGovernanceFreezeCompatibility.ts";
export { IntegrationPolicyGovernanceFreezeExtensions } from "./integrationPolicyGovernanceFreezeExtensions.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from freeze arrays.
 */
export const IntegrationPolicyGovernanceFreezeCollections: PolicyGovernanceFreezeCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-5:8/Collections",
    sourcePhase: "EIL-5:8" as const,
    locks: IntegrationPolicyGovernanceFreezeLocks,
    baselines: IntegrationPolicyGovernanceFreezeBaselines,
    compatibility: IntegrationPolicyGovernanceFreezeCompatibility,
    extensions: IntegrationPolicyGovernanceFreezeExtensions,
    lockCount: IntegrationPolicyGovernanceFreezeLocks.length,
    baselineCount: IntegrationPolicyGovernanceFreezeBaselines.length,
    compatibilityCount:
      IntegrationPolicyGovernanceFreezeCompatibility.length,
    extensionCount: IntegrationPolicyGovernanceFreezeExtensions.length,
    totalFreezeEntryCount:
      IntegrationPolicyGovernanceFreezeLocks.length +
      IntegrationPolicyGovernanceFreezeBaselines.length +
      IntegrationPolicyGovernanceFreezeCompatibility.length +
      IntegrationPolicyGovernanceFreezeExtensions.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: PolicyGovernanceFreezeInventoryDescriptor = Object.freeze({
  inventoryId: "EIL-5:8/Inventory",
  lockCount: IntegrationPolicyGovernanceFreezeCollections.lockCount,
  baselineCount: IntegrationPolicyGovernanceFreezeCollections.baselineCount,
  compatibilityCount:
    IntegrationPolicyGovernanceFreezeCollections.compatibilityCount,
  extensionCount: IntegrationPolicyGovernanceFreezeCollections.extensionCount,
  canonicalPlatformLockCount: 1 as const,
  totalFreezeEntryCount:
    IntegrationPolicyGovernanceFreezeCollections.totalFreezeEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Policy & Governance Freeze summary.
 */
export const IntegrationPolicyGovernanceFreezeSummary: PolicyGovernanceFreezeSummaryDescriptor =
  Object.freeze({
    freezeId: "EIL-5:8/IntegrationPolicyGovernanceFreeze",
    version: "1.0.0",
    name: "Integration Policy & Governance Freeze",
    namespace: "nexora.eil.integration-policy-governance.freeze",
    status: IntegrationPolicyGovernanceFreezeStatusValue,
    readiness: IntegrationPolicyGovernanceFreezeReadinessStateValue,
    certificationId: "EIL-5:7/IntegrationPolicyGovernanceCertification",
    canonicalPlatformLockKey: "EIL-5-INTEGRATION-POLICY-GOVERNANCE-LOCKED",
    lockCount: IntegrationPolicyGovernanceFreezeCollections.lockCount,
    baselineCount: IntegrationPolicyGovernanceFreezeCollections.baselineCount,
    compatibilityCount:
      IntegrationPolicyGovernanceFreezeCollections.compatibilityCount,
    extensionCount:
      IntegrationPolicyGovernanceFreezeCollections.extensionCount,
    totalFreezeEntryCount:
      IntegrationPolicyGovernanceFreezeCollections.totalFreezeEntryCount,
    nextPhase: "EIL-5:9 — Integration Policy & Governance Public Index",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-5:8/Dependency/EIL57Certification",
  phaseDependencies: IntegrationPolicyGovernanceFreezeDependencies,
  phaseDependencyCount:
    IntegrationPolicyGovernanceFreezeDependencies.length,
  directPreviousPhaseModule:
    "integrationPolicyGovernanceCertification.ts" as const,
  certificationOnly: true as const,
  certificationId:
    IntegrationPolicyGovernanceCertificationIdentity.canonicalId,
  certificationVersion:
    IntegrationPolicyGovernanceCertificationIdentity.version,
  certificationNamespace:
    IntegrationPolicyGovernanceCertificationIdentity.namespace,
  certificationPublicSurfaceOnly: true as const,
  certificationInternalImport: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil5PhaseImport: false as const,
  reconstructsCertification: false as const,
  duplicatesCertificationValues: false as const,
  canonicalPath:
    "EIL-5:8 → EIL-5:7 IntegrationPolicyGovernanceCertificationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "certificationIdentity",
  "canonicalPlatformLock",
  "locks",
  "baselines",
  "compatibility",
  "extensions",
  "collections",
  "inventory",
  "summary",
  "status",
] as const);

/**
 * Canonical immutable Integration Policy & Governance Freeze platform.
 * Sole entry point for Public Index consumers.
 */
export const IntegrationPolicyGovernanceFreezePlatform = Object.freeze({
  identity: IntegrationPolicyGovernanceFreezeIdentity,
  dependency,
  certificationIdentity: IntegrationPolicyGovernanceCertificationIdentity,
  canonicalPlatformLock:
    IntegrationPolicyGovernanceFreezeCanonicalPlatformLock,
  locks: IntegrationPolicyGovernanceFreezeLocks,
  baselines: IntegrationPolicyGovernanceFreezeBaselines,
  compatibility: IntegrationPolicyGovernanceFreezeCompatibility,
  extensions: IntegrationPolicyGovernanceFreezeExtensions,
  collections: IntegrationPolicyGovernanceFreezeCollections,
  inventory,
  summary: IntegrationPolicyGovernanceFreezeSummary,
  status: IntegrationPolicyGovernanceFreezeStatusValue,
  readiness: IntegrationPolicyGovernanceFreezeReadinessStateValue,
  sources: Object.freeze({
    certificationId:
      IntegrationPolicyGovernanceCertificationIdentity.canonicalId,
    certificationEntryPoint:
      "integrationPolicyGovernanceCertification.ts" as const,
    certificationNamespace:
      IntegrationPolicyGovernanceCertificationIdentity.namespace,
    certificationSummary: IntegrationPolicyGovernanceCertificationSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-5:9 — Integration Policy & Governance Public Index",
  certificationPlatform: IntegrationPolicyGovernanceCertificationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreeze: false as const,
  lockEnforcement: false as const,
  certificationExecution: false as const,
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
