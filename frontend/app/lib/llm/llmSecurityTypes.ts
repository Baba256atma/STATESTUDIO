/**
 * LLM-10 — Security & Redaction Guard domain types.
 */

import type { LlmContextPackage } from "./llmContextTypes.ts";
import type { LlmPromptPackage } from "./llmPromptTypes.ts";
import type {
  LLM_SECURITY_CONTRACT_VERSION,
  LLM_SECURITY_DECISION_KEYS,
  LLM_SECURITY_POLICY_KEYS,
  LLM_SECURITY_REDACTION_RULE_KEYS,
} from "./llmSecurityContracts.ts";

export type LlmSecurityPolicyKey = (typeof LLM_SECURITY_POLICY_KEYS)[number];
export type LlmSecurityRedactionRuleKey = (typeof LLM_SECURITY_REDACTION_RULE_KEYS)[number];
export type LlmSecurityDecisionKey = (typeof LLM_SECURITY_DECISION_KEYS)[number];

export type LlmSecurityPolicyRegistration = Readonly<{
  policyId: string;
  policyKey: LlmSecurityPolicyKey;
  label: string;
  description: string;
  version: typeof LLM_SECURITY_CONTRACT_VERSION;
  denyMarkers: readonly string[];
  enabledRedactionRules: readonly LlmSecurityRedactionRuleKey[];
  allowAfterRedaction: boolean;
  blockUnresolvedContext: boolean;
  registeredAt: string;
  readOnly: true;
}>;

export type LlmSecurityRedactionSummary = Readonly<{
  totalRedactions: number;
  redactionsByRule: Readonly<Record<string, number>>;
  affectedSectionIds: readonly string[];
  readOnly: true;
}>;

export type LlmSecurityInspectionInput = Readonly<{
  promptPackage: LlmPromptPackage;
  contextPackage?: LlmContextPackage | null;
  runtimeMetadata?: Readonly<Record<string, string>>;
  userMetadata?: Readonly<Record<string, string>>;
  workspaceMetadata?: Readonly<Record<string, string>>;
  providerMetadata?: Readonly<Record<string, string>>;
  policyKey?: LlmSecurityPolicyKey;
  additionalMetadata?: Readonly<Record<string, string>>;
}>;

export type LlmSecurityDecision = Readonly<{
  decisionId: string;
  decision: LlmSecurityDecisionKey;
  appliedPolicies: readonly LlmSecurityPolicyKey[];
  redactionSummary: LlmSecurityRedactionSummary;
  warnings: readonly string[];
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  redactedPromptPackage: LlmPromptPackage | null;
  redactedContextPackage: LlmContextPackage | null;
  timestamp: string;
  readOnly: true;
}>;

export type LlmSecurityInspectionResult = Readonly<{
  success: boolean;
  reason: string;
  decision: LlmSecurityDecision | null;
  readOnly: true;
}>;

export type LlmSecurityRedactionResult = Readonly<{
  success: boolean;
  reason: string;
  package: LlmPromptPackage | null;
  summary: LlmSecurityRedactionSummary | null;
  readOnly: true;
}>;

export type LlmSecurityRegistry = Readonly<{
  policies: readonly LlmSecurityPolicyRegistration[];
  policyCount: number;
  readOnly: true;
}>;

export type LlmSecurityManifest = Readonly<{
  manifestId: string;
  securityVersion: typeof LLM_SECURITY_CONTRACT_VERSION;
  policyCount: number;
  redactionRuleCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type LlmSecurityValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type LlmSecurityValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmSecurityValidationIssue[];
  readOnly: true;
}>;

export type LlmSecurityLayerState = Readonly<{
  contractVersion: typeof LLM_SECURITY_CONTRACT_VERSION;
  contextDependency: typeof import("./llmSecurityContracts.ts").LLM_SECURITY_CONTEXT_DEPENDENCY;
  promptDependency: typeof import("./llmSecurityContracts.ts").LLM_SECURITY_PROMPT_DEPENDENCY;
  initialized: boolean;
  registry: LlmSecurityRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type LlmSecurityPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmSecurityContracts.ts").LLM_SECURITY_PLATFORM_ID;
  version: typeof LLM_SECURITY_CONTRACT_VERSION;
  title: typeof import("./llmSecurityContracts.ts").LLM_SECURITY_PLATFORM_NAME;
  goal: string;
  publicApis: readonly string[];
  policyKeys: readonly string[];
  redactionRuleKeys: readonly string[];
  readOnly: true;
}>;

export type LlmSecurityPolicyInput = Readonly<{
  policyKey: LlmSecurityPolicyKey;
  label?: string;
  description?: string;
  denyMarkers?: readonly string[];
  enabledRedactionRules?: readonly LlmSecurityRedactionRuleKey[];
  allowAfterRedaction?: boolean;
  blockUnresolvedContext?: boolean;
}>;
