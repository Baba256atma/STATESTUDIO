/**
 * LLM-10 — Security policy definitions.
 */

import {
  LLM_SECURITY_CONTRACT_VERSION,
  LLM_SECURITY_POLICY_KEYS,
  LLM_SECURITY_REDACTION_RULE_KEYS,
} from "./llmSecurityContracts.ts";
import type {
  LlmSecurityPolicyInput,
  LlmSecurityPolicyKey,
  LlmSecurityPolicyRegistration,
  LlmSecurityRedactionRuleKey,
} from "./llmSecurityTypes.ts";

export const LLM_SECURITY_POLICY_LABELS = Object.freeze({
  public: "Public",
  internal: "Internal",
  confidential: "Confidential",
  restricted: "Restricted",
  enterprise_custom: "Enterprise Custom",
} as const);

const BASE_REDACTION_RULES = Object.freeze([
  "secret_placeholder",
  "credential_reference",
  "api_key_placeholder",
  "password_placeholder",
  "pii_placeholder",
] as const satisfies readonly LlmSecurityRedactionRuleKey[]);

const INTERNAL_REDACTION_RULES = Object.freeze([
  ...BASE_REDACTION_RULES,
  "internal_reference_placeholder",
] as const satisfies readonly LlmSecurityRedactionRuleKey[]);

export function isLlmSecurityPolicyKey(value: string): value is LlmSecurityPolicyKey {
  return (LLM_SECURITY_POLICY_KEYS as readonly string[]).includes(value);
}

export function isLlmSecurityRedactionRuleKey(value: string): value is LlmSecurityRedactionRuleKey {
  return (LLM_SECURITY_REDACTION_RULE_KEYS as readonly string[]).includes(value);
}

export function resolveDefaultSecurityPolicyKey(): LlmSecurityPolicyKey {
  return "public";
}

export function getDefaultPolicyDefinition(policyKey: LlmSecurityPolicyKey): Omit<
  LlmSecurityPolicyRegistration,
  "policyId" | "registeredAt" | "readOnly"
> {
  switch (policyKey) {
    case "public":
      return {
        policyKey,
        label: LLM_SECURITY_POLICY_LABELS.public,
        description: "Public policy: redact secrets and credentials before outbound delivery.",
        version: LLM_SECURITY_CONTRACT_VERSION,
        denyMarkers: Object.freeze(["DENY_ALWAYS"]),
        enabledRedactionRules: BASE_REDACTION_RULES,
        allowAfterRedaction: true,
        blockUnresolvedContext: false,
      };
    case "internal":
      return {
        policyKey,
        label: LLM_SECURITY_POLICY_LABELS.internal,
        description: "Internal policy: redact secrets, credentials, and internal references.",
        version: LLM_SECURITY_CONTRACT_VERSION,
        denyMarkers: Object.freeze(["DENY_ALWAYS"]),
        enabledRedactionRules: INTERNAL_REDACTION_RULES,
        allowAfterRedaction: true,
        blockUnresolvedContext: false,
      };
    case "confidential":
      return {
        policyKey,
        label: LLM_SECURITY_POLICY_LABELS.confidential,
        description: "Confidential policy: deny when unresolved context or explicit security deny markers are present.",
        version: LLM_SECURITY_CONTRACT_VERSION,
        denyMarkers: Object.freeze(["DENY_ALWAYS", "securityDeny"]),
        enabledRedactionRules: INTERNAL_REDACTION_RULES,
        allowAfterRedaction: true,
        blockUnresolvedContext: true,
      };
    case "restricted":
      return {
        policyKey,
        label: LLM_SECURITY_POLICY_LABELS.restricted,
        description: "Restricted policy: deny on sensitive deny markers regardless of redaction.",
        version: LLM_SECURITY_CONTRACT_VERSION,
        denyMarkers: Object.freeze(["DENY_ALWAYS", "restrictedBlock"]),
        enabledRedactionRules: INTERNAL_REDACTION_RULES,
        allowAfterRedaction: false,
        blockUnresolvedContext: true,
      };
    case "enterprise_custom":
      return {
        policyKey,
        label: LLM_SECURITY_POLICY_LABELS.enterprise_custom,
        description: "Enterprise custom policy: declarative overrides registered at runtime.",
        version: LLM_SECURITY_CONTRACT_VERSION,
        denyMarkers: Object.freeze(["DENY_ALWAYS"]),
        enabledRedactionRules: INTERNAL_REDACTION_RULES,
        allowAfterRedaction: true,
        blockUnresolvedContext: false,
      };
  }
}

export function buildLlmSecurityPolicyRegistration(
  input: LlmSecurityPolicyInput,
  timestamp: string
): LlmSecurityPolicyRegistration {
  const defaults = getDefaultPolicyDefinition(input.policyKey);
  return Object.freeze({
    policyId: `security-policy-${input.policyKey}`,
    policyKey: input.policyKey,
    label: input.label ?? defaults.label,
    description: input.description ?? defaults.description,
    version: LLM_SECURITY_CONTRACT_VERSION,
    denyMarkers: Object.freeze([...(input.denyMarkers ?? defaults.denyMarkers)]),
    enabledRedactionRules: Object.freeze([...(input.enabledRedactionRules ?? defaults.enabledRedactionRules)]),
    allowAfterRedaction: input.allowAfterRedaction ?? defaults.allowAfterRedaction,
    blockUnresolvedContext: input.blockUnresolvedContext ?? defaults.blockUnresolvedContext,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function getAllLlmSecurityPolicyKeys(): readonly LlmSecurityPolicyKey[] {
  return LLM_SECURITY_POLICY_KEYS;
}
