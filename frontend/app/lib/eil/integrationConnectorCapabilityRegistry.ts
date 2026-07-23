/**
 * EIL-2:2 — Integration Connector Capability Registry.
 *
 * Canonical registry for the ten Foundation connector capabilities.
 * Descriptive metadata only — no discovery, networking, or orchestration.
 *
 * Ownership: owned exclusively by EIL-2:2.
 */

import {
  IntegrationConnectorFoundationId,
  IntegrationConnectorFoundationNamespace,
  IntegrationConnectorFoundationPlatform,
} from "./integrationConnectorFoundation.ts";
import type { IntegrationConnectorCapabilityRegistryEntry } from "./integrationConnectorRegistryTypes.ts";

const foundation = IntegrationConnectorFoundationPlatform;

/**
 * Exactly ten capability registry entries preserving Foundation order.
 */
export const IntegrationConnectorCapabilityRegistry: readonly IntegrationConnectorCapabilityRegistryEntry[] =
  Object.freeze(
    foundation.capabilityDeclarations.map((capability) =>
      Object.freeze({
        id: `EIL-2:2/Registry/Capability/${capability.capabilityKey}` as const,
        key: capability.capabilityKey,
        capabilityKey: capability.capabilityKey,
        canonicalName: capability.capabilityName,
        category: "Capability" as const,
        description: capability.description,
        sourcePhase: "EIL-2:1/IntegrationConnectorFoundation" as const,
        sourceNamespace: IntegrationConnectorFoundationNamespace,
        ownership: "EIL-2:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: capability.deterministicOrder,
        tags: Object.freeze(["capability", "foundation-reference"]),
        sourceReference: `${IntegrationConnectorFoundationId}/capabilities/${capability.capabilityKey}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen capability-registry catalog with derived count. */
export const IntegrationConnectorCapabilityRegistryCatalog = Object.freeze({
  collectionId: "EIL-2:2/Collection/Capabilities",
  category: "Capability" as const,
  sourcePhase: "EIL-2:2" as const,
  entries: IntegrationConnectorCapabilityRegistry,
  entryCount: IntegrationConnectorCapabilityRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
