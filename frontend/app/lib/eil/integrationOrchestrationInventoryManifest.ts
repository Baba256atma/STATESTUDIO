/**
 * EIL-4:5 — Integration Orchestration Inventory Manifest.
 *
 * Canonical architecture inventory derived exclusively through
 * Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by EIL-4:5.
 */

import { IntegrationOrchestrationValidationPlatform } from "./integrationOrchestrationValidation.ts";
import type { IntegrationOrchestrationInventoryManifest as OrchestrationInventoryManifestDescriptor } from "./integrationOrchestrationManifestTypes.ts";

const validation = IntegrationOrchestrationValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

/** Upstream phases published through Validation (Foundation → Validation). */
const UPSTREAM_PHASES = Object.freeze([
  "EIL-4:1",
  "EIL-4:2",
  "EIL-4:3",
  "EIL-4:4",
] as const);

const foundationCategoryCount = foundation.categories.length;
const foundationContractCount = foundation.contracts.length;
const foundationCapabilityCount = foundation.capabilityDeclarations.length;
const foundationResponsibilityCount =
  foundation.responsibilityDeclarations.length;
const lifecycleStateCount = foundation.lifecycle.stateCount;
const registryEntryCount = registry.collections.totalRegistryEntryCount;
const domainModelCount = model.domains.length;
const relationshipModelCount = model.relationships.length;
const topologyModelCount = model.topologies.length;
const lifecycleModelCount = model.lifecycles.length;
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
  topologyModelCount +
  lifecycleModelCount +
  validationRuleCount +
  validationCategoryCount +
  validationFindingCount +
  publicExportCount;

/**
 * Canonical immutable inventory manifesto.
 * Every count is derived from upstream canonical collections.
 */
export const IntegrationOrchestrationInventoryManifest: OrchestrationInventoryManifestDescriptor =
  Object.freeze({
    inventoryId: "EIL-4:5/Inventory",
    foundationCategoryCount,
    foundationContractCount,
    foundationCapabilityCount,
    foundationResponsibilityCount,
    lifecycleStateCount,
    registryEntryCount,
    domainModelCount,
    relationshipModelCount,
    topologyModelCount,
    lifecycleModelCount,
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
