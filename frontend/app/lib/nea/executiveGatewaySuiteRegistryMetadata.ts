/**
 * NEA-8:2 — Executive Gateway Suite Registry Metadata.
 *
 * Immutable registry metadata and inventory descriptors.
 * Counts are derived exclusively from canonical registry collections and Foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:2.
 */

import { ExecutiveGatewaySuiteFoundationPlatform } from "./executiveGatewaySuiteFoundation.ts";
import { ExecutiveGatewaySuiteCapabilityRegistry } from "./executiveGatewaySuiteRegistryCapabilities.ts";
import {
  SuiteComponentIdentityRegistry,
  SuiteComponentRegistry,
  SuiteContractRegistry,
  SuiteDependencyRegistry,
  SuiteLifecycleRegistry,
  SuiteStatusRegistry,
} from "./executiveGatewaySuiteRegistryCollections.ts";
import { ExecutiveGatewaySuiteRegistryPolicyRegistry } from "./executiveGatewaySuiteRegistryPolicies.ts";

const foundation = ExecutiveGatewaySuiteFoundationPlatform;

/** Named collection inventory for reporting created vs inherited items. */
export const ExecutiveGatewaySuiteRegistryInventory = Object.freeze({
  inventoryId: "NEA-8:2/RegistryInventory",
  sourcePhase: "NEA-8:2" as const,
  inheritedFromFoundation: Object.freeze([
    Object.freeze({
      collection: "components",
      count: SuiteComponentRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "componentIdentities",
      count: SuiteComponentIdentityRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: ExecutiveGatewaySuiteCapabilityRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contracts",
      count: SuiteContractRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleEntries",
      count: SuiteLifecycleRegistry.length,
      ownership: "Referenced" as const,
    }),
  ]),
  createdByRegistry: Object.freeze([
    Object.freeze({
      collection: "dependencies",
      count: SuiteDependencyRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: SuiteStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "registryPolicies",
      count: ExecutiveGatewaySuiteRegistryPolicyRegistry.length,
      ownership: "Created" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const inheritedEntryCount =
  ExecutiveGatewaySuiteRegistryInventory.inheritedFromFoundation.reduce(
    (sum, item) => sum + item.count,
    0,
  );

const createdEntryCount =
  ExecutiveGatewaySuiteRegistryInventory.createdByRegistry.reduce(
    (sum, item) => sum + item.count,
    0,
  );

/** Canonical immutable registry metadata. */
export const ExecutiveGatewaySuiteRegistryMetadata = Object.freeze({
  metadataId: "NEA-8:2/ExecutiveGatewaySuiteRegistryMetadata",
  sourcePhase: "NEA-8:2" as const,
  registryStatus: "Registry" as const,
  registryVersion: "1.0.0" as const,
  suiteVersion: foundation.identity.foundationVersion,
  readiness: "ReadyForModel" as const,
  nextPhase: "NEA-8:3 — Executive Gateway Suite Model",
  componentCount: SuiteComponentRegistry.length,
  componentIdentityCount: SuiteComponentIdentityRegistry.length,
  dependencyCount: SuiteDependencyRegistry.length,
  statusCount: SuiteStatusRegistry.length,
  registryPolicyCount: ExecutiveGatewaySuiteRegistryPolicyRegistry.length,
  contractCount: SuiteContractRegistry.length,
  capabilityCount: ExecutiveGatewaySuiteCapabilityRegistry.length,
  lifecycleEntryCount: SuiteLifecycleRegistry.length,
  publicApiInventoryTotal: foundation.inventory.publicApiInventoryTotal,
  inheritedEntryCount,
  createdEntryCount,
  totalEntryCount: inheritedEntryCount + createdEntryCount,
  inventory: ExecutiveGatewaySuiteRegistryInventory,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
