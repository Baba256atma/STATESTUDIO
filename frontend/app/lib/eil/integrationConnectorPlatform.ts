/**
 * EIL-2:6 — Integration Connector Platform.
 *
 * Canonical immutable composition surface for the complete EIL-2 connector platform.
 * Consumes only the EIL-2:5 Integration Connector Manifest aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by EIL-2:6.
 *
 * Public exports (exactly 8):
 *   IntegrationConnectorPlatformIdentity
 *   IntegrationConnectorPlatformComposition
 *   IntegrationConnectorPlatformInventory
 *   IntegrationConnectorPlatformGuarantees
 *   IntegrationConnectorPlatformCompatibility
 *   IntegrationConnectorPlatformCollections
 *   IntegrationConnectorPlatformSummary
 *   IntegrationConnectorPlatform
 */

import { IntegrationConnectorPlatformCompatibility } from "./integrationConnectorPlatformCompatibility.ts";
import { IntegrationConnectorPlatformComposition } from "./integrationConnectorPlatformComposition.ts";
import { IntegrationConnectorPlatformGuarantees } from "./integrationConnectorPlatformGuarantees.ts";
import {
  IntegrationConnectorPlatformDependencies,
  IntegrationConnectorPlatformIdentity,
  IntegrationConnectorPlatformReadinessState,
  IntegrationConnectorPlatformStatus,
} from "./integrationConnectorPlatformIdentity.ts";
import { IntegrationConnectorPlatformInventory } from "./integrationConnectorPlatformInventory.ts";
import type {
  IntegrationConnectorPlatformCollectionsDescriptor,
  IntegrationConnectorPlatformReadinessDescriptor,
  IntegrationConnectorPlatformSummaryDescriptor,
} from "./integrationConnectorPlatformTypes.ts";
import {
  IntegrationConnectorManifestIdentity,
  IntegrationConnectorManifestPlatform,
  IntegrationConnectorManifestSummary,
} from "./integrationConnectorManifest.ts";

export { IntegrationConnectorPlatformIdentity } from "./integrationConnectorPlatformIdentity.ts";
export { IntegrationConnectorPlatformComposition } from "./integrationConnectorPlatformComposition.ts";
export { IntegrationConnectorPlatformInventory } from "./integrationConnectorPlatformInventory.ts";
export { IntegrationConnectorPlatformGuarantees } from "./integrationConnectorPlatformGuarantees.ts";
export { IntegrationConnectorPlatformCompatibility } from "./integrationConnectorPlatformCompatibility.ts";

const readiness: IntegrationConnectorPlatformReadinessDescriptor =
  Object.freeze({
    readinessId: "EIL-2:6/Readiness",
    status: IntegrationConnectorPlatformStatus,
    readiness: IntegrationConnectorPlatformReadinessState,
    nextPhase: "EIL-2:7 — Integration Connector Certification",
    claimsRuntimeReady: false as const,
    claimsFrozen: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Canonical collections aggregate.
 * Counts are derived from platform and Manifest collections.
 */
export const IntegrationConnectorPlatformCollections: IntegrationConnectorPlatformCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-2:6/Collections",
    sourcePhase: "EIL-2:6" as const,
    composition: IntegrationConnectorPlatformComposition,
    inventory: IntegrationConnectorPlatformInventory,
    guarantees: IntegrationConnectorPlatformGuarantees,
    compatibility: IntegrationConnectorPlatformCompatibility,
    guaranteeCount: IntegrationConnectorPlatformGuarantees.length,
    compatibilityCount: IntegrationConnectorPlatformCompatibility.length,
    manifestInventoryTotal:
      IntegrationConnectorPlatformInventory.manifestInventoryTotal,
    total: IntegrationConnectorPlatformInventory.total,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Deterministic frozen Integration Connector Platform summary.
 */
export const IntegrationConnectorPlatformSummary: IntegrationConnectorPlatformSummaryDescriptor =
  Object.freeze({
    platformId: "EIL-2:6/IntegrationConnectorPlatform",
    version: "1.0.0",
    name: "Integration Connector Platform",
    namespace: "nexora.eil.integration-connector.platform",
    status: IntegrationConnectorPlatformStatus,
    readiness: IntegrationConnectorPlatformReadinessState,
    manifestId: "EIL-2:5/IntegrationConnectorManifest",
    guaranteeCount: IntegrationConnectorPlatformCollections.guaranteeCount,
    compatibilityCount:
      IntegrationConnectorPlatformCollections.compatibilityCount,
    manifestInventoryTotal:
      IntegrationConnectorPlatformCollections.manifestInventoryTotal,
    total: IntegrationConnectorPlatformCollections.total,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-2:7 — Integration Connector Certification",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-2:6/Dependency/EIL25Manifest",
  phaseDependencies: IntegrationConnectorPlatformDependencies,
  phaseDependencyCount: IntegrationConnectorPlatformDependencies.length,
  directPreviousPhaseModule: "integrationConnectorManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: IntegrationConnectorManifestIdentity.canonicalId,
  manifestVersion: IntegrationConnectorManifestIdentity.version,
  manifestNamespace: IntegrationConnectorManifestIdentity.namespace,
  manifestPublicSurfaceOnly: true as const,
  manifestInternalImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  eil1Dependency: false as const,
  laterEil2PhaseImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-2:6 → EIL-2:5 IntegrationConnectorManifestPlatform (exclusive)",
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
 * Canonical immutable Integration Connector Platform aggregate.
 * Sole entry point for Certification, Freeze, and Public Index consumers.
 */
export const IntegrationConnectorPlatform = Object.freeze({
  identity: IntegrationConnectorPlatformIdentity,
  dependency,
  manifestIdentity: IntegrationConnectorManifestIdentity,
  composition: IntegrationConnectorPlatformComposition,
  inventory: IntegrationConnectorPlatformInventory,
  guarantees: IntegrationConnectorPlatformGuarantees,
  compatibility: IntegrationConnectorPlatformCompatibility,
  collections: IntegrationConnectorPlatformCollections,
  summary: IntegrationConnectorPlatformSummary,
  readiness,
  status: IntegrationConnectorPlatformStatus,
  sources: Object.freeze({
    manifestId: IntegrationConnectorManifestIdentity.canonicalId,
    manifestEntryPoint: "integrationConnectorManifest.ts" as const,
    manifestNamespace: IntegrationConnectorManifestIdentity.namespace,
    manifestSummary: IntegrationConnectorManifestSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-2:7 — Integration Connector Certification",
  manifestPlatform: IntegrationConnectorManifestPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
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
  telemetryRuntime: false as const,
  monitoringRuntime: false as const,
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
