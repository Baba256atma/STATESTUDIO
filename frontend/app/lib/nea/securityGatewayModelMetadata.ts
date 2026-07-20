/**
 * NEA-4:3 — Security Gateway Model Metadata.
 *
 * Immutable model metadata and inventory descriptors.
 * Counts are derived exclusively from canonical model collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:3.
 */

import { SecurityGatewayModelLifecycle } from "./securityGatewayModelLifecycle.ts";
import {
  SecurityGatewayModelBoundaries,
  SecurityGatewayModelOwnership,
} from "./securityGatewayModelOwnership.ts";
import {
  SecurityGatewayDomainModelCatalog,
  SecurityGatewayModelRegistryAnchors,
} from "./securityGatewayModels.ts";
import { SecurityGatewayModelRelationshipCatalog } from "./securityGatewayRelationships.ts";

/** Named inventory distinguishing created vs referenced items. */
export const SecurityGatewayModelInventory = Object.freeze({
  inventoryId: "NEA-4:3/ModelInventory",
  sourcePhase: "NEA-4:3" as const,
  createdByModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: SecurityGatewayDomainModelCatalog.modelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "securityIdentityModels",
      count: SecurityGatewayDomainModelCatalog.securityIdentityModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "securityPrincipalModels",
      count: SecurityGatewayDomainModelCatalog.securityPrincipalModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: SecurityGatewayModelRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: SecurityGatewayModelLifecycle.stateCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromRegistry: Object.freeze([
    Object.freeze({
      collection: "securityIdentities",
      count: SecurityGatewayModelRegistryAnchors.securityIdentityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "roles",
      count: SecurityGatewayModelRegistryAnchors.roleCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "permissions",
      count: SecurityGatewayModelRegistryAnchors.permissionCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "classifications",
      count: SecurityGatewayModelRegistryAnchors.classificationCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "securityPolicies",
      count: SecurityGatewayModelRegistryAnchors.securityPolicyCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "authenticationMethods",
      count: SecurityGatewayModelRegistryAnchors.authenticationMethodCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: SecurityGatewayModelRegistryAnchors.capabilityCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable model metadata. */
export const SecurityGatewayModelMetadata = Object.freeze({
  metadataId: "NEA-4:3/SecurityGatewayModelMetadata",
  sourcePhase: "NEA-4:3" as const,
  modelStatus: "Model" as const,
  modelVersion: "1.0.0" as const,
  readiness: "ReadyForValidation" as const,
  nextPhase: "NEA-4:4 — Security Gateway Validation",
  domainModelCount: SecurityGatewayDomainModelCatalog.modelCount,
  securityIdentityModelCount:
    SecurityGatewayDomainModelCatalog.securityIdentityModelCount,
  securityPrincipalModelCount:
    SecurityGatewayDomainModelCatalog.securityPrincipalModelCount,
  relationshipCount: SecurityGatewayModelRelationshipCatalog.relationshipCount,
  lifecycleStateCount: SecurityGatewayModelLifecycle.stateCount,
  ownershipCount: SecurityGatewayModelOwnership.ownsCount,
  nonOwnershipCount: SecurityGatewayModelOwnership.doesNotOwnCount,
  prohibitedSurfaceCount: SecurityGatewayModelBoundaries.prohibitedSurfaceCount,
  inventory: SecurityGatewayModelInventory,
  registryAnchors: SecurityGatewayModelRegistryAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
