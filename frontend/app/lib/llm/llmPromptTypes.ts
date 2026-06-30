/**
 * LLM-4 — Prompt Builder domain types.
 */

import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type { LlmRuntimeRequestEnvelope } from "./llmRuntimeTypes.ts";
import type {
  LLM_PROMPT_CONTRACT_VERSION,
  LLM_PROMPT_SECTION_KEYS,
  LLM_PROMPT_TEMPLATE_KEYS,
  LLM_PROMPT_TYPE_KEYS,
} from "./llmPromptContracts.ts";

export type LlmPromptSectionKey = (typeof LLM_PROMPT_SECTION_KEYS)[number];
export type LlmPromptTemplateKey = (typeof LLM_PROMPT_TEMPLATE_KEYS)[number];
export type LlmPromptTypeKey = (typeof LLM_PROMPT_TYPE_KEYS)[number];

export type LlmPromptSection = Readonly<{
  sectionId: string;
  sectionKey: LlmPromptSectionKey;
  order: number;
  contentRef: string;
  required: boolean;
  readOnly: true;
}>;

export type LlmPromptPackage = Readonly<{
  promptId: string;
  promptVersion: typeof LLM_PROMPT_CONTRACT_VERSION;
  runtimeVersion: typeof import("./llmPromptContracts.ts").LLM_PROMPT_RUNTIME_DEPENDENCY;
  providerCompatibility: readonly LlmProviderKey[];
  promptType: LlmPromptTypeKey;
  templateId: LlmPromptTemplateKey;
  sections: readonly LlmPromptSection[];
  metadata: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type LlmPromptTemplate = Readonly<{
  templateId: LlmPromptTemplateKey;
  label: string;
  promptType: LlmPromptTypeKey;
  sectionKeys: readonly LlmPromptSectionKey[];
  version: typeof LLM_PROMPT_CONTRACT_VERSION;
  description: string;
  registeredAt: string;
  readOnly: true;
}>;

export type LlmPromptManifest = Readonly<{
  manifestId: string;
  promptId: string;
  templateId: LlmPromptTemplateKey;
  version: typeof LLM_PROMPT_CONTRACT_VERSION;
  sectionCount: number;
  compatibility: readonly string[];
  validationResult: "valid" | "invalid";
  readOnly: true;
}>;

export type LlmPromptRegistry = Readonly<{
  templates: readonly LlmPromptTemplate[];
  templateCount: number;
  readOnly: true;
}>;

export type LlmPromptValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type LlmPromptValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmPromptValidationIssue[];
  readOnly: true;
}>;

export type LlmPromptBuildInput = Readonly<{
  runtimeRequest: LlmRuntimeRequestEnvelope;
  templateId?: LlmPromptTemplateKey;
  developerContentRef?: string;
  contextContentRef?: string;
  constraintsContentRef?: string;
  outputFormatContentRef?: string;
  safetyContentRef?: string;
  additionalMetadata?: Readonly<Record<string, string>>;
}>;

export type LlmPromptBuildResult = Readonly<{
  success: boolean;
  reason: string;
  package: LlmPromptPackage | null;
  manifest: LlmPromptManifest | null;
  readOnly: true;
}>;

export type LlmPromptBuilderLayerState = Readonly<{
  contractVersion: typeof LLM_PROMPT_CONTRACT_VERSION;
  foundationDependency: typeof import("./llmPromptContracts.ts").LLM_PROMPT_FOUNDATION_DEPENDENCY;
  runtimeDependency: typeof import("./llmPromptContracts.ts").LLM_PROMPT_RUNTIME_DEPENDENCY;
  initialized: boolean;
  registry: LlmPromptRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type LlmPromptPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmPromptContracts.ts").LLM_PROMPT_PLATFORM_ID;
  version: typeof LLM_PROMPT_CONTRACT_VERSION;
  title: typeof import("./llmPromptContracts.ts").LLM_PROMPT_PLATFORM_NAME;
  goal: string;
  publicApis: readonly string[];
  templateKeys: readonly string[];
  sectionKeys: readonly string[];
  readOnly: true;
}>;
