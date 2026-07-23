/**
 * EIL-6:4 — Integration Observability Validation Report.
 *
 * Immutable architectural validation report.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-6:4.
 */

import {
  IntegrationObservabilityModel,
  IntegrationObservabilityModelCanonicalId,
  IntegrationObservabilityModelIdentity,
} from "./integrationObservabilityModel.ts";
import { IntegrationObservabilityValidationCategories } from "./integrationObservabilityValidationCategories.ts";
import { IntegrationObservabilityValidationGates } from "./integrationObservabilityValidationGates.ts";
import { IntegrationObservabilityValidationInventory } from "./integrationObservabilityValidationInventory.ts";
import {
  IntegrationObservabilityValidationAggregateResult,
  IntegrationObservabilityValidationResults,
} from "./integrationObservabilityValidationResults.ts";
import { IntegrationObservabilityValidationRules } from "./integrationObservabilityValidationRules.ts";

/** Canonical validation identity constants used by the report. */
export const IntegrationObservabilityValidationPhaseId = "EIL-6:4" as const;
export const IntegrationObservabilityValidationCanonicalId =
  "EIL-6:4/IntegrationObservabilityValidation" as const;
export const IntegrationObservabilityValidationName =
  "Integration Observability Validation" as const;
export const IntegrationObservabilityValidationVersion = "1.0.0" as const;
export const IntegrationObservabilityValidationNamespace =
  "nexora.eil.integration-observability.validation" as const;
export const IntegrationObservabilityValidationStatusValue =
  "Validation" as const;
export const IntegrationObservabilityValidationReadiness =
  "ReadyForManifest" as const;

/**
 * Immutable Validation identity.
 */
export const IntegrationObservabilityValidationIdentity = Object.freeze({
  phaseId: IntegrationObservabilityValidationPhaseId,
  canonicalId: IntegrationObservabilityValidationCanonicalId,
  name: IntegrationObservabilityValidationName,
  version: IntegrationObservabilityValidationVersion,
  namespace: IntegrationObservabilityValidationNamespace,
  layer: "EIL" as const,
  platform: "EIL-6" as const,
  phaseType: "Validation" as const,
  status: IntegrationObservabilityValidationStatusValue,
  readiness: IntegrationObservabilityValidationReadiness,
  modelDependency: IntegrationObservabilityModelCanonicalId,
  modelEntryPoint: "integrationObservabilityModel.ts" as const,
  description:
    "Canonical immutable validation architecture for Integration Observability Model integrity.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Immutable architectural validation report.
 */
export const IntegrationObservabilityValidationReport = Object.freeze({
  reportId: "EIL-6:4/Report" as const,
  identity: IntegrationObservabilityValidationIdentity,
  categories: IntegrationObservabilityValidationCategories,
  rules: IntegrationObservabilityValidationRules,
  gates: IntegrationObservabilityValidationGates,
  results: IntegrationObservabilityValidationResults,
  inventory: IntegrationObservabilityValidationInventory,
  aggregateResult: IntegrationObservabilityValidationAggregateResult,
  readiness: IntegrationObservabilityValidationReadiness,
  modelIdentity: IntegrationObservabilityModelIdentity,
  model: IntegrationObservabilityModel,
  metadataOnly: true as const,
  evaluatesRuntime: false as const,
  immutable: true as const,
  deterministic: true as const,
});
