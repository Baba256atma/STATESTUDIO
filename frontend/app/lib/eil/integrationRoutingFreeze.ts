/**
 * EIL-3:8 — Integration Routing Freeze.
 *
 * Canonical immutable freeze architecture for the certified EIL-3 Routing Platform.
 * Consumes only the EIL-3:7 Integration Routing Certification aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by EIL-3:8.
 *
 * Public exports (exactly 8):
 *   IntegrationRoutingFreezeIdentity
 *   IntegrationRoutingFreezeLocks
 *   IntegrationRoutingFreezeBaselines
 *   IntegrationRoutingFreezeCompatibility
 *   IntegrationRoutingFreezeExtensions
 *   IntegrationRoutingFreezeCollections
 *   IntegrationRoutingFreezeSummary
 *   IntegrationRoutingFreezePlatform
 */

import { IntegrationRoutingFreezeBaselines } from "./integrationRoutingFreezeBaselines.ts";
import { IntegrationRoutingFreezeCompatibility } from "./integrationRoutingFreezeCompatibility.ts";
import { IntegrationRoutingFreezeExtensions } from "./integrationRoutingFreezeExtensions.ts";
import {
  IntegrationRoutingFreezeDependencies,
  IntegrationRoutingFreezeIdentity,
  IntegrationRoutingFreezeReadinessStateValue,
  IntegrationRoutingFreezeStatusValue,
} from "./integrationRoutingFreezeIdentity.ts";
import {
  IntegrationRoutingFreezeCanonicalPlatformLock,
  IntegrationRoutingFreezeLocks,
} from "./integrationRoutingFreezeLocks.ts";
import type {
  RoutingFreezeCollections,
  RoutingFreezeInventory,
  RoutingFreezeSummary,
} from "./integrationRoutingFreezeTypes.ts";
import {
  IntegrationRoutingCertificationIdentity,
  IntegrationRoutingCertificationPlatform,
  IntegrationRoutingCertificationSummary,
} from "./integrationRoutingCertification.ts";

export { IntegrationRoutingFreezeIdentity } from "./integrationRoutingFreezeIdentity.ts";
export { IntegrationRoutingFreezeLocks } from "./integrationRoutingFreezeLocks.ts";
export { IntegrationRoutingFreezeBaselines } from "./integrationRoutingFreezeBaselines.ts";
export { IntegrationRoutingFreezeCompatibility } from "./integrationRoutingFreezeCompatibility.ts";
export { IntegrationRoutingFreezeExtensions } from "./integrationRoutingFreezeExtensions.ts";

/**
 * Canonical collections aggregate.
 * Counts are derived exclusively from freeze arrays.
 */
export const IntegrationRoutingFreezeCollections: RoutingFreezeCollections =
  Object.freeze({
    collectionsId: "EIL-3:8/Collections",
    sourcePhase: "EIL-3:8" as const,
    locks: IntegrationRoutingFreezeLocks,
    baselines: IntegrationRoutingFreezeBaselines,
    compatibility: IntegrationRoutingFreezeCompatibility,
    extensions: IntegrationRoutingFreezeExtensions,
    lockCount: IntegrationRoutingFreezeLocks.length,
    baselineCount: IntegrationRoutingFreezeBaselines.length,
    compatibilityCount: IntegrationRoutingFreezeCompatibility.length,
    extensionCount: IntegrationRoutingFreezeExtensions.length,
    totalFreezeEntryCount:
      IntegrationRoutingFreezeLocks.length +
      IntegrationRoutingFreezeBaselines.length +
      IntegrationRoutingFreezeCompatibility.length +
      IntegrationRoutingFreezeExtensions.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const inventory: RoutingFreezeInventory = Object.freeze({
  inventoryId: "EIL-3:8/Inventory",
  lockCount: IntegrationRoutingFreezeCollections.lockCount,
  baselineCount: IntegrationRoutingFreezeCollections.baselineCount,
  compatibilityCount: IntegrationRoutingFreezeCollections.compatibilityCount,
  extensionCount: IntegrationRoutingFreezeCollections.extensionCount,
  canonicalPlatformLockCount: 1 as const,
  totalFreezeEntryCount:
    IntegrationRoutingFreezeCollections.totalFreezeEntryCount,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Integration Routing Freeze summary.
 */
export const IntegrationRoutingFreezeSummary: RoutingFreezeSummary =
  Object.freeze({
    freezeId: "EIL-3:8/IntegrationRoutingFreeze",
    version: "1.0.0",
    name: "Integration Routing Freeze",
    namespace: "nexora.eil.integration-routing.freeze",
    status: IntegrationRoutingFreezeStatusValue,
    readiness: IntegrationRoutingFreezeReadinessStateValue,
    certificationId: "EIL-3:7/IntegrationRoutingCertification",
    canonicalPlatformLockKey: "EIL-3-INTEGRATION-ROUTING-LOCKED",
    lockCount: IntegrationRoutingFreezeCollections.lockCount,
    baselineCount: IntegrationRoutingFreezeCollections.baselineCount,
    compatibilityCount: IntegrationRoutingFreezeCollections.compatibilityCount,
    extensionCount: IntegrationRoutingFreezeCollections.extensionCount,
    totalFreezeEntryCount:
      IntegrationRoutingFreezeCollections.totalFreezeEntryCount,
    nextPhase: "EIL-3:9 — Integration Routing Public Index",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-3:8/Dependency/EIL37Certification",
  phaseDependencies: IntegrationRoutingFreezeDependencies,
  phaseDependencyCount: IntegrationRoutingFreezeDependencies.length,
  directPreviousPhaseModule: "integrationRoutingCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: IntegrationRoutingCertificationIdentity.canonicalId,
  certificationVersion: IntegrationRoutingCertificationIdentity.version,
  certificationNamespace: IntegrationRoutingCertificationIdentity.namespace,
  certificationPublicSurfaceOnly: true as const,
  certificationInternalImport: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil3PhaseImport: false as const,
  reconstructsCertification: false as const,
  duplicatesCertificationValues: false as const,
  canonicalPath:
    "EIL-3:8 → EIL-3:7 IntegrationRoutingCertificationPlatform (exclusive)",
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
 * Canonical immutable Integration Routing Freeze platform.
 * Sole entry point for Public Index consumers.
 */
export const IntegrationRoutingFreezePlatform = Object.freeze({
  identity: IntegrationRoutingFreezeIdentity,
  dependency,
  certificationIdentity: IntegrationRoutingCertificationIdentity,
  canonicalPlatformLock: IntegrationRoutingFreezeCanonicalPlatformLock,
  locks: IntegrationRoutingFreezeLocks,
  baselines: IntegrationRoutingFreezeBaselines,
  compatibility: IntegrationRoutingFreezeCompatibility,
  extensions: IntegrationRoutingFreezeExtensions,
  collections: IntegrationRoutingFreezeCollections,
  inventory,
  summary: IntegrationRoutingFreezeSummary,
  status: IntegrationRoutingFreezeStatusValue,
  readiness: IntegrationRoutingFreezeReadinessStateValue,
  sources: Object.freeze({
    certificationId: IntegrationRoutingCertificationIdentity.canonicalId,
    certificationEntryPoint: "integrationRoutingCertification.ts" as const,
    certificationNamespace: IntegrationRoutingCertificationIdentity.namespace,
    certificationSummary: IntegrationRoutingCertificationSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-3:9 — Integration Routing Public Index",
  certificationPlatform: IntegrationRoutingCertificationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreeze: false as const,
  lockEnforcement: false as const,
  certificationExecution: false as const,
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
