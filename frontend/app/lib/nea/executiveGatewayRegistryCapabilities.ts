/**
 * NEA-1:2 — Executive Gateway Registry Capabilities.
 *
 * Capability registry derived from every NEA-1:1 Foundation capability.
 * Declarations only. No runtime execution.
 *
 * Ownership: owned exclusively by NEA-1:2.
 */

import {
  ExecutiveGatewayFoundationId,
  ExecutiveGatewayFoundationPlatform,
} from "./executiveGatewayFoundation.ts";
import type { ExecutiveGatewayRegistryEntry } from "./executiveGatewayRegistryTypes.ts";

const foundation = ExecutiveGatewayFoundationPlatform;

/** Capability registry — Foundation capability references preserved. */
export const ExecutiveGatewayCapabilityRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze(
    foundation.capabilities.capabilities.map((item) =>
      Object.freeze({
        id: item.capabilityId,
        label: item.capabilityName,
        description: item.description,
        sourcePhase: "NEA-1:1" as const,
        foundationReference: `${ExecutiveGatewayFoundationId}/capabilities/${item.capabilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Canonical immutable capability registry catalog. */
export const ExecutiveGatewayCapabilityRegistryCatalog = Object.freeze({
  catalogId: "NEA-1:2/CapabilityRegistry",
  sourcePhase: "NEA-1:2" as const,
  capabilities: ExecutiveGatewayCapabilityRegistry,
  capabilityCount: ExecutiveGatewayCapabilityRegistry.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
