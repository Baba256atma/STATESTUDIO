/**
 * EIL-4:2 — Integration Orchestration Capability Registry.
 *
 * Canonical registry for the ten Foundation orchestration capabilities.
 * Descriptive metadata only — no orchestration, workflow, or networking.
 *
 * Ownership: owned exclusively by EIL-4:2.
 */

import { IntegrationOrchestrationFoundationPlatform } from "./integrationOrchestrationFoundation.ts";
import type { OrchestrationCapabilityRegistryEntry } from "./integrationOrchestrationRegistryTypes.ts";

const foundation = IntegrationOrchestrationFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/**
 * Exactly ten capability registry entries preserving Foundation order.
 */
export const IntegrationOrchestrationCapabilityRegistry: readonly OrchestrationCapabilityRegistryEntry[] =
  Object.freeze(
    foundation.capabilityDeclarations.map((capability) =>
      Object.freeze({
        registryId:
          `EIL-4:2/Registry/Capability/${capability.capabilityKey}` as const,
        canonicalKey: capability.capabilityKey,
        canonicalName: capability.capabilityName,
        capabilityName: capability.capabilityName,
        category: "Capability" as const,
        description: capability.description,
        sourcePhase: "EIL-4:1/IntegrationOrchestrationFoundation" as const,
        sourceNamespace: foundationNamespace,
        architecturalOwner: "EIL-4:2" as const,
        ownership: "EIL-4:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: capability.deterministicOrder,
        tags: Object.freeze(["capability", "foundation-reference"]),
        sourceReference:
          `${foundationId}/capabilities/${capability.capabilityKey}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen capability-registry catalog with derived count. */
export const IntegrationOrchestrationCapabilityRegistryCatalog =
  Object.freeze({
    collectionId: "EIL-4:2/Collection/Capabilities",
    category: "Capability" as const,
    sourcePhase: "EIL-4:2" as const,
    entries: IntegrationOrchestrationCapabilityRegistry,
    entryCount: IntegrationOrchestrationCapabilityRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
