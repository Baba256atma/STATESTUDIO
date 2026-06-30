/**
 * LLM-1 — LLM Platform domain types.
 */

import type {
  LLM_EXTENSION_POINT_KEYS,
  LLM_PLATFORM_CONTRACT_VERSION,
  LLM_PROVIDER_KEYS,
  LLM_RUNTIME_CONTRACT_KEYS,
} from "./llmPlatformContracts.ts";

export type LlmIdentifier = string;
export type LlmProviderKey = (typeof LLM_PROVIDER_KEYS)[number];
export type LlmRuntimeContractKey = (typeof LLM_RUNTIME_CONTRACT_KEYS)[number];
export type LlmExtensionPointKey = (typeof LLM_EXTENSION_POINT_KEYS)[number];
export type LlmVersion = typeof LLM_PLATFORM_CONTRACT_VERSION | string;

export type LlmPlatformMetadata = Readonly<{
  metadataId: string;
  metadataVersion: typeof LLM_PLATFORM_CONTRACT_VERSION;
  owner: string;
  createdAt: string;
  readOnly: true;
}>;

export type LlmPlatformIdentity = Readonly<{
  layerId: "LLM";
  appId: "APP";
  title: typeof import("./llmPlatformContracts.ts").LLM_PLATFORM_NAME;
  platformId: typeof import("./llmPlatformContracts.ts").LLM_PLATFORM_ID;
  version: typeof LLM_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof import("./llmPlatformContracts.ts").LLM_PLATFORM_ARCHITECTURE_VERSION;
  contractVersion: typeof LLM_PLATFORM_CONTRACT_VERSION;
  compatibilityVersion: typeof import("./llmPlatformContracts.ts").LLM_PLATFORM_COMPATIBILITY_VERSION;
  mvpStatus: "active";
  releaseStage: "mvp-foundation";
  compatibilityLevel: "foundation";
  readOnly: true;
}>;

export type LlmPlatformBoundaries = Readonly<{
  owns: readonly string[];
  doesNotOwn: readonly string[];
  readOnly: true;
}>;

export type LlmProviderContract = Readonly<{
  providerId: LlmIdentifier;
  providerKey: LlmProviderKey;
  label: string;
  description: string;
  version: typeof LLM_PLATFORM_CONTRACT_VERSION;
  interchangeable: true;
  metadata: LlmPlatformMetadata;
  readOnly: true;
}>;

export type LlmRuntimeContract = Readonly<{
  contractId: LlmIdentifier;
  contractKey: LlmRuntimeContractKey;
  label: string;
  description: string;
  version: typeof LLM_PLATFORM_CONTRACT_VERSION;
  interfaceOnly: true;
  metadata: LlmPlatformMetadata;
  readOnly: true;
}>;

export type LlmExtensionPoint = Readonly<{
  extensionPointId: LlmIdentifier;
  extensionPointKey: LlmExtensionPointKey;
  label: string;
  description: string;
  version: typeof LLM_PLATFORM_CONTRACT_VERSION;
  status: "reserved" | "registered";
  metadata: LlmPlatformMetadata;
  readOnly: true;
}>;

export type LlmPlatformRegistrySnapshot = Readonly<{
  providerCount: number;
  runtimeContractCount: number;
  extensionPointCount: number;
  readOnly: true;
}>;

export type LlmPlatformRegistry = Readonly<{
  providers: readonly LlmProviderContract[];
  runtimeContracts: readonly LlmRuntimeContract[];
  extensionPoints: readonly LlmExtensionPoint[];
  snapshot: LlmPlatformRegistrySnapshot;
  readOnly: true;
}>;

export type LlmPlatformVersionMetadata = Readonly<{
  platformVersion: typeof LLM_PLATFORM_CONTRACT_VERSION;
  contractVersion: typeof LLM_PLATFORM_CONTRACT_VERSION;
  compatibilityVersion: typeof import("./llmPlatformContracts.ts").LLM_PLATFORM_COMPATIBILITY_VERSION;
  architectureVersion: typeof import("./llmPlatformContracts.ts").LLM_PLATFORM_ARCHITECTURE_VERSION;
  migrationStrategyId: string;
  additiveOnly: true;
  readOnly: true;
}>;

export type LlmPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmPlatformContracts.ts").LLM_PLATFORM_ID;
  version: typeof LLM_PLATFORM_CONTRACT_VERSION;
  title: string;
  goal: string;
  lifecycle: "build";
  principles: readonly string[];
  publicApis: readonly string[];
  extensionPoints: readonly string[];
  providerKeys: readonly string[];
  readOnly: true;
}>;

export type LlmPlatformValidationIssue = Readonly<{
  code: string;
  message: string;
  readOnly: true;
}>;

export type LlmPlatformValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmPlatformValidationIssue[];
  readOnly: true;
}>;

export type LlmPlatformState = Readonly<{
  platformId: typeof import("./llmPlatformContracts.ts").LLM_PLATFORM_ID;
  foundationVersion: typeof LLM_PLATFORM_CONTRACT_VERSION;
  contractVersion: typeof LLM_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  providerCount: number;
  runtimeContractCount: number;
  extensionPointCount: number;
  supportedProviders: readonly string[];
  supportedExtensionPoints: readonly string[];
  timestamp: string;
  readOnly: true;
}>;

export type LlmPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

/** Future runtime execution contract — interface only, no implementation. */
export type LlmRuntimeExecutionContract = Readonly<{
  contractKey: "runtime_execution";
  execute: never;
  readOnly: true;
}>;

/** Future runtime request shape — contract only. */
export type LlmRuntimeRequestContract = Readonly<{
  requestId: LlmIdentifier;
  providerKey: LlmProviderKey;
  modelId: string;
  promptTransportRef: string;
  readOnly: true;
}>;

/** Future runtime response shape — contract only. */
export type LlmRuntimeResponseContract = Readonly<{
  responseId: LlmIdentifier;
  requestId: LlmIdentifier;
  providerKey: LlmProviderKey;
  payloadRef: string;
  readOnly: true;
}>;

/** Provider adapter contract — interchangeable, no provider-specific assumptions. */
export type LlmProviderAdapterContract = Readonly<{
  adapterId: LlmIdentifier;
  providerKey: LlmProviderKey;
  version: typeof LLM_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;
