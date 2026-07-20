/**
 * NEA-2:4 — Channel Connectors Validation Metadata.
 *
 * Immutable validation metadata and inventory descriptors.
 * Counts are derived exclusively from canonical validation collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:4.
 */

import {
  ChannelConnectorValidationBoundaries,
  ChannelConnectorValidationOwnership,
} from "./channelConnectorValidationOwnership.ts";
import { ChannelConnectorValidationPolicyCatalog } from "./channelConnectorValidationPolicies.ts";
import { ChannelConnectorValidationRelationshipCatalog } from "./channelConnectorValidationRelationships.ts";
import { ChannelConnectorValidationRuleCatalog } from "./channelConnectorValidationRules.ts";

/** Named inventory distinguishing created vs referenced items. */
export const ChannelConnectorValidationInventory = Object.freeze({
  inventoryId: "NEA-2:4/ValidationInventory",
  sourcePhase: "NEA-2:4" as const,
  createdByValidation: Object.freeze([
    Object.freeze({
      collection: "categories",
      count: ChannelConnectorValidationRuleCatalog.categoryCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "rules",
      count: ChannelConnectorValidationRuleCatalog.ruleCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: ChannelConnectorValidationRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: ChannelConnectorValidationPolicyCatalog.policyCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count:
        ChannelConnectorValidationRuleCatalog.modelAnchors.domainModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "identityModels",
      count:
        ChannelConnectorValidationRuleCatalog.modelAnchors.identityModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modelRelationships",
      count:
        ChannelConnectorValidationRuleCatalog.modelAnchors.relationshipCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable validation metadata envelope. */
export const ChannelConnectorValidationMetadata = Object.freeze({
  metadataId: "NEA-2:4/ChannelConnectorValidationMetadata",
  sourcePhase: "NEA-2:4" as const,
  validationStatus: "Validation" as const,
  validationVersion: "1.0.0" as const,
  readiness: "ReadyForManifest" as const,
  nextPhase: "NEA-2:5 — Channel Connectors Manifest",
  inventory: ChannelConnectorValidationInventory,
  categoryCount: ChannelConnectorValidationRuleCatalog.categoryCount,
  ruleCount: ChannelConnectorValidationRuleCatalog.ruleCount,
  relationshipCount:
    ChannelConnectorValidationRelationshipCatalog.relationshipCount,
  policyCount: ChannelConnectorValidationPolicyCatalog.policyCount,
  ownershipCount: ChannelConnectorValidationOwnership.ownsCount,
  nonOwnershipCount: ChannelConnectorValidationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ChannelConnectorValidationBoundaries.prohibitedSurfaceCount,
  modelAnchors: ChannelConnectorValidationRuleCatalog.modelAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesModelValues: false as const,
  preservesCanonicalModelReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
