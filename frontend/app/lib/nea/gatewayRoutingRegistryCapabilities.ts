/**
 * NEA-5:2 — Gateway Routing Registry Capabilities.
 *
 * Capability registry derived from every NEA-5:1 Foundation capability.
 * Declarations only. No runtime execution.
 *
 * Ownership: owned exclusively by NEA-5:2.
 */

import {
  GatewayRoutingFoundationId,
  GatewayRoutingFoundationPlatform,
} from "./gatewayRoutingFoundation.ts";
import type { GatewayRoutingRegistryEntry } from "./gatewayRoutingRegistryTypes.ts";

const foundation = GatewayRoutingFoundationPlatform;

/** Capability registry — Foundation capability references preserved. */
export const GatewayRoutingCapabilityRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze(
    foundation.capabilities.capabilities.map((item) =>
      Object.freeze({
        id: item.capabilityId,
        label: item.capabilityName,
        description: item.description,
        sourcePhase: "NEA-5:1" as const,
        foundationReference: `${GatewayRoutingFoundationId}/capabilities/${item.capabilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Canonical immutable capability registry catalog. */
export const GatewayRoutingCapabilityRegistryCatalog = Object.freeze({
  catalogId: "NEA-5:2/CapabilityRegistry",
  sourcePhase: "NEA-5:2" as const,
  capabilities: GatewayRoutingCapabilityRegistry,
  capabilityCount: GatewayRoutingCapabilityRegistry.length,
  executesRuntime: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
