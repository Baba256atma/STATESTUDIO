/**
 * NEA-1:2 — Executive Gateway Registry Metadata.
 *
 * Immutable registry metadata and inventory descriptors.
 * Counts are derived exclusively from canonical registry collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:2.
 */

import { ExecutiveGatewayCapabilityRegistry } from "./executiveGatewayRegistryCapabilities.ts";
import {
  ExecutiveGatewayAuthenticationMethodRegistry,
  ExecutiveGatewayAuthorizationStatusRegistry,
  ExecutiveGatewayChannelRegistry,
  ExecutiveGatewayConsentStatusRegistry,
  ExecutiveGatewayDiagnosticCategoryRegistry,
  ExecutiveGatewayLifecycleRegistry,
  ExecutiveGatewayModalityRegistry,
  ExecutiveGatewayRoutingRegistry,
  ExecutiveGatewaySenderRegistry,
  ExecutiveGatewaySourceFamilyRegistry,
  ExecutiveGatewayTrustLevelRegistry,
  ExecutiveGatewayValidationStatusRegistry,
} from "./executiveGatewayRegistryCollections.ts";
import { ExecutiveGatewayPolicyRegistry } from "./executiveGatewayRegistryPolicies.ts";

/** Named collection inventory for reporting created vs inherited items. */
export const ExecutiveGatewayRegistryInventory = Object.freeze({
  inventoryId: "NEA-1:2/RegistryInventory",
  sourcePhase: "NEA-1:2" as const,
  inheritedFromFoundation: Object.freeze([
    Object.freeze({
      collection: "sourceFamilies",
      count: ExecutiveGatewaySourceFamilyRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "channels",
      count: ExecutiveGatewayChannelRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modalities",
      count: ExecutiveGatewayModalityRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "senders",
      count: ExecutiveGatewaySenderRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "routingDestinations",
      count: ExecutiveGatewayRoutingRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: ExecutiveGatewayLifecycleRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: ExecutiveGatewayCapabilityRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: ExecutiveGatewayPolicyRegistry.length,
      ownership: "Referenced" as const,
    }),
  ]),
  createdByRegistry: Object.freeze([
    Object.freeze({
      collection: "authenticationMethods",
      count: ExecutiveGatewayAuthenticationMethodRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "authorizationStatuses",
      count: ExecutiveGatewayAuthorizationStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "trustLevels",
      count: ExecutiveGatewayTrustLevelRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "consentStatuses",
      count: ExecutiveGatewayConsentStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "validationStatuses",
      count: ExecutiveGatewayValidationStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "diagnosticCategories",
      count: ExecutiveGatewayDiagnosticCategoryRegistry.length,
      ownership: "Created" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Derived total entry count across all canonical registry collections. */
export const ExecutiveGatewayRegistryTotalEntryCount =
  ExecutiveGatewaySourceFamilyRegistry.length +
  ExecutiveGatewayChannelRegistry.length +
  ExecutiveGatewayModalityRegistry.length +
  ExecutiveGatewaySenderRegistry.length +
  ExecutiveGatewayAuthenticationMethodRegistry.length +
  ExecutiveGatewayAuthorizationStatusRegistry.length +
  ExecutiveGatewayTrustLevelRegistry.length +
  ExecutiveGatewayConsentStatusRegistry.length +
  ExecutiveGatewayValidationStatusRegistry.length +
  ExecutiveGatewayRoutingRegistry.length +
  ExecutiveGatewayLifecycleRegistry.length +
  ExecutiveGatewayCapabilityRegistry.length +
  ExecutiveGatewayPolicyRegistry.length +
  ExecutiveGatewayDiagnosticCategoryRegistry.length;

/** Canonical immutable registry metadata envelope. */
export const ExecutiveGatewayRegistryMetadata = Object.freeze({
  metadataId: "NEA-1:2/ExecutiveGatewayRegistryMetadata",
  sourcePhase: "NEA-1:2" as const,
  inventory: ExecutiveGatewayRegistryInventory,
  totalEntryCount: ExecutiveGatewayRegistryTotalEntryCount,
  sourceFamilyCount: ExecutiveGatewaySourceFamilyRegistry.length,
  channelTypeCount: ExecutiveGatewayChannelRegistry.length,
  modalityCount: ExecutiveGatewayModalityRegistry.length,
  senderKindCount: ExecutiveGatewaySenderRegistry.length,
  authenticationMethodCount:
    ExecutiveGatewayAuthenticationMethodRegistry.length,
  authorizationStatusCount:
    ExecutiveGatewayAuthorizationStatusRegistry.length,
  trustLevelCount: ExecutiveGatewayTrustLevelRegistry.length,
  consentStatusCount: ExecutiveGatewayConsentStatusRegistry.length,
  validationStatusCount: ExecutiveGatewayValidationStatusRegistry.length,
  routingDestinationCount: ExecutiveGatewayRoutingRegistry.length,
  lifecycleStateCount: ExecutiveGatewayLifecycleRegistry.length,
  capabilityCount: ExecutiveGatewayCapabilityRegistry.length,
  policyCount: ExecutiveGatewayPolicyRegistry.length,
  diagnosticCategoryCount: ExecutiveGatewayDiagnosticCategoryRegistry.length,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  countsDuplicated: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
