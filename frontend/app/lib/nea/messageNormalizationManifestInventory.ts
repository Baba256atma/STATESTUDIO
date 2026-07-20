/**
 * NEA-6:5 — Message Normalization Manifest Inventory.
 *
 * Canonical architecture inventory derived exclusively through
 * NEA-6:4 Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by NEA-6:5.
 */

import {
  MessageNormalizationValidationId,
  MessageNormalizationValidationPlatform,
} from "./messageNormalizationValidation.ts";
import type {
  MessageNormalizationManifestInventoryEntry,
  MessageNormalizationManifestPhaseReference,
} from "./messageNormalizationManifestTypes.ts";

const validation = MessageNormalizationValidationPlatform;
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
): MessageNormalizationManifestPhaseReference =>
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

/** Canonical phase references — NEA-6:1 through NEA-6:4 only. */
export const MessageNormalizationManifestPhaseReferences: readonly MessageNormalizationManifestPhaseReference[] =
  Object.freeze([
    phaseRef(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "messageNormalizationFoundation.ts",
      1,
    ),
    phaseRef(
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "messageNormalizationRegistry.ts",
      2,
    ),
    phaseRef(
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "messageNormalizationModel.ts",
      3,
    ),
    phaseRef(
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "messageNormalizationValidation.ts",
      4,
    ),
  ]);

const inventory = (
  inventoryKey: string,
  label: string,
  count: number,
  sourcePhase: MessageNormalizationManifestInventoryEntry["sourcePhase"],
  order: number,
): MessageNormalizationManifestInventoryEntry =>
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
export const MessageNormalizationManifestArchitectureInventory: readonly MessageNormalizationManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "foundationContracts",
      "Foundation Contracts",
      foundation.contracts.contractCount,
      "NEA-6:1",
      1,
    ),
    inventory(
      "contextDimensions",
      "Context Dimensions",
      foundation.contexts.contextDimensionCount,
      "NEA-6:1",
      2,
    ),
    inventory(
      "attachmentKinds",
      "Attachment Kinds",
      foundation.attachments.attachmentKindCount,
      "NEA-6:1",
      3,
    ),
    inventory(
      "foundationLifecycle",
      "Foundation Lifecycle",
      foundation.lifecycle.stateCount,
      "NEA-6:1",
      4,
    ),
    inventory(
      "foundationCapabilities",
      "Foundation Capabilities",
      foundation.capabilities.capabilityCount,
      "NEA-6:1",
      5,
    ),
    inventory(
      "messageIdentities",
      "Message Identities",
      registry.collections.messageIdentityCount,
      "NEA-6:2",
      6,
    ),
    inventory(
      "payloadTypes",
      "Payload Types",
      registry.collections.payloadCount,
      "NEA-6:2",
      7,
    ),
    inventory(
      "metadataFields",
      "Metadata Fields",
      registry.collections.metadataFieldCount,
      "NEA-6:2",
      8,
    ),
    inventory(
      "mappingTypes",
      "Mapping Types",
      registry.collections.mappingCount,
      "NEA-6:2",
      9,
    ),
    inventory(
      "registryPolicies",
      "Registry Policies",
      registry.policies.policyCount,
      "NEA-6:2",
      10,
    ),
    inventory(
      "registryStatuses",
      "Registry Statuses",
      registry.collections.statusCount,
      "NEA-6:2",
      11,
    ),
    inventory(
      "domainModels",
      "Domain Models",
      model.domainModels.modelCount,
      "NEA-6:3",
      12,
    ),
    inventory(
      "modelRelationships",
      "Model Relationships",
      model.relationships.relationshipCount,
      "NEA-6:3",
      13,
    ),
    inventory(
      "modelLifecycle",
      "Model Lifecycle",
      model.lifecycle.stateCount,
      "NEA-6:3",
      14,
    ),
    inventory(
      "validationCategories",
      "Validation Categories",
      validation.rules.domainCategoryCount,
      "NEA-6:4",
      15,
    ),
    inventory(
      "validationRules",
      "Validation Rules",
      validation.rules.ruleCount,
      "NEA-6:4",
      16,
    ),
    inventory(
      "validationPolicies",
      "Validation Policies",
      validation.policies.policyCount,
      "NEA-6:4",
      17,
    ),
    inventory(
      "validationRelationships",
      "Validation Relationships",
      validation.relationships.relationshipCount,
      "NEA-6:4",
      18,
    ),
    inventory(
      "ownership",
      "Ownership",
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
      "NEA-6:1",
      19,
    ),
    inventory(
      "publicExports",
      "Public Exports",
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
      "NEA-6:1",
      20,
    ),
  ]);

/** Derived total architecture count across inventory entries. */
export const MessageNormalizationManifestTotalArchitectureCount =
  MessageNormalizationManifestArchitectureInventory.reduce(
    (total, entry) => total + entry.count,
    0,
  );

/** Canonical immutable inventory catalog. */
export const MessageNormalizationManifestInventoryCatalog = Object.freeze({
  catalogId: "NEA-6:5/ManifestInventory",
  sourcePhase: "NEA-6:5" as const,
  validationId: MessageNormalizationValidationId,
  phaseReferences: MessageNormalizationManifestPhaseReferences,
  phaseReferenceCount: MessageNormalizationManifestPhaseReferences.length,
  inventory: MessageNormalizationManifestArchitectureInventory,
  inventoryEntryCount: MessageNormalizationManifestArchitectureInventory.length,
  totalArchitectureCount: MessageNormalizationManifestTotalArchitectureCount,
  countingRule:
    "NEA-6:5 → NEA-6:4 ValidationPlatform → Model → Registry → Foundation (canonical reference chain only)",
  hardcoded: false as const,
  reconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
