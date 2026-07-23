/**
 * EIL-9:4 — Executive Integration Layer Validation.
 *
 * Canonical immutable validation architecture for Executive Integration Layer.
 * Consumes only the EIL-9:3 Executive Integration Layer Model aggregate.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by EIL-9:4.
 */

import {
  ExecutiveIntegrationLayerModel,
  ExecutiveIntegrationLayerModelCanonicalId,
  ExecutiveIntegrationLayerModelIdentity,
} from "./executiveIntegrationLayerModel.ts";
import { ExecutiveIntegrationLayerValidationCategories } from "./executiveIntegrationLayerValidationCategories.ts";
import { ExecutiveIntegrationLayerValidationGates } from "./executiveIntegrationLayerValidationGates.ts";
import { ExecutiveIntegrationLayerValidationInventory } from "./executiveIntegrationLayerValidationInventory.ts";
import {
  ExecutiveIntegrationLayerValidationCanonicalId,
  ExecutiveIntegrationLayerValidationIdentity,
  ExecutiveIntegrationLayerValidationName,
  ExecutiveIntegrationLayerValidationNamespace,
  ExecutiveIntegrationLayerValidationPhaseId,
  ExecutiveIntegrationLayerValidationReadiness,
  ExecutiveIntegrationLayerValidationReport,
  ExecutiveIntegrationLayerValidationStatusValue,
  ExecutiveIntegrationLayerValidationVersion,
} from "./executiveIntegrationLayerValidationReport.ts";
import {
  ExecutiveIntegrationLayerValidationAggregateResult,
  ExecutiveIntegrationLayerValidationResults,
  ExecutiveIntegrationLayerValidationResultValues,
} from "./executiveIntegrationLayerValidationResults.ts";
import { ExecutiveIntegrationLayerValidationRules } from "./executiveIntegrationLayerValidationRules.ts";

export {
  ExecutiveIntegrationLayerValidationCanonicalId,
  ExecutiveIntegrationLayerValidationIdentity,
  ExecutiveIntegrationLayerValidationName,
  ExecutiveIntegrationLayerValidationNamespace,
  ExecutiveIntegrationLayerValidationPhaseId,
  ExecutiveIntegrationLayerValidationReadiness,
  ExecutiveIntegrationLayerValidationReport,
  ExecutiveIntegrationLayerValidationStatusValue,
  ExecutiveIntegrationLayerValidationVersion,
};

const dependency = Object.freeze({
  dependencyId: "EIL-9:4/Dependency/EIL93Model" as const,
  upstreamPhase: "EIL-9:3" as const,
  upstreamCanonicalId: ExecutiveIntegrationLayerModelCanonicalId,
  modelOnly: true as const,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterEil9PhaseImport: false as const,
  publicIndexDirectImport: false as const,
  eil8DirectImport: false as const,
  eil1ThroughEil7DirectImport: false as const,
  directPreviousPhaseModule: "executiveIntegrationLayerModel.ts" as const,
  packageEntry: "frontend/app/lib/eil/executiveIntegrationLayer" as const,
  canonicalPath:
    "EIL-9:4 → EIL-9:3 ExecutiveIntegrationLayerModel (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Executive Integration Layer Validation aggregate.
 */
export const ExecutiveIntegrationLayerValidation = Object.freeze({
  identity: ExecutiveIntegrationLayerValidationIdentity,
  categories: ExecutiveIntegrationLayerValidationCategories,
  rules: ExecutiveIntegrationLayerValidationRules,
  gates: ExecutiveIntegrationLayerValidationGates,
  results: ExecutiveIntegrationLayerValidationResults,
  resultValues: ExecutiveIntegrationLayerValidationResultValues,
  inventory: ExecutiveIntegrationLayerValidationInventory,
  report: ExecutiveIntegrationLayerValidationReport,
  aggregateResult: ExecutiveIntegrationLayerValidationAggregateResult,
  readiness: ExecutiveIntegrationLayerValidationReadiness,
  dependency,
  modelIdentity: ExecutiveIntegrationLayerModelIdentity,
  model: ExecutiveIntegrationLayerModel,
  status: ExecutiveIntegrationLayerValidationStatusValue,
  nextPhase: "EIL-9:5 — Executive Integration Layer Manifest",
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
  importsLaterEil9Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
