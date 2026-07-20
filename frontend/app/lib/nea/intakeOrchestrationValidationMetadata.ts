/**
 * NEA-7:4 — Intake Orchestration Validation Metadata.
 *
 * Immutable validation metadata and inventory descriptors.
 * Counts are derived exclusively from canonical validation collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:4.
 */

import {
  IntakeOrchestrationValidationBoundaries,
  IntakeOrchestrationValidationOwnership,
} from "./intakeOrchestrationValidationOwnership.ts";
import { IntakeOrchestrationValidationPolicyCatalog } from "./intakeOrchestrationValidationPolicies.ts";
import { IntakeOrchestrationValidationRelationshipCatalog } from "./intakeOrchestrationValidationRelationships.ts";
import { IntakeOrchestrationValidationRuleCatalog } from "./intakeOrchestrationValidationRules.ts";

/** Named inventory distinguishing created vs referenced items. */
export const IntakeOrchestrationValidationInventory = Object.freeze({
  inventoryId: "NEA-7:4/ValidationInventory",
  sourcePhase: "NEA-7:4" as const,
  createdByValidation: Object.freeze([
    Object.freeze({
      collection: "categories",
      count: IntakeOrchestrationValidationRuleCatalog.categoryCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "rules",
      count: IntakeOrchestrationValidationRuleCatalog.ruleCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: IntakeOrchestrationValidationRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: IntakeOrchestrationValidationPolicyCatalog.policyCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count:
        IntakeOrchestrationValidationRuleCatalog.modelAnchors.domainModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "intakeIdentityModels",
      count:
        IntakeOrchestrationValidationRuleCatalog.modelAnchors
          .intakeIdentityModelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modelRelationships",
      count:
        IntakeOrchestrationValidationRuleCatalog.modelAnchors.relationshipCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable validation metadata envelope. */
export const IntakeOrchestrationValidationMetadata = Object.freeze({
  metadataId: "NEA-7:4/IntakeOrchestrationValidationMetadata",
  sourcePhase: "NEA-7:4" as const,
  validationStatus: "Validation" as const,
  validationVersion: "1.0.0" as const,
  readiness: "ReadyForManifest" as const,
  nextPhase: "NEA-7:5 — Intake Orchestration Manifest",
  inventory: IntakeOrchestrationValidationInventory,
  categoryCount: IntakeOrchestrationValidationRuleCatalog.categoryCount,
  domainCategoryCount:
    IntakeOrchestrationValidationRuleCatalog.domainCategoryCount,
  ruleCount: IntakeOrchestrationValidationRuleCatalog.ruleCount,
  crossModelRuleCount:
    IntakeOrchestrationValidationRuleCatalog.crossModelRuleCount,
  platformIntegrityRuleCount:
    IntakeOrchestrationValidationRuleCatalog.platformIntegrityRuleCount,
  relationshipCount:
    IntakeOrchestrationValidationRelationshipCatalog.relationshipCount,
  policyCount: IntakeOrchestrationValidationPolicyCatalog.policyCount,
  ownershipCount: IntakeOrchestrationValidationOwnership.ownsCount,
  nonOwnershipCount: IntakeOrchestrationValidationOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    IntakeOrchestrationValidationBoundaries.prohibitedSurfaceCount,
  modelAnchors: IntakeOrchestrationValidationRuleCatalog.modelAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesModelValues: false as const,
  preservesCanonicalModelReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
