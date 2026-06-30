/**
 * ASS-2 — Executive Conversation Contract domain types.
 */

import type {
  ASS_CONVERSATION_CONTRACT_VERSION,
  ASS_CONVERSATION_REGISTRY_KEYS,
  ASS_MESSAGE_KIND_KEYS,
  ASS_PARTICIPANT_ROLE_KEYS,
  ASS_SESSION_STATUS_KEYS,
  ASS_TURN_STATUS_KEYS,
} from "./executiveAssistantConversationContracts.ts";
import type { ExecutiveAssistantConversationScopeKey } from "./executiveAssistantPlatformTypes.ts";

export type ExecutiveAssistantParticipantRoleKey = (typeof ASS_PARTICIPANT_ROLE_KEYS)[number];
export type ExecutiveAssistantMessageKindKey = (typeof ASS_MESSAGE_KIND_KEYS)[number];
export type ExecutiveAssistantTurnStatusKey = (typeof ASS_TURN_STATUS_KEYS)[number];
export type ExecutiveAssistantSessionStatusKey = (typeof ASS_SESSION_STATUS_KEYS)[number];
export type ExecutiveAssistantConversationRegistryKey = (typeof ASS_CONVERSATION_REGISTRY_KEYS)[number];

export type ExecutiveAssistantConversationIdentityRecord = Readonly<{
  conversationId: string;
  contractVersion: typeof ASS_CONVERSATION_CONTRACT_VERSION;
  foundationVersion: typeof import("./executiveAssistantConversationContracts.ts").ASS_CONVERSATION_FOUNDATION_DEPENDENCY;
  scopeKey: ExecutiveAssistantConversationScopeKey;
  participantRoleKeys: readonly ExecutiveAssistantParticipantRoleKey[];
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantSessionContractRecord = Readonly<{
  sessionId: string;
  conversationId: string;
  sessionStatus: ExecutiveAssistantSessionStatusKey;
  scopeBindingRef: string;
  startedAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantMessageContractRecord = Readonly<{
  messageId: string;
  sessionId: string;
  turnId: string;
  messageKind: ExecutiveAssistantMessageKindKey;
  participantRole: ExecutiveAssistantParticipantRoleKey;
  contentRef: string;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantTurnContractRecord = Readonly<{
  turnId: string;
  sessionId: string;
  turnIndex: number;
  turnStatus: ExecutiveAssistantTurnStatusKey;
  intentMetadata: Readonly<Record<string, string>>;
  responseMetadata: Readonly<Record<string, string>>;
  routingMetadata: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantParticipantRoleRecord = Readonly<{
  roleId: string;
  roleKey: ExecutiveAssistantParticipantRoleKey;
  label: string;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantScopeBindingRecord = Readonly<{
  bindingId: string;
  conversationId: string;
  scopeKey: ExecutiveAssistantConversationScopeKey;
  scopeRef: string;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationRegistryBundle = Readonly<{
  conversationIdentityRegistry: readonly ExecutiveAssistantConversationIdentityRecord[];
  identityCount: number;
  sessionContractRegistry: readonly ExecutiveAssistantSessionContractRecord[];
  sessionCount: number;
  messageContractRegistry: readonly ExecutiveAssistantMessageContractRecord[];
  messageCount: number;
  turnContractRegistry: readonly ExecutiveAssistantTurnContractRecord[];
  turnCount: number;
  participantRoleRegistry: readonly ExecutiveAssistantParticipantRoleRecord[];
  roleCount: number;
  scopeBindingRegistry: readonly ExecutiveAssistantScopeBindingRecord[];
  scopeBindingCount: number;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./executiveAssistantConversationContracts.ts").ASS_CONVERSATION_PLATFORM_ID;
  version: typeof ASS_CONVERSATION_CONTRACT_VERSION;
  title: typeof import("./executiveAssistantConversationContracts.ts").ASS_CONVERSATION_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  roleCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantConversationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationValidationReport = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantConversationValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveAssistantConversationLayerState = Readonly<{
  contractVersion: typeof ASS_CONVERSATION_CONTRACT_VERSION;
  foundationDependency: typeof import("./executiveAssistantConversationContracts.ts").ASS_CONVERSATION_FOUNDATION_DEPENDENCY;
  initialized: boolean;
  registry: ExecutiveAssistantConversationRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: ExecutiveAssistantConversationLayerState | null;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationIdentityInput = Readonly<{
  conversationId: string;
  scopeKey: ExecutiveAssistantConversationScopeKey;
  participantRoleKeys?: readonly ExecutiveAssistantParticipantRoleKey[];
}>;

export type ExecutiveAssistantRegistrationResult<T> = Readonly<{
  success: boolean;
  reason: string;
  record: T | null;
  readOnly: true;
}>;
