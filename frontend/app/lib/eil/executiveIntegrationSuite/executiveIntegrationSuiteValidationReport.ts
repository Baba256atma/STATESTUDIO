/**
 * EIL-8:4 — Executive Integration Suite Validation Report.
 *
 * Immutable architectural validation report.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-8:4.
 */

import {
  ExecutiveIntegrationSuiteModel,
  ExecutiveIntegrationSuiteModelCanonicalId,
  ExecutiveIntegrationSuiteModelIdentity,
} from "./executiveIntegrationSuiteModel.ts";
import { ExecutiveIntegrationSuiteValidationCategories } from "./executiveIntegrationSuiteValidationCategories.ts";
import { ExecutiveIntegrationSuiteValidationGates } from "./executiveIntegrationSuiteValidationGates.ts";
import { ExecutiveIntegrationSuiteValidationInventory } from "./executiveIntegrationSuiteValidationInventory.ts";
import {
  ExecutiveIntegrationSuiteValidationAggregateResult,
  ExecutiveIntegrationSuiteValidationResults,
} from "./executiveIntegrationSuiteValidationResults.ts";
import { ExecutiveIntegrationSuiteValidationRules } from "./executiveIntegrationSuiteValidationRules.ts";

/** Canonical validation identity constants used by the report. */
export const ExecutiveIntegrationSuiteValidationPhaseId = "EIL-8:4" as const;
export const ExecutiveIntegrationSuiteValidationCanonicalId =
  "EIL-8:4/ExecutiveIntegrationSuiteValidation" as const;
export const ExecutiveIntegrationSuiteValidationName =
  "Executive Integration Suite Validation" as const;
export const ExecutiveIntegrationSuiteValidationVersion = "1.0.0" as const;
export const ExecutiveIntegrationSuiteValidationNamespace =
  "nexora.eil.executive-integration-suite.validation" as const;
export const ExecutiveIntegrationSuiteValidationStatusValue =
  "Validation" as const;
export const ExecutiveIntegrationSuiteValidationReadiness =
  "ReadyForManifest" as const;

/**
 * Immutable Validation identity.
 */
export const ExecutiveIntegrationSuiteValidationIdentity = Object.freeze({
  phaseId: ExecutiveIntegrationSuiteValidationPhaseId,
  canonicalId: ExecutiveIntegrationSuiteValidationCanonicalId,
  name: ExecutiveIntegrationSuiteValidationName,
  version: ExecutiveIntegrationSuiteValidationVersion,
  namespace: ExecutiveIntegrationSuiteValidationNamespace,
  layer: "EIL" as const,
  platform: "EIL-8" as const,
  phaseType: "Validation" as const,
  status: ExecutiveIntegrationSuiteValidationStatusValue,
  readiness: ExecutiveIntegrationSuiteValidationReadiness,
  modelDependency: ExecutiveIntegrationSuiteModelCanonicalId,
  modelEntryPoint: "executiveIntegrationSuiteModel.ts" as const,
  description:
    "Canonical immutable validation architecture for Executive Integration Suite Model integrity.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Immutable architectural validation report.
 */
export const ExecutiveIntegrationSuiteValidationReport = Object.freeze({
  reportId: "EIL-8:4/Report" as const,
  identity: ExecutiveIntegrationSuiteValidationIdentity,
  categories: ExecutiveIntegrationSuiteValidationCategories,
  rules: ExecutiveIntegrationSuiteValidationRules,
  gates: ExecutiveIntegrationSuiteValidationGates,
  results: ExecutiveIntegrationSuiteValidationResults,
  inventory: ExecutiveIntegrationSuiteValidationInventory,
  aggregateResult: ExecutiveIntegrationSuiteValidationAggregateResult,
  readiness: ExecutiveIntegrationSuiteValidationReadiness,
  modelIdentity: ExecutiveIntegrationSuiteModelIdentity,
  model: ExecutiveIntegrationSuiteModel,
  metadataOnly: true as const,
  evaluatesRuntime: false as const,
  immutable: true as const,
  deterministic: true as const,
});
