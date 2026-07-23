/**
 * EIL-9:2 — Executive Integration Layer Composition Registry.
 *
 * Immutable composition registry describing layer identity, suite membership,
 * Public Index references, dependency direction, and canonical composition.
 * Consumes only the EIL-9:1 Foundation aggregate public surface.
 * Metadata-only. No runtime composition.
 *
 * Ownership: owned exclusively by EIL-9:2.
 */

import { ExecutiveIntegrationLayerFoundation } from "./executiveIntegrationLayerFoundation.ts";
import { ExecutiveIntegrationLayerModuleRegistry } from "./executiveIntegrationLayerModuleRegistry.ts";

const foundation = ExecutiveIntegrationLayerFoundation;
const composition = foundation.composition;

/**
 * Immutable composition registry aggregate.
 */
export const ExecutiveIntegrationLayerCompositionRegistry = Object.freeze({
  registryId: "EIL-9:2/CompositionRegistry" as const,
  namespace: "nexora.eil.executive-integration-layer.registry" as const,
  sourcePhase: "EIL-9:1" as const,
  sourceCanonicalId: composition.compositionId,
  status: "Registered" as const,
  layerIdentity: composition.layerIdentity,
  suiteMembership: ExecutiveIntegrationLayerModuleRegistry,
  moduleCount: ExecutiveIntegrationLayerModuleRegistry.length,
  foundationReference: foundation,
  publicIndexReferences: Object.freeze(
    ExecutiveIntegrationLayerModuleRegistry.map((item) =>
      Object.freeze({
        moduleKey: item.key,
        publicIndexId: item.publicIndexId,
        publicIndexNamespace: item.publicIndexNamespace,
        publicIndexVersion: item.publicIndexVersion,
        publicIndexModule: item.publicIndexModule,
        suiteLockId: item.suiteLockId,
        suiteConsumerEntry: item.suiteConsumerEntry,
        sourceCanonicalId: item.sourceCanonicalId,
        foundationReference: item.foundationReference,
        status: "Registered" as const,
        resolvesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  ),
  dependencyDirection: Object.freeze({
    ...composition.dependencyDirection,
    registryPath: "Registry → Foundation → EIL-8 Public Index" as const,
    directPublicIndexImport: false as const,
    foundationMediated: true as const,
  }),
  canonicalComposition: composition.canonicalComposition,
  foundationCompositionReference: composition,
  readiness: "ReadyForModel" as const,
  compositionOnly: true as const,
  introducesRuntimeBehavior: false as const,
  duplicatesFoundationMetadata: false as const,
  bypassesSuitePublicIndex: false as const,
  exposesEil1ThroughEil7Directly: false as const,
  excludedFromCanonicalInventory: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
