/**
 * LLM-10 — Security & Redaction Guard contracts and constants.
 */

export const LLM_SECURITY_CONTRACT_VERSION = "LLM/10" as const;
export const LLM_SECURITY_PLATFORM_ID = "llm-security-redaction-guard" as const;
export const LLM_SECURITY_PLATFORM_NAME = "Security & Redaction Guard" as const;
export const LLM_SECURITY_CONTEXT_DEPENDENCY = "LLM/5" as const;
export const LLM_SECURITY_PROMPT_DEPENDENCY = "LLM/4" as const;

export const LLM_SECURITY_TAGS = Object.freeze([
  "[LLM_10]",
  "[SECURITY_REDACTION]",
  "[DETERMINISTIC]",
  "[VALIDATION_ONLY]",
  "[NO_AUTH]",
  "[NO_PROVIDER_CALLS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_SECURITY_POLICY_KEYS = Object.freeze([
  "public",
  "internal",
  "confidential",
  "restricted",
  "enterprise_custom",
] as const);

export const LLM_SECURITY_REDACTION_RULE_KEYS = Object.freeze([
  "secret_placeholder",
  "credential_reference",
  "api_key_placeholder",
  "password_placeholder",
  "pii_placeholder",
  "internal_reference_placeholder",
] as const);

export const LLM_SECURITY_DECISION_KEYS = Object.freeze(["allow", "deny"] as const);

export const LLM_SECURITY_PUBLIC_API_REGISTRY = Object.freeze([
  "inspectPromptSecurity",
  "redactPromptPackage",
  "validateSecurityDecision",
  "registerSecurityPolicy",
  "discoverSecurityPolicies",
  "getSecurityManifest",
  "getSecurityRegistry",
  "buildLlmSecurityRedactionLayer",
] as const);

export const LLM_SECURITY_COMPATIBLE_VERSIONS = Object.freeze([
  "LLM/1",
  "LLM/2",
  "LLM/3",
  "LLM/4",
  "LLM/5",
  "LLM/6",
  "LLM/7",
  "LLM/8",
  "LLM/9",
] as const);

export const LLM_SECURITY_PRINCIPLES = Object.freeze([
  "validates_and_redacts_only_never_executes",
  "no_authentication_no_authorization",
  "no_encryption_no_provider_calls",
  "deterministic_inspection_and_redaction",
  "source_data_never_mutated",
  "placeholder_replacement_only",
  "nothing_reaches_provider_without_passing_guard",
] as const);

export const LLM_SECURITY_MUST_NOT_OWN = Object.freeze([
  "authentication",
  "authorization",
  "encryption",
  "provider_execution",
  "billing",
  "routing_decisions",
  "runtime_execution",
] as const);

export const LLM_SECURITY_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredPolicies: 32,
  maxWarningsPerDecision: 64,
} as const);

export const LLM_SECURITY_DENY_MARKERS = Object.freeze([
  "DENY_ALWAYS",
  "securityDeny",
  "restrictedBlock",
] as const);

export const LLM_SECURITY_REDACTION_REPLACEMENTS = Object.freeze({
  secret_placeholder: "[REDACTED_SECRET]",
  credential_reference: "[REDACTED_CREDENTIAL]",
  api_key_placeholder: "[REDACTED_API_KEY]",
  password_placeholder: "[REDACTED_PASSWORD]",
  pii_placeholder: "[REDACTED_PII]",
  internal_reference_placeholder: "[REDACTED_INTERNAL_REF]",
} as const);
