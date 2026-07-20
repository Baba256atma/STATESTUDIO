/**
 * NEA-5:4 — Gateway Routing Validation Metadata.
 *
 * Immutable validation metadata and inventory descriptors.
 * Counts are derived exclusively from canonical validation collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:4.
 */

import {
  GatewayRoutingValidationBoundaries,
  GatewayRoutingValidationOwnership,
} from "./gatewayRoutingValidationOwnership.ts";
import { GatewayRoutingValidationPolicyCatalog } from "./gatewayRoutingValidationPolicies.ts";
import { GatewayRoutingValidationRelationshipCatalog } from "./gatewayRoutingValidationRelationships.ts";
import { GatewayRoutingValidationRuleCatalog } from "./gatewayRoutingValidationRules.ts";

/** Named inventory distinguishing created vs referenced items. */
export const GatewayRoutingValidationInventory = Object.freeze({
  inventoryId: "NEA-5:4/ValidationInventory",
  sourcePhase: "NEA-5:4" as const,
  createdByValidation: Object.freeze([
    Object.freeze({
      collection: "categories",
      count: GatewayRoutingValidationRuleCatalog.categoryCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "rules",
      count: GatewayRoutingValidationRuleCatalog.ruleCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: GatewayRoutingValidationRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: GatewayRoutingValidationPolicyCatalog.policyCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: GatewayRoutingValidationRuleCatalog.modelAnchors.domainModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "routeIdentityModels",
      count:
        GatewayRoutingValidationRuleCatalog.modelAnchors
          .routeIdentityModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modelRelationships",
      count:
        GatewayRoutingValidationRuleCatalog.modelAnchors.relationshipCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable validation metadata envelope. */
export const GatewayRoutingValidationMetadata = Object.freeze({
  metadataId: "NEA-5:4/GatewayRoutingValidationMetadata",
  sourcePhase: "NEA-5:4" as const,
  validationStatus: "Validation" as const,
  validationVersion: "1.0.0" as const,
  readiness: "ReadyForManifest" as const,
  nextPhase: "NEA-5:5 — Gateway Routing Manifest",
  inventory: GatewayRoutingValidationInventory,
  categoryCount: GatewayRoutingValidationRuleCatalog.categoryCount,
  ruleCount: GatewayRoutingValidationRuleCatalog.ruleCount,
  relationshipCount:
    GatewayRoutingValidationRelationshipCatalog.relationshipCount,
  policyCount: GatewayRoutingValidationPolicyCatalog.policyCount,
  ownershipCount: GatewayRoutingValidationOwnership.ownsCount,
  nonOwnershipCount: GatewayRoutingValidationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    GatewayRoutingValidationBoundaries.prohibitedSurfaceCount,
  modelAnchors: GatewayRoutingValidationRuleCatalog.modelAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesModelValues: false as const,
  preservesCanonicalModelReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
