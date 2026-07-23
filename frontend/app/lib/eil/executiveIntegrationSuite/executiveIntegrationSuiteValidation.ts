/**
 * EIL-8:4 — Executive Integration Suite Validation.
 *
 * Canonical immutable validation architecture for Executive Integration Suite.
 * Consumes only the EIL-8:3 Executive Integration Suite Model aggregate.
 * Metadata-only. Runtime-free. Ready for Manifest.
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
  ExecutiveIntegrationSuiteValidationCanonicalId,
  ExecutiveIntegrationSuiteValidationIdentity,
  ExecutiveIntegrationSuiteValidationName,
  ExecutiveIntegrationSuiteValidationNamespace,
  ExecutiveIntegrationSuiteValidationPhaseId,
  ExecutiveIntegrationSuiteValidationReadiness,
  ExecutiveIntegrationSuiteValidationReport,
  ExecutiveIntegrationSuiteValidationStatusValue,
  ExecutiveIntegrationSuiteValidationVersion,
} from "./executiveIntegrationSuiteValidationReport.ts";
import {
  ExecutiveIntegrationSuiteValidationAggregateResult,
  ExecutiveIntegrationSuiteValidationResults,
  ExecutiveIntegrationSuiteValidationResultValues,
} from "./executiveIntegrationSuiteValidationResults.ts";
import { ExecutiveIntegrationSuiteValidationRules } from "./executiveIntegrationSuiteValidationRules.ts";

export {
  ExecutiveIntegrationSuiteValidationCanonicalId,
  ExecutiveIntegrationSuiteValidationIdentity,
  ExecutiveIntegrationSuiteValidationName,
  ExecutiveIntegrationSuiteValidationNamespace,
  ExecutiveIntegrationSuiteValidationPhaseId,
  ExecutiveIntegrationSuiteValidationReadiness,
  ExecutiveIntegrationSuiteValidationReport,
  ExecutiveIntegrationSuiteValidationStatusValue,
  ExecutiveIntegrationSuiteValidationVersion,
};

const dependency = Object.freeze({
  dependencyId: "EIL-8:4/Dependency/EIL83Model" as const,
  upstreamPhase: "EIL-8:3" as const,
  upstreamCanonicalId: ExecutiveIntegrationSuiteModelCanonicalId,
  modelOnly: true as const,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil8PhaseImport: false as const,
  publicIndexDirectImport: false as const,
  directPreviousPhaseModule: "executiveIntegrationSuiteModel.ts" as const,
  packageEntry: "frontend/app/lib/eil/executiveIntegrationSuite" as const,
  canonicalPath:
    "EIL-8:4 → EIL-8:3 ExecutiveIntegrationSuiteModel (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Executive Integration Suite Validation aggregate.
 */
export const ExecutiveIntegrationSuiteValidation = Object.freeze({
  identity: ExecutiveIntegrationSuiteValidationIdentity,
  categories: ExecutiveIntegrationSuiteValidationCategories,
  rules: ExecutiveIntegrationSuiteValidationRules,
  gates: ExecutiveIntegrationSuiteValidationGates,
  results: ExecutiveIntegrationSuiteValidationResults,
  resultValues: ExecutiveIntegrationSuiteValidationResultValues,
  inventory: ExecutiveIntegrationSuiteValidationInventory,
  report: ExecutiveIntegrationSuiteValidationReport,
  aggregateResult: ExecutiveIntegrationSuiteValidationAggregateResult,
  readiness: ExecutiveIntegrationSuiteValidationReadiness,
  dependency,
  modelIdentity: ExecutiveIntegrationSuiteModelIdentity,
  model: ExecutiveIntegrationSuiteModel,
  status: ExecutiveIntegrationSuiteValidationStatusValue,
  nextPhase: "EIL-8:5 — Executive Integration Suite Manifest",
  compositionOnly: true as const,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeValidation: false as const,
  validationEngine: false as const,
  integrationRuntime: false as const,
  orchestration: false as const,
  routing: false as const,
  governance: false as const,
  observability: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  apiBehavior: false as const,
  serviceBehavior: false as const,
  workerBehavior: false as const,
  schedulingBehavior: false as const,
  dashboard: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil8Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
