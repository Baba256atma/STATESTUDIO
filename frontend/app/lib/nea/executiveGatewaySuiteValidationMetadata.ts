/**
 * NEA-8:4 — Executive Gateway Suite Validation Metadata.
 *
 * Immutable validation metadata and inventory descriptors.
 * Counts are derived exclusively from canonical validation collections and Model.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:4.
 */

import {
  ExecutiveGatewaySuiteValidationBoundaries,
  ExecutiveGatewaySuiteValidationOwnership,
} from "./executiveGatewaySuiteValidationOwnership.ts";
import { ExecutiveGatewaySuiteValidationPolicyCatalog } from "./executiveGatewaySuiteValidationPolicies.ts";
import { ExecutiveGatewaySuiteValidationRelationshipCatalog } from "./executiveGatewaySuiteValidationRelationships.ts";
import { ExecutiveGatewaySuiteValidationRuleCatalog } from "./executiveGatewaySuiteValidationRules.ts";

/** Named inventory distinguishing created vs referenced items. */
export const ExecutiveGatewaySuiteValidationInventory = Object.freeze({
  inventoryId: "NEA-8:4/ValidationInventory",
  sourcePhase: "NEA-8:4" as const,
  createdByValidation: Object.freeze([
    Object.freeze({
      collection: "categories",
      count: ExecutiveGatewaySuiteValidationRuleCatalog.categoryCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "rules",
      count: ExecutiveGatewaySuiteValidationRuleCatalog.ruleCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count:
        ExecutiveGatewaySuiteValidationRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: ExecutiveGatewaySuiteValidationPolicyCatalog.policyCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count:
        ExecutiveGatewaySuiteValidationRuleCatalog.modelAnchors
          .domainModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "suiteComponentModels",
      count:
        ExecutiveGatewaySuiteValidationRuleCatalog.modelAnchors
          .suiteComponentModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modelRelationships",
      count:
        ExecutiveGatewaySuiteValidationRuleCatalog.modelAnchors
          .relationshipCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "publicApiInventory",
      count:
        ExecutiveGatewaySuiteValidationRuleCatalog.modelAnchors
          .publicApiInventoryTotal,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable validation metadata envelope. */
export const ExecutiveGatewaySuiteValidationMetadata = Object.freeze({
  metadataId: "NEA-8:4/ExecutiveGatewaySuiteValidationMetadata",
  sourcePhase: "NEA-8:4" as const,
  validationStatus: "Validation" as const,
  validationVersion: "1.0.0" as const,
  readiness: "ReadyForManifest" as const,
  canonicalReferenceMode: "ModelPlatformOnly" as const,
  nextPhase: "NEA-8:5 — Executive Gateway Suite Manifest",
  inventory: ExecutiveGatewaySuiteValidationInventory,
  categoryCount: ExecutiveGatewaySuiteValidationRuleCatalog.categoryCount,
  domainCategoryCount:
    ExecutiveGatewaySuiteValidationRuleCatalog.domainCategoryCount,
  ruleCount: ExecutiveGatewaySuiteValidationRuleCatalog.ruleCount,
  crossModelRuleCount:
    ExecutiveGatewaySuiteValidationRuleCatalog.crossModelRuleCount,
  platformIntegrityRuleCount:
    ExecutiveGatewaySuiteValidationRuleCatalog.platformIntegrityRuleCount,
  relationshipCount:
    ExecutiveGatewaySuiteValidationRelationshipCatalog.relationshipCount,
  policyCount: ExecutiveGatewaySuiteValidationPolicyCatalog.policyCount,
  ownershipCount: ExecutiveGatewaySuiteValidationOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewaySuiteValidationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewaySuiteValidationBoundaries.prohibitedSurfaceCount,
  publicApiInventoryTotal:
    ExecutiveGatewaySuiteValidationRuleCatalog.modelAnchors
      .publicApiInventoryTotal,
  modelAnchors: ExecutiveGatewaySuiteValidationRuleCatalog.modelAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesModelValues: false as const,
  preservesCanonicalModelReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
