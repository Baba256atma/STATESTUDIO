/**
 * EIL-7:6 — Integration Governance Platform.
 *
 * Canonical immutable Platform metadata package for Integration Governance.
 * Consumes only the EIL-7:5 Integration Governance Manifest aggregate.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by EIL-7:6.
 */

import {
  IntegrationGovernanceManifest,
  IntegrationGovernanceManifestCanonicalId,
  IntegrationGovernanceManifestIdentity,
} from "./integrationGovernanceManifest.ts";
import { IntegrationGovernancePlatformCapabilities } from "./integrationGovernancePlatformCapabilities.ts";
import { IntegrationGovernancePlatformCompatibility } from "./integrationGovernancePlatformCompatibility.ts";
import { IntegrationGovernancePlatformComposition } from "./integrationGovernancePlatformComposition.ts";
import { IntegrationGovernancePlatformDependencies } from "./integrationGovernancePlatformDependencies.ts";
import {
  IntegrationGovernancePlatformCanonicalId,
  IntegrationGovernancePlatformIdentity,
  IntegrationGovernancePlatformName,
  IntegrationGovernancePlatformNamespace,
  IntegrationGovernancePlatformPhaseId,
  IntegrationGovernancePlatformReadinessValue,
  IntegrationGovernancePlatformStatusValue,
  IntegrationGovernancePlatformVersion,
} from "./integrationGovernancePlatformIdentity.ts";
import { IntegrationGovernancePlatformReadiness } from "./integrationGovernancePlatformReadiness.ts";

export {
  IntegrationGovernancePlatformCanonicalId,
  IntegrationGovernancePlatformIdentity,
  IntegrationGovernancePlatformName,
  IntegrationGovernancePlatformNamespace,
  IntegrationGovernancePlatformPhaseId,
  IntegrationGovernancePlatformReadinessValue,
  IntegrationGovernancePlatformStatusValue,
  IntegrationGovernancePlatformVersion,
};

/**
 * Inventory references derived exclusively from Manifest
 * (which itself derives them from Validation) — never redefined.
 */
const manifestDerivedInventory = Object.freeze({
  inventoryId: "EIL-7:6/ManifestDerivedInventory" as const,
  sourceManifestId: IntegrationGovernanceManifestCanonicalId,
  validationDerivedInventory:
    IntegrationGovernanceManifest.validationDerivedInventory,
  validationCategories:
    IntegrationGovernanceManifest.validationDerivedInventory
      .validationCategories,
  validationRules:
    IntegrationGovernanceManifest.validationDerivedInventory.validationRules,
  validationGates:
    IntegrationGovernanceManifest.validationDerivedInventory.validationGates,
  validationInventory:
    IntegrationGovernanceManifest.validationDerivedInventory
      .validationInventory,
  categoryCount:
    IntegrationGovernanceManifest.validationDerivedInventory.categoryCount,
  ruleCount:
    IntegrationGovernanceManifest.validationDerivedInventory.ruleCount,
  gateCount:
    IntegrationGovernanceManifest.validationDerivedInventory.gateCount,
  totalValidationInventory:
    IntegrationGovernanceManifest.validationDerivedInventory
      .totalValidationInventory,
  validationAggregateResult:
    IntegrationGovernanceManifest.validationDerivedInventory
      .validationAggregateResult,
  validationReadiness:
    IntegrationGovernanceManifest.validationDerivedInventory
      .validationReadiness,
  countsDerivedFromManifest: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Integration Governance Platform aggregate.
 */
export const IntegrationGovernancePlatform = Object.freeze({
  identity: IntegrationGovernancePlatformIdentity,
  composition: IntegrationGovernancePlatformComposition,
  capabilities: IntegrationGovernancePlatformCapabilities,
  compatibility: IntegrationGovernancePlatformCompatibility,
  dependencies: IntegrationGovernancePlatformDependencies,
  readiness: IntegrationGovernancePlatformReadiness,
  readinessValue: IntegrationGovernancePlatformReadinessValue,
  manifestReference: Object.freeze({
    canonicalId: IntegrationGovernanceManifestCanonicalId,
    identity: IntegrationGovernanceManifestIdentity,
    aggregate: IntegrationGovernanceManifest,
    entryPoint: "integrationGovernanceManifest.ts" as const,
    exclusive: true as const,
  }),
  manifestDerivedInventory,
  status: IntegrationGovernancePlatformStatusValue,
  nextPhase: "EIL-7:7 — Integration Governance Certification",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
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
