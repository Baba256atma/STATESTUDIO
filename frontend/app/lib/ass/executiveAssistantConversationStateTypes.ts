/**
 * ASS-3 — Executive Conversation State Architecture domain types.
 */

import type {
  ASS_COMPLETION_STATE_KEYS,
  ASS_CONVERSATION_STATE_REGISTRY_KEYS,
  ASS_CONVERSATION_STATE_VERSION,
  ASS_FAILURE_METADATA_CODES,
  ASS_INTERACTION_STATE_KEYS,
  ASS_LIFECYCLE_STATE_KEYS,
  ASS_PAUSE_RESUME_STATE_KEYS,
  ASS_SESSION_STATE_KEYS,
  ASS_STATE_CATEGORY_KEYS,
  ASS_TURN_STATE_KEYS,
  ASS_WAITING_STATE_KEYS,
} from "./executiveAssistantConversationStateContracts.ts";

export type ExecutiveAssistantLifecycleStateKey = (typeof ASS_LIFECYCLE_STATE_KEYS)[number];
export type ExecutiveAssistantSessionStateKey = (typeof ASS_SESSION_STATE_KEYS)[number];
export type ExecutiveAssistantTurnStateKey = (typeof ASS_TURN_STATE_KEYS)[number];
export type ExecutiveAssistantInteractionStateKey = (typeof ASS_INTERACTION_STATE_KEYS)[number];
export type ExecutiveAssistantWaitingStateKey = (typeof ASS_WAITING_STATE_KEYS)[number];
export type ExecutiveAssistantCompletionStateKey = (typeof ASS_COMPLETION_STATE_KEYS)[number];
export type ExecutiveAssistantPauseResumeStateKey = (typeof ASS_PAUSE_RESUME_STATE_KEYS)[number];
export type ExecutiveAssistantStateCategoryKey = (typeof ASS_STATE_CATEGORY_KEYS)[number];
export type ExecutiveAssistantFailureMetadataCode = (typeof ASS_FAILURE_METADATA_CODES)[number];
export type ExecutiveAssistantConversationStateRegistryKey = (typeof ASS_CONVERSATION_STATE_REGISTRY_KEYS)[number];

export type ExecutiveAssistantStateDefinitionRecord = Readonly<{
  stateId: string;
  stateKey: string;
  stateCategory: ExecutiveAssistantStateCategoryKey;
  label: string;
  contractVersion: typeof ASS_CONVERSATION_STATE_VERSION;
  conversationDependency: typeof import("./executiveAssistantConversationStateContracts.ts").ASS_CONVERSATION_STATE_DEPENDENCY;
  terminal: boolean;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantTransitionContractRecord = Readonly<{
  transitionId: string;
  transitionKey: string;
  stateCategory: ExecutiveAssistantStateCategoryKey;
  fromStateKey: string;
  toStateKey: string;
  declarativeOnly: true;
  contractVersion: typeof ASS_CONVERSATION_STATE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantFailureMetadataRecord = Readonly<{
  failureMetadataId: string;
  failureCode: ExecutiveAssistantFailureMetadataCode;
  reasonRef: string;
  recoverable: boolean;
  retryEligible: boolean;
  contractVersion: typeof ASS_CONVERSATION_STATE_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantStateSnapshotRecord = Readonly<{
  snapshotId: string;
  conversationIdRef: string;
  lifecycleStateKey: ExecutiveAssistantLifecycleStateKey;
  sessionStateKey: ExecutiveAssistantSessionStateKey;
  turnStateKey: ExecutiveAssistantTurnStateKey;
  interactionStateKey: ExecutiveAssistantInteractionStateKey;
  waitingStateKey: ExecutiveAssistantWaitingStateKey | null;
  completionStateKey: ExecutiveAssistantCompletionStateKey | null;
  pauseResumeStateKey: ExecutiveAssistantPauseResumeStateKey | null;
  failureMetadataRef: string | null;
  recordedAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationStateRegistryBundle = Readonly<{
  lifecycleStateRegistry: readonly ExecutiveAssistantStateDefinitionRecord[];
  lifecycleStateCount: number;
  sessionStateRegistry: readonly ExecutiveAssistantStateDefinitionRecord[];
  sessionStateCount: number;
  turnStateRegistry: readonly ExecutiveAssistantStateDefinitionRecord[];
  turnStateCount: number;
  interactionStateRegistry: readonly ExecutiveAssistantStateDefinitionRecord[];
  interactionStateCount: number;
  waitingStateRegistry: readonly ExecutiveAssistantStateDefinitionRecord[];
  waitingStateCount: number;
  completionStateRegistry: readonly ExecutiveAssistantStateDefinitionRecord[];
  completionStateCount: number;
  pauseResumeStateRegistry: readonly ExecutiveAssistantStateDefinitionRecord[];
  pauseResumeStateCount: number;
  failureMetadataRegistry: readonly ExecutiveAssistantFailureMetadataRecord[];
  failureMetadataCount: number;
  transitionContractRegistry: readonly ExecutiveAssistantTransitionContractRecord[];
  transitionCount: number;
  stateSnapshotRegistry: readonly ExecutiveAssistantStateSnapshotRecord[];
  snapshotCount: number;
  readOnly: true;
}>;

export type ExecutiveAssistantTransitionMatrixEntry = Readonly<{
  stateCategory: ExecutiveAssistantStateCategoryKey;
  fromStateKey: string;
  toStateKey: string;
  transitionKey: string;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationStateManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./executiveAssistantConversationStateContracts.ts").ASS_CONVERSATION_STATE_PLATFORM_ID;
  version: typeof ASS_CONVERSATION_STATE_VERSION;
  title: typeof import("./executiveAssistantConversationStateContracts.ts").ASS_CONVERSATION_STATE_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  transitionCount: number;
  lifecycleStateCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantConversationStateValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationStateValidationReport = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantConversationStateValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveAssistantConversationStateLayerState = Readonly<{
  contractVersion: typeof ASS_CONVERSATION_STATE_VERSION;
  conversationDependency: typeof import("./executiveAssistantConversationStateContracts.ts").ASS_CONVERSATION_STATE_DEPENDENCY;
  initialized: boolean;
  registry: ExecutiveAssistantConversationStateRegistryBundle;
  transitionMatrix: readonly ExecutiveAssistantTransitionMatrixEntry[];
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationStateBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: ExecutiveAssistantConversationStateLayerState | null;
  readOnly: true;
}>;
