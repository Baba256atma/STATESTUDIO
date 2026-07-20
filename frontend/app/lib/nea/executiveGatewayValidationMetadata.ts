/**
 * NEA-1:4 — Executive Gateway Validation Metadata.
 *
 * Immutable validation metadata and inventory descriptors.
 * Counts are derived exclusively from canonical validation collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:4.
 */

import {
  ExecutiveGatewayValidationBoundaries,
  ExecutiveGatewayValidationOwnership,
} from "./executiveGatewayValidationOwnership.ts";
import { ExecutiveGatewayValidationPolicyCatalog } from "./executiveGatewayValidationPolicies.ts";
import { ExecutiveGatewayValidationRelationshipCatalog } from "./executiveGatewayValidationRelationships.ts";
import { ExecutiveGatewayValidationRuleCatalog } from "./executiveGatewayValidationRules.ts";

/** Named inventory distinguishing created vs referenced items. */
export const ExecutiveGatewayValidationInventory = Object.freeze({
  inventoryId: "NEA-1:4/ValidationInventory",
  sourcePhase: "NEA-1:4" as const,
  createdByValidation: Object.freeze([
    Object.freeze({
      collection: "categories",
      count: ExecutiveGatewayValidationRuleCatalog.categoryCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "rules",
      count: ExecutiveGatewayValidationRuleCatalog.ruleCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: ExecutiveGatewayValidationRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: ExecutiveGatewayValidationPolicyCatalog.policyCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: ExecutiveGatewayValidationRuleCatalog.modelAnchors.domainModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modelRelationships",
      count: ExecutiveGatewayValidationRuleCatalog.modelAnchors.relationshipCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable validation metadata envelope. */
export const ExecutiveGatewayValidationMetadata = Object.freeze({
  metadataId: "NEA-1:4/ExecutiveGatewayValidationMetadata",
  sourcePhase: "NEA-1:4" as const,
  inventory: ExecutiveGatewayValidationInventory,
  categoryCount: ExecutiveGatewayValidationRuleCatalog.categoryCount,
  ruleCount: ExecutiveGatewayValidationRuleCatalog.ruleCount,
  relationshipCount:
    ExecutiveGatewayValidationRelationshipCatalog.relationshipCount,
  policyCount: ExecutiveGatewayValidationPolicyCatalog.policyCount,
  ownershipCount: ExecutiveGatewayValidationOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewayValidationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewayValidationBoundaries.prohibitedSurfaceCount,
  modelAnchors: ExecutiveGatewayValidationRuleCatalog.modelAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesModelValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
