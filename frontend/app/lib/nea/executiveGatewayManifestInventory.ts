/**
 * NEA-1:5 — Executive Gateway Manifest Inventory.
 *
 * Canonical architecture inventory derived exclusively through
 * NEA-1:4 Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by NEA-1:5.
 */

import {
  ExecutiveGatewayValidationId,
  ExecutiveGatewayValidationPlatform,
} from "./executiveGatewayValidation.ts";
import type {
  ExecutiveGatewayManifestInventoryEntry,
  ExecutiveGatewayManifestPhaseReference,
} from "./executiveGatewayManifestTypes.ts";

const validation = ExecutiveGatewayValidationPlatform;
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
): ExecutiveGatewayManifestPhaseReference =>
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

/** Canonical phase references — NEA-1:1 through NEA-1:4 only. */
export const ExecutiveGatewayManifestPhaseReferences: readonly ExecutiveGatewayManifestPhaseReference[] =
  Object.freeze([
    phaseRef(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "executiveGatewayFoundation.ts",
      1,
    ),
    phaseRef(
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "executiveGatewayRegistry.ts",
      2,
    ),
    phaseRef(
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "executiveGatewayModel.ts",
      3,
    ),
    phaseRef(
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "executiveGatewayValidation.ts",
      4,
    ),
  ]);

const inventory = (
  inventoryKey: string,
  label: string,
  count: number,
  sourcePhase: ExecutiveGatewayManifestInventoryEntry["sourcePhase"],
  order: number,
): ExecutiveGatewayManifestInventoryEntry =>
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
 */
export const ExecutiveGatewayManifestArchitectureInventory: readonly ExecutiveGatewayManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "sourceFamilies",
      "Source Families",
      registry.collections.sourceFamilies.length,
      "NEA-1:2",
      1,
    ),
    inventory(
      "channelTypes",
      "Channel Types",
      registry.collections.channels.length,
      "NEA-1:2",
      2,
    ),
    inventory(
      "interactionModalities",
      "Interaction Modalities",
      registry.collections.modalities.length,
      "NEA-1:2",
      3,
    ),
    inventory(
      "senderKinds",
      "Sender Kinds",
      registry.collections.senders.length,
      "NEA-1:2",
      4,
    ),
    inventory(
      "authenticationMethods",
      "Authentication Methods",
      registry.collections.authenticationMethods.length,
      "NEA-1:2",
      5,
    ),
    inventory(
      "authorizationStatuses",
      "Authorization Statuses",
      registry.collections.authorizationStatuses.length,
      "NEA-1:2",
      6,
    ),
    inventory(
      "trustLevels",
      "Trust Levels",
      registry.collections.trustLevels.length,
      "NEA-1:2",
      7,
    ),
    inventory(
      "consentStatuses",
      "Consent Statuses",
      registry.collections.consentStatuses.length,
      "NEA-1:2",
      8,
    ),
    inventory(
      "validationCategories",
      "Validation Categories",
      validation.categories.length,
      "NEA-1:4",
      9,
    ),
    inventory(
      "validationRules",
      "Validation Rules",
      validation.rules.ruleCount,
      "NEA-1:4",
      10,
    ),
    inventory(
      "domainModels",
      "Domain Models",
      model.domainModels.modelCount,
      "NEA-1:3",
      11,
    ),
    inventory(
      "modelRelationships",
      "Model Relationships",
      model.relationships.relationshipCount,
      "NEA-1:3",
      12,
    ),
    inventory(
      "lifecycleStates",
      "Lifecycle States",
      registry.collections.lifecycleStates.length,
      "NEA-1:2",
      13,
    ),
    inventory(
      "capabilities",
      "Capabilities",
      registry.capabilities.capabilityCount,
      "NEA-1:2",
      14,
    ),
    inventory(
      "policies",
      "Policies",
      registry.policies.policyCount,
      "NEA-1:2",
      15,
    ),
    inventory(
      "routingDestinations",
      "Routing Destinations",
      registry.collections.routingDestinations.length,
      "NEA-1:2",
      16,
    ),
    inventory(
      "diagnostics",
      "Diagnostics",
      registry.collections.diagnosticCategories.length,
      "NEA-1:2",
      17,
    ),
    inventory(
      "ownership",
      "Ownership",
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
      "NEA-1:1",
      18,
    ),
    inventory(
      "publicExports",
      "Public Exports",
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
      "NEA-1:1",
      19,
    ),
  ]);

/** Derived total architecture count across inventory entries. */
export const ExecutiveGatewayManifestTotalArchitectureCount =
  ExecutiveGatewayManifestArchitectureInventory.reduce(
    (total, entry) => total + entry.count,
    0,
  );

/** Canonical immutable inventory catalog. */
export const ExecutiveGatewayManifestInventoryCatalog = Object.freeze({
  catalogId: "NEA-1:5/ManifestInventory",
  sourcePhase: "NEA-1:5" as const,
  validationId: ExecutiveGatewayValidationId,
  phaseReferences: ExecutiveGatewayManifestPhaseReferences,
  phaseReferenceCount: ExecutiveGatewayManifestPhaseReferences.length,
  inventory: ExecutiveGatewayManifestArchitectureInventory,
  inventoryEntryCount: ExecutiveGatewayManifestArchitectureInventory.length,
  totalArchitectureCount: ExecutiveGatewayManifestTotalArchitectureCount,
  countingRule:
    "NEA-1:5 → NEA-1:4 ValidationPlatform → Model → Registry → Foundation (canonical reference chain only)",
  hardcoded: false as const,
  reconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
