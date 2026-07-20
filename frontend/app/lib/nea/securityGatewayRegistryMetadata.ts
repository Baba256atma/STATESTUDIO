/**
 * NEA-4:2 — Security Gateway Registry Metadata.
 *
 * Immutable registry metadata and inventory descriptors.
 * Counts are derived exclusively from canonical registry collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:2.
 */

import { SecurityGatewayCapabilityRegistry } from "./securityGatewayRegistryCapabilities.ts";
import {
  SecurityAuthenticationMethodRegistry,
  SecurityAuthorizationLevelRegistry,
  SecurityClassificationRegistry,
  SecurityConsentStateRegistry,
  SecurityContextTypeRegistry,
  SecurityContractRegistry,
  SecurityEventRegistry,
  SecurityIdentityRegistry,
  SecurityLifecycleRegistry,
  SecurityPermissionRegistry,
  SecurityPolicyVocabularyRegistry,
  SecurityRoleRegistry,
  SecurityStatusRegistry,
  SecurityTrustLevelRegistry,
} from "./securityGatewayRegistryCollections.ts";
import { SecurityGatewayRegistryPolicyRegistry } from "./securityGatewayRegistryPolicies.ts";

/** Named collection inventory for reporting created vs inherited items. */
export const SecurityGatewayRegistryInventory = Object.freeze({
  inventoryId: "NEA-4:2/RegistryInventory",
  sourcePhase: "NEA-4:2" as const,
  inheritedFromFoundation: Object.freeze([
    Object.freeze({
      collection: "contracts",
      count: SecurityContractRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: SecurityGatewayCapabilityRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleEntries",
      count: SecurityLifecycleRegistry.length,
      ownership: "Referenced" as const,
    }),
  ]),
  createdByRegistry: Object.freeze([
    Object.freeze({
      collection: "securityIdentities",
      count: SecurityIdentityRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "classifications",
      count: SecurityClassificationRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "authenticationMethods",
      count: SecurityAuthenticationMethodRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "authorizationLevels",
      count: SecurityAuthorizationLevelRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "trustLevels",
      count: SecurityTrustLevelRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "consentStates",
      count: SecurityConsentStateRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "roles",
      count: SecurityRoleRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "permissions",
      count: SecurityPermissionRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "securityPolicies",
      count: SecurityPolicyVocabularyRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: SecurityStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "events",
      count: SecurityEventRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "contextTypes",
      count: SecurityContextTypeRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "registryPolicies",
      count: SecurityGatewayRegistryPolicyRegistry.length,
      ownership: "Created" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const inheritedEntryCount =
  SecurityGatewayRegistryInventory.inheritedFromFoundation.reduce(
    (sum, item) => sum + item.count,
    0,
  );

const createdEntryCount =
  SecurityGatewayRegistryInventory.createdByRegistry.reduce(
    (sum, item) => sum + item.count,
    0,
  );

/** Canonical immutable registry metadata. */
export const SecurityGatewayRegistryMetadata = Object.freeze({
  metadataId: "NEA-4:2/SecurityGatewayRegistryMetadata",
  sourcePhase: "NEA-4:2" as const,
  registryStatus: "Registry" as const,
  registryVersion: "1.0.0" as const,
  readiness: "ReadyForModel" as const,
  nextPhase: "NEA-4:3 — Security Gateway Model",
  securityIdentityCount: SecurityIdentityRegistry.length,
  classificationCount: SecurityClassificationRegistry.length,
  authenticationMethodCount: SecurityAuthenticationMethodRegistry.length,
  authorizationLevelCount: SecurityAuthorizationLevelRegistry.length,
  trustLevelCount: SecurityTrustLevelRegistry.length,
  consentStateCount: SecurityConsentStateRegistry.length,
  roleCount: SecurityRoleRegistry.length,
  permissionCount: SecurityPermissionRegistry.length,
  securityPolicyCount: SecurityPolicyVocabularyRegistry.length,
  statusCount: SecurityStatusRegistry.length,
  eventCount: SecurityEventRegistry.length,
  contextTypeCount: SecurityContextTypeRegistry.length,
  contractCount: SecurityContractRegistry.length,
  capabilityCount: SecurityGatewayCapabilityRegistry.length,
  lifecycleEntryCount: SecurityLifecycleRegistry.length,
  registryPolicyCount: SecurityGatewayRegistryPolicyRegistry.length,
  inheritedEntryCount,
  createdEntryCount,
  totalEntryCount: inheritedEntryCount + createdEntryCount,
  inventory: SecurityGatewayRegistryInventory,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
