/**
 * LLM-12 — Platform identity, phase registry, and release metadata.
 */

import { LLM_EXTENSION_REGISTRY, LLM_PLATFORM_ID, LLM_PLATFORM_NAME } from "./llmPlatformContracts.ts";
import { LLM_AUDIT_CONTRACT_VERSION, LLM_AUDIT_PLATFORM_ID, LLM_AUDIT_PUBLIC_API_REGISTRY } from "./llmAuditContracts.ts";
import { LLM_CONTEXT_CONTRACT_VERSION, LLM_CONTEXT_PLATFORM_ID, LLM_CONTEXT_PUBLIC_API_REGISTRY } from "./llmContextContracts.ts";
import { LLM_COST_CONTRACT_VERSION, LLM_COST_PLATFORM_ID, LLM_COST_PUBLIC_API_REGISTRY } from "./llmCostContracts.ts";
import { LLM_PLATFORM_CONTRACT_VERSION, LLM_PUBLIC_API_REGISTRY } from "./llmPlatformContracts.ts";
import { LLM_PROMPT_CONTRACT_VERSION, LLM_PROMPT_PLATFORM_ID, LLM_PROMPT_PUBLIC_API_REGISTRY } from "./llmPromptContracts.ts";
import { LLM_PROVIDER_CONTRACT_VERSION, LLM_PROVIDER_PLATFORM_ID, LLM_PROVIDER_PUBLIC_API_REGISTRY } from "./llmProviderContracts.ts";
import { LLM_RESILIENCE_CONTRACT_VERSION, LLM_RESILIENCE_PLATFORM_ID, LLM_RESILIENCE_PUBLIC_API_REGISTRY } from "./llmResilienceContracts.ts";
import { LLM_ROUTER_CONTRACT_VERSION, LLM_ROUTER_PLATFORM_ID, LLM_ROUTER_PUBLIC_API_REGISTRY } from "./llmRouterContracts.ts";
import { LLM_RUNTIME_CONTRACT_VERSION, LLM_RUNTIME_PLATFORM_ID, LLM_RUNTIME_PUBLIC_API_REGISTRY } from "./llmRuntimeContracts.ts";
import { LLM_SECURITY_CONTRACT_VERSION, LLM_SECURITY_PLATFORM_ID, LLM_SECURITY_PUBLIC_API_REGISTRY } from "./llmSecurityContracts.ts";
import { LLM_TOKEN_CONTRACT_VERSION, LLM_TOKEN_PLATFORM_ID, LLM_TOKEN_PUBLIC_API_REGISTRY } from "./llmTokenContracts.ts";
import type { LlmPlatformExtensionRegistration, LlmPlatformPhaseRegistration, LlmPlatformRegistry } from "./llmPlatformFreezeTypes.ts";

export const LLM_PLATFORM_FREEZE_CONTRACT_VERSION = "LLM/12" as const;
export const LLM_PLATFORM_RELEASE_VERSION = "1.0.0-mvp" as const;
export const LLM_PLATFORM_FREEZE_VERSION = "LLM/12-freeze" as const;
export const LLM_PLATFORM_RELEASE_STAGE = "certified-frozen" as const;

export const LLM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY = Object.freeze([
  "runLlmPlatformCertification",
  "runLlmPlatformRegression",
  "buildLlmPlatformFreezeManifest",
  "getLlmPlatformCompatibilityMatrix",
  "getLlmPlatformRegistry",
  "runLlmPlatformFreeze",
] as const);

export const LLM_PLATFORM_FREEZE_PRINCIPLES = Object.freeze([
  "metadata_only_no_runtime_behavior",
  "consumes_llm_1_through_llm_11_only",
  "never_modifies_certified_phases",
  "regression_read_only",
  "freeze_mvp_contracts_immutably",
  "llm_13_enterprise_cache_independent",
] as const);

export const LLM_CERTIFIED_MVP_PHASE_KEYS = Object.freeze([
  "LLM/1",
  "LLM/2",
  "LLM/3",
  "LLM/4",
  "LLM/5",
  "LLM/6",
  "LLM/7",
  "LLM/8",
  "LLM/9",
  "LLM/10",
  "LLM/11",
] as const);

