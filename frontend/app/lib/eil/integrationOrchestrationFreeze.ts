/**
 * EIL-4:8 — Integration Orchestration Freeze.
 *
 * Canonical immutable freeze architecture for the certified EIL-4 Orchestration Platform.
 * Consumes only the EIL-4:7 Integration Orchestration Certification aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by EIL-4:8.
 *
 * Public exports (exactly 8):
 *   IntegrationOrchestrationFreezeIdentity
 *   IntegrationOrchestrationFreezeLocks
 *   IntegrationOrchestrationFreezeBaselines
 *   IntegrationOrchestrationFreezeCompatibility
 *   IntegrationOrchestrationFreezeExtensions
 *   IntegrationOrchestrationFreezeCollections
 *   IntegrationOrchestrationFreezeSummary
 *   IntegrationOrchestrationFreezePlatform
 */

import { IntegrationOrchestrationFreezeBaselines } from "./integrationOrchestrationFreezeBaselines.ts";
import { IntegrationOrchestrationFreezeCompatibility } from "./integrationOrchestrationFreezeCompatibility.ts";
import { IntegrationOrchestrationFreezeExtensions } from "./integrationOrchestrationFreezeExtensions.ts";
import {
  IntegrationOrchestrationFreezeDependencies,
  IntegrationOrchestrationFreezeIdentity,
  IntegrationOrchestrationFreezeReadinessStateValue,
  IntegrationOrchestrationFreezeStatusValue,
} from "./integrationOrchestrationFreezeIdentity.ts";
import {
  IntegrationOrchestrationFreezeCanonicalPlatformLock,
  IntegrationOrchestrationFreezeLocks,
} from "./integrationOrchestrationFreezeLocks.ts";
import type {
  IntegrationOrchestrationFreezeCollections as OrchestrationFreezeCollectionsDescriptor,
  IntegrationOrchestrationFreezeInventory as OrchestrationFreezeInventoryDescriptor,
  IntegrationOrchestrationFreezeSummary as OrchestrationFreezeSummaryDescriptor,
} from "./integrationOrchestrationFreezeTypes.ts";
import {
  IntegrationOrchestrationCertificationIdentity,
  IntegrationOrchestrationCertificationPlatform,
  IntegrationOrchestrationCertificationSummary,
} from "./integrationOrchestrationCertification.ts";

export { IntegrationOrchestrationFreezeIdentity } from "./integrationOrchestrationFreezeIdentity.ts";
export { IntegrationOrchestrationFreezeLocks } from "./integrationOrchestrationFreezeLocks.ts";
export { IntegrationOrchestrationFreezeBaselines } from "./integrationOrchestrationFreezeBaselines.ts";
export { IntegrationOrchestrationFreezeCompatibility } from "./integrationOrchestrationFreezeCompatibility.ts";
export { IntegrationOrchestrationFreezeExtensions } from "./integrationOrchestrationFreezeExtensions.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from freeze arrays.
 */
