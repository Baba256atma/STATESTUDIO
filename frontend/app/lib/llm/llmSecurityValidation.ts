/**
 * LLM-10 — Security validation.
 */

import { LLM_CONTEXT_CONTRACT_VERSION } from "./llmContextContracts.ts";
import { validateContextPackage } from "./llmContextValidation.ts";
import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { validatePromptPackage } from "./llmPromptValidation.ts";
import {
  LLM_SECURITY_COMPATIBLE_VERSIONS,
  LLM_SECURITY_CONTRACT_VERSION,
  LLM_SECURITY_CONTEXT_DEPENDENCY,
  LLM_SECURITY_DECISION_KEYS,
  LLM_SECURITY_PROMPT_DEPENDENCY,
} from "./llmSecurityContracts.ts";
import { isLlmSecurityPolicyKey } from "./llmSecurityPolicies.ts";
import type {
  LlmSecurityDecision,
  LlmSecurityInspectionInput,
  LlmSecurityManifest,
  LlmSecurityPolicyRegistration,
  LlmSecurityRedactionSummary,
  LlmSecurityValidationIssue,
  LlmSecurityValidationReport,
} from "./llmSecurityTypes.ts";

function issue(code: string, message: string, field?: string): LlmSecurityValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: LlmSecurityValidationIssue[]): LlmSecurityValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateSecurityInspectionInput(input: LlmSecurityInspectionInput): LlmSecurityValidationReport {
  const issues: LlmSecurityValidationIssue[] = [];
  if (!input.promptPackage) {
    issues.push(issue("missing_prompt_package", "Prompt package is required."));
    return report(issues);
  }
  const promptValidation = validatePromptPackage(input.promptPackage);
  if (!promptValidation.valid) {
    issues.push(issue("invalid_prompt_package", promptValidation.issues[0]?.message ?? "Prompt package is invalid."));
  }
  if (input.contextPackage) {
    const contextValidation = validateContextPackage(input.contextPackage);
    if (!contextValidation.valid) {
      issues.push(issue("invalid_context_package", contextValidation.issues[0]?.message ?? "Context package is invalid."));
    }
  }
  if (input.policyKey && !isLlmSecurityPolicyKey(input.policyKey)) {
    issues.push(issue("invalid_policy_key", "Security policy key is invalid.", "policyKey"));
  }
  return report(issues);
}

export function validateSecurityPolicyCompatibility(
  policy: LlmSecurityPolicyRegistration
): LlmSecurityValidationReport {
  const issues: LlmSecurityValidationIssue[] = [];
  if (policy.version !== LLM_SECURITY_CONTRACT_VERSION) {
    issues.push(issue("policy_version_mismatch", "Security policy version must be LLM/10.", "version"));
  }
  if (policy.enabledRedactionRules.length === 0) {
    issues.push(issue("empty_redaction_rules", "Security policy must declare redaction rules."));
  }
  return report(issues);
}

export function validateSecurityDecision(decision: LlmSecurityDecision): LlmSecurityValidationReport {
  const issues: LlmSecurityValidationIssue[] = [];
  if (!decision.decisionId.trim()) {
    issues.push(issue("missing_decision_id", "Decision ID is required.", "decisionId"));
  }
  if (!(LLM_SECURITY_DECISION_KEYS as readonly string[]).includes(decision.decision)) {
    issues.push(issue("invalid_decision", "Decision must be allow or deny.", "decision"));
  }
  if (decision.appliedPolicies.length === 0) {
    issues.push(issue("missing_applied_policies", "Applied policies are required."));
  }
  if (decision.validationResult !== "valid" && decision.validationResult !== "invalid") {
    issues.push(issue("invalid_validation_result", "Validation result is invalid.", "validationResult"));
  }
  if (decision.decision === "allow" && !decision.redactedPromptPackage) {
    issues.push(issue("missing_redacted_prompt", "Allow decisions must include a redacted prompt package."));
  }
  if (!validateRedactionSummaryConsistency(decision.redactionSummary).valid) {
    issues.push(issue("invalid_redaction_summary", "Redaction summary is inconsistent."));
  }
  return report(issues);
}

export function validateRedactionSummaryConsistency(summary: LlmSecurityRedactionSummary): LlmSecurityValidationReport {
  const counted = Object.values(summary.redactionsByRule).reduce((total, count) => total + count, 0);
  if (counted !== summary.totalRedactions) {
    return report([issue("redaction_count_mismatch", "Redaction summary counts are inconsistent.")]);
  }
  if (summary.totalRedactions > 0 && summary.affectedSectionIds.length === 0) {
    return report([issue("missing_affected_sections", "Redaction summary must list affected sections when redactions occur.")]);
  }
  return report([]);
}

export function validateSecurityManifestConsistency(manifest: LlmSecurityManifest): LlmSecurityValidationReport {
  const issues: LlmSecurityValidationIssue[] = [];
  if (manifest.securityVersion !== LLM_SECURITY_CONTRACT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Security manifest version must be LLM/10."));
  }
  if (!(manifest.compatibility as readonly string[]).includes(LLM_SECURITY_CONTEXT_DEPENDENCY)) {
    issues.push(issue("missing_context_compatibility", "Manifest must declare LLM/5 compatibility."));
  }
  if (!(manifest.compatibility as readonly string[]).includes(LLM_SECURITY_PROMPT_DEPENDENCY)) {
    issues.push(issue("missing_prompt_compatibility", "Manifest must declare LLM/4 compatibility."));
  }
  return report(issues);
}

export function validatePromptSecurityCompatibility(promptVersion: string, contextVersion?: string): LlmSecurityValidationReport {
  const issues: LlmSecurityValidationIssue[] = [];
  if (promptVersion !== LLM_PROMPT_CONTRACT_VERSION) {
    issues.push(issue("prompt_version_incompatible", "Prompt package must be LLM/4 for security inspection."));
  }
  if (contextVersion && contextVersion !== LLM_CONTEXT_CONTRACT_VERSION) {
    issues.push(issue("context_version_incompatible", "Context package must be LLM/5 for security inspection."));
  }
  return report(issues);
}

export function getDefaultSecurityCompatibility(): readonly string[] {
  return Object.freeze([...LLM_SECURITY_COMPATIBLE_VERSIONS, LLM_SECURITY_CONTRACT_VERSION]);
}
