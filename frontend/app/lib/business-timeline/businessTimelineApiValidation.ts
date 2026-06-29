/**
 * APP-7:6 — Business Timeline API validation.
 */

import { validateBusinessTimeline } from "./businessTimelineContracts.ts";
import { isBusinessEventEngineInitialized } from "./businessEventEngine.ts";
import { isBusinessTimelineQueryLayerInitialized } from "./businessTimelineQuery.ts";
import { isBusinessTimelineLifecycleLayerInitialized } from "./businessTimelineLifecycle.ts";
import { isBusinessTimelineContextLayerInitialized } from "./businessTimelineContext.ts";
import {
  BUSINESS_TIMELINE_API_CONTRACT_VERSION,
  BUSINESS_TIMELINE_API_GROUP_KEYS,
  type BusinessTimelineApi,
  type BusinessTimelineApiCapabilityManifest,
  type BusinessValidationIssue,
  type BusinessValidationResult,
} from "./businessTimelineApiTypes.ts";
import { getAllConsumerContracts } from "./businessTimelineConsumerValidation.ts";

function issue(code: string, message: string, field?: string): BusinessValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: BusinessValidationIssue[]): BusinessValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateBusinessTimelineApiPrerequisites(): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  const foundation = validateBusinessTimeline();
  if (!foundation.valid) {
    issues.push(...foundation.issues);
  }
  if (!isBusinessEventEngineInitialized()) {
    issues.push(issue("engine_not_initialized", "APP-7:2 event engine is not initialized."));
  }
  if (!isBusinessTimelineQueryLayerInitialized()) {
    issues.push(issue("query_not_initialized", "APP-7:3 query layer is not initialized."));
  }
  if (!isBusinessTimelineLifecycleLayerInitialized()) {
    issues.push(issue("lifecycle_not_initialized", "APP-7:4 lifecycle layer is not initialized."));
  }
  if (!isBusinessTimelineContextLayerInitialized()) {
    issues.push(issue("context_not_initialized", "APP-7:5 context layer is not initialized."));
  }
  return result(issues);
}

export function validateBusinessTimelineApiContract(api: BusinessTimelineApi | null): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!api) {
    issues.push(issue("api_not_initialized", "Business Timeline API is not initialized."));
    return result(issues);
  }
  if (api.version !== BUSINESS_TIMELINE_API_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "API contract version mismatch.", "version"));
  }
  for (const group of BUSINESS_TIMELINE_API_GROUP_KEYS) {
    if (!(group in api)) {
      issues.push(issue("missing_api_group", `Missing API group: ${group}.`, group));
    }
  }
  return result(issues);
}

export function validateBusinessTimelineApiManifest(manifest: BusinessTimelineApiCapabilityManifest): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (manifest.version !== BUSINESS_TIMELINE_API_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Manifest version mismatch.", "version"));
  }
  if (manifest.availableApiGroups.length !== BUSINESS_TIMELINE_API_GROUP_KEYS.length) {
    issues.push(issue("invalid_manifest", "Available API groups incomplete.", "availableApiGroups"));
  }
  if (manifest.consumerCompatibility.length !== getAllConsumerContracts().length) {
    issues.push(issue("invalid_manifest", "Consumer compatibility matrix incomplete.", "consumerCompatibility"));
  }
  if (!manifest.directImportGuardNotes.includes("MUST import APP-7:6")) {
    issues.push(issue("invalid_manifest", "Direct import guard notes missing.", "directImportGuardNotes"));
  }
  return result(issues);
}

export const BusinessTimelineApiValidation = Object.freeze({
  validateBusinessTimelineApiPrerequisites,
  validateBusinessTimelineApiContract,
  validateBusinessTimelineApiManifest,
});
