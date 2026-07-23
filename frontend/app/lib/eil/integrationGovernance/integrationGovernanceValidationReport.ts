/**
 * EIL-7:4 — Integration Governance Validation Report.
 *
 * Immutable architectural validation report.
 * Metadata-only. No runtime evaluation.
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
  IntegrationGovernanceValidationAggregateResult,
  IntegrationGovernanceValidationResults,
} from "./integrationGovernanceValidationResults.ts";
import { IntegrationGovernanceValidationRules } from "./integrationGovernanceValidationRules.ts";

/** Canonical validation identity constants used by the report. */
export const IntegrationGovernanceValidationPhaseId = "EIL-7:4" as const;
export const IntegrationGovernanceValidationCanonicalId =
  "EIL-7:4/IntegrationGovernanceValidation" as const;
export const IntegrationGovernanceValidationName =
  "Integration Governance Validation" as const;
export const IntegrationGovernanceValidationVersion = "1.0.0" as const;
export const IntegrationGovernanceValidationNamespace =
  "nexora.eil.integration-governance.validation" as const;
export const IntegrationGovernanceValidationStatusValue = "Validation" as const;
export const IntegrationGovernanceValidationReadiness =
  "ReadyForManifest" as const;

/**
 * Immutable Validation identity.
 */
export const IntegrationGovernanceValidationIdentity = Object.freeze({
  phaseId: IntegrationGovernanceValidationPhaseId,
  canonicalId: IntegrationGovernanceValidationCanonicalId,
  name: IntegrationGovernanceValidationName,
  version: IntegrationGovernanceValidationVersion,
  namespace: IntegrationGovernanceValidationNamespace,
  layer: "EIL" as const,
  platform: "EIL-7" as const,
  phaseType: "Validation" as const,
  status: IntegrationGovernanceValidationStatusValue,
  readiness: IntegrationGovernanceValidationReadiness,
  modelDependency: IntegrationGovernanceModelCanonicalId,
  modelEntryPoint: "integrationGovernanceModel.ts" as const,
  description:
    "Canonical immutable validation architecture for Integration Governance Model integrity.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Immutable architectural validation report.
 */
export const IntegrationGovernanceValidationReport = Object.freeze({
  reportId: "EIL-7:4/Report" as const,
  identity: IntegrationGovernanceValidationIdentity,
  categories: IntegrationGovernanceValidationCategories,
  rules: IntegrationGovernanceValidationRules,
  gates: IntegrationGovernanceValidationGates,
  results: IntegrationGovernanceValidationResults,
  inventory: IntegrationGovernanceValidationInventory,
  aggregateResult: IntegrationGovernanceValidationAggregateResult,
  readiness: IntegrationGovernanceValidationReadiness,
  modelIdentity: IntegrationGovernanceModelIdentity,
  model: IntegrationGovernanceModel,
  metadataOnly: true as const,
  evaluatesRuntime: false as const,
  immutable: true as const,
  deterministic: true as const,
});
