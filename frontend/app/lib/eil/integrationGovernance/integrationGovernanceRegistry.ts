/**
 * EIL-7:2 — Integration Governance Registry.
 *
 * Canonical immutable registry for Integration Governance Foundation vocabularies.
 * Consumes only the EIL-7:1 Foundation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by EIL-7:2.
 */

import { IntegrationGovernanceCapabilityRegistry } from "./integrationGovernanceCapabilityRegistry.ts";
import { IntegrationGovernanceComplianceRegistry } from "./integrationGovernanceComplianceRegistry.ts";
import { IntegrationGovernanceContractRegistry } from "./integrationGovernanceContractRegistry.ts";
import { IntegrationGovernanceDomainRegistry } from "./integrationGovernanceDomainRegistry.ts";
import {
  IntegrationGovernanceFoundationId,
  IntegrationGovernanceFoundationIdentity,
  IntegrationGovernanceFoundationPlatform,
  IntegrationGovernanceFoundationSummary,
} from "./integrationGovernanceFoundation.ts";
import { IntegrationGovernanceLifecycleRegistry } from "./integrationGovernanceLifecycleRegistry.ts";
import { IntegrationGovernancePolicyRegistry } from "./integrationGovernancePolicyRegistry.ts";

/** Canonical phase ID. */
export const IntegrationGovernanceRegistryPhaseId = "EIL-7:2" as const;

/** Canonical registry ID. */
export const IntegrationGovernanceRegistryCanonicalId =
  "EIL-7:2/IntegrationGovernanceRegistry" as const;

/** Human-readable registry name. */
export const IntegrationGovernanceRegistryName =
  "Integration Governance Registry" as const;

/** Semantic version. */
export const IntegrationGovernanceRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationGovernanceRegistryNamespace =
  "nexora.eil.integration-governance.registry" as const;

/** Registry status. */
export const IntegrationGovernanceRegistryStatusValue = "Registry" as const;

/** Immediate next-phase readiness. */
export const IntegrationGovernanceRegistryReadiness = "ReadyForModel" as const;

/**
 * Immutable identity for EIL-7:2 Integration Governance Registry.
 */
export const IntegrationGovernanceRegistryIdentity = Object.freeze({
  phaseId: IntegrationGovernanceRegistryPhaseId,
  canonicalId: IntegrationGovernanceRegistryCanonicalId,
  name: IntegrationGovernanceRegistryName,
  version: IntegrationGovernanceRegistryVersion,
  namespace: IntegrationGovernanceRegistryNamespace,
  layer: "EIL" as const,
  platform: "EIL-7" as const,
  phaseType: "Registry" as const,
  status: IntegrationGovernanceRegistryStatusValue,
  readiness: IntegrationGovernanceRegistryReadiness,
  upstreamPhase: "EIL-7:1" as const,
  upstreamCanonicalId: IntegrationGovernanceFoundationId,
  foundationEntryPoint: "integrationGovernanceFoundation.ts" as const,
  packageEntryPoint: "integrationGovernance/index.ts" as const,
  description:
    "Canonical immutable registry registering Integration Governance Foundation domains, contracts, capabilities, policy categories, compliance categories, and lifecycle stages for Model consumption.",
  metadataOnly: true as const,
  immutable: true as const,
});

const foundation = IntegrationGovernanceFoundationPlatform;

/**
 * Dynamically derived Registry inventory.
 */
export const IntegrationGovernanceRegistryInventory = Object.freeze({
  inventoryId: "EIL-7:2/Inventory",
  domainCount: IntegrationGovernanceDomainRegistry.length,
  contractCount: IntegrationGovernanceContractRegistry.length,
  capabilityCount: IntegrationGovernanceCapabilityRegistry.length,
  policyCategoryCount: IntegrationGovernancePolicyRegistry.length,
  complianceCategoryCount: IntegrationGovernanceComplianceRegistry.length,
  lifecycleCount: IntegrationGovernanceLifecycleRegistry.length,
  totalRegistryRecordCount:
    IntegrationGovernanceDomainRegistry.length +
    IntegrationGovernanceContractRegistry.length +
    IntegrationGovernanceCapabilityRegistry.length +
    IntegrationGovernancePolicyRegistry.length +
    IntegrationGovernanceComplianceRegistry.length +
    IntegrationGovernanceLifecycleRegistry.length,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-7:2/Dependency/EIL71Foundation",
  upstreamPhase: "EIL-7:1" as const,
  upstreamCanonicalId: IntegrationGovernanceFoundationId,
  foundationOnly: true as const,
  foundationPublicSurfaceOnly: true as const,
  foundationInternalImport: false as const,
  laterEil7PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  directPreviousPhaseModule: "integrationGovernanceFoundation.ts" as const,
  packageEntry: "frontend/app/lib/eil/integrationGovernance" as const,
  canonicalPath:
    "EIL-7:2 → EIL-7:1 IntegrationGovernanceFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Integration Governance Registry aggregate.
 */
export const IntegrationGovernanceRegistry = Object.freeze({
  identity: IntegrationGovernanceRegistryIdentity,
  foundation: IntegrationGovernanceFoundationPlatform,
  foundationIdentity: IntegrationGovernanceFoundationIdentity,
  foundationSummary: IntegrationGovernanceFoundationSummary,
  domains: IntegrationGovernanceDomainRegistry,
  contracts: IntegrationGovernanceContractRegistry,
  capabilities: IntegrationGovernanceCapabilityRegistry,
  policyCategories: IntegrationGovernancePolicyRegistry,
  complianceCategories: IntegrationGovernanceComplianceRegistry,
  lifecycle: IntegrationGovernanceLifecycleRegistry,
  inventory: IntegrationGovernanceRegistryInventory,
  readiness: IntegrationGovernanceRegistryReadiness,
  dependency,
  status: IntegrationGovernanceRegistryStatusValue,
  nextPhase: "EIL-7:3 — Integration Governance Model",
  foundationPlatform: foundation,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  governanceEngine: false as const,
  policyEngine: false as const,
  complianceEngine: false as const,
  approvalWorkflow: false as const,
  auditRuntime: false as const,
  riskRuntime: false as const,
  versionManager: false as const,
  compatibilityResolver: false as const,
  dashboard: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  serviceBehavior: false as const,
  schedulingBehavior: false as const,
  queueBehavior: false as const,
  workerBehavior: false as const,
  apiBehavior: false as const,
  aiBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil7Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
