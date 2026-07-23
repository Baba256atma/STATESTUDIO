/**
 * EIL-1:8 — Integration Freeze.
 *
 * Canonical immutable freeze architecture for the certified EIL-1 Platform.
 * Consumes only the EIL-1:7 Integration Certification aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by EIL-1:8.
 *
 * Public exports (exactly 8):
 *   IntegrationFreezeIdentity
 *   IntegrationFreezeLocks
 *   IntegrationFreezeBaselines
 *   IntegrationFreezeCompatibility
 *   IntegrationFreezeExtensions
 *   IntegrationFreezeCollections
 *   IntegrationFreezeSummary
 *   IntegrationFreezePlatform
 */

import { IntegrationFreezeBaselines } from "./integrationFreezeBaselines.ts";
import { IntegrationFreezeCompatibility } from "./integrationFreezeCompatibility.ts";
import { IntegrationFreezeExtensions } from "./integrationFreezeExtensions.ts";
import {
  IntegrationFreezeDependencies,
  IntegrationFreezeIdentity,
  IntegrationFreezeReadinessState,
  IntegrationFreezeStatus,
} from "./integrationFreezeIdentity.ts";
import {
  IntegrationFreezeCanonicalPlatformLock,
  IntegrationFreezeLocks,
} from "./integrationFreezeLocks.ts";
import type {
  IntegrationFreezeCollectionsDescriptor,
  IntegrationFreezeInventory,
  IntegrationFreezeSummaryDescriptor,
} from "./integrationFreezeTypes.ts";
import {
  IntegrationCertificationIdentity,
  IntegrationCertificationPlatform,
  IntegrationCertificationSummary,
} from "./integrationCertification.ts";

export { IntegrationFreezeIdentity } from "./integrationFreezeIdentity.ts";
export { IntegrationFreezeLocks } from "./integrationFreezeLocks.ts";
export { IntegrationFreezeBaselines } from "./integrationFreezeBaselines.ts";
export { IntegrationFreezeCompatibility } from "./integrationFreezeCompatibility.ts";
export { IntegrationFreezeExtensions } from "./integrationFreezeExtensions.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from freeze arrays.
 */
export const IntegrationFreezeCollections: IntegrationFreezeCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-1:8/Collections",
    sourcePhase: "EIL-1:8" as const,
    locks: IntegrationFreezeLocks,
    baselines: IntegrationFreezeBaselines,
    compatibility: IntegrationFreezeCompatibility,
    extensions: IntegrationFreezeExtensions,
    lockCount: IntegrationFreezeLocks.length,
    baselineCount: IntegrationFreezeBaselines.length,
    compatibilityCount: IntegrationFreezeCompatibility.length,
    extensionCount: IntegrationFreezeExtensions.length,
    totalFreezeEntryCount:
      IntegrationFreezeLocks.length +
      IntegrationFreezeBaselines.length +
      IntegrationFreezeCompatibility.length +
      IntegrationFreezeExtensions.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationFreezeInventory = Object.freeze({
  inventoryId: "EIL-1:8/Inventory",
  lockCount: IntegrationFreezeCollections.lockCount,
  baselineCount: IntegrationFreezeCollections.baselineCount,
  compatibilityCount: IntegrationFreezeCollections.compatibilityCount,
  extensionCount: IntegrationFreezeCollections.extensionCount,
  canonicalPlatformLockCount: 1 as const,
  totalFreezeEntryCount: IntegrationFreezeCollections.totalFreezeEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Freeze summary.
 */
export const IntegrationFreezeSummary: IntegrationFreezeSummaryDescriptor =
  Object.freeze({
    freezeId: "EIL-1:8/IntegrationFreeze",
    version: "1.0.0",
    name: "Integration Freeze",
    namespace: "nexora.eil.integration.freeze",
    status: IntegrationFreezeStatus,
    readiness: IntegrationFreezeReadinessState,
    certificationId: "EIL-1:7/IntegrationCertification",
    canonicalPlatformLockKey: "EIL-1-INTEGRATION-LOCKED",
    lockCount: IntegrationFreezeCollections.lockCount,
    baselineCount: IntegrationFreezeCollections.baselineCount,
    compatibilityCount: IntegrationFreezeCollections.compatibilityCount,
    extensionCount: IntegrationFreezeCollections.extensionCount,
    totalFreezeEntryCount: IntegrationFreezeCollections.totalFreezeEntryCount,
    nextPhase: "EIL-1:9 — Integration Public Index",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-1:8/Dependency/EIL17Certification",
  phaseDependencies: IntegrationFreezeDependencies,
  phaseDependencyCount: IntegrationFreezeDependencies.length,
  directPreviousPhaseModule: "integrationCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: IntegrationCertificationIdentity.canonicalId,
  certificationVersion: IntegrationCertificationIdentity.version,
  certificationNamespace: IntegrationCertificationIdentity.namespace,
  certificationPublicSurfaceOnly: true as const,
  certificationInternalImport: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEilPhaseImport: false as const,
  reconstructsCertification: false as const,
  duplicatesCertificationValues: false as const,
  canonicalPath:
    "EIL-1:8 → EIL-1:7 IntegrationCertificationPlatform (exclusive)",
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
 * Canonical immutable Integration Freeze platform.
 * Sole entry point for Public Index consumers.
 */
export const IntegrationFreezePlatform = Object.freeze({
  identity: IntegrationFreezeIdentity,
  dependency,
  certificationIdentity: IntegrationCertificationIdentity,
  canonicalPlatformLock: IntegrationFreezeCanonicalPlatformLock,
  locks: IntegrationFreezeLocks,
  baselines: IntegrationFreezeBaselines,
  compatibility: IntegrationFreezeCompatibility,
  extensions: IntegrationFreezeExtensions,
  collections: IntegrationFreezeCollections,
  inventory,
  summary: IntegrationFreezeSummary,
  status: IntegrationFreezeStatus,
  readiness: IntegrationFreezeReadinessState,
  sources: Object.freeze({
    certificationId: IntegrationCertificationIdentity.canonicalId,
    certificationEntryPoint: "integrationCertification.ts" as const,
    certificationNamespace: IntegrationCertificationIdentity.namespace,
    certificationSummary: IntegrationCertificationSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-1:9 — Integration Public Index",
  certificationPlatform: IntegrationCertificationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreeze: false as const,
  lockEnforcement: false as const,
  certificationExecution: false as const,
  routingEngine: false as const,
  orchestrationEngine: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  eventBus: false as const,
  queueBehavior: false as const,
  connectorBehavior: false as const,
  adapterBehavior: false as const,
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
