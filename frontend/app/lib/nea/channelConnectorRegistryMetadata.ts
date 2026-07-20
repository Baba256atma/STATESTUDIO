/**
 * NEA-2:2 — Channel Connectors Registry Metadata.
 *
 * Immutable registry metadata and inventory descriptors.
 * Counts are derived exclusively from canonical registry collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:2.
 */

import { ChannelConnectorCapabilityRegistry } from "./channelConnectorRegistryCapabilities.ts";
import {
  ChannelConnectorAuthenticationMethodRegistry,
  ChannelConnectorDirectionRegistry,
  ChannelConnectorEventTypeRegistry,
  ChannelConnectorFamilyRegistry,
  ChannelConnectorHealthRegistry,
  ChannelConnectorIdentityRegistry,
  ChannelConnectorLifecycleRegistry,
  ChannelConnectorPayloadTypeRegistry,
  ChannelConnectorProtocolRegistry,
  ChannelConnectorStatusRegistry,
  ChannelConnectorTypeRegistry,
} from "./channelConnectorRegistryCollections.ts";
import { ChannelConnectorPolicyRegistry } from "./channelConnectorRegistryPolicies.ts";

/** Named collection inventory for reporting created vs inherited items. */
export const ChannelConnectorRegistryInventory = Object.freeze({
  inventoryId: "NEA-2:2/RegistryInventory",
  sourcePhase: "NEA-2:2" as const,
  inheritedFromFoundation: Object.freeze([
    Object.freeze({
      collection: "families",
      count: ChannelConnectorFamilyRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "types",
      count: ChannelConnectorTypeRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: ChannelConnectorLifecycleRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: ChannelConnectorCapabilityRegistry.length,
      ownership: "Referenced" as const,
    }),
  ]),
  createdByRegistry: Object.freeze([
    Object.freeze({
      collection: "identities",
      count: ChannelConnectorIdentityRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "protocols",
      count: ChannelConnectorProtocolRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "directions",
      count: ChannelConnectorDirectionRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "authenticationMethods",
      count: ChannelConnectorAuthenticationMethodRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "healthStates",
      count: ChannelConnectorHealthRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: ChannelConnectorStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "eventTypes",
      count: ChannelConnectorEventTypeRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "payloadTypes",
      count: ChannelConnectorPayloadTypeRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: ChannelConnectorPolicyRegistry.length,
      ownership: "Created" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const inheritedEntryCount =
  ChannelConnectorRegistryInventory.inheritedFromFoundation.reduce(
    (sum, item) => sum + item.count,
    0,
  );

const createdEntryCount =
  ChannelConnectorRegistryInventory.createdByRegistry.reduce(
    (sum, item) => sum + item.count,
    0,
  );

/** Canonical immutable registry metadata. */
export const ChannelConnectorRegistryMetadata = Object.freeze({
  metadataId: "NEA-2:2/ChannelConnectorRegistryMetadata",
  sourcePhase: "NEA-2:2" as const,
  registryStatus: "Registry" as const,
  registryVersion: "1.0.0" as const,
  readiness: "ReadyForModel" as const,
  nextPhase: "NEA-2:3 — Channel Connectors Model",
  familyCount: ChannelConnectorFamilyRegistry.length,
  typeCount: ChannelConnectorTypeRegistry.length,
  identityCount: ChannelConnectorIdentityRegistry.length,
  protocolCount: ChannelConnectorProtocolRegistry.length,
  directionCount: ChannelConnectorDirectionRegistry.length,
  authenticationMethodCount:
    ChannelConnectorAuthenticationMethodRegistry.length,
  capabilityCount: ChannelConnectorCapabilityRegistry.length,
  lifecycleStateCount: ChannelConnectorLifecycleRegistry.length,
  healthStateCount: ChannelConnectorHealthRegistry.length,
  statusCount: ChannelConnectorStatusRegistry.length,
  eventTypeCount: ChannelConnectorEventTypeRegistry.length,
  payloadTypeCount: ChannelConnectorPayloadTypeRegistry.length,
  policyCount: ChannelConnectorPolicyRegistry.length,
  inheritedEntryCount,
  createdEntryCount,
  totalEntryCount: inheritedEntryCount + createdEntryCount,
  inventory: ChannelConnectorRegistryInventory,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
