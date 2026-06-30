/**
 * LLM-2 — Provider adapter validation.
 */

import { LLM_PROVIDER_KEYS } from "./llmPlatformContracts.ts";
import {
  LLM_PROVIDER_COMPATIBLE_FOUNDATION_VERSIONS,
  LLM_PROVIDER_CONTRACT_VERSION,
  LLM_PROVIDER_MANDATORY_IDENTITY_FIELDS,
  LLM_PROVIDER_MANDATORY_REQUEST_FIELDS,
  LLM_PROVIDER_MANDATORY_RESPONSE_FIELDS,
} from "./llmProviderContracts.ts";
import { validateLlmProviderCapabilityConsistency } from "./llmProviderCapabilities.ts";
import type {
  LlmProviderAdapterContract,
  LlmProviderAdapterRegistrationInput,
  LlmProviderIdentity,
  LlmProviderRequestContract,
  LlmProviderResponseContract,
  LlmProviderValidationIssue,
  LlmProviderValidationReport,
} from "./llmProviderTypes.ts";

function issue(code: string, message: string, field?: string): LlmProviderValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: LlmProviderValidationIssue[]): LlmProviderValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isLlmProviderKey(value: string): value is (typeof LLM_PROVIDER_KEYS)[number] {
  return (LLM_PROVIDER_KEYS as readonly string[]).includes(value);
}

export function validateLlmProviderFoundationCompatibility(foundationVersion: string): LlmProviderValidationReport {
  if (!(LLM_PROVIDER_COMPATIBLE_FOUNDATION_VERSIONS as readonly string[]).includes(foundationVersion)) {
    return report([
      issue("incompatible_foundation", `Foundation version ${foundationVersion} is not compatible with LLM/2.`),
    ]);
  }
  return report([]);
}

export function validateLlmProviderIdentity(identity: LlmProviderIdentity): LlmProviderValidationReport {
  const issues: LlmProviderValidationIssue[] = [];
  for (const field of LLM_PROVIDER_MANDATORY_IDENTITY_FIELDS) {
    if (!(field in identity)) {
      issues.push(issue("missing_identity_field", `Missing mandatory identity field: ${field}`, field));
    }
  }
  if (!isLlmProviderKey(identity.providerKey)) {
    issues.push(issue("invalid_provider_key", "Provider key is not a canonical LLM/1 provider key.", "providerKey"));
  }
  if (identity.contractVersion !== LLM_PROVIDER_CONTRACT_VERSION) {
    issues.push(issue("contract_version_mismatch", "Contract version must be LLM/2.", "contractVersion"));
  }
  if (identity.supportedCapabilities.length === 0) {
    issues.push(issue("empty_capabilities", "Provider must declare at least one capability.", "supportedCapabilities"));
  }
  const capabilityIssues = validateLlmProviderCapabilityConsistency(identity.supportedCapabilities);
  for (const message of capabilityIssues) {
    issues.push(issue("capability_inconsistent", message, "supportedCapabilities"));
  }
  return report(issues);
}

export function validateLlmProviderRequestContract(request: LlmProviderRequestContract): LlmProviderValidationReport {
  const issues: LlmProviderValidationIssue[] = [];
  for (const field of LLM_PROVIDER_MANDATORY_REQUEST_FIELDS) {
    if (!(field in request)) {
      issues.push(issue("missing_request_field", `Missing mandatory request field: ${field}`, field));
    }
  }
  if (!isLlmProviderKey(request.providerKey)) {
    issues.push(issue("invalid_provider_key", "Request provider key is invalid.", "providerKey"));
  }
  return report(issues);
}

export function validateLlmProviderResponseContract(
  response: LlmProviderResponseContract
): LlmProviderValidationReport {
  const issues: LlmProviderValidationIssue[] = [];
  for (const field of LLM_PROVIDER_MANDATORY_RESPONSE_FIELDS) {
    if (!(field in response)) {
      issues.push(issue("missing_response_field", `Missing mandatory response field: ${field}`, field));
    }
  }
  if (!isLlmProviderKey(response.providerKey)) {
    issues.push(issue("invalid_provider_key", "Response provider key is invalid.", "providerKey"));
  }
  return report(issues);
}

export function validateLlmProviderAdapter(adapter: LlmProviderAdapterContract): LlmProviderValidationReport {
  const issues: LlmProviderValidationIssue[] = [];
  const identityReport = validateLlmProviderIdentity(adapter.identity);
  issues.push(...identityReport.issues);
  const foundationReport = validateLlmProviderFoundationCompatibility(adapter.foundationVersion);
  issues.push(...foundationReport.issues);
  if (adapter.capabilities.length === 0) {
    issues.push(issue("empty_capability_declarations", "Adapter must include capability declarations."));
  }
  const supportedCount = adapter.capabilities.filter((capability) => capability.supported).length;
  if (supportedCount !== adapter.identity.supportedCapabilities.length) {
    issues.push(issue("capability_count_mismatch", "Capability declarations do not match identity supported capabilities."));
  }
  return report(issues);
}

export function validateLlmProviderRegistrationInput(
  input: LlmProviderAdapterRegistrationInput
): LlmProviderValidationReport {
  const issues: LlmProviderValidationIssue[] = [];
  if (!isLlmProviderKey(input.providerKey)) {
    issues.push(issue("invalid_provider_key", "Provider key is not registered in LLM/1.", "providerKey"));
  }
  if (input.supportedCapabilities) {
    const capabilityIssues = validateLlmProviderCapabilityConsistency(input.supportedCapabilities);
    for (const message of capabilityIssues) {
      issues.push(issue("capability_inconsistent", message, "supportedCapabilities"));
    }
  }
  return report(issues);
}

export function validateLlmProviderRegistryUniqueness(
  adapters: readonly LlmProviderAdapterContract[]
): LlmProviderValidationReport {
  const issues: LlmProviderValidationIssue[] = [];
  const providerKeys = adapters.map((adapter) => adapter.identity.providerKey);
  const adapterIds = adapters.map((adapter) => adapter.adapterId);
  if (new Set(providerKeys).size !== providerKeys.length) {
    issues.push(issue("duplicate_provider_key", "Each provider key may register only one adapter."));
  }
  if (new Set(adapterIds).size !== adapterIds.length) {
    issues.push(issue("duplicate_adapter_id", "Adapter IDs must be unique."));
  }
  return report(issues);
}

export function validateLlmProviderRegistry(
  adapters: readonly LlmProviderAdapterContract[]
): LlmProviderValidationReport {
  const issues: LlmProviderValidationIssue[] = [];
  const uniquenessReport = validateLlmProviderRegistryUniqueness(adapters);
  issues.push(...uniquenessReport.issues);
  for (const adapter of adapters) {
    const adapterReport = validateLlmProviderAdapter(adapter);
    issues.push(...adapterReport.issues);
  }
  return report(issues);
}
