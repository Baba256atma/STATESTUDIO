/**
 * EIL-1:6 — Integration Platform.
 *
 * Canonical immutable composition surface for the complete EIL-1 platform.
 * Consumes only the EIL-1:5 Integration Manifest aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by EIL-1:6.
 *
 * Public exports (exactly 8):
 *   IntegrationPlatformIdentity
 *   IntegrationPlatformComposition
 *   IntegrationPlatformInventory
 *   IntegrationPlatformGuarantees
 *   IntegrationPlatformCompatibility
 *   IntegrationPlatformCollections
 *   IntegrationPlatformSummary
 *   IntegrationPlatform
 */

import { IntegrationPlatformCompatibility } from "./integrationPlatformCompatibility.ts";
import { IntegrationPlatformComposition } from "./integrationPlatformComposition.ts";
import { IntegrationPlatformGuarantees } from "./integrationPlatformGuarantees.ts";
import {
  IntegrationPlatformDependencies,
  IntegrationPlatformIdentity,
  IntegrationPlatformReadinessState,
  IntegrationPlatformStatus,
} from "./integrationPlatformIdentity.ts";
import { IntegrationPlatformInventory } from "./integrationPlatformInventory.ts";
import type {
  IntegrationPlatformCollectionsDescriptor,
  IntegrationPlatformReadinessDescriptor,
  IntegrationPlatformSummaryDescriptor,
} from "./integrationPlatformTypes.ts";
import {
  IntegrationManifestIdentity,
  IntegrationManifestPlatform,
  IntegrationManifestSummary,
} from "./integrationManifest.ts";

export { IntegrationPlatformIdentity } from "./integrationPlatformIdentity.ts";
export { IntegrationPlatformComposition } from "./integrationPlatformComposition.ts";
export { IntegrationPlatformInventory } from "./integrationPlatformInventory.ts";
export { IntegrationPlatformGuarantees } from "./integrationPlatformGuarantees.ts";
export { IntegrationPlatformCompatibility } from "./integrationPlatformCompatibility.ts";

const readiness: IntegrationPlatformReadinessDescriptor = Object.freeze({
  readinessId: "EIL-1:6/Readiness",
  status: IntegrationPlatformStatus,
  readiness: IntegrationPlatformReadinessState,
  nextPhase: "EIL-1:7 — Integration Certification",
  claimsRuntimeReady: false as const,
  claimsFrozen: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived from platform and Manifest collections.
 */
export const IntegrationPlatformCollections: IntegrationPlatformCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-1:6/Collections",
    sourcePhase: "EIL-1:6" as const,
    composition: IntegrationPlatformComposition,
    inventory: IntegrationPlatformInventory,
    guarantees: IntegrationPlatformGuarantees,
    compatibility: IntegrationPlatformCompatibility,
    guaranteeCount: IntegrationPlatformGuarantees.length,
    compatibilityCount: IntegrationPlatformCompatibility.length,
    manifestInventoryTotal:
      IntegrationPlatformInventory.manifestInventoryTotal,
    total: IntegrationPlatformInventory.total,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Deterministic frozen Integration Platform summary.
 */
export const IntegrationPlatformSummary: IntegrationPlatformSummaryDescriptor =
  Object.freeze({
    platformId: "EIL-1:6/IntegrationPlatform",
    version: "1.0.0",
    name: "Integration Platform",
    namespace: "nexora.eil.integration.platform",
    status: IntegrationPlatformStatus,
    readiness: IntegrationPlatformReadinessState,
    manifestId: "EIL-1:5/IntegrationManifest",
    guaranteeCount: IntegrationPlatformCollections.guaranteeCount,
    compatibilityCount: IntegrationPlatformCollections.compatibilityCount,
    manifestInventoryTotal:
      IntegrationPlatformCollections.manifestInventoryTotal,
    total: IntegrationPlatformCollections.total,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-1:7 — Integration Certification",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-1:6/Dependency/EIL15Manifest",
  phaseDependencies: IntegrationPlatformDependencies,
  phaseDependencyCount: IntegrationPlatformDependencies.length,
  directPreviousPhaseModule: "integrationManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: IntegrationManifestIdentity.canonicalId,
  manifestVersion: IntegrationManifestIdentity.version,
  manifestNamespace: IntegrationManifestIdentity.namespace,
  manifestPublicSurfaceOnly: true as const,
  manifestInternalImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEilPhaseImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-1:6 → EIL-1:5 IntegrationManifestPlatform (exclusive)",
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
 * Canonical immutable Integration Platform aggregate.
 * Sole entry point for Certification, Freeze, and Public Index consumers.
 */
export const IntegrationPlatform = Object.freeze({
  identity: IntegrationPlatformIdentity,
  dependency,
  manifestIdentity: IntegrationManifestIdentity,
  composition: IntegrationPlatformComposition,
  inventory: IntegrationPlatformInventory,
  guarantees: IntegrationPlatformGuarantees,
  compatibility: IntegrationPlatformCompatibility,
  collections: IntegrationPlatformCollections,
  summary: IntegrationPlatformSummary,
  readiness,
  status: IntegrationPlatformStatus,
  sources: Object.freeze({
    manifestId: IntegrationManifestIdentity.canonicalId,
    manifestEntryPoint: "integrationManifest.ts" as const,
    manifestNamespace: IntegrationManifestIdentity.namespace,
    manifestSummary: IntegrationManifestSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-1:7 — Integration Certification",
  manifestPlatform: IntegrationManifestPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
  routingEngine: false as const,
  orchestrationEngine: false as const,
  workflowExecution: false as const,
  validationEngine: false as const,
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
  telemetryRuntime: false as const,
  monitoringRuntime: false as const,
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
