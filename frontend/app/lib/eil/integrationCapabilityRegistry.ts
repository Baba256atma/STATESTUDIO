/**
 * EIL-1:2 — Integration Capability Registry.
 *
 * Canonical registry for the ten Foundation capabilities.
 * Descriptive metadata only — no discovery, validation, or orchestration.
 *
 * Ownership: owned exclusively by EIL-1:2.
 */

import {
  IntegrationFoundationId,
  IntegrationFoundationNamespace,
  IntegrationFoundationPlatform,
} from "./integrationFoundation.ts";
import type { IntegrationCapabilityRegistryEntry } from "./integrationRegistryTypes.ts";

const foundation = IntegrationFoundationPlatform;

/**
 * Exactly ten capability registry entries preserving Foundation order.
 */
export const IntegrationCapabilityRegistry: readonly IntegrationCapabilityRegistryEntry[] =
  Object.freeze(
    foundation.capabilityDeclarations.map((capability) =>
      Object.freeze({
        id: `EIL-1:2/Registry/Capability/${capability.capabilityKey}` as const,
        key: capability.capabilityKey,
        capabilityKey: capability.capabilityKey,
        canonicalName: capability.capabilityName,
        category: "Capability" as const,
        description: capability.description,
        sourcePhase: "EIL-1:1/IntegrationFoundation" as const,
        sourceNamespace: IntegrationFoundationNamespace,
        ownership: "EIL-1:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: capability.deterministicOrder,
        aliases: Object.freeze([
          capability.capabilityKey,
          capability.capabilityName,
        ]),
        tags: Object.freeze(["capability", "foundation-reference"]),
        sourceReference: `${IntegrationFoundationId}/capabilities/${capability.capabilityKey}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen capability-registry catalog with derived count. */
export const IntegrationCapabilityRegistryCatalog = Object.freeze({
  collectionId: "EIL-1:2/Collection/Capabilities",
  category: "Capability" as const,
  sourcePhase: "EIL-1:2" as const,
  entries: IntegrationCapabilityRegistry,
  entryCount: IntegrationCapabilityRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
