/** ASSISTANT-3:6 — Immutable Platform constants and derived counts. */
import { AssistantIntentDialoguePlatformCapabilities } from "./assistantIntentDialoguePlatform.capabilities.ts";
import { AssistantIntentDialoguePlatformCompatibility } from "./assistantIntentDialoguePlatform.compatibility.ts";
import { AssistantIntentDialoguePlatformGuarantees } from "./assistantIntentDialoguePlatform.guarantees.ts";

export const AssistantIntentDialoguePlatformConstants = Object.freeze({
  platformIdentifier: "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform",
  namespace: "nexora.assistant.intent-dialogue.platform",
  version: "1.0.0",
  status: "Platform",
  readiness: "ReadyForCertification",
  capabilityCount: AssistantIntentDialoguePlatformCapabilities.length,
  guaranteeCount: AssistantIntentDialoguePlatformGuarantees.length,
  compatibilityCount: AssistantIntentDialoguePlatformCompatibility.length,
} as const);
