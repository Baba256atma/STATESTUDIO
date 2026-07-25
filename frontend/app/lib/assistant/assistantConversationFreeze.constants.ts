/** ASSISTANT-1:8 — Immutable Freeze constants. */
import { AssistantConversationFreezeBaselines } from "./assistantConversationFreeze.baselines.ts";
import { AssistantConversationFreezeCompatibility } from "./assistantConversationFreeze.compatibility.ts";
import {
  AssistantConversationFreezeArchitecturalLocks,
  AssistantConversationFreezeArchitectureRegistry,
  AssistantConversationFreezeCanonicalLock,
} from "./assistantConversationFreeze.lock.ts";

export const AssistantConversationFreezeConstants = Object.freeze({
  freezeIdentifier: "ASSISTANT-1:8/ConversationFreeze",
  namespace: "nexora.assistant.conversation.freeze",
  version: "1.0.0",
  status: "Frozen",
  readiness: "ReadyForPublicIndex",
  lockIdentifier: AssistantConversationFreezeCanonicalLock.lockIdentifier,
  baselineCount: AssistantConversationFreezeBaselines.length,
  compatibilityCount: AssistantConversationFreezeCompatibility.length,
  lockCount: AssistantConversationFreezeArchitecturalLocks.length,
  registryEntryCount: AssistantConversationFreezeArchitectureRegistry.length,
} as const);
