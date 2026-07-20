/**
 * NEA-6:4 — Message Normalization Validation Metadata.
 *
 * Immutable validation metadata and inventory descriptors.
 * Counts are derived exclusively from canonical validation collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:4.
 */

import {
  MessageNormalizationValidationBoundaries,
  MessageNormalizationValidationOwnership,
} from "./messageNormalizationValidationOwnership.ts";
import { MessageNormalizationValidationPolicyCatalog } from "./messageNormalizationValidationPolicies.ts";
import { MessageNormalizationValidationRelationshipCatalog } from "./messageNormalizationValidationRelationships.ts";
import { MessageNormalizationValidationRuleCatalog } from "./messageNormalizationValidationRules.ts";

/** Named inventory distinguishing created vs referenced items. */
export const MessageNormalizationValidationInventory = Object.freeze({
  inventoryId: "NEA-6:4/ValidationInventory",
  sourcePhase: "NEA-6:4" as const,
  createdByValidation: Object.freeze([
    Object.freeze({
      collection: "categories",
      count: MessageNormalizationValidationRuleCatalog.categoryCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "rules",
      count: MessageNormalizationValidationRuleCatalog.ruleCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: MessageNormalizationValidationRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: MessageNormalizationValidationPolicyCatalog.policyCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count:
        MessageNormalizationValidationRuleCatalog.modelAnchors.domainModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "messageIdentityModels",
      count:
        MessageNormalizationValidationRuleCatalog.modelAnchors
          .messageIdentityModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modelRelationships",
      count:
        MessageNormalizationValidationRuleCatalog.modelAnchors.relationshipCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable validation metadata envelope. */
export const MessageNormalizationValidationMetadata = Object.freeze({
  metadataId: "NEA-6:4/MessageNormalizationValidationMetadata",
  sourcePhase: "NEA-6:4" as const,
  validationStatus: "Validation" as const,
  validationVersion: "1.0.0" as const,
  readiness: "ReadyForManifest" as const,
  nextPhase: "NEA-6:5 — Message Normalization Manifest",
  inventory: MessageNormalizationValidationInventory,
  categoryCount: MessageNormalizationValidationRuleCatalog.categoryCount,
  domainCategoryCount:
    MessageNormalizationValidationRuleCatalog.domainCategoryCount,
  ruleCount: MessageNormalizationValidationRuleCatalog.ruleCount,
  crossModelRuleCount:
    MessageNormalizationValidationRuleCatalog.crossModelRuleCount,
  platformIntegrityRuleCount:
    MessageNormalizationValidationRuleCatalog.platformIntegrityRuleCount,
  relationshipCount:
    MessageNormalizationValidationRelationshipCatalog.relationshipCount,
  policyCount: MessageNormalizationValidationPolicyCatalog.policyCount,
  ownershipCount: MessageNormalizationValidationOwnership.ownsCount,
  nonOwnershipCount: MessageNormalizationValidationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    MessageNormalizationValidationBoundaries.prohibitedSurfaceCount,
  modelAnchors: MessageNormalizationValidationRuleCatalog.modelAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesModelValues: false as const,
  preservesCanonicalModelReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
