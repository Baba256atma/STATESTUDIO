/**
 * LLM-3 — Runtime domain types.
 */

import type { LlmProviderErrorCategoryKey } from "./llmProviderTypes.ts";
import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type {
  LLM_RUNTIME_CONTRACT_VERSION,
  LLM_RUNTIME_LIFECYCLE_KEYS,
  LLM_RUNTIME_MODE_KEYS,
  LLM_RUNTIME_STATUS_KEYS,
  LLM_RUNTIME_VALIDATION_RULE_KEYS,
} from "./llmRuntimeContracts.ts";

export type LlmRuntimeStatusKey = (typeof LLM_RUNTIME_STATUS_KEYS)[number];
export type LlmRuntimeModeKey = (typeof LLM_RUNTIME_MODE_KEYS)[number];
export type LlmRuntimeLifecycleKey = (typeof LLM_RUNTIME_LIFECYCLE_KEYS)[number];
export type LlmRuntimeValidationRuleKey = (typeof LLM_RUNTIME_VALIDATION_RULE_KEYS)[number];

export type LlmRuntimeRequestEnvelope = Readonly<{
  requestId: string;
  traceId: string;
  correlationId: string;
  userMessage: string;
  systemInstructionRef: string;
  providerKey: LlmProviderKey;
  modelKey: string;
  runtimeMode: LlmRuntimeModeKey;
  temperature?: number;
  maxTokens?: number;
  workspaceId: string;
  organizationId: string;
  userId: string;
  metadata: Readonly<Record<string, string>>;
  dryRun: boolean;
  readOnly: true;
}>;

export type LlmRuntimeTokenUsagePlaceholder = Readonly<{
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  readOnly: true;
}>;

export type LlmRuntimeCostPlaceholder = Readonly<{
  estimatedCost: number | null;
  currency: string;
  readOnly: true;
}>;

export type LlmRuntimeStructuredOutputPlaceholder = Readonly<{
  schemaRef: string | null;
  payloadRef: string | null;
  readOnly: true;
}>;

export type LlmRuntimeErrorPlaceholder = Readonly<{
  errorId: string | null;
  category: LlmProviderErrorCategoryKey | null;
  message: string | null;
  readOnly: true;
}>;

export type LlmRuntimeResponseEnvelope = Readonly<{
  responseId: string;
  requestId: string;
  providerKey: LlmProviderKey;
  modelKey: string;
  status: LlmRuntimeStatusKey;
  outputText: string;
  structuredOutput: LlmRuntimeStructuredOutputPlaceholder;
  tokenUsage: LlmRuntimeTokenUsagePlaceholder;
  cost: LlmRuntimeCostPlaceholder;
  latencyMs: number | null;
  error: LlmRuntimeErrorPlaceholder;
  metadata: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type LlmRuntimeExecutionMetadata = Readonly<{
  executionId: string;
  requestId: string;
  traceId: string;
  correlationId: string;
  providerKey: LlmProviderKey;
  modelKey: string;
  runtimeMode: LlmRuntimeModeKey;
  lifecycle: LlmRuntimeLifecycleKey;
  dryRun: boolean;
  startedAt: string;
  completedAt: string | null;
  readOnly: true;
}>;

export type LlmRuntimeValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  ruleKey?: LlmRuntimeValidationRuleKey;
  readOnly: true;
}>;

export type LlmRuntimeValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmRuntimeValidationIssue[];
  readOnly: true;
}>;

export type LlmRuntimeExecutionResult = Readonly<{
  success: boolean;
  reason: string;
  request: LlmRuntimeRequestEnvelope | null;
  response: LlmRuntimeResponseEnvelope | null;
  metadata: LlmRuntimeExecutionMetadata | null;
  readOnly: true;
}>;

export type LlmRuntimeAdapterExecutionContract = Readonly<{
  contractKey: "adapter_execution";
  executeNormalizedRequest: never;
  validateProviderReadiness: never;
  returnNormalizedResponse: never;
  returnNormalizedError: never;
  readOnly: true;
}>;

export type LlmRuntimeContractRegistration = Readonly<{
  contractId: string;
  contractKey: string;
  version: typeof LLM_RUNTIME_CONTRACT_VERSION;
  label: string;
  description: string;
  registeredAt: string;
  readOnly: true;
}>;

export type LlmRuntimeModeRegistration = Readonly<{
  modeId: string;
  modeKey: LlmRuntimeModeKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type LlmRuntimeValidationRuleRegistration = Readonly<{
  ruleId: string;
  ruleKey: LlmRuntimeValidationRuleKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type LlmRuntimeRegistry = Readonly<{
  contracts: readonly LlmRuntimeContractRegistration[];
  modes: readonly LlmRuntimeModeRegistration[];
  validationRules: readonly LlmRuntimeValidationRuleRegistration[];
  contractCount: number;
  modeCount: number;
  validationRuleCount: number;
  readOnly: true;
}>;

export type LlmRuntimeManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmRuntimeContracts.ts").LLM_RUNTIME_PLATFORM_ID;
  version: typeof LLM_RUNTIME_CONTRACT_VERSION;
  title: typeof import("./llmRuntimeContracts.ts").LLM_RUNTIME_PLATFORM_NAME;
  goal: string;
  foundationDependency: typeof import("./llmRuntimeContracts.ts").LLM_RUNTIME_FOUNDATION_DEPENDENCY;
  providerDependency: typeof import("./llmRuntimeContracts.ts").LLM_RUNTIME_PROVIDER_DEPENDENCY;
  publicApis: readonly string[];
  statusKeys: readonly string[];
  modeKeys: readonly string[];
  readOnly: true;
}>;

export type LlmRuntimeLayerState = Readonly<{
  contractVersion: typeof LLM_RUNTIME_CONTRACT_VERSION;
  foundationDependency: typeof import("./llmRuntimeContracts.ts").LLM_RUNTIME_FOUNDATION_DEPENDENCY;
  providerDependency: typeof import("./llmRuntimeContracts.ts").LLM_RUNTIME_PROVIDER_DEPENDENCY;
  initialized: boolean;
  registry: LlmRuntimeRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type LlmRuntimeRequestInput = Readonly<{
  requestId: string;
  traceId: string;
  correlationId: string;
  userMessage: string;
  systemInstructionRef: string;
  providerKey: LlmProviderKey;
  modelKey: string;
  runtimeMode?: LlmRuntimeModeKey;
  temperature?: number;
  maxTokens?: number;
  workspaceId: string;
  organizationId: string;
  userId: string;
  metadata?: Readonly<Record<string, string>>;
  dryRun?: boolean;
}>;
