/**
 * EIL-9:1 — Executive Integration Layer Composition.
 *
 * Immutable Layer composition describing identity, suite membership,
 * dependency direction, canonical composition, and readiness.
 * Metadata only. No runtime composition.
 *
 * Ownership: owned exclusively by EIL-9:1.
 */

import { ExecutiveIntegrationLayerCapabilities } from "./executiveIntegrationLayerCapabilities.ts";
import { ExecutiveIntegrationLayerContracts } from "./executiveIntegrationLayerContracts.ts";
import { ExecutiveIntegrationLayerDomains } from "./executiveIntegrationLayerDomains.ts";
import { ExecutiveIntegrationLayerLifecycle } from "./executiveIntegrationLayerLifecycle.ts";
import { ExecutiveIntegrationLayerModules } from "./executiveIntegrationLayerModules.ts";

/** Canonical Layer Foundation identity constants used by composition. */
export const ExecutiveIntegrationLayerCompositionIdentity = Object.freeze({
  phaseId: "EIL-9:1" as const,
  canonicalId: "EIL-9:1/ExecutiveIntegrationLayerFoundation" as const,
  layerName: "Executive Integration Layer" as const,
  foundationName: "Executive Integration Layer Foundation" as const,
  namespace: "nexora.eil.executive-integration-layer.foundation" as const,
  version: "1.0.0" as const,
  status: "Foundation" as const,
  readiness: "ReadyForRegistry" as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Immutable Layer composition aggregate.
 */
export const ExecutiveIntegrationLayerComposition = Object.freeze({
  compositionId: "EIL-9:1/Composition" as const,
  layerIdentity: ExecutiveIntegrationLayerCompositionIdentity,
  contracts: ExecutiveIntegrationLayerContracts,
  capabilities: ExecutiveIntegrationLayerCapabilities,
  domains: ExecutiveIntegrationLayerDomains,
  lifecycle: ExecutiveIntegrationLayerLifecycle,
  suiteMembership: ExecutiveIntegrationLayerModules,
  moduleCount: ExecutiveIntegrationLayerModules.length,
  dependencyDirection: Object.freeze({
    dependencyId: "EIL-9:1/Dependency/EIL8PublicIndex" as const,
    upstreamPhase: "EIL-8:9" as const,
    upstreamCanonicalId: "EIL-8:9/ExecutiveIntegrationSuitePublicIndex" as const,
    dependencyType: "PublicIndexComposition" as const,
    direction: "EIL-8 Public Index → EIL-9 Foundation" as const,
    publicIndexOnly: true as const,
    eil8PublicIndexOnly: true as const,
    privateImports: false as const,
    laterEil9PhaseImport: false as const,
    bypassesPublicIndex: false as const,
    reconstructsUpstream: false as const,
    introducesNewIntegrationBehavior: false as const,
    referencesEil1ThroughEil7Directly: false as const,
    downstreamDependencies: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  canonicalComposition: Object.freeze({
    compositionPath: "EIL-8 Public Index → EIL-9 Foundation" as const,
    moduleKeys: Object.freeze(
      ExecutiveIntegrationLayerModules.map((module) => module.moduleKey),
    ),
    publicIndexIds: Object.freeze(
      ExecutiveIntegrationLayerModules.map((module) => module.publicIndexId),
    ),
    preservesCanonicalReferences: true as const,
    duplicatesUpstreamMetadata: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  }),
  inventory: Object.freeze({
    contractCount: ExecutiveIntegrationLayerContracts.length,
    capabilityCount: ExecutiveIntegrationLayerCapabilities.length,
    domainCount: ExecutiveIntegrationLayerDomains.length,
    lifecycleStageCount: ExecutiveIntegrationLayerLifecycle.stages.length,
    layerModuleCount: ExecutiveIntegrationLayerModules.length,
    totalFoundationEntryCount:
      ExecutiveIntegrationLayerContracts.length +
      ExecutiveIntegrationLayerCapabilities.length +
      ExecutiveIntegrationLayerDomains.length +
      ExecutiveIntegrationLayerLifecycle.stages.length +
      ExecutiveIntegrationLayerModules.length,
    countsDerivedFromCollections: true as const,
    hardcodedTotals: false as const,
  }),
  readiness: "ReadyForRegistry" as const,
  nextPhase: "EIL-9:2 — Executive Integration Layer Registry" as const,
  compositionOnly: true as const,
  introducesRuntimeBehavior: false as const,
  duplicatesSuiteMetadata: false as const,
  runtimeComposition: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
