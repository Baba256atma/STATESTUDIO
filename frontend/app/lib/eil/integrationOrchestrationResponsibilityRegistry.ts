/**
 * EIL-4:2 — Integration Orchestration Responsibility Registry.
 *
 * Canonical registry for the eight Foundation orchestration responsibilities.
 * Architectural ownership classifications are declarative metadata only.
 *
 * Ownership: owned exclusively by EIL-4:2.
 */

import { IntegrationOrchestrationFoundationPlatform } from "./integrationOrchestrationFoundation.ts";
import type {
  OrchestrationResponsibilityClassification,
  OrchestrationResponsibilityRegistryEntry,
} from "./integrationOrchestrationRegistryTypes.ts";

const foundation = IntegrationOrchestrationFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

const RESPONSIBILITY_CLASSIFICATION: Readonly<
  Record<string, OrchestrationResponsibilityClassification>
> = Object.freeze({
  PreserveOrchestrationIdentity: "Identity",
  PreserveArchitecturalBoundaries: "Boundary",
  PublishOrchestrationMetadata: "Publication",
  PreserveDependencyDirection: "Dependency",
  PreserveCompatibility: "Compatibility",
  PreserveDeterministicInventories: "Inventory",
  SupportFutureRuntimePlatforms: "RuntimeSupport",
  PreserveArchitecturalConsistency: "Consistency",
});

/**
 * Exactly eight responsibility registry entries preserving Foundation order.
 */
export const IntegrationOrchestrationResponsibilityRegistry: readonly OrchestrationResponsibilityRegistryEntry[] =
  Object.freeze(
    foundation.responsibilityDeclarations.map((responsibility) =>
      Object.freeze({
        registryId:
          `EIL-4:2/Registry/Responsibility/${responsibility.responsibilityId}` as const,
        canonicalKey: responsibility.responsibilityId,
        canonicalName: responsibility.responsibilityName,
        responsibilityName: responsibility.responsibilityName,
        category: "Responsibility" as const,
        description: responsibility.description,
        architecturalOwner: "EIL-4:2" as const,
        responsibilityClassification:
          RESPONSIBILITY_CLASSIFICATION[responsibility.responsibilityId]!,
        sourcePhase: "EIL-4:1/IntegrationOrchestrationFoundation" as const,
        sourceNamespace: foundationNamespace,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: responsibility.deterministicOrder,
        tags: Object.freeze(["responsibility", "foundation-reference"]),
        sourceReference:
          `${foundationId}/responsibilities/${responsibility.responsibilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen responsibility-registry catalog with derived count. */
export const IntegrationOrchestrationResponsibilityRegistryCatalog =
  Object.freeze({
    collectionId: "EIL-4:2/Collection/Responsibilities",
    category: "Responsibility" as const,
    sourcePhase: "EIL-4:2" as const,
    entries: IntegrationOrchestrationResponsibilityRegistry,
    entryCount: IntegrationOrchestrationResponsibilityRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
