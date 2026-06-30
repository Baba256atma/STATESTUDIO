/**
 * ASS-6 — Executive Response Contract Architecture domain types.
 */

import type {
  ASS_ACTION_SUGGESTION_METADATA_KEYS,
  ASS_EXPLANATION_METADATA_KEYS,
  ASS_FOLLOW_UP_METADATA_KEYS,
  ASS_RESPONSE_CATEGORY_KEYS,
  ASS_RESPONSE_REGISTRY_KEYS,
  ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS,
  ASS_RESPONSE_VERSION,
  ASS_TONE_STYLE_METADATA_KEYS,
} from "./executiveAssistantResponseContracts.ts";

export type ExecutiveAssistantResponseCategoryKey = (typeof ASS_RESPONSE_CATEGORY_KEYS)[number];
export type ExecutiveAssistantResponseStructurePlaceholderKey = (typeof ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS)[number];
export type ExecutiveAssistantToneStyleMetadataKey = (typeof ASS_TONE_STYLE_METADATA_KEYS)[number];
export type ExecutiveAssistantExplanationMetadataKey = (typeof ASS_EXPLANATION_METADATA_KEYS)[number];
export type ExecutiveAssistantFollowUpMetadataKey = (typeof ASS_FOLLOW_UP_METADATA_KEYS)[number];
export type ExecutiveAssistantActionSuggestionMetadataKey = (typeof ASS_ACTION_SUGGESTION_METADATA_KEYS)[number];
export type ExecutiveAssistantResponseIntentBindingKey =
  (typeof import("./executiveAssistantResponseContracts.ts").ASS_RESPONSE_INTENT_BINDING_KEYS)[number];
export type ExecutiveAssistantResponseRegistryKey = (typeof ASS_RESPONSE_REGISTRY_KEYS)[number];

export type ExecutiveAssistantResponseIdentityRecord = Readonly<{
  responseId: string;
  responseKey: string;
  responseCategoryKey: ExecutiveAssistantResponseCategoryKey;
  contractVersion: typeof ASS_RESPONSE_VERSION;
  intentDependency: typeof import("./executiveAssistantResponseContracts.ts").ASS_RESPONSE_DEPENDENCY;
  declarativeOnly: true;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantResponseCategoryRecord = Readonly<{
  categoryId: string;
  categoryKey: ExecutiveAssistantResponseCategoryKey;
  label: string;
  contractVersion: typeof ASS_RESPONSE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantResponseStructurePlaceholderRecord = Readonly<{
  structureId: string;
  structureKey: ExecutiveAssistantResponseStructurePlaceholderKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_RESPONSE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantToneStyleMetadataRecord = Readonly<{
  toneStyleId: string;
  toneStyleKey: ExecutiveAssistantToneStyleMetadataKey;
  label: string;
  declarativeOnly: true;
  contractVersion: typeof ASS_RESPONSE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantExplanationMetadataRecord = Readonly<{
  explanationId: string;
  explanationKey: ExecutiveAssistantExplanationMetadataKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_RESPONSE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantFollowUpMetadataRecord = Readonly<{
  followUpId: string;
  followUpKey: ExecutiveAssistantFollowUpMetadataKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_RESPONSE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantActionSuggestionMetadataRecord = Readonly<{
  actionSuggestionId: string;
  actionSuggestionKey: ExecutiveAssistantActionSuggestionMetadataKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_RESPONSE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantResponseIntentBindingRecord = Readonly<{
  bindingId: string;
  bindingKey: ExecutiveAssistantResponseIntentBindingKey;
  responseId: string;
  interpretationId: string;
  intentCategoryKey: string;
  intentRouteBindingKey: string;
  contractVersion: typeof ASS_RESPONSE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantResponseValidationContractRecord = Readonly<{
  validationContractId: string;
  validationKey: string;
  mandatoryChecks: readonly string[];
  contractVersion: typeof ASS_RESPONSE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantResponseBindingSnapshotRecord = Readonly<{
  snapshotId: string;
  responseId: string;
  conversationIdRef: string;
  responseCategoryKey: ExecutiveAssistantResponseCategoryKey;
  structureKey: ExecutiveAssistantResponseStructurePlaceholderKey;
  toneStyleKey: ExecutiveAssistantToneStyleMetadataKey;
  explanationKey: ExecutiveAssistantExplanationMetadataKey;
  followUpKey: ExecutiveAssistantFollowUpMetadataKey;
  actionSuggestionKey: ExecutiveAssistantActionSuggestionMetadataKey;
  intentBindingKey: ExecutiveAssistantResponseIntentBindingKey;
  recordedAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantResponseRegistryBundle = Readonly<{
  responseIdentityRegistry: readonly ExecutiveAssistantResponseIdentityRecord[];
  responseIdentityCount: number;
  responseCategoryRegistry: readonly ExecutiveAssistantResponseCategoryRecord[];
  responseCategoryCount: number;
  responseStructurePlaceholderRegistry: readonly ExecutiveAssistantResponseStructurePlaceholderRecord[];
  structurePlaceholderCount: number;
  toneStyleMetadataRegistry: readonly ExecutiveAssistantToneStyleMetadataRecord[];
  toneStyleMetadataCount: number;
  explanationMetadataRegistry: readonly ExecutiveAssistantExplanationMetadataRecord[];
  explanationMetadataCount: number;
  followUpMetadataRegistry: readonly ExecutiveAssistantFollowUpMetadataRecord[];
  followUpMetadataCount: number;
  actionSuggestionMetadataRegistry: readonly ExecutiveAssistantActionSuggestionMetadataRecord[];
  actionSuggestionMetadataCount: number;
  responseIntentBindingRegistry: readonly ExecutiveAssistantResponseIntentBindingRecord[];
  responseIntentBindingCount: number;
  responseValidationContractRegistry: readonly ExecutiveAssistantResponseValidationContractRecord[];
  responseValidationContractCount: number;
  responseBindingSnapshotRegistry: readonly ExecutiveAssistantResponseBindingSnapshotRecord[];
  responseBindingSnapshotCount: number;
  readOnly: true;
}>;

export type ExecutiveAssistantResponseManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./executiveAssistantResponseContracts.ts").ASS_RESPONSE_PLATFORM_ID;
  version: typeof ASS_RESPONSE_VERSION;
  title: typeof import("./executiveAssistantResponseContracts.ts").ASS_RESPONSE_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  responseCategoryCount: number;
  intentBindingCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantResponseValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveAssistantResponseValidationReport = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantResponseValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveAssistantResponseLayerState = Readonly<{
  contractVersion: typeof ASS_RESPONSE_VERSION;
  intentDependency: typeof import("./executiveAssistantResponseContracts.ts").ASS_RESPONSE_DEPENDENCY;
  initialized: boolean;
  registry: ExecutiveAssistantResponseRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantResponseBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: ExecutiveAssistantResponseLayerState | null;
  readOnly: true;
}>;
