/**
 * ASS-2 — Conversation identity, session, message, turn, role, and scope binding registries.
 */

import { ASS_CONVERSATION_SCOPE_KEYS } from "./executiveAssistantPlatformContracts.ts";
import { buildExecutiveAssistantPlatformFoundation } from "./executiveAssistantPlatformExports.ts";
import type { ExecutiveAssistantConversationScopeKey } from "./executiveAssistantPlatformTypes.ts";
import {
  ASS_CONVERSATION_CONTRACT_VERSION,
  ASS_CONVERSATION_FOUNDATION_DEPENDENCY,
  ASS_MESSAGE_KIND_KEYS,
  ASS_PARTICIPANT_ROLE_KEYS,
  ASS_PARTICIPANT_ROLE_LABELS,
} from "./executiveAssistantConversationContracts.ts";
import type {
  ExecutiveAssistantConversationIdentityInput,
  ExecutiveAssistantConversationIdentityRecord,
  ExecutiveAssistantMessageContractRecord,
  ExecutiveAssistantMessageKindKey,
  ExecutiveAssistantParticipantRoleKey,
  ExecutiveAssistantParticipantRoleRecord,
  ExecutiveAssistantRegistrationResult,
  ExecutiveAssistantConversationRegistryBundle,
  ExecutiveAssistantScopeBindingRecord,
  ExecutiveAssistantSessionContractRecord,
  ExecutiveAssistantSessionStatusKey,
  ExecutiveAssistantTurnContractRecord,
  ExecutiveAssistantTurnStatusKey,
} from "./executiveAssistantConversationTypes.ts";

const identityRegistry = new Map<string, ExecutiveAssistantConversationIdentityRecord>();
const sessionRegistry = new Map<string, ExecutiveAssistantSessionContractRecord>();
const messageRegistry = new Map<string, ExecutiveAssistantMessageContractRecord>();
const turnRegistry = new Map<string, ExecutiveAssistantTurnContractRecord>();
const roleRegistry = new Map<string, ExecutiveAssistantParticipantRoleRecord>();
const scopeBindingRegistry = new Map<string, ExecutiveAssistantScopeBindingRecord>();

function result<T>(success: boolean, reason: string, record: T | null): ExecutiveAssistantRegistrationResult<T> {
  return Object.freeze({ success, reason, record, readOnly: true as const });
}

export function createStableConversationId(seed: string): string {
  return `ass-conversation-${seed}`;
}

export function createStableSessionId(conversationId: string): string {
  return `ass-session-${conversationId}`;
}

export function createStableTurnId(sessionId: string, turnIndex: number): string {
  return `ass-turn-${sessionId}-${turnIndex}`;
}

export function createStableMessageId(turnId: string, messageKind: string): string {
  return `ass-message-${turnId}-${messageKind}`;
}

export function createStableScopeBindingId(conversationId: string): string {
  return `ass-scope-binding-${conversationId}`;
}

