/** ASSISTANT-3:8 — Immutable Freeze constants. */
import { AssistantIntentDialogueFreezeBaselines } from "./assistantIntentDialogueFreeze.baselines.ts";
import { AssistantIntentDialogueFreezeCompatibility } from "./assistantIntentDialogueFreeze.compatibility.ts";
import {
  AssistantIntentDialogueFreezeArchitecturalLocks,
  AssistantIntentDialogueFreezeArchitectureRegistry,
  AssistantIntentDialogueFreezeCanonicalLock,
} from "./assistantIntentDialogueFreeze.lock.ts";

export const AssistantIntentDialogueFreezeConstants = Object.freeze({
  freezeIdentifier: "ASSISTANT-3:8/IntentDialogueUnderstandingFreeze",
  namespace: "nexora.assistant.intent-dialogue.freeze",
  version: "1.0.0",
  status: "Frozen",
  readiness: "ReadyForPublicIndex",
  lockIdentifier: AssistantIntentDialogueFreezeCanonicalLock.lockIdentifier,
  baselineCount: AssistantIntentDialogueFreezeBaselines.length,
  compatibilityCount: AssistantIntentDialogueFreezeCompatibility.length,
  lockCount: AssistantIntentDialogueFreezeArchitecturalLocks.length,
  registryEntryCount:
    AssistantIntentDialogueFreezeArchitectureRegistry.length,
} as const);
