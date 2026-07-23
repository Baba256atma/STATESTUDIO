/**
 * EIL-7:5 — Integration Governance Manifest.
 *
 * Canonical immutable architectural publication for Integration Governance.
 * Consumes only the EIL-7:4 Integration Governance Validation aggregate.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by EIL-7:5.
 */

import {
  IntegrationGovernanceValidation,
  IntegrationGovernanceValidationCanonicalId,
  IntegrationGovernanceValidationIdentity,
} from "./integrationGovernanceValidation.ts";
import { IntegrationGovernanceManifestCompatibility } from "./integrationGovernanceManifestCompatibility.ts";
import { IntegrationGovernanceManifestDependencies } from "./integrationGovernanceManifestDependencies.ts";
import { IntegrationGovernanceManifestExports } from "./integrationGovernanceManifestExports.ts";
import { IntegrationGovernanceManifestGuarantees } from "./integrationGovernanceManifestGuarantees.ts";
import {
  IntegrationGovernanceManifestCanonicalId,
  IntegrationGovernanceManifestIdentity,
  IntegrationGovernanceManifestName,
  IntegrationGovernanceManifestNamespace,
  IntegrationGovernanceManifestPhaseId,
  IntegrationGovernanceManifestReadinessValue,
  IntegrationGovernanceManifestStatusValue,
  IntegrationGovernanceManifestVersion,
} from "./integrationGovernanceManifestIdentity.ts";
import { IntegrationGovernanceManifestReadiness } from "./integrationGovernanceManifestReadiness.ts";

export {
  IntegrationGovernanceManifestCanonicalId,
  IntegrationGovernanceManifestIdentity,
  IntegrationGovernanceManifestName,
  IntegrationGovernanceManifestNamespace,
  IntegrationGovernanceManifestPhaseId,
  IntegrationGovernanceManifestReadinessValue,
  IntegrationGovernanceManifestStatusValue,
  IntegrationGovernanceManifestVersion,
};

/**
 * Inventory references derived exclusively from Validation — never redefined.
 */
const validationDerivedInventory = Object.freeze({
  inventoryId: "EIL-7:5/ValidationDerivedInventory" as const,
  sourceValidationId: IntegrationGovernanceValidationCanonicalId,
  validationCategories: IntegrationGovernanceValidation.categories,
  validationRules: IntegrationGovernanceValidation.rules,
  validationGates: IntegrationGovernanceValidation.gates,
  validationInventory: IntegrationGovernanceValidation.inventory,
  categoryCount: IntegrationGovernanceValidation.categories.length,
  ruleCount: IntegrationGovernanceValidation.rules.length,
  gateCount: IntegrationGovernanceValidation.gates.length,
  totalValidationInventory:
    IntegrationGovernanceValidation.inventory.totalValidationInventory,
  validationAggregateResult: IntegrationGovernanceValidation.aggregateResult,
  validationReadiness: IntegrationGovernanceValidation.readiness,
  countsDerivedFromValidation: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Integration Governance Manifest aggregate.
 */
export const IntegrationGovernanceManifest = Object.freeze({
  identity: IntegrationGovernanceManifestIdentity,
  guarantees: IntegrationGovernanceManifestGuarantees,
  compatibility: IntegrationGovernanceManifestCompatibility,
  dependencies: IntegrationGovernanceManifestDependencies,
  exports: IntegrationGovernanceManifestExports,
  readiness: IntegrationGovernanceManifestReadiness,
  readinessValue: IntegrationGovernanceManifestReadinessValue,
  validationReference: Object.freeze({
    canonicalId: IntegrationGovernanceValidationCanonicalId,
    identity: IntegrationGovernanceValidationIdentity,
    aggregate: IntegrationGovernanceValidation,
    entryPoint: "integrationGovernanceValidation.ts" as const,
    exclusive: true as const,
  }),
  validationDerivedInventory,
  status: IntegrationGovernanceManifestStatusValue,
  nextPhase: "EIL-7:6 — Integration Governance Platform",
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
  runtimeValidation: false as const,
  aiBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil7Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
