/**
 * ASS-5 — Executive Intent Interpretation Contract domain types.
 */

import type {
  ASS_AMBIGUITY_METADATA_KEYS,
  ASS_CLARIFICATION_METADATA_KEYS,
  ASS_EXECUTIVE_INTENT_CATEGORY_KEYS,
  ASS_INTENT_CONFIDENCE_LEVEL_KEYS,
  ASS_INTENT_REGISTRY_KEYS,
  ASS_INTENT_ROUTE_BINDING_KEYS,
  ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS,
  ASS_INTENT_VERSION,
} from "./executiveAssistantIntentContracts.ts";

export type ExecutiveAssistantIntentCategoryKey = (typeof ASS_EXECUTIVE_INTENT_CATEGORY_KEYS)[number];
export type ExecutiveAssistantIntentSignalPlaceholderKey = (typeof ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS)[number];
export type ExecutiveAssistantAmbiguityMetadataKey = (typeof ASS_AMBIGUITY_METADATA_KEYS)[number];
export type ExecutiveAssistantClarificationMetadataKey = (typeof ASS_CLARIFICATION_METADATA_KEYS)[number];
export type ExecutiveAssistantIntentConfidenceLevelKey = (typeof ASS_INTENT_CONFIDENCE_LEVEL_KEYS)[number];
export type ExecutiveAssistantIntentRouteBindingKey = (typeof ASS_INTENT_ROUTE_BINDING_KEYS)[number];
export type ExecutiveAssistantIntentRegistryKey = (typeof ASS_INTENT_REGISTRY_KEYS)[number];

export type ExecutiveAssistantIntentInterpretationIdentityRecord = Readonly<{
  interpretationId: string;
  interpretationKey: string;
  intentCategoryKey: ExecutiveAssistantIntentCategoryKey;
  contractVersion: typeof ASS_INTENT_VERSION;
  routingDependency: typeof import("./executiveAssistantIntentContracts.ts").ASS_INTENT_DEPENDENCY;
  declarativeOnly: true;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentCategoryRecord = Readonly<{
  categoryId: string;
  categoryKey: ExecutiveAssistantIntentCategoryKey;
  label: string;
  contractVersion: typeof ASS_INTENT_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentSignalPlaceholderRecord = Readonly<{
  signalId: string;
  signalKey: ExecutiveAssistantIntentSignalPlaceholderKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_INTENT_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantAmbiguityMetadataRecord = Readonly<{
  ambiguityId: string;
  ambiguityKey: ExecutiveAssistantAmbiguityMetadataKey;
  label: string;
  declarativeOnly: true;
  contractVersion: typeof ASS_INTENT_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantClarificationMetadataRecord = Readonly<{
  clarificationId: string;
  clarificationKey: ExecutiveAssistantClarificationMetadataKey;
  label: string;
  placeholderOnly: true;
  contractVersion: typeof ASS_INTENT_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentConfidenceMetadataRecord = Readonly<{
  confidenceId: string;
  confidenceKey: ExecutiveAssistantIntentConfidenceLevelKey;
  label: string;
  declarativeOnly: true;
  contractVersion: typeof ASS_INTENT_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentRouteBindingRecord = Readonly<{
  bindingId: string;
  bindingKey: ExecutiveAssistantIntentRouteBindingKey;
  interpretationId: string;
  coordinationRouteKey: string;
  scopeRoutingKey: string;
  routeCategoryKey: string;
  intentPlaceholderKey: string;
  contractVersion: typeof ASS_INTENT_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentValidationContractRecord = Readonly<{
  validationContractId: string;
  validationKey: string;
  mandatoryChecks: readonly string[];
  contractVersion: typeof ASS_INTENT_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentBindingSnapshotRecord = Readonly<{
  snapshotId: string;
  interpretationId: string;
  conversationIdRef: string;
  intentCategoryKey: ExecutiveAssistantIntentCategoryKey;
  signalKey: ExecutiveAssistantIntentSignalPlaceholderKey;
  ambiguityKey: ExecutiveAssistantAmbiguityMetadataKey;
  clarificationKey: ExecutiveAssistantClarificationMetadataKey;
  confidenceKey: ExecutiveAssistantIntentConfidenceLevelKey;
  routeBindingKey: ExecutiveAssistantIntentRouteBindingKey;
  recordedAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentRegistryBundle = Readonly<{
  intentInterpretationIdentityRegistry: readonly ExecutiveAssistantIntentInterpretationIdentityRecord[];
  interpretationIdentityCount: number;
  executiveIntentCategoryRegistry: readonly ExecutiveAssistantIntentCategoryRecord[];
  intentCategoryCount: number;
  intentSignalPlaceholderRegistry: readonly ExecutiveAssistantIntentSignalPlaceholderRecord[];
  signalPlaceholderCount: number;
  ambiguityMetadataRegistry: readonly ExecutiveAssistantAmbiguityMetadataRecord[];
  ambiguityMetadataCount: number;
  clarificationMetadataRegistry: readonly ExecutiveAssistantClarificationMetadataRecord[];
  clarificationMetadataCount: number;
  intentConfidenceMetadataRegistry: readonly ExecutiveAssistantIntentConfidenceMetadataRecord[];
  intentConfidenceMetadataCount: number;
  intentRouteBindingRegistry: readonly ExecutiveAssistantIntentRouteBindingRecord[];
  intentRouteBindingCount: number;
  intentValidationContractRegistry: readonly ExecutiveAssistantIntentValidationContractRecord[];
  intentValidationContractCount: number;
  intentBindingSnapshotRegistry: readonly ExecutiveAssistantIntentBindingSnapshotRecord[];
  intentBindingSnapshotCount: number;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./executiveAssistantIntentContracts.ts").ASS_INTENT_PLATFORM_ID;
  version: typeof ASS_INTENT_VERSION;
  title: typeof import("./executiveAssistantIntentContracts.ts").ASS_INTENT_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  intentCategoryCount: number;
  routeBindingCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantIntentValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentValidationReport = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantIntentValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveAssistantIntentLayerState = Readonly<{
  contractVersion: typeof ASS_INTENT_VERSION;
  routingDependency: typeof import("./executiveAssistantIntentContracts.ts").ASS_INTENT_DEPENDENCY;
  initialized: boolean;
  registry: ExecutiveAssistantIntentRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntentBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: ExecutiveAssistantIntentLayerState | null;
  readOnly: true;
}>;
