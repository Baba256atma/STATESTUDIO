/**
 * EIL-2:8 — Integration Connector Freeze.
 *
 * Canonical immutable freeze architecture for the certified EIL-2 Connector Platform.
 * Consumes only the EIL-2:7 Integration Connector Certification aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by EIL-2:8.
 *
 * Public exports (exactly 8):
 *   IntegrationConnectorFreezeIdentity
 *   IntegrationConnectorFreezeLocks
 *   IntegrationConnectorFreezeBaselines
 *   IntegrationConnectorFreezeCompatibility
 *   IntegrationConnectorFreezeExtensions
 *   IntegrationConnectorFreezeCollections
 *   IntegrationConnectorFreezeSummary
 *   IntegrationConnectorFreezePlatform
 */

import { IntegrationConnectorFreezeBaselines } from "./integrationConnectorFreezeBaselines.ts";
import { IntegrationConnectorFreezeCompatibility } from "./integrationConnectorFreezeCompatibility.ts";
import { IntegrationConnectorFreezeExtensions } from "./integrationConnectorFreezeExtensions.ts";
import {
  IntegrationConnectorFreezeDependencies,
  IntegrationConnectorFreezeIdentity,
  IntegrationConnectorFreezeReadinessState,
  IntegrationConnectorFreezeStatus,
} from "./integrationConnectorFreezeIdentity.ts";
import {
  IntegrationConnectorFreezeCanonicalPlatformLock,
  IntegrationConnectorFreezeLocks,
} from "./integrationConnectorFreezeLocks.ts";
import type {
  IntegrationConnectorFreezeCollectionsDescriptor,
  IntegrationConnectorFreezeInventory,
  IntegrationConnectorFreezeSummaryDescriptor,
} from "./integrationConnectorFreezeTypes.ts";
import {
  IntegrationConnectorCertificationIdentity,
  IntegrationConnectorCertificationPlatform,
  IntegrationConnectorCertificationSummary,
} from "./integrationConnectorCertification.ts";

export { IntegrationConnectorFreezeIdentity } from "./integrationConnectorFreezeIdentity.ts";
export { IntegrationConnectorFreezeLocks } from "./integrationConnectorFreezeLocks.ts";
export { IntegrationConnectorFreezeBaselines } from "./integrationConnectorFreezeBaselines.ts";
export { IntegrationConnectorFreezeCompatibility } from "./integrationConnectorFreezeCompatibility.ts";
export { IntegrationConnectorFreezeExtensions } from "./integrationConnectorFreezeExtensions.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from freeze arrays.
 */
export const IntegrationConnectorFreezeCollections: IntegrationConnectorFreezeCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-2:8/Collections",
    sourcePhase: "EIL-2:8" as const,
    locks: IntegrationConnectorFreezeLocks,
    baselines: IntegrationConnectorFreezeBaselines,
    compatibility: IntegrationConnectorFreezeCompatibility,
    extensions: IntegrationConnectorFreezeExtensions,
    lockCount: IntegrationConnectorFreezeLocks.length,
    baselineCount: IntegrationConnectorFreezeBaselines.length,
    compatibilityCount: IntegrationConnectorFreezeCompatibility.length,
    extensionCount: IntegrationConnectorFreezeExtensions.length,
    totalFreezeEntryCount:
      IntegrationConnectorFreezeLocks.length +
      IntegrationConnectorFreezeBaselines.length +
      IntegrationConnectorFreezeCompatibility.length +
      IntegrationConnectorFreezeExtensions.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: IntegrationConnectorFreezeInventory = Object.freeze({
  inventoryId: "EIL-2:8/Inventory",
  lockCount: IntegrationConnectorFreezeCollections.lockCount,
  baselineCount: IntegrationConnectorFreezeCollections.baselineCount,
  compatibilityCount: IntegrationConnectorFreezeCollections.compatibilityCount,
  extensionCount: IntegrationConnectorFreezeCollections.extensionCount,
  canonicalPlatformLockCount: 1 as const,
  totalFreezeEntryCount:
    IntegrationConnectorFreezeCollections.totalFreezeEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Connector Freeze summary.
 */
export const IntegrationConnectorFreezeSummary: IntegrationConnectorFreezeSummaryDescriptor =
  Object.freeze({
    freezeId: "EIL-2:8/IntegrationConnectorFreeze",
    version: "1.0.0",
    name: "Integration Connector Freeze",
    namespace: "nexora.eil.integration-connector.freeze",
    status: IntegrationConnectorFreezeStatus,
    readiness: IntegrationConnectorFreezeReadinessState,
    certificationId: "EIL-2:7/IntegrationConnectorCertification",
    canonicalPlatformLockKey: "EIL-2-INTEGRATION-CONNECTOR-LOCKED",
    lockCount: IntegrationConnectorFreezeCollections.lockCount,
    baselineCount: IntegrationConnectorFreezeCollections.baselineCount,
    compatibilityCount:
      IntegrationConnectorFreezeCollections.compatibilityCount,
    extensionCount: IntegrationConnectorFreezeCollections.extensionCount,
    totalFreezeEntryCount:
      IntegrationConnectorFreezeCollections.totalFreezeEntryCount,
    nextPhase: "EIL-2:9 — Integration Connector Public Index",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-2:8/Dependency/EIL27Certification",
  phaseDependencies: IntegrationConnectorFreezeDependencies,
  phaseDependencyCount: IntegrationConnectorFreezeDependencies.length,
  directPreviousPhaseModule: "integrationConnectorCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: IntegrationConnectorCertificationIdentity.canonicalId,
  certificationVersion: IntegrationConnectorCertificationIdentity.version,
  certificationNamespace: IntegrationConnectorCertificationIdentity.namespace,
  certificationPublicSurfaceOnly: true as const,
  certificationInternalImport: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  eil1Dependency: false as const,
  laterEil2PhaseImport: false as const,
  reconstructsCertification: false as const,
  duplicatesCertificationValues: false as const,
  canonicalPath:
    "EIL-2:8 → EIL-2:7 IntegrationConnectorCertificationPlatform (exclusive)",
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
 * Canonical immutable Integration Connector Freeze platform.
 * Sole entry point for Public Index consumers.
 */
export const IntegrationConnectorFreezePlatform = Object.freeze({
  identity: IntegrationConnectorFreezeIdentity,
  dependency,
  certificationIdentity: IntegrationConnectorCertificationIdentity,
  canonicalPlatformLock: IntegrationConnectorFreezeCanonicalPlatformLock,
  locks: IntegrationConnectorFreezeLocks,
  baselines: IntegrationConnectorFreezeBaselines,
  compatibility: IntegrationConnectorFreezeCompatibility,
  extensions: IntegrationConnectorFreezeExtensions,
  collections: IntegrationConnectorFreezeCollections,
  inventory,
  summary: IntegrationConnectorFreezeSummary,
  status: IntegrationConnectorFreezeStatus,
  readiness: IntegrationConnectorFreezeReadinessState,
  sources: Object.freeze({
    certificationId: IntegrationConnectorCertificationIdentity.canonicalId,
    certificationEntryPoint: "integrationConnectorCertification.ts" as const,
    certificationNamespace: IntegrationConnectorCertificationIdentity.namespace,
    certificationSummary: IntegrationConnectorCertificationSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-2:9 — Integration Connector Public Index",
  certificationPlatform: IntegrationConnectorCertificationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreeze: false as const,
  lockEnforcement: false as const,
  certificationExecution: false as const,
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
