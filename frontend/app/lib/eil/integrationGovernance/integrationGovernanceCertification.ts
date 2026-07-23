/**
 * EIL-7:7 — Integration Governance Certification.
 *
 * Canonical immutable certification of Integration Governance Platform.
 * Consumes only the EIL-7:6 Integration Governance Platform aggregate.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by EIL-7:7.
 */

import {
  IntegrationGovernancePlatform,
  IntegrationGovernancePlatformCanonicalId,
  IntegrationGovernancePlatformIdentity,
} from "./integrationGovernancePlatform.ts";
import { IntegrationGovernanceCertificationCriteria } from "./integrationGovernanceCertificationCriteria.ts";
import { IntegrationGovernanceCertificationDependencies } from "./integrationGovernanceCertificationDependencies.ts";
import { IntegrationGovernanceCertificationGates } from "./integrationGovernanceCertificationGates.ts";
import {
  IntegrationGovernanceCertificationCanonicalId,
  IntegrationGovernanceCertificationIdentity,
  IntegrationGovernanceCertificationName,
  IntegrationGovernanceCertificationNamespace,
  IntegrationGovernanceCertificationPhaseId,
  IntegrationGovernanceCertificationReadinessValue,
  IntegrationGovernanceCertificationStatusValue,
  IntegrationGovernanceCertificationVersion,
} from "./integrationGovernanceCertificationIdentity.ts";
import { IntegrationGovernanceCertificationReadiness } from "./integrationGovernanceCertificationReadiness.ts";
import {
  IntegrationGovernanceCertificationAggregateResult,
  IntegrationGovernanceCertificationResults,
  IntegrationGovernanceCertificationResultValues,
} from "./integrationGovernanceCertificationResults.ts";

export {
  IntegrationGovernanceCertificationCanonicalId,
  IntegrationGovernanceCertificationIdentity,
  IntegrationGovernanceCertificationName,
  IntegrationGovernanceCertificationNamespace,
  IntegrationGovernanceCertificationPhaseId,
  IntegrationGovernanceCertificationReadinessValue,
  IntegrationGovernanceCertificationStatusValue,
  IntegrationGovernanceCertificationVersion,
};

/**
 * Inventory references derived exclusively from Platform
 * (Manifest → Validation) — never redefined.
 */
const platformDerivedInventory = Object.freeze({
  inventoryId: "EIL-7:7/PlatformDerivedInventory" as const,
  sourcePlatformId: IntegrationGovernancePlatformCanonicalId,
  manifestDerivedInventory:
    IntegrationGovernancePlatform.manifestDerivedInventory,
  validationCategories:
    IntegrationGovernancePlatform.manifestDerivedInventory
      .validationCategories,
  validationRules:
    IntegrationGovernancePlatform.manifestDerivedInventory.validationRules,
  validationGates:
    IntegrationGovernancePlatform.manifestDerivedInventory.validationGates,
  validationInventory:
    IntegrationGovernancePlatform.manifestDerivedInventory
      .validationInventory,
  categoryCount:
    IntegrationGovernancePlatform.manifestDerivedInventory.categoryCount,
  ruleCount:
    IntegrationGovernancePlatform.manifestDerivedInventory.ruleCount,
  gateCount:
    IntegrationGovernancePlatform.manifestDerivedInventory.gateCount,
  totalValidationInventory:
    IntegrationGovernancePlatform.manifestDerivedInventory
      .totalValidationInventory,
  validationAggregateResult:
    IntegrationGovernancePlatform.manifestDerivedInventory
      .validationAggregateResult,
  validationReadiness:
    IntegrationGovernancePlatform.manifestDerivedInventory
      .validationReadiness,
  countsDerivedFromPlatform: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Canonical immutable Integration Governance Certification aggregate.
 */
export const IntegrationGovernanceCertification = Object.freeze({
  identity: IntegrationGovernanceCertificationIdentity,
  criteria: IntegrationGovernanceCertificationCriteria,
  gates: IntegrationGovernanceCertificationGates,
  results: IntegrationGovernanceCertificationResults,
  resultValues: IntegrationGovernanceCertificationResultValues,
  aggregateResult: IntegrationGovernanceCertificationAggregateResult,
  dependencies: IntegrationGovernanceCertificationDependencies,
  readiness: IntegrationGovernanceCertificationReadiness,
  readinessValue: IntegrationGovernanceCertificationReadinessValue,
  platformReference: Object.freeze({
    canonicalId: IntegrationGovernancePlatformCanonicalId,
    identity: IntegrationGovernancePlatformIdentity,
    aggregate: IntegrationGovernancePlatform,
    entryPoint: "integrationGovernancePlatform.ts" as const,
    exclusive: true as const,
  }),
  platformDerivedInventory,
  status: IntegrationGovernanceCertificationStatusValue,
  nextPhase: "EIL-7:8 — Integration Governance Freeze",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  certificationEngine: false as const,
  runtimeValidation: false as const,
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
