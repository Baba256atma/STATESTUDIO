/**
 * EIL-5:2 — Integration Policy & Governance Responsibility Registry.
 *
 * Canonical registry for the eight Foundation governance responsibilities.
 * Architectural ownership classifications are declarative metadata only.
 *
 * Ownership: owned exclusively by EIL-5:2.
 */

import { IntegrationPolicyGovernanceFoundationPlatform } from "./integrationPolicyGovernanceFoundation.ts";
import type {
  IntegrationPolicyGovernanceResponsibilityRegistryEntry,
  PolicyGovernanceResponsibilityClassification,
} from "./integrationPolicyGovernanceRegistryTypes.ts";

const foundation = IntegrationPolicyGovernanceFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

const RESPONSIBILITY_CLASSIFICATION: Readonly<
  Record<string, PolicyGovernanceResponsibilityClassification>
> = Object.freeze({
  PreserveGovernanceIdentity: "Identity",
  PreserveArchitecturalBoundaries: "Boundary",
  PublishGovernanceMetadata: "Publication",
  PreserveDependencyDirection: "Dependency",
  PreserveCompatibility: "Compatibility",
  PreserveDeterministicInventories: "Inventory",
  SupportFutureRuntimePlatforms: "RuntimeSupport",
  PreserveArchitecturalConsistency: "Consistency",
});

/**
 * Exactly eight responsibility registry entries preserving Foundation order.
 */
export const IntegrationPolicyGovernanceResponsibilityRegistry: readonly IntegrationPolicyGovernanceResponsibilityRegistryEntry[] =
  Object.freeze(
    foundation.responsibilityDeclarations.map((responsibility) =>
      Object.freeze({
        registryId:
          `EIL-5:2/Registry/Responsibility/${responsibility.responsibilityId}` as const,
        canonicalKey: responsibility.responsibilityId,
        canonicalName: responsibility.responsibilityName,
        responsibilityName: responsibility.responsibilityName,
        category: "Responsibility" as const,
        description: responsibility.description,
        architecturalOwner: "EIL-5:2" as const,
        responsibilityClassification:
          RESPONSIBILITY_CLASSIFICATION[responsibility.responsibilityId]!,
        sourcePhase:
          "EIL-5:1/IntegrationPolicyGovernanceFoundation" as const,
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
export const IntegrationPolicyGovernanceResponsibilityRegistryCatalog =
  Object.freeze({
    collectionId: "EIL-5:2/Collection/Responsibilities",
    category: "Responsibility" as const,
    sourcePhase: "EIL-5:2" as const,
    entries: IntegrationPolicyGovernanceResponsibilityRegistry,
    entryCount: IntegrationPolicyGovernanceResponsibilityRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
