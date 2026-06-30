/**
 * LLM-3 — Runtime contract registry.
 */

import { buildLlmProviderAdapterLayer } from "./llmProviderExports.ts";
import {
  LLM_RUNTIME_CONTRACT_VERSION,
  LLM_RUNTIME_DEFAULT_LIMITS,
  LLM_RUNTIME_MODE_KEYS,
  LLM_RUNTIME_VALIDATION_RULE_KEYS,
} from "./llmRuntimeContracts.ts";
import type {
  LlmRuntimeContractRegistration,
  LlmRuntimeModeRegistration,
  LlmRuntimeRegistry,
  LlmRuntimeValidationRuleRegistration,
} from "./llmRuntimeTypes.ts";

const contractRegistry = new Map<string, LlmRuntimeContractRegistration>();
const modeRegistry = new Map<string, LlmRuntimeModeRegistration>();
const validationRuleRegistry = new Map<string, LlmRuntimeValidationRuleRegistration>();

const RUNTIME_CONTRACT_DEFINITIONS = Object.freeze([
  Object.freeze({ contractKey: "request_envelope", label: "Runtime Request Envelope", description: "Normalized runtime request contract." }),
  Object.freeze({ contractKey: "response_envelope", label: "Runtime Response Envelope", description: "Normalized runtime response contract." }),
  Object.freeze({ contractKey: "execution_metadata", label: "Runtime Execution Metadata", description: "Execution trace and lifecycle metadata." }),
  Object.freeze({ contractKey: "adapter_execution", label: "Provider Adapter Execution Interface", description: "Method signatures only — no implementation." }),
] as const);

const RUNTIME_MODE_LABELS: Record<(typeof LLM_RUNTIME_MODE_KEYS)[number], string> = {
  standard: "Standard Runtime Mode",
  dry_run: "Dry-Run Runtime Mode",
  mock: "Mock Runtime Mode",
};

const VALIDATION_RULE_LABELS: Record<(typeof LLM_RUNTIME_VALIDATION_RULE_KEYS)[number], string> = {
  required_request_fields: "Required Request Fields",
  provider_key_compatibility: "Provider Key Compatibility",
  runtime_mode_validity: "Runtime Mode Validity",
  token_limit_bounds: "Token Limit Bounds",
  temperature_bounds: "Temperature Bounds",
  trace_correlation_presence: "Trace and Correlation Presence",
  response_consistency: "Response Consistency",
  error_consistency: "Error Consistency",
};

export function resetLlmRuntimeRegistryForTests(): void {
  contractRegistry.clear();
  modeRegistry.clear();
  validationRuleRegistry.clear();
}

export function registerLlmRuntimeContract(
  contractKey: string,
  label: string,
  description: string,
  timestamp: string
): LlmRuntimeContractRegistration {
  const registration = Object.freeze({
    contractId: `llm-runtime-contract-${contractKey}`,
    contractKey,
    version: LLM_RUNTIME_CONTRACT_VERSION,
    label,
    description,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  contractRegistry.set(contractKey, registration);
  return registration;
}

export function registerLlmRuntimeMode(modeKey: (typeof LLM_RUNTIME_MODE_KEYS)[number]): LlmRuntimeModeRegistration {
  const registration = Object.freeze({
    modeId: `llm-runtime-mode-${modeKey}`,
    modeKey,
    label: RUNTIME_MODE_LABELS[modeKey],
    description: `Runtime mode contract: ${modeKey}.`,
    readOnly: true as const,
  });
  modeRegistry.set(modeKey, registration);
  return registration;
}

export function registerLlmRuntimeValidationRule(
  ruleKey: (typeof LLM_RUNTIME_VALIDATION_RULE_KEYS)[number]
): LlmRuntimeValidationRuleRegistration {
  const registration = Object.freeze({
    ruleId: `llm-runtime-rule-${ruleKey}`,
    ruleKey,
    label: VALIDATION_RULE_LABELS[ruleKey],
    description: `Validation rule: ${ruleKey}.`,
    readOnly: true as const,
  });
  validationRuleRegistry.set(ruleKey, registration);
  return registration;
}

export function seedDefaultLlmRuntimeRegistry(timestamp: string): void {
  if (contractRegistry.size >= LLM_RUNTIME_DEFAULT_LIMITS.maxRegisteredContracts) {
    return;
  }
  for (const definition of RUNTIME_CONTRACT_DEFINITIONS) {
    registerLlmRuntimeContract(definition.contractKey, definition.label, definition.description, timestamp);
  }
  for (const modeKey of LLM_RUNTIME_MODE_KEYS) {
    registerLlmRuntimeMode(modeKey);
  }
  for (const ruleKey of LLM_RUNTIME_VALIDATION_RULE_KEYS) {
    registerLlmRuntimeValidationRule(ruleKey);
  }
}

export function getLlmRuntimeRegistry(): LlmRuntimeRegistry {
  const contracts = Object.freeze([...contractRegistry.values()]);
  const modes = Object.freeze([...modeRegistry.values()]);
  const validationRules = Object.freeze([...validationRuleRegistry.values()]);
  return Object.freeze({
    contracts,
    modes,
    validationRules,
    contractCount: contracts.length,
    modeCount: modes.length,
    validationRuleCount: validationRules.length,
    readOnly: true as const,
  });
}

export function discoverLlmRuntimeModes(): readonly LlmRuntimeModeRegistration[] {
  return getLlmRuntimeRegistry().modes;
}

export function discoverLlmRuntimeValidationRules(): readonly LlmRuntimeValidationRuleRegistration[] {
  return getLlmRuntimeRegistry().validationRules;
}

export function ensureLlmRuntimeDependenciesReady(timestamp: string): boolean {
  const providerLayer = buildLlmProviderAdapterLayer(timestamp);
  return providerLayer.success;
}
