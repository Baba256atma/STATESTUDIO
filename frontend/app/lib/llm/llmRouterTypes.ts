/**
 * LLM-8 — Model Router domain types.
 */

import type { LlmProviderCapabilityKey } from "./llmProviderTypes.ts";
import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type { LlmRuntimeRequestEnvelope } from "./llmRuntimeTypes.ts";
import type {
  LLM_ROUTER_CONTRACT_VERSION,
  LLM_ROUTER_POLICY_KEYS,
} from "./llmRouterContracts.ts";

export type LlmRoutePolicyKey = (typeof LLM_ROUTER_POLICY_KEYS)[number];

export type LlmRouteTarget = Readonly<{
  providerKey: LlmProviderKey;
  modelKey: string;
  readOnly: true;
}>;

export type LlmRoutePolicyRegistration = Readonly<{
  policyId: string;
  policyKey: LlmRoutePolicyKey;
  label: string;
  description: string;
  version: typeof LLM_ROUTER_CONTRACT_VERSION;
  placeholder: boolean;
  registeredAt: string;
  readOnly: true;
}>;

export type LlmRouteSelectionInput = Readonly<{
  runtimeRequest: LlmRuntimeRequestEnvelope;
  policyKey?: LlmRoutePolicyKey;
  requiredCapabilities?: readonly LlmProviderCapabilityKey[];
  enterpriseOverride?: LlmRouteTarget;
  metadata?: Readonly<Record<string, string>>;
}>;

export type LlmRouteDecision = Readonly<{
  routeDecisionId: string;
  requestId: string;
  providerKey: LlmProviderKey;
  modelKey: string;
  policyKey: LlmRoutePolicyKey;
  reason: string;
  confidence: number;
  fallbackProviderKey: LlmProviderKey;
  fallbackModelKey: string;
  requiredCapabilities: readonly LlmProviderCapabilityKey[];
  compatibility: readonly string[];
  metadata: Readonly<Record<string, string>>;
  timestamp: string;
  readOnly: true;
}>;

export type LlmRouteSelectionResult = Readonly<{
  success: boolean;
  reason: string;
  decision: LlmRouteDecision | null;
  readOnly: true;
}>;

export type LlmRouterRegistry = Readonly<{
  policies: readonly LlmRoutePolicyRegistration[];
  policyCount: number;
  knownRoutes: readonly LlmRouteTarget[];
  readOnly: true;
}>;

export type LlmRouteManifest = Readonly<{
  manifestId: string;
  routerVersion: typeof LLM_ROUTER_CONTRACT_VERSION;
  policyCount: number;
  knownRouteCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type LlmRouteValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type LlmRouteValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmRouteValidationIssue[];
  readOnly: true;
}>;

export type LlmRouterLayerState = Readonly<{
  contractVersion: typeof LLM_ROUTER_CONTRACT_VERSION;
  costDependency: typeof import("./llmRouterContracts.ts").LLM_ROUTER_COST_DEPENDENCY;
  initialized: boolean;
  registry: LlmRouterRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type LlmRouterPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmRouterContracts.ts").LLM_ROUTER_PLATFORM_ID;
  version: typeof LLM_ROUTER_CONTRACT_VERSION;
  title: typeof import("./llmRouterContracts.ts").LLM_ROUTER_PLATFORM_NAME;
  goal: string;
  publicApis: readonly string[];
  policyKeys: readonly string[];
  readOnly: true;
}>;
