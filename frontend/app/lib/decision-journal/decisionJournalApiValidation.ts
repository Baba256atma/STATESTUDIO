/**
 * APP-8:7 — Decision Journal API validation.
 */

import { validateDecisionJournal } from "./decisionJournalContracts.ts";
import { isDecisionJournalEngineInitialized } from "./decisionJournalEngine.ts";
import { isDecisionJournalQueryLayerInitialized } from "./decisionJournalQuery.ts";
import { isDecisionJournalReflectionLayerInitialized } from "./decisionJournalReflection.ts";
import { isDecisionJournalEvidenceAssumptionLayerInitialized } from "./decisionJournalEvidenceAssumption.ts";
import { isDecisionJournalRetrospectiveLayerInitialized } from "./decisionJournalRetrospective.ts";
import {
  DECISION_JOURNAL_API_CONTRACT_VERSION,
  DECISION_JOURNAL_API_GROUP_KEYS,
  type DecisionJournalApi,
  type DecisionJournalApiCapabilityManifest,
  type DecisionJournalValidationIssue,
  type DecisionJournalValidationResult,
} from "./decisionJournalApiTypes.ts";
import { getAllConsumerContracts } from "./decisionJournalConsumerValidation.ts";

function issue(code: string, message: string, field?: string): DecisionJournalValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionJournalValidationIssue[]): DecisionJournalValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateDecisionJournalApiPrerequisites(): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  const foundation = validateDecisionJournal();
  if (!foundation.valid) {
    issues.push(...foundation.issues);
  }
  if (!isDecisionJournalEngineInitialized()) {
    issues.push(issue("engine_not_initialized", "APP-8:2 engine is not initialized."));
  }
  if (!isDecisionJournalQueryLayerInitialized()) {
    issues.push(issue("query_not_initialized", "APP-8:3 query layer is not initialized."));
  }
  if (!isDecisionJournalReflectionLayerInitialized()) {
    issues.push(issue("reflection_not_initialized", "APP-8:4 reflection layer is not initialized."));
  }
  if (!isDecisionJournalEvidenceAssumptionLayerInitialized()) {
    issues.push(issue("quality_not_initialized", "APP-8:5 evidence/assumption layer is not initialized."));
  }
  if (!isDecisionJournalRetrospectiveLayerInitialized()) {
    issues.push(issue("retrospective_not_initialized", "APP-8:6 retrospective layer is not initialized."));
  }
  return result(issues);
}

export function validateDecisionJournalApiContract(api: DecisionJournalApi | null): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  if (!api) {
    issues.push(issue("api_not_initialized", "Decision Journal API is not initialized."));
    return result(issues);
  }
  if (api.version !== DECISION_JOURNAL_API_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "API contract version mismatch.", "version"));
  }
  for (const group of DECISION_JOURNAL_API_GROUP_KEYS) {
    if (!(group in api)) {
      issues.push(issue("missing_api_group", `Missing API group: ${group}.`, group));
    }
  }
  return result(issues);
}

export function validateDecisionJournalApiManifest(manifest: DecisionJournalApiCapabilityManifest): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  if (manifest.version !== DECISION_JOURNAL_API_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Manifest version mismatch.", "version"));
  }
  if (manifest.appId !== "APP-8") {
    issues.push(issue("invalid_manifest", "Manifest appId mismatch.", "appId"));
  }
  if (manifest.availableApiGroups.length !== DECISION_JOURNAL_API_GROUP_KEYS.length) {
    issues.push(issue("invalid_manifest", "Available API groups incomplete.", "availableApiGroups"));
  }
  if (manifest.consumerCompatibility.length !== getAllConsumerContracts().length) {
    issues.push(issue("invalid_manifest", "Consumer compatibility matrix incomplete.", "consumerCompatibility"));
  }
  if (!manifest.directImportGuardNotes.includes("MUST import APP-8:7")) {
    issues.push(issue("invalid_manifest", "Direct import guard notes missing.", "directImportGuardNotes"));
  }
  return result(issues);
}

export const DecisionJournalApiValidation = Object.freeze({
  validateDecisionJournalApiPrerequisites,
  validateDecisionJournalApiContract,
  validateDecisionJournalApiManifest,
});
