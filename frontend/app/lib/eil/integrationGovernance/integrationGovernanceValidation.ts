/**
 * EIL-7:4 — Integration Governance Validation.
 *
 * Canonical immutable validation architecture for Integration Governance.
 * Consumes only the EIL-7:3 Integration Governance Model aggregate.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by EIL-7:4.
 */

import {
  IntegrationGovernanceModel,
  IntegrationGovernanceModelCanonicalId,
  IntegrationGovernanceModelIdentity,
} from "./integrationGovernanceModel.ts";
import { IntegrationGovernanceValidationCategories } from "./integrationGovernanceValidationCategories.ts";
import { IntegrationGovernanceValidationGates } from "./integrationGovernanceValidationGates.ts";
import { IntegrationGovernanceValidationInventory } from "./integrationGovernanceValidationInventory.ts";
import {
  IntegrationGovernanceValidationCanonicalId,
  IntegrationGovernanceValidationIdentity,
  IntegrationGovernanceValidationName,
  IntegrationGovernanceValidationNamespace,
  IntegrationGovernanceValidationPhaseId,
  IntegrationGovernanceValidationReadiness,
  IntegrationGovernanceValidationReport,
  IntegrationGovernanceValidationStatusValue,
  IntegrationGovernanceValidationVersion,
} from "./integrationGovernanceValidationReport.ts";
import {
  IntegrationGovernanceValidationAggregateResult,
  IntegrationGovernanceValidationResults,
  IntegrationGovernanceValidationResultValues,
} from "./integrationGovernanceValidationResults.ts";
import { IntegrationGovernanceValidationRules } from "./integrationGovernanceValidationRules.ts";

export {
  IntegrationGovernanceValidationCanonicalId,
  IntegrationGovernanceValidationIdentity,
  IntegrationGovernanceValidationName,
  IntegrationGovernanceValidationNamespace,
  IntegrationGovernanceValidationPhaseId,
  IntegrationGovernanceValidationReadiness,
  IntegrationGovernanceValidationReport,
  IntegrationGovernanceValidationStatusValue,
  IntegrationGovernanceValidationVersion,
};

const dependency = Object.freeze({
  dependencyId: "EIL-7:4/Dependency/EIL73Model",
  upstreamPhase: "EIL-7:3" as const,
  upstreamCanonicalId: IntegrationGovernanceModelCanonicalId,
  modelOnly: true as const,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil7PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  directPreviousPhaseModule: "integrationGovernanceModel.ts" as const,
  packageEntry: "frontend/app/lib/eil/integrationGovernance" as const,
  canonicalPath: "EIL-7:4 → EIL-7:3 IntegrationGovernanceModel (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Integration Governance Validation aggregate.
 */
export const IntegrationGovernanceValidation = Object.freeze({
  identity: IntegrationGovernanceValidationIdentity,
  categories: IntegrationGovernanceValidationCategories,
  rules: IntegrationGovernanceValidationRules,
  gates: IntegrationGovernanceValidationGates,
  results: IntegrationGovernanceValidationResults,
  resultValues: IntegrationGovernanceValidationResultValues,
  inventory: IntegrationGovernanceValidationInventory,
  report: IntegrationGovernanceValidationReport,
  aggregateResult: IntegrationGovernanceValidationAggregateResult,
  readiness: IntegrationGovernanceValidationReadiness,
  dependency,
  modelIdentity: IntegrationGovernanceModelIdentity,
  model: IntegrationGovernanceModel,
  status: IntegrationGovernanceValidationStatusValue,
  nextPhase: "EIL-7:5 — Integration Governance Manifest",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeValidation: false as const,
  validationEngine: false as const,
  governanceEngine: false as const,
  policyEngine: false as const,
  complianceEngine: false as const,
  approvalWorkflow: false as const,
  auditRuntime: false as const,
  riskRuntime: false as const,
  versionManager: false as const,
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
