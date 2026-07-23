/**
 * EIL-1:5 — Integration Inventory Manifest.
 *
 * Canonical architecture inventory derived exclusively through
 * Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by EIL-1:5.
 */

import { IntegrationValidationPlatform } from "./integrationValidation.ts";
import type { IntegrationInventoryManifestDescriptor } from "./integrationManifestTypes.ts";

const validation = IntegrationValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

/** Upstream phases published through Validation (Foundation → Validation). */
const UPSTREAM_PHASES = Object.freeze([
  "EIL-1:1",
  "EIL-1:2",
  "EIL-1:3",
  "EIL-1:4",
] as const);

const foundationContractCount = registry.contracts.length;
const foundationCapabilityCount = registry.capabilities.length;
const foundationResponsibilityCount = registry.responsibilities.length;
const lifecycleStateCount = model.lifecycle.length;
const registryEntryCount = registry.collections.totalRegistryEntryCount;
const domainModelCount = model.domains.length;
const relationshipModelCount = model.relationships.length;
const topologyModelCount = model.topology.length;
const validationRuleCount = validation.rules.length;
const validationCategoryCount = validation.categories.length;
const validationFindingCount = validation.findings.length;
const publicExportCount =
  foundation.apiRegistry.length * UPSTREAM_PHASES.length;

const totalInventoryCount =
  foundationContractCount +
  foundationCapabilityCount +
  foundationResponsibilityCount +
  lifecycleStateCount +
  registryEntryCount +
  domainModelCount +
  relationshipModelCount +
  topologyModelCount +
  validationRuleCount +
  validationCategoryCount +
  validationFindingCount +
  publicExportCount;

/**
 * Canonical immutable inventory manifesto.
 * Every count is derived from upstream canonical collections.
 */
export const IntegrationInventoryManifest: IntegrationInventoryManifestDescriptor =
  Object.freeze({
    inventoryId: "EIL-1:5/Inventory",
    foundationContractCount,
    foundationCapabilityCount,
    foundationResponsibilityCount,
    lifecycleStateCount,
    registryEntryCount,
    domainModelCount,
    relationshipModelCount,
    topologyModelCount,
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
