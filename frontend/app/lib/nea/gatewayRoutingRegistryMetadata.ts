/**
 * NEA-5:2 — Gateway Routing Registry Metadata.
 *
 * Immutable registry metadata and inventory descriptors.
 * Counts are derived exclusively from canonical registry collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:2.
 */

import { GatewayRoutingCapabilityRegistry } from "./gatewayRoutingRegistryCapabilities.ts";
import {
  RoutingContextRegistry,
  RoutingContractRegistry,
  RoutingDecisionRegistry,
  RoutingDestinationRegistry,
  RoutingIdentityRegistry,
  RoutingLifecycleRegistry,
  RoutingPolicyVocabularyRegistry,
  RoutingPriorityRegistry,
  RoutingResultRegistry,
  RoutingStatusRegistry,
  RoutingStrategyRegistry,
} from "./gatewayRoutingRegistryCollections.ts";
import { GatewayRoutingRegistryPolicyRegistry } from "./gatewayRoutingRegistryPolicies.ts";

/** Named collection inventory for reporting created vs inherited items. */
export const GatewayRoutingRegistryInventory = Object.freeze({
  inventoryId: "NEA-5:2/RegistryInventory",
  sourcePhase: "NEA-5:2" as const,
  inheritedFromFoundation: Object.freeze([
    Object.freeze({
      collection: "destinations",
      count: RoutingDestinationRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "decisions",
      count: RoutingDecisionRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contexts",
      count: RoutingContextRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contracts",
      count: RoutingContractRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: GatewayRoutingCapabilityRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleEntries",
      count: RoutingLifecycleRegistry.length,
      ownership: "Referenced" as const,
    }),
  ]),
  createdByRegistry: Object.freeze([
    Object.freeze({
      collection: "routeIdentities",
      count: RoutingIdentityRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "strategies",
      count: RoutingStrategyRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "priorities",
      count: RoutingPriorityRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: RoutingStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "results",
      count: RoutingResultRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "routingPolicies",
      count: RoutingPolicyVocabularyRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "registryPolicies",
      count: GatewayRoutingRegistryPolicyRegistry.length,
      ownership: "Created" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const inheritedEntryCount =
  GatewayRoutingRegistryInventory.inheritedFromFoundation.reduce(
    (sum, item) => sum + item.count,
    0,
  );

const createdEntryCount =
  GatewayRoutingRegistryInventory.createdByRegistry.reduce(
    (sum, item) => sum + item.count,
    0,
  );

/** Canonical immutable registry metadata. */
export const GatewayRoutingRegistryMetadata = Object.freeze({
  metadataId: "NEA-5:2/GatewayRoutingRegistryMetadata",
  sourcePhase: "NEA-5:2" as const,
  registryStatus: "Registry" as const,
  registryVersion: "1.0.0" as const,
  readiness: "ReadyForModel" as const,
  nextPhase: "NEA-5:3 — Gateway Routing Model",
  routeIdentityCount: RoutingIdentityRegistry.length,
  destinationCount: RoutingDestinationRegistry.length,
  decisionCount: RoutingDecisionRegistry.length,
  strategyCount: RoutingStrategyRegistry.length,
  priorityCount: RoutingPriorityRegistry.length,
  statusCount: RoutingStatusRegistry.length,
  resultCount: RoutingResultRegistry.length,
  contextCount: RoutingContextRegistry.length,
  routingPolicyCount: RoutingPolicyVocabularyRegistry.length,
  contractCount: RoutingContractRegistry.length,
  capabilityCount: GatewayRoutingCapabilityRegistry.length,
  lifecycleEntryCount: RoutingLifecycleRegistry.length,
  registryPolicyCount: GatewayRoutingRegistryPolicyRegistry.length,
  inheritedEntryCount,
  createdEntryCount,
  totalEntryCount: inheritedEntryCount + createdEntryCount,
  inventory: GatewayRoutingRegistryInventory,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