export function buildExecutiveAssistantConversationIdentityRecord(
  input: ExecutiveAssistantConversationIdentityInput,
  timestamp: string
): ExecutiveAssistantConversationIdentityRecord {
  return Object.freeze({
    conversationId: input.conversationId,
    contractVersion: ASS_CONVERSATION_CONTRACT_VERSION,
    foundationVersion: ASS_CONVERSATION_FOUNDATION_DEPENDENCY,
    scopeKey: input.scopeKey,
    participantRoleKeys: Object.freeze(
      (input.participantRoleKeys ?? ["executive", "assistant"]) as readonly ExecutiveAssistantParticipantRoleKey[]
    ),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function isExecutiveAssistantConversationIdentityImmutable(
  record: ExecutiveAssistantConversationIdentityRecord
): boolean {
  return Object.isFrozen(record);
}

export function isExecutiveAssistantMessageContractImmutable(
  record: ExecutiveAssistantMessageContractRecord
): boolean {
  return Object.isFrozen(record);
}

export function isExecutiveAssistantTurnContractImmutable(record: ExecutiveAssistantTurnContractRecord): boolean {
  return Object.isFrozen(record);
}

export function resetExecutiveAssistantConversationStoreForTests(): void {
  identityRegistry.clear();
  sessionRegistry.clear();
  messageRegistry.clear();
  turnRegistry.clear();
  roleRegistry.clear();
  scopeBindingRegistry.clear();
}

function seedDefaultParticipantRoles(timestamp: string): void {
  for (const roleKey of ASS_PARTICIPANT_ROLE_KEYS) {
    const roleId = `ass-participant-role-${roleKey}`;
    if (roleRegistry.has(roleId)) {
      continue;
    }
    roleRegistry.set(
      roleId,
      Object.freeze({
        roleId,
        roleKey,
        label: ASS_PARTICIPANT_ROLE_LABELS[roleKey],
        registeredAt: timestamp,
        readOnly: true as const,
      })
    );
  }
}

export function getExecutiveAssistantConversationRegistryBundle(): ExecutiveAssistantConversationRegistryBundle {
  const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
    Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

  const identities = sortByKey([...identityRegistry.values()], (entry) => entry.conversationId);
  const sessions = sortByKey([...sessionRegistry.values()], (entry) => entry.sessionId);
  const messages = sortByKey([...messageRegistry.values()], (entry) => entry.messageId);
  const turns = sortByKey([...turnRegistry.values()], (entry) => entry.turnId);
  const roles = sortByKey([...roleRegistry.values()], (entry) => entry.roleId);
  const bindings = sortByKey([...scopeBindingRegistry.values()], (entry) => entry.bindingId);

  return Object.freeze({
    conversationIdentityRegistry: identities,
    identityCount: identities.length,
    sessionContractRegistry: sessions,
    sessionCount: sessions.length,
    messageContractRegistry: messages,
    messageCount: messages.length,
    turnContractRegistry: turns,
    turnCount: turns.length,
    participantRoleRegistry: roles,
    roleCount: roles.length,
    scopeBindingRegistry: bindings,
    scopeBindingCount: bindings.length,
    readOnly: true as const,
  });
}

export function getExecutiveAssistantConversationRegistry(): ExecutiveAssistantConversationRegistryBundle {
  return getExecutiveAssistantConversationRegistryBundle();
}

export function registerExecutiveAssistantConversationIdentity(
  input: ExecutiveAssistantConversationIdentityInput,
  timestamp: string
): ExecutiveAssistantRegistrationResult<ExecutiveAssistantConversationIdentityRecord> {
  if (identityRegistry.has(input.conversationId)) {
    return result(false, "Duplicate conversation identity.", null);
  }
  if (!(ASS_CONVERSATION_SCOPE_KEYS as readonly string[]).includes(input.scopeKey)) {
    return result(false, "Invalid conversation scope key.", null);
  }
  const record = buildExecutiveAssistantConversationIdentityRecord(input, timestamp);
  identityRegistry.set(record.conversationId, record);
  return result(true, "Conversation identity registered.", record);
}

export function registerExecutiveAssistantSessionContract(
  sessionId: string,
  conversationId: string,
  sessionStatus: ExecutiveAssistantSessionStatusKey,
  scopeBindingRef: string,
  timestamp: string
): ExecutiveAssistantRegistrationResult<ExecutiveAssistantSessionContractRecord> {
  if (sessionRegistry.has(sessionId)) {
    return result(false, "Duplicate session contract.", null);
  }
  if (!identityRegistry.has(conversationId)) {
    return result(false, "Unknown conversation identity.", null);
  }
  const record = Object.freeze({
    sessionId,
    conversationId,
    sessionStatus,
    scopeBindingRef,
    startedAt: timestamp,
    readOnly: true as const,
  });
  sessionRegistry.set(sessionId, record);
  return result(true, "Session contract registered.", record);
}

export function registerExecutiveAssistantTurnContract(
  turnId: string,
  sessionId: string,
  turnIndex: number,
  turnStatus: ExecutiveAssistantTurnStatusKey,
  intentMetadata: Readonly<Record<string, string>>,
  responseMetadata: Readonly<Record<string, string>>,
  routingMetadata: Readonly<Record<string, string>>,
  timestamp: string
): ExecutiveAssistantRegistrationResult<ExecutiveAssistantTurnContractRecord> {
  if (turnRegistry.has(turnId)) {
    return result(false, "Duplicate turn contract.", null);
  }
  if (!sessionRegistry.has(sessionId)) {
    return result(false, "Unknown session contract.", null);
  }
  const record = Object.freeze({
    turnId,
    sessionId,
    turnIndex,
    turnStatus,
    intentMetadata: Object.freeze(intentMetadata),
    responseMetadata: Object.freeze(responseMetadata),
    routingMetadata: Object.freeze(routingMetadata),
    createdAt: timestamp,
    readOnly: true as const,
  });
  turnRegistry.set(turnId, record);
  return result(true, "Turn contract registered.", record);
}

export function registerExecutiveAssistantMessageContract(
  messageId: string,
  sessionId: string,
  turnId: string,
  messageKind: ExecutiveAssistantMessageKindKey,
  participantRole: ExecutiveAssistantParticipantRoleKey,
  contentRef: string,
  timestamp: string
): ExecutiveAssistantRegistrationResult<ExecutiveAssistantMessageContractRecord> {
  if (messageRegistry.has(messageId)) {
    return result(false, "Duplicate message contract.", null);
  }
  if (!(ASS_MESSAGE_KIND_KEYS as readonly string[]).includes(messageKind)) {
    return result(false, "Invalid message kind.", null);
  }
  if (!(ASS_PARTICIPANT_ROLE_KEYS as readonly string[]).includes(participantRole)) {
    return result(false, "Invalid participant role.", null);
  }
  if (!turnRegistry.has(turnId)) {
    return result(false, "Unknown turn contract.", null);
  }
  const record = Object.freeze({
    messageId,
    sessionId,
    turnId,
    messageKind,
    participantRole,
    contentRef,
    createdAt: timestamp,
    readOnly: true as const,
  });
  messageRegistry.set(messageId, record);
  return result(true, "Message contract registered.", record);
}

export function registerExecutiveAssistantScopeBinding(
  bindingId: string,
  conversationId: string,
  scopeKey: ExecutiveAssistantConversationScopeKey,
  scopeRef: string,
  timestamp: string
): ExecutiveAssistantRegistrationResult<ExecutiveAssistantScopeBindingRecord> {
  if (scopeBindingRegistry.has(bindingId)) {
    return result(false, "Duplicate scope binding.", null);
  }
  if (!(ASS_CONVERSATION_SCOPE_KEYS as readonly string[]).includes(scopeKey)) {
    return result(false, "Invalid scope key.", null);
  }
  const record = Object.freeze({
    bindingId,
    conversationId,
    scopeKey,
    scopeRef,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  scopeBindingRegistry.set(bindingId, record);
  return result(true, "Scope binding registered.", record);
}

const TEMPLATE_CONVERSATION_ID = "ass-conversation-template";
const TEMPLATE_SESSION_ID = "ass-session-ass-conversation-template";
const TEMPLATE_TURN_ID = "ass-turn-ass-session-ass-conversation-template-0";
const TEMPLATE_BINDING_ID = "ass-scope-binding-ass-conversation-template";

function seedTemplateConversationContracts(timestamp: string): void {
  if (identityRegistry.has(TEMPLATE_CONVERSATION_ID)) {
    return;
  }
  registerExecutiveAssistantConversationIdentity(
    {
      conversationId: TEMPLATE_CONVERSATION_ID,
      scopeKey: "executive",
      participantRoleKeys: ["executive", "assistant", "system"],
    },
    timestamp
  );
  registerExecutiveAssistantScopeBinding(
    TEMPLATE_BINDING_ID,
    TEMPLATE_CONVERSATION_ID,
    "executive",
    "scope-ref-template",
    timestamp
  );
  registerExecutiveAssistantSessionContract(
    TEMPLATE_SESSION_ID,
    TEMPLATE_CONVERSATION_ID,
    "draft",
    TEMPLATE_BINDING_ID,
    timestamp
  );
  registerExecutiveAssistantTurnContract(
    TEMPLATE_TURN_ID,
    TEMPLATE_SESSION_ID,
    0,
    "placeholder",
    Object.freeze({ intentPlaceholder: "pending" }),
    Object.freeze({ responsePlaceholder: "pending" }),
    Object.freeze({ routingPlaceholder: "pending" }),
    timestamp
  );
  registerExecutiveAssistantMessageContract(
    createStableMessageId(TEMPLATE_TURN_ID, "user_input"),
    TEMPLATE_SESSION_ID,
    TEMPLATE_TURN_ID,
    "user_input",
    "executive",
    "content-ref-template-input",
    timestamp
  );
  registerExecutiveAssistantMessageContract(
    createStableMessageId(TEMPLATE_TURN_ID, "assistant_output"),
    TEMPLATE_SESSION_ID,
    TEMPLATE_TURN_ID,
    "assistant_output",
    "assistant",
    "content-ref-template-output",
    timestamp
  );
}

export function seedExecutiveAssistantConversationRegistries(timestamp: string): void {
  seedDefaultParticipantRoles(timestamp);
  seedTemplateConversationContracts(timestamp);
}

export function ensureExecutiveAssistantConversationDependenciesReady(timestamp: string): boolean {
  const foundation = buildExecutiveAssistantPlatformFoundation(timestamp);
  return foundation.success;
}

export function isExecutiveAssistantConversationScopeKey(value: string): value is ExecutiveAssistantConversationScopeKey {
  return (ASS_CONVERSATION_SCOPE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveAssistantParticipantRoleKey(value: string): value is ExecutiveAssistantParticipantRoleKey {
  return (ASS_PARTICIPANT_ROLE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveAssistantMessageKindKey(value: string): value is ExecutiveAssistantMessageKindKey {
  return (ASS_MESSAGE_KIND_KEYS as readonly string[]).includes(value);
}
