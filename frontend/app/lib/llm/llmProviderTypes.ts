/**
 * LLM-2 — Provider Adapter domain types.
 */

import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type {
  LLM_PROVIDER_AUTH_METHOD_KEYS,
  LLM_PROVIDER_CAPABILITY_KEYS,
  LLM_PROVIDER_CONTRACT_VERSION,
  LLM_PROVIDER_ERROR_CATEGORY_KEYS,
  LLM_PROVIDER_HEALTH_STATE_KEYS,
  LLM_PROVIDER_STATUS_KEYS,
} from "./llmProviderContracts.ts";

export type LlmProviderAdapterId = string;
export type LlmProviderCapabilityKey = (typeof LLM_PROVIDER_CAPABILITY_KEYS)[number];
export type LlmProviderErrorCategoryKey = (typeof LLM_PROVIDER_ERROR_CATEGORY_KEYS)[number];
export type LlmProviderHealthStateKey = (typeof LLM_PROVIDER_HEALTH_STATE_KEYS)[number];
export type LlmProviderStatusKey = (typeof LLM_PROVIDER_STATUS_KEYS)[number];
export type LlmProviderAuthMethodKey = (typeof LLM_PROVIDER_AUTH_METHOD_KEYS)[number];
export type LlmProviderRequestType = "chat" | "completion" | "embedding" | "model_discovery";
export type LlmProviderResponseType = "chat" | "completion" | "embedding" | "model_discovery" | "error";

export type LlmProviderIdentity = Readonly<{
  providerId: LlmProviderAdapterId;
  providerKey: LlmProviderKey;
  displayName: string;
  version: typeof LLM_PROVIDER_CONTRACT_VERSION;
  vendor: string;
  contractVersion: typeof LLM_PROVIDER_CONTRACT_VERSION;
  supportedCapabilities: readonly LlmProviderCapabilityKey[];
  status: LlmProviderStatusKey;
  readOnly: true;
}>;

export type LlmProviderCapabilityDeclaration = Readonly<{
  capabilityKey: LlmProviderCapabilityKey;
  supported: boolean;
  reserved: boolean;
  readOnly: true;
}>;

export type LlmProviderAuthContract = Readonly<{
  authMethod: LlmProviderAuthMethodKey;
  credentialRef: string;
  readOnly: true;
}>;

export type LlmProviderRequestContract = Readonly<{
  requestId: string;
  providerKey: LlmProviderKey;
  modelId: string;
  requestType: LlmProviderRequestType;
  promptRef: string;
  contextRef?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  toolConfigRef?: string;
  readOnly: true;
}>;

export type LlmProviderResponseContract = Readonly<{
  responseId: string;
  requestId: string;
  providerKey: LlmProviderKey;
  modelId: string;
  responseType: LlmProviderResponseType;
  payloadRef: string;
  tokenCount?: number;
  finishReason?: string;
  readOnly: true;
}>;

export type LlmProviderErrorContract = Readonly<{
  errorId: string;
  requestId?: string;
  providerKey: LlmProviderKey;
  category: LlmProviderErrorCategoryKey;
  message: string;
  retryable: boolean;
  readOnly: true;
}>;

export type LlmProviderHealthContract = Readonly<{
  healthId: string;
  providerKey: LlmProviderKey;
  state: LlmProviderHealthStateKey;
  message: string;
  checkedAt: string;
  readOnly: true;
}>;

export type LlmProviderModelDiscoveryContract = Readonly<{
  discoveryId: string;
  providerKey: LlmProviderKey;
  modelIds: readonly string[];
  discoveredAt: string;
  readOnly: true;
}>;

export type LlmProviderAdapterContract = Readonly<{
  adapterId: LlmProviderAdapterId;
  identity: LlmProviderIdentity;
  capabilities: readonly LlmProviderCapabilityDeclaration[];
  authContract: LlmProviderAuthContract;
  foundationVersion: typeof import("./llmProviderContracts.ts").LLM_PROVIDER_FOUNDATION_DEPENDENCY;
  registeredAt: string;
  readOnly: true;
}>;

export type LlmProviderAdapterRegistrationInput = Readonly<{
  providerKey: LlmProviderKey;
  displayName?: string;
  authMethod: LlmProviderAuthMethodKey;
  supportedCapabilities?: readonly LlmProviderCapabilityKey[];
  status?: LlmProviderStatusKey;
}>;

export type LlmProviderAdapterRegistry = Readonly<{
  adapters: readonly LlmProviderAdapterContract[];
  adapterCount: number;
  readOnly: true;
}>;

export type LlmProviderValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type LlmProviderValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmProviderValidationIssue[];
  readOnly: true;
}>;

export type LlmProviderAdapterResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type LlmProviderAdapterManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmProviderContracts.ts").LLM_PROVIDER_PLATFORM_ID;
  version: typeof LLM_PROVIDER_CONTRACT_VERSION;
  title: typeof import("./llmProviderContracts.ts").LLM_PROVIDER_PLATFORM_NAME;
  goal: string;
  foundationDependency: typeof import("./llmProviderContracts.ts").LLM_PROVIDER_FOUNDATION_DEPENDENCY;
  publicApis: readonly string[];
  capabilityKeys: readonly string[];
  errorCategories: readonly string[];
  healthStates: readonly string[];
  readOnly: true;
}>;

export type LlmProviderAdapterLayerState = Readonly<{
  contractVersion: typeof LLM_PROVIDER_CONTRACT_VERSION;
  foundationDependency: typeof import("./llmProviderContracts.ts").LLM_PROVIDER_FOUNDATION_DEPENDENCY;
  initialized: boolean;
  adapterCount: number;
  timestamp: string;
  readOnly: true;
}>;
