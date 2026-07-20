/**
 * NEA-4:4 — Security Gateway Validation Metadata.
 *
 * Immutable validation metadata and inventory descriptors.
 * Counts are derived exclusively from canonical validation collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:4.
 */

import {
  SecurityGatewayValidationBoundaries,
  SecurityGatewayValidationOwnership,
} from "./securityGatewayValidationOwnership.ts";
import { SecurityGatewayValidationPolicyCatalog } from "./securityGatewayValidationPolicies.ts";
import { SecurityGatewayValidationRelationshipCatalog } from "./securityGatewayValidationRelationships.ts";
import { SecurityGatewayValidationRuleCatalog } from "./securityGatewayValidationRules.ts";

/** Named inventory distinguishing created vs referenced items. */
export const SecurityGatewayValidationInventory = Object.freeze({
  inventoryId: "NEA-4:4/ValidationInventory",
  sourcePhase: "NEA-4:4" as const,
  createdByValidation: Object.freeze([
    Object.freeze({
      collection: "categories",
      count: SecurityGatewayValidationRuleCatalog.categoryCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "rules",
      count: SecurityGatewayValidationRuleCatalog.ruleCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: SecurityGatewayValidationRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: SecurityGatewayValidationPolicyCatalog.policyCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: SecurityGatewayValidationRuleCatalog.modelAnchors.domainModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "securityIdentityModels",
      count:
        SecurityGatewayValidationRuleCatalog.modelAnchors
          .securityIdentityModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "securityPrincipalModels",
      count:
        SecurityGatewayValidationRuleCatalog.modelAnchors
          .securityPrincipalModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modelRelationships",
      count:
        SecurityGatewayValidationRuleCatalog.modelAnchors.relationshipCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable validation metadata envelope. */
export const SecurityGatewayValidationMetadata = Object.freeze({
  metadataId: "NEA-4:4/SecurityGatewayValidationMetadata",
  sourcePhase: "NEA-4:4" as const,
  validationStatus: "Validation" as const,
  validationVersion: "1.0.0" as const,
  readiness: "ReadyForManifest" as const,
  nextPhase: "NEA-4:5 — Security Gateway Manifest",
  inventory: SecurityGatewayValidationInventory,
  categoryCount: SecurityGatewayValidationRuleCatalog.categoryCount,
  ruleCount: SecurityGatewayValidationRuleCatalog.ruleCount,
  relationshipCount:
    SecurityGatewayValidationRelationshipCatalog.relationshipCount,
  policyCount: SecurityGatewayValidationPolicyCatalog.policyCount,
  ownershipCount: SecurityGatewayValidationOwnership.ownsCount,
  nonOwnershipCount: SecurityGatewayValidationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SecurityGatewayValidationBoundaries.prohibitedSurfaceCount,
  modelAnchors: SecurityGatewayValidationRuleCatalog.modelAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesModelValues: false as const,
  preservesCanonicalModelReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
