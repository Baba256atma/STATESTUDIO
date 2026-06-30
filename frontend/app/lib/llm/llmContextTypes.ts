/**
 * LLM-5 — Context Builder domain types.
 */

import type { LlmRuntimeRequestEnvelope } from "./llmRuntimeTypes.ts";
import type {
  LLM_CONTEXT_CONTRACT_VERSION,
  LLM_CONTEXT_RESOLUTION_STATUS_KEYS,
  LLM_CONTEXT_SOURCE_KEYS,
} from "./llmContextContracts.ts";

export type LlmContextSourceKey = (typeof LLM_CONTEXT_SOURCE_KEYS)[number];
export type LlmContextResolutionStatusKey = (typeof LLM_CONTEXT_RESOLUTION_STATUS_KEYS)[number];

export type LlmContextReference = Readonly<{
  referenceId: string;
  sourceKey: LlmContextSourceKey;
  refId: string;
  label: string;
  approved: boolean;
  readOnly: true;
}>;

export type LlmContextSection = Readonly<{
  sectionId: string;
  sourceKey: LlmContextSourceKey;
  order: number;
  contentRef: string;
  referenceId: string;
  resolutionStatus: LlmContextResolutionStatusKey;
  readOnly: true;
}>;

export type LlmContextSourceRegistration = Readonly<{
  sourceId: string;
  sourceKey: LlmContextSourceKey;
  label: string;
  description: string;
  version: typeof LLM_CONTEXT_CONTRACT_VERSION;
  placeholder: boolean;
  registeredAt: string;
  readOnly: true;
}>;

export type LlmContextPackage = Readonly<{
  contextId: string;
  version: typeof LLM_CONTEXT_CONTRACT_VERSION;
  sources: readonly LlmContextSourceKey[];
  sections: readonly LlmContextSection[];
  unresolvedReferences: readonly LlmContextReference[];
  metadata: Readonly<Record<string, string>>;
  compatibility: readonly string[];
  createdAt: string;
  readOnly: true;
}>;

export type LlmContextManifest = Readonly<{
  manifestId: string;
  contextId: string;
  version: typeof LLM_CONTEXT_CONTRACT_VERSION;
  sourceCount: number;
  sectionCount: number;
  unresolvedCount: number;
  compatibility: readonly string[];
  validationResult: "valid" | "invalid";
  readOnly: true;
}>;

export type LlmContextRegistry = Readonly<{
  sources: readonly LlmContextSourceRegistration[];
  sourceCount: number;
  readOnly: true;
}>;

export type LlmContextValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type LlmContextValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmContextValidationIssue[];
  readOnly: true;
}>;

export type LlmContextBuildInput = Readonly<{
  contextId: string;
  references: readonly LlmContextReference[];
  runtimeRequest?: LlmRuntimeRequestEnvelope;
  additionalMetadata?: Readonly<Record<string, string>>;
}>;

export type LlmContextBuildResult = Readonly<{
  success: boolean;
  reason: string;
  package: LlmContextPackage | null;
  manifest: LlmContextManifest | null;
  readOnly: true;
}>;

export type LlmContextResolutionResult = Readonly<{
  reference: LlmContextReference;
  section: LlmContextSection | null;
  resolved: boolean;
  reason: string;
  readOnly: true;
}>;

export type LlmContextBuilderLayerState = Readonly<{
  contractVersion: typeof LLM_CONTEXT_CONTRACT_VERSION;
  foundationDependency: typeof import("./llmContextContracts.ts").LLM_CONTEXT_FOUNDATION_DEPENDENCY;
  promptDependency: typeof import("./llmContextContracts.ts").LLM_CONTEXT_PROMPT_DEPENDENCY;
  initialized: boolean;
  registry: LlmContextRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type LlmContextPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmContextContracts.ts").LLM_CONTEXT_PLATFORM_ID;
  version: typeof LLM_CONTEXT_CONTRACT_VERSION;
  title: typeof import("./llmContextContracts.ts").LLM_CONTEXT_PLATFORM_NAME;
  goal: string;
  publicApis: readonly string[];
  sourceKeys: readonly string[];
  readOnly: true;
}>;
