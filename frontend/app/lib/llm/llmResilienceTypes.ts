/**
 * LLM-11 — Resilience Coordinator domain types.
 */

import type { LlmRoutePolicyKey } from "./llmRouterTypes.ts";
import type {
  LLM_RESILIENCE_CONTRACT_VERSION,
  LLM_RESILIENCE_FAILURE_CATEGORY_KEYS,
  LLM_RESILIENCE_FALLBACK_POLICY_KEYS,
  LLM_RESILIENCE_RETRY_POLICY_KEYS,
  LLM_RESILIENCE_TIMEOUT_POLICY_KEYS,
} from "./llmResilienceContracts.ts";

export type LlmResilienceRetryPolicyKey = (typeof LLM_RESILIENCE_RETRY_POLICY_KEYS)[number];
export type LlmResilienceTimeoutPolicyKey = (typeof LLM_RESILIENCE_TIMEOUT_POLICY_KEYS)[number];
export type LlmResilienceFallbackPolicyKey = (typeof LLM_RESILIENCE_FALLBACK_POLICY_KEYS)[number];
export type LlmResilienceFailureCategoryKey = (typeof LLM_RESILIENCE_FAILURE_CATEGORY_KEYS)[number];

export type LlmResilienceRetryPolicyRegistration = Readonly<{
  policyId: string;
  policyKey: LlmResilienceRetryPolicyKey;
  label: string;
  description: string;
  version: typeof LLM_RESILIENCE_CONTRACT_VERSION;
  maxAttempts: number;
  registeredAt: string;
  readOnly: true;
}>;

export type LlmResilienceTimeoutPolicyRegistration = Readonly<{
  policyId: string;
  policyKey: LlmResilienceTimeoutPolicyKey;
  label: string;
  description: string;
  version: typeof LLM_RESILIENCE_CONTRACT_VERSION;
  timeoutMs: number;
  registeredAt: string;
  readOnly: true;
}>;

export type LlmResilienceFallbackPolicyRegistration = Readonly<{
  policyId: string;
  policyKey: LlmResilienceFallbackPolicyKey;
  label: string;
  description: string;
  version: typeof LLM_RESILIENCE_CONTRACT_VERSION;
  routePolicyReference: LlmRoutePolicyKey | null;
  registeredAt: string;
  readOnly: true;
}>;

export type LlmResilienceEligibility = Readonly<{
  retryEligible: boolean;
  timeoutEligible: boolean;
  fallbackEligible: boolean;
  readOnly: true;
}>;

export type LlmResilienceDecision = Readonly<{
  decisionId: string;
  requestId: string;
  retryPolicyKey: LlmResilienceRetryPolicyKey;
  timeoutPolicyKey: LlmResilienceTimeoutPolicyKey;
  fallbackPolicyKey: LlmResilienceFallbackPolicyKey;
  failureCategory: LlmResilienceFailureCategoryKey;
  eligibility: LlmResilienceEligibility;
  compatibility: readonly string[];
  timestamp: string;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type LlmResilienceDecisionInput = Readonly<{
  requestId: string;
  failureCategory: LlmResilienceFailureCategoryKey;
  retryPolicyKey?: LlmResilienceRetryPolicyKey;
  timeoutPolicyKey?: LlmResilienceTimeoutPolicyKey;
  fallbackPolicyKey?: LlmResilienceFallbackPolicyKey;
  routePolicyReference?: LlmRoutePolicyKey;
  metadata?: Readonly<Record<string, string>>;
}>;

export type LlmResilienceDecisionResult = Readonly<{
  success: boolean;
  reason: string;
  decision: LlmResilienceDecision | null;
  readOnly: true;
}>;

export type LlmResilienceRegistry = Readonly<{
  retryPolicies: readonly LlmResilienceRetryPolicyRegistration[];
  retryPolicyCount: number;
  timeoutPolicies: readonly LlmResilienceTimeoutPolicyRegistration[];
  timeoutPolicyCount: number;
  fallbackPolicies: readonly LlmResilienceFallbackPolicyRegistration[];
  fallbackPolicyCount: number;
  readOnly: true;
}>;

export type LlmResilienceManifest = Readonly<{
  manifestId: string;
  resilienceVersion: typeof LLM_RESILIENCE_CONTRACT_VERSION;
  retryPolicyCount: number;
  timeoutPolicyCount: number;
  fallbackPolicyCount: number;
  failureCategoryCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type LlmResilienceValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type LlmResilienceValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmResilienceValidationIssue[];
  readOnly: true;
}>;

export type LlmResilienceLayerState = Readonly<{
  contractVersion: typeof LLM_RESILIENCE_CONTRACT_VERSION;
  securityDependency: typeof import("./llmResilienceContracts.ts").LLM_RESILIENCE_SECURITY_DEPENDENCY;
  routerDependency: typeof import("./llmResilienceContracts.ts").LLM_RESILIENCE_ROUTER_DEPENDENCY;
  initialized: boolean;
  registry: LlmResilienceRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type LlmResiliencePlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmResilienceContracts.ts").LLM_RESILIENCE_PLATFORM_ID;
  version: typeof LLM_RESILIENCE_CONTRACT_VERSION;
  title: typeof import("./llmResilienceContracts.ts").LLM_RESILIENCE_PLATFORM_NAME;
  goal: string;
  publicApis: readonly string[];
  retryPolicyKeys: readonly string[];
  timeoutPolicyKeys: readonly string[];
  fallbackPolicyKeys: readonly string[];
  failureCategoryKeys: readonly string[];
  readOnly: true;
}>;

export type LlmResilienceRetryPolicyInput = Readonly<{
  policyKey: LlmResilienceRetryPolicyKey;
  label?: string;
  description?: string;
  maxAttempts?: number;
}>;

export type LlmResilienceTimeoutPolicyInput = Readonly<{
  policyKey: LlmResilienceTimeoutPolicyKey;
  label?: string;
  description?: string;
  timeoutMs?: number;
}>;

export type LlmResilienceFallbackPolicyInput = Readonly<{
  policyKey: LlmResilienceFallbackPolicyKey;
  label?: string;
  description?: string;
  routePolicyReference?: LlmRoutePolicyKey | null;
}>;
