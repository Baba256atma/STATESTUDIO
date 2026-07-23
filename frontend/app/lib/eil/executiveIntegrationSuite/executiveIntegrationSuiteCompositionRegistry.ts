/**
 * EIL-8:2 — Executive Integration Suite Composition Registry.
 *
 * Immutable composition registry describing suite identity, membership,
 * Public Index references, dependency direction, and canonical composition.
 * Consumes only the EIL-8:1 Foundation aggregate public surface.
 * Metadata-only. No runtime composition.
 *
 * Ownership: owned exclusively by EIL-8:2.
 */

import { ExecutiveIntegrationSuiteFoundation } from "./executiveIntegrationSuiteFoundation.ts";
import { ExecutiveIntegrationSuiteModuleRegistry } from "./executiveIntegrationSuiteModuleRegistry.ts";

const foundation = ExecutiveIntegrationSuiteFoundation;
const composition = foundation.composition;

/**
 * Immutable composition registry aggregate.
 */
export const ExecutiveIntegrationSuiteCompositionRegistry = Object.freeze({
  registryId: "EIL-8:2/CompositionRegistry" as const,
  namespace: "nexora.eil.executive-integration-suite.registry" as const,
  sourcePhase: "EIL-8:1" as const,
  sourceCanonicalId: composition.compositionId,
  status: "Registered" as const,
  suiteIdentity: composition.suiteIdentity,
  moduleMembership: ExecutiveIntegrationSuiteModuleRegistry,
  moduleCount: ExecutiveIntegrationSuiteModuleRegistry.length,
  publicIndexReferences: Object.freeze(
    ExecutiveIntegrationSuiteModuleRegistry.map((item) =>
      Object.freeze({
        moduleKey: item.key,
        publicIndexId: item.publicIndexId,
        publicIndexModule: item.publicIndexModule,
        sourceCanonicalId: item.sourceCanonicalId,
        foundationReference: item.foundationReference,
        status: "Registered" as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  ),
  dependencyDirection: composition.dependencyDirection,
  canonicalComposition: composition.canonicalComposition,
  foundationCompositionReference: composition,
  readiness: "ReadyForModel" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
