/**
 * EIL-3:2 — Integration Routing Capability Registry.
 *
 * Canonical registry for the ten Foundation routing capabilities.
 * Descriptive metadata only — no routing, networking, or orchestration.
 *
 * Ownership: owned exclusively by EIL-3:2.
 */

import { IntegrationRoutingFoundationPlatform } from "./integrationRoutingFoundation.ts";
import type { RoutingCapabilityRegistryEntry } from "./integrationRoutingRegistryTypes.ts";

const foundation = IntegrationRoutingFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/**
 * Exactly ten capability registry entries preserving Foundation order.
 */
export const IntegrationRoutingCapabilityRegistry: readonly RoutingCapabilityRegistryEntry[] =
  Object.freeze(
    foundation.capabilityDeclarations.map((capability) =>
      Object.freeze({
        id: `EIL-3:2/Registry/Capability/${capability.capabilityKey}` as const,
        key: capability.capabilityKey,
        capabilityKey: capability.capabilityKey,
        canonicalName: capability.capabilityName,
        category: "Capability" as const,
        description: capability.description,
        sourcePhase: "EIL-3:1/IntegrationRoutingFoundation" as const,
        sourceNamespace: foundationNamespace,
        ownership: "EIL-3:2" as const,
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
export const IntegrationRoutingCapabilityRegistryCatalog = Object.freeze({
  collectionId: "EIL-3:2/Collection/Capabilities",
  category: "Capability" as const,
  sourcePhase: "EIL-3:2" as const,
  entries: IntegrationRoutingCapabilityRegistry,
  entryCount: IntegrationRoutingCapabilityRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
