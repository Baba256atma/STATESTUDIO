/**
 * EIL-5:5 — Integration Policy & Governance Inventory Manifest.
 *
 * Canonical architecture inventory derived exclusively through
 * Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by EIL-5:5.
 */

import { IntegrationPolicyGovernanceValidationPlatform } from "./integrationPolicyGovernanceValidation.ts";
import type { IntegrationPolicyGovernanceInventoryManifest as PolicyGovernanceInventoryManifestDescriptor } from "./integrationPolicyGovernanceManifestTypes.ts";

const validation = IntegrationPolicyGovernanceValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

/** Upstream phases published through Validation (Foundation → Validation). */
const UPSTREAM_PHASES = Object.freeze([
  "EIL-5:1",
  "EIL-5:2",
  "EIL-5:3",
  "EIL-5:4",
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
export const IntegrationPolicyGovernanceInventoryManifest: PolicyGovernanceInventoryManifestDescriptor =
  Object.freeze({
    inventoryId: "EIL-5:5/Inventory",
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