export const IntegrationOrchestrationFreezeCollections: OrchestrationFreezeCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-4:8/Collections",
    sourcePhase: "EIL-4:8" as const,
    locks: IntegrationOrchestrationFreezeLocks,
    baselines: IntegrationOrchestrationFreezeBaselines,
    compatibility: IntegrationOrchestrationFreezeCompatibility,
    extensions: IntegrationOrchestrationFreezeExtensions,
    lockCount: IntegrationOrchestrationFreezeLocks.length,
    baselineCount: IntegrationOrchestrationFreezeBaselines.length,
    compatibilityCount: IntegrationOrchestrationFreezeCompatibility.length,
    extensionCount: IntegrationOrchestrationFreezeExtensions.length,
    totalFreezeEntryCount:
      IntegrationOrchestrationFreezeLocks.length +
      IntegrationOrchestrationFreezeBaselines.length +
      IntegrationOrchestrationFreezeCompatibility.length +
      IntegrationOrchestrationFreezeExtensions.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: OrchestrationFreezeInventoryDescriptor = Object.freeze({
  inventoryId: "EIL-4:8/Inventory",
  lockCount: IntegrationOrchestrationFreezeCollections.lockCount,
  baselineCount: IntegrationOrchestrationFreezeCollections.baselineCount,
  compatibilityCount:
    IntegrationOrchestrationFreezeCollections.compatibilityCount,
  extensionCount: IntegrationOrchestrationFreezeCollections.extensionCount,
  canonicalPlatformLockCount: 1 as const,
  totalFreezeEntryCount:
    IntegrationOrchestrationFreezeCollections.totalFreezeEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Orchestration Freeze summary.
 */
export const IntegrationOrchestrationFreezeSummary: OrchestrationFreezeSummaryDescriptor =
  Object.freeze({
    freezeId: "EIL-4:8/IntegrationOrchestrationFreeze",
    version: "1.0.0",
    name: "Integration Orchestration Freeze",
    namespace: "nexora.eil.integration-orchestration.freeze",
    status: IntegrationOrchestrationFreezeStatusValue,
    readiness: IntegrationOrchestrationFreezeReadinessStateValue,
    certificationId: "EIL-4:7/IntegrationOrchestrationCertification",
    canonicalPlatformLockKey: "EIL-4-INTEGRATION-ORCHESTRATION-LOCKED",
    lockCount: IntegrationOrchestrationFreezeCollections.lockCount,
    baselineCount: IntegrationOrchestrationFreezeCollections.baselineCount,
    compatibilityCount:
      IntegrationOrchestrationFreezeCollections.compatibilityCount,
    extensionCount: IntegrationOrchestrationFreezeCollections.extensionCount,
    totalFreezeEntryCount:
      IntegrationOrchestrationFreezeCollections.totalFreezeEntryCount,
    nextPhase: "EIL-4:9 — Integration Orchestration Public Index",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-4:8/Dependency/EIL47Certification",
  phaseDependencies: IntegrationOrchestrationFreezeDependencies,
  phaseDependencyCount: IntegrationOrchestrationFreezeDependencies.length,
  directPreviousPhaseModule:
    "integrationOrchestrationCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: IntegrationOrchestrationCertificationIdentity.canonicalId,
  certificationVersion: IntegrationOrchestrationCertificationIdentity.version,
  certificationNamespace:
    IntegrationOrchestrationCertificationIdentity.namespace,
  certificationPublicSurfaceOnly: true as const,
  certificationInternalImport: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil4PhaseImport: false as const,
  reconstructsCertification: false as const,
  duplicatesCertificationValues: false as const,
  canonicalPath:
    "EIL-4:8 → EIL-4:7 IntegrationOrchestrationCertificationPlatform (exclusive)",
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
 * Canonical immutable Integration Orchestration Freeze platform.
 * Sole entry point for Public Index consumers.
 */
export const IntegrationOrchestrationFreezePlatform = Object.freeze({
  identity: IntegrationOrchestrationFreezeIdentity,
  dependency,
  certificationIdentity: IntegrationOrchestrationCertificationIdentity,
  canonicalPlatformLock: IntegrationOrchestrationFreezeCanonicalPlatformLock,
  locks: IntegrationOrchestrationFreezeLocks,
  baselines: IntegrationOrchestrationFreezeBaselines,
  compatibility: IntegrationOrchestrationFreezeCompatibility,
  extensions: IntegrationOrchestrationFreezeExtensions,
  collections: IntegrationOrchestrationFreezeCollections,
  inventory,
  summary: IntegrationOrchestrationFreezeSummary,
  status: IntegrationOrchestrationFreezeStatusValue,
  readiness: IntegrationOrchestrationFreezeReadinessStateValue,
  sources: Object.freeze({
    certificationId: IntegrationOrchestrationCertificationIdentity.canonicalId,
    certificationEntryPoint:
      "integrationOrchestrationCertification.ts" as const,
    certificationNamespace:
      IntegrationOrchestrationCertificationIdentity.namespace,
    certificationSummary: IntegrationOrchestrationCertificationSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-4:9 — Integration Orchestration Public Index",
  certificationPlatform: IntegrationOrchestrationCertificationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreeze: false as const,
  lockEnforcement: false as const,
  certificationExecution: false as const,
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
