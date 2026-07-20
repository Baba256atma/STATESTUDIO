/**
 * NEA-7:3 — Intake Orchestration Model Metadata.
 *
 * Immutable model metadata and inventory descriptors.
 * Counts are derived exclusively from canonical model collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:3.
 */

import { IntakeOrchestrationModelLifecycle } from "./intakeOrchestrationModelLifecycle.ts";
import {
  IntakeOrchestrationModelBoundaries,
  IntakeOrchestrationModelOwnership,
} from "./intakeOrchestrationModelOwnership.ts";
import {
  IntakeOrchestrationDomainModelCatalog,
  IntakeOrchestrationModelRegistryAnchors,
} from "./intakeOrchestrationModels.ts";
import { IntakeOrchestrationModelRelationshipCatalog } from "./intakeOrchestrationRelationships.ts";
import { IntakeOrchestrationRegistryVersion } from "./intakeOrchestrationRegistry.ts";

/** Named inventory distinguishing created vs referenced items. */
export const IntakeOrchestrationModelInventory = Object.freeze({
  inventoryId: "NEA-7:3/ModelInventory",
  sourcePhase: "NEA-7:3" as const,
  createdByModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: IntakeOrchestrationDomainModelCatalog.modelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "intakeIdentityModels",
      count: IntakeOrchestrationDomainModelCatalog.intakeIdentityModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: IntakeOrchestrationModelRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: IntakeOrchestrationModelLifecycle.stateCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromRegistry: Object.freeze([
    Object.freeze({
      collection: "intakeIdentities",
      count: IntakeOrchestrationModelRegistryAnchors.intakeIdentityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "categories",
      count: IntakeOrchestrationModelRegistryAnchors.categoryCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "priorities",
      count: IntakeOrchestrationModelRegistryAnchors.priorityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: IntakeOrchestrationModelRegistryAnchors.statusCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "referenceTypes",
      count: IntakeOrchestrationModelRegistryAnchors.referenceTypeCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "metadataFields",
      count: IntakeOrchestrationModelRegistryAnchors.metadataFieldCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contracts",
      count: IntakeOrchestrationModelRegistryAnchors.contractCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: IntakeOrchestrationModelRegistryAnchors.capabilityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "registryPolicies",
      count: IntakeOrchestrationModelRegistryAnchors.registryPolicyCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable model metadata. */
export const IntakeOrchestrationModelMetadata = Object.freeze({
  metadataId: "NEA-7:3/IntakeOrchestrationModelMetadata",
  sourcePhase: "NEA-7:3" as const,
  modelStatus: "Model" as const,
  modelVersion: "1.0.0" as const,
  registryVersion: IntakeOrchestrationRegistryVersion,
  readiness: "ReadyForValidation" as const,
  nextPhase: "NEA-7:4 — Intake Orchestration Validation",
  domainModelCount: IntakeOrchestrationDomainModelCatalog.modelCount,
  intakeIdentityModelCount:
    IntakeOrchestrationDomainModelCatalog.intakeIdentityModelCount,
  relationshipCount:
    IntakeOrchestrationModelRelationshipCatalog.relationshipCount,
  lifecycleStateCount: IntakeOrchestrationModelLifecycle.stateCount,
  ownershipCount: IntakeOrchestrationModelOwnership.ownsCount,
  nonOwnershipCount: IntakeOrchestrationModelOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    IntakeOrchestrationModelBoundaries.prohibitedSurfaceCount,
  inventory: IntakeOrchestrationModelInventory,
  registryAnchors: IntakeOrchestrationModelRegistryAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesRegistryValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
