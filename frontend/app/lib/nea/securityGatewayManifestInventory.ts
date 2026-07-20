/**
 * NEA-4:5 — Security Gateway Manifest Inventory.
 *
 * Canonical architecture inventory derived exclusively through
 * NEA-4:4 Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by NEA-4:5.
 */

import {
  SecurityGatewayValidationId,
  SecurityGatewayValidationPlatform,
} from "./securityGatewayValidation.ts";
import type {
  SecurityGatewayManifestInventoryEntry,
  SecurityGatewayManifestPhaseReference,
} from "./securityGatewayManifestTypes.ts";

const validation = SecurityGatewayValidationPlatform;
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
): SecurityGatewayManifestPhaseReference =>
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

/** Canonical phase references — NEA-4:1 through NEA-4:4 only. */
export const SecurityGatewayManifestPhaseReferences: readonly SecurityGatewayManifestPhaseReference[] =
  Object.freeze([
    phaseRef(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "securityGatewayFoundation.ts",
      1,
    ),
    phaseRef(
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "securityGatewayRegistry.ts",
      2,
    ),
    phaseRef(
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "securityGatewayModel.ts",
      3,
    ),
    phaseRef(
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "securityGatewayValidation.ts",
      4,
    ),
  ]);

const inventory = (
  inventoryKey: string,
  label: string,
  count: number,
  sourcePhase: SecurityGatewayManifestInventoryEntry["sourcePhase"],
  order: number,
): SecurityGatewayManifestInventoryEntry =>
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
 * Exactly twenty-one inventory entries per NEA-4:5 specification.
 */
export const SecurityGatewayManifestArchitectureInventory: readonly SecurityGatewayManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "securityContracts",
      "Security Contracts",
      foundation.contracts.contractCount,
      "NEA-4:1",
      1,
    ),
    inventory(
      "securityCapabilities",
      "Security Capabilities",
      foundation.capabilities.capabilityCount,
      "NEA-4:1",
      2,
    ),
    inventory(
      "securityLifecycle",
      "Security Lifecycle",
      foundation.lifecycle.stateCount,
      "NEA-4:1",
      3,
    ),
    inventory(
      "securityIdentities",
      "Security Identities",
      registry.collections.securityIdentityCount,
      "NEA-4:2",
      4,
    ),
    inventory(
      "securityClassifications",
      "Security Classifications",
      registry.collections.classificationCount,
      "NEA-4:2",
      5,
    ),
    inventory(
      "authenticationMethods",
      "Authentication Methods",
      registry.collections.authenticationMethodCount,
      "NEA-4:2",
      6,
    ),
    inventory(
      "authorizationLevels",
      "Authorization Levels",
      registry.collections.authorizationLevelCount,
      "NEA-4:2",
      7,
    ),
    inventory(
      "trustLevels",
      "Trust Levels",
      registry.collections.trustLevelCount,
      "NEA-4:2",
      8,
    ),
    inventory(
      "consentStates",
      "Consent States",
      registry.collections.consentStateCount,
      "NEA-4:2",
      9,
    ),
    inventory(
      "roles",
      "Roles",
      registry.collections.roleCount,
      "NEA-4:2",
      10,
    ),
    inventory(
      "permissions",
      "Permissions",
      registry.collections.permissionCount,
      "NEA-4:2",
      11,
    ),
    inventory(
      "securityPolicies",
      "Security Policies",
      registry.collections.securityPolicyCount,
      "NEA-4:2",
      12,
    ),
    inventory(
      "securityEvents",
      "Security Events",
      registry.collections.eventCount,
      "NEA-4:2",
      13,
    ),
    inventory(
      "contextTypes",
      "Context Types",
      registry.collections.contextTypeCount,
      "NEA-4:2",
      14,
    ),
    inventory(
      "domainModels",
      "Domain Models",
      model.domainModels.modelCount,
      "NEA-4:3",
      15,
    ),
    inventory(
      "modelRelationships",
      "Model Relationships",
      model.relationships.relationshipCount,
      "NEA-4:3",
      16,
    ),
    inventory(
      "validationCategories",
      "Validation Categories",
      validation.categories.length,
      "NEA-4:4",
      17,
    ),
    inventory(
      "validationRules",
      "Validation Rules",
      validation.rules.ruleCount,
      "NEA-4:4",
      18,
    ),
    inventory(
      "validationRelationships",
      "Validation Relationships",
      validation.relationships.relationshipCount,
      "NEA-4:4",
      19,
    ),
    inventory(
      "validationPolicies",
      "Validation Policies",
      validation.policies.policyCount,
      "NEA-4:4",
      20,
    ),
    inventory(
      "publicExports",
      "Public Exports",
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
      "NEA-4:1",
      21,
    ),
  ]);

/** Derived total architecture count across inventory entries. */
export const SecurityGatewayManifestTotalArchitectureCount =
  SecurityGatewayManifestArchitectureInventory.reduce(
    (total, entry) => total + entry.count,
    0,
  );

/** Canonical immutable inventory catalog. */
export const SecurityGatewayManifestInventoryCatalog = Object.freeze({
  catalogId: "NEA-4:5/ManifestInventory",
  sourcePhase: "NEA-4:5" as const,
  validationId: SecurityGatewayValidationId,
  phaseReferences: SecurityGatewayManifestPhaseReferences,
  phaseReferenceCount: SecurityGatewayManifestPhaseReferences.length,
  inventory: SecurityGatewayManifestArchitectureInventory,
  inventoryEntryCount: SecurityGatewayManifestArchitectureInventory.length,
  totalArchitectureCount: SecurityGatewayManifestTotalArchitectureCount,
  countingRule:
    "NEA-4:5 → NEA-4:4 ValidationPlatform → Model → Registry → Foundation (canonical reference chain only)",
  hardcoded: false as const,
  reconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
