/**
 * ASS-7 — Executive Clarification Architecture domain types.
 */

import type {
  ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS,
  ASS_CLARIFICATION_CATEGORY_KEYS,
  ASS_CLARIFICATION_PRIORITY_METADATA_KEYS,
  ASS_CLARIFICATION_REGISTRY_KEYS,
  ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS,
  ASS_CLARIFICATION_VERSION,
  ASS_MISSING_CONTEXT_METADATA_KEYS,
  ASS_QUESTION_TYPE_METADATA_KEYS,
} from "./executiveAssistantClarificationContracts.ts";

export type ExecutiveAssistantClarificationCategoryKey = (typeof ASS_CLARIFICATION_CATEGORY_KEYS)[number];
export type ExecutiveAssistantClarificationTriggerPlaceholderKey =
  (typeof ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS)[number];
export type ExecutiveAssistantQuestionTypeMetadataKey = (typeof ASS_QUESTION_TYPE_METADATA_KEYS)[number];
export type ExecutiveAssistantAmbiguityResolutionMetadataKey = (typeof ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS)[number];
export type ExecutiveAssistantMissingContextMetadataKey = (typeof ASS_MISSING_CONTEXT_METADATA_KEYS)[number];
export type ExecutiveAssistantClarificationPriorityMetadataKey =
  (typeof ASS_CLARIFICATION_PRIORITY_METADATA_KEYS)[number];
export type ExecutiveAssistantClarificationIntentBindingKey =
  (typeof import("./executiveAssistantClarificationContracts.ts").ASS_CLARIFICATION_INTENT_BINDING_KEYS)[number];
export type ExecutiveAssistantClarificationResponseBindingKey =
  (typeof import("./executiveAssistantClarificationContracts.ts").ASS_CLARIFICATION_RESPONSE_BINDING_KEYS)[number];
export type ExecutiveAssistantClarificationRegistryKey = (typeof ASS_CLARIFICATION_REGISTRY_KEYS)[number];

export type ExecutiveAssistantClarificationIdentityRecord = Readonly<{
  clarificationId: string;
  clarificationKey: string;
  clarificationCategoryKey: ExecutiveAssistantClarificationCategoryKey;
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  responseDependency: typeof import("./executiveAssistantClarificationContracts.ts").ASS_CLARIFICATION_DEPENDENCY;
  declarativeOnly: true;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationCategoryRecord = Readonly<{
  categoryId: string;
  categoryKey: ExecutiveAssistantClarificationCategoryKey;
  label: string;
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationTriggerPlaceholderRecord = Readonly<{
  triggerId: string;
  triggerKey: ExecutiveAssistantClarificationTriggerPlaceholderKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantQuestionTypeMetadataRecord = Readonly<{
  questionTypeId: string;
  questionTypeKey: ExecutiveAssistantQuestionTypeMetadataKey;
  label: string;
  declarativeOnly: true;
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantAmbiguityResolutionMetadataRecord = Readonly<{
  resolutionId: string;
  resolutionKey: ExecutiveAssistantAmbiguityResolutionMetadataKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantMissingContextMetadataRecord = Readonly<{
  missingContextId: string;
  missingContextKey: ExecutiveAssistantMissingContextMetadataKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationPriorityMetadataRecord = Readonly<{
  priorityId: string;
  priorityKey: ExecutiveAssistantClarificationPriorityMetadataKey;
  label: string;
  declarativeOnly: true;
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationIntentBindingRecord = Readonly<{
  bindingId: string;
  bindingKey: ExecutiveAssistantClarificationIntentBindingKey;
  clarificationId: string;
  interpretationId: string;
  intentCategoryKey: string;
  intentRouteBindingKey: string;
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationResponseBindingRecord = Readonly<{
  bindingId: string;
  bindingKey: ExecutiveAssistantClarificationResponseBindingKey;
  clarificationId: string;
  responseId: string;
  responseCategoryKey: string;
  responseIntentBindingKey: string;
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationBindingSnapshotRecord = Readonly<{
  snapshotId: string;
  clarificationId: string;
  conversationIdRef: string;
  clarificationCategoryKey: ExecutiveAssistantClarificationCategoryKey;
  triggerKey: ExecutiveAssistantClarificationTriggerPlaceholderKey;
  questionTypeKey: ExecutiveAssistantQuestionTypeMetadataKey;
  resolutionKey: ExecutiveAssistantAmbiguityResolutionMetadataKey;
  missingContextKey: ExecutiveAssistantMissingContextMetadataKey;
  priorityKey: ExecutiveAssistantClarificationPriorityMetadataKey;
  intentBindingKey: ExecutiveAssistantClarificationIntentBindingKey;
  responseBindingKey: ExecutiveAssistantClarificationResponseBindingKey;
  recordedAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationRegistryBundle = Readonly<{
  clarificationIdentityRegistry: readonly ExecutiveAssistantClarificationIdentityRecord[];
  clarificationIdentityCount: number;
  clarificationCategoryRegistry: readonly ExecutiveAssistantClarificationCategoryRecord[];
  clarificationCategoryCount: number;
  clarificationTriggerPlaceholderRegistry: readonly ExecutiveAssistantClarificationTriggerPlaceholderRecord[];
  triggerPlaceholderCount: number;
  questionTypeMetadataRegistry: readonly ExecutiveAssistantQuestionTypeMetadataRecord[];
  questionTypeMetadataCount: number;
  ambiguityResolutionMetadataRegistry: readonly ExecutiveAssistantAmbiguityResolutionMetadataRecord[];
  ambiguityResolutionMetadataCount: number;
  missingContextMetadataRegistry: readonly ExecutiveAssistantMissingContextMetadataRecord[];
  missingContextMetadataCount: number;
  clarificationPriorityMetadataRegistry: readonly ExecutiveAssistantClarificationPriorityMetadataRecord[];
  clarificationPriorityMetadataCount: number;
  clarificationIntentBindingRegistry: readonly ExecutiveAssistantClarificationIntentBindingRecord[];
  clarificationIntentBindingCount: number;
  clarificationResponseBindingRegistry: readonly ExecutiveAssistantClarificationResponseBindingRecord[];
  clarificationResponseBindingCount: number;
  clarificationBindingSnapshotRegistry: readonly ExecutiveAssistantClarificationBindingSnapshotRecord[];
  clarificationBindingSnapshotCount: number;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./executiveAssistantClarificationContracts.ts").ASS_CLARIFICATION_PLATFORM_ID;
  version: typeof ASS_CLARIFICATION_VERSION;
  title: typeof import("./executiveAssistantClarificationContracts.ts").ASS_CLARIFICATION_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  clarificationCategoryCount: number;
  intentBindingCount: number;
  responseBindingCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationValidationReport = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantClarificationValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationLayerState = Readonly<{
  contractVersion: typeof ASS_CLARIFICATION_VERSION;
  responseDependency: typeof import("./executiveAssistantClarificationContracts.ts").ASS_CLARIFICATION_DEPENDENCY;
  initialized: boolean;
  registry: ExecutiveAssistantClarificationRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: ExecutiveAssistantClarificationLayerState | null;
  readOnly: true;
}>;
