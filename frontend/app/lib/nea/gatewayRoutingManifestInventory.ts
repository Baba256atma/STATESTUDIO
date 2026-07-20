/**
 * NEA-5:5 — Gateway Routing Manifest Inventory.
 *
 * Canonical architecture inventory derived exclusively through
 * NEA-5:4 Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by NEA-5:5.
 */

import {
  GatewayRoutingValidationId,
  GatewayRoutingValidationPlatform,
} from "./gatewayRoutingValidation.ts";
import type {
  GatewayRoutingManifestInventoryEntry,
  GatewayRoutingManifestPhaseReference,
} from "./gatewayRoutingManifestTypes.ts";

const validation = GatewayRoutingValidationPlatform;
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
): GatewayRoutingManifestPhaseReference =>
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

/** Canonical phase references — NEA-5:1 through NEA-5:4 only. */
export const GatewayRoutingManifestPhaseReferences: readonly GatewayRoutingManifestPhaseReference[] =
  Object.freeze([
    phaseRef(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "gatewayRoutingFoundation.ts",
      1,
    ),
    phaseRef(
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "gatewayRoutingRegistry.ts",
      2,
    ),
    phaseRef(
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "gatewayRoutingModel.ts",
      3,
    ),
    phaseRef(
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "gatewayRoutingValidation.ts",
      4,
    ),
  ]);

const inventory = (
  inventoryKey: string,
  label: string,
  count: number,
  sourcePhase: GatewayRoutingManifestInventoryEntry["sourcePhase"],
  order: number,
): GatewayRoutingManifestInventoryEntry =>
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
 * Exactly twenty inventory entries per NEA-5:5 specification.
 */
export const GatewayRoutingManifestArchitectureInventory: readonly GatewayRoutingManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "routingContracts",
      "Routing Contracts",
      foundation.contracts.contractCount,
      "NEA-5:1",
      1,
    ),
    inventory(
      "routingDestinations",
      "Routing Destinations",
      foundation.destinations.destinationCount,
      "NEA-5:1",
      2,
    ),
    inventory(
      "routingDecisions",
      "Routing Decisions",
      foundation.destinations.decisionCount,
      "NEA-5:1",
      3,
    ),
    inventory(
      "routingContexts",
      "Routing Contexts",
      foundation.destinations.contextDimensionCount,
      "NEA-5:1",
      4,
    ),
    inventory(
      "routingCapabilities",
      "Routing Capabilities",
      foundation.capabilities.capabilityCount,
      "NEA-5:1",
      5,
    ),
    inventory(
      "routingLifecycle",
      "Routing Lifecycle",
      foundation.lifecycle.stateCount,
      "NEA-5:1",
      6,
    ),
    inventory(
      "routeIdentities",
      "Route Identities",
      registry.collections.routeIdentityCount,
      "NEA-5:2",
      7,
    ),
    inventory(
      "routingStrategies",
      "Routing Strategies",
      registry.collections.strategyCount,
      "NEA-5:2",
      8,
    ),
    inventory(
      "routingPriorities",
      "Routing Priorities",
      registry.collections.priorityCount,
      "NEA-5:2",
      9,
    ),
    inventory(
      "routingStatuses",
      "Routing Statuses",
      registry.collections.statusCount,
      "NEA-5:2",
      10,
    ),
    inventory(
      "routingResults",
      "Routing Results",
      registry.collections.resultCount,
      "NEA-5:2",
      11,
    ),
    inventory(
      "routingPolicies",
      "Routing Policies",
      registry.collections.routingPolicyCount,
      "NEA-5:2",
      12,
    ),
    inventory(
      "domainModels",
      "Domain Models",
      model.domainModels.modelCount,
      "NEA-5:3",
      13,
    ),
    inventory(
      "modelRelationships",
      "Model Relationships",
      model.relationships.relationshipCount,
      "NEA-5:3",
      14,
    ),
    inventory(
      "validationCategories",
      "Validation Categories",
      validation.categories.length,
      "NEA-5:4",
      15,
    ),
    inventory(
      "validationRules",
      "Validation Rules",
      validation.rules.ruleCount,
      "NEA-5:4",
      16,
    ),
    inventory(
      "validationRelationships",
      "Validation Relationships",
      validation.relationships.relationshipCount,
      "NEA-5:4",
      17,
    ),
    inventory(
      "manifestMetadata",
      "Manifest Metadata",
      validation.policies.policyCount,
      "NEA-5:4",
      18,
    ),
    inventory(
      "ownership",
      "Ownership",
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
      "NEA-5:1",
      19,
    ),
    inventory(
      "publicExports",
      "Public Exports",
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
      "NEA-5:1",
      20,
    ),
  ]);

/** Derived total architecture count across inventory entries. */
export const GatewayRoutingManifestTotalArchitectureCount =
  GatewayRoutingManifestArchitectureInventory.reduce(
    (total, entry) => total + entry.count,
    0,
  );

/** Canonical immutable inventory catalog. */
export const GatewayRoutingManifestInventoryCatalog = Object.freeze({
  catalogId: "NEA-5:5/ManifestInventory",
  sourcePhase: "NEA-5:5" as const,
  validationId: GatewayRoutingValidationId,
  phaseReferences: GatewayRoutingManifestPhaseReferences,
  phaseReferenceCount: GatewayRoutingManifestPhaseReferences.length,
  inventory: GatewayRoutingManifestArchitectureInventory,
  inventoryEntryCount: GatewayRoutingManifestArchitectureInventory.length,
  totalArchitectureCount: GatewayRoutingManifestTotalArchitectureCount,
  countingRule:
    "NEA-5:5 → NEA-5:4 ValidationPlatform → Model → Registry → Foundation (canonical reference chain only)",
  hardcoded: false as const,
  reconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
