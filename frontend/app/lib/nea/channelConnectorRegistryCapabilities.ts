/**
 * NEA-2:2 — Channel Connectors Registry Capabilities.
 *
 * Capability registry derived from every NEA-2:1 Foundation capability.
 * Declarations only. No runtime execution.
 *
 * Ownership: owned exclusively by NEA-2:2.
 */

import {
  ChannelConnectorFoundationId,
  ChannelConnectorFoundationPlatform,
} from "./channelConnectorFoundation.ts";
import type { ChannelConnectorRegistryEntry } from "./channelConnectorRegistryTypes.ts";

const foundation = ChannelConnectorFoundationPlatform;

/** Capability registry — Foundation capability references preserved. */
export const ChannelConnectorCapabilityRegistry: readonly ChannelConnectorRegistryEntry[] =
  Object.freeze(
    foundation.capabilities.capabilities.map((item) =>
      Object.freeze({
        id: item.capabilityId,
        label: item.capabilityName,
        description: item.description,
        sourcePhase: "NEA-2:1" as const,
        foundationReference: `${ChannelConnectorFoundationId}/capabilities/${item.capabilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Canonical immutable capability registry catalog. */
export const ChannelConnectorCapabilityRegistryCatalog = Object.freeze({
  catalogId: "NEA-2:2/CapabilityRegistry",
  sourcePhase: "NEA-2:2" as const,
  capabilities: ChannelConnectorCapabilityRegistry,
  capabilityCount: ChannelConnectorCapabilityRegistry.length,
  executesRuntime: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
