/**
 * EIL-4:6 — Integration Orchestration Platform.
 *
 * Canonical immutable composition surface for the complete EIL-4 orchestration platform.
 * Consumes only the EIL-4:5 Integration Orchestration Manifest aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by EIL-4:6.
 *
 * Public exports (exactly 8):
 *   IntegrationOrchestrationPlatformIdentity
 *   IntegrationOrchestrationPlatformComposition
 *   IntegrationOrchestrationPlatformInventory
 *   IntegrationOrchestrationPlatformGuarantees
 *   IntegrationOrchestrationPlatformCompatibility
 *   IntegrationOrchestrationPlatformCollections
 *   IntegrationOrchestrationPlatformSummary
 *   IntegrationOrchestrationPlatform
 */

import { IntegrationOrchestrationPlatformCompatibility } from "./integrationOrchestrationPlatformCompatibility.ts";
import { IntegrationOrchestrationPlatformComposition } from "./integrationOrchestrationPlatformComposition.ts";
import { IntegrationOrchestrationPlatformGuarantees } from "./integrationOrchestrationPlatformGuarantees.ts";
import {
  IntegrationOrchestrationPlatformDependencies,
  IntegrationOrchestrationPlatformIdentity,
  IntegrationOrchestrationPlatformReadinessStateValue,
  IntegrationOrchestrationPlatformStatusValue,
} from "./integrationOrchestrationPlatformIdentity.ts";
import { IntegrationOrchestrationPlatformInventory } from "./integrationOrchestrationPlatformInventory.ts";
import type {
  IntegrationOrchestrationPlatformCollections as OrchestrationPlatformCollectionsDescriptor,
  IntegrationOrchestrationPlatformSummary as OrchestrationPlatformSummaryDescriptor,
  OrchestrationPlatformReadiness,
} from "./integrationOrchestrationPlatformTypes.ts";
import {
  IntegrationOrchestrationManifestIdentity,
  IntegrationOrchestrationManifestPlatform,
  IntegrationOrchestrationManifestSummary,
} from "./integrationOrchestrationManifest.ts";

export { IntegrationOrchestrationPlatformIdentity } from "./integrationOrchestrationPlatformIdentity.ts";
export { IntegrationOrchestrationPlatformComposition } from "./integrationOrchestrationPlatformComposition.ts";
export { IntegrationOrchestrationPlatformInventory } from "./integrationOrchestrationPlatformInventory.ts";
export { IntegrationOrchestrationPlatformGuarantees } from "./integrationOrchestrationPlatformGuarantees.ts";
export { IntegrationOrchestrationPlatformCompatibility } from "./integrationOrchestrationPlatformCompatibility.ts";

const readiness: OrchestrationPlatformReadiness = Object.freeze({
  readinessId: "EIL-4:6/Readiness",
  status: IntegrationOrchestrationPlatformStatusValue,
  readiness: IntegrationOrchestrationPlatformReadinessStateValue,
  nextPhase: "EIL-4:7 — Integration Orchestration Certification",
  claimsRuntimeReady: false as const,
  claimsFrozen: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived from platform and Manifest collections.
 */
export const IntegrationOrchestrationPlatformCollections: OrchestrationPlatformCollectionsDescriptor =
  Object.freeze({
    collectionsId: "EIL-4:6/Collections",
    sourcePhase: "EIL-4:6" as const,
    composition: IntegrationOrchestrationPlatformComposition,
    inventory: IntegrationOrchestrationPlatformInventory,
    guarantees: IntegrationOrchestrationPlatformGuarantees,
    compatibility: IntegrationOrchestrationPlatformCompatibility,
    guaranteeCount: IntegrationOrchestrationPlatformGuarantees.length,
    compatibilityCount: IntegrationOrchestrationPlatformCompatibility.length,
    manifestInventoryTotal:
      IntegrationOrchestrationPlatformInventory.manifestInventoryTotal,
    total: IntegrationOrchestrationPlatformInventory.total,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Deterministic frozen Integration Orchestration Platform summary.
 */
export const IntegrationOrchestrationPlatformSummary: OrchestrationPlatformSummaryDescriptor =
  Object.freeze({
    platformId: "EIL-4:6/IntegrationOrchestrationPlatform",
    version: "1.0.0",
    name: "Integration Orchestration Platform",
    namespace: "nexora.eil.integration-orchestration.platform",
    status: IntegrationOrchestrationPlatformStatusValue,
    readiness: IntegrationOrchestrationPlatformReadinessStateValue,
    manifestId: "EIL-4:5/IntegrationOrchestrationManifest",
    guaranteeCount: IntegrationOrchestrationPlatformCollections.guaranteeCount,
    compatibilityCount:
      IntegrationOrchestrationPlatformCollections.compatibilityCount,
    manifestInventoryTotal:
      IntegrationOrchestrationPlatformCollections.manifestInventoryTotal,
    total: IntegrationOrchestrationPlatformCollections.total,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-4:7 — Integration Orchestration Certification",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-4:6/Dependency/EIL45Manifest",
  phaseDependencies: IntegrationOrchestrationPlatformDependencies,
  phaseDependencyCount: IntegrationOrchestrationPlatformDependencies.length,
  directPreviousPhaseModule: "integrationOrchestrationManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: IntegrationOrchestrationManifestIdentity.canonicalId,
  manifestVersion: IntegrationOrchestrationManifestIdentity.version,
  manifestNamespace: IntegrationOrchestrationManifestIdentity.namespace,
  manifestPublicSurfaceOnly: true as const,
  manifestInternalImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil4PhaseImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-4:6 → EIL-4:5 IntegrationOrchestrationManifestPlatform (exclusive)",
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
 * Canonical immutable Integration Orchestration Platform aggregate.
 * Sole entry point for Certification, Freeze, and Public Index consumers.
 */
export const IntegrationOrchestrationPlatform = Object.freeze({
  identity: IntegrationOrchestrationPlatformIdentity,
  dependency,
  manifestIdentity: IntegrationOrchestrationManifestIdentity,
  composition: IntegrationOrchestrationPlatformComposition,
  inventory: IntegrationOrchestrationPlatformInventory,
  guarantees: IntegrationOrchestrationPlatformGuarantees,
  compatibility: IntegrationOrchestrationPlatformCompatibility,
  collections: IntegrationOrchestrationPlatformCollections,
  summary: IntegrationOrchestrationPlatformSummary,
  readiness,
  status: IntegrationOrchestrationPlatformStatusValue,
  sources: Object.freeze({
    manifestId: IntegrationOrchestrationManifestIdentity.canonicalId,
    manifestEntryPoint: "integrationOrchestrationManifest.ts" as const,
    manifestNamespace: IntegrationOrchestrationManifestIdentity.namespace,
    manifestSummary: IntegrationOrchestrationManifestSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-4:7 — Integration Orchestration Certification",
  manifestPlatform: IntegrationOrchestrationManifestPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
  orchestrationEngine: false as const,
  workflowExecution: false as const,
  routingExecution: false as const,
  schedulingBehavior: false as const,
  triggerProcessing: false as const,
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
