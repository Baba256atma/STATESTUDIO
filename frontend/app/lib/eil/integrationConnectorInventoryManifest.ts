/**
 * EIL-2:5 — Integration Connector Inventory Manifest.
 *
 * Canonical architecture inventory derived exclusively through
 * Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by EIL-2:5.
 */

import { IntegrationConnectorValidationPlatform } from "./integrationConnectorValidation.ts";
import type { IntegrationConnectorInventoryManifestDescriptor } from "./integrationConnectorManifestTypes.ts";

const validation = IntegrationConnectorValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

/** Upstream phases published through Validation (Foundation → Validation). */
const UPSTREAM_PHASES = Object.freeze([
  "EIL-2:1",
  "EIL-2:2",
  "EIL-2:3",
  "EIL-2:4",
] as const);

const foundationCategoryCount = foundation.categories.length;
const foundationContractCount = registry.contracts.length;
const foundationCapabilityCount = registry.capabilities.length;
const foundationResponsibilityCount = registry.responsibilities.length;
const lifecycleStateCount = registry.inventory.lifecycleStateCount;
const registryEntryCount = registry.collections.totalRegistryEntryCount;
const domainModelCount = model.domains.length;
const relationshipModelCount = model.relationships.length;
const endpointModelCount = model.endpoints.length;
const protocolModelCount = model.protocols.length;
const validationRuleCount = validation.rules.length;
const validationCategoryCount = validation.categories.length;
const validationFindingCount = validation.findings.length;
const publicExportCount =
  foundation.apiRegistry.length * UPSTREAM_PHASES.length;

const totalInventoryCount =
  foundationCategoryCount +
  foundationContractCount +
  foundationCapabilityCount +
  foundationResponsibilityCount +
  lifecycleStateCount +
  registryEntryCount +
  domainModelCount +
  relationshipModelCount +
  endpointModelCount +
  protocolModelCount +
  validationRuleCount +
  validationCategoryCount +
  validationFindingCount +
  publicExportCount;

/**
 * Canonical immutable inventory manifesto.
 * Every count is derived from upstream canonical collections.
 */
export const IntegrationConnectorInventoryManifest: IntegrationConnectorInventoryManifestDescriptor =
  Object.freeze({
    inventoryId: "EIL-2:5/Inventory",
    foundationCategoryCount,
    foundationContractCount,
    foundationCapabilityCount,
    foundationResponsibilityCount,
    lifecycleStateCount,
    registryEntryCount,
    domainModelCount,
    relationshipModelCount,
    endpointModelCount,
    protocolModelCount,
    validationRuleCount,
    validationCategoryCount,
    validationFindingCount,
    publicExportCount,
    totalInventoryCount,
    countsDerivedFromUpstream: true as const,
    hardcodedCounts: false as const,
    duplicatesUpstreamCollections: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
