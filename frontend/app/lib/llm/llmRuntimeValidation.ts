/**
 * LLM-3 — Runtime request/response validation.
 */

import { discoverLlmProviderAdapters } from "./llmProviderRegistry.ts";
import { isLlmProviderKey } from "./llmProviderValidation.ts";
import {
  LLM_RUNTIME_LIMITS,
  LLM_RUNTIME_MANDATORY_REQUEST_FIELDS,
  LLM_RUNTIME_MANDATORY_RESPONSE_FIELDS,
  LLM_RUNTIME_MODE_KEYS,
} from "./llmRuntimeContracts.ts";
import { validateLlmRuntimeErrorConsistency } from "./llmRuntimeErrors.ts";
import { isLlmRuntimeStatus } from "./llmRuntimeStatus.ts";
import type {
  LlmRuntimeRequestEnvelope,
  LlmRuntimeResponseEnvelope,
  LlmRuntimeValidationIssue,
  LlmRuntimeValidationReport,
  LlmRuntimeValidationRuleKey,
} from "./llmRuntimeTypes.ts";

function issue(
  code: string,
  message: string,
  ruleKey: LlmRuntimeValidationRuleKey,
  field?: string
): LlmRuntimeValidationIssue {
  return Object.freeze({ code, message, field, ruleKey, readOnly: true as const });
}

function report(issues: LlmRuntimeValidationIssue[]): LlmRuntimeValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isLlmRuntimeMode(value: string): value is (typeof LLM_RUNTIME_MODE_KEYS)[number] {
  return (LLM_RUNTIME_MODE_KEYS as readonly string[]).includes(value);
}

export function validateLlmRuntimeTraceAndCorrelation(request: LlmRuntimeRequestEnvelope): LlmRuntimeValidationReport {
  const issues: LlmRuntimeValidationIssue[] = [];
  if (!request.traceId.trim()) {
    issues.push(issue("missing_trace_id", "Trace ID is required.", "trace_correlation_presence", "traceId"));
  }
  if (!request.correlationId.trim()) {
    issues.push(issue("missing_correlation_id", "Correlation ID is required.", "trace_correlation_presence", "correlationId"));
  }
  return report(issues);
}

export function validateLlmRuntimeProviderCompatibility(
  request: LlmRuntimeRequestEnvelope,
  registeredProviderKeys?: readonly string[]
): LlmRuntimeValidationReport {
  const issues: LlmRuntimeValidationIssue[] = [];
  if (!isLlmProviderKey(request.providerKey)) {
    issues.push(issue("invalid_provider_key", "Provider key is not a canonical LLM/2 provider.", "provider_key_compatibility", "providerKey"));
    return report(issues);
  }
  const keys = registeredProviderKeys ?? discoverLlmProviderAdapters().map((adapter) => adapter.identity.providerKey);
  if (keys.length > 0 && !keys.includes(request.providerKey)) {
    issues.push(issue("unregistered_provider", "Provider key is not registered in LLM/2 adapter registry.", "provider_key_compatibility", "providerKey"));
  }
  return report(issues);
}

export function validateLlmRuntimeModeValidity(request: LlmRuntimeRequestEnvelope): LlmRuntimeValidationReport {
  const issues: LlmRuntimeValidationIssue[] = [];
  if (!isLlmRuntimeMode(request.runtimeMode)) {
    issues.push(issue("invalid_runtime_mode", "Runtime mode is invalid.", "runtime_mode_validity", "runtimeMode"));
  }
  if (request.dryRun && request.runtimeMode !== "dry_run" && request.runtimeMode !== "mock") {
    issues.push(issue("dry_run_mode_mismatch", "Dry-run flag requires dry_run or mock runtime mode.", "runtime_mode_validity", "dryRun"));
  }
  return report(issues);
}

export function validateLlmRuntimeTokenLimits(request: LlmRuntimeRequestEnvelope): LlmRuntimeValidationReport {
  const issues: LlmRuntimeValidationIssue[] = [];
  if (request.maxTokens !== undefined) {
    if (request.maxTokens < LLM_RUNTIME_LIMITS.minMaxTokens || request.maxTokens > LLM_RUNTIME_LIMITS.maxMaxTokens) {
      issues.push(issue("invalid_max_tokens", "Max tokens out of bounds.", "token_limit_bounds", "maxTokens"));
    }
  }
  return report(issues);
}

export function validateLlmRuntimeTemperatureBounds(request: LlmRuntimeRequestEnvelope): LlmRuntimeValidationReport {
  const issues: LlmRuntimeValidationIssue[] = [];
  if (request.temperature !== undefined) {
    if (request.temperature < LLM_RUNTIME_LIMITS.minTemperature || request.temperature > LLM_RUNTIME_LIMITS.maxTemperature) {
      issues.push(issue("invalid_temperature", "Temperature out of bounds.", "temperature_bounds", "temperature"));
    }
  }
  return report(issues);
}

export function validateLlmRuntimeRequest(request: LlmRuntimeRequestEnvelope): LlmRuntimeValidationReport {
  const issues: LlmRuntimeValidationIssue[] = [];
  for (const field of LLM_RUNTIME_MANDATORY_REQUEST_FIELDS) {
    if (!(field in request)) {
      issues.push(issue("missing_request_field", `Missing mandatory request field: ${field}`, "required_request_fields", field));
    }
  }
  if (!request.userMessage.trim()) {
    issues.push(issue("empty_user_message", "User message is required.", "required_request_fields", "userMessage"));
  }
  if (request.userMessage.length > LLM_RUNTIME_LIMITS.maxUserMessageLength) {
    issues.push(issue("user_message_too_long", "User message exceeds maximum length.", "required_request_fields", "userMessage"));
  }
  issues.push(...validateLlmRuntimeTraceAndCorrelation(request).issues);
  issues.push(...validateLlmRuntimeProviderCompatibility(request).issues);
  issues.push(...validateLlmRuntimeModeValidity(request).issues);
  issues.push(...validateLlmRuntimeTokenLimits(request).issues);
  issues.push(...validateLlmRuntimeTemperatureBounds(request).issues);
  return report(issues);
}

export function validateLlmRuntimeResponse(
  response: LlmRuntimeResponseEnvelope,
  request?: LlmRuntimeRequestEnvelope
): LlmRuntimeValidationReport {
  const issues: LlmRuntimeValidationIssue[] = [];
  for (const field of LLM_RUNTIME_MANDATORY_RESPONSE_FIELDS) {
    if (!(field in response)) {
      issues.push(issue("missing_response_field", `Missing mandatory response field: ${field}`, "response_consistency", field));
    }
  }
  if (!isLlmRuntimeStatus(response.status)) {
    issues.push(issue("invalid_status", "Response status is invalid.", "response_consistency", "status"));
  }
  if (request) {
    if (response.requestId !== request.requestId) {
      issues.push(issue("request_id_mismatch", "Response request ID does not match request.", "response_consistency", "requestId"));
    }
    if (response.providerKey !== request.providerKey) {
      issues.push(issue("provider_key_mismatch", "Response provider key does not match request.", "response_consistency", "providerKey"));
    }
    if (response.modelKey !== request.modelKey) {
      issues.push(issue("model_key_mismatch", "Response model key does not match request.", "response_consistency", "modelKey"));
    }
  }
  for (const message of validateLlmRuntimeErrorConsistency(response)) {
    issues.push(issue("error_inconsistent", message, "error_consistency"));
  }
  return report(issues);
}
