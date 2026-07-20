/**
 * NEA-2:5 — Channel Connectors Manifest Inventory.
 *
 * Canonical architecture inventory derived exclusively through
 * NEA-2:4 Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by NEA-2:5.
 */

import {
  ChannelConnectorValidationId,
  ChannelConnectorValidationPlatform,
} from "./channelConnectorValidation.ts";
import type {
  ChannelConnectorManifestInventoryEntry,
  ChannelConnectorManifestPhaseReference,
} from "./channelConnectorManifestTypes.ts";

const validation = ChannelConnectorValidationPlatform;
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
): ChannelConnectorManifestPhaseReference =>
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

/** Canonical phase references — NEA-2:1 through NEA-2:4 only. */
export const ChannelConnectorManifestPhaseReferences: readonly ChannelConnectorManifestPhaseReference[] =
  Object.freeze([
    phaseRef(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "channelConnectorFoundation.ts",
      1,
    ),
    phaseRef(
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "channelConnectorRegistry.ts",
      2,
    ),
    phaseRef(
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "channelConnectorModel.ts",
      3,
    ),
    phaseRef(
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "channelConnectorValidation.ts",
      4,
    ),
  ]);

const inventory = (
  inventoryKey: string,
  label: string,
  count: number,
  sourcePhase: ChannelConnectorManifestInventoryEntry["sourcePhase"],
  order: number,
): ChannelConnectorManifestInventoryEntry =>
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
export const ChannelConnectorManifestArchitectureInventory: readonly ChannelConnectorManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "connectorFamilies",
      "Connector Families",
      registry.collections.familyCount,
      "NEA-2:2",
      1,
    ),
    inventory(
      "connectorTypes",
      "Connector Types",
      registry.collections.typeCount,
      "NEA-2:2",
      2,
    ),
    inventory(
      "connectorIdentities",
      "Connector Identities",
      registry.collections.identityCount,
      "NEA-2:2",
      3,
    ),
    inventory(
      "connectorProtocols",
      "Connector Protocols",
      registry.collections.protocolCount,
      "NEA-2:2",
      4,
    ),
    inventory(
      "connectorDirections",
      "Connector Directions",
      registry.collections.directionCount,
      "NEA-2:2",
      5,
    ),
    inventory(
      "authenticationMethods",
      "Authentication Methods",
      registry.collections.authenticationMethodCount,
      "NEA-2:2",
      6,
    ),
    inventory(
      "connectorCapabilities",
      "Connector Capabilities",
      registry.capabilities.capabilityCount,
      "NEA-2:2",
      7,
    ),
    inventory(
      "connectorLifecycleStates",
      "Connector Lifecycle States",
      registry.collections.lifecycleStateCount,
      "NEA-2:2",
      8,
    ),
    inventory(
      "connectorHealthStates",
      "Connector Health States",
      registry.collections.healthStateCount,
      "NEA-2:2",
      9,
    ),
    inventory(
      "connectorStatuses",
      "Connector Statuses",
      registry.collections.statusCount,
      "NEA-2:2",
      10,
    ),
    inventory(
      "connectorEventTypes",
      "Connector Event Types",
      registry.collections.eventTypeCount,
      "NEA-2:2",
      11,
    ),
    inventory(
      "connectorPayloadTypes",
      "Connector Payload Types",
      registry.collections.payloadTypeCount,
      "NEA-2:2",
      12,
    ),
    inventory(
      "connectorPolicies",
      "Connector Policies",
      registry.policies.policyCount,
      "NEA-2:2",
      13,
    ),
    inventory(
      "domainModels",
      "Domain Models",
      model.domainModels.modelCount,
      "NEA-2:3",
      14,
    ),
    inventory(
      "modelRelationships",
      "Model Relationships",
      model.relationships.relationshipCount,
      "NEA-2:3",
      15,
    ),
    inventory(
      "validationCategories",
      "Validation Categories",
      validation.categories.length,
      "NEA-2:4",
      16,
    ),
    inventory(
      "validationRules",
      "Validation Rules",
      validation.rules.ruleCount,
      "NEA-2:4",
      17,
    ),
    inventory(
      "ownership",
      "Ownership",
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
      "NEA-2:1",
      18,
    ),
    inventory(
      "publicExports",
      "Public Exports",
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
      "NEA-2:1",
      19,
    ),
  ]);

/** Derived total architecture count across inventory entries. */
export const ChannelConnectorManifestTotalArchitectureCount =
  ChannelConnectorManifestArchitectureInventory.reduce(
    (total, entry) => total + entry.count,
    0,
  );

/** Canonical immutable inventory catalog. */
export const ChannelConnectorManifestInventoryCatalog = Object.freeze({
  catalogId: "NEA-2:5/ManifestInventory",
  sourcePhase: "NEA-2:5" as const,
  validationId: ChannelConnectorValidationId,
  phaseReferences: ChannelConnectorManifestPhaseReferences,
  phaseReferenceCount: ChannelConnectorManifestPhaseReferences.length,
  inventory: ChannelConnectorManifestArchitectureInventory,
  inventoryEntryCount: ChannelConnectorManifestArchitectureInventory.length,
  totalArchitectureCount: ChannelConnectorManifestTotalArchitectureCount,
  countingRule:
    "NEA-2:5 → NEA-2:4 ValidationPlatform → Model → Registry → Foundation (canonical reference chain only)",
  hardcoded: false as const,
  reconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
