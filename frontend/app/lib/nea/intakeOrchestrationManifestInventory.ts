/**
 * NEA-7:5 — Intake Orchestration Manifest Inventory.
 *
 * Canonical architecture inventory derived exclusively through
 * NEA-7:4 Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by NEA-7:5.
 */

import {
  IntakeOrchestrationValidationId,
  IntakeOrchestrationValidationPlatform,
} from "./intakeOrchestrationValidation.ts";
import type {
  IntakeOrchestrationManifestInventoryEntry,
  IntakeOrchestrationManifestPhaseReference,
} from "./intakeOrchestrationManifestTypes.ts";

const validation = IntakeOrchestrationValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const phaseRef = (
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): IntakeOrchestrationManifestPhaseReference =>
  Object.freeze({
    phaseId,
    phaseName,
    version,
    namespace,
    status,
    module,
    ownership: "Referenced" as const,
    reconstructsPhase: false as const,
    duplicatesInventory: false as const,
    deterministicOrder: order,
  });

/** Canonical phase references — NEA-7:1 through NEA-7:4 only. */
export const IntakeOrchestrationManifestPhaseReferences: readonly IntakeOrchestrationManifestPhaseReference[] =
  Object.freeze([
    phaseRef(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "intakeOrchestrationFoundation.ts",
      1,
    ),
    phaseRef(
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "intakeOrchestrationRegistry.ts",
      2,
    ),
    phaseRef(
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "intakeOrchestrationModel.ts",
      3,
    ),
    phaseRef(
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "intakeOrchestrationValidation.ts",
      4,
    ),
  ]);

const inventory = (
  inventoryKey: string,
  label: string,
  count: number,
  sourcePhase: IntakeOrchestrationManifestInventoryEntry["sourcePhase"],
  order: number,
): IntakeOrchestrationManifestInventoryEntry =>
  Object.freeze({
    inventoryKey,
    label,
    count,
    sourcePhase,
    ownership: "Referenced" as const,
    hardcoded: false as const,
    reconstructed: false as const,
    deterministicOrder: order,
  });

/**
 * Architecture inventory — every count derived from canonical upstream collections.
 * Exactly twenty inventory entries.
 */
export const IntakeOrchestrationManifestArchitectureInventory: readonly IntakeOrchestrationManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "foundationContracts",
      "Contracts",
      foundation.contracts.contractCount,
      "NEA-7:1",
      1,
    ),
    inventory(
      "foundationCapabilities",
      "Capabilities",
      foundation.capabilities.capabilityCount,
      "NEA-7:1",
      2,
    ),
    inventory(
      "foundationLifecycle",
      "Lifecycle",
      foundation.lifecycle.stateCount,
      "NEA-7:1",
      3,
    ),
    inventory(
      "intakeIdentities",
      "Intake Identities",
      registry.collections.intakeIdentityCount,
      "NEA-7:2",
      4,
    ),
    inventory(
      "registryCategories",
      "Categories",
      registry.collections.categoryCount,
      "NEA-7:2",
      5,
    ),
    inventory(
      "registryPriorities",
      "Priorities",
      registry.collections.priorityCount,
      "NEA-7:2",
      6,
    ),
    inventory(
      "registryStatuses",
      "Statuses",
      registry.collections.statusCount,
      "NEA-7:2",
      7,
    ),
    inventory(
      "registryReferenceTypes",
      "Reference Types",
      registry.collections.referenceTypeCount,
      "NEA-7:2",
      8,
    ),
    inventory(
      "registryMetadataFields",
      "Metadata Fields",
      registry.collections.metadataFieldCount,
      "NEA-7:2",
      9,
    ),
    inventory(
      "registryPolicies",
      "Registry Policies",
      registry.policies.policyCount,
      "NEA-7:2",
      10,
    ),
    inventory(
      "domainModels",
      "Domain Models",
      model.domainModels.modelCount,
      "NEA-7:3",
      11,
    ),
    inventory(
      "modelRelationships",
      "Relationships",
      model.relationships.relationshipCount,
      "NEA-7:3",
      12,
    ),
    inventory(
      "modelLifecycle",
      "Model Lifecycle",
      model.lifecycle.stateCount,
      "NEA-7:3",
      13,
    ),
    inventory(
      "validationCategories",
      "Validation Categories",
      validation.rules.domainCategoryCount,
      "NEA-7:4",
      14,
    ),
    inventory(
      "validationRules",
      "Validation Rules",
      validation.rules.ruleCount,
      "NEA-7:4",
      15,
    ),
    inventory(
      "validationPolicies",
      "Validation Policies",
      validation.policies.policyCount,
      "NEA-7:4",
      16,
    ),
    inventory(
      "validationRelationships",
      "Validation Relationships",
      validation.relationships.relationshipCount,
      "NEA-7:4",
      17,
    ),
    inventory(
      "ownership",
      "Ownership",
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
      "NEA-7:1",
      18,
    ),
    inventory(
      "publicExports",
      "Public Exports",
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
      "NEA-7:1",
      19,
    ),
    inventory(
      "architectureTotals",
      "Architecture Totals",
      foundation.references.referenceGroupCount +
        foundation.attachments.attachmentKindCount,
      "NEA-7:1",
      20,
    ),
  ]);

/** Derived total architecture count across inventory entries. */
export const IntakeOrchestrationManifestTotalArchitectureCount =
  IntakeOrchestrationManifestArchitectureInventory.reduce(
    (total, entry) => total + entry.count,
    0,
  );

/** Canonical immutable inventory catalog. */
export const IntakeOrchestrationManifestInventoryCatalog = Object.freeze({
  catalogId: "NEA-7:5/ManifestInventory",
  sourcePhase: "NEA-7:5" as const,
  validationId: IntakeOrchestrationValidationId,
  phaseReferences: IntakeOrchestrationManifestPhaseReferences,
  phaseReferenceCount: IntakeOrchestrationManifestPhaseReferences.length,
  inventory: IntakeOrchestrationManifestArchitectureInventory,
  inventoryEntryCount: IntakeOrchestrationManifestArchitectureInventory.length,
  totalArchitectureCount: IntakeOrchestrationManifestTotalArchitectureCount,
  countingRule:
    "NEA-7:5 → NEA-7:4 ValidationPlatform → Model → Registry → Foundation (canonical reference chain only)",
  hardcoded: false as const,
  reconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
