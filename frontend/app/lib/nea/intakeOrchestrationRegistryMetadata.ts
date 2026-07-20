/**
 * NEA-7:2 — Intake Orchestration Registry Metadata.
 *
 * Immutable registry metadata and inventory descriptors.
 * Counts are derived exclusively from canonical registry collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:2.
 */

import { IntakeOrchestrationCapabilityRegistry } from "./intakeOrchestrationRegistryCapabilities.ts";
import {
  IntakeCategoryRegistry,
  IntakeContractRegistry,
  IntakeIdentityRegistry,
  IntakeLifecycleRegistry,
  IntakeMetadataFieldRegistry,
  IntakePriorityRegistry,
  IntakeReferenceTypeRegistry,
  IntakeStatusRegistry,
} from "./intakeOrchestrationRegistryCollections.ts";
import { IntakeOrchestrationRegistryPolicyRegistry } from "./intakeOrchestrationRegistryPolicies.ts";

/** Named collection inventory for reporting created vs inherited items. */
export const IntakeOrchestrationRegistryInventory = Object.freeze({
  inventoryId: "NEA-7:2/RegistryInventory",
  sourcePhase: "NEA-7:2" as const,
  inheritedFromFoundation: Object.freeze([
    Object.freeze({
      collection: "contracts",
      count: IntakeContractRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: IntakeOrchestrationCapabilityRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleEntries",
      count: IntakeLifecycleRegistry.length,
      ownership: "Referenced" as const,
    }),
  ]),
  createdByRegistry: Object.freeze([
    Object.freeze({
      collection: "intakeIdentities",
      count: IntakeIdentityRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "categories",
      count: IntakeCategoryRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "priorities",
      count: IntakePriorityRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: IntakeStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "referenceTypes",
      count: IntakeReferenceTypeRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "metadataFields",
      count: IntakeMetadataFieldRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "registryPolicies",
      count: IntakeOrchestrationRegistryPolicyRegistry.length,
      ownership: "Created" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const inheritedEntryCount =
  IntakeOrchestrationRegistryInventory.inheritedFromFoundation.reduce(
    (sum, item) => sum + item.count,
    0,
  );

const createdEntryCount =
  IntakeOrchestrationRegistryInventory.createdByRegistry.reduce(
    (sum, item) => sum + item.count,
    0,
  );

/** Canonical immutable registry metadata. */
export const IntakeOrchestrationRegistryMetadata = Object.freeze({
  metadataId: "NEA-7:2/IntakeOrchestrationRegistryMetadata",
  sourcePhase: "NEA-7:2" as const,
  registryStatus: "Registry" as const,
  registryVersion: "1.0.0" as const,
  readiness: "ReadyForModel" as const,
  nextPhase: "NEA-7:3 — Intake Orchestration Model",
  intakeIdentityCount: IntakeIdentityRegistry.length,
  categoryCount: IntakeCategoryRegistry.length,
  priorityCount: IntakePriorityRegistry.length,
  statusCount: IntakeStatusRegistry.length,
  referenceTypeCount: IntakeReferenceTypeRegistry.length,
  metadataFieldCount: IntakeMetadataFieldRegistry.length,
  registryPolicyCount: IntakeOrchestrationRegistryPolicyRegistry.length,
  contractCount: IntakeContractRegistry.length,
  capabilityCount: IntakeOrchestrationCapabilityRegistry.length,
  lifecycleEntryCount: IntakeLifecycleRegistry.length,
  inheritedEntryCount,
  createdEntryCount,
  totalEntryCount: inheritedEntryCount + createdEntryCount,
  inventory: IntakeOrchestrationRegistryInventory,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
