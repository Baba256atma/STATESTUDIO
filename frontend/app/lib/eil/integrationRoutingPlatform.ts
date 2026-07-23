/**
 * EIL-3:6 — Integration Routing Platform.
 *
 * Canonical immutable composition surface for the complete EIL-3 routing platform.
 * Consumes only the EIL-3:5 Integration Routing Manifest aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by EIL-3:6.
 *
 * Public exports (exactly 8):
 *   IntegrationRoutingPlatformIdentity
 *   IntegrationRoutingPlatformComposition
 *   IntegrationRoutingPlatformInventory
 *   IntegrationRoutingPlatformGuarantees
 *   IntegrationRoutingPlatformCompatibility
 *   IntegrationRoutingPlatformCollections
 *   IntegrationRoutingPlatformSummary
 *   IntegrationRoutingPlatform
 */

import { IntegrationRoutingPlatformCompatibility } from "./integrationRoutingPlatformCompatibility.ts";
import { IntegrationRoutingPlatformComposition } from "./integrationRoutingPlatformComposition.ts";
import { IntegrationRoutingPlatformGuarantees } from "./integrationRoutingPlatformGuarantees.ts";
import {
  IntegrationRoutingPlatformDependencies,
  IntegrationRoutingPlatformIdentity,
  IntegrationRoutingPlatformReadinessStateValue,
  IntegrationRoutingPlatformStatusValue,
} from "./integrationRoutingPlatformIdentity.ts";
import { IntegrationRoutingPlatformInventory } from "./integrationRoutingPlatformInventory.ts";
import type {
  RoutingPlatformCollections,
  RoutingPlatformReadiness,
  RoutingPlatformSummary,
} from "./integrationRoutingPlatformTypes.ts";
import {
  IntegrationRoutingManifestIdentity,
  IntegrationRoutingManifestPlatform,
  IntegrationRoutingManifestSummary,
} from "./integrationRoutingManifest.ts";

export { IntegrationRoutingPlatformIdentity } from "./integrationRoutingPlatformIdentity.ts";
export { IntegrationRoutingPlatformComposition } from "./integrationRoutingPlatformComposition.ts";
export { IntegrationRoutingPlatformInventory } from "./integrationRoutingPlatformInventory.ts";
export { IntegrationRoutingPlatformGuarantees } from "./integrationRoutingPlatformGuarantees.ts";
export { IntegrationRoutingPlatformCompatibility } from "./integrationRoutingPlatformCompatibility.ts";

const readiness: RoutingPlatformReadiness = Object.freeze({
  readinessId: "EIL-3:6/Readiness",
  status: IntegrationRoutingPlatformStatusValue,
  readiness: IntegrationRoutingPlatformReadinessStateValue,
  nextPhase: "EIL-3:7 — Integration Routing Certification",
  claimsRuntimeReady: false as const,
  claimsFrozen: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical collections aggregate.
 * Counts are derived from platform and Manifest collections.
 */
export const IntegrationRoutingPlatformCollections: RoutingPlatformCollections =
  Object.freeze({
    collectionsId: "EIL-3:6/Collections",
    sourcePhase: "EIL-3:6" as const,
    composition: IntegrationRoutingPlatformComposition,
    inventory: IntegrationRoutingPlatformInventory,
    guarantees: IntegrationRoutingPlatformGuarantees,
    compatibility: IntegrationRoutingPlatformCompatibility,
    guaranteeCount: IntegrationRoutingPlatformGuarantees.length,
    compatibilityCount: IntegrationRoutingPlatformCompatibility.length,
    manifestInventoryTotal:
      IntegrationRoutingPlatformInventory.manifestInventoryTotal,
    total: IntegrationRoutingPlatformInventory.total,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Deterministic frozen Integration Routing Platform summary.
 */
export const IntegrationRoutingPlatformSummary: RoutingPlatformSummary =
  Object.freeze({
    platformId: "EIL-3:6/IntegrationRoutingPlatform",
    version: "1.0.0",
    name: "Integration Routing Platform",
    namespace: "nexora.eil.integration-routing.platform",
    status: IntegrationRoutingPlatformStatusValue,
    readiness: IntegrationRoutingPlatformReadinessStateValue,
    manifestId: "EIL-3:5/IntegrationRoutingManifest",
    guaranteeCount: IntegrationRoutingPlatformCollections.guaranteeCount,
    compatibilityCount:
      IntegrationRoutingPlatformCollections.compatibilityCount,
    manifestInventoryTotal:
      IntegrationRoutingPlatformCollections.manifestInventoryTotal,
    total: IntegrationRoutingPlatformCollections.total,
    architecturalCompleteness: true as const,
    nextPhase: "EIL-3:7 — Integration Routing Certification",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const dependency = Object.freeze({
  dependencyId: "EIL-3:6/Dependency/EIL35Manifest",
  phaseDependencies: IntegrationRoutingPlatformDependencies,
  phaseDependencyCount: IntegrationRoutingPlatformDependencies.length,
  directPreviousPhaseModule: "integrationRoutingManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: IntegrationRoutingManifestIdentity.canonicalId,
  manifestVersion: IntegrationRoutingManifestIdentity.version,
  manifestNamespace: IntegrationRoutingManifestIdentity.namespace,
  manifestPublicSurfaceOnly: true as const,
  manifestInternalImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  previousEilPlatformDependency: false as const,
  laterEil3PhaseImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "EIL-3:6 → EIL-3:5 IntegrationRoutingManifestPlatform (exclusive)",
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
 * Canonical immutable Integration Routing Platform aggregate.
 * Sole entry point for Certification, Freeze, and Public Index consumers.
 */
export const IntegrationRoutingPlatform = Object.freeze({
  identity: IntegrationRoutingPlatformIdentity,
  dependency,
  manifestIdentity: IntegrationRoutingManifestIdentity,
  composition: IntegrationRoutingPlatformComposition,
  inventory: IntegrationRoutingPlatformInventory,
  guarantees: IntegrationRoutingPlatformGuarantees,
  compatibility: IntegrationRoutingPlatformCompatibility,
  collections: IntegrationRoutingPlatformCollections,
  summary: IntegrationRoutingPlatformSummary,
  readiness,
  status: IntegrationRoutingPlatformStatusValue,
  sources: Object.freeze({
    manifestId: IntegrationRoutingManifestIdentity.canonicalId,
    manifestEntryPoint: "integrationRoutingManifest.ts" as const,
    manifestNamespace: IntegrationRoutingManifestIdentity.namespace,
    manifestSummary: IntegrationRoutingManifestSummary,
  }),
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  nextPhase: "EIL-3:7 — Integration Routing Certification",
  manifestPlatform: IntegrationRoutingManifestPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimePlatform: false as const,
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
