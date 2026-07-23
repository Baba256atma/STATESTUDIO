/**
 * EIL-5:2 — Integration Policy & Governance Capability Registry.
 *
 * Canonical registry for the ten Foundation governance capabilities.
 * Descriptive metadata only — no governance, policy, or networking execution.
 *
 * Ownership: owned exclusively by EIL-5:2.
 */

import { IntegrationPolicyGovernanceFoundationPlatform } from "./integrationPolicyGovernanceFoundation.ts";
import type { IntegrationPolicyGovernanceCapabilityRegistryEntry } from "./integrationPolicyGovernanceRegistryTypes.ts";

const foundation = IntegrationPolicyGovernanceFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/**
 * Exactly ten capability registry entries preserving Foundation order.
 */
export const IntegrationPolicyGovernanceCapabilityRegistry: readonly IntegrationPolicyGovernanceCapabilityRegistryEntry[] =
  Object.freeze(
    foundation.capabilityDeclarations.map((capability) =>
      Object.freeze({
        registryId:
          `EIL-5:2/Registry/Capability/${capability.capabilityKey}` as const,
        canonicalKey: capability.capabilityKey,
        canonicalName: capability.capabilityName,
        capabilityName: capability.capabilityName,
        category: "Capability" as const,
        description: capability.description,
        sourcePhase:
          "EIL-5:1/IntegrationPolicyGovernanceFoundation" as const,
        sourceNamespace: foundationNamespace,
        architecturalOwner: "EIL-5:2" as const,
        ownership: "EIL-5:2" as const,
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
export const IntegrationPolicyGovernanceCapabilityRegistryCatalog =
  Object.freeze({
    collectionId: "EIL-5:2/Collection/Capabilities",
    category: "Capability" as const,
    sourcePhase: "EIL-5:2" as const,
    entries: IntegrationPolicyGovernanceCapabilityRegistry,
    entryCount: IntegrationPolicyGovernanceCapabilityRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