const PHASE_DEFINITIONS = Object.freeze([
  Object.freeze({
    phaseId: "LLM/1",
    contractVersion: LLM_PLATFORM_CONTRACT_VERSION,
    platformId: LLM_PLATFORM_ID,
    title: "Platform Foundation",
    publicApis: LLM_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmPlatformContracts.ts", "llmPlatformExports.ts"]),
    buildLayerApi: "buildLlmPlatformFoundation",
  }),
  Object.freeze({
    phaseId: "LLM/2",
    contractVersion: LLM_PROVIDER_CONTRACT_VERSION,
    platformId: LLM_PROVIDER_PLATFORM_ID,
    title: "Provider Adapter Contracts",
    publicApis: LLM_PROVIDER_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmProviderContracts.ts", "llmProviderExports.ts"]),
    buildLayerApi: "buildLlmProviderAdapterLayer",
  }),
  Object.freeze({
    phaseId: "LLM/3",
    contractVersion: LLM_RUNTIME_CONTRACT_VERSION,
    platformId: LLM_RUNTIME_PLATFORM_ID,
    title: "Runtime Contracts",
    publicApis: LLM_RUNTIME_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmRuntimeContracts.ts", "llmRuntimeExports.ts"]),
    buildLayerApi: "buildLlmRuntimeContractLayer",
  }),
  Object.freeze({
    phaseId: "LLM/4",
    contractVersion: LLM_PROMPT_CONTRACT_VERSION,
    platformId: LLM_PROMPT_PLATFORM_ID,
    title: "Prompt Builder",
    publicApis: LLM_PROMPT_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmPromptContracts.ts", "llmPromptExports.ts"]),
    buildLayerApi: "buildLlmPromptBuilderLayer",
  }),
  Object.freeze({
    phaseId: "LLM/5",
    contractVersion: LLM_CONTEXT_CONTRACT_VERSION,
    platformId: LLM_CONTEXT_PLATFORM_ID,
    title: "Context Builder",
    publicApis: LLM_CONTEXT_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmContextContracts.ts", "llmContextExports.ts"]),
    buildLayerApi: "buildLlmContextBuilderLayer",
  }),
  Object.freeze({
    phaseId: "LLM/6",
    contractVersion: LLM_TOKEN_CONTRACT_VERSION,
    platformId: LLM_TOKEN_PLATFORM_ID,
    title: "Token Usage Meter",
    publicApis: LLM_TOKEN_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmTokenContracts.ts", "llmTokenExports.ts"]),
    buildLayerApi: "buildLlmTokenMeterLayer",
  }),
  Object.freeze({
    phaseId: "LLM/7",
    contractVersion: LLM_COST_CONTRACT_VERSION,
    platformId: LLM_COST_PLATFORM_ID,
    title: "Cost Estimator",
    publicApis: LLM_COST_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmCostContracts.ts", "llmCostExports.ts"]),
    buildLayerApi: "buildLlmCostEstimatorLayer",
  }),
  Object.freeze({
    phaseId: "LLM/8",
    contractVersion: LLM_ROUTER_CONTRACT_VERSION,
    platformId: LLM_ROUTER_PLATFORM_ID,
    title: "Model Router",
    publicApis: LLM_ROUTER_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmRouterContracts.ts", "llmRouterExports.ts"]),
    buildLayerApi: "buildLlmModelRouterLayer",
  }),
  Object.freeze({
    phaseId: "LLM/9",
    contractVersion: LLM_AUDIT_CONTRACT_VERSION,
    platformId: LLM_AUDIT_PLATFORM_ID,
    title: "Audit & Observability",
    publicApis: LLM_AUDIT_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmAuditContracts.ts", "llmAuditExports.ts"]),
    buildLayerApi: "buildLlmAuditObservabilityLayer",
  }),
  Object.freeze({
    phaseId: "LLM/10",
    contractVersion: LLM_SECURITY_CONTRACT_VERSION,
    platformId: LLM_SECURITY_PLATFORM_ID,
    title: "Security & Redaction Guard",
    publicApis: LLM_SECURITY_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmSecurityContracts.ts", "llmSecurityExports.ts"]),
    buildLayerApi: "buildLlmSecurityRedactionLayer",
  }),
  Object.freeze({
    phaseId: "LLM/11",
    contractVersion: LLM_RESILIENCE_CONTRACT_VERSION,
    platformId: LLM_RESILIENCE_PLATFORM_ID,
    title: "Retry, Timeout & Fallback Coordinator",
    publicApis: LLM_RESILIENCE_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["llmResilienceContracts.ts", "llmResilienceExports.ts"]),
    buildLayerApi: "buildLlmResilienceCoordinatorLayer",
  }),
] as const);

const CERTIFIED_EXTENSION_STATUS = Object.freeze({
  provider_adapters: "certified",
  runtime: "certified",
  prompt_builder: "certified",
  context_builder: "certified",
  cache: "enterprise",
  streaming: "reserved",
  security: "certified",
  billing: "reserved",
  tool_calling: "reserved",
  model_registry: "reserved",
} as const);

export function getLlmCertifiedPhaseRegistrations(): readonly LlmPlatformPhaseRegistration[] {
  return Object.freeze(
    PHASE_DEFINITIONS.map((phase) =>
      Object.freeze({
        ...phase,
        readOnly: true as const,
      })
    )
  );
}

export function getLlmPlatformExtensionRegistry(): readonly LlmPlatformExtensionRegistration[] {
  return Object.freeze(
    LLM_EXTENSION_REGISTRY.map((entry) =>
      Object.freeze({
        extensionId: entry.extensionId,
        label: entry.label,
        phaseKey: entry.phaseKey,
        status: CERTIFIED_EXTENSION_STATUS[entry.phaseKey as keyof typeof CERTIFIED_EXTENSION_STATUS] ?? "reserved",
        readOnly: true as const,
      })
    )
  );
}

export function getLlmPlatformPublicApiRegistry(): readonly string[] {
  const apis = PHASE_DEFINITIONS.flatMap((phase) => [...phase.publicApis]);
  return Object.freeze([...new Set(apis)]);
}

export function getLlmPlatformRegistry(): LlmPlatformRegistry {
  const certifiedPhases = getLlmCertifiedPhaseRegistrations();
  return Object.freeze({
    platformId: LLM_PLATFORM_ID,
    platformName: LLM_PLATFORM_NAME,
    contractVersion: LLM_PLATFORM_FREEZE_CONTRACT_VERSION,
    releaseVersion: LLM_PLATFORM_RELEASE_VERSION,
    freezeVersion: LLM_PLATFORM_FREEZE_VERSION,
    releaseStage: LLM_PLATFORM_RELEASE_STAGE,
    certifiedPhases,
    phaseCount: certifiedPhases.length,
    publicApis: getLlmPlatformPublicApiRegistry(),
    extensionPoints: getLlmPlatformExtensionRegistry(),
    readOnly: true as const,
  });
}

export function getLlmCertifiedPhaseById(phaseId: string): LlmPlatformPhaseRegistration | null {
  return getLlmCertifiedPhaseRegistrations().find((phase) => phase.phaseId === phaseId) ?? null;
}
