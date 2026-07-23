/**
 * EIL-9:4 — Executive Integration Layer Validation Report.
 *
 * Immutable architectural validation report.
 * Metadata-only. No runtime evaluation.
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
  ExecutiveIntegrationLayerValidationAggregateResult,
  ExecutiveIntegrationLayerValidationResults,
} from "./executiveIntegrationLayerValidationResults.ts";
import { ExecutiveIntegrationLayerValidationRules } from "./executiveIntegrationLayerValidationRules.ts";

/** Canonical validation identity constants used by the report. */
export const ExecutiveIntegrationLayerValidationPhaseId = "EIL-9:4" as const;
export const ExecutiveIntegrationLayerValidationCanonicalId =
  "EIL-9:4/ExecutiveIntegrationLayerValidation" as const;
export const ExecutiveIntegrationLayerValidationName =
  "Executive Integration Layer Validation" as const;
export const ExecutiveIntegrationLayerValidationVersion = "1.0.0" as const;
export const ExecutiveIntegrationLayerValidationNamespace =
  "nexora.eil.executive-integration-layer.validation" as const;
export const ExecutiveIntegrationLayerValidationStatusValue =
  "Validation" as const;
export const ExecutiveIntegrationLayerValidationReadiness =
  "ReadyForManifest" as const;

/**
 * Immutable Validation identity.
 */
export const ExecutiveIntegrationLayerValidationIdentity = Object.freeze({
  phaseId: ExecutiveIntegrationLayerValidationPhaseId,
  canonicalId: ExecutiveIntegrationLayerValidationCanonicalId,
  name: ExecutiveIntegrationLayerValidationName,
  version: ExecutiveIntegrationLayerValidationVersion,
  namespace: ExecutiveIntegrationLayerValidationNamespace,
  layer: "EIL" as const,
  platform: "EIL-9" as const,
  phaseType: "Validation" as const,
  status: ExecutiveIntegrationLayerValidationStatusValue,
  readiness: ExecutiveIntegrationLayerValidationReadiness,
  modelDependency: ExecutiveIntegrationLayerModelCanonicalId,
  modelEntryPoint: "executiveIntegrationLayerModel.ts" as const,
  description:
    "Canonical immutable validation architecture for Executive Integration Layer Model integrity.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Immutable architectural validation report.
 */
export const ExecutiveIntegrationLayerValidationReport = Object.freeze({
  reportId: "EIL-9:4/Report" as const,
  identity: ExecutiveIntegrationLayerValidationIdentity,
  categories: ExecutiveIntegrationLayerValidationCategories,
  rules: ExecutiveIntegrationLayerValidationRules,
  gates: ExecutiveIntegrationLayerValidationGates,
  results: ExecutiveIntegrationLayerValidationResults,
  inventory: ExecutiveIntegrationLayerValidationInventory,
  aggregateResult: ExecutiveIntegrationLayerValidationAggregateResult,
  readiness: ExecutiveIntegrationLayerValidationReadiness,
  modelIdentity: ExecutiveIntegrationLayerModelIdentity,
  model: ExecutiveIntegrationLayerModel,
  metadataOnly: true as const,
  evaluatesRuntime: false as const,
  immutable: true as const,
  deterministic: true as const,
});
