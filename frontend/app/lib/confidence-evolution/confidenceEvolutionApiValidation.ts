/**
 * APP-9:7 — Confidence Evolution API validation.
 */

import { validateConfidenceEvolution } from "./confidenceEvolutionContracts.ts";
import { isConfidenceEvolutionEngineInitialized } from "./confidenceEvolutionEngine.ts";
import { isConfidenceEvolutionQueryLayerInitialized } from "./confidenceEvolutionQuery.ts";
import { isConfidenceEvolutionTrendLayerInitialized } from "./confidenceEvolutionTrend.ts";
import { isConfidenceEvidenceReasonLayerInitialized } from "./confidenceEvolutionEvidenceReason.ts";
import { isConfidenceCalibrationLayerInitialized } from "./confidenceEvolutionCalibration.ts";
import {
  CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_API_GROUP_KEYS,
  type ConfidenceEvolutionApi,
  type ConfidenceEvolutionApiCapabilityManifest,
  type ConfidenceEvolutionValidationIssue,
  type ConfidenceEvolutionValidationResult,
} from "./confidenceEvolutionApiTypes.ts";
import { getAllConsumerContracts } from "./confidenceEvolutionConsumerValidation.ts";

function issue(code: string, message: string, field?: string): ConfidenceEvolutionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ConfidenceEvolutionValidationIssue[]): ConfidenceEvolutionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateConfidenceEvolutionApiPrerequisites(): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  const foundation = validateConfidenceEvolution();
  if (!foundation.valid) {
    issues.push(...foundation.issues);
  }
  if (!isConfidenceEvolutionEngineInitialized()) {
    issues.push(issue("engine_not_initialized", "APP-9:2 engine is not initialized."));
  }
  if (!isConfidenceEvolutionQueryLayerInitialized()) {
    issues.push(issue("query_not_initialized", "APP-9:3 query layer is not initialized."));
  }
  if (!isConfidenceEvolutionTrendLayerInitialized()) {
    issues.push(issue("trend_not_initialized", "APP-9:4 trend layer is not initialized."));
  }
  if (!isConfidenceEvidenceReasonLayerInitialized()) {
    issues.push(issue("evidence_reason_not_initialized", "APP-9:5 evidence/reason layer is not initialized."));
  }
  if (!isConfidenceCalibrationLayerInitialized()) {
    issues.push(issue("calibration_not_initialized", "APP-9:6 calibration layer is not initialized."));
  }
  return result(issues);
}

export function validateConfidenceEvolutionApiContract(api: ConfidenceEvolutionApi | null): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (!api) {
    issues.push(issue("api_not_initialized", "Confidence Evolution API is not initialized."));
    return result(issues);
  }
  if (api.version !== CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "API contract version mismatch.", "version"));
  }
  for (const group of CONFIDENCE_EVOLUTION_API_GROUP_KEYS) {
    if (!(group in api)) {
      issues.push(issue("missing_api_group", `Missing API group: ${group}.`, group));
    }
  }
  return result(issues);
}

export function validateConfidenceEvolutionApiManifest(
  manifest: ConfidenceEvolutionApiCapabilityManifest
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (manifest.version !== CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Manifest version mismatch.", "version"));
  }
  if (manifest.appId !== "APP-9") {
    issues.push(issue("invalid_manifest", "Manifest appId mismatch.", "appId"));
  }
  if (manifest.availableApiGroups.length !== CONFIDENCE_EVOLUTION_API_GROUP_KEYS.length) {
    issues.push(issue("invalid_manifest", "Available API groups incomplete.", "availableApiGroups"));
  }
  if (manifest.consumerCompatibility.length !== getAllConsumerContracts().length) {
    issues.push(issue("invalid_manifest", "Consumer compatibility matrix incomplete.", "consumerCompatibility"));
  }
  if (!manifest.directImportGuardNotes.includes("MUST import APP-9:7")) {
    issues.push(issue("invalid_manifest", "Direct import guard notes missing.", "directImportGuardNotes"));
  }
  return result(issues);
}

export const ConfidenceEvolutionApiValidation = Object.freeze({
  validateConfidenceEvolutionApiPrerequisites,
  validateConfidenceEvolutionApiContract,
  validateConfidenceEvolutionApiManifest,
});
