/**
 * LLM-6 — Token usage record validation.
 */

import { isLlmProviderKey } from "./llmProviderValidation.ts";
import {
  LLM_TOKEN_COMPATIBLE_VERSIONS,
  LLM_TOKEN_CONTRACT_VERSION,
  LLM_TOKEN_CONTEXT_DEPENDENCY,
  LLM_TOKEN_MANDATORY_RECORD_FIELDS,
  LLM_TOKEN_RUNTIME_DEPENDENCY,
} from "./llmTokenContracts.ts";
import type {
  LlmTokenAggregationSummary,
  LlmTokenUsageRecord,
  LlmTokenValidationIssue,
  LlmTokenValidationReport,
} from "./llmTokenTypes.ts";

function issue(code: string, message: string, field?: string): LlmTokenValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: LlmTokenValidationIssue[]): LlmTokenValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateTokenRecord(record: LlmTokenUsageRecord): LlmTokenValidationReport {
  const issues: LlmTokenValidationIssue[] = [];
  for (const field of LLM_TOKEN_MANDATORY_RECORD_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!isLlmProviderKey(record.providerKey)) {
    issues.push(issue("invalid_provider_key", "Provider key is invalid.", "providerKey"));
  }
  if (record.estimatedInputTokens < 0) {
    issues.push(issue("negative_input_tokens", "Input tokens must be non-negative.", "estimatedInputTokens"));
  }
  if (record.estimatedOutputTokens < 0) {
    issues.push(issue("negative_output_tokens", "Output tokens must be non-negative.", "estimatedOutputTokens"));
  }
  if (record.totalTokens < 0) {
    issues.push(issue("negative_total_tokens", "Total tokens must be non-negative.", "totalTokens"));
  }
  if (record.totalTokens !== record.estimatedInputTokens + record.estimatedOutputTokens) {
    issues.push(issue("total_mismatch", "Total tokens must equal input plus output tokens.", "totalTokens"));
  }
  if (!record.requestId.trim() || !record.responseId.trim()) {
    issues.push(issue("missing_identifiers", "Request and response IDs are required."));
  }
  return report(issues);
}

export function validateTokenVersionCompatibility(): LlmTokenValidationReport {
  const required = [LLM_TOKEN_RUNTIME_DEPENDENCY, LLM_TOKEN_CONTEXT_DEPENDENCY, LLM_TOKEN_CONTRACT_VERSION];
  for (const version of required) {
    if (!(LLM_TOKEN_COMPATIBLE_VERSIONS as readonly string[]).includes(version) && version !== LLM_TOKEN_CONTRACT_VERSION) {
      return report([issue("version_incompatible", `Incompatible version: ${version}`)]);
    }
  }
  return report([]);
}

export function validateAggregationConsistency(
  records: readonly LlmTokenUsageRecord[],
  summary: LlmTokenAggregationSummary
): LlmTokenValidationReport {
  const matching = records.filter((record) => {
    switch (summary.scope) {
      case "user":
        return record.userId === summary.scopeKey;
      case "session":
        return record.sessionId === summary.scopeKey;
      case "workspace":
        return record.workspaceId === summary.scopeKey;
      case "organization":
        return record.organizationId === summary.scopeKey;
      case "provider":
        return record.providerKey === summary.scopeKey;
      case "model":
        return record.modelKey === summary.scopeKey;
      default:
        return false;
    }
  });
  const inputSum = matching.reduce((sum, record) => sum + record.estimatedInputTokens, 0);
  const outputSum = matching.reduce((sum, record) => sum + record.estimatedOutputTokens, 0);
  const totalSum = matching.reduce((sum, record) => sum + record.totalTokens, 0);
  const issues: LlmTokenValidationIssue[] = [];
  if (summary.estimatedInputTokens !== inputSum) {
    issues.push(issue("aggregation_input_mismatch", "Aggregation input token sum is inconsistent."));
  }
  if (summary.estimatedOutputTokens !== outputSum) {
    issues.push(issue("aggregation_output_mismatch", "Aggregation output token sum is inconsistent."));
  }
  if (summary.totalTokens !== totalSum) {
    issues.push(issue("aggregation_total_mismatch", "Aggregation total token sum is inconsistent."));
  }
  if (summary.responseCount !== matching.length) {
    issues.push(issue("aggregation_count_mismatch", "Aggregation response count is inconsistent."));
  }
  return report(issues);
}

export function validateDuplicateTokenRecord(
  existingIds: readonly string[],
  recordId: string,
  requestId: string,
  responseId: string,
  existingPairs: readonly string[]
): LlmTokenValidationReport {
  if (existingIds.includes(recordId)) {
    return report([issue("duplicate_record_id", "Duplicate token usage record ID.")]);
  }
  const pair = `${requestId}:${responseId}`;
  if (existingPairs.includes(pair)) {
    return report([issue("duplicate_request_response", "Duplicate request/response token record.")]);
  }
  return report([]);
}
