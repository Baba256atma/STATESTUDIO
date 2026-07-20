/**
 * NEA-3:4 — Session & Conversation Validation Metadata.
 *
 * Immutable validation metadata and inventory descriptors.
 * Counts are derived exclusively from canonical validation collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:4.
 */

import {
  SessionConversationValidationBoundaries,
  SessionConversationValidationOwnership,
} from "./sessionConversationValidationOwnership.ts";
import { SessionConversationValidationPolicyCatalog } from "./sessionConversationValidationPolicies.ts";
import { SessionConversationValidationRelationshipCatalog } from "./sessionConversationValidationRelationships.ts";
import { SessionConversationValidationRuleCatalog } from "./sessionConversationValidationRules.ts";

/** Named inventory distinguishing created vs referenced items. */
export const SessionConversationValidationInventory = Object.freeze({
  inventoryId: "NEA-3:4/ValidationInventory",
  sourcePhase: "NEA-3:4" as const,
  createdByValidation: Object.freeze([
    Object.freeze({
      collection: "categories",
      count: SessionConversationValidationRuleCatalog.categoryCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "rules",
      count: SessionConversationValidationRuleCatalog.ruleCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: SessionConversationValidationRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: SessionConversationValidationPolicyCatalog.policyCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count:
        SessionConversationValidationRuleCatalog.modelAnchors.domainModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "sessionIdentityModels",
      count:
        SessionConversationValidationRuleCatalog.modelAnchors
          .sessionIdentityModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "conversationIdentityModels",
      count:
        SessionConversationValidationRuleCatalog.modelAnchors
          .conversationIdentityModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modelRelationships",
      count:
        SessionConversationValidationRuleCatalog.modelAnchors.relationshipCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable validation metadata envelope. */
export const SessionConversationValidationMetadata = Object.freeze({
  metadataId: "NEA-3:4/SessionConversationValidationMetadata",
  sourcePhase: "NEA-3:4" as const,
  validationStatus: "Validation" as const,
  validationVersion: "1.0.0" as const,
  readiness: "ReadyForManifest" as const,
  nextPhase: "NEA-3:5 — Session & Conversation Manifest",
  inventory: SessionConversationValidationInventory,
  categoryCount: SessionConversationValidationRuleCatalog.categoryCount,
  ruleCount: SessionConversationValidationRuleCatalog.ruleCount,
  relationshipCount:
    SessionConversationValidationRelationshipCatalog.relationshipCount,
  policyCount: SessionConversationValidationPolicyCatalog.policyCount,
  ownershipCount: SessionConversationValidationOwnership.ownsCount,
  nonOwnershipCount: SessionConversationValidationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SessionConversationValidationBoundaries.prohibitedSurfaceCount,
  modelAnchors: SessionConversationValidationRuleCatalog.modelAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesModelValues: false as const,
  preservesCanonicalModelReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
