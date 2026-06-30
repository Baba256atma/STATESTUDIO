/**
 * LLM-7 — Cost record validation.
 */

import { isLlmProviderKey } from "./llmProviderValidation.ts";
import {
  LLM_COST_COMPATIBLE_VERSIONS,
  LLM_COST_CONTRACT_VERSION,
  LLM_COST_MANDATORY_RECORD_FIELDS,
  LLM_COST_TOKEN_DEPENDENCY,
} from "./llmCostContracts.ts";
import type {
  LlmCostAggregationSummary,
  LlmCostPricingProfile,
  LlmCostRecord,
  LlmCostValidationIssue,
  LlmCostValidationReport,
} from "./llmCostTypes.ts";
import { roundLlmCost } from "./llmCostEstimator.ts";

function issue(code: string, message: string, field?: string): LlmCostValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: LlmCostValidationIssue[]): LlmCostValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateLlmCostRecord(record: LlmCostRecord): LlmCostValidationReport {
  const issues: LlmCostValidationIssue[] = [];
  for (const field of LLM_COST_MANDATORY_RECORD_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!isLlmProviderKey(record.providerKey)) {
    issues.push(issue("invalid_provider_key", "Provider key is invalid.", "providerKey"));
  }
  if (record.inputCost < 0 || record.outputCost < 0 || record.totalEstimatedCost < 0) {
    issues.push(issue("negative_cost", "Costs must be non-negative."));
  }
  if (record.totalEstimatedCost !== roundLlmCost(record.inputCost + record.outputCost)) {
    issues.push(issue("total_cost_mismatch", "Total cost must equal input cost plus output cost.", "totalEstimatedCost"));
  }
  if (!record.currency.trim()) {
    issues.push(issue("missing_currency", "Currency is required.", "currency"));
  }
  if (!record.pricingProfileId.trim()) {
    issues.push(issue("missing_pricing_profile", "Pricing profile ID is required.", "pricingProfileId"));
  }
  return report(issues);
}

export function validateLlmCostVersionCompatibility(): LlmCostValidationReport {
  if (!(LLM_COST_COMPATIBLE_VERSIONS as readonly string[]).includes(LLM_COST_TOKEN_DEPENDENCY)) {
    return report([issue("token_dependency_incompatible", `Token dependency ${LLM_COST_TOKEN_DEPENDENCY} is incompatible.`)]);
  }
  return report([]);
}

export function validatePricingProfileCompatibility(
  record: LlmCostRecord,
  profile: LlmCostPricingProfile
): LlmCostValidationReport {
  const issues: LlmCostValidationIssue[] = [];
  if (record.pricingProfileId !== profile.pricingProfileId) {
    issues.push(issue("pricing_profile_mismatch", "Pricing profile ID mismatch."));
  }
  if (record.providerKey !== profile.providerKey || record.modelKey !== profile.modelKey) {
    issues.push(issue("pricing_profile_scope_mismatch", "Pricing profile provider/model mismatch."));
  }
  if (record.currency !== profile.currency) {
    issues.push(issue("currency_mismatch", "Record currency does not match pricing profile."));
  }
  return report(issues);
}

export function validateCostAggregationConsistency(
  records: readonly LlmCostRecord[],
  summary: LlmCostAggregationSummary
): LlmCostValidationReport {
  const matching = records.filter((record) => {
    switch (summary.scope) {
      case "user":
        return record.userId === summary.scopeKey && record.currency === summary.currency;
      case "workspace":
        return record.workspaceId === summary.scopeKey && record.currency === summary.currency;
      case "organization":
        return record.organizationId === summary.scopeKey && record.currency === summary.currency;
      case "provider":
        return record.providerKey === summary.scopeKey && record.currency === summary.currency;
      case "model":
        return record.modelKey === summary.scopeKey && record.currency === summary.currency;
      case "currency":
        return record.currency === summary.scopeKey;
      default:
        return false;
    }
  });
  const issues: LlmCostValidationIssue[] = [];
  const inputCost = roundLlmCost(matching.reduce((sum, record) => sum + record.inputCost, 0));
  const outputCost = roundLlmCost(matching.reduce((sum, record) => sum + record.outputCost, 0));
  const totalCost = roundLlmCost(matching.reduce((sum, record) => sum + record.totalEstimatedCost, 0));
  if (summary.inputCost !== inputCost) {
    issues.push(issue("aggregation_input_cost_mismatch", "Aggregation input cost is inconsistent."));
  }
  if (summary.outputCost !== outputCost) {
    issues.push(issue("aggregation_output_cost_mismatch", "Aggregation output cost is inconsistent."));
  }
  if (summary.totalEstimatedCost !== totalCost) {
    issues.push(issue("aggregation_total_cost_mismatch", "Aggregation total cost is inconsistent."));
  }
  if (summary.recordCount !== matching.length) {
    issues.push(issue("aggregation_count_mismatch", "Aggregation record count is inconsistent."));
  }
  return report(issues);
}

export function validateDuplicateLlmCostRecord(
  existingIds: readonly string[],
  costRecordId: string,
  tokenRecordId: string,
  existingTokenIds: readonly string[]
): LlmCostValidationReport {
  if (existingIds.includes(costRecordId)) {
    return report([issue("duplicate_cost_record_id", "Duplicate cost record ID.")]);
  }
  if (existingTokenIds.includes(tokenRecordId)) {
    return report([issue("duplicate_token_record_id", "Cost already recorded for token record.")]);
  }
  return report([]);
}

export function getDefaultCostCompatibility(): readonly string[] {
  return Object.freeze([...LLM_COST_COMPATIBLE_VERSIONS, LLM_COST_CONTRACT_VERSION]);
}
